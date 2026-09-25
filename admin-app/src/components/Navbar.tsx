import React from 'react';
import { useApp } from '../context/AppContext';
import { Mail } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab
}) => {
  const { 
    unreadEmailCount, 
    setIsEmailDrawerOpen,
    employers
  } = useApp();

  const pendingVerificationCount = employers.filter(e => e.verificationStatus === 'pending_verification').length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('verification-queue')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm tracking-wider shadow-sm group-hover:bg-slate-800 transition-colors">
                PLM
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-slate-800 transition-colors">
                PLM Nexus Admin
              </span>
            </button>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="text-xs text-slate-500 hidden sm:inline font-mono">
              Governance & Oversight
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('verification-queue')}
              className={`relative transition-colors hover:text-slate-900 flex items-center gap-1.5 ${
                activeTab === 'verification-queue' ? 'text-slate-950 font-semibold' : ''
              }`}
            >
              <span>Verification Queue</span>
              {pendingVerificationCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-xs font-mono flex items-center justify-center font-bold">
                  {pendingVerificationCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('employers-list')}
              className={`transition-colors hover:text-slate-900 ${
                activeTab === 'employers-list' ? 'text-slate-950 font-semibold' : ''
              }`}
            >
              All Enterprises
            </button>
            <button
              onClick={() => setActiveTab('ecosystem-stats')}
              className={`transition-colors hover:text-slate-900 ${
                activeTab === 'ecosystem-stats' ? 'text-slate-950 font-semibold' : ''
              }`}
            >
              PLM Market Analytics
            </button>
            <button
              onClick={() => setActiveTab('audit-logs')}
              className={`transition-colors hover:text-slate-900 ${
                activeTab === 'audit-logs' ? 'text-slate-950 font-semibold' : ''
              }`}
            >
              System & Email Audit
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEmailDrawerOpen(true)}
              className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
              title="Simulated Transactional Email Notifications"
            >
              <Mail className="w-5 h-5" />
              {unreadEmailCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-blue-600 text-white text-[10px] font-mono font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadEmailCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('verification-queue')}
              className="hidden lg:inline-flex px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors whitespace-nowrap"
            >
              Review Pending ({pendingVerificationCount})
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
