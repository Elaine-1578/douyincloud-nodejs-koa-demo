#!/bin/sh

# 输出当前目录，便于调试
echo "Current directory: $(pwd)"

# 检查 dist 目录是否存在
if [ -d "dist" ]; then
    echo "dist directory exists. Contents:"
    ls -la dist/
else
    echo "ERROR: dist directory not found!"
    exit 1
fi

# 检查 server.js 是否存在
if [ -f "dist/server.js" ]; then
    echo "server.js found, starting..."
    # 直接运行 node，不通过 npm
    node dist/server.js
else
    echo "ERROR: dist/server.js not found!"
    exit 1
fi
