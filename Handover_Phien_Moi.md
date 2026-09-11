# Handover — Bàn giao sang phiên làm việc mới (2026-09-11, bản 20 — GHI ĐÈ toàn bộ bản cũ)

> File này **GHI ĐÈ HOÀN TOÀN** mọi bản handover cũ (bản 1→19) — **không cần đọc lại bản cũ**, nội
> dung quan trọng còn giá trị đã gom hết vào đây. Đọc theo đúng thứ tự: `CLAUDE.md` (toàn bộ, đặc
> biệt mục 49→63) → file này → `10_SEO/11_Ke_hoach_sau_xac_nhan.md` mục 0 (8 ràng buộc) → bắt tay
> vào việc tiếp theo ở **mục 2** dưới đây.

## 0. Trạng thái ngay lúc viết file này

**Toàn bộ việc PM có thể tự làm cho SEO đã XONG.** Mọi task còn lại chờ **thông tin PM cấp** hoặc
**nội dung chuyên viên soạn** — không còn việc nào Claude Code làm được một mình.

### Đã xác minh trên production ngày 2026-09-11 (không phải đọc tài liệu)

| Hạng mục | Trạng thái thật |
|---|---|
| GA4 `G-YF2B7B2MJR` | ✅ có trên trang, **chỉ nạp sau khi khách bấm "Đồng ý"** |
| Banner cookie (T22b) | ✅ có trên cả 8 trang |
| `sameAs` | ✅ **2 link** (đều là trang doanh nghiệp) |
| FAQ thời gian xử lý | ✅ có cụm "tính theo ngày làm việc", đủ 7 nước |
| Sitemap | ✅ **18 URL, tất cả trả 200**, không có URL chết |
| Byline chuyên viên | ✅ "Thu Hiền · Chuyên viên, 10 năm kinh nghiệm hồ sơ visa" |
| Cloudflare Web Analytics | ✅ đang chạy (đã bật từ 1 tháng trước) |
| Sitemap đã gửi + Request Indexing | ✅ PM làm 2026-09-10 |

### 5 đợt việc trong 4 ngày qua (2026-09-07 → 09-11) — chi tiết ở CLAUDE.md

1. **Mục 61** — Admin: số lượng HS ở màn Tài chính · Thành viên nhóm chọn từ "Thông tin khách
   hàng" (bỏ nhập tay) · thêm trạng thái hồ sơ **"Xong"**.
2. **Mục 61 (cập nhật)** — màn Tài chính thêm cột **"Trạng thái"**; canh giữa cột Trạng thái, canh
   phải cột Số tiền; màu "Hủy" xám → **tím** `#EDE9FE`/`#6D28D9`.
3. **Rà 14 dialog** `admin.html` đối chiếu `01_Docs/10_Chuan_Dialog_Chung.md` → **14/14 đạt chuẩn**;
   cập nhật lại tài liệu + skill (số cũ "6/6" lỗi thời, bảng mục 8 thiếu 3 dòng).
4. **Mục 62** — **T8 (GA4) + T22b (banner cookie)** cùng đợt + **chốt chặn sitemap** không khai URL
   `/visa-*` khi route T14 chưa có. Kèm **đính chính** về Cloudflare Web Analytics.
5. **Mục 63** — **T18** (thời gian xử lý 2026, bổ sung Úc, làm rõ ngày làm việc) + **T20** (byline
   chuyên viên, `Article.author` đổi `Organization` → `Person`) + bỏ link tư vấn viên khỏi `sameAs`.

## 1. Cấu trúc file — không đổi

`02_Source/public/` vẫn là thư mục DUY NHẤT được `[assets]` phục vụ ra Internet; `worker.js`/
`wrangler.toml`/`package.json` vẫn ở gốc `02_Source/`, không public — xem CLAUDE.md mục 4 + 52.
4 ngày qua KHÔNG thêm/xoá file nào.

## 2. Việc tiếp theo

### 2.A Không còn việc nào "làm ngay không chờ ai"

**Trước khi bắt đầu, hỏi người dùng muốn cấp thông tin cho nhóm nào trước.** Phiên trước đã nêu
từng việc thành câu hỏi cụ thể trên chat và PM trả lời cuốn chiếu từng cái — **cách này hiệu quả,
nên làm lại như vậy** thay vì hỏi chung chung "anh muốn làm gì tiếp".

**Chờ PM cấp thông tin:**
| Task | Cần chính xác cái gì | Lấy ở đâu |
|---|---|---|
| T10 | Giờ làm việc (copy **nguyên văn** từ GBP) + toạ độ lat/long | GBP → bấm địa chỉ → URL Maps dạng `.../@16.07xx,108.15xx,17z` |
| T12 | Facebook **Page-ID** (cho `m.me/...`) + xác nhận có gọi lại được trong 30 phút giờ hành chính không | Cài đặt trang FB → Thông tin trang → ID trang |
| T19 | Tài khoản Brevo + API key (**đặt qua Cloudflare secret, KHÔNG dán lên chat**) | brevo.com → SMTP & API → API Keys |
| T11b | Câu chuyện công ty + ảnh đội ngũ/văn phòng cho `gioi-thieu.html` (hiện **404**) | PM viết |
| T25/T26 | Nghĩa vụ BVDLCN 91/2025 (cần luật sư) · mốc đăng ký kinh doanh | PM + luật sư |

**Chờ chuyên viên visa (Claude Code TUYỆT ĐỐI không tự viết thay):**
| Task | Cần gì | Ghi chú |
|---|---|---|
| T14 | 1.200–2.000 từ/nước cho ít nhất 1 trong 7 nước | Hạ tầng **đã sẵn sàng 100%** (bảng + màn nhập admin). **Bắt đầu 1 nước thôi**, xem kết quả thật rồi mới nhân rộng |
| T15/T17 | Checklist giấy tờ theo nước × mục đích | **Bảng `checklist_items` CHƯA TỒN TẠI** — phải viết migration 15 trước. Đề xuất bắt đầu **Nhật Bản × Du lịch** |

**T18 đã XONG** (chuyên viên cấp số 2026-09-11). **T20 đã XONG** (PM cấp tên Thu Hiền).

### 2.B ⚠️ Việc CẦN NHỚ khi T14 xong

Khi chuyên viên nhập nội dung thật và bấm publish, **PHẢI đổi `VISA_COUNTRY_ROUTE_READY` trong
`worker.js` từ `false` thành `true`** — đúng 1 dòng. Đây là chốt chặn cố ý để sitemap và trang 404
không khai URL `/visa-*` khi route chưa tồn tại (xem bài học I ở mục 3.2). Quên bước này thì trang
quốc gia làm xong vẫn không vào sitemap.

### 2.C Theo dõi kết quả SEO (không phải code)

Mốc gốc **2026-09-10: 1 URL được lập chỉ mục / 18 URL trong sitemap**. PM mở property
**`https://topvisa5s.com/`** (không phải property `topvisa5s.com` — đó là Domain property mới tạo)
→ **Lập chỉ mục → Trang** → ô "Đã lập chỉ mục".
- Nhích lên 5–10+ sau 3–7 ngày → đang chạy đúng, để yên.
- **Vẫn đứng ở 1 sau 2 tuần → có gì đó đang chặn, phải rà lại.**

## 3. ⚠️ Bài học kỹ thuật — áp dụng cho MỌI việc sau này

### 3.1 Kiểm chứng & công cụ test

- **A. ⭐ `curl` trần KHÔNG phản ánh đúng HTML khách thật nhận được** — với script chèn ở tầng
  **edge/CDN**. Sự cố thật: kết luận "Cloudflare Web Analytics chưa bật" là **âm tính giả**, vì
  Cloudflare chỉ chèn `beacon.min.js` khi request có `User-Agent` trình duyệt + `Accept: text/html`.
  Ngược lại `curl` trần vẫn ĐÚNG cho thứ do chính `worker.js`/file tĩnh sinh ra: canonical, `h1`,
  status code, sitemap, redirect, nội dung SSR. **Dùng `curl --compressed` để tránh lỗi giải mã.**
- **B. ⭐ Poll `curl` sau deploy phải dùng chuỗi CHỈ CÓ ở bản mới.** Đã vướng **4 lần** (T21, T5,
  2026-09-07, và 2026-09-11 khi viết điều kiện `1ei5XS6zJE"` không khớp cả 2 bản → vòng lặp thoát
  ngay, không chứng minh được gì). **Trước khi chạy poll, tự hỏi: chuỗi này có ở bản CŨ không?**
  Cloudflare deploy mất ~8–40 giây.
- **C. ⭐ Sửa FAQ thì kiểm bằng SCRIPT SO KHỚP TỪNG CHỮ, không so bằng mắt.** Ràng buộc số 5 kế
  hoạch SEO: JSON-LD `FAQPage` phải khớp text hiển thị từng chữ. Cách đã dùng: parse JSON-LD thật +
  regex lấy `.faq-a`, **`html.unescape` CẢ HAI** rồi so `==`. Quên `unescape` sẽ báo "LỆCH" giả.
- **D. Test màn admin khi không có mật khẩu:** mock `window.api()` thành CSDL trong bộ nhớ, **mô
  phỏng luôn cả TRIGGER**. Ghi lại payload gửi đi để kiểm. Không tạo dữ liệu rác trên production.
- **E. Test `worker.js`:** import thẳng vào Node làm ES module, mock `env.ASSETS.fetch` +
  `global.fetch`. Chạy **nhiều kịch bản** (vd `tac_gia` null và có giá trị) chứ đừng chỉ 1.
- **F. Bấm bằng `.click()` THẬT lên đúng element** (chạy đúng `onclick` trong HTML), đừng chỉ gọi
  hàm. Đo giao diện dùng `getBoundingClientRect()`, đừng chỉ đọc `text-align`.
- **G. ⭐ Đo giao diện `admin.html` phải mở đúng tab VÀ bỏ `hidden` của `#appView`** (màn đăng nhập
  che) — nếu không mọi `getBoundingClientRect()` trả **0**, dễ tưởng CSS không ăn.
- **H. ⭐ LUÔN mở tab HOÀN TOÀN MỚI trước khi kết luận.** Tab cũ **giữ lại JS realm** giữa các lần
  `navigate` tới cùng data: URL → `location.reload()` trong `javascript_tool` KHÔNG cho context
  sạch, biến cũ (`window.gtag`, `__ga4Loaded__`) còn nguyên → kết quả mâu thuẫn.
- **I. Tách `<script>` JS khỏi `<script type="application/ld+json">` khi kiểm cú pháp** — regex
  `(?![^>]*\bsrc=)` bắt cả 2 loại, `node --check` sẽ báo lỗi giả trên JSON-LD. Validate JSON-LD
  riêng bằng `json.loads`.
- **J. Giới hạn công cụ đã biết, ĐỪNG debug tưởng lỗi code:** `computer` tool báo
  `left_click failed: the press at (0,0)...` khi element cần cuộn tới · ảnh chụp hay ra 1 góc trang
  cũ dù đã `scroll_to`/`resize_window` · preview pane nạp file cục bộ dưới dạng **`data:` URL** nên
  `localStorage`/`cookie` bị chặn (console có `SecurityError` từ `tv5s_device_id` — **code cũ**) ·
  đo `scrollY`/`scrollIntoView` qua `javascript_tool` **rất thất thường**.

### 3.2 Kiến trúc & thiết kế

- **K. ⭐ Thiết kế "tự động nhận diện" phải tự hỏi: "nếu THỨ mình đang quảng cáo chưa tồn tại thì
  sao?"** Sự cố thật: 1 dòng TEST `published=true` khiến sitemap + trang 404 khai
  `/visa-nhat-ban` trong khi route T14 chưa xây → sitemap khai URL 404, trang 404 trỏ sang 404.
  **Dữ liệu sẵn sàng KHÔNG có nghĩa route phục vụ nó đã sẵn sàng.** Đã chặn bằng
  `VISA_COUNTRY_ROUTE_READY`.
- **L. Điều kiện lọc viết theo WHITELIST tự đúng khi thêm giá trị mới; BLACKLIST phải nhớ sửa.**
  Bằng chứng: thêm trạng thái "Xong" mà không phải sửa Dashboard lẫn job thông báo `worker.js`.
- **M. Gặp 2 chỗ viết cứng cùng 1 danh sách → gom hằng số NGAY**, đừng chỉ ghi comment "nhớ sửa cả
  2 nơi". Đã gom `HS_STATUS_KET_QUA_CUOI`, `AUTHOR_DEFAULT`.
- **N. ⭐ Một chuỗi văn bản có thể nằm ở NHIỀU chỗ hơn mình tưởng — grep trước khi sửa.** Câu FAQ
  thời gian xử lý nằm ở **4 chỗ**: JSON-LD `FAQPage` · FAQ hiển thị · `CHATBOX_QUICK` bản `vi` ·
  bản `en`. Sửa 1 chỗ là lệch ngay.
- **O. Dùng chung + 1 biến chế độ thay vì nhân bản.** `#khPickOverlay` phục vụ cả ô "Tên khách
  hàng" lẫn "Thành viên nhóm" qua `KH_PICK_MODE`.
- **P. Dùng lại hàm dựng class màu của màn khác thay vì viết bảng màu riêng.** Màn Tài chính dùng
  `hsPillClass()` của màn Hồ sơ → trạng thái mới tự đúng màu ở CẢ 2 màn.
- **Q. Giá trị mặc định 2 tầng để khỏi bắt PM sửa tay hàng loạt.** Byline: ưu tiên cột `tac_gia`
  của từng bài → trống thì dùng `AUTHOR_DEFAULT`. 12 bài cũ tự có byline ngay mà vẫn ghi đè được.

### 3.3 Landing page / route

- **R.** Cloudflare Static Assets tự **307-redirect** mọi file `.html` sang bản không đuôi —
  canonical + link nội bộ + dò tồn tại bằng `env.ASSETS.fetch()` đều phải dùng path **không đuôi**.
- **S.** `[assets]` mặc định phục vụ file khớp path **thẳng từ edge, bỏ qua `worker.js`** → logic
  cần chạy cho MỌI request phải có `run_worker_first = true`.
- **T.** Route SSR không có file tĩnh dự phòng PHẢI nhận cả `GET` lẫn `HEAD`.
- **U. ⭐ 4 trang TĨNH không tự đồng bộ với `index.html`:** `chinh-sach-bao-mat.html`/
  `dieu-khoan-dich-vu.html`/`lien-he.html`/`cong-cu/uoc-tinh-chi-phi-visa.html`. Khác `/blog`,
  `/blog/<slug>`, 404 (SSR, dùng `getSiteChrome()` trích trực tiếp lúc request nên LUÔN khớp).
  **Mỗi khi sửa navbar/footer/widget nổi/banner cookie ở `index.html`, PHẢI đồng bộ tay 4 file
  này** — cách đúng: viết script **trích thẳng từ `index.html`** rồi chèn, KHÔNG gõ lại tay.
  `getSiteChrome()` nay trả 4 trường: `css`, `navbar`, `footer`, **`consent`**.
- **V.** Navbar cần ngưỡng hamburger RIÊNG (`max-width:1099px`), tách khỏi `767px` của layout chung.
- **W.** Cuộn tới `#hash` lúc TẢI TRANG bị trượt nếu có nội dung chèn động: phải **loại HẲN** cú
  cuộn tự động của trình duyệt (xoá hash ở `<head>`), chỉ đổi `scroll-behavior` KHÔNG đủ; mọi cú
  cuộn có thể gọi nhiều lần BẮT BUỘC `behavior:'instant'`. Thêm khối chèn động mới → nhớ
  `finally{ fixInitialHashScroll(); }`.

### 3.4 CSS / UI trong `admin.html`

- **X. ⚠️ `<select>` KHÔNG được đặt `color` chữ sáng** — trên Chrome/Windows các `<option>` kế thừa
  màu đó → chữ trắng trên nền trắng. Các class `.status-select.st-*` **chỉ đặt `background`**.
- **Y. Chọn màu trạng thái mới phải ĐO bằng `getComputedStyle`, không đoán.** Hiện 6 trạng thái hồ
  sơ có 6 nền + 6 chữ khác nhau hoàn toàn.
- **Z. Canh lề bảng: đặt class lên CẢ `<th>` LẪN `<td>`** (`.th-center`/`.th-right`/`.td-center`/
  `.td-right`) — chỉ đặt 1 bên thì tiêu đề lệch khỏi dữ liệu. Chỉ ăn ở chế độ BẢNG; chế độ THẺ trên
  điện thoại mỗi `<td>` là flex "nhãn: giá trị" nên không cần rule riêng.
- **AA. `ho_so.so_luong` do TRIGGER CSDL tính** (`1 khách chính + số thành viên`) — mọi thao tác
  thêm/xoá thành viên PHẢI gọi `refreshSoLuong()`. `so_luong` **nhân vào 2 khoản chi** nên đếm đôi
  1 người là lệch luôn lợi nhuận → đó là lý do chặn trùng phải gồm cả khách hàng chính.
- **AB. Dialog 1-2 field:** `class="modal dlg-standard"` + inline `style="max-width:400px"`, KHÔNG
  thêm `modal-lg`/`modal-xl`. Mẫu: `#renameOverlay`, `#dvgOverlay`. Ngoại lệ CÓ CHỦ Ý, đừng "sửa".
- **AC. Field tiền: dùng `onChiMoneyInput()`, KHÔNG dùng `onMoneyInput()`** — hàm sau còn gọi
  `updateHoSoTotals()`, chỉ đúng cho dialog Hồ sơ. `#dtFeeOverlay` + `#nuocOverlay` vẫn dùng nhầm
  hàm đầu (vô hại nhưng là bẫy chờ) — dọn dẹp thuần, **chưa làm, chờ PM đồng ý**.

### 3.5 CSDL & schema

- **AD. Kiểm có CHECK constraint thật không TRƯỚC KHI viết migration cho việc thêm/đổi giá trị
  trạng thái.** Cả `ho_so.trang_thai` lẫn `leads.status` đều là `text` tự do, **không có
  constraint** → thêm trạng thái mới chỉ là đổi danh sách lựa chọn trong `admin.html`.
- **AE. `sameAs` nghĩa là "URL này LÀ một danh tính khác của CHÍNH thực thể đang mô tả".** Profile
  cá nhân nhân viên KHÔNG thuộc `sameAs` của tổ chức (đã bỏ 2026-09-11) — chỗ đúng để ghi nhận
  người là `Article.author` = `Person`. Khác hẳn `<a href>` trong nội dung: link thường vẫn giữ.
- Migration SQL: Claude Code không có quyền chạy — viết file trong `05_Database/`, PM tự chạy trong
  SQL Editor, **phải tự xác nhận PM đã chạy xong** trước khi build route phụ thuộc (mục 45/58).

## 4. Quy trình bắt buộc trước & sau mỗi lần deploy

1. `node --check` mọi khối `<script>` **không có `src=`** (tách riêng JSON-LD, bài học I).
2. Cân bằng thẻ HTML bằng `python3 html.parser`; validate JSON-LD bằng `json.loads`.
3. `git add` **đúng file mình sửa** — repo còn nhiều thư mục untracked sẵn (`10_SEO/`,
   `05_Branding_5S/`, `06_Phase 3_Tai_Chinh/`...), **đừng `git add -A`**.
4. `git push` thẳng `main` → Cloudflare tự deploy (~8–40 giây).
5. Poll `curl` bằng chuỗi CHỈ CÓ ở bản mới (bài học B — tự hỏi "chuỗi này có ở bản cũ không?").
6. **Hồi quy đầy đủ:** `/worker.js` + `/wrangler.toml` + `/package.json` phải **404**; `/`,
   `/admin`, `/blog`, `/sitemap.xml`, `/robots.txt`, 3 trang pháp lý,
   `/cong-cu/uoc-tinh-chi-phi-visa`, 1 bài blog phải **200**; `/khong-ton-tai` phải **404**;
   redirect `workers.dev` phải **301**; console sạch.
7. Nếu đụng sitemap: kiểm **từng URL** trong sitemap đều trả 200.
8. Xác minh bằng cách **parse dữ liệu thật** (JSON-LD qua `json.loads`, đo DOM qua trình duyệt),
   không grep chuỗi rồi kết luận.

## 5. Ranh giới nội dung — TUYỆT ĐỐI không vượt

Claude Code **không tự viết**: điều kiện/hồ sơ/quy định lãnh sự, tên người, giờ làm việc, toạ độ,
số liệu, giá, review. Thiếu thì **dừng và hỏi**, không tự điền (ràng buộc số 2, mục 0 kế hoạch SEO).
Khi PM cấp thông tin mà thấy **mâu thuẫn hoặc thiếu rõ ràng thì phải hỏi lại** — ví dụ thật
2026-09-11: chuyên viên gửi "7-10 ngày" trong khi bản cũ ghi "7-10 ngày **làm việc**" (chênh 2-4
ngày thực tế); hỏi lại thì PM xác nhận là ngày làm việc. Ghi thiếu 2 chữ đó là hứa nhanh hơn thực
tế, dễ sinh khiếu nại.

Nội dung pháp lý ở 2 trang Chính sách bảo mật / Điều khoản dịch vụ mới chỉ là bản Claude Code soạn
theo Luật 91/2025 + NĐ 356/2025 — **nên cho người có chuyên môn pháp lý rà lại trước khi công bố
rộng rãi** (T25/D1).

## 6. Tài liệu tham khảo

`CLAUDE.md` mục 49→59 (kế hoạch SEO, chi tiết từng task) → **mục 60** (trước khi sửa navbar/footer/
widget nổi hoặc trang có cuộn-tới-anchor) → **mục 61** (trước khi sửa màn Hồ sơ/Tài chính/Dashboard
hoặc thêm trạng thái mới) → **mục 62** (trước khi đụng GA4/banner cookie/sitemap) → **mục 63 (MỚI —
trước khi sửa FAQ hoặc byline tác giả)** → `10_SEO/11_Ke_hoach_sau_xac_nhan.md` (spec đầy đủ các
task còn lại, đọc mục 0 trước mỗi task, nhớ cộng `public/` vào đường dẫn cũ — CLAUDE.md mục 1/52) →
`10_SEO/12_Thu_tu_thuc_hien.xlsx` → `10_SEO/13_Prompt_Claude_Code.md` →
`01_Docs/10_Chuan_Dialog_Chung.md` (chuẩn dialog `dlg-*`, **đã rà 2026-09-07: 14/14 đạt chuẩn**,
bảng mục 8 khớp 100% với code, cuối mục 8 có sẵn 2 lệnh grep để rà lại nhanh) → file này.

**Skill sẵn trong repo:** `.claude/skills/dialog-chuan/` — tự kích hoạt khi làm việc với dialog
trong `admin.html`. Đường dẫn trong đó đã sửa đúng `02_Source/public/admin.html` (2026-09-07).

**⚠️ Khi `grep` toàn dự án nhớ LOẠI thư mục `.claude/worktrees/`** — bản checkout cũ của 3 nhánh cũ,
bị `.git/info/exclude` loại nên không được git theo dõi. Trong đó có bản `CLAUDE.md`/`README.md`/
`SKILL.md` cũ ghi đường dẫn thiếu `public/` — **ảnh chụp quá khứ, ĐỪNG sửa, đừng dùng tham chiếu.**

**Đường dẫn kiểu cũ CÒN LẠI, cố ý không sửa:** `01_Docs/05_Ke_hoach_du_an.md` dòng 51/68 ghi
`02_Source/index.html`, `02_Source/admin.html` — tài liệu kế hoạch **lịch sử**, giữ nguyên để đúng
bối cảnh (chủ trương mục 52), khác với file skill là **chỉ dẫn còn hiệu lực** nên phải sửa.
