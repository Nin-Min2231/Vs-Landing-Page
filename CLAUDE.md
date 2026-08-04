# CLAUDE.md — Context dự án cho Claude Code

> File này dành cho AI agent (Claude Code). Đọc file này trước khi sửa bất kỳ gì trong dự án. Người dùng (chủ dự án) không biết lập trình — luôn giải thích thay đổi bằng ngôn ngữ dễ hiểu, không thuật ngữ khi báo cáo lại.

## 1. Dự án là gì

Landing page dịch vụ **Visa đa quốc gia** cho công ty **Top Visa** (Đà Nẵng), mục tiêu **Lead Generation** (thu thập khách hàng tiềm năng qua form đăng ký tư vấn). Có kèm trang quản trị đơn giản để xem/xuất lead và quản lý bài viết.

Toàn bộ tài liệu thiết kế (yêu cầu, sitemap, wireframe, design system, kế hoạch, test case, hướng dẫn deploy) nằm ở `01_Docs/` — đọc `01_Docs/Visa-Landing-Page_Tai_lieu.xlsx` (1 file Excel gộp cả 7 tài liệu, có màu sắc dễ đọc) hoặc từng file `.md` tương ứng nếu cần xem sơ đồ Mermaid/wireframe ASCII chi tiết.

## 2. Trạng thái hiện tại (2026-08-04)

| Phase | Trạng thái |
|---|---|
| 1. Phân tích yêu cầu | ✅ Xong |
| 2. Thiết kế (sitemap/wireframe/design system) | ✅ Xong |
| 3. Front-end landing page (`index.html`) | ✅ Xong, đã gắn thông tin thật (logo, hotline, Zalo, Facebook, địa chỉ) + USP + slider đánh giá thật + section Tin tức + SEO (canonical/OG/JSON-LD/robots.txt/sitemap.xml, xem mục 12) |
| 4. Back-end (Supabase) | ✅ **Đã chạy thật** — `SUPABASE_URL`/`SUPABASE_ANON_KEY` đã điền giá trị thật trong cả 2 file HTML |
| 5. Admin CRM (`admin.html`) | ✅ Xong nhiều đợt (Phase 2→5, xem README.md) — Dashboard, Tư vấn (đã gộp "Khách đăng ký"), Hồ sơ, Thông tin khách hàng, Tài chính, Đại lý ủy thác, Cài đặt chung, Danh mục bài viết |
| 6. Kiểm thử | 🟡 Một phần — đã test thủ công + qua DOM (Claude Browser), **chưa test đủ với đăng nhập admin thật** trên tất cả tính năng mới, xem `Handover_Phien_Moi.md` mục "Việc cần làm ngay" |
| 7. Deploy | ✅ **Đã lên Internet** — qua Cloudflare Workers, domain riêng **`https://topvisa5s.com`** (đã trỏ, 2026-08) — vẫn còn chạy song song ở `https://topvisa.nguyennc1357.workers.dev` (cùng 1 bản deploy) |

Chi tiết đầy đủ + lịch sử quyết định kỹ thuật của lần deploy đầu tiên: `01_Docs/08_Ban_giao_Claude_Code.md` ⭐ (đọc trước khi động vào deploy/Supabase). Checklist test case gốc (Phase 1): `01_Docs/05_Ke_hoach_du_an.md`. **Đọc `Handover_Phien_Moi.md` ở thư mục gốc TRƯỚC khi làm bất kỳ việc gì tiếp theo** — file đó tóm tắt phiên làm việc gần nhất, việc còn dang dở, và rủi ro "2 bản sao file" (mục 4 dưới đây).

## 3. Tech stack (đã chọn, lý do xem `01_Docs/06_Cong_nghe_de_xuat.md`)

- **Front-end:** HTML/CSS/JS thuần, **không framework, không build step** — 1 file HTML duy nhất mỗi trang, mở trực tiếp bằng trình duyệt là chạy được.
- **Back-end:** Supabase (PostgreSQL + Auth + REST API tự động qua PostgREST). Gọi thẳng bằng `fetch()`, không cần SDK/npm package.
- **Hosting:** Cloudflare Pages (static, kéo thả file, miễn phí).
- **Lý do:** người vận hành không biết code → mọi thứ phải là file đơn giản, sửa được bằng cách nhờ Claude/Claude Code chỉnh trực tiếp trong file, không có dependency phải `npm install`.

**Khi thêm tính năng mới: giữ nguyên triết lý này.** Không tự ý thêm React/Vue/build tool/package.json trừ khi người dùng yêu cầu rõ ràng — sẽ phá vỡ quy trình deploy kéo-thả hiện tại.

## 4. Cấu trúc file

```
Visa-Landing-Page/
├── CLAUDE.md                       ← file này
├── README.md                       ← hướng dẫn cho người dùng (không phải agent)
├── 01_Docs/                        ← tài liệu thiết kế/kế hoạch (nguồn sự thật cho spec)
│   └── Visa-Landing-Page_Tai_lieu.xlsx   ← đọc cái này trước, dễ nhất
├── 02_Source/                      ← TOÀN BỘ CODE Ở ĐÂY
│   ├── index.html                  ← landing page (HTML+CSS+JS trong 1 file)
│   ├── admin.html                  ← trang quản trị (HTML+CSS+JS trong 1 file, phần lớn công sức nằm ở đây)
│   ├── robots.txt, sitemap.xml     ← SEO (mục 12)
│   └── assets/                     ← logo.png, favicon.png, qr-zalo.png (đã xử lý, không sửa lại)
├── 03_Information/                 ← DỮ LIỆU THẬT của công ty — nguồn duy nhất đáng tin
│   ├── Information.md               ← tên công ty, SĐT, địa chỉ, email, link Facebook
│   ├── logo.jpg                     ← logo gốc (chưa xử lý — bản đã xử lý ở 02_Source/assets/logo.png)
│   └── QR_Zalo.jpg                  ← QR gốc (bản đã xử lý ở 02_Source/assets/qr-zalo.png)
├── 04_Phase 2/                     ← tài liệu bàn giao Phase 2 (Admin CRM nền tảng) — KHÔNG còn SQL ở đây nữa
├── 05_Database/                    ← ⭐ (2026-08-04) NƠI DUY NHẤT chứa file SQL cần chạy trên Supabase
│   ├── README.md                    ← thứ tự chạy + quy tắc thêm migration mới, đọc trước khi sửa SQL
│   ├── 01_supabase_setup.sql        ← Phase 1: leads/posts/categories + RLS
│   ├── 02_supabase_setup_phase2.sql ← Phase 2: ho_so/danh_muc_*/doi_tac* + mở rộng leads (nguon...)
│   ├── 03_supabase_setup_phase3.sql ← Phase 3: khoan_chi (Tài chính)
│   ├── 04_supabase_setup_phase4.sql ← Phase 4: khach_hang + đổi chi_thu_di/chi_thu_ve → chi_phi_ship
│   └── 05_supabase_setup_phase5.sql ← Phase 5: doi_tac_phi thêm nuoc_id/muc_dich_id/phi_lanh_su, đổi tên muc_phi→phi_uy_thac
└── Handover_Phien_Moi.md           ← ⭐ ĐỌC FILE NÀY TRƯỚC — tóm tắt phiên gần nhất, việc dở dang
```

**Quy tắc quan trọng:** khi cần thông tin công ty (tên, SĐT, địa chỉ, email, Facebook...), luôn lấy từ `03_Information/Information.md` — đây là nguồn dữ liệu thật duy nhất, không bịa hay dùng lại giá trị cũ trong code nếu hai bên lệch nhau. Nếu `Information.md` được cập nhật, phải đồng bộ lại các hằng số cấu hình trong `index.html`/`admin.html` (xem mục 5) và cả footer/title/meta liên quan.

**⚠️ File SQL — LUÔN dùng `05_Database/`, không có ngoại lệ (2026-08-04):** trước đây file SQL
nằm rải rác ở `02_Source/`, `04_Phase 2/`, `06_Phase 3_Tai_Chinh/`, `07_Phase 4_Thong_Tin_Khach_Hang/`
— đã gây nhầm lẫn thật (chạy nhầm bản cũ, xem lỗi `42703` ở `Handover_Phien_Moi.md` mục 3.8) nên
người dùng yêu cầu gom hết về `05_Database/` và **xóa hẳn** các bản cũ. Từ nay: cần chạy SQL gì thì
tìm trong `05_Database/` (đọc `05_Database/README.md` trước); thêm/sửa migration mới cũng thêm vào
đây, KHÔNG tạo lại thư mục Phase rải rác như trước.

**⚠️ Rủi ro "2 bản sao file" (vẫn còn, dù đã gọn SQL) — đọc kỹ trước khi kết luận 1 file/thư mục
"không tồn tại":** thư mục gốc dự án trên máy người dùng
(`D:\01_NguyenNC\10_Claude\03_Study VS1\Vs-Landing-Page\`) có thể có **nhiều hơn** những gì hiện
trong git/worktree — vd tại thời điểm viết mục này, máy người dùng còn có thêm (KHÔNG có trong
git): `06_Phase 3_Tai_Chinh/Phase3_TaiChinh_Ban_giao_Claude_Code.md` + `07_Phase 4_Thong_Tin_Khach_Hang/Phase4_BanGiao_Claude_Code.md`
(tài liệu bàn giao 2 phase đó — SQL đã chuyển hết vào `05_Database/` rồi, 2 thư mục này giờ chỉ còn
tài liệu + ảnh thiết kế tham chiếu), `04_Phase 2/01_Design/` (ảnh thiết kế Figma tham chiếu),
`05_Branding_5S/` (tài liệu thương hiệu/logo mới "5S", làm ngoài luồng Claude Code, KHÔNG liên
quan code), và các file CSV xuất từ admin.html (dữ liệu người dùng tải về, không phải tài liệu dự
án). **Nếu đang chạy trong 1 worktree/clone khác (kể cả Claude Cowork) và không thấy các thư mục
này — đừng vội kết luận chúng không tồn tại hay đã bị xóa** — rất có thể chúng chỉ đơn giản chưa
từng được đưa vào git. Hỏi lại người dùng nếu cần nội dung cụ thể trong đó. Xem chi tiết trong
`Handover_Phien_Moi.md`.

## 5. Nơi cấu hình dữ liệu công ty trong code

Đầu file `index.html` (dòng ~18–25) có khối hằng số:

```js
const SUPABASE_URL      = "";   // ← chưa điền — cần Bước 1 trong 01_Docs/07_Huong_dan_Deploy.md
const SUPABASE_ANON_KEY = "";   // ← chưa điền
const HOTLINE           = "0935887922";
const ZALO_PHONE        = "0935887922";
const FACEBOOK_URL      = "https://www.facebook.com/share/1EVr8W3p2E/";
const COMPANY_NAME      = "Top Visa";
const COMPANY_EMAIL     = "hien.gotravel@gmail.com";
const COMPANY_ADDRESS   = "303 Âu Cơ, Liên Chiểu, Đà Nẵng";
```

`admin.html` có khối tương tự nhưng chỉ cần `SUPABASE_URL` và `SUPABASE_ANON_KEY` (đầu file, dòng ~13–14) — phải giống hệt giá trị trong `index.html`.

Đây là 2 giá trị **duy nhất còn thiếu** để toàn bộ hệ thống (form gửi lead + admin) hoạt động thật.

**Lưu ý riêng — link "Facebook tư vấn viên":** `03_Information/Information.md` có 2 link Facebook khác nhau — link công ty (đã đưa vào hằng số `FACEBOOK_URL` ở trên) và link Facebook tư vấn viên cá nhân. Link tư vấn viên **không phải hằng số**, mà được gắn cứng trực tiếp trong thẻ `<a>` ở footer của `index.html` (mục liên kết mạng xã hội). Nếu `Information.md` cập nhật link này, phải tìm và sửa trực tiếp trong HTML (grep chuỗi link cũ trong `index.html`), không thể chỉ sửa khối hằng số.

## 6. Design system — quy ước khi sửa/thêm UI

Toàn bộ token nằm trong CSS `:root{...}` đầu mỗi file (biến `--color-*`, `--sp-*`, `--radius-*`, `--shadow-*`). **Luôn dùng biến có sẵn, không hardcode màu/khoảng cách mới** trừ khi thật sự cần token mới — nếu cần, thêm vào `:root` và cập nhật cả `01_Docs/04_Design_System.md`.

- Font: Be Vietnam Pro (Google Fonts, đã nhúng).
- Màu chủ đạo: xanh dương `#1B6EF3` (primary), cam `#FF7A29` (CHỈ dùng cho CTA quan trọng nhất).
- Breakpoint: Mobile <768px, Tablet 768–1023px, Desktop ≥1024px (mobile-first, 70%+ traffic dự kiến từ điện thoại).
- Icon: emoji + SVG inline, không phụ thuộc thư viện icon ngoài (giữ trang nhẹ, không cần build).

Chi tiết đầy đủ: `01_Docs/04_Design_System.md` (sheet `04_Design System` trong Excel có bảng màu với ô màu minh họa trực quan).

**Dialog/popup trong `admin.html`:** khi tạo mới hoặc sửa lại 1 dialog nhiều field, đọc `01_Docs/10_Chuan_Dialog_Chung.md` trước — có sẵn mẫu HTML/CSS dùng chung (class `dlg-*`), bảng màu, cách format tiền, để mọi dialog đồng bộ giao diện. Ví dụ tham chiếu: dialog "Đăng ký hồ sơ mới" (`#hoOverlay`).

## 7. Database schema (Supabase)

Toàn bộ định nghĩa nằm trong `05_Database/` (xem mục 4 + `05_Database/README.md` — thứ tự chạy
01→04, mỗi file 1 phase). Tóm tắt bảng Phase 1 (`01_supabase_setup.sql`):

- `leads(id, created_at, name, phone, country, note, status, email, link_fb, muc_dich, ngay_nhac_lai, nguon)` —
  status: Mới / Đang tư vấn / Chốt / Hủy. Các cột `email`/`link_fb`/`muc_dich`/`ngay_nhac_lai`/`nguon`
  do Phase 2 thêm sau (xem `02_supabase_setup_phase2.sql`). RLS: `anon` chỉ INSERT, `authenticated`
  (admin) full quyền.
- `posts(id, created_at, title, category_id, image_url, content, published)` — RLS: `anon` chỉ SELECT khi `published=true`, admin full quyền.
- `categories(id, name)` — RLS: `anon` SELECT, admin full quyền.

Các bảng Phase 2→4 (`ho_so`, `ho_so_thanh_vien`, `ho_so_xu_ly_phat_sinh`, `danh_muc_nuoc`,
`danh_muc_muc_dich`, `danh_muc_truong_nhom`, `danh_muc_doi_tac`, `doi_tac`, `doi_tac_phi`,
`khoan_chi`, `khach_hang`...) xem trực tiếp từng file `05_Database/0N_*.sql` tương ứng — không lặp
lại chi tiết ở đây để tránh 2 nơi lệch nhau khi có thay đổi.

Nếu cần đổi schema: sửa file SQL tương ứng trong `05_Database/` (hoặc thêm file mới, xem quy tắc
trong `05_Database/README.md`) VÀ cập nhật code gọi API tương ứng trong `index.html` (form submit,
bảng `leads`) hoặc `admin.html` (mọi thao tác CRUD) — 2 nơi phải khớp nhau tuyệt đối vì không có
ORM/type-checking.

## 7.5. Môi trường test — quyết định: KHÔNG dùng Docker/Supabase local

Dự án này **test trực tiếp trên project Supabase Cloud (gói Free)** đã tạo ở `07_Huong_dan_Deploy.md` Bước 1 — không dựng Supabase local bằng Docker/Supabase CLI. Lý do: người dùng không rành Docker; project Cloud Free đã đủ dùng và test trên đó chính xác 100% với bản sẽ go-live (không có rủi ro lệch môi trường). Quyết định này đã được người dùng xác nhận — **không tự ý đề xuất lại Docker/local Postgres trừ khi người dùng chủ động hỏi lại.**

Người dùng quen thao tác kiểu SQL Server Management Studio (SSMS) nhưng **SSMS không tương thích với Supabase** (SSMS chỉ dùng cho SQL Server, Supabase chạy PostgreSQL — khác engine). Nếu cần thao tác database qua GUI desktop thay vì Table Editor trên web, hướng dẫn dùng Azure Data Studio (+ extension PostgreSQL), pgAdmin, hoặc DBeaver — kết nối thẳng vào Supabase Cloud qua connection string ở Project Settings → Database (không cần Docker). Chi tiết: `01_Docs/07_Huong_dan_Deploy.md` Bước 2.

**Không đề xuất đổi database engine sang SQL Server thật** để chiều theo việc người dùng quen SSMS — điều đó sẽ phá vỡ toàn bộ kiến trúc (mất Auth có sẵn, mất API tự sinh PostgREST, phải viết backend riêng + thuê server). Chỉ cân nhắc nếu người dùng yêu cầu rõ ràng và hiểu rõ đánh đổi.

## 8. Việc còn thiếu / placeholder cần xử lý

Tìm bằng cách grep `[THAY_THẾ]` trong `02_Source/index.html`:

| Vị trí | Placeholder | Cần gì |
|---|---|---|
| Badge hero | "5000+ hồ sơ", "98% đậu" | ⬜ Vẫn thiếu — số liệu thật, bịa số ở đây có thể vi phạm chính sách quảng cáo |
| Section dịch vụ | Giá "Từ x đ" mỗi quốc gia | ⬜ Vẫn thiếu — bảng giá thật |
| Section đánh giá | ~~3 review mẫu~~ | ✅ Đã xong — đã thay bằng 2 review thật lấy từ Facebook công ty (xem `01_Docs/09_Noi_dung_Dang_bai.md`) |
| Footer | ~~Số GPKD~~ | ✅ Đã bỏ theo yêu cầu người dùng (2026-07-31) — footer không còn hiển thị dòng GPKD nữa, chỉ còn "© 2026 Top Visa." Nếu sau này có số GPKD thật, hỏi người dùng có muốn thêm lại không. |
| Cả 2 file | ~~`SUPABASE_URL`, `SUPABASE_ANON_KEY`~~ | ✅ Đã điền giá trị thật (2026-07-30) — chi tiết ở `01_Docs/08_Ban_giao_Claude_Code.md` |

**Không tự ý bịa số liệu, review, hay giá — đây là dữ liệu ảnh hưởng pháp lý/quảng cáo.** Nếu thiếu, hỏi lại người dùng.

## 9. Cách kiểm tra sau khi sửa code

Không có test framework/build. Cách verify tối thiểu sau mỗi lần sửa `index.html` hoặc `admin.html`:

1. Kiểm tra cân bằng thẻ HTML + cú pháp JS (không cần trình duyệt):
   ```bash
   node --check <(sed -n '/<script>/,/<\/script>/p' file.html | sed '/<\/\?script>/d')
   ```
   hoặc dùng `python3 -c "from html.parser import HTMLParser..."` để bắt thẻ chưa đóng.
2. Nếu có thể mở trình duyệt (Claude Code có quyền), mở file và click thử theo 14 test case trong `01_Docs/05_Ke_hoach_du_an.md`.
3. Sau khi có Supabase config thật: gửi thử 1 lead qua form → kiểm tra xuất hiện trong Supabase Table Editor / trong `admin.html`.
4. Trước khi báo "xong" với người dùng: xác nhận không còn placeholder mới bị bỏ sót, không có tên/số liệu tự bịa.

## 10. Việc KHÔNG được làm

- Không thêm framework/bundler (React, Vite, webpack...) — phá vỡ mô hình "1 file HTML deploy trực tiếp".
- Không đặt `service_role key` của Supabase vào bất kỳ file HTML nào (chỉ dùng `anon public key`).
- Không tự bịa số liệu/giá/review/thông tin pháp lý.
- Không đổi tên file `index.html`/`admin.html` hoặc cấu trúc thư mục `assets/` mà không cập nhật lại hướng dẫn deploy trong `01_Docs/07_Huong_dan_Deploy.md`.
- Không xóa comment `<!-- [THAY_THẾ] ... -->` cho tới khi giá trị thật đã được điền — đây là dấu hiệu để người dùng biết còn việc phải làm.
- Không đề xuất cài Docker/Supabase CLI local, và không đề xuất SQL Server/SSMS thay cho Supabase/PostgreSQL — xem mục 7.5.
- **Không tự ý thêm câu lệnh `insert into ...` (dữ liệu mẫu/khởi tạo) vào bất kỳ file SQL setup/migration nào** (2026-08). Từ nay người dùng tự nhập dữ liệu thật trực tiếp qua giao diện `admin.html` (tab "Cài đặt chung", "Danh mục"...), không cần/không muốn SQL tự chèn sẵn danh sách nào nữa. File SQL chỉ nên chứa `create table`/`alter table`/RLS/view/trigger. Lý do: `on conflict do nothing` chỉ chặn được lỗi trùng khi dòng dữ liệu còn tồn tại — nếu người dùng đã xóa 1 dòng do dữ liệu mẫu/sai, chạy lại file SQL đó sẽ vô tình chèn lại đúng dòng vừa xóa (không còn gì để "conflict" nữa). Nếu 1 tính năng mới thật sự cần vài dòng khởi tạo để chạy được, phải hỏi người dùng trước, không tự thêm.

## 11. Khi hoàn thành một thay đổi

Cập nhật ngắn gọn checklist liên quan trong `README.md` (mục "Việc cần làm trước khi công khai") và, nếu ảnh hưởng tài liệu thiết kế, cập nhật luôn `.md` tương ứng trong `01_Docs/` + note lại trong file Excel (không bắt buộc format lại toàn bộ Excel mỗi lần, chỉ sửa nội dung liên quan).

## 12. SEO — domain riêng `topvisa5s.com` + việc lên top Google (2026-08)

**Bối cảnh:** 2026-08, phát hiện tìm `topvisa5s.com` trên Google không ra kết quả nào (kể cả
`site:topvisa5s.com`) — **không phải do lỗi kỹ thuật hay bị chặn**, mà vì domain **chưa từng
được Google thu thập dữ liệu (crawl) lần nào** — hoàn toàn bình thường với domain mới, chưa ai
khai báo với Google. Đã kiểm tra kỹ: `robots.txt` (mặc định của Cloudflare) không chặn crawl,
trang tải bình thường, có title/description đầy đủ.

**Đã làm trong code (`02_Source/index.html` + 2 file mới):**
- Thêm `<link rel="canonical" href="https://topvisa5s.com/">` — vì trang chạy được ở CẢ 2 nơi
  (`topvisa5s.com` và `topvisa.nguyennc1357.workers.dev`, cùng 1 bản deploy) nên cần khai báo rõ
  domain "chính" để Google không tính là 2 trang trùng nội dung.
- Thêm đầy đủ Open Graph + Twitter Card (ảnh dùng tạm `assets/logo.png` 240×240 — nếu muốn ảnh
  chia sẻ Facebook/Zalo đẹp hơn, nên có ảnh riêng tỉ lệ 1200×630).
- Thêm structured data (JSON-LD) 2 khối: `TravelAgency` (tên/địa chỉ/SĐT công ty) và `FAQPage`
  (lấy đúng y nguyên nội dung từ `<section id="faq">` — **sửa FAQ ở đâu thì phải sửa lại cả 2
  chỗ cho khớp nhau**, Google phạt nếu structured data không khớp nội dung hiển thị).
- Tạo mới `02_Source/robots.txt` (cho phép crawl toàn bộ, chặn riêng `/admin.html`, trỏ tới
  sitemap) và `02_Source/sitemap.xml` (1 URL trang chủ) — trước đó 2 file này chưa từng tồn tại.

**Việc CẦN người dùng tự làm (Claude Code không có quyền đăng nhập tài khoản Google của bạn):**
1. Tạo tài khoản **Google Search Console** (search.google.com/search-console, miễn phí) → thêm
   property `https://topvisa5s.com` → xác minh quyền sở hữu (cách dễ nhất: thẻ HTML đã có sẵn
   `<meta name="google-site-verification">` do Google cấp — dán vào đầu `<head>` của
   `index.html` rồi nhờ Claude Code deploy lại, hoặc dùng cách xác minh qua DNS trên Cloudflare).
2. Sau khi xác minh xong: vào **Sitemaps** → khai báo `https://topvisa5s.com/sitemap.xml`.
3. Vào **URL Inspection** → dán `https://topvisa5s.com/` → bấm **"Yêu cầu lập chỉ mục" (Request
   Indexing)** — đây là bước nhanh nhất để Google bắt đầu thu thập dữ liệu (thường vài giờ–vài
   ngày thay vì chờ tự nhiên vài tuần).
4. Tạo **Google Business Profile** (business.google.com, miễn phí) cho "Top Visa" — rất quan
   trọng cho SEO địa phương (Đà Nẵng), giúp lên Google Maps + "local pack" khi khách tìm "dịch vụ
   visa Đà Nẵng". Cần xác minh (thường qua SĐT hoặc thư bưu điện).
5. (Khuyến khích, không bắt buộc) Đăng ký thêm **Bing Webmaster Tools** — tự động import được
   dữ liệu từ Google Search Console, tốn thêm 5 phút nhưng phủ thêm Bing/Cốc Cốc.
6. (Khuyến khích) Xin/tạo backlink thật: link từ trang Facebook công ty, các hội nhóm/diễn đàn
   liên quan — Google xếp hạng cao một phần dựa vào có trang khác trỏ link về, domain càng mới
   càng cần việc này để được tin tưởng nhanh hơn.

**Không tự bịa** số liệu (đánh giá/rating) hay tạo review giả để nhét vào structured data — vi
phạm chính sách Google, có thể bị phạt (giảm hạng/ẩn khỏi kết quả). Nếu sau này có review thật
kèm rating, mới cân nhắc thêm schema `AggregateRating`.

## 13. Tìm kiếm free-text không phân biệt dấu tiếng Việt — hàm dùng chung `vnNorm()` (2026-08)

**Quy tắc bắt buộc:** mọi ô nhập tìm kiếm tự do trong `admin.html` (lọc theo tên khách, SĐT, địa
chỉ...) đều phải cho phép gõ **không dấu** mà vẫn ra đúng kết quả có dấu — gõ "a" phải khớp cả
"á/à/ả/ã/ạ/â/ầ/ấ/ẩ/ẫ/ậ/ă/ằ/ắ/ẳ/ẵ/ặ", gõ "e" khớp "e/ê", gõ "o" khớp "o/ô/ơ", gõ "d" khớp "d/đ"...
Đây là nhu cầu thực tế vì nhân viên thường gõ tắt không dấu cho nhanh.

**Cách làm — hàm `vnNorm(s)`** định nghĩa 1 lần trong `02_Source/admin.html` (khu vực "TIỆN ÍCH
CHUNG" đầu `<script>`, ngay sau hàm `esc()`): lowercase → tách dấu bằng `normalize('NFD')` → xóa
hết dấu (`̀`-`ͯ`) → xử lý riêng `đ`→`d` (vì `đ` không tách được bằng NFD). So khớp bằng
`vnNorm(dữ liệu).includes(vnNorm(từ khóa))` ở **cả 2 phía**.

**⚠️ Khi thêm bất kỳ ô tìm kiếm tự do MỚI nào sau này** (thêm tab mới, thêm bộ lọc mới...): PHẢI
gọi qua `vnNorm()` như 4 chỗ đã áp dụng, KHÔNG viết lại `.toLowerCase().includes()` thô — nếu
không, ô đó sẽ là chỗ duy nhất trong hệ thống không tìm được khi gõ không dấu, không đồng bộ với
phần còn lại. 4 chỗ đã áp dụng (tham chiếu khi cần thêm chỗ thứ 5): `fHsSearch`→`renderHoSo()`,
`fKhSearch`→`renderKhachHang()`, `fTvSearch`→`renderTuVan()` (đã gộp chung "Khách đăng ký" vào
đây, xem mục 15), `khPickSearch`→`renderKhPickList()` (dialog "Chọn khách hàng").

## 14. Kiểm tra ràng buộc trước khi xóa — hàm dùng chung `isRecordInUse()` (2026-08)

**Quy tắc bắt buộc:** với dữ liệu có thể đang được **tham chiếu ở màn hình/bảng khác** (vd:
khách hàng đã gắn vào 1 hồ sơ, đại lý ủy thác đã gắn vào 1 hồ sơ, danh mục Nước đến/Mục đích/Đối
tác đã dùng trong hồ sơ hoặc tư vấn...), nút "Xóa" **PHẢI chặn xóa** nếu dữ liệu đang được dùng —
không cho xóa mất dữ liệu đang bị tham chiếu, tránh để lại "tham chiếu treo" (hồ sơ trỏ tới 1
khách hàng/đại lý/danh mục không còn tồn tại). Thay vào đó báo lỗi dễ hiểu, vd: "Khách hàng này đã
có hồ sơ nên không thể xóa."

**Cách làm — hàm `isRecordInUse(refs)`** định nghĩa trong `02_Source/admin.html` (ngay trước
`isDanhMucInUse`, khu vực Cài đặt chung): nhận vào mảng `[{table, column, value}]`, query từng
bảng xem có dòng nào `column = value` không (`value` mặc định dùng `id` của record đang định xóa,
nhưng có thể truyền giá trị khác — vd `leads.country` lưu theo TÊN chứ không phải id). Trả về
`true` nếu **bất kỳ** bảng nào có dữ liệu tham chiếu.

Mẫu áp dụng trong 1 hàm xóa (`delXxx`):
```js
async function delXxx(id){
  if(!await showConfirmPopup({message:'Xóa X này? Không thể hoàn tác.'})) return;
  try{
    if(await isRecordInUse([{table:'bang_con',column:'xxx_id',value:id}])){
      showNotifyPopup({message:'X này đang được dùng nên không thể xóa'}); return;
    }
    await api('xxx?id=eq.'+id,{method:'DELETE',prefer:'return=minimal'});
    ...
  }catch(e){
    // fallback: nếu isRecordInUse lọt 1 trường hợp, để DB tự chặn qua lỗi FK và vẫn báo thân thiện
    const msg=e.message.toLowerCase();
    if(msg.includes('foreign key')||msg.includes('violates')||msg.includes('23503'))
      showNotifyPopup({message:'X này đang được dùng nên không thể xóa'});
    else toast('Lỗi xóa: '+e.message,'err');
  }
}
```
Luôn làm **CẢ 2 lớp**: pre-check bằng `isRecordInUse()` (chặn sớm, UX tốt hơn — không cần đợi DB
trả lỗi) VÀ fallback bắt lỗi FK ở `catch` (phòng khi pre-check bỏ sót 1 bảng tham chiếu nào đó).

**4 nơi đã áp dụng** (tham chiếu khi cần thêm chỗ mới): `delKhachHang`→chặn nếu `ho_so.khach_hang_id`
đang dùng; `delDoiTac`→chặn nếu `ho_so.doi_tac_id` hoặc `doi_tac_phi.doi_tac_id` đang dùng;
`deleteDanhMuc` (dùng chung cho Nước đến/Mục đích/Đối tác qua hàm con `isDanhMucInUse`)→chặn nếu
`ho_so` hoặc `leads` đang dùng.

**⚠️ Khi thêm nút "Xóa" MỚI nào sau này** trên dữ liệu có thể bị bảng khác tham chiếu: PHẢI gọi
qua `isRecordInUse()` theo đúng mẫu trên. Các bảng "lá" không ai tham chiếu tới (khoản chi, xử lý
phát sinh/thành viên nhóm của hồ sơ, bài viết...) thì **không cần** — riêng `categories` (danh mục
bài viết) cũng không cần vì `posts.category_id` cho phép NULL (xóa danh mục thì bài viết tự
chuyển "Không chọn", không bị chặn — đây là thiết kế cố ý, khác với các trường hợp chặn ở trên).

## 15. Gộp màn "Tư vấn" + "Khách đăng ký" thành 1 màn hình duy nhất (2026-08)

**Bối cảnh:** 2 tab "Tư vấn" (📞) và "Khách đăng ký" (📋) trước đây CÙNG đọc/ghi 1 bảng `leads`
(khác bảng thì trùng dữ liệu với form đăng ký công khai ở `index.html`) nhưng lại có 2 bộ UI/filter
riêng — người dùng yêu cầu gộp lại thành 1 tab duy nhất, **giữ tên "Tư vấn"**, gồm đủ: thống kê +
bộ lọc + list + nút "+ Thêm tư vấn". Tab "Khách đăng ký" và mọi id/hàm riêng của nó
(`fStatus`/`fCountry`/`fSearch`/`statRow`/`leadsBody`/`leadsEmpty`/`renderLeads()`/
`updateLeadStatus()`/`exportCSV()`) đã bị xóa hẳn — không còn tồn tại trong `admin.html`.

**Thêm cột phân loại nguồn `nguon`** trên bảng `leads` (migration ở
`05_Database/02_supabase_setup_phase2.sql`, mục D): giá trị `'Từ Web'` (default cột — lead từ form
công khai `index.html` tự động có, **không cần sửa `index.html`**) hoặc `'Tự tạo'` (nhân viên tự
thêm qua dialog "Thêm tư vấn", `saveTuVan()` chỉ gán `nguon:'Tự tạo'` khi **TẠO MỚI**, sửa 1 dòng
có sẵn KHÔNG được gửi lại field này — tránh vô tình đổi nguồn gốc thật của dòng đang sửa). Dữ liệu
CŨ (trước khi có cột này) không thể suy luận chính xác nguồn gốc — **theo yêu cầu người dùng, toàn
bộ dữ liệu cũ được backfill thành `'Tự tạo'`** (bọc trong DO block kiểm tra cột chưa tồn tại, chỉ
chạy 1 lần duy nhất, không đụng tới dữ liệu mới về sau khi chạy lại file SQL).

**Màn "Tư vấn" sau khi gộp** gồm: `tvStatRow` (6 ô: Tổng lead/Chưa gọi/Đang tư vấn/Đã chốt/Từ
Web/Tự tạo) + bộ lọc `fTvStatus`/`fTvNguon`/`fTvCountry`/`fTvSearch` + nút Xuất CSV
(`exportTuVanCSV()`)/Tải lại/+ Thêm tư vấn + bảng `tvBody` (thêm cột "Nguồn" dạng pill màu, hàm
`nguonPillClass()`) + dialog "Thêm tư vấn" (`tvOverlay`, giữ nguyên như cũ).

**⚠️ Không tạo lại tab "Khách đăng ký" riêng nữa** nếu có yêu cầu liên quan đến lead từ web sau
này — mọi thứ giờ nằm trong tab "Tư vấn" duy nhất, phân biệt qua cột "Nguồn".

## 16. Bộ lọc "Trạng thái" dạng chip checkbox (màn Hồ sơ, 2026-08)

Màn "Hồ sơ" đổi bộ lọc "Trạng thái" từ dropdown 1 lựa chọn sang **chip checkbox nhiều lựa chọn**
(`#fHsStatusGroup`, class `.chk-chip`) — mỗi chip dùng đúng màu pill trạng thái tương ứng
(`chip-dxl`/`chip-dn`/`chip-dau`/`chip-rot`/`chip-huy`, tô màu khi `.is-checked` qua
`onHsStatusChipChange()`). **Mặc định khi vào màn hình**: chỉ "Đang xử lý" + "Đã nộp" được tick
(khai báo thẳng bằng thuộc tính `checked` trong HTML, không cần JS). Bỏ tick hết → danh sách rỗng
(không tự hiểu là "hiện tất cả"). Nút **"Reset" trả về đúng mặc định** (Đang xử lý + Đã nộp), theo
đúng nghĩa "về lại trạng thái mặc định của màn hình" — không phải "bật hết 5 trạng thái".

**Nếu cần thêm 1 bộ lọc trạng thái nhiều lựa chọn tương tự ở màn khác sau này**: copy mẫu
`.hs-status-filter`/`.chk-chip` + hàm `onHsStatusChipChange()`/`checkedHsStatuses()` trong
`02_Source/admin.html`, đổi màu theo đúng pill trạng thái của màn đó, không cần dùng lại đúng tên
biến/id nhưng nên giữ cùng cơ chế (class `is-checked` toggle qua JS, không dùng `:has()` CSS để an
toàn với trình duyệt cũ hơn).

## 17. "Tab cuộn cố định" — CHUẨN BẮT BUỘC cho mọi màn hình list mới (2026-08)

**Quy tắc:** ở mọi màn hình dạng "list" (có tiêu đề + bộ lọc/tìm kiếm/thống kê + bảng kết quả),
khi danh sách dài phải cuộn thì **CHỈ phần bảng kết quả cuộn**, còn tiêu đề/bộ lọc/tìm kiếm/thống
kê phải **đứng yên**, không bị cuộn mất khỏi màn hình. Đây là hành vi bắt buộc áp dụng cho MỌI màn
hình list hiện có và **mọi màn hình list mới thêm sau này** — không phải chỉ 1-2 màn cụ thể.

**Cách làm — class `tab-scroll`:** thêm class này vào thẻ `<section id="tab-xxx">` (giữ nguyên
class `hidden` đang có, vd `class="hidden tab-scroll"`). Điều kiện bắt buộc để hoạt động đúng:
- `.tbl-wrap` (khung chứa bảng `<table>`) phải là **phần tử con CUỐI CÙNG** của section — mọi thứ
  khác (tiêu đề, `.filters`, `.stat-row`...) đứng TRƯỚC nó.
- Không cần viết thêm CSS riêng — cơ chế chung (`.tab-scroll{display:flex;flex-direction:column;
  flex:1}`, `.tab-scroll>*{flex-shrink:0}`, `.tab-scroll>.tbl-wrap{flex:1;overflow-y:auto}`) tự
  động áp dụng, đã định nghĩa 1 lần trong CSS gần khối `/* table */`.

**Cơ chế nền (không cần hiểu để dùng, chỉ cần biết nếu phải sửa sâu hơn):** `#appView` cố định cao
đúng `100vh` (`overflow:hidden`, không cuộn cả trang nữa), `main` là flex-column chiếm phần còn
lại sau header+tabs, mỗi `<section>` con chiếm hết chiều cao của `main`. Section nào có class
`tab-scroll` sẽ tự chia: phần đầu (tiêu đề/lọc/thống kê) giữ nguyên kích thước, phần `.tbl-wrap`
giãn ra chiếm hết chỗ còn lại và tự cuộn riêng bên trong.

**7 nơi đã áp dụng**: Tư vấn, Hồ sơ, Thông tin khách hàng, Tài chính, Đại lý ủy thác, Bài viết,
Danh mục bài viết. **2 nơi CHỦ Ý không áp dụng** (giữ cuộn trang bình thường như cũ, vì không phải
dạng "list + bộ lọc"): Dashboard (biểu đồ Chart.js + bảng nhỏ, không có tiêu chí bắt buộc phải
khoá), Cài đặt chung (lưới thẻ danh mục, không có bảng `.tbl-wrap`).

**⚠️ Đã thử và KHÔNG áp dụng**: dòng tiêu đề cột (`<thead>`) dính cứng (sticky) khi cuộn bên trong
`.tbl-wrap` — về lý thuyết `position:sticky` trên `<th>` sẽ làm được, nhưng thực tế không hoạt động
ổn định do giới hạn của trình duyệt với bảng HTML (`border-collapse` phá vỡ ngữ cảnh sticky của
ô bảng — lỗi/giới hạn đã biết của CSS Table). Không cố sửa lại việc này trừ khi có yêu cầu rõ ràng
và đã kiểm chứng kỹ trên trình duyệt thật (không chỉ trình duyệt giả lập).

**⚠️ QUAN TRỌNG — TẮT HẲN trên điện thoại (≤700px), 2026-08:** cơ chế "cuộn cố định" ở trên CHỈ
dành cho desktop (đủ chỗ ngang lẫn dọc). Trên điện thoại, nếu 1 màn có nhiều ô thống kê + nhiều bộ
lọc (ví dụ Tư vấn: 6 ô thống kê + 4 bộ lọc + 3 nút) thì phần "đứng yên" đó cao gần hết màn hình,
chỉ còn 1 khe rất nhỏ để xem list — trải nghiệm rất tệ (phát hiện khi test thật ở khổ ~412×915).
Đã thêm `@media(max-width:700px)` TẮT HẲN cơ chế `tab-scroll` (trả `#appView`/`main`/`.tab-scroll`
về `display:block` bình thường), quay lại đúng kiểu cuộn nguyên trang như trước khi có tính năng
này — tiêu đề/thống kê/lọc cuộn CÙNG với list, chỉ có `header.bar`/`.tabs` vẫn dính khi cuộn trang
(`position:sticky` không đổi). **Không tự ý bật lại cơ chế cuộn cố định trên mobile** trừ khi đã
có giải pháp cụ thể xử lý được trường hợp nhiều ô thống kê/bộ lọc (vd: rút gọn/thu hẹp thống kê,
làm bộ lọc dạng thu gọn/accordion...) và đã test thật trên khổ điện thoại nhỏ.

**⚠️ Thanh điều kiện search (`.filters-hoso`, dùng ở Hồ sơ + Tài chính) — KHÔNG bọc scroll ngang
(2026-08, sửa lại):** ban đầu ép `flex-wrap:nowrap` + cuộn ngang khi không đủ chỗ, nhưng sau khi
gộp thêm tiêu đề + chip trạng thái vào chung dòng (mục 16), hàng bị dài ra và cuộn ngang gây khó
chịu — đã đổi lại thành `flex-wrap:wrap` bình thường: đủ chỗ thì 1 dòng, không đủ thì tự xuống
dòng, không còn thanh cuộn ngang nào ở đây nữa.

**3 sửa lỗi bổ sung khi tắt cơ chế cuộn cố định trên mobile ở trên (2026-08, phát hiện qua test
thật ở khổ ~412×915):**
1. **Chip trạng thái (Hồ sơ) bị tràn ngang trên điện thoại**: nhóm `#fHsStatusGroup` là 1 flex
   item bên trong `.filters-hoso` — mặc định (`flex-shrink:0`, không có `flex-basis`/`min-width`)
   nó giữ nguyên bề ngang "đủ hiện cả 5 chip 1 hàng" bất kể màn hình hẹp cỡ nào, nên tràn ra ngoài
   thay vì tự xuống dòng. Đã fix bằng `flex-basis:100%;min-width:0` trong khối
   `@media(max-width:700px)` — ép nhóm chip chiếm trọn 1 dòng riêng thì `flex-wrap:wrap` bên
   trong nó mới nhận đúng bề ngang màn hình để xuống dòng. **Nếu sau này thêm 1 nhóm chip/flex
   con nào khác có khả năng tràn ngang tương tự trên mobile**: áp dụng đúng 2 thuộc tính này.
2. **Icon lịch trên `<input type="date">` hiện mũi tên thay vì hình lịch trên 1 số điện
   thoại/trình duyệt di động** (icon gốc do hệ điều hành/trình duyệt tự vẽ, không đồng nhất giữa
   các thiết bị). Đã tự vẽ icon lịch riêng bằng SVG qua
   `input[type=date]::-webkit-calendar-picker-indicator{background:url("data:image/svg+xml,...")}`
   — CHỈ áp dụng trong `@media(max-width:700px)`, desktop giữ nguyên icon lịch mặc định của Chrome
   (đã đúng, không cần đổi). Lưu ý: `getComputedStyle(el, '::-webkit-calendar-picker-indicator')`
   không phản ánh đúng style này qua DevTools/JS (giới hạn đã biết của pseudo-element nội bộ
   trình duyệt cho input date) — muốn kiểm tra phải xem trực tiếp bằng mắt trên thiết bị thật.
   ⚠️ **ĐÃ LỖI THỜI (Phase 5, 2026-08-04):** không còn field `type="date"` nào trong `admin.html`
   nữa (đổi hết sang mask `dd/mm/yyyy`, xem mục 19) — CSS fix icon này đã bị XÓA khỏi code, giữ
   lại đoạn mô tả trên chỉ để hiểu lịch sử, không áp dụng lại.
3. **Nút "+ Thêm..." (đăng ký mới) bị cuộn mất khi lướt list dài trên điện thoại** — hệ quả của
   việc tắt cuộn cố định (mục ⚠️ TẮT HẲN ở trên): giờ cả trang cuộn cùng nhau nên nút cũng cuộn
   theo. Đã thêm class dùng chung `.btn-add-fab` (gắn thêm vào 6 nút đã có, không đổi hành vi
   `onclick`): `openHoSoModal()`, `openTvModal()`, `openKhachHangModal()`, `openChiModal()`,
   `openDoiTacModal()`, `openPostModal()`. Trong `@media(max-width:700px)`: `position:fixed;
   top:128px;right:16px` (128px = đúng chiều cao header 58px + tabs 58px + đệm 12px) — nút nổi cố
   định góc phải, luôn bấm được dù cuộn tới đâu. Trên desktop giữ `position:static` (không cần vì
   đã đứng yên sẵn nhờ cơ chế `tab-scroll`). **Khi thêm màn list mới có nút "+ Thêm..." tương tự**:
   gắn thêm class `btn-add-fab` vào đúng nút đó để tự động có hành vi này trên mobile.

## 18. Dialog "Bảng phí đại lý" nâng cấp + tự động điền phí khi tạo Hồ sơ (Phase 5, 2026-08-04)

**Bảng phí đại lý** (`#dtFeeOverlay`, tab Đại lý ủy thác) — nhóm "Thêm mức phí mới" đổi từ nhập
tay tự do sang có cấu trúc, để tra cứu được bằng code (phục vụ tự động điền ở Hồ sơ, xem dưới):
- "Nơi nộp": đổi từ ô nhập chữ sang `<select>` cố định 3 giá trị (Đà Nẵng/Hà Nội/TP Hồ Chí Minh)
  — **không phải danh mục ở Cài đặt chung**, chỉ là danh sách cứng trong HTML, không có nút
  thêm/sửa/xóa. Không bắt buộc chọn.
- "Đất nước" (mới, cột `nuoc_id`) + "Diện visa" (đổi từ ô nhập chữ `dien_visa` sang cột FK
  `muc_dich_id`): 2 droplist lấy từ danh mục Cài đặt chung (`danh_muc_nuoc`/`danh_muc_muc_dich`,
  dùng lại `optsFromDanhMuc()` đã có) — **cả 2 bắt buộc chọn**. Cột `dien_visa` cũ vẫn còn trong
  DB (không xóa) chỉ để hiển thị fallback cho các dòng phí tạo TRƯỚC Phase 5 (chưa có
  `muc_dich_id`) — không còn được ghi giá trị mới từ UI nữa.
- "Mức phí" đổi tên thành **"Phí ủy thác"** (cột đổi tên `muc_phi`→`phi_uy_thac`), thêm mới **"Phí
  lãnh sự"** (cột `phi_lanh_su`) — tách riêng 2 loại phí trước đây gộp chung 1 cột. Cả 2 dùng
  `money-input`/`onMoneyInput()`/`formatMoney()`/`unformatMoney()` dùng chung (mục 5,
  `01_Docs/10_Chuan_Dialog_Chung.md`) — không bắt buộc, để trống lưu `null`.
- "Áp dụng từ": vẫn giữ nguyên ý nghĩa, đổi cách nhập theo mục 19 (mask `dd/mm/yyyy`).
- "Ghi chú": giữ nguyên như cũ.

Migration: `05_Database/05_supabase_setup_phase5.sql` — thêm `nuoc_id`/`muc_dich_id`/`phi_lanh_su`
(nullable, không ép NOT NULL vì bảng đã có dữ liệu thật từ trước), đổi tên `muc_phi`→`phi_uy_thac`.
**Người dùng cần tự chạy file này trong Supabase SQL Editor** trước khi dùng — Claude Code không
có quyền chạy SQL trực tiếp (xem mục 5, quy trình deploy).

**Tự động điền phí khi tạo Hồ sơ (dialog `#hoOverlay`):** khi cả 3 select "Nước đến" (`hoNuoc`),
"Mục đích" (`hoMucDich`), "Đại lý ủy thác" (`hoDoiTac`) đều có giá trị, mỗi lần đổi 1 trong 3 field
này (`onchange`) sẽ gọi hàm `lookupDoiTacPhi()` — tra `doi_tac_phi` khớp đúng
`doi_tac_id`+`nuoc_id`+`muc_dich_id`, lấy dòng có `ngay_ap_dung_tu` MỚI NHẤT (không lọc theo "Nơi
nộp" vì dialog Hồ sơ không có field này), rồi tự điền: `phi_lanh_su`→ô "Lệ phí lãnh sự (đơn
giá/người)" (`hoChiLanhSu`), `phi_uy_thac`→ô "Đại lý/CTV (đơn giá/người)" (`hoChiDoiTacCtv`). 2 ô
này **vẫn sửa tay được** sau khi tự điền — nhưng hễ chọn lại 1 trong 3 field trên thì bị **ghi đè**
lại theo giá trị tra được mới (đây là hành vi có chủ đích theo yêu cầu, không phải bug). Không tìm
thấy dòng phí khớp → để trống 2 ô (không giữ giá trị cũ, tránh gán nhầm phí của tuyến khác).
Lưu ý: gán `.value` bằng JS lúc `openHoSoModal()` mở dialog (sửa hồ sơ có sẵn) **không** tự bắn
`onchange`, nên không vô tình ghi đè phí đã lưu khi chỉ đang xem/sửa các field khác.

## 19. Đảo lại quyết định định dạng ngày — quay về mask `dd/mm/yyyy` (Phase 5, 2026-08-04)

**Đây là lần đổi THỨ 2** cho toàn bộ field ngày trong `admin.html` (Phase 3 dùng mask →
Phase 4 đổi sang `type="date"` chuẩn HTML5 → **Phase 5 (hiện tại) đổi lại về mask**). Đọc kỹ
`01_Docs/10_Chuan_Dialog_Chung.md` mục 9 (đã viết lại toàn bộ, có bảng lịch sử 3 giai đoạn) trước
khi động vào bất kỳ field ngày nào — **không tự ý đổi sang `type="date"` lại lần thứ 3** trừ khi
người dùng yêu cầu rõ ràng.

Lý do đổi lại: `type="date"` lưu ISO đúng, nhưng **hiển thị** trong ô do trình duyệt/OS người dùng
tự quyết theo locale máy đó — không ép được `dd/mm/yyyy` từ code, máy đặt tiếng Anh vẫn ra
`mm/dd/yyyy`. Người dùng xác nhận muốn hiện đúng `dd/mm/yyyy` trên MỌI máy, chấp nhận mất icon
lịch có sẵn của trình duyệt để đổi lấy điều đó.

**Khác bản mask cũ ở Phase 3** (để không lặp lại lỗi "chỉ nhận dd/mm" nghi từng gặp): mọi hàm
lưu/thêm (`saveHoSo`, `saveChi`, `saveTuVan`, `saveKhachHang`, `addDoiTacPhi`, `addXlps`,
`loadTaiChinh`) đều tự tách riêng bước "đọc `.value.trim()` để biết field có đang trống hay không"
và "gọi `toISODate()` để biết có hợp lệ hay không" — **không bao giờ** âm thầm thay ngày sai/để
trống bằng ngày hôm nay, luôn báo lỗi rõ bằng `toast(...,'err')` và chặn lưu khi người dùng gõ dở
hoặc gõ sai. 12 field ngày hiện có, 3 hàm dùng chung `onDateInput()`/`fromISODate()`/`toISODate()`
— xem chi tiết đầy đủ + mẫu code ở `01_Docs/10_Chuan_Dialog_Chung.md` mục 9.
