# Phase 2 — Handover sang phiên làm việc mới (cập nhật 2026-08-01, GHI ĐÈ bản cũ)

> File này **GHI ĐÈ HOÀN TOÀN** bản `Phase2_Handover_Phien_Moi.md` trước đó. Toàn bộ nội dung
> bản cũ (xoay quanh việc chạy lại migration `so_luong`/Hồ sơ nhóm) **đã xong và đã được xác
> nhận qua nhiều bước test/deploy sau đó** — không cần đọc lại bản cũ, không cần làm lại gì từ
> đó. Đọc file này TRƯỚC khi làm bất kỳ gì tiếp, theo đúng thứ tự: `CLAUDE.md` →
> `04_Phase 2/Phase2_Ban_giao_Claude_Code.md` → file này → bắt tay vào **mục 1**.

## 0. Bối cảnh — 1 phiên làm việc rất dài, đã đi xa hơn nhiều so với Phase 2 gốc

Phiên làm việc vừa qua (dùng worktree nhánh `claude/phase-2-handover-review-7ee1f9`) đã làm
**liên tục nhiều vòng yêu cầu** của người dùng, xa hơn hẳn phạm vi "5 tab CRM" ban đầu của
Phase 2. Tóm tắt theo thứ tự thời gian:

1. Rà soát code Phase 2 đã có sẵn so với bàn giao — phát hiện vài điểm lệch nhỏ (xem mục 6).
2. Sửa dialog "Hồ sơ" theo đúng thiết kế Figma + ảnh mẫu — đổi field (Khách Tip, Phí ship, bỏ
   Thư đi, đổi "Trưởng nhóm"→"Đối tác"), layout header/footer cố định + thân cuộn riêng.
3. Deploy, phát hiện + sửa 1 lỗi thật (thiếu cột `thu_khach_tip` trên Supabase) ngay sau khi
   deploy — đã nhờ người dùng chạy lại SQL, đã verify lại bằng API, đã xác nhận hoạt động đúng.
4. Kiểm tra responsive điện thoại cho dialog Hồ sơ + tạo hẳn 1 **hệ thống dialog dùng chung**
   (class `dlg-*`) — áp dụng lại cho **cả 6 dialog** trong `admin.html`, kèm tài liệu +
   skill riêng (xem mục 3.1).
5. Sửa 7 yêu cầu UI/UX lớn: định dạng bảng trên điện thoại, badge "Bắt buộc"→dấu `*` trên
   điện thoại, PWA cho trang admin, cho xóa danh mục có kiểm tra ràng buộc, Dashboard bỏ nền đỏ,
   giảm padding header dialog, cố định chiều rộng ô trạng thái (xem mục 3.2-3.6).
6. Thêm khóa cuộn màn hình khi có popup/dialog + xây hẳn **popup Confirm/Thông báo dùng chung**
   theo 2 ảnh thiết kế, thay toàn bộ `confirm()` gốc của trình duyệt trong `admin.html` bằng
   popup mới (xem mục 3.7).

**Tất cả đã test trên trình duyệt (bằng Claude Browser) VÀ đã deploy thành công lên trang thật**
(`https://topvisa.nguyennc1357.workers.dev`) — verify bằng cách gọi API/kiểm tra DOM sau mỗi lần
deploy, không chỉ tin "push xong là xong". HEAD của nhánh làm việc trùng khớp `origin/main`.

## 1. Việc CẦN LÀM NGAY / cần hỏi lại người dùng

1. **Chưa xác nhận được: đã chạy lại `04_Phase 2/supabase_setup_phase2.sql` bản MỚI NHẤT
   chưa (đoạn đổi 3 khóa ngoại `nuoc_id`/`muc_dich_id`/`truong_nhom_id` từ `on delete set null`
   sang `on delete restrict`)?** Đây là lớp bảo vệ CSDL bổ sung cho tính năng "xóa danh mục có
   kiểm tra" ở mục 3.4 — tính năng vẫn hoạt động ĐÚNG dù chưa chạy (vì kiểm tra chính nằm ở code
   web `isDanhMucInUse()`), nhưng nếu chưa chạy thì CSDL sẽ không có lớp chặn dự phòng. Hỏi lại
   người dùng, nếu chưa thì nhờ họ chạy lại file SQL (an toàn chạy lại nhiều lần).
2. **3 điểm đã phát hiện từ vòng rà soát đầu phiên, người dùng xác nhận "chưa cần làm" —
   vẫn còn tồn tại, chưa sửa:**
   - Bảng phí đại lý ủy thác (`#dtFeeOverlay`) thiếu validate bắt buộc cho "Nơi nộp"/"Diện
     visa"/"Mức phí" — có thể lưu 1 dòng phí trống. "Nơi nộp" nên là dropdown 4 giá trị cố định
     theo đặc tả, hiện đang là ô nhập chữ tự do.
   - Danh sách quốc gia ở form đăng ký công khai (`index.html`, có "Schengen (châu Âu)" và
     "Khác") không khớp danh mục "Nước đến" trong Cài đặt chung — rủi ro mất dữ liệu quốc gia
     gốc nếu nhân viên sửa/lưu 1 dòng Tư vấn có giá trị này (dropdown sẽ hiện trống).
   - Bảng con "Xử lý phát sinh" thiếu cột hiển thị STT theo đặc tả gốc (chỉ cosmetic).
   Không tự ý sửa 3 điểm này nếu người dùng không nhắc lại — chỉ nhắc nếu họ hỏi hoặc khi liên
   quan trực tiếp tới việc đang làm.
3. Chưa kiểm tra được dữ liệu test hiện có trên Supabase thật (không có quyền đăng nhập trong
   phiên này) — nếu cần biết, đăng nhập thử qua Claude Browser rồi query trực tiếp.

## 2. Trạng thái tổng thể — TẤT CẢ đã code xong + deploy, không có việc dở dang

| Hạng mục | Trạng thái |
|---|---|
| 5 tab CRM (Dashboard, Tư vấn, Hồ sơ, Đại lý ủy thác, Cài đặt chung) | ✅ Xong, deploy |
| Tính năng "Hồ sơ nhóm nhiều khách" + Số lượng nhân chi phí | ✅ Xong, đã test cả với dữ liệu thật |
| Dialog Hồ sơ redesign theo Figma (Khách Tip, Phí ship, bỏ Thư đi) | ✅ Xong, deploy |
| Hệ thống dialog dùng chung `dlg-*` (áp dụng 6/6 dialog) | ✅ Xong, deploy — xem mục 3.1 |
| 7 fix UI/UX (mobile card, badge *, PWA, xóa danh mục, dashboard, padding, status width) | ✅ Xong, deploy — xem mục 3.2-3.6 |
| Scroll-lock + popup Confirm/Thông báo dùng chung | ✅ Xong, deploy — xem mục 3.7 |
| SQL: đổi FK `nuoc_id`/`muc_dich_id`/`truong_nhom_id` sang `restrict` | 🟡 Đã viết trong file SQL, **chưa xác nhận người dùng đã chạy lại chưa** |

## 3. Chi tiết các hệ thống/tính năng mới quan trọng (để không phải đọc lại toàn bộ code)

### 3.1 Hệ thống dialog dùng chung (`dlg-*`)
Đọc **`01_Docs/10_Chuan_Dialog_Chung.md`** trước khi tạo/sửa bất kỳ dialog nào — có mẫu HTML
copy-dán, bảng class, bảng màu, cách format tiền. Cũng có skill project `.claude/skills/dialog-chuan`
tự động gợi ý đọc tài liệu này khi làm việc với dialog. Cả 6 dialog (Hồ sơ, Tư vấn, Đại lý ủy
thác, Bảng phí, Bài viết, Sửa tên danh mục) đã dùng mẫu này — xem bảng chi tiết ở mục 8 của
tài liệu trên.

### 3.2 Bảng trên điện thoại — nhãn + dữ liệu 1 dòng
CSS `@media(max-width:700px)`: `td` giờ là flex row, `::before` hiện `"Label:"` (đậm 700) cùng
dòng với giá trị (đậm 600 nếu có `<b>`, thường thì 400). Cột "Thao tác" ẩn nhãn, canh giữa nút.

### 3.3 PWA cho `admin.html`
File mới: `02_Source/admin-manifest.webmanifest`, `02_Source/sw-admin.js` (service worker KHÔNG
cache gì cả, chỉ để trình duyệt cho phép "Cài đặt" — tránh hiện dữ liệu cũ/sai). Đăng ký trong
script chính qua `navigator.serviceWorker.register('sw-admin.js')`. Chỉ áp dụng cho admin, KHÔNG
áp dụng cho `index.html` (không ai yêu cầu, landing page không cần cài như app).

### 3.4 Xóa danh mục có kiểm tra ràng buộc (Cài đặt chung)
Hàm `deleteDanhMuc(type,id)` + `isDanhMucInUse(type,item)` trong `admin.html` — kiểm tra
`ho_so` (và `leads` với Nước đến/Mục đích, vì cột đó là TEXT lưu theo tên chứ không phải FK)
trước khi xóa thật. Nếu đang dùng → hiện popup Thông báo "Dữ liệu đang được dùng nên không thể
xóa" (không xóa). Lớp bảo vệ CSDL bổ sung (SQL `on delete restrict`) xem mục 1.1.

### 3.5 Dashboard — chữ đỏ thay vì nền đỏ
`renderDashboard()`: xử lý phát sinh quá hạn/đến hạn hôm nay giờ chỉ tô đỏ **chữ** `(Quá hạn)`
hoặc `(Cần xử lý hôm nay)`, không tô nền cả dòng nữa. Class CSS `tr.danger` cũ đã xóa (không còn dùng).

### 3.6 Chiều rộng cố định cho ô trạng thái
Hàm `computeStatusWidths()` (chạy 1 lần lúc tải trang) đo bằng `canvas.measureText()` độ rộng
chữ dài nhất trong 4 nhóm trạng thái (Tư vấn, Hồ sơ, Xử lý phát sinh, Đại lý ủy thác), lưu vào
CSS variable `--w-tuvan`/`--w-hoso`/`--w-xlps`/`--w-doitac`. Class `.stt-tuvan`/`.stt-hoso`/
`.stt-xlps`/`.stt-doitac` áp cho cả `<select>` lẫn `<span class="pill">` cùng nhóm để 2 loại
luôn cùng 1 chiều rộng, không bị nhảy kích thước khi đổi giá trị.

### 3.7 Khóa cuộn màn hình + Popup Confirm/Thông báo dùng chung ⭐ (mới nhất, đáng chú ý nhất)
- **Khóa cuộn:** `initScrollLock()` (cả `admin.html` và `index.html`) dùng `MutationObserver`
  theo dõi class ẩn/hiện của mọi overlay hiện có trong DOM lúc script chạy — hễ còn ít nhất 1
  overlay đang mở thì thêm class `no-scroll` vào `<html>`/`<body>` (CSS `overflow:hidden`), hết
  overlay mới bỏ. Xử lý đúng cả trường hợp lồng nhau (vd popup Confirm mở đè lên dialog Hồ sơ
  đang mở — đóng Confirm xong vẫn khóa vì Hồ sơ còn mở). **Không cần sửa từng hàm open/close** —
  chỉ cần overlay mới tuân đúng quy ước class có sẵn (`admin.html` dùng `.hidden`, `index.html`
  dùng `.show`).
- **Popup dùng chung** (chỉ có trong `admin.html`, xem `#confirmOverlay`/`#notifyOverlay` cuối
  file + hàm `showConfirmPopup()`/`showNotifyPopup()` cuối script): thiết kế theo đúng
  `04_Phase 2/01_Design/Popup_Confirm.png` và `Popup_thong_bao.png` — header xanh `#116EB1`,
  nút "Đồng ý" (`.btn-p`)/"Hủy bỏ" (`.btn-d`), icon tròn đỏ cho popup lỗi. Cả 2 hàm trả về
  `Promise` (`showConfirmPopup` trả `boolean`), gọi bằng `await`.
  - **Đã thay TOÀN BỘ 7 chỗ dùng `confirm()` gốc của trình duyệt trong `admin.html`** sang
    `showConfirmPopup()` — không còn `confirm(` nào trong file (đã grep xác nhận).
  - **Đã thay 3 chỗ toast lỗi "không thể xóa vì đang dùng"** (2 ở `deleteDanhMuc`, 1 ở
    `delDoiTac`) sang `showNotifyPopup()`.
  - **⭐ Lợi ích phụ quan trọng cho phiên sau:** vì không còn `confirm()`/`alert()` gốc nào
    trong `admin.html`, vấn đề "dialog trình duyệt bị tự động suppress trong môi trường test
    tự động" (từng gây khó test ở phiên trước) **không còn xảy ra nữa** — giờ test nhánh
    Đồng ý/Hủy bỏ chỉ cần click thẳng nút `#cfmOkBtn`/`#cfmCancelBtn`, không cần override
    `window.confirm`.
  - `index.html` **chỉ có khóa cuộn**, CHƯA gắn popup Confirm/Thông báo vào (trang này hiện
    không có thao tác xóa/nguy hiểm nào cần dùng tới) — nếu sau này thêm, copy nguyên khối
    HTML/CSS/JS của 2 popup này từ `admin.html` sang.

## 4. ⚠️ QUAN TRỌNG — vẫn còn nguyên rủi ro "2 bản sao file", đọc kỹ trước khi sửa `04_Phase 2/`

Dự án có **2 vị trí file trùng tên, CÓ THỂ khác nội dung** nếu không cẩn thận:

1. **Thư mục gốc dự án**: `D:\01_NguyenNC\10_Claude\03_Study VS1\Vs-Landing-Page\` — nơi người
   dùng thực sự mở file để đọc/copy-paste vào Supabase SQL Editor, và có thể tự sửa tay file
   `.md`/`.xlsx` trong đó. File này (`Phase2_Handover_Phien_Moi.md`) đã được ghi ở CẢ 2 nơi
   trong phiên này (đồng bộ), nhưng các file khác trong `04_Phase 2/` (SQL, tài liệu bàn giao)
   **chỉ được sửa ở worktree** — nếu người dùng tự mở file SQL ở thư mục gốc để chạy, cần nhắc
   họ dùng đúng bản mới nhất (đã đẩy lên GitHub `main`, có thể tải lại hoặc đối chiếu qua
   GitHub nếu nghi ngờ lệch).
2. **Git worktree của phiên làm việc**: `...\.claude\worktrees\<tên-nhánh>\` — nơi agent thao
   tác `git commit`/`git push` trực tiếp lên `origin/main` suốt phiên này.

**Trước khi sửa bất kỳ file nào trong `04_Phase 2/` hoặc `01_Docs/`, kiểm tra xem người dùng có
đang thao tác ở thư mục gốc không** (đặc biệt file SQL — chạy nhầm bản cũ đã từng gây mất 1
vòng hỏi-đáp ở phiên trước).

## 5. Quy trình deploy đã dùng suốt phiên này (tiếp tục dùng cách này)

- KHÔNG có quyền chạy SQL trực tiếp lên Supabase — luôn nhờ người dùng tự chạy trong SQL
  Editor, verify lại bằng cách gọi `api(...)` thử qua Claude Browser sau khi họ xác nhận.
- Deploy code: sửa `02_Source/admin.html`/`index.html` → kiểm tra cú pháp JS bằng
  `node -e "new Function(...)"` (xem `CLAUDE.md` mục 9) → test qua Claude Browser (mở file
  local trước khi deploy) → `git add` + `git commit` → `git push origin <nhánh>` rồi
  `git push origin <nhánh>:main` (fast-forward thẳng vào `main`, KHÔNG tạo Pull Request —
  người dùng đã xác nhận cách này từ đầu Phase 2). Cloudflare Workers tự deploy từ `main`,
  thường trong ~10-30 giây nhưng đôi khi cần đợi thêm rồi `navigate` lại với `force:true` để
  bỏ cache mới thấy bản mới.
- Luôn verify lại trên trang thật sau deploy bằng cách kiểm tra DOM/gọi hàm qua
  `javascript_tool` (vd `document.body.innerHTML.includes(...)`) — không chỉ tin "push xong
  là xong".

## 6. Vòng rà soát đầu phiên — đã tìm ra gì, đã sửa gì, còn gì chưa sửa

Đầu phiên có làm 1 vòng rà soát code Phase 2 đã có sẵn so với bàn giao, phát hiện:
- Tên "Trưởng nhóm" cuối cùng trong Excel/SQL lệch nhau → **đã hỏi người dùng, đã sửa**: đổi
  hẳn UI "Trưởng nhóm" → "Đối tác" theo yêu cầu người dùng (dù Figma/Excel gốc không ghi vậy).
- 3 điểm còn lại (bảng phí thiếu validate, danh sách quốc gia landing lệch danh mục quản trị,
  thiếu cột STT) — người dùng xác nhận **"chưa cần làm"**, xem lại mục 1.2 ở trên nếu cần làm.

## 7. Tài liệu tham khảo (đọc theo đúng thứ tự nếu cần)

`CLAUDE.md` → `01_Docs/08_Ban_giao_Claude_Code.md` (Phase 1) →
`04_Phase 2/Phase2_Ban_giao_Claude_Code.md` (mục 9 = tóm tắt đợt sửa dialog Figma) →
`01_Docs/10_Chuan_Dialog_Chung.md` (⭐ mới — chuẩn dialog dùng chung, đọc trước khi làm dialog) →
`04_Phase 2/supabase_setup_phase2.sql` → file này.
