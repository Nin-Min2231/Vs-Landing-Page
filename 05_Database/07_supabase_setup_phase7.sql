-- ============================================================
-- SUPABASE SETUP – Phase 7: Đại lý ủy thác không bắt buộc, Phân loại bài viết,
-- Dịch vụ Visa các quốc gia (giá hiển thị trên landing page)
-- Chạy trong SQL Editor của project Supabase đang dùng — chạy lại không lỗi (idempotent).
-- YÊU CẦU: Phase 1, Phase 2 (và khuyến nghị Phase 3-6) đã chạy trước khi chạy file này.
-- ============================================================

-- ============================================================
-- A. ho_so.doi_tac_id — bỏ bắt buộc (2026-08, PM đảo lại quyết định cũ ở Phase 2: "BẮT BUỘC phải
--    chọn 1 Đại lý ủy thác cho mỗi hồ sơ") — nhiều hồ sơ khách tự làm không qua đại lý nào.
--    Giữ nguyên "on delete restrict" (không đổi) — chỉ bỏ NOT NULL.
-- ============================================================

alter table public.ho_so alter column doi_tac_id drop not null;

-- ============================================================
-- B. posts.phan_loai — tên hiển thị của "phân loại bài viết" trên landing page (khác với
--    category_id/"Danh mục" dùng để NHÓM bài viết theo section+menu, xem mục C). Bắt buộc nhập ở
--    UI admin.html (savePost()), NHƯNG để nullable ở DB (giống cách "nguon" ở Phase 2 từng làm)
--    để không phá dữ liệu cũ — backfill ngay bên dưới theo đúng tên section thật đang hiển thị.
-- ============================================================

alter table public.posts add column if not exists phan_loai text;
comment on column public.posts.phan_loai is 'Tên hiển thị (H2) của section chứa bài viết này trên landing page — bắt buộc nhập ở admin.html, các bài viết cùng "Danh mục" (category_id) nên dùng cùng 1 giá trị Phân loại để section không bị đổi tên qua lại.';

-- Backfill 1 LẦN DUY NHẤT lúc thêm cột — dữ liệu hiện có (Danh mục "Tin tức", 4 bài viết) đang
-- hiển thị dưới section "Tin tức & Kinh nghiệm xin Visa" trên landing page (mã cứng trước Phase 7).
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='posts' and column_name='phan_loai'
  ) then
    update public.posts set phan_loai = 'Tin tức & Kinh nghiệm xin Visa' where phan_loai is null;
  end if;
end $$;

-- ============================================================
-- C. dich_vu_gia — giá "Dịch vụ Visa các quốc gia" hiển thị ở landing page, quản lý qua admin.html
--    (Cài đặt chung). "quoc_gia" khớp ĐÚNG tên các quốc gia đang có card trên landing page (7 nước
--    + "Khác") — không phải danh mục Nước đến (danh_muc_nuoc, dùng cho Hồ sơ/Tư vấn, có thể có
--    nhiều nước khác ngoài 8 nước này). unique(quoc_gia) để mỗi nước chỉ có 1 mức giá đang áp dụng.
-- ============================================================

create table if not exists public.dich_vu_gia (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  quoc_gia   text not null unique,
  gia        numeric   -- để trống (null) = "Liên hệ báo giá" trên landing page (vd nước "Khác")
);

alter table public.dich_vu_gia enable row level security;

-- Landing page (index.html) đọc công khai để hiển thị giá — giống cơ chế posts/categories Phase 1
drop policy if exists "anon_read_dich_vu_gia" on public.dich_vu_gia;
create policy "anon_read_dich_vu_gia" on public.dich_vu_gia for select to anon using (true);

drop policy if exists "auth_all_dich_vu_gia" on public.dich_vu_gia;
create policy "auth_all_dich_vu_gia" on public.dich_vu_gia for all to authenticated using (true) with check (true);

-- Seed 8 nước đang có card trên landing page, giá = đúng giá "Từ x đ" đang hiển thị hiện tại
-- (PM xác nhận trực tiếp dùng làm giá trị default, sẽ tự sửa lại sau qua admin.html) — KHÔNG áp
-- dụng quy tắc "không insert dữ liệu mẫu" (CLAUDE.md mục 10) vì đây là yêu cầu rõ ràng của PM,
-- không phải Claude Code tự thêm. on conflict do nothing để chạy lại file này không ghi đè giá
-- PM đã tự sửa qua admin.html.
insert into public.dich_vu_gia (quoc_gia, gia) values
  ('Nhật Bản', 1500000),
  ('Hàn Quốc', 1400000),
  ('Đài Loan', 1200000),
  ('Trung Quốc', 1800000),
  ('Schengen (châu Âu)', 4500000),
  ('Mỹ', 5500000),
  ('Úc', 4000000),
  ('Khác', null)
on conflict (quoc_gia) do nothing;

-- ✅ Hết migration Phase 7 — sẵn sàng chạy trong SQL Editor.
