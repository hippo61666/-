"use client";

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';

interface GlobalSidebarProps {
  activePage: string;
  onNavigate: (page: string, projectId?: string | null) => void;
  onLogout: () => void;
}

export default function GlobalSidebar({ activePage, onNavigate, onLogout }: GlobalSidebarProps) {
  const brandKitItem = { id: 'brandKit', icon: 'Palette', label: '企业品牌套件' };

  const toolItems = [
      { id: 'skill', icon: 'Zap', label: 'Skill' },
      { id: 'videoGen', icon: 'Wand2', label: '视频生成' }
  ];

  const projectItems = [
      { id: 'history', icon: 'Folder', label: '我的项目' }
  ];

  return (
      <aside className="w-64 h-full bg-[#110810]/80 backdrop-blur-2xl border-r border-white/5 flex flex-col py-6 shrink-0 z-20 shadow-glass relative">
          <div className="flex items-center gap-3 px-6 mb-10 shrink-0 cursor-pointer group">
              <div className="w-10 h-10 bg-white/5 border border-white/10 shadow-glass rounded-[1rem] flex items-center justify-center transition-all duration-500 group-hover:scale-105 group-hover:bg-white/10">
                  <Icon name="Hexagon" className="w-5 h-5 stroke-gradient" />
              </div>
              <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-white/50">Marketing Studio</span>
                  <span className="text-sm font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#FF2A6D] group-hover:to-[#FF6B6B] transition-all duration-300">MICHI</span>
              </div>
          </div>



          <div className="flex-1 overflow-y-auto custom-scrollbar px-4 space-y-8">
              <div>
                  <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 mb-3 px-2">STEP 1: BRAND FOUNDATION</h3>
                  <div className="relative">
                      <button 
                          onClick={() => onNavigate(brandKitItem.id, null)}
                          className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] focus:outline-none relative w-full overflow-hidden ${
                              activePage === brandKitItem.id 
                                  ? 'bg-[#1a0f14]/90 shadow-[0_0_15px_rgba(255,42,109,0.2)] text-white z-10' 
                                  : 'bg-[#1a0f14]/80 text-white z-10'
                          }`}
                      >
                          {/* 扫光动效边框 - 选中与未选中状态都有，但样式不同 */}
                          
                          {activePage === brandKitItem.id ? (
                              // 选中(Active)状态下的扫光：纯红色光晕
                              <>
                                  <div className="absolute inset-0 rounded-xl border border-white/10 z-0 pointer-events-none"></div>
                                  <div className="absolute inset-0 rounded-xl overflow-hidden z-0">
                                      <div className="absolute inset-[-100%] animate-border-spin opacity-100" style={{ background: 'conic-gradient(from 0deg, transparent 0 280deg, #FF2A6D 360deg)' }}></div>
                                      <div className="absolute inset-[-100%] animate-border-spin blur-md opacity-60 mix-blend-screen" style={{ background: 'conic-gradient(from 0deg, transparent 0 280deg, #FF2A6D 360deg)' }}></div>
                                  </div>
                                  <div className="absolute inset-[1px] bg-[#110810]/90 rounded-[11px] z-0"></div>
                              </>
                          ) : (
                              // 未选中状态下的扫光：原有的高亮白头红尾
                              <>
                                  <div className="absolute inset-0 rounded-xl border border-[#FF2A6D]/30 shadow-[0_0_15px_rgba(255,42,109,0.4)] z-0 pointer-events-none"></div>
                                  <div className="absolute inset-0 rounded-xl overflow-hidden z-0">
                                      <div className="absolute inset-[-100%] animate-border-spin opacity-100" style={{ background: 'conic-gradient(from 0deg, transparent 0 240deg, #FF2A6D 320deg, #FFFFFF 360deg)' }}></div>
                                      <div className="absolute inset-[-100%] animate-border-spin blur-md opacity-40 mix-blend-screen" style={{ background: 'conic-gradient(from 0deg, transparent 0 240deg, #FF2A6D 320deg, #FFFFFF 360deg)' }}></div>
                                  </div>
                                  <div className="absolute inset-[1px] bg-[#110810] rounded-[11px] z-0"></div>
                              </>
                          )}

                          <div className={`relative z-10 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-500 ${
                              activePage === brandKitItem.id 
                                  ? 'bg-gradient-to-br from-[#FF2A6D] to-[#FF6B6B]' 
                                  : 'bg-gradient-to-br from-[#FF2A6D]/20 to-[#FF6B6B]/20 group-hover:from-[#FF2A6D]/40 group-hover:to-[#FF6B6B]/40'
                          }`}>
                              <Icon name={brandKitItem.icon} className={`w-4 h-4 transition-all duration-500 ${
                                  activePage === brandKitItem.id ? 'text-white' : 'text-[#FF2A6D] group-hover:text-white'
                              }`} />
                          </div>
                          <span className={`relative z-10 text-sm font-bold transition-all duration-300 ${
                              activePage === brandKitItem.id 
                                  ? 'text-white' 
                                  : 'text-transparent bg-clip-text bg-gradient-to-r from-[#FF2A6D] to-[#FF6B6B] group-hover:text-white group-hover:bg-none'
                          }`}>{brandKitItem.label}</span>
                      </button>
                  </div>
              </div>

              <div>
                  <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 mb-3 px-2">STEP 2: AI CREATION</h3>
                  <nav className="flex flex-col gap-1 w-full">
                      {toolItems.map(item => (
                          <button 
                              key={item.id}
                              onClick={() => onNavigate(item.id, null)}
                              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] focus:outline-none relative w-full ${
                                  activePage === item.id 
                                      ? 'bg-white/10 border border-white/10 shadow-glass' 
                                      : 'hover:bg-white/5 border border-transparent text-white/60 hover:text-white'
                              }`}
                          >
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-500 ${
                                  activePage === item.id ? 'bg-gradient-to-br from-[#FF2A6D] to-[#FF6B6B]' : 'bg-white/5 group-hover:bg-white/10'
                              }`}>
                                  <Icon name={item.icon} className={`w-4 h-4 transition-all duration-500 ${
                                      activePage === item.id ? 'text-white' : 'text-white/60 group-hover:text-white'
                                  }`} />
                              </div>
                              <span className={`text-sm font-medium transition-colors ${
                                  activePage === item.id ? 'text-white' : ''
                              }`}>{item.label}</span>
                          </button>
                      ))}
                  </nav>
              </div>

              <div>
                  <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 mb-3 px-2 flex justify-between items-center">
                      <span>STEP 3: WORKSPACE</span>
                  </h3>
                  <nav className="flex flex-col gap-1 w-full">
                      {projectItems.map(item => (
                          <button 
                              key={item.id}
                              onClick={() => onNavigate(item.id, null)}
                              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] focus:outline-none relative w-full ${
                                  activePage === item.id 
                                      ? 'bg-white/10 border border-white/10 shadow-glass' 
                                      : 'hover:bg-white/5 border border-transparent text-white/60 hover:text-white'
                              }`}
                          >
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-500 ${
                                  activePage === item.id ? 'bg-gradient-to-br from-[#FF2A6D] to-[#FF6B6B]' : 'bg-white/5 group-hover:bg-white/10'
                              }`}>
                                  <Icon name={item.icon} className={`w-4 h-4 transition-all duration-500 ${
                                      activePage === item.id ? 'text-white' : 'text-white/60 group-hover:text-white'
                                  }`} />
                              </div>
                              <span className={`text-sm font-medium transition-colors ${
                                  activePage === item.id ? 'text-white' : ''
                              }`}>{item.label}</span>
                          </button>
                      ))}
                  </nav>
              </div>
          </div>

          <div className="mt-auto w-full px-6 pt-6 border-t border-white/5 flex items-center justify-between">
              <button className="flex items-center gap-2 group focus:outline-none">
                  <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 overflow-hidden flex items-center justify-center">
                      <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=150&q=80" alt="Avatar" className="w-full h-full object-cover" />
                  </div>
              </button>
              <button onClick={onLogout} className="text-white/40 hover:text-[#FF2A6D] transition-colors focus:outline-none">
                  <Icon name="LogOut" className="w-4 h-4" />
              </button>
          </div>
      </aside>
  );
}
