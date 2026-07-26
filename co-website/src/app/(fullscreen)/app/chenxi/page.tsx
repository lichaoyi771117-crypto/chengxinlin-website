'use client'

import { FullscreenEmbed } from '@/components/features/FullscreenEmbed'
import { TrialUsageWrapper } from '@/components/features/TrialUsageWrapper'

export default function ChenxiFullscreenPage() {
  return (
    <TrialUsageWrapper product="chenxi" productName="成章通·公文处理平台">
      <FullscreenEmbed
        title="成章通·公文处理平台"
        url={process.env.NEXT_PUBLIC_CHENXI_URL || 'http://localhost:8513'}
        healthPort="8513"
        backHref="/"
      />
    </TrialUsageWrapper>
  )
}
