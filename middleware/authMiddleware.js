// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');


const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
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



const admin = (req, res, next) => {
  // 这个函数必须在 protect 中间件之后被调用，
  // 因为它依赖 protect 已经把用户信息放到了 req.user 上。
  if (req.user && req.user.role === 'admin') {
    // 如果 req.user 存在，并且其 role 属性是 'admin'
    next(); // 则放行，让请求继续前进到真正的处理函数
  } else {
    // 否则，返回 403 Forbidden (禁止访问) 错误
    res.status(403);
    throw new Error('无管理员权限，禁止访问');
  }
};

module.exports = { protect, admin };