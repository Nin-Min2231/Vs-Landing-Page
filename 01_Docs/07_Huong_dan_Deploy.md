# 07. Hướng dẫn Release & Deploy (cho người không biết code)

Đọc tuần tự từ trên xuống. Tổng thời gian lần đầu: ~1–2 giờ. Các lần cập nhật sau: ~5 phút.

---

## Bước 0. Chuẩn bị tài khoản (miễn phí, chỉ cần email)

| Tài khoản | Đăng ký tại | Dùng để |
|---|---|---|
| GitHub | github.com | Nơi lưu trữ file website (như Google Drive cho code) |
| Cloudflare | dash.cloudflare.com | Đưa website lên Internet (hosting) |
| Supabase | supabase.com | Lưu dữ liệu khách đăng ký + đăng nhập admin |

Nên đăng ký cả 3 bằng CÙNG MỘT email công việc, lưu mật khẩu cẩn thận.

---

## Bước 1. Tạo backend Supabase (làm 1 lần duy nhất)

1. Vào **supabase.com** → Sign up → **New Project**.
2. Đặt tên project: `visa-landing`. Chọn region: **Southeast Asia (Singapore)** (gần VN nhất). Đặt Database Password mạnh → **lưu lại mật khẩu này**.
3. Chờ ~2 phút để project khởi tạo.
4. Menu trái → **SQL Editor** → **New query** → mở file `05_Database/01_supabase_setup.sql` bằng Notepad, copy TOÀN BỘ nội dung, dán vào → bấm **Run**. Thấy "Success" là xong (đã tạo bảng leads, posts, categories + luật bảo mật). ⚠️ (2026-08) Dự án đã phát triển thêm nhiều tính năng quản trị (Admin CRM) sau bước này — nếu đang cài mới hoàn toàn, chạy tiếp lần lượt các file `05_Database/02_...sql` → `05_Database/03_...sql` → `05_Database/04_...sql` (đọc `05_Database/README.md` để biết thứ tự và mỗi file thêm gì).
5. Tạo tài khoản admin: menu trái → **Authentication** → **Users** → **Add user** → **Create new user** → nhập email + mật khẩu của bạn → Create. (Đây là tài khoản đăng nhập trang admin.)
6. Lấy 2 thông số kết nối: menu trái → **Project Settings** → **API Keys**:
   - Dashboard bản mới sẽ mở sẵn tab **"Publishable and secret API keys"** — lấy **Publishable key** (chuỗi bắt đầu bằng `sb_publishable_...`). Đây là bản thay thế mới của "anon public key" cũ, **an toàn để đặt công khai** trên web.
     - Nếu project đã tạo từ lâu, dashboard có thể hiện tab **"Legacy anon, service_role API keys"** thay vào đó — khi đó lấy key nhãn **anon public** (chuỗi dài bắt đầu bằng `eyJ...`), công dụng tương đương.
   - **Project URL** (dạng `https://xxxx.supabase.co`) — xem tại menu trái → **Integrations** → **Data API** (mục "Project URL"/"REST API URL"). Ghi chú: `xxxx` chính là **Project ID** hiển thị ở trang **Project Settings → General**.
7. Mở `index.html` và `admin.html` bằng Notepad → tìm dòng đầu file có chữ `SUPABASE_URL` và `SUPABASE_ANON_KEY` → dán 2 giá trị vừa lấy vào giữa 2 dấu nháy → Save.

> ⚠️ Quan trọng: Chỉ dùng **Publishable key** (hoặc **anon public key** nếu dùng tab Legacy). KHÔNG BAO GIỜ đặt **Secret key** (`sb_secret_...`) hay **service_role key** vào file HTML — đây là "chìa khóa admin" toàn quyền, lộ ra là mất an toàn dữ liệu.

## Bước 2. Test toàn bộ hệ thống — dùng thẳng Supabase Cloud, KHÔNG cần Docker/local

**Quyết định kỹ thuật:** dự án này test trực tiếp trên project Supabase Cloud (gói Free) đã tạo ở Bước 1, **không dựng Supabase chạy local bằng Docker**. Lý do: Docker + Supabase CLI đòi hỏi cài đặt và thao tác dòng lệnh phức tạp không cần thiết cho quy mô dự án này; trong khi test thẳng trên bản Cloud vừa đơn giản (không cài gì thêm), vừa chính xác 100% vì đó chính là database sẽ dùng khi go-live — không có rủi ro "chạy đúng ở local nhưng lỗi khi lên thật".

> Nếu sau này dự án lớn hơn nhiều và cần môi trường tách biệt hẳn để thử nghiệm mạnh tay (xóa/sửa hàng loạt mà không sợ ảnh hưởng dữ liệu thật), có thể cân nhắc Supabase CLI + Docker — nhưng ở quy mô hiện tại là không cần thiết.

Website là trang tĩnh → KHÔNG cần "build". Test theo trình tự:

1. Nháy đúp `index.html` → trang mở trong trình duyệt.
2. Điền thử form → thấy thông báo thành công.
3. Vào Supabase → **Table Editor** → bảng `leads` → thấy dòng dữ liệu vừa gửi ✓.
4. Mở `admin.html` → đăng nhập bằng tài khoản tạo ở Bước 1.5 → thấy lead ✓.
5. Chạy đủ test case High trong `05_Ke_hoach_du_an.md` (TC-001 → TC-014).

### (Tuỳ chọn) Dùng phần mềm desktop để xem/sửa database — nếu quen SQL Server Management Studio (SSMS)

⚠️ **SSMS không kết nối được vào Supabase** — SSMS chỉ làm việc với Microsoft SQL Server, còn Supabase chạy trên **PostgreSQL** (khác engine, khác cú pháp). Muốn thao tác database bằng phần mềm desktop (thay vì Table Editor trên web), dùng 1 trong các công cụ hỗ trợ Postgres sau — không cần Docker, kết nối thẳng vào Supabase Cloud:

| Phần mềm | Ghi chú |
|---|---|
| **Azure Data Studio** | Của Microsoft, giao diện gần giống SSMS nhất — cài thêm extension "PostgreSQL" |
| **pgAdmin** | Công cụ chính thức cho Postgres, tương đương SSMS bên phía Postgres |
| **DBeaver** | Hỗ trợ cả SQL Server lẫn Postgres, giao diện cây bảng + query window quen thuộc |

**Cách kết nối:** Supabase Dashboard → **Project Settings** → **Database** → copy **Connection string** (host dạng `db.xxxx.supabase.co`, port `5432`) → dán các thông số Host/Port/User/Password/Database vào phần mềm đã chọn → bật tùy chọn **SSL/Require SSL** (Supabase bắt buộc kết nối mã hóa).

⚠️ Mật khẩu dùng để kết nối GUI là **Database Password** (đặt ở Bước 1.2) — đây là chìa khóa toàn quyền, KHÁC với `anon public key` dùng trong file HTML. Không chia sẻ hay để lộ mật khẩu này.

## Bước 3. Deploy lên Cloudflare Pages

**Cách đơn giản nhất — kéo thả (không cần GitHub):**

1. Vào **dash.cloudflare.com** → menu trái **Workers & Pages** → **Create** → tab **Pages** → **Upload assets**.
2. Đặt tên project: `visa-landing` → **Create project**.
3. Kéo thả cả 2 file `index.html`, `admin.html` (và thư mục ảnh nếu có) vào ô upload → **Deploy site**.
4. Sau ~30 giây, bạn nhận link dạng: `https://visa-landing.pages.dev` — website đã chạy trên Internet 🎉
5. Mở link trên điện thoại kiểm tra lại lần nữa.

**Cách nâng cao — qua GitHub (khuyên dùng khi đã quen):** đẩy file lên GitHub repo → Cloudflare Pages kết nối repo → mỗi lần file thay đổi tự deploy. Lợi ích: có lịch sử phiên bản, quay lui được khi lỗi.

Project này đã có sẵn trên GitHub tại `https://github.com/Nin-Min2231/Vs-Landing-Page`. Các bước nối với Cloudflare Pages:

1. **dash.cloudflare.com** → menu trái **Workers & Pages** → **Create** → tab **Pages** → **Connect to Git**.
2. **Connect GitHub** → chọn **"Only select repositories"** → tick repo `Vs-Landing-Page` → **Install & Authorize**.
3. Chọn repo `Vs-Landing-Page` → **Begin setup**.
4. Ở **Build settings**, điền:
   - **Framework preset:** `None`
   - **Build command:** để trống
   - **Build output directory:** để trống (hoặc `/`)
   - **Root directory (advanced):** `02_Source` ⚠️ **BẮT BUỘC** — vì code thật nằm trong thư mục con này, không phải gốc repo. Bỏ qua bước này sẽ bị lỗi 404 không tìm thấy `index.html`.
5. **Save and Deploy** → chờ 30–60 giây → nhận link `https://<tên-project>.pages.dev`.

Từ đó, mỗi lần đẩy code mới lên nhánh `main` trên GitHub, Cloudflare tự động deploy lại — không cần thao tác gì thêm. Xem lịch sử/quay lui tại tab **Deployments** của project.

## Bước 4. Mua domain & trỏ DNS (tùy chọn nhưng nên làm)

### Mua ở đâu

| Nhà cung cấp | Loại domain | Giá tham khảo/năm | Ghi chú |
|---|---|---|---|
| Cloudflare Registrar | .com | ~250.000đ | Rẻ nhất (giá gốc), quản lý cùng chỗ hosting — **khuyên dùng** |
| Namecheap | .com | ~300.000đ | Dễ dùng, thanh toán thẻ quốc tế |
| Mắt Bão / PA Việt Nam / iNET | .vn / .com.vn | ~450–750.000đ | Cần .vn thì mua tại nhà đăng ký VN, hỗ trợ tiếng Việt |

Gợi ý chọn tên: ngắn, dễ đọc qua điện thoại, có từ khóa: `visa[tên]`.com, `[tên]visa`.vn...

### Trỏ DNS (nối domain với website)

**Nếu mua tại Cloudflare:** Workers & Pages → project `visa-landing` → **Custom domains** → **Set up a custom domain** → nhập domain → Cloudflare tự cấu hình. Xong.

**Nếu mua nơi khác (Namecheap, Mắt Bão...):**
1. Trong Cloudflare Pages → Custom domains → nhập domain → Cloudflare hiện bản ghi cần tạo (thường là **CNAME** trỏ về `visa-landing.pages.dev`).
2. Vào trang quản trị nhà bán domain → mục **DNS** → thêm bản ghi CNAME đúng như Cloudflare yêu cầu.
3. Chờ 5 phút – 24 giờ để DNS lan truyền. HTTPS (ổ khóa 🔒) tự động có, không phải mua SSL.

## Bước 5. Cập nhật phiên bản mới

1. Sửa file trên máy (tự sửa text bằng Notepad, hoặc nhờ Claude sửa).
2. Mở file bằng trình duyệt kiểm tra trước.
3. Cloudflare → Workers & Pages → `visa-landing` → **Create new deployment** → kéo file mới vào → Deploy.
4. Mở website nhấn **Ctrl+F5** (xóa cache) xem bản mới.
5. Nếu bản mới lỗi: vào tab **Deployments** → chọn bản cũ → **Rollback** (quay lui 1 click).

## Bước 6. Kiểm tra lỗi thường gặp

| Triệu chứng | Nguyên nhân thường gặp | Cách xử lý |
|---|---|---|
| Form gửi báo lỗi | Chưa điền URL/anon key; hoặc Supabase bị pause | Kiểm tra Bước 1.7; vào supabase.com bấm **Restore** nếu project pause |
| Admin không đăng nhập được | Sai email/mật khẩu; chưa tạo user ở Bước 1.5 | Authentication → Users → tạo lại hoặc reset password |
| Trang trắng | File HTML bị sửa hỏng cú pháp | Rollback bản cũ; gửi file cho Claude kiểm tra |
| Domain không vào được | DNS chưa lan truyền | Chờ tối đa 24h; kiểm tra tại dnschecker.org |
| Chữ tiếng Việt lỗi trong CSV | Excel mở CSV sai encoding | File CSV đã có BOM UTF-8, mở bằng Excel bản mới sẽ đúng; nếu vẫn lỗi: Excel → Data → From Text/CSV → chọn UTF-8 |
| pgAdmin/Azure Data Studio báo lỗi kết nối SSL | Chưa bật SSL hoặc sai port | Bật "Require SSL"/"Trust server certificate"; dùng đúng port 5432 (direct) lấy từ Project Settings → Database |

## Bước 7. Backup dữ liệu (làm hàng tuần)

1. **Lead:** đăng nhập `admin.html` → bấm **Xuất CSV** → lưu file theo tên `leads_2026-07-10.csv` vào thư mục backup/Google Drive.
2. **Website:** giữ bản copy 2 file HTML trong folder dự án này (đã có sẵn) + Google Drive.
3. **Supabase:** Free plan không tự backup dài hạn → chính file CSV hàng tuần là backup của bạn. Khi lead nhiều/quan trọng, nâng gói Pro có backup tự động hàng ngày.
4. **Lịch vận hành hàng tuần (5 phút):** mở admin xem lead mới → xuất CSV → vào Supabase dashboard 1 lần (tránh bị pause).

---

## ⚠️ Rà soát

| # | Vấn đề | Loại | Impact | Đề xuất |
|---|---|---|---|---|
| 1 | Quên lịch vào Supabase hàng tuần → project pause → mất lead quảng cáo | Risk | Cao | Đặt lịch lặp trên điện thoại/Google Calendar; cân nhắc gói Pro khi chạy quảng cáo thật |
| 2 | admin.html công khai trên Internet (ai biết link đều mở được màn hình đăng nhập) | Risk | Trung bình | Chấp nhận được (có mật khẩu); tăng cường: đổi tên file thành chuỗi khó đoán, ví dụ `quan-tri-x7k9.html` |
| 3 | Domain .vn cần giấy tờ cá nhân/doanh nghiệp khi đăng ký | Gap | Thấp | Chuẩn bị CMND/CCCD hoặc GPKD khi mua .vn |
| 4 | Không có môi trường test tách biệt — test và dữ liệu thật dùng chung 1 database | Risk | Trung bình | Chấp nhận được ở quy mô này; xóa/sửa thử nghiệm cẩn thận trong Table Editor, tránh thao tác trên lead thật |
| 5 | Database Password (dùng cho pgAdmin/Azure Data Studio) bị lộ | Risk | Cao | Không chia sẻ mật khẩu này với ai; khác hoàn toàn với anon key (anon key được phép public) |
