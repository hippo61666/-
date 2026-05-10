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

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  const renderContent = () => {
    switch (activePage) {
      case 'videoGen':
        return <VideoGenerator onNavigate={setActivePage} />;
      case 'history':
        return <HistoryPage onNavigate={setActivePage} />;
      case 'brandKit':
        return <BrandKitEditor onNavigate={setActivePage} />;
      default:
        return <VideoGenerator onNavigate={setActivePage} />;
    }
  };

  return (
    <div className="flex h-screen bg-surface-50 overflow-hidden text-slate-900 font-sans">
      <GlobalSidebar 
        activePage={activePage} 
        onNavigate={setActivePage} 
        onLogout={() => setIsLoggedIn(false)} 
      />
      <div className="flex-1 overflow-hidden relative z-10">
        {renderContent()}
      </div>
    </div>
  );
}
