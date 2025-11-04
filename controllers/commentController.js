/**
 * @file commentController.js
 * @description 评论相关的控制器函数。
 */

const asyncHandler = require('express-async-handler');
const Comment = require('../models/commentModel');
const BlogPost = require('../models/blogPostModel');

/**
 * @description 获取指定文章下的所有评论
 * @route GET /api/blog/:postId/comments
 * @access Public
 * @param {import('express').Request} req Express 请求对象, 包含 postId 参数
 * @param {import('express').Response} res Express 响应对象
 */
exports.getCommentsForPost = asyncHandler(async (req, res) => {
    // 检查文章是否存在，防止对无效 ID 进行查询
    const postExists = await BlogPost.findById(req.params.postId);
    if (!postExists) {
        res.status(404);
        throw new Error('文章未找到');
    }

    // 查找所有 'post' 字段匹配 postId 的评论，并填充作者信息
    const comments = await Comment.find({ post: req.params.postId })
        .populate('author', 'username');

    res.status(200).json(comments);
});

/**
 * @description 为指定文章创建一条新评论
 * @route POST /api/blog/:postId/comments
 * @access Private (需要登录)
 * @param {import('express').Request} req Express 请求对象
 * @param {import('express').Response} res Express 响应对象
 */
exports.createComment = asyncHandler(async (req, res) => {
    const { body } = req.body;
    const { postId } = req.params;

    if (!body) {
        res.status(400);
        throw new Error('评论内容不能为空');
    }

    // 再次确认文章存在
    const postExists = await BlogPost.findById(postId);
    if (!postExists) {
        res.status(404);
        throw new Error('文章未找到，无法发表评论');
    }

    // 创建评论，作者 ID 来自 protect 中间件
    const comment = await Comment.create({
        body,
        post: postId,
        author: req.user.id
    });
    
    // 查询新创建的评论并填充作者信息，以便立即返回给前端显示
    const populatedComment = await Comment.findById(comment._id).populate('author', 'username');

    res.status(201).json(populatedComment);
});