import { NextRequest, NextResponse } from 'next/server'
import { findUserByAccount, getAllUsersWithBindings } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const account = request.headers.get('x-user-account')
    if (!account) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 })
    }

    const user = findUserByAccount(account)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: '无权限' }, { status: 403 })
    }

    const users = getAllUsersWithBindings()
    return NextResponse.json({ users })
  } catch (error) {
    console.error('Admin users error:', error)
    return NextResponse.json({ error: '获取失败' }, { status: 500 })
  }
}
