const db = require('../db/mysql');

class ProductModel {
    // Lấy tất cả sản phẩm
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM products ORDER BY id DESC');
        return rows;
    }

    // Lấy sản phẩm theo ID
    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
        return rows[0];
    }

    // Thêm sản phẩm mới
    static async create(name, price, quantity) {
        const [result] = await db.query(
            'INSERT INTO products(name, price, quantity) VALUES (?, ?, ?)',
            [name, price, quantity]
        );
        return result;
    }

    // Cập nhật sản phẩm
    static async update(id, name, price, quantity) {
        const [result] = await db.query(
            'UPDATE products SET name = ?, price = ?, quantity = ? WHERE id = ?',
            [name, price, quantity, id]
        );
        return result;
    }

    // Xóa sản phẩm
    static async delete(id) {
        const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);
        return result;
    }
}

module.exports = ProductModel;
