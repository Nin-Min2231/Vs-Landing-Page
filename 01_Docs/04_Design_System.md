# 04. Design System & Component List

Design System = bộ quy tắc thiết kế thống nhất (màu, chữ, khoảng cách...) để mọi phần của website đồng bộ và dễ bảo trì. Tất cả giá trị dưới đây đã được cài sẵn trong `index.html` dưới dạng CSS variables — muốn đổi màu toàn site chỉ cần sửa 1 chỗ.

## 1. Màu sắc (Color Palette)

Phong cách: tươi sáng, tin cậy, hiện đại — lấy cảm hứng từ iVisa/Atlys (xanh dương chủ đạo + cam nhấn) nhưng không sao chép.

| Vai trò | Tên biến CSS | Mã màu | Dùng cho |
|---|---|---|---|
| Primary | `--color-primary` | `#1B6EF3` | Nút chính, link, tiêu đề nhấn |
| Primary Dark | `--color-primary-dark` | `#0F4FC2` | Hover nút, navbar khi cuộn |
| Primary Light | `--color-primary-light` | `#E8F1FE` | Nền section nhạt, badge |
| Accent (CTA) | `--color-accent` | `#FF7A29` | Nút "Đăng ký tư vấn" — màu nổi bật duy nhất |
| Accent Dark | `--color-accent-dark` | `#E5661A` | Hover nút CTA |
| Success | `--color-success` | `#16A34A` | Thông báo thành công, dấu ✓ |
| Error | `--color-error` | `#DC2626` | Lỗi validate form |
| Text chính | `--color-text` | `#1E293B` | Nội dung chữ |
| Text phụ | `--color-text-muted` | `#64748B` | Mô tả, caption |
| Nền trắng | `--color-bg` | `#FFFFFF` | Nền chung |
| Nền xám nhạt | `--color-bg-alt` | `#F6F9FE` | Section xen kẽ |
| Nền tối | `--color-dark` | `#0F1E3D` | Footer |
| Viền | `--color-border` | `#E2E8F0` | Border card, input |

Quy tắc: tối đa 2 màu chủ đạo (xanh + cam). Cam CHỈ dùng cho hành động quan trọng nhất (CTA) để dẫn mắt.

Contrast đã kiểm tra: chữ trắng trên `#1B6EF3` = 4.6:1 ✓; chữ `#1E293B` trên trắng = 14.9:1 ✓ (đạt WCAG AA).

## 2. Typography (Chữ)

| Mục | Giá trị |
|---|---|
| Font | `Be Vietnam Pro` (Google Fonts, hỗ trợ tiếng Việt tốt), fallback: system-ui, sans-serif |
| H1 | 40px / bold (mobile: 28px) |
| H2 (tiêu đề section) | 32px / bold (mobile: 24px) |
| H3 (tiêu đề card) | 20px / semibold (mobile: 18px) |
| Body | 16px / regular, line-height 1.6 |
| Small/Caption | 14px |
| Nút | 16px / semibold |

## 3. Khoảng cách (Spacing)

Hệ 8px — mọi khoảng cách là bội số của 8:

| Token | Giá trị | Dùng cho |
|---|---|---|
| `--sp-1` | 8px | Khoảng cách nhỏ trong component |
| `--sp-2` | 16px | Padding nút, gap giữa item |
| `--sp-3` | 24px | Padding card |
| `--sp-4` | 32px | Gap giữa các khối |
| `--sp-6` | 48px | Padding section (mobile) |
| `--sp-10` | 80px | Padding section (desktop) |
| Container | `.container` | max-width 1200px, căn giữa, padding ngang 16–24px (tăng từ 1140px lên 1200px 2026-07-31 — theo chuẩn container hiện đại của Tailwind/Bootstrap 5, vẫn giữ độ rộng vừa phải để không phá dòng chữ dài trên màn hình lớn) |

## 4. Border Radius & Shadow

| Token | Giá trị | Dùng cho |
|---|---|---|
| `--radius-sm` | 8px | Input, nút nhỏ |
| `--radius-md` | 12px | Nút chính, badge |
| `--radius-lg` | 16px | Card |
| `--radius-full` | 999px | Nút nổi tròn, tag |
| `--shadow-sm` | `0 1px 3px rgba(15,30,61,.08)` | Card mặc định |
| `--shadow-md` | `0 8px 24px rgba(15,30,61,.12)` | Card hover, navbar |
| `--shadow-lg` | `0 16px 40px rgba(15,30,61,.16)` | Modal, form nổi |

## 5. Icon

| Mục | Quyết định | Lý do |
|---|---|---|
| Bộ icon | Emoji + SVG inline | Không cần tải thư viện ngoài → nhanh, không phụ thuộc |
| Cờ quốc gia | Emoji cờ (🇯🇵🇰🇷🇺🇸...) | Hiển thị tốt mọi thiết bị, nhẹ |
| Nâng cấp sau | Lucide Icons (miễn phí) | Khi cần bộ icon chuyên nghiệp đồng bộ |

## 6. Component List (詳細設計 – Thiết kế chi tiết)

| # | Component | Variant/State | Mô tả hành vi |
|---|---|---|---|
| 1 | **Button** | Primary (xanh), CTA (cam), Outline, Ghost | Hover: đậm màu + nhấc nhẹ (translateY -2px); Disabled: mờ 50%, không bấm được; Loading: hiện chữ "Đang gửi..." |
| 2 | **Input** | Default, Focus (viền xanh), Error (viền đỏ + câu lỗi dưới ô), Disabled | Label phía trên; dấu * đỏ cho trường bắt buộc; lỗi hiện ngay khi rời ô (blur) |
| 3 | **Select (Dropdown)** | Default, Focus, Error | Danh sách quốc gia; option đầu "-- Chọn quốc gia --" |
| 4 | **Textarea** | Default, Focus | Ghi chú, 3 dòng, tự giãn |
| 5 | **Card dịch vụ** | Default, Hover (nhấc + shadow-md) | Cờ, tên nước, mô tả 1 dòng, giá từ, nút "Tư vấn" cuộn tới form và tự chọn sẵn quốc gia |
| 6 | **Card lợi ích** | Default | Icon tròn nền xanh nhạt + tiêu đề + mô tả |
| 7 | **Card đánh giá** | Default | 5 sao, nội dung, avatar chữ cái + tên + loại visa |
| 8 | **Navbar** | Top (trong suốt trên banner), Scrolled (nền trắng + shadow), Mobile (hamburger → menu trượt xuống) | Dính trên cùng (sticky); bấm link cuộn mượt tới section |
| 9 | **Footer** | 1 kiểu | 4 cột desktop / 1 cột mobile: giới thiệu, dịch vụ, liên hệ, MXH + dòng bản quyền |
| 10 | **Form đăng ký** | Default, Submitting, Success, Error | Validate client; chống spam 60s; thành công → thay form bằng thông báo ✓ |
| 11 | **Modal/Toast thông báo** | Success (xanh lá), Error (đỏ) | Toast trượt lên góc dưới, tự ẩn sau 5s |
| 12 | **FAQ Accordion** | Đóng, Mở | Bấm câu hỏi → bung trả lời, mũi tên xoay; mở câu mới không tự đóng câu cũ |
| 13 | **Banner (Hero)** | Desktop 2 cột, Mobile 1 cột | H1 + sub + CTA + số liệu tin cậy (badge) |
| 14 | **Floating Contact (nút nổi)** | Thu gọn (1 nút 💬), Bung (3 nút: Gọi/Zalo/Messenger) | Cố định góc phải dưới; mobile ≥48px; có nhãn khi hover |
| 15 | **Section Process (quy trình)** | Desktop ngang, Mobile dọc | 4 bước đánh số, đường nối |
| 16 | **Badge số liệu** | 1 kiểu | "✓ 5000+ hồ sơ", "✓ 98% tỷ lệ đậu" |

---

## ⚠️ Rà soát

| # | Vấn đề | Loại | Impact | Đề xuất |
|---|---|---|---|---|
| 1 | Emoji cờ hiển thị khác nhau giữa Windows/Mac/Android | Edge case | Thấp | Chấp nhận giai đoạn đầu; nâng cấp ảnh SVG cờ (flagcdn.com, miễn phí) khi cần đồng bộ |
| 2 | Số liệu "5000+ hồ sơ, 98% đậu" là placeholder — nếu không đúng thực tế sẽ vi phạm quảng cáo | Risk | Cao | Thay bằng số liệu thật hoặc bỏ trước khi chạy quảng cáo |
| 3 | Font Google Fonts cần mạng — mất mạng font đổi fallback | Edge case | Thấp | Đã có fallback system-ui, chấp nhận được |
