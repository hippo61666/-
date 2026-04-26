import React from 'react';
import { 
  Palette, 
  Image as ImageIcon, 
  Smile, 
  Shirt, 
  Camera, 
  Sparkles, 
  Accessibility, 
  Mic, 
  Scissors, 
  Music 
} from 'lucide-react';
import { ElementKey } from '@/types/brandKit';

interface ElementNavProps {
  activeElement: ElementKey;
  onSelect: (element: ElementKey) => void;
}

export const VISUAL_GROUP: { id: ElementKey; label: string; icon: React.FC<any> }[] = [
  { id: 'material', label: '材质 (Material)', icon: ImageIcon },
  { id: 'color_grading', label: '调色 (Color)', icon: Palette },
  { id: 'expression', label: '表情 (Expression)', icon: Smile },
  { id: 'costume', label: '服装 (Costume)', icon: Shirt },
  { id: 'composition', label: '构图 (Composition)', icon: Camera },
  { id: 'makeup', label: '妆造 (Makeup)', icon: Sparkles },
  { id: 'gesture', label: '肢体 (Gesture)', icon: Accessibility },
];

export const AUDIO_GROUP: { id: ElementKey; label: string; icon: React.FC<any> }[] = [
  { id: 'dialogue_rhythm', label: '台词节奏 (Dialogue)', icon: Mic },
  { id: 'editing_rhythm', label: '剪辑节奏 (Editing)', icon: Scissors },
  { id: 'sound_effects', label: '音效 (Sound)', icon: Music },
];

export const ElementNav: React.FC<ElementNavProps> = ({ activeElement, onSelect }) => {
  const NavItem = ({ id, label, icon: Icon }: any) => {
    const isActive = activeElement === id;
    return (
      <button
        onClick={() => onSelect(id)}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
          isActive
            ? 'bg-primary-50 text-primary-600 font-semibold shadow-sm'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`}
      >
        <Icon className={`w-5 h-5 ${isActive ? 'text-primary-500' : 'text-slate-400'}`} />
        <span className="text-sm">{label}</span>
      </button>
    );
  };

  return (
    <div className="w-64 h-full border-r border-slate-200 bg-white flex flex-col">
      <div className="p-6">
        <h2 className="text-xl font-bold text-slate-800">视觉要素</h2>
        <p className="text-xs text-slate-500 mt-1">10个维度定义品牌规范</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-8">
        {/* 视觉组 */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">
            视觉组 (Visual)
          </h3>
          <div className="space-y-1">
            {VISUAL_GROUP.map((item) => (
              <NavItem key={item.id} {...item} />
            ))}
          </div>
        </div>

        {/* 音频时序组 */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">
            音频与时序 (Audio & Timing)
          </h3>
          <div className="space-y-1">
            {AUDIO_GROUP.map((item) => (
              <NavItem key={item.id} {...item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
