import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'

const CONTACTS_FILE = 'data/contacts.json'

// In-memory store for simplicity; could be replaced with DB
let contacts: Array<{
  id: number
  name: string
  phone: string
  company: string
  interest: string
  message: string
  created_at: string
}> = []

// Try to load existing contacts
try {
  const fs = await import('fs')
  const path = await import('path')
  const filePath = path.join(process.cwd(), CONTACTS_FILE)
  if (fs.existsSync(filePath)) {
    contacts = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  }
} catch {
  // File doesn't exist yet, use empty array
}

export async function POST(request: NextRequest) {
  const limited = checkRateLimit(request, 'contact', 3, 60 * 1000)
  if (limited) return limited

  try {
    const body = await request.json()
    const { name, phone, company, interest, message } = body

    if (!name || !phone) {
      return NextResponse.json({ success: false, error: '姓名和联系电话不能为空' }, { status: 400 })
    }

    if (!interest) {
      return NextResponse.json({ success: false, error: '请选择合作意向' }, { status: 400 })
    }

    // 手机号格式校验：11 位大陆手机号
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      return NextResponse.json({ success: false, error: '请输入有效的手机号' }, { status: 400 })
    }

    // 消息长度限制
    if (message && message.length > 1000) {
      return NextResponse.json({ success: false, error: '留言内容不能超过1000字' }, { status: 400 })
    }

    // 姓名长度限制
    if (name.length > 50) {
      return NextResponse.json({ success: false, error: '姓名不能超过50字' }, { status: 400 })
    }

    const contact = {
      id: Date.now(),
      name,
      phone,
      company: company || '',
      interest,
      message: message || '',
      created_at: new Date().toISOString(),
    }

    contacts.push(contact)

    // Persist to file
    const fs = await import('fs')
    const path = await import('path')
    const filePath = path.join(process.cwd(), CONTACTS_FILE)
    const dirPath = path.dirname(filePath)
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }
    fs.writeFileSync(filePath, JSON.stringify(contacts, null, 2), 'utf-8')

    return NextResponse.json({ success: true, id: contact.id })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ success: false, error: '提交失败，请稍后重试' }, { status: 500 })
  }
}
