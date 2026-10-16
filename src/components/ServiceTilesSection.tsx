import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BriefcaseBusiness, Building2, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ServiceTilesSectionProps {
  onOpenRegisterCandidateModal: () => void;
  onOpenRegisterEmployerModal: () => void;
}

export const ServiceTilesSection: React.FC<ServiceTilesSectionProps> = ({
  onOpenRegisterCandidateModal,
  onOpenRegisterEmployerModal,
}) => {
  const navigate = useNavigate();
  const { userSession } = useApp();

  const openCandidatePath = () => {
    if (userSession?.role === 'candidate') navigate('/job-seeker');
    else if (userSession?.role === 'employer') navigate('/job-provider');
    else if (userSession?.role === 'admin') navigate('/admin');
    else onOpenRegisterCandidateModal();
  };
  const openEmployerPath = () => {
    if (userSession?.role === 'employer') navigate('/job-provider');
    else if (userSession?.role === 'candidate') navigate('/job-seeker');
    else if (userSession?.role === 'admin') navigate('/admin');
    else onOpenRegisterEmployerModal();
  };

  return (
    <section id="service-tiles-section" className="border-b border-slate-200 bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[#BA3A2C]">Choose your path</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">A network with a clear purpose</h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">Whether you are developing your PLM career or hiring for a product engineering team, here is exactly how our platform works for you.</p>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl gap-12 lg:grid-cols-2">
          {/* Candidate Path */}
          <article className="relative flex flex-col rounded-3xl border border-slate-200 bg-slate-50 p-8 sm:p-10 transition-all hover:border-blue-300 hover:shadow-xl">
            <div className="absolute top-0 right-8 -translate-y-1/2">
               <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20"><BriefcaseBusiness className="h-8 w-8" /></div>
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 mb-8 mt-2">For PLM Professionals</h3>
            
            <div className="space-y-8 flex-1">
              <div className="relative flex gap-5">
                <div className="absolute left-[19px] top-10 bottom-[-32px] w-0.5 bg-blue-200"></div>
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold border-4 border-slate-50 shadow-sm">1</div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Create your profile</h4>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">Build a comprehensive profile highlighting your PLM platforms, specific modules, CAD tools, and hands-on experience.</p>
                </div>
              </div>
              
              <div className="relative flex gap-5">
                <div className="absolute left-[19px] top-10 bottom-[-32px] w-0.5 bg-blue-200"></div>
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold border-4 border-slate-50 shadow-sm">2</div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Discover opportunities</h4>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">Explore active roles by employment type, location, and matching skills. Our targeted network means no irrelevant job spam.</p>
                </div>
              </div>
              
              <div className="relative flex gap-5">
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold border-4 border-slate-50 shadow-sm">3</div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Connect & Track</h4>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">Apply to roles, receive direct employer invitations, and manage your entire application pipeline in one secure workspace.</p>
                </div>
              </div>
            </div>
            
            <button onClick={openCandidatePath} className="mt-10 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-4 text-sm font-bold text-white transition hover:bg-blue-800 shadow-md">
              Start your professional journey <ArrowRight className="h-4 w-4" />
            </button>
          </article>

          {/* Employer Path */}
          <article className="relative flex flex-col rounded-3xl border border-slate-200 bg-slate-50 p-8 sm:p-10 transition-all hover:border-emerald-300 hover:shadow-xl">
            <div className="absolute top-0 right-8 -translate-y-1/2">
               <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"><Building2 className="h-8 w-8" /></div>
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 mb-8 mt-2">For Employers</h3>
            
            <div className="space-y-8 flex-1">
              <div className="relative flex gap-5">
                <div className="absolute left-[19px] top-10 bottom-[-32px] w-0.5 bg-emerald-200"></div>
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold border-4 border-slate-50 shadow-sm">1</div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Publish precise roles</h4>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">Post detailed job requisitions specifying the exact PLM platforms, modules, and CAD requirements your team needs.</p>
                </div>
              </div>
              
              <div className="relative flex gap-5">
                <div className="absolute left-[19px] top-10 bottom-[-32px] w-0.5 bg-emerald-200"></div>
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold border-4 border-slate-50 shadow-sm">2</div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Review targeted talent</h4>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">Bypass the noise of general job boards. Review profiles of specialized professionals whose skills actually match your stack.</p>
                </div>
              </div>
              
              <div className="relative flex gap-5">
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold border-4 border-slate-50 shadow-sm">3</div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Engage securely</h4>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">Complete our employer verification to build trust, send direct invitations, and manage your hiring pipeline efficiently.</p>
                </div>
              </div>
            </div>
            
            <button onClick={openEmployerPath} className="mt-10 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-4 text-sm font-bold text-white transition hover:bg-emerald-800 shadow-md">
              Start hiring PLM talent <ArrowRight className="h-4 w-4" />
            </button>
          </article>
        </div>
      </div>
    </section>
  );
};
