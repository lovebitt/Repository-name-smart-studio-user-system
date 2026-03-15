# Windows 用户快速开始指南

## 🎬 **针对Windows用户的特别优化**

如果你在Windows上遇到启动问题，请使用这个指南。

## 📋 **Windows环境要求**

### 1. 系统要求
- **Windows 10** 或 **Windows 11**
- **管理员权限**（安装软件时需要）
- **至少 2GB** 可用内存
- **至少 500MB** 可用磁盘空间

### 2. 软件要求
- **Node.js** (版本 16.0.0 或更高)
- **现代浏览器** (Chrome 90+, Firefox 88+, Edge 90+)
- **文本编辑器** (推荐 Notepad++ 或 VS Code)

## 🚀 **一键启动方案**

### **方案A：使用简化启动脚本**（推荐）
1. 双击 `start-simple.bat`
2. 选择你要启动的版本（输入数字 1-5）
3. 按照提示操作

### **方案B：手动启动**
1. **完全独立版**：双击 `smart-studio-standalone.html`
2. **本地智能体版**：双击 `local-agents-system.html`
3. **一体化连接版**：双击 `frontend-all-in-one.html`
4. **代理连接版**：双击 `frontend-proxy.html`
5. **DeepSeek集成版**：需要额外步骤（见下文）

## 🔧 **DeepSeek集成版Windows专用指南**

### **步骤1：安装Node.js**
1. 访问 https://nodejs.org/
2. 下载 **LTS版本**（推荐）
3. 运行安装程序，使用默认设置
4. 安装完成后，重启电脑

### **步骤2：验证安装**
1. 打开 **命令提示符**（按 Win+R，输入 `cmd`，回车）
2. 输入以下命令检查安装：
```cmd
node --version
npm --version
```
3. 应该显示版本号（如 `v18.17.0`）

### **步骤3：配置DeepSeek API密钥**
1. 在项目文件夹中，找到 `.env.example` 文件
2. 复制一份，重命名为 `.env`
3. 用文本编辑器打开 `.env`
4. 将这一行：
```
DEEPSEEK_API_KEY=你的DeepSeek_API密钥_在这里替换
```
改为你的实际API密钥：
```
DEEPSEEK_API_KEY=sk-你的实际API密钥
```

### **步骤4：启动服务**
1. 双击 `start-simple.bat`
2. 选择 **5**（DeepSeek集成版）
3. 按照提示操作

## ⚠️ **常见Windows问题解决**

### **问题1：批处理文件无法运行**
**症状**：双击.bat文件后立即关闭
**解决**：
1. 右键点击批处理文件
2. 选择"以管理员身份运行"
3. 或者打开命令提示符，导航到文件夹，手动运行：
```cmd
cd "你的项目路径"
start-simple.bat
```

### **问题2：Node.js命令找不到**
**症状**：`node --version` 显示"不是内部或外部命令"
**解决**：
1. 重新安装Node.js
2. 安装时勾选"Add to PATH"选项
3. 重启电脑

### **问题3：端口被占用**
**症状**：`Error: listen EADDRINUSE: address already in use :::3002`
**解决**：
1. 关闭其他使用3002端口的程序
2. 或者修改端口号（编辑 `deepseek-integration.js` 第12行）

### **问题4：防火墙阻止**
**症状**：浏览器无法连接 `localhost:3002`
**解决**：
1. 打开Windows Defender防火墙
2. 允许Node.js通过防火墙
3. 或者暂时关闭防火墙测试

## 🎯 **Windows优化建议**

### **1. 使用PowerShell（更强大）**
```powershell
# 以管理员身份运行PowerShell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 导航到项目文件夹
cd "C:\你的路径\smart-studio-user-system"

# 启动服务
node deepseek-integration.js
```

### **2. 创建桌面快捷方式**
1. 右键点击 `smart-studio-standalone.html`
2. 选择"发送到" → "桌面快捷方式"
3. 重命名为"智能工作室独立版"

### **3. 使用Windows任务计划程序**
可以设置开机自动启动服务（高级用户）

## 📱 **Windows浏览器兼容性**

### **推荐浏览器**：
1. **Microsoft Edge**（Windows自带，最佳兼容性）
2. **Google Chrome**（性能最好）
3. **Mozilla Firefox**（隐私保护最好）

### **浏览器设置**：
1. **启用JavaScript**：默认已启用
2. **允许本地文件访问**：可能需要设置
3. **禁用弹出窗口阻止程序**：临时禁用或添加例外

## 🔄 **Windows更新和维护**

### **定期更新**：
1. **Node.js**：每年更新一次LTS版本
2. **浏览器**：保持最新版本
3. **Windows系统**：安装重要更新

### **备份重要数据**：
1. 定期备份 `.env` 文件（包含API密钥）
2. 备份项目文件夹
3. 使用Git进行版本控制

## 🎉 **Windows用户特别提示**

### **性能优化**：
1. **关闭不必要的后台程序**：释放内存
2. **使用SSD硬盘**：显著提升加载速度
3. **增加虚拟内存**：如果内存不足

### **快捷键**：
- **F5**：刷新浏览器
- **Ctrl+Shift+I**：打开开发者工具
- **Ctrl+S**：保存文件
- **Win+E**：打开文件资源管理器

### **实用工具**：
1. **Notepad++**：编辑配置文件
2. **Git Bash**：更好的命令行体验
3. **VS Code**：代码编辑和调试

## 📞 **Windows技术支持**

### **获取帮助**：
1. **查看日志**：服务运行时的控制台输出
2. **检查事件查看器**：Windows系统日志
3. **使用开发者工具**：浏览器F12控制台

### **联系支持**：
1. **GitHub Issues**：报告具体问题
2. **Windows社区**：系统级问题
3. **Node.js社区**：Node.js相关问题

---

**🎬 现在就开始！双击 `start-simple.bat` 选择你的版本。**

> *"在Windows上，智能工作室同样强大。从完全离线到真实AI，总有一个版本适合你。"* 🖥️🤖✨

## 📝 **Windows版本更新日志**

### **v1.0.1** (2026-03-15)
- ✅ 修复Windows批处理文件兼容性问题
- ✅ 添加简化启动脚本
- ✅ 创建Windows专用指南
- ✅ 优化错误提示和用户体验

### **计划更新**：
- 🔄 图形化安装程序
- 🔄 一键配置工具
- 🔄 系统托盘集成
- 🔄 自动更新功能