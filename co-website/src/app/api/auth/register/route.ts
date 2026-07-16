import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { findUserByAccount, findUserByPhone, findUserByEmail, createUser } from '@/lib/db'
import { setSessionCookie } from '@/lib/session'
import { checkRateLimit } from '@/lib/rate-limit'

// 密码强度校验：至少 8 位，必须包含字母和数字
function validatePassword(password: string): string | null {
  if (password.length < 8) return '密码至少8个字符'
  if (!/[a-zA-Z]/.test(password)) return '密码必须包含字母'
  if (!/\d/.test(password)) return '密码必须包含数字'
  return null
}

export async function POST(request: NextRequest) {
  try {
    // 速率限制：每 IP 每分钟最多 3 次注册
    const limited = checkRateLimit(request, 'register', 3, 60 * 1000)
    if (limited) return limited

    const body = await request.json()
    const { account, password, nickname, phone, email } = body

    if (!account || !password) {
      return NextResponse.json({ error: '账号和密码不能为空' }, { status: 400 })
    }

    if (account.length < 3) {
      return NextResponse.json({ error: '账号至少3个字符' }, { status: 400 })
    }

    const passwordError = validatePassword(password)
    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 })
    }

    // 检查账号、手机号、邮箱是否已被注册（统一错误消息防止枚举）
    const existingAccount = findUserByAccount(account)
    const existingPhone = phone ? findUserByPhone(phone) : null
    const existingEmail = email ? findUserByEmail(email) : null

    if (existingAccount || existingPhone || existingEmail) {
      return NextResponse.json({ error: '注册信息已被使用，请检查账号、手机号或邮箱' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = createUser({
      account,
      password: hashedPassword,
      nickname,
      phone,
      email,
    })

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        account: user.account,
        nickname: user.nickname,
        role: user.role,
      },
    })

    // 注册成功后设置 session cookie
    setSessionCookie(response, { id: user.id, account: user.account, role: user.role })

    return response
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: '注册失败' }, { status: 500 })
  }
}
