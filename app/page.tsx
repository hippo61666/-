"use client";

import { useState } from 'react';
import Login from '@/components/Login';
import GlobalSidebar from '@/components/GlobalSidebar';
import VideoGenerator from '@/components/VideoGenerator';
import HistoryPage from '@/components/HistoryPage';
import BrandKitEditor from '@/components/BrandKitEditor';
import SkillPage from '@/components/SkillPage';

import { Icon } from '@/components/ui/Icon';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState('brandKit');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  const handleNavigate = (page: string, projectId?: string | null) => {
    setActivePage(page);
    if (projectId !== undefined) {
      setSelectedProjectId(projectId);
    }
    setIsMobileMenuOpen(false); // Close mobile menu on navigation
  };

  const renderContent = () => {
    switch (activePage) {
      case 'videoGen':
        return <VideoGenerator onNavigate={handleNavigate} projectId={selectedProjectId} onProjectCreated={setSelectedProjectId} />;
      case 'history':
        return <HistoryPage onNavigate={handleNavigate} />;
      case 'brandKit':
        return <BrandKitEditor onNavigate={handleNavigate} />;
      case 'skill':
        return <SkillPage />;
      default:
        return <VideoGenerator onNavigate={handleNavigate} projectId={selectedProjectId} onProjectCreated={setSelectedProjectId} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#0d060a] overflow-hidden text-white font-sans selection:bg-[#FF2A6D] selection:text-white">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Global Sidebar (Responsive) */}
      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <GlobalSidebar 
          activePage={activePage} 
          onNavigate={handleNavigate} 
          onLogout={() => setIsLoggedIn(false)} 
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10 w-full">
        {/* Mobile Header */}
        <div className="md:hidden h-14 bg-[#110810]/90 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 shrink-0 z-30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
              <Icon name="Hexagon" className="w-4 h-4 text-[#FF2A6D]" />
            </div>
            <span className="font-bold text-sm tracking-widest uppercase">Workspace</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-white/70 hover:text-white">
            <Icon name="Menu" className="w-6 h-6" />
          </button>
        </div>

        {/* Content Wrapper */}
        <div className="flex-1 overflow-hidden relative">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
