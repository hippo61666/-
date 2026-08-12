"use client";

import { useEffect, useState } from 'react';
import Login from '@/components/Login';
import GlobalSidebar from '@/components/GlobalSidebar';
import BrandKitEditor from '@/components/BrandKitEditor';
import GeneratePage from '@/components/GeneratePage';
import ProjectChatPage, { type ProjectDraft } from '@/components/ProjectChatPage';
import { mockProjects, type BrandKitName, type MockProject } from '@/components/brandData';

import { Icon } from '@/components/ui/Icon';

const PROJECTS_STORAGE_KEY = 'michi-projects';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState('brandKit');
  const [activeBrandKit, setActiveBrandKit] = useState<BrandKitName>('浦发银行');
  const [activeProject, setActiveProject] = useState<ProjectDraft | null>(null);
  const [projects, setProjects] = useState<MockProject[]>(() => {
    if (typeof window === 'undefined') return mockProjects;

    try {
      const savedProjects = window.localStorage.getItem(PROJECTS_STORAGE_KEY);
      return savedProjects ? JSON.parse(savedProjects) : mockProjects;
    } catch {
      return mockProjects;
    }
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  const handleNavigate = (page: string) => {
    setActivePage(page);
    setIsMobileMenuOpen(false); // Close mobile menu on navigation
  };

  const handleStartProject = (project: ProjectDraft) => {
    setProjects(currentProjects => {
      if (currentProjects.some(item => item.id === project.id)) return currentProjects;

      const savedProject: MockProject = {
        id: project.id,
        brandKit: project.brandKit,
        title: project.title,
        updatedAt: new Date().toISOString(),
        status: project.initialPrompt ? 'GENERATING' : 'DRAFT',
        description: project.initialPrompt || '新建的空白项目对话',
      };

      return [savedProject, ...currentProjects];
    });
    setActiveProject(project);
    setActivePage('project');
  };

  const brandTheme = activeBrandKit === '浦发银行' ? 'spd-bank' : 'songmont';

  const renderContent = () => {
    switch (activePage) {
      case 'generate':
        return (
          <GeneratePage
            activeBrandKit={activeBrandKit}
            onBrandKitChange={setActiveBrandKit}
            onStartProject={handleStartProject}
            projects={projects}
          />
        );
      case 'project':
        return activeProject ? (
          <ProjectChatPage
            key={activeProject.id}
            project={activeProject}
            activeBrandKit={activeBrandKit}
            onBrandKitChange={setActiveBrandKit}
            onBack={() => handleNavigate('generate')}
          />
        ) : (
          <GeneratePage
            activeBrandKit={activeBrandKit}
            onBrandKitChange={setActiveBrandKit}
            onStartProject={handleStartProject}
            projects={projects}
          />
        );
      case 'brandKit':
        return <BrandKitEditor activeBrandKit={activeBrandKit} onBrandKitChange={setActiveBrandKit} />;
      default:
        return <BrandKitEditor activeBrandKit={activeBrandKit} onBrandKitChange={setActiveBrandKit} />;
    }
  };

  return (
    <div data-brand-theme={brandTheme} className="flex h-screen bg-[#0d060a] overflow-hidden text-white font-sans selection:bg-[var(--brand-primary)] selection:text-white">
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
          activeBrandKit={activeBrandKit}
          activeProjectId={activePage === 'project' ? activeProject?.id ?? null : null}
          projects={projects}
          onNavigate={handleNavigate}
          onOpenProject={handleStartProject}
          onLogout={() => setIsLoggedIn(false)} 
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10 w-full">
        {/* Mobile Header */}
        <div className="md:hidden h-14 bg-[#110810]/90 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 shrink-0 z-30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
              <Icon name="Hexagon" className="w-4 h-4 text-[var(--brand-primary)]" />
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
