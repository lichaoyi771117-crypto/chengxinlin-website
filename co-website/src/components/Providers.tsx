'use client'

import { TrialProvider } from '@/lib/trial-context'
import type { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return <TrialProvider>{children}</TrialProvider>
}
