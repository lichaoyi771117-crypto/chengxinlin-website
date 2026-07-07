import { NextRequest, NextResponse } from 'next/server'
import { findTrialCode } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ valid: false, error: '请输入体验码' }, { status: 400 })
    }

    const trialCode = findTrialCode(code.trim().toUpperCase())

    if (!trialCode) {
      return NextResponse.json({ valid: false, error: '体验码不存在' }, { status: 404 })
    }

    if (!trialCode.is_active) {
      return NextResponse.json({ valid: false, error: '该体验码已被禁用' }, { status: 403 })
    }

    if (trialCode.expires_at && new Date(trialCode.expires_at) < new Date()) {
      return NextResponse.json({ valid: false, error: '该体验码已过期' }, { status: 403 })
    }

    const remaining = {
      qiaoxi: trialCode.max_uses - trialCode.qiaoxi_used,
      qiaoyuan: trialCode.max_uses - trialCode.qiaoyuan_used,
      cxr: trialCode.max_uses - trialCode.cxr_used,
    }

    const totalRemaining = remaining.qiaoxi + remaining.qiaoyuan + remaining.cxr

    if (totalRemaining <= 0) {
      return NextResponse.json({ valid: false, error: '该体验码额度已用完' }, { status: 403 })
    }

    return NextResponse.json({
      valid: true,
      code: trialCode.code,
      remaining,
      maxUses: trialCode.max_uses,
    })
  } catch (error) {
    console.error('Trial verify error:', error)
    return NextResponse.json({ valid: false, error: '验证失败' }, { status: 500 })
  }
}
