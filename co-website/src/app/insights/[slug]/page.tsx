import { getArticleBySlug, getAllArticles } from '@/lib/articles'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import sanitizeHtml from 'sanitize-html'

export async function generateStaticParams() {
  const articles = getAllArticles()
  return articles.map((article) => ({ slug: article.slug }))
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) notFound()

  // Convert markdown content to HTML with XSS sanitization
  const rawHtml = article.content
    .replace(/^### (.*)$/gm, '<h3 class="text-xl font-bold text-gray-900 mt-8 mb-4">$1</h3>')
    .replace(/^## (.*)$/gm, '<h2 class="text-2xl font-bold text-gray-900 mt-10 mb-4">$1</h2>')
    .replace(/^# (.*)$/gm, '<h1 class="text-3xl font-bold text-gray-900 mb-4">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^- (.*)$/gm, '<li class="ml-4 mb-1">$1</li>')
    .replace(/^(\d+)\. (.*)$/gm, '<li class="ml-4 mb-1 list-decimal">$2</li>')
    .replace(/^> (.*)$/gm, '<blockquote class="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-4">$1</blockquote>')
    .replace(/---/g, '<hr class="my-8 border-gray-200" />')
    .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="max-w-full rounded-lg my-6" />')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 hover:underline" rel="noopener noreferrer">$1</a>')
    .replace(/\n\n/g, '<br /><br />')

  const sanitizedHtml = sanitizeHtml(rawHtml, {
    allowedTags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'b', 'em', 'i', 'a', 'img', 'li', 'ul', 'ol', 'blockquote', 'hr', 'br', 'p', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'span', 'div'],
    allowedAttributes: {
      a: ['href', 'target', 'rel', 'class'],
      img: ['src', 'alt', 'class', 'loading'],
      '*': ['class'],
    },
    // 限制 URL scheme：仅允许 http/https/mailto，阻止 javascript:/data: 等
    allowedSchemes: ['http', 'https', 'mailto'],
    // 对 <a> 标签的 href 做 scheme 过滤
    allowedSchemesByTag: {
      a: ['http', 'https', 'mailto'],
      img: ['http', 'https', 'data'],
    },
    // 自动给 <a> 标签添加 rel="noopener noreferrer"
    transformTags: {
      'a': (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          rel: 'noopener noreferrer',
          target: attribs.target || '_blank',
        },
      }),
    },
    // 不允许 <style> 和 <script> 标签
    disallowedTagsMode: 'escape',
  })

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-blue-600">首页</Link></li>
            <li>/</li>
            <li><Link href="/insights" className="hover:text-blue-600">行业洞察</Link></li>
            <li>/</li>
            <li className="text-gray-900 truncate max-w-xs">{article.title}</li>
          </ol>
        </nav>

          {/* Article Header */}
          <article>
            {article.coverImage && (
              <div className="mb-8 rounded-xl overflow-hidden">
                <img src={article.coverImage} alt={article.title} className="w-full h-64 md:h-80 object-cover" />
              </div>
            )}
            <header className="mb-8 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                {article.category}
              </span>
              <span className="text-gray-400 text-sm">{article.date}</span>
              <span className="text-gray-400 text-sm">· {article.readTime}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>
            <p className="text-lg text-gray-600">{article.excerpt}</p>
            <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
              <span>作者：{article.author}</span>
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <div
              className="text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: sanitizedHtml
              }}
            />
          </div>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Back */}
        <div className="mt-12">
          <Link href="/insights">
            <Button variant="secondary">← 返回行业洞察</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
