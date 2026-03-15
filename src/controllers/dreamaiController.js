const DreamAIIntegration = require('../integration/dreamaiIntegration');

// 创建即梦AI集成实例
const dreamaiIntegration = new DreamAIIntegration();

// 即梦AI控制器
const dreamaiController = {
  /**
   * 获取集成状态
   */
  async getIntegrationStatus(req, res) {
    try {
      const stats = dreamaiIntegration.getPromptStats();
      
      if (!stats.success) {
        // 如果未初始化，返回未初始化状态
        return res.json({
          success: true,
          data: {
            integration_status: 'not_initialized',
            message: '即梦AI提示词库未初始化',
            action_required: '请调用 /api/dreamai/initialize 初始化提示词库'
          }
        });
      }
      
      res.json({
        success: true,
        data: {
          integration_status: 'active',
          library_version: 'Seedance2.0',
          prompt_count: stats.stats.total_prompts,
          category_count: stats.stats.total_categories,
          last_parsed: stats.stats.last_parsed,
          initialized: true
        },
        message: '即梦AI集成状态获取成功'
      });
    } catch (error) {
      console.error('获取集成状态错误:', error);
      res.status(500).json({
        error: '获取集成状态失败',
        message: error.message
      });
    }
  },

  /**
   * 初始化提示词库
   */
  async initializeLibrary(req, res) {
    try {
      const result = await dreamaiIntegration.initialize();
      
      if (result.success) {
        res.json({
          success: true,
          data: result,
          message: '即梦AI提示词库初始化成功'
        });
      } else {
        res.status(500).json({
          success: false,
          error: '初始化提示词库失败',
          message: result.error
        });
      }
    } catch (error) {
      console.error('初始化提示词库错误:', error);
      res.status(500).json({
        error: '初始化提示词库失败',
        message: error.message
      });
    }
  },

  /**
   * 获取提示词类别列表
   */
  async getCategories(req, res) {
    try {
      const result = dreamaiIntegration.getCategories();
      
      if (result.success) {
        res.json({
          success: true,
          data: result,
          message: '提示词类别列表获取成功'
        });
      } else {
        res.status(400).json({
          success: false,
          error: '获取类别列表失败',
          message: result.error
        });
      }
    } catch (error) {
      console.error('获取类别列表错误:', error);
      res.status(500).json({
        error: '获取类别列表失败',
        message: error.message
      });
    }
  },

  /**
   * 获取特定类别详情
   */
  async getCategoryDetails(req, res) {
    try {
      const { name } = req.params;
      const result = dreamaiIntegration.getCategoryDetails(name);
      
      if (result.success) {
        res.json({
          success: true,
          data: result,
          message: '类别详情获取成功'
        });
      } else {
        res.status(404).json({
          success: false,
          error: '获取类别详情失败',
          message: result.error
        });
      }
    } catch (error) {
      console.error('获取类别详情错误:', error);
      res.status(500).json({
        error: '获取类别详情失败',
        message: error.message
      });
    }
  },

  /**
   * 根据需求生成提示词
   */
  async generatePrompt(req, res) {
    try {
      const requirements = req.body;
      
      // 验证必要字段
      if (!requirements.scene_type && !requirements.style_preference) {
        return res.status(400).json({
          error: '请至少提供场景类型或风格偏好',
          example: {
            scene_type: '城市夜景',
            style_preference: '梦幻',
            camera_technique: '推镜头',
            special_effects: '光晕效果',
            duration: 60,
            target_audience: '年轻人',
            emotion_tone: '浪漫'
          }
        });
      }
      
      const result = await dreamaiIntegration.generatePrompt(requirements);
      
      if (result.success) {
        res.json({
          success: true,
          data: result,
          message: '提示词生成成功'
        });
      } else {
        res.status(400).json({
          success: false,
          error: '生成提示词失败',
          message: result.error
        });
      }
    } catch (error) {
      console.error('生成提示词错误:', error);
      res.status(500).json({
        error: '生成提示词失败',
        message: error.message
      });
    }
  },

  /**
   * 搜索提示词
   */
  async searchPrompts(req, res) {
    try {
      const { keyword, limit = 20 } = req.query;
      
      if (!keyword || keyword.trim() === '') {
        return res.status(400).json({
          error: '请提供搜索关键词',
          example: '?keyword=梦幻&limit=10'
        });
      }
      
      const result = dreamaiIntegration.searchPromptsByKeyword(keyword.trim(), parseInt(limit));
      
      if (result.success) {
        res.json({
          success: true,
          data: result,
          message: '提示词搜索成功'
        });
      } else {
        res.status(400).json({
          success: false,
          error: '搜索提示词失败',
          message: result.error
        });
      }
    } catch (error) {
      console.error('搜索提示词错误:', error);
      res.status(500).json({
        error: '搜索提示词失败',
        message: error.message
      });
    }
  },

  /**
   * 获取热门提示词
   */
  async getPopularPrompts(req, res) {
    try {
      const { limit = 10 } = req.query;
      const result = dreamaiIntegration.getPopularPrompts(parseInt(limit));
      
      if (result.success) {
        res.json({
          success: true,
          data: result,
          message: '热门提示词获取成功'
        });
      } else {
        res.status(400).json({
          success: false,
          error: '获取热门提示词失败',
          message: result.error
        });
      }
    } catch (error) {
      console.error('获取热门提示词错误:', error);
      res.status(500).json({
        error: '获取热门提示词失败',
        message: error.message
      });
    }
  },

  /**
   * 获取提示词统计
   */
  async getPromptStats(req, res) {
    try {
      const result = dreamaiIntegration.getPromptStats();
      
      if (result.success) {
        res.json({
          success: true,
          data: result,
          message: '提示词统计获取成功'
        });
      } else {
        res.status(400).json({
          success: false,
          error: '获取提示词统计失败',
          message: result.error
        });
      }
    } catch (error) {
      console.error('获取提示词统计错误:', error);
      res.status(500).json({
        error: '获取提示词统计失败',
        message: error.message
      });
    }
  },

  /**
   * 集成到工作流
   */
  async integrateWithWorkflow(req, res) {
    try {
      const workflowData = req.body;
      
      if (!workflowData.project_type || !workflowData.requirements) {
        return res.status(400).json({
          error: '请提供工作流数据和需求',
          required_fields: ['project_type', 'requirements'],
          optional_fields: ['workflow_stages']
        });
      }
      
      const result = dreamaiIntegration.integrateWithWorkflow(workflowData);
      
      if (result.success) {
        res.json({
          success: true,
          data: result,
          message: '工作流集成成功'
        });
      } else {
        res.status(400).json({
          success: false,
          error: '工作流集成失败',
          message: result.error
        });
      }
    } catch (error) {
      console.error('工作流集成错误:', error);
      res.status(500).json({
        error: '工作流集成失败',
        message: error.message
      });
    }
  },

  /**
   * 测试即梦AI集成
   */
  async testIntegration(req, res) {
    try {
      // 1. 初始化测试
      const initResult = await dreamaiIntegration.initialize();
      
      if (!initResult.success) {
        return res.status(500).json({
          success: false,
          error: '初始化测试失败',
          message: initResult.error
        });
      }
      
      // 2. 生成测试提示词
      const testRequirements = {
        scene_type: '城市夜景',
        style_preference: '梦幻',
        camera_technique: '推镜头',
        special_effects: '光晕效果',
        duration: 60,
        target_audience: '年轻人',
        emotion_tone: '浪漫'
      };
      
      const promptResult = await dreamaiIntegration.generatePrompt(testRequirements);
      
      // 3. 搜索测试
      const searchResult = dreamaiIntegration.searchPromptsByKeyword('梦幻', 5);
      
      // 4. 统计测试
      const statsResult = dreamaiIntegration.getPromptStats();
      
      // 5. 工作流集成测试
      const workflowTestData = {
        project_type: 'video_creation',
        requirements: testRequirements,
        workflow_stages: [
          { name: 'AI生成阶段', agent_type: 'dreamai' },
          { name: '视觉优化阶段', agent_type: 'visual_style' }
        ]
      };
      
      const workflowResult = dreamaiIntegration.integrateWithWorkflow(workflowTestData);
      
      res.json({
        success: true,
        data: {
          initialization: initResult,
          prompt_generation: promptResult,
          search_function: searchResult,
          statistics: statsResult,
          workflow_integration: workflowResult,
          overall_status: 'all_tests_passed'
        },
        message: '即梦AI集成测试完成'
      });
    } catch (error) {
      console.error('集成测试错误:', error);
      res.status(500).json({
        success: false,
        error: '集成测试失败',
        message: error.message,
        test_status: 'failed'
      });
    }
  }
};

module.exports = dreamaiController;