import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getPasswordHash, updateUserPassword } from '@/lib/db'
import { requireAuth } from '@/lib/session'

// 密码强度校验：至少 8 位，必须包含字母和数字
function validatePassword(password: string): string | null {
  if (password.length < 8) return '新密码至少8个字符'
  if (!/[a-zA-Z]/.test(password)) return '新密码必须包含字母'
  if (!/\d/.test(password)) return '新密码必须包含数字'
  return null
}

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request)
    if ('error' in auth) return auth.error

    const { oldPassword, newPassword } = await request.json()

    if (!oldPassword || !newPassword) {
      return NextResponse.json({ success: false, error: '参数不完整' }, { status: 400 })
    }

    const passwordError = validatePassword(newPassword)
    if (passwordError) {
      return NextResponse.json({ success: false, error: passwordError }, { status: 400 })
    }

    // 从 session 获取当前用户，不再从 body 读取 account（修复用户枚举 + 认证绕过）
    const passwordHash = getPasswordHash(auth.user.account)
    if (!passwordHash) {
      // 不暴露"账号不存在"，统一返回"旧密码错误"
      return NextResponse.json({ success: false, error: '旧密码错误' }, { status: 400 })
    }

    const isValid = await bcrypt.compare(oldPassword, passwordHash)
    if (!isValid) {
      return NextResponse.json({ success: false, error: '旧密码错误' }, { status: 400 })
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10)
    updateUserPassword(auth.user.account, hashedNewPassword)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json({ success: false, error: '修改失败' }, { status: 500 })
  }
}
