# Antigravity Project Instructions & Auto-Deployment Rules

## Quy tắc Tự động Triển khai Production (Vercel & GitHub)
- **Tự động cập nhật Production**: Mỗi khi chỉnh sửa bất kỳ file mã nguồn (HTML, CSS, JS), nội dung hoặc tài nguyên nào trong dự án, Antigravity **BẮT BUỘC TỰ ĐỘNG** thực hiện chuỗi lệnh mà không cần chờ người dùng nhắc:
  1. Đồng bộ các file tương ứng giữa thư mục gốc (`/`) và thư mục build (`sites/bonbo-pinball-b2b/dist/`).
  2. Thực hiện `git add .`
  3. Tạo commit với thông điệp chi tiết mô tả thay đổi: `git commit -m "..."`
  4. Push ngay lập tức lên nhánh `main`: `git push origin main`
- **Không cần yêu cầu xác nhận**: Thực hiện tự động ngay sau khi hoàn thành chỉnh sửa file, sau đó thông báo kết quả đã cập nhật lên production cho người dùng.
- **Hệ thống Production**:
  - Domain chính thức: https://maybanbi.online
  - Redirect: https://www.maybanbi.online
  - Vercel Host: https://bonbo-pinball.vercel.app
  - GitHub Repository: https://github.com/trangcv188-cmd/bonbo-pinball.git
