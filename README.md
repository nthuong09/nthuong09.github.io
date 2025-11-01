<!-- REPLACE WHOLE FILE: /README.md -->
# https://nthuong09.github.io — MXD Canonical Skeleton

Chuẩn áp dụng (theo MXD210):
- **GA4 trước** `/assets/mxd-affiliate.js` (gắn đúng 1 lần/trang). GA4 của NThương: `G-2FQ0YDHWDE`.
- **Canonical tuyệt đối** (https://…).
- Ảnh sản phẩm: `/assets/img/products/<sku>.webp` (tên file = SKU, đuôi `.webp`).
- **affiliates.json** là nguồn sự thật (name, sku, image, price_vnd, origin_url, merchant, category).
- `g.html` tạo Product JSON-LD, auto `noindex` nếu SKU không tồn tại.
- SW: HTML network-first; assets stale-while-revalidate (bump `VERSION` khi đổi asset).
- `store.html`: chỉ có **1 hub "Cửa hàng"**; danh mục con = `/store/<slug>.html` (thêm tile theo MXD Rule 53).

## Triển khai
1) Upload toàn bộ lên repo `nthuong09.github.io` (root) và bật Pages: Settings → Pages → Source = `main` (root).
2) Cấu hình liên hệ:
   - Zalo/Phone: **0912251646**
   - Facebook: **https://www.facebook.com/profile.php?id=61562376418436**
3) Affiliate deep-links (đã set trong `/assets/mxd-affiliate.js`):
   - Shopee: `https://go.isclix.com/deep_link/6838510564673741003/4751584435713464237`
   - TikTok: `https://go.isclix.com/deep_link/6838510564673741003/6648523843406889655`
   - Lazada: `https://go.isclix.com/deep_link/6838510564673741003/5127144557053758578`
   - Mặc định sub: `sub1=sku`, `sub2=merchant`, `sub3=web`, `sub4=nthuong09`.
4) Ảnh danh mục (nếu thiếu), đặt tại `/assets/img/categories/`:
   - `thoi-trang.webp`, `my-pham.webp`, `me-va-be.webp`, `trang-suc.webp`
5) Share link sản phẩm: `https://nthuong09.github.io/g.html?sku=<SKU>`.
6) Mỗi lần cập nhật assets/JS: **bump** `VERSION` trong `/sw.js` rồi hard-refresh.

> Tool nhập liệu: `/tools/nthuong-importer.html` (nhập JSON, upload ảnh, xóa nhanh). Worker endpoints: `/health`, `/git/put`, `/git/rm`.
