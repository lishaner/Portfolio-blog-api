// models/userModel.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please enter a username'],
        unique: true
    },
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
        select: false,
    },


    role: {
      type: String,
      required: true,
      enum: ['user', 'admin'], // 'enum' 限制了 role 字段只能是 'user' 或 'admin' 这两个值
      default: 'user'         // 'default' 确保了新注册的用户默认为普通 'user'
    }


}, {
    timestamps: true
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