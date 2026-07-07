'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { isLoggedIn, isAdmin } from '@/lib/auth'

interface Video {
  slug: string
  title: string
  description: string
  category: string
  date: string
  videoUrl: string
  coverImage: string
  duration: string
}

const categories = ['融资知识', '合同审查', '财务分析', '行业资讯']

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [authorized, setAuthorized] = useState(false)
  const [editing, setEditing] = useState<Video | null>(null)
  const [showForm, setShowForm] = useState(false)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('融资知识')
  const [videoUrl, setVideoUrl] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [duration, setDuration] = useState('')
  const [uploading, setUploading] = useState(false)

  const loadVideos = async () => {
    try {
      const res = await fetch('/api/videos')
      const data = await res.json()
      setVideos(data.videos || [])
    } catch (err) {
      console.error('Failed to load videos:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setAuthorized(isLoggedIn() && isAdmin())
    loadVideos()
  }, [])

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setCategory('融资知识')
    setVideoUrl('')
    setCoverImage('')
    setDuration('')
    setEditing(null)
  }

  const handleNew = () => {
    resetForm()
    setShowForm(true)
  }

  const handleEdit = (video: Video) => {
    setTitle(video.title)
    setDescription(video.description)
    setCategory(video.category)
    setVideoUrl(video.videoUrl)
    setCoverImage(video.coverImage)
    setDuration(video.duration)
    setEditing(video)
    setShowForm(true)
  }

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload/video', { method: 'POST', body: formData })
      if (res.ok) {
        const data = await res.json()
        setVideoUrl(data.url)
      } else {
        const err = await res.json()
        alert('上传失败: ' + (err.error || '未知错误'))
      }
    } catch (err) {
      alert('上传失败: ' + err)
    } finally {
      setUploading(false)
      if (videoInputRef.current) videoInputRef.current.value = ''
    }
  }

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload/image', { method: 'POST', body: formData })
      if (res.ok) {
        const data = await res.json()
        setCoverImage(data.url)
      } else {
        const err = await res.json()
        alert('上传失败: ' + (err.error || '未知错误'))
      }
    } catch (err) {
      alert('上传失败: ' + err)
    } finally {
      if (coverInputRef.current) coverInputRef.current.value = ''
    }
  }

  const handleSave = async () => {
    if (!title.trim() || !videoUrl.trim()) {
      alert('标题和视频不能为空')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category,
          videoUrl,
          coverImage,
          duration,
          slug: editing?.slug,
        }),
      })

      if (res.ok) {
        alert(editing ? '更新成功！' : '发布成功！')
        resetForm()
        setShowForm(false)
        loadVideos()
      } else {
        alert('保存失败')
      }
    } catch (err) {
      alert('保存失败: ' + err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (slug: string) => {
    if (!confirm('确定要删除这个视频吗？')) return
    try {
      await fetch(`/api/videos?slug=${slug}`, { method: 'DELETE' })
      loadVideos()
    } catch {
      alert('删除失败')
    }
  }

  if (!authorized && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <Card>
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔒</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">需要管理员权限</h2>
              <p className="text-gray-500">请使用管理员账号登录后访问此页面</p>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => { setShowForm(false); resetForm() }} className="text-gray-600 hover:text-gray-900">
              ← 返回列表
            </button>
            <div className="flex gap-3">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? '保存中...' : editing ? '更新视频' : '发布视频'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="font-bold text-gray-900 mb-4">视频信息</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">标题 *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="视频标题"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="视频描述"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    {categories.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">时长</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={e => setDuration(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="如 03:45"
                  />
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="font-bold text-gray-900 mb-4">上传文件</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">视频文件 *</label>
                  <Button variant="secondary" size="sm" onClick={() => videoInputRef.current?.click()} disabled={uploading}>
                    {uploading ? '上传中...' : videoUrl ? '更换视频' : '选择视频'}
                  </Button>
                  <input ref={videoInputRef} type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
                  {videoUrl && (
                    <div className="mt-2">
                      <video src={videoUrl} controls className="w-full rounded-lg" />
                      <p className="text-xs text-gray-500 mt-1 truncate">{videoUrl}</p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">封面图片</label>
                  <Button variant="secondary" size="sm" onClick={() => coverInputRef.current?.click()}>
                    {coverImage ? '更换封面' : '选择封面'}
                  </Button>
                  <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                  {coverImage && (
                    <div className="mt-2">
                      <img src={coverImage} alt="封面" className="w-full rounded-lg" />
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">视频管理</h1>
            <p className="text-gray-500 mt-1">管理短视频板块的内容</p>
          </div>
          <Button onClick={handleNew}>+ 新建视频</Button>
        </div>

        {loading ? (
          <Card><p className="text-center py-8 text-gray-500">加载中...</p></Card>
        ) : videos.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🎬</div>
              <p className="text-gray-500 mb-4">暂无视频</p>
              <Button onClick={handleNew}>上传第一个视频</Button>
            </div>
          </Card>
        ) : (
          <Card>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">标题</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 w-24">分类</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 w-28">日期</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600 w-40">操作</th>
                </tr>
              </thead>
              <tbody>
                {videos.map(video => (
                  <tr key={video.slug} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{video.title}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">{video.category}</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">{video.date}</td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={() => handleEdit(video)} className="text-blue-600 hover:text-blue-800 text-sm mr-3">
                        编辑
                      </button>
                      <button onClick={() => handleDelete(video.slug)} className="text-red-500 hover:text-red-700 text-sm">
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    </div>
  )
}
