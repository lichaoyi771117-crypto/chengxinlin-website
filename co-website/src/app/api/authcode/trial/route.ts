import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import { createAndBindTrialCode, incrementTrialDecline, getTrialDecline, findAuthorizationBindingByUserId } from '@/lib/db'

// GET: 查询当前用户是否有资格申请试用码
export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request)
    if ('error' in auth) {
      return NextResponse.json({ eligible: false, reason: '请先登录' })
    }

    // 已有绑定授权码（含试用、付费、管理员发放）
    const existing = findAuthorizationBindingByUserId(auth.user.id)
    if (existing) {
      return NextResponse.json({ eligible: false, reason: '您已拥有授权码', code: existing.code })
    }

    const decline = getTrialDecline(auth.user.id)
    if (decline >= 3) {
      return NextResponse.json({ eligible: false, reason: '您已连续3次拒绝申请试用码', declined: decline })
    }

    return NextResponse.json({ eligible: true, declined: decline })
  } catch (error) {
    console.error('Trial eligibility error:', error)
    return NextResponse.json({ eligible: false, reason: '查询失败' }, { status: 500 })
  }
}

// POST: 用户确认申请试用码 → 系统自动生成+绑定+激活
export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request)
    if ('error' in auth) return auth.error

    // 已有绑定？
    const existing = findAuthorizationBindingByUserId(auth.user.id)
    if (existing) {
      return NextResponse.json({ success: false, error: '您已拥有授权码' }, { status: 400 })
    }

    // 被拒绝限制？
    const decline = getTrialDecline(auth.user.id)
    if (decline >= 3) {
      return NextResponse.json({ success: false, error: '您已连续3次拒绝申请试用码。如需使用AI产品，请购买授权码或联系管理员。' }, { status: 400 })
    }

    // 生成+绑定+激活试用码
    const result = createAndBindTrialCode(auth.user.id)
    if (!result) {
      return NextResponse.json({ success: false, error: '试用码生成失败，您可能已有授权码' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      code: result.code,
      remaining: result.remaining,
      source: 'trial',
      message: '试用码已生成并绑定您的账号',
    })
  } catch (error) {
    console.error('Trial create error:', error)
    return NextResponse.json({ success: false, error: '试用码生成失败' }, { status: 500 })
  }
}
