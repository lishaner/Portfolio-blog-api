/**
 * @file projectRoutes.js
 * @description 定义作品集项目的 API 路由。
 * Base path: /api/projects
 */

const express = require('express');
const router = express.Router();
const {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
} = require('../controllers/projectController');
const { protect, admin } = require('../middleware/authMiddleware'); // 假设也需要 admin 权限

// GET /api/projects - 获取所有项目 (公开)
// POST /api/projects - 创建新项目 (需要管理员权限)
router.route('/')
    .get(getProjects)
    .post(protect, admin, createProject);

// GET /api/projects/:id - 获取单个项目 (公开)
// PUT /api/projects/:id - 更新项目 (需要管理员权限)
// DELETE /api/projects/:id - 删除项目 (需要管理员权限)
router.route('/:id')
    .get(getProjectById)
    .put(protect, admin, updateProject)
    .delete(protect, admin, deleteProject);

module.exports = router;