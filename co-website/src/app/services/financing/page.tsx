import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

const financingServices = [
  {
    icon: '💰',
    title: '债务协商',
    description: '帮助客户与银行协商还款方案，降低还款压力',
    features: [
      '分析现有债务结构',
      '制定协商策略',
      '与银行沟通谈判',
      '达成还款协议',
    ],
  },
  {
    icon: '📈',
    title: '信用修复',
    description: '协助客户修复征信记录，重建信用',
    features: [
      '征信报告分析',
      '异议申请指导',
      '信用重建方案',
      '持续跟踪服务',
    ],
  },
  {
    icon: '📋',
    title: '融资规划',
    description: '根据客户需求制定融资方案',
    features: [
      '融资需求分析',
      '融资方案设计',
      '成本效益分析',
      '风险评估',
    ],
  },
  {
    icon: '🤝',
    title: '融资撮合',
    description: '匹配最适合的融资产品',
    features: [
      '产品筛选匹配',
      '申请材料准备',
      '流程跟进协调',
      '放款后服务',
    ],
  },
]

export default function FinancingPage() {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">融资撮合服务</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            专业团队，为您匹配最优融资方案
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {financingServices.map((service) => (
            <Card key={service.title}>
              <div className="flex items-start gap-4">
                <span className="text-4xl">{service.icon}</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="text-green-500">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Process */}
        <Card className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">服务流程</h2>
          <div className="flex flex-col md:flex-row items-center justify-between max-w-4xl mx-auto">
            {['需求提交', '方案设计', '产品匹配', '材料准备', '银行对接', '放款完成'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-blue-600 font-bold">{index + 1}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{step}</p>
                </div>
                {index < 5 && (
                  <div className="hidden md:block w-8 h-0.5 bg-gray-200 mx-2" />
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Advantages */}
        <Card className="bg-gradient-to-r from-blue-900 to-blue-700 text-white mb-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6">为什么选择程信霖？</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="text-3xl mb-3">🏦</div>
                <h3 className="font-bold mb-2">银行背景团队</h3>
                <p className="text-blue-100 text-sm">10-20年银行及金融机构从业经验</p>
              </div>
              <div>
                <div className="text-3xl mb-3">🤝</div>
                <h3 className="font-bold mb-2">广泛银行资源</h3>
                <p className="text-blue-100 text-sm">与多家银行建立深度合作关系</p>
              </div>
              <div>
                <div className="text-3xl mb-3">📈</div>
                <h3 className="font-bold mb-2">高成功率</h3>
                <p className="text-blue-100 text-sm">专业方案设计，提高融资成功率</p>
              </div>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">需要融资服务？</h2>
          <p className="text-gray-600 mb-6">填写咨询表单，专业顾问为您服务</p>
          <Link href="/contact">
            <Button size="lg">立即咨询</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
