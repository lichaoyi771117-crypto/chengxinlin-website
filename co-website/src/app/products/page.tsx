import { Card } from '@/components/ui/Card'
import Link from 'next/link'

const products = [
  {
    name: '乔曦',
    icon: '⚖️',
    title: 'AI商业合同审查',
    description: '国内首个把"能不能签"四个字写进答案的AI商业合同决策系统',
    features: [
      '九阶段审查管线',
      '签/改/拖/退四选一决策输出',
      '55,088条中国法律法规本地检索',
      '8类敏感信息自动脱敏',
    ],
    price: '¥20/次起',
    href: '/products/qiaoxi',
    color: 'from-violet-400/70 to-violet-600/60',
  },
  {
    name: '峤远',
    icon: '📊',
    title: 'AI财务报表分析',
    description: '国内第一个把代账会计的Excel翻译成商业判断的AI财务分析师',
    features: [
      '自动识别6种非标Excel格式',
      '80+中国会计准则科目映射',
      '7大类20+财务指标计算',
      '5模块深度解读报告',
    ],
    price: '¥20/次起',
    href: '/products/qiaoyuan',
    color: 'from-emerald-400/70 to-emerald-600/60',
  },
  {
    name: '程晓融',
    icon: '🏦',
    title: 'AI融资体检',
    description: '国内第一个站在借款人立场、用合规方式告诉你该往哪贷、为什么的AI融资顾问',
    features: [
      '本地OCR解析征信报告',
      '昆明本地8大类几十款信贷产品库',
      '红绿灯规则引擎自动筛选',
      '三层合规自动过滤',
    ],
    price: '免费体验',
    href: '/products/chengxiaorong',
    color: 'from-blue-400/70 to-blue-600/60',
  },
]

export default function ProductsPage() {
  return (
    <div className="pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-navy mb-4">
            AI产品矩阵
          </h1>
          <p className="text-lg text-navy/70 max-w-3xl mx-auto font-normal">
            三款自研AI商业决策产品，覆盖合同审查、财务分析、融资体检全场景
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product) => (
            <Link key={product.href} href={product.href}>
              <Card className="h-full cursor-pointer hover:shadow-xl">
                <div className={`bg-gradient-to-r ${product.color} text-white p-6 rounded-xl mb-6`}>
                  <span className="text-3xl">{product.icon}</span>
                </div>
                <h2 className="text-2xl font-bold text-navy mb-2">
                  {product.name} · {product.title}
                </h2>
                <p className="text-navy/70 mb-6 font-normal leading-relaxed">{product.description}</p>
                <ul className="space-y-2 mb-6">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-navy/70">
                      <span className="text-copper mt-0.5 font-bold">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="pt-4 border-t border-navy/[0.06] flex items-center justify-between">
                  <span className="text-copper font-bold text-lg">{product.price}</span>
                  <span className="text-copper font-medium text-sm">了解详情 →</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-16 bg-[#1a2d4a] rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4">
            所有产品均支持本地处理
          </h2>
          <p className="text-blue-100/90 text-lg mb-6 max-w-2xl mx-auto font-normal">
            您的数据安全是我们的首要承诺。所有敏感信息自动脱敏，原始文件不出电脑。
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-blue-100/90">
            <div className="flex items-center gap-2">
              <span className="text-copper text-xl">✓</span>
              <span className="font-normal">AES-256加密</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-copper text-xl">✓</span>
              <span className="font-normal">WORM审计日志</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-copper text-xl">✓</span>
              <span className="font-normal">本地处理，数据不出店</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
