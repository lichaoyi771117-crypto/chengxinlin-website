'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { MapPin, Phone, Envelope, WechatLogo } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    company: '',
    interest: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitResult(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data.success) {
        setSubmitResult({ success: true, message: '感谢您的咨询，我们会尽快联系您！' })
        setFormData({ name: '', phone: '', company: '', interest: '', message: '' })
      } else {
        setSubmitResult({ success: false, message: data.error || '提交失败，请稍后重试' })
      }
    } catch {
      setSubmitResult({ success: false, message: '网络错误，请稍后重试' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeOutExpo }}
          className="text-center mb-16"
        >
          <p className="text-xs font-medium tracking-[0.22em] uppercase text-copper mb-3">联系方式</p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-navy mb-4">联系我们</h1>
          <p className="text-base text-navy font-normal max-w-2xl mx-auto leading-relaxed">云南程信霖信息咨询有限公司</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOutExpo, delay: 0.1 }}
          >
            <Card>
              <h2 className="text-xl font-bold text-navy mb-6">在线咨询</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-navy mb-1">姓名 *</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-navy/[0.12] focus:border-copper focus:ring-1 focus:ring-copper/30 outline-none transition-all text-sm"
                    placeholder="请输入您的姓名" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-1">联系电话 *</label>
                  <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-navy/[0.12] focus:border-copper focus:ring-1 focus:ring-copper/30 outline-none transition-all text-sm"
                    placeholder="请输入您的手机号码" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-1">公司名称</label>
                  <input type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-3 border border-navy/[0.12] focus:border-copper focus:ring-1 focus:ring-copper/30 outline-none transition-all text-sm"
                    placeholder="请输入您的公司名称" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-1">合作意向 *</label>
                  <select required value={formData.interest} onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                    className="w-full px-4 py-3 border border-navy/[0.12] focus:border-copper focus:ring-1 focus:ring-copper/30 outline-none transition-all text-sm">
                    <option value="">请选择</option>
                    <option value="product">了解AI产品</option>
                    <option value="service">咨询服务</option>
                    <option value="partnership">合作洽谈</option>
                    <option value="other">其他</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-1">留言</label>
                  <textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} rows={4}
                    className="w-full px-4 py-3 border border-navy/[0.12] focus:border-copper focus:ring-1 focus:ring-copper/30 outline-none transition-all text-sm"
                    placeholder="请描述您的需求" />
                </div>
                <Button type="submit" variant="copper" className="w-full" disabled={submitting}>
                  {submitting ? '提交中...' : '提交咨询'}
                </Button>
                {submitResult && (
                  <p className={`mt-3 text-sm text-center ${submitResult.success ? 'text-green-600' : 'text-red-500'}`}>
                    {submitResult.message}
                  </p>
                )}
              </form>
            </Card>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOutExpo, delay: 0.2 }}
            className="space-y-6"
          >
            <Card>
              <h2 className="text-xl font-bold text-navy mb-6">联系方式</h2>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-copper/[0.08] flex items-center justify-center shrink-0">
                    <MapPin weight="bold" className="w-5 h-5 text-copper" />
                  </div>
                  <div>
                    <h3 className="font-bold text-navy text-sm mb-1">公司地址</h3>
                    <p className="text-sm text-navy leading-relaxed">昆明市五华区华龙人家1栋2单元105号临街商铺</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-copper/[0.08] flex items-center justify-center shrink-0">
                    <Phone weight="bold" className="w-5 h-5 text-copper" />
                  </div>
                  <div>
                    <h3 className="font-bold text-navy text-sm mb-1">联系人</h3>
                    <p className="text-sm text-navy">余磊 13987671259</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-copper/[0.08] flex items-center justify-center shrink-0">
                    <Envelope weight="bold" className="w-5 h-5 text-copper" />
                  </div>
                  <div>
                    <h3 className="font-bold text-navy text-sm mb-1">电子邮箱</h3>
                    <p className="text-sm text-navy">425448719@qq.com</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="text-xl font-bold text-navy mb-6">关注我们</h2>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-copper/[0.08] flex items-center justify-center shrink-0">
                  <WechatLogo weight="bold" className="w-5 h-5 text-copper" />
                </div>
                <div>
                  <h3 className="font-bold text-navy text-sm mb-1">微信公众号</h3>
                  <p className="text-sm text-copper">程信霖融途</p>
                </div>
              </div>
            </Card>

            <Card className="border-t-[3px] border-copper">
              <h2 className="text-lg font-bold text-navy mb-2">合作洽谈</h2>
              <p className="text-sm text-navy font-normal mb-4 leading-relaxed">
                如果您是行业协会、产业园区、专业机构，欢迎洽谈合作
              </p>
              <Button variant="copper">了解合作模式</Button>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
