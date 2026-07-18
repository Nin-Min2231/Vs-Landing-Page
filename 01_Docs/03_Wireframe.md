# 03. Wireframe (Bản phác thảo bố cục)

Wireframe = bản vẽ khung, chỉ thể hiện VỊ TRÍ các khối, chưa phải màu sắc/hình ảnh thật.

## 1. Desktop (≥1024px)

```
┌─────────────────────────────────────────────────────────────┐
│ NAVBAR (dính trên cùng khi cuộn)                            │
│ [Logo]   Dịch vụ | Lợi ích | Đánh giá | FAQ   [Đăng ký ✈]  │
├─────────────────────────────────────────────────────────────┤
│ #banner                                                      │
│ ┌───────────────────────────┐  ┌─────────────────────────┐  │
│ │ H1: Dịch vụ Visa trọn gói │  │                         │  │
│ │ Sub: Tỷ lệ đậu cao, xử lý │  │   Hình minh họa /       │  │
│ │ nhanh, hỗ trợ 24/7        │  │   ảnh hộ chiếu+vé bay   │  │
│ │ [Đăng ký tư vấn miễn phí] │  │                         │  │
│ │ ✓ 5000+ hồ sơ  ✓ 98% đậu  │  │                         │  │
│ └───────────────────────────┘  └─────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│ #dich-vu   H2: Dịch vụ Visa các quốc gia                    │
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                │
│ │🇯🇵 Nhật │ │🇰🇷 Hàn  │ │🇹🇼 Đài  │ │🇨🇳 Trung│   (grid 4    │
│ │Từ x đ  │ │Từ x đ  │ │Loan    │ │Quốc    │    cột)      │
│ │[Tư vấn]│ │[Tư vấn]│ │[Tư vấn]│ │[Tư vấn]│               │
│ └────────┘ └────────┘ └────────┘ └────────┘                │
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                │
│ │🇪🇺 Schen│ │🇺🇸 Mỹ   │ │🇦🇺 Úc   │ │🌏 Khác │                │
│ └────────┘ └────────┘ └────────┘ └────────┘                │
├─────────────────────────────────────────────────────────────┤
│ #loi-ich   H2: Vì sao chọn chúng tôi                        │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐                     │
│ │ ⚡ Nhanh  │ │ 🎯 Tỷ lệ │ │ 💰 Giá   │  (grid 3 cột       │
│ │ chóng    │ │ đậu cao  │ │ minh bạch│   × 2 hàng)        │
│ └──────────┘ └──────────┘ └──────────┘                     │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐                     │
│ │ 🕐 Hỗ trợ│ │ 📋 Trọn  │ │ 🔒 Bảo   │                     │
│ │ 24/7     │ │ gói A-Z  │ │ mật      │                     │
│ └──────────┘ └──────────┘ └──────────┘                     │
├─────────────────────────────────────────────────────────────┤
│ #quy-trinh  H2: Quy trình 4 bước                            │
│  (1)───────→(2)───────→(3)───────→(4)                       │
│  Tư vấn     Chuẩn bị    Nộp        Nhận                     │
│  miễn phí   hồ sơ       hồ sơ      kết quả                  │
├─────────────────────────────────────────────────────────────┤
│ #danh-gia  H2: Khách hàng nói gì                            │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐                        │
│ │★★★★★    │ │★★★★★    │ │★★★★★    │  (grid 3 cột)          │
│ │"Review" │ │"Review" │ │"Review" │                        │
│ │- Tên KH │ │- Tên KH │ │- Tên KH │                        │
│ └─────────┘ └─────────┘ └─────────┘                        │
├─────────────────────────────────────────────────────────────┤
│ #faq  H2: Câu hỏi thường gặp                                │
│ ▸ Thời gian xin visa mất bao lâu?              [accordion]  │
│ ▸ Trượt visa có được hoàn tiền không?                       │
│ ▸ Cần chuẩn bị giấy tờ gì? ...                              │
├─────────────────────────────────────────────────────────────┤
│ #dang-ky  (nền màu nhấn, nổi bật)                           │
│ ┌──────────────────┐  ┌──────────────────────────────────┐ │
│ │ H2: Đăng ký tư   │  │ [Họ và tên *          ]          │ │
│ │ vấn miễn phí     │  │ [Số điện thoại *      ]          │ │
│ │ Cam kết phản hồi │  │ [Quốc gia ▼           ]          │ │
│ │ trong 24h        │  │ [Ghi chú...           ]          │ │
│ │ ☎ Hotline        │  │ [    GỬI ĐĂNG KÝ →   ]          │ │
│ └──────────────────┘  └──────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ FOOTER (nền tối)                                            │
│ [Logo+giới thiệu] [Dịch vụ] [Liên hệ: ĐC/SĐT/Email] [MXH]  │
│ © 2026 [TÊN CÔNG TY]. GPKD số [THAY_THẾ]                    │
└─────────────────────────────────────────────────────────────┘
                                          ┌────┐
                        Nút nổi góc phải: │ 📞 │ Gọi
                        (luôn hiển thị)   │ 💬 │ Zalo
                                          │ Ⓜ  │ Messenger
                                          └────┘
```

## 2. Tablet (768–1023px)

Khác biệt so với Desktop:

| Section | Thay đổi |
|---|---|
| Navbar | Giữ menu ngang, thu gọn khoảng cách |
| Banner | 2 cột giữ nguyên nhưng hẹp hơn; hoặc ảnh thu nhỏ |
| Dịch vụ | Grid 4 cột → **3 cột** |
| Lợi ích | Grid 3 cột → **2 cột** |
| Đánh giá | 3 cột → **2 cột** |
| Form | 2 cột → giữ 2 cột nhưng hẹp |
| Footer | 4 cột → 2 cột |

## 3. Mobile (<768px)

```
┌──────────────────────┐
│ [Logo]          [☰] │  ← menu hamburger
├──────────────────────┤
│ #banner (1 cột)      │
│ H1: Dịch vụ Visa     │
│ Sub ngắn gọn         │
│ [Đăng ký tư vấn]     │  ← nút full-width
│ ✓ 5000+ hồ sơ 98% đậu│
│ (ảnh minh họa nhỏ)   │
├──────────────────────┤
│ #dich-vu (2 cột)     │
│ ┌──────┐ ┌──────┐    │
│ │🇯🇵 Nhật│ │🇰🇷 Hàn │    │
│ └──────┘ └──────┘    │
│ ┌──────┐ ┌──────┐    │
│ │🇹🇼 ĐL │ │🇨🇳 TQ  │    │
│ └──────┘ └──────┘ …  │
├──────────────────────┤
│ #loi-ich (1 cột dọc) │
│ ┌──────────────────┐ │
│ │ ⚡ Nhanh chóng    │ │
│ └──────────────────┘ │
│ ┌──────────────────┐ │
│ │ 🎯 Tỷ lệ đậu cao │ │
│ └──────────────────┘ │
├──────────────────────┤
│ #quy-trinh (dọc)     │
│ (1) Tư vấn           │
│  ↓                   │
│ (2) Hồ sơ ...        │
├──────────────────────┤
│ #danh-gia (1 cột,    │
│  vuốt ngang)         │
├──────────────────────┤
│ #faq (accordion)     │
├──────────────────────┤
│ #dang-ky (1 cột)     │
│ [Họ tên *]           │
│ [SĐT *]              │
│ [Quốc gia ▼]         │
│ [Ghi chú]            │
│ [GỬI ĐĂNG KÝ] full-w │
├──────────────────────┤
│ FOOTER (1 cột)       │
└──────────────────────┘
  Nút nổi 📞💬Ⓜ góc phải dưới
  (kích thước ≥48px, cách đáy 16px)
```

**Nguyên tắc mobile-first:** 70%+ khách ngành visa vào từ điện thoại (quảng cáo Facebook/Zalo), nên mọi quyết định thiết kế ưu tiên mobile trước: nút to dễ bấm (≥44px), font ≥16px, form ngắn gọn, nút gọi điện luôn trong tầm ngón cái.

---

## ⚠️ Rà soát

| # | Vấn đề | Loại | Impact | Đề xuất |
|---|---|---|---|---|
| 1 | 3 nút nổi có thể che nội dung form trên màn hình nhỏ | Edge case | Trung bình | Đã xử lý: nút thu gọn thành 1 nút chính, bấm mới bung 3 lựa chọn |
| 2 | Banner có ảnh lớn → chậm trên 3G/4G yếu | Risk | Trung bình | Dùng ảnh WebP nén <150KB hoặc minh họa CSS/SVG |
| 3 | 8 card quốc gia trên mobile khá dài | Edge case | Thấp | Grid 2 cột + card gọn; cân nhắc nút "Xem thêm" nếu >8 quốc gia |
