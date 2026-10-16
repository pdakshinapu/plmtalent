import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Mail, 
  Phone, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  Building2, 
  Users, 
  HelpCircle, 
  ArrowRight,
  ChevronRight,
  MessageSquare,
  Globe,
  Lock
} from 'lucide-react';

interface ContactPageProps {
  onOpenRegisterCandidateModal: () => void;
  onOpenRegisterEmployerModal: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  onOpenRegisterCandidateModal,
  onOpenRegisterEmployerModal,
}) => {
  const navigate = useNavigate();
  const { submitContactEnquiry } = useApp();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL?.trim() || 'contact@plmspider.com';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const form = event.currentTarget;
    const fields = new FormData(form);
    const name = String(fields.get('name') || '').trim();
    const email = String(fields.get('email') || '').trim();
    const phone = String(fields.get('phone') || '').trim();
    const topic = String(fields.get('topic') || 'General enquiry').trim();
    const plmPlatform = String(fields.get('plmPlatform') || '').trim();
    const rawMessage = String(fields.get('message') || '').trim();

    const fullMessage = plmPlatform 
      ? `[Preferred PLM Ecosystem: ${plmPlatform}]\n\n${rawMessage}`
      : rawMessage;

    try {
      // 1. Store in Firestore database via AppContext
      await submitContactEnquiry({
        name,
        email,
        phone,
        topic,
        message: fullMessage,
      });

      // 2. If client mailto fallback is needed, can be triggered optionally
      if (contactEmail) {
        const subject = encodeURIComponent(`PLMSpider Enquiry: ${topic}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nMobile: ${phone}\nTopic: ${topic}\nPLM Stack: ${plmPlatform}\n\n${rawMessage}`);
        // Only open mail client if user explicitly wants or as gentle fallback
      }

      setIsSuccess(true);
      form.reset();
    } catch (error) {
      setErrorMessage('There was an issue dispatching your enquiry. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      
      {/* BREADCRUMB */}
      <div className="border-b border-slate-200 bg-slate-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-xs text-slate-500">
            <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-semibold">Contact Us</span>
          </nav>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="py-14 sm:py-18 border-b border-slate-200 bg-gradient-to-b from-slate-50/60 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-100 text-[#BA3A2C] text-xs font-bold uppercase tracking-wider mb-4">
              <Mail className="w-4 h-4 text-[#BA3A2C]" />
              <span>Direct Communication Channel</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950 mb-4 leading-[1.15]">
              Let’s Talk <span className="text-[#BA3A2C]">PLM Spider.</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Whether you are an enterprise building a dedicated PLM engineering team, a specialist seeking confidential opportunities, or a systems integrator augmenting delivery benches—we’re here to help.
            </p>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT GRID: CHANNELS (LEFT) + INTERACTIVE FORM (RIGHT) */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            
            {/* LEFT COLUMN: CONTACT INFO & ENTERPRISE SLA (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-7 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#BA3A2C]" />
                    Direct Engineering Support
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                    Connect directly with specialized PLM advisors who understand Teamcenter BMIDE, Windchill, and 3DEXPERIENCE deployments.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                    <div className="w-9 h-9 rounded-xl bg-red-50 text-[#BA3A2C] flex items-center justify-center shrink-0 border border-red-100">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Inquiry</p>
                      <a href={`mailto:${contactEmail}`} className="text-sm font-semibold text-slate-900 hover:text-[#BA3A2C] transition-colors break-all">
                        {contactEmail}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Response Commitment</p>
                      <p className="text-sm font-semibold text-slate-900">Within 24 business hours</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Global PLM Coverage</p>
                      <p className="text-sm font-semibold text-slate-900">US, Canada, Europe, India & APAC</p>
                    </div>
                  </div>
                </div>

                {/* FAQ QUICK LINK CALLOUT */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-[#BA3A2C] shrink-0" />
                    <span>Have common questions regarding fees or privacy?</span>
                  </div>
                  <Link 
                    to="/faq" 
                    className="font-bold text-[#BA3A2C] hover:text-[#9E2F23] flex items-center gap-1 shrink-0"
                  >
                    <span>Read FAQ</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* ENTERPRISE TRUST CARD */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Audited Enterprise Network</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  All employer requests are handled under strict confidentiality agreements. Your proprietary tech stacks and recruitment forecasts are never shared publicly.
                </p>
              </div>

            </div>

            {/* RIGHT COLUMN: INTERACTIVE FORM (7 cols) */}
            <div className="lg:col-span-7">
              {isSuccess ? (
                <div className="rounded-3xl border border-emerald-200 bg-white p-8 sm:p-12 text-center shadow-sm flex flex-col items-center justify-center space-y-5 animate-in fade-in duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100 shadow-xs">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-950">Message Stored & Dispatched!</h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out to PLMSpider. Your inquiry has been logged securely in our system. A dedicated member of our PLM team will review your requirements and respond shortly.
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setIsSuccess(false)}
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-xs sm:text-sm font-bold text-white hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Send Another Message</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl border border-slate-200 bg-white p-7 sm:p-10 shadow-sm">
                  <div className="mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-950">Submit an Enquiry</h2>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">
                      Complete the form below and we will route your request to the appropriate specialist team.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label className="block text-xs font-semibold text-slate-700">
                        Full Name <span className="text-[#BA3A2C] font-bold">*</span>
                        <input
                          name="name"
                          required
                          autoComplete="name"
                          placeholder="e.g., Alex Walker"
                          className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-3 text-sm text-slate-900 font-normal outline-none transition focus:border-[#BA3A2C] focus:ring-2 focus:ring-[#BA3A2C]/15"
                        />
                      </label>

                      <label className="block text-xs font-semibold text-slate-700">
                        Work / Personal Email <span className="text-[#BA3A2C] font-bold">*</span>
                        <input
                          name="email"
                          type="email"
                          required
                          autoComplete="email"
                          placeholder="alex@enterprise.com"
                          className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-3 text-sm text-slate-900 font-normal outline-none transition focus:border-[#BA3A2C] focus:ring-2 focus:ring-[#BA3A2C]/15"
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label className="block text-xs font-semibold text-slate-700">
                        Mobile / Phone Number <span className="text-[#BA3A2C] font-bold">*</span>
                        <input
                          name="phone"
                          type="tel"
                          required
                          autoComplete="tel"
                          placeholder="+1 (555) 000-0000"
                          className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-3 text-sm text-slate-900 font-normal outline-none transition focus:border-[#BA3A2C] focus:ring-2 focus:ring-[#BA3A2C]/15"
                        />
                      </label>

                      <label className="block text-xs font-semibold text-slate-700">
                        What can we assist with? <span className="text-[#BA3A2C] font-bold">*</span>
                        <select
                          name="topic"
                          required
                          className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 font-normal outline-none transition focus:border-[#BA3A2C] focus:ring-2 focus:ring-[#BA3A2C]/15 cursor-pointer"
                        >
                          <option value="Hiring PLM talent">Hiring PLM Talent (Enterprise)</option>
                          <option value="Finding a PLM role">Finding a PLM Role (Candidate)</option>
                          <option value="Consultancy or partnership">Consultancy or SI Partnership</option>
                          <option value="Platform support & verification">Platform Support & Verification</option>
                          <option value="General enquiry">General Enquiry</option>
                        </select>
                      </label>
                    </div>

                    <label className="block text-xs font-semibold text-slate-700">
                      Primary PLM Platform of Interest <span className="text-slate-400 font-normal">(Optional)</span>
                      <select
                        name="plmPlatform"
                        className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 font-normal outline-none transition focus:border-[#BA3A2C] focus:ring-2 focus:ring-[#BA3A2C]/15 cursor-pointer"
                      >
                        <option value="">Select Platform or Ecosystem...</option>
                        <option value="Siemens Teamcenter / AWC">Siemens Teamcenter / Active Workspace</option>
                        <option value="PTC Windchill / ThingWorx">PTC Windchill / ThingWorx</option>
                        <option value="Dassault 3DEXPERIENCE / ENOVIA">Dassault 3DEXPERIENCE / ENOVIA</option>
                        <option value="Aras Innovator">Aras Innovator</option>
                        <option value="SAP PLM / ECTR">SAP PLM / ECTR</option>
                        <option value="Multi-CAD Integrations">Multi-CAD Integrations (NX, Creo, CATIA)</option>
                        <option value="Other">Other / Multi-Platform</option>
                      </select>
                    </label>

                    <label className="block text-xs font-semibold text-slate-700">
                      Your Message or Requirements <span className="text-[#BA3A2C] font-bold">*</span>
                      <textarea
                        name="message"
                        required
                        rows={5}
                        placeholder="Please describe your project, hiring requirements, or questions..."
                        className="mt-1.5 w-full resize-y rounded-xl border border-slate-300 px-3.5 py-3 text-sm text-slate-900 font-normal outline-none transition focus:border-[#BA3A2C] focus:ring-2 focus:ring-[#BA3A2C]/15"
                      />
                    </label>

                    {errorMessage && (
                      <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700 font-medium">
                        {errorMessage}
                      </div>
                    )}

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#BA3A2C] px-8 py-3.5 text-sm font-bold text-white transition hover:bg-[#9E2F23] disabled:opacity-60 shadow-md shadow-red-900/10 cursor-pointer"
                      >
                        <Send className="h-4 w-4" />
                        <span>{isSubmitting ? 'Saving enquiry...' : 'Submit Message'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* QUICK ONBOARDING CALLOUT */}
      <section className="py-14 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-slate-950">Looking to join immediately?</h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                You can create a candidate profile or apply for verified employer credentials right away.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenRegisterCandidateModal}
                className="px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer"
              >
                Join as Candidate
              </button>
              <button
                onClick={onOpenRegisterEmployerModal}
                className="px-5 py-2.5 rounded-xl bg-[#BA3A2C] text-white text-xs font-bold hover:bg-[#9E2F23] transition-colors shadow-sm cursor-pointer"
              >
                Verified Employer Access
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
