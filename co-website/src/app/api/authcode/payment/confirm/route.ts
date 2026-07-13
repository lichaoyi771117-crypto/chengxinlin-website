import { NextRequest, NextResponse } from 'next/server'
import {
  getAuthorizationOrderById,
  markOrderPaid,
  createAuthorizationCode,
  bindAuthorizationCodeToUser,
  findUserByAccount,
} from '@/lib/db'
import { getPaymentProvider } from '@/lib/payment'
import { AUTH_CODE_CONFIG } from '@/lib/config'

const UNLIMITED = 999999

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let result = 'CXL-'
  for (let i = 0; i < 8; i++) {
    if (i === 4) result += '-'
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// 模拟/真实支付确认：标记订单已支付 → 自动生成付费授权码 → 自动绑定客户
export async function POST(request: NextRequest) {
  try {
    const account = request.headers.get('x-user-account')
    const user = account ? findUserByAccount(account) : null
    if (!user) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 })
    }

    const { orderId, providerOrderId } = await request.json()
    if (!orderId) {
      return NextResponse.json({ error: '缺少订单号' }, { status: 400 })
    }

    const order = getAuthorizationOrderById(orderId)
    if (!order) {
      return NextResponse.json({ error: '订单不存在' }, { status: 404 })
    }
    if (order.user_id !== user.id) {
      return NextResponse.json({ error: '无权操作该订单' }, { status: 403 })
    }
    if (order.status === 'paid') {
      return NextResponse.json({ error: '该订单已支付' }, { status: 400 })
    }

    // 验证支付（桩环境始终返回成功；真实接入时查回执）
    const provider = getPaymentProvider()
    const ok = AUTH_CODE_CONFIG.PAYMENT_SIMULATE ? true : provider.verifyPayment(providerOrderId || '')

    if (!ok) {
      return NextResponse.json({ error: '支付验证失败' }, { status: 402 })
    }

    markOrderPaid(order.id, providerOrderId || '')

    // 自动生成付费授权码（不占管理员免费额度）；年卡：绑定即激活，有效期 1 年
    const cap = AUTH_CODE_CONFIG.DEFAULT_CAP
    let code = generateCode()
    let attempts = 0
    let created
    while (attempts < 10) {
      try {
        created = createAuthorizationCode(
          code,
          { qiaoxi: cap, qiaoyuan: cap, cxr: cap },
          '客户付费购买',
          undefined,
          'SYSTEM',
          'paid',
          order.id
        )
        break
      } catch {
        code = generateCode()
        attempts++
      }
    }
    if (!created) {
      return NextResponse.json({ error: '授权码生成失败' }, { status: 500 })
    }

    bindAuthorizationCodeToUser(created.id, user.id)

    const remaining = {
      qiaoxi: created.qiaoxi_cap - created.qiaoxi_used,
      qiaoyuan: created.qiaoyuan_cap - created.qiaoyuan_used,
      cxr: created.cxr_cap - created.cxr_used,
      chenxi: created.chenxi_unlimited ? UNLIMITED : 0,
    }

    return NextResponse.json({
      success: true,
      code: created.code,
      source: 'paid',
      remaining,
      caps: {
        qiaoxi: created.qiaoxi_cap,
        qiaoyuan: created.qiaoyuan_cap,
        cxr: created.cxr_cap,
        chenxi: created.chenxi_unlimited ? UNLIMITED : 0,
      },
    })
  } catch (error) {
    console.error('Confirm payment error:', error)
    return NextResponse.json({ error: '支付确认失败' }, { status: 500 })
  }
}
