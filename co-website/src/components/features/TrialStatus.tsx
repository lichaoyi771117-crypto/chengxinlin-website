'use client'

import { useTrial } from '@/lib/trial-context'

interface TrialStatusBarProps {
  product: 'qiaoxi' | 'qiaoyuan' | 'cxr'
  productName: string
}

const productIcons: Record<string, string> = {
  qiaoxi: '⚖️',
  qiaoyuan: '📊',
  cxr: '🏦',
}

export function TrialStatusBar({ product, productName }: TrialStatusBarProps) {
  const { remaining, maxUses, isVerified } = useTrial()

  if (!isVerified || !remaining) return null

  const used = maxUses! - remaining[product]
  const isExhausted = remaining[product] <= 0

  return (
    <div className={`rounded-lg p-3 mb-4 ${isExhausted ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>{productIcons[product]}</span>
          <span className="text-sm font-medium text-gray-700">{productName}体验额度</span>
        </div>
        <div className="text-sm">
          {isExhausted ? (
            <span className="text-red-600 font-medium">已用完</span>
          ) : (
            <span className="text-green-600 font-medium">
              剩余 <span className="text-lg">{remaining[product]}</span> / {maxUses} 次
            </span>
          )}
        </div>
      </div>
      <div className="mt-2 bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${isExhausted ? 'bg-red-400' : 'bg-green-500'}`}
          style={{ width: `${(used / maxUses!) * 100}%` }}
        />
      </div>
    </div>
  )
}

interface TrialQuotaToastProps {
  product: 'qiaoxi' | 'qiaoyuan' | 'cxr'
  remaining: { qiaoxi: number; qiaoyuan: number; cxr: number }
  maxUses: number
  onClose: () => void
}

export function TrialQuotaToast({ product, remaining, maxUses, onClose }: TrialQuotaToastProps) {
  const productNames: Record<string, string> = {
    qiaoxi: '乔曦',
    qiaoyuan: '峤远',
    cxr: '程晓融',
  }

  return (
    <div className="fixed bottom-6 right-6 z-[300] bg-white rounded-xl shadow-2xl border border-gray-200 p-4 max-w-sm animate-slide-up">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-green-500 text-xl">✅</span>
          <span className="font-medium text-gray-900">本次体验已记录</span>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="bg-gray-50 rounded-lg p-3">
        <p className="text-xs text-gray-500 mb-2">剩余额度</p>
        <div className="grid grid-cols-3 gap-2 text-center">
          {(['qiaoxi', 'qiaoyuan', 'cxr'] as const).map(p => (
            <div key={p} className={p === product ? 'bg-green-100 rounded-lg py-1' : ''}>
              <div className="text-lg">{productIcons[p]}</div>
              <div className="text-xs text-gray-500">{productNames[p]}</div>
              <div className={`font-bold ${remaining[p] <= 0 ? 'text-red-500' : 'text-green-600'}`}>
                {remaining[p]}<span className="text-xs text-gray-400">次</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
