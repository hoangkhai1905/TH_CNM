-- Tạo database nếu chưa có
CREATE DATABASE IF NOT EXISTS shopdb;
USE shopdb;

-- Tạo bảng products nếu chưa có
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng users cho login
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Thêm user mặc định (username: admin, password: admin)
INSERT INTO users (username, password) VALUES ('admin', 'admin')
ON DUPLICATE KEY UPDATE username = username;

-- Thêm một số sản phẩm mẫu (optional)
INSERT INTO products (name, price, quantity) VALUES 
('Laptop Dell XPS 13', 25000000, 10),
('iPhone 15 Pro', 30000000, 15),
('Samsung Galaxy S24', 22000000, 20)
ON DUPLICATE KEY UPDATE name = name;
