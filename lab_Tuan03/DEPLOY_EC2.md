# Hướng dẫn Deploy Ứng dụng Node.js lên AWS EC2

Tài liệu này hướng dẫn chi tiết các bước để deploy ứng dụng Lab Tuần 03 (Node.js + DynamoDB + S3) lên một máy chủ ảo AWS EC2.

## 1. Chuẩn bị AWS EC2 Instance

1.  **Đăng nhập vào AWS Console**: Truy cập [console.aws.amazon.com](https://console.aws.amazon.com).
2.  **Khởi tạo Instance**:
    *   Vào dịch vụ **EC2** -> chọn **Launch Instances**.
    *   **Name**: Đặt tên (ví dụ: `Lab03-Nodejs-Server`).
    *   **OS Image**: Chọn **Ubuntu Server 22.04 LTS** (Khuyên dùng vì dễ cài đặt).
    *   **Instance Type**: Chọn `t2.micro` (Free Tier eligible).
    *   **Key Pair**: Chọn key pair hiện có hoặc tạo mới (Lưu file `.pem` cẩn thận để SSH).
3.  **Cấu hình Network (Security Group)**:
    *   Cho phép SSH (Port 22) từ IP của bạn (hoặc Anywhere `0.0.0.0/0` để dễ test).
    *   Cho phép HTTP (Port 80) từ Anywhere.
    *   Cho phép HTTPS (Port 443) từ Anywhere.
    *   **Quan trọng**: Thêm Custom TCP Rule cho Port **3000** (Port mặc định của ứng dụng) từ Anywhere.
4.  **Launch Instance**.

## 2. Kết nối SSH vào Server

Sử dụng terminal (Git Bash, PowerShell hoặc CMD) để kết nối:

```bash
# Thay key.pem bằng đường dẫn file key của bạn
# Thay ec2-user-ip bằng Public IP của Instance
ssh -i "path/to/your-key.pem" ubuntu@<PUBLIC_IP_EC2>
```

## 3. Cài đặt Môi trường trên Server

Sau khi SSH thành công, chạy các lệnh sau để cài đặt Node.js và Git:

```bash
# Cập nhật hệ thống
sudo apt update
sudo apt upgrade -y

# Cài đặt Node.js (phiên bản 18.x hoặc 20.x LTS)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Kiểm tra version
node -v
npm -v

# Cài đặt Git (thường có sẵn)
sudo apt install git -y
```

## 4. Tải Code về Server

Bạn có thể clone từ GitHub hoặc upload code thủ công.

### Cách 1: Clone từ GitHub (Khuyên dùng)
Đảm bảo code của bạn đã được đẩy lên GitHub (repo public hoặc private).

```bash
git clone https://github.com/hoangkhai1905/TH_CNM.git
cd TH_CNM
```

*Nếu repo private, bạn cần cấu hình SSH key hoặc dùng HTTPS với Personal Access Token.*

### Cách 2: Upload thủ công (SCP)
Nếu không dùng Git, bạn có thể copy file từ máy local lên server:

```bash
# Chạy từ máy local của bạn
scp -i "key.pem" -r ./lab_Tuan03 ubuntu@<PUBLIC_IP>:~/app
```

## 5. Cài đặt Dependencies và Cấu hình Biến Môi trường

```bash
# Di chuyển vào thư mục dự án CHỨA CODE (nơi có file package.json)
# Nếu bạn clone cả repo TH_CNM, thì đường dẫn thường là:
cd TH_CNM/lab_Tuan03

# Kiểm tra xem bạn đang ở đúng chỗ chưa
ls
# Bạn PHẢI thấy các file như: app.js, package.json, .env...

# Cài đặt các thư viện
npm install

# Tạo file .env
nano .env
```

**Nội dung file `.env`**:
Copy nội dung từ file `.env` ở local của bạn và paste vào đây. Đảm bảo cập nhật `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, v.v.

```env
PORT=3000
AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=YOUR_SECRET_KEY
AWS_REGION=ap-southeast-1
AWS_S3_BUCKET_NAME=your-bucket-name
# ... các biến khác
```
Bấm `Ctrl + O` -> `Enter` để lưu, và `Ctrl + X` để thoát.

## 6. Chạy ứng dụng

### Chạy thử nghiệm
```bash
node app.js
```
Truy cập trình duyệt tại: `http://<PUBLIC_IP>:3000`. Nếu web hoạt động, bấm `Ctrl + C` để tắt.

### Chạy bằng PM2 (Production)
Để ứng dụng chạy ngầm và tự khởi động lại khi server reboot, dùng PM2.

```bash
# Cài đặt PM2 global
sudo npm install -g pm2

# Khởi chạy ứng dụng
pm2 start app.js --name "lab03-app"

# Lưu cấu hình để tự khởi động khi reboot
pm2 startup
# (Copy và chạy lệnh mà pm2 hiện ra sau lệnh startup)
pm2 save
```

## 7. Cấu hình Nginx làm Reverse Proxy (Tùy chọn nhưng khuyên dùng)

Để truy cập bằng port 80 (không cần `:3000`), cài Nginx:

```bash
sudo apt install nginx -y

# Chỉnh sửa config
sudo nano /etc/nginx/sites-available/default
```

Thay thế nội dung `location /` bằng:

```nginx
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Lưu file và khởi động lại Nginx:
```bash
sudo systemctl restart nginx
```

Bây giờ bạn có thể truy cập web chỉ bằng IP: `http://<PUBLIC_IP>`.

## 8. Troubleshooting (Gỡ lỗi)

- **Lỗi kết nối**: Kiểm tra Security Group (Inbound Rules) xem đã mở port 3000 (hoặc 80) chưa.
- **Lỗi AWS**: Kiểm tra biến môi trường AWS Credentials trong file `.env`.
- **Xem log PM2**: `pm2 logs`.

## 9. Dừng và Quản lý Ứng dụng

Nếu bạn muốn dừng ứng dụng hoặc gỡ bỏ nó khỏi danh sách chạy của PM2, sử dụng các lệnh sau:

### Dừng ứng dụng
Lệnh này sẽ dừng process nhưng vẫn giữ trong danh sách quản lý của PM2 (có thể start lại nhanh chóng).

```bash
pm2 stop lab03-app
# Hoặc dừng tất cả:
pm2 stop all
```

### Xóa ứng dụng khỏi PM2
Lệnh này dừng và xóa hoàn toàn ứng dụng khỏi danh sách quản lý.

```bash
pm2 delete lab03-app
# Hoặc xóa tất cả:
pm2 delete all
```

### Các lệnh quản lý khác
```bash
# Xem danh sách ứng dụng đang chạy
pm2 list

# Xem chi tiết ứng dụng
pm2 show lab03-app

# Monitor tài nguyên (CPU, RAM)
pm2 monit
```

---
**Hoàn tất!** Bạn đã deploy thành công ứng dụng Node.js lên EC2.
