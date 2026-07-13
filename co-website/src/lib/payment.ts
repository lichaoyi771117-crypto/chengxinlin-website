// 付费收款管道抽象层
// 收款模式最终在「聚合收款平台」与「银行二维码」二选一，目前均用桩占位。
// 接入真实收款时，只需新增一个 Provider 实现并在 getPaymentProvider() 中切换，
// 业务代码（下单 / 确认 / 生成授权码）无需改动。

export type PaymentMethod = 'aggregator' | 'bank_qr'

export interface CreatePaymentResult {
  providerOrderId: string
  // 给前端展示的支付入口：聚合平台返回跳转链接，银行二维码返回二维码内容
  payUrl?: string
  qrData?: string
  method: PaymentMethod
}

export interface PaymentProvider {
  readonly method: PaymentMethod
  // 创建一笔支付，返回给前端的支付入口信息
  createPayment(order: { orderId: number; amount: number; account: string }): CreatePaymentResult
  // 校验某笔支付是否成功（真实接入时查收款方回执 / 回调）
  verifyPayment(providerOrderId: string): boolean
}

// ── 聚合收款平台桩 ──
class AggregatorStubProvider implements PaymentProvider {
  readonly method: PaymentMethod = 'aggregator'

  createPayment(order: { orderId: number; amount: number; account: string }): CreatePaymentResult {
    const providerOrderId = `AGG-${order.orderId}-${Date.now()}`
    return {
      providerOrderId,
      payUrl: `/api/authcode/payment/stub?order=${order.orderId}&method=aggregator`,
      method: 'aggregator',
    }
  }

  verifyPayment(): boolean {
    return true
  }
}

// ── 银行二维码桩 ──
class BankQrStubProvider implements PaymentProvider {
  readonly method: PaymentMethod = 'bank_qr'

  createPayment(order: { orderId: number; amount: number; account: string }): CreatePaymentResult {
    const providerOrderId = `BANK-${order.orderId}-${Date.now()}`
    const qrData = `bankqr://pay?order=${order.orderId}&amount=${order.amount}&acc=${encodeURIComponent(order.account)}`
    return {
      providerOrderId,
      qrData,
      method: 'bank_qr',
    }
  }

  verifyPayment(): boolean {
    return true
  }
}

export function getPaymentProvider(): PaymentProvider {
  const method = (process.env.PAYMENT_PROVIDER as PaymentMethod) ?? 'aggregator'
  return method === 'bank_qr' ? new BankQrStubProvider() : new AggregatorStubProvider()
}
