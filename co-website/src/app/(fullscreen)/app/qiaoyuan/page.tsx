'use client'

import { FullscreenEmbed } from '@/components/features/FullscreenEmbed'
import { TrialUsageWrapper } from '@/components/features/TrialUsageWrapper'

export default function QiaoyuanFullscreenPage() {
  return (
    <TrialUsageWrapper product="qiaoyuan" productName="峤远·AI财务报表分析">
      <FullscreenEmbed
        title="峤远·AI财务报表分析"
        url={process.env.NEXT_PUBLIC_QIAOYUAN_URL || 'http://localhost:8512'}
        healthPort="8512"
        backHref="/products"
      />
    </TrialUsageWrapper>
  )
}
