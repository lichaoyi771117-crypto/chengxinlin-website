'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { Handshake, Briefcase, Buildings } from '@phosphor-icons/react'

const services = [
  {
    icon: Handshake,
    title: '融资撮合服务',
    items: ['债务协商：帮企业与银行合法协商展期、减免、分期', '信用修复：协助客户修复征信记录', '融资规划：根据真实财务状况制定中长期方案', '融资撮合：对接合规资金渠道'],
    href: '/services/financing',
  },
  {
    icon: Briefcase,
    title: '企业咨询服务',
    items: ['融资诊断：7维诊断模型分析企业融资能力', '方案设计：制定个性化融资方案', '流程管家：全程跟进融资流程'],
    href: '/services/consulting',
  },
  {
    icon: Buildings,
    title: '企业落地服务',
    items: ['物业费催收：专业团队+标准化流程', '系统开发：数据库+响应链，业务线上化', '软件定制：为小微企业量身打造流程工具'],
    href: '/services/landing',
  },
]

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: easeOutExpo },
  },
}

export function ServiceSplit() {
  return (
    <section className="py-24 md:py-32 bg-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-xs font-medium tracking-[0.22em] uppercase text-copper mb-3"
            >
              产品及服务
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-navy mb-4"
            >
              从看懂你
              <br />
              到解决问题
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-navy text-base leading-relaxed max-w-md font-normal"
            >
              不是帮你跑银行的中介，而是帮你看清为什么跑不通。从诊断到规划到执行到跟踪，每个环节都有交付物和标准。
            </motion.p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-1"
          >
            {services.map((service) => {
              const Icon = service.icon
              return (
                <motion.div key={service.title} variants={itemVariants}>
                  <Link
                    href={service.href}
                    className="group flex items-start gap-4 p-5 -mx-3 hover:bg-white transition-colors duration-300"
                  >
                    <div className="w-10 h-10 rounded-xl bg-copper/[0.08] flex items-center justify-center shrink-0 mt-0.5">
                      <Icon weight="duotone" className="w-5 h-5 text-copper" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-navy group-hover:text-copper transition-colors duration-200 mb-2">
                        {service.title}
                      </h3>
                      <ul className="space-y-1.5">
                        {service.items.map((item) => (
                          <li key={item} className="text-sm text-navy leading-relaxed font-normal">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
