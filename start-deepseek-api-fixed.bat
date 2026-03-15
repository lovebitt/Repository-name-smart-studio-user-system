@echo off
chcp 65001 >nul
title DeepSeek API 集成服务启动脚本 (Windows)

echo ============================================
echo 🚀 启动 DeepSeek API 集成服务
echo ============================================

REM 检查Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 错误: Node.js 未安装
    echo 请先安装 Node.js: https://nodejs.org/
    echo 推荐安装 LTS 版本
    pause
    exit /b 1
)

REM 检查npm
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 错误: npm 未安装
    echo 通常Node.js安装包会包含npm
    echo 请重新安装Node.js
    pause
    exit /b 1
)

echo ✅ Node.js 版本:
node --version
echo ✅ npm 版本:
npm --version

REM 检查.env文件
if not exist .env (
    echo 📝 创建 .env 配置文件
    copy .env.example .env
    echo.
    echo ⚠️  重要: 请编辑 .env 文件，设置你的 DeepSeek API 密钥
    echo     1. 打开 .env 文件
    echo     2. 将 "你的DeepSeek_API密钥_在这里替换" 替换为你的实际API密钥
    echo     3. 保存文件
    echo     4. 重新运行此脚本
    echo.
    echo 🔗 获取API密钥: https://platform.deepseek.com/api_keys
    echo.
    pause
    exit /b 1
)

REM 检查DeepSeek API密钥
findstr /C:"你的DeepSeek_API密钥_在这里替换" .env >nul
if %errorlevel% equ 0 (
    echo ❌ 错误: 请先在 .env 文件中设置你的 DeepSeek API 密钥
    echo.
    echo 当前 .env 文件内容:
    type .env
    echo.
    echo 🔗 获取API密钥: https://platform.deepseek.com/api_keys
    echo 📝 编辑 .env 文件后重新运行此脚本
    pause
    exit /b 1
)

echo ✅ .env 配置文件检查通过
echo ✅ DeepSeek API 密钥已设置

REM 安装依赖
echo.
echo 📦 检查并安装依赖...
if not exist node_modules (
    echo 首次运行，安装依赖包...
    call npm install express axios cors helmet morgan dotenv
) else (
    echo 依赖包已存在，跳过安装
)

REM 显示配置信息
echo.
echo 📋 配置信息:
echo    API 服务器端口: 3002
echo    API 基础URL: http://localhost:3002
echo    AI 模型: deepseek-chat
echo    DeepSeek API: https://api.deepseek.com
echo.

REM 启动服务
echo 🚀 启动 DeepSeek API 服务...
echo ============================================
echo 服务运行中... 按 Ctrl+C 停止
echo 测试连接: curl http://localhost:3002
echo 测试API: curl http://localhost:3002/api/deepseek/test
echo ============================================
echo.

node deepseek-integration.js

REM 如果服务退出，显示提示
echo.
echo ============================================
echo 💡 服务已停止
echo 📋 可用命令:
echo    curl http://localhost:3002              # 测试服务状态
echo    curl http://localhost:3002/api/deepseek/test  # 测试API连接
echo    curl http://localhost:3002/api/deepseek/agents # 查看智能体列表
echo.
echo 🎬 打开 frontend-deepseek.html 使用前端界面
echo ============================================
pause