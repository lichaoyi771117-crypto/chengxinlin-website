'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { FileText, ChartBar, CreditCard } from '@phosphor-icons/react'
import { Card } from '@/components/ui/Card'

const painPoints = [
  {
    icon: FileText,
    title: '合同看不懂，不敢签',
    description: '98%的小微企业没有法务。一份合同审查律师费2000-5000元，等3-5天。签了才发现吃亏。',
    solution: '乔曦：一分钟判断能不能签',
    href: '/products/qiaoxi',
    span: 'md:col-span-2 md:row-span-1',
  },
  {
    icon: CreditCard,
    title: '融资难，不知道找谁',
    description: '想去银行贷款，报表拿不出来，征信看不懂。传统助贷中介抽佣1-3%，推荐靠经验。',
    solution: '程晓融：5分钟获取融资体检报告',
    href: '/products/chengxiaorong',
    span: 'md:col-span-1 md:row-span-1',
  },
  {
    icon: ChartBar,
    title: '报表看不懂，经营没底',
    description: '代账公司每月出一张Excel，老板看不懂，问会计也说不出所以然。现金流要断了才发现。',
    solution: '峤远：上传报表即出财务诊断',
    href: '/products/qiaoyuan',
    span: 'md:col-span-1 md:row-span-1',
  },
]

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOutExpo },
  },
}

export function PainPointBento() {
  return (
    <section className="py-24 md:py-32 bg-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 md:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs font-medium tracking-[0.22em] uppercase text-copper mb-3"
          >
            企业痛点
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-navy max-w-2xl"
          >
            您正在面临的困境，
            <br />
            我们有解。
          </motion.h2>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5"
        >
          {painPoints.map((point) => {
            const Icon = point.icon
            return (
              <motion.div key={point.title} variants={itemVariants} className={point.span}>
                <Link href={point.href} className="block h-full">
                  <Card>
                    <div className="flex flex-col h-full">
                      <div className="w-12 h-12 rounded-2xl bg-copper/[0.08] flex items-center justify-center mb-5">
                        <Icon weight="duotone" className="w-6 h-6 text-copper" />
                      </div>
                      <h3 className="text-lg font-bold mb-2">{point.title}</h3>
                      <p className="text-navy text-sm leading-relaxed mb-5 flex-1 font-normal">
                        {point.description}
                      </p>
                      <div className="pt-4 border-t border-navy/[0.06]">
                        <p className="text-sm font-semibold text-copper">
                          {point.solution}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
