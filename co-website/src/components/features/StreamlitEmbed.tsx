'use client'

import { useState, useEffect, useRef } from 'react'

interface StreamlitEmbedProps {
  title: string
  description: string
  url: string
  icon: string
}

export function StreamlitEmbed({ title, description, url, icon }: StreamlitEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [serviceReady, setServiceReady] = useState(false)
  const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const mountedRef = useRef(true)

  // Extract port from URL to identify this service
  const servicePort = (() => {
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

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{icon}</span>
          <div>
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="text-blue-100">{description}</p>
          </div>
        </div>
      </div>

      {/* iframe Content */}
      <div className="relative" style={{ minHeight: '600px' }}>
        {(!serviceReady || isLoading) && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
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
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
          style={{ minHeight: '600px' }}
          title={title}
          allow="camera; microphone; geolocation"
        />
      </div>
    </div>
  )
}
