import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  UserPlus, 
  UserCheck, 
  Building2, 
  ChevronDown, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenRegisterCandidateModal?: () => void;
  onOpenRegisterEmployerModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab,
  onOpenRegisterCandidateModal,
  onOpenRegisterEmployerModal
}) => {
  const { candidate } = useApp();
  const [isRegisterDropdownOpen, setIsRegisterDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsRegisterDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

          <div className="flex items-center gap-2.5">
            {/* Active Candidate Badge */}
            {candidate && (
              <button
                onClick={() => setActiveTab('profile')}
                className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors"
                title={`${candidate.name} (${candidate.primaryPLM})`}
              >
                <div className={`w-5 h-5 rounded text-white text-[10px] flex items-center justify-center font-bold ${candidate.accentColor || 'bg-blue-600'}`}>
                  {candidate.avatarInitials}
                </div>
                <span className="font-semibold text-slate-800 max-w-[100px] truncate">
                  {candidate.name}
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              </button>
            )}

            {/* Registration Dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setIsRegisterDropdownOpen(!isRegisterDropdownOpen)}
                className="px-3 py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
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

                  <button
                    onClick={() => {
                      setIsRegisterDropdownOpen(false);
                      if (onOpenRegisterCandidateModal) onOpenRegisterCandidateModal();
                    }}
                    className="w-full text-left p-3 rounded-xl hover:bg-blue-50/70 border border-transparent hover:border-blue-100 transition-all group flex items-start gap-3"
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
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

                  <button
                    onClick={() => {
                      setIsRegisterDropdownOpen(false);
                      if (onOpenRegisterEmployerModal) onOpenRegisterEmployerModal();
                    }}
                    className="w-full text-left p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group flex items-start gap-3 mt-1"
                  >
                    <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                        <span>Register as Job Provider</span>
                        <ArrowRight className="w-3 h-3 text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                        Register company legal entity & PLM stack for admin audit.
                      </p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {onOpenRegisterCandidateModal && (
              <button
                onClick={onOpenRegisterCandidateModal}
                className="hidden lg:inline-flex px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-2xs items-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>+ Register Profile</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
