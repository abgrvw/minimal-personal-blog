#!/bin/bash
cd "$(dirname "$0")" || exit 1
PORT=8765

if lsof -i :"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "本地预览服务已在运行，直接打开编辑器。"
else
  python3 -m http.server "$PORT" --bind 127.0.0.1 >/tmp/blog-editor-server.log 2>&1 &
  SERVER_PID=$!
  trap 'kill $SERVER_PID 2>/dev/null' EXIT
  sleep 1
fi

open "http://127.0.0.1:$PORT/admin.html"
echo ""
echo "编辑器已在浏览器打开。"
echo "流程：连接项目文件夹 → 左边改内容 → 右边看预览 → 点「保存到项目」"
echo "回到访达双击「更新到Vercel.command」即可发布。"
echo "关闭这个终端窗口会停止本地预览服务。"
wait
