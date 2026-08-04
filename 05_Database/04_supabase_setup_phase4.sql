-- ============================================================
-- SUPABASE SETUP – Phase 4: Thông tin khách hàng + nâng cấp dialog Hồ sơ + Tư vấn
-- ✅ Đã PM xác nhận qua vòng hỏi đáp (xem Phase4_BanGiao_Claude_Code.md mục 2).
-- Chạy trong SQL Editor của project Supabase đang dùng — chạy lại không lỗi (idempotent).
-- YÊU CẦU: public.ho_so, public.danh_muc_truong_nhom (Phase 2) đã tồn tại trước khi chạy.
--
-- ⚠️ CSDL NÀY ĐANG CÓ DỮ LIỆU THẬT (production) — xem mục 0, Phase4_BanGiao_Claude_Code.md.
-- BẮT BUỘC làm trước khi chạy khối lệnh bên dưới (copy chạy riêng, KHÔNG nằm trong transaction):
--
--   select count(*) from public.ho_so;                                            -- ghi lại số A
--   select sum(coalesce(chi_thu_di,0) + coalesce(chi_thu_ve,0)) from public.ho_so; -- ghi lại số B
--
-- Sau khi chạy xong toàn bộ script bên dưới, chạy lại để đối chiếu (xem khối kiểm tra cuối file):
--   count(*) phải bằng A, sum(chi_phi_ship) phải bằng B — nếu lệch, KHÔNG code tiếp, báo lại ngay.
--
-- Toàn bộ phần ALTER/DROP bên dưới bọc trong 1 transaction (begin...commit) — lỗi giữa chừng sẽ
-- tự động rollback toàn bộ, không để CSDL ở trạng thái dở dang.
-- ============================================================

begin;

-- ============================================================
-- A. BẢNG MỚI "THÔNG TIN KHÁCH HÀNG" — Màn hình quản lý khách hàng đã làm hồ sơ
-- ============================================================

create table if not exists public.khach_hang (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  ho_ten      text not null,
  so_dt       text,
  ngay_sinh   date,
  cccd        text,
  dia_chi     text,
  email       text,
  ghi_chu     text
);

comment on table public.khach_hang is
  'Danh sách khách hàng đã từng làm hồ sơ — dùng để autocomplete tại dialog Hồ sơ (mục 3, '
  'Phase4_BanGiao_Claude_Code.md). Không đặt unique cho so_dt (PM xác nhận: trùng SĐT chỉ cảnh báo, không chặn — mục 2 điểm 7).';

-- ============================================================
-- B. DANH MỤC MỚI "ĐỐI TÁC" — thêm vào màn "Cài đặt chung" (bên cạnh Nước đến/Mục đích/Trưởng nhóm)
--    LƯU Ý QUAN TRỌNG: đây là danh mục ĐƠN GIẢN (chỉ tên), KHÁC HOÀN TOÀN với bảng public.doi_tac
--    (bảng "Đại lý ủy thác" đã có từ Phase 2, có công ty/người đại diện/bảng phí riêng).
--    Đặt tên kỹ thuật danh_muc_doi_tac để không đụng bảng doi_tac cũ — PM xác nhận đây là 2 khái
--    niệm khác nhau (mục 2, câu hỏi 1, Phase4_BanGiao_Claude_Code.md), dù tên hiển thị đều là "Đối tác"
--    và "Đại lý ủy thác" — CẦN đọc kỹ ghi chú để không nhầm khi code UI.
-- ============================================================

create table if not exists public.danh_muc_doi_tac (
  id      bigint generated always as identity primary key,
  ten     text not null unique,
  active  boolean not null default true
);

comment on table public.danh_muc_doi_tac is
  'Danh mục "Đối tác giới thiệu" (nhãn hiển thị đã đổi theo PM, mục 2 điểm 4) ở dialog Hồ sơ (mục '
  'Thông tin khách) — KHÁC bảng public.doi_tac ("Đại lý ủy thác", bắt buộc, ở mục Thông tin nộp hồ sơ).';

-- ============================================================
-- C. NÂNG CẤP BẢNG ho_so — các field mới theo dialog mẫu (Dialog_Tao_moi_ho_so.png)
-- ============================================================

-- C.1 Liên kết khách hàng (khuyến nghị PM đã chọn) — tuỳ chọn, không bắt buộc chọn từ danh sách
alter table public.ho_so add column if not exists khach_hang_id bigint
  references public.khach_hang(id) on delete set null;

-- C.2 Danh mục "Đối tác" mới (khác doi_tac_id/Đại lý ủy thác đã có)
alter table public.ho_so add column if not exists doi_tac_dm_id bigint
  references public.danh_muc_doi_tac(id) on delete set null;

-- C.3 Email khách hàng — copy tại thời điểm tạo hồ sơ, cùng kiểu với sdt_khach/dia_chi đã có
alter table public.ho_so add column if not exists email text;

-- C.4 Field mới trong "Thông tin thu": Khách tip + Ghi chú thu
alter table public.ho_so add column if not exists thu_khach_tip numeric not null default 0;
alter table public.ho_so add column if not exists thu_ghi_chu text;

-- C.5 Field mới trong "Thông tin chi": Ghi chú chi
alter table public.ho_so add column if not exists chi_ghi_chu text;

-- C.6 Gộp "Thư đi" + "Thư về" thành "Phí ship" (PM xác nhận, mục 2 câu hỏi 2)
--     Di chuyển dữ liệu cũ TRƯỚC khi xoá cột — an toàn nếu Phase 2 đã có dữ liệu thật.
--     Khối lệnh có kiểm tra tồn tại cột để chạy lại nhiều lần không lỗi (idempotent).
alter table public.ho_so add column if not exists chi_phi_ship numeric not null default 0;

do $$
begin
  if exists (select 1 from information_schema.columns
             where table_schema='public' and table_name='ho_so' and column_name='chi_thu_di')
     or exists (select 1 from information_schema.columns
                where table_schema='public' and table_name='ho_so' and column_name='chi_thu_ve')
  then
    update public.ho_so
      set chi_phi_ship = chi_phi_ship + coalesce(chi_thu_di, 0) + coalesce(chi_thu_ve, 0);
  end if;
end $$;

-- C.7 Tính lại các cột tự động (generated column) — phải xoá view phụ thuộc trước khi đổi cột,
--     xong tạo lại view ở mục F (giống cách làm ở supabase_setup_phase2.sql mục C.1).
drop view if exists public.v_dashboard_theo_thang;

alter table public.ho_so drop column if exists tong_thu;
alter table public.ho_so drop column if exists tong_chi;
alter table public.ho_so drop column if exists loi_nhuan;

-- Xoá 2 cột cũ ĐÃ gộp xong dữ liệu ở bước C.6
alter table public.ho_so drop column if exists chi_thu_di;
alter table public.ho_so drop column if exists chi_thu_ve;

alter table public.ho_so add column tong_thu numeric generated always as
  (thu_le_phi + thu_in_anh + thu_ho_tro_khac + thu_khach_tip) stored;

alter table public.ho_so add column tong_chi numeric generated always as
  ((chi_le_phi_lanh_su + chi_doi_tac_ctv) * so_luong + chi_phi_ship + chi_phi_khac) stored;

alter table public.ho_so add column loi_nhuan numeric generated always as
  ((thu_le_phi + thu_in_anh + thu_ho_tro_khac + thu_khach_tip)
   - (((chi_le_phi_lanh_su + chi_doi_tac_ctv) * so_luong) + chi_phi_ship + chi_phi_khac)) stored;

create or replace view public.v_dashboard_theo_thang as
select
  date_trunc('month', ngay_nop)::date as thang,
  count(*)                            as so_luong_ho_so,
  sum(tong_thu)                       as doanh_thu,
  sum(loi_nhuan)                      as loi_nhuan
from public.ho_so
where ngay_nop is not null
group by 1
order by 1;

-- ============================================================
-- D. TƯ VẤN (bảng leads) — 2 thay đổi theo yêu cầu PM
-- ============================================================

-- D.1 Số điện thoại không còn bắt buộc ở CSDL (validate "bắt buộc" trước đây chỉ nên còn ở form
--     công khai index.html nếu cần, KHÔNG áp NOT NULL nữa để admin có thể tạo Tư vấn không cần SĐT)
alter table public.leads alter column phone drop not null;

-- D.2 Đổi trạng thái "Đã gọi" -> "Đang tư vấn" (đổi dữ liệu cũ nếu đã có, an toàn chạy lại nhiều lần)
update public.leads set status = 'Đang tư vấn' where status = 'Đã gọi';
-- Cột status vẫn là text tự do, không có CHECK constraint — chỉ cần đổi lại danh sách lựa chọn
-- trong dropdown ở admin.html: Mới / Đang tư vấn / Chốt / Hủy (thay cho Mới/Đã gọi/Chốt/Hủy)

-- ============================================================
-- E. RLS — khach_hang và danh_muc_doi_tac chỉ admin (authenticated), không mở anon
--    (khach_hang có CCCD/Ngày sinh — dữ liệu cá nhân nhạy cảm, tuyệt đối không public)
-- ============================================================

alter table public.khach_hang        enable row level security;
alter table public.danh_muc_doi_tac  enable row level security;

drop policy if exists "auth_all_khach_hang" on public.khach_hang;
create policy "auth_all_khach_hang" on public.khach_hang
  for all to authenticated using (true) with check (true);

drop policy if exists "auth_all_danh_muc_doi_tac" on public.danh_muc_doi_tac;
create policy "auth_all_danh_muc_doi_tac" on public.danh_muc_doi_tac
  for all to authenticated using (true) with check (true);

commit;

-- ============================================================
-- ✅ Hết migration Phase 4.
--
-- BẮT BUỘC chạy 2 câu lệnh sau NGAY SAU KHI COMMIT, đối chiếu với số A/B đã ghi lại ở đầu file:
--
--   select count(*) from public.ho_so;         -- phải BẰNG số A ghi lại trước migration
--   select sum(chi_phi_ship) from public.ho_so; -- phải BẰNG số B ghi lại trước migration
--
-- Nếu khớp đúng cả 2 → migration an toàn, có thể tiếp tục code UI (admin.html).
-- Nếu lệch → dữ liệu có vấn đề, KHÔNG code tiếp, kiểm tra lại/khôi phục từ backup trước khi báo cáo.
-- ============================================================
