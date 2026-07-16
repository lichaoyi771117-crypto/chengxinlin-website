import { NextRequest, NextResponse } from 'next/server'
import { updateUser, softDeleteUser, getAllUsersWithBindings } from '@/lib/db'
import { requireAdmin } from '@/lib/session'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAdmin(request)
    if ('error' in auth) return auth.error

    const { id } = await params
    // 这里复用 getAllUsersWithBindings 并过滤
    const { getAllUsersWithBindings } = await import('@/lib/db')
    const users = getAllUsersWithBindings()
    const user = users.find(u => u.id === parseInt(id))

    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json({ error: '获取失败' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAdmin(request)
    if ('error' in auth) return auth.error

    const { id } = await params
    const body = await request.json()

    updateUser({
      id: parseInt(id),
      nickname: body.nickname,
      phone: body.phone,
      email: body.email,
      role: body.role,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json({ error: '更新失败' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAdmin(request)
    if ('error' in auth) return auth.error

    const { id } = await params
    softDeleteUser(parseInt(id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete user error:', error)
    return NextResponse.json({ error: '删除失败' }, { status: 500 })
  }
}
