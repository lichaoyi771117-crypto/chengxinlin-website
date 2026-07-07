'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { isLoggedIn, isAdmin } from '@/lib/auth'

interface Article {
  slug: string
  title: string
  category: string
  date: string
  author: string
  coverImage?: string
}

interface UploadedImage {
  url: string
  filename: string
}

export default function AdminArticlesPage() {
  const [viewMode, setViewMode] = useState<'list' | 'edit'>('list')
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [authorized, setAuthorized] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const editorRef = useRef<HTMLDivElement>(null)

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('行业洞察')
  const [author, setAuthor] = useState('程信霖融途')
  const [excerpt, setExcerpt] = useState('')
  const [readTime, setReadTime] = useState('5分钟')
  const [tags, setTags] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [imageUploading, setImageUploading] = useState(false)
  const [pendingContent, setPendingContent] = useState('')

  const loadArticles = async () => {
    try {
      const res = await fetch('/api/articles')
      const data = await res.json()
      setArticles(data.articles || [])
    } catch (err) {
      console.error('Failed to load articles:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setAuthorized(isLoggedIn() && isAdmin())
    loadArticles()
  }, [])

  useEffect(() => {
    if (pendingContent && editorRef.current) {
      editorRef.current.innerHTML = pendingContent
      setPendingContent('')
    }
  }, [pendingContent, viewMode])

  const resetForm = () => {
    setTitle('')
    setCategory('行业洞察')
    setAuthor('程信霖融途')
    setExcerpt('')
    setReadTime('5分钟')
    setTags('')
    setCoverImage('')
    setUploadedImages([])
    setPendingContent('')
    if (editorRef.current) {
      editorRef.current.innerHTML = ''
    }
  }

  const handleNew = () => {
    resetForm()
    setViewMode('edit')
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const isDocx = file.name.endsWith('.docx')
    if (!isDocx) {
      alert('请选择Word文档（.docx格式）')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/articles/convert', { method: 'POST', body: formData })
      if (res.ok) {
        const data = await res.json()
        setTitle(data.title || file.name.replace(/\.docx?$/i, ''))
        setPendingContent(data.content || '')
        setViewMode('edit')
        alert('Word文档已转换成功！请检查内容后点击"发布文章"。')
      } else {
        const err = await res.json()
        alert('转换失败: ' + (err.error || '未知错误'))
      }
    } catch (err) {
      alert('转换失败: ' + err)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload/image', { method: 'POST', body: formData })
      if (res.ok) {
        const data = await res.json()
        const newImage: UploadedImage = { url: data.url, filename: data.filename }
        setUploadedImages(prev => [...prev, newImage])
        insertImageToEditor(data.url)
      } else {
        const err = await res.json()
        alert('上传失败: ' + (err.error || '未知错误'))
      }
    } catch (err) {
      alert('上传失败: ' + err)
    } finally {
      setImageUploading(false)
      if (imageInputRef.current) imageInputRef.current.value = ''
    }
  }, [])

  const insertImageToEditor = (imageUrl: string) => {
    const editor = editorRef.current
    if (!editor) return

    editor.focus()

    const img = document.createElement('img')
    img.src = imageUrl
    img.alt = '配图'
    img.className = 'max-w-full rounded-lg my-4 cursor-pointer hover:opacity-80'
    img.style.maxHeight = '400px'
    img.style.display = 'block'
    img.style.margin = '16px auto'

    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      if (editor.contains(range.commonAncestorContainer)) {
        range.deleteContents()
        range.insertNode(img)

        const br = document.createElement('br')
        range.setStartAfter(img)
        range.setEndAfter(img)
        range.insertNode(br)

        range.setStartAfter(br)
        range.setEndAfter(br)
        selection.removeAllRanges()
        selection.addRange(range)
      } else {
        editor.appendChild(img)
        editor.appendChild(document.createElement('br'))
      }
    } else {
      editor.appendChild(img)
      editor.appendChild(document.createElement('br'))
    }
  }

  const insertImageFromLibrary = (imageUrl: string) => {
    insertImageToEditor(imageUrl)
  }

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault()
        const file = items[i].getAsFile()
        if (file) {
          const fakeEvent = { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>
          handleImageUpload(fakeEvent)
        }
        return
      }
    }
  }, [handleImageUpload])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      const fakeEvent = { target: { files: [files[0]] } } as unknown as React.ChangeEvent<HTMLInputElement>
      handleImageUpload(fakeEvent)
    }
  }, [handleImageUpload])

  const handleSave = async () => {
    if (!title.trim() || !editorRef.current) {
      alert('标题不能为空')
      return
    }

    const htmlContent = editorRef.current.innerHTML
    if (!htmlContent || htmlContent === '<br>' || htmlContent === '<p><br></p>') {
      alert('内容不能为空')
      return
    }

    const markdownContent = htmlToMarkdown(htmlContent)

    setSaving(true)
    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          author,
          excerpt,
          readTime,
          tags: tags.split(/[,，、]/).map(t => t.trim()).filter(Boolean),
          content: markdownContent,
          coverImage,
        }),
      })

      if (res.ok) {
        alert('发布成功！')
        resetForm()
        setViewMode('list')
        loadArticles()
      } else {
        alert('发布失败')
      }
    } catch (err) {
      alert('发布失败: ' + err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (slug: string) => {
    if (!confirm('确定要删除这篇文章吗？')) return
    try {
      await fetch(`/api/articles?slug=${slug}`, { method: 'DELETE' })
      loadArticles()
    } catch {
      alert('删除失败')
    }
  }

  const htmlToMarkdown = (html: string): string => {
    let md = html
    md = md.replace(/<div[^>]*>/gi, '\n')
    md = md.replace(/<\/div>/gi, '')
    md = md.replace(/<p[^>]*>/gi, '\n')
    md = md.replace(/<\/p>/gi, '')
    md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n')
    md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n')
    md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n')
    md = md.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n')
    md = md.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    md = md.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
    md = md.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
    md = md.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
    md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
    md = md.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '![$2]($1)')
    md = md.replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, '![]($1)')
    md = md.replace(/<ul[^>]*>/gi, '')
    md = md.replace(/<\/ul>/gi, '\n')
    md = md.replace(/<ol[^>]*>/gi, '')
    md = md.replace(/<\/ol>/gi, '\n')
    md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
    md = md.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n')
    md = md.replace(/<br\s*\/?>/gi, '\n')
    md = md.replace(/<hr\s*\/?>/gi, '---\n')
    md = md.replace(/<[^>]+>/g, '')
    md = md.replace(/&nbsp;/g, ' ')
    md = md.replace(/&amp;/g, '&')
    md = md.replace(/&lt;/g, '<')
    md = md.replace(/&gt;/g, '>')
    md = md.replace(/&quot;/g, '"')
    md = md.replace(/&#39;/g, "'")
    md = md.replace(/\n{3,}/g, '\n\n')
    md = md.trim()
    return md
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

  if (viewMode === 'list') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">文章管理</h1>
              <p className="text-gray-500 mt-1">管理行业洞察板块的文章内容</p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                {uploading ? '上传中...' : '📄 上传Word文档'}
              </Button>
              <input ref={fileInputRef} type="file" accept=".docx" onChange={handleFileUpload} className="hidden" />
              <Button onClick={handleNew}>+ 新建文章</Button>
            </div>
          </div>

          {loading ? (
            <Card><p className="text-center py-8 text-gray-500">加载中...</p></Card>
          ) : articles.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">暂无文章</p>
                <div className="flex justify-center gap-4">
                  <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>上传Word文档</Button>
                  <Button onClick={handleNew}>创建文章</Button>
                </div>
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
                    <th className="text-left py-3 px-4 font-medium text-gray-600 w-24">作者</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600 w-32">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((article) => (
                    <tr key={article.slug} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {article.coverImage && (
                            <img src={article.coverImage} alt="" className="w-12 h-12 rounded object-cover flex-shrink-0" />
                          )}
                          <a href={`/insights/${article.slug}`} target="_blank" className="text-gray-900 hover:text-blue-600 font-medium">
                            {article.title}
                          </a>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">{article.category}</span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">{article.date}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">{article.author}</td>
                      <td className="py-3 px-4 text-right">
                        <button onClick={() => window.open(`/insights/${article.slug}`, '_blank')} className="text-blue-600 hover:text-blue-800 text-sm mr-3">
                          查看
                        </button>
                        <button onClick={() => handleDelete(article.slug)} className="text-red-500 hover:text-red-700 text-sm">
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setViewMode('list')} className="text-gray-600 hover:text-gray-900">
            ← 返回列表
          </button>
          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? '发布中...' : '发布文章'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 左侧：元信息 + 图片库 */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <h3 className="font-bold text-gray-900 mb-4">文章信息</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">标题 *</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="输入文章标题" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option>行业洞察</option>
                    <option>融资避坑指南</option>
                    <option>信贷产品评述</option>
                    <option>信用修复</option>
                    <option>企业融资</option>
                    <option>AI产品</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">作者</label>
                  <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">摘要</label>
                  <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="一句话概括文章内容" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">阅读时间</label>
                  <input type="text" value={readTime} onChange={(e) => setReadTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="5分钟" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">标签（逗号分隔）</label>
                  <input type="text" value={tags} onChange={(e) => setTags(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="融资, 小微企业, AI" />
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="font-bold text-gray-900 mb-3">封面图片</h3>
              <p className="text-xs text-gray-500 mb-3">选择一张图片作为文章封面</p>
              {coverImage ? (
                <div className="relative">
                  <img src={coverImage} alt="封面" className="w-full h-40 object-cover rounded-lg" />
                  <button onClick={() => setCoverImage('')}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full text-sm flex items-center justify-center hover:bg-red-600">×</button>
                </div>
              ) : (
                <Button variant="secondary" size="sm" className="w-full" onClick={() => imageInputRef.current?.click()}>
                  选择封面图片
                </Button>
              )}
            </Card>

            <Card>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900">图片库</h3>
                <Button variant="secondary" size="sm" onClick={() => imageInputRef.current?.click()} disabled={imageUploading}>
                  {imageUploading ? '上传中...' : '+ 上传'}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mb-3">点击图片插入到编辑器，或直接粘贴/拖拽图片</p>
              {uploadedImages.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">暂无图片</p>
              ) : (
                <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                  {uploadedImages.map((img, i) => (
                    <div key={i} className="relative group cursor-pointer aspect-square"
                      onClick={() => insertImageFromLibrary(img.url)}>
                      <img src={img.url} alt="" className="w-full h-full object-cover rounded" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                        <span className="text-white text-xs font-medium">插入</span>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); if (coverImage === img.url) setCoverImage(''); setUploadedImages(prev => prev.filter((_, idx) => idx !== i)) }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-600">×</button>
                      <button onClick={(e) => { e.stopPropagation(); setCoverImage(img.url) }}
                        className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-blue-600 text-white rounded text-[10px] opacity-0 group-hover:opacity-100 hover:bg-blue-700">封面</button>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <h3 className="font-bold text-blue-900 mb-2">💡 快捷方式</h3>
              <p className="text-sm text-blue-700 mb-3">支持直接粘贴图片（Ctrl+V）或拖拽图片到编辑器</p>
              <Button variant="secondary" size="sm" onClick={() => imageInputRef.current?.click()} disabled={uploading} className="w-full">
                {uploading ? '转换中...' : '📄 上传Word文档'}
              </Button>
            </Card>
          </div>

          {/* 右侧：富文本编辑器 */}
          <div className="lg:col-span-3">
            <Card className="h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">文章内容 *</h3>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={() => imageInputRef.current?.click()} disabled={imageUploading}>
                    {imageUploading ? '上传中...' : '🖼️ 插入图片'}
                  </Button>
                </div>
              </div>
              <style>{`
                .editor-content:empty:before {
                  content: attr(data-placeholder);
                  color: #9ca3af;
                  pointer-events: none;
                }
                .editor-content img {
                  max-width: 100%;
                  border-radius: 8px;
                  margin: 16px 0;
                  cursor: pointer;
                }
                .editor-content img:hover {
                  opacity: 0.8;
                }
                .editor-content h1 { font-size: 1.875rem; font-weight: bold; margin: 16px 0 8px; }
                .editor-content h2 { font-size: 1.5rem; font-weight: bold; margin: 16px 0 8px; }
                .editor-content h3 { font-size: 1.25rem; font-weight: bold; margin: 16px 0 8px; }
                .editor-content p { margin: 8px 0; }
                .editor-content blockquote { border-left: 4px solid #3b82f6; padding-left: 16px; color: #6b7280; font-style: italic; margin: 16px 0; }
                .editor-content ul, .editor-content ol { margin: 8px 0; padding-left: 24px; }
                .editor-content li { margin: 4px 0; }
                .editor-content hr { border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }
                .editor-content a { color: #2563eb; text-decoration: underline; }
              `}</style>
              <div
                ref={editorRef}
                contentEditable
                className="editor-content w-full min-h-[600px] max-h-[800px] overflow-y-auto px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none leading-relaxed"
                data-placeholder="在这里输入文章内容...&#10;&#10;支持直接粘贴图片（Ctrl+V）或拖拽图片到编辑器&#10;点击左侧图片库中的图片可直接插入"
                onPaste={handlePaste}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              />
            </Card>
          </div>
        </div>

        <input ref={fileInputRef} type="file" accept=".doc,.docx" onChange={handleFileUpload} className="hidden" />
        <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
      </div>
    </div>
  )
}
