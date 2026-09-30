import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { PLMSystem, PLMModule, CADTool, ClearanceLevel, Application, CandidateProfile } from '../types';
import { 
  Building2, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Plus, 
  Users, 
  Briefcase, 
  FileText, 
  ShieldCheck, 
  Send, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Filter,
  Eye,
  Check,
  X,
  UserCheck,
  Search,
  Mail,
  Phone,
  MapPin,
  Lock,
  Award,
  Download,
  Layers,
  Shield,
  Boxes,
  DollarSign
} from 'lucide-react';
import { AddCustomOptionButton } from './AddCustomOptionButton';
import { CurrencySelector } from './CurrencySelector';
import { formatCompensation, getCurrencySymbol } from '../utils/currency';
import { CandidateSimpleListView } from './CandidateSimpleListView';
import { EmployerConnectionsView } from './EmployerConnectionsView';

interface EmployerViewProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenRegisterModal: () => void;
  onOpenRegisterCandidateModal?: () => void;
}

const ALL_PLM_SYSTEMS: PLMSystem[] = [
  'Siemens Teamcenter',
  'PTC Windchill',
  'Dassault 3DEXPERIENCE / ENOVIA',
  'Aras Innovator',
  'SAP PLM',
  'Autodesk Fusion / Upchain',
  'Arena PLM',
  'Agile PLM'
];

const ALL_PLM_MODULES: PLMModule[] = [
  'BOM & Part Architecture',
  'Active Workspace (AWC)',
  'CAD / MCAD Integration',
  'Engineering Change (ECN/ECO)',
  'Requirements & MBSE',
  'Manufacturing Process (MPP)',
  'Quality & CAPA',
  'Data Migration & ETL',
  'Supplier Collaboration'
];

const ALL_CAD_TOOLS: CADTool[] = [
  'Siemens NX',
  'CATIA V5/V6',
  'PTC Creo',
  'SolidWorks',
  'Autodesk Inventor',
  'Altium Designer'
];

export const EmployerView: React.FC<EmployerViewProps> = ({ 
  activeTab, 
  setActiveTab,
  onOpenRegisterModal,
  onOpenRegisterCandidateModal
}) => {
  const { 
    currentEmployer, 
    jobs, 
    applications, 
    allCandidates,
    postJob, 
    updateApplicationStage
  } = useApp();

  // Job Creator Form State
  const [jobTitle, setJobTitle] = useState('');
  const [availablePLMSystems, setAvailablePLMSystems] = useState<PLMSystem[]>(ALL_PLM_SYSTEMS);
  const [primaryPLM, setPrimaryPLM] = useState<PLMSystem>(
    currentEmployer?.primaryPLMStack?.[0] || 'Siemens Teamcenter'
  );
  const [availableModules, setAvailableModules] = useState<PLMModule[]>(ALL_PLM_MODULES);
  const [selectedModules, setSelectedModules] = useState<PLMModule[]>([]);
  const [availableCAD, setAvailableCAD] = useState<CADTool[]>(ALL_CAD_TOOLS);
  const [selectedCAD, setSelectedCAD] = useState<CADTool[]>([]);
  const [experienceLevel, setExperienceLevel] = useState<'Junior (1-3 yrs)' | 'Mid-Senior (4-7 yrs)' | 'Lead / Architect (8+ yrs)' | 'Principal / Director'>('Mid-Senior (4-7 yrs)');
  const [employmentType, setEmploymentType] = useState<'Full-Time Permanent' | 'Contract (W2/C2C)' | 'Contract-to-Hire'>('Full-Time Permanent');
  const [workplaceType, setWorkplaceType] = useState<'Remote' | 'Hybrid' | 'Onsite'>('Remote');
  const [location, setLocation] = useState('');
  const [compCurrency, setCompCurrency] = useState<string>('USD');
  const [minComp, setMinComp] = useState<number | ''>('');
  const [maxComp, setMaxComp] = useState<number | ''>('');
  const [compPeriod, setCompPeriod] = useState<'yearly' | 'hourly'>('yearly');
  const [itarRequired, setItarRequired] = useState(false);
  const [summary, setSummary] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [requirements, setRequirements] = useState('');

  // ATS selected application modal
  const [inspectedApp, setInspectedApp] = useState<Application | null>(null);

  // Candidate search / talent browsing state
  const [candidateSearch, setCandidateSearch] = useState('');
  const [candidateFilterPLM, setCandidateFilterPLM] = useState<PLMSystem | 'All'>('All');
  const [candidateFilterClearance, setCandidateFilterClearance] = useState<ClearanceLevel | 'All'>('All');
  const [candidateFilterMinExp, setCandidateFilterMinExp] = useState<number>(0);
  const [inspectedCandidate, setInspectedCandidate] = useState<CandidateProfile | null>(null);

  // Unified Published Jobs & ATS view state
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const [selectedJobIdForAts, setSelectedJobIdForAts] = useState<string | 'all'>('all');
  const [publishedJobsViewMode, setPublishedJobsViewMode] = useState<'jobs' | 'ats'>('jobs');
  const [expandedJobIdForProfiles, setExpandedJobIdForProfiles] = useState<string | null>(null);
  const [selectedStageFilter, setSelectedStageFilter] = useState<'all' | Application['status']>('all');
  const [atsDisplayMode, setAtsDisplayMode] = useState<'kanban' | 'profiles'>('kanban');

  // Helper to resolve full rich candidate profile from an application
  const getCandidateProfileForApp = (app: Application): CandidateProfile => {
    const found = allCandidates.find(c => c.id === app.candidateId || (c.email && c.email.toLowerCase() === app.candidateEmail?.toLowerCase()));

    const primaryPLM = found?.primaryPLM || app.candidatePrimaryPLM || 'Siemens Teamcenter';
    const experience = found?.yearsOfExperience || app.candidateExperience || 5;

    const initials = (found?.name || app.candidateName || 'PLM')
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map(w => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'PLM';

    const defaultModules: PLMModule[] = [
      'BOM & Part Architecture',
      'Active Workspace (AWC)',
      'CAD / MCAD Integration',
      'Engineering Change (ECN/ECO)'
    ];

    const defaultCAD: CADTool[] = primaryPLM.includes('Windchill')
      ? ['PTC Creo', 'SolidWorks']
      : primaryPLM.includes('3DEXPERIENCE') || primaryPLM.includes('ENOVIA')
      ? ['CATIA V5/V6', 'SolidWorks']
      : ['Siemens NX', 'SolidWorks'];

    const defaultCerts = [
      `${primaryPLM} Certified Specialist`,
      'Enterprise PLM Solution Architect'
    ];

    const defaultProjects = [
      {
        title: `${primaryPLM} Enterprise Modernization & Architecture`,
        system: primaryPLM,
        description: 'Spearheaded enterprise-wide data model restructuring, automated revision workflows, and integrated multi-CAD bi-directional release pipelines.',
        impact: 'Accelerated engineering change release cycle by 35% across 450+ concurrent users with zero downtime.'
      }
    ];

    if (found) {
      return {
        ...found,
        headline: found.headline || app.candidateHeadline || `${primaryPLM} Specialist`,
        modules: found.modules && found.modules.length > 0 ? found.modules : defaultModules,
        cadTools: found.cadTools && found.cadTools.length > 0 ? found.cadTools : defaultCAD,
        certifications: found.certifications && found.certifications.length > 0 ? found.certifications : defaultCerts,
        portfolioProjects: found.portfolioProjects && found.portfolioProjects.length > 0 ? found.portfolioProjects : defaultProjects,
        resumeFileName: app.resumeFileName || found.resumeFileName || 'Resume.pdf',
        bio: found.bio || app.coverNote || 'Dedicated PLM professional with extensive experience in enterprise lifecycle management and architecture.',
        avatarInitials: found.avatarInitials || initials,
      };
    }

    return {
      id: app.candidateId || `cand-${app.id}`,
      name: app.candidateName,
      headline: app.candidateHeadline || `${primaryPLM} Specialist`,
      email: app.candidateEmail || '',
      phone: '',
      location: 'Remote',
      yearsOfExperience: experience,
      primaryPLM,
      secondaryPLMs: [],
      modules: defaultModules,
      cadTools: defaultCAD,
      certifications: defaultCerts,
      clearance: 'None',
      currentCompany: 'Enterprise Engineering',
      currentRole: 'PLM Engineer',
      expectedCompensation: '$140,000 / yr',
      availableFrom: 'Immediately',
      bio: app.coverNote || 'Dedicated PLM professional with extensive experience in enterprise lifecycle management and architecture.',
      verifiedSpecialist: true,
      avatarInitials: initials,
      accentColor: 'from-blue-600 to-indigo-600',
      resumeFileName: app.resumeFileName || 'Resume.pdf',
      portfolioProjects: defaultProjects
    };
  };

  // Candidate Profile Skills Modal Renderer
  const renderCandidateProfileModal = () => {
    if (!inspectedCandidate) return null;

    const primaryPLM = inspectedCandidate.primaryPLM || 'Siemens Teamcenter';
    const fallbackModules: PLMModule[] = [
      'BOM & Part Architecture',
      'Active Workspace (AWC)',
      'CAD / MCAD Integration',
      'Engineering Change (ECN/ECO)'
    ];
    const fallbackCAD: CADTool[] = primaryPLM.includes('Windchill')
      ? ['PTC Creo', 'SolidWorks']
      : primaryPLM.includes('3DEXPERIENCE') || primaryPLM.includes('ENOVIA')
      ? ['CATIA V5/V6', 'SolidWorks']
      : ['Siemens NX', 'SolidWorks'];
    const fallbackCerts = [
      `${primaryPLM} Certified Specialist`,
      'Enterprise PLM Solution Architect'
    ];
    const fallbackProjects = [
      {
        title: `${primaryPLM} Enterprise Modernization & Architecture`,
        system: primaryPLM,
        description: 'Spearheaded enterprise-wide data model restructuring, automated revision workflows, and integrated multi-CAD bi-directional release pipelines.',
        impact: 'Accelerated engineering change release cycle by 35% across 450+ concurrent users with zero downtime.'
      }
    ];

    const displayModules = inspectedCandidate.modules && inspectedCandidate.modules.length > 0 
      ? inspectedCandidate.modules 
      : fallbackModules;

    const displayCAD = inspectedCandidate.cadTools && inspectedCandidate.cadTools.length > 0 
      ? inspectedCandidate.cadTools 
      : fallbackCAD;

    const displayCerts = inspectedCandidate.certifications && inspectedCandidate.certifications.length > 0 
      ? inspectedCandidate.certifications 
      : fallbackCerts;

    const displayProjects = inspectedCandidate.portfolioProjects && inspectedCandidate.portfolioProjects.length > 0 
      ? inspectedCandidate.portfolioProjects 
      : fallbackProjects;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full overflow-hidden my-6">
          
          {/* Modal Header */}
          <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-lg ring-2 ring-white/20 shrink-0">
                {inspectedCandidate.avatarInitials || 'PLM'}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-bold text-white tracking-tight">
                    {inspectedCandidate.name}
                  </h2>
                  {inspectedCandidate.verifiedSpecialist && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified PLM Specialist
                    </span>
                  )}
                </div>
                <p className="text-xs text-blue-200 mt-0.5">
                  {inspectedCandidate.headline || `${primaryPLM} Specialist & Solution Architect`}
                </p>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-300 flex-wrap">
                  <span className="flex items-center gap-1 font-medium text-blue-300">
                    <Briefcase className="w-3.5 h-3.5" />
                    {inspectedCandidate.yearsOfExperience}+ Years Experience
                  </span>
                  <span className="flex items-center gap-1 font-medium text-emerald-300">
                    <Layers className="w-3.5 h-3.5" />
                    {primaryPLM}
                  </span>
                  <span className="flex items-center gap-1 font-medium text-amber-300">
                    <Shield className="w-3.5 h-3.5" />
                    {inspectedCandidate.clearance || 'Commercial'}
                  </span>
                  {inspectedCandidate.location && (
                    <span className="flex items-center gap-1 font-medium text-slate-300">
                      <MapPin className="w-3.5 h-3.5" />
                      {inspectedCandidate.location}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setInspectedCandidate(null)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              title="Close profile"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body - Scrollable */}
          <div className="p-6 space-y-6 max-h-[72vh] overflow-y-auto">

            {/* 1. Core PLM Ecosystem & Platform Proficiency */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
              <div className="flex items-center gap-2 mb-3">
                <Layers className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  PLM Ecosystem & Platform Proficiency
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-2xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Primary: {inspectedCandidate.primaryPLM}
                </span>
                {inspectedCandidate.secondaryPLMs && inspectedCandidate.secondaryPLMs.length > 0 && (
                  inspectedCandidate.secondaryPLMs.map(s => (
                    <span key={s} className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs font-medium">
                      Secondary: {s}
                    </span>
                  ))
                )}
                <span className="px-2.5 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
                  {inspectedCandidate.yearsOfExperience} Yrs Total PLM Practice
                </span>
                <span className="px-2.5 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                  Clearance: {inspectedCandidate.clearance || 'Commercial'}
                </span>
              </div>
            </div>

            {/* 2. Specialized Functional Modules (Skills) */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-blue-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Functional PLM Modules & Domain Competencies ({displayModules.length})
                  </h3>
                </div>
                <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                  Verified Technical Skills
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {displayModules.map((mod, idx) => (
                  <div 
                    key={idx}
                    className="px-3 py-2 rounded-lg bg-white border border-slate-200/90 text-slate-800 text-xs font-medium flex items-center gap-2 shadow-2xs hover:border-blue-300 hover:bg-blue-50/30 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{mod}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Integrated CAD & Authoring Tools */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <Boxes className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  CAD Environments & MCAD/ECAD Integrations
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {displayCAD.map((cad, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                    {cad}
                  </span>
                ))}
              </div>
            </div>

            {/* 4. Verified OEM & Industry Certifications */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <Award className="w-4 h-4 text-amber-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Verified OEM & Professional Certifications
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {displayCerts.map((cert, idx) => (
                  <div 
                    key={idx}
                    className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/90 text-xs flex items-center gap-2.5 shadow-2xs"
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0">
                      <Award className="w-4 h-4 text-amber-700" />
                    </div>
                    <div>
                      <p className="font-semibold text-amber-950">{cert}</p>
                      <p className="text-[10px] text-amber-700 font-medium">Industry Credential Verified</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Enterprise Deployments & Portfolio Highlights */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <Briefcase className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Enterprise Projects & Major Deployments
                </h3>
              </div>
              <div className="space-y-3">
                {displayProjects.map((proj, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors shadow-2xs space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900">{proj.title}</h4>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                        {proj.system}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
                    {proj.impact && (
                      <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 flex items-start gap-1.5 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>Impact:</strong> {proj.impact}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 6. Current Career Status, Compensation & Availability */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-4 h-4 text-slate-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Current Role & Employment Availability
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase">Current Role</span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5 block truncate">
                    {inspectedCandidate.currentRole || 'PLM Specialist'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase">Current Company</span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5 block truncate">
                    {inspectedCandidate.currentCompany || 'Confidential Enterprise'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase">Expected Comp</span>
                  <span className="text-xs font-bold text-blue-700 mt-0.5 block truncate">
                    {inspectedCandidate.expectedCompensation || '$135k - $160k / yr'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase">Availability</span>
                  <span className="text-xs font-bold text-emerald-700 mt-0.5 block truncate">
                    {inspectedCandidate.availableFrom || 'Immediately'}
                  </span>
                </div>
              </div>
            </div>

            {/* 7. Professional Bio */}
            {inspectedCandidate.bio && (
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Professional Executive Bio
                </h3>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
                  {inspectedCandidate.bio}
                </div>
              </div>
            )}

            {/* 8. Contact & Location & Resume Attachment */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Contact & Location
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-700">
                  <span className="flex items-center gap-1.5 font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified Talent Profile</span>
                  </span>
                  {inspectedCandidate.phone && (
                    <a 
                      href={`tel:${inspectedCandidate.phone}`}
                      className="flex items-center gap-1.5 text-slate-700 hover:text-slate-900"
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {inspectedCandidate.phone}
                    </a>
                  )}
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {inspectedCandidate.location || 'Remote / Hybrid'}
                  </span>
                </div>
              </div>

              {/* Resume PDF Chip */}
              <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-200 flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <div>
                    <span className="text-xs font-semibold text-slate-900 block max-w-[160px] truncate">
                      {inspectedCandidate.resumeFileName || `${inspectedCandidate.name.replace(/\s+/g, '_')}_Resume.pdf`}
                    </span>
                    <span className="text-[10px] text-blue-600 font-medium">Verified PDF Resume</span>
                  </div>
                </div>
                <a
                  href={`#resume-${inspectedCandidate.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`Viewing verified resume document: ${inspectedCandidate.resumeFileName || 'Resume.pdf'}`);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>Resume</span>
                </a>
              </div>
            </div>

          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="text-xs text-slate-500 font-medium">
              Verified Candidate Profile
            </div>
            <button
              type="button"
              onClick={() => setInspectedCandidate(null)}
              className="px-5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
            >
              Close Profile
            </button>
          </div>

        </div>
      </div>
    );
  };

  if (!currentEmployer) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center">
        <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h2 className="text-base font-bold text-slate-900">No active employer found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-4">Register your company to begin posting PLM positions.</p>
        <button
          onClick={onOpenRegisterModal}
          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
        >
          Register Company
        </button>
      </div>
    );
  }

  const isVerified = currentEmployer.verificationStatus === 'verified';
  const isPending = currentEmployer.verificationStatus === 'pending_verification' || currentEmployer.verificationStatus === 'under_review';
  const isRejected = currentEmployer.verificationStatus === 'rejected';

  const employerJobs = jobs.filter(j => 
    j.employerId === currentEmployer.id || (currentEmployer.companyName && j.employerName === currentEmployer.companyName)
  );
  const employerApplications = applications.filter(a => 
    a.employerId === currentEmployer.id || 
    employerJobs.some(j => j.id === a.jobId) ||
    (currentEmployer.companyName && a.employerName === currentEmployer.companyName)
  );

  const toggleModule = (mod: PLMModule) => {
    setSelectedModules(prev => 
      prev.includes(mod) ? prev.filter(m => m !== mod) : [...prev, mod]
    );
  };

  const toggleCAD = (tool: CADTool) => {
    setSelectedCAD(prev => 
      prev.includes(tool) ? prev.filter(t => t !== tool) : [...prev, tool]
    );
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim()) return;

    postJob({
      title: jobTitle.trim(),
      primaryPLM,
      relatedSystems: [],
      requiredModules: selectedModules,
      cadIntegration: selectedCAD,
      experienceLevel,
      employmentType,
      workplaceType,
      location: location.trim() || 'Remote',
      compensation: {
        min: minComp ? Number(minComp) : 0,
        max: maxComp ? Number(maxComp) : (minComp ? Number(minComp) : 0),
        currency: 'USD',
        period: compPeriod,
      },
      itarRequired,
      clearanceRequired: itarRequired ? 'ITAR / Export Controlled' : 'None',
      summary: summary.trim(),
      responsibilities: responsibilities.split('\n').map(r => r.trim()).filter(r => r.length > 0),
      requirements: requirements.split('\n').map(r => r.trim()).filter(r => r.length > 0),
    });

    setJobTitle('');
    setLocation('');
    setMinComp('');
    setMaxComp('');
    setSummary('');
    setResponsibilities('');
    setRequirements('');
    setSelectedModules([]);
    setSelectedCAD([]);
    setIsCreatingJob(false);
    setActiveTab('published-jobs');
    setPublishedJobsViewMode('jobs');
  };

  // Sub-view: Unified Published Jobs & ATS Pipeline
  if (activeTab === 'published-jobs' || activeTab === 'post-job' || activeTab === 'pipeline') {
    // If in position creation mode
    if (isCreatingJob || activeTab === 'post-job') {
      return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          
          {/* Verification Status Warning if Pending */}
          {!isVerified && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold block text-sm">
                    Company Verification in Progress by Main Admin
                  </strong>
                  <p className="mt-0.5 text-amber-800 leading-relaxed">
                    You can configure and save your position now. As per platform security policy, it will be held in draft status and will automatically publish publicly once the Main Admin verifies your tax ID (<span className="font-mono">{currentEmployer.taxRegistrationNumber}</span>) and corporate domain.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <button
                type="button"
                onClick={() => {
                  setIsCreatingJob(false);
                  setActiveTab('published-jobs');
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 mb-2 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Published Jobs</span>
              </button>
              <h1 className="text-xl font-bold text-slate-900">
                Publish Specialized PLM Position
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Structured specifically for Teamcenter, Windchill, 3DEXPERIENCE, and Aras architectures
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsCreatingJob(false);
                setActiveTab('published-jobs');
              }}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>

        <form onSubmit={handleCreateJob} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
          
          {/* Job Core Identification */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              1. Position Details
            </h2>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Position Title *
              </label>
              <input
                type="text"
                required
                value={jobTitle}
                onChange={e => setJobTitle(e.target.value)}
                placeholder="e.g. Lead Teamcenter Active Workspace Solutions Architect"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Primary PLM Platform *
                </label>
                <select
                  value={primaryPLM}
                  onChange={e => setPrimaryPLM(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-slate-900 bg-white"
                >
                  {ALL_PLM_SYSTEMS.map(sys => (
                    <option key={sys} value={sys}>{sys}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Experience Tier
                </label>
                <select
                  value={experienceLevel}
                  onChange={e => setExperienceLevel(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-slate-900 bg-white"
                >
                  <option value="Junior (1-3 yrs)">Junior (1-3 yrs)</option>
                  <option value="Mid-Senior (4-7 yrs)">Mid-Senior (4-7 yrs)</option>
                  <option value="Lead / Architect (8+ yrs)">Lead / Architect (8+ yrs)</option>
                  <option value="Principal / Director">Principal / Director</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Employment Agreement
                </label>
                <select
                  value={employmentType}
                  onChange={e => setEmploymentType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-slate-900 bg-white"
                >
                  <option value="Full-Time Permanent">Full-Time Permanent</option>
                  <option value="Contract (W2/C2C)">Contract (W2/C2C)</option>
                  <option value="Contract-to-Hire">Contract-to-Hire</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Workplace Configuration
                </label>
                <select
                  value={workplaceType}
                  onChange={e => setWorkplaceType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-slate-900 bg-white"
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Onsite">Onsite</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Location / Region
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Seattle, WA or Remote (US Timezones)"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Compensation & Clearance */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              2. Compensation & Compliance Requirements
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Minimum Base ($)
                </label>
                <input
                  type="number"
                  value={minComp}
                  placeholder="e.g. 140000"
                  onChange={e => setMinComp(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Maximum Base ($)
                </label>
                <input
                  type="number"
                  value={maxComp}
                  placeholder="e.g. 175000"
                  onChange={e => setMaxComp(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Compensation Cadence
                </label>
                <select
                  value={compPeriod}
                  onChange={e => setCompPeriod(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-slate-900 bg-white"
                >
                  <option value="yearly">Annual Salary (USD / yr)</option>
                  <option value="hourly">Hourly Contract Rate (USD / hr)</option>
                </select>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-900">
                  ITAR / Defense Export Control Required
                </div>
                <div className="text-[11px] text-slate-500">
                  Requires candidates to possess verified U.S. person / export clearance status.
                </div>
              </div>
              <input
                type="checkbox"
                checked={itarRequired}
                onChange={e => setItarRequired(e.target.checked)}
                className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* PLM Modules in Scope */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              3. Specialized PLM Modules Needed
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ALL_PLM_MODULES.map(mod => {
                const isSelected = selectedModules.includes(mod);
                return (
                  <button
                    key={mod}
                    type="button"
                    onClick={() => toggleModule(mod)}
                    className={`p-2 rounded-lg border text-left text-xs transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 font-medium'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="truncate">{mod}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* CAD Environments */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              4. Associated CAD Environments
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ALL_CAD_TOOLS.map(cad => {
                const isSelected = selectedCAD.includes(cad);
                return (
                  <button
                    key={cad}
                    type="button"
                    onClick={() => toggleCAD(cad)}
                    className={`p-2 rounded-lg border text-left text-xs transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'bg-slate-800 text-white border-slate-800 font-medium'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="truncate">{cad}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Descriptions & Tasks */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              5. Role Scope & Prerequisites
            </h2>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Executive Summary
              </label>
              <textarea
                rows={2}
                value={summary}
                onChange={e => setSummary(e.target.value)}
                placeholder="High-level mission of the position within your enterprise..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Technical Responsibilities (One per line)
              </label>
              <textarea
                rows={3}
                value={responsibilities}
                onChange={e => setResponsibilities(e.target.value)}
                placeholder="• Architect and configure PLM data schemas...&#10;• Deploy CAD connectors and release workflows..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-slate-900 font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Prerequisites & Qualifications (One per line)
              </label>
              <textarea
                rows={3}
                value={requirements}
                onChange={e => setRequirements(e.target.value)}
                placeholder="• Hands-on PLM administration experience...&#10;• Familiarity with multi-CAD integration..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-slate-900 font-mono text-[11px]"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setIsCreatingJob(false);
                setActiveTab('published-jobs');
              }}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
            >
              {isVerified ? 'Publish Live PLM Position' : 'Save Position (Awaiting Admin Verification)'}
            </button>
          </div>

        </form>
      </div>
    );
  }

    const pipelineStages: { key: Application['status']; label: string }[] = [
      { key: 'applied', label: 'New Applied' },
      { key: 'screening', label: 'Screening' },
      { key: 'technical_interview', label: 'Tech Deep Dive' },
      { key: 'offer_extended', label: 'Offer Extended' },
    ];

    const filteredAtsApplications = employerApplications.filter(a => 
      selectedJobIdForAts === 'all' || a.jobId === selectedJobIdForAts
    );

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Verification Status Warning if Pending */}
        {!isVerified && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block text-sm">
                  Company Verification in Progress by Main Admin
                </strong>
                <p className="mt-0.5 text-amber-800 leading-relaxed">
                  Positions you publish will be held in draft status and will automatically publish publicly once the Main Admin verifies your company profile.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Top Header with Add New Position button & View Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Published PLM Jobs & Applicant Pipeline
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Track your active openings, view received candidate profiles, and manage hiring pipeline
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Switcher */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setPublishedJobsViewMode('jobs')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  publishedJobsViewMode === 'jobs'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Published Positions</span>
                <span className="ml-1 px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded-full text-[10px] font-mono">
                  {employerJobs.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPublishedJobsViewMode('ats')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  publishedJobsViewMode === 'ats'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Applicant ATS</span>
                <span className="ml-1 px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded-full text-[10px] font-mono font-bold">
                  {employerApplications.length}
                </span>
              </button>
            </div>

            {/* + Add New Position Button */}
            <button
              id="add-new-position-btn"
              type="button"
              onClick={() => {
                setIsCreatingJob(true);
                setActiveTab('published-jobs');
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Position</span>
            </button>
          </div>
        </div>

        {/* View Mode 1: Published Positions List */}
        {publishedJobsViewMode === 'jobs' && (
          <div className="space-y-6">
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-xs font-medium text-slate-500">Active Positions</span>
                <div className="text-xl font-bold text-slate-900 mt-1">{employerJobs.length}</div>
                <span className="text-[11px] text-slate-400">Total published</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-xs font-medium text-slate-500">Profiles Received</span>
                <div className="text-xl font-bold text-blue-600 mt-1">{employerApplications.length}</div>
                <span className="text-[11px] text-slate-400">Across all roles</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-xs font-medium text-slate-500">In Screening / Tech</span>
                <div className="text-xl font-bold text-purple-600 mt-1">
                  {employerApplications.filter(a => a.status === 'screening' || a.status === 'technical_interview').length}
                </div>
                <span className="text-[11px] text-slate-400">Active evaluation</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-xs font-medium text-slate-500">Offers Extended</span>
                <div className="text-xl font-bold text-emerald-600 mt-1">
                  {employerApplications.filter(a => a.status === 'offer_extended').length}
                </div>
                <span className="text-[11px] text-slate-400">Final stages</span>
              </div>
            </div>

            {/* List of Published Jobs */}
            {employerJobs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                  <Briefcase className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">No published positions yet</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                    Publish your first Teamcenter, Windchill, 3DEXPERIENCE, or Aras opening to start receiving matched candidate profiles.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreatingJob(true)}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-sm inline-flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add First Position</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {employerJobs.map(job => {
                  const jobApps = applications.filter(a => a.jobId === job.id);
                  const appliedCount = jobApps.filter(a => a.status === 'applied').length;
                  const screeningCount = jobApps.filter(a => a.status === 'screening').length;
                  const techCount = jobApps.filter(a => a.status === 'technical_interview').length;
                  const offerCount = jobApps.filter(a => a.status === 'offer_extended').length;

                  return (
                    <div 
                      key={job.id} 
                      className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs hover:shadow-sm transition-all space-y-4"
                    >
                      {/* Top Header of Job Card */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <h3 className="text-base font-bold text-slate-900">
                              {job.title}
                            </h3>
                            {job.status === 'active' ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Live & Public
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                Pending Admin Verification
                              </span>
                            )}
                            <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                              {job.primaryPLM}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                            <span className="font-medium text-slate-700">{job.workplaceType}</span>
                            <span>({job.location})</span>
                            <span>·</span>
                            <span>{job.experienceLevel}</span>
                            <span>·</span>
                            <span className="font-mono tabular-nums font-semibold text-slate-700">
                              {job.compensation?.min ? `$${job.compensation.min.toLocaleString()} - $${job.compensation.max?.toLocaleString()} / ${job.compensation.period}` : 'Competitive'}
                            </span>
                            <span>·</span>
                            <span>Posted {new Date(job.postedAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {/* Quick CAD / Clearance Badges */}
                        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                          {job.cadIntegration?.slice(0, 2).map(cad => (
                            <span key={cad} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium">
                              {cad}
                            </span>
                          ))}
                          {job.itarRequired && (
                            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                              ITAR
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Summary preview */}
                      {job.summary && (
                        <p className="text-xs text-slate-600 line-clamp-2">
                          {job.summary}
                        </p>
                      )}

                      {/* Required Modules */}
                      {job.requiredModules && job.requiredModules.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[11px] text-slate-400 font-medium">Modules:</span>
                          {job.requiredModules.map(m => (
                            <span key={m} className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-slate-600 text-[10px]">
                              {m}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* APPLICATION & ATS STATUS BANNER (CORE REQUIREMENT) */}
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse shrink-0" />
                            <button
                              type="button"
                              onClick={() => {
                                if (expandedJobIdForProfiles === job.id && selectedStageFilter === 'all') {
                                  setExpandedJobIdForProfiles(null);
                                } else {
                                  setExpandedJobIdForProfiles(job.id);
                                  setSelectedStageFilter('all');
                                }
                              }}
                              className="text-xs font-bold text-slate-900 hover:text-blue-700 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                            >
                              {jobApps.length > 0 ? (
                                <span>{jobApps.length} Candidate Profile{jobApps.length !== 1 ? 's' : ''} Received Under This Position</span>
                              ) : (
                                <span className="text-slate-500 font-normal">No candidate profiles received yet under this position</span>
                              )}
                              {jobApps.length > 0 && (
                                <span className="text-[10px] text-blue-600 font-medium">
                                  {expandedJobIdForProfiles === job.id ? '(Click to collapse ▲)' : '(Click to open profiles ▼)'}
                                </span>
                              )}
                            </button>
                          </div>

                          {/* Clickable Stage Filter Badges */}
                          <div className="flex flex-wrap items-center gap-2 text-[11px]">
                            {/* Applied Chip */}
                            <button
                              type="button"
                              onClick={() => {
                                if (expandedJobIdForProfiles === job.id && selectedStageFilter === 'applied') {
                                  setExpandedJobIdForProfiles(null);
                                } else {
                                  setExpandedJobIdForProfiles(job.id);
                                  setSelectedStageFilter('applied');
                                }
                              }}
                              className={`px-2.5 py-1 rounded-lg border font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                                expandedJobIdForProfiles === job.id && selectedStageFilter === 'applied'
                                  ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                                  : 'bg-white hover:bg-blue-50 border-slate-200 hover:border-blue-300 text-slate-700'
                              }`}
                              title="Click to view Applied profiles"
                            >
                              <span>Applied:</span>
                              <strong className={expandedJobIdForProfiles === job.id && selectedStageFilter === 'applied' ? 'text-white' : 'text-blue-700'}>
                                {appliedCount}
                              </strong>
                            </button>

                            {/* Screening Chip */}
                            <button
                              type="button"
                              onClick={() => {
                                if (expandedJobIdForProfiles === job.id && selectedStageFilter === 'screening') {
                                  setExpandedJobIdForProfiles(null);
                                } else {
                                  setExpandedJobIdForProfiles(job.id);
                                  setSelectedStageFilter('screening');
                                }
                              }}
                              className={`px-2.5 py-1 rounded-lg border font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                                expandedJobIdForProfiles === job.id && selectedStageFilter === 'screening'
                                  ? 'bg-amber-600 border-amber-600 text-white shadow-xs'
                                  : 'bg-white hover:bg-amber-50 border-slate-200 hover:border-amber-300 text-slate-700'
                              }`}
                              title="Click to view Screening profiles"
                            >
                              <span>Screening:</span>
                              <strong className={expandedJobIdForProfiles === job.id && selectedStageFilter === 'screening' ? 'text-white' : 'text-amber-700'}>
                                {screeningCount}
                              </strong>
                            </button>

                            {/* Tech Deep Dive Chip */}
                            <button
                              type="button"
                              onClick={() => {
                                if (expandedJobIdForProfiles === job.id && selectedStageFilter === 'technical_interview') {
                                  setExpandedJobIdForProfiles(null);
                                } else {
                                  setExpandedJobIdForProfiles(job.id);
                                  setSelectedStageFilter('technical_interview');
                                }
                              }}
                              className={`px-2.5 py-1 rounded-lg border font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                                expandedJobIdForProfiles === job.id && selectedStageFilter === 'technical_interview'
                                  ? 'bg-purple-600 border-purple-600 text-white shadow-xs'
                                  : 'bg-white hover:bg-purple-50 border-slate-200 hover:border-purple-300 text-slate-700'
                              }`}
                              title="Click to view Tech Deep Dive profiles"
                            >
                              <span>Tech Deep Dive:</span>
                              <strong className={expandedJobIdForProfiles === job.id && selectedStageFilter === 'technical_interview' ? 'text-white' : 'text-purple-700'}>
                                {techCount}
                              </strong>
                            </button>

                            {/* Offers Chip */}
                            <button
                              type="button"
                              onClick={() => {
                                if (expandedJobIdForProfiles === job.id && selectedStageFilter === 'offer_extended') {
                                  setExpandedJobIdForProfiles(null);
                                } else {
                                  setExpandedJobIdForProfiles(job.id);
                                  setSelectedStageFilter('offer_extended');
                                }
                              }}
                              className={`px-2.5 py-1 rounded-lg border font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                                expandedJobIdForProfiles === job.id && selectedStageFilter === 'offer_extended'
                                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                                  : 'bg-white hover:bg-emerald-50 border-slate-200 hover:border-emerald-300 text-slate-700'
                              }`}
                              title="Click to view Offer Extended profiles"
                            >
                              <span>Offers:</span>
                              <strong className={expandedJobIdForProfiles === job.id && selectedStageFilter === 'offer_extended' ? 'text-white' : 'text-emerald-700'}>
                                {offerCount}
                              </strong>
                            </button>
                          </div>
                        </div>

                        {/* Action Buttons: Toggle Profiles & Open in ATS */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (expandedJobIdForProfiles === job.id) {
                                setExpandedJobIdForProfiles(null);
                              } else {
                                setExpandedJobIdForProfiles(job.id);
                                setSelectedStageFilter('all');
                              }
                            }}
                            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
                              expandedJobIdForProfiles === job.id
                                ? 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                                : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200'
                            }`}
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>{expandedJobIdForProfiles === job.id ? 'Hide Profiles ▲' : `View Profiles (${jobApps.length}) ▼`}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedJobIdForAts(job.id);
                              setPublishedJobsViewMode('ats');
                            }}
                            className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer shrink-0"
                            title="Open in full Kanban ATS pipeline"
                          >
                            <Users className="w-3.5 h-3.5 text-blue-300" />
                            <span>Open in ATS ({jobApps.length})</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* EXPANDED CANDIDATE PROFILES UNDER THIS JOB */}
                      {expandedJobIdForProfiles === job.id && (() => {
                        const stageFilteredApps = jobApps.filter(a => 
                          selectedStageFilter === 'all' || a.status === selectedStageFilter
                        );

                        return (
                          <div className="mt-4 pt-4 border-t border-slate-200/90 space-y-4 animate-in fade-in duration-200">
                            {/* Sub-header with filter pills and counter */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-blue-600" />
                                <span className="text-xs font-bold text-slate-900">
                                  Candidate Profiles for {job.title}
                                </span>
                                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                                  {stageFilteredApps.length} profile{stageFilteredApps.length !== 1 ? 's' : ''}
                                </span>
                              </div>

                              {/* Filter stage switcher */}
                              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                                <button
                                  type="button"
                                  onClick={() => setSelectedStageFilter('all')}
                                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                                    selectedStageFilter === 'all'
                                      ? 'bg-slate-900 text-white font-semibold'
                                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                  }`}
                                >
                                  All ({jobApps.length})
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSelectedStageFilter('applied')}
                                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                                    selectedStageFilter === 'applied'
                                      ? 'bg-blue-600 text-white font-semibold'
                                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                                  }`}
                                >
                                  Applied ({appliedCount})
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSelectedStageFilter('screening')}
                                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                                    selectedStageFilter === 'screening'
                                      ? 'bg-amber-600 text-white font-semibold'
                                      : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                                  }`}
                                >
                                  Screening ({screeningCount})
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSelectedStageFilter('technical_interview')}
                                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                                    selectedStageFilter === 'technical_interview'
                                      ? 'bg-purple-600 text-white font-semibold'
                                      : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
                                  }`}
                                >
                                  Tech Deep Dive ({techCount})
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSelectedStageFilter('offer_extended')}
                                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                                    selectedStageFilter === 'offer_extended'
                                      ? 'bg-emerald-600 text-white font-semibold'
                                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                                  }`}
                                >
                                  Offers ({offerCount})
                                </button>
                              </div>
                            </div>

                            {/* Candidate Profile Cards Grid */}
                            {stageFilteredApps.length === 0 ? (
                              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
                                <Users className="w-8 h-8 text-slate-300 mx-auto" />
                                <div className="text-xs font-semibold text-slate-700">
                                  No candidate profiles in '{selectedStageFilter === 'all' ? 'this position' : selectedStageFilter}' stage
                                </div>
                                <p className="text-[11px] text-slate-400">
                                  Candidates who apply or are moved to this stage will appear here immediately.
                                </p>
                                {selectedStageFilter !== 'all' && (
                                  <button
                                    type="button"
                                    onClick={() => setSelectedStageFilter('all')}
                                    className="mt-2 px-3 py-1 text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                                  >
                                    Show all ({jobApps.length}) candidates under this position →
                                  </button>
                                )}
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {stageFilteredApps.map(app => {
                                  const cand = getCandidateProfileForApp(app);
                                  return (
                                    <div
                                      key={app.id}
                                      className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between space-y-4"
                                    >
                                      <div className="space-y-3">
                                        {/* Header: Avatar, Name, Headline, Match Score */}
                                        <div className="flex items-start justify-between gap-3">
                                          <div className="flex items-start gap-3 min-w-0">
                                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cand.accentColor || 'from-blue-600 to-indigo-600'} text-white font-bold text-sm flex items-center justify-center shadow-xs shrink-0`}>
                                              {cand.avatarInitials || 'PLM'}
                                            </div>
                                            <div className="min-w-0">
                                              <div className="flex items-center gap-1.5">
                                                <h4 className="text-sm font-bold text-slate-900 truncate">
                                                  {cand.name}
                                                </h4>
                                                {cand.verifiedSpecialist && (
                                                  <span title="Verified PLM Specialist"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /></span>
                                                )}
                                              </div>
                                              <p className="text-xs text-slate-500 truncate">
                                                {cand.headline || 'PLM Specialist'}
                                              </p>
                                              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                                                <MapPin className="w-3 h-3 shrink-0" />
                                                <span className="truncate">{cand.location || 'Location Not Specified'}</span>
                                              </div>
                                            </div>
                                          </div>

                                          <div className="text-right shrink-0">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                              {app.matchScore}% Match
                                            </span>
                                          </div>
                                        </div>

                                        {/* PLM Competencies Badges */}
                                        <div className="flex flex-wrap items-center gap-1.5">
                                          <span className="px-2 py-0.5 rounded bg-slate-900 text-white text-[11px] font-semibold">
                                            {cand.primaryPLM}
                                          </span>
                                          <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-semibold font-mono">
                                            {cand.yearsOfExperience} yrs exp
                                          </span>
                                          {cand.clearance && cand.clearance !== 'None' && (
                                            <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold">
                                              {cand.clearance}
                                            </span>
                                          )}
                                        </div>

                                        {/* Specialized Modules & CAD */}
                                        {((cand.modules && cand.modules.length > 0) || (cand.cadTools && cand.cadTools.length > 0)) && (
                                          <div className="flex flex-wrap items-center gap-1">
                                            {cand.modules.slice(0, 3).map(m => (
                                              <span key={m} className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-slate-600 text-[10px]">
                                                {m}
                                              </span>
                                            ))}
                                            {cand.cadTools.slice(0, 2).map(c => (
                                              <span key={c} className="px-2 py-0.5 rounded-md border border-slate-200 text-slate-700 text-[10px] font-mono">
                                                {c}
                                              </span>
                                            ))}
                                          </div>
                                        )}

                                        {/* Applicant Cover Note Quote */}
                                        {app.coverNote && (
                                          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-700 leading-relaxed italic">
                                            "{app.coverNote}"
                                          </div>
                                        )}

                                        {/* Resume Attachment Chip */}
                                        {(app.resumeFileName || cand.resumeFileName) && (
                                          <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50/60 border border-blue-100 text-xs">
                                            <div className="flex items-center gap-2 truncate">
                                              <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                                              <span className="font-medium text-slate-800 truncate text-[11px]">
                                                {app.resumeFileName || cand.resumeFileName}
                                              </span>
                                            </div>
                                            <span className="text-[10px] text-blue-700 font-mono font-semibold bg-white px-2 py-0.5 rounded border border-blue-200 shrink-0">
                                              Resume PDF
                                            </span>
                                          </div>
                                        )}

                                        {/* Contact Information */}
                                        {cand.phone && (
                                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                                            <span className="flex items-center gap-1 font-mono">
                                              <Phone className="w-3 h-3 text-slate-400" />
                                              {cand.phone}
                                            </span>
                                          </div>
                                        )}
                                      </div>

                                      {/* Action Bar: Stage Mover & View Full Profile */}
                                      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                                        {/* Stage Badge & Selector */}
                                        <div className="flex items-center gap-2">
                                          <span className="text-[10px] font-semibold text-slate-400 uppercase">Stage:</span>
                                          <select
                                            value={app.status}
                                            onChange={e => updateApplicationStage(app.id, e.target.value as any)}
                                            className="text-[11px] font-semibold py-1 px-2 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:border-slate-900 cursor-pointer"
                                          >
                                            <option value="applied">Applied</option>
                                            <option value="screening">Screening</option>
                                            <option value="technical_interview">Tech Deep Dive</option>
                                            <option value="offer_extended">Offer Extended</option>
                                          </select>
                                        </div>

                                        {/* View Full Profile Button */}
                                        <button
                                          type="button"
                                          onClick={() => setInspectedCandidate(cand)}
                                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                                        >
                                          <Eye className="w-3.5 h-3.5" />
                                          <span>View Full Profile</span>
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })()}

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* View Mode 2: Applicant ATS Pipeline Kanban */}
        {publishedJobsViewMode === 'ats' && (
          <div className="space-y-6">
            {/* Filter and Switcher Sub-header */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPublishedJobsViewMode('jobs')}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Published Positions</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-500">Filter Position:</span>
                  <select
                    value={selectedJobIdForAts}
                    onChange={e => setSelectedJobIdForAts(e.target.value)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-slate-900"
                  >
                    <option value="all">
                      All Published Positions ({employerApplications.length} candidates)
                    </option>
                    {employerJobs.map(j => {
                      const count = applications.filter(a => a.jobId === j.id).length;
                      return (
                        <option key={j.id} value={j.id}>
                          {j.title} ({count} candidate{count !== 1 ? 's' : ''})
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="bg-slate-100 p-0.5 rounded-lg flex items-center border border-slate-200 text-xs">
                  <button
                    type="button"
                    onClick={() => setAtsDisplayMode('kanban')}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                      atsDisplayMode === 'kanban'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Kanban Stages
                  </button>
                  <button
                    type="button"
                    onClick={() => setAtsDisplayMode('profiles')}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                      atsDisplayMode === 'profiles'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Job Seeker Profiles ({filteredAtsApplications.length})
                  </button>
                </div>

                <div className="text-xs font-mono text-slate-500">
                  Showing {filteredAtsApplications.length} candidate{filteredAtsApplications.length !== 1 ? 's' : ''} in pipeline
                </div>
              </div>
            </div>

            {/* ATS Kanban Columns View */}
            {atsDisplayMode === 'kanban' && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {pipelineStages.map(stage => {
                  const stageApps = filteredAtsApplications.filter(a => a.status === stage.key);

                  return (
                    <div key={stage.key} className="bg-slate-100/70 rounded-xl p-3 border border-slate-200/80 flex flex-col min-h-[500px]">
                      <div className="flex items-center justify-between pb-3 px-1 border-b border-slate-200">
                        <span className="text-xs font-bold text-slate-800">
                          {stage.label}
                        </span>
                        <span className="w-5 h-5 rounded-full bg-white text-slate-700 text-[11px] font-mono font-bold flex items-center justify-center shadow-2xs">
                          {stageApps.length}
                        </span>
                      </div>

                      <div className="space-y-3 mt-3 flex-1 overflow-y-auto">
                        {stageApps.length === 0 ? (
                          <div className="text-center py-10 text-[11px] text-slate-400">
                            No candidates in this stage
                          </div>
                        ) : (
                          stageApps.map(app => (
                            <div
                              key={app.id}
                              className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow space-y-3"
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="text-xs font-bold text-slate-900">
                                    {app.candidateName}
                                  </div>
                                  <div className="text-[11px] text-slate-500 font-mono">
                                    {app.candidatePrimaryPLM} · {app.candidateExperience} yrs
                                  </div>
                                  {selectedJobIdForAts === 'all' && (
                                    <div className="text-[10px] text-blue-700 font-medium truncate max-w-[170px] mt-0.5">
                                      {app.jobTitle}
                                    </div>
                                  )}
                                </div>

                                <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                                  {app.matchScore}%
                                </span>
                              </div>

                              <div className="text-[11px] text-slate-600 line-clamp-2 bg-slate-50 p-2 rounded">
                                "{app.coverNote}"
                              </div>

                              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                                <button
                                  onClick={() => setInspectedApp(app)}
                                  className="text-[11px] font-semibold text-slate-900 hover:text-blue-600 flex items-center gap-1 cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Inspect</span>
                                </button>

                                {/* Quick stage transition button */}
                                {stage.key === 'applied' && (
                                  <button
                                    onClick={() => updateApplicationStage(app.id, 'screening')}
                                    className="text-[10px] font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                                  >
                                    Move to Screen →
                                  </button>
                                )}
                                {stage.key === 'screening' && (
                                  <button
                                    onClick={() => updateApplicationStage(app.id, 'technical_interview')}
                                    className="text-[10px] font-medium text-purple-600 hover:text-purple-800 cursor-pointer"
                                  >
                                    Invite to Deep Dive →
                                  </button>
                                )}
                                {stage.key === 'technical_interview' && (
                                  <button
                                    onClick={() => updateApplicationStage(app.id, 'offer_extended')}
                                    className="text-[10px] font-medium text-emerald-600 hover:text-emerald-800 cursor-pointer"
                                  >
                                    Extend Offer →
                                  </button>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ATS Full Candidate Profiles View */}
            {atsDisplayMode === 'profiles' && (
              <div className="space-y-4">
                {filteredAtsApplications.length === 0 ? (
                  <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200 space-y-2">
                    <Users className="w-10 h-10 text-slate-300 mx-auto" />
                    <h3 className="text-sm font-bold text-slate-800">No applicant profiles in this filter</h3>
                    <p className="text-xs text-slate-400">Applications received across your positions will display here.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredAtsApplications.map(app => {
                      const cand = getCandidateProfileForApp(app);
                      return (
                        <div
                          key={app.id}
                          className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between space-y-4"
                        >
                          <div className="space-y-3">
                            {/* Position applied tag */}
                            <div className="flex items-center justify-between text-[11px] pb-2 border-b border-slate-100">
                              <span className="font-semibold text-blue-700 truncate max-w-[200px]">
                                {app.jobTitle}
                              </span>
                              <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                {app.matchScore}% Match
                              </span>
                            </div>

                            {/* Header: Avatar, Name, Headline */}
                            <div className="flex items-start gap-3 min-w-0">
                              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cand.accentColor || 'from-blue-600 to-indigo-600'} text-white font-bold text-sm flex items-center justify-center shadow-xs shrink-0`}>
                                {cand.avatarInitials || 'PLM'}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <h4 className="text-sm font-bold text-slate-900 truncate">
                                    {cand.name}
                                  </h4>
                                  {cand.verifiedSpecialist && (
                                    <span title="Verified PLM Specialist"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /></span>
                                  )}
                                </div>
                                <p className="text-xs text-slate-500 truncate">
                                  {cand.headline || 'PLM Specialist'}
                                </p>
                                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                                  <MapPin className="w-3 h-3 shrink-0" />
                                  <span className="truncate">{cand.location || 'Location Not Specified'}</span>
                                </div>
                              </div>
                            </div>

                            {/* PLM Competencies Badges */}
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="px-2 py-0.5 rounded bg-slate-900 text-white text-[11px] font-semibold">
                                {cand.primaryPLM}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-semibold font-mono">
                                {cand.yearsOfExperience} yrs
                              </span>
                              {cand.clearance && cand.clearance !== 'None' && (
                                <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold">
                                  {cand.clearance}
                                </span>
                              )}
                            </div>

                            {/* Specialized Modules */}
                            {cand.modules && cand.modules.length > 0 && (
                              <div className="flex flex-wrap items-center gap-1">
                                {cand.modules.slice(0, 3).map(m => (
                                  <span key={m} className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-slate-600 text-[10px]">
                                    {m}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Cover Note Quote */}
                            {app.coverNote && (
                              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-700 leading-relaxed italic line-clamp-2">
                                "{app.coverNote}"
                              </div>
                            )}

                            {/* Resume attachment chip */}
                            {(app.resumeFileName || cand.resumeFileName) && (
                              <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50/60 border border-blue-100 text-xs">
                                <div className="flex items-center gap-1.5 truncate">
                                  <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                  <span className="font-medium text-slate-800 truncate text-[11px]">
                                    {app.resumeFileName || cand.resumeFileName}
                                  </span>
                                </div>
                                <span className="text-[10px] text-blue-700 font-mono font-semibold bg-white px-1.5 py-0.5 rounded border border-blue-200 shrink-0">
                                  PDF
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Action Bar: Stage Selector & View Full Profile */}
                          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                            <select
                              value={app.status}
                              onChange={e => updateApplicationStage(app.id, e.target.value as any)}
                              className="text-[11px] font-semibold py-1 px-2 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:border-slate-900 cursor-pointer"
                            >
                              <option value="applied">Applied</option>
                              <option value="screening">Screening</option>
                              <option value="technical_interview">Tech Deep Dive</option>
                              <option value="offer_extended">Offer Extended</option>
                            </select>

                            <button
                              type="button"
                              onClick={() => setInspectedCandidate(cand)}
                              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Profile</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Inspected Applicant Modal */}
        {inspectedApp && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{inspectedApp.candidateName}</h3>
                  <div className="text-xs text-slate-500 font-mono">
                    Candidate for: {inspectedApp.jobTitle}
                  </div>
                </div>
                <button
                  onClick={() => setInspectedApp(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Algorithmic PLM Match:</span>
                  <span className="font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                    {inspectedApp.matchScore}% Qualified
                  </span>
                </div>
                <div className="text-slate-600">
                  Primary PLM: <strong className="text-slate-800">{inspectedApp.candidatePrimaryPLM}</strong> ({inspectedApp.candidateExperience} years experience)
                </div>
                <div className="text-slate-600 flex items-center gap-1.5 pt-1">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Attached: <strong className="font-mono">{inspectedApp.resumeFileName}</strong></span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Submitted Candidate Note
                </label>
                <div className="p-3 rounded-lg border border-slate-200 text-xs text-slate-800 bg-white leading-relaxed">
                  {inspectedApp.coverNote}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Update Candidate Stage
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['applied', 'screening', 'technical_interview', 'offer_extended'] as Application['status'][]).map(st => (
                    <button
                      key={st}
                      onClick={() => {
                        updateApplicationStage(inspectedApp.id, st);
                        setInspectedApp(null);
                      }}
                      className={`p-2 rounded-lg border text-xs font-medium capitalize text-center transition-colors cursor-pointer ${
                        inspectedApp.status === st
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 text-right">
                <button
                  onClick={() => setInspectedApp(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Candidate Profile Skills Modal */}
        {renderCandidateProfileModal()}

      </div>
    );
  }

  // Sub-view: Search & Browse PLM Job Seeker Profiles (Simple PLM Advisors format & Direct Connect)
  if (activeTab === 'search-candidates') {
    return (
      <div className="py-2">
        <CandidateSimpleListView />
      </div>
    );
  }

  // Sub-view: Employer Direct Connections & Sent Job Invitations
  if (activeTab === 'connections' || activeTab === 'matches') {
    return (
      <div className="py-2">
        <EmployerConnectionsView onBrowseCandidates={() => setActiveTab('search-candidates')} />
      </div>
    );
  }

  // Sub-view: Company Profile & Verification Credentials
  if (activeTab === 'company-profile') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Corporate Verification & PLM Stack Credentials
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Legitimacy credentials audited by the Main Admin before platform activation
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
          
          {/* Status Header */}
          <div className="flex items-center justify-between p-4 rounded-xl border bg-slate-50">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl text-white font-bold flex items-center justify-center ${currentEmployer.logoBg}`}>
                {currentEmployer.logoInitials}
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">{currentEmployer.companyName}</h2>
                <div className="text-xs text-slate-500 font-mono">{currentEmployer.legalEntity}</div>
              </div>
            </div>

            <div>
              {isVerified && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Verified Enterprise (Approved by Admin)
                </span>
              )}
              {isPending && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
                  <Clock className="w-4 h-4 text-amber-600" />
                  Pending Main Admin Verification
                </span>
              )}
              {isRejected && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  Verification Rejected
                </span>
              )}
            </div>
          </div>

          {/* Audit Data Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-lg border border-slate-200 space-y-1">
              <span className="text-slate-400 font-medium block">Corporate Domain</span>
              <span className="font-mono font-semibold text-slate-900">{currentEmployer.corporateDomain}</span>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 space-y-1">
              <span className="text-slate-400 font-medium block">Tax Registration / EIN</span>
              <span className="font-mono font-semibold text-slate-900">{currentEmployer.taxRegistrationNumber}</span>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 space-y-1">
              <span className="text-slate-400 font-medium block">Representative Lead</span>
              <span className="font-semibold text-slate-900">{currentEmployer.contactPerson} ({currentEmployer.contactTitle})</span>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 space-y-1">
              <span className="text-slate-400 font-medium block">Official Contact Email</span>
              <span className="font-mono font-semibold text-slate-900">{currentEmployer.contactEmail}</span>
            </div>
          </div>

          {/* PLM Tech Stack */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Declared PLM Environment
            </h3>
            <div className="flex flex-wrap gap-2">
              {currentEmployer.primaryPLMStack.map(sys => (
                <span key={sys} className="px-3 py-1 rounded-lg bg-slate-900 text-white text-xs font-medium">
                  {sys}
                </span>
              ))}
            </div>
          </div>

          {/* Attached Document */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Submitted Verification Document
            </h3>
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="font-mono text-slate-800">{currentEmployer.verificationDocName}</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Audited by Admin
              </span>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // DEFAULT VIEW: 'dashboard' (Enterprise Overview)
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Overview Header & Dual Registration Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Enterprise PLM Talent Portal
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Active Enterprise: <strong className="text-slate-900">{currentEmployer.companyName}</strong> · Legal Entity: <span className="font-mono">{currentEmployer.legalEntity}</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setActiveTab('search-candidates')}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search Job Seekers</span>
          </button>
        </div>
      </div>

      {/* VERIFICATION CALLOUT BANNER */}
      {!isVerified ? (
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 text-amber-800">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-amber-900">
                  Enterprise Verification Pending Review
                </h2>
                <span className="text-[10px] font-mono bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded font-semibold uppercase">
                  Admin Action Required
                </span>
              </div>
              <p className="text-xs text-amber-800 mt-1 max-w-2xl leading-relaxed">
                Your verification request for {currentEmployer.companyName} is queued for Main Admin audit. Once the Admin audits your legal credentials, your positions will immediately unlock for verified PLM candidates.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            <div className="text-xs text-emerald-900">
              <strong className="font-semibold">Verified PLM Enterprise:</strong> Your organization has passed corporate domain and tax registration audit. Active positions are broadcasted to certified Teamcenter, Windchill, and 3DEXPERIENCE engineers.
            </div>
          </div>
          <span className="text-[11px] font-mono text-emerald-800 font-semibold hidden sm:inline">
            Status: Active & Approved
          </span>
        </div>
      )}

      {/* Overview Metric Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-medium text-slate-500">Active PLM Positions</span>
          <div className="text-2xl font-bold font-mono text-slate-900">
            {employerJobs.filter(j => j.status === 'active').length}
          </div>
          <span className="text-[11px] text-slate-400">Published to network</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-medium text-slate-500">Candidate Inbound</span>
          <div className="text-2xl font-bold font-mono text-slate-900">
            {employerApplications.length}
          </div>
          <span className="text-[11px] text-slate-400">Total applications received</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-medium text-slate-500">Average Match Score</span>
          <div className="text-2xl font-bold font-mono text-blue-700">
            {employerApplications.length > 0
              ? Math.round(employerApplications.reduce((acc, a) => acc + a.matchScore, 0) / employerApplications.length)
              : 96}%
          </div>
          <span className="text-[11px] text-slate-400">Against required PLM stack</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-medium text-slate-500">Corporate Verification</span>
          <div className="text-lg font-bold text-slate-900 flex items-center gap-1.5 pt-0.5">
            {isVerified ? (
              <span className="text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-5 h-5" />
                Verified
              </span>
            ) : (
              <span className="text-amber-600 flex items-center gap-1">
                <Clock className="w-5 h-5" />
                Under Review
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-400">{currentEmployer.taxRegistrationNumber}</span>
        </div>
      </div>

      {/* Active Jobs Header & Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Enterprise Job Postings
            </h2>
            <p className="text-xs text-slate-500">
              Positions currently managed by {currentEmployer.companyName}
            </p>
          </div>

          <button
            onClick={() => {
              setIsCreatingJob(true);
              setActiveTab('published-jobs');
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New PLM Position</span>
          </button>
        </div>

        {employerJobs.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-800">No positions created yet</h3>
            <p className="text-xs text-slate-500">
              Publish your first Teamcenter, Windchill, or 3DEXPERIENCE opening to receive qualified applicants.
            </p>
            <button
              onClick={() => {
                setIsCreatingJob(true);
                setActiveTab('published-jobs');
              }}
              className="mt-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              Post First Position
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {employerJobs.map(job => {
              const jobApps = applications.filter(a => a.jobId === job.id);

              return (
                <div key={job.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{job.title}</h3>
                      {job.status === 'active' ? (
                        <span className="text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Live & Public
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Pending Admin Verification
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-blue-900">{job.primaryPLM}</span>
                      <span>·</span>
                      <span>{job.workplaceType} ({job.location})</span>
                      <span>·</span>
                      <span className="font-mono tabular-nums">
                        {job.compensation?.min ? `$${job.compensation.min.toLocaleString()} - $${job.compensation.max?.toLocaleString()}` : 'Competitive'}
                      </span>
                      <span>·</span>
                      <span>Posted {new Date(job.postedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => {
                        setSelectedJobIdForAts(job.id);
                        setPublishedJobsViewMode('ats');
                        setIsCreatingJob(false);
                        setActiveTab('published-jobs');
                      }}
                      className="px-3.5 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>{jobApps.length} Candidates</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
