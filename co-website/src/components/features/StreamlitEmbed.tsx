'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowsIn, ArrowsOut } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'

interface StreamlitEmbedProps {
  title: string
  description: string
  url: string
  icon: string
  /** Local service port for health-check matching. Required when `url` uses a tunnel/proxy (e.g. cloudflared) so the component can still match the correct backend. */
  healthPort?: string
  /** Whether the embed is currently in fullscreen mode */
  fullscreen?: boolean
  /** Callback when user toggles fullscreen */
  onToggleFullscreen?: (fullscreen: boolean) => void
}

export function StreamlitEmbed({ title, description, url, icon, healthPort, fullscreen = false, onToggleFullscreen }: StreamlitEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [serviceReady, setServiceReady] = useState(false)
  const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const mountedRef = useRef(true)

  // Use explicit healthPort if provided, otherwise try to extract from URL
  const servicePort = healthPort || (() => {
    try {
      return new URL(url).port || '80'
    } catch {
      return ''
    }
  })()

  // Poll health endpoint until our service is running
  const checkHealth = () => {
    fetch('/api/services/health')
      .then(res => res.json())
      .then(data => {
        if (!mountedRef.current) return
        const myService = data.services?.find((s: { port: number }) => String(s.port) === servicePort)
        if (myService?.status === 'running') {
          setServiceReady(true)
          if (pollTimer.current) {
            clearInterval(pollTimer.current)
            pollTimer.current = null
          }
        }
      })
      .catch(() => {}) // silently retry
  }

  useEffect(() => {
    mountedRef.current = true

    // Immediate check + poll every 2 seconds
    checkHealth()
    pollTimer.current = setInterval(checkHealth, 2000)

    return () => {
      mountedRef.current = false
      if (pollTimer.current) {
        clearInterval(pollTimer.current)
        pollTimer.current = null
      }
    }
  }, [url])

  // Load iframe once service is ready
  useEffect(() => {
    if (!serviceReady) return

    const iframe = iframeRef.current
    if (!iframe) return

    const handleLoad = () => { if (mountedRef.current) setIsLoading(false) }
    const handleError = () => {
      if (mountedRef.current) { setHasError(true); setIsLoading(false) }
    }

    iframe.addEventListener('load', handleLoad)
    iframe.addEventListener('error', handleError)

    const timeout = setTimeout(() => { if (mountedRef.current) setIsLoading(false) }, 5000)

    return () => {
      iframe.removeEventListener('load', handleLoad)
      iframe.removeEventListener('error', handleError)
      clearTimeout(timeout)
    }
  }, [serviceReady])

  const handleRetry = () => {
    setIsLoading(true)
    setHasError(false)
    setServiceReady(false)
    setRetryCount(prev => prev + 1)

    // Restart polling
    if (pollTimer.current) { clearInterval(pollTimer.current) }
    checkHealth()
    pollTimer.current = setInterval(checkHealth, 2000)

    if (iframeRef.current) {
      iframeRef.current.src = `${url}${url.includes('?') ? '&' : '?'}_retry=${retryCount}`
    }
  }

  const containerClass = fullscreen
    ? 'fixed inset-0 z-50 flex flex-col bg-white'
    : 'bg-white rounded-xl shadow-md overflow-hidden'

  const headerClass = fullscreen
    ? 'bg-navy text-paper p-3 flex items-center justify-between'
    : 'bg-navy text-paper p-6'

  return (
    <div className={containerClass}>
      {/* Header */}
      <div className={headerClass}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{icon}</span>
          <div>
            <h2 className="text-2xl font-bold text-paper">{title}</h2>
            {!fullscreen && <p className="text-paper/70">{description}</p>}
          </div>
        </div>
        {/* Fullscreen toggle button */}
        {onToggleFullscreen && (
          <Button
            variant="copper"
            size="sm"
            onClick={() => onToggleFullscreen(!fullscreen)}
            className="whitespace-nowrap"
          >
            {fullscreen ? (
              <>
                <ArrowsIn size={14} className="mr-1" weight="bold" />
                退出全屏
              </>
            ) : (
              <>
                <ArrowsOut size={14} className="mr-1" weight="bold" />
                全屏使用
              </>
            )}
          </Button>
        )}
      </div>

      {/* iframe Content */}
      <div className="relative flex-1" style={{ minHeight: fullscreen ? undefined : '600px' }}>
        {(!serviceReady || isLoading) && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-copper mx-auto mb-4" />
              <p className="text-gray-500">
                {!serviceReady ? '正在启动后端服务，首次启动约需10-20秒...' : '正在加载产品界面...'}
              </p>
              <p className="text-sm text-gray-400 mt-2">请耐心等待</p>
            </div>
          </div>
        )}

        {hasError && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
            <div className="text-center text-red-500 max-w-md mx-auto p-6">
              <div className="text-5xl mb-4">⚠️</div>
              <p className="text-lg font-semibold mb-2">产品服务未能连接</p>
              <p className="text-gray-500 text-sm mb-4">
                请确认后端服务已正确安装
              </p>
              <button
                onClick={handleRetry}
                className="px-6 py-2 bg-copper text-navy rounded-lg hover:bg-copper-light transition-colors"
              >
                重试连接
              </button>
            </div>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={url}
          className="w-full border-0"
          style={{ minHeight: fullscreen ? '100%' : '600px', height: fullscreen ? '100%' : undefined }}
          title={title}
          allow="camera; microphone; geolocation"
        />
      </div>
    </div>
  )
}
