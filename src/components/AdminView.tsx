import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { EmployerProfile } from '../types';
import { AdminSettings } from './AdminSettings';
import { 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  FileText, 
  ExternalLink, 
  Eye, 
  Check, 
  X, 
  ArrowUpRight,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
  Search,
  Filter,
  Settings
} from 'lucide-react';

interface AdminViewProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenRegisterModal: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ 
  activeTab, 
  setActiveTab,
  onOpenRegisterModal 
}) => {
  const { 
    employers, 
    approveEmployer, 
    rejectEmployer, 
    jobs, 
    applications, 
    candidate,
    setCurrentEmployerId
  } = useApp();

  const [selectedAuditEmpId, setSelectedAuditEmpId] = useState<string | null>(null);
  const [viewingEmpRecord, setViewingEmpRecord] = useState<EmployerProfile | null>(null);

  const [auditNotes, setAuditNotes] = useState(
    'Corporate domain DNS verified. Valid federal employer identification (EIN) confirmed on state business registry. Approved for enterprise PLM recruiting.'
  );

  const [rejectReason, setRejectReason] = useState('');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [empToReject, setEmpToReject] = useState<EmployerProfile | null>(null);

  const pendingEmployers = useMemo(() => employers.filter(
    e => e.verificationStatus === 'pending_verification' || e.verificationStatus === 'under_review'
  ), [employers]);

  const verifiedEmployers = useMemo(() => employers.filter(
    e => e.verificationStatus === 'verified'
  ), [employers]);

  // Derive the active audit employer: strictly one of the pending employers, NEVER an already verified one
  const activeAuditEmp = useMemo(() => {
    if (selectedAuditEmpId) {
      const found = pendingEmployers.find(e => e.id === selectedAuditEmpId);
      if (found) return found;
    }
    return pendingEmployers.length > 0 ? pendingEmployers[0] : null;
  }, [pendingEmployers, selectedAuditEmpId]);

  const handleApprove = (emp: EmployerProfile) => {
    approveEmployer(emp.id, auditNotes);
    setSelectedAuditEmpId(null);
  };

  const handleOpenReject = (emp: EmployerProfile) => {
    setEmpToReject(emp);
    setRejectReason(`Missing official corporate tax return or unverified non-corporate email domain.`);
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empToReject) return;
    rejectEmployer(empToReject.id, rejectReason);
    setSelectedAuditEmpId(null);
    setIsRejectModalOpen(false);
    setEmpToReject(null);
  };

  // Sub-view: All Enterprises List
  if (activeTab === 'employers-list') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Enterprise Network & Verification Directory
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Complete registry of all registered organizations and governance states
            </p>
          </div>
          <button
            onClick={onOpenRegisterModal}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
          >
            + Register Enterprise
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="py-3.5 px-4">Enterprise Entity</th>
                <th className="py-3.5 px-4">Domain & Tax ID</th>
                <th className="py-3.5 px-4">PLM Environment</th>
                <th className="py-3.5 px-4">Verification Status</th>
                <th className="py-3.5 px-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700">No enterprise accounts registered yet.</p>
                    <p className="text-[11px] text-slate-400 mt-1">When employers register, their corporate profiles will appear here.</p>
                  </td>
                </tr>
              ) : (
                employers.map(emp => {
                const isVerified = emp.verificationStatus === 'verified';
                const isPending = emp.verificationStatus === 'pending_verification' || emp.verificationStatus === 'under_review';

                return (
                  <tr key={emp.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg text-white font-bold text-xs flex items-center justify-center shrink-0 ${emp.logoBg}`}>
                          {emp.logoInitials}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{emp.companyName}</div>
                          <div className="text-[11px] text-slate-500">{emp.legalEntity}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-700">
                      <div>{emp.corporateDomain}</div>
                      <div className="text-slate-400">{emp.taxRegistrationNumber}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{emp.primaryPLMStack.join(', ')}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{emp.cadEnvironments.join(', ')}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      {isVerified ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Verified
                        </span>
                      ) : isPending ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          <Clock className="w-3.5 h-3.5" />
                          Pending Audit
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Rejected
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {isPending ? (
                        <button
                          onClick={() => {
                            setSelectedAuditEmpId(emp.id);
                            setActiveTab('verification-queue');
                          }}
                          className="px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors cursor-pointer"
                        >
                          Audit & Approve →
                        </button>
                      ) : (
                        <button
                          onClick={() => setViewingEmpRecord(emp)}
                          className="px-2.5 py-1 text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg font-medium transition-colors cursor-pointer"
                        >
                          Active & Verified • View Record
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Sub-view: PLM Market Analytics
  if (activeTab === 'ecosystem-stats') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            PLM Market Intelligence & Platform Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time supply & demand metrics across Siemens Teamcenter, PTC Windchill, and Dassault 3DEXPERIENCE
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-medium text-slate-500">Verified Enterprises</span>
            <div className="text-2xl font-bold font-mono text-slate-900">
              {verifiedEmployers.length}
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">100% Legally Audited</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-medium text-slate-500">Pending Governance Audits</span>
            <div className="text-2xl font-bold font-mono text-amber-600">
              {pendingEmployers.length}
            </div>
            <span className="text-[11px] text-slate-400">Awaiting Admin Action</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-medium text-slate-500">Active PLM Requisitions</span>
            <div className="text-2xl font-bold font-mono text-slate-900">
              {jobs.filter(j => j.status === 'active').length}
            </div>
            <span className="text-[11px] text-slate-400">Live across network</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-medium text-slate-500">Applicant Submissions</span>
            <div className="text-2xl font-bold font-mono text-blue-700">
              {applications.length}
            </div>
            <span className="text-[11px] text-slate-400">Total pipeline applications</span>
          </div>
        </div>

        {/* Platform Share Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900">
              Market Demand by PLM Platform
            </h2>
            <div className="space-y-3">
              {(() => {
                const totalActive = jobs.filter(j => j.status === 'active').length;
                const tcJobs = jobs.filter(j => j.status === 'active' && (j.primaryPLM?.includes('Teamcenter') || j.relatedSystems?.some(s => s.includes('Teamcenter')))).length;
                const windchillJobs = jobs.filter(j => j.status === 'active' && (j.primaryPLM?.includes('Windchill') || j.relatedSystems?.some(s => s.includes('Windchill')))).length;
                const d3dJobs = jobs.filter(j => j.status === 'active' && (j.primaryPLM?.includes('3DEXPERIENCE') || j.primaryPLM?.includes('ENOVIA') || j.relatedSystems?.some(s => s.includes('3DEXPERIENCE')))).length;
                const arasJobs = jobs.filter(j => j.status === 'active' && (j.primaryPLM?.includes('Aras') || j.relatedSystems?.some(s => s.includes('Aras')))).length;

                const platformItems = [
                  { name: 'Siemens Teamcenter', count: tcJobs, percent: totalActive > 0 ? Math.round((tcJobs / totalActive) * 100) : 0, color: 'bg-blue-600' },
                  { name: 'PTC Windchill', count: windchillJobs, percent: totalActive > 0 ? Math.round((windchillJobs / totalActive) * 100) : 0, color: 'bg-emerald-600' },
                  { name: 'Dassault 3DEXPERIENCE / ENOVIA', count: d3dJobs, percent: totalActive > 0 ? Math.round((d3dJobs / totalActive) * 100) : 0, color: 'bg-slate-700' },
                  { name: 'Aras Innovator & Other PLM', count: arasJobs, percent: totalActive > 0 ? Math.round((arasJobs / totalActive) * 100) : 0, color: 'bg-amber-600' },
                ];

                return platformItems.map(item => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">{item.name}</span>
                      <span className="font-mono text-slate-500">
                        {item.percent}% ({item.count} position{item.count !== 1 ? 's' : ''})
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.percent}%` }} />
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900">
              Compliance & Export Control Breakdown
            </h2>
            <div className="space-y-3">
              {(() => {
                const totalActive = jobs.filter(j => j.status === 'active').length;
                const itarCount = jobs.filter(j => j.status === 'active' && j.itarRequired).length;
                const standardCount = Math.max(0, totalActive - itarCount);

                const complianceItems = [
                  { 
                    name: 'ITAR Defense / DSS Export Controlled', 
                    count: `${totalActive > 0 ? Math.round((itarCount / totalActive) * 100) : 0}% of Open Roles`, 
                    desc: `${itarCount} position${itarCount !== 1 ? 's' : ''} requiring defense or export clearance` 
                  },
                  { 
                    name: 'Commercial & Enterprise Industrial', 
                    count: `${totalActive > 0 ? Math.round((standardCount / totalActive) * 100) : 0}% of Open Roles`, 
                    desc: `${standardCount} position${standardCount !== 1 ? 's' : ''} with standard commercial clearance` 
                  },
                ];

                return complianceItems.map(item => (
                  <div key={item.name} className="p-3 rounded-lg border border-slate-100 bg-slate-50 space-y-0.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-900">
                      <span>{item.name}</span>
                      <span className="font-mono text-blue-700">{item.count}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{item.desc}</p>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>

      </div>
    );
  }

  // Sub-view: Platform Settings (Admin can manage dynamic PLM options)
  if (activeTab === 'platform-settings') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Platform Settings</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage dynamic dropdown options used across all forms.
            </p>
          </div>
        </div>
        <AdminSettings />
      </div>
    );
  }

  // DEFAULT VIEW: 'verification-queue' (The Core Employer Verification Console!)
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Supervisory Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Main Admin Company Verification Console
            </h1>
            <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 font-mono text-xs font-bold">
              {pendingEmployers.length} Pending Approval
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
            As mandated by PLMSpider governance: Whenever a Job Provider registers, their organization is held in pending status until you audit their corporate domain, tax registration, and PLM credentials before they can publish live requisitions.
          </p>
        </div>

        <button
          onClick={onOpenRegisterModal}
          className="px-3.5 py-2 text-xs font-semibold text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          + Register Organization
        </button>
      </div>

      {/* Split Audit Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Pane (4 cols): Pending Queue List */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Verification Queue ({pendingEmployers.length})
            </span>
            <span className="text-[11px] text-slate-500 font-mono">Priority FIFO</span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {pendingEmployers.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <h3 className="text-xs font-bold text-slate-900">All Queue Items Processed</h3>
                <p className="text-[11px] text-slate-500">
                  No employers currently awaiting verification.
                </p>
                <button
                  onClick={onOpenRegisterModal}
                  className="mt-2 px-3 py-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                >
                  Register an organization →
                </button>
              </div>
            ) : (
              pendingEmployers.map(emp => {
                const isSelected = activeAuditEmp?.id === emp.id;

                return (
                  <button
                    key={emp.id}
                    onClick={() => setSelectedAuditEmpId(emp.id)}
                    className={`w-full p-4 text-left transition-colors flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-50/70 border-l-3 border-l-amber-600'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg text-white font-bold text-xs flex items-center justify-center shrink-0 ${emp.logoBg}`}>
                      {emp.logoInitials}
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {emp.companyName}
                        </span>
                        <span className="text-[10px] text-amber-700 bg-amber-100/70 px-1.5 py-0.2 rounded font-mono">
                          Pending
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-500 font-mono truncate">
                        {emp.corporateDomain}
                      </div>

                      <div className="text-[11px] text-slate-600 line-clamp-1">
                        Stack: {emp.primaryPLMStack.join(', ')}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane (8 cols): Deep Audit & Approval Station */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {activeAuditEmp ? (
            <div className="p-6 space-y-6">
              
              {/* Employer Header Lockup */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl text-white font-bold text-lg flex items-center justify-center shadow-sm ${activeAuditEmp.logoBg}`}>
                    {activeAuditEmp.logoInitials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-slate-900">
                        {activeAuditEmp.companyName}
                      </h2>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                        activeAuditEmp.verificationStatus === 'verified'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : activeAuditEmp.verificationStatus === 'under_review'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {activeAuditEmp.verificationStatus === 'verified'
                          ? 'Verified'
                          : activeAuditEmp.verificationStatus === 'under_review'
                          ? 'Under Review'
                          : 'Awaiting Verification'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">
                      Legal Entity: {activeAuditEmp.legalEntity}
                    </div>
                  </div>
                </div>

                <div className="text-right sm:shrink-0">
                  <span className="text-xs text-slate-400 block">Registration Request</span>
                  <span className="text-xs font-mono font-semibold text-slate-700">
                    {new Date(activeAuditEmp.verificationRequestedAt || Date.now()).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>

              {/* 4-Point Governance Audit Checklist */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Mandatory Governance Verification Checklist
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  
                  {/* Point 1: Corporate Domain Match */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Corporate Domain
                      </span>
                      <span className="text-[10px] font-mono text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        MX Records Active
                      </span>
                    </div>
                    <div className="font-mono text-slate-700 text-[11px]">
                      {activeAuditEmp.corporateDomain}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Representative email domain matches official corporate website.
                    </p>
                  </div>

                  {/* Point 2: Tax Registration / EIN */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Tax Registration / EIN
                      </span>
                      <span className="text-[10px] font-mono text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        Federal Match
                      </span>
                    </div>
                    <div className="font-mono text-slate-700 text-[11px]">
                      {activeAuditEmp.taxRegistrationNumber}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Registered in good standing with corporate business authorities.
                    </p>
                  </div>

                  {/* Point 3: Declared PLM Technology Stack */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        PLM Ecosystem Stack
                      </span>
                      <span className="text-[10px] font-mono text-blue-700 font-semibold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                        OEM Supported
                      </span>
                    </div>
                    <div className="font-semibold text-slate-800 text-[11px]">
                      {activeAuditEmp.primaryPLMStack.join(', ')}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      CAD Tools: {activeAuditEmp.cadEnvironments.join(', ')}
                    </p>
                  </div>

                  {/* Point 4: Representative Authority */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Representative Lead
                      </span>
                      <span className="text-[10px] font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                        Authorized
                      </span>
                    </div>
                    <div className="font-medium text-slate-800 text-[11px]">
                      {activeAuditEmp.contactPerson} ({activeAuditEmp.contactTitle})
                    </div>
                    <p className="text-[11px] font-mono text-slate-500">
                      {activeAuditEmp.contactEmail}
                    </p>
                  </div>

                </div>
              </div>

              {/* Submitted Verification Document */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-blue-600 shadow-2xs">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">
                      {activeAuditEmp.verificationDocName || 'Corporate_Registry_Certificate.pdf'}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      CMMC / ITAR / Certificate of Incorporation Document Attachment
                    </div>
                  </div>
                </div>

                <span className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg shadow-2xs font-mono">
                  Verified PDF
                </span>
              </div>

              {/* Admin Audit Notes Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Administrator Audit Log & Approval Sign-off Note
                </label>
                <textarea
                  rows={2}
                  value={auditNotes}
                  onChange={e => setAuditNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-slate-900 font-sans"
                  placeholder="Enter audit verification rationale..."
                />
              </div>

              {/* Automated Next Steps Explanation */}
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-700" />
                  <span>Automated Workflow Trigger:</span>
                </div>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  Clicking <strong>Approve & Unlock Enterprise</strong> will:
                  <br />
                  1. Grant verified status to {activeAuditEmp.companyName}.
                  <br />
                  2. Activate verified credentials and unlock live job publishing across the network.
                  <br />
                  3. Permit candidate applications and direct hiring workflows.
                </p>
              </div>

              {/* Primary Governance Actions */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={() => handleOpenReject(activeAuditEmp)}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors cursor-pointer"
                >
                  Reject / Request Revised Proof
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleApprove(activeAuditEmp)}
                    className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve & Unlock Enterprise</span>
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Queue Cleared • 0 Pending Approval</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  All Organization Verifications Complete
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  All registered enterprises have been audited and verified. No organizations are currently awaiting compliance review. As new employers register, their records will automatically appear in this queue.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => setActiveTab('employers-list')}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-2xs transition-colors cursor-pointer"
                >
                  View Enterprise Directory ({employers.length}) →
                </button>
                <button
                  onClick={() => setActiveTab('ecosystem-stats')}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-2xs transition-colors cursor-pointer"
                >
                  PLM Market Analytics
                </button>
                <button
                  onClick={onOpenRegisterModal}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-2xs transition-colors cursor-pointer"
                >
                  + Register Organization
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* REJECT REASON MODAL */}
      {isRejectModalOpen && empToReject && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Reject Verification Request: {empToReject.companyName}
              </h3>
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmReject} className="space-y-4 text-xs">
              <p className="text-slate-600">
                Please provide the specific reason for rejecting verification. This explanation will be logged on their company record.
              </p>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Reason for Rejection
                </label>
                <textarea
                  rows={3}
                  required
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-slate-900 font-sans"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsRejectModalOpen(false)}
                  className="px-4 py-2 font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VERIFIED ENTERPRISE RECORD INSPECTION MODAL */}
      {viewingEmpRecord && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl text-white font-bold text-sm flex items-center justify-center shadow-xs ${viewingEmpRecord.logoBg}`}>
                  {viewingEmpRecord.logoInitials}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {viewingEmpRecord.companyName}
                  </h3>
                  <div className="text-xs text-slate-500 font-mono">
                    {viewingEmpRecord.legalEntity}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setViewingEmpRecord(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified & Active Enterprise
              </span>
              {viewingEmpRecord.verifiedAt && (
                <span className="text-[11px] text-slate-400 font-mono">
                  Verified: {new Date(viewingEmpRecord.verifiedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Corporate Domain</span>
                <div className="font-mono text-slate-800 font-medium">{viewingEmpRecord.corporateDomain || 'N/A'}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Tax EIN / Registration</span>
                <div className="font-mono text-slate-800 font-medium">{viewingEmpRecord.taxRegistrationNumber || 'N/A'}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">PLM Environment</span>
                <div className="font-medium text-slate-800">{viewingEmpRecord.primaryPLMStack?.join(', ') || 'N/A'}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">CAD Tools</span>
                <div className="font-medium text-slate-800">{viewingEmpRecord.cadEnvironments?.join(', ') || 'N/A'}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-0.5 sm:col-span-2">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Authorized Representative</span>
                <div className="font-medium text-slate-800">{viewingEmpRecord.contactPerson} ({viewingEmpRecord.contactTitle || 'Hiring Lead'})</div>
                <div className="text-[11px] font-mono text-slate-500">{viewingEmpRecord.contactEmail}</div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-slate-800 truncate max-w-[280px]">
                  {viewingEmpRecord.verificationDocName || 'Corporate_Registry_Certificate.pdf'}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
                Verified Document
              </span>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingEmpRecord(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
