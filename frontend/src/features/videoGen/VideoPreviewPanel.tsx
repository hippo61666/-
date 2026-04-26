import React from 'react';
import { VideoRecord } from '@/types/video';
import { Download, Film, Loader2, AlertCircle, PlayCircle } from 'lucide-react';

interface VideoPreviewPanelProps {
  currentVideo: VideoRecord | null;
}

export const VideoPreviewPanel: React.FC<VideoPreviewPanelProps> = ({ currentVideo }) => {

  // 空状态展示
  if (!currentVideo) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50">
        <div className="w-24 h-24 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">
          <Film className="w-10 h-10 text-slate-300" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">等待生成</h3>
        <p className="text-slate-500 mt-2 max-w-md text-center text-sm">
          在左侧配置您的品牌视觉规范并输入脚本内容，点击生成后，您的专属视频将在此处呈现。
        </p>
      </div>
    );
  }

  // 渲染不同状态的内容
  const renderContent = () => {
    switch (currentVideo.status) {
      case 'pending':
      case 'generating':
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="relative w-32 h-32 mb-8">
              <svg className="animate-spin w-full h-full text-primary-200" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                <path className="opacity-75 text-primary-600" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-xl font-bold text-primary-600">{currentVideo.progress || 0}%</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              AI 正在创作您的视频
            </h3>
            <p className="text-slate-500 text-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              这通常需要几分钟时间，请耐心等待...
            </p>
          </div>
        );

      case 'failed':
        return (
          <div className="flex flex-col items-center justify-center h-full text-error">
            <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">生成失败</h3>
            <p className="text-slate-500 text-sm max-w-md text-center">
              抱歉，视频生成过程中遇到了问题。这可能是由于服务器繁忙或脚本内容违规导致的，请稍后重试。
            </p>
          </div>
        );

      case 'completed':
        return (
          <div className="flex flex-col items-center justify-center w-full h-full p-8">
            <div className="w-full max-w-3xl aspect-video bg-black rounded-2xl overflow-hidden shadow-xl relative group">
              {currentVideo.video_url ? (
                <video 
                  src={currentVideo.video_url} 
                  controls 
                  className="w-full h-full object-contain"
                  autoPlay
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <PlayCircle className="w-16 h-16 text-white/30" />
                </div>
              )}
            </div>
            
            <div className="w-full max-w-3xl mt-8 flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">{currentVideo.title || '生成的视频广告'}</h3>
                <p className="text-slate-500 mt-1 text-sm">
                  使用品牌套件：<span className="font-semibold text-primary-600">{currentVideo.brand_kits?.name || '未知套件'}</span>
                </p>
              </div>
              <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-md">
                <Download className="w-5 h-5" />
                <span>下载视频 (MP4)</span>
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full bg-slate-50 flex items-center justify-center relative overflow-hidden">
      {/* 装饰背景 */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl" />
      
      {/* 内容区 */}
      <div className="relative z-10 w-full h-full">
        {renderContent()}
      </div>
    </div>
  );
};
