# Handover — Bàn giao sang phiên làm việc mới (2026-09-11, bản 22 — GHI ĐÈ toàn bộ bản cũ)

> File này **GHI ĐÈ HOÀN TOÀN** mọi bản handover cũ (bản 1→21) — **không cần đọc lại bản cũ**, nội
> dung quan trọng còn giá trị đã gom hết vào đây. Đọc theo đúng thứ tự: `CLAUDE.md` (toàn bộ, đặc
> biệt **mục 64 — MỚI NHẤT**) → file này → `11_Home_Kaizen/Bao_cao_Phan_tich_Home_Kaizen_20260911.xlsx`
> (đã cập nhật theo đúng kiến trúc cuối, xem sheet 00/02/04/05/08) → `10_SEO/11_Ke_hoach_sau_xac_nhan.md`
> mục 0 (8 ràng buộc) → bắt tay vào việc tiếp theo ở **mục 2** dưới đây.

## 0. Trạng thái ngay lúc viết file này

**⭐ MỚI (cùng ngày 11/09, phiên sau bản 21) — Kaizen trang chủ: ĐÃ CODE + TỰ TEST XONG, CHƯA
DEPLOY, đang chờ PM xác nhận.** PM trả lời 6 điểm còn chờ (C-06→C-11) bằng 1 kiến trúc MỚI đơn
giản hơn hẳn đề xuất gốc: khóa cứng "Bài viết" thành đúng 2 danh mục cố định "Thủ tục Visa"/"Tin
tức" (bỏ tab "Danh mục bài viết"), đổi `/blog`→`/tin-tuc` (301 vĩnh viễn), trang `/tin-tuc` mới
chia theo "vùng hiển thị" (Phân loại) + trang chủ đề riêng `/tin-tuc/chu-de/<slug>` có phân trang.
Đã sửa `admin.html`/`index.html`/`worker.js` + đồng bộ 4 trang tĩnh + viết migration 15 (dọn danh
mục thừa) + cập nhật đầy đủ Excel báo cáo + CLAUDE.md mục 64. **CHƯA `git push`** — theo Git Safety
Protocol, thay đổi lớn cỡ này (đổi URL toàn bộ bài viết, bỏ popup, đổi UI admin) cần PM xác nhận rõ
ràng trước khi lên production, dù project có tiền lệ code-xong-tự-deploy. **Đọc kỹ CLAUDE.md mục 64
trước khi làm bất kỳ việc gì tiếp theo** — có đầy đủ danh sách đã test + việc PM cần làm (chạy
migration 15, xác nhận deploy, tự kiểm sau khi deploy). C-06 (`/danh-gia`) **vẫn CÒN CHỜ**, chưa
động tới trong lượt này. Chi tiết đầy đủ ở **mục 2.A** bên dưới — đã cập nhật lại theo đúng trạng
thái mới, KHÔNG còn đúng như mô tả gốc của bản 21 (đã lỗi thời, xem CLAUDE.md mục 64 mới nhất).

Song song: toàn bộ việc PM có thể tự làm cho SEO đã xong; các task SEO còn lại vẫn chờ thông tin PM
cấp hoặc nội dung chuyên viên soạn (mục 2.B).

### Đã xác minh trên production ngày 2026-09-11 (không phải đọc tài liệu)

| Hạng mục | Trạng thái thật |
|---|---|
| GA4 `G-YF2B7B2MJR` | ✅ có trên trang, **chỉ nạp sau khi khách bấm "Đồng ý"** |
| Banner cookie (T22b) | ✅ có trên cả 8 trang |
| `sameAs` | ✅ **2 link** (đều là trang doanh nghiệp) |
| FAQ thời gian xử lý | ✅ có cụm "tính theo ngày làm việc", đủ 7 nước |
| Sitemap | ✅ **18 URL, tất cả trả 200**, không có URL chết |
| Byline chuyên viên | ✅ "Thu Hiền · Chuyên viên, 10 năm kinh nghiệm hồ sơ visa" |
| Cloudflare Web Analytics | ✅ đang chạy |
| Sitemap đã gửi + Request Indexing | ✅ PM làm 2026-09-10 |

### Dữ liệu production đã đối chiếu 2026-09-11 (đọc qua anon key, dùng cho phân tích Kaizen)

- **12 bài viết** đã publish · danh mục **"Tin tức" 7 bài** · **"Thủ tục Visa" 5 bài** ·
  **"Kinh nghiệm xin visa" 0 bài** (nên không hiện section/menu nào).
- **12 đánh giá khách hàng** — độ dài nội dung **52 → 1.001 ký tự** (chênh gần 20 lần).
- `posts.phan_loai` chỉ có 2 giá trị, **trùng 1:1 với tên danh mục**.
- **12/12 bài đều có `slug`** — nhưng chỉ vì migration 13 backfill 1 lần ngày 02/09; bài tạo MỚI
  từ nay sẽ có `slug = NULL` (xem lỗi L-01, mục 2.A).

### Số đo giao diện trang chủ (đo thật bằng trình duyệt, 2026-09-11)

| Hạng mục | Desktop 1280px | Điện thoại 375px |
|---|---|---|
| Chiều cao 1 slide đánh giá | **618px** (mọi slide) | **936px** (mọi slide) |
| Chiều cao card đánh giá THẬT cần (bài ngắn) | 292px | 312px |
| Khoảng trắng thừa | **326px** | **624px** |
| Khối `#categorySections` | 2.555px | 5.314px |
| Chiều cao trang TRƯỚC khi JS nạp xong | 5.755px | — |
| Chiều cao trang SAU khi JS nạp xong | 8.609px | 15.984px |
| **Độ nhảy** | **+2.854px (+49,6%)** | lớn hơn |

### 6 đợt việc gần đây — chi tiết ở CLAUDE.md

1. **Mục 61** — Admin: số lượng HS ở màn Tài chính · Thành viên nhóm chọn từ "Thông tin khách
   hàng" · thêm trạng thái hồ sơ **"Xong"**; màn Tài chính thêm cột "Trạng thái".
2. **Rà 14 dialog** `admin.html` đối chiếu `01_Docs/10_Chuan_Dialog_Chung.md` → **14/14 đạt chuẩn**.
3. **Mục 62** — **T8 (GA4) + T22b (banner cookie)** + chốt chặn sitemap không khai URL `/visa-*`.
4. **Mục 63** — **T18** (thời gian xử lý 2026) + **T20** (byline, `Article.author` = `Person`).
5. **Bản 20** — handover gộp bản 1→19.
6. **11_Home_Kaizen (MỚI, phiên này)** — phân tích yêu cầu thêm trang `/danh-gia` + `/tin-tuc`,
   xuất báo cáo Excel 10 sheet. **Chỉ phân tích, chưa code.**

## 1. Cấu trúc file

`02_Source/public/` vẫn là thư mục DUY NHẤT được `[assets]` phục vụ ra Internet; `worker.js`/
`wrangler.toml`/`package.json` vẫn ở gốc `02_Source/`, không public — xem CLAUDE.md mục 4 + 52.

**Thư mục mới phiên này:** `11_Home_Kaizen/`
- `request_0911.md` — yêu cầu gốc của PM.
- `Bao_cao_Phan_tich_Home_Kaizen_20260911.xlsx` — báo cáo phân tích **10 sheet**. Đọc theo thứ tự:
  `00_Tong_quan` → `02_Diem_can_chot` (quan trọng nhất, có cột "Quyết định của PM") →
  `01_Hien_trang_do_duoc` → `03_TK_Danh_gia` → `04_TK_Tin_tuc` → `05_Trien_khai_Admin` → `06_SEO`
  → `07_Scroll_Responsive` → `08_Ke_hoach` → `09_Nghiem_thu`.

**KHÔNG thêm/xoá file nguồn nào** (`02_Source/` nguyên vẹn). `11_Home_Kaizen/` hiện **untracked**,
giống `10_SEO/`, `05_Branding_5S/`… — commit khi PM muốn.

## 2. Việc tiếp theo

### 2.A ⭐ ƯU TIÊN 1 — Kaizen trang chủ (`11_Home_Kaizen/`)

**Yêu cầu tóm tắt:** thêm trang `/danh-gia` (đánh giá khách hàng) và `/tin-tuc` (bài viết); sửa 2
section tương ứng trên trang chủ theo hướng **chiều cao cố định + phân trang next/back**.

#### ⭐ MỚI (11/09, phiên sau) — PM trả lời hết 6 điểm còn chờ bằng 1 kiến trúc thay thế

**Không dùng các đề xuất cũ ở dưới (`kieu_hien_thi_home`, gộp `categories`, chip chủ đề...)** — PM
chọn kiến trúc ĐƠN GIẢN HƠN: khóa cứng "Bài viết" thành đúng 2 danh mục cố định "Thủ tục Visa"/
"Tin tức" (2 tab riêng trong admin, bỏ hẳn tab "Danh mục bài viết"). Quyết định này tự giải quyết
C-05/C-07/C-10/C-11 cùng lúc. **Đã CODE + TỰ TEST XONG, CHƯA DEPLOY** — đọc đầy đủ **CLAUDE.md mục
64** (không lặp lại ở đây để tránh 2 nơi lệch nhau) trước khi làm bất kỳ việc gì tiếp theo cho
Kaizen. Tóm tắt cực ngắn:

| Mã | Kết quả cuối (khác đề xuất gốc trong ngoặc) |
|---|---|
| **C-01** | Giữ nguyên như đã chốt: `/blog`→`/tin-tuc` (+ chi tiết), 301 vĩnh viễn. **ĐÃ CODE.** |
| **C-02/C-03** | Giữ nguyên: bỏ popup, card rời trang thẳng tới chi tiết. **ĐÃ CODE.** |
| **C-04** | Giữ nguyên: chỉ "Tin tức" đổi cách hiển thị, "Thủ tục Visa" giữ lưới đầy đủ — nhưng giờ 2 section này TĨNH hardcode, không còn sinh động theo Danh mục. **ĐÃ CODE.** |
| **C-05** | ⚠️ **ĐẢO NGƯỢC** — KHÔNG còn menu động, khóa cứng 2 mục menu cố định. **ĐÃ CODE.** |
| **C-06** | **VẪN CÒN CHỜ** — `/danh-gia` chưa làm trong lượt này. |
| **C-07** | KHÔNG gộp `categories` (khác đề xuất "thêm slug/tieu_de_hien_thi/mo_ta/thu_tu"). **ĐÃ CODE (không cần làm gì).** |
| **C-08/C-09** | Vẫn hoãn được, chưa động tới. |
| **C-10/C-11** | Tự giải quyết bằng kiến trúc mới (section tĩnh, menu tĩnh) — không cần cột `kieu_hien_thi_home`. **ĐÃ CODE.** |

**Ngoài ra tiện sửa luôn 2 lỗi** (vì đang viết lại đúng những hàm liên quan): L-01 (`savePost()`
giờ tự sinh `slug` khi tạo mới) và L-02 (`og:type` đúng theo loại trang). **L-04 CHƯA sửa**, để
dành. Migration thật đã viết: `05_Database/15_supabase_setup_phase15.sql` — CHỈ xoá danh mục thừa
"Kinh nghiệm xin visa" (không phải bộ cột lớn như B-2 cũ đề xuất).

**Việc PM cần làm:** (1) đọc CLAUDE.md mục 64 mục "Đã test"/"Việc CẦN PM làm" — xác nhận đồng ý
deploy; (2) chạy migration 15; (3) sau khi Claude Code deploy, tự đăng nhập admin thật thử tạo bài
ở 2 tab mới + `curl -I` xác nhận redirect `/blog`→`/tin-tuc` sống trên production.

#### Phần dưới đây là bản ghi GỐC lúc PM mới chốt 5 điểm đầu (11/09, phiên trước) — GIỮ LẠI để biết
    bối cảnh lịch sử, KHÔNG còn là kế hoạch thực thi (đã thay bằng bảng ở trên + CLAUDE.md mục 64)

| Mã | Quyết định GỐC (lúc đó) |
|---|---|
| **C-01** | **ĐỔI `/blog` → `/tin-tuc`** và `/blog/<slug>-<id>` → `/tin-tuc/<slug>-<id>`, **301 vĩnh viễn** từ URL cũ. Giữ 301 mãi mãi (Facebook/Zalo còn link cũ). |
| **C-02** | Click card bài viết ở trang chủ → đi thẳng **trang CHI TIẾT** `/tin-tuc/<slug>-<id>`. |
| **C-03** | **BỎ popup** `#postOverlay` — xoá `openPostDetail()`, `closePostDetail()`, `initScrollLock()` và CSS `.post-overlay`/`.post-modal-*`. ⚠️ Popup là cơ chế DÙNG CHUNG → card ở **cả 2** section đều rời trang. |
| **C-04** | **CHỈ sửa section "Tin tức & Khám phá thế giới"**. Section "Hồ sơ xin Visa các nước" **giữ nguyên** lưới đầy đủ 5 bài. |
| **C-05** | ~~KHÔNG gộp menu — giữ cơ chế chèn menu động theo danh mục~~ **ĐÃ ĐẢO NGƯỢC, xem bảng trên.** |

**Phân trang: dùng ĐƯỜNG DẪN, không dùng query** — `/tin-tuc/chu-de/<slug>/trang-2` (đã code),
`/danh-gia/trang-2` (khi làm C-06). Lý do: ràng buộc **T1** bắt canonical = `origin + pathname`
**bỏ hẳn query** (chống `?utm_source=` sinh trùng lặp). Nếu phân trang dùng query thì canonical
trang 2 tự trỏ về trang 1 → nội dung trang 2 trở đi không bao giờ được lập chỉ mục. Dùng đường dẫn
thật là tránh hẳn mâu thuẫn, không phải mở ngoại lệ.

**⚠️ Cảnh báo còn giá trị cho việc C-06 (`/danh-gia`) sau này:** Route mới PHẢI nhận cả `GET` lẫn
`HEAD` (bài học T4). KHÔNG thêm `/danh-gia` vào `EXTRA_STATIC_PAGES` — mảng đó dò file TĨNH có
thật, route SSR sẽ bị loại; thêm dòng riêng trong `renderSitemap()` (đã có sẵn mẫu `/tin-tuc/
chu-de/<slug>` để copy). KHÔNG gắn `Review`/`AggregateRating` cho `/danh-gia` (Google không cấp kết
quả đa dạng cho đánh giá tự khai; CSDL không có cột số sao thật) — chỉ gắn `BreadcrumbList`.

### 2.B Việc SEO còn lại — chờ người khác cấp

**Trước khi bắt đầu, hỏi PM muốn cấp thông tin cho nhóm nào trước.** Phiên trước đã nêu từng việc
thành câu hỏi cụ thể và PM trả lời cuốn chiếu — **cách này hiệu quả, nên làm lại như vậy.**

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
| T14 | 1.200–2.000 từ/nước cho ít nhất 1 trong 7 nước | Hạ tầng **đã sẵn sàng 100%**. **Bắt đầu 1 nước thôi**, xem kết quả thật rồi mới nhân rộng |
| T15/T17 | Checklist giấy tờ theo nước × mục đích | **Bảng `checklist_items` CHƯA TỒN TẠI** — phải viết migration trước. Đề xuất bắt đầu **Nhật Bản × Du lịch** |

**T18 đã XONG** (chuyên viên cấp số 2026-09-11). **T20 đã XONG** (PM cấp tên Thu Hiền).

⚠️ **Lưu ý số migration:** handover bản 20 đặt trước số **15** cho `checklist_items` (T15/T17).
Kaizen lần này cũng cần migration — **file nào viết trước lấy số 15**, file sau lấy 16. Kiểm
`05_Database/` trước khi đặt tên.

### 2.C ⚠️ Việc CẦN NHỚ khi T14 xong

Khi chuyên viên nhập nội dung thật và bấm publish, **PHẢI đổi `VISA_COUNTRY_ROUTE_READY` trong
`worker.js` từ `false` thành `true`** — đúng 1 dòng. Đây là chốt chặn cố ý để sitemap và trang 404
không khai URL `/visa-*` khi route chưa tồn tại (bài học K, mục 3.2). Quên bước này thì trang quốc
gia làm xong vẫn không vào sitemap.

### 2.D Theo dõi kết quả SEO (không phải code)

Mốc gốc **2026-09-10: 1 URL được lập chỉ mục / 18 URL trong sitemap**. PM mở property
**`https://topvisa5s.com/`** (không phải Domain property mới tạo) → **Lập chỉ mục → Trang** → ô
"Đã lập chỉ mục".
- Nhích lên 5–10+ sau 3–7 ngày → đang chạy đúng, để yên.
- **Vẫn đứng ở 1 sau 2 tuần → có gì đó đang chặn, phải rà lại.**
- **Sau khi đổi `/blog` → `/tin-tuc` (C-01):** PM dùng "Kiểm tra URL" trong GSC cho `/tin-tuc` và
  `/danh-gia` rồi bấm "Yêu cầu lập chỉ mục". **Không cần gửi lại sitemap.** Sau 1–2 tuần kiểm lại
  xem URL `/blog` cũ đã chuyển sang `/tin-tuc` chưa.

## 3. ⚠️ Bài học kỹ thuật — áp dụng cho MỌI việc sau này

### 3.1 Kiểm chứng & công cụ test

- **A. ⭐ `curl` trần KHÔNG phản ánh đúng HTML khách thật nhận được** — với script chèn ở tầng
  **edge/CDN**. Sự cố thật: kết luận "Cloudflare Web Analytics chưa bật" là **âm tính giả**, vì
  Cloudflare chỉ chèn `beacon.min.js` khi request có `User-Agent` trình duyệt + `Accept: text/html`.
  Ngược lại `curl` trần vẫn ĐÚNG cho thứ do chính `worker.js`/file tĩnh sinh ra: canonical, `h1`,
  status code, sitemap, redirect, nội dung SSR. **Dùng `curl --compressed` để tránh lỗi giải mã.**
- **B. ⭐ Poll `curl` sau deploy phải dùng chuỗi CHỈ CÓ ở bản mới.** Đã vướng **4 lần**. **Trước khi
  chạy poll, tự hỏi: chuỗi này có ở bản CŨ không?** Cloudflare deploy mất ~8–40 giây.
- **C. ⭐ Sửa FAQ thì kiểm bằng SCRIPT SO KHỚP TỪNG CHỮ, không so bằng mắt.** Ràng buộc số 5 kế
  hoạch SEO: JSON-LD `FAQPage` phải khớp text hiển thị từng chữ. Cách đã dùng: parse JSON-LD thật +
  regex lấy `.faq-a`, **`html.unescape` CẢ HAI** rồi so `==`. Quên `unescape` sẽ báo "LỆCH" giả.
- **D. Test màn admin khi không có mật khẩu:** mock `window.api()` thành CSDL trong bộ nhớ, **mô
  phỏng luôn cả TRIGGER**. Ghi lại payload gửi đi để kiểm. Không tạo dữ liệu rác trên production.
- **E. Test `worker.js`:** import thẳng vào Node làm ES module, mock `env.ASSETS.fetch` +
  `global.fetch`. Chạy **nhiều kịch bản** chứ đừng chỉ 1.
- **F. Bấm bằng `.click()` THẬT lên đúng element**, đừng chỉ gọi hàm. Đo giao diện dùng
  `getBoundingClientRect()`, đừng chỉ đọc `text-align`.
- **G. ⭐ Đo giao diện `admin.html` phải mở đúng tab VÀ bỏ `hidden` của `#appView`** — nếu không mọi
  `getBoundingClientRect()` trả **0**, dễ tưởng CSS không ăn.
- **H. ⭐ LUÔN mở tab HOÀN TOÀN MỚI trước khi kết luận.** Tab cũ **giữ lại JS realm** giữa các lần
  `navigate` tới cùng data: URL → biến cũ (`window.gtag`, `__ga4Loaded__`) còn nguyên.
- **I. Tách `<script>` JS khỏi `<script type="application/ld+json">` khi kiểm cú pháp** — regex
  `(?![^>]*\bsrc=)` bắt cả 2 loại, `node --check` sẽ báo lỗi giả trên JSON-LD. Validate JSON-LD
  riêng bằng `json.loads`.
- **J. Giới hạn công cụ đã biết, ĐỪNG debug tưởng lỗi code:** `computer` tool báo
  `left_click failed: the press at (0,0)...` khi element cần cuộn tới · ảnh chụp hay ra 1 góc trang
  cũ · preview pane nạp file cục bộ dưới dạng **`data:` URL** nên `localStorage`/`cookie` bị chặn ·
  đo `scrollY`/`scrollIntoView` qua `javascript_tool` **rất thất thường**.
- **AF. ⭐ MỚI — `resize_window` TRƯỚC rồi `navigate` LẠI rồi mới đo.** Sự cố thật 2026-09-11: lần
  đo đầu tiên `innerWidth = 0` (pane chưa có kích thước) → mọi số vô nghĩa (slide đo ra **2.368px**
  thay vì 618px thật, vì chữ xuống dòng trong cột rộng 0). **Luôn in kèm `innerWidth` trong kết quả
  đo và tự kiểm nó > 0 trước khi tin bất kỳ con số nào.** Nhớ `resize_window({preset:'desktop'})`
  trả lại khi đo xong.
- **AG. ⭐ MỚI — Bash tool NUỐT backslash trong heredoc, kể cả `<<'EOF'` có nháy.** Sự cố thật: viết
  script Python chứa `'\\n'` qua heredoc thì file nhận được chỉ còn `'\n'` → Python chèn **xuống
  dòng thật** thay vì 2 ký tự, làm hỏng chuỗi và sinh `SyntaxError`. Mất 4 lần thử mới ra.
  **Quy tắc: script có escape backslash thì tạo bằng công cụ `Write`, KHÔNG qua heredoc.** Nghi ngờ
  thì `grep` lại chính file vừa tạo bằng `cat -A` để xem backslash còn không.
- **AH. ⭐ MỚI — Cách đo "trang cao thêm bao nhiêu sau khi JS nạp xong".** Không ước lượng: lưu
  `innerHTML` hiện tại → thay bằng đúng HTML tĩnh gốc trong file nguồn → đo `scrollHeight` → khôi
  phục lại. Cho ra số thật (**2.854px**) thay vì đoán. Dùng được cho mọi khối chèn động.

### 3.2 Kiến trúc & thiết kế

- **K. ⭐ Thiết kế "tự động nhận diện" phải tự hỏi: "nếu THỨ mình đang quảng cáo chưa tồn tại thì
  sao?"** Sự cố thật: 1 dòng TEST `published=true` khiến sitemap + trang 404 khai `/visa-nhat-ban`
  trong khi route T14 chưa xây. **Dữ liệu sẵn sàng KHÔNG có nghĩa route phục vụ nó đã sẵn sàng.**
- **L. Điều kiện lọc viết theo WHITELIST tự đúng khi thêm giá trị mới; BLACKLIST phải nhớ sửa.**
- **M. Gặp 2 chỗ viết cứng cùng 1 danh sách → gom hằng số NGAY**, đừng chỉ ghi comment "nhớ sửa cả
  2 nơi". Đã gom `HS_STATUS_KET_QUA_CUOI`, `AUTHOR_DEFAULT`.
- **N. ⭐ Một chuỗi văn bản có thể nằm ở NHIỀU chỗ hơn mình tưởng — grep trước khi sửa.** Câu FAQ
  thời gian xử lý nằm ở **4 chỗ**: JSON-LD `FAQPage` · FAQ hiển thị · `CHATBOX_QUICK` `vi` · `en`.
- **O. Dùng chung + 1 biến chế độ thay vì nhân bản.** `#khPickOverlay` phục vụ 2 ô qua `KH_PICK_MODE`.
- **P. Dùng lại hàm dựng class màu của màn khác thay vì viết bảng màu riêng.**
- **Q. Giá trị mặc định 2 tầng để khỏi bắt PM sửa tay hàng loạt.** Byline: cột `tac_gia` của từng
  bài → trống thì `AUTHOR_DEFAULT`.
- **AI. ⭐ MỚI — "Cho PM tự chọn trong admin" thắng "ghi cứng trong code" khi tiêu chí có thể đổi.**
  Tình huống C-10: cần biết danh mục nào hiển thị kiểu slider. Ghi cứng tên `"Tin tức"` thì PM đổi
  tên danh mục là tính năng **âm thầm** quay về kiểu cũ, không báo lỗi gì. Thêm 1 cột cấu hình rẻ
  hơn nhiều so với 1 lỗi im lặng. Cùng họ với bài học Q.

### 3.3 Landing page / route

- **R.** Cloudflare Static Assets tự **307-redirect** mọi file `.html` sang bản không đuôi —
  canonical + link nội bộ + dò tồn tại bằng `env.ASSETS.fetch()` đều phải dùng path **không đuôi**.
- **S.** `[assets]` mặc định phục vụ file khớp path **thẳng từ edge, bỏ qua `worker.js`** → logic
  cần chạy cho MỌI request phải có `run_worker_first = true`.
- **T.** Route SSR không có file tĩnh dự phòng PHẢI nhận cả `GET` lẫn `HEAD`.
- **U. ⭐ 4 trang TĨNH không tự đồng bộ với `index.html`:** `chinh-sach-bao-mat.html`/
  `dieu-khoan-dich-vu.html`/`lien-he.html`/`cong-cu/uoc-tinh-chi-phi-visa.html`. Khác `/blog`,
  `/blog/<slug>`, 404 (SSR, dùng `getSiteChrome()` nên LUÔN khớp). **Mỗi khi sửa navbar/footer/
  widget nổi/banner cookie ở `index.html`, PHẢI đồng bộ tay 4 file này** — viết script **trích
  thẳng từ `index.html`** rồi chèn, KHÔNG gõ lại tay. `getSiteChrome()` trả 4 trường: `css`,
  `navbar`, `footer`, `consent`.
- **V.** Navbar cần ngưỡng hamburger RIÊNG (`max-width:1099px`), tách khỏi `767px` của layout chung.
- **W.** Cuộn tới `#hash` lúc TẢI TRANG bị trượt nếu có nội dung chèn động: phải **loại HẲN** cú
  cuộn tự động của trình duyệt (xoá hash ở `<head>`), chỉ đổi `scroll-behavior` KHÔNG đủ; mọi cú
  cuộn có thể gọi nhiều lần BẮT BUỘC `behavior:'instant'`. Thêm khối chèn động mới → nhớ
  `finally{ fixInitialHashScroll(); }`.
- **AJ. ⭐ MỚI — `display:flex` mặc định `align-items:stretch` → mọi slide cao bằng slide CAO NHẤT.**
  Hậu quả thật: 1 đánh giá 1.001 ký tự quyết định chiều cao **618px** cho cả 12 slide; đánh giá 52
  ký tự chỉ cần 292px nên dư **326px** trắng (điện thoại dư **624px**). Slider 1-slide-mỗi-lần mà
  nội dung dài ngắn chênh nhau thì **bắt buộc** phải cố định chiều cao + `line-clamp`, không thể để
  tự co.
- **AK. ⭐ MỚI — Trước khi "thêm trang mới", grep xem route tương đương đã tồn tại chưa.** Yêu cầu
  "thêm trang `/tin-tuc`" — nhưng `/blog` đã làm đúng việc đó từ T4 (02/09), đã trong sitemap, đã
  được Google lập chỉ mục. Thêm trang mới song song = **trùng nội dung**, chia đôi tín hiệu SEO.
  **Luôn đọc bảng route trong `worker.js` trước khi nhận việc "thêm trang".**
- **AL. ⭐ MỚI — Phân trang dùng ĐƯỜNG DẪN (`/trang-2`), không dùng query (`?trang=2`).** Vì quy tắc
  T1 bắt canonical bỏ hẳn query → trang 2 sẽ tự trỏ canonical về trang 1, nội dung trang 2 trở đi
  không bao giờ được lập chỉ mục. Đường dẫn thật tránh hẳn mâu thuẫn, không phải mở ngoại lệ.

### 3.4 CSS / UI trong `admin.html`

- **X. ⚠️ `<select>` KHÔNG được đặt `color` chữ sáng** — trên Chrome/Windows các `<option>` kế thừa
  màu đó → chữ trắng trên nền trắng. Các class `.status-select.st-*` **chỉ đặt `background`**.
- **Y. Chọn màu trạng thái mới phải ĐO bằng `getComputedStyle`, không đoán.**
- **Z. Canh lề bảng: đặt class lên CẢ `<th>` LẪN `<td>`** (`.th-center`/`.th-right`/`.td-center`/
  `.td-right`). Chỉ ăn ở chế độ BẢNG; chế độ THẺ trên điện thoại không cần rule riêng.
- **AA. `ho_so.so_luong` do TRIGGER CSDL tính** (`1 khách chính + số thành viên`) — mọi thao tác
  thêm/xoá thành viên PHẢI gọi `refreshSoLuong()`. `so_luong` **nhân vào 2 khoản chi** nên đếm đôi
  1 người là lệch luôn lợi nhuận.
- **AB. Dialog 1-2 field:** `class="modal dlg-standard"` + inline `style="max-width:400px"`, KHÔNG
  thêm `modal-lg`/`modal-xl`. Mẫu: `#renameOverlay`, `#dvgOverlay`. Ngoại lệ CÓ CHỦ Ý, đừng "sửa".
- **AC. Field tiền: dùng `onChiMoneyInput()`, KHÔNG dùng `onMoneyInput()`** — hàm sau còn gọi
  `updateHoSoTotals()`, chỉ đúng cho dialog Hồ sơ. `#dtFeeOverlay` + `#nuocOverlay` vẫn dùng nhầm
  hàm đầu (vô hại nhưng là bẫy chờ) — **chưa làm, chờ PM đồng ý**.

### 3.5 CSDL & schema

- **AD. Kiểm có CHECK constraint thật không TRƯỚC KHI viết migration cho việc thêm/đổi giá trị
  trạng thái.** Cả `ho_so.trang_thai` lẫn `leads.status` đều là `text` tự do, **không có
  constraint**.
- **AE. `sameAs` nghĩa là "URL này LÀ một danh tính khác của CHÍNH thực thể đang mô tả".** Profile
  cá nhân nhân viên KHÔNG thuộc `sameAs` của tổ chức — chỗ đúng để ghi nhận người là
  `Article.author` = `Person`.
- **AM. ⭐ MỚI — Migration backfill 1 lần KHÔNG bảo vệ dòng MỚI. Thêm cột thì phải sửa CẢ ĐƯỜNG
  GHI.** Sự cố thật (L-01): migration 13 backfill `posts.slug` cho 12 bài cũ, nhưng `savePost()`
  trong admin không bao giờ gửi `slug` → mọi bài tạo sau 02/09 sẽ có `slug = NULL` mà **không ai
  biết**, vì route vẫn chạy (rơi về `/blog/bai-viet-<id>`). **Quy tắc: mỗi lần thêm cột mà route/
  giao diện có ĐỌC, phải trả lời đủ 3 câu — (1) dòng cũ điền thế nào? (2) dòng MỚI ai điền? (3)
  nếu NULL thì hỏng ở đâu?** Lớp an toàn rẻ nhất là trigger `BEFORE INSERT`.
- Migration SQL: Claude Code không có quyền chạy — viết file trong `05_Database/`, PM tự chạy trong
  SQL Editor, **phải tự xác nhận PM đã chạy xong** trước khi build route phụ thuộc (mục 45/58).

## 4. Quy trình bắt buộc trước & sau mỗi lần deploy

1. `node --check` mọi khối `<script>` **không có `src=`** (tách riêng JSON-LD, bài học I).
2. Cân bằng thẻ HTML bằng `python3 html.parser`; validate JSON-LD bằng `json.loads`.
3. `git add` **đúng file mình sửa** — repo còn nhiều thư mục untracked sẵn (`10_SEO/`,
   `11_Home_Kaizen/`, `05_Branding_5S/`...), **đừng `git add -A`**.
4. `git push` thẳng `main` → Cloudflare tự deploy (~8–40 giây).
5. Poll `curl` bằng chuỗi CHỈ CÓ ở bản mới (bài học B).
6. **Hồi quy đầy đủ:** `/worker.js` + `/wrangler.toml` + `/package.json` phải **404**; `/`,
   `/admin`, `/blog` (hoặc `/tin-tuc` sau C-01), `/sitemap.xml`, `/robots.txt`, 3 trang pháp lý,
   `/cong-cu/uoc-tinh-chi-phi-visa`, 1 bài blog phải **200**; `/khong-ton-tai` phải **404**;
   redirect `workers.dev` phải **301**; console sạch.
7. Nếu đụng sitemap: kiểm **từng URL** trong sitemap đều trả 200.
8. Xác minh bằng cách **parse dữ liệu thật**, không grep chuỗi rồi kết luận.
9. **Sau khi deploy `admin.html` kèm cột mới:** mở F12 → Network, kiểm **mọi request Supabase trả
   200**. Khối đọc dữ liệu bọc `try/catch` "im lặng bỏ qua" nên lỗi 400 **thất bại âm thầm** —
   trang vẫn chạy, chỉ mất tính năng mà không ai biết (sự cố thật T0).

## 5. Ranh giới nội dung — TUYỆT ĐỐI không vượt

Claude Code **không tự viết**: điều kiện/hồ sơ/quy định lãnh sự, tên người, giờ làm việc, toạ độ,
số liệu, giá, review. Thiếu thì **dừng và hỏi**, không tự điền (ràng buộc số 2, mục 0 kế hoạch SEO).
Khi PM cấp thông tin mà thấy **mâu thuẫn hoặc thiếu rõ ràng thì phải hỏi lại** — ví dụ thật
2026-09-11: chuyên viên gửi "7-10 ngày" trong khi bản cũ ghi "7-10 ngày **làm việc**"; hỏi lại thì
PM xác nhận là ngày làm việc. Ghi thiếu 2 chữ đó là hứa nhanh hơn thực tế, dễ sinh khiếu nại.

Nội dung pháp lý ở 2 trang Chính sách bảo mật / Điều khoản dịch vụ mới chỉ là bản Claude Code soạn
theo Luật 91/2025 + NĐ 356/2025 — **nên cho người có chuyên môn pháp lý rà lại trước khi công bố
rộng rãi** (T25/D1).

**Áp dụng cho Kaizen lần này:** nội dung 4 chủ đề `/tin-tuc` đề xuất ở sheet `04_TK_Tin_tuc` mới
chỉ là **tên chủ đề và lý do chọn** — đoạn mô tả 100–150 từ cho mỗi trang chủ đề (mục S-10) là nội
dung marketing thật, **PM hoặc chuyên viên viết**, Claude Code không tự nghĩ ra.

## 6. Tài liệu tham khảo

`CLAUDE.md` mục 49→59 (kế hoạch SEO, chi tiết từng task) → **mục 60** (trước khi sửa navbar/footer/
widget nổi hoặc trang có cuộn-tới-anchor) → **mục 61** (trước khi sửa màn Hồ sơ/Tài chính/Dashboard
hoặc thêm trạng thái mới) → **mục 62** (trước khi đụng GA4/banner cookie/sitemap) → **mục 63**
(trước khi sửa FAQ hoặc byline tác giả) → **`11_Home_Kaizen/Bao_cao_Phan_tich_Home_Kaizen_20260911.xlsx`
(MỚI — đọc TRƯỚC khi đụng section đánh giá/tin tức trên trang chủ, hoặc route `/blog`)** →
`10_SEO/11_Ke_hoach_sau_xac_nhan.md` (spec đầy đủ các task còn lại, đọc mục 0 trước mỗi task, nhớ
cộng `public/` vào đường dẫn cũ — CLAUDE.md mục 1/52) → `10_SEO/12_Thu_tu_thuc_hien.xlsx` →
`10_SEO/13_Prompt_Claude_Code.md` → `01_Docs/10_Chuan_Dialog_Chung.md` (chuẩn dialog `dlg-*`, **đã
rà 2026-09-07: 14/14 đạt chuẩn**, cuối mục 8 có sẵn 2 lệnh grep để rà lại nhanh) → file này.

**Skill sẵn trong repo:** `.claude/skills/dialog-chuan/` — tự kích hoạt khi làm việc với dialog
trong `admin.html`.

**⚠️ Khi `grep` toàn dự án nhớ LOẠI thư mục `.claude/worktrees/`** — bản checkout cũ của 3 nhánh cũ,
bị `.git/info/exclude` loại nên không được git theo dõi. Trong đó có bản `CLAUDE.md`/`README.md`/
`SKILL.md` cũ ghi đường dẫn thiếu `public/` — **ảnh chụp quá khứ, ĐỪNG sửa, đừng dùng tham chiếu.**

**Đường dẫn kiểu cũ CÒN LẠI, cố ý không sửa:** `01_Docs/05_Ke_hoach_du_an.md` dòng 51/68 ghi
`02_Source/index.html`, `02_Source/admin.html` — tài liệu kế hoạch **lịch sử**, giữ nguyên để đúng
bối cảnh (chủ trương mục 52), khác với file skill là **chỉ dẫn còn hiệu lực** nên phải sửa.

---

## 7. Câu mở đầu gợi ý cho phiên mới

> Đã đọc `CLAUDE.md` (đặc biệt mục 64), `Handover_Phien_Moi.md` (bản 22) và báo cáo
> `11_Home_Kaizen/Bao_cao_Phan_tich_Home_Kaizen_20260911.xlsx` (đã cập nhật theo kiến trúc cuối).
>
> Việc đang dở: **Kaizen trang chủ**. PM đã trả lời hết 6 điểm còn chờ bằng kiến trúc "khóa cứng 2
> danh mục cố định" — Claude Code **đã code + tự test xong** (admin.html 2 tab mới, worker.js đổi
> `/blog`→`/tin-tuc` + trang chủ đề theo Phân loại, index.html bỏ popup + 2 section tĩnh, đồng bộ 4
> trang tĩnh, migration 15, Excel báo cáo) nhưng **CHƯA `git push`** — đang chờ PM xác nhận trước
> khi deploy vì đây là thay đổi lớn (đổi toàn bộ URL bài viết, bỏ popup, đổi UI admin).
>
> Việc đầu tiên: hỏi PM đã xem qua tóm tắt chưa và có đồng ý deploy không; nhắc PM chạy
> `05_Database/15_supabase_setup_phase15.sql`. C-06 (`/danh-gia`) vẫn còn chờ, làm sau khi deploy
> xong đợt này.
