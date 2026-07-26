'use client'

import { useState } from 'react'
import { getCurrentUser } from '@/lib/auth'
import { useTrial } from '@/lib/trial-context'

interface TrialPromptModalProps {
  onClose: () => void  // 用户选择取消 或 操作完成后关闭
}

const ICONS: Record<string, string> = { qiaoxi: '⚖️', qiaoyuan: '📊', cxr: '🏦', chenxi: '📝' }
const NAMES: Record<string, string> = { qiaoxi: '契审通·AI商业合同审查', qiaoyuan: '峤远·AI财务报表分析', cxr: '程晓融·AI融资体检', chenxi: '成章通·公文处理平台' }

export function TrialPromptModal({ onClose }: TrialPromptModalProps) {
  const { setTrialCode, refreshStatus } = useTrial()
  const [step, setStep] = useState<'prompt' | 'accepted' | 'error'>('prompt')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const user = getCurrentUser()

  const handleAccept = async () => {
    if (!user) return
    setLoading(true)
    setErrorMsg('')
    try {
      const res = await fetch('/api/authcode/trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (data.success) {
        setCode(data.code)
        setTrialCode(data.code)
        setStep('accepted')
        // refreshStatus 让 TrialProvider 重新查一次 —— 这会带来 isVerified=true
        await refreshStatus()
      } else {
        setErrorMsg(data.error || '生成失败')
        setStep('error')
      }
    } catch {
      setErrorMsg('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleDecline = async () => {
    if (!user) return
    // 拒绝：发请求增加计数，然后直接关弹窗
    fetch('/api/authcode/trial/decline', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }).catch(() => {})
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[210] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">

        {/* ---------- 第 1 屏：确认/取消 ---------- */}
        {step === 'prompt' && (
          <>
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">🎁</div>
              <h2 className="text-xl font-bold text-gray-900">申请免费试用码</h2>
              <p className="text-sm text-gray-500 mt-1">
                新用户可免费申请一张试用码，<strong>30 天内有效</strong>
              </p>
            </div>

            <div className="bg-amber-50 rounded-xl p-4 mb-6 text-sm">
              <h3 className="font-medium text-amber-800 mb-2">试用码规则</h3>
              <ul className="space-y-1.5 text-amber-700">
                <li>契审通·AI商业合同审查 — <strong>3 次</strong></li>
                <li>峤远·AI财务报表分析 — <strong>3 次</strong></li>
                <li>程晓融·AI融资体检 — <strong>3 次</strong></li>
                <li>成章通·公文处理平台 — <strong>10 次</strong></li>
              </ul>
              <p className="text-xs text-amber-600 mt-2">
                ⏱ 有效期 30 天，过期自动失效 · 每个账号限申请一次
              </p>
            </div>

            {errorMsg && (
              <p className="text-red-500 text-sm text-center mb-4">{errorMsg}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleDecline}
                disabled={loading}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                暂不需要
              </button>
              <button
                onClick={handleAccept}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 font-semibold"
              >
                {loading ? '处理中...' : '立即申请'}
              </button>
            </div>
          </>
        )}

        {/* ---------- 第 2 屏：申请成功 ---------- */}
        {step === 'accepted' && (
          <>
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">✅</div>
              <h2 className="text-xl font-bold text-gray-900">试用码已生成</h2>
              <p className="text-sm text-gray-500 mt-1">
                以下试用码已自动绑定您的账号，请妥善记录
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-4 text-center">
              <code className="text-xl font-bold text-navy-900 tracking-wider">{code}</code>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6 text-sm text-red-700">
              ⚠️ <strong>试用码仅显示一次，请立即复制保存！</strong><br />
              关闭本弹窗后将无法再次查看。
            </div>

            <div className="bg-gray-50 rounded-xl p-3 mb-6 text-xs text-gray-500 space-y-1">
              {(['qiaoxi', 'qiaoyuan', 'cxr', 'chenxi'] as const).map(p => (
                <div key={p} className="flex justify-between">
                  <span>{ICONS[p]} {NAMES[p]}</span>
                  <span className="font-medium">{p === 'chenxi' ? '10 次' : '3 次'}</span>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-1 mt-1 flex justify-between">
                <span>有效期</span><span className="font-medium">30 天</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
            >
              确认并开始使用
            </button>
          </>
        )}

        {/* ---------- 错误屏 ---------- */}
        {step === 'error' && (
          <>
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">⚠️</div>
              <h2 className="text-xl font-bold text-gray-900">操作失败</h2>
              <p className="text-sm text-gray-500 mt-2">{errorMsg || '未知错误'}</p>
            </div>
            <button
              onClick={onClose}
              className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold"
            >
              关闭
            </button>
          </>
        )}
      </div>
    </div>
  )
}
