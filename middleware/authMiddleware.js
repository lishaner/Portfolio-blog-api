const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 1. 从请求头中提取令牌
            token = req.headers.authorization.split(' ')[1];

            // 2. 验证令牌
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. 根据令牌中的ID查找用户，并附加到请求对象上
            req.user = await User.findById(decoded.id).select('-password');

            // 如果找不到用户 (例如用户在token签发后被删除了)，则抛出错误
            if (!req.user) {
              res.status(401);
              throw new Error('用户不存在');
            }

            next();
        } catch (error) {
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
  // 检查由 protect 中间件准备好的用户角色
  if (req.user && req.user.role === 'admin') {
    next(); // 是管理员，放行
  } else {
    res.status(403); // 不是管理员，禁止访问
    throw new Error('无管理员权限');
  }
};

module.exports = { protect, admin };