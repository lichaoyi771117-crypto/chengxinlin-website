import { NextRequest, NextResponse } from 'next/server'

const CXR_BASE_URL = process.env.CXR_BASE_URL || 'http://localhost:8090'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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
