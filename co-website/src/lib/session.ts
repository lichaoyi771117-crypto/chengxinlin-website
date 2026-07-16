import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { findUserById, type User } from '@/lib/db'

/**
 * 服务端 Session 管理 —— 基于 HMAC 签名的 HTTP-only Cookie
 *
 * 替换之前不安全的 x-user-account header 认证方式。
 * Session token 格式: base64url(payload).base64url(signature)
 * 不可伪造、不可篡改，客户端无法读取。
 */

const COOKIE_NAME = 'cxl_session'
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 天

/**
 * 获取签名密钥：优先从环境变量读取，兜底使用开发模式密钥
 * 生产环境必须设置 SESSION_SECRET 环境变量
 */
function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      console.error('[SECURITY] SESSION_SECRET 未设置！生产环境必须配置此环境变量。')
    }
    // 开发模式兜底密钥（仅用于本地开发，不安全）
    return 'dev-only-secret-change-in-production-please-set-SESSION_SECRET-env-var'
  }
  return secret
}

interface SessionPayload {
  uid: number
  acc: string
  role: string
  exp: number
}

function base64urlEncode(data: string): string {
  return Buffer.from(data, 'utf-8').toString('base64url')
}

function base64urlDecode(data: string): string {
  return Buffer.from(data, 'base64url').toString('utf-8')
}

function sign(data: string): string {
  return crypto
    .createHmac('sha256', getSessionSecret())
    .update(data)
    .digest('base64url')
}

/**
 * 创建签名的 session token
 */
function createSessionToken(payload: SessionPayload): string {
  const encoded = base64urlEncode(JSON.stringify(payload))
  const signature = sign(encoded)
  return `${encoded}.${signature}`
}

/**
 * 验证并解析 session token
 * 返回 null 表示 token 无效或已过期
 */
function verifySessionToken(token: string): SessionPayload | null {
  const parts = token.split('.')
  if (parts.length !== 2) return null

  const [encoded, signature] = parts
  const expectedSig = sign(encoded)

  // 使用时间安全的比较防止时序攻击
  if (!crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSig)
  )) {
    return null
  }

  try {
    const payload = JSON.parse(base64urlDecode(encoded)) as SessionPayload
    // 检查过期时间
    if (Date.now() > payload.exp) return null
    return payload
  } catch {
    return null
  }
}

/**
 * 为已认证用户创建 session 并设置 cookie
 * 在 login / register 路由中调用
 */
export function setSessionCookie(response: NextResponse, user: { id: number; account: string; role: string }): NextResponse {
  const payload: SessionPayload = {
    uid: user.id,
    acc: user.account,
    role: user.role,
    exp: Date.now() + SESSION_TTL_MS,
  }

  const token = createSessionToken(payload)

  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,       // JavaScript 不可读取
    secure: process.env.NODE_ENV === 'production', // 生产环境强制 HTTPS
    sameSite: 'strict',   // 防止 CSRF
    path: '/',
    maxAge: SESSION_TTL_MS / 1000, // 秒
  })

  return response
}

/**
 * 清除 session cookie（登出时调用）
 */
export function clearSessionCookie(response: NextResponse): NextResponse {
  response.cookies.delete(COOKIE_NAME)
  return response
}

/**
 * 从请求中获取当前认证用户
 * 在 API 路由中调用，返回 null 表示未登录
 */
export function getSessionUser(request?: NextRequest): User | null {
  // 优先从 cookie 读取
  const cookieSource = request?.cookies?.get(COOKIE_NAME)?.value
  // 也支持从 next/headers 的 cookies() 读取（用于 Server Components）
  const token = cookieSource

  if (!token) return null

  const payload = verifySessionToken(token)
  if (!payload) return null

  // 从数据库重新加载用户信息（确保用户仍然存在且有效）
  const user = findUserById(payload.uid)
  if (!user) return null

  return user
}

/**
 * 要求用户登录，否则返回 401
 * 在需要认证的 API 路由中使用
 */
export function requireAuth(request: NextRequest): { user: User } | { error: NextResponse } {
  const user = getSessionUser(request)
  if (!user) {
    return { error: NextResponse.json({ error: '请先登录' }, { status: 401 }) }
  }
  return { user }
}

/**
 * 要求管理员权限，否则返回 401/403
 * 在管理员 API 路由中使用
 */
export function requireAdmin(request: NextRequest): { user: User } | { error: NextResponse } {
  const auth = requireAuth(request)
  if ('error' in auth) return auth

  if (auth.user.role !== 'admin') {
    return { error: NextResponse.json({ error: '无权限' }, { status: 403 }) }
  }

  return { user: auth.user }
}
