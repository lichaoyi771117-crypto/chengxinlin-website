export interface ArticleAnalysis {
  title: string
  category: string
  excerpt: string
  suggestedTags: string[]
}

const CATEGORIES = [
  '产业政策解读',
  '企业案例分析',
  '技术服务前沿',
  '协会工作动态',
  '党建工作',
]

const SYSTEM_PROMPT = `你是程信霖咨询的内容编辑专家，擅长分析行业文章并提取关键信息。
请从文章中提取以下信息，并以严格的 JSON 格式返回（不要包含任何其他文本）：
{
  "title": "优化后的文章标题（简洁有力，不超过30字）",
  "category": "分类（必须是以下之一：产业政策解读、企业案例分析、技术服务前沿、协会工作动态、党建工作）",
  "excerpt": "文章摘要（100-200字，概括核心内容）",
  "suggestedTags": ["标签1", "标签2", "标签3"]  // 3-5个关键词标签
}`

export async function analyzeArticle(content: string): Promise<ArticleAnalysis> {
  const apiKey = process.env.DEEPSEEK_API_KEY

  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY 未配置，请在 .env.local 中添加该环境变量')
  }

  // 清理内容（去除图片标记，避免干扰分析）
  const cleanContent = content
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  if (!cleanContent) {
    throw new Error('文章内容为空')
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30000)

  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          {
            role: 'user',
            content: `请分析以下文章内容：\n\n${cleanContent.slice(0, 8000)}`,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
      }),
      signal: controller.signal,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`DeepSeek API 错误 (${response.status}): ${errorText}`)
    }

    const data = await response.json()
    const rawContent = data.choices?.[0]?.message?.content

    if (!rawContent) {
      throw new Error('DeepSeek API 返回为空')
    }

    let parsed: Partial<ArticleAnalysis>
    try {
      parsed = JSON.parse(rawContent)
    } catch {
      throw new Error('DeepSeek API 返回的不是有效 JSON')
    }

    // 验证并补全字段
    const title = (parsed.title || '').toString().trim() || '未命名文章'
    const category = CATEGORIES.includes(parsed.category as string)
      ? (parsed.category as string)
      : '行业洞察'
    const excerpt = (parsed.excerpt || '').toString().trim() || ''
    const suggestedTags = Array.isArray(parsed.suggestedTags)
      ? parsed.suggestedTags
          .filter((t: unknown) => typeof t === 'string' && t.trim())
          .map((t: string) => t.trim())
          .slice(0, 5)
      : []

    return { title, category, excerpt, suggestedTags }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('DeepSeek API 请求超时（30秒）')
    }
    throw error
  } finally {
    clearTimeout(timeout)
  }
}
