-- ============================================================
-- SUPABASE SETUP – Phase 10: trạng thái "đã đọc" của chuông thông báo tính RIÊNG theo từng máy/
-- trình duyệt (device), thay vì 1 cờ is_read CHUNG cho mọi người/mọi máy như Phase 8 (xem CLAUDE.md
-- mục 33 + mục mới thêm khi làm Phase 10). Lý do đổi: PM dùng 2 máy — máy A đọc thì máy B đang thấy
-- "đã đọc" theo, dễ bỏ sót thông báo thật nếu B chưa từng thấy nội dung đó.
-- Chạy trong SQL Editor của project Supabase đang dùng — chạy lại không lỗi (idempotent).
-- YÊU CẦU: Phase 8 (bảng notifications) đã chạy trước khi chạy file này.
-- ============================================================

-- ============================================================
-- A. notification_reads — 1 dòng = "thiết bị X đã đọc thông báo Y". Cột is_read/read_at CŨ trên
--    notifications (Phase 8) GIỮ NGUYÊN, không xóa (admin.html hết dùng để hiển thị nhưng để lại
--    tránh phải sửa lại toàn bộ Worker/lịch sử cũ — không có tác dụng phụ gì nếu bỏ không dùng).
-- ============================================================

create table if not exists public.notification_reads (
  notification_id bigint not null references public.notifications(id) on delete cascade,
  device_id        text not null,   -- sinh 1 lần/trình duyệt, lưu localStorage (xem admin.html DEVICE_ID)
  read_at          timestamptz not null default now(),
  primary key (notification_id, device_id)
);
create index if not exists idx_notification_reads_device on public.notification_reads(device_id);

alter table public.notification_reads enable row level security;

drop policy if exists "auth_all_notification_reads" on public.notification_reads;
create policy "auth_all_notification_reads" on public.notification_reads for all to authenticated using (true) with check (true);

-- ✅ Hết migration Phase 10 — sẵn sàng chạy trong SQL Editor.
