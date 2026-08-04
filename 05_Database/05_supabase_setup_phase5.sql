-- ============================================================
-- SUPABASE SETUP – Phase 5: Nâng cấp "Bảng phí đại lý" (doi_tac_phi) + liên kết tự động điền
--    phí sang dialog "Đăng ký hồ sơ" (Nước đến + Mục đích + Đại lý ủy thác -> tra bảng phí).
-- Chạy trong SQL Editor của project Supabase đang dùng — chạy lại không lỗi (idempotent).
-- YÊU CẦU: public.doi_tac_phi, public.danh_muc_nuoc, public.danh_muc_muc_dich (Phase 2) đã tồn tại.
-- ============================================================

-- ============================================================
-- A. doi_tac_phi — thêm "Đất nước" + "Diện visa" dạng droplist (thay vì gõ tay tự do), thêm
--    "Phí lãnh sự" tách riêng khỏi "Phí ủy thác" (trước đây gộp chung 1 cột "Mức phí").
--    nuoc_id/muc_dich_id để NULLABLE (không ép NOT NULL ở CSDL) vì bảng này đã có dữ liệu thật —
--    các dòng phí tạo TRƯỚC migration này sẽ không có 2 cột này. Từ nay trở đi, admin.html bắt
--    buộc chọn cả 2 khi thêm dòng phí mới (validate ở phía UI, xem admin.html hàm addDoiTacPhi()).
--    Cột dien_visa (text, tự do) cũ được GIỮ NGUYÊN — chỉ dùng để hiển thị fallback cho các dòng
--    phí cũ chưa có muc_dich_id, không còn được ghi giá trị mới từ UI nữa.
-- ============================================================

alter table public.doi_tac_phi add column if not exists nuoc_id bigint
  references public.danh_muc_nuoc(id) on delete set null;

alter table public.doi_tac_phi add column if not exists muc_dich_id bigint
  references public.danh_muc_muc_dich(id) on delete set null;

alter table public.doi_tac_phi add column if not exists phi_lanh_su numeric;

-- Đổi tên "muc_phi" -> "phi_uy_thac" cho đúng nghĩa nghiệp vụ (giờ có 2 loại phí tách riêng:
-- phí ủy thác trả đại lý + phí lãnh sự). Bọc DO block để chạy lại nhiều lần không lỗi
-- (không dùng "rename column if exists" vì Postgres không hỗ trợ cú pháp đó).
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='doi_tac_phi' and column_name='muc_phi'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='doi_tac_phi' and column_name='phi_uy_thac'
  ) then
    alter table public.doi_tac_phi rename column muc_phi to phi_uy_thac;
  end if;
end $$;

comment on column public.doi_tac_phi.nuoc_id is 'Đất nước (danh_muc_nuoc) — bắt buộc chọn ở UI cho dòng phí mới, NULL ở các dòng tạo trước Phase 5.';
comment on column public.doi_tac_phi.muc_dich_id is 'Diện visa/Mục đích (danh_muc_muc_dich) — bắt buộc chọn ở UI cho dòng phí mới, NULL ở các dòng tạo trước Phase 5.';
comment on column public.doi_tac_phi.phi_uy_thac is 'Phí ủy thác trả cho đại lý (đơn giá/người) — trước đây tên "Mức phí" (muc_phi).';
comment on column public.doi_tac_phi.phi_lanh_su is 'Phí lãnh sự (đơn giá/người) — dùng để tự điền "Lệ phí lãnh sự" khi tạo Hồ sơ.';

-- ============================================================
-- B. GHI CHÚ NGHIỆP VỤ (không phải SQL) — dialog "Đăng ký hồ sơ" (admin.html)
--    Khi chọn đủ Nước đến + Mục đích + Đại lý ủy thác, JS tự query:
--      GET doi_tac_phi?doi_tac_id=eq.{id}&nuoc_id=eq.{id}&muc_dich_id=eq.{id}
--          &select=phi_uy_thac,phi_lanh_su&order=ngay_ap_dung_tu.desc&limit=1
--    rồi tự điền "phi_lanh_su" -> "Lệ phí lãnh sự", "phi_uy_thac" -> "Đại lý/CTV" (vẫn sửa tay
--    được sau đó). Không lọc theo "noi_nop" (Nơi nộp) vì dialog Hồ sơ không có field này — nếu 1
--    đại lý có nhiều dòng phí khác nhau chỉ khác "Nơi nộp" cho cùng Nước đến+Mục đích, hệ thống
--    lấy dòng có "Áp dụng từ" MỚI NHẤT trong số đó (xem admin.html hàm lookupDoiTacPhi()).
-- ============================================================

-- ✅ Hết migration Phase 5 — sẵn sàng chạy trong SQL Editor (sau khi Phase 2 đã chạy).
