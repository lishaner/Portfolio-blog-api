// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    // 检查请求头中是否包含 'Authorization' 并且是以 'Bearer' 开头
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 1. 从请求头中提取令牌 (去掉 'Bearer ')
            token = req.headers.authorization.split(' ')[1];

            // 2. 验证令牌的有效性
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. 根据令牌中的用户ID，从数据库中查找用户信息
            //    使用 .select('-password') 来排除密码字段
            req.user = await User.findById(decoded.id).select('-password');

            // 4. 调用 next() 将控制权交给下一个中间件或路由处理器
            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('未授权，令牌验证失败');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('未授权，没有令牌');
    }
});

module.exports = { protect };