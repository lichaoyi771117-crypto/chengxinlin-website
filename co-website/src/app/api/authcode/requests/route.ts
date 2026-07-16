import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/session'
import { getPendingAuthorizationRequests, approveAuthorizationRequest, rejectAuthorizationRequest } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const auth = requireAdmin(request)
    if ('error' in auth) return auth.error

    const requests = getPendingAuthorizationRequests()
    return NextResponse.json({ requests })
  } catch (error) {
    console.error('Get auth requests error:', error)
    return NextResponse.json({ error: '获取失败' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = requireAdmin(request)
    if ('error' in auth) return auth.error

    const { requestId, action } = await request.json()
    if (!requestId || !action) {
      return NextResponse.json({ error: '参数错误' }, { status: 400 })
    }

    if (action === 'approve') {
      const code = approveAuthorizationRequest(requestId, auth.user.id)
      if (!code) {
        return NextResponse.json({ error: '审批失败：无可用的授权码' }, { status: 400 })
      }
      return NextResponse.json({ success: true, code: code.code })
    } else if (action === 'reject') {
      rejectAuthorizationRequest(requestId, auth.user.id)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: '无效操作' }, { status: 400 })
  } catch (error) {
    console.error('Process auth request error:', error)
    return NextResponse.json({ error: '操作失败' }, { status: 500 })
  }
}
