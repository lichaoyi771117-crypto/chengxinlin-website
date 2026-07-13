'use client'

import { useTrial, type Product, UNLIMITED } from '@/lib/trial-context'

interface TrialStatusBarProps {
  product: Product
  productName: string
}

const productIcons: Record<Product, string> = {
  qiaoxi: '⚖️',
  qiaoyuan: '📊',
  cxr: '🏦',
  chenxi: '📝',
}

const productNames: Record<Product, string> = {
  qiaoxi: '乔曦',
  qiaoyuan: '峤远',
  cxr: '程晓融',
  chenxi: '陈曦',
}

export function TrialStatusBar({ product, productName }: TrialStatusBarProps) {
  const { remaining, caps, maxUses, isVerified } = useTrial()

  if (!isVerified || !remaining) return null

  // 陈曦不限次数
  if (product === 'chenxi') {
    return (
      <div className="rounded p-3 mb-4 bg-paper border border-copper/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>{productIcons[product]}</span>
            <span className="text-sm font-medium text-navy">{productName}授权额度</span>
          </div>
          <span className="text-sm text-copper font-medium">不限次数</span>
        </div>
      </div>
    )
  }

  const cap = caps?.[product] ?? maxUses ?? 0
  const used = Math.max(0, cap - remaining[product])
  const isExhausted = remaining[product] <= 0

  return (
    <div className={`rounded p-3 mb-4 ${isExhausted ? 'bg-red-50 border border-red-200' : 'bg-paper border border-copper/20'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>{productIcons[product]}</span>
          <span className="text-sm font-medium text-navy">{productName}授权额度</span>
        </div>
        <div className="text-sm">
          {isExhausted ? (
            <span className="text-red-600 font-medium">已用完</span>
          ) : (
            <span className="text-copper font-medium">
              剩余 <span className="text-lg">{remaining[product]}</span> / {cap} 次
            </span>
          )}
        </div>
      </div>
      <div className="mt-2 bg-navy-dim rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${isExhausted ? 'bg-red-400' : 'bg-copper'}`}
          style={{ width: `${cap > 0 ? Math.min(100, (used / cap) * 100) : 0}%` }}
        />
      </div>
    </div>
  )
}

interface TrialQuotaToastProps {
  product: Product
  remaining: Record<Product, number>
  maxUses: number
  onClose: () => void
}

export function TrialQuotaToast({ product, remaining, maxUses, onClose }: TrialQuotaToastProps) {
  const allProducts: Product[] = ['qiaoxi', 'qiaoyuan', 'cxr', 'chenxi']

  return (
    <div className="fixed bottom-6 right-6 z-[300] bg-white rounded-xl shadow-2xl border border-navy/10 p-4 max-w-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-green-500 text-xl">✅</span>
          <span className="font-medium text-navy">本次授权已记录</span>
        </div>
        <button onClick={onClose} className="text-slate hover:text-navy">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="bg-paper rounded p-3">
        <p className="text-xs text-slate mb-2">剩余额度</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
          {allProducts.map(p => (
            <div key={p} className={p === product ? 'bg-copper-dim rounded py-1' : 'py-1'}>
              <div className="text-lg">{productIcons[p]}</div>
              <div className="text-xs text-slate">{productNames[p]}</div>
              <div className={`font-bold ${remaining[p] <= 0 ? 'text-red-500' : 'text-copper'}`}>
                {remaining[p] >= UNLIMITED ? '不限' : `${remaining[p]}次`}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
