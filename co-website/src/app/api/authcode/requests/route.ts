import { NextRequest, NextResponse } from 'next/server'
import { findUserByAccount, getPendingAuthorizationRequests, approveAuthorizationRequest, rejectAuthorizationRequest } from '@/lib/db'

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

    const requests = getPendingAuthorizationRequests()
    return NextResponse.json({ requests })
  } catch (error) {
    console.error('Get auth requests error:', error)
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

    const { requestId, action } = await request.json()
    if (!requestId || !action) {
      return NextResponse.json({ error: '参数错误' }, { status: 400 })
    }

    if (action === 'approve') {
      const code = approveAuthorizationRequest(requestId, user.id)
      if (!code) {
        return NextResponse.json({ error: '审批失败：无可用的授权码' }, { status: 400 })
      }
      return NextResponse.json({ success: true, code: code.code })
    } else if (action === 'reject') {
      rejectAuthorizationRequest(requestId, user.id)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: '无效操作' }, { status: 400 })
  } catch (error) {
    console.error('Process auth request error:', error)
    return NextResponse.json({ error: '操作失败' }, { status: 500 })
  }
}
