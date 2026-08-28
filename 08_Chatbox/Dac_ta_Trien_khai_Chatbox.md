# Đặc tả triển khai — Chat Box hỗ trợ Visa (song ngữ Việt/Anh)

| Mục | Nội dung |
|---|---|
| Dự án | Vs-Landing-Page — Chat Box trang Home + chuyển ngữ toàn site |
| Tài liệu này dùng cho | **Claude Code** (agent lập trình) — đọc file này SAU `CLAUDE.md` (quy tắc chung của dự án) để biết CHÍNH XÁC cần làm gì |
| Công ty | Top Visa (Đà Nẵng) |
| Người soạn | Claude (Cowork) |
| Ngày | 2026-08-28 |
| Phiên bản | 1.1 |
| Tài liệu gốc | `08_Chatbox/Bao_cao_Phan_tich_Kha_thi_Chatbox.md` (bản 1.3) + `08_Chatbox/Bao_cao_Phan_tich_Kha_thi_Chatbox.xlsx` — đọc 2 file đó để hiểu ĐẦY ĐỦ bối cảnh/lý do lựa chọn trước khi code, tài liệu này chỉ tóm tắt phần "làm gì, làm như thế nào" |

## 変更履歴 (Lịch sử thay đổi)

| Ver | Ngày | Người sửa | Nội dung |
|---|---|---|---|
| 1.0 | 2026-08-28 | Claude | Tạo mới — đặc tả triển khai dựa trên báo cáo khả thi bản 1.2 và toàn bộ câu trả lời PM |
| 1.1 | 2026-08-28 | Claude | Cập nhật theo báo cáo khả thi bản 1.3: (1) tách rõ **Release 1** (Chat Box, mục S1-S8 trừ S7) và **Release 2** (chuyển ngữ toàn site + nội dung động, mục S7 mở rộng + S9 mới); (2) thêm thiết kế DB cột song ngữ cho `posts`/`dich_vu_gia`/`danh_muc_nuoc` (mục 4.4); (3) chốt khuyến nghị SEO cho JSON-LD FAQ — giữ tiếng Việt (mục 6.2); (4) cập nhật FR/checklist/thứ tự triển khai theo đúng 2 đợt release |

---

## 0. Đọc trước khi bắt đầu code

1. Đọc `CLAUDE.md` (thư mục gốc dự án) — quy tắc chung: không tự ý `insert` dữ liệu mẫu (mục 10), khoá bí mật chỉ đặt qua Cloudflare Secret không bao giờ ghi vào file (mục 10), migration phải idempotent, dialog admin theo `01_Docs/10_Chuan_Dialog_Chung.md` (mục liên quan dialog).
2. Đọc `08_Chatbox/Bao_cao_Phan_tich_Kha_thi_Chatbox.md` bản 1.3 — đặc biệt mục 1.7 (phân chia Release 1/2), mục 3 (khả năng tích hợp) và mục 6 (toàn bộ câu trả lời PM, đã đầy đủ — không còn điểm nào đang chờ PM trả lời).
3. **PM đã xác nhận tách 2 đợt release (xem mục 1 tài liệu này):** triển khai **Release 1 (Chat Box)** trước và bàn giao/nghiệm thu xong mới bắt đầu **Release 2 (chuyển ngữ toàn site)**. Không cần hỏi lại PM về việc tách release nữa — nếu phát sinh câu hỏi mới ngoài phạm vi đã nêu trong 2 tài liệu này, mới cần hỏi lại.
4. File nguồn sẽ bị sửa: `02_Source/index.html`, `02_Source/worker.js`, `02_Source/admin.html`, `02_Source/wrangler.toml` (thêm binding Workers AI, Release 1). File mới sẽ tạo: `05_Database/11_supabase_setup_phase11.sql` cho `chat_logs` (Release 1) và `05_Database/12_supabase_setup_phase12.sql` cho cột song ngữ nội dung động (Release 2) — đề xuất số thứ tự, kiểm tra lại xem đã có file `11_.../12_...` nào chưa trước khi đặt tên.

---

## 1. Mục tiêu & Phạm vi

**Mục tiêu:** thêm Chat Box tự động trả lời câu hỏi về dịch vụ Visa trên trang Home, có nút bấm nhanh + hỏi tự do bằng AI, tự động lưu thông tin khách vào hệ thống quản trị đã có, và cho phép khách chuyển toàn bộ landing page sang tiếng Anh.

### 1.1 Trong phạm vi (In-scope), chia theo Release

> PM xác nhận (nguyên văn): *"Hãy đối ứng phần chatbot thật trước. Chuyển ngôn ngữ đối ứng sau."* — Release 1 phải hoàn thành và bàn giao trước, Release 2 làm sau.

**Release 1 — Chat Box (triển khai ngay):**

| # | Hạng mục | Ghi chú |
|---|---|---|
| S1 | Widget Chat Box nổi trên `index.html`: nút bấm nhanh (song ngữ) + ô hỏi tự do | Xem mục 6.1 |
| S2 | Route `/api/chat` trong `worker.js`, gọi Cloudflare Workers AI, ground bằng dữ liệu Visa thật, **trả lời được cả tiếng Việt và tiếng Anh** | Xem mục 5 |
| S3 | Khi khách để lại tên/SĐT → insert `leads` (`nguon='Từ Chatbot'`) | Xem mục 4 |
| S4 | Sửa filter thông báo trong `worker.js` để lead từ Chatbot cũng lên chuông thông báo/Web Push admin | Xem mục 4 |
| S5 | Bảng mới `chat_logs` lưu toàn bộ hội thoại | Xem mục 4.1 |
| S6 | Tab mới "Quản lý Chat" trong `admin.html`: danh sách hội thoại, xem chi tiết, xoá từng record | Xem mục 6.3 |
| S8 | Cơ chế fallback khi hết quota AI free trong ngày | Xem mục 5.4 |

**Release 2 — Chuyển ngữ toàn site (làm sau, khi Release 1 đã ổn định):**

| # | Hạng mục | Ghi chú |
|---|---|---|
| S7 | Toggle ngôn ngữ Việt/Anh cho toàn bộ nội dung **tĩnh** trên `index.html`, mặc định Việt | Xem mục 6.2 |
| S9 | *(Mới, bản 1.1)* Cột song ngữ `_en` cho nội dung **động** — `posts`, `dich_vu_gia`, `danh_muc_nuoc` — admin tự nhập qua `admin.html` | Xem mục 4.4, 6.3b |

### 1.2 Ngoài phạm vi / chưa cần ngay (Out-of-scope)

| # | Hạng mục | Lý do |
|---|---|---|
| O2 | Chuyển tiếp nhân viên thật ngay trong lúc chat (real-time handoff) | PM xác nhận trả lời tự động là đủ |
| O3 | Tiếng Nhật | PM chưa xác nhận cần |
| O4 | AI trả phí (OpenAI/Gemini bản trả phí), nâng cấp Cloudflare Workers Paid | PM xác nhận ngân sách chỉ Free |
| O5 | Đa ngôn ngữ cho `admin.html` | Chỉ landing page công khai cần song ngữ; trang quản trị nội bộ giữ tiếng Việt |
| O6 | *(Mới, bản 1.1)* JSON-LD `FAQPage` (SEO) bản tiếng Anh | Khuyến nghị giữ nguyên tiếng Việt — xem mục 6.2 |
| O7 | *(Mới, bản 1.1)* SEO đa ngôn ngữ thật sự (URL riêng `/en/` + `hreflang`) | Dự án riêng, lớn hơn nhiều so với phạm vi Chat Box — chỉ làm nếu PM yêu cầu sau này |

---

## 2. Yêu cầu chức năng

| ID | Release | Yêu cầu | Mô tả chi tiết | Ưu tiên |
|---|---|---|---|---|
| FR-CB-01 | 1 | Hiển thị nút Chat Box nổi | Icon tròn, góc dưới phải, **phía trên** nút Zalo hiện có (`.float-zalo`), không đè `.scroll-top-btn` | Cao |
| FR-CB-02 | 1 | Nút bấm nhanh câu hỏi phổ biến | ~6-8 câu, song ngữ, nội dung lấy từ FAQ tĩnh hiện có + `dich_vu_gia` (giá theo quốc gia) | Cao |
| FR-CB-03 | 1 | Ô nhập câu hỏi tự do | Gọi `/api/chat`, hiển thị trạng thái "đang trả lời...", trả lời trong khung chat | Cao |
| FR-CB-04 | 1 | Trả lời ground theo dữ liệu thật | AI chỉ dùng dữ liệu từ `danh_muc_nuoc`/`dich_vu_gia` truyền vào prompt, không tự bịa số liệu | Cao |
| FR-CB-05 | 1 | Trả lời song ngữ theo câu hỏi | Khách hỏi tiếng Anh → trả lời tiếng Anh; hỏi tiếng Việt → trả lời tiếng Việt. **Đây là thuộc tính của chatbot, không phụ thuộc FR-CB-13** | Cao |
| FR-CB-06 | 1 | CTA cuối mỗi câu trả lời | Luôn có nút/gợi ý gọi hotline hoặc chat Zalo | Cao |
| FR-CB-07 | 1 | Nhận diện + lưu thông tin liên hệ | Khi khách gõ tên/SĐT hoặc bấm nút "Để lại thông tin liên hệ" → insert `leads` (`nguon='Từ Chatbot'`) | Cao |
| FR-CB-08 | 1 | Lead Chatbot lên thông báo admin | Sửa `worker.js`: `nguon=in.("Từ Web","Từ Chatbot")` trong `generateNewNotifications()` | Cao |
| FR-CB-09 | 1 | Lưu toàn bộ hội thoại | Mọi lượt hỏi/đáp (kể cả không để lại thông tin liên hệ) ghi vào `chat_logs` | Cao |
| FR-CB-10 | 1 | Admin xem danh sách hội thoại | Tab mới "Quản lý Chat": liệt kê theo phiên/khách, có thể lọc theo ngày | Cao |
| FR-CB-11 | 1 | Admin xem chi tiết 1 hội thoại | Dialog hiển thị toàn bộ tin nhắn của 1 phiên, theo đúng convention `10_Chuan_Dialog_Chung.md` | Cao |
| FR-CB-12 | 1 | Admin xoá từng record chat | Nút xoá có hộp thoại xác nhận trước khi xoá thật | Cao |
| FR-CB-14 | 1 | Fallback khi hết quota AI | Trả tin nhắn "Hiện đang bận, vui lòng gọi hotline/Zalo" thay vì lỗi | Trung bình |
| FR-CB-15 | 1 | Rate limit chống lạm dụng | Giới hạn số câu hỏi/phút theo IP hoặc phiên trong route `/api/chat` | Trung bình |
| FR-CB-13 | 2 | Toggle ngôn ngữ toàn site | Nút chọn VI/EN (mặc định VI), lưu lựa chọn bằng `localStorage`, áp dụng lại khi khách quay lại trang. Áp dụng cho nội dung **tĩnh** trong `index.html` | Cao |
| FR-CB-16 | 2 | *(Mới, bản 1.1)* Admin nhập nội dung song ngữ cho `posts`/`dich_vu_gia`/`danh_muc_nuoc` | Thêm ô nhập `_en` bên cạnh ô tiếng Việt trong các form sẵn có của `admin.html`; không bắt buộc nhập ngay (cho phép để trống) | Cao |
| FR-CB-17 | 2 | *(Mới, bản 1.1)* Fallback nội dung động khi thiếu bản tiếng Anh | Khi khách chọn EN mà bản ghi `posts`/`dich_vu_gia`/`danh_muc_nuoc` chưa có `_en` → hiển thị bản tiếng Việt kèm nhãn nhận biết nhỏ (không để trống, không lỗi) | Trung bình |

---

## 3. Yêu cầu phi chức năng

| Hạng mục | Yêu cầu |
|---|---|
| Chi phí | **0đ vận hành bắt buộc.** Không gắn thẻ thanh toán cho Cloudflare Workers AI. Không dùng AI API trả phí (OpenAI/Gemini bản trả phí) |
| Hiệu năng | Nút bấm nhanh trả lời tức thời (<100ms). Ô hỏi tự do (AI) chấp nhận độ trễ 1-3s, có trạng thái loading |
| Bảo mật | Không đặt bất kỳ khoá AI/API key nào trong `index.html` — mọi khoá đặt qua Cloudflare Secret (giống `SUPABASE_SERVICE_ROLE_KEY` hiện tại). Không mở `anon` đọc `danh_muc_nuoc` |
| Dữ liệu cá nhân | `chat_logs` và lead từ Chatbot chỉ `authenticated` (admin) đọc/xoá được, giống RLS hiện có của `leads` |
| Tương thích | Không phá vỡ hành vi hiện tại của `index.html`/`admin.html`/`worker.js` cho người dùng đang có — mọi thay đổi phải là bổ sung có kiểm soát |
| Responsive | Chat widget + toggle ngôn ngữ hoạt động tốt trên mobile (ưu tiên, vì 70%+ traffic là mobile theo persona đã xác định) |

---

## 4. Thiết kế dữ liệu (Database)

### 4.1 Bảng mới `chat_logs` — đề xuất SQL

> Đặt trong file mới `05_Database/11_supabase_setup_phase11.sql` (kiểm tra lại số thứ tự file trước khi tạo — hiện tại file mới nhất là `10_supabase_setup_phase10.sql`), theo đúng convention idempotent của `05_Database/README.md`. **Không tự ý `insert` dữ liệu mẫu** (CLAUDE.md mục 10). SQL dưới đây là **đề xuất khởi điểm**, Claude Code rà soát lại trước khi chạy thật, đặc biệt phần RLS.

```sql
-- ============================================================
-- SUPABASE SETUP – Phase 11: chat_logs (lịch sử hội thoại Chat Box)
-- Chạy trong SQL Editor của project Supabase đang dùng — chạy lại không lỗi (idempotent).
-- ============================================================

create table if not exists public.chat_logs (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  session_id  text not null,           -- gom các tin nhắn cùng 1 phiên chat (sinh phía client, vd uuid)
  lead_id     bigint references public.leads(id) on delete set null,  -- liên kết lead nếu phiên có để lại thông tin, null nếu chưa
  role        text not null check (role in ('user','assistant')),
  message     text not null,
  lang        text not null default 'vi' check (lang in ('vi','en'))
);

comment on table public.chat_logs is 'Lịch sử hội thoại Chat Box trang Home — admin xem lại/xoá qua admin.html tab "Quản lý Chat".';
comment on column public.chat_logs.session_id is 'Định danh 1 phiên chat (sinh ở client, vd crypto.randomUUID()), dùng để gom nhóm tin nhắn khi hiển thị.';
comment on column public.chat_logs.lead_id is 'Liên kết tới leads nếu phiên chat này đã để lại tên/SĐT — null nếu khách chưa để lại thông tin.';

create index if not exists idx_chat_logs_session on public.chat_logs(session_id);
create index if not exists idx_chat_logs_created on public.chat_logs(created_at desc);

alter table public.chat_logs enable row level security;

-- Worker ghi bằng anon key (giống cách leads nhận insert công khai từ index.html) — CHỈ insert, không đọc/sửa/xoá được
drop policy if exists "anon_insert_chat_logs" on public.chat_logs;
create policy "anon_insert_chat_logs" on public.chat_logs for insert to anon with check (true);

-- Admin (đã đăng nhập) toàn quyền xem/xoá — dùng cho tab "Quản lý Chat"
drop policy if exists "auth_all_chat_logs" on public.chat_logs;
create policy "auth_all_chat_logs" on public.chat_logs for all to authenticated using (true) with check (true);

-- ✅ Hết migration Phase 11 — sẵn sàng chạy trong SQL Editor.
```

**Việc bắt buộc kèm theo khi thêm bảng mới (theo `05_Database/README.md`):** cập nhật `06_Backup_Tool/backup-supabase.mjs` — thêm `'chat_logs'` vào mảng `TABLES`; vì `chat_logs` dùng khoá chính đơn `id` nên **không cần** thêm vào `ORDER_BY` (chỉ bảng có khoá chính ghép nhiều cột mới cần) — kiểm tra lại file thật trước khi kết luận.

### 4.2 Cột `leads.nguon`

- **Không cần migration.** Cột đã là `text` tự do, không có `CHECK` constraint (xác minh trong `01_supabase_setup.sql`). Chỉ cần route `/api/chat` insert đúng giá trị `'Từ Chatbot'`.

### 4.3 Đọc dữ liệu Visa cho AI ground

- Route `/api/chat` dùng `SUPABASE_SERVICE_ROLE_KEY` (secret có sẵn trên Cloudflare) để đọc `danh_muc_nuoc` (`le_phi`, `thoi_gian_xet_duyet`, `checklist`, `ghi_chu`) và `dich_vu_gia` — **không** tạo RLS policy `anon` mới cho `danh_muc_nuoc` (giữ nguyên hiện trạng chỉ `authenticated` đọc được).

### 4.4 Cột song ngữ cho nội dung động (mới, bản 1.1 — thuộc Release 2)

> PM xác nhận nội dung do admin tự nhập (bài viết, giá, thông tin quốc gia) cũng cần bản tiếng Anh, admin nhập trực tiếp qua `admin.html` — **không** dùng AI dịch tự động cho nội dung nghiệp vụ (rủi ro sai lệch thông tin). Đề xuất đặt trong file mới `05_Database/12_supabase_setup_phase12.sql` (kiểm tra lại số thứ tự file trước khi tạo, sau khi Phase 11 đã chạy), idempotent theo đúng convention `05_Database/README.md`. Tất cả cột mới đều **nullable**, không có giá trị mặc định — không migrate ngược dữ liệu cũ.

```sql
-- ============================================================
-- SUPABASE SETUP – Phase 12: cột song ngữ cho nội dung động (Release 2)
-- Chạy trong SQL Editor của project Supabase đang dùng — chạy lại không lỗi (idempotent).
-- ============================================================

alter table public.posts
  add column if not exists title_en text,
  add column if not exists content_en text;

alter table public.dich_vu_gia
  add column if not exists quoc_gia_en text;  -- cột "gia" là số, không cần dịch

alter table public.danh_muc_nuoc
  add column if not exists ten_en text,
  add column if not exists thoi_gian_xet_duyet_en text,
  add column if not exists checklist_en text,
  add column if not exists ghi_chu_en text;   -- cột "le_phi" là số, không cần dịch

comment on column public.posts.title_en is 'Bản tiếng Anh của title — admin tự nhập qua admin.html, để trống nếu chưa dịch (frontend fallback về tiếng Việt).';
comment on column public.posts.content_en is 'Bản tiếng Anh của content — admin tự nhập, để trống nếu chưa dịch.';
comment on column public.dich_vu_gia.quoc_gia_en is 'Tên quốc gia tiếng Anh — admin tự nhập, để trống nếu chưa dịch.';
comment on column public.danh_muc_nuoc.ten_en is 'Tên quốc gia tiếng Anh — admin tự nhập.';
comment on column public.danh_muc_nuoc.thoi_gian_xet_duyet_en is 'Thời gian xét duyệt bằng tiếng Anh — admin tự nhập.';
comment on column public.danh_muc_nuoc.checklist_en is 'Checklist hồ sơ bằng tiếng Anh — admin tự nhập.';
comment on column public.danh_muc_nuoc.ghi_chu_en is 'Ghi chú bằng tiếng Anh — admin tự nhập.';

-- ✅ Hết migration Phase 12 — sẵn sàng chạy trong SQL Editor.
-- Không cần thay đổi RLS: các bảng này giữ nguyên policy đọc/ghi hiện có, chỉ thêm cột.
```

**Quy tắc hiển thị phía frontend (áp dụng khi code FR-CB-17):** khi `lang=en` và cột `_en` tương ứng là `NULL` hoặc rỗng → hiển thị giá trị cột tiếng Việt gốc, kèm nhãn nhỏ (ví dụ badge "VI") để khách biết đang xem bản chưa dịch — không để trống, không lỗi JS.

**Việc bắt buộc kèm theo:** các cột mới không cần thêm vào `06_Backup_Tool/backup-supabase.mjs` (bảng đã có sẵn trong `TABLES`, backup tự động lấy hết cột) — chỉ cần rà soát lại không cần đổi gì ở tool backup.

---

## 5. Thiết kế API — route `/api/chat` trong `worker.js`

### 5.1 Vị trí sửa

Trong hàm `fetch(request, env)` hiện tại của `worker.js` (đang chỉ có `return env.ASSETS.fetch(request)`), thêm rẽ nhánh theo `request.url` **trước** khi fallback về hành vi cũ:

```js
async fetch(request, env) {
  const url = new URL(request.url);
  if (url.pathname === '/api/chat' && request.method === 'POST') {
    return handleChat(request, env);
  }
  return env.ASSETS.fetch(request); // hành vi cũ — GIỮ NGUYÊN
}
```

### 5.2 Luồng xử lý đề xuất trong `handleChat()`

1. Đọc body JSON: `{ session_id, message, lang_hint }` (`lang_hint` là ngôn ngữ khách đang chọn trên trang, từ FR-CB-13 — dùng làm gợi ý, AI vẫn nên tự nhận diện ngôn ngữ thực tế của câu hỏi).
2. Rate limit đơn giản theo IP (`request.headers.get('CF-Connecting-IP')`) — ví dụ giới hạn N câu hỏi/phút (Claude Code chọn cơ chế phù hợp, vd đếm tạm trong bộ nhớ Worker hoặc Supabase).
3. Đọc dữ liệu Visa liên quan từ Supabase (service role) — nếu câu hỏi có nhắc tên quốc gia, ưu tiên lấy đúng dòng `danh_muc_nuoc`/`dich_vu_gia` của quốc gia đó.
4. Ghép system prompt (xem 5.3) + dữ liệu thật + câu hỏi khách → gọi Cloudflare Workers AI.
5. Nếu AI call lỗi hoặc hết quota (bắt exception) → trả fallback tĩnh (FR-CB-14), **không throw lỗi trắng trang**.
6. Ghi tin nhắn khách + tin nhắn AI vào `chat_logs` (2 dòng: `role='user'` và `role='assistant'`).
7. Nếu phát hiện khách để lại tên + SĐT hợp lệ trong tin nhắn (dùng lại đúng regex `isValidPhone()` đã có trong `index.html`) → insert `leads` (`nguon='Từ Chatbot'`), cập nhật `chat_logs.lead_id` cho các dòng cùng `session_id`.
8. Trả JSON `{ reply, lang }` về client.

### 5.3 System prompt — nguyên tắc bắt buộc

- Chỉ trả lời trong phạm vi dịch vụ Visa của Top Visa.
- Chỉ dùng số liệu (phí, thời gian, checklist) được truyền vào trong prompt (lấy từ Supabase) — **không tự suy diễn/bịa** số liệu không có trong dữ liệu truyền vào.
- Khi không chắc hoặc câu hỏi ngoài phạm vi dữ liệu có sẵn → trả lời "chưa chắc chắn, vui lòng liên hệ hotline/Zalo để được tư vấn chính xác" thay vì đoán.
- Trả lời đúng ngôn ngữ của câu hỏi (Việt hoặc Anh), giọng văn thân thiện, ngắn gọn.
- Luôn kết thúc bằng gợi ý liên hệ (hotline/Zalo) khi câu trả lời liên quan tới quyết định của khách (phí, hồ sơ, thời gian).

### 5.4 Fallback khi hết quota AI free

- Bọc lời gọi Workers AI trong `try/catch` — khi lỗi (hết quota, timeout, lỗi mạng...), trả về tin nhắn tĩnh song ngữ, ví dụ: *"Hiện hệ thống đang bận, vui lòng gọi hotline 0935 887 922 hoặc chat Zalo để được tư vấn ngay."* — không để lỗi hiển thị ra khách hàng, không throw 500.

### 5.5 Cấu hình Workers AI trong `wrangler.toml`

- Cần thêm binding AI (cú pháp tham khảo tại thời điểm viết đặc tả: `[ai]` + `binding = "AI"`) — **Claude Code kiểm tra lại cú pháp/tên binding mới nhất trong tài liệu chính thức Cloudflare Workers AI trước khi thêm**, vì cấu hình Cloudflare đã từng đổi giữa các lần deploy dự án này (xem `01_Docs/08_Ban_giao_Claude_Code.md` mục 3 — bài học "giao diện/cấu hình Cloudflare có thể đổi, không đoán theo tài liệu cũ").

---

## 6. Thiết kế giao diện

### 6.1 Chat widget (`index.html`)

- Vị trí: `position:fixed`, góc dưới phải, xếp **phía trên** `.float-zalo` hiện có (không đổi vị trí 2 nút đang có: Zalo góc dưới phải, scroll-top góc dưới trái).
- Trạng thái đóng: 1 icon tròn nổi. Trạng thái mở: khung chat (full-width trên mobile, khung cố định ~360-400px trên desktop).
- Nội dung mở đầu: lời chào + danh sách nút bấm nhanh (FR-CB-02) + ô nhập tự do bên dưới.
- Style dùng biến CSS/màu đã có sẵn trong `index.html` (`--color-primary` v.v.) để đồng bộ giao diện, không tạo bảng màu riêng.

### 6.2 Toggle ngôn ngữ toàn site (`index.html`, Release 2)

- Vị trí nút: trong menu chính, cạnh nút "Đăng ký" (đề xuất, Claude Code có thể điều chỉnh nếu layout hiện tại không phù hợp).
- Cơ chế: từ điển chuỗi tập trung 1 nơi (ví dụ object JS `I18N = { vi: {...}, en: {...} }` khai báo đầu file), mọi chuỗi tĩnh hiển thị qua key tra từ điển thay vì hard-code — **rà soát toàn bộ section**: banner/hero, dịch vụ, lợi ích, quy trình, đánh giá, FAQ, form đăng ký, footer, `<title>`.
- Mặc định tiếng Việt. Lưu lựa chọn bằng `localStorage` (không cần backend), áp dụng lại ngay khi trang load nếu đã có lựa chọn trước đó.
- Nội dung lấy động từ Supabase (`posts`, `dich_vu_gia`, `danh_muc_nuoc`): khi toggle = EN, đọc cột `_en` tương ứng (xem mục 4.4) thay vì cột tiếng Việt gốc. **Nếu cột `_en` là `NULL`/rỗng → fallback hiển thị bản tiếng Việt kèm nhãn nhận biết nhỏ** (FR-CB-17) — không được để trống hoặc lỗi JS.
- **FAQ dùng cho JSON-LD `FAQPage` (SEO) — đã chốt (bản 1.1, theo khuyến nghị Claude ở báo cáo khả thi mục 3.1):** giữ nguyên khối `<script type="application/ld+json">` ở **tiếng Việt**, không sinh thêm bản tiếng Anh song song, kể cả khi khách toggle sang EN. Lý do: toggle là client-side, cùng 1 URL, không có `hreflang` — Googlebot lập chỉ mục theo bản render mặc định (Việt), nên JSON-LD tiếng Anh trên cùng URL không mang lại lợi ích SEO rõ rệt. Đây là quyết định cuối, **không cần hỏi lại PM**; nếu sau này PM muốn SEO tiếng Anh thật sự, cần dự án riêng (URL `/en/` + `hreflang`, xem O7 mục 1.2).

### 6.3 Admin — tab "Quản lý Chat" (`admin.html`, Release 1)

- Thêm 1 tab mới cạnh tab "Tư vấn" hiện có (`switchTab('chat')` theo đúng pattern `switchTab()` đang dùng).
- Danh sách: mỗi dòng là 1 phiên chat (`session_id`), hiển thị thời gian, tên/SĐT nếu có (join `leads` qua `lead_id`), số tin nhắn.
- Xem chi tiết: dialog theo đúng convention `01_Docs/10_Chuan_Dialog_Chung.md` (`dlg-standard`/`dlg-head`/`dlg-body`/`dlg-foot`), hiển thị toàn bộ tin nhắn của phiên theo thứ tự thời gian.
- Xoá: nút xoá từng record/phiên, **bắt buộc có hộp thoại xác nhận** trước khi xoá thật (dữ liệu cá nhân, xoá xong không khôi phục được).

### 6.4 Admin — nhập nội dung song ngữ cho `posts`/`dich_vu_gia`/`danh_muc_nuoc` (mới, bản 1.1, Release 2)

- Trong form sửa/thêm hiện có của từng bảng (`admin.html`), thêm ô nhập tiếng Anh **ngay cạnh** ô tiếng Việt tương ứng (ví dụ: ô "Tiêu đề" cạnh ô "Tiêu đề (EN)"), không tạo màn hình riêng — giữ trải nghiệm chỉnh sửa liền mạch cho PM.
- Không bắt buộc nhập ngay (FR-CB-16) — để trống được, hệ thống fallback tự động (FR-CB-17).
- Đề xuất thêm chỉ báo nhỏ trong danh sách (ví dụ icon/badge) cho biết bản ghi nào **chưa có** bản dịch tiếng Anh, giúp PM dễ rà soát và bổ sung dần — giảm rủi ro R10/R9 (edge case nội dung thiếu bản Anh) đã nêu trong báo cáo khả thi.

---

## 7. Nội dung song ngữ cần chuẩn bị trước khi code

| Release | Hạng mục | Nguồn nội dung tiếng Việt | Việc cần làm |
|---|---|---|---|
| 1 | ~6-8 câu hỏi nhanh trong Chat Box | FAQ tĩnh hiện có trong `index.html` (`<section id="faq">`) | Dịch tay sang tiếng Anh, không để AI tự dịch (tránh sai thuật ngữ — xem rủi ro R2/R7 báo cáo khả thi) |
| 1 | Tin nhắn hệ thống của Chat Box | Mới soạn (lời chào, fallback hết quota, thông báo đã ghi nhận thông tin liên hệ...) | Soạn song ngữ ngay từ đầu |
| 2 | Toàn bộ chuỗi UI tĩnh của `index.html` | Nội dung hiện có trong từng section | Liệt kê đầy đủ thành từ điển, dịch tay hoặc nhờ AI dịch nháp rồi rà soát lại bởi người biết tiếng Anh trước khi đưa vào production |
| 2 | *(Mới, bản 1.1)* Nội dung động: bài viết (`posts`), giá theo quốc gia (`dich_vu_gia`), thông tin quốc gia (`danh_muc_nuoc`) | Dữ liệu hiện có trong Supabase, admin quản lý qua `admin.html` | **Admin tự nhập** bản tiếng Anh vào các ô `_en` mới (mục 6.4) — không dùng AI dịch tự động; PM chủ động rà soát/bổ sung dần sau khi Release 2 lên production |

---

## 8. Checklist nghiệm thu

**Release 1 — Chat Box:**

| FR liên quan | Kịch bản kiểm thử | Kết quả mong đợi |
|---|---|---|
| FR-CB-01 | Mở trang trên mobile và desktop | Nút Chat Box không đè `.float-zalo`/`.scroll-top-btn` |
| FR-CB-02, 04 | Bấm từng nút hỏi nhanh | Trả lời đúng dữ liệu thật (đối chiếu với `admin.html` → Cài đặt chung → Nước đến) |
| FR-CB-03, 05 | Gõ câu hỏi tự do bằng tiếng Việt, rồi bằng tiếng Anh | AI trả lời đúng ngôn ngữ tương ứng, không bịa số liệu |
| FR-CB-07, 08 | Để lại tên + SĐT hợp lệ trong chat | Xuất hiện lead mới trong `admin.html` tab Tư vấn, có chuông thông báo |
| FR-CB-09, 10, 11 | Chat vài lượt rồi mở tab "Quản lý Chat" | Thấy đúng phiên chat vừa thực hiện, xem được toàn bộ nội dung |
| FR-CB-12 | Bấm xoá 1 phiên chat | Có hộp thoại xác nhận; sau khi xác nhận, phiên biến mất khỏi danh sách và khỏi Supabase |
| FR-CB-14 | Giả lập lỗi gọi AI (vd sai binding tạm thời) | Chat trả lời fallback mời gọi hotline, không lỗi trắng trang |
| FR-CB-15 | Gửi liên tục nhiều câu hỏi trong thời gian ngắn | Bị giới hạn theo rate limit đã đặt, không crash Worker |

**Release 2 — Chuyển ngữ toàn site:**

| FR liên quan | Kịch bản kiểm thử | Kết quả mong đợi |
|---|---|---|
| FR-CB-13 | Bấm toggle sang tiếng Anh, tải lại trang | Toàn bộ nội dung tĩnh hiển thị tiếng Anh; lựa chọn được nhớ sau khi tải lại |
| FR-CB-13 | Xem `<script type="application/ld+json">` FAQPage khi đang ở chế độ EN | JSON-LD vẫn giữ nguyên tiếng Việt (đúng theo quyết định mục 6.2), không lỗi/không trùng lặp block |
| FR-CB-16 | Admin nhập bản tiếng Anh cho 1 bài viết/1 dòng giá/1 quốc gia qua `admin.html` | Lưu thành công vào đúng cột `_en`; hiển thị lại đúng khi mở form sửa |
| FR-CB-17 | Khách chọn EN, xem 1 bản ghi **đã có** `_en` và 1 bản ghi **chưa có** `_en` | Bản ghi có `_en` hiển thị đúng tiếng Anh; bản ghi chưa có hiển thị fallback tiếng Việt kèm nhãn nhận biết, không trống/không lỗi |

---

## 9. Thứ tự triển khai đề xuất

> Xem thêm mục 5.7 trong `Bao_cao_Phan_tich_Kha_thi_Chatbox.md` (bản 1.3) — danh sách đầy đủ các bước kèm mức ưu tiên, chia theo Release. Tóm tắt nhóm việc chính:

**RELEASE 1 — Chat Box (triển khai ngay, bàn giao trước):**

1. **Nhóm A — Chat cơ bản (ưu tiên cao nhất, có thể demo sớm):** FR-CB-01, 02, 06.
2. **Nhóm B — AI + lưu dữ liệu:** FR-CB-03, 04, 05, 07, 08, 09, 14, 15 (mục 4, 5 tài liệu này).
3. **Nhóm C — Admin quản lý chat:** FR-CB-10, 11, 12 (mục 6.3).

**RELEASE 2 — Chuyển ngữ toàn site (làm sau, khi Release 1 đã bàn giao và chạy ổn định):**

4. **Nhóm D — Chuyển ngữ nội dung tĩnh:** FR-CB-13 (mục 6.2, 7).
5. **Nhóm E — Cột song ngữ nội dung động (mới, bản 1.1):** FR-CB-16, 17 (mục 4.4, 6.4, 7).

---

## 10. Phụ lục — tham chiếu nhanh trong source hiện tại

| Cần biết | Xem ở đâu |
|---|---|
| Quy tắc chung dự án, bí mật, migration | `CLAUDE.md` (thư mục gốc) |
| Convention dialog admin | `01_Docs/10_Chuan_Dialog_Chung.md` |
| Ví dụ tab danh sách + filter + modal tương tự tab Chat mới | `admin.html`, tab `tab-tuvan` (tìm `switchTab('tuvan')`) |
| Schema `leads` hiện tại | `05_Database/01_supabase_setup.sql` + `02_supabase_setup_phase2.sql` (thêm `email`/`link_fb`/`muc_dich`/`ngay_nhac_lai`/`nguon`) |
| Schema `danh_muc_nuoc` (phí/thời gian/checklist) | `05_Database/02_supabase_setup_phase2.sql` + `06_supabase_setup_phase6.sql` |
| Schema `dich_vu_gia` (giá hiển thị landing page) | `05_Database/07_supabase_setup_phase7.sql` |
| Schema `posts` (bài viết/kinh nghiệm) | Tìm trong `05_Database/` — rà soát các file phase đã có trước khi thêm cột `_en` (mục 4.4) |
| Cách `index.html` gọi Supabase REST hiện tại | `02_Source/index.html`, tìm `SUPABASE_URL`/`SUPABASE_ANON_KEY` |
| Cách `worker.js` gọi Supabase bằng service role | `02_Source/worker.js`, hàm `supa()` |
| Regex validate số điện thoại VN đang dùng | `02_Source/index.html`, hàm `isValidPhone()` |
| Lịch sử deploy/cấu hình Cloudflare thật (có thể đã đổi giao diện) | `01_Docs/08_Ban_giao_Claude_Code.md` mục 3 |
| Quy tắc cập nhật tool backup khi thêm bảng mới | `05_Database/README.md`, `06_Backup_Tool/README.md` |
