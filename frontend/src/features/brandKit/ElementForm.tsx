import React from 'react';
import { ElementKey, VisualElements } from '@/types/brandKit';
import { UploadCloud, CheckCircle2 } from 'lucide-react';

interface ElementFormProps {
  elementKey: ElementKey;
  data: Partial<VisualElements>;
  onChange: (key: ElementKey, value: any) => void;
}

export const ElementForm: React.FC<ElementFormProps> = ({ elementKey, data, onChange }) => {
  const currentData = data[elementKey] || {};

  const handleUpdate = (field: string, value: any) => {
    onChange(elementKey, { ...currentData, [field]: value });
  };

  // 通用选项卡片组件
  const OptionCard = ({ label, value, current }: { label: string, value: string, current?: string }) => {
    const isSelected = current === value;
    return (
      <div 
        onClick={() => handleUpdate('preset', value)}
        className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
          isSelected ? 'border-primary-500 bg-primary-50/50' : 'border-slate-200 hover:border-primary-300'
        }`}
      >
        {isSelected && (
          <CheckCircle2 className="absolute top-2 right-2 w-5 h-5 text-primary-500" />
        )}
        <p className={`font-medium mt-1 ${isSelected ? 'text-primary-700' : 'text-slate-700'}`}>
          {label}
        </p>
      </div>
    );
  };

  // 通用自定义输入区
  const CustomInput = () => (
    <div className="mt-8 pt-6 border-t border-slate-200">
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        自定义描述 (可选)
      </label>
      <textarea
        value={currentData.custom_text || ''}
        onChange={(e) => handleUpdate('custom_text', e.target.value)}
        placeholder={`在此输入您的自定义${elementKey}描述...`}
        className="w-full h-24 p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none text-sm"
      />
    </div>
  );

  // 渲染具体要素的表单
  const renderFormContent = () => {
    switch (elementKey) {
      case 'material':
        return (
          <>
            <h3 className="text-lg font-bold mb-4">选择预设材质</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['金属', '玻璃', '木纹', '布料', '皮革', '陶瓷', '纸质', '丝绒'].map(m => (
                <OptionCard key={m} label={m} value={m} current={currentData.preset} />
              ))}
            </div>
            {/* TODO: 添加上传组件 */}
          </>
        );

      case 'color_grading':
        return (
          <>
            <h3 className="text-lg font-bold mb-4">选择调色风格</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['暖色调', '冷色调', '高对比', '复古', '电影感', '清新', '暗黑', '赛博朋克'].map(c => (
                <OptionCard key={c} label={c} value={c} current={currentData.preset} />
              ))}
            </div>
            {/* TODO: 添加颜色选择器 */}
          </>
        );

      case 'dialogue_rhythm':
        return (
          <>
            <h3 className="text-lg font-bold mb-4">台词节奏与声音</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">语速调节</label>
                <div className="flex gap-4">
                  {['0.8x', '1.0x', '1.2x'].map(s => (
                    <button
                      key={s}
                      onClick={() => handleUpdate('speed', s)}
                      className={`px-6 py-2 rounded-lg font-medium border-2 transition-all ${
                        currentData.speed === s ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">语调风格</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['沉稳专业', '热情活力', '亲切温和', '权威可信'].map(t => (
                    <div 
                      key={t} 
                      onClick={() => handleUpdate('tone', t)}
                      className={`p-3 text-center rounded-lg border-2 cursor-pointer ${currentData.tone === t ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 text-slate-600'}`}
                    >
                      {t}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">声音材质</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['磁性低沉', '清脆明亮', '沙哑质感', '温柔甜美'].map(vt => (
                    <div 
                      key={vt} 
                      onClick={() => handleUpdate('voice_texture', vt)}
                      className={`p-3 text-center rounded-lg border-2 cursor-pointer ${currentData.voice_texture === vt ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 text-slate-600'}`}
                    >
                      {vt}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        );
        
      case 'editing_rhythm':
        return (
          <>
            <h3 className="text-lg font-bold mb-4">剪辑节奏与镜头时长</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">镜头时长</label>
                <div className="flex gap-4">
                  {['15s', '30s', '45s', '60s'].map(d => (
                    <button
                      key={d}
                      onClick={() => handleUpdate('shot_duration', d)}
                      className={`px-6 py-2 rounded-lg font-medium border-2 transition-all ${
                        currentData.shot_duration === d ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">剪辑节奏</label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { val: 'slow', label: '慢节奏 (长镜头)' },
                    { val: 'medium', label: '中节奏 (标准)' },
                    { val: 'fast', label: '快节奏 (快速剪辑)' }
                  ].map(p => (
                    <div 
                      key={p.val} 
                      onClick={() => handleUpdate('pace', p.val)}
                      className={`p-4 text-center rounded-lg border-2 cursor-pointer ${currentData.pace === p.val ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 text-slate-600'}`}
                    >
                      {p.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        );

      default:
        // 兜底的通用预设列表渲染
        return (
          <>
            <h3 className="text-lg font-bold mb-4">选择预设风格</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['风格 A', '风格 B', '风格 C', '风格 D'].map(m => (
                <OptionCard key={m} label={m} value={m} current={currentData.preset} />
              ))}
            </div>
          </>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-10">
      {/* 标题栏 */}
      <div className="mb-8 border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-slate-900 capitalize">
          {elementKey.replace('_', ' ')}
        </h2>
        <p className="text-slate-500 mt-2 text-sm">
          设置该要素的参数，或者通过下方自定义输入您的特殊需求。
        </p>
      </div>

      {/* 动态表单内容 */}
      <div className="mb-8">
        {renderFormContent()}
      </div>

      {/* 自定义输入 */}
      <CustomInput />
    </div>
  );
};
