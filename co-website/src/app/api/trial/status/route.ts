import { NextRequest, NextResponse } from 'next/server'
import { findTrialCode, findTrialBindingByUserId } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { code, userId } = await request.json()

    let trialCode = null

    if (userId) {
      const binding = findTrialBindingByUserId(userId)
      if (binding) {
        trialCode = {
          id: binding.code_id,
          code: binding.code,
          max_uses: binding.max_uses,
          qiaoxi_used: binding.qiaoxi_used,
          qiaoyuan_used: binding.qiaoyuan_used,
          cxr_used: binding.cxr_used,
          is_active: binding.is_active,
          expires_at: binding.expires_at,
        }
      }
    }

    if (!trialCode && code) {
      trialCode = findTrialCode(code.trim().toUpperCase()) as any
    }

    if (!trialCode) {
      return NextResponse.json({ hasTrial: false })
    }

    if (!trialCode.is_active) {
      return NextResponse.json({ hasTrial: false, error: '该体验码已被禁用' })
    }

    if (trialCode.expires_at && new Date(trialCode.expires_at) < new Date()) {
      return NextResponse.json({ hasTrial: false, error: '该体验码已过期' })
    }

    const remaining = {
      qiaoxi: trialCode.max_uses - trialCode.qiaoxi_used,
      qiaoyuan: trialCode.max_uses - trialCode.qiaoyuan_used,
      cxr: trialCode.max_uses - trialCode.cxr_used,
    }

    return NextResponse.json({
      hasTrial: true,
      code: trialCode.code,
      remaining,
      maxUses: trialCode.max_uses,
    })
  } catch (error) {
    console.error('Trial status error:', error)
    return NextResponse.json({ hasTrial: false, error: '查询失败' }, { status: 500 })
  }
}
