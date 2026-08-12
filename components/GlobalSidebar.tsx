"use client";

import { useState } from 'react';
import type { ProjectDraft } from '@/components/ProjectChatPage';
import type { BrandKitName, MockProject } from '@/components/brandData';
import { Icon } from '@/components/ui/Icon';

interface GlobalSidebarProps {
  activePage: string;
  activeBrandKit: BrandKitName;
  activeProjectId: string | null;
  projects: MockProject[];
  onNavigate: (page: string) => void;
  onOpenProject: (project: ProjectDraft) => void;
  onLogout: () => void;
}

export default function GlobalSidebar({
  activePage,
  activeBrandKit,
  activeProjectId,
  projects,
  onNavigate,
  onOpenProject,
  onLogout,
}: GlobalSidebarProps) {
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(true);
  const brandKitItem = { id: 'brandKit', icon: 'Palette', label: '企业品牌套件' };
  const generateItem = { id: 'generate', icon: 'Sparkles', label: '新建项目' };
  const brandProjects = projects.filter(project => project.brandKit === activeBrandKit);

  const openProject = (project: MockProject) => {
    onOpenProject({
      id: project.id,
      title: project.title,
      brandKit: project.brandKit,
      initialPrompt: project.description === '新建的空白项目对话' ? '' : project.description,
      skills: project.skills ?? [],
      workflow: project.workflow ?? null,
      capability: project.capability ?? '全能生成',
    });
  };

  return (
      <aside className="w-64 h-full bg-[#110810]/80 backdrop-blur-2xl border-r border-white/5 flex flex-col py-6 shrink-0 z-20 shadow-glass relative">
          <div className="relative mx-6 mb-10 h-7 w-28 shrink-0 overflow-hidden">
              <img
                  src="/michi-logo.png"
                  alt="MICHI"
                  className="absolute left-1/2 top-1/2 w-[172px] max-w-none -translate-x-1/2 -translate-y-1/2"
              />
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar px-4">
              <nav className="flex flex-col gap-1">
                  <div className="relative">
                      <button 
                          onClick={() => onNavigate(brandKitItem.id)}
                          className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] focus:outline-none relative w-full overflow-hidden ${
                              activePage === brandKitItem.id 
                                  ? 'bg-white/10 border border-white/10 shadow-glass text-white z-10'
                                  : 'border border-transparent text-white/60 hover:bg-white/5 hover:text-white z-10'
                          }`}
                      >
                          <div className={`relative z-10 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-500 ${
                              activePage === brandKitItem.id 
                                  ? 'bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)]'
                                  : 'bg-gradient-to-br from-[rgb(var(--brand-rgb)/0.2)] to-[rgb(var(--brand-secondary-rgb)/0.2)] group-hover:from-[rgb(var(--brand-rgb)/0.4)] group-hover:to-[rgb(var(--brand-secondary-rgb)/0.4)]'
                          }`}>
                              <Icon name={brandKitItem.icon} className={`w-4 h-4 transition-all duration-500 ${
                                  activePage === brandKitItem.id ? 'text-white' : 'text-[var(--brand-primary)] group-hover:text-white'
                              }`} />
                          </div>
                          <span className={`relative z-10 text-sm font-bold transition-all duration-300 ${
                              activePage === brandKitItem.id 
                                  ? 'text-shine'
                                  : 'text-shine'
                          }`}>{brandKitItem.label}</span>
                      </button>
                  </div>

                  <button
                      onClick={() => onNavigate(generateItem.id)}
                      className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] focus:outline-none relative w-full ${
                          activePage === generateItem.id
                              ? 'bg-white/10 border border-white/10 shadow-glass'
                              : 'hover:bg-white/5 border border-transparent text-white/60 hover:text-white'
                      }`}
                  >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-500 ${
                          activePage === generateItem.id ? 'bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)]' : 'bg-white/5 group-hover:bg-white/10'
                      }`}>
                          <Icon name={generateItem.icon} className={`w-4 h-4 transition-all duration-500 ${
                              activePage === generateItem.id ? 'text-white' : 'text-white/60 group-hover:text-white'
                          }`} />
                      </div>
                      <span className={`text-sm font-medium transition-colors ${
                          activePage === generateItem.id ? 'text-white' : ''
                      }`}>{generateItem.label}</span>
                  </button>
              </nav>

              <div className="mt-7">
                  <button
                      type="button"
                      onClick={() => setIsProjectsExpanded(current => !current)}
                      aria-expanded={isProjectsExpanded}
                      className="mb-2 flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-[11px] font-medium text-white/35 transition-colors hover:bg-white/5 hover:text-white/60 focus:outline-none"
                  >
                      <span>我的项目</span>
                      <Icon
                          name="ChevronDown"
                          className={`h-3.5 w-3.5 transition-transform duration-300 ${
                              isProjectsExpanded ? 'rotate-0' : '-rotate-90'
                          }`}
                      />
                  </button>
                  {isProjectsExpanded && (
                      <nav className="flex flex-col gap-1">
                          {brandProjects.length === 0 ? (
                              <p className="px-3 py-3 text-xs text-white/25">暂无项目</p>
                          ) : (
                              brandProjects.map(project => (
                                  <button
                                      key={project.id}
                                      onClick={() => openProject(project)}
                                      title={project.title}
                                      className={`group flex w-full items-center rounded-xl border px-3 py-2.5 text-left transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] focus:outline-none ${
                                          activeProjectId === project.id
                                              ? 'border-white/10 bg-white/10 text-white shadow-glass'
                                              : 'border-transparent text-white/60 hover:bg-white/5 hover:text-white'
                                      }`}
                                  >
                                      <span className="truncate text-sm font-medium">{project.title}</span>
                                  </button>
                              ))
                          )}
                      </nav>
                  )}
              </div>
          </div>

          <div className="mt-auto w-full px-6 pt-6 border-t border-white/5 flex items-center justify-between">
              <button className="flex items-center gap-2 group focus:outline-none">
                  <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 overflow-hidden flex items-center justify-center">
                      <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=150&q=80" alt="Avatar" className="w-full h-full object-cover" />
                  </div>
              </button>
              <button onClick={onLogout} className="text-white/40 hover:text-[var(--brand-primary)] transition-colors focus:outline-none">
                  <Icon name="LogOut" className="w-4 h-4" />
              </button>
          </div>
      </aside>
  );
}
