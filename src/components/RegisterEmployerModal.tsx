import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PLMSystem, CADTool } from '../types';
import { 
  X, 
  Building2, 
  ShieldCheck, 
  Upload, 
  Check, 
  AlertCircle, 
  ArrowRight,
  CheckCircle2,
  FileText
} from 'lucide-react';

interface RegisterEmployerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessSwitchToAdmin?: () => void;
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

const AVAILABLE_CAD_TOOLS: CADTool[] = [
  'Siemens NX',
  'CATIA V5/V6',
  'PTC Creo',
  'SolidWorks',
  'Autodesk Inventor',
  'Altium Designer'
];

export const RegisterEmployerModal: React.FC<RegisterEmployerModalProps> = ({ 
  isOpen, 
  onClose,
  onSuccessSwitchToAdmin
}) => {
  const { registerEmployer, setRole } = useApp();

  const [companyName, setCompanyName] = useState('');
  const [legalEntity, setLegalEntity] = useState('');
  const [corporateDomain, setCorporateDomain] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactTitle, setContactTitle] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [industry, setIndustry] = useState<'Aerospace & Defense' | 'Automotive & EV' | 'Medical Technology' | 'Industrial Machinery' | 'Electronics'>('Aerospace & Defense');
  const [headquarters, setHeadquarters] = useState('');
  const [companySize, setCompanySize] = useState('500 - 1,000 employees');
  const [website, setWebsite] = useState('');
  const [taxRegistrationNumber, setTaxRegistrationNumber] = useState('');
  const [about, setAbout] = useState('');
  const [selectedPLMStack, setSelectedPLMStack] = useState<PLMSystem[]>([]);
  const [selectedCAD, setSelectedCAD] = useState<CADTool[]>([]);
  const [docName, setDocName] = useState('');

  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [registeredId, setRegisteredId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const togglePLM = (system: PLMSystem) => {
    setSelectedPLMStack(prev => 
      prev.includes(system) ? prev.filter(s => s !== system) : [...prev, system]
    );
  };

  const toggleCAD = (tool: CADTool) => {
    setSelectedCAD(prev => 
      prev.includes(tool) ? prev.filter(t => t !== tool) : [...prev, tool]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !contactEmail || !taxRegistrationNumber) return;

    setIsSubmitting(true);

    try {
      const id = await registerEmployer({
        companyName: companyName.trim(),
        legalEntity: legalEntity.trim() || companyName.trim(),
        corporateDomain: corporateDomain.trim() || (contactEmail.includes('@') ? contactEmail.split('@')[1] : ''),
        contactEmail: contactEmail.trim(),
        adminEmail: adminEmail.trim() || contactEmail.trim(),
        contactPerson: contactPerson.trim(),
        contactTitle: contactTitle.trim(),
        industry,
        headquarters: headquarters.trim() || 'Global / Remote',
        companySize,
        website: website.trim(),
        primaryPLMStack: selectedPLMStack,
        cadEnvironments: selectedCAD,
        taxRegistrationNumber: taxRegistrationNumber.trim(),
        verificationDocName: docName.trim() || undefined,
        about: about.trim(),
      });

      setRegisteredId(id);
      setSubmittedSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Register PLM Employer Organization
              </h2>
              <p className="text-xs text-slate-500">
                Requires Main Admin Verification before job publishing is activated
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
                Employer Registered & Verification Submitted!
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your enterprise credentials, tax registration (<span className="font-mono">{taxRegistrationNumber}</span>), corporate domain, and PLM stack have been submitted to the Main Admin queue.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-left text-xs text-amber-900 space-y-1">
              <div className="font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>What happens next:</span>
              </div>
              <p className="text-amber-800 text-[11px] leading-relaxed">
                As per platform security governance, you cannot publish public jobs until the Main Admin audits and verifies your company. You can switch to the <strong>Main Admin view</strong> to review and approve your company verification.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setRole('admin');
                  onClose();
                  if (onSuccessSwitchToAdmin) onSuccessSwitchToAdmin();
                }}
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Switch to Main Admin & Verify Company</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Continue as Employer (Pending Review)
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">

            {/* Company & Legal Info */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                1. Company Identification & Domain
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    placeholder="e.g. AeroSys Dynamics"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Legal Registered Entity Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={legalEntity}
                    onChange={e => setLegalEntity(e.target.value)}
                    placeholder="e.g. AeroSys Dynamics Corp LLC"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Corporate Domain *
                  </label>
                  <input
                    type="text"
                    required
                    value={corporateDomain}
                    onChange={e => setCorporateDomain(e.target.value)}
                    placeholder="e.g. aerosys.aero"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Tax ID / EIN / Business Reg *
                  </label>
                  <input
                    type="text"
                    required
                    value={taxRegistrationNumber}
                    onChange={e => setTaxRegistrationNumber(e.target.value)}
                    placeholder="e.g. EIN-84-2918402"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Primary Industry
                  </label>
                  <select
                    value={industry}
                    onChange={e => setIndustry(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 bg-white"
                  >
                    <option value="Aerospace & Defense">Aerospace & Defense</option>
                    <option value="Automotive & EV">Automotive & EV</option>
                    <option value="Medical Technology">Medical Technology</option>
                    <option value="Industrial Machinery">Industrial Machinery</option>
                    <option value="Electronics">Electronics</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Headquarters Location
                  </label>
                  <input
                    type="text"
                    value={headquarters}
                    onChange={e => setHeadquarters(e.target.value)}
                    placeholder="e.g. Seattle, WA, USA"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Company Size
                  </label>
                  <select
                    value={companySize}
                    onChange={e => setCompanySize(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 bg-white"
                  >
                    <option value="50 - 200 employees">50 - 200 employees</option>
                    <option value="200 - 500 employees">200 - 500 employees</option>
                    <option value="500 - 1,000 employees">500 - 1,000 employees</option>
                    <option value="1,000 - 5,000 employees">1,000 - 5,000 employees</option>
                    <option value="5,000+ employees">5,000+ employees</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Representative & Contacts */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                2. Corporate Contact & Authorization
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Representative Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactPerson}
                    onChange={e => setContactPerson(e.target.value)}
                    placeholder="e.g. Elena Ramos"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Job Title / Role
                  </label>
                  <input
                    type="text"
                    value={contactTitle}
                    onChange={e => setContactTitle(e.target.value)}
                    placeholder="e.g. VP of Digital Engineering"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Official Corporate Email (Domain-matched) *
                  </label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={e => setContactEmail(e.target.value)}
                    placeholder="e.g. e.ramos@aerosys.aero"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Corporate Website
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={e => setWebsite(e.target.value)}
                    placeholder="https://aerosys.aero"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* PLM Technology Stack */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                3. Declared PLM Environment & CAD Stack
              </h3>
              <p className="text-xs text-slate-500">
                Only specialists matching these environments will see and apply to your positions.
              </p>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-2">
                  PLM Platforms in Use (Select at least one)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {AVAILABLE_PLM_SYSTEMS.map(sys => {
                    const isSelected = selectedPLMStack.includes(sys);
                    return (
                      <button
                        key={sys}
                        type="button"
                        onClick={() => togglePLM(sys)}
                        className={`p-2 rounded-lg border text-left text-xs transition-colors flex items-center justify-between ${
                          isSelected 
                            ? 'bg-slate-900 text-white border-slate-900 font-medium' 
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
                <label className="block text-xs font-medium text-slate-700 mb-2">
                  Integrated CAD Tools
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {AVAILABLE_CAD_TOOLS.map(tool => {
                    const isSelected = selectedCAD.includes(tool);
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
                        <span className="truncate">{tool}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Verification Proof Document */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                4. Enterprise Verification Attachment
              </h3>
              
              <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-2xs">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-800">{docName}</div>
                    <div className="text-[11px] text-slate-500">Business license, certificate of incorporation, or tax proof</div>
                  </div>
                </div>
                <label className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer shadow-2xs">
                  Change File
                  <input
                    type="file"
                    className="hidden"
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        setDocName(e.target.files[0].name);
                      }
                    }}
                  />
                </label>
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
                disabled={isSubmitting || selectedPLMStack.length === 0}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-colors flex items-center gap-2 shadow-sm"
              >
                {isSubmitting ? (
                  <span>Submitting Registration...</span>
                ) : (
                  <>
                    <span>Submit for Admin Verification</span>
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
