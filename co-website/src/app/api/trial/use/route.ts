import { NextRequest, NextResponse } from 'next/server'
import { findTrialCode, incrementTrialUsage, addTrialLog } from '@/lib/db'

const VALID_PRODUCTS = ['qiaoxi', 'qiaoyuan', 'cxr'] as const
type Product = typeof VALID_PRODUCTS[number]

export async function POST(request: NextRequest) {
  try {
    const { code, product, userId } = await request.json()

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ success: false, error: '请输入体验码' }, { status: 400 })
    }

    if (!product || !VALID_PRODUCTS.includes(product)) {
      return NextResponse.json({ success: false, error: '无效的产品名称' }, { status: 400 })
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

    const usedField = `${product}_used` as keyof typeof trialCode
    const used = trialCode[usedField] as number

    if (used >= trialCode.max_uses) {
      return NextResponse.json({ success: false, error: `该产品体验额度已用完` }, { status: 403 })
    }

    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'

    incrementTrialUsage(trialCode.id, product as Product)
    addTrialLog(trialCode.id, product, userId || null, ip)

    const updatedCode = findTrialCode(trialCode.code)
    if (!updatedCode) {
      return NextResponse.json({ success: false, error: '获取额度信息失败' }, { status: 500 })
    }

    const remaining = {
      qiaoxi: updatedCode.max_uses - updatedCode.qiaoxi_used,
      qiaoyuan: updatedCode.max_uses - updatedCode.qiaoyuan_used,
      cxr: updatedCode.max_uses - updatedCode.cxr_used,
    }

    return NextResponse.json({
      success: true,
      remaining,
      maxUses: updatedCode.max_uses,
    })
  } catch (error) {
    console.error('Trial use error:', error)
    return NextResponse.json({ success: false, error: '使用记录失败' }, { status: 500 })
  }
}
