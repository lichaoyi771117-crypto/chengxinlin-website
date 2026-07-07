'use client'

import { useState } from 'react'
import { useTrial } from '@/lib/trial-context'
import { getCurrentUser } from '@/lib/auth'

interface TrialCodeModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function TrialCodeModal({ isOpen, onClose, onSuccess }: TrialCodeModalProps) {
  const { setTrialCode, userId } = useTrial()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [verified, setVerified] = useState(false)
  const [remaining, setRemaining] = useState<{ qiaoxi: number; qiaoyuan: number; cxr: number } | null>(null)

  if (!isOpen) return null

  const user = getCurrentUser()

  const handleVerifyAndBind = async () => {
    if (!user) {
      setError('请先登录后再使用体验码')
      return
    }

    if (!code.trim()) {
      setError('请输入体验码')
      return
    }

    setLoading(true)
    setError('')

    try {
      const verifyRes = await fetch('/api/trial/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      })
      const verifyData = await verifyRes.json()

      if (!verifyData.valid) {
        setError(verifyData.error || '体验码无效')
        setLoading(false)
        return
      }

      const bindRes = await fetch('/api/trial/bind', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim(), userId: user.id }),
      })
      const bindData = await bindRes.json()

      if (!bindData.success) {
        setError(bindData.error || '绑定失败')
        setLoading(false)
        return
      }

      setVerified(true)
      setRemaining(bindData.remaining)
      setTrialCode(code.trim())
    } catch {
      setError('验证失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = () => {
    onSuccess?.()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
        {!user ? (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">⚠️</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">请先登录</h2>
              <p className="text-sm text-gray-500 mt-2">体验码需要绑定到您的账号才能使用</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                去登录
              </button>
            </div>
          </>
        ) : !verified ? (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">🎁</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">输入免费体验码</h2>
              <p className="text-sm text-gray-500 mt-1">体验码将绑定到账号：{user.account}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">体验码</label>
                <input
                  type="text"
                  value={code}
                  onChange={e => { setCode(e.target.value.toUpperCase()); setError('') }}
                  onKeyDown={e => e.key === 'Enter' && handleVerifyAndBind()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-center text-lg tracking-wider font-mono"
                  placeholder="CXL-XXXX-XXXX"
                  autoFocus
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleVerifyAndBind}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {loading ? '验证中...' : '验证并绑定'}
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-xl font-bold text-gray-900">绑定成功！</h2>
              <p className="text-sm text-gray-500 mt-1">体验码已绑定到您的账号</p>
            </div>

            {remaining && (
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3 text-center">剩余额度</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <div className="text-2xl mb-1">⚖️</div>
                    <div className="text-xs text-gray-500">乔曦</div>
                    <div className="text-lg font-bold text-green-600">{remaining.qiaoxi}<span className="text-xs text-gray-400">次</span></div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-1">📊</div>
                    <div className="text-xs text-gray-500">峤远</div>
                    <div className="text-lg font-bold text-green-600">{remaining.qiaoyuan}<span className="text-xs text-gray-400">次</span></div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-1">🏦</div>
                    <div className="text-xs text-gray-500">程晓融</div>
                    <div className="text-lg font-bold text-green-600">{remaining.cxr}<span className="text-xs text-gray-400">次</span></div>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleConfirm}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              开始体验
            </button>
          </>
        )}
      </div>
    </div>
  )
}
