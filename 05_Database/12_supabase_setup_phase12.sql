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

-- ✅ Hết migration Phase 12 — sẵn sàng chạy trong SQL Editor.
-- Việc bắt buộc kèm theo: đã thêm 'danh_gia_khach_hang' vào mảng TABLES trong
-- 06_Backup_Tool/backup-supabase.mjs (khóa chính đơn "id", không cần khai báo thêm ORDER_BY).
