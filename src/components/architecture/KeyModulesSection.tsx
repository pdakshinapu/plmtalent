import React from 'react';
import { 
  Key, 
  User, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  Search, 
  Eye, 
  MessageSquare, 
  Settings, 
  BarChart3,
  Lock
} from 'lucide-react';

export const KeyModulesSection: React.FC = () => {
  return (
    <div className="rounded-3xl border border-slate-800 bg-[#0B1222] p-6 sm:p-8 shadow-xl">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-400">
            SYSTEM CAPABILITY BREAKDOWN
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
            Key Modules (Phase 1 Core)
          </h3>
        </div>
        <span className="text-xs font-mono px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold">
          4 Core Modules Operational
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Module 1: Authentication & User Management */}
        <div className="rounded-2xl border border-blue-500/30 bg-blue-950/20 p-5 hover:border-blue-500/60 transition-colors">
          <div className="flex items-center gap-3 mb-3.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/40 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                Authentication & User Management
              </h4>
              <p className="text-[11px] text-blue-300 font-mono">Multi-Role Security Gateway</p>
            </div>
          </div>

          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span><strong>3 Dedicated Roles:</strong> Professional, Employer, Admin</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>Registration, Login, JWT Stateless Authentication</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>Granular Role-Based Access Control (RBAC) middleware</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>Bcrypt password hashing & session management</span>
            </li>
          </ul>
        </div>

        {/* Module 2: Professional Module */}
        <div className="rounded-2xl border border-sky-500/30 bg-sky-950/20 p-5 hover:border-sky-500/60 transition-colors">
          <div className="flex items-center gap-3 mb-3.5">
            <div className="w-8 h-8 rounded-lg bg-sky-600/20 text-sky-400 border border-sky-500/40 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                Professional Module
              </h4>
              <p className="text-[11px] text-sky-300 font-mono">Candidate Portfolio & Career Portal</p>
            </div>
          </div>

          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <span>Profile creation & comprehensive experience management</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <span>Resume upload & document storage (AWS S3)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <span>Declared skills taxonomy (Teamcenter, Windchill, NX, CATIA, Creo)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <span>Job search, targeted filter matching & 1-click application submission</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <span>Browse verified enterprise employers & optional content creation</span>
            </li>
          </ul>
        </div>

        {/* Module 3: Employer Module */}
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 hover:border-emerald-500/60 transition-colors">
          <div className="flex items-center gap-3 mb-3.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                Employer Module
              </h4>
              <p className="text-[11px] text-emerald-300 font-mono">Talent Acquisition & Pipeline Governance</p>
            </div>
          </div>

          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Company registration (requires strict Admin verification approval)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Comprehensive corporate profile & technology stack showcase</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Post and manage engineering jobs (active after verified status)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Search verified candidate database by tool, module & clearance</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Applicant tracking: shortlist, review resumes, reject, and message</span>
            </li>
          </ul>
        </div>

        {/* Module 4: Admin Module */}
        <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-5 hover:border-amber-500/60 transition-colors">
          <div className="flex items-center gap-3 mb-3.5">
            <div className="w-8 h-8 rounded-lg bg-amber-600/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold text-sm">
              4
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                Admin Module
              </h4>
              <p className="text-[11px] text-amber-300 font-mono">Superuser Control & Quality Assurance</p>
            </div>
          </div>

          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>Approve / reject pending employer company registrations with audit log</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>Manage all user accounts across professionals, employers & admins</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>Moderate active job postings, flagged content & community discussions</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>Platform settings: manage PLM/CAD skills catalog & taxonomy</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>Real-time platform reports, application velocity & analytics dashboard</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
};
