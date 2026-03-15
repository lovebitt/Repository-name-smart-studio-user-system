/**
 * 智能工作室工作流集成模块
 * 将用户管理系统与智能体协作工作流连接
 */

const Director = require('../models/Director');
const Agent = require('../models/Agent');
const Project = require('../models/Project');

class WorkflowIntegration {
  constructor() {
    this.workflowRegistry = new Map();
    this.agentConnections = new Map();
  }

  /**
   * 初始化工作流集成
   */
  async initialize() {
    console.log('🚀 初始化智能工作室工作流集成...');
    
    try {
      // 1. 加载导演配置
      const director = await Director.getDirector('Nmyh_NIUMA');
      if (!director) {
        throw new Error('导演身份未设置，请先运行数据库迁移');
      }
      
      // 2. 加载智能体团队
      const agents = await Agent.getAllAgents();
      console.log(`✅ 加载 ${agents.length} 个智能体`);
      
      // 3. 初始化智能体连接
      await this.initializeAgentConnections(agents);
      
      // 4. 启动工作流监控
      this.startWorkflowMonitoring();
      
      console.log('🎉 工作流集成初始化完成');
      return {
        success: true,
        director: director.username,
        agents: agents.length,
        status: 'active'
      };
    } catch (error) {
      console.error('❌ 工作流集成初始化失败:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 初始化智能体连接
   */
  async initializeAgentConnections(agents) {
    for (const agent of agents) {
      const agentConfig = JSON.parse(agent.config || '{}');
      const capabilities = JSON.parse(agent.capabilities || '{}');
      
      this.agentConnections.set(agent.id, {
        id: agent.id,
        name: agent.name,
        type: agent.type,
        status: agent.status,
        capabilities: capabilities,
        config: agentConfig,
        lastActive: agent.last_active,
        connectionStatus: 'connected'
      });
      
      console.log(`🔗 连接智能体: ${agent.name} (${agent.type})`);
    }
  }

  /**
   * 启动工作流监控
   */
  startWorkflowMonitoring() {
    // 每30秒检查一次工作流状态
    this.monitoringInterval = setInterval(async () => {
      try {
        await this.checkWorkflowStatus();
      } catch (error) {
        console.error('工作流监控错误:', error.message);
      }
    }, 30000);
    
    console.log('📊 工作流监控已启动 (30秒间隔)');
  }

  /**
   * 检查工作流状态
   */
  async checkWorkflowStatus() {
    const activeWorkflows = Array.from(this.workflowRegistry.values())
      .filter(wf => wf.status === 'active' || wf.status === 'in_progress');
    
    if (activeWorkflows.length > 0) {
      console.log(`📈 当前活跃工作流: ${activeWorkflows.length}个`);
      
      for (const workflow of activeWorkflows) {
        await this.updateWorkflowProgress(workflow.id);
      }
    }
  }

  /**
   * 创建新的创作工作流
   */
  async createCreativeWorkflow(projectData) {
    try {
      const workflowId = `workflow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // 获取导演信息
      const director = await Director.getDirector('Nmyh_NIUMA');
      
      // 创建项目记录
      const project = await Project.createProject({
        director_id: director.id,
        name: projectData.name,
        description: projectData.description,
        type: projectData.type || 'creative_workflow',
        metadata: {
          ...projectData.metadata,
          workflow_id: workflowId,
          created_by: director.username,
          created_at: new Date().toISOString()
        }
      });
      
      // 创建工作流记录
      const workflow = {
        id: workflowId,
        project_id: project.id,
        name: projectData.name,
        type: projectData.type || 'creative_workflow',
        status: 'planning',
        progress: 0,
        current_stage: '需求分析',
        stages: [
          { name: '需求分析', status: 'pending', agent: 'director' },
          { name: '故事创作', status: 'pending', agent: 'narrative' },
          { name: '分镜设计', status: 'pending', agent: 'storyboard' },
          { name: '视觉风格', status: 'pending', agent: 'visual_style' },
          { name: 'AI生成', status: 'pending', agent: 'dreamai' },
          { name: '质量评估', status: 'pending', agent: 'director' }
        ],
        agents_assigned: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      this.workflowRegistry.set(workflowId, workflow);
      
      // 自动分配智能体
      await this.assignAgentsToWorkflow(workflowId, project.id);
      
      // 启动工作流
      await this.startWorkflow(workflowId);
      
      console.log(`🎬 创建创作工作流: ${workflowId} - ${projectData.name}`);
      
      return {
        success: true,
        workflow_id: workflowId,
        project_id: project.id,
        workflow: workflow,
        message: '创作工作流创建成功'
      };
    } catch (error) {
      console.error('创建创作工作流失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 为工作流分配智能体
   */
  async assignAgentsToWorkflow(workflowId, projectId) {
    try {
      const workflow = this.workflowRegistry.get(workflowId);
      if (!workflow) {
        throw new Error(`工作流 ${workflowId} 不存在`);
      }
      
      // 获取所有智能体
      const agents = await Agent.getAllAgents();
      
      // 根据工作流阶段分配智能体
      const assignments = [];
      
      for (const stage of workflow.stages) {
        const agentType = stage.agent;
        const suitableAgents = agents.filter(a => a.type === agentType && a.status === 'active');
        
        if (suitableAgents.length > 0) {
          const agent = suitableAgents[0]; // 选择第一个合适的智能体
          
          // 更新智能体状态为忙碌
          await Agent.updateAgentStatus(agent.id, 'busy');
          
          // 记录分配
          assignments.push({
            agent_id: agent.id,
            agent_name: agent.name,
            stage: stage.name,
            role: this.getAgentRole(agent.type),
            assigned_at: new Date().toISOString()
          });
          
          console.log(`🤖 分配智能体 ${agent.name} 到阶段: ${stage.name}`);
        } else {
          console.warn(`⚠️ 没有找到合适的智能体类型: ${agentType}`);
        }
      }
      
      // 保存分配记录到项目
      await Project.assignAgentsToProject(projectId, assignments.map(a => ({
        agent_id: a.agent_id,
        role: a.role
      })));
      
      workflow.agents_assigned = assignments;
      workflow.updated_at = new Date().toISOString();
      
      return assignments;
    } catch (error) {
      console.error('分配智能体失败:', error);
      throw error;
    }
  }

  /**
   * 获取智能体角色
   */
  getAgentRole(agentType) {
    const roleMap = {
      'narrative': '故事创作',
      'storyboard': '分镜设计',
      'visual_style': '视觉风格',
      'dreamai': 'AI生成优化',
      'director': '项目协调'
    };
    
    return roleMap[agentType] || '协作成员';
  }

  /**
   * 启动工作流
   */
  async startWorkflow(workflowId) {
    try {
      const workflow = this.workflowRegistry.get(workflowId);
      if (!workflow) {
        throw new Error(`工作流 ${workflowId} 不存在`);
      }
      
      // 更新工作流状态
      workflow.status = 'in_progress';
      workflow.current_stage = workflow.stages[0].name;
      workflow.stages[0].status = 'in_progress';
      workflow.updated_at = new Date().toISOString();
      
      // 更新项目状态
      await Project.updateProject(workflow.project_id, {
        status: 'in_progress',
        progress: 10
      });
      
      console.log(`🚀 启动工作流: ${workflowId} - 当前阶段: ${workflow.current_stage}`);
      
      // 执行第一阶段任务
      await this.executeWorkflowStage(workflowId, 0);
      
      return {
        success: true,
        workflow_id: workflowId,
        current_stage: workflow.current_stage,
        message: '工作流启动成功'
      };
    } catch (error) {
      console.error('启动工作流失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 执行工作流阶段
   */
  async executeWorkflowStage(workflowId, stageIndex) {
    const workflow = this.workflowRegistry.get(workflowId);
    if (!workflow || stageIndex >= workflow.stages.length) {
      return;
    }
    
    const stage = workflow.stages[stageIndex];
    const agentAssignment = workflow.agents_assigned.find(a => a.stage === stage.name);
    
    if (!agentAssignment) {
      console.warn(`⚠️ 阶段 ${stage.name} 没有分配智能体`);
      return;
    }
    
    console.log(`🎯 执行阶段: ${stage.name} - 智能体: ${agentAssignment.agent_name}`);
    
    // 模拟任务执行
    setTimeout(async () => {
      try {
        // 更新阶段状态为完成
        stage.status = 'completed';
        
        // 更新工作流进度
        const progress = Math.round(((stageIndex + 1) / workflow.stages.length) * 100);
        workflow.progress = progress;
        workflow.updated_at = new Date().toISOString();
        
        // 更新项目进度
        await Project.updateProjectProgress(workflow.project_id, progress);
        
        console.log(`✅ 完成阶段: ${stage.name} - 进度: ${progress}%`);
        
        // 如果有下一个阶段，继续执行
        if (stageIndex + 1 < workflow.stages.length) {
          workflow.current_stage = workflow.stages[stageIndex + 1].name;
          workflow.stages[stageIndex + 1].status = 'in_progress';
          
          // 执行下一个阶段
          await this.executeWorkflowStage(workflowId, stageIndex + 1);
        } else {
          // 所有阶段完成
          await this.completeWorkflow(workflowId);
        }
      } catch (error) {
        console.error(`执行阶段 ${stage.name} 失败:`, error);
        stage.status = 'error';
        workflow.status = 'error';
        workflow.error_message = error.message;
      }
    }, 5000); // 模拟5秒任务执行时间
  }

  /**
   * 完成工作流
   */
  async completeWorkflow(workflowId) {
    const workflow = this.workflowRegistry.get(workflowId);
    if (!workflow) return;
    
    workflow.status = 'completed';
    workflow.progress = 100;
    workflow.updated_at = new Date().toISOString();
    
    // 更新项目状态
    await Project.updateProject(workflow.project_id, {
      status: 'completed',
      progress: 100
    });
    
    // 释放智能体
    for (const assignment of workflow.agents_assigned) {
      await Agent.updateAgentStatus(assignment.agent_id, 'active');
    }
    
    console.log(`🎉 工作流完成: ${workflowId} - ${workflow.name}`);
    
    // 发送完成通知
    this.sendWorkflowCompletionNotification(workflow);
  }

  /**
   * 发送工作流完成通知
   */
  sendWorkflowCompletionNotification(workflow) {
    // 这里可以集成消息通知系统
    console.log(`📢 工作流完成通知: ${workflow.name} (ID: ${workflow.id})`);
  }

  /**
   * 更新工作流进度
   */
  async updateWorkflowProgress(workflowId) {
    const workflow = this.workflowRegistry.get(workflowId);
    if (!workflow) return;
    
    // 这里可以添加更复杂的进度计算逻辑
    const completedStages = workflow.stages.filter(s => s.status === 'completed').length;
    const progress = Math.round((completedStages / workflow.stages.length) * 100);
    
    if (progress !== workflow.progress) {
      workflow.progress = progress;
      workflow.updated_at = new Date().toISOString();
      
      // 更新项目进度
      await Project.updateProjectProgress(workflow.project_id, progress);
      
      console.log(`📈 工作流进度更新: ${workflowId} - ${progress}%`);
    }
  }

  /**
   * 获取工作流状态
   */
  getWorkflowStatus(workflowId) {
    const workflow = this.workflowRegistry.get(workflowId);
    if (!workflow) {
      return {
        success: false,
        error: `工作流 ${workflowId} 不存在`
      };
    }
    
    return {
      success: true,
      workflow: workflow,
      agents_assigned: workflow.agents_assigned,
      current_stage: workflow.current_stage,
      progress: workflow.progress
    };
  }

  /**
   * 获取所有工作流
   */
  getAllWorkflows() {
    const workflows = Array.from(this.workflowRegistry.values());
    
    return {
      success: true,
      workflows: workflows,
      count: workflows.length,
      active: workflows.filter(w => w.status === 'active' || w.status === 'in_progress').length,
      completed: workflows.filter(w => w.status === 'completed').length
    };
  }

  /**
   * 停止工作流监控
   */
  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      console.log('🛑 工作流监控已停止');
    }
  }
}

module.exports = WorkflowIntegration;