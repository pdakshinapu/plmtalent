import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PLMSystem, PLMModule, CADTool, ClearanceLevel } from '../types';
import { 
  X, 
  UserCheck, 
  ShieldCheck, 
  Upload, 
  Check, 
  AlertCircle, 
  ArrowRight,
  CheckCircle2,
  FileText,
  Sparkles,
  Briefcase,
  Layers,
  Award
} from 'lucide-react';

interface RegisterCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AVAILABLE_PLM_SYSTEMS: PLMSystem[] = [
  'Siemens Teamcenter',
  'PTC Windchill',
  'Dassault 3DEXPERIENCE / ENOVIA',
  'Aras Innovator',
  'SAP PLM',
  'Autodesk Fusion / Upchain',
  'Arena PLM',
  'Agile PLM'
];

const AVAILABLE_MODULES: PLMModule[] = [
  'BOM & Part Architecture',
  'Active Workspace (AWC)',
  'CAD / MCAD Integration',
  'ECAD Integration',
  'Engineering Change (ECN/ECO)',
  'Requirements & MBSE',
  'Manufacturing Process (MPP)',
  'Quality & CAPA',
  'Supplier Collaboration',
  'Data Migration & ETL'
];

const AVAILABLE_CAD_TOOLS: CADTool[] = [
  'Siemens NX',
  'CATIA V5/V6',
  'PTC Creo',
  'SolidWorks',
  'Autodesk Inventor',
  'Altium Designer'
];

const CLEARANCE_OPTIONS: ClearanceLevel[] = [
  'None',
  'ITAR / Export Controlled',
  'Secret',
  'Top Secret'
];

export const RegisterCandidateModal: React.FC<RegisterCandidateModalProps> = ({ 
  isOpen, 
  onClose,
  onSuccess
}) => {
  const { registerCandidate, setRole } = useApp();

  // Form state
  const [name, setName] = useState('');
  const [headline, setHeadline] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState<number>(7);
  const [primaryPLM, setPrimaryPLM] = useState<PLMSystem>('Siemens Teamcenter');
  const [secondaryPLMs, setSecondaryPLMs] = useState<PLMSystem[]>(['PTC Windchill']);
  const [modules, setModules] = useState<PLMModule[]>([
    'BOM & Part Architecture',
    'Active Workspace (AWC)',
    'CAD / MCAD Integration'
  ]);
  const [cadTools, setCadTools] = useState<CADTool[]>(['Siemens NX']);
  const [clearance, setClearance] = useState<ClearanceLevel>('ITAR / Export Controlled');
  const [currentCompany, setCurrentCompany] = useState('');
  const [currentRole, setCurrentRole] = useState('');
  const [expectedCompensation, setExpectedCompensation] = useState('$150,000 - $170,000 / year');
  const [availableFrom, setAvailableFrom] = useState('2 Weeks Notice');
  const [bio, setBio] = useState('');
  const [certificationsText, setCertificationsText] = useState('Siemens Teamcenter Certified Professional, AWC 6.x Specialist');
  const [resumeFileName, setResumeFileName] = useState('Candidate_PLM_Specialist_Resume.pdf');
  
  // Highlight Project
  const [projectTitle, setProjectTitle] = useState('Enterprise Active Workspace 6.2 Migration');
  const [projectSystem, setProjectSystem] = useState('Siemens Teamcenter 14.x / AWC');
  const [projectDesc, setProjectDesc] = useState('Architected global multi-site BMIDE data model consolidation and modernized rich client users to Active Workspace.');
  const [projectImpact, setProjectImpact] = useState('Accelerated CAD check-in throughput by 42% across 3 global design engineering sites.');

  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [registeredId, setRegisteredId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const toggleSecondaryPLM = (system: PLMSystem) => {
    setSecondaryPLMs(prev => 
      prev.includes(system) ? prev.filter(s => s !== system) : [...prev, system]
    );
  };

  const toggleModule = (mod: PLMModule) => {
    setModules(prev => 
      prev.includes(mod) ? prev.filter(m => m !== mod) : [...prev, mod]
    );
  };

  const toggleCAD = (tool: CADTool) => {
    setCadTools(prev => 
      prev.includes(tool) ? prev.filter(t => t !== tool) : [...prev, tool]
    );
  };

  const handleFillDemo = () => {
    setName('Elena Rostova');
    setHeadline('Senior Siemens Teamcenter Solution Architect | AWC 6.3 & BMIDE Specialist');
    setEmail('elena.rostova@plm-engineers.net');
    setPhone('+1 (313) 555-0182');
    setLocation('Detroit, MI (Open to Hybrid / Remote)');
    setYearsOfExperience(9);
    setPrimaryPLM('Siemens Teamcenter');
    setSecondaryPLMs(['PTC Windchill', 'Dassault 3DEXPERIENCE / ENOVIA']);
    setModules([
      'BOM & Part Architecture',
      'Active Workspace (AWC)',
      'CAD / MCAD Integration',
      'Engineering Change (ECN/ECO)',
      'Data Migration & ETL'
    ]);
    setCadTools(['Siemens NX', 'PTC Creo', 'CATIA V5/V6']);
    setClearance('ITAR / Export Controlled');
    setCurrentCompany('General Dynamics Land Systems');
    setCurrentRole('Lead PLM Architect');
    setExpectedCompensation('$165,000 - $185,000 / year (or $95/hr C2C)');
    setAvailableFrom('Available in 2 Weeks');
    setBio('Senior PLM Systems Architect with 9+ years deploying Siemens Teamcenter enterprise solutions across defense, aerospace, and heavy vehicle sectors. Specialized in Active Workspace custom tile configuration, BMIDE business object modeling, and NX CAD manager pipelines.');
    setCertificationsText('Siemens Certified Teamcenter Solution Architect, ITAR Compliance Verification, AWC 6.3 Certified');
    setResumeFileName('Elena_Rostova_Senior_PLM_Architect_Resume.pdf');
    setProjectTitle('Global Teamcenter 14 & Active Workspace 6.3 Multi-Site Rollout');
    setProjectSystem('Siemens Teamcenter 14.2 & Active Workspace');
    setProjectDesc('Led the architecture team migrating 1,200 concurrent CAD engineers from RAC (Rich Client) to Active Workspace 6.3 with high-availability microservices clustering.');
    setProjectImpact('Reduced engineering ECO cycle duration by 35% and achieved 99.9% uptime across US defense programs.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !headline) return;

    setIsSubmitting(true);

    try {
      const certs = certificationsText
        .split(',')
        .map(c => c.trim())
        .filter(Boolean);

      const id = await registerCandidate({
        name,
        headline,
        email,
        phone: phone || '+1 (555) 000-0000',
        location: location || 'Remote / United States',
        yearsOfExperience: Number(yearsOfExperience) || 5,
        primaryPLM,
        secondaryPLMs,
        modules,
        cadTools,
        clearance,
        certifications: certs.length > 0 ? certs : ['PLM Nexus Verified Specialist'],
        currentCompany: currentCompany || 'Confidential Enterprise',
        currentRole: currentRole || headline,
        expectedCompensation: expectedCompensation || '$150,000 / year',
        availableFrom: availableFrom || 'Immediate',
        bio: bio || `Specialist in ${primaryPLM} with ${yearsOfExperience} years of production deployment experience.`,
        resumeFileName,
        portfolioProjects: [
          {
            title: projectTitle || 'Enterprise PLM Deployment',
            system: projectSystem || primaryPLM,
            description: projectDesc || 'Configured enterprise data models, workflows, and integrations.',
            impact: projectImpact || 'Improved cross-functional engineering productivity.'
          }
        ]
      });

      setRegisteredId(id);
      setSubmittedSuccess(true);
      setRole('candidate');
      if (onSuccess) onSuccess();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Register as PLM Job Seeker & Specialist
              </h2>
              <p className="text-xs text-slate-500">
                Create your verified engineering profile to apply directly to Teamcenter, Windchill & 3DEXPERIENCE positions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedSuccess ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-lg font-bold text-slate-900">
                Candidate Profile Registered Successfully!
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Welcome aboard, <strong className="text-slate-900">{name}</strong>. Your profile has been created with ID <span className="font-mono font-bold text-blue-700">{registeredId}</span>. You can now apply with 1-click to verified enterprise engineering positions.
              </p>
            </div>

            {/* Candidate Card Summary */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs max-w-md mx-auto space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 text-sm">{name}</div>
                  <div className="text-[11px] text-slate-500">{headline}</div>
                </div>
                <span className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 font-bold font-mono text-[11px]">
                  {yearsOfExperience} yrs exp
                </span>
              </div>

              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200/60">
                <span className="px-2 py-0.5 rounded bg-slate-900 text-white font-medium text-[11px]">
                  {primaryPLM}
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-medium text-[11px] flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {clearance}
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium text-[11px] flex items-center gap-1 border border-emerald-200">
                  <FileText className="w-3 h-3" />
                  {resumeFileName}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  onClose();
                  setRole('candidate');
                }}
                className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Browse Matching PLM Positions</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            
            {/* Quick Demo Pre-fill */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/70 border border-blue-100">
              <div className="text-xs text-blue-900">
                <strong>Quick Test?</strong> Pre-populate authentic PLM Solution Architect credentials in 1 click.
              </div>
              <button
                type="button"
                onClick={handleFillDemo}
                className="px-3 py-1 text-xs font-semibold text-blue-700 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors shadow-2xs"
              >
                Auto-Fill Candidate
              </button>
            </div>

            {/* 1. Identity & Contact */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>1. Personal & Contact Identification</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Elena Rostova"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Professional Headline *
                  </label>
                  <input
                    type="text"
                    required
                    value={headline}
                    onChange={e => setHeadline(e.target.value)}
                    placeholder="e.g. Senior Siemens Teamcenter Solution Architect | AWC 6.3"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. elena@engineer.net"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="e.g. +1 (313) 555-0182"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Location / Base
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="e.g. Detroit, MI, USA (Open to Remote)"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Total Years of PLM Experience *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    required
                    value={yearsOfExperience}
                    onChange={e => setYearsOfExperience(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Defense / Export Clearance Level
                  </label>
                  <select
                    value={clearance}
                    onChange={e => setClearance(e.target.value as ClearanceLevel)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 bg-white"
                  >
                    {CLEARANCE_OPTIONS.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 2. PLM Platforms & Expertise */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                2. PLM Systems, Modules & CAD Tools
              </h3>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Primary PLM Platform * (Your core focus)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {AVAILABLE_PLM_SYSTEMS.map(sys => {
                    const isSelected = primaryPLM === sys;
                    return (
                      <button
                        key={sys}
                        type="button"
                        onClick={() => setPrimaryPLM(sys)}
                        className={`p-2.5 rounded-lg border text-left text-xs transition-colors flex items-center justify-between ${
                          isSelected 
                            ? 'bg-slate-900 text-white border-slate-900 font-semibold shadow-xs' 
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <span className="truncate">{sys}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Secondary PLM Systems
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {AVAILABLE_PLM_SYSTEMS.filter(s => s !== primaryPLM).map(sys => {
                    const isSelected = secondaryPLMs.includes(sys);
                    return (
                      <button
                        key={sys}
                        type="button"
                        onClick={() => toggleSecondaryPLM(sys)}
                        className={`px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1.5 ${
                          isSelected 
                            ? 'bg-blue-50 text-blue-700 border border-blue-200 font-medium' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <span>{sys}</span>
                        {isSelected && <Check className="w-3 h-3 text-blue-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Domain Modules & Functional Architecture (Select relevant)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {AVAILABLE_MODULES.map(mod => {
                    const isSelected = modules.includes(mod);
                    return (
                      <button
                        key={mod}
                        type="button"
                        onClick={() => toggleModule(mod)}
                        className={`p-2 rounded-lg text-left text-xs transition-colors flex items-center justify-between border ${
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

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Integrated CAD Tools & Authoring Software
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {AVAILABLE_CAD_TOOLS.map(tool => {
                    const isSelected = cadTools.includes(tool);
                    return (
                      <button
                        key={tool}
                        type="button"
                        onClick={() => toggleCAD(tool)}
                        className={`p-2 rounded-lg border text-left text-xs transition-colors flex items-center justify-between ${
                          isSelected 
                            ? 'bg-slate-800 text-white border-slate-800 font-medium' 
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <span className="truncate font-mono">{tool}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 3. Professional Background & Availability */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                3. Career Background & Compensation
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Current Company / Employer
                  </label>
                  <input
                    type="text"
                    value={currentCompany}
                    onChange={e => setCurrentCompany(e.target.value)}
                    placeholder="e.g. General Dynamics or Independent"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Current Role / Title
                  </label>
                  <input
                    type="text"
                    value={currentRole}
                    onChange={e => setCurrentRole(e.target.value)}
                    placeholder="e.g. Lead PLM Architect"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Expected Compensation
                  </label>
                  <input
                    type="text"
                    value={expectedCompensation}
                    onChange={e => setExpectedCompensation(e.target.value)}
                    placeholder="e.g. $160,000 / yr or $90/hr C2C"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Availability / Notice Period
                  </label>
                  <input
                    type="text"
                    value={availableFrom}
                    onChange={e => setAvailableFrom(e.target.value)}
                    placeholder="e.g. Immediate or 2 Weeks Notice"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Certifications (comma-separated)
                </label>
                <input
                  type="text"
                  value={certificationsText}
                  onChange={e => setCertificationsText(e.target.value)}
                  placeholder="e.g. Siemens Teamcenter Certified Professional, AWC 6.x Specialist"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Executive Summary / Bio
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Briefly describe your PLM architecture philosophy, tools, and enterprise accomplishments..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 resize-none"
                />
              </div>
            </div>

            {/* 4. Resume Attachment & Portfolio Highlight */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                4. Resume Document & Major Project Highlight
              </h3>

              {/* Resume File Upload Box */}
              <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-blue-600 shadow-2xs">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-800">{resumeFileName}</div>
                    <div className="text-[11px] text-slate-500">PDF, DOCX resume file used for verified 1-click job submissions</div>
                  </div>
                </div>
                <label className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer shadow-2xs">
                  Change Resume
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        setResumeFileName(e.target.files[0].name);
                      }
                    }}
                  />
                </label>
              </div>

              {/* Featured Project */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="text-xs font-bold text-slate-800">
                  Highlight Enterprise PLM Project
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Project Title</label>
                    <input
                      type="text"
                      value={projectTitle}
                      onChange={e => setProjectTitle(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                      placeholder="e.g. Active Workspace 6.2 Rollout"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">System Stack</label>
                    <input
                      type="text"
                      value={projectSystem}
                      onChange={e => setProjectSystem(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white font-mono"
                      placeholder="e.g. Siemens Teamcenter / AWC"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Description & Scope</label>
                  <input
                    type="text"
                    value={projectDesc}
                    onChange={e => setProjectDesc(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                    placeholder="e.g. Modernized legacy RAC workflows into AWC microservices..."
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Business Impact / Metric</label>
                  <input
                    type="text"
                    value={projectImpact}
                    onChange={e => setProjectImpact(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-emerald-700 font-medium"
                    placeholder="e.g. Reduced release cycle time by 35%..."
                  />
                </div>
              </div>

            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting || !name || !email}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2 shadow-sm"
              >
                {isSubmitting ? (
                  <span>Registering Candidate...</span>
                ) : (
                  <>
                    <span>Complete Candidate Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
