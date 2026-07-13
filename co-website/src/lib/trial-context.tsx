'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { getCurrentUser } from '@/lib/auth'

export type Product = 'qiaoxi' | 'qiaoyuan' | 'cxr' | 'chenxi'

// 陈曦不限次数时的剩余量哨兵值
export const UNLIMITED = 999999

interface TrialRemaining {
  qiaoxi: number
  qiaoyuan: number
  cxr: number
  chenxi: number
}

interface TrialState {
  code: string | null
  remaining: TrialRemaining | null
  caps: TrialRemaining | null
  maxUses: number | null
  isVerified: boolean
  source: string | null
}

interface TrialContextType extends TrialState {
  setTrialCode: (code: string) => void
  clearTrial: () => void
  refreshStatus: () => Promise<void>
  consumeUse: (product: Product) => Promise<boolean>
  transfer: (from: 'qiaoxi' | 'qiaoyuan' | 'cxr', to: 'qiaoxi' | 'qiaoyuan' | 'cxr', amount: number) => Promise<boolean>
  userId: number | null
  setUserId: (id: number | null) => void
}

const TRIAL_STORAGE_KEY = 'cxl_auth_code'
const TrialContext = createContext<TrialContextType | null>(null)

export function TrialProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TrialState>({
    code: null,
    remaining: null,
    caps: null,
    maxUses: null,
    isVerified: false,
    source: null,
  })
  const [userId, setUserId] = useState<number | null>(null)

  const refreshStatus = useCallback(async () => {
    const code = state.code
    if (!code && !userId) return

    try {
      const res = await fetch('/api/authcode/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, userId }),
      })
      const data = await res.json()

      if (data.hasTrial) {
        setState(prev => ({
          ...prev,
          code: data.code,
          remaining: data.remaining,
          caps: data.caps ?? null,
          maxUses: data.maxUses,
          source: data.source ?? null,
          isVerified: true,
        }))
      } else {
        setState(prev => ({
          ...prev,
          isVerified: false,
          caps: null,
        }))
      }
    } catch (error) {
      console.error('Refresh auth status failed:', error)
    }
  }, [state.code, userId])

  useEffect(() => {
    const savedCode = localStorage.getItem(TRIAL_STORAGE_KEY)
    if (savedCode) {
      setState(prev => ({ ...prev, code: savedCode }))
    }
  }, [])

  useEffect(() => {
    if (state.code || userId) {
      refreshStatus()
    }
  }, [state.code, userId, refreshStatus])

  const setTrialCode = useCallback((code: string) => {
    const normalized = code.trim().toUpperCase()
    localStorage.setItem(TRIAL_STORAGE_KEY, normalized)
    setState(prev => ({ ...prev, code: normalized }))
  }, [])

  const clearTrial = useCallback(() => {
    localStorage.removeItem(TRIAL_STORAGE_KEY)
    setState({
      code: null,
      remaining: null,
      caps: null,
      maxUses: null,
      isVerified: false,
      source: null,
    })
  }, [])

  const consumeUse = useCallback(async (product: Product): Promise<boolean> => {
    if (!state.code) return false

    try {
      const res = await fetch('/api/authcode/use', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: state.code, product, userId }),
      })
      const data = await res.json()

      if (data.success) {
        setState(prev => ({
          ...prev,
          remaining: data.remaining,
        }))
        return true
      }
      return false
    } catch {
      return false
    }
  }, [state.code, userId])

  const transfer = useCallback(async (
    from: 'qiaoxi' | 'qiaoyuan' | 'cxr',
    to: 'qiaoxi' | 'qiaoyuan' | 'cxr',
    amount: number
  ): Promise<boolean> => {
    if (!state.code) return false
    try {
      const account = getCurrentUser()?.account || ''
      const res = await fetch('/api/authcode/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-account': account },
        body: JSON.stringify({ code: state.code, from, to, amount, userId }),
      })
      const data = await res.json()
      if (data.success) {
        setState(prev => ({
          ...prev,
          remaining: data.remaining,
        }))
        return true
      }
      return false
    } catch {
      return false
    }
  }, [state.code, userId])

  return (
    <TrialContext.Provider value={{
      ...state,
      setTrialCode,
      clearTrial,
      refreshStatus,
      consumeUse,
      transfer,
      userId,
      setUserId,
    }}>
      {children}
    </TrialContext.Provider>
  )
}

export function useTrial() {
  const ctx = useContext(TrialContext)
  if (!ctx) throw new Error('useTrial must be used within TrialProvider')
  return ctx
}
