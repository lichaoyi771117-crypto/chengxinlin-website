import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { analyzeArticle } from '@/lib/deepseek'
import { insertImagesEvenly } from '@/lib/article-layout'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'images')

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

// 复用自 articles/route.ts
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
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (files.length === 0) {
      return NextResponse.json({ error: '未找到文件' }, { status: 400 })
    }

    // 分离文章文件和图片文件
    const articleFiles = files.filter(
      f => f.name.endsWith('.md') || f.name.endsWith('.docx')
    )
    const imageFiles = files.filter(f =>
      /\.(jpg|jpeg|png|gif|webp)$/i.test(f.name)
    )

    if (articleFiles.length === 0) {
      return NextResponse.json({ error: '请上传文章文件（.md 或 .docx）' }, { status: 400 })
    }

    if (articleFiles.length > 1) {
      return NextResponse.json({ error: '一次只能处理一篇文章' }, { status: 400 })
    }

    const articleFile = articleFiles[0]
    let content = ''

    // 读取/转换文章内容
    if (articleFile.name.endsWith('.docx')) {
      const buffer = Buffer.from(await articleFile.arrayBuffer())
      const mammoth = await import('mammoth')
      const result = await mammoth.convertToHtml({ buffer })
      content = htmlToMarkdown(result.value)
    } else {
      content = await articleFile.text()
    }

    // 上传图片
    const imageUrls: string[] = []
    ensureDir(UPLOAD_DIR)
    for (const imgFile of imageFiles.slice(0, 3)) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedTypes.includes(imgFile.type)) continue
      if (imgFile.size > 10 * 1024 * 1024) continue
      const ext = imgFile.name.split('.').pop() || 'png'
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
      fs.writeFileSync(
        path.join(UPLOAD_DIR, filename),
        Buffer.from(await imgFile.arrayBuffer())
      )
      imageUrls.push(`/uploads/images/${filename}`)
    }

    // AI 分析
    let analysis
    try {
      analysis = await analyzeArticle(content)
    } catch (err) {
      return NextResponse.json(
        { error: 'AI 分析失败：' + (err as Error).message },
        { status: 500 }
      )
    }

    // 等距插图
    const contentWithImages = insertImagesEvenly(content, imageUrls)

    return NextResponse.json({
      success: true,
      preview: {
        ...analysis,
        contentWithImages,
        imageUrls,
      },
    })
  } catch (error) {
    console.error('Smart upload error:', error)
    return NextResponse.json(
      { error: '处理失败：' + (error as Error).message },
      { status: 500 }
    )
  }
}
