'use client'

import { motion, type Variants } from 'motion/react'

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number]

/* ===== Reusable scroll-reveal variants ===== */

const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
}

const revealFromBelow: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: easeOutExpo },
  },
}

const revealFromLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: easeOutExpo },
  },
}

const revealFromRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: easeOutExpo },
  },
}

const revealScale: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: easeOutExpo },
  },
}

/* ===== Section wrapper ===== */
function Section({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delayChildren: delay }}
      className={className}
    >
      {children}
    </motion.section>
  )
}

function Eyebrow({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.p
      variants={revealFromBelow}
      transition={{ delay }}
      className="text-xs font-medium tracking-[0.22em] uppercase text-copper mb-3"
    >
      {children}
    </motion.p>
  )
}

function Heading({ children, delay = 0.05 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.h2
      variants={revealFromBelow}
      transition={{ delay }}
      className="font-serif text-[clamp(1.5rem,3vw,2.2rem)] font-bold leading-[1.35] tracking-[0.03em] mb-4"
    >
      {children}
    </motion.h2>
  )
}

function BodyText({ children, delay = 0.1 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.p
      variants={revealFromBelow}
      transition={{ delay }}
      className="text-base font-normal leading-[2] text-navy mb-5"
    >
      {children}
    </motion.p>
  )
}

/* ===== Tag component ===== */
function Tag({ label, hl }: { label: string; hl: boolean }) {
  return (
    <motion.span
      whileHover={{ scale: 1.06 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`text-xs font-medium tracking-[0.06em] px-4 py-2 border cursor-default ${
        hl ? 'border-copper text-copper' : 'border-slate-light text-navy'
      }`}
    >
      {label}
    </motion.span>
  )
}

export default function Home() {
  return (
    <>
      {/* ===== HERO (page entrance — animate once, no scroll) ===== */}
      <section className="min-h-[100dvh] bg-navy text-paper flex flex-col justify-center items-center text-center relative overflow-hidden pt-14">
        {/* Background image */}
        <div className="absolute inset-0">
          <img src="/images/hero-bg.jpg" alt="" className="w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-navy/70" />
        </div>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[15%] left-[25%] w-[400px] h-[400px] bg-copper/[0.04] rounded-full blur-[120px]" />
          <div className="absolute bottom-[15%] right-[25%] w-[350px] h-[350px] bg-copper/[0.03] rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-[560px] mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: easeOutExpo }}
            className="text-sm font-normal tracking-[0.3em] uppercase text-copper mb-12"
          >
            企业宣传手册
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 60, scale: 0.92, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1, ease: easeOutExpo, delay: 0.15 }}
            className="font-serif text-[clamp(2.2rem,5vw,3.2rem)] font-black leading-[1.22] tracking-[0.04em] mb-8 text-white"
          >
            帮小微企业<motion.span className="text-copper" animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 2, ease: 'easeInOut', delay: 1.2 }}>看清问题</motion.span><br />
            找到出路
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 0.6, scaleX: 1 }}
            transition={{ duration: 1, ease: easeOutExpo, delay: 0.4 }}
            className="w-[60px] h-px bg-copper mx-auto mb-10 origin-center"
          />

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeOutExpo, delay: 0.5 }}
            className="text-lg font-normal leading-[1.9] text-paper/70 mb-16"
          >
            融资诊断 · 财务优化 · 合同审查 · 债务协商 · 商业决策<br />
            小微企业的事，有人帮你看清、帮你解决。
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOutExpo, delay: 0.7 }}
          >
            <img src="/logo.jpg" alt="程信霖" className="w-10 h-10 rounded-full object-cover mx-auto mb-3" />
            <p className="font-serif text-xl font-semibold tracking-[0.06em] mb-1">云南程信霖信息咨询有限公司</p>
            <p className="text-xs font-normal tracking-[0.14em] text-paper/40">财务咨询 & 融资顾问 & AI商业决策</p>
          </motion.div>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <Section className="py-28 bg-white">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
          <Eyebrow>我们是谁</Eyebrow>
          <Heading>小微企业的问题，我们自己经历过、看得懂、也解决过</Heading>
          <BodyText>程信霖不是一家坐在办公室里等客户上门的中介。</BodyText>
          <BodyText>
            我们是从融资服务一线走出来的——经历过政策收紧、银行关闸、客户断贷的完整周期。这段经历让我们看清了一件事：<strong className="font-medium text-navy">小微企业面对的问题，从来不只是&ldquo;能不能贷到钱&rdquo;。</strong>
          </BodyText>

          <motion.div variants={revealFromBelow} className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-0 max-w-[600px] my-8">
            {[
              '合同里藏着陷阱，看不出来。',
              '征信报告上几条旧记录，就把续贷路堵死了。',
              '财务报表一团乱麻，银行连看都不想看。',
              '欠了债被催收，不知道怎么跟银行合法协商。',
              '想融资，连自己能贷什么、为什么被拒都不清楚。',
            ].map((item, i) => (
              <motion.p
                key={item}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: easeOutExpo, delay: 0.3 + i * 0.08 }}
                className="text-sm font-normal text-navy leading-[1.7] py-1 border-b border-navy/[0.05]"
              >
                {item}
              </motion.p>
            ))}
          </motion.div>

          <BodyText>
            这些问题，小微企业请不起专职CFO、法务、税务顾问来解决——<strong className="font-medium text-navy">全国5200万小微企业，98%没有专业财务和法务团队。</strong>
          </BodyText>

          <motion.div variants={revealFromBelow} className="my-8">
            <img src="/images/about-team.jpg" alt="程信霖团队" className="w-full h-auto object-cover" />
          </motion.div>

          <motion.div variants={revealScale}
            className="bg-gradient-to-br from-navy/[0.04] to-copper/[0.08] border-l-[3px] border-copper py-6 px-7 my-8"
          >
            <p className="font-serif text-lg font-semibold leading-[1.8] text-navy">
              程信霖做的事很简单：帮你看清问题在哪里，然后帮你想办法走出去。
            </p>
          </motion.div>

          <BodyText>
            不是卖概念，不是讲玄学——是帮一个铝业企业识别出合同陷阱，帮一个建筑企业修复征信，帮一个物业企业重新定义融资需求，帮一个科技企业把劣势讲成优势。<strong className="font-medium text-navy">这些都是已经做过的事。</strong>
          </BodyText>

          <motion.div variants={revealFromBelow} className="flex flex-wrap gap-2.5 mt-8">
            {[
              { label: '专业诊断', hl: true },
              { label: 'AI赋能', hl: false },
              { label: '合规底线', hl: true },
              { label: '客户立场', hl: false },
              { label: '全周期闭环', hl: true },
            ].map((tag) => (
              <Tag key={tag.label} label={tag.label} hl={tag.hl} />
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ===== BUSINESS ARCHITECTURE ===== */}
      <Section className="py-28 bg-paper">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
          <Eyebrow>业务架构全景</Eyebrow>
          <Heading>三大板块，一套闭环——从看懂你到解决问题</Heading>
          <motion.p variants={revealFromBelow}
            className="text-base font-normal leading-[1.9] text-navy max-w-[600px] mb-10"
          >
            程信霖的业务不是零散的&ldquo;什么都能做&rdquo;，而是围绕小微企业需求搭建的完整闭环：<strong className="font-medium text-navy">流量获客 → 业务承接 → 服务落地</strong>，每个环节都有明确的产品和交付标准。
          </motion.p>

          {/* Flow row — staggered */}
          <motion.div variants={revealFromBelow}
            className="flex flex-col sm:flex-row items-center max-w-[640px] mb-12"
          >
            {[
              { label: '前端获客', desc: '自媒体引流', fill: false },
              { label: '业务承接', desc: '三大核心板块', fill: true },
              { label: '服务落地', desc: '标准化交付', fill: false },
            ].map((node, i) => (
              <motion.div
                key={node.label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: easeOutExpo, delay: 0.2 + i * 0.15 }}
                className="flex items-center w-full sm:w-auto"
              >
                <div className={`flex-1 sm:flex-none text-center px-6 py-5 ${node.fill ? 'bg-navy' : 'bg-navy/[0.03]'}`}>
                  <p className={`font-serif text-sm font-bold mb-1 ${node.fill ? 'text-paper' : 'text-navy'}`}>{node.label}</p>
                  <p className={`text-xs leading-[1.5] ${node.fill ? 'text-paper/60' : 'text-slate-light'}`}>{node.desc}</p>
                </div>
                {i < 2 && <span className="text-copper text-lg flex-shrink-0 px-2 sm:px-1.5 sm:rotate-0 rotate-90 py-1">→</span>}
              </motion.div>
            ))}
          </motion.div>

          {/* Channels */}
          <motion.div variants={revealFromBelow} className="mb-10">
            <p className="font-serif text-base font-semibold text-navy mb-3">前端：自媒体引流获客</p>
            <table className="w-full max-w-[560px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="text-left font-medium text-xs tracking-[0.1em] uppercase text-slate-light py-2 border-b-2 border-navy">渠道</th>
                  <th className="text-left font-medium text-xs tracking-[0.1em] uppercase text-slate-light py-2 border-b-2 border-navy">功能</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['公众号文章', '专业深度内容，建立品牌信任，工作日日更'],
                  ['短视频', '融资政策解读、行业干货，轻量化触达泛用户'],
                  ['知识直播', '实时互动答疑，筛选高意向客户'],
                ].map((row, i) => (
                  <motion.tr key={row[0]}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease: easeOutExpo, delay: 0.3 + i * 0.08 }}
                  >
                    <td className="py-2.5 border-b border-navy/[0.06] font-medium text-navy w-[130px]">{row[0]}</td>
                    <td className="py-2.5 border-b border-navy/[0.06] text-navy leading-[1.6]">{row[1]}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          {/* Core business blocks */}
          <motion.div variants={revealFromBelow}>
            <p className="font-serif text-base font-semibold text-navy mt-8 mb-6">核心业务：三大板块</p>

            {[
              {
                num: '01', name: '融资信息撮合',
                summary: '不是帮客户&ldquo;搞到钱&rdquo;的中介，而是帮客户先看清融资条件、规划融资路径，待条件成熟再对接合规资金渠道。',
                items: ['债务协商服务：站在债务人立场，帮企业与银行合法协商展期、减免、分期、重组，并提供信用修复咨询', '融资规划：根据企业真实财务状况，制定中长期融资方案', '个人/企业融资撮合：对接合规资金渠道，匹配融资需求'],
                img: '/images/biz-financing.jpg',
              },
              {
                num: '02', name: '咨询业务',
                summary: null,
                items: ['标准化工具包服务：融资体检、财务报表分析、商业合同审查——AI工具让每个老板都能用得起专业诊断', '定制化咨询服务：一对一深度诊断，输出专属解决方案'],
                img: '/images/biz-consulting.jpg',
              },
              {
                num: '03', name: '企业落地服务',
                summary: null,
                items: ['物业费催收服务：专业团队+标准化流程', '系统开发服务：数据库+响应链系统，业务线上化', '软件定制开发：为小微企业量身打造流程管理工具'],
                img: '/images/biz-delivery.jpg',
              },
            ].map((block, bi) => (
              <motion.div
                key={block.num}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: easeOutExpo, delay: 0.2 + bi * 0.12 }}
                className="mb-8 max-w-[640px]"
              >
                <img
                  src={block.img}
                  alt={block.name}
                  className="w-full h-40 object-cover mb-4 opacity-90"
                />
                <div className="flex items-baseline gap-3 mb-2">
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease: easeOutExpo, delay: 0.3 + bi * 0.12 }}
                    className="font-serif text-2xl font-black text-copper leading-none min-w-[2rem]"
                  >
                    {block.num}
                  </motion.span>
                  <span className="font-serif text-lg font-bold text-navy">{block.name}</span>
                </div>
                {block.summary && (
                  <p className="text-sm font-normal text-navy leading-[1.85] pl-11 mb-2">{block.summary}</p>
                )}
                <ul className="list-none pl-11 space-y-1">
                  {block.items.map((item, ii) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, ease: easeOutExpo, delay: 0.4 + bi * 0.12 + ii * 0.06 }}
                      className="text-sm text-navy leading-[1.8] pl-4 relative
                        before:absolute before:left-0 before:top-[0.65rem] before:w-1 before:h-1 before:bg-copper before:rounded-full"
                    >
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ===== AI PRODUCTS ===== */}
      <Section className="py-28 bg-white">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
          <Eyebrow>AI产品矩阵与特色服务</Eyebrow>
          <Heading>四个AI工具，让专业不再贵——加上一项别人没做的服务</Heading>

          <motion.div variants={revealFromBelow}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
          >
            {[
              { name: '程晓融', sub: 'AI融资体检系统', desc: '上传征信报告，系统自动解读：你能贷什么、为什么被拒、怎么改善。基于昆明200+款真实产品库智能匹配，<strong>国内唯一面向借款人端的合规融资体检工具。</strong>', featured: true, img: '/images/product-chengxiaorong.jpg' },
              { name: '峤远', sub: 'AI财务报表自动分析系统', desc: '上传Excel报表，一键生成偿债、盈利、营运、现金流、破产预警5模块诊断报告。<strong>国内唯一专为中国中小企业非标报表做AI财务分析的产品。</strong>', featured: false, img: '/images/product-qiaoyuan.jpg' },
              { name: '契审通', sub: 'AI商业合同决策系统', desc: '上传合同，系统直接告诉你&ldquo;签/改/拖/退&rdquo;——<strong>国内唯一把决策写进答案的合同审查产品，不是列风险清单让你自己判断。</strong>55,088条法规本地检索，6路独立审计。', featured: false, img: '/images/product-qishentong.jpg' },
              { name: '成章通', sub: 'AI公文工作台', desc: '小微企业老板经常遇到一种窘境：需要给税局写个请示，不会写；需要给工商局报个说明，格式不对；需要发个内部通知，连个合格的秘书都没有——只有还在念高中的女儿帮忙打字。成章通就是为这种窘境设计的。与前三个产品不同，成章通内核是智能Agent：锁定文种、结构铁律、四角色评审（党办/政研/纪检/基层），确保公文合规不踩雷。<strong>22种法定公文全覆盖，GB/T 9704国标排版，连格式都替你搞定。</strong>你只需要说清楚要写什么，剩下的交给成章通。', featured: false, img: '/images/product-chengzhangtong.jpg' },
            ].map((p, pi) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: easeOutExpo, delay: 0.2 + pi * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
                className={`p-7 border cursor-default overflow-hidden ${
                  p.featured
                    ? 'border-copper bg-gradient-to-br from-copper/[0.04] to-white/80'
                    : 'border-navy/[0.07] bg-white'
                }`}
              >
                <img
                  src={p.img}
                  alt={p.name}
                  className="w-full h-36 object-cover -mx-7 -mt-7 mb-5"
                />
                <h3 className="font-serif text-xl font-bold text-navy mb-1">{p.name}</h3>
                <p className="text-xs text-copper tracking-[0.07em] mb-3">{p.sub}</p>
                <div className="text-sm text-navy leading-[1.8] font-normal [&>strong]:font-medium [&>strong]:text-navy" dangerouslySetInnerHTML={{ __html: p.desc }} />
              </motion.div>
            ))}
          </motion.div>

          {/* Special: Debt */}
          <motion.div variants={revealScale}
            className="p-8 bg-gradient-to-br from-navy/[0.03] to-copper/[0.05] border-t-[3px] border-copper"
          >
            <img
              src="/images/service-debt.jpg"
              alt="债务沟通"
              className="w-full h-44 object-cover -mx-8 -mt-8 mb-6"
            />
            <h3 className="font-serif text-lg font-bold text-navy mb-3">特色服务：债务沟通</h3>
            <p className="text-sm text-navy leading-[1.9] font-normal mb-3">
              <strong className="font-medium text-navy">全国1.2亿逾期债务人，几乎没有人帮他们合法说话。</strong>
            </p>
            <p className="text-sm text-navy leading-[1.9] font-normal mb-3">
              程信霖的债务沟通产品，不是催收，不是逃债——是站在债务人立场，运用法律+金融+谈判三重专业能力，帮债务人与银行协商展期、减免、分期、重组。
            </p>
            <p className="text-sm text-navy leading-[1.9] font-normal mb-3">
              四级标准化服务体系：免费咨询→诊断评估→方案制定→全程顾问
            </p>
            <p className="text-sm text-navy leading-[1.9] font-normal mb-4">
              已接单处理，正在建立专业团队。这条赛道上，几乎没有合规的专业服务机构。
            </p>
            <div className="flex flex-wrap gap-2.5 mt-4">
              {['免费咨询', '诊断评估', '方案制定', '全程顾问'].map((step) => (
                <span key={step} className="text-xs font-medium tracking-[0.05em] px-3.5 py-1.5 border border-slate-light text-navy">
                  {step}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </Section>

      {/* ===== ADVANTAGES + CASES ===== */}
      <Section className="py-28 bg-paper">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
          <Eyebrow>核心竞争力</Eyebrow>
          <Heading>我们做过什么，比我们说什么更重要</Heading>

          <motion.table variants={revealFromBelow}
            className="w-full border-collapse text-sm mb-14"
          >
            <thead>
              <tr>
                <th className="text-left font-medium text-xs tracking-[0.1em] uppercase text-slate-light py-3 border-b-2 border-navy">优势</th>
                <th className="text-left font-medium text-xs tracking-[0.1em] uppercase text-slate-light py-3 border-b-2 border-navy">说明</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: '专业诊断能力', desc: '核心团队10-20年银行及头部金融机构背景，独创7维诊断模型——不是&ldquo;帮你跑银行&rdquo;，而是&ldquo;帮你看清为什么跑不通&rdquo;' },
                { label: 'AI+人双重交付', desc: 'AI工具做标准化诊断，人工顾问做深度方案——低门槛进入，高专业落地' },
                { label: '全周期闭环', desc: '从诊断→规划→执行→跟踪，每个环节都有交付物和标准，不是单点服务而是完整路径' },
                { label: '客户立场', desc: '债务沟通帮债务人说话，合同审查帮老板决策，融资规划帮企业看清——我们站在客户这边' },
                { label: '合规底线', desc: '不包装材料、不伪造流水、不代客投诉——靠专业解决问题，不靠灰色操作' },
              ].map((adv, ai) => (
                <motion.tr key={adv.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: easeOutExpo, delay: 0.25 + ai * 0.08 }}
                >
                  <td className="py-3 border-b border-navy/[0.06] font-semibold text-navy w-[160px] text-sm">{adv.label}</td>
                  <td className="py-3 border-b border-navy/[0.06] text-navy leading-[1.7]">{adv.desc}</td>
                </motion.tr>
              ))}
            </tbody>
          </motion.table>

          <motion.p variants={revealFromBelow}
            className="text-xs font-medium tracking-[0.12em] uppercase text-copper mt-4 mb-6"
          >
            服务案例（脱敏）
          </motion.p>

          <motion.div variants={revealFromBelow}>
            {[
              { heading: '某铝业加工企业——2小时识别合同陷阱', text: '客户濒临绝境时签订了一份高风险采购合同。程信霖当天识别异常信号，深度尽调确认对方为空壳公司，紧急发出风险提示并重建交易架构——避免30万定金损失+110万恶意债务陷阱。' },
              { heading: '某建筑企业——征信修复方案', text: '企业征信&ldquo;花了&rdquo;——历史不良记录已结清但仍在报告中持续展示，导致续贷屡被拒。程信霖设计四阶段修复路线+15份交付文件清单，收费仅为行业竞品的1/3。' },
              { heading: '某大型物业企业——融资需求重新定义', text: '企业营收略降、应收高、诉讼多——银行看到的是&ldquo;经营恶化&rdquo;。程信霖将这一特征重新定义为&ldquo;战略转型的正常财务反映&rdquo;，从银行视角编写融资需求说明，为银企沟通打开通道。' },
              { heading: '某教育集团——财务结构优化', text: '教育板块资金被系统性抽离至房地产业务，关联方应收占比97%。程信霖诊断&ldquo;空心化&rdquo;趋势，设计合规框架内的报表结构调整方案，将核心业务与高风险关联方风险隔离。' },
              { heading: '某科技农业企业——劣势转优势', text: '亏损、高负债、无抵押物——传统融资路全堵死。程信霖将亏损重新定位为&ldquo;研发投入期&rdquo;，将高负债解释为&ldquo;行业垫资模式+政府客户背书&rdquo;，匹配4条差异化融资路径，首轮目标200-400万。' },
            ].map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: easeOutExpo, delay: 0.2 + i * 0.08 }}
                className="py-6 border-b border-navy/[0.06] first:border-t"
              >
                <p className="text-xs font-medium tracking-[0.12em] uppercase text-copper mb-1">案例 {i + 1}</p>
                <p className="font-serif text-base font-bold text-navy mb-1.5">{c.heading}</p>
                <p className="text-sm text-navy leading-[1.85] font-normal">{c.text}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Closing */}
          <motion.div variants={revealFromBelow}
            className="text-center pt-16 border-t border-navy/[0.06] mt-8"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: easeOutExpo }}
              className="font-serif text-lg font-normal leading-[2] text-navy mb-3 max-w-[600px] mx-auto"
            >
              小微企业面对的问题从来不是单一的——合同有陷阱、征信有记录、财务有漏洞、债务有压力、融资有障碍。每一个问题背后，都是一家企业在生死线上挣扎。
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: easeOutExpo, delay: 0.1 }}
              className="font-serif text-lg font-normal leading-[2] text-navy mb-3 max-w-[600px] mx-auto"
            >
              程信霖不卖玄学，不讲概念。我们做的事情很具体：帮你看清问题在哪里，然后帮你想办法走出去。
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: easeOutExpo, delay: 0.2 }}
              className="font-serif text-lg font-bold leading-[2] text-navy max-w-[600px] mx-auto"
            >
              这不是承诺，是已经做过的事。
            </motion.p>
          </motion.div>
        </div>
      </Section>

      {/* ===== CONTACT ===== */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: easeOutExpo }}
        className="py-28 bg-navy text-paper text-center"
      >
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: easeOutExpo }}
            className="text-xs font-medium tracking-[0.22em] uppercase text-copper mb-12"
          >
            联系方式
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: easeOutExpo, delay: 0.15 }}
            className="max-w-[500px] mx-auto bg-navy border border-white/[0.06] py-10 px-8 text-left"
          >
            <h3 className="font-serif text-xl font-bold mb-2">云南程信霖信息咨询有限公司</h3>
            <p className="text-xs text-paper/50 mb-8 tracking-[0.06em]">财务咨询 & 融资顾问 & AI商业决策</p>
            <img src="/logo.jpg" alt="程信霖融途" className="w-14 h-14 rounded-full object-cover mx-auto mb-6" />
            {[
              ['联系人：', '余磊'],
              ['电话：', '13987671259'],
              ['电子邮箱：', '425448719@qq.com'],
              ['微信公众号：', '程信霖融途'],
              ['地址：', '昆明市五华区华龙人家1栋2单元105号临街商铺'],
            ].map(([label, value], i) => (
              <motion.p
                key={label}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: easeOutExpo, delay: 0.3 + i * 0.08 }}
                className="text-sm font-normal text-paper/70 text-left"
              >
                <strong className="font-medium text-copper-light">{label}</strong>{value}
              </motion.p>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ===== FOOTER NOTE ===== */}
      <div className="py-12 bg-navy border-t border-paper/[0.06] text-center">
        <p className="text-xs text-paper/40 tracking-[0.06em]">
          全文完 · 程信霖信息咨询 · CHENGXINLIN CONSULTING
        </p>
      </div>
    </>
  )
}
