export const brandKits = ['浦发银行', '山下有松'] as const;

export type BrandKitName = typeof brandKits[number];

export const brandLogos: Record<BrandKitName, string> = {
  浦发银行: 'https://companieslogo.com/img/orig/600000.SS_BIG-13c7d579.png',
  山下有松: '/spd-vi/a7cd3c66-e1fe-4ba9-a38c-efb8ca70d41c.png',
};

export const brandLogoBackgrounds: Record<BrandKitName, string> = {
  浦发银行: '#FFFFFF',
  山下有松: '#F2F1EC',
};

export interface BrandSkill {
  name: string;
  description: string;
}

export interface BrandWorkflow {
  name: string;
  description: string;
}

export const brandSkills: Record<BrandKitName, BrandSkill[]> = {
  浦发银行: [
    { name: '日报', description: '汇总浦发银行当日品牌传播、投放和市场反馈。' },
    { name: '预算流程', description: '生成面向浦发银行营销预算审批的流程材料。' },
    { name: '策略方案', description: '基于浦发银行品牌资产生成整合营销策略。' },
    { name: '合规检查', description: '检查内容是否符合浦发银行品牌和金融合规表达。' },
    { name: '品牌日报（公众号推送）', description: '生成适合浦发银行公众号推送的品牌日报。' },
    { name: '竞品营销策略', description: '分析银行同业活动并输出浦发银行应对策略。' },
  ],
  山下有松: [
    { name: '新品上市方案', description: '生成山下有松新品上市传播方案。' },
    { name: '社媒种草文案', description: '生成符合山下有松调性的社媒种草内容。' },
    { name: '门店陈列建议', description: '基于山下有松视觉风格生成门店陈列方向。' },
    { name: '品牌故事包装', description: '整理山下有松品牌故事并转化为传播素材。' },
  ],
};

export const brandWorkflows: Record<BrandKitName, BrandWorkflow[]> = {
  浦发银行: [
    { name: '品牌日报工作流', description: '按固定步骤汇总品牌动态、投放信息和市场反馈。' },
    { name: '预算审批工作流', description: '完成营销预算材料整理、检查和审批流转。' },
    { name: '活动方案工作流', description: '从策略、创意到渠道执行生成完整品牌活动方案。' },
  ],
  山下有松: [
    { name: '新品上市工作流', description: '从品牌故事到渠道内容完成新品上市方案。' },
    { name: '社媒种草工作流', description: '按平台生成选题、内容和发布节奏。' },
    { name: '门店陈列工作流', description: '结合品牌规范输出门店陈列建议。' },
  ],
};

export interface MockProject {
  id: string;
  brandKit: BrandKitName;
  title: string;
  updatedAt: string;
  status: 'COMPLETED' | 'GENERATING' | 'DRAFT';
  description: string;
  skills?: string[];
  workflow?: string | null;
  capability?: string;
}

export const mockProjects: MockProject[] = [
  {
    id: 'spd-brand-campaign',
    brandKit: '浦发银行',
    title: '浦发品牌活动方案',
    updatedAt: '2026-08-10',
    status: 'COMPLETED',
    description: '围绕浦发银行品牌资产整合活动主题、传播节奏与核心视觉方向。',
  },
  {
    id: 'spd-product-launch',
    brandKit: '浦发银行',
    title: '浦发新品上市素材',
    updatedAt: '2026-08-09',
    status: 'DRAFT',
    description: '面向浦发银行金融产品上市的海报、文案与投放素材。',
  },
  {
    id: 'spd-social-content',
    brandKit: '浦发银行',
    title: '浦发社媒内容矩阵',
    updatedAt: '2026-08-08',
    status: 'COMPLETED',
    description: '覆盖多平台的浦发银行社媒选题、脚本和发文计划。',
  },
  {
    id: 'spd-ecommerce-detail',
    brandKit: '浦发银行',
    title: '浦发权益详情页',
    updatedAt: '2026-08-07',
    status: 'GENERATING',
    description: '拆解浦发银行权益卖点、页面结构和视觉模块设计。',
  },
  {
    id: 'shanxia-launch',
    brandKit: '山下有松',
    title: '山下有松新品故事',
    updatedAt: '2026-08-10',
    status: 'COMPLETED',
    description: '围绕山下有松品牌故事生成新品上市传播内容。',
  },
  {
    id: 'shanxia-social',
    brandKit: '山下有松',
    title: '山下有松社媒种草',
    updatedAt: '2026-08-08',
    status: 'DRAFT',
    description: '生成山下有松小红书、公众号和短视频种草脚本。',
  },
];
