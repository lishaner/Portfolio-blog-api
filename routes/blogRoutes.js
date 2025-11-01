// routes/blogRoutes.js

const express = require('express');
const router = express.Router();

const {
  createBlogPost,
  getBlogPosts,
  getBlogPostById,
  updateBlogPost,
  deleteBlogPost
} = require('../controllers/blogController');

const { protect } = require('../middleware/authMiddleware');

// 博客文章自身的路由
router.route('/')
  .get(getBlogPosts)
  .post(protect, createBlogPost);

router.route('/:id')
  .get(getBlogPostById)
  .put(protect, updateBlogPost)
  .delete(protect, deleteBlogPost);

// 新增部分：挂载评论路由
// 这行代码的意思是：将所有匹配 /:postId/comments 模式的请求
// 都转发给 commentRouter 文件去处理
const commentRouter = require('./commentRoutes');
router.use('/:postId/comments', commentRouter);

module.exports = router;