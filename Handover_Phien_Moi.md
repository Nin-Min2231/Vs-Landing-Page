# Handover — Bàn giao sang phiên làm việc mới (2026-08-04, bản 3 — GHI ĐÈ toàn bộ bản cũ)

> File này **GHI ĐÈ HOÀN TOÀN** mọi bản handover cũ (bản 1, bản 2 và mọi đoạn "Cập nhật mới nhất"
> nối thêm sau đó) — **không cần đọc lại bản cũ**, nội dung quan trọng còn giá trị đã gom hết vào
> đây. Đọc theo đúng thứ tự: `CLAUDE.md` (toàn bộ, đặc biệt mục 12–29) → file này → bắt tay vào
> **mục 1**. Viết để dùng được cho cả Claude Code lẫn Claude Cowork/agent khác, không giả định sẵn
> bối cảnh hội thoại trước đó.

## 0. Trạng thái ngay lúc viết file này

- Nhánh làm việc: `claude/fee-table-dialog-agent-4f5717` — **đã fast-forward vào `main` và deploy
  thành công**, xác nhận qua `curl` lặp lại nhiều lần ổn định ở bản mới. `git status` sạch, không
  có gì chưa commit. `origin/main` và branch này đang trỏ **cùng 1 commit** (`f5117b8`).
- Trang chạy thật: `https://topvisa5s.com` (chính) + `https://topvisa.nguyennc1357.workers.dev`
  (cùng 1 bản deploy, Cloudflare Workers, tự build khi push lên `main`).
- Toàn bộ việc trong session này đã **code xong + test qua Claude Browser** (mô phỏng DOM/dữ liệu
  giả vì không có tài khoản admin thật để đăng nhập) — xem mục 3 để biết cách test đã dùng.

## 1. Việc CẦN LÀM NGAY

1. **⚠️ Xác nhận đã chạy `05_Database/06_supabase_setup_phase6.sql` chưa** (thêm cột
   `le_phi`/`thoi_gian_xet_duyet`/`checklist`/`ghi_chu` vào bảng `danh_muc_nuoc`) — người dùng
   **CHƯA xác nhận** đã chạy file này tại thời điểm viết handover. Nếu chưa chạy, dialog "Nước đến"
   (Cài đặt chung) sẽ báo lỗi khi lưu. Các file `01`→`05` trong `05_Database/` được xác nhận đã
   chạy trước đó (`05` được người dùng xác nhận trực tiếp bằng lời "Tôi đã chạy SQL xong"), `01`-`04`
   không có báo lỗi gì trong suốt session dù đã dùng nhiều tính năng phụ thuộc — coi như ổn định.
2. **Test với đăng nhập admin thật** — TOÀN BỘ việc trong session này chỉ mới test qua giả lập
   (mock dữ liệu/API trong Claude Browser, xem mục 3), CHƯA ai xác nhận trên phiên bản thật với
   Supabase thật + đăng nhập thật. Ưu tiên test: dialog "Nước đến" (lưu thật), cảnh báo "chưa lưu"
   ở vài dialog hay dùng (Hồ sơ, Tư vấn), phân trang Khách hàng nếu có ≥26 khách hàng thật, icon
   lịch bấm chọn (vị trí hiển thị popup chưa verify được bằng mắt — xem mục 3).
3. **Google Search Console / Google Business Profile** — vẫn dang dở từ trước, không có cập nhật gì
   trong session này (xem `CLAUDE.md` mục 12 nếu cần tiếp tục).

## 2. Tóm tắt những gì session này đã làm (chi tiết đầy đủ nằm ở CLAUDE.md, không lặp lại ở đây)

Toàn bộ trong `02_Source/admin.html`, theo đúng thứ tự thời gian — mỗi mục đọc `CLAUDE.md` mục
tương ứng khi cần chi tiết kỹ thuật/mẫu code:

| # | Việc | CLAUDE.md | Ghi chú |
|---|---|---|---|
| 1 | Dialog "Bảng phí đại lý" nâng cấp (Nơi nộp/Đất nước/Diện visa/Phí ủy thác/Phí lãnh sự) + tự động điền phí khi tạo Hồ sơ | mục 18 | |
| 2 | Đảo lại định dạng ngày lần 2: `type="date"` → mask chữ `dd/mm/yyyy` cho 12 field | mục 19 | PM xác nhận rõ, không tự ý đổi lại lần 3 |
| 3 | Icon lịch (📅) tùy chỉnh — popup lịch mini tự viết, lồng trong ô input | mục 20 | Đã sửa 1 lần từ "nút rời to" sang "icon nhỏ trong ô" theo phản hồi PM |
| 4 | Nút "Xóa" cho từng dòng phí trong Bảng phí đại lý | mục 21 | Chặn xóa nếu đã có Hồ sơ dùng đúng tổ hợp Đại lý+Nước đến+Mục đích |
| 5 | Mở rộng "Nước đến" (Cài đặt chung): +Lệ phí/Thời gian xét duyệt/Checklist/Ghi chú, bảng full-width + dialog riêng `#nuocOverlay` | mục 22 | Migration `06_supabase_setup_phase6.sql` — xem mục 1.1 |
| 6 | Cảnh báo "dữ liệu chưa lưu" khi đóng dialog — dùng chung cho **9 dialog** | mục 23 | **BẮT BUỘC áp dụng cho mọi dialog mới sau này** — xem `01_Docs/10_Chuan_Dialog_Chung.md` mục 9.1 |
| 7 | Dashboard: thêm "Trả KQ hôm nay" + khối "Hồ sơ trả kết quả tuần này" + đổi thứ tự hiển thị | mục 24 | |
| 8 | Phân trang "Thông tin khách hàng" (25/trang) | mục 25 | |
| 9 | Zebra-stripe thẻ mobile (dòng chẵn nền xanh nhạt) | mục 26 | |
| 10 | Dashboard: bỏ thẻ "Doanh thu tháng này", tính lại "Lợi nhuận tháng này" đúng công thức Tài chính | mục 27 | Còn 6 thẻ thống kê (không phải 7) |
| 11 | Hồ sơ: sort theo Trạng thái (Đang xử lý→Đã nộp→Đậu→Rớt→Hủy) rồi Ngày tạo cũ nhất | mục 28 | |
| 12 | Dòng tiêu đề cột (thead) dính cứng khi cuộn, cho 7 màn list đã có "tab cuộn cố định" | mục 29 | Lần 2 thử tính năng này (lần 1 ở mục 17 cũ đã bỏ) — **đã hỏi lại người dùng trước khi làm**, xác nhận scope đúng 7 màn, KHÔNG áp dụng Dashboard/Cài đặt chung |

**2 quyết định UX tự đưa ra trong lúc làm, CHƯA hỏi lại người dùng xác nhận** (nếu người dùng phản
hồi muốn khác thì sửa lại):
- Nút mở dialog "Nước đến" đặt tên **"Chi tiết"** (dùng chung xem+sửa, không tách 2 luồng riêng).
- Khối "Hồ sơ trả kết quả tuần này" **không lọc theo trạng thái** hồ sơ (hiện tất cả bất kể trạng
  thái, miễn khớp khoảng ngày).

## 3. Cách đã test trong session này (không có tài khoản admin thật)

- **Chạy static server cục bộ** (`python -m http.server` trong `02_Source/`) + `preview_start` +
  Claude Browser, bypass màn đăng nhập bằng JS (`loginView.classList.add('hidden')` +
  `appView.classList.remove('hidden')`), gán thẳng dữ liệu giả vào các biến global (`HO_SO`,
  `LEADS`, `DANH_MUC_NUOC`...) rồi gọi trực tiếp các hàm render/save cần test.
- **Mock `api()`** khi cần test luồng có gọi Supabase (`const real=api; api=async(path,opts)=>{...}; ...; api=real;`) — cẩn thận: nếu hàm đang test có gọi tiếp 1 hàm KHÁC cũng dùng `api()` (vd
  `saveNuocModal()` gọi `loadDanhMuc()` sau khi lưu), mock đơn giản có thể vô tình trả sai dữ liệu
  cho lệnh gọi đó — đã gặp 1 lần trong session này (mock trả `[]` cho GET khiến `DANH_MUC_NUOC` bị
  xóa sạch), không phải bug code, chỉ là mock chưa phân biệt GET/POST đủ kỹ.
- **⚠️ Quan trọng — giới hạn viewport đã tìm ra cách khắc phục:** mặc định `window.innerWidth`/
  `innerHeight` trả về `0` trong sandbox này (không đo được layout thật) — nhưng nếu chủ động gọi
  `resize_window` với **width/height cụ thể** (không chỉ preset tên suông, vd
  `resize_window({width:1280,height:800})`) thì viewport thật được thiết lập đúng, từ đó
  `getBoundingClientRect()`/`scrollWidth`/`clientWidth`/`window.matchMedia()` đều đo chính xác —
  dùng cách này để verify sticky thead, cuộn ngang, zebra-stripe mobile mà KHÔNG cần chờ người
  dùng tự cầm điện thoại test. Đã dùng thành công để xác nhận: 6 thẻ Dashboard không tràn chữ ở
  1280px, 3 bảng Dashboard hết cuộn ngang, sticky thead đứng yên khi cuộn thật, zebra-stripe đúng
  màu ở 375px.
- **Chưa test được:** vị trí hiển thị THẬT của popup lịch (📅) trên các thiết bị/kích thước màn
  hình khác nhau bằng mắt thường (chỉ verify được logic mở/đóng/chọn ngày qua DOM) — nên tự tay
  thử trên điện thoại/trình duyệt thật ở vài vị trí field khác nhau.

## 4. ⚠️ Rủi ro "2 bản sao file" (vẫn còn — cấu trúc dự án, không phải lỗi tạm thời)

Thư mục gốc dự án trên máy người dùng (`D:\01_NguyenNC\10_Claude\03_Study VS1\Vs-Landing-Page\`)
có thể có **nhiều hơn** những gì hiện trong git/worktree bạn đang thấy — ví dụ tài liệu bàn giao cũ
(`04_Phase 2/`, `06_Phase 3_Tai_Chinh/`, `07_Phase 4_Thong_Tin_Khach_Hang/` — chỉ còn tài liệu/ảnh
thiết kế tham chiếu, SQL đã dọn hết vào `05_Database/` từ lâu), `05_Branding_5S/` (thương hiệu mới,
làm ngoài luồng Claude Code), hoặc file CSV người dùng tự xuất từ `admin.html`. **Nếu đang chạy
trong 1 worktree/clone khác và không thấy các thư mục này — đừng vội kết luận chúng không tồn tại
hay đã bị xóa**, rất có thể chỉ đơn giản chưa từng được đưa vào git. Hỏi lại người dùng nếu cần nội
dung cụ thể trong đó.

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
- Verify sau deploy: `curl -sL https://topvisa5s.com/admin.html | grep "<chuỗi đặc trưng mới>"`
  lặp lại 8-15 lần cách nhau ~5-8s (Cloudflare cache theo từng edge node riêng biệt, có lần phải
  đợi >60s mới thấy bản mới ở TẤT CẢ các lần gọi) — thấy ổn định ở bản MỚI thì mới kết luận xong.
- **File SQL mới:** luôn thêm vào `05_Database/` theo đúng thứ tự phase (đọc `05_Database/README.md`
  trước), không tạo lại thư mục Phase rải rác.
- Chỉ commit/push khi người dùng yêu cầu rõ (đã xảy ra đúng mẫu này suốt session: làm xong → hỏi
  "có muốn commit/deploy không" → người dùng xác nhận → mới push).

## 6. Tài liệu tham khảo (đọc theo thứ tự nếu cần)

`CLAUDE.md` (toàn bộ, đặc biệt mục 12–29 cho các thay đổi gần đây nhất) → file này →
`05_Database/README.md` (thứ tự chạy SQL) → `01_Docs/10_Chuan_Dialog_Chung.md` (chuẩn dialog +
mục 9.1 cảnh báo chưa lưu, BẮT BUỘC đọc trước khi tạo dialog mới).
