import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'

const CXR_BASE_URL = process.env.CXR_BASE_URL || 'http://localhost:8090'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(request)
    if ('error' in auth) return auth.error

    const { id } = await params

    // 校验 task ID 格式，防止路径注入
    if (!/^[a-zA-Z0-9\-_]+$/.test(id)) {
      return NextResponse.json({ error: '无效的任务ID' }, { status: 400 })
    }

    const response = await fetch(`${CXR_BASE_URL}/tasks/${id}/status`)
    
    if (!response.ok) {
      return NextResponse.json(
        { error: '查询状态失败' },
        { status: response.status }
      )
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { error: '无法连接到分析服务' },
      { status: 503 }
    )
  }
}
