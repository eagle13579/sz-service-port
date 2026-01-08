const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// 注册
router.post('/register', AuthController.register);

// 登录
router.post('/login', AuthController.login);

// 获取当前用户信息
router.get('/user', auth, AuthController.getCurrentUser);

module.exports = router;
