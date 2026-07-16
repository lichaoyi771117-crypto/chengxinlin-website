import { NextRequest, NextResponse } from 'next/server'
import { getAllUsersWithBindings } from '@/lib/db'
import { requireAdmin } from '@/lib/session'

export async function GET(request: NextRequest) {
  try {
    const auth = requireAdmin(request)
    if ('error' in auth) return auth.error

    const users = getAllUsersWithBindings()
    return NextResponse.json({ users })
  } catch (error) {
    console.error('Admin users error:', error)
    return NextResponse.json({ error: '获取失败' }, { status: 500 })
  }
}