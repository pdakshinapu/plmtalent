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
import { AuthPage } from './components/AuthPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  Clock, 
  Info, 
  X
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
          <div className="bg-slate-900 text-white rounded-xl px-4 py-3 shadow-2xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              {notificationToast.type === 'success' && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              {notificationToast.type === 'warning' && (
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              )}
              {notificationToast.type === 'info' && (
                <Info className="w-4 h-4 text-blue-400 shrink-0" />
              )}
              <span className="leading-snug">{notificationToast.message}</span>
            </div>
            <button
              onClick={dismissToast}
              className="text-slate-400 hover:text-white p-1 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Production Grade Clean Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/plmspider-logo.png" alt="PLMSpider" className="h-6 w-auto object-contain" />
            <span className="font-bold text-slate-900 text-sm">PLMSpider</span>
            <span>·</span>
            <span>Dedicated Talent Platform for Teamcenter, Windchill, 3DEXPERIENCE & Aras</span>
          </div>

          <div className="flex items-center gap-6 font-medium text-slate-400">
            <span>Connecting Professionals · Enterprise Verification & Governance</span>
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
