# 🎬 智能工作室完全本地版

**无需云端连接，完全在本地运行的AI创作协作平台**

## 🌟 核心特性

### 🚀 **完全本地运行**
- **无需网络**：所有组件在本地运行
- **无需API密钥**：不需要任何外部服务
- **数据安全**：所有数据保存在本地SQLite数据库
- **隐私保护**：你的创作数据永不离开本地

### 🤖 **5个本地智能体**
- 🎭 **总编剧智能体**：本地故事创作专家
- 🎞️ **分镜智能体**：本地视觉叙事专家
- 🎨 **视觉风格智能体**：本地设计指导专家
- 🤖 **即梦AI专家智能体**：本地提示词优化专家
- 🎬 **主智能体**：本地项目协调专家

### 📱 **一键启动**
- **Windows**：双击 `start-local.bat`
- **Mac/Linux**：运行 `./start-local.sh`
- **自动配置**：依赖安装、数据库初始化、服务器启动

## 📥 快速开始

### 1. 下载项目
```bash
# 从GitHub下载
git clone https://github.com/lovebitt/Repository-name-smart-studio-user-system.git
cd Repository-name-smart-studio-user-system
```

### 2. 一键启动
**Windows用户**：双击 `start-local.bat`
**Mac/Linux用户**：终端运行 `./start-local.sh`

### 3. 开始创作
1. **访问**：`http://localhost:3001/frontend.html`
2. **创建项目**：点击"创建新项目"
3. **智能协作**：5个本地智能体自动协作
4. **监控进度**：实时查看创作进度

## 🖥️ 系统要求

### 最低配置
- **操作系统**：Windows 10 / macOS 10.15+ / Linux
- **内存**：4GB RAM
- **存储**：100MB 可用空间
- **Node.js**：版本 16+

### 推荐配置
- **操作系统**：Windows 11 / macOS 12+ / Ubuntu 20.04+
- **内存**：8GB RAM
- **存储**：500MB 可用空间
- **Node.js**：版本 18+

## 🔧 技术架构

### 本地运行栈
```
📁 智能工作室本地版
├── 🌐 Node.js + Express (本地API服务器)
├── 🗄️  SQLite (本地嵌入式数据库)
├── 🎨 HTML/CSS/JavaScript (本地前端界面)
├── 🤖 5个本地智能体 (模拟运行)
└── 🔄 本地工作流引擎
```

### 数据存储
- **数据库**：`database.sqlite` (本地文件)
- **项目数据**：完全本地存储
- **智能体配置**：本地JSON配置
- **用户偏好**：本地数据库保存

## 🎯 功能列表

### ✅ 已实现功能
1. **导演身份管理**：本地用户系统
2. **智能体团队**：5个本地智能体
3. **项目管理**：完整创作生命周期
4. **工作流引擎**：6阶段本地协作
5. **即梦AI集成**：本地提示词库
6. **现代化界面**：响应式设计

### 🔄 工作流程
```
1. 需求分析 → 2. 故事创作 → 3. 分镜设计
      ↓           ↓           ↓
4. 视觉风格 → 5. AI生成 → 6. 质量评估
```

## 🚀 使用指南

### 首次使用
1. **运行启动脚本**：自动完成所有配置
2. **访问本地界面**：浏览器打开指定URL
3. **系统自动识别**：导演身份 Nmyh NIUMA
4. **智能体就绪**：5个本地智能体自动激活

### 创建项目
1. **点击**："创建新项目"按钮
2. **填写**：项目名称、描述、类型
3. **确认**：系统自动启动工作流
4. **监控**：实时查看智能体协作进度

### 智能体协作
- **自动分配**：根据项目类型分配智能体
- **实时状态**：查看每个智能体工作状态
- **进度跟踪**：实时更新创作进度
- **完成通知**：项目完成时自动通知

## 🛠️ 故障排除

### 常见问题
1. **端口被占用**
   ```bash
   # 修改端口（编辑 src/app.js）
   const PORT = 3002;  # 改为其他端口
   ```

2. **Node.js未安装**
   - 下载：https://nodejs.org/
   - 安装后重启电脑

3. **依赖安装失败**
   ```bash
   # 清理重试
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **数据库错误**
   ```bash
   # 重新初始化
   rm -f database.sqlite
   node src/config/migrate-simple.js
   ```

### 网络配置
如果需要局域网访问：
```javascript
// 修改 src/app.js
const HOST = '0.0.0.0';  // 监听所有网络接口
```

## 📊 性能指标

### 本地性能
- **启动时间**：< 5秒
- **响应时间**：< 100ms
- **内存占用**：< 100MB
- **CPU使用**：< 5% (空闲时)

### 数据存储
- **数据库大小**：< 10MB (初始)
- **项目存储**：每个项目 < 1MB
- **备份建议**：定期备份 `database.sqlite`

## 🔒 安全与隐私

### 数据安全
- **完全本地**：数据永不离开你的电脑
- **无云端同步**：没有数据上传
- **本地加密**：敏感数据本地加密存储
- **自主控制**：你可以随时删除所有数据

### 隐私保护
- **无用户跟踪**：不收集任何使用数据
- **无分析工具**：没有Google Analytics等
- **无第三方服务**：所有功能本地实现
- **开源透明**：代码完全开源可审计

## 🔄 更新与维护

### 手动更新
```bash
# 从GitHub拉取更新
git pull origin main

# 更新依赖
npm install

# 重启服务
./start-local.sh
```

### 数据备份
```bash
# 备份数据库
cp database.sqlite database-backup-$(date +%Y%m%d).sqlite

# 恢复数据库
cp database-backup-20240315.sqlite database.sqlite
```

## 📱 多设备使用

### 局域网访问
1. **获取本机IP**
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```

2. **修改服务器配置**
   ```javascript
   // src/app.js
   const HOST = '0.0.0.0';
   ```

3. **其他设备访问**
   - 手机/平板：`http://[你的IP]:3001/frontend.html`
   - 其他电脑：`http://[你的IP]:3001/frontend.html`

## 🎉 开始创作

### 立即开始
```bash
# 一键启动（复制粘贴到终端）
git clone https://github.com/lovebitt/Repository-name-smart-studio-user-system.git && cd Repository-name-smart-studio-user-system && ./start-local.sh
```

### 创作示例
1. **奇幻短视频**：月光森林的精灵舞者
2. **科幻短片**：未来城市的AI觉醒
3. **情感微电影**：时光邮局的情书
4. **品牌宣传片**：智能产品展示

## 🤝 支持与反馈

### 问题报告
- **GitHub Issues**：https://github.com/lovebitt/Repository-name-smart-studio-user-system/issues
- **功能请求**：欢迎提交新功能建议
- **Bug报告**：详细描述问题和复现步骤

### 社区支持
- **文档更新**：定期更新使用指南
- **示例项目**：提供创作模板
- **视频教程**：计划制作使用教程

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🎬 愿景

**让每个创意想法都能在本地安全、高效地变成精彩作品**

> *"好的创作工具应该像空气一样自然存在，无需担心连接问题。现在，智能工作室就在你的电脑里，随时待命。"* ✨

---

**🚀 现在就开始你的本地智能创作之旅！**