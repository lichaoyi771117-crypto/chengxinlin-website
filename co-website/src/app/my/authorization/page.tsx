'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { useTrial, UNLIMITED, type Product } from '@/lib/trial-context'

type LimitProduct = 'qiaoxi' | 'qiaoyuan' | 'cxr'
const LIMIT_PRODUCTS: LimitProduct[] = ['qiaoxi', 'qiaoyuan', 'cxr']
const LABELS: Record<Product, string> = { qiaoxi: '乔曦', qiaoyuan: '峤远', cxr: '程晓融', chenxi: '陈曦' }
const ICONS: Record<Product, string> = { qiaoxi: '⚖️', qiaoyuan: '📊', cxr: '🏦', chenxi: '📝' }

export default function MyAuthorizationPage() {
  const router = useRouter()
  const { isVerified, remaining, caps, code, source, transfer, refreshStatus } = useTrial()
  const [checked, setChecked] = useState(false)
  const [from, setFrom] = useState<LimitProduct>('qiaoxi')
  const [to, setTo] = useState<LimitProduct>('qiaoyuan')
  const [amount, setAmount] = useState(1)
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      setChecked(true)
      return
    }
    refreshStatus().finally(() => setChecked(true))
  }, [refreshStatus])

  if (!checked) {
    return <div className="py-20 text-center text-gray-500">加载中...</div>
  }

  if (!getCurrentUser()) {
    return (
      <div className="py-20 text-center">
        <div className="text-5xl mb-4">🔐</div>
        <p className="text-gray-600 mb-6">请先登录后查看您的授权码</p>
        <button onClick={() => router.push('/')} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">去登录</button>
      </div>
    )
  }

  if (!isVerified) {
    return (
      <div className="py-20 text-center">
        <div className="text-5xl mb-4">🎁</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">您还没有授权码</h2>
        <p className="text-gray-500 mb-6">购买或向管理员获取授权码后即可使用全部产品。</p>
        <div className="flex justify-center gap-4">
          <Link href="/authorization/purchase" className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">购买授权码</Link>
          <Link href="/products" className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">查看产品</Link>
        </div>
      </div>
    )
  }

  const handleTransfer = async () => {
    setMsg(null)
    if (from === to) { setMsg({ type: 'err', text: '源产品与目标产品不能相同' }); return }
    setBusy(true)
    const ok = await transfer(from, to, amount)
    setBusy(false)
    if (ok) {
      setMsg({ type: 'ok', text: `已将从「${LABELS[from]}」划转 ${amount} 次到「${LABELS[to]}」` })
    } else {
      setMsg({ type: 'err', text: '划转失败：源产品剩余次数不足或参数有误' })
    }
  }

  return (
    <div className="py-16 bg-warm-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-navy-900">我的授权码</h1>
          <p className="text-warm-500 mt-2">授权码 <span className="font-mono">{code}</span>{source === 'paid' ? '（付费购买）' : '（管理员发放）'}</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-8 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">各产品剩余次数</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(['qiaoxi', 'qiaoyuan', 'cxr', 'chenxi'] as Product[]).map(p => {
              const cap = caps?.[p] ?? 0
              const rem = remaining?.[p] ?? 0
              const unlimited = p === 'chenxi'
              return (
                <div key={p} className="bg-gray-50 rounded-xl p-4 text-center">
                  <div className="text-3xl mb-1">{ICONS[p]}</div>
                  <div className="text-sm text-gray-500">{LABELS[p]}</div>
                  <div className={`text-xl font-bold mt-1 ${unlimited ? 'text-blue-600' : (rem <= 0 ? 'text-red-500' : 'text-green-600')}`}>
                    {unlimited ? '不限' : `${rem} 次`}
                  </div>
                  {!unlimited && <div className="text-xs text-gray-400 mt-1">上限 {cap}</div>}
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-1">次数划转</h2>
          <p className="text-sm text-gray-500 mb-6">
            当某产品次数用完、而其它产品还有剩余时，可将剩余次数划转到需要使用的产品（陈曦不限次数，不参与划转）。
          </p>

          <div className="grid md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">从（源产品）</label>
              <select value={from} onChange={e => setFrom(e.target.value as LimitProduct)} className="w-full px-4 py-3 border border-gray-300 rounded-lg">
                {LIMIT_PRODUCTS.map(p => {
                  const rem = (remaining?.[p] ?? 0)
                  return <option key={p} value={p} disabled={rem <= 0}>{LABELS[p]}（剩 {rem}）</option>
                })}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">到（目标产品）</label>
              <select value={to} onChange={e => setTo(e.target.value as LimitProduct)} className="w-full px-4 py-3 border border-gray-300 rounded-lg">
                {LIMIT_PRODUCTS.map(p => <option key={p} value={p} disabled={p === from}>{LABELS[p]}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">次数</label>
              <input
                type="number" min="1" max={remaining?.[from] ?? 0} value={amount}
                onChange={e => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {msg && (
            <p className={`text-sm mt-4 ${msg.type === 'ok' ? 'text-green-600' : 'text-red-500'}`}>{msg.text}</p>
          )}

          <button
            onClick={handleTransfer}
            disabled={busy || (remaining?.[from] ?? 0) <= 0}
            className="mt-6 w-full px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {busy ? '划转中...' : '确认划转'}
          </button>
        </div>

        <div className="text-center mt-8">
          <Link href="/products" className="text-navy-700 hover:underline text-sm">返回产品矩阵</Link>
        </div>
      </div>
    </div>
  )
}
