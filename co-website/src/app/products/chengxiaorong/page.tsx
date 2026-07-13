'use client'

import { StreamlitEmbed } from '@/components/features/StreamlitEmbed'
import { Card } from '@/components/ui/Card'
import { TrialUsageWrapper } from '@/components/features/TrialUsageWrapper'
import Link from 'next/link'
import { ArrowRight } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'

export default function ChengxiaorongPage() {
  return (
    <TrialUsageWrapper product="cxr" productName="程晓融">
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">🏦</div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              程晓融 · AI融资体检
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              国内第一个站在借款人立场、用合规方式告诉你该往哪贷、为什么的AI融资顾问
            </p>
            <Link href="/app/chengxiaorong" className="inline-block mt-6">
              <Button variant="copper" size="lg">
                全屏使用 <ArrowRight size={18} className="ml-2" weight="bold" />
              </Button>
            </Link>
          </div>

          <div className="mb-12">
            <StreamlitEmbed
              title="程晓融 · AI融资体检"
              description="上传征信报告，5分钟获取专业融资建议"
              url={process.env.NEXT_PUBLIC_CXR_URL || 'http://localhost:8090'}
              icon="🏦"
              healthPort="8090"
              fullscreenHref="/app/chengxiaorong"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card>
              <h3 className="text-xl font-bold text-gray-900 mb-3">本地OCR解析</h3>
              <p className="text-gray-600">
                采用PaddleOCR本地解析征信报告，数据不出店，满足金融监管"数据不出店"要求。
              </p>
            </Card>
            <Card>
              <h3 className="text-xl font-bold text-gray-900 mb-3">本地产品库</h3>
              <p className="text-gray-600">
                昆明本地8大类几十款信贷产品库，精准匹配最适合您的融资方案。
              </p>
            </Card>
            <Card>
              <h3 className="text-xl font-bold text-gray-900 mb-3">智能筛选</h3>
              <p className="text-gray-600">
                红绿灯规则引擎自动筛选，三层合规自动过滤，确保推荐方案安全可靠。
              </p>
            </Card>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 md:p-12 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">授权方式</h2>
            <p className="text-center text-gray-600 mb-6">购买一张授权码，畅享程晓融全部功能（各产品各 15 次）</p>
            <div className="text-center">
              <Link href="/authorization/purchase" className="inline-block">
                <Button variant="copper" size="lg">
                  购买授权码 <ArrowRight size={18} className="ml-2" weight="bold" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">使用流程</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">阅读协议</h3>
                <p className="text-sm text-gray-600">签署授权与服务协议</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">上传征信</h3>
                <p className="text-sm text-gray-600">支持PDF、图片格式</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">智能匹配</h3>
                <p className="text-sm text-gray-600">红绿灯规则引擎筛选</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold">4</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">获取报告</h3>
                <p className="text-sm text-gray-600">专业融资建议报告</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-2xl p-8 md:p-12 text-white">
            <h2 className="text-2xl font-bold mb-6 text-center">数据安全保障</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-3">🔒</div>
                <h3 className="font-bold mb-2">全本地处理</h3>
                <p className="text-blue-100 text-sm">原始征信文件不出电脑</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">🛡️</div>
                <h3 className="font-bold mb-2">敏感信息脱敏</h3>
                <p className="text-blue-100 text-sm">仅传脱敏字段至AI分析</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">✅</div>
                <h3 className="font-bold mb-2">合规保障</h3>
                <p className="text-blue-100 text-sm">满足金融监管要求</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TrialUsageWrapper>
  )
}
