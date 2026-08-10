# Handover — Bàn giao sang phiên làm việc mới (2026-08-10, bản 5 — GHI ĐÈ toàn bộ bản cũ)

> File này **GHI ĐÈ HOÀN TOÀN** mọi bản handover cũ (bản 1→4) — **không cần đọc lại bản cũ**, nội
> dung quan trọng còn giá trị đã gom hết vào đây. Đọc theo đúng thứ tự: `CLAUDE.md` (toàn bộ, đặc
> biệt mục 33 cho thay đổi phiên này) → file này → bắt tay vào **mục 1**. Viết để dùng được cho cả
> Claude Code lẫn Claude Cowork/agent khác, không giả định sẵn bối cảnh hội thoại trước đó.

## 0. Trạng thái ngay lúc viết file này

- Nhánh làm việc: `claude/handover-phien-moi-015f64` (worktree riêng) — **CHƯA commit, chưa push,
  chưa deploy**. Toàn bộ việc mô tả trong file này mới chỉ nằm trên máy, đợi người dùng xác nhận
  mới commit/push (đúng quy trình luôn hỏi trước khi push, xem mục 5).
- Trang chạy thật hiện tại (bản CŨ, chưa có thay đổi phiên này): `https://topvisa5s.com` +
  `https://topvisa.nguyennc1357.workers.dev`.
- Phiên này KHÔNG đọc/sửa gì thêm ở Phase 7/8 (thương hiệu, giá dịch vụ...) — các phase đó coi như
  đã xong và đã chạy thật từ trước (theo bản handover cũ), không lặp lại chi tiết ở đây.

## 1. Việc CẦN LÀM NGAY (theo đúng thứ tự)

1. **⚠️ Xóa 2 dòng dữ liệu THỬ NGHIỆM đã vô tình gửi thật vào Supabase production** — lúc test ô
   Email mới ở form đăng ký (`index.html`) qua trình duyệt thật (không phải giả lập), 1-2 request
   POST đã thật sự thành công tới bảng `leads` thật trước khi kịp nhận ra và chặn lại. Vào
   `admin.html` → tab "Tư vấn" → tìm và xóa dòng tên **"Nguyễn Văn Test"**, SĐT **0912345678**
   (có thể có 1 hoặc 2 dòng trùng do 1 lần chạy song song 2 request). Xin lỗi vì sơ suất này — từ
   phiên sau, khi cần test form gửi thật, PHẢI mock `window.fetch`/`api()` trước khi mô phỏng submit,
   không chỉ dựa vào validate ở tầng field để "chắc" là sẽ không gửi thật.
2. **Chạy migration SQL mới**: `05_Database/08_supabase_setup_phase8.sql` (tạo bảng `notifications`
   + `push_subscriptions`) trong Supabase SQL Editor — chưa chạy thì chuông thông báo ở `admin.html`
   sẽ báo lỗi khi tải (im lặng, không có toast — xem `CLAUDE.md` mục 33.B, cố ý không làm phiền
   bằng lỗi mỗi 45 giây).
3. **Cấu hình 2 secret bắt buộc trên Cloudflare Dashboard** (Worker đang chạy trang này → Settings →
   Variables and Secrets → thêm dạng "Encrypt", KHÔNG bao giờ dán vào file/chat):
   - `SUPABASE_SERVICE_ROLE_KEY` — copy trực tiếp từ Supabase Dashboard → Project Settings → API →
     mục "service_role" (⚠️ KHÁC với `anon` key đang dùng trong `index.html`/`admin.html` — khóa
     này có toàn quyền trên database, tuyệt đối không để lộ).
   - `VAPID_PRIVATE_KEY_JWK` — dán NGUYÊN VĂN chuỗi JSON sau (Claude Code đã sinh sẵn 1 cặp khóa
     Web Push cho riêng dự án này trong phiên làm việc, đã tự kiểm chứng ký/xác thực đúng):
     ```
     {"key_ops":["sign"],"ext":true,"kty":"EC","x":"OOWg9oryjO2AvNcyF6Npfj9i3D2LlwpskW4ibcaOB38","y":"ukYXhKo5siKUGdkvjHHB8-PruG0A8iLto2U2ItxaPNI","crv":"P-256","d":"61N9oEE1qtbLVOK7eF05IjzR4RAYPNmaPELTcpD-oBs"}
     ```
   - `VAPID_SUBJECT` (không bắt buộc, có giá trị mặc định trong code nếu bỏ trống) —
     `mailto:hien.gotravel@gmail.com`.
   - Khóa CÔNG KHAI tương ứng (`BDjloPaK8oztgLzXMhejaX4_Ytw9i5cKbJFuIm3Gjgd_ukYXhKo5siKUGdkvjHHB8-PruG0A8iLto2U2ItxaPNI`)
     đã hardcode sẵn CẢ trong `admin.html` (`VAPID_PUBLIC_KEY`) LẪN `worker.js` — khóa công khai
     nên không cần đặt secret, không cần làm gì thêm với giá trị này.
4. **Commit + push + deploy** (đợi người dùng xác nhận trước — xem mục 5), sau đó vào Cloudflare
   Dashboard → Worker → tab "Triggers" xác nhận Cron Trigger `*/10 * * * *` đã "Active" (CHƯA chắc
   chắn 100% việc thêm `[triggers]` vào `wrangler.toml` rồi deploy qua git-integration hiện tại sẽ
   tự bật cron mà không cần thao tác thêm trên dashboard — cần tự xác nhận).
5. **Test thật trên điện thoại** (việc duy nhất Claude Code không thể tự làm/tự xác nhận vì không
   có thiết bị thật): mở `admin.html`, đăng nhập, bấm chuông 🔔 → "Bật thông báo đẩy trên thiết bị
   này" → đồng ý cấp quyền → tạo/sửa 1 Hồ sơ có "Ngày trả KQ" = hôm nay (hoặc đợi có khách đăng ký
   thật từ web) → đợi tối đa 10 phút (chu kỳ cron) → xem điện thoại có hiện thông báo dù đã khóa
   màn hình/tắt hẳn trình duyệt hay không.
6. **Test với đăng nhập admin thật** các phần còn lại: ô Email ở form đăng ký (nhập sai định dạng
   phải báo lỗi, để trống vẫn gửi được), nút "Gửi tư vấn →", chuông thông báo (đếm đúng số chưa
   đọc, bấm 1 dòng mở đúng hồ sơ/khách liên quan, "Đánh dấu đã đọc", "Xóa đã đọc").

## 2. Tóm tắt việc phiên này đã làm (chi tiết đầy đủ ở `CLAUDE.md` mục 33)

Theo đúng 3 yêu cầu người dùng đưa ra (chưa commit, xem mục 0):

1. **`index.html`**: thêm ô "Email" (không bắt buộc, validate định dạng) vào form đăng ký, gửi kèm
   trong payload `leads` (cột `email` đã có sẵn từ Phase 2, không cần migration). Đổi text nút
   "Gửi đăng ký →" → "Gửi tư vấn →" (3 chỗ, giữ nguyên "Đang gửi...").
2. **`admin.html`**: chuông thông báo trên header — 3 loại (trả kết quả hôm nay / nhắc tư vấn hôm
   nay / khách đăng ký mới từ web), đếm chưa đọc, đánh dấu đã đọc, xóa đã đọc, bấm 1 dòng tự mở
   đúng hồ sơ/khách liên quan. **Quyết định kiến trúc quan trọng**: `admin.html` CHỈ đọc bảng
   `notifications`, KHÔNG tự sinh thông báo — việc sinh thông báo do 1 Cloudflare Worker chạy nền
   đảm nhiệm (điểm 3), để thông báo vẫn được tạo + đẩy ra điện thoại dù không ai đang mở trang.
3. **Thông báo đẩy (Web Push) thật, kể cả khi tắt hẳn app** — theo đúng lựa chọn người dùng chọn
   khi được hỏi (3 mức độ: chỉ mở app / silent... / **push thật kể cả tắt app** — người dùng chọn
   mức cao nhất). Gồm: bảng `push_subscriptions` mới, nút "Bật thông báo đẩy" trong `admin.html`,
   Service Worker (`sw-admin.js`) xử lý nhận push + hiện thông báo hệ thống, và **1 Cloudflare
   Worker chạy nền theo lịch (cron 10 phút/lần, `02_Source/worker.js`)** — lần ĐẦU TIÊN dự án có
   code chạy phía server thật (trước giờ Cloudflare chỉ phục vụ file tĩnh).

**Quyết định kỹ thuật quan trọng cần biết** (đã giải thích đầy đủ lý do ở `CLAUDE.md` mục 33.C-D):
- Push gửi đi KHÔNG kèm nội dung sẵn (silent/rỗng) — chỉ để "đánh thức" thiết bị, Service Worker tự
  gọi API lấy nội dung thật ngay lúc nhận. Lý do: mã hóa payload Web Push chuẩn (RFC8291) rất dễ sai
  mà không có thiết bị thật để kiểm chứng tận nơi (lỗi kinh điển: gửi "thành công" nhưng trình duyệt
  âm thầm không hiện được gì) — đổi lấy độ tin cậy cao hơn dù phải đánh đổi 1 bước gọi API thêm.
- Service Worker cần refresh token để tự làm mới access token lúc nhận push khi app đã đóng — lưu
  thêm 1 bản vào IndexedDB (Service Worker không đọc được `localStorage`), luôn đồng bộ với ô "Ghi
  nhớ đăng nhập" (tắt ghi nhớ/đăng xuất thì xóa sạch cả 2 nơi).
- Đã tự kiểm chứng TOÀN BỘ logic của `worker.js` bằng Node (mock `fetch`, chạy thẳng file như 1 ES
  module) — xác nhận đúng: query, upsert chống trùng, ký JWT VAPID đúng chuẩn + verify chữ ký thành
  công, dọn subscription hết hạn (410). **Chưa/không thể kiểm chứng**: gửi push thật tới 1 thiết bị
  thật (xem mục 1.5).

## 3. ⚠️ Sự cố trong lúc test (đã xử lý minh bạch ngay khi phát hiện)

Lúc test ô Email mới bằng cách mô phỏng submit form thật trên trình duyệt (không phải mock), 2 lần
gửi (1 lần email hợp lệ, có thể thêm 1 lần do chạy đua với lần trước chưa kịp set cờ chống spam) đã
**thực sự thành công** tới bảng `leads` thật trên Supabase production — vì `SUPABASE_URL`/`ANON_KEY`
cấu hình sẵn trong `index.html` là khóa thật (đúng như mọi phiên trước vẫn cảnh báo, xem mục 3 các
bản handover cũ). Dữ liệu rác: tên "Nguyễn Văn Test", SĐT "0912345678", email "ten@email.com" hoặc
rỗng. **Cần xóa thủ công** qua `admin.html` (xem mục 1.1) — Claude Code không có quyền xóa (anon
key chỉ được INSERT vào `leads`, không SELECT/DELETE được). Từ nay khi cần test hành vi submit thật
của `index.html`, PHẢI ghi đè `window.fetch` bằng hàm giả trước khi mô phỏng, không chỉ dựa vào để
sai định dạng nhằm chặn ở tầng validate.

## 4. Cách đã test trong phiên này

- **`index.html`**: mở qua server tĩnh cục bộ (`python -m http.server`, xem mục 6), test validate ô
  Email (sai định dạng → báo lỗi + không gửi; hợp lệ/để trống → không báo lỗi field) bằng cách gán
  `.value` rồi tự bắn sự kiện `submit` qua JavaScript — ĐÃ vô tình chạm tới Supabase thật (xem mục 3).
- **`admin.html`**: mock `window.api()` (đúng mẫu các phiên trước đã dùng, an toàn tuyệt đối vì
  không đụng mạng thật) để giả lập 4 thông báo mẫu, xác nhận: đếm đúng badge, render đúng nội
  dung/nhãn từng loại, bấm 1 dòng → PATCH đúng id + điều hướng đúng `switchTab`/`openHoSoModal`/
  `openTvModal`, "Đánh dấu đã đọc" → PATCH hàng loạt + badge về 0, "Xóa đã đọc" (mock luôn
  `showConfirmPopup` trả `true`) → DELETE hàng loạt + danh sách rỗng đúng. Đã đo vị trí chuông trên
  header bằng `getBoundingClientRect()` xác nhận nằm gọn trong header, không vỡ layout.
- **`worker.js`**: KHÔNG dùng Claude Browser (không phải môi trường trình duyệt) — copy sang file
  `.mjs`, mock `globalThis.fetch` toàn cục, `import` thẳng và gọi `scheduled()` như Cloudflare thật
  sẽ gọi. 3 kịch bản: (1) có dữ liệu mới → sinh đúng thông báo + gửi đúng push + JWT verify được;
  (2) không có gì mới → KHÔNG gọi `push_subscriptions` (tránh phí request thừa); (3) subscription
  nhận 410 → bị xóa khỏi DB. Cả 3 đều đúng — xem lại đoạn code test nếu cần chạy lại (không lưu lại
  trong repo, chỉ chạy tạm trong thư mục temp).
- Đã xóa `.claude/launch.json` tạo tạm để chạy server tĩnh sau khi test xong (đúng quy tắc không để
  lại file thừa).

## 5. Quy trình deploy (tiếp tục dùng đúng cách này — CHƯA làm ở phiên này)

- Toàn bộ thay đổi trong phiên này **CHƯA được commit/push** — đợi người dùng xác nhận trước khi
  làm (đúng quy tắc "chỉ commit/push khi được yêu cầu rõ").
- Khi được xác nhận: `git add` từng file cụ thể (không dùng `-A`) → `git commit` (kèm dòng
  `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>`) → push. **Lưu ý khác các phiên trước**:
  phiên này thêm `main = "worker.js"` + `[triggers]` vào `wrangler.toml` — đây là lần đầu Cloudflare
  Worker của dự án có code chạy ngoài việc phục vụ file tĩnh, nên sau khi deploy cần vào Cloudflare
  Dashboard xác nhận thêm (xem mục 1.4), không chỉ `curl` kiểm tra HTML như mọi khi.
- Vẫn không có quyền chạy SQL trực tiếp lên Supabase, và giờ cũng không có quyền vào Cloudflare
  Dashboard để set secret/xác nhận cron — cả 2 việc này bắt buộc người dùng tự làm (mục 1.2-1.4).

## 6. ⚠️ Rủi ro "2 bản sao file" — vẫn như bản handover cũ, không đổi gì thêm

Xem lại bản handover cũ (đã bị ghi đè, nhưng phần này không đổi): thư mục gốc dự án trên máy người
dùng có thể có nhiều hơn những gì hiện trong git/worktree (`Quoc_Ky/`, `04_Phase 2/`,
`05_Branding_5S/`, file CSV xuất từ `admin.html`...) — không tự ý kết luận "không tồn tại" nếu
không thấy trong worktree đang làm việc, hỏi lại người dùng nếu cần nội dung cụ thể.

## 7. Tài liệu tham khảo (đọc theo thứ tự nếu cần)

`CLAUDE.md` (toàn bộ, đặc biệt mục 33) → file này → `05_Database/README.md` (thứ tự chạy SQL,
file `08` là file MỚI nhất) → `01_Docs/10_Chuan_Dialog_Chung.md` (không liên quan trực tiếp phiên
này vì chuông thông báo không phải dialog dữ liệu, nhưng vẫn là chuẩn chung cho dialog khác).
