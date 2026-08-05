-- ============================================================
-- SUPABASE SETUP – Phase 6: Mở rộng danh mục "Nước đến" (Cài đặt chung)
-- Chạy trong SQL Editor của project Supabase đang dùng — chạy lại không lỗi (idempotent).
-- YÊU CẦU: public.danh_muc_nuoc (Phase 2) đã tồn tại trước khi chạy.
-- ============================================================

-- ============================================================
-- A. danh_muc_nuoc — thêm 4 field mới cho dialog "Nước đến" (Cài đặt chung): Lệ phí, Thời gian
--    xét duyệt, Checklist, Ghi chú. Tất cả NULLABLE — dữ liệu nước đến đã có từ trước sẽ chỉ
--    trống 4 field này cho tới khi người dùng tự bổ sung qua admin.html.
-- ============================================================

alter table public.danh_muc_nuoc add column if not exists le_phi numeric;
alter table public.danh_muc_nuoc add column if not exists thoi_gian_xet_duyet text;
alter table public.danh_muc_nuoc add column if not exists checklist text;
alter table public.danh_muc_nuoc add column if not exists ghi_chu text;

comment on column public.danh_muc_nuoc.le_phi is 'Lệ phí visa nước này (đơn giá) — hiển thị dạng tiền có dấu chấm ngăn cách nghìn ở admin.html.';
comment on column public.danh_muc_nuoc.thoi_gian_xet_duyet is 'Thời gian xét duyệt dự kiến (text tự do, vd "7-10 ngày làm việc").';
comment on column public.danh_muc_nuoc.checklist is 'Danh sách giấy tờ cần chuẩn bị (text tự do, tối đa 1000 ký tự — giới hạn ở phía UI admin.html).';
comment on column public.danh_muc_nuoc.ghi_chu is 'Ghi chú thêm (text tự do, tối đa 500 ký tự — giới hạn ở phía UI admin.html).';

-- ✅ Hết migration Phase 6 — sẵn sàng chạy trong SQL Editor (sau khi Phase 2 đã chạy).
