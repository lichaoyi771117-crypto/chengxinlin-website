'use client'

import { useState } from 'react'
import { StreamlitEmbed } from '@/components/features/StreamlitEmbed'
import { Card } from '@/components/ui/Card'
import { TrialUsageWrapper } from '@/components/features/TrialUsageWrapper'
import Link from 'next/link'
import { ArrowRight } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'

export default function QiaoxiPage() {
  const [fullscreen, setFullscreen] = useState(false)

  return (
    <TrialUsageWrapper product="qiaoxi" productName="契审通">
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">⚖️</div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              契审通 · AI商业合同审查
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              国内首个把"能不能签"四个字写进答案的AI商业合同决策系统
            </p>
          </div>

          <div className="mb-12">
            <StreamlitEmbed
              title="契审通 · AI商业合同审查"
              description="上传合同，一分钟告诉你——能不能签"
              url={process.env.NEXT_PUBLIC_QIAOXI_URL || 'http://localhost:8511'}
              icon="⚖️"
              healthPort="8511"
              fullscreen={fullscreen}
              onToggleFullscreen={setFullscreen}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card>
              <h3 className="text-xl font-bold text-gray-900 mb-3">签/改/拖/退</h3>
              <p className="text-gray-600">
                国内唯一输出商业决策的合同审查系统，直接告诉你这份合同该签、该改、该拖、还是该退。
              </p>
            </Card>
            <Card>
              <h3 className="text-xl font-bold text-gray-900 mb-3">55,088条法规</h3>
              <p className="text-gray-600">
                纯本地RAG检索，覆盖中国现行法律法规，零外部API调用，确保数据安全。
              </p>
            </Card>
            <Card>
              <h3 className="text-xl font-bold text-gray-900 mb-3">数据安全</h3>
              <p className="text-gray-600">
                本地处理，原始文件不出电脑。8类敏感信息自动脱敏，AES-256加密。
              </p>
            </Card>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 md:p-12 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">授权方式</h2>
            <p className="text-center text-gray-600 mb-6">购买一张授权码，畅享契审通全部功能（各产品各 15 次）</p>
            <div className="text-center">
              <Link href="/authorization/purchase" className="inline-block">
                <Button variant="copper" size="lg">
                  购买授权码 <ArrowRight size={18} className="ml-2" weight="bold" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">适用场景</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <h3 className="text-lg font-bold text-gray-900 mb-2">📄 商业合同</h3>
                <p className="text-gray-600">采购合同、销售合同、服务合同、合作协议等</p>
              </Card>
              <Card>
                <h3 className="text-lg font-bold text-gray-900 mb-2">📝 劳动合同</h3>
                <p className="text-gray-600">员工入职合同、竞业协议、保密协议等</p>
              </Card>
              <Card>
                <h3 className="text-lg font-bold text-gray-900 mb-2">🏠 租赁合同</h3>
                <p className="text-gray-600">办公场地租赁、设备租赁、仓库租赁等</p>
              </Card>
              <Card>
                <h3 className="text-lg font-bold text-gray-900 mb-2">🤝 合作协议</h3>
                <p className="text-gray-600">战略合作、渠道合作、技术合作等</p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </TrialUsageWrapper>
  )
}
