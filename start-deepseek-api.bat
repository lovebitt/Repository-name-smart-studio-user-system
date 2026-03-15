@echo off
REM DeepSeek API 集成服务启动脚本 (Windows)

echo 🚀 启动 DeepSeek API 集成服务

REM 检查Node.js
where node >nul 2>nul
if errorlevel 1 (
    echo ❌ 错误: Node.js 未安装
    echo 请先安装 Node.js: https://nodejs.org/
    pause
    exit /b 1
)

REM 检查npm
where npm >nul 2>nul
if errorlevel 1 (
    echo ❌ 错误: npm 未安装
    pause
    exit /b 1
)

REM 检查.env文件
if not exist .env (
    echo 📝 创建 .env 配置文件
    copy .env.example .env
    echo ⚠️  请编辑 .env 文件，设置你的 DeepSeek API 密钥
    echo     然后重新运行此脚本
    pause
    exit /b 1
)

REM 检查DeepSeek API密钥
findstr /C:"你的DeepSeek_API密钥_在这里替换" .env >nul
if not errorlevel 1 (
    echo ❌ 错误: 请先在 .env 文件中设置你的 DeepSeek API 密钥
    echo     获取API密钥: https://platform.deepseek.com/api_keys
    pause
    exit /b 1
)

REM 安装依赖
echo 📦 安装依赖...
call npm install express axios cors helmet morgan dotenv

REM 启动服务
echo 🚀 启动 DeepSeek API 服务...
node deepseek-integration.js

REM 如果服务退出，显示提示
echo.
echo 💡 服务已停止
echo 📋 可用命令:
echo    start-deepseek-api.bat    # 启动服务
echo    curl http://localhost:3002 # 测试服务
echo    curl http://localhost:3002/api/deepseek/test # 测试API连接
pause