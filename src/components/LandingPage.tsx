import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  ArrowRight, 
  Building2, 
  CheckCircle2, 
  Compass, 
  Cpu, 
  Mail, 
  ShieldCheck, 
  Send, 
  Users,
  Sparkles,
  Check,
  ChevronDown,
  ExternalLink,
  ShieldAlert,
  UserLock,
  Ban,
  VenetianMask,
  SlidersHorizontal
} from 'lucide-react';
import { ServiceTilesSection } from './ServiceTilesSection';

interface LandingPageProps {
  onOpenRegisterCandidateModal: () => void;
  onOpenRegisterEmployerModal: () => void;
}

const platforms = [
  'Siemens Teamcenter',
  'PTC Windchill',
  'Dassault 3DEXPERIENCE / ENOVIA',
  'Aras Innovator',
  'SAP PLM',
  'Oracle Agile PLM',
  'PTC Arena PLM',
  'Autodesk Fusion Manage'
];

const cadTools = [
  'Siemens NX',
  'Dassault CATIA',
  'Dassault SOLIDWORKS',
  'PTC Creo',
  'Autodesk AutoCAD',
  'Autodesk Inventor',
  'Autodesk Fusion',
  'Siemens Solid Edge',
  'PTC Onshape'
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenRegisterCandidateModal,
  onOpenRegisterEmployerModal,
}) => {
  const navigate = useNavigate();
  const { userSession, jobs, employers, allCandidates, logout } = useApp();
  const profilesCount = 150 + (allCandidates?.length || 0);
  const activeJobsCount = 20 + jobs.filter((job) => job.status === 'active').length;
  const verifiedCompaniesCount = 20 + employers.filter((employer) => employer.verificationStatus === 'verified').length;
  const [autoBlockEmployer, setAutoBlockEmployer] = useState(true);
  const [anonymousProfile, setAnonymousProfile] = useState(true);
  const [selectedStatusMode, setSelectedStatusMode] = useState<number>(0);
  const [confidentialityToast, setConfidentialityToast] = useState<string | null>(null);

  const showConfidentialityToast = (message: string) => {
    setConfidentialityToast(message);
    setTimeout(() => {
      setConfidentialityToast((prev) => (prev === message ? null : prev));
    }, 2800);
  };

  const goToPortal = (role: 'candidate' | 'employer' | 'admin') => {
    if (role === 'candidate') navigate('/job-seeker');
    else if (role === 'employer') navigate('/job-provider');
    else navigate('/admin');
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      {/* HERO SECTION - EXACT HERO BANNER FORMAT */}
      <section id="home" className="scroll-mt-24 pt-4 sm:pt-6 pb-12 sm:pb-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* User Session Status Banner (If signed in) */}
          {userSession && (
            <div className="mb-4 inline-flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs sm:text-sm shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-600">Signed in as <strong className="text-slate-900">{userSession.name}</strong> ({userSession.role})</span>
              <button onClick={() => goToPortal(userSession.role)} className="font-bold text-[#BA3A2C] hover:underline cursor-pointer flex items-center gap-1">
                Open your workspace <ArrowRight className="inline h-3.5 w-3.5" />
              </button>
              <button onClick={() => { logout(); navigate('/'); }} className="border-l border-slate-300 pl-3 font-medium text-slate-500 hover:text-slate-900 cursor-pointer">
                Sign out
              </button>
            </div>
          )}

          {/* DESKTOP & TABLET VIEW: EXACT PIXEL-PERFECT HERO BANNER WITH INTERACTIVE HOTSPOTS */}
          <div className="hidden sm:block relative w-full overflow-hidden select-none group">
            {/* Base High-Resolution Graphic */}
            <img 
              src="/hero-banner.png" 
              alt="PLMSpider - Your PLM expertise deserves a focused network" 
              className="w-full h-auto block select-none pointer-events-none"
              loading="eager"
            />

            {/* INTERACTIVE HOTSPOT: Explore PLM careers -> */}
            <button
              type="button"
              onClick={() => userSession ? goToPortal(userSession.role) : onOpenRegisterCandidateModal()}
              aria-label="Explore PLM careers"
              className="absolute left-[3.7%] top-[79.2%] w-[21.2%] h-[8.3%] rounded-xl cursor-pointer focus:outline-none"
              title="Join as Candidate & Explore PLM Careers"
            />

            {/* INTERACTIVE HOTSPOT: Hire PLM talent */}
            <button
              type="button"
              onClick={() => userSession ? goToPortal(userSession.role) : onOpenRegisterEmployerModal()}
              aria-label="Hire PLM talent"
              className="absolute left-[25.8%] top-[79.2%] w-[15.9%] h-[8.3%] rounded-xl cursor-pointer focus:outline-none"
              title="Verified Employer Registration"
            />

            {/* INTERACTIVE HOTSPOT: Sign in */}
            <button
              type="button"
              onClick={() => navigate('/login')}
              aria-label="Sign in"
              className="absolute left-[19.4%] top-[73.2%] w-[5.6%] h-[4.2%] rounded cursor-pointer focus:outline-none"
              title="Sign in to existing account"
            />

            {/* INTERACTIVE PILL: Siemens Teamcenter */}
            <button
              type="button"
              onClick={() => navigate('/services')}
              className="absolute left-[51.4%] top-[15.2%] w-[15.4%] h-[6.5%] rounded-full cursor-pointer focus:outline-none"
              title="Explore Siemens Teamcenter roles & services"
            />

            {/* INTERACTIVE PILL: PTC Windchill (Top) */}
            <button
              type="button"
              onClick={() => navigate('/services')}
              className="absolute left-[67.3%] top-[15.2%] w-[11.8%] h-[6.5%] rounded-full cursor-pointer focus:outline-none"
              title="Explore PTC Windchill roles & services"
            />

            {/* INTERACTIVE PILL: PTC Windchill (Mid) */}
            <button
              type="button"
              onClick={() => navigate('/services')}
              className="absolute left-[51.4%] top-[23%] w-[12.6%] h-[6.5%] rounded-full cursor-pointer focus:outline-none"
              title="Explore PTC Windchill roles"
            />

            {/* INTERACTIVE PILL: Dassault 3DEXPERIENCE */}
            <button
              type="button"
              onClick={() => navigate('/services')}
              className="absolute left-[64.6%] top-[23%] w-[18.2%] h-[6.5%] rounded-full cursor-pointer focus:outline-none"
              title="Explore Dassault 3DEXPERIENCE roles & services"
            />

            {/* INTERACTIVE PILL: Siemens NX */}
            <button
              type="button"
              onClick={() => navigate('/services')}
              className="absolute left-[51.4%] top-[30.8%] w-[10.5%] h-[6.5%] rounded-full cursor-pointer focus:outline-none"
              title="Explore Siemens NX engineering CAD roles"
            />

            {/* INTERACTIVE PILL: Dassault CATIA */}
            <button
              type="button"
              onClick={() => navigate('/services')}
              className="absolute left-[62.4%] top-[30.8%] w-[12.5%] h-[6.5%] rounded-full cursor-pointer focus:outline-none"
              title="Explore Dassault CATIA CAD roles"
            />

            {/* INTERACTIVE PILL: PTC Creo */}
            <button
              type="button"
              onClick={() => navigate('/services')}
              className="absolute left-[75.4%] top-[30.8%] w-[9.8%] h-[6.5%] rounded-full cursor-pointer focus:outline-none"
              title="Explore PTC Creo CAD roles"
            />

            {/* INTERACTIVE STATS CARD: One specialist network */}
            <div 
              onClick={() => navigate('/about')}
              className="absolute left-[66.8%] top-[64.8%] w-[27%] h-[27.8%] rounded-2xl cursor-pointer"
              title="Click to learn more about the PLMSpider Specialist Network"
            />
          </div>

          {/* MOBILE VIEW (< 640px): RESPONSIVE BANNER & ACCESSIBLE TOUCH TARGETS */}
          <div className="sm:hidden space-y-4">
            <div className="relative overflow-hidden">
              <img 
                src="/hero-banner.png" 
                alt="PLMSpider - Your PLM expertise deserves a focused network" 
                className="w-full h-auto block select-none"
              />
            </div>

            {/* Mobile Touch CTAs */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5">
              <button
                type="button"
                onClick={() => userSession ? goToPortal(userSession.role) : onOpenRegisterCandidateModal()}
                className="w-full py-3.5 px-4 rounded-xl bg-[#BA3A2C] text-white font-bold text-sm shadow-md hover:bg-[#9E2F23] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Explore PLM careers</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => userSession ? goToPortal(userSession.role) : onOpenRegisterEmployerModal()}
                className="w-full py-3 px-4 rounded-xl border border-slate-300 bg-white text-slate-800 font-bold text-sm shadow-2xs hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Hire PLM talent</span>
              </button>

              <div className="text-center pt-1 text-xs text-slate-600">
                Already have an account?{' '}
                <button onClick={() => navigate('/login')} className="font-bold text-[#BA3A2C] hover:underline cursor-pointer">
                  Sign in
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* NEW NEXT-LEVEL SECTION: THE CONFIDENTIALITY & STATUS ENGINE (Why everyone wants to join immediately) */}
      <section id="confidentiality" className="scroll-mt-24 py-16 sm:py-24 bg-gradient-to-b from-white via-slate-50/60 to-white text-slate-900 border-b border-slate-200 relative overflow-hidden">
        {/* Subtle Decorative Ambient Glows */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-red-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-bold uppercase tracking-widest shadow-2xs">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              Why Top PLM Specialists & Employers Switch to PLMSpider
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-slate-950 leading-tight">
              Total Confidentiality for Job Seekers.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                Verified Status for Job Providers.
              </span>
            </h2>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              In the niche PLM world, everyone knows everyone. Posting your resume publicly risks alerting your current employer or client. PLMSpider solves this with mutual status transparency and cryptographic-grade stealth controls.
            </p>
          </div>

          {/* Interactive Dual Status & Confidentiality Comparison Grid */}
          <div className="grid lg:grid-cols-2 gap-8 items-stretch">
            {/* LEFT: JOB SEEKER CONFIDENTIALITY & STATUS POWER */}
            <div className="bg-white rounded-[28px] border border-slate-200 p-7 sm:p-9 flex flex-col justify-between relative overflow-hidden group hover:border-red-300 hover:shadow-xl transition-all shadow-sm">
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-red-50 text-[#BA3A2C] border border-red-200 text-xs font-bold">
                    <UserLock className="w-4 h-4 text-[#BA3A2C]" />
                    JOB SEEKER / EMPLOYEE STATUS
                  </span>
                  <span className="text-xs font-mono text-slate-500 font-semibold">100% Candidate Controlled</span>
                </div>

                <div>
                  <h3 className="font-display font-bold text-2xl sm:text-3xl text-slate-950 leading-snug">
                    Explore higher-paying PLM roles without risking your current job.
                  </h3>
                  <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                    You control exactly who sees your profile, when your identity is unlocked, and what your live career status says.
                  </p>
                </div>

                {/* Interactive Stealth Controls Demo Inside Card */}
                <div className="bg-slate-50/90 rounded-2xl p-5 border border-slate-200 space-y-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                    <span>Live Privacy & Status Controls (Click to test)</span>
                    <span className="text-emerald-700 font-mono font-bold flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Protected
                    </span>
                  </div>

                  {/* Control 1 */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-red-50 text-[#BA3A2C] border border-red-100 shrink-0">
                        <Ban className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">Auto-Block Current Employer & Domain</div>
                        <div className="text-xs text-slate-500">Blocks your company + selected SI partners from seeing you</div>
                      </div>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={autoBlockEmployer} 
                      onChange={(e) => {
                        setAutoBlockEmployer(e.target.checked);
                        showConfidentialityToast(e.target.checked ? 'Employer Domain Block Rule Updated!' : 'Employer Domain Block Disabled');
                      }} 
                      className="w-5 h-5 accent-[#BA3A2C] rounded cursor-pointer" 
                    />
                  </div>

                  {/* Control 2 */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-200/80 shrink-0">
                        <VenetianMask className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">Skills-First Anonymous Profile</div>
                        <div className="text-xs text-slate-500">Show Teamcenter/Windchill skills; hide name, photo & PDF resume</div>
                      </div>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={anonymousProfile} 
                      onChange={(e) => {
                        setAnonymousProfile(e.target.checked);
                        showConfidentialityToast(e.target.checked ? 'Anonymous Profile Shield Active!' : 'Anonymous Profile Shield Inactive');
                      }} 
                      className="w-5 h-5 accent-[#BA3A2C] rounded cursor-pointer" 
                    />
                  </div>

                  {/* Control 3: Live Employee Status Badge */}
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-red-50/70 via-white to-slate-50 border border-red-100/90 shadow-2xs">
                    <div className="text-xs font-bold text-slate-800 mb-2.5">4 Real-Time Employee Status Modes:</div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                      {[
                        { label: '● Stealth Open', activeBorder: 'border-emerald-400 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-400/20' },
                        { label: '● Notice Period', activeBorder: 'border-blue-400 bg-blue-50 text-blue-800 ring-2 ring-blue-400/20' },
                        { label: '● Contract Only', activeBorder: 'border-amber-400 bg-amber-50 text-amber-800 ring-2 ring-amber-400/20' },
                        { label: '○ Do Not Disturb', activeBorder: 'border-slate-400 bg-slate-100 text-slate-800 ring-2 ring-slate-400/20' }
                      ].map((mode, mIdx) => (
                        <button
                          key={mIdx}
                          type="button"
                          onClick={() => {
                            setSelectedStatusMode(mIdx);
                            showConfidentialityToast(`Status switched to: ${mode.label.replace(/^[●○]\s*/, '')}`);
                          }}
                          className={`px-2.5 py-2 rounded-lg border font-semibold text-center transition-all cursor-pointer ${
                            selectedStatusMode === mIdx 
                              ? `${mode.activeBorder} shadow-2xs font-bold scale-101` 
                              : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                          }`}
                        >
                          {mode.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="text-xs text-slate-500">
                  <strong className="text-slate-900">Identity Unlock Rule:</strong> Only revealed when you click <em>"Accept Interview Invite"</em>.
                </div>
                <button 
                  onClick={() => userSession ? goToPortal(userSession.role) : onOpenRegisterCandidateModal()} 
                  className="shrink-0 px-5 py-3 rounded-xl bg-[#BA3A2C] hover:bg-[#9E2F23] text-white text-xs font-bold transition flex items-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
                >
                  <span>Activate Stealth Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* RIGHT: JOB PROVIDER / EMPLOYER VERIFICATION & STATUS POWER */}
            <div className="bg-white rounded-[28px] border border-slate-200 p-7 sm:p-9 flex flex-col justify-between relative overflow-hidden group hover:border-emerald-300 hover:shadow-xl transition-all shadow-sm">
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    JOB PROVIDER / EMPLOYER STATUS
                  </span>
                  <span className="text-xs font-mono text-emerald-700 font-semibold">Verified Hiring Authority</span>
                </div>

                <div>
                  <h3 className="font-display font-bold text-2xl sm:text-3xl text-slate-950 leading-snug">
                    Win over passive PLM talent with Verified Employer Status.
                  </h3>
                  <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                    Senior PLM architects ignore generic recruiter messages. When your company holds a <strong className="text-slate-900 font-semibold">PLMSpider Verified Employer Status</strong>, candidates trust and respond to your invitations immediately.
                  </p>
                </div>

                {/* Interactive Employer Status Console */}
                <div className="bg-slate-50/90 rounded-2xl p-5 border border-slate-200 space-y-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                    <span>What Candidates See On Your Company Profile</span>
                    <span className="text-emerald-700 font-mono font-bold flex items-center gap-1">
                      ✓ Tier-1 Verified
                    </span>
                  </div>

                  {/* Feature 1 */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">Verified Employer Trust Badge</div>
                        <div className="text-xs text-slate-500">Confirms direct hiring authority, real project & verified domain</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                      ACTIVE
                    </span>
                  </div>

                  {/* Feature 2 */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                        <SlidersHorizontal className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">Deep Module & Version Matrix Filter</div>
                        <div className="text-xs text-slate-500">Filter by Teamcenter ITK, BMIDE, AWC, Windchill PDMLink, 3DX</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 text-[11px] font-bold border border-blue-200">
                      PRECISION
                    </span>
                  </div>

                  {/* Live Hiring Status Pipeline */}
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-50/70 via-white to-slate-50 border border-emerald-100/90 shadow-2xs">
                    <div className="text-xs font-bold text-slate-800 mb-2.5">Real-Time Candidate Pipeline Status:</div>
                    <div className="grid grid-cols-3 gap-2 text-[11px]">
                      <div className="bg-white p-3 rounded-lg border border-slate-200/80 text-center shadow-2xs">
                        <div className="font-black text-slate-900 text-base">92%</div>
                        <div className="text-slate-500 text-[10px] font-semibold mt-0.5">Invite Open Rate</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-slate-200/80 text-center shadow-2xs">
                        <div className="font-black text-emerald-600 text-base">&lt; 24 hrs</div>
                        <div className="text-slate-500 text-[10px] font-semibold mt-0.5">Identity Unlock</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-slate-200/80 text-center shadow-2xs">
                        <div className="font-black text-amber-600 text-base">100%</div>
                        <div className="text-slate-500 text-[10px] font-semibold mt-0.5">PLM Focused</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="text-xs text-slate-500">
                  <strong className="text-slate-900">Direct Hiring:</strong> Send confidential invites to stealth specialists.
                </div>
                <button 
                  onClick={() => userSession ? goToPortal(userSession.role) : onOpenRegisterEmployerModal()} 
                  className="shrink-0 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
                >
                  <span>Get Employer Verification</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Live Interactive Toast Notification */}
        {confidentialityToast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl bg-white border border-slate-200 shadow-2xl px-4 py-3 text-xs font-semibold text-slate-800 ring-1 ring-black/5 backdrop-blur-md">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{confidentialityToast}</span>
          </div>
        )}
      </section>

      <ServiceTilesSection onOpenRegisterCandidateModal={onOpenRegisterCandidateModal} onOpenRegisterEmployerModal={onOpenRegisterEmployerModal} />

      <section className="bg-gradient-to-r from-red-50/40 via-white to-slate-50 border-t border-slate-200 py-16 text-slate-900 sm:py-20">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-4 sm:px-6 md:flex-row md:items-center lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[.16em] text-[#BA3A2C]">Make your next move</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Put PLM expertise at the center.</h2>
            <p className="mt-4 leading-7 text-slate-600">Join as a professional to explore opportunities, or create an employer account to start building your team.</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <button onClick={onOpenRegisterCandidateModal} className="rounded-xl bg-[#BA3A2C] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#9E2F23] shadow-md shadow-red-900/10 cursor-pointer">
              Join as a professional
            </button>
            <button onClick={onOpenRegisterEmployerModal} className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-50 hover:border-slate-400 shadow-2xs cursor-pointer">
              Register as an employer
            </button>
            <button onClick={() => navigate('/login')} className="rounded-xl border border-transparent px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 cursor-pointer">
              Sign in
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
