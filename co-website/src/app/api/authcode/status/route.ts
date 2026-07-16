import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/session'
import { findAuthorizationCode, findAuthorizationBindingByUserId } from '@/lib/db'

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

function buildCaps(code: any) {
  const chenxiUnlimited = code.chenxi_unlimited === 1 || code.chenxi_unlimited === true
  return {
    qiaoxi: code.qiaoxi_cap,
    qiaoyuan: code.qiaoyuan_cap,
    cxr: code.cxr_cap,
    chenxi: chenxiUnlimited ? UNLIMITED : 0,
  }
}

export async function POST(request: NextRequest) {
  try {
    const { code, userId: bodyUserId } = await request.json()

    // 优先从 session 获取用户（主站调用），兜底 body userId（子程序调用）
    const sessionUser = getSessionUser(request)
    const userId = sessionUser?.id ?? bodyUserId

    let authCode: any = null

    if (userId) {
      const binding = findAuthorizationBindingByUserId(userId)
      if (binding) {
        authCode = binding
      }
    }

    if (!authCode && code) {
      authCode = findAuthorizationCode(code.trim().toUpperCase()) as any
    }

    if (!authCode) {
      return NextResponse.json({ hasTrial: false })
    }

    if (!authCode.is_active) {
      return NextResponse.json({ hasTrial: false, error: '该授权码已被禁用' })
    }

    if (authCode.expires_at && new Date(authCode.expires_at) < new Date()) {
      return NextResponse.json({ hasTrial: false, error: '该授权码已过期' })
    }

    return NextResponse.json({
      hasTrial: true,
      code: authCode.code,
      source: authCode.source,
      remaining: buildRemaining(authCode),
      caps: buildCaps(authCode),
      maxUses: authCode.qiaoxi_cap,
    })
  } catch (error) {
    console.error('Auth status error:', error)
    return NextResponse.json({ hasTrial: false, error: '查询失败' }, { status: 500 })
  }
}
