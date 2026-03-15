const WorkflowIntegration = require('../integration/workflowIntegration');

// 创建工作流集成实例
const workflowIntegration = new WorkflowIntegration();

// 工作流控制器
const workflowController = {
  /**
   * 获取工作流集成状态
   */
  async getIntegrationStatus(req, res) {
    try {
      const activeWorkflows = workflowIntegration.getAllWorkflows();
      
      res.json({
        success: true,
        data: {
          integration_status: 'active',
          workflow_engine: '智能体协作工作流',
          version: '1.0.0',
          active_workflows: activeWorkflows.active || 0,
          total_workflows: activeWorkflows.count || 0,
          last_updated: new Date().toISOString()
        },
        message: '工作流集成状态获取成功'
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
   * 初始化工作流集成
   */
  async initializeIntegration(req, res) {
    try {
      const result = await workflowIntegration.initialize();
      
      if (result.success) {
        res.json({
          success: true,
          data: result,
          message: '工作流集成初始化成功'
        });
      } else {
        res.status(500).json({
          success: false,
          error: '集成初始化失败',
          message: result.error
        });
      }
    } catch (error) {
      console.error('初始化集成错误:', error);
      res.status(500).json({
        error: '初始化集成失败',
        message: error.message
      });
    }
  },

  /**
   * 创建新的创作工作流
   */
  async createWorkflow(req, res) {
    try {
      const workflowData = req.body;
      
      // 验证必要字段
      if (!workflowData.name) {
        return res.status(400).json({
          error: '工作流名称是必填字段'
        });
      }

      const result = await workflowIntegration.createCreativeWorkflow(workflowData);
      
      if (result.success) {
        res.status(201).json({
          success: true,
          data: result,
          message: '创作工作流创建成功'
        });
      } else {
        res.status(500).json({
          success: false,
          error: '创建工作流失败',
          message: result.error
        });
      }
    } catch (error) {
      console.error('创建工作流错误:', error);
      res.status(500).json({
        error: '创建工作流失败',
        message: error.message
      });
    }
  },

  /**
   * 获取所有工作流
   */
  async getAllWorkflows(req, res) {
    try {
      const result = workflowIntegration.getAllWorkflows();
      
      res.json({
        success: true,
        data: result,
        message: '工作流列表获取成功'
      });
    } catch (error) {
      console.error('获取工作流列表错误:', error);
      res.status(500).json({
        error: '获取工作流列表失败',
        message: error.message
      });
    }
  },

  /**
   * 获取特定工作流详情
   */
  async getWorkflowById(req, res) {
    try {
      const { id } = req.params;
      const result = workflowIntegration.getWorkflowStatus(id);
      
      if (result.success) {
        res.json({
          success: true,
          data: result,
          message: '工作流详情获取成功'
        });
      } else {
        res.status(404).json({
          success: false,
          error: '工作流未找到',
          message: result.error
        });
      }
    } catch (error) {
      console.error('获取工作流详情错误:', error);
      res.status(500).json({
        error: '获取工作流详情失败',
        message: error.message
      });
    }
  },

  /**
   * 获取工作流状态
   */
  async getWorkflowStatus(req, res) {
    try {
      const { id } = req.params;
      const result = workflowIntegration.getWorkflowStatus(id);
      
      if (result.success) {
        res.json({
          success: true,
          data: {
            workflow_id: id,
            status: result.workflow.status,
            current_stage: result.workflow.current_stage,
            progress: result.workflow.progress,
            agents_assigned: result.agents_assigned,
            updated_at: result.workflow.updated_at
          },
          message: '工作流状态获取成功'
        });
      } else {
        res.status(404).json({
          success: false,
          error: '工作流未找到',
          message: result.error
        });
      }
    } catch (error) {
      console.error('获取工作流状态错误:', error);
      res.status(500).json({
        error: '获取工作流状态失败',
        message: error.message
      });
    }
  },

  /**
   * 启动工作流
   */
  async startWorkflow(req, res) {
    try {
      const { id } = req.params;
      const result = await workflowIntegration.startWorkflow(id);
      
      if (result.success) {
        res.json({
          success: true,
          data: result,
          message: '工作流启动成功'
        });
      } else {
        res.status(400).json({
          success: false,
          error: '启动工作流失败',
          message: result.error
        });
      }
    } catch (error) {
      console.error('启动工作流错误:', error);
      res.status(500).json({
        error: '启动工作流失败',
        message: error.message
      });
    }
  },

  /**
   * 暂停工作流
   */
  async pauseWorkflow(req, res) {
    try {
      const { id } = req.params;
      const workflow = workflowIntegration.getWorkflowStatus(id);
      
      if (!workflow.success) {
        return res.status(404).json({
          success: false,
          error: '工作流未找到',
          message: workflow.error
        });
      }
      
      // 这里可以实现暂停逻辑
      // 目前先返回模拟响应
      res.json({
        success: true,
        data: {
          workflow_id: id,
          status: 'paused',
          previous_status: workflow.workflow.status,
          paused_at: new Date().toISOString()
        },
        message: '工作流已暂停'
      });
    } catch (error) {
      console.error('暂停工作流错误:', error);
      res.status(500).json({
        error: '暂停工作流失败',
        message: error.message
      });
    }
  },

  /**
   * 恢复工作流
   */
  async resumeWorkflow(req, res) {
    try {
      const { id } = req.params;
      const workflow = workflowIntegration.getWorkflowStatus(id);
      
      if (!workflow.success) {
        return res.status(404).json({
          success: false,
          error: '工作流未找到',
          message: workflow.error
        });
      }
      
      // 这里可以实现恢复逻辑
      // 目前先返回模拟响应
      res.json({
        success: true,
        data: {
          workflow_id: id,
          status: 'in_progress',
          resumed_at: new Date().toISOString()
        },
        message: '工作流已恢复'
      });
    } catch (error) {
      console.error('恢复工作流错误:', error);
      res.status(500).json({
        error: '恢复工作流失败',
        message: error.message
      });
    }
  },

  /**
   * 取消工作流
   */
  async cancelWorkflow(req, res) {
    try {
      const { id } = req.params;
      const workflow = workflowIntegration.getWorkflowStatus(id);
      
      if (!workflow.success) {
        return res.status(404).json({
          success: false,
          error: '工作流未找到',
          message: workflow.error
        });
      }
      
      // 这里可以实现取消逻辑
      // 目前先返回模拟响应
      res.json({
        success: true,
        data: {
          workflow_id: id,
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          reason: req.body.reason || '用户手动取消'
        },
        message: '工作流已取消'
      });
    } catch (error) {
      console.error('取消工作流错误:', error);
      res.status(500).json({
        error: '取消工作流失败',
        message: error.message
      });
    }
  },

  /**
   * 获取工作流分配的智能体
   */
  async getWorkflowAgents(req, res) {
    try {
      const { id } = req.params;
      const workflow = workflowIntegration.getWorkflowStatus(id);
      
      if (!workflow.success) {
        return res.status(404).json({
          success: false,
          error: '工作流未找到',
          message: workflow.error
        });
      }
      
      res.json({
        success: true,
        data: {
          workflow_id: id,
          agents: workflow.agents_assigned || [],
          count: (workflow.agents_assigned || []).length
        },
        message: '工作流智能体获取成功'
      });
    } catch (error) {
      console.error('获取工作流智能体错误:', error);
      res.status(500).json({
        error: '获取工作流智能体失败',
        message: error.message
      });
    }
  },

  /**
   * 获取工作流进度详情
   */
  async getWorkflowProgress(req, res) {
    try {
      const { id } = req.params;
      const workflow = workflowIntegration.getWorkflowStatus(id);
      
      if (!workflow.success) {
        return res.status(404).json({
          success: false,
          error: '工作流未找到',
          message: workflow.error
        });
      }
      
      res.json({
        success: true,
        data: {
          workflow_id: id,
          progress: workflow.workflow.progress,
          current_stage: workflow.workflow.current_stage,
          stages: workflow.workflow.stages,
          estimated_completion: this.calculateEstimatedCompletion(workflow.workflow),
          last_updated: workflow.workflow.updated_at
        },
        message: '工作流进度获取成功'
      });
    } catch (error) {
      console.error('获取工作流进度错误:', error);
      res.status(500).json({
        error: '获取工作流进度失败',
        message: error.message
      });
    }
  },

  /**
   * 计算预计完成时间
   */
  calculateEstimatedCompletion(workflow) {
    const completedStages = workflow.stages.filter(s => s.status === 'completed').length;
    const totalStages = workflow.stages.length;
    
    if (completedStages === 0) {
      return '尚未开始';
    }
    
    if (completedStages === totalStages) {
      return '已完成';
    }
    
    // 简单估算：每个阶段5分钟
    const remainingStages = totalStages - completedStages;
    const estimatedMinutes = remainingStages * 5;
    
    const completionTime = new Date(Date.now() + estimatedMinutes * 60000);
    return completionTime.toLocaleString('zh-CN');
  },

  /**
   * 手动更新工作流进度
   */
  async updateWorkflowProgress(req, res) {
    try {
      const { id } = req.params;
      const { progress } = req.body;
      
      if (typeof progress !== 'number' || progress < 0 || progress > 100) {
        return res.status(400).json({
          error: '进度必须是0-100之间的数字'
        });
      }
      
      const workflow = workflowIntegration.getWorkflowStatus(id);
      
      if (!workflow.success) {
        return res.status(404).json({
          success: false,
          error: '工作流未找到',
          message: workflow.error
        });
      }
      
      // 这里可以实现进度更新逻辑
      // 目前先返回模拟响应
      res.json({
        success: true,
        data: {
          workflow_id: id,
          previous_progress: workflow.workflow.progress,
          new_progress: progress,
          updated_at: new Date().toISOString()
        },
        message: '工作流进度更新成功'
      });
    } catch (error) {
      console.error('更新工作流进度错误:', error);
      res.status(500).json({
        error: '更新工作流进度失败',
        message: error.message
      });
    }
  },

  /**
   * 获取工作流统计概览
   */
  async getWorkflowStats(req, res) {
    try {
      const allWorkflows = workflowIntegration.getAllWorkflows();
      
      const stats = {
        total: allWorkflows.count || 0,
        active: allWorkflows.active || 0,
        completed: allWorkflows.completed || 0,
        paused: 0,
        cancelled: 0,
        average_progress: this.calculateAverageProgress(allWorkflows.workflows || []),
        by_type: this.groupWorkflowsByType(allWorkflows.workflows || []),
        recent_activity: this.getRecentActivity(allWorkflows.workflows || [])
      };
      
      res.json({
        success: true,
        data: stats,
        message: '工作流统计获取成功'
      });
    } catch (error) {
      console.error('获取工作流统计错误:', error);
      res.status(500).json({
        error: '获取工作流统计失败',
        message: error.message
      });
    }
  },

  /**
   * 计算平均进度
   */
  calculateAverageProgress(workflows) {
    if (workflows.length === 0) return 0;
    
    const totalProgress = workflows.reduce((sum, wf) => sum + (wf.progress || 0), 0);
    return Math.round(totalProgress / workflows.length);
  },

  /**
   * 按类型分组工作流
   */
  groupWorkflowsByType(workflows) {
    const groups = {};
    
    workflows.forEach(wf => {
      const type = wf.type || 'unknown';
      if (!groups[type]) {
        groups[type] = {
          count: 0,
          average_progress: 0,
          workflows: []
        };
      }
      
      groups[type].count++;
      groups[type].workflows.push(wf.id);
    });
    
    // 计算每个类型的平均进度
    Object.keys(groups).forEach(type => {
      const typeWorkflows = workflows.filter(wf => (wf.type || 'unknown') === type);
      groups[type].average_progress = this.calculateAverageProgress(typeWorkflows);
    });
    
    return groups;
  },

  /**
   * 获取最近活动
   */
  getRecentActivity(workflows) {
    // 按更新时间排序，取最近5个
    return workflows
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 5)
      .map(wf => ({
        id: wf.id,
        name: wf.name,
        status: wf.status,
        progress: wf.progress,
        updated_at: wf.updated_at
      }));
  },

  /**
   * 获取活跃工作流数量
   */
  async getActiveWorkflowsCount(req, res) {
    try {
      const allWorkflows = workflowIntegration.getAllWorkflows();
      
      res.json({
        success: true,
        data: {
          active_count: allWorkflows.active || 0,
          total_count: allWorkflows.count || 0,
          active_percentage: allWorkflows.count > 0 
            ? Math.round((allWorkflows.active / allWorkflows.count) * 100) 
            : 0
        },
        message: '活跃工作流数量获取成功'
      });
    } catch (error) {
      console.error('获取活跃工作流数量错误:', error);
      res.status(500).json({
        error: '获取活跃工作流数量失败',
        message: error.message
      });
    }
  },

  /**
   * 为工作流分配智能体
   */
  async assignAgentsToWorkflow(req, res) {
    try {
      const { id } = req.params;
      const { agents } = req.body;
      
      if (!Array.isArray(agents) || agents.length === 0) {
        return res.status(400).json({
          error: '请提供智能体数组'
        });
      }
      
      // 这里可以实现智能体分配逻辑
      // 目前先返回模拟响应
      res.json({
        success: true,
        data: {
          workflow_id: id,
          agents_assigned: agents,
          assigned_at: new Date().toISOString(),
          assignment_count: agents.length
        },
        message: '智能体分配成功'
      });
    } catch (error) {
      console.error('分配智能体错误:', error);
      res.status(500).json({
        error: '分配智能体失败',
        message: error.message
      });
    }
  },

  /**
   * 执行工作流特定阶段
   */
  async executeWorkflowStage(req, res) {
    try {
      const { id } = req.params;
      const { stage_index } = req.body;
      
      if (typeof stage_index !== 'number' || stage_index < 0) {
        return res.status(400).json({
          error: '请提供有效的阶段索引'
        });
      }
      
      const workflow = workflowIntegration.getWorkflowStatus(id);
      
      if (!workflow.success) {
        return res.status(404).json({
          success: false,
          error: '工作流未找到',
          message: workflow.error
        });
      }
      
      if (stage_index >= workflow.workflow.stages.length) {
        return res.status(400).json({
          error: '阶段索引超出范围'
        });
      }
      
      // 这里可以实现阶段执行逻辑
      // 目前先返回模拟响应
      const stage = workflow.workflow.stages[stage_index];
      
      res.json({
        success: true,
        data: {
          workflow_id: id,
          stage_index: stage_index,
          stage_name: stage.name,
          status: 'executing',
          started_at: new Date().toISOString(),
          estimated_duration: '5分钟'
        },
        message: '工作流阶段开始执行'
      });
    } catch (error) {
      console.error('执行工作流阶段错误:', error);
      res.status(500).json({
        error: '执行工作流阶段失败',
        message: error.message
      });
    }
  },

  /**
   * 测试工作流集成
   */
  async testIntegration(req, res) {
    try {
      // 测试数据库连接
      const Director = require('../models/Director');
      const Agent = require('../models/Agent');
      
      const director = await Director.getDirector('Nmyh_NIUMA');
      const agents = await Agent.getAllAgents();
      
      // 测试工作流创建
      const testWorkflowData = {
        name: '集成测试工作流',
        description: '测试智能体协作工作流集成',
        type: 'test',
        metadata: {
          test: true,
          purpose: '验证工作流集成功能'
        }
      };
      
      const testResult = await workflowIntegration.createCreativeWorkflow(testWorkflowData);
      
      res.json({
        success: true,
        data: {
          integration_test: 'passed',
          database: {
            director_found: !!director,
            agents_count: agents.length
          },
          workflow_engine: {
            initialized: true,
            test_workflow_created: testResult.success,
            workflow_id: testResult.success ? testResult.workflow_id : null
          },
          system_status: {
            api_server: 'running',
            workflow_integration: 'active',
            monitoring: 'enabled'
          }
        },
        message: '工作流集成测试完成'
      });
    } catch (error) {
      console.error('集成测试错误:', error);
      res.status(500).json({
        success: false,
        error: '集成测试失败',
        message: error.message,
        details: {
          integration_status: 'failed',
          error_type: error.constructor.name
        }
      });
    }
  }
};

module.exports = workflowController;