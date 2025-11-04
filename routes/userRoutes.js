/**
 * @file userRoutes.js
 * @description 定义用户认证相关的 API 路由。
 * Base path: /api/users
 */
const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController');

// POST /api/users/register - 用户注册 (公开)
router.post('/register', registerUser);

// POST /api/users/login - 用户登录 (公开)
router.post('/login', loginUser);

module.exports = router;