# Handover — Bàn giao sang phiên làm việc mới (2026-08-20, bản 10 — GHI ĐÈ toàn bộ bản cũ)

> File này **GHI ĐÈ HOÀN TOÀN** mọi bản handover cũ (bản 1→9) — **không cần đọc lại bản cũ**, nội
> dung quan trọng còn giá trị đã gom hết vào đây. Đọc theo đúng thứ tự: `CLAUDE.md` (toàn bộ, đặc
> biệt mục 35-45) → file này → bắt tay vào **mục 1**.

## 0. Trạng thái ngay lúc viết file này

- **✅ ĐÃ ĐÓNG HOÀN TOÀN vấn đề "thông báo không hoạt động" đã treo từ 10/8** (nguyên nhân gốc:
  thiếu migration `09_supabase_setup_phase9.sql` — xem mục 2 dưới, đã có xác nhận thật từ PM).
- **⚠️ VIỆC ĐANG TREO, ưu tiên số 1 phiên mới:** ngay sau khi sửa `06_Backup_Tool/backup-supabase.mjs`
  (mục 3), PM chạy thử `Chay_Backup.bat` thì bị lỗi **HTTP 401 "Unregistered API key"** cho TẤT CẢ
  18/18 bảng. Đây **KHÔNG PHẢI lỗi code** — chẩn đoán: file `06_Backup_Tool/backup-config.json`
  (nằm trên máy PM, KHÔNG ở trong git vì bị `.gitignore` chặn — Claude Code không đọc/sửa được file
  này) đang chứa khóa `SUPABASE_SERVICE_ROLE_KEY` CŨ, không khớp với khóa `service_role_12` mới đã
  cập nhật lại trên Cloudflare lúc sửa vụ thông báo (mục 2, lớp 2). Đã hướng dẫn PM tự copy lại khóa
  mới từ Supabase Dashboard → Project Settings → API Keys → "Secret keys" vào đúng file này rồi chạy
  lại — **PM CHƯA xác nhận đã làm xong và chạy thử lại thành công chưa.**
- Nhánh làm việc: vẫn đẩy thẳng `main`, không bị chặn quyền push. Commit mới nhất: `e9c9ee8`.

## 1. Việc CẦN LÀM NGAY

1. **Hỏi PM đã cập nhật lại `backup-config.json` và chạy lại `Chay_Backup.bat` chưa** — nếu chưa,
   nhắc lại đúng 3 bước: mở file bằng Notepad → copy khóa `service_role_12` mới nhất từ Supabase
   Dashboard (Project Settings → API Keys → Secret keys) dán đè vào → lưu file → chạy lại
   `Chay_Backup.bat`. Nếu đã làm mà VẪN lỗi 401, khả năng khóa trên Supabase lại bị đổi/rotate tiếp
   — cần PM xác nhận lại đúng khóa hiện tại đang hiển thị trên Supabase (không cần gửi giá trị khóa
   cho Claude Code, chỉ cần biết đã copy đúng/mới nhất chưa).
2. **Xác nhận lại với PM sau vài ngày** rằng thông báo (chuông + push điện thoại) vẫn tiếp tục hoạt
   động ổn định (không chỉ đúng lúc vừa sửa) — đặc biệt theo dõi xem lớp "quét lùi 7 ngày" (mục 39)
   có backfill đúng các hồ sơ đến hạn trong khoảng 12-19/8 (thời gian bị lỗi) hay không.
3. **Đọc kỹ bài học ở `CLAUDE.md` mục 45 + `05_Database/README.md`** trước khi thêm migration mới
   bất kỳ: (a) migration viết xong PHẢI được xác nhận đã chạy THẬT trên Supabase trước khi coi là
   xong — không được để "cần làm ngay" của phase trước bị rớt mất khi viết đè handover bản mới; (b)
   thêm bảng mới thì phải đồng thời cập nhật `06_Backup_Tool/backup-supabase.mjs` (`TABLES` +
   `ORDER_BY` nếu bảng không có cột `id` đơn).
4. Đã tạo 1 subagent tùy chỉnh `code-reviewer` tại `.claude/agents/code-reviewer.md` (tập trung lỗi
   logic + bảo mật, dùng `ReportFindings` để báo cáo) — **file này CHƯA được commit vào git** (PM
   chưa yêu cầu lưu lại). Subagent tùy chỉnh KHÔNG được nạp lại giữa phiên (chỉ đọc lúc bắt đầu
   phiên mới) — nếu cần dùng, phải là phiên chat MỚI, gọi qua Agent tool với `subagent_type:
  "code-reviewer"`. Nếu gọi mà báo "not found", đó là dấu hiệu phiên hiện tại được mở TRƯỚC khi file
   này tồn tại — không phải lỗi.

## 2. Toàn bộ diễn biến vụ "thông báo không hoạt động" (tổng hợp lại 1 lần, dễ tham chiếu)

Vấn đề này trải qua NHIỀU lớp nguyên nhân chồng lên nhau, phát hiện dần qua nhiều lượt debug — tóm
tắt đúng thứ tự để hiểu tại sao mất nhiều lượt mới ra:

1. **Lớp 1 (đã sửa 14/8, mục 35):** tính "hôm nay" theo giờ UTC thay vì giờ VN — làm tô đỏ Dashboard
   và thông báo trễ tới 7h sáng. Đây là lỗi CÓ THẬT nhưng KHÔNG PHẢI nguyên nhân chính của việc "cả
   tuần không có gì".
2. **Lớp 2 (phát hiện + PM tự sửa 14/8):** khóa `SUPABASE_SERVICE_ROLE_KEY` trên Cloudflare Worker
   bị sai/lệch — PM tự cập nhật lại khóa đúng trên Cloudflare Dashboard.
3. **Lớp 3 (phát hiện + sửa 18/8, mục 38/43/44):** nhiều bug code thật ở phía `admin.html`/
   `sw-admin.js` liên quan đọc/ghi trạng thái đã đọc theo từng máy, đồng bộ subscription push.
4. **Lớp 4 — NGUYÊN NHÂN GỐC THẬT SỰ (phát hiện 19/8, mục 45):** dù đã sửa hết lớp 1-3, PM test thật
   (đăng ký tư vấn ở trang chủ, đợi 20 phút) vẫn KHÔNG có gì — vì migration
   `09_supabase_setup_phase9.sql` (viết từ 10/8, thêm cột `ref_parent_id`) **chưa từng được chạy**,
   làm MỌI lượt insert thông báo (cả 4 loại, không chỉ loại cần cột đó) bị PostgREST từ chối với lỗi
   `PGRST204`. Tra ra được nhờ bật Cloudflare Observability → Logs và đọc đúng dòng lỗi thật — **đây
   là cách hiệu quả nhất, nên làm SỚM hơn cho các sự cố "im lặng không rõ nguyên nhân" tương tự sau
   này**, thay vì đoán qua nhiều vòng dựa trên suy luận code.

**Bài học lớn nhất:** khóa sai (lớp 2) VÀ thiếu migration (lớp 4) tồn tại **CÙNG LÚC**, khiến việc
sửa lớp 2 xong vẫn chưa hết lỗi — dễ khiến người debug (kể cả PM) nghĩ "sửa khóa chưa đúng" trong
khi thực ra là 2 lỗi độc lập cộng lại. Khi 1 hệ thống "im lặng không báo lỗi" đã kéo dài NHIỀU NGÀY,
đừng dừng lại sau khi sửa được 1 nguyên nhân — phải test thật lại từ đầu trước khi kết luận đã xong.

## 3. Việc đã làm thêm trong phiên 19-20/8 (tiếp nối bản 8 — mục mới 45 trong `CLAUDE.md`)

Xem chi tiết đầy đủ ở `CLAUDE.md` mục 45 (đã viết kỹ, không lặp lại ở đây) — tóm tắt: chạy migration
09 (PM tự chạy) → xác nhận thông báo hoạt động → tiện thể sửa `06_Backup_Tool/backup-supabase.mjs`
(thêm bảng `notification_reads`, thêm `ORDER_BY` cho bảng không có cột `id` đơn) → cập nhật
`05_Database/README.md`/`06_Backup_Tool/README.md`/`CLAUDE.md` để ghi lại bài học quy trình.

PM chạy thử ngay sau đó (`Chay_Backup.bat`) → gặp lỗi 401 mới, KHÔNG liên quan tới phần code vừa
sửa (đã xác nhận qua log: lỗi xảy ra ĐỀU cho cả 18/18 bảng, kể cả 17 bảng cũ không đổi gì) — chẩn
đoán là do `backup-config.json` (file cấu hình cục bộ trên máy PM, ngoài phạm vi git) chưa được
cập nhật khóa `service_role` mới — xem mục 0/1.

## 4. Cách đã test

- `backup-supabase.mjs`: copy ra thư mục tạm NGOÀI dự án, mock `global.fetch`, xác nhận đúng URL
  (bao gồm `order=`) cho cả 18 bảng, không đụng dữ liệu/mạng thật — xác nhận ĐÚNG PHẦN CODE.
  **Chưa có 1 lượt backup THẬT nào chạy thành công trên máy PM với bản code mới** (lượt PM tự chạy
  bị chặn bởi lỗi khóa cục bộ, không phải lỗi code) — cần PM xác nhận sau khi cập nhật khóa xong.
- Việc sửa migration 09 là PM tự chạy trực tiếp trên Supabase — không phải thứ mô phỏng được, đã có
  xác nhận thật từ PM (chuông + điện thoại đều nhận được) — coi là ĐÃ XÁC MINH THẬT, khác với các
  tính năng trước đó (Phase 10, backfill...) chỉ mới test qua giả lập.

## 5. Quy trình deploy

Vẫn `git push` thẳng `main`, Cloudflare tự deploy — tiếp tục dùng cách tự poll `curl`/`until` sau
mỗi lần push để xác nhận deploy xong, không cần đợi PM tự kiểm tra Dashboard.
**Lưu ý riêng cho `06_Backup_Tool/`:** đây là script Node chạy TAY trên máy PM, KHÔNG qua Cloudflare
— sửa file trong `02_Source`/`worker.js` thì cần git push + đợi deploy, nhưng sửa
`06_Backup_Tool/backup-supabase.mjs` thì có hiệu lực NGAY trên máy đang chạy Claude Code (cùng 1 bộ
file vật lý), PM chỉ cần chạy lại `Chay_Backup.bat` là dùng được bản mới, không cần chờ gì cả.

## 6. Tài liệu tham khảo

`CLAUDE.md` mục 35-45 (mục 45 quan trọng nhất — đọc trước khi động vào bất kỳ migration/thông báo
nào) → `05_Database/README.md` (quy tắc mới về xác nhận migration đã chạy + đồng bộ backup tool) →
file này.
