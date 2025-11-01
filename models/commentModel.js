// models/commentModel.js

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    body: {
        type: String,
        required: [true, '评论内容不能为空']
    },
    // 关联发表评论的用户
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    // 关联评论所属的文章
    post: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'BlogPost'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Comment', commentSchema);