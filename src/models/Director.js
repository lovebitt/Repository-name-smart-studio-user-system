const { query, run } = require('../config/database');

class Director {
  // 获取导演信息（默认使用Nmyh_NIUMA）
  static async getDirector(username = 'Nmyh_NIUMA') {
    try {
      const directors = await query(
        'SELECT * FROM directors WHERE username = ?',
        [username]
      );
      return directors[0] || null;
    } catch (error) {
      console.error('获取导演信息错误:', error);
      throw error;
    }
  }

  // 设置导演身份（初始化）
  static async setupDirector(directorData) {
    try {
      const { username, display_name, email, preferences = {}, config = {} } = directorData;
      
      const result = await run(
        `INSERT OR REPLACE INTO directors 
         (username, display_name, email, preferences, config, updated_at) 
         VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        [username, display_name, email, JSON.stringify(preferences), JSON.stringify(config)]
      );
      
      return { id: result.id, ...directorData };
    } catch (error) {
      console.error('设置导演身份错误:', error);
      throw error;
    }
  }

  // 更新导演偏好设置
  static async updatePreferences(username, preferences) {
    try {
      const current = await this.getDirector(username);
      if (!current) {
        throw new Error('导演不存在');
      }

      const currentPrefs = JSON.parse(current.preferences || '{}');
      const updatedPrefs = { ...currentPrefs, ...preferences };

      await run(
        'UPDATE directors SET preferences = ?, updated_at = CURRENT_TIMESTAMP WHERE username = ?',
        [JSON.stringify(updatedPrefs), username]
      );

      return updatedPrefs;
    } catch (error) {
      console.error('更新偏好设置错误:', error);
      throw error;
    }
  }

  // 更新导演配置
  static async updateConfig(username, config) {
    try {
      const current = await this.getDirector(username);
      if (!current) {
        throw new Error('导演不存在');
      }

      const currentConfig = JSON.parse(current.config || '{}');
      const updatedConfig = { ...currentConfig, ...config };

      await run(
        'UPDATE directors SET config = ?, updated_at = CURRENT_TIMESTAMP WHERE username = ?',
        [JSON.stringify(updatedConfig), username]
      );

      return updatedConfig;
    } catch (error) {
      console.error('更新配置错误:', error);
      throw error;
    }
  }

  // 获取导演的工作统计
  static async getDirectorStats(username) {
    try {
      const stats = await query(`
        SELECT 
          COUNT(p.id) as total_projects,
          SUM(CASE WHEN p.status = 'completed' THEN 1 ELSE 0 END) as completed_projects,
          SUM(CASE WHEN p.status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_projects,
          AVG(p.progress) as average_progress
        FROM directors d
        LEFT JOIN projects p ON d.id = p.director_id
        WHERE d.username = ?
        GROUP BY d.id
      `, [username]);

      return stats[0] || {
        total_projects: 0,
        completed_projects: 0,
        in_progress_projects: 0,
        average_progress: 0
      };
    } catch (error) {
      console.error('获取导演统计错误:', error);
      throw error;
    }
  }
}

module.exports = Director;