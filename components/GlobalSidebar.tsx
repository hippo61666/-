"use client";

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';

interface GlobalSidebarProps {
  activePage: string;
  onNavigate: (page: string, projectId?: string | null) => void;
  onLogout: () => void;
}

export default function GlobalSidebar({ activePage, onNavigate, onLogout }: GlobalSidebarProps) {
  const menuItems = [
      { id: 'brandKit', icon: 'Palette', label: '企业品牌套件' },
      { id: 'videoGen', icon: 'Wand2', label: '视频生成' },
      { id: 'history', icon: 'Folder', label: '我的项目' }
  ];

  return (
      <aside className="w-20 lg:w-24 bg-white border-r border-slate-100 flex flex-col items-center py-8 shrink-0 z-20 shadow-sm relative">
          <div className="w-12 h-12 bg-white border border-slate-100 shadow-sm rounded-2xl flex items-center justify-center mb-10 shrink-0">
              <Icon name="Hexagon" className="w-7 h-7 stroke-gradient" />
          </div>

          <nav className="flex flex-col gap-6 w-full px-4 flex-1">
              {menuItems.map(item => (
                  <button 
                      key={item.id}
                      onClick={() => onNavigate(item.id, null)}
                      className={`group flex flex-col items-center justify-center gap-2 p-3 rounded-2xl transition-all duration-300 focus:outline-none relative w-full ${
                          activePage === item.id 
                              ? 'bg-transparent font-bold' 
                              : 'hover:bg-primary-50 hover:text-primary-500 text-slate-400 font-medium'
                      }`}
                  >
                      {activePage === item.id && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-primary-500 rounded-r-full animate-fade-in shadow-glow"></div>
                      )}
                      <div className="relative">
                          <Icon name={item.icon} className={`w-6 h-6 transition-all duration-300 ${
                              activePage === item.id 
                                  ? 'stroke-gradient scale-110' 
                                  : 'group-hover:scale-110'
                          }`} />
                      </div>
                      <span className={`text-[10px] tracking-wide transition-colors ${
                          activePage === item.id ? 'text-primary-600' : ''
                      }`}>{item.label}</span>
                  </button>
              ))}
          </nav>

          <div className="mt-auto flex flex-col gap-4 w-full px-4 pt-8 border-t border-slate-100">
              <button className="group flex flex-col items-center justify-center gap-1 p-2 text-slate-400 hover:text-slate-700 transition-colors focus:outline-none w-full">
                  <Icon name="HelpCircle" className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
              <button onClick={onLogout} className="group flex flex-col items-center justify-center gap-1 p-2 text-slate-400 hover:text-red-500 transition-colors focus:outline-none w-full">
                  <Icon name="LogOut" className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
          </div>
      </aside>
  );
}
