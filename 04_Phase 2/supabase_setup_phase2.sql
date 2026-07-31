-- ============================================================
-- SUPABASE SETUP – Phase 2: Quản lý khách hàng (Admin CRM)
-- ✅ ĐÃ PM CONFIRM toàn bộ field (xem Phase2_Ban_giao_Claude_Code.md mục 3, 4.1, 5.1).
--    Chạy trong SQL Editor của project Supabase Phase 1 đang dùng
--    (https://vvnjxvcdnzttcdufjjgo.supabase.co) — chạy lại không lỗi
--    (idempotent), không ảnh hưởng bảng leads/posts/categories cũ.
-- ============================================================

-- ============================================================
-- A. DANH MỤC (Màn hình "Cài đặt chung") — thêm/sửa được sau
-- ============================================================

create table if not exists public.danh_muc_nuoc (
  id      bigint generated always as identity primary key,
  ten     text not null unique,
  active  boolean not null default true
);

create table if not exists public.danh_muc_muc_dich (
  id      bigint generated always as identity primary key,
  ten     text not null unique,
  active  boolean not null default true
);

create table if not exists public.danh_muc_truong_nhom (
  id      bigint generated always as identity primary key,
  ten     text not null unique,
  active  boolean not null default true
);

-- Dữ liệu khởi tạo — lấy từ Quan Ly Khach Hang.xlsx, đã chuẩn hoá
-- (loại "CMTC" khỏi danh sách Nước vì đây là mã mục đích bị nhập nhầm cột)
insert into public.danh_muc_nuoc (ten) values
  ('Nhật Bản'),('Hàn Quốc'),('Úc'),('Đài Loan'),('Mỹ'),
  ('Pháp'),('Thái Lan'),('Đức'),('Anh'),('Canada'),
  ('Trung Quốc'),('New Zealand')
on conflict (ten) do nothing;

-- Danh sách "Mục đích" — PM đã tự chỉnh sửa lại giá trị khởi tạo cuối cùng trong
-- Phase2_Dac_ta.xlsx (sheet 5_Cai_dat_chung), thay cho đề xuất gom nhóm ban đầu của Claude
insert into public.danh_muc_muc_dich (ten) values
  ('Nộp giúp'),('Du học'),('Đoàn tụ'),('Làm việc'),('Du lịch'),
  ('Công tác'),('Thăm thân'),('Thăm bạn'),('Chăm đẻ')
on conflict (ten) do nothing;

-- Trưởng nhóm — PM đã cung cấp danh sách tên thật (sheet 5_Cai_dat_chung), đây là TÊN NGƯỜI,
-- khác với "Đại lý ủy thác" (đơn vị/công ty) ở mục B bên dưới.
-- PM xác nhận: "Ms. Quỳnh Vi/ Hoanh/ Phuc Trang" là 1 người (nhiều tên gọi khác nhau), không phải 3 người.
insert into public.danh_muc_truong_nhom (ten) values
  ('Thủy JP'),('Ms. Trang VJP'),('Ms. Quỳnh Hoa'),('Ms. Thùy Dương'),
  ('Ms. Quỳnh Vi / Hoanh / Phuc Trang')
on conflict (ten) do nothing;

-- ============================================================
-- B. ĐẠI LÝ ỦY THÁC (Master) — Màn hình "Đại lý ủy thác"
--    (PM xác nhận đổi tên hiển thị từ "Đối tác" → "Đại lý ủy thác".
--     Tên bảng/cột kỹ thuật GIỮ NGUYÊN là doi_tac / doi_tac_id để không phải
--     sửa lại toàn bộ khoá ngoại — chỉ nhãn hiển thị trên giao diện đổi.)
-- ============================================================

create table if not exists public.doi_tac (
  id            bigint generated always as identity primary key,
  created_at    timestamptz not null default now(),
  ten_cong_ty   text not null,
  dia_chi       text,
  ten_dai_dien  text,
  sdt_lien_he   text,
  trang_thai    text not null default 'Đang hợp tác',  -- Đang hợp tác / Ngừng hợp tác
  ghi_chu       text
);

-- Bảng phí con — 1 đối tác có nhiều mức phí theo nơi nộp + diện visa + thời điểm
-- (dữ liệu thật cho thấy phí đổi theo thời gian, vd "từ 1/4/2026", "từ 1/7/2026")
create table if not exists public.doi_tac_phi (
  id               bigint generated always as identity primary key,
  doi_tac_id       bigint not null references public.doi_tac(id) on delete cascade,
  noi_nop          text,      -- vd: Đà Nẵng / Hà Nội / HCM (không trình diện) / HCM (có trình diện)
  dien_visa        text,      -- vd: Có COE / Công tác - thăm thân / Du lịch tự túc
  muc_phi          numeric,
  ngay_ap_dung_tu  date not null default current_date,
  ghi_chu          text
);

-- ============================================================
-- C. HỒ SƠ — Màn hình "Quản lý hồ sơ"
-- ============================================================

create table if not exists public.ho_so (
  id                    bigint generated always as identity primary key,
  created_at            timestamptz not null default now(),
  ngay                  date not null default current_date,
  -- (2026-08) Nhãn hiển thị trên UI đổi từ "Trưởng nhóm" → "Đối tác" theo yêu cầu mới nhất —
  -- tên bảng/cột kỹ thuật GIỮ NGUYÊN danh_muc_truong_nhom / truong_nhom_id để không phải sửa FK,
  -- giống cách xử lý doi_tac/doi_tac_id → "Đại lý ủy thác" ở mục B.
  truong_nhom_id        bigint references public.danh_muc_truong_nhom(id) on delete set null,
  ten_khach             text not null,   -- khách chính / người đại diện nhóm
  sdt_khach             text,
  dia_chi               text,
  nuoc_id               bigint references public.danh_muc_nuoc(id) on delete set null,
  muc_dich_id           bigint references public.danh_muc_muc_dich(id) on delete set null,
  -- PM xác nhận: BẮT BUỘC phải chọn 1 Đại lý ủy thác cho mỗi hồ sơ (đổi từ đề xuất ban đầu
  -- là được để trống cho "khách lẻ"). "on delete restrict" để không cho xoá 1 đại lý nếu đang
  -- có hồ sơ tham chiếu tới (tránh hồ sơ cũ bị mất thông tin đại lý ủy thác).
  doi_tac_id            bigint not null references public.doi_tac(id) on delete restrict,
  -- SỐ LƯỢNG — ĐỀ XUẤT MỚI (theo yêu cầu bổ sung của PM): tổng số người trong hồ sơ
  -- (= 1 khách chính + số dòng trong bảng con ho_so_thanh_vien bên dưới). KHÔNG nhập tay —
  -- tự động cập nhật bằng trigger mỗi khi thêm/sửa/xoá thành viên (xem C.2 bên dưới), để
  -- tránh lệch số nếu nhân viên quên cập nhật thủ công.
  so_luong              integer not null default 1,
  -- THU (KHÔNG nhân theo Số lượng — PM chỉ yêu cầu nhân 2 khoản Chi bên dưới, xem rà soát
  -- ở Phase2_Dac_ta.xlsx sheet 6 về rủi ro nếu Thu không tăng theo số người mà Chi có tăng)
  thu_le_phi            numeric not null default 0,
  thu_in_anh            numeric not null default 0,
  thu_ho_tro_khac       numeric not null default 0,
  thu_khach_tip         numeric not null default 0,  -- ĐỀ XUẤT MỚI (2026-08): khách tự thưởng thêm cho nhân viên
  -- CHI — "Phí lãnh sự" và "Đại lý/CTV" là ĐƠN GIÁ/NGƯỜI, nhân với so_luong khi tính Tổng chi.
  -- 3 khoản chi còn lại (thư đi/thư về/phí khác) KHÔNG nhân, giữ nguyên như 1 khoản chung cho cả hồ sơ.
  chi_le_phi_lanh_su    numeric not null default 0,  -- đơn giá/người
  chi_doi_tac_ctv       numeric not null default 0,  -- đơn giá/người
  -- chi_thu_di: KHÔNG còn hiển thị/nhập trên UI (2026-08, gộp vào "Phí ship" = cột chi_thu_ve) —
  -- GIỮ LẠI cột + vẫn cộng vào tong_chi để không mất/lệch lợi nhuận của hồ sơ cũ đã có dữ liệu.
  chi_thu_di            numeric not null default 0,
  chi_thu_ve            numeric not null default 0,  -- hiển thị trên UI là "Phí ship" (2026-08)
  chi_phi_khac          numeric not null default 0,  -- dịch thuật, in ảnh, trích hoa hồng...
  -- TỰ TÍNH — không cần nhập tay
  tong_thu   numeric generated always as (thu_le_phi + thu_in_anh + thu_ho_tro_khac + thu_khach_tip) stored,
  tong_chi   numeric generated always as
    ((chi_le_phi_lanh_su + chi_doi_tac_ctv) * so_luong + chi_thu_di + chi_thu_ve + chi_phi_khac) stored,
  loi_nhuan  numeric generated always as
    ((thu_le_phi + thu_in_anh + thu_ho_tro_khac + thu_khach_tip)
     - ((chi_le_phi_lanh_su + chi_doi_tac_ctv) * so_luong + chi_thu_di + chi_thu_ve + chi_phi_khac)) stored,
  -- TIẾN ĐỘ
  ngay_nop        date,
  ngay_tra_kq     date,
  trang_thai      text not null default 'Đang xử lý',  -- Đang xử lý/Đã nộp/Chờ kết quả/Đậu/Rớt/Hủy
  -- (Đã BỎ cột ngay_nhac_lai ở đây theo xác nhận của PM — "Ngày nhắc tư vấn lại" chỉ áp dụng
  --  cho bảng leads/Tư vấn, không áp dụng cho Hồ sơ. Xem mục D bên dưới.)
  note            text
);

-- ============================================================
-- C.1 NÂNG CẤP BẢNG ho_so ĐÃ CÓ SẴN (project này đã chạy bản migration Phase 2 cũ trước đây,
--     nên "create table if not exists" ở trên KHÔNG áp dụng thay đổi lên bảng đã tồn tại —
--     phải ALTER thủ công để thêm so_luong + đổi công thức tong_chi/loi_nhuan).
--     An toàn chạy lại nhiều lần: nếu bảng vừa được tạo mới ở trên (project chưa từng chạy
--     Phase 2), các lệnh dưới đây chỉ tái tạo lại đúng cấu trúc đã có, không gây lỗi.
-- ============================================================

alter table public.ho_so add column if not exists so_luong integer not null default 1;
alter table public.ho_so add column if not exists thu_khach_tip numeric not null default 0;

-- tong_thu/loi_nhuan được view v_dashboard_theo_thang tham chiếu (sum(...)) → phải xoá view
-- trước khi đổi cột, mục F bên dưới sẽ tạo lại view này nên không mất dữ liệu/định nghĩa.
drop view if exists public.v_dashboard_theo_thang;

alter table public.ho_so drop column if exists tong_thu;
alter table public.ho_so drop column if exists tong_chi;
alter table public.ho_so drop column if exists loi_nhuan;

alter table public.ho_so add column tong_thu numeric generated always as
  (thu_le_phi + thu_in_anh + thu_ho_tro_khac + thu_khach_tip) stored;
alter table public.ho_so add column tong_chi numeric generated always as
  ((chi_le_phi_lanh_su + chi_doi_tac_ctv) * so_luong + chi_thu_di + chi_thu_ve + chi_phi_khac) stored;
alter table public.ho_so add column loi_nhuan numeric generated always as
  ((thu_le_phi + thu_in_anh + thu_ho_tro_khac + thu_khach_tip)
   - ((chi_le_phi_lanh_su + chi_doi_tac_ctv) * so_luong + chi_thu_di + chi_thu_ve + chi_phi_khac)) stored;

-- ============================================================
-- C.1b BẢNG CON "THÀNH VIÊN NHÓM" — theo yêu cầu bổ sung của PM: 1 hồ sơ có thể đi
--       theo nhóm nhiều khách hàng. ten_khach/sdt_khach ở bảng ho_so là khách CHÍNH,
--       bảng này chứa các thành viên ĐI CÙNG (không tính khách chính).
-- ============================================================

create table if not exists public.ho_so_thanh_vien (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  ho_so_id    bigint not null references public.ho_so(id) on delete cascade,
  ten_khach   text not null,
  sdt_khach   text,
  ghi_chu     text
);

-- Trigger giữ ho_so.so_luong luôn đúng = 1 (khách chính) + số thành viên đi cùng
create or replace function public.fn_cap_nhat_so_luong_ho_so()
returns trigger
language plpgsql
as $$
declare
  target_ho_so_id bigint;
begin
  target_ho_so_id := coalesce(new.ho_so_id, old.ho_so_id);
  update public.ho_so
    set so_luong = 1 + (select count(*) from public.ho_so_thanh_vien where ho_so_id = target_ho_so_id)
    where id = target_ho_so_id;
  return null;
end;
$$;

drop trigger if exists trg_cap_nhat_so_luong_ho_so on public.ho_so_thanh_vien;
create trigger trg_cap_nhat_so_luong_ho_so
  after insert or update or delete on public.ho_so_thanh_vien
  for each row execute function public.fn_cap_nhat_so_luong_ho_so();

-- ============================================================
-- C.2 BẢNG CON "XỬ LÝ PHÁT SINH" — theo yêu cầu bổ sung của PM (mục 4, Phase2_Dac_ta.xlsx)
--     Mỗi hồ sơ có thể có nhiều dòng công việc/giấy tờ cần bổ sung phát sinh.
--     PM đã tự chốt 4 giá trị trạng thái. "Quá hạn" trên Dashboard (view F bên dưới) CHỈ
--     tính các dòng đang ở trạng thái "Đang xử lý" (PM xác nhận).
-- ============================================================

create table if not exists public.ho_so_xu_ly_phat_sinh (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  ho_so_id    bigint not null references public.ho_so(id) on delete cascade,
  noi_dung    text not null,
  han_chot    date not null,
  ghi_chu     text,
  trang_thai  text not null default 'Đang xử lý'   -- Đang xử lý / Hủy / Tạm dừng / Hoàn thành
);

-- ============================================================
-- D. MỞ RỘNG BẢNG LEADS CÓ SẴN — dùng chung cho Màn hình "Tư vấn"
--    (không tạo bảng mới để tránh trùng dữ liệu với form đăng ký trên
--    landing page — xem đánh giá hệ thống trong Phase2_Dac_ta.xlsx)
-- ============================================================

alter table public.leads add column if not exists email          text;
alter table public.leads add column if not exists link_fb        text;
alter table public.leads add column if not exists muc_dich       text;   -- xem ghi chú dưới
alter table public.leads add column if not exists ngay_nhac_lai  date;
-- Cột "status" đã có sẵn (Mới/Đã gọi/Chốt/Hủy) — dùng luôn làm trạng thái tư vấn, không thêm cột mới
-- Cột "note" đã có sẵn — dùng làm "Nội dung tư vấn"
-- Cột "country" đã có sẵn — dùng làm "Nước đến"
--
-- PM xác nhận: ở màn Tư vấn, "Nước đến" (country) và "Mục đích" (muc_dich) hiển thị dạng CHỌN TỪ
-- DANH MỤC (dùng chung danh mục danh_muc_nuoc / danh_muc_muc_dich với màn Hồ sơ) và là field bắt
-- buộc trên UI. Tuy nhiên 2 cột này VẪN LÀ TEXT (không đổi sang FK) và KHÔNG đặt NOT NULL ở CSDL —
-- vì bảng leads còn được form đăng ký công khai trên landing page ghi vào (không được sửa ràng buộc
-- ở đây kẻo gãy insert từ index.html). "Bắt buộc" chỉ là validate ở JS phía admin.html khi nhân
-- viên tạo/sửa 1 dòng Tư vấn thủ công.

-- ĐỀ XUẤT THÊM (không bắt buộc, cần PM xác nhận): cột liên kết ngược để biết 1 Hồ sơ được tạo
-- từ dòng Tư vấn nào, phục vụ tính năng "chốt Tư vấn → tạo Hồ sơ" ở mục G bên dưới.
alter table public.ho_so add column if not exists nguon_tu_van_id bigint references public.leads(id) on delete set null;

-- ============================================================
-- E. RLS — toàn bộ bảng Phase 2 chỉ admin (authenticated) được dùng,
--    KHÔNG mở cho anon (đây là dữ liệu nội bộ, khác với leads/posts)
-- ============================================================

alter table public.danh_muc_nuoc        enable row level security;
alter table public.danh_muc_muc_dich    enable row level security;
alter table public.danh_muc_truong_nhom enable row level security;
alter table public.doi_tac              enable row level security;
alter table public.doi_tac_phi          enable row level security;
alter table public.ho_so                enable row level security;
alter table public.ho_so_thanh_vien     enable row level security;
alter table public.ho_so_xu_ly_phat_sinh enable row level security;

drop policy if exists "auth_all_danh_muc_nuoc" on public.danh_muc_nuoc;
create policy "auth_all_danh_muc_nuoc" on public.danh_muc_nuoc for all to authenticated using (true) with check (true);

drop policy if exists "auth_all_danh_muc_muc_dich" on public.danh_muc_muc_dich;
create policy "auth_all_danh_muc_muc_dich" on public.danh_muc_muc_dich for all to authenticated using (true) with check (true);

drop policy if exists "auth_all_danh_muc_truong_nhom" on public.danh_muc_truong_nhom;
create policy "auth_all_danh_muc_truong_nhom" on public.danh_muc_truong_nhom for all to authenticated using (true) with check (true);

drop policy if exists "auth_all_doi_tac" on public.doi_tac;
create policy "auth_all_doi_tac" on public.doi_tac for all to authenticated using (true) with check (true);

drop policy if exists "auth_all_doi_tac_phi" on public.doi_tac_phi;
create policy "auth_all_doi_tac_phi" on public.doi_tac_phi for all to authenticated using (true) with check (true);

drop policy if exists "auth_all_ho_so" on public.ho_so;
create policy "auth_all_ho_so" on public.ho_so for all to authenticated using (true) with check (true);

drop policy if exists "auth_all_ho_so_thanh_vien" on public.ho_so_thanh_vien;
create policy "auth_all_ho_so_thanh_vien" on public.ho_so_thanh_vien for all to authenticated using (true) with check (true);

drop policy if exists "auth_all_ho_so_xu_ly_phat_sinh" on public.ho_so_xu_ly_phat_sinh;
create policy "auth_all_ho_so_xu_ly_phat_sinh" on public.ho_so_xu_ly_phat_sinh for all to authenticated using (true) with check (true);

-- ============================================================
-- F. VIEW hỗ trợ Dashboard (đọc trực tiếp, không cần tính tay trong JS)
-- ============================================================

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

create or replace view public.v_ho_so_dang_xu_ly as
select count(*) as so_luong
from public.ho_so
where trang_thai in ('Đang xử lý','Đã nộp','Chờ kết quả');

-- PM xác nhận: nhắc lại CHỈ áp dụng cho Tư vấn (leads), không áp dụng cho Hồ sơ
create or replace view public.v_tu_van_can_nhac_lai as
select id, name as ten_khach, phone as sdt_khach, ngay_nhac_lai
from public.leads
where ngay_nhac_lai between current_date and current_date + 7
order by ngay_nhac_lai;

-- Dashboard mục 7-8: danh sách "Xử lý phát sinh" có Hạn chốt trong 7 ngày tới,
-- kèm cờ qua_han/den_han để FE tô đỏ (qua_han: đã trễ hạn; den_han: đúng hôm nay)
create or replace view public.v_xu_ly_phat_sinh_7_ngay as
select
  x.id, x.ho_so_id, h.ten_khach, x.noi_dung, x.han_chot, x.ghi_chu,
  (x.han_chot < current_date)  as qua_han,
  (x.han_chot = current_date)  as den_han
from public.ho_so_xu_ly_phat_sinh x
join public.ho_so h on h.id = x.ho_so_id
where x.trang_thai = 'Đang xử lý'   -- PM xác nhận: quá hạn chỉ tính khi đang ở trạng thái này
  and x.han_chot <= current_date + 7
order by x.han_chot;

-- ============================================================
-- G. GHI CHÚ NGHIỆP VỤ (không phải SQL) — luồng "Tư vấn chốt → tạo Hồ sơ"
--    PM yêu cầu: khi lưu 1 dòng Tư vấn với Trạng thái = "Chốt", hiện popup hỏi có muốn
--    tạo thêm 1 Hồ sơ từ thông tin đó không. Đây là logic UI (admin.html), không cần bảng mới.
--    - Đồng ý → điều hướng sang tab Hồ sơ, mở form tạo mới, PRE-FILL: Tên khách (name),
--      SĐT (phone), Nước đến (country), Mục đích (muc_dich), Note (= note "Nội dung tư vấn"),
--      nguon_tu_van_id = id của dòng leads này. Đại lý ủy thác KHÔNG pre-fill được (Tư vấn không
--      thu thập field này) — nhân viên phải tự chọn trước khi lưu vì đây là field bắt buộc.
--    - Không cần → chỉ lưu dòng Tư vấn, ở lại màn Tư vấn, không điều hướng.
--    - PM xác nhận: popup hiện MỖI LẦN lưu 1 dòng đang ở Trạng thái = "Chốt" (kể cả dòng đã
--      Chốt từ trước, không chỉ lần đầu chuyển trạng thái) — không cần cờ theo dõi đã hỏi hay chưa.
-- ============================================================

-- ✅ Hết migration Phase 2 — đã confirm, sẵn sàng chạy trong SQL Editor.
