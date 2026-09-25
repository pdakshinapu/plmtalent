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
import { EmailDrawer } from './components/EmailDrawer';
import { RegisterEmployerModal } from './components/RegisterEmployerModal';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Info,
  X,
  Layers,
  Cpu
} from 'lucide-react';

function AppContent() {
  const { 
    role, 
    setRole, 
    notificationToast, 
    dismissToast, 
    setIsEmailDrawerOpen,
    unreadEmailCount,
    employers
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>('explore');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Sync role with current route
  useEffect(() => {
    if (location.pathname.startsWith('/job-seeker') && role !== 'candidate') {
      setRole('candidate');
      if (activeTab === 'dashboard' || activeTab === 'verification-queue') setActiveTab('explore');
    } else if (location.pathname.startsWith('/job-provider') && role !== 'employer') {
      setRole('employer');
      if (activeTab === 'explore' || activeTab === 'verification-queue') setActiveTab('dashboard');
    } else if (location.pathname.startsWith('/admin') && role !== 'admin') {
      setRole('admin');
      if (activeTab === 'explore' || activeTab === 'dashboard') setActiveTab('verification-queue');
    }
  }, [location.pathname, role, setRole, activeTab]);

  // Sync tab defaults when role changes and update route
  const handleRoleTabSync = (newTab: string) => {
    setActiveTab(newTab);
  };

  const handleRoleSwitch = (newRole: string, defaultTab: string) => {
    setRole(newRole);
    setActiveTab(defaultTab);
    if (newRole === 'candidate') navigate('/job-seeker');
    if (newRole === 'employer') navigate('/job-provider');
    if (newRole === 'admin') navigate('/admin');
  };

  const pendingVerificationCount = employers.filter(
    e => e.verificationStatus === 'pending_verification'
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-slate-900 selection:text-white">
      
      {/* Main 3-Zone Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleRoleTabSync}
        onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
      />

      {/* Main Content Workspace by Role */}
      <main className="flex-1 pb-16">
        <Routes>
          <Route path="/" element={<Navigate to="/job-seeker" replace />} />
          <Route path="/job-seeker/*" element={
            <CandidateView
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          } />
          <Route path="/job-provider/*" element={
            <EmployerView
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
            />
          } />
          <Route path="/admin/*" element={
            <AdminView
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
            />
          } />
        </Routes>
      </main>

      {/* Enterprise Registration Modal */}
      <RegisterEmployerModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSuccessSwitchToAdmin={() => {
          handleRoleSwitch('admin', 'verification-queue');
        }}
      />

      {/* Transactional Email Dispatch Simulator Drawer */}
      <EmailDrawer
        onNavigateToAdminVerification={() => {
          handleRoleSwitch('admin', 'verification-queue');
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

      {/* Production Grade Clean Footer (No Ornamental Clutter) */}
      <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-900 text-sm">PLM Nexus</span>
            <span>·</span>
            <span>Dedicated Talent Platform for Teamcenter, Windchill, 3DEXPERIENCE & Aras</span>
          </div>

          <div className="flex items-center gap-6 font-medium">
            <button
              onClick={() => setIsEmailDrawerOpen(true)}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Audit Mail Dispatch
            </button>
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
