"use client";

import { useState } from 'react';
import Login from '@/components/Login';
import GlobalSidebar from '@/components/GlobalSidebar';
import VideoGenerator from '@/components/VideoGenerator';
import HistoryPage from '@/components/HistoryPage';
import BrandKitEditor from '@/components/BrandKitEditor';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState('videoGen');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  const handleNavigate = (page: string, projectId: string | null = null) => {
    setActivePage(page);
    if (projectId !== undefined) {
      setSelectedProjectId(projectId);
    }
  };

  const renderContent = () => {
    switch (activePage) {
      case 'videoGen':
        return <VideoGenerator onNavigate={handleNavigate} projectId={selectedProjectId} onProjectCreated={setSelectedProjectId} />;
      case 'history':
        return <HistoryPage onNavigate={handleNavigate} />;
      case 'brandKit':
        return <BrandKitEditor onNavigate={handleNavigate} />;
      default:
        return <VideoGenerator onNavigate={handleNavigate} projectId={selectedProjectId} onProjectCreated={setSelectedProjectId} />;
    }
  };

  return (
    <div className="flex h-screen bg-surface-50 overflow-hidden text-slate-900 font-sans">
      <GlobalSidebar 
        activePage={activePage} 
        onNavigate={handleNavigate} 
        onLogout={() => setIsLoggedIn(false)} 
      />
      <div className="flex-1 overflow-hidden relative z-10">
        {renderContent()}
      </div>
    </div>
  );
}
