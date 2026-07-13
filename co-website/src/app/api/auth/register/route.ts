import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { findUserByAccount, findUserByPhone, findUserByEmail, createUser } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { account, password, nickname, phone, email } = body

    if (!account || !password) {
      return NextResponse.json({ error: '账号和密码不能为空' }, { status: 400 })
    }

    if (account.length < 3) {
      return NextResponse.json({ error: '账号至少3个字符' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: '密码至少6个字符' }, { status: 400 })
    }

    // 检查账号、手机号、邮箱是否已被注册
    const existingAccount = findUserByAccount(account)
    if (existingAccount) {
      return NextResponse.json({ error: '该账号已被注册' }, { status: 400 })
    }

    if (phone) {
      const existingPhone = findUserByPhone(phone)
      if (existingPhone) {
        return NextResponse.json({ error: '该手机号已被注册' }, { status: 400 })
      }
    }

    if (email) {
      const existingEmail = findUserByEmail(email)
      if (existingEmail) {
        return NextResponse.json({ error: '该邮箱已被注册' }, { status: 400 })
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = createUser({
      account,
      password: hashedPassword,
      nickname,
      phone,
      email,
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        account: user.account,
        nickname: user.nickname,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: '注册失败' }, { status: 500 })
  }
}
