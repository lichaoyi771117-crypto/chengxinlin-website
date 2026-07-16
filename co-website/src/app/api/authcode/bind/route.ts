import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import { findAuthorizationCode, findAuthorizationBindingByUserId, bindAuthorizationCodeToUser } from '@/lib/db'

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
    const auth = requireAuth(request)
    if ('error' in auth) return auth.error

    const { code } = await request.json()

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ success: false, error: '请输入授权码' }, { status: 400 })
    }

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

    const existingBinding = findAuthorizationBindingByUserId(auth.user.id)
    if (existingBinding) {
      // 已绑定到同一个码 → 视为成功（用户重新输入自己已绑定的码，直接放行）
      if (existingBinding.code === authCode.code) {
        return NextResponse.json({
          success: true,
          message: '授权码已绑定',
          alreadyBound: true,
          source: authCode.source,
          remaining: buildRemaining(authCode),
          caps: {
            qiaoxi: authCode.qiaoxi_cap,
            qiaoyuan: authCode.qiaoyuan_cap,
            cxr: authCode.cxr_cap,
            chenxi: authCode.chenxi_unlimited ? UNLIMITED : 0,
          },
          maxUses: authCode.qiaoxi_cap,
        })
      }
      return NextResponse.json({ success: false, error: '您已绑定过授权码，每个账号只能绑定一个授权码' }, { status: 400 })
    }

    bindAuthorizationCodeToUser(authCode.id, auth.user.id)

    return NextResponse.json({
      success: true,
      message: '授权码绑定成功',
      source: authCode.source,
      remaining: buildRemaining(authCode),
      caps: {
        qiaoxi: authCode.qiaoxi_cap,
        qiaoyuan: authCode.qiaoyuan_cap,
        cxr: authCode.cxr_cap,
        chenxi: authCode.chenxi_unlimited ? UNLIMITED : 0,
      },
      maxUses: authCode.qiaoxi_cap,
    })
  } catch (error) {
    console.error('Auth bind error:', error)
    return NextResponse.json({ success: false, error: '绑定失败' }, { status: 500 })
  }
}
