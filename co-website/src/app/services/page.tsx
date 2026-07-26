'use client'

import { motion, type Variants } from 'motion/react'
import {
  Handshake, Briefcase, Buildings, Robot,
  Scales, ChartLine, Bank, FileText,
  ArrowRight, CheckCircle, CaretRight
} from '@phosphor-icons/react'

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number]

const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
}

const revealFromBelow: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOutExpo },
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

function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className={className}
    >
      {children}
    </motion.section>
  )
}

export default function ServicesPage() {
  return (
    <>
      {/* ===== PAGE HEADER ===== */}
      <section className="relative h-[320px] bg-navy text-paper text-center overflow-hidden">
        <img src="/images/banner-services.jpg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-navy/70" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-copper/[0.04] rounded-full blur-[100px]" />
        </div>
        <div className="relative h-full flex flex-col items-center justify-center max-w-3xl mx-auto px-4">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOutExpo }}
            className="text-xs font-medium tracking-[0.22em] uppercase text-copper mb-6"
          >
            产品及服务
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeOutExpo, delay: 0.1 }}
            className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-[1.3] tracking-[0.03em] text-white mb-5"
          >
            帮小微企业看清问题，找到出路
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOutExpo, delay: 0.2 }}
            className="text-lg font-normal text-paper/80 leading-relaxed max-w-2xl mx-auto"
          >
            程信霖的产品和服务，不是零散的菜单：而是围绕小微企业真实需求搭建的完整闭环。从融资撮合的精准匹配，到咨询业务的深度诊断，再到AI工具的标准化赋能，最后到企业级落地服务，每一环都有明确的交付标准。
          </motion.p>
        </div>
      </section>

      {/* ===== PART 1: 融资信息撮合 ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section title */}
          <Section>
            <motion.div variants={revealFromBelow} className="flex items-center gap-3 mb-4">
              <Handshake weight="bold" className="w-7 h-7 text-copper" />
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-navy">融资信息撮合</h2>
            </motion.div>
            <motion.p variants={revealScale} className="text-base font-normal text-navy leading-relaxed bg-copper/[0.06] border-l-[3px] border-copper py-4 px-6 mb-6">
              不是帮客户&ldquo;搞到钱&rdquo;的中介，而是帮客户先看清融资条件、规划融资路径，待条件成熟再对接合规资金渠道。
            </motion.p>
            <motion.div variants={revealFromBelow} className="mb-12">
              <img src="/images/biz-financing.jpg" alt="融资信息撮合" className="w-full h-48 object-cover" />
            </motion.div>
          </Section>

          {/* 债务协商 */}
          <ServiceBlock
            title="债务协商服务"
            id="debt-negotiation"
            items={[
              <ServiceSection key="pain" label="痛点场景" icon={<span className="text-red-500">!</span>}>
                <p className="mb-3">你欠了债，被催收电话轰炸，被银行催着还款。但你不是不想还：是真的还不起。你想跟银行商量展期、减免、分期，但不知道怎么说、找谁说、说什么才有用。银行那边只有催收，没有&ldquo;商量&rdquo;。</p>
                <p className="font-bold text-navy">全国1.2亿逾期债务人，几乎没有人帮他们合法说话。</p>
              </ServiceSection>,
              <ServiceSection key="intro" label="服务介绍" icon={<Briefcase weight="bold" className="w-4 h-4 text-copper" />}>
                <p>程信霖的债务沟通产品，不是催收，不是逃债：是站在债务人立场，运用法律+金融+谈判三重专业能力，帮债务人与银行协商展期、减免、分期、重组。</p>
                <p className="mt-3">这是程信霖转型之后真正下力气开发的产品。这条赛道上，几乎没有合规的专业服务机构。</p>
              </ServiceSection>,
              <ServiceSection key="tiers" label="四级服务体系" icon={<FileText weight="bold" className="w-4 h-4 text-copper" />}>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr>
                        <th className="text-left font-bold text-copper py-3 border-b-2 border-copper pr-4">层级</th>
                        <th className="text-left font-bold text-copper py-3 border-b-2 border-copper pr-4">内容</th>
                        <th className="text-left font-bold text-copper py-3 border-b-2 border-copper">交付物</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td className="font-semibold text-navy py-3 border-b border-navy/[0.06] align-top">免费咨询</td><td className="py-3 border-b border-navy/[0.06] text-navy pr-4">15分钟电话沟通：倾听债务情况、初步判断、服务介绍</td><td className="py-3 border-b border-navy/[0.06] text-navy">口头初步建议</td></tr>
                      <tr><td className="font-semibold text-navy py-3 border-b border-navy/[0.06] align-top">诊断评估</td><td className="py-3 border-b border-navy/[0.06] text-navy pr-4">收集整理资料→IMA AI辅助分析+人工诊断→出具债务诊断报告</td><td className="py-3 border-b border-navy/[0.06] text-navy">《债务诊断与可行性评估报告》（10-20页PDF）</td></tr>
                      <tr><td className="font-semibold text-navy py-3 border-b border-navy/[0.06] align-top">方案制定</td><td className="py-3 border-b border-navy/[0.06] text-navy pr-4">深度资料分析→AI生成初稿→人工审核+法律合规复核→交付完整协商方案</td><td className="py-3 border-b border-navy/[0.06] text-navy">4份交付物</td></tr>
                      <tr><td className="font-semibold text-navy py-3 border-b border-navy/[0.06] align-top">全程顾问</td><td className="py-3 border-b border-navy/[0.06] text-navy pr-4">持续跟踪、深度谈判支持、紧急应对、多轮协商、法律联动</td><td className="py-3 border-b border-navy/[0.06] text-navy">持续更新方案+月度报告</td></tr>
                    </tbody>
                  </table>
                </div>
              </ServiceSection>,
              <ServiceSection key="stance" label="我们的立场" icon={<CheckCircle weight="bold" className="w-4 h-4 text-green-600" />}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <ul className="space-y-1">
                    <li className="text-sm text-navy flex items-start gap-2"><span className="text-green-600 mt-0.5">✓</span>帮你看清债务全景、设计协商方案</li>
                    <li className="text-sm text-navy flex items-start gap-2"><span className="text-green-600 mt-0.5">✓</span>教你沟通方法、提供文档支持</li>
                    <li className="text-sm text-navy flex items-start gap-2"><span className="text-green-600 mt-0.5">✓</span>全程顾问指导</li>
                  </ul>
                  <ul className="space-y-1">
                    <li className="text-sm text-navy flex items-start gap-2"><span className="text-red-400 mt-0.5">✕</span>不代替你与银行谈判</li>
                    <li className="text-sm text-navy flex items-start gap-2"><span className="text-red-400 mt-0.5">✕</span>不承诺100%成功、不伪造材料</li>
                    <li className="text-sm text-navy flex items-start gap-2"><span className="text-red-400 mt-0.5">✕</span>不代你投诉、不碰你的资金</li>
                  </ul>
                </div>
              </ServiceSection>,
              makeFlowSection('合作流程', ['免费电话咨询（15分钟）', '签约→收集资料→诊断评估（3-5工作日）', '方案制定（5-10工作日）', '交付方案+话术+材料清单→客户自行执行协商', '可选：升级全程顾问服务']),
            ]}
          />

          {/* 融资规划 */}
          <ServiceBlock
            title="融资规划"
            id="financing-plan"
            items={[
              <ServiceSection key="pain" label="痛点场景" icon={<span className="text-red-500">!</span>}>
                <p>你想融资，但条件不够：征信有瑕疵、流水不稳定、抵押物不足、行业敏感。中介只会说&ldquo;帮你搞定&rdquo;，但不告诉你为什么搞不定、差什么、怎么补。你需要的是先看清条件、规划路径，而不是盲目试错浪费时间。</p>
              </ServiceSection>,
              <ServiceSection key="intro" label="服务介绍" icon={<Briefcase weight="bold" className="w-4 h-4 text-copper" />}>
                <p className="mb-3">程信霖的融资规划不是&ldquo;帮你跑银行&rdquo;：而是帮你看清融资条件在哪里、差什么、怎么补，然后制定中长期融资方案。待条件真正符合后，再对接合规资金渠道。</p>
                <p className="font-bold text-navy">从&ldquo;能不能贷到钱&rdquo;到&ldquo;怎么让自己具备贷款条件&rdquo;：这是融资顾问真正该做的事。</p>
              </ServiceSection>,
              <ServiceSection key="core" label="核心能力" icon={<CaretRight weight="bold" className="w-4 h-4 text-copper" />}>
                <ul className="space-y-2">
                  <li className="text-sm text-navy pl-4 relative before:absolute before:left-0 before:top-[0.45rem] before:w-1 before:h-1 before:bg-copper before:rounded-full"><strong>7维诊断模型</strong>：从征信、流水、资产、行业、经营、税务、法务七个维度全面诊断</li>
                  <li className="text-sm text-navy pl-4 relative before:absolute before:left-0 before:top-[0.45rem] before:w-1 before:h-1 before:bg-copper before:rounded-full"><strong>中长期融资路径规划</strong>：不是一次性冲刺，而是分阶段改善、分步骤推进</li>
                  <li className="text-sm text-navy pl-4 relative before:absolute before:left-0 before:top-[0.45rem] before:w-1 before:h-1 before:bg-copper before:rounded-full"><strong>财务调优建议</strong>：帮你在合规框架内优化财务呈现，提高融资成功率</li>
                  <li className="text-sm text-navy pl-4 relative before:absolute before:left-0 before:top-[0.45rem] before:w-1 before:h-1 before:bg-copper before:rounded-full"><strong>合规资金渠道对接</strong>：条件成熟后匹配合规资金方，不是信息差套利</li>
                </ul>
              </ServiceSection>,
              <ServiceSection key="deliverable" label="交付物" icon={<FileText weight="bold" className="w-4 h-4 text-copper" />}>
                <p className="text-sm text-navy">《融资规划方案》（含7维诊断、路径规划、改善建议、阶段目标）</p>
              </ServiceSection>,
              makeFlowSection('合作流程', ['初步沟通→了解融资需求和现状', '签约→7维诊断+现状分析', '制定中长期融资规划方案', '交付方案→客户按路径改善条件', '条件成熟后→对接合规资金渠道']),
            ]}
          />

          {/* 融资撮合 */}
          <ServiceBlock
            title="个人/企业融资撮合"
            id="financing-match"
            items={[
              <ServiceSection key="pain" label="痛点场景" icon={<span className="text-red-500">!</span>}>
                <p>你的条件已经具备，但不知道哪家银行的产品最合适、利率最低、额度最高。市面上的信息鱼龙混杂，中介报价虚高，银行客户经理只推自家产品。你需要一个中立的、基于专业分析的撮合服务。</p>
              </ServiceSection>,
              <ServiceSection key="intro" label="服务介绍" icon={<Briefcase weight="bold" className="w-4 h-4 text-copper" />}>
                <p className="mb-3">程信霖的融资撮合，不是靠信息差赚差价的中介：而是基于前期诊断和规划，在条件成熟后为客户精准匹配合规资金渠道。</p>
                <p>撮合的前提是条件真正符合，不是包装出来的&ldquo;符合&rdquo;。撮合的价值是帮客户拿到最优条件，不是帮客户拿到任何条件。</p>
              </ServiceSection>,
              <ServiceSection key="core" label="核心能力" icon={<CaretRight weight="bold" className="w-4 h-4 text-copper" />}>
                <ul className="space-y-2">
                  <li className="text-sm text-navy pl-4 relative before:absolute before:left-0 before:top-[0.45rem] before:w-1 before:h-1 before:bg-copper before:rounded-full">合规资金渠道数据库：不是广撒网，是精准匹配</li>
                  <li className="text-sm text-navy pl-4 relative before:absolute before:left-0 before:top-[0.45rem] before:w-1 before:h-1 before:bg-copper before:rounded-full">多方比价：帮客户争取最优利率和最高额度</li>
                  <li className="text-sm text-navy pl-4 relative before:absolute before:left-0 before:top-[0.45rem] before:w-1 before:h-1 before:bg-copper before:rounded-full">全流程跟踪：从申请到放款，每个节点跟进</li>
                  <li className="text-sm text-navy pl-4 relative before:absolute before:left-0 before:top-[0.45rem] before:w-1 before:h-1 before:bg-copper before:rounded-full">透明收费：一次性撮合费，融资失败非客户原因全额退还</li>
                </ul>
              </ServiceSection>,
              <ServiceSection key="deliverable" label="交付物" icon={<FileText weight="bold" className="w-4 h-4 text-copper" />}>
                <p className="text-sm text-navy">《融资撮合方案》（含渠道匹配、利率对比、申请路径、进度跟踪表）</p>
              </ServiceSection>,
              makeFlowSection('合作流程', ['前期诊断确认条件符合', '签约→匹配资金渠道→多方比价', '推荐最优方案→客户确认', '协助准备申请材料→提交→跟踪进度', '放款完成→服务结束']),
            ]}
          />
        </div>
      </section>

      {/* ===== PART 2: 咨询业务 ===== */}
      <section className="py-20 bg-paper">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Section>
            <motion.div variants={revealFromBelow} className="flex items-center gap-3 mb-4">
              <Briefcase weight="bold" className="w-7 h-7 text-copper" />
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-navy">咨询业务</h2>
            </motion.div>
            <motion.p variants={revealScale} className="text-base font-normal text-navy leading-relaxed bg-copper/[0.06] border-l-[3px] border-copper py-4 px-6 mb-12">
              AI工具做标准化诊断，人工顾问做深度方案：低门槛进入，高专业落地。
            </motion.p>
          </Section>

          {/* 标准化工具包 */}
          <ServiceBlock
            title="标准化工具包服务"
            id="toolkit"
            items={[
              <ServiceSection key="pain" label="痛点场景" icon={<span className="text-red-500">!</span>}>
                <p>你的问题不一定复杂到需要请顾问：征信看不懂、财务报表看不懂、合同不知道能不能签。这些问题每个小微企业都会遇到，但每个都请顾问太贵了。</p>
              </ServiceSection>,
              <ServiceSection key="intro" label="服务介绍" icon={<Briefcase weight="bold" className="w-4 h-4 text-copper" />}>
                <p className="mb-3">程信霖的标准化工具包，就是让每个老板都能用得起专业诊断。</p>
                <p>融资体检、财务分析、合同审查：三个AI工具覆盖小微企业最常见的三类诊断需求。不需要预约、不需要签约、上传文件就能出报告。</p>
              </ServiceSection>,
              <ServiceSection key="tools" label="工具包清单" icon={<Robot weight="bold" className="w-4 h-4 text-copper" />}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {['融资体检——征信解读+产品匹配+改善建议', '财务分析——5模块诊断+指标解读+优化路径', '合同审查——决策输出+风险分析+修改方案'].map((t) => (
                    <div key={t} className="bg-white border border-navy/[0.07] p-4 text-sm text-navy">{t}</div>
                  ))}
                </div>
                <p className="text-sm text-navy mt-4">程信霖付费会员可享全部AI工具打包服务。</p>
              </ServiceSection>,
            ]}
          />

          {/* 定制化咨询 */}
          <ServiceBlock
            title="定制化咨询服务"
            id="custom-consulting"
            items={[
              <ServiceSection key="pain" label="痛点场景" icon={<span className="text-red-500">!</span>}>
                <p>你的问题不只是征信看不懂或合同能不能签：是整个融资体系有问题，是财务结构需要调整，是征信需要修复，是投资组合需要诊断。这类问题AI工具只能做初步筛查，真正解决问题需要人工顾问的深度分析和方案设计。</p>
              </ServiceSection>,
              <ServiceSection key="intro" label="服务介绍" icon={<Briefcase weight="bold" className="w-4 h-4 text-copper" />}>
                <p className="mb-3">程信霖的定制化咨询，是AI工具的升级版：从标准化诊断到个性化方案。</p>
                <p>核心团队10-20年银行及头部金融机构背景，独创7维诊断模型。一对一深度诊断，输出专属解决方案：不是模板化的建议，而是针对你的企业实际情况设计的改善路径。</p>
              </ServiceSection>,
              <ServiceSection key="scenarios" label="典型咨询场景" icon={<CaretRight weight="bold" className="w-4 h-4 text-copper" />}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    '征信修复规划：已结清的不良记录仍在展示，导致续贷被拒',
                    '融资条件改善：征信有瑕疵/流水不稳/行业敏感，需要中长期规划',
                    '财务结构优化：报表科目不规范/关联方往来复杂/资产质量存疑',
                    '合同风险深度分析：AI初筛后发现重大风险，需要人工深度审查和方案重构',
                    '投资组合诊断：多个投资项目分散管理，需要系统性评估和规划',
                  ].map((s) => (
                    <div key={s} className="text-sm text-navy border border-navy/[0.07] bg-white p-3">{s}</div>
                  ))}
                </div>
              </ServiceSection>,
              <ServiceSection key="deliverable" label="交付物" icon={<FileText weight="bold" className="w-4 h-4 text-copper" />}>
                <p className="text-sm text-navy">根据咨询类型定制：诊断报告、规划方案、行动路线图、SOP操作手册、交付文件清单等</p>
              </ServiceSection>,
              makeFlowSection('合作流程', ['初步沟通→确认咨询需求和范围', '签约→深度诊断+现状分析', '制定专属解决方案', '交付方案→客户执行', '可选：持续顾问跟踪']),
            ]}
          />
        </div>
      </section>

      {/* ===== PART 3: AI产品矩阵 ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Section>
            <motion.div variants={revealFromBelow} className="flex items-center gap-3 mb-4">
              <Robot weight="bold" className="w-7 h-7 text-copper" />
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-navy">AI产品矩阵</h2>
            </motion.div>
            <motion.p variants={revealFromBelow} className="text-base font-normal text-navy leading-relaxed max-w-2xl mb-3">
              四个AI工具，让专业不再贵
            </motion.p>
            <motion.p variants={revealScale} className="text-base font-normal text-navy leading-relaxed bg-copper/[0.06] border-l-[3px] border-copper py-4 px-6 mb-12">
              小微企业请不起专职CFO、法务、税务顾问：全国5200万小微企业，98%没有专业财务和法务团队。程信霖的AI产品矩阵，就是把那些&ldquo;请不起的专业&rdquo;变成每次都能用得起的东西。
            </motion.p>
          </Section>

          {/* 程晓融 */}
          <AiProductBlock
            icon={<Bank weight="duotone" className="w-8 h-8 text-white" />}
            name="程晓融"
            sub="AI融资体检系统"
            tagline="国内唯一面向借款人端的合规融资体检工具"
            id="chengxiaorong"
            pain="你想融资，但不知道自己能贷什么。征信报告拿到手，看不懂；问银行，银行只说'不符合条件'，不说为什么；问中介，中介只想让你赶紧签单。你需要的不是'帮你跑银行'，而是帮你看清：你的融资条件到底在哪里、差什么、怎么补。"
            intro="上传征信报告，程晓融自动解读：能贷什么、为什么被拒、怎么改善。基于昆明200+款真实金融产品库智能匹配，不是泛泛的'建议'，而是基于本地真实产品的精准推荐。"
            features={[
              '征信报告通俗语言解读：把银行语言翻译成你听得懂的话',
              '本地真实产品库智能匹配：基于昆明200+款在售产品，不是空泛建议',
              '合规改善建议：告诉你差什么、怎么补，而不是帮你包装',
              '多类型经营文档融合分析：征信+企查查+流水+财报，一份报告看清全景',
            ]}
            differentiator="市面上所有融资工具都是帮银行筛客户。程晓融是帮你看清自己。"
            deliverable="《融资体检报告》（含征信解读、产品匹配、改善建议、风险提示）"
            steps={['上传征信报告及相关经营文档', '系统自动解析+AI分析生成报告', '人工顾问复核确认', '交付报告，附改善路径建议']}
          />

          {/* 峤远 */}
          <AiProductBlock
            icon={<ChartLine weight="duotone" className="w-8 h-8 text-white" />}
            name="峤远"
            sub="AI财务报表自动分析系统"
            tagline="国内唯一专为中国中小企业非标报表做AI财务分析的产品"
            id="qiaoyuan"
            pain="你的财务报表一团乱麻：科目不规范、数据口径不一致、银行看不懂也不想看。你自己也看不懂：企业到底赚了还是亏了、现金流够不够撑半年、负债率是不是已经到红线。你需要一个能'把乱账讲清楚'的诊断师。"
            intro="上传Excel报表，峤远一键生成偿债能力、盈利能力、营运能力、现金流、破产预警5模块专业诊断报告。不是简单的指标罗列：每个指标都有解读：好在哪里、差在哪里、银行会怎么看。"
            features={[
              '自研Excel解析器+80+科目映射：不挑格式，你的账就是你的账',
              '4项数据质量校验：先验数据再出结论，不把垃圾数据当依据',
              '7大类20+专业指标计算：偿债/盈利/营运/现金流/破产预警全覆盖',
              'AI自然语言解读：每个指标都有人话解读，不是冰冷的数字表',
            ]}
            differentiator="市面上所有财务分析工具要么只服务上市公司，要么要求你的报表必须规范。峤远专为中小企业非标报表设计：你的账不规范，峤远帮你看出不规范在哪里、怎么改。"
            deliverable="《财务诊断报告》（含5模块分析、指标解读、改善建议、银行视角风险提示）"
            steps={['上传Excel格式财务报表', '系统自动解析+数据校验+指标计算+AI解读', '人工顾问复核确认', '交付报告，附优化路径建议']}
          />

          {/* 契审通 */}
          <AiProductBlock
            icon={<Scales weight="duotone" className="w-8 h-8 text-white" />}
            name="契审通"
            sub="AI商业合同决策系统"
            tagline="国内唯一把决策写进答案的合同审查产品"
            id="qiaoxi"
            pain="一份合同摆在你面前，几十页条款，你不知道能不能签。律师审查动辄几千块，而且只告诉你'有风险'，不说'到底能不能签'。你需要的不是一份风险清单：你需要一个明确的答案：签、改、拖、还是退。"
            intro="上传合同，契审通直接告诉你'签/改/拖/退'：国内唯一把决策写进答案的合同审查产品。"
            features={[
              '合同审查→画像校准→条款解析→法规检索→商业模式建模→六维度独立审计→风险推演→决策输出',
              '55,088条法规本地存储检索：法规依据就在本地，不是泛泛搜索',
              '6路并行独立审计：每个维度独立出结论，不受其他维度干扰',
              '安全底线硬编码：6条不可绕过的安全红线，AI也不能推翻',
              '合同重构：不只告诉你问题在哪，还帮你生成修改后的合同草案',
            ]}
            differentiator="市面上所有合同审查产品只输出'风险清单'或'法律意见'，把最终决策留给你。契审通直接输出商业决策：签/改/拖/退四选一，每个选项附具体理由和操作指引。"
            deliverable="《合同决策报告》（含决策结论、风险分析、法规依据、修改建议/重构合同草案）"
            steps={['上传合同文件（自动脱敏处理）', '系统完成九阶段审查管线', '人工顾问复核关键决策节点', '交付决策报告+修改方案']}
          />

          {/* 成章通 */}
          <AiProductBlock
            icon={<FileText weight="duotone" className="w-8 h-8 text-white" />}
            name="成章通"
            sub="AI公文工作台（开发中）"
            tagline="22种法定公文全覆盖，GB/T 9704国标排版"
            id="chenxi"
            pain="你需要给税局写个请示，不会写。需要给工商局报个情况说明，格式不对。需要发个内部通知，连个合格的秘书都没有：只有还在念高中的女儿帮忙打字。小微企业老板最头疼的不是业务，是那些跟政府部门打交道必须用'官方格式'的文字工作。"
            intro="成章通就是为这种窘境设计的。与前三个产品不同，成章通内核是智能Agent：锁定文种、结构铁律、四角色评审（党办/政研/纪检/基层），确保公文合规不踩雷。22种法定公文全覆盖，GB/T 9704国标排版，连格式都替你搞定。你只需要说清楚要写什么，剩下的交给成章通。"
            features={[
              '22种法定公文+7种常见正式材料全覆盖',
              '智能Agent驱动：文种锁定、结构铁律、编造反恐，不是模板填充而是智能生成',
              '四角色串行评审：党办主任、政策研究室、纪委书记、基层执行者四视角独立把关',
              '55,088条法规本地检索：三级处置（本地命中/网络补充/废止阻断）',
              'GB/T 9704国标排版：毫米级精确，导出DOCX直接可用',
              '免费排版路径：你写好了只需排版，零LLM调用，不收费',
            ]}
            differentiator="市面上公文产品靠范文库堆量。成章通靠结构铁律和评审机制：不建范文库，靠文种DNA和四角色评审确保质量。你不需要有范文，只需要说清楚要写什么。"
            deliverable="合规公文DOCX文件（含国标排版、法规依据标注）"
            steps={['选择文种或描述写作需求', '2-3轮对话锁定内容要点', 'Agent生成初稿→内容推演校验→四角色评审→修订', '交付合规公文DOCX']}
          />
        </div>
      </section>

      {/* ===== PART 4: 企业落地服务 ===== */}
      <section className="py-20 bg-paper">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Section>
            <motion.div variants={revealFromBelow} className="flex items-center gap-3 mb-4">
              <Buildings weight="bold" className="w-7 h-7 text-copper" />
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-navy">企业落地服务</h2>
            </motion.div>
            <motion.p variants={revealScale} className="text-base font-normal text-navy leading-relaxed bg-copper/[0.06] border-l-[3px] border-copper py-4 px-6 mb-12">
              聚焦企业级场景，提供标准化、可规模化的落地服务。
            </motion.p>
          </Section>

          <ServiceBlock title="物业费催收服务" id="property-fee" img="/images/service-property-fee.jpg" items={[
            <ServiceSection key="pain" label="痛点场景" icon={<span className="text-red-500">!</span>}>
              <p>物业公司最大的痛点不是管理，是收钱。物业费收缴率低、催收成本高、业主投诉多：催收团队要么效率低，要么手法粗暴引发纠纷。你需要的是专业、合规、标准化的催收服务。</p>
            </ServiceSection>,
            <ServiceSection key="intro" label="服务介绍" icon={<Briefcase weight="bold" className="w-4 h-4 text-copper" />}>
              <p>程信霖的物业费催收服务，不是&ldquo;打电话催收&rdquo;：是专业团队+标准化流程+合规操作。建立标准化催收流程，从温情提醒到法律告知，每一步都有话术模板和操作规范。合规底线明确：不骚扰、不恐吓、不暴力：用专业和规范替代粗暴和随机。</p>
            </ServiceSection>,
            <ServiceSection key="deliverable" label="交付物" icon={<FileText weight="bold" className="w-4 h-4 text-copper" />}>
              <p className="text-sm text-navy">催收执行报告、收缴率提升数据、合规操作记录</p>
            </ServiceSection>,
          ]} />

          <ServiceBlock title="系统开发服务" id="system-dev" img="/images/service-system-dev.jpg" items={[
            <ServiceSection key="pain" label="痛点场景" icon={<span className="text-red-500">!</span>}>
              <p>你的业务数据散落在Excel、微信、纸质文件里：没有数据库、没有响应机制、没有线上流程。你需要把业务搬到线上，但请不起专职技术团队。</p>
            </ServiceSection>,
            <ServiceSection key="intro" label="服务介绍" icon={<Briefcase weight="bold" className="w-4 h-4 text-copper" />}>
              <p>程信霖的系统开发服务，为小微企业搭建业务数据库和响应链系统：把散落的数据收拢、把混乱的流程理顺、把手动的操作线上化。</p>
            </ServiceSection>,
            <ServiceSection key="deliverable" label="交付物" icon={<FileText weight="bold" className="w-4 h-4 text-copper" />}>
              <p className="text-sm text-navy">业务数据库+响应链系统+操作培训文档</p>
            </ServiceSection>,
          ]} />

          <ServiceBlock title="软件定制开发（OPC服务）" id="opc" items={[
            <ServiceSection key="pain" label="痛点场景" icon={<span className="text-red-500">!</span>}>
              <p>你有一个具体的业务场景需要定制化工具：比如物业管理系统需要配套的智能客服，比如某个流程需要专属的管理工具。大型软件公司不接小单，通用软件不贴合你的实际。</p>
            </ServiceSection>,
            <ServiceSection key="intro" label="服务介绍" icon={<Briefcase weight="bold" className="w-4 h-4 text-copper" />}>
              <p className="mb-3">程信霖的OPC服务（One-Person Company定制化开发），就是为小型团队甚至一人公司量身打造流程管理工具。</p>
              <p>不是卖标准化软件给你套：是根据你的实际业务场景定制开发。目前有意向项目包括智能物业管理系统（含物管数据库+智能客服系统）等。</p>
            </ServiceSection>,
            <ServiceSection key="deliverable" label="交付物" icon={<FileText weight="bold" className="w-4 h-4 text-copper" />}>
              <p className="text-sm text-navy">定制化软件产品+部署文档+使用培训</p>
            </ServiceSection>,
          ]} />
        </div>
      </section>

      {/* ===== CLOSING ===== */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: easeOutExpo }}
        className="py-20 bg-navy text-paper text-center"
      >
        <div className="max-w-3xl mx-auto px-4">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: easeOutExpo }}
            className="text-lg font-normal text-paper/80 leading-relaxed mb-8"
          >
            程信霖的产品和服务，从融资撮合的精准匹配到咨询业务的深度诊断，从AI工具的标准化赋能到企业级落地服务：每一项都有明确的交付标准和合规底线。
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: easeOutExpo, delay: 0.1 }}
            className="font-serif text-xl font-bold text-white mb-12"
          >
            不是卖概念，不是讲玄学：帮小微企业看清问题，找到出路。
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: easeOutExpo, delay: 0.2 }}
            className="max-w-md mx-auto border border-white/[0.08] py-8 px-6 text-left"
          >
            <p className="font-serif text-lg font-bold text-white mb-1">云南程信霖信息咨询有限公司</p>
            <p className="text-xs text-paper/50 mb-6 tracking-wider">财务咨询 & 融资顾问 & AI商业决策</p>
            <div className="space-y-1.5 text-sm text-paper/70">
              <p><strong className="text-copper-light font-medium">微信公众号：</strong>程信霖融途</p>
              <p><strong className="text-copper-light font-medium">联系人：</strong>余磊 13987671259</p>
              <p><strong className="text-copper-light font-medium">电子邮箱：</strong>425448719@qq.com</p>
              <p><strong className="text-copper-light font-medium">地址：</strong>昆明市五华区华龙人家1栋2单元105号临街商铺</p>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </>
  )
}

/* ===== Reusable sub-components ===== */

function ServiceSection({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <motion.div variants={revealFromBelow} className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-5 h-5 flex items-center justify-center">{icon}</span>
        <h4 className="text-sm font-bold text-navy tracking-wider uppercase">{label}</h4>
      </div>
      <div className="text-sm text-navy leading-relaxed">{children}</div>
    </motion.div>
  )
}

function ServiceBlock({ title, id, img, items }: { title: string; id: string; img?: string; items: React.ReactNode[] }) {
  return (
    <motion.div
      id={id}
      variants={revealFromBelow}
      className="mb-12 last:mb-0 pb-12 border-b border-navy/[0.06] last:border-0 last:pb-0"
    >
      {img && (
        <motion.div variants={revealFromBelow} className="mb-6">
          <img src={img} alt={title} className="w-full h-48 object-cover" />
        </motion.div>
      )}
      <motion.h3
        variants={revealFromBelow}
        className="font-serif text-xl font-bold text-navy mb-6"
      >
        {title}
      </motion.h3>
      <div className="space-y-1">
        {items.map((item, i) => <div key={i}>{item}</div>)}
      </div>
    </motion.div>
  )
}

function AiProductBlock({
  icon, name, sub, tagline, id, pain, intro, features, differentiator, deliverable, steps,
}: {
  icon: React.ReactNode; name: string; sub: string; tagline: string; id: string;
  pain: string; intro: string; features: string[]; differentiator: string; deliverable: string; steps: string[];
}) {
  return (
    <motion.div id={id} variants={revealFromBelow} className="mb-10 pb-10 border-b border-navy/[0.06] last:border-0 last:pb-0">
      <motion.div variants={revealFromBelow} className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-copper flex items-center justify-center shrink-0">{icon}</div>
        <div>
          <h3 className="font-serif text-xl font-bold text-navy">{name}</h3>
          <p className="text-xs text-copper tracking-wider">{sub}</p>
        </div>
      </motion.div>

      <div className="inline-block text-xs font-medium text-copper border border-copper px-3 py-1 mb-6">{tagline}</div>

      <div className="space-y-5">
        <motion.div variants={revealFromBelow}>
          <h4 className="text-xs font-bold text-navy uppercase tracking-wider mb-1 text-red-500">痛点场景</h4>
          <p className="text-sm text-navy leading-relaxed">{pain}</p>
        </motion.div>

        <motion.div variants={revealFromBelow}>
          <h4 className="text-xs font-bold text-navy uppercase tracking-wider mb-1">产品介绍</h4>
          <p className="text-sm text-navy leading-relaxed">{intro}</p>
        </motion.div>

        <motion.div variants={revealFromBelow}>
          <h4 className="text-xs font-bold text-navy uppercase tracking-wider mb-2">核心能力</h4>
          <ul className="space-y-1.5">
            {features.map((f, i) => (
              <li key={i} className="text-sm text-navy leading-relaxed pl-4 relative before:absolute before:left-0 before:top-[0.45rem] before:w-1 before:h-1 before:bg-copper before:rounded-full">{f}</li>
            ))}
          </ul>
        </motion.div>

        <motion.div variants={revealFromBelow} className="bg-copper/[0.05] border-l-[3px] border-copper py-3 px-5">
          <p className="text-sm font-medium text-navy"><strong>差异化：</strong>{differentiator}</p>
        </motion.div>

        <motion.div variants={revealFromBelow}>
          <h4 className="text-xs font-bold text-navy uppercase tracking-wider mb-1">交付物</h4>
          <p className="text-sm text-navy">{deliverable}</p>
        </motion.div>

        <motion.div variants={revealFromBelow}>
          <h4 className="text-xs font-bold text-navy uppercase tracking-wider mb-2">合作流程</h4>
          <div className="flex flex-wrap gap-2">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-copper/15 text-copper text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                <span className="text-sm text-navy">{s}</span>
                {i < steps.length - 1 && <ArrowRight weight="bold" className="w-3 h-3 text-copper/50 shrink-0" />}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

function makeFlowSection(label: string, steps: string[]) {
  return (
    <ServiceSection key="flow" label={label} icon={<CaretRight weight="bold" className="w-4 h-4 text-copper" />}>
      <div className="flex flex-wrap gap-2">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-copper/15 text-copper text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
            <span className="text-sm text-navy">{s}</span>
            {i < steps.length - 1 && <ArrowRight weight="bold" className="w-3 h-3 text-copper/50 shrink-0" />}
          </div>
        ))}
      </div>
    </ServiceSection>
  )
}
