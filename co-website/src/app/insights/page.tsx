'use client'

import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Article, CalendarDots, ArrowRight, ArrowLeft } from '@phosphor-icons/react'

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number]

interface WeChatArticle {
  title: string
  digest: string
  url: string
  thumb_url: string
  create_time: number
  article_id: string
}

export default function InsightsPage() {
  const [articles, setArticles] = useState<WeChatArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)
  const pageSize = 20

  useEffect(() => {
    setLoading(true)
    setError('')
    fetch(`/api/wechat/articles?offset=${page * pageSize}&count=${pageSize}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setArticles(data.articles || [])
          setTotal(data.total_count || 0)
        } else {
          setError(data.error || '加载失败')
        }
      })
      .catch(() => setError('网络错误'))
      .finally(() => setLoading(false))
  }, [page])

  return (
    <div className="pt-28 pb-16 min-h-screen bg-paper">
      <div className="max-w-[860px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeOutExpo }}
          className="text-center mb-16"
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOutExpo, delay: 0.1 }}
            className="text-xs font-medium tracking-[0.22em] uppercase text-copper mb-4"
          >
            行业洞察
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOutExpo, delay: 0.15 }}
            className="font-serif text-3xl md:text-4xl font-bold text-navy mb-4"
          >
            行业洞察
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOutExpo, delay: 0.25 }}
            className="text-base text-navy max-w-[560px] mx-auto leading-relaxed"
          >
            来自「程信霖融途」微信公众号的专业内容
          </motion.p>
        </motion.div>

        {/* Article list */}
        {loading ? (
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex gap-5 p-6 bg-white border border-navy/[0.06]">
                <div className="w-28 h-28 bg-navy/[0.06] shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-navy/[0.06] rounded w-3/4" />
                  <div className="h-3 bg-navy/[0.04] rounded w-1/4" />
                  <div className="h-4 bg-navy/[0.04] rounded w-full" />
                  <div className="h-4 bg-navy/[0.04] rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <Article weight="thin" className="w-16 h-16 text-slate-light mx-auto mb-4" />
            <p className="text-navy font-normal mb-2">暂时无法获取文章列表</p>
            <p className="text-sm text-slate-light">{error}</p>
          </motion.div>
        ) : articles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <Article weight="thin" className="w-16 h-16 text-slate-light mx-auto mb-4" />
            <p className="text-navy font-normal">暂无文章</p>
            <p className="text-sm text-slate-light mt-1">关注「程信霖融途」微信公众号获取最新内容</p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {articles.map((article, i) => (
              <motion.article
                key={article.article_id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: easeOutExpo, delay: i * 0.06 }}
              >
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex gap-5 p-6 bg-white border border-navy/[0.06] hover:border-copper/30 transition-all duration-500"
                >
                  {/* Thumbnail */}
                  <div className="w-28 h-28 shrink-0 overflow-hidden bg-navy/[0.03]">
                    {article.thumb_url ? (
                      <img
                        src={article.thumb_url.replace('http://', 'https://')}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Article weight="thin" className="w-8 h-8 text-slate-light/40" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h2 className="font-serif text-lg font-bold text-navy group-hover:text-copper transition-colors duration-300 line-clamp-2">
                      {article.title}
                    </h2>
                    <p className="flex items-center gap-1.5 text-xs text-slate-light mt-2">
                      <CalendarDots weight="bold" className="w-3.5 h-3.5" />
                      {new Date(article.create_time * 1000).toLocaleDateString('zh-CN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    {article.digest && (
                      <p className="text-sm text-navy leading-relaxed mt-2 line-clamp-2">
                        {article.digest}
                      </p>
                    )}
                  </div>
                </a>
              </motion.article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {total > pageSize && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center items-center gap-4 mt-12"
          >
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="flex items-center gap-1.5 px-4 py-2 text-xs text-navy border border-navy/[0.12] disabled:opacity-30 hover:border-copper/40 transition-all"
            >
              <ArrowLeft weight="bold" className="w-3.5 h-3.5" />
              上一页
            </button>
            <span className="text-xs text-slate-light">
              {page + 1} / {Math.ceil(total / pageSize)}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={(page + 1) * pageSize >= total}
              className="flex items-center gap-1.5 px-4 py-2 text-xs text-navy border border-navy/[0.12] disabled:opacity-30 hover:border-copper/40 transition-all"
            >
              下一页
              <ArrowRight weight="bold" className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}

        {/* Follow CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeOutExpo, delay: 0.5 }}
          className="text-center mt-16 pt-12 border-t border-navy/[0.06]"
        >
          <p className="text-sm text-navy font-normal">
            关注微信公众号 <strong className="text-copper font-medium">「程信霖融途」</strong>
            ，获取最新行业洞察与专业分析
          </p>
        </motion.div>
      </div>
    </div>
  )
}
