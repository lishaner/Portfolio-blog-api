// models/blogPostModel.js

const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title']
    },
    content: {
        type: String,
        required: [true, 'Please add content']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
});

// 新增部分：Mongoose 的 'pre' 中间件
// 在 'remove' 事件 (即删除一篇博客文章) 发生前执行此函数
blogPostSchema.pre('remove', async function(next) {
    // 'this' 关键字指向即将被删除的博客文章文档
    // 'this.model('Comment')' 可以让我们在这里访问到 Comment 模型
    await this.model('Comment').deleteMany({ post: this._id });
    // next() 函数表示中间件逻辑执行完毕，可以继续执行原生的 'remove' 操作了
    next();
});

module.exports = mongoose.model('BlogPost', blogPostSchema);