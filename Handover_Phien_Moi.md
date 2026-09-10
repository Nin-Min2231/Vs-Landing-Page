# Handover — Bàn giao sang phiên làm việc mới (2026-09-10, bản 19 — GHI ĐÈ toàn bộ bản cũ)

> File này **GHI ĐÈ HOÀN TOÀN** mọi bản handover cũ (bản 1→18) — **không cần đọc lại bản cũ**, nội
> dung quan trọng còn giá trị đã gom hết vào đây. Đọc theo đúng thứ tự: `CLAUDE.md` (toàn bộ, đặc
> biệt mục 49→62) → file này → `10_SEO/11_Ke_hoach_sau_xac_nhan.md` mục 0 (8 ràng buộc) → bắt tay
> vào việc tiếp theo ở **mục 2** dưới đây.

## 0. Trạng thái ngay lúc viết file này

**Tin lớn nhất: toàn bộ việc PM có thể làm ngay cho SEO đã XONG (2026-09-09/10).** Trước đây mọi
task đo lường bị chặn vì thiếu Measurement ID và chưa gửi sitemap — giờ hết chặn.

| Việc PM | Trạng thái | Cách đã xác minh |
|---|---|---|
| GA4 Measurement ID | ✅ `G-YF2B7B2MJR`, đã gắn + deploy | đo cookie `_ga` thật trên production |
| Gửi sitemap lên Search Console | ✅ PM đã gửi | đã kiểm **18/18 URL trong sitemap đều trả 200** |
| Request Indexing | ✅ PM đã bấm | ảnh chụp GSC: trang chủ "URL nằm trên Google" |
| Cloudflare Web Analytics | ✅ **đã chạy sẵn từ 1 tháng trước** | beacon tải thật trong trình duyệt, dashboard 8 views/6 visits |
| Gỡ dòng TEST `noi_dung_quoc_gia` | ✅ | query REST bằng khoá anon trả `[]` |
| T27 region Supabase | ✅ ngoài VN | PM trả lời từ 2026-09-02 |

**4 đợt việc Claude Code làm trong 3 ngày qua (2026-09-07 → 09-10)** — chi tiết ở CLAUDE.md:
1. **Mục 61** — Admin: số lượng HS ở màn Tài chính · Thành viên nhóm chọn từ "Thông tin khách
   hàng" (bỏ nhập tay) · thêm trạng thái hồ sơ **"Xong"**.
2. **Mục 61 (cập nhật)** — màn Tài chính thêm cột **"Trạng thái"**; canh giữa cột Trạng thái, canh
   phải cột Số tiền; đổi màu "Hủy" từ xám sang **tím** `#EDE9FE`/`#6D28D9`.
3. **Rà 14 dialog** `admin.html` đối chiếu `01_Docs/10_Chuan_Dialog_Chung.md` → **14/14 đạt chuẩn**,
   cập nhật lại tài liệu + skill (số cũ "6/6" đã lỗi thời, bảng mục 8 thiếu 3 dòng).
4. **Mục 62** — **T8 (GA4) + T22b (banner cookie)** deploy cùng đợt + **chốt chặn sitemap** không
   khai URL `/visa-*` khi route T14 chưa có. Kèm **đính chính** về Cloudflare Web Analytics.

## 1. Cấu trúc file — không đổi

`02_Source/public/` vẫn là thư mục DUY NHẤT được `[assets]` phục vụ ra Internet; `worker.js`/
`wrangler.toml`/`package.json` vẫn ở gốc `02_Source/`, không public — xem CLAUDE.md mục 4 + 52.
3 ngày qua KHÔNG thêm/xoá file nào.

## 2. Việc tiếp theo

### 2.A Không còn việc nào "làm ngay không chờ ai"

Mọi task SEO còn lại đều chờ **thông tin PM** hoặc **nội dung chuyên viên**. Trước khi bắt đầu bất
kỳ việc gì, hỏi người dùng muốn cấp thông tin cho nhóm nào trước.

**Chờ PM cấp thông tin:**
| Task | Cần gì | Thời gian |
|---|---|---|
| T10 (phần còn lại) | Giờ làm việc + toạ độ lat/long từ Google Business Profile → thêm `openingHours`/`geo`/`priceRange` | 10 phút |
| T12 | Page-id Facebook (cho link `m.me/...` nút nổi) + xác nhận "gọi lại trong 30 phút giờ hành chính" có làm được không | 5 phút |
| T19 | Tài khoản Brevo + API key (email tự động sau khi khách gửi form) | 15 phút |
| T20 | Tên + chức danh + số năm KN của 1-2 chuyên viên (**và họ đồng ý công khai**) | 5 phút |
| T11b | Nội dung câu chuyện công ty + ảnh đội ngũ/văn phòng cho `gioi-thieu.html` | 1 giờ + chụp ảnh |
| T25/T26 | Nghĩa vụ pháp lý BVDLCN 91/2025 (nên hỏi luật sư), mốc đăng ký kinh doanh | — |

**Chờ chuyên viên visa cấp nội dung (Claude Code TUYỆT ĐỐI không tự viết thay):**
| Task | Cần gì |
|---|---|
| T14 | Nội dung chuyên môn 1.200-2.000 từ/nước cho ít nhất 1 trong 7 trang quốc gia. Bảng `noi_dung_quoc_gia` + màn nhập admin đã sẵn sàng (T13 xong). **Nhập xong nhớ đọc mục 3.3 dưới đây trước khi publish.** |
| T15/T17 | Checklist giấy tờ theo nước × mục đích. **Bảng `checklist_items` CHƯA TỒN TẠI** — cần viết migration 15 trước, PM tự chạy |
| T18 | Xác nhận thời gian xử lý 2026 cho 7 nước. **FAQ hiện có 6 nước, THIẾU Úc** (đã kiểm bằng cách parse JSON-LD `FAQPage` thật) |

### 2.B Việc duy nhất còn lại không phụ thuộc ai: theo dõi kết quả

Không phải code. Sau 3-7 ngày kể từ 2026-09-10, PM mở property **`https://topvisa5s.com/`** →
**Lập chỉ mục → Trang** → xem ô "Đã lập chỉ mục" (mốc gốc: **1**, sitemap có 18 URL).
- Nhích lên 5-10+ → đang chạy đúng, để yên.
- **Vẫn đứng ở 1 sau 2 tuần → có gì đó đang chặn, phải rà lại.**

## 3. ⚠️ Bài học kỹ thuật — áp dụng cho MỌI việc sau này

### 3.1 Kiểm chứng & công cụ test (mục MỚI quan trọng nhất bản này)

- **A. ⭐ `curl` trần KHÔNG phản ánh đúng HTML mà khách thật nhận được** — với script chèn ở tầng
  **edge/CDN**. Sự cố thật: kết luận "Cloudflare Web Analytics chưa bật" là **âm tính giả**, vì
  Cloudflare chỉ chèn `beacon.min.js` khi request có `User-Agent` trình duyệt + `Accept: text/html`.
  `curl` trần → 0 kết quả; thêm 2 header đó → có beacon; trình duyệt thật cũng có.
  **Quy tắc: muốn kết luận "trang thiếu script X" thì phải kiểm bằng trình duyệt thật hoặc `curl`
  giả header — đừng dùng `curl` trần rồi kết luận thiếu.** Ngược lại `curl` trần vẫn ĐÚNG và vẫn
  nên dùng cho thứ do chính `worker.js`/file tĩnh sinh ra: canonical, `h1`, status code, sitemap,
  redirect, nội dung SSR.
- **B. Poll `curl` sau deploy phải dùng chuỗi CHỈ CÓ ở bản mới.** Đã vướng bẫy này 3 lần (T21, T5,
  và 2026-09-07). Cloudflare deploy mất ~8-40 giây, có khi hơn 1 phút — kiên nhẫn poll thêm.
- **C. Test màn admin khi không có mật khẩu:** mock `window.api()` thành CSDL trong bộ nhớ, **mô
  phỏng luôn cả TRIGGER** (vd `ho_so?id=eq.N&select=so_luong` trả `1 + số thành viên`). Ghi lại
  payload gửi đi để kiểm. Cách này test trọn luồng CRUD mà **không tạo dữ liệu rác trên
  production** — khác vài phiên trước từng tạo lead test rồi phải nhờ PM xoá.
- **D. Bấm bằng `.click()` THẬT lên đúng element** (chạy đúng `onclick` trong HTML), đừng chỉ gọi
  hàm. Đo giao diện thì dùng `getBoundingClientRect()`, đừng chỉ đọc `text-align`.
- **E. ⭐ Đo giao diện `admin.html` phải mở đúng tab VÀ bỏ `hidden` của `#appView`** (màn đăng nhập
  che) — nếu không mọi `getBoundingClientRect()` đều trả **0** và rất dễ tưởng nhầm CSS không ăn.
- **F. LUÔN mở tab HOÀN TOÀN MỚI trước khi kết luận.** Tab cũ **giữ lại JS realm** giữa các lần
  `navigate` tới cùng data: URL → `location.reload()` trong `javascript_tool` KHÔNG cho context
  sạch, biến cũ (`window.gtag`, `__ga4Loaded__`) còn nguyên → kết quả mâu thuẫn, mất thời gian.
- **G. Giới hạn công cụ đã biết, ĐỪNG debug tưởng lỗi code:** `computer` tool báo
  `left_click failed: the press at (0,0)...` khi element cần cuộn tới · ảnh chụp màn hình hay ra
  1 góc trang cũ dù đã `scroll_to`/`resize_window` · preview pane nạp file cục bộ dưới dạng
  **`data:` URL** nên `localStorage`/`cookie` bị chặn (console có `SecurityError` từ
  `tv5s_device_id` — **code cũ, không liên quan**) · đo `scrollY`/`scrollIntoView` qua
  `javascript_tool` **rất thất thường**.
- **H. Tách `<script>` JS khỏi `<script type="application/ld+json">` khi kiểm cú pháp** — regex
  `(?![^>]*\bsrc=)` bắt cả 2 loại, `node --check` sẽ báo lỗi giả trên JSON-LD. Validate JSON-LD
  bằng `json.loads` riêng.

### 3.2 Kiến trúc & thiết kế

- **I. ⭐ Thiết kế "tự động nhận diện" phải tự hỏi thêm: "nếu THỨ mình đang quảng cáo chưa tồn tại
  thì sao?"** Sự cố thật: PM nhập 1 dòng TEST `published=true` vào `noi_dung_quoc_gia` → sitemap
  (T5) và trang 404 (T21) lập tức khai `https://topvisa5s.com/visa-nhat-ban`, trong khi route
  `/visa-<slug>` (T14) CHƯA XÂY → sitemap khai 1 URL 404, và trang 404 trỏ sang 404 khác.
  **Dữ liệu sẵn sàng KHÔNG có nghĩa route phục vụ nó đã sẵn sàng.** Đã sửa bằng hằng số
  `VISA_COUNTRY_ROUTE_READY = false` trong `worker.js` — **làm xong T14 thì đổi đúng 1 dòng đó
  thành `true`**, sitemap và trang 404 tự liệt kê lại, không cần sửa gì khác.
- **J. Điều kiện lọc viết theo WHITELIST tự đúng khi thêm giá trị mới; BLACKLIST thì phải nhớ sửa.**
  Bằng chứng: thêm trạng thái "Xong" mà **không phải sửa** "Hồ sơ trả KQ tuần này" ở Dashboard lẫn
  job thông báo `worker.js` — cả 2 viết `chỉ lấy 'Đã nộp'/'Đang xử lý'`. Cùng họ lý do đã chọn
  Phương án A ở mục 52.
- **K. Gặp 2 chỗ viết cứng cùng 1 danh sách → gom hằng số NGAY**, đừng chỉ ghi comment "nhớ sửa cả
  2 nơi" (mục 27 đã dặn nhưng vẫn dựa vào việc người sau đọc được comment). Đã gom
  `HS_STATUS_KET_QUA_CUOI = ['Đậu','Xong','Rớt','Hủy']` dùng chung cho màn Tài chính + Dashboard.
- **L. Cần dialog/tính năng "gần giống" cái đã có → dùng CHUNG + 1 biến chế độ, đừng nhân bản.**
  `#khPickOverlay` phục vụ cả ô "Tên khách hàng" lẫn "Thành viên nhóm" qua `KH_PICK_MODE`.
- **M. Dùng lại hàm dựng class màu của màn khác thay vì viết bảng màu riêng.** Màn Tài chính dùng
  `hsPillClass()` của màn Hồ sơ → trạng thái mới thêm sau này tự đúng màu ở CẢ 2 màn.

### 3.3 Landing page / route (giữ từ bản 18, vẫn còn giá trị)

- **N.** Cloudflare Static Assets tự **307-redirect** mọi file `.html` sang bản không đuôi —
  canonical + link nội bộ + dò tồn tại bằng `env.ASSETS.fetch()` đều phải dùng path **không đuôi**.
- **O.** `[assets]` mặc định phục vụ file khớp path **thẳng từ edge, bỏ qua `worker.js`** → logic
  cần chạy cho MỌI request phải có `run_worker_first = true`.
- **P.** Route SSR không có file tĩnh dự phòng PHẢI nhận cả `GET` lẫn `HEAD`.
- **Q. ⭐ 4 trang TĨNH không tự đồng bộ với `index.html`:** `chinh-sach-bao-mat.html`/
  `dieu-khoan-dich-vu.html`/`lien-he.html`/`cong-cu/uoc-tinh-chi-phi-visa.html`. Khác `/blog`,
  `/blog/<slug>`, 404 (SSR, dùng `getSiteChrome()` trích trực tiếp lúc request nên LUÔN khớp).
  **Mỗi khi sửa navbar/footer/widget nổi/banner cookie ở `index.html`, PHẢI đồng bộ tay 4 file
  này** — cách đúng: viết script **trích thẳng từ `index.html`** rồi chèn, KHÔNG gõ lại tay.
  `getSiteChrome()` nay trả 4 trường: `css`, `navbar`, `footer`, **`consent`**.
- **R.** Navbar cần ngưỡng hamburger RIÊNG (`max-width:1099px`), tách khỏi `767px` của layout chung.
- **S.** Cuộn tới `#hash` lúc TẢI TRANG bị trượt nếu có nội dung chèn động: phải **loại HẲN** cú
  cuộn tự động của trình duyệt (xoá hash ở `<head>`), chỉ đổi `scroll-behavior` KHÔNG đủ; và mọi
  cú cuộn có thể gọi nhiều lần BẮT BUỘC `behavior:'instant'`. Thêm khối chèn động mới → nhớ
  `finally{ fixInitialHashScroll(); }`.

### 3.4 CSS / UI trong `admin.html`

- **T. ⚠️ `<select>` KHÔNG được đặt `color` chữ sáng** — trên Chrome/Windows các `<option>` trong
  danh sách bung ra kế thừa màu đó → chữ trắng trên nền trắng. Các class `.status-select.st-*`
  **chỉ đặt `background`**, cố ý không đặt `color`. Trạng thái mới phải theo đúng khuôn này.
- **U. Chọn màu trạng thái mới phải ĐO bằng `getComputedStyle`, không đoán.** Suýt cho "Xong" trùng
  họ màu với "Đang xử lý". Hiện 6 trạng thái hồ sơ có 6 nền + 6 chữ khác nhau hoàn toàn.
- **V. Canh lề bảng: đặt class lên CẢ `<th>` LẪN `<td>`** của cùng 1 cột (`.th-center`/`.th-right`/
  `.td-center`/`.td-right`) — chỉ đặt 1 bên thì tiêu đề lệch khỏi dữ liệu. 4 class này chỉ ăn ở
  chế độ BẢNG; chế độ THẺ trên điện thoại mỗi `<td>` là flex "nhãn: giá trị" nên không cần rule
  riêng cho mobile.
- **W. `ho_so.so_luong` do TRIGGER CSDL tính** (`1 khách chính + số thành viên`) — mọi thao tác
  thêm/xoá thành viên PHẢI gọi `refreshSoLuong()`. `so_luong` **nhân vào 2 khoản chi** nên đếm đôi
  1 người là lệch luôn lợi nhuận → đó là lý do chặn trùng phải gồm cả khách hàng chính.
- **X. Dialog 1-2 field:** `class="modal dlg-standard"` + inline `style="max-width:400px"`, KHÔNG
  thêm `modal-lg`/`modal-xl`. Mẫu: `#renameOverlay`, `#dvgOverlay`. Ngoại lệ CÓ CHỦ Ý, đừng "sửa".
- **Y. Field tiền: dùng `onChiMoneyInput()`, KHÔNG dùng `onMoneyInput()`** — hàm sau còn gọi
  `updateHoSoTotals()`, chỉ đúng cho dialog Hồ sơ. Hiện `#dtFeeOverlay` + `#nuocOverlay` vẫn dùng
  nhầm hàm đầu (vô hại nhưng là bẫy chờ) — dọn dẹp thuần, **chưa làm, chờ PM đồng ý**.

### 3.5 CSDL

- **Z. Kiểm có CHECK constraint thật không TRƯỚC KHI viết migration cho việc thêm/đổi giá trị trạng
  thái.** Cả `ho_so.trang_thai` lẫn `leads.status` đều là `text` tự do, **không có constraint** →
  thêm trạng thái mới chỉ là đổi danh sách lựa chọn trong `admin.html`, không cần migration.
- Migration SQL: Claude Code không có quyền chạy — viết file trong `05_Database/`, PM tự chạy trong
  SQL Editor, **phải tự xác nhận PM đã chạy xong** trước khi build route phụ thuộc (mục 45/58).

## 4. Quy trình bắt buộc trước & sau mỗi lần deploy

1. `node --check` mọi khối `<script>` **không có `src=`** (tách riêng JSON-LD, xem bài học H).
2. Cân bằng thẻ HTML bằng `python3 html.parser`.
3. `git add` **đúng file mình sửa** — repo còn nhiều thư mục untracked sẵn (`10_SEO/`,
   `05_Branding_5S/`, `06_Phase 3_Tai_Chinh/`...), **đừng `git add -A`**.
4. `git push` thẳng `main` → Cloudflare tự deploy (~8-40 giây).
5. Poll `curl` bằng chuỗi CHỈ CÓ ở bản mới (bài học B).
6. **Hồi quy đầy đủ:** `/worker.js` + `/wrangler.toml` + `/package.json` phải **404**; `/`,
   `/admin`, `/blog`, `/sitemap.xml`, `/robots.txt`, 3 trang pháp lý,
   `/cong-cu/uoc-tinh-chi-phi-visa` phải **200**; `/khong-ton-tai` phải **404**; redirect
   `workers.dev` phải **301**; console sạch.
7. Nếu đụng sitemap: kiểm **từng URL** trong sitemap đều trả 200 (Google báo lỗi ngay nếu có 404).

## 5. Ranh giới nội dung — TUYỆT ĐỐI không vượt

Claude Code **không tự viết**: điều kiện/hồ sơ/quy định lãnh sự, tên chuyên viên, giờ làm việc,
toạ độ, số liệu, giá, review. Thiếu thì **dừng và hỏi**, không tự điền (ràng buộc số 2, mục 0 kế
hoạch SEO). Nội dung pháp lý ở 2 trang Chính sách bảo mật / Điều khoản dịch vụ mới chỉ là bản
Claude Code soạn theo Luật 91/2025 + NĐ 356/2025 — **nên cho người có chuyên môn pháp lý rà lại
trước khi công bố rộng rãi**.

## 6. Tài liệu tham khảo

`CLAUDE.md` mục 49→59 (kế hoạch SEO, chi tiết từng task) → **mục 60** (đọc kỹ trước khi sửa navbar/
footer/widget nổi hoặc trang có cuộn-tới-anchor) → **mục 61** (đọc kỹ trước khi sửa màn Hồ sơ/
Tài chính/Dashboard hoặc thêm trạng thái mới) → **mục 62 (MỚI — đọc kỹ trước khi đụng GA4/banner
cookie/sitemap)** → `10_SEO/11_Ke_hoach_sau_xac_nhan.md` (spec đầy đủ các task còn lại, đọc mục 0
trước mỗi task, nhớ cộng `public/` vào đường dẫn cũ — CLAUDE.md mục 1/52) →
`10_SEO/12_Thu_tu_thuc_hien.xlsx` → `10_SEO/13_Prompt_Claude_Code.md` →
`01_Docs/10_Chuan_Dialog_Chung.md` (chuẩn dialog `dlg-*`, **đã rà lại 2026-09-07: 14/14 dialog đạt
chuẩn**, bảng mục 8 khớp 100% với code, cuối mục 8 có sẵn 2 lệnh grep để rà lại nhanh) → file này.

**Skill sẵn trong repo:** `.claude/skills/dialog-chuan/` — tự kích hoạt khi làm việc với dialog
trong `admin.html`. Đường dẫn trong đó đã sửa đúng `02_Source/public/admin.html` (2026-09-07).

**⚠️ Khi `grep` toàn dự án nhớ LOẠI thư mục `.claude/worktrees/`** — bản checkout cũ của 3 nhánh cũ
(`phase-2-handover-review`, `phase-3-tai-chinh`, `scr-003-mailing-list-screen`), bị
`.git/info/exclude` loại nên không được git theo dõi. Trong đó có bản `CLAUDE.md`/`README.md`/
`SKILL.md` cũ ghi đường dẫn thiếu `public/` — **ảnh chụp quá khứ, ĐỪNG sửa, đừng dùng tham chiếu.**

**Đường dẫn kiểu cũ CÒN LẠI, cố ý không sửa:** `01_Docs/05_Ke_hoach_du_an.md` dòng 51/68 ghi
`02_Source/index.html`, `02_Source/admin.html` — tài liệu kế hoạch **lịch sử**, giữ nguyên để đúng
bối cảnh (đúng chủ trương mục 52), khác với file skill là **chỉ dẫn còn hiệu lực** nên phải sửa.
