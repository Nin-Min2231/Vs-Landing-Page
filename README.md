# 🛂 Dự án: Top Visa – Landing Page (Lead Generation)

Landing page dịch vụ visa đa quốc gia + trang quản trị, chi phí vận hành 0đ (Cloudflare Pages + Supabase Free).

> 👉 Đang phát triển tiếp bằng **Claude Code**? Đọc `CLAUDE.md` ở thư mục gốc trước — file đó tóm tắt toàn bộ context dự án cho agent.

## Cấu trúc thư mục

```
Visa-Landing-Page/
├── README.md                  ← file này (cho người đọc)
├── CLAUDE.md                  ← context cho Claude Code (cho agent) ⭐
├── 01_Docs/                   ← tài liệu thiết kế (đọc theo thứ tự)
│   ├── 01_Phan_tich_yeu_cau.md    Yêu cầu chức năng/phi chức năng, persona, scope
│   ├── 02_Sitemap_UserFlow.md     Sitemap + user flow (sơ đồ Mermaid)
│   ├── 03_Wireframe.md            Wireframe Desktop / Tablet / Mobile
│   ├── 04_Design_System.md        Màu, font, spacing + danh sách component
│   ├── 05_Ke_hoach_du_an.md       Kế hoạch 6 phase + test case + checklist
│   ├── 06_Cong_nghe_de_xuat.md    So sánh công nghệ + lý do chọn
│   ├── 07_Huong_dan_Deploy.md     Hướng dẫn domain, hosting, deploy, backup ⭐
│   └── Visa-Landing-Page_Tai_lieu.xlsx   Bản Excel gộp cả 7 tài liệu trên (dễ đọc/in)
├── 02_Source/                 ← source code
│   ├── index.html                 Landing page (mở bằng trình duyệt xem ngay)
│   ├── admin.html                 Trang quản trị (cần cấu hình Supabase)
│   └── assets/                    Logo, favicon, QR Zalo (deploy kèm 2 file HTML)
├── 03_Information/            ← thông tin gốc công ty (logo, QR, Information.md — nguồn dữ liệu thật)
└── 05_Database/               ← ⭐ TOÀN BỘ script SQL cần chạy trên Supabase (đọc README.md trong đây)
```

> ⚠️ Khi deploy Cloudflare Pages: kéo thả cả 2 file HTML **và thư mục `assets`** (giữ nguyên tên).

## Bắt đầu nhanh (3 việc cần làm)

1. **Xem thử ngay:** nháy đúp `02_Source/index.html` — trang chạy được luôn (form chưa gửi được vì chưa nối Supabase).
2. **Kích hoạt form + admin:** làm theo `01_Docs/07_Huong_dan_Deploy.md` → Bước 1 (tạo Supabase, ~15 phút).
3. **Đưa lên Internet:** làm tiếp Bước 3 (Cloudflare Pages, kéo thả file, ~10 phút).

## Việc cần làm trước khi công khai

Tìm chữ `[THAY_THẾ]` trong `index.html` (Ctrl+F) và thay bằng thông tin thật:

- [x] Tên công ty: **Top Visa** — cập nhật 2026-07-18 (nguồn: `03_Information/Information.md`)
- [x] Logo, favicon (từ `logo.jpg`) — cập nhật 2026-07-10
- [x] Hotline/Zalo 0935 887 922, link Facebook (công ty + tư vấn viên), QR Zalo, địa chỉ 303 Âu Cơ Liên Chiểu Đà Nẵng, email hien.gotravel@gmail.com — cập nhật 2026-07-18
- [x] Bảng giá từng quốc gia — cập nhật 2026-08-06, giờ quản lý qua admin.html ("Cài đặt chung" →
      "Dịch vụ Visa các quốc gia"), landing page tự lấy giá từ đó (xem Phase 7 bên dưới). PM tự
      sửa lại giá thật khi có, hiện đang dùng đúng số cũ ("Từ x đ") làm giá trị mặc định.
- [ ] Số liệu "5000+ hồ sơ / 98% đậu" → số thật (tránh vi phạm quảng cáo)
- [x] Review khách hàng thật — cập nhật 2026-07-30 (2 review thật lấy từ Facebook công ty)
- [x] Số GPKD ở footer — đã bỏ dòng này theo yêu cầu (2026-07-31), footer chỉ còn "© 2026 Top Visa."

## Đã đưa lên Internet (2026-07-30)

Trang đang chạy thật tại domain riêng **`https://topvisa5s.com`** (vẫn còn chạy song song ở `https://topvisa.nguyennc1357.workers.dev`, cùng 1 bản deploy) — Supabase đã kết nối thật, form/admin hoạt động. Chi tiết đầy đủ về hạ tầng, quyết định kỹ thuật, và việc cần làm tiếp theo: xem `01_Docs/08_Ban_giao_Claude_Code.md`.

## Phase 2 — Quản lý khách hàng / Admin CRM (2026-07-31)

Đã code xong 5 tab mới trong `admin.html` (Dashboard, Tư vấn, Hồ sơ, Đại lý ủy thác, Cài đặt chung) — xem chi tiết `04_Phase 2/Phase2_Ban_giao_Claude_Code.md`.

- [ ] **Cần chạy `05_Database/02_supabase_setup_phase2.sql` trong Supabase SQL Editor trước khi dùng** (tạo bảng mới, mở rộng bảng `leads`) — Claude Code không tự chạy được bước này.
- [ ] Test theo checklist mục 8 trong file bàn giao trên sau khi migration chạy xong.

## Phase 3 — Tài chính (2026-08-01)

Đã thêm tab "💰 Tài chính" vào `admin.html`: Lợi nhuận/Khoản thu/Khoản chi theo khoảng thời gian
(Khoản thu tự động từ Hồ sơ đã đậu, Khoản chi nhập tay) — xem chi tiết
`06_Phase 3_Tai_Chinh/Phase3_TaiChinh_Ban_giao_Claude_Code.md`. Đã đẩy lên `main` và deploy thật.

- [x] Chạy `05_Database/03_supabase_setup_phase3.sql` trong Supabase SQL Editor (bảng `khoan_chi`).
- [ ] Test theo checklist mục 8 trong file bàn giao trên với dữ liệu thật (đã tự kiểm tra được phần
      không cần đăng nhập: giao diện, định dạng tiền, 4 nút lọc nhanh, RLS chặn `anon` đọc/ghi
      `khoan_chi` — còn phần cần đăng nhập admin thật thì người dùng tự test).

## SEO — đưa `topvisa5s.com` lên Google (2026-08-01)

Phát hiện tìm `topvisa5s.com` trên Google không ra kết quả — do domain **chưa từng được Google
thu thập dữ liệu**, không phải lỗi kỹ thuật. Đã tối ưu code (canonical, Open Graph, structured
data, `robots.txt`, `sitemap.xml`) — chi tiết đầy đủ ở `CLAUDE.md` mục 12.

- [x] Thêm canonical/Open Graph/Twitter Card/JSON-LD (TravelAgency + FAQPage) vào `index.html`.
- [x] Tạo `02_Source/robots.txt` + `02_Source/sitemap.xml`.
- [ ] **Cần bạn tự làm** (không thể làm thay vì cần đăng nhập tài khoản Google riêng của bạn):
      tạo Google Search Console → xác minh `topvisa5s.com` → khai báo sitemap → "Yêu cầu lập chỉ
      mục". Nên làm thêm Google Business Profile cho SEO địa phương Đà Nẵng. Xem hướng dẫn từng
      bước ở `CLAUDE.md` mục 12.

## Phase 4 — Thông tin khách hàng & nâng cấp Hồ sơ/Tư vấn (2026-08-01)

Đã thêm tab mới "👥 Thông tin khách hàng" (quản lý khách đã từng làm hồ sơ) + nâng cấp lớn dialog
"Đăng ký hồ sơ mới" (chọn Tên khách hàng qua dialog tìm kiếm — bấm icon 🔍 mở dialog chọn từ
"Thông tin khách hàng", không gõ tay được nữa; field Email; icon lịch cho mọi field ngày; gộp Thư
đi/Thư về thành Phí ship; field "Đối tác" lấy đúng danh mục "👤 Đối tác" trong Cài đặt chung) +
nâng cấp list Hồ sơ (thêm cột SĐT/Ngày nộp, tô đỏ Ngày trả KQ, bộ lọc gộp 1 dòng không xuống dòng —
bỏ lọc "Nước đến", nút Reset cạnh nút Thêm hồ sơ) + list Thông tin khách hàng (bỏ cột Ghi chú, cột
Địa chỉ cắt ngắn không xuống dòng) + Tư vấn (SĐT không bắt buộc, đổi "Đã gọi" → "Đang tư vấn") —
xem chi tiết `07_Phase 4_Thong_Tin_Khach_Hang/Phase4_BanGiao_Claude_Code.md`.

Bổ sung sau đó (2026-08): tìm kiếm không phân biệt dấu tiếng Việt cho mọi ô tìm kiếm tự do (hàm
dùng chung `vnNorm()`, xem `CLAUDE.md` mục 13); chặn xóa "Thông tin khách hàng"/"Đại lý ủy thác"
nếu đã có hồ sơ tham chiếu (hàm dùng chung `isRecordInUse()`, xem `CLAUDE.md` mục 14); Dashboard
sửa lại thống kê "Hồ sơ đang xử lý" (trước đó gộp nhầm cả "Đang xử lý" + "Đã nộp") và thêm 2 thống
kê mới "Hồ sơ đang nộp" + "Hồ sơ đang tư vấn"; bộ lọc "Trạng thái" màn Hồ sơ đổi từ dropdown sang
chip checkbox nhiều lựa chọn, mặc định "Đang xử lý" + "Đã nộp" (xem `CLAUDE.md` mục 16); **gộp tab
"Tư vấn" + "Khách đăng ký" thành 1 tab "Tư vấn" duy nhất**, thêm cột phân loại nguồn "Từ Web"/"Tự
tạo" trên bảng `leads` (xem `CLAUDE.md` mục 15); gộp bộ lọc nhanh (Tháng này/Tháng trước/Năm nay —
bỏ "Quý này") vào chung dòng "Từ ngày...Đến ngày" ở Tài chính; dòng lọc trạng thái + tìm kiếm +
ngày nộp của Hồ sơ gộp chung với tiêu đề "Quản lý hồ sơ" thành 1 dòng, bỏ luôn bộ lọc "Đại lý";
**mọi màn hình list giờ khoá cố định phần tiêu đề/lọc/thống kê, chỉ bảng kết quả cuộn riêng** (class
`tab-scroll`, xem `CLAUDE.md` mục 17 — chuẩn bắt buộc áp dụng cho màn list mới sau này).

- [x] Đã chạy `supabase_setup_phase4.sql` (giờ là `05_Database/04_supabase_setup_phase4.sql`) trong
      Supabase SQL Editor (có xóa cột `chi_thu_di`/`chi_thu_ve` trên bảng `ho_so` đang có dữ liệu
      thật — người dùng xác nhận đã chạy thành công).
- [ ] **Cần chạy lại `05_Database/02_supabase_setup_phase2.sql` trong Supabase SQL Editor** (đã cập
      nhật thêm cột `leads.nguon`). ⚠️ Lần chạy đầu (2026-08-04) bị lỗi `42703: column "chi_thu_di"
      does not exist` — **đã sửa xong** (file cũ có 1 đoạn tính lại `tong_chi`/`loi_nhuan` viết từ
      trước khi Phase 4 xoá cột `chi_thu_di`/`chi_thu_ve`, giờ đã bọc điều kiện kiểm tra đúng
      trạng thái database, xem `CLAUDE.md` mục 15) — **cần chạy lại file ĐÃ SỬA** (kéo bản mới nhất
      bằng `git pull` trước khi copy vào SQL Editor) để migration `leads.nguon` áp dụng thành công.
- [ ] Test theo checklist mục 11 trong file bàn giao trên với dữ liệu thật (đã tự kiểm tra được phần
      không cần đăng nhập qua DOM: autocomplete, mặc định Nước đến=Nhật Bản, lọc Đại lý ủy thác chỉ
      hiện Đang hợp tác, tô đỏ Ngày trả KQ đúng 3 trường hợp, tính lại Tổng chi với Phí ship, Reset
      bộ lọc, RLS chặn `anon` trên `khach_hang`/`danh_muc_doi_tac` — còn phần cần đăng nhập admin
      thật thì người dùng tự test, đặc biệt đối chiếu số liệu trước/sau migration theo mục 0).

## Tối ưu điện thoại cho Admin CRM (2026-08-04)

Test thật trên khổ điện thoại ~412×915 phát hiện 3 vấn đề, đã sửa:

- Bộ lọc/thống kê/tiêu đề của mọi màn hình list (Tư vấn, Hồ sơ, Thông tin khách hàng, Tài chính,
  Đại lý ủy thác, Bài viết, Danh mục bài viết) **không còn cố định trên điện thoại nữa** (chỉ giữ
  cố định trên máy tính) — trên điện thoại, nếu ép đứng yên thì phần này quá cao, che gần hết màn
  hình, chỉ còn 1 khe nhỏ xem list. Giờ điện thoại cuộn nguyên trang như bình thường.
- Nhóm chip trạng thái (màn Hồ sơ) từng bị tràn ngang trên điện thoại — đã sửa để tự xuống dòng.
- Icon lịch của các ô ngày tháng có thể hiện mũi tên thay vì hình lịch trên 1 số điện thoại — đã tự
  vẽ icon lịch riêng cho điện thoại (web/máy tính không đổi gì, vẫn đúng từ trước).
- Nút "+ Thêm..." (đăng ký mới) trên các màn list giờ nổi cố định góc phải màn hình điện thoại khi
  cuộn, để luôn bấm được mà không cần cuộn lên lại.

## Phase 5 — Bảng phí đại lý nâng cấp + tự động điền phí khi tạo Hồ sơ (2026-08-04)

Dialog "Bảng phí" (màn Đại lý ủy thác) nâng cấp: "Nơi nộp" đổi sang droplist cố định (Đà Nẵng/Hà
Nội/TP Hồ Chí Minh); thêm "Đất nước" + đổi "Diện visa" sang droplist lấy từ Cài đặt chung (Nước
đến/Mục đích, cả 2 bắt buộc); "Mức phí" đổi tên thành "Phí ủy thác", thêm "Phí lãnh sự" tách riêng
(cả 2 định dạng tiền có dấu chấm ngăn cách nghìn) — xem `CLAUDE.md` mục 18.

Dialog "Đăng ký hồ sơ": khi chọn đủ Nước đến + Mục đích + Đại lý ủy thác, tự tra "Bảng phí đại lý"
và điền "Lệ phí lãnh sự"/"Đại lý-CTV" (vẫn sửa tay được, chọn lại 1 trong 3 field thì lấy lại).

**Đổi lại định dạng ngày:** toàn bộ ô ngày trong `admin.html` (12 field) đổi từ `<input
type="date">` (Phase 4) sang **ô nhập chữ có mask dd/mm/yyyy** (như trước Phase 4) — PM xác nhận
muốn vậy để hiện đúng dd/mm/yyyy trên MỌI máy bất kể locale, chấp nhận đánh đổi mất icon lịch có
sẵn của trình duyệt. Đã cố gắng tránh lặp lại lỗi cũ (Phase 3, "chỉ nhận dd/mm"): không còn nơi nào
âm thầm thay ngày không hợp lệ bằng ngày hôm nay — nhập sai/nhập dở đều báo lỗi rõ ràng và chặn lưu.
Xem `01_Docs/10_Chuan_Dialog_Chung.md` mục 9 (đã viết lại toàn bộ).

- [ ] **Cần chạy `05_Database/05_supabase_setup_phase5.sql` trong Supabase SQL Editor** (thêm cột
      `nuoc_id`/`muc_dich_id`/`phi_lanh_su` + đổi tên `muc_phi`→`phi_uy_thac` trên bảng
      `doi_tac_phi`) — chưa chạy thì dialog "Bảng phí"/tự động điền phí ở Hồ sơ sẽ lỗi.
- [ ] Test với đăng nhập admin thật: thêm 1 dòng phí mới đủ field, tạo Hồ sơ chọn đúng tổ hợp
      Nước đến/Mục đích/Đại lý ủy thác đã có phí để kiểm tra tự điền, gõ thử vài ô ngày (kể cả
      trường hợp gõ sai/gõ dở) ở nhiều dialog khác nhau.

**Bổ sung thêm cùng ngày:** thêm icon lịch (📅) tùy chỉnh mở popup chọn ngày cho cả 12 ô ngày (vẫn
gõ tay được như cũ); thêm nút "Xóa" cho từng dòng trong bảng "Các mức phí đã có" (Bảng phí đại lý),
tự chặn xóa nếu dòng phí đó đã có Hồ sơ đăng ký đúng tổ hợp Đại lý/Nước đến/Mục đích — xem
`CLAUDE.md` mục 20-21.

- [ ] Tự tay kiểm tra vị trí hiển thị popup lịch trên trình duyệt thật (nằm dưới/trên nút bấm, đặc
      biệt với field gần mép dưới/phải màn hình) — công cụ test tự động không xem được bằng mắt.

Chi tiết kỹ thuật đầy đủ: `CLAUDE.md` mục 17.

- [ ] **Cần bạn tự kiểm tra trên điện thoại thật** (Claude Code không có màn hình điện thoại thật để
      xem trực tiếp): icon lịch đã đúng hình lịch chưa (phần dễ sai lệch nhất giữa các dòng máy),
      và trải nghiệm cuộn trang tổng thể trên máy của bạn.

## Gom toàn bộ SQL về `05_Database/` (2026-08-04)

Theo yêu cầu người dùng (tránh nhầm lẫn chạy nhầm bản cũ — từng gây lỗi thật, xem mục Phase 4 ở
trên): 4 file SQL trước đây nằm rải rác ở `02_Source/supabase_setup.sql`,
`04_Phase 2/supabase_setup_phase2.sql`, `06_Phase 3_Tai_Chinh/supabase_setup_phase3.sql`,
`07_Phase 4_Thong_Tin_Khach_Hang/supabase_setup_phase4.sql` đã được **gom về `05_Database/`**
(đổi tên `01_..`→`04_..` theo đúng thứ tự phase) và **xóa hẳn bản gốc** ở 4 vị trí cũ. Từ nay:

- **Cần chạy SQL gì → luôn tìm trong `05_Database/`** (đọc `05_Database/README.md` trước, có ghi
  rõ thứ tự chạy 01→04 và lý do vẫn an toàn chạy lại toàn bộ dù database đã qua hết 4 phase).
- Các thư mục `04_Phase 2/`, `06_Phase 3_Tai_Chinh/`, `07_Phase 4_Thong_Tin_Khach_Hang/` vẫn còn
  giữ tài liệu bàn giao/ảnh thiết kế (không phải SQL) như cũ, không bị xóa.

## Phase 6 — Dashboard mở rộng, Nước đến mở rộng, cảnh báo chưa lưu, phân trang (2026-08-04)

- **Dashboard**: thêm thống kê "Trả KQ hôm nay" (7 thẻ tổng cộng), thêm khối mới "Hồ sơ trả kết quả
  tuần này" (7 ngày tới, đỏ nếu đúng hôm nay, nút Chi tiết mở lại dialog Hồ sơ), đổi thứ tự hiển thị
  các khối, hết cuộn ngang ở 2 bảng "Xử lý phát sinh"/"Nhắc lại".
- **"Nước đến"** (Cài đặt chung): thêm Lệ phí/Thời gian xét duyệt/Checklist/Ghi chú, đổi sang bảng
  full-width + dialog riêng, danh sách dài tự cắt "..." (xem đủ khi bấm "Chi tiết").
- **Cảnh báo "dữ liệu chưa lưu"**: mọi dialog nhập liệu trong hệ thống giờ tự hỏi xác nhận nếu đóng
  lúc còn thay đổi chưa lưu — áp dụng cho toàn bộ 9 dialog hiện có.
- **Phân trang** "Thông tin khách hàng": 25 khách/trang.
- **Zebra-stripe** cho thẻ list trên điện thoại: dòng chẵn nền xanh nhạt, dòng lẻ giữ nguyên.

Chi tiết đầy đủ: `CLAUDE.md` mục 22-26.

- [ ] **Cần chạy `05_Database/06_supabase_setup_phase6.sql` trong Supabase SQL Editor** (thêm 4 cột
      mới cho bảng `danh_muc_nuoc`) — chưa chạy thì dialog "Nước đến" mới sẽ lỗi khi lưu.
- [ ] Test với đăng nhập admin thật: thử sửa dở 1 dialog bất kỳ rồi bấm Đóng/X xem có hỏi xác nhận
      đúng không; thử phân trang Khách hàng nếu có ≥26 khách hàng; xem Dashboard có đúng 6 thẻ +
      khối "Hồ sơ trả kết quả tuần này" không.

**Bổ sung thêm cùng ngày (đợt 2):** bỏ thẻ "Doanh thu tháng này" (còn 6 thẻ), tính lại "Lợi nhuận
tháng này" đúng công thức màn Tài chính; màn "Hồ sơ" sort lại theo Trạng thái (Đang xử lý → Đã nộp
→ Đậu → Rớt → Hủy) rồi Ngày tạo cũ nhất; dòng tiêu đề cột (thead) đứng yên khi cuộn cho 7 màn list
(Tư vấn/Hồ sơ/Thông tin khách hàng/Tài chính/Đại lý ủy thác/Bài viết/Danh mục bài viết). Chi tiết:
`CLAUDE.md` mục 27-29. Không có migration SQL mới đợt này.

## Sửa lỗi "phiên đăng nhập hết hạn" khi lưu (2026-08-04)

Trước đây nếu mở `admin.html` liên tục quá ~1 giờ, thao tác lưu tiếp theo (thêm bài viết, hồ sơ...)
sẽ báo lỗi 401 và bị đăng xuất, dù dữ liệu đang gõ vẫn còn trên form. Đã sửa: hệ thống giờ tự âm
thầm làm mới phiên đăng nhập và thử lưu lại 1 lần, người dùng không thấy gì bất thường — chỉ khi
làm mới cũng thất bại (đóng trình duyệt quá lâu) mới thật sự báo lỗi + đăng xuất như cũ. Chi tiết:
`CLAUDE.md` mục 30.

## Phase 7 — Giá dịch vụ động, Phân loại bài viết + menu động, đại lý không bắt buộc, sort chung (2026-08-06)

- **Dashboard**: khối "Hồ sơ trả kết quả tuần này" chỉ lấy hồ sơ "Đã nộp"/"Đang xử lý"; đổi tên thẻ
  "Hồ sơ đang nộp" → "Hồ sơ đã nộp".
- **Danh mục bài viết**: thêm nút "Sửa"; chặn xóa nếu danh mục đang có bài viết dùng (đảo lại quyết
  định cũ ở Phase 4 vốn cho xóa tự do).
- **Hồ sơ**: "Đại lý ủy thác" không còn bắt buộc chọn; icon kính lúp ở "Tên khách hàng" chuyển vào
  lồng trong ô input (gọn hơn, đồng bộ icon lịch).
- **"Dịch vụ Visa các quốc gia"** (mới, Cài đặt chung): quản lý giá 8 nước đang có trên landing
  page — landing page (`index.html`) tự lấy giá từ đây thay vì fix cứng trong code.
- **Bài viết**: thêm field "Phân loại" bắt buộc — quyết định tiêu đề section hiển thị trên landing
  page. Landing page giờ tự tạo 1 menu + 1 section riêng cho MỖI Danh mục đang có ít nhất 1 bài
  viết công khai (trước đây chỉ có đúng 1 section "Tin tức" cứng).
- **Sort theo cột**: mọi màn hình list (Tư vấn/Hồ sơ/Thông tin khách hàng/Tài chính/Đại lý ủy
  thác/Bài viết/Danh mục bài viết) giờ bấm được vào tiêu đề cột để sắp xếp tăng/giảm.

Chi tiết kỹ thuật đầy đủ: `CLAUDE.md` mục 31.

- [ ] **Cần chạy `05_Database/07_supabase_setup_phase7.sql` trong Supabase SQL Editor** (bỏ bắt
      buộc `ho_so.doi_tac_id`, thêm `posts.phan_loai` (tự backfill dữ liệu cũ), tạo bảng mới
      `dich_vu_gia` có sẵn 8 dòng giá mặc định) — chưa chạy thì lưu Bài viết sẽ báo lỗi thiếu cột
      và giá dịch vụ trên landing page vẫn hiện số cũ viết sẵn trong HTML (không phải lỗi, chỉ là
      chưa có bảng để lấy giá thật).
- [ ] Test với đăng nhập admin thật: sửa/xóa 1 danh mục bài viết đang dùng (phải bị chặn), lưu 1
      Hồ sơ không chọn Đại lý ủy thác, thêm/sửa giá ở "Dịch vụ Visa các quốc gia" rồi F5 lại
      `index.html` xem giá có đổi theo không, thêm 1 bài viết Danh mục mới xem có tự hiện menu mới
      trên landing page không, bấm sort thử vài cột ở mỗi màn list.

## Phase 8 — Đổi thương hiệu "Top Visa 5S", sửa lời cam kết, ảnh bài viết đúng tỷ lệ, SEO (2026-08-07)

- **Đổi tên công ty "Top Visa" → "Top Visa 5S"** ở MỌI nơi trên `index.html`/`admin.html` (tiêu đề
  trang, meta, JSON-LD, logo, chân trang...) theo bộ nhận diện mới. Logo cũ (`logo.png`) thay bằng
  bộ mới: `logo.svg` (icon kim cương trong suốt, dùng cho navbar/footer), `favicon.png`,
  `logo-backup.png` (icon nền trắng, dùng cho apple-touch-icon/PWA), `og-image.png` (1200×630,
  ảnh đẹp hơn khi chia sẻ link Facebook/Zalo).
- **Sửa lời cam kết "Đậu visa mới thu phí dịch vụ"**: câu cũ cam kết tuyệt đối "trượt không mất phí
  dịch vụ" — thực tế hồ sơ khách yếu đôi khi vẫn phát sinh phí xử lý dù trượt. Đã viết lại thêm điều
  kiện "hồ sơ đủ điều kiện" + luôn kèm "báo phí bằng văn bản trước khi quyết định" ở cả 5 vị trí
  (promo bar, 2 khối cam kết, FAQ + JSON-LD) — tránh khách hiểu nhầm, đúng thực tế vận hành hơn.
- **Ảnh đại diện bài viết hết bị cắt xấu**: khung ảnh đổi từ chiều cao cố định 160px sang tỷ lệ cố
  định 2,3:1 ở MỌI kích thước màn hình (trước đây trên điện thoại tỷ lệ khung có thể lên tới ~4:1,
  cắt mất phần lớn ảnh). Khi đăng bài mới, nên chọn/canh ảnh theo tỷ lệ ngang ~2,3:1 (vd 1200×520).
- **Hồ sơ**: bảng "Thành viên nhóm" thêm nút "Sửa" (cạnh nút "Xóa"), sửa lỗi nút bị lệch trái so với
  tiêu đề cột "Thao tác" (cùng sửa luôn cho bảng "Xử lý phát sinh").
- **Bài viết**: thêm 2 bộ lọc "Danh mục" và "Phân loại" (chỉ hiện các Phân loại đang thực sự được
  dùng) để tìm bài nhanh hơn khi danh sách dài.
- **SEO bổ sung**: thêm dữ liệu có cấu trúc liệt kê 7 dịch vụ visa theo quốc gia (không kèm giá, vì
  giá giờ quản lý động), cập nhật ngày `sitemap.xml`.

Chi tiết kỹ thuật đầy đủ: `CLAUDE.md` mục 31 (F.1, ảnh bài viết) và mục 32 (còn lại).

- [ ] **Nếu công ty đã có Google Business Profile/trang mạng xã hội dưới tên "Top Visa" cũ** — cập
      nhật lại tên khớp "Top Visa 5S" ở những nơi đó (Google đánh giá độ tin cậy một phần dựa vào
      tên công ty khớp nhau giữa website và các nơi khác).
- [ ] Test với đăng nhập admin thật: bấm "Sửa" 1 thành viên nhóm trong hồ sơ, thử lọc Bài viết theo
      Danh mục/Phân loại, xem lại kỹ toàn bộ nội dung "Đậu visa mới thu phí dịch vụ" trên trang chủ
      xem đã đúng ý muốn truyền tải chưa (đây là nội dung marketing/cam kết, PM nên tự đọc lại kỹ).

## Muốn sửa nội dung?

Gửi file cho Claude kèm yêu cầu, ví dụ: "Đổi giá visa Nhật thành 1.800.000đ", "Thêm quốc gia Singapore", "Đổi màu chủ đạo sang xanh lá" — sau đó deploy lại theo Bước 5 trong hướng dẫn.
