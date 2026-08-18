# Handover — Bàn giao sang phiên làm việc mới (2026-08-18, bản 7 — GHI ĐÈ toàn bộ bản cũ)

> File này **GHI ĐÈ HOÀN TOÀN** mọi bản handover cũ (bản 1→6) — **không cần đọc lại bản cũ**, nội
> dung quan trọng còn giá trị đã gom hết vào đây. Đọc theo đúng thứ tự: `CLAUDE.md` (toàn bộ, đặc
> biệt mục 35-40 cho thay đổi 2 phiên gần nhất) → file này → bắt tay vào **mục 1**.

## 0. Trạng thái ngay lúc viết file này

- Nhánh làm việc: **đẩy thẳng lên `main`, không qua branch riêng** trong cả 2 phiên gần nhất (khác
  các phiên trước — không gặp `git push` bị chặn quyền lần nào) — 7 commit từ `d079b20` đến
  `01b3e73`, tất cả đã lên `main`, Cloudflare tự deploy (đã xác nhận qua `curl` kiểm tra `/admin`
  live có chứa đúng code mới nhất — `DEVICE_ID`, `notification_reads`).
- **⚠️ VẤN ĐỀ ĐANG TREO, CHƯA CÓ KẾT LUẬN CUỐI:** PM báo (2026-08-18) *"mở app hôm nay vẫn không có
  thông báo"* — dù đã: (a) 2026-08-14 PM tự phát hiện + tự sửa khóa `SUPABASE_SERVICE_ROLE_KEY` sai
  trên Cloudflare (nguyên nhân gốc khiến robot thông báo im lặng ngừng chạy từ 11/8), (b) cùng ngày
  Claude Code đã sửa lỗi tính "hôm nay" theo UTC→giờ VN (mục 35) + thêm lớp quét lùi 7 ngày (mục 39).
  **Cập nhật cùng ngày 2026-08-18:** PM xác nhận ĐÃ chạy `10_supabase_setup_phase10.sql` — nghi vấn
  hàng đầu (mục 1.1 cũ) coi như đã loại trừ. **CHƯA CÓ XÁC NHẬN cuối cùng liệu chuông đã thật sự
  hiện thông báo sau khi chạy migration hay chưa** — PM chưa quay lại báo kết quả sau khi chạy SQL.
  Đọc kỹ mục 1 trước khi làm gì tiếp.

## 1. Việc CẦN LÀM NGAY

1. ✅ **[ĐÃ XONG 2026-08-18] Chạy `05_Database/10_supabase_setup_phase10.sql`** — PM xác nhận đã
   chạy. **Việc kế tiếp bắt buộc:** hỏi lại PM xem sau khi chạy xong, mở lại chuông thông báo trong
   `admin.html` (nhớ tải lại trang F5 để chắc không phải bản cache cũ) có thấy thông báo chưa —
   *đừng giả định đã xong chỉ vì đã chạy migration*, phải có xác nhận thật từ PM mới coi là giải
   quyết xong. Nếu vẫn chưa thấy gì, tiếp tục mục 1.2 dưới đây để tìm nguyên nhân khác.
2. Nếu ĐÃ chạy Phase 10 (rồi) mà vẫn không thấy gì: nhờ PM (hoặc tự nếu có quyền) vào **Supabase Dashboard
   → Table Editor → bảng `notifications`** → sắp xếp `created_at` giảm dần → có dòng nào tạo trong
   4 ngày qua (14/8-18/8) không?
   - CÓ dòng mới → lỗi nằm ở phía `admin.html` hiển thị (kiểm tra Console F12 trên máy tính, đối
     chiếu `loadNotifications()`/`renderNotifBell()` mục 38 CLAUDE.md).
   - KHÔNG có dòng mới nào → lỗi nằm ở Cloudflare Worker (`worker.js`/cron) — vào Cloudflare
     Dashboard → Worker `topvisa5s` → Observability → bật "Logs" → đợi 1 lượt cron chạy (mỗi 10
     phút) → đọc lỗi thật. Nghi vấn: khóa `SUPABASE_SERVICE_ROLE_KEY` PM cập nhật ngày 14/8 có thể
     đã bị rotate lại lần nữa, hoặc lượt cập nhật đó chưa thực sự lưu đúng.
3. **PM CHƯA xác nhận thử tính năng "tự hỏi quyền thông báo lúc đăng nhập lần đầu"** (mục 40, vừa
   code xong 2026-08-18, CHỈ test qua mock trong Claude Browser — chưa có xác nhận trên thiết bị
   thật). Để PM tự test lại từ đầu: xóa `localStorage` khóa `tv5s_push_asked` (hoặc dùng hẳn 1 trình
   duyệt/máy khác chưa từng đăng nhập), đăng nhập lại → phải tự hiện popup "Bật thông báo đẩy?".
4. **Backfill 7 ngày (mục 39) mới thêm — chưa có xác nhận thật là nó có "bắt lại" đúng các hồ sơ bị
   lỡ hôm 11-14/8 hay không** (phụ thuộc vào việc mục 1 ở trên được giải quyết trước — Worker phải
   chạy được thành công ít nhất 1 lần thì mới biết backfill có hoạt động đúng không).

## 2. Tóm tắt việc 2 phiên gần nhất đã làm (chi tiết đầy đủ nằm ở `CLAUDE.md` mục 35-40)

**Phiên 2026-08-14** (bắt đầu từ câu hỏi "Dashboard tô đỏ Ngày trả KQ lúc mấy giờ, sáng 6h30 không
thấy đỏ/không có thông báo"):
- Mục 35 (`d079b20`): phát hiện + sửa gốc — `tcToday()` (`admin.html`) và biến `today`
  (`worker.js`) tính "hôm nay" theo giờ UTC thay vì giờ Việt Nam (UTC+7) → tô đỏ/thông báo bị trễ
  tới 7h sáng mới đúng. Sửa cả 2 nơi + quy hết các chỗ tự tính ngày rải rác trong `admin.html` về
  gọi chung `tcToday()`.
- **Sự cố riêng phát hiện qua debug cùng PM (KHÔNG phải commit code):** robot thông báo (Cloudflare
  Worker cron) đã ngừng tạo thông báo hoàn toàn từ 11/8 — nguyên nhân: khóa
  `SUPABASE_SERVICE_ROLE_KEY` lưu trên Cloudflare Worker Settings bị sai/lệch (nghi do lúc PM setup
  công cụ backup `06_Backup_Tool` ngày 12/8 có ghé lại trang "Secret keys" của Supabase). PM tự vào
  Cloudflare Dashboard cập nhật lại khóa đúng — **lúc đó CHƯA kiểm chứng lại có thành công thật hay
  không**, và tới 18/8 PM vẫn báo chưa thấy thông báo (xem mục 0/1 ở trên).
- Mục 36 (`1d4e5c5`): màn "Tư vấn" — thêm tìm kiếm theo cột `note` ("Nội dung tư vấn"), thêm cột
  hiển thị (cắt ellipsis bằng class có sẵn `.text-trunc`), bôi màu đoạn khớp từ khóa (hàm chung mới
  `highlightMatch()`, tận dụng tính chất `vnNorm()` không đổi độ dài chuỗi).
- Mục 37 (`469b003`): màn "Tư vấn" — đổi "Xuất CSV" → "Xuất Excel" thật (`.xlsx`), dùng SheetJS qua
  CDN (`<script src>`, giống cách Chart.js đã dùng — không phá triết lý "không build step").
- Mục 38 (`189381d`): thông báo — PM phản hồi dùng 2 máy, máy A đọc thì máy B tự thấy "đã đọc"
  theo (cờ `is_read` cũ là CHUNG trên bảng `notifications`). Thêm bảng mới `notification_reads`
  (`05_Database/10_supabase_setup_phase10.sql` — **PM cần tự chạy migration này**, xem mục 1) +
  `DEVICE_ID` sinh riêng mỗi trình duyệt (`localStorage`, có fallback an toàn nếu bị chặn). Sửa
  `loadNotifications()`/`onNotifClick()`/`markAllNotifRead()` (`admin.html`) và `handlePush()`
  (`sw-admin.js`) đọc/ghi qua bảng mới này. Xóa thông báo (`deleteSelectedNotifications`) vẫn là
  hành động CHUNG (không đổi).
- Mục 39 (`daa92bd`): `worker.js` — PM hỏi "có tự thông báo lại nếu bị trễ không" → phát hiện giới
  hạn: trước đây 3/4 loại thông báo chỉ hỏi "=đúng hôm nay", qua ngày là mất vĩnh viễn không có
  cách bắt lại. Thêm `BACKFILL_DAYS=7` — quét khoảng `[hôm nay-7, hôm nay]` thay vì đúng 1 ngày, an
  toàn nhờ ràng buộc `unique(loai,ref_id,ref_ngay)` đã chặn tạo trùng sẵn. Loại `dang_ky_moi` không
  cần sửa (đã an toàn từ trước nhờ lấy 200 lead mới nhất theo `created_at`, không lọc theo ngày).

**Phiên 2026-08-18** (4 ngày sau, PM quay lại hỏi tiếp — nối tiếp đúng ngữ cảnh phiên trước):
- PM xác nhận lại "tổng có 4 loại thông báo" (không phải 3) — giải thích lại rõ: `dang_ky_moi`
  ("Khách hàng đăng ký" từ trang chủ) đã luôn an toàn, không cần nằm trong đợt sửa backfill mục 39.
- PM báo *"vẫn không có thông báo"* + nghi ngờ do PWA không tự cập nhật — đã kiểm tra header HTTP
  thật (`curl`) xác nhận `Cache-Control: public, max-age=0, must-revalidate` cho cả `admin.html` và
  `sw-admin.js` → PWA/trình duyệt luôn phải hỏi lại server, KHÔNG bị kẹt ở bản cache cũ vô thời hạn
  → **giả thuyết "do PWA" nhiều khả năng SAI**, nghi vấn thật nằm ở mục 1.1 (migration Phase 10).
- Mục 40 (`01b3e73`): PM yêu cầu bỏ nút "Bật/Tắt thông báo đẩy" thủ công trong panel chuông, thay
  bằng tự động hỏi quyền **đúng 1 lần** ngay sau khi đăng nhập lần đầu trên 1 máy (`localStorage`
  cờ `tv5s_push_asked`) — dùng popup riêng của trang (`showConfirmPopup`) làm "cầu nối" vì trình
  duyệt bắt buộc phải có 1 thao tác bấm thật mới cho xin quyền `Notification` (không thể tự động
  hỏi ngầm lúc tải trang). **Từ nay KHÔNG còn cách tắt push trong app** — muốn tắt phải vào cài đặt
  thông báo của trình duyệt/điện thoại cho trang `topvisa5s.com`, đây là quyết định có chủ đích
  theo đúng yêu cầu PM, không phải thiếu sót nếu sau này có ai hỏi lại.
- Sửa lại 1 lỗi ngày ghi nhầm trong `CLAUDE.md` mục 40 (ghi nhầm 2026-08-14 trong lúc soạn, thực ra
  đổi ngày 2026-08-18 — bài học: **luôn kiểm tra ngày thật bằng `git log --format="%ad"` khi ghi
  chú "(ngày)" vào CLAUDE.md, không tự suy đoán ngày từ ngữ cảnh hội thoại** vì phiên có thể trải
  dài qua nhiều ngày thật mà hội thoại đọc liền mạch như 1 buổi.

## 3. Sự cố đã xảy ra (tổng hợp, để tránh lặp lại)

- **Robot thông báo ngừng chạy im lặng 11/8 → 14/8** — khóa `SUPABASE_SERVICE_ROLE_KEY` trên
  Cloudflare bị sai, không có tín hiệu lỗi nào hiện ra ngoài (đúng bài học đã ghi ở mục 33/34 cũ:
  lỗi thiếu/sai secret luôn im lặng, phải chủ động soát Cloudflare Logs mới thấy). **CHƯA CÓ XÁC
  NHẬN CUỐI khóa hiện tại đã đúng và ổn định** — xem mục 1.
- **Bug tự phát hiện lúc code (đã tự sửa trong phiên, không lộ ra ngoài):** viết `getDeviceId()`
  ban đầu KHÔNG bọc try/catch quanh `localStorage` — test thử trong Claude Browser (chạy ở sandbox
  `data:` URL, chặn hẳn `localStorage`) làm lộ ra: nếu 1 trình duyệt thật nào cũng chặn storage
  tương tự (chế độ ẩn danh nghiêm ngặt...), lỗi này sẽ làm rớt TOÀN BỘ code JS chạy sau dòng đó
  trong `admin.html` (không chỉ mỗi tính năng thông báo). Đã sửa bọc try/catch, áp dụng luôn cho
  `maybeAskPushPermission()` mới thêm mục 40. **Bài học cho code sau này:** mọi chỗ đọc/ghi
  `localStorage` ở khu vực code chạy SỚM (gần đầu trang, trước khi user tương tác) nên bọc try/catch
  nếu có thể, theo đúng nguyên tắc "tính năng phụ không được phép chặn luồng chính" đã có từ Phase 8.

## 4. Cách đã test 2 phiên này

- Toàn bộ tính năng mới (mục 36-40) đều test qua **Claude Browser với dữ liệu/hàm giả lập** (mock
  `api()`, mock `Notification`/`navigator.serviceWorker`/`localStorage`/`showConfirmPopup`), gọi
  trực tiếp hàm JS trong Console — KHÔNG đăng nhập thật, KHÔNG chạm dữ liệu Supabase thật.
  **CHƯA có xác nhận nào từ PM trên thiết bị thật** cho: per-device read (mục 38), backfill 7 ngày
  (mục 39), tự hỏi quyền push (mục 40) — xem việc cần làm mục 1.3/1.4.
- Excel export (mục 37): kiểm chứng thật bằng Node (cài tạm gói `xlsx` ở thư mục NGOÀI dự án, không
  đụng `package.json` của repo) — xuất `.xlsx`, đọc lại, xác nhận đúng nội dung tiếng Việt + Unix
  nhận diện đúng định dạng "Microsoft Excel 2007+".
- Đã xác nhận qua `curl` (không cần trình duyệt): header cache của `admin.html`/`sw-admin.js` trên
  site thật, và nội dung `/admin` live thực sự chứa code mới nhất (loại trừ nghi ngờ "chưa deploy").

## 5. Quy trình deploy — vẫn dùng đúng cách cũ (xem CLAUDE.md mục 5/33)

Khác các phiên trước: **`git push` KHÔNG bị chặn quyền lần nào** trong cả 2 phiên này — mọi commit
đẩy thẳng lên `main` thành công ngay, Cloudflare tự deploy trong vài chục giây (đã xác nhận qua
tab "Deployments" trên Cloudflare Dashboard PM chụp gửi lúc debug khóa Supabase).

## 6. Tài liệu tham khảo (đọc theo thứ tự nếu cần)

`CLAUDE.md` mục 35-40 (toàn bộ thay đổi 2 phiên gần nhất, đọc kỹ mục 38 trước khi động vào code
thông báo) → file này → `05_Database/README.md` (file `10` là mới nhất, **BẮT BUỘC PM tự chạy**
trước khi Phase 10 hoạt động — xem mục 1.1, đây là việc ưu tiên số 1).
