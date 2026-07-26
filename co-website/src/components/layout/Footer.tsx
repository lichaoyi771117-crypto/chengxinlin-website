import Link from 'next/link'

const footerLinks = {
  products: [
    { label: '契审通 · AI合同审查', href: '/products/qiaoxi' },
    { label: '峤远 · AI财报分析', href: '/products/qiaoyuan' },
    { label: '程晓融 · AI融资体检', href: '/products/chengxiaorong' },
    { label: '成章通 · 公文处理平台', href: '/products/chenxi' },
  ],
  services: [
    { label: '融资撮合服务', href: '/services/financing' },
    { label: '企业咨询服务', href: '/services/consulting' },
    { label: '企业落地服务', href: '/services/landing' },
  ],
  company: [
    { label: '关于我们', href: '/about' },
    { label: '企业宣传手册', href: '/brochure' },
    { label: '行业洞察', href: '/insights' },
    { label: '购买授权码', href: '/authorization/purchase' },
    { label: '合作伙伴', href: '/partners' },
    { label: '联系我们', href: '/contact' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-navy text-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <img src="/logo.jpg" alt="程信霖" className="w-8 h-8 rounded-full object-cover" />
              <span className="text-lg font-serif font-bold text-copper tracking-wider">程信霖</span>
            </div>
            <p className="text-paper/40 text-xs leading-relaxed mt-3 tracking-wider">
              帮小微企业看清问题
              <br />
              找到出路
            </p>
          </div>

          {/* AI Products */}
          <div>
            <h3 className="text-xs font-medium text-copper-light uppercase tracking-[0.15em] mb-4">AI产品</h3>
            <ul className="space-y-2.5">
              {footerLinks.products.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-paper/50 hover:text-copper text-xs transition-colors duration-300 tracking-wider">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xs font-medium text-copper-light uppercase tracking-[0.15em] mb-4">专业服务</h3>
            <ul className="space-y-2.5">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-paper/50 hover:text-copper text-xs transition-colors duration-300 tracking-wider">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-medium text-copper-light uppercase tracking-[0.15em] mb-4">公司</h3>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-paper/50 hover:text-copper text-xs transition-colors duration-300 tracking-wider">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-paper/[0.06] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-paper/30 text-xs tracking-wider">
              2026 云南程信霖信息咨询有限公司
            </p>
            <p className="text-paper/20 text-xs mt-1 tracking-wider">
              联系人：余磊 &nbsp;|&nbsp; 13987671259 &nbsp;|&nbsp; 425448719@qq.com &nbsp;|&nbsp; 昆明市五华区华龙人家1栋2单元105号临街商铺
            </p>
          </div>
          <div className="flex gap-6 text-xs text-paper/20">
            <Link href="/admin/articles" className="hover:text-paper/60 transition-colors duration-300">管理</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
