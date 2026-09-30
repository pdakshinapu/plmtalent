import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { PLMSystem, PLMModule, CADTool, ClearanceLevel, CandidateProfile, CandidateProfileVisibility } from '../types';
import { 
  X, 
  Check, 
  UserCheck, 
  ShieldCheck, 
  Save, 
  Briefcase, 
  Layers, 
  Cpu, 
  FileText, 
  Info, 
  Eye, 
  EyeOff,
  Plus
} from 'lucide-react';

interface EditCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_VISIBILITY: CandidateProfileVisibility = {
  contact: true,
  platforms: true,
  modules: true,
  compensation: true,
};

// Switch + tooltip letting the candidate control which profile section employers can see
const SectionVisibilityToggle: React.FC<{
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}> = ({ description, checked, onChange }) => (
  <div className="flex items-center gap-2">
    <div className="relative group flex items-center">
      <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
      <div className="pointer-events-none absolute right-0 bottom-full mb-2 w-60 rounded-lg bg-slate-900 text-white text-[11px] leading-snug px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-lg">
        {description}
      </div>
    </div>
    <span className={`text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 ${checked ? 'text-emerald-600' : 'text-slate-400'}`}>
      {checked ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
      {checked ? 'Visible to Employers' : 'Hidden from Employers'}
    </span>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
        checked ? 'bg-blue-600' : 'bg-slate-300'
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-[18px]' : 'translate-x-0.5'
        }`}
      />
    </button>
  </div>
);

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
        className="px-2.5 py-1 text-xs rounded-lg border-2 border-dashed border-slate-300 text-slate-400 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center gap-1 cursor-pointer"
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

const CLEARANCE_OPTIONS: ClearanceLevel[] = [
  'None',
  'ITAR / Export Controlled',
  'Secret',
  'Top Secret'
];

export const EditCandidateModal: React.FC<EditCandidateModalProps> = ({ isOpen, onClose }) => {
  const { candidate, updateCandidate, platformChoices } = useApp();

  // Local copies of choices that can be extended with custom additions
  const [localSystems, setLocalSystems] = useState<string[]>([]);
  const [localModules, setLocalModules] = useState<string[]>([]);
  const [localCAD, setLocalCAD] = useState<string[]>([]);

  // Sync local lists from context whenever modal opens
  useEffect(() => {
    setLocalSystems(platformChoices.plmSystems);
    setLocalModules(platformChoices.plmModules);
    setLocalCAD(platformChoices.cadTools);
  }, [platformChoices, isOpen]);

  const [name, setName] = useState('');
  const [headline, setHeadline] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState<number>(3);
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
  const [visibility, setVisibility] = useState<CandidateProfileVisibility>(DEFAULT_VISIBILITY);

  // Sync form when candidate changes or modal opens
  useEffect(() => {
    if (candidate) {
      setName(candidate.name || '');
      setHeadline(candidate.headline || '');
      setEmail(candidate.email || '');
      setPhone(candidate.phone || '');
      setLocation(candidate.location || '');
      setYearsOfExperience(candidate.yearsOfExperience || 0);
      setPrimaryPLM(candidate.primaryPLM || 'Siemens Teamcenter');
      setSecondaryPLMs(candidate.secondaryPLMs || []);
      setModules(candidate.modules || []);
      setCadTools(candidate.cadTools || []);
      setClearance(candidate.clearance || 'None');
      setCurrentCompany(candidate.currentCompany || '');
      setCurrentRole(candidate.currentRole || '');
      setExpectedCompensation(candidate.expectedCompensation || '');
      setAvailableFrom(candidate.availableFrom || '');
      setBio(candidate.bio || '');
      setCertificationsText((candidate.certifications || []).join(', '));
      setVisibility({ ...DEFAULT_VISIBILITY, ...(candidate.profileVisibility || {}) });
    }
  }, [candidate, isOpen]);

  if (!isOpen || !candidate) return null;

  const toggleSecondaryPLM = (sys: PLMSystem) => {
    if (sys === primaryPLM) return;
    setSecondaryPLMs(prev => 
      prev.includes(sys) ? prev.filter(s => s !== sys) : [...prev, sys]
    );
  };

  const toggleModule = (mod: PLMModule) => {
    setModules(prev => 
      prev.includes(mod) ? prev.filter(m => m !== mod) : [...prev, mod]
    );
  };

  const toggleCAD = (cad: CADTool) => {
    setCadTools(prev => 
      prev.includes(cad) ? prev.filter(c => c !== cad) : [...prev, cad]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const initials = name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map(w => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'PLM';

    const certList = certificationsText
      .split(',')
      .map(c => c.trim())
      .filter(Boolean);

    const updatedData: Partial<CandidateProfile> = {
      name: name.trim(),
      headline: headline.trim(),
      email: email.trim(),
      phone: phone.trim(),
      location: location.trim(),
      yearsOfExperience: Number(yearsOfExperience),
      primaryPLM,
      secondaryPLMs,
      modules,
      cadTools,
      clearance,
      currentCompany: currentCompany.trim(),
      currentRole: currentRole.trim(),
      expectedCompensation: expectedCompensation.trim(),
      availableFrom: availableFrom.trim(),
      bio: bio.trim(),
      certifications: certList,
      avatarInitials: initials,
      profileVisibility: visibility,
    };

    updateCandidate(updatedData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Edit Candidate Profile
              </h2>
              <p className="text-xs text-slate-500">
                Update your verified PLM engineering competencies, certifications, and clearance
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Section 1: Basic & Contact */}
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Identity & Contact Details</span>
              </h3>
              <SectionVisibilityToggle
                description="Controls whether connected employers can see your phone number and location on your profile."
                checked={visibility.contact}
                onChange={(v) => setVisibility(prev => ({ ...prev, contact: v }))}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Full Name"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Professional Headline *
                </label>
                <input
                  type="text"
                  required
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Senior Teamcenter Solutions Architect"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@domain.com"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 019-2834"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Detroit, MI (Hybrid)"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 2: PLM Competencies */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>PLM Core Platforms & Clearance</span>
              </h3>
              <SectionVisibilityToggle
                description="Controls whether employers can see your primary/secondary PLM systems, years of experience, and clearance level."
                checked={visibility.platforms}
                onChange={(v) => setVisibility(prev => ({ ...prev, platforms: v }))}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary PLM Platform *
                </label>
                <select
                  value={primaryPLM}
                  onChange={(e) => {
                    const next = e.target.value as PLMSystem;
                    setPrimaryPLM(next);
                    setSecondaryPLMs(prev => prev.filter(s => s !== next));
                  }}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white cursor-pointer"
                >
                  {localSystems.map(sys => (
                    <option key={sys} value={sys}>{sys}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Years of Experience *
                </label>
                <input
                  type="number"
                  min={0}
                  max={40}
                  value={yearsOfExperience}
                  onChange={(e) => setYearsOfExperience(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Defense / Export Clearance
                </label>
                <select
                  value={clearance}
                  onChange={(e) => setClearance(e.target.value as ClearanceLevel)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white cursor-pointer"
                >
                  {CLEARANCE_OPTIONS.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Secondary PLM systems */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Secondary PLM Systems (Select all applicable)
              </label>
              <div className="flex flex-wrap gap-2">
                {localSystems.filter(s => s !== primaryPLM).map(sys => {
                  const isSelected = secondaryPLMs.includes(sys as PLMSystem);
                  return (
                    <button
                      type="button"
                      key={sys}
                      onClick={() => toggleSecondaryPLM(sys as PLMSystem)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 text-blue-800'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-blue-600" />}
                      <span>{sys}</span>
                    </button>
                  );
                })}
                <InlineAdd
                  placeholder="Custom PLM system..."
                  onAdd={val => {
                    if (!localSystems.includes(val)) setLocalSystems(prev => [...prev, val]);
                    if (!secondaryPLMs.includes(val as PLMSystem)) setSecondaryPLMs(prev => [...prev, val as PLMSystem]);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Domain Modules & CAD */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-blue-600" />
                <span>Specialized Modules & Integrated CAD Tools</span>
              </h3>
              <SectionVisibilityToggle
                description="Controls whether employers can see your domain modules and integrated CAD tool expertise."
                checked={visibility.modules}
                onChange={(v) => setVisibility(prev => ({ ...prev, modules: v }))}
              />
            </div>

            {/* PLM Modules */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Domain Modules & Competencies
              </label>
              <div className="flex flex-wrap gap-2">
                {localModules.map(mod => {
                  const isSelected = modules.includes(mod as PLMModule);
                  return (
                    <button
                      type="button"
                      key={mod}
                      onClick={() => toggleModule(mod as PLMModule)}
                      className={`px-2.5 py-1 text-xs rounded-lg border transition-colors cursor-pointer flex items-center gap-1 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 text-blue-800 font-semibold'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-blue-600" />}
                      <span>{mod}</span>
                    </button>
                  );
                })}
                <InlineAdd
                  placeholder="Custom module..."
                  onAdd={val => {
                    if (!localModules.includes(val)) setLocalModules(prev => [...prev, val]);
                    if (!modules.includes(val as PLMModule)) setModules(prev => [...prev, val as PLMModule]);
                  }}
                />
              </div>
            </div>

            {/* CAD Tools */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Integrated CAD Environments
              </label>
              <div className="flex flex-wrap gap-2">
                {localCAD.map(cad => {
                  const isSelected = cadTools.includes(cad as CADTool);
                  return (
                    <button
                      type="button"
                      key={cad}
                      onClick={() => toggleCAD(cad as CADTool)}
                      className={`px-2.5 py-1 text-xs rounded-lg border transition-colors cursor-pointer flex items-center gap-1 font-mono ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 text-blue-800 font-semibold'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-blue-600" />}
                      <span>{cad}</span>
                    </button>
                  );
                })}
                <InlineAdd
                  placeholder="Custom CAD tool..."
                  onAdd={val => {
                    if (!localCAD.includes(val)) setLocalCAD(prev => [...prev, val]);
                    if (!cadTools.includes(val as CADTool)) setCadTools(prev => [...prev, val as CADTool]);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Section 4: Employment & Compensation */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                <span>Current Status & Compensation</span>
              </h3>
              <SectionVisibilityToggle
                description="Controls whether employers can see your current company, role, expected compensation, and availability."
                checked={visibility.compensation}
                onChange={(v) => setVisibility(prev => ({ ...prev, compensation: v }))}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Company
                </label>
                <input
                  type="text"
                  value={currentCompany}
                  onChange={(e) => setCurrentCompany(e.target.value)}
                  placeholder="e.g. AeroDynamics Corp"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Role
                </label>
                <input
                  type="text"
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value)}
                  placeholder="e.g. Lead PLM Developer"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Expected Compensation
                </label>
                <input
                  type="text"
                  value={expectedCompensation}
                  onChange={(e) => setExpectedCompensation(e.target.value)}
                  placeholder="e.g. $140,000 - $160,000 / year"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Availability
                </label>
                <input
                  type="text"
                  value={availableFrom}
                  onChange={(e) => setAvailableFrom(e.target.value)}
                  placeholder="e.g. 2 Weeks Notice / Immediately"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                OEM Certifications (Comma separated)
              </label>
              <input
                type="text"
                value={certificationsText}
                onChange={(e) => setCertificationsText(e.target.value)}
                placeholder="Siemens Teamcenter Certified Professional, AWC 6.x Specialist, AWS Cloud"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Professional Bio / PLM Architecture Summary
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Summary of your engineering background, enterprise migrations, BMIDE data modeling, etc."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white resize-none"
              />
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile Changes</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
