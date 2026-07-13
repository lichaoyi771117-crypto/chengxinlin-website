'use client'

import { FullscreenEmbed } from '@/components/features/FullscreenEmbed'
import { TrialUsageWrapper } from '@/components/features/TrialUsageWrapper'

export default function QiaoxiFullscreenPage() {
  return (
    <TrialUsageWrapper product="qiaoxi" productName="乔曦·AI商业合同审查">
      <FullscreenEmbed
        title="乔曦·AI商业合同审查"
        url={process.env.NEXT_PUBLIC_QIAOXI_URL || 'http://localhost:8511'}
        healthPort="8511"
        backHref="/products"
      />
    </TrialUsageWrapper>
  )
}
