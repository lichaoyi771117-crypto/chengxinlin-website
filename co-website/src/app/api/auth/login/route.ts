import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { findUserByAccount, getPasswordHash } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { account, password } = body

    if (!account || !password) {
      return NextResponse.json({ error: '账号和密码不能为空' }, { status: 400 })
    }

    const passwordHash = getPasswordHash(account)
    if (!passwordHash) {
      return NextResponse.json({ error: '账号不存在' }, { status: 400 })
    }

    const isValid = await bcrypt.compare(password, passwordHash)
    if (!isValid) {
      return NextResponse.json({ error: '密码错误' }, { status: 400 })
    }

    const user = findUserByAccount(account)
    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 400 })
    }

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
    console.error('Login error:', error)
    return NextResponse.json({ error: '登录失败' }, { status: 500 })
  }
}
