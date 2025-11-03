// middleware/authMiddleware.js (诊断版本)

const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const protect = asyncHandler(async (req, res, next) => {
    let token;
    
    // --- 诊断日志开始 ---
    // 每次有受保护的请求进来，都会先打印这行分割线
    console.log('--- [DIAGNOSTIC LOG] Received a protected request ---');
    // 打印出请求头里的 Authorization 字段，看看前端是否发来了 Token
    console.log('[Step 1] Authorization Header:', req.headers.authorization);
    // 打印出当前环境下，服务器认为的 JWT_SECRET 是什么
    console.log('[Step 2] JWT_SECRET currently in use on server:', process.env.JWT_SECRET);
    // --- 诊断日志结束 ---

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 从 "Bearer <token>" 中提取出 <token> 部分
            token = req.headers.authorization.split(' ')[1];
            
            console.log('[Step 3] Extracted Token:', token);

            // 尝试用服务器的密钥去验证这个 Token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            console.log('[Step 4] Token decoded successfully. Payload:', decoded);

            // 根据解码出的 ID 去数据库里查找用户
            req.user = await User.findById(decoded.id).select('-password');

            console.log('[Step 5] User found in database:', req.user);
            
            // 这是一个重要的检查，确保用户没有在 Token 签发后被删除
            if (!req.user) {
              console.error('[FATAL ERROR] User not found for the ID in token!');
              res.status(401);
              throw new Error('User not found');
            }

            // 所有检查通过，放行
            next();
        } catch (error) {
            // 如果 jwt.verify 失败 (例如签名不匹配)，会在这里捕获到错误
            console.error('[ERROR] Caught an error in try-catch block:', error.message);
            res.status(401);
            throw new Error('Not authorized, token failed verification');
        }
    }

    if (!token) {
        console.log('[ERROR] No token found in the request.');
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

// admin 函数保持不变，但要确保它存在
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as an admin');
  }
};

module.exports = { protect, admin };