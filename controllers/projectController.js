const asyncHandler = require('express-async-handler');
const Project = require('../models/projectModel'); // 确保模型路径正确

/**
 * @desc    获取所有作品集项目
 * @route   GET /api/projects
 * @access  Public
 */
exports.getProjects = asyncHandler(async (req, res) => {
    const projects = await Project.find({}).populate('user', 'username');
    res.status(200).json(projects);
});

/**
 * @desc    获取单个作品集项目
 * @route   GET /api/projects/:id
 * @access  Public
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
 * @desc    创建一个新的作品集项目
 * @route   POST /api/projects
 * @access  Protected (Admin-only assumed)
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
        user: req.user.id // 将项目与当前登录的用户（管理员）关联
    });

    res.status(201).json(project);
});

/**
 * @desc    更新一个作品集项目
 * @route   PUT /api/projects/:id
 * @access  Protected (Admin-only assumed)
 */
exports.updateProject = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        res.status(404);
        throw new Error('项目未找到');
    }
    
    // 注意：项目文档假定这是管理员操作，因此我们仅通过 protect 中-间件验证用户已登录。
    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, {
        new: true, // 返回更新后的文档
        runValidators: true // 运行模型中定义的验证
    });

    res.status(200).json(updatedProject);
});

/**
 * @desc    删除一个作品集项目
 * @route   DELETE /api/projects/:id
 * @access  Protected (Admin-only assumed)
 */
exports.deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project) {
    // 根据项目要求，我们不需要检查作者，因为任何登录用户都可删除
    // 所以我们直接执行删除
    await Project.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: '项目已成功删除' });
  } else {
    res.status(404);
    throw new Error('项目未找到');
  }
});