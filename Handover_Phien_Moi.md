# Handover — Bàn giao sang phiên làm việc mới (2026-08-19, bản 9 — GHI ĐÈ toàn bộ bản cũ)

> File này **GHI ĐÈ HOÀN TOÀN** mọi bản handover cũ (bản 1→8) — **không cần đọc lại bản cũ**, nội
> dung quan trọng còn giá trị đã gom hết vào đây. Đọc theo đúng thứ tự: `CLAUDE.md` (toàn bộ, đặc
> biệt mục 35-45) → file này → bắt tay vào **mục 1**.

## 0. Trạng thái ngay lúc viết file này

- **✅ ĐÃ ĐÓNG HOÀN TOÀN vấn đề "thông báo không hoạt động" đã treo từ 10/8 (qua nhiều bản handover
  liên tiếp):** nguyên nhân gốc THẬT SỰ là thiếu migration `09_supabase_setup_phase9.sql` (cột
  `notifications.ref_parent_id`) — chưa từng được chạy trên Supabase từ lúc viết (10/8) tới khi phát
  hiện qua Cloudflare Logs (19/8). PM đã chạy migration này, **xác nhận cả chuông trong trang VÀ
  thông báo hệ thống trên điện thoại đều đã hoạt động đúng**. Chi tiết đầy đủ: `CLAUDE.md` mục 45.
- Tiện thể sửa luôn `06_Backup_Tool/backup-supabase.mjs` (thiếu bảng `notification_reads` trong
  danh sách backup + lỗi phân trang do bảng đó không có cột `id` đơn) — xem mục 45.
- Nhánh làm việc: vẫn đẩy thẳng `main`, không bị chặn quyền push. Commit mới nhất: `77b6717`.
- **Không còn việc gì đang treo khẩn cấp** tại thời điểm viết file này — mục 1 dưới đây là các việc
  nên làm tiếp/theo dõi thêm, không phải sự cố cấp bách.

## 1. Việc CẦN LÀM (không cấp bách, nhưng nên theo dõi)

1. **Xác nhận lại với PM sau vài ngày** rằng thông báo vẫn tiếp tục hoạt động ổn định (không chỉ
   đúng lúc vừa sửa) — đặc biệt theo dõi xem lớp "quét lùi 7 ngày" (mục 39) có backfill đúng các hồ
   sơ đến hạn trong khoảng 12-19/8 (thời gian bị lỗi) hay không, vì candidates cho các hồ sơ đó giờ
   mới lần đầu insert thành công (trước đó luôn bị chặn bởi lỗi PGRST204 ở BƯỚC INSERT cuối, nghĩa
   là **CHƯA CÓ dòng nào từng insert thành công cho các hồ sơ đó** — không bị chặn bởi ràng buộc
   unique, nên backfill 7 ngày sẽ tự bắt đúng, nhưng nên xác nhận thực tế 1 lần).
2. **Đọc kỹ bài học ở `CLAUDE.md` mục 45 + `05_Database/README.md`** trước khi thêm migration mới
   bất kỳ: (a) migration viết xong PHẢI được xác nhận đã chạy THẬT trên Supabase trước khi coi là
   xong — không được để "cần làm ngay" của phase trước bị rớt mất khi viết đè handover bản mới; (b)
   thêm bảng mới thì phải đồng thời cập nhật `06_Backup_Tool/backup-supabase.mjs` (`TABLES` +
   `ORDER_BY` nếu bảng không có cột `id` đơn).
3. Đã tạo 1 subagent tùy chỉnh `code-reviewer` tại `.claude/agents/code-reviewer.md` (tập trung lỗi
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

## 3. Việc đã làm thêm trong phiên 19/8 (tiếp nối bản 8 — mục mới 45 trong `CLAUDE.md`)

Xem chi tiết đầy đủ ở `CLAUDE.md` mục 45 (đã viết kỹ, không lặp lại ở đây) — tóm tắt: chạy migration
09 (PM tự chạy) → xác nhận thông báo hoạt động → tiện thể sửa `06_Backup_Tool/backup-supabase.mjs`
(thêm bảng `notification_reads`, thêm `ORDER_BY` cho bảng không có cột `id` đơn) → cập nhật
`05_Database/README.md`/`06_Backup_Tool/README.md`/`CLAUDE.md` để ghi lại bài học quy trình.

## 4. Cách đã test

- `backup-supabase.mjs`: copy ra thư mục tạm NGOÀI dự án, mock `global.fetch`, xác nhận đúng URL
  (bao gồm `order=`) cho cả 18 bảng, không đụng dữ liệu/mạng thật.
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
