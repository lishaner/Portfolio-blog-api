// routes/commentRoutes.js

const express = require('express');

// 关键选项: { mergeParams: true } 允许此路由文件访问其父路由中的URL参数 (例如 /:postId)
const router = express.Router({ mergeParams: true });

const { getCommentsForPost, createComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

// 此处的 '/' 实际上是相对于 /api/blog/:postId/comments 的
router.route('/')
    .get(getCommentsForPost)
    .post(protect, createComment);

module.exports = router;