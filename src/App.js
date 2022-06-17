const express = require('express')
const App = express()

const fileupload = require('express-fileupload')
const { recognize } = require('tesseract.js')

// Chấp nhận dữ liệu json (f test) và dữ liệu biểu mẫu phương tiện
App.use(express.json())
App.use(fileupload())

// Tải công cụ chế độ xem và đặt một đường dẫn tĩnh đến nội dung
App.set('view engine', 'hbs')
App.set('views', `${__dirname}/views`)
App.use(express.static(`${__dirname}/public`))

// đường dẫn 
App.get('/', (req, res) => res.render('index'))

// Đăng tuyến đường để nắm bắt hình ảnh và hiển thị kết quả nhận dạng
App.post('/upload', (req, res) => {
  const { image } = req.files

  // Tiêu đề của nhật ký nhận dạng Tesseract
  console.log('\x1b[1m\x1b[35m', `Upload of ${image.name}`, '\x1b[0m')

  // Nhận dạng bộ đệm hình ảnh

// Kiểm tra tất cả các mã ngôn ngữ (được sử dụng trên thông số thứ hai của nhận dạng) của Tesseract trong:
// https://tesseract-ocr.github.io/tessdoc/Data-Files#data-files-for-version-400-november-29-2016
  recognize(image.data, 'por', { logger: d => console.log(`[${d.status}] ${Math.floor(d.progress * 100)}%`) })
    .then(({ data: { text } }) => res.render('result', { text }))
})

App.listen(5000, console.log('Application running on port 5000'))
