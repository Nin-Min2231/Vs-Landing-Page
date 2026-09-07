---
name: dialog-chuan
description: Mẫu dialog/popup chuẩn dùng chung cho admin.html của dự án Top Visa (header/footer cố định, section màu xanh nhạt, ô tiền định dạng dấu chấm). Dùng khi tạo mới hoặc chỉnh sửa bố cục 1 dialog nhiều field trong admin.html.
---

# Dialog chuẩn cho admin.html (Top Visa)

Khi cần tạo mới hoặc sửa bố cục 1 dialog (popup form) trong `02_Source/public/admin.html`, đọc đầy đủ **`01_Docs/10_Chuan_Dialog_Chung.md`** trước khi viết code — file đó có:

- Cấu trúc HTML mẫu để copy (class `dlg-standard`, `dlg-head`, `dlg-body`, `dlg-foot`, `dlg-section`, `dlg-row`, `dlg-field`).
- Bảng màu chính xác (nền section `#CCE3F0`, vạch xanh `#1E5AE8`, badge bắt buộc `#D64550`, nền tổng tiền `#E6F8EB`...).
- 3 hàm JS dùng chung để định dạng tiền có dấu chấm ngăn cách hàng nghìn (`formatMoney`, `unformatMoney`, `onMoneyInput`).
- Cách làm select đổi màu theo trạng thái.
- Lưu ý responsive (đã tự động qua CSS Grid `auto-fit`, không cần viết media query riêng).

Dialog tham chiếu đầy đủ nhất: `#hoOverlay` (dialog "Đăng ký hồ sơ mới", tab Hồ sơ) trong `admin.html` — copy cấu trúc từ đó. Tính đến **2026-09-07 (đã rà soát lại bằng script), cả 14/14 dialog** trong `admin.html` đã dùng mẫu này và đều đạt chuẩn — xem bảng đầy đủ ở mục 8 của tài liệu. Dialog mới tạo thêm sau này cũng phải theo mẫu, **nhớ thêm 1 dòng vào bảng mục 8** (cuối mục 8 có ghi sẵn 2 câu lệnh grep để rà lại nhanh).

2 điều dễ làm sai, đọc trước khi viết code:
- **Field tiền:** dùng `onChiMoneyInput(el)` (chỉ format), **không** dùng `onMoneyInput(el)` — hàm sau còn gọi thêm `updateHoSoTotals()`, chỉ đúng cho dialog Hồ sơ. Xem bảng so sánh ở mục 5 của tài liệu.
- **Dialog 1-2 field:** dùng `class="modal dlg-standard"` + inline `style="max-width:400px"`, không thêm `modal-lg`/`modal-xl` (xem mục 1). Mẫu: `#renameOverlay`, `#dvgOverlay`.

Không tự bịa màu/spacing mới khi có thể tái dùng token đã liệt kê trong tài liệu trên hoặc trong `01_Docs/04_Design_System.md`.
