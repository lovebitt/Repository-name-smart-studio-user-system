const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// 导入路由
const directorRoutes = require('./routes/directorRoutes');
const agentRoutes = require('./routes/agentRoutes');
const projectRoutes = require('./routes/projectRoutes');
const workflowRoutes = require('./routes/workflowRoutes');
const dreamaiRoutes = require('./routes/dreamaiRoutes');

// 创建Express应用
const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(helmet()); // 安全头
app.use(cors()); // 跨域支持
app.use(morgan('dev')); // 请求日志
app.use(express.json()); // JSON解析
app.use(express.urlencoded({ extended: true })); // URL编码解析

// 基础路由
app.get('/', (req, res) => {
  res.json({
    message: '智能工作室用户管理系统 API',
    version: '1.0.0',
    description: '导演身份和智能体团队管理系统',
    endpoints: {
      directors: '/api/directors',
      agents: '/api/agents',
      projects: '/api/projects',
      workflows: '/api/workflows',
      dreamai: '/api/dreamai'
    }
  });
});

// API路由
app.use('/api/directors', directorRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/workflows', workflowRoutes);
app.use('/api/dreamai', dreamaiRoutes);

// 404处理
app.use((req, res) => {
  res.status(404).json({
    error: '路由未找到',
    path: req.path,
    method: req.method
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err.stack);
  res.status(err.status || 500).json({
    error: err.message || '内部服务器错误',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 启动服务器
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
    console.log(`📊 数据库: SQLite (智能工作室用户系统)`);
    console.log(`🎬 导演: Nmyh NIUMA`);
    console.log(`🤖 智能体: 5个专业AI助手已就绪`);
  });
}

module.exports = app;