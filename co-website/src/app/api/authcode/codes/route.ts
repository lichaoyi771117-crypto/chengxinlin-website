import { NextRequest, NextResponse } from 'next/server'
import {
  getAllAuthorizationCodes,
  createAuthorizationCode,
  deactivateAuthorizationCode,
  activateAuthorizationCode,
  findUserByAccount,
  findBindingByCodeId,
  countAdminFreeCodes,
  getPaidOrdersTotal,
} from '@/lib/db'

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let result = 'CXL-'
  for (let i = 0; i < 8; i++) {
    if (i === 4) result += '-'
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

const ADMIN_QUOTA = Number(process.env.AUTH_CODE_ADMIN_QUOTA ?? 200)

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

    const codes = getAllAuthorizationCodes().map(code => {
      const binding = findBindingByCodeId(code.id)
      return { ...code, binding: binding || null }
    })

    const paidCount = codes.filter(c => c.source === 'paid').length
    const freeCount = codes.filter(c => c.source === 'admin_free').length
    const income = getPaidOrdersTotal()

    return NextResponse.json({
      codes,
      stats: {
        freeCount,
        paidCount,
        incomeTotal: income.total,
        incomeCount: income.count,
      },
    })
  } catch (error) {
    console.error('Get auth codes error:', error)
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

    const requestedCount = Math.max(count || 1, 1)
    const numCodes = Math.min(requestedCount, 50)
    const uses = maxUses || 10

    const currentUserCodes = countAdminFreeCodes(user.account)
    if (currentUserCodes + requestedCount > ADMIN_QUOTA) {
      return NextResponse.json({
        error: `该管理员可免费生成的授权码上限为 ${ADMIN_QUOTA} 个（当前已生成 ${currentUserCodes} 个，本次尝试新增 ${requestedCount} 个）。超出部分请让客户付费购买。`
      }, { status: 400 })
    }

    const codes = []
    for (let i = 0; i < numCodes; i++) {
      let code = generateCode()
      let attempts = 0
      while (attempts < 10) {
        try {
          const created = createAuthorizationCode(
            code,
            { qiaoxi: uses, qiaoyuan: uses, cxr: uses },
            note || '',
            expiresAt,
            user.account,
            'admin_free',
            null
          )
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
    console.error('Create auth codes error:', error)
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
      deactivateAuthorizationCode(id)
    } else if (action === 'activate') {
      activateAuthorizationCode(id)
    } else {
      return NextResponse.json({ error: '无效操作' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update auth code error:', error)
    return NextResponse.json({ error: '操作失败' }, { status: 500 })
  }
}
