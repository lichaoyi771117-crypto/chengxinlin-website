'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'
import { StreamlitEmbed } from '@/components/features/StreamlitEmbed'
import { Card } from '@/components/ui/Card'
import { TrialUsageWrapper } from '@/components/features/TrialUsageWrapper'

export default function ChenxiPage() {
  const [fullscreen, setFullscreen] = useState(false)

  return (
    <TrialUsageWrapper product="chenxi" productName="陈曦">
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">📝</div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              陈曦 · AI公文工作台
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              结构驱动 · 国标排版 · 四角色把关 — 体制内公文起草的精准工具
            </p>
          </div>

          <div className="mb-12">
            <StreamlitEmbed
              title="陈曦 · AI公文工作台"
              description="22种公文文种 · GB/T 9704国标排版 · AI智能起草"
              url={process.env.NEXT_PUBLIC_CHENXI_URL || 'http://localhost:8513'}
              icon="📝"
              healthPort="8513"
              fullscreen={fullscreen}
              onToggleFullscreen={setFullscreen}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card>
              <h3 className="text-xl font-bold text-gray-900 mb-3">22种文种</h3>
              <p className="text-gray-600">
                覆盖15种法定公文（命令、决定、通知、报告、请示等）和7种常见正式材料（简报、汇报、讲话稿等），每种文种都有独立的结构铁律。
              </p>
            </Card>
            <Card>
              <h3 className="text-xl font-bold text-gray-900 mb-3">GB/T 9704国标排版</h3>
              <p className="text-gray-600">
                全参数后处理，页边距精确到毫米级。四级字体回退机制，确保不同系统下版式一致。
              </p>
            </Card>
            <Card>
              <h3 className="text-xl font-bold text-gray-900 mb-3">结构驱动</h3>
              <p className="text-gray-600">
                不依赖范文语料库，以22种文种的&ldquo;文体DNA&rdquo;和&ldquo;结构铁律&rdquo;作为硬约束，AI保证不跑偏。
              </p>
            </Card>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 md:p-12 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">工作流程</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-3">1️⃣</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">选择文种</h3>
                <p className="text-gray-600 text-sm">从22种文种中锁定结构骨架</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">2️⃣</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">对话确认</h3>
                <p className="text-gray-600 text-sm">2-3轮对话，确认具体需求</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">3️⃣</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">AI生成终稿</h3>
                <p className="text-gray-600 text-sm">陈曦协议保证结构合规</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">4️⃣</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">一键导出</h3>
                <p className="text-gray-600 text-sm">GB/T 9704合规.docx文件</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 md:p-12 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">授权方式</h2>
            <p className="text-center text-gray-600 mb-6">购买一张授权码，陈曦不限次数使用</p>
            <div className="text-center">
              <Link href="/authorization/purchase" className="inline-block">
                <Button variant="copper" size="lg">
                  购买授权码 <ArrowRight size={18} className="ml-2" weight="bold" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">支持的文种</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <h3 className="text-lg font-bold text-gray-900 mb-3">法定公文（15种）</h3>
                <p className="text-gray-600 text-sm">
                  命令（令）、决定、决议、公报、公告、通告、通知、通报、报告、请示、批复、意见、议案、函、纪要
                </p>
              </Card>
              <Card>
                <h3 className="text-lg font-bold text-gray-900 mb-3">正式材料（7种）</h3>
                <p className="text-gray-600 text-sm">
                  简报、汇报材料、回复函、情况专报、讲话稿、工作总结、工作方案
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </TrialUsageWrapper>
  )
}
