const UserRepository = require('../repositories/userRepository');
const bcrypt = require('bcryptjs');

class AuthService {
    static async register(username, password) {
        const existingUser = await UserRepository.findByUsername(username);
        if (existingUser) {
            throw new Error('Username already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        // Default role is staff, first user is admin or manual update. Guide says Admin/Staff.
        // We can make role 'staff' by default. Update manually for admin.
        return await UserRepository.create({
            username,
            password: hashedPassword,
            role: 'staff'
        });
    }

    static async login(username, password) {
        const user = await UserRepository.findByUsername(username);
        if (!user) {
            throw new Error('User not found');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid password');
        }

        return user;
    }
}

module.exports = AuthService;
