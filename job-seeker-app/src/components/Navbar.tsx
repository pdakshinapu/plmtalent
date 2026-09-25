import React from 'react';
import { useApp } from '../context/AppContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab 
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('explore')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm tracking-wider shadow-sm group-hover:bg-slate-800 transition-colors">
                PLM
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-slate-800 transition-colors">
                PLM Nexus Job Seeker
              </span>
            </button>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="text-xs text-slate-500 hidden sm:inline font-mono">
              Dedicated PLM Ecosystem
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('explore')}
              className={`transition-colors hover:text-slate-900 ${
                activeTab === 'explore' ? 'text-slate-950 font-semibold' : ''
              }`}
            >
              Explore PLM Jobs
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`transition-colors hover:text-slate-900 ${
                activeTab === 'applications' ? 'text-slate-950 font-semibold' : ''
              }`}
            >
              My Applications
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`transition-colors hover:text-slate-900 ${
                activeTab === 'profile' ? 'text-slate-950 font-semibold' : ''
              }`}
            >
              PLM Profile & Skills
            </button>
            <button
              onClick={() => setActiveTab('directory')}
              className={`transition-colors hover:text-slate-900 ${
                activeTab === 'directory' ? 'text-slate-950 font-semibold' : ''
              }`}
            >
              Verified Enterprises
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('explore')}
              className="hidden lg:inline-flex px-3 py-1.5 text-xs font-semibold text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
            >
              Browse Roles
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
