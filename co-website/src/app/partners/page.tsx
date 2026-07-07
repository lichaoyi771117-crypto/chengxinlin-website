import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

const cooperationModes = [
  {
    title: '推广分账',
    icon: '🤝',
    description: '推广方带来客户，消费金额按比例分账',
    ratio: '30-40%',
    suitable: '协会、商会、园区',
  },
  {
    title: '冠名合作',
    icon: '🏆',
    description: '推广方冠名，程信霖品牌隐名',
    ratio: '协商确定',
    suitable: '有品牌影响力的渠道',
  },
  {
    title: '联合开发',
    icon: '🔧',
    description: '双方联名，双方品牌并列',
    ratio: '协商确定',
    suitable: '深度战略合作',
  },
  {
    title: '白标嵌入',
    icon: '📦',
    description: '推广方自有品牌呈现，系统底层由程信霖驱动',
    ratio: '协商确定',
    suitable: '有自有客户池的服务商',
  },
]

const partnerTypes = [
  {
    icon: '🏛️',
    title: '行业协会合作',
    description: '为协会会员提供AI融资服务，提升会员粘性',
    benefits: ['会员粘性提升', '零成本增收', '数据资产积累'],
  },
  {
    icon: '🏢',
    title: '产业园区合作',
    description: '为园区企业提供融资服务，提升园区服务水平',
    benefits: ['企业服务升级', '园区品牌提升', '招商吸引力增强'],
  },
  {
    icon: '💼',
    title: '专业机构合作',
    description: '与会计师事务所、律所等专业机构合作',
    benefits: ['服务互补', '客户共享', '专业背书'],
  },
]

export default function PartnersPage() {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">合作伙伴</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            携手共建企业融资生态，实现互利共赢
          </p>
        </div>

        {/* Cooperation Modes */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">合作模式</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {cooperationModes.map((mode) => (
              <Card key={mode.title}>
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{mode.icon}</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{mode.title}</h3>
                    <p className="text-gray-600 mb-3">{mode.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                        分账比例：{mode.ratio}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                        适用：{mode.suitable}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Partner Types */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">合作伙伴类型</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {partnerTypes.map((type) => (
              <Card key={type.title} className="text-center">
                <div className="text-5xl mb-4">{type.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{type.title}</h3>
                <p className="text-gray-600 mb-4">{type.description}</p>
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm font-medium text-gray-700 mb-2">合作价值：</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {type.benefits.map((benefit) => (
                      <span key={benefit} className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Cooperation Process */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">合作流程</h2>
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between">
              {['意向提交', '方案沟通', '签约落地'].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-blue-600 text-2xl font-bold">{index + 1}</span>
                    </div>
                    <p className="font-medium text-gray-900">{step}</p>
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block w-24 h-0.5 bg-gray-200 mx-4" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partner Benefits */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">为什么选择成为程信霖合作伙伴？</h2>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div>
                  <div className="text-4xl mb-3">📈</div>
                  <h3 className="font-bold mb-2">零成本增收</h3>
                  <p className="text-blue-100 text-sm">无需投入，通过推广获得分账收入</p>
                </div>
                <div>
                  <div className="text-4xl mb-3">🎯</div>
                  <h3 className="font-bold mb-2">会员粘性提升</h3>
                  <p className="text-blue-100 text-sm">为会员提供实用AI工具，提升会员活跃度</p>
                </div>
                <div>
                  <div className="text-4xl mb-3">💼</div>
                  <h3 className="font-bold mb-2">专业背书</h3>
                  <p className="text-blue-100 text-sm">与专业金融AI公司合作，提升品牌形象</p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">准备好开始合作了吗？</h2>
          <p className="text-gray-600 mb-6">填写合作意向表单，我们会在24小时内与您联系</p>
          <Link href="/contact">
            <Button size="lg">提交合作意向</Button>
          </Link>
        </section>
      </div>
    </div>
  )
}
