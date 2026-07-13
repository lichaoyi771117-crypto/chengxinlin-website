'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import { List, X } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'
import { getCurrentUser, isAdmin, login, register, logout, type AuthUser } from '@/lib/auth'
import { useTrial } from '@/lib/trial-context'
import { TrialPromptModal } from '@/components/features/TrialPromptModal'

const navItems = [
  { label: '首页', href: '/' },
  { label: '产品及服务', href: '/services' },
  { label: 'AI产品', href: '/products' },
  { label: '公文处理平台', href: '/products/chenxi' },
  { label: '行业洞察', href: '/insights' },
  { label: '购买授权码', href: '/authorization/purchase' },
  { label: '合作伙伴', href: '/partners' },
  { label: '联系我们', href: '/contact' },
]

type ModalMode = 'login' | 'register'

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number]

const menuVariants = {
  closed: {
    opacity: 0,
    transition: { duration: 0.3, ease: easeOutExpo },
  },
  open: {
    opacity: 1,
    transition: { duration: 0.4, ease: easeOutExpo, staggerChildren: 0.06, delayChildren: 0.1 },
  },
}

const itemVariants = {
  closed: { opacity: 0, y: 20 },
  open: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOutExpo } },
}

export function Header() {
  const { isVerified, remaining, setUserId, refreshStatus, clearTrial } = useTrial()
  const [showTrialModal, setShowTrialModal] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<ModalMode>('login')

  const [loginAccount, setLoginAccount] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  const [regAccount, setRegAccount] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirm, setRegConfirm] = useState('')
  const [regNickname, setRegNickname] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regError, setRegError] = useState('')
  const [regSuccess, setRegSuccess] = useState(false)
  const registerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    setUserId(currentUser?.id || null)
    return () => {
      if (registerTimeoutRef.current) clearTimeout(registerTimeoutRef.current)
    }
  }, [showModal, setUserId])

  // 监听全局登录事件（TrialCodeModal 的"去登录"按钮触发）
  useEffect(() => {
    const handler = () => openLogin()
    window.addEventListener('open-cxl-login', handler)
    return () => window.removeEventListener('open-cxl-login', handler)
  }, [])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isMobileMenuOpen])

  const resetForms = () => {
    setLoginAccount('')
    setLoginPassword('')
    setLoginError('')
    setRegAccount('')
    setRegPassword('')
    setRegConfirm('')
    setRegNickname('')
    setRegPhone('')
    setRegEmail('')
    setRegError('')
    setRegSuccess(false)
  }

  const openLogin = () => { resetForms(); setModalMode('login'); setShowModal(true) }
  const openRegister = () => { resetForms(); setModalMode('register'); setShowModal(true) }

  const handleLogin = async () => {
    setLoginError('')
    const result = await login(loginAccount, loginPassword)
    if (result.success) {
      const currentUser = getCurrentUser()
      setUser(currentUser)
      setUserId(currentUser?.id || null)
      setShowModal(false)
      resetForms()
    } else {
      setLoginError(result.error || '登录失败')
    }
  }

  const handleRegister = async () => {
    setRegError('')
    setRegSuccess(false)
    if (!regAccount || !regPassword) { setRegError('账号和密码不能为空'); return }
    if (regAccount.length < 3) { setRegError('账号至少3个字符'); return }
    if (regPassword.length < 6) { setRegError('密码至少6个字符'); return }
    if (regPassword !== regConfirm) { setRegError('两次密码输入不一致'); return }

    const result = await register({
      account: regAccount, password: regPassword, nickname: regNickname, phone: regPhone, email: regEmail,
    })
    if (result.success) {
      setRegSuccess(true)
      const currentUser = getCurrentUser()
      setUser(currentUser)
      setUserId(currentUser?.id || null)
      // 注册成功后弹出试用码申请
      setShowModal(false)
      setTimeout(() => setShowTrialModal(true), 600)

      registerTimeoutRef.current = setTimeout(() => {
        setModalMode('login'); setLoginAccount(regAccount); setLoginPassword(''); setRegSuccess(false)
      }, 1500)
    } else {
      setRegError(result.error || '注册失败')
    }
  }

  const handleLogout = () => { logout(); setUser(null); setUserId(null); clearTrial() }
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { if (modalMode === 'login') handleLogin(); else handleRegister() }
  }

  const hasTrialRemaining = isVerified && remaining && (remaining.qiaoxi > 0 || remaining.qiaoyuan > 0 || remaining.cxr > 0)

  return (
    <>
      {/* Fixed navy nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-navy/92 backdrop-blur-md border-b border-copper/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 sm:gap-4 lg:gap-8 h-14">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0 mr-2">
              <img src="/logo.jpg" alt="程信霖" className="w-7 h-7 rounded-full object-cover" />
              <span className="text-copper font-serif text-lg font-bold tracking-wider">程信霖</span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-1.5 text-xs text-paper/65 hover:text-copper transition-colors duration-300 tracking-wider"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Right actions */}
            <div className="hidden lg:flex items-center gap-2 ml-2">
              {user ? (
                <>
                  {isAdmin() && (
                    <div className="relative group">
                      <button className="px-3 py-1.5 text-xs text-paper/65 hover:text-copper transition-colors tracking-wider">
                        管理
                      </button>
                      <div className="absolute right-0 mt-1 w-40 bg-navy-light border border-copper/20 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                        <Link href="/admin/articles" className="block px-4 py-2.5 text-xs text-paper/65 hover:text-copper hover:bg-navy/50 transition-colors">文章管理</Link>
                        <Link href="/admin/videos" className="block px-4 py-2.5 text-xs text-paper/65 hover:text-copper hover:bg-navy/50 transition-colors">视频管理</Link>
                        <Link href="/admin/trial" className="block px-4 py-2.5 text-xs text-paper/65 hover:text-copper hover:bg-navy/50 transition-colors">授权码管理</Link>
                      </div>
                    </div>
                  )}
                  <span className="text-xs text-paper/40 max-w-[100px] truncate">{user.nickname || user.account}</span>
                  <button onClick={handleLogout} className="px-3 py-1.5 text-xs text-paper/65 hover:text-copper transition-colors tracking-wider">退出</button>
                </>
              ) : (
                <button onClick={openLogin} className="px-3 py-1.5 text-xs text-paper/65 hover:text-copper transition-colors tracking-wider">登录</button>
              )}

              {hasTrialRemaining ? (
                <Link href="/my/authorization">
                  <div className="flex items-center gap-1.5 bg-copper-dim rounded-full px-3 py-1.5 cursor-pointer hover:bg-copper/20 transition-colors">
                    <span className="text-copper text-xs font-medium">授权</span>
                    <span className="text-copper text-xs font-bold">{remaining!.qiaoxi + remaining!.qiaoyuan + remaining!.cxr}</span>
                  </div>
                </Link>
              ) : user ? (
                <Link href="/authorization/purchase"><Button variant="copper" size="sm">购买授权码</Button></Link>
              ) : (
                <Button variant="copper" size="sm" onClick={openLogin}>登录后体验</Button>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 -mr-1 rounded-full hover:bg-navy-light transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="菜单"
            >
              {isMobileMenuOpen ? (
                <X weight="bold" className="w-5 h-5 text-paper/65" />
              ) : (
                <List weight="bold" className="w-5 h-5 text-paper/65" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 z-40 bg-navy flex flex-col items-center justify-center gap-2 pt-14"
          >
            {navItems.map((item) => (
              <motion.div key={item.href} variants={itemVariants}>
                <Link
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-6 py-3 text-2xl font-serif font-semibold text-paper hover:text-copper transition-colors"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}

            <motion.div variants={itemVariants} className="mt-8 flex flex-col items-center gap-3">
              {user ? (
                <>
                  {isAdmin() && (
                    <div className="flex gap-3">
                      <Link href="/admin/articles" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="secondary" size="sm">文章管理</Button>
                      </Link>
                      <Link href="/admin/videos" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="secondary" size="sm">视频管理</Button>
                      </Link>
                      <Link href="/admin/trial" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="secondary" size="sm">授权码</Button>
                      </Link>
                    </div>
                  )}
                  <Button variant="secondary" size="md" onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}>
                    退出 ({user.nickname || user.account})
                  </Button>
                </>
              ) : (
                <Button variant="copper" size="md" onClick={() => { openLogin(); setIsMobileMenuOpen(false); }}>登录</Button>
              )}

              {hasTrialRemaining ? (
                <Link href="/my/authorization" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="flex items-center gap-2 bg-copper-dim rounded-full px-4 py-2">
                    <span className="text-copper font-medium">{remaining!.qiaoxi + remaining!.qiaoyuan + remaining!.cxr} 次剩余</span>
                  </div>
                </Link>
              ) : user ? (
                <Link href="/authorization/purchase" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="copper" size="md">购买授权码</Button>
                </Link>
              ) : null}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login/Register modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={() => { setShowModal(false); resetForms(); }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded w-full max-w-sm p-8 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <img src="/logo.jpg" alt="程信霖" className="w-12 h-12 rounded-full object-cover mx-auto mb-3" />
                <span className="text-3xl font-serif font-bold text-navy">程信霖</span>
                <p className="text-xs text-slate mt-1 tracking-wider">云南程信霖信息咨询有限公司</p>
              </div>

              {modalMode === 'login' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate mb-1.5 tracking-wider">账号</label>
                    <input type="text" value={loginAccount} onChange={(e) => setLoginAccount(e.target.value)} onKeyDown={handleKeyDown}
                      className="w-full px-4 py-2.5 border border-navy/10 focus:ring-1 focus:ring-copper/30 focus:border-copper outline-none transition-all text-sm"
                      placeholder="管理员账号或注册账号" autoFocus />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate mb-1.5 tracking-wider">密码</label>
                    <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} onKeyDown={handleKeyDown}
                      className="w-full px-4 py-2.5 border border-navy/10 focus:ring-1 focus:ring-copper/30 focus:border-copper outline-none transition-all text-sm"
                      placeholder="请输入密码" />
                  </div>
                  {loginError && <p className="text-red-500 text-sm text-center">{loginError}</p>}
                  <div className="flex gap-3">
                    <Button variant="secondary" size="md" onClick={() => { setShowModal(false); resetForms(); }} className="flex-1">取消</Button>
                    <Button variant="copper" size="md" onClick={handleLogin} className="flex-1">登录</Button>
                  </div>
                  <p className="text-center text-xs text-slate">
                    还没有账号？
                    <button onClick={openRegister} className="text-copper hover:underline ml-1 font-medium">立即注册</button>
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {regSuccess ? (
                    <div className="text-center py-8">
                      <p className="text-lg font-serif font-bold text-navy">注册成功</p>
                      <p className="text-slate text-sm mt-1">正在跳转到登录页面...</p>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-slate mb-1.5 tracking-wider">账号 *</label>
                        <input type="text" value={regAccount} onChange={(e) => setRegAccount(e.target.value)}
                          className="w-full px-4 py-2.5 border border-navy/10 focus:ring-1 focus:ring-copper/30 focus:border-copper outline-none transition-all text-sm"
                          placeholder="手机号或邮箱" autoFocus />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate mb-1.5 tracking-wider">密码 *</label>
                        <input type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)}
                          className="w-full px-4 py-2.5 border border-navy/10 focus:ring-1 focus:ring-copper/30 focus:border-copper outline-none transition-all text-sm"
                          placeholder="至少6个字符" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate mb-1.5 tracking-wider">确认密码 *</label>
                        <input type="password" value={regConfirm} onChange={(e) => setRegConfirm(e.target.value)} onKeyDown={handleKeyDown}
                          className="w-full px-4 py-2.5 border border-navy/10 focus:ring-1 focus:ring-copper/30 focus:border-copper outline-none transition-all text-sm"
                          placeholder="再次输入密码" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate mb-1.5 tracking-wider">昵称</label>
                        <input type="text" value={regNickname} onChange={(e) => setRegNickname(e.target.value)}
                          className="w-full px-4 py-2.5 border border-navy/10 focus:ring-1 focus:ring-copper/30 focus:border-copper outline-none transition-all text-sm"
                          placeholder="选填" />
                      </div>
                      {regError && <p className="text-red-500 text-sm text-center">{regError}</p>}
                      <div className="flex gap-3">
                        <Button variant="secondary" size="md" onClick={() => setModalMode('login')} className="flex-1">返回登录</Button>
                        <Button variant="copper" size="md" onClick={handleRegister} className="flex-1">注册</Button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 试用码申请弹窗（注册后自动弹出） */}
      {showTrialModal && (
        <TrialPromptModal onClose={() => { setShowTrialModal(false); refreshStatus() }} />
      )}
    </>
  )
}
