# CLAUDE.md — Context dự án cho Claude Code

> File này dành cho AI agent (Claude Code). Đọc file này trước khi sửa bất kỳ gì trong dự án. Người dùng (chủ dự án) không biết lập trình — luôn giải thích thay đổi bằng ngôn ngữ dễ hiểu, không thuật ngữ khi báo cáo lại.

## 1. Dự án là gì

Landing page dịch vụ **Visa đa quốc gia** cho công ty **Top Visa** (Đà Nẵng), mục tiêu **Lead Generation** (thu thập khách hàng tiềm năng qua form đăng ký tư vấn). Có kèm trang quản trị đơn giản để xem/xuất lead và quản lý bài viết.

Toàn bộ tài liệu thiết kế (yêu cầu, sitemap, wireframe, design system, kế hoạch, test case, hướng dẫn deploy) nằm ở `01_Docs/` — đọc `01_Docs/Visa-Landing-Page_Tai_lieu.xlsx` (1 file Excel gộp cả 7 tài liệu, có màu sắc dễ đọc) hoặc từng file `.md` tương ứng nếu cần xem sơ đồ Mermaid/wireframe ASCII chi tiết.

## 2. Trạng thái hiện tại (2026-07-30)

| Phase | Trạng thái |
|---|---|
| 1. Phân tích yêu cầu | ✅ Xong |
| 2. Thiết kế (sitemap/wireframe/design system) | ✅ Xong |
| 3. Front-end (`index.html`) | ✅ Xong, đã gắn thông tin thật (logo, hotline, Zalo, Facebook, địa chỉ) + USP + slider đánh giá thật + section Tin tức |
| 4. Back-end (Supabase) | ✅ **Đã chạy thật** — `SUPABASE_URL`/`SUPABASE_ANON_KEY` đã điền giá trị thật trong cả 2 file HTML |
| 5. Kiểm thử | 🟡 Một phần — đã test thủ công, **chưa chạy đủ** 14 test case ở `01_Docs/05_Ke_hoach_du_an.md` |
| 6. Deploy | ✅ **Đã lên Internet** — qua Cloudflare Workers (không phải Cloudflare Pages), tại `https://topvisa.nguyennc1357.workers.dev` |

Chi tiết đầy đủ + lịch sử quyết định kỹ thuật của lần deploy này: `01_Docs/08_Ban_giao_Claude_Code.md` ⭐ (đọc trước khi động vào deploy/Supabase). Checklist test case: `01_Docs/05_Ke_hoach_du_an.md` hoặc sheet `05_Kế hoạch` trong file Excel.

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
│   ├── admin.html                  ← trang quản trị (HTML+CSS+JS trong 1 file)
│   ├── supabase_setup.sql          ← script tạo bảng leads/posts/categories + RLS
│   └── assets/                     ← logo.png, favicon.png, qr-zalo.png (đã xử lý, không sửa lại)
└── 03_Information/                 ← DỮ LIỆU THẬT của công ty — nguồn duy nhất đáng tin
    ├── Information.md               ← tên công ty, SĐT, địa chỉ, email, link Facebook
    ├── logo.jpg                     ← logo gốc (chưa xử lý — bản đã xử lý ở 02_Source/assets/logo.png)
    └── QR_Zalo.jpg                  ← QR gốc (bản đã xử lý ở 02_Source/assets/qr-zalo.png)
```

**Quy tắc quan trọng:** khi cần thông tin công ty (tên, SĐT, địa chỉ, email, Facebook...), luôn lấy từ `03_Information/Information.md` — đây là nguồn dữ liệu thật duy nhất, không bịa hay dùng lại giá trị cũ trong code nếu hai bên lệch nhau. Nếu `Information.md` được cập nhật, phải đồng bộ lại các hằng số cấu hình trong `index.html`/`admin.html` (xem mục 5) và cả footer/title/meta liên quan.

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

## 7. Database schema (Supabase)

Định nghĩa đầy đủ trong `02_Source/supabase_setup.sql` (idempotent — chạy lại không lỗi). Tóm tắt:

- `leads(id, created_at, name, phone, country, note, status)` — status: Mới / Đã gọi / Chốt / Hủy. RLS: `anon` chỉ INSERT, `authenticated` (admin) full quyền.
- `posts(id, created_at, title, category_id, image_url, content, published)` — RLS: `anon` chỉ SELECT khi `published=true`, admin full quyền.
- `categories(id, name)` — RLS: `anon` SELECT, admin full quyền.

Nếu cần đổi schema: sửa `supabase_setup.sql` VÀ cập nhật code gọi API tương ứng trong `index.html` (form submit, bảng `leads`) hoặc `admin.html` (mọi thao tác CRUD) — 2 nơi phải khớp nhau tuyệt đối vì không có ORM/type-checking.

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
| Footer | Số GPKD | ⬜ Vẫn thiếu, chưa có trong `Information.md`, hỏi người dùng khi cần |
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

## 11. Khi hoàn thành một thay đổi

Cập nhật ngắn gọn checklist liên quan trong `README.md` (mục "Việc cần làm trước khi công khai") và, nếu ảnh hưởng tài liệu thiết kế, cập nhật luôn `.md` tương ứng trong `01_Docs/` + note lại trong file Excel (không bắt buộc format lại toàn bộ Excel mỗi lần, chỉ sửa nội dung liên quan).
