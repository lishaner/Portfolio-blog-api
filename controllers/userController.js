const asyncHandler = require('express-async-handler'); // 引入
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');

/**
 * @desc    注册新用户
 * @route   POST /api/users/register
 * @access  Public
 */
// 使用 asyncHandler 包裹函数
exports.registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400); // 只设置状态码
        throw new Error('该邮箱已被注册'); // 抛出错误，会被自动捕获
    }

    const user = await User.create({
        username,
        email,
        password,
    });

    if (user) {
        res.status(201).json({
            success: true,
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id),
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
// 使用 asyncHandler 包裹函数
exports.loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error('请输入邮箱和密码');
    }

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
        res.status(200).json({
            success: true,
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('无效的邮箱或密码');
    }
});