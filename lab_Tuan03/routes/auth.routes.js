const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

router.get('/login', AuthController.getLoginPage);
router.post('/login', AuthController.login);

router.get('/register', AuthController.getRegisterPage);
router.post('/register', AuthController.register);

router.get('/logout', AuthController.logout);

module.exports = router;
