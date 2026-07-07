'use client'

import { useState, useEffect, type ReactNode } from 'react'
import { useTrial } from '@/lib/trial-context'
import { TrialCodeModal } from '@/components/features/TrialCodeModal'
import { TrialStatusBar, TrialQuotaToast } from '@/components/features/TrialStatus'

interface TrialUsageWrapperProps {
  product: 'qiaoxi' | 'qiaoyuan' | 'cxr'
  productName: string
  children: ReactNode
}

export function TrialUsageWrapper({ product, productName, children }: TrialUsageWrapperProps) {
  const { isVerified, remaining, maxUses, code, consumeUse } = useTrial()
  const [showTrialModal, setShowTrialModal] = useState(false)
  const [showQuotaToast, setShowQuotaToast] = useState(false)
  const [toastData, setToastData] = useState<{ remaining: any; maxUses: number } | null>(null)
  const [hasRecorded, setHasRecorded] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const isExhausted = isVerified && remaining && remaining[product] <= 0

  useEffect(() => {
    if (!isVerified && code) {
      setShowTrialModal(true)
    }
  }, [isVerified, code])

  const handleRecordUsage = async () => {
    if (!isVerified || hasRecorded) return

    const success = await consumeUse(product)
    if (success) {
      setHasRecorded(true)
      setToastData({
        remaining: { ...remaining },
        maxUses: maxUses!,
      })
      setShowQuotaToast(true)
      setIsExpanded(false)

      setTimeout(() => setShowQuotaToast(false), 8000)
    }
  }

  return (
    <>
      {isVerified && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <TrialStatusBar product={product} productName={productName} />
        </div>
      )}

      {isExhausted ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="text-6xl mb-4">😅</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {productName}体验额度已用完
            </h2>
            <p className="text-gray-600 mb-6">
              您的免费体验次数已用尽，如需继续使用请联系我们购买正式服务。
            </p>
            <div className="flex justify-center gap-4">
              <a href="/contact" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                联系我们
              </a>
              <a href="/products" className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                查看其他产品
              </a>
            </div>
          </div>
        </div>
      ) : (
        <>
          {children}

          {/* 体验完成记录按钮 - 固定在右下角 */}
          {isVerified && !hasRecorded && (
            <div className="fixed bottom-6 right-6 z-[150]">
              {isExpanded ? (
                <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-72">
                  <p className="text-sm text-gray-700 mb-3">
                    您已完成一次 <strong>{productName}</strong> 体验？
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsExpanded(false)}
                      className="flex-1 px-3 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 text-sm"
                    >
                      还没有
                    </button>
                    <button
                      onClick={handleRecordUsage}
                      className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                    >
                      确认记录
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsExpanded(true)}
                  className="px-4 py-2.5 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
                >
                  <span>✅</span>
                  <span>完成体验？点此记录</span>
                </button>
              )}
            </div>
          )}
        </>
      )}

      <TrialCodeModal
        isOpen={showTrialModal}
        onClose={() => setShowTrialModal(false)}
      />

      {showQuotaToast && toastData && (
        <TrialQuotaToast
          product={product}
          remaining={toastData.remaining}
          maxUses={toastData.maxUses}
          onClose={() => setShowQuotaToast(false)}
        />
      )}
    </>
  )
}
