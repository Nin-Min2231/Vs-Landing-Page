-- ============================================================
-- SUPABASE SETUP – Phase 8: Chuông thông báo admin.html (trả kết quả hôm nay / nhắc tư vấn hôm
-- nay / khách đăng ký mới từ web) + hạ tầng gửi thông báo đẩy (Web Push) ra điện thoại.
-- Chạy trong SQL Editor của project Supabase đang dùng — chạy lại không lỗi (idempotent).
-- YÊU CẦU: Phase 1, Phase 2 (và khuyến nghị Phase 3-7) đã chạy trước khi chạy file này.
-- LƯU Ý: leads.email đã có sẵn từ Phase 2 — Phase 8 KHÔNG đụng gì tới cột đó (chỉ trang
-- index.html thêm ô nhập email, không cần đổi schema).
-- ============================================================

-- ============================================================
-- A. notifications — 3 loại thông báo hiện trên chuông ở header admin.html:
--    'tra_kq'      = hồ sơ có ngay_tra_kq đúng hôm nay (đang "Đã nộp"/"Đang xử lý")
--    'nhac_tuvan'  = lead có ngay_nhac_lai đúng hôm nay
--    'dang_ky_moi' = khách tự đăng ký tư vấn từ form công khai (index.html)
--    Các dòng do 1 Cloudflare Worker chạy nền (cron, dùng service_role key) tự sinh ra bằng cách
--    quét ho_so/leads định kỳ — admin.html CHỈ đọc/đánh dấu đã đọc/xóa, không tự sinh dòng mới.
--    unique(loai,ref_id,ref_ngay): idempotent — Worker chạy lại nhiều lần trong ngày không tạo
--    trùng thông báo cho cùng 1 hồ sơ/lead + cùng 1 mốc ngày.
-- ============================================================

create table if not exists public.notifications (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  loai       text not null check (loai in ('tra_kq','nhac_tuvan','dang_ky_moi')),
  ref_table  text not null,   -- 'ho_so' hoặc 'leads' — bảng nguồn để biết mở đúng dialog nào
  ref_id     bigint not null, -- id của dòng trong ref_table
  ref_ngay   date not null,   -- ngày_tra_kq / ngày_nhắc_lại / ngày tạo lead — dùng để chống trùng
  noi_dung   text not null,   -- nội dung hiển thị, dạng "Tên khách hàng_ Visa <nước>"
  is_read    boolean not null default false,
  read_at    timestamptz,
  pushed_at  timestamptz,     -- Worker đã gửi Web Push cho dòng này chưa (null = chưa gửi)
  unique (loai, ref_id, ref_ngay)
);
create index if not exists idx_notifications_is_read on public.notifications(is_read);
create index if not exists idx_notifications_created_at on public.notifications(created_at desc);

alter table public.notifications enable row level security;

-- Chỉ admin (authenticated) được xem/sửa/xóa — Worker nền dùng service_role key nên tự bỏ qua RLS,
-- không cần policy riêng. anon KHÔNG có quyền gì trên bảng này (không lộ tên/SĐT khách qua API công khai).
drop policy if exists "auth_all_notifications" on public.notifications;
create policy "auth_all_notifications" on public.notifications for all to authenticated using (true) with check (true);

-- ============================================================
-- B. push_subscriptions — lưu thông tin "đăng ký nhận thông báo đẩy" của từng thiết bị/trình
--    duyệt admin đã bấm "Bật thông báo đẩy" trong admin.html (Web Push chuẩn, không phải app riêng
--    trên CH Play/App Store). unique(endpoint) để bấm "Bật" nhiều lần trên cùng máy không tạo trùng.
-- ============================================================

create table if not exists public.push_subscriptions (
  id           bigint generated always as identity primary key,
  created_at   timestamptz not null default now(),
  endpoint     text not null unique,
  p256dh       text not null,
  auth         text not null,
  user_agent   text,
  last_seen_at timestamptz not null default now()
);

alter table public.push_subscriptions enable row level security;

drop policy if exists "auth_all_push_subscriptions" on public.push_subscriptions;
create policy "auth_all_push_subscriptions" on public.push_subscriptions for all to authenticated using (true) with check (true);

-- ✅ Hết migration Phase 8 — sẵn sàng chạy trong SQL Editor.
