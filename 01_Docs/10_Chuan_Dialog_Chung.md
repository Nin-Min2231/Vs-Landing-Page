# 10. Chuẩn dialog chung (dùng cho `admin.html`)

> Dành cho AI agent (Claude Code). Đọc file này TRƯỚC khi tạo mới hoặc sửa lại 1 dialog (popup form) bất kỳ trong `admin.html`, để giao diện các dialog luôn đồng bộ — cùng màu sắc, cùng cách bố trí, cùng cách cuộn, cùng vị trí nút.
>
> Nguồn gốc: dialog "Đăng ký hồ sơ mới" (tab Hồ sơ), làm theo thiết kế Figma ngày 2026-08. Xem `admin.html`, khối `#hoOverlay` là ví dụ tham chiếu đầy đủ nhất — copy cấu trúc từ đó khi cần.
>
> Cập nhật 2026-08: đã áp dụng mẫu này cho **toàn bộ 6 dialog** trong `admin.html` (Hồ sơ, Tư vấn, Đại lý ủy thác, Bảng phí đại lý, Bài viết, Sửa tên danh mục) — xem danh sách chi tiết ở mục 8.

## 1. Khi nào dùng mẫu này

Dùng cho **mọi dialog dạng form nhiều field** trong `admin.html` — đặc biệt khi:
- Form có nhiều nhóm thông tin khác nhau (vd: "Thông tin khách", "Thông tin thu chi"...).
- Form có thể dài hơn màn hình (cần cuộn), nhưng vẫn muốn luôn thấy tiêu đề + nút Lưu/Đóng mà không phải cuộn tới tận đầu/cuối.
- Form có field tiền (VNĐ) cần định dạng dấu chấm ngăn cách hàng nghìn.

Với dialog quá đơn giản (1-2 field, chắc chắn không bao giờ dài hơn màn hình) như "Sửa tên danh mục" (`#renameOverlay`), vẫn nên dùng `dlg-standard`/`dlg-head`/`dlg-body`/`dlg-foot` để đồng bộ màu sắc + vị trí nút X/nút Lưu, nhưng KHÔNG cần chia `.dlg-section`/`.dlg-row` — chỉ cần bọc field trong `.dlg-field` đơn giản (xem `#renameOverlay` làm ví dụ).

## 2. Cấu trúc HTML mẫu (copy — chỉ đổi nội dung bên trong)

```html
<div class="overlay hidden" id="xxxOverlay">
  <div class="modal modal-xl dlg-standard">
    <div class="dlg-head">
      <h3 id="xxxModalTitle">Tiêu đề dialog</h3>
      <button type="button" class="modal-x" onclick="closeXxxModal()" aria-label="Đóng">✕</button>
    </div>

    <div class="dlg-body">
      <!-- toàn bộ field/section nằm trong đây -->
      <div class="dlg-section">
        <div class="dlg-section-title">Tên nhóm field</div>
        <div class="dlg-row">
          <div class="dlg-field"><label>Tên field <span class="req-badge">Bắt buộc</span></label><input type="text" id="..."></div>
          <div class="dlg-field"><label>Tên field khác</label><select id="..."></select></div>
          <div class="dlg-field dlg-field-wide"><label>Field cần rộng hơn (gấp đôi)</label><input type="text" id="..."></div>
        </div>
      </div>
      <!-- lặp lại .dlg-section cho từng nhóm field -->
    </div>

    <div class="modal-actions dlg-foot">
      <button class="btn btn-g" onclick="closeXxxModal()">Đóng lại</button>
      <button class="btn btn-p" id="xxxSaveBtn" onclick="saveXxx()">Lưu</button>
    </div>
  </div>
</div>
```

**Lưu ý bắt buộc:**
- `modal-xl` cho form nhiều cột (rộng 1200px); dùng `modal-lg` (920px) nếu form ít field hơn. Không dùng mặc định `modal` (600px) vì quá hẹp cho layout nhiều cột.
- `dlg-row` tự động chia cột theo chiều rộng màn hình (xem mục 4) — KHÔNG cần viết class riêng cho "3 cột"/"4 cột", cứ thêm bao nhiêu `.dlg-field` cũng được, trình duyệt tự xếp.
- Nút X và 2 nút cuối luôn gọi hàm đóng dialog, không tự ý đổi tên hàm khác nhau giữa các dialog nếu không cần.

## 3. Bảng class CSS (định nghĩa trong `<style>` đầu file, tìm theo comment `"Dialog chuẩn" (dlg-*)`)

| Class | Dùng ở đâu | Ý nghĩa |
|---|---|---|
| `.modal.dlg-standard` | thẻ `.modal` ngoài cùng | Bật chế độ: header/footer cố định, phần giữa cuộn riêng (thay vì cuộn cả dialog) |
| `.dlg-head` | div chứa tiêu đề + nút X | Cố định trên cùng, có viền dưới |
| `.dlg-head h3` | thẻ `<h3>` tiêu đề | Màu xanh `#0752A3`, canh giữa |
| `.modal-x` | nút đóng dạng X | Vùng bấm 40×40px (đủ lớn cho ngón tay), hover đổi màu nhạt |
| `.dlg-body` | div bọc toàn bộ field | Phần DUY NHẤT được cuộn (`overflow-y:auto`) |
| `.modal-actions.dlg-foot` | div chứa 2 nút cuối | Cố định dưới cùng, có viền trên |
| `.dlg-section` | mỗi nhóm field | Khung nền xanh nhạt `#CCE3F0`, viền `#D5D9E0`, bo góc |
| `.dlg-section-title` | dòng tiêu đề của nhóm | Có vạch xanh `#1E5AE8` bên trái + chữ đậm |
| `.dlg-row` | hàng chứa nhiều field | Grid tự chia cột, xuống dòng tự động khi hẹp |
| `.dlg-field` | 1 field (label + input) | Đơn vị nhỏ nhất trong `.dlg-row` |
| `.dlg-field-wide` | field cần rộng hơn (vd Địa chỉ, Ghi chú) | Chiếm gấp đôi chiều rộng 1 field thường |
| `.req-badge` | thẻ nhỏ cạnh label | Badge đỏ "Bắt buộc" |
| `.money-input` | input số tiền cho nhập tay | Canh phải chữ, kết hợp hàm JS ở mục 5 |
| `.money-readonly` | input tổng tiền chỉ đọc | Nền xanh lá `#E6F8EB`, canh phải, chữ đậm |
| `.status-select` + `.st-*` | select trạng thái | Đổi màu nền theo giá trị đang chọn (xem mục 6) |

## 4. Màu (lấy đúng theo Figma, không tự đổi khi copy sang dialog khác)

| Tên | Mã màu | Dùng cho |
|---|---|---|
| Xanh tiêu đề | `#0752A3` | Chữ tiêu đề dialog |
| Xanh vạch section | `#1E5AE8` | Vạch trước tên nhóm field |
| Nền section | `#CCE3F0` | Nền mỗi khung nhóm field |
| Viền section | `#D5D9E0` | Viền khung nhóm field |
| Viền input | `rgba(0,64,133,.5)` | Viền các ô nhập trong dialog |
| Badge bắt buộc | `#D64550` | Nền badge "Bắt buộc" |
| Nền tổng tiền | `#E6F8EB` | Nền các ô tổng tiền chỉ đọc |

Nếu 1 dialog khác cần thêm màu trạng thái mới (giống `.status-select`), tái sử dụng bảng màu pill đã có sẵn (`--ok`, `--warn`, `--err`, `--acc`, `--mut` trong `:root`) thay vì tự bịa màu mới.

## 5. Định dạng ô tiền (dấu "." ngăn cách hàng nghìn, canh phải)

Đã có sẵn 3 hàm dùng chung trong `<script>` (phần "Phase 2: HỒ SƠ"), tái sử dụng cho bất kỳ dialog nào có field tiền, không viết lại:

```js
unformatMoney(str)   // "1.234.567" -> 1234567 (số thật, dùng khi gửi API)
formatMoney(n)       // 1234567 -> "1.234.567" (dùng khi đổ dữ liệu cũ vào ô lúc mở dialog)
onMoneyInput(el)     // gắn vào oninput của ô — tự format khi đang gõ
```

Cách dùng trong HTML:
```html
<input type="text" inputmode="numeric" class="money-input" id="xxxSoTien"
  placeholder="Vui lòng nhập" oninput="onMoneyInput(this)">
```
Khi mở dialog (hàm `openXxxModal`): `$('xxxSoTien').value = formatMoney(data?.so_tien);`
Khi lưu (hàm `saveXxx`): `so_tien: unformatMoney($('xxxSoTien').value)`

## 6. Select đổi màu theo trạng thái (tuỳ chọn — chỉ dùng nếu field có nhiều trạng thái như "Trạng thái hồ sơ")

```html
<select id="xxxTrangThai" class="status-select" onchange="capNhatMauTrangThai(this)">...</select>
```
```js
function capNhatMauTrangThai(sel){
  const map = {'Giá trị 1':'st-dxl','Giá trị 2':'st-dn', ...}; // tự định nghĩa theo dialog
  sel.className = 'status-select ' + (map[sel.value]||'st-dxl');
}
```
Xem hàm `hsStatusSelectClass()`/`updateHoSoStatusColor()` trong `admin.html` làm ví dụ mẫu.

## 7. Responsive (đã tự động, không cần làm thêm gì)

- `.dlg-row` dùng CSS Grid `auto-fit` — tự động xuống 1 cột trên điện thoại, không cần viết media query riêng cho từng dialog.
- Bảng con (Thành viên nhóm, Xử lý phát sinh...) tự chuyển từ dạng bảng sang dạng thẻ (card) trên màn hình <700px — quy tắc này áp dụng chung cho MỌI bảng `.tbl-wrap` + `<table>` trong toàn bộ `admin.html`, không riêng gì dialog — nhớ gọi `applyRowLabels('xxxBody')` sau khi render bảng con để dòng thẻ hiện đúng tên field.
- Đã test thật trên khung hình điện thoại 375px — không tràn ngang, nút X đủ lớn để bấm, nút Đóng/Lưu không bị vỡ layout.

## 8. Danh sách dialog đã áp dụng mẫu này (2026-08 — cả 6/6 dialog trong `admin.html`)

| Dialog | ID overlay | Số nhóm field (`.dlg-section`) | Ghi chú riêng |
|---|---|---|---|
| Đăng ký hồ sơ mới | `#hoOverlay` | 6 nhóm (Thông tin khách, Thông tin nộp hồ sơ, Thu/Chi, Thành viên nhóm, Xử lý phát sinh, Ghi chú) | Dialog gốc, tham chiếu đầy đủ nhất — có field tiền (`money-input`), select đổi màu theo trạng thái (`status-select`), field Số lượng cho sửa tay |
| Tư vấn | `#tvOverlay` | 2 nhóm (Thông tin khách hàng, Chi tiết tư vấn) | modal-lg |
| Đại lý ủy thác | `#dtOverlay` | 2 nhóm (Thông tin đại lý ủy thác, Ghi chú) | modal-lg |
| Bảng phí đại lý | `#dtFeeOverlay` | 2 nhóm (Các mức phí đã có, Thêm mức phí mới) | modal-xl, chỉ có nút "Đóng lại" (không có nút Lưu — mỗi dòng phí lưu ngay khi bấm "+ Thêm") |
| Bài viết | `#postOverlay` | 2 nhóm (Thông tin bài viết, Nội dung) | modal-lg, textarea nội dung dài (8 dòng) nằm trong `.dlg-body` nên cuộn được khi bài dài |
| Sửa tên danh mục | `#renameOverlay` | Không chia section (chỉ 1 field) | Dialog nhỏ nhất — vẫn dùng `dlg-standard`/`dlg-head`/`dlg-foot` để đồng bộ màu/nút, nhưng field đặt trực tiếp trong `.dlg-body`, không bọc `.dlg-section` |

Khi tạo dialog mới trong tương lai, thêm 1 dòng vào bảng này để danh sách luôn cập nhật.
