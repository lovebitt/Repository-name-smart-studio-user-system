@echo off
chcp 65001 >nul
echo ==========================================
echo 🚀 智能工作室完全本地版启动
echo ==========================================

REM 检查Node.js
where node >nul 2>nul
if errorlevel 1 (
    echo ❌ 错误: Node.js未安装
    echo 请先安装 Node.js: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js版本:
node --version

REM 进入脚本所在目录
cd /d "%~dp0"

REM 安装依赖
echo 📦 安装依赖...
if not exist "node_modules" (
    call npm install
) else (
    echo ✅ 依赖已安装
)

REM 初始化本地数据库
echo 🗄️  初始化本地数据库...
if not exist "database.sqlite" (
    node src/config/migrate-simple.js
) else (
    echo ✅ 数据库已存在
)

REM 检查端口是否被占用
set PORT=3001
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%PORT%') do (
    echo ⚠️  端口 %PORT% 被占用，PID: %%a
    taskkill /PID %%a /F >nul 2>nul
    timeout /t 2 /nobreak >nul
)

REM 启动本地服务器
echo 🌐 启动本地服务器 (端口: %PORT%)...
start /B node src/app.js
timeout /t 3 /nobreak >nul

REM 检查服务器是否启动成功
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:%PORT%' -TimeoutSec 3; exit 0 } catch { exit 1 }"
if errorlevel 0 (
    echo ✅ 服务器启动成功!
    echo.
    echo ==========================================
    echo 🎉 智能工作室本地版已就绪!
    echo ==========================================
    echo.
    echo 📱 访问方式:
    echo 1. 🌐 浏览器打开: http://localhost:%PORT%/frontend.html
    echo 2. 💻 直接打开: frontend.html 文件
    echo.
    echo 🎬 功能特性:
    echo    ✅ 完全本地运行 - 无需网络连接
    echo    ✅ 5个本地智能体 - 即时响应
    echo    ✅ 本地数据库 - 数据安全
    echo    ✅ 现代化界面 - 美观易用
    echo.
    echo 🚀 开始创作:
    echo 1. 访问上述URL
    echo 2. 点击"创建新项目"
    echo 3. 开始智能创作之旅!
    echo.
    echo 🛑 停止服务: 关闭此窗口或按 Ctrl+C
    echo.
    pause
) else (
    echo ❌ 服务器启动失败
    echo 请检查:
    echo 1. 端口 %PORT% 是否被其他程序占用
    echo 2. 依赖是否安装完整
    echo 3. 查看错误日志
    pause
    exit /b 1
)