/**
 * @file blogPostModel.js
 * @description 定义博客文章 (BlogPost) 的 Mongoose Schema 和 Model。
 */

const mongoose = require('mongoose');

// 定义 BlogPost 的数据结构
const blogPostSchema = new mongoose.Schema({
    // 文章标题
    title: {
        type: String,
        required: [true, '标题为必填项']
    },
    // 文章内容
    content: {
        type: String,
        required: [true, '内容为必填项']
    },
    // 文章作者，关联到 User 模型
    author: {
        type: mongoose.Schema.Types.ObjectId, // 存储用户的 ObjectId
        required: true,
        ref: 'User' // 引用 'User' 模型，方便使用 populate
    }
}, {
    // 自动添加 createdAt 和 updatedAt 字段
    timestamps: true
});

// 在删除博客文章之前执行的中间件 (pre-hook)
// 用于级联删除与该文章相关的所有评论
blogPostSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    console.log(`正在删除文章 ${this._id} 的所有相关评论...`);
    // 'this' 指向即将被删除的文档
    // 使用 this.model('Comment') 访问 Comment 模型来删除相关评论
    await this.model('Comment').deleteMany({ post: this._id });
    next(); // 继续执行删除操作
});


// 创建并导出 BlogPost 模型
module.exports = mongoose.model('BlogPost', blogPostSchema);