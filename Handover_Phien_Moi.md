# Handover — Bàn giao sang phiên làm việc mới (2026-08-29, bản 13 — GHI ĐÈ toàn bộ bản cũ)

> File này **GHI ĐÈ HOÀN TOÀN** mọi bản handover cũ (bản 1→12) — **không cần đọc lại bản cũ**, nội
> dung quan trọng còn giá trị đã gom hết vào đây. Đọc theo đúng thứ tự: `CLAUDE.md` (toàn bộ, đặc
> biệt mục 47) → file này → bắt tay vào **mục 1**.

## 0. Trạng thái ngay lúc viết file này

- **✅ ĐÃ DEPLOY THẬT lên production: Chat Box Release 1** (hỗ trợ khách hỏi về dịch vụ Visa ngay
  trên trang chủ `topvisa5s.com` + tab "Quản lý Chat" trong trang quản trị). PM đã tự test trực tiếp
  trên production và xác nhận OK, kể cả 2 vòng chỉnh sửa giao diện theo phản hồi thực tế. Xem chi
  tiết đầy đủ ở `CLAUDE.md` mục 47 (đặc biệt mục F — lỗi AI trả lời sai ngôn ngữ phát hiện lúc test
  thật, sửa qua 3 lượt mới ổn định; mục G — 2 vòng phản hồi UI).
- **Tóm tắt việc đã làm trong phiên này** (bắt đầu từ yêu cầu "đọc handover + làm folder 08_Chatbox"):
  1. Đọc toàn bộ tài liệu `08_Chatbox/` (yêu cầu gốc, báo cáo khả thi, đặc tả kỹ thuật, chỉ dẫn thực
     thi) + khảo sát source code hiện tại trước khi code.
  2. Tạo nhánh `feature/chatbox-release1`, code theo đúng 3 nhóm (A: widget `index.html`, B: route
     `/api/chat` trong `worker.js` + migration `chat_logs`, C: tab "Quản lý Chat" trong `admin.html`).
  3. PM chạy xong migration `05_Database/11_supabase_setup_phase11.sql`, yêu cầu deploy thẳng lên
     production để tự test (không có cách tự dựng môi trường test riêng) → merge `main` + push
     (Cloudflare tự deploy).
  4. Test thật bằng `curl` gọi `/api/chat` trên production → phát hiện lỗi AI trả lời sai ngôn ngữ,
     sửa qua 3 lượt (xem CLAUDE.md mục 47.F) mới ổn định.
  5. PM tự test trên `topvisa5s.com` + trang quản trị, gửi 2 vòng phản hồi UI kèm ảnh chụp thực tế
     (vị trí tab, icon nút chat, bố cục khung chat, canh giữa filter, màu nút xác nhận) — đã sửa +
     deploy hết cả 2 vòng (xem CLAUDE.md mục 47.G).
  6. PM xác nhận "test xong" → cập nhật lại tài liệu (`CLAUDE.md`, `README.md`,
     `05_Database/README.md`, `06_Backup_Tool/README.md`) cho khớp trạng thái thật.
- **Nhánh làm việc:** đã merge `feature/chatbox-release1` vào `main`, từ đó đẩy thẳng tiếp `main`
  cho mọi lượt sửa nhỏ trong lúc debug cùng tính năng vừa deploy (đúng quy ước cũ của dự án "vẫn đẩy
  thẳng `main`, không bị chặn quyền push"). Nhánh `feature/chatbox-release1` vẫn còn trên GitHub
  (đã merge xong, an toàn để xóa dọn dẹp nếu PM muốn — **chưa tự ý xóa** vì PM chưa yêu cầu).
- Commit mới nhất tính tới lúc viết file này: `ca44e4c` (UI Chat Box vòng 2) + các commit cập nhật
  tài liệu ngay sau đó.

## 1. Việc nên theo dõi / còn tồn đọng (không cấp bách nhưng CHƯA xong)

1. ~~Xóa dữ liệu THỬ NGHIỆM do Claude Code tạo ra lúc tự test bằng `curl` trên production~~ — **✅ PM
   xác nhận đã xóa xong (2026-08-29)**, không còn tồn đọng.
2. **Đối chiếu độ chính xác câu trả lời dài của AI** (vd hỏi "cần giấy tờ gì cho visa Nhật Bản" ra
   câu trả lời khá chi tiết) **với đúng nội dung field "Checklist hồ sơ" PM đã nhập ở admin.html**
   (Cài đặt chung → Nước đến → Nhật Bản) — Claude Code không có quyền đọc bảng `danh_muc_nuoc` bằng
   `anon` key nên không tự đối chiếu được. Test grounding khác (hỏi về nước không có dữ liệu, vd
   "Iceland") cho kết quả tốt (AI thành thật nói không có thông tin, không bịa số) nên khả năng cao
   là ổn, nhưng **chưa được xác nhận 100%** cho trường hợp cụ thể này — đây là loại rủi ro
   "bịa thông tin pháp lý" mà `CLAUDE.md` mục 8/10 cấm tuyệt đối, ưu tiên kiểm tra sớm.
3. Theo dõi dashboard Cloudflare Workers AI vài ngày đầu — đảm bảo không vượt quota free 10.000
   neuron/ngày ngoài dự kiến.
4. **Release 2** (cho phép khách chuyển toàn trang sang tiếng Anh, admin nhập thêm bản dịch tiếng
   Anh cho bài viết/giá/thông tin quốc gia) **CHƯA làm** — chỉ bắt đầu khi PM yêu cầu rõ, đọc lại
   `08_Chatbox/Dac_ta_Trien_khai_Chatbox.md` mục 1.1/4.4/6.2-6.4/7-9 khi tới lúc, không cần phân
   tích lại từ đầu.

## 2. Cách đã test/xác nhận

- Trước khi deploy: `node --check` cho `worker.js` + toàn bộ script inline `index.html`/`admin.html`;
  unit test riêng 13 case cho 3 hàm regex nhạy cảm nhất (dò SĐT/tên/ngôn ngữ); Claude Browser
  (`javascript_tool`, môi trường chạy nền không composite được nên không dùng được `screenshot`) để
  test logic UI bằng cách gọi hàm trực tiếp + mock dữ liệu/`api()`.
- **Sau khi deploy: test THẬT bằng `curl` gọi thẳng `/api/chat` trên `topvisa5s.com`** — đây là lần
  đầu tiên dự án này test 1 tính năng mới bằng cách gọi thẳng production ngay sau deploy (thay vì
  chỉ tin vào test cục bộ) — cách này giúp bắt được lỗi ngôn ngữ thật mà mọi test cục bộ trước đó
  không phát hiện ra (vì cần gọi thật tới Cloudflare Workers AI, không mô phỏng được). **Bài học:
  với tính năng có gọi AI/dịch vụ ngoài mà không thể giả lập cục bộ, nên chủ động test thật bằng
  `curl` NGAY SAU KHI deploy (dùng dữ liệu/`session_id` rõ ràng đánh dấu TEST), đừng đợi PM tự phát
  hiện lỗi.**
- PM tự test trực tiếp trên `topvisa5s.com` (điện thoại + trình duyệt) + trang quản trị, gửi phản
  hồi kèm ảnh chụp màn hình thực tế qua 2 vòng — mỗi vòng đều đã sửa + deploy lại + tự kiểm tra qua
  Claude Browser trước khi báo lại PM.

## 3. Quy trình deploy

Vẫn `git push` thẳng `main`, Cloudflare tự deploy — tiếp tục dùng cách tự poll `curl`/`until` sau
mỗi lần push để xác nhận deploy xong (khoảng 20-30 giây/lần). **Điểm khác so với các phiên fix nhỏ
trước đây:** tính năng Chat Box (lớn hơn, rủi ro cao hơn — có endpoint API mới, bảng dữ liệu mới, có
gọi AI ngoài) được code trên 1 nhánh riêng (`feature/chatbox-release1`) trước, chỉ merge vào `main`
sau khi PM xác nhận rõ ràng muốn deploy để tự test — đúng theo yêu cầu PM đặt ra riêng cho lượt này
(`08_Chatbox/Chi_dan_Thuc_hien_Phat_trien_Chatbox.md` mục 1). **Gợi ý cho phiên sau:** nếu làm tiếp
1 tính năng lớn/rủi ro tương tự (đổi schema DB, thêm API mới, tích hợp dịch vụ ngoài), nên tiếp tục
theo mẫu "nhánh riêng → PM xác nhận → merge" này; còn sửa lỗi nhỏ/tinh chỉnh UI như thường ngày thì
vẫn đẩy thẳng `main` như quy ước cũ của dự án.

## 4. Tài liệu tham khảo

`CLAUDE.md` mục 47 (toàn bộ chi tiết kỹ thuật: thiết kế, quyết định RLS, model AI, quá trình sửa lỗi
ngôn ngữ, 2 vòng phản hồi UI) → `08_Chatbox/` (tài liệu phân tích/đặc tả gốc, đọc khi cần làm Release
2 hoặc hiểu lại bối cảnh ban đầu) → file này.
