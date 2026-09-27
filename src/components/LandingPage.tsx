import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Briefcase, 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  UserCheck, 
  ChevronRight, 
  Compass, 
  Users 
} from 'lucide-react';

interface LandingPageProps {
  onOpenRegisterCandidateModal: () => void;
  onOpenRegisterEmployerModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenRegisterCandidateModal,
  onOpenRegisterEmployerModal,
}) => {
  const navigate = useNavigate();
  const { userSession, jobs, employers, logout } = useApp();

  const activeJobsCount = jobs.filter(j => j.status === 'active').length;
  const verifiedCompaniesCount = employers.filter(e => e.verificationStatus === 'verified').length;

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      
      {/* HERO SECTION */}
      <section className="relative pt-24 pb-20 overflow-hidden border-b border-slate-100">
        {/* Soft ambient background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[700px] h-[380px] bg-gradient-to-tr from-blue-100 via-indigo-50 to-transparent blur-[100px] pointer-events-none rounded-full" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            
            {/* Pill Header Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Built for the PLM Community</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]">
              Where <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">PLM Professionals</span> Connect
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
              A simple, friendly place for Teamcenter, Windchill, 3DEXPERIENCE and Aras professionals to meet the companies looking for their skills — and for companies to find the right people, faster.
            </p>

            {/* Authenticated User Status Bar */}
            {userSession ? (
              <div className="mt-6 inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-slate-600">
                  Signed in as <strong className="text-slate-900">{userSession.name}</strong> ({userSession.role === 'candidate' ? 'Job Seeker' : userSession.role === 'employer' ? 'Employer' : 'Admin'})
                </span>
                <button
                  id="landing-hero-logout-btn"
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="ml-2 px-2.5 py-1 rounded-lg text-xs font-bold text-rose-600 hover:text-white hover:bg-rose-600 transition-colors cursor-pointer border border-rose-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="mt-6 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
                <span>Already have an account?</span>
                <button
                  id="landing-hero-login-btn"
                  onClick={() => navigate('/login')}
                  className="font-bold text-blue-600 hover:text-blue-700 underline cursor-pointer"
                >
                  Login here →
                </button>
              </div>
            )}

            {/* Primary Action Buttons */}
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                onClick={() => {
                  if (userSession?.role === 'candidate') {
                    navigate('/job-seeker');
                  } else {
                    navigate('/login?role=candidate&redirect=/job-seeker');
                  }
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Compass className="w-4 h-4 text-blue-100" />
                <span>Find PLM Jobs</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => {
                  if (userSession?.role === 'employer') {
                    navigate('/job-provider');
                  } else {
                    navigate('/login?role=employer&redirect=/job-provider');
                  }
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-slate-500" />
                <span>Hire PLM Talent</span>
              </button>
            </div>

            {/* Supported PLM Technologies Ribbon */}
            <div className="mt-12 pt-8 border-t border-slate-100">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-4">
                Popular PLM Platforms on the Network
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs font-semibold text-slate-600">
                <span className="px-3.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
                  Siemens Teamcenter
                </span>
                <span className="px-3.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
                  PTC Windchill
                </span>
                <span className="px-3.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
                  Dassault 3DEXPERIENCE
                </span>
                <span className="px-3.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
                  Aras Innovator
                </span>
                <span className="px-3.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
                  SAP PLM
                </span>
                <span className="px-3.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
                  Active Workspace (AWC)
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* METRICS & CREDIBILITY BAR */}
      <section className="py-8 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {activeJobsCount}
              </div>
              <div className="text-xs font-medium text-slate-500 mt-1">Open PLM Jobs</div>
            </div>
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {verifiedCompaniesCount}
              </div>
              <div className="text-xs font-medium text-slate-500 mt-1">Companies Hiring</div>
            </div>
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-black text-blue-600 tracking-tight">
                100%
              </div>
              <div className="text-xs font-medium text-slate-500 mt-1">Focused on PLM</div>
            </div>
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight">
                Free
              </div>
              <div className="text-xs font-medium text-slate-500 mt-1">To Join the Network</div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS: JOB SEEKERS & EMPLOYERS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">
              How It Works
            </h2>
            <p className="mt-2 text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
              A Simple Space to Connect
            </p>
            <p className="mt-3 text-sm text-slate-500 leading-relaxed">
              Whether you're looking for your next PLM role or the next great hire, everything here is built to keep it simple.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* JOB SEEKERS */}
            <div className="bg-white rounded-2xl p-7 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  For Job Seekers
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  Teamcenter, Windchill and 3DEXPERIENCE professionals can browse open roles and apply in a couple of clicks.
                </p>

                <ul className="space-y-2.5 text-sm text-slate-600 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Browse roles by PLM system and skill set</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Build a simple profile that highlights your experience</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Apply directly and track your applications</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={() => {
                    navigate('/job-seeker');
                  }}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-sm bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-100 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Browse Jobs</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* EMPLOYERS */}
            <div className="bg-white rounded-2xl p-7 border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  For Employers
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  Companies looking for PLM talent can post a role and start connecting with candidates right away.
                </p>

                <ul className="space-y-2.5 text-sm text-slate-600 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span>Post jobs with the PLM system and skills you need</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span>Review applicants in one simple dashboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span>Reach professionals who already know your systems</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={() => {
                    navigate('/job-provider');
                  }}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-sm bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white border border-indigo-100 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Post a Job</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

       {/* WHY THIS COMMUNITY */}
      <section className="py-16 bg-slate-50 border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-semibold mb-4">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>Built by and for the PLM Community</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Why PLM People Choose Us
          </h2>
          <p className="mt-4 text-sm text-slate-500 leading-relaxed max-w-2xl mx-auto">
            PLM careers need more than a generic job board. This is a focused space where people who know Teamcenter, Windchill, and 3DEXPERIENCE meet the companies who need that exact expertise.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="p-4 rounded-xl bg-white border border-slate-200">
              <h4 className="text-sm font-bold text-slate-900">Only PLM Roles</h4>
              <p className="text-xs text-slate-500 mt-1">No noise from unrelated jobs — everything here is PLM-focused.</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200">
              <h4 className="text-sm font-bold text-slate-900">Real Companies</h4>
              <p className="text-xs text-slate-500 mt-1">Employers are reviewed before they can post, keeping the network genuine.</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200">
              <h4 className="text-sm font-bold text-slate-900">Simple to Use</h4>
              <p className="text-xs text-slate-500 mt-1">No clutter — just profiles, jobs, and applications.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-20 text-center relative overflow-hidden bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Join the PLM Network Today
          </h2>
          <p className="mt-4 text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
            Whether you're looking for your next PLM role or your next great hire, getting started takes just a minute.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onOpenRegisterCandidateModal()}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md cursor-pointer"
            >
              Join as a Job Seeker
            </button>
            <button
              onClick={() => onOpenRegisterEmployerModal()}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 transition-all cursor-pointer"
            >
              Join as an Employer
            </button>
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-all cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
