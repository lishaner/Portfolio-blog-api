/**
 * @file commentRoutes.js
 * @description 定义与评论相关的 API 路由。
 * 这个路由是 blogRoutes 的子路由。
 * Base path: /api/blog/:postId/comments
 */

const express = require('express');

// { mergeParams: true } 允许此路由访问父路由 (:postId) 中的 URL 参数
const router = express.Router({ mergeParams: true });

const { getCommentsForPost, createComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/blog/:postId/comments - 获取文章的所有评论 (公开)
// POST /api/blog/:postId/comments - 为文章添加评论 (需要登录)
router.route('/')
    .get(getCommentsForPost)
    .post(protect, createComment);

module.exports = router;