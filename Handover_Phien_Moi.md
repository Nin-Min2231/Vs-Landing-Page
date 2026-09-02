# Handover — Bàn giao sang phiên làm việc mới (2026-09-02, bản 16 — GHI ĐÈ toàn bộ bản cũ)

> File này **GHI ĐÈ HOÀN TOÀN** mọi bản handover cũ (bản 1→15) — **không cần đọc lại bản cũ**, nội
> dung quan trọng còn giá trị đã gom hết vào đây. Đọc theo đúng thứ tự: `CLAUDE.md` (toàn bộ, đặc
> biệt mục 49→59) → file này → `10_SEO/11_Ke_hoach_sau_xac_nhan.md` mục 0 (8 ràng buộc) → bắt tay
> vào việc tiếp theo ở **mục 2** dưới đây.

## 0. Trạng thái ngay lúc viết file này

**Đang thực thi bộ kế hoạch SEO ở `10_SEO/` (đọc `10_SEO/11_Ke_hoach_sau_xac_nhan.md` — đây là
nguồn spec duy nhất, không dùng file `12_Ra_soat_...`/`Ra_soat_SEO_...` nếu thấy xuất hiện lại).**

**⭐ Mốc quan trọng nhất: toàn bộ nhóm task "làm được ngay, không chờ ai" trong kế hoạch đã LÀM
XONG HẾT** (T0, T1, T2, T3, T4, T5, T6, T7, T9, T11, T13, T16, T21 — 13 task). Mọi task còn lại đều
đang **chờ PM hoặc chờ chuyên viên visa cấp thông tin** — xem bảng đầy đủ ở mục 2.

Đã làm xong và **deploy + xác nhận sống trên production** các task sau, theo đúng thứ tự PM giao:

| Task | Việc | CLAUDE.md |
|---|---|---|
| T7 | 2 badge số liệu hero dùng số thật (5000+ hồ sơ, 98% đủ điều kiện) | mục 49 |
| T1 | Redirect 301 `*.workers.dev` → `topvisa5s.com`, canonical bỏ query | mục 49 |
| T2 | `<main>`, skip-link, `meta theme-color` | mục 49 |
| T9 | Đồng bộ 8 giá fallback + SSR đè giá thật vào HTML trang chủ | mục 50 |
| T6 | Câu dự phòng chatbox khi AI lỗi (mời để lại SĐT thay vì Zalo) | mục 51 |
| **An ninh** | Chuyển file tĩnh vào `02_Source/public/`, `worker.js`/`wrangler.toml`/`package.json` hết public | mục 52 |
| T3 | width/height 20 ảnh, favicon-32/apple-touch-180 nhẹ, Google Fonts còn 2 weight, QR WebP | mục 53 |
| T4 | **SSR bài viết** — `/blog` + `/blog/<slug>-<id>` + JSON-LD Article, card trang chủ đổi sang `<a href>` thật | mục 54 |
| T21 | **Trang 404 đầy đủ** — navbar/footer/link/hotline thay vì trang trắng, `robots noindex` | mục 55 |
| T5 | **Sitemap động từ worker** — ghép `/`, `/blog`, trang tin cậy, trang quốc gia, toàn bộ bài viết | mục 56 |
| T11 | **3 trang pháp lý** — Chính sách bảo mật, Điều khoản dịch vụ, Liên hệ (`gioi-thieu.html` CHƯA làm, chờ PM) | mục 57 |
| T13 | **Bảng `noi_dung_quoc_gia` + màn nhập admin** — migration 14 PM đã chạy, đã test 1 record (test data, không phải nội dung thật) | mục 58 |
| T16 | **Công cụ ước tính chi phí visa** — `/cong-cu/uoc-tinh-chi-phi-visa` | mục 59 |

Tất cả đã qua: `node --check`, HTML cân bằng thẻ (`python3 html.parser`), test bằng Node import
thẳng `worker.js`/mock dữ liệu thật, mở bằng Claude Browser (kể cả tương tác UI thật qua
`form_input`, không chỉ gọi hàm JS), và **`curl`/browser thật gọi thẳng production sau khi deploy**
— không chỉ tin vào test cục bộ. Commit mới nhất: `e1bc5d0`. Nhánh: đẩy thẳng `main`, không bị chặn
quyền push.

## 1. Cấu trúc file — nhắc lại ngắn gọn (chi tiết đầy đủ ở CLAUDE.md mục 4 + 52)

`02_Source/public/` là thư mục **DUY NHẤT** được `[assets]` trong `wrangler.toml` phục vụ ra
Internet. `02_Source/worker.js`/`wrangler.toml`/`package.json` giữ **ngoài** `public/`, không
public. **Nếu đọc lại `10_SEO/11_Ke_hoach_sau_xac_nhan.md`** (viết TRƯỚC khi có `public/`) và thấy
ghi `02_Source/index.html`/`02_Source/admin.html`/`02_Source/assets/...` — tự hiểu ngầm cộng thêm
`public/` vào giữa, **trừ `worker.js`/`wrangler.toml`/`package.json` vẫn đúng ở `02_Source/` gốc**.

**Mới thêm phiên này:** `02_Source/public/cong-cu/` — thư mục con chứa các trang "công cụ" (T16 đã
xong, T15/T17 sẽ thêm sau). **⚠️ Trang tĩnh nằm trong thư mục con (sâu hơn `index.html` 1 cấp) PHẢI
tự sửa đường dẫn tương đối `assets/...`/`href="#..."` thành tuyệt đối `/assets/...`/`href="/#..."`**
khi copy navbar/footer từ `index.html` — khác với 3 trang T11 (`chinh-sach-bao-mat.html` v.v., đứng
CÙNG cấp `index.html` nên không cần sửa gì). Xem hàm `fixPaths()` trong
`02_Source/public/cong-cu/uoc-tinh-chi-phi-visa.html` (script tạo file, không lưu lại) hoặc
`getSiteChrome()` trong `worker.js` làm mẫu.

## 2. Việc tiếp theo — PHẢI hỏi lại người dùng trước khi chọn hướng nào

**Không còn task nào "làm ngay không chờ ai" trong danh sách D1 của kế hoạch.** Trước khi bắt đầu
bất kỳ việc gì, hỏi người dùng muốn cấp thông tin cho nhóm nào trước:

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
| T14 | Nội dung chuyên môn 1.200-2.000 từ/nước cho ít nhất 1 trong 7 trang quốc gia (bảng `noi_dung_quoc_gia` đã sẵn sàng nhận qua admin — xem CLAUDE.md mục 58 để biết cách nhập) |
| T15/T17 | Checklist giấy tờ theo nước × mục đích (bảng `checklist_items`, dùng chung cho cả 2 công cụ) |
| T18 | Xác nhận thời gian xử lý 2026 cho 7 nước + bổ sung Mỹ/Úc (hiện FAQ chỉ có 4 nước) |

**T11b** (trang `gioi-thieu.html`) chờ PM cấp nội dung câu chuyện công ty + ảnh đội ngũ/văn phòng.

**Gợi ý thứ tự nếu PM/chuyên viên cấp được nhiều thứ cùng lúc:** T20 (5 phút, mở khoá byline cho cả
T14 lẫn bài viết) → T8/T10/T12 (đều nhanh, không phụ thuộc nhau) → T14 (việc lớn nhất còn lại, cần
chuyên viên) → T15/T17/T18.

## 3. ⚠️ Bài học kỹ thuật quan trọng — áp dụng cho MỌI trang/route mới sau này

**A. Cloudflare Static Assets tự 307-redirect MỌI file `.html` sang bản không đuôi** (đã xác nhận
qua `/admin.html`→`/admin`, và giờ cả 3 trang T11 + trang công cụ T16). Hệ quả bắt buộc cho MỌI
trang tĩnh mới:
- `<link rel="canonical">` của chính trang đó phải dùng path **KHÔNG đuôi** `.html`.
- Mọi link nội bộ trỏ tới trang đó (footer, nav, sitemap...) dùng path không đuôi.
- Nếu viết code DÒ TỒN TẠI 1 file tĩnh bằng `env.ASSETS.fetch()` (như `worker.js` làm cho sitemap
  và trang 404) — PHẢI dò bằng path không đuôi, vì dò bằng `.html` sẽ luôn nhận về `307` (không
  phải `2xx`) dù file tồn tại thật, khiến logic tưởng nhầm là "chưa có". Đã tự bắt lỗi này 1 lần khi
  làm T11 (sửa `TRUSTED_STATIC_PAGES`/`EXTRA_STATIC_PAGES` trong `worker.js`).

**B. Route SSR không có file tĩnh dự phòng phải nhận cả `GET` lẫn `HEAD`** (bài học từ T4, áp dụng
lại cho T21/T5) — `curl -I` (HEAD) sẽ ra 404 nếu quên, dù `curl` thường (GET) vẫn đúng.

**C. Poll `curl` sau khi deploy — điều kiện dừng vòng lặp PHẢI phân biệt được bản MỚI với bản CŨ**,
không chỉ kiểm tra "có nội dung hợp lệ" (bản cũ/cache cũng có thể hợp lệ). Ví dụ sai đã gặp 2 lần
trong phiên này: poll bằng "thấy `<urlset>`" hoặc "thấy 404" — cả bản cũ lẫn bản mới ĐỀU thoả điều
kiện đó nên vòng lặp thoát ngay ở bản CŨ/cache, tưởng đã deploy xong. Luôn chọn điều kiện phủ định
đặc trưng của bản cũ (vd "KHÔNG còn thấy `changefreq`") hoặc 1 chuỗi chỉ có ở bản mới.

**D. Thiết kế "tự động nhận diện, không cần sửa lại file" — áp dụng lặp lại nhiều lần rất hiệu quả,
tiếp tục dùng cho T14/T15/T17 sau này:** trang 404 (T21) dò `noi_dung_quoc_gia` published qua
try/catch; sitemap (T5) dò cả trang tĩnh tồn tại (`EXTRA_STATIC_PAGES`, HEAD-probe) lẫn trang quốc
gia published (query + lastmod). Cả 2 cơ chế đã tự động nhận diện đúng 3 trang T11 + trang công cụ
T16 + (khi migration 14 chạy xong) sẵn sàng nhận trang quốc gia — **không cần quay lại sửa
`worker.js` lần nào** khi các task đó lần lượt hoàn thành. Khi làm T15/T17 (`/cong-cu/checklist-ho-so-visa`,
`/cong-cu/tu-soat-ho-so-visa`), chỉ cần thêm đúng 1 dòng path vào mảng `EXTRA_STATIC_PAGES`.

**E. `05_Database/README.md` từng thiếu 1 dòng cho migration 13** (bị bỏ sót khi viết — phát hiện
và sửa trong phiên này, xem mục 13/14 trong README). Nhắc lại quy tắc: **mỗi migration mới PHẢI có
đúng 1 dòng trong danh sách numbered ở README này** — đây chính là loại lỗi "quên 1 chỗ, im lặng
không báo" đã gây sự cố thật trước đó (migration 9 bị bỏ sót không chạy suốt 10 ngày, xem CLAUDE.md
mục 45) — không phải lỗi giống hệt, nhưng cùng họ nguyên nhân (tài liệu không đồng bộ với thực tế).

## 4. Cách đã test/xác nhận (giữ nguyên quy trình, áp dụng tiếp)

- **worker.js:** viết xong → `node --check` → viết script Node **import thẳng `worker.js` thật**
  (không viết lại logic riêng để test), mock `env.ASSETS.fetch`/`global.fetch` (Supabase), dùng
  **dữ liệu thật lấy qua REST API bằng `SUPABASE_ANON_KEY` (chỉ SELECT, không ghi)** khi cần — không
  bịa dữ liệu giả tuỳ tiện.
- **admin.html (tính năng CRUD mới, vd T13):** không có mật khẩu đăng nhập thật → test bằng cách mở
  file, mock `window.api`/`showConfirmPopup`, gọi trực tiếp các hàm qua `javascript_tool` (tải danh
  sách, mở dialog, lưu, sửa, xoá, kiểm tra `snapshotDialog`/`confirmCloseDialog` hoạt động đúng) —
  đã dùng thành công cho toàn bộ luồng T13.
- **Trang tĩnh mới (T11/T16):** mở trực tiếp bằng `file://` qua Claude Browser vẫn gọi được Supabase
  thật (đã xác nhận T16 — fetch giá thật từ production thành công ngay cả khi mở file cục bộ), nên
  tận dụng để test logic tính toán/hiển thị bằng dữ liệu thật trước khi deploy.
- **Sau khi deploy:** poll bằng `curl` trong vòng lặp `until` (không sleep cứng, và nhớ bài học mục
  3.C ở trên), rồi chạy đủ bộ kiểm tra hồi quy (an ninh `/worker.js`/`/wrangler.toml`/`/package.json`
  vẫn 404, redirect `workers.dev`, `/api/chat`, giá SSR trang chủ, favicon, trang 404, sitemap) —
  không chỉ kiểm tính năng mới. Với trang có tương tác (T16), thử lại bằng `form_input` thật trên
  production (không chỉ gọi hàm JS) để chắc chắn sự kiện UI thật cũng hoạt động.
- **⚠️ Trên Windows/Git Bash: LUÔN đặt `export MSYS_NO_PATHCONV=1`** trước khi `curl` một URL có
  path bắt đầu bằng `/`.
- **Local `file://` preview qua Claude Browser có giới hạn đã biết** (không phải lỗi code): ảnh cục
  bộ không báo `naturalWidth`, ảnh chụp màn hình đôi khi trắng/xếp lớp sai/không cuộn theo lệnh
  `scroll`, `ref` bấm bị lệch tọa độ nếu trang đã cuộn giữa lúc lấy `ref` và lúc bấm. Luôn ưu tiên
  `get_page_text`/đo bằng `javascript_tool`, và **xác nhận lại lần cuối trên production thật** (kể
  cả chụp màn hình + tương tác `form_input` thật) trước khi báo "xong".
- **Google Rich Results Test dùng được qua Claude Browser** (`search.google.com/test/rich-results?url=...`).

## 5. Quy trình deploy (không đổi)

`git push` thẳng `main` → Cloudflare tự deploy (~15-30 giây). Migration SQL: **Claude Code không có
quyền chạy trực tiếp trên Supabase** — viết file trong `05_Database/`, PM tự chạy trong SQL Editor,
**phải tự xác nhận PM đã chạy xong** trước khi build route phụ thuộc cột/bảng mới. **Tạo bảng mới
→ nhớ thêm vào `06_Backup_Tool/backup-supabase.mjs` (mảng `TABLES`) + cập nhật
`05_Database/README.md` (mục 3.E ở trên).**

## 6. Tài liệu tham khảo

`CLAUDE.md` mục 49 (T7/T1/T2) → 50 (T9) → 51 (T6) → 52 (an ninh `public/`) → 53 (T3) → 54 (T4) →
55 (T21) → 56 (T5) → 57 (T11) → 58 (T13) → 59 (T16) →
`10_SEO/11_Ke_hoach_sau_xac_nhan.md` (spec đầy đủ, đọc mục 0 trước mỗi task, nhớ cộng `public/` vào
đường dẫn cũ — xem mục 1) → `10_SEO/12_Thu_tu_thuc_hien.xlsx` (thứ tự 20 bước) →
`10_SEO/13_Prompt_Claude_Code.md` (prompt mẫu nếu PM dùng) → file này.
