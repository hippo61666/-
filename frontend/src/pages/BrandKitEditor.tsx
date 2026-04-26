import React, { useState } from 'react';
import { ElementNav } from '@/features/brandKit/ElementNav';
import { ElementForm } from '@/features/brandKit/ElementForm';
import { ElementKey, VisualElements } from '@/types/brandKit';
import { Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BrandKitEditor: React.FC = () => {
  const navigate = useNavigate();
  const [activeElement, setActiveElement] = useState<ElementKey>('material');
  const [elementsData, setElementsData] = useState<Partial<VisualElements>>({});
  const [kitName, setKitName] = useState('未命名品牌套件');

  const handleElementChange = (key: ElementKey, value: any) => {
    setElementsData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    // TODO: 调用后端 API 保存
    console.log('Saving Brand Kit:', { name: kitName, visual_elements: elementsData });
    alert('保存成功！(Console 已打印数据)');
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* 顶部标题栏 */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/')}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={kitName}
            onChange={(e) => setKitName(e.target.value)}
            className="text-xl font-bold text-slate-800 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-2 py-1"
            placeholder="输入品牌套件名称"
          />
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-lg font-medium transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>保存套件</span>
          </button>
        </div>
      </header>

      {/* 主体编辑区 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 左侧 10 要素导航 */}
        <ElementNav activeElement={activeElement} onSelect={setActiveElement} />

        {/* 右侧动态表单内容 */}
        <div className="flex-1 overflow-y-auto bg-white m-6 rounded-2xl shadow-sm border border-slate-200">
          <ElementForm 
            elementKey={activeElement} 
            data={elementsData} 
            onChange={handleElementChange} 
          />
        </div>
      </div>
    </div>
  );
};

export default BrandKitEditor;
