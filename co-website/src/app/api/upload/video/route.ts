import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { requireAdmin } from '@/lib/session'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'videos')

// 扩展名白名单
const ALLOWED_EXTS = ['mp4', 'webm', 'ogg', 'mov']

// Magic Bytes 校验
const MAGIC_BYTES: Record<string, number[]> = {
  mp4: [0x66, 0x74, 0x79, 0x70],  // ftyp (at offset 4)
  webm: [0x1A, 0x45, 0xDF, 0xA3], // EBML
  ogg: [0x4F, 0x67, 0x67, 0x53],  // OggS
  mov: [0x66, 0x74, 0x79, 0x70],  // ftyp (MOV uses same container)
}

function detectVideoType(buf: Buffer): string | null {
  // MP4/MOV: check bytes 4-7 for "ftyp"
  if (buf.length >= 8 && buf[4] === 0x66 && buf[5] === 0x74 && buf[6] === 0x79 && buf[7] === 0x70) {
    return 'mp4'
  }
  // WebM: EBML header
  if (buf.length >= 4 && buf[0] === 0x1A && buf[1] === 0x45 && buf[2] === 0xDF && buf[3] === 0xA3) {
    return 'webm'
  }
  // OGG: OggS header
  if (buf.length >= 4 && buf[0] === 0x4F && buf[1] === 0x67 && buf[2] === 0x67 && buf[3] === 0x53) {
    return 'ogg'
  }
  return null
}

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = requireAdmin(request)
    if ('error' in auth) return auth.error

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: '请选择文件' }, { status: 400 })
    }

    // 扩展名白名单校验
    const ext = (file.name.split('.').pop() || '').toLowerCase()
    if (!ALLOWED_EXTS.includes(ext)) {
      return NextResponse.json({ error: '仅支持 mp4/webm/ogg/mov 格式' }, { status: 400 })
    }

    const maxSize = 200 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: '视频大小不能超过200MB' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    // Magic Bytes 校验 — 防止伪造 MIME 类型
    const detected = detectVideoType(buffer)
    if (!detected) {
      return NextResponse.json({ error: '文件内容不是有效的视频' }, { status: 400 })
    }

    ensureDir(UPLOAD_DIR)

    // 使用 crypto.randomBytes 生成安全文件名
    const filename = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}.${ext}`
    const filePath = path.join(UPLOAD_DIR, filename)
    fs.writeFileSync(filePath, buffer)

    const url = `/uploads/videos/${filename}`

    return NextResponse.json({ success: true, url, filename })
  } catch (error) {
    console.error('Upload video error:', error)
    return NextResponse.json({ error: '上传失败' }, { status: 500 })
  }
}
