'use client'

import { useState, useEffect, type ReactNode } from 'react'
import { useTrial, type Product } from '@/lib/trial-context'
import { TrialCodeModal } from '@/components/features/TrialCodeModal'
import { TrialStatusBar, TrialQuotaToast } from '@/components/features/TrialStatus'

interface TrialUsageWrapperProps {
  product: Product
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

  const isExhausted = remaining ? remaining[product] <= 0 : false

  // ── 硬性守卫：未验证 → 强制弹窗；验证成功 → 自动关闭弹窗 ──
  useEffect(() => {
    if (isVerified) {
      setShowTrialModal(false)
    } else {
      setShowTrialModal(true)
    }
  }, [isVerified])

  // 监听全局登录事件：用户点击 TrialCodeModal 的"去登录"后关闭弹窗
  useEffect(() => {
    const handler = () => setShowTrialModal(false)
    window.addEventListener('open-cxl-login', handler)
    return () => window.removeEventListener('open-cxl-login', handler)
  }, [])

  const handleCloseModal = () => {
    // 如果还没有验证就关弹窗 → 停在 loading 状态
    if (!isVerified) return
    setShowTrialModal(false)
  }

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

      {/* ── 未验证 或 额度已用完 → 阻断 children ── */}
      {!isVerified || isExhausted ? (
        !isVerified ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <div className="text-6xl mb-4">🔐</div>
              <h2 className="text-2xl font-bold text-navy mb-4">
                请输入授权码
              </h2>
              <p className="text-navy/70 mb-6">
                该产品需要有效的授权码才能使用。可向管理员获取，或在「购买授权码」页面自助购买。
              </p>
              <div className="flex justify-center gap-4">
                <a href="/authorization/purchase" className="px-6 py-3 bg-copper text-navy rounded hover:bg-copper-light transition-colors">
                  购买授权码
                </a>
                <a href="/products" className="px-6 py-3 border border-navy/10 text-navy rounded hover:bg-paper transition-colors">
                  查看其他产品
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <div className="text-6xl mb-4">😅</div>
              <h2 className="text-2xl font-bold text-navy mb-4">
                {productName}授权额度已用完
              </h2>
              {remaining && (remaining.qiaoxi > 0 || remaining.qiaoyuan > 0 || remaining.cxr > 0) ? (
                <p className="text-navy/70 mb-6">
                  您其它产品的授权次数仍有剩余，可将其划转到「{productName}」继续使用。
                </p>
              ) : (
                <p className="text-navy/70 mb-6">
                  您的授权次数已用尽，如需继续使用请购买新的授权码。
                </p>
              )}
              <div className="flex justify-center gap-4">
                {remaining && (remaining.qiaoxi > 0 || remaining.qiaoyuan > 0 || remaining.cxr > 0) && (
                  <a href="/my/authorization" className="px-6 py-3 bg-navy text-white rounded hover:bg-navy-light transition-colors">
                    划转次数
                  </a>
                )}
                <a href="/authorization/purchase" className="px-6 py-3 border border-navy/10 text-navy rounded hover:bg-paper transition-colors">
                  购买授权码
                </a>
              </div>
            </div>
          </div>
        )
      ) : (
        <>
          {children}

          {/* 体验完成记录按钮 - 固定在右下角 */}
          {!hasRecorded && (
            <div className="fixed bottom-6 right-6 z-[150]">
              {isExpanded ? (
                <div className="bg-white rounded-xl shadow-2xl border border-navy/10 p-4 w-72">
                  <p className="text-sm text-navy mb-3">
                    您已完成一次 <strong>{productName}</strong> 体验？
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsExpanded(false)}
                      className="flex-1 px-3 py-2 border border-navy/10 text-navy rounded hover:bg-paper text-sm"
                    >
                      还没有
                    </button>
                    <button
                      onClick={handleRecordUsage}
                      className="flex-1 px-3 py-2 bg-copper text-navy rounded hover:bg-copper-light text-sm"
                    >
                      确认记录
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsExpanded(true)}
                  className="px-4 py-2.5 bg-copper text-navy rounded-full shadow-lg hover:bg-copper-light transition-colors flex items-center gap-2 text-sm"
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
        onClose={handleCloseModal}
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
