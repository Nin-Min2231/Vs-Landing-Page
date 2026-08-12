# Tool backup dữ liệu Supabase về máy

Công cụ này tải TOÀN BỘ dữ liệu (17 bảng: khách hàng, hồ sơ, tư vấn, tài chính, bài viết...) từ
Supabase về máy tính, lưu thành file JSON + CSV (mở được bằng Excel/Notepad). Chạy tay khi nào
muốn, không tự động.

## Bước 1 — Chuẩn bị (chỉ làm 1 lần)

1. Copy file `backup-config.example.json` trong thư mục này, đổi tên bản copy thành
   `backup-config.json`.
2. Mở `backup-config.json` bằng Notepad, dán khóa **service_role** thật vào chỗ
   `"dán khóa service_role thật của bạn vào đây"`.
   - Đây chính là khóa `SUPABASE_SERVICE_ROLE_KEY` đã dùng để cấu hình Cloudflare Worker (chuông
     thông báo) — dùng lại đúng giá trị đó là được, không cần tạo khóa mới riêng cho việc này.
   - Lấy lại tại: Supabase Dashboard → Project Settings → API → mục "Secret keys".
3. Lưu file lại.

⚠️ **Không bao giờ chia sẻ file `backup-config.json` cho ai, không gửi qua chat/email** — khóa
này có toàn quyền trên toàn bộ database. File này đã được chặn tự động không cho lên GitHub
(xem `.gitignore` ở thư mục gốc dự án).

## Bước 2 — Chạy backup

Double-click file **`Chay_Backup.bat`** trong thư mục này. Đợi vài giây, cửa sổ đen hiện ra sẽ báo
tiến trình từng bảng, xong thì báo "🎉 Xong!".

## Kết quả nằm ở đâu?

Trong thư mục con `backups/<ngày giờ>/`, ví dụ `backups/2026-08-12-1530/`. Mỗi bảng có 2 file:
- `<tên bảng>.json` — dùng nếu sau này cần khôi phục lại bằng script.
- `<tên bảng>.csv` — mở trực tiếp bằng Excel để xem/kiểm tra dữ liệu.

## Lưu ý quan trọng

- **Thư mục `backups/` không được đưa lên GitHub** (đã chặn sẵn trong `.gitignore`) vì chứa dữ
  liệu khách hàng thật (tên, SĐT, email...) — repo dự án đang ở chế độ công khai (public).
- Nên copy thư mục `backups/<ngày giờ>/` mới nhất ra ổ cứng ngoài hoặc Google Drive/OneDrive định
  kỳ (vd mỗi tuần) để phòng trường hợp máy hỏng — bản thân file nằm trên máy không tự động sao lưu
  đi đâu khác.
- Muốn xóa bớt các bản backup cũ để đỡ chiếm dung lượng ổ đĩa thì xóa trực tiếp các thư mục con
  trong `backups/` là được, không ảnh hưởng gì tới dữ liệu thật trên Supabase.
