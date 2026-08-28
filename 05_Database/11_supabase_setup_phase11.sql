-- ============================================================
-- SUPABASE SETUP – Phase 11: chat_logs (lịch sử hội thoại Chat Box, Release 1)
-- Chạy trong SQL Editor của project Supabase đang dùng — chạy lại không lỗi (idempotent).
-- Xem 08_Chatbox/Dac_ta_Trien_khai_Chatbox.md mục 4.1 (nguồn spec) + CLAUDE.md mục 10 (không insert
-- dữ liệu mẫu).
-- ============================================================

create table if not exists public.chat_logs (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  session_id  text not null,           -- gom các tin nhắn cùng 1 phiên chat (sinh phía client, vd crypto.randomUUID())
  lead_id     bigint references public.leads(id) on delete set null,  -- liên kết lead nếu phiên có để lại thông tin, null nếu chưa
  role        text not null check (role in ('user','assistant')),
  message     text not null,
  lang        text not null default 'vi' check (lang in ('vi','en'))
);

comment on table public.chat_logs is 'Lịch sử hội thoại Chat Box trang Home — admin xem lại/xoá qua admin.html tab "Quản lý Chat".';
comment on column public.chat_logs.session_id is 'Định danh 1 phiên chat (sinh ở client, vd crypto.randomUUID()), dùng để gom nhóm tin nhắn khi hiển thị.';
comment on column public.chat_logs.lead_id is 'Liên kết tới leads nếu phiên chat này đã để lại tên/SĐT — null nếu khách chưa để lại thông tin.';

create index if not exists idx_chat_logs_session on public.chat_logs(session_id);
create index if not exists idx_chat_logs_created on public.chat_logs(created_at desc);

alter table public.chat_logs enable row level security;

-- Worker ghi bằng SUPABASE_SERVICE_ROLE_KEY (route /api/chat trong worker.js) — service role bỏ qua
-- RLS hoàn toàn nên về nguyên tắc không bắt buộc phải có policy nào, nhưng vẫn khai báo rõ ràng
-- CHỈ authenticated (admin) mới đọc/sửa/xoá được qua admin.html — không mở anon (dữ liệu cá nhân).
drop policy if exists "auth_all_chat_logs" on public.chat_logs;
create policy "auth_all_chat_logs" on public.chat_logs for all to authenticated using (true) with check (true);

-- ✅ Hết migration Phase 11 — sẵn sàng chạy trong SQL Editor.
-- Việc bắt buộc kèm theo: đã thêm 'chat_logs' vào mảng TABLES trong 06_Backup_Tool/backup-supabase.mjs
-- (khoá chính đơn `id` nên không cần khai báo thêm vào ORDER_BY).
