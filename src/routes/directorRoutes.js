const express = require('express');
const router = express.Router();
const directorController = require('../controllers/directorController');

// 导演身份管理路由

// 获取导演信息（默认Nmyh_NIUMA）
router.get('/me', directorController.getDirectorInfo);

// 设置/更新导演身份
router.post('/setup', directorController.setupDirector);

// 更新偏好设置
router.put('/preferences', directorController.updatePreferences);

// 更新系统配置
router.put('/config', directorController.updateConfig);

// 获取导演工作统计
router.get('/stats', directorController.getDirectorStats);

// 导出路由
module.exports = router;