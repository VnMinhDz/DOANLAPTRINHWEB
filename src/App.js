// mô đun 
const { text } = require('express')
const express = require('express')
const App = express()

const fileupload = require('express-fileupload')
//Khi bạn tải tệp lên, tệp sẽ có thể truy cập được từ req.files 
//dùng post để tải 

const { recognize } = require('tesseract.js')

// Chấp nhận dữ liệu json (f test) và dữ liệu biểu mẫu phương tiện
//Chức app.use()năng này thêm một phần mềm trung gian mới vào ứng dụng. Về cơ bản, bất cứ khi nào một yêu cầu truy cập vào chương trình phụ trợ của bạn, 
//Express sẽ thực thi các chức năng mà bạn đã chuyển đến app.use()theo thứ tự
App.use(express.json())
//express.json()là một chức năng phần mềm trung gian được tích hợp sẵn trong Express bắt đầu từ v4.16.0. 
//Nó phân tích cú pháp các yêu cầu JSON đến và đưa dữ liệu đã được phân tích cú pháp vào req.body
App.use(fileupload())

// Tải công cụ chế độ xem và đặt một đường dẫn tĩnh đến nội dung
//Để sử dụng template này ta set view engine thành hbs.
// Đồng thời ta phải register các block (trong handlebarjs gọi là partial)
App.set('view engine', 'hbs')
App.set('views', `${__dirname}/views`)
//Điều này sẽ đặt thư mục chế độ xem ứng dụng của bạn thành một cái gì đó như:

//Users / adil / Project / myApp / views
App.use(express.static(`${__dirname}/public`))
//Đối rootsố chỉ định thư mục gốc mà từ đó phục vụ nội dung tĩnh. Để biết thêm thông tin về optionsđối số, 
//hãy xem express.static .
//sử dụng mã sau để cung cấp hình ảnh, tệp CSS và tệp JavaScript trong thư mục có tên public:

// đường dẫn 
App.get('/', (req, res) => res.render('index'))
//Phương thức định tuyến có nguồn gốc từ một trong các phương thức HTTP và được đính kèm với một thể hiện của expresslớp.
// Đăng tuyến đường để nắm bắt hình ảnh và hiển thị kết quả nhận dạng
// Thực chất đây là upload file dùng phương thức post 
App.post('/upload', (req, res) => {
  const { image } = req.files

  // Tiêu đề của nhật ký nhận dạng Tesseract
  //Các mã thoát khác nhau mà bạn có thể sử dụng để xuất màu cho StdOut từ Node JS
  console.log('\x1b[1m\x1b[35m', `Upload of ${image.name}`, '\x1b[0m')

  // Nhận dạng bộ đệm hình ảnh

  // Kiểm tra tất cả các mã ngôn ngữ (được sử dụng trên thông số thứ hai của nhận dạng) của Tesseract trong:
  // https://tesseract-ocr.github.io/tessdoc/Data-Files#data-files-for-version-400-november-29-2016
  recognize(image.data, 'por', { logger: d => console.log(`[${d.status}] ${Math.floor(d.progress * 100)}%`) })
    .then(({ data: { text } }) => res.render('result', { text }));

});
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5000/upload', {
    waitUntil: 'networkidle2',
  });
  await page.pdf({ path: 'web.pdf', format: 'a4' });

  await browser.close();
})();
//Hàm Math.floor()trả về số nguyên lớn nhất nhỏ hơn hoặc bằng một số nhất định
//Logger Nodejs là một cụm từ trong lập trình có nghĩa là ghi lại bất cứ những thao tác của người dùng
//Hàm then sẽ dùng 2 tham số với ý nghĩa: một callback thành công và một callback thất bại 
// Kiểm tra hình ảnh có dữ liệu bằng thao tác ghi nhật kí hiện ra cửa sổ  tính giá trị in tiến trình đọc 
// nếu đọc được thì gọi res và render trang kết quả dưới dạng text 


App.listen(5000, console.log('Ứng dụng chạy trên cổng 5000'))
