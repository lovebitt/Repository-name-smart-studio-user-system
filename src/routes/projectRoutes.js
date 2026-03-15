const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// 项目管理路由

// 获取所有项目
router.get('/', projectController.getAllProjects);

// 创建新项目
router.post('/', projectController.createProject);

// 获取单个项目
router.get('/:id', projectController.getProjectById);

// 更新项目信息
router.put('/:id', projectController.updateProject);

// 更新项目进度
router.put('/:id/progress', projectController.updateProjectProgress);

// 删除项目
router.delete('/:id', projectController.deleteProject);

// 为项目分配智能体
router.post('/:id/agents', projectController.assignAgentsToProject);

// 获取项目智能体列表
router.get('/:id/agents', projectController.getProjectAgents);

// 获取项目统计
router.get('/stats/overview', projectController.getProjectStats);

// 导出路由
module.exports = router;