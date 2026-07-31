# Thông tin chung:
- Sẽ triển khai trên trang admin để quản lý khách hàng.
- Gởi thông tin mong muốn, claude sẽ phân tích item cần thiết, thiết kế database,design  màn hình bằng scripter chạy trên figma để xem trước.

# Nội dung đề xuất chính
1. Cần màn hình dashboard để xem thống kê: 
  - Chart so sánh doanh thu theo từng tháng.
  - Chart so sánh số lượng hồ sơ theo từng tháng.
  - Thống kế hồ sơ đang xử lý.
  - Thống kê hồ sơ đến lượt nhắc cần tư vấn lại (thời gian 1 tuần: Từ ngày hiện tại đến 7 ngày sau)
2. Màn hình quản lý hồ sơ: Item sau
- Ngày
- Họ tên trưởng nhóm (để ghi tên của đối tác gửi hoặc trưởng nhóm đi: Được lấy từ Màn hình cài đặt chung)
- Họ tên người xin visa
- Số ĐT người xin visa
- Địa chỉ
- Nước đến: Được lấy từ Màn hình cài đặt chung
- Mục đích: Được lấy từ Màn hình cài đặt chung
- Đối tác nộp: Được lấy từ  Màn hình đối tác. (Tên người đại diện (Và tên công ty)
- TỔNG THU: Lệ phí, in ảnh, hỗ trợ khác
- TỔNG CHI: Phí lãnh sự, phí đối tác/CTV, thư đi/ship đi, thư về/ship về, phí khác (dịch thuật, in ảnh, trích hoa hồng...)
- Ngày nộp
- Ngày trả kết quả
- Note

3. Màn hình tư vấn: Các item sau
- Tên
- SĐT
- Email
- Link fb
- Nước đến - mục đích
- Nội dung tư vấn

4. Màn hình đối tác (Master)
- Tên công ty, địa chỉ, tên người đại diện, SĐT người liên hệ
- Phí đối tác thu các diện visa 

5. Màn hình cài đặt chung: (Thiết kế từng phần có thể thêm, chỉnh sửa)
- Mục: Các nước đến.
- Mục: Mục đích làm visa.
- Mục: Trưởng nhóm xin visa.

Dữ liệu thực tế tham khảo excel: Quan Ly Khach Hang.xlsx (Folder:D:\01_NguyenNC\10_Claude\03_Study VS1\Vs-Landing-Page\04_Phase 2)

# Yêu cầu claude:
- Dựa vào thông tin cung cấp mục '# Nội dung đề xuất chính'. Hãy tạo excel cho người PM không biết code, nội dung xúc tích dễ hiểu.
- Đánh giá tổng thể hệ thống nếu tích hợp phase 2 này vào có vấn đề gì không?
- Kiểm tra kinh phí triển khai hiện tại có tốn khoản nào. Có phát sinh nào khác.
- Sau khi tôi confirm dữ liệu thì sẽ triển khai cho claude code thực hiện.