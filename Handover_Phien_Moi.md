# Handover — Bàn giao sang phiên làm việc mới (2026-08-01)

> File này **GHI ĐÈ HOÀN TOÀN** `04_Phase 2/Phase2_Handover_Phien_Moi.md` — nội dung bản cũ (Phase 2
> CRM: Dashboard/Tư vấn/Hồ sơ/Đại lý ủy thác/Cài đặt chung, hệ thống dialog chuẩn, popup Confirm/
> Thông báo) **đã xong và đã deploy từ trước**, không cần đọc lại. Đọc file này TRƯỚC khi làm bất kỳ
> gì tiếp, theo đúng thứ tự: `CLAUDE.md` → file này → bắt tay vào **mục 1**.

## 0. Bối cảnh — 1 phiên rất dài, đi qua nhiều "phase" liên tiếp

Phiên vừa qua (worktree nhánh `claude/phase-3-tai-chinh-9e6053`) làm liên tục nhiều yêu cầu lớn
theo đúng thứ tự thời gian:

1. **Phase 3 — Tài chính**: thêm tab "💰 Tài chính" (Lợi nhuận/Khoản thu/Khoản chi).
2. **6 điểm sửa UI/UX** theo yêu cầu người dùng (dialog Khoản chi theo chuẩn, nút "Chi tiết", định
   dạng ngày, bỏ "Chờ kết quả", nút Sửa màu xanh, bỏ nút Ẩn/Hiện) — **quan trọng: điểm định dạng
   ngày dd/mm/yyyy ở bước này SAU ĐÓ ĐÃ BỊ ĐỔI NGƯỢC LẠI ở Phase 4** (xem mục 3.5).
3. **Dọn dẹp SQL**: bỏ toàn bộ câu `insert into ...` (dữ liệu mẫu) khỏi file setup, ghi quy tắc vào
   `CLAUDE.md` để không tự thêm nữa.
4. **SEO**: phát hiện domain riêng `topvisa5s.com` (đã gắn nhưng chưa ghi vào tài liệu) chưa được
   Google index — tối ưu code (canonical/OG/JSON-LD/robots.txt/sitemap.xml) + hướng dẫn người dùng
   tự làm Google Search Console + Google Business Profile (đang dở, xem mục 2).
5. **Phase 4 — Thông tin khách hàng + nâng cấp Hồ sơ/Tư vấn**: tab mới, danh mục mới, autocomplete,
   đổi lại toàn bộ field ngày về `type="date"` chuẩn (revert lại quyết định ở mục 2).

**Tất cả đã code xong, test qua DOM (Claude Browser — ảnh chụp màn hình bị lỗi trong phiên này,
đã chuyển sang đọc DOM/gọi hàm trực tiếp để test), và deploy thành công lên `https://topvisa5s.com`
+ `https://topvisa.nguyennc1357.workers.dev`.** HEAD của nhánh làm việc trùng khớp `origin/main`.

## 1. Việc CẦN LÀM NGAY / cần hỏi lại người dùng

1. **Google Business Profile — câu hỏi chưa có câu trả lời**: đã hỏi người dùng "nhân viên Top Visa
   có bao giờ đến tận nhà/văn phòng khách để lấy giấy tờ/tư vấn trực tiếp không" (để quyết định có
   tick ô "Service business" khi tạo Google Business Profile hay không) — **chưa nhận được câu trả
   lời khi phiên kết thúc**. Nếu người dùng hỏi tiếp về bước này, hỏi lại câu trên trước khi khuyên.
2. **Search Console/Business Profile chưa xong hẳn**: người dùng đã xác minh quyền sở hữu
   `https://topvisa5s.com` (URL prefix, thẻ HTML) và đang giữa chừng làm Google Business Profile
   (đã qua bước chọn loại hình doanh nghiệp). Cần hỏi lại xem đã khai báo sitemap + bấm "Yêu cầu lập
   chỉ mục" trong Search Console chưa, và Business Profile đã xác minh xong chưa (thường mất vài
   ngày nếu xác minh qua thư bưu điện).
3. **Phase 4 — chưa xác nhận đối chiếu số liệu migration**: người dùng báo "đã chạy SQL thành công"
   nhưng **chưa xác nhận cụ thể** đã đối chiếu `count(*)`/`sum(chi_phi_ship)` trước-sau theo đúng
   mục 0 của `07_Phase 4_Thong_Tin_Khach_Hang/Phase4_BanGiao_Claude_Code.md` chưa. Không bắt buộc
   phải làm lại (migration đã chạy, dữ liệu đã ở trạng thái mới), nhưng nếu người dùng nghi ngờ có
   hồ sơ bị lệch số tiền, đây là việc đầu tiên cần kiểm tra lại.
4. **Checklist test đầy đủ với tài khoản đăng nhập thật** cho cả Phase 3 (mục 8) và Phase 4 (mục 11)
   trong 2 file bàn giao tương ứng — phần không cần đăng nhập đã tự test qua DOM, phần cần đăng nhập
   (thêm/sửa/xóa Khoản chi thật, tạo Hồ sơ thật liên kết Khách hàng thật...) người dùng chưa xác
   nhận đã tự làm.

## 2. Trạng thái tổng thể

| Hạng mục | Trạng thái |
|---|---|
| Phase 3 — Tài chính (tab, CRUD Khoản chi, xuất CSV) | ✅ Code xong, deploy — xem mục 3.1 |
| Dọn SQL — bỏ insert dữ liệu mẫu + quy tắc CLAUDE.md | ✅ Xong, deploy |
| SEO — canonical/OG/JSON-LD/robots.txt/sitemap.xml | ✅ Code xong, deploy |
| SEO — Google Search Console | 🟡 Đã xác minh quyền sở hữu — **chưa xác nhận đã khai báo sitemap + Request Indexing** |
| SEO — Google Business Profile | 🟡 Đang làm dở (đã chọn loại hình DN) — chưa xác nhận xong |
| Phase 4 — Thông tin khách hàng + nâng cấp Hồ sơ/Tư vấn | ✅ Code xong, deploy — xem mục 3.5 |
| Phase 4 — migration đã chạy trên Supabase thật | 🟡 Người dùng báo "thành công", **chưa xác nhận đối chiếu số liệu** |
| Test đầy đủ với đăng nhập thật (Phase 3 + Phase 4) | 🟡 Người dùng chưa xác nhận đã tự làm |

## 3. Chi tiết các phần quan trọng (để không phải đọc lại toàn bộ code)

### 3.1 Phase 3 — Tab "💰 Tài chính"
Bảng mới `khoan_chi` (chi phí vận hành, nhập tay — **khác hoàn toàn** các cột `chi_...` trong
`ho_so`, không được cộng trùng). Khoản thu = `loi_nhuan` của `ho_so` có `trang_thai='Đậu'`, theo
`ngay_tra_kq`. RLS chỉ `authenticated`. Chi tiết: `06_Phase 3_Tai_Chinh/Phase3_TaiChinh_Ban_giao_Claude_Code.md`
(⚠️ file này CHỈ có ở thư mục gốc dự án, KHÔNG có trong git/worktree — xem mục 4).

### 3.2 6 điểm sửa UI/UX (đã áp dụng, 1 điểm đã bị override ở Phase 4)
1. Dialog "Thêm khoản chi" đổi theo đúng chuẩn `.dlg-section`/`.dlg-row` (xem `01_Docs/10_Chuan_Dialog_Chung.md`).
2. Dòng "Thu" trong bảng Tài chính: nút "Chi tiết" mở dialog Hồ sơ (cho sửa), thay vì chỉ hiện chữ.
3. ~~Định dạng ngày dd/mm/yyyy (mask tự viết)~~ — **ĐÃ BỊ THAY THẾ hoàn toàn ở Phase 4** bằng
   `<input type="date">` chuẩn, xem mục 3.5.
4. Bỏ trạng thái "Chờ kết quả" khỏi màn Hồ sơ.
5. Nút "Sửa" đổi từ xám sang xanh chữ trắng (`btn-p`) — áp dụng toàn bộ, còn nguyên tới giờ.
6. Bỏ nút "Ẩn/Hiện" trong Cài đặt chung — còn nguyên tới giờ.

### 3.3 Dọn SQL — không tự thêm `insert into` nữa
Đã bỏ insert dữ liệu mẫu khỏi `02_Source/supabase_setup.sql` và `04_Phase 2/supabase_setup_phase2.sql`.
**Quy tắc mới ghi trong `CLAUDE.md` mục 10**: không tự ý thêm `insert into ...` vào bất kỳ file SQL
setup/migration nào nữa — lý do `on conflict do nothing` không bảo vệ được nếu người dùng đã xóa 1
dòng dữ liệu mẫu trước đó (chạy lại SQL sẽ vô tình chèn lại). Nếu 1 tính năng mới thật sự cần dữ liệu
khởi tạo, phải hỏi người dùng trước.

### 3.4 SEO — domain riêng `topvisa5s.com`
**Phát hiện quan trọng**: dự án đã có domain riêng `https://topvisa5s.com` (gắn qua Cloudflare) từ
trước, nhưng tài liệu cũ (`01_Docs/08_Ban_giao_Claude_Code.md`) vẫn ghi "chưa mua domain" — đã cập
nhật `CLAUDE.md` mục 2 phản ánh đúng thực tế. Trang chạy song song ở CẢ 2 nơi (`topvisa5s.com` và
`topvisa.nguyennc1357.workers.dev`, cùng 1 bản deploy).

Nguyên nhân tìm `topvisa5s.com` trên Google không ra kết quả: domain **chưa từng được Google crawl**
(không phải lỗi kỹ thuật). Đã làm: canonical trỏ về `topvisa5s.com`, Open Graph/Twitter Card đầy đủ,
JSON-LD (`TravelAgency` + `FAQPage` khớp đúng nội dung FAQ hiển thị), `robots.txt` + `sitemap.xml`
mới (trước đó chưa từng tồn tại), thẻ `<meta name="google-site-verification">` (người dùng đã xác
minh xong property URL-prefix `https://topvisa5s.com`). Chi tiết đầy đủ + hướng dẫn từng bước Search
Console/Business Profile: `CLAUDE.md` mục 12.

**Việc dở dang của người dùng** (xem mục 1 ở trên): Search Console mới xác minh xong, chưa xác nhận
khai báo sitemap + Request Indexing; Google Business Profile đang tạo dở.

### 3.5 Phase 4 — Thông tin khách hàng + nâng cấp Hồ sơ/Tư vấn (mới nhất, đáng chú ý nhất)

**Tab mới "👥 Thông tin khách hàng"**: bảng `khach_hang` (Họ tên/SĐT/Ngày sinh/CCCD/Địa chỉ/Email/
Ghi chú), CRUD đầy đủ kể cả xóa (khác Hồ sơ/Tư vấn không cho xóa hẳn), cảnh báo trùng SĐT không
chặn lưu, RLS chỉ `authenticated` (có CCCD/ngày sinh — dữ liệu cá nhân nhạy cảm).

**Danh mục mới "🤝 Đối tác giới thiệu"** (`danh_muc_doi_tac`/`doi_tac_dm_id`) trong Cài đặt chung —
⚠️ **ĐÃ THAY THẾ HẲN** field "Đối tác" cũ (thực ra là Trưởng nhóm/`danh_muc_truong_nhom`/
`truong_nhom_id`, đổi tên hiển thị từ Phase 2) trong dialog Hồ sơ, theo quyết định của người dùng
khi được hỏi (2 field tên gần giống nhau, ảnh thiết kế Phase 4 cũng chỉ có 1 dropdown ở vị trí đó).
**Lưu ý cho phiên sau**: bảng `danh_muc_truong_nhom` + cột `truong_nhom_id` trên `ho_so` **vẫn còn
trong CSDL, dữ liệu hồ sơ cũ không mất**, chỉ không còn sửa được từ dialog Hồ sơ nữa. Cài đặt chung
vẫn còn hiện đủ 4 khối: 🌍 Nước đến, 🎯 Mục đích, 👤 Đối tác (= Trưởng nhóm cũ, không xóa), 🤝 Đối
tác giới thiệu (mới).

**Dialog Hồ sơ nâng cấp**: autocomplete Tên khách hàng (gõ → gọi API `khach_hang` → gợi ý → chọn 1
dòng tự điền SĐT/Địa chỉ/Email, nền đổi `#DDE1E6`, sửa lại tên thì tự bỏ liên kết); field Email mới;
mặc định Nước đến = "Nhật Bản" khi tạo mới; Đại lý ủy thác dropdown chỉ hiện "Đang hợp tác" (trừ khi
đang sửa hồ sơ cũ đã gán đại lý nay ngừng hợp tác — vẫn hiện để không mất dữ liệu); gộp "Thư đi" +
"Thư về" thành 1 cột thật `chi_phi_ship` (Phase 2 trước đó chỉ hack bằng cách giữ `chi_thu_di` ẩn +
đổi nhãn `chi_thu_ve`, giờ Phase 4 migration đã xóa hẳn 2 cột cũ và tạo cột mới đúng nghĩa); thêm
Ghi chú riêng cho Thu và Chi; tự cuộn lên đầu dialog khi mở.

**List Hồ sơ**: thêm cột SĐT + Ngày nộp; tô đỏ "Ngày trả KQ" **CHỈ** khi Trạng thái = "Đã nộp" VÀ
ngày đó ≤ hôm nay (không áp dụng Đang xử lý/Đậu/Rớt/Hủy dù cùng ngày); thêm bộ lọc khoảng "Ngày nộp"
(Từ ngày/Đến ngày) + nút "Reset" (xóa hết điều kiện lọc kể cả ô tìm kiếm tên).

**Tư vấn**: SĐT không còn bắt buộc ở admin (form công khai `index.html` không đổi, vẫn bắt buộc
riêng); đổi tên trạng thái "Đã gọi" → "Đang tư vấn" (toàn bộ 7 chỗ trong code, dữ liệu cũ trong DB
đã được migration Phase 4 tự đổi tên, class CSS kỹ thuật `.pill-called` giữ nguyên).

**⚠️ Đổi lại TOÀN BỘ field ngày về `<input type="date">` chuẩn HTML5** (9 field: Ngày tạo/Ngày nộp/
Ngày trả KQ ở Hồ sơ, Hạn chốt ở Xử lý phát sinh, Ngày áp dụng ở Bảng phí đại lý, Ngày nhắc lại ở Tư
vấn, Từ ngày/Đến ngày ở Tài chính, Ngày ở Khoản chi, Ngày sinh ở Khách hàng) — **hủy bỏ hoàn toàn**
cơ chế mask dd/mm/yyyy tự viết ở mục 3.2 điểm 3. Đã xóa hẳn 3 hàm `onDateInput()`/`fromISODate()`/
`toISODate()` khỏi code — **không tự ý viết lại mask ngày nữa** trừ khi người dùng yêu cầu rõ ràng
(lý do đổi lại: PM yêu cầu icon lịch toàn hệ thống + mask cũ gây lỗi nhập liệu thực tế).

Migration Phase 4 (`07_Phase 4_Thong_Tin_Khach_Hang/supabase_setup_phase4.sql`) có **XÓA CỘT**
(`chi_thu_di`, `chi_thu_ve`) trên bảng `ho_so` đang có dữ liệu thật, đã cộng dồn dữ liệu cũ vào
`chi_phi_ship` trước khi xóa, bọc trong 1 transaction. Người dùng xác nhận đã chạy thành công.

## 4. ⚠️ QUAN TRỌNG — rủi ro "2 bản sao file" vẫn còn, đọc kỹ trước khi cần các file bàn giao

Các thư mục `06_Phase 3_Tai_Chinh/` và `07_Phase 4_Thong_Tin_Khach_Hang/` (chứa file bàn giao + SQL
+ ảnh thiết kế) **CHỈ tồn tại ở thư mục gốc dự án**
(`D:\01_NguyenNC\10_Claude\03_Study VS1\Vs-Landing-Page\`), **KHÔNG có trong git/worktree** — đã xác
nhận bằng lệnh `ls` ở đầu mỗi phase. Khi cần đọc lại các file này ở phiên sau, phải đọc bằng đường
dẫn tuyệt đối tới thư mục gốc, KHÔNG tìm trong worktree. File `CLAUDE.md`, `README.md`,
`01_Docs/10_Chuan_Dialog_Chung.md`, `02_Source/*`, `04_Phase 2/*` thì có trong cả 2 nơi (đã đồng bộ
qua git) — sửa ở worktree rồi push là đủ, không cần sửa tay ở thư mục gốc.

## 5. Quy trình deploy (tiếp tục dùng đúng cách này)

- KHÔNG có quyền chạy SQL trực tiếp lên Supabase — luôn nhờ người dùng tự chạy trong SQL Editor,
  đặc biệt các migration có ALTER/DROP COLUMN trên bảng có dữ liệu thật phải nhắc người dùng backup
  + đối chiếu số liệu trước-sau (xem mục 0 của các file bàn giao Phase 3/4).
- Sửa code → kiểm tra cú pháp JS (`node -e "new Function(...)"`) + cân bằng thẻ HTML (Python
  `HTMLParser`) → test qua Claude Browser (mở file local, dùng `javascript_tool` gọi hàm/đọc DOM
  trực tiếp nếu `computer screenshot` bị lỗi "Browser pane không hiển thị" như phiên này) → `git
  add` + `git commit` → `git push origin <nhánh>` rồi `git push origin <nhánh>:main` (fast-forward
  thẳng, KHÔNG tạo Pull Request).
- Verify sau deploy: `curl -sL https://topvisa5s.com/...` — **luôn dùng `-L`** để theo dõi redirect
  (phát hiện trong phiên này: `/admin.html` bị Cloudflare 307-redirect sang `/admin`, nếu không có
  `-L` lệnh `curl` chờ vô hạn không bao giờ thấy nội dung mới, dù deploy đã xong từ lâu).

## 6. Tài liệu tham khảo (đọc theo đúng thứ tự nếu cần)

`CLAUDE.md` → file này → `01_Docs/10_Chuan_Dialog_Chung.md` (chuẩn dialog, đã cập nhật mục 9 nói về
việc dùng lại `type="date"`) → `06_Phase 3_Tai_Chinh/Phase3_TaiChinh_Ban_giao_Claude_Code.md` (chỉ
ở thư mục gốc) → `07_Phase 4_Thong_Tin_Khach_Hang/Phase4_BanGiao_Claude_Code.md` (chỉ ở thư mục gốc).
