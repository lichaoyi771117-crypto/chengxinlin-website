'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

type Status = 'idle' | 'uploading' | 'processing' | 'done' | 'error'

export function CXRAnalyzer() {
  const [file, setFile] = useState<File | null>(null)
  const [taskId, setTaskId] = useState<string | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [])

  const handleUpload = useCallback(async () => {
    if (!file) return
    
    setStatus('uploading')
    setError(null)
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const response = await fetch('/api/cxr/analyze', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('上传失败')
      }
      
      const data = await response.json()
      setTaskId(data.task_id)
      setStatus('processing')
      pollStatus(data.task_id)
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : '上传失败')
    }
  }, [file])

  const pollStatus = async (id: string) => {
    // Clear any existing interval before starting a new one
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    intervalRef.current = setInterval(async () => {
      try {
        const response = await fetch(`/api/cxr/status/${id}`)
        const data = await response.json()

        if (data.status === 'completed') {
          if (intervalRef.current) clearInterval(intervalRef.current)
          if (mountedRef.current) setStatus('done')
        } else if (data.status === 'failed') {
          if (intervalRef.current) clearInterval(intervalRef.current)
          if (mountedRef.current) {
            setStatus('error')
            setError('分析失败，请重试')
          }
        } else {
          if (mountedRef.current) setProgress(data.progress || 0)
        }
      } catch {
        if (intervalRef.current) clearInterval(intervalRef.current)
        if (mountedRef.current) {
          setStatus('error')
          setError('查询状态失败')
        }
      }
    }, 2000)
  }

  const handleDownload = () => {
    if (taskId) {
      window.open(`/api/cxr/download/${taskId}`, '_blank')
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <div className="text-5xl mb-4">🏦</div>
        <h2 className="text-2xl font-bold text-gray-900">AI融资体检</h2>
        <p className="text-gray-600 mt-2">上传征信报告，5分钟获取专业融资建议</p>
      </div>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6 hover:border-blue-400 transition-colors">
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          {file ? (
            <div>
              <p className="text-green-600 font-medium">✓ 已选择文件</p>
              <p className="text-gray-500 text-sm mt-1">{file.name}</p>
            </div>
          ) : (
            <div>
              <p className="text-gray-500">点击或拖拽上传征信报告</p>
              <p className="text-gray-400 text-sm mt-2">支持 PDF、JPG、PNG 格式</p>
            </div>
          )}
        </label>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <Button
        onClick={handleUpload}
        disabled={!file || status === 'uploading' || status === 'processing'}
        className="w-full"
      >
        {status === 'uploading' ? '上传中...' : 
         status === 'processing' ? '分析中...' : '开始分析'}
      </Button>

      {status === 'processing' && (
        <div className="mt-6">
          <div className="bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2 text-center">正在分析中，请稍候...</p>
        </div>
      )}

      {status === 'done' && (
        <div className="mt-6 text-center">
          <Button onClick={handleDownload} variant="copper">
            下载报告
          </Button>
        </div>
      )}
    </Card>
  )
}
