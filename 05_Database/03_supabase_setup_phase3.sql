-- ============================================================
-- SUPABASE SETUP – Phase 3: Tài chính (Khoản thu tự động từ Hồ sơ + Khoản chi nhập tay)
-- ✅ Đã phân tích theo yêu cầu PM — xem rà soát ở Phase3_TaiChinh_Ban_giao_Claude_Code.md mục 7
--    trước khi code (có 2 điểm Ưu tiên Cao cần đọc kỹ để không hiểu nhầm khái niệm).
-- Chạy trong SQL Editor của project Supabase đang dùng — chạy lại không lỗi (idempotent).
-- YÊU CẦU: bảng public.ho_so (Phase 2) đã tồn tại trước khi dùng tính năng này
--          (migration này KHÔNG tạo lại ho_so, chỉ đọc từ đó ở phía ứng dụng).
-- ============================================================

-- ============================================================
-- A. BẢNG MỚI "KHOẢN CHI" — chi phí vận hành công ty, nhập tay tại màn hình Tài chính.
--    LƯU Ý: bảng này KHÔNG liên quan tới các cột chi_... đã có trong public.ho_so
--    (những cột đó là chi phí RIÊNG của từng hồ sơ, đã trừ vào loi_nhuan của hồ sơ rồi).
--    Cộng thêm ở đây sẽ bị tính trùng — xem mục 3, Phase3_TaiChinh_Ban_giao_Claude_Code.md.
-- ============================================================

create table if not exists public.khoan_chi (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  ngay        date not null default current_date,
  noi_dung    text not null,
  so_tien     numeric not null check (so_tien > 0),
  ghi_chu     text
);

comment on table public.khoan_chi is
  'Chi phí vận hành công ty (lương, thuê văn phòng, marketing...) — nhập tay tại màn Tài chính. '
  'KHÔNG liên quan tới các cột chi_... trong ho_so (chi phí riêng từng hồ sơ, đã trừ vào loi_nhuan hồ sơ đó rồi).';

-- ============================================================
-- B. RLS — chỉ admin (authenticated) được dùng, KHÔNG mở cho anon
--    (cùng mức độ nhạy cảm như ho_so ở Phase 2 — dữ liệu tài chính nội bộ)
-- ============================================================

alter table public.khoan_chi enable row level security;

drop policy if exists "auth_all_khoan_chi" on public.khoan_chi;
create policy "auth_all_khoan_chi" on public.khoan_chi
  for all to authenticated using (true) with check (true);

-- ============================================================
-- C. GHI CHÚ NGHIỆP VỤ (không phải SQL) — cách lấy dữ liệu "Khoản thu"
--    Không tạo view/join CSDL — gộp dữ liệu ở phía client (JS), đúng triết lý dự án
--    (gọi thẳng fetch(), không SDK/ORM). Xem chi tiết 2 câu query mẫu ở mục 5,
--    Phase3_TaiChinh_Ban_giao_Claude_Code.md:
--      1) GET ho_so?select=id,ten_khach,ngay_tra_kq,loi_nhuan,danh_muc_nuoc(ten)
--                 &trang_thai=eq.Đậu&ngay_tra_kq=gte.{from}&ngay_tra_kq=lte.{to}
--      2) GET khoan_chi?select=*&ngay=gte.{from}&ngay=lte.{to}
--    Gộp 2 mảng kết quả ở JS, sort theo ngày giảm dần, hiển thị chung 1 bảng.
-- ============================================================

-- ✅ Hết migration Phase 3 — sẵn sàng chạy trong SQL Editor (sau khi Phase 2 đã chạy).
