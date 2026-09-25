import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
  CandidateProfile, 
  EmployerProfile, 
  Job, 
  Application, 
  SimulatedEmail,
  PLMSystem,
  PLMModule,
  ClearanceLevel
} from '../types';
import { 
  INITIAL_EMPLOYERS, 
  INITIAL_CANDIDATE, 
  INITIAL_JOBS, 
  INITIAL_APPLICATIONS, 
  INITIAL_SIMULATED_EMAILS 
} from '../services/mockData';

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
  simulatedEmails: SimulatedEmail[];
  unreadEmailCount: number;
  savedJobIds: string[];
  toggleSaveJob: (jobId: string) => void;
  registerEmployer: (newEmp: Omit<EmployerProfile, 'id' | 'verificationStatus' | 'verificationRequestedAt' | 'logoInitials' | 'logoBg'>) => Promise<string>;
  approveEmployer: (employerId: string, notes?: string) => void;
  rejectEmployer: (employerId: string, reason: string) => void;
  postJob: (jobData: Omit<Job, 'id' | 'employerId' | 'employerName' | 'employerLogoInitials' | 'employerLogoBg' | 'isEmployerVerified' | 'postedAt' | 'applicantCount' | 'status'>) => { success: boolean; message: string };
  applyToJob: (jobId: string, coverNote: string, resumeFileName?: string) => { success: boolean; message: string };
  updateApplicationStage: (applicationId: string, newStatus: Application['status'], notes?: string) => void;
  markEmailAsRead: (emailId: string) => void;
  markAllEmailsAsRead: () => void;
  isEmailDrawerOpen: boolean;
  setIsEmailDrawerOpen: (open: boolean) => void;
  notificationToast: { message: string; type: 'success' | 'info' | 'warning' } | null;
  dismissToast: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ROLE: 'plm_nexus_role',
  EMPLOYERS: 'plm_nexus_employers_v2',
  CURRENT_EMP_ID: 'plm_nexus_curr_emp_id',
  CANDIDATE: 'plm_nexus_candidate_v2',
  JOBS: 'plm_nexus_jobs_v2',
  APPLICATIONS: 'plm_nexus_applications_v2',
  EMAILS: 'plm_nexus_emails_v2',
  SAVED_JOBS: 'plm_nexus_saved_jobs_v2',
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
    return saved || 'emp-01';
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

  const [simulatedEmails, setSimulatedEmails] = useState<SimulatedEmail[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EMAILS);
    return saved ? JSON.parse(saved) : INITIAL_SIMULATED_EMAILS;
  });

  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SAVED_JOBS);
    return saved ? JSON.parse(saved) : ['job-01'];
  });

  const [isEmailDrawerOpen, setIsEmailDrawerOpen] = useState(false);
  const [notificationToast, setNotificationToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  // Sync state to LocalStorage
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
    localStorage.setItem(STORAGE_KEYS.EMAILS, JSON.stringify(simulatedEmails));
  }, [simulatedEmails]);

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
      showToast(`Switched active enterprise to: ${emp.companyName} (${emp.verificationStatus === 'verified' ? 'Verified' : 'Pending Verification'})`, 'info');
    }
  };

  const currentEmployer = employers.find(e => e.id === currentEmployerId) || employers[0];

  const updateCandidate = (data: Partial<CandidateProfile>) => {
    setCandidate(prev => ({ ...prev, ...data }));
    showToast('Candidate PLM Profile updated successfully', 'success');
  };

  const toggleSaveJob = (jobId: string) => {
    setSavedJobIds(prev => {
      const exists = prev.includes(jobId);
      const next = exists ? prev.filter(id => id !== jobId) : [...prev, jobId];
      showToast(exists ? 'Removed from saved PLM jobs' : 'Saved job to your PLM bookmarks', 'info');
      return next;
    });
  };

  // 1. Employer Registers Company -> Triggers email to Main Admin!
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

    // CRITICAL REQUIREMENT: Trigger automated email to Main Admin!
    const adminAlertEmail: SimulatedEmail = {
      id: `mail-${Date.now()}-1`,
      to: 'admin@plmnexus.internal',
      from: 'system@plmnexus.internal',
      subject: `[ACTION REQUIRED] New PLM Employer Registered: ${createdEmp.companyName} (${createdEmp.corporateDomain})`,
      body: `Hello Platform Governance Administrator,

A new corporate enterprise has completed registration on PLM Nexus and requested Enterprise Verification:

• Company Name: ${createdEmp.companyName}
• Legal Entity: ${createdEmp.legalEntity}
• Corporate Domain: ${createdEmp.corporateDomain}
• Contact Representative: ${createdEmp.contactPerson} (${createdEmp.contactTitle})
• Direct Contact: ${createdEmp.contactEmail}
• Tax Registration / EIN: ${createdEmp.taxRegistrationNumber}
• Declared PLM Systems: ${createdEmp.primaryPLMStack.join(', ')}
• Attached Audit File: ${createdEmp.verificationDocName}

NOTICE: This company cannot publish public PLM jobs or contact engineers until you review their business legitimacy in the Main Admin Console.

Go to Main Admin Console > Verification Queue to approve or request further documents.`,
      timestamp: new Date().toISOString(),
      triggerEvent: 'employer_registration',
      read: false,
      metadata: { companyId: id },
    };

    // Also send receipt email to employer contact
    const employerReceiptEmail: SimulatedEmail = {
      id: `mail-${Date.now()}-2`,
      to: createdEmp.contactEmail,
      from: 'governance@plmnexus.internal',
      subject: `Verification Request Received for ${createdEmp.companyName}`,
      body: `Dear ${createdEmp.contactPerson},

We have received your verification request for ${createdEmp.companyName}.

Our Platform Governance Admin has been notified via priority dispatch and is auditing your domain (${createdEmp.corporateDomain}) and PLM credentials. Once verified, your account will be unlocked to post positions and scout certified PLM specialists.

Current Status: Pending Admin Review
Estimated Review Time: Under 2 hours`,
      timestamp: new Date().toISOString(),
      triggerEvent: 'employer_registration',
      read: false,
      metadata: { companyId: id },
    };

    setSimulatedEmails(prev => [adminAlertEmail, employerReceiptEmail, ...prev]);
    showToast(`Registered ${createdEmp.companyName}! Verification email sent to Main Admin.`, 'success');
    return id;
  };

  // 2. Main Admin Approves Company -> Unlocks job posting & notifies Employer
  const approveEmployer = (employerId: string, notes?: string) => {
    let approvedEmp: EmployerProfile | undefined;

    setEmployers(prev => prev.map(emp => {
      if (emp.id === employerId) {
        approvedEmp = {
          ...emp,
          verificationStatus: 'verified',
          verifiedAt: new Date().toISOString(),
        };
        return approvedEmp;
      }
      return emp;
    }));

    // Unlock any jobs posted by this employer that were in pending status
    setJobs(prev => prev.map(job => {
      if (job.employerId === employerId) {
        return {
          ...job,
          isEmployerVerified: true,
          status: 'active',
        };
      }
      return job;
    }));

    if (approvedEmp) {
      // Dispatch automated congratulations email to employer
      const approvalEmail: SimulatedEmail = {
        id: `mail-${Date.now()}`,
        to: approvedEmp.contactEmail,
        from: 'governance@plmnexus.internal',
        subject: `[APPROVED] Enterprise Verification Granted: ${approvedEmp.companyName}`,
        body: `Dear ${approvedEmp.contactPerson},

Great news! The Main Admin has reviewed and APPROVED the verification credentials for ${approvedEmp.companyName}.

Verification Audit Log:
• Corporate Domain: ${approvedEmp.corporateDomain} (VERIFIED)
• Tax & Business Entity: ${approvedEmp.legalEntity} (VERIFIED)
• PLM Ecosystem Stack: ${approvedEmp.primaryPLMStack.join(', ')}
${notes ? `• Admin Audit Note: "${notes}"` : ''}

Your enterprise account has now been activated. You can immediately:
1. Publish live PLM job listings visible to verified Teamcenter, Windchill, and 3DEXPERIENCE engineers.
2. Review applicant resumes, match scores, and portfolio projects.
3. Advance candidates through your technical hiring stages.

Thank you for maintaining the highest standards in the PLM ecosystem.`,
        timestamp: new Date().toISOString(),
        triggerEvent: 'admin_company_approved',
        read: false,
        metadata: { companyId: employerId },
      };

      setSimulatedEmails(prev => [approvalEmail, ...prev]);
      showToast(`${approvedEmp.companyName} has been verified! Approval email dispatched.`, 'success');
    }
  };

  // 3. Main Admin Rejects / Requests Revision
  const rejectEmployer = (employerId: string, reason: string) => {
    const emp = employers.find(e => e.id === employerId);
    if (!emp) return;

    setEmployers(prev => prev.map(e => {
      if (e.id === employerId) {
        return {
          ...e,
          verificationStatus: 'rejected',
          rejectionReason: reason,
        };
      }
      return e;
    }));

    const rejectEmail: SimulatedEmail = {
      id: `mail-${Date.now()}`,
      to: emp.contactEmail,
      from: 'governance@plmnexus.internal',
      subject: `Notice: Verification Update for ${emp.companyName}`,
      body: `Dear ${emp.contactPerson},

Regarding your verification request for ${emp.companyName}:

Our Platform Administrator was unable to complete verification due to the following reason:
"${reason}"

Please update your corporate documentation or reply directly with valid business registration proofs.`,
      timestamp: new Date().toISOString(),
      triggerEvent: 'admin_company_rejected',
      read: false,
      metadata: { companyId: employerId },
    };

    setSimulatedEmails(prev => [rejectEmail, ...prev]);
    showToast(`Verification rejected for ${emp.companyName}. Notification email sent.`, 'warning');
  };

  // 4. Post Job - Checks if employer is verified!
  const postJob = (jobData: Omit<Job, 'id' | 'employerId' | 'employerName' | 'employerLogoInitials' | 'employerLogoBg' | 'isEmployerVerified' | 'postedAt' | 'applicantCount' | 'status'>): { success: boolean; message: string } => {
    if (!currentEmployer) {
      return { success: false, message: 'No active employer selected' };
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

    if (!isVerified) {
      showToast('Job saved in draft! Your company must be verified by the Admin before public publishing.', 'warning');
      return { 
        success: true, 
        message: 'Job created in pending state. It will automatically publish once the Main Admin approves your company verification.' 
      };
    }

    showToast(`Published: "${newJob.title}" to certified PLM candidates!`, 'success');
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

    // Calculate realistic match score
    let score = 70;
    if (candidate.primaryPLM === targetJob.primaryPLM) score += 15;
    else if (targetJob.relatedSystems.includes(candidate.primaryPLM) || candidate.secondaryPLMs.includes(targetJob.primaryPLM)) score += 8;

    const matchingModules = targetJob.requiredModules.filter(m => candidate.modules.includes(m));
    score += Math.min(10, matchingModules.length * 3);

    if (targetJob.itarRequired && candidate.clearance !== 'None') score += 5;

    const newApp: Application = {
      id: `app-${Date.now()}`,
      jobId,
      jobTitle: targetJob.title,
      employerId: targetJob.employerId,
      employerName: targetJob.employerName,
      candidateId: candidate.id,
      candidateName: candidate.name,
      candidateEmail: candidate.email,
      candidateHeadline: candidate.headline,
      candidatePrimaryPLM: candidate.primaryPLM,
      candidateExperience: candidate.yearsOfExperience,
      matchScore: Math.min(99, score),
      appliedDate: new Date().toISOString(),
      coverNote,
      resumeFileName: resumeFileName || 'Marcus_Vance_PLM_Architect_Resume.pdf',
      status: 'applied',
    };

    setApplications(prev => [newApp, ...prev]);

    // Update job applicant count
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, applicantCount: j.applicantCount + 1 } : j));

    // Simulated email to employer
    const employerNotice: SimulatedEmail = {
      id: `mail-${Date.now()}`,
      to: `careers@${targetJob.employerName.toLowerCase().replace(/[^a-z]/g, '')}.com`,
      from: 'alerts@plmnexus.internal',
      subject: `[New Candidate Application] ${candidate.name} applied for ${targetJob.title} (${Math.min(99, score)}% Match)`,
      body: `Hello ${targetJob.employerName} Talent Team,

A verified PLM specialist has submitted an application for "${targetJob.title}":

• Candidate: ${candidate.name}
• Primary Stack: ${candidate.primaryPLM} (${candidate.yearsOfExperience} yrs dedicated experience)
• Match Score: ${Math.min(99, score)}% against required PLM modules
• ITAR / Clearance: ${candidate.clearance}
• Resume: ${newApp.resumeFileName}

Cover Note Summary:
"${coverNote.slice(0, 200)}..."

Review full portfolio & advance candidate in your PLM Nexus ATS Pipeline.`,
      timestamp: new Date().toISOString(),
      triggerEvent: 'candidate_applied',
      read: false,
      metadata: {
        jobId,
        companyId: targetJob.employerId,
        applicantId: newApp.id,
      },
    };

    setSimulatedEmails(prev => [employerNotice, ...prev]);
    showToast(`Application submitted to ${targetJob.employerName} with ${Math.min(99, score)}% PLM match score!`, 'success');
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

      // If moving to interview or offer, notify candidate
      if (newStatus === 'technical_interview' || newStatus === 'offer_extended') {
        const candidateEmail: SimulatedEmail = {
          id: `mail-${Date.now()}`,
          to: targetApp.candidateEmail,
          from: `recruiting@${targetApp.employerName.toLowerCase().replace(/[^a-z]/g, '')}.com`,
          subject: `${newStatus === 'offer_extended' ? 'Formal Offer' : 'Interview Invitation'}: ${targetApp.jobTitle} at ${targetApp.employerName}`,
          body: `Dear ${targetApp.candidateName},

We have reviewed your application for the ${targetApp.jobTitle} position at ${targetApp.employerName}.

Status Update: You have been moved to "${stageLabels[newStatus]}".

Our engineering team was impressed by your ${targetApp.candidatePrimaryPLM} background. Please check your candidate portal for next steps and calendar availability.`,
          timestamp: new Date().toISOString(),
          triggerEvent: newStatus === 'technical_interview' ? 'interview_scheduled' : 'admin_company_approved',
          read: false,
          metadata: {
            applicantId: applicationId,
            companyId: targetApp.employerId,
            jobId: targetApp.jobId,
          },
        };

        setSimulatedEmails(prev => [candidateEmail, ...prev]);
      }

      showToast(`Candidate moved to stage: ${stageLabels[newStatus]}`, 'success');
    }
  };

  const markEmailAsRead = (emailId: string) => {
    setSimulatedEmails(prev => prev.map(m => m.id === emailId ? { ...m, read: true } : m));
  };

  const markAllEmailsAsRead = () => {
    setSimulatedEmails(prev => prev.map(m => ({ ...m, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  const unreadEmailCount = simulatedEmails.filter(m => !m.read).length;

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
        simulatedEmails,
        unreadEmailCount,
        savedJobIds,
        toggleSaveJob,
        registerEmployer,
        approveEmployer,
        rejectEmployer,
        postJob,
        applyToJob,
        updateApplicationStage,
        markEmailAsRead,
        markAllEmailsAsRead,
        isEmailDrawerOpen,
        setIsEmailDrawerOpen,
        notificationToast,
        dismissToast,
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
