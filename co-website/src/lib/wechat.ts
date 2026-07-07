interface WeChatArticle {
  title: string
  digest: string
  content_html: string
  create_time: number
  update_time: number
  url: string
  thumb_url: string
  article_id: string
}

interface WeChatNewsItem {
  title: string
  digest: string
  content_html: string
  create_time: number
  update_time: number
  url: string
  thumb_url: string
  article_id: string
  need_open_comment: number
  only_fans_can_comment: number
}

// In-memory token cache
let tokenCache: { token: string; expiresAt: number } | null = null

async function getAccessToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token
  }

  const appid = process.env.WECHAT_APPID
  const secret = process.env.WECHAT_APPSECRET
  if (!appid || !secret) throw new Error('WECHAT_APPID or WECHAT_APPSECRET not configured')

  const res = await fetch(
    `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`
  )
  const data = await res.json()
  if (data.errcode) throw new Error(`WeChat token error: ${data.errmsg}`)

  tokenCache = { token: data.access_token, expiresAt: Date.now() + (data.expires_in - 300) * 1000 }
  return data.access_token
}

export async function fetchPublishedArticles(offset = 0, count = 10): Promise<{
  articles: WeChatArticle[]
  total_count: number
  item_count: number
}> {
  const token = await getAccessToken()
  const res = await fetch(`https://api.weixin.qq.com/cgi-bin/freepublish/batchget?access_token=${token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ offset, count, no_content: 1 }),
  })
  const data = await res.json()
  if (data.errcode) throw new Error(`WeChat batchget error: ${data.errmsg}`)

  const articles: WeChatArticle[] = (data.item || []).map((item: { article_id: string; content: { news_item: WeChatNewsItem[] } }) => {
    const news = item.content.news_item[0]
    return {
      title: news.title,
      digest: news.digest,
      content_html: news.content_html,
      create_time: news.create_time,
      update_time: news.update_time,
      url: news.url,
      thumb_url: news.thumb_url,
      article_id: item.article_id,
    }
  })

  return { articles, total_count: data.total_count, item_count: data.item_count }
}

export async function fetchArticleDetail(articleId: string): Promise<WeChatArticle | null> {
  const token = await getAccessToken()
  const res = await fetch(`https://api.weixin.qq.com/cgi-bin/freepublish/getarticle?access_token=${token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ article_id: articleId }),
  })
  const data = await res.json()
  if (data.errcode) return null

  const news = data.news_item?.[0]
  if (!news) return null

  return {
    title: news.title,
    digest: news.digest,
    content_html: news.content_html,
    create_time: news.create_time,
    update_time: news.update_time,
    url: news.url,
    thumb_url: news.thumb_url,
    article_id: articleId,
  }
}
