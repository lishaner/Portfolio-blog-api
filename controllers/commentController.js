// controllers/commentController.js

const asyncHandler = require('express-async-handler');
const Comment = require('../models/commentModel');
const BlogPost = require('../models/blogPostModel');

/**
 * @desc    获取某篇文章下的所有评论
 * @route   GET /api/blog/:postId/comments
 * @access  Public
 */
exports.getCommentsForPost = asyncHandler(async (req, res) => {
    // 首先检查文章是否存在，以防对无效ID进行查询
    const postExists = await BlogPost.findById(req.params.postId);
    if (!postExists) {
        res.status(404);
        throw new Error('文章未找到');
    }

    // 查找所有 'post' 字段与 URL 中 postId 匹配的评论
    const comments = await Comment.find({ post: req.params.postId })
        .populate('author', 'username'); // 同时填充作者的用户名

    res.status(200).json(comments);
});

/**
 * @desc    为某篇文章创建一条新评论
 * @route   POST /api/blog/:postId/comments
 * @access  Protected
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

    const comment = await Comment.create({
        body,
        post: postId,
        author: req.user.id // 从 protect 中间件获取登录用户的ID
    });
    
    // 为了能立即看到作者信息，我们可以populate新创建的评论
    const populatedComment = await Comment.findById(comment._id).populate('author', 'username');

    res.status(201).json(populatedComment);
});