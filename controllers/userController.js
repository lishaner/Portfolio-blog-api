/**
 * @file userController.js
 * @description 用户认证相关的控制器函数（注册、登录）。
 */

const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');

/**
 * @description 注册新用户
 * @route POST /api/users/register
 * @access Public
 * @param {import('express').Request} req Express 请求对象
 * @param {import('express').Response} res Express 响应对象
 */
exports.registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    // 1. 验证输入
    if (!username || !email || !password) {
        res.status(400);
        throw new Error('请填写所有字段');
    }

    // 2. 检查用户是否已存在
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('该邮箱已被注册');
    }

    // 3. 创建用户 (密码会在 model 的 pre-save 中间件中自动哈希)
    const user = await User.create({
        username,
        email,
        password,
    });

    // 4. 如果用户创建成功，返回 Token 和用户信息
    if (user) {
        res.status(201).json({
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.username,
                email: user.email,
                role: user.role, // role 来自 model 的默认值 'user'
            },
        });
    } else {
        res.status(400);
        throw new Error('无效的用户数据');
    }
});

/**
 * @description 用户登录并获取 Token
 * @route POST /api/users/login
 * @access Public
 * @param {import('express').Request} req Express 请求对象
 * @param {import('express').Response} res Express 响应对象
 */
exports.loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // 1. 验证输入
    if (!email || !password) {
        res.status(400);
        throw new Error('请输入邮箱和密码');
    }

    // 2. 查找用户，并使用 .select('+password') 强制包含被隐藏的密码字段
    const user = await User.findOne({ email }).select('+password');

    // 3. 检查用户是否存在，以及密码是否匹配
    if (user && (await user.matchPassword(password))) {
        // 匹配成功，返回 Token 和用户信息 (包括角色)
        res.status(200).json({
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } else {
        // 用户不存在或密码错误
        res.status(401); // 401 Unauthorized
        throw new Error('无效的邮箱或密码');
    }
});