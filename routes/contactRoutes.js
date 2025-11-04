/**
 * @file contactRoutes.js
 * @description 定义联系表单提交的 API 路由。
 * Base path: /api/contact
 */

const express = require('express');
const router = express.Router();
const { saveContactMessage } = require('../controllers/contactController');

// POST /api/contact - 提交联系表单 (公开)
router.route('/').post(saveContactMessage);

module.exports = router;