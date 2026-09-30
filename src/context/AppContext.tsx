import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
  CandidateProfile, 
  EmployerProfile, 
  Job, 
  Application,
  UserSession,
  JobInvitation
} from '../types';
import { auth, db, googleProvider } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  signOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import {
  COLLECTIONS,
  purgeDummyDataFromFirestore,
  subscribeToEmployers,
  subscribeToJobs,
  subscribeToApplications,
  subscribeToCandidate,
  subscribeToCandidates,
  saveEmployerToFirestore,
  saveJobToFirestore,
  saveApplicationToFirestore,
  updateCandidateInFirestore,
  subscribeToJobInvitations,
  saveJobInvitationToFirestore,
} from '../services/firebaseService';
import {
  PlatformChoices,
  DEFAULT_CHOICES,
  subscribeToPlatformChoices,
} from '../services/choicesService';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  candidate: CandidateProfile | null;
  updateCandidate: (data: Partial<CandidateProfile>) => void;
  allCandidates: CandidateProfile[];
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
  userSession: UserSession | null;
  isAuthReady: boolean;
  login: (email: string, password: string, targetRole?: UserRole) => Promise<{ success: boolean; message?: string; role?: UserRole }>;
  signUp: (email: string, password: string, targetRole: UserRole, name?: string, companyName?: string) => Promise<{ success: boolean; message?: string }>;
  loginWithGoogle: (targetRole?: UserRole) => Promise<{ success: boolean; message?: string; role?: UserRole }>;
  logout: () => Promise<void>;
  isFirebaseConnected: boolean;
  // Dynamic platform choices managed by admin
  platformChoices: PlatformChoices;
  // Enterprise Direct Connect & Job Invitations
  jobInvitations: JobInvitation[];
  sendJobInvitation: (invite: Omit<JobInvitation, 'id' | 'sentAt' | 'status'>) => { success: boolean; message: string };
  respondToJobInvitation: (invitationId: string, accept: boolean) => void;
  isConnected: (candidateId: string, employerId?: string) => boolean;
  getConnectionForCandidate: (candidateId: string, employerId?: string) => JobInvitation | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Purge any obsolete mock storage keys completely
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
    'plm_nexus_candidate_clean',
    'plm_nexus_employers_clean',
    'plm_nexus_curr_emp_id_clean',
    'plm_nexus_jobs_clean',
    'plm_nexus_applications_clean',
    'plm_nexus_saved_jobs_clean',
    'plm_nexus_user_session_clean',
    'plm_nexus_role_clean',
  ];
  legacyKeys.forEach(k => localStorage.removeItem(k));
}
const createDefaultCandidateProfile = (userId: string, userName: string, userEmail: string): CandidateProfile => ({
  id: userId,
  name: userName,
  headline: '',
  email: userEmail,
  phone: '',
  location: '',
  yearsOfExperience: 0,
  primaryPLM: 'Siemens Teamcenter',
  secondaryPLMs: [],
  modules: [],
  cadTools: [],
  clearance: 'None',
  certifications: [],
  currentCompany: '',
  currentRole: '',
  expectedCompensation: '',
  availableFrom: '',
  bio: '',
  verifiedSpecialist: true,
  avatarInitials: (userName.trim().slice(0, 2) || 'PLM').toUpperCase(),
  accentColor: 'from-blue-600 to-indigo-600',
  portfolioProjects: []
});

const createDefaultEmployerProfile = (userId: string, companyName: string, userName: string, userEmail: string): EmployerProfile => {
  const company = companyName.trim() || `${userName}'s Organization`;
  return {
    id: userId,
    companyName: company,
    legalEntity: company,
    corporateDomain: userEmail.includes('@') ? userEmail.split('@')[1] : '',
    contactPerson: userName,
    contactTitle: '',
    contactEmail: userEmail,
    adminEmail: userEmail,
    industry: 'Aerospace & Defense',
    headquarters: '',
    companySize: '10 - 50 employees',
    website: '',
    primaryPLMStack: [],
    cadEnvironments: [],
    verificationStatus: 'pending_verification',
    verificationRequestedAt: new Date().toISOString(),
    taxRegistrationNumber: '',
    logoInitials: (company.slice(0, 2) || 'EM').toUpperCase(),
    logoBg: 'bg-indigo-600',
    about: ''
  };
};

const STORAGE_KEY_JOB_INVITATIONS = 'plm_nexus_job_invitations_v1';

const loadSavedJobInvitations = (): JobInvitation[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_JOB_INVITATIONS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Ensure no mock seed items are loaded
    return parsed.filter((inv: any) => inv && inv.id !== 'invite-seed-001' && inv.employerId !== 'emp-apex');
  } catch (e) {
    return [];
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [roleState, setRoleState] = useState<UserRole>('candidate');
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  // Single source of truth: role is strictly determined by the DB userSession.role when logged in
  const role: UserRole = userSession?.role || roleState;
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
  const [candidate, setCandidate] = useState<CandidateProfile | null>(null);
  const [allCandidates, setAllCandidates] = useState<CandidateProfile[]>([]);
  const [jobInvitations, setJobInvitations] = useState<JobInvitation[]>(loadSavedJobInvitations);
  const [employers, setEmployers] = useState<EmployerProfile[]>([]);
  const [currentEmployerId, setCurrentEmployerIdState] = useState<string>('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(true);
  const [notificationToast, setNotificationToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);
  const [platformChoices, setPlatformChoices] = useState<PlatformChoices>(DEFAULT_CHOICES);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_JOB_INVITATIONS, JSON.stringify(jobInvitations));
    } catch (e) {
      console.warn('Failed to save job invitations to localStorage:', e);
    }
  }, [jobInvitations]);

  // Initialize Firebase listeners and purge any old dummy data
  useEffect(() => {
    purgeDummyDataFromFirestore().catch(err => {
      console.warn('Purge dummy data:', err);
    });

    // Real Firebase Auth state listener
    const unsubAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setCurrentUser(firebaseUser);
        try {
          const userDocRef = doc(db, COLLECTIONS.USERS, firebaseUser.uid);
          const userSnap = await getDoc(userDocRef);
          let assignedRole: UserRole = 'candidate';
          let userName = firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'PLM Specialist');
          let companyName: string | undefined = undefined;

          if (userSnap.exists()) {
            const data = userSnap.data();
            if (data.role) assignedRole = data.role as UserRole;
            if (data.name) userName = data.name;
            if (data.companyName) companyName = data.companyName;
          }

          const session: UserSession = {
            id: firebaseUser.uid,
            name: userName,
            email: firebaseUser.email || '',
            role: assignedRole,
            companyName
          };

          setUserSession(session);
          setRoleState(assignedRole);

          // If role is candidate, fetch their profile from Firestore
          if (assignedRole === 'candidate') {
            const candDocRef = doc(db, COLLECTIONS.CANDIDATES, firebaseUser.uid);
            const candSnap = await getDoc(candDocRef);
            if (candSnap.exists()) {
              const cdata = candSnap.data() as CandidateProfile;
              setCandidate(cdata);
              if (cdata.name && cdata.name !== userName) {
                userName = cdata.name;
                setUserSession(prev => prev ? { ...prev, name: cdata.name } : null);
              }
            } else {
              const newCand = createDefaultCandidateProfile(firebaseUser.uid, userName, firebaseUser.email || '');
              setCandidate(newCand);
              await updateCandidateInFirestore(newCand);
            }
          }

          // If role is employer, activate their company ID
          if (assignedRole === 'employer') {
            setCurrentEmployerIdState(firebaseUser.uid);
          }
        } catch (e) {
          console.warn('Auth state sync error:', e);
        }
      } else {
        // User is completely logged out - no dummy data
        setCurrentUser(null);
        setUserSession(null);
        setCandidate(null);
      }
      setIsAuthReady(true);
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

    const unsubCandidates = subscribeToCandidates((liveCandidates) => {
      setAllCandidates(liveCandidates);
    });

    const unsubInvitations = subscribeToJobInvitations((liveInvitations) => {
      setJobInvitations(liveInvitations);
    });

    const unsubChoices = subscribeToPlatformChoices((choices) => {
      setPlatformChoices(choices);
    });

    return () => {
      unsubAuth();
      unsubEmployers();
      unsubJobs();
      unsubApplications();
      unsubCandidates();
      unsubInvitations();
      unsubChoices();
    };
  }, []);

  // Real-time listener for the active candidate profile when logged in as candidate
  useEffect(() => {
    if (!currentUser || userSession?.role !== 'candidate') return;
    const unsub = subscribeToCandidate(currentUser.uid, (liveCandidate) => {
      if (liveCandidate) {
        setCandidate(liveCandidate);
      }
    });
    return () => unsub();
  }, [currentUser, userSession?.role]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    setNotificationToast({ message, type });
    setTimeout(() => {
      setNotificationToast(prev => prev?.message === message ? null : prev);
    }, 4500);
  };

  const dismissToast = () => setNotificationToast(null);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    // User session role is strictly governed by the database. We do not override it here.
  };

  // Sign In using real Firebase Authentication (role is detected dynamically from existing user profile)
  const login = async (email: string, password: string, targetRole: UserRole = 'candidate'): Promise<{ success: boolean; message?: string; role?: UserRole }> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      // Sync user profile in Firestore
      const userDocRef = doc(db, COLLECTIONS.USERS, user.uid);
      const userSnap = await getDoc(userDocRef);
      let assignedRole = targetRole;
      let userName = user.displayName || email.split('@')[0];
      let companyName: string | undefined = undefined;

      if (userSnap.exists()) {
        const udata = userSnap.data();
        if (udata.role) assignedRole = udata.role as UserRole;
        if (udata.name) userName = udata.name;
        if (udata.companyName) companyName = udata.companyName;
      } else {
        // Fallback discovery: check if user exists in employers or candidates collection
        const empDocRef = doc(db, COLLECTIONS.EMPLOYERS, user.uid);
        const empSnap = await getDoc(empDocRef);
        if (empSnap.exists()) {
          assignedRole = 'employer';
          companyName = empSnap.data()?.name;
        } else {
          const candDocRef = doc(db, COLLECTIONS.CANDIDATES, user.uid);
          const candSnap = await getDoc(candDocRef);
          if (candSnap.exists()) {
            assignedRole = 'candidate';
          }
        }

        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          role: assignedRole,
          name: userName,
          companyName: companyName || '',
          createdAt: new Date().toISOString()
        }, { merge: true });
      }

      if (assignedRole === 'candidate') {
        const candDocRef = doc(db, COLLECTIONS.CANDIDATES, user.uid);
        const candSnap = await getDoc(candDocRef);
        if (candSnap.exists()) {
          setCandidate(candSnap.data() as CandidateProfile);
        } else {
          const newCand = createDefaultCandidateProfile(user.uid, userName, user.email || '');
          setCandidate(newCand);
        }
      }

      if (assignedRole === 'employer') {
        setCurrentEmployerIdState(user.uid);
      }

      const session: UserSession = {
        id: user.uid,
        name: userName,
        email: user.email || email,
        role: assignedRole,
        companyName
      };

      setUserSession(session);
      setRoleState(assignedRole);
      showToast(`Welcome back, ${userName}! Verified via Firebase Authentication.`, 'success');
      return { success: true, role: assignedRole };
    } catch (err: any) {
      console.error('Firebase Auth Login Error:', err);
      let userFriendlyMsg = 'Authentication failed. Please verify your credentials.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        userFriendlyMsg = 'Invalid email or password. If you do not have an account yet, click "Create Account".';
      } else if (err.code === 'auth/too-many-requests') {
        userFriendlyMsg = 'Too many attempts. Access temporarily disabled. Try again shortly.';
      } else if (err.code === 'auth/network-request-failed') {
        userFriendlyMsg = 'Network error. Please check your internet connection.';
      } else if (err.message) {
        userFriendlyMsg = err.message;
      }
      return { success: false, message: userFriendlyMsg };
    }
  };

  // Create new Account using real Firebase Authentication
  const signUp = async (
    email: string, 
    password: string, 
    targetRole: UserRole, 
    name?: string, 
    companyName?: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;
      const userName = name?.trim() || email.split('@')[0];

      // Save user record to Firestore users collection
      const userDocRef = doc(db, COLLECTIONS.USERS, user.uid);
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        role: targetRole,
        name: userName,
        companyName: companyName?.trim() || '',
        createdAt: new Date().toISOString()
      });

      // Role specific profile creation
      if (targetRole === 'candidate') {
        const newCand = createDefaultCandidateProfile(user.uid, userName, user.email || '');
        await updateCandidateInFirestore(newCand);
        setCandidate(newCand);
      } else if (targetRole === 'employer') {
        const newEmp = createDefaultEmployerProfile(user.uid, companyName || '', userName, user.email || '');
        await saveEmployerToFirestore(newEmp);
        setCurrentEmployerIdState(user.uid);
      }

      const session: UserSession = {
        id: user.uid,
        name: userName,
        email: user.email || email,
        role: targetRole,
        companyName
      };

      setUserSession(session);
      setRoleState(targetRole);
      showToast(`Account successfully created for ${userName}! Signed into Firebase.`, 'success');
      return { success: true };
    } catch (err: any) {
      console.error('Firebase Auth Sign Up Error:', err);
      let userFriendlyMsg = 'Could not create account.';
      if (err.code === 'auth/email-already-in-use') {
        userFriendlyMsg = 'This email is already registered. Please switch to "Sign In" instead.';
      } else if (err.code === 'auth/weak-password') {
        userFriendlyMsg = 'Password must be at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        userFriendlyMsg = 'Please enter a valid email address.';
      } else if (err.message) {
        userFriendlyMsg = err.message;
      }
      return { success: false, message: userFriendlyMsg };
    }
  };

  // Sign In / Sign Up with a Google account. If this Google account already has a
  // user record in Firestore, that record's saved role is used (an account keeps
  // the role it was originally created with). Otherwise a new user record and a
  // Sign In / Sign Up with a Google account
  const loginWithGoogle = async (targetRole: UserRole = 'candidate'): Promise<{ success: boolean; message?: string; role?: UserRole }> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userDocRef = doc(db, COLLECTIONS.USERS, user.uid);
      const userSnap = await getDoc(userDocRef);

      let assignedRole: UserRole = targetRole;
      let userName = user.displayName || (user.email ? user.email.split('@')[0] : 'PLM Specialist');
      let companyName: string | undefined = undefined;
      const isNewUser = !userSnap.exists();

      if (!isNewUser) {
        const udata = userSnap.data();
        if (udata.role) assignedRole = udata.role as UserRole;
        if (udata.name) userName = udata.name;
        if (udata.companyName) companyName = udata.companyName;
      } else {
        // Fallback discovery: check if employer or candidate record already exists
        const empDocRef = doc(db, COLLECTIONS.EMPLOYERS, user.uid);
        const empSnap = await getDoc(empDocRef);
        if (empSnap.exists()) {
          assignedRole = 'employer';
          companyName = empSnap.data()?.name;
        } else {
          const candDocRef = doc(db, COLLECTIONS.CANDIDATES, user.uid);
          const candSnap = await getDoc(candDocRef);
          if (candSnap.exists()) {
            assignedRole = 'candidate';
          }
        }

        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          role: assignedRole,
          name: userName,
          photoURL: user.photoURL || '',
          authProvider: 'google',
          companyName: companyName || '',
          createdAt: new Date().toISOString()
        }, { merge: true });
      }

      if (assignedRole === 'candidate') {
        const candDocRef = doc(db, COLLECTIONS.CANDIDATES, user.uid);
        const candSnap = await getDoc(candDocRef);
        if (candSnap.exists()) {
          setCandidate(candSnap.data() as CandidateProfile);
        } else {
          const newCand = createDefaultCandidateProfile(user.uid, userName, user.email || '');
          setCandidate(newCand);
        }
      } else if (assignedRole === 'employer') {
        const empDocRef = doc(db, COLLECTIONS.EMPLOYERS, user.uid);
        const empSnap = await getDoc(empDocRef);
        if (!empSnap.exists()) {
          const newEmp = createDefaultEmployerProfile(user.uid, companyName || '', userName, user.email || '');
          await saveEmployerToFirestore(newEmp);
        }
        setCurrentEmployerIdState(user.uid);
      }

      const session: UserSession = {
        id: user.uid,
        name: userName,
        email: user.email || '',
        role: assignedRole,
        companyName
      };

      setUserSession(session);
      setRoleState(assignedRole);
      showToast(`${isNewUser ? 'Account created' : 'Welcome back'}, ${userName}! Signed in with Google.`, 'success');
      return { success: true, role: assignedRole };
    } catch (err: any) {
      console.error('Firebase Google Auth Error:', err);
      let userFriendlyMsg = 'Could not sign in with Google. Please try again.';
      if (err.code === 'auth/popup-closed-by-user') {
        userFriendlyMsg = 'Google sign-in was cancelled.';
      } else if (err.code === 'auth/popup-blocked') {
        userFriendlyMsg = 'Your browser blocked the Google sign-in popup. Please allow popups and try again.';
      } else if (err.code === 'auth/network-request-failed') {
        userFriendlyMsg = 'Network error. Please check your internet connection.';
      } else if (err.message) {
        userFriendlyMsg = err.message;
      }
      return { success: false, message: userFriendlyMsg };
    }
  };

  // Sign out completely
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Sign out error:', e);
    }
    setUserSession(null);
    setCurrentUser(null);
    setCandidate(null);
    setRoleState('candidate');
    showToast('Signed out successfully. Session terminated.', 'info');
  };

  const setCurrentEmployerId = (id: string) => {
    setCurrentEmployerIdState(id);
    const emp = employers.find(e => e.id === id);
    if (emp) {
      showToast(`Active enterprise: ${emp.companyName} (${emp.verificationStatus === 'verified' ? 'Verified' : 'Pending Verification'})`, 'info');
    }
  };

  const currentEmployer = employers.find(e => 
    (currentEmployerId && e.id === currentEmployerId) ||
    (currentUser?.uid && (e.id === currentUser.uid || (e as any).userId === currentUser.uid)) ||
    (currentUser?.email && (e.contactEmail?.toLowerCase() === currentUser.email.toLowerCase() || e.adminEmail?.toLowerCase() === currentUser.email.toLowerCase()))
  ) || (currentEmployerId ? employers.find(e => e.id === currentEmployerId) : undefined) || employers[0] || undefined;

  const updateCandidate = (data: Partial<CandidateProfile>) => {
    if (!candidate) return;
    const updated = { ...candidate, ...data };
    setCandidate(updated);
    updateCandidateInFirestore(updated);
    if (data.name && data.name.trim()) {
      if (userSession) {
        setUserSession(prev => prev ? { ...prev, name: data.name!.trim() } : null);
      }
      setDoc(doc(db, COLLECTIONS.USERS, candidate.id), { name: data.name.trim() }, { merge: true }).catch(console.warn);
    }
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
    const id = currentUser?.uid || `cand-${Date.now().toString().slice(-4)}`;
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
      resumeFileName: newCand.resumeFileName?.trim() || undefined,
    };

    setCandidate(createdCand);
    await updateCandidateInFirestore(createdCand);
    showToast(`Welcome, ${createdCand.name}! Your PLM specialist profile is registered & active in Firebase.`, 'success');
    return id;
  };

  // 1. Employer Registers Company -> Persists to Firestore
  const registerEmployer = async (newEmp: Omit<EmployerProfile, 'id' | 'verificationStatus' | 'verificationRequestedAt' | 'logoInitials' | 'logoBg'>): Promise<string> => {
    const id = currentUser?.uid || `emp-${Date.now().toString().slice(-4)}`;
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
      verificationDocName: newEmp.verificationDocName?.trim() || undefined,
    };

    setEmployers(prev => [createdEmp, ...prev]);
    setCurrentEmployerIdState(id);
    saveEmployerToFirestore(createdEmp);

    showToast(`Registered ${createdEmp.companyName}! Submitted for Main Admin verification.`, 'success');
    return id;
  };

  // 2. Main Admin Approves Company -> Unlocks job posting & updates Firestore
  const approveEmployer = async (employerId: string, notes?: string) => {
    const target = employers.find(emp => emp.id === employerId);
    if (!target) return;

    const approvedEmp: EmployerProfile = {
      ...target,
      verificationStatus: 'verified',
      verifiedAt: new Date().toISOString(),
    };

    // 1. Immediately update local state so all UI components re-render instantaneously
    setEmployers(prev => prev.map(emp => emp.id === employerId ? approvedEmp : emp));

    // 2. Unlock all jobs associated with this employer
    setJobs(prev => prev.map(job => {
      if (job.employerId === employerId || (target.companyName && job.employerName === target.companyName)) {
        return {
          ...job,
          isEmployerVerified: true,
          status: 'active' as const,
        };
      }
      return job;
    }));

    // 3. Persist to Firestore (which also notifies onSnapshot listeners across all browser sessions)
    try {
      await saveEmployerToFirestore(approvedEmp);

      const affectedJobs = jobs.filter(job => job.employerId === employerId || (target.companyName && job.employerName === target.companyName));
      for (const j of affectedJobs) {
        await saveJobToFirestore({
          ...j,
          isEmployerVerified: true,
          status: 'active',
        });
      }
    } catch (err) {
      console.warn('Error persisting employer approval to Firestore:', err);
    }

    showToast(`${approvedEmp.companyName} has been verified and synced across all views!`, 'success');
  };

  // 3. Main Admin Rejects / Requests Revision
  const rejectEmployer = async (employerId: string, reason: string) => {
    const emp = employers.find(e => e.id === employerId);
    if (!emp) return;

    const rejected: EmployerProfile = {
      ...emp,
      verificationStatus: 'rejected',
      rejectionReason: reason,
    };

    setEmployers(prev => prev.map(e => e.id === employerId ? rejected : e));

    try {
      await saveEmployerToFirestore(rejected);
    } catch (err) {
      console.warn('Error persisting employer rejection to Firestore:', err);
    }

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
    return { success: true, message: 'Job successfully posted and live across PLMSpider.' };
  };

  // 5. Apply to Job
  const applyToJob = (jobId: string, coverNote: string, resumeFileName?: string): { success: boolean; message: string } => {
    let effectiveCandidate = candidate;
    if (!effectiveCandidate && (currentUser || userSession)) {
      const uid = currentUser?.uid || userSession?.id || `cand-${Date.now()}`;
      const name = userSession?.name || currentUser?.displayName || currentUser?.email?.split('@')[0] || 'PLM Specialist';
      const email = currentUser?.email || userSession?.email || '';
      effectiveCandidate = createDefaultCandidateProfile(uid, name, email);
      setCandidate(effectiveCandidate);
      updateCandidateInFirestore(effectiveCandidate).catch(console.warn);
    }

    if (!effectiveCandidate) {
      showToast('Please sign in as a job seeker to apply.', 'warning');
      return { success: false, message: 'No active candidate profile found.' };
    }

    const targetJob = jobs.find(j => j.id === jobId) || jobs.find(j => j.id && jobId && j.id.toString() === jobId.toString());
    if (!targetJob) {
      showToast('Job position could not be found or has expired.', 'warning');
      return { success: false, message: 'Job not found' };
    }

    const alreadyApplied = applications.some(a => 
      a.jobId === targetJob.id && 
      (a.candidateId === effectiveCandidate.id || (a.candidateEmail && a.candidateEmail === effectiveCandidate.email))
    );
    if (alreadyApplied) {
      showToast('You have already submitted an application for this position.', 'info');
      return { success: false, message: 'You have already applied to this position.' };
    }

    // Calculate match score
    let score = 70;
    if (effectiveCandidate.primaryPLM === targetJob.primaryPLM) score += 15;
    else if ((targetJob.relatedSystems || []).includes(effectiveCandidate.primaryPLM) || (effectiveCandidate.secondaryPLMs || []).includes(targetJob.primaryPLM)) score += 8;

    const candidateModules = effectiveCandidate.modules || [];
    const jobModules = targetJob.requiredModules || [];
    const matchingModules = jobModules.filter(m => candidateModules.includes(m));
    score += Math.min(10, matchingModules.length * 3);

    if (targetJob.itarRequired && effectiveCandidate.clearance && effectiveCandidate.clearance !== 'None') score += 5;

    const newApp: Application = {
      id: `app-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      jobId: targetJob.id,
      jobTitle: targetJob.title || 'PLM Specialist',
      employerId: targetJob.employerId || '',
      employerName: targetJob.employerName || '',
      candidateId: effectiveCandidate.id,
      candidateName: effectiveCandidate.name || 'Candidate',
      candidateEmail: effectiveCandidate.email || '',
      candidateHeadline: effectiveCandidate.headline || '',
      candidatePrimaryPLM: effectiveCandidate.primaryPLM || 'Siemens Teamcenter',
      candidateExperience: effectiveCandidate.yearsOfExperience || 0,
      matchScore: Math.min(99, score),
      appliedDate: new Date().toISOString(),
      coverNote: coverNote.trim() || `Application submitted by ${effectiveCandidate.name}.`,
      resumeFileName: resumeFileName?.trim() || effectiveCandidate.resumeFileName || `${effectiveCandidate.name.replace(/\s+/g, '_')}_Resume.pdf`,
      status: 'applied',
    };

    setApplications(prev => [newApp, ...prev.filter(a => a.id !== newApp.id)]);
    saveApplicationToFirestore(newApp);

    // Update job applicant count
    const updatedJob = { ...targetJob, applicantCount: (targetJob.applicantCount || 0) + 1 };
    setJobs(prev => prev.map(j => j.id === targetJob.id ? updatedJob : j));
    saveJobToFirestore(updatedJob);

    showToast(`Application successfully submitted for "${targetJob.title}"!`, 'success');
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

  const sendJobInvitation = (inviteData: Omit<JobInvitation, 'id' | 'sentAt' | 'status'>) => {
    const newInvite: JobInvitation = {
      ...inviteData,
      id: `inv-${Date.now()}`,
      sentAt: new Date().toISOString(),
      status: 'pending'
    };
    setJobInvitations(prev => [newInvite, ...prev]);
    saveJobInvitationToFirestore(newInvite);
    showToast(`Job invitation sent to ${inviteData.candidateName} for position: ${inviteData.jobTitle}`, 'success');
    return { success: true, message: 'Job invitation dispatched successfully.' };
  };

  const respondToJobInvitation = (invitationId: string, accept: boolean) => {
    let updatedInvite: JobInvitation | undefined;
    setJobInvitations(prev => 
      prev.map(inv => {
        if (inv.id !== invitationId) return inv;
        updatedInvite = {
          ...inv,
          status: accept ? 'accepted' : 'declined',
          respondedAt: new Date().toISOString()
        };
        return updatedInvite;
      })
    );
    if (updatedInvite) {
      saveJobInvitationToFirestore(updatedInvite);
    }
    const target = jobInvitations.find(i => i.id === invitationId);
    if (accept) {
      showToast(`Connection established! Direct contact details and verified resume are now shared with ${target?.employerName || 'the employer'}.`, 'success');
    } else {
      showToast(`Job invitation declined.`, 'info');
    }
  };

  const isConnected = (candidateId: string, employerId?: string) => {
    const empId = employerId || currentEmployer?.id || currentEmployerId || 'emp-apex';
    return jobInvitations.some(
      inv => inv.candidateId === candidateId && 
             (inv.employerId === empId || !inv.employerId) && 
             inv.status === 'accepted'
    );
  };

  const getConnectionForCandidate = (candidateId: string, employerId?: string) => {
    const empId = employerId || currentEmployer?.id || currentEmployerId || 'emp-apex';
    return jobInvitations.find(
      inv => inv.candidateId === candidateId && 
             (inv.employerId === empId || !inv.employerId) && 
             inv.status === 'accepted'
    );
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        candidate,
        updateCandidate,
        allCandidates,
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
        userSession,
        isAuthReady,
        login,
        signUp,
        loginWithGoogle,
        logout,
        isFirebaseConnected,
        platformChoices,
        jobInvitations,
        sendJobInvitation,
        respondToJobInvitation,
        isConnected,
        getConnectionForCandidate,
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
