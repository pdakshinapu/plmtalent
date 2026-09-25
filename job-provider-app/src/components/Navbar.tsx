import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckCircle2, 
  Clock, 
  ChevronDown
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
    currentEmployer,
    employers,
    setCurrentEmployerId
  } = useApp();

  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm tracking-wider shadow-sm group-hover:bg-slate-800 transition-colors">
                PLM
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-slate-800 transition-colors">
                PLM Nexus Job Provider
              </span>
            </button>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="text-xs text-slate-500 hidden sm:inline font-mono">
              Dedicated PLM Ecosystem
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
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
          </nav>

          <div className="flex items-center gap-3">
            {currentEmployer && (
              <div className="relative">
                <button
                  onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors"
                >
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
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {isCompanyDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-lg bg-white border border-slate-200 shadow-lg py-1 z-50">
                    <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Switch Active Employer
                    </div>
                    {employers.map(emp => (
                      <button
                        key={emp.id}
                        onClick={() => {
                          setCurrentEmployerId(emp.id);
                          setIsCompanyDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-50 ${
                          emp.id === currentEmployer.id ? 'bg-slate-50 font-medium text-slate-900' : 'text-slate-700'
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
                            <span className="text-emerald-600 font-medium">Verified</span>
                          ) : (
                            <span className="text-amber-600 font-medium">Pending</span>
                          )}
                        </span>
                      </button>
                    ))}
                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setIsCompanyDropdownOpen(false);
                          onOpenRegisterModal();
                        }}
                        className="w-full px-3 py-2 text-left text-xs text-blue-600 hover:bg-blue-50 font-medium flex items-center gap-1.5"
                      >
                        <span>+ Register New Company</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setActiveTab('post-job')}
              className="hidden lg:inline-flex px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap"
            >
              + Post PLM Position
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
