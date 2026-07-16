import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import { findAuthorizationBindingByUserId, createAuthorizationOrder } from '@/lib/db'
import { getPaymentProvider } from '@/lib/payment'
import { currentPrice, AUTH_CODE_CONFIG } from '@/lib/config'

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request)
    if ('error' in auth) return auth.error

    // 已绑定有效授权码则不允许重复购买
    const existing = findAuthorizationBindingByUserId(auth.user.id)
    if (existing && existing.is_active) {
      return NextResponse.json({ error: '您已拥有有效的授权码，无需重复购买' }, { status: 400 })
    }

    const amount = currentPrice()
    const method = AUTH_CODE_CONFIG.PAYMENT_PROVIDER

    const order = createAuthorizationOrder(auth.user.id, amount, method)
    const provider = getPaymentProvider()
    const payment = provider.createPayment({ orderId: order.id, amount, account: auth.user.account })

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        method: payment.method,
        providerOrderId: payment.providerOrderId,
        payUrl: payment.payUrl,
        qrData: payment.qrData,
      },
    })
  } catch (error) {
    console.error('Create purchase order error:', error)
    return NextResponse.json({ error: '创建订单失败' }, { status: 500 })
  }
}
