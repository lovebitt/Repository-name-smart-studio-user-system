const { query, run } = require('../config/database');

class Project {
  // 获取所有项目
  static async getAllProjects(directorId = null) {
    try {
      let sql = 'SELECT * FROM projects';
      const params = [];
      
      if (directorId) {
        sql += ' WHERE director_id = ?';
        params.push(directorId);
      }
      
      sql += ' ORDER BY created_at DESC';
      return await query(sql, params);
    } catch (error) {
      console.error('获取项目列表错误:', error);
      throw error;
    }
  }

  // 创建新项目
  static async createProject(projectData) {
    try {
      const { director_id, name, description, type, metadata = {} } = projectData;
      
      if (!director_id || !name) {
        throw new Error('缺少必要字段: director_id 和 name');
      }

      const result = await run(
        `INSERT INTO projects 
         (director_id, name, description, type, metadata) 
         VALUES (?, ?, ?, ?, ?)`,
        [director_id, name, description, type, JSON.stringify(metadata)]
      );

      return { id: result.id, ...projectData };
    } catch (error) {
      console.error('创建项目错误:', error);
      throw error;
    }
  }

  // 获取单个项目
  static async getProjectById(id) {
    try {
      const projects = await query('SELECT * FROM projects WHERE id = ?', [id]);
      return projects[0] || null;
    } catch (error) {
      console.error('获取项目错误:', error);
      throw error;
    }
  }

  // 更新项目信息
  static async updateProject(id, updateData) {
    try {
      const allowedFields = ['name', 'description', 'type', 'status', 'metadata'];
      const updates = [];
      const params = [];

      for (const [key, value] of Object.entries(updateData)) {
        if (allowedFields.includes(key)) {
          if (key === 'metadata') {
            updates.push(`${key} = ?`);
            params.push(JSON.stringify(value));
          } else {
            updates.push(`${key} = ?`);
            params.push(value);
          }
        }
      }

      if (updates.length === 0) {
        throw new Error('没有有效的更新字段');
      }

      updates.push('updated_at = CURRENT_TIMESTAMP');
      params.push(id);

      await run(
        `UPDATE projects SET ${updates.join(', ')} WHERE id = ?`,
        params
      );

      return await this.getProjectById(id);
    } catch (error) {
      console.error('更新项目错误:', error);
      throw error;
    }
  }

  // 更新项目进度
  static async updateProjectProgress(id, progress) {
    try {
      if (progress < 0 || progress > 100) {
        throw new Error('进度必须在 0-100 之间');
      }

      await run(
        'UPDATE projects SET progress = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [progress, id]
      );

      return await this.getProjectById(id);
    } catch (error) {
      console.error('更新项目进度错误:', error);
      throw error;
    }
  }

  // 删除项目
  static async deleteProject(id) {
    try {
      // 先删除关联的智能体分配
      await run('DELETE FROM project_agents WHERE project_id = ?', [id]);
      
      // 再删除项目
      const result = await run('DELETE FROM projects WHERE id = ?', [id]);
      
      return result.changes > 0;
    } catch (error) {
      console.error('删除项目错误:', error);
      throw error;
    }
  }

  // 为项目分配智能体
  static async assignAgentsToProject(projectId, agents) {
    try {
      const results = [];
      
      for (const agent of agents) {
        const { agent_id, role } = agent;
        
        const result = await run(
          `INSERT OR REPLACE INTO project_agents (project_id, agent_id, role) 
           VALUES (?, ?, ?)`,
          [projectId, agent_id, role]
        );
        
        results.push({ agent_id, role, assigned: true });
      }
      
      return results;
    } catch (error) {
      console.error('分配智能体错误:', error);
      throw error;
    }
  }

  // 获取项目智能体列表
  static async getProjectAgents(projectId) {
    try {
      return await query(`
        SELECT a.*, pa.role, pa.assigned_at
        FROM project_agents pa
        JOIN agents a ON pa.agent_id = a.id
        WHERE pa.project_id = ?
        ORDER BY pa.assigned_at
      `, [projectId]);
    } catch (error) {
      console.error('获取项目智能体错误:', error);
      throw error;
    }
  }

  // 获取项目统计
  static async getProjectStats(directorId = null) {
    try {
      let whereClause = '';
      const params = [];
      
      if (directorId) {
        whereClause = 'WHERE director_id = ?';
        params.push(directorId);
      }

      const stats = await query(`
        SELECT 
          COUNT(*) as total_projects,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_projects,
          SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_projects,
          SUM(CASE WHEN status = 'planning' THEN 1 ELSE 0 END) as planning_projects,
          AVG(progress) as average_progress,
          GROUP_CONCAT(DISTINCT type) as project_types
        FROM projects
        ${whereClause}
      `, params);

      const typeStats = await query(`
        SELECT type, COUNT(*) as count, 
               AVG(progress) as avg_progress,
               GROUP_CONCAT(name) as project_names
        FROM projects
        ${directorId ? 'WHERE director_id = ?' : ''}
        GROUP BY type
      `, directorId ? [directorId] : []);

      return {
        overview: stats[0] || {},
        by_type: typeStats
      };
    } catch (error) {
      console.error('获取项目统计错误:', error);
      throw error;
    }
  }

  // 获取导演的项目（通过导演用户名）
  static async getProjectsByDirectorUsername(username) {
    try {
      return await query(`
        SELECT p.*
        FROM projects p
        JOIN directors d ON p.director_id = d.id
        WHERE d.username = ?
        ORDER BY p.created_at DESC
      `, [username]);
    } catch (error) {
      console.error('按导演获取项目错误:', error);
      throw error;
    }
  }
}

module.exports = Project;