# 05_Database — Nơi DUY NHẤT chứa file SQL cần chạy trên Supabase

> Từ 2026-08-04, đây là thư mục **duy nhất** chứa các file SQL setup/migration của dự án. Các bản
> cũ từng nằm rải rác ở `02_Source/supabase_setup.sql`, `04_Phase 2/supabase_setup_phase2.sql`,
> `06_Phase 3_Tai_Chinh/supabase_setup_phase3.sql`, `07_Phase 4_Thong_Tin_Khach_Hang/supabase_setup_phase4.sql`
> đã được gom về đây và **xóa bản gốc** để tránh nhầm lẫn chạy nhầm file cũ. **Claude Code/Cowork
> từ nay khi cần thêm/sửa schema Supabase thì sửa/thêm file trong thư mục này** (không tạo lại các
> thư mục Phase rải rác như trước).

## Chạy theo đúng thứ tự (chỉ cần cho project Supabase HOÀN TOÀN MỚI, chưa từng chạy gì)

1. `01_supabase_setup.sql` — Phase 1: bảng `leads`, `posts`, `categories` (landing page + form đăng ký).
2. `02_supabase_setup_phase2.sql` — Phase 2: bảng `ho_so`, `ho_so_thanh_vien`, `ho_so_xu_ly_phat_sinh`,
   `danh_muc_nuoc`, `danh_muc_muc_dich`, `danh_muc_truong_nhom`, `danh_muc_doi_tac`, `doi_tac`,
   `doi_tac_phi` + mở rộng bảng `leads` (thêm `email`, `link_fb`, `muc_dich`, `ngay_nhac_lai`,
   `nguon`) + các view Dashboard.
3. `03_supabase_setup_phase3.sql` — Phase 3: bảng `khoan_chi` (Tài chính).
4. `04_supabase_setup_phase4.sql` — Phase 4: bảng `khach_hang` + đổi cột `chi_thu_di`/`chi_thu_ve`
   trên `ho_so` thành `chi_phi_ship`.
5. `05_supabase_setup_phase5.sql` — Phase 5: `doi_tac_phi` thêm `nuoc_id`/`muc_dich_id` (droplist
   Nước đến/Mục đích), thêm `phi_lanh_su`, đổi tên `muc_phi` -> `phi_uy_thac`.
6. `06_supabase_setup_phase6.sql` — Phase 6: `danh_muc_nuoc` thêm `le_phi`/`thoi_gian_xet_duyet`/
   `checklist`/`ghi_chu` (dialog "Nước đến" mở rộng, Cài đặt chung).
7. `07_supabase_setup_phase7.sql` — Phase 7: `ho_so.doi_tac_id` bỏ NOT NULL, `posts` thêm
   `phan_loai`, bảng mới `dich_vu_gia` (giá "Dịch vụ Visa các quốc gia" trên landing page, quản lý
   qua Cài đặt chung) — có seed 8 dòng giá mặc định theo yêu cầu PM.
8. `08_supabase_setup_phase8.sql` — Phase 8: bảng mới `notifications` (chuông thông báo admin.html:
   trả kết quả hôm nay / nhắc tư vấn hôm nay / khách đăng ký mới) + `push_subscriptions` (đăng ký
   nhận thông báo đẩy Web Push ra điện thoại) — cả 2 chỉ `authenticated` (admin) truy cập được.

**Nếu database ĐÃ chạy qua các bản cũ trước đây** (trường hợp thực tế của dự án này — Supabase
project đang dùng đã qua đủ cả 4 phase): chỉ cần chạy file nào **có thay đổi mới** kể từ lần chạy
gần nhất (Claude Code sẽ báo rõ file nào khi hoàn thành 1 thay đổi cần migration). Tất cả 4 file
đều viết theo kiểu **idempotent** (dùng `if not exists`/`if exists`/`DO` block tự kiểm tra điều
kiện) — chạy lại toàn bộ cả 4 file theo đúng thứ tự trên **không gây lỗi và không mất dữ liệu**,
nếu nghi ngờ có sai lệch thì cứ chạy lại từ đầu cho chắc.

## Quy tắc khi thêm migration mới

- Không tạo file SQL rải rác ở thư mục khác — luôn thêm vào đây, đặt tên
  `05_supabase_setup_phaseN.sql` (tăng dần theo thứ tự thời gian) HOẶC nối thêm vào cuối file
  `04_supabase_setup_phase4.sql` nếu thay đổi nhỏ liên quan trực tiếp tới phase gần nhất — tùy
  ngữ cảnh, hỏi lại người dùng nếu không chắc nên tạo file mới hay nối vào file có sẵn.
- Luôn giữ file **idempotent** (`create table if not exists`, `alter table ... add column if not
  exists`, bọc `DO $$ ... $$` khi cần kiểm tra điều kiện phức tạp hơn `if not exists` cho phép).
- **Không tự ý thêm `insert into ...`** (dữ liệu mẫu) — xem `CLAUDE.md` mục 10.
- Nếu 1 migration mới ĐỔI/XÓA cột mà 1 file cũ trong này còn tham chiếu tới (như lỗi `chi_thu_di`
  đã gặp giữa Phase 2 và Phase 4, xem `CLAUDE.md` mục 15/`Handover_Phien_Moi.md` mục 3.8) — phải
  bọc lại đoạn liên quan trong file CŨ bằng điều kiện kiểm tra (`DO` block + `information_schema`)
  để file cũ vẫn an toàn khi chạy lại trên database đã qua migration mới, không chỉ sửa mỗi file
  mới rồi bỏ mặc file cũ.
