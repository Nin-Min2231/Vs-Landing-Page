# Handover — Bàn giao sang phiên làm việc mới (2026-09-12, bản 24 — GHI ĐÈ toàn bộ bản cũ)

> File này **GHI ĐÈ HOÀN TOÀN** mọi bản handover cũ (bản 1→23) — **không cần đọc lại bản cũ**, nội
> dung quan trọng còn giá trị đã gom hết vào đây. Đọc theo đúng thứ tự: `CLAUDE.md` (toàn bộ, đặc
> biệt **mục 64** — Kaizen trang chủ đợt 1, ĐÃ DEPLOY — và **mục 65 — MỚI NHẤT**, 2 đợt sửa nhỏ
> hôm nay) → file này → `11_Home_Kaizen/Bao_cao_Phan_tich_Home_Kaizen_20260911.xlsx` (đã cập nhật
> theo đúng kiến trúc cuối, xem sheet 00/02/04/05/08) → `10_SEO/11_Ke_hoach_sau_xac_nhan.md` mục 0
> (8 ràng buộc) → bắt tay vào việc tiếp theo ở **mục 2** dưới đây.

## 0. Trạng thái ngay lúc viết file này

**✅ Kaizen trang chủ (đợt 1) — ĐÃ DEPLOY LÊN PRODUCTION VÀ ĐÃ XÁC NHẬN HOẠT ĐỘNG ĐÚNG (11/09).**
PM trả lời 6 điểm còn chờ (C-06→C-11) bằng 1 kiến trúc MỚI đơn giản hơn hẳn đề xuất gốc trong báo
cáo phân tích: khóa cứng "Bài viết" thành đúng 2 danh mục cố định "Thủ tục Visa"/"Tin tức" (bỏ tab
"Danh mục bài viết"), đổi `/blog`→`/tin-tuc` (301 vĩnh viễn), trang `/tin-tuc` mới chia theo "vùng
hiển thị" (Phân loại) + trang chủ đề riêng `/tin-tuc/chu-de/<slug>` có phân trang. Đã sửa
`admin.html`/`index.html`/`worker.js` + đồng bộ 4 trang tĩnh + viết migration 15 (dọn danh mục
thừa) + cập nhật đầy đủ Excel báo cáo + CLAUDE.md mục 64 (đã sửa lại 1 đoạn "CHƯA push" cũ bị bỏ
sót cho khớp thực tế — xem mục "7 đợt việc gần đây" bên dưới, mục 8).

**✅ MỚI (2026-09-12) — CLAUDE.md mục 65, 2 đợt PM báo/yêu cầu trực tiếp trên production, ĐÃ DEPLOY
CẢ 2, ĐÃ XÁC NHẬN ĐÚNG bằng dữ liệu thật:**
1. **Đợt A (commit `5d7c530`)** — PM hỏi "vì sao ảnh trên trang bị lỗi hiển thị" + "vì sao menu
   Tin tức không sáng, và tiêu đề 'Tin tức & Khám phá thế giới' là gì". Đã kiểm tra trực tiếp: cả
   12 ảnh bài viết đang publish đều SỐNG, không ảnh nào chết — khoảng trắng PM thấy là do
   `loading="lazy"` + rủi ro kiến trúc thật (ảnh lưu ở i.postimg.cc, dịch vụ miễn phí/ẩn danh,
   không SLA). Đã thêm `onerror` phòng hờ (ảnh lỗi thật → hiện placeholder đẹp thay vì icon vỡ xấu)
   + sửa lỗi THẬT: thêm cơ chế tô sáng `.active` cho mục menu khi đang ở trang riêng (`/tin-tuc`,
   `/lien-he`...) — trước đây chỉ tô sáng được mục neo `#hash` trong trang chủ.
2. **Đợt B (commit `fa9df76`)** — làm lại section "Đánh giá" (2 thẻ/lần thay vì 1, cao cố định
   300px thay vì co giãn, nội dung dài cắt còn 4 dòng + nút "Xem thêm" mở dialog xem trọn), bỏ tiêu
   đề to trùng lặp ở `/tin-tuc` (giữ `<h1 class="sr-only">` cho SEO), nút "← Tất cả tin tức" đổi từ
   link chữ trơn sang nút pill bo tròn + tăng khoảng cách với ảnh/nội dung bên dưới.

Chi tiết đầy đủ + **2 bài học kỹ thuật MỚI quan trọng** (xem mục 3 dưới đây, bài học AP và AQ) ở
CLAUDE.md mục 65 — **đọc TRƯỚC khi động vào section "Đánh giá" (`#reviewsTrack`), navbar, hoặc
`getSiteChrome()`/comment gần `<nav>` trong `index.html`.**

### Đã xác minh trên production ngày 2026-09-12 (không phải đọc tài liệu)

| Hạng mục | Trạng thái thật |
|---|---|
| Ảnh bài viết (12 bài publish) | ✅ tất cả sống, không có ảnh chết; đã thêm `onerror` phòng hờ |
| Menu "Tin tức"/"Liên hệ" tô sáng đúng trang | ✅ đo bằng `getComputedStyle`, ra đúng màu xanh chủ đạo |
| Section "Đánh giá" — 2 thẻ/lần, cao 300px | ✅ đo thật trên 12 review production, đúng 11/12 hiện nút "Xem thêm" |
| `/tin-tuc` không còn tiêu đề to trùng lặp | ✅ chỉ còn `<h1 class="sr-only">` (1 H1/trang, ẩn khỏi mắt) |
| Nút "← Tất cả tin tức" | ✅ đã đổi dạng pill + có khoảng cách, áp dụng cả trang bài viết lẫn trang chủ đề |
| An ninh (Phương án A) | ✅ `/worker.js`/`/wrangler.toml`/`/package.json` vẫn 404, không đổi |
| `/blog`→`/tin-tuc` | ✅ vẫn 301, không bị ảnh hưởng bởi 2 đợt sửa hôm nay |

### Việc CÒN LẠI cho Kaizen (ưu tiên tiếp theo, xem mục 2.A) — KHÔNG đổi so với bản 23

1. **C-06 — trang `/danh-gia`** vẫn CÒN CHỜ, chưa làm gì (không nằm trong 2 đợt sửa hôm nay).
2. **PM cần tự chạy `05_Database/15_supabase_setup_phase15.sql`** (xoá danh mục thừa "Kinh nghiệm
   xin visa") — KHÔNG bắt buộc gấp, không ảnh hưởng gì tới site đang chạy đúng, chỉ là dọn dữ liệu.
3. Vài việc nhỏ ghi trong Excel báo cáo (sheet 04/07): khung giữ chỗ chống nhảy layout, L-03
   (rating giả), L-04 (cắt đoạn trích giữa từ), C-08/C-09 (vẫn hoãn được).
   ⚠️ **Riêng "fixed-height + line-clamp cho card Tin tức" (T-01/T-04) VẪN TỒN ĐỌNG** (section
   "Đánh giá" vừa sửa hôm nay là 1 khối card KHÁC, không phải section "Tin tức") — khi làm, copy
   đúng mẫu `.quote-wrap`/`.quote` đã viết ở CLAUDE.md mục 65.B.1 để tránh lặp lại bug line-clamp
   trên flex item (bài học AP).

Song song: toàn bộ việc PM có thể tự làm cho SEO đã xong; các task SEO còn lại vẫn chờ thông tin PM
cấp hoặc nội dung chuyên viên soạn (mục 2.B).

### Dữ liệu production đã đối chiếu 2026-09-11/12 (đọc qua anon key)

- **12 bài viết** đã publish · danh mục **"Tin tức" 7 bài** · **"Thủ tục Visa" 5 bài** ·
  **"Kinh nghiệm xin visa" 0 bài** (danh mục thừa, migration 15 xoá — xem mục trên).
- **12 đánh giá khách hàng** — độ dài nội dung **54 → 1.001 ký tự** (chênh gần 20 lần). **Đã sửa
  hôm nay (2026-09-12, đợt B):** section "Đánh giá" giờ cố định 300px/thẻ + cắt nội dung, không
  còn co giãn theo review dài nhất nữa — số đo cũ ở mục dưới (bảng "Số đo giao diện trang chủ") về
  phần slider đánh giá giờ đã LỖI THỜI, chỉ còn giá trị lịch sử.
- `posts.phan_loai` — có 1 giá trị thật trùng chữ với tiêu đề tĩnh cũ đã bỏ ở `/tin-tuc`
  ("Tin tức & Khám phá thế giới", nhóm 6 bài) — **thuần trùng hợp, không phải bug**, xem CLAUDE.md
  mục 65.B.2 trước khi nghi ngờ "chưa xoá hết".
- **12/12 bài cũ đều có `slug`** (migration 13 backfill, L-01 đã sửa từ Kaizen đợt 1).

### Số đo giao diện trang chủ (đo thật bằng trình duyệt, 2026-09-11 — TRƯỚC Kaizen VÀ trước đợt B
    hôm nay — CHỈ CÒN GIÁ TRỊ LỊCH SỬ cho phần slider đánh giá, xem cập nhật ở trên)

| Hạng mục | Desktop 1280px | Điện thoại 375px |
|---|---|---|
| Chiều cao 1 slide đánh giá (TRƯỚC đợt B — đã đổi hẳn cấu trúc, số này không còn đúng nữa) | 618px (mọi slide) | 936px (mọi slide) |
| Khối `#categorySections` (ĐÃ BỊ THAY bởi Kaizen đợt 1, xem CLAUDE.md mục 64) | 2.555px | 5.314px |
| Chiều cao trang TRƯỚC khi JS nạp xong | 5.755px | — |
| Chiều cao trang SAU khi JS nạp xong | 8.609px | 15.984px |
| **Độ nhảy** | **+2.854px (+49,6%)** | lớn hơn |

Khung giữ chỗ (skeleton) chống nhảy layout **VẪN CHƯA LÀM** — không nằm trong phạm vi 2 đợt sửa
hôm nay (chỉ đụng đúng section "Đánh giá"/`/tin-tuc`/nút back-to-list), vẫn là việc tồn đọng thật.

### 8 đợt việc gần đây — chi tiết ở CLAUDE.md

1. **Mục 61** — Admin: số lượng HS ở màn Tài chính · Thành viên nhóm chọn từ "Thông tin khách
   hàng" · thêm trạng thái hồ sơ **"Xong"**; màn Tài chính thêm cột "Trạng thái".
2. **Rà 14 dialog** `admin.html` đối chiếu `01_Docs/10_Chuan_Dialog_Chung.md` → **14/14 đạt chuẩn**.
3. **Mục 62** — **T8 (GA4) + T22b (banner cookie)** + chốt chặn sitemap không khai URL `/visa-*`.
4. **Mục 63** — **T18** (thời gian xử lý 2026) + **T20** (byline, `Article.author` = `Person`).
5. **Bản 20** — handover gộp bản 1→19.
6. **11_Home_Kaizen (phiên trước)** — phân tích yêu cầu thêm trang `/danh-gia` + `/tin-tuc`, xuất
   báo cáo Excel 10 sheet. Chỉ phân tích, chưa code.
7. **Mục 64 — ĐÃ DEPLOY** — khóa cứng "Bài viết" thành 2 danh mục cố định, đổi `/blog`→`/tin-tuc`
   + trang chủ đề theo Phân loại, bỏ popup xem nhanh. Đã sửa 1 đoạn tài liệu tự mâu thuẫn ("CHƯA
   push" dù thực ra đã deploy, xem cuối mục 64).
8. **Mục 65 (MỚI, hôm nay 2026-09-12) — ĐÃ DEPLOY cả 2 đợt** — tô sáng menu theo trang hiện tại +
   ảnh dự phòng khi lỗi (đợt A); làm lại section "Đánh giá" (2 thẻ/lần, cao cố định + "Xem thêm") +
   bỏ tiêu đề trùng ở `/tin-tuc` + nút "← Tất cả tin tức" sinh động hơn (đợt B). 2 bài học kỹ thuật
   mới: line-clamp không hoạt động trên flex item trực tiếp (AP); đừng gõ nguyên chuỗi mà 1 regex
   "không tham lam" đang tìm, kể cả trong comment (AQ).

## 1. Cấu trúc file

`02_Source/public/` vẫn là thư mục DUY NHẤT được `[assets]` phục vụ ra Internet; `worker.js`/
`wrangler.toml`/`package.json` vẫn ở gốc `02_Source/`, không public — xem CLAUDE.md mục 4 + 52.
**Không có thư mục mới nào phát sinh từ 2 đợt sửa hôm nay** — chỉ sửa `02_Source/public/index.html`
+ `02_Source/worker.js`.

**Thư mục có từ phiên trước:** `11_Home_Kaizen/`
- `request_0911.md` — yêu cầu gốc của PM.
- `Bao_cao_Phan_tich_Home_Kaizen_20260911.xlsx` — báo cáo phân tích **10 sheet**. Đọc theo thứ tự:
  `00_Tong_quan` → `02_Diem_can_chot` (quan trọng nhất, có cột "Quyết định của PM") →
  `01_Hien_trang_do_duoc` → `03_TK_Danh_gia` → `04_TK_Tin_tuc` → `05_Trien_khai_Admin` → `06_SEO`
  → `07_Scroll_Responsive` → `08_Ke_hoach` → `09_Nghiem_thu`.

**KHÔNG thêm/xoá file nguồn nào** (`02_Source/` nguyên vẹn ngoài 2 file sửa hôm nay). `11_Home_Kaizen/`
hiện **untracked**, giống `10_SEO/`, `05_Branding_5S/`… — commit khi PM muốn.

## 2. Việc tiếp theo

### 2.A ⭐ ƯU TIÊN 1 — Kaizen trang chủ, đợt 2: trang `/danh-gia` (`11_Home_Kaizen/`)

**Đợt 1 (khóa cứng 2 danh mục + `/tin-tuc`) ĐÃ DEPLOY XONG, xem mục 0 + CLAUDE.md mục 64 — KHÔNG
làm lại.** Việc tiếp theo cho Kaizen là **C-06 — chỉ còn đúng 1 điểm chờ PM xác nhận**: menu
"💬 Đánh giá" đổi từ `#danh-gia` (anchor trong trang) sang `/danh-gia` (trang riêng) — hệ quả là mất
scrollspy cho section đó trên trang chủ (vô hại, chỉ mất hiệu ứng tô sáng menu lúc cuộn qua — **lưu
ý:** giờ đã có thêm cơ chế tô sáng theo TRANG riêng từ mục 65.A, nên khi làm `/danh-gia` cũng cần
đảm bảo mục menu "Đánh giá" tô sáng đúng khi đứng ở trang đó, dùng lại đúng script đã thêm hôm nay,
không cần viết lại).

**Yêu cầu tóm tắt** (từ `request_0911.md` mục 1): trang `/danh-gia` hiện TẤT CẢ đánh giá khách hàng
(phân trang nếu nhiều), section "Khách hàng nói gì về chúng tôi" trên trang chủ đổi sang **2
record/trang, chiều cao cố định, cắt nội dung + nút "Xem thêm"**, next/back giữ như hiện tại.
**⚠️ CẬP NHẬT QUAN TRỌNG so với bản kế hoạch gốc:** phần "2 record/trang, chiều cao cố định, cắt
nội dung + Xem thêm" cho section trang chủ **ĐÃ LÀM XONG hôm nay** (CLAUDE.md mục 65.B.1, commit
`fa9df76`) — **KHÔNG làm lại phần này**. Việc CÒN THIẾU CHỈ còn đúng 1 phần: **trang `/danh-gia`
riêng hiện TẤT CẢ đánh giá** (route SSR mới, chưa tồn tại) + đổi menu "Đánh giá" từ anchor sang
link trang riêng.

**Trước khi làm, đọc kỹ 3 nơi:**
1. Sheet `03_TK_Danh_gia` trong `11_Home_Kaizen/Bao_cao_Phan_tich_Home_Kaizen_20260911.xlsx` —
   thiết kế chi tiết cho phần này (CHƯA bị Kaizen đợt 1 đụng tới, vẫn còn nguyên giá trị — riêng chỗ
   nói về section trang chủ thì đã làm xong hôm nay, xem trên).
2. CLAUDE.md mục 64 — để hiểu ĐÚNG các hàm/section mới trong `worker.js`/`index.html` sau đợt 1
   (`getSiteChrome()`, `blogHeadCommon()`, `postCardHtml()`, `renderPostCardHtml()`...), tránh làm
   trùng/lệch với cơ chế đã có.
3. **CLAUDE.md mục 65** (MỚI) — `.review-modal-overlay`/`.quote-wrap`/`.card-review` mới cho section
   "Đánh giá" trang chủ, và script tô sáng menu theo trang (`.active`) — trang `/danh-gia` nên tái
   dùng đúng markup/CSS `.card-review` này cho từng đánh giá trong danh sách đầy đủ, thay vì viết
   CSS mới từ đầu (đồng bộ giao diện, và tránh lặp lại bug line-clamp+flex nếu cũng cần cắt bớt nội
   dung ở đâu đó trên trang này).

**Phân trang: dùng ĐƯỜNG DẪN, không dùng query** — `/danh-gia/trang-2` (đúng mẫu `/tin-tuc/chu-de/
<slug>/trang-2` đã code ở đợt 1, copy được luôn cấu trúc). Lý do: ràng buộc **T1** bắt canonical =
`origin + pathname` **bỏ hẳn query** (chống `?utm_source=` sinh trùng lặp). Nếu phân trang dùng
query thì canonical trang 2 tự trỏ về trang 1 → nội dung trang 2 trở đi không bao giờ được lập chỉ
mục. Dùng đường dẫn thật là tránh hẳn mâu thuẫn, không phải mở ngoại lệ.

**⚠️ Cảnh báo phải nhớ khi làm `/danh-gia`:**
- Route mới PHẢI nhận cả `GET` lẫn `HEAD` (bài học T4, đã áp dụng đúng cho `/tin-tuc*` ở đợt 1).
- KHÔNG thêm `/danh-gia` vào `EXTRA_STATIC_PAGES` trong `worker.js` — mảng đó dò file TĨNH có
  thật, route SSR sẽ bị loại; thêm dòng riêng trong `renderSitemap()` (đã có sẵn mẫu `/tin-tuc/
  chu-de/<slug>` để copy y hệt cấu trúc).
- KHÔNG gắn `Review`/`AggregateRating` cho `/danh-gia` (Google không cấp kết quả đa dạng cho đánh
  giá **tự khai** về chính doanh nghiệp trên site của mình; CSDL không có cột số sao thật — `★★★★★`
  là chuỗi dựng sẵn trong `index.html`) — chỉ gắn `BreadcrumbList`.
- Dùng `getSiteChrome()` có sẵn (đã trả thêm `consent` cho banner cookie từ đợt 1) để trang
  `/danh-gia` tự khớp navbar/footer trang chủ (VÀ tự có cơ chế tô sáng menu theo trang từ mục 65.A,
  vì script đó đặt bên trong `<nav>` nên đi kèm `chrome.navbar`), không copy tay như 4 trang tĩnh
  T11/T16.

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

⚠️ **Lưu ý số migration:** số **15** đã bị Kaizen lấy mất
(`05_Database/15_supabase_setup_phase15.sql`, xoá danh mục thừa) — `checklist_items` (T15/T17) giờ
lấy số **16**. Luôn kiểm `05_Database/` trước khi đặt tên file migration mới, đừng tin số ghi sẵn
trong handover bản cũ.

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
- **`/blog` → `/tin-tuc` (C-01) ĐÃ DEPLOY:** PM cần vào GSC dùng "Kiểm tra URL" cho `/tin-tuc` rồi
  bấm "Yêu cầu lập chỉ mục" (nếu chưa làm). **Không cần gửi lại sitemap** (đã tự động có đủ URL
  mới). Khi làm xong C-06 (`/danh-gia`), lặp lại đúng bước này cho trang mới.

## 3. ⚠️ Bài học kỹ thuật — áp dụng cho MỌI việc sau này

### 3.1 Kiểm chứng & công cụ test

- **A. ⭐ `curl` trần KHÔNG phản ánh đúng HTML khách thật nhận được** — với script chèn ở tầng
  **edge/CDN**. Sự cố thật: kết luận "Cloudflare Web Analytics chưa bật" là **âm tính giả**, vì
  Cloudflare chỉ chèn `beacon.min.js` khi request có `User-Agent` trình duyệt + `Accept: text/html`.
  Ngược lại `curl` trần vẫn ĐÚNG cho thứ do chính `worker.js`/file tĩnh sinh ra: canonical, `h1`,
  status code, sitemap, redirect, nội dung SSR. **Dùng `curl --compressed` để tránh lỗi giải mã.**
- **B. ⭐ Poll `curl` sau deploy phải dùng chuỗi CHỈ CÓ ở bản mới.** Đã vướng nhiều lần (kể cả hôm
  nay, đúng cách đã tránh đúng: dùng `tvThumbFallback` rồi `quote-wrap` — 2 chuỗi chỉ có ở bản mới
  nhất, không có ở bản cũ). **Trước khi chạy poll, tự hỏi: chuỗi này có ở bản CŨ không?** Cloudflare
  deploy mất ~8–40 giây.
- **C. ⭐ Sửa FAQ thì kiểm bằng SCRIPT SO KHỚP TỪNG CHỮ, không so bằng mắt.** Ràng buộc số 5 kế
  hoạch SEO: JSON-LD `FAQPage` phải khớp text hiển thị từng chữ. Cách đã dùng: parse JSON-LD thật +
  regex lấy `.faq-a`, **`html.unescape` CẢ HAI** rồi so `==`. Quên `unescape` sẽ báo "LỆCH" giả.
- **D. Test màn admin khi không có mật khẩu:** mock `window.api()` thành CSDL trong bộ nhớ, **mô
  phỏng luôn cả TRIGGER**. Ghi lại payload gửi đi để kiểm. Không tạo dữ liệu rác trên production.
- **E. Test `worker.js`:** import thẳng vào Node làm ES module, mock `env.ASSETS.fetch` +
  `global.fetch`. Chạy **nhiều kịch bản** chứ đừng chỉ 1. **Lưu ý Windows/Git Bash:** dynamic
  `import()` với đường dẫn tuyệt đối kiểu `D:/...` sẽ lỗi `ERR_UNSUPPORTED_ESM_URL_SCHEME` — copy
  script test vào ĐÚNG thư mục `02_Source/` rồi chạy `node ten_file.mjs` từ đó (import tương đối
  `./worker.js`), xong xoá file tạm đi.
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
  đo `scrollY`/`scrollIntoView` qua `javascript_tool` **rất thất thường**. **NGƯỢC LẠI — không phải
  MỌI thứ dưới `data:` URL đều giả:** `fetch()` tới Supabase THẬT vẫn thành công trong pane này
  (đã tự kiểm chứng lại lần nữa hôm nay, mục 65.B) — chỉ riêng `localStorage`/`cookie`/kích thước
  viewport mới bị ảnh hưởng, đừng vơ đũa cả nắm rồi bỏ qua việc test bằng dữ liệu thật.
- **AF. `resize_window` TRƯỚC rồi `navigate` LẠI rồi mới đo.** Sự cố thật (lặp lại đúng y hệt hôm
  nay ở mục 65.B): lần đo đầu tiên `innerWidth = 0`/`clientHeight` sai lệch hoàn toàn → mọi số đo
  vô nghĩa (lần này: `.quote` đo ra `clientHeight` chỉ 32px dù nội dung dài ngắn khác nhau, tưởng
  lầm là bug code — đo lại sau khi resize+reload mới lộ ra đúng là do viewport chưa có kích thước
  thật). **Luôn in kèm `innerWidth` trong kết quả đo và tự kiểm nó > 0 trước khi tin bất kỳ con số
  nào.** Nhớ `resize_window({preset:'desktop'})` trả lại khi đo xong.
- **AG. Bash tool NUỐT backslash trong heredoc, kể cả `<<'EOF'` có nháy.** Script có escape
  backslash thì tạo bằng công cụ `Write`, KHÔNG qua heredoc.
- **AH. Cách đo "trang cao thêm bao nhiêu sau khi JS nạp xong".** Lưu `innerHTML` hiện tại → thay
  bằng đúng HTML tĩnh gốc trong file nguồn → đo `scrollHeight` → khôi phục lại. Dùng được cho mọi
  khối chèn động.

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
- **AI. "Cho PM tự chọn trong admin" thắng "ghi cứng trong code" khi tiêu chí có thể đổi.**
- **AN. Khi PM chủ động chọn "khóa cứng, bớt linh hoạt" thay vì "PM tự cấu hình", ĐỪNG tự ý thêm
  lại linh hoạt.**
- **AO. Giá trị KHÔNG PHẢI 1 thực thể quản lý riêng thì tính slug/khoá nhóm ĐỘNG lúc dựng trang,
  đừng lưu thêm cột.** `posts.phan_loai` là text tự do, không phải FK — tính `slug` động, không cần
  cột riêng.
- **AP. ⭐ MỚI (2026-09-12) — `-webkit-line-clamp` KHÔNG đáng tin cậy khi đặt trực tiếp trên 1 flex
  item.** Sự cố thật: `.card-review{display:flex;flex-direction:column}` có con trực tiếp `.quote`
  mang `display:-webkit-box;-webkit-line-clamp:4` — Chromium "blockify" giá trị `-webkit-box` thành
  `flow-root` khi nó là item flex trực tiếp, làm MẤT HẲN hiệu ứng clamp (`clientHeight` sụp xuống
  còn ~32px cố định bất kể nội dung dài ngắn, đo được y hệt qua `getComputedStyle`/
  `getBoundingClientRect` — không phải giới hạn công cụ, là hành vi CSS chuẩn tái hiện được). **Cách
  sửa:** bọc thêm 1 lớp `display:block` thuần (vd `.quote-wrap`) làm item flex THAY CHO phần tử cần
  clamp — phần tử `-webkit-box` phải nằm LỒNG BÊN TRONG, không phải chính nó là item flex trực
  tiếp. Áp dụng lại y hệt mẫu này ở BẤT KỲ đâu cần "cắt N dòng bên trong 1 container flex" sau này
  (vd T-01/T-04 — fixed-height cho card "Tin tức", xem mục 2.A/CLAUDE.md mục 65.B.1).
- **AQ. ⭐ MỚI (2026-09-12) — Regex "không tham lam" (`[\s\S]*?`) dừng ở LẦN KHỚP ĐẦU TIÊN, kể cả
  trong comment/chú thích — đừng gõ nguyên chuỗi nó đang tìm ở gần đó.** Sự cố thật: viết comment
  giải thích lý do đặt 1 đoạn script bên trong `<nav>...</nav>` lại lỡ gõ nguyên văn chuỗi đóng thẻ
  đó NGAY TRONG COMMENT — `getSiteChrome()` dùng regex `<nav class="navbar">[\s\S]*?<\/nav>` để
  trích navbar, dừng lại NGAY TẠI chuỗi đó trong comment, cắt cụt mất toàn bộ phần script thật phía
  sau. Không có lỗi cú pháp gì để lộ ra — chỉ lặng lẽ mất tính năng khi trích xuất qua `worker.js`.
  Tự phát hiện bằng cách import `worker.js` vào Node rồi kiểm `chrome.navbar.includes(...)` mong đợi
  `true` lại ra `false`. **Áp dụng chung: khi viết comment giải thích 1 quy tắc liên quan tới 1 chuỗi
  cụ thể mà 1 regex "không tham lam" khác trong dự án đang dùng để trích xuất/tìm kiếm, PHẢI diễn
  đạt KHÔNG gõ nguyên văn chuỗi đó** (vd nói "thẻ đóng của nav" thay vì gõ hẳn `</nav>`) — rồi kiểm
  lại bằng cách trích xuất thử, đừng chỉ tin `node --check`/cân bằng thẻ HTML (2 cách đó KHÔNG bắt
  được lỗi loại này).

### 3.3 Landing page / route

- **R.** Cloudflare Static Assets tự **307-redirect** mọi file `.html` sang bản không đuôi —
  canonical + link nội bộ + dò tồn tại bằng `env.ASSETS.fetch()` đều phải dùng path **không đuôi**.
- **S.** `[assets]` mặc định phục vụ file khớp path **thẳng từ edge, bỏ qua `worker.js`** → logic
  cần chạy cho MỌI request phải có `run_worker_first = true`.
- **T.** Route SSR không có file tĩnh dự phòng PHẢI nhận cả `GET` lẫn `HEAD`.
- **U. ⭐ 4 trang TĨNH không tự đồng bộ với `index.html`:** `chinh-sach-bao-mat.html`/
  `dieu-khoan-dich-vu.html`/`lien-he.html`/`cong-cu/uoc-tinh-chi-phi-visa.html`. Khác `/tin-tuc`,
  `/tin-tuc/<slug>`, 404 (SSR, dùng `getSiteChrome()` nên LUÔN khớp). **Mỗi khi sửa navbar/footer/
  widget nổi/banner cookie ở `index.html`, PHẢI đồng bộ tay 4 file này** — viết script **trích
  thẳng từ `index.html`** rồi chèn, KHÔNG gõ lại tay. `getSiteChrome()` trả 4 trường: `css`,
  `navbar`, `footer`, `consent`. (Đợt A hôm nay — mục 65 — đã tự copy tay script tô sáng menu sang
  cả 4 file này, đúng quy tắc.)
- **V.** Navbar cần ngưỡng hamburger RIÊNG (`max-width:1099px`), tách khỏi `767px` của layout chung.
- **W.** Cuộn tới `#hash` lúc TẢI TRANG bị trượt nếu có nội dung chèn động: phải **loại HẲN** cú
  cuộn tự động của trình duyệt (xoá hash ở `<head>`), chỉ đổi `scroll-behavior` KHÔNG đủ; mọi cú
  cuộn có thể gọi nhiều lần BẮT BUỘC `behavior:'instant'`. Thêm khối chèn động mới → nhớ
  `finally{ fixInitialHashScroll(); }`.
- **AJ. `display:flex` mặc định `align-items:stretch` → mọi slide cao bằng slide CAO NHẤT** nếu
  không cố định chiều cao — nguyên nhân gốc của việc phải sửa section "Đánh giá" hôm nay.
- **AK. Trước khi "thêm trang mới", grep xem route tương đương đã tồn tại chưa.**
- **AL. Phân trang dùng ĐƯỜNG DẪN (`/trang-2`), không dùng query (`?trang=2`).**

### 3.4 CSS / UI trong `admin.html`

- **X. ⚠️ `<select>` KHÔNG được đặt `color` chữ sáng** — trên Chrome/Windows các `<option>` kế thừa
  màu đó → chữ trắng trên nền trắng. Các class `.status-select.st-*` **chỉ đặt `background`**.
- **Y. Chọn màu trạng thái mới phải ĐO bằng `getComputedStyle`, không đoán.**
- **Z. Canh lề bảng: đặt class lên CẢ `<th>` LẪN `<td>`** (`.th-center`/`.th-right`/`.td-center`/
  `.td-right`). Chỉ ăn ở chế độ BẢNG; chế độ THẺ trên điện thoại không cần rule riêng.
- **AA. `ho_so.so_luong` do TRIGGER CSDL tính** (`1 khách chính + số thành viên`) — mọi thao tác
  thêm/xoá thành viên PHẢI gọi `refreshSoLuong()`.
- **AB. Dialog 1-2 field:** `class="modal dlg-standard"` + inline `style="max-width:400px"`, KHÔNG
  thêm `modal-lg`/`modal-xl`. Ngoại lệ CÓ CHỦ Ý, đừng "sửa".
- **AC. Field tiền: dùng `onChiMoneyInput()`, KHÔNG dùng `onMoneyInput()`.**

### 3.5 CSDL & schema

- **AD. Kiểm có CHECK constraint thật không TRƯỚC KHI viết migration cho việc thêm/đổi giá trị
  trạng thái.**
- **AE. `sameAs` nghĩa là "URL này LÀ một danh tính khác của CHÍNH thực thể đang mô tả".**
- **AM. Migration backfill 1 lần KHÔNG bảo vệ dòng MỚI. Thêm cột thì phải sửa CẢ ĐƯỜNG GHI.**
- Migration SQL: Claude Code không có quyền chạy — viết file trong `05_Database/`, PM tự chạy trong
  SQL Editor, **phải tự xác nhận PM đã chạy xong** trước khi build route phụ thuộc.

## 4. Quy trình bắt buộc trước & sau mỗi lần deploy

1. `node --check` mọi khối `<script>` **không có `src=`** (tách riêng JSON-LD, bài học I).
2. Cân bằng thẻ HTML bằng `python3 html.parser`; validate JSON-LD bằng `json.loads`.
3. `git add` **đúng file mình sửa** — repo còn nhiều thư mục untracked sẵn (`10_SEO/`,
   `11_Home_Kaizen/`, `05_Branding_5S/`...), **đừng `git add -A`**.
4. `git push` thẳng `main` → Cloudflare tự deploy (~8–40 giây).
5. Poll `curl` bằng chuỗi CHỈ CÓ ở bản mới (bài học B).
6. **Hồi quy đầy đủ:** `/worker.js` + `/wrangler.toml` + `/package.json` phải **404**; `/`,
   `/admin`, `/tin-tuc`, `/sitemap.xml`, `/robots.txt`, 3 trang pháp lý,
   `/cong-cu/uoc-tinh-chi-phi-visa`, 1 bài `/tin-tuc/<slug>-<id>` phải **200**; `/blog` VÀ
   `/blog/<bất kỳ>` phải **301** sang `/tin-tuc` tương ứng (giữ vĩnh viễn); `/khong-ton-tai` phải
   **404**; redirect `workers.dev` phải **301**; console sạch.
7. Nếu đụng sitemap: kiểm **từng URL** trong sitemap đều trả 200.
8. Xác minh bằng cách **parse dữ liệu thật**, không grep chuỗi rồi kết luận.
9. **Sau khi deploy `admin.html` kèm cột mới:** mở F12 → Network, kiểm **mọi request Supabase trả
   200**.

## 5. Ranh giới nội dung — TUYỆT ĐỐI không vượt

Claude Code **không tự viết**: điều kiện/hồ sơ/quy định lãnh sự, tên người, giờ làm việc, toạ độ,
số liệu, giá, review. Thiếu thì **dừng và hỏi**, không tự điền (ràng buộc số 2, mục 0 kế hoạch SEO).
Khi PM cấp thông tin mà thấy **mâu thuẫn hoặc thiếu rõ ràng thì phải hỏi lại**.

Nội dung pháp lý ở 2 trang Chính sách bảo mật / Điều khoản dịch vụ mới chỉ là bản Claude Code soạn
theo Luật 91/2025 + NĐ 356/2025 — **nên cho người có chuyên môn pháp lý rà lại trước khi công bố
rộng rãi** (T25/D1).

**Áp dụng cho Kaizen:** nội dung 4 chủ đề `/tin-tuc` đề xuất ở sheet `04_TK_Tin_tuc` mới chỉ là
**tên chủ đề và lý do chọn** — đoạn mô tả 100–150 từ cho mỗi trang chủ đề (mục S-10) là nội dung
marketing thật, **PM hoặc chuyên viên viết**, Claude Code không tự nghĩ ra.

## 6. Tài liệu tham khảo

`CLAUDE.md` mục 49→59 (kế hoạch SEO, chi tiết từng task) → **mục 60** (trước khi sửa navbar/footer/
widget nổi hoặc trang có cuộn-tới-anchor) → **mục 61** (trước khi sửa màn Hồ sơ/Tài chính/Dashboard
hoặc thêm trạng thái mới) → **mục 62** (trước khi đụng GA4/banner cookie/sitemap) → **mục 63**
(trước khi sửa FAQ hoặc byline tác giả) → **mục 64** (trước khi đụng "Bài viết"/`admin.html` 2 tab
mới, section "Thủ tục Visa"/"Tin tức" trên trang chủ, hoặc route `/tin-tuc*`) → **mục 65 (MỚI —
đọc BẮT BUỘC trước khi đụng section "Đánh giá" `#reviewsTrack`, navbar/`.active`, hoặc bất kỳ
`display:-webkit-box`/`-webkit-line-clamp` nào trong dự án)** →
`11_Home_Kaizen/Bao_cao_Phan_tich_Home_Kaizen_20260911.xlsx` (đọc TRƯỚC khi làm tiếp C-06/`/danh-gia`,
sheet `03_TK_Danh_gia` — nhớ phần section trang chủ đã làm xong, chỉ còn thiếu route riêng) →
`10_SEO/11_Ke_hoach_sau_xac_nhan.md` (spec đầy đủ các task còn lại, đọc mục 0 trước mỗi task, nhớ
cộng `public/` vào đường dẫn cũ — CLAUDE.md mục 1/52) → `10_SEO/12_Thu_tu_thuc_hien.xlsx` →
`10_SEO/13_Prompt_Claude_Code.md` → `01_Docs/10_Chuan_Dialog_Chung.md` (chuẩn dialog `dlg-*`, đã rà
2026-09-07: 14/14 đạt chuẩn) → file này.

**Skill sẵn trong repo:** `.claude/skills/dialog-chuan/` — tự kích hoạt khi làm việc với dialog
trong `admin.html`.

**⚠️ Khi `grep` toàn dự án nhớ LOẠI thư mục `.claude/worktrees/`** — bản checkout cũ của nhánh cũ,
bị `.git/info/exclude` loại nên không được git theo dõi, ảnh chụp quá khứ, ĐỪNG dùng tham chiếu.

**Đường dẫn kiểu cũ CÒN LẠI, cố ý không sửa:** `01_Docs/05_Ke_hoach_du_an.md` dòng 51/68 ghi
`02_Source/index.html`, `02_Source/admin.html` — tài liệu kế hoạch **lịch sử**, giữ nguyên bối cảnh.

---

## 7. Câu mở đầu gợi ý cho phiên mới

> Đã đọc `CLAUDE.md` (đặc biệt mục 64 + **mục 65 mới**), `Handover_Phien_Moi.md` (bản 24) và báo
> cáo `11_Home_Kaizen/Bao_cao_Phan_tich_Home_Kaizen_20260911.xlsx`.
>
> Kaizen trang chủ đợt 1 **ĐÃ DEPLOY VÀ ĐÃ XÁC NHẬN HOẠT ĐỘNG ĐÚNG trên production** (khóa cứng
> "Bài viết" thành 2 danh mục cố định, đổi `/blog`→`/tin-tuc` + trang chủ đề theo Phân loại, bỏ
> popup xem nhanh). Hôm nay (2026-09-12) đã xử lý thêm 2 đợt PM báo trực tiếp trên production — tô
> sáng menu theo trang hiện tại + ảnh dự phòng khi lỗi tải, VÀ làm lại section "Đánh giá" (2 thẻ/
> lần, cao cố định 300px, cắt nội dung + "Xem thêm") + bỏ tiêu đề trùng ở `/tin-tuc` + nút "Tất cả
> tin tức" sinh động hơn — cả 2 đợt **ĐÃ DEPLOY VÀ ĐÃ XÁC NHẬN ĐÚNG bằng dữ liệu thật trên
> production**.
>
> Việc còn lại cho Kaizen: **C-06 — trang `/danh-gia`** (xem mục 2.A) — phần "2 record/trang, cao
> cố định + Xem thêm" cho section trang chủ **đã làm xong hôm nay**, chỉ còn thiếu route
> `/danh-gia` hiện TẤT CẢ đánh giá. Nhắc PM nếu chưa chạy `05_Database/15_supabase_setup_phase15.sql`
> (không gấp).
>
> Việc đầu tiên: hỏi PM có muốn làm tiếp `/danh-gia` (C-06) ngay không, hay ưu tiên việc khác (SEO
> mục 2.B, hoặc vài việc nhỏ còn tồn đọng — khung giữ chỗ chống nhảy layout, fixed-height/line-clamp
> cho card "Tin tức" T-01/T-04 — nhớ copy đúng mẫu `.quote-wrap` ở mục 65.B.1 nếu làm phần này).
