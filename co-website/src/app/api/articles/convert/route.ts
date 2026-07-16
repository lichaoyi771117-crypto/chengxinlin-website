import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    const auth = requireAdmin(request)
    if ('error' in auth) return auth.error

    const formData = await request.formData()
    const docxFile = formData.get('file') as File | null

    if (!docxFile) {
      return NextResponse.json({ error: '请上传文件' }, { status: 400 })
    }

    const isDocx = docxFile.name.endsWith('.docx')
    if (!isDocx) {
      return NextResponse.json({ error: '请上传Word文档（.docx格式）' }, { status: 400 })
    }

    const buffer = Buffer.from(await docxFile.arrayBuffer())
    const mammoth = await import('mammoth')
    const result = await mammoth.convertToHtml({ buffer })

    // 从文件名提取标题
    const title = docxFile.name.replace(/\.docx?$/i, '')

    return NextResponse.json({
      success: true,
      title,
      content: result.value,
      warnings: result.messages || [],
    })
  } catch (error) {
    console.error('Convert error:', error)
    return NextResponse.json({ error: '文档转换失败，请稍后重试' }, { status: 500 })
  }
}
