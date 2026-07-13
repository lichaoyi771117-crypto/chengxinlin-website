'use client'

import { FullscreenEmbed } from '@/components/features/FullscreenEmbed'
import { TrialUsageWrapper } from '@/components/features/TrialUsageWrapper'

export default function ChengxiaorongFullscreenPage() {
  return (
    <TrialUsageWrapper product="cxr" productName="程晓融·AI融资体检">
      <FullscreenEmbed
        title="程晓融·AI融资体检"
        url={process.env.NEXT_PUBLIC_CXR_URL || 'http://localhost:8090'}
        healthPort="8090"
        backHref="/products"
      />
    </TrialUsageWrapper>
  )
}
