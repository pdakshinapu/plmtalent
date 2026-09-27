import React, { useState } from 'react';
import { 
  User, 
  FileText, 
  Briefcase, 
  Users, 
  Building2, 
  Clock, 
  CheckCircle2, 
  Search, 
  ShieldCheck, 
  Eye, 
  Check, 
  X, 
  BarChart3, 
  ArrowRight,
  Sparkles,
  Lock
} from 'lucide-react';

export const UserFlowsVisual: React.FC = () => {
  const [activeStage, setActiveStage] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      
      {/* 1. PROFESSIONAL (EMPLOYEE / CANDIDATE) FLOW - BLUE */}
      <div className="rounded-2xl border border-blue-500/40 bg-[#0B1528] p-5 sm:p-6 shadow-xl overflow-hidden relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-blue-500/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 text-blue-400 border border-blue-500/40 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white tracking-tight">
                Professional (Employee/Candidate) Flow
              </h4>
              <p className="text-[11px] text-blue-300 font-mono">
                Direct Candidate Onboarding & Opportunity Discovery
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 font-semibold">
            Automatic Profile Activation
          </span>
        </div>

        {/* Horizontal Process Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
          
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 relative group hover:border-blue-400 transition-colors">
            <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/50 flex items-center justify-center text-blue-300 mb-2">
              <User className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">Register</span>
            <span className="text-[10px] text-blue-300/80 font-mono mt-0.5">Email + Password</span>
            <div className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-blue-400">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 relative group hover:border-blue-400 transition-colors">
            <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/50 flex items-center justify-center text-blue-300 mb-2">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">Create Profile</span>
            <span className="text-[10px] text-emerald-400 font-mono mt-0.5 font-semibold">(Automatic Approval)</span>
            <div className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-blue-400">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 relative group hover:border-blue-400 transition-colors">
            <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/50 flex items-center justify-center text-blue-300 mb-2">
              <Search className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">Search Jobs & Apply</span>
            <span className="text-[10px] text-blue-300/80 font-mono mt-0.5">PLM/CAD Tool Filters</span>
            <div className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-blue-400">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col items-center text-center p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 group hover:border-blue-400 transition-colors">
            <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/50 flex items-center justify-center text-blue-300 mb-2">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">Connect with Employers</span>
            <span className="text-[10px] text-blue-300/80 font-mono mt-0.5">Interview & Offer</span>
          </div>

        </div>
      </div>


      {/* 2. EMPLOYER FLOW (WITH ADMIN APPROVAL) - GREEN */}
      <div className="rounded-2xl border border-emerald-500/40 bg-[#071F15] p-5 sm:p-6 shadow-xl overflow-hidden relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-emerald-500/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white tracking-tight">
                Employer Flow (With Admin Approval)
              </h4>
              <p className="text-[11px] text-emerald-300 font-mono">
                Strict Enterprise Verification to Maintain Network Quality
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold">
            Enterprise Verification Required
          </span>
        </div>

        {/* Horizontal Process Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
          
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 relative group hover:border-emerald-400 transition-colors">
            <div className="w-10 h-10 rounded-full bg-emerald-600/20 border border-emerald-500/50 flex items-center justify-center text-emerald-300 mb-2">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">Register Company Profile</span>
            <span className="text-[10px] text-emerald-300/80 font-mono mt-0.5">Tax ID / Website URL</span>
            <div className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-emerald-400">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Step 2 (Yellow Approval Pending) */}
          <div className="flex flex-col items-center text-center p-3 rounded-xl bg-amber-950/40 border border-amber-500/50 relative group hover:border-amber-400 transition-colors">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/60 flex items-center justify-center text-amber-300 mb-2">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <span className="text-xs font-bold text-amber-200">Pending Admin Approval</span>
            <span className="text-[10px] text-amber-300/90 font-mono mt-0.5 font-semibold">Verification Queue</span>
            <div className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-emerald-400">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Step 3 (Approved by Admin) */}
          <div className="flex flex-col items-center text-center p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/50 relative group hover:border-emerald-400 transition-colors">
            <div className="w-10 h-10 rounded-full bg-emerald-500/30 border border-emerald-400 flex items-center justify-center text-emerald-300 mb-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-xs font-bold text-white">Approved by Admin</span>
            <span className="text-[10px] text-emerald-300 font-mono mt-0.5 font-semibold">Full Portal Access</span>
            <div className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-emerald-400">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col items-center text-center p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 group hover:border-emerald-400 transition-colors">
            <div className="w-10 h-10 rounded-full bg-emerald-600/20 border border-emerald-500/50 flex items-center justify-center text-emerald-300 mb-2">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">Post Jobs & Search Candidates</span>
            <span className="text-[10px] text-emerald-300/80 font-mono mt-0.5">Targeted PLM Sourcing</span>
          </div>

        </div>
      </div>


      {/* 3. ADMIN FLOW - YELLOW / GOLD */}
      <div className="rounded-2xl border border-amber-500/40 bg-[#1D1705] p-5 sm:p-6 shadow-xl overflow-hidden relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-amber-500/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-600/30 text-amber-400 border border-amber-500/40 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white tracking-tight">
                Admin Flow
              </h4>
              <p className="text-[11px] text-amber-300 font-mono">
                Platform Governance, Verification & Operational Moderation
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold">
            Superuser Control Plane
          </span>
        </div>

        {/* Horizontal Process Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
          
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 relative group hover:border-amber-400 transition-colors">
            <div className="w-10 h-10 rounded-full bg-amber-600/20 border border-amber-500/50 flex items-center justify-center text-amber-300 mb-2">
              <Lock className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">Login</span>
            <span className="text-[10px] text-amber-300/80 font-mono mt-0.5">Admin Credentials</span>
            <div className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-amber-400">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 relative group hover:border-amber-400 transition-colors">
            <div className="w-10 h-10 rounded-full bg-amber-600/20 border border-amber-500/50 flex items-center justify-center text-amber-300 mb-2">
              <Eye className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">Review Employer Registrations</span>
            <span className="text-[10px] text-amber-300/80 font-mono mt-0.5">Tax ID, Domain & Credentials</span>
            <div className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-amber-400">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 relative group hover:border-amber-400 transition-colors">
            <div className="w-10 h-10 rounded-full bg-amber-600/20 border border-amber-500/50 flex items-center justify-center text-amber-300 mb-2">
              <div className="flex items-center gap-1">
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-500">/</span>
                <X className="w-4 h-4 text-rose-400" />
              </div>
            </div>
            <span className="text-xs font-bold text-white">Approve / Reject Employers</span>
            <span className="text-[10px] text-amber-300/80 font-mono mt-0.5">1-Click Governance Action</span>
            <div className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-amber-400">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col items-center text-center p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 group hover:border-amber-400 transition-colors">
            <div className="w-10 h-10 rounded-full bg-amber-600/20 border border-amber-500/50 flex items-center justify-center text-amber-300 mb-2">
              <BarChart3 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">Manage Users, Jobs, Content, Reports</span>
            <span className="text-[10px] text-amber-300/80 font-mono mt-0.5">Platform Analytics & Settings</span>
          </div>

        </div>
      </div>

    </div>
  );
};
