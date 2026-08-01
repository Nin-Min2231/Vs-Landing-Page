-- ============================================================
-- SUPABASE SETUP – Visa Landing Page
-- Cách dùng: Supabase Dashboard → SQL Editor → New query
--            → dán toàn bộ file này → Run
-- Chạy 1 lần duy nhất. Chạy lại không gây lỗi (idempotent).
-- ============================================================

-- 1. Bảng LEADS: khách đăng ký tư vấn
create table if not exists public.leads (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  name       text not null,
  phone      text not null,
  country    text,
  note       text,
  status     text not null default 'Mới'   -- Mới / Đã gọi / Chốt / Hủy
);

-- 2. Bảng CATEGORIES: danh mục bài viết
create table if not exists public.categories (
  id         bigint generated always as identity primary key,
  name       text not null unique
);

-- 3. Bảng POSTS: bài viết
create table if not exists public.posts (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  title       text not null,
  category_id bigint references public.categories(id) on delete set null,
  image_url   text,
  content     text,
  published   boolean not null default true
);

-- 4. Bật RLS (Row Level Security – bảo mật theo dòng)
alter table public.leads enable row level security;
alter table public.categories enable row level security;
alter table public.posts enable row level security;

-- 5. Luật cho LEADS
--    Người lạ (form trên web): CHỈ được ghi thêm, không đọc/sửa/xóa
drop policy if exists "anon_insert_leads" on public.leads;
create policy "anon_insert_leads" on public.leads
  for insert to anon with check (true);

--    Admin đã đăng nhập: toàn quyền
drop policy if exists "auth_all_leads" on public.leads;
create policy "auth_all_leads" on public.leads
  for all to authenticated using (true) with check (true);

-- 6. Luật cho POSTS & CATEGORIES
--    Người lạ: chỉ ĐỌC bài đã xuất bản (phục vụ blog tương lai)
drop policy if exists "anon_read_posts" on public.posts;
create policy "anon_read_posts" on public.posts
  for select to anon using (published = true);

drop policy if exists "anon_read_categories" on public.categories;
create policy "anon_read_categories" on public.categories
  for select to anon using (true);

--    Admin: toàn quyền
drop policy if exists "auth_all_posts" on public.posts;
create policy "auth_all_posts" on public.posts
  for all to authenticated using (true) with check (true);

drop policy if exists "auth_all_categories" on public.categories;
create policy "auth_all_categories" on public.categories
  for all to authenticated using (true) with check (true);

-- 7. Danh mục bài viết: KHÔNG insert dữ liệu mẫu ở đây (2026-08, xem CLAUDE.md mục 10) —
--    tự thêm bằng tay qua admin.html (tab "Danh mục") khi cần danh mục thật.

-- ✅ Xong! Tiếp theo: Authentication → Users → Add user để tạo tài khoản admin.
