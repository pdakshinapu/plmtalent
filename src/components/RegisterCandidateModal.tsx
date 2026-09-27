import React, { useState, useEffect, useRef } from 'react';
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
  Award,
  Plus
} from 'lucide-react';

interface RegisterCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CLEARANCE_OPTIONS: ClearanceLevel[] = [
  'None',
  'ITAR / Export Controlled',
  'Secret',
  'Top Secret'
];

// Inline add-custom-option button for chip grids
const InlineAdd: React.FC<{
  onAdd: (value: string) => void;
  placeholder?: string;
}> = ({ onAdd, placeholder = 'Add custom...' }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const commit = () => {
    const trimmed = value.trim();
    if (trimmed) onAdd(trimmed);
    setValue('');
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-2.5 py-1.5 text-xs rounded-lg border-2 border-dashed border-slate-300 text-slate-400 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center gap-1 cursor-pointer"
        title="Add custom option"
      >
        <Plus className="w-3 h-3" /> Add
      </button>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 animate-in fade-in zoom-in-95 duration-150">
      <input
        ref={inputRef}
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') { e.preventDefault(); commit(); }
          if (e.key === 'Escape') { setOpen(false); setValue(''); }
        }}
        placeholder={placeholder}
        className="px-2 py-1 text-xs border border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none w-36"
      />
      <button type="button" onClick={commit}
        className="px-2 py-1 text-xs text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
        ✓
      </button>
      <button type="button" onClick={() => { setOpen(false); setValue(''); }}
        className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
        <X className="w-3 h-3" />
      </button>
    </span>
  );
};

export const RegisterCandidateModal: React.FC<RegisterCandidateModalProps> = ({ 
  isOpen, 
  onClose,
  onSuccess
}) => {
  const { registerCandidate, setRole, platformChoices } = useApp();

  // Local copies of choices so user can add custom options per-session
  const [localSystems, setLocalSystems] = useState<string[]>([]);
  const [localModules, setLocalModules] = useState<string[]>([]);
  const [localCAD, setLocalCAD] = useState<string[]>([]);

  useEffect(() => {
    setLocalSystems(platformChoices.plmSystems);
    setLocalModules(platformChoices.plmModules);
    setLocalCAD(platformChoices.cadTools);
  }, [platformChoices, isOpen]);

  // Form state
  const [name, setName] = useState('');
  const [headline, setHeadline] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState<number>(0);
  const [primaryPLM, setPrimaryPLM] = useState<PLMSystem>('Siemens Teamcenter');
  const [secondaryPLMs, setSecondaryPLMs] = useState<PLMSystem[]>([]);
  const [modules, setModules] = useState<PLMModule[]>([]);
  const [cadTools, setCadTools] = useState<CADTool[]>([]);
  const [clearance, setClearance] = useState<ClearanceLevel>('None');
  const [currentCompany, setCurrentCompany] = useState('');
  const [currentRole, setCurrentRole] = useState('');
  const [expectedCompensation, setExpectedCompensation] = useState('');
  const [availableFrom, setAvailableFrom] = useState('');
  const [bio, setBio] = useState('');
  const [certificationsText, setCertificationsText] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');
  
  // Highlight Project
  const [projectTitle, setProjectTitle] = useState('');
  const [projectSystem, setProjectSystem] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectImpact, setProjectImpact] = useState('');

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
        name: name.trim(),
        headline: headline.trim(),
        email: email.trim(),
        phone: phone.trim(),
        location: location.trim(),
        yearsOfExperience: Number(yearsOfExperience) || 0,
        primaryPLM,
        secondaryPLMs,
        modules,
        cadTools,
        clearance,
        certifications: certs,
        currentCompany: currentCompany.trim(),
        currentRole: currentRole.trim() || headline.trim(),
        expectedCompensation: expectedCompensation.trim(),
        availableFrom: availableFrom.trim(),
        bio: bio.trim(),
        resumeFileName: resumeFileName.trim() || `${name.trim().replace(/\s+/g, '_')}_Resume.pdf`,
        portfolioProjects: projectTitle.trim() ? [
          {
            title: projectTitle.trim(),
            system: projectSystem.trim() || primaryPLM,
            description: projectDesc.trim(),
            impact: projectImpact.trim()
          }
        ] : []
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
                <div className="flex flex-wrap gap-2">
                  {localSystems.map(sys => {
                    const isSelected = primaryPLM === sys as PLMSystem;
                    return (
                      <button
                        key={sys}
                        type="button"
                        onClick={() => setPrimaryPLM(sys as PLMSystem)}
                        className={`px-3 py-1.5 rounded-lg border text-left text-xs transition-colors flex items-center gap-1.5 ${
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
                  <InlineAdd
                    placeholder="Custom PLM..."
                    onAdd={val => {
                      if (!localSystems.includes(val)) setLocalSystems(prev => [...prev, val]);
                      setPrimaryPLM(val as PLMSystem);
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Secondary PLM Systems
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {localSystems.filter(s => s !== primaryPLM).map(sys => {
                    const isSelected = secondaryPLMs.includes(sys as PLMSystem);
                    return (
                      <button
                        key={sys}
                        type="button"
                        onClick={() => toggleSecondaryPLM(sys as PLMSystem)}
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
                  <InlineAdd
                    placeholder="Custom PLM..."
                    onAdd={val => {
                      if (!localSystems.includes(val)) setLocalSystems(prev => [...prev, val]);
                      if (!secondaryPLMs.includes(val as PLMSystem)) toggleSecondaryPLM(val as PLMSystem);
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Domain Modules & Functional Architecture (Select relevant)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {localModules.map(mod => {
                    const isSelected = modules.includes(mod as PLMModule);
                    return (
                      <button
                        key={mod}
                        type="button"
                        onClick={() => toggleModule(mod as PLMModule)}
                        className={`px-2.5 py-1.5 rounded-lg text-left text-xs transition-colors flex items-center gap-1.5 border ${
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
                  <InlineAdd
                    placeholder="Custom module..."
                    onAdd={val => {
                      if (!localModules.includes(val)) setLocalModules(prev => [...prev, val]);
                      if (!modules.includes(val as PLMModule)) toggleModule(val as PLMModule);
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Integrated CAD Tools & Authoring Software
                </label>
                <div className="flex flex-wrap gap-2">
                  {localCAD.map(tool => {
                    const isSelected = cadTools.includes(tool as CADTool);
                    return (
                      <button
                        key={tool}
                        type="button"
                        onClick={() => toggleCAD(tool as CADTool)}
                        className={`px-2.5 py-1.5 rounded-lg border text-left text-xs transition-colors flex items-center gap-1.5 ${
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
                  <InlineAdd
                    placeholder="Custom CAD..."
                    onAdd={val => {
                      if (!localCAD.includes(val)) setLocalCAD(prev => [...prev, val]);
                      if (!cadTools.includes(val as CADTool)) toggleCAD(val as CADTool);
                    }}
                  />
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
