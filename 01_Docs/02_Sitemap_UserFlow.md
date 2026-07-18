# 02. Sitemap & User Flow

## 1. Sitemap (Cấu trúc website)

Giai đoạn 1 là landing page 1 trang (one-page); các mục điều hướng cuộn tới section tương ứng. Trang admin tách riêng, không hiển thị công khai.

```mermaid
flowchart TD
    A["🏠 Trang chủ (index.html)"] --> A1["#banner – Banner chính + CTA"]
    A --> A2["#dich-vu – Dịch vụ Visa theo quốc gia"]
    A --> A3["#loi-ich – Vì sao chọn chúng tôi"]
    A --> A4["#quy-trinh – Quy trình 4 bước"]
    A --> A5["#danh-gia – Đánh giá khách hàng"]
    A --> A6["#faq – Câu hỏi thường gặp"]
    A --> A7["#dang-ky – Form đăng ký tư vấn"]
    A --> A8["#footer – Thông tin liên hệ"]

    B["🔒 Trang quản trị (admin.html)"] --> B1["Đăng nhập"]
    B1 --> B2["Danh sách khách đăng ký (Leads)"]
    B1 --> B3["Quản lý bài viết"]
    B1 --> B4["Quản lý danh mục"]
    B2 --> B5["Xuất CSV/Excel"]

    C["📄 Mở rộng tương lai"] -.-> C1["Blog / Tin tức"]
    C -.-> C2["Trang chi tiết từng quốc gia"]
    C -.-> C3["Đa ngôn ngữ EN/JP"]
```

## 2. User Flow – Khách hàng (luồng chính: đăng ký tư vấn)

```mermaid
flowchart TD
    S([Khách vào trang từ QC/Google/chia sẻ]) --> V[Xem banner + CTA]
    V --> D{Quan tâm?}
    D -- Chưa rõ --> SC[Cuộn xem: Dịch vụ / Lợi ích / Đánh giá / FAQ]
    SC --> D
    D -- Muốn tư vấn ngay --> Q{Chọn cách liên hệ}
    Q -- Gấp, thích nói chuyện --> CALL[Bấm nút Gọi/Zalo/Messenger nổi]
    CALL --> E1([Kết nối trực tiếp ✅])
    Q -- Để lại thông tin --> F[Điền form: Họ tên, SĐT, Quốc gia, Ghi chú]
    F --> VD{Dữ liệu hợp lệ?}
    VD -- Sai --> ER[Hiện lỗi ngay tại ô nhập] --> F
    VD -- Đúng --> SV{Gửi lên server}
    SV -- Thành công --> OK[Thông báo thành công:<br/>Sẽ liên hệ trong 24h]
    OK --> E2([Lead lưu vào Supabase ✅])
    SV -- Lỗi mạng --> FB[Báo lỗi + gợi ý gọi hotline/Zalo] --> Q
    D -- Rời trang --> EX([Thoát ❌ → tối ưu lại nội dung])
```

## 3. User Flow – Admin

```mermaid
flowchart TD
    S([Mở admin.html]) --> L[Nhập email + mật khẩu]
    L --> AU{Xác thực Supabase}
    AU -- Sai --> LE[Báo lỗi] --> L
    AU -- Đúng --> DB[Màn hình quản trị]
    DB --> T1[Tab Leads: xem danh sách,<br/>lọc, đổi trạng thái]
    T1 --> EX[Xuất CSV → mở bằng Excel]
    T1 --> CALL[Gọi/Zalo cho khách → cập nhật trạng thái]
    DB --> T2[Tab Bài viết: thêm/sửa/xóa]
    DB --> T3[Tab Danh mục: thêm/xóa]
    DB --> OUT([Đăng xuất])
```

## 4. Luồng dữ liệu (Data Flow)

```mermaid
flowchart LR
    U[👤 Khách hàng<br/>index.html] -- "INSERT lead<br/>(anon key, chỉ được ghi)" --> SB[(Supabase<br/>PostgreSQL)]
    AD[🔒 Admin<br/>admin.html] -- "Đăng nhập Auth" --> SB
    SB -- "SELECT/UPDATE leads, posts<br/>(chỉ khi đã đăng nhập)" --> AD
    AD -- "Xuất CSV" --> XL[📊 Excel]
    SB -. "Backup định kỳ (CSV)" .-> XL
```

**Giải thích cho người không code:** Supabase là dịch vụ "cơ sở dữ liệu trên mây" miễn phí. Form trên web chỉ có quyền GHI THÊM dữ liệu (không đọc được), nên người ngoài không thể xem danh sách khách. Chỉ admin đăng nhập mới xem/sửa được — cơ chế này gọi là RLS (Row Level Security – bảo mật theo dòng dữ liệu).

---

## ⚠️ Rà soát

| # | Vấn đề | Loại | Impact | Đề xuất |
|---|---|---|---|---|
| 1 | One-page → khó SEO cho từng quốc gia riêng | Risk | Trung bình | Phase mở rộng: tách trang chi tiết `/visa-nhat-ban`... khi cần SEO |
| 2 | Khách bấm nút Zalo trên PC (không cài app) | Edge case | Thấp | Link `zalo.me` tự mở bản web — đã đúng hướng |
| 3 | Flow chưa có bước đo lường (analytics) | Gap | Trung bình | Gắn Google Analytics / Meta Pixel trước khi chạy quảng cáo |
