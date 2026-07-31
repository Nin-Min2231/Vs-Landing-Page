# Phase 2 — Bàn giao cho Claude Code (Quản lý khách hàng / Admin CRM)

> Đọc file này SAU `CLAUDE.md` (gốc dự án) và `01_Docs/08_Ban_giao_Claude_Code.md` (bàn giao Phase 1).
> File này là bản tóm tắt ĐÃ ĐƯỢC PM CONFIRM — không cần mở lại `Phase2_Dac_ta.xlsx` để đọc từng dòng,
> trừ khi cần tra lại chi tiết 1 field cụ thể. Nguồn đầy đủ: xem mục 7 bên dưới.

## 1. Mục tiêu Phase 2

Thêm trang quản lý khách hàng vào `admin.html` hiện có: 5 tab mới — **Dashboard, Hồ sơ, Tư vấn,
Đại lý ủy thác, Cài đặt chung**. Không đổi kiến trúc (vẫn HTML/CSS/JS thuần, không build step),
không đụng `index.html`, không đụng bảng `posts`/`categories` của Blog.

## 2. Việc cần làm, theo thứ tự

1. Không còn câu hỏi mở nào — toàn bộ đã PM confirm, xem mục 3 và 5.1.
2. Chạy `04_Phase 2/supabase_setup_phase2.sql` trong Supabase SQL Editor (idempotent, chạy lại không lỗi).
3. Code 5 tab mới trong `admin.html`, tái sử dụng toàn bộ style bảng/modal/pill/toast đã có (không tạo CSS mới trùng lặp).
4. Code luồng "Chốt tư vấn → tạo Hồ sơ" ở mục 5.1 — tính năng mới PM vừa yêu cầu bổ sung.
5. Thêm Chart.js qua CDN cho Dashboard (giống cách nhúng Google Fonts hiện tại — 1 thẻ `<script src="https://cdn.jsdelivr.net/npm/chart.js">` hoặc cdnjs, không cần npm).
6. Test theo checklist mục 8 trước khi báo hoàn thành.

## 3. Quyết định đã CHỐT (không cần hỏi lại PM)

- **Đổi tên "Đối tác" → "Đại lý ủy thác"** trên toàn bộ giao diện (tên tab, tên field ở màn Hồ sơ, nhãn cột). Tên bảng/cột kỹ thuật trong CSDL **giữ nguyên** `doi_tac` / `doi_tac_id` (không đổi để khỏi sửa lại khoá ngoại).
- **Field "Đại lý ủy thác" ở màn Hồ sơ là BẮT BUỘC** (đổi từ đề xuất ban đầu là tuỳ chọn cho khách lẻ). Dropdown hiển thị dạng **"Tên người đảm nhiệm (Tên công ty)"**, ví dụ *"Ms. Duyên (Sông Hàn ĐN)"*.
- **"Ngày nhắc tư vấn lại" CHỈ có ở màn Tư vấn** (bảng `leads`), **KHÔNG có ở màn Hồ sơ**. Dashboard mục "cần nhắc lại 7 ngày" chỉ đọc từ Tư vấn.
- **Bỏ hẳn mục "Top đại lý ủy thác trong tháng"** khỏi Dashboard — PM xác nhận không cần.
- **Field "Trạng thái hồ sơ"** (Đang xử lý/Đã nộp/Chờ kết quả/Đậu/Rớt/Hủy) — giữ, PM đã confirm OK.
- **Bảng phí đại lý ủy thác có "Ngày áp dụng từ"** — giữ lịch sử phí theo thời gian, không ghi đè khi đại lý đổi giá (PM confirm đồng ý).
- **Danh mục Mục đích và Trưởng nhóm** — PM đã tự chỉnh sửa giá trị khởi tạo cuối cùng trực tiếp trong Excel, đã đưa vào SQL migration ở mục A. Không dùng lại danh sách gộp nhóm ban đầu Claude từng đề xuất.
- **Bảng con mới "Xử lý phát sinh"** (theo yêu cầu bổ sung của PM, mục 4 sheet `6_Danh_gia_Chi_phi`) — mỗi hồ sơ có nhiều dòng công việc/giấy tờ cần bổ sung, field: STT (tự sinh), Nội dung, Hạn chốt, Ghi chú, Trạng thái. Dashboard liệt kê các dòng có Hạn chốt trong 7 ngày tới, tô đỏ dòng đến hạn hôm nay.
- **Hồ sơ và Tư vấn KHÔNG có nút Xóa hẳn** (PM xác nhận) — chỉ đổi Trạng thái sang "Hủy" để ẩn khỏi danh sách hoạt động, giữ lại lịch sử để đối chiếu doanh thu/lợi nhuận sau này. KHÔNG code chức năng `DELETE` cho 2 bảng `ho_so` và `leads`.
- **Trạng thái "Xử lý phát sinh" có 4 giá trị** (PM tự chốt, thay cho đề xuất "Chưa xử lý/Đã xử lý" ban đầu của Claude): **Đang xử lý / Hủy / Tạm dừng / Hoàn thành**, mặc định "Đang xử lý" khi tạo.
- **"Quá hạn" trên Dashboard chỉ tính khi Trạng thái = "Đang xử lý"** (PM xác nhận) — dòng nào Hủy/Tạm dừng/Hoàn thành thì dù quá hạn cũng KHÔNG hiển thị cảnh báo.
- **Danh mục Trưởng nhóm: "Ms. Quỳnh Vi/ Hoanh/ Phuc Trang" là 1 người** (nhiều tên gọi), KHÔNG phải 3 người — SQL seed data đã gộp lại thành 1 dòng duy nhất.
- **Màn Tư vấn: "Nước đến" và "Mục đích" tách thành 2 field riêng, dạng dropdown chọn từ danh mục, bắt buộc** (PM xác nhận, đổi từ 1 field chữ tự do gộp chung ban đầu). Lưu ý: đây là ràng buộc **bắt buộc ở UI (JS validate trong admin.html)**, KHÔNG phải `NOT NULL` ở CSDL — vì cột `country`/`muc_dich` trong bảng `leads` còn được form đăng ký công khai trên `index.html` ghi vào, không được đặt NOT NULL kẻo gãy form đó.
- **Tính năng mới: "Chốt tư vấn → tạo Hồ sơ"** — xem chi tiết mục 5.1 bên dưới.
- **Tính năng mới: Hồ sơ nhóm nhiều khách + Số lượng nhân chi phí** (PM yêu cầu bổ sung) — xem chi tiết mục 4.1 bên dưới. Tóm tắt: 1 hồ sơ có thể có nhiều khách đi cùng (bảng con `ho_so_thanh_vien`), "Số lượng" tự động = 1 + số thành viên (trigger, KHÔNG nhập tay), và "Chi — Phí lãnh sự" + "Chi — Đại lý/CTV" là ĐƠN GIÁ/NGƯỜI, được nhân với Số lượng khi tính Tổng chi. Phần Thu và 3 khoản Chi còn lại (Thư đi/Thư về/Phí khác) KHÔNG nhân — xem câu hỏi rủi ro ở mục 6.

### 3.1 Tổng hợp quyền Thêm/Sửa/Xóa theo từng màn hình

| Màn hình | Thêm | Sửa | Xóa |
|---|---|---|---|
| Hồ sơ | Có | Có | **Không** — đổi Trạng thái = Hủy thay vì xóa |
| Tư vấn | Có | Có | **Không** — đổi Trạng thái = Hủy thay vì xóa |
| Đại lý ủy thác | Có | Có | Bị chặn bởi CSDL (`on delete restrict`) nếu đại lý đang có hồ sơ tham chiếu — dùng "Ngừng hợp tác" thay vì xóa |
| Bảng phí đại lý (con) | Có (thêm dòng phí mới khi đổi giá) | — | Không — giữ lại dòng phí cũ để tính đúng lợi nhuận hồ sơ cũ |
| Cài đặt chung (danh mục) | Có | Có | Không — chỉ "Ẩn" (`active = false`), không xóa hẳn để không vỡ dữ liệu Hồ sơ đang tham chiếu |
| Dashboard | — | — | — (màn hình chỉ xem, không có thao tác Thêm/Sửa/Xóa) |

## 4. Field chính — Hồ sơ (bảng `ho_so`)

| Field | Cột CSDL | Bắt buộc | Ghi chú |
|---|---|---|---|
| Ngày | `ngay` | Có | mặc định hôm nay |
| Trưởng nhóm | `truong_nhom_id` | Không | chọn từ danh mục — TÊN NGƯỜI, khác Đại lý ủy thác |
| Tên khách hàng | `ten_khach` | Có | |
| Số ĐT khách | `sdt_khach` | Không | |
| Địa chỉ | `dia_chi` | Không | |
| Nước đến | `nuoc_id` | Có | chọn từ danh mục |
| Mục đích | `muc_dich_id` | Có | chọn từ danh mục |
| **Đại lý ủy thác** | `doi_tac_id` | **Có** | hiển thị "Tên người đảm nhiệm (Công ty)" |
| Số lượng | `so_luong` | Tự động | = 1 + số dòng trong bảng con Thành viên nhóm — cập nhật bằng trigger, readonly trên UI, xem mục 4.1 |
| Thu: Lệ phí / In ảnh / Hỗ trợ khác | `thu_le_phi`, `thu_in_anh`, `thu_ho_tro_khac` | Không | KHÔNG nhân theo Số lượng |
| Chi: Lãnh sự / Đại lý-CTV | `chi_le_phi_lanh_su`, `chi_doi_tac_ctv` | Không | **Đơn giá/người** — nhân với `so_luong` khi tính Tổng chi, xem mục 4.1 |
| Chi: Thư đi / Thư về / Phí khác | `chi_thu_di`, `chi_thu_ve`, `chi_phi_khac` | Không | KHÔNG nhân theo Số lượng, tính chung cho cả hồ sơ |
| Tổng thu / Tổng chi / Lợi nhuận | `tong_thu`, `tong_chi`, `loi_nhuan` | Tự động | generated column, KHÔNG ghi từ JS — Tổng chi đã gồm phép nhân Số lượng |
| Ngày nộp / Ngày trả KQ | `ngay_nop`, `ngay_tra_kq` | Không | |
| Trạng thái | `trang_thai` | Có | Đang xử lý/Đã nộp/Chờ kết quả/Đậu/Rớt/Hủy |
| Note | `note` | Không | có thể ghi mã diện visa chi tiết (F1-5, C3-1...) |
| Nguồn từ Tư vấn | `nguon_tu_van_id` | Không | FK → `leads.id`, chỉ có giá trị nếu hồ sơ được tạo từ luồng "Chốt tư vấn" ở mục 5.1 — ĐỀ XUẤT THÊM |

Bảng con `ho_so_xu_ly_phat_sinh` (1-nhiều theo `ho_so_id`): Nội dung, Hạn chốt, Ghi chú, **Trạng thái: Đang xử lý / Hủy / Tạm dừng / Hoàn thành** (PM tự chốt 4 giá trị này). "Quá hạn" trên Dashboard chỉ tính dòng đang ở "Đang xử lý".

### 4.1 Tính năng mới: Hồ sơ nhóm nhiều khách + Số lượng nhân chi phí (PM yêu cầu bổ sung)

- **Bảng con mới `ho_so_thanh_vien`** (1-nhiều theo `ho_so_id`): Tên, SĐT, Ghi chú — dùng cho các khách ĐI CÙNG khách chính (khách chính vẫn là `ten_khach`/`sdt_khach` sẵn có trên `ho_so`, không đổi). Modal Hồ sơ thêm 1 bảng con nữa (giống cách làm với "Xử lý phát sinh") để thêm/sửa/xoá từng thành viên.
- **`so_luong` tự động** = 1 (khách chính) + COUNT(`ho_so_thanh_vien` của hồ sơ đó) — duy trì bằng **trigger CSDL** (`fn_cap_nhat_so_luong_ho_so` trong `supabase_setup_phase2.sql`), KHÔNG để nhân viên nhập tay, tránh lệch số nếu quên cập nhật. UI hiển thị readonly, tự refresh mỗi khi thêm/xoá 1 dòng thành viên.
- **Nhân chi phí theo Số lượng**: PM yêu cầu "Chi — Phí lãnh sự" và "Chi — Đại lý/CTV" tính lên theo số lượng người. Claude hiểu đây là 2 field **đơn giá/người** — nhân viên vẫn nhập 1 số duy nhất (giá cho 1 người), hệ thống tự nhân với `so_luong` khi tính Tổng chi (đã sửa `generated column` trong SQL). Cần đổi **label hiển thị trên UI** thành "Chi — Phí lãnh sự (đơn giá/người)" và "Chi — Đại lý/CTV (đơn giá/người)" để nhân viên không hiểu nhầm là tổng.
- **3 khoản Chi còn lại (Thư đi/Thư về/Phí khác) và toàn bộ 3 khoản Thu KHÔNG nhân** — giữ nguyên như 1 khoản chung cho cả hồ sơ, không phụ thuộc số người. Đây là điều PM chỉ định rõ (chỉ 2 khoản Chi nêu trên), Claude KHÔNG tự suy rộng ra các field khác.

## 5. Field chính — Tư vấn (mở rộng bảng `leads` có sẵn, KHÔNG tạo bảng mới)

`name`, `phone` (đã có) + thêm `email`, `link_fb`, `muc_dich`, `ngay_nhac_lai`.
`status` (đã có: Mới/Đã gọi/Chốt/Hủy) dùng làm trạng thái tư vấn. `note` (đã có) dùng làm nội dung tư vấn.
`country` (đã có) dùng làm nước đến.

**Nước đến (`country`) và Mục đích (`muc_dich`)**: hiển thị trên UI dạng **dropdown bắt buộc**, chọn từ cùng danh mục `danh_muc_nuoc` / `danh_muc_muc_dich` dùng ở màn Hồ sơ (PM xác nhận, đổi từ 1 field chữ tự do gộp chung ban đầu). Cột CSDL vẫn là `text`, không đổi sang FK, không đặt NOT NULL (lý do: bảng `leads` còn được form công khai trên `index.html` ghi vào).

### 5.1 Luồng mới: "Chốt tư vấn → tạo Hồ sơ" (PM yêu cầu bổ sung)

Khi nhân viên lưu 1 dòng Tư vấn với **Trạng thái tư vấn = "Chốt"**:

1. Hiện popup xác nhận: *"Hồ sơ này đã chốt, Chị Hiền muốn thêm thông tin này vào hồ sơ xử lý không?"*
2. Bấm **"Đồng ý"** → lưu dòng Tư vấn xong, điều hướng sang tab Hồ sơ, mở form tạo mới đã **pre-fill**: Tên khách hàng (← `name`), Số ĐT (← `phone`), Nước đến (← `country`), Mục đích (← `muc_dich`), Note (← `note`), và gán `nguon_tu_van_id` = id dòng Tư vấn này. **Đại lý ủy thác không pre-fill được** (Tư vấn không thu thập field này) — nhân viên phải tự chọn vì đây là field bắt buộc ở Hồ sơ. Người dùng vẫn phải bấm Lưu ở form Hồ sơ để hoàn tất tạo record (không tự động tạo ngầm).
3. Bấm **"Không cần"** → chỉ lưu dòng Tư vấn, ở lại màn Tư vấn, không điều hướng.

**PM xác nhận: popup này hiện MỖI LẦN lưu 1 dòng đang ở Trạng thái = "Chốt"** — kể cả khi dòng đó đã là "Chốt" từ trước và nhân viên chỉ sửa/lưu lại (không chỉ riêng lần đầu chuyển sang Chốt). Không cần cờ theo dõi "đã hỏi lần nào chưa".

## 6. Câu hỏi CÒN MỞ — cần xác nhận khi code

1. **[Ưu tiên Trung bình] Thu không tăng theo Số lượng, chỉ 2 khoản Chi tăng** — với hồ sơ nhóm 2-3 người: Chi phí lãnh sự + Chi đại lý/CTV nhân theo số người, nhưng Thu — Lệ phí (và In ảnh, Hỗ trợ khác) vẫn giữ nguyên 1 mức không đổi. Kết quả: Lợi nhuận/hồ sơ nhóm có thể giảm mạnh, thậm chí âm, so với hồ sơ 1 người, nếu nhân viên quên tăng Lệ phí thu tương ứng khi nhận hồ sơ nhóm. Claude KHÔNG tự ý thêm multiplier cho Thu vì PM không yêu cầu — chỉ nêu ra để PM biết trước khi dùng thật, không chặn việc code (đây là hành vi tính toán đúng theo yêu cầu, không phải lỗi kỹ thuật).

## 7. Nguồn tham khảo đầy đủ

| File | Nội dung |
|---|---|
| `04_Phase 2/Phase2_Dac_ta.xlsx` | Đặc tả field đầy đủ từng màn hình (sheet 1-5), đánh giá hệ thống + chi phí (sheet 6) — **nguồn sự thật cho mọi quyết định**, mục 3-6 ở trên đã tóm tắt các điểm quan trọng nhất |
| `04_Phase 2/supabase_setup_phase2.sql` | Migration CSDL đầy đủ — bảng, RLS, view. Đọc comment ⚠️ trong file trước khi chạy |
| `04_Phase 2/Phase2_Thiet_ke_DB_va_Man_hinh.md` | ERD Mermaid + mô tả wireframe từng màn hình (Figma chưa kết nối nên chưa có mockup thật) |
| `04_Phase 2/Noi dung chinh.md` | Yêu cầu gốc ban đầu của PM (trước khi qua vòng rà soát/confirm) |
| `04_Phase 2/Quan Ly Khach Hang.xlsx` | Dữ liệu Excel thật PM đang dùng thủ công — tham khảo khi cần hiểu ngữ cảnh nghiệp vụ, KHÔNG cần import dữ liệu này vào CSDL trừ khi PM yêu cầu riêng |

## 8. Checklist test tối thiểu trước khi báo hoàn thành

- [ ] Migration SQL chạy lại lần 2 không lỗi (idempotent).
- [ ] Tạo 1 Đại lý ủy thác + 1 mức phí → tạo 1 Hồ sơ chọn đại lý đó → Tổng thu/Tổng chi/Lợi nhuận tự tính đúng.
- [ ] Không chọn Đại lý ủy thác khi tạo Hồ sơ → hệ thống báo lỗi bắt buộc (không cho lưu).
- [ ] Thêm 1 dòng "Xử lý phát sinh" với Hạn chốt = hôm nay → xuất hiện tô đỏ ở Dashboard.
- [ ] Thêm 1 dòng Tư vấn với Ngày nhắc lại trong 3 ngày tới → xuất hiện ở Dashboard mục nhắc lại.
- [ ] Xoá thử 1 Đại lý ủy thác đang có Hồ sơ tham chiếu → bị chặn (do `on delete restrict`), không xoá được.
- [ ] Màn Hồ sơ và Tư vấn KHÔNG có nút Xóa hẳn ở giao diện — chỉ có nút đổi Trạng thái sang Hủy.
- [ ] Thêm 1 dòng "Xử lý phát sinh" với Hạn chốt = hôm qua (quá hạn) + Trạng thái = "Tạm dừng" → KHÔNG xuất hiện cảnh báo ở Dashboard (chỉ "Đang xử lý" mới tính quá hạn).
- [ ] Đổi Trạng thái tư vấn sang "Chốt" và Lưu → hiện popup xác nhận đúng nội dung; bấm "Đồng ý" → sang tab Hồ sơ với form tạo mới đã pre-fill đúng Tên/SĐT/Nước đến/Mục đích/Note; bấm "Không cần" → chỉ lưu, ở lại Tư vấn.
- [ ] Danh mục Trưởng nhóm chỉ có 1 dòng "Ms. Quỳnh Vi / Hoanh / Phuc Trang" (không phải 3 dòng riêng).
- [ ] Thêm 2 thành viên nhóm vào 1 hồ sơ → `so_luong` tự động thành 3 (không cần nhập tay); xoá 1 thành viên → `so_luong` tự giảm về 2.
- [ ] Hồ sơ có `so_luong = 3`, Chi phí lãnh sự nhập 1.000.000 → Tổng chi phải cộng đúng 3.000.000 cho khoản này (không phải 1.000.000).
- [ ] Xoá 1 Hồ sơ có thành viên nhóm (chỉ đổi Trạng thái = Hủy theo mục 3, không xoá thật) → dữ liệu thành viên vẫn giữ nguyên, không mất.
- [ ] Landing page (`index.html`) vẫn hoạt động bình thường, form gửi lead vẫn thành công (không bị ảnh hưởng bởi cột mới thêm vào `leads`).
- [ ] Không còn `[THAY_THẾ]` hay dữ liệu giả nào bị lộ ra ngoài giao diện public.

## 9. Cập nhật (2026-08) — Sửa dialog Hồ sơ theo thiết kế Figma

Theo yêu cầu bổ sung của PM, đã sửa `admin.html` (chưa chạm `index.html`):

- **Bố cục dialog "Đăng ký hồ sơ mới"**: viết lại theo file thiết kế `01_Design/Dialog_Tao_moi_ho_so.png` + Figma (node `296:2220`) — header (tiêu đề + nút X) và footer (nút Đóng lại/Lưu hồ sơ) cố định, phần dữ liệu ở giữa cuộn riêng. Các nhóm field có khung nền xanh nhạt + vạch xanh bên trái, giống Figma.
- **Đổi tên "Trưởng nhóm" → "Đối tác"** trên toàn bộ giao diện (label ở dialog Hồ sơ + tên khối ở tab Cài đặt chung). Tên bảng/cột kỹ thuật GIỮ NGUYÊN `danh_muc_truong_nhom`/`truong_nhom_id` (không đổi FK) — lưu ý: field này **khác** "Đại lý ủy thác" (`doi_tac`), dù tên khá giống nhau, PM đã xác nhận chấp nhận điều này.
- **Phần Chi**: bỏ field "Thư đi" khỏi giao diện (cột `chi_thu_di` trong CSDL vẫn giữ để không mất dữ liệu hồ sơ cũ, chỉ không cho nhập mới nữa); đổi tên "Thư về" → **"Phí ship"** (vẫn là cột `chi_thu_ve`, không đổi tên cột).
- **Phần Thu**: thêm field mới **"Khách tip"** (cột `thu_khach_tip`, KHÔNG nhân theo Số lượng, giống các khoản Thu khác) — đã cập nhật `supabase_setup_phase2.sql` mục C.1 (thêm cột + sửa lại `tong_thu`/`loi_nhuan`).
- **"Số lượng hồ sơ"**: cho phép nhân viên sửa tay (trước đây chỉ đọc). Tuy nhiên mỗi khi thêm/xoá 1 dòng trong "Thành viên nhóm", hệ thống vẫn tự tính lại theo đúng số thành viên và **đè lên** số đã sửa tay trước đó (PM xác nhận chọn phương án này) — trigger CSDL `fn_cap_nhat_so_luong_ho_so` không đổi.
- **Các ô tiền** (Thu/Chi) đổi sang canh phải + tự hiện dấu "." phân cách nghìn khi nhập (hàm `onMoneyInput`/`formatMoney`/`unformatMoney` trong `admin.html`).
- Đã chạy thử trực tiếp trên trình duyệt (mở form tạo mới, gõ số tiền, đổi Số lượng, đổi Trạng thái) để xác nhận tính đúng — **chưa test lại với dữ liệu Supabase thật** (sửa/xoá thành viên nhóm, lưu hồ sơ thật) vì phiên làm việc không có tài khoản đăng nhập.
