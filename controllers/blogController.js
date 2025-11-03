const asyncHandler = require('express-async-handler');
const BlogPost = require('../models/blogPostModel'); // 确保路径正确

// @desc    获取所有博客文章
// @route   GET /api/blog
// @access  Public
const getBlogPosts = asyncHandler(async (req, res) => {
  const posts = await BlogPost.find({}).populate('author', 'username').sort({ createdAt: -1 });
  res.status(200).json(posts);
});

// @desc    创建新的博客文章
// @route   POST /api/blog
// @access  Protected/Admin
const createBlogPost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    res.status(400);
    throw new Error('标题和内容不能为空');
  }

  const post = await BlogPost.create({
    title,
    content,
    author: req.user._id, // req.user 来自于 authMiddleware
  });

  res.status(201).json(post);
});

// @desc    获取单篇博客文章
// @route   GET /api/blog/:id
// @access  Public
const getBlogPostById = asyncHandler(async (req, res) => {
  const post = await BlogPost.findById(req.params.id).populate('author', 'username');

  if (post) {
    res.status(200).json(post);
  } else {
    res.status(404);
    throw new Error('文章未找到');
  }
});

// @desc    更新一篇博客文章
// @route   PUT /api/blog/:id
// @access  Protected/Admin
const updateBlogPost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const post = await BlogPost.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('文章未找到');
  }

  // 授权检查：当前用户必须是文章作者或管理员
  const isAdmin = req.user.role === 'admin';
  const isAuthor = post.author.toString() === req.user._id.toString();

  if (!isAdmin && !isAuthor) {
    res.status(403); // 403 Forbidden - 已知身份，但无权限
    throw new Error('用户无权限更新此文章');
  }

  post.title = title || post.title;
  post.content = content || post.content;

  const updatedPost = await post.save();
  res.status(200).json(updatedPost);
});

// @desc    删除一篇博客文章
// @route   DELETE /api/blog/:id
// @access  Protected/Admin
const deleteBlogPost = asyncHandler(async (req, res) => {
  const post = await BlogPost.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('文章未找到');
  }

  // 授权检查：当前用户必须是文章作者或管理员
  const isAdmin = req.user.role === 'admin';
  const isAuthor = post.author.toString() === req.user._id.toString();

  if (!isAdmin && !isAuthor) {
    res.status(403); // 403 Forbidden - 已知身份，但无权限
    throw new Error('用户无权限删除此文章');
  }

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