/**
 * @file blogController.js
 * @description 博客文章相关的控制器函数，处理所有与博客文章相关的业务逻辑。
 */

const asyncHandler = require('express-async-handler');
const BlogPost = require('../models/blogPostModel');

/**
 * @description 获取所有博客文章列表
 * @route GET /api/blog
 * @access Public
 * @param {import('express').Request} req Express 请求对象
 * @param {import('express').Response} res Express 响应对象
 */
const getBlogPosts = asyncHandler(async (req, res) => {
  // 查找所有文章，并填充作者信息（仅用户名），按创建时间降序排序
  const posts = await BlogPost.find({}).populate('author', 'username').sort({ createdAt: -1 });
  res.status(200).json(posts);
});

/**
 * @description 创建一篇新的博客文章
 * @route POST /api/blog
 * @access Private/Admin
 * @param {import('express').Request} req Express 请求对象
 * @param {import('express').Response} res Express 响应对象
 */
const createBlogPost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  // 数据验证
  if (!title || !content) {
    res.status(400);
    throw new Error('标题和内容不能为空');
  }

  // --- 这里是唯一的修改之处 ---
  // 步骤 1: 创建新文章，作者 ID 来自于 authMiddleware 附加到 req.user 的信息
  const post = await BlogPost.create({
    title,
    content,
    author: req.user._id,
  });

  // 步骤 2: 查找刚刚创建的文章，并填充作者信息，以便立即返回给前端
  const populatedPost = await BlogPost.findById(post._id).populate('author', 'username');

  // 步骤 3: 将包含作者信息的完整文章对象返回给前端
  res.status(201).json(populatedPost);
  // --- 修改结束 ---
});

/**
 * @description 根据 ID 获取单篇博客文章
 * @route GET /api/blog/:id
 * @access Public
 * @param {import('express').Request} req Express 请求对象
 * @param {import('express').Response} res Express 响应对象
 */
const getBlogPostById = asyncHandler(async (req, res) => {
  const post = await BlogPost.findById(req.params.id).populate('author', 'username');

  if (post) {
    res.status(200).json(post);
  } else {
    res.status(404);
    throw new Error('文章未找到');
  }
});

/**
 * @description 更新一篇博客文章
 * @route PUT /api/blog/:id
 * @access Private/Admin
 * @param {import('express').Request} req Express 请求对象
 * @param {import('express').Response} res Express 响应对象
 */
const updateBlogPost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const post = await BlogPost.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('文章未找到');
  }

  // 授权检查：确保当前用户是文章作者或管理员
  const isAdmin = req.user.role === 'admin';
  const isAuthor = post.author.toString() === req.user._id.toString();

  if (!isAdmin && !isAuthor) {
    res.status(403); // 403 Forbidden - 用户已知，但无权限
    throw new Error('用户无权限更新此文章');
  }

  // 更新字段
  post.title = title || post.title;
  post.content = content || post.content;

  const updatedPost = await post.save();
  res.status(200).json(updatedPost);
});

/**
 * @description 删除一篇博客文章
 * @route DELETE /api/blog/:id
 * @access Private/Admin
 * @param {import('express').Request} req Express 请求对象
 * @param {import('express').Response} res Express 响应对象
 */
const deleteBlogPost = asyncHandler(async (req, res) => {
  const post = await BlogPost.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('文章未找到');
  }

  // 授权检查：确保当前用户是文章作者或管理员
  const isAdmin = req.user.role === 'admin';
  const isAuthor = post.author.toString() === req.user._id.toString();

  if (!isAdmin && !isAuthor) {
    res.status(403); // 403 Forbidden
    throw new Error('用户无权限删除此文章');
  }

  // Mongoose 5.x+ 推荐使用 deleteOne() 或 deleteMany()
  await post.deleteOne();

  res.status(200).json({ message: '文章已成功删除' });
});

module.exports = {
  getBlogPosts,
  createBlogPost,
  getBlogPostById,
  updateBlogPost,
  deleteBlogPost,
};