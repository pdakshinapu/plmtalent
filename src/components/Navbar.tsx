import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';

import { 
  Shield, 
  Briefcase, 
  Building2, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Layers, 
  FileCheck,
  ExternalLink,
  LogIn,
  LogOut,
  User,
  ChevronDown,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

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
    setCurrentEmployerId,
    userSession,
    logout
  } = useApp();

  const navigate = useNavigate();
  const location = useLocation();

  const pendingVerificationCount = employers.filter(e => e.verificationStatus === 'pending_verification').length;
  const isLandingPage = location.pathname === '/';
  const isAuthPage = location.pathname.startsWith('/login');

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenVerificationCredentials = () => {
    setIsProfileDropdownOpen(false);
    setActiveTab('company-profile');
    if (location.pathname !== '/job-provider') {
      navigate('/job-provider');
    }
  };

  const handleOpenCandidateProfile = () => {
    setIsProfileDropdownOpen(false);
    setActiveTab('profile');
    if (location.pathname !== '/job-seeker') {
      navigate('/job-seeker');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* ZONE 1: Logo & Ecosystem Brand */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                navigate('/');
              }}
              className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
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
            {isAuthPage ? (
              <button
                onClick={() => navigate('/')}
                className="transition-colors hover:text-slate-900 font-medium cursor-pointer"
              >
                ← Return to Platform Overview
              </button>
            ) : !userSession || isLandingPage ? (
              <>
                <button
                  onClick={() => navigate('/')}
                  className={`transition-colors hover:text-slate-900 cursor-pointer ${
                    isLandingPage ? 'text-slate-950 font-bold' : ''
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => navigate(userSession ? '/job-seeker' : '/login?role=candidate')}
                  className="transition-colors hover:text-slate-900 cursor-pointer"
                >
                  Find Jobs
                </button>
                <button
                  onClick={() => navigate(userSession ? '/job-provider' : '/login?role=employer')}
                  className="transition-colors hover:text-slate-900 cursor-pointer"
                >
                  Hire Talent
                </button>
                {userSession?.role === 'admin' && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="transition-colors hover:text-amber-600 font-semibold cursor-pointer"
                  >
                    Governance
                  </button>
                )}
              </>
            ) : (
              <>
                {role === 'candidate' && (
                  <>
                    <button
                      onClick={() => setActiveTab('explore')}
                      className={`transition-colors hover:text-slate-900 cursor-pointer ${
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
                  onClick={() => setActiveTab('search-candidates')}
                  className={`transition-colors hover:text-slate-900 ${
                    activeTab === 'search-candidates' ? 'text-slate-950 font-semibold' : ''
                  }`}
                >
                  Search Job Seekers
                </button>
                <button
                  onClick={() => setActiveTab('published-jobs')}
                  className={`transition-colors hover:text-slate-900 cursor-pointer ${
                    activeTab === 'published-jobs' || activeTab === 'pipeline' || activeTab === 'post-job' ? 'text-slate-950 font-semibold' : ''
                  }`}
                >
                  Published Jobs
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
                  onClick={() => setActiveTab('platform-settings')}
                  className={`transition-colors hover:text-slate-900 ${
                    activeTab === 'platform-settings' ? 'text-slate-950 font-semibold' : ''
                  }`}
                >
                  Platform Settings
                </button>
              </>
            )}
          </>
        )}
      </nav>

          {/* ZONE 3: Auth & Identity Actions */}
          <div className="flex items-center gap-3">



            {/* AUTH / LOGIN & LOGOUT ACTIONS */}
            {!userSession ? (
              <button
                id="navbar-login-btn"
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-blue-100" />
                <span>Login</span>
              </button>
            ) : (
              <div className="flex items-center gap-2.5">
                {/* Profile Button with Verification Credentials Popover */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    id="navbar-profile-btn"
                    onClick={() => setIsProfileDropdownOpen(prev => !prev)}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer select-none ${
                      isProfileDropdownOpen || (role === 'employer' && activeTab === 'company-profile')
                        ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-500/20 shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200/80 border-slate-200 hover:border-slate-300'
                    }`}
                    title={userSession.role === 'employer' ? 'Open Verification Credentials' : 'Open Profile'}
                  >
                    <div className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                      {userSession.name?.charAt(0) || 'U'}
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold text-slate-900 leading-tight flex items-center gap-1">
                        <span>{userSession.name}</span>
                        {userSession.role === 'employer' && currentEmployer?.verificationStatus === 'verified' && (
                          <span title="Verified Enterprise"><CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" /></span>
                        )}
                        {userSession.role === 'employer' && currentEmployer?.verificationStatus === 'pending_verification' && (
                          <span title="Verification Pending"><Clock className="w-3 h-3 text-amber-600 shrink-0" /></span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        {userSession.role === 'candidate' ? 'Job Seeker' : userSession.role === 'employer' ? 'Job Provider' : 'Admin'}
                      </div>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180 text-blue-600' : ''}`} />
                  </button>

                  {/* Dropdown Popover */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                      
                      {/* Dropdown User Header */}
                      <div className="p-4 bg-slate-50 border-b border-slate-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                            {userSession.name?.charAt(0) || 'U'}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-bold text-slate-900 truncate">
                              {userSession.name}
                            </div>
                            <div className="text-xs text-slate-500 truncate">
                              {userSession.email}
                            </div>
                            <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                              {userSession.role === 'candidate' ? 'Job Seeker' : userSession.role === 'employer' ? 'Job Provider' : 'Platform Admin'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* EMPLOYER: VERIFICATION CREDENTIALS SECTION */}
                      {userSession.role === 'employer' && (
                        <div className="p-4 space-y-3 border-b border-slate-100">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                              Verification Credentials
                            </span>
                            {currentEmployer?.verificationStatus === 'verified' && (
                              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Verified
                              </span>
                            )}
                            {currentEmployer?.verificationStatus === 'pending_verification' && (
                              <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                <Clock className="w-3 h-3 text-amber-600" />
                                Pending Audit
                              </span>
                            )}
                            {currentEmployer?.verificationStatus === 'rejected' && (
                              <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                                <AlertTriangle className="w-3 h-3 text-rose-600" />
                                Rejected
                              </span>
                            )}
                          </div>

                          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs space-y-1.5">
                            <div className="flex items-center justify-between text-slate-600">
                              <span className="text-[11px] text-slate-400">Enterprise:</span>
                              <span className="font-semibold text-slate-900 truncate max-w-[160px]">
                                {currentEmployer?.companyName || userSession.companyName || 'Registered Enterprise'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-slate-600">
                              <span className="text-[11px] text-slate-400">Domain:</span>
                              <span className="font-mono text-slate-800 text-[11px]">
                                {currentEmployer?.corporateDomain || userSession.email.split('@')[1] || 'domain.com'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-slate-600">
                              <span className="text-[11px] text-slate-400">Tax EIN:</span>
                              <span className="font-mono text-slate-800 text-[11px]">
                                {currentEmployer?.taxRegistrationNumber || 'EIN-PENDING'}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={handleOpenVerificationCredentials}
                            className="w-full px-3 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl flex items-center justify-between transition-colors shadow-xs cursor-pointer"
                          >
                            <span className="flex items-center gap-1.5">
                              <ShieldCheck className="w-4 h-4 text-emerald-400" />
                              <span>Open Verification Credentials</span>
                            </span>
                            <span className="text-slate-400 font-mono text-[10px]">→</span>
                          </button>
                        </div>
                      )}

                      {/* CANDIDATE: PROFILE SECTION */}
                      {userSession.role === 'candidate' && (
                        <div className="p-4 space-y-3 border-b border-slate-100">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                              Candidate Profile
                            </span>
                            <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                              <CheckCircle2 className="w-3 h-3 text-blue-600" />
                              Verified Specialist
                            </span>
                          </div>

                          <button
                            onClick={handleOpenCandidateProfile}
                            className="w-full px-3 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl flex items-center justify-between transition-colors shadow-xs cursor-pointer"
                          >
                            <span className="flex items-center gap-1.5">
                              <User className="w-4 h-4 text-blue-400" />
                              <span>Open PLM Profile & Skills</span>
                            </span>
                            <span className="text-slate-400 font-mono text-[10px]">→</span>
                          </button>
                        </div>
                      )}

                      {/* Dropdown Footer with Logout */}
                      <div className="p-2 bg-slate-50 border-t border-slate-100">
                        <button
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            logout();
                            navigate('/');
                          }}
                          className="w-full px-3 py-2 text-xs font-semibold text-rose-600 hover:text-white hover:bg-rose-600 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>

                    </div>
                  )}
                </div>

                <button
                  id="navbar-logout-btn"
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="px-3 py-1.5 text-xs font-bold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 hover:border-rose-600 rounded-xl transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  title="Sign out of account"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
