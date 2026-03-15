#!/bin/bash
# 🎬 智能工作室完全本地启动脚本
# 无需云端连接，所有组件本地运行

echo "=========================================="
echo "🚀 智能工作室完全本地版启动"
echo "=========================================="

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: Node.js未安装"
    echo "请先安装 Node.js: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js版本: $(node --version)"

# 进入脚本所在目录
cd "$(dirname "$0")"

# 安装依赖
echo "📦 安装依赖..."
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "✅ 依赖已安装"
fi

# 初始化本地数据库
echo "🗄️  初始化本地数据库..."
if [ ! -f "database.sqlite" ]; then
    node src/config/migrate-simple.js
else
    echo "✅ 数据库已存在"
fi

# 检查端口是否被占用
PORT=3001
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  端口 $PORT 被占用，尝试停止现有进程..."
    lsof -ti:$PORT | xargs kill -9 2>/dev/null
    sleep 2
fi

# 启动本地服务器
echo "🌐 启动本地服务器 (端口: $PORT)..."
node src/app.js &
SERVER_PID=$!

# 等待服务器启动
sleep 3

# 检查服务器是否启动成功
if curl -s http://localhost:$PORT > /dev/null; then
    echo "✅ 服务器启动成功!"
    echo ""
    echo "=========================================="
    echo "🎉 智能工作室本地版已就绪!"
    echo "=========================================="
    echo ""
    echo "📱 访问方式:"
    echo "1. 🌐 浏览器打开: http://localhost:$PORT/frontend.html"
    echo "2. 💻 直接打开: frontend.html 文件"
    echo ""
    echo "🎬 功能特性:"
    echo "   ✅ 完全本地运行 - 无需网络连接"
    echo "   ✅ 5个本地智能体 - 即时响应"
    echo "   ✅ 本地数据库 - 数据安全"
    echo "   ✅ 现代化界面 - 美观易用"
    echo ""
    echo "🚀 开始创作:"
    echo "1. 访问上述URL"
    echo "2. 点击'创建新项目'"
    echo "3. 开始智能创作之旅!"
    echo ""
    echo "🛑 停止服务: 按 Ctrl+C"
    
    # 保持脚本运行
    wait $SERVER_PID
else
    echo "❌ 服务器启动失败"
    echo "请检查:"
    echo "1. 端口 $PORT 是否被其他程序占用"
    echo "2. 依赖是否安装完整"
    echo "3. 查看错误日志"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi