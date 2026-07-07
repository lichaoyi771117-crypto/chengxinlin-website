'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowRight, Scales, ChartLine, Bank } from '@phosphor-icons/react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

const products = [
  {
    name: '乔曦',
    icon: Scales,
    title: 'AI商业合同审查',
    description: '上传合同，系统直接告诉你签/改/拖/退。不是列风险清单让你自己判断。',
    price: '20元/次起',
    href: '/products/qiaoxi',
    iconBg: 'bg-blue-500/8',
    iconColor: 'text-blue-600',
  },
  {
    name: '峤远',
    icon: ChartLine,
    title: 'AI财务报表分析',
    description: '上传代账会计出的Excel，一分钟拿到专业财务诊断报告。专为中国中小企业非标报表设计。',
    price: '20元/次起',
    href: '/products/qiaoyuan',
    iconBg: 'bg-emerald-500/8',
    iconColor: 'text-emerald-600',
    featured: true,
  },
  {
    name: '程晓融',
    icon: Bank,
    title: 'AI融资体检',
    description: '上传征信报告，5分钟告诉你该往哪贷、为什么。国内唯一借款人端AI融资匹配系统。',
    price: '免费体验',
    href: '/products/chengxiaorong',
    iconBg: 'bg-violet-500/8',
    iconColor: 'text-violet-600',
  },
]

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOutExpo },
  },
}

export function ProductShowcase() {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 md:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs font-medium tracking-[0.22em] uppercase text-copper mb-3"
          >
            AI产品矩阵
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-navy max-w-2xl"
          >
            三款AI产品，
            <br />
            一个逻辑。
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="text-navy text-base font-normal mt-4 max-w-xl leading-relaxed"
          >
            把AI的专业分析能力，变成中小微企业主看得懂、用得起的商业决策。
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {products.map((product) => {
            const Icon = product.icon
            return (
              <motion.div key={product.name} variants={itemVariants}>
                <Card variant={product.featured ? 'featured' : 'default'}>
                  <div className="flex flex-col h-full">
                    <div className={`w-14 h-14 rounded-2xl ${product.iconBg} flex items-center justify-center mb-5`}>
                      <Icon weight="duotone" className={`w-7 h-7 ${product.iconColor}`} />
                    </div>

                    <h3 className="text-lg font-bold mb-1">{product.name} · {product.title}</h3>
                    <p className="text-navy text-sm leading-relaxed mb-6 flex-1 font-normal">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-navy/[0.06]">
                      <span className="text-sm font-bold text-copper">{product.price}</span>
                      <Link href={product.href}>
                        <Button variant={product.featured ? 'copper' : 'secondary'} size="sm" trailingIcon={<ArrowRight weight="bold" className="w-3.5 h-3.5" />}>
                          立即体验
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
