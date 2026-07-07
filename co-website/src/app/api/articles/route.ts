import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const ARTICLES_DIR = path.join(process.cwd(), 'src', 'content', 'articles')

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

// HTML转Markdown
function htmlToMarkdown(html: string): string {
  const md = html
    // 标题
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
    .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n')
    // 加粗和斜体
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
    .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
    // 链接
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
    // 图片
    .replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '![$2]($1)')
    .replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, '![]($1)')
    // 列表
    .replace(/<ul[^>]*>/gi, '')
    .replace(/<\/ul>/gi, '\n')
    .replace(/<ol[^>]*>/gi, '')
    .replace(/<\/ol>/gi, '\n')
    .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
    // 引用
    .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n')
    // 段落和换行
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<hr\s*\/?>/gi, '---\n\n')
    // 表格
    .replace(/<table[^>]*>/gi, '')
    .replace(/<\/table>/gi, '\n')
    .replace(/<thead[^>]*>/gi, '')
    .replace(/<\/thead>/gi, '')
    .replace(/<tbody[^>]*>/gi, '')
    .replace(/<\/tbody>/gi, '')
    .replace(/<tr[^>]*>(.*?)<\/tr>/gi, '| $1 |\n')
    .replace(/<th[^>]*>(.*?)<\/th>/gi, '$1 | ')
    .replace(/<td[^>]*>(.*?)<\/td>/gi, '$1 | ')
    // 清除剩余HTML标签
    .replace(/<[^>]+>/g, '')
    // 解码HTML实体
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    // 清理多余空行
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  return md
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''

    let title, category, author, excerpt, readTime, tags, content, coverImage

    if (contentType.includes('multipart/form-data')) {
      // 处理文件上传
      const formData = await request.formData()
      title = formData.get('title') as string
      category = formData.get('category') as string || '行业洞察'
      author = formData.get('author') as string || '程信霖融途'
      excerpt = formData.get('excerpt') as string || ''
      readTime = formData.get('readTime') as string || '5分钟'
      coverImage = formData.get('coverImage') as string || ''
      const tagsStr = formData.get('tags') as string || ''
      tags = tagsStr.split(/[,，、]/).map((t: string) => t.trim()).filter(Boolean)

      const docxFile = formData.get('file') as File | null
      const markdownContent = formData.get('content') as string | null

      if (docxFile) {
        // 上传了Word文档，用mammoth转换
        const buffer = Buffer.from(await docxFile.arrayBuffer())
        const mammoth = await import('mammoth')
        const result = await mammoth.convertToHtml({ buffer })
        content = htmlToMarkdown(result.value)

        // 如果没有标题，从文件名提取
        if (!title) {
          title = docxFile.name.replace(/\.docx?$/i, '')
        }
      } else if (markdownContent) {
        content = markdownContent
      } else {
        return NextResponse.json({ error: '缺少内容' }, { status: 400 })
      }
    } else {
      // 处理JSON请求（纯Markdown）
      const body = await request.json()
      title = body.title
      category = body.category || '行业洞察'
      author = body.author || '程信霖融途'
      excerpt = body.excerpt || ''
      readTime = body.readTime || '5分钟'
      tags = body.tags || []
      content = body.content
      coverImage = body.coverImage || ''
    }

    if (!title || !content) {
      return NextResponse.json({ error: '标题和内容不能为空' }, { status: 400 })
    }

    ensureDir(ARTICLES_DIR)

    const slug = slugify(title) || `article-${Date.now()}`
    const date = new Date().toISOString().split('T')[0]

    const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
category: "${category}"
date: "${date}"
author: "${author}"
excerpt: "${excerpt.replace(/"/g, '\\"')}"
readTime: "${readTime}"
tags: [${(tags || []).map((t: string) => `"${t}"`).join(', ')}]
coverImage: "${(coverImage || '').replace(/"/g, '\\"')}"
---

`

    const filePath = path.join(ARTICLES_DIR, `${slug}.md`)
    fs.writeFileSync(filePath, frontmatter + content, 'utf-8')

    return NextResponse.json({ success: true, slug, filePath })
  } catch (error) {
    console.error('Save article error:', error)
    return NextResponse.json({ error: '保存失败: ' + (error as Error).message }, { status: 500 })
  }
}

export async function GET() {
  try {
    ensureDir(ARTICLES_DIR)
    const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.md'))

    const articles = files.map(file => {
      const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf-8')
      const match = raw.match(/^---\n([\s\S]*?)\n---/)
      const metadata: Record<string, string | string[]> = {}

      if (match) {
        for (const line of match[1].split('\n')) {
          const idx = line.indexOf(':')
          if (idx > 0) {
            const key = line.slice(0, idx).trim()
            const rawValue = line.slice(idx + 1).trim()

            let value: string | string[]
            if (rawValue.startsWith('[') && rawValue.endsWith(']')) {
              value = rawValue.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean)
            } else {
              value = rawValue.replace(/^["']|["']$/g, '')
            }
            metadata[key] = value
          }
        }
      }

      return {
        slug: file.replace('.md', ''),
        title: (metadata.title as string) || 'Untitled',
        category: (metadata.category as string) || '',
        date: (metadata.date as string) || '',
        author: (metadata.author as string) || '',
        excerpt: (metadata.excerpt as string) || '',
        readTime: (metadata.readTime as string) || '',
        coverImage: (metadata.coverImage as string) || '',
        tags: Array.isArray(metadata.tags) ? metadata.tags : [],
      }
    })

    articles.sort((a, b) => (b.date || '').localeCompare(a.date || ''))

    return NextResponse.json({ articles })
  } catch (error) {
    console.error('List articles error:', error)
    return NextResponse.json({ error: '读取失败' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (!slug) {
      return NextResponse.json({ error: '缺少slug' }, { status: 400 })
    }

    if (!/^[a-z0-9][a-z0-9\-]*$/.test(slug)) {
      return NextResponse.json({ error: '无效的slug' }, { status: 400 })
    }

    const filePath = path.join(ARTICLES_DIR, `${slug}.md`)
    if (!filePath.startsWith(ARTICLES_DIR)) {
      return NextResponse.json({ error: '无效的路径' }, { status: 400 })
    }

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete article error:', error)
    return NextResponse.json({ error: '删除失败' }, { status: 500 })
  }
}
