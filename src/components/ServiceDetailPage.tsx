import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { SERVICE_DETAILS, ServiceDetail } from '../data/serviceDetailsData';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Compass, 
  Building2, 
  Network, 
  GraduationCap, 
  BriefcaseBusiness, 
  HelpCircle,
  Mail,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ServiceDetailPageProps {
  onOpenRegisterCandidateModal: () => void;
  onOpenRegisterEmployerModal: () => void;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({
  onOpenRegisterCandidateModal,
  onOpenRegisterEmployerModal,
}) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { userSession } = useApp();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const service: ServiceDetail | undefined = slug ? SERVICE_DETAILS[slug] : undefined;

  if (!service) {
    return (
      <div className="min-h-screen bg-slate-50 py-24 px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h1 className="text-2xl font-black text-slate-900">Service Not Found</h1>
          <p className="mt-3 text-sm text-slate-600">The requested PLM service domain does not exist.</p>
          <button
            onClick={() => navigate('/services')}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#BA3A2C] text-white text-xs font-bold hover:bg-[#9E2F23] transition-colors shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Services Overview</span>
          </button>
        </div>
      </div>
    );
  }

  const handlePrimaryAction = () => {
    if (service.primaryActionRole === 'candidate') {
      if (userSession?.role === 'candidate') navigate('/job-seeker');
      else if (userSession) navigate('/job-seeker');
      else onOpenRegisterCandidateModal();
    } else if (service.primaryActionRole === 'employer') {
      if (userSession?.role === 'employer') navigate('/job-provider');
      else if (userSession) navigate('/job-provider');
      else onOpenRegisterEmployerModal();
    } else {
      navigate('/contact');
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-slate-900 selection:text-white">
      
      {/* TOP BREADCRUMB NAVIGATION BAR */}
      <div className="border-b border-slate-200 bg-slate-50/80 backdrop-blur-sm sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link to="/services" className="hover:text-slate-900 transition-colors">Services</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-bold truncate max-w-[200px] sm:max-w-xs">{service.title}</span>
          </div>

          <button
            onClick={() => navigate('/services')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Services</span>
          </button>
        </div>
      </div>

      {/* HERO SECTION WITH TOP ACCENT */}
      <section className="relative pt-12 pb-16 border-b border-slate-100 bg-gradient-to-b from-slate-50 via-white to-white overflow-hidden">
        <div 
          className="absolute top-0 left-0 right-0 h-2" 
          style={{ backgroundColor: service.accentColor }} 
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-2xs ${service.themeBg}`}>
              <Sparkles className="w-3.5 h-3.5" />
              {service.badge}
            </span>

            <h1 className="mt-5 text-4xl sm:text-5xl font-black tracking-tight text-slate-950 leading-[1.12]">
              {service.title}
            </h1>

            <p className="mt-4 text-lg font-semibold text-slate-700">
              {service.subtitle}
            </p>

            <p className="mt-4 text-base leading-relaxed text-slate-600">
              {service.heroDescription}
            </p>

            {/* ACTION BUTTONS */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <button
                onClick={handlePrimaryAction}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:opacity-95 hover:gap-2.5 cursor-pointer"
                style={{ backgroundColor: service.accentColor }}
              >
                <span>{service.primaryCtaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('/contact')}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-5 py-3.5 text-sm font-bold text-slate-800 transition-all cursor-pointer shadow-xs"
              >
                <Mail className="w-4 h-4 text-slate-500" />
                <span>Request Custom Consultation</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* METRICS STRIP */}
      <section className="bg-slate-50 border-b border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {service.metrics.map((metric, index) => (
              <div key={index} className="p-2">
                <div className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                  {metric.value}
                </div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN CONTENT GRID: OVERVIEW & AUDIENCE */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* LEFT 2 COLS: OVERVIEW & KEY CAPABILITIES */}
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="text-2xl font-black text-slate-950 tracking-tight">
                Service Domain Architecture
              </h2>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-600">
                {service.overview}
              </p>
            </div>

            {/* KEY CAPABILITIES */}
            <div>
              <h3 className="text-xl font-bold text-slate-950 tracking-tight mb-6">
                Key Technical Capabilities
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {service.keyCapabilities.map((cap, i) => (
                  <div key={i} className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs hover:border-slate-300 transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: service.accentColor }} />
                      <h4 className="text-sm font-bold text-slate-900">{cap.title}</h4>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-600">
                      {cap.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* DELIVERABLES & OUTCOMES */}
            <div>
              <h3 className="text-xl font-bold text-slate-950 tracking-tight mb-4">
                Guaranteed Deliverables & Outcomes
              </h3>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 space-y-3">
                {service.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                    <span className="text-xs sm:text-sm text-slate-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ FOR THIS SERVICE */}
            <div>
              <h3 className="text-xl font-bold text-slate-950 tracking-tight mb-5 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#BA3A2C]" />
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                {service.faq.map((item, idx) => (
                  <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
                    <h4 className="text-sm font-bold text-slate-900">{item.question}</h4>
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT SIDEBAR: AUDIENCE & PLATFORMS */}
          <div className="space-y-6 lg:sticky lg:top-32 h-fit">
            
            {/* Navigation & Contact Sidebar */}
            <div className="rounded-2xl bg-[#0b274c] p-6 sm:p-8 text-white shadow-xl">
              <h3 className="text-2xl font-black mb-6 tracking-tight">How May We Help You?</h3>
              <div className="flex flex-col">
                {Object.values(SERVICE_DETAILS).map((other, idx, arr) => {
                  const isActive = other.slug === service.slug;
                  if (isActive) return null;
                  
                  return (
                    <div key={other.slug} className={`border-b border-slate-700/50 py-4 ${idx === 0 ? 'pt-0' : ''}`}>
                      <Link
                        to={`/services/${other.slug}`}
                        className="text-[11px] font-bold uppercase tracking-widest text-slate-300 hover:text-white transition-colors block leading-relaxed"
                      >
                        {other.title}
                      </Link>
                    </div>
                  );
                })}
              </div>
              <div className="mt-8 pt-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-3">Direct Contact</p>
                <p className="text-xl font-black text-white mb-1 tracking-tight">+1 (888) 800-4PLM</p>
                <a href="mailto:contact@plmspider.com" className="text-sm font-bold text-[#e65c4f] hover:text-[#ff786b] hover:underline transition-colors block">
                  contact@plmspider.com
                </a>
              </div>
            </div>
            
            {/* Target Audience Box */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 mb-4">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Target Audience & Roles
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-600">
                {service.targetAudience.map((aud, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 mt-1.5" />
                    <span>{aud}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Supported Platforms Box */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 mb-4">
                <Network className="w-4 h-4 text-emerald-600" />
                Supported Technology Stacks
              </h3>
              <div className="flex flex-wrap gap-2">
                {service.supportedPlatforms.map((plat, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
                    {plat}
                  </span>
                ))}
              </div>
            </div>

            {/* Direct CTA Box - Light Theme */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 text-center shadow-md">
              <h4 className="text-base font-bold text-slate-950">Ready to Get Started?</h4>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Connect with the PLMSpider network today and access verified enterprise opportunities.
              </p>
              <button
                onClick={handlePrimaryAction}
                className="mt-5 w-full py-3 rounded-xl font-bold text-xs bg-[#BA3A2C] hover:bg-[#9E2F23] text-white transition-all shadow-md cursor-pointer"
              >
                {service.primaryCtaText}
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* BOTTOM OTHER SERVICES EXPLORER */}
      <section className="py-14 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-950">Explore Other Services</h3>
              <p className="text-xs text-slate-500 mt-1">Discover all 6 specialized PLM domains</p>
            </div>
            <button
              onClick={() => navigate('/services')}
              className="text-xs font-bold text-[#BA3A2C] hover:underline"
            >
              View all services →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.values(SERVICE_DETAILS)
              .filter((s) => s.slug !== service.slug)
              .slice(0, 3)
              .map((other) => (
                <Link
                  key={other.slug}
                  to={`/services/${other.slug}`}
                  className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {other.badge}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-950 group-hover:text-[#BA3A2C] transition-colors">
                      {other.title}
                    </h4>
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {other.heroDescription}
                    </p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-slate-900 group-hover:text-[#BA3A2C]">
                    <span>Learn more</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              ))}
          </div>
        </div>
      </section>

    </div>
  );
};
