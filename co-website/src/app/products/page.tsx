import { Card } from '@/components/ui/Card'
import Link from 'next/link'

const productImages: Record<string, string> = {
  '/products/qiaoxi': '/images/product-qishentong.jpg',
  '/products/qiaoyuan': '/images/product-qiaoyuan.jpg',
  '/products/chengxiaorong': '/images/product-chengxiaorong.jpg',
  '/products/chenxi': '/images/product-chengzhangtong.jpg',
}

const products = [
  {
    name: '契审通',
    icon: '⚖️',
    title: 'AI商业合同审查',
    description: '国内首个把"能不能签"四个字写进答案的AI商业合同决策系统',
    features: [
      '九阶段审查管线',
      '签/改/拖/退四选一决策输出',
      '55,088条中国法律法规本地检索',
      '8类敏感信息自动脱敏',
    ],
    price: '授权码一码通用',
    href: '/products/qiaoxi',
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
    price: '授权码一码通用',
    href: '/products/qiaoyuan',
  },
  {
    name: '程晓融',
    icon: '🏦',
    title: 'AI融资体检',
    description: '国内首个站在借款人立场、用合规方式告诉你该往哪贷、为什么的AI融资顾问',
    features: [
      '本地OCR解析征信报告',
      '昆明本地8大类几十款信贷产品库',
      '红绿灯规则引擎自动筛选',
      '三层合规自动过滤',
    ],
    price: '授权码一码通用',
    href: '/products/chengxiaorong',
  },
  {
    name: '成章通',
    icon: '📝',
    title: 'AI公文工作台',
    description: '结构驱动 · 国标排版 · 22种公文文种 · GB/T 9704精准排版',
    features: [
      '22种公文文种结构铁律',
      'GB/T 9704-2012全参数排版',
      '四级字体回退机制',
      '2-3轮对话智能起草',
    ],
    price: '授权码一码通用',
    href: '/products/chenxi',
  },
]

export default function ProductsPage() {
  return (
    <div className="pb-12">
      {/* Banner */}
      <div className="relative h-[320px] overflow-hidden mb-12">
        <img src="/images/banner-products.jpg" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-navy/75" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">AI产品矩阵</h1>
          <p className="text-lg text-white/80 max-w-3xl mx-auto font-normal">
            四款自研AI商业决策产品，一张授权码畅享全部
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product) => (
            <Link key={product.href} href={product.href}>
              <Card className="h-full cursor-pointer hover:shadow-xl overflow-hidden p-0">
                <img
                  src={productImages[product.href]}
                  alt={product.name}
                  className="w-full h-44 object-cover"
                />
                <div className="p-6">
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
                    <span className="text-copper font-bold text-sm">{product.price}</span>
                    <span className="text-copper font-medium text-sm">了解详情 →</span>
                  </div>
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
