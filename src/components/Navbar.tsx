import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { 
  Shield, 
  Briefcase, 
  Building2, 
  Mail, 
  CheckCircle2, 
  Clock, 
  ChevronDown,
  Sparkles,
  Layers,
  FileCheck
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenRegisterModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab, 
  onOpenRegisterModal
}) => {
  const { 
    role, 
    setRole, 
    unreadEmailCount, 
    setIsEmailDrawerOpen,
    currentEmployer,
    employers,
    setCurrentEmployerId
  } = useApp();

  const pendingVerificationCount = employers.filter(e => e.verificationStatus === 'pending_verification').length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* ZONE 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('explore')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm tracking-wider shadow-sm group-hover:bg-slate-800 transition-colors">
                PLM
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-slate-800 transition-colors">
                PLM Nexus
              </span>
            </button>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="text-xs text-slate-500 hidden sm:inline font-mono">
              Dedicated PLM Ecosystem
            </span>
          </div>

          {/* ZONE 2: 4-6 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            {role === 'candidate' && (
              <>
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
              </>
            )}

            {role === 'employer' && (
              <>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`transition-colors hover:text-slate-900 ${
                    activeTab === 'dashboard' ? 'text-slate-950 font-semibold' : ''
                  }`}
                >
                  Enterprise Overview
                </button>
                <button
                  onClick={() => setActiveTab('post-job')}
                  className={`transition-colors hover:text-slate-900 ${
                    activeTab === 'post-job' ? 'text-slate-950 font-semibold' : ''
                  }`}
                >
                  Publish PLM Job
                </button>
                <button
                  onClick={() => setActiveTab('pipeline')}
                  className={`transition-colors hover:text-slate-900 ${
                    activeTab === 'pipeline' ? 'text-slate-950 font-semibold' : ''
                  }`}
                >
                  Applicant ATS
                </button>
                <button
                  onClick={() => setActiveTab('company-profile')}
                  className={`transition-colors hover:text-slate-900 ${
                    activeTab === 'company-profile' ? 'text-slate-950 font-semibold' : ''
                  }`}
                >
                  Verification Credentials
                </button>
              </>
            )}

            {role === 'admin' && (
              <>
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
              </>
            )}
          </nav>

          {/* ZONE 3: Primary Actions, Email Simulator, and Role Switcher */}
          <div className="flex items-center gap-3">
            
            {/* Simulated Outbound Email Drawer Trigger */}
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

            {/* Display Active Employer Company */}
            {role === 'employer' && currentEmployer && (
              <div className="flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white shadow-sm">
                <div className={`w-4 h-4 rounded text-white text-[9px] flex items-center justify-center font-bold ${currentEmployer.logoBg}`}>
                  {currentEmployer.logoInitials}
                </div>
                <span className="font-medium text-slate-800 max-w-[110px] truncate">
                  {currentEmployer.companyName}
                </span>
                {currentEmployer.verificationStatus === 'verified' ? (
                  <span title="Verified Enterprise" className="inline-flex shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </span>
                ) : (
                  <span title="Verification Pending" className="inline-flex shrink-0">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                  </span>
                )}
              </div>
            )}



            {/* Quick Action Button */}
            {role === 'candidate' && (
              <button
                onClick={() => setActiveTab('explore')}
                className="hidden lg:inline-flex px-3 py-1.5 text-xs font-semibold text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
              >
                Browse Roles
              </button>
            )}

            {role === 'employer' && (
              <button
                onClick={() => setActiveTab('post-job')}
                className="hidden lg:inline-flex px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap"
              >
                + Post PLM Position
              </button>
            )}

            {role === 'admin' && (
              <button
                onClick={() => setActiveTab('verification-queue')}
                className="hidden lg:inline-flex px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors whitespace-nowrap"
              >
                Review Pending ({pendingVerificationCount})
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
