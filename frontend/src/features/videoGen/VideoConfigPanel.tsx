import React, { useState, useEffect } from 'react';
import { VideoGenerationParams, BrandKitSummary } from '@/types/video';
import { Wand2, Sparkles, Monitor, Maximize } from 'lucide-react';

interface VideoConfigPanelProps {
  onGenerate: (params: VideoGenerationParams) => void;
  isGenerating: boolean;
}

export const VideoConfigPanel: React.FC<VideoConfigPanelProps> = ({ onGenerate, isGenerating }) => {
  // TODO: 从全局状态或 API 获取品牌套件列表
  const [brandKits, setBrandKits] = useState<BrandKitSummary[]>([
    { id: '1', name: '极简科技风', description: '适用于 3C 数码产品' },
    { id: '2', name: '活力运动风', description: '适用于运动服饰、饮料' },
  ]);

  const [formData, setFormData] = useState<VideoGenerationParams>({
    brand_kit_id: '',
    script: '',
    title: '',
    resolution: '1080p',
    aspect_ratio: '16:9',
  });

  // 初始化时默认选中第一个
  useEffect(() => {
    if (brandKits.length > 0 && !formData.brand_kit_id) {
      setFormData(prev => ({ ...prev, brand_kit_id: brandKits[0].id }));
    }
  }, [brandKits]);

  const handleInputChange = (field: keyof VideoGenerationParams, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.brand_kit_id || !formData.script.trim()) {
      alert('请选择品牌套件并输入脚本内容');
      return;
    }
    onGenerate(formData);
  };

  return (
    <div className="w-full max-w-xl h-full flex flex-col bg-white border-r border-slate-200 shadow-sm overflow-y-auto">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Wand2 className="w-6 h-6 text-primary-500" />
          生成视频广告
        </h2>
        <p className="text-slate-500 mt-2 text-sm">
          选择您的品牌视觉规范，输入脚本，AI 将为您生成风格一致的高质量视频。
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 p-6 space-y-8">
        
        {/* 1. 品牌套件选择 */}
        <div className="space-y-3">
          <label className="flex items-center text-sm font-semibold text-slate-800">
            <Sparkles className="w-4 h-4 mr-2 text-primary-500" />
            1. 选择品牌套件
          </label>
          <div className="grid grid-cols-1 gap-3">
            {brandKits.map((kit) => (
              <div 
                key={kit.id}
                onClick={() => handleInputChange('brand_kit_id', kit.id)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  formData.brand_kit_id === kit.id 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-slate-200 hover:border-primary-300'
                }`}
              >
                <h4 className={`font-semibold ${formData.brand_kit_id === kit.id ? 'text-primary-700' : 'text-slate-800'}`}>
                  {kit.name}
                </h4>
                <p className="text-xs text-slate-500 mt-1">{kit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. 视频脚本输入 */}
        <div className="space-y-3">
          <label className="flex items-center text-sm font-semibold text-slate-800">
            2. 视频脚本与描述
          </label>
          <input
            type="text"
            placeholder="视频标题 (选填)"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
          />
          <textarea
            required
            value={formData.script}
            onChange={(e) => handleInputChange('script', e.target.value)}
            placeholder="请输入视频广告的详细文案、画面描述和情节..."
            className="w-full h-40 p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none text-sm leading-relaxed"
          />
        </div>

        {/* 3. 高级参数 */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <label className="flex items-center text-sm font-semibold text-slate-800">
            3. 画面参数
          </label>
          
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 space-y-2">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Maximize className="w-3 h-3" /> 分辨率
              </span>
              <select 
                value={formData.resolution}
                onChange={(e) => handleInputChange('resolution', e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-sm outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="720p">720p (标清)</option>
                <option value="1080p">1080p (高清)</option>
                <option value="4K">4K (超清)</option>
              </select>
            </div>
            
            <div className="flex-1 space-y-2">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Monitor className="w-3 h-3" /> 画面比例
              </span>
              <select 
                value={formData.aspect_ratio}
                onChange={(e) => handleInputChange('aspect_ratio', e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-sm outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="16:9">16:9 (横屏)</option>
                <option value="9:16">9:16 (竖屏)</option>
                <option value="1:1">1:1 (方形)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isGenerating}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-md transition-all flex justify-center items-center gap-2 ${
              isGenerating 
                ? 'bg-slate-400 cursor-not-allowed' 
                : 'bg-primary-600 hover:bg-primary-700 hover:shadow-lg hover:-translate-y-0.5'
            }`}
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>正在连接 Seedance 2...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>立即生成视频</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
