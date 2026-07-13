import { NextRequest, NextResponse } from 'next/server'
import { findUserByAccount, getUnboundAuthorizationCodes, batchBindAuthorizationCodes, batchUnbindAuthorizationCodes } from '@/lib/db'

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

    const codes = getUnboundAuthorizationCodes()
    return NextResponse.json({ codes })
  } catch (error) {
    console.error('Admin bindings error:', error)
    return NextResponse.json({ error: '获取失败' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const account = request.headers.get('x-user-account')
    if (!account) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 })
    }

    const user = findUserByAccount(account)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: '无权限' }, { status: 403 })
    }

    const { codeId, userIds, action } = await request.json()

    if (!codeId || !userIds || !Array.isArray(userIds)) {
      return NextResponse.json({ error: '参数错误' }, { status: 400 })
    }

    if (action === 'bind') {
      batchBindAuthorizationCodes(codeId, userIds)
    } else if (action === 'unbind') {
      batchUnbindAuthorizationCodes(userIds)
    } else {
      return NextResponse.json({ error: '无效操作' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin bind error:', error)
    return NextResponse.json({ error: '操作失败' }, { status: 500 })
  }
}
