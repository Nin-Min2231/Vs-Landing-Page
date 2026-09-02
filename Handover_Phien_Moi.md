# Handover — Bàn giao sang phiên làm việc mới (2026-09-02, bản 17 — GHI ĐÈ toàn bộ bản cũ)

> File này **GHI ĐÈ HOÀN TOÀN** mọi bản handover cũ (bản 1→16) — **không cần đọc lại bản cũ**, nội
> dung quan trọng còn giá trị đã gom hết vào đây. Đọc theo đúng thứ tự: `CLAUDE.md` (toàn bộ, đặc
> biệt mục 49→60) → file này → `10_SEO/11_Ke_hoach_sau_xac_nhan.md` mục 0 (8 ràng buộc) → bắt tay
> vào việc tiếp theo ở **mục 2** dưới đây.

## 0. Trạng thái ngay lúc viết file này

**Kế hoạch SEO (`10_SEO/11_Ke_hoach_sau_xac_nhan.md`) KHÔNG có gì mới so với bản 16** — phiên này
KHÔNG làm thêm task nào trong `10_SEO/`. Toàn bộ phiên này (2026-09-02, cùng ngày với T3-T16 ở bản
16) dành để xử lý **7 lỗi/thiếu sót PM tự phát hiện khi bấm thử trực tiếp trên production**, báo
lại lần lượt và được sửa+deploy ngay từng lỗi một (không phải task trong kế hoạch SEO) — xem đầy đủ
kỹ thuật ở **CLAUDE.md mục 60**. Tóm tắt 7 lỗi đã sửa:

| # | Lỗi PM báo | Tóm tắt sửa |
|---|---|---|
| A | Card bài viết trang chủ bị gạch chân thừa | Thêm `text-decoration:none` cho `.card-post` |
| B | 3 trang pháp lý (T11) menu "cũ", thiếu 2 mục Danh mục bài viết | Sửa link `#x`→`/#x`, copy thêm JS dựng menu động |
| C | 3 trang pháp lý thiếu hẳn nút liên hệ nổi + Chat Box | Thêm HTML+JS còn thiếu (CSS đã có sẵn từ T11 nhưng chưa từng dùng) |
| D | Icon Chat Box bị nút "Facebook" đè lên khi xoè liên hệ nổi | Đẩy icon Chat Box lên trên "Gọi điện" thay vì ẩn (đo `offsetHeight` thật, không hardcode) |
| E | Thiếu link "Liên hệ" tiện thao tác | Thêm cả ở footer (heading cột giữa) lẫn menu chính (sau FAQ) |
| F | Thêm mục E xong → **cả menu vỡ dòng** ở khổ desktop hẹp (~800-1150px) | Tách ngưỡng hamburger riêng cho navbar (1099px thay vì 767px) + giảm gap/cỡ chữ |
| G | Bấm "Đăng ký tư vấn miễn phí" ở `/lien-he` cuộn sai vị trí (trượt tới đáy trang) | Xoá `#hash` khỏi URL lúc đầu (chặn cuộn tự động của trình duyệt) + tự cuộn lại bằng JS `behavior:'instant'` sau khi nội dung động tải xong |

**Tất cả 7 lỗi đã deploy + xác nhận trên production** (đo bằng `getBoundingClientRect()`/ảnh chụp
màn hình thật, không chỉ đọc code) — xem chi tiết từng lỗi + bài học kỹ thuật ở CLAUDE.md mục 60,
**đặc biệt lỗi G (khó nhất, sửa qua 4 lượt)** và ghi chú về độ tin cậy thấp của
`Element.scrollIntoView()` gọi qua công cụ test khi debug lại loại lỗi cuộn trang trong tương lai.

## 1. Cấu trúc file — không đổi so với bản 16

`02_Source/public/` vẫn là thư mục DUY NHẤT được `[assets]` phục vụ ra Internet; `worker.js`/
`wrangler.toml`/`package.json` vẫn ở gốc `02_Source/`, không public — xem CLAUDE.md mục 4 + 52.
Phiên này KHÔNG thêm/xoá file nào, chỉ sửa nội dung `index.html` + 3 trang pháp lý.

## 2. Việc tiếp theo — GIỐNG HỆT bản 16, chưa có gì thay đổi

**Không còn task nào "làm ngay không chờ ai" trong danh sách D1 của kế hoạch SEO.** Trước khi bắt
đầu bất kỳ việc gì, hỏi người dùng muốn cấp thông tin cho nhóm nào trước:

**Chờ PM cấp thông tin:**
| Task | Cần gì | Thời gian |
|---|---|---|
| T8 | GA4 Measurement ID (`G-XXXXXXX`) | 15 phút (Phần B kế hoạch) |
| T10 | Giờ làm việc + toạ độ lat/long từ Google Business Profile | 10 phút |
| T12 | Page-id Facebook (cho link `m.me/...` nút nổi) | 5 phút |
| T19 | Tài khoản Brevo + API key (email tự động sau khi khách gửi form) | 15 phút |
| T20 | Tên + chức danh + số năm KN của 1-2 chuyên viên (và họ đồng ý công khai) | 5 phút |
| T22b | Duyệt câu chữ banner cookie (nên hỏi người có chuyên môn pháp lý) | 15 phút |
| T25/T26/T27 | Nghĩa vụ pháp lý BVDLCN, mốc ĐKKD — T27 (region Supabase) **đã trả lời: ngoài VN**, còn T25/T26 | — |

**Chờ chuyên viên visa cấp nội dung (Claude Code TUYỆT ĐỐI không tự viết thay):**
| Task | Cần gì |
|---|---|
| T14 | Nội dung chuyên môn 1.200-2.000 từ/nước cho ít nhất 1 trong 7 trang quốc gia (bảng `noi_dung_quoc_gia` đã sẵn sàng nhận qua admin, đã có 1 dòng TEST do PM tự nhập — CHƯA phải nội dung thật, xem CLAUDE.md mục 58) |
| T15/T17 | Checklist giấy tờ theo nước × mục đích (bảng `checklist_items`, dùng chung cho cả 2 công cụ) |
| T18 | Xác nhận thời gian xử lý 2026 cho 7 nước + bổ sung Mỹ/Úc (hiện FAQ chỉ có 4 nước) |

**T11b** (trang `gioi-thieu.html`) chờ PM cấp nội dung câu chuyện công ty + ảnh đội ngũ/văn phòng.

**Gợi ý thứ tự nếu PM/chuyên viên cấp được nhiều thứ cùng lúc:** T20 (5 phút, mở khoá byline cho cả
T14 lẫn bài viết) → T8/T10/T12 (đều nhanh, không phụ thuộc nhau) → T14 (việc lớn nhất còn lại, cần
chuyên viên) → T15/T17/T18.

## 3. ⚠️ Bài học kỹ thuật quan trọng — áp dụng cho MỌI trang/route mới sau này

**A-D — giữ nguyên từ bản 16 (chưa lỗi thời):**
- Cloudflare Static Assets tự 307-redirect MỌI file `.html` sang bản không đuôi — canonical + mọi
  link nội bộ trang mới PHẢI dùng path không đuôi; dò tồn tại file tĩnh bằng `env.ASSETS.fetch()`
  phải dò path không đuôi (dò bằng `.html` luôn ra 307, không phải 2xx).
- Route SSR không có file tĩnh dự phòng PHẢI nhận cả `GET` lẫn `HEAD` (bài học T4/T21, `curl -I`
  sẽ ra 404 nếu quên dù `curl` thường vẫn đúng).
- Poll `curl` sau khi deploy — điều kiện dừng vòng lặp PHẢI phân biệt được bản MỚI với bản CŨ
  (đừng dùng điều kiện mà cả 2 bản đều thoả, vd "thấy `<urlset>`" — dùng chuỗi CHỈ CÓ ở bản mới).
- Thiết kế "tự động nhận diện, không cần sửa lại file" (trang 404, sitemap dò trang tin cậy/trang
  quốc gia qua `try/catch`) tiếp tục hiệu quả — nhưng xem mục E dưới đây, thiết kế này có 1 GIỚI
  HẠN quan trọng cần biết khi áp dụng cho FILE TĨNH (khác route động).

**E. ⭐ (MỚI, quan trọng) — 3 trang pháp lý (T11) là bản snapshot TĨNH, KHÔNG tự đồng bộ với
`index.html` như `/blog`/404:** khác với `/blog`/`/blog/<slug>`/404 (SSR qua `worker.js`, dùng
`getSiteChrome()` trích navbar/footer/CSS trực tiếp từ `index.html` lúc mỗi request nên LUÔN khớp
100%), 3 file `chinh-sach-bao-mat.html`/`dieu-khoan-dich-vu.html`/`lien-he.html` là file `.html`
tĩnh dựng 1 LẦN bằng script Node lúc làm T11 — mọi thay đổi SAU ĐÓ ở navbar/footer/nút liên hệ
nổi/Chat Box của `index.html` **KHÔNG tự động lan sang 3 file này**. Phiên này đã phải sửa lại thủ
công 2 lần (mục B, C ở CLAUDE.md mục 60) vì y hệt lý do này. **Quy tắc bắt buộc từ nay: mỗi khi sửa
navbar/footer/widget nổi (`.float-contact`/`.chatbox-*`) ở `index.html`, PHẢI tự kiểm tra và đồng
bộ lại cả 3 file này bằng tay** — không có cảnh báo tự động nào báo hiệu chúng bị lệch, chỉ phát
hiện được khi PM tự bấm thử hoặc grep thủ công so sánh. Nếu việc đồng bộ thủ công này còn tái diễn
nhiều lần nữa, cân nhắc đề xuất PM chuyển 3 trang này sang SSR qua `worker.js` (như `/blog`/404) —
đánh đổi mất tính đơn giản "1 file HTML" nhưng hết hẳn rủi ro lệch, KHÔNG tự ý đổi nếu PM chưa đồng
ý (thay đổi kiến trúc, không phải sửa lỗi nhỏ).

**F. ⭐ (MỚI) — Navbar nhiều mục (≥7-8 mục + CTA) cần ngưỡng "chuyển sang hamburger" RIÊNG, rộng
hơn hẳn ngưỡng layout mobile chung:** đừng dùng chung 1 `@media(max-width:767px)` cho cả "navbar
co lại thành hamburger" LẪN "layout hero/grid/footer đổi sang 1 cột" — 2 nhu cầu này có ngưỡng an
toàn khác nhau hẳn (navbar nhiều mục cần rộng hơn NHIỀU mới đủ chỗ hiển thị ngang, trong khi
hero/grid/footer đổi cột chỉ cần ngưỡng hẹp mobile thật sự). Tách riêng
`@media(max-width:1099px){.hamburger{display:block}...}` cho navbar, giữ nguyên
`@media(max-width:767px)` cho phần còn lại — tránh vừa phải nới rộng ngưỡng navbar (an toàn hơn)
vừa không kéo theo đổi layout khác ở khổ 768-1099px ngoài ý muốn. Nếu sau này thêm mục menu mới
(vd Danh mục bài viết thứ 3, 4...) làm menu lại gần chật, kiểm tra lại đúng cách này (đo tổng bề
rộng tự nhiên các mục ở khổ container tối đa 1200px, so với khoảng dư còn lại) trước khi coi là ổn.

**G. ⭐ (MỚI, quan trọng nhất) — Cuộn tới `#hash` lúc TẢI TRANG (không phải lúc bấm menu cùng
trang) có thể trượt sai vị trí nếu trang có nội dung chèn ĐỘNG làm tăng chiều cao sau khi tải:**
nếu trang có `html{scroll-behavior:smooth}` (dự án này có, dùng cho UX menu) VÀ có bất kỳ script
nào chèn thêm nội dung (section/slide mới) SAU KHI tải xong làm trang cao thêm, cú cuộn-tới-anchor
TỰ ĐỘNG của trình duyệt lúc tải trang (từ URL có `#hash`, vd link từ trang khác trỏ tới) có thể
"đuổi theo" đích đang dịch chuyển và trượt quá đà — không chỉ lệch vài chục px mà có thể trượt hẳn
tới cuối trang. Cách sửa CHUẨN đã áp dụng (xem `fixInitialHashScroll()` trong `index.html`):
1. Script NGAY ĐẦU `<head>` tự xoá `#hash` khỏi URL (`history.replaceState`, giữ giá trị gốc ở 1
   biến `window.__xxx__`) — chặn HẲN cú cuộn tự động của trình duyệt (chỉ tắt animation/đổi
   `scroll-behavior` KHÔNG ĐỦ, đã tự kiểm chứng — phải loại hẳn nguồn cuộn cạnh tranh).
2. Sau khi MỌI nội dung chèn động (ảnh hưởng chiều cao) đã tải xong (gọi trong `finally` của từng
   khối async, dù thành công/lỗi/rỗng đều gọi), tự cuộn lại bằng JS dùng biến đã lưu ở bước 1.
3. Cú cuộn ở bước 2 BẮT BUỘC `scrollIntoView({behavior:'instant'})` — KHÔNG để mặc định `smooth`
   nếu hàm có thể bị gọi NHIỀU LẦN (1 lần/khối chèn động) — đúng nguyên tắc đã có sẵn trong chính
   file này ở `initScrollLock()` (mục 46.B) nhưng ban đầu quên áp dụng lại cho trường hợp mới.
Nếu sau này thêm 1 khối chèn động MỚI có khả năng ảnh hưởng chiều cao trang (section/slide/banner
mới), nhớ thêm `finally{ fixInitialHashScroll(); }` vào khối đó — hàm đã viết sẵn, dùng lại được.

## 4. Cách đã test/xác nhận (giữ nguyên quy trình bản 16, thêm 1 lưu ý MỚI quan trọng)

- **worker.js:** viết xong → `node --check` → viết script Node import thẳng `worker.js` thật, mock
  `env.ASSETS.fetch`/`global.fetch`, dùng dữ liệu thật qua REST API khi cần.
- **Trang tĩnh/`index.html`:** `node --check` (script trích qua regex) + `python3 html.parser`
  (cân bằng thẻ) trước mỗi lần deploy — không có ngoại lệ.
- **Sau khi deploy:** poll `curl` bằng điều kiện phân biệt bản mới/cũ (mục 3 bản 16), rồi hồi quy
  đầy đủ (an ninh `/worker.js`.../404, redirect `workers.dev`, `/api/chat`, giá SSR, favicon, 404,
  sitemap, `/blog`).
- **⚠️ MỚI — độ tin cậy của Claude Browser khi test hành vi CUỘN TRANG (`scrollY`/`scrollIntoView`)
  RẤT THẤP, thấp hơn hẳn các hành vi khác (click, form_input, đọc DOM) đã dùng ổn định trong các
  phiên trước:** phiên này đo `scrollY` qua `javascript_tool` cho kết quả THẤT THƯỜNG rõ rệt — cùng
  1 đoạn code, test lại nhiều lần trên nhiều tab cho ra `scrollY` khác nhau hẳn (0, giá trị đúng,
  hoặc giá trị max/đáy trang), kể cả khi gọi `element.scrollIntoView()` TRỰC TIẾP qua
  `javascript_tool` (không qua code của trang) — nhiều lần hoàn toàn không có tác dụng gì. Đã tách
  bạch được đây là **nhiễu thật của công cụ test** (không phải ảo giác) bằng cách so sánh với 1
  trang ngoài hoàn toàn không liên quan (Wikipedia, cuộn tới `#hash`) — Wikipedia cuộn đúng ổn định,
  chứng minh công cụ vẫn xử lý `#hash` được trong trường hợp đơn giản, nên các bất thường gặp ở
  site này là tín hiệu thật cần sửa (không phải lỗi công cụ 100%) — NHƯNG kết quả ĐO qua công cụ
  vẫn nhiễu nặng, không nên tin ngay 1 lần đo. **Quy tắc rút ra: khi debug lại loại lỗi cuộn trang
  sau này, LUÔN mở tab HOÀN TOÀN MỚI trước khi kết luận (đóng tab cũ dùng nhiều lần trong phiên,
  tab cũ có xu hướng "hỏng" theo thời gian), và ưu tiên bấm bằng toạ độ pixel thật qua `computer`
  tool hơn là gọi hàm JS qua `javascript_tool`** — cách đầu phản ánh đúng hành vi người dùng thật
  và cho kết quả ổn định hơn hẳn trong phiên này (bằng chứng cuối cùng, đáng tin nhất, đến từ đúng
  luồng bấm nút thật qua `computer` tool trên trang `/lien-he`, không phải gọi hàm JS giả lập).

## 5. Quy trình deploy (không đổi)

`git push` thẳng `main` → Cloudflare tự deploy (~15-30 giây, đôi khi lâu hơn ~1 phút trong phiên
này, kiên nhẫn poll thêm trước khi nghi ngờ deploy thất bại). Migration SQL: Claude Code không có
quyền chạy trực tiếp trên Supabase — viết file trong `05_Database/`, PM tự chạy trong SQL Editor,
phải tự xác nhận PM đã chạy xong trước khi build route phụ thuộc cột/bảng mới.

## 6. Tài liệu tham khảo

`CLAUDE.md` mục 49→59 (kế hoạch SEO, xem bản 16 cũ nếu cần chi tiết từng task) → **mục 60 (MỚI,
đọc kỹ trước khi sửa navbar/footer/widget nổi hoặc bất kỳ trang nào có cuộn-tới-anchor)** →
`10_SEO/11_Ke_hoach_sau_xac_nhan.md` (spec đầy đủ các task còn lại, đọc mục 0 trước mỗi task, nhớ
cộng `public/` vào đường dẫn cũ — xem CLAUDE.md mục 1) → `10_SEO/12_Thu_tu_thuc_hien.xlsx` (thứ tự
20 bước) → `10_SEO/13_Prompt_Claude_Code.md` (prompt mẫu nếu PM dùng) → file này.
