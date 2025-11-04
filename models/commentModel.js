/**
 * @file commentModel.js
 * @description 定义评论 (Comment) 的 Mongoose Schema 和 Model。
 */

const mongoose = require('mongoose');

/**
 * @typedef {object} Comment
 * @property {string} body - 评论的具体内容。
 * @property {mongoose.Schema.Types.ObjectId} author - 发表评论的用户的 ID，关联到 User 模型。
 * @property {mongoose.Schema.Types.ObjectId} post - 评论所属的文章的 ID，关联到 BlogPost 模型。
 * @property {Date} createdAt - 评论创建的时间戳。
 * @property {Date} updatedAt - 评论最后更新的时间戳。
 */

const commentSchema = new mongoose.Schema({
    /**
     * 评论的具体内容。
     * @type {string}
     */
    body: {
        type: String,
        required: [true, '评论内容不能为空']
    },
    
    /**
     * 发表评论的用户。
     * 这是一个对 'User' 模型的引用。
     * @type {mongoose.Schema.Types.ObjectId}
     * @ref User
     */
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },

    /**
     * 评论所属的文章。
     * 这是一个对 'BlogPost' 模型的引用。
     * @type {mongoose.Schema.Types.ObjectId}
     * @ref BlogPost
     */
    post: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'BlogPost'
    }
}, {
    // 自动为文档添加 createdAt 和 updatedAt 字段
    timestamps: true
});

module.exports = mongoose.model('Comment', commentSchema);