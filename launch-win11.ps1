# Windows 11 专用启动脚本
# 保存为 launch-win11.ps1，右键"使用PowerShell运行"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "🎬 智能工作室 - Windows 11 专用启动器" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# 显示菜单
Write-Host "请选择要启动的版本:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. 🖥️  完全独立版" -ForegroundColor Green
Write-Host "   无需网络，无需安装，双击即用" -ForegroundColor Gray
Write-Host ""
Write-Host "2. 🤖  本地智能体版" -ForegroundColor Blue
Write-Host "   模拟AI协作，无需网络" -ForegroundColor Gray
Write-Host ""
Write-Host "3. 🔄  一体化连接版" -ForegroundColor Magenta
Write-Host "   智能连接检测，需要网络" -ForegroundColor Gray
Write-Host ""
Write-Host "4. 🌐  代理连接版" -ForegroundColor Yellow
Write-Host "   代理中转连接，需要网络" -ForegroundColor Gray
Write-Host ""
Write-Host "5. 🚀  DeepSeek集成版" -ForegroundColor Red
Write-Host "   真正的AI能力，需要Node.js和API密钥" -ForegroundColor Gray
Write-Host ""

# 获取用户选择
$choice = Read-Host "请输入数字选择 (1-5)"

# 处理选择
switch ($choice) {
    "1" {
        Write-Host "启动: 🖥️ 完全独立版..." -ForegroundColor Green
        if (Test-Path "smart-studio-standalone.html") {
            Start-Process "smart-studio-standalone.html"
            Write-Host "✅ 已启动完全独立版" -ForegroundColor Green
            Write-Host "💡 提示: 这个版本完全离线，无需任何连接" -ForegroundColor Cyan
        } else {
            Write-Host "❌ 错误: 找不到 smart-studio-standalone.html" -ForegroundColor Red
        }
    }
    "2" {
        Write-Host "启动: 🤖 本地智能体版..." -ForegroundColor Blue
        if (Test-Path "local-agents-system.html") {
            Start-Process "local-agents-system.html"
            Write-Host "✅ 已启动本地智能体版" -ForegroundColor Green
            Write-Host "💡 提示: 这个版本模拟5个AI智能体协作" -ForegroundColor Cyan
        } else {
            Write-Host "❌ 错误: 找不到 local-agents-system.html" -ForegroundColor Red
        }
    }
    "3" {
        Write-Host "启动: 🔄 一体化连接版..." -ForegroundColor Magenta
        if (Test-Path "frontend-all-in-one.html") {
            Start-Process "frontend-all-in-one.html"
            Write-Host "✅ 已启动一体化连接版" -ForegroundColor Green
            Write-Host "💡 提示: 这个版本会自动检测最佳连接方式" -ForegroundColor Cyan
        } else {
            Write-Host "❌ 错误: 找不到 frontend-all-in-one.html" -ForegroundColor Red
        }
    }
    "4" {
        Write-Host "启动: 🌐 代理连接版..." -ForegroundColor Yellow
        if (Test-Path "frontend-proxy.html") {
            Start-Process "frontend-proxy.html"
            Write-Host "✅ 已启动代理连接版" -ForegroundColor Green
            Write-Host "💡 提示: 这个版本通过代理服务器连接" -ForegroundColor Cyan
        } else {
            Write-Host "❌ 错误: 找不到 frontend-proxy.html" -ForegroundColor Red
        }
    }
    "5" {
        Write-Host "启动: 🚀 DeepSeek集成版..." -ForegroundColor Red
        Write-Host "⚠️  注意: 这个版本需要额外配置" -ForegroundColor Yellow
        
        # 检查Node.js
        $nodeCheck = Get-Command node -ErrorAction SilentlyContinue
        if (-not $nodeCheck) {
            Write-Host "❌ 错误: Node.js 未安装" -ForegroundColor Red
            Write-Host "🔗 请先安装 Node.js: https://nodejs.org/" -ForegroundColor Cyan
            Write-Host "📝 安装后重新运行此脚本" -ForegroundColor Cyan
            break
        }
        
        # 检查配置文件
        if (-not (Test-Path ".env")) {
            Write-Host "📝 创建配置文件..." -ForegroundColor Cyan
            if (Test-Path ".env.example") {
                Copy-Item ".env.example" ".env"
                Write-Host "✅ 已创建 .env 文件" -ForegroundColor Green
                Write-Host "⚠️  请编辑 .env 文件设置你的DeepSeek API密钥" -ForegroundColor Yellow
                Write-Host "🔗 获取API密钥: https://platform.deepseek.com/api_keys" -ForegroundColor Cyan
                Start-Process ".env"
                break
            } else {
                Write-Host "❌ 错误: 找不到 .env.example 文件" -ForegroundColor Red
                break
            }
        }
        
        # 检查API密钥
        $envContent = Get-Content ".env" -Raw
        if ($envContent -match "你的DeepSeek_API密钥_在这里替换") {
            Write-Host "❌ 错误: 请先在 .env 文件中设置你的DeepSeek API密钥" -ForegroundColor Red
            Write-Host "📝 编辑 .env 文件，替换示例密钥为你的实际密钥" -ForegroundColor Cyan
            Start-Process ".env"
            break
        }
        
        Write-Host "✅ 配置检查通过" -ForegroundColor Green
        
        # 安装依赖
        Write-Host "📦 检查依赖..." -ForegroundColor Cyan
        if (-not (Test-Path "node_modules")) {
            Write-Host "安装依赖包..." -ForegroundColor Cyan
            npm install express axios cors helmet morgan dotenv
        }
        
        # 启动服务
        Write-Host "🚀 启动DeepSeek API服务..." -ForegroundColor Green
        Write-Host "💡 提示: 服务运行在 http://localhost:3002" -ForegroundColor Cyan
        Write-Host "📋 按 Ctrl+C 停止服务" -ForegroundColor Yellow
        
        # 启动前端
        Start-Process "frontend-deepseek.html"
        
        # 启动API服务
        node deepseek-integration.js
    }
    default {
        Write-Host "❌ 无效选择，请输入 1-5" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "🎬 启动完成！" -ForegroundColor Cyan
Write-Host "💡 如有问题，请查看 WINDOWS-README.md" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Cyan

# 保持窗口打开
Read-Host "按回车键退出..."