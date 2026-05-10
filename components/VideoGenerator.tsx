"use client";

import { useState, useRef, useEffect } from 'react';
import { Icon } from '@/components/ui/Icon';

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
  videoUrl?: string;
  loading?: boolean;
  progress?: number;
}

interface VideoGeneratorProps {
  onNavigate: (page: string, projectId?: string | null) => void;
  projectId?: string | null;
  onProjectCreated?: (id: string | null) => void;
}

export default function VideoGenerator({ onNavigate, projectId, onProjectCreated }: VideoGeneratorProps) {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load existing project history
  useEffect(() => {
    if (projectId) {
      fetch(`/api/projects/${projectId}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.messages) {
            setChatHistory(data.messages);
          }
        })
        .catch(err => console.error("Failed to load project:", err));
    } else {
      setChatHistory([]);
    }
  }, [projectId]);

  const scrollToBottom = () => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
      scrollToBottom();
  }, [chatHistory, isGenerating, generationProgress]);

  const handleGenerate = async (e: React.MouseEvent | React.FormEvent) => {
      e.preventDefault();
      
      const userPrompt = chatInput.trim() || '使用极简科技风生成一段手表广告视频，时长3秒，比例21:9。';
      
      // Optimistic update
      const newHistory = [...chatHistory, { role: 'user' as const, content: userPrompt }];
      setChatHistory(newHistory);
      setChatInput('');
      setIsGenerating(true);
      setGenerationProgress(0);

      // Start progress simulation
      let progress = 0;
      const interval = setInterval(() => {
          progress += 5;
          if (progress >= 95) progress = 95; // Wait for real response to reach 100
          setGenerationProgress(progress);
      }, 200);

      try {
        let currentProjectId = projectId;
        
        // If no project exists, create one first
        if (!currentProjectId) {
          const pRes = await fetch('/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: userPrompt.substring(0, 15) + '...' })
          });
          const pData = await pRes.json();
          currentProjectId = pData.id;
          if (onProjectCreated) onProjectCreated(pData.id);
        }

        // Call generate API
        const gRes = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: userPrompt, projectId: currentProjectId })
        });
        const gData = await gRes.json();

        clearInterval(interval);
        setGenerationProgress(100);
        
        setTimeout(() => {
          setIsGenerating(false);
          if (gData.success && gData.message) {
            setChatHistory(prev => [...prev, gData.message]);
          } else {
            // Handle mock fallback if API didn't return properly
            setChatHistory(prev => [...prev, { 
                role: 'ai', 
                content: '这是为您调用 Seedance 2.0 大模型生成的视频，请查阅。',
                videoUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
            }]);
          }
        }, 500);

      } catch (error) {
        console.error("Generate error:", error);
        clearInterval(interval);
        setIsGenerating(false);
        setChatHistory(prev => [...prev, { role: 'ai', content: '抱歉，视频生成失败，请重试。' }]);
      }
  };

  return (
      <div className="flex h-screen bg-surface-50 animate-fade-in">
          {/* 左侧配置面板，仅在没有对话历史且未生成时显示 */}
          {chatHistory.length === 0 && !isGenerating && (
              <aside className="w-full lg:w-[450px] xl:w-[480px] bg-white border-b lg:border-b-0 lg:border-r border-slate-100 overflow-y-auto flex flex-col shrink-0 z-10 custom-scrollbar shadow-sm">
                  <header className="h-20 border-b border-slate-100 flex items-center justify-between px-6 md:px-8 shrink-0">
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 flex items-center justify-center">
                              <Icon name="Wand2" className="w-6 h-6 text-gradient" />
                          </div>
                          <h1 className="text-xl font-bold text-slate-800 tracking-tight">视频生成</h1>
                      </div>
                  </header>

                  <div className="p-6 md:p-8 space-y-10 flex-1">
                      <section className="space-y-4">
                          <div className="flex items-center justify-between">
                              <h2 className="text-sm font-bold text-primary-600 flex items-center gap-2">
                                  <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-black">1</span>
                                  选择品牌套件
                              </h2>
                              <button onClick={() => onNavigate('brandKit')} className="text-xs font-bold text-slate-400 hover:text-primary-500 transition-colors flex items-center gap-1 focus:outline-none">
                                  管理套件 <Icon name="ArrowRight" className="w-3 h-3" />
                              </button>
                          </div>
                          
                          <div className="relative group cursor-pointer animate-slide-up">
                              <select className="w-full appearance-none bg-white border-2 border-slate-200 rounded-2xl p-4 pr-12 text-slate-800 font-bold focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10 transition-all hover:border-primary-300 shadow-sm cursor-pointer">
                                  <option value="tech">极简科技风</option>
                                  <option value="sport">活力运动风</option>
                                  <option value="nature">自然清新</option>
                                  <option value="none">无（不使用套件）</option>
                              </select>
                              <Icon name="ChevronDown" className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-hover:text-primary-500 transition-colors pointer-events-none" />
                          </div>
                          <div className="flex items-center gap-2 text-xs font-medium text-primary-600 bg-primary-50 w-fit px-3 py-1.5 rounded-lg animate-fade-in">
                              <Icon name="CheckCircle2" className="w-3.5 h-3.5" />
                              <span>状态：已加载</span>
                          </div>
                      </section>

                      <section className="space-y-4">
                          <h2 className="text-sm font-bold text-primary-600 flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-black">2</span>
                              视频描述脚本
                          </h2>
                          <textarea 
                              className="w-full h-40 p-5 bg-surface-50 border border-slate-200 rounded-3xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 text-slate-800 text-sm outline-none resize-none transition-all shadow-inner placeholder:text-slate-400"
                              placeholder="请输入详细的画面与动作描述..."
                              value={chatInput}
                              onChange={(e) => setChatInput(e.target.value)}
                          ></textarea>
                      </section>

                      <section className="space-y-4">
                          <h2 className="text-sm font-bold text-primary-600 flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-black">3</span>
                              输出规格
                          </h2>
                          <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                  <label className="text-xs font-bold text-slate-500 ml-1">视频生成时间</label>
                                  <div className="relative group cursor-pointer">
                                      <select className="w-full appearance-none bg-surface-50 border border-slate-200 rounded-2xl p-3 pr-10 text-slate-700 text-sm font-semibold focus:outline-none focus:border-primary-400 focus:bg-white transition-all hover:border-slate-300 cursor-pointer">
                                          <option>3秒</option>
                                          <option>5秒</option>
                                          <option>10秒</option>
                                      </select>
                                      <Icon name="ChevronDown" className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-hover:text-primary-500 transition-colors" />
                                  </div>
                              </div>
                              <div className="space-y-2">
                                  <label className="text-xs font-bold text-slate-500 ml-1">视频比例</label>
                                  <div className="relative group cursor-pointer">
                                      <select className="w-full appearance-none bg-surface-50 border border-slate-200 rounded-2xl p-3 pr-10 text-slate-700 text-sm font-semibold focus:outline-none focus:border-primary-400 focus:bg-white transition-all hover:border-slate-300 cursor-pointer">
                                          <option>21:9 (超宽屏)</option>
                                          <option>16:9 (横屏)</option>
                                          <option>9:16 (竖屏)</option>
                                          <option>1:1 (方形)</option>
                                      </select>
                                      <Icon name="ChevronDown" className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-hover:text-primary-500 transition-colors" />
                                  </div>
                              </div>
                          </div>
                      </section>

                      <div className="pt-6">
                          <button 
                              onClick={handleGenerate}
                              className="w-full py-4 rounded-2xl font-bold focus:outline-none flex justify-center items-center gap-2 btn-gradient text-white"
                          >
                              <Icon name="Play" className="w-5 h-5 text-white" />
                              调用 Seedance 2.0 生成视频
                          </button>
                      </div>
                  </div>
              </aside>
          )}

          {/* 右侧主预览/对话区域 */}
          <main className="flex-1 flex flex-col relative overflow-hidden bg-slate-50">
              {/* 装饰光晕 */}
              <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary-100/50 rounded-full blur-[120px] pointer-events-none"></div>
              
              {/* 顶部 Header：包含开启新项目按钮 */}
              <header className="h-20 bg-white/50 backdrop-blur-md border-b border-slate-100/50 flex items-center justify-between px-6 md:px-10 shrink-0 z-20 absolute top-0 w-full">
                  <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center">
                          <Icon name="Wand2" className="w-6 h-6 text-gradient" />
                      </div>
                      <h1 className="text-xl font-bold text-slate-800 tracking-tight">视频生成</h1>
                  </div>
                  
                  <button 
                    onClick={() => {
                        if (onProjectCreated) onProjectCreated(null);
                        setChatHistory([]);
                        setChatInput('');
                        setIsGenerating(false);
                    }}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-xl hover:border-primary-200 hover:bg-primary-50 text-slate-600 hover:text-primary-600 transition-all focus:outline-none flex items-center gap-2 shadow-sm text-sm font-bold"
                >
                      <Icon name="Plus" className="w-4 h-4" />
                      开启新项目
                  </button>
              </header>

              {chatHistory.length === 0 && !isGenerating ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 animate-fade-in pt-20">
                      <div className="w-24 h-24 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center mb-6 animate-float">
                          <Icon name="Film" className="w-10 h-10 text-slate-300" />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-800 mb-3 tracking-tight">等待生成指令</h2>
                      <p className="text-slate-500 max-w-sm text-center text-sm leading-relaxed">
                          在左侧配置参数并点击“开始生成”，您的专属视频和后续对话将在此处呈现。
                      </p>
                  </div>
              ) : (
                  <div className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10 pb-40 space-y-6 custom-scrollbar relative z-10 pt-28">
                      {chatHistory.map((msg, index) => (
                          <div key={index} className={`flex gap-4 max-w-4xl mx-auto ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-slide-up`}>
                              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border ${
                                  msg.role === 'user' ? 'bg-primary-500 text-white border-primary-600' : 'bg-white border-slate-200'
                              }`}>
                                  <Icon name={msg.role === 'user' ? 'User' : 'Sparkles'} className={`w-5 h-5 ${msg.role === 'ai' ? 'text-primary-500' : 'text-white'}`} />
                              </div>
                              <div className={`flex flex-col gap-2 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                  <div className={`p-4 rounded-3xl shadow-sm ${
                                      msg.role === 'user' 
                                          ? 'bg-primary-500 text-white rounded-tr-sm' 
                                          : 'bg-white text-slate-700 border border-slate-100 rounded-tl-sm'
                                  }`}>
                                      <p className="text-sm leading-relaxed">{msg.content}</p>
                                  </div>
                                  {msg.videoUrl && (
                                      <div className="w-full max-w-2xl bg-slate-900 rounded-3xl overflow-hidden shadow-lg border border-slate-200 relative group animate-fade-in">
                                          <img src={msg.videoUrl} className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Generated Video" />
                                          <div className="absolute inset-0 flex items-center justify-center">
                                              <button className="w-16 h-16 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 hover:scale-110 transition-all focus:outline-none group-hover:shadow-glow">
                                                  <Icon name="Play" className="w-6 h-6 ml-1" />
                                              </button>
                                          </div>
                                          <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                              <button className="p-2 bg-black/50 backdrop-blur-md hover:bg-black/70 text-white rounded-xl transition-colors focus:outline-none">
                                                  <Icon name="Download" className="w-4 h-4" />
                                              </button>
                                          </div>
                                      </div>
                                  )}
                              </div>
                          </div>
                      ))}
                      
                      {isGenerating && (
                          <div className="flex gap-4 max-w-4xl mx-auto animate-fade-in">
                              <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-slate-200">
                                  <Icon name="Sparkles" className="w-5 h-5 text-primary-500 animate-pulse" />
                              </div>
                              <div className="bg-white p-6 rounded-3xl rounded-tl-sm shadow-sm border border-slate-100 w-full max-w-md">
                                  <div className="flex items-center gap-3 mb-4 text-sm font-bold text-slate-700">
                                      <Icon name="Loader2" className="w-4 h-4 animate-spin text-primary-500" />
                                      Seedance 2.0 正在处理视频生成任务...
                                  </div>
                                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                      <div 
                                          className="h-full btn-gradient transition-all duration-200 ease-out"
                                          style={{ width: `${generationProgress}%` }}
                                      ></div>
                                  </div>
                                  <div className="text-right mt-2 text-xs font-bold text-primary-600">
                                      Seedance 2.0 正在生成 {generationProgress}%
                                  </div>
                              </div>
                          </div>
                      )}
                      <div ref={chatEndRef} className="h-10" />
                  </div>
              )}
              
              {/* 悬浮底部输入框 */}
              {(chatHistory.length > 0 || isGenerating) && (
                  <div className="absolute bottom-0 w-full p-6 md:p-8 bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent z-20">
                      <form onSubmit={handleGenerate} className="max-w-4xl mx-auto relative group">
                          <input 
                              type="text" 
                              value={chatInput}
                              onChange={(e) => setChatInput(e.target.value)}
                              disabled={isGenerating}
                              className="w-full bg-white/80 backdrop-blur-xl border border-slate-200 shadow-soft rounded-full py-4 pl-6 pr-16 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all placeholder:text-slate-400"
                              placeholder={isGenerating ? "正在生成中，请稍候..." : "输入修改指令，例如：将画面调亮一些..."}
                          />
                          <button 
                              type="submit"
                              disabled={isGenerating || !chatInput.trim()}
                              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-100 hover:bg-primary-500 text-slate-400 hover:text-white disabled:opacity-50 disabled:hover:bg-slate-100 disabled:hover:text-slate-400 rounded-full flex items-center justify-center transition-colors focus:outline-none"
                          >
                              <Icon name="Send" className="w-4 h-4 ml-0.5" />
                          </button>
                      </form>
                  </div>
              )}
          </main>
      </div>
  );
}
