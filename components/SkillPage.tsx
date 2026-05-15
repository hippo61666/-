"use client";

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';

interface Skill {
  id: string;
  title: string;
  author: string;
  description: string;
  usageCount: string;
  image?: string;
  category: string;
}

export default function SkillPage() {
  const [activeCategory, setActiveCategory] = useState('流程汇总');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeBrandKit, setActiveBrandKit] = useState('浦发银行');

  const categories = ['流程汇总', '品牌管理', '调研报告'];
  const brandKits = ['浦发银行', '山下有松'];

  const skillsData: Record<string, Skill[]> = {
    '流程汇总': [
      { id: '1', title: '日报', author: '系统', description: '自动化生成每日工作汇报与数据总结，支持多维度数据接入与可视化呈现。', usageCount: '9.6k', category: '流程汇总' },
      { id: '2', title: '预算流程', author: '系统', description: '标准化广告投放预算审批与分配流程，确保资金分配合规且高效。', usageCount: '6.7k', category: '流程汇总' },
      { id: '3', title: '策略方案', author: '系统', description: '基于市场数据与竞品分析，快速生成针对性的营销策略与执行方案。', usageCount: '1.7k', category: '流程汇总' },
      { id: '4', title: '管理方案', author: '系统', description: '提供团队管理、项目排期及资源调配的标准化模板与智能建议。', usageCount: '905', category: '流程汇总' },
      { id: '5', title: '投放方案', author: '系统', description: '精准定位目标受众，自动生成跨平台的广告投放组合与出价策略。', usageCount: '274', category: '流程汇总' },
      { id: '6', title: '合规检查', author: '系统', description: '自动扫描素材与文案，排查违反广告法及平台规则的风险点。', usageCount: '27', category: '流程汇总' },
    ],
    '品牌管理': [
      { id: '7', title: '品牌日报（公众号推送）', author: '系统', description: '自动抓取品牌相关动态，生成适合微信公众号推送的图文日报。', usageCount: '7.3k', category: '品牌管理' },
      { id: '8', title: '文件分析', author: '系统', description: '深度解析各类文档、PDF及报告，快速提取关键数据与核心观点。', usageCount: '3.1k', category: '品牌管理' },
      { id: '9', title: '舆情监测', author: '系统', description: '全网实时监控品牌相关讨论与情感倾向，及时预警潜在公关危机。', usageCount: '1.1k', category: '品牌管理' },
      { id: '10', title: '竞品数据监控', author: '系统', description: '追踪竞品社媒声量、投放动作与受众反馈，生成对比分析看板。', usageCount: '2.0k', category: '品牌管理' },
    ],
    '调研报告': [
      { id: '11', title: '竞品营销策略', author: '系统', description: '深度拆解核心竞品的营销打法、核心卖点及渠道布局策略。', usageCount: '735', category: '调研报告' },
      { id: '12', title: '受众画像', author: '系统', description: '结合大数据分析，构建多维度的目标消费者画像与行为特征模型。', usageCount: '884', category: '调研报告' },
      { id: '13', title: '热点广告解剖', author: '系统', description: '拆解近期爆款广告的创意逻辑、视觉风格与文案框架。', usageCount: '1.2k', category: '调研报告' },
      { id: '14', title: '行业数据抓取', author: '系统', description: '自动化采集特定行业的市场规模、增长趋势及投融资数据报告。', usageCount: '888', category: '调研报告' },
    ]
  };

  const currentSkills = skillsData[activeCategory] || [];

  return (
    <div className="flex flex-col h-screen bg-transparent w-full animate-fade-in relative">
      <header className="h-auto min-h-[5rem] py-4 md:py-0 bg-[#0d060a]/80 backdrop-blur-2xl border-b border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between px-4 md:px-10 shrink-0 z-50 shadow-glass relative gap-4 md:gap-0">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center shrink-0">
            <Icon name="Zap" className="w-5 h-5 md:w-6 md:h-6 text-gradient" />
          </div>
          <h1 className="text-lg md:text-xl font-bold text-white tracking-tight shrink-0">Skill 技能中心</h1>
          
          <div className="hidden md:block relative ml-4 shrink-0">
              <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#FF2A6D]/10 border border-[#FF2A6D]/30 rounded-full text-xs font-bold text-[#FF2A6D] shadow-[0_0_15px_rgba(255,42,109,0.15)] hover:bg-[#FF2A6D]/20 transition-all focus:outline-none backdrop-blur-md cursor-pointer"
              >
                  <Icon name="Palette" className="w-3 h-3" />
                  当前关联套件：{activeBrandKit}
                  <Icon name={isDropdownOpen ? "ChevronUp" : "ChevronDown"} className="w-3 h-3 ml-1" />
              </button>

              {/* 下拉菜单 */}
              {isDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-[#1a0f14]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-glass overflow-hidden z-[100] animate-fade-in origin-top-left">
                      {brandKits.map((kit, index) => (
                          <button
                              key={index}
                              onClick={() => {
                                  setActiveBrandKit(kit);
                                  setIsDropdownOpen(false);
                              }}
                              className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center gap-2 ${
                                  activeBrandKit === kit 
                                      ? 'bg-[#FF2A6D]/10 text-[#FF2A6D] font-bold' 
                                      : 'text-white/80 hover:bg-white/5 hover:text-white'
                              }`}
                          >
                              {activeBrandKit === kit ? (
                                  <Icon name="Check" className="w-4 h-4" />
                              ) : (
                                  <div className="w-4 h-4"></div>
                              )}
                              {kit}
                          </button>
                      ))}
                  </div>
              )}
          </div>
        </div>
        
        {/* 分类导航 */}
        <div className="flex items-center bg-[#1a0f14] p-1 rounded-xl border border-white/10 w-full md:w-auto overflow-x-auto custom-scrollbar shrink-0">
            {categories.map(category => (
                <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-300 whitespace-nowrap shrink-0 ${
                        activeCategory === category 
                            ? 'bg-[#FF2A6D]/20 text-[#FF2A6D] shadow-sm' 
                            : 'text-white/50 hover:text-white hover:bg-white/5'
                    }`}
                >
                    {category}
                </button>
            ))}
        </div>
      </header>
      
      <div className="flex-1 p-6 md:p-10 overflow-y-auto custom-scrollbar relative">
        {/* 装饰光晕 */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#FF2A6D]/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
          {currentSkills.map((skill, index) => (
            <div 
              key={skill.id} 
              className="group cursor-pointer bg-[#1a0f14] rounded-2xl border border-white/10 p-5 flex gap-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#FF2A6D]/30 hover:shadow-glass animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* 图标/缩略图 */}
              <div className="w-20 h-20 shrink-0 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 flex items-center justify-center overflow-hidden group-hover:border-[#FF2A6D]/50 transition-colors">
                 {skill.image ? (
                     <img src={skill.image} alt={skill.title} className="w-full h-full object-cover" />
                 ) : (
                     <Icon name="Zap" className="w-8 h-8 text-white/30 group-hover:text-[#FF2A6D] transition-colors" />
                 )}
              </div>
              
              {/* 内容信息 */}
              <div className="flex flex-col flex-1 min-w-0">
                <h3 className="text-white font-bold text-base truncate group-hover:text-[#FF2A6D] transition-colors">
                  {skill.title}
                </h3>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-white/40">
                  <Icon name="User" className="w-3 h-3" />
                  <span className="truncate">{skill.author}</span>
                </div>
                <p className="text-sm text-white/50 mt-2 line-clamp-2 leading-relaxed flex-1">
                  {skill.description}
                </p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                  <span className="text-xs text-white/30 flex items-center gap-1">
                      使用次数
                      <Icon name="Zap" className="w-3 h-3 text-[#FF2A6D]" />
                      {skill.usageCount}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Icon name="ArrowRight" className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}