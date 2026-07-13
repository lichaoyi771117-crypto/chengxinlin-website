import { NextRequest, NextResponse } from 'next/server'
import { findUserByAccount, createAuthorizationRequest } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const account = request.headers.get('x-user-account')
    const user = account ? findUserByAccount(account) : null
    if (!user) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 })
    }

    const { reason } = await request.json().catch(() => ({ reason: '' }))

    createAuthorizationRequest(user.id, reason || '')

    return NextResponse.json({ success: true, message: '申请已提交，等待管理员审核' })
  } catch (error) {
    console.error('Create auth request error:', error)
    return NextResponse.json({ error: '申请失败' }, { status: 500 })
  }
}
