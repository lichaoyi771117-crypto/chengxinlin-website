'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'

const benefits = [
  {
    icon: '🤖',
    title: 'AI 智能服务',
    desc: '会员专享契审通AI合同审查、峤远AI财务分析、程晓融AI融资体检、成章通公文处理四大智能工具，获得专业级商业决策支持。',
  },
  {
    icon: '📰',
    title: '行业信息优先获取',
    desc: '第一时间获取行业政策解读、市场趋势分析等独家内容，抢占信息先机。',
  },
  {
    icon: '📅',
    title: '活动参与权',
    desc: '优先参加融资对接会、专题培训、企业参访等活动，拓展商业人脉。',
  },
  {
    icon: '🤝',
    title: '专家对接',
    desc: '对接融资顾问、法律专家、财税专家资源，解决企业经营难题。',
  },
]

interface FormData {
  companyName: string
  contactPerson: string
  phone: string
  industry: string
  intro: string
}

const initialFormData: FormData = {
  companyName: '',
  contactPerson: '',
  phone: '',
  industry: '',
  intro: '',
}

export default function MembersPage() {
  const [form, setForm] = useState<FormData>(initialFormData)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.companyName || !form.contactPerson || !form.phone) {
      setError('请填写企业名称、联系人和联系电话')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'membership',
          ...form,
        }),
      })
      if (res.ok) {
        setSubmitted(true)
        setForm(initialFormData)
      } else {
        setError('提交失败，请稍后重试')
      }
    } catch {
      setError('网络错误，请稍后重试')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="pt-28 pb-16 min-h-screen bg-paper">
      <div className="max-w-[860px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-medium tracking-[0.22em] uppercase text-copper mb-4">会员系统</p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-navy mb-4">加入程信霖会员</h1>
          <p className="text-base text-navy/70 max-w-[600px] mx-auto leading-relaxed">
            成为程信霖会员，享受AI智能工具、行业资讯、政企对接等全方位服务
          </p>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {benefits.map((b) => (
            <Card key={b.title}>
              <div className="flex items-start gap-4">
                <span className="text-3xl flex-shrink-0">{b.icon}</span>
                <div>
                  <h3 className="font-serif text-lg font-bold text-navy mb-1">{b.title}</h3>
                  <p className="text-sm text-navy/70 leading-relaxed">{b.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mb-16 py-12 bg-white border border-navy/10">
          <h2 className="font-serif text-2xl font-bold text-navy mb-4">会员专享授权码</h2>
          <p className="text-navy/70 mb-6 max-w-[500px] mx-auto">
            会员将获得专属授权码，解锁全部AI工具的全部功能
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/authorization/purchase">
              <Button variant="copper" size="lg">购买授权码</Button>
            </Link>
            <Link href="/products">
              <Button variant="secondary" size="lg">了解产品</Button>
            </Link>
          </div>
        </div>

        {/* Application Form */}
        <div className="bg-white border border-navy/10 p-8">
          <h2 className="font-serif text-2xl font-bold text-navy mb-6 text-center">会员申请</h2>

          {submitted ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-navy mb-2">申请已提交</h3>
              <p className="text-navy/70">我们会尽快与您联系，请保持电话畅通</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-[500px] mx-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-1">企业名称 *</label>
                <input type="text" required value={form.companyName} onChange={(e) => handleChange('companyName', e.target.value)}
                  className="w-full px-4 py-3 border border-navy/10 focus:border-copper focus:ring-1 focus:ring-copper/30 outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1">联系人 *</label>
                <input type="text" required value={form.contactPerson} onChange={(e) => handleChange('contactPerson', e.target.value)}
                  className="w-full px-4 py-3 border border-navy/10 focus:border-copper focus:ring-1 focus:ring-copper/30 outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1">联系电话 *</label>
                <input type="tel" required value={form.phone} onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-navy/10 focus:border-copper focus:ring-1 focus:ring-copper/30 outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1">所属行业</label>
                <input type="text" value={form.industry} onChange={(e) => handleChange('industry', e.target.value)}
                  className="w-full px-4 py-3 border border-navy/10 focus:border-copper focus:ring-1 focus:ring-copper/30 outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1">企业简介</label>
                <textarea value={form.intro} onChange={(e) => handleChange('intro', e.target.value)} rows={3}
                  className="w-full px-4 py-3 border border-navy/10 focus:border-copper focus:ring-1 focus:ring-copper/30 outline-none text-sm" />
              </div>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <Button type="submit" variant="copper" className="w-full" disabled={submitting}>
                {submitting ? '提交中...' : '提交申请'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
