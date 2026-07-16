import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { requireAdmin } from '@/lib/session'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'images')

// 扩展名白名单
const ALLOWED_EXTS = ['jpg', 'jpeg', 'png', 'gif', 'webp']

// Magic Bytes 校验
const MAGIC_BYTES: Record<string, number[]> = {
  jpeg: [0xFF, 0xD8, 0xFF],
  png: [0x89, 0x50, 0x4E, 0x47],
  gif: [0x47, 0x49, 0x46, 0x38],
  webp: [0x52, 0x49, 0x46, 0x46], // RIFF
}

function detectImageType(buf: Buffer): string | null {
  for (const [type, magic] of Object.entries(MAGIC_BYTES)) {
    if (magic.every((byte, i) => buf[i] === byte)) return type
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
      return NextResponse.json({ error: '仅支持 jpg/png/gif/webp 格式' }, { status: 400 })
    }

    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: '图片大小不能超过10MB' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    // Magic Bytes 校验 — 防止伪造 MIME 类型
    const detected = detectImageType(buffer)
    if (!detected) {
      return NextResponse.json({ error: '文件内容不是有效的图片' }, { status: 400 })
    }

    ensureDir(UPLOAD_DIR)

    // 使用 crypto.randomBytes 生成安全文件名
    const filename = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}.${ext}`
    const filePath = path.join(UPLOAD_DIR, filename)
    fs.writeFileSync(filePath, buffer)

    const url = `/uploads/images/${filename}`

    return NextResponse.json({ success: true, url, filename })
  } catch (error) {
    console.error('Upload image error:', error)
    return NextResponse.json({ error: '上传失败' }, { status: 500 })
  }
}
