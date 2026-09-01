-- ============================================================
-- SUPABASE SETUP – Phase 12: danh_gia_khach_hang (Feedback khách hàng từ Facebook)
-- Chạy trong SQL Editor của project Supabase đang dùng — chạy lại không lỗi (idempotent).
-- Nguồn yêu cầu: 09_Facebook/request.md — quản lý qua admin.html (Cài đặt chung → "Feedback từ
-- khách hàng"), hiển thị động ở index.html section "Khách hàng nói gì về chúng tôi" (thay cho 2
-- review viết cứng trong HTML trước đây — xem CLAUDE.md mục 48).
-- ============================================================

create table if not exists public.danh_gia_khach_hang (
  id           bigint generated always as identity primary key,
  created_at   timestamptz not null default now(),
  ten_facebook text not null,   -- Tên Facebook khách hàng, hiển thị công khai trên landing page
  noi_dung     text not null,   -- Nội dung đánh giá (trích dẫn), hiển thị công khai
  url          text not null,   -- Link tới đánh giá/trang Facebook thật của khách, hiển thị công khai
  ghi_chu      text             -- Ghi chú nội bộ cho admin — KHÔNG hiển thị trên landing page
);

comment on table public.danh_gia_khach_hang is 'Feedback khách hàng lấy từ Facebook, quản lý ở admin.html ("Cài đặt chung"), hiển thị động ở section "Khách hàng nói gì về chúng tôi" trên index.html.';
comment on column public.danh_gia_khach_hang.ghi_chu is 'Ghi chú nội bộ (vd nguồn ảnh chụp màn hình, ngày xin phép khách...) — chỉ admin thấy, không hiển thị công khai.';

alter table public.danh_gia_khach_hang enable row level security;

-- anon (khách xem trang chủ) chỉ đọc — giống chính sách của dich_vu_gia
drop policy if exists "anon_read_danh_gia_khach_hang" on public.danh_gia_khach_hang;
create policy "anon_read_danh_gia_khach_hang" on public.danh_gia_khach_hang for select to anon using (true);

-- admin (đã đăng nhập) toàn quyền CRUD
drop policy if exists "auth_all_danh_gia_khach_hang" on public.danh_gia_khach_hang;
create policy "auth_all_danh_gia_khach_hang" on public.danh_gia_khach_hang for all to authenticated using (true) with check (true);

-- ✅ Hết migration Phase 12 gốc — sẵn sàng chạy trong SQL Editor.
-- Việc bắt buộc kèm theo: đã thêm 'danh_gia_khach_hang' vào mảng TABLES trong
-- 06_Backup_Tool/backup-supabase.mjs (khóa chính đơn "id", không cần khai báo thêm ORDER_BY).

-- ============================================================
-- Nối thêm (2026-09-01, cùng Phase 12 — thay đổi nhỏ liên quan trực tiếp, theo đúng quy tắc ở
-- 05_Database/README.md): thêm "Tháng/Năm" cho mỗi feedback — PM tự chọn tháng/năm THẬT của đánh
-- giá đó (không phải ngày tạo dòng trong hệ thống, vì PM có thể nhập bù các đánh giá cũ từ lâu).
-- index.html hiển thị "Đánh giá thật trên Facebook mm - yyyy" lấy từ 2 cột này — nếu để trống (dữ
-- liệu cũ nhập trước khi có 2 cột này) thì tự dùng tạm tháng/năm của created_at làm phương án dự
-- phòng, xem CLAUDE.md mục 48. NULLABLE (không ép NOT NULL) vì đã có sẵn dòng dữ liệu thật trước đó
-- (PM đã chạy Phase 12 gốc + thêm feedback đầu tiên) — ép NOT NULL sẽ làm lỗi ngay dòng có sẵn.
-- ============================================================
alter table public.danh_gia_khach_hang
  add column if not exists thang smallint,
  add column if not exists nam smallint;

comment on column public.danh_gia_khach_hang.thang is 'Tháng THẬT của đánh giá (1-12, PM tự chọn) — dùng hiển thị "mm - yyyy" trên landing page, không phải tháng tạo dòng.';
comment on column public.danh_gia_khach_hang.nam is 'Năm THẬT của đánh giá (PM tự chọn) — dùng hiển thị "mm - yyyy" trên landing page, không phải năm tạo dòng.';

-- ✅ Hết phần nối thêm — an toàn chạy lại cả file (kể cả đã chạy phần gốc từ trước).
