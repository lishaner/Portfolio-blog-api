// controllers/contactController.js

const asyncHandler = require('express-async-handler');
const Message = require('../models/messageModel');

/**
 * @desc    接收并存储一条新的联系信息
 * @route   POST /api/contact
 * @access  Public
 */
exports.saveContactMessage = asyncHandler(async (req, res) => {
    const { name, email, message } = req.body;

    // 后端验证
    if (!name || !email || !message) {
        res.status(400);
        throw new Error('姓名、邮箱和留言内容均为必填项');
    }

    const newMessage = await Message.create({
        name,
        email,
        message
    });

    if (newMessage) {
        res.status(201).json({ 
            success: true, 
            message: '您的留言已成功发送！' 
        });
    } else {
        res.status(500);
        throw new Error('服务器内部错误，无法保存您的留言');
    }
});