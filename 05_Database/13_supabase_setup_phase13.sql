-- Phase 13 (2026-09, kế hoạch SEO T4) — kết xuất bài viết phía server: /blog và /blog/<slug>-<id>.
-- Thêm 2 cột vào posts: slug (dùng trong URL, chỉ mang tính hiển thị/SEO — tra bài viết luôn theo
-- id, KHÔNG theo slug, xem worker.js) và updated_at (cho JSON-LD Article dateModified + lastmod
-- sitemap sau này). Sinh slug cho các bài đã có, bỏ dấu tiếng Việt.

-- A. Bật extension unaccent (có sẵn trong Postgres contrib, Supabase cho phép bật) — dùng để bỏ
--    dấu tiếng Việt khi sinh slug. Không xóa/đổi dữ liệu nào, chỉ thêm khả năng cho hàm unaccent().
create extension if not exists unaccent;

-- B. Thêm 2 cột mới, nullable — không phá dữ liệu cũ.
alter table public.posts add column if not exists slug text;
alter table public.posts add column if not exists updated_at timestamptz default now();
comment on column public.posts.slug is 'Slug dùng trong URL /blog/<slug>-<id> — CHỈ để hiển thị/SEO, worker.js luôn tra bài theo id (số cuối URL) chứ không theo slug, nên đổi tiêu đề bài không làm hỏng link cũ. Không có ràng buộc unique — 2 bài trùng slug vẫn phân biệt được nhờ id.';
comment on column public.posts.updated_at is 'Thời điểm sửa gần nhất — tự cập nhật qua trigger set_posts_updated_at bên dưới mỗi khi UPDATE. Dùng cho JSON-LD Article (dateModified) và sitemap.xml (lastmod) ở các task sau.';

-- C. Trigger tự cập nhật updated_at mỗi khi UPDATE 1 dòng posts (idempotent: create or replace +
--    drop trigger if exists trước khi tạo lại, an toàn chạy lại nhiều lần).
create or replace function public.set_posts_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_posts_updated_at on public.posts;
create trigger trg_posts_updated_at
  before update on public.posts
  for each row execute function public.set_posts_updated_at();

-- D. Backfill slug cho các bài ĐÃ CÓ (chỉ những dòng slug còn NULL — an toàn chạy lại nhiều lần,
--    không ghi đè slug đã có, kể cả nếu ai đó đã sửa tay qua admin sau lần chạy đầu).
--    Quy tắc: chữ thường -> đổi riêng đ/Đ thành d (unaccent() không tự xử lý được đ vì đây là 1 kí
--    tự gốc riêng trong Unicode, không phải "d" + dấu, giống cách vnNorm()/slugifyCatName() phía
--    client đã làm) -> unaccent() bỏ các dấu còn lại -> chỉ giữ a-z0-9, phần còn lại nối bằng "-"
--    -> bỏ dấu "-" thừa ở đầu/cuối.
update public.posts
set slug = regexp_replace(
             regexp_replace(
               unaccent(replace(lower(title), 'đ', 'd')),
               '[^a-z0-9]+', '-', 'g'
             ),
             '(^-+)|(-+$)', '', 'g'
           )
where slug is null;
