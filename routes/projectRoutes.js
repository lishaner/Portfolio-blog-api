// routes/projectRoutes.js

const express = require('express');
const router = express.Router();
const {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

// 公开路由
router.route('/').get(getProjects);
router.route('/:id').get(getProjectById);

// 受保护的路由 (需要登录)
router.route('/').post(protect, createProject);
router.route('/:id').put(protect, updateProject).delete(protect, deleteProject);

module.exports = router;