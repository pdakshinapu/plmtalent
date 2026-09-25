import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';

import { 
  Shield, 
  Briefcase, 
  Building2, 
  CheckCircle2, 
  Clock, 
  ChevronDown, 
  Sparkles, 
  Layers, 
  FileCheck,
  UserPlus,
  UserCheck,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenRegisterEmployerModal: () => void;
  onOpenRegisterCandidateModal: () => void;
  onOpenRegisterModal?: () => void; // backwards compat
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab, 
  onOpenRegisterEmployerModal,
  onOpenRegisterCandidateModal,
  onOpenRegisterModal
}) => {
  const { 
    role, 
    currentEmployer,
    employers,
    setCurrentEmployerId
  } = useApp();

  const navigate = useNavigate();
  const [isRegisterDropdownOpen, setIsRegisterDropdownOpen] = useState(false);
  const [isEmployerDropdownOpen, setIsEmployerDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const employerDropdownRef = useRef<HTMLDivElement>(null);

  const pendingVerificationCount = employers.filter(e => e.verificationStatus === 'pending_verification').length;

  const handleOpenEmployerModal = () => {
    setIsRegisterDropdownOpen(false);
    if (onOpenRegisterEmployerModal) {
      onOpenRegisterEmployerModal();
    } else if (onOpenRegisterModal) {
      onOpenRegisterModal();
    }
  };

  const handleOpenCandidateModal = () => {
    setIsRegisterDropdownOpen(false);
    onOpenRegisterCandidateModal();
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsRegisterDropdownOpen(false);
      }
      if (employerDropdownRef.current && !employerDropdownRef.current.contains(event.target as Node)) {
        setIsEmployerDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* ZONE 1: Logo & Ecosystem Brand */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                if (role === 'candidate') {
                  setActiveTab('explore');
                  navigate('/job-seeker');
                } else if (role === 'employer') {
                  setActiveTab('dashboard');
                  navigate('/job-provider');
                } else {
                  setActiveTab('verification-queue');
                  navigate('/admin');
                }
              }}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm tracking-wider shadow-sm group-hover:bg-slate-800 transition-colors">
                PLM
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-slate-800 transition-colors block leading-tight">
                  PLM Nexus
                </span>
              </div>
            </button>
          </div>

          {/* ZONE 2: Clean navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
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
              </>
            )}
          </nav>

          {/* ZONE 3: Registration Modals Trigger & Active Identity */}
          <div className="flex items-center gap-2.5">

            {/* Active Employer Badge (When in Employer Role) */}
            {role === 'employer' && currentEmployer && (
              <div ref={employerDropdownRef} className="relative">
                <button
                  onClick={() => setIsEmployerDropdownOpen(!isEmployerDropdownOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors shadow-2xs"
                >
                  <div className={`w-5 h-5 rounded text-white text-[10px] flex items-center justify-center font-bold ${currentEmployer.logoBg}`}>
                    {currentEmployer.logoInitials}
                  </div>
                  <span className="font-semibold text-slate-800 max-w-[110px] truncate">
                    {currentEmployer.companyName}
                  </span>
                  {currentEmployer.verificationStatus === 'verified' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  )}
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {isEmployerDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Switch Active Company
                    </div>
                    {employers.map(emp => (
                      <button
                        key={emp.id}
                        onClick={() => {
                          setCurrentEmployerId(emp.id);
                          setIsEmployerDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                          emp.id === currentEmployer.id ? 'bg-slate-50 font-semibold text-slate-900' : 'text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className={`w-5 h-5 rounded text-white text-[10px] flex items-center justify-center font-bold shrink-0 ${emp.logoBg}`}>
                            {emp.logoInitials}
                          </span>
                          <span className="truncate">{emp.companyName}</span>
                        </div>
                        <span className="text-[10px] shrink-0 ml-2">
                          {emp.verificationStatus === 'verified' ? (
                            <span className="text-emerald-600 font-semibold">Verified</span>
                          ) : (
                            <span className="text-amber-600 font-semibold">Pending</span>
                          )}
                        </span>
                      </button>
                    ))}
                    <div className="border-t border-slate-100 mt-1 pt-1 px-1">
                      <button
                        onClick={() => {
                          setIsEmployerDropdownOpen(false);
                          handleOpenEmployerModal();
                        }}
                        className="w-full px-2.5 py-1.5 text-left text-xs text-blue-600 hover:bg-blue-50 font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                      >
                        <Building2 className="w-3.5 h-3.5" />
                        <span>+ Register New Enterprise</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* DUAL REGISTRATION DROPDOWN BUTTON: Direct access to registrations (shown for employer & admin only) */}
            {role !== 'candidate' && (
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setIsRegisterDropdownOpen(!isRegisterDropdownOpen)}
                  className="px-3 py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
                  title="Register as Job Seeker or Job Provider"
                >
                  <UserPlus className="w-3.5 h-3.5 text-slate-700" />
                  <span>Register</span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </button>

                {isRegisterDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                      Select Registration Type
                    </div>

                    {/* Option 1: Job Seeker Registration */}
                    <button
                      onClick={handleOpenCandidateModal}
                      className="w-full text-left p-3 rounded-xl hover:bg-blue-50/70 border border-transparent hover:border-blue-100 transition-all group flex items-start gap-3"
                    >
                      <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 group-hover:text-blue-900 flex items-center gap-1">
                          <span>Register as Job Seeker</span>
                          <ArrowRight className="w-3 h-3 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                          Build your verified PLM specialist profile to apply with 1-click.
                        </p>
                      </div>
                    </button>

                    {/* Option 2: Job Provider (Employer) Registration */}
                    <button
                      onClick={handleOpenEmployerModal}
                      className="w-full text-left p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group flex items-start gap-3 mt-1"
                    >
                      <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                          <span>Register as Job Provider</span>
                          <ArrowRight className="w-3 h-3 text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                          Register company legal entity, tax ID & PLM stack for admin audit.
                        </p>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            )}

            {role === 'employer' && (
              <button
                onClick={handleOpenEmployerModal}
                className="hidden sm:inline-flex px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-2xs items-center gap-1.5"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>+ Register Company</span>
              </button>
            )}

            {role === 'admin' && (
              <button
                onClick={() => setActiveTab('verification-queue')}
                className="hidden sm:inline-flex px-3.5 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors shadow-2xs items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Review Pending ({pendingVerificationCount})</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
