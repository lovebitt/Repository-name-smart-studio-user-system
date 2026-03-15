const Project = require('../models/Project');
const Director = require('../models/Director');

// 项目控制器
const projectController = {
  // 获取所有项目
  async getAllProjects(req, res) {
    try {
      const { director_username } = req.query;
      let projects;

      if (director_username) {
        // 通过导演用户名获取项目
        projects = await Project.getProjectsByDirectorUsername(director_username);
      } else {
        // 获取所有项目
        projects = await Project.getAllProjects();
      }

      // 解析JSON字段
      const formattedProjects = projects.map(project => ({
        ...project,
        metadata: JSON.parse(project.metadata || '{}')
      }));

      res.json({
        success: true,
        data: formattedProjects,
        count: formattedProjects.length,
        message: '项目列表获取成功'
      });
    } catch (error) {
      console.error('获取项目列表错误:', error);
      res.status(500).json({
        error: '获取项目列表失败',
        message: error.message
      });
    }
  },

  // 创建新项目
  async createProject(req, res) {
    try {
      const projectData = req.body;
      
      // 验证必要字段
      if (!projectData.name) {
        return res.status(400).json({
          error: '项目名称是必填字段'
        });
      }

      // 如果没有提供director_id，使用默认导演
      if (!projectData.director_id) {
        const defaultDirector = await Director.getDirector('Nmyh_NIUMA');
        if (!defaultDirector) {
          return res.status(400).json({
            error: '未找到默认导演，请先设置导演身份'
          });
        }
        projectData.director_id = defaultDirector.id;
      }

      const project = await Project.createProject(projectData);
      
      res.status(201).json({
        success: true,
        data: project,
        message: '项目创建成功'
      });
    } catch (error) {
      console.error('创建项目错误:', error);
      res.status(500).json({
        error: '创建项目失败',
        message: error.message
      });
    }
  },

  // 获取单个项目
  async getProjectById(req, res) {
    try {
      const { id } = req.params;
      const project = await Project.getProjectById(id);
      
      if (!project) {
        return res.status(404).json({
          error: '项目未找到',
          id
        });
      }

      const formattedProject = {
        ...project,
        metadata: JSON.parse(project.metadata || '{}')
      };

      res.json({
        success: true,
        data: formattedProject,
        message: '项目信息获取成功'
      });
    } catch (error) {
      console.error('获取项目错误:', error);
      res.status(500).json({
        error: '获取项目失败',
        message: error.message
      });
    }
  },

  // 更新项目信息
  async updateProject(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          error: '请提供要更新的字段'
        });
      }

      const updatedProject = await Project.updateProject(id, updateData);
      
      res.json({
        success: true,
        data: updatedProject,
        message: '项目信息更新成功'
      });
    } catch (error) {
      console.error('更新项目错误:', error);
      res.status(500).json({
        error: '更新项目失败',
        message: error.message
      });
    }
  },

  // 更新项目进度
  async updateProjectProgress(req, res) {
    try {
      const { id } = req.params;
      const { progress } = req.body;
      
      if (typeof progress !== 'number') {
        return res.status(400).json({
          error: '进度必须是数字',
          valid_range: '0-100'
        });
      }

      const updatedProject = await Project.updateProjectProgress(id, progress);
      
      res.json({
        success: true,
        data: updatedProject,
        message: '项目进度更新成功'
      });
    } catch (error) {
      console.error('更新项目进度错误:', error);
      res.status(error.message.includes('必须在') ? 400 : 500).json({
        error: '更新项目进度失败',
        message: error.message
      });
    }
  },

  // 删除项目
  async deleteProject(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Project.deleteProject(id);
      
      if (!deleted) {
        return res.status(404).json({
          error: '项目未找到或删除失败',
          id
        });
      }

      res.json({
        success: true,
        message: '项目删除成功',
        id
      });
    } catch (error) {
      console.error('删除项目错误:', error);
      res.status(500).json({
        error: '删除项目失败',
        message: error.message
      });
    }
  },

  // 为项目分配智能体
  async assignAgentsToProject(req, res) {
    try {
      const { id } = req.params;
      const { agents } = req.body;
      
      if (!Array.isArray(agents) || agents.length === 0) {
        return res.status(400).json({
          error: '请提供智能体数组',
          example: [{ agent_id: 1, role: '编剧' }, { agent_id: 2, role: '视觉设计' }]
        });
      }

      // 验证项目存在
      const project = await Project.getProjectById(id);
      if (!project) {
        return res.status(404).json({
          error: '项目未找到',
          id
        });
      }

      const results = await Project.assignAgentsToProject(id, agents);
      
      res.json({
        success: true,
        data: results,
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

  // 获取项目智能体列表
  async getProjectAgents(req, res) {
    try {
      const { id } = req.params;
      const agents = await Project.getProjectAgents(id);
      
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
        message: '项目智能体列表获取成功'
      });
    } catch (error) {
      console.error('获取项目智能体错误:', error);
      res.status(500).json({
        error: '获取项目智能体失败',
        message: error.message
      });
    }
  },

  // 获取项目统计
  async getProjectStats(req, res) {
    try {
      const { director_username } = req.query;
      let directorId = null;

      if (director_username) {
        const director = await Director.getDirector(director_username);
        if (director) {
          directorId = director.id;
        }
      }

      const stats = await Project.getProjectStats(directorId);
      
      res.json({
        success: true,
        data: stats,
        message: '项目统计获取成功'
      });
    } catch (error) {
      console.error('获取项目统计错误:', error);
      res.status(500).json({
        error: '获取项目统计失败',
        message: error.message
      });
    }
  }
};

module.exports = projectController;