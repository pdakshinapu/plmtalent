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
    <section id="service-tiles-section" className="border-b border-slate-200 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[#BA3A2C]">Choose your path</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">A network with a clear purpose</h2>
          <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base">Whether you are developing your PLM career or hiring for a product engineering team, start with the workspace built for you.</p>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl gap-5 md:grid-cols-2">
          <article className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:border-blue-300 hover:shadow-lg sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-800"><BriefcaseBusiness className="h-6 w-6" /></div>
            <h3 className="mt-5 text-xl font-bold text-slate-950">For PLM professionals</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">Build a profile around your product lifecycle experience and discover roles that match your skills.</p>
            <ul className="mt-5 space-y-3 text-sm text-slate-700">
              <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />Highlight platforms, modules, CAD tools, and experience</li>
              <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />Explore active roles by employment type and work location</li>
              <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />Track applications and respond to employer invitations</li>
            </ul>
            <button onClick={openCandidatePath} className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-800">Explore PLM opportunities <ArrowRight className="h-4 w-4" /></button>
          </article>

          <article className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:border-emerald-300 hover:shadow-lg sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800"><Building2 className="h-6 w-6" /></div>
            <h3 className="mt-5 text-xl font-bold text-slate-950">For employers</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">Describe your PLM opening, review candidate profiles, and manage your hiring activity in one workspace.</p>
            <ul className="mt-5 space-y-3 text-sm text-slate-700">
              <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />Publish roles with platform, module, and CAD requirements</li>
              <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />Review profiles and manage applications</li>
              <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />Complete the employer verification workflow</li>
            </ul>
            <button onClick={openEmployerPath} className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-800">Find PLM talent <ArrowRight className="h-4 w-4" /></button>
          </article>
        </div>
      </div>
    </section>
  );
};
