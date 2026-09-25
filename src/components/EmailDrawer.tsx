import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SimulatedEmail } from '../types';
import { 
  X, 
  Mail, 
  Send, 
  CheckCheck, 
  ArrowRight, 
  ShieldCheck, 
  Building2, 
  UserCheck, 
  FileText,
  Clock,
  ExternalLink
} from 'lucide-react';

interface EmailDrawerProps {
  onNavigateToAdminVerification?: () => void;
}

export const EmailDrawer: React.FC<EmailDrawerProps> = ({ onNavigateToAdminVerification }) => {
  const { 
    isEmailDrawerOpen, 
    setIsEmailDrawerOpen, 
    simulatedEmails, 
    markEmailAsRead, 
    markAllEmailsAsRead,
    setRole
  } = useApp();

  const [selectedEmail, setSelectedEmail] = useState<SimulatedEmail | null>(
    simulatedEmails[0] || null
  );

  if (!isEmailDrawerOpen) return null;

  const handleSelectEmail = (mail: SimulatedEmail) => {
    setSelectedEmail(mail);
    if (!mail.read) {
      markEmailAsRead(mail.id);
    }
  };

  const getEventBadge = (event: SimulatedEmail['triggerEvent']) => {
    switch (event) {
      case 'employer_registration':
        return { label: 'Admin Audit Dispatch', color: 'text-amber-700 bg-amber-50 border-amber-200' };
      case 'admin_company_approved':
        return { label: 'Enterprise Approved', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
      case 'admin_company_rejected':
        return { label: 'Audit Revision Notice', color: 'text-rose-700 bg-rose-50 border-rose-200' };
      case 'candidate_applied':
        return { label: 'Applicant Inbound', color: 'text-blue-700 bg-blue-50 border-blue-200' };
      case 'interview_scheduled':
        return { label: 'Interview Invitation', color: 'text-purple-700 bg-purple-50 border-purple-200' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Transactional Email Simulator
                </h2>
                <p className="text-xs text-slate-500">
                  Live simulated SMTP dispatch log between Employers, Platform Admin, and Candidates
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={markAllEmailsAsRead}
                className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors"
                title="Mark all as read"
              >
                Mark all read
              </button>
              <button
                onClick={() => setIsEmailDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Workflow explanation banner */}
          <div className="bg-blue-50/70 border-b border-blue-100 px-6 py-2.5 text-xs text-blue-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
              <span>
                <strong>Verification Rule:</strong> When an employer registers, an automated notification is instantly dispatched to <code className="font-mono text-[11px] bg-blue-100 px-1 py-0.5 rounded">admin@plmnexus.internal</code> for verification.
              </span>
            </div>
          </div>

          {/* Body: Split view of email list and message viewer */}
          <div className="flex-1 flex overflow-hidden">
            
            {/* Left Column: Email List */}
            <div className="w-2/5 border-r border-slate-200 overflow-y-auto divide-y divide-slate-100 bg-white">
              {simulatedEmails.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  No simulated emails yet. Register an employer or apply to a job to generate live dispatch logs.
                </div>
              ) : (
                simulatedEmails.map(mail => {
                  const badge = getEventBadge(mail.triggerEvent);
                  const isSelected = selectedEmail?.id === mail.id;

                  return (
                    <button
                      key={mail.id}
                      onClick={() => handleSelectEmail(mail)}
                      className={`w-full text-left p-3.5 transition-colors relative flex flex-col gap-1.5 ${
                        isSelected 
                          ? 'bg-blue-50/60 border-l-2 border-l-blue-600' 
                          : mail.read 
                            ? 'hover:bg-slate-50' 
                            : 'bg-slate-50/80 font-medium hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono text-slate-500 truncate max-w-[130px]">
                          {mail.to.split('@')[0]}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(mail.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div className={`text-xs line-clamp-1 ${mail.read ? 'text-slate-700' : 'text-slate-900 font-semibold'}`}>
                        {mail.subject}
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px]">
                        <span className={`px-1.5 py-0.5 rounded border text-[9px] font-medium uppercase tracking-wider ${badge.color}`}>
                          {badge.label}
                        </span>
                        {!mail.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 ml-auto" />
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Right Column: Email Content Inspector */}
            <div className="w-3/5 overflow-y-auto p-6 bg-slate-50/50 flex flex-col justify-between">
              {selectedEmail ? (
                <div className="space-y-4">
                  
                  {/* Email Headers Meta */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-900">
                        {selectedEmail.subject}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {new Date(selectedEmail.timestamp).toLocaleString([], { 
                          month: 'short', 
                          day: 'numeric', 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1 font-mono pt-2 border-t border-slate-100 text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 w-12">From:</span>
                        <span className="text-slate-800">{selectedEmail.from}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 w-12">To:</span>
                        <span className="text-slate-800 font-semibold">{selectedEmail.to}</span>
                      </div>
                    </div>
                  </div>

                  {/* Email Body */}
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <pre className="text-xs text-slate-800 whitespace-pre-wrap font-sans leading-relaxed">
                      {selectedEmail.body}
                    </pre>
                  </div>

                  {/* Contextual Action Shortcut if email is to Admin */}
                  {selectedEmail.to.includes('admin@plmnexus.internal') && (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-amber-900">
                          Main Admin Verification Required
                        </div>
                        <div className="text-[11px] text-amber-700">
                          Inspect company credentials and authorize platform access.
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setRole('admin');
                          setIsEmailDrawerOpen(false);
                          if (onNavigateToAdminVerification) {
                            onNavigateToAdminVerification();
                          }
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-amber-700 rounded-lg hover:bg-amber-800 transition-colors flex items-center gap-1.5"
                      >
                        <span>Open Admin Queue</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  Select an email from the left pane to view its content
                </div>
              )}

              {/* Bottom footer status */}
              <div className="mt-6 pt-4 border-t border-slate-200 text-[11px] text-slate-400 flex items-center justify-between font-mono">
                <span>SMTP Simulator · TLS 1.3 · Port 587</span>
                <span>Audit Verified</span>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
