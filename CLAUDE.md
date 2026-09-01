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
| Badge hero | "5000+ hồ sơ", "98% đậu" | ⬜ Vẫn thiếu — số liệu thật, bịa số ở đây có thể vi phạm chính sách quảng cáo |
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

**Đã xác nhận qua production thật (curl):** `05_Database/12_supabase_setup_phase12.sql` (phần gốc)
đã được PM chạy — bảng `danh_gia_khach_hang` tồn tại kèm 1 dòng thật ("Pon Tí Tởn"). **CHƯA xác
nhận:** PM chạy lại file để có 2 cột `thang`/`nam` mới nối thêm (đã tự kiểm tra qua `curl` gọi thẳng
`index.html` thấy `res.ok` trả về 400 do PostgREST chưa nhận diện được 2 cột này — đúng như dự kiến,
trang vẫn chạy bình thường nhờ fallback về 2 review tĩnh, không crash) — cần PM chạy lại SQL rồi tự
xác nhận, giống quy trình đã áp dụng cho Chat Box (mục 47).
