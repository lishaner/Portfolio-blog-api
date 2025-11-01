// routes/contactRoutes.js

const express = require('express');
const router = express.Router();

const { saveContactMessage } = require('../controllers/contactController');

// 定义一个公开的 POST 端点来接收联系表单的数据
router.route('/').post(saveContactMessage);

module.exports = router;