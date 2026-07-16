import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import { incrementTrialDecline } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request)
    if ('error' in auth) return auth.error

    const n = incrementTrialDecline(auth.user.id)
    return NextResponse.json({ success: true, declined: n })
  } catch (error) {
    console.error('Trial decline error:', error)
    return NextResponse.json({ success: false, error: '操作失败' }, { status: 500 })
  }
}
