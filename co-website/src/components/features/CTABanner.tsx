'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowRight } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'

export function CTABanner() {
  return (
    <section className="py-24 md:py-32 bg-navy text-paper relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-copper/[0.06] rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.35] tracking-[0.03em] mb-6"
        >
          小微企业的问题，
          <br />
          我们自己经历过、看得懂、也解决过。
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="text-paper/60 text-lg mb-10 max-w-xl mx-auto font-normal leading-[1.9]"
        >
          不是卖概念，不是讲玄学&mdash;是帮一个铝业企业识别出合同陷阱，帮一个建筑企业修复征信，帮一个物业企业重新定义融资需求。
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
        >
          <Link href="/products">
            <Button variant="copper" size="lg" trailingIcon={<ArrowRight weight="bold" className="w-4 h-4" />}>
              探索AI产品
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
