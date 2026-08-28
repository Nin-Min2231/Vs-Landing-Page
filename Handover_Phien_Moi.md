# Handover — Bàn giao sang phiên làm việc mới (2026-08-21, bản 12 — GHI ĐÈ toàn bộ bản cũ)

> File này **GHI ĐÈ HOÀN TOÀN** mọi bản handover cũ (bản 1→11) — **không cần đọc lại bản cũ**, nội
> dung quan trọng còn giá trị đã gom hết vào đây. Đọc theo đúng thứ tự: `CLAUDE.md` (toàn bộ, đặc
> biệt mục 46) → file này → bắt tay vào **mục 1**.

## 0. Trạng thái ngay lúc viết file này

- **✅ ĐÃ ĐÓNG HOÀN TOÀN đợt sửa lỗi landing page (21/8):** PM đã tự test trên browser + điện thoại
  và xác nhận OK cho toàn bộ 4 việc dưới đây. Xem chi tiết đầy đủ ở `CLAUDE.md` mục 46.
  1. **Section "Tin tức" biến mất khỏi trang chủ** (không chỉ riêng 1 bài viết mới) — nguyên nhân
     thật: lời gọi hàm `closeMobileMenuOnClick()` đã bị xóa từ 10/8 nhưng còn sót lại 1 chỗ gọi
     orphan trong script "Danh mục bài viết động", gây `ReferenceError` bị `try/catch` nuốt âm
     thầm, dừng cả vòng lặp build menu/section giữa chừng. Đã xóa lời gọi thừa này.
  2. **Dialog xem chi tiết bài viết bị giật khi mở/đóng** — sửa qua 3 lượt liên tiếp (PM phản hồi
     từng lượt cho tới khi mượt hoàn toàn): đổi hẳn kỹ thuật khóa cuộn nền từ
     `overflow:hidden;height:100%` sang `position:fixed`+`top` âm (tránh mất `scrollTop` lúc
     khóa), đổi khôi phục vị trí sang `scrollTo({behavior:'instant'})` (tránh bị animation do
     `scroll-behavior:smooth` của `<html>` ăn luôn cả thay đổi gán bằng code), đổi thứ tự reset
     `scrollTop` của dialog sang SAU khi hiện dialog (tránh giữ lại vị trí đọc dở lần trước).
  3. **Bù giật ngang nhẹ** (phát hiện qua 1 lượt review độc lập sau khi PM đã xác nhận OK, đúng quy
     tắc mục 44) — thanh cuộn dọc biến mất lúc khóa làm nội dung giãn rộng thêm vài chục px trên
     desktop dùng thanh cuộn cổ điển. Đã bù `padding-right` đúng bằng độ rộng thanh cuộn.
  4. **`admin.html` tab "Bài viết" — field "Danh mục" giờ bắt buộc chọn** (đây là nguyên nhân gốc
     khiến bài viết ở mục 1 từng lưu được mà không gán Danh mục) — thêm nhãn "Bắt buộc" + chặn lưu
     nếu chưa chọn.
- **Không còn việc gì đang treo/cấp bách tại thời điểm viết file này.**
- Nhánh làm việc: vẫn đẩy thẳng `main`, không bị chặn quyền push. Commit mới nhất: `782e0ff`
  (bao gồm cả bản 12 của file này, commit ngay sau khi viết xong).

## 1. Việc nên theo dõi (không cấp bách)

1. **Theo dõi thêm vài ngày** để chắc chắn không còn bài viết nào bị "biến mất" khỏi trang chủ do
   thiếu Danh mục — bài viết CŨ đã có sẵn `category_id=null` trong DB (tạo trước khi có validate
   bắt buộc ở mục 0.4) **không tự động được sửa**, chỉ khi PM mở lại để sửa và bấm Lưu mới bị chặn
   buộc chọn Danh mục. Nếu PM báo còn bài nào "mất tích" trên trang chủ, kiểm tra trước tiên bằng
   cách gọi thẳng API `posts?select=id,title,category_id&published=eq.true` xem có dòng nào
   `category_id: null` không (cách đã dùng để chẩn đoán đúng sự cố lần này, xem `CLAUDE.md` mục
   46.A) — nhanh hơn nhiều so với đọc code trước.
2. **Bài học quy trình quan trọng nhất rút ra từ sự cố lần này** (đã ghi vào `CLAUDE.md` mục 46,
   nhắc lại ở đây vì rất dễ quên lặp lại): khi xóa/đổi tên 1 hàm dùng chung trong `index.html` hoặc
   `admin.html`, PHẢI grep toàn file tìm HẾT mọi nơi gọi tới hàm đó trước khi coi là xong — không
   chỉ sửa đúng chỗ đang làm việc. Đặc biệt nguy hiểm khi lời gọi orphan đó nằm trong 1 khối có
   `try/catch` bọc ngoài (mục đích ban đầu để 1 lỗi nhỏ không làm crash cả trang) — lỗi lập trình
   thật bị nuốt âm thầm, không có tín hiệu debug nào cả, có thể treo hàng tuần mà không ai biết
   (giống hệt kiểu sự cố migration thiếu ở `CLAUDE.md` mục 45).
3. Subagent tùy chỉnh `code-reviewer` tại `.claude/agents/code-reviewer.md` (từ bản handover 11)
   **vẫn CHƯA được commit vào git**. Phiên này dùng skill có sẵn `/code-review` (không phải
   subagent tùy chỉnh) để tự review lại code trước khi bàn giao — hoạt động tốt, có thể tiếp tục
   dùng cách này cho các phiên sau nếu subagent tùy chỉnh chưa sẵn sàng.

## 2. Cách đã test/xác nhận

- Điều tra nguyên nhân (mục 0.1): dùng `curl` gọi thẳng Supabase REST API để so dữ liệu thật, dùng
  `javascript_tool` của Claude Browser chạy lại từng đoạn script để tái hiện đúng lỗi
  `ReferenceError` bị nuốt.
- Sửa dialog (mục 0.2-0.3): dựng server tĩnh local (`python -m http.server`) để test bản sửa trước
  khi deploy thật; môi trường Claude Browser trong phiên này chạy NỀN (chưa được hiển thị/composite)
  nên không mô phỏng đầy đủ thao tác cuộn chuột thật được — đã nói rõ giới hạn này với PM, **PM tự
  test trên browser thật + điện thoại và xác nhận OK qua từng lượt** (3 lượt liên tiếp cho tới khi
  mượt hoàn toàn).
- Field bắt buộc (mục 0.4): kiểm tra cú pháp JS bằng `node --check`, PM tự test qua UI thật xác
  nhận chặn lưu đúng khi bỏ trống.
- **Đã chạy 1 lượt review độc lập** (skill `/code-review`, effort cao) SAU KHI PM xác nhận OK toàn
  bộ — đúng quy tắc rút ra ở `CLAUDE.md` mục 44 (luôn review lại sau 1 đợt sửa dồn dập, dù mỗi thay
  đổi đã tự test riêng lẻ). Tìm thêm đúng 1 vấn đề thật (giật ngang do thanh cuộn, mục 0.3) và đã
  sửa + deploy luôn trước khi coi là xong.

## 3. Quy trình deploy

Vẫn `git push` thẳng `main`, Cloudflare tự deploy — tiếp tục dùng cách tự poll `curl`/`until` sau
mỗi lần push để xác nhận deploy xong, không cần đợi PM tự kiểm tra Dashboard. Toàn bộ 4 commit của
phiên này đều đã push + xác nhận deploy xong qua cách này, không có việc gì tồn đọng.

## 4. Tài liệu tham khảo

`CLAUDE.md` mục 46 (đầy đủ chi tiết nguyên nhân + cách sửa của cả 4 việc) → file này.
