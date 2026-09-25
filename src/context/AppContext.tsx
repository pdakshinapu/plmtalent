import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
  CandidateProfile, 
  EmployerProfile, 
  Job, 
  Application
} from '../types';
import { 
  INITIAL_EMPLOYERS, 
  INITIAL_CANDIDATE, 
  INITIAL_JOBS, 
  INITIAL_APPLICATIONS
} from '../services/mockData';
import { auth } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  purgeDummyDataFromFirestore,
  subscribeToEmployers,
  subscribeToJobs,
  subscribeToApplications,
  subscribeToCandidate,
  saveEmployerToFirestore,
  saveJobToFirestore,
  saveApplicationToFirestore,
  updateCandidateInFirestore,
} from '../services/firebaseService';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  candidate: CandidateProfile;
  updateCandidate: (data: Partial<CandidateProfile>) => void;
  employers: EmployerProfile[];
  currentEmployerId: string;
  setCurrentEmployerId: (id: string) => void;
  currentEmployer: EmployerProfile | undefined;
  jobs: Job[];
  applications: Application[];
  savedJobIds: string[];
  toggleSaveJob: (jobId: string) => void;
  registerEmployer: (newEmp: Omit<EmployerProfile, 'id' | 'verificationStatus' | 'verificationRequestedAt' | 'logoInitials' | 'logoBg'>) => Promise<string>;
  registerCandidate: (newCand: Omit<CandidateProfile, 'id' | 'avatarInitials' | 'accentColor' | 'verifiedSpecialist'>) => Promise<string>;
  approveEmployer: (employerId: string, notes?: string) => void;
  rejectEmployer: (employerId: string, reason: string) => void;
  postJob: (jobData: Omit<Job, 'id' | 'employerId' | 'employerName' | 'employerLogoInitials' | 'employerLogoBg' | 'isEmployerVerified' | 'postedAt' | 'applicantCount' | 'status'>) => { success: boolean; message: string };
  applyToJob: (jobId: string, coverNote: string, resumeFileName?: string) => { success: boolean; message: string };
  updateApplicationStage: (applicationId: string, newStatus: Application['status'], notes?: string) => void;
  notificationToast: { message: string; type: 'success' | 'info' | 'warning' } | null;
  dismissToast: () => void;
  currentUser: User | null;
  isFirebaseConnected: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Purge obsolete mock storage keys
if (typeof window !== 'undefined') {
  const legacyKeys = [
    'plm_nexus_employers_v2',
    'plm_nexus_curr_emp_id',
    'plm_nexus_candidate_v2',
    'plm_nexus_jobs_v2',
    'plm_nexus_applications_v2',
    'plm_nexus_emails_v2',
    'plm_nexus_saved_jobs_v2',
    'plm_nexus_emails_clean',
  ];
  legacyKeys.forEach(k => localStorage.removeItem(k));
}

const STORAGE_KEYS = {
  ROLE: 'plm_nexus_role_clean',
  EMPLOYERS: 'plm_nexus_employers_clean',
  CURRENT_EMP_ID: 'plm_nexus_curr_emp_id_clean',
  CANDIDATE: 'plm_nexus_candidate_clean',
  JOBS: 'plm_nexus_jobs_clean',
  APPLICATIONS: 'plm_nexus_applications_clean',
  SAVED_JOBS: 'plm_nexus_saved_jobs_clean',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
    return (saved as UserRole) || 'candidate';
  });

  const [employers, setEmployers] = useState<EmployerProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EMPLOYERS);
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYERS;
  });

  const [currentEmployerId, setCurrentEmployerIdState] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_EMP_ID);
    return saved || '';
  });

  const [candidate, setCandidate] = useState<CandidateProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CANDIDATE);
    return saved ? JSON.parse(saved) : INITIAL_CANDIDATE;
  });

  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.JOBS);
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SAVED_JOBS);
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(true);
  const [notificationToast, setNotificationToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  // Initialize Firebase listeners and purge any old dummy data
  useEffect(() => {
    purgeDummyDataFromFirestore().catch(err => {
      console.warn('Purge dummy data:', err);
    });

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    const unsubEmployers = subscribeToEmployers((liveEmployers) => {
      setEmployers(liveEmployers);
      if (liveEmployers.length > 0 && !currentEmployerId) {
        setCurrentEmployerIdState(liveEmployers[0].id);
      }
    });

    const unsubJobs = subscribeToJobs((liveJobs) => {
      setJobs(liveJobs);
    });

    const unsubApplications = subscribeToApplications((liveApps) => {
      setApplications(liveApps);
    });

    const unsubCandidate = subscribeToCandidate(candidate.id || 'cand-01', (liveCandidate) => {
      if (liveCandidate) {
        setCandidate(liveCandidate);
      }
    });

    return () => {
      unsubAuth();
      unsubEmployers();
      unsubJobs();
      unsubApplications();
      unsubCandidate();
    };
  }, []);

  // Sync state to clean LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EMPLOYERS, JSON.stringify(employers));
  }, [employers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_EMP_ID, currentEmployerId);
  }, [currentEmployerId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CANDIDATE, JSON.stringify(candidate));
  }, [candidate]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SAVED_JOBS, JSON.stringify(savedJobIds));
  }, [savedJobIds]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    setNotificationToast({ message, type });
    setTimeout(() => {
      setNotificationToast(prev => prev?.message === message ? null : prev);
    }, 4500);
  };

  const dismissToast = () => setNotificationToast(null);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    showToast(`Switched view to ${newRole === 'candidate' ? 'Job Seeker (Candidate)' : newRole === 'employer' ? 'Job Provider (Employer)' : 'Main Admin (Governance)'}`, 'info');
  };

  const setCurrentEmployerId = (id: string) => {
    setCurrentEmployerIdState(id);
    const emp = employers.find(e => e.id === id);
    if (emp) {
      showToast(`Active enterprise: ${emp.companyName} (${emp.verificationStatus === 'verified' ? 'Verified' : 'Pending Verification'})`, 'info');
    }
  };

  const currentEmployer = employers.find(e => e.id === currentEmployerId) || employers[0] || undefined;

  const updateCandidate = (data: Partial<CandidateProfile>) => {
    const updated = { ...candidate, ...data };
    setCandidate(updated);
    updateCandidateInFirestore(updated);
    showToast('Candidate profile updated and saved to Firebase', 'success');
  };

  const toggleSaveJob = (jobId: string) => {
    setSavedJobIds(prev => {
      const exists = prev.includes(jobId);
      const next = exists ? prev.filter(id => id !== jobId) : [...prev, jobId];
      showToast(exists ? 'Removed from saved PLM jobs' : 'Saved job to your PLM bookmarks', 'info');
      return next;
    });
  };

  // Register Candidate / Job Seeker Profile -> Persists to Firestore
  const registerCandidate = async (newCand: Omit<CandidateProfile, 'id' | 'avatarInitials' | 'accentColor' | 'verifiedSpecialist'>): Promise<string> => {
    const id = `cand-${Date.now().toString().slice(-4)}`;
    const initials = newCand.name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map(w => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'PLM';
    const colors = ['bg-blue-600', 'bg-indigo-600', 'bg-emerald-600', 'bg-slate-800', 'bg-cyan-700', 'bg-teal-700'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const createdCand: CandidateProfile = {
      ...newCand,
      id,
      avatarInitials: initials,
      accentColor: randomColor,
      verifiedSpecialist: true,
      resumeFileName: newCand.resumeFileName || `${newCand.name.replace(/\s+/g, '_')}_PLM_Resume.pdf`,
    };

    setCandidate(createdCand);
    await updateCandidateInFirestore(createdCand);
    showToast(`Welcome, ${createdCand.name}! Your PLM specialist profile is registered & active.`, 'success');
    return id;
  };

  // 1. Employer Registers Company -> Persists to Firestore
  const registerEmployer = async (newEmp: Omit<EmployerProfile, 'id' | 'verificationStatus' | 'verificationRequestedAt' | 'logoInitials' | 'logoBg'>): Promise<string> => {
    const id = `emp-${Date.now().toString().slice(-4)}`;
    const initials = newEmp.companyName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
    const colors = ['bg-slate-900', 'bg-blue-900', 'bg-teal-900', 'bg-indigo-900', 'bg-emerald-900'];
    const randomBg = colors[Math.floor(Math.random() * colors.length)];

    const createdEmp: EmployerProfile = {
      ...newEmp,
      id,
      verificationStatus: 'pending_verification',
      verificationRequestedAt: new Date().toISOString(),
      logoInitials: initials || 'PLM',
      logoBg: randomBg,
      verificationDocName: newEmp.verificationDocName || `${newEmp.companyName.replace(/\s+/g, '_')}_Tax_Proof.pdf`,
    };

    setEmployers(prev => [createdEmp, ...prev]);
    setCurrentEmployerIdState(id);
    saveEmployerToFirestore(createdEmp);

    showToast(`Registered ${createdEmp.companyName}! Submitted for Main Admin verification.`, 'success');
    return id;
  };

  // 2. Main Admin Approves Company -> Unlocks job posting & updates Firestore
  const approveEmployer = (employerId: string, notes?: string) => {
    let approvedEmp: EmployerProfile | undefined;

    setEmployers(prev => prev.map(emp => {
      if (emp.id === employerId) {
        approvedEmp = {
          ...emp,
          verificationStatus: 'verified',
          verifiedAt: new Date().toISOString(),
        };
        saveEmployerToFirestore(approvedEmp);
        return approvedEmp;
      }
      return emp;
    }));

    // Unlock any jobs posted by this employer
    setJobs(prev => prev.map(job => {
      if (job.employerId === employerId) {
        const updatedJob = {
          ...job,
          isEmployerVerified: true,
          status: 'active' as const,
        };
        saveJobToFirestore(updatedJob);
        return updatedJob;
      }
      return job;
    }));

    if (approvedEmp) {
      showToast(`${approvedEmp.companyName} has been verified and synced to Firebase!`, 'success');
    }
  };

  // 3. Main Admin Rejects / Requests Revision
  const rejectEmployer = (employerId: string, reason: string) => {
    const emp = employers.find(e => e.id === employerId);
    if (!emp) return;

    setEmployers(prev => prev.map(e => {
      if (e.id === employerId) {
        const rejected = {
          ...e,
          verificationStatus: 'rejected' as const,
          rejectionReason: reason,
        };
        saveEmployerToFirestore(rejected);
        return rejected;
      }
      return e;
    }));

    showToast(`Verification rejected for ${emp.companyName}. Synced to Firebase.`, 'warning');
  };

  // 4. Post Job - Checks if employer is verified!
  const postJob = (jobData: Omit<Job, 'id' | 'employerId' | 'employerName' | 'employerLogoInitials' | 'employerLogoBg' | 'isEmployerVerified' | 'postedAt' | 'applicantCount' | 'status'>): { success: boolean; message: string } => {
    if (!currentEmployer) {
      return { success: false, message: 'No active employer registered. Please register your company first.' };
    }

    const isVerified = currentEmployer.verificationStatus === 'verified';
    const newJob: Job = {
      ...jobData,
      id: `job-${Date.now()}`,
      employerId: currentEmployer.id,
      employerName: currentEmployer.companyName,
      employerLogoInitials: currentEmployer.logoInitials,
      employerLogoBg: currentEmployer.logoBg,
      isEmployerVerified: isVerified,
      postedAt: new Date().toISOString(),
      applicantCount: 0,
      status: isVerified ? 'active' : 'pending_verification',
    };

    setJobs(prev => [newJob, ...prev]);
    saveJobToFirestore(newJob);

    if (!isVerified) {
      showToast('Job saved in draft in Firebase! Your company must be verified by the Admin before public publishing.', 'warning');
      return { 
        success: true, 
        message: 'Job created in pending state in Firebase. It will automatically publish once the Main Admin approves your company verification.' 
      };
    }

    showToast(`Published: "${newJob.title}" to Firebase!`, 'success');
    return { success: true, message: 'Job successfully posted and live across PLM Nexus.' };
  };

  // 5. Apply to Job
  const applyToJob = (jobId: string, coverNote: string, resumeFileName?: string): { success: boolean; message: string } => {
    const targetJob = jobs.find(j => j.id === jobId);
    if (!targetJob) return { success: false, message: 'Job not found' };

    const alreadyApplied = applications.some(a => a.jobId === jobId && a.candidateId === candidate.id);
    if (alreadyApplied) {
      return { success: false, message: 'You have already applied to this position.' };
    }

    // Calculate match score
    let score = 70;
    if (candidate.primaryPLM === targetJob.primaryPLM) score += 15;
    else if ((targetJob.relatedSystems || []).includes(candidate.primaryPLM) || (candidate.secondaryPLMs || []).includes(targetJob.primaryPLM)) score += 8;

    const candidateModules = candidate.modules || [];
    const jobModules = targetJob.requiredModules || [];
    const matchingModules = jobModules.filter(m => candidateModules.includes(m));
    score += Math.min(10, matchingModules.length * 3);

    if (targetJob.itarRequired && candidate.clearance && candidate.clearance !== 'None') score += 5;

    const newApp: Application = {
      id: `app-${Date.now()}`,
      jobId,
      jobTitle: targetJob.title,
      employerId: targetJob.employerId,
      employerName: targetJob.employerName,
      candidateId: candidate.id,
      candidateName: candidate.name || 'Candidate',
      candidateEmail: candidate.email || 'candidate@plmnexus.internal',
      candidateHeadline: candidate.headline || 'PLM Specialist',
      candidatePrimaryPLM: candidate.primaryPLM,
      candidateExperience: candidate.yearsOfExperience || 0,
      matchScore: Math.min(99, score),
      appliedDate: new Date().toISOString(),
      coverNote,
      resumeFileName: resumeFileName || 'Candidate_Resume.pdf',
      status: 'applied',
    };

    setApplications(prev => [newApp, ...prev]);
    saveApplicationToFirestore(newApp);

    // Update job applicant count
    const updatedJob = { ...targetJob, applicantCount: (targetJob.applicantCount || 0) + 1 };
    setJobs(prev => prev.map(j => j.id === jobId ? updatedJob : j));
    saveJobToFirestore(updatedJob);

    showToast(`Application saved to Firebase with ${Math.min(99, score)}% match score!`, 'success');
    return { success: true, message: 'Application submitted successfully!' };
  };

  // 6. Update ATS Pipeline Stage
  const updateApplicationStage = (applicationId: string, newStatus: Application['status'], notes?: string) => {
    let targetApp: Application | undefined;

    setApplications(prev => prev.map(app => {
      if (app.id === applicationId) {
        targetApp = {
          ...app,
          status: newStatus,
          internalNotes: notes !== undefined ? notes : app.internalNotes,
        };
        saveApplicationToFirestore(targetApp);
        return targetApp;
      }
      return app;
    }));

    if (targetApp) {
      const stageLabels: Record<Application['status'], string> = {
        applied: 'Received',
        screening: 'Initial Screening',
        technical_interview: 'Technical Architecture Deep Dive',
        offer_extended: 'Formal Employment Offer',
        archived: 'Archived',
      };

      showToast(`Candidate moved to stage: ${stageLabels[newStatus]} (Synced to Firebase)`, 'success');
    }
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        candidate,
        updateCandidate,
        employers,
        currentEmployerId,
        setCurrentEmployerId,
        currentEmployer,
        jobs,
        applications,
        savedJobIds,
        toggleSaveJob,
        registerEmployer,
        registerCandidate,
        approveEmployer,
        rejectEmployer,
        postJob,
        applyToJob,
        updateApplicationStage,
        notificationToast,
        dismissToast,
        currentUser,
        isFirebaseConnected,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
