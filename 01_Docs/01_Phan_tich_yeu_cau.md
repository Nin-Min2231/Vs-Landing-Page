# 01. Tài liệu Phân tích Yêu cầu (要件定義書 – Requirement Definition)

| Mục | Nội dung |
|---|---|
| Dự án | Landing Page dịch vụ Visa đa quốc gia |
| Mục tiêu chính | Lead Generation (thu thập khách hàng tiềm năng) |
| Người phụ trách | NguyenNC |
| Ngày tạo | 2026-07-10 |
| Phiên bản | 1.0 |

## 変更履歴 (Lịch sử thay đổi)

| Ver | Ngày | Người sửa | Nội dung |
|---|---|---|---|
| 1.0 | 2026-07-10 | NguyenNC / Claude | Tạo mới |

---

## 1. Bối cảnh & Mục tiêu

### 1.1 Bối cảnh
Cần một website giới thiệu dịch vụ làm Visa (đa quốc gia: Nhật, Hàn, Đài Loan, Trung Quốc, Schengen, Mỹ, Úc...) cho khách hàng Việt Nam, vận hành bởi người không chuyên lập trình, chi phí giai đoạn đầu thấp hoặc miễn phí.

### 1.2 Mục tiêu (theo độ ưu tiên)

| # | Mục tiêu | Ưu tiên | Chỉ số đo (KPI gợi ý) |
|---|---|---|---|
| G1 | Thu thập lead qua form đăng ký tư vấn | Cao | Số form gửi/tháng |
| G2 | Tạo sự tin tưởng (đánh giá, cam kết, FAQ) | Cao | Tỷ lệ cuộn tới section review |
| G3 | Liên hệ nhanh (Zalo, Messenger, gọi điện) | Cao | Số click nút liên hệ |
| G4 | Giới thiệu dịch vụ rõ ràng, dễ hiểu | Trung bình | Time-on-page |
| G5 | Mở rộng tương lai (blog, thêm quốc gia) | Trung bình | – |

### 1.3 Đối tượng người dùng (Persona)

| Persona | Mô tả | Nhu cầu | Thiết bị chính |
|---|---|---|---|
| P1: Người đi du lịch | 25–45 tuổi, lần đầu xin visa | Nhanh, rõ giá, ít thủ tục | Mobile (70%+) |
| P2: Người đi công tác | Nhân viên công ty, cần gấp | Uy tín, xử lý nhanh, hóa đơn | PC + Mobile |
| P3: Gia đình/thăm thân | Ít rành công nghệ | Được tư vấn tận tình qua điện thoại/Zalo | Mobile |
| Admin | Chủ dịch vụ (không biết code) | Xem lead, xuất Excel, đăng bài | PC |

## 2. Phạm vi (Scope)

### 2.1 Trong phạm vi (In-scope)

| # | Hạng mục | Mô tả |
|---|---|---|
| F1 | Landing page 1 trang | Banner, dịch vụ, lợi ích, quy trình, đánh giá, FAQ, form, footer |
| F2 | Form đăng ký tư vấn | Họ tên*, SĐT*, Quốc gia (dropdown), Ghi chú → lưu Supabase |
| F3 | Liên hệ nhanh | Nút nổi: Gọi điện, Zalo, Messenger |
| F4 | Trang admin đơn giản | Xem/xuất CSV danh sách lead; thêm/sửa/xóa bài viết |
| F5 | Responsive | PC / Tablet / Mobile |
| F6 | Tài liệu thiết kế & hướng dẫn deploy | Trọn bộ trong 01_Docs |

### 2.2 Ngoài phạm vi (Out-of-scope, để mở rộng sau)

| # | Hạng mục | Ghi chú |
|---|---|---|
| O1 | Thanh toán online | Giai đoạn sau |
| O2 | Tra cứu tình trạng hồ sơ | Cần hệ thống backend lớn hơn |
| O3 | Đa ngôn ngữ (EN/JP) | Cấu trúc đã chừa sẵn, làm sau |
| O4 | SEO nâng cao / Blog đầy đủ | Phase mở rộng |

## 3. Yêu cầu chức năng (Functional Requirements)

| ID | Yêu cầu | Mô tả chi tiết | Ưu tiên |
|---|---|---|---|
| FR-01 | Hiển thị banner | Tiêu đề, mô tả ngắn, CTA "Đăng ký tư vấn" cuộn tới form | Cao |
| FR-02 | Danh sách dịch vụ visa | Card theo quốc gia (cờ, tên, mô tả, giá từ, nút tư vấn) | Cao |
| FR-03 | Lợi ích/Vì sao chọn chúng tôi | 4–6 điểm mạnh kèm icon | Cao |
| FR-04 | Quy trình 4 bước | Tư vấn → Hồ sơ → Nộp → Nhận kết quả | Trung bình |
| FR-05 | Đánh giá khách hàng | Slider/grid 3–6 review | Trung bình |
| FR-06 | FAQ | Accordion mở/đóng, 6–8 câu hỏi | Trung bình |
| FR-07 | Form đăng ký | Validate: tên ≥2 ký tự, SĐT VN hợp lệ (10 số, đầu 03/05/07/08/09); quốc gia dropdown; ghi chú tùy chọn | Cao |
| FR-08 | Lưu lead | Ghi vào Supabase (bảng `leads`); hiển thị thông báo thành công | Cao |
| FR-09 | Nút liên hệ nổi | Gọi (`tel:`), Zalo (`zalo.me/SĐT`), Messenger (`m.me/page`) | Cao |
| FR-10 | Admin: đăng nhập | Supabase Auth (email + password) | Cao |
| FR-11 | Admin: xem lead | Bảng danh sách, lọc theo ngày/quốc gia, đổi trạng thái (Mới/Đã gọi/Chốt/Hủy) | Cao |
| FR-12 | Admin: xuất CSV | Tải danh sách lead về mở bằng Excel | Cao |
| FR-13 | Admin: quản lý bài viết | Thêm/sửa/xóa bài (tiêu đề, danh mục, nội dung, ảnh URL) | Trung bình |
| FR-14 | Admin: quản lý danh mục | Thêm/xóa danh mục bài viết | Thấp |

## 4. Yêu cầu phi chức năng (Non-functional Requirements)

| ID | Yêu cầu | Tiêu chí |
|---|---|---|
| NFR-01 | Tốc độ tải | < 3 giây trên 4G; ảnh nén WebP; không framework nặng |
| NFR-02 | Responsive | Breakpoint: Mobile <768px, Tablet 768–1023px, Desktop ≥1024px |
| NFR-03 | Chi phí | 0đ giai đoạn đầu (Cloudflare Pages + Supabase Free) |
| NFR-04 | Bảo mật | Lead chỉ đọc được sau đăng nhập admin (Supabase RLS); form public chỉ được INSERT |
| NFR-05 | Dễ bảo trì | Người không code sửa được nội dung text/ảnh theo hướng dẫn; 1 file HTML/trang |
| NFR-06 | Trình duyệt | Chrome, Safari, Edge, trình duyệt trong app Zalo/Facebook |
| NFR-07 | Accessibility | Contrast đạt WCAG AA, font ≥16px trên mobile, touch target ≥44px |

## 5. Ràng buộc & Giả định

| Loại | Nội dung |
|---|---|
| Ràng buộc | Chủ sở hữu không biết lập trình → mọi thao tác vận hành phải có hướng dẫn từng bước |
| Ràng buộc | Ngân sách ban đầu ~0đ (chỉ mất phí domain ~250.000đ/năm nếu mua) |
| Giả định | Thông tin thương hiệu (tên, logo, SĐT, Zalo, Fanpage) sẽ cung cấp sau → dùng placeholder `[THAY_THẾ]` |
| Giả định | Khối lượng lead < 500/tháng → gói Supabase Free đủ dùng |

---

## ⚠️ Rà soát chủ động: Điểm mơ hồ / Edge case / Rủi ro

| # | Vấn đề | Loại | Impact | Đề xuất |
|---|---|---|---|---|
| 1 | Chưa có thông tin pháp lý (giấy phép kinh doanh, địa chỉ) hiển thị footer — ảnh hưởng độ tin cậy & chạy quảng cáo | Gap | Cao | Bổ sung ngay khi có; quảng cáo Google/Facebook ngành visa yêu cầu minh bạch |
| 2 | SĐT trùng gửi form nhiều lần (spam/duplicate lead) | Edge case | Trung bình | Đã xử lý: chặn gửi lại trong 60s phía client; admin lọc trùng theo SĐT |
| 3 | Khách nhập SĐT sai định dạng (thêm +84, khoảng trắng) | Edge case | Trung bình | Validate tự chuẩn hóa +84 → 0, bỏ khoảng trắng |
| 4 | Supabase Free tạm dừng project nếu 7 ngày không hoạt động | Risk | Trung bình | Ghi rõ trong hướng dẫn vận hành: vào dashboard ít nhất 1 lần/tuần, hoặc nâng cấp khi có doanh thu |
| 5 | Giá dịch vụ chưa xác định ("giá từ" là placeholder) | Gap | Trung bình | Chốt bảng giá trước khi chạy quảng cáo |
| 6 | Chưa quyết định tên miền → ảnh hưởng branding, email | Gap | Thấp | Chọn domain .vn hoặc .com khi chốt tên thương hiệu |
| 7 | Mất mạng lúc gửi form → lead bị mất | Edge case | Thấp | Đã xử lý: báo lỗi + gợi ý gọi hotline/Zalo thay thế |
