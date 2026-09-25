/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { CandidateView } from './components/CandidateView';
import { RegisterCandidateModal } from './components/RegisterCandidateModal';
import { RegisterEmployerModal } from './components/RegisterEmployerModal';
import { 
  CheckCircle2, 
  Clock, 
  Info, 
  X
} from 'lucide-react';

function AppContent() {
  const { 
    role, 
    setRole, 
    notificationToast, 
    dismissToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>('explore');
  const [isRegisterCandidateModalOpen, setIsRegisterCandidateModalOpen] = useState(false);
  const [isRegisterEmployerModalOpen, setIsRegisterEmployerModalOpen] = useState(false);

  // Enforce role
  useEffect(() => {
    if (role !== 'candidate') {
      setRole('candidate');
    }
  }, [role, setRole]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-slate-900 selection:text-white">
      
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenRegisterCandidateModal={() => setIsRegisterCandidateModalOpen(true)}
        onOpenRegisterEmployerModal={() => setIsRegisterEmployerModalOpen(true)}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 pb-16">
        <CandidateView
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </main>

      {/* Candidate Registration Modal */}
      <RegisterCandidateModal
        isOpen={isRegisterCandidateModalOpen}
        onClose={() => setIsRegisterCandidateModalOpen(false)}
        onSuccess={() => {
          setActiveTab('explore');
        }}
      />

      {/* Employer Registration Modal */}
      <RegisterEmployerModal
        isOpen={isRegisterEmployerModalOpen}
        onClose={() => setIsRegisterEmployerModalOpen(false)}
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

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-900 text-sm">PLM Nexus Job Seeker Portal</span>
            <span>·</span>
            <span>Dedicated Talent Platform for Teamcenter, Windchill, 3DEXPERIENCE & Aras</span>
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
