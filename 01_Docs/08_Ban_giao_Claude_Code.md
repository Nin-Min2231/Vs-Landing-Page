# 08. Bàn giao cho Claude Code

> Dùng khi tiếp tục phát triển dự án bằng Claude Code. Đọc file này SAU `CLAUDE.md` (ở thư mục gốc) — CLAUDE.md là quy tắc/triết lý chung, file này là **tình trạng thực tế + lịch sử quyết định kỹ thuật** tính đến thời điểm cập nhật.
>
> Cập nhật lần cuối: **2026-07-30**, sau 1 phiên làm việc lớn (xem mục 2). Nếu ngày này đã cũ hơn 2-3 tuần so với hiện tại, coi các mục "còn thiếu"/"bước tiếp theo" là điểm khởi đầu để hỏi lại người dùng, không phải sự thật tuyệt đối.

## 1. Tình trạng hiện tại (đã lên Internet thật, không còn là bản nháp)

| Phase | Trạng thái |
|---|---|
| 1. Phân tích yêu cầu | ✅ Xong |
| 2. Thiết kế (sitemap/wireframe/design system) | ✅ Xong |
| 3. Front-end (`index.html`) | ✅ Xong — logo/hotline/Zalo/Facebook/địa chỉ thật, USP "Đậu visa mới thu phí" nổi bật nhiều nơi, slider đánh giá thật, section Tin tức mới |
| 4. Back-end (Supabase) | ✅ **Đã chạy thật** — project tạo xong, schema đã apply, `SUPABASE_URL`/`SUPABASE_ANON_KEY` đã điền thật trong cả 2 file HTML |
| 5. Kiểm thử | 🟡 Một phần — đã test thủ công (gửi lead thật qua API, xác nhận HTTP 201; đăng nhập/đăng bài admin đã dùng thật) nhưng **chưa chạy formal 14 test case** trong `05_Ke_hoach_du_an.md` theo checklist |
| 6. Deploy | ✅ **Đã lên Internet** — nhưng qua **Cloudflare Workers** (không phải Cloudflare Pages như dự tính ban đầu), xem mục 3 |
| 6.5 Blog công khai (spec ở `09_Noi_dung_Dang_bai.md`) | 🟡 **Đã làm bản rút gọn**, khác với spec gốc — xem mục 6 |

**Trang đang chạy thật tại:** `https://topvisa.nguyennc1357.workers.dev` (chưa có domain riêng — xem mục 8).

## 2. Tóm tắt phiên làm việc gần nhất (2026-07-30)

Trong 1 phiên, đã hoàn thành toàn bộ chuỗi việc từ "code xong nhưng chưa chạy" tới "chạy thật, có người dùng thật vào được":

1. Tạo project Supabase thật, lấy **Publishable key** (hệ key mới của Supabase, thay thế `anon key` kiểu cũ `eyJ...`), điền vào cả 2 file HTML.
2. Test kết nối thật bằng cách gửi 1 lead test qua REST API (curl) → HTTP 201 → xác nhận hoạt động.
3. Khởi tạo Git cho dự án (trước đó **chưa từng có Git**), đẩy lên GitHub: `https://github.com/Nin-Min2231/Vs-Landing-Page`.
4. Deploy lên Cloudflare — **nhưng giao diện Cloudflare hiện tại không còn "Workers & Pages" như tài liệu gốc mô tả**, mà dùng luồng **"Create a Worker" + Git integration + Wrangler**. Phải thêm `02_Source/wrangler.toml` và `02_Source/package.json` mới deploy được (chi tiết + lỗi đã gặp: xem mục 3).
5. Thêm/nhấn mạnh USP "Đậu visa mới thu phí dịch vụ" ở 4 vị trí (dải thông báo đầu trang, badge hero, khung nhấn mạnh trong hero, banner trong section Lợi ích) + sửa FAQ cho khớp chính sách.
6. Làm mới giao diện menu: icon cho từng mục, gạch chân khi hover, scrollspy tự highlight mục đang xem, CTA có hiệu ứng glow nhẹ.
7. Xây dựng section **"Tin tức"** hiển thị bài viết công khai (đọc bảng `posts` qua Supabase REST, popup xem chi tiết) — xem mục 6 để biết khác biệt với spec gốc.
8. Sửa nhiều lỗi giao diện: căn giữa khối hotline+QR, sửa lệch logo footer, nút liên hệ nổi tự thu gọn khi click ra ngoài, thêm nút cuộn lên đầu trang.
9. Thêm "Ghi nhớ đăng nhập" cho `admin.html` bằng refresh token lưu `localStorage` (**không lưu mật khẩu thật** — xem mục 7, mục an toàn).

## 3. Hạ tầng thực tế đang chạy (khác với dự tính ban đầu ở 1 điểm quan trọng)

| Thành phần | Giá trị thật |
|---|---|
| Supabase Project URL | `https://vvnjxvcdnzttcdufjjgo.supabase.co` |
| Supabase key dùng trong code | Publishable key (`sb_publishable_...`) — KHÔNG phải `service_role`/`sb_secret_...` |
| GitHub repo | `https://github.com/Nin-Min2231/Vs-Landing-Page.git`, nhánh `main` |
| Cloudflare project | Tên Worker: `topvisa` (đổi tên từ `vs-landing-page` ban đầu) |
| Link chạy thật | `https://topvisa.nguyennc1357.workers.dev` |
| Domain riêng | **Chưa mua** — đang dùng subdomain `*.workers.dev` miễn phí |

### ⚠️ Thay đổi kiến trúc deploy quan trọng: Cloudflare Pages → Cloudflare Workers

`07_Huong_dan_Deploy.md` Bước 3 (viết ban đầu) mô tả deploy qua **Cloudflare Pages** ("Workers & Pages" → tab Pages → Upload assets/Connect to Git). Tại thời điểm deploy thật (2026-07-30), **Cloudflare đã đổi giao diện**: mục "Workers & Pages" không còn, dashboard dẫn thẳng vào luồng **"Create a Worker"** dùng `npx wrangler deploy`. Đã cập nhật `07_Huong_dan_Deploy.md` với hướng dẫn theo giao diện mới, nhưng **agent tương lai cần lưu ý: giao diện Cloudflare có thể tiếp tục đổi**, luôn xin ảnh chụp màn hình thật của người dùng thay vì đoán theo tài liệu cũ.

**Cấu hình Build đang dùng (đã test thành công):**
- Root directory: **để trống** (KHÔNG dùng `/02_Source` hay `02_Source` — cả 2 cách này đều gây lỗi `"Failed: root directory not found"` dù thư mục tồn tại thật trong repo, đã xác minh bằng cách clone trực tiếp để loại trừ nguyên nhân từ phía repo. Nghi là bug/giới hạn của Cloudflare Workers Builds với monorepo subdirectory, chưa rõ nguyên nhân gốc).
- Build command: (trống)
- Deploy command: `npx wrangler deploy --config 02_Source/wrangler.toml`
- Version command (non-production branch): `npx wrangler versions upload --config 02_Source/wrangler.toml`
- File `02_Source/wrangler.toml` (mới thêm): khai báo `name = "vs-landing-page"`, `[assets] directory = "."` — LƯU Ý: giá trị `name` trong file này phải khớp tên Worker thật trên Cloudflare, nếu đổi tên Worker (mục 8, câu hỏi "đổi tên URL") phải sửa lại `name` trong file này rồi push lại, nếu không lần deploy tiếp theo có thể lỗi hoặc tạo nhầm Worker mới.
- File `02_Source/package.json` (mới thêm): chỉ có `devDependencies.wrangler` — thêm vì nghi Cloudflare cần file này để nhận diện thư mục là 1 project hợp lệ (thêm vào KHÔNG fix được lỗi root directory, nhưng vẫn cần thiết cho lệnh `npx wrangler` chạy ổn định).

**Cách deploy 1 bản mới sau này:** sửa file trong `02_Source/` → `git add` → `git commit` → `git push origin main` → Cloudflare tự động build/deploy trong ~30-60 giây (đã nối Git, không cần thao tác tay trên dashboard nữa, trừ khi đổi cấu hình Build).

## 4. Cấu trúc file (đã có thêm so với lúc thiết kế ban đầu)

```
Visa-Landing-Page/
├── CLAUDE.md, README.md
├── .gitignore                       ← mới: loại trừ .claude/settings.local.json khỏi Git
├── .git/                            ← mới: repo Git (trước đây dự án KHÔNG có Git)
├── 01_Docs/
│   ├── 01_..07_...md, Visa-Landing-Page_Tai_lieu.xlsx  (như cũ)
│   ├── 08_Ban_giao_Claude_Code.md   ← file này
│   └── 09_Noi_dung_Dang_bai.md      (đã có sẵn — spec Blog, xem mục 6)
├── 02_Source/
│   ├── index.html, admin.html, supabase_setup.sql, assets/  (như cũ, đã sửa nhiều)
│   ├── wrangler.toml                ← MỚI, bắt buộc để Cloudflare Workers Builds deploy được
│   └── package.json                 ← MỚI, cùng lý do trên
└── 03_Information/  (như cũ)
```

## 5. Việc còn thiếu / placeholder — cập nhật lại so với CLAUDE.md mục 8 (đã lỗi thời 1 phần)

| Vị trí | Placeholder | Trạng thái |
|---|---|---|
| Badge hero | "5000+ hồ sơ", "98% đậu" | ⬜ **Vẫn còn placeholder** — chưa có số liệu thật |
| Section dịch vụ | Giá "Từ x đ" mỗi quốc gia | ⬜ **Vẫn còn placeholder** |
| Section đánh giá | 3 review mẫu | ✅ **ĐÃ XONG** — đã thay bằng 2 review thật lấy từ Facebook công ty (xem `09_Noi_dung_Dang_bai.md` mục 1) — CLAUDE.md mục 8 ghi vẫn là placeholder, **đã lỗi thời, cần sửa lại CLAUDE.md** |
| Footer | Số GPKD | ⬜ Vẫn thiếu, chưa có trong `Information.md` |
| 2 file HTML | `SUPABASE_URL`, `SUPABASE_ANON_KEY` | ✅ **ĐÃ XONG** — đã điền giá trị thật (mục 3) |

**Việc cần làm:** hỏi lại người dùng số liệu hồ sơ/tỷ lệ đậu thật, bảng giá thật, số GPKD — không tự bịa (theo đúng CLAUDE.md mục 8/10).

## 6. Blog công khai: đã làm khác với spec gốc ở `09_Noi_dung_Dang_bai.md`

Spec gốc (mục 3, `BLOG-01` → `BLOG-06`) đề xuất 1 **trang riêng** `blog.html` (+ `blog-chi-tiet.html` hoặc query string `?id=`), có lọc theo danh mục, có SEO động theo từng bài, có URL riêng cho mỗi bài.

**Thực tế đã triển khai (nhanh hơn, đơn giản hơn):** 1 section **"Tin tức"** ngay trong `index.html` (không phải file riêng), hiển thị lưới thẻ bài viết (card), bấm vào mở **popup modal** xem toàn văn (không có URL riêng cho từng bài, không lọc theo danh mục, không SEO động per-post).

| Yêu cầu gốc | Đã làm? |
|---|---|
| BLOG-01 Trang danh sách bài viết | 🟡 Có, nhưng là 1 section trong `index.html`, không phải file `blog.html` riêng |
| BLOG-02 Lọc theo danh mục | ❌ Chưa làm |
| BLOG-03 Trang chi tiết bài viết (URL riêng) | ❌ Chưa — thay bằng popup, không có URL riêng nên **không chia sẻ link thẳng tới 1 bài được**, không tối ưu SEO từng bài |
| BLOG-04 Liên kết 2 chiều navbar | ✅ Có (mục "📰 Tin tức" trên navbar) |
| BLOG-05 SEO động theo bài | ❌ Chưa |
| BLOG-06 Trạng thái rỗng thân thiện | 🟡 Có nhưng đơn giản hơn spec: nếu chưa có bài `published=true`, section tự ẩn hoàn toàn (không hiện thông báo thân thiện như spec yêu cầu) |

**Nếu người dùng cần đầy đủ SEO/chia sẻ link từng bài** (ví dụ để chạy quảng cáo tới 1 bài blog cụ thể, hoặc để Google index từng bài riêng) → cần làm lại theo đúng spec gốc (`blog.html` riêng, mỗi bài có URL `?id=`). Việc này **chưa làm**, là ứng viên tốt cho giai đoạn tiếp theo.

**Nội dung 3 bài viết mẫu đề xuất ở `09_Noi_dung_Dang_bai.md` mục 2 vẫn CHƯA được đăng** — mới có 1 bài thật do người dùng tự đăng ("🎌 Lễ Obon 2026"), khác chủ đề với 3 bài đề xuất trong tài liệu. Có thể gợi ý người dùng duyệt/đăng thêm 3 bài đó khi cần thêm nội dung.

## 7. Lưu ý bảo mật đã áp dụng — không đổi ngược lại

- `admin.html` mục "Ghi nhớ đăng nhập": lưu **refresh token** của Supabase vào `localStorage` (khóa `tv_admin_refresh_token`), **không bao giờ lưu mật khẩu thật**. Khi bấm "Đăng xuất", token này bị xóa. Đây là cách chuẩn — không thay đổi sang lưu password trực tiếp dù người dùng có yêu cầu, hãy giải thích lý do an toàn nếu được hỏi.
- `.gitignore` loại trừ `.claude/settings.local.json` khỏi Git — đây là cấu hình quyền hạn cục bộ của Claude Code trên máy người dùng, không phải nội dung dự án, không nên public.
- Repo GitHub hiện là **public** (theo mặc định lúc tạo) và chứa toàn bộ `03_Information/` (thông tin công ty) — không phải bí mật nhạy cảm, nhưng nếu người dùng muốn riêng tư hơn, có thể đổi repo sang private trên GitHub (không ảnh hưởng đến việc Cloudflare tiếp tục deploy được, vì đã cấp quyền GitHub App).

## 8. Gợi ý các bước tiếp theo (chưa làm, ưu tiên giảm dần)

1. **Chạy đủ 14 test case** trong `05_Ke_hoach_du_an.md` (TC-001 → TC-014) và điền kết quả — hiện mới test tay 1 phần.
2. **Xin số liệu thật** từ người dùng: bảng giá từng quốc gia, số liệu hồ sơ/tỷ lệ đậu, số GPKD — thay các placeholder còn lại.
3. **Quyết định về domain riêng**: hiện dùng `*.workers.dev` miễn phí — nếu mua domain, làm theo `07_Huong_dan_Deploy.md` Bước 4 (lưu ý: bước này viết cho Cloudflare Pages, cần kiểm tra lại thao tác "Custom domains" có tương đương bên Workers hay không, vì giao diện đã đổi — xác minh bằng ảnh chụp thật trước khi hướng dẫn).
4. **Quyết định về Blog đầy đủ**: hỏi người dùng có cần trang `blog.html` riêng (SEO/chia sẻ link từng bài) theo đúng spec `09_Noi_dung_Dang_bai.md`, hay giữ nguyên bản rút gọn hiện tại là đủ.
5. **Đăng thêm nội dung**: 3 bài viết mẫu đã soạn sẵn ở `09_Noi_dung_Dang_bai.md` mục 2, có thể dán trực tiếp vào tab "Bài viết" trong `admin.html`.
6. **Cập nhật CLAUDE.md**: mục 2 (trạng thái) và mục 8 (placeholder) trong `CLAUDE.md` ở thư mục gốc hiện **đã lỗi thời** so với thực tế (vẫn ghi "chưa chạy Supabase", "3 review mẫu" chưa sửa) — nên đồng bộ lại cho khớp file này.
