'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/Button'

export function HeroSection() {
  return (
    <section className="relative min-h-[100dvh] flex items-center bg-navy text-paper overflow-hidden">
      {/* Ambient copper glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[15%] left-[25%] w-[400px] h-[400px] bg-copper/[0.06] rounded-full blur-[120px]" />
        <div className="absolute bottom-[15%] right-[25%] w-[350px] h-[350px] bg-copper/[0.04] rounded-full blur-[100px]" />
      </div>

      {/* Subtle decorative mark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] opacity-[0.04] pointer-events-none">
        <svg viewBox="0 0 360 360" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="180" cy="180" r="160" stroke="white" strokeWidth="0.5" opacity="0.4"/>
          <circle cx="180" cy="180" r="120" stroke="white" strokeWidth="0.5" opacity="0.25"/>
          <circle cx="180" cy="100" r="5" fill="white" opacity="0.4"/>
          <line x1="180" y1="180" x2="180" y2="60" stroke="white" strokeWidth="0.5" opacity="0.25"/>
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 w-full">
        <div className="max-w-[560px]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm font-normal tracking-[0.3em] uppercase text-copper mb-12"
          >
            企业宣传手册
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="font-serif text-[clamp(2.2rem,5vw,3.2rem)] font-black leading-[1.22] tracking-[0.04em] mb-8 text-white"
          >
            帮小微企业<span className="text-copper">看清问题</span><br />
            找到出路
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-[60px] h-px bg-copper mb-10 opacity-60"
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            className="text-lg font-normal leading-[1.9] text-paper/70 mb-16"
          >
            融资诊断 · 财务优化 · 合同审查 · 债务协商 · 商业决策<br />
            小微企业的事，有人帮你看清、帮你解决。
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="flex flex-wrap gap-4"
          >
            <Link href="/products/chengxiaorong">
              <Button variant="copper" size="lg">免费融资体检</Button>
            </Link>
            <Link href="/products">
              <Button variant="ghost-light" size="lg">了解AI产品</Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
