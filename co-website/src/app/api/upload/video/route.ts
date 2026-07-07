import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'videos')

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: '请选择文件' }, { status: 400 })
    }

    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: '仅支持 mp4/webm/ogg/mov 格式' }, { status: 400 })
    }

    const maxSize = 200 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: '视频大小不能超过200MB' }, { status: 400 })
    }

    ensureDir(UPLOAD_DIR)

    const ext = file.name.split('.').pop() || 'mp4'
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const filePath = path.join(UPLOAD_DIR, filename)

    const buffer = Buffer.from(await file.arrayBuffer())
    fs.writeFileSync(filePath, buffer)

    const url = `/uploads/videos/${filename}`

    return NextResponse.json({ success: true, url, filename })
  } catch (error) {
    console.error('Upload video error:', error)
    return NextResponse.json({ error: '上传失败' }, { status: 500 })
  }
}
