"use client";

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';

export default function ImageGenerator() {
  const [activeBrandKit, setActiveBrandKit] = useState('浦发银行');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const brandKits = ['浦发银行', '山下有松'];

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    // Simulate generation delay
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="flex h-screen bg-transparent animate-fade-in relative w-full">
        {/* 装饰光晕 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-soft rounded-full pointer-events-none z-0"></div>

        {/* 主区域 */}
        <main className="flex-1 flex flex-col relative overflow-hidden w-full z-10">
            
            {/* 顶部 Header */}
            <header className="h-20 bg-transparent flex items-center justify-between px-6 md:px-10 shrink-0 z-50 absolute top-0 w-full">
                <div></div> {/* Left placeholder */}
                
                <div className="relative">
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
                        <div className="absolute right-0 mt-2 w-48 bg-[#1a0f14]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-glass overflow-hidden z-[100] animate-fade-in origin-top-right">
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
            </header>

            <div className="flex-1 flex flex-col justify-center px-8 pb-32 w-full max-w-5xl mx-auto h-full relative">
                <div className="text-center mb-12 animate-slide-up" style={{ animationDelay: '100ms' }}>
                    <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/50 mb-6">Marketing Studio</h2>
                    <h1 className="mb-8 flex flex-col items-center justify-center gap-4 md:gap-5">
                        <div className="flex items-baseline justify-center gap-3 md:gap-4">
                            <span className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white/90 tracking-[0.15em]" style={{ fontFamily: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif' }}>让</span>
                            <span className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#FF2A6D] to-[#FF6B6B] drop-shadow-2xl" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>MICHI</span>
                            <span className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white/90 tracking-[0.15em]" style={{ fontFamily: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif' }}>为你生成</span>
                        </div>
                        <div className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white/90 tracking-[0.15em]" style={{ fontFamily: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif' }}>
                            高质量广告图像
                        </div>
                    </h1>
                </div>

                {/* 居中的横向悬浮输入框 */}
                <div className="w-full bg-white/[0.02] border border-white/10 p-2 rounded-[2rem] shadow-glass animate-slide-up relative z-20" style={{ animationDelay: '200ms' }}>
                    <div className="bg-[#1a0f14] rounded-[calc(2rem-0.5rem)] flex flex-col md:flex-row items-start md:items-center p-3 gap-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                        
                        <div className="flex-1 flex flex-col pl-2 md:pl-4 w-full">
                            <div className="flex items-center gap-2 mb-2 w-full">
                                <Icon name="Image" className="w-4 h-4 text-white/30 shrink-0" />
                                <input 
                                    type="text" 
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    className="w-full bg-transparent border-none text-white text-sm md:text-base focus:outline-none placeholder:text-white/30 font-medium"
                                    placeholder="描述您想要生成的广告图片..."
                                />
                            </div>
                        </div>

                        <div className="flex flex-row md:flex-row items-center justify-end gap-2 md:border-l border-white/10 md:pl-3 w-full md:w-auto mt-2 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/5">
                            <button 
                                onClick={handleGenerate}
                                disabled={isGenerating || !prompt.trim()}
                                className="h-12 w-12 md:h-16 md:w-16 shrink-0 btn-gradient rounded-xl md:rounded-2xl flex items-center justify-center shadow-glow group focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                title="生成图片"
                            >
                                {isGenerating ? (
                                    <Icon name="Loader2" className="w-5 h-5 md:w-6 md:h-6 text-white animate-spin" />
                                ) : (
                                    <Icon name="ArrowUp" className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:-translate-y-1 transition-transform" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
  );
}
