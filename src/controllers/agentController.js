const Agent = require('../models/Agent');

// 智能体控制器
const agentController = {
  // 获取所有智能体
  async getAllAgents(req, res) {
    try {
      const agents = await Agent.getAllAgents();
      
      // 解析JSON字段
      const formattedAgents = agents.map(agent => ({
        ...agent,
        capabilities: JSON.parse(agent.capabilities || '{}'),
        config: JSON.parse(agent.config || '{}')
      }));

      res.json({
        success: true,
        data: formattedAgents,
        count: formattedAgents.length,
        message: '智能体列表获取成功'
      });
    } catch (error) {
      console.error('获取智能体列表错误:', error);
      res.status(500).json({
        error: '获取智能体列表失败',
        message: error.message
      });
    }
  },

  // 获取特定类型智能体
  async getAgentsByType(req, res) {
    try {
      const { type } = req.params;
      const agents = await Agent.getAgentsByType(type);
      
      const formattedAgents = agents.map(agent => ({
        ...agent,
        capabilities: JSON.parse(agent.capabilities || '{}'),
        config: JSON.parse(agent.config || '{}')
      }));

      res.json({
        success: true,
        data: formattedAgents,
        count: formattedAgents.length,
        message: `${type}类型智能体获取成功`
      });
    } catch (error) {
      console.error('按类型获取智能体错误:', error);
      res.status(500).json({
        error: '按类型获取智能体失败',
        message: error.message
      });
    }
  },

  // 获取单个智能体
  async getAgentById(req, res) {
    try {
      const { id } = req.params;
      const agent = await Agent.getAgentById(id);
      
      if (!agent) {
        return res.status(404).json({
          error: '智能体未找到',
          id
        });
      }

      const formattedAgent = {
        ...agent,
        capabilities: JSON.parse(agent.capabilities || '{}'),
        config: JSON.parse(agent.config || '{}')
      };

      res.json({
        success: true,
        data: formattedAgent,
        message: '智能体信息获取成功'
      });
    } catch (error) {
      console.error('获取智能体错误:', error);
      res.status(500).json({
        error: '获取智能体失败',
        message: error.message
      });
    }
  },

  // 更新智能体状态
  async updateAgentStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({
          error: '请提供状态值',
          valid_statuses: ['active', 'inactive', 'busy', 'maintenance']
        });
      }

      const updatedAgent = await Agent.updateAgentStatus(id, status);
      
      res.json({
        success: true,
        data: updatedAgent,
        message: '智能体状态更新成功'
      });
    } catch (error) {
      console.error('更新智能体状态错误:', error);
      res.status(error.message.includes('状态无效') ? 400 : 500).json({
        error: '更新智能体状态失败',
        message: error.message
      });
    }
  },

  // 更新智能体配置
  async updateAgentConfig(req, res) {
    try {
      const { id } = req.params;
      const config = req.body;
      
      if (Object.keys(config).length === 0) {
        return res.status(400).json({
          error: '请提供要更新的配置'
        });
      }

      const updatedAgent = await Agent.updateAgentConfig(id, config);
      
      res.json({
        success: true,
        data: updatedAgent,
        message: '智能体配置更新成功'
      });
    } catch (error) {
      console.error('更新智能体配置错误:', error);
      res.status(500).json({
        error: '更新智能体配置失败',
        message: error.message
      });
    }
  },

  // 获取智能体能力描述
  async getAgentCapabilities(req, res) {
    try {
      const { id } = req.params;
      const capabilities = await Agent.getAgentCapabilities(id);
      
      res.json({
        success: true,
        data: capabilities,
        message: '智能体能力描述获取成功'
      });
    } catch (error) {
      console.error('获取智能体能力错误:', error);
      res.status(500).json({
        error: '获取智能体能力失败',
        message: error.message
      });
    }
  },

  // 获取智能体协作历史
  async getAgentCollaborationHistory(req, res) {
    try {
      const { id } = req.params;
      const { limit = 10 } = req.query;
      
      const history = await Agent.getAgentCollaborationHistory(id, parseInt(limit));
      
      res.json({
        success: true,
        data: history,
        count: history.length,
        message: '智能体协作历史获取成功'
      });
    } catch (error) {
      console.error('获取智能体协作历史错误:', error);
      res.status(500).json({
        error: '获取智能体协作历史失败',
        message: error.message
      });
    }
  },

  // 获取智能体统计
  async getAgentStats(req, res) {
    try {
      const stats = await Agent.getAgentStats();
      
      res.json({
        success: true,
        data: stats,
        message: '智能体统计获取成功'
      });
    } catch (error) {
      console.error('获取智能体统计错误:', error);
      res.status(500).json({
        error: '获取智能体统计失败',
        message: error.message
      });
    }
  }
};

module.exports = agentController;