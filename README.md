# 🛂 Dự án: Top Visa – Landing Page (Lead Generation)

Landing page dịch vụ visa đa quốc gia + trang quản trị, chi phí vận hành 0đ (Cloudflare Pages + Supabase Free).

> 👉 Đang phát triển tiếp bằng **Claude Code**? Đọc `CLAUDE.md` ở thư mục gốc trước — file đó tóm tắt toàn bộ context dự án cho agent.

## Cấu trúc thư mục

```
Visa-Landing-Page/
├── README.md                  ← file này (cho người đọc)
├── CLAUDE.md                  ← context cho Claude Code (cho agent) ⭐
├── 01_Docs/                   ← tài liệu thiết kế (đọc theo thứ tự)
│   ├── 01_Phan_tich_yeu_cau.md    Yêu cầu chức năng/phi chức năng, persona, scope
│   ├── 02_Sitemap_UserFlow.md     Sitemap + user flow (sơ đồ Mermaid)
│   ├── 03_Wireframe.md            Wireframe Desktop / Tablet / Mobile
│   ├── 04_Design_System.md        Màu, font, spacing + danh sách component
│   ├── 05_Ke_hoach_du_an.md       Kế hoạch 6 phase + test case + checklist
│   ├── 06_Cong_nghe_de_xuat.md    So sánh công nghệ + lý do chọn
│   ├── 07_Huong_dan_Deploy.md     Hướng dẫn domain, hosting, deploy, backup ⭐
│   └── Visa-Landing-Page_Tai_lieu.xlsx   Bản Excel gộp cả 7 tài liệu trên (dễ đọc/in)
├── 02_Source/                 ← source code
│   ├── index.html                 Landing page (mở bằng trình duyệt xem ngay)
│   ├── admin.html                 Trang quản trị (cần cấu hình Supabase)
│   ├── supabase_setup.sql         Script tạo database (chạy 1 lần trong Supabase)
│   └── assets/                    Logo, favicon, QR Zalo (deploy kèm 2 file HTML)
└── 03_Information/            ← thông tin gốc công ty (logo, QR, Information.md — nguồn dữ liệu thật)
```

> ⚠️ Khi deploy Cloudflare Pages: kéo thả cả 2 file HTML **và thư mục `assets`** (giữ nguyên tên).

## Bắt đầu nhanh (3 việc cần làm)

1. **Xem thử ngay:** nháy đúp `02_Source/index.html` — trang chạy được luôn (form chưa gửi được vì chưa nối Supabase).
2. **Kích hoạt form + admin:** làm theo `01_Docs/07_Huong_dan_Deploy.md` → Bước 1 (tạo Supabase, ~15 phút).
3. **Đưa lên Internet:** làm tiếp Bước 3 (Cloudflare Pages, kéo thả file, ~10 phút).

## Việc cần làm trước khi công khai

Tìm chữ `[THAY_THẾ]` trong `index.html` (Ctrl+F) và thay bằng thông tin thật:

- [x] Tên công ty: **Top Visa** — cập nhật 2026-07-18 (nguồn: `03_Information/Information.md`)
- [x] Logo, favicon (từ `logo.jpg`) — cập nhật 2026-07-10
- [x] Hotline/Zalo 0935 887 922, link Facebook (công ty + tư vấn viên), QR Zalo, địa chỉ 303 Âu Cơ Liên Chiểu Đà Nẵng, email hien.gotravel@gmail.com — cập nhật 2026-07-18
- [ ] Bảng giá từng quốc gia
- [ ] Số liệu "5000+ hồ sơ / 98% đậu" → số thật (tránh vi phạm quảng cáo)
- [x] Review khách hàng thật — cập nhật 2026-07-30 (2 review thật lấy từ Facebook công ty)
- [x] Số GPKD ở footer — đã bỏ dòng này theo yêu cầu (2026-07-31), footer chỉ còn "© 2026 Top Visa."

## Đã đưa lên Internet (2026-07-30)

Trang đang chạy thật tại domain riêng **`https://topvisa5s.com`** (vẫn còn chạy song song ở `https://topvisa.nguyennc1357.workers.dev`, cùng 1 bản deploy) — Supabase đã kết nối thật, form/admin hoạt động. Chi tiết đầy đủ về hạ tầng, quyết định kỹ thuật, và việc cần làm tiếp theo: xem `01_Docs/08_Ban_giao_Claude_Code.md`.

## Phase 2 — Quản lý khách hàng / Admin CRM (2026-07-31)

Đã code xong 5 tab mới trong `admin.html` (Dashboard, Tư vấn, Hồ sơ, Đại lý ủy thác, Cài đặt chung) — xem chi tiết `04_Phase 2/Phase2_Ban_giao_Claude_Code.md`.

- [ ] **Cần chạy `04_Phase 2/supabase_setup_phase2.sql` trong Supabase SQL Editor trước khi dùng** (tạo bảng mới, mở rộng bảng `leads`) — Claude Code không tự chạy được bước này.
- [ ] Test theo checklist mục 8 trong file bàn giao trên sau khi migration chạy xong.

## Phase 3 — Tài chính (2026-08-01)

Đã thêm tab "💰 Tài chính" vào `admin.html`: Lợi nhuận/Khoản thu/Khoản chi theo khoảng thời gian
(Khoản thu tự động từ Hồ sơ đã đậu, Khoản chi nhập tay) — xem chi tiết
`06_Phase 3_Tai_Chinh/Phase3_TaiChinh_Ban_giao_Claude_Code.md`. Đã đẩy lên `main` và deploy thật.

- [x] Chạy `06_Phase 3_Tai_Chinh/supabase_setup_phase3.sql` trong Supabase SQL Editor (bảng `khoan_chi`).
- [ ] Test theo checklist mục 8 trong file bàn giao trên với dữ liệu thật (đã tự kiểm tra được phần
      không cần đăng nhập: giao diện, định dạng tiền, 4 nút lọc nhanh, RLS chặn `anon` đọc/ghi
      `khoan_chi` — còn phần cần đăng nhập admin thật thì người dùng tự test).

## SEO — đưa `topvisa5s.com` lên Google (2026-08-01)

Phát hiện tìm `topvisa5s.com` trên Google không ra kết quả — do domain **chưa từng được Google
thu thập dữ liệu**, không phải lỗi kỹ thuật. Đã tối ưu code (canonical, Open Graph, structured
data, `robots.txt`, `sitemap.xml`) — chi tiết đầy đủ ở `CLAUDE.md` mục 12.

- [x] Thêm canonical/Open Graph/Twitter Card/JSON-LD (TravelAgency + FAQPage) vào `index.html`.
- [x] Tạo `02_Source/robots.txt` + `02_Source/sitemap.xml`.
- [ ] **Cần bạn tự làm** (không thể làm thay vì cần đăng nhập tài khoản Google riêng của bạn):
      tạo Google Search Console → xác minh `topvisa5s.com` → khai báo sitemap → "Yêu cầu lập chỉ
      mục". Nên làm thêm Google Business Profile cho SEO địa phương Đà Nẵng. Xem hướng dẫn từng
      bước ở `CLAUDE.md` mục 12.

## Muốn sửa nội dung?

Gửi file cho Claude kèm yêu cầu, ví dụ: "Đổi giá visa Nhật thành 1.800.000đ", "Thêm quốc gia Singapore", "Đổi màu chủ đạo sang xanh lá" — sau đó deploy lại theo Bước 5 trong hướng dẫn.
