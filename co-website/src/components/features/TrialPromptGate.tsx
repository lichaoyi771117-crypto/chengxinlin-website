'use client'

import { useEffect, useState } from 'react'
import { getCurrentUser } from '@/lib/auth'
import { useTrial } from '@/lib/trial-context'
import { TrialPromptModal } from '@/components/features/TrialPromptModal'

/**
 * 在布局根部挂载：检测登录用户是否试用码候选，弹出试用码申请弹窗。
 * 逻辑：
 *  - 已登录 + 没有授权码绑定 + trial_decline < 3 → 弹提示
 *  - 登录状态变化（login→setUserId）后查询 eligibility
 */
export function TrialPromptGate() {
  const { userId, isVerified, refreshStatus } = useTrial()
  const [showPrompt, setShowPrompt] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (!userId || checked) return

    // 如果已经有 isVerified（比如 Header 里 setUserId 后 status 刷新完成）
    // 不需要弹试用码申请
    if (isVerified) { setChecked(true); return }

    // 延迟一点让 Header 的 setUserId 生效后再请求
    const timer = setTimeout(async () => {
      const user = getCurrentUser()
      if (!user) { setChecked(true); return }

      try {
        const res = await fetch('/api/authcode/trial', {
          headers: { 'x-user-account': user.account },
        })
        const data = await res.json()
        if (data.eligible) {
          // 有资格申请试用码 → 弹窗
          setShowPrompt(true)
        }
      } catch {
        // 静默失败
      }
      setChecked(true)
    }, 800)

    return () => clearTimeout(timer)
  }, [userId, isVerified, checked])

  const handlePromptClose = () => {
    setShowPrompt(false)
    refreshStatus()  // 强制刷新（用户可能接受了试用码）
  }

  if (!showPrompt) return null

  return <TrialPromptModal onClose={handlePromptClose} />
}
