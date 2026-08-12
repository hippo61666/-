"use client";

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import BrandKitSelector from '@/components/BrandKitSelector';
import type { ProjectDraft } from '@/components/ProjectChatPage';
import type { BrandKitName, MockProject } from '@/components/brandData';

interface HistoryPageProps {
  activeBrandKit: BrandKitName;
  onBrandKitChange: (brandKit: BrandKitName) => void;
  onOpenProject: (project: ProjectDraft) => void;
  projects: MockProject[];
  onRenameProject: (id: string, title: string) => void;
  onDeleteProject: (id: string) => void;
}

export default function HistoryPage({
  activeBrandKit,
  onBrandKitChange,
  onOpenProject,
  projects,
  onRenameProject,
  onDeleteProject,
}: HistoryPageProps) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const brandProjects = projects.filter(project => project.brandKit === activeBrandKit);

  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const handleRename = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveMenuId(null);
    const newTitle = prompt('请输入新的项目名称：');
    if (newTitle && newTitle.trim()) {
      onRenameProject(id, newTitle.trim());
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveMenuId(null);
    if (confirm('确定要删除这个项目吗？此操作无法恢复。')) {
      onDeleteProject(id);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-transparent w-full animate-fade-in relative">
      <header className="h-20 bg-[#0d060a]/80 backdrop-blur-2xl border-b border-white/10 flex items-center justify-between px-6 md:px-10 shrink-0 z-[300] shadow-glass relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center">
            <Icon name="Folder" className="w-6 h-6 text-gradient" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">我的项目</h1>
        </div>
        <BrandKitSelector activeBrandKit={activeBrandKit} onBrandKitChange={onBrandKitChange} />
      </header>
      
      <div className="flex-1 p-6 md:p-10 overflow-y-auto custom-scrollbar relative" onClick={() => setActiveMenuId(null)}>
        {/* 装饰光晕 */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[rgb(var(--brand-rgb)/0.1)] rounded-full blur-[120px] pointer-events-none z-0"></div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 relative z-10">
          {/* 历史项目卡片 */}
          {brandProjects.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                <Icon name="FolderOpen" className="w-6 h-6 text-white/40" />
              </div>
              <h3 className="text-lg font-bold text-white">暂无项目</h3>
              <p className="text-sm text-white/50 mt-2">当前品牌套件下暂时没有可展示的项目。</p>
            </div>
          ) : (
            brandProjects.map((project, index) => (
              <div 
                key={project.id} 
                role="button"
                tabIndex={0}
                onClick={() => onOpenProject({
                  id: project.id,
                  title: project.title,
                  brandKit: project.brandKit,
                  initialPrompt: project.description,
                  skill: null,
                  capability: '全能生成',
                })}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onOpenProject({
                      id: project.id,
                      title: project.title,
                      brandKit: project.brandKit,
                      initialPrompt: project.description,
                      skill: null,
                      capability: '全能生成',
                    });
                  }
                }}
                className="flex flex-col group animate-slide-up relative cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--brand-rgb)/0.5)] rounded-3xl"
                style={{ animationDelay: `${(index + 1) * 50}ms` }}
              >
                <div className="aspect-[4/3] bg-[#1a0f14] rounded-3xl overflow-hidden relative transition-all duration-300 shadow-glass group-hover:-translate-y-1 border border-white/10 group-hover:border-[rgb(var(--brand-rgb)/0.3)]">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d060a]/80 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgb(var(--brand-rgb)/0.22),transparent_42%),linear-gradient(135deg,#1a0f14_0%,#0d060a_100%)]"></div>
                  <div className="absolute inset-0 p-5 flex flex-col justify-between">
                    <Icon name="Sparkles" className="w-6 h-6 text-[var(--brand-primary)] opacity-70" />
                    <p className="text-xs text-white/45 leading-relaxed line-clamp-2">{project.description}</p>
                  </div>
                  
                  <div className="absolute top-0 left-0 w-full p-4 z-20 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-bold shadow-sm border border-white/10">
                      {project.status === 'COMPLETED' ? '已完成' : project.status === 'GENERATING' ? '生成中' : '草稿'}
                    </span>
                    <div className="relative">
                      <button 
                        onClick={(e) => toggleMenu(e, project.id)}
                        className="p-2 bg-black/50 backdrop-blur-sm hover:bg-black/80 text-white hover:text-[var(--brand-primary)] rounded-full transition-all focus:outline-none shadow-sm relative z-[60] border border-white/10"
                      >
                        <Icon name="MoreHorizontal" className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* 下拉菜单 */}
                {activeMenuId === project.id && (
                  <div className="absolute right-4 top-16 w-36 bg-[#1a0f14] rounded-xl shadow-glass border border-white/10 overflow-hidden z-[100] animate-fade-in origin-top-right">
                    <button 
                      onClick={(e) => handleRename(e, project.id)}
                      className="w-full text-left px-4 py-3 text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2"
                    >
                      <Icon name="Edit2" className="w-4 h-4" />
                      重命名
                    </button>
                    <div className="h-px bg-white/10"></div>
                    <button 
                      onClick={(e) => handleDelete(e, project.id)}
                      className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-2"
                    >
                      <Icon name="Trash2" className="w-4 h-4" />
                      删除项目
                    </button>
                  </div>
                )}
                
                <div className="mt-4 px-2">
                  <h3 className="font-bold text-white truncate text-base group-hover:text-[var(--brand-primary)] transition-colors">{project.title}</h3>
                  <p className="text-xs text-white/50 mt-1 font-medium">{new Date(project.updatedAt).toLocaleDateString()} 更新</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
