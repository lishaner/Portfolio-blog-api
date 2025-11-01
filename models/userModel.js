// models/userModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    // --- 修改开始 ---
    username: {
        type: String,
        required: [true, 'Please enter a username'],
        unique: true // 添加了 unique 属性以满足项目要求
    },
    // --- 修改结束 ---
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please enter a valid email',
        ],
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: 6,
        select: false, // 默认情况下，查询用户时不会返回密码
    },
}, {
    timestamps: true // 自动添加 createdAt 和 updatedAt 字段
});

// 在保存到数据库之前，对密码进行哈希处理 (这部分代码非常完美，无需修改)
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// 添加一个方法，用于比较传入的密码和数据库中存储的哈希密码 (这部分代码也非常完美，无需修改)
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);