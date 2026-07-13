import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { findUserByAccount, getPasswordHash, updateUserPassword } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { account, oldPassword, newPassword } = await request.json()

    if (!account || !oldPassword || !newPassword) {
      return NextResponse.json({ success: false, error: '参数不完整' }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ success: false, error: '新密码至少6个字符' }, { status: 400 })
    }

    const passwordHash = getPasswordHash(account)
    if (!passwordHash) {
      return NextResponse.json({ success: false, error: '账号不存在' }, { status: 400 })
    }

    const isValid = await bcrypt.compare(oldPassword, passwordHash)
    if (!isValid) {
      return NextResponse.json({ success: false, error: '旧密码错误' }, { status: 400 })
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10)
    updateUserPassword(account, hashedNewPassword)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json({ success: false, error: '修改失败' }, { status: 500 })
  }
}
