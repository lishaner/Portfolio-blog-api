/**
 * @file authMiddleware.js
 * @description 包含用于身份验证和授权的中间件函数。
 */

const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

/**
 * @description 保护路由的中间件。
 * 验证请求头中的 JWT，如果有效，则将用户信息附加到 req.user。
 * @param {import('express').Request} req Express 请求对象
 * @param {import('express').Response} res Express 响应对象
 * @param {import('express').NextFunction} next Express next 函数
 */
const protect = asyncHandler(async (req, res, next) => {
    let token;

    // 检查 Authorization 请求头是否存在且以 'Bearer' 开头
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 1. 从 "Bearer <token>" 中提取 token
            token = req.headers.authorization.split(' ')[1];

            // 2. 验证 token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. 根据 token 中的 id 查找用户，并排除密码字段，附加到请求对象上
            req.user = await User.findById(decoded.id).select('-password');

            // 如果找不到用户（例如，在 token 签发后用户被删除）
            if (!req.user) {
              res.status(401);
              throw new Error('用户不存在，授权失败');
            }
            
            // 调用下一个中间件
            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('未授权，令牌验证失败');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('未授权，没有提供令牌');
    }
});

/**
 * @description 检查用户是否为管理员的中间件。
 * 必须在 protect 中间件之后使用。
 * @param {import('express').Request} req Express 请求对象 (应包含 req.user)
 * @param {import('express').Response} res Express 响应对象
 * @param {import('express').NextFunction} next Express next 函数
 */
const admin = (req, res, next) => {
  // 检查 protect 中间件附加的用户信息及其角色
  if (req.user && req.user.role === 'admin') {
    next(); // 用户是管理员，继续执行
  } else {
    res.status(403); // 403 Forbidden
    throw new Error('无管理员权限');
  }
};

module.exports = { protect, admin };