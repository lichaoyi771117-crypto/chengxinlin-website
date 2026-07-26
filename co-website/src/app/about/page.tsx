import { Card } from '@/components/ui/Card'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

const channels = [
  { icon: '📝', title: '公众号文章', desc: '专业内容科普、行业干货输出，建立品牌专业形象，沉淀私域流量' },
  { icon: '🎬', title: '短视频引流', desc: '短视频平台轻量化内容传播，扩大品牌声量，吸引泛用户群体' },
  { icon: '📡', title: '知识直播', desc: '专业知识分享与互动答疑，实现高意向客户的转化与沉淀' },
]

const coreBusiness = [
  {
    icon: '🏦',
    title: '融资撮合业务',
    subtitle: '面向个人及中小微企业提供债务与融资全链条服务',
    items: [
      { name: '债务协商服务', desc: '债务优化方案支撑、信用修复咨询，帮助客户梳理债务结构、改善信用状况' },
      { name: '对公/对私融资', desc: '个人/企业助贷，对接合规资金渠道，匹配融资需求，提供贷款撮合服务' },
      { name: '融资规划', desc: '根据客户财务状况与发展目标，制定个性化融资方案，优化融资成本与结构' },
    ],
    href: '/services/financing',
  },
  {
    icon: '💼',
    title: '咨询业务',
    subtitle: '专业工具包与定制化服务，提供财务与商业全流程咨询支持',
    items: [
      { name: '标准化工具包', desc: '融资体检、财务分析、商业合同审查等标准化工具，低成本高效率的初步诊断' },
      { name: '定制化咨询', desc: '针对个性化需求，提供一对一深度咨询服务，输出专属解决方案' },
    ],
    href: '/services/consulting',
  },
  {
    icon: '🏢',
    title: '企业落地服务',
    subtitle: '聚焦企业级场景，提供标准化、可规模化的落地服务',
    items: [
      { name: '物业费催收', desc: '专业服务团队，标准化催收流程，为物业企业提供合规、高效的催收服务' },
      { name: '系统开发', desc: '搭建业务数据库与响应链系统，为企业提供数字化管理工具' },
      { name: 'OPC 服务', desc: '定制化流程管理或客户管理工具服务，支撑企业业务高效运转' },
    ],
    href: '/services/landing',
  },
]

const milestones = [
  { year: '2026年6月', event: '完成业务架构纠偏，形成"流量获客→业务承接→服务落地"完整闭环' },
  { year: '2026年', event: '三款AI商业决策产品上线（契审通、峤远、程晓融）' },
  { year: '持续', event: '从传统融资撮合向专业融资顾问转型' },
]

export default function AboutPage() {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-16 relative -mx-4 sm:-mx-6 lg:-mx-8 -mt-12">
          <div className="relative h-[300px] overflow-hidden">
            <img src="/images/banner-about.jpg" alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-navy/70" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">关于我们</h1>
              <p className="text-xl opacity-80 max-w-3xl">
                企业融资生态构建者，专业重塑资本价值
              </p>
            </div>
          </div>
        </div>

        {/* Company Introduction */}
        <section className="mb-16">
          <Card>
            <img src="/images/about-office.jpg" alt="程信霖办公室" className="w-full h-56 object-cover -mx-0 -mt-0 mb-6 rounded-t-xl" />
            <h2 className="text-2xl font-bold text-gray-900 mb-6">公司简介</h2>
            <div className="prose max-w-none text-gray-600 space-y-4">
              <p>
                云南程信霖信息咨询有限公司，定位为企业融资生态构建者，核心团队拥有10-20年银行及头部金融机构从业背景。
              </p>
              <p>
                公司业务以"流量获客—业务承接—服务落地"为核心逻辑，构建了从客户触达、需求响应到企业级服务交付的完整闭环，业务覆盖个人债务优化、融资咨询及企业落地服务三大板块，形成多渠道引流、多产品矩阵、标准化交付的经营模式。
              </p>
            </div>
            </Card>
        </section>

        {/* Business Architecture */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">业务架构</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            通过前端流量渠道获取客户，三大核心业务承接需求，标准化工具与系统支撑交付
          </p>

          {/* Flow Diagram */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12">
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-6 py-4 text-center">
              <div className="text-sm text-blue-600 font-medium">前端入口</div>
              <div className="text-lg font-bold text-blue-900">流量获客</div>
            </div>
            <div className="text-2xl text-blue-400">→</div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-6 py-4 text-center">
              <div className="text-sm text-blue-600 font-medium">业务承接</div>
              <div className="text-lg font-bold text-blue-900">三大核心板块</div>
            </div>
            <div className="text-2xl text-blue-400">→</div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-6 py-4 text-center">
              <div className="text-sm text-blue-600 font-medium">交付支撑</div>
              <div className="text-lg font-bold text-blue-900">标准化落地</div>
            </div>
          </div>
        </section>

        {/* Traffic Channels */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">流量获客渠道</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {channels.map((ch) => (
              <Card key={ch.title} className="text-center">
                <div className="text-4xl mb-3">{ch.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{ch.title}</h3>
                <p className="text-sm text-gray-600">{ch.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Core Business Segments */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">核心业务板块</h2>
          <div className="space-y-8">
            {coreBusiness.map((biz) => (
              <Card key={biz.title}>
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="flex items-center gap-3 md:w-64 shrink-0">
                    <span className="text-4xl">{biz.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{biz.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{biz.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="space-y-3">
                      {biz.items.map((item) => (
                        <div key={item.name} className="flex items-start gap-3">
                          <span className="text-blue-500 mt-1">▸</span>
                          <div>
                            <span className="font-medium text-gray-900">{item.name}</span>
                            <span className="text-gray-500"> — {item.desc}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <Link href={biz.href}>
                        <Button variant="secondary" size="sm">了解详情 →</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">我们的使命</h2>
              <p className="text-gray-600 text-lg">
                让每一家小微企业都能获得专业的融资服务，用AI技术降低金融服务门槛，让融资不再难。
              </p>
            </Card>
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">我们的愿景</h2>
              <p className="text-gray-600 text-lg">
                成为西南地区最专业的企业融资生态构建者，服务超过10万家小微企业。
              </p>
            </Card>
          </div>
        </section>

        {/* Development Milestones */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">发展历程</h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-200" />
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                    <Card>
                      <div className="text-sm text-blue-600 font-medium mb-1">{milestone.year}</div>
                      <p className="text-gray-900">{milestone.event}</p>
                    </Card>
                  </div>
                  <div className="w-4 h-4 bg-blue-600 rounded-full relative z-10" />
                  <div className="w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">核心团队</h2>
          <div className="max-w-3xl mx-auto">
            <Card className="text-center overflow-hidden">
              <img src="/images/about-core-team.jpg" alt="程信霖核心团队" className="w-full h-48 object-cover -mx-0 -mt-0 mb-6" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">程信霖核心团队</h3>
              <p className="text-gray-600 mb-4">10-20年银行及头部金融机构从业背景</p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
                <span>✓ 银行从业经验</span>
                <span>✓ 头部金融机构背景</span>
                <span>✓ 融资行业深耕</span>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}
