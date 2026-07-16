# Co.Website 安全评估报告

**评估日期**: 2026-07-15  
**评估范围**: `D:\Ai RAG\Co.Website\co-website` 全部源代码、配置、依赖  
**技术栈**: Next.js 16.2.9 + React 19 + better-sqlite3 + bcryptjs  

---

## 风险概览

| 严重程度 | 数量 | 说明 |
|---------|------|------|
| 🔴 Critical | 8 | 可直接导致系统被完全接管 |
| 🟠 High | 7 | 可导致数据泄露或权限绕过 |
| 🟡 Medium | 6 | 需配合其他漏洞利用 |

**整体安全评分: 15/100 (极高风险)**

系统存在可被一键接管的安全漏洞——任何人只需发送一个 HTTP 请求即可获得管理员权限，无需任何密码。

---

## 🔴 Critical 级别漏洞

### C-1: 客户端认证伪造 — 全站鉴权形同虚设

**位置**: 所有 API 路由（约 20+ 个文件）  
**类型**: CWE-306 [Missing Authentication for Critical Function]  
**置信度**: 高 — 代码路径确认可达，无任何防御

**问题**:  
所有需要认证的 API 路由通过读取 HTTP 请求头 `x-user-account` 来"验证"用户身份。这个 header 完全由客户端控制，任何人都可以伪造：

```typescript
// 几乎所有 admin API 都是这样的模式：
const account = request.headers.get('x-user-account')  // 客户端可随意伪造
const user = findUserByAccount(account)
if (!user || user.role !== 'admin') { ... }
```

**攻击方式**:  
```bash
# 一行命令获取所有用户数据（包括密码哈希、手机号、邮箱）
curl -H "x-user-account: lichaoyi" http://your-site/api/admin/users
```

**影响**: 攻击者可冒充任意管理员执行所有操作：查看/修改/删除用户、生成授权码、审批申请、绑定/解绑授权码、查看收入统计。

**修复方案**:  
实现基于 HTTP-only Cookie 的服务端会话管理：

```typescript
// src/lib/session.ts — 新建会话管理模块
import { SignJWT, jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || crypto.randomUUID())

export interface SessionPayload {
  userId: number
  account: string
  role: string
}

// 登录时签发 JWT，写入 HTTP-only Cookie
export async function createSession(user: { id: number; account: string; role: string }) {
  const token = await new SignJWT({ userId: user.id, account: user.account, role: user.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .setIssuedAt()
    .sign(SECRET)
  return token
}

// 中间件验证 — 所有 /api/admin 和 /api/authcode 路由
export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}

// 在 API 路由中使用：
import { verifySession } from '@/lib/session'

export async function GET(request: NextRequest) {
  const token = request.cookies.get('session')?.value
  const session = token ? await verifySession(token) : null
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: '无权限' }, { status: 403 })
  }
  // ... 正常逻辑
}
```

```bash
# 安装依赖
npm install jose
```

---

### C-2: 硬编码管理员弱密码 (123456)

**位置**: `src/lib/db.ts:9-12`  
**类型**: CWE-798 [Use of Hard-coded Credentials] + CWE-521 [Weak Password Requirements]  
**置信度**: 高

**问题**:  
```typescript
const HARDCODED_ADMINS = [
  { account: 'lichaoyi', nickname: '李超逸', password: '123456' },
  { account: 'yulei', nickname: '余磊', password: '123456' },
]
```

管理员账号和密码以明文硬编码在源码中。密码 `123456` 是最常见的弱密码之一，在各类密码泄露数据库中排名第一。

**影响**: 即使修复了 C-1，攻击者只需猜测 `lichaoyi / 123456` 即可登录管理员账户。

**修复方案**:  
```typescript
// 1. 从环境变量读取初始管理员密码（仅首次启动用）
const HARDCODED_ADMINS = [
  { 
    account: process.env.ADMIN1_ACCOUNT || 'lichaoyi', 
    nickname: '李超逸', 
    password: process.env.ADMIN1_PASSWORD || '' // 必须通过环境变量设置
  },
  { 
    account: process.env.ADMIN2_ACCOUNT || 'yulei', 
    nickname: '余磊', 
    password: process.env.ADMIN2_PASSWORD || ''
  },
]

// 2. 启动时检查：如果环境变量未设置，拒绝启动
if (!HARDCODED_ADMINS[0].password || !HARDCODED_ADMINS[1].password) {
  throw new Error('ADMIN1_PASSWORD 和 ADMIN2_PASSWORD 环境变量必须设置')
}

// 3. 首次创建后清除明文密码标记，后续从数据库读取
// 4. 强制密码复杂度：至少 12 位，包含大小写字母+数字+特殊字符
function validatePassword(password: string): boolean {
  return password.length >= 12 
    && /[A-Z]/.test(password) 
    && /[a-z]/.test(password) 
    && /[0-9]/.test(password) 
    && /[^A-Za-z0-9]/.test(password)
}
```

---

### C-3: 硬编码管理员无限授权码

**位置**: `src/lib/db.ts:15-18`  
**类型**: CWE-798 [Use of Hard-coded Credentials]  
**置信度**: 高

**问题**:  
```typescript
export const ADMIN_AUTH_CODES: Record<string, string> = {
  lichaoyi: 'LICHAOYI-ADMIN-UNLIMITED',
  yulei: 'YULEI-ADMIN-UNLIMITED',
}
```

无限授权码硬编码在源码中，任何能阅读源码的人都能获得。

**修复方案**:  
授权码应在首次启动时由 `crypto.randomBytes()` 生成随机字符串，写入数据库，仅显示一次后不再可读。

```typescript
import crypto from 'crypto'

function generateSecureCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const bytes = crypto.randomBytes(12)
  let result = 'CXL-'
  for (let i = 0; i < 8; i++) {
    if (i === 4) result += '-'
    result += chars[bytes[i] % chars.length]
  }
  return result
}
```

---

### C-4: 支付验证完全绕过

**位置**: `src/lib/payment.ts:37-39,56-58` + `src/lib/config.ts:20`  
**类型**: CWE-840 [Business Logic Errors]  
**置信度**: 高

**问题**:  
```typescript
// payment.ts — 两个支付提供商的验证方法都直接返回 true
class AggregatorStubProvider implements PaymentProvider {
  verifyPayment(): boolean {
    return true  // ← 任何人都可以"支付成功"
  }
}

// config.ts — 默认开启模拟支付
PAYMENT_SIMULATE: (process.env.PAYMENT_SIMULATE ?? 'true') !== 'false',
```

在 `authcode/payment/confirm/route.ts:51`：
```typescript
const ok = AUTH_CODE_CONFIG.PAYMENT_SIMULATE ? true : provider.verifyPayment(providerOrderId || '')
```

无论 `PAYMENT_SIMULATE` 是 true 还是 false，`verifyPayment` 始终返回 `true`。

**影响**: 攻击者可以创建订单 → 不支付 → 调用确认接口 → 自动获得付费授权码，完全绕过支付。

**修复方案**:  
```typescript
// 1. 生产环境必须接入真实支付回调验证
// 2. 移除 verifyPayment 直接返回 true 的桩
// 3. 通过服务器端回调验证（Webhook 签名验证）

class AggregatorProvider implements PaymentProvider {
  async verifyPayment(providerOrderId: string): Promise<boolean> {
    // 调用支付平台 API 查询订单状态
    const res = await fetch(`${PAYMENT_API_BASE}/orders/${providerOrderId}`, {
      headers: { 'Authorization': `Bearer ${process.env.PAYMENT_API_KEY}` }
    })
    const data = await res.json()
    return data.status === 'paid' && data.amount === data.expected_amount
  }
}

// 4. 在 confirm 路由中增加防重放检查
if (order.status === 'paid') {
  return NextResponse.json({ error: '该订单已支付' }, { status: 400 })
}
```

---

### C-5: 数据库文件已提交到 Git

**位置**: `co-website/data/users.db`  
**类型**: CWE-532 [Insertion of Sensitive Information into Log File] / CWE-200 [Exposure of Sensitive Information]  
**置信度**: 高 — git log 确认

**问题**:  
`.gitignore` 仅忽略了 `*.db-shm` 和 `*.db-wal`，但 **没有忽略 `*.db`**。`data/users.db` 文件已被提交到 git 历史中，包含所有用户的密码哈希、手机号、邮箱等敏感信息。

**影响**: 任何能访问 git 仓库的人都能获取完整用户数据库。

**修复方案**:  
```bash
# 1. 立即将 *.db 加入 .gitignore
echo "data/*.db" >> co-website/.gitignore

# 2. 从 git 历史中彻底清除（不可逆操作，需团队确认）
# 使用 git-filter-repo 或 BFG Repo-Cleaner
git filter-repo --path co-website/data/users.db --invert-paths

# 3. 强制推送（通知所有协作者）
git push --force

# 4. 通知所有用户修改密码（因为哈希已泄露）
# 5. 轮换 WeChat AppSecret（如果也泄露了的话）
```

---

### C-6: 文件上传无认证

**位置**: `src/app/api/upload/image/route.ts` + `src/app/api/upload/video/route.ts`  
**类型**: CWE-434 [Unrestricted Upload of File with Dangerous Type] + CWE-306  
**置信度**: 高

**问题**:  
上传接口没有任何身份验证。任何人都可以上传文件到服务器。

**影响**: 
- 攻击者可上传恶意文件占用磁盘空间（DoS）
- 如果服务器配置不当，上传的文件可能被执行（RCE）
- 上传非法内容导致法律风险

**修复方案**:  
```typescript
// 在上传路由开头增加认证检查
import { verifySession } from '@/lib/session'

export async function POST(request: NextRequest) {
  const token = request.cookies.get('session')?.value
  const session = token ? await verifySession(token) : null
  if (!session) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 })
  }
  // ... 继续上传逻辑
}
```

---

### C-7: 内容管理无认证

**位置**: `src/app/api/articles/route.ts` (POST/PUT/DELETE) + `src/app/api/videos/route.ts` (POST/DELETE)  
**类型**: CWE-862 [Missing Authorization]  
**置信度**: 高

**问题**:  
文章和视频的增删改接口没有任何认证或授权检查。任何人都可以创建、修改、删除文章和视频。

**影响**: 攻击者可以篡改网站内容，植入钓鱼链接或恶意脚本。

**修复方案**:  
在所有写操作路由开头增加管理员认证：
```typescript
const token = request.cookies.get('session')?.value
const session = token ? await verifySession(token) : null
if (!session || session.role !== 'admin') {
  return NextResponse.json({ error: '无权限' }, { status: 403 })
}
```

---

### C-8: 授权码 API 无身份验证

**位置**: `src/app/api/authcode/use/route.ts` + `src/app/api/authcode/bind/route.ts` + `src/app/api/authcode/status/route.ts` + `src/app/api/authcode/verify/route.ts`  
**类型**: CWE-862 [Missing Authorization] + CWE-639 [IDOR]  
**置信度**: 高

**问题**:  
- `use` 接口接受 `userId` 参数，但不验证调用者身份——任何人都可以消耗任何人的授权码次数
- `bind` 接口接受 `userId` 和 `account` 参数——任何人可以将授权码绑定到任意用户
- `verify` 接口完全开放——可暴力枚举授权码
- `status` 接口接受 `userId` 和 `code` 参数——可查询任意用户的授权状态

**影响**: 攻击者可以耗尽其他用户的授权码次数、绑定未授权的码、枚举有效授权码。

**修复方案**:  
所有接口都必须从服务端会话获取 `userId`，不接受客户端传入：
```typescript
// 错误：从请求体获取 userId
const { code, userId } = await request.json()

// 正确：从会话获取 userId
const session = await verifySession(request.cookies.get('session')?.value || '')
if (!session) return NextResponse.json({ error: '请先登录' }, { status: 401 })
const userId = session.userId  // 从服务端会话获取，不可伪造
```

---

## 🟠 High 级别漏洞

### H-1: 文件上传扩展名校验不足

**位置**: `src/app/api/upload/image/route.ts:34` + `src/app/api/upload/video/route.ts:34`  
**类型**: CWE-434  
**置信度**: 中

**问题**:  
```typescript
const ext = file.name.split('.').pop() || 'png'
```
扩展名从原始文件名提取，但未验证是否在允许列表内。MIME 类型检查（`file.type`）可被伪造。攻击者可上传 `.html`、`.svg`（含 XSS）、`.js` 文件。

**修复方案**:  
```typescript
// 扩展名白名单校验
const ALLOWED_EXTS = {
  image: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  video: ['mp4', 'webm', 'ogg', 'mov'],
}
const ext = (file.name.split('.').pop() || '').toLowerCase()
if (!ALLOWED_EXTS.image.includes(ext)) {
  return NextResponse.json({ error: '不允许的文件类型' }, { status: 400 })
}

// 额外：验证文件魔数（Magic Bytes），不仅依赖 MIME 和扩展名
const buffer = Buffer.from(await file.arrayBuffer())
const MAGIC = {
  jpeg: [0xFF, 0xD8, 0xFF],
  png: [0x89, 0x50, 0x4E, 0x47],
  gif: [0x47, 0x49, 0x46],
  webp: [0x52, 0x49, 0x46, 0x46], // RIFF
}
function detectFileType(buf: Buffer): string | null {
  for (const [type, magic] of Object.entries(MAGIC)) {
    if (magic.every((byte, i) => buf[i] === byte)) return type
  }
  return null
}
const detected = detectFileType(buffer)
if (!detected || !ALLOWED_EXTS.image.includes(detected)) {
  return NextResponse.json({ error: '文件内容与类型不匹配' }, { status: 400 })
}
```

---

### H-2: 无速率限制 — 暴力破解风险

**位置**: `src/app/api/auth/login/route.ts` + `src/app/api/auth/register/route.ts` + `src/app/api/auth/change-password/route.ts`  
**类型**: CWE-307 [Improper Restriction of Excessive Authentication Attempts]  
**置信度**: 高

**问题**:  
登录、注册、修改密码接口没有任何速率限制。攻击者可以无限次尝试登录，进行暴力破解或凭证填充攻击。

**修复方案**:  
```typescript
// 简易内存速率限制器（生产环境建议用 Redis）
const loginAttempts = new Map<string, { count: number; resetAt: number }>()

function rateLimit(key: string, maxAttempts: number, windowMs: number): boolean {
  const now = Date.now()
  const record = loginAttempts.get(key)
  if (!record || now > record.resetAt) {
    loginAttempts.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (record.count >= maxAttempts) return false
  record.count++
  return true
}

// 在 login 路由中使用
const ip = request.headers.get('x-forwarded-for') || 'unknown'
if (!rateLimit(`login:${ip}`, 5, 15 * 60 * 1000)) { // 15分钟内最多5次
  return NextResponse.json(
    { error: '尝试次数过多，请15分钟后再试' }, 
    { status: 429 }
  )
}
```

---

### H-3: 用户枚举

**位置**: `src/app/api/auth/login/route.ts:16-17,21-22`  
**类型**: CWE-204 [Observable Response Discrepancy]  
**置信度**: 高

**问题**:  
```typescript
if (!passwordHash) {
  return NextResponse.json({ error: '账号不存在' }, { status: 400 }) // ← 泄露账号是否存在
}
const isValid = await bcrypt.compare(password, passwordHash)
if (!isValid) {
  return NextResponse.json({ error: '密码错误' }, { status: 400 }) // ← 确认账号存在
}
```

**修复方案**:  
```typescript
// 统一返回相同错误信息
if (!passwordHash || !(await bcrypt.compare(password, passwordHash))) {
  return NextResponse.json({ error: '账号或密码错误' }, { status: 400 })
}
```

---

### H-4: 弱密码策略

**位置**: `src/app/api/auth/register/route.ts:19` + `src/app/api/auth/change-password/route.ts:13`  
**类型**: CWE-521 [Weak Password Requirements]  
**置信度**: 高

**问题**: 仅要求密码长度 ≥ 6，无复杂度要求。

**修复方案**:  
```typescript
function validatePassword(password: string): string | null {
  if (password.length < 12) return '密码至少12位'
  if (!/[A-Z]/.test(password)) return '密码必须包含大写字母'
  if (!/[a-z]/.test(password)) return '密码必须包含小写字母'
  if (!/[0-9]/.test(password)) return '密码必须包含数字'
  if (!/[^A-Za-z0-9]/.test(password)) return '密码必须包含特殊字符'
  return null
}

// 在注册和修改密码时调用
const pwdError = validatePassword(password)
if (pwdError) return NextResponse.json({ error: pwdError }, { status: 400 })
```

---

### H-5: XSS — Markdown 渲染使用 dangerouslySetInnerHTML

**位置**: `src/app/insights/[slug]/page.tsx:84-86`  
**类型**: CWE-79 [Cross-site Scripting]  
**置信度**: 中 — 已使用 sanitize-html，但配置存在风险

**问题**:  
文章内容通过 `dangerouslySetInnerHTML` 渲染。虽然使用了 `sanitize-html`，但 `allowedAttributes` 中 `'*': ['class']` 允许所有标签携带 class 属性，可能被用于 CSS 注入。此外，Markdown → HTML 转换过程中的正则替换可能存在边缘情况绕过。

**修复方案**:  
```typescript
// 1. 收紧 sanitize-html 配置
const sanitizedHtml = sanitizeHtml(rawHtml, {
  allowedTags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'b', 'em', 'i', 'a', 'img', 'li', 'ul', 'ol', 'blockquote', 'hr', 'br', 'p'],
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
    img: ['src', 'alt', 'loading'],
    // 移除 '*': ['class'] — 不允许任意标签携带 class
  },
  allowedSchemes: ['http', 'https', 'mailto'], // 限制 URL 协议
  allowedSchemesByTag: {
    img: ['http', 'https', 'data'], // 图片允许 data URI
  },
  transformTags: {
    'a': (tagName, attribs) => ({
      tagName, 
      attribs: { ...attribs, rel: 'noopener noreferrer', target: '_blank' }
    })
  }
})

// 2. 考虑使用成熟的 Markdown 渲染库（如 react-markdown + rehype-sanitize）
//    而非手动正则转换 + sanitize-html
```

---

### H-6: 缺失安全响应头

**位置**: `next.config.ts`（空配置）  
**类型**: CWE-693 [Protection Mechanism Failure]  
**置信度**: 高

**问题**:  
`next.config.ts` 完全为空，未配置任何安全响应头：CSP、X-Frame-Options、X-Content-Type-Options、HSTS 等全部缺失。

**修复方案**:  
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https:",
              "connect-src 'self' http://localhost:*",
              "frame-src 'self' http://localhost:*",
              "object-src 'none'",
              "base-uri 'self'",
            ].join('; ')
          },
        ],
      },
    ]
  },
};

export default nextConfig;
```

---

### H-7: 服务健康检查端点可触发进程启动

**位置**: `src/app/api/services/health/route.ts`  
**类型**: CWE-306 [Missing Authentication]  
**置信度**: 中

**问题**:  
`/api/services/health` 端点无认证，任何人可触发。该端点会检查端口并自动 spawn 子进程（Python/Streamlit 服务）。攻击者可反复调用此端点触发大量进程启动。

**修复方案**:  
```typescript
export async function GET(request: NextRequest) {
  // 增加管理员认证
  const token = request.cookies.get('session')?.value
  const session = token ? await verifySession(token) : null
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: '无权限' }, { status: 403 })
  }
  // ... 正常逻辑
}
```

---

## 🟡 Medium 级别漏洞

### M-1: 错误信息泄露内部细节

**位置**: 多个路由  
- `src/app/api/articles/route.ts:156`: `'保存失败: ' + (error as Error).message`
- `src/app/api/articles/convert/route.ts:32`: `'转换失败: ' + (error as Error).message`
- `src/app/api/articles/smart-upload/route.ts:150`: `'处理失败：' + (error as Error).message`
- `src/app/api/wechat/articles/route.ts:22`: `error.message` 直接返回

**类型**: CWE-209 [Generation of Error Message Containing Sensitive Information]  
**修复**: 将错误信息记录到日志，对用户返回通用错误消息。

---

### M-2: 授权码生成使用不安全随机数

**位置**: `src/lib/db.ts:306-311` + `src/app/api/authcode/purchase/generate.ts` + `src/app/api/authcode/codes/route.ts:13-21`  
**类型**: CWE-330 [Use of Insufficiently Random Values]  
**修复**: 使用 `crypto.randomBytes()` 替代 `Math.random()`。

---

### M-3: 控制台日志泄露敏感信息

**位置**: 所有 API 路由的 `console.error(error)`  
**类型**: CWE-532  
**修复**: 使用结构化日志，脱敏敏感字段，控制日志级别。

---

### M-4: 联系表单无输入验证和速率限制

**位置**: `src/app/api/contact/route.ts`  
**类型**: CWE-20 [Improper Input Validation]  
**修复**: 增加手机号格式验证、消息长度限制、IP 级速率限制。

---

### M-5: SSRF 风险 — CXR 代理转发

**位置**: `src/app/api/cxr/analyze/route.ts`  
**类型**: CWE-918 [SSRF]  
**问题**: 用户提交的 formData 直接转发给内部 CXR 服务，虽然目标地址来自环境变量，但未对转发内容做任何校验。  
**修复**: 增加认证、限制请求体大小、验证 formData 内容。

---

### M-6: .env.local 包含明文密钥

**位置**: `co-website/.env.local`  
**问题**: 微信 AppSecret 以明文存储在 .env.local 中。虽然 .env.local 已被 .gitignore 排除，但本地文件仍可能通过其他途径泄露。  
**修复**: 生产环境使用密钥管理服务（如 Vault、KMS），不使用 .env 文件存储密钥。

---

## 修复优先级

### 🔴 立即修复（本周内）
1. **C-1**: 实现服务端会话管理 — 这是当前最大的安全漏洞
2. **C-2**: 移除硬编码管理员密码，改为环境变量 + 强密码
3. **C-3**: 移除硬编码授权码，改为随机生成
4. **C-6/C-7/C-8**: 为所有写操作 API 增加认证检查
5. **C-5**: 从 git 历史中清除 users.db

### 🟠 尽快修复（两周内）
6. **C-4**: 接入真实支付验证，移除模拟桩
7. **H-1**: 修复文件上传扩展名校验
8. **H-2**: 增加速率限制
9. **H-6**: 配置安全响应头

### 🟡 迭代修复（下个迭代）
10. **H-3/H-4**: 修复用户枚举 + 加强密码策略
11. **H-5**: 收紧 XSS 防护配置
12. **M-1 ~ M-6**: 修复中等风险问题

---

## 总结

当前系统存在 **8 个 Critical 级别安全漏洞**，其中最严重的是认证系统形同虚设（C-1）——所有 API 通过客户端可伪造的 HTTP 头进行"认证"，任何人都能冒充管理员。配合硬编码的弱密码（C-2），攻击者可以在几分钟内完全接管系统。

建议在修复 C-1 和 C-2 之前，**暂停系统的对外服务**，因为当前状态下系统等于完全开放。

---

*报告由腾讯安全专家生成*
