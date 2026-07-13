'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'

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

const categories = ['全部', '融资知识', '合同审查', '财务分析', '行业资讯']

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('全部')
  const [loggedIn, setLoggedIn] = useState(false)
  const [playingVideo, setPlayingVideo] = useState<Video | null>(null)

  useEffect(() => {
    setLoggedIn(!!getCurrentUser())
    fetch('/api/videos')
      .then(res => res.json())
      .then(data => {
        setVideos(data.videos || [])
        setLoading(false)
      })
      .catch(() => {
        setVideos([])
        setLoading(false)
      })
  }, [])

  const filtered = activeCategory === '全部'
    ? videos
    : videos.filter(v => v.category === activeCategory)

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 relative">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">短视频</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            融资知识 · 财务分析 · 行业资讯
          </p>
          {loggedIn && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              <Link href="/admin/videos">
                <Button variant="copper" size="sm">管理视频</Button>
              </Link>
            </div>
          )}
        </div>

        {/* 分类筛选 */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-blue-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <Card><p className="text-center py-8 text-gray-500">加载中...</p></Card>
        ) : filtered.length === 0 ? (
          <Card>
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎬</div>
              <p className="text-gray-500 text-lg">暂无视频</p>
              {loggedIn ? (
                <Link href="/admin/videos" className="mt-4 inline-block">
                  <Button>上传第一个视频</Button>
                </Link>
              ) : (
                <p className="text-sm text-gray-400 mt-2">敬请期待</p>
              )}
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(video => (
              <Card key={video.slug} className="cursor-pointer hover:shadow-xl transition-shadow overflow-hidden">
                <div onClick={() => setPlayingVideo(video)}>
                  <div className="aspect-video bg-gray-900 relative group">
                    {video.coverImage ? (
                      <img src={video.coverImage} alt={video.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-5xl text-gray-600">▶</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center">
                        <span className="text-blue-900 text-2xl ml-1">▶</span>
                      </div>
                    </div>
                    {video.duration && (
                      <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        {video.category}
                      </span>
                      <span className="text-gray-400 text-xs">{video.date}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 line-clamp-2">{video.title}</h3>
                    {video.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{video.description}</p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* 视频播放弹窗 */}
      {playingVideo && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4" onClick={() => setPlayingVideo(null)}>
          <div className="w-full max-w-4xl relative" onClick={e => e.stopPropagation()}>
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <video
                src={playingVideo.videoUrl}
                controls
                autoPlay
                className="w-full h-full"
              />
            </div>
            <div className="mt-4 text-white">
              <h3 className="text-xl font-bold">{playingVideo.title}</h3>
              {playingVideo.description && (
                <p className="text-gray-300 mt-2">{playingVideo.description}</p>
              )}
            </div>
            <button
              onClick={() => setPlayingVideo(null)}
              className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
