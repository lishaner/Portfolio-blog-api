/**
 * @file generateToken.js
 * @description 用于生成 JSON Web Token (JWT) 的工具函数。
 */
const jwt = require('jsonwebtoken');

/**
 * @description 根据用户 ID 生成一个 JWT。
 * @param {string} id - 用户的 MongoDB ObjectId。
 * @returns {string} - 生成的 JWT 字符串。
 */
const generateToken = (id) => {
    // 使用用户的 ID 作为 payload，配合环境变量中的密钥进行签名
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        // 设置 token 的有效期为 30 天
        expiresIn: '30d',
    });
};

module.exports = generateToken;