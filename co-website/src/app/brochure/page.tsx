'use client'

import Link from 'next/link'
import { motion } from 'motion/react'

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOutExpo, delay: i * 0.06 },
  }),
}

export default function BrochurePage() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="min-h-[100dvh] bg-navy text-paper flex flex-col justify-center items-center text-center relative overflow-hidden pt-14">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[15%] left-[25%] w-[400px] h-[400px] bg-copper/[0.06] rounded-full blur-[120px]" />
          <div className="absolute bottom-[15%] right-[25%] w-[350px] h-[350px] bg-copper/[0.04] rounded-full blur-[100px]" />
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] opacity-[0.04] pointer-events-none">
          <svg viewBox="0 0 360 360" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="180" cy="180" r="160" stroke="white" strokeWidth="0.5" opacity="0.4"/>
            <circle cx="180" cy="180" r="120" stroke="white" strokeWidth="0.5" opacity="0.25"/>
            <circle cx="180" cy="100" r="5" fill="white" opacity="0.4"/>
            <line x1="180" y1="180" x2="180" y2="60" stroke="white" strokeWidth="0.5" opacity="0.25"/>
          </svg>
        </div>

        <div className="relative z-10 max-w-[560px] mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOutExpo }}
            className="text-sm font-normal tracking-[0.3em] uppercase text-copper mb-12"
          >
            企业宣传手册
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeOutExpo, delay: 0.1 }}
            className="font-serif text-[clamp(2.2rem,5vw,3.2rem)] font-black leading-[1.22] tracking-[0.04em] mb-8 text-white"
          >
            帮小微企业<span className="text-copper">看清问题</span><br />
            找到出路
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-[60px] h-px bg-copper mx-auto mb-10 opacity-60"
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOutExpo, delay: 0.25 }}
            className="text-lg font-normal leading-[1.9] text-paper/70 mb-16"
          >
            融资诊断 · 财务优化 · 合同审查 · 债务协商 · 商业决策<br />
            小微企业的事，有人帮你看清、帮你解决。
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p className="font-serif text-xl font-semibold tracking-[0.06em] mb-1">云南程信霖信息咨询有限公司</p>
            <p className="text-xs font-normal tracking-[0.14em] text-paper/40">财务咨询 & 融资顾问 & AI商业决策</p>
          </motion.div>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section className="py-28 bg-white">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.p custom={0} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-xs font-medium tracking-[0.22em] uppercase text-copper mb-3"
          >
            我们是谁
          </motion.p>
          <motion.h2 custom={1} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-serif text-[clamp(1.5rem,3vw,2.2rem)] font-bold leading-[1.35] tracking-[0.03em] mb-4"
          >
            小微企业的问题，我们自己经历过、看得懂、也解决过
          </motion.h2>

          <motion.p custom={2} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-base font-normal leading-[2.1] text-navy mb-6"
          >
            程信霖不是一家坐在办公室里等客户上门的中介。
          </motion.p>

          <motion.p custom={3} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-base font-normal leading-[2.1] text-navy mb-6"
          >
            我们是从融资服务一线走出来的——经历过政策收紧、银行关闸、客户断贷的完整周期。这段经历让我们看清了一件事：<strong className="font-medium text-navy">小微企业面对的问题，从来不只是&ldquo;能不能贷到钱&rdquo;。</strong>
          </motion.p>

          <motion.div custom={4} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-0 max-w-[600px] my-8"
          >
            {[
              '合同里藏着陷阱，看不出来。',
              '征信报告上几条旧记录，就把续贷路堵死了。',
              '财务报表一团乱麻，银行连看都不想看。',
              '欠了债被催收，不知道怎么跟银行合法协商。',
              '想融资，连自己能贷什么、为什么被拒都不清楚。',
            ].map((item) => (
              <p key={item} className="text-sm font-normal text-navy leading-[1.7] py-1 border-b border-navy/[0.05]">
                {item}
              </p>
            ))}
          </motion.div>

          <motion.p custom={5} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-base font-normal leading-[2.1] text-navy mb-6"
          >
            这些问题，小微企业请不起专职CFO、法务、税务顾问来解决——<strong className="font-medium text-navy">全国5200万小微企业，98%没有专业财务和法务团队。</strong>
          </motion.p>

          <motion.div custom={6} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="bg-gradient-to-br from-navy/[0.04] to-copper/[0.08] border-l-[3px] border-copper py-6 px-7 my-8"
          >
            <p className="font-serif text-lg font-semibold leading-[1.8] text-navy">
              程信霖做的事很简单：帮你看清问题在哪里，然后帮你想办法走出去。
            </p>
          </motion.div>

          <motion.p custom={7} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-base font-normal leading-[2.1] text-navy mb-6"
          >
            不是卖概念，不是讲玄学——是帮一个铝业企业识别出合同陷阱，帮一个建筑企业修复征信，帮一个物业企业重新定义融资需求，帮一个科技企业把劣势讲成优势。<strong className="font-medium text-navy">这些都是已经做过的事。</strong>
          </motion.p>

          <motion.div custom={8} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="flex flex-wrap gap-2.5 mt-8"
          >
            {[
              { label: '专业诊断', hl: true },
              { label: 'AI赋能', hl: false },
              { label: '合规底线', hl: true },
              { label: '客户立场', hl: false },
              { label: '全周期闭环', hl: true },
            ].map((tag) => (
              <span key={tag.label}
                className={`text-xs font-medium tracking-[0.06em] px-4 py-2 border ${
                  tag.hl ? 'border-copper text-copper' : 'border-slate-light text-navy'
                }`}
              >
                {tag.label}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== BUSINESS ===== */}
      <section className="py-28 bg-paper">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.p custom={0} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-xs font-medium tracking-[0.22em] uppercase text-copper mb-3"
          >
            业务架构全景
          </motion.p>
          <motion.h2 custom={1} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-serif text-[clamp(1.5rem,3vw,2.2rem)] font-bold leading-[1.35] tracking-[0.03em] mb-4"
          >
            三大板块，一套闭环——从看懂你到解决问题
          </motion.h2>
          <motion.p custom={2} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-base font-normal leading-[1.9] text-navy max-w-[600px] mb-10"
          >
            程信霖的业务不是零散的&ldquo;什么都能做&rdquo;，而是围绕小微企业需求搭建的完整闭环：<strong className="font-medium text-navy">流量获客 → 业务承接 → 服务落地</strong>，每个环节都有明确的产品和交付标准。
          </motion.p>

          <motion.div custom={3} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center max-w-[640px] mb-12"
          >
            {[
              { label: '前端获客', desc: '自媒体引流', fill: false },
              { label: '业务承接', desc: '三大核心板块', fill: true },
              { label: '服务落地', desc: '标准化交付', fill: false },
            ].map((node, i) => (
              <div key={node.label} className="flex items-center w-full sm:w-auto">
                <div className={`flex-1 sm:flex-none text-center px-6 py-5 ${node.fill ? 'bg-navy' : 'bg-navy/[0.03]'}`}>
                  <p className={`font-serif text-sm font-bold mb-1 ${node.fill ? 'text-paper' : 'text-navy'}`}>{node.label}</p>
                  <p className={`text-xs leading-[1.5] ${node.fill ? 'text-paper/60' : 'text-slate-light'}`}>{node.desc}</p>
                </div>
                {i < 2 && <span className="text-copper text-lg flex-shrink-0 px-2 sm:px-1.5 sm:rotate-0 rotate-90 py-1">→</span>}
              </div>
            ))}
          </motion.div>

          <motion.div custom={4} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-10">
            <p className="font-serif text-base font-semibold text-navy mb-3">前端：自媒体引流获客</p>
            <table className="w-full max-w-[560px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="text-left font-medium text-xs tracking-[0.1em] uppercase text-slate-light py-2 border-b-2 border-navy">渠道</th>
                  <th className="text-left font-medium text-xs tracking-[0.1em] uppercase text-slate-light py-2 border-b-2 border-navy">功能</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2.5 border-b border-navy/[0.06] font-medium text-navy w-[130px]">公众号文章</td>
                  <td className="py-2.5 border-b border-navy/[0.06] text-navy leading-[1.6]">专业深度内容，建立品牌信任，工作日日更</td>
                </tr>
                <tr>
                  <td className="py-2.5 border-b border-navy/[0.06] font-medium text-navy">短视频</td>
                  <td className="py-2.5 border-b border-navy/[0.06] text-navy leading-[1.6]">融资政策解读、行业干货，轻量化触达泛用户</td>
                </tr>
                <tr>
                  <td className="py-2.5 border-b border-navy/[0.06] font-medium text-navy">知识直播</td>
                  <td className="py-2.5 border-b border-navy/[0.06] text-navy leading-[1.6]">实时互动答疑，筛选高意向客户</td>
                </tr>
              </tbody>
            </table>
          </motion.div>

          <motion.div custom={5} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="font-serif text-base font-semibold text-navy mt-8 mb-6">核心业务：三大板块</p>

            {[
              {
                num: '01', name: '融资信息撮合',
                summary: '不是帮客户&ldquo;搞到钱&rdquo;的中介，而是帮客户先看清融资条件、规划融资路径，待条件成熟再对接合规资金渠道。',
                items: ['债务协商服务：站在债务人立场，帮企业与银行合法协商展期、减免、分期、重组，并提供信用修复咨询', '融资规划：根据企业真实财务状况，制定中长期融资方案', '个人/企业融资撮合：对接合规资金渠道，匹配融资需求'],
              },
              {
                num: '02', name: '咨询业务',
                summary: null,
                items: ['标准化工具包服务：融资体检、财务报表分析、商业合同审查——AI工具让每个老板都能用得起专业诊断', '定制化咨询服务：一对一深度诊断，输出专属解决方案'],
              },
              {
                num: '03', name: '企业落地服务',
                summary: null,
                items: ['物业费催收服务：专业团队+标准化流程', '系统开发服务：数据库+响应链系统，业务线上化', '软件定制开发：为小微企业量身打造流程管理工具'],
              },
            ].map((block) => (
              <div key={block.num} className="mb-8 max-w-[640px]">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="font-serif text-2xl font-black text-copper leading-none min-w-[2rem]">{block.num}</span>
                  <span className="font-serif text-lg font-bold text-navy">{block.name}</span>
                </div>
                {block.summary && (
                  <p className="text-sm font-normal text-navy leading-[1.85] pl-11 mb-2">{block.summary}</p>
                )}
                <ul className="list-none pl-11 space-y-1">
                  {block.items.map((item) => (
                    <li key={item} className="text-sm text-navy leading-[1.8] pl-4 relative
                      before:absolute before:left-0 before:top-[0.65rem] before:w-1 before:h-1 before:bg-copper before:rounded-full">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== AI PRODUCTS ===== */}
      <section className="py-28 bg-white">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.p custom={0} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-xs font-medium tracking-[0.22em] uppercase text-copper mb-3"
          >
            AI产品矩阵与特色服务
          </motion.p>
          <motion.h2 custom={1} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-serif text-[clamp(1.5rem,3vw,2.2rem)] font-bold leading-[1.35] tracking-[0.03em] mb-10"
          >
            四个AI工具，让专业不再贵——加上一项别人没做的服务
          </motion.h2>

          <motion.div custom={2} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
          >
            {[
              { name: '程晓融', sub: 'AI融资体检系统', desc: '上传征信报告，系统自动解读：你能贷什么、为什么被拒、怎么改善。基于昆明200+款真实产品库智能匹配，<strong>国内唯一面向借款人端的合规融资体检工具。</strong>', featured: true },
              { name: '峤远', sub: 'AI财务报表自动分析系统', desc: '上传Excel报表，一键生成偿债、盈利、营运、现金流、破产预警5模块诊断报告。<strong>国内唯一专为中国中小企业非标报表做AI财务分析的产品。</strong>', featured: false },
              { name: '乔曦', sub: 'AI商业合同决策系统', desc: '上传合同，系统直接告诉你&ldquo;签/改/拖/退&rdquo;——<strong>国内唯一把决策写进答案的合同审查产品，不是列风险清单让你自己判断。</strong>55,088条法规本地检索，6路独立审计。', featured: false },
              { name: '陈曦', sub: 'AI公文工作台', desc: '小微企业老板经常遇到一种窘境：需要给税局写个请示，不会写；需要给工商局报个说明，格式不对；需要发个内部通知，连个合格的秘书都没有。陈曦就是为这种窘境设计的。与前三个产品不同，陈曦内核是智能Agent：锁定文种、结构铁律、四角色评审（党办/政研/纪检/基层），确保公文合规不踩雷。<strong>22种法定公文全覆盖，GB/T 9704国标排版，连格式都替你搞定。</strong>你只需要说清楚要写什么，剩下的交给陈曦。', featured: false },
            ].map((p) => (
              <div key={p.name}
                className={`p-7 border ${
                  p.featured
                    ? 'border-copper bg-gradient-to-br from-copper/[0.04] to-white/80'
                    : 'border-navy/[0.07] bg-white'
                }`}
              >
                <h3 className="font-serif text-xl font-bold text-navy mb-1">{p.name}</h3>
                <p className="text-xs text-copper tracking-[0.07em] mb-3">{p.sub}</p>
                <p className="text-sm text-navy leading-[1.8] font-normal" dangerouslySetInnerHTML={{ __html: p.desc }} />
              </div>
            ))}
          </motion.div>

          <motion.div custom={3} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="p-8 bg-gradient-to-br from-navy/[0.03] to-copper/[0.05] border-t-[3px] border-copper"
          >
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
      </section>

      {/* ===== ADVANTAGES + CASES ===== */}
      <section className="py-28 bg-paper">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.p custom={0} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-xs font-medium tracking-[0.22em] uppercase text-copper mb-3"
          >
            核心竞争力
          </motion.p>
          <motion.h2 custom={1} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-serif text-[clamp(1.5rem,3vw,2.2rem)] font-bold leading-[1.35] tracking-[0.03em] mb-8"
          >
            我们做过什么，比我们说什么更重要
          </motion.h2>

          <motion.table custom={2} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
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
              ].map((adv) => (
                <tr key={adv.label}>
                  <td className="py-3 border-b border-navy/[0.06] font-semibold text-navy w-[160px] text-sm">{adv.label}</td>
                  <td className="py-3 border-b border-navy/[0.06] text-navy leading-[1.7]">{adv.desc}</td>
                </tr>
              ))}
            </tbody>
          </motion.table>

          <motion.p custom={3} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-xs font-medium tracking-[0.12em] uppercase text-copper mt-4 mb-6"
          >
            服务案例（脱敏）
          </motion.p>

          <motion.div custom={4} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {[
              { heading: '某铝业加工企业——2小时识别合同陷阱', text: '客户濒临绝境时签订了一份高风险采购合同。程信霖当天识别异常信号，深度尽调确认对方为空壳公司，紧急发出风险提示并重建交易架构——避免30万定金损失+110万恶意债务陷阱。' },
              { heading: '某建筑企业——征信修复方案', text: '企业征信&ldquo;花了&rdquo;——历史不良记录已结清但仍在报告中持续展示，导致续贷屡被拒。程信霖设计四阶段修复路线+15份交付文件清单，收费仅为行业竞品的1/3。' },
              { heading: '某大型物业企业——融资需求重新定义', text: '企业营收略降、应收高、诉讼多——银行看到的是&ldquo;经营恶化&rdquo;。程信霖将这一特征重新定义为&ldquo;战略转型的正常财务反映&rdquo;，从银行视角编写融资需求说明，为银企沟通打开通道。' },
              { heading: '某教育集团——财务结构优化', text: '教育板块资金被系统性抽离至房地产业务，关联方应收占比97%。程信霖诊断&ldquo;空心化&rdquo;趋势，设计合规框架内的报表结构调整方案，将核心业务与高风险关联方风险隔离。' },
              { heading: '某科技农业企业——劣势转优势', text: '亏损、高负债、无抵押物——传统融资路全堵死。程信霖将亏损重新定位为&ldquo;研发投入期&rdquo;，将高负债解释为&ldquo;行业垫资模式+政府客户背书&rdquo;，匹配4条差异化融资路径，首轮目标200-400万。' },
            ].map((c, i) => (
              <div key={i} className="py-6 border-b border-navy/[0.06] first:border-t">
                <p className="text-xs font-medium tracking-[0.12em] uppercase text-copper mb-1">案例 {i + 1}</p>
                <p className="font-serif text-base font-bold text-navy mb-1.5">{c.heading}</p>
                <p className="text-sm text-navy leading-[1.85] font-normal">{c.text}</p>
              </div>
            ))}
          </motion.div>

          <motion.div custom={5} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center pt-16 border-t border-navy/[0.06] mt-8"
          >
            <p className="font-serif text-lg font-normal leading-[2] text-navy mb-3 max-w-[600px] mx-auto">
              小微企业面对的问题从来不是单一的——合同有陷阱、征信有记录、财务有漏洞、债务有压力、融资有障碍。每一个问题背后，都是一家企业在生死线上挣扎。
            </p>
            <p className="font-serif text-lg font-normal leading-[2] text-navy mb-3 max-w-[600px] mx-auto">
              程信霖不卖玄学，不讲概念。我们做的事情很具体：帮你看清问题在哪里，然后帮你想办法走出去。
            </p>
            <p className="font-serif text-lg font-bold leading-[2] text-navy max-w-[600px] mx-auto">
              这不是承诺，是已经做过的事。
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section className="py-28 bg-navy text-paper text-center">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.p custom={0} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-xs font-medium tracking-[0.22em] uppercase text-copper mb-12"
          >
            联系方式
          </motion.p>

          <motion.div custom={1} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="max-w-[500px] mx-auto bg-navy border border-white/[0.06] py-10 px-8 text-left"
          >
            <h3 className="font-serif text-xl font-bold mb-2">云南程信霖信息咨询有限公司</h3>
            <p className="text-xs text-paper/50 mb-8 tracking-[0.06em]">财务咨询 & 融资顾问 & AI商业决策</p>
            <div className="space-y-2 text-sm font-normal text-paper/70">
              <p><strong className="font-medium text-copper-light">联系人：</strong>余磊</p>
              <p><strong className="font-medium text-copper-light">电话：</strong>13987671259</p>
              <p><strong className="font-medium text-copper-light">微信公众号：</strong>程信霖融途</p>
              <p><strong className="font-medium text-copper-light">网站：</strong>程信霖官网</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER NOTE ===== */}
      <div className="py-12 bg-navy border-t border-paper/[0.06] text-center">
        <p className="text-xs text-paper/40 tracking-[0.06em]">
          全文完 · 程信霖信息咨询 · CHENGXINLIN CONSULTING
        </p>
      </div>
    </>
  )
}
