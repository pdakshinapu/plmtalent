/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { EmployerView } from './components/EmployerView';
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

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Enforce role
  useEffect(() => {
    if (role !== 'employer') {
      setRole('employer');
    }
  }, [role, setRole]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-slate-900 selection:text-white">
      
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 pb-16">
        <EmployerView
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
        />
      </main>

      {/* Enterprise Registration Modal */}
      <RegisterEmployerModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSuccessSwitchToAdmin={() => {
          // In standalone app, we just close the modal.
          setIsRegisterModalOpen(false);
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

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-900 text-sm">PLM Nexus Job Provider Portal</span>
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
