/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { CandidateView } from './components/CandidateView';
import { EmployerView } from './components/EmployerView';
import { AdminView } from './components/AdminView';
import { RegisterEmployerModal } from './components/RegisterEmployerModal';
import { RegisterCandidateModal } from './components/RegisterCandidateModal';
import { LandingPage } from './components/LandingPage';
import { AboutUsPage } from './components/AboutUsPage';
import { FAQPage } from './components/FAQPage';
import { ContactPage } from './components/ContactPage';
import { ServicesPage } from './components/ServicesPage';
import { ServiceDetailPage } from './components/ServiceDetailPage';
import { AuthPage } from './components/AuthPage';
import { SERVICE_DETAILS } from './data/serviceDetailsData';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowRight,
  CheckCircle2, 
  Clock, 
  Info, 
  X,
  Mail,
  ShieldCheck,
  Cpu,
  Globe,
  Sparkles
} from 'lucide-react';

function AppContent() {
  const { 
    notificationToast, 
    dismissToast,
    userSession,
    setRole
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isRegisterEmployerModalOpen, setIsRegisterEmployerModalOpen] = useState(false);
  const [isRegisterCandidateModalOpen, setIsRegisterCandidateModalOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const routeTab = (pathname: string) => {
    const segments = pathname.split('/').filter(Boolean);
    const portal = segments[0];
    const tab = segments[1];
    if (portal === 'job-seeker') return tab || 'explore';
    if (portal === 'job-provider') {
      const tabs: Record<string, string> = { overview: 'dashboard', candidates: 'search-candidates', connections: 'connections', jobs: 'published-jobs', 'post-job': 'post-job', pipeline: 'pipeline', 'company-profile': 'company-profile' };
      return tabs[tab] || tab || 'dashboard';
    }
    if (portal === 'admin') {
      const tabs: Record<string, string> = { 'verification-queue': 'verification-queue', employers: 'employers-list', analytics: 'ecosystem-stats', settings: 'platform-settings' };
      return tabs[tab] || tab || 'verification-queue';
    }
    return null;
  };

  const portalPath = (portalRole: string, tab: string) => {
    const paths: Record<string, Record<string, string>> = {
      candidate: {
        explore: 'explore', connections: 'connections', invitations: 'invitations',
        invites: 'invitations', matches: 'invitations', applications: 'applications',
        profile: 'profile', directory: 'directory',
      },
      employer: {
        dashboard: 'overview', 'search-candidates': 'candidates', connections: 'connections',
        matches: 'connections', 'published-jobs': 'jobs', 'post-job': 'post-job',
        pipeline: 'pipeline', 'company-profile': 'company-profile',
      },
      admin: {
        'verification-queue': 'verification-queue', 'employers-list': 'employers',
        'ecosystem-stats': 'analytics', 'platform-settings': 'settings',
      },
    };
    const root = portalRole === 'candidate' ? '/job-seeker' : portalRole === 'employer' ? '/job-provider' : '/admin';
    return `${root}/${paths[portalRole]?.[tab] || tab}`;
  };

  // Keep the selected workspace view in sync with the URL, including back/forward navigation.
  useEffect(() => {
    const tab = routeTab(location.pathname);
    if (tab) setActiveTab(tab);
  }, [location.pathname]);

  // All workspace navigation updates the URL so views can be linked and restored.
  const handleRoleTabSync = (newTab: string) => {
    setActiveTab(newTab);
    const pathRole = location.pathname.startsWith('/job-provider') ? 'employer'
      : location.pathname.startsWith('/admin') ? 'admin'
      : location.pathname.startsWith('/job-seeker') ? 'candidate'
      : userSession?.role;
    if (pathRole) navigate(portalPath(pathRole, newTab));
  };

  const handleRoleSwitch = (newRole: string, defaultTab: string) => {
    setRole(newRole as 'candidate' | 'employer' | 'admin');
    setActiveTab(defaultTab);
    navigate(portalPath(newRole, defaultTab));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-slate-900 selection:text-white">
      
      {/* Main Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleRoleTabSync}
        onOpenRegisterEmployerModal={() => setIsRegisterEmployerModalOpen(true)}
        onOpenRegisterCandidateModal={() => setIsRegisterCandidateModalOpen(true)}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 pb-16">
        <Routes>
          {/* Base URL: Landing Page */}
          <Route 
            path="/" 
            element={
              <LandingPage 
                onOpenRegisterCandidateModal={() => setIsRegisterCandidateModalOpen(true)}
                onOpenRegisterEmployerModal={() => setIsRegisterEmployerModalOpen(true)}
              />
            } 
          />

          {/* Dedicated About Us Page */}
          <Route 
            path="/about" 
            element={
              <AboutUsPage 
                onOpenRegisterCandidateModal={() => setIsRegisterCandidateModalOpen(true)}
                onOpenRegisterEmployerModal={() => setIsRegisterEmployerModalOpen(true)}
              />
            } 
          />
          <Route path="/about-us" element={<Navigate to="/about" replace />} />

          {/* Authentication & Role-based Login */}
          <Route 
            path="/login" 
            element={
              <AuthPage 
                onOpenRegisterCandidateModal={() => setIsRegisterCandidateModalOpen(true)}
                onOpenRegisterEmployerModal={() => setIsRegisterEmployerModalOpen(true)}
              />
            } 
          />

          {/* Dedicated Services Overview Page */}
          <Route 
            path="/services" 
            element={
              <ServicesPage 
                onOpenRegisterCandidateModal={() => setIsRegisterCandidateModalOpen(true)}
                onOpenRegisterEmployerModal={() => setIsRegisterEmployerModalOpen(true)}
              />
            } 
          />

          {/* Dedicated Individual Service Details Page */}
          <Route 
            path="/services/:slug" 
            element={
              <ServiceDetailPage
                onOpenRegisterCandidateModal={() => setIsRegisterCandidateModalOpen(true)}
                onOpenRegisterEmployerModal={() => setIsRegisterEmployerModalOpen(true)}
              />
            } 
          />

          {/* Dedicated FAQ Page */}
          <Route 
            path="/faq" 
            element={
              <FAQPage 
                onOpenRegisterCandidateModal={() => setIsRegisterCandidateModalOpen(true)}
                onOpenRegisterEmployerModal={() => setIsRegisterEmployerModalOpen(true)}
              />
            } 
          />

          {/* Dedicated Contact Us Page */}
          <Route 
            path="/contact" 
            element={
              <ContactPage 
                onOpenRegisterCandidateModal={() => setIsRegisterCandidateModalOpen(true)}
                onOpenRegisterEmployerModal={() => setIsRegisterEmployerModalOpen(true)}
              />
            } 
          />
          <Route path="/contact-us" element={<Navigate to="/contact" replace />} />

          {/* Job Seeker Portal with Role Guard */}
          <Route path="/job-seeker/*" element={
            <ProtectedRoute requiredRole="candidate">
              <CandidateView
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onOpenRegisterCandidateModal={() => setIsRegisterCandidateModalOpen(true)}
                onOpenRegisterEmployerModal={() => setIsRegisterEmployerModalOpen(true)}
              />
            </ProtectedRoute>
          } />

          {/* Job Provider (Enterprise) Portal with Role Guard */}
          <Route path="/job-provider/*" element={
            <ProtectedRoute requiredRole="employer">
              <EmployerView
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onOpenRegisterModal={() => setIsRegisterEmployerModalOpen(true)}
                onOpenRegisterCandidateModal={() => setIsRegisterCandidateModalOpen(true)}
              />
            </ProtectedRoute>
          } />

          {/* Platform Administrator Governance Portal with Role Guard */}
          <Route path="/admin/*" element={
            <ProtectedRoute requiredRole="admin">
              <AdminView
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onOpenRegisterModal={() => setIsRegisterEmployerModalOpen(true)}
              />
            </ProtectedRoute>
          } />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Enterprise / Job Provider Registration Modal */}
      <RegisterEmployerModal
        isOpen={isRegisterEmployerModalOpen}
        onClose={() => setIsRegisterEmployerModalOpen(false)}
        onSuccessSwitchToAdmin={() => {
          handleRoleSwitch('admin', 'verification-queue');
        }}
      />

      {/* Candidate / Job Seeker Registration Modal */}
      <RegisterCandidateModal
        isOpen={isRegisterCandidateModalOpen}
        onClose={() => setIsRegisterCandidateModalOpen(false)}
        onSuccess={() => {
          handleRoleSwitch('candidate', 'explore');
        }}
      />

      {/* Floating Notification Toast */}
      {notificationToast && (
        <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-3 duration-200 max-w-md">
          <div className="bg-white text-slate-900 rounded-xl px-4 py-3 shadow-2xl border border-slate-200 flex items-center justify-between gap-3 text-xs ring-1 ring-black/5">
            <div className="flex items-center gap-2.5">
              {notificationToast.type === 'success' && (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              )}
              {notificationToast.type === 'warning' && (
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              )}
              {notificationToast.type === 'info' && (
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
              )}
              <span className="leading-snug font-medium">{notificationToast.message}</span>
            </div>
            <button
              onClick={dismissToast}
              className="text-slate-400 hover:text-slate-700 p-1 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* NEXT-LEVEL FOOTER - CLEAN LIGHT THEME */}
      <footer className="border-t border-slate-200 bg-white text-slate-600">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
            
            {/* Col 1 & 2: Brand Identity */}
            <div className="lg:col-span-2 space-y-5">
              <div className="flex items-center gap-3">
                <a href="/#home" className="inline-flex rounded-xl bg-slate-50 border border-slate-200 p-2.5 shadow-2xs hover:scale-102 transition-transform" aria-label="PLMSpider home">
                  <img src="/plmspider-logo.png" alt="PLMSpider - Connecting PLM Professionals" className="h-10 w-auto object-contain" />
                </a>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Ecosystem Live
                </span>
              </div>
              <p className="text-sm leading-relaxed text-slate-600 max-w-md">
                PLMSpider is the dedicated talent network for product lifecycle management specialists, engineering enterprises, systems integrators, and independent PLM contractors worldwide.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a 
                  href="/contact" 
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#BA3A2C] hover:bg-[#9E2F23] text-white text-xs font-bold transition-all shadow-md shadow-red-900/10 hover:gap-2.5 cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>Talk to PLMSpider</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => setIsRegisterEmployerModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-semibold transition-all shadow-2xs cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified Employer Access</span>
                </button>
              </div>
            </div>

            {/* Col 3: Quick Navigation */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-[.18em] text-slate-900 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#BA3A2C]" />
                Navigation
              </h3>
              <ul className="space-y-2.5 text-sm text-slate-600">
                <li>
                  <a href="/#home" className="hover:text-[#BA3A2C] transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-slate-400" />
                    Home
                  </a>
                </li>
                <li>
                  <a href="/about" className="hover:text-[#BA3A2C] transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-slate-400" />
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/services" className="hover:text-[#BA3A2C] transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-slate-400" />
                    Services & Pathways
                  </a>
                </li>
                <li>
                  <a href="/faq" className="hover:text-[#BA3A2C] transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-slate-400" />
                    Frequently Asked Questions
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-[#BA3A2C] transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-slate-400" />
                    Contact Us Form
                  </a>
                </li>
                <li>
                  <a href="/login" className="hover:text-[#BA3A2C] transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-slate-400" />
                    Sign In to Portal
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: PLM Pathways */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-[.18em] text-slate-900 flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-blue-600" />
                Services & Details
              </h3>
              <ul className="space-y-2.5 text-sm text-slate-600">
                {Object.values(SERVICE_DETAILS).slice(0, 6).map((service) => (
                  <li key={service.slug}>
                    <a href={`/services/${service.slug}`} className="hover:text-[#BA3A2C] transition-colors flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-slate-400" />
                      {service.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 5: PLM Platforms */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-[.18em] text-slate-900 flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                Supported Stacks
              </h3>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 shadow-2xs">
                  Siemens Teamcenter
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 shadow-2xs">
                  PTC Windchill
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 shadow-2xs">
                  Dassault 3DX
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 shadow-2xs">
                  Active Workspace
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 shadow-2xs">
                  Aras Innovator
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 shadow-2xs">
                  SAP & Arena PLM
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500 pt-1">
                Zero recruiter fees · Direct verified talent connections.
              </p>
            </div>

          </div>
        </div>

        {/* Sub-Footer Copyright & Badges */}
        <div className="border-t border-slate-200 bg-slate-50">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">&copy; {new Date().getFullYear()} PLMSpider.</span>
              <span>All rights reserved. Dedicated to the global PLM engineering community.</span>
            </div>
            <div className="flex items-center gap-4 text-slate-600">
              <a href="/about" className="hover:text-slate-900 transition-colors">About Us</a>
              <span className="text-slate-300">•</span>
              <a href="/services" className="hover:text-slate-900 transition-colors">Services</a>
              <span className="text-slate-300">•</span>
              <a href="/faq" className="hover:text-slate-900 transition-colors">FAQ</a>
              <span className="text-slate-300">•</span>
              <a href="/contact" className="hover:text-slate-900 transition-colors">Contact Us</a>
              <span className="text-slate-300">•</span>
              <a href="/login" className="hover:text-slate-900 transition-colors">Login</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
