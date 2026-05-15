"use client";

import { useState, useEffect } from 'react';
import { Icon } from '@/components/ui/Icon';

interface HistoryPageProps {
  onNavigate: (page: string, projectId?: string | null) => void;
}

interface Project {
  id: string;
  title: string;
  updatedAt: string;
  thumbnail: string | null;
  status: string;
}

export default function HistoryPage({ onNavigate }: HistoryPageProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to load projects", err);
        setIsLoading(false);
      });
  }, []);

  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const handleRename = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveMenuId(null);
    const newTitle = prompt('请输入新的项目名称：');
    if (newTitle && newTitle.trim()) {
      try {
        await fetch(`/api/projects/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: newTitle.trim() })
        });
        setProjects(prev => prev.map(p => p.id === id ? { ...p, title: newTitle.trim() } : p));
      } catch (error) {
        alert("重命名失败");
      }
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveMenuId(null);
    if (confirm('确定要删除这个项目吗？此操作无法恢复。')) {
      try {
        await fetch(`/api/projects/${id}`, { method: 'DELETE' });
        setProjects(prev => prev.filter(p => p.id !== id));
      } catch (error) {
        alert("删除失败");
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-transparent w-full animate-fade-in relative">
      <header className="h-20 bg-[#0d060a]/80 backdrop-blur-2xl border-b border-white/10 flex items-center justify-between px-6 md:px-10 shrink-0 z-10 shadow-glass relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center">
            <Icon name="Folder" className="w-6 h-6 text-gradient" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">我的项目</h1>
        </div>
        <button className="px-4 py-2.5 bg-white/[0.02] border border-white/10 rounded-xl hover:border-[#FF2A6D]/50 hover:bg-[#FF2A6D]/10 text-white/80 hover:text-white transition-all focus:outline-none flex items-center gap-2 shadow-glass">
          <Icon name="SlidersHorizontal" className="w-4 h-4" />
          <span className="text-sm font-medium hidden md:inline">筛选排序</span>
        </button>
      </header>
      
      <div className="flex-1 p-6 md:p-10 overflow-y-auto custom-scrollbar relative" onClick={() => setActiveMenuId(null)}>
        {/* 装饰光晕 */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#FF2A6D]/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 relative z-10">
          {/* 新建项目卡片 */}
          <div className="flex flex-col group cursor-pointer animate-slide-up" style={{ animationDelay: '50ms' }} onClick={() => onNavigate('videoGen')}>
            <div className="aspect-[4/3] bg-[#1a0f14] border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center group-hover:border-[#FF2A6D]/50 transition-all duration-300 p-6 text-center shadow-glass group-hover:shadow-glow group-hover:-translate-y-1">
              <div className="mb-4 transition-transform duration-300 group-hover:scale-110">
                <Icon name="Plus" className="w-10 h-10 text-white" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-white">创建新项目</h3>
              <p className="text-sm text-white/60 mt-1">从零开始生成视频广告</p>
            </div>
            {/* 占位，为了和下面项目的文字高度对齐 */}
            <div className="mt-4 px-2 opacity-0">
              <h3 className="font-bold text-base">Placeholder</h3>
              <p className="text-xs mt-1">Placeholder</p>
            </div>
          </div>

          {/* 历史项目卡片 */}
          {isLoading ? (
            <div className="col-span-full flex justify-center py-20">
              <Icon name="Loader2" className="w-8 h-8 animate-spin text-[#FF2A6D]" />
            </div>
          ) : (
            projects.map((project, index) => (
              <div 
                key={project.id} 
                className="flex flex-col group cursor-pointer animate-slide-up relative" 
                style={{ animationDelay: `${(index + 2) * 50}ms` }}
                onClick={() => onNavigate('videoGen', project.id)}
              >
                <div className="aspect-[4/3] bg-[#1a0f14] rounded-3xl overflow-hidden relative transition-all duration-300 shadow-glass group-hover:-translate-y-1 border border-white/10 group-hover:border-[#FF2A6D]/30">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d060a]/80 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  <img src={project.thumbnail || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                  
                  <div className="absolute top-0 left-0 w-full p-4 z-20 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-bold shadow-sm border border-white/10">
                      {project.status === 'COMPLETED' ? '已完成' : project.status === 'GENERATING' ? '生成中' : '草稿'}
                    </span>
                    <div className="relative">
                      <button 
                        onClick={(e) => toggleMenu(e, project.id)}
                        className="p-2 bg-black/50 backdrop-blur-sm hover:bg-black/80 text-white hover:text-[#FF2A6D] rounded-full transition-all focus:outline-none shadow-sm relative z-[60] border border-white/10"
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
                  <h3 className="font-bold text-white truncate text-base group-hover:text-[#FF2A6D] transition-colors">{project.title}</h3>
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
