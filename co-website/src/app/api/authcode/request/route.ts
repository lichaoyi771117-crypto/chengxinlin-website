import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import { createAuthorizationRequest } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request)
    if ('error' in auth) return auth.error

    const { reason } = await request.json().catch(() => ({ reason: '' }))

    createAuthorizationRequest(auth.user.id, reason || '')

    return NextResponse.json({ success: true, message: '申请已提交，等待管理员审核' })
  } catch (error) {
    console.error('Create auth request error:', error)
    return NextResponse.json({ error: '申请失败' }, { status: 500 })
  }
}
