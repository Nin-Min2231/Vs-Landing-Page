-- ============================================================
-- SUPABASE SETUP – Phase 14: noi_dung_quoc_gia (kế hoạch SEO T13)
-- Chạy trong SQL Editor của project Supabase đang dùng — chạy lại không lỗi (idempotent).
-- Nguồn spec: 10_SEO/11_Ke_hoach_sau_xac_nhan.md — T13 (bảng dữ liệu + màn nhập admin, làm ở đây)
-- + T14 (route SSR /visa-<slug>, LÀM SAU khi có nội dung chuyên môn thật từ chuyên viên — KHÔNG
-- thuộc phạm vi migration này). Đã gộp thêm T20 (byline tác giả, cột tac_gia) theo đúng chỉ định
-- trong kế hoạch: "gộp vào migration 14 của T13, chưa deploy nên không tốn migration riêng".
-- ============================================================

create table if not exists public.noi_dung_quoc_gia (
  id                bigint generated always as identity primary key,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  slug              text not null unique,               -- "visa-nhat-ban" — tự sinh từ ten_nuoc trong admin.html
  ten_nuoc          text not null,                       -- "Nhật Bản" — PHẢI khớp đúng dich_vu_gia.quoc_gia để T14 join giá
  title_seo         text,                                -- 50-60 ký tự, thẻ <title> của trang /visa-<slug>
  meta_description  text,                                -- 140-160 ký tự
  h1                text,                                -- đúng 1 thẻ <h1> của trang, KHÔNG trùng H1 trang chủ
  mo_dau            text,                                -- đoạn mở đầu ~100 từ
  khoi_noi_dung     jsonb not null default '[]'::jsonb,  -- mảng [{h2, noi_dung_html}]
  faq               jsonb not null default '[]'::jsonb,  -- mảng [{cau_hoi, tra_loi}] -> sinh FAQPage schema ở T14
  thoi_gian_xu_ly   text,                                -- chờ chuyên viên xác nhận (T18)
  tac_gia           text,                                -- byline chuyên viên (T20) — chờ PM cấp tên, để trống là bình thường
  thu_tu            int not null default 0,              -- thứ tự hiển thị trên trang chủ
  published         boolean not null default false       -- mặc định false — chưa duyệt thì không lên web
);

comment on table public.noi_dung_quoc_gia is 'Nội dung SEO cho 7 trang quốc gia (/visa-<slug>, kế hoạch SEO T14) — nhập/duyệt qua admin.html (Cài đặt chung).';
comment on column public.noi_dung_quoc_gia.slug is 'Path cuối của URL /visa-<slug> — unique, tự sinh từ ten_nuoc trong admin.html, không cho sửa tay để tránh lệch với ten_nuoc.';
comment on column public.noi_dung_quoc_gia.ten_nuoc is 'Phải khớp đúng dich_vu_gia.quoc_gia (vd "Nhật Bản", "Schengen (châu Âu)") để T14 join đúng giá hiển thị trên trang quốc gia.';
comment on column public.noi_dung_quoc_gia.khoi_noi_dung is 'Mảng JSON [{h2:"...", noi_dung_html:"..."}] — các khối H2 nội dung chính của trang, thứ tự trong mảng = thứ tự hiển thị.';
comment on column public.noi_dung_quoc_gia.faq is 'Mảng JSON [{cau_hoi:"...", tra_loi:"..."}] — sinh JSON-LD FAQPage khi làm T14.';
comment on column public.noi_dung_quoc_gia.tac_gia is 'Byline chuyên viên viết bài (T20, Article.author kiểu Person) — chờ PM cấp tên/chức danh và xác nhận đồng ý công khai, để trống là bình thường, KHÔNG tự bịa tên.';
comment on column public.noi_dung_quoc_gia.published is 'false = nháp, chỉ authenticated (admin) xem được. true = xuất bản, anon + Google xem được qua route /visa-<slug> (T14).';

-- Trigger tự cập nhật updated_at mỗi khi UPDATE 1 dòng — cùng mẫu đã dùng cho posts (migration 13),
-- viết hàm riêng cho từng bảng thay vì 1 hàm dùng chung (dự án chưa có tiền lệ hàm trigger dùng
-- chung, không tạo trừu tượng mới chỉ để phục vụ đúng 2 bảng). Dùng cho JSON-LD Article dateModified
-- (T14) và <lastmod> sitemap.xml (đã sửa worker.js dùng cột này ngay trong lần deploy T13 này).
create or replace function public.set_noi_dung_quoc_gia_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_noi_dung_quoc_gia_updated_at on public.noi_dung_quoc_gia;
create trigger trg_noi_dung_quoc_gia_updated_at
  before update on public.noi_dung_quoc_gia
  for each row execute function public.set_noi_dung_quoc_gia_updated_at();

alter table public.noi_dung_quoc_gia enable row level security;

-- anon (khách xem trang chủ, sau này là route /visa-<slug> ở T14) chỉ đọc dòng ĐÃ publish.
drop policy if exists "anon_read_noi_dung_quoc_gia" on public.noi_dung_quoc_gia;
create policy "anon_read_noi_dung_quoc_gia" on public.noi_dung_quoc_gia
  for select to anon using (published = true);

-- admin (đã đăng nhập) toàn quyền CRUD, kể cả xem/sửa bản nháp chưa publish.
drop policy if exists "auth_all_noi_dung_quoc_gia" on public.noi_dung_quoc_gia;
create policy "auth_all_noi_dung_quoc_gia" on public.noi_dung_quoc_gia
  for all to authenticated using (true) with check (true);

-- T20 (byline tác giả) — gộp vào đây theo đúng chỉ định trong kế hoạch SEO (mục T20: "gộp vào
-- migration 14 của T13, chưa deploy nên không tốn migration riêng"). posts đã tồn tại từ trước nên
-- cần ALTER riêng; noi_dung_quoc_gia đã có sẵn cột tac_gia ngay trong CREATE TABLE ở trên.
alter table public.posts add column if not exists tac_gia text;
comment on column public.posts.tac_gia is 'Byline chuyên viên viết bài (T20, Article.author kiểu Person) — chờ PM cấp tên/chức danh và xác nhận đồng ý công khai, để trống là bình thường, KHÔNG tự bịa tên.';

-- ✅ Hết migration Phase 14 — sẵn sàng chạy trong SQL Editor.
-- Việc bắt buộc kèm theo: đã thêm 'noi_dung_quoc_gia' vào mảng TABLES trong
-- 06_Backup_Tool/backup-supabase.mjs (khóa chính đơn "id", không cần khai báo thêm ORDER_BY).
