import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PLMSystem, CADTool } from '../types';
import {
  X,
  Save,
  Building2,
  Briefcase,
  MapPin,
  Cpu,
  ShieldCheck,
  Globe,
  Mail,
  Phone,
  Linkedin,
  Calendar,
  Users,
  FileText,
  Upload,
  Plus,
  Check,
  AlertCircle
} from 'lucide-react';

interface EditEmployerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COMPANY_TYPES = [
  'Corporate / Enterprise',
  'Product Company',
  'IT Services & Solutions',
  'PLM Consulting & Integration',
  'Engineering Services (ER&D)',
  'Staffing & Recruitment Agency',
  'Startup'
];

const INDUSTRIES = [
  'Aerospace & Defense',
  'Automotive & EV',
  'Industrial Machinery & Heavy Equipment',
  'Medical Technology & Devices',
  'High Tech & Electronics',
  'PLM Consulting & Digital Twin',
  'Consumer Goods & Retail',
  'Energy, Oil & Gas',
  'Semiconductors & Embedded'
];

const COMPANY_SIZES = [
  '1 - 10 employees',
  '11 - 50 employees',
  '51 - 200 employees',
  '201 - 500 employees',
  '501 - 1,000 employees',
  '1,000 - 5,000 employees',
  '5,000+ employees'
];

const PLM_PRACTICE_SIZES = [
  '1 - 5 dedicated PLM specialists',
  '6 - 20 dedicated PLM specialists',
  '21 - 50 dedicated PLM specialists',
  '51 - 100 dedicated PLM specialists',
  '100+ global PLM practice team'
];

export const EditEmployerModal: React.FC<EditEmployerModalProps> = ({ isOpen, onClose }) => {
  const { currentEmployer, updateEmployer, platformChoices } = useApp();

  const [activeSection, setActiveSection] = useState<'company' | 'recruiter' | 'location' | 'tech' | 'verification'>('company');

  // Form Fields
  const [companyName, setCompanyName] = useState('');
  const [legalEntity, setLegalEntity] = useState('');
  const [companyType, setCompanyType] = useState('Corporate / Enterprise');
  const [industry, setIndustry] = useState('Aerospace & Defense');
  const [companySize, setCompanySize] = useState('51 - 200 employees');
  const [yearFounded, setYearFounded] = useState('');
  const [website, setWebsite] = useState('');
  const [tagline, setTagline] = useState('');
  const [about, setAbout] = useState('');

  // Recruiter Details
  const [contactPerson, setContactPerson] = useState('');
  const [contactTitle, setContactTitle] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [linkedInUrl, setLinkedInUrl] = useState('');

  // Locations
  const [headquarters, setHeadquarters] = useState('');
  const [address, setAddress] = useState('');
  const [operatingLocations, setOperatingLocations] = useState<string[]>([]);
  const [newLocationInput, setNewLocationInput] = useState('');

  // Tech Stack & Credentials
  const [primaryPLMStack, setPrimaryPLMStack] = useState<PLMSystem[]>([]);
  const [cadEnvironments, setCadEnvironments] = useState<CADTool[]>([]);
  const [plmTeamSize, setPlmTeamSize] = useState('');

  // Corporate Verification KYC
  const [corporateDomain, setCorporateDomain] = useState('');
  const [taxRegistrationNumber, setTaxRegistrationNumber] = useState('');
  const [verificationDocName, setVerificationDocName] = useState('');

  const [isSaving, setIsSaving] = useState(false);

  // Populate form with currentEmployer when opening
  useEffect(() => {
    if (currentEmployer && isOpen) {
      setCompanyName(currentEmployer.companyName || '');
      setLegalEntity(currentEmployer.legalEntity || currentEmployer.companyName || '');
      setCompanyType(currentEmployer.companyType || 'Corporate / Enterprise');
      setIndustry(currentEmployer.industry || 'Aerospace & Defense');
      setCompanySize(currentEmployer.companySize || '51 - 200 employees');
      setYearFounded(currentEmployer.yearFounded || '');
      setWebsite(currentEmployer.website || '');
      setTagline(currentEmployer.tagline || '');
      setAbout(currentEmployer.about || '');

      setContactPerson(currentEmployer.contactPerson || '');
      setContactTitle(currentEmployer.contactTitle || '');
      setContactEmail(currentEmployer.contactEmail || '');
      setContactPhone(currentEmployer.contactPhone || '');
      setLinkedInUrl(currentEmployer.linkedInUrl || '');

      setHeadquarters(currentEmployer.headquarters || '');
      setAddress(currentEmployer.address || '');
      setOperatingLocations(currentEmployer.operatingLocations || []);

      setPrimaryPLMStack(currentEmployer.primaryPLMStack || []);
      setCadEnvironments(currentEmployer.cadEnvironments || []);
      setPlmTeamSize(currentEmployer.plmTeamSize || '');

      setCorporateDomain(currentEmployer.corporateDomain || '');
      setTaxRegistrationNumber(currentEmployer.taxRegistrationNumber || '');
      setVerificationDocName(currentEmployer.verificationDocName || '');
    }
  }, [currentEmployer, isOpen]);

  if (!isOpen || !currentEmployer) return null;

  const togglePLM = (system: PLMSystem) => {
    setPrimaryPLMStack(prev =>
      prev.includes(system) ? prev.filter(s => s !== system) : [...prev, system]
    );
  };

  const toggleCAD = (tool: CADTool) => {
    setCadEnvironments(prev =>
      prev.includes(tool) ? prev.filter(t => t !== tool) : [...prev, tool]
    );
  };

  const handleAddLocation = () => {
    const trimmed = newLocationInput.trim();
    if (trimmed && !operatingLocations.includes(trimmed)) {
      setOperatingLocations(prev => [...prev, trimmed]);
      setNewLocationInput('');
    }
  };

  const handleRemoveLocation = (loc: string) => {
    setOperatingLocations(prev => prev.filter(l => l !== loc));
  };

  const handleFileUploadSim = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVerificationDocName(file.name);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      alert('Company Name is required.');
      return;
    }

    setIsSaving(true);
    try {
      await updateEmployer({
        companyName: companyName.trim(),
        legalEntity: legalEntity.trim() || companyName.trim(),
        companyType,
        industry,
        companySize,
        yearFounded: yearFounded.trim(),
        website: website.trim(),
        tagline: tagline.trim(),
        about: about.trim(),

        contactPerson: contactPerson.trim(),
        contactTitle: contactTitle.trim(),
        contactEmail: contactEmail.trim(),
        contactPhone: contactPhone.trim(),
        linkedInUrl: linkedInUrl.trim(),

        headquarters: headquarters.trim(),
        address: address.trim(),
        operatingLocations,

        primaryPLMStack,
        cadEnvironments,
        plmTeamSize,

        corporateDomain: corporateDomain.trim() || (contactEmail.includes('@') ? contactEmail.split('@')[1] : ''),
        taxRegistrationNumber: taxRegistrationNumber.trim(),
        verificationDocName: verificationDocName.trim() || undefined,
      });
      onClose();
    } catch (err) {
      console.error('Error saving employer profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // PLM Options list derived dynamically
  const availablePLMs: PLMSystem[] = platformChoices?.plmSystems as PLMSystem[] || [
    'Siemens Teamcenter',
    'PTC Windchill',
    'Dassault 3DEXPERIENCE / ENOVIA',
    'Aras Innovator',
    'SAP PLM',
    'Autodesk Fusion / Upchain',
    'Arena PLM',
    'Agile PLM'
  ];

  const availableCADs: CADTool[] = platformChoices?.cadTools as CADTool[] || [
    'Siemens NX',
    'CATIA V5/V6',
    'PTC Creo',
    'SolidWorks',
    'Autodesk Inventor',
    'Altium Designer'
  ];

  return (
    <div id="edit-employer-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full my-8 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Edit Corporate Profile & Recruiter Credentials
              </h2>
              <p className="text-xs text-slate-500">
                Comprehensive company details for talent search, job listings, and administrator verification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-white px-5 gap-1 shrink-0 overflow-x-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveSection('company')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeSection === 'company'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Company Profile</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('recruiter')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeSection === 'recruiter'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Recruiter & Contact</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('location')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeSection === 'location'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Office Locations</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('tech')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeSection === 'tech'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>PLM Environment</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('verification')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeSection === 'verification'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Corporate Verification</span>
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* SECTION 1: Company Profile (Naukri Company Details) */}
          {activeSection === 'company' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Company Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    placeholder="e.g. Siemens Digital Industries"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Legal Entity / Registered Name
                  </label>
                  <input
                    type="text"
                    value={legalEntity}
                    onChange={e => setLegalEntity(e.target.value)}
                    placeholder="e.g. Siemens Industry Software Inc."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Company Type
                  </label>
                  <select
                    value={companyType}
                    onChange={e => setCompanyType(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {COMPANY_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Industry Sector
                  </label>
                  <select
                    value={industry}
                    onChange={e => setIndustry(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {INDUSTRIES.map(ind => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Company Size
                  </label>
                  <select
                    value={companySize}
                    onChange={e => setCompanySize(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {COMPANY_SIZES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Year Founded
                  </label>
                  <div className="relative">
                    <Calendar className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      value={yearFounded}
                      onChange={e => setYearFounded(e.target.value)}
                      placeholder="e.g. 2012"
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Official Website URL
                  </label>
                  <div className="relative">
                    <Globe className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="url"
                      value={website}
                      onChange={e => setWebsite(e.target.value)}
                      placeholder="https://www.company.com"
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Company Tagline / One-Liner
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={e => setTagline(e.target.value)}
                  placeholder="e.g. Pioneer in Digital Engineering & Next-Gen PLM Transformation"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  About the Company (Overview & Culture)
                </label>
                <textarea
                  rows={4}
                  value={about}
                  onChange={e => setAbout(e.target.value)}
                  placeholder="Provide an overview of your organization, services, PLM practice, mission, and what makes your workplace outstanding for PLM specialists..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                />
              </div>
            </div>
          )}

          {/* SECTION 2: Recruiter & Hiring Contact (Naukri Recruiter Profile) */}
          {activeSection === 'recruiter' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-900 text-xs flex items-start gap-2.5">
                <Briefcase className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold">Recruiter Profile:</strong> This information represents your corporate hiring manager or talent acquisition lead on job listings and direct candidate connection requests.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Person / Recruiter Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={contactPerson}
                    onChange={e => setContactPerson(e.target.value)}
                    placeholder="e.g. Prakash T"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Designation / Title
                  </label>
                  <input
                    type="text"
                    value={contactTitle}
                    onChange={e => setContactTitle(e.target.value)}
                    placeholder="e.g. Lead Technical Recruiter / HR Manager"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Official Work Email <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={e => setContactEmail(e.target.value)}
                      placeholder="e.g. recruiter@company.com"
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Phone / Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={e => setContactPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Recruiter LinkedIn Profile URL
                </label>
                <div className="relative">
                  <Linkedin className="w-3.5 h-3.5 absolute left-3 top-2.5 text-blue-600" />
                  <input
                    type="url"
                    value={linkedInUrl}
                    onChange={e => setLinkedInUrl(e.target.value)}
                    placeholder="https://www.linkedin.com/in/username"
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: Locations & Office Facilities */}
          {activeSection === 'location' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Corporate Headquarters (City, State, Country)
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={headquarters}
                    onChange={e => setHeadquarters(e.target.value)}
                    placeholder="e.g. Bengaluru, Karnataka, India or Detroit, MI, USA"
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Registered Office Address
                </label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="e.g. Tech Park, Tower B, 4th Floor, Whitefield Main Road..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Operating Branch Locations / Global Delivery Centers
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newLocationInput}
                    onChange={e => setNewLocationInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddLocation();
                      }
                    }}
                    placeholder="Add location (e.g. Pune, Hyderabad, Munich, Detroit)"
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddLocation}
                    className="px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 min-h-8 p-3 rounded-xl border border-slate-200 bg-slate-50">
                  {operatingLocations.length === 0 ? (
                    <span className="text-xs text-slate-400 italic">No secondary office locations added yet.</span>
                  ) : (
                    operatingLocations.map(loc => (
                      <span
                        key={loc}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-800 shadow-2xs"
                      >
                        <MapPin className="w-3 h-3 text-blue-600" />
                        <span>{loc}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveLocation(loc)}
                          className="hover:text-rose-600 p-0.5 rounded cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: PLM & Engineering Environment */}
          {activeSection === 'tech' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Primary PLM Systems in Use <span className="text-slate-400 font-normal">(Select all that apply)</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {availablePLMs.map(sys => {
                    const selected = primaryPLMStack.includes(sys);
                    return (
                      <button
                        type="button"
                        key={sys}
                        onClick={() => togglePLM(sys)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                          selected
                            ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span className="truncate pr-1">{sys}</span>
                        {selected ? (
                          <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        ) : (
                          <Plus className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Integrated CAD / Engineering Environments
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availableCADs.map(tool => {
                    const selected = cadEnvironments.includes(tool);
                    return (
                      <button
                        type="button"
                        key={tool}
                        onClick={() => toggleCAD(tool)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                          selected
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span className="truncate pr-1">{tool}</span>
                        {selected ? (
                          <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        ) : (
                          <Plus className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Dedicated PLM Practice / Engineering Team Scale
                </label>
                <select
                  value={plmTeamSize}
                  onChange={e => setPlmTeamSize(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Select team size scale...</option>
                  {PLM_PRACTICE_SIZES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* SECTION 5: Corporate Verification & Legitimacy Documents */}
          {activeSection === 'verification' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-950 text-xs space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>Main Admin Enterprise Verification Governance</span>
                </div>
                <p className="text-amber-800 leading-relaxed">
                  As part of the PLMSpider authenticity guarantee: all Job Providers are verified by the platform admin against their corporate domain, tax identification (EIN/GSTIN/CIN), and registered business proofs before authenticated credentials are confirmed.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Corporate Domain
                  </label>
                  <input
                    type="text"
                    value={corporateDomain}
                    onChange={e => setCorporateDomain(e.target.value)}
                    placeholder="e.g. company.com"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Domain used for official email verification
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tax Registration / GSTIN / CIN / EIN <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={taxRegistrationNumber}
                    onChange={e => setTaxRegistrationNumber(e.target.value)}
                    placeholder="e.g. GSTIN 29AAAAA0000A1Z5 or EIN 12-3456789"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Official tax ID or business incorporation registration number
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Submitted Verification Document (Certificate of Incorporation / Tax License)
                </label>
                
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-blue-400 transition-colors bg-slate-50">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <div>
                      <span className="text-xs font-semibold text-slate-800">
                        {verificationDocName || 'Upload Business Registration or Tax Certificate'}
                      </span>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        PDF, DOCX, or scanned certificate proof (Max 10MB)
                      </p>
                    </div>

                    <label className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer inline-flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{verificationDocName ? 'Replace Document' : 'Browse File'}</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.png,.jpg"
                        onChange={handleFileUploadSim}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {verificationDocName && (
                  <div className="mt-2 flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-mono">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <span>{verificationDocName}</span>
                    </div>
                    <span className="text-[11px] font-sans font-semibold text-emerald-700">Attached for Audit</span>
                  </div>
                )}
              </div>
            </div>
          )}

        </form>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Section:</span>
            <span className="capitalize">{activeSection}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving Changes...' : 'Save & Update Profile'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
