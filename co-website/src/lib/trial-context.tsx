'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

interface TrialState {
  code: string | null
  remaining: {
    qiaoxi: number
    qiaoyuan: number
    cxr: number
  } | null
  maxUses: number | null
  isVerified: boolean
}

interface TrialContextType extends TrialState {
  setTrialCode: (code: string) => void
  clearTrial: () => void
  refreshStatus: () => Promise<void>
  consumeUse: (product: 'qiaoxi' | 'qiaoyuan' | 'cxr') => Promise<boolean>
  userId: number | null
  setUserId: (id: number | null) => void
}

const TRIAL_STORAGE_KEY = 'cxl_trial_code'
const TrialContext = createContext<TrialContextType | null>(null)

export function TrialProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TrialState>({
    code: null,
    remaining: null,
    maxUses: null,
    isVerified: false,
  })
  const [userId, setUserId] = useState<number | null>(null)

  const refreshStatus = useCallback(async () => {
    const code = state.code
    if (!code && !userId) return

    try {
      const res = await fetch('/api/trial/status', {
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
          maxUses: data.maxUses,
          isVerified: true,
        }))
      } else {
        setState(prev => ({
          ...prev,
          isVerified: false,
        }))
      }
    } catch (error) {
      console.error('Refresh trial status failed:', error)
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
      maxUses: null,
      isVerified: false,
    })
  }, [])

  const consumeUse = useCallback(async (product: 'qiaoxi' | 'qiaoyuan' | 'cxr'): Promise<boolean> => {
    if (!state.code) return false

    try {
      const res = await fetch('/api/trial/use', {
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

  return (
    <TrialContext.Provider value={{
      ...state,
      setTrialCode,
      clearTrial,
      refreshStatus,
      consumeUse,
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
