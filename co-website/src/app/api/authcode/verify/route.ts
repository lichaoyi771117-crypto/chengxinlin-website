import { NextRequest, NextResponse } from 'next/server'
import { findAuthorizationCode } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ valid: false, error: '请输入授权码' }, { status: 400 })
    }

    const authCode = findAuthorizationCode(code.trim().toUpperCase())

    if (!authCode) {
      return NextResponse.json({ valid: false, error: '授权码不存在' })
    }

    if (!authCode.is_active) {
      return NextResponse.json({ valid: false, error: '该授权码已被禁用' })
    }

    if (authCode.expires_at && new Date(authCode.expires_at) < new Date()) {
      return NextResponse.json({ valid: false, error: '该授权码已过期' })
    }

    return NextResponse.json({
      valid: true,
      source: authCode.source,
      caps: {
        qiaoxi: authCode.qiaoxi_cap,
        qiaoyuan: authCode.qiaoyuan_cap,
        cxr: authCode.cxr_cap,
      },
    })
  } catch (error) {
    console.error('Auth verify error:', error)
    return NextResponse.json({ valid: false, error: '验证失败' }, { status: 500 })
  }
}
