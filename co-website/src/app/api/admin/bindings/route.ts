import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/session'
import { getUnboundAuthorizationCodes, batchBindAuthorizationCodes, batchUnbindAuthorizationCodes } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const auth = requireAdmin(request)
    if ('error' in auth) return auth.error

    const codes = getUnboundAuthorizationCodes()
    return NextResponse.json({ codes })
  } catch (error) {
    console.error('Admin bindings error:', error)
    return NextResponse.json({ error: '获取失败' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = requireAdmin(request)
    if ('error' in auth) return auth.error

    const { codeId, userIds, action } = await request.json()

    if (!codeId || !userIds || !Array.isArray(userIds)) {
      return NextResponse.json({ error: '参数错误' }, { status: 400 })
    }

    if (action === 'bind') {
      batchBindAuthorizationCodes(codeId, userIds)
      return NextResponse.json({ success: true, bound: userIds.length })
    } else if (action === 'unbind') {
      batchUnbindAuthorizationCodes(userIds)
      return NextResponse.json({ success: true, unbound: userIds.length })
    } else {
      return NextResponse.json({ error: '无效操作' }, { status: 400 })
    }
  } catch (error) {
    console.error('Admin bind error:', error)
    return NextResponse.json({ error: '操作失败' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = requireAdmin(request)
    if ('error' in auth) return auth.error

    const { userIds } = await request.json()

    if (!userIds || !Array.isArray(userIds)) {
      return NextResponse.json({ error: '参数错误' }, { status: 400 })
    }

    batchUnbindAuthorizationCodes(userIds)
    return NextResponse.json({ success: true, unbound: userIds.length })
  } catch (error) {
    console.error('Admin unbind error:', error)
    return NextResponse.json({ error: '操作失败' }, { status: 500 })
  }
}
