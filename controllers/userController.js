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

    // 创建用户时，role 字段会使用 userModel.js 中定义的默认值 'user'
    const user = await User.create({
        username,
        email,
        password,
    });

    if (user) {
        // 返回 Token 和用户信息，以便前端直接登录
        res.status(201).json({
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.username,
                email: user.email,
                role: user.role, // 新注册用户的 role 是 'user'
            },
        });
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

    // 1. 检查邮箱和密码是否都已提供
    if (!email || !password) {
        res.status(400);
        throw new Error('请输入邮箱和密码');
    }

    // 2. 根据邮箱查找用户，并使用 .select('+password') 强制返回被隐藏的密码字段
    const user = await User.findOne({ email }).select('+password');

    // 3. 检查用户是否存在，并且密码是否匹配
    if (user && (await user.matchPassword(password))) {
        // 如果匹配成功，返回 Token 和完整的用户信息 (包括 role)
        res.status(200).json({
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.username,
                email: user.email,
                role: user.role, // 将用户的角色信息返回给前端
            },
        });
    } else {
        // 如果用户不存在或密码错误，返回 401 Unauthorized
        res.status(401);
        throw new Error('无效的邮箱或密码');
    }
});