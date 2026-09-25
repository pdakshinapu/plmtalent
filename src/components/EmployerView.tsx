import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PLMSystem, PLMModule, CADTool, ClearanceLevel, Application } from '../types';
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
  Filter,
  Eye,
  Check,
  X
} from 'lucide-react';

interface EmployerViewProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenRegisterModal: () => void;
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
  onOpenRegisterModal 
}) => {
  const { 
    currentEmployer, 
    jobs, 
    applications, 
    postJob, 
    updateApplicationStage,
    setRole
  } = useApp();

  // Job Creator Form State
  const [jobTitle, setJobTitle] = useState('');
  const [primaryPLM, setPrimaryPLM] = useState<PLMSystem>(
    currentEmployer?.primaryPLMStack[0] || 'Siemens Teamcenter'
  );
  const [selectedModules, setSelectedModules] = useState<PLMModule[]>([
    'BOM & Part Architecture', 
    'Engineering Change (ECN/ECO)'
  ]);
  const [selectedCAD, setSelectedCAD] = useState<CADTool[]>([
    currentEmployer?.cadEnvironments[0] || 'Siemens NX'
  ]);
  const [experienceLevel, setExperienceLevel] = useState<'Junior (1-3 yrs)' | 'Mid-Senior (4-7 yrs)' | 'Lead / Architect (8+ yrs)' | 'Principal / Director'>('Lead / Architect (8+ yrs)');
  const [employmentType, setEmploymentType] = useState<'Full-Time Permanent' | 'Contract (W2/C2C)' | 'Contract-to-Hire'>('Full-Time Permanent');
  const [workplaceType, setWorkplaceType] = useState<'Remote' | 'Hybrid' | 'Onsite'>('Remote');
  const [location, setLocation] = useState('Remote (United States)');
  const [minComp, setMinComp] = useState<number>(150000);
  const [maxComp, setMaxComp] = useState<number>(180000);
  const [compPeriod, setCompPeriod] = useState<'yearly' | 'hourly'>('yearly');
  const [itarRequired, setItarRequired] = useState(false);
  const [summary, setSummary] = useState('');
  const [responsibilities, setResponsibilities] = useState(
    '• Architect and deploy PLM data schema extensions and business process workflows.\n• Configure CAD connectors and multi-CAD BOM alignment.\n• Support engineering change orders (ECO) and revision governance.'
  );
  const [requirements, setRequirements] = useState(
    '• 5+ years dedicated enterprise PLM experience.\n• Hands-on mastery of system administration and configuration tools.\n• Proven track record in aerospace or industrial engineering lifecycles.'
  );

  // ATS selected application modal
  const [inspectedApp, setInspectedApp] = useState<Application | null>(null);

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

  const employerJobs = jobs.filter(j => j.employerId === currentEmployer.id);
  const employerApplications = applications.filter(a => a.employerId === currentEmployer.id);

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
    if (!jobTitle) return;

    postJob({
      title: jobTitle,
      primaryPLM,
      relatedSystems: [],
      requiredModules: selectedModules,
      cadIntegration: selectedCAD,
      experienceLevel,
      employmentType,
      workplaceType,
      location,
      compensation: {
        min: Number(minComp),
        max: Number(maxComp),
        currency: 'USD',
        period: compPeriod,
      },
      itarRequired,
      clearanceRequired: itarRequired ? 'ITAR / Export Controlled' : 'None',
      summary: summary || `Leading PLM engineering opportunity at ${currentEmployer.companyName} focusing on ${primaryPLM} architecture and digital thread integration.`,
      responsibilities: responsibilities.split('\n').filter(r => r.trim().length > 0),
      requirements: requirements.split('\n').filter(r => r.trim().length > 0),
    });

    setJobTitle('');
    setActiveTab('dashboard');
  };

  // Sub-view: Post Job
  if (activeTab === 'post-job') {
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
            <button
              onClick={() => setRole('admin')}
              className="px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              Verify in Admin Console →
            </button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Publish Specialized PLM Position
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Structured specifically for Teamcenter, Windchill, 3DEXPERIENCE, and Aras architectures
            </p>
          </div>
          <button
            onClick={() => setActiveTab('dashboard')}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 rounded-lg"
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
                  onChange={e => setMinComp(Number(e.target.value))}
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
                  onChange={e => setMaxComp(Number(e.target.value))}
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
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-slate-900 font-mono text-[11px]"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
            >
              {isVerified ? 'Publish Live PLM Position' : 'Save Position (Awaiting Admin Verification)'}
            </button>
          </div>

        </form>
      </div>
    );
  }

  // Sub-view: Applicant ATS Pipeline
  if (activeTab === 'pipeline') {
    const pipelineStages: { key: Application['status']; label: string }[] = [
      { key: 'applied', label: 'New Applied' },
      { key: 'screening', label: 'Screening' },
      { key: 'technical_interview', label: 'Tech Deep Dive' },
      { key: 'offer_extended', label: 'Offer Extended' },
    ];

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              PLM Applicant Tracking System (ATS)
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Review certified engineers, inspect PLM match scores, and schedule architecture screenings
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {employerApplications.length} Total Applicants
          </span>
        </div>

        {/* ATS Kanban Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {pipelineStages.map(stage => {
            const stageApps = employerApplications.filter(a => a.status === stage.key);

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
                            className="text-[11px] font-semibold text-slate-900 hover:text-blue-600 flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Inspect</span>
                          </button>

                          {/* Quick stage transition button */}
                          {stage.key === 'applied' && (
                            <button
                              onClick={() => updateApplicationStage(app.id, 'screening')}
                              className="text-[10px] font-medium text-blue-600 hover:text-blue-800"
                            >
                              Move to Screen →
                            </button>
                          )}
                          {stage.key === 'screening' && (
                            <button
                              onClick={() => updateApplicationStage(app.id, 'technical_interview')}
                              className="text-[10px] font-medium text-purple-600 hover:text-purple-800"
                            >
                              Invite to Deep Dive →
                            </button>
                          )}
                          {stage.key === 'technical_interview' && (
                            <button
                              onClick={() => updateApplicationStage(app.id, 'offer_extended')}
                              className="text-[10px] font-medium text-emerald-600 hover:text-emerald-800"
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
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
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
                <div className="text-slate-600">
                  Email: <span className="font-mono text-slate-800">{inspectedApp.candidateEmail}</span>
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
                      className={`p-2 rounded-lg border text-xs font-medium capitalize text-center transition-colors ${
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
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

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
          <button
            onClick={onOpenRegisterModal}
            className="px-3.5 py-2 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100"
          >
            + Register Another Organization
          </button>
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
                <div className="text-right">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
                    <Clock className="w-4 h-4 text-amber-600" />
                    Pending Main Admin Verification
                  </span>
                  <button
                    onClick={() => setRole('admin')}
                    className="text-[11px] text-amber-900 underline block mt-1 hover:text-amber-950 font-medium"
                  >
                    Switch to Admin to Approve →
                  </button>
                </div>
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
                When you registered {currentEmployer.companyName}, an automated notification was emailed to the Main Admin (<span className="font-mono text-amber-950">admin@plmnexus.internal</span>). Once the Admin audits your legal credentials, your positions will immediately unlock for verified PLM candidates.
              </p>
            </div>
          </div>

          <button
            onClick={() => setRole('admin')}
            className="px-4 py-2 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-xl transition-colors whitespace-nowrap shadow-sm shrink-0 flex items-center gap-1.5"
          >
            <span>Switch to Admin & Verify</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
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
            onClick={() => setActiveTab('post-job')}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-1.5"
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
              onClick={() => setActiveTab('post-job')}
              className="mt-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
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
                        ${job.compensation.min.toLocaleString()} - ${job.compensation.max.toLocaleString()}
                      </span>
                      <span>·</span>
                      <span>Posted {new Date(job.postedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => setActiveTab('pipeline')}
                      className="px-3.5 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
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
