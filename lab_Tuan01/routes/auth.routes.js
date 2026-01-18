const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');

// Hiển thị trang login
router.get('/login', AuthController.showLogin);

// Xử lý login
router.post('/login', AuthController.login);

// Xử lý logout
router.get('/logout', AuthController.logout);

module.exports = router;
