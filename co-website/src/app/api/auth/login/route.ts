import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { findUserByAccount, getPasswordHash } from '@/lib/db'
import { setSessionCookie } from '@/lib/session'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    // 速率限制：每 IP 每分钟最多 5 次登录尝试
    const limited = checkRateLimit(request, 'login', 5, 60 * 1000)
    if (limited) return limited

    const body = await request.json()
    const { account, password } = body

    if (!account || !password) {
      return NextResponse.json({ error: '账号和密码不能为空' }, { status: 400 })
    }

    const passwordHash = getPasswordHash(account)
    // 统一错误消息，防止用户枚举
    const genericError = '账号或密码错误'
    if (!passwordHash) {
      return NextResponse.json({ error: genericError }, { status: 400 })
    }

    const isValid = await bcrypt.compare(password, passwordHash)
    if (!isValid) {
      return NextResponse.json({ error: genericError }, { status: 400 })
    }

    const user = findUserByAccount(account)
    if (!user) {
      return NextResponse.json({ error: genericError }, { status: 400 })
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        account: user.account,
        nickname: user.nickname,
        role: user.role,
      },
    })

    // 设置 HTTP-only session cookie
    return setSessionCookie(response, user)
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: '登录失败' }, { status: 500 })
  }
}
