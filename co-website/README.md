# 程信霖公司网站

云南程信霖信息咨询有限公司官方企业网站。

## 技术栈

- **框架**: Next.js 16 (Turbopack) + React 19
- **语言**: TypeScript
- **样式**: Tailwind CSS v4
- **数据库**: SQLite (better-sqlite3)
- **认证**: bcryptjs

## 项目结构

```
src/
├── app/                    # Next.js App Router 页面
│   ├── page.tsx            # 首页
│   ├── layout.tsx          # 根布局
│   ├── globals.css         # 全局样式
│   ├── about/              # 关于我们
│   ├── contact/            # 联系我们
│   ├── partners/           # 合作伙伴
│   ├── products/           # AI产品矩阵
│   │   ├── qiaoxi/         # 乔曦 · AI合同审查
│   │   ├── qiaoyuan/       # 峤远 · AI财报分析
│   │   └── chengxiaorong/  # 程晓融 · AI融资体检
│   ├── services/           # 专业服务
│   │   ├── financing/      # 融资撮合
│   │   ├── consulting/     # 企业咨询
│   │   └── landing/        # 企业落地
│   ├── insights/           # 行业洞察（文章系统）
│   ├── admin/              # 管理员后台
│   └── api/               # API路由
├── components/
│   ├── ui/                # 通用UI组件
│   ├── layout/            # 布局组件
│   └── features/          # 功能组件
├── content/
│   └── articles/          # Markdown文章
└── lib/                   # 工具库
```

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 生产构建
npm run build

# 启动生产服务
npm start
```

## 后端服务依赖

网站依赖三个后端AI服务（仅开发环境需要）：

| 产品 | 端口 | 技术 |
|------|------|------|
| 程晓融 | 8080 | FastAPI |
| 乔曦 | 8501 | Streamlit |
| 峤远 | 8502 | Streamlit |

启动命令见 [src/components/features/StreamlitEmbed.tsx](src/components/features/StreamlitEmbed.tsx)。

## 环境变量

复制 `.env.local` 配置后端服务URL：

```
NEXT_PUBLIC_CXR_URL=http://localhost:8080
NEXT_PUBLIC_QIAOXI_URL=http://localhost:8501
NEXT_PUBLIC_QIAOYUAN_URL=http://localhost:8502
```

## 管理员账号

- 账号: `admin`
- 密码: `chengxinlin2026`

> ⚠️ 生产环境请修改默认密码。

---

© 2026 云南程信霖信息咨询有限公司
