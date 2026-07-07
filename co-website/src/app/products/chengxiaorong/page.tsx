import { StreamlitEmbed } from '@/components/features/StreamlitEmbed'
import { Card } from '@/components/ui/Card'
import { TrialUsageWrapper } from '@/components/features/TrialUsageWrapper'

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
          </div>

          <div className="mb-12">
            <StreamlitEmbed
              title="程晓融 · AI融资体检"
              description="上传征信报告，5分钟获取专业融资建议"
              url={process.env.NEXT_PUBLIC_CXR_URL || 'http://localhost:8080'}
              icon="🏦"
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">定价方案</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-2">免费版</h3>
                <div className="text-3xl font-bold text-green-600 mb-4">免费</div>
                <p className="text-gray-600 text-sm">OCR解析 + 结构化数据提取</p>
              </Card>
              <Card className="text-center border-2 border-blue-600">
                <h3 className="text-lg font-bold text-gray-900 mb-2">标准版</h3>
                <div className="text-3xl font-bold text-blue-600 mb-4">¥20<span className="text-sm text-gray-500">/次</span></div>
                <p className="text-gray-600 text-sm">完整融资体检报告</p>
              </Card>
              <Card className="text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-2">企业版</h3>
                <div className="text-3xl font-bold text-blue-600 mb-4">¥30<span className="text-sm text-gray-500">/次</span></div>
                <p className="text-gray-600 text-sm">多文件融合分析</p>
              </Card>
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
