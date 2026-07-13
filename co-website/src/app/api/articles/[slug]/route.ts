import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const ARTICLES_DIR = path.join(process.cwd(), 'src', 'content', 'articles')

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    if (!/^[a-z0-9][a-z0-9\-]*$/.test(slug)) {
      return NextResponse.json({ error: '无效的slug' }, { status: 400 })
    }

    const filePath = path.join(ARTICLES_DIR, `${slug}.md`)
    if (!filePath.startsWith(ARTICLES_DIR) || !fs.existsSync(filePath)) {
      return NextResponse.json({ error: '文章不存在' }, { status: 404 })
    }

    const raw = fs.readFileSync(filePath, 'utf-8')
    const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)

    if (!match) {
      return NextResponse.json({ error: '格式错误' }, { status: 500 })
    }

    const metaBlock = match[1]
    const content = match[2]
    const metadata: Record<string, string | string[]> = {}

    for (const line of metaBlock.split('\n')) {
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

    return NextResponse.json({
      article: {
        slug,
        title: (metadata.title as string) || 'Untitled',
        category: (metadata.category as string) || '',
        author: (metadata.author as string) || '',
        excerpt: (metadata.excerpt as string) || '',
        readTime: (metadata.readTime as string) || '',
        coverImage: (metadata.coverImage as string) || '',
        tags: Array.isArray(metadata.tags) ? metadata.tags : [],
        content,
      }
    })
  } catch (error) {
    console.error('Get article error:', error)
    return NextResponse.json({ error: '读取失败' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    if (!/^[a-z0-9][a-z0-9\-]*$/.test(slug)) {
      return NextResponse.json({ error: '无效的slug' }, { status: 400 })
    }

    const filePath = path.join(ARTICLES_DIR, `${slug}.md`)
    if (!filePath.startsWith(ARTICLES_DIR) || !fs.existsSync(filePath)) {
      return NextResponse.json({ error: '文章不存在' }, { status: 404 })
    }

    const body = await request.json()
    const { title, category, author, excerpt, readTime, tags, coverImage, content } = body

    if (!title || !content) {
      return NextResponse.json({ error: '标题和内容不能为空' }, { status: 400 })
    }

    ensureDir(ARTICLES_DIR)

    const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
category: "${category || '行业洞察'}"
date: "${new Date().toISOString().split('T')[0]}"
author: "${author || '霖信莯'}"
excerpt: "${(excerpt || '').replace(/"/g, '\\"')}"
readTime: "${readTime || '5分钟'}"
tags: [${(tags || []).map((t: string) => `"${t}"`).join(', ')}]
coverImage: "${(coverImage || '').replace(/"/g, '\\"')}"
---

`

    fs.writeFileSync(filePath, frontmatter + content, 'utf-8')

    return NextResponse.json({ success: true, slug })
  } catch (error) {
    console.error('Update article error:', error)
    return NextResponse.json({ error: '更新失败: ' + (error as Error).message }, { status: 500 })
  }
}
