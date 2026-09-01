# Handover — Bàn giao sang phiên làm việc mới (2026-09-01, bản 14 — GHI ĐÈ toàn bộ bản cũ)

> File này **GHI ĐÈ HOÀN TOÀN** mọi bản handover cũ (bản 1→13) — **không cần đọc lại bản cũ**, nội
> dung quan trọng còn giá trị đã gom hết vào đây. Đọc theo đúng thứ tự: `CLAUDE.md` (toàn bộ, đặc
> biệt mục 47-48) → file này → bắt tay vào **mục 1**.

## 0. Trạng thái ngay lúc viết file này

- **✅ ĐÃ ĐÓNG HOÀN TOÀN cả 2 tính năng lớn của đợt này — PM đã tự test trên production và xác nhận
  OK cho cả 2, không còn việc gì tồn đọng/cấp bách.**
  1. **Chat Box Release 1** (hỗ trợ khách hỏi dịch vụ Visa ngay trên trang chủ, xem `CLAUDE.md` mục
     47) — widget chat + AI trả lời (Cloudflare Workers AI, miễn phí) + tự tạo lead khi khách để lại
     SĐT + tab "Quản lý Chat" trong trang quản trị. Đã qua 2 vòng chỉnh UI theo phản hồi PM (vị trí
     tab, icon nút chat, bố cục khung chat, canh giữa filter, màu nút xác nhận) + sửa 1 lỗi thật
     (AI trả lời sai ngôn ngữ, sửa qua 3 lượt mới ổn định — bài học quan trọng, xem mục 47.F).
  2. **Feedback khách hàng từ Facebook** (thay 2 review viết cứng cũ trên trang chủ, xem `CLAUDE.md`
     mục 48) — khối CRUD "📘 Feedback từ khách hàng" trong trang quản trị (Cài đặt chung), có thêm
     field "Tháng/Năm đánh giá" (PM tự chọn đúng tháng/năm thật, không phải ngày tạo dòng). Trang
     chủ tự lấy dữ liệu này hiển thị, bấm tên khách mở đúng URL Facebook thật.
- **Không còn việc gì đang treo/cấp bách tại thời điểm viết file này.**
- Nhánh làm việc: đẩy thẳng `main`, không bị chặn quyền push. Commit mới nhất: `e4b62c2` (cùng các
  commit chỉnh tài liệu ngay sau khi viết xong bản handover này).

## 1. Việc nên theo dõi (không cấp bách)

1. **Release 2 của Chat Box** (cho phép khách chuyển toàn trang sang tiếng Anh + admin nhập bản
   dịch tiếng Anh cho bài viết/giá/thông tin quốc gia) — **CHƯA làm**, chỉ bắt đầu khi PM yêu cầu rõ
   trong hội thoại. Khi tới lúc, đọc lại `08_Chatbox/Dac_ta_Trien_khai_Chatbox.md` mục 1.1/4.4/
   6.2-6.4/7-9 — không cần phân tích lại từ đầu, tài liệu đã có sẵn đầy đủ.
2. **Theo dõi dashboard Cloudflare Workers AI vài ngày** — đảm bảo Chat Box không vượt quota free
   10.000 neuron/ngày ngoài dự kiến (mới deploy 2026-08-29, còn khá mới).
3. Model AI hiện dùng cho Chat Box: `@cf/meta/llama-3.1-8b-instruct-fast` — nếu sau này cần đổi
   model khác (vd nếu Cloudflare ngừng hỗ trợ, hoặc PM muốn chất lượng trả lời tốt hơn), đọc kỹ bài
   học ở `CLAUDE.md` mục 47.F trước khi đổi cách xử lý song ngữ (đã thử 2 cách qua prompt đều KHÔNG
   đủ tin cậy với model hiện tại, cách đang dùng là "luôn sinh tiếng Việt rồi dịch riêng sang tiếng
   Anh nếu cần" — model khác có thể cần cách tiếp cận khác, đừng giả định lại y hệt).
4. **2 review cũ ("Anh Võ Kiên", "Pon Tí Tởn") không còn hiển thị trên trang chủ** kể từ khi PM thêm
   feedback thật qua trang quản trị (đúng theo thiết kế — trang chủ giờ ưu tiên dữ liệu động từ
   admin, 2 review cũ trong HTML chỉ còn là fallback dự phòng khi bảng rỗng/lỗi mạng). Nếu PM muốn
   2 review cũ đó xuất hiện lại, cần tự thêm chúng qua trang quản trị (Claude Code không tự ý chèn
   lại — dữ liệu mẫu không được tự ý insert, xem `CLAUDE.md` mục 10).
5. Có 1 thư mục mới xuất hiện ở gốc dự án: `10_SEO/` — **CHƯA có yêu cầu nào liên quan tới thư mục
   này trong phiên này**, chỉ mới thấy xuất hiện trong `git status` (untracked). Nếu phiên sau PM
   nhắc tới, đọc file `.md` bên trong (theo đúng mẫu `08_Chatbox/`/`09_Facebook/` đã dùng) trước khi
   code — đừng tự suy đoán nội dung nếu chưa đọc.

## 2. Cách đã test/xác nhận

- Cả 2 tính năng đều theo đúng quy trình đã hình thành trong đợt này: code → `node --check` +
  Claude Browser (mock dữ liệu/`api()`) → **tự test thêm bằng `curl` gọi thẳng production sau khi
  deploy** (đặc biệt quan trọng với Chat Box vì có gọi AI ngoài, không giả lập được cục bộ) → PM tự
  test trên trình duyệt/điện thoại thật, phản hồi qua hội thoại (đôi khi kèm ảnh chụp màn hình thật)
  → sửa tiếp nếu cần → PM xác nhận OK.
- **Bài học quy trình quan trọng nhất của đợt này** (áp dụng cho mọi tính năng lớn sau này có gọi
  dịch vụ ngoài/API mới): đừng chỉ tin vào test cục bộ/mock — chủ động gọi thẳng production bằng
  `curl` NGAY SAU KHI deploy (dùng dữ liệu/`session_id` rõ ràng đánh dấu TEST) để tự bắt lỗi trước
  khi PM phát hiện. Lỗi "AI trả lời sai ngôn ngữ" ở Chat Box chỉ lộ ra theo cách này.

## 3. Quy trình deploy

Vẫn `git push` thẳng `main`, Cloudflare tự deploy (build/deploy xong trong khoảng 20-30 giây) — tiếp
tục dùng cách tự poll `curl`/`until` sau mỗi lần push để xác nhận deploy xong, không cần đợi PM tự
kiểm tra Dashboard. **Lưu ý khi poll bằng `curl` cho `admin.html`:** Cloudflare tự redirect
`/admin.html` → `/admin` (307), nếu curl không theo redirect (`-L`) sẽ chỉ thấy response rỗng —
dùng `curl -sL` hoặc gọi thẳng path `/admin` (không có đuôi `.html`) để tránh nhầm tưởng chưa deploy
xong (đã tự vướng lỗi này 1 lần trong phiên, tốn thời gian debug nhầm chỗ).

## 4. Tài liệu tham khảo

`CLAUDE.md` mục 47 (Chat Box, đầy đủ chi tiết + bài học ngôn ngữ AI) + mục 48 (Feedback khách hàng)
→ `08_Chatbox/` (tài liệu phân tích/đặc tả gốc Chat Box, cần khi làm Release 2) + `09_Facebook/`
(yêu cầu gốc Feedback khách hàng) → file này.
