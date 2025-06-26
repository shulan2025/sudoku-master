#!/bin/bash

# 数独大师快速启动脚本
# Sudoku Master Quick Start Script

echo "🧩 数独大师 - Sudoku Master"
echo "=============================="
echo ""

# 检查Python是否安装
if command -v python3 &> /dev/null; then
    echo "✅ 找到 Python 3"
    SERVER_CMD="python3 -m http.server 8080"
elif command -v python &> /dev/null; then
    echo "✅ 找到 Python"
    SERVER_CMD="python -m SimpleHTTPServer 8080"
else
    echo "❌ 未找到 Python，请安装 Python 或使用其他方式启动服务器"
    exit 1
fi

# 检查端口是否被占用
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  端口 8080 已被占用，尝试清理..."
    kill -9 $(lsof -ti:8080) 2>/dev/null
    sleep 2
fi

echo "🚀 启动游戏服务器..."
echo "📍 服务地址: http://localhost:8080"
echo "📍 本地网络: http://$(hostname -I | awk '{print $1}'):8080 (局域网访问)"
echo ""
echo "💡 提示："
echo "   - 使用 Ctrl+C 停止服务器"
echo "   - 支持的快捷键："
echo "     数字键 1-9: 输入数字"
echo "     P: 切换铅笔模式"
echo "     H: 使用提示"
echo "     Space: 暂停游戏"
echo "     Ctrl+Z: 撤销"
echo ""
echo "🎮 准备就绪，开始数独之旅！"
echo "=============================="

# 自动打开浏览器（macOS）
if [[ "$OSTYPE" == "darwin"* ]]; then
    sleep 2
    open http://localhost:8080 &
fi

# 启动服务器
$SERVER_CMD 