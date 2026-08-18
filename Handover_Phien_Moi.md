# Handover — Bàn giao sang phiên làm việc mới (2026-08-18, bản 8 — GHI ĐÈ toàn bộ bản cũ)

> File này **GHI ĐÈ HOÀN TOÀN** mọi bản handover cũ (bản 1→7) — **không cần đọc lại bản cũ**, nội
> dung quan trọng còn giá trị đã gom hết vào đây. Đọc theo đúng thứ tự: `CLAUDE.md` (toàn bộ, đặc
> biệt mục 35-43 cho thay đổi phiên 14/8 và 18/8) → file này → bắt tay vào **mục 1**.

## 0. Trạng thái ngay lúc viết file này

- Nhánh làm việc: **đẩy thẳng lên `main`** như 2 phiên trước, không qua branch riêng, không bị
  chặn quyền `git push` lần nào. 4 commit mới từ `c92e8d9` đến `bdd065b`, tất cả đã lên `main` và
  **đã tự xác nhận deploy live** bằng cách `curl` poll trang thật sau mỗi lần push (không cần đợi
  PM tự check Cloudflare Dashboard) — cách làm này nên áp dụng tiếp cho các phiên sau.
- **✅ Đã giải quyết trong phiên này:** PM xác nhận đã chạy `10_supabase_setup_phase10.sql` — chuông
  thông báo trong `admin.html` từ đó hoạt động đúng (tự cập nhật, đếm đúng số chưa đọc).
- **⚠️ VẤN ĐỀ CÒN ĐANG TREO — ưu tiên số 1 phiên mới:** Web Push (thông báo hệ thống ra màn hình
  điện thoại, kiểu như tin nhắn/SMS đến, hoạt động cả khi đã tắt hẳn app) — tính năng này tồn tại từ
  Phase 8 (10/8) nhưng **CHƯA TỪNG có xác nhận thật hoạt động trên thiết bị** cho tới tận phiên này.
  Đã tìm + sửa 1 bug thật (mục 3 dưới) khiến subscription bị "mất đồng bộ" với server. PM (dùng
  Android) đã xác nhận bấm nút và thấy toast "Đã bật thông báo đẩy trên thiết bị này" (bước đăng ký
  ĐÃ thành công phía client) — nhưng **CHƯA xác nhận đã thật sự nhận được thông báo hệ thống** khi
  tắt hẳn Chrome. Đã hướng dẫn PM quy trình test 4 bước (mục 1.1) — **PM CHƯA báo lại kết quả**.

## 1. Việc CẦN LÀM NGAY

1. **Hỏi PM kết quả test Web Push thật** (đã hướng dẫn: tạo/sửa 1 hồ sơ có Ngày trả KQ = hôm nay →
   tắt hẳn Chrome (vuốt khỏi đa nhiệm) → đợi tối đa 10 phút (chu kỳ cron) → xem điện thoại có hiện
   thông báo "Top Visa 5S Admin" không).
   - **CÓ nhận được** → tính năng Web Push coi như HOÀN TẤT, đóng hẳn vấn đề đã treo từ 10/8. Cập
     nhật lại CLAUDE.md mục 33/43 xác nhận đã kiểm chứng thật (hiện đang ghi "chưa kiểm chứng").
   - **KHÔNG nhận được** → tiếp mục 2.
2. Nếu vẫn không nhận được thông báo, kiểm tra theo đúng thứ tự (đã note sẵn ở CLAUDE.md mục 43,
   phần "Các nguyên nhân KHÁC"):
   - Android Cài đặt → Ứng dụng → Chrome → Thông báo — có bị chặn ở cấp hệ điều hành không (lớp
     quyền này KHÁC quyền `Notification` JS, code không kiểm soát được).
   - Máy có phải dòng Xiaomi/Oppo/Vivo/Huawei hay không — các dòng này thường tự giới hạn chạy nền,
     có thể giết mất Service Worker.
   - Cloudflare Dashboard → Worker → Observability → bật "Logs" → đợi đúng lúc có thông báo mới
     được tạo (xem trong bảng `notifications`) để bắt lỗi thật từ `sendWebPush()` (nghi vấn còn lại
     lớn nhất: khóa `VAPID_PRIVATE_KEY_JWK` trên Cloudflare có tồn tại — đã xác nhận qua ảnh chụp
     PM gửi trước đây — nhưng **GIÁ TRỊ chưa từng được verify là đúng/còn hiệu lực**).
3. (Chỉ làm nếu PM chủ động muốn, KHÔNG tự ý thêm) Nếu PM muốn test nhanh hơn thay vì chờ 10 phút
   mỗi lần, có thể cân nhắc thêm 1 route thủ công trong `worker.js` để tự bấm gửi push ngay — CHƯA
   làm vì cần thêm lớp xác thực (route công khai không bảo vệ = ai cũng gọi được, spam push tới mọi
   thiết bị đã đăng ký), cần hỏi rõ PM trước khi làm.

## 2. Tóm tắt việc phiên này đã làm (tiếp nối bản 7 — mục mới 41→43 trong `CLAUDE.md`)

- **Mục 41 — Tài chính/Dashboard, "Lợi nhuận" đổi công thức** (`a680aea`): PM yêu cầu "Lợi nhuận" =
  tổng `loi_nhuan` của hồ sơ `Đậu`+`Rớt`+`Hủy` (mở rộng từ chỉ `Đậu`), loại bỏ hồ sơ `loi_nhuan=0`,
  **giá trị ÂM (Rớt/Hủy lỗ) vẫn tính**. **KHÔNG còn trừ "Khoản chi"** vào Lợi nhuận nữa — Khoản chi
  vẫn hiển thị/quản lý riêng như cũ (CRUD không đổi), chỉ tách khỏi phép tính. Đã sửa đồng bộ cả
  `renderTaiChinh()` VÀ `renderDashboard()` (theo đúng nguyên tắc mục 27 — 2 màn phải luôn khớp số
  nhau). Sửa thêm: màu dòng list theo đúng DẤU thật của số tiền (trước đây to xanh cứng mọi dòng
  "Thu", giờ hồ sơ Rớt/Hủy âm sẽ tô đỏ đúng).
- **Mục 42 — Hồ sơ, sort mặc định 3 tầng ưu tiên** (`a680aea` rồi SỬA LẠI NGAY ở `c2fbb1d` cùng
  phiên): PM yêu cầu 2 lượt liên tiếp — lượt 1 tách riêng "Đã nộp" sort theo Ngày trả KQ (còn 4
  trạng thái khác vẫn mỗi trạng thái 1 khối riêng theo Ngày tạo). PM đưa ví dụ cụ thể ngay sau đó
  cho thấy **"Đậu"/"Rớt"/"Hủy" phải GỘP CHUNG 1 NHÓM DUY NHẤT** (xen kẽ lẫn nhau theo Ngày tạo,
  KHÔNG tách 3 khối riêng theo trạng thái) — bản lượt 1 đã SAI ở điểm này, phải sửa lại ngay trong
  cùng phiên. Kết quả cuối cùng đúng: Ưu tiên 1 "Đang xử lý" (theo Ngày tạo) → Ưu tiên 2 "Đã nộp"
  (theo Ngày trả KQ) → Ưu tiên 3 "Đậu"+"Rớt"+"Hủy" gộp chung (theo Ngày tạo, xen kẽ 3 trạng thái).
  **Bài học quan trọng:** khi PM đưa ví dụ dữ liệu cụ thể kèm yêu cầu, PHẢI mô phỏng đúng y ví dụ đó
  trước khi code — chỉ đọc mô tả bằng chữ dễ hiểu sai kiểu "tách riêng theo trạng thái" hay "gộp
  chung theo ngày", 2 cách hiểu ra kết quả khác hẳn nhau.
- **Mục 43 — Sửa bug thật: Web Push không tới điện thoại** (`bdd065b`): PM báo chuông trong trang
  vẫn cập nhật (đọc thẳng DB, không qua push) nhưng điện thoại không nhận được gì. Tìm ra bug trong
  `subscribePush()`: nếu trình duyệt ĐÃ có sẵn `PushSubscription` object thì hàm return ngay, KHÔNG
  lưu/đồng bộ lại bảng `push_subscriptions` — nếu dòng đó từng bị mất ở server (nghi do sự cố khóa
  `SUPABASE_SERVICE_ROLE_KEY` sai trước đó, mục 35), trình duyệt vẫn "tưởng" đã đăng ký (không hỏi
  lại quyền, không báo lỗi) nhưng server không biết thiết bị này tồn tại → không gửi push được. Đã
  sửa: LUÔN đồng bộ lại `push_subscriptions` (upsert an toàn) mỗi lần gọi, chỉ bỏ qua bước xin
  quyền/tạo subscription MỚI khi trình duyệt đã có sẵn. Thêm toast báo lỗi rõ khi bị từ chối quyền
  (trước đây im lặng). PM đã xác nhận thấy toast thành công sau khi đăng nhập lại — **nhưng đây chỉ
  xác nhận bước ĐĂNG KÝ, chưa xác nhận bước NHẬN PUSH THẬT** (xem mục 1).

## 3. Sự cố/bài học (tổng hợp thêm, ngoài mục 2)

- Tính năng Web Push đã "treo" không ai biết trong **hơn 1 tuần** (10/8 → 18/8) vì chưa từng được
  test thật trên thiết bị — mọi handover trước đều ghi "chưa kiểm chứng" nhưng không ai chủ động
  đẩy việc test này lên ưu tiên cao hơn. Bài học: tính năng phụ thuộc thiết bị thật (push, PWA, mở
  camera/GPS...) nên có lịch test thật SỚM ngay sau khi code xong, không để "chưa kiểm chứng" trôi
  qua nhiều ngày/nhiều phiên mà không ai theo dõi lại.

## 4. Cách đã test phiên này

- Tài chính/Dashboard (mục 41): mock `api()`/`HO_SO` qua Claude Browser — xác nhận số tổng đúng
  (gồm cả giá trị âm), hồ sơ `loi_nhuan=0`/sai trạng thái/ngoài khoảng ngày bị loại đúng, màu dòng
  theo đúng dấu, "Khoản chi" vẫn hiển thị độc lập.
- Hồ sơ sort (mục 42): mock `HO_SO` đủ cả 3 tầng, xáo trộn thứ tự dữ liệu đầu vào (không để trùng
  hợp đúng sẵn) — xác nhận output khớp CHÍNH XÁC ví dụ PM đưa cho cả 3 tầng.
- `subscribePush()` fix (mục 43): mock `navigator.serviceWorker`/`PushManager`/`Notification`/
  `api()`/`toast()` — xác nhận 2 tình huống (đã có subscription cũ ở trình duyệt → vẫn gọi lại đúng
  API lưu vào DB; bị từ chối quyền → hiện đúng toast lỗi, không gọi API).
- **CHƯA/KHÔNG thể test được trong phiên này:** liệu push THẬT có tới được 1 thiết bị Android thật
  hay không — đây là giới hạn của môi trường agent (không có thiết bị thật), bắt buộc phải chờ PM
  tự xác nhận (xem mục 1).

## 5. Quy trình deploy

Vẫn `git push` thẳng `main`, Cloudflare tự deploy trong vài chục giây — phiên này đã tự động hóa
việc xác nhận deploy xong bằng lệnh `curl` poll (chạy nền, tự báo khi nội dung mới xuất hiện trên
site thật) sau MỖI lần push, không cần đợi PM tự vào Cloudflare Dashboard kiểm tra tab Deployments
nữa như các phiên trước. Nên tiếp tục dùng cách này cho các phiên sau.

## 6. Tài liệu tham khảo

`CLAUDE.md` mục 35-43 (toàn bộ, đặc biệt mục 43 cho vấn đề Web Push đang treo) → file này → nếu cần
lại thông tin chi tiết về per-device read tracking (mục 38)/backfill 7 ngày (mục 39)/bỏ nút bật-tắt
push (mục 40) thì đọc trực tiếp trong `CLAUDE.md`, không cần tìm lại ở bản handover cũ (đã gom đủ).
