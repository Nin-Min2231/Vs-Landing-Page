# Handover — Bàn giao sang phiên làm việc mới (2026-08-10, bản 6 — GHI ĐÈ toàn bộ bản cũ)

> File này **GHI ĐÈ HOÀN TOÀN** mọi bản handover cũ (bản 1→5) — **không cần đọc lại bản cũ**, nội
> dung quan trọng còn giá trị đã gom hết vào đây. Đọc theo đúng thứ tự: `CLAUDE.md` (toàn bộ, đặc
> biệt mục 33-34 cho thay đổi phiên này) → file này → bắt tay vào **mục 1**.

## 0. Trạng thái ngay lúc viết file này

- Nhánh làm việc: `claude/handover-phien-moi-015f64` — **đã push và fast-forward vào `main`** (3
  commit: `0bd8f92`, `bc71278`, `b0fd786`), Cloudflare đã tự deploy. **NGOẠI TRỪ commit MỚI NHẤT
  của phiên này** (menu mobile tự đóng + loại thông báo thứ 4 "Xử lý phát sinh") — commit này **có
  thể CHƯA push** tùy thời điểm đọc file, kiểm tra `git log`/`git status` trước khi kết luận.
- Hạ tầng thông báo (mục 33 CLAUDE.md) đã **chạy thật và PM xác nhận hoạt động**: đã chạy
  `05_Database/08_supabase_setup_phase8.sql`, đã cấu hình đúng 2 secret trên Cloudflare (dạng
  Encrypt), Cron Trigger đang "Active" (đặt `*/5 * * * *`, không phải `*/10` như code gợi ý ban
  đầu — không sao, đã xác nhận với PM). Chuông thông báo trong `admin.html` đã test OK.
- **Việc CẦN làm ngay** (xem đầy đủ ở mục 1): chạy thêm migration mới
  `05_Database/09_supabase_setup_phase9.sql` (loại thông báo thứ 4).

## 1. Việc CẦN LÀM NGAY

1. **Chạy `05_Database/09_supabase_setup_phase9.sql` trong Supabase SQL Editor** — thêm cột
   `notifications.ref_parent_id` + nới CHECK constraint cho phép loại thông báo mới `'xlps'`. Chưa
   chạy thì thông báo "Xử lý phát sinh" sẽ báo lỗi khi Worker cố insert.
2. Xác nhận commit mới nhất (menu mobile + loại thông báo thứ 4) đã push lên `main` chưa — nếu
   `git push` bị chặn bởi permission classifier (đã xảy ra vài lần trong phiên này), cần người
   dùng tự chạy `git push origin claude/handover-phien-moi-015f64` rồi
   `git push origin claude/handover-phien-moi-015f64:main`.
3. **Test thật trên điện thoại việc ĐẨY thông báo ra màn hình khóa** — phần duy nhất CHƯA có xác
   nhận riêng (chuông trong trang đã test OK, nhưng "khóa màn hình vẫn nhận được" thì chưa). Bấm
   chuông → "Bật thông báo đẩy trên thiết bị này" trên điện thoại thật → tạo 1 xử lý phát sinh có
   Hạn chốt = hôm nay (hoặc đợi có sẵn dữ liệu) → đợi tối đa 5-10 phút → khóa màn hình xem có nhận
   được không.
4. Test loại thông báo mới "⚠️ Xử lý phát sinh" + menu mobile tự đóng (cả 2 đã tự test qua Claude
   Browser với dữ liệu giả lập, xem mục 3, nhưng chưa có xác nhận trên thiết bị/dữ liệu thật).

## 2. Tóm tắt việc phiên này đã làm (2026-08-10, nối tiếp việc dựng hạ tầng thông báo ở mục 33)

Sau khi PM tự tay chạy migration/cấu hình secret theo hướng dẫn mục 33, phát sinh thêm 1 lỗi thật
+ 2 yêu cầu chỉnh sửa — đã xử lý cả 3, ghi chi tiết đầy đủ ở `CLAUDE.md` mục 34:

1. **Sự cố thật: quên hướng dẫn thêm biến `SUPABASE_URL`** cho Cloudflare Worker — khiến job chạy
   "Success" nhưng thực chất không làm gì (im lặng). Đã sửa tận gốc: hardcode `SUPABASE_URL` thẳng
   trong `worker.js` (như đã làm với `VAPID_PUBLIC_KEY`), không cần biến môi trường này nữa. Đồng
   thời tách try/catch riêng cho từng loại thông báo để 1 loại lỗi không chặn im lặng cả 3 loại còn
   lại — bài học rút ra: ưu tiên hardcode giá trị KHÔNG nhạy cảm thay vì bắt PM thêm biến, giảm rủi
   ro thiếu sót không có tín hiệu lỗi rõ ràng.
2. **Menu mobile trên `index.html`**: trước đây bấm hamburger mở ra là đứng yên luôn, không tự
   đóng khi bấm 1 mục hay bấm ra ngoài. Đã đổi sang event delegation trên `#navLinks` (tự hoạt
   động cả với menu "Danh mục bài viết" chèn động, mục 31.F) + listener đóng khi click ra ngoài
   (dùng đúng mẫu `stopPropagation()` đã có sẵn cho nút liên hệ nổi `floatContact`).
3. **Loại thông báo thứ 4 — "⚠️ Xử lý phát sinh"**: báo khi 1 dòng xử lý phát sinh (trong dialog
   Hồ sơ) có Hạn chốt = hôm nay và còn "Đang xử lý". Nội dung: `"Tên khách hàng_Nước đến_ Nội
   dung"`. Cần cột mới `ref_parent_id` (migration 09, xem mục 1) vì bản ghi gốc của loại này là 1
   dòng xử lý phát sinh (không phải hồ sơ), nhưng bấm vào cần mở đúng Hồ sơ CHA — xem giải thích kỹ
   thuật đầy đủ ở `CLAUDE.md` mục 34.C (đặc biệt lý do KHÔNG được dùng `ho_so_id` làm `ref_id`).
4. **Đổi cách xóa thông báo**: PM phản hồi nút "Xóa đã đọc" cũ xóa hết cùng lúc không kiểm soát
   được — đã đổi sang tick chọn từng thông báo (checkbox mỗi dòng) rồi bấm "Xóa đã chọn". (Việc
   này làm ở lượt trước loại thông báo thứ 4 trong cùng phiên, đã push thành công — commit
   `b0fd786`.)

## 3. ⚠️ Sự cố đã xảy ra trong toàn bộ quá trình (tổng hợp, đã xử lý xong hết)

- **Lộ giá trị thật của `SUPABASE_SERVICE_ROLE_KEY`** qua ảnh chụp màn hình PM gửi trong chat (biến
  đặt kiểu "Plaintext" nên hiện nguyên giá trị). Đã hướng dẫn PM: tạo khóa `service_role` MỚI trong
  Supabase, xóa khóa cũ bị lộ, cập nhật lại Cloudflare, đổi loại biến sang "Encrypt" — PM xác nhận
  đã làm xong.
- **1-2 dòng dữ liệu thử nghiệm** ("Nguyễn Văn Test", SĐT 0912345678) từng bị gửi thật vào bảng
  `leads` production lúc Claude Code test form đăng ký bằng cách mô phỏng submit thật (không mock
  fetch) — đã báo ngay, PM đã xóa.
- **Thiếu `SUPABASE_URL`** khiến job chạy nền không hoạt động dù không báo lỗi gì — đã sửa (mục 2.1).
- **`git push` bị chặn** bởi permission classifier của phiên làm việc nhiều lần — mỗi lần đều phải
  nhờ PM tự chạy 2 lệnh push (nhánh + fast-forward main). Không phải lỗi code, là giới hạn quyền
  của môi trường agent.

## 4. Cách đã test trong phiên này

- **Menu mobile**: Claude Browser ở khổ 375px — mở bằng hamburger, đóng khi click ra ngoài
  (`document.body`), đóng khi click 1 link (kể cả link giả lập chèn động sau), hamburger vẫn toggle
  bình thường không bị nhiễu bởi listener mới.
- **Loại thông báo "xlps"**: mock `fetch` cho `worker.js` (chạy như ES module qua Node, xem mục 4
  bản handover cũ để biết cách làm) — xác nhận 2 xử lý phát sinh khác nhau CÙNG 1 hồ sơ tạo được
  ĐÚNG 2 thông báo riêng biệt (không bị trùng do `ref_id`), `ref_parent_id` đúng bằng `ho_so_id`,
  định dạng nội dung đúng mẫu PM yêu cầu. Qua Claude Browser (mock `api()`): nhãn hiển thị đúng
  "⚠️ Xử lý phát sinh: ...", bấm vào mở đúng `switchTab('hoso')` + `openHoSoModal(ref_parent_id)`
  (không phải `ref_id`).
- **Xóa chọn lọc thông báo**: mock `api()` — không chọn gì mà bấm Xóa → báo lỗi, không gọi API;
  chọn đúng 2/4 dòng → chỉ 2 dòng đó bị xóa; tick checkbox không vô tình kích hoạt điều hướng của
  cả dòng (đã kiểm tra `event.stopPropagation()` hoạt động đúng).
- Đã xóa `.claude/launch.json` tạo tạm sau mỗi lần test, đúng quy tắc không để lại file thừa.

## 5. Quy trình deploy — vẫn dùng đúng cách cũ, xem chi tiết ở CLAUDE.md mục 5/33

Lưu ý riêng phiên này: `git push` bị permission classifier chặn nhiều lần (không phải lỗi cố định
— có lúc chặn có lúc không, không rõ quy luật) — nếu gặp lại, đưa nguyên 2 lệnh push cho người dùng
tự chạy, không cố tìm cách vượt qua.

## 6. Tài liệu tham khảo (đọc theo thứ tự nếu cần)

`CLAUDE.md` (toàn bộ, đặc biệt mục 33-34) → file này → `05_Database/README.md` (thứ tự chạy SQL,
file `09` là file MỚI nhất, BẮT BUỘC chạy trước khi loại thông báo "xlps" hoạt động được).
