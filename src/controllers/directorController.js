const Director = require('../models/Director');

// 导演身份控制器
const directorController = {
  // 获取导演信息
  async getDirectorInfo(req, res) {
    try {
      const { username = 'Nmyh_NIUMA' } = req.query;
      const director = await Director.getDirector(username);
      
      if (!director) {
        return res.status(404).json({
          error: '导演未找到',
          suggestion: '请先使用 /api/directors/setup 设置导演身份'
        });
      }

      // 解析JSON字段
      const response = {
        ...director,
        preferences: JSON.parse(director.preferences || '{}'),
        config: JSON.parse(director.config || '{}')
      };

      res.json({
        success: true,
        data: response,
        message: '导演信息获取成功'
      });
    } catch (error) {
      console.error('获取导演信息错误:', error);
      res.status(500).json({
        error: '获取导演信息失败',
        message: error.message
      });
    }
  },

  // 设置导演身份
  async setupDirector(req, res) {
    try {
      const directorData = req.body;
      
      // 验证必要字段
      if (!directorData.username) {
        return res.status(400).json({
          error: '缺少必要字段',
          required: ['username', 'display_name', 'email']
        });
      }

      const result = await Director.setupDirector(directorData);
      
      res.status(201).json({
        success: true,
        data: result,
        message: '导演身份设置成功'
      });
    } catch (error) {
      console.error('设置导演身份错误:', error);
      res.status(500).json({
        error: '设置导演身份失败',
        message: error.message
      });
    }
  },

  // 更新偏好设置
  async updatePreferences(req, res) {
    try {
      const { username = 'Nmyh_NIUMA', ...preferences } = req.body;
      
      if (Object.keys(preferences).length === 0) {
        return res.status(400).json({
          error: '请提供要更新的偏好设置'
        });
      }

      const updatedPrefs = await Director.updatePreferences(username, preferences);
      
      res.json({
        success: true,
        data: updatedPrefs,
        message: '偏好设置更新成功'
      });
    } catch (error) {
      console.error('更新偏好设置错误:', error);
      res.status(500).json({
        error: '更新偏好设置失败',
        message: error.message
      });
    }
  },

  // 更新系统配置
  async updateConfig(req, res) {
    try {
      const { username = 'Nmyh_NIUMA', ...config } = req.body;
      
      if (Object.keys(config).length === 0) {
        return res.status(400).json({
          error: '请提供要更新的系统配置'
        });
      }

      const updatedConfig = await Director.updateConfig(username, config);
      
      res.json({
        success: true,
        data: updatedConfig,
        message: '系统配置更新成功'
      });
    } catch (error) {
      console.error('更新系统配置错误:', error);
      res.status(500).json({
        error: '更新系统配置失败',
        message: error.message
      });
    }
  },

  // 获取导演工作统计
  async getDirectorStats(req, res) {
    try {
      const { username = 'Nmyh_NIUMA' } = req.query;
      const stats = await Director.getDirectorStats(username);
      
      res.json({
        success: true,
        data: stats,
        message: '导演工作统计获取成功'
      });
    } catch (error) {
      console.error('获取导演统计错误:', error);
      res.status(500).json({
        error: '获取导演统计失败',
        message: error.message
      });
    }
  }
};

module.exports = directorController;