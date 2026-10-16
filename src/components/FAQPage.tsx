import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Search, 
  ChevronDown, 
  HelpCircle, 
  ShieldCheck, 
  Lock, 
  Building2, 
  Users, 
  Cpu, 
  ArrowRight, 
  Mail, 
  CheckCircle2,
  FileQuestion,
  ChevronRight,
  PhoneCall
} from 'lucide-react';

interface FAQPageProps {
  onOpenRegisterCandidateModal: () => void;
  onOpenRegisterEmployerModal: () => void;
}

interface FAQItem {
  id: string;
  category: 'general' | 'candidates' | 'employers' | 'ecosystem';
  q: string;
  a: string;
  tags: string[];
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 'diff-regular-boards',
    category: 'general',
    q: 'What makes PLMSpider fundamentally different from regular job boards?',
    a: 'Traditional job boards classify PLM under generic "Software Developer" or "IT" tags, where 95%+ of applicants lack CAD/PLM lifecycle context. PLMSpider is 100% dedicated to PLM architectures (Siemens Teamcenter, PTC Windchill, Dassault 3DEXPERIENCE, Aras Innovator). Every profile, filter, and taxonomy is engineered around BMIDE, Active Workspace, ITK, Dispatcher, and CAD connectors with zero recruiter spam.',
    tags: ['difference', 'boards', 'taxonomy', 'general']
  },
  {
    id: 'recruiter-fees',
    category: 'employers',
    q: 'Are there any placement commissions or recruiter cuts?',
    a: 'No. Unlike traditional recruiting agencies that charge 20% to 35% markups on candidate annual compensation, PLMSpider provides direct enterprise-to-candidate collaboration. Employers connect directly with talent, schedule technical evaluations, and hire without third-party commission surcharges.',
    tags: ['commission', 'pricing', 'fees', 'recruiter', 'cost']
  },
  {
    id: 'candidate-privacy',
    category: 'candidates',
    q: 'How does candidate cryptographic stealth and privacy protection work?',
    a: 'Your personal identifying details (full name, personal email, phone number, and current employer company name) are completely masked while your technical capabilities, modules, years of experience, and credentials remain discoverable. You retain 100% control: only when you explicitly accept a verified employer’s job invitation are your contact details unlocked.',
    tags: ['privacy', 'stealth', 'anonymity', 'masking', 'candidate']
  },
  {
    id: 'employer-verification',
    category: 'employers',
    q: 'How are employer organizations verified before they can contact talent?',
    a: 'Every hiring organization undergoes domain and administrative verification. We ensure that candidates only interact with legitimate engineering enterprises, systems integrators, and verified corporate talent acquisition leaders—blocking unauthorized headhunters and data scrapers.',
    tags: ['verification', 'employers', 'security', 'vetting']
  },
  {
    id: 'supported-plm-stacks',
    category: 'ecosystem',
    q: 'Which PLM platforms, modules, and CAD environments are supported?',
    a: 'PLMSpider supports the entire modern engineering ecosystem: Siemens Teamcenter (Active Workspace 5.x/6.x, BMIDE, ITK, RAC, Dispatcher, Teamcenter Manufacturing), PTC Windchill (PDMLink, ProjectLink, ThingWorx IIoT, MPMLink), Dassault Systèmes 3DEXPERIENCE & ENOVIA V6, Aras Innovator, SAP PLM 7.x/ECTR, Oracle Agile PLM, Arena PLM, and CAD integrations (NX, Creo, CATIA, SolidWorks, Inventor).',
    tags: ['platforms', 'teamcenter', 'windchill', '3dexperience', 'aras', 'cad']
  },
  {
    id: 'consulting-firms',
    category: 'employers',
    q: 'Can consulting practices, SIs, and staffing teams use PLMSpider?',
    a: 'Yes. Engineering service providers, systems integrators, and specialized PLM consultancies use PLMSpider to augment project delivery benches, staff urgent multi-site migrations, and engage verified 1099, C2C, or full-time solution architects across North America, Europe, and APAC.',
    tags: ['consulting', 'integrators', 'c2c', 'contractors', 'services']
  },
  {
    id: 'profile-setup-candidate',
    category: 'candidates',
    q: 'How long does it take for a candidate to build a verified profile?',
    a: 'Creating your PLMSpider profile takes less than 3 minutes. You can select your core platforms, specialized modules, certifications, and target compensation. You can upload your resume, and choose whether to enable instant stealth mode to conceal current employer ties.',
    tags: ['candidate', 'profile', 'setup', 'resume']
  },
  {
    id: 'direct-invitations',
    category: 'general',
    q: 'How does the Direct Connection and Job Invitation workflow operate?',
    a: 'Verified employers browse filtered candidate profiles matched to specific technical requisitions (e.g., AWC 6.2 customization). They dispatch a formal Job Invitation detailing compensation, remote status, and responsibilities. The candidate receives an alert, evaluates the role, and upon acceptance, direct verified contact channels open.',
    tags: ['workflow', 'invitations', 'connections', 'matching']
  },
  {
    id: 'current-employer-block',
    category: 'candidates',
    q: 'Can I automatically prevent my current employer from viewing my profile?',
    a: 'Yes. Our stealth settings include automated domain-level blocking. You can specify your current corporate employer or parent conglomerate, ensuring their verified accounts cannot discover or view your candidate records.',
    tags: ['block', 'current employer', 'stealth', 'safety']
  },
  {
    id: 'dedicated-services',
    category: 'ecosystem',
    q: 'Where can I learn more about specific PLM Spider talent pathways and services?',
    a: 'You can explore our dedicated Services & Pathways page (/services), which breaks down specialized pathways including Direct Talent Sourcing, Enterprise Candidate Screening, Solution Architecture Consultation, and Migration Specialization with comprehensive technical specs.',
    tags: ['services', 'pathways', 'specs', 'details']
  }
];

export const FAQPage: React.FC<FAQPageProps> = ({
  onOpenRegisterCandidateModal,
  onOpenRegisterEmployerModal,
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'general' | 'candidates' | 'employers' | 'ecosystem'>('all');
  const [openFaqId, setOpenFaqId] = useState<string | null>('diff-regular-boards');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesQuery = 
        item.q.toLowerCase().includes(q) || 
        item.a.toLowerCase().includes(q) ||
        item.tags.some(t => t.toLowerCase().includes(q));

      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  const toggleFaq = (id: string) => {
    setOpenFaqId(prev => prev === id ? null : id);
  };

  const categories = [
    { id: 'all', label: 'All Questions', count: FAQ_DATA.length },
    { id: 'general', label: 'General & Platform', count: FAQ_DATA.filter(f => f.category === 'general').length },
    { id: 'candidates', label: 'Candidates & Privacy', count: FAQ_DATA.filter(f => f.category === 'candidates').length },
    { id: 'employers', label: 'Enterprise & Hiring', count: FAQ_DATA.filter(f => f.category === 'employers').length },
    { id: 'ecosystem', label: 'PLM Tech & Ecosystem', count: FAQ_DATA.filter(f => f.category === 'ecosystem').length },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      
      {/* BREADCRUMB & HEADER */}
      <div className="border-b border-slate-200 bg-slate-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-xs text-slate-500">
            <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-semibold">Frequently Asked Questions</span>
          </nav>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="relative py-16 sm:py-20 border-b border-slate-200 bg-gradient-to-b from-slate-50/50 via-white to-white overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-100 text-[#BA3A2C] text-xs font-bold uppercase tracking-wider mb-5">
            <Sparkles className="w-4 h-4 text-[#BA3A2C]" />
            <span>Knowledge Base & Support</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950 mb-5 leading-[1.15]">
            Frequently Asked <span className="text-[#BA3A2C]">Questions</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
            Learn how PLMSpider delivers cryptographic privacy for specialists, zero-commission hiring for enterprises, and direct connections across Siemens, PTC, Dassault, and Aras ecosystems.
          </p>

          {/* SEARCH BOX */}
          <div className="relative max-w-2xl mx-auto">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions (e.g., privacy, Teamcenter, commission, verification)..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-300 bg-white shadow-sm text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#BA3A2C] focus:ring-2 focus:ring-[#BA3A2C]/15 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 text-xs font-semibold text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY TABS & FAQ LIST */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* CATEGORY TABS */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
            {categories.map(cat => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                    isActive 
                      ? 'bg-slate-900 text-white shadow-sm' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[11px] ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* FAQ ACCORDION LIST */}
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-16 px-4 bg-slate-50 rounded-3xl border border-slate-200">
              <FileQuestion className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-900">No questions match your search</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-5">
                Try searching for broader terms like "privacy", "fees", "Teamcenter", or reach out to our team directly.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredFaqs.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isOpen 
                        ? 'border-[#BA3A2C]/30 bg-white shadow-sm ring-1 ring-[#BA3A2C]/10' 
                        : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base hover:text-[#BA3A2C] transition-colors cursor-pointer"
                    >
                      <span className="leading-snug">{faq.q}</span>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isOpen ? 'bg-red-50 text-[#BA3A2C]' : 'bg-slate-100 text-slate-500'
                      }`}>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/40">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* QUICK VALUE GUARANTEES */}
      <section className="py-12 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-red-50 text-[#BA3A2C] border border-red-100">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">$0 Recruiter Fees</h4>
                <p className="text-xs text-slate-500 mt-0.5">Direct hiring connections with zero percentage markups.</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Stealth Mode</h4>
                <p className="text-xs text-slate-500 mt-0.5">Discreet career moves with candidate-controlled reveals.</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Verified Employers</h4>
                <p className="text-xs text-slate-500 mt-0.5">Audited corporate hiring programs and engineering teams.</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">100% PLM Focused</h4>
                <p className="text-xs text-slate-500 mt-0.5">Engineered specifically for Teamcenter, Windchill & 3DX.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STILL HAVE QUESTIONS CTA */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 sm:p-12 text-center shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#BA3A2C]/10 text-[#BA3A2C] flex items-center justify-center mx-auto mb-4 border border-[#BA3A2C]/20">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mb-3">
              Still have questions about PLMSpider?
            </h3>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed mb-8">
              Our engineering advisory team is here to assist candidates navigating stealth profiles and enterprises establishing direct PLM talent pipelines.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3.5">
              <button
                onClick={() => navigate('/contact')}
                className="px-6 py-3 rounded-xl bg-[#BA3A2C] hover:bg-[#9E2F23] text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-red-900/10 flex items-center gap-2 cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Contact Our Team</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onOpenRegisterCandidateModal}
                className="px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs sm:text-sm font-bold transition-all shadow-2xs cursor-pointer"
              >
                Join as a Candidate
              </button>
              <button
                onClick={onOpenRegisterEmployerModal}
                className="px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs sm:text-sm font-bold transition-all shadow-2xs cursor-pointer"
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
