import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EmployerProfile } from '../types';
import { 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  FileText, 
  ExternalLink, 
  Mail, 
  Send, 
  Eye, 
  Check, 
  X, 
  ArrowUpRight,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
  Search,
  Filter
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
    simulatedEmails, 
    setIsEmailDrawerOpen,
    candidate,
    setRole,
    setCurrentEmployerId
  } = useApp();

  const [selectedAuditEmp, setSelectedAuditEmp] = useState<EmployerProfile | null>(
    employers.find(e => e.verificationStatus === 'pending_verification') || employers[0] || null
  );

  const [auditNotes, setAuditNotes] = useState(
    'Corporate domain DNS verified. Valid federal employer identification (EIN) confirmed on state business registry. Approved for enterprise PLM recruiting.'
  );

  const [rejectReason, setRejectReason] = useState('');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [empToReject, setEmpToReject] = useState<EmployerProfile | null>(null);

  const pendingEmployers = employers.filter(
    e => e.verificationStatus === 'pending_verification' || e.verificationStatus === 'under_review'
  );
  const verifiedEmployers = employers.filter(e => e.verificationStatus === 'verified');

  const handleApprove = (emp: EmployerProfile) => {
    approveEmployer(emp.id, auditNotes);
    // Refresh selection
    const nextPending = employers.find(e => e.id !== emp.id && e.verificationStatus === 'pending_verification');
    setSelectedAuditEmp(nextPending || null);
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
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
          >
            + Register Test Employer
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
              {employers.map(emp => {
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
                            setSelectedAuditEmp(emp);
                            setActiveTab('verification-queue');
                          }}
                          className="px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
                        >
                          Audit & Approve →
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setCurrentEmployerId(emp.id);
                            setRole('employer');
                          }}
                          className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                        >
                          View as Employer →
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
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
            <span className="text-xs font-medium text-slate-500">Automated Dispatch Emails</span>
            <div className="text-2xl font-bold font-mono text-blue-700">
              {simulatedEmails.length}
            </div>
            <span className="text-[11px] text-slate-400">SMTP logs recorded</span>
          </div>
        </div>

        {/* Platform Share Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900">
              Market Demand by PLM Platform
            </h2>
            <div className="space-y-3">
              {[
                { name: 'Siemens Teamcenter', percent: 48, count: '14 Enterprise seats', color: 'bg-blue-600' },
                { name: 'PTC Windchill', percent: 28, count: '8 Enterprise seats', color: 'bg-emerald-600' },
                { name: 'Dassault 3DEXPERIENCE / ENOVIA', percent: 16, count: '5 Enterprise seats', color: 'bg-slate-700' },
                { name: 'Aras Innovator & Open PLM', percent: 8, count: '3 Enterprise seats', color: 'bg-amber-600' },
              ].map(item => (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{item.name}</span>
                    <span className="font-mono text-slate-500">{item.percent}% ({item.count})</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900">
              Compliance & Export Control Breakdown
            </h2>
            <div className="space-y-3">
              {[
                { name: 'ITAR Defense / DSS Clearance', count: '62% of Open Roles', desc: 'Defense aerospace & propulsion' },
                { name: 'FDA 21 CFR Part 11 / ISO 13485', count: '24% of Open Roles', desc: 'Medical device & surgical robotics' },
                { name: 'Automotive / ASPICE & ISO 26262', count: '14% of Open Roles', desc: 'EV battery & powertrain architecture' },
              ].map(item => (
                <div key={item.name} className="p-3 rounded-lg border border-slate-100 bg-slate-50 space-y-0.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-900">
                    <span>{item.name}</span>
                    <span className="font-mono text-blue-700">{item.count}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    );
  }

  // Sub-view: System & Email Audit Logs
  if (activeTab === 'audit-logs') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              System Audit & SMTP Email Dispatch Monitor
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Every employer registration sends an email to the Main Admin. All triggers logged here.
            </p>
          </div>
          <button
            onClick={() => setIsEmailDrawerOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Open Email Simulator Drawer</span>
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100">
          {simulatedEmails.map(mail => (
            <div key={mail.id} className="p-4 hover:bg-slate-50/60 transition-colors space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-slate-900 text-white flex items-center justify-center text-[10px] font-mono">
                    @
                  </div>
                  <span className="text-xs font-bold text-slate-900">{mail.subject}</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  {new Date(mail.timestamp).toLocaleString()}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-mono text-[11px]">
                <span>To: <strong className="text-slate-800">{mail.to}</strong></span>
                <span>·</span>
                <span>From: <strong className="text-slate-800">{mail.from}</strong></span>
                <span>·</span>
                <span className="uppercase text-[9px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {mail.triggerEvent.replace('_', ' ')}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-700 whitespace-pre-wrap font-sans max-h-32 overflow-y-auto">
                {mail.body}
              </div>
            </div>
          ))}
        </div>
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
            As mandated by PLM Nexus governance: Whenever a Job Provider (company) registers, an automated email is dispatched to you (<span className="font-mono text-slate-700">admin@plmnexus.internal</span>). You audit their corporate domain, tax registration, and PLM credentials before they can publish jobs or join the network.
          </p>
        </div>

        <button
          onClick={onOpenRegisterModal}
          className="px-3.5 py-2 text-xs font-semibold text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
        >
          + Register Another Company (Test Flow)
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
                  className="mt-2 px-3 py-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Register a test company →
                </button>
              </div>
            ) : (
              pendingEmployers.map(emp => {
                const isSelected = selectedAuditEmp?.id === emp.id;

                return (
                  <button
                    key={emp.id}
                    onClick={() => setSelectedAuditEmp(emp)}
                    className={`w-full p-4 text-left transition-colors flex items-start gap-3 ${
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
          {selectedAuditEmp ? (
            <div className="p-6 space-y-6">
              
              {/* Employer Header Lockup */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl text-white font-bold text-lg flex items-center justify-center shadow-sm ${selectedAuditEmp.logoBg}`}>
                    {selectedAuditEmp.logoInitials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-slate-900">
                        {selectedAuditEmp.companyName}
                      </h2>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        Awaiting Verification
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">
                      Legal Entity: {selectedAuditEmp.legalEntity}
                    </div>
                  </div>
                </div>

                <div className="text-right sm:shrink-0">
                  <span className="text-xs text-slate-400 block">Registration Request</span>
                  <span className="text-xs font-mono font-semibold text-slate-700">
                    {new Date(selectedAuditEmp.verificationRequestedAt).toLocaleString([], {
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
                      {selectedAuditEmp.corporateDomain}
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
                      {selectedAuditEmp.taxRegistrationNumber}
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
                      {selectedAuditEmp.primaryPLMStack.join(', ')}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      CAD Tools: {selectedAuditEmp.cadEnvironments.join(', ')}
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
                      {selectedAuditEmp.contactPerson} ({selectedAuditEmp.contactTitle})
                    </div>
                    <p className="text-[11px] font-mono text-slate-500">
                      {selectedAuditEmp.contactEmail}
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
                      {selectedAuditEmp.verificationDocName}
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
                  1. Grant verified status to {selectedAuditEmp.companyName}.
                  <br />
                  2. Automatically dispatch an official verification email to <span className="font-mono font-semibold">{selectedAuditEmp.contactEmail}</span>.
                  <br />
                  3. Unlock their pending PLM positions and permit direct communication with candidates.
                </p>
              </div>

              {/* Primary Governance Actions */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={() => handleOpenReject(selectedAuditEmp)}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors"
                >
                  Reject / Request Revised Proof
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setCurrentEmployerId(selectedAuditEmp.id);
                      setRole('employer');
                    }}
                    className="w-full sm:w-auto px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 rounded-xl transition-colors"
                  >
                    Preview Company View
                  </button>

                  <button
                    onClick={() => handleApprove(selectedAuditEmp)}
                    className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve & Unlock Enterprise</span>
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="p-16 text-center text-slate-400 space-y-2">
              <Building2 className="w-10 h-10 mx-auto text-slate-300" />
              <div className="text-sm font-semibold text-slate-700">Select an enterprise to audit</div>
              <p className="text-xs">Choose a company from the queue on the left to begin verification.</p>
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
                Please provide the specific reason for rejecting verification. This explanation will be automatically dispatched via email to <strong className="font-mono">{empToReject.contactEmail}</strong>.
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
                  Confirm Rejection & Dispatch Email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
