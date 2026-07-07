import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

const landingServices = [
  {
    icon: '🏢',
    title: '物业费催收',
    description: '专业催收服务，提高物业费收缴率',
    features: [
      '专业催收团队',
      '合法合规催收',
      '高收缴率保障',
      '灵活收费模式',
    ],
  },
  {
    icon: '💻',
    title: '系统开发',
    description: '定制化系统开发，提升企业效率',
    features: [
      '需求分析',
      '方案设计',
      '开发实施',
      '运维支持',
    ],
  },
  {
    icon: '📋',
    title: 'OPC服务',
    description: '一站式企业服务，省心省力',
    features: [
      '工商注册',
      '代理记账',
      '税务筹划',
      '资质办理',
    ],
  },
]

export default function LandingPage() {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">企业落地服务</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            一站式企业运营支持，助您专注核心业务
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {landingServices.map((service) => (
            <Card key={service.title} className="text-center">
              <div className="text-5xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <ul className="text-left space-y-2">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-green-500">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        {/* Advantages */}
        <Card className="bg-gradient-to-r from-blue-900 to-blue-700 text-white mb-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6">为什么选择程信霖落地服务？</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <div className="text-3xl mb-3">💰</div>
                <h3 className="font-bold mb-2">成本优势</h3>
                <p className="text-blue-100 text-sm">一站式服务，降低运营成本</p>
              </div>
              <div>
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="font-bold mb-2">效率提升</h3>
                <p className="text-blue-100 text-sm">专业团队，快速响应</p>
              </div>
              <div>
                <div className="text-3xl mb-3">🛡️</div>
                <h3 className="font-bold mb-2">专业保障</h3>
                <p className="text-blue-100 text-sm">合规运营，风险可控</p>
              </div>
              <div>
                <div className="text-3xl mb-3">🤝</div>
                <h3 className="font-bold mb-2">全程服务</h3>
                <p className="text-blue-100 text-sm">从咨询到落地，全程跟进</p>
              </div>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">需要企业服务？</h2>
          <p className="text-gray-600 mb-6">联系我们，获取专业服务方案</p>
          <Link href="/contact">
            <Button size="lg">联系我们</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
