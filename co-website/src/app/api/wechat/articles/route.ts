import { NextRequest, NextResponse } from 'next/server'
import { fetchPublishedArticles, fetchArticleDetail } from '@/lib/wechat'

export async function GET(request: NextRequest) {
  try {
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
      { success: false, error: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    )
  }
}
