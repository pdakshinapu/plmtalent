import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  CheckCircle2, 
  Clock, 
  X, 
  Check, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Briefcase, 
  ArrowRight,
  MapPin,
  DollarSign,
  FileText,
  UserCheck,
  ExternalLink
} from 'lucide-react';

interface CandidateInvitationsViewProps {
  initialTab?: 'all' | 'connections' | 'invitations';
  onBackToJobs?: () => void;
}

export const CandidateInvitationsView: React.FC<CandidateInvitationsViewProps> = ({ 
  initialTab = 'all',
  onBackToJobs 
}) => {
  const { 
    jobInvitations, 
    respondToJobInvitation, 
    candidate,
    currentUser,
    userSession,
    employers 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'all' | 'connections' | 'invitations'>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveSubTab(initialTab);
    }
  }, [initialTab]);

  // Filter invitations and connections belonging to this candidate
  const myInvitations = (jobInvitations || []).filter(inv => 
    !inv.candidateId || 
    inv.candidateId === candidate?.id || 
    (currentUser?.uid && inv.candidateId === currentUser.uid) ||
    (userSession?.id && inv.candidateId === userSession.id) ||
    (inv.candidateName && candidate?.name && inv.candidateName.toLowerCase() === candidate.name.toLowerCase())
  );

  const pendingInvites = myInvitations.filter(inv => inv.status === 'pending');
  const acceptedConnections = myInvitations.filter(inv => inv.status === 'accepted');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-white min-h-[80vh]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#BA3A2C]/10 text-[#BA3A2C] text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#BA3A2C]" />
            <span>Direct Connections & Job Invitations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Direct Connections & Job Invitations
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Verified enterprise employers invite you with their active Job ID and full job scope. Review their requirements. Accepting an invitation unlocks mutual direct contact and establishes an official Direct Connection.
          </p>
        </div>

        {onBackToJobs && (
          <button
            onClick={onBackToJobs}
            className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <span>Browse PLM Jobs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveSubTab('all')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'all'
              ? 'bg-[#BA3A2C] text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          All Items ({myInvitations.length})
        </button>

        <button
          onClick={() => setActiveSubTab('connections')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === 'connections'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Direct Connections ({acceptedConnections.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('invitations')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === 'invitations'
              ? 'bg-[#BA3A2C] text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Job Invitations ({pendingInvites.length})</span>
          {pendingInvites.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          )}
        </button>
      </div>

      {/* SECTION 1: Active Connected Employers (Direct Connections) */}
      {(activeSubTab === 'all' || activeSubTab === 'connections') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-bold text-slate-900">
                Active Direct Connections
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900">
                {acceptedConnections.length} Connected
              </span>
            </div>
          </div>

          {acceptedConnections.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 space-y-1.5">
              <UserCheck className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">No active direct connections yet.</p>
              <p>When an employer sends you a job invitation with a Job ID and you accept, your mutual direct connections and unlocked employer contact information will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {acceptedConnections.map(inv => {
                const employerProfile = employers.find(e => e.id === inv.employerId || e.companyName.toLowerCase() === inv.employerName.toLowerCase());
                return (
                  <div 
                    key={inv.id} 
                    className="p-6 rounded-2xl border-2 border-emerald-200 bg-white hover:border-emerald-300 shadow-sm space-y-4 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-900 text-white font-bold text-base flex items-center justify-center shrink-0">
                          {inv.employerName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-slate-900">{inv.employerName}</h3>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Direct Connection Active
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                            <span>Corporate Domain: <strong className="text-slate-700 font-mono">{inv.employerCorporateDomain || employerProfile?.corporateDomain || 'verified-enterprise.com'}</strong></span>
                            <span>·</span>
                            <span>Connected on {inv.respondedAt ? new Date(inv.respondedAt).toLocaleDateString() : 'Active'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-left sm:text-right shrink-0">
                        <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {inv.jobTitle}
                        </span>
                      </div>
                    </div>

                    {/* Matched Opportunity Details */}
                    <div>
                      <div className="text-sm font-bold text-[#0B2545] mb-1">
                        Matched Position: {inv.jobTitle}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {inv.jobSummary}
                      </p>
                    </div>

                    {/* Unlocked Contact Details Banner */}
                    <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Direct contact shared with employer. Both parties can communicate directly regarding this opportunity.</span>
                      </div>
                      {inv.employerCorporateDomain && (
                        <span className="font-mono text-emerald-800 font-semibold shrink-0">
                          @{inv.employerCorporateDomain}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: Pending Invitations Requiring Candidate Review */}
      {(activeSubTab === 'all' || activeSubTab === 'invitations') && (
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-bold text-slate-900">
              Pending Invitations Awaiting Your Decision
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#BA3A2C] text-white">
              {pendingInvites.length} Action Needed
            </span>
          </div>

          {pendingInvites.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 space-y-1">
              <p className="font-semibold text-slate-700">No pending job invitations right now.</p>
              <p>Employers will send direct invitations with their Job ID when your profile matches their requirements.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingInvites.map(inv => (
                <div 
                  key={inv.id}
                  className="p-6 rounded-2xl border-2 border-slate-200 hover:border-[#BA3A2C]/60 bg-white shadow-sm space-y-5 transition-all"
                >
                  {/* Employer & Verification Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-900 text-white font-bold text-base flex items-center justify-center shrink-0">
                        {inv.employerName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-base font-bold text-slate-900">{inv.employerName}</h3>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Verified Enterprise
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <span>Domain: {inv.employerCorporateDomain || 'enterprise.com'}</span>
                          <span>·</span>
                          <span>EIN: {inv.employerTaxNumber || 'EIN-VERIFIED'}</span>
                          <span>·</span>
                          <span>Sent {new Date(inv.sentAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                        {inv.workplaceType || 'Direct Opportunity'}
                      </span>
                    </div>
                  </div>

                  {/* Position Title & Key Terms */}
                  <div>
                    <h4 className="text-lg font-bold text-[#0B2545] leading-tight mb-2">
                      {inv.jobTitle}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-700 mb-3">
                      {inv.proposedCompensation && (
                        <span className="flex items-center gap-1 font-semibold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
                          <DollarSign className="w-3.5 h-3.5 text-[#BA3A2C]" />
                          <span>Proposed: {inv.proposedCompensation}</span>
                        </span>
                      )}
                      {inv.workplaceType && (
                        <span className="bg-slate-100 px-2.5 py-1 rounded-md font-medium text-slate-700">
                          {inv.workplaceType}
                        </span>
                      )}
                      {inv.location && (
                        <span className="flex items-center gap-1 text-slate-600">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{inv.location}</span>
                        </span>
                      )}
                    </div>

                    {/* Job Description Extract */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-2">
                      <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                        Job Scope & Requirements
                      </div>
                      <p>{inv.jobSummary}</p>
                      {inv.jobRequirements && inv.jobRequirements.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {inv.jobRequirements.map(req => (
                            <span key={req} className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 text-[11px] font-medium">
                              {req}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Hiring Manager Direct Note */}
                    {inv.invitationNote && (
                      <div className="mt-3 p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
                        <div className="font-bold text-amber-950 text-[11px] uppercase tracking-wider">
                          Personal Note from Hiring Manager:
                        </div>
                        <p className="italic text-slate-800">"{inv.invitationNote}"</p>
                      </div>
                    )}
                  </div>

                  {/* Consent Action Buttons */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
                    <div className="text-[11px] text-slate-500">
                      By clicking <strong>Accept & Connect</strong>, you agree to share your direct contact details and verified profile with this employer, creating an active Direct Connection.
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => respondToJobInvitation(inv.id, false)}
                        className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>
                      <button
                        onClick={() => respondToJobInvitation(inv.id, true)}
                        className="px-5 py-2 text-xs font-bold text-white bg-[#BA3A2C] hover:bg-[#9E2F23] rounded-xl transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>Accept Job & Connect</span>
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
