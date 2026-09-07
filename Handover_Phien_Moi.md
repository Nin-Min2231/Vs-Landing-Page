# Handover — Bàn giao sang phiên làm việc mới (2026-09-07, bản 18 — GHI ĐÈ toàn bộ bản cũ)

> File này **GHI ĐÈ HOÀN TOÀN** mọi bản handover cũ (bản 1→17) — **không cần đọc lại bản cũ**, nội
> dung quan trọng còn giá trị đã gom hết vào đây. Đọc theo đúng thứ tự: `CLAUDE.md` (toàn bộ, đặc
> biệt mục 49→61) → file này → `10_SEO/11_Ke_hoach_sau_xac_nhan.md` mục 0 (8 ràng buộc) → bắt tay
> vào việc tiếp theo ở **mục 2** dưới đây.

## 0. Trạng thái ngay lúc viết file này

**Có 2 việc PM cần tự làm ngay, ghi ở đầu cho khỏi lọt (chi tiết ở mục 2.A):** nghiệm thu 3 tính
năng admin vừa deploy hôm nay, và cấp thông tin để mở chặn các task SEO còn lại.

**Kế hoạch SEO (`10_SEO/11_Ke_hoach_sau_xac_nhan.md`) KHÔNG có gì mới so với bản 16/17** — cả 2
phiên gần nhất (2026-09-02 và 2026-09-07) đều KHÔNG làm thêm task nào trong `10_SEO/`, vì mọi task
còn lại đều đang chờ thông tin từ PM hoặc nội dung từ chuyên viên visa.

**Phiên này (2026-09-07) làm 3 yêu cầu PM cho màn admin — đã deploy + xác nhận trên production**
(commit `fee1384`, xem đầy đủ kỹ thuật ở **CLAUDE.md mục 61**):

| # | Yêu cầu PM | Đã làm |
|---|---|---|
| 1 | Màn "Tài chính": thêm số lượng hồ sơ sau tên khách | Dòng "Thu" đổi sang `Tên khách (SL) - Nước`, vd `Mạc Lê Ý Nhi (2) - Nhật Bản`. Thêm `so_luong` vào query `ho_so`. File CSV xuất ra tự có định dạng mới |
| 2 | "Thành viên nhóm" (dialog Hồ sơ): thêm bằng cách chọn từ "Thông tin khách hàng" | Icon 🔍 cạnh tiêu đề mở **đúng dialog "Chọn khách hàng" đang dùng chung** với ô "Tên khách hàng"; chọn 1 record → thêm dòng kèm SĐT + Ghi chú lấy từ `khach_hang`; **chỉ Xóa, không Sửa**; đã bỏ hẳn 3 ô nhập tay + nút "+ Thêm"/"Hủy sửa"/"Sửa" (xoá cả HTML lẫn 3 hàm JS) |
| 3 | Thêm trạng thái hồ sơ "Xong" | Sort cùng nhóm với "Đậu" (`HS_STATUS_ORDER` = 3); màn Tài chính + "Lợi nhuận tháng này" ở Dashboard đều tính vào; màu xanh dương đậm `#BFDBFE` riêng biệt |

**KHÔNG cần migration cho phiên này** — `ho_so.trang_thai` là `text not null default 'Đang xử lý'`,
**không có CHECK constraint** (đã kiểm `05_Database/02_supabase_setup_phase2.sql` dòng 121), nên
thêm giá trị trạng thái mới chỉ là đổi danh sách lựa chọn trong `admin.html`. Cùng tiền lệ đổi
`leads.status` ("Đã gọi"→"Đang tư vấn") ở `04_supabase_setup_phase4.sql` mục D.2. **Nhớ điều này
trước khi viết migration cho lần thêm/đổi trạng thái tiếp theo** — cả 2 bảng đều không có
constraint, đừng viết migration không cần thiết.

## 1. Cấu trúc file — không đổi so với bản 16/17

`02_Source/public/` vẫn là thư mục DUY NHẤT được `[assets]` phục vụ ra Internet; `worker.js`/
`wrangler.toml`/`package.json` vẫn ở gốc `02_Source/`, không public — xem CLAUDE.md mục 4 + 52.
Phiên này KHÔNG thêm/xoá file nào, chỉ sửa nội dung `admin.html` (+ ghi thêm mục 61 vào `CLAUDE.md`).

## 2. Việc tiếp theo

### 2.A ⭐ Chờ PM nghiệm thu 3 tính năng vừa deploy hôm nay (việc mới, chưa xong)

Claude Code **không có mật khẩu admin** nên không test được luồng sau đăng nhập — mọi kiểm chứng
phiên này là mock `api()` trên bản local + kiểm cấu trúc/hằng số/CSS trên production thật. PM cần
tự bấm thử 3 việc, có gì lệch báo lại để sửa:
1. **Tài chính** — dòng "Thu" hiện đúng `Tên khách (SL) - Nước`.
2. **Hồ sơ → Sửa hồ sơ → Thành viên nhóm** — bấm 🔍, chọn 1 khách: SĐT/Ghi chú tự điền đúng và ô
   "Số lượng" tự tăng. Thử chọn lại chính khách đó, hoặc chọn đúng khách hàng CHÍNH của hồ sơ →
   phải KHÔNG thấy trong danh sách (đã cố ý chặn trùng).
3. **Trạng thái "Xong"** — đổi 1 hồ sơ (đã có Ngày trả KQ + lợi nhuận khác 0) sang "Xong", rồi kiểm
   hồ sơ đó xuất hiện ở màn Tài chính, và "Lợi nhuận tháng này" ở Dashboard khớp số với "Lợi nhuận"
   ở màn Tài chính.

**Hệ quả nghiệp vụ của việc 2 đã nói rõ với PM, nhắc lại kẻo quên:** bỏ nhập tay nghĩa là khách
**chưa có trong màn "Thông tin khách hàng" thì không thêm vào nhóm được nữa** — phải tạo record
khách hàng trước. Đây là hệ quả tất yếu của yêu cầu, và đồng nhất với ô "Tên khách hàng" (vốn đã
`readonly`, buộc chọn từ danh sách từ trước). Nếu PM thấy bất tiện, phương án đã đề xuất sẵn: thêm
nút "Tạo khách hàng mới" ngay trong dialog "Chọn khách hàng" — **chưa làm, chờ PM quyết**.

### 2.B Kế hoạch SEO — giống hệt bản 16/17, chưa có gì thay đổi

**Không còn task nào "làm ngay không chờ ai" trong danh sách D1 của kế hoạch SEO.** Trước khi bắt
đầu bất kỳ việc gì, hỏi người dùng muốn cấp thông tin cho nhóm nào trước:

**Chờ PM cấp thông tin:**
| Task | Cần gì | Thời gian |
|---|---|---|
| T8 | GA4 Measurement ID (`G-XXXXXXX`) | 15 phút (Phần B kế hoạch) |
| T10 | Giờ làm việc + toạ độ lat/long từ Google Business Profile | 10 phút |
| T12 | Page-id Facebook (cho link `m.me/...` nút nổi) | 5 phút |
| T19 | Tài khoản Brevo + API key (email tự động sau khi khách gửi form) | 15 phút |
| T20 | Tên + chức danh + số năm KN của 1-2 chuyên viên (và họ đồng ý công khai) | 5 phút |
| T22b | Duyệt câu chữ banner cookie (nên hỏi người có chuyên môn pháp lý) | 15 phút |
| T25/T26/T27 | Nghĩa vụ pháp lý BVDLCN, mốc ĐKKD — T27 (region Supabase) **đã trả lời: ngoài VN**, còn T25/T26 | — |

**Chờ chuyên viên visa cấp nội dung (Claude Code TUYỆT ĐỐI không tự viết thay):**
| Task | Cần gì |
|---|---|
| T14 | Nội dung chuyên môn 1.200-2.000 từ/nước cho ít nhất 1 trong 7 trang quốc gia (bảng `noi_dung_quoc_gia` đã sẵn sàng nhận qua admin, đã có 1 dòng TEST do PM tự nhập — CHƯA phải nội dung thật, xem CLAUDE.md mục 58) |
| T15/T17 | Checklist giấy tờ theo nước × mục đích (bảng `checklist_items`, dùng chung cho cả 2 công cụ) |
| T18 | Xác nhận thời gian xử lý 2026 cho 7 nước + bổ sung Mỹ/Úc (hiện FAQ chỉ có 4 nước) |

**T11b** (trang `gioi-thieu.html`) chờ PM cấp nội dung câu chuyện công ty + ảnh đội ngũ/văn phòng.

**Gợi ý thứ tự nếu PM/chuyên viên cấp được nhiều thứ cùng lúc:** T20 (5 phút, mở khoá byline cho cả
T14 lẫn bài viết) → T8/T10/T12 (đều nhanh, không phụ thuộc nhau) → T14 (việc lớn nhất còn lại, cần
chuyên viên) → T15/T17/T18.

## 3. ⚠️ Bài học kỹ thuật quan trọng — áp dụng cho MỌI việc sau này

### 3.1 Landing page / route mới (A-G giữ nguyên từ bản 17, vẫn còn giá trị)

- **A.** Cloudflare Static Assets tự 307-redirect MỌI file `.html` sang bản không đuôi — canonical +
  mọi link nội bộ trang mới PHẢI dùng path không đuôi; dò tồn tại file tĩnh bằng `env.ASSETS.fetch()`
  phải dò path không đuôi (dò bằng `.html` luôn ra 307, không phải 2xx).
- **B.** Route SSR không có file tĩnh dự phòng PHẢI nhận cả `GET` lẫn `HEAD` (bài học T4/T21,
  `curl -I` sẽ ra 404 nếu quên dù `curl` thường vẫn đúng).
- **C.** Poll `curl` sau khi deploy — điều kiện dừng vòng lặp PHẢI phân biệt được bản MỚI với bản CŨ
  (đừng dùng điều kiện mà cả 2 bản đều thoả, vd "thấy `<urlset>`" — dùng chuỗi CHỈ CÓ ở bản mới).
  Đã tự vướng lại bẫy này 3 lần (T21, T5, và phiên 2026-09-07 lần curl đầu vẫn ra bản cũ).
- **D.** Thiết kế "tự động nhận diện, không cần sửa lại file" (trang 404, sitemap dò trang tin cậy/
  trang quốc gia qua `try/catch`, `trackToolEvent()` chờ GA4) tiếp tục hiệu quả — nhưng xem mục E,
  thiết kế này có 1 GIỚI HẠN quan trọng khi áp cho FILE TĨNH (khác route động).
- **E.** **3 trang pháp lý (T11) là bản snapshot TĨNH, KHÔNG tự đồng bộ với `index.html`:** khác
  `/blog`/`/blog/<slug>`/404 (SSR qua `worker.js`, dùng `getSiteChrome()` trích navbar/footer/CSS
  trực tiếp từ `index.html` mỗi request nên LUÔN khớp 100%), 3 file `chinh-sach-bao-mat.html`/
  `dieu-khoan-dich-vu.html`/`lien-he.html` (+ `cong-cu/uoc-tinh-chi-phi-visa.html`) là file tĩnh
  dựng 1 LẦN bằng script Node — mọi thay đổi SAU ĐÓ ở navbar/footer/nút liên hệ nổi/Chat Box của
  `index.html` **KHÔNG tự lan sang**. **Quy tắc bắt buộc: mỗi khi sửa navbar/footer/widget nổi
  (`.float-contact`/`.chatbox-*`) ở `index.html`, PHẢI tự kiểm tra và đồng bộ lại các file tĩnh này
  bằng tay** — không có cảnh báo tự động nào. Nếu còn tái diễn nhiều lần nữa, cân nhắc đề xuất PM
  chuyển hẳn sang SSR qua `worker.js` — KHÔNG tự ý đổi (thay đổi kiến trúc, phải PM đồng ý).
- **F.** **Navbar nhiều mục (≥7-8 mục + CTA) cần ngưỡng "chuyển sang hamburger" RIÊNG**
  (`@media(max-width:1099px)`), tách khỏi ngưỡng layout mobile chung (`767px` cho hero/grid/footer)
  — 2 nhu cầu này có ngưỡng an toàn khác nhau hẳn. Thêm mục menu mới thì đo lại tổng bề rộng tự
  nhiên các mục ở container 1200px so với khoảng dư, đừng đoán.
- **G.** **Cuộn tới `#hash` lúc TẢI TRANG có thể trượt sai nếu trang chèn nội dung ĐỘNG làm tăng
  chiều cao sau khi tải** (cú cuộn của trình duyệt "đuổi theo" đích đang dịch chuyển, có thể trượt
  hẳn tới đáy trang). Cách sửa CHUẨN đã áp dụng (`fixInitialHashScroll()` trong `index.html`):
  (1) script NGAY ĐẦU `<head>` xoá `#hash` khỏi URL (`history.replaceState`, giữ giá trị ở
  `window.__initialHash__`) — phải LOẠI HẲN nguồn cuộn cạnh tranh, chỉ đổi `scroll-behavior` KHÔNG
  ĐỦ; (2) sau khi mọi nội dung chèn động đã xong (gọi trong `finally` từng khối async) thì tự cuộn
  lại; (3) BẮT BUỘC `scrollIntoView({behavior:'instant'})` vì hàm bị gọi nhiều lần.
  **Thêm 1 khối chèn động MỚI ảnh hưởng chiều cao trang → nhớ thêm `finally{ fixInitialHashScroll(); }`.**

### 3.2 ⭐ MỚI (2026-09-07) — bài học từ phiên admin, áp dụng cho MỌI thay đổi sau này

- **H. Điều kiện lọc viết theo WHITELIST thì tự đúng khi thêm giá trị mới; BLACKLIST thì phải nhớ
  sửa.** Bằng chứng thật ngay trong phiên này: thêm trạng thái "Xong" mà **không phải sửa** "Hồ sơ
  trả kết quả tuần này" ở Dashboard (`renderDashTraKqTuan()`, lọc `=== 'Đã nộp' || === 'Đang xử lý'`)
  lẫn job thông báo trong `worker.js` (`trang_thai=in.("Đã nộp","Đang xử lý")`) — hồ sơ "Xong" tự
  động bị loại, đúng ý nghĩa "đã có kết quả cuối thì không còn sắp trả KQ". Nếu 2 chỗ đó viết kiểu
  "loại trừ Đậu/Rớt/Hủy" thì hôm nay đã phải sửa thêm 2 nơi và rất dễ quên 1 nơi. **Từ nay viết
  điều kiện lọc trạng thái thì ưu tiên liệt kê cái CẦN LẤY, không liệt kê cái cần loại** — cùng họ
  lý do đã chọn Phương án A ở mục 52 (chuyển file thay vì blocklist từng tên file).
- **I. Gặp 2 chỗ viết cứng cùng 1 danh sách → gom thành 1 hằng số NGAY, đừng chỉ ghi comment "nhớ
  sửa cả 2 nơi".** `loadTaiChinh()` (lọc qua REST `in.()`) và `renderDashboard()` ("Lợi nhuận tháng
  này", lọc phía client) trước đây mỗi bên tự viết `['Đậu','Rớt','Hủy']`, và CLAUDE.md mục 27 đã
  dặn "sửa 1 chỗ thì PHẢI sửa chỗ kia cho khớp" — lời dặn đó vẫn dựa vào việc người sau đọc được
  comment. Đã gom thành `HS_STATUS_KET_QUA_CUOI = ['Đậu','Xong','Rớt','Hủy']`: thêm trạng thái kết
  quả cuối lần sau chỉ sửa đúng 1 dòng. Đây là cùng 1 loại rủi ro "2 bản sao dễ lệch nhau" đã ghi
  ở mục 45/52/56/60 — nhưng ở lớp dữ liệu/hằng số.
- **J. Cần thêm 1 dialog "gần giống" dialog đã có → dùng CHUNG dialog cũ + 1 biến chế độ, đừng nhân
  bản.** Yêu cầu 2 phiên này cần đúng dialog "Chọn khách hàng" — đã tái dùng `#khPickOverlay` với
  biến `KH_PICK_MODE` (`'hoso'`/`'tvien'`), `pickKhachHang()` rẽ nhánh ở đầu hàm. Nhân bản ra
  dialog thứ 2 sẽ lệch nhau ngay lần sửa giao diện kế tiếp.
- **K. ⚠️ BẪY CSS: `<select>` KHÔNG được đặt `color` chữ sáng.** Các class `.status-select.st-*`
  trong `admin.html` **chỉ đặt `background`, cố ý không đặt `color`** — nếu đặt `color:#fff` thì
  trên Chrome/Windows các `<option>` trong danh sách bung ra kế thừa màu chữ đó → chữ trắng trên
  nền trắng, không đọc được. Vì lý do này màu trạng thái mới phải là **nền pastel + chữ mặc định**,
  không phải nền đậm + chữ trắng. Thêm trạng thái mới thì làm theo đúng khuôn 5 class `st-*` có sẵn.
- **L. Chọn màu trạng thái mới phải ĐO, không phải đoán.** Ban đầu định cho "Xong" màu xanh dương —
  hoá ra "Đang xử lý" đã dùng xanh dương nhạt (`--pl` `#E8F1FE`) cho pill/chip rồi (dù cho `select`
  lại là cam `#FFF2E0`, bản thân chỗ này vốn đã không đồng bộ). Đã đổi sang xanh dương ĐẬM
  `#BFDBFE`/chữ `#1E40AF` rồi **đo `getComputedStyle` cả 6 chip cạnh nhau để chắc chắn ra 6 màu
  khác nhau thật** (không tin mắt/không tin bảng màu trên giấy).
- **M. `ho_so.so_luong` do TRIGGER CSDL tính (`1 khách chính + số dòng ho_so_thanh_vien`), không
  nhập tay** — mọi thao tác thêm/xoá thành viên nhóm PHẢI gọi lại `refreshSoLuong()` sau đó, nếu
  không form hiển thị số cũ. Hệ quả quan trọng khi thiết kế tính năng: `so_luong` **nhân vào 2 khoản
  chi** (`chi_le_phi_lanh_su`, `chi_doi_tac_ctv`) nên đếm đôi 1 người là lệch luôn lợi nhuận — đó là
  lý do việc chặn trùng thành viên phải gồm **cả khách hàng CHÍNH của hồ sơ**, không chỉ các thành
  viên đã thêm.

## 4. Cách đã test/xác nhận (giữ quy trình bản 17, thêm 2 mục MỚI)

- **worker.js:** viết xong → `node --check` → viết script Node import thẳng `worker.js` thật, mock
  `env.ASSETS.fetch`/`global.fetch`, dùng dữ liệu thật qua REST API khi cần.
- **Trang tĩnh/`index.html`/`admin.html`:** `node --check` (trích mọi khối `<script>` KHÔNG có
  `src=` bằng regex) + `python3 html.parser` (cân bằng thẻ) trước mỗi lần deploy — không ngoại lệ.
- **Sau khi deploy:** poll `curl` bằng điều kiện phân biệt bản mới/cũ (mục 3.1.C), rồi hồi quy đầy
  đủ: `/worker.js` + `/wrangler.toml` + `/package.json` phải 404; `/`, `/admin`, `/blog`,
  `/sitemap.xml`, `/robots.txt`, 3 trang pháp lý, `/cong-cu/uoc-tinh-chi-phi-visa` phải 200; trang
  404 tuỳ chỉnh phải 404; redirect `workers.dev` phải 301; `/api/chat` route đúng; giá SSR + favicon
  không đổi.
- **⭐ MỚI — test màn admin khi KHÔNG có mật khẩu đăng nhập:** mở `admin.html` bằng Claude Browser
  rồi **mock `window.api()` thành 1 CSDL trong bộ nhớ, mô phỏng luôn cả TRIGGER** (vd
  `ho_so?id=eq.N&select=so_luong` trả `1 + số dòng thành viên` để đúng hành vi trigger thật) — cách
  này test được trọn luồng CRUD mà **không tạo dữ liệu test thật trên production** (khác vài phiên
  trước từng tạo lead test rồi phải nhờ PM xoá). Ghi lại `window.__posts__` để kiểm payload gửi đi.
  **Bấm bằng `.click()` THẬT lên đúng element** (chạy đúng `onclick` trong HTML) thay vì gọi hàm
  trực tiếp — đúng cách đã dùng ở mục 54. Nhớ test cả: đóng dialog ngay sau thao tác bảng con
  **không** bị `confirmCloseDialog()` hỏi "chưa lưu" oan (mục 23), và trạng thái khi hồ sơ CHƯA lưu.
- **⚠️ MỚI — 3 giới hạn công cụ Claude Browser đã gặp lại, ĐỪNG mất thời gian debug tưởng lỗi code:**
  (1) `computer` tool báo `left_click failed: the press at (0,0) could not be attributed to a frame`
  khi element cần cuộn tới mới thấy; (2) ảnh chụp màn hình chỉ ra 1 góc trang đã cũ dù đã
  `scroll_to` + `resize_window` (cùng họ lỗi "xếp lớp/không compositing khung nhìn thật" đã ghi ở
  mục 20/47/53/55); (3) preview pane nạp file cục bộ dưới dạng **`data:` URL** nên `localStorage`
  bị chặn → console có 1 lỗi `SecurityError` từ `tv5s_device_id` (**code cũ, không liên quan thay
  đổi đang test** — xác nhận bằng `git diff | grep localStorage` ra rỗng trước khi kết luận).
  **Cách đi tiếp đã hiệu quả: `.click()` + `javascript_tool` đọc kết quả, không dựa vào ảnh chụp.**
- **⚠️ Giữ từ bản 17 — độ tin cậy của Claude Browser khi test hành vi CUỘN TRANG
  (`scrollY`/`scrollIntoView`) RẤT THẤP**, thấp hơn hẳn click/`form_input`/đọc DOM. Cùng 1 đoạn
  code, đo lại nhiều lần cho `scrollY` khác nhau hẳn (0, giá trị đúng, hoặc đáy trang). Đã tách bạch
  được đây là nhiễu THẬT của công cụ (so với Wikipedia cuộn `#hash` đúng ổn định) — **khi debug lại
  loại lỗi cuộn trang, LUÔN mở tab HOÀN TOÀN MỚI trước khi kết luận (tab cũ dùng nhiều lần trong
  phiên có xu hướng "hỏng" dần), và ưu tiên bấm bằng toạ độ pixel thật qua `computer` hơn là gọi
  hàm JS qua `javascript_tool`.**

## 5. Quy trình deploy (không đổi)

`git push` thẳng `main` → Cloudflare tự deploy (~8-30 giây, đôi khi lâu hơn ~1 phút, kiên nhẫn poll
thêm trước khi nghi ngờ deploy thất bại). Chỉ `git add` đúng file mình sửa — repo còn nhiều thư mục
untracked sẵn (`10_SEO/`, `05_Branding_5S/`, `06_Phase 3_Tai_Chinh/`...), **đừng `git add -A`**.
Migration SQL: Claude Code không có quyền chạy trực tiếp trên Supabase — viết file trong
`05_Database/`, PM tự chạy trong SQL Editor, phải tự xác nhận PM đã chạy xong trước khi build route
phụ thuộc cột/bảng mới (bài học mục 45/58). Nhưng xem lại mục 0: **kiểm có CHECK constraint thật
không trước khi viết migration cho việc thêm/đổi giá trị trạng thái** — cả `ho_so.trang_thai` lẫn
`leads.status` đều là `text` tự do, không cần migration.

## 6. Tài liệu tham khảo

`CLAUDE.md` mục 49→59 (kế hoạch SEO, chi tiết từng task) → **mục 60 (đọc kỹ trước khi sửa navbar/
footer/widget nổi hoặc bất kỳ trang nào có cuộn-tới-anchor)** → **mục 61 (MỚI — đọc kỹ trước khi
sửa màn Hồ sơ/Tài chính/Dashboard hoặc thêm trạng thái mới)** → `10_SEO/11_Ke_hoach_sau_xac_nhan.md`
(spec đầy đủ các task còn lại, đọc mục 0 trước mỗi task, nhớ cộng `public/` vào đường dẫn cũ — xem
CLAUDE.md mục 1) → `10_SEO/12_Thu_tu_thuc_hien.xlsx` (thứ tự 20 bước) →
`10_SEO/13_Prompt_Claude_Code.md` (prompt mẫu nếu PM dùng) →
`01_Docs/10_Chuan_Dialog_Chung.md` (chuẩn dialog `dlg-*`, đọc trước khi dựng dialog mới) → file này.

**Có 1 skill sẵn trong repo:** `.claude/skills/dialog-chuan/` — tự kích hoạt khi làm việc với dialog
trong `admin.html`, chỉ tới đúng `01_Docs/10_Chuan_Dialog_Chung.md` ở trên. ⚠️ File skill đó ghi
đường dẫn **`02_Source/admin.html` kiểu CŨ** (viết trước khi chuyển file vào `public/` ở mục 52) —
đường dẫn đúng hiện tại là `02_Source/public/admin.html`, tự hiểu ngầm quy tắc cộng `public/` ở
CLAUDE.md mục 1/52 khi đọc.
