import { StreamlitEmbed } from '@/components/features/StreamlitEmbed'
import { Card } from '@/components/ui/Card'
import { TrialUsageWrapper } from '@/components/features/TrialUsageWrapper'

export default function QiaoxiPage() {
  return (
    <TrialUsageWrapper product="qiaoxi" productName="乔曦">
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">⚖️</div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              乔曦 · AI商业合同审查
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              国内首个把"能不能签"四个字写进答案的AI商业合同决策系统
            </p>
          </div>

          <div className="mb-12">
            <StreamlitEmbed
              title="乔曦 · AI商业合同审查"
              description="上传合同，一分钟告诉你——能不能签"
              url={process.env.NEXT_PUBLIC_QIAOXI_URL || 'http://localhost:8501'}
              icon="⚖️"
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">定价方案</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-2">基础审查</h3>
                <div className="text-3xl font-bold text-blue-600 mb-4">¥20<span className="text-sm text-gray-500">/次</span></div>
                <p className="text-gray-600 text-sm">合同条款风险分析</p>
              </Card>
              <Card className="text-center border-2 border-blue-600">
                <h3 className="text-lg font-bold text-gray-900 mb-2">高级重构</h3>
                <div className="text-3xl font-bold text-blue-600 mb-4">¥30<span className="text-sm text-gray-500">/次</span></div>
                <p className="text-gray-600 text-sm">审查 + 新合同草案生成</p>
              </Card>
              <Card className="text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-2">完整咨询</h3>
                <div className="text-3xl font-bold text-blue-600 mb-4">¥50<span className="text-sm text-gray-500">/次</span></div>
                <p className="text-gray-600 text-sm">审查 + 重构 + 专业建议</p>
              </Card>
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
