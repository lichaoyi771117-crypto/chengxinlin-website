import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

const consultingServices = [
  {
    icon: '🔍',
    title: '融资诊断',
    description: '全面分析企业融资能力，找出融资障碍',
    details: [
      '企业财务状况分析',
      '融资能力评估',
      '融资障碍诊断',
      '改进方向建议',
    ],
  },
  {
    icon: '📋',
    title: '方案设计',
    description: '制定个性化融资方案，降低融资成本',
    details: [
      '融资需求分析',
      '产品筛选匹配',
      '成本效益分析',
      '风险评估',
    ],
  },
  {
    icon: '👔',
    title: '流程管家',
    description: '全程跟进融资流程，确保顺利放款',
    details: [
      '申请材料准备',
      '银行对接协调',
      '进度跟踪汇报',
      '问题处理',
    ],
  },
]

export default function ConsultingPage() {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">企业咨询服务</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            专业融资诊断，定制专属解决方案
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {consultingServices.map((service) => (
            <Card key={service.title} className="text-center">
              <div className="text-5xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <ul className="text-left space-y-2">
                {service.details.map((detail, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-green-500">✓</span>
                    {detail}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        {/* Consulting Value */}
        <Card className="mb-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">咨询价值</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="text-left">
                <h3 className="text-lg font-bold text-gray-900 mb-3">融资诊断能帮您：</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-gray-600">清晰了解自身融资能力</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-gray-600">找出融资障碍和改进方向</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-gray-600">制定科学的融资规划</span>
                  </li>
                </ul>
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-gray-900 mb-3">方案设计能帮您：</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-gray-600">降低融资成本</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-gray-600">提高融资成功率</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-gray-600">规避融资风险</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">需要专业咨询？</h2>
          <p className="text-gray-600 mb-6">预约免费融资诊断，了解您的融资潜力</p>
          <Link href="/contact">
            <Button size="lg">预约诊断</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
