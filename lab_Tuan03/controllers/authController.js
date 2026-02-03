const AuthService = require('../services/authService');

class AuthController {
    static getLoginPage(req, res) {
        res.render('auth/login', { error: null });
    }

    static async login(req, res) {
        try {
            const { username, password } = req.body;
            const user = await AuthService.login(username, password);

            // Set session
            req.session.user = {
                userId: user.userId,
                username: user.username,
                role: user.role
            };

            res.redirect('/products');
        } catch (error) {
            res.render('auth/login', { error: error.message });
        }
    }

    static getRegisterPage(req, res) {
        res.render('auth/register', { error: null });
    }

    static async register(req, res) {
        try {
            const { username, password } = req.body;
            await AuthService.register(username, password);
            res.redirect('/login');
        } catch (error) {
            res.render('auth/register', { error: error.message });
        }
    }

    static logout(req, res) {
        req.session.destroy();
        res.redirect('/login');
    }
}

module.exports = AuthController;
