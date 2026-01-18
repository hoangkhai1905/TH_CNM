const db = require('../db/mysql');

class UserModel {
    // Tìm user theo username
    static async findByUsername(username) {
        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        return rows[0];
    }

    // Tạo user mới (nếu cần)
    static async create(username, password) {
        const [result] = await db.query(
            'INSERT INTO users(username, password) VALUES (?, ?)',
            [username, password]
        );
        return result;
    }
}

module.exports = UserModel;
