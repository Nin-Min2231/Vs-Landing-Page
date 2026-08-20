# Handover — Bàn giao sang phiên làm việc mới (2026-08-20, bản 11 — GHI ĐÈ toàn bộ bản cũ)

> File này **GHI ĐÈ HOÀN TOÀN** mọi bản handover cũ (bản 1→10) — **không cần đọc lại bản cũ**, nội
> dung quan trọng còn giá trị đã gom hết vào đây. Đọc theo đúng thứ tự: `CLAUDE.md` (toàn bộ, đặc
> biệt mục 35-45) → file này → bắt tay vào **mục 1**.

## 0. Trạng thái ngay lúc viết file này

- **✅ ĐÃ ĐÓNG HOÀN TOÀN cả 2 vấn đề của đợt debug 14/8→20/8:**
  1. "Thông báo không hoạt động" (treo từ 10/8) — nguyên nhân gốc: thiếu migration
     `09_supabase_setup_phase9.sql`. PM đã chạy, xác nhận chuông + push điện thoại đều hoạt động.
  2. Công cụ backup lỗi 401 sau khi thêm bảng `notification_reads` — nguyên nhân: file cấu hình
     khóa cục bộ (`backup-config.json`, ngoài git) chưa đồng bộ khóa `service_role` mới. **PM xác
     nhận đã chạy backup thành công** — coi như đã xong hoàn toàn.
- **Không còn việc gì đang treo/cấp bách tại thời điểm viết file này.** Mục 1 dưới đây chỉ là các
  việc nên theo dõi/nhắc nhở cho lâu dài, không phải sự cố cần xử lý ngay.
- Nhánh làm việc: vẫn đẩy thẳng `main`, không bị chặn quyền push. Commit mới nhất: `e48033e`
  (bản 10 của file này) — phiên hiện tại sẽ commit bản 11 (file này) ngay sau khi viết xong.

## 1. Việc nên theo dõi (không cấp bách)

1. **Theo dõi thêm vài ngày** để chắc thông báo (chuông + push điện thoại) tiếp tục hoạt động ổn
   định, không chỉ đúng lúc vừa sửa — đặc biệt xem lớp "quét lùi 7 ngày" (mục 39 CLAUDE.md) có
   backfill đúng các hồ sơ đến hạn trong khoảng 12-19/8 (thời gian bị lỗi) hay không.
2. **Bài học quy trình quan trọng nhất rút ra từ 2 sự cố trên — áp dụng cho MỌI thay đổi schema sau
   này** (đã ghi vào `CLAUDE.md` mục 45 + `05_Database/README.md`, nhắc lại ở đây vì rất dễ quên):
   - Migration SQL viết xong KHÔNG coi là "xong việc" nếu chưa xác nhận THẬT đã chạy trên Supabase.
     Nếu Claude Code không có quyền chạy trực tiếp, phải nêu rõ ở phần "Việc cần làm ngay" của
     handover VÀ tự xác nhận lại ở phiên sau — không để việc tồn đọng rớt mất khi viết đè bản mới.
   - Thêm BẢNG MỚI trong 1 migration → phải đồng thời cập nhật `06_Backup_Tool/backup-supabase.mjs`
     (`TABLES` + `ORDER_BY` nếu bảng không có cột `id` đơn).
   - Đổi/rotate khóa `SUPABASE_SERVICE_ROLE_KEY` ở BẤT KỲ đâu (Cloudflare Worker) → phải nhắc PM
     đồng bộ lại `06_Backup_Tool/backup-config.json` (file cục bộ, Claude Code không đọc/sửa được)
     — nếu không, tool backup sẽ lỗi 401 dù code/database hoàn toàn đúng.
3. Đã tạo 1 subagent tùy chỉnh `code-reviewer` tại `.claude/agents/code-reviewer.md` (tập trung lỗi
   logic + bảo mật, dùng `ReportFindings` để báo cáo) — **file này CHƯA được commit vào git** (PM
   chưa yêu cầu lưu lại). Subagent tùy chỉnh KHÔNG được nạp lại giữa phiên (chỉ đọc lúc bắt đầu
   phiên mới) — nếu cần dùng, phải là phiên chat MỚI, gọi qua Agent tool với `subagent_type:
   "code-reviewer"`. Nếu gọi mà báo "not found", đó là dấu hiệu phiên hiện tại được mở TRƯỚC khi
   file này tồn tại — không phải lỗi.

## 2. Toàn bộ diễn biến vụ "thông báo không hoạt động" (tổng hợp, dễ tham chiếu nếu gặp lại kiểu
sự cố "im lặng không rõ nguyên nhân" tương tự sau này)

1. **Lớp 1 (sửa 14/8, mục 35 CLAUDE.md):** tính "hôm nay" theo giờ UTC thay vì giờ VN — làm tô đỏ
   Dashboard và thông báo trễ tới 7h sáng. Lỗi CÓ THẬT nhưng KHÔNG PHẢI nguyên nhân chính.
2. **Lớp 2 (PM tự sửa 14/8):** khóa `SUPABASE_SERVICE_ROLE_KEY` trên Cloudflare Worker bị sai/lệch.
3. **Lớp 3 (sửa 18/8, mục 38/43/44):** nhiều bug code thật ở `admin.html`/`sw-admin.js` liên quan
   đọc/ghi trạng thái đã đọc theo từng máy, đồng bộ subscription push.
4. **Lớp 4 — NGUYÊN NHÂN GỐC THẬT SỰ (phát hiện 19/8, mục 45):** dù đã sửa hết lớp 1-3, test thật
   vẫn không có gì — vì migration `09_supabase_setup_phase9.sql` (cột `ref_parent_id`, viết từ
   10/8) chưa từng được chạy, làm MỌI lượt insert thông báo bị PostgREST từ chối (`PGRST204`). Tra
   ra nhờ bật Cloudflare Observability → Logs đọc đúng dòng lỗi thật — **cách hiệu quả nhất, nên
   làm SỚM hơn** cho sự cố tương tự sau này, thay vì đoán qua nhiều vòng dựa trên suy luận code.
5. **Lớp 5 (20/8):** sau khi sửa xong, thêm bảng `notification_reads` vào tool backup → PM chạy thử
   lỗi 401 — hóa ra là khóa cục bộ (`backup-config.json`) chưa đồng bộ với khóa mới ở lớp 2. Đã
   hướng dẫn PM đồng bộ lại, **PM xác nhận backup chạy thành công**.

**Bài học lớn nhất:** nhiều lớp nguyên nhân ĐỘC LẬP có thể tồn tại CÙNG LÚC trong 1 sự cố "im lặng
không báo lỗi" kéo dài nhiều ngày — sửa xong 1 lớp không có nghĩa là hết lỗi. Phải test thật lại từ
đầu sau mỗi lần sửa trước khi kết luận đã xong, và khi đổi 1 khóa/secret ở đâu đó, phải rà lại TẤT
CẢ nơi khác đang dùng chung giá trị đó (Cloudflare Worker VÀ file cấu hình cục bộ của các tool khác)
chứ không chỉ đổi ở nơi vừa phát hiện lỗi.

## 3. Cách đã test/xác nhận

- Toàn bộ code sửa trong đợt này (mục 35-45 CLAUDE.md) đã test qua Claude Browser/Node với dữ liệu
  giả lập trước khi đẩy lên — chi tiết đầy đủ nằm trong từng mục tương ứng của `CLAUDE.md`.
- 2 việc **CHỈ xác nhận được thật bởi PM** (không mô phỏng được trong môi trường agent): (1) chạy
  migration 09 → thông báo hoạt động thật trên điện thoại, (2) cập nhật khóa cục bộ → chạy
  `Chay_Backup.bat` thành công thật. Cả 2 đã có xác nhận — coi là ĐÃ XÁC MINH THẬT.

## 4. Quy trình deploy

Vẫn `git push` thẳng `main`, Cloudflare tự deploy — tiếp tục dùng cách tự poll `curl`/`until` sau
mỗi lần push để xác nhận deploy xong, không cần đợi PM tự kiểm tra Dashboard. Riêng
`06_Backup_Tool/backup-supabase.mjs` là script chạy TAY trên máy PM (không qua Cloudflare) — sửa
xong có hiệu lực ngay, PM chỉ cần chạy lại `Chay_Backup.bat`, không cần chờ deploy gì cả.

## 5. Tài liệu tham khảo

`CLAUDE.md` mục 35-45 (mục 45 quan trọng nhất) → `05_Database/README.md` (quy tắc migration +
đồng bộ backup tool) → file này.
