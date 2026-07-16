'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft } from '@phosphor-icons/react'

interface FullscreenEmbedProps {
  title: string
  url: string
  healthPort?: string
  backHref?: string
}

export function FullscreenEmbed({ title, url, healthPort, backHref = '/products' }: FullscreenEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [serviceReady, setServiceReady] = useState(false)
  const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const mountedRef = useRef(true)

  const servicePort = healthPort || (() => {
    try {
      return new URL(url).port || '80'
    } catch {
      return ''
    }
  })()

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
      .catch(() => {})
  }

  useEffect(() => {
    mountedRef.current = true
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
    if (pollTimer.current) { clearInterval(pollTimer.current) }
    checkHealth()
    pollTimer.current = setInterval(checkHealth, 2000)
    if (iframeRef.current) {
      iframeRef.current.src = `${url}${url.includes('?') ? '&' : '?'}_retry=${retryCount}`
    }
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-white z-50">
      {/* Floating back button — positioned top-right to avoid covering Streamlit's sidebar toggle (top-left) */}
      <Link
        href={backHref}
        className="absolute top-4 right-4 z-[60] flex items-center gap-2 px-3 py-2 bg-navy/80 backdrop-blur-sm text-white rounded-lg hover:bg-navy/95 transition-colors text-sm shadow-lg border border-copper/20"
      >
        <ArrowLeft size={16} weight="bold" />
        <span>返回网站</span>
      </Link>

      {/* Loading overlay */}
      {(!serviceReady || isLoading) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-copper mx-auto mb-4" />
            <p className="text-gray-500">
              {!serviceReady ? '正在启动后端服务，首次启动约需10-20秒...' : '正在加载产品界面...'}
            </p>
            <p className="text-sm text-gray-400 mt-2">请耐心等待</p>
          </div>
        </div>
      )}

      {/* Error overlay */}
      {hasError && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-50">
          <div className="text-center text-red-500 max-w-md mx-auto p-6">
            <div className="text-5xl mb-4">⚠️</div>
            <p className="text-lg font-semibold mb-2">产品服务未能连接</p>
            <p className="text-gray-500 text-sm mb-4">请确认后端服务已正确安装</p>
            <button
              onClick={handleRetry}
              className="px-6 py-2 bg-copper text-navy rounded-lg hover:bg-copper-light transition-colors"
            >
              重试连接
            </button>
          </div>
        </div>
      )}

      {/* Full-screen iframe */}
      <iframe
        ref={iframeRef}
        src={url}
        className="w-full flex-1 border-0"
        title={title}
        allow="camera; microphone; geolocation"
      />
    </div>
  )
}
