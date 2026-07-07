import { NextRequest, NextResponse } from 'next/server'
import { getAllTrialCodes, createTrialCode, deactivateTrialCode, activateTrialCode, findUserByAccount } from '@/lib/db'

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let result = 'CXL-'
  for (let i = 0; i < 8; i++) {
    if (i === 4) result += '-'
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

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

    const codes = getAllTrialCodes()
    return NextResponse.json({ codes })
  } catch (error) {
    console.error('Get trial codes error:', error)
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

    const { count, maxUses, note, expiresAt } = await request.json()

    const numCodes = Math.min(Math.max(count || 1, 1), 50)
    const uses = maxUses || 5

    const codes = []
    for (let i = 0; i < numCodes; i++) {
      let code = generateCode()
      let attempts = 0
      while (attempts < 10) {
        try {
          const created = createTrialCode(code, uses, note || '', expiresAt)
          codes.push(created)
          break
        } catch {
          code = generateCode()
          attempts++
        }
      }
    }

    return NextResponse.json({ success: true, codes })
  } catch (error) {
    console.error('Create trial codes error:', error)
    return NextResponse.json({ error: '创建失败' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const account = request.headers.get('x-user-account')
    if (!account) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 })
    }

    const user = findUserByAccount(account)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: '无权限' }, { status: 403 })
    }

    const { id, action } = await request.json()

    if (!id || !action) {
      return NextResponse.json({ error: '参数错误' }, { status: 400 })
    }

    if (action === 'deactivate') {
      deactivateTrialCode(id)
    } else if (action === 'activate') {
      activateTrialCode(id)
    } else {
      return NextResponse.json({ error: '无效操作' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update trial code error:', error)
    return NextResponse.json({ error: '操作失败' }, { status: 500 })
  }
}
