# Handover — Bàn giao sang phiên làm việc mới (2026-08-07, bản 4 — GHI ĐÈ toàn bộ bản cũ)

> File này **GHI ĐÈ HOÀN TOÀN** mọi bản handover cũ (bản 1→3 và mọi đoạn "Cập nhật mới nhất" nối
> thêm sau đó) — **không cần đọc lại bản cũ**, nội dung quan trọng còn giá trị đã gom hết vào đây.
> Đọc theo đúng thứ tự: `CLAUDE.md` (toàn bộ, đặc biệt mục 22–32 cho các thay đổi gần đây nhất) →
> file này → bắt tay vào **mục 1**. Viết để dùng được cho cả Claude Code lẫn Claude Cowork/agent
> khác, không giả định sẵn bối cảnh hội thoại trước đó.

## 0. Trạng thái ngay lúc viết file này

- Nhánh làm việc: `claude/dashboard-admin-multi-screen-f81258` — **đã fast-forward vào `main` và
  deploy thành công**, xác nhận qua `curl` lặp lại nhiều lần ổn định ở bản mới (commit `ca1851d`).
  `git status` sạch, không có gì chưa commit. `origin/main` và branch này đang trỏ **cùng 1 commit**.
- Trang chạy thật: `https://topvisa5s.com` (chính) + `https://topvisa.nguyennc1357.workers.dev`
  (cùng 1 bản deploy, Cloudflare Workers, tự build khi push lên `main`).
- **Migration `05_Database/07_supabase_setup_phase7.sql` đã được người dùng xác nhận trực tiếp là
  đã chạy** ("Anh đã chạy rồi nha", 2026-08-07) — Phase 7 (bảng `dich_vu_gia`, `posts.phan_loai`,
  `ho_so.doi_tac_id` bỏ NOT NULL) coi như đã áp dụng đầy đủ trên Supabase thật. File `01`→`06` được
  xác nhận đã chạy ở các phiên trước, không có báo lỗi gì trong session này dù đã đọc dữ liệu thật
  từ các bảng liên quan (`danh_muc_nuoc`, `posts`, `categories`...) qua Claude Browser.
- Toàn bộ việc trong session này đã **code xong + test qua Claude Browser** — phần lớn test đọc
  dữ liệu **THẬT** trực tiếp từ Supabase production (vì `SUPABASE_URL`/`ANON_KEY` cấu hình sẵn
  trong file là khóa thật), phần ghi/sửa/xóa vẫn phải mock `api()` vì không có tài khoản admin thật
  để đăng nhập (xem mục 3).

## 1. Việc CẦN LÀM NGAY

1. **Đọc lại kỹ nội dung "Đậu visa mới thu phí dịch vụ" mới trên trang chủ** — session này đã viết
   lại câu cam kết ở 5 vị trí (promo bar, 2 khối cam kết, FAQ + JSON-LD) để thêm điều kiện "hồ sơ
   đủ điều kiện" thay vì cam kết tuyệt đối 100% như trước (lý do: PM cho biết hồ sơ khách yếu đôi
   khi vẫn phát sinh phí xử lý dù trượt — câu cũ có thể gây hiểu nhầm/tranh chấp). Đây là nội dung
   marketing/pháp lý, **PM nên tự đọc lại và xác nhận đúng ý muốn truyền tải** trước khi chạy quảng
   cáo — xem toàn bộ câu chữ mới ở `CLAUDE.md` mục 32.D.
2. **Nếu công ty đã có Google Business Profile / trang mạng xã hội dưới tên "Top Visa" cũ** — cập
   nhật lại tên khớp **"Top Visa 5S"** ở những nơi đó. Toàn bộ website (`index.html`/`admin.html`)
   đã đổi tên đầy đủ trong session này (xem `CLAUDE.md` mục 32.C) — tên không khớp giữa website và
   Google Business Profile sẽ ảnh hưởng tín hiệu SEO địa phương (NAP consistency).
3. **Giá ở "Dịch vụ Visa các quốc gia" (Cài đặt chung) vẫn đang là giá mặc định/placeholder** (số
   cũ từng viết cứng trong `index.html`, PM xác nhận dùng tạm làm giá trị default ở phiên trước) —
   PM cần tự vào sửa lại giá thật khi có, xem `CLAUDE.md` mục 31.D.
4. **Test với đăng nhập admin thật** — vẫn CHƯA ai xác nhận trên phiên bản thật với đăng nhập thật
   cho các tính năng MỚI của 2 session gần nhất (Phase 7 + Phase 8, xem mục 2 bảng dưới). Ưu tiên
   test: lưu 1 bài viết (bắt buộc nhập "Phân loại"), thêm/sửa/xóa ở "Dịch vụ Visa các quốc gia",
   sửa 1 thành viên nhóm trong dialog Hồ sơ, lọc Bài viết theo Danh mục/Phân loại, lưu 1 Hồ sơ
   không chọn Đại lý ủy thác.
5. **Google Search Console / Google Business Profile** — vẫn dang dở từ trước, không có cập nhật
   thao tác gì mới trong session này ngoài việc ghi chú thêm việc đổi tên ở mục 2 trên (xem
   `CLAUDE.md` mục 12 nếu cần tiếp tục từ đầu).

## 2. Tóm tắt những gì session này đã làm (chi tiết đầy đủ nằm ở CLAUDE.md, không lặp lại ở đây)

Session này gồm **2 đợt việc** (2 commit đã lên `main`), theo đúng thứ tự thời gian:

### Đợt 1 — "Phase 7" (commit `066a0bf`)

| # | Việc | CLAUDE.md | Ghi chú |
|---|---|---|---|
| 1 | Dashboard: lọc "Hồ sơ trả kết quả tuần này" chỉ Đã nộp/Đang xử lý, đổi tên thẻ "Hồ sơ đang nộp"→"Hồ sơ đã nộp" | mục 31.A | |
| 2 | Danh mục bài viết: thêm nút Sửa, chặn xóa nếu đang có bài viết dùng | mục 31.B | Đảo lại quyết định cũ ở mục 14 (trước đây cho xóa tự do) |
| 3 | Hồ sơ: bỏ bắt buộc "Đại lý ủy thác", icon 🔍 lồng trong ô "Tên khách hàng" | mục 31.C | Migration: `ho_so.doi_tac_id` bỏ NOT NULL |
| 4 | "Dịch vụ Visa các quốc gia" (mới, Cài đặt chung) — CRUD giá 8 nước, landing page tự lấy giá từ đây | mục 31.D | Bảng mới `dich_vu_gia`, seed 8 dòng giá mặc định |
| 5 | Bài viết: field bắt buộc "Phân loại"; landing page tự tạo menu+section riêng cho mỗi Danh mục có bài viết công khai (thay hẳn section "Tin tức" cứng) | mục 31.E, 31.F | Cột mới `posts.phan_loai`, backfill dữ liệu cũ |
| 6 | Sort theo cột cho 7 màn list + block "Dịch vụ Visa các quốc gia" | mục 31.G | Dùng chung `onSortClick`/`applySort`/`updateSortIcons` |
| 7 | (Ngoài batch SQL) Sửa ảnh đại diện bài viết bị cắt xấu trên landing page | mục 31.F.1 | Đổi `.thumb` từ `height:160px` sang `aspect-ratio:2.3/1`; đã canh lại 10 ảnh cờ/logo mẫu ngoài git (`NguyenNC/Quoc_Ky/Edit/`) |

Migration: `05_Database/07_supabase_setup_phase7.sql` — **đã xác nhận chạy** (xem mục 0).

### Đợt 2 — "Phase 8" (commit `ca1851d`)

| # | Việc | CLAUDE.md | Ghi chú |
|---|---|---|---|
| 8 | Hồ sơ: nút Sửa cho "Thành viên nhóm", sửa canh giữa cột "Thao tác" (cả Xử lý phát sinh) | mục 32.A | Tái dùng 3 ô "+ Thêm" làm form sửa, không mở dialog riêng |
| 9 | Bài viết: filter theo Danh mục + Phân loại | mục 32.B | Phân loại chỉ hiện giá trị đang thực có trong dữ liệu |
| 10 | Đổi thương hiệu "Top Visa" → "Top Visa 5S" toàn bộ + bộ logo mới | mục 32.C | `logo.svg` (trong suốt), `favicon.png`, `logo-backup.png` (apple-touch-icon/PWA), `og-image.png` (1200×630) |
| 11 | Viết lại lời cam kết "Đậu visa mới thu phí dịch vụ" ở 5 vị trí | mục 32.D | **Xem mục 1.1 — cần PM tự đọc lại xác nhận** |
| 12 | SEO bổ sung: `hasOfferCatalog` trong JSON-LD, cập nhật `sitemap.xml` | mục 32.E | Không kèm giá trong structured data (tránh lệch với giá động) |

Không có migration SQL mới ở đợt 2 (chỉ đổi asset/code/nội dung).

**Quyết định UX tự đưa ra trong lúc làm, CHƯA hỏi lại người dùng xác nhận riêng** (nếu người dùng
phản hồi muốn khác thì sửa lại): cách viết lại câu "Đậu visa mới thu phí dịch vụ" ở mục 1.1 — đã cố
gắng giữ tinh thần cam kết mạnh nhưng thêm điều kiện, nhưng câu chữ cụ thể là do Claude tự soạn
theo yêu cầu "phân tích đưa ra câu từ", chưa qua PM duyệt câu chữ cuối cùng.

## 3. Cách đã test trong session này

- **Đọc dữ liệu THẬT từ Supabase production** qua Claude Browser (mở thẳng `https://topvisa5s.com`
  và load `index.html`/`admin.html` cục bộ nhưng vẫn gọi API thật vì key cấu hình sẵn là key thật)
  — xác nhận: danh mục bài viết động hoạt động đúng với dữ liệu thật (site đã có category "Tin
  tức" + "Thủ tục Visa", tự tạo đúng 2 menu/section), ảnh cờ/logo người dùng tự đăng tải hiển thị
  đúng sau khi sửa CSS `aspect-ratio`, logo mới load đúng dạng SVG trong suốt.
- **Mock `api()`** để test các luồng có ghi/sửa/xóa (thêm/sửa Thành viên nhóm, lưu Hồ sơ không có
  Đại lý ủy thác, lưu Bài viết thiếu/có "Phân loại", chặn xóa Danh mục bài viết đang dùng, sort các
  bảng) — theo đúng cách đã dùng ở các phiên trước: gán `api = async(path,opts)=>{...}` tạm thời,
  restore lại sau khi test xong. **Lưu ý đã gặp lại 1 lần**: mock trả `[]`/`{}` không đúng dạng cho
  GET reload sau khi save có thể làm hỏng state cục bộ (`CUR_HOSO_THANHVIEN` bị rỗng) — không phải
  bug code, chỉ là mock chưa đủ chân thực, xem lại cách mock kỹ hơn (phân biệt path GET vs PATCH)
  nếu gặp lại hiện tượng tương tự.
- **Xử lý ảnh bằng Python/Pillow** (không có sẵn công cụ rasterize SVG như `rsvg-convert`/`inkscape`
  /`cairosvg` do thiếu thư viện `libcairo` gốc trên máy — đã kiểm chứng, nếu cần rasterize SVG thật
  sự ở phiên sau, cân nhắc dùng Claude Browser render SVG trong `<img>` rồi chụp lại, hoặc cài
  `cairosvg`/`libcairo` nếu môi trường cho phép): dùng để canh tỷ lệ ảnh cờ/logo, tạo favicon/
  logo-backup/og-image từ ảnh raster gốc. Sửa SVG (bỏ nền trắng) làm trực tiếp bằng chỉnh sửa text
  vì đã có sẵn file vector nguồn với `<path>` thật (không phải ảnh nhúng), không cần rasterize.
- **Server tĩnh cục bộ** (`python -m http.server` qua `.claude/launch.json`, xem CLAUDE.md mục 9)
  dùng để test CSS/tỷ lệ ảnh ở nhiều kích thước màn hình (`resize_window` với số cụ thể, xem giới
  hạn viewport đã biết ở các bản handover cũ) — luôn **xóa `.claude/launch.json` sau khi test xong**
  để không để lại file thừa trong repo.

## 4. ⚠️ Rủi ro "2 bản sao file" (vẫn còn — cấu trúc dự án, không phải lỗi tạm thời)

Thư mục gốc dự án trên máy người dùng (`D:\01_NguyenNC\10_Claude\03_Study VS1\Vs-Landing-Page\`)
có thể có **nhiều hơn** những gì hiện trong git/worktree bạn đang thấy. Đã xác nhận cụ thể trong
session này: `02_Source/assets/logo/` (file gốc bộ nhận diện "5S" người dùng cung cấp) **đã được
copy vào worktree và commit vào git** — không còn là rủi ro "2 bản sao" nữa, đã đồng bộ.

Các vị trí **NGOÀI git, vẫn còn rủi ro như cũ** (không tự ý kết luận "không tồn tại" nếu không thấy
trong worktree đang làm việc):
- `D:\01_NguyenNC\10_Claude\03_Study VS1\NguyenNC\Quoc_Ky\` — ảnh cờ/logo gốc do người dùng chuẩn
  bị (KHÁC với `02_Source/assets/logo/` đã commit — đây là bộ ảnh CỜ QUỐC GIA dùng làm ảnh đại diện
  bài viết, không phải logo công ty), có thư mục con `Edit/` chứa bản đã canh lại tỷ lệ 2,3:1 từ
  phiên trước — người dùng tự lấy từ đây để đăng lên `postimages.org`, KHÔNG phải asset dự án nên
  không commit vào git.
- `04_Phase 2/`, `06_Phase 3_Tai_Chinh/`, `07_Phase 4_Thong_Tin_Khach_Hang/` (tài liệu bàn giao cũ),
  `05_Branding_5S/` (tài liệu thiết kế thương hiệu "5S" gốc — nhiều khả năng đây chính là nơi người
  dùng tạo ra bộ logo mới đã cung cấp trong session này), file CSV xuất từ `admin.html`.

File `CLAUDE.md`, `README.md`, `01_Docs/*`, `02_Source/*`, `05_Database/*`, `Handover_Phien_Moi.md`
có trong cả 2 nơi (đồng bộ qua git) — thư mục gốc nên `git pull` để lấy đúng bản mới nhất trước khi
đọc/sửa gì tiếp.

## 5. Quy trình deploy (tiếp tục dùng đúng cách này)

- KHÔNG có quyền chạy SQL trực tiếp lên Supabase — luôn nhờ người dùng tự chạy trong SQL Editor,
  và luôn hỏi/xác nhận rõ đã chạy chưa trước khi coi tính năng liên quan là "xong hoàn toàn".
- Sửa code → `node --check` phần script (xem `CLAUDE.md` mục 9 cho lệnh mẫu) → test qua Claude
  Browser (mục 3 ở trên) → `git add <file cụ thể>` (không dùng `-A`) → `git commit` (luôn có dòng
  `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>`) → `git push origin <nhánh>` rồi
  `git push origin <nhánh>:main` (fast-forward thẳng, KHÔNG tạo Pull Request — đã làm đúng cách
  này xuyên suốt session, nhánh và main luôn đồng bộ ngay sau mỗi lần push).
- Verify sau deploy: `curl -sL https://topvisa5s.com/... | grep "<chuỗi đặc trưng mới>"` lặp lại
  8-15 lần cách nhau ~6-8s (Cloudflare cache theo từng edge node riêng biệt, session này có lúc
  phải đợi ~40-50s mới thấy bản mới ổn định ở TẤT CẢ các lần gọi, kể cả với các file asset nhị phân
  như `.png`/`.svg` — không chỉ HTML) — thấy ổn định ở bản MỚI thì mới kết luận xong.
- **File SQL mới:** luôn thêm vào `05_Database/` theo đúng thứ tự phase (đọc `05_Database/README.md`
  trước), không tạo lại thư mục Phase rải rác.
- Chỉ commit/push khi người dùng yêu cầu rõ (đã xảy ra đúng mẫu này suốt session: làm xong → hỏi
  "có muốn commit/deploy không" → người dùng xác nhận → mới push).

## 6. Tài liệu tham khảo (đọc theo thứ tự nếu cần)

`CLAUDE.md` (toàn bộ, đặc biệt mục 22–32 cho các thay đổi gần đây nhất) → file này →
`05_Database/README.md` (thứ tự chạy SQL) → `01_Docs/10_Chuan_Dialog_Chung.md` (chuẩn dialog +
mục 9.1 cảnh báo chưa lưu, BẮT BUỘC đọc trước khi tạo dialog mới).
