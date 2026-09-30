import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CandidateProfile } from '../types';
import { 
  Building2, 
  Send, 
  X, 
  Briefcase, 
  DollarSign, 
  MapPin, 
  ShieldCheck, 
  FileText,
  AlertCircle
} from 'lucide-react';

interface SendJobInvitationModalProps {
  candidate: CandidateProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const SendJobInvitationModal: React.FC<SendJobInvitationModalProps> = ({
  candidate,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { currentEmployer, jobs, sendJobInvitation } = useApp();

  const activeJobs = jobs.filter(
    j => j.employerId === currentEmployer?.id || !currentEmployer?.id || (currentEmployer?.companyName && j.employerName === currentEmployer.companyName)
  );

  const [selectedJobId, setSelectedJobId] = useState<string>(activeJobs[0]?.id || 'custom');
  const [jobTitle, setJobTitle] = useState<string>(activeJobs[0]?.title || 'Senior PLM Solutions Engineer');
  const [proposedCompensation, setProposedCompensation] = useState<string>('$155,000 / yr');
  const [workplaceType, setWorkplaceType] = useState<'Remote' | 'Hybrid' | 'Onsite'>('Remote');
  const [location, setLocation] = useState<string>('Remote (US / Global)');
  const [jobSummary, setJobSummary] = useState<string>(
    'Lead enterprise PLM configuration, data migration, and CAD lifecycle integration across multi-site engineering groups.'
  );
  const [invitationNote, setInvitationNote] = useState<string>(
    'We reviewed your verified PLM competencies and believe your background fits our current engineering roadmap. We invite you to review our job details and connect directly.'
  );

  if (!isOpen || !candidate) return null;

  const handleSelectJob = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedJobId(val);
    if (val !== 'custom') {
      const found = activeJobs.find(j => j.id === val);
      if (found) {
        setJobTitle(found.title);
        setLocation(found.location || 'Remote');
        setWorkplaceType(found.workplaceType || 'Remote');
        setProposedCompensation(
          found.compensation?.min
            ? `$${found.compensation.min.toLocaleString()} - $${found.compensation.max?.toLocaleString()} / ${found.compensation.period}`
            : '$150,000 / yr'
        );
        setJobSummary(found.summary || 'Enterprise PLM deployment and architecture.');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim()) return;

    const companyName = currentEmployer?.companyName || 'Enterprise Partner';
    const effectiveJobId = selectedJobId === 'custom' ? `job-custom-${Date.now().toString().slice(-4)}` : selectedJobId;

    sendJobInvitation({
      jobId: effectiveJobId,
      jobTitle: jobTitle.trim(),
      employerId: currentEmployer?.id || 'emp-apex',
      employerName: companyName,
      employerLegalEntity: currentEmployer?.legalEntity || companyName,
      employerCorporateDomain: currentEmployer?.corporateDomain || 'enterprise.com',
      employerTaxNumber: currentEmployer?.taxRegistrationNumber || 'EIN-VERIFIED',
      candidateId: candidate.id,
      candidateName: candidate.name,
      candidateHeadline: candidate.headline,
      proposedCompensation: proposedCompensation.trim(),
      workplaceType,
      location: location.trim(),
      jobSummary: jobSummary.trim(),
      jobRequirements: candidate.modules.slice(0, 4),
      invitationNote: invitationNote.trim()
    });

    onClose();
    if (onSuccess) onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#BA3A2C]/10 text-[#BA3A2C] flex items-center justify-center font-bold">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Send Job Invitation
              </h2>
              <p className="text-[11px] text-slate-500">
                To: <span className="font-semibold text-slate-700">{candidate.name}</span> · {candidate.headline}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Information Notice */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 flex items-start gap-2.5 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-[#BA3A2C] shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">Direct Connect Protocol: </strong>
              The candidate will receive an official notification with your position details, job description, and company credentials. Once the candidate reviews and accepts, both parties establish a direct connection and unlock full unmasked contact details and verified resume.
            </div>
          </div>

          {/* Select Posted Job or Create Opportunity */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Position
            </label>
            <select
              value={selectedJobId}
              onChange={handleSelectJob}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BA3A2C] focus:bg-white text-slate-900 cursor-pointer"
            >
              {activeJobs.map(j => (
                <option key={j.id} value={j.id}>
                  {j.title}
                </option>
              ))}
              <option value="custom">+ Specify New Position</option>
            </select>
          </div>

          {/* Position Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Position Title
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              required
              placeholder="e.g. Senior Teamcenter Solution Architect"
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BA3A2C] focus:bg-white text-slate-900"
            />
          </div>

          {/* Workplace & Compensation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Workplace Model
              </label>
              <select
                value={workplaceType}
                onChange={(e) => setWorkplaceType(e.target.value as 'Remote' | 'Hybrid' | 'Onsite')}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BA3A2C] focus:bg-white text-slate-900 cursor-pointer"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Onsite">Onsite</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Proposed Compensation
              </label>
              <input
                type="text"
                value={proposedCompensation}
                onChange={(e) => setProposedCompensation(e.target.value)}
                placeholder="e.g. $155,000 / yr or $95 / hr"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BA3A2C] focus:bg-white text-slate-900"
              />
            </div>
          </div>

          {/* Job Description Summary */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Job Description & Scope
            </label>
            <textarea
              rows={3}
              value={jobSummary}
              onChange={(e) => setJobSummary(e.target.value)}
              required
              placeholder="Outline the responsibilities, project scope, and PLM technical deliverables..."
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BA3A2C] focus:bg-white text-slate-900 resize-none leading-relaxed"
            />
          </div>

          {/* Direct Note to Candidate */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Note from Hiring Manager
            </label>
            <textarea
              rows={2}
              value={invitationNote}
              onChange={(e) => setInvitationNote(e.target.value)}
              placeholder="Why this candidate was selected for this opportunity..."
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BA3A2C] focus:bg-white text-slate-900 resize-none leading-relaxed"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#BA3A2C] hover:bg-[#9E2F23] rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Job Invitation</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
