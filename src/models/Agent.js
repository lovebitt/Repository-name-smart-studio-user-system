const { query, run } = require('../config/database');

class Agent {
  // 获取所有智能体
  static async getAllAgents() {
    try {
      return await query('SELECT * FROM agents ORDER BY type, name');
    } catch (error) {
      console.error('获取智能体列表错误:', error);
      throw error;
    }
  }

  // 获取特定类型智能体
  static async getAgentsByType(type) {
    try {
      return await query('SELECT * FROM agents WHERE type = ? ORDER BY name', [type]);
    } catch (error) {
      console.error('按类型获取智能体错误:', error);
      throw error;
    }
  }

  // 获取单个智能体
  static async getAgentById(id) {
    try {
      const agents = await query('SELECT * FROM agents WHERE id = ?', [id]);
      return agents[0] || null;
    } catch (error) {
      console.error('获取智能体错误:', error);
      throw error;
    }
  }

  // 更新智能体状态
  static async updateAgentStatus(id, status) {
    try {
      const validStatuses = ['active', 'inactive', 'busy', 'maintenance'];
      if (!validStatuses.includes(status)) {
        throw new Error(`状态无效，必须是: ${validStatuses.join(', ')}`);
      }

      await run(
        'UPDATE agents SET status = ?, last_active = CURRENT_TIMESTAMP WHERE id = ?',
        [status, id]
      );

      return await this.getAgentById(id);
    } catch (error) {
      console.error('更新智能体状态错误:', error);
      throw error;
    }
  }

  // 更新智能体配置
  static async updateAgentConfig(id, config) {
    try {
      const agent = await this.getAgentById(id);
      if (!agent) {
        throw new Error('智能体不存在');
      }

      const currentConfig = JSON.parse(agent.config || '{}');
      const updatedConfig = { ...currentConfig, ...config };

      await run(
        'UPDATE agents SET config = ?, last_active = CURRENT_TIMESTAMP WHERE id = ?',
        [JSON.stringify(updatedConfig), id]
      );

      return { ...agent, config: updatedConfig };
    } catch (error) {
      console.error('更新智能体配置错误:', error);
      throw error;
    }
  }

  // 获取智能体统计
  static async getAgentStats() {
    try {
      const stats = await query(`
        SELECT 
          COUNT(*) as total_agents,
          SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_agents,
          SUM(CASE WHEN status = 'busy' THEN 1 ELSE 0 END) as busy_agents,
          SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) as inactive_agents,
          GROUP_CONCAT(DISTINCT type) as agent_types
        FROM agents
      `);

      const typeStats = await query(`
        SELECT type, COUNT(*) as count, 
               GROUP_CONCAT(name) as agent_names
        FROM agents 
        GROUP BY type
      `);

      return {
        overview: stats[0] || {},
        by_type: typeStats
      };
    } catch (error) {
      console.error('获取智能体统计错误:', error);
      throw error;
    }
  }

  // 获取智能体协作历史
  static async getAgentCollaborationHistory(agentId, limit = 10) {
    try {
      return await query(`
        SELECT 
          p.name as project_name,
          p.type as project_type,
          p.status as project_status,
          p.progress,
          pa.role,
          pa.assigned_at
        FROM project_agents pa
        JOIN projects p ON pa.project_id = p.id
        WHERE pa.agent_id = ?
        ORDER BY pa.assigned_at DESC
        LIMIT ?
      `, [agentId, limit]);
    } catch (error) {
      console.error('获取智能体协作历史错误:', error);
      throw error;
    }
  }

  // 获取智能体能力描述
  static async getAgentCapabilities(id) {
    try {
      const agent = await this.getAgentById(id);
      if (!agent) {
        throw new Error('智能体不存在');
      }

      return {
        id: agent.id,
        name: agent.name,
        type: agent.type,
        capabilities: JSON.parse(agent.capabilities || '{}'),
        config: JSON.parse(agent.config || '{}')
      };
    } catch (error) {
      console.error('获取智能体能力错误:', error);
      throw error;
    }
  }
}

module.exports = Agent;