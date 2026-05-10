"use client";

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';

interface BrandKitEditorProps {
  onNavigate: (page: string) => void;
}

export default function BrandKitEditor({ onNavigate }: BrandKitEditorProps) {
  // 视图状态：'list' 表示展示品牌套件列表与概览，'edit' 表示编辑具体某个要素
  const [viewMode, setViewMode] = useState<'list' | 'edit'>('list');
  const [activeElement, setActiveElement] = useState('material');
  
  // 左侧次级侧边栏选中的套件
  const [activeKitId, setActiveKitId] = useState(1);
  const [mockKits, setMockKits] = useState([
      { id: 1, name: '极简科技风' },
      { id: 2, name: '未命名套件' }
  ]);

  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          setUploadedFile(e.dataTransfer.files[0].name);
      }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          setUploadedFile(e.target.files[0].name);
      }
  };

  const removeFile = () => {
      setUploadedFile(null);
  };

  // 核心视觉和音频要素定义 (重分类及增加预设选项)
  const visualGroup = [
      { id: 'makeup', label: '妆造', icon: 'Brush', color: 'text-slate-400 group-hover:text-primary-500', presets: ['自然裸妆', '精致全妆', '复古妆容', '时尚前卫', '清新淡妆', '专业职场'] },
      { id: 'costume', label: '服装', icon: 'Shirt', color: 'text-slate-400 group-hover:text-primary-500', presets: ['商务正装', '休闲时尚', '运动活力', '复古优雅', '极简主义', '街头潮流'] },
      { id: 'expression', label: '表情', icon: 'Smile', color: 'text-slate-400 group-hover:text-primary-500', presets: ['自信微笑', '专业严肃', '亲和友善', '活力热情', '沉稳内敛', '俏皮可爱'] },
      { id: 'gesture', label: '肢体', icon: 'PersonStanding', color: 'text-slate-400 group-hover:text-primary-500', presets: ['站姿挺拔', '坐姿优雅', '动态行走', '手势表达', '互动姿态', '静态展示'] },
  ];

  const sceneGroup = [
      { id: 'material', label: '材质', icon: 'Image', color: 'text-slate-400 group-hover:text-primary-500', presets: ['金属', '玻璃', '木纹', '布料', '皮革', '陶瓷', '塑料', '石材', '纸质', '丝绒'] },
      { id: 'color_grading', label: '调色', icon: 'Palette', color: 'text-slate-400 group-hover:text-primary-500', presets: ['暖色调', '冷色调', '高对比', '复古', '电影感', '清新', '暗黑', '赛博朋克'] },
      { id: 'composition', label: '构图', icon: 'Camera', color: 'text-slate-400 group-hover:text-primary-500', presets: ['中心构图', '三分法', '对称构图', '引导线', '框架构图', '留白构图'] },
  ];

  const audioGroup = [
      { id: 'dialogue_rhythm', label: '台词节奏', icon: 'Mic', color: 'text-slate-400 group-hover:text-primary-500', presets: ['慢速(0.8x)', '标准(1.0x)', '快速(1.2x)', '沉稳专业', '热情活力', '亲切温和', '权威可信'] },
      { id: 'editing_rhythm', label: '剪辑节奏', icon: 'Scissors', color: 'text-slate-400 group-hover:text-primary-500', presets: ['慢节奏(长镜头)', '中节奏(标准)', '快节奏(快速剪辑)', '硬切', '淡入淡出', '滑动', '缩放'] },
      { id: 'sound_effects', label: '音效', icon: 'Music', color: 'text-slate-400 group-hover:text-primary-500', presets: ['轻快活泼', '沉稳大气', '科技感', '温馨治愈', '动感节奏', '优雅古典'] },
      { id: 'voice_texture', label: '声音材质', icon: 'Volume2', color: 'text-slate-400 group-hover:text-primary-500', presets: ['磁性', '清脆', '沙哑', '浑厚', '甜美', '空灵'] },
  ];

  const allElements = [...visualGroup, ...sceneGroup, ...audioGroup];

  // 用于存储当前编辑表单中选中的预设状态
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  // 当切换卡片时，重置选中状态
  const handleCardClick = (id: string) => {
      setActiveElement(id);
      setSelectedPreset(null);
      setViewMode('edit');
  };

  // 渲染套件概览视图（对应参考图右侧网格）
  const renderKitOverview = () => (
      <div className="max-w-5xl mx-auto animate-fade-in flex flex-col items-center">
          <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-3">配置您的品牌套件</h2>
              <p className="text-slate-500">添加材质、调色、构图等要素以保持生成的视频风格一致。</p>
          </div>

          <div className="w-full space-y-12 mb-12">
              {/* 视觉要素区块 */}
              <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                      <Icon name="Eye" className="w-5 h-5 text-primary-500" />
                      视觉要素
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {visualGroup.map(item => (
                          <div 
                              key={item.id} 
                              onClick={() => handleCardClick(item.id)}
                              className="group cursor-pointer flex flex-col"
                          >
                              <div className="aspect-[4/3] bg-white rounded-3xl border border-slate-200 flex items-center justify-center transition-all duration-300 group-hover:shadow-soft group-hover:-translate-y-1 group-hover:border-primary-300 relative overflow-hidden">
                                  <div className={`w-16 h-16 flex items-center justify-center transition-transform duration-500 group-hover:scale-110 ${item.color}`}>
                                      <Icon name={item.icon} className="w-8 h-8" strokeWidth={1.5} />
                                  </div>
                                  {['expression'].includes(item.id) && (
                                      <div className="absolute top-4 right-3 w-6 h-6 btn-gradient rounded-full flex items-center justify-center shadow-sm">
                                          <Icon name="Check" className="w-3 h-3 text-white" />
                                      </div>
                                  )}
                              </div>
                              <h3 className="mt-3 text-center text-sm font-bold text-slate-700 group-hover:text-primary-600 transition-colors">{item.label}</h3>
                          </div>
                      ))}
                  </div>
              </div>

              {/* 画面要素区块 */}
              <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                      <Icon name="Monitor" className="w-5 h-5 text-primary-500" />
                      画面要素
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {sceneGroup.map(item => (
                          <div 
                              key={item.id} 
                              onClick={() => handleCardClick(item.id)}
                              className="group cursor-pointer flex flex-col"
                          >
                              <div className="aspect-[4/3] bg-white rounded-3xl border border-slate-200 flex items-center justify-center transition-all duration-300 group-hover:shadow-soft group-hover:-translate-y-1 group-hover:border-primary-300 relative overflow-hidden">
                                  <div className={`w-16 h-16 flex items-center justify-center transition-transform duration-500 group-hover:scale-110 ${item.color}`}>
                                      <Icon name={item.icon} className="w-8 h-8" strokeWidth={1.5} />
                                  </div>
                                  {['material', 'color_grading'].includes(item.id) && (
                                      <div className="absolute top-4 right-3 w-6 h-6 btn-gradient rounded-full flex items-center justify-center shadow-sm">
                                          <Icon name="Check" className="w-3 h-3 text-white" />
                                      </div>
                                  )}
                              </div>
                              <h3 className="mt-3 text-center text-sm font-bold text-slate-700 group-hover:text-primary-600 transition-colors">{item.label}</h3>
                          </div>
                      ))}
                  </div>
              </div>

              {/* 声音质感区块 */}
              <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                      <Icon name="Volume2" className="w-5 h-5 text-primary-500" />
                      声音质感
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {audioGroup.map(item => (
                          <div 
                              key={item.id} 
                              onClick={() => handleCardClick(item.id)}
                              className="group cursor-pointer flex flex-col"
                          >
                              <div className="aspect-[4/3] bg-white rounded-3xl border border-slate-200 flex items-center justify-center transition-all duration-300 group-hover:shadow-soft group-hover:-translate-y-1 group-hover:border-primary-300 relative overflow-hidden">
                                  <div className={`w-16 h-16 flex items-center justify-center transition-transform duration-500 group-hover:scale-110 ${item.color}`}>
                                      <Icon name={item.icon} className="w-8 h-8" strokeWidth={1.5} />
                                  </div>
                                  {['editing_rhythm'].includes(item.id) && (
                                      <div className="absolute top-4 right-3 w-6 h-6 btn-gradient rounded-full flex items-center justify-center shadow-sm">
                                          <Icon name="Check" className="w-3 h-3 text-white" />
                                      </div>
                                  )}
                              </div>
                              <h3 className="mt-3 text-center text-sm font-bold text-slate-700 group-hover:text-primary-600 transition-colors">{item.label}</h3>
                          </div>
                      ))}
                  </div>
              </div>
          </div>

          <div className="w-full max-w-3xl">
              <div 
                  className={`relative border-2 border-dashed rounded-3xl p-10 text-center transition-all duration-300 bg-white ${
                      isDragging ? 'border-primary-500 bg-primary-50/50 shadow-glow' : 'border-slate-200 hover:border-primary-300'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
              >
                  <input 
                      type="file" 
                      id="global-file-upload" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                      onChange={handleFileChange}
                      accept="image/*,.pdf,.doc,.docx"
                  />
                  
                  {!uploadedFile ? (
                      <div className="flex flex-col items-center pointer-events-none">
                          <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary-50 transition-colors">
                              <Icon name="UploadCloud" className="w-6 h-6 text-slate-400" />
                          </div>
                          <p className="text-base font-bold text-slate-700 mb-1">上传完整的品牌视觉手册以自动解析要素</p>
                          <p className="text-xs text-slate-400">支持 PNG, JPG, PDF · 最大 20MB</p>
                      </div>
                  ) : (
                      <div className="flex items-center justify-between bg-surface-50 border border-slate-200 p-4 rounded-2xl relative z-30 shadow-sm max-w-md mx-auto">
                          <div className="flex items-center space-x-3 overflow-hidden">
                              <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center shrink-0">
                                  <Icon name="File" className="w-5 h-5" />
                              </div>
                              <span className="text-sm font-bold text-slate-700 truncate">{uploadedFile}</span>
                          </div>
                          <button 
                              onClick={(e) => { e.preventDefault(); removeFile(); }}
                              className="p-2 hover:bg-red-100 text-slate-400 hover:text-red-500 rounded-xl transition-colors focus:outline-none"
                          >
                              <Icon name="X" className="w-5 h-5" />
                          </button>
                      </div>
                  )}
              </div>
          </div>
      </div>
  );

  // 渲染具体表单编辑视图
  const renderEditForm = () => {
      const activeItem = allElements.find(i => i.id === activeElement) || { id: activeElement, label: activeElement, presets: [] };
      const presets = activeItem.presets || [];

      return (
          <div className="max-w-4xl mx-auto bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 animate-slide-up">
              <header className="mb-10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                      <button 
                          onClick={() => setViewMode('list')}
                          className="p-2 hover:bg-slate-50 text-slate-400 hover:text-slate-700 rounded-xl transition-colors focus:outline-none"
                      >
                          <Icon name="ArrowLeft" className="w-5 h-5" />
                      </button>
                      <h2 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center gap-3">
                          {activeItem ? activeItem.label : activeElement}
                      </h2>
                  </div>
                  <button className="flex items-center space-x-2 btn-gradient px-5 py-2.5 rounded-xl text-sm font-bold focus:outline-none shadow-soft hover:shadow-md hover:-translate-y-0.5 text-white">
                      <Icon name="Save" className="w-4 h-4 hidden md:block text-white" />
                      <span>保存要素</span>
                  </button>
              </header>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                  {presets && presets.length > 0 ? presets.map((opt) => (
                      <button 
                          key={opt} 
                          onClick={() => setSelectedPreset(opt)}
                          className={`p-5 rounded-2xl border-2 text-left transition-all duration-200 focus:outline-none flex flex-col gap-3 ${
                              selectedPreset === opt ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm' : 'border-slate-100 hover:border-primary-200 hover:bg-slate-50 text-slate-600'
                          }`}
                      >
                          <Icon name={selectedPreset === opt ? "CheckCircle2" : "Circle"} className={`w-5 h-5 ${selectedPreset === opt ? 'text-primary-500' : 'text-slate-300'}`} />
                          <p className="font-semibold text-sm">{opt}</p>
                      </button>
                  )) : (
                      <div className="col-span-2 md:col-span-4 p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl">
                          <p className="text-slate-500">暂无预设选项，请直接在下方输入自定义描述。</p>
                      </div>
                  )}
              </div>

              <div className="mt-10 pt-8 border-t border-slate-100">
                  <label htmlFor="custom-desc" className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                      <Icon name="Edit3" className="w-4 h-4 text-primary-500" />
                      自定义描述 (可选)
                  </label>
                  <textarea 
                      id="custom-desc"
                      className="w-full h-32 p-5 bg-surface-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 text-slate-800 text-sm outline-none resize-none transition-all mb-8 placeholder:text-slate-400"
                      placeholder={`例如：希望${activeItem ? activeItem.label : ''}呈现...`}
                  ></textarea>
              </div>
          </div>
      );
  };

  return (
      <div className="flex h-screen bg-surface-50 relative">
          {/* 左侧次级导航 - 套件列表 */}
          <aside className="w-64 bg-white/80 backdrop-blur-xl border-r border-slate-100 flex flex-col shrink-0 z-10 shadow-sm">
              <div className="h-20 border-b border-slate-100 flex items-center px-6">
                  <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center">
                          <Icon name="Palette" className="w-6 h-6 text-gradient" />
                      </div>
                      <h2 className="text-xl font-bold text-slate-800 tracking-tight">企业品牌套件</h2>
                  </div>
              </div>
              
              <div className="p-4">
                  <button className="w-full py-3 bg-white border border-slate-200 hover:border-primary-300 hover:bg-primary-50 text-slate-700 hover:text-primary-700 font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm focus:outline-none group">
                      <Icon name="Plus" className="w-4 h-4 text-primary-500 group-hover:scale-110 transition-transform" />
                      新建套件
                  </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                  {mockKits.map(kit => (
                      <button 
                          key={kit.id}
                          onClick={() => {
                              setActiveKitId(kit.id);
                              setViewMode('list');
                          }}
                          className={`w-full text-left focus:outline-none transition-all group`}
                      >
                          <div className={`aspect-video rounded-2xl mb-2 flex items-center justify-center border transition-all duration-300 ${
                              activeKitId === kit.id ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-50 border-transparent group-hover:border-slate-200'
                          }`}>
                              <Icon name="Palette" className={`w-8 h-8 ${activeKitId === kit.id ? 'stroke-gradient' : 'text-slate-300 group-hover:text-slate-400'}`} />
                          </div>
                          <h4 className={`text-sm font-bold truncate px-1 ${activeKitId === kit.id ? 'text-primary-700' : 'text-slate-600'}`}>{kit.name}</h4>
                      </button>
                  ))}
              </div>
          </aside>

          {/* 右侧主内容区域 */}
          <main className="flex-1 overflow-y-auto p-8 md:p-12 lg:p-16 custom-scrollbar relative">
              {/* 装饰光晕 */}
              <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-primary-100/60 rounded-full blur-[100px] pointer-events-none"></div>
              
              {viewMode === 'list' ? renderKitOverview() : renderEditForm()}
          </main>
      </div>
  );
}
