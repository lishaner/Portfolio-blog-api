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


const { protect, admin } = require('../middleware/authMiddleware');

// 公开路由 (获取博客列表和单篇博客) - 任何人都可以访问，无需修改
router.route('/')
  .get(getBlogPosts);

router.route('/:id')
  .get(getBlogPostById);



// 创建博客: 需要先登录(protect)，再检查是否为管理员(admin)
router.route('/')
  .post(protect, admin, createBlogPost); 

// 更新和删除博客: 也需要先登录(protect)，再检查是否为管理员(admin)
router.route('/:id')
  .put(protect, admin, updateBlogPost)
  .delete(protect, admin, deleteBlogPost);


// 评论路由部分 - 无需修改
const commentRouter = require('./commentRoutes');
router.use('/:postId/comments', commentRouter);

module.exports = router;