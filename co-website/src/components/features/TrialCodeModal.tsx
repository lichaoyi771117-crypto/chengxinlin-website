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
  const [remaining, setRemaining] = useState<{ qiaoxi: number; qiaoyuan: number; cxr: number; chenxi: number } | null>(null)
  const [caps, setCaps] = useState<{ qiaoxi: number; qiaoyuan: number; cxr: number; chenxi: number } | null>(null)
  const [source, setSource] = useState<string | null>(null)

  if (!isOpen) return null

  const user = getCurrentUser()

  const handleVerifyAndBind = async () => {
    if (!user) {
      setError('请先登录后再使用授权码')
      return
    }

    if (!code.trim()) {
      setError('请输入授权码')
      return
    }

    setLoading(true)
    setError('')

    try {
      const bindRes = await fetch('/api/authcode/bind', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim(), userId: user.id, account: user.account }),
      })
      const bindData = await bindRes.json()

      if (!bindData.success) {
        setError(bindData.error || '绑定失败')
        setLoading(false)
        return
      }

      setVerified(true)
      setRemaining(bindData.remaining)
      setCaps(bindData.caps)
      setSource(bindData.source)
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded w-full max-w-md p-6 shadow-xl" onClick={e => e.stopPropagation()}>
        {!user ? (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-copper-dim rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-copper text-2xl">🔐</span>
              </div>
              <h2 className="text-xl font-bold text-navy">请先登录</h2>
              <p className="text-sm text-slate mt-2">授权码需要绑定到您的账号才能使用</p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => { onClose(); window.dispatchEvent(new CustomEvent('open-cxl-login')) }}
                className="w-full px-4 py-3 bg-copper text-navy rounded hover:bg-copper-light transition-colors font-semibold"
              >
                去登录
              </button>
              <button
                onClick={onClose}
                className="w-full px-4 py-3 border border-navy/10 text-navy rounded hover:bg-paper transition-colors"
              >
                取消
              </button>
            </div>
          </>
        ) : !verified ? (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-copper-dim rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-copper text-2xl">🎁</span>
              </div>
              <h2 className="text-xl font-bold text-navy">输入授权码</h2>
              <p className="text-sm text-slate mt-1">授权码将绑定到账号：{user.account}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-1">授权码</label>
                <input
                  type="text"
                  value={code}
                  onChange={e => { setCode(e.target.value.toUpperCase()); setError('') }}
                  onKeyDown={e => e.key === 'Enter' && handleVerifyAndBind()}
                  className="w-full px-4 py-3 border border-navy/10 focus:ring-2 focus:ring-copper/30 focus:border-copper outline-none text-center text-lg tracking-wider font-mono"
                  placeholder="CXL-XXXX-XXXX"
                  autoFocus
                />
              </div>

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <div className="flex gap-3">
                <button onClick={onClose} className="flex-1 px-4 py-3 border border-navy/10 text-navy rounded hover:bg-paper transition-colors">取消</button>
                <button onClick={handleVerifyAndBind} disabled={loading} className="flex-1 px-4 py-3 bg-copper text-navy rounded hover:bg-copper-light transition-colors disabled:opacity-50">
                  {loading ? '验证中...' : '验证并绑定'}
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-xl font-bold text-navy">绑定成功！</h2>
              <p className="text-sm text-slate mt-1">授权码已绑定到您的账号</p>
              {source && <p className="text-xs text-copper mt-1">来源：{source === 'admin' || source === 'admin_free' ? '管理员发放' : source === 'trial' ? '免费试用' : '用户购买'}</p>}
            </div>

            {remaining && (
              <div className="bg-paper rounded p-4 mb-6">
                <h3 className="text-sm font-medium text-navy mb-3 text-center">剩余额度</h3>
                <div className="grid grid-cols-4 gap-2">
                  {(['qiaoxi', 'qiaoyuan', 'cxr', 'chenxi'] as const).map(p => (
                    <div key={p} className="text-center">
                      <div className="text-lg mb-1">{p === 'qiaoxi' ? '⚖️' : p === 'qiaoyuan' ? '📊' : p === 'cxr' ? '🏦' : '📝'}</div>
                      <div className="text-xs text-navy">{p === 'qiaoxi' ? '乔曦' : p === 'qiaoyuan' ? '峤远' : p === 'cxr' ? '程晓融' : '陈曦'}</div>
                      <div className="text-lg font-bold text-copper">{remaining[p] >= 999999 ? '不限' : `${remaining[p]}次`}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button onClick={handleConfirm} className="w-full px-4 py-3 bg-copper text-navy rounded hover:bg-copper-light transition-colors font-semibold">
              开始使用
            </button>
          </>
        )}
      </div>
    </div>
  )
}
