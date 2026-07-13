'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { register } from '@/lib/auth'
import { Button } from '@/components/ui/Button'

export default function RegisterPage() {
  const router = useRouter()
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [busy, setBusy] = useState(false)

  const handleRegister = async () => {
    setError('')
    if (!account || !password) { setError('账号和密码不能为空'); return }
    if (account.length < 3) { setError('账号至少3个字符'); return }
    if (password.length < 6) { setError('密码至少6个字符'); return }
    if (password !== confirm) { setError('两次密码输入不一致'); return }

    setBusy(true)
    const result = await register({ account, password, nickname })
    setBusy(false)

    if (result.success) {
      setSuccess(true)
      setTimeout(() => router.push('/'), 1500)
    } else {
      setError(result.error || '注册失败')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4">
      <div className="bg-white border border-navy/10 p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <img src="/logo.jpg" alt="程信霖" className="w-12 h-12 rounded-full object-cover mx-auto mb-3" />
          <h1 className="text-xl font-serif font-bold text-navy">注册账号</h1>
          <p className="text-xs text-navy/70 mt-1">云南程信霖信息咨询有限公司</p>
        </div>

        {success ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">✅</div>
            <p className="text-lg font-bold text-navy">注册成功！</p>
            <p className="text-navy/70 mt-2">正在跳转到首页...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-navy mb-1">账号 *</label>
              <input type="text" value={account} onChange={e => setAccount(e.target.value)}
                className="w-full px-4 py-3 border border-navy/10 focus:border-copper focus:ring-1 focus:ring-copper/30 outline-none text-sm"
                placeholder="手机号或邮箱" autoFocus />
            </div>
            <div>
              <label className="block text-xs font-medium text-navy mb-1">密码 *</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-navy/10 focus:border-copper focus:ring-1 focus:ring-copper/30 outline-none text-sm"
                placeholder="至少6个字符" />
            </div>
            <div>
              <label className="block text-xs font-medium text-navy mb-1">确认密码 *</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleRegister()}
                className="w-full px-4 py-3 border border-navy/10 focus:border-copper focus:ring-1 focus:ring-copper/30 outline-none text-sm"
                placeholder="再次输入密码" />
            </div>
            <div>
              <label className="block text-xs font-medium text-navy mb-1">昵称</label>
              <input type="text" value={nickname} onChange={e => setNickname(e.target.value)}
                className="w-full px-4 py-3 border border-navy/10 focus:border-copper focus:ring-1 focus:ring-copper/30 outline-none text-sm"
                placeholder="选填" />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <Button variant="copper" className="w-full" onClick={handleRegister} disabled={busy}>
              {busy ? '注册中...' : '注册'}
            </Button>
            <p className="text-center text-xs text-navy/70">
              已有账号？<a href="/" className="text-copper hover:underline">去登录</a>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
