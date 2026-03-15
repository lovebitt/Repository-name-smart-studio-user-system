#!/bin/bash

# DeepSeek API 集成服务启动脚本

echo "🚀 启动 DeepSeek API 集成服务"

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: Node.js 未安装"
    echo "请先安装 Node.js: https://nodejs.org/"
    exit 1
fi

# 检查npm
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: npm 未安装"
    exit 1
fi

# 检查.env文件
if [ ! -f .env ]; then
    echo "📝 创建 .env 配置文件"
    cp .env.example .env
    echo "⚠️  请编辑 .env 文件，设置你的 DeepSeek API 密钥"
    echo "   然后重新运行此脚本"
    exit 1
fi

# 检查DeepSeek API密钥
if grep -q "你的DeepSeek_API密钥_在这里替换" .env; then
    echo "❌ 错误: 请先在 .env 文件中设置你的 DeepSeek API 密钥"
    echo "   获取API密钥: https://platform.deepseek.com/api_keys"
    exit 1
fi

# 安装依赖
echo "📦 安装依赖..."
npm install express axios cors helmet morgan dotenv

# 启动服务
echo "🚀 启动 DeepSeek API 服务..."
node deepseek-integration.js

# 如果服务退出，显示提示
echo ""
echo "💡 服务已停止"
echo "📋 可用命令:"
echo "   ./start-deepseek-api.sh    # 启动服务"
echo "   curl http://localhost:3002 # 测试服务"
echo "   curl http://localhost:3002/api/deepseek/test # 测试API连接"