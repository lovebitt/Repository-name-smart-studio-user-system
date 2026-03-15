const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');

// 智能体管理路由

// 获取所有智能体
router.get('/', agentController.getAllAgents);

// 获取特定类型智能体
router.get('/type/:type', agentController.getAgentsByType);

// 获取单个智能体
router.get('/:id', agentController.getAgentById);

// 更新智能体状态
router.put('/:id/status', agentController.updateAgentStatus);

// 更新智能体配置
router.put('/:id/config', agentController.updateAgentConfig);

// 获取智能体能力描述
router.get('/:id/capabilities', agentController.getAgentCapabilities);

// 获取智能体协作历史
router.get('/:id/history', agentController.getAgentCollaborationHistory);

// 获取智能体统计
router.get('/stats/overview', agentController.getAgentStats);

// 导出路由
module.exports = router;