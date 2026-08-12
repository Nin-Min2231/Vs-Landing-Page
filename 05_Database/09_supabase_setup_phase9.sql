-- ============================================================
-- SUPABASE SETUP – Phase 9: thêm loại thông báo thứ 4 "Xử lý phát sinh" (hạn chốt hôm nay)
-- Chạy trong SQL Editor của project Supabase đang dùng — chạy lại không lỗi (idempotent).
-- YÊU CẦU: Phase 8 (05_Database/08_supabase_setup_phase8.sql, bảng notifications) đã chạy trước.
-- ============================================================

-- A. Thêm cột ref_parent_id — dùng khi ref_table là 1 bảng CON của ho_so (như
--    ho_so_xu_ly_phat_sinh) để biết mở đúng Hồ sơ CHA nào lúc bấm vào thông báo (ref_id lúc đó là
--    id của chính dòng xử lý phát sinh — PHẢI dùng id này, không phải ho_so_id, để 2 xử lý phát
--    sinh khác nhau cùng hạn chốt trên cùng 1 hồ sơ vẫn tạo được 2 thông báo riêng biệt, không bị
--    ràng buộc unique(loai,ref_id,ref_ngay) coi là trùng). NULL với 3 loại thông báo cũ (không cần).
alter table public.notifications add column if not exists ref_parent_id bigint;
comment on column public.notifications.ref_parent_id is 'id của Hồ sơ cha (ho_so.id) khi ref_table là bảng con của ho_so — dùng để mở đúng dialog Hồ sơ lúc bấm vào thông báo.';

-- B. Nới CHECK constraint của cột loai để cho phép thêm giá trị 'xlps' (Xử lý phát sinh).
do $$
begin
  if exists (
    select 1 from information_schema.table_constraints
    where table_schema='public' and table_name='notifications' and constraint_name='notifications_loai_check'
  ) then
    alter table public.notifications drop constraint notifications_loai_check;
  end if;
  alter table public.notifications add constraint notifications_loai_check
    check (loai in ('tra_kq','nhac_tuvan','dang_ky_moi','xlps'));
end $$;

-- ✅ Hết migration Phase 9 — sẵn sàng chạy trong SQL Editor.
