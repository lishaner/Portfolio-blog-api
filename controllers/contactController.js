/**
 * @file contactController.js
 * @description 处理联系表单提交的控制器。
 */

const asyncHandler = require('express-async-handler');
const Message = require('../models/messageModel');

/**
 * @description 接收并存储一条新的联系信息
 * @route POST /api/contact
 * @access Public
 * @param {import('express').Request} req Express 请求对象
 * @param {import('express').Response} res Express 响应对象
 */
exports.saveContactMessage = asyncHandler(async (req, res) => {
    const { name, email, message } = req.body;

    // 后端数据验证
    if (!name || !email || !message) {
        res.status(400);
        throw new Error('姓名、邮箱和留言内容均为必填项');
    }

    // 创建新的留言记录
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
        // 通常 create 失败会直接抛出 Mongoose 错误，由 errorHandler 捕获
        res.status(500);
        throw new Error('服务器内部错误，无法保存您的留言');
    }
});