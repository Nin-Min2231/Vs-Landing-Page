# CLAUDE.md — Context dự án cho Claude Code

> File này dành cho AI agent (Claude Code). Đọc file này trước khi sửa bất kỳ gì trong dự án. Người dùng (chủ dự án) không biết lập trình — luôn giải thích thay đổi bằng ngôn ngữ dễ hiểu, không thuật ngữ khi báo cáo lại.

## 1. Dự án là gì

Landing page dịch vụ **Visa đa quốc gia** cho công ty **Top Visa 5S** (Đà Nẵng, đổi tên từ "Top Visa"
2026-08-07 — "5S" = Solution/Simple/Speed/Secure/Success, xem mục 32), mục tiêu **Lead Generation**
(thu thập khách hàng tiềm năng qua form đăng ký tư vấn). Có kèm trang quản trị đơn giản để xem/xuất
lead và quản lý bài viết.

Toàn bộ tài liệu thiết kế (yêu cầu, sitemap, wireframe, design system, kế hoạch, test case, hướng dẫn deploy) nằm ở `01_Docs/` — đọc `01_Docs/Visa-Landing-Page_Tai_lieu.xlsx` (1 file Excel gộp cả 7 tài liệu, có màu sắc dễ đọc) hoặc từng file `.md` tương ứng nếu cần xem sơ đồ Mermaid/wireframe ASCII chi tiết.

## 2. Trạng thái hiện tại (2026-08-04)

| Phase | Trạng thái |
|---|---|
| 1. Phân tích yêu cầu | ✅ Xong |
| 2. Thiết kế (sitemap/wireframe/design system) | ✅ Xong |
| 3. Front-end landing page (`index.html`) | ✅ Xong, đã gắn thông tin thật (logo, hotline, Zalo, Facebook, địa chỉ) + USP + slider đánh giá thật + section Tin tức + SEO (canonical/OG/JSON-LD/robots.txt/sitemap.xml, xem mục 12) |
| 4. Back-end (Supabase) | ✅ **Đã chạy thật** — `SUPABASE_URL`/`SUPABASE_ANON_KEY` đã điền giá trị thật trong cả 2 file HTML |
| 5. Admin CRM (`admin.html`) | ✅ Xong nhiều đợt (Phase 2→7, xem README.md) — Dashboard, Tư vấn (đã gộp "Khách đăng ký"), Hồ sơ, Thông tin khách hàng (có phân trang), Tài chính, Đại lý ủy thác, Cài đặt chung (Nước đến mở rộng + Dịch vụ Visa các quốc gia), Danh mục bài viết, sort theo cột cho mọi màn list |
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
│   ├── worker.js                   ← Cloudflare Worker (route động + job nền, mục 33/T1/T9) — KHÔNG public
│   ├── wrangler.toml                ← cấu hình deploy Cloudflare — KHÔNG public
│   ├── package.json                 ← chỉ khai devDependency wrangler — KHÔNG public
│   └── public/                     ← ⭐ (2026-09) CHỈ thư mục này được `[assets]` phục vụ ra Internet, xem mục 52
│       ├── index.html               ← landing page (HTML+CSS+JS trong 1 file)
│       ├── admin.html               ← trang quản trị (HTML+CSS+JS trong 1 file, phần lớn công sức nằm ở đây)
│       ├── robots.txt, sitemap.xml  ← SEO (mục 12)
│       ├── admin-manifest.webmanifest, sw-admin.js ← PWA admin + Web Push (mục 33)
│       └── assets/                  ← logo.png, favicon.png, qr-zalo.png (đã xử lý, không sửa lại)
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
│   ├── 05_supabase_setup_phase5.sql ← Phase 5: doi_tac_phi thêm nuoc_id/muc_dich_id/phi_lanh_su, đổi tên muc_phi→phi_uy_thac
│   ├── 06_supabase_setup_phase6.sql ← Phase 6: danh_muc_nuoc thêm le_phi/thoi_gian_xet_duyet/checklist/ghi_chu
│   └── 07_supabase_setup_phase7.sql ← Phase 7: ho_so.doi_tac_id bỏ NOT NULL, posts thêm phan_loai, bảng mới dich_vu_gia
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
| Badge hero | "5000+ hồ sơ", "98% đậu" | ✅ Đã xong (2026-09-01, T7 kế hoạch SEO) — PM cấp số thật, xem mục 49 |
| Section dịch vụ | Giá "Từ x đ" mỗi quốc gia | ⬜ Vẫn thiếu bảng giá THẬT — nhưng từ Phase 7 (2026-08-06) đã có nơi để PM tự cập nhật (admin.html → Cài đặt chung → "Dịch vụ Visa các quốc gia", xem mục 31), không cần Claude Code sửa code nữa. Số hiện tại vẫn là placeholder cũ. |
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

**5 nơi đã áp dụng** (tham chiếu khi cần thêm chỗ mới): `delKhachHang`→chặn nếu `ho_so.khach_hang_id`
đang dùng; `delDoiTac`→chặn nếu `ho_so.doi_tac_id` hoặc `doi_tac_phi.doi_tac_id` đang dùng;
`deleteDanhMuc` (dùng chung cho Nước đến/Mục đích/Đối tác qua hàm con `isDanhMucInUse`)→chặn nếu
`ho_so` hoặc `leads` đang dùng; `delCategory` ("Danh mục bài viết")→chặn nếu `posts.category_id`
đang dùng.

**⚠️ Khi thêm nút "Xóa" MỚI nào sau này** trên dữ liệu có thể bị bảng khác tham chiếu: PHẢI gọi
qua `isRecordInUse()` theo đúng mẫu trên. Các bảng "lá" không ai tham chiếu tới (khoản chi, xử lý
phát sinh/thành viên nhóm của hồ sơ, `dich_vu_gia`...) thì **không cần**.

**⚠️ Đảo lại quyết định cũ (Phase 7, 2026-08-06):** trước đây `categories` (danh mục bài viết)
CHỦ Ý không chặn xóa (`posts.category_id` cho phép NULL, xóa danh mục thì bài viết tự chuyển
"Không chọn") — PM yêu cầu đổi lại thành CHẶN xóa giống mọi danh mục khác trong hệ thống, đã sửa
`delCategory` theo đúng mẫu `isRecordInUse()` ở trên. Không tự ý đảo lại lần nữa trừ khi có yêu
cầu rõ ràng.

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

## 20. Icon lịch tùy chỉnh (custom date-picker) cho ô mask `dd/mm/yyyy` (2026-08-04)

**Bối cảnh:** sau khi đổi 12 field ngày sang mask chữ (mục 19), người dùng mất icon lịch bấm chọn
có sẵn của `<input type="date">`. Đã thêm lại 1 popup lịch mini tự viết (vanilla JS, không dùng
thư viện ngoài — đúng triết lý dự án) để vừa gõ tay được vừa bấm chọn được.

**Cách hoạt động — KHÔNG cần sửa từng field ngày trong HTML:**
- `initDatePickers()` (gọi 1 lần lúc script chạy, gần `initTaiChinhFilters()`) tự tìm MỌI
  `<input oninput="onDateInput(this)">` có sẵn trong trang — đây là dấu hiệu nhận biết 1 field là
  "ô ngày mask", đúng theo mẫu chuẩn ở mục 9 — rồi tự bọc thêm 1 `<div class="date-mask-wrap">`
  quanh input + thêm 1 `<button class="date-pick-btn">📅</button>` bên cạnh.
  ⚠️ **Sửa lại 2026-08-04 (cùng ngày, theo phản hồi PM):** icon 📅 ban đầu làm dạng nút RIÊNG đứng
  cạnh ô nhập (giống `.kh-pick-wrap`/`.kh-pick-btn` của ô "Tên khách hàng") — PM phản hồi nút quá
  to, đứng ngoài ô nhìn thô, làm ô ngày mất chỗ hiển thị nên bị cắt mất phần năm. Đã đổi
  `.date-mask-wrap` sang `position:relative` + icon `position:absolute` LỒNG BÊN TRONG ô input
  (giống icon lịch mặc định của trình duyệt), input dùng `padding-right:30px` chừa chỗ cho icon
  24×24px, không còn chiếm thêm bề ngang. **Bug đi kèm phát hiện lúc sửa:** input lúc đó bị co lại
  ~212px thay vì đúng 135px do dính đè bởi rule cũ `.filters input,.filters select{width:auto}`
  (mục "filters" — dùng cho MỌI ô trong thanh lọc, độ ưu tiên cao hơn rule chung
  `input{width:100%}`) — đã thêm `width:100%` tường minh vào `.date-mask-wrap input` để thắng rule
  đó. Cũng xóa luôn rule chết `.filters-hoso input[type=date]{width:145px}` (không còn input nào
  `type=date` để khớp từ khi đổi qua mask ở mục 19). 4 field lọc (`fHsTuNgay`/`fHsDenNgay`/
  `tcFrom`/`tcTo`) tăng width từ 110px → 135px để chữ "dd/mm/yyyy" đủ chỗ hiện cùng icon.
- **Field ngày MỚI thêm sau này** (đúng mẫu HTML ở mục 9: `oninput="onDateInput(this)"`) sẽ
  **TỰ ĐỘNG có icon lịch**, không cần đụng gì thêm ở đây — nếu field ngày mới KHÔNG tự có icon,
  kiểm tra lại đã copy đúng `oninput="onDateInput(this)"` (đúng y nguyên chuỗi, không thêm tham số
  khác) chưa, vì đó là selector duy nhất `initDatePickers()` dùng để nhận diện.
- Bấm nút 📅 mở 1 popup lịch DUY NHẤT dùng chung cho toàn trang (`#datePickerPopup`, không tạo 1
  popup riêng cho mỗi field, biến `DP_TARGET` giữ input đang chọn) — tự đọc `.value` hiện tại qua
  `toISODate()` để hiện đúng tháng/năm, mặc định tháng hiện tại nếu trống/không hợp lệ. Chọn ngày
  → gán `.value` = `dd/mm/yyyy` + tự bắn cả sự kiện `input` và `change` (`dispatchEvent`) để MỌI
  `onchange`/`oninput` đã gắn sẵn trên field đó (vd `renderHoSo()` ở bộ lọc Hồ sơ) vẫn chạy đúng y
  như khi gõ tay — đã test xác nhận qua Claude Browser. 3 nút cuối popup: "Hôm nay" (chọn luôn ngày
  hôm nay), "Xóa" (xóa trắng field — dùng cho field không bắt buộc), "Đóng" (đóng không chọn gì).
  Tự đóng khi: bấm ra ngoài popup, nhấn `Esc`, cuộn trang, đổi kích thước màn hình.
- CSS: `.date-mask-wrap`/`.date-pick-btn`/`.date-picker-popup`/`.dp-*` (khu vực gần
  `.kh-pick-wrap` trong `<style>`), dùng lại đúng biến màu `--p`/`--pl`/`--pd`/`--mut`/`--bd`/`--sh`
  có sẵn, không tự bịa màu mới.
- **⚠️ Giới hạn đã biết:** popup tự định vị bằng `getBoundingClientRect()` +
  `window.innerWidth/innerHeight` (kẹp trong viewport, ưu tiên hiện dưới nút, tự lật lên trên nếu
  không đủ chỗ dưới) — đây là kỹ thuật chuẩn, đã test đúng logic, nhưng **không thể verify bằng
  mắt qua Claude Browser trong phiên viết tính năng này** vì công cụ browser tự động trả
  `window.innerWidth`/`innerHeight` = 0 (môi trường sandbox không compositing khung nhìn thật) —
  đã kiểm chứng kỹ đây là giới hạn của công cụ test, không phải bug code (mọi hành vi khác: mở
  popup, vẽ đúng lưới ngày, chọn ngày, chuyển tháng/năm, nút Hôm nay/Xóa, đóng khi click ra
  ngoài/Esc, bắn đúng onchange... đều đã test qua và đúng). Nên tự tay thử trên trình duyệt thật
  ở vài vị trí field khác nhau (đặc biệt field gần mép dưới/phải màn hình) để chắc chắn 100%.

## 21. Nút "Xóa" cho từng dòng phí trong Bảng phí đại lý (2026-08-04)

Bảng "Các mức phí đã có" (`#dtFeeBody`, dialog `#dtFeeOverlay`) trước đây chỉ xem, không xóa được
từng dòng. Đã thêm cột "Thao tác" + nút "Xóa" (`delDoiTacPhi(id)`).

**Cách chặn xóa khác với mọi nơi khác trong hệ thống (đọc kỹ để không nhầm mẫu với mục 14):**
`ho_so` **KHÔNG lưu id của dòng phí** đã dùng để tự điền lúc tạo hồ sơ (mục 18) — chỉ copy 2 giá
trị số tiền qua rồi thôi, không giữ liên kết ngược — nên **không có FK thật** giữa `ho_so` và
`doi_tac_phi` để CSDL tự chặn. Thay vào đó, hàm `isDoiTacPhiInUse(fee)` tự kiểm tra: có tồn tại
Hồ sơ nào khớp ĐÚNG cả 3 giá trị `doi_tac_id` + `nuoc_id` + `muc_dich_id` của dòng phí đang định
xóa không (bỏ qua "Nơi nộp" — cùng lý do đã giải thích ở mục 18, dialog Hồ sơ không có field này).
Nếu có → chặn xóa, báo "Mức phí này đã có hồ sơ đăng ký theo đúng Đại lý + Nước đến + Mục đích nên
không thể xóa." Dòng phí tạo TRƯỚC Phase 5 (thiếu `nuoc_id`/`muc_dich_id`) **luôn cho xóa tự do**
— không tra được theo tổ hợp này nên không thể xác định "đang dùng" hay không.

**Hệ quả cần biết:** nếu 1 đại lý có NHIỀU dòng phí cùng tổ hợp Nước đến+Mục đích (khác Nơi nộp
hoặc khác đợt "Áp dụng từ" — lịch sử tăng/giảm giá theo thời gian) và ĐÃ có ít nhất 1 Hồ sơ dùng
tổ hợp đó, thì **TẤT CẢ** các dòng phí cùng tổ hợp đều bị chặn xóa (không phân biệt được chính
xác Hồ sơ cũ đã dùng đúng dòng giá nào tại thời điểm tạo) — đây là đánh đổi chấp nhận được để đơn
giản hóa, giống cách các nơi khác trong hệ thống cũng chặn rộng hơn mức cần thiết một chút để đổi
lấy an toàn dữ liệu (xem mục 14). Không có fallback bắt lỗi FK ở `catch` như mẫu `isRecordInUse()`
(mục 14) vì không có ràng buộc FK thật nào để CSDL trả lỗi — pre-check là lớp chặn DUY NHẤT.

## 22. Mở rộng danh mục "Nước đến" — dialog riêng + bảng full-width (Phase 6, 2026-08)

**Bối cảnh:** "Nước đến" cần thêm 4 field (Lệ phí, Thời gian xét duyệt, Checklist, Ghi chú) nên
không còn phù hợp với list tên đơn giản (`cat-item`) + `renameOverlay` dùng chung cho 3 danh mục
như trước — đã tách riêng thành 1 khối full-width (`.cat-block-full`, class CSS mới) đứng TRÊN
`.cat-grid` (Mục đích + Đối tác vẫn giữ nguyên list đơn giản, xếp cạnh nhau như cũ bên dưới).

**Schema:** `05_Database/06_supabase_setup_phase6.sql` — thêm 4 cột nullable vào `danh_muc_nuoc`:
`le_phi` (numeric), `thoi_gian_xet_duyet` (text), `checklist` (text, giới hạn 1000 ký tự ở UI qua
`maxlength`, không ép ở DB), `ghi_chu` (text, giới hạn 500 ký tự tương tự).

**Dialog riêng `#nuocOverlay`** (`openNuocModal()`/`closeNuocModal()`/`saveNuocModal()`, hàm hiển
thị bảng `renderNuocTable()`) theo đúng chuẩn `dlg-*`. **Quyết định UX quan trọng:** nút mở dialog
trong bảng list đặt tên **"Chi tiết"** (không phải "Sửa") — vì đây là 1 dialog DÙNG CHUNG cho cả
xem lẫn sửa (xem đủ nội dung Checklist/Ghi chú dù bị cắt "..." ở list, sửa được luôn nếu cần),
không tạo thêm 1 dialog xem-riêng chỉ đọc nào khác — quyết định này chưa hỏi lại người dùng trước
khi làm, nếu muốn tách riêng "xem" và "sửa" thành 2 luồng khác nhau thì cần yêu cầu rõ.

**Truncate text dài trong list:** class dùng chung mới `.text-trunc` (giống hệt `.addr-trunc` đã
có cho cột Địa chỉ, chỉ đổi tên cho tổng quát hơn — không dùng lại `.addr-trunc` vì tên gợi ý riêng
cho địa chỉ) — `max-width` cố định + `text-overflow:ellipsis`, hiện đủ khi hover qua `title="..."`.

**Nút Xóa** vẫn dùng lại `deleteDanhMuc('nuoc', id)` + `isDanhMucInUse('nuoc', item)` có sẵn từ
trước (mục 14) — không đổi gì, vẫn chặn xóa nếu `ho_so.nuoc_id` hoặc `leads.country` đang tham
chiếu tới nước đó.

## 23. Cảnh báo "dữ liệu chưa lưu" khi đóng dialog — cơ chế dùng chung cho MỌI dialog (Phase 6, 2026-08)

**Yêu cầu:** mở 1 dialog bất kỳ, nếu có sửa dữ liệu rồi bấm "Đóng lại" hoặc nút X mà CHƯA bấm Lưu,
phải hiện popup xác nhận: *"Dữ liệu đã thay đổi nhưng chưa lưu. Bạn muốn thoát mà không lưu lại
không?"* — nút **"Đồng ý"** (đóng luôn, không lưu) và **"Không thoát"** (giữ dialog, cho nhập tiếp).

**Cách hoạt động — 3 hàm dùng chung** (định nghĩa trong `admin.html`, ngay sau `showNotifyPopup()`):
```js
snapshotDialog(overlayId)      // chụp lại giá trị TOÀN BỘ input/select/textarea trong overlay đó
isDialogDirty(overlayId)       // so sánh giá trị hiện tại với bản đã chụp — true nếu có khác biệt
confirmCloseDialog(overlayId, doClose)  // nếu dirty thì hỏi xác nhận, "Không thoát" thì KHÔNG gọi doClose
```
`dialogSnapshotValue()` (hàm nội bộ) tự nối toàn bộ `.value` (hoặc `.checked` với checkbox/radio)
của mọi input/select/textarea NẰM TRONG overlay đó thành 1 chuỗi để so sánh — không cần khai báo
tay từng field, tự động bắt được MỌI field kể cả field ẩn (`type="hidden"`) hay sub-form lồng bên
trong (vd ô "+ Thêm thành viên" trong dialog Hồ sơ).

**Cách áp dụng cho 1 dialog (BẮT BUỘC cho dialog mới sau này, xem `01_Docs/10_Chuan_Dialog_Chung.md`
mục 9.1):**
1. Cuối hàm `openXxxModal()` (SAU KHI đã gán xong `.value` cho mọi field): gọi `snapshotDialog('xxxOverlay')`.
2. Hàm `closeXxxModal()` đổi từ tự đóng trực tiếp sang gọi `confirmCloseDialog('xxxOverlay', ()=>{...code đóng gốc...})`.
3. Trong hàm `saveXxx()` — **NGAY SAU KHI lưu API thành công, TRƯỚC KHI gọi `closeXxxModal()`** —
   gọi lại `snapshotDialog('xxxOverlay')` để cập nhật baseline = dữ liệu vừa lưu. **Bước này BẮT
   BUỘC không được quên** — nếu bỏ qua, đóng dialog ngay sau khi lưu thành công sẽ bị hiểu nhầm là
   "còn thay đổi chưa lưu" (vì dữ liệu hiện tại luôn khác baseline lúc MỞ dialog) và hiện cảnh báo
   thừa ngay sau khi vừa lưu xong — đã tự kiểm chứng lỗi này lúc code rồi sửa đúng.
4. Với dialog có thao tác lưu NGAY không qua nút Lưu chung của dialog (vd "+ Thêm mức phí" ở Bảng
   phí đại lý, hay "+ Thêm"/Xóa/đổi trạng thái ở Thành viên nhóm/Xử lý phát sinh trong dialog Hồ
   sơ) — cũng phải gọi lại `snapshotDialog()` ngay sau khi thao tác đó lưu thành công, cùng lý do.

**9 dialog đã áp dụng đầy đủ:** `tvOverlay`, `hoOverlay` (+ 5 hàm con: `addThanhVien`/`delThanhVien`/
`addXlps`/`delXlps`/`updateXlpsStatus`), `dtOverlay`, `dtFeeOverlay` (+ `addDoiTacPhi`/`delDoiTacPhi`),
`postOverlay`, `renameOverlay`, `chiOverlay`, `khOverlay`, `nuocOverlay`.

**KHÔNG áp dụng** cho `khPickOverlay` (dialog "Chọn khách hàng" — chỉ tìm kiếm/chọn 1 dòng có sẵn,
không phải form nhập liệu cần lưu) và các popup `confirmOverlay`/`notifyOverlay`/`datePickerPopup`
(bản thân chúng đã là popup xác nhận/tiện ích, không phải dialog dữ liệu).

**Đã test kỹ qua Claude Browser** (giả lập DOM, không cần đăng nhập thật): mở dialog không sửa gì
rồi đóng → đóng thẳng không hỏi; sửa 1 field rồi đóng → hiện đúng popup với đúng 2 nút; bấm "Không
thoát" → dialog giữ nguyên, dữ liệu đã gõ không mất; bấm "Đồng ý" → đóng, dữ liệu KHÔNG được lưu;
lưu thành công rồi tự đóng → KHÔNG hiện cảnh báo thừa (đã test cả `nuocOverlay` lẫn `hoOverlay`).

## 24. Dashboard mở rộng — thống kê + "Hồ sơ trả kết quả tuần này" + đổi thứ tự (Phase 6, 2026-08)

**Thứ tự hiển thị MỚI** (từ trên xuống, đây là chuẩn bắt buộc nếu sau này thêm/bớt khối Dashboard):
1. Hàng thẻ thống kê (`dashStatRow`)
2. ⚠️ Xử lý phát sinh cần chú ý
3. 📆 Hồ sơ trả kết quả tuần này (MỚI)
4. 📅 Khách tư vấn cần nhắc lại
5. Biểu đồ Doanh thu & Lợi nhuận theo tháng
6. Biểu đồ Số lượng hồ sơ theo tháng

**Thẻ thống kê** (thêm mới "Trả KQ hôm nay" — đếm `HO_SO` có `ngay_tra_kq` = hôm nay, tính trực
tiếp từ `HO_SO` đã nạp sẵn, không cần view SQL riêng, cùng cách làm với 3 thống kê Hồ sơ/Tư vấn có
sẵn). Đổi `.stat-row` từ `repeat(4,1fr)` cố định sang `repeat(auto-fit,minmax(165px,1fr))` + giảm
nhẹ font (13px→12px)/padding để nhãn dài nhất ("Cần nhắc lại (7 ngày)") luôn nằm gọn 1 dòng ở mọi
độ rộng màn hình — đã đo bằng `canvas.measureText()` xác nhận không tràn ở ngưỡng hẹp nhất
(165px/thẻ). ⚠️ **Đã bỏ thẻ "Doanh thu tháng này" và đổi công thức "Lợi nhuận tháng này" ở phiên
sau (2026-08, cùng ngày) — xem mục 27, còn lại 6 thẻ (không phải 7 như số cũ ghi ở đây).**

**"Hồ sơ trả kết quả tuần này"** — lấy trực tiếp từ `HO_SO` đã nạp sẵn lúc đăng nhập (không cần
view SQL riêng, xem hàm `renderDashTraKqTuan()`): lọc `ngay_tra_kq` trong khoảng [hôm nay, hôm
nay+6 ngày] (dùng hàm mới `addDaysIso()`), sort tăng dần (gần nhất trước), tô đỏ nếu đúng hôm nay.
Cột hiển thị: Tên khách hàng/Nước đến/Mục đích/Đại lý ủy thác/Ngày nộp/Ngày trả KQ + nút "Chi tiết"
gọi thẳng `openHoSoModal(id)` (dùng lại đúng dialog Hồ sơ, giống cách "Chi tiết" ở Tài chính làm).
**Lưu ý:** không lọc theo trạng thái hồ sơ (không giới hạn chỉ "Đã nộp") — hiển thị TẤT CẢ hồ sơ có
`ngay_tra_kq` khớp khoảng ngày trên bất kể trạng thái, đúng theo yêu cầu gốc không nhắc tới lọc
trạng thái. Nếu cần lọc thêm theo trạng thái sau này, phải hỏi lại người dùng trước khi đổi.

**Chống cuộn ngang cho "Xử lý phát sinh cần chú ý" + "Khách tư vấn cần nhắc lại":** nguyên nhân gốc
là `table{min-width:720px}` (rule chung cho MỌI bảng) ép bảng ít cột (chỉ 3 cột) vẫn phải rộng tối
thiểu 720px dù đứng trong khối hẹp — đã xử lý bằng 2 cách cộng lại: (1) đổi `.dash-tables` từ lưới
2 cột `1.3fr 1fr` sang xếp DỌC từng khối full-width (khớp luôn với thứ tự mới ở trên, mỗi bảng có
trọn bề ngang màn hình), (2) thêm class `.tbl-compact{min-width:0}` gắn vào 2 bảng này để bỏ hẳn
sàn 720px, chỉ rộng đúng theo nội dung thật cần. Đã test xác nhận `scrollWidth===clientWidth` (hết
cuộn ngang) ở độ rộng 1280px.

## 25. Phân trang màn "Thông tin khách hàng" (Phase 6, 2026-08)

25 record/trang (`KH_PAGE_SIZE`), biến `khCurrentPage` giữ trang hiện tại. Thanh phân trang
(`#khPagination`, đặt NGAY SAU `<table>`, vẫn BÊN TRONG `.tbl-wrap` — bắt buộc theo quy tắc "tbl-wrap
phải là phần tử con cuối cùng" của cơ chế "tab cuộn cố định", mục 17 — không đặt ngoài `.tbl-wrap`)
hiện "Hiển thị X-Y trong tổng Z khách hàng" + nút Trước/Sau/số trang, nút trang hiện tại tô đậm
(`btn-p`), Trước/Sau tự `disabled` ở trang đầu/cuối.

**Reset về trang 1 khi đổi từ khóa tìm kiếm** (`#fKhSearch` oninput gọi `khCurrentPage=1;
renderKhachHang()`) nhưng **giữ nguyên trang** khi chỉ tải lại/thêm/sửa/xóa 1 khách hàng (các hàm
đó gọi `loadKhachHang()`→`renderKhachHang()` không đụng tới `khCurrentPage`) — tránh nhảy về trang 1
khó chịu mỗi lần sửa xong 1 khách hàng ở trang giữa danh sách.

**Nếu cần thêm phân trang cho màn list khác sau này:** copy đúng mẫu `KH_PAGE_SIZE`/`khCurrentPage`/
`renderKhPagination()`/`goKhPage()`, dùng lại class CSS `.pagination`/`.pagination-info`/
`.pagination-btns` đã có sẵn (không tự bịa CSS mới), nhớ đặt bên trong `.tbl-wrap` nếu section đó
có `tab-scroll`.

## 26. Zebra-stripe cho thẻ (card) list trên điện thoại (Phase 6, 2026-08)

Quy tắc CHUNG cho MỌI màn list khi xem trên điện thoại (≤700px, lúc bảng chuyển thành thẻ theo cơ
chế đã có ở mục 17/mobile card): dòng CHẴN có nền xanh nhạt (`var(--pl)`, `#E8F1FE`), dòng LẺ giữ
nguyên nền trắng — chỉ 1 dòng CSS `tr:nth-child(even){background:var(--pl)}` bên trong khối
`@media(max-width:700px)` hiện có, áp dụng tự động cho TẤT CẢ bảng trong `admin.html` (không cần
thêm class riêng cho từng bảng, không cần sửa gì ở HTML) vì mọi `<tr>` đều đi qua đúng 1 khối CSS
chuyển bảng→thẻ duy nhất. Đã test xác nhận đúng màu ở viewport thật 375px.

## 27. Dashboard: bỏ "Doanh thu tháng này", tính lại "Lợi nhuận tháng này" theo đúng Tài chính (2026-08)

**Lý do đổi:** thẻ "Lợi nhuận tháng này" trước đây đọc thẳng cột `loi_nhuan` của view
`v_dashboard_theo_thang` (nhóm theo `ngay_nop`), trong khi màn "Tài chính" tính "Lợi nhuận" theo
cách khác hẳn (nhóm theo `ngay_tra_kq`, chỉ tính hồ sơ `trang_thai='Đậu'`, trừ thêm `khoan_chi`) —
2 số có thể lệch nhau, gây khó hiểu khi người dùng so sánh Dashboard với Tài chính. PM yêu cầu bỏ
hẳn "Doanh thu tháng này" và bắt "Lợi nhuận tháng này" tính ĐÚNG công thức của Tài chính.

**Công thức mới** (hàm `renderDashboard()`, biến `monthFrom`/`monthTo` = `tcDefaultFrom()`/
`tcToday()` — tức đầu tháng hiện tại đến hôm nay, giống hệt khoảng mặc định của bộ lọc Tài chính):
- Khoản thu = tổng `loi_nhuan` của các `HO_SO` có `trang_thai==='Đậu'` VÀ `ngay_tra_kq` trong
  `[monthFrom, monthTo]` — tính trực tiếp từ `HO_SO` đã nạp sẵn (không gọi API riêng, giống các
  thống kê Hồ sơ/Tư vấn khác của Dashboard).
- Khoản chi = tổng `so_tien` của `khoan_chi` trong cùng khoảng — **phải gọi API riêng** vì
  `KHOAN_CHI` chỉ được nạp khi người dùng đã từng mở tab "Tài chính" (không nạp sẵn lúc đăng nhập
  như `HO_SO`), nên `loadDashboard()` giờ có thêm 1 lệnh gọi song song
  `api('khoan_chi?select=so_tien&ngay=gte.{monthFrom}&ngay=lte.{monthTo}')`, độc lập với state
  `tcFrom`/`tcTo` hiện tại của tab Tài chính (Dashboard luôn cố định xem "tháng này", bất kể người
  dùng đang lọc Tài chính theo khoảng ngày nào khác).
- Lợi nhuận tháng này = Khoản thu − Khoản chi (giống hệt cách trừ ở Tài chính), tô xanh nếu ≥0,
  đỏ nếu âm — cùng quy ước màu với ô "Lợi nhuận" bên Tài chính.

Cột `doanh_thu`/`loi_nhuan` của view `v_dashboard_theo_thang` VẪN được giữ và dùng cho 2 biểu đồ
("Doanh thu & Lợi nhuận theo tháng", "Số lượng hồ sơ theo tháng") — chỉ KHÔNG dùng nữa cho riêng
thẻ thống kê tháng hiện tại. Còn lại **6 thẻ thống kê** (đã bỏ "Doanh thu tháng này").

## 28. Sort màn "Hồ sơ" theo Trạng thái rồi Ngày tạo (2026-08)

**Quy tắc bắt buộc** (hàm `renderHoSo()`, biến `HS_STATUS_ORDER`): sort 2 cấp —
1. Ưu tiên 1 — Trạng thái theo đúng thứ tự: Đang xử lý → Đã nộp → Đậu → Rớt → Hủy.
2. Ưu tiên 2 — Cùng trạng thái thì `ngay` (Ngày tạo) CŨ NHẤT lên trước (tăng dần).

Áp dụng SAU bước lọc theo bộ lọc trạng thái/tìm kiếm/ngày nộp hiện có, TRƯỚC khi render — cột "#"
(STT) đánh số lại theo đúng thứ tự mới sau khi sort (không giữ số thứ tự gốc từ `HO_SO`). Không
đổi `order=created_at.desc` ở query `loadHoSo()` (chỉ ảnh hưởng thứ tự nạp ban đầu, không ảnh
hưởng thứ tự hiển thị cuối cùng vì đã tự sort lại ở `renderHoSo()`).

**Nếu cần đổi thứ tự ưu tiên trạng thái sau này:** chỉ cần sửa object `HS_STATUS_ORDER` (số nhỏ
hơn hiện trước), không cần sửa logic sort.

## 29. Dòng tiêu đề cột (thead) dính cứng khi cuộn — CHỈ 7 màn list đã có "tab cuộn cố định" (2026-08)

**Bối cảnh:** mục 17 từng ghi nhận "đã thử và KHÔNG áp dụng" sticky `<th>` vì nghi `border-collapse`
phá vỡ ngữ cảnh sticky. PM yêu cầu thử lại — lần này đổi cách làm và đã chạy đúng, xem chi tiết:

- Đổi `table{border-collapse:collapse}` → `border-collapse:separate;border-spacing:0` (CSS gần
  đầu `<style>`, khu vực comment `/* table */`) — đây là bước sửa lỗi chính, giao diện KHÔNG đổi
  gì (bảng vốn chỉ có `border-bottom` trên `td`, không có viền dọc/viền giữa ô nên `separate` với
  `spacing:0` hiển thị giống hệt `collapse` cũ).
- Thêm `.tab-scroll>.tbl-wrap thead th{position:sticky;top:0;z-index:2}` — chọn đúng qua selector
  con trực tiếp (`>`) nên **CHỈ** áp dụng cho bảng CHÍNH của 7 màn đã có class `tab-scroll` (Tư
  vấn/Hồ sơ/Thông tin khách hàng/Tài chính/Đại lý ủy thác/Bài viết/Danh mục bài viết) — **tự động
  KHÔNG** áp dụng cho Dashboard/Cài đặt chung (không có `tab-scroll`) hay bảng con trong dialog
  (Thành viên nhóm/Xử lý phát sinh/Bảng phí đại lý — nằm trong `.dlg-body`, không phải con trực
  tiếp của `.tab-scroll`) — **đúng theo yêu cầu PM xác nhận, KHÔNG mở rộng thêm phạm vi này**.
- Nền `<th>` đã có sẵn `background:var(--dark)` (đặc, không trong suốt) nên dòng dữ liệu cuộn qua
  bị che khuất đúng cách phía sau tiêu đề dính cứng, không bị "lộ" chữ chồng lên nhau.

**Đã test xác nhận qua Claude Browser** (dùng `resize_window` với số cụ thể để có viewport thật,
xem mục "đính chính" ở `Handover_Phien_Moi.md`): cuộn `.tbl-wrap` (gán `scrollTop`), đo
`getBoundingClientRect()` của `<th>` trước/sau cuộn — vị trí `<th>` KHÔNG đổi (đứng yên) trong khi
dòng dữ liệu đầu tiên di chuyển lên trên (chứng minh có cuộn thật), đúng cho cả 5 màn còn lại
(Tư vấn/Tài chính/Thông tin khách hàng/Đại lý ủy thác/Bài viết) + xác nhận Dashboard/Cài đặt
chung/dialog con vẫn `position:static` như cũ (không bị ảnh hưởng ngoài ý muốn).

**Nếu sau này phát hiện lỗi hiển thị sticky thead trên 1 trình duyệt/thiết bị cụ thể** (khả năng
nhỏ nhưng không phải 0 — đây vẫn là 1 kỹ thuật CSS có lịch sử tương thích không đều giữa các trình
duyệt cũ): kiểm tra lại đúng thiết bị đó trước khi kết luận lỗi chung, không vội bỏ hẳn tính năng
như lần trước (mục 17) — lần này đã đổi `border-collapse` nên nguyên nhân gốc cũ nhiều khả năng
đã được xử lý.

## 30. Tự làm mới access token khi hết hạn (401) — không còn phải đăng nhập lại giữa buổi (2026-08)

**Lỗi thật đã gặp:** người dùng đang gõ "Thêm bài viết" (nội dung dài), bấm "Lưu bài viết" → lỗi
401 (xem Network tab: request `posts` trả 401). Nguyên nhân: access token của Supabase chỉ sống
mặc định **~1 giờ**; dự án gọi thẳng `fetch()` (không dùng Supabase JS SDK) nên KHÔNG có cơ chế tự
làm mới token chạy nền như SDK chính thức — `TOKEN` chỉ được gán 1 lần lúc đăng nhập/tự đăng nhập
lại (`trySilentLogin()`, chạy 1 lần lúc tải trang), không có `setInterval` nào làm mới lại. Mở
trang quá 1 giờ mà không đăng xuất/vào lại → MỌI hành động lưu tiếp theo đều báo lỗi 401 y như vậy,
dù dữ liệu đang gõ vẫn còn trên form (dialog không tự đóng khi lỗi).

**Đã sửa — hàm `api()`** (dùng chung cho MỌI lệnh gọi Supabase REST trong `admin.html`): thêm biến
`REFRESH_TOKEN` giữ trong bộ nhớ (gán ngay sau khi đăng nhập thành công HOẶC tự đăng nhập lại lúc
tải trang — **luôn gán bất kể có tích "Ghi nhớ đăng nhập" hay không**, ô đó chỉ quyết định có LƯU
refresh token vào `localStorage` để dùng lại sau khi tắt trình duyệt hay không, không quyết định
có giữ trong bộ nhớ cho phiên hiện tại). Khi `api()` gặp `401`:
1. Gọi `refreshAccessToken()` — âm thầm xin access token mới bằng `REFRESH_TOKEN` (endpoint
   `/auth/v1/token?grant_type=refresh_token`, giống hệt cơ chế `trySilentLogin()` đã có).
2. Nếu thành công → cập nhật `TOKEN` mới, rồi **tự gọi lại đúng request vừa bị 401** (tham số nội
   bộ `_retriedAfterRefresh` chặn lặp vô hạn, chỉ thử lại tối đa 1 lần) — người dùng KHÔNG thấy gì
   bất thường, hành động họ đang làm (lưu bài viết, lưu hồ sơ...) hoàn tất bình thường.
3. Nếu làm mới CŨNG thất bại (refresh token cũng đã hết hạn/không có) → giữ nguyên hành vi cũ:
   toast "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại" + `logout()`.

**Đã test qua Claude Browser** (mock `window.fetch` mô phỏng đúng 3 bước: 401 → refresh thành công
→ gọi lại thành công; và ca refresh cũng thất bại → rơi về đúng hành vi cũ) — cả 2 nhánh đều đúng.
**Không cần sửa gì ở bất kỳ hàm `saveXxx()` nào khác** — vì tất cả đều gọi qua `api()` chung, tự
động được hưởng cơ chế này.

## 31. Phase 7 (2026-08-06): giá dịch vụ động, Phân loại bài viết + menu/section động, đại lý
    không bắt buộc, sort chung cho mọi màn list

Migration: `05_Database/07_supabase_setup_phase7.sql` (chưa chạy thì 2 mục C, E dưới đây sẽ lỗi —
lưu Bài viết báo lỗi thiếu cột `phan_loai`, "Dịch vụ Visa các quốc gia" báo lỗi thiếu bảng
`dich_vu_gia`; giá landing page vẫn hiện đúng số cũ viết sẵn trong HTML một cách an toàn, không
crash, nhờ cơ chế fallback ở mục D).

**A. Dashboard** (`renderDashTraKqTuan()`/`renderDashboard()`): khối "Hồ sơ trả kết quả tuần này"
giờ CHỈ lấy hồ sơ trạng thái "Đã nộp"/"Đang xử lý" (bỏ qua Đậu/Rớt/Hủy — kết quả không còn ý nghĩa
"sắp trả" nữa). Đổi tên thẻ thống kê "Hồ sơ đang nộp" → **"Hồ sơ đã nộp"** (chỉ đổi label hiển thị,
biến/logic tính `hsDaNop` giữ nguyên).

**B. "Danh mục bài viết"** (`delCategory()`/`renderCats()`): thêm nút "Sửa" (tái dùng dialog
`renameOverlay` có sẵn — `openRenameModal()`/`saveRename()` thêm 1 nhánh `type==='cat'` xử lý field
`name` của bảng `categories` thay vì `ten` của các bảng `danh_muc_*`). Xóa giờ **CHẶN** nếu danh mục
đang có bài viết dùng (`isRecordInUse([{table:'posts',column:'category_id',value:id}])`) — đảo lại
quyết định cũ ở mục 14 (không tự đảo lại lần nữa trừ khi có yêu cầu rõ ràng).

**C. Hồ sơ**: bỏ bắt buộc chọn "Đại lý ủy thác" (`saveHoSo()` bỏ validate, `doi_tac_id` gửi `null`
khi để trống) — migration `alter table ho_so alter column doi_tac_id drop not null` (đảo lại quyết
định BẮT BUỘC ở Phase 2). Icon kính lúp 🔍 ở "Tên khách hàng" đổi từ nút rời đứng cạnh ô sang **lồng
bên trong ô input** (`.kh-pick-wrap`/`.kh-pick-btn` đổi sang `position:relative`/`absolute`, đúng
mẫu icon lịch mục 20) — HTML không đổi, chỉ đổi CSS.

**D. "Dịch vụ Visa các quốc gia"** (mới, Cài đặt chung) — bảng `dich_vu_gia` (`quoc_gia` unique,
`gia` nullable = "Liên hệ báo giá"), quản lý qua dialog `#dvgOverlay`
(`loadDichVuGia()`/`openDvGiaModal()`/`saveDvGia()`/`delDvGia()`, load cùng lúc đăng nhập). "Đất
nước" là **droplist cố định 8 giá trị** (`DVG_COUNTRIES` — đúng 7 nước + "Khác" đang có card trên
landing page), KHÔNG phải danh mục "Nước đến" động (`danh_muc_nuoc`, dùng cho Hồ sơ/Tư vấn, có thể
có nước khác 8 nước này) — 2 danh sách nước này ĐỘC LẬP nhau, đừng nhầm lẫn khi sửa. Không cần
`isRecordInUse` trước khi xóa (không bảng nào tham chiếu tới, giống các bảng "lá" khác).

Landing page (`index.html`, section "Dịch vụ") — mỗi `.price` có `data-country="<tên nước>"`
(khớp đúng text trong `DVG_COUNTRIES`); script cuối trang fetch `dich_vu_gia` (anon SELECT) rồi
cập nhật `textContent` từng `.price` theo giá tra được (`gia>0` → "Từ x đ", `gia` null/0 → "Liên
hệ báo giá"). Nước KHÔNG có trong bảng (chưa migration/PM chưa cấu hình) → **giữ nguyên số cũ viết
sẵn trong HTML** làm fallback, không xóa/ẩn gì — đây là lý do các số "Từ x đ" cũ VẪN PHẢI giữ trong
HTML dù giờ có nguồn dữ liệu động, không xóa được như placeholder `[THAY_THẾ]` thông thường.

**E. Bài viết** — thêm field bắt buộc **"Phân loại"** (cột `posts.phan_loai`, input có
`<datalist>` gợi ý các giá trị đã dùng trước đó để hạn chế gõ lệch chính tả, KHÔNG ép chọn từ danh
sách). Ý nghĩa: "Phân loại" là tiêu đề H2 hiển thị cho section chứa bài viết đó trên landing page —
khác với "Danh mục" (`category_id`, đã có từ Phase 1) là khóa NHÓM bài viết để quyết định section
nào + menu nào. Dữ liệu cũ (4 bài viết, Danh mục "Tin tức") được backfill `phan_loai = 'Tin tức &
Kinh nghiệm xin Visa'` (khớp đúng tên section cứng trước Phase 7) trong migration.

**F. Landing page — menu/section ĐỘNG theo Danh mục** (thay hẳn section+nav-link "Tin tức" cứng cũ):
script cuối `index.html` fetch toàn bộ `posts` (published=true, kèm `categories(id,name)`), nhóm
theo `category_id` (bỏ qua bài viết chưa gán Danh mục), với MỖI nhóm có ≥1 bài viết:
- Menu: `<li><a href="#cat-<slug>">📰 <tên Danh mục></a></li>` chèn ngay TRƯỚC link `#faq` trong
  `#navLinks` (không còn `<li>` "Tin tức" tĩnh trong HTML — xóa hẳn).
- Section: `<section id="cat-<slug>">` chèn vào `<div id="categorySections">` (đặt đúng vị trí cũ
  của section "Tin tức", giữa "Đánh giá" và "FAQ") — tiêu đề H2 lấy từ `phan_loai` của bài viết MỚI
  NHẤT trong nhóm (fallback = tên Danh mục nếu vì lý do gì đó rỗng, vd DB chưa migration).
- `slug` = `slugifyCatName(tên Danh mục)` (bỏ dấu tiếng Việt, thay non-alnum bằng `-`, tiền tố
  `cat-`). Nhóm sắp xếp theo tên Danh mục A-Z (menu ổn định, không đổi chỗ theo bài viết mới nhất).
- `openPostDetail(i)` vẫn dùng đúng cơ chế cũ (index vào `window.__POSTS__`) — mỗi bài viết được
  gán `p.__idx` = vị trí gốc trong mảng fetch phẳng lúc build nhóm, để card trong MỌI section trỏ
  đúng bài viết dù đã được nhóm lại theo Danh mục.
- **Scrollspy** (`initScrollSpy()`, đổi từ IIFE thành hàm dùng lại được): gọi lại 1 lần SAU KHI chèn
  xong menu/section động, để observer theo dõi được cả các mục mới chèn (mục tĩnh lúc tải trang đã
  được observer đầu gọi trước đó theo dõi rồi — gọi lại không hại gì, chỉ tạo thêm observer mới bao
  trùm luôn cả 2 loại).
- Danh mục KHÔNG có bài viết công khai nào → không tạo gì cả (không menu rỗng, không section rỗng).

**⚠️ Khi thêm Danh mục bài viết MỚI sau này**: không cần sửa gì ở `index.html` — chỉ cần tạo Danh
mục ở tab "Danh mục bài viết", gán cho bài viết (kèm "Phân loại"), landing page tự nhận diện và
hiện thêm menu/section tương ứng ngay lần tải trang kế tiếp.

**F.1 Sửa lỗi ảnh đại diện bài viết bị cắt xấu (2026-08-07):** người dùng phản hồi ảnh đại diện
(`.card-post .thumb`) hiển thị bị "vỡ"/lệch trên landing page. Nguyên nhân THẬT: không phải lỗi
code mà do khung ảnh dùng `height:160px` CỐ ĐỊNH trong khi bề ngang thẻ đổi theo từng breakpoint
(mobile 1 cột/tablet 2 cột/desktop 3 cột) → tỷ lệ khung (`object-fit:cover`) đổi theo từng màn
hình (desktop ~2.3:1, mobile có thể tới ~4:1+), nên ảnh gốc không đúng tỷ lệ bị cắt mất rất nhiều
phần trên/dưới. Đã sửa 2 phần:
1. **CSS**: đổi `.card-post .thumb`/`.thumb-placeholder` từ `height:160px` sang
   `aspect-ratio:2.3/1` — giữ ĐÚNG tỷ lệ khung 2,3:1 ở MỌI kích thước màn hình (đã test xác nhận
   1280px và 390px đều ra đúng ratio 2.3). Khi cần đổi tỷ lệ khung chuẩn sau này, chỉ sửa 1 chỗ
   `2.3/1` này (2 nơi, `.thumb` và `.thumb-placeholder`, PHẢI sửa cùng lúc để khớp nhau).
2. **Ảnh mẫu quốc kỳ/logo** (thư mục `D:\...\NguyenNC\Quoc_Ky\`, NGOÀI git repo — của người dùng,
   không phải asset dự án): đã viết script Python (Pillow) canh lại 10 ảnh cờ/logo về đúng khung
   1380×600 (tỷ lệ 2,3:1) bằng cách **thu nhỏ giữ nguyên tỷ lệ gốc rồi dán giữa** (không kéo méo,
   không cắt mất nội dung) — nền thêm vào dùng màu trắng (khớp nền trắng của `.card-post`), riêng
   `Logo_TV5s_black.png` (có alpha trong suốt thật) giữ nền trong suốt. Xuất ra thư mục con `Edit/`
   cạnh ảnh gốc. **Quy tắc chung khi chuẩn bị ảnh đăng bài mới sau này**: nên crop/canh ảnh theo
   tỷ lệ ngang gần **2,3:1** trước khi tải lên (vd 1200×520, 1380×600) để không bị cắt mất nội
   dung quan trọng (logo, chi tiết chính giữa ảnh...).

**G. Sort theo cột — dùng CHUNG cho 7 màn list** (Tư vấn/Hồ sơ/Thông tin khách hàng/Tài chính/Đại
lý ủy thác/Bài viết/Danh mục bài viết) + block "Dịch vụ Visa các quốc gia": 3 hàm dùng chung
(`onSortClick(tableKey,col,renderFn)`/`applySort(tableKey,rows,getters)`/`updateSortIcons(tableKey)`,
định nghĩa cạnh `applyRowLabels()`) — bấm `<th class="sortable" onclick="onSortClick(...)">` đổi
hướng tăng/giảm (mũi tên ▲/▼ hiện qua `<span class="sort-ic" data-tbl="..." data-col="...">`, cập
nhật qua `updateSortIcons()` vì `thead` là HTML tĩnh, không render lại mỗi lần). Bỏ qua cột "#" và
"Thao tác" (không có ý nghĩa để sort).

- **Hồ sơ** là trường hợp đặc biệt: có sẵn sort mặc định 2 cấp (Trạng thái rồi Ngày tạo, mục 28) —
  `renderHoSo()` chỉ dùng `applySort()` khi `SORT_STATE['hs']` đã được set (đã bấm 1 cột), còn
  chưa bấm gì thì vẫn giữ đúng sort mặc định cũ.
- **Tài chính**: `renderTaiChinh(thuArr,chiArr)` cần 2 tham số để tính lại thống kê, nên thêm hàm
  không tham số `renderTaiChinhSorted()` (dùng lại `TC_LAST_THU`/`TC_LAST_CHI` lưu từ lần
  `loadTaiChinh()` gần nhất) làm đích cho `onclick` của `<th>` — sort chỉ đổi thứ tự `TC_ROWS` hiển
  thị, không tính lại thống kê.
- **Thông tin khách hàng**: bấm sort tự reset về trang 1 (`khCurrentPage=1;onSortClick(...)`) —
  cùng lý do đổi từ khóa tìm kiếm cũng reset trang, tránh đứng ở 1 trang giữa danh sách đã sort lại.
- **Cài đặt chung** (Nước đến/Mục đích/Đối tác) và **Dashboard**: KHÔNG áp dụng sort — không phải
  dạng "list nhiều dòng cần sắp xếp lại", giống lý do các màn này không có "tab cuộn cố định" (mục
  17). Riêng "Dịch vụ Visa các quốc gia" (block mới trong Cài đặt chung) VẪN có sort vì bảng đó có
  thể tăng dần theo thời gian gần bằng số nước, cùng nhóm với "list" hơn.

**⚠️ Khi thêm 1 màn list MỚI có bảng cần sort sau này**: copy đúng mẫu `onSortClick`/`applySort`/
`updateSortIcons` + cấu trúc `<th class="sortable" onclick="...">...<span class="sort-ic"
data-tbl="..." data-col="...">` ở trên, đặt tên `tableKey` mới không trùng 8 key đã dùng
(`tv`/`hs`/`kh`/`tc`/`dt`/`posts`/`cats`/`dvg`).

## 32. Sửa "Thành viên nhóm", filter Bài viết, đổi thương hiệu "Top Visa 5S", sửa lời cam kết,
    SEO bổ sung (2026-08-07)

**A. Hồ sơ — "Thành viên nhóm" thêm Sửa + canh giữa "Thao tác":** trước đây `renderXlps()` và
`renderThanhVien()` KHÔNG gắn class `td-actions` vào ô "Thao tác" (chỉ `<th class="th-center">`
canh giữa tiêu đề, còn `<td>` bên dưới không có gì canh nên nút bị dạt trái) — đã thêm
`class="td-actions"` vào cả 2 (dùng chung `.td-actions{display:flex;justify-content:center}` có
sẵn). "Sửa" thành viên nhóm KHÔNG mở dialog riêng — tái dùng luôn 3 ô "+ Thêm" làm form sửa
(`editThanhVien(id)` nạp dữ liệu + đổi nhãn nút thành "Cập nhật" + hiện nút "Hủy sửa"; `addThanhVien()`
dùng chung cho cả thêm lẫn sửa, rẽ nhánh PATCH/POST theo `tvienEditId` có giá trị hay không, đúng
mẫu `id?PATCH:POST` dùng khắp nơi khác trong file). `openHoSoModal()` gọi `cancelEditThanhVien()`
mỗi lần mở dialog để tránh mang state "đang sửa" từ hồ sơ trước sang hồ sơ đang mở.

**B. Bài viết — filter theo Danh mục + Phân loại:** 2 dropdown mới `#fPostCat`/`#fPostPhanLoai`
trong `.filters` cạnh nút "+ Thêm bài viết". `fPostCat` nạp từ `CATS` (trong `loadCats()`, giữ
nguyên lựa chọn cũ khi load lại — đúng mẫu `fTvCountry` ở `loadLeads()`). `fPostPhanLoai` nạp từ
**giá trị Phân loại ĐANG CÓ THẬT** trong `POSTS` (distinct, sort A-Z) — không phải danh sách cố
định, tự cập nhật mỗi lần `loadPosts()` chạy lại. `renderPosts()` lọc theo cả 2 điều kiện (AND)
trước khi sort/hiển thị.

**C. Đổi tên thương hiệu "Top Visa" → "Top Visa 5S"** (5S = Solution/Simple/Speed/Secure/Success,
theo bộ nhận diện mới người dùng cung cấp trong `02_Source/assets/logo/Logo Lockup.png`/`.svg`) —
đã sửa MỌI nơi hiển thị tên công ty trong `index.html`/`admin.html`: `<title>`, meta
description/OG/Twitter, JSON-LD `name`, `COMPANY_NAME` (tự động cập nhật `.js-company` ở footer),
chữ trên logo navbar/footer ("Top **Visa 5S**", đưa "5S" vào chung span màu accent với "Visa" —
không tạo thêm màu thứ 3), alt text logo/QR, admin.html `<title>`/brand header/
`apple-mobile-web-app-title`, `admin-manifest.webmanifest` (`name`/`short_name`/`description`).
**KHÔNG đổi**: domain `topvisa5s.com` (đã có sẵn "5s"), email, và key nội bộ
`tv_admin_refresh_token` (localStorage key kỹ thuật, không phải "thông tin" hiển thị cho khách).
**⚠️ Nếu công ty đã có Google Business Profile/trang mạng xã hội dưới tên "Top Visa" cũ, PM cần tự
cập nhật tên ở đó khớp "Top Visa 5S"** — Google đánh giá độ tin cậy địa phương một phần dựa vào tên
công ty khớp nhau giữa website và các nơi khác (NAP consistency), xem thêm mục D bên dưới.

**Bộ nhận diện mới** (`02_Source/assets/logo/` — giữ nguyên file gốc do người dùng cung cấp để
sau này cần chỉnh lại): `Logo_TV5s_white.png`/`.svg` (icon kim cương, nền trắng đặc), `Logo
Lockup.png`/`.svg` (icon + "TOP VISA 5S" + tagline, nền thẻ `#F6F9FE` bo góc). Từ bộ gốc này đã
tạo ra các file THẬT SỰ dùng trên site (nằm thẳng trong `02_Source/assets/`, không phải trong thư
mục `logo/`):
- `logo.svg` — copy y nguyên `Logo_TV5s_white.svg` nhưng **xóa hẳn `<rect>` nền trắng** (dòng đầu
  tiên trong `<svg>`) để có bản trong suốt thật — dùng cho `<img>` navbar/footer (cả 2 file HTML),
  hiển thị đẹp trên nền sáng LẪN nền tối (footer màu `--color-dark`). Browser tự render SVG khi
  dùng trong thẻ `<img>`, không cần công cụ rasterize nào.
- `favicon.png` (512×512, nền trắng, icon chiếm ~86% khung) — thay hẳn `favicon.png` cũ. Có thêm
  `<link rel="icon" type="image/svg+xml" href="assets/logo.svg">` đứng TRƯỚC link PNG (trình
  duyệt hiện đại ưu tiên SVG nếu hỗ trợ, PNG là fallback).
- `logo-backup.png` (512×512, nền trắng, icon chỉ chiếm ~62% khung — chừa lề RỘNG hơn hẳn
  favicon) — dùng cho `apple-touch-icon` (Apple khuyến nghị nền đặc, không trong suốt) VÀ icon
  "maskable" trong `admin-manifest.webmanifest` (icon maskable bị hệ điều hành tự cắt tròn/bo góc,
  cần chừa "vùng an toàn" quanh nội dung — đây là lý do lề phải rộng hơn favicon thường).
- `og-image.png` (1200×630, đúng chuẩn khuyến nghị của Facebook/Zalo/Twitter) — ghép "Logo
  Lockup" (đã có sẵn nền thẻ sáng) lên nền gradient xanh dương trùng màu `.hero-visual` của site
  (`#1B6EF3`→`#0F4FC2`). Dùng cho `og:image`/`twitter:image`/JSON-LD `image` — thay hẳn kiểu cũ
  (tái dùng logo nhỏ 240×240 vuông, xem mục 12) bằng ảnh chia sẻ đúng tỉ lệ chuẩn, đẹp hơn hẳn khi
  dán link lên Facebook/Zalo. JSON-LD `logo` (khác với `image`) trỏ riêng sang `logo-backup.png`
  (đúng ngữ nghĩa "logo" nên là icon vuông, không phải ảnh ngang).
- **`.logo img{height:40px;width:40px}` (navbar/footer) và `.bar .brand img{height:24px;width:24px}`
  (admin.html) đổi `width` cố định thành `width:auto`** — icon kim cương KHÔNG vuông (tỉ lệ ~1,24:1,
  rộng hơn cao), ép `width` cố định bằng `height` sẽ bóp méo hình. Đã test xác nhận hiển thị đúng
  tỉ lệ (50×40 thay vì 40×40 méo) qua Claude Browser.
- File `logo.png` cũ (240×240, thiết kế trước "TV5S") đã **xóa hẳn** — không còn nơi nào tham
  chiếu (đã grep xác nhận sạch trước khi xóa).

**D. Viết lại lời cam kết "Đậu visa mới thu phí dịch vụ"** — lý do: câu cũ ("Trượt visa, bạn không
mất một đồng phí dịch vụ nào!") là cam kết TUYỆT ĐỐI không điều kiện, nhưng thực tế PM cho biết hồ
sơ khách quá yếu (tài chính/hồ sơ chưa đủ mạnh) đôi khi vẫn phải thu thêm phí xử lý dù trượt — câu
cũ có thể khiến khách hiểu nhầm, rủi ro tranh chấp/khiếu nại và vi phạm quảng cáo "cam kết không
đúng thực tế". Đã sửa lại theo hướng: giữ NGUYÊN tinh thần cam kết mạnh (điểm khác biệt cạnh tranh
thật), nhưng thêm điều kiện rõ ràng "hồ sơ đủ điều kiện" + luôn chốt lại bằng "báo phí rõ ràng
bằng văn bản trước khi khách quyết định" (nguyên tắc minh bạch đã có sẵn ở nơi khác trên trang, vd
FAQ "Chi phí dịch vụ gồm những gì?" — không mâu thuẫn nhau: câu đó nói KHÔNG phát sinh phí ẩn SAU
KHI đã chốt giá, còn câu cam kết nói giá ban đầu có thể khác nhau tùy độ khó hồ sơ, đánh giá TRƯỚC
khi chốt). Đã sửa đủ **4 vị trí + FAQ (2 nơi, HTML hiển thị + JSON-LD phải khớp y hệt nhau)**:
promo-bar (dòng phụ), `.usp-highlight` (hero), `.usp-banner` (section Lợi ích), FAQ "Trượt visa có
mất phí dịch vụ không?". **Không đổi** badge ngắn "✓ Đậu mới thu phí" (hero) — câu này vốn đã an
toàn, chỉ nói MÔ HÌNH thu phí (thu khi đậu) chứ không cam kết tuyệt đối chuyện gì xảy ra khi trượt.
**Nếu sửa lại các câu này lần sau**: luôn giữ nguyên tinh thần "có điều kiện + báo giá bằng văn bản
trước khi chốt", không quay lại kiểu cam kết tuyệt đối 100% cho mọi trường hợp.

**E. SEO bổ sung** (tiếp nối mục 12):
- Thêm `hasOfferCatalog` (schema.org `OfferCatalog`/`Service`, KHÔNG kèm giá) vào JSON-LD
  `TravelAgency` — liệt kê 7 dịch vụ visa theo quốc gia. Cố tình KHÔNG đưa giá tiền vào structured
  data vì giá giờ quản lý động qua `dich_vu_gia` (mục 31.D) — nếu hardcode giá vào JSON-LD sẽ dễ
  lệch với giá thật hiển thị trên trang (Google phạt nếu structured data không khớp nội dung thấy
  được, cùng nguyên tắc đã áp dụng cho FAQPage ở mục 12).
- `sitemap.xml`: cập nhật `lastmod` theo ngày thay đổi nội dung đáng kể gần nhất.
- Đã rà soát: chỉ có đúng 1 thẻ `<h1>` trên trang, `<html lang="vi">` đúng — không cần sửa.
- **Việc CẦN người dùng tự làm** (không thể làm thay vì cần tài khoản riêng): xem tiếp mục 12 (Google
  Search Console/Business Profile/backlink) — bổ sung thêm 1 việc MỚI do đổi tên ở mục C: nếu đã có
  Google Business Profile/trang mạng xã hội dưới tên "Top Visa" cũ, cập nhật khớp "Top Visa 5S".
  Ngoài ra nên tận dụng đều đặn tab "Bài viết" (đã có filter theo Danh mục/Phân loại ở mục B, và cơ
  chế menu/section tự động theo Danh mục ở mục 31.F) để đăng nội dung mới target từ khóa dài
  ("kinh nghiệm xin visa...", "hồ sơ xin visa... cần gì") — nội dung mới đều đặn là yếu tố SEO có
  tác động thật, không phụ thuộc thao tác kỹ thuật một lần.

## 33. Ô Email ở form đăng ký + Chuông thông báo admin.html + Thông báo đẩy (Web Push) (2026-08-10)

**A. `index.html` — thêm ô "Email" (không bắt buộc) vào form đăng ký:** field mới `#regEmail`
(giữa "Số điện thoại" và "Quốc gia muốn xin Visa"), validate bằng regex đơn giản
(`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) CHỈ khi có nhập (để trống vẫn cho gửi bình thường, không bắt
buộc). Gửi kèm `email` trong payload POST `leads` (cột này đã có sẵn từ Phase 2, không cần
migration). Đổi text nút gửi từ "Gửi đăng ký →" thành "Gửi tư vấn →" (3 chỗ: HTML gốc, lúc bấm
"Đang gửi...", lúc reset lại trong `finally`) — chữ "Đang gửi..." lúc đang submit giữ nguyên,
không đổi.

**B. `admin.html` — chuông thông báo trên header** (`#notifBellBtn`/`#notifPanel`, khu vực code
"CHUÔNG THÔNG BÁO" ngay sau đoạn đăng ký service worker PWA): 3 loại thông báo, lưu trong bảng mới
`notifications` (`05_Database/08_supabase_setup_phase8.sql`):
- `tra_kq` — hồ sơ có `ngay_tra_kq` đúng hôm nay, còn "Đã nộp"/"Đang xử lý" (khớp đúng điều kiện
  khối "Hồ sơ trả kết quả tuần này" ở Dashboard, mục 31.A).
- `nhac_tuvan` — lead có `ngay_nhac_lai` đúng hôm nay (không lọc trạng thái, khớp view có sẵn
  `v_tu_van_can_nhac_lai`).
- `dang_ky_moi` — lead có `nguon='Từ Web'` (khách tự đăng ký qua `index.html`).

Nội dung mỗi dòng: `"<Tên khách hàng>_ Visa <Nước>"`, hiển thị kèm nhãn+icon theo loại
(`NOTIF_LOAI_LABEL`, vd "📆 Trả kết quả: Nguyễn Văn A_ Visa Nhật Bản"). Chuông có: số chưa đọc
(badge đỏ, ẩn khi =0), bấm 1 dòng → đánh dấu đã đọc + tự chuyển đúng tab (`switchTab`) và mở đúng
dialog liên quan (`openHoSoModal`/`openTvModal` theo `ref_id`), nút "Đánh dấu đã đọc" (PATCH hàng
loạt `is_read=eq.false`), nút "Xóa đã đọc" (DELETE hàng loạt `is_read=eq.true`, có hỏi xác nhận
qua `showConfirmPopup`). Panel định vị bằng `getBoundingClientRect()` giống hệt cơ chế
`datePickerPopup` (mục 20) — đóng khi click ra ngoài/Esc/cuộn/đổi kích thước màn hình. Poll lại
mỗi 45 giây (`startNotifPolling()`, gọi cùng lúc `loadLeads()`... lúc đăng nhập THÀNH CÔNG và lúc
tự đăng nhập lại — 2 chỗ) để badge luôn mới trong lúc đang mở trang; dừng poll khi `logout()`.

**⚠️ QUYẾT ĐỊNH KIẾN TRÚC QUAN TRỌNG — admin.html KHÔNG tự sinh thông báo:** `loadNotifications()`
CHỈ đọc bảng `notifications`, KHÔNG tự quét `ho_so`/`leads` để tạo dòng mới. Việc SINH thông báo
(quét dữ liệu + ghi vào bảng) do 1 **Cloudflare Worker chạy nền theo lịch (cron)** đảm nhiệm (xem
mục C) — lý do: nếu để admin.html tự sinh, thông báo chỉ xuất hiện khi có người đang mở trang,
không thể đẩy ra điện thoại lúc không ai mở app (yêu cầu cốt lõi của tính năng này). Nếu sau này
cần thêm 1 loại thông báo thứ 4, phải sửa CẢ 2 nơi: query mới trong `worker.js`
(`generateNewNotifications()`) VÀ nhãn/icon hiển thị trong `admin.html`
(`NOTIF_LOAI_LABEL`/`NOTIF_LOAI_TAB`) — không sửa 1 chỗ rồi bỏ mặc chỗ kia.

**C. Cloudflare Worker chạy nền (`02_Source/worker.js` + `wrangler.toml`)** — đây là lần ĐẦU TIÊN
dự án có code chạy phía server thật (trước giờ Cloudflare chỉ phục vụ file tĩnh, xem mục 3). Thêm
`main = "worker.js"` + `[triggers] crons = ["*/10 * * * *"]` vào `wrangler.toml` (chạy mỗi 10
phút) — `fetch()` trong `worker.js` CHỈ passthrough `env.ASSETS.fetch(request)`, giữ nguyên 100%
hành vi phục vụ file tĩnh cũ, không ảnh hưởng gì tới khách truy cập landing page hay admin đăng
nhập bình thường. Chỉ thêm đúng 1 khả năng mới: `scheduled()` — quét `ho_so`/`leads` bằng
**`SUPABASE_SERVICE_ROLE_KEY`** (bắt buộc phải dùng service_role vì cần đọc bảng `notifications`/
`push_subscriptions` vốn CHẶN hoàn toàn `anon`, xem mục D), upsert dòng thông báo mới (bỏ qua
trùng nhờ ràng buộc `unique(loai,ref_id,ref_ngay)` + `Prefer: resolution=ignore-duplicates` —
response chỉ trả về đúng những dòng MỚI thật sự được tạo, nhờ đó biết chính xác dòng nào cần gửi
push), rồi gửi Web Push tới mọi thiết bị trong `push_subscriptions`.

**Không dùng thư viện `web-push` (npm)** — viết tay bằng Web Crypto API (`crypto.subtle`) sẵn có
trong Cloudflare Workers, KHÔNG cần bundler/build step (đúng triết lý dự án, mục 3): ký JWT VAPID
(ECDSA P-256/SHA-256, `crypto.subtle.sign` trả thẳng chữ ký dạng raw r‖s 64 byte — đúng định dạng
JOSE ES256 cần, không phải lo chuyển đổi từ DER như một số thư viện khác). Push gửi đi **KHÔNG kèm
nội dung** (silent/empty-body push, chỉ có header `Authorization: vapid t=<jwt>, k=<public key>` +
`TTL`) — quyết định có chủ đích: mã hóa payload Web Push chuẩn (RFC8291, dùng ECDH+HKDF+AES-128-GCM)
phức tạp và rất dễ sai 1 bước nhỏ mà không có thiết bị thật để kiểm chứng tận nơi (gửi vẫn "thành
công" ở tầng HTTP nhưng trình duyệt âm thầm không giải mã được, không hiện thông báo — lỗi kinh
điển, khó debug nhất của Web Push). Push rỗng chỉ để "đánh thức" Service Worker, `sw-admin.js`
mới là nơi lấy nội dung thật (xem mục D) — đánh đổi lấy độ tin cậy cao hơn.

**Đã tự kiểm chứng logic (không cần deploy thật) bằng Node** (Web Crypto API trong Node 24 tương
thích Cloudflare Workers): mock `fetch` toàn cục, chạy thẳng `worker.js` như 1 ES module, xác nhận
— (1) query đúng cột/điều kiện, (2) upsert + lọc dòng mới đúng, (3) JWT VAPID ký đúng chuẩn ES256
và **verify chữ ký thành công** bằng đúng public key tương ứng, `aud` đúng origin endpoint, (4)
dòng thông báo trùng bị bỏ qua không gọi thêm push, (5) subscription nhận về 410 (Gone) bị xóa khỏi
DB. **Chưa/không thể kiểm chứng**: gửi push THẬT tới 1 thiết bị thật và thấy thông báo hiện lên màn
hình khóa — cần PM tự bật "Bật thông báo đẩy" trong admin.html trên điện thoại thật để xác nhận
(xem việc cần làm ở `Handover_Phien_Moi.md`).

**D. `push_subscriptions` + `sw-admin.js` — nhận push khi đã tắt hẳn trình duyệt:** bấm nút
"🔔 Bật thông báo đẩy trên thiết bị này" trong panel chuông (`togglePushSubscription()`) → xin
quyền `Notification` (bắt buộc qua thao tác bấm của người dùng, trình duyệt chặn xin quyền tự động
lúc tải trang) → `pushManager.subscribe()` với `VAPID_PUBLIC_KEY` (khóa CÔNG KHAI, an toàn khi
nhúng thẳng trong `admin.html`, khóa RIÊNG TƯ chỉ nằm trên Cloudflare Worker) → lưu
`{endpoint,p256dh,auth}` vào bảng `push_subscriptions` (`on_conflict=endpoint`, bấm lại không tạo
trùng). Bấm lần nữa để tắt (hủy subscribe + xóa khỏi DB).

`sw-admin.js` nhận sự kiện `push` (rỗng, xem mục C) → nếu ĐANG có tab admin.html mở VÀ hiển thị
trước mắt (`visibilityState==='visible'`) thì **im lặng bỏ qua** (chuông trong trang đã tự cập
nhật qua polling 45s, khỏi làm phiền thêm) → ngược lại (tab đang nền/khóa màn hình, hoặc không có
tab nào mở) thì tự làm mới access token bằng **refresh token đọc từ IndexedDB** (Service Worker
KHÔNG đọc được `localStorage` của trang, chỉ đọc được IndexedDB — nên `admin.html` phải ghi thêm 1
bản refresh token vào IndexedDB `tv5s-admin`/store `kv`/key `refresh_token` mỗi khi có token mới,
xem hàm `idbSet()` gọi ở CẢ 3 chỗ token được set: đăng nhập, tự đăng nhập lại, và
`refreshAccessToken()` khi gặp 401 — luôn đi kèm ĐÚNG điều kiện "Ghi nhớ đăng nhập" đang bật, để
tắt "Ghi nhớ đăng nhập"/đăng xuất cũng xóa sạch IndexedDB, không để sót quyền nhận push trên thiết
bị người dùng không còn muốn giữ đăng nhập), rồi gọi thẳng API lấy 5 thông báo chưa đọc mới nhất để
hiện `showNotification(...)` với nội dung THẬT (không phải nội dung "đóng băng" từ lúc gửi push).
Nếu bất kỳ bước nào lỗi (refresh token hết hạn, mất mạng...) → hiện thông báo dự phòng chung chung
"Có thông báo mới, mở app để xem chi tiết" thay vì im lặng không báo gì. Bấm vào thông báo hệ thống
→ focus tab admin.html đang mở (nếu có) hoặc mở tab mới.

**⚠️ Rủi ro đã cân nhắc và CHẤP NHẬN**: Supabase có thể xoay (rotate) refresh token mỗi lần dùng
tùy cấu hình project — nếu tab admin.html đang mở VÀ Service Worker CÙNG lúc làm mới token (hiếm,
chỉ trùng đúng lúc access token vừa hết hạn ~1 giờ/lần), 1 bên có thể dùng phải refresh token vừa
bị bên kia làm mới → lỗi, phải đăng nhập lại. Giảm thiểu bằng cách CHỈ cho Service Worker tự làm
mới token khi KHÔNG có tab nào đang hiển thị trước mắt (xem trên) — thu hẹp cửa sổ race condition
này rất nhiều, chấp nhận rủi ro còn lại vì tần suất cực hiếm và hậu quả nhẹ (chỉ cần đăng nhập lại,
không mất dữ liệu).

**3 bảng/cột SQL mới** (`05_Database/08_supabase_setup_phase8.sql`, đọc mục README trước khi chạy):
`notifications` (loai/ref_table/ref_id/ref_ngay/noi_dung/is_read/read_at/pushed_at, unique
loai+ref_id+ref_ngay), `push_subscriptions` (endpoint unique/p256dh/auth) — CẢ 2 chỉ
`authenticated` (admin) truy cập được qua RLS, `anon` không có quyền gì (không lộ tên/SĐT khách
qua API công khai). **Việc PM CẦN tự làm để tính năng chạy được thật** (Claude Code không có quyền
đăng nhập Supabase/Cloudflare Dashboard của PM):
1. Chạy `05_Database/08_supabase_setup_phase8.sql` trong Supabase SQL Editor.
2. Vào Cloudflare Dashboard → Worker (project deploy trang này) → Settings → Variables and
   Secrets → thêm 2 secret bắt buộc dạng "Encrypt" (KHÔNG bao giờ dán vào file trong git):
   - `SUPABASE_SERVICE_ROLE_KEY` — copy từ Supabase Dashboard → Project Settings → API → "service_role" key (**khác** `anon` key đang dùng trong `index.html`/`admin.html` — khóa này có toàn quyền, copy trực tiếp giữa 2 dashboard, không dán vào chat/file nào khác).
   - `VAPID_PRIVATE_KEY_JWK` — khóa riêng tư Web Push (Claude Code đã sinh sẵn 1 cặp khóa cho dự án này trong phiên làm việc, xem tin nhắn bàn giao).
   - `VAPID_SUBJECT` (KHÔNG bắt buộc, có giá trị mặc định `mailto:hien.gotravel@gmail.com` ngay trong code nếu bỏ trống) — email liên hệ theo chuẩn VAPID để dịch vụ push có thể liên hệ nếu phát hiện gửi rác.
   - `VAPID_PUBLIC_KEY` KHÔNG cần đặt secret — khóa này CÔNG KHAI theo đúng thiết kế Web Push nên
     hardcode thẳng trong `worker.js` (khớp y hệt hằng số cùng tên trong `admin.html`), gộp về 1
     chỗ duy nhất để tránh gõ lệch giữa 2 nơi.
3. Sau khi deploy (push code lên `main`), vào Cloudflare Dashboard → Worker → tab "Triggers" xác
   nhận Cron Trigger `*/10 * * * *` đã hiện diện và đang "Active" (chưa chắc chắn 100% việc thêm
   `[triggers]` vào `wrangler.toml` rồi deploy qua git-integration hiện tại sẽ tự bật cron mà
   không cần thao tác thêm trên dashboard — cần PM tự xác nhận vì Claude Code không truy cập được
   Cloudflare Dashboard).
4. Test thật trên điện thoại: mở `admin.html` (khuyến khích "Cài đặt ứng dụng"/thêm ra màn hình
   chính trước), đăng nhập, bấm chuông → "Bật thông báo đẩy trên thiết bị này" → đồng ý cấp quyền.
   Tạo/sửa 1 hồ sơ có `ngay_tra_kq`=hôm nay (hoặc đợi có khách đăng ký thật từ web) → chờ tối đa 10
   phút (chu kỳ cron) → kiểm tra điện thoại có hiện thông báo dù đã khóa màn hình/tắt trình duyệt.

## 34. Menu mobile tự đóng, sự cố thiếu `SUPABASE_URL`, loại thông báo thứ 4 "Xử lý phát sinh",
    xóa thông báo theo lựa chọn (2026-08-10, cùng ngày với mục 33 — set up thật + fix trong lúc PM
    tự tay cấu hình theo hướng dẫn mục 33)

**A. `index.html` — menu mobile tự đóng khi bấm 1 mục HOẶC bấm ra ngoài:** trước đây chỉ đóng khi
bấm đúng vào 1 thẻ `<a>` đã được gắn listener lúc tải trang (`closeMobileMenuOnClick` gọi 1 lần cho
từng `<a>` có sẵn) — bấm ra ngoài menu không đóng, và menu "Danh mục bài viết" chèn ĐỘNG sau khi
tải xong bài viết (mục 31.F) cũng không tự đóng được vì được thêm vào SAU thời điểm gắn listener.
Đã đổi sang **event delegation**: gắn listener DUY NHẤT trên `#navLinks` bắt sự kiện click bằng
`e.target.closest('a')` — tự động hoạt động với MỌI thẻ `<a>` kể cả những thẻ chèn động sau này,
không cần gắn lại thủ công. Thêm listener `click` trên `document` để đóng khi bấm ra ngoài, dùng
đúng mẫu `e.stopPropagation()` trên nút hamburger + kiểm tra `!navLinks.contains(e.target)` đã
dùng cho `floatContact` (nút liên hệ nổi) có sẵn trong file — tránh bug "vừa bấm mở đã tự đóng
ngay" nếu không stopPropagation đúng chỗ. Đã test qua Claude Browser ở khổ mobile 375px: mở bằng
hamburger, đóng khi bấm ra ngoài, đóng khi bấm 1 link (kể cả link giả lập chèn động), hamburger
vẫn toggle mở/đóng bình thường không bị nhiễu bởi listener mới.

**B. ⚠️ Sự cố thật gặp lúc PM tự cấu hình Cloudflare Worker theo mục 33 — thiếu `SUPABASE_URL`:**
hướng dẫn ở mục 33.D chỉ liệt kê 2 secret bắt buộc (`SUPABASE_SERVICE_ROLE_KEY`,
`VAPID_PRIVATE_KEY_JWK`) nhưng **quên hẳn** `SUPABASE_URL` — biến này CHƯA từng được hardcode trong
`worker.js` ở lần viết đầu (khác với `VAPID_PUBLIC_KEY` đã hardcode ngay từ đầu), vẫn đọc qua
`env.SUPABASE_URL`. Hậu quả: Cron Trigger chạy đúng giờ, Cloudflare ghi "Success" (chỉ có nghĩa
job không bị crash), nhưng `runNotificationJob()` tự thoát ngay dòng đầu vì thiếu biến — hoàn toàn
im lặng, không có cách nào biết được ngoài việc đọc kỹ code. **Đã sửa tận gốc**: hardcode
`SUPABASE_URL` thẳng trong `worker.js` (khớp y hệt `index.html`/`admin.html`, giống cách đã làm với
`VAPID_PUBLIC_KEY`) — từ nay PM KHÔNG cần thêm biến này nữa, giảm 1 bước cấu hình dễ quên sót.
Đồng thời tách riêng khối `try/catch` cho MỖI loại thông báo trong `generateNewNotifications()`
(trước đó cả 4 loại chung 1 khối try/catch lỏng lẻo — nếu 1 loại lỗi vd đổi schema/sai cột thì 3
loại còn lại cũng bị chặn theo, im lặng không tạo được gì). **Bài học cho lần thêm biến môi trường
Worker mới sau này**: ưu tiên hardcode thẳng trong code nếu giá trị KHÔNG nhạy cảm/đã công khai sẵn
(như URL, public key) thay vì bắt PM tự thêm biến — giảm hẳn 1 lớp có thể sai sót không có tín hiệu
báo lỗi rõ ràng, chỉ dùng Cloudflare secret cho giá trị THẬT SỰ cần giữ kín (service_role key, VAPID
private key).

**C. Loại thông báo thứ 4 — `xlps` (Xử lý phát sinh có hạn chốt hôm nay):** quét bảng
`ho_so_xu_ly_phat_sinh` có `han_chot` đúng hôm nay VÀ `trang_thai='Đang xử lý'` (khớp đúng điều
kiện view có sẵn `v_xu_ly_phat_sinh_7_ngay`, chỉ khác ở việc lọc đúng "hôm nay" thay vì cả khoảng
7 ngày). Nội dung: `"<Tên khách hàng>_<Nước đến>_ <Nội dung xử lý phát sinh>"` (theo đúng mẫu PM
yêu cầu, LƯU Ý dấu cách khác 3 loại kia: không có dấu cách sau dấu `_` đầu tiên, chỉ có dấu cách
sau dấu `_` thứ hai — không phải lỗi đánh máy, cố tình khớp đúng mẫu PM đưa).

**⚠️ Khác biệt kỹ thuật quan trọng so với 3 loại thông báo trước — cột `ref_parent_id` mới:** 3 loại
cũ (`tra_kq`/`nhac_tuvan`/`dang_ky_moi`) đều lưu `ref_id` = id của chính bản ghi cần mở khi bấm vào
thông báo (hồ sơ hoặc lead), nên `onNotifClick()` gọi thẳng `openHoSoModal(ref_id)`/
`openTvModal(ref_id)` được luôn. Loại `xlps` KHÁC: bản ghi "gốc" của thông báo là 1 dòng trong
`ho_so_xu_ly_phat_sinh` (bắt buộc dùng chính `id` của dòng này làm `ref_id`, KHÔNG được dùng
`ho_so_id` — nếu dùng `ho_so_id` thì 2 xử lý phát sinh khác nhau nhưng cùng 1 hồ sơ + cùng hạn chốt
sẽ bị ràng buộc `unique(loai,ref_id,ref_ngay)` coi là trùng, chỉ tạo được 1 thông báo thay vì 2 —
đã viết test xác nhận đúng hành vi này), nhưng lúc bấm vào thông báo lại cần mở đúng **Hồ sơ CHA**
chứ không phải bản thân dòng xử lý phát sinh (không có dialog riêng cho nó). Giải quyết bằng cột
mới `notifications.ref_parent_id` (migration `05_Database/09_supabase_setup_phase9.sql`, cũng nới
CHECK constraint cột `loai` để chấp nhận thêm giá trị `'xlps'`) — `worker.js` ghi
`ref_parent_id = ho_so_id` khi tạo thông báo loại `xlps` (3 loại kia ghi `null`), `onNotifClick()`
trong `admin.html` rẽ nhánh riêng: `n.loai==='xlps'` → `openHoSoModal(n.ref_parent_id)` thay vì
`n.ref_id`. **Nếu sau này thêm loại thông báo thứ 5 mà bản ghi gốc KHÔNG PHẢI hồ sơ/lead cấp cao
nhất** (là con của 1 bảng khác cần mở qua bảng cha) — áp dụng đúng mẫu `ref_parent_id` này, đừng tái
sử dụng `ref_id` cho 2 mục đích khác nhau (chống trùng VÀ điều hướng) như đã từng nhầm lẫn ban đầu.

**D. Xóa thông báo — đổi từ "xóa hàng loạt tất cả đã đọc" sang "tick chọn từng thông báo cần xóa":**
PM phản hồi nút "Xóa đã đọc" cũ xóa TOÀN BỘ thông báo đã đọc cùng lúc, không kiểm soát được — đã đổi
thành mỗi dòng thông báo có 1 checkbox riêng (`.notif-check`, ở đầu dòng, `onclick="event.
stopPropagation()"` để tick không vô tình kích hoạt điều hướng của cả dòng), nút đổi tên thành
"Xóa đã chọn" (`deleteSelectedNotifications()`) — chưa tick gì mà bấm thì báo lỗi nhắc chọn trước,
chỉ xóa đúng những id đã tick (`notifications?id=in.(...)`). Hàm `deleteReadNotifications()` cũ đã
xóa hẳn, không giữ lại tương thích ngược. **Đánh dấu đã đọc" (`markAllNotifRead()`) KHÔNG đổi** —
PM chỉ yêu cầu đổi hành vi xóa, vẫn đánh dấu tất cả đã đọc cùng lúc như cũ.

## 35. Sửa "hôm nay" tính theo UTC → giờ Việt Nam — fix tô đỏ/thông báo bị trễ tới 7h sáng (2026-08-14)

**Sự cố PM phản hồi:** vào `admin.html` lúc 6h30 sáng, hồ sơ có "Ngày trả KQ" = hôm nay KHÔNG được
tô đỏ trên Dashboard, và điện thoại KHÔNG nhận được thông báo "Trả kết quả" — lặp lại mỗi sáng.

**Nguyên nhân:** `tcToday()` (`admin.html`) và biến `today` trong `generateNewNotifications()`
(`worker.js`) đều tính "hôm nay" bằng `new Date().toISOString().slice(0,10)` — đây là ngày theo
**giờ UTC**, không phải giờ Việt Nam. Việt Nam nhanh hơn UTC 7 giờ, nên từ 0h-7h sáng giờ VN, mốc
UTC vẫn đang là "ngày hôm qua" → mọi so sánh `=== hôm nay` (tô đỏ Dashboard, query `ngay_tra_kq=eq.today`
ở worker) đều trễ tới 7h sáng giờ VN mới đúng. Hạn chế này từng được ghi chú và CHẤP NHẬN lúc dựng
tính năng thông báo (mục 33) vì nghĩ "0h-7h không phải giờ làm việc" — thực tế PM có kiểm tra sớm
nên vẫn bị ảnh hưởng, đã quyết định sửa hẳn theo yêu cầu PM.

**Đã sửa:** `tcToday()` đổi thành `new Date(Date.now()+7*3600*1000).toISOString().slice(0,10)`
(cộng thêm đúng 7 giờ trước khi lấy ngày UTC = ngày theo giờ Việt Nam, không phụ thuộc múi giờ máy/
điện thoại người dùng đang đặt). Đồng thời quy TẤT CẢ những chỗ khác trong `admin.html` từng tự tính
`new Date().toISOString().slice(0,10)` riêng (không gọi qua `tcToday()`) về gọi chung `tcToday()` —
gồm: "hôm nay" trong date-picker dùng chung (`renderDatePicker`/`dpGotoToday`), cờ quá hạn "Ngày trả
KQ" ở màn Hồ sơ (`todayStr` trong `renderHoSo()`), và các giá trị mặc định điền sẵn ngày hôm nay
(dialog "Bảng phí đại lý", dialog "Đăng ký hồ sơ mới", tên file CSV xuất Tư vấn/Tài chính) — tránh
để sót một nơi vẫn tính theo UTC gây lệch ngày với phần còn lại của hệ thống. `worker.js` sửa tương
tự (biến `today`), cùng công thức `+7*3600*1000` để 2 nơi luôn khớp nhau.

**⚠️ Nếu sau này thêm bất kỳ chỗ nào cần biết "hôm nay"** trong `admin.html`: LUÔN gọi `tcToday()`,
KHÔNG viết lại `new Date().toISOString().slice(0,10)` hay dùng `new Date().getFullYear()/getMonth()/
getDate()` (getter theo giờ máy/điện thoại, không đáng tin vì phụ thuộc múi giờ thiết bị) — để mọi
nơi trong hệ thống luôn thống nhất 1 định nghĩa "hôm nay" duy nhất theo giờ Việt Nam. Tương tự,
trong `worker.js` nếu cần "hôm nay" ở chỗ khác, dùng lại đúng công thức `new Date(Date.now()+7*3600*1000).toISOString().slice(0,10)` đã áp dụng trong `generateNewNotifications()`.

**Cần làm để có hiệu lực thật:** `admin.html`/`worker.js` đổi xong cần **push lên `main`** để
Cloudflare tự deploy lại cả trang tĩnh và Worker (job nền) — nếu chỉ sửa file local mà chưa deploy,
PM vẫn gặp lại đúng sự cố cũ.

## 36. Màn "Tư vấn": tìm theo Nội dung tư vấn + hiện cột + bôi màu từ khóa khớp (2026-08-14)

**3 việc PM yêu cầu, đã làm cả 3:**
1. Ô tìm kiếm `#fTvSearch` (đổi placeholder thành "Tìm tên / SĐT / nội dung...") giờ so khớp thêm
   `l.note` (cột "Ghi chú"/"Nội dung tư vấn" của `leads`, qua `vnNorm()` như 2 field cũ — không dấu
   vẫn tìm ra có dấu, xem mục 13).
2. Thêm cột "Nội dung tư vấn" vào bảng list (`renderTuVan()`, giữa "Nhắc lại" và "Thao tác", có
   sortable giống mọi cột khác). Chữ dài dùng class có sẵn `.text-trunc` (mục cạnh `.addr-trunc`) —
   cắt 1 dòng + "..." + `title` hiện đủ chữ khi rê chuột, KHÔNG xuống dòng.
3. Đoạn khớp từ khóa được bôi màu vàng (`<mark class="hl-match">`, dùng lại đúng cặp màu pill
   "Đang gọi"/"Đã nộp" có sẵn `#FEF3C7`/`var(--warn)`, không tạo màu mới) ở CẢ 3 cột có tham gia tìm
   kiếm: Tên, SĐT, Nội dung tư vấn.

**Hàm mới `highlightMatch(text, rawQuery)`** (đặt ngay sau `vnNorm()`, khu vực "TIỆN ÍCH CHUNG"):
lợi dụng đúng 1 tính chất của `vnNorm()` — việc NFD-tách dấu rồi xóa dấu tổ hợp KHÔNG đổi số lượng
ký tự gốc, nên `vnNorm(text)` luôn cùng độ dài + cùng vị trí ký tự với `text` gốc. Nhờ đó: tìm vị trí
khớp trên bản đã bỏ dấu (`vnNorm(text)`/`vnNorm(rawQuery)`) rồi cắt ĐÚNG y nguyên vị trí đó trên
`text` gốc (còn dấu) vẫn ra đúng đoạn khớp có dấu — gõ không dấu "nghi huu" vẫn bôi màu đúng chữ
"nghỉ hưu" có dấu trong dữ liệu, không cần dò lại vị trí. Bôi màu TẤT CẢ lần khớp trong 1 ô (không
chỉ lần đầu). Tự `esc()` toàn bộ text (kể cả phần không khớp) nên an toàn, không cần gọi `esc()`
thêm ở nơi gọi.

**Đã test qua Claude Browser (giả lập LEADS + gọi trực tiếp `renderTuVan()`, không cần đăng nhập
thật):** gõ không dấu "nghi huu" khớp đúng dòng có "nghỉ hưu" trong Nội dung tư vấn (dòng không liên
quan bị lọc mất đúng), bôi màu đúng cả 2 lần xuất hiện "nghỉ hưu" trong cùng 1 ô, cột Nội dung tư
vấn cắt ellipsis đúng (xác nhận `scrollWidth>clientWidth` tại `max-width:240px`), xóa từ khóa thì
hết bôi màu + hiện lại đủ dòng, bấm sort cột "Nội dung tư vấn" không lỗi.

**⚠️ Nếu sau này cần bôi màu kết quả tìm kiếm ở màn list khác:** gọi lại đúng `highlightMatch(text,
rawQuery)` này (đã dùng chung được cho mọi field, không phải viết riêng cho Tư vấn) — nhớ giữ biến
`rawQuery` là giá trị GỐC người dùng gõ (chưa qua `vnNorm()`), không phải biến `q` đã chuẩn hóa dùng
để lọc.

## 37. Màn "Tư vấn": đổi nút "Xuất CSV" → "Xuất Excel" (file .xlsx thật) (2026-08-14)

**Lý do:** PM yêu cầu xuất ra Excel thật (.xlsx) thay vì .csv — trước đây `exportTuVanCSV()` chỉ
xuất file `.csv` (kèm BOM UTF-8 để Excel mở không lỗi tiếng Việt), không phải file Excel thật.

**Đã thêm 1 thư viện ngoài qua CDN — SheetJS (`xlsx`)**, gắn kèm ngay dưới dòng `<script src=
"...chart.js">` đã có sẵn ở đầu file: `<script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/
xlsx.full.min.js"></script>` (ghim đúng bản `0.18.5`, không dùng `@latest` để tránh 1 ngày nào đó
CDN đổi bản mới làm hỏng code đang chạy mà không ai biết). **Đây KHÔNG phải phá vỡ triết lý "không
framework/build step" ở mục 3/10** — chỉ là 1 thẻ `<script src>` tải sẵn, giống hệt cách Chart.js
đã dùng từ trước cho biểu đồ Dashboard, không cần `npm install`/bundler gì thêm.

**Hàm đổi tên `exportTuVanCSV()` → `exportTuVanExcel()`** (giữ nguyên đúng bộ cột/dữ liệu cũ: ID/
Thời gian/Họ tên/SĐT/Quốc gia/Mục đích/Nguồn/Ghi chú/Trạng thái, xuất TOÀN BỘ `LEADS` không theo bộ
lọc/tìm kiếm hiện tại trên màn hình — giữ đúng hành vi cũ, chỉ đổi định dạng file): dùng
`XLSX.utils.aoa_to_sheet()` dựng sheet từ mảng 2 chiều, đặt `ws['!cols']` cho độ rộng cột hợp lý
(không bị bó chữ khi mở), `XLSX.writeFile(wb, 'tu_van_'+tcToday()+'.xlsx')` tự trình duyệt tải file
xuống — không cần dòng code Blob/`URL.createObjectURL` tự viết tay như bản CSV cũ (SheetJS tự làm).

**Đã tự kiểm chứng logic bằng Node** (không cần mở trình duyệt — cài tạm gói `xlsx` ở thư mục tạm
NGOÀI dự án, không đụng `package.json` của repo): dựng sheet bằng đúng API trên với dữ liệu tiếng
Việt có dấu, ghi ra `.xlsx`, đọc lại xác nhận đúng nội dung + Unix nhận diện đúng định dạng
"Microsoft Excel 2007+" (không phải file giả dạng .xlsx như cách gán MIME `application/vnd.ms-excel`
cho HTML thường thấy ở nơi khác — đây là file Excel THẬT).

**⚠️ Nếu sau này cần xuất Excel ở màn khác** (Tài chính, Hồ sơ...): dùng lại đúng 3 dòng
`aoa_to_sheet`/`book_new`+`book_append_sheet`/`writeFile` này, không cần thêm `<script src>` nữa vì
`XLSX` đã là biến toàn cục sẵn có trên mọi trang đã load `admin.html`.

## 38. Chuông thông báo: "đã đọc" tính RIÊNG theo từng máy/trình duyệt (Phase 10, 2026-08-14)

**Sự cố PM phản hồi:** dùng 2 máy đăng nhập cùng lúc — máy A mở chuông đọc 1 thông báo thì máy B
cũng tự thấy thông báo đó "đã đọc" theo (badge giảm số), dù máy B chưa từng nhìn thấy nội dung đó.
Nguyên nhân: cờ `is_read` (Phase 8, mục 33) nằm THẲNG trên bảng `notifications` — 1 cờ DUY NHẤT
dùng chung cho mọi người/mọi máy, không phân biệt ai đọc.

**Đã sửa — thêm bảng `notification_reads`** (`05_Database/10_supabase_setup_phase10.sql`, PM cần
tự chạy migration này trước khi dùng): 1 dòng = "thiết bị X đã đọc thông báo Y"
(`primary key(notification_id, device_id)`, `on delete cascade` theo `notifications.id`). Cột
`is_read`/`read_at` CŨ trên `notifications` **giữ nguyên trong DB, không xóa** (không dùng nữa,
không có tác dụng phụ khi bỏ không đọc/không ghi vào đó nữa).

**`DEVICE_ID`** (`admin.html`, hàm `getDeviceId()` ngay sau `idbSet()`, khu vực "TIỆN ÍCH CHUNG"):
mỗi trình duyệt tự sinh 1 mã ngẫu nhiên (`crypto.randomUUID()`) lúc tải trang lần đầu, lưu cố định
vào `localStorage` (key `tv5s_device_id`) — các lần mở lại sau dùng lại đúng mã cũ, đổi trình duyệt/
xóa dữ liệu trình duyệt thì coi như "máy khác" (thông báo cũ đã đọc trên máy cũ sẽ hiện lại là chưa
đọc trên "máy mới" này, đây là đánh đổi hợp lý vì không có tài khoản riêng cho mỗi nhân viên để gắn
vào). **Bọc try/catch** — nếu `localStorage` bị chặn (trình duyệt ẩn danh nghiêm ngặt...) vẫn trả về
1 mã tạm dùng được trong phiên, KHÔNG được để lỗi ở đây chặn mất toàn bộ code phía sau (nguyên tắc
đã áp dụng cho `idbSet` từ Phase 8, mục 33) — bài học thật gặp lúc tự test: quên bọc try/catch làm
`localStorage` lỗi trong 1 sandbox test khiến toàn bộ script sau dòng đó không chạy được.

**3 hàm đổi cách đọc/ghi trạng thái đã đọc** (`admin.html`):
- `loadNotifications()`: gọi thêm 1 API `notification_reads?device_id=eq.<DEVICE_ID>` song song
  với API `notifications` có sẵn, gộp lại thành cờ `is_read` tính riêng cho thiết bị này (KHÔNG
  dùng cột `is_read` gốc trả về từ `notifications` nữa).
- `onNotifClick()`: đổi từ `PATCH notifications.is_read` sang `POST notification_reads` (upsert qua
  `on_conflict=notification_id,device_id` + `Prefer: resolution=merge-duplicates` — bấm nhiều lần
  không lỗi, không tạo trùng).
- `markAllNotifRead()`: cùng cơ chế nhưng gửi 1 mảng nhiều dòng (mọi thông báo đang chưa đọc CỦA
  THIẾT BỊ NÀY) trong 1 lần POST.
- `deleteSelectedNotifications()` **KHÔNG đổi** — xóa thông báo vẫn là hành động CHUNG (xóa khỏi
  `notifications` cho mọi máy luôn, kèm tự xóa các dòng `notification_reads` liên quan nhờ
  `on delete cascade`) — chỉ riêng "đã đọc/chưa đọc" mới tách theo máy, không tách luôn cả xóa.

**`sw-admin.js` (Service Worker, nhận Web Push khi tắt hẳn trình duyệt)** cũng sửa tương tự: đọc
`device_id` từ IndexedDB (ghi vào cùng lúc với `refresh_token`, xem `idbSet('device_id',...)` ở
`admin.html`) rồi tự lọc "chưa đọc" theo đúng thiết bị này trước khi hiện thông báo hệ thống —
tránh trường hợp máy A đã đọc làm máy B tưởng nhầm là "không còn gì mới" nên im lặng không hiện gì.

**Đã test qua Claude Browser** (mock hàm `api()` giả lập 2 bảng `notifications`/`notification_reads`
trong bộ nhớ, gọi trực tiếp `loadNotifications()`/`onNotifClick()`/`markAllNotifRead()`): đọc 1
thông báo trên "thiết bị này" chỉ tạo đúng 1 dòng `notification_reads` gắn với `DEVICE_ID` thật của
máy đang test, dò trực tiếp trong dữ liệu giả lập xác nhận KHÔNG có dòng nào gắn với 1 mã thiết bị
khác — tức thiết bị khác vẫn sẽ thấy đúng thông báo đó là chưa đọc. Badge số giảm đúng 2→1→0 qua 3
bước (tải/đọc 1 dòng/đánh dấu tất cả đã đọc).

**⚠️ Nếu sau này cần thêm hành vi tương tự** (vd 1 tính năng khác cần "trạng thái riêng theo máy"):
copy đúng mẫu bảng phụ `(id_gốc, device_id)` + `DEVICE_ID`/`getDeviceId()` này, đừng quay lại kiểu
1 cờ chung trên bảng gốc như `notifications.is_read` cũ.

## 39. `worker.js`: quét lùi 7 ngày để tự bắt lại thông báo bị bỏ sót (2026-08-14)

**Lý do:** trước đây 3/4 loại thông báo (`tra_kq`/`nhac_tuvan`/`xlps`) chỉ hỏi Supabase "đúng ngày
HÔM NAY" — nếu Worker/khóa `SUPABASE_SERVICE_ROLE_KEY` bị lỗi (sự cố thật đã gặp 12-14/8/2026, xem
mục 35) thì qua ngày là **mất vĩnh viễn**, không có cách nào tự thông báo bù lại, dù sự cố đã được
sửa. PM xác nhận muốn có "lớp an toàn" tự bắt lại trường hợp này.

**Đã sửa:** thêm hằng số `BACKFILL_DAYS = 7` + hàm `isoDaysAgo(todayIso, days)`, đổi cả 3 câu query
từ `=eq.<hôm nay>` sang khoảng `gte.<hôm nay-7 ngày> .. lte.<hôm nay>` (`tra_kq` theo `ngay_tra_kq`,
`nhac_tuvan` theo `ngay_nhac_lai`, `xlps` theo `han_chot`). **An toàn để nới rộng khoảng ngày** vì
ràng buộc `unique(loai,ref_id,ref_ngay)` + `resolution=ignore-duplicates` ở bước upsert đã tự chặn
tạo trùng cho combo NGÀY+HỒ SƠ đã từng thông báo thành công — nới ngày chỉ giúp **bắt thêm** đúng
phần còn thiếu (chưa từng có dòng `notifications` tương ứng), không tạo lại/gửi lại cái đã có.
Loại `dang_ky_moi` (thứ 4) **không cần sửa** — đã tự an toàn từ trước nhờ lấy 200 lead mới nhất
theo `created_at` (không giới hạn "hôm nay"), xem comment sẵn có trong code.

**Tự giới hạn theo trạng thái nên không "hồi sinh" việc đã xử lý xong:** `tra_kq`/`xlps` vẫn giữ
điều kiện lọc trạng thái cũ (`Đã nộp`/`Đang xử lý`) — hồ sơ 5 ngày trước đã được xử lý xong (đổi
sang `Đậu`/`Rớt`/`Hoàn thành`...) sẽ tự không còn khớp query nữa, không bị bắt lại tạo thông báo vô
nghĩa cho việc đã xong.

**Không đổi nội dung thông báo** (`noi_dung`) để phân biệt "đúng hôm nay" hay "bắt lại từ hôm
trước" — giữ đúng 1 định dạng như cũ cho cả 3 loại, tránh lệch với các thông báo tạo đúng ngày.
`ref_ngay` lưu đúng ngày gốc (`ngay_tra_kq`/`ngay_nhac_lai`/`han_chot` thật của dòng đó) nên nếu
sau này cần hiển thị "quá hạn từ ngày nào" thì đã có sẵn dữ liệu, chỉ cần sửa phần hiển thị.

**⚠️ Nếu sau này cần đổi số ngày quét lùi:** chỉ cần đổi giá trị `BACKFILL_DAYS`, không cần sửa gì
thêm ở 3 câu query (đều tham chiếu qua biến `backfillFrom` tính từ hằng số này).

## 40. Bỏ nút "Bật/Tắt thông báo đẩy" thủ công — tự hỏi quyền 1 lần lúc đăng nhập lần đầu (2026-08-18)

**Lý do:** PM yêu cầu bỏ nút bấm thủ công trong panel chuông (`#notifPushBtn`/`togglePushSubscription()`,
mục 33.D cũ) — người dùng dễ quên bấm, dẫn tới tưởng "không có thông báo" trong khi thực ra chỉ là
chưa từng bật quyền. Đổi sang tự động hỏi ngay sau khi đăng nhập thành công lần đầu trên máy đó.

**Đã xóa hẳn:** nút `#notifPushBtn` + khối `.notif-push-row` (HTML+CSS), hàm `refreshPushButtonLabel()`
(không còn nút để cập nhật nhãn), và nhánh "tắt" (unsubscribe) trong `togglePushSubscription()` —
**từ nay KHÔNG còn cách tắt push trong app nữa**, muốn tắt phải vào cài đặt thông báo của trình
duyệt/điện thoại cho đúng trang `topvisa5s.com` (giống mọi web app khác) — quyết định có chủ đích
theo đúng yêu cầu "bỏ chức năng bật HOẶC tắt", không phải thiếu sót.

**Hàm mới `subscribePush()`** (đổi tên từ nhánh "bật" cũ trong `togglePushSubscription()`, giữ
nguyên logic xin quyền + `pushManager.subscribe()` + lưu `push_subscriptions`) + **`maybeAskPushPermission()`**
(gọi ngay sau `startNotifPolling()`, CẢ 2 luồng: đăng nhập thường + tự đăng nhập lại):
- `Notification.permission==='denied'` → thoát ngay, không hiện gì (trình duyệt tự chặn xin lại,
  hiện popup chỉ gây khó chịu vô ích).
- `Notification.permission==='granted'` → gọi thẳng `subscribePush()` âm thầm (không hỏi lại,
  `subscribePush()` tự kiểm tra đã có subscription chưa trước khi làm gì) — phòng trường hợp quyền
  đã cho từ trước nhưng dòng `push_subscriptions` bị mất (đổi máy, xóa DB tay...).
- `Notification.permission==='default'` (chưa từng hỏi) → kiểm tra cờ `localStorage['tv5s_push_asked']`:
  đã hỏi rồi (dù đồng ý hay bấm "Bỏ qua") thì KHÔNG hỏi lại nữa, tránh làm phiền mỗi lần mở app;
  chưa từng hỏi thì hiện `showConfirmPopup()` (câu hỏi bằng UI riêng của trang, không phải popup hệ
  thống) giải thích lý do, bấm "Bật thông báo" trong popup NÀY chính là thao tác bấm hợp lệ để gọi
  `Notification.requestPermission()` ngay sau — **trình duyệt vẫn bắt buộc phải có 1 thao tác bấm
  thật của người dùng mới cho xin quyền** (không thể tự động hỏi ngầm lúc tải trang, đây là giới hạn
  cứng của trình duyệt, không phải giới hạn của code) — cách làm 2 lớp "popup riêng → popup hệ
  thống" này giải quyết đúng yêu cầu "tự hỏi lúc mở app lần đầu" mà vẫn hợp lệ với trình duyệt.
- Cờ `tv5s_push_asked` đọc/ghi qua `try/catch` (không dùng trực tiếp `localStorage.x` không bọc) —
  cùng nguyên tắc với `getDeviceId()` (mục 38): lỗi ở đây (trình duyệt ẩn danh chặn storage...)
  không được phép làm rớt luồng đăng nhập chính; chấp nhận đánh đổi hỏi lại mỗi lần mở app trên máy
  bị chặn storage, còn hơn crash.

**Đã test qua Claude Browser** (mock `Notification.permission`/`navigator.serviceWorker`/
`localStorage`/`showConfirmPopup`/`subscribePush`, gọi trực tiếp `maybeAskPushPermission()`): xác
nhận đủ 5 tình huống — permission `denied` (không hỏi, không subscribe), `granted` (subscribe thẳng,
không hỏi), `default` lần đầu bấm "Bật" (hỏi đúng 1 lần + subscribe), gọi lại ngay sau đó (không
hỏi lại nữa), `default` lần đầu bấm "Bỏ qua" (hỏi 1 lần, KHÔNG subscribe, nhưng vẫn ghi nhận đã hỏi
nên không hỏi lại lần sau).

## 41. Tài chính/Dashboard: "Lợi nhuận" mở rộng sang Rớt/Hủy, KHÔNG trừ Khoản chi nữa (2026-08-18)

**Trước đây** (mục 27): "Lợi nhuận" (cả ở Tài chính và Dashboard) = tổng `loi_nhuan` của hồ sơ
**CHỈ** `trang_thai='Đậu'` trong kỳ, TRỪ ĐI tổng `khoan_chi` cùng kỳ.

**PM yêu cầu đổi lại:** "Lợi nhuận" = **tổng `loi_nhuan`** của hồ sơ có `trang_thai` ∈
**{Đậu, Rớt, Hủy}** (mở rộng thêm Rớt/Hủy — các hồ sơ này vẫn có thể ghi nhận lợi nhuận, kể cả
**lỗ/giá trị ÂM**, vẫn phải tính vào tổng), lọc bỏ hồ sơ `loi_nhuan` bằng 0 (hoặc null). **KHÔNG còn
trừ "Khoản chi" nữa** — "Khoản chi" (`khoan_chi`) vẫn hiển thị/quản lý như cũ (CRUD, list, nút Sửa/
Xóa không đổi gì), chỉ tách riêng ra khỏi phép tính "Lợi nhuận", không cộng/trừ chung nữa.

**Đã sửa 2 nơi (PHẢI khớp nhau, xem lại đúng nguyên tắc mục 27):**
- `loadTaiChinh()`/`renderTaiChinh()` (`admin.html`): đổi filter API `ho_so` từ
  `trang_thai=eq.Đậu` → `trang_thai=in.(Đậu,Rớt,Hủy)` + thêm `loi_nhuan=neq.0` (Postgres tự loại cả
  `null` vì so sánh với `null` không đúng cũng không sai — không cần thêm điều kiện `is not null`
  riêng). `loiNhuan` đổi từ `tongThu - tongChi` → chỉ còn `tongThu`. Đổi nhãn thống kê "Số hồ sơ đậu
  trong kỳ" → **"Số hồ sơ tính lợi nhuận trong kỳ"** (không còn chỉ đúng nghĩa "đậu" nữa).
- `loadDashboard()`/`renderDashboard()`: **bỏ hẳn lệnh gọi API `khoan_chi`** (không còn cần dùng
  cho phép tính này nữa — tránh gọi API dư thừa không dùng tới). Đổi công thức `loiNhuanThangNay`
  sang lọc `HO_SO` đã nạp sẵn theo đúng 3 trạng thái + `loi_nhuan!=0`, bỏ hẳn biến `chiThangNay`.

**Sửa thêm 1 lỗi hiển thị màu phát sinh do mở rộng phạm vi:** dòng list ở Tài chính (`#tcBody`)
trước đây tô MÀU XANH cứng cho mọi dòng "Thu" (vì trước đây chỉ có hồ sơ Đậu, `loi_nhuan` luôn
dương, không cần phân biệt dấu). Giờ hồ sơ Rớt/Hủy có thể mang `loi_nhuan` ÂM — đã sửa màu theo
đúng DẤU THẬT của số tiền (`r.so_tien<0` → đỏ) thay vì theo `loai==='Thu'` cứng, để 1 dòng lỗ không
bị hiển thị nhầm thành màu xanh "lợi nhuận dương".

**Đã test qua Claude Browser** (mock `api()` cho `loadTaiChinh()`, mock `HO_SO` cho
`renderDashboard()`): xác nhận đúng — hồ sơ `loi_nhuan=0` bị loại khỏi cả list và tổng; hồ sơ
`Đang xử lý`/hồ sơ có `ngay_tra_kq` ngoài khoảng lọc bị loại đúng; dòng Rớt có `loi_nhuan` âm hiện
màu đỏ (`var(--err)`) trong khi dòng Đậu/Rớt dương hiện xanh (`var(--ok)`); "Khoản chi" vẫn hiển thị
độc lập, không còn bị trừ vào "Lợi nhuận"; số Dashboard khớp đúng số tính tay từ cùng dữ liệu.

**⚠️ Nếu PM phản hồi muốn "Lợi nhuận" trừ lại "Khoản chi" như cũ** (vd sau khi thấy số liệu thực
tế) — chỉ cần đổi lại `const loiNhuan = tongThu;` → `const loiNhuan = tongThu - tongChi;` ở
`renderTaiChinh()` + khôi phục đúng logic trừ tương ứng ở `renderDashboard()`/`loadDashboard()` (đưa
lại lệnh gọi API `khoan_chi`) — không tự ý đổi lại nếu PM chưa yêu cầu rõ, đây là quyết định có
chủ đích lần này, không phải lỗi bỏ sót.

## 42. Màn "Hồ sơ": sort mặc định theo 3 tầng ưu tiên, "Đậu/Rớt/Hủy" GỘP CHUNG 1 nhóm (2026-08-18)

**Bối cảnh — 2 lượt yêu cầu liên tiếp cùng ngày, lượt 2 chỉnh lại lượt 1:** lượt đầu PM yêu cầu tách
riêng "Đã nộp" sort theo Ngày trả KQ (còn 4 trạng thái khác vẫn sort theo Ngày tạo, mỗi trạng thái
vẫn là 1 khối riêng theo đúng thứ tự cũ `Đang xử lý→Đã nộp→Đậu→Rớt→Hủy`). Ngay sau đó PM đưa ví dụ
cụ thể cho thấy **"Đậu"/"Rớt"/"Hủy" phải GỘP CHUNG thành 1 nhóm duy nhất** (không tách 3 khối riêng
theo trạng thái rồi mới sort ngày trong từng khối) — bản mục 42 gốc đã SAI ở điểm này, đã sửa lại
ngay, không giữ lại bản cũ.

**Sort mặc định (chưa bấm cột nào) — đúng 3 tầng ưu tiên:**
1. **"Đang xử lý"** — trong nhóm, sort `Ngày tạo` (`ngay`) CŨ → MỚI.
2. **"Đã nộp"** — trong nhóm, sort `Ngày trả KQ` (`ngay_tra_kq`) GẦN NHẤT (hôm nay/quá hạn) → XA
   NHẤT (tương lai).
3. **"Đậu"/"Rớt"/"Hủy" GỘP CHUNG 1 NHÓM** (không phân biệt 3 trạng thái này với nhau) — sort
   `Ngày tạo` CŨ → MỚI, **xen kẽ lẫn nhau giữa 3 trạng thái đúng theo ngày** — ví dụ đúng theo PM
   đưa: Hủy 01/8, Rớt 03/8, Đậu 05/8, Hủy 09/8, Rớt 12/8, Đậu 15/8 (SAI nếu xếp hết "Hủy" rồi mới
   tới "Rớt" rồi "Đậu").

**Đã sửa — cách làm chỉ cần đổi 1 chỗ, không cần viết lại logic so sánh:**
```js
// Đậu/Rớt/Hủy CÙNG giá trị 3 (không phải 3/4/5 riêng biệt như bản đầu) -> primary sort coi 3
// trạng thái này là NGANG NHAU (oa===ob), rơi thẳng xuống nhánh so theo `ngay` chung 1 dãy duy nhất
// thay vì tách thành 3 khối riêng.
const HS_STATUS_ORDER = {'Đang xử lý':1,'Đã nộp':2,'Đậu':3,'Rớt':3,'Hủy':3};
...
rows.sort((a,b)=>{
  const oa=HS_STATUS_ORDER[a.trang_thai]||99, ob=HS_STATUS_ORDER[b.trang_thai]||99;
  if(oa!==ob) return oa-ob;
  if(a.trang_thai==='Đã nộp') return (a.ngay_tra_kq||'').localeCompare(b.ngay_tra_kq||'');
  return (a.ngay||'').localeCompare(b.ngay||''); // áp dụng cho cả "Đang xử lý" VÀ khối Đậu/Rớt/Hủy gộp
});
```
Chỉ đổi nhánh SORT MẶC ĐỊNH này — **không đổi** hành vi bấm tiêu đề cột để sort thủ công
(`applySort('hs', ...)`, nhánh `if(SORT_STATE['hs'])`), người dùng vẫn bấm cột "Ngày trả KQ"/"Ngày"
để tự sort theo ý mình như trước, không bị ảnh hưởng. `HS_STATUS_ORDER` chỉ dùng đúng 2 chỗ trong
file (khai báo + so sánh này) nên đổi giá trị không ảnh hưởng gì khác.

**Đã test qua Claude Browser** (mock `HO_SO` đủ cả 3 tầng, xáo trộn thứ tự dữ liệu đầu vào, riêng
tầng 3 dùng ĐÚNG ví dụ PM đưa nhưng shuffle input để kiểm tra sort thật hoạt động — không chỉ trùng
hợp đúng vì dữ liệu vào đã đúng thứ tự): kết quả ra ĐÚNG in ra Hủy(01/8)→Rớt(03/8)→Đậu(05/8)→
Hủy(09/8)→Rớt(12/8)→Đậu(15/8), xen kẽ đúng như ví dụ, không nhóm theo trạng thái. 2 tầng đầu
("Đang xử lý" theo Ngày tạo, "Đã nộp" theo Ngày trả KQ) vẫn đúng như lượt sửa trước.

## 43. Sửa lỗi thật: thông báo đẩy không tới điện thoại dù chuông trong trang vẫn cập nhật (2026-08-18)

**Sự cố PM phản hồi:** chuông thông báo trong `admin.html` vẫn tự cập nhật đúng (đọc thẳng bảng
`notifications`, không phụ thuộc push) nhưng điện thoại KHÔNG nhận được thông báo đẩy ra màn hình
khóa dù không mở app — tính năng Web Push (mục 33) **từ lúc dựng (2026-08-10) tới nay chưa từng có
xác nhận thật hoạt động trên thiết bị thật** (luôn ghi "chưa/không thể kiểm chứng" ở các mục trước).

**Bug tìm thấy trong `subscribePush()` (`admin.html`, đổi tên từ `togglePushSubscription()` ở mục
40):** nếu trình duyệt ĐÃ có sẵn 1 `PushSubscription` object (`reg.pushManager.getSubscription()`
trả về khác `null` — vd do đã từng subscribe ở lần test/phiên trước), hàm **return ngay, KHÔNG lưu
gì vào bảng `push_subscriptions` cả**. Nếu dòng tương ứng trong bảng đó từng bị xóa/chưa từng được
lưu thành công (vd do sự cố `SUPABASE_SERVICE_ROLE_KEY` sai ở mục 35, hoặc `push_subscriptions`
từng bị dọn do 410 Gone ở `worker.js`) → trình duyệt "tưởng" mình đã đăng ký (nên không hỏi lại
quyền, không báo lỗi gì) nhưng **server hoàn toàn không biết thiết bị này tồn tại** → `worker.js`
lặp qua `push_subscriptions?select=*` không thấy dòng nào của máy này → không gửi push tới được.
Đây khớp ĐÚNG 100% triệu chứng "chuông cập nhật (đọc DB trực tiếp, không qua push) nhưng điện thoại
im lặng" — vì 2 luồng này hoàn toàn độc lập nhau.

**Đã sửa:** `subscribePush()` giờ **LUÔN LUÔN** thực hiện bước lưu/đồng bộ lại
`push_subscriptions` (POST `on_conflict=endpoint` + `resolution=merge-duplicates` — an toàn 100%,
không tạo trùng, không hại gì nếu dòng đã tồn tại đúng) mỗi lần được gọi — chỉ bỏ qua đúng 2 bước
"xin quyền `Notification`" + "gọi `pushManager.subscribe()` tạo mới" khi trình duyệt đã có sẵn
subscription object. Nhờ đó: mỗi lần đăng nhập (`maybeAskPushPermission()` gọi `subscribePush()`
mỗi lần `Notification.permission==='granted'`, tức MỌI lần mở app sau khi đã cấp quyền — xem mục
40) sẽ tự "vá" lại dòng `push_subscriptions` nếu nó từng bị mất, không cần người dùng phải chủ động
làm gì. Đồng thời thêm toast báo lỗi rõ ràng khi bị từ chối quyền `Notification` (trước đây `return`
im lặng, không có tín hiệu gì cho người dùng biết là đã thất bại).

**Đã test qua Claude Browser** (mock `navigator.serviceWorker`/`PushManager`/`Notification`/`api()`/
`toast()`, gọi trực tiếp `subscribePush()`): (1) giả lập ĐÃ có sẵn `PushSubscription` ở trình duyệt
— xác nhận vẫn gọi đúng `POST push_subscriptions` để đồng bộ lại (trước đây sẽ KHÔNG gọi gì cả,
đây chính là bug), (2) giả lập quyền bị từ chối — xác nhận hiện đúng toast lỗi, không gọi API nào.

**⚠️ Các nguyên nhân KHÁC có thể vẫn góp phần, KHÔNG kiểm chứng được từ code/máy chủ CI, cần PM tự
kiểm tra trên đúng thiết bị thật đang test:**
- **iPhone/Safari:** Web Push CHỈ hoạt động khi trang đã "Thêm vào màn hình chính" (Add to Home
  Screen) và mở TỪ ICON đó (không phải tab Safari thường) + iOS bản 16.4 trở lên. Mở qua tab Safari
  thường thì `'PushManager' in window` sẽ luôn `false`, không có cách nào bật được bằng code.
- **Android:** từ Android 13, hệ điều hành có thêm 1 lớp quyền thông báo CẤP HỆ THỐNG riêng cho
  từng app/trình duyệt (Cài đặt → Ứng dụng → Chrome → Thông báo) — nếu quyền này bị tắt ở tầng OS,
  web code không có cách nào ghi đè, permission JS vẫn báo `granted` nhưng hệ thống vẫn chặn hiện.
- Khóa `VAPID_PRIVATE_KEY_JWK` trên Cloudflare Worker (đã xác nhận CÓ tồn tại qua ảnh chụp PM gửi
  lúc debug mục 35, nhưng GIÁ TRỊ chưa từng verify) — nếu sai/hỏng, `worker.js` gọi push tới đúng
  endpoint nhưng bị dịch vụ push (FCM/Mozilla...) trả lỗi 401/403, chỉ thấy được qua Cloudflare
  Logs (Observability → Logs, bật lên rồi đợi 1 lượt cron ~10 phút, đúng lúc có thông báo mới).

## 44. Review lại toàn bộ thay đổi phiên 14/8+18/8 — 2 lỗi thật tìm thêm được, đã sửa (2026-08-18)

Sau khi làm xong mục 35-43, chạy 1 agent review riêng (không nhớ gì về quá trình code, chỉ đọc diff)
để soát lại toàn bộ thay đổi 2 phiên — tìm thêm được 2 lỗi thật, cả 2 đã sửa ngay:

**A. `sw-admin.js` — thiết bị chưa từng ghi `device_id` vào IndexedDB sẽ bị NHẬN LẶP LẠI thông báo
cũ mỗi lần có push mới, thay vì bị bỏ sót (như tưởng lúc đầu):** ở `handlePush()`, nếu
`idbGet('device_id')` trả về `null` (thiết bị đã cài PWA từ TRƯỚC Phase 10, Service Worker tự cập
nhật bản mới ở tầng nền nhưng người dùng chưa mở lại `admin.html` lần nào để `admin.html` ghi
`device_id` vào IndexedDB), code cũ coi `readIds` là rỗng — nghĩa là COI TẤT CẢ thông báo gần đây là
"chưa đọc", nên cứ có 1 push mới tới là hiện lại luôn vài thông báo CŨ đã xem rồi, lặp đi lặp lại
mỗi ~10 phút hễ có ai đó tạo thông báo mới bất kỳ loại nào. Đã sửa: nếu `deviceId` là `null` thì
dùng luôn thông báo dự phòng chung `fallback()` (giống trường hợp lỗi refresh token) — AN TOÀN hơn
là đoán sai trạng thái đã đọc theo hướng "hiện lại đồ cũ".

**B. `admin.html` `exportTuVanExcel()` — bấm "Xuất Excel" im lặng không làm gì nếu CDN SheetJS tải
lỗi:** bản CSV cũ (trước mục 37) không phụ thuộc thư viện ngoài nên không thể lỗi kiểu này; bản
Excel mới nếu mạng chặn/lỗi lúc tải `<script src="...jsdelivr.net/npm/xlsx...">` thì biến `XLSX`
sẽ không tồn tại, bấm nút ném lỗi JS không bắt được, người dùng (không biết lập trình) chỉ thấy nút
"không phản ứng gì", không hiểu vì sao. Đã sửa: kiểm tra `typeof XLSX==='undefined'` trước, báo toast
rõ ràng ("Không tải được thư viện xuất Excel...") + bọc `try/catch` quanh toàn bộ phần dựng file.

**Đã test qua Claude Browser:** giả lập `XLSX===undefined` lúc gọi `exportTuVanExcel()` — xác nhận
hiện đúng toast lỗi, không ném exception ra ngoài. `sw-admin.js` chỉ sửa qua đọc code + kiểm tra
cú pháp (`node --check`) — không mô phỏng được Service Worker thật trong môi trường agent.

**⚠️ Bài học cho các phiên sau:** sau 1 đợt code nhiều thay đổi dồn dập (như 2 phiên 14/8+18/8 này),
nên chạy lại 1 lượt review độc lập (agent khác, không mang theo bối cảnh lúc code) trước khi coi là
xong — agent review đã tìm ra 2 lỗi thật mà lúc code không phát hiện, dù mỗi thay đổi lúc đó đều đã
tự test riêng lẻ (lỗi (A) chỉ lộ ra khi nhìn tổng thể luồng "thiết bị cũ + Service Worker tự cập
nhật ngầm", lỗi (B) chỉ lộ ra khi nghĩ tới "CDN có thể lỗi" — cả 2 đều dễ bị bỏ sót nếu chỉ test
đường happy-path bằng dữ liệu giả lập tự tay viết).

## 45. Tìm ra nguyên nhân gốc thật: thiếu migration Phase 9 → toàn bộ thông báo lỗi từ 11/8 (2026-08-19)

**Kết luận cuối cùng cho vấn đề "thông báo không hoạt động" đã theo đuổi suốt mục 35/38/39/43/44:**
sau khi đã sửa hết các lỗi code liên quan (timezone, backfill, per-device read, subscribePush,
sw-admin.js...), PM vẫn báo test thật (đăng ký tư vấn ở trang chủ, đợi 20 phút) **KHÔNG có gì cả**
— cả chuông trong trang lẫn điện thoại. Tra bảng `notifications` trên Supabase: dòng mới nhất vẫn
là `id=117` từ **2026-08-11**, xác nhận **worker.js không tạo được BẤT KỲ thông báo nào** suốt hơn
1 tuần — không phải lỗi push/hiển thị nữa, mà lỗi ngay ở bước sinh thông báo.

**Truy ra bằng Cloudflare Observability → Logs** (bật "Logs" lên, đợi 1 lượt cron, đọc log thật —
cách làm này nên áp dụng SỚM hơn cho các sự cố tương tự sau này, thay vì đoán qua nhiều vòng):
```
Supabase notifications?on_conflict=loai,ref_id,ref_ngay -> HTTP 400:
{"code":"PGRST204","details":null,"hint":null,
 "message":"Could not find the 'ref_parent_id' column of 'notifications' in the schema cache"}
```
**Nguyên nhân gốc: migration `05_Database/09_supabase_setup_phase9.sql` (thêm cột `ref_parent_id`,
viết từ 2026-08-10 cùng lúc với code loại thông báo "Xử lý phát sinh") CHƯA TỪNG được chạy trên
Supabase.** Vì `worker.js` gửi kèm `ref_parent_id` trong object của **CẢ 4 loại thông báo** (không
chỉ riêng `xlps`, xem mục 34.C), thiếu đúng 1 cột này làm **toàn bộ** lượt insert (dù chỉ 1 loại có
dữ liệu mới) bị PostgREST từ chối cả batch — giải thích tại sao ngay cả `dang_ky_moi` (không liên
quan gì tới `ref_parent_id` về mặt ý nghĩa) cũng bị ảnh hưởng.

**Vì sao bị bỏ sót lâu vậy — bài học về quy trình bàn giao:** Handover bản 6 (viết 2026-08-10) đã
liệt kê rõ "cần chạy `09_supabase_setup_phase9.sql`" trong mục "Việc cần làm ngay", nhưng khi viết
đè các bản handover sau (bản 7, bản 8 — cả 2 do phiên này viết, tập trung vào Phase 10/timezone/
push mới) — **việc tồn đọng này không được mang qua**, coi như đã xong mà không xác nhận lại. Kết
hợp với sự cố khóa `SUPABASE_SERVICE_ROLE_KEY` sai cùng thời điểm (mục 35) càng làm khó phân biệt
"lỗi do khóa" hay "lỗi do thiếu migration" — cả 2 CÙNG tồn tại song song, sửa khóa xong vẫn chưa hết
lỗi. **Quy tắc rút ra:** mỗi khi viết `Handover_Phien_Moi.md` bản mới (dù là "ghi đè hoàn toàn"),
PHẢI tự hỏi "còn migration/thao tác thủ công nào của các phase TRƯỚC vẫn chưa xác nhận đã chạy
xong chưa" trước khi bỏ qua — không tự động coi các mục cũ đã đóng chỉ vì bản mới không nhắc lại.
Xem quy tắc mới thêm ở `05_Database/README.md`.

**Đã khắc phục:** PM tự chạy `09_supabase_setup_phase9.sql` trong SQL Editor (file idempotent, an
toàn) — PM xác nhận sau đó thông báo hoạt động đúng (cả chuông và điện thoại).

**Việc phụ phát sinh — công cụ backup dữ liệu bị lỗi do cấu trúc DB thay đổi:** cùng lúc điều tra,
phát hiện `06_Backup_Tool/backup-supabase.mjs` (script backup tay, xem mục "06_Backup_Tool") có 2
vấn đề cần sửa:
1. Danh sách bảng `TABLES` (17 bảng) chưa có bảng mới `notification_reads` (Phase 10) — backup bị
   thiếu 1 bảng, không đồng bộ với schema DB hiện tại.
2. `notification_reads` dùng khóa chính GHÉP (`notification_id`+`device_id`), KHÔNG có cột `id` đơn
   như 17 bảng còn lại — hàm `fetchAllRows()` cũ hardcode `order=id.asc` để phân trang ổn định, nếu
   thêm bảng này vào `TABLES` mà không sửa gì thêm sẽ lỗi (hoặc phân trang sai, có thể lặp/thiếu
   dòng nếu Postgres không đảm bảo thứ tự khi không có `ORDER BY` xác định).

**Đã sửa** `backup-supabase.mjs`: thêm `notification_reads` vào `TABLES` (giờ 18 bảng), thêm object
`ORDER_BY` khai báo cột sắp xếp riêng cho bảng không có `id` đơn
(`notification_reads: 'notification_id.asc,device_id.asc'`), `fetchAllRows()` đọc
`ORDER_BY[table] || 'id.asc'` thay vì hardcode. Đã test bằng cách copy ra thư mục tạm NGOÀI dự án,
mock `fetch`, xác nhận cả 18 bảng đều tạo đúng URL (17 bảng cũ vẫn `order=id.asc` như trước, bảng
mới dùng đúng `order=notification_id.asc,device_id.asc`).

**Đã cập nhật tài liệu để tránh lặp lại (PM yêu cầu):**
- `05_Database/README.md` mục "Quy tắc khi thêm migration mới": thêm quy tắc bắt buộc — tạo bảng
  mới PHẢI đồng thời cập nhật `TABLES`/`ORDER_BY` trong `backup-supabase.mjs`, không phải bước tự
  động, dễ quên nếu chỉ nhớ chạy SQL.
- `05_Database/README.md`: thêm hẳn 1 đoạn kể lại sự cố migration 09 bị bỏ sót làm bài học quy trình
  bàn giao (xem trên).
- `06_Backup_Tool/README.md`: cập nhật số bảng (17→18), thêm lưu ý khóa `service_role` dùng ở đây
  phải luôn khớp với khóa trên Cloudflare Worker (nếu 1 bên đổi mà quên đổi bên kia sẽ lỗi 401 dù
  cấu trúc DB không sai gì), dẫn link chéo sang mục này.
- `backup-supabase.mjs` (comment đầu mảng `TABLES`): nhấn mạnh rõ 2 việc bắt buộc khi thêm bảng mới
  (thêm vào `TABLES` + khai báo `ORDER_BY` nếu không có cột `id` đơn), không chỉ ghi chung "nhớ thêm
  tên bảng" như bản cũ (quá mơ hồ, không nhắc tới trường hợp `ORDER_BY`).

## 46. Landing page: sửa lỗi thật "bài viết theo Danh mục" bị treo từ 10/8 + dialog bài viết giật
    khi mở/đóng + bắt buộc chọn Danh mục khi lưu bài viết (2026-08-21)

**A. Nguyên nhân thật khiến section "Tin tức"/menu theo Danh mục biến mất khỏi trang chủ:** PM báo
1 bài viết mới không hiện — điều tra ra không chỉ riêng bài đó mà **toàn bộ section "Tin tức" biến
mất luôn**, dù dữ liệu/Danh mục hoàn toàn đúng. Nguyên nhân: script "DANH MỤC BÀI VIẾT ĐỘNG" (mục
31.F, viết 6/8) gọi `closeMobileMenuOnClick(a)` cho mỗi menu item chèn động — hàm này **đã bị xóa**
khi đổi cơ chế đóng menu mobile sang event delegation (mục 34.A, 10/8) nhưng quên dọn lời gọi orphan
này. Hậu quả: mỗi lần tải trang, script build menu/section theo Danh mục chạy tới nhóm ĐẦU TIÊN
(A-Z, "Thủ tục Visa") → tạo menu xong → gọi hàm không tồn tại → `ReferenceError` bị `catch` ở cuối
IIFE nuốt âm thầm → dừng ngay tại đó, không tạo được section nào (kể cả "Thủ tục Visa"), và nhóm xử
lý SAU đó ("Tin tức") không bao giờ được chạy tới — tính năng này treo **từ 10/8 tới nay** mà không
ai biết vì không có console error hiển thị (bị nuốt), giống hệt kiểu sự cố "im lặng không báo lỗi"
đã gặp ở mục 45. Đã sửa: xóa lời gọi orphan này (event delegation trên `#navLinks` đã tự lo việc
đóng menu cho MỌI thẻ `<a>` kể cả link chèn động, không cần gọi riêng — xem mục 34.A).

**⚠️ Bài học lặp lại (đã ghi ở mục 45):** khi xóa/đổi tên 1 hàm dùng chung, PHẢI grep toàn file tìm
hết mọi nơi gọi tới hàm đó trước khi coi là xong — không chỉ sửa đúng chỗ đang làm việc. Lỗi này
đặc biệt nguy hiểm vì nằm trong 1 IIFE có `try/catch` bọc ngoài nuốt lỗi (mục đích ban đầu là để 1
lỗi tải bài viết không làm crash cả trang) — nhưng đồng thời cũng nuốt luôn lỗi lập trình thật, làm
mất hoàn toàn tín hiệu debug. Nếu sau này thêm code mới trong các IIFE có try/catch tương tự (SEO,
category sections...), cân nhắc `console.error(e)` bên trong `catch` (không ảnh hưởng người dùng
cuối, chỉ hiện trong DevTools) thay vì nuốt hoàn toàn im lặng, để dễ debug hơn nếu tái diễn.

**B. Dialog xem chi tiết bài viết bị giật khi mở/đóng — sửa qua 3 lượt (PM phản hồi từng lượt):**
1. **Lượt 1** — đóng dialog nhảy về đầu trang: cơ chế khóa cuộn cũ `html.no-scroll,body.no-scroll
   {overflow:hidden;height:100%}` làm trình duyệt reset `scrollTop` về 0 NGAY LÚC khóa (không phải
   lúc mở khóa) — không thấy vì backdrop popup che, chỉ lộ ra khi đóng dialog. **Đã đổi hẳn kỹ
   thuật khóa cuộn** sang `position:fixed` + `top` âm (mẫu chuẩn kiểu "body-scroll-lock"): lúc khóa
   lưu `window.scrollY` rồi ghim `body{position:fixed}` đứng yên đúng vị trí bằng `top:-scrollY`
   (không đụng gì tới `scrollTop` thật nên không có gì để nhảy); lúc mở khóa gỡ ghim + khôi phục lại
   đúng `scrollTop` đã lưu.
2. **Lượt 2** — khôi phục vị trí lúc đóng vẫn bị animation (không tức thì): `<html>` có
   `scroll-behavior:smooth` (dùng cho menu) áp dụng luôn cho MỌI thay đổi `scrollTop` kể cả gán
   bằng code, không chỉ `scrollTo()`/`scrollIntoView()`. Đổi sang
   `window.scrollTo({top,left,behavior:'instant'})` — tham số `behavior` truyền tường minh luôn
   thắng CSS `scroll-behavior`.
3. **Lượt 3** — mở dialog không về đầu nội dung (giữ vị trí đọc dở từ lần mở trước): thứ tự cũ gán
   `postDetailBody.scrollTop=0` TRƯỚC khi thêm class `show` (lúc dialog còn `display:none`, chưa
   có layout thật). Đổi thứ tự: thêm `show` TRƯỚC, reset `scrollTop=0` SAU — đảm bảo reset diễn ra
   khi dialog đã thật sự hiển thị.

Sau khi review lại toàn bộ 3 lượt sửa (agent review riêng, xem quy tắc mục 44), phát hiện thêm 1
vấn đề tồn tại từ TRƯỚC cả 3 lượt sửa trên (không phải regression mới, nhưng cùng khối CSS vừa
động tới nên sửa luôn): `html.no-scroll{overflow:hidden}` làm thanh cuộn dọc biến mất, khiến nội
dung giãn rộng thêm đúng bằng bề ngang thanh cuộn cũ trên desktop dùng thanh cuộn cổ điển (không
ảnh hưởng mobile — dùng overlay scrollbar không chiếm layout, chiếm 70%+ traffic dự kiến của dự
án) → giật ngang nhẹ lúc mở/đóng dialog. Đã bù bằng `padding-right` = đúng độ rộng thanh cuộn
(`window.innerWidth - document.documentElement.clientWidth`) trong lúc khóa, xóa lúc mở khóa —
kỹ thuật chuẩn các thư viện body-scroll-lock hay dùng.

Toàn bộ logic khóa cuộn cuối cùng nằm trong `initScrollLock()` (cuối script `index.html`) — nếu
sau này cần thêm 1 popup/dialog khác cũng cần khóa cuộn trang nền, thêm class `post-overlay` vào
overlay đó (hàm `check()` tự quét MỌI `.post-overlay` đang `.show`, không hardcode riêng 1 dialog)
hoặc copy nguyên khối `initScrollLock()`/CSS `.no-scroll` nếu overlay đó ở ngoài phạm vi này.

**C. `admin.html` — tab "Bài viết", field "Danh mục" giờ BẮT BUỘC chọn:** đây chính là nguyên nhân
gốc khiến bài viết ở mục A có thể được lưu mà KHÔNG gán Danh mục ngay từ đầu (dù bug ở mục A mới là
lý do làm mất TOÀN BỘ section, không chỉ riêng bài đó) — trước đây field "Danh mục" trong dialog
`postOverlay` không có nhãn "Bắt buộc" và không được validate, chỉ có "Phân loại"/"Tiêu đề" bắt
buộc. Đã thêm `<span class="req-badge">Bắt buộc</span>` + chặn `savePost()` nếu chưa chọn (toast
"Chọn Danh mục"), đổi placeholder `"-- Không chọn --"` → `"-- Chọn --"` cho khớp quy ước mọi field
bắt buộc khác trong file (`optsFromDanhMuc()` và tương tự). **Lưu ý:** bài viết CŨ đã có sẵn
`category_id=null` trong DB (tạo trước khi có validate này) không bị ảnh hưởng tự động — chỉ khi
mở lại để sửa và bấm Lưu thì mới bị chặn buộc phải chọn Danh mục trước.

**Đã test qua Claude Browser** (curl trực tiếp Supabase REST API để xác nhận dữ liệu, đọc/chạy lại
từng đoạn script bằng `javascript_tool` để tái hiện đúng lỗi `ReferenceError`, dựng server tĩnh
local `python -m http.server` để test bản sửa trước khi deploy) + **PM tự test trên browser thật
và điện thoại xác nhận OK** cho cả 3 lượt sửa dialog. Đã chạy 1 lượt review độc lập theo quy tắc
mục 44 sau khi PM xác nhận OK — tìm thêm đúng 1 vấn đề nhẹ (giật ngang do scrollbar, mục B) và đã
sửa luôn trước khi merge.

## 47. Chat Box trang Home — Release 1 (2026-08-28, nhánh `feature/chatbox-release1`)

**Bối cảnh:** PM yêu cầu phân tích khả thi rồi triển khai 1 Chat Box hỗ trợ khách hỏi về dịch vụ
Visa trên `index.html`. Toàn bộ tài liệu (báo cáo khả thi, đặc tả kỹ thuật, chỉ dẫn thực thi) nằm ở
`08_Chatbox/` — đọc `08_Chatbox/Chi_dan_Thuc_hien_Phat_trien_Chatbox.md` trước khi động vào bất kỳ
phần nào của tính năng này, đặc biệt mục 1 (quy trình git bắt buộc: code trên nhánh riêng, chỉ merge
+ deploy production sau khi PM xác nhận rõ ràng "test OK"). **Phạm vi lượt này CHỈ Release 1 (Chat
Box)** — Release 2 (chuyển toàn site sang song ngữ VI/EN) chưa làm, xem `08_Chatbox/Dac_ta_Trien_khai_Chatbox.md`
mục 1.1/9 khi tới lượt đó.

**A. Widget Chat Box (`index.html`)** — nút nổi góc dưới phải, đặt CAO HƠN `.float-contact` (khi
đóng chiếm khoảng 20-78px tính từ đáy màn hình) để không đè nút Zalo/gọi/FB; không đụng
`.scroll-top-btn` (bên trái). Mở Chat Box tự đóng `.float-contact` nếu đang xòe, tránh 2 cụm nút nổi
chồng nhau. Khung chat có công tắc VI/EN RIÊNG của widget (không phải toggle ngôn ngữ toàn site của
Release 2) — chỉ đổi ngôn ngữ nhãn 7 nút hỏi nhanh + placeholder, KHÔNG dịch lại lịch sử chat đã có
(chatbot tự nhận diện ngôn ngữ theo từng câu hỏi, xem mục C).

**7 nút hỏi nhanh trả lời TỨC THÌ, không gọi mạng** (đúng yêu cầu hiệu năng <100ms, khác hẳn ô hỏi
tự do dùng AI chấp nhận 1-3s): 5 câu lấy y nguyên nội dung từ `<section id="faq">` (dịch tay sang
tiếng Anh, không dùng AI dịch tự động — tránh sai lệch số liệu/điều khoản, cùng nguyên tắc JSON-LD
FAQPage ở mục 12) + 1 nút "Bảng giá dịch vụ các nước" (đọc TRỰC TIẾP từ DOM `.card-service` đang
hiển thị — đã được script "GIÁ DỊCH VỤ" cập nhật giá thật hoặc giữ fallback, nên luôn khớp 100% với
những gì khách đang thấy, không cần gọi API riêng) + 1 nút "Để lại số điện thoại tư vấn" (mở form
mini tên+SĐT ngay trong khung chat, validate bằng `isValidPhone()`/`normalizePhone()` có sẵn, gửi đi
dưới dạng 1 tin nhắn tự do bình thường tới `/api/chat` — KHÔNG có endpoint riêng cho việc để lại
thông tin liên hệ, server tự nhận diện SĐT trong tin nhắn). **Sửa nội dung FAQ ở `<section
id="faq">` thì PHẢI sửa lại đồng bộ bản tiếng Việt trong mảng `CHATBOX_QUICK`** (giống nguyên tắc
JSON-LD FAQPage) — bản tiếng Anh không bắt buộc sửa lại ngay nếu chỉ chỉnh nhỏ, nhưng nên rà soát.

Toàn bộ text chèn vào khung chat (tin nhắn khách gõ tự do + câu trả lời AI) đi qua `chatboxEsc()`
trước khi gắn `innerHTML` — **bắt buộc**, đây là nơi DUY NHẤT trong `index.html` hiển thị lại
nguyên văn nội dung do người dùng tự gõ, chưa từng qua kiểm duyệt admin (khác hẳn `posts`/`leads`
hiển thị ở nơi khác đều do admin nhập) — đã test xác nhận `<img src=x onerror=...>` bị escape thành
chữ, không thực thi.

**B. Route `/api/chat` (`worker.js`)** — thêm rẽ nhánh đầu `fetch()`, giữ nguyên 100% hành vi phục
vụ file tĩnh cho mọi request khác (đúng nguyên tắc mục 33 khi thêm code Worker mới). `handleChat()`:
1. Rate limit theo IP (`CF-Connecting-IP`), 8 câu hỏi/60 giây, đếm tạm trong `Map` ở bộ nhớ isolate
   — **best-effort**, không phải giới hạn cứng tuyệt đối (isolate có thể bị Cloudflare hủy/khởi tạo
   lại bất cứ lúc nào) nhưng đủ chống spam thông thường cho quy mô nhỏ hiện tại, đúng theo gợi ý
   "Claude Code chọn cơ chế phù hợp" trong đặc tả — nếu sau này lưu lượng lớn hơn nhiều, cân nhắc
   đếm ở Supabase/Durable Object để chính xác across toàn hạ tầng.
2. Đọc `danh_muc_nuoc` (lệ phí/thời gian/checklist/ghi chú) + `dich_vu_gia` bằng
   `SUPABASE_SERVICE_ROLE_KEY` (2 bảng này KHÔNG mở `anon` đọc, hoặc chỉ mở SELECT công khai riêng
   cho landing page — route `/api/chat` không dùng `anon` key) để ghép vào system prompt — AI CHỈ
   được dùng số liệu trong đó, không tự bịa (system prompt liệt kê rõ quy tắc này).
3. Gọi Cloudflare Workers AI qua binding `env.AI` (đã thêm `[ai]` + `binding = "AI"` vào
   `wrangler.toml` — cú pháp đã xác nhận lại qua tài liệu chính thức Cloudflare 2026-08-28, không
   đoán theo hiểu biết cũ vì cấu hình Cloudflare từng đổi giữa các lần deploy dự án này, xem
   `01_Docs/08_Ban_giao_Claude_Code.md` mục 3). **Model đã chọn: `@cf/meta/llama-3.1-8b-instruct-fast`**
   — model đa ngôn ngữ (phù hợp trả lời song ngữ VI/EN, FR-CB-05), nhẹ/nhanh, phù hợp ngân sách free
   tier 10.000 neuron/ngày (PM xác nhận không gắn thẻ thanh toán, không dùng AI trả phí).
4. Lỗi/hết quota gọi AI (`try/catch` bọc quanh `chatCallAI()`) → rơi về tin nhắn fallback tĩnh song
   ngữ mời gọi hotline/Zalo, KHÔNG throw lỗi trắng trang — đúng FR-CB-14.
5. Ghi 2 dòng `chat_logs` (`role='user'`/`'assistant'`) mỗi lượt hỏi-đáp.

**Nhận diện + lưu lead từ Chatbot (FR-CB-07):** `chatDetectAndCaptureLead()` dò SĐT hợp lệ trong tin
nhắn bằng đúng quy tắc `isValidPhone()`/`normalizePhone()` của `index.html` (viết lại tương đương
trong `worker.js` vì 2 file chạy 2 môi trường khác nhau, không import chung được) + dò tên theo vài
mẫu câu thường gặp (heuristic, fallback "Khách từ Chatbot" nếu không dò được) → tạo `leads`
(`nguon='Từ Chatbot'`). **Chống tạo lead trùng trong cùng 1 phiên:** trước khi tạo mới, luôn kiểm
tra `chat_logs` của `session_id` đó đã có `lead_id` chưa (nếu khách lỡ gõ lại SĐT ở tin nhắn sau).
Sau khi tạo lead mới, `PATCH` ngược `lead_id` cho **MỌI** dòng `chat_logs` cùng `session_id` (kể cả
các dòng ghi TRƯỚC khi phát hiện SĐT) — đúng theo đặc tả mục 5.2 bước 7, để xem lại 1 phiên trong
"Quản lý Chat" thấy đúng liên kết dù khách để lại SĐT ở tin nhắn thứ mấy. Đã sửa
`generateNewNotifications()` (loại `'dang_ky_moi'`) từ `nguon=eq.'Từ Web'` → `nguon=in.("Từ
Web","Từ Chatbot")` để lead từ Chatbot cũng lên chuông/Web Push admin (FR-CB-08).

**C. Bảng `chat_logs` (`05_Database/11_supabase_setup_phase11.sql`)** — **khác 1 điểm so với SQL đề
xuất trong đặc tả:** đặc tả đề xuất thêm policy cho phép `anon` INSERT trực tiếp (phòng trường hợp
client gọi thẳng bằng `anon` key giống `leads` từ form công khai). Sau khi rà soát kiến trúc thực tế
đã chọn — **toàn bộ ghi `chat_logs` đều đi qua `worker.js` bằng `SUPABASE_SERVICE_ROLE_KEY`** (bỏ
qua RLS hoàn toàn), `index.html` KHÔNG bao giờ gọi thẳng `chat_logs` bằng `anon` key — nên đã **bỏ
policy `anon` INSERT** đó, chỉ giữ policy `authenticated` (admin) toàn quyền đọc/sửa/xóa. Giảm bớt 1
bề mặt cho phép ghi công khai không cần thiết, đúng tinh thần bảo mật ở đặc tả mục 3 ("Dữ liệu cá
nhân... chỉ authenticated đọc/xóa được"). Đã thêm `chat_logs` vào `TABLES` của
`06_Backup_Tool/backup-supabase.mjs` (khóa chính đơn `id`, không cần khai báo `ORDER_BY`).

**D. Tab "Quản lý Chat" (`admin.html`, cạnh tab "Tư vấn")** — không có bảng "phiên chat" riêng ở
Supabase; mỗi phiên được GOM NHÓM ngay tại client (`chatGroupSessions()`) từ toàn bộ `chat_logs` đã
tải (`select=*,leads(name,phone)` — embed qua FK `lead_id`, giống cách `posts?select=*,categories(name)`
đã làm) theo `session_id`. Danh sách: thời gian (tin mới nhất trong phiên), tên/SĐT nếu có lead hay
"Chưa để lại thông tin", số tin nhắn, nút "Xem chi tiết"/"Xóa" — có sort theo cột (dùng chung
`onSortClick`/`applySort`, tableKey mới `'chat'`, xem mục 31.G) + tìm theo tên/SĐT qua `vnNorm()`
(mục 13) + lọc theo khoảng ngày (mask `dd/mm/yyyy` chuẩn, mục 19). Dialog "Chi tiết hội thoại"
(`#chatDetailOverlay`) theo đúng `dlg-standard`/`dlg-head`/`dlg-body`/`dlg-foot`
(`01_Docs/10_Chuan_Dialog_Chung.md`) nhưng **KHÔNG áp dụng `snapshotDialog`/`confirmCloseDialog`**
(mục 23) vì đây là dialog THUẦN XEM, không có field nhập liệu nào — giống lý do `#khPickOverlay`
không áp dụng. Xóa (`delChatSession`) dùng `showConfirmPopup({danger:true})` rồi `DELETE
chat_logs?session_id=eq.<sid>` (xóa cả phiên cùng lúc, không xóa từng dòng tin nhắn lẻ).

**Đã test:** `node --check` cho `worker.js` + toàn bộ script inline của `index.html`/`admin.html`
(trích xuất qua regex `<script>` không kèm `type=`, không đụng khối JSON-LD). Unit test riêng 13
case cho 3 hàm regex nhạy cảm nhất (`chatExtractPhone`/`chatExtractName`/`chatGuessLang`) bằng
Node — 13/13 pass. Qua Claude Browser (`javascript_tool`, môi trường chạy nền/chưa composite nên
KHÔNG dùng được `screenshot`/click thật theo tọa độ pixel — xem giới hạn đã ghi ở mục 20): xác nhận
nút Chat Box mở/đóng, tự đóng `.float-contact`, 7 nút hỏi nhanh trả lời đúng nội dung tức thì, escape
XSS cho tin nhắn tự do, toggle VI/EN đổi đúng nhãn, form để lại SĐT validate + gửi đúng định dạng
tin nhắn, fallback đúng khi `/api/chat` không kết nối được (network fail dưới `file://`, đúng hành
vi mong đợi). Ở `admin.html`: tab/dialog "Quản lý Chat" tồn tại đúng cấu trúc, gom nhóm phiên đúng,
dialog chi tiết hiện đúng nội dung, sort/tìm kiếm đúng, `delChatSession` gọi đúng
`DELETE chat_logs?session_id=eq...` (test bằng mock `api()`/`showConfirmPopup`, không đăng nhập
Supabase thật). **CHƯA/KHÔNG thể test trong phiên này:** gọi thật tới Cloudflare Workers AI (không
có `wrangler dev` — `npx wrangler --version` bị timeout ~60s trong môi trường sandbox, nghi do
không có/rất chậm truy cập mạng ra `registry.npmjs.org`, thử cả với sandbox tắt vẫn timeout), migration
`chat_logs` CHƯA được chạy trên Supabase project thật, và giao diện chat trên thiết bị/trình duyệt
thật (đặc biệt vị trí nút trên mobile — do giới hạn compositing của Claude Browser đã nêu, không
chắc chắn 100% dù đã review kỹ CSS bằng tay).

**E. Đã merge vào `main` + deploy production ngay trong cùng phiên (2026-08-29), khác quy trình gốc
ở mục 1 — lý do có chủ đích, không phải bỏ qua bước:** PM phản hồi không có cách nào tự dựng môi
trường test riêng (không biết dùng `wrangler dev`), và yêu cầu thẳng "deploy lên trang Home để tôi
test luôn". Coi đây là "xác nhận rõ ràng từ PM bằng lời trong hội thoại" theo đúng tinh thần mục 1
(dù không đúng y nguyên câu chữ gợi ý "test OK") — hợp lý vì cách duy nhất PM có thể tự test là trên
production thật. Quy trình rút gọn còn: push nhánh feature lên GitHub (PM đồng ý) → merge → push
`main` → Cloudflare tự deploy → PM tự test trực tiếp trên `topvisa5s.com`, có gì hỏng sửa tiếp bằng
cách push thẳng `main` (đúng quy ước sẵn có của dự án, không tạo lại nhánh feature cho mỗi lần sửa
nhỏ trong lúc đang debug cùng 1 tính năng vừa deploy).

**F. Lỗi thật phát hiện NGAY LÚC test trên production — AI trả lời sai ngôn ngữ (FR-CB-05), sửa qua
3 lượt mới ổn định:** dùng `curl` gọi thẳng `/api/chat` thật (không phải giả lập) để tự kiểm tra
trước khi báo PM — hỏi tiếng Anh nhưng AI (`@cf/meta/llama-3.1-8b-instruct-fast`) trả lời tiếng Việt.
- **Lượt 1 (KHÔNG đủ):** thêm 1 dòng chỉ thị "trả lời tiếng Anh" ở cuối prompt tiếng Việt — vẫn ra
  tiếng Việt khi test lại.
- **Lượt 2 (VẪN KHÔNG đủ):** viết hẳn 2 bản prompt riêng (toàn bộ quy tắc bằng tiếng Anh khi cần trả
  lời tiếng Anh) — áp đảo ngôn ngữ khung prompt nhưng model VẪN thỉnh thoảng ra tiếng Việt khi test
  lại nhiều câu khác nhau.
- **Lượt 3 (ĐÃ ỔN ĐỊNH, đang dùng):** đổi hẳn kiến trúc — LUÔN sinh câu trả lời gốc bằng tiếng Việt
  (chiều này model luôn đúng, vì mọi thứ trong prompt vốn đã tiếng Việt), rồi nếu khách hỏi tiếng
  Anh thì DỊCH sang tiếng Anh bằng 1 lượt gọi AI RIÊNG chỉ làm đúng 1 việc "dịch đoạn văn này sang
  tiếng Anh" (`chatTranslateToEnglish()`) — tác vụ dịch đơn giản/tách biệt đáng tin cậy hơn hẳn so
  với bắt model vừa trả lời vừa tự nhớ đổi ngôn ngữ đầu ra. Đã test lại nhiều câu hỏi VI/EN khác
  nhau qua `curl` thật, đều ra đúng ngôn ngữ. **Bài học:** với model nhỏ/nhanh (`*-fast` variant),
  đừng chỉ tin 1 lần test — chỉ thị ngôn ngữ ĐẶT Ở ĐÂU/VIẾT BẰNG NGÔN NGỮ NÀO trong prompt có thể
  KHÔNG đủ để thắng được "lực kéo" ngôn ngữ của phần dữ liệu grounding chiếm phần lớn prompt; tách
  việc "trả lời" và "đổi ngôn ngữ" thành 2 bước AI riêng biệt là cách chắc chắn hơn nhiều.
- **Đã kiểm tra thêm hành vi grounding (không bịa số liệu):** hỏi về 1 nước KHÔNG có trong dữ liệu
  thật (test bằng "Iceland") → AI trả lời đúng "không có thông tin, mời gọi hotline" thay vì bịa số
  — cho thấy quy tắc "không bịa" trong prompt hoạt động tốt trong thực tế, không chỉ trên giấy.
- **Đã test thành công lead capture thật trên production** (dữ liệu rõ ràng đánh dấu TEST, xem mục
  1.3 `Chi_dan_Thuc_hien_Phat_trien_Chatbox.md`): gửi tin nhắn có tên+SĐT → `lead_captured:true`,
  xác nhận đúng luồng `chatDetectAndCaptureLead()` hoạt động trên dữ liệu thật.
- **⚠️ Chưa xác nhận 100%:** độ chính xác của câu trả lời dài (vd checklist hồ sơ Nhật Bản) — AI trả
  lời khá chi tiết, không có cách nào từ phía Claude Code kiểm chứng nó khớp đúng 100% với field
  "Checklist hồ sơ" PM đã nhập ở admin.html hay không (không có quyền đọc `danh_muc_nuoc` bằng anon
  key). Đã nhắc PM tự đối chiếu 1 lần — quan trọng vì đây là đúng loại rủi ro "bịa thông tin pháp
  lý" mà CLAUDE.md mục 8/10 cấm tuyệt đối.

**G. 2 vòng phản hồi UI từ PM sau khi tự test trên production (2026-08-29), đều đã sửa + deploy:**
- *Vòng 1:* (1) tab "Quản lý Chat" dời từ cạnh "Tư vấn" sang trước tab "Danh mục" (giữa "Cài đặt
  chung" và "Danh mục"); (2) icon nút Chat nổi đổi từ 💬 sang 🤖 (khớp icon PM đã thấy ưng ý trong
  header khung chat) + thêm animation "lắc lư" định kỳ (`@keyframes chatboxToggleWiggle`, ~4s/lần,
  đứng yên phần lớn thời gian — cùng tinh thần `@keyframes pulse` của `.float-main`); (3) đổi thứ tự
  trong khung chat — hàng gợi ý câu hỏi nhanh (`.chatbox-quick`) chuyển lên TRÊN cùng (ngay dưới
  header) và đổi từ xếp dọc 6-7 nút full-width (choán hết khung chat) sang **1 hàng cuộn NGANG gọn**
  (`flex-wrap:nowrap;overflow-x:auto`), khung tin nhắn (`.chatbox-body`) chuyển xuống dưới sát ô
  nhập.
- *Vòng 2:* (1) khung chat tự đóng khi bấm ra ngoài (`click` listener trên `document`, loại trừ
  click trong `#chatboxPanel`/`#chatboxToggle` — cùng mẫu đã dùng cho `#floatContact`); (2) nút "Để
  lại số điện thoại tư vấn" tách hẳn khỏi hàng cuộn ngang, thành 1 nút **CỐ ĐỊNH** riêng
  (`#chatboxLeadCtaBtn`, màu cam nổi bật) đặt ngay trên ô nhập — luôn thấy, không cần cuộn tìm; (3)
  `admin.html` tab "Quản lý Chat": filter "Từ ngày...đến" đổi class `filters` → `filters filters-hoso`
  + `align-items:center` (đúng mẫu Tài chính đang dùng) để canh giữa label/ô nhập theo chiều dọc;
  (4) bỏ `danger:true` ở `showConfirmPopup()` của `delChatSession()` — phát hiện đây là dialog xóa
  DUY NHẤT trong toàn bộ `admin.html` đang dùng nút "Đồng ý" màu đỏ (`btn-d`), mọi nơi xóa khác trong
  hệ thống đều dùng mặc định màu xanh (`btn-p`) — sửa lại cho đồng bộ đúng theo yêu cầu PM, không
  phải đổi màu tùy ý.

**Trạng thái cuối phiên (2026-08-29):** đã merge `main` + deploy `topvisa5s.com`, PM tự test trực
tiếp và xác nhận OK (bao gồm cả 2 vòng chỉnh UI trên). Dữ liệu THỬ NGHIỆM do Claude Code tạo ra lúc
tự test qua `curl` (phiên `chat_logs` `session_id` bắt đầu `TEST-verify-...`, lead "TEST xoá sau" SĐT
`0909000111`) **PM đã xác nhận xóa xong** cùng ngày. **Còn tồn đọng:** (1) đối chiếu checklist hồ sơ
AI trả lời với dữ liệu thật đã cấu hình (xem mục F); (2) Release 2 (chuyển ngữ toàn site) chưa bắt
đầu, xem mục 1.1/9 `Dac_ta_Trien_khai_Chatbox.md` khi PM yêu cầu làm tiếp.

## 48. Feedback khách hàng (đánh giá Facebook) quản lý qua admin — thay 2 review viết cứng (2026-08-31)

**Bối cảnh:** PM yêu cầu qua `09_Facebook/request.md` — section "Khách hàng nói gì về chúng tôi" ở
`index.html` trước đây chỉ có 2 review viết cứng trong HTML (xem mục 8, lịch sử "3 review mẫu → 2
review thật"), không có link ra Facebook thật. PM muốn quản lý được (CRUD) qua `admin.html` và khi
khách bấm vào tên Facebook thì mở đúng URL đánh giá thật.

**A. Bảng mới `danh_gia_khach_hang`** (`05_Database/12_supabase_setup_phase12.sql`) — 4 cột đúng y
theo yêu cầu: `ten_facebook`/`noi_dung`/`url` (bắt buộc, hiển thị công khai), `ghi_chu` (tùy chọn,
**CHỈ nội bộ** — không đưa lên landing page). RLS giống hệt `dich_vu_gia` (mục 31.D): `anon` chỉ
SELECT, `authenticated` toàn quyền CRUD. **Không thêm cột đánh giá sao (rating)** dù card hiển thị
có `.stars` — giữ nguyên tĩnh `★★★★★` cho mọi feedback (không có trong 4 field PM yêu cầu, không tự
ý thêm field ngoài phạm vi). **Không thêm cột thứ tự hiển thị** — public site tự sắp theo
`created_at desc` (mới thêm lên đầu), đơn giản, không có trong yêu cầu.

**B. Admin (`admin.html`, tab "Cài đặt chung")** — thêm 1 khối `.cat-block-full` mới (`.c-danhgia`)
ngay dưới khối "Dịch vụ Visa các quốc gia" (copy đúng khuôn CRUD của khối đó —
`loadDichVuGia`/`openDvGiaModal`/`saveDvGia`/`delDvGia` — đổi tên thành `loadDanhGiaKhachHang`/
`openDanhGiaModal`/`saveDanhGia`/`delDanhGia`). Dialog `#dgkhOverlay` theo đúng `dlg-standard`
(`01_Docs/10_Chuan_Dialog_Chung.md`), `modal-lg`, 1 `dlg-section`, có `snapshotDialog`/
`confirmCloseDialog` (mục 23, bắt buộc vì có field nhập liệu). Cột "Nội dung"/"URL"/"Ghi chú" trong
list dùng `.text-trunc` (mục 22) — hiện đủ khi hover qua `title`. Không cần `isRecordInUse` trước
khi xóa — không bảng nào tham chiếu tới, giống các bảng "lá" khác (mục 14). Đã thêm
`loadDanhGiaKhachHang()` vào `Promise.all([...])` ở CẢ 2 luồng đăng nhập (đăng nhập thường + tự
đăng nhập lại) — thiếu 1 trong 2 chỗ sẽ làm dữ liệu chỉ nạp đúng sau lần đăng nhập thủ công, không
nạp lại khi mở app lần sau bằng "Ghi nhớ đăng nhập" (lỗi từng gặp mẫu tương tự ở các bảng khác).

**C. `index.html` — hiển thị động, có fallback:** 2 review viết cứng trong `#reviewsTrack` (mục
"ĐÁNH GIÁ") **VẪN GIỮ NGUYÊN trong HTML** làm fallback — script mới ("FEEDBACK KHÁCH HÀNG ĐỘNG",
cuối trang) fetch `danh_gia_khach_hang` bằng `anon` key; nếu có ít nhất 1 dòng, **THAY THẲNG** toàn
bộ nội dung `#reviewsTrack` bằng dữ liệu thật (không merge/giữ lại 2 review cũ) rồi gọi lại
`initReviewsSlider()`. Nếu bảng rỗng (PM chưa thêm feedback nào)/lỗi mạng → giữ nguyên 2 review tĩnh
cũ, đúng tinh thần fallback đã dùng cho giá dịch vụ (mục 31.D) và bài viết (mục 31.F). **PM cần biết:
2 review cũ ("Anh Võ Kiên", "Pon Tí Tởn") sẽ TỰ ĐỘNG BIẾN MẤT khỏi trang chủ ngay khi PM thêm dòng
feedback ĐẦU TIÊN qua admin** — nếu muốn giữ lại, PM cần tự nhập lại 2 dòng đó qua admin (Claude Code
không tự ý insert dữ liệu mẫu vào bảng mới, theo đúng mục 10).

**⚠️ Refactor quan trọng — `initReviewsSlider()` đổi từ IIFE thành hàm gọi lại được nhiều lần an
toàn:** bản gốc là 1 IIFE chạy đúng 1 lần lúc tải trang. Vì giờ cần gọi LẦN 2 sau khi script động
thay nội dung `#reviewsTrack`, nếu chỉ đơn giản bọc lại thành hàm rồi gọi 2 lần sẽ **gắn TRÙNG**
listener trên `#reviewPrev`/`#reviewNext`/`#reviewsSlider`/`#reviewsTrack` (các node này KHÔNG bị
tạo lại giữa 2 lần gọi, chỉ nội dung con của `#reviewsTrack` bị `innerHTML` ghi đè) — 1 lần bấm/vuốt
sẽ kích hoạt 2 lần (nhảy 2 slide). Đã sửa bằng cờ module-level `reviewsSliderInited` (chỉ gắn
listener đúng 1 LẦN DUY NHẤT trong suốt vòng đời trang) + đưa `reviewsIndex`/`reviewsTimer` ra
module-level (để các listener gắn từ lần gọi ĐẦU vẫn thao tác đúng trên state MỚI của lần gọi SAU).
**Đã test xác nhận qua Claude Browser:** bấm Next 1 lần trước khi thay slide động → tăng đúng 1 bước;
mô phỏng thay 3 slide động + gọi lại `initReviewsSlider()` → dots/index reset đúng theo số slide mới;
bấm Next 1 lần SAU khi gọi lại → vẫn chỉ tăng đúng 1 bước (không bị nhân đôi do listener trùng).
**Nếu sau này cần thêm 1 slider khác cũng phải nạp lại dữ liệu động nhiều lần trong vòng đời trang,
áp dụng đúng mẫu này** (cờ "đã gắn listener" + state module-level), đừng lặp lại lỗi IIFE-gọi-lại.

**Đã test:** `node --check` cho cả 2 file; qua Claude Browser (mock `api()`/dữ liệu): admin CRUD đủ
4 thao tác (tải danh sách, mở dialog sửa đổ đúng dữ liệu, validate chặn lưu khi thiếu Tên, lưu đúng
PATCH đúng id, đóng dialog sạch không hỏi xác nhận thừa); slider trang chủ như mô tả ở trên.

**D. Bổ sung "Tháng/Năm đánh giá" (2026-09-01, cùng ngày PM tự chạy Phase 12 gốc + tự thêm feedback
đầu tiên qua admin):** PM yêu cầu thêm field để chọn đúng THÁNG/NĂM thật của đánh giá (không phải
ngày tạo dòng trong hệ thống — PM có thể nhập bù các đánh giá cũ), landing page hiển thị
"Đánh giá thật trên Facebook · mm - yyyy" lấy từ đó. Vì bảng `danh_gia_khach_hang` **ĐÃ CÓ SẴN 1
dòng dữ liệu thật** lúc này (PM đã chạy Phase 12 gốc trước khi có yêu cầu này), 2 cột mới `thang`/
`nam` phải NULLABLE (không ép NOT NULL) — nối thêm 1 khối `alter table add column if not exists`
vào CUỐI file `12_supabase_setup_phase12.sql` cũ (không tạo file Phase 13 riêng, đúng quy tắc
05_Database/README.md "nối vào cuối file nếu thay đổi nhỏ liên quan trực tiếp phase gần nhất") — an
toàn chạy lại cả file dù đã chạy phần đầu trước đó. Admin: dialog thêm 2 field bắt buộc (Tháng —
`<select>` 1-12; Năm — `<input type=number>`, mặc định năm hiện tại khi thêm mới). `index.html`:
ưu tiên `thang`/`nam` nếu có, CHỈ fallback sang tháng/năm của `created_at` khi thiếu (dòng dữ liệu
cũ tạo trước khi có 2 cột này, vd dòng "Pon Tí Tởn" PM thêm trước khi có yêu cầu này) — đã test xác
nhận qua Claude Browser cả 2 nhánh format đều đúng.

**Trạng thái cuối phiên (2026-09-01):** PM đã chạy lại `05_Database/12_supabase_setup_phase12.sql`
(cả phần gốc lẫn phần `alter table` nối thêm cột `thang`/`nam`) và **tự test xác nhận OK** trên
production — tính năng "Feedback từ khách hàng" (mục A-D) coi như đã đóng hoàn toàn, không còn việc
tồn đọng nào cần theo dõi tiếp cho tính năng này.

## 49. Kế hoạch SEO `10_SEO/11_Ke_hoach_sau_xac_nhan.md` — T7, T1, T2 (2026-09-01)

**Bối cảnh:** bắt đầu thực thi bộ kế hoạch SEO "BẢN FINAL" ở `10_SEO/` (đọc file
`11_Ke_hoach_sau_xac_nhan.md` mục 0 trước khi làm bất kỳ task nào trong bộ này — 8 ràng buộc bắt
buộc, gồm cả yêu cầu tự kiểm 3 điều sau mỗi lần deploy). Phiên này chỉ làm 3 task đầu theo đúng thứ
tự yêu cầu: T7 → T1 → T2. Các task còn lại (T3-T19) **chưa làm**, xem tiếp file kế hoạch khi được
giao tiếp.

**A. T7 — 2 badge số liệu hero (`index.html` dòng ~593-594):** PM xác nhận 5000+ là số thật, 98%
là số thật NHƯNG chỉ đúng với hồ sơ đủ điều kiện — đổi thành `"5000+ hồ sơ đã xử lý (tính đến
08/2026)"` và `"98% hồ sơ đủ điều kiện được cấp visa"` (cụm "đủ điều kiện" bắt buộc phải có ngay
trong badge, tránh bị hiểu là cam kết tỷ lệ đậu tuyệt đối — dễ vi phạm chính sách quảng cáo), xóa 2
comment `<!-- [THAY_THẾ] -->`. Đã cập nhật lại mục 8 (bảng placeholder) ở trên — hàng "Badge hero"
chuyển sang ✅.

**B. T1 — `worker.js`, 2 việc:**
1. **Redirect 301 `*.workers.dev` → `topvisa5s.com`:** thêm ngay đầu `fetch()`, sau
   `const url = new URL(request.url)`, trước check `/api/chat` — điều kiện
   `url.hostname.endsWith('.workers.dev')` → `Response.redirect('https://topvisa5s.com'+url.pathname+url.search, 301)`.
   **CHỦ Ý không có ngoại lệ `?preview=1`** (bản kế hoạch trước có đề xuất này rồi bị loại ở bản
   FINAL) — bất kỳ ngoại lệ nào cũng tạo ra 1 URL sống đầy đủ nội dung trên `workers.dev`, đúng cái
   redirect này sinh ra để tránh (rủi ro Google lập chỉ mục domain phụ nếu link lọt ra ngoài). Cần
   test trên `workers.dev` thì dùng preview deployment (`wrangler versions upload`), không mở lỗ
   trên production.
2. **Canonical bỏ `url.search`:** kiểm tra kỹ lúc làm — `worker.js` **hiện chưa có route nào dựng
   HTML động** (chỉ `/api/chat` trả JSON + passthrough file tĩnh), nên không có canonical nào cần
   sửa ngay bây giờ. Canonical duy nhất của site là dòng tĩnh trong `index.html`
   (`href="https://topvisa5s.com/"`, không query — đã đúng từ trước vì hardcode). **Ràng buộc
   "canonical = `url.origin+url.pathname`, bỏ hẳn `url.search`" sẽ áp dụng khi làm T4 (`/blog`)
   và T14 (`/visa-<slug>`)** — lúc đó route dựng `<head>` động thì PHẢI dựng canonical theo đúng
   công thức này, không copy `url.search` vào. Không đụng `robots.txt` (không thêm
   `Disallow: /*?` — bị cấm rõ trong kế hoạch vì sẽ chặn Googlebot đọc canonical).

**C. T2 — semantic HTML + accessibility (`index.html`):**
- Bọc `<main id="noi-dung">` ngay sau `</nav>`, đóng `</main>` ngay trước `<footer id="footer">` —
  đúng 1 thẻ `<main>` duy nhất trên trang (promo-bar + navbar nằm NGOÀI main, đúng — không phải nội
  dung chính).
- Thêm `<a href="#noi-dung" class="skip-link">Bỏ qua tới nội dung</a>` ngay đầu `<body>`, CSS mới
  `.skip-link`/`.skip-link:focus` (ẩn ngoài màn hình mặc định `left:-9999px`, hiện khi focus bằng
  Tab `left:0`) — thêm vào khu vực CSS gần "PROMO BAR", trước "NAVBAR".
- Thêm `<meta name="theme-color" content="#1B6EF3">` vào `<head>` — dùng đúng `--color-primary`
  khai trong `:root` (không bịa màu mới).
- Đã test qua Claude Browser thật (không chỉ đọc code): Tab lần đầu khi vào trang → skip-link hiện
  đúng góc trên trái; layout hero/badge/footer không xê dịch so với trước khi sửa; `grep` xác nhận
  đúng 1 cặp `<main>`/`</main>`.

**Đã kiểm tra cú pháp:** `node --check worker.js` OK; toàn bộ khối `<script>` inline của
`index.html` parse được bằng `new Function()` (không lỗi cú pháp).

**Đã deploy + kiểm tra trên production (2026-09-01, cùng ngày):** push `main` (commit `67dd102`),
Cloudflare tự deploy. Ràng buộc số 8: (1) trang chủ render đủ — xác nhận qua Claude Browser (giá
dịch vụ/đánh giá/blog tải động đúng, console sạch ở tab mới hoàn toàn — 1 lỗi 404 thấy lúc đầu chỉ
là log sót từ tab test khác, không phải lỗi thật); (2) gửi form thành công — test thật trên
production, đã tạo 1 lead đánh dấu `"TEST xoá sau..."`/SĐT `0909000111`, PM cần tự xóa qua admin;
(3) admin đăng nhập được — Claude Code không có mật khẩu admin nên chỉ xác nhận `/admin` tải đúng
cấu trúc (form đăng nhập hiện ra, console sạch), PM cần tự đăng nhập xác nhận.

**⚠️ Lỗi thật phát hiện lúc kiểm tra redirect 301 — sửa bằng `run_worker_first` (commit `8218ef9`,
cùng ngày):** test trực tiếp `https://topvisa5s.nguyennc1357.workers.dev/` (PM cung cấp đúng URL
qua ảnh chụp Cloudflare Dashboard — tài liệu cũ ghi nhầm `topvisa.nguyennc1357.workers.dev`, có vẻ
sót lại từ trước khi mua domain thật) vẫn trả về **200 trang chủ bình thường thay vì 301** dù code
redirect đã đúng logic. Nguyên nhân: `[assets]` trong `wrangler.toml` **mặc định phục vụ file tĩnh
khớp đường dẫn (`/` → `index.html`) THẲNG từ edge, bỏ qua hẳn `worker.js`/`fetch()`** — nên request
`/` trên `workers.dev` không bao giờ chạm được đoạn code redirect. Đã thêm
`run_worker_first = true` vào `[assets]` — bắt buộc để MỌI request (kể cả trang tĩnh) luôn chạy qua
`worker.js` trước. Đã re-verify toàn diện sau khi bật cờ này (vì ảnh hưởng routing của CẢ site, không
chỉ workers.dev): redirect giữ đúng pathname+search (`/admin.html?x=1` → `https://topvisa5s.com/admin.html?x=1`),
domain chính `/`/`/admin.html`/`/api/chat`/static assets/canonical **đều không đổi hành vi** (đã
`curl` + browser thật xác nhận từng cái). **Bài học:** Cloudflare Workers Static Assets có hành vi
"asset khớp thì bypass Worker" theo mặc định — bất kỳ logic nào trong `fetch()` cần chạy cho MỌI
request (redirect, kiểm tra hostname, log...) đều PHẢI có `run_worker_first = true`, nếu không sẽ
"đúng code nhưng không bao giờ chạy" cho các đường dẫn khớp file tĩnh — im lặng, không báo lỗi gì.

**Quyết định giữ nguyên `workers.dev` subdomain (không xóa), theo yêu cầu PM:** PM hỏi có nên xóa
`topvisa5s.nguyennc1357.workers.dev` sau khi đã có domain thật không — trả lời: **không xóa**, vì
đúng mục đích của redirect 301 T1 là giữ subdomain sống để link cũ (lịch sử duyệt web, tin nhắn cũ
còn lưu URL này) vẫn dùng được, chỉ tự động đưa về domain chính thay vì lỗi trắng trang.

## 50. T9 — đồng bộ 8 số giá fallback + SSR giá trang chủ (2026-09-01)

**Bối cảnh:** PM đã cấu hình giá thật trong admin từ trước, trang chủ hiển thị đúng giá cho khách
có JavaScript (script "GIÁ DỊCH VỤ" đọc `dich_vu_gia`). Việc còn lại là 8 số cứng viết sẵn trong
HTML (chỉ 3 nhóm không chạy JS mới thấy: bộ quét link Facebook/Zalo, Bing, lượt crawl đầu của
Googlebot) và PM đã xác nhận 01/09/2026 giá là **TỔNG ĐÃ GỒM PHÍ LÃNH SỰ**.

**Bước 1 — đọc `dich_vu_gia` qua REST API bằng `SUPABASE_ANON_KEY` (đã công khai trong
`index.html`) trước khi sửa gì:** 8 dòng — Nhật Bản 3.300.000 · Hàn Quốc 2.600.000 · Đài Loan
3.000.000 · Trung Quốc 3.100.000 · Schengen (châu Âu) 5.700.000 · Mỹ 6.200.000 · Úc 6.800.000 ·
Khác `null`. **Không ghi gì vào database** — chỉ SELECT.

**Bước 2+3 (`index.html`, 8 card dịch vụ ~dòng 632-639):**
- Sửa 8 số cứng khớp đúng bảng trên (nước "Khác" giữ nguyên "Liên hệ báo giá").
- Đổi chữ **"Từ X đ" → "Tổng từ X đ"** cho 7 card có giá (áp dụng cả static HTML lẫn script client
  đọc `dich_vu_gia`, mục "GIÁ DỊCH VỤ" cuối trang) — PM xác nhận chữ "Từ" đứng một mình dễ gây cảm
  giác sợ phát sinh thêm.
- Thêm `<div class="price-note">Đã gồm phí lãnh sự + phí dịch vụ, không phát sinh thêm</div>` ngay
  dưới mỗi `.price` — **CHỈ ở 7 card có giá thật, KHÔNG thêm cho card "Quốc gia khác"** (quyết định
  có chủ đích ngoài văn bản gốc: "Liên hệ báo giá" không có tổng số nào để mô tả là "đã gồm", thêm
  dòng đó vào sẽ gây khó hiểu). CSS mới `.card-service .price-note` (font nhỏ, màu `--color-text-muted`,
  dùng token có sẵn). Script client cũng được sửa để **ẩn/hiện `.price-note` theo đúng còn/mất giá**
  (`nextElementSibling` + toggle `display:none`) — phòng khi PM đổi 1 nước từ có giá sang `gia=null`
  sau này, dòng cam kết không bị "mồ côi" hiển thị sai.

**Bước 4 (`worker.js`) — SSR đè giá thật vào HTML trước khi trả về, route `/`:** thêm hàm
`renderHomepageWithLivePrices()` — `Promise.all` giữa `env.ASSETS.fetch(request)` (HTML gốc) và
`supa(env, 'dich_vu_gia?select=quoc_gia,gia')` (dùng lại helper `supa()` có sẵn, chạy bằng
`SUPABASE_SERVICE_ROLE_KEY` **đã cấu hình sẵn trên Worker** — **KHÔNG** dùng `SUPABASE_ANON_KEY` vì
biến đó không tồn tại phía Worker, tránh lặp lại bài học "quên thêm 1 biến nên job im lặng không
chạy" ở mục 34.B), rồi `.replace()` từng `data-country="<nước>">...</div>` bằng regex (có escape
ký tự đặc biệt cho tên nước chứa ngoặc như "Schengen (châu Âu)") — chỉ nước `gia` hợp lệ (>0) mới bị
thay, nước `null` giữ nguyên "Liên hệ báo giá" viết sẵn. Lỗi bất kỳ (Supabase down...) → `catch` rơi
về `env.ASSETS.fetch(request)` gốc — do Bước 2 đã sửa số fallback tĩnh thành đúng số thật, dù SSR
lỗi thì khách vẫn thấy giá đúng, không có đường nào ra giá sai. Gắn vào `fetch()` ngay sau check
`/api/chat`, chỉ áp dụng `pathname === '/' && method === 'GET'`.

**Đã kiểm tra kỹ trước khi tin tưởng (chưa deploy khi viết mục này):**
- `node --check worker.js` OK; toàn bộ `<script>` inline `index.html` parse được bằng `new Function()`.
- Test riêng logic regex-replace bằng Node với dữ liệu giả lập (giá trị khác hoàn toàn số thật, để
  chắc chắn "khớp" không phải trùng hợp) — xác nhận cả 7/7 nước match đúng, kể cả trường hợp khó
  nhất "Schengen (châu Âu)" có dấu ngoặc trong tên (đã escape regex đúng).
- Test qua Claude Browser (mở file tĩnh, JS chạy nhưng fetch Supabase fail do CORS trên `file://`
  nên rơi về đúng fallback tĩnh — mô phỏng chính xác trường hợp "tắt JavaScript"): 7 giá + 7 dòng
  "Đã gồm phí lãnh sự..." hiện đúng, card "Quốc gia khác" đúng "Liên hệ báo giá" không có dòng note
  thừa, layout không vỡ, console sạch.

**⚠️ Nghiệm thu gốc trong kế hoạch dùng `grep -o 'Từ [0-9.]*đ'` — không còn đúng nữa vì đổi chữ:**
sau khi đổi "Từ" → "Tổng từ" theo đúng yêu cầu Bước 3, chữ "từ" trong "Tổng từ" viết thường (không
còn là "Từ" hoa đứng đầu) nên câu lệnh cũ không match được nữa. Dùng lại đúng tinh thần (đếm đúng 7)
bằng: `grep -oE 'data-country="[^"]*">(Tổng từ [0-9.]*đ|Liên hệ báo giá)'` rồi đếm dòng có "Tổng từ".

## 51. T6 — câu dự phòng chatbox khi AI lỗi/hết quota (2026-09-01)

**Phát hiện lúc đọc code:** cơ chế `try/catch` quanh lời gọi AI (`chatCallAI` bọc `env.AI.run`) **đã
tồn tại sẵn** từ Release 1 Chat Box (`handleChat()`, `worker.js`) — không phải làm mới từ đầu. Vấn
đề thật là câu dự phòng cũ (`CHAT_FALLBACK_VI`/`CHAT_FALLBACK_EN`) mời khách **chat Zalo**, trong khi
kế hoạch SEO T6 yêu cầu mời **để lại số điện thoại** (khớp đúng nút có sẵn "Để lại số điện thoại tư
vấn" trong khung chat) — đã sửa lại đúng y nguyên câu tiếng Việt yêu cầu, và viết thêm bản tiếng Anh
tương đương (chatbox vốn song ngữ VI/EN từ Release 1). Chỉ đổi 2 hằng số, **không đụng `index.html`**
— đúng yêu cầu "không đổi giao diện chatbox".

**3 nơi dùng chung 2 hằng số này** (tự động hưởng câu mới, không cần sửa thêm): lỗi gọi AI thật sự
(`chatCallAI` ném lỗi — bao gồm cả trường hợp vượt hạn 10.000 neuron/ngày free tier, Cloudflare trả
lỗi ngay chứ không "treo"), thiếu `SUPABASE_SERVICE_ROLE_KEY` (chưa cấu hình secret), và lỗi ngoài dự
kiến ở `handleChat` (catch ngoài cùng).

**Đã nghiệm thu bằng cách mô phỏng lỗi AI thật** (không sửa binding `AI` trên Cloudflare Dashboard —
không có quyền truy cập, và làm vậy sẽ ảnh hưởng chatbox thật đang chạy cho khách): viết script Node
import THẲNG `worker.js` làm ES module, mock `global.fetch` (mọi gọi Supabase trả rỗng hợp lệ ngay)
và `env.AI.run` ném lỗi, rồi gọi trực tiếp `export default.fetch()` y hệt 1 request POST `/api/chat`
thật. Kết quả: phản hồi sau **3ms** (dưới xa ngưỡng 3 giây), HTTP 200, `reply` đúng y nguyên câu yêu
cầu, có số hotline, có mời để lại số điện thoại. Đã đọc lại phần client (`index.html`
`chatboxSendFree()`): `chatboxHideTyping()` luôn được gọi ngay khi nhận phản hồi (cả nhánh thành
công lẫn lỗi mạng), không có delay/retry nào — nên dấu "…" không bao giờ treo mãi, khớp đúng
nghiệm thu.

**Không đụng đến:** câu dự phòng khi **kết nối mạng phía client thất bại** (`chatboxSendFree()` catch
ở `index.html`, dòng ~1513-1517, vẫn mời Zalo) — đây là lỗi khác hẳn (worker/network không tới được,
không phải AI lỗi), ngoài phạm vi T6 và vi phạm "không đổi giao diện chatbox" nếu động vào.

## 52. An ninh: `worker.js`/`wrangler.toml`/`package.json` từng bị public — chuyển file tĩnh vào
    `02_Source/public/` (2026-09-01)

**Sự cố phát hiện:** `[assets] directory = "."` trong `wrangler.toml` trỏ thẳng vào `02_Source/`, nên
Cloudflare phục vụ ra Internet **TOÀN BỘ** nội dung thư mục này — không chỉ `index.html`/`admin.html`
mà cả `worker.js` (toàn bộ source code Worker), `wrangler.toml` (cấu hình + comment nội bộ), và
`package.json`. Xác nhận bằng `curl https://topvisa5s.com/worker.js` (và 2 file kia) → **200, tải
được nguyên văn**. Đã kiểm tra kỹ: **không có secret thật nào bị lộ**
(`SUPABASE_SERVICE_ROLE_KEY`/`VAPID_PRIVATE_KEY_JWK` chỉ đặt qua Cloudflare Dashboard, không có
trong file nào) — nhưng vẫn lộ logic nội bộ (ngưỡng rate-limit chatbox, model AI, lịch cron, comment
lịch sử debug), rủi ro thông tin cho kẻ tấn công dò hệ thống.

**Đã chọn Phương án A (chuyển file, không phải chặn từng tên trong `worker.js`)** — lý do: chặn theo
danh sách tên file cụ thể trong `worker.js` là kiểu **blocklist**, dễ quên cập nhật khi thêm file
nguồn mới sau này (script deploy, `.env.example`...) → lại lộ tiếp mà không ai biết, đúng kiểu rủi ro
"quên 1 bước, im lặng không báo lỗi" dự án từng gặp (mục 34.B, 45). Chuyển hẳn cấu trúc là an toàn
theo mặc định: file mới thêm ở `02_Source/` (ngoài `public/`) tự động không public, không cần nhớ gì.

**Đã làm:**
1. `git mv` 7 mục sau vào `02_Source/public/`: `index.html`, `admin.html`, `robots.txt`,
   `sitemap.xml`, `admin-manifest.webmanifest`, `sw-admin.js`, `assets/` (16 file con) — dùng `git mv`
   để Git nhận đúng là **rename**, giữ lịch sử file.
2. `worker.js`, `wrangler.toml`, `package.json` **giữ nguyên** ở gốc `02_Source/`.
3. `wrangler.toml`: đổi `directory = "."` → `directory = "./public"` — đây là **CHỖ DUY NHẤT** cần
   sửa code (đã rà toàn bộ dự án bằng agent riêng để tìm mọi tham chiếu đường dẫn trước khi làm, xem
   dưới).
4. Cập nhật cây thư mục ở mục 4 (trên) cho khớp cấu trúc mới.

**Vì sao KHÔNG cần sửa gì trong `index.html`/`admin.html`/`sw-admin.js`/`admin-manifest.webmanifest`/
`robots.txt`:** đã rà soát kỹ trước khi move — mọi tham chiếu qua lại giữa các file này đều dùng
đường dẫn **tương đối** (`assets/logo.svg`, `admin-manifest.webmanifest`, `sw-admin.js`) hoặc
**root-relative** (`/admin.html`, `/`) chứ không hardcode `02_Source/...`, nên khi cả nhóm file cùng
chuyển vào `public/` một lượt, mọi tham chiếu vẫn đúng nguyên vẹn — `public/` trở thành root mới được
serve, `/` vẫn ra `public/index.html`, `assets/logo.svg` từ `public/index.html` vẫn đúng ra
`public/assets/logo.svg`. URL tuyệt đối dạng `https://topvisa5s.com/...` (og:image, sitemap...) vốn
là domain production, không phải path ổ đĩa, cũng không bị ảnh hưởng.

**⚠️ Các mục lịch sử CŨ trong file này (8, 12, 13, 14, 26, 32...) vẫn ghi đường dẫn kiểu
`02_Source/index.html`, `02_Source/admin.html`, `02_Source/assets/...`** — đây là tường thuật lịch
sử tại THỜI ĐIỂM viết mục đó (trước khi có `public/`), **cố tình không sửa lại** để giữ đúng bối cảnh
lúc quyết định — chỉ mục 4 (cấu trúc hiện tại) và mục này mới là nguồn đúng nhất về đường dẫn hiện
tại. Khi đọc các mục cũ, tự hiểu ngầm cộng thêm `public/` vào giữa `02_Source/` và tên file nếu đó là
1 trong 7 mục đã chuyển (loại trừ `worker.js`).

**⚠️ Ảnh hưởng tới `10_SEO/11_Ke_hoach_sau_xac_nhan.md`** (bộ tài liệu thực thi SEO, các task T3-T19
CHƯA làm) — file đó ghi đường dẫn cần sửa là `02_Source/index.html`, `02_Source/worker.js`,
`02_Source/assets/` (kiểu cũ). Đây là file bên ngoài, không thuộc phạm vi Claude Code tự sửa (thuộc
"bộ 4 file thực thi" của PM) — **khi làm các task còn lại của kế hoạch SEO, tự hiểu ngầm quy tắc
cộng `public/` ở trên**, không cần đợi PM sửa lại file kế hoạch.

**Chưa test được cục bộ** (không có `wrangler dev` khả dụng trong sandbox — `npx wrangler` timeout do
mạng, đã ghi nhận từ trước ở mục 47) — việc `directory = "./public"` có hoạt động đúng trên Cloudflare
Workers Static Assets hay không **chỉ xác nhận được sau khi deploy thật**: `/`, `/admin.html` phải
vẫn 200 đúng nội dung, còn `/worker.js`, `/wrangler.toml`, `/package.json` phải chuyển sang 404.

## 53. T3 — CLS (width/height 20 ảnh), favicon nhẹ, giảm Google Fonts, WebP QR (2026-09-01)

**Bước 1 — liệt kê 20 thẻ `<img>` + kích thước thật TRƯỚC khi sửa** (bắt buộc theo yêu cầu, đã in ra
cho PM xem trước khi động vào code): đếm chính xác 20 thẻ trong `index.html` (không đụng
`admin.html` cho phần ảnh — nó không bị Google crawl/index, `robots.txt` đã chặn, CWV không áp dụng
cho nó). Đã lấy kích thước file gốc thật (Pillow cho PNG, đọc `viewBox`/`width`/`height` attr cho
SVG) VÀ kích thước hiển thị thật theo CSS đang áp dụng (không dùng số cũ trong kế hoạch SEO vì CSS
đã đổi nhiều lần từ lúc viết kế hoạch, xem mục 26/32):

| Vị trí | Ảnh | CSS quy định | width/height dùng |
|---|---|---|---|
| Logo nav + footer (2 thẻ) | `logo.svg` (thật 520×420) | `.logo img{height:40px;width:auto}` → 50×40 | 50 / 40 |
| 7 cờ hero | `flags/*.svg` (thật ~900×600 hoặc tương đương 3:2) | `.flag-ico{width:32px;height:22px}` | 32 / 22 |
| 7 cờ card dịch vụ | `flags/*.svg` (cùng file, dùng lại) | `.card-service .flag img{width:56px;height:38px}` | 56 / 38 |
| QR form đăng ký | `qr-zalo.png` (thật 360×360, 100.603B) | `.qr-box img{width:140px;height:140px}` | 140 / 140 |
| QR footer | `qr-zalo.png` (cùng file) | inline `style="width:110px"` (nguồn vuông → cao tự 110) | 110 / 110 |
| Thumbnail bài viết (JS template, ~dòng 1186) | `p.image_url` (Supabase, đổi theo từng bài) | `.card-post .thumb{width:100%;aspect-ratio:2.3/1}` | 400 / 174 (đúng tỉ lệ 2.3:1 — **không dùng 400×225 (16:9) như bản kế hoạch cũ**, CSS đã đổi ratio ở mục 32.C.1 sau khi viết kế hoạch) |
| Ảnh popup chi tiết bài viết (JS template, ~dòng 1208) | `p.image_url` | `.post-modal-scroll img{width:100%;max-height:280px}`, popup ẩn mặc định | 640 / 280 (chỉ mang tính placeholder tỉ lệ — popup không hiện lúc tải trang nên không ảnh hưởng CLS thật) |

Riêng 2 dòng có **2 kích thước CSS khác nhau cho CÙNG 1 file `qr-zalo.png`** (140×140 ở form, 110×110
ở footer) — dùng đúng số của TỪNG vị trí, không gộp chung 1 số cho cả 2 (khác khuyến nghị "110×110"
chung chung trong bản kế hoạch cũ, đã kiểm tra CSS thật thay vì copy nguyên số cũ).

**Bước 2 — favicon nhẹ:** dùng Pillow thu nhỏ (LANCZOS) chính 2 file ĐANG DÙNG làm icon (không tạo
lại từ logo gốc thô) để giữ nguyên 100% thiết kế đã duyệt — `favicon.png` (512×512, 55.401B) →
`favicon-32.png` (32×32, **1.280B**); `logo-backup.png` (512×512, 37.132B, đang dùng cho
apple-touch-icon) → `apple-touch-180.png` (180×180, **8.813B**, đúng khuyến nghị kích thước Apple).
Sửa đúng 2 dòng `<link>` trong `index.html` VÀ 2 dòng tương ứng trong `admin.html` — **giữ nguyên**
dòng `<link rel="icon" type="image/svg+xml" href="assets/logo.svg">`. **QUAN TRỌNG — KHÔNG xóa/đổi**
`favicon.png`/`logo-backup.png` gốc: 2 file 512×512 này **vẫn cần thiết** cho
`admin-manifest.webmanifest` (icon PWA "Add to Home Screen" cần độ phân giải cao để không bị vỡ nét
trên màn hình điện thoại) — chỉ đổi 4 dòng `<link>` trỏ icon nhỏ trong `<head>`, không đụng
`admin-manifest.webmanifest`.

**Bước 3 — giảm Google Fonts:** `index.html` dòng 111: `wght@400;600;700;800` →
`wght@400;700` (2 weight thay vì 4, giảm số request/kích thước font phải tải). Đã quét TOÀN BỘ
`<style>` trước khi đổi URL — tìm thấy đúng 21 chỗ `font-weight:600` hoặc `font-weight:800`, đổi hết
về `font-weight:700` (nếu để sót, trình duyệt phải tự "giả lập đậm" bằng weight không khớp, chữ sẽ
xấu hơn). **KHÔNG đụng `admin.html`** (dòng font-weight riêng, dùng Google Fonts URL riêng của nó) —
admin không bị Google index/crawl, ngoài phạm vi Core Web Vitals công khai.

**Bước 4 — WebP cho QR:** tạo `qr-zalo.webp` bằng Pillow — **dùng `lossless=True`, KHÔNG dùng
lossy/quality=90** dù thử nghiệm cho thấy kích thước gần như y hệt (41.526B lossless vs 41.436B
lossy quality=90, chênh <100 byte) — QR code là hoa văn đen/trắng cần giữ SẮC NÉT tuyệt đối để máy
quét đọc được, nén lossy dù nhẹ vẫn có rủi ro làm mờ viền module QR, không đáng đánh đổi lấy chưa tới
100 byte. Kết quả: 100.603B (PNG) → 41.526B (WebP), giảm 59%. Bọc cả 2 chỗ dùng `qr-zalo.png` trong
`<picture><source type="image/webp">...<img>...</picture>` — CSS chọn ảnh (`.qr-box img`, inline
`style`) vẫn áp dụng đúng vì là CSS descendant selector, không bị `<picture>` chen vào phá vỡ.
**GIỮ NGUYÊN `og-image.png` dạng PNG** — không đụng, theo đúng yêu cầu (Zalo/1 số app đọc share-image
WebP không tốt).

**Nghiệm thu đã chạy:**
- `favicon.png` 55KB cũ **không còn xuất hiện trong bất kỳ thẻ `<link>` nào** (cả `index.html` lẫn
  `admin.html`) — đã `grep` xác nhận rỗng; vẫn còn dùng đúng trong `admin-manifest.webmanifest`
  (đúng ý đồ, không phải sót).
- `grep -oE "<img[^>]*>" index.html | grep -c "width="` = **20/20** — không thẻ nào bị sót.
- HTML cân bằng thẻ (`html.parser` Python, riêng `<picture>` mở/đóng khớp 2/2).
- `node --check` toàn bộ `<script>` inline OK.
- Test qua Claude Browser (local `file://`): layout không vỡ khi zoom xem icon cờ hero, nhưng **ảnh
  cục bộ không load được qua `file://` trong sandbox công cụ này** (giới hạn công cụ đã gặp nhiều
  lần trong phiên — `naturalWidth:0` dù không có lỗi console) — không phải lỗi code, sẽ xác nhận lại
  bằng ảnh thật trên production sau khi deploy.

**Đo Core Web Vitals — theo đúng yêu cầu "Lighthouse trước/sau", nhưng đổi phương pháp vì
`npx lighthouse` KHÔNG chạy được trong sandbox** (timeout mạng ra `registry.npmjs.org`, cùng vấn đề
đã gặp với `wrangler` — xem mục 47). **Đã đo trực tiếp bằng Performance API thật của trình duyệt
trên chính production `topvisa5s.com` TRƯỚC khi deploy T3** (số liệu dưới đây là mốc "trước" thật,
đo trên máy/mạng hiện tại, không phải giả lập):
- `domContentLoaded`: 1181ms · `load` event: 2013ms · `FCP`: 2580ms
- `LCP`: **không lấy được** — `PerformanceObserver({type:'largest-contentful-paint', buffered:true})`
  trả `null` dù chờ đủ lâu; đây là giới hạn của trình duyệt tự động hoá dùng trong công cụ này (cùng
  họ giới hạn với `window.innerWidth=0` đã ghi nhận ở mục 20), **không phải trang không có LCP**.
  Không tự bịa số để lấp chỗ trống này.
- `CLS` đo được lúc đó: 0 (bình thường — trang lúc "trước" đã tải xong ổn định trước khi script đo
  chạy, không bắt được đúng khoảnh khắc ảnh nhảy lúc tải ban đầu; giá trị 0 KHÔNG có nghĩa T3 vô ích
  — xem bằng chứng cấu trúc bên dưới mới là căn cứ chính).
- Google Fonts CSS: `wght@400;600;700;800` (4 weight) · favicon `<link>`: `assets/favicon.png`.
- **20/20 ảnh KHÔNG có `width`/`height`** lúc "trước" (0/20) — đây là bằng chứng CẤU TRÚC trực tiếp
  và chắc chắn nhất cho việc cải thiện CLS (cơ chế: trình duyệt không biết trước khoảng trống cần
  giữ chỗ cho ảnh → khi ảnh tải xong, nội dung bên dưới bị đẩy dịch), độc lập với việc đo `CLS` bằng
  số có bắt được đúng khoảnh khắc hay không.
- **Số "sau" khi deploy** (đo cùng cách, cùng máy/mạng, ngay sau khi deploy commit `33d13b4`):
  `domContentLoaded`: 517ms rồi 236ms ở lần đo lặp lại (so với 1181ms "trước") · `loadEvent`: 843ms
  rồi 427ms (so với 2013ms "trước") · `FCP`: **không bắt được lần nào** (mảng `performance
  .getEntriesByType('paint')` rỗng ở lần đo "sau" — xác nhận thêm đây là giới hạn API Paint Timing
  của trình duyệt tự động hoá trong công cụ này, không phải trang không paint được) · `LCP`: vẫn
  không lấy được, cùng lý do đã ghi ở trên.
  **Lưu ý quan trọng về độ tin cậy của riêng 2 số `domContentLoaded`/`loadEvent`:** đo 2 lần liên
  tiếp ở "sau" ra 2 kết quả khác nhau khá nhiều (517→236, 843→427) chỉ vì Cloudflare cache nóng dần
  lên qua từng lần — **không xem đây là con số "X% nhanh hơn" đáng tin cậy**, chỉ là tín hiệu định
  hướng nhẹ (cả 2 lần đo "sau" đều thấp hơn hẳn "trước", không có lần nào cao hơn).
- **Bằng chứng chắc chắn nhất vẫn là bằng chứng CẤU TRÚC** (không phụ thuộc cache/thời điểm đo):
  `imgsWithWidthHeight` 0/20 (tính trên 20 thẻ tĩnh) → **30/30** (tính trên toàn bộ ảnh trong DOM,
  kể cả bản JS nhân bản của slider đánh giá — xác nhận width/height được kế thừa đúng khi JS
  `cloneNode` các thẻ gốc); Google Fonts CSS URL đổi đúng `wght@400;600;700;800` → `wght@400;700`;
  `<link rel="icon" type="image/png">` đổi đúng `favicon.png` → `favicon-32.png`.
- **Đã xác nhận thêm trên production (không chỉ code):** cả 7 cờ dịch vụ tải thành công
  (`imgLoaded:true`), render đúng khớp 100% kích thước CSS quy định (56×38px), logo render đúng
  (natural 520×420 → rendered 50×40, không méo); `<picture>` QR chọn đúng nguồn `qr-zalo.webp` khi
  thật sự được kích hoạt tải (test bằng cách gỡ `loading="lazy"` + `cloneNode` để buộc trình duyệt
  đánh giá lại — `currentSrc` ra đúng `.webp`, `naturalSize` đúng 360×360) — lý do phải test kiểu
  này: công cụ trình duyệt tự động hoá dùng để test không tự kích hoạt được Intersection Observer
  của `loading="lazy"` (cùng họ giới hạn "không compositing khung nhìn thật" đã ghi ở mục 20/47),
  nên đo trực tiếp `imgLoaded` mà không gỡ lazy sẽ luôn ra `false` — đã xác nhận riêng 2 file
  `qr-zalo.png`/`qr-zalo.webp` tồn tại đúng qua `fetch()` trực tiếp trước khi kết luận đây là giới
  hạn công cụ chứ không phải lỗi thật.
- **An ninh (Phương án A) đã xác nhận đúng trên production:** `/worker.js`, `/wrangler.toml`,
  `/package.json` → cả 3 đều 404; `/`, `/admin.html`, `/assets/*` vẫn 200 đúng nội dung (đã so
  checksum MD5 file `favicon-32.png` local vs production, khớp 100%); redirect `workers.dev` (T1)
  không bị ảnh hưởng.

**⚠️ Không đặt pass/fail tuyệt đối vào số trên** — đúng cảnh báo trong kế hoạch SEO T3: trang có
~10 lượt/ngày nên PageSpeed Insights/CrUX chưa có dữ liệu thật, số Lighthouse-mô-phỏng (hay ở đây là
Performance API đo trực tiếp) chỉ đủ để SO SÁNH tương đối trước/sau, không phải con số cuối cùng.
Số liệu thật (28 ngày dữ liệu CrUX) chỉ đọc được sau khi có đủ traffic thật.

## 54. T4 — kết xuất bài viết phía server: `/blog` + `/blog/<slug>-<id>` (2026-09-02)

**Bối cảnh:** trước T4, bài viết nạp bằng JS từ Supabase vào `div#categorySections` rỗng lúc tải
trang, chi tiết mở bằng `openPostDetail(i)` không đổi URL — Google không có gì để lập chỉ mục, mọi
bài viết mang lại 0 lượt tìm kiếm. Task lớn, chia 4 bước, dừng lại xin xác nhận sau mỗi bước.

**Bước 1 — migration `05_Database/13_supabase_setup_phase13.sql`** (PM đã tự chạy, xác nhận
2026-09-02): bật extension `unaccent`; thêm `posts.slug text` + `posts.updated_at timestamptz
default now()`; trigger `set_posts_updated_at` tự cập nhật `updated_at` mỗi lần UPDATE; backfill
`slug` cho bài đã có (`lower(title)` → thay riêng `đ`→`d` → `unaccent()` → chỉ giữ `a-z0-9`, nối
bằng `-`) — đã mô phỏng bằng Python trước khi viết SQL, và xác nhận lại bằng REST API sau khi PM
chạy: 12 bài đều ra đúng slug dự đoán, không ký tự thừa/trùng. **Không có `insert into`**, idempotent
đúng quy tắc `05_Database/README.md`. Không phải tạo bảng mới nên **không cần** sửa
`06_Backup_Tool/backup-supabase.mjs`.

**Bước 2 — route `/blog` (`worker.js`):**
- `getSiteChrome(env, request)`: trích CSS design system + navbar + footer **trực tiếp từ chính
  `index.html` đang chạy** (qua `env.ASSETS.fetch('/')` rồi regex-extract `<style>`/`<nav
  class="navbar">`/`<footer id="footer">`) — **KHÔNG copy cứng 1 bản riêng trong `worker.js`**, để
  `/blog*` luôn tự động khớp 100% với trang chủ mỗi khi sau này ai sửa design system/navbar/footer,
  tránh lặp lại đúng kiểu rủi ro "2 bản sao dễ lệch nhau" đã gặp nhiều lần (giá dịch vụ mục 31.D,
  FAQ/JSON-LD mục 12). Asset tương đối (`assets/logo.svg`) trích ra được đổi thành tuyệt đối
  (`/assets/logo.svg`), anchor `#dich-vu` đổi thành `/#dich-vu` — vì `/blog*` không đứng ở `/` nên
  đường dẫn/anchor tương đối sẽ sai chỗ.
- `renderBlogList()`: fetch `posts?select=id,title,slug,image_url,created_at,categories(name)
  &published=eq.true&order=created_at.desc`, mỗi bài bọc `<article><a class="card-post"
  href="/blog/<slug>-<id>">` (dùng lại nguyên class CSS `.card-post` có sẵn — hoạt động bình thường
  trên thẻ `<a>` vì rule đã có `display:flex`, không cần CSS mới). `<head>` riêng: title/description/
  self-canonical (`url.origin+url.pathname`, đúng quy tắc T1)/og:*. Thêm 1 rule CSS nhỏ
  `h1.section-title` (mở rộng selector `h2.section-title` có sẵn sang thêm thẻ H1, dùng lại y
  nguyên giá trị/biến màu, không bịa gì mới) để mỗi trang có đúng 1 H1 ngữ nghĩa.
- Response: `Content-Type: text/html;charset=utf-8`, `Cache-Control: public,max-age=300`.

**Bước 3 — route `/blog/<slug>-<id>` (`worker.js`):**
- Tách `<id>` bằng regex `^(.+)-(\d+)$` — luôn lấy đúng SỐ CUỐI CÙNG làm id, kể cả khi slug chứa số
  khác (vd ngày tháng `...-13-08-2026-15` vẫn tách đúng `id=15`). Có thêm nhánh fallback
  `/blog/<id>` (không có slug) cho chắc.
- Tra bài theo `id` + `published=eq.true` — không tồn tại/chưa publish → **404 thật** (không
  redirect trang chủ, tránh Google coi là soft-404). Slug trong URL sai (đổi tiêu đề, gõ tay, hoặc
  rỗng) → **301** sang đúng `/blog/<slug thật>-<id>`.
- `<head>` sinh động: `title`=`p.title` (nguyên văn, không thêm hậu tố thương hiệu — theo đúng chữ
  của kế hoạch), `description` = 155 ký tự đầu `p.content` đã bỏ thẻ HTML (hàm
  `stripHtmlAndTruncate()` — phòng hờ dù `content` hiện tại là text thường, không có HTML thật),
  self-canonical, `og:image` = `p.image_url` (fallback `og-image.png` nếu bài chưa có ảnh). JSON-LD
  `Article` đủ 5 field theo đúng yêu cầu: `headline`/`datePublished`/`dateModified`/`author`
  (`Organization`, vì DB không lưu tác giả riêng từng bài)/`image`.
- Nội dung bài hiển thị qua class mới `.article-title`/`.article-meta`/`.article-body`/
  `.article-cover` (thêm vào cùng khối CSS phụ với `h1.section-title` ở Bước 2, dùng lại biến màu/
  khoảng cách có sẵn).

**Bước 4 — `index.html`, card bài viết (script "DANH MỤC BÀI VIẾT ĐỘNG"):**
- `<div class="card-post" onclick="openPostDetail(i)">` → `<a class="card-post"
  href="/blog/<slug>-<id>" onclick="return openPostDetail(i,event)">` — Google/crawler giờ có link
  thật để đi theo và index được trang chi tiết SSR.
- `openPostDetail(i,ev)` thêm tham số `ev`: **Ctrl/Cmd/Shift+click** (ý định mở tab mới/cửa sổ mới)
  → trả `true`, KHÔNG gọi `preventDefault` → trình duyệt tự điều hướng theo `href` thật; **click
  thường** → `preventDefault()` + mở popup như cũ (giữ nguyên UX quen thuộc, không rời trang) + trả
  `false`. JS lỗi/bị tắt → link vẫn hoạt động bình thường vì bản chất là `<a href>` thật.

**Đã kiểm tra kỹ trước khi tin tưởng (mỗi bước test bằng dữ liệu THẬT, không phải giả lập tùy ý):**
- Slug backfill: mô phỏng Python + đối chiếu REST API sau khi PM chạy — khớp 100%.
- `/blog`: import thẳng `worker.js` vào Node, mock `env.ASSETS.fetch` trả `index.html` thật + mock
  Supabase trả 3 bài thật (có 1 bài `categories:null` để thử edge case) → 3 `<article>`, canonical
  đúng, navbar/footer/asset-path/anchor đều đúng, đúng 1 H1 — mở bằng trình duyệt thật xác nhận
  layout không vỡ (đo bằng JS vì ảnh chụp màn hình bị lỗi công cụ, xem mục 20/47).
- `/blog/<slug>-<id>`: dùng bài thật "LỄ OBON 2026..." (nhiều đoạn, emoji, tiếng Nhật) — xác nhận cả
  câu ở GIỮA lẫn câu CUỐI bài đều có trong HTML (chứng minh không bị cắt, đúng trọng tâm nghiệm thu
  "view-source thấy đầy đủ nội dung"), JSON-LD parse được và đủ 5 field, test riêng 5 tình huống
  (đúng slug/sai slug/chỉ id/id không tồn tại/path rác) đều ra đúng status (200/301/301/404/404).
- Bước 4: test 2 lớp — gọi `openPostDetail()` trực tiếp với event giả lập (xác nhận đúng
  `preventDefault` có/không gọi theo từng loại click) VÀ bấm chuột THẬT vào 1 card chèn vào DOM
  (không chỉ gọi hàm) — popup mở đúng, đúng tiêu đề.
- `node --check`/parse toàn bộ `<script>` inline: OK ở cả 2 file.

**Chưa test được** (cần deploy thật): redirect 301 sống trên production, curl `grep -c "<article"`
trên `topvisa5s.com/blog`, dán URL bài viết thật vào Google Rich Results Test — sẽ làm ngay sau khi
deploy.

**⚠️ Việc CHƯA làm (đã ghi rõ trong kế hoạch, để dành cho sau):** việc 6 của T4 ("mỗi bài blog nối
1-2 internal link về trang quốc gia liên quan") — kế hoạch tự ghi chú "làm được sau T14" (trang quốc
gia chưa tồn tại), không phải bị bỏ sót.

**Đã deploy + kiểm tra trên production (2026-09-02, commit `18da0ea`):**

**⚠️ Lỗi thật phát hiện lúc tự kiểm — 2 route mới trả 404 với request HEAD (sửa bằng commit
`f37284b`, cùng ngày):** `curl -I` (gửi HEAD) tới `/blog` và `/blog/<slug>-<id>` ra 404, dù `curl`
thường (GET) ra đúng 200. Nguyên nhân: điều kiện route chỉ khớp `request.method === 'GET'`, HEAD rơi
xuống `env.ASSETS.fetch()` — trang chủ `/` không bị lỗi này vì còn `index.html` làm file tĩnh dự
phòng, còn `/blog`/`/blog/<slug>-<id>` **không có file tĩnh tương ứng nào** trong `public/` nên rơi
xuống là 404 thật. Đã sửa: đổi điều kiện thành `request.method === 'GET' || request.method ===
'HEAD'` cho cả 2 route. **Bài học:** route SSR nào không có file tĩnh dự phòng thì PHẢI tự nhận cả
HEAD, không thể dựa vào hành vi "tình cờ đúng" như trang chủ.

**Kết quả kiểm tra sau khi sửa xong (toàn bộ trên `topvisa5s.com` thật):**
- `/blog`: 12 `<article>` (đúng 12 bài đã publish), canonical đúng, `Content-Type`/`Cache-Control`
  đúng, cả GET lẫn HEAD đều 200.
- `/blog/le-obon-2026-...-1` (bài thật, nội dung dài có emoji): 200, canonical đúng, nội dung đầy đủ
  qua `get_page_text` khớp 100% dữ liệu DB, ảnh cover load đẹp trên trình duyệt thật.
- Sai slug (`/blog/tieu-de-sai-1`) → 301 đúng URL thật; chỉ có id không slug (`/blog/1`) → 301 đúng
  URL thật; id không tồn tại (`/blog/bai-viet-99999`) → 404.
- **Google Rich Results Test thật** (`search.google.com/test/rich-results`, dán đúng URL bài Obon):
  "Crawled successfully", **"1 valid item detected"** cho Articles, tiêu đề trích xuất đúng y hệt
  bài thật — đủ điều kiện rich results. Có "1 non-critical issue" (không phải lỗi — giao diện Google
  Search Console khó thao tác sâu hơn qua công cụ trình duyệt tự động để đọc đúng chữ cảnh báo, nhưng
  "non-critical" đã đủ nghĩa "không báo lỗi Article" theo đúng nghiệm thu kế hoạch).
- Card trang chủ: xác nhận cả 12 card đều đã là `<a href="/blog/...">` thật trên production. Bấm
  thử 1 card thật (`.click()` trực tiếp lên đúng element, tránh sai lệch tọa độ do trang đã cuộn) →
  popup mở đúng, đúng tiêu đề/danh mục/nội dung, KHÔNG rời trang.
- Hồi quy: trang chủ/`admin.html` vẫn 200; `worker.js`/`wrangler.toml`/`package.json` vẫn 404 (an
  ninh Phương án A không bị ảnh hưởng); redirect `workers.dev` (T1) vẫn hoạt động; `/api/chat` vẫn
  route đúng; giá SSR trang chủ (T9) và favicon mới (T3) không đổi.

T4 coi như hoàn tất và đã xác nhận sống đúng trên production.

## 55. T21 — Trang 404 đầy đủ (2026-09-02)

**Bối cảnh:** sắp có 2 nhóm route động (`/blog/<slug>-<id>`, `/visa-<slug>` khi T14 làm xong) sẽ
sinh ra nhiều đường dẫn 404 tiềm năng (slug gõ sai, bài bị unpublish, link cũ chia sẻ trên Facebook,
nước chưa publish). Mặc định Cloudflare Static Assets trả **trang trắng không navbar** cho path
không khớp — khách vào là thoát ngay.

**Việc (`02_Source/worker.js`):** đổi dòng cuối `fetch()` từ `return env.ASSETS.fetch(request)`
(hành vi cũ, trả thẳng 404 mặc định cho path lạ) sang: gọi `env.ASSETS.fetch(request)` trước —
**giữ nguyên 100%** cho mọi asset thật (200 không đổi gì) — **CHỈ khi** kết quả là `404` (và method
là GET/HEAD) mới tự dựng trang 404 riêng qua `render404Page()`. Trang 404 dùng lại đúng
`getSiteChrome()` đã có sẵn từ khối Blog SSR (T4) để trích navbar/footer/CSS **trực tiếp từ chính
`index.html`** — không copy riêng 1 bản, tự động khớp 100% design system mỗi khi sau này ai sửa
navbar/footer/CSS (đúng bài học "2 bản sao dễ lệch nhau" đã ghi nhiều lần). Nội dung: mã 404 lớn,
câu xin lỗi, nút "Về trang chủ" + "Xem Blog" (`.btn.btn-primary`/`.btn.btn-outline` có sẵn), dòng
hotline `tel:0935887922`, `<meta name="robots" content="noindex">`, response status **404** thật
(không phải 200 giả 404), `Cache-Control: no-store` (không cache trang lỗi ở CDN).

**Link trang quốc gia "đang publish" — thiết kế tự động, không cần sửa lại sau này:** kế hoạch yêu
cầu 404 có link tới 3-4 trang quốc gia đang publish, nhưng **T13/T14 (bảng `noi_dung_quoc_gia` +
route `/visa-<slug>`) CHƯA làm** ở thời điểm này — không có bảng, không có route. Đã viết
`getPublishedCountryLinks()` query thẳng `noi_dung_quoc_gia?select=slug,ten_nuoc&published=eq.true&limit=4`
bọc `try/catch` — bảng chưa tồn tại thì query ném lỗi "relation does not exist", bị nuốt về mảng
rỗng, trang 404 hiện tại chỉ còn link trang chủ + `/blog` + hotline (đã test xác nhận không có link
`/visa-` nào). **Khi T13/T14 xong và có nước `published=true`, trang 404 sẽ TỰ ĐỘNG hiện thêm link
ngay, không cần quay lại sửa file này.** Lưu ý: cột `slug` trong `noi_dung_quoc_gia` LÀ toàn bộ path
cuối (vd `visa-nhat-ban`, theo đúng thiết kế T13/T14), nên href chỉ nối `/` + `slug`, KHÔNG ghép
thêm tiền tố `visa-` (đã tự sửa 1 lỗi thật lúc test — ban đầu viết nhầm `/visa-${slug}` ra
`/visa-visa-nhat-ban`).

**CHƯA làm 410 Gone cho bài đã unpublish** (đúng như kế hoạch ghi) — cần thêm cột theo dõi "đã từng
publish", phức tạp hơn giá trị ở giai đoạn này.

**Đã test trước khi deploy:** `node --check` OK; import thẳng `worker.js` vào Node (mock
`env.ASSETS.fetch` trả `index.html` thật cho `/` và 404 cho path lạ, mock Supabase ném lỗi bảng
chưa tồn tại) — xác nhận GET lẫn HEAD path lạ đều ra đúng 404 kèm navbar/footer/robots
noindex/link home+blog+hotline, không có link `/visa-` nào; test riêng kịch bản mock
`noi_dung_quoc_gia` CÓ dữ liệu (2 nước) → xác nhận hiện đúng 2 link `/visa-nhat-ban`/`/visa-han-quoc`
(bắt được lỗi tiền tố kép nói trên); `/` (trang chủ) vẫn 200 bình thường (hồi quy).

**Đã deploy + xác nhận trên production (commit `3278ae8`):** `curl -sI
https://topvisa5s.com/khong-ton-tai` → **404**; `grep` xác nhận đúng 1 navbar + 1 footer + đúng 1
`<meta name="robots" content="noindex">` + có `href="/blog"` + có `tel:0935887922`; mở bằng Claude
Browser thấy đầy đủ navbar (logo, 5 mục menu, nút CTA) + khối 404 + 2 nút + hotline + footer đầy đủ
(đọc bằng `javascript_tool` vì ảnh chụp màn hình lúc đã cuộn bị lỗi xếp lớp — giới hạn công cụ đã
biết, không phải lỗi trang, xem mục 20/47/53) — **không phải trang trắng**. Hồi quy: `/`, `/admin`
(qua redirect có sẵn `/admin.html`→`/admin`, không liên quan T21), `/blog`, `/assets/logo.svg` vẫn
200; `/worker.js`/`/wrangler.toml`/`/package.json` vẫn 404 (an ninh Phương án A không đổi — giờ có
thêm HTML thân thiện thay vì trang trắng khi 404, nhưng vẫn không lộ nội dung file); redirect
`workers.dev`→domain chính (T1) vẫn hoạt động.

T21 coi như hoàn tất và đã xác nhận sống đúng trên production.

## 56. T5 — Sitemap động từ worker, xoá sitemap.xml tĩnh (2026-09-02)

**Bối cảnh:** `02_Source/public/sitemap.xml` tĩnh chỉ có đúng 1 URL trang chủ, `lastmod` hardcode
`2026-08-07` không bao giờ tự cập nhật — trong khi site đã có `/blog` + 12 bài viết thật (T4) cần
liệt kê. Đã xoá file tĩnh, thêm route `/sitemap.xml` vào `worker.js`, đặt **trước** dòng
`env.ASSETS.fetch()` fallback trong `fetch()` để route động luôn thắng (không phụ thuộc file tĩnh
còn sót hay không — dù sao cũng đã xoá file đó).

**Việc (`02_Source/worker.js`, hàm `renderSitemap()`):** ghép 5 nguồn URL:
1. `/` — không có nguồn "lần sửa gần nhất" đáng tin cậy (trang chủ gộp nhiều mảng: giá dịch vụ,
   đánh giá, bài viết mới...) → **không bịa `lastmod`**, chỉ có `<loc>` (hợp lệ theo chuẩn sitemap —
   `<lastmod>` là tùy chọn).
2. `/blog` — `lastmod` = ngày **mới nhất** trong `updated_at` của các bài published (tận dụng luôn
   kết quả `posts` đã fetch, không query thêm) — là ngày THẬT vì nội dung `/blog` đổi đúng theo đó.
3. **"Trang tin cậy"** (T11 — `chinh-sach-bao-mat.html`/`dieu-khoan-dich-vu.html`/`lien-he.html`)
   **CHƯA làm** ở thời điểm viết T5 → hàm `getExistingTrustedPages()` dò tồn tại THẬT qua
   `env.ASSETS.fetch()` (HEAD từng file), chỉ đưa vào sitemap nếu trả 200. **Khi T11 xong và các
   file được thêm vào `public/`, sitemap TỰ ĐỘNG hiện thêm URL ngay lần crawl kế tiếp — không cần
   quay lại sửa file này** (cùng triết lý "tự động, không cần nhớ sửa lại" đã áp dụng nhiều lần,
   xem mục 45/46 — bài học "quên 1 chỗ, im lặng không báo").
4. Trang quốc gia đã publish (T13/T14, **CHƯA làm**) — hàm `getPublishedCountrySlugsForSitemap()`
   query `noi_dung_quoc_gia?select=slug&published=eq.true` bọc `try/catch` giống hệt cơ chế đã
   dùng ở trang 404 (T21, `getPublishedCountryLinks()`): bảng chưa tồn tại → mảng rỗng, không
   throw. **Chỉ SELECT `slug`** (T13 không định nghĩa cột `updated_at` cho bảng này) — không suy
   đoán thêm cột, các URL này không có `<lastmod>`.
5. Toàn bộ `posts?select=id,slug,updated_at&published=eq.true` — `lastmod` = `updated_at` THẬT của
   từng bài (cột có trigger tự cập nhật, `05_Database/13_supabase_setup_phase13.sql`) — không bịa.

**CHỈ sinh `<loc>`+`<lastmod>`** — bỏ hẳn `<changefreq>`/`<priority>` theo đúng yêu cầu (Google công
bố rõ bỏ qua 2 thẻ này). `<lastmod>` chỉ xuất hiện khi có giá trị THẬT đáng tin — không tự bịa ngày
cho URL không có nguồn dữ liệu tin cậy (mục 1, 3, 4 ở trên).

**Quyết định lỗi có chủ đích khác nhau giữa 2 nhóm nguồn:** lỗi ở "trang tin cậy"/"trang quốc gia"
(nguồn phụ, tùy chọn) bị nuốt êm (mảng rỗng) vì đây là tính năng CHƯA tồn tại, không phải lỗi thật.
Ngược lại, lỗi khi fetch `posts` (nguồn CHÍNH, phải có) **KHÔNG bọc catch riêng** — cố tình để lỗi
rơi ra ngoài cho `catch` ở `fetch()` trả **500**, thay vì âm thầm phát sinh 1 sitemap "200 OK" trông
có vẻ ổn nhưng thiếu sạch mọi bài viết (Google có thể lỡ tin nhầm đó là danh sách đầy đủ, tệ hơn 1
lần 500 tạm thời mà Google tự retry sau).

Nhận cả `GET`/`HEAD` (route không có file tĩnh dự phòng, đúng bài học ở mục 3).
Content-Type `text/xml;charset=utf-8`, `Cache-Control: public,max-age=300`.

**Đã test trước khi deploy:** `node --check` OK; test bằng Node import thẳng `worker.js`, 5 kịch
bản (mock `env.ASSETS.fetch`/Supabase): (1) chưa có T11/T13/T14 + 2 bài viết — đúng 4 URL, không
`changefreq`/`priority`, `/` không lastmod, `/blog` lastmod = ngày mới nhất; (2) không có bài viết
nào — `/blog` không có `<lastmod>`; (3) giả lập T11 xong (3 file tồn tại) + T13/T14 có 1 nước
published — tự động hiện đủ 4 URL mới không cần sửa code; (4) `HEAD /sitemap.xml` → 200; (5) query
`posts` lỗi (Supabase down) → xác nhận trả **500** thay vì 200 thiếu bài. Validate XML bằng
`python3 -c "xml.etree.ElementTree"` (không chỉ regex) — xác nhận well-formed, kể cả trường hợp
slug chứa ký tự `<script>` vẫn được `escHtml()` escape đúng chuẩn XML.

**Đã deploy + xác nhận trên production (commit `e314cd9` xoá file tĩnh, `4143614` thêm route):**
`https://topvisa5s.com/sitemap.xml` → 200, `Content-Type: text/xml;charset=utf-8`,
`Cache-Control: public,max-age=300`; validate bằng Python XML parser → **14 URL hợp lệ** (`/` +
`/blog` + 12 bài viết thật, tất cả `lastmod=2026-09-02` vì cột `updated_at` của bảng `posts` mới
được thêm đúng hôm nay qua migration 13 — PostgreSQL gán `default now()` cho các dòng có sẵn lúc
`ALTER TABLE ADD COLUMN`, đây là giá trị THẬT trong DB chứ không phải lỗi); 0 thẻ
`changefreq`/`priority`; 0 link `/visa-`/trang tin cậy (đúng vì T11/T13/T14 chưa làm). Hồi quy:
`robots.txt` vẫn khai đúng dòng `Sitemap: https://topvisa5s.com/sitemap.xml`; `/`, `/blog` vẫn 200;
`/worker.js`/`/wrangler.toml` vẫn 404 (an ninh không đổi); trang 404 (T21) vẫn hoạt động.

**⚠️ Bài học khi tự kiểm bằng `curl` sau deploy — đừng lặp lại lỗi vòng lặp poll sai điều kiện đã
gặp ở T21 (mục 55):** lần đầu poll bằng điều kiện "thấy `<urlset`" thoát ngay lập tức vì bản TĨNH
cũ cũng có `<urlset>` — tưởng đã deploy xong nhưng thực ra đang đọc cache/bản cũ. Phải poll bằng
điều kiện phân biệt được bản mới với bản cũ (ở đây: "không còn thấy `changefreq`") mới xác nhận
đúng đã deploy xong.

T5 coi như hoàn tất và đã xác nhận sống đúng trên production.

## 57. T11 — 3 trang pháp lý: Chính sách bảo mật, Điều khoản dịch vụ, Liên hệ (2026-09-02)

**Region Supabase (T27):** PM xác nhận project đặt **NGOÀI Việt Nam** — Chính sách bảo mật nêu rõ
điều này ở mục 4 (nơi lưu trữ dữ liệu). **Chưa xác định được region cụ thể (vd Singapore)** — PM
tự xem tại Supabase Dashboard → Project Settings → General → Region nếu muốn ghi chính xác hơn.

**3 file tĩnh mới** (`02_Source/public/chinh-sach-bao-mat.html`, `dieu-khoan-dich-vu.html`,
`lien-he.html`) — dựng bằng script Node 1 lần (không lưu lại script, chỉ dùng lúc tạo) trích
**nguyên văn** `<style>` + `<nav class="navbar">` + `<footer id="footer">` từ chính `index.html`
(đã sửa xong footer/form trước khi trích, xem dưới) — đảm bảo khớp 100% design system, không tự
viết CSS mới. Mỗi trang tự thêm: hamburger menu mobile + nút lên đầu trang (copy đúng JS gốc từ
`index.html`, không copy toàn bộ `<script>` gốc vì phần lớn phục vụ form/slider/chatbox không có
trên các trang này).

**⚠️ Canonical dùng path KHÔNG đuôi `.html`** (`https://topvisa5s.com/chinh-sach-bao-mat`, không
phải `/chinh-sach-bao-mat.html`) — Cloudflare Static Assets tự **307-redirect** mọi file `.html`
sang bản không đuôi (đã xác nhận hành vi này từ trước qua `/admin.html`→`/admin`, xem mục 55/T21).
Nếu đặt canonical là bản `.html` sẽ tạo vòng redirect+canonical lệch nhau. Toàn bộ link nội bộ
(footer, form, sitemap) đều dùng đúng path không đuôi này.

**A. Chính sách bảo mật:**
- Căn cứ pháp lý: **Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15** (hiệu lực 01/01/2026) +
  **Nghị định 356/2025/NĐ-CP** — **KHÔNG** nhắc Nghị định 13/2023 (đã bị thay thế, đã `grep` xác
  nhận 0 lần xuất hiện).
- Dữ liệu thu thập: chỉ nêu đúng 2 nguồn CÓ THẬT đọc trực tiếp từ code — form "Đăng ký tư vấn miễn
  phí" (Họ tên/SĐT/Email không bắt buộc/Quốc gia/Ghi chú, khớp `index.html` dòng ~781-810 và payload
  POST `leads` dòng ~1353) + Chat Box (nội dung tin nhắn `chat_logs`, và có thể tạo `leads` nếu
  khách tự để lại SĐT/tên trong khung chat, xem mục 47.B). Không bịa thêm nguồn nào khác.
- Có đủ 2 nội dung T11 yêu cầu bổ sung: **quyền RÚT LẠI ĐỒNG Ý** (mục 5) + **nêu rõ dữ liệu có thể
  lưu trên hạ tầng nước ngoài** (mục 4, do T27 xác nhận ngoài VN).

**B. Điều khoản dịch vụ:**
- Chính sách "Đậu Visa Mới Thu Phí Dịch Vụ" (mục 3) **copy nguyên văn** từ khối `.usp-highlight`
  trong hero `index.html` — không viết lại/diễn giải khác đi.
- **KHÔNG** nhắc "đã đăng ký kinh doanh" hay số GPKD ở bất kỳ đâu (đã `grep -ci "giấy phép|GPKD"`
  cả 3 file → 0 kết quả) — đúng vì PM xác nhận trước đó chưa có giấy phép kinh doanh (xem mục 8).

**C. Liên hệ:** nhúng Google Maps qua `<iframe src="https://www.google.com/maps?q=<địa chỉ>&output=embed">`
(không cần API key/billing) cho "303 Âu Cơ, Liên Chiểu, Đà Nẵng" + JSON-LD `LocalBusiness`
(name/address/telephone/email/url/sameAs) + nút CTA "Đăng ký tư vấn miễn phí" trỏ về
`/#dang-ky` (dùng lại đúng form ở trang chủ, **không** tạo form trùng lặp trên trang này — tránh
phải bảo trì 2 nơi cùng logic submit). **KHÔNG thêm** `openingHours`/`geo` vào schema — T10 (giờ
làm việc + toạ độ từ GBP) **vẫn đang chờ PM cấp**, không tự bịa.

**D. Sửa `index.html`:** thêm 3 link vào `.copyright` (dòng dưới footer, không đổi `.footer-grid`
4 cột hiện có — tránh phải restructure CSS grid); đổi dòng "🔒 Thông tin của bạn được bảo mật tuyệt
đối" thành link tới `/chinh-sach-bao-mat`, thêm 1 dòng mới ngay trên nó: "Bằng việc gửi thông tin,
bạn đồng ý với Chính sách bảo mật" (link cùng trang) — cả 2 nằm cạnh nút submit form.

**E. Sửa `worker.js` (liên quan T5):** `TRUSTED_STATIC_PAGES` (mục 56) đổi từ path có `.html` sang
path KHÔNG đuôi — lúc viết T5 các file này CHƯA tồn tại nên chưa lộ ra lỗi; nếu giữ nguyên `.html`,
`getExistingTrustedPages()` sẽ luôn nhận về `307` (không phải `2xx`) cho file thật sự tồn tại, khiến
`res.ok` sai thành `false` — 3 trang không bao giờ được liệt kê vào sitemap dù đã publish. Phát hiện
lúc rà lại logic trước khi deploy hôm nay, sửa trước khi lỗi kịp xảy ra trên production.

**Đã test trước khi deploy:** `node --check` (cả 3 file mới + `index.html` + `worker.js`); HTML
cân bằng thẻ bằng `python3 html.parser` (cả 4 file); LocalBusiness JSON-LD parse hợp lệ bằng
`json.loads`; mở cả 4 trang qua Claude Browser (`get_page_text`/`javascript_tool`) xác nhận đúng
canonical/H1=1/footer/link/không GPKD.

**Đã deploy + xác nhận trên production (commit `0804af3`):** cả 3 URL (không đuôi `.html`) → 200;
`.html` → 307 redirect đúng; canonical đúng path không đuôi; footer + link cạnh form hoạt động;
**sitemap.xml TỰ ĐỘNG hiện thêm đúng 3 URL này ngay lần crawl kế tiếp** — xác nhận đúng thiết kế
"tự động, không cần sửa lại" đã viết ở T5 (mục 56), không cần đổi gì thêm ngoài fix ở mục E; mở
`/lien-he` bằng Claude Browser thật (không phải `file://`) — logo/Google Maps iframe load đúng, menu
hamburger mobile hoạt động (test bằng cách bấm qua `javascript_tool`, resize viewport 375×812). Hồi
quy: `/`, `/blog`, `/admin` vẫn 200; `/worker.js`/`/wrangler.toml` vẫn 404; `robots.txt` vẫn đúng
dòng `Sitemap:`; trang 404 (T21) vẫn hoạt động.

**Còn thiếu (đã nói rõ với PM, không tự làm):** trang `gioi-thieu.html` **CHƯA làm** — chờ PM cấp
nội dung câu chuyện công ty + ảnh đội ngũ/văn phòng (T11b). **Nội dung pháp lý ở 2 trang Chính sách
bảo mật/Điều khoản dịch vụ mới chỉ là bản do Claude Code soạn theo đúng luật/nghị định đã dẫn — nên
cho người có chuyên môn pháp lý rà lại trước khi chính thức công bố rộng rãi**, đúng khuyến nghị đã
có sẵn trong kế hoạch SEO T11.

T11 coi như hoàn tất (trừ `gioi-thieu.html`) và đã xác nhận sống đúng trên production.

## 58. T13 — bảng `noi_dung_quoc_gia` + màn nhập trong admin (2026-09-02)

**⚠️ CẦN PM TỰ CHẠY MIGRATION TRƯỚC KHI DÙNG ĐƯỢC — chưa chạy thì bỏ qua bước này sẽ lặp lại đúng
sự cố đã ghi ở mục 45:** `05_Database/14_supabase_setup_phase14.sql` **CHƯA được chạy** trên
Supabase production (đã xác nhận qua `curl` — sitemap.xml không có URL `/visa-<slug>` nào, đúng vì
bảng chưa tồn tại). Trước khi PM chạy file này, tab "Cài đặt chung" trong admin sẽ báo lỗi toast đỏ
"Lỗi tải nội dung quốc gia..." mỗi lần đăng nhập — **đây là hành vi đã lường trước, không phải bug
mới**, chỉ hết khi PM chạy migration.

**Migration (`14_supabase_setup_phase14.sql`):** bảng `noi_dung_quoc_gia` đúng theo thiết kế T13
(`slug`/`ten_nuoc`/`title_seo`/`meta_description`/`h1`/`mo_dau`/`khoi_noi_dung` jsonb/`faq` jsonb/
`thoi_gian_xu_ly`/`thu_tu`/`published` default false), RLS `anon` chỉ SELECT khi `published=true`,
`authenticated` toàn quyền — cùng khuôn `posts`/`dich_vu_gia`. **Tự thêm 2 phần ngoài spec gốc, có
lý do rõ ràng:**
- Cột `updated_at` + trigger tự cập nhật (cùng mẫu `posts`, migration 13) — spec T13 gốc KHÔNG có
  cột này, nhưng đã tự thêm để sitemap.xml (T5) có `<lastmod>` THẬT cho trang quốc gia sau này thay
  vì mãi mãi không có — chi phí thấp (1 cột + 1 trigger, y hệt khuôn đã có), lợi ích rõ (khớp đúng
  triết lý "lastmod lấy updated_at THẬT" đã áp dụng cho `/blog`). Đã sửa `worker.js` dùng ngay cột
  này trong cùng lần deploy (xem `getPublishedCountriesForSitemap()`), không phải để dành làm sau.
- Cột `tac_gia` (cả `noi_dung_quoc_gia` lẫn `alter table posts`) — gộp theo đúng chỉ định trong kế
  hoạch SEO (mục T20: *"gộp vào migration 14 của T13, chưa deploy nên không tốn migration riêng"*).
  Để trống, KHÔNG tự bịa tên chuyên viên — chờ PM cấp tên/chức danh + xác nhận đồng ý công khai.

**Màn nhập trong admin (`admin.html`, tab "Cài đặt chung", block mới `.c-nqg`):** theo đúng mẫu
`dich_vu_gia`/`danh_gia_khach_hang` đã có (list CRUD + dialog `dlg-standard`) — KHÔNG dựng sẵn 7
dòng placeholder cho 7 nước (khác cách làm ở trang 404/mục 55), mà theo đúng precedent
`dich_vu_gia`: list chỉ hiện dòng ĐÃ tạo, "+ Thêm" mở dialog với select "Quốc gia" giới hạn đúng 7
nước cố định (`NQG_COUNTRIES`, khớp `DVG_COUNTRIES` trừ `"Khác"`) **và loại bỏ nước đã có dòng
khác** (tránh trùng `slug` unique). Sửa dòng có sẵn thì khóa hẳn select Quốc gia (đổi nước = tạo
trang khác, không phải sửa trang hiện tại).

**Khối H2 + FAQ — quyết định kiến trúc quan trọng, khác hẳn "Thành viên nhóm"/"Xử lý phát sinh":**
2 mảng `khoi_noi_dung`/`faq` là **jsonb lưu thẳng trong 1 dòng**, không phải bảng con riêng có
API/id riêng như Thành viên nhóm. Vì vậy **không cần giữ 1 mảng JS đồng bộ qua `oninput`** — mỗi
khối là 1 `.nqg-block-item` thuần trong DOM (`addNqgKhoiNoiDung()`/`addNqgFaq()` chèn HTML trực
tiếp bằng `insertAdjacentHTML`, "Xóa" chỉ gỡ đúng phần tử qua `removeNqgBlock(this)` + tự đánh lại
số thứ tự nhãn), và **lúc bấm Lưu mới đọc lại toàn bộ giá trị hiện có trong DOM**
(`collectNqgKhoiNoiDung()`/`collectNqgFaq()`, tự lọc bỏ khối trống hoàn toàn) rồi gộp thành 1 mảng
gửi đi cùng lúc với các field khác — đơn giản hơn hẳn cách giữ 2 nguồn sự thật (mảng JS + DOM) luôn
phải đồng bộ nhau, mà `snapshotDialog()`/`confirmCloseDialog()` (mục 23) vẫn hoạt động đúng bình
thường vì cơ chế đó vốn đã tự quét MỌI input/textarea trong overlay, không quan tâm chúng tĩnh hay
được chèn động.

**`noi_dung_html` được coi là HTML thật** (đúng tên cột, không phải text thường như `posts.content`)
— textarea có ghi chú "gõ HTML cơ bản được" và nút "Xem trước" (`toggleNqgPreview()`) render trực
tiếp bằng `innerHTML` (không qua `esc()`) cho riêng trường này, còn H1/H2/FAQ (text thường) vẫn qua
`esc()` như bình thường. An toàn vì đây là preview NỘI BỘ chỉ admin đã đăng nhập nhìn thấy (RLS
chặn `anon` đọc dòng `published=false`), không phải nội dung public — không có route `/visa-<slug>`
thật để xem trước (T14 chưa làm) nên phải tự dựng bản xem trước tạm ngay trong dialog từ dữ liệu
đang gõ dở, kể cả chưa lưu.

**Slug tự sinh, khoá không cho sửa tay:** `nqgSlugify()` copy đúng quy tắc bỏ dấu đã dùng ở
`vnNorm()`/migration 13 (xử lý riêng "đ" trước khi NFD strip, vì "đ" không tách được bằng NFD) +
tiền tố `visa-`. Đã tự kiểm cả 7 nước cho ra đúng slug khớp ví dụ trong kế hoạch (`visa-nhat-ban`)
— riêng "Schengen (châu Âu)" ra `visa-schengen-chau-au` (không có trong kế hoạch làm ví dụ, nhưng
là kết quả suy ra hợp lý từ đúng quy tắc, không bịa).

**Đã test trước khi deploy:** `node --check` (`worker.js` + JS trích từ `admin.html`); HTML cân
bằng thẻ (`python3 html.parser`); unit test `nqgSlugify()` cho cả 7 nước bằng Node thuần. Test đầy
đủ luồng CRUD qua Claude Browser (mock `api()` mô phỏng bảng trong bộ nhớ, gọi trực tiếp các hàm —
đăng nhập thật cần mật khẩu Supabase không có): thêm mới (chọn nước → slug tự điền → nhập đủ field
→ thêm 1 khối H2 + 1 FAQ → Lưu) → danh sách hiện đúng dòng; mở "Chi tiết" đọc lại đúng 100% (kể cả
nội dung khối H2/FAQ) + select Quốc gia bị khoá đúng; mở "+ Thêm" lần 2 → đúng nước đã dùng bị loại
khỏi danh sách chọn; xoá 1 khối H2 giữa danh sách 3 khối → còn đúng 2 khối, đánh số lại đúng, khối
trống bị `collectNqgKhoiNoiDung()` tự lọc bỏ; đóng dialog KHÔNG sửa gì → không hỏi xác nhận; sửa 1
field rồi đóng → đúng hỏi xác nhận (mục 23); xoá dòng → đúng gọi `showConfirmPopup` rồi xoá; chụp
màn hình xác nhận layout dialog khớp đúng design system `dlg-*` (section xanh nhạt, badge đỏ "Bắt
buộc", card khối H2/FAQ, khối xem trước).

**Đã deploy + xác nhận trên production (commit `02822e1`):** `/admin` vẫn 200, chứa đúng cấu trúc
`nqgOverlay` mới; hồi quy `/`, `/blog`, `/sitemap.xml` vẫn 200 và **sitemap.xml chưa có URL
`/visa-<slug>` nào** (đúng như dự kiến — bảng thật trên Supabase production chưa tồn tại, sẽ tự
xuất hiện ngay khi PM chạy migration + có nước `published=true`, không cần deploy lại code).

**Cập nhật 2026-09-02, cùng ngày:** PM xác nhận đã chạy `14_supabase_setup_phase14.sql` xong và tự
nhập thử 1 record "Visa Nhật Bản" qua admin để test — **PM xác nhận đây CHỈ là dữ liệu test** (xem
mục "còn tồn đọng" của mục 58 lúc đó), không phải nội dung chuyên môn thật, nên **T14 (route SSR
`/visa-<slug>`) vẫn đứng yên, tiếp tục chờ nội dung chuyên môn thật từ chuyên viên** — Claude Code
tuyệt đối không tự viết điều kiện/hồ sơ/quy định lãnh sự thay chuyên viên. Đã hỏi lại người dùng
trước khi kết luận (tránh đoán nhầm rồi lỡ xây route trên dữ liệu test), sau đó chuyển sang làm T16
(xem mục 59) — task tiếp theo "đã mở chặn, làm được ngay" theo đúng thứ tự kế hoạch.

## 59. T16 — Công cụ ước tính chi phí Visa (2026-09-02)

**Trang tĩnh mới** `02_Source/public/cong-cu/uoc-tinh-chi-phi-visa.html`, URL
`https://topvisa5s.com/cong-cu/uoc-tinh-chi-phi-visa` (không đuôi `.html`, đúng theo hành vi
Cloudflare Static Assets đã xác nhận ở T11/mục 57 — request `.html` tự 307-redirect sang bản gọn).
**Trang này nằm SÂU HƠN 1 cấp** so với `index.html` (`public/cong-cu/...` thay vì `public/...`) —
**khác với 3 trang T11** (đứng cùng cấp `index.html` nên không cần sửa gì) — nên khi trích
navbar/footer từ `index.html` phải tự sửa đường dẫn tương đối `assets/...`/`href="#..."` thành
tuyệt đối `/assets/...`/`href="/#..."`, đúng kỹ thuật `fixPaths()` mà `worker.js` (`getSiteChrome()`)
đã dùng cho `/blog`/404 — nếu quên bước này thì logo/anchor menu sẽ trỏ sai
(`public/cong-cu/assets/...` không tồn tại).

**Tính năng:** khách chọn Quốc gia (8 lựa chọn, khớp `dich_vu_gia`) + Mục đích (Du lịch/Công tác/
Thăm thân/Khác — danh sách cố định đơn giản, KHÔNG đọc bảng `danh_muc_muc_dich` vì bảng đó chỉ mở
RLS cho `authenticated`, `anon` không đọc được) + Số người → hiện ngay **Tổng tạm tính = giá
(`dich_vu_gia`, cùng cách fetch `index.html` đang dùng ở mục "GIÁ DỊCH VỤ") × số người**, kèm dòng
"Đã gồm phí lãnh sự và phí dịch vụ, không phát sinh thêm". Nước `gia=null` ("Khác") → mời để lại
SĐT thay vì hiện số 0/sai.

**Form lead RIÊNG (không dùng chung form trang chủ):** bắt buộc vì nghiệm thu T16 yêu cầu
`nguon='cong-cu-uoc-tinh'` — form trang chủ mặc định `nguon='Từ Web'`, không thể tái dùng qua link
`/#dang-ky` như đã làm cho CTA của `lien-he.html` (T11). `note` tự tổng hợp ngữ cảnh (nước/mục
đích/số người/tổng tạm tính) để chuyên viên gọi lại có đủ thông tin ngay, không phải hỏi lại từ đầu.

**≥400 từ nội dung giải thích** (đo được 448 từ) — chỉ giải thích CHUNG về cấu trúc giá (phí lãnh
sự + phí dịch vụ là gì, vì sao khác nhau giữa các nước) và nhắc lại đúng nguyên văn cam kết "Đậu
Visa Mới Thu Phí Dịch Vụ" đã có sẵn trên trang chủ — **không bịa thêm bất kỳ quy định lãnh sự cụ thể
nào** (vd không nói "nước X cần phỏng vấn trong Y ngày", chỉ nói chung chung "một số trường hợp cần
phỏng vấn/lấy dấu vân tay" đúng như đã mô tả sẵn ở FAQ/mục Quy trình trên trang chủ).

**GA4 `tool_start`/`tool_complete`/`tool_lead` (yêu cầu T16) — T8 (gắn GA4) CHƯA làm** ở thời điểm
này (còn chờ PM cấp Measurement ID) → bọc qua `trackToolEvent()` tự kiểm `typeof gtag==='function'`
trước khi gọi, không ném lỗi khi chưa có `gtag`. **Khi T8 xong, 3 sự kiện này tự động bắt đầu gửi
ngay, không cần quay lại sửa file này** — cùng triết lý "tự động, không cần nhớ sửa lại" đã áp dụng
nhiều lần trong đợt SEO này (T5/T21/T11).

**`worker.js` (liên quan T5):** đổi tên `TRUSTED_STATIC_PAGES` → `EXTRA_STATIC_PAGES` (không còn
riêng cho 3 trang T11 nữa) và thêm path công cụ này vào mảng — sitemap tự nhận diện qua đúng cơ chế
dò-tồn-tại đã có sẵn từ T5, không cần sửa logic gì thêm. Mảng này sẽ còn dài thêm khi làm T15/T17
(2 công cụ còn lại, cùng nhóm `/cong-cu/...`).

**Đã test trước khi deploy:** `node --check`, HTML cân bằng thẻ, đếm từ phần nội dung (448 ≥ 400).
Qua Claude Browser: mở file cục bộ, xác nhận `fetch` giá THẬT từ Supabase production thành công
(8 nước đúng giá đang niêm yết) — tính `3.300.000 × 2 = 6.600.000đ` đúng; nước "Khác" hiện đúng
thông báo mời để lại SĐT; validate tên/SĐT đúng chặn khi sai; mock `fetch` cho riêng endpoint
`leads` để xác nhận payload gửi đi đúng `nguon:'cong-cu-uoc-tinh'` + `note` tổng hợp đúng ngữ cảnh
mà **không tạo dữ liệu test thật trên production** (khác cách vài lần trước có tạo rồi nhờ PM xóa —
lần này không cần vì đã mock được toàn bộ, không phải gọi API thật); mock `gtag` xác nhận cả 2 sự
kiện `tool_start`/`tool_complete` gọi đúng tham số khi `gtag` có sẵn.

**Đã deploy + xác nhận trên production (commit `42b9e40`):** `/cong-cu/uoc-tinh-chi-phi-visa` → 200,
`.html` → 307 redirect đúng; canonical/title/H1 đúng; **sitemap.xml tự động thêm đúng URL này ngay
sau deploy**, không cần sửa gì thêm ngoài việc thêm 1 dòng path (đúng thiết kế mục 56/57). Test
tương tác THẬT trên production bằng `form_input` (không chỉ gọi hàm JS): chọn "Đài Loan" → hiện
đúng "3.000.000đ" (khớp giá thật đang niêm yết). Hồi quy: `/`, `/blog`, `/chinh-sach-bao-mat`,
`/admin` vẫn 200.

T16 coi như hoàn tất và đã xác nhận sống đúng trên production.

## 60. Phiên PM test trực tiếp trên production — 7 lỗi/thiếu sót phát hiện + sửa, NGOÀI kế hoạch SEO
    (2026-09-02, cùng ngày mục 53-59)

**Bối cảnh:** sau khi xong T3/T4/T5/T9/T11/T13/T16, PM tự bấm thử trên `topvisa5s.com` thật (không
qua kế hoạch SEO nữa) và báo lại từng lỗi UI/UX gặp phải — phiên này xử lý TỪNG lỗi PM báo, theo
đúng thứ tự PM đưa ra, deploy ngay sau mỗi lỗi (không gộp lại chờ xong hết mới deploy 1 lần).

**A. Card bài viết trang chủ bị gạch chân (tiêu đề/nhãn "TIN TỨC"):** hệ quả phụ của T4 (SSR bài
viết, mục 54) — đổi `.card-post` từ `<div>` sang `<a href="/blog/...">` để Google index được,
nhưng chưa tắt gạch chân mặc định của thẻ `<a>` (theo CSS spec, gạch chân lan xuống MỌI phần tử con
trừ khi chặn lại). Sửa 1 dòng: `.card-post{...text-decoration:none;color:inherit}` — nút "Đọc tiếp
→" (`.post-readmore`) vẫn giữ gạch chân vì đã tự khai riêng, không bị ảnh hưởng.

**B. 3 trang pháp lý (`chinh-sach-bao-mat.html`/`dieu-khoan-dich-vu.html`/`lien-he.html`, T11) —
navbar "cũ", thiếu menu Danh mục bài viết động:** nguyên nhân — lúc dựng T11 (mục 57), script build
3 trang này COPY nguyên `<style>`+`<nav>`+`<footer>` từ `index.html` tại 1 THỜI ĐIỂM, nhưng KHÔNG
copy đồng thời đoạn JS "DANH MỤC BÀI VIẾT ĐỘNG" (mục 31.F) nên 3 trang này thiếu hẳn 2 menu
"📰 Thủ tục Visa"/"📰 Tin tức" đang có trên trang chủ. Đã sửa 2 việc:
1. Đổi mọi `href="#dich-vu"`/`#loi-ich`/`#danh-gia`/`#faq`/`#dang-ky`/`#banner` (navbar + footer)
   thành `/#...` — vì đây là trang KHÁC trang chủ, anchor không có `/` ở đầu thì không bấm được gì
   (giữ nguyên `href="#noi-dung"` — skip-link, đúng vì trỏ tới `<main>` của CHÍNH trang đó).
2. Copy nguyên script "DANH MỤC BÀI VIẾT ĐỘNG" nhưng CHỈ phần dựng MENU (không dựng section, vì 3
   trang này không có section tương ứng) — link menu trỏ về `/#cat-<slug>` (trang chủ) thay vì
   `#cat-<slug>` (chính trang đó).

**⚠️ Rủi ro "2 bản sao dễ lệch nhau" LẶP LẠI đúng kiểu đã cảnh báo nhiều lần (mục 45/46/52/56)** —
nhưng lần này ở lớp HTML/JS tĩnh chứ không phải dữ liệu/route động. 3 trang T11 là bản snapshot
TĨNH dựng 1 lần, không tự động nhận thay đổi sau này của `index.html` như `/blog`/404 (T4/T21, dùng
`getSiteChrome()` trích trực tiếp lúc request) — **bất kỳ thay đổi navbar/footer/widget nổi nào
sau này ở `index.html` đều PHẢI tự tay đồng bộ lại cả 3 trang này**, không có cơ chế tự động.

**C. 3 trang pháp lý thiếu hẳn cụm liên hệ nổi (💬) + Chat Box (🤖):** cùng nguyên nhân gốc mục B —
lúc dựng T11, `<style>` được copy NGUYÊN VẸN (nên CSS `.float-contact`/`.chatbox-*` vẫn có sẵn) NHƯNG
phần HTML (`<div id="floatContact">`, `<button id="chatboxToggle">`, `<div id="chatboxPanel">`) và
JS (toàn bộ logic Chat Box, mục 47) chưa từng được thêm — khiến CSS "chờ sẵn" nhưng không có gì để
áp dụng. Đã thêm đủ HTML + JS (copy nguyên từ `index.html`, không viết lại), với 1 khác biệt bắt
buộc: `chatboxPriceListText()` (nút hỏi nhanh "Bảng giá dịch vụ các nước") đọc DOM `.card-service`
— 3 trang này không có bảng giá — nên hàm được sửa thêm nhánh dự phòng (`!lines.length`) trỏ khách
về `/#dich-vu` thay vì trả lời rỗng, áp dụng ĐỒNG THỜI cho cả `index.html` (dùng chung 1 bản hàm).

**D. Icon Chat Box (🤖) bị nút "Facebook" (cụm liên hệ nổi xoè ra) đè lên:** 2 lượt sửa — lượt 1
(PM chưa ưng) ẩn hẳn icon Chat Box khi cụm liên hệ đang xoè (`opacity:0`); lượt 2 (PM yêu cầu) đổi
sang **đẩy icon Chat Box lên đứng NGAY TRÊN "Gọi điện"** thay vì biến mất — đo `offsetHeight` THẬT
của `.float-contact` (không hardcode số, vì `.float-item` ẩn bằng `opacity` chứ không `display:none`
nên chiều cao container LUÔN cố định dù đang xoè hay thu) rồi gán inline `style.bottom` cho
`#chatboxToggle`; bỏ style (`=''`) để về đúng vị trí mặc định CSS khi thu gọn lại. Hàm dùng chung
`pushChatboxAboveFloat(push)` — gọi cả khi bấm nút liên hệ nổi LẪN khi mở Chat Box lúc cụm liên hệ
đang xoè (`chatboxToggleOpen()` tự đóng cụm liên hệ + trả lại vị trí icon).

**E. Thêm link "Liên hệ" — cả footer lẫn menu chính:** trước đó cột "Liên hệ" trong footer-grid chỉ
có địa chỉ/SĐT/email TĨNH, không link tới trang `/lien-he` (chỉ dòng copyright nhỏ cuối footer mới
có) — bọc `<h4>Liên hệ</h4>` thành `<h4><a href="/lien-he">Liên hệ</a></h4>` (màu chữ tự động nhạt
hơn heading khác — `footer a{color:#CBD5E1}` thắng `footer h4{color:#fff}` do đứng sau trong CSS,
là tín hiệu thị giác cho biết đây là link, không cần CSS mới). PM yêu cầu thêm tiếp 1 mục **trong
menu chính** — thêm `<li><a href="/lien-he">📍 Liên hệ</a></li>` ngay sau FAQ, trước "Đăng ký tư
vấn". Cả 2 áp dụng đồng bộ 4 trang; `/blog`+404 tự nhận qua `getSiteChrome()`, không cần sửa thêm.

**F. Thêm mục "Liên hệ" vào menu làm menu VỠ DÒNG ở khổ máy tính/laptop không full màn hình (~800–
1150px)** — đây là lỗi NGHIÊM TRỌNG nhất trong 7 lỗi (ảnh hưởng toàn bộ khách xem trên desktop hẹp,
không chỉ 1 trang). Nguyên nhân: menu 8 mục + nút CTA gần như vừa khít bề rộng container tối đa
(1200px, dư ~48px) NGAY TỪ TRƯỚC khi thêm "Liên hệ" — thêm 1 mục nữa (~78px) vượt hẳn khoảng dư,
và ngưỡng chuyển sang hamburger cũ (`max-width:767px`) quá hẹp, để lại 1 "vùng kẹt" rộng (768–
~1150px) nơi menu ngang không đủ chỗ nhưng chưa tới ngưỡng hamburger — flex item bị nén dưới bề
rộng chữ tự nhiên (không có `white-space:nowrap`) nên TỪNG chữ trong 1 mục tự xuống dòng giữa chừng
("Dịch" / "vụ"). Đã sửa 3 lớp cộng dồn (không lớp nào đơn lẻ đủ an toàn):
1. Tách `.hamburger`/`.nav-links{display:none...}` ra **khối `@media` RIÊNG cho navbar**
   (`max-width:1099px`) — KHÔNG gộp vào `@media(max-width:767px)` chung (khối đó vẫn giữ nguyên
   767px cho hero/grid/footer... — chỉ đổi ngưỡng của riêng navbar, tránh kéo theo đổi layout khác
   ở khổ 768–1099px ngoài ý muốn).
2. Giảm `gap` menu 32px→16px (`var(--sp-4)`→`var(--sp-2)`), cỡ chữ menu 15px→14px, logo 22px→20px
   — tăng khoảng dư khi hiển thị ngang (ở khổ ≥1100px).
3. Thêm `white-space:nowrap` cho `.logo`/`.nav-links a` — phòng hờ, đảm bảo dù có bị nén cũng không
   BAO GIỜ vỡ chữ giữa chừng (item sẽ chỉ tràn/ẩn bớt chứ không tách dòng, dù với lớp 1+2 thực tế
   không còn xảy ra kịch bản này ở khổ ≥1100px nữa).
Áp dụng đồng bộ 4 trang. **Đã xác nhận qua ảnh chụp thật trên production** (khổ desktop mặc định
của Claude Browser, tương đương ~1280px) — cả 8 mục + CTA nằm gọn 1 dòng, không vỡ chữ.

**G. Bấm "Đăng ký tư vấn miễn phí" ở `/lien-he` (trỏ `/#dang-ky`) cuộn SAI vị trí — lỗi khó nhất
phiên này, sửa qua 4 lượt mới ra đúng gốc:**
- **Lượt 1 (chưa đủ):** đoán do `.navbar` (`position:sticky`, cao 68px) che mất phần đầu section
  đích khi cuộn tới anchor — thêm `section[id],header[id],main[id]{scroll-margin-top:84px}` (áp
  dụng chung mọi anchor, kể cả section "Danh mục bài viết" chèn động — không cần liệt kê từng id).
  Tự đo lại bằng `curl`/production thật mới phát hiện đây KHÔNG PHẢI nguyên nhân chính: cuộn không
  chỉ lệch vài chục px mà TRƯỢT HẲN TỚI TẬN ĐÁY TRANG (`scrollY` = giá trị tối đa có thể).
- **Lượt 2 (chưa đủ):** phát hiện nguyên nhân thật — trang chủ có 2 khối chèn ĐỘNG sau tải (Danh
  mục bài viết mục B ở trên, Feedback khách hàng mục 48) làm chiều cao trang tăng dần NGAY TRONG
  LÚC trình duyệt đang tự cuộn mượt (`html{scroll-behavior:smooth}`) tới `#hash` lúc tải trang — cú
  cuộn "đuổi theo" 1 đích đang dịch chuyển nên trượt quá đà. Thử tắt tạm `scroll-behavior` thành
  `auto` (tức thì) ngay đầu `<head>` — VẪN KHÔNG ĐỦ, cú cuộn tự động của trình duyệt vẫn "thắng" cú
  sửa lại của JS chạy sau (2 nguồn cuộn cùng tồn tại, dù đổi animation vẫn còn tranh chấp).
- **Lượt 3 (đủ về mặt loại trừ nguồn cuộn, còn 1 lỗ hổng nhỏ):** loại HẲN 1 nguồn thay vì chỉ đổi
  animation — script đầu `<head>` tự **xoá `#hash` khỏi URL ngay lúc đầu**
  (`history.replaceState(null,'',location.pathname+location.search)`, giữ giá trị gốc ở
  `window.__initialHash__`) — trình duyệt không còn gì để tự cuộn tới nữa. Hàm `fixInitialHashScroll()`
  (gọi trong `finally` của CẢ 2 khối chèn động ở trên, dù thành công/lỗi/rỗng đều gọi) giờ là nguồn
  cuộn DUY NHẤT, dùng `window.__initialHash__` để tìm đích.
- **Lượt 4 (đúng, đang chạy):** `fixInitialHashScroll()` vẫn gọi `scrollIntoView()` KHÔNG chỉ định
  `behavior` → mặc định hưởng `scroll-behavior:smooth` của CSS — vì hàm này bị gọi 2 LẦN (1 lần/khối
  chèn động, thời điểm tải xong khác nhau), 2 cú cuộn mượt gọi gần nhau có thể vẫn chồng lấn/đuổi
  theo nhau y hệt lỗi gốc. Sửa bằng cách ép `behavior:'instant'` — đúng NGUYÊN TẮC đã áp dụng sẵn ở
  `initScrollLock()` (mục 46.B, khôi phục vị trí cuộn khi đóng popup bài viết) cho CÙNG LÝ DO: "BẮT
  BUỘC dùng `instant`, không phải `smooth`" khi có khả năng gọi cuộn nhiều lần liên tiếp trong thời
  gian ngắn — bài học cũ trong chính file này lẽ ra nên áp dụng ngay từ lượt 1.

**Đã xác nhận đúng bằng số đo chính xác trên production (không chỉ code):** `getBoundingClientRect()`
qua đúng luồng bấm nút thật từ `/lien-he` (không phải gọi hàm JS giả lập) → `scrollY≈7298`,
`sectionTop≈84px` (khớp CHÍNH XÁC giá trị `scroll-margin-top:84px` đã đặt ở lượt 1), `covered:false`
— ổn định, không trôi tiếp sau khi chờ thêm. **Lưu ý quan trọng về công cụ test dùng trong phiên
này:** `Element.scrollIntoView()` gọi qua `javascript_tool` (tiêm từ ngoài) cho kết quả CỰC KỲ THẤT
THƯỜNG trong môi trường Claude Browser (lúc thì đúng, lúc không nhúc nhích, lúc lại nhảy sai) — đã
tự kiểm chứng bằng cách so sánh với 1 trang HOÀN TOÀN không liên quan (Wikipedia, cuộn tới `#History`)
để tách bạch "lỗi do trang web" hay "lỗi do công cụ test": Wikipedia cuộn đúng ngay từ đầu, chứng
minh công cụ VẪN xử lý được `#hash` bình thường trong trường hợp đơn giản — nên các kết quả sai/thất
thường gặp phải khi test riêng site này là **tín hiệu thật** (khiến lượt 2/3/4 ở trên là sửa lỗi
thật, không phải chạy theo ảo giác của công cụ), nhưng độ ồn của kết quả đo qua công cụ RẤT CAO —
**nếu sau này cần debug lại hành vi cuộn bằng Claude Browser, LUÔN thử lại ở tab HOÀN TOÀN MỚI (đóng
tab cũ, tạo tab mới) trước khi kết luận, và ưu tiên bấm nút bằng toạ độ pixel thật (`computer` tool)
hơn là gọi hàm JS trực tiếp qua `javascript_tool`** — cách đầu phản ánh đúng hành vi người dùng thật
hơn, cách sau có tỷ lệ "không có tác dụng gì" (no-op) cao bất thường trong môi trường này.

**Đã test trước mỗi lần deploy:** `node --check` + `python3 html.parser` cho cả 4 file mỗi lượt sửa.
**Đã deploy từng lỗi riêng biệt, xác nhận trên production ngay sau mỗi lần** (7 commit liên tiếp
cùng ngày, không gộp chung 1 lần deploy) — khớp đúng yêu cầu PM muốn thấy kết quả ngay sau mỗi lần
báo lỗi. Hồi quy đầy đủ sau lượt cuối: `/`, `/lien-he`, `/blog` vẫn 200; `/worker.js` vẫn 404 (an
ninh Phương án A không đổi).

**⚠️ Việc CẦN nhớ nếu sau này còn sửa navbar/footer/widget nổi ở `index.html`:** PHẢI tự tay đồng bộ
lại cả 3 trang T11 (`chinh-sach-bao-mat.html`/`dieu-khoan-dich-vu.html`/`lien-he.html`) — không có
cơ chế tự động như `/blog`/404. Nếu việc này lặp lại nhiều lần nữa trong tương lai, cân nhắc đề xuất
PM chuyển hẳn 3 trang này sang SSR qua `worker.js` (dùng `getSiteChrome()` như `/blog`/404) thay vì
tiếp tục giữ dạng file tĩnh — đánh đổi: mất tính đơn giản "1 file HTML" nhưng đổi lấy đồng bộ tự
động vĩnh viễn, không phải việc nhỏ nên CHỈ làm nếu PM đồng ý, không tự ý đổi kiến trúc.
