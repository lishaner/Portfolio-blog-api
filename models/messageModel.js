/**
 * @file messageModel.js
 * @description 定义联系表单留言 (Message) 的 Mongoose Schema 和 Model。
 */

const mongoose = require('mongoose');

/**
 * @typedef {object} Message
 * @property {string} name - 留言者的姓名。
 * @property {string} email - 留言者的邮箱地址。
 * @property {string} message - 留言的具体内容。
 * @property {Date} createdAt - 留言创建的时间戳。
 * @property {Date} updatedAt - 留言最后更新的时间戳。
 */

const messageSchema = new mongoose.Schema({
    /**
     * 留言者的姓名。
     * @type {string}
     */
    name: {
        type: String,
        required: [true, '请输入您的名字']
    },

    /**
     * 留言者的邮箱地址。
     * 包含一个正则表达式用于验证邮箱格式。
     * @type {string}
     */
    email: {
        type: String,
        required: [true, '请输入您的邮箱地址'],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            '请输入一个有效的邮箱地址',
        ]
    },

    /**
     * 留言的具体内容。
     * @type {string}
     */
    message: {
        type: String,
        required: [true, '请输入留言内容']
    }
}, {
    // 自动记录留言的创建和更新时间
    timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);