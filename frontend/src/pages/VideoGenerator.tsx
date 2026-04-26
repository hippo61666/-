import React, { useState } from 'react';
import { VideoConfigPanel } from '@/features/videoGen/VideoConfigPanel';
import { VideoPreviewPanel } from '@/features/videoGen/VideoPreviewPanel';
import { VideoGenerationParams, VideoRecord } from '@/types/video';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VideoGenerator: React.FC = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<VideoRecord | null>(null);

  const handleGenerate = async (params: VideoGenerationParams) => {
    setIsGenerating(true);
    
    // 1. Mock: 创建一条 pending 状态的记录
    const newVideoId = 'vid_' + Date.now();
    setCurrentVideo({
      id: newVideoId,
      title: params.title || '生成的视频广告',
      script: params.script,
      status: 'generating',
      progress: 0,
      brand_kit_id: params.brand_kit_id,
      created_at: new Date().toISOString(),
      brand_kits: { id: params.brand_kit_id, name: '当前选中的品牌套件' }
    });

    // 2. Mock: 模拟轮询进度
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      
      if (progress >= 100) {
        clearInterval(interval);
        setCurrentVideo(prev => prev ? {
          ...prev,
          status: 'completed',
          progress: 100,
          video_url: 'https://www.w3schools.com/html/mov_bbb.mp4' // 示例视频
        } : null);
        setIsGenerating(false);
      } else {
        setCurrentVideo(prev => prev ? { ...prev, progress } : null);
      }
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* 顶部导航 */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 flex-shrink-0 z-20">
        <button 
          onClick={() => navigate('/')}
          className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors mr-4"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-slate-800">生成新视频</h1>
      </header>

      {/* 主体左右分栏布局 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 左侧配置区 */}
        <div className="w-[500px] flex-shrink-0 z-10 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
          <VideoConfigPanel 
            onGenerate={handleGenerate} 
            isGenerating={isGenerating} 
          />
        </div>

        {/* 右侧预览区 */}
        <div className="flex-1 bg-slate-100 overflow-y-auto">
          <VideoPreviewPanel currentVideo={currentVideo} />
        </div>
      </div>
    </div>
  );
};

export default VideoGenerator;
