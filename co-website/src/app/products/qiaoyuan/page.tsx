'use client'

import { useState } from 'react'
import { StreamlitEmbed } from '@/components/features/StreamlitEmbed'
import { Card } from '@/components/ui/Card'
import { TrialUsageWrapper } from '@/components/features/TrialUsageWrapper'
import Link from 'next/link'
import { ArrowRight } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'

export default function QiaoyuanPage() {
  const [fullscreen, setFullscreen] = useState(false)

  return (
    <TrialUsageWrapper product="qiaoyuan" productName="峤远">
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">📊</div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              峤远 · AI财务报表分析
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              国内第一个把代账会计的Excel翻译成商业判断的AI财务分析师
            </p>
          </div>

          <div className="mb-12">
            <StreamlitEmbed
              title="峤远 · AI财务报表分析"
              description="上传报表即出专业财务诊断报告"
              url={process.env.NEXT_PUBLIC_QIAOYUAN_URL || 'http://localhost:8512'}
              icon="📊"
              healthPort="8512"
              fullscreen={fullscreen}
              onToggleFullscreen={setFullscreen}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card>
              <h3 className="text-xl font-bold text-gray-900 mb-3">6种格式自适应</h3>
              <p className="text-gray-600">
                专为中国中小企业非标Excel格式设计，自动识别并解析不同格式的财务报表。
              </p>
            </Card>
            <Card>
              <h3 className="text-xl font-bold text-gray-900 mb-3">7大类20+指标</h3>
              <p className="text-gray-600">
                100%自研中国准则适配版，覆盖盈利能力、偿债能力、运营能力等核心维度。
              </p>
            </Card>
            <Card>
              <h3 className="text-xl font-bold text-gray-900 mb-3">5模块深度解读</h3>
              <p className="text-gray-600">
                从财务数据到商业洞察，生成专业级财务分析报告，助您做出明智决策。
              </p>
            </Card>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 md:p-12 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">授权方式</h2>
            <p className="text-center text-gray-600 mb-6">购买一张授权码，畅享峤远全部功能（各产品各 15 次）</p>
            <div className="text-center">
              <Link href="/authorization/purchase" className="inline-block">
                <Button variant="copper" size="lg">
                  购买授权码 <ArrowRight size={18} className="ml-2" weight="bold" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">分析维度</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="text-center">
                <div className="text-3xl mb-2">💰</div>
                <h3 className="font-bold text-gray-900">盈利能力</h3>
                <p className="text-sm text-gray-600">毛利率、净利率、ROE等</p>
              </Card>
              <Card className="text-center">
                <div className="text-3xl mb-2">📉</div>
                <h3 className="font-bold text-gray-900">偿债能力</h3>
                <p className="text-sm text-gray-600">流动比率、速动比率等</p>
              </Card>
              <Card className="text-center">
                <div className="text-3xl mb-2">🔄</div>
                <h3 className="font-bold text-gray-900">运营能力</h3>
                <p className="text-sm text-gray-600">周转率、存货周转等</p>
              </Card>
              <Card className="text-center">
                <div className="text-3xl mb-2">📈</div>
                <h3 className="font-bold text-gray-900">成长能力</h3>
                <p className="text-sm text-gray-600">营收增长率、利润增长率</p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </TrialUsageWrapper>
  )
}
