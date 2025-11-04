/**
 * @file projectModel.js
 * @description 定义作品集项目 (Project) 的 Mongoose Schema 和 Model。
 */

const mongoose = require('mongoose');

/**
 * @typedef {object} Project
 * @property {string} title - 项目标题。
 * @property {string} description - 项目的详细描述。
 * @property {string} [imageUrl] - 项目的预览图片 URL (可选)。
 * @property {string} [repoUrl] - 项目的 Git 仓库 URL (可选)。
 * @property {string} [liveUrl] - 项目的线上访问 URL (可选)。
 * @property {mongoose.Schema.Types.ObjectId} user - 创建该项目的管理员用户 ID，关联到 User 模型。
 * @property {Date} createdAt - 项目创建的时间戳。
 * @property {Date} updatedAt - 项目最后更新的时间戳。
 */

const projectSchema = new mongoose.Schema({
    /**
     * 项目标题。
     * @type {string}
     */
    title: {
        type: String,
        required: [true, '请输入项目标题']
    },

    /**
     * 项目的详细描述。
     * @type {string}
     */
    description: {
        type: String,
        required: [true, '请输入项目描述']
    },

    /**
     * 项目的预览图片 URL。
     * @type {string}
     */
    imageUrl: {
        type: String,
        // 此字段为可选
    },

    /**
     * 项目的 Git 仓库 URL。
     * @type {string}
     */
    repoUrl: {
        type: String,
        // 此字段为可选
    },

    /**
     * 项目的线上访问 URL。
     * @type {string}
     */
    liveUrl: {
        type: String,
        // 此字段为可选
    },
    
    /**
     * 创建此项目的管理员用户。
     * 这是一个对 'User' 模型的引用。
     * @type {mongoose.Schema.Types.ObjectId}
     * @ref User
     */
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    // 自动添加 createdAt 和 updatedAt 时间戳
    timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);