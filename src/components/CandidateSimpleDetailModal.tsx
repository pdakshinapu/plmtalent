import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CandidateProfile } from '../types';
import { 
  X, 
  MapPin, 
  Clock, 
  Briefcase, 
  ShieldCheck, 
  FileText, 
  Mail, 
  Phone, 
  Download, 
  Lock, 
  CheckCircle2, 
  Send,
  Building2,
  ChevronRight
} from 'lucide-react';
import { SendJobInvitationModal } from './SendJobInvitationModal';

interface CandidateSimpleDetailModalProps {
  candidate: CandidateProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CandidateSimpleDetailModal: React.FC<CandidateSimpleDetailModalProps> = ({
  candidate,
  isOpen,
  onClose
}) => {
  const { isConnected, currentEmployer } = useApp();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  if (!isOpen || !candidate) return null;

  const connected = isConnected(candidate.id, currentEmployer?.id);

  // Derived or default lists matching screenshots
  const regionTag = candidate.region 
    ? `${candidate.seniorityLevel?.toUpperCase() || 'SENIOR'} · ${candidate.region.toUpperCase()}`
    : `SENIOR · ${candidate.location ? candidate.location.split(',')[0].toUpperCase() : 'NORTH AMERICA'}`;

  const skills = candidate.skillsList && candidate.skillsList.length > 0 
    ? candidate.skillsList 
    : [
        'PLM Business Analysis',
        'PLM Governance',
        'Product Data Governance',
        'BOM & Specification Control',
        'ECR/ECO Governance',
        'Configuration Management',
        'Lifecycle & Release Management',
        'Requirements Elicitation',
        'Functional Specifications',
        'Process Mapping & Standardization',
        'UAT',
        'User Training',
        'Document Control',
        'Metadata & Taxonomy Governance',
        'KPI Reporting',
        ...(candidate.modules || [])
      ];

  const platforms = candidate.platformsList && candidate.platformsList.length > 0
    ? candidate.platformsList
    : [candidate.primaryPLM || 'Siemens Teamcenter', ...(candidate.secondaryPLMs || []), ...(candidate.cadTools || [])];

  const industries = candidate.industriesList && candidate.industriesList.length > 0
    ? candidate.industriesList
    : ['Motion Control Solutions', 'R&D', 'Future Technology', 'Consumer Products', 'Industrial Equipment', 'High Tech & Electronics'];

  const education = candidate.educationList && candidate.educationList.length > 0
    ? candidate.educationList
    : ['BSc Electrical Electronic Engineer', 'MSc Information and Communication Technology'];

  const languages = candidate.languagesList && candidate.languagesList.length > 0
    ? candidate.languagesList
    : ['English', 'German working proficiency'];

  const employmentTypes = candidate.employmentTypes && candidate.employmentTypes.length > 0
    ? candidate.employmentTypes
    : ['Permanent / Full time', 'Contract'];

  const workLocations = candidate.workLocationPreferences && candidate.workLocationPreferences.length > 0
    ? candidate.workLocationPreferences
    : ['Travel as needed', 'Remote', 'Hybrid'];

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          
          {/* Top Modal Header */}
          <div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between bg-white shrink-0">
            <div>
              <div className="text-xs font-bold text-[#BA3A2C] uppercase tracking-wider mb-1">
                {regionTag}
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                {candidate.headline || candidate.name}
              </h1>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-7 text-xs bg-white">
            
            {/* SUMMARY Section */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#BA3A2C] mb-2">
                Summary
              </h2>
              {connected ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Direct Connection Active — Full Direct Contact Shared</span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-700">
                    {candidate.bio}
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-600">
                      A detailed professional summary and direct contact details are shared upon candidate invitation approval. Send an invitation to initiate.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsInviteModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#BA3A2C] hover:bg-[#9E2F23] text-white font-semibold text-xs transition-colors shrink-0 shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Job Invitation</span>
                  </button>
                </div>
              )}
            </div>

            {/* 4-Metric Grid (EXPERIENCE, SENIORITY, AVAILABILITY, LOCATION) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-xl border border-slate-200 bg-slate-50/50">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Experience
                </span>
                <span className="text-base sm:text-lg font-bold text-[#0B2545]">
                  {candidate.yearsOfExperience} yrs
                </span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Seniority
                </span>
                <span className="text-base sm:text-lg font-bold text-[#0B2545]">
                  {candidate.seniorityLevel || 'Senior'}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Availability
                </span>
                <span className="text-base sm:text-lg font-bold text-[#0B2545]">
                  {candidate.availableFrom || 'Immediately'}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Location
                </span>
                <span className="text-base sm:text-lg font-bold text-[#0B2545]">
                  {candidate.location || 'Global'}
                </span>
              </div>
            </div>

            {/* EMPLOYMENT TYPE */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#BA3A2C] mb-2.5">
                Employment Type
              </h3>
              <div className="flex flex-wrap gap-2">
                {employmentTypes.map(t => (
                  <span key={t} className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 bg-white text-xs font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* WORK LOCATION */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#BA3A2C] mb-2.5">
                Work Location
              </h3>
              <div className="flex flex-wrap gap-2">
                {workLocations.map(loc => (
                  <span key={loc} className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 bg-white text-xs font-medium">
                    {loc}
                  </span>
                ))}
              </div>
            </div>

            {/* WORK AUTHORIZATION */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#BA3A2C] mb-2.5">
                Work Authorization
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 bg-white text-xs font-medium">
                  {candidate.workAuthorization || 'Authorized / Citizen'}
                </span>
                {candidate.clearance && candidate.clearance !== 'None' && (
                  <span className="px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50 text-amber-900 text-xs font-semibold">
                    {candidate.clearance}
                  </span>
                )}
              </div>
            </div>

            {/* SKILLS */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#BA3A2C] mb-2.5">
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map(s => (
                  <span key={s} className="px-3 py-1.5 rounded-lg border border-sky-200 bg-sky-50/60 text-sky-900 text-xs font-medium hover:border-sky-300 transition-colors">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* PLATFORMS */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#BA3A2C] mb-2.5">
                Platforms
              </h3>
              <div className="flex flex-wrap gap-2">
                {platforms.map(p => (
                  <span key={p} className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-100 text-slate-800 text-xs font-semibold">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* INDUSTRIES */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#BA3A2C] mb-2.5">
                Industries
              </h3>
              <div className="flex flex-wrap gap-2">
                {industries.map(ind => (
                  <span key={ind} className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-medium">
                    {ind}
                  </span>
                ))}
              </div>
            </div>

            {/* EDUCATION */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#BA3A2C] mb-2.5">
                Education
              </h3>
              <div className="flex flex-wrap gap-2">
                {education.map(edu => (
                  <span key={edu} className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-medium">
                    {edu}
                  </span>
                ))}
              </div>
            </div>

            {/* LANGUAGES */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#BA3A2C] mb-2.5">
                Languages
              </h3>
              <div className="flex flex-wrap gap-2">
                {languages.map(lang => (
                  <span key={lang} className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-medium">
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            {/* EXPERIENCE / PROJECTS */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#BA3A2C] mb-2.5">
                Experience
              </h3>
              {connected ? (
                <div className="space-y-3">
                  {candidate.portfolioProjects?.map((proj, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs">{proj.title}</span>
                        <span className="text-[11px] font-mono text-slate-500">{proj.system}</span>
                      </div>
                      <p className="text-xs text-slate-600">{proj.description}</p>
                      {proj.impact && (
                        <p className="text-xs font-semibold text-emerald-700">Impact: {proj.impact}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 text-slate-500 text-xs">
                  Detailed work experience information is available upon verified connection.
                </div>
              )}
            </div>

            {/* CONTACT & RESUME SECTION */}
            <div className="pt-4 border-t border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#BA3A2C] mb-3">
                Contact & Verified Documentation
              </h3>
              {connected ? (
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    <span className="flex items-center gap-1.5 font-bold text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Direct Connection Established</span>
                    </span>
                    {candidate.phone && (
                      <a 
                        href={`tel:${candidate.phone}`}
                        className="flex items-center gap-1.5 font-bold text-slate-900 hover:text-[#BA3A2C] transition-colors"
                      >
                        <Phone className="w-4 h-4 text-[#BA3A2C]" />
                        <span>{candidate.phone}</span>
                      </a>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-emerald-200">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-700" />
                      <span className="text-xs font-semibold text-slate-800">
                        {candidate.resumeFileName || `${candidate.name.replace(/\s+/g, '_')}_Resume.pdf`}
                      </span>
                    </div>
                    <button
                      onClick={() => alert(`Downloading verified resume: ${candidate.resumeFileName || 'Resume.pdf'}`)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Resume</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-200/80 flex items-center justify-center text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">
                        Candidate direct contact and resume PDF are protected
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Direct contact details and resume unlock upon candidate accepting your job invitation.
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsInviteModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-[#BA3A2C] hover:bg-[#9E2F23] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Job Invitation</span>
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-100 text-xs font-semibold cursor-pointer transition-colors"
            >
              Close
            </button>
            {!connected && (
              <button
                onClick={() => setIsInviteModalOpen(true)}
                className="px-5 py-2 rounded-xl bg-[#BA3A2C] hover:bg-[#9E2F23] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Job Invitation</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Opportunity Invite Modal */}
      <SendJobInvitationModal
        candidate={candidate}
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />
    </>
  );
};
