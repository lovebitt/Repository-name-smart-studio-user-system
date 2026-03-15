const express = require('express');
const router = express.Router();
const dreamaiController = require('../controllers/dreamaiController');

// 即梦AI提示词库集成路由

/**
 * @route GET /api/dreamai/status
 * @desc 获取即梦AI集成状态
 * @access Public
 */
router.get('/status', dreamaiController.getIntegrationStatus);

/**
 * @route POST /api/dreamai/initialize
 * @desc 初始化即梦AI提示词库
 * @access Public
 */
router.post('/initialize', dreamaiController.initializeLibrary);

/**
 * @route GET /api/dreamai/categories
 * @desc 获取提示词类别列表
 * @access Public
 */
router.get('/categories', dreamaiController.getCategories);

/**
 * @route GET /api/dreamai/categories/:name
 * @desc 获取特定类别详情
 * @access Public
 */
router.get('/categories/:name', dreamaiController.getCategoryDetails);

/**
 * @route POST /api/dreamai/generate
 * @desc 根据需求生成提示词
 * @access Public
 */
router.post('/generate', dreamaiController.generatePrompt);

/**
 * @route GET /api/dreamai/search
 * @desc 搜索提示词
 * @access Public
 */
router.get('/search', dreamaiController.searchPrompts);

/**
 * @route GET /api/dreamai/popular
 * @desc 获取热门提示词
 * @access Public
 */
router.get('/popular', dreamaiController.getPopularPrompts);

/**
 * @route GET /api/dreamai/stats
 * @desc 获取提示词统计
 * @access Public
 */
router.get('/stats', dreamaiController.getPromptStats);

/**
 * @route POST /api/dreamai/integrate-workflow
 * @desc 集成到工作流
 * @access Public
 */
router.post('/integrate-workflow', dreamaiController.integrateWithWorkflow);

/**
 * @route GET /api/dreamai/test
 * @desc 测试即梦AI集成
 * @access Public
 */
router.get('/test', dreamaiController.testIntegration);

module.exports = router;