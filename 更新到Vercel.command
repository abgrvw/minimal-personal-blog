#!/bin/bash
cd "$(dirname "$0")" || exit 1

echo "正在部署到 Vercel（项目：minimal-personal-blog）…"
vercel deploy --prod --yes
echo ""
echo "完成。线上地址：https://abgrvw.vercel.app"
