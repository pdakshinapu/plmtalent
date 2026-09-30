import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowRight, BriefcaseBusiness, Building2, CheckCircle2, Compass, Cpu, ShieldCheck, Users } from 'lucide-react';
import { ServiceTilesSection } from './ServiceTilesSection';

interface LandingPageProps {
  onOpenRegisterCandidateModal: () => void;
  onOpenRegisterEmployerModal: () => void;
}

const platforms = ['Siemens Teamcenter', 'PTC Windchill', 'Dassault 3DEXPERIENCE', 'Aras Innovator', 'SAP PLM', 'Arena PLM'];

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenRegisterCandidateModal,
  onOpenRegisterEmployerModal,
}) => {
  const navigate = useNavigate();
  const { userSession, jobs, employers, logout } = useApp();
  const activeJobsCount = jobs.filter((job) => job.status === 'active').length;
  const verifiedCompaniesCount = employers.filter((employer) => employer.verificationStatus === 'verified').length;

  const goToPortal = (role: 'candidate' | 'employer' | 'admin') => {
    if (role === 'candidate') navigate('/job-seeker');
    else if (role === 'employer') navigate('/job-provider');
    else navigate('/admin');
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <section className="relative isolate overflow-hidden border-b border-slate-200 bg-slate-50">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/80 via-slate-50 to-white" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.1fr_.9fr] lg:px-8 lg:py-28">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-blue-800 shadow-sm">
              <Cpu className="h-4 w-4" /> Purpose-built for the PLM community
            </div>
            <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Your PLM expertise deserves a <span className="text-[#BA3A2C]">focused network.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              PLMSpider brings together product lifecycle management professionals and employers. Explore roles, present your platform experience, and connect around the skills engineering teams need.
            </p>

            {userSession ? (
              <div className="mt-6 inline-flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-slate-600">Signed in as <strong className="text-slate-900">{userSession.name}</strong></span>
                <button onClick={() => goToPortal(userSession.role)} className="font-bold text-[#BA3A2C] hover:underline">Open your workspace <ArrowRight className="ml-1 inline h-4 w-4" /></button>
                <button onClick={() => { logout(); navigate('/'); }} className="border-l border-slate-200 pl-3 font-medium text-slate-500 hover:text-slate-900">Sign out</button>
              </div>
            ) : (
              <p className="mt-5 text-sm text-slate-600">Already have an account? <button onClick={() => navigate('/login')} className="font-bold text-[#BA3A2C] hover:underline">Sign in</button></p>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => userSession ? goToPortal(userSession.role) : onOpenRegisterCandidateModal()} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#BA3A2C] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-900/10 transition hover:bg-[#9E2F23]">
                <Compass className="h-4 w-4" /> Explore PLM careers <ArrowRight className="h-4 w-4" />
              </button>
              <button onClick={() => userSession ? goToPortal(userSession.role) : onOpenRegisterEmployerModal()} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-bold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50">
                <Building2 className="h-4 w-4" /> Hire PLM talent
              </button>
            </div>
            <div className="mt-10 border-t border-slate-200 pt-5">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[.16em] text-slate-500">PLM platforms and skills</p>
              <div className="flex flex-wrap gap-2">{platforms.map((platform) => <span key={platform} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">{platform}</span>)}</div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-blue-200/60 via-transparent to-emerald-200/60 blur-2xl" />
            <div className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Users className="h-5 w-5" /></div>
                <div><p className="text-sm font-bold text-slate-900">One specialist network</p><p className="text-xs text-slate-500">Built around PLM work</p></div>
              </div>
              <div className="space-y-4 py-6">
                <div className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" /><div><p className="text-sm font-bold">For professionals</p><p className="mt-1 text-sm leading-6 text-slate-600">Create a profile with your platforms, modules, CAD tools, experience, and preferences.</p></div></div>
                <div className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" /><div><p className="text-sm font-bold">For employers</p><p className="mt-1 text-sm leading-6 text-slate-600">Publish PLM roles, review relevant profiles, and manage applications and invitations.</p></div></div>
                <div className="flex gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" /><div><p className="text-sm font-bold">Company review</p><p className="mt-1 text-sm leading-6 text-slate-600">Employer verification status is visible to support a more informed hiring experience.</p></div></div>
              </div>
              <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-5">
                <div className="rounded-xl bg-slate-50 p-4"><p className="text-2xl font-black text-slate-950">{activeJobsCount}</p><p className="mt-1 text-xs text-slate-500">Active PLM roles</p></div>
                <div className="rounded-xl bg-slate-50 p-4"><p className="text-2xl font-black text-slate-950">{verifiedCompaniesCount}</p><p className="mt-1 text-xs text-slate-500">Verified employers</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ServiceTilesSection onOpenRegisterCandidateModal={onOpenRegisterCandidateModal} onOpenRegisterEmployerModal={onOpenRegisterEmployerModal} />

      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[.16em] text-[#BA3A2C]">Six ways to take part</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">A place for every part of the PLM community</h2>
            <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base">From individual specialists to enterprise teams, find the path that best describes you.</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'PLM professionals', audience: 'Job seekers and specialists', description: 'Show your experience across Teamcenter, Windchill, 3DEXPERIENCE, Aras, and related tools. Explore roles and manage applications.', role: 'candidate' as const, action: 'Join as a professional' },
              { title: 'Employers', audience: 'Engineering and talent teams', description: 'Publish PLM openings, review profiles, and manage applications and invitations from your employer workspace.', role: 'employer' as const, action: 'Join as an employer' },
              { title: 'Consultancies and integrators', audience: 'Project delivery teams', description: 'Use the employer workspace to describe PLM project roles and find people with relevant implementation skills.', role: 'employer' as const, action: 'Create an employer account' },
              { title: 'Corporate training', audience: 'Trainers and learning teams', description: 'PLM trainers can present their platform and module experience in a professional profile. Employers can specify training related skills in their openings.', role: 'candidate' as const, action: 'Create a professional profile' },
              { title: 'Freelancers and contractors', audience: 'Independent PLM specialists', description: 'Highlight your specialist skills and preferences, then explore contract opportunities listed on the network.', role: 'candidate' as const, action: 'Explore contract roles' },
              { title: 'PLM advisory', audience: 'Architects and technical advisors', description: 'Showcase your architecture, migration, integration, or governance experience for employers seeking those capabilities.', role: 'candidate' as const, action: 'Share your expertise' },
            ].map((tile) => (
              <article key={tile.title} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500"><span className="h-2 w-2 rounded-full bg-[#BA3A2C]" />{tile.audience}</div>
                <h3 className="mt-3 text-lg font-bold text-slate-950">{tile.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{tile.description}</p>
                <button onClick={() => tile.role === 'candidate' ? onOpenRegisterCandidateModal() : onOpenRegisterEmployerModal()} className="mt-5 inline-flex items-center gap-2 self-start text-sm font-bold text-[#BA3A2C] hover:text-[#9E2F23]">
                  {tile.action}<ArrowRight className="h-4 w-4" />
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#BA3A2C]">How PLMSpider works</p><h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">A clearer path from expertise to opportunity.</h2><p className="mt-4 leading-7 text-slate-600">Keep the process centered on the details that matter in product lifecycle management.</p></div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              { n: '01', title: 'Build a relevant profile', body: 'Showcase your PLM platforms, modules, CAD tools, experience, and work preferences.' },
              { n: '02', title: 'Find the right fit', body: 'Candidates can explore active roles. Employers can publish openings and search for relevant skills.' },
              { n: '03', title: 'Manage the connection', body: 'Use applications, invitations, and workspace tools to keep hiring conversations organized.' },
            ].map((step) => <article key={step.n} className="rounded-2xl border border-slate-200 bg-slate-50 p-6"><span className="text-xs font-bold tracking-widest text-[#BA3A2C]">{step.n}</span><h3 className="mt-3 text-lg font-bold text-slate-900">{step.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{step.body}</p></article>)}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-medium text-slate-500"><span className="inline-flex items-center gap-2"><BriefcaseBusiness className="h-4 w-4 text-blue-700"/>Permanent and contract roles</span><span className="inline-flex items-center gap-2"><Cpu className="h-4 w-4 text-blue-700"/>PLM and CAD skill profiles</span><span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-blue-700"/>Employer verification workflow</span></div>
        </div>
      </section>

      <section className="bg-slate-950 py-16 text-white sm:py-20">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-4 sm:px-6 md:flex-row md:items-center lg:px-8">
          <div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[.16em] text-red-300">Make your next move</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Put PLM expertise at the center.</h2><p className="mt-4 leading-7 text-slate-300">Join as a professional to explore opportunities, or create an employer account to start building your team.</p></div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row"><button onClick={onOpenRegisterCandidateModal} className="rounded-xl bg-[#BA3A2C] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#9E2F23]">Join as a professional</button><button onClick={onOpenRegisterEmployerModal} className="rounded-xl border border-slate-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800">Register as an employer</button><button onClick={() => navigate('/login')} className="rounded-xl px-5 py-3 text-sm font-bold text-slate-300 transition hover:bg-slate-800 hover:text-white">Sign in</button></div>
        </div>
      </section>
    </div>
  );
};
