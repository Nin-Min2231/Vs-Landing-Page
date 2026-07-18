# 09. Thư viện Nội dung Facebook & Spec Tính năng "Trang Blog công khai"

> Tài liệu này CHỈ mô tả nội dung + yêu cầu chức năng. Không kèm code — Claude Code sẽ đọc tài liệu này để triển khai ở phiên làm việc riêng.

| Mục | Nội dung |
|---|---|
| Nguồn dữ liệu | Facebook: "Chuyên Visa Nhật Bản - toàn quốc" (trang công ty) |
| Ngày khảo sát | 2026-07-18 |
| Người khảo sát | Claude (Cowork), duyệt trực tiếp qua trình duyệt đã đăng nhập sẵn của bạn |
| Trang đã xem nhưng không dùng | Facebook cá nhân "Aki Hiền" (tư vấn viên) — chỉ có nội dung đời sống cá nhân, không liên quan dịch vụ, không phù hợp làm nội dung công khai |

## 1. Kiểm kê nội dung đã thu thập trên trang Facebook công ty

| # | Loại nội dung | Tóm tắt (đã diễn giải lại) | Ngày gốc | Đề xuất dùng cho | Trạng thái ảnh |
|---|---|---|---|---|---|
| 1 | Đánh giá khách hàng thật | 2 đánh giá "đề xuất" (recommend) từ khách: 1 khách khen thủ tục nhanh gọn, dịch vụ tốt; 1 khách khen nhân viên nhiệt tình, giải đáp tận tình, ra visa nhanh | 06/2022, 08/2025 | ✅ Đã đưa vào slider "Khách hàng nói gì" trên `index.html` (hoàn tất) | Không có ảnh kèm theo |
| 2 | Album "Khám phá Nhật Bản" | Bộ ảnh phong cảnh Nhật Bản (núi Phú Sĩ, phố Shibuya/Dotonbori về đêm, chùa cổ, mùa lá đỏ) kèm caption ngắn truyền cảm hứng du lịch | 07/07 (năm gần đây) | Ảnh minh họa cho bài blog truyền cảm hứng / banner mạng xã hội | ⚠️ Nghi ảnh sưu tầm/stock — xem mục Rà soát #1 |
| 3 | Bài "VISA NHẬT BẢN – CHẠM TAY ĐẾN XỨ SỞ MẶT TRỜI MỌC" | Bài giới thiệu dịch vụ theo hướng cảm xúc, có gắn nhãn "Nội dung do AI tạo" | Gần đây | Có thể viết lại bản chuẩn hơn cho blog (xem mục 2, bài #2) | Ảnh minh họa tương tự mục 2 |
| 4 | Bài hỏi mở "Bạn đang dự định du lịch, thăm người thân hay công tác tại Nhật Bản, nhưng chưa biết bắt đầu từ đâu?" | Bài dạng câu hỏi mở, dẫn dắt vào dịch vụ tư vấn | Gần đây | Ý tưởng cho bài blog dạng "Hướng dẫn cho người mới bắt đầu" (xem mục 2, bài #1) | — |
| 5 | Album "Visa khách iu" | Ảnh chụp visa/hộ chiếu đã đậu, có che thông tin cá nhân bằng emoji + banner "Chuyên visa Nhật – 0935.887.922" đè lên | Nhiều thời điểm | Ảnh minh họa uy tín ("bằng chứng thành công") cho blog hoặc mạng xã hội | ✅ Do công ty tự tạo (đã che thông tin khách) — dùng lại được, nhưng nên xin phép khách trước khi công khai lại lần nữa nếu đăng chỗ mới |
| 6 | Banner cover trang | "Chuyên visa Nhật Bản — Tư vấn hoàn thiện hồ sơ, Xử lý trọn gói A-Z, Có kq visa mới thanh toán, Nhận tất cả các diện toàn quốc, Tư vấn du học/kỹ sư/XKLĐ" | — | Xác nhận thông điệp cốt lõi đã khớp với USP "Đậu visa mới thu phí dịch vụ" đang có trên landing page | Ảnh do công ty tự thiết kế (banner chữ) — dùng lại được |

## 2. Đề xuất 3 bài viết mới (nội dung do Claude soạn mới — không sao chép từ bài gốc, chỉ lấy cảm hứng chủ đề)

Các bài dưới đây soạn sẵn để dán trực tiếp vào **Tab Bài viết** trong `admin.html` (chức năng đã có sẵn, không cần code thêm). Bạn đọc duyệt/chỉnh trước khi đăng.

### Bài #1 — Hướng dẫn người mới bắt đầu

| Trường | Nội dung |
|---|---|
| Tiêu đề | Lần đầu xin visa Nhật Bản? Đây là 4 bước bạn cần biết |
| Danh mục | Kinh nghiệm xin visa |
| Tóm tắt/Nội dung | Bài hướng dẫn ngắn theo đúng quy trình 4 bước đã có trên landing page (Tư vấn miễn phí → Chuẩn bị hồ sơ → Nộp hồ sơ → Nhận kết quả), giải thích thêm giấy tờ cơ bản cần chuẩn bị (hộ chiếu còn hạn 6 tháng, ảnh thẻ, chứng minh công việc/tài chính), và nhắc chính sách "đậu visa mới thu phí dịch vụ". |
| Ảnh đề xuất | Ảnh hộ chiếu + vé máy bay mang tính minh họa (nên dùng ảnh có bản quyền rõ ràng, xem Rà soát #1) |

### Bài #2 — Câu chuyện cảm hứng (viết lại, không phải AI-caption cũ)

| Trường | Nội dung |
|---|---|
| Tiêu đề | Vì sao ngày càng nhiều người Đà Nẵng chọn Nhật Bản cho chuyến đi tiếp theo |
| Danh mục | Tin tức |
| Tóm tắt/Nội dung | Bài truyền cảm hứng: điểm qua các trải nghiệm phổ biến khi du lịch Nhật (mùa hoa anh đào, ẩm thực, văn hóa), dẫn dắt nhẹ nhàng sang thông điệp "Top Visa đồng hành cùng hành trình đó" — không dùng số liệu tự bịa, không cam kết cụ thể ngoài phạm vi đã duyệt (USP đậu mới thu phí). |
| Ảnh đề xuất | Ảnh phong cảnh Nhật Bản có bản quyền hợp lệ |

### Bài #3 — Xây dựng niềm tin

| Trường | Nội dung |
|---|---|
| Tiêu đề | Cam kết "Đậu Visa Mới Thu Phí Dịch Vụ" nghĩa là gì? |
| Danh mục | Khuyến mãi |
| Tóm tắt/Nội dung | Giải thích rõ chính sách đã có trên landing page: khách chỉ thanh toán phí dịch vụ khi hồ sơ được cấp visa; phí lãnh sự nộp cho cơ quan tiếp nhận là khoản riêng theo quy định, không hoàn lại. Mục tiêu: minh bạch, tránh hiểu lầm. |
| Ảnh đề xuất | Ảnh banner cam kết đã có sẵn trên landing page (`.usp-banner`) hoặc thiết kế lại |

## 3. Spec chức năng: Trang Blog công khai (Claude Code triển khai)

> Ghi chú: Trong `01_Phan_tich_yeu_cau.md`, mục O4 "SEO nâng cao / Blog đầy đủ" đang ở diện **Ngoài phạm vi** (phase mở rộng). Tài liệu này đề xuất đưa hạng mục hiển thị blog công khai (đọc dữ liệu có sẵn) vào triển khai — **KHÔNG cần đổi schema hay thêm bảng mới**, vì `posts`/`categories` + RLS cho phép `anon` SELECT bài `published=true` đã có sẵn trong `supabase_setup.sql`.

### 3.1 Mục tiêu

Hiển thị công khai các bài viết đã tạo qua `admin.html` (Tab Bài viết) thành 1 trang danh sách + 1 trang chi tiết, để khách vãng lai đọc được nội dung SEO/uy tín, tăng thời gian ở lại site và tăng tin tưởng trước khi điền form đăng ký.

### 3.2 Yêu cầu chức năng

| ID | Yêu cầu | Mô tả | Ưu tiên |
|---|---|---|---|
| BLOG-01 | Trang danh sách bài viết | File mới `blog.html` — grid card (ảnh, tiêu đề, danh mục, ngày đăng, đoạn trích ngắn), chỉ lấy bài có `published=true`, sắp xếp mới nhất trước | Cao |
| BLOG-02 | Lọc theo danh mục | Dropdown/tab lọc theo `categories` (dùng bảng `categories` có sẵn) | Trung bình |
| BLOG-03 | Trang chi tiết bài viết | `blog.html?id=<id>` hoặc file riêng `blog-chi-tiet.html?id=` — hiển thị đầy đủ `content`, ảnh, ngày đăng; có nút quay lại danh sách | Cao |
| BLOG-04 | Liên kết 2 chiều với landing page | Thêm mục "Blog" vào navbar `index.html` trỏ tới `blog.html`; ở cuối mỗi bài viết có CTA quay lại `#dang-ky` | Trung bình |
| BLOG-05 | SEO cơ bản | `<title>`, `<meta description>` động theo tiêu đề/tóm tắt bài viết (JS set `document.title` sau khi fetch dữ liệu) | Thấp |
| BLOG-06 | Trạng thái rỗng | Nếu chưa có bài viết nào `published=true`, hiển thị thông báo thân thiện thay vì trang trắng | Trung bình |

### 3.3 Ràng buộc kỹ thuật (giữ đúng triết lý dự án — xem `CLAUDE.md`)

- Không thêm framework/build step — `blog.html` là HTML/CSS/JS thuần, gọi thẳng Supabase REST API bằng `fetch()` giống `index.html`/`admin.html`.
- Dùng lại nguyên bộ Design System (CSS variables `--color-*`, `--sp-*`...) đã có trong `index.html` — copy khối `:root{...}` sang, không tạo bộ màu mới.
- Dùng đúng 2 hằng số `SUPABASE_URL`/`SUPABASE_ANON_KEY` theo cách `index.html` đang làm (khai báo đầu file, người dùng tự điền).
- Chỉ đọc (`SELECT`) — không có form ghi dữ liệu ở trang blog công khai, nên không cần thêm RLS policy mới.

### 3.4 Dữ liệu mẫu để test

Dùng chính 3 bài viết soạn ở mục 2 phía trên, nhập qua `admin.html` (Tab Bài viết → Thêm bài viết) để có dữ liệu thật kiểm thử trang blog — không cần bịa thêm dữ liệu giả.

### 3.5 Test case gợi ý (bổ sung vào `05_Ke_hoach_du_an.md` khi triển khai)

| ID | Precondition | Steps | Expected Result | Priority |
|---|---|---|---|---|
| TC-B01 | Có ≥1 bài `published=true` | Mở `blog.html` | Thấy danh sách bài, mới nhất trên đầu | High |
| TC-B02 | Chưa có bài nào published | Mở `blog.html` | Hiện thông báo "Chưa có bài viết", không lỗi console | Medium |
| TC-B03 | Đang xem `blog.html` | Bấm 1 bài | Chuyển sang trang chi tiết đúng nội dung | High |
| TC-B04 | Đang xem trang chi tiết | Bấm "Quay lại" | Về đúng danh sách | Low |
| TC-B05 | Trên mobile | Mở `blog.html` | Grid 1 cột, ảnh không vỡ layout | High |

---

## ⚠️ Rà soát

| # | Vấn đề | Loại | Impact | Đề xuất |
|---|---|---|---|---|
| 1 | Ảnh phong cảnh Nhật Bản trên Facebook (Phú Sĩ, Shibuya, mùa lá đỏ...) nhiều khả năng là ảnh sưu tầm/stock, chưa rõ nguồn gốc bản quyền | Risk | Cao | KHÔNG tự động tải/dùng lại các ảnh này cho website. Trước khi dùng cho blog: (a) xác minh nguồn gốc ảnh gốc công ty đã dùng, hoặc (b) thay bằng ảnh có giấy phép rõ ràng (Unsplash/Pexels — miễn phí, ghi rõ điều khoản), hoặc (c) dùng ảnh tự chụp |
| 2 | Chỉ có 2 đánh giá công khai trên Facebook | Gap | Trung bình | Đã ghi nhận từ tài liệu trước — chủ động xin thêm đánh giá từ khách đã dùng dịch vụ |
| 3 | Bài "VISA NHẬT BẢN – CHẠM TAY ĐẾN..." gắn nhãn "Nội dung do AI tạo" | Gap | Thấp | Không tái sử dụng nguyên caption — bài #2 ở mục 2 đã viết lại theo hướng riêng, không sao chép |
| 4 | Ảnh trong album "Visa khách iu" có thông tin khách hàng dù đã che một phần | Risk | Trung bình | Trước khi dùng lại ảnh này ở kênh khác (blog/website), nên xin phép khách hàng thêm lần nữa hoặc chỉ dùng ảnh đã che kỹ toàn bộ số passport/tên |
| 5 | Trang Facebook cá nhân "Aki Hiền" không có nội dung phù hợp | Gap | Thấp | Không dùng làm nguồn nội dung; nếu cần thêm review/case study, nên lập quy trình xin khách gửi trực tiếp thay vì lấy từ mạng xã hội cá nhân |
| 6 | Đưa O4 (Blog) từ "Ngoài phạm vi" sang triển khai sẽ phát sinh thêm thời gian ngoài kế hoạch 6 phase ban đầu | Risk | Trung bình | Coi đây là Phase 6.5 (mở rộng), làm sau khi Phase 1-6 gốc hoàn tất và ổn định |
