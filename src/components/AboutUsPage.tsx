import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Building2, 
  ShieldCheck, 
  Compass, 
  BriefcaseBusiness, 
  Network, 
  Sparkles, 
  ChevronRight,
  CheckCircle2,
  Cpu,
  Globe,
  Users,
  Target,
  Award,
  Lock,
  Layers,
  FileCheck,
  Mail
} from 'lucide-react';

interface AboutUsPageProps {
  onOpenRegisterCandidateModal: () => void;
  onOpenRegisterEmployerModal: () => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({
  onOpenRegisterCandidateModal,
  onOpenRegisterEmployerModal,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const corePillars = [
    {
      icon: Target,
      title: '100% PLM-Dedicated Taxonomy',
      desc: 'Generic job sites lump PLM under broad "Software Developer" tags. PLMSpider was built from the ground up around BMIDE, Active Workspace, ITK, Dispatcher, Windchill PDMLink, and 3DEXPERIENCE architectures.',
      color: 'text-[#BA3A2C]',
      bg: 'bg-red-50',
      border: 'border-red-100'
    },
    {
      icon: Lock,
      title: 'Cryptographic Stealth & Privacy',
      desc: 'In specialized engineering circles, privacy is paramount. Professionals control when their personal identity and current corporate employer details are revealed—protecting their standing while exploring top career moves.',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      border: 'border-indigo-100'
    },
    {
      icon: ShieldCheck,
      title: 'Verified Hiring Authority',
      desc: 'Every corporate employer is audited via domain authentication and verification standards. Candidates connect with genuine enterprise programs and direct engineering hiring managers, not spam brokers.',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100'
    },
    {
      icon: Award,
      title: 'Zero Recruiter Commissions',
      desc: 'Traditional staffing agencies extract 20% to 35% markups from budgets. PLMSpider enables direct collaboration between enterprise teams and professionals with zero intermediary fee cuts.',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100'
    }
  ];

  const platformEcosystems = [
    {
      vendor: 'Siemens Digital Industries',
      platforms: 'Teamcenter, Active Workspace (AWC 5/6), BMIDE, ITK, NX, Solid Edge, Teamcenter Manufacturing',
      desc: 'Supporting end-to-end global deployment architectures, CAD integrations, and digital twin implementations.'
    },
    {
      vendor: 'PTC Ecosystem',
      platforms: 'Windchill PDMLink, ProjectLink, ThingWorx IIoT, Creo Parametric, Onshape',
      desc: 'Powering discrete manufacturing, connected product development, and model-based systems engineering.'
    },
    {
      vendor: 'Dassault Systèmes',
      platforms: '3DEXPERIENCE Platform, ENOVIA V6, CATIA V5/V6, SOLIDWORKS PDM Professional',
      desc: 'Enabling unified multi-discipline collaboration from aerospace composites to automotive powertrain assemblies.'
    },
    {
      vendor: 'Open & Enterprise PLM Stacks',
      platforms: 'Aras Innovator, SAP PLM 7.x / ECTR, Oracle Agile PLM, Autodesk Fusion Manage',
      desc: 'Connecting resilient ERP integrations, open PLM frameworks, and agile supply chain change order workflows.'
    }
  ];

  const milestoneStats = [
    { label: 'Ecosystem Alignment', value: '100% PLM' },
    { label: 'Recruiter Commissions', value: '$0' },
    { label: 'Identity Protection', value: 'Complete' },
    { label: 'Supported Platforms', value: '8+ Stacks' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-900 selection:text-white">
      {/* Top Breadcrumb Bar */}
      <div className="border-b border-slate-200 bg-white/90 backdrop-blur-sm sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-bold">About Us</span>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline-block">
            Dedicated To Product Lifecycle Management
          </span>
        </div>
      </div>

      {/* Hero Header Section */}
      <section className="relative bg-gradient-to-b from-white via-slate-50/70 to-slate-50 pt-16 pb-20 border-b border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50/80 px-4 py-1 text-xs font-bold uppercase tracking-[.18em] text-[#BA3A2C] shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-[#BA3A2C]" />
            Purpose-Built For The Global PLM Community
          </span>

          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 max-w-4xl mx-auto leading-[1.12]">
            Architecting the Future of PLM Engineering Talent
          </h1>

          <p className="mt-6 max-w-3xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed">
            PLMSpider was created by engineering software practitioners to solve a persistent industry problem: generalist job boards do not understand product lifecycle management. We provide a focused, secure, and commission-free platform connecting vetted specialists directly with visionary enterprise teams.
          </p>

          {/* Key Stat Cards */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {milestoneStats.map((stat, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs text-center">
                <p className="text-2xl sm:text-3xl font-black text-slate-950">{stat.value}</p>
                <p className="mt-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Origin & Mission Section */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-[.18em] text-[#BA3A2C]">Our Origin & Mission</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-slate-950 leading-tight">
                Why Generic Job Boards Fail Engineering Programs
              </h2>
              <div className="mt-6 space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed">
                <p>
                  Modern engineering organizations build complex physical and cyber-physical systems—from electric powertrains to surgical robotic instruments. Powering these multi-disciplinary programs requires deep configuration knowledge in specialized tools like Siemens Teamcenter, PTC Windchill, and Dassault 3DEXPERIENCE.
                </p>
                <p>
                  Yet, traditional staffing algorithms treat PLM as generic IT or web development. Engineering leaders are inundated with hundreds of unqualified applicants, while accomplished PLM solution architects hesitate to post resumes on public job sites for fear of compromising their current client and employer relationships.
                </p>
                <p className="font-medium text-slate-800">
                  PLMSpider transforms this paradigm. By combining granular skill taxonomies, verified employer credentialing, and candidate-controlled stealth privacy, we foster an ecosystem where engineering talent thrives.
                </p>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onOpenRegisterCandidateModal}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#BA3A2C] px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-red-900/10 hover:bg-[#9E2F23] transition-all cursor-pointer"
                >
                  <Compass className="w-4 h-4" />
                  Join as a Professional
                </button>
                <button
                  onClick={onOpenRegisterEmployerModal}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-800 hover:bg-slate-50 hover:border-slate-400 transition-all shadow-2xs cursor-pointer"
                >
                  <Building2 className="w-4 h-4" />
                  Register as an Employer
                </button>
              </div>
            </div>

            {/* Visual Value Box */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-sm">
              <h3 className="text-xl font-bold text-slate-950 mb-6 flex items-center gap-2.5">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                The PLMSpider Value Guarantee
              </h3>

              <div className="space-y-4">
                {[
                  {
                    title: 'Precision Skill Categorization',
                    desc: 'Filter profiles by specific CAD data models, workflow handlers, dispatchers, and integration layers.'
                  },
                  {
                    title: 'Zero Unsolicited Headhunter Spam',
                    desc: 'Direct invitations from verified enterprises only. No middle recruiters marking up your hourly rate.'
                  },
                  {
                    title: 'Permanent & Contract Pathways',
                    desc: 'Equal support for full-time direct placements, 1099 independent specialists, and corporate C2C agreements.'
                  },
                  {
                    title: 'Engineering Confidentiality',
                    desc: 'Automated current employer domain blocking and skills-first anonymized profiles.'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3.5 bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
                    <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                      <p className="mt-1 text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="py-16 sm:py-24 bg-slate-50/80 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-[.18em] text-[#BA3A2C]">Core Principles</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Built on 4 Unwavering Foundations
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-600">
              Every interface and interaction on PLMSpider is engineered around the realities of enterprise software deployment.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {corePillars.map((pillar, idx) => (
              <div 
                key={idx}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl border ${pillar.border} ${pillar.bg} ${pillar.color} flex items-center justify-center mb-5`}>
                    <pillar.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-950 mb-2.5 leading-snug">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Platforms Grid */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-[.18em] text-[#BA3A2C]">Deep Compatibility</span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-black text-slate-950">
                Specialized Stacks We Support
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md leading-relaxed">
              Our network covers the entire CAD, PLM, ALM, and ERP spectrum utilized across aerospace, automotive, high-tech, and life sciences.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {platformEcosystems.map((eco, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6 sm:p-8 hover:bg-white hover:border-slate-300 hover:shadow-sm transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 rounded-full bg-[#BA3A2C]" />
                  <h3 className="text-lg font-bold text-slate-950">{eco.vendor}</h3>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 mb-3.5">
                  <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                    {eco.platforms}
                  </p>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {eco.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner (Clean Light Theme) */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-red-50/50 via-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-md flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-[.18em] text-[#BA3A2C]">Connect with Us</span>
              <h2 className="mt-2 text-3xl font-black text-slate-950">
                Ready to Experience a Purpose-Built PLM Network?
              </h2>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Whether you are seeking your next senior consulting engagement or looking to scale an enterprise implementation team, PLMSpider is your dedicated home.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
              <button
                onClick={() => navigate('/contact')}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#BA3A2C] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-red-900/10 hover:bg-[#9E2F23] transition-all cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                Contact Advisory
              </button>
              <button
                onClick={() => navigate('/services')}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-800 hover:bg-slate-50 hover:border-slate-400 transition-all shadow-2xs cursor-pointer"
              >
                Explore Services
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
