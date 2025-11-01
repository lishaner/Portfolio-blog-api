// models/projectModel.js

const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, '请输入项目标题']
    },
    description: {
        type: String,
        required: [true, '请输入项目描述']
    },
    imageUrl: {
        type: String,
        // 可选字段
    },
    repoUrl: {
        type: String,
        // 可选字段
    },
    liveUrl: {
        type: String,
        // 可选字段
    },
    // 关联创建此项目的管理员用户
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true // 自动添加 createdAt 和 updatedAt 时间戳
});

module.exports = mongoose.model('Project', projectSchema);