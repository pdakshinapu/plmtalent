import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckCircle2, 
  Clock, 
  Mail, 
  Phone, 
  Download, 
  Briefcase, 
  UserCheck, 
  MapPin, 
  ArrowRight, 
  Eye, 
  ShieldCheck,
  Building2,
  FileText
} from 'lucide-react';
import { CandidateSimpleDetailModal } from './CandidateSimpleDetailModal';
import { CandidateProfile } from '../types';

interface EmployerConnectionsViewProps {
  onSearchCandidates?: () => void;
  onBrowseCandidates?: () => void;
}

export const EmployerConnectionsView: React.FC<EmployerConnectionsViewProps> = ({ 
  onSearchCandidates,
  onBrowseCandidates 
}) => {
  const handleBrowse = onBrowseCandidates || onSearchCandidates;
  const { jobInvitations, allCandidates, currentEmployer } = useApp();
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateProfile | null>(null);

  // Filter invitations sent by this employer
  const employerInvites = jobInvitations.filter(
    inv => inv.employerId === (currentEmployer?.id || 'emp-apex') || !inv.employerId
  );

  const acceptedConnections = employerInvites.filter(inv => inv.status === 'accepted');
  const pendingInvitations = employerInvites.filter(inv => inv.status === 'pending');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-white min-h-[80vh]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#BA3A2C]/10 text-[#BA3A2C] text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#BA3A2C]" />
            <span>Enterprise Direct Connect</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Direct Connections & Job Invitations
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Manage your candidate invitations dispatched with Job IDs. Once candidates review your requirements and accept, direct communication is activated with verified phone contact and verified resume downloads.
          </p>
        </div>

        <button
          onClick={handleBrowse}
          className="px-4 py-2 text-xs font-bold text-white bg-[#BA3A2C] hover:bg-[#9E2F23] rounded-xl transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <span>Browse Candidate Directory</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* SECTION 1: Active Direct Connections (Approved & Unlocked) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2.5">
          <h2 className="text-base font-bold text-slate-900">
            Active Direct Connections (Full Profiles & Contact Unlocked)
          </h2>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900">
            {acceptedConnections.length} Connected
          </span>
        </div>

        {acceptedConnections.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-2">
            <UserCheck className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No active direct connections yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Browse candidate profiles and send a job invitation with your active Job ID. As soon as a candidate approves the job description, full direct contact details and resumes appear here.
            </p>
            <button
              onClick={handleBrowse}
              className="mt-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800"
            >
              Browse Candidate Directory
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {acceptedConnections.map(inv => {
              const cand = allCandidates.find(c => c.id === inv.candidateId);
              return (
                <div 
                  key={inv.id}
                  className="p-5 rounded-2xl border-2 border-emerald-200 bg-emerald-50/20 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Direct Connection Active</span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900">
                          {inv.candidateName}
                        </h3>
                        <p className="text-xs text-slate-600 font-medium">
                          {inv.candidateHeadline}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {inv.jobTitle}
                        </span>
                      </div>
                    </div>

                    {/* Job Reference Details */}
                    <div className="p-3 rounded-xl bg-white border border-emerald-100 text-xs space-y-1 my-3">
                      <div className="text-slate-500 text-[11px]">Associated Position:</div>
                      <div className="font-bold text-slate-800">{inv.jobTitle}</div>
                      {inv.proposedCompensation && (
                        <div className="text-[11px] text-slate-600">Proposed: {inv.proposedCompensation} · {inv.workplaceType}</div>
                      )}
                    </div>

                    {/* Unlocked Contact Details */}
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs space-y-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#BA3A2C]">
                        Unlocked Direct Contact
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-slate-700">
                        <span className="flex items-center gap-1.5 font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Direct Connection Active</span>
                        </span>
                        {cand?.phone && (
                          <a 
                            href={`tel:${cand.phone}`}
                            className="flex items-center gap-1 text-slate-900 font-semibold hover:text-[#BA3A2C] transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5 text-[#BA3A2C]" />
                            <span>{cand.phone}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <button
                      onClick={() => setSelectedCandidate(cand || null)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Full Profile</span>
                    </button>

                    <button
                      onClick={() => alert(`Downloading verified resume: ${cand?.resumeFileName || 'Resume.pdf'}`)}
                      className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Verified Resume PDF</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 2: Pending Sent Invitations (Awaiting Candidate Review) */}
      <div className="space-y-4 pt-6 border-t border-slate-200">
        <div className="flex items-center gap-2.5">
          <h2 className="text-base font-bold text-slate-900">
            Pending Job Invitations (Awaiting Candidate Review)
          </h2>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
            {pendingInvitations.length} Pending
          </span>
        </div>

        {pendingInvitations.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
            No pending candidate invitations at this time.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
            {pendingInvitations.map(inv => {
              const cand = allCandidates.find(c => c.id === inv.candidateId);
              return (
                <div key={inv.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{inv.candidateName}</span>
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                        {inv.jobTitle}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>Awaiting Response</span>
                      </span>
                    </div>

                    <div className="text-xs text-slate-600">
                      Position: <strong className="text-slate-800">{inv.jobTitle}</strong> · Proposed: {inv.proposedCompensation || 'Competitive'} · {inv.workplaceType}
                    </div>

                    {inv.invitationNote && (
                      <p className="text-[11px] text-slate-500 italic max-w-xl">
                        "{inv.invitationNote}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setSelectedCandidate(cand || null)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Profile</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Candidate Simple Detail Modal */}
      <CandidateSimpleDetailModal
        candidate={selectedCandidate}
        isOpen={!!selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
      />

    </div>
  );
};
