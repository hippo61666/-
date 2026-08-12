"use client";

import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import BrandKitSelector from '@/components/BrandKitSelector';
import { brandKits, type BrandKitName } from '@/components/brandData';

interface BrandKitEditorProps {
  activeBrandKit: BrandKitName;
  onBrandKitChange: (brandKit: BrandKitName) => void;
}

const kitSummaries = brandKits.map((name, index) => ({ id: index + 1, name }));

export default function BrandKitEditor({ activeBrandKit, onBrandKitChange }: BrandKitEditorProps) {
  // 左侧次级侧边栏选中的套件
  const [activeKitId, setActiveKitId] = useState(1);
  const mockKits = kitSummaries;

  useEffect(() => {
      const kit = mockKits.find(item => item.name === activeBrandKit);
      if (kit) {
          setActiveKitId(kit.id);
      }
  }, [activeBrandKit, mockKits]);

  // 用于存储每个套件每个要素上传的图片列表
  const [kitImages, setKitImages] = useState<Record<number, Record<string, string[]>>>({
      1: { // 浦发银行的数据
          'logo': ['https://companieslogo.com/img/orig/600000.SS_BIG-13c7d579.png'],
          'logo_layout': [
              '/spd-vi/2be255ca-a288-45d0-8399-95202d97023a.png',
              '/spd-vi/4705990b-a7df-4185-b1e0-25c7331ff47d.png',
              '/spd-vi/698d2566-e10d-42c6-bcae-9948e58543d1.png',
              '/spd-vi/7c47ca42-fbaa-4c6e-aa6d-ff656ad50101.png'
          ],
          'logo_specs': [
              '/spd-vi/4ebe4d07-93d0-4b56-b32c-81db16f4525b.png',
              '/spd-vi/6b33a7a3-22b5-43b7-ba54-49b004f5fa59.png',
              '/spd-vi/e115ba99-33e1-4ae6-9cfb-7223b66d8fb0.png'
          ],
          'vi_derivatives': [
              '/spd-vi/50887023-615c-4fae-a4c4-bb552f11359e.png',
              '/spd-vi/91f50905-72f7-4389-833c-48212c24bbea.png',
              '/spd-vi/96f648d1-234e-40f1-89ab-21f62a546904.png'
          ]
      },
      2: { // 山下有松的数据
          'logo': [
              '/spd-vi/a7cd3c66-e1fe-4ba9-a38c-efb8ca70d41c.png',
              '/spd-vi/cda59055-9003-4bc9-8ea4-323ff76587e6.png',
              '/spd-vi/8468eba9-9863-4947-9752-a2507fa865f3.png'
          ],
          'vi_derivatives': [
              '/spd-vi/fdea1ada-e9a5-45ce-a38d-30b539143829.png',
              '/spd-vi/bb1fc36a-0a6c-463d-aa8d-9a6137f19850.png',
              '/spd-vi/1a7b49c8-e2c4-4ffe-b401-4ffb24cda388.png'
          ]
      }
  });

  // 获取当前选中的套件图片数据
  const uploadedImages = kitImages[activeKitId] || {};

  // 新增：图片预览状态
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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
        { id: 'logo', label: '标识', icon: 'Hexagon', color: 'text-white/40 group-hover:text-[var(--brand-primary)]' },
        { id: 'logo_layout', label: '标识排版', icon: 'Layout', color: 'text-white/40 group-hover:text-[var(--brand-primary)]' },
        { id: 'logo_specs', label: '标识应用规范', icon: 'FileText', color: 'text-white/40 group-hover:text-[var(--brand-primary)]' },
        { id: 'color', label: '色彩', icon: 'Palette', color: 'text-white/40 group-hover:text-[var(--brand-primary)]', isColorPalette: true },
        { id: 'color_specs', label: '色彩应用规范', icon: 'BookOpen', color: 'text-white/40 group-hover:text-[var(--brand-primary)]' },
        { id: 'typography', label: '字体', icon: 'Type', color: 'text-white/40 group-hover:text-[var(--brand-primary)]', isTypographyPalette: true },
        { id: 'cobranding', label: '联合应用', icon: 'Link', color: 'text-white/40 group-hover:text-[var(--brand-primary)]' },
        { id: 'vi_derivatives', label: 'VI衍生物', icon: 'Layers', color: 'text-white/40 group-hover:text-[var(--brand-primary)]' },
    ];

  const materialGroup = [
      { id: 'size_specs', label: '尺寸规范', icon: 'Maximize', color: 'text-white/40 group-hover:text-[var(--brand-primary)]' },
      { id: 'style_specs', label: '风格规范', icon: 'Brush', color: 'text-white/40 group-hover:text-[var(--brand-primary)]' },
  ];

  const allElements = [...visualGroup, ...materialGroup];

  const handleElementImageUpload = (elementId: string, files: FileList | null) => {
      if (!files || files.length === 0) return;
      
      // 模拟上传多张图片
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      
      setKitImages(prev => ({
          ...prev,
          [activeKitId]: {
              ...(prev[activeKitId] || {}),
              [elementId]: [...((prev[activeKitId] || {})[elementId] || []), ...newImages]
          }
      }));
  };

  const removeElementImage = (elementId: string, indexToRemove: number) => {
      setKitImages(prev => {
          const kitData = prev[activeKitId] || {};
          return {
              ...prev,
              [activeKitId]: {
                  ...kitData,
                  [elementId]: (kitData[elementId] || []).filter((_, index) => index !== indexToRemove)
              }
          };
      });
  };

  // 新增：山下有松预设颜色数据
  const shanxiaColors = {
      standard: [
          { name: 'Beige', hex: '#E2E2D7', label: 'Brand Primary Beige' },
          { name: 'Moss', hex: '#778456', label: 'Brand Moss Green' },
          { name: 'Earth', hex: '#A8612A', label: 'Brand Earth Brown' }
      ]
  };
  const presetColors = {
      standard: [
          { name: 'PANTONE 294', hex: '#003366', rgb: 'R7 G38 B88', cmyk: 'C100 M70 Y5 K40' },
          { name: 'PANTONE 187', hex: '#A40011', rgb: 'R164 G0 B17', cmyk: 'M100 Y80 K35' }
      ],
      auxiliarySub: [
          { name: 'PANTONE 2995', hex: '#00A0C6', rgb: 'R0 G160 B198', cmyk: 'C100' },
          { name: 'PANTONE 144', hex: '#FF7F00', rgb: 'R255 G127 B0', cmyk: 'M50 Y100' },
          { name: 'PANTONE 1795', hex: '#E60000', rgb: 'R230 G0 B0', cmyk: 'M100 Y100 K10' }
      ],
      auxiliaryCorp: [
          { name: 'PANTONE 424', hex: '#404040', rgb: 'R64 G64 B64', cmyk: 'K75' },
          { name: 'PANTONE 421', hex: '#B3B3B3', rgb: 'R179 G179 B179', cmyk: 'K30' }
      ],
      special: [
          { name: 'PANTONE 874', hex: '#A68A56', type: '特殊应用色' },
          { name: 'PANTONE 877', hex: '#8C8C8C', type: '特殊应用色' }
      ]
  };

  // 渲染套件概览视图（对应参考图右侧网格）
  const renderKitOverview = () => {
      const activeKit = mockKits.find(k => k.id === activeKitId) || mockKits[0];
      
      const renderElementSection = (title: string, icon: string, group: typeof visualGroup) => (
          <div className="mb-12">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Icon name={icon as any} className="w-5 h-5 text-[var(--brand-primary)]" />
                  {title}
              </h3>
              <div className="space-y-6">
                  {group.map(item => (
                      <div key={item.id} className="bg-[#1a0f14]/80 backdrop-blur-md rounded-3xl border border-white/10 p-6 flex flex-col gap-4 items-start">
                          {/* 顶部：要素名称和图标（居左对齐） */}
                          <div className="w-full flex items-center gap-[6px] shrink-0">
                              <div className={`flex items-center justify-center ${item.color}`}>
                                  <Icon name={item.icon as any} className="w-5 h-5" />
                              </div>
                              <h4 className="font-bold text-white text-base">{item.label}</h4>
                          </div>

                          {/* 底部：图片上传与展示区域（居左排列） */}
                          <div className="w-full">
                              {(item as any).isColorPalette ? (
                                  activeKitId === 1 ? (
                                      <div className="w-full flex flex-col gap-6 p-4 bg-white/5 rounded-2xl border border-white/10">
                                          {/* 标准色彩 */}
                                          <div>
                                          <h5 className="text-xs text-white/50 mb-3 uppercase tracking-wider">标准色彩</h5>
                                          <div className="flex flex-wrap gap-4">
                                              {presetColors.standard.map((color, idx) => (
                                                  <div key={idx} className="w-36 h-32 p-4 flex flex-col justify-between rounded-xl shadow-glass border border-white/10 transition-transform hover:scale-105" style={{ backgroundColor: color.hex }}>
                                                      <div>
                                                          <div className="text-white font-bold text-xs opacity-90">{color.name.split(' ')[0]}</div>
                                                          <div className="text-white font-bold text-lg">{color.name.split(' ')[1]}</div>
                                                      </div>
                                                      <div className="text-white/80 text-[10px] space-y-0.5">
                                                          <div>{color.cmyk}</div>
                                                          <div>{color.rgb}</div>
                                                      </div>
                                                  </div>
                                              ))}
                                          </div>
                                      </div>

                                      {/* 辅助色彩 (子品牌) */}
                                      <div>
                                          <h5 className="text-xs text-white/50 mb-3 uppercase tracking-wider">辅助色彩（子品牌使用色彩）</h5>
                                          <div className="flex flex-wrap gap-4">
                                              {presetColors.auxiliarySub.map((color, idx) => (
                                                  <div key={idx} className="w-36 h-32 p-4 flex flex-col justify-between rounded-xl shadow-glass border border-white/10 transition-transform hover:scale-105" style={{ backgroundColor: color.hex }}>
                                                      <div>
                                                          <div className="text-white font-bold text-xs opacity-90">{color.name.split(' ')[0]}</div>
                                                          <div className="text-white font-bold text-lg">{color.name.split(' ')[1]}</div>
                                                      </div>
                                                      <div className="text-white/80 text-[10px] space-y-0.5">
                                                          <div>{color.cmyk}</div>
                                                          <div>{color.rgb}</div>
                                                      </div>
                                                  </div>
                                              ))}
                                          </div>
                                      </div>

                                      {/* 辅助色彩 (企业用色) */}
                                      <div>
                                          <h5 className="text-xs text-white/50 mb-3 uppercase tracking-wider">辅助色彩（企业用色）</h5>
                                          <div className="flex flex-wrap gap-4">
                                              {presetColors.auxiliaryCorp.map((color, idx) => (
                                                  <div key={idx} className="w-36 h-32 p-4 flex flex-col justify-between rounded-xl shadow-glass border border-white/10 transition-transform hover:scale-105" style={{ backgroundColor: color.hex }}>
                                                      <div>
                                                          <div className="text-white font-bold text-xs opacity-90">{color.name.split(' ')[0]}</div>
                                                          <div className="text-white font-bold text-lg">{color.name.split(' ')[1]}</div>
                                                      </div>
                                                      <div className="text-white/80 text-[10px] space-y-0.5">
                                                          <div>{color.cmyk}</div>
                                                          <div>{color.rgb}</div>
                                                      </div>
                                                  </div>
                                              ))}
                                          </div>
                                      </div>

                                      {/* 特殊应用色 */}
                                        <div>
                                            <h5 className="text-xs text-white/50 mb-3 uppercase tracking-wider">特殊应用色</h5>
                                            <div className="flex flex-wrap gap-4">
                                                {presetColors.special.map((color, idx) => (
                                                    <div key={idx} className="w-36 h-32 p-4 flex flex-col justify-between rounded-xl shadow-glass border border-white/10 transition-transform hover:scale-105" style={{ backgroundColor: color.hex }}>
                                                        <div>
                                                            <div className="text-white font-bold text-xs opacity-90">{color.name.split(' ')[0]}</div>
                                                            <div className="text-white font-bold text-lg">{color.name.split(' ')[1]}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                      </div>
                                    ) : activeKitId === 2 ? (
                                        <div className="w-full flex flex-col gap-6 p-4 bg-white/5 rounded-2xl border border-white/10">
                                            <div>
                                                <h5 className="text-xs text-white/50 mb-3 uppercase tracking-wider">品牌主色</h5>
                                                <div className="flex flex-wrap gap-4">
                                                    {shanxiaColors.standard.map((color, idx) => (
                                                        <div key={idx} className="flex flex-col gap-3">
                                                            <div className="w-36 h-32 rounded-xl shadow-glass border border-white/10 transition-transform hover:scale-105" style={{ backgroundColor: color.hex }}></div>
                                                            <span className="text-xs text-white/60 font-medium text-center">{color.label}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-full flex flex-wrap gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 border-dashed">
                                            <div className="w-full text-center py-12">
                                                <Icon name="Palette" className="w-8 h-8 text-white/20 mx-auto mb-3" />
                                                <p className="text-white/40 text-sm">暂无色彩数据</p>
                                            </div>
                                        </div>
                                    )
                                ) : (item as any).isTypographyPalette && activeKitId === 1 ? (
                                    <div className="w-full flex flex-col gap-6 p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <div className="flex flex-wrap gap-4">
                                        {/* 黑体家族 */}
                                        <div className="flex-1 min-w-[280px] p-6 flex flex-col gap-4 rounded-xl shadow-glass border border-white/10 bg-[#1a0f14]/50 hover:bg-[#1a0f14]/80 transition-colors">
                                            <div className="flex justify-between items-center">
                                                <h5 className="text-white/50 text-sm uppercase tracking-wider">中文标准字体</h5>
                                                <span className="text-[10px] text-white/40 bg-white/5 px-2 py-1 rounded border border-white/10">PRIMARY</span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <div className="text-white font-bold text-3xl font-sans tracking-wide">黑体家族</div>
                                                <div className="text-white/40 text-sm tracking-wider uppercase">Heiti Family</div>
                                            </div>
                                            <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-white/10">
                                                <div className="flex justify-between items-end text-white/80 group">
                                                    <span className="font-light text-2xl group-hover:text-[var(--brand-primary)] transition-colors">Light</span>
                                                    <span className="text-xs text-white/40 mb-1">标题 / 正文</span>
                                                </div>
                                                <div className="flex justify-between items-end text-white/80 group">
                                                    <span className="font-normal text-2xl group-hover:text-[var(--brand-primary)] transition-colors">Regular</span>
                                                    <span className="text-xs text-white/40 mb-1">正文</span>
                                                </div>
                                                <div className="flex justify-between items-end text-white/80 group">
                                                    <span className="font-medium text-2xl group-hover:text-[var(--brand-primary)] transition-colors">Medium</span>
                                                    <span className="text-xs text-white/40 mb-1">小标题</span>
                                                </div>
                                                <div className="flex justify-between items-end text-white/80 group">
                                                    <span className="font-bold text-2xl group-hover:text-[var(--brand-primary)] transition-colors">Bold</span>
                                                    <span className="text-xs text-white/40 mb-1">主标题</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Helvetica Neue */}
                                        <div className="flex-1 min-w-[280px] p-6 flex flex-col gap-4 rounded-xl shadow-glass border border-white/10 bg-[#1a0f14]/50 hover:bg-[#1a0f14]/80 transition-colors">
                                            <div className="flex justify-between items-center">
                                                <h5 className="text-white/50 text-sm uppercase tracking-wider">英文/数字标准字体</h5>
                                                <span className="text-[10px] text-white/40 bg-white/5 px-2 py-1 rounded border border-white/10">SECONDARY</span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <div className="text-white font-bold text-3xl tracking-wide" style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>Helvetica Neue</div>
                                                <div className="text-white/40 text-sm tracking-wider uppercase">English & Numbers</div>
                                            </div>
                                            <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-white/10">
                                                <div className="flex justify-between items-end text-white/80 group">
                                                    <span className="font-light text-2xl group-hover:text-[var(--brand-primary)] transition-colors" style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>Light</span>
                                                    <span className="text-xs text-white/40 mb-1">标题 / 正文</span>
                                                </div>
                                                <div className="flex justify-between items-end text-white/80 group">
                                                    <span className="font-normal text-2xl group-hover:text-[var(--brand-primary)] transition-colors" style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>Regular</span>
                                                    <span className="text-xs text-white/40 mb-1">正文</span>
                                                </div>
                                                <div className="flex justify-between items-end text-white/80 group">
                                                    <span className="font-medium text-2xl group-hover:text-[var(--brand-primary)] transition-colors" style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>Medium</span>
                                                    <span className="text-xs text-white/40 mb-1">小标题</span>
                                                </div>
                                                <div className="flex justify-between items-end text-white/80 group">
                                                    <span className="font-bold text-2xl group-hover:text-[var(--brand-primary)] transition-colors" style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>Bold</span>
                                                    <span className="text-xs text-white/40 mb-1">主标题</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                ) : (
                                  <div className="flex flex-wrap gap-4 items-start justify-start">
                                      {/* 已上传图片列表 */}
                                        {uploadedImages[item.id]?.map((imgUrl, index) => (
                                            <div 
                                                key={index} 
                                                className={`relative w-24 h-24 rounded-xl border border-white/10 overflow-hidden group cursor-pointer hover:ring-2 hover:ring-[rgb(var(--brand-rgb)/0.5)] transition-all ${activeKitId === 1 && item.id === 'logo' ? 'bg-white p-2' : 'bg-transparent'}`}
                                                onClick={() => setPreviewImage(imgUrl)}
                                            >
                                                <img 
                                                    src={imgUrl} 
                                                    alt={`${item.label} ${index + 1}`} 
                                                    className={`w-full h-full ${activeKitId === 1 && item.id === 'logo' ? 'object-contain' : 'object-cover'}`}
                                                />
                                          </div>
                                      ))}
                                      {(!uploadedImages[item.id] || uploadedImages[item.id].length === 0) && (
                                          <div className="w-full py-8 text-center text-sm text-white/35 border border-dashed border-white/10 rounded-2xl">
                                              暂无展示素材
                                          </div>
                                      )}
                                  </div>
                              )}
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      );

      return (
      <div className="w-full max-w-[800px] mx-auto animate-fade-in flex flex-col items-center relative z-20">
          <div className="text-center mb-12 flex justify-between items-center w-full">
              <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-bold text-white flex items-center">
                      查看
                      <span className="ml-2 text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)]">
                          {activeKit?.name || '品牌套件'}
                      </span>
                  </h2>
              </div>
          </div>
          
          <div className="w-full text-left mb-8">
             <p className="text-white/60">当前页面仅展示已关联品牌套件数据，生成内容会基于这些统一品牌资产进行创意输出。</p>
          </div>

          <div className="w-full">
              {renderElementSection("视觉要素", "Eye", visualGroup)}
              {renderElementSection("物料规范", "Monitor", materialGroup)}
          </div>
      </div>
      );
  }

  return (
      <div className="flex flex-col h-screen bg-transparent relative w-full overflow-hidden">
          <header className="h-20 bg-[#0d060a]/80 backdrop-blur-2xl border-b border-white/10 flex items-center justify-between px-6 md:px-10 shrink-0 z-[300] shadow-glass relative">
              <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center">
                      <Icon name="Palette" className="w-6 h-6 text-gradient" />
                  </div>
                  <h1 className="text-xl font-bold text-white tracking-tight">企业品牌套件</h1>
              </div>

              <BrandKitSelector activeBrandKit={activeBrandKit} onBrandKitChange={onBrandKitChange} />
          </header>

          <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 custom-scrollbar relative">
              {/* 装饰光晕 */}
              <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[rgb(var(--brand-rgb)/0.1)] rounded-full blur-[120px] pointer-events-none z-0"></div>
              
              {renderKitOverview()}
          </main>

          {/* 图片预览弹窗 */}
          {previewImage && (
              <div 
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
                  onClick={() => setPreviewImage(null)}
              >
                  <div className="relative max-w-5xl max-h-[90vh] p-4 flex items-center justify-center">
                      <img 
                          src={previewImage} 
                          alt="Preview" 
                          className="max-w-full max-h-full object-contain rounded-xl bg-white p-8" 
                      />
                      <button 
                          onClick={(e) => {
                              e.stopPropagation();
                              setPreviewImage(null);
                          }}
                          className="absolute top-0 right-0 w-10 h-10 bg-white/10 hover:bg-red-500/80 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all transform translate-x-1/2 -translate-y-1/2"
                      >
                          <Icon name="X" className="w-5 h-5" />
                      </button>
                  </div>
              </div>
          )}
      </div>
  );
}
