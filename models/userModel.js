/**
 * @file userModel.js
 * @description 定义用户 (User) 的 Mongoose Schema 和 Model，并包含密码处理逻辑。
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * @typedef {object} User
 * @property {string} username - 用户的唯一用户名。
 * @property {string} email - 用户的唯一邮箱地址。
 * @property {string} password - 用户的哈希密码 (默认不被查询返回)。
 * @property {string} role - 用户的角色 ('user' 或 'admin')。
 * @property {Date} createdAt - 用户创建的时间戳。
 * @property {Date} updatedAt - 用户最后更新的时间戳。
 */

const userSchema = new mongoose.Schema({
    /**
     * 用户的唯一用户名。
     * @type {string}
     */
    username: {
        type: String,
        required: [true, '请输入用户名'],
        unique: true
    },

    /**
     * 用户的唯一邮箱地址。
     * @type {string}
     */
    email: {
        type: String,
        required: [true, '请输入邮箱'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            '请输入有效的邮箱地址',
        ],
    },

    /**
     * 用户的密码。
     * 至少需要6个字符，并且在常规查询中不会被返回。
     * @type {string}
     */
    password: {
        type: String,
        required: [true, '请输入密码'],
        minlength: 6,
        select: false, // 在查询用户时，默认不包含此字段
    },

    /**
     * 用户的角色。
     * 只能是 'user' 或 'admin'，默认为 'user'。
     * @type {string}
     * @enum ['user', 'admin']
     */
    role: {
      type: String,
      required: true,
      enum: ['user', 'admin'], // 限制 role 字段的取值
      default: 'user'         // 新用户的默认角色
    }
}, {
    timestamps: true
});

/**
 * Mongoose 中间件 (pre-save hook)。
 * 在用户文档被保存到数据库之前自动执行。
 * 如果密码字段被修改了，则对其进行哈希加密。
 */
userSchema.pre('save', async function(next) {
    // 如果密码字段没有被修改（例如，只是更新邮箱），则跳过哈希过程
    if (!this.isModified('password')) {
        return next();
    }
    // 生成盐值
    const salt = await bcrypt.genSalt(10);
    // 哈希密码
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

/**
 * 为 User 模型添加一个实例方法，用于比较输入的密码和数据库中存储的哈希密码。
 * @param {string} enteredPassword - 用户登录时输入的明文密码。
 * @returns {Promise<boolean>} - 如果密码匹配，则返回 true，否则返回 false。
 */
userSchema.methods.matchPassword = async function(enteredPassword) {
    // 'this.password' 指的是当前用户文档中存储的哈希密码
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);