'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'

const stats = [
  { value: 15, suffix: '年+', label: '核心团队金融从业经验' },
  { value: 55088, suffix: '', label: '中国法规本地检索库' },
  { value: 3, suffix: '款', label: '自研AI商业决策产品' },
  { value: 100, suffix: '%', label: '本地处理，数据不出电脑' },
]

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!isInView || hasAnimated.current) return
    hasAnimated.current = true

    const duration = 2000
    const startTime = performance.now()

    function update(currentTime: number) {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(eased * target)
      setDisplayValue(current)

      if (progress < 1) {
        requestAnimationFrame(update)
      }
    }

    requestAnimationFrame(update)
  }, [isInView, target])

  return (
    <span ref={ref}>
      {displayValue.toLocaleString()}{suffix}
    </span>
  )
}

export function StatsCounter() {
  return (
    <section className="py-20 md:py-24 bg-navy text-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center md:text-left">
              <div className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-paper mb-2">
                <CountUp target={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-xs text-paper/40 leading-relaxed tracking-wider">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
