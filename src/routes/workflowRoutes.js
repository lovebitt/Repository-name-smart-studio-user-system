const express = require('express');
const router = express.Router();
const workflowController = require('../controllers/workflowController');

// 工作流集成路由

/**
 * @route GET /api/workflows/status
 * @desc 获取工作流集成状态
 * @access Public
 */
router.get('/status', workflowController.getIntegrationStatus);

/**
 * @route POST /api/workflows/initialize
 * @desc 初始化工作流集成
 * @access Public
 */
router.post('/initialize', workflowController.initializeIntegration);

/**
 * @route POST /api/workflows/create
 * @desc 创建新的创作工作流
 * @access Public
 */
router.post('/create', workflowController.createWorkflow);

/**
 * @route GET /api/workflows
 * @desc 获取所有工作流
 * @access Public
 */
router.get('/', workflowController.getAllWorkflows);

/**
 * @route GET /api/workflows/:id
 * @desc 获取特定工作流详情
 * @access Public
 */
router.get('/:id', workflowController.getWorkflowById);

/**
 * @route GET /api/workflows/:id/status
 * @desc 获取工作流状态
 * @access Public
 */
router.get('/:id/status', workflowController.getWorkflowStatus);

/**
 * @route POST /api/workflows/:id/start
 * @desc 启动工作流
 * @access Public
 */
router.post('/:id/start', workflowController.startWorkflow);

/**
 * @route POST /api/workflows/:id/pause
 * @desc 暂停工作流
 * @access Public
 */
router.post('/:id/pause', workflowController.pauseWorkflow);

/**
 * @route POST /api/workflows/:id/resume
 * @desc 恢复工作流
 * @access Public
 */
router.post('/:id/resume', workflowController.resumeWorkflow);

/**
 * @route POST /api/workflows/:id/cancel
 * @desc 取消工作流
 * @access Public
 */
router.post('/:id/cancel', workflowController.cancelWorkflow);

/**
 * @route GET /api/workflows/:id/agents
 * @desc 获取工作流分配的智能体
 * @access Public
 */
router.get('/:id/agents', workflowController.getWorkflowAgents);

/**
 * @route GET /api/workflows/:id/progress
 * @desc 获取工作流进度详情
 * @access Public
 */
router.get('/:id/progress', workflowController.getWorkflowProgress);

/**
 * @route POST /api/workflows/:id/update-progress
 * @desc 手动更新工作流进度
 * @access Public
 */
router.post('/:id/update-progress', workflowController.updateWorkflowProgress);

/**
 * @route GET /api/workflows/stats/overview
 * @desc 获取工作流统计概览
 * @access Public
 */
router.get('/stats/overview', workflowController.getWorkflowStats);

/**
 * @route GET /api/workflows/active/count
 * @desc 获取活跃工作流数量
 * @access Public
 */
router.get('/active/count', workflowController.getActiveWorkflowsCount);

/**
 * @route POST /api/workflows/:id/assign-agents
 * @desc 为工作流分配智能体
 * @access Public
 */
router.post('/:id/assign-agents', workflowController.assignAgentsToWorkflow);

/**
 * @route POST /api/workflows/:id/execute-stage
 * @desc 执行工作流特定阶段
 * @access Public
 */
router.post('/:id/execute-stage', workflowController.executeWorkflowStage);

/**
 * @route GET /api/workflows/integration/test
 * @desc 测试工作流集成
 * @access Public
 */
router.get('/integration/test', workflowController.testIntegration);

module.exports = router;