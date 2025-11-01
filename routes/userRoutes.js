// routes/userRoutes.js
const express = require('express');
const router = express.Router();

// 从控制器中导入相应的处理函数
const { registerUser, loginUser } = require('../controllers/userController');

// 设置路由
// POST /api/users/register
router.post('/register', registerUser);

// POST /api/users/login
router.post('/login', loginUser);

module.exports = router;