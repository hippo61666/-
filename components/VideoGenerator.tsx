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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeBrandKit, setActiveBrandKit] = useState('浦发银行');
  
  // 新增：内容类型弹窗状态
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [activeTemplateCategory, setActiveTemplateCategory] = useState('全部');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // 新增：钩子弹窗状态
  const [isHookModalOpen, setIsHookModalOpen] = useState(false);
  const [activeHookCategory, setActiveHookCategory] = useState('全部');
  const [selectedHook, setSelectedHook] = useState<string | null>(null);

  // 新增：场景设置弹窗状态
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);
  const [activeSettingCategory, setActiveSettingCategory] = useState('全部');
  const [selectedSetting, setSelectedSetting] = useState<string | null>(null);

  // 新增：基础设置菜单状态
  const [isBaseSettingsOpen, setIsBaseSettingsOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<'main' | 'aspectRatio' | 'quality' | 'duration'>('main');
  const [videoSettings, setVideoSettings] = useState({
    aspectRatio: '9:16',
    quality: '720p',
    duration: '8s'
  });

  // 新增：产品和人物图片上传状态
  const [productImage, setProductImage] = useState<string | null>(null);
  const [personImage, setPersonImage] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const brandKits = ['浦发银行', '山下有松'];

  const templateCategories = ['全部', '抖音', '微信', 'B站', '小红书', '媒体广告'];
  
  const templatesData: Array<{id: string, category: string, title: string, desc: string, img: string, videoUrl?: string}> = [
    { id: 't4', category: '抖音', title: '刚需好物测评/场景种草', desc: '居家、日化、日用百货、小家电', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80', videoUrl: '/7cb627e646276049422e96f47fcbd8b0.mp4' },
    { id: 't5', category: '抖音', title: '痛点解决类功效视频', desc: '护肤美妆、养生保健、清洁除螨、母婴刚需', img: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=400&q=80', videoUrl: '/910ac6e6476b8354b5cfa818dd926703.mp4' },
    { id: 't6', category: '抖音', title: '本地生活团购探店', desc: '餐饮、医美、洗车、酒店、休闲娱乐', img: 'https://images.unsplash.com/photo-1533228876829-65c94e7b5025?auto=format&fit=crop&w=400&q=80', videoUrl: '/3cf251e740dd9a1385417a7174d38b8b.mp4' },
    
    { id: 't13', category: '微信', title: '中老年健康养生科普', desc: '慢病调理、滋补品、理疗器械、养生食品', img: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=400&q=80', videoUrl: '/ac0a8b70a08a0ab887cae8e977568463.mp4' },
    { id: 't14', category: '微信', title: '生活品质慢种草', desc: '家居软装、轻奢好物、家用改善型产品', img: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?auto=format&fit=crop&w=400&q=80', videoUrl: '/524d77e5b3221dbde8ff3141ca4cef02.mp4' },
    { id: 't15', category: '微信', title: '情感共鸣+品牌品宣', desc: '节日营销、品牌故事、国货情怀、温情短片', img: 'https://images.unsplash.com/photo-1611162617221-dc2a6c230623?auto=format&fit=crop&w=400&q=80', videoUrl: '/4c7800bc2b64b33fed62bedd18e57f53.mp4' },

    { id: 't7', category: 'B站', title: '模板a', desc: '横屏深度评测', img: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=400&q=80' },
    { id: 't8', category: 'B站', title: '模板b', desc: '二次元风格包装', img: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=400&q=80' },
    { id: 't9', category: 'B站', title: '模板c', desc: '知识科普向', img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80' },
    
    { id: 't10', category: '小红书', title: '模板a', desc: '精致图文风', img: 'https://images.unsplash.com/photo-1555529771-835f59fc5efe?auto=format&fit=crop&w=400&q=80' },
    { id: 't11', category: '小红书', title: '模板b', desc: '好物种草分享', img: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=400&q=80' },
    { id: 't12', category: '小红书', title: '模板c', desc: '生活方式 vlog', img: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=400&q=80' },

    { id: 't1', category: '媒体广告', title: '模板a', desc: '逼真的社交媒体视频', img: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=400&q=80' },
    { id: 't2', category: '媒体广告', title: '模板b', desc: '分步教程', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80' },
    { id: 't3', category: '媒体广告', title: '模板c', desc: '高质量的开箱视频', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80' }
  ];

  const filteredTemplates = activeTemplateCategory === '全部' 
    ? templatesData 
    : templatesData.filter(t => t.category === activeTemplateCategory);

  const settingCategories = ['全部', '现实', '超现实'];
  
  const settingsData = [
    { id: 's1', category: '现实', title: '卧室', desc: '靠在枕头上，柔和的窗外自然光。', img: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=400&q=80' },
    { id: 's2', category: '现实', title: '车里', desc: '透过车窗照射进来的自然光线。', img: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=400&q=80' },
    { id: 's3', category: '现实', title: '健身房', desc: '充满活力的环境，配有运动器材。', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80' },
    { id: 's4', category: '现实', title: '厨房', desc: '明亮的厨房操作台场景。', img: 'https://images.unsplash.com/photo-1556910103-1c02745a872f?auto=format&fit=crop&w=400&q=80' },
    { id: 's5', category: '现实', title: '街道', desc: '城市街道风格背景。', img: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=400&q=80' },
    { id: 's6', category: '现实', title: '自然', desc: '户外 - 小径、公园、海滩或花园。', img: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=400&q=80' },
    
    { id: 's7', category: '超现实', title: '飞机翅膀上', desc: '坐在高空飞行中的飞机机翼上。', img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=400&q=80' },
    { id: 's8', category: '超现实', title: '火山边', desc: '活跃熔岩流附近的戏剧性光影。', img: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80' },
    { id: 's9', category: '超现实', title: '月球上', desc: '低重力的月球表面环境。', img: 'https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?auto=format&fit=crop&w=400&q=80' },
    { id: 's10', category: '超现实', title: '古代街道', desc: '带有古代建筑的历史场景。', img: 'https://images.unsplash.com/photo-1519098901909-b1553a1190af?auto=format&fit=crop&w=400&q=80' },
    { id: 's11', category: '超现实', title: '列车顶上', desc: '在行驶中的火车顶部的动作场景。', img: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=400&q=80' },
  ];

  const filteredSettings = activeSettingCategory === '全部' 
    ? settingsData 
    : settingsData.filter(s => s.category === activeSettingCategory);

  const hookCategories = ['全部', '特技', '微妙'];
  
  const hooksData: Array<{id: string, category: string, title: string, desc: string, img: string, videoUrl?: string}> = [
    { id: 'h1', category: '特技', title: '反常识颠覆（冲突型）', desc: '一句话打破常识，制造认知冲突', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80', videoUrl: '/9fe8bf931f22907ebf45c9ab0e32b52d.mp4' },
    { id: 'h2', category: '微妙', title: '结果前置（成果型）', desc: '先放最炸的结果，用户为了“学方法”必须看完', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80', videoUrl: '/cb88184660d3684eefd6ce26485039ee.mp4' },
    { id: 'h3', category: '特技', title: '痛点点名（精准对标）', desc: '直接喊出人群+困境，被点到的人立刻停住', img: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=400&q=80', videoUrl: '/2fbe2c8f14c2aa3dd188e7e30118d23b.mp4' }
  ];

  const filteredHooks = activeHookCategory === '全部' 
    ? hooksData 
    : hooksData.filter(h => h.category === activeHookCategory);

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

              {chatHistory.length === 0 && !isGenerating ? (
                  <div className="flex-1 flex flex-col justify-center px-8 pb-32 w-full max-w-5xl mx-auto h-full relative">
                      <div className="text-center mb-12 animate-slide-up" style={{ animationDelay: '100ms' }}>
                          <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/50 mb-6">Marketing Studio</h2>
                          <h1 className="mb-8 flex flex-col items-center justify-center gap-4 md:gap-5">
                              <div className="flex items-baseline justify-center gap-3 md:gap-4">
                                  <span className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white/90 tracking-[0.15em]" style={{ fontFamily: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif' }}>让</span>
                                  <span className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#FF2A6D] to-[#FF6B6B] drop-shadow-2xl" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>MICHI</span>
                                  <span className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white/90 tracking-[0.15em]" style={{ fontFamily: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif' }}>帮你把</span>
                              </div>
                              <div className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white/90 tracking-[0.15em]" style={{ fontFamily: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif' }}>
                                产品变为广告
                            </div>
                          </h1>
                      </div>

                      {/* 居中的横向悬浮输入框 (Double-Bezel 结构) */}
                      <div className="w-full bg-white/[0.02] border border-white/10 p-2 rounded-[2rem] shadow-glass animate-slide-up relative z-20" style={{ animationDelay: '200ms' }}>
                          <div className="bg-[#1a0f14] rounded-[calc(2rem-0.5rem)] flex flex-col md:flex-row items-start md:items-center p-3 gap-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                              
                              <div className="flex-1 flex flex-col pl-2 md:pl-4 w-full">
                                  <div className="flex items-center gap-2 mb-2 w-full">
                                      <Icon name="Plus" className="w-4 h-4 text-white/30 shrink-0" />
                                      <input 
                                          type="text" 
                                          value={chatInput}
                                          onChange={(e) => setChatInput(e.target.value)}
                                          className="w-full bg-transparent border-none text-white text-sm md:text-base focus:outline-none placeholder:text-white/30 font-medium"
                                        placeholder="描述要表现的广告内容..."
                                    />
                                  </div>
                                  
                                  <div className="flex flex-wrap items-center gap-2">
                                      <button 
                                          onClick={(e) => {
                                              e.preventDefault();
                                              setIsTemplateModalOpen(true);
                                          }}
                                          className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] md:text-[11px] font-medium text-white/70 transition-colors shrink-0"
                                      >
                                          <Icon name="Video" className="w-3 h-3" /> 
                                          {selectedTemplate ? (
                                              <span className="text-white font-bold">{templatesData.find(t => t.id === selectedTemplate)?.title || '内容类型'}</span>
                                          ) : (
                                              '内容类型'
                                          )}
                                          <Icon name="ChevronDown" className="w-3 h-3 ml-1 opacity-50" />
                                      </button>
                                      <button 
                                          onClick={(e) => {
                                              e.preventDefault();
                                              setIsHookModalOpen(true);
                                          }}
                                          className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] md:text-[11px] font-medium text-white/70 transition-colors shrink-0"
                                      >
                                          <Icon name="Zap" className="w-3 h-3" /> 
                                          {selectedHook ? (
                                              <span className="text-white font-bold">{hooksData.find(h => h.id === selectedHook)?.title || '钩子'}</span>
                                          ) : (
                                              '钩子'
                                          )}
                                          <Icon name="ChevronDown" className="w-3 h-3 ml-1 opacity-50" />
                                      </button>
                                      <button 
                                          onClick={(e) => {
                                              e.preventDefault();
                                              setIsSettingModalOpen(true);
                                          }}
                                          className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] md:text-[11px] font-medium text-white/70 transition-colors shrink-0"
                                      >
                                          <Icon name="Globe" className="w-3 h-3" /> 
                                          {selectedSetting ? (
                                              <span className="text-white font-bold">{settingsData.find(s => s.id === selectedSetting)?.title || '场景设置'}</span>
                                          ) : (
                                              '场景设置'
                                          )}
                                          <Icon name="ChevronDown" className="w-3 h-3 ml-1 opacity-50" />
                                       </button>
                                       
                                       {/* 基础设置菜单容器 */}
                                       <div className="relative">
                                           <button 
                                                 onClick={(e) => {
                                                     e.preventDefault();
                                                     setIsBaseSettingsOpen(!isBaseSettingsOpen);
                                                     if (!isBaseSettingsOpen) setActiveSubMenu('main');
                                                 }}
                                                 className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors shrink-0 ${isBaseSettingsOpen ? 'bg-white/20 text-white' : 'bg-white/5 hover:bg-white/10 text-white/70'}`}
                                             >
                                                 <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                     <line x1="2" y1="6" x2="9" y2="6"></line>
                                                     <circle cx="11" cy="6" r="2"></circle>
                                                     <line x1="14" y1="10" x2="7" y2="10"></line>
                                                     <circle cx="5" cy="10" r="2"></circle>
                                                 </svg>
                                             </button>
                                           
                                           {/* 下拉菜单 */}
                                           {isBaseSettingsOpen && (
                                               <div className="absolute top-full left-0 mt-2 w-64 bg-[#1a0f14]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden z-50 animate-fade-in">
                                                   {/* 主菜单 */}
                                                   {activeSubMenu === 'main' && (
                                                       <div className="p-2 space-y-1">
                                                           <button 
                                                               onClick={() => setActiveSubMenu('aspectRatio')}
                                                               className="w-full flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors text-white group"
                                                           >
                                                               <div className="flex items-center gap-3 text-sm">
                                                                   <Icon name="Square" className="w-4 h-4 text-white/50 group-hover:text-white" />
                                                                   视频尺寸
                                                               </div>
                                                               <div className="flex items-center gap-2 text-sm text-white/50">
                                                                   {videoSettings.aspectRatio}
                                                                   <Icon name="ChevronRight" className="w-4 h-4" />
                                                               </div>
                                                           </button>
                                                           
                                                           <button 
                                                               onClick={() => setActiveSubMenu('quality')}
                                                               className="w-full flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors text-white group"
                                                           >
                                                               <div className="flex items-center gap-3 text-sm">
                                                                   <Icon name="Monitor" className="w-4 h-4 text-white/50 group-hover:text-white" />
                                                                   视频分辨率
                                                               </div>
                                                               <div className="flex items-center gap-2 text-sm text-white/50">
                                                                   {videoSettings.quality}
                                                                   <Icon name="ChevronRight" className="w-4 h-4" />
                                                               </div>
                                                           </button>
                                                           
                                                           <button 
                                                               onClick={() => setActiveSubMenu('duration')}
                                                               className="w-full flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors text-white group"
                                                           >
                                                               <div className="flex items-center gap-3 text-sm">
                                                                   <Icon name="Clock" className="w-4 h-4 text-white/50 group-hover:text-white" />
                                                                   视频时长
                                                               </div>
                                                               <div className="flex items-center gap-2 text-sm text-white/50">
                                                                   {videoSettings.duration}
                                                                   <Icon name="ChevronRight" className="w-4 h-4" />
                                                               </div>
                                                           </button>
                                                       </div>
                                                   )}

                                                   {/* 尺寸子菜单 */}
                                                   {activeSubMenu === 'aspectRatio' && (
                                                       <div>
                                                           <div className="flex items-center gap-2 p-3 border-b border-white/5">
                                                               <button onClick={() => setActiveSubMenu('main')} className="p-1 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors">
                                                                   <Icon name="ChevronLeft" className="w-4 h-4" />
                                                               </button>
                                                               <span className="text-xs font-bold text-white/50 tracking-widest">视频尺寸</span>
                                                           </div>
                                                           <div className="p-2 grid grid-cols-2 gap-1">
                                                               {['Auto', '16:9', '9:16', '4:3', '3:4', '1:1', '21:9'].map(ratio => (
                                                                   <button
                                                                       key={ratio}
                                                                       onClick={() => {
                                                                           setVideoSettings({...videoSettings, aspectRatio: ratio});
                                                                           setActiveSubMenu('main');
                                                                       }}
                                                                       className={`flex items-center gap-2 p-3 rounded-xl text-sm transition-colors ${videoSettings.aspectRatio === ratio ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
                                                                   >
                                                                       <Icon name={ratio === 'Auto' ? 'Maximize' : 'Square'} className="w-4 h-4 opacity-50" />
                                                                       {ratio}
                                                                   </button>
                                                               ))}
                                                           </div>
                                                       </div>
                                                   )}

                                                   {/* 分辨率子菜单 */}
                                                   {activeSubMenu === 'quality' && (
                                                       <div>
                                                           <div className="flex items-center gap-2 p-3 border-b border-white/5">
                                                               <button onClick={() => setActiveSubMenu('main')} className="p-1 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors">
                                                                   <Icon name="ChevronLeft" className="w-4 h-4" />
                                                               </button>
                                                               <span className="text-xs font-bold text-white/50 tracking-widest">视频分辨率</span>
                                                           </div>
                                                           <div className="p-2 space-y-1">
                                                               {['720p', '1080p', '4k'].map(quality => (
                                                                   <button
                                                                       key={quality}
                                                                       onClick={() => {
                                                                           setVideoSettings({...videoSettings, quality});
                                                                           setActiveSubMenu('main');
                                                                       }}
                                                                       className={`w-full flex items-center justify-between p-3 rounded-xl text-sm transition-colors ${videoSettings.quality === quality ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
                                                                   >
                                                                       {quality}
                                                                       {videoSettings.quality === quality && <Icon name="Check" className="w-4 h-4 text-[#FF2A6D]" />}
                                                                   </button>
                                                               ))}
                                                           </div>
                                                       </div>
                                                   )}

                                                   {/* 时长子菜单 */}
                                                   {activeSubMenu === 'duration' && (
                                                       <div>
                                                           <div className="flex items-center gap-2 p-3 border-b border-white/5">
                                                               <button onClick={() => setActiveSubMenu('main')} className="p-1 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors">
                                                                   <Icon name="ChevronLeft" className="w-4 h-4" />
                                                               </button>
                                                               <span className="text-xs font-bold text-white/50 tracking-widest">视频时长</span>
                                                           </div>
                                                           <div className="p-2 space-y-1">
                                                               {['4s', '8s', '15s', '30s'].map(duration => (
                                                                   <button
                                                                       key={duration}
                                                                       onClick={() => {
                                                                           setVideoSettings({...videoSettings, duration});
                                                                           setActiveSubMenu('main');
                                                                       }}
                                                                       className={`w-full flex items-center justify-between p-3 rounded-xl text-sm transition-colors ${videoSettings.duration === duration ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
                                                                   >
                                                                       {duration}
                                                                       {videoSettings.duration === duration && <Icon name="Check" className="w-4 h-4 text-[#FF2A6D]" />}
                                                                   </button>
                                                               ))}
                                                           </div>
                                                       </div>
                                                   )}
                                               </div>
                                           )}
                                       </div>
                                   </div>
                              </div>

                              <div className="flex flex-row md:flex-row items-center justify-end gap-2 md:border-l border-white/10 md:pl-3 w-full md:w-auto mt-2 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/5">
                                  {productImage ? (
                                      <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl overflow-hidden group shrink-0 hidden md:flex">
                                          <img src={productImage} alt="Product" className="w-full h-full object-cover" />
                                          <button 
                                              onClick={(e) => {
                                                  e.preventDefault();
                                                  setProductImage(null);
                                              }}
                                              className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                          >
                                              <Icon name="X" className="w-5 h-5 text-white" />
                                          </button>
                                      </div>
                                  ) : (
                                      <label className="flex flex-col items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-white/5 rounded-xl md:rounded-2xl hover:bg-white/10 transition-colors shrink-0 hidden md:flex cursor-pointer relative overflow-hidden group">
                                          <Icon name="Plus" className="w-4 h-4 text-white/50 mb-1 group-hover:text-white/80 transition-colors" />
                                          <span className="text-[10px] tracking-wider text-white/50 group-hover:text-white/80 transition-colors">产品</span>
                                          <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                              if(e.target.files && e.target.files[0]) {
                                                  const url = URL.createObjectURL(e.target.files[0]);
                                                  setProductImage(url);
                                              }
                                          }}/>
                                      </label>
                                  )}
                                  
                                  {personImage ? (
                                      <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl overflow-hidden group shrink-0 hidden md:flex">
                                          <img src={personImage} alt="Person" className="w-full h-full object-cover" />
                                          <button 
                                              onClick={(e) => {
                                                  e.preventDefault();
                                                  setPersonImage(null);
                                              }}
                                              className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                          >
                                              <Icon name="X" className="w-5 h-5 text-white" />
                                          </button>
                                      </div>
                                  ) : (
                                      <label className="flex flex-col items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-white/5 rounded-xl md:rounded-2xl hover:bg-white/10 transition-colors shrink-0 hidden md:flex cursor-pointer relative overflow-hidden group">
                                          <Icon name="Plus" className="w-4 h-4 text-white/50 mb-1 group-hover:text-white/80 transition-colors" />
                                          <span className="text-[10px] tracking-wider text-white/50 group-hover:text-white/80 transition-colors">人物</span>
                                          <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                              if(e.target.files && e.target.files[0]) {
                                                  const url = URL.createObjectURL(e.target.files[0]);
                                                  setPersonImage(url);
                                              }
                                          }}/>
                                      </label>
                                  )}
                                  <button 
                                      onClick={handleGenerate}
                                      className="h-12 w-12 md:h-16 md:w-16 shrink-0 btn-gradient rounded-xl md:rounded-2xl flex items-center justify-center shadow-glow group focus:outline-none"
                                      title="生成视频"
                                  >
                                      <Icon name="ArrowUp" className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:-translate-y-1 transition-transform" />
                                  </button>
                              </div>
                          </div>
                      </div>

                      {/* 底部格式网格 */}
                      <div className="absolute bottom-8 left-0 w-full px-8 animate-slide-up" style={{ animationDelay: '300ms' }}>
                      </div>
                  </div>
              ) : (
                  <div className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10 pb-40 space-y-8 custom-scrollbar relative z-10 pt-28">
                      {chatHistory.map((msg, index) => (
                          <div key={index} className={`flex gap-4 max-w-4xl mx-auto ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-slide-up`}>
                              <div className={`w-10 h-10 rounded-[1rem] flex items-center justify-center shrink-0 shadow-glass border ${
                                  msg.role === 'user' ? 'bg-[#FF2A6D] text-white border-white/20' : 'bg-[#1a0f14] border-white/10'
                              }`}>
                                  <Icon name={msg.role === 'user' ? 'User' : 'Sparkles'} className={`w-5 h-5 ${msg.role === 'ai' ? 'text-[#FF2A6D]' : 'text-white'}`} />
                              </div>
                              <div className={`flex flex-col gap-3 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                  <div className={`p-5 rounded-[1.5rem] shadow-glass border ${
                                      msg.role === 'user' 
                                          ? 'bg-[#FF2A6D]/20 border-[#FF2A6D]/30 text-white rounded-tr-sm backdrop-blur-md' 
                                          : 'bg-[#1a0f14]/80 text-white/90 border-white/10 rounded-tl-sm backdrop-blur-md'
                                  }`}>
                                      <p className="text-sm leading-relaxed">{msg.content}</p>
                                  </div>
                                  {msg.videoUrl && (
                                      <div className="w-full max-w-2xl bg-black rounded-[2rem] overflow-hidden shadow-soft border border-white/10 relative group animate-fade-in">
                                          <img src={msg.videoUrl} className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Generated Video" />
                                          <div className="absolute inset-0 flex items-center justify-center">
                                              <button className="w-16 h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all focus:outline-none group-hover:scale-110">
                                                  <Icon name="Play" className="w-6 h-6 ml-1" />
                                              </button>
                                          </div>
                                      </div>
                                  )}
                              </div>
                          </div>
                      ))}
                      
                      {isGenerating && (
                          <div className="flex gap-4 max-w-4xl mx-auto animate-fade-in">
                              <div className="w-10 h-10 bg-[#1a0f14] rounded-[1rem] flex items-center justify-center shrink-0 shadow-glass border border-white/10">
                                  <Icon name="Sparkles" className="w-5 h-5 text-[#FF2A6D] animate-pulse" />
                              </div>
                              <div className="bg-[#1a0f14]/80 backdrop-blur-md p-6 rounded-[2rem] rounded-tl-sm shadow-glass border border-white/10 w-full max-w-md">
                                  <div className="flex items-center gap-3 mb-5 text-sm font-bold text-white/80">
                                      <Icon name="Loader2" className="w-4 h-4 animate-spin text-[#FF2A6D]" />
                                      Seedance 2.0 Generating...
                                  </div>
                                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                      <div 
                                          className="h-full btn-gradient transition-all duration-300 ease-out"
                                          style={{ width: `${generationProgress}%` }}
                                      ></div>
                                  </div>
                              </div>
                          </div>
                      )}
                      <div ref={chatEndRef} className="h-10" />
                  </div>
              )}
              
              {/* 悬浮底部输入框 (仅在聊天模式显示) */}
              {(chatHistory.length > 0 || isGenerating) && (
                  <div className="absolute bottom-0 w-full p-6 md:p-8 bg-gradient-to-t from-[#0d060a] via-[#0d060a]/90 to-transparent z-20">
                      <form onSubmit={handleGenerate} className="max-w-4xl mx-auto relative group">
                          <div className="p-1.5 bg-white/[0.02] border border-white/10 rounded-full shadow-glass backdrop-blur-xl">
                              <div className="relative flex items-center">
                                  <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center gap-1 z-10">
                                      <button 
                                          type="button"
                                          onClick={() => setIsTemplateModalOpen(true)}
                                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-[11px] font-medium text-white/70 transition-colors"
                                      >
                                          <Icon name="Video" className="w-3 h-3" /> 
                                          {selectedTemplate ? templatesData.find(t => t.id === selectedTemplate)?.title : '内容类型'}
                                      </button>

                                      <button 
                                          type="button"
                                          onClick={() => setIsHookModalOpen(true)}
                                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-[11px] font-medium text-white/70 transition-colors"
                                      >
                                          <Icon name="Zap" className="w-3 h-3" /> 
                                          {selectedHook ? hooksData.find(h => h.id === selectedHook)?.title : '钩子'}
                                      </button>
                                      
                                      <button 
                                          type="button"
                                          onClick={() => setIsSettingModalOpen(true)}
                                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-[11px] font-medium text-white/70 transition-colors"
                                      >
                                          <Icon name="Globe" className="w-3 h-3" /> 
                                          {selectedSetting ? settingsData.find(s => s.id === selectedSetting)?.title : '场景设置'}
                                      </button>
                                  </div>

                                  <input 
                                      type="text" 
                                      value={chatInput}
                                      onChange={(e) => setChatInput(e.target.value)}
                                      disabled={isGenerating}
                                    className="w-full bg-transparent border-none py-3 pl-[240px] pr-16 text-white text-sm focus:outline-none placeholder:text-white/40"
                                    placeholder={isGenerating ? "视频生成中..." : "描述要表现的广告内容..."}
                                />
                                  <button 
                                      type="submit"
                                      disabled={isGenerating || !chatInput.trim()}
                                      className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 btn-gradient disabled:bg-white/5 disabled:text-white/30 rounded-full flex items-center justify-center transition-all focus:outline-none"
                                  >
                                      <Icon name="ArrowUp" className="w-4 h-4" />
                                  </button>
                              </div>
                          </div>
                      </form>
                  </div>
              )}

              {/* 内容类型选择弹窗 */}
              {isTemplateModalOpen && (
                  <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-8 animate-fade-in">
                      <div className="bg-[#1a0f14]/95 border border-white/10 rounded-3xl w-full max-w-5xl max-h-[85vh] flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-slide-up overflow-hidden relative">
                          
                          {/* 弹窗头部 */}
                          <div className="flex items-center justify-between p-6 md:p-8 border-b border-white/5 shrink-0">
                              <div>
                                  <h2 className="text-2xl font-bold text-white mb-2">选择最有效的内容类型</h2>
                                  <p className="text-white/50 text-sm">从媒体广告到竖屏短视频——选择适合您的产品和受众的视频类型。</p>
                              </div>
                              <button 
                                  onClick={() => setIsTemplateModalOpen(false)}
                                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors focus:outline-none shrink-0"
                              >
                                  <Icon name="X" className="w-5 h-5" />
                              </button>
                          </div>

                          {/* 分类 Tabs */}
                          <div className="px-6 md:px-8 pt-4 pb-2 flex gap-2 overflow-x-auto custom-scrollbar shrink-0 border-b border-white/5">
                              {templateCategories.map(cat => (
                                  <button
                                      key={cat}
                                      onClick={() => setActiveTemplateCategory(cat)}
                                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                                          activeTemplateCategory === cat 
                                              ? 'bg-white/10 text-white shadow-sm' 
                                              : 'text-white/50 hover:text-white hover:bg-white/5'
                                      }`}
                                  >
                                      {cat}
                                  </button>
                              ))}
                          </div>

                          {/* 模板网格 */}
                          <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                                  {filteredTemplates.map(template => (
                                      <div 
                                          key={template.id}
                                          onClick={() => {
                                              setSelectedTemplate(template.id);
                                              setIsTemplateModalOpen(false);
                                          }}
                                          className={`group cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-300 relative ${
                                              selectedTemplate === template.id 
                                                  ? 'border-[#FF2A6D] shadow-[0_0_20px_rgba(255,42,109,0.3)]' 
                                                  : 'border-transparent hover:border-white/20'
                                          }`}
                                      >
                                          <div className="aspect-[3/4] relative bg-black">
                                              {template.videoUrl ? (
                                                  <video 
                                                      src={`${template.videoUrl}#t=0.001`}
                                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                                      loop 
                                                      muted 
                                                      playsInline 
                                                      preload="metadata"
                                                      onMouseEnter={(e) => e.currentTarget.play()}
                                                      onMouseLeave={(e) => {
                                                          e.currentTarget.pause();
                                                          e.currentTarget.currentTime = 0;
                                                      }}
                                                  />
                                              ) : (
                                                  <img src={template.img} alt={template.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                              )}
                                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none"></div>
                                              
                                              {/* 选中状态标识 */}
                                              {selectedTemplate === template.id && (
                                                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#FF2A6D] flex items-center justify-center shadow-md z-10">
                                                      <Icon name="Check" className="w-3 h-3 text-white" />
                                                  </div>
                                              )}

                                              {/* 模板信息 */}
                                              <div className="absolute bottom-0 left-0 w-full p-4 md:p-5">
                                                  <h3 className="text-white font-bold text-lg mb-1">{template.title}</h3>
                                                  <p className="text-white/60 text-xs line-clamp-2">{template.desc}</p>
                                                  <div className="mt-3 inline-block px-2 py-1 bg-white/10 backdrop-blur-md rounded text-[10px] text-white/80">
                                                      {template.category}
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      </div>
                  </div>
              )}

              {/* 场景设置弹窗 */}
              {isSettingModalOpen && (
                  <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-8 animate-fade-in">
                      <div className="bg-[#1a0f14]/95 border border-white/10 rounded-3xl w-full max-w-5xl max-h-[85vh] flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-slide-up overflow-hidden relative">
                          
                          {/* 弹窗头部 */}
                          <div className="flex items-center justify-between p-6 md:p-8 border-b border-white/5 shrink-0">
                              <div>
                                  <h2 className="text-2xl font-bold text-white mb-2 tracking-widest">设定场景</h2>
                                  <p className="text-white/50 text-sm">选择故事发生的地方。挑选一个能为您的广告营造合适氛围的场景。</p>
                              </div>
                              <button 
                                  onClick={() => setIsSettingModalOpen(false)}
                                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors focus:outline-none shrink-0"
                              >
                                  <Icon name="X" className="w-5 h-5" />
                              </button>
                          </div>

                          {/* 分类 Tabs */}
                          <div className="px-6 md:px-8 pt-4 pb-2 flex gap-2 overflow-x-auto custom-scrollbar shrink-0 border-b border-white/5">
                              {settingCategories.map(cat => (
                                  <button
                                      key={cat}
                                      onClick={() => setActiveSettingCategory(cat)}
                                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                                          activeSettingCategory === cat 
                                              ? 'bg-white/10 text-white shadow-sm' 
                                              : 'text-white/50 hover:text-white hover:bg-white/5'
                                      }`}
                                  >
                                      {cat}
                                  </button>
                              ))}
                          </div>

                          {/* 模板网格 */}
                          <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                                  {filteredSettings.map(setting => (
                                      <div 
                                          key={setting.id}
                                          onClick={() => {
                                              setSelectedSetting(setting.id);
                                              setIsSettingModalOpen(false);
                                          }}
                                          className={`group cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-300 relative ${
                                              selectedSetting === setting.id 
                                                  ? 'border-[#FF2A6D] shadow-[0_0_20px_rgba(255,42,109,0.3)]' 
                                                  : 'border-transparent hover:border-white/20'
                                          }`}
                                      >
                                          <div className="aspect-[3/4] relative bg-black">
                                              <img src={setting.img} alt={setting.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                                              
                                              {/* 选中状态标识 */}
                                              {selectedSetting === setting.id && (
                                                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#FF2A6D] flex items-center justify-center shadow-md z-10">
                                                      <Icon name="Check" className="w-3 h-3 text-white" />
                                                  </div>
                                              )}
                                              
                                              {/* 图标 */}
                                              <div className="absolute top-3 right-3 flex gap-2 z-10">
                                                  {selectedSetting !== setting.id && (
                                                    <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Icon name="Maximize2" className="w-4 h-4 text-white" />
                                                    </div>
                                                  )}
                                              </div>

                                              {/* 模板信息 */}
                                              <div className="absolute bottom-0 left-0 w-full p-4 md:p-5">
                                                  <h3 className="text-white font-bold text-lg mb-1">{setting.title}</h3>
                                                  <p className="text-white/60 text-xs line-clamp-2">{setting.desc}</p>
                                              </div>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      </div>
                  </div>
              )}
              {/* 钩子弹窗 */}
              {isHookModalOpen && (
                  <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-8 animate-fade-in">
                      <div className="bg-[#1a0f14]/95 border border-white/10 rounded-3xl w-full max-w-5xl max-h-[85vh] flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-slide-up overflow-hidden relative">
                          
                          {/* 弹窗头部 */}
                          <div className="flex items-center justify-between p-6 md:p-8 border-b border-white/5 shrink-0">
                              <div>
                                  <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-wide">选择吸引眼球的钩子</h2>
                                  <p className="text-white/50 text-sm">前3秒决定了您的广告是被观看还是被跳过。选择一个经过验证的开头。</p>
                              </div>
                              <button 
                                  onClick={() => setIsHookModalOpen(false)}
                                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors focus:outline-none shrink-0"
                              >
                                  <Icon name="X" className="w-5 h-5" />
                              </button>
                          </div>

                          {/* 模板网格 */}
                          <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                  {filteredHooks.map(hook => (
                                      <div 
                                          key={hook.id}
                                          onClick={() => {
                                              setSelectedHook(hook.id);
                                              setIsHookModalOpen(false);
                                          }}
                                          className={`group cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-300 relative ${
                                              selectedHook === hook.id 
                                                  ? 'border-[#FF2A6D] shadow-[0_0_20px_rgba(255,42,109,0.3)]' 
                                                  : 'border-transparent hover:border-white/20'
                                          }`}
                                      >
                                          <div className="aspect-[4/5] relative bg-black">
                                            {hook.videoUrl ? (
                                                <video 
                                                    src={`${hook.videoUrl}#t=0.001`}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100" 
                                                    loop 
                                                    muted 
                                                    playsInline 
                                                    preload="metadata"
                                                    onMouseEnter={(e) => e.currentTarget.play()}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.pause();
                                                        e.currentTarget.currentTime = 0;
                                                    }}
                                                />
                                            ) : (
                                                <img src={hook.img} alt={hook.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none"></div>
                                              
                                              {/* 选中状态标识 */}
                                              {selectedHook === hook.id && (
                                                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#FF2A6D] flex items-center justify-center shadow-md z-10">
                                                      <Icon name="Check" className="w-3 h-3 text-white" />
                                                  </div>
                                              )}
                                              
                                              {/* 模板信息 */}
                                              <div className="absolute bottom-0 left-0 w-full p-5 md:p-6">
                                                  <h3 className="text-white font-bold text-xl mb-2">{hook.title}</h3>
                                                  <p className="text-white/70 text-sm leading-relaxed">{hook.desc}</p>
                                              </div>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      </div>
                  </div>
              )}
          </main>
      </div>
  );
}
