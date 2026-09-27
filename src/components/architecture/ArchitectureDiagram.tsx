import React, { useState } from 'react';
import { CLIENT_ROLES, BACKEND_SERVICES } from '../../data/architectureData';
import { 
  User, 
  Building2, 
  ShieldCheck, 
  Globe, 
  Server, 
  Database, 
  HardDrive, 
  Mail, 
  Key, 
  Users, 
  Briefcase, 
  MessageSquare, 
  Bell, 
  FileText, 
  CheckCircle2, 
  ArrowRight,
  Lock,
  Smartphone,
  Monitor
} from 'lucide-react';

export const ArchitectureDiagram: React.FC = () => {
  const [activeElement, setActiveElement] = useState<string | null>(null);

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Key': return <Key className="w-4 h-4 text-blue-400" />;
      case 'Users': return <Users className="w-4 h-4 text-sky-400" />;
      case 'Briefcase': return <Briefcase className="w-4 h-4 text-emerald-400" />;
      case 'MessageSquare': return <MessageSquare className="w-4 h-4 text-purple-400" />;
      case 'Bell': return <Bell className="w-4 h-4 text-pink-400" />;
      case 'FileText': return <FileText className="w-4 h-4 text-amber-400" />;
      default: return <Server className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="relative rounded-3xl border border-slate-800/90 bg-[#0B1222] p-6 sm:p-10 backdrop-blur-2xl shadow-2xl overflow-hidden">
      {/* Background blueprint grid */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(59, 130, 246, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(59, 130, 246, 0.15) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Top Header Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-800/80">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            ENTERPRISE SYSTEM ARCHITECTURE
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            End-to-End High Level Data & Service Topology
          </h3>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-emerald-400">
            <Lock className="w-3 h-3" />
            <span>SSL / TLS 1.3</span>
          </span>
          <span className="hidden md:inline px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-cyan-400">
            REST + JWT RBAC
          </span>
        </div>
      </div>

      {/* Main Architecture Grid: 4 Vertical Columns */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* COLUMN 1: CLIENTS (USER INTERFACES) - 3 Columns */}
        <div className="md:col-span-3 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>Clients (User Interfaces)</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">Tier 1</span>
          </div>

          {/* Professional Client Card (Blue) */}
          <div 
            onMouseEnter={() => setActiveElement('professional')}
            onMouseLeave={() => setActiveElement(null)}
            className={`group rounded-2xl border p-4 transition-all duration-300 cursor-pointer ${
              activeElement === 'professional' || !activeElement
                ? 'bg-blue-950/40 border-blue-500/50 shadow-lg shadow-blue-950/50'
                : 'bg-slate-900/40 border-slate-800 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">
                    Professional / Candidate
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-blue-300/80 font-mono mt-0.5">
                    <span className="flex items-center gap-1"><Monitor className="w-3 h-3" /> Web</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Smartphone className="w-3 h-3" /> Mobile</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-2.5 text-[11px] text-slate-300 leading-snug">
              Profile, resume upload, PLM/CAD skills, job search & apply.
            </p>
          </div>

          {/* Employer Client Card (Green) */}
          <div 
            onMouseEnter={() => setActiveElement('employer')}
            onMouseLeave={() => setActiveElement(null)}
            className={`group rounded-2xl border p-4 transition-all duration-300 cursor-pointer ${
              activeElement === 'employer' || !activeElement
                ? 'bg-emerald-950/40 border-emerald-500/50 shadow-lg shadow-emerald-950/50'
                : 'bg-slate-900/40 border-slate-800 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">
                    Employer / Company
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-emerald-300/80 font-mono mt-0.5">
                    <span className="flex items-center gap-1"><Monitor className="w-3 h-3" /> Web</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Smartphone className="w-3 h-3" /> Mobile</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-2.5 text-[11px] text-slate-300 leading-snug">
              Company profile, post jobs, search candidates, manage applicants.
            </p>
          </div>

          {/* Admin Client Card (Yellow/Gold) */}
          <div 
            onMouseEnter={() => setActiveElement('admin')}
            onMouseLeave={() => setActiveElement(null)}
            className={`group rounded-2xl border p-4 transition-all duration-300 cursor-pointer ${
              activeElement === 'admin' || !activeElement
                ? 'bg-amber-950/40 border-amber-500/50 shadow-lg shadow-amber-950/50'
                : 'bg-slate-900/40 border-slate-800 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">
                    Admin
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-amber-300/80 font-mono mt-0.5">
                    <span className="flex items-center gap-1"><Monitor className="w-3 h-3" /> Web</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Smartphone className="w-3 h-3" /> Mobile</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-2.5 text-[11px] text-slate-300 leading-snug">
              Employer approvals, user management, job moderation, reports.
            </p>
          </div>
        </div>

        {/* COLUMN 2: GATEWAY & LOAD BALANCER - 2 Columns */}
        <div className="md:col-span-2 flex flex-col justify-center items-center space-y-6">
          
          {/* Internet / HTTPS Cloud Node */}
          <div className="w-full flex flex-col items-center justify-center p-4 rounded-2xl border border-cyan-500/40 bg-cyan-950/30 text-center shadow-lg shadow-cyan-950/30">
            <Globe className="w-8 h-8 text-cyan-400 mb-1.5 animate-pulse" />
            <div className="text-xs font-bold text-white">Internet</div>
            <div className="inline-flex items-center gap-1 text-[10px] font-mono text-cyan-300 font-semibold mt-1">
              <Lock className="w-2.5 h-2.5" />
              <span>HTTPS (SSL)</span>
            </div>
          </div>

          {/* Animated Connecting Flow Arrow */}
          <div className="flex flex-col items-center justify-center text-slate-600 py-1">
            <span className="w-0.5 h-6 bg-gradient-to-b from-cyan-400 to-emerald-400" />
            <span className="text-[10px] font-mono text-cyan-400">443 / TLS</span>
          </div>

          {/* Web Server / Load Balancer (Nginx / Apache) */}
          <div className="w-full flex flex-col items-center justify-center p-5 rounded-2xl border border-emerald-500/50 bg-[#062016]/80 text-center shadow-lg shadow-emerald-950/40 group hover:border-emerald-400 transition-colors">
            {/* Nginx Logo representation */}
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-lg border border-emerald-500/40 mb-2">
              N
            </div>
            <div className="text-xs font-bold text-white">Web Server / Load Balancer</div>
            <div className="text-[10px] font-mono text-emerald-300/90 mt-1">
              (Nginx / Apache)
            </div>
            <div className="mt-2 text-[9px] text-slate-400 font-mono">
              Reverse Proxy • Rate Limiting
            </div>
          </div>

        </div>

        {/* COLUMN 3: APPLICATION LAYER (BACKEND APIs) - 4 Columns */}
        <div className="md:col-span-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Server className="w-3.5 h-3.5 text-cyan-400" />
              <span>Application Layer (Backend APIs)</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">Tier 2</span>
          </div>

          {/* 6 Backend Services */}
          {BACKEND_SERVICES.map((srv) => (
            <div
              key={srv.id}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-800/90 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div 
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border"
                  style={{ 
                    backgroundColor: `${srv.accentColor}15`,
                    borderColor: `${srv.accentColor}40`
                  }}
                >
                  {getServiceIcon(srv.iconName)}
                </div>
                <div className="min-w-0">
                  <h5 className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                    {srv.name}
                  </h5>
                  <div className="text-[10px] text-slate-400 font-mono truncate">
                    {srv.endpoint}
                  </div>
                </div>
              </div>

              <span 
                className="text-[9px] font-mono font-bold px-2 py-0.5 rounded border shrink-0"
                style={{
                  color: srv.accentColor,
                  borderColor: `${srv.accentColor}40`,
                  backgroundColor: `${srv.accentColor}10`
                }}
              >
                {srv.category}
              </span>
            </div>
          ))}
        </div>

        {/* COLUMN 4: DATABASE & STORAGE & NOTIFICATION - 3 Columns */}
        <div className="md:col-span-3 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-blue-400" />
              <span>Database Layer</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">Tier 3</span>
          </div>

          {/* Database (MySQL / PostgreSQL) */}
          <div className="rounded-2xl border border-blue-500/40 bg-blue-950/30 p-4 shadow-lg shadow-blue-950/40">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Database</h4>
                <div className="text-[11px] font-mono text-blue-300">
                  (MySQL / PostgreSQL)
                </div>
              </div>
            </div>
            <p className="mt-2.5 text-[11px] text-slate-300 leading-snug">
              ACID relational tables: Users, Jobs, Companies, Applications, Skills.
            </p>
          </div>

          {/* File Storage (Resume, Images etc.) */}
          <div className="rounded-2xl border border-amber-500/40 bg-amber-950/30 p-4 shadow-lg shadow-amber-950/40">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30">
                <HardDrive className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">File Storage</h4>
                <div className="text-[10px] font-mono text-amber-300/90 leading-tight">
                  (Resume, Images etc.)
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  (AWS S3 / Cloud Storage)
                </div>
              </div>
            </div>
            <p className="mt-2.5 text-[11px] text-slate-300 leading-snug">
              Secure object storage for resumes, company logos & verification docs.
            </p>
          </div>

          {/* Email / Notification Service */}
          <div className="rounded-2xl border border-pink-500/40 bg-pink-950/30 p-4 shadow-lg shadow-pink-950/40">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-600/20 text-pink-400 border border-pink-500/30">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Email / Notification Service</h4>
                <div className="text-[11px] font-mono text-pink-300">
                  (SendGrid / AWS SES)
                </div>
              </div>
            </div>
            <p className="mt-2.5 text-[11px] text-slate-300 leading-snug">
              Transactional mailers for approvals, application updates, and alerts.
            </p>
          </div>

        </div>

      </div>

      {/* Bottom Protocol Telemetry Ribbon */}
      <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>High-Availability Microservice Architecture</span>
          </span>
          <span className="hidden sm:inline text-slate-600">•</span>
          <span className="hidden sm:inline text-slate-400">Stateless REST + WebSocket Ready</span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span>Deployment: AWS / Azure / DigitalOcean</span>
        </div>
      </div>
    </div>
  );
};
