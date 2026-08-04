# 05. Kế hoạch Dự án – 6 Phase

| Mục | Nội dung |
|---|---|
| Tổng thời gian dự kiến | 3–4 tuần (làm ngoài giờ) |
| Nguyên tắc | Xong phase trước mới sang phase sau; mỗi phase có checklist nghiệm thu |

> Ghi chú: Phase 1–4 đã được Claude thực hiện trong phiên này (tài liệu + source code). Checklist bên dưới dùng để bạn tự nghiệm thu và cho các lần cập nhật sau.

---

## Phase 1 – Phân tích yêu cầu (要件定義)

| Mục | Nội dung |
|---|---|
| Mục tiêu | Chốt phạm vi, chức năng, đối tượng người dùng |
| Công việc | Phân tích persona, liệt kê FR/NFR, xác định out-of-scope |
| Đầu ra | `01_Phan_tich_yeu_cau.md` |
| Thời gian | 1–2 ngày |

**Checklist hoàn thành:**
- [x] Xác định mục tiêu chính (Lead Generation)
- [x] Liệt kê yêu cầu chức năng FR-01 → FR-14
- [x] Liệt kê yêu cầu phi chức năng
- [x] Rà soát điểm mơ hồ, edge case, rủi ro
- [ ] Bạn đọc và xác nhận tài liệu yêu cầu

## Phase 2 – Thiết kế (基本設計・詳細設計)

| Mục | Nội dung |
|---|---|
| Mục tiêu | Có bản thiết kế đủ chi tiết để code không phải đoán |
| Công việc | Sitemap, user flow, wireframe 3 thiết bị, design system, component list |
| Đầu ra | `02_Sitemap_UserFlow.md`, `03_Wireframe.md`, `04_Design_System.md` |
| Thời gian | 2–3 ngày |

**Checklist hoàn thành:**
- [x] Sitemap toàn site
- [x] User flow khách hàng + admin
- [x] Wireframe Desktop / Tablet / Mobile
- [x] Design system (màu, font, spacing, radius, shadow, icon)
- [x] Danh sách component
- [ ] Bạn duyệt màu sắc & bố cục

## Phase 3 – Front-end

| Mục | Nội dung |
|---|---|
| Mục tiêu | Landing page chạy được trên trình duyệt, responsive |
| Công việc | Code `index.html` (HTML/CSS/JS thuần, 1 file), đủ 8 section + nút liên hệ nổi |
| Đầu ra | `02_Source/index.html` |
| Thời gian | 3–5 ngày |

**Checklist hoàn thành:**
- [x] Đủ section: Banner, Dịch vụ, Lợi ích, Quy trình, Đánh giá, FAQ, Form, Footer
- [x] Responsive 3 breakpoint
- [x] Validate form phía client
- [x] Nút nổi Gọi/Zalo/Messenger
- [ ] Thay toàn bộ placeholder `[THAY_THẾ]` bằng thông tin thật
- [ ] Kiểm tra trên điện thoại thật

## Phase 4 – Back-end (Supabase)

| Mục | Nội dung |
|---|---|
| Mục tiêu | Lưu lead, đăng nhập admin, quản lý bài viết |
| Công việc | Tạo project Supabase, chạy SQL tạo bảng + RLS, nối config vào 2 file HTML |
| Đầu ra | `05_Database/01_supabase_setup.sql` (từ 2026-08, xem `CLAUDE.md` mục 4), `02_Source/admin.html` |
| Thời gian | 1–2 ngày |

**Checklist hoàn thành:**
- [x] Script SQL tạo bảng `leads`, `posts`, `categories` + RLS
- [x] Trang admin: đăng nhập, xem lead, đổi trạng thái, xuất CSV, CRUD bài viết
- [ ] Tạo tài khoản Supabase và chạy SQL (theo `07_Huong_dan_Deploy.md`)
- [ ] Điền SUPABASE_URL và ANON_KEY vào 2 file HTML
- [ ] Gửi thử 1 form → thấy lead trong admin

## Phase 5 – Kiểm thử (テスト)

| Mục | Nội dung |
|---|---|
| Mục tiêu | Không còn lỗi nghiêm trọng trước khi công khai |
| Công việc | Chạy test case theo bảng dưới, sửa lỗi phát hiện |
| Đầu ra | Bảng test case đã điền kết quả |
| Thời gian | 1–2 ngày |

**Test case chính:**

| ID | Precondition | Steps | Expected Result | Priority | Actual Result |
|---|---|---|---|---|---|
| TC-001 | Mở index.html trên Chrome PC | Cuộn toàn trang | Đủ 8 section, không vỡ layout | High | |
| TC-002 | Mở trên điện thoại (hoặc DevTools mobile) | Cuộn toàn trang, bấm menu | Menu hamburger hoạt động, không tràn ngang | High | |
| TC-003 | Ở form đăng ký | Bỏ trống Họ tên, bấm Gửi | Báo lỗi "Vui lòng nhập họ tên", không gửi | High | |
| TC-004 | Ở form đăng ký | Nhập SĐT "12345", bấm Gửi | Báo lỗi SĐT không hợp lệ | High | |
| TC-005 | Ở form đăng ký | Nhập SĐT "+84 912 345 678" | Tự chuẩn hóa thành 0912345678, gửi thành công | Medium | |
| TC-006 | Đã cấu hình Supabase | Điền form hợp lệ, bấm Gửi | Thông báo thành công; lead xuất hiện trong admin | High | |
| TC-007 | Vừa gửi form xong | Bấm Gửi lại ngay | Bị chặn, báo "vui lòng chờ" (chống spam 60s) | Medium | |
| TC-008 | Chưa cấu hình Supabase | Điền form hợp lệ, bấm Gửi | Báo lỗi thân thiện + gợi ý gọi hotline/Zalo | Medium | |
| TC-009 | Mở admin.html | Đăng nhập sai mật khẩu | Báo lỗi, không vào được | High | |
| TC-010 | Đã đăng nhập admin | Bấm "Xuất CSV" | Tải file .csv mở được bằng Excel, đúng dữ liệu, không lỗi font tiếng Việt | High | |
| TC-011 | Đã đăng nhập admin | Thêm → sửa → xóa 1 bài viết | Thao tác thành công, danh sách cập nhật | Medium | |
| TC-012 | Trên mobile | Bấm nút Gọi / Zalo / Messenger | Mở đúng app tương ứng | High | |
| TC-013 | Ở FAQ | Bấm lần lượt từng câu hỏi | Mở/đóng mượt, không lỗi | Low | |
| TC-014 | Mạng chậm/mất mạng | Gửi form | Báo lỗi rõ ràng, không treo nút Gửi | Medium | |

**Checklist hoàn thành:**
- [ ] 100% test case High đạt Pass
- [ ] Kiểm tra trên ≥2 trình duyệt (Chrome + Safari/Edge)
- [ ] Kiểm tra trên điện thoại thật

## Phase 6 – Deploy & Vận hành

| Mục | Nội dung |
|---|---|
| Mục tiêu | Website công khai trên Internet, có quy trình cập nhật/backup |
| Công việc | Theo `07_Huong_dan_Deploy.md`: mua domain, deploy Cloudflare Pages, trỏ DNS |
| Đầu ra | Website live + quy trình vận hành |
| Thời gian | 1 ngày |

**Checklist hoàn thành:**
- [ ] Deploy lên Cloudflare Pages, truy cập được bằng link `*.pages.dev`
- [ ] (Tùy chọn) Mua domain và trỏ DNS thành công
- [ ] Gửi thử form trên bản live → nhận được lead
- [ ] Bookmark trang Supabase Dashboard, đặt lịch kiểm tra hàng tuần
- [ ] Xuất CSV backup lead lần đầu

---

## ⚠️ Rủi ro tiến độ

| # | Rủi ro | Impact | Đề xuất |
|---|---|---|---|
| 1 | Chờ thông tin thương hiệu làm chậm Phase 5–6 | Trung bình | Có thể deploy trước bằng placeholder trên link *.pages.dev nội bộ, chỉ công khai sau khi thay thông tin thật |
| 2 | Người vận hành chưa quen Supabase | Trung bình | Làm theo hướng dẫn từng bước có ảnh chụp trong 07; chỉ cần thao tác dashboard, không cần code |
