#!/bin/bash
# GitHub推送脚本
# 使用方法：根据你的认证方式选择相应部分执行

echo "🚀 智能工作室用户管理系统 - GitHub推送脚本"
echo "=========================================="

# 检查Git配置
echo "📋 检查Git配置..."
git config --list | grep -E "user\.name|user\.email"

# 检查远程仓库
echo "🔗 检查远程仓库..."
git remote -v

# 方法1：使用GitHub Token（推荐）
echo ""
echo "🔑 方法1：使用GitHub个人访问令牌"
echo "--------------------------------"
echo "1. 访问 https://github.com/settings/tokens"
echo "2. 生成新token，选择'repo'权限"
echo "3. 复制token"
echo "4. 执行以下命令："
echo ""
echo "   git remote remove origin"
echo "   git remote add origin https://[你的TOKEN]@github.com/lovebitt/Repository-name-smart-studio-user-system.git"
echo "   git push -u origin main"
echo ""

# 方法2：使用SSH密钥
echo "🔐 方法2：使用SSH密钥"
echo "---------------------"
echo "1. 检查SSH密钥："
echo "   ls -la ~/.ssh/"
echo ""
echo "2. 如果没有密钥，生成："
echo "   ssh-keygen -t ed25519 -C \"你的邮箱\""
echo ""
echo "3. 添加公钥到GitHub："
echo "   cat ~/.ssh/id_ed25519.pub"
echo "   复制到 https://github.com/settings/keys"
echo ""
echo "4. 测试连接："
echo "   ssh -T git@github.com"
echo ""
echo "5. 推送："
echo "   git remote remove origin"
echo "   git remote add origin git@github.com:lovebitt/Repository-name-smart-studio-user-system.git"
echo "   git push -u origin main"
echo ""

# 方法3：使用GitHub CLI
echo "🛠️  方法3：使用GitHub CLI"
echo "----------------------"
echo "1. 安装GitHub CLI："
echo "   # Ubuntu/Debian"
echo "   sudo apt install gh"
echo "   # macOS"
echo "   brew install gh"
echo ""
echo "2. 登录："
echo "   gh auth login"
echo ""
echo "3. 推送："
echo "   git push -u origin main"
echo ""

# 显示当前状态
echo "📊 当前项目状态："
echo "----------------"
echo "分支：$(git branch --show-current)"
echo "提交数量：$(git rev-list --count HEAD)"
echo "最后提交：$(git log -1 --format=%cd --date=relative)"
echo "文件数量：$(find . -type f -not -path './.git/*' | wc -l)"
echo ""

echo "🎯 推送准备完成！选择适合你的方法执行。"
echo "💡 推荐使用GitHub Token方法（最简单）"