# Handover — Bàn giao sang phiên làm việc mới (2026-09-13, bản 25 — GHI ĐÈ toàn bộ bản cũ)

> File này **GHI ĐÈ HOÀN TOÀN** mọi bản handover cũ (bản 1→24) — **không cần đọc lại bản cũ**, nội
> dung quan trọng còn giá trị đã gom hết vào đây. Đọc theo đúng thứ tự: `CLAUDE.md` (toàn bộ, đặc
> biệt **mục 64** — Kaizen trang chủ đợt 1 — và **mục 66/67/68 — MỚI**, 3 phiên liên tiếp
> 2026-09-12/13) → file này → `11_Home_Kaizen/Bao_cao_Phan_tich_Home_Kaizen_20260911.xlsx` (chưa
> đổi gì thêm so với bản 24) → `10_SEO/11_Ke_hoach_sau_xac_nhan.md` mục 0 (8 ràng buộc) → bắt tay
> vào việc tiếp theo ở **mục 2** dưới đây.

## 0. Trạng thái ngay lúc viết file này

**✅ Kaizen trang chủ (đợt 1) — ĐÃ DEPLOY, KHÔNG đổi gì thêm so với bản 24.** Khóa cứng "Bài viết"
thành 2 danh mục cố định "Thủ tục Visa"/"Tin tức", đổi `/blog`→`/tin-tuc` (301 vĩnh viễn), trang
`/tin-tuc` chia theo "vùng hiển thị" + trang chủ đề riêng có phân trang. Chi tiết: CLAUDE.md mục 64.

**✅ MỚI — 3 phiên liên tiếp 2026-09-12/13 (sau bản 24), CẢ 3 ĐÃ DEPLOY VÀ ĐÃ XÁC NHẬN ĐÚNG trên
production bằng `curl` + Claude Browser (dữ liệu thật):**

1. **CLAUDE.md mục 66 (commit `dd124fb`) — Chat Box trên điện thoại + 4 fix UI khác PM báo qua ảnh
   chụp:**
   - Bàn phím ảo che kín header/câu hỏi nhanh của Chat Box → thêm
     `interactive-widget=resizes-content` vào `<meta viewport>` + `chatboxSyncViewport()` (JS đồng
     bộ `height`/`top` theo `window.visualViewport` thật, lớp phòng hờ cho iOS Safari).
   - Nút back điện thoại đóng Chat Box thay vì rời trang — kỹ thuật "mốc lịch sử ảo"
     (`history.pushState`/`popstate`), `chatboxHistoryPushed`.
   - Sửa câu chào "bấm câu hỏi nhanh bên dưới" → "phía trên" (khớp vị trí UI đã đổi từ trước).
   - Section "Đánh giá": nút "Xem thêm" đè lên chữ → gộp chung 1 hàng với tên Facebook (trái/phải)
     + mở rộng bề ngang thẻ khớp các section khác.
   - Section "Hồ sơ xin Visa các nước": bấm "Đọc tiếp" quay lại mở POPUP xem nhanh (không rời
     trang) — CHỈ section này, "Tin tức" vẫn rời trang như cũ.
   - "Tin tức & Khám phá thế giới": nút Trước/Sau + số trang → mũi tên tròn + chấm tròn, đồng bộ
     "Đánh giá".
   - Đã đồng bộ tay sang 3 trang tĩnh dùng chung Chat Box (`chinh-sach-bao-mat.html`/
     `dieu-khoan-dich-vu.html`/`lien-he.html`).
2. **CLAUDE.md mục 67 (commit `5440fd9`) — Gộp dialog thành "DIALOG CHUNG" + đổi địa chỉ + mobile 1
   thẻ/trang:**
   - `.pub-dialog-*` — khuôn CSS/JS dùng chung cho MỌI dialog xem nhanh trên trang public: header
     (tiêu đề CỐ ĐỊNH theo loại dialog + nút X) và footer (hotline + CTA) ĐỨNG YÊN, chỉ
     `.pub-dialog-body` cuộn riêng; nút back điện thoại đóng dialog (cùng kỹ thuật mốc lịch sử ảo
     như Chat Box, dùng CHUNG 1 cờ `pubDialogOpenId`/`pubDialogHistoryPushed` + registry
     `pubDialogOnClose[overlayId]`).
   - Đổi địa chỉ công ty **"303 Âu Cơ, Liên Chiểu, Đà Nẵng" → "104 Lê Doãn Nhạ, Hòa Khánh, Đà
     Nẵng"** ở ĐỦ 7 vị trí trong 5 file HTML (kể cả JSON-LD + Google Maps embed) +
     `03_Information/Information.md` + `CLAUDE.md` mục 5 — đã grep xác nhận **0 chỗ còn sót**.
   - Điện thoại: section "Đánh giá" + "Tin tức" chỉ hiện **đúng 1 thẻ/trang** (trước đây 2 xếp
     dọc/3 dồn cột) — `initReviewsSlider()`/`tinTucPageSize()` tự tính lại theo `innerWidth`.
3. **CLAUDE.md mục 68 (commit `a020096`) — Dialog "Đăng ký tư vấn":**
   - 4 nút CTA (menu "Đăng ký tư vấn", hero "Đăng ký tư vấn miễn phí", "Tư vấn ngay" ở từng card
     dịch vụ, "Tư vấn miễn phí" ở footer dialog Đánh giá/Thủ tục Visa) giờ mở **1 dialog đăng ký tại
     chỗ** (dùng khuôn `.pub-dialog-*` mục 67, header tô gradient xanh dương nổi bật hơn 2 dialog
     thông tin) thay vì cuộn xuống `#dang-ky`.
   - **KHÔNG tạo form thứ 2** — di chuyển THẲNG node `.form-card` (chứa `#leadForm` THẬT, nguyên vẹn
     id + submit handler đang chạy ổn định) vào dialog lúc mở, trả về đúng chỗ cũ lúc đóng.
   - Bấm "Tư vấn miễn phí" TỪ BÊN TRONG dialog Đánh giá/Thủ tục Visa: chuyển thẳng sang dialog Đăng
     ký mà KHÔNG push/pop thêm lịch sử (chỉ đổi overlay nào đang hiển thị) — 1 lần back vẫn đóng
     gọn dù đã "chuyển" qua nhiều dialog trong 1 phiên.

### Đã xác nhận trên production hôm nay (đọc dữ liệu thật qua anon key, không phải đọc tài liệu)

| Hạng mục | Trạng thái thật |
|---|---|
| An ninh (Phương án A) | ✅ `/worker.js`/`/wrangler.toml`/`/package.json` vẫn 404 |
| `/blog`→`/tin-tuc`, sitemap, 404, 3 trang tĩnh, `/cong-cu/...` | ✅ tất cả đúng mã trạng thái |
| Địa chỉ mới "104 Lê Doãn Nhạ..." | ✅ xuất hiện đúng ở cả `index.html` + `lien-he.html` (JSON-LD, Maps embed, footer) |
| Địa chỉ cũ "303 Âu Cơ" | ✅ **0 chỗ còn sót** trên toàn bộ `02_Source/public/` |
| `categories` (migration 15) | ✅ **ĐÃ CHẠY** — chỉ còn đúng 2 danh mục "Tin tức"/"Thủ tục Visa" qua REST API, danh mục thừa "Kinh nghiệm xin visa" đã biến mất |
| `noi_dung_quoc_gia` | ✅ **RỖNG (0 dòng)** — dòng test "Visa Nhật Bản" (mục 58/62) đã bị xoá; vấn đề "/visa-nhat-ban lọt sitemap+404" từng ghi ở CLAUDE.md mục 62 **tự hết**, không phải do code sửa — **không có gì phải làm thêm cho việc này** |
| Bài viết published | **14 bài** (9 "Tin tức" + 5 "Thủ tục Visa") — tăng từ 12 ở bản 24, PM tự đăng thêm 2 bài mới qua admin |
| Đánh giá khách hàng | **12 dòng**, không đổi so với bản 24 |
| Dialog Đăng ký/Đánh giá/Thủ tục Visa | ✅ mở/đóng đúng cả 4 điểm vào, form di chuyển + phục hồi đúng vị trí, header đứng yên khi cuộn |

## Việc CÒN LẠI — cập nhật so với bản 24

1. **C-06 — trang `/danh-gia`** vẫn CÒN CHỜ, chưa làm gì (chi tiết đầy đủ ở mục 2.A dưới, giữ
   nguyên y hệt bản 24 — KHÔNG có gì đổi cho phần này trong 3 phiên vừa qua).
2. **PM chạy `05_Database/15_supabase_setup_phase15.sql`** — ✅ **ĐÃ XONG** (xác nhận qua REST API
   hôm nay, xem bảng trên) — **gỡ khỏi danh sách chờ**. Migration tiếp theo (nếu làm T15/T17 —
   `checklist_items`) lấy số **16**.
3. **Fixed-height + line-clamp cho card "Tin tức" (T-01/T-04)** — **VẪN TỒN ĐỌNG**, chưa đụng tới
   trong 3 phiên vừa qua (section "Đánh giá" mục 66/67 là 1 khối card KHÁC). Khi làm, copy đúng mẫu
   `.quote-wrap`/`.quote` (CLAUDE.md mục 65.B.1, bài học AP) để tránh lặp lại bug line-clamp trên
   flex item.
4. **Khung giữ chỗ (skeleton) chống nhảy layout** — vẫn CHƯA LÀM, không nằm trong phạm vi 3 phiên
   vừa qua.
5. **⭐ MỚI — 3 việc PM nên tự kiểm tra trên điện thoại/thiết bị thật** (công cụ test trong môi
   trường agent không mô phỏng được chính xác bàn phím ảo thật/cử chỉ back thật, xem bài học mục 3):
   - **Chat Box (mục 66):** bàn phím ảo có che đúng đủ header/câu hỏi nhanh không; nút back vật lý/
     gesture có đóng Chat Box trước khi rời trang không.
   - **Dialog Đánh giá/Thủ tục Visa/Đăng ký tư vấn (mục 67/68):** nút "Tư vấn miễn phí" có cuộn
     mượt đúng tới form không; nút back có đóng dialog đúng không (đặc biệt sau khi "chuyển" giữa 2
     dialog trong cùng 1 phiên).
   - **Gửi thử 1 lead THẬT qua dialog "Đăng ký tư vấn" mới (mục 68)** trên production, kiểm tra
     xuất hiện đúng trong admin (`Tư vấn`) — cấu trúc form/id đã xác nhận nguyên vẹn (dùng đúng
     `#leadForm` cũ) nên VỀ LOGIC phải chạy y hệt, nhưng CHƯA tự POST thử một lượt thật từ ngữ cảnh
     dialog để chắc chắn 100%. **Không cần dọn dữ liệu test** — 3 phiên vừa qua không tạo lead thật
     nào trên production (chỉ test qua server tĩnh cục bộ/mock).
6. Vài việc nhỏ ghi trong Excel báo cáo Kaizen (sheet 04/07): L-03 (rating giả), L-04 (cắt đoạn
   trích giữa từ), C-08/C-09 (vẫn hoãn được) — không đổi so với bản 24.

Song song: toàn bộ việc PM có thể tự làm cho SEO đã xong; các task SEO còn lại vẫn chờ thông tin PM
cấp hoặc nội dung chuyên viên soạn (mục 2.B, không đổi so với bản 24).

## 1. Cấu trúc file

`02_Source/public/` vẫn là thư mục DUY NHẤT được `[assets]` phục vụ ra Internet; `worker.js`/
`wrangler.toml`/`package.json` vẫn ở gốc `02_Source/`, không public — xem CLAUDE.md mục 4 + 52.
**Không có thư mục mới nào phát sinh từ 3 phiên vừa qua** — chỉ sửa file trong `02_Source/public/`
(`index.html` cả 3 phiên; `chinh-sach-bao-mat.html`/`dieu-khoan-dich-vu.html`/`lien-he.html` chỉ ở
phiên mục 66/67; `cong-cu/uoc-tinh-chi-phi-visa.html` chỉ ở phiên mục 67 — đổi địa chỉ) +
`03_Information/Information.md` (đổi địa chỉ) + `CLAUDE.md`.

**Thư mục có từ phiên trước, KHÔNG đổi gì:** `11_Home_Kaizen/` (xem mục 2.A dưới),
`10_SEO/`, `05_Branding_5S/`, `06_Phase 3_Tai_Chinh/`, `07_Phase 4_Thong_Tin_Khach_Hang/` — vẫn
**untracked**, commit khi PM muốn (KHÔNG tự ý `git add -A`).

## 2. Việc tiếp theo

### 2.A ⭐ ƯU TIÊN 1 — Kaizen trang chủ, đợt 2: trang `/danh-gia` (`11_Home_Kaizen/`)

**KHÔNG đổi gì so với bản 24** — giữ nguyên toàn bộ nội dung dưới đây, chưa ai động vào phần này
trong 3 phiên vừa qua.

Đợt 1 (khóa cứng 2 danh mục + `/tin-tuc`) ĐÃ DEPLOY XONG, xem CLAUDE.md mục 64 — KHÔNG làm lại.
Việc tiếp theo cho Kaizen là **C-06 — chỉ còn đúng 1 điểm chờ PM xác nhận**: menu "💬 Đánh giá" đổi
từ `#danh-gia` (anchor trong trang) sang `/danh-gia` (trang riêng) — hệ quả là mất scrollspy cho
section đó trên trang chủ (vô hại). **Lưu ý MỚI (mục 66/67):** giờ đã có 2 cơ chế liên quan cần tái
dùng khi làm `/danh-gia`:
1. Cơ chế tô sáng menu theo TRANG riêng (mục 65.A/66) — đảm bảo mục menu "Đánh giá" tô sáng đúng
   khi đứng ở trang `/danh-gia`, dùng lại đúng script đã có, không viết lại.
2. **Khuôn "DIALOG CHUNG" `.pub-dialog-*` (mục 67)** — nếu trang `/danh-gia` cũng cần 1 dialog xem
   chi tiết 1 đánh giá nào đó (tương tự dialog "Xem thêm" ở trang chủ), PHẢI dùng lại đúng khuôn
   này (`pubDialogOpen()`/`pubDialogOnClose`), KHÔNG viết dialog riêng — xem CLAUDE.md mục 67 phần
   "⚠️ Thêm dialog MỚI sau này" để biết cấu trúc HTML cần copy.

**Yêu cầu tóm tắt** (từ `request_0911.md` mục 1): trang `/danh-gia` hiện TẤT CẢ đánh giá khách hàng
(phân trang nếu nhiều). Phần "section trang chủ" (2 record/trang, cắt nội dung + Xem thêm) **ĐÃ LÀM
XONG từ mục 65**, **KHÔNG làm lại phần này**. Việc CÒN THIẾU CHỈ còn đúng 1 phần: **trang `/danh-gia`
riêng hiện TẤT CẢ đánh giá** (route SSR mới, chưa tồn tại) + đổi menu "Đánh giá" từ anchor sang link
trang riêng.

**Trước khi làm, đọc kỹ 4 nơi:**
1. Sheet `03_TK_Danh_gia` trong `11_Home_Kaizen/Bao_cao_Phan_tich_Home_Kaizen_20260911.xlsx` —
   thiết kế chi tiết cho phần này.
2. CLAUDE.md mục 64 — hiểu ĐÚNG các hàm/section mới trong `worker.js`/`index.html`
   (`getSiteChrome()`, `renderPostCardHtml()`...).
3. CLAUDE.md mục 65/66 — `.card-review`/`.reviewer-row` (đã đổi cấu trúc ở mục 66) và script tô
   sáng menu theo trang.
4. **CLAUDE.md mục 67** (MỚI) — khuôn `.pub-dialog-*` nếu trang này cần dialog xem chi tiết.

**Phân trang: dùng ĐƯỜNG DẪN, không dùng query** — `/danh-gia/trang-2` (đúng mẫu `/tin-tuc/chu-de/
<slug>/trang-2` đã code ở đợt 1). Lý do: ràng buộc **T1** bắt canonical bỏ hẳn query.

**⚠️ Cảnh báo phải nhớ khi làm `/danh-gia`:**
- Route mới PHẢI nhận cả `GET` lẫn `HEAD` (bài học T4).
- KHÔNG thêm `/danh-gia` vào `EXTRA_STATIC_PAGES` trong `worker.js` — thêm dòng riêng trong
  `renderSitemap()` (đã có sẵn mẫu `/tin-tuc/chu-de/<slug>` để copy y hệt cấu trúc).
- KHÔNG gắn `Review`/`AggregateRating` cho `/danh-gia` — chỉ gắn `BreadcrumbList`.
- Dùng `getSiteChrome()` có sẵn để trang `/danh-gia` tự khớp navbar/footer/banner cookie trang chủ
  (VÀ tự có cơ chế tô sáng menu theo trang, vì script đó đặt bên trong `<nav>`).

### 2.B Việc SEO còn lại — chờ người khác cấp (KHÔNG đổi so với bản 24)

**Trước khi bắt đầu, hỏi PM muốn cấp thông tin cho nhóm nào trước** — cách hỏi cuốn chiếu từng việc
đã hiệu quả ở phiên trước, nên làm lại như vậy.

**Chờ PM cấp thông tin:**
| Task | Cần chính xác cái gì | Lấy ở đâu |
|---|---|---|
| T10 | Giờ làm việc (copy **nguyên văn** từ GBP) + toạ độ lat/long | GBP → bấm địa chỉ → URL Maps dạng `.../@16.07xx,108.15xx,17z` — **⚠️ địa chỉ vừa đổi (mục 67), toạ độ mới phải lấy lại theo địa chỉ MỚI "104 Lê Doãn Nhạ, Hòa Khánh, Đà Nẵng"** |
| T12 | Facebook **Page-ID** (cho `m.me/...`) + xác nhận có gọi lại được trong 30 phút giờ hành chính không | Cài đặt trang FB → Thông tin trang → ID trang |
| T19 | Tài khoản Brevo + API key (**đặt qua Cloudflare secret, KHÔNG dán lên chat**) | brevo.com → SMTP & API → API Keys |
| T11b | Câu chuyện công ty + ảnh đội ngũ/văn phòng cho `gioi-thieu.html` (hiện **404**) | PM viết |
| T25/T26 | Nghĩa vụ BVDLCN 91/2025 (cần luật sư) · mốc đăng ký kinh doanh | PM + luật sư |

**Chờ chuyên viên visa (Claude Code TUYỆT ĐỐI không tự viết thay):**
| Task | Cần gì | Ghi chú |
|---|---|---|
| T14 | 1.200–2.000 từ/nước cho ít nhất 1 trong 7 nước | Hạ tầng **đã sẵn sàng 100%** (bảng `noi_dung_quoc_gia` + admin, xem CLAUDE.md mục 58 — hiện đang RỖNG, dòng test đã xoá). **Bắt đầu 1 nước thôi**, xem kết quả thật rồi mới nhân rộng |
| T15/T17 | Checklist giấy tờ theo nước × mục đích | **Bảng `checklist_items` CHƯA TỒN TẠI** — phải viết migration trước (số **16**). Đề xuất bắt đầu **Nhật Bản × Du lịch** |

**T18/T20 đã XONG** (CLAUDE.md mục 63).

### 2.C ⚠️ Việc CẦN NHỚ khi T14 xong (không đổi so với bản 24)

Khi chuyên viên nhập nội dung thật và bấm publish, **PHẢI đổi `VISA_COUNTRY_ROUTE_READY` trong
`worker.js` từ `false` thành `true`** — đúng 1 dòng. Chốt chặn cố ý để sitemap/404 không khai URL
`/visa-*` khi route chưa tồn tại (bài học K). Quên bước này thì trang quốc gia làm xong vẫn không
vào sitemap.

### 2.D Theo dõi kết quả SEO (không phải code, không đổi so với bản 24)

Mốc gốc **2026-09-10: 1 URL được lập chỉ mục / 18 URL trong sitemap** (nay sitemap đã tăng lên hơn,
xem số URL thật qua `curl https://topvisa5s.com/sitemap.xml`). PM mở property
**`https://topvisa5s.com/`** → **Lập chỉ mục → Trang** → ô "Đã lập chỉ mục".
- Nhích lên sau vài ngày → đang chạy đúng, để yên. Vẫn đứng yên sau 2 tuần → có gì đó đang chặn.
- `/blog`→`/tin-tuc` (C-01) đã deploy từ trước — PM cần "Kiểm tra URL"/"Yêu cầu lập chỉ mục" cho
  `/tin-tuc` trên GSC nếu chưa làm.

## 3. ⚠️ Bài học kỹ thuật — áp dụng cho MỌI việc sau này

Danh sách đầy đủ A→AQ giữ nguyên y hệt bản 24 (xem CLAUDE.md để tra lại nếu cần) — dưới đây chỉ ghi
**2 bài học MỚI** rút ra từ 3 phiên vừa qua (mục 66/67/68), cộng 1 bổ sung cho bài học J/AF đã có.

- **AR. ⭐ MỚI (2026-09-13) — Tái dùng 1 class CSS ở NGỮ CẢNH bố cục khác hẳn ngữ cảnh gốc: PHẢI tự
  hỏi "class gốc còn thuộc tính nào chỉ đúng trong ngữ cảnh CŨ" rồi huỷ tường minh, không chỉ đổi
  đúng thuộc tính đang định đổi.** Sự cố thật gặp 2 LẦN LIÊN TIẾP khi ghép `.slider-arrow`/
  `.slider-dots` (viết cho slider `position:absolute`, mục "REVIEWS SLIDER") vào ngữ cảnh MỚI (hàng
  nút tĩnh của "Tin tức", mục 66): (1) `.slider-arrow` gốc có `top:50%;transform:translateY(-50%)`
  để tự canh giữa dọc khi `position:absolute` — ghi đè `position:static` KHÔNG đủ, vì `transform`
  KHÔNG bị giới hạn bởi `position`, vẫn dịch nút lên ~20px dù đã tĩnh hoá (phải thêm
  `top:auto;transform:none`); (2) `.slider-dots` gốc có `margin-top` (để tách khỏi slider đứng
  phía trên) — đặt cùng hàng ngang với 2 mũi tên thì margin đó đẩy dots lệch xuống (phải
  `margin-top:0`). Cả 2 lỗi chỉ lộ ra khi đo `getBoundingClientRect()` của các phần tử rồi so số —
  ảnh chụp ở độ phân giải thường không đủ tinh để thấy lệch ~11-32px.
- **AS. ⭐ MỚI (2026-09-13) — Khuôn "DIALOG CHUNG" (`.pub-dialog-*`) + 1 cờ lịch sử ảo DÙNG CHUNG
  cho N dialog, KHÔNG viết riêng logic đóng/back/Esc cho từng dialog mới.** `pubDialogOpen(id)`/
  `pubDialogClose()` (module-level `pubDialogOpenId`/`pubDialogHistoryPushed`) + registry
  `pubDialogOnClose[id]` (hàm dọn dẹp riêng, vd trả `.form-card` về đúng chỗ cũ) — dialog MỚI chỉ
  cần dựng đúng cấu trúc HTML rồi gọi `pubDialogOpen('<id>')`. **Khi 1 dialog cần MỞ dialog KHÁC
  ngay từ bên trong nó** (vd nút "Tư vấn miễn phí" ở footer dialog Đánh giá mở dialog Đăng ký):
  **ĐỪNG** `pubDialogClose()` rồi `pubDialogOpen()` ngay lập tức trong CÙNG 1 tick —
  `history.back()` là tác vụ hàng đợi (không đồng bộ tức thời), gọi `pushState()` ngay sau đó có
  thứ tự xử lý KHÔNG chắc chắn giữa các trình duyệt. Thay vào đó chỉ ẩn overlay cũ + hiện overlay
  mới + đổi nhãn `pubDialogOpenId`, **giữ nguyên** đúng 1 mốc lịch sử ảo đã có — 1 lần back vẫn
  đóng gọn dù đã "chuyển" qua bao nhiêu dialog trong 1 phiên.
- **Bổ sung cho bài học J/AF (không phải lỗi mới, một biểu hiện cực đoan hơn):** trong môi trường
  agent, đo `scrollY` sau khi gọi `window.scrollTo()`/`scrollIntoView()` qua `javascript_tool` có
  thể trả về `0` **ngay cả với 1 lệnh gọi ĐƠN GIẢN không liên quan gì tới dialog/lịch sử** (đã tự
  kiểm chứng: `window.scrollTo(0,1000)` gọi riêng lẻ, không có gì khác xen vào, vẫn ra `scrollY=0`
  ngay lập tức). **Không dùng `scrollY` để kết luận đúng/sai** — thay vào đó tạm ghi đè
  `Element.prototype.scrollIntoView` để bắt đúng lệnh gọi (id đích + tham số) rồi khôi phục lại,
  đây là cách đáng tin cậy DUY NHẤT đã xác nhận được trong môi trường này.

## 4. Quy trình bắt buộc trước & sau mỗi lần deploy (không đổi so với bản 24)

1. `node --check` mọi khối `<script>` **không có `src=`** (tách riêng JSON-LD, bài học I).
2. Cân bằng thẻ HTML bằng `python3 html.parser`; validate JSON-LD bằng `json.loads`.
3. `git add` **đúng file mình sửa** — đừng `git add -A`.
4. `git push` thẳng `main` → Cloudflare tự deploy (~8–40 giây).
5. Poll `curl` bằng chuỗi CHỈ CÓ ở bản mới (bài học B) — vd 3 phiên vừa qua đã dùng
   `interactive-widget=resizes-content`/`pub-dialog-overlay`/`registerDialogOverlay`.
6. **Hồi quy đầy đủ:** `/worker.js` + `/wrangler.toml` + `/package.json` phải **404**; `/`,
   `/admin`, `/tin-tuc`, `/sitemap.xml`, `/robots.txt`, 3 trang pháp lý,
   `/cong-cu/uoc-tinh-chi-phi-visa`, 1 bài `/tin-tuc/<slug>-<id>` phải **200**; `/blog` phải **301**;
   `/khong-ton-tai` phải **404**; console sạch.
7. Nếu đụng sitemap: kiểm **từng URL** trong sitemap đều trả 200.
8. Xác minh bằng cách **parse dữ liệu thật**, không grep chuỗi rồi kết luận.
9. **Nếu đổi thông tin công ty (địa chỉ/SĐT/email):** grep TOÀN BỘ dự án trước khi sửa (dùng agent
   riêng nếu cần) — đừng chỉ đoán vài file quen thuộc, dễ sót JSON-LD/Maps embed như mục 67 đã gặp.

## 5. Ranh giới nội dung — TUYỆT ĐỐI không vượt (không đổi so với bản 24)

Claude Code **không tự viết**: điều kiện/hồ sơ/quy định lãnh sự, tên người, giờ làm việc, toạ độ,
số liệu, giá, review. Thiếu thì **dừng và hỏi**, không tự điền. Khi PM cấp thông tin mà thấy **mâu
thuẫn hoặc thiếu rõ ràng thì phải hỏi lại**.

Nội dung pháp lý ở 2 trang Chính sách bảo mật / Điều khoản dịch vụ vẫn chỉ là bản Claude Code soạn
theo Luật 91/2025 + NĐ 356/2025 — **nên cho người có chuyên môn pháp lý rà lại trước khi công bố
rộng rãi** (T25/D1).

## 6. Tài liệu tham khảo

`CLAUDE.md` mục 49→59 (kế hoạch SEO) → mục 60 (navbar/footer/widget nổi) → mục 61 (Hồ sơ/Tài
chính/Dashboard) → mục 62 (GA4/banner cookie/sitemap) → mục 63 (FAQ/byline) → mục 64 (Bài viết/
`admin.html`/`/tin-tuc*`) → mục 65 (section Đánh giá/`.card-review`, navbar `.active`, line-clamp)
→ **mục 66 (MỚI — Chat Box điện thoại: bàn phím ảo/nút back, + 4 fix UI Đánh giá/Thủ tục Visa/Tin
tức)** → **mục 67 (MỚI — ĐỌC BẮT BUỘC trước khi tạo BẤT KỲ dialog mới nào trên trang public: khuôn
`.pub-dialog-*` dùng chung; và trước khi sửa thông tin công ty: địa chỉ/SĐT/email)** → **mục 68
(MỚI — dialog "Đăng ký tư vấn", mẫu "di chuyển form thật vào dialog thay vì nhân bản")** →
`11_Home_Kaizen/Bao_cao_Phan_tich_Home_Kaizen_20260911.xlsx` (đọc TRƯỚC khi làm tiếp C-06/`/danh-gia`)
→ `10_SEO/11_Ke_hoach_sau_xac_nhan.md` (spec đầy đủ task còn lại, nhớ cộng `public/` vào đường dẫn
cũ) → `10_SEO/12_Thu_tu_thuc_hien.xlsx` → `10_SEO/13_Prompt_Claude_Code.md` →
`01_Docs/10_Chuan_Dialog_Chung.md` (chuẩn dialog `dlg-*` **CHỈ dùng trong `admin.html`** — khác hẳn
`.pub-dialog-*` của mục 67 dùng cho trang public) → file này.

**Skill sẵn trong repo:** `.claude/skills/dialog-chuan/` — tự kích hoạt khi làm việc với dialog
trong `admin.html` (KHÔNG áp dụng cho dialog trang public — dùng `.pub-dialog-*`, mục 67).

**⚠️ Khi `grep` toàn dự án nhớ LOẠI thư mục `.claude/worktrees/`** — bản checkout cũ, không được
git theo dõi, ảnh chụp quá khứ, ĐỪNG dùng tham chiếu.

**Đường dẫn kiểu cũ CÒN LẠI, cố ý không sửa:** `01_Docs/05_Ke_hoach_du_an.md` dòng 51/68 — tài liệu
kế hoạch **lịch sử**, giữ nguyên bối cảnh. Tương tự, CLAUDE.md mục 57 (dòng ~2566, nhắc địa chỉ cũ
"303 Âu Cơ...") và `README.md` dòng 46 (changelog 2026-07-18) **cố ý KHÔNG sửa lại** dù địa chỉ đã
đổi ở mục 67 — đây là tường thuật lịch sử tại thời điểm viết, sửa lại sẽ làm sai lệch bối cảnh (xem
nguyên tắc đầy đủ ở CLAUDE.md mục 67.B).

---

## 7. Câu mở đầu gợi ý cho phiên mới

> Đã đọc `CLAUDE.md` (đặc biệt mục 64 + **mục 66/67/68 mới**) và `Handover_Phien_Moi.md` (bản 25).
>
> Kaizen trang chủ đợt 1 vẫn **ĐÃ DEPLOY VÀ HOẠT ĐỘNG ĐÚNG**. Từ bản 24 tới nay đã xử lý thêm 3
> phiên liên tiếp, cả 3 **ĐÃ DEPLOY VÀ ĐÃ XÁC NHẬN ĐÚNG bằng dữ liệu thật trên production**: (1)
> Chat Box điện thoại — sửa bàn phím ảo che khung chat + nút back đóng chat thay vì rời trang, cùng
> 4 fix UI nhỏ (Đánh giá/Thủ tục Visa/Tin tức); (2) gộp dialog Đánh giá + Thủ tục Visa thành 1 khuôn
> DÙNG CHUNG `.pub-dialog-*` (header/footer cố định + hotline/CTA), đổi địa chỉ công ty toàn bộ dự
> án, điện thoại chỉ hiện 1 thẻ/trang cho Đánh giá + Tin tức; (3) thêm dialog "Đăng ký tư vấn" — 4
> nút CTA giờ mở dialog tại chỗ thay vì cuộn xuống, dùng lại ĐÚNG form thật (không nhân bản).
>
> Đã xác nhận thêm hôm nay: **migration 15 đã chạy xong** (chỉ còn 2 danh mục), và vấn đề
> "/visa-nhat-ban lọt sitemap+404" (CLAUDE.md mục 62) **đã tự hết** vì dữ liệu test bị xoá — không
> cần làm gì thêm cho 2 việc này nữa.
>
> Việc còn lại: **C-06 — trang `/danh-gia`** (mục 2.A, chưa đổi gì) là ưu tiên Kaizen tiếp theo; nếu
> làm dialog cho trang này thì PHẢI dùng khuôn `.pub-dialog-*` (mục 67), không viết riêng. Việc nhỏ
> tồn đọng: fixed-height/line-clamp cho card "Tin tức" (T-01/T-04), khung giữ chỗ chống nhảy layout.
>
> **⭐ Khuyến nghị PM tự kiểm tra trên điện thoại thật trước khi coi các phiên vừa qua là "xong hẳn"**
> (mục "Việc CÒN LẠI" ý 5 ở trên): bàn phím ảo + nút back của Chat Box, nút back của 3 dialog mới,
> và gửi thử 1 lead thật qua dialog "Đăng ký tư vấn".
>
> Việc đầu tiên: hỏi PM có muốn làm tiếp `/danh-gia` (C-06) ngay không, hay ưu tiên việc khác (SEO
> mục 2.B, hoặc các việc nhỏ tồn đọng ở trên).
