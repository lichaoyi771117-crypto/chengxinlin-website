import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import { findAuthorizationCode, findAuthorizationBindingByUserId, transferCap } from '@/lib/db'

const UNLIMITED = 999999

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request)
    if ('error' in auth) return auth.error

    const { code, from, to, amount } = await request.json()

    if (!from || !to || !amount || amount <= 0) {
      return NextResponse.json({ error: '参数错误' }, { status: 400 })
    }
    if (from === to) {
      return NextResponse.json({ error: '源产品与目标产品不能相同' }, { status: 400 })
    }
    if (from === 'chenxi' || to === 'chenxi') {
      return NextResponse.json({ error: '成章通不限次数，不可参与划转' }, { status: 400 })
    }

    const authCode = findAuthorizationCode((code || '').trim().toUpperCase())
    if (!authCode) {
      return NextResponse.json({ error: '授权码不存在' }, { status: 404 })
    }

    // 只能划转自己绑定的码
    const binding = findAuthorizationBindingByUserId(auth.user.id)
    if (!binding || binding.code_id !== authCode.id) {
      return NextResponse.json({ error: '无权操作该授权码' }, { status: 403 })
    }

    const ok = transferCap(authCode.id, from, to, amount)
    if (!ok) {
      return NextResponse.json({ error: '划转失败：源产品剩余次数不足' }, { status: 400 })
    }

    const updated = findAuthorizationCode(authCode.code)
    return NextResponse.json({
      success: true,
      remaining: {
        qiaoxi: updated!.qiaoxi_cap - updated!.qiaoxi_used,
        qiaoyuan: updated!.qiaoyuan_cap - updated!.qiaoyuan_used,
        cxr: updated!.cxr_cap - updated!.cxr_used,
        chenxi: updated!.chenxi_unlimited ? UNLIMITED : 0,
      },
      caps: {
        qiaoxi: updated!.qiaoxi_cap,
        qiaoyuan: updated!.qiaoyuan_cap,
        cxr: updated!.cxr_cap,
        chenxi: updated!.chenxi_unlimited ? UNLIMITED : 0,
      },
    })
  } catch (error) {
    console.error('Transfer error:', error)
    return NextResponse.json({ error: '划转失败' }, { status: 500 })
  }
}
