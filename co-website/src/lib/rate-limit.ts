import { NextRequest, NextResponse } from 'next/server'

/**
 * 简单的内存速率限制器
 * 生产环境建议替换为 Redis 版本
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

// 定期清理过期条目，防止内存泄漏
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store) {
    if (entry.resetAt < now) {
      store.delete(key)
    }
  }
}, 60 * 1000) // 每分钟清理一次

/**
 * 检查速率限制
 * @param identifier 通常为 IP 地址或 "ip:endpoint"
 * @param maxRequests 时间窗口内最大请求数
 * @param windowMs 时间窗口（毫秒）
 * @returns null 表示通过，NextResponse 表示被限流
 */
export function checkRateLimit(
  request: NextRequest,
  endpoint: string,
  maxRequests: number = 5,
  windowMs: number = 60 * 1000
): NextResponse | null {
  const ip = getClientIP(request)
  const key = `${ip}:${endpoint}`

  const now = Date.now()
  const entry = store.get(key)

  if (!entry || entry.resetAt < now) {
    // 新窗口或已过期
    store.set(key, { count: 1, resetAt: now + windowMs })
    return null
  }

  entry.count++
  if (entry.count > maxRequests) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000)
    return NextResponse.json(
      { error: `请求过于频繁，请 ${retryAfter} 秒后重试` },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfter),
        },
      }
    )
  }

  return null
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  const realIP = request.headers.get('x-real-ip')
  if (realIP) return realIP
  return 'unknown'
}
