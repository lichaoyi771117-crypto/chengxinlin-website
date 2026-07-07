'use client'

import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { isLoggedIn } from '@/lib/auth'

export default function InsightsPage() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [loggedIn, setLoggedIn] = useState(false)
  const mountedRef = useRef(true)

  const videoCategories = [
    { name: '融资知识', count: 12 },
    { name: '合同审查', count: 8 },
    { name: '财务分析', count: 6 },
    { name: '行业资讯', count: 15 },
  ]

  useEffect(() => {
    mountedRef.current = true
    setLoggedIn(isLoggedIn())
    fetch('/api/articles')
      .then(res => res.json())
      .then(data => {
        if (mountedRef.current) {
          setArticles(data.articles || [])
          setLoading(false)
        }
      })
      .catch(() => {
        if (mountedRef.current) {
          setArticles([])
          setLoading(false)
        }
      })

    return () => {
      mountedRef.current = false
    }
  }, [])

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 relative">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">行业洞察</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            深度分析 · 专业见解 · 助您决策
          </p>

          {/* 管理员编辑按钮 */}
          {loggedIn && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              <Link href="/admin/articles">
                <Button variant="copper" size="sm">
                  📝 管理文章
                </Button>
              </Link>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">最新文章</h2>
              {loggedIn && (
                <Link href="/admin/articles">
                  <span className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                    + 发布新文章
                  </span>
                </Link>
              )}
            </div>

            {loading ? (
              <Card>
                <p className="text-center py-8 text-gray-500">加载中...</p>
              </Card>
            ) : articles.length === 0 ? (
              <Card>
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">暂无文章</p>
                  {loggedIn ? (
                    <Link href="/admin/articles">
                      <Button>发布第一篇文章</Button>
                    </Link>
                  ) : (
                    <p className="text-sm text-gray-400">敬请期待</p>
                  )}
                </div>
              </Card>
            ) : (
              <div className="space-y-6">
                {articles.map((article: any) => (
                  <Link key={article.slug} href={`/insights/${article.slug}`}>
                    <Card className="cursor-pointer hover:shadow-xl">
                      <div className="flex items-start gap-4">
                        {article.coverImage && (
                          <div className="w-28 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                            <img src={article.coverImage} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                              {article.category}
                            </span>
                            <span className="text-gray-400 text-sm">{article.date}</span>
                            <span className="text-gray-400 text-sm">· {article.readTime}</span>
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-blue-600">
                            {article.title}
                          </h3>
                          <p className="text-gray-600 text-sm">{article.excerpt}</p>
                        </div>
                        {!article.coverImage && (
                          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                            <span className="text-3xl">📄</span>
                          </div>
                        )}
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Categories */}
            <Card>
              <h3 className="font-bold text-gray-900 mb-4">内容分类</h3>
              <div className="space-y-2">
                {videoCategories.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-gray-700">{cat.name}</span>
                    <span className="text-gray-400 text-sm">{cat.count}篇</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Videos */}
            <Card>
              <h3 className="font-bold text-gray-900 mb-4">短视频精选</h3>
              <Link href="/videos" className="block text-center py-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
                查看全部视频 →
              </Link>
            </Card>

            {/* Tags */}
            <Card>
              <h3 className="font-bold text-gray-900 mb-4">热门标签</h3>
              <div className="flex flex-wrap gap-2">
                {['融资', '贷款', '征信', '合同', '财务', '小微企业', '银行', 'AI'].map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-blue-100 hover:text-blue-700 cursor-pointer transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </Card>

            {/* Follow Us */}
            <Card className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
              <h3 className="font-bold mb-3">关注我们</h3>
              <p className="text-blue-100 text-sm mb-4">获取最新融资资讯和AI产品动态</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span>💬</span>
                  <span>微信公众号：程信霖融途</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span>🎵</span>
                  <span>抖音：[待补充]</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
