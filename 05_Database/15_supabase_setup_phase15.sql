-- ============================================================
-- SUPABASE SETUP – Phase 15: dọn danh mục bài viết thừa (Kaizen trang chủ, 2026-09-11)
-- Chạy trong SQL Editor của project Supabase đang dùng — chạy lại không lỗi (idempotent).
-- ============================================================
-- Bối cảnh: PM quyết định khóa cứng "Bài viết" thành đúng 2 danh mục cố định — "Thủ tục Visa" và
-- "Tin tức" — quản lý qua 2 tab riêng trong admin.html. Tab "Danh mục bài viết" (nơi PM tự do tạo
-- thêm danh mục) đã bị BỎ HẲN trong lần cập nhật này, xem 11_Home_Kaizen/. Danh mục "Kinh nghiệm
-- xin visa" (đã xác nhận qua REST API trước khi viết migration này: 0 bài viết) không khớp 1 trong
-- 2 danh mục cố định trên nên không còn chỗ dùng — xóa dọn cho sạch.
--
-- Không cần migration cho "Thủ tục Visa"/"Tin tức" vì 2 danh mục này đã tồn tại sẵn từ trước (5 bài
-- viết / 7 bài viết tại thời điểm viết migration này) và code mới chỉ tra cứu category_id theo đúng
-- TÊN "Thủ tục Visa"/"Tin tức" có sẵn trong bảng categories, không hardcode id, không cần insert.
-- ============================================================

-- Xóa "Kinh nghiệm xin visa" — CHỈ khi tên khớp đúng và KHÔNG có bài viết nào đang tham chiếu tới
-- (posts.category_id có "on delete set null" nên xóa vẫn an toàn kể cả có bài viết dùng, nhưng
-- chặn thêm ở đây cho chắc — nếu PM lỡ gán bài viết vào danh mục này sau khi đọc bản phân tích thì
-- migration sẽ tự bỏ qua, không âm thầm làm mất liên kết bài viết).
delete from public.categories
where name = 'Kinh nghiệm xin visa'
  and not exists (select 1 from public.posts where category_id = categories.id);

-- ✅ Hết migration Phase 15. Không tạo bảng mới nên KHÔNG cần sửa 06_Backup_Tool/backup-supabase.mjs.
