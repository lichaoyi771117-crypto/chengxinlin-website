'use client'

import { useEffect, useRef } from 'react'

/**
 * Invisible component that triggers backend service startup
 * as soon as any page loads. Mounted once in root layout.
 */
export function StartupCheck() {
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true

    // Fire and forget — just ping the health endpoint
    fetch('/api/services/health').catch(() => {})
  }, [])

  return null // renders nothing
}
