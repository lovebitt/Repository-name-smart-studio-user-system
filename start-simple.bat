@echo off
chcp 65001 >nul
title 智能工作室启动脚本 (简化版)

echo ============================================
echo 🎬 智能工作室启动脚本
echo ============================================

echo 请选择要启动的版本:
echo.
echo 1. 🖥️ 完全独立版 (无需网络)
echo 2. 🤖 本地智能体版 (模拟AI协作)
echo 3. 🔄 一体化连接版 (智能连接检测)
echo 4. 🌐 代理连接版 (代理中转)
echo 5. 🚀 DeepSeek集成版 (真正的AI能力)
echo.
set /p choice="请输入数字选择 (1-5): "

if "%choice%"=="1" (
    echo 启动: 完全独立版
    start smart-studio-standalone.html
    goto :end
)

if "%choice%"=="2" (
    echo 启动: 本地智能体版
    start local-agents-system.html
    goto :end
)

if "%choice%"=="3" (
    echo 启动: 一体化连接版
    start frontend-all-in-one.html
    goto :end
)

if "%choice%"=="4" (
    echo 启动: 代理连接版
    start frontend-proxy.html
    goto :end
)

if "%choice%"=="5" (
    echo 启动: DeepSeek集成版
    call :start_deepseek
    goto :end
)

echo ❌ 无效选择，请输入 1-5
pause
exit /b 1

:start_deepseek
echo.
echo ============================================
echo 🚀 DeepSeek API 集成版启动
echo ============================================

REM 检查Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 错误: Node.js 未安装
    echo 请访问 https://nodejs.org/ 下载安装
    pause
    exit /b 1
)

REM 检查配置文件
if not exist .env (
    echo 📝 创建配置文件...
    copy .env.example .env
    echo.
    echo ⚠️  重要: 请编辑 .env 文件
    echo     将 "你的DeepSeek_API密钥_在这里替换" 替换为你的API密钥
    echo.
    echo 🔗 获取API密钥: https://platform.deepseek.com/api_keys
    echo 📝 文件位置: %cd%\.env
    echo.
    pause
    exit /b 1
)

REM 检查API密钥
findstr /C:"你的DeepSeek_API密钥_在这里替换" .env >nul
if %errorlevel% equ 0 (
    echo ❌ 错误: 请设置DeepSeek API密钥
    echo 编辑 .env 文件并设置你的API密钥
    pause
    exit /b 1
)

echo ✅ 配置检查通过
echo 📦 安装依赖...
call npm install express axios cors helmet morgan dotenv

echo 🚀 启动API服务器...
echo 按 Ctrl+C 停止服务器
echo.
start frontend-deepseek.html
node deepseek-integration.js

exit /b

:end
echo.
echo ✅ 启动完成！
echo 💡 提示: 如果浏览器没有自动打开，请手动双击对应的HTML文件
echo.
pause