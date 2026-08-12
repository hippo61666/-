"use client";

import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import BrandKitSelector from '@/components/BrandKitSelector';
import PromptCapabilityControls, { SelectedSkillChips } from '@/components/PromptCapabilityControls';
import type { ProjectDraft } from '@/components/ProjectChatPage';
import { brandSkills, brandWorkflows, type BrandKitName, type MockProject } from '@/components/brandData';

const capabilityChips = [
  { label: '全能生成', icon: 'Sparkles' },
  { label: '品牌内容', icon: 'Palette' },
  { label: '营销文案', icon: 'PenLine' },
  { label: '视觉设计', icon: 'Image' },
  { label: '视频脚本', icon: 'Clapperboard' },
  { label: '电商素材', icon: 'ShoppingBag' },
  { label: '投放方案', icon: 'Megaphone' },
];

interface GeneratePageProps {
  activeBrandKit: BrandKitName;
  onBrandKitChange: (brandKit: BrandKitName) => void;
  onStartProject: (project: ProjectDraft) => void;
  projects: MockProject[];
}

export default function GeneratePage({
  activeBrandKit,
  onBrandKitChange,
  onStartProject,
  projects,
}: GeneratePageProps) {
  const [prompt, setPrompt] = useState('');
  const [activeCapability, setActiveCapability] = useState('全能生成');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const availableSkills = brandSkills[activeBrandKit];
  const availableWorkflows = brandWorkflows[activeBrandKit];
  const brandProjects = projects.filter(project => project.brandKit === activeBrandKit).slice(0, 5);

  useEffect(() => {
    setSelectedSkills(current =>
      current.filter(selected => availableSkills.some(skill => skill.name === selected))
    );
    if (selectedWorkflow && !availableWorkflows.some(workflow => workflow.name === selectedWorkflow)) {
      setSelectedWorkflow(null);
    }
  }, [activeBrandKit, availableSkills, availableWorkflows, selectedWorkflow]);

  const handleCreateProject = () => {
    setPrompt('');
    setActiveCapability('全能生成');
    setSelectedSkills([]);
    setSelectedWorkflow(null);
    onStartProject({
      id: `project-${Date.now()}`,
      title: '新项目',
      brandKit: activeBrandKit,
      initialPrompt: '',
      skills: [],
      workflow: null,
      capability: '全能生成',
    });
  };

  const handleStartGenerating = () => {
    const initialPrompt = prompt.trim();
    if (!initialPrompt) return;

    onStartProject({
      id: `project-${Date.now()}`,
      title: initialPrompt.length > 20 ? `${initialPrompt.slice(0, 20)}…` : initialPrompt,
      brandKit: activeBrandKit,
      initialPrompt,
      skills: selectedSkills,
      workflow: selectedWorkflow,
      capability: activeCapability,
    });
  };

  return (
    <div className="flex flex-col h-screen bg-transparent w-full animate-fade-in relative overflow-hidden">
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[720px] h-[720px] bg-[rgb(var(--brand-rgb)/0.1)] rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-25%] right-[-10%] w-[520px] h-[520px] bg-[rgb(var(--brand-secondary-rgb)/0.1)] rounded-full blur-[130px] pointer-events-none"></div>

      <header className="h-20 bg-[#0d060a]/80 backdrop-blur-2xl border-b border-white/10 flex items-center justify-between px-6 md:px-10 shrink-0 z-[300] shadow-glass relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center">
            <Icon name="Sparkles" className="w-6 h-6 text-gradient" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">新建项目</h1>
        </div>

        <BrandKitSelector activeBrandKit={activeBrandKit} onBrandKitChange={onBrandKitChange} />
      </header>

      <main className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
        <div className="min-h-full flex flex-col px-6 md:px-10 py-10">
          <section className="flex-1 flex flex-col items-center justify-center w-full max-w-5xl mx-auto pb-12">
            <div className="text-center mb-10 animate-slide-up">
              <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/40 mb-5">Marketing Studio</h2>
              <h1 className="flex flex-col items-center gap-4">
                <span className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] drop-shadow-2xl">
                  MICHI
                </span>
                <span className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white/90 tracking-[0.12em]">
                  准确生成
                </span>
              </h1>
              <p className="mt-5 text-sm md:text-base text-white/45">
                描述你的目标，基于当前品牌套件生成适合投放、设计、内容和方案的完整输出。
              </p>
            </div>

            <div className="w-full max-w-3xl bg-white/[0.02] border border-white/10 p-2 rounded-[2rem] shadow-glass animate-slide-up relative z-50" style={{ animationDelay: '120ms' }}>
              <div className="bg-[#1a0f14]/95 rounded-[calc(2rem-0.5rem)] p-4 md:p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                <SelectedSkillChips
                  selectedSkills={selectedSkills}
                  onRemove={skill => setSelectedSkills(current => current.filter(item => item !== skill))}
                />
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full min-h-[72px] resize-none bg-transparent border-none text-white text-sm md:text-base focus:outline-none placeholder:text-white/30 leading-relaxed"
                  placeholder={`告诉 MICHI 你想生成什么，例如：为${activeBrandKit}设计一套七夕活动传播方案，包含主视觉方向、社媒文案和落地页结构...`}
                />

                <div className="flex items-end justify-between gap-3 pt-3 border-t border-white/5">
                  <PromptCapabilityControls
                    availableSkills={availableSkills}
                    availableWorkflows={availableWorkflows}
                    selectedSkills={selectedSkills}
                    selectedWorkflow={selectedWorkflow}
                    onSkillsChange={setSelectedSkills}
                    onWorkflowChange={setSelectedWorkflow}
                  />
                  <button
                    onClick={handleStartGenerating}
                    disabled={!prompt.trim()}
                    className="h-11 px-5 btn-gradient rounded-xl flex items-center justify-center gap-2 shadow-glow focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold text-white"
                  >
                    <span>开始生成</span>
                    <Icon name="ArrowUp" className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mt-5 max-w-3xl animate-slide-up relative z-10" style={{ animationDelay: '180ms' }}>
              {capabilityChips.map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => setActiveCapability(chip.label)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all ${
                    activeCapability === chip.label
                      ? 'bg-[rgb(var(--brand-rgb)/0.15)] border-[rgb(var(--brand-rgb)/0.4)] text-[var(--brand-primary)] shadow-[0_0_16px_rgb(var(--brand-rgb) / 0.15)]'
                      : 'bg-white/[0.02] border-white/10 text-white/55 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon name={chip.icon} className="w-3.5 h-3.5" />
                  {chip.label}
                </button>
              ))}
            </div>
          </section>

          <section className="w-full max-w-6xl mx-auto pb-10 animate-slide-up relative z-0" style={{ animationDelay: '240ms' }}>
            <div className="mb-4">
              <h2 className="text-sm font-bold text-white/80">最近项目</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
              <button
                type="button"
                onClick={handleCreateProject}
                className="aspect-[4/3] rounded-2xl border border-dashed border-white/15 bg-white/[0.02] hover:border-[rgb(var(--brand-rgb)/0.5)] hover:bg-[rgb(var(--brand-rgb)/0.05)] transition-all flex flex-col items-center justify-center text-white/45 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--brand-rgb)/0.5)]"
              >
                <Icon name="Plus" className="w-6 h-6 mb-2" />
                <span className="text-xs font-medium">新建项目</span>
              </button>
              {brandProjects.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => onStartProject({
                    id: project.id,
                    title: project.title,
                    brandKit: project.brandKit,
                    initialPrompt: project.description,
                    skills: project.skills ?? [],
                    workflow: project.workflow ?? null,
                    capability: project.capability ?? '全能生成',
                  })}
                  className="group cursor-pointer text-left focus:outline-none"
                >
                  <div className="aspect-[4/3] rounded-2xl bg-[#1a0f14] border border-white/10 shadow-glass group-hover:border-[rgb(var(--brand-rgb)/0.3)] group-hover:-translate-y-1 transition-all"></div>
                  <p className="mt-2 text-xs text-white/55 truncate group-hover:text-white transition-colors">{project.title}</p>
                </button>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
