import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'

const CXR_BASE_URL = process.env.CXR_BASE_URL || 'http://localhost:8090'

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request)
    if ('error' in auth) return auth.error

    const formData = await request.formData()
    
    const response = await fetch(`${CXR_BASE_URL}/analyze`, {
      method: 'POST',
      body: formData,
    })
    
    if (!response.ok) {
      return NextResponse.json(
        { error: '分析服务暂时不可用' },
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
