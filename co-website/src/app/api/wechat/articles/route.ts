import { NextRequest, NextResponse } from 'next/server'
import { fetchPublishedArticles, fetchArticleDetail } from '@/lib/wechat'
import { requireAdmin } from '@/lib/session'

export async function GET(request: NextRequest) {
  try {
    const auth = requireAdmin(request)
    if ('error' in auth) return auth.error

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'list'
    const offset = parseInt(searchParams.get('offset') || '0')
    const count = parseInt(searchParams.get('count') || '20')
    const articleId = searchParams.get('article_id')

    if (action === 'detail' && articleId) {
      const article = await fetchArticleDetail(articleId)
      return NextResponse.json({ success: true, article })
    }

    const result = await fetchPublishedArticles(offset, count)
    return NextResponse.json({ success: true, ...result })
  } catch (error) {
    console.error('WeChat API error:', error)
    return NextResponse.json(
      { success: false, error: '获取微信文章失败，请稍后重试' },
      { status: 500 }
    )
  }
}
