import fs from 'fs'
import path from 'path'

export interface Article {
  slug: string
  title: string
  category: string
  date: string
  author: string
  excerpt: string
  readTime: string
  tags: string[]
  coverImage: string
  content: string
}

function parseFrontmatter(raw: string): { metadata: Record<string, string | string[]>; content: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) return { metadata: {}, content: raw }

  const metaBlock = match[1]
  const content = match[2]
  const metadata: Record<string, string | string[]> = {}

  for (const line of metaBlock.split('\n')) {
    const colonIndex = line.indexOf(':')
    if (colonIndex === -1) continue
    const key = line.slice(0, colonIndex).trim()
    let value: string | string[] = line.slice(colonIndex + 1).trim()

    if (typeof value === 'string' && value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map(s => s.trim().replace(/"/g, ''))
    } else if (typeof value === 'string') {
      value = value.replace(/^["']|["']$/g, '')
    }

    metadata[key] = value
  }

  return { metadata, content }
}

export function getAllArticles(): Article[] {
  const articlesDir = path.join(process.cwd(), 'src', 'content', 'articles')

  if (!fs.existsSync(articlesDir)) return []

  const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md'))

  return files
    .map(file => {
      const raw = fs.readFileSync(path.join(articlesDir, file), 'utf-8')
      const { metadata, content } = parseFrontmatter(raw)
      return {
        slug: file.replace('.md', ''),
        title: (metadata.title as string) || 'Untitled',
        category: (metadata.category as string) || '未分类',
        date: (metadata.date as string) || new Date().toISOString().split('T')[0],
        author: (metadata.author as string) || '程信霖',
        excerpt: (metadata.excerpt as string) || '',
        readTime: (metadata.readTime as string) || '5分钟',
        tags: (metadata.tags as string[]) || [],
        coverImage: (metadata.coverImage as string) || '',
        content,
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getArticleBySlug(slug: string): Article | null {
  const articles = getAllArticles()
  return articles.find(a => a.slug === slug) || null
}
