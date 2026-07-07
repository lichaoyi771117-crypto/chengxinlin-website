'use client'

export interface AuthUser {
  id: number
  account: string
  nickname: string
  role: string
}

const AUTH_KEY = 'cxl_user'

export function getCurrentUser(): AuthUser | null {
  if (typeof window === 'undefined') return null
  const data = localStorage.getItem(AUTH_KEY)
  if (!data) return null
  try {
    return JSON.parse(data)
  } catch {
    return null
  }
}

export function isLoggedIn(): boolean {
  return getCurrentUser() !== null
}

export function isAdmin(): boolean {
  return getCurrentUser()?.role === 'admin'
}

export async function login(account: string, password: string): Promise<{ success: boolean; error?: string; user?: AuthUser }> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ account, password }),
    })
    const data = await res.json()
    if (data.success && data.user) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(data.user))
      return { success: true, user: data.user }
    }
    return { success: false, error: data.error || '登录失败' }
  } catch {
    return { success: false, error: '网络错误' }
  }
}

export async function register(data: {
  account: string
  password: string
  nickname?: string
  phone?: string
  email?: string
}): Promise<{ success: boolean; error?: string; user?: AuthUser }> {
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const result = await res.json()
    if (result.success && result.user) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(result.user))
      return { success: true, user: result.user }
    }
    return { success: false, error: result.error || '注册失败' }
  } catch {
    return { success: false, error: '网络错误' }
  }
}

export function logout() {
  localStorage.removeItem(AUTH_KEY)
}
