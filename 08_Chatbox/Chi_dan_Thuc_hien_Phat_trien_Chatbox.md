# Chỉ dẫn thực thi — Phát triển Chat Box (Release 1) cho Claude Code

| Mục | Nội dung |
|---|---|
| Dự án | Vs-Landing-Page — Chat Box trang Home, Top Visa (Đà Nẵng) |
| Tài liệu này dùng cho | **Claude Code** (agent lập trình) — đây là "lệnh thực thi" (bắt đầu code, quy trình git/deploy), KHÔNG phải tài liệu phân tích/spec. Đọc mục 0 trước khi làm bất kỳ việc gì. |
| Phạm vi lượt này | **CHỈ Release 1 (Chat Box)**. KHÔNG động vào Release 2 (chuyển ngữ toàn site) trừ khi PM yêu cầu rõ trong hội thoại — xem mục 6. |
| Người soạn | Claude (Cowork) |
| Ngày | 2026-08-28 |
| Phiên bản | 1.0 |

## 変更履歴 (Lịch sử thay đổi)

| Ver | Ngày | Người sửa | Nội dung |
|---|---|---|---|
| 1.0 | 2026-08-28 | Claude | Tạo mới — chỉ dẫn thực thi Release 1 kèm quy trình git bắt buộc (nhánh riêng, test OK mới merge main, deploy sau khi merge) theo yêu cầu PM |

---

## 0. Đọc trước khi code (bắt buộc, theo đúng thứ tự)

1. `CLAUDE.md` (thư mục gốc dự án) — quy tắc chung: không tự ý `insert` dữ liệu mẫu, khoá bí mật chỉ đặt qua Cloudflare Secret, migration phải idempotent, dialog admin theo `01_Docs/10_Chuan_Dialog_Chung.md`.
2. `08_Chatbox/Bao_cao_Phan_tich_Kha_thi_Chatbox.md` (bản 1.3) — đặc biệt mục 1.7 (phân chia Release), mục 3 (khả năng tích hợp), mục 6 (toàn bộ câu trả lời PM).
3. `08_Chatbox/Dac_ta_Trien_khai_Chatbox.md` (bản 1.1) — đây là **spec kỹ thuật chi tiết** (FR, thiết kế DB/API/UI, SQL đề xuất, checklist nghiệm thu). File chỉ dẫn này **không lặp lại** nội dung spec, chỉ nói rõ *thứ tự làm* và *quy trình git/deploy*. Khi code, bám sát spec làm nguồn sự thật cho "làm gì, làm như thế nào".
4. File này (`Chi_dan_Thuc_hien_Phat_trien_Chatbox.md`) — quy trình *cách* triển khai an toàn, không được bỏ qua mục 1 bên dưới dù đang vội.

**Nếu có bất kỳ điểm nào trong spec không rõ hoặc mâu thuẫn với thực tế source code khi bắt tay vào code — DỪNG LẠI và hỏi lại PM, không tự suy đoán rồi code tiếp.**

---

## 1. Quy trình Git & Deploy bắt buộc (quan trọng nhất — đọc kỹ trước khi gõ dòng code đầu tiên)

> PM yêu cầu rõ: **"Khi merge deploy tạo nhánh riêng. Đến khi nào test OK rồi mới merge vào nhánh main."** Quy tắc dưới đây cụ thể hoá yêu cầu này thành các bước thực thi.

### 1.1 Nguyên tắc cốt lõi

- **KHÔNG code trực tiếp trên nhánh `main`.**
- **KHÔNG chạy lệnh deploy lên production (`wrangler deploy`) trong khi đang đứng trên nhánh feature.** Deploy production chỉ thực hiện **sau khi** đã merge vào `main` **và** đã có xác nhận test OK.
- **KHÔNG tự ý merge vào `main`.** Chỉ merge khi có xác nhận rõ ràng từ PM (bằng lời trong hội thoại, ví dụ PM nói "test OK", "merge được rồi") — không tự suy đoán "chắc ổn rồi" để merge thay PM.

### 1.2 Các bước cụ thể

| Bước | Việc làm | Ghi chú |
|---|---|---|
| 1 | Trước khi sửa bất kỳ file nào: kiểm tra `git status`/`git branch` để biết đang ở nhánh nào, đảm bảo `main` đang sạch (không có thay đổi dang dở) | Nếu có nhánh/quy ước đặt tên nhánh đã dùng trước đó trong repo (`git branch -a`, `git log`), ưu tiên theo đúng quy ước đó thay vì tự đặt tên mới |
| 2 | Tạo nhánh mới từ `main` mới nhất, ví dụ: `git checkout -b feature/chatbox-release1` | Tên nhánh gợi ý, có thể đổi cho khớp quy ước đặt tên đã có trong repo |
| 3 | Toàn bộ code của Release 1 (mục 2 file này) thực hiện **trên nhánh này** — commit nhỏ, thông điệp rõ ràng, tách theo từng nhóm việc (Nhóm A/B/C ở mục 2) | Không cần gộp thành 1 commit khổng lồ — dễ review, dễ revert từng phần nếu cần |
| 4 | Test cục bộ bằng `wrangler dev` (chạy Worker ở local) trong suốt quá trình code — **không** deploy production để test | Nếu bản Wrangler đang dùng hỗ trợ deploy bản preview/version riêng (kiểm tra `wrangler deploy --help` hoặc tài liệu chính thức Cloudflare tại thời điểm code, vì cú pháp có thể đã đổi — xem bài học ở `01_Docs/08_Ban_giao_Claude_Code.md` mục 3), có thể dùng thêm để PM xem trước qua 1 URL preview mà không ảnh hưởng production. Đây là bước **tuỳ chọn**, không bắt buộc nếu không sẵn có |
| 5 | Chạy migration SQL (`05_Database/11_supabase_setup_phase11.sql`, bảng `chat_logs`) trực tiếp trên Supabase project đang dùng (project có 1 bản, không có DB test riêng) | An toàn để chạy sớm — bảng mới, không ảnh hưởng code cũ đang chạy. Đã là idempotent nên chạy nhầm lần 2 cũng không lỗi |
| 6 | Tự kiểm tra toàn bộ checklist nghiệm thu Release 1 (mục 8 `Dac_ta_Trien_khai_Chatbox.md`, các dòng FR-CB-01 → FR-CB-15) trên nhánh/local trước khi báo PM | Xem thêm lưu ý dọn dữ liệu test ở mục 1.3 bên dưới |
| 7 | Báo cáo cho PM: đã xong nhánh, đã tự test những gì, cách PM có thể tự xem/test lại (mở local qua `wrangler dev`, hoặc URL preview nếu có bước 4) | Không dùng từ ngữ kỹ thuật khó hiểu khi báo cáo — PM không code (theo `CLAUDE.md`) |
| 8 | **Chờ PM xác nhận rõ ràng "test OK"/"merge được"** — đây là cổng bắt buộc, không tự động hoá | Nếu PM báo lỗi/chưa đạt, sửa tiếp trên cùng nhánh, lặp lại bước 6-7 |
| 9 | Sau khi có xác nhận: `git checkout main && git merge feature/chatbox-release1` (hoặc theo quy trình PR nếu repo có dùng GitHub/GitLab) | Chỉ thực hiện bước này sau bước 8 |
| 10 | Sau khi merge vào `main`: chạy `wrangler deploy` để đẩy lên production | Đây là bước deploy production DUY NHẤT trong toàn quy trình — thực hiện từ `main`, sau merge |
| 11 | Theo dõi ngay sau deploy (xem mục 5) | — |

### 1.3 Lưu ý khi test — tránh làm bẩn dữ liệu thật

Dự án **không có Supabase riêng cho môi trường test** — mọi test (kể cả test cục bộ bằng `wrangler dev`) đều đọc/ghi vào **cùng 1 database production** đang phục vụ khách thật. Vì vậy:

- Khi test tính năng "để lại tên/SĐT → tạo lead", dùng dữ liệu rõ ràng là test (ví dụ tên `"TEST - xoá sau"`, SĐT giả hợp lệ định dạng nhưng không phải số thật) để không lẫn với lead khách thật trên `admin.html`.
- Sau khi test xong (dù merge hay chưa), **xoá các lead/chat_logs test** đã tạo ra — dùng đúng tính năng xoá mới xây (tab "Quản lý Chat", xoá lead ở tab Tư vấn) để tự kiểm tra luôn chức năng xoá.
- Không để sót dữ liệu test khi báo cáo PM là "xong" ở bước 7 tại mục 1.2.

---

## 2. Thứ tự triển khai (Release 1 — bám theo `Dac_ta_Trien_khai_Chatbox.md` mục 2, 9)

> Danh sách dưới đây chỉ nêu *thứ tự và cổng kiểm tra* — mô tả chi tiết từng FR xem `Dac_ta_Trien_khai_Chatbox.md` mục 2, 5, 6.1, 6.3.

| Nhóm | Nội dung | FR liên quan | Cổng trước khi qua nhóm tiếp theo |
|---|---|---|---|
| A | Chat cơ bản: nút Chat Box nổi + nút bấm nhanh song ngữ + CTA | FR-CB-01, 02, 06 | Demo được trên mobile + desktop, không đè nút Zalo/scroll-top |
| B | AI + lưu dữ liệu: route `/api/chat`, ground dữ liệu thật, trả lời song ngữ, nhận diện lead, ghi `chat_logs`, sửa filter thông báo, fallback quota, rate limit | FR-CB-03, 04, 05, 07, 08, 09, 14, 15 | Test cả câu hỏi tiếng Việt và tiếng Anh không bịa số liệu; lead + chat_logs ghi đúng; fallback hoạt động khi giả lập lỗi AI |
| C | Admin quản lý chat: tab "Quản lý Chat" (danh sách, chi tiết, xoá) | FR-CB-10, 11, 12 | Xem lại đúng phiên chat vừa test ở Nhóm B; xoá có xác nhận, xoá xong biến mất khỏi Supabase |

Sau khi cả 3 nhóm đạt cổng kiểm tra → chạy đầy đủ checklist mục 8 (`Dac_ta_Trien_khai_Chatbox.md`, phần Release 1) → báo PM theo bước 7 mục 1.2.

---

## 3. Quy tắc code bắt buộc (nhắc lại có chọn lọc, chi tiết đầy đủ xem `CLAUDE.md` + `Dac_ta_Trien_khai_Chatbox.md`)

- `fetch()` trong `worker.js`: chỉ **thêm** route `/api/chat`, giữ nguyên hành vi trả file tĩnh cho mọi request khác — không refactor lại phần đang chạy ổn định.
- Không cần thêm secret/API key mới cho phần AI — Cloudflare Workers AI dùng binding có sẵn trong tài khoản (không phải key dạng chuỗi như OpenAI/Gemini). Nếu vì lý do kỹ thuật phải đổi sang nhà cung cấp AI khác có API key, key đó **bắt buộc** đặt qua Cloudflare Secret, không bao giờ ghi trong file commit lên git.
- Migration `05_Database/11_supabase_setup_phase11.sql`: idempotent, không `insert` dữ liệu mẫu, nhớ thêm `chat_logs` vào mảng `TABLES` trong `06_Backup_Tool/backup-supabase.mjs`.
- Dialog "xem chi tiết hội thoại" + "xác nhận xoá" trong `admin.html`: dùng đúng class `dlg-standard`/`dlg-head`/`dlg-body`/`dlg-foot` theo `01_Docs/10_Chuan_Dialog_Chung.md`, tương tự tab "Tư vấn" (`switchTab('tuvan')`) đã có.
- Trước khi thêm binding Workers AI vào `wrangler.toml`: kiểm tra lại cú pháp mới nhất trong tài liệu chính thức Cloudflare tại thời điểm code (không chắc chắn `[ai]` + `binding = "AI"` vẫn đúng — cấu hình Cloudflare từng đổi giữa các lần deploy dự án này).

---

## 4. Checklist nghiệm thu Release 1 (rút gọn — bản đầy đủ ở `Dac_ta_Trien_khai_Chatbox.md` mục 8)

| FR | Kịch bản kiểm thử |
|---|---|
| FR-CB-01 | Mở trang trên mobile + desktop, nút Chat Box không đè nút Zalo/scroll-top |
| FR-CB-02, 04 | Bấm từng nút hỏi nhanh, đối chiếu đúng dữ liệu thật trong `admin.html` |
| FR-CB-03, 05 | Hỏi tự do bằng tiếng Việt rồi tiếng Anh, AI trả lời đúng ngôn ngữ, không bịa số liệu |
| FR-CB-07, 08 | Để lại tên + SĐT hợp lệ (dữ liệu test — xem mục 1.3), lead xuất hiện đúng ở `admin.html` kèm chuông thông báo |
| FR-CB-09, 10, 11 | Chat vài lượt, mở tab "Quản lý Chat" thấy đúng phiên vừa test |
| FR-CB-12 | Xoá 1 phiên chat test — có xác nhận, xoá xong biến mất khỏi Supabase |
| FR-CB-14 | Giả lập lỗi gọi AI — trả fallback mời hotline, không lỗi trắng trang |
| FR-CB-15 | Gửi liên tục nhiều câu hỏi — bị giới hạn rate limit, Worker không crash |

---

## 5. Sau khi merge vào `main` và deploy production

1. Theo dõi dashboard Cloudflare Workers AI vài ngày đầu — đảm bảo không vượt quota free 10.000 neuron/ngày ngoài dự kiến (xem tính toán ở `Bao_cao_Phan_tich_Kha_thi_Chatbox.md` mục 2.2).
2. Theo dõi `admin.html` (tab Tư vấn + tab Quản lý Chat mới) 1-2 ngày để xác nhận lead/chat từ khách thật lên đúng, không có lỗi bất ngờ ngoài môi trường test.
3. Rà soát lại không còn sót dữ liệu test nào (xem mục 1.3) — nếu còn sót do quên, xoá ngay qua chức năng mới xây.
4. Báo cáo ngắn gọn cho PM: đã deploy, đã theo dõi gì, có vấn đề gì cần lưu ý không.

---

## 6. Phạm vi KHÔNG làm trong lượt thực thi này

Theo đúng xác nhận của PM ("chatbot thật trước, chuyển ngôn ngữ sau"), **Release 2** dưới đây **chưa** nằm trong phạm vi lượt thực thi này — chỉ bắt đầu khi PM yêu cầu rõ trong hội thoại, và khi đó cần một file chỉ dẫn thực thi riêng (tương tự file này) cho Release 2:

- FR-CB-13: toggle ngôn ngữ Việt/Anh cho toàn bộ nội dung tĩnh của `index.html`.
- FR-CB-16, 17: cột song ngữ `_en` cho `posts`/`dich_vu_gia`/`danh_muc_nuoc` + form nhập song ngữ trong `admin.html` + fallback khi thiếu bản dịch.

Chi tiết đầy đủ của Release 2 đã có sẵn trong `Dac_ta_Trien_khai_Chatbox.md` mục 1.1, 4.4, 6.2-6.4, 7-9 — khi tới lúc làm, đọc lại các mục đó, **không cần phân tích lại từ đầu**.
