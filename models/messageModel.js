// models/messageModel.js

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, '请输入您的名字']
    },
    email: {
        type: String,
        required: [true, '请输入您的邮箱地址'],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            '请输入一个有效的邮箱地址',
        ]
    },
    message: {
        type: String,
        required: [true, '请输入留言内容']
    }
}, {
    timestamps: true // 自动记录留言时间
});

module.exports = mongoose.model('Message', messageSchema);