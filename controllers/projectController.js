/**
 * @file projectController.js
 * @description 作品集项目相关的控制器函数。
 */

const asyncHandler = require('express-async-handler');
const Project = require('../models/projectModel');

/**
 * @description 获取所有作品集项目
 * @route GET /api/projects
 * @access Public
 * @param {import('express').Request} req Express 请求对象
 * @param {import('express').Response} res Express 响应对象
 */
exports.getProjects = asyncHandler(async (req, res) => {
    const projects = await Project.find({}).populate('user', 'username');
    res.status(200).json(projects);
});

/**
 * @description 根据 ID 获取单个作品集项目
 * @route GET /api/projects/:id
 * @access Public
 * @param {import('express').Request} req Express 请求对象
 * @param {import('express').Response} res Express 响应对象
 */
exports.getProjectById = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (project) {
        res.status(200).json(project);
    } else {
        res.status(404);
        throw new Error('项目未找到');
    }
});

/**
 * @description 创建一个新的作品集项目
 * @route POST /api/projects
 * @access Private/Admin
 * @param {import('express').Request} req Express 请求对象
 * @param {import('express').Response} res Express 响应对象
 */
exports.createProject = asyncHandler(async (req, res) => {
    const { title, description, imageUrl, repoUrl, liveUrl } = req.body;

    if (!title || !description) {
        res.status(400);
        throw new Error('标题和描述是必填项');
    }

    const project = await Project.create({
        title,
        description,
        imageUrl,
        repoUrl,
        liveUrl,
        user: req.user.id // 关联到当前登录的管理员
    });

    res.status(201).json(project);
});

/**
 * @description 更新一个作品集项目
 * @route PUT /api/projects/:id
 * @access Private/Admin
 * @param {import('express').Request} req Express 请求对象
 * @param {import('express').Response} res Express 响应对象
 */
exports.updateProject = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        res.status(404);
        throw new Error('项目未找到');
    }
    
    // 使用 findByIdAndUpdate 原子性地更新文档
    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, {
        new: true, // 返回更新后的文档
        runValidators: true // 运行模型中定义的验证器
    });

    res.status(200).json(updatedProject);
});

/**
 * @description 删除一个作品集项目
 * @route DELETE /api/projects/:id
 * @access Private/Admin
 * @param {import('express').Request} req Express 请求对象
 * @param {import('express').Response} res Express 响应对象
 */
exports.deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('项目未找到');
  }

  await Project.deleteOne({ _id: req.params.id });
  res.status(200).json({ message: '项目已成功删除' });
});