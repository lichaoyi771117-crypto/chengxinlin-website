'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { useTrial } from '@/lib/trial-context'

type Step = 'loading' | 'login' | 'owned' | 'info' | 'pay' | 'success'

export default function PurchasePage() {
  const router = useRouter()
  const { setTrialCode, refreshStatus } = useTrial()
  const [step, setStep] = useState<Step>('loading')
  const [price, setPrice] = useState<{ price: number; promoActive: boolean; priceNormal: number; pricePromo: number; method: string } | null>(null)
  const [order, setOrder] = useState<{ id: number; amount: number; method: string; providerOrderId?: string; payUrl?: string; qrData?: string } | null>(null)
  const [owned, setOwned] = useState<{ code: string; remaining: any } | null>(null)
  const [result, setResult] = useState<{ code: string; remaining: any } | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      setStep('login')
      return
    }
    // 拉取价格
    fetch('/api/authcode/price').then(r => r.json()).then(d => setPrice(d)).catch(() => {})
    // 是否已拥有授权码
    fetch('/api/authcode/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id }),
    }).then(r => r.json()).then(d => {
      if (d.hasTrial) {
        setOwned({ code: d.code, remaining: d.remaining })
        setStep('owned')
      } else {
        setStep('info')
      }
    }).catch(() => setStep('info'))
  }, [])

  const handlePurchase = async () => {
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/api/authcode/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (!data.success) {
        setError(data.error || '创建订单失败')
        setBusy(false)
        return
      }
      setOrder(data.order)
      setStep('pay')
    } catch {
      setError('网络错误，请重试')
    } finally {
      setBusy(false)
    }
  }

  const handleConfirm = async () => {
    if (!order) return
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/api/authcode/payment/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id, providerOrderId: order.providerOrderId }),
      })
      const data = await res.json()
      if (!data.success) {
        setError(data.error || '支付确认失败')
        setBusy(false)
        return
      }
      setResult({ code: data.code, remaining: data.remaining })
      setTrialCode(data.code)
      await refreshStatus()
      setStep('success')
    } catch {
      setError('网络错误，请重试')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="py-20 bg-warm-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-navy">购买授权码</h1>
          <p className="text-warm-500 mt-2">一张授权码畅享乔曦、峤远、程晓融（各 15 次）与陈曦（不限次数），有效期一年</p>
        </div>

        {step === 'loading' && <p className="text-center text-gray-500">加载中...</p>}

        {step === 'login' && (
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            <div className="text-5xl mb-4">🔐</div>
            <p className="text-gray-600 mb-6">请先登录后再购买授权码</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => router.push('/')} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">去登录</button>
              <Link href="/products" className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">查看产品</Link>
            </div>
          </div>
        )}

        {step === 'owned' && owned && (
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">您已拥有授权码</h2>
            <p className="text-gray-600 mb-1 font-mono text-sm">{owned.code}</p>
            <p className="text-gray-500 mb-6">无需重复购买，可直接使用各产品。</p>
            <div className="flex justify-center gap-4">
              <Link href="/my/authorization" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">查看我的授权码</Link>
              <Link href="/products" className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">返回产品</Link>
            </div>
          </div>
        )}

        {step === 'info' && price && (
          <div className="bg-white rounded-2xl shadow p-8">
            <div className="flex items-end justify-center gap-2 mb-6">
              <span className="text-5xl font-bold text-navy">¥{price.price}/年</span>
              {price.promoActive && (
                <span className="text-sm text-slate-light line-through mb-2">原价 ¥{price.priceNormal}/年</span>
              )}
            </div>
            {price.promoActive && (
              <p className="text-center text-rose-500 text-sm mb-6">🎉 限时特惠，全年最低价</p>
            )}
            <ul className="space-y-3 mb-8 text-sm text-gray-600">
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span> 乔曦·AI 商业合同审查 15 次</li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span> 峤远·AI 财务报表分析 15 次</li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span> 程晓融·AI 融资体检 15 次</li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span> 陈曦·公文处理平台 不限次数</li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span> 有效期一年，可自由划转次数</li>
            </ul>
            {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
            <button
              onClick={handlePurchase}
              disabled={busy}
              className="w-full px-6 py-4 bg-copper text-navy rounded-xl text-lg font-semibold hover:bg-copper-light disabled:opacity-50"
            >
              {busy ? '处理中...' : `立即购买 ¥${price.price}`}
            </button>
            <p className="text-xs text-gray-400 text-center mt-4">
              收款方式：{price.method === 'bank_qr' ? '银行二维码' : '聚合收款平台'}（当前为开发占位）
            </p>
          </div>
        )}

        {step === 'pay' && order && (
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">请完成支付</h2>
            <p className="text-gray-500 mb-1">订单号 #{order.id} · 金额 ¥{order.amount}</p>
            <p className="text-xs text-gray-400 mb-6">收款方式：{order.method === 'bank_qr' ? '银行二维码' : '聚合收款平台'}（开发占位）</p>

            {order.qrData && (
              <div className="mb-4">
                <div className="w-40 h-40 mx-auto bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400 break-all p-3">
                  {order.qrData}
                </div>
                <p className="text-xs text-gray-400 mt-2">（占位二维码，真实接入后展示实际收款码）</p>
              </div>
            )}
            {order.payUrl && (
              <p className="text-sm text-gray-500 mb-4">跳转链接：<span className="font-mono text-xs break-all">{order.payUrl}</span></p>
            )}

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <button
              onClick={handleConfirm}
              disabled={busy}
              className="w-full px-6 py-4 bg-copper text-navy rounded-xl text-lg font-semibold hover:bg-copper-light disabled:opacity-50"
            >
              {busy ? '确认中...' : '模拟支付成功'}
            </button>
            <p className="text-xs text-gray-400 mt-3">开发环境：点击上方按钮模拟支付成功并自动发放授权码</p>
          </div>
        )}

        {step === 'success' && result && (
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">购买成功！</h2>
            <p className="text-gray-500 mb-1">您的授权码已自动绑定账号：</p>
            <p className="font-mono text-lg font-bold text-navy-900 mb-6">{result.code}</p>
            <div className="flex justify-center gap-4">
              <Link href="/my/authorization" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">查看授权码</Link>
              <Link href="/products" className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">开始使用</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
