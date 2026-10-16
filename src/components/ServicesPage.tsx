import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Building2, 
  ShieldCheck, 
  Compass, 
  BriefcaseBusiness, 
  Network, 
  GraduationCap, 
  Sparkles, 
  ChevronRight,
  CheckCircle2,
  ArrowUpRight
} from 'lucide-react';
import { SERVICE_DETAILS, ServiceDetail } from '../data/serviceDetailsData';

interface ServicesPageProps {
  onOpenRegisterCandidateModal: () => void;
  onOpenRegisterEmployerModal: () => void;
}

const serviceIconMap: Record<string, React.ElementType> = {
  'resource-sourcing': Building2,
  'vetting-assessment': ShieldCheck,
  'profile-search': Compass,
  'professional-profiles': BriefcaseBusiness,
  'opportunity-search': Network,
  'opportunity-posting': Building2,
  'staffing-strategy': GraduationCap,
};

const serviceBorderMap: Record<string, string> = {
  'resource-sourcing': 'bg-[#BA3A2C]',
  'vetting-assessment': 'bg-[#059669]',
  'profile-search': 'bg-[#4F46E5]',
  'professional-profiles': 'bg-[#0284C7]',
  'opportunity-search': 'bg-[#9333EA]',
  'opportunity-posting': 'bg-[#0D9488]',
  'staffing-strategy': 'bg-[#EA580C]',
};

export const ServicesPage: React.FC<ServicesPageProps> = ({
  onOpenRegisterEmployerModal,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const servicesList = Object.values(SERVICE_DETAILS);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-900 selection:text-white">
      {/* Top Breadcrumb Bar */}
      <div className="border-b border-slate-200 bg-white/90 backdrop-blur-sm sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-bold">Services</span>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline-block">
            {servicesList.length} Dedicated PLM Domains
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-white via-slate-50 to-slate-50 pt-14 pb-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50/80 px-4 py-1 text-xs font-bold uppercase tracking-[.18em] text-[#BA3A2C]">
            <Sparkles className="h-3.5 w-3.5 text-[#BA3A2C]" />
            Enterprise PLM Capabilities
          </span>

          <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 max-w-4xl mx-auto leading-tight">
            Specialized Services for Product Lifecycle Management
          </h1>

          <p className="mt-5 max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed">
            End-to-end talent sourcing, technical vetting, targeted discovery, and team advisory engineered specifically for engineering enterprise environments.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100% PLM-Focused
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Direct Connections
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Verified Domain Competency
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> $0 Recruiter Markups
            </span>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.18em] text-[#BA3A2C]">Our Offerings</p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-black text-slate-950">
                Explore Available Services
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md leading-relaxed">
              Click any service to view comprehensive specifications, supported platforms, delivery roadmaps, and actionable insights.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {servicesList.map((service: ServiceDetail) => {
              const IconComponent = serviceIconMap[service.slug] || Building2;
              const topBorderColor = serviceBorderMap[service.slug] || 'bg-[#BA3A2C]';

              return (
                <div
                  key={service.slug}
                  onClick={() => navigate(`/services/${service.slug}`)}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:border-slate-300 relative overflow-hidden group cursor-pointer"
                >
                  {/* Top Accent Strip */}
                  <div className={`absolute top-0 left-0 right-0 h-1.5 ${topBorderColor}`} />

                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border group-hover:scale-105 transition-transform ${service.themeBg}`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200/60">
                        {service.badge}
                      </span>
                    </div>

                    {/* Title & Subtitle */}
                    <h3 className="mt-4 text-lg font-bold text-slate-950 group-hover:text-[#BA3A2C] transition-colors leading-snug">
                      {service.title}
                    </h3>
                    <p className="mt-1 text-xs font-medium text-slate-500">
                      {service.subtitle}
                    </p>

                    {/* Description */}
                    <p className="mt-3.5 text-xs sm:text-sm leading-relaxed text-slate-600 line-clamp-3">
                      {service.heroDescription}
                    </p>

                    {/* Key Capabilities Preview */}
                    {service.keyCapabilities && service.keyCapabilities.length > 0 && (
                      <div className="mt-5 pt-4 border-t border-slate-100 space-y-1.5">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Key Features</p>
                        {service.keyCapabilities.slice(0, 2).map((cap, capIdx) => (
                          <div key={capIdx} className="flex items-start gap-2 text-xs text-slate-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                            <span className="line-clamp-1">{cap.title}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer Action */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-900 group-hover:text-[#BA3A2C] transition-colors flex items-center gap-1.5">
                      <span>View details</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-red-50 group-hover:text-[#BA3A2C] transition-colors">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Outcomes Banner - Light Theme */}
          <div className="mt-16 bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-md overflow-hidden relative">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-[.18em] text-[#BA3A2C]">Measurable Value</span>
                <h2 className="text-3xl font-black text-slate-950 mt-2 mb-6">Program Outcomes</h2>
                <ul className="space-y-4">
                  {[
                    'Faster access to proven PLM expertise across Teamcenter, Windchill, and 3DEXPERIENCE',
                    'Lower hiring and staffing risk through verified hands-on capability assessments',
                    'Better-matched teams and significantly higher enterprise program success rates'
                  ].map((outcome, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-50 text-[#BA3A2C] border border-red-100 shrink-0 mt-0.5">
                        <CheckCircle2 className="h-4 w-4 text-[#BA3A2C]" />
                      </div>
                      <span className="text-slate-700 font-medium text-base sm:text-lg">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-7 sm:p-8">
                <h3 className="text-2xl font-bold text-slate-950 mb-3">Ready to talk about PLM Professionals?</h3>
                <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                  Connect with a PLM advisory specialist about how we can help you find, screen, and deploy top engineering talent for your product development programs.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => navigate('/contact')}
                    className="bg-[#BA3A2C] hover:bg-[#9E2F23] text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    Contact Us <ArrowRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={onOpenRegisterEmployerModal}
                    className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                  >
                    Post an Opportunity
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Competencies Section */}
          <div className="mt-16">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#BA3A2C] mb-6">Explore Other Competencies</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                'Product Lifecycle Management',
                'AI for PLM, NPD and Innovation',
                'New Product Development',
                'Innovation',
                'Digital Transformation',
                'Configuration Management',
                'Modularization',
                'Organizational Change Management'
              ].map((comp, idx) => (
                <div 
                  key={idx} 
                  className="bg-white p-5 border border-slate-200 rounded-xl hover:border-[#BA3A2C] hover:shadow-md transition-all group flex flex-col justify-center min-h-[90px] text-center"
                >
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#BA3A2C] leading-snug transition-colors">{comp}</h4>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};
