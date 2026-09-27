import React from 'react';
import { ArchitectureDiagram } from './ArchitectureDiagram';
import { UserFlowsVisual } from './UserFlowsVisual';
import { KeyModulesSection } from './KeyModulesSection';
import { InteractiveERDiagram } from './InteractiveERDiagram';
import { EngineeringSkillsLayer } from './EngineeringSkillsLayer';
import { DevelopmentRoadmap } from './DevelopmentRoadmap';
import { Architecture3DCanvas } from './Architecture3DCanvas';
import { 
  Sparkles, 
  Layers, 
  Box, 
  Cpu, 
  Cloud, 
  Key, 
  ShieldCheck, 
  BarChart3, 
  ArrowRight, 
  Compass, 
  Building2,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SystemArchitectureSectionProps {
  onOpenCandidateModal?: () => void;
  onOpenEmployerModal?: () => void;
}

export const SystemArchitectureSection: React.FC<SystemArchitectureSectionProps> = ({
  onOpenCandidateModal,
  onOpenEmployerModal,
}) => {
  const navigate = useNavigate();

  const heroBadges = [
    { label: 'PLM', color: '#06b6d4' },
    { label: 'CAD', color: '#3b82f6' },
    { label: 'AI', color: '#f97316' },
    { label: 'CLOUD', color: '#a855f7' },
    { label: 'API', color: '#10b981' },
    { label: 'SECURITY', color: '#f59e0b' },
    { label: 'ANALYTICS', color: '#ec4899' },
  ];

  return (
    <div id="system-architecture" className="relative bg-[#050B17] text-slate-100 overflow-hidden">
      
      {/* Seamless Transition Border */}
      <div className="relative w-full h-24 bg-gradient-to-b from-[#05070B] to-[#050B17] pointer-events-none flex items-center justify-center">
        <div className="w-3/4 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      </div>

      {/* Global Background Ambient Lighting & Grids */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(59, 130, 246, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(59, 130, 246, 0.08) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute top-1/4 left-10 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[150px]" />
        <div className="absolute top-2/3 right-10 w-[500px] h-[500px] rounded-full bg-cyan-600/10 blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-24 sm:space-y-32">
        
        {/* ========================================================================= */}
        {/* SECTION 1: ARCHITECTURE HERO (Exact Title & Subtitle + 3D Visual) */}
        {/* ========================================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-7 space-y-5">
            {/* System Status Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-950/40 text-blue-300 text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span>HIGH LEVEL ARCHITECTURE & DEVELOPMENT OVERVIEW (PHASE 1)</span>
            </div>

            {/* Preserved Title */}
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.12]">
              PLM & CAD Job Platform{' '}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent block sm:inline">
                – System Architecture
              </span>
            </h2>

            {/* Preserved Secondary Heading */}
            <p className="text-lg sm:text-xl font-bold text-slate-200">
              Scalable Architecture. Connected Engineering Ecosystem.
            </p>

            {/* Preserved Description */}
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl font-normal">
              An enterprise-ready architecture connecting professionals, employers and administrators through a secure, scalable PLM and CAD technology platform. Built for high concurrency, verifiable credentials, and deep domain matching.
            </p>

            {/* Technology Badges */}
            <div className="pt-2 flex flex-wrap gap-2">
              {heroBadges.map((badge, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold tracking-wider uppercase border"
                  style={{
                    color: badge.color,
                    borderColor: `${badge.color}40`,
                    backgroundColor: `${badge.color}15`,
                  }}
                >
                  {badge.label}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column: 3D Architecture Visual */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-[420px] aspect-square">
              <Architecture3DCanvas className="w-full h-full shadow-2xl" />
            </div>
          </div>

        </section>


        {/* ========================================================================= */}
        {/* SECTION 2: INTERACTIVE HIGH-LEVEL TOPOLOGY DIAGRAM */}
        {/* ========================================================================= */}
        <section>
          <ArchitectureDiagram />
        </section>


        {/* ========================================================================= */}
        {/* SECTION 3: USER FLOWS (Professional, Employer with Admin Approval, Admin) */}
        {/* ========================================================================= */}
        <section>
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-950/30 text-blue-300 text-xs font-semibold mb-2">
              <Compass className="w-3.5 h-3.5 text-blue-400" />
              <span>Multi-Role Operational Flows</span>
            </div>
            <h3 className="text-3xl font-black text-white tracking-tight">
              Platform Workflow & Governance Chains
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Clear segregation of duty: instant candidate access, strict employer verification, and superuser governance.
            </p>
          </div>

          <UserFlowsVisual />
        </section>


        {/* ========================================================================= */}
        {/* SECTION 4: KEY MODULES (PHASE 1 CORE CAPABILITIES) */}
        {/* ========================================================================= */}
        <section>
          <KeyModulesSection />
        </section>


        {/* ========================================================================= */}
        {/* SECTION 5: DATABASE SCHEMA REDESIGN (INTERACTIVE ER DIAGRAM) */}
        {/* ========================================================================= */}
        <section>
          <InteractiveERDiagram />
        </section>


        {/* ========================================================================= */}
        {/* SECTION 6: PLM & CAD SKILL ECOSYSTEM LAYER */}
        {/* ========================================================================= */}
        <section>
          <EngineeringSkillsLayer />
        </section>


        {/* ========================================================================= */}
        {/* SECTION 7: DEVELOPMENT ROADMAP (PHASE 1 - 4 + PHASE 5 FUTURE AI HORIZON) */}
        {/* ========================================================================= */}
        <section>
          <DevelopmentRoadmap />
        </section>


        {/* ========================================================================= */}
        {/* SECTION 8: FINAL ARCHITECTURE CTA */}
        {/* ========================================================================= */}
        <section className="relative rounded-3xl border border-blue-500/30 bg-gradient-to-br from-[#091326] via-[#0E1D3B] to-[#081224] p-8 sm:p-14 text-center overflow-hidden shadow-2xl">
          {/* Subtle radial glow */}
          <div 
            className="pointer-events-none absolute inset-0 opacity-25"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.4) 0%, transparent 65%)`,
            }}
          />

          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/40 bg-blue-950/60 text-blue-300 text-xs font-bold font-mono tracking-wider mb-5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>ENTERPRISE ARCHITECTURE • SCALABLE • SECURE</span>
            </div>

            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              BUILD THE FUTURE OF ENGINEERING TALENT
            </h3>

            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
              Connect professionals, employers and engineering technologies through one intelligent PLM and CAD ecosystem.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => {
                  if (onOpenCandidateModal) {
                    onOpenCandidateModal();
                  } else {
                    navigate('/job-seeker');
                  }
                }}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer group"
              >
                <Compass className="w-4 h-4 text-blue-100" />
                <span>Explore Platform</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <a
                href="#engineering-ecosystem"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Explore Technology Ecosystem</span>
              </a>

              <button
                onClick={() => {
                  if (onOpenEmployerModal) {
                    onOpenEmployerModal();
                  } else {
                    navigate('/job-provider');
                  }
                }}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-slate-400" />
                <span>Talk to Our Team</span>
              </button>
            </div>
          </div>
        </section>

      </div>

      {/* Transition Out Portal back to light landing page footer/sections */}
      <div className="relative w-full h-24 bg-gradient-to-b from-[#050B17] via-slate-900 to-slate-50 pointer-events-none mt-16" />

    </div>
  );
};
