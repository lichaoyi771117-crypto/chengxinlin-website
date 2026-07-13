import { NextRequest, NextResponse } from 'next/server'
import { findUserByAccount, incrementTrialDecline } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const account = request.headers.get('x-user-account')
    if (!account) {
      return NextResponse.json({ success: false, error: '请先登录' }, { status: 401 })
    }
    const user = findUserByAccount(account)
    if (!user) {
      return NextResponse.json({ success: false, error: '用户不存在' }, { status: 404 })
    }

    const n = incrementTrialDecline(user.id)
    return NextResponse.json({ success: true, declined: n })
  } catch (error) {
    console.error('Trial decline error:', error)
    return NextResponse.json({ success: false, error: '操作失败' }, { status: 500 })
  }
}
