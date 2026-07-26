import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/session'
import { findAuthorizationCode, incrementAuthorizationUsage, addAuthorizationLog, findAuthorizationBindingByUserId } from '@/lib/db'

const UNLIMITED = 999999

function buildRemaining(code: any) {
  const chenxiUnlimited = code.chenxi_unlimited === 1 || code.chenxi_unlimited === true
  return {
    qiaoxi: code.qiaoxi_cap - code.qiaoxi_used,
    qiaoyuan: code.qiaoyuan_cap - code.qiaoyuan_used,
    cxr: code.cxr_cap - code.cxr_used,
    chenxi: chenxiUnlimited ? UNLIMITED : 0,
  }
}

export async function POST(request: NextRequest) {
  try {
    const { code, product, userId: bodyUserId } = await request.json()

    if (!code || !product) {
      return NextResponse.json({ success: false, error: '参数错误' }, { status: 400 })
    }

    // 优先从 session 获取用户（主站调用），兜底 body userId（子程序调用）
    const sessionUser = getSessionUser(request)
    const userId = sessionUser?.id ?? bodyUserId ?? null

    const authCode = findAuthorizationCode(code.trim().toUpperCase())
    if (!authCode) {
      return NextResponse.json({ success: false, error: '授权码不存在' }, { status: 404 })
    }

    if (!authCode.is_active) {
      return NextResponse.json({ success: false, error: '该授权码已被禁用' }, { status: 403 })
    }

    if (authCode.expires_at && new Date(authCode.expires_at) < new Date()) {
      return NextResponse.json({ success: false, error: '该授权码已过期' }, { status: 403 })
    }

    // 如果有登录用户，校验授权码是否绑定给该用户
    if (sessionUser) {
      const binding = findAuthorizationBindingByUserId(sessionUser.id)
      if (binding && binding.code_id !== authCode.id) {
        return NextResponse.json({ success: false, error: '该授权码不属于当前登录用户' }, { status: 403 })
      }
    }

    // 成章通不限次数
    if (product === 'chenxi' && authCode.chenxi_unlimited) {
      incrementAuthorizationUsage(authCode.id, 'chenxi')
      const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || ''
      addAuthorizationLog(authCode.id, product, userId, ip)

      const updated = findAuthorizationCode(authCode.code)
      return NextResponse.json({
        success: true,
        remaining: buildRemaining(updated!),
        caps: {
          qiaoxi: updated!.qiaoxi_cap,
          qiaoyuan: updated!.qiaoyuan_cap,
          cxr: updated!.cxr_cap,
          chenxi: updated!.chenxi_unlimited ? UNLIMITED : 0,
        },
      })
    }

    // 检查限次产品的剩余次数
    const remaining = (authCode as any)[`${product}_cap`] - (authCode as any)[`${product}_used`]
    if (remaining <= 0) {
      return NextResponse.json({ success: false, error: '该产品授权次数已用完' }, { status: 403 })
    }

    incrementAuthorizationUsage(authCode.id, product)
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || ''
    addAuthorizationLog(authCode.id, product, userId, ip)

    const updated = findAuthorizationCode(authCode.code)
    return NextResponse.json({
      success: true,
      remaining: buildRemaining(updated!),
      caps: {
        qiaoxi: updated!.qiaoxi_cap,
        qiaoyuan: updated!.qiaoyuan_cap,
        cxr: updated!.cxr_cap,
        chenxi: updated!.chenxi_unlimited ? UNLIMITED : 0,
      },
    })
  } catch (error) {
    console.error('Auth use error:', error)
    return NextResponse.json({ success: false, error: '记录使用失败' }, { status: 500 })
  }
}
