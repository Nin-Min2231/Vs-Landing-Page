# Handover — Bàn giao sang phiên làm việc mới (2026-08-04, bản 2)

> File này **GHI ĐÈ HOÀN TOÀN** mọi bản handover cũ (kể cả bản 1 viết sớm hơn cùng ngày, và
> `04_Phase 2/Phase2_Handover_Phien_Moi.md`) — không cần đọc lại các bản cũ. Đọc file này TRƯỚC khi
> làm bất kỳ gì tiếp, theo đúng thứ tự: `CLAUDE.md` → file này → bắt tay vào **mục 1**.
>
> File này viết để dùng được cho **cả Claude Code lẫn Claude Cowork** (hoặc bất kỳ agent nào khác
> tiếp quản dự án) — không giả định sẵn bối cảnh hội thoại trước đó.

## 0. Bối cảnh — 1 phiên dài, tiếp nối ngay sau Phase 2→4 + SEO

Phiên trước đó (đã tóm tắt trong bản handover cũ hơn, giờ không cần đọc lại) hoàn thành Phase 3
(Tài chính), dọn SQL, SEO domain riêng, Phase 4 (Thông tin khách hàng + nâng cấp Hồ sơ/Tư vấn).
Phiên **vừa rồi** (nhánh `claude/ho-so-khach-hang-ui-2368dd`, 10 commit liên tiếp, từ `424818a` đến
`283c969`, cộng thêm 1 đợt dọn dẹp tài liệu không qua git-commit-code) làm tiếp:

1. Dialog "Đăng ký hồ sơ": ô "Tên khách hàng" đổi sang **bắt buộc chọn qua dialog tìm kiếm** (icon
   🔍), chỉnh kích thước field, sửa field "Đối tác" lấy nhầm danh mục.
2. Hàm dùng chung `vnNorm()` — tìm kiếm không phân biệt dấu tiếng Việt.
3. Hàm dùng chung `isRecordInUse()` — chặn xóa Khách hàng/Đại lý ủy thác nếu đang có hồ sơ.
4. Sửa 3 thống kê Dashboard.
5. **Gộp tab "Tư vấn" + "Khách đăng ký"** thành 1 tab, thêm cột phân loại nguồn "Từ Web"/"Tự tạo".
6. Phát hiện + sửa 1 lỗi SQL thật (`42703 chi_thu_di`) trong migration Phase 2.
7. Chip checkbox trạng thái (Hồ sơ); gộp dòng lọc Tài chính + Hồ sơ; thêm cơ chế chung **"tab cuộn
   cố định"** (`tab-scroll`) cho 7 màn list — chỉ desktop.
8. Test thật khổ điện thoại ~412×915 → phát hiện + sửa 4 vấn đề mobile.
9. **Kiểm tra + cập nhật đầy đủ tài liệu** (CLAUDE.md/README.md/Handover) cho khớp trạng thái thật.
10. **Gom toàn bộ SQL rải rác về 1 thư mục `05_Database/`** (yêu cầu người dùng, xem mục 3.9) —
    người dùng cũng tự tay xóa 2 thư mục không còn cần thiết (`05_Bugs Report/`,
    `08_Phase 5_Tu_Van/` — thư mục sau chỉ là 1 file CSV xuất từ admin.html, không phải tài liệu).

**Tất cả đã code xong, test qua DOM (Claude Browser — screenshot bị lỗi trong suốt phiên này, đã
dùng `javascript_tool` gọi hàm/đọc DOM trực tiếp), và deploy thành công lên `https://topvisa5s.com`
+ `https://topvisa.nguyennc1357.workers.dev`.** Việc gom SQL (mục 10) là thay đổi **mới nhất, chưa
commit tại thời điểm viết file này** — xem mục 1 để biết trạng thái chính xác lúc bạn đọc.

## 0. ⭐ CẬP NHẬT MỚI NHẤT — Phase 5: Bảng phí đại lý + tự động điền phí Hồ sơ + đổi lại ngày dd/mm/yyyy (2026-08-04, sau bản trên)

Ngay sau khi viết xong bản handover ở dưới, cùng session đã làm thêm 1 việc lớn nữa (nhánh
`claude/fee-table-dialog-agent-4f5717`) — đọc chi tiết đầy đủ ở `CLAUDE.md` mục 18 (Bảng phí đại lý
+ tự động điền phí Hồ sơ) và mục 19 (đảo lại quyết định định dạng ngày). Tóm tắt:

1. Dialog "Bảng phí đại lý" (`#dtFeeOverlay`): "Nơi nộp" đổi sang droplist cố định 3 giá trị; thêm
   "Đất nước" + đổi "Diện visa" sang droplist lấy từ Cài đặt chung (cả 2 bắt buộc); "Mức phí" đổi
   tên "Phí ủy thác", thêm mới "Phí lãnh sự" (cả 2 định dạng tiền dấu chấm).
2. Dialog "Đăng ký hồ sơ": chọn đủ Nước đến + Mục đích + Đại lý ủy thác → tự tra bảng phí, điền
   "Lệ phí lãnh sự"/"Đại lý-CTV" (vẫn sửa tay được, chọn lại 1 trong 3 field thì lấy lại).
3. **Đảo lại định dạng ngày lần 2**: bỏ `<input type="date">` (quyết định Phase 4), quay về mask
   chữ `dd/mm/yyyy` (như trước Phase 4) cho TOÀN BỘ 12 field ngày trong `admin.html` — PM xác nhận
   rõ muốn vậy để hiện đúng dd/mm/yyyy trên mọi máy bất kể locale. Đã cố tránh lặp lại bug cũ: mọi
   `saveXxx()`/`addXxx()` giờ báo lỗi rõ ràng (toast + chặn lưu) khi ngày gõ sai/gõ dở, KHÔNG còn
   nơi nào âm thầm thay bằng ngày hôm nay.

**Đã làm:** code xong cả 3 việc trên trong `02_Source/admin.html`; viết migration
`05_Database/05_supabase_setup_phase5.sql`; test kỹ qua Claude Browser bằng cách mock hàm `api()`
(không có tài khoản admin thật để test đăng nhập) — đã xác nhận: helper `toISODate`/`fromISODate`/
`onDateInput` xử lý đúng mọi ca biên (năm nhuận, ngày không tồn tại, để trống, gõ dở), gõ ngày thật
qua bàn phím trong dialog Hồ sơ hoạt động đúng, `lookupDoiTacPhi()` tra đúng/điền đúng/ghi đè đúng/
xóa trắng khi không khớp, `addDoiTacPhi()` validate đúng 2 field bắt buộc + ngày sai, `loadDoiTacPhi()`
hiển thị đúng cho cả dòng phí mới và dòng cũ (fallback "–"/`dien_visa` text). **Riêng việc bấm phím
Backspace/xóa ký tự thật trong ô ngày KHÔNG test được** — công cụ browser tự động ở đây không mô
phỏng được sự kiện Backspace thật (đã kiểm chứng: kể cả trên 1 `<input>` trắng thường cũng không
xóa được ký tự nào), không phải do code — đã đọc lại kỹ thuật toán `onDateInput()` bằng tay và tin
tưởng nó xử lý đúng khi xóa (thuật toán chỉ đọc lại toàn bộ số hiện có trong ô mỗi lần gõ/xóa rồi
định dạng lại, không có nhánh riêng cho xóa nên không có lý do khác biệt) — **nhưng nên tự tay gõ
thử xóa/sửa lại vài ô ngày trên trình duyệt thật của bạn để chắc chắn 100%** trước khi coi là xong.

**Còn thiếu / cần làm tiếp:**
1. **Chạy `05_Database/05_supabase_setup_phase5.sql`** trong Supabase SQL Editor (thêm cột
   `nuoc_id`/`muc_dich_id`/`phi_lanh_su`, đổi tên `muc_phi`→`phi_uy_thac` trên bảng `doi_tac_phi`)
   — chưa chạy thì dialog "Bảng phí"/tự động điền phí ở Hồ sơ sẽ lỗi khi dùng thật.
2. Test với đăng nhập admin thật: thêm 1 dòng phí đủ field, tạo Hồ sơ với tổ hợp đã có phí để xem
   tự điền, và tự tay gõ/xóa thử vài ô ngày (xem ghi chú Backspace ở trên).
3. Nhánh này (`claude/fee-table-dialog-agent-4f5717`) **CHƯA merge/push lên `main`** tại thời điểm
   viết mục này — kiểm tra lại nếu đọc file này ở phiên sau.

## 1. Việc CẦN LÀM NGAY / cần hỏi lại người dùng

1. **⚠️ QUAN TRỌNG NHẤT — chạy lại SQL migration:** người dùng cần chạy lại
   `05_Database/02_supabase_setup_phase2.sql` (bản **đã sửa lỗi** `42703`, và giờ đã **đổi chỗ**
   sang `05_Database/` — xem mục 3.9) trong Supabase SQL Editor để áp dụng cột `leads.nguon` mới.
   **Nhắc người dùng `git pull` trước** để chắc chắn lấy đúng file mới nhất ở vị trí mới.
2. **Xác nhận trên điện thoại thật (Claude Code/Cowork không có màn hình thật để xem):** icon lịch
   đã hiện đúng hình lịch chưa (xem mục 3.8 điểm 2), và trải nghiệm cuộn trang tổng thể trên máy
   thật của người dùng.
3. **Test đầy đủ với đăng nhập admin thật** cho toàn bộ tính năng mới — phần không cần đăng nhập
   đã tự test qua DOM, phần cần đăng nhập người dùng chưa xác nhận đã tự làm.
4. **Google Search Console / Google Business Profile** — dang dở từ trước, **chưa có cập nhật mới**
   trong phiên vừa rồi (xem `CLAUDE.md` mục 12).
5. **Kiểm tra xem commit "gom SQL về 05_Database/" đã được đẩy lên GitHub + deploy chưa** — nếu bạn
   đọc file này mà thấy `05_Database/` chưa tồn tại hoặc còn thấy `02_Source/supabase_setup.sql`,
   nghĩa là bước commit/push của mục 3.9 chưa hoàn tất, cần làm tiếp trước khi báo "xong" cho
   người dùng.
6. `git stash` còn tồn đọng ở thư mục gốc dự án (KHÔNG phải worktree) — xem mục 4.

## 2. Trạng thái tổng thể

| Hạng mục | Trạng thái |
|---|---|
| Dialog Hồ sơ — chọn khách hàng qua tìm kiếm, chỉnh kích thước field | ✅ Code xong, deploy |
| `vnNorm()` / `isRecordInUse()` / Dashboard 3 thống kê | ✅ Code xong, deploy |
| Gộp tab Tư vấn + Khách đăng ký, thêm cột "Nguồn" | ✅ Code xong, deploy |
| Migration `leads.nguon` (`05_Database/02_supabase_setup_phase2.sql`) | 🔴 **Cần người dùng chạy lại** (bản đã sửa lỗi + đổi chỗ) — xem mục 1.1 |
| Chip checkbox trạng thái + gộp dòng lọc + "tab cuộn cố định" (desktop) | ✅ Code xong, deploy |
| 4 fix mobile (tắt cuộn cố định, chip tràn ngang, icon lịch, nút nổi) | ✅ Code xong, deploy — 🟡 chưa xác nhận trên điện thoại thật |
| Tài liệu CLAUDE.md/README.md/Handover — rà soát + cập nhật đầy đủ | ✅ Xong |
| **Gom SQL về `05_Database/`, xóa bản cũ rải rác** | 🟡 Đã làm xong trong worktree — **kiểm tra đã commit/push/deploy chưa** khi bạn đọc file này (mục 1.5) |
| Test đầy đủ với đăng nhập admin thật (toàn bộ tính năng mới) | 🟡 Người dùng chưa xác nhận |
| Google Search Console / Business Profile | 🟡 Dang dở từ trước |

## 3. Chi tiết các phần quan trọng (để không phải đọc lại toàn bộ code)

### 3.1 Dialog "Đăng ký hồ sơ" — chọn khách hàng qua tìm kiếm
Ô "Tên khách hàng"/"Số ĐT khách"/"Địa chỉ"/"Email" giờ **readonly hoàn toàn** — chỉ điền được bằng
cách bấm icon 🔍 mở dialog "Chọn khách hàng" (`#khPickOverlay`). **Hệ quả quan trọng:** muốn đăng
ký hồ sơ cho ai, người đó phải có sẵn trong "Thông tin khách hàng" trước. Field "Đối tác" đã sửa
lại lấy đúng danh mục "👤 Đối tác" (`danh_muc_truong_nhom`) thay vì "Đối tác giới thiệu"
(`danh_muc_doi_tac`, đã bỏ hẳn khỏi Cài đặt chung — bảng vẫn còn trong Supabase, chỉ không quản lý
qua UI nữa).

### 3.2 `vnNorm()` — tìm kiếm không phân biệt dấu tiếng Việt
Xem `CLAUDE.md` mục 13. Áp dụng cho 4 ô: `fHsSearch`, `fKhSearch`, `fTvSearch`, `khPickSearch`.
**Bắt buộc dùng lại cho mọi ô tìm kiếm mới.**

### 3.3 `isRecordInUse()` — kiểm tra ràng buộc trước khi xóa
Xem `CLAUDE.md` mục 14. Áp dụng cho `delKhachHang`, `delDoiTac`, `deleteDanhMuc`. **Bắt buộc dùng
lại cho mọi nút "Xóa" mới trên dữ liệu có thể bị tham chiếu.**

### 3.4 Gộp "Tư vấn" + "Khách đăng ký" → 1 tab, thêm cột "Nguồn"
Xem `CLAUDE.md` mục 15. Tab "Khách đăng ký" đã **xóa hẳn**. Cột mới `leads.nguon` ('Từ Web' / 'Tự
tạo') — **cần chạy lại migration mới verify được trên Supabase thật** (mục 1.1). Dữ liệu lead CŨ
đã backfill thành 'Tự tạo' theo yêu cầu người dùng.

### 3.5 Chip checkbox trạng thái (Hồ sơ) + gộp dòng lọc
Xem `CLAUDE.md` mục 16. Mặc định "Đang xử lý" + "Đã nộp" được tick. Dòng lọc Hồ sơ/Tài chính
(`.filters-hoso`) KHÔNG bọc cuộn ngang — đủ chỗ thì 1 dòng, không đủ tự xuống dòng.

### 3.6 "Tab cuộn cố định" (`tab-scroll`) — CHỈ áp dụng desktop
Xem `CLAUDE.md` mục 17. **Desktop** (>700px): 7 màn list khoá cố định tiêu đề/lọc/thống kê, chỉ
bảng kết quả cuộn riêng. **Mobile** (≤700px): cơ chế này **TẮT HẲN**, cuộn nguyên trang bình thường.

### 3.7 4 fix mobile (test thật khổ ~412×915)
1. Chip trạng thái (Hồ sơ) tràn ngang → `flex-basis:100%;min-width:0`.
2. Icon lịch hiện mũi tên thay vì hình lịch trên 1 số điện thoại → tự vẽ SVG riêng, CHỈ mobile.
3. Nút "+ Thêm..." bị cuộn mất → class `.btn-add-fab`, nổi cố định góc phải trên mobile.

Chi tiết đầy đủ + giới hạn kỹ thuật (không verify được icon lịch bằng mắt) xem `CLAUDE.md` mục 17
đoạn cuối.

### 3.8 Lỗi SQL `42703 chi_thu_di` — bối cảnh đầy đủ
Khối ALTER trong migration Phase 2 (đổi công thức `tong_chi`/`loi_nhuan`) viết **từ trước Phase 4**
— công thức gốc dùng `chi_thu_di + chi_thu_ve`, 2 cột đã bị Phase 4 xóa hẳn và thay bằng
`chi_phi_ship`. Người dùng chạy lại Phase 2 SQL (để áp dụng `leads.nguon` mới) thì dính lỗi này.
Đã sửa: bọc khối đó trong `DO` block kiểm tra cột `chi_phi_ship` có tồn tại chưa để chọn đúng công
thức. **Bài học cho phiên sau:** không mặc định 1 file SQL cũ "chạy lại an toàn" chỉ vì có
`if not exists` — phải kiểm tra có migration SAU đó đã đổi schema mà file cũ chưa biết không.

### 3.9 ⭐ MỚI NHẤT — Gom toàn bộ SQL về `05_Database/` (2026-08-04)
Theo yêu cầu người dùng (đúng sau khi phát hiện lỗi ở mục 3.8 — muốn tránh lặp lại kiểu nhầm lẫn
"chạy nhầm file cũ"): đã **di chuyển** 4 file SQL về 1 thư mục duy nhất, đổi tên theo thứ tự phase:

| Cũ (đã XÓA) | Mới |
|---|---|
| `02_Source/supabase_setup.sql` | `05_Database/01_supabase_setup.sql` |
| `04_Phase 2/supabase_setup_phase2.sql` | `05_Database/02_supabase_setup_phase2.sql` |
| `06_Phase 3_Tai_Chinh/supabase_setup_phase3.sql` (chỉ ở thư mục gốc, không có trong git) | `05_Database/03_supabase_setup_phase3.sql` |
| `07_Phase 4_Thong_Tin_Khach_Hang/supabase_setup_phase4.sql` (chỉ ở thư mục gốc, không có trong git) | `05_Database/04_supabase_setup_phase4.sql` |

Nội dung mỗi file được copy **y nguyên byte-for-byte** (đã `diff` xác nhận), không sửa logic gì
thêm trong lúc di chuyển. Đã thêm `05_Database/README.md` ghi rõ thứ tự chạy + quy tắc thêm
migration mới (đọc trước khi động vào SQL). Đã cập nhật lại toàn bộ đường dẫn trong `CLAUDE.md`,
`README.md`, `01_Docs/07_Huong_dan_Deploy.md`, `01_Docs/05_Ke_hoach_du_an.md`. **Các thư mục
`04_Phase 2/`, `06_Phase 3_Tai_Chinh/`, `07_Phase 4_Thong_Tin_Khach_Hang/` vẫn còn tài liệu bàn
giao/ảnh thiết kế (không phải SQL) như cũ, KHÔNG bị xóa** — chỉ riêng file `.sql` bị chuyển đi.

**⚠️ Quy tắc mới cho mọi phiên sau:** không tạo lại file SQL rải rác ở thư mục Phase riêng nữa —
mọi migration mới (thêm cột, đổi bảng...) đều thêm vào `05_Database/` (file mới hoặc nối vào file
gần nhất, xem `05_Database/README.md`).

## 4. ⚠️ Rủi ro "2 bản sao file" (đã gọn bớt, nhưng vẫn còn)

Thư mục gốc dự án trên máy người dùng (`D:\01_NguyenNC\10_Claude\03_Study VS1\Vs-Landing-Page\`)
vẫn có thể có nhiều hơn những gì trong git/worktree. Đã xác nhận còn (KHÔNG có trong git):

- `06_Phase 3_Tai_Chinh/Phase3_TaiChinh_Ban_giao_Claude_Code.md` — tài liệu bàn giao Phase 3 (SQL
  đã chuyển đi, chỉ còn tài liệu).
- `07_Phase 4_Thong_Tin_Khach_Hang/Phase4_BanGiao_Claude_Code.md` + `Dialog_Tao_moi_ho_so.png` —
  tài liệu + ảnh thiết kế Phase 4 (SQL đã chuyển đi).
- `04_Phase 2/01_Design/` — 3 ảnh thiết kế Figma tham chiếu (dialog/popup chuẩn).
- `05_Branding_5S/` — tài liệu thương hiệu/logo mới "5S mệnh Kim", làm **ngoài luồng Claude Code**,
  không liên quan code.
- **Người dùng đã tự xóa** `05_Bugs Report/` (Excel báo lỗi QA) và `08_Phase 5_Tu_Van/` (chỉ là 1
  file CSV tự xuất, không phải tài liệu) — **không còn tồn tại nữa**, đừng nhắc tới 2 mục này nữa
  trong các phiên sau (bản handover trước có nhắc, giờ đã lỗi thời).
- **1 `git stash` vẫn còn tồn đọng** ở thư mục gốc, tên
  `"backup truoc khi pull 2026-08 - file nhap cu chua commit o 04_Phase 2 va Handover_Phien_Moi.md"`
  — chứa vài bản nháp cũ (đã so sánh, cũ hơn/kém đầy đủ hơn bản chính thức trong git, khả năng cao
  an toàn để bỏ qua) — **chưa xóa hẳn**, để đó phòng khi cần đối chiếu. Dùng `git stash list`/
  `git stash show -p` nếu cần xem lại.

File `CLAUDE.md`, `README.md`, `01_Docs/*`, `02_Source/*`, `05_Database/*`, `Handover_Phien_Moi.md`
thì có trong cả 2 nơi (đã đồng bộ qua git). Thư mục gốc đã `git pull` lên đúng bản mới nhất cuối
mỗi phiên — nhưng **kiểm tra lại** nếu commit "gom SQL" (mục 3.9) mới xong, có thể thư mục gốc
CHƯA `git pull` bản đó (xem mục 1.5).

## 5. Quy trình deploy (tiếp tục dùng đúng cách này)

- KHÔNG có quyền chạy SQL trực tiếp lên Supabase — luôn nhờ người dùng tự chạy trong SQL Editor.
  **Trước khi bảo người dùng "chạy lại file X"**, kiểm tra file đó có bị ảnh hưởng bởi migration
  SAU nó không (bài học mục 3.8) — không mặc định "idempotent" là an toàn tuyệt đối.
- Sửa code → kiểm tra cú pháp JS + cân bằng thẻ HTML → test qua Claude Browser (`javascript_tool`
  gọi hàm/đọc DOM trực tiếp — screenshot không dùng được trong phiên này; viewport nhỏ hơn ~500px
  cũng không set được, phải mô phỏng bằng cách ép `max-width` tạm thời lên 1 container) → `git add`
  + `git commit` (luôn có dòng `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>`) →
  `git push origin <nhánh>` rồi `git push origin <nhánh>:main` (fast-forward thẳng, KHÔNG tạo Pull
  Request).
- Verify sau deploy: `curl -sL https://topvisa5s.com/...` (luôn `-L`). Cloudflare cache theo từng
  edge node riêng biệt — 1-2 lần `curl` đầu có thể vẫn ra bản CŨ dù deploy đã xong — `curl` lặp lại
  5-10 lần cách nhau vài giây, thấy ổn định ở bản MỚI thì mới kết luận deploy xong.
- **Khi thay đổi liên quan tới file SQL:** luôn thao tác trong `05_Database/` (xem mục 3.9), không
  tạo lại file/thư mục Phase SQL rải rác.

## 6. Tài liệu tham khảo (đọc theo đúng thứ tự nếu cần)

`CLAUDE.md` (đặc biệt mục 12–17) → file này → `05_Database/README.md` (SQL) →
`01_Docs/10_Chuan_Dialog_Chung.md` (chuẩn dialog) →
`06_Phase 3_Tai_Chinh/Phase3_TaiChinh_Ban_giao_Claude_Code.md` (chỉ ở thư mục gốc) →
`07_Phase 4_Thong_Tin_Khach_Hang/Phase4_BanGiao_Claude_Code.md` (chỉ ở thư mục gốc).
