import { NextRequest, NextResponse } from 'next/server'
import { findTrialCode, findTrialBindingByUserId, bindTrialCodeToUser, findUserByAccount } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { code, userId, account } = await request.json()

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ success: false, error: '请输入体验码' }, { status: 400 })
    }

    if (!userId) {
      return NextResponse.json({ success: false, error: '请先登录' }, { status: 401 })
    }

    const trialCode = findTrialCode(code.trim().toUpperCase())

    if (!trialCode) {
      return NextResponse.json({ success: false, error: '体验码不存在' }, { status: 404 })
    }

    if (!trialCode.is_active) {
      return NextResponse.json({ success: false, error: '该体验码已被禁用' }, { status: 403 })
    }

    if (trialCode.expires_at && new Date(trialCode.expires_at) < new Date()) {
      return NextResponse.json({ success: false, error: '该体验码已过期' }, { status: 403 })
    }

    const existingBinding = findTrialBindingByUserId(userId)
    if (existingBinding) {
      return NextResponse.json({ success: false, error: '您已绑定过体验码，每个账号只能绑定一个体验码' }, { status: 400 })
    }

    bindTrialCodeToUser(trialCode.id, userId)

    const remaining = {
      qiaoxi: trialCode.max_uses - trialCode.qiaoxi_used,
      qiaoyuan: trialCode.max_uses - trialCode.qiaoyuan_used,
      cxr: trialCode.max_uses - trialCode.cxr_used,
    }

    return NextResponse.json({
      success: true,
      message: '体验码绑定成功',
      remaining,
      maxUses: trialCode.max_uses,
    })
  } catch (error) {
    console.error('Trial bind error:', error)
    return NextResponse.json({ success: false, error: '绑定失败' }, { status: 500 })
  }
}
