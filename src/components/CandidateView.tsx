import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Job, PLMSystem, PLMModule, ClearanceLevel, Application } from '../types';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  ShieldCheck, 
  CheckCircle2, 
  Bookmark, 
  BookmarkCheck, 
  Clock, 
  SlidersHorizontal,
  ChevronRight,
  Send,
  Building2,
  Cpu,
  Layers,
  Sparkles,
  FileText,
  UserCheck,
  ArrowUpRight,
  X,
  Edit3,
  Zap
} from 'lucide-react';
import { EditCandidateModal } from './EditCandidateModal';
import { CandidateInvitationsView } from './CandidateInvitationsView';

interface CandidateViewProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenRegisterCandidateModal?: () => void;
  onOpenRegisterEmployerModal?: () => void;
}

const PLM_SYSTEM_OPTIONS: (PLMSystem | 'All')[] = [
  'All',
  'Siemens Teamcenter',
  'PTC Windchill',
  'Dassault 3DEXPERIENCE / ENOVIA',
  'Aras Innovator',
  'SAP PLM',
];

const PLM_MODULE_OPTIONS: (PLMModule | 'All')[] = [
  'All',
  'BOM & Part Architecture',
  'Active Workspace (AWC)',
  'CAD / MCAD Integration',
  'Engineering Change (ECN/ECO)',
  'Requirements & MBSE',
  'Data Migration & ETL',
];

export const CandidateView: React.FC<CandidateViewProps> = ({ 
  activeTab, 
  setActiveTab,
  onOpenRegisterCandidateModal,
  onOpenRegisterEmployerModal
}) => {
  const { 
    jobs, 
    candidate, 
    updateCandidate, 
    applications, 
    applyToJob, 
    savedJobIds, 
    toggleSaveJob,
    employers 
  } = useApp();

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSystem, setSelectedSystem] = useState<PLMSystem | 'All'>('All');
  const [selectedModule, setSelectedModule] = useState<PLMModule | 'All'>('All');
  const [clearanceFilter, setClearanceFilter] = useState<'All' | 'ITAR' | 'Commercial'>('All');
  const [workplaceFilter, setWorkplaceFilter] = useState<'All' | 'Remote' | 'Hybrid' | 'Onsite'>('All');

  // Job Modal & Application Modal
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [coverNote, setCoverNote] = useState('');
  const [resumeFileName, setResumeFileName] = useState('Candidate_PLM_Resume.pdf');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Filtered jobs calculation
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // Only show jobs from verified employers or active jobs to candidate
      if (job.status !== 'active') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesText = 
          job.title.toLowerCase().includes(q) ||
          job.employerName.toLowerCase().includes(q) ||
          job.primaryPLM.toLowerCase().includes(q) ||
          job.summary.toLowerCase().includes(q);
        if (!matchesText) return false;
      }

      if (selectedSystem !== 'All') {
        const matchesSys = job.primaryPLM === selectedSystem || (job.relatedSystems || []).includes(selectedSystem);
        if (!matchesSys) return false;
      }

      if (selectedModule !== 'All') {
        if (!(job.requiredModules || []).includes(selectedModule)) return false;
      }

      if (clearanceFilter === 'ITAR') {
        if (!job.itarRequired) return false;
      } else if (clearanceFilter === 'Commercial') {
        if (job.itarRequired) return false;
      }

      if (workplaceFilter !== 'All') {
        if (job.workplaceType !== workplaceFilter) return false;
      }

      return true;
    });
  }, [jobs, searchQuery, selectedSystem, selectedModule, clearanceFilter, workplaceFilter]);

  // Compute match score helper
  const computeMatch = (job: Job) => {
    if (!job || !candidate) return 70;
    let score = 70;
    if (candidate.primaryPLM === job.primaryPLM) score += 15;
    else if ((job.relatedSystems || []).includes(candidate.primaryPLM) || (candidate.secondaryPLMs || []).includes(job.primaryPLM)) score += 8;

    const candidateModules = candidate.modules || [];
    const jobModules = job.requiredModules || [];
    const matchingMods = jobModules.filter(m => candidateModules.includes(m));
    score += Math.min(10, matchingMods.length * 3);

    if (job.itarRequired && candidate.clearance && candidate.clearance !== 'None') score += 5;
    return Math.min(99, score);
  };

  const handleOpenApplyModal = (job: Job) => {
    setSelectedJob(job);
    const reqMods = job.requiredModules || [];
    setCoverNote(
      `Hello ${job.employerName || 'Enterprise'} hiring team,\n\nI am applying for the ${job.title} role. With ${candidate?.yearsOfExperience || 3} years dedicated to ${candidate?.primaryPLM || job.primaryPLM || 'PLM'}, I have extensive experience in ${reqMods.slice(0, 2).join(' and ') || 'system architecture'}.\n\nMy profile and certifications are verified on PLMSpider.`
    );
    setIsApplying(true);
  };

  const handleDirectApply = (job: Job) => {
    const defaultCoverNote = `Hello ${job.employerName || 'Enterprise'} hiring team,\n\nI am applying for the ${job.title} role via verified 1-click application. My PLM credentials and experience are verified on PLMSpider.`;
    return applyToJob(job.id, defaultCoverNote, resumeFileName);
  };

  const handleConfirmApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;
    const res = applyToJob(selectedJob.id, coverNote, resumeFileName);
    setIsApplying(false);
    if (res.success) {
      setSelectedJob(null);
    }
  };

  // Render Sub-Views based on activeTab
  if (activeTab === 'applications') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              My PLM Applications Pipeline
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Track status, match scores, and interview updates from verified enterprises
            </p>
          </div>
          <button
            onClick={() => setActiveTab('explore')}
            className="px-3.5 py-2 text-xs font-semibold text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            ← Back to Job Search
          </button>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
            <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-800">No active applications yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Browse positions exclusively matching your PLM toolset (Teamcenter, Windchill, 3DEXPERIENCE) and submit your profile in one click.
            </p>
            <button
              onClick={() => setActiveTab('explore')}
              className="mt-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
            >
              Browse PLM Jobs
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map(app => {
              const stages: { key: Application['status']; label: string }[] = [
                { key: 'applied', label: 'Application Received' },
                { key: 'screening', label: 'Hiring Team Screening' },
                { key: 'technical_interview', label: 'Architecture Deep Dive' },
                { key: 'offer_extended', label: 'Formal Offer' },
              ];

              const currentStageIndex = stages.findIndex(s => s.key === app.status);

              return (
                <div key={app.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-slate-900">{app.jobTitle}</h2>
                        <span className="text-xs font-mono font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          {app.matchScore}% Match
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <span className="font-semibold text-slate-800">{app.employerName}</span>
                        <span>·</span>
                        <span>Applied {new Date(app.appliedDate).toLocaleDateString()}</span>
                        <span>·</span>
                        <span className="font-mono text-slate-600">{app.resumeFileName}</span>
                      </div>
                    </div>

                    <div className="text-right sm:shrink-0">
                      <span className="text-xs font-medium text-slate-500 block">Current Status</span>
                      <span className="text-xs font-bold text-slate-900 capitalize">
                        {app.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Stage Stepper */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    {stages.map((stage, idx) => {
                      const isComplete = currentStageIndex >= idx;
                      const isCurrent = currentStageIndex === idx;

                      return (
                        <div 
                          key={stage.key}
                          className={`p-3 rounded-lg border text-left transition-colors ${
                            isCurrent
                              ? 'bg-slate-900 text-white border-slate-900'
                              : isComplete
                              ? 'bg-slate-50 text-slate-800 border-slate-200'
                              : 'bg-white text-slate-400 border-slate-100'
                          }`}
                        >
                          <div className="text-[10px] font-mono uppercase tracking-wider mb-1 opacity-80">
                            Stage 0{idx + 1}
                          </div>
                          <div className="text-xs font-semibold leading-tight">
                            {stage.label}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Cover Note Extract */}
                  <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600">
                    <span className="font-semibold text-slate-800">Your Submitted Note: </span>
                    <span className="italic">"{app.coverNote}"</span>
                  </div>

                  {app.internalNotes && (
                    <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-100 text-xs text-blue-900 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Enterprise Feedback Note:</strong> {app.internalNotes}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Sub-view: Incoming Job Invitations & Active Direct Connections
  if (activeTab === 'invitations' || activeTab === 'invites' || activeTab === 'matches' || activeTab === 'connections') {
    return (
      <div className="py-2">
        <CandidateInvitationsView 
          initialTab={activeTab === 'connections' ? 'connections' : activeTab === 'invitations' ? 'invitations' : 'all'}
          onBackToJobs={() => setActiveTab('explore')} 
        />
      </div>
    );
  }

  if (activeTab === 'profile') {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              PLM Engineer Profile & Verified Credentials
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Your profile is matched exclusively with certified enterprise PLM projects
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Verified PLM Specialist
            </span>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* Candidate Identity Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-slate-900 text-white font-bold text-xl flex items-center justify-center shadow-sm">
                {candidate?.avatarInitials || 'PLM'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900">{candidate?.name || 'Candidate Profile'}</h2>
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(true)}
                    className="p-1 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                    title="Edit Profile"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-slate-600 max-w-xl mt-0.5">{candidate?.headline || 'Configure your verified PLM competencies'}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
                  <span>{candidate?.location || 'Location Pending'}</span>
                  {candidate?.phone && (
                    <>
                      <span>·</span>
                      <span className="font-mono">{candidate.phone}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="text-right sm:shrink-0">
              <span className="text-xs text-slate-400 block">Total Experience</span>
              <span className="text-xl font-bold font-mono text-slate-900">
                {candidate?.yearsOfExperience ?? 0} Years
              </span>
            </div>
          </div>

          {/* PLM Core Attributes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Primary PLM Platform
              </h3>
              <div className="p-3 rounded-lg bg-slate-900 text-white text-xs font-semibold flex items-center justify-between">
                <span>{candidate?.primaryPLM || 'Siemens Teamcenter'}</span>
                <span className="text-[10px] font-mono text-slate-300">{candidate?.yearsOfExperience ?? 0} yrs</span>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Secondary Systems
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {(candidate?.secondaryPLMs || []).map(s => (
                  <span key={s} className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Defense / Export Clearance
              </h3>
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
                <span>{candidate?.clearance || 'None'}</span>
              </div>
            </div>
          </div>

          {/* Specialized Modules */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Domain Competencies & Modules
            </h3>
            <div className="flex flex-wrap gap-2">
              {(candidate?.modules || []).map(mod => (
                <span key={mod} className="px-3 py-1 text-xs rounded-lg bg-slate-100 text-slate-800 font-medium">
                  {mod}
                </span>
              ))}
            </div>
          </div>

          {/* CAD Environments */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Integrated CAD Tools
            </h3>
            <div className="flex flex-wrap gap-2">
              {(candidate?.cadTools || []).map(cad => (
                <span key={cad} className="px-3 py-1 text-xs rounded-lg border border-slate-200 text-slate-800 font-mono">
                  {cad}
                </span>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Verified OEM Certifications
            </h3>
            <div className="space-y-2">
              {(candidate?.certifications || []).map((cert, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{cert}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Portfolio & Major Deployments */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Selected Enterprise Deployments & Migrations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(candidate?.portfolioProjects || []).map((p, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                  <div className="text-xs font-bold text-slate-900">{p.title}</div>
                  <div className="text-[11px] font-mono text-blue-700">{p.system}</div>
                  <p className="text-xs text-slate-600">{p.description}</p>
                  <div className="text-xs font-medium text-emerald-700 pt-1">
                    Impact: {p.impact}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Edit Candidate Profile Modal */}
        <EditCandidateModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
        />
      </div>
    );
  }

  if (activeTab === 'directory') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Verified PLM Enterprise Network
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            All employers on this directory have completed corporate domain audit and legal verification by the Main Admin
          </p>
        </div>

        {employers.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-800">No enterprises registered yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Verified corporate enterprises will appear here once registered and approved.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {employers.map(emp => {
            const isVerified = emp.verificationStatus === 'verified';
            const companyJobs = jobs.filter(j => j.employerId === emp.id && j.status === 'active');

            return (
              <div key={emp.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl text-white font-bold flex items-center justify-center ${emp.logoBg}`}>
                      {emp.logoInitials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-slate-900">{emp.companyName}</h2>
                        {isVerified ? (
                          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Verified
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            <Clock className="w-3.5 h-3.5" />
                            Audit Pending
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span>{emp.industry}</span>
                        <span>·</span>
                        <span>{emp.headquarters}</span>
                        <span>·</span>
                        <span>{emp.companySize}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {emp.about}
                </p>

                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">PLM Stack:</span>
                    <span className="font-semibold text-slate-800">
                      {emp.primaryPLMStack.join(', ')}
                    </span>
                  </div>

                  <span className="font-mono text-slate-500">
                    {companyJobs.length} Active Positions
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

  // DEFAULT VIEW: 'explore' (Job Search Board)
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Hero Header with Anti-Slop Cleanliness */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Product Lifecycle Management Careers
        </h1>
        <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
          The curated talent exchange strictly reserved for Siemens Teamcenter, PTC Windchill, Dassault 3DEXPERIENCE, and Aras Innovator specialists. Every posting is pre-verified with corporate engineering teams.
        </p>
      </div>


      {/* Search & Filter Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-4">
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by title, Teamcenter, Windchill, Active Workspace, BMIDE, ITAR, company..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
          />
        </div>

        {/* Interactive Segmented Filter Controls */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          
          {/* Primary PLM System Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-semibold text-slate-400 whitespace-nowrap mr-1">
              PLM Platform:
            </span>
            <div className="flex items-center gap-1.5 flex-nowrap">
              {PLM_SYSTEM_OPTIONS.map(sys => {
                const isSelected = selectedSystem === sys;
                return (
                  <button
                    key={sys}
                    onClick={() => setSelectedSystem(sys)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {sys}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Module & Clearance Dropdowns */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium">Domain Module:</span>
              <select
                value={selectedModule}
                onChange={e => setSelectedModule(e.target.value as any)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-slate-900"
              >
                {PLM_MODULE_OPTIONS.map(mod => (
                  <option key={mod} value={mod}>{mod}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium">Clearance / ITAR:</span>
              <select
                value={clearanceFilter}
                onChange={e => setClearanceFilter(e.target.value as any)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-slate-900"
              >
                <option value="All">All Requirements</option>
                <option value="ITAR">ITAR Defense Only</option>
                <option value="Commercial">Commercial (No Clearance)</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium">Workplace:</span>
              <select
                value={workplaceFilter}
                onChange={e => setWorkplaceFilter(e.target.value as any)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-slate-900"
              >
                <option value="All">All Locations</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Onsite">Onsite</option>
              </select>
            </div>

            {(searchQuery || selectedSystem !== 'All' || selectedModule !== 'All' || clearanceFilter !== 'All' || workplaceFilter !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSystem('All');
                  setSelectedModule('All');
                  setClearanceFilter('All');
                  setWorkplaceFilter('All');
                }}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium ml-auto"
              >
                Reset Filters
              </button>
            )}
          </div>

        </div>

      </div>

      {/* Results Count & Match Prompt */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div>
          Showing <span className="font-semibold text-slate-900 font-mono">{filteredJobs.length}</span> verified PLM positions
        </div>
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Match algorithms calculated against your verified {candidate?.primaryPLM || 'PLM'} profile</span>
        </div>
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
            <SlidersHorizontal className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-800">
              {jobs.length === 0 ? 'No PLM positions posted yet' : 'No matching positions found'}
            </h3>
            <p className="text-xs text-slate-500">
              {jobs.length === 0 
                ? 'Positions will appear here as employers publish new Teamcenter, Windchill, and 3DEXPERIENCE requisitions.'
                : 'Try adjusting your PLM platform or clearance filters to explore other enterprise programs.'}
            </p>
          </div>
        ) : (
          filteredJobs.map(job => {
            const matchScore = computeMatch(job);
            const isSaved = (savedJobIds || []).includes(job.id);
            const hasApplied = (applications || []).some(
              a => a.jobId === job.id && (a.candidateId === candidate?.id || (candidate?.email && a.candidateEmail === candidate.email))
            );

            return (
              <div
                key={job.id}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:border-slate-300 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  
                  {/* Employer Logo & Titles */}
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl text-white font-bold flex items-center justify-center shrink-0 ${job.employerLogoBg || 'bg-slate-900'}`}>
                      {job.employerLogoInitials || (job.title ? job.title.slice(0, 2).toUpperCase() : 'PLM')}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => setSelectedJob(job)}
                          className="text-base font-bold text-slate-900 hover:text-blue-600 transition-colors text-left"
                        >
                          {job.title}
                        </button>
                        
                        {job.isEmployerVerified && (
                          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200" title="Verified by Platform Admin">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Verified Enterprise
                          </span>
                        )}
                      </div>

                      {/* ZERO-PILL METADATA LINE (Section 1.A Rule) */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="font-semibold text-slate-800">{job.employerName || 'Verified Enterprise'}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-medium text-blue-900">{job.primaryPLM || 'PLM Specialist'}</span>
                        <span aria-hidden="true">·</span>
                        <span>{job.workplaceType || 'Remote / Hybrid'} ({job.location || 'Global'})</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums text-slate-700">
                          {job.compensation?.min ? `$${job.compensation.min.toLocaleString()} - $${job.compensation.max?.toLocaleString()} ${job.compensation.period === 'hourly' ? '/ hr' : '/ yr'}` : 'Competitive Compensation'}
                        </span>
                        {job.itarRequired && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-amber-800 font-medium">ITAR Defense</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions & Match Badge */}
                  <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-start gap-2 shrink-0">
                    <div className="flex items-center gap-1 text-xs font-semibold text-blue-800 bg-blue-50/80 px-2.5 py-1 rounded-md border border-blue-100 font-mono">
                      <span>{matchScore}% Match</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleSaveJob(job.id)}
                        className={`p-2 rounded-lg border transition-colors ${
                          isSaved ? 'text-amber-600 border-amber-200 bg-amber-50' : 'text-slate-400 border-slate-200 hover:text-slate-700'
                        }`}
                        title={isSaved ? 'Bookmarked' : 'Save job'}
                      >
                        {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                      </button>

                      {hasApplied ? (
                        <button
                          onClick={() => setActiveTab('applications')}
                          className="px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Applied</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleDirectApply(job)}
                          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shadow-sm flex items-center gap-1.5"
                        >
                          <Zap className="w-3.5 h-3.5 text-amber-300" />
                          <span>1-Click Apply</span>
                        </button>
                      )}
                    </div>
                  </div>

                </div>

                {/* Job Summary */}
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {job.summary}
                </p>

                {/* Required Modules & CAD Tools */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className="text-slate-400 mr-1">Modules:</span>
                    {(job.requiredModules || []).map(mod => (
                      <span key={mod} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {mod}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => setSelectedJob(job)}
                    className="text-xs font-semibold text-slate-900 hover:text-blue-600 flex items-center gap-1 transition-colors"
                  >
                    <span>View Specifications</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* JOB SPECIFICATION MODAL */}
      {selectedJob && !isApplying && (() => {
        const hasAppliedToSelected = Boolean(
          (applications || []).some(
            a => a.jobId === selectedJob.id && (a.candidateId === candidate?.id || (candidate?.email && a.candidateEmail === candidate.email))
          )
        );

        return (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
              
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl text-white font-bold flex items-center justify-center shrink-0 ${selectedJob.employerLogoBg || 'bg-slate-900'}`}>
                    {selectedJob.employerLogoInitials || (selectedJob.title ? selectedJob.title.slice(0, 2).toUpperCase() : 'PLM')}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{selectedJob.title}</h2>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                      <span className="font-semibold text-slate-800">{selectedJob.employerName || 'Verified Enterprise'}</span>
                      <span>·</span>
                      <span>{selectedJob.primaryPLM || 'PLM Specialist'}</span>
                      <span>·</span>
                      <span>{selectedJob.workplaceType || 'Remote / Hybrid'}</span>
                      <span>·</span>
                      <span className="font-mono text-slate-700">
                        {selectedJob.compensation?.min ? `$${selectedJob.compensation.min.toLocaleString()} - $${selectedJob.compensation.max?.toLocaleString()}` : 'Competitive Compensation'}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 leading-relaxed">
                
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Role Overview
                  </h3>
                  <p>{selectedJob.summary || 'Enterprise engineering role focusing on PLM architecture, system administration, and digital thread integration.'}</p>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Key Technical Responsibilities
                  </h3>
                  <ul className="space-y-2 list-disc pl-5">
                    {(selectedJob.responsibilities && selectedJob.responsibilities.length > 0 ? selectedJob.responsibilities : [
                      'Architect, configure, and maintain enterprise PLM environments and data models.',
                      'Collaborate with multi-disciplinary engineering teams to support CAD integrations and release processes.',
                      'Design lifecycle workflows, access rules, and automated revision controls.'
                    ]).map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Prerequisites & Qualifications
                  </h3>
                  <ul className="space-y-2 list-disc pl-5">
                    {(selectedJob.requirements && selectedJob.requirements.length > 0 ? selectedJob.requirements : [
                      'Demonstrated hands-on experience in enterprise PLM systems and data schemas.',
                      'Solid understanding of CAD data management and product lifecycle best practices.'
                    ]).map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Required PLM Modules
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(selectedJob.requiredModules && selectedJob.requiredModules.length > 0 ? selectedJob.requiredModules : ['BOM & Part Architecture', 'Engineering Change']).map(m => (
                        <span key={m} className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800 text-[11px]">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                      CAD Integrations
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(selectedJob.cadIntegration && selectedJob.cadIntegration.length > 0 ? selectedJob.cadIntegration : ['Enterprise CAD Suites']).map(c => (
                        <span key={c} className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800 text-[11px] font-mono">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                <button
                  onClick={() => setSelectedJob(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Close
                </button>

                {hasAppliedToSelected ? (
                  <div className="flex items-center gap-2">
                    <span className="px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Application Submitted</span>
                    </span>
                    <button
                      onClick={() => {
                        setSelectedJob(null);
                        setActiveTab('applications');
                      }}
                      className="px-4 py-2 text-xs font-semibold text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      View in Pipeline →
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenApplyModal(selectedJob)}
                      className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      Apply with Custom Note
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDirectApply(selectedJob)}
                      className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-300" />
                      <span>1-Click Apply Now</span>
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        );
      })()}

      {/* 1-CLICK APPLY MODAL */}
      {isApplying && selectedJob && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Submit Verified Application
                </h3>
                <p className="text-xs text-slate-500">
                  Applying to <strong className="text-slate-800">{selectedJob.title}</strong> at {selectedJob.employerName}
                </p>
              </div>
              <button
                onClick={() => setIsApplying(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmApply} className="p-6 space-y-4">
              
              {/* Profile Overview Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-slate-900">{candidate?.name || 'Candidate'}</div>
                  <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-semibold border border-emerald-200">
                    {computeMatch(selectedJob)}% PLM Match
                  </span>
                </div>
                <div className="text-slate-600 text-[11px]">
                  {candidate?.primaryPLM || 'Siemens Teamcenter'} · {candidate?.yearsOfExperience ?? 0} yrs · {candidate?.clearance || 'None'}
                </div>
              </div>

              {/* Cover Note */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  PLM Technical Note to Hiring Team
                </label>
                <textarea
                  rows={4}
                  value={coverNote}
                  onChange={e => setCoverNote(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 leading-relaxed font-sans"
                  placeholder="Describe your hands-on experience with this exact PLM environment..."
                />
              </div>

              {/* Resume Selector */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Attached Verified Credentials
                </label>
                <div className="p-3 rounded-lg border border-slate-200 flex items-center justify-between text-xs bg-white">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="font-mono text-slate-800">{resumeFileName}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">1.2 MB PDF</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-100 text-[11px] text-blue-900">
                Submitting this application securely dispatches your verified credentials and resume to the employer's talent team.
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsApplying(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Application</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
