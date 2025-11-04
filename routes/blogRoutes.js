/**
 * @file blogRoutes.js
 * @description 定义与博客文章相关的 API 路由。
 * Base path: /api/blog
 */
const express = require('express');
const router = express.Router();

const {
  createBlogPost,
  getBlogPosts,
  getBlogPostById,
  updateBlogPost,
  deleteBlogPost
} = require('../controllers/blogController');

const { protect, admin } = require('../middleware/authMiddleware');

// 导入并挂载评论的子路由
const commentRouter = require('./commentRoutes');
// 当请求路径匹配 /:postId/comments 时，将请求转交给 commentRouter 处理
router.use('/:postId/comments', commentRouter);


// --- 博客文章路由 ---

// GET /api/blog - 获取所有文章 (公开)
// POST /api/blog - 创建新文章 (需要管理员权限)
router.route('/')
  .get(getBlogPosts)
  .post(protect, admin, createBlogPost); 

// GET /api/blog/:id - 获取单篇文章 (公开)
// PUT /api/blog/:id - 更新文章 (需要管理员权限)
// DELETE /api/blog/:id - 删除文章 (需要管理员权限)
router.route('/:id')
  .get(getBlogPostById)
  .put(protect, admin, updateBlogPost)
  .delete(protect, admin, deleteBlogPost);

module.exports = router;