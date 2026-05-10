"use client";

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';

interface HistoryPageProps {
  onNavigate: (page: string) => void;
}

export default function HistoryPage({ onNavigate }: HistoryPageProps) {
  const [mockProjects, setMockProjects] = useState([
    { id: 1, title: '极简科技风 - 手表广告', updated: '2026年4月17日 更新', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80' },
    { id: 2, title: '活力运动风 - 跑鞋宣传', updated: '2026年4月14日 更新', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80' },
    { id: 3, title: '赛博朋克 - 游戏预告', updated: '2026年4月12日 更新', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80' },
    { id: 4, title: '自然清新 - 护肤品', updated: '2025年7月21日 更新', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=600&q=80' },
    { id: 5, title: '复古胶片 - 咖啡厅', updated: '2025年7月21日 更新', image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=600&q=80' },
    { id: 6, title: '商务精英 - 笔记本', updated: '2025年6月11日 更新', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80' },
  ]);
  
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

  const toggleMenu = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const handleRename = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setActiveMenuId(null);
    const newTitle = prompt('请输入新的项目名称：');
    if (newTitle && newTitle.trim()) {
      setMockProjects(prev => prev.map(p => p.id === id ? { ...p, title: newTitle.trim() } : p));
    }
  };

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setActiveMenuId(null);
    if (confirm('确定要删除这个项目吗？此操作无法恢复。')) {
      setMockProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className="flex flex-col h-screen bg-surface-50 animate-fade-in relative">
      <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-6 md:px-10 shrink-0 z-10 shadow-sm relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center">
            <Icon name="Folder" className="w-6 h-6 text-gradient" />
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">我的项目</h1>
        </div>
        <button className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl hover:border-primary-200 hover:bg-primary-50 text-slate-600 hover:text-primary-600 transition-all focus:outline-none flex items-center gap-2 shadow-sm">
          <Icon name="SlidersHorizontal" className="w-4 h-4" />
          <span className="text-sm font-medium hidden md:inline">筛选排序</span>
        </button>
      </header>
      
      <div className="flex-1 p-6 md:p-10 overflow-y-auto custom-scrollbar relative" onClick={() => setActiveMenuId(null)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 relative z-10">
          {/* 新建项目卡片 */}
          <div className="flex flex-col group cursor-pointer animate-slide-up" style={{ animationDelay: '50ms' }} onClick={() => onNavigate('videoGen')}>
            <div className="aspect-[4/3] bg-white border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center group-hover:border-primary-400 transition-all duration-300 p-6 text-center shadow-sm group-hover:shadow-glow group-hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Icon name="Plus" className="w-8 h-8 stroke-gradient" strokeWidth={3} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">创建新项目</h3>
              <p className="text-sm text-slate-500 mt-1">从零开始生成视频广告</p>
            </div>
            {/* 占位，为了和下面项目的文字高度对齐 */}
            <div className="mt-4 px-2 opacity-0">
              <h3 className="font-bold text-base">Placeholder</h3>
              <p className="text-xs mt-1">Placeholder</p>
            </div>
          </div>

          {/* 历史项目卡片 */}
          {mockProjects.map((project, index) => (
            <div key={project.id} className="flex flex-col group cursor-pointer animate-slide-up relative" style={{ animationDelay: `${(index + 2) * 50}ms` }}>
              <div className="aspect-[4/3] bg-white rounded-3xl overflow-hidden relative transition-all duration-300 shadow-sm group-hover:shadow-md group-hover:-translate-y-1 border border-slate-100">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                
                <div className="absolute top-0 left-0 w-full p-4 z-20 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="bg-white/90 backdrop-blur-sm text-slate-800 text-xs px-3 py-1 rounded-full font-bold shadow-sm">已完成</span>
                  <div className="relative">
                    <button 
                      onClick={(e) => toggleMenu(e, project.id)}
                      className="p-2 bg-white/90 backdrop-blur-sm hover:bg-white text-slate-600 hover:text-primary-600 rounded-full transition-all focus:outline-none shadow-sm relative z-[60]"
                    >
                      <Icon name="MoreHorizontal" className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* 下拉菜单 */}
              {activeMenuId === project.id && (
                <div className="absolute right-4 top-16 w-36 bg-white rounded-xl shadow-soft border border-slate-100 overflow-hidden z-[100] animate-fade-in origin-top-right">
                  <button 
                    onClick={(e) => handleRename(e, project.id)}
                    className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary-600 transition-colors flex items-center gap-2"
                  >
                    <Icon name="Edit2" className="w-4 h-4" />
                    重命名
                  </button>
                  <div className="h-px bg-slate-100"></div>
                  <button 
                    onClick={(e) => handleDelete(e, project.id)}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    <Icon name="Trash2" className="w-4 h-4" />
                    删除项目
                  </button>
                </div>
              )}
              
              <div className="mt-4 px-2">
                <h3 className="font-bold text-slate-800 truncate text-base group-hover:text-primary-600 transition-colors">{project.title}</h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">{project.updated}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
