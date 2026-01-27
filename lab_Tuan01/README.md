# Product Management System

Hệ thống quản lý sản phẩm đơn giản với Node.js, Express, MySQL và EJS.

## Cài đặt

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Setup database

Chạy file `db/setup.sql` trong MySQL:

```bash
mysql -u root -p < db/setup.sql
```

Hoặc import thủ công vào MySQL Workbench/phpMyAdmin.

### 3. Cấu hình database

Kiểm tra file `db/mysql.js` và cập nhật thông tin kết nối nếu cần:

```javascript
{
    host: 'localhost',
    user: 'root',
    database: 'shopdb',
    port: 3306
}
```

### 4. Chạy ứng dụng

```bash
node app.js
```

Truy cập: http://localhost:3000

## Đăng nhập

**Username**: `admin`  
**Password**: `admin`

## Công nghệ sử dụng

- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Template Engine**: EJS
- **Session**: express-session
- **CSS**: Vanilla CSS

## Tác giả

Nguyễn Hoàng Khải - 22714331
