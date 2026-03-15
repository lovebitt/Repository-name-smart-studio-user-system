# 🎬 智能工作室完全本地部署指南

## 📋 部署目标
**完全本地运行**：所有组件都在你的电脑上运行，无需连接云端

## 🚀 快速开始

### 1. 下载项目
```bash
# 方法A：Git克隆
git clone https://github.com/lovebitt/Repository-name-smart-studio-user-system.git
cd Repository-name-smart-studio-user-system

# 方法B：下载ZIP
# 访问 https://github.com/lovebitt/Repository-name-smart-studio-user-system
# 点击 "Code" → "Download ZIP"
# 解压到本地目录
```

### 2. 安装依赖
```bash
# 确保已安装 Node.js (版本 16+)
node --version

# 安装项目依赖
npm install
```

### 3. 初始化本地数据库
```bash
# 创建本地数据库
node src/config/migrate-simple.js
```

### 4. 启动本地服务器
```bash
# 启动API服务器
node src/app.js

# 服务器将在 http://localhost:3001 运行
```

### 5. 访问本地界面
1. **浏览器打开**：`http://localhost:3001/frontend.html`
2. **或者直接打开**：`frontend.html` 文件

## 🔧 本地化配置修改

### 修改前端连接配置
编辑 `frontend.html`，找到第254行：
```javascript
const API_BASE = 'http://localhost:3001/api';
```
确保这是 `localhost` 而不是任何远程IP。

### 创建启动脚本
创建 `start-local.bat` (Windows) 或 `start-local.sh` (Mac/Linux)：

**Windows (start-local.bat):**
```batch
@echo off
echo 🚀 启动智能工作室本地版...
cd /d "%~dp0"
call npm install
node src/config/migrate-simple.js
start http://localhost:3001/frontend.html
node src/app.js
```

**Mac/Linux (start-local.sh):**
```bash
#!/bin/bash
echo "🚀 启动智能工作室本地版..."
cd "$(dirname "$0")"
npm install
node src/config/migrate-simple.js
open http://localhost:3001/frontend.html  # Mac
# xdg-open http://localhost:3001/frontend.html  # Linux
node src/app.js
```

## 🤖 本地智能体配置

### 智能体运行模式
本地部署时，智能体以 **模拟模式** 运行：
- 不需要真实AI模型
- 使用预设的响应逻辑
- 完全在本地运行

### 修改智能体配置
编辑 `src/config/migrate-simple.js`，确保智能体配置为本地模式：

```javascript
// 智能体配置示例（已优化为本地运行）
const agents = [
  {
    name: '总编剧智能体',
    type: 'narrative',
    capabilities: JSON.stringify({
      description: '本地故事创作专家',
      skills: ['故事大纲', '角色设计', '场景描述'],
      local_mode: true  // 本地运行标志
    }),
    config: JSON.stringify({
      runtime: 'local_simulation',
      response_time: 'instant'
    })
  },
  // ... 其他智能体类似配置
];
```

## 📊 本地数据库

### SQLite数据库
- **文件位置**：`database.sqlite` (项目根目录)
- **无需安装**：SQLite是嵌入式数据库
- **自动创建**：运行迁移脚本时自动创建

### 数据库管理
```bash
# 查看数据库状态
sqlite3 database.sqlite ".tables"

# 重置数据库（如果需要）
rm -f database.sqlite
node src/config/migrate-simple.js
```

## 🎯 功能验证

### 本地测试脚本
创建 `test-local.js`：
```javascript
const http = require('http');

async function testLocal() {
  console.log('🔧 测试本地部署...');
  
  try {
    // 测试本地服务器
    const response = await fetch('http://localhost:3001/api/directors/me');
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ 本地服务器运行正常');
      console.log(`🎬 导演: ${data.data.display_name}`);
      
      // 测试创建本地项目
      const projectResponse = await fetch('http://localhost:3001/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: '本地测试项目',
          type: 'local_test'
        })
      });
      
      const projectData = await projectResponse.json();
      if (projectData.success) {
        console.log(`✅ 本地项目创建成功: ${projectData.data.id}`);
      }
    }
  } catch (error) {
    console.error('❌ 本地测试失败:', error.message);
    console.log('💡 请确保:');
    console.log('   1. 服务器已启动: node src/app.js');
    console.log('   2. 端口3001未被占用');
    console.log('   3. 数据库已初始化');
  }
}

testLocal();
```

## 🔄 工作流程

### 本地创作流程
1. **启动系统**：运行 `node src/app.js`
2. **访问界面**：打开 `frontend.html`
3. **创建项目**：点击"创建新项目"
4. **智能体协作**：本地智能体自动协作
5. **监控进度**：实时查看创作进度

### 智能体本地交互
- **无需网络**：所有智能体在本地进程内运行
- **快速响应**：模拟响应，无需等待AI计算
- **数据本地**：所有数据保存在本地SQLite

## 🛠️ 故障排除

### 常见问题
1. **端口被占用**
   ```bash
   # 修改端口（编辑 src/app.js）
   const PORT = process.env.PORT || 3002;
   ```

2. **依赖安装失败**
   ```bash
   # 清理重试
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **数据库错误**
   ```bash
   # 重新初始化
   rm -f database.sqlite
   node src/config/migrate-simple.js
   ```

4. **前端无法加载**
   - 确保服务器运行：`node src/app.js`
   - 检查URL：`http://localhost:3001/frontend.html`
   - 清除浏览器缓存

### 网络配置
如果需要在局域网内访问：
```javascript
// 修改 src/app.js 允许局域网访问
app.use(cors({
  origin: ['http://localhost:3001', 'http://192.168.1.x:3001'],
  credentials: true
}));
```

## 📱 多设备访问

### 局域网访问配置
1. **获取本地IP**
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```

2. **修改服务器配置**
   ```javascript
   // 在 src/app.js 中
   const HOST = '0.0.0.0';  // 监听所有接口
   app.listen(PORT, HOST, () => {
     console.log(`🚀 服务器运行在 http://${HOST}:${PORT}`);
   });
   ```

3. **其他设备访问**
   - 手机/平板：`http://[你的IP]:3001/frontend.html`
   - 其他电脑：`http://[你的IP]:3001/frontend.html`

## 🎉 成功标志

### 验证本地部署成功
1. ✅ 服务器启动：`node src/app.js` 无错误
2. ✅ 数据库创建：`database.sqlite` 文件存在
3. ✅ 前端访问：`http://localhost:3001/frontend.html` 正常加载
4. ✅ 创建项目：可以成功创建新项目
5. ✅ 智能体响应：智能体状态显示正常

### 性能指标
- **启动时间**：< 5秒
- **响应时间**：< 100ms
- **内存占用**：< 100MB
- **存储空间**：< 50MB

## 🔗 资源链接

### 项目文件
- **GitHub仓库**：https://github.com/lovebitt/Repository-name-smart-studio-user-system
- **本地文档**：`README.md`
- **配置指南**：本文件

### 技术依赖
- **Node.js**：https://nodejs.org/ (必须)
- **npm**：Node.js包管理器 (自动安装)
- **SQLite**：嵌入式数据库 (无需单独安装)

## 🚀 开始本地创作

### 一键启动命令
```bash
# 完整本地部署流程
git clone https://github.com/lovebitt/Repository-name-smart-studio-user-system.git
cd Repository-name-smart-studio-user-system
npm install
node src/config/migrate-simple.js
node src/app.js
# 然后访问 http://localhost:3001/frontend.html
```

### 首次使用
1. **系统自动识别**：导演身份 Nmyh NIUMA
2. **智能体就绪**：5个本地智能体自动激活
3. **开始创作**：点击"创建新项目"

---

**🎬 现在你的智能工作室完全在本地运行，无需任何云端连接！**

> *"好的创作工具应该像空气一样自然存在，无需担心连接问题。现在，智能工作室就在你的电脑里，随时待命。"* ✨