// controllers/userController.js

const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcryptjs'); // 确保 bcryptjs 已导入

/**
 * @desc    注册新用户
 * @route   POST /api/users/register
 * @access  Public
 */
exports.registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    // 检查是否有空字段
    if (!username || !email || !password) {
        res.status(400);
        throw new Error('请填写所有字段');
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('该邮箱已被注册');
    }

    const user = await User.create({
        username,
        email,
        password,
    });

    if (user) {
        // --- 关键修改：返回与前端匹配的结构 ---
        res.status(201).json({
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.username, // 前端期望 'name' 字段
                email: user.email,
            },
        });
        // ---------------------------------
    } else {
        res.status(400);
        throw new Error('无效的用户数据');
    }
});

/**
 * @desc    验证用户并获取令牌 (登录)
 * @route   POST /api/users/login
 * @access  Public
 */
exports.loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error('请输入邮箱和密码');
    }

    // 确保在模型定义中没有默认不选择 password，如果 Mongoose 实例方法可用则无需 select
    const user = await User.findOne({ email });

    // --- 关键修改：确保密码比对逻辑正确 ---
    // 您的代码中使用了 user.matchPassword，这里假设它在 userModel.js 中定义正确
    // 如果没有定义，也可以直接使用 bcrypt.compare
    if (user && (await user.matchPassword(password))) {
        // --- 关键修改：返回与前端匹配的结构 ---
        res.status(200).json({
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.username, // 前端期望 'name' 字段
                email: user.email,
            },
        });
        // ---------------------------------
    } else {
        res.status(401);
        throw new Error('无效的邮箱或密码');
    }
});