import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  writeBatch
} from "firebase/firestore";
import { db } from "../firebase";
import {
  CandidateProfile,
  EmployerProfile,
  Job,
  Application,
  JobInvitation,
  ContactEnquiry,
} from "../types";

export const COLLECTIONS = {
  USERS: "users",
  EMPLOYERS: "employers",
  JOBS: "jobs",
  APPLICATIONS: "applications",
  CANDIDATES: "candidates",
  SAVED_JOBS: "saved_jobs",
  JOB_INVITATIONS: "job_invitations",
  ENQUIRIES: "enquiries",
};

// Purge any legacy dummy data from Firestore
const DUMMY_IDS = {
  EMPLOYERS: ['emp-01', 'emp-02', 'emp-03', 'emp-04'],
  JOBS: ['job-01', 'job-02', 'job-03', 'job-04', 'job-05'],
  APPLICATIONS: ['app-01', 'app-02', 'app-03'],
  EMAILS: ['mail-01', 'mail-02', 'mail-03', 'mail-04'],
  CANDIDATES: ['cand-01', 'cand-02'],
};

export async function purgeDummyDataFromFirestore() {
  try {
    const batch = writeBatch(db);
    let hasDeletions = false;

    for (const id of DUMMY_IDS.EMPLOYERS) {
      batch.delete(doc(db, COLLECTIONS.EMPLOYERS, id));
      hasDeletions = true;
    }
    for (const id of DUMMY_IDS.JOBS) {
      batch.delete(doc(db, COLLECTIONS.JOBS, id));
      hasDeletions = true;
    }
    for (const id of DUMMY_IDS.APPLICATIONS) {
      batch.delete(doc(db, COLLECTIONS.APPLICATIONS, id));
      hasDeletions = true;
    }
    for (const id of DUMMY_IDS.EMAILS) {
      batch.delete(doc(db, "emails", id));
      hasDeletions = true;
    }
    for (const id of DUMMY_IDS.CANDIDATES) {
      batch.delete(doc(db, COLLECTIONS.CANDIDATES, id));
      hasDeletions = true;
    }

    if (hasDeletions) {
      await batch.commit();
      console.log("Purged legacy dummy data from Firestore successfully.");
    }
  } catch (err) {
    console.warn("Could not purge dummy data from Firestore:", err);
  }
}

// Subscribe to Employers
export function subscribeToEmployers(
  onData: (employers: EmployerProfile[]) => void,
  onError?: (err: any) => void
) {
  try {
    const colRef = collection(db, COLLECTIONS.EMPLOYERS);
    return onSnapshot(colRef, (snapshot) => {
      const list: EmployerProfile[] = [];
      snapshot.forEach((d) => {
        if (!DUMMY_IDS.EMPLOYERS.includes(d.id)) {
          list.push({ id: d.id, ...d.data() } as EmployerProfile);
        }
      });
      onData(list);
    }, (error) => {
      console.warn("Firestore employers listener error:", error);
      onError?.(error);
    });
  } catch (err) {
    console.warn("Failed to subscribe to employers:", err);
    return () => {};
  }
}

// Subscribe to Jobs
export function subscribeToJobs(
  onData: (jobs: Job[]) => void,
  onError?: (err: any) => void
) {
  try {
    const colRef = collection(db, COLLECTIONS.JOBS);
    return onSnapshot(colRef, (snapshot) => {
      const list: Job[] = [];
      snapshot.forEach((d) => {
        if (!DUMMY_IDS.JOBS.includes(d.id)) {
          list.push({ id: d.id, ...d.data() } as Job);
        }
      });
      onData(list);
    }, (error) => {
      console.warn("Firestore jobs listener error:", error);
      onError?.(error);
    });
  } catch (err) {
    console.warn("Failed to subscribe to jobs:", err);
    return () => {};
  }
}

// Subscribe to Applications
export function subscribeToApplications(
  onData: (apps: Application[]) => void,
  onError?: (err: any) => void
) {
  try {
    const colRef = collection(db, COLLECTIONS.APPLICATIONS);
    return onSnapshot(colRef, (snapshot) => {
      const list: Application[] = [];
      snapshot.forEach((d) => {
        if (!DUMMY_IDS.APPLICATIONS.includes(d.id)) {
          list.push({ id: d.id, ...d.data() } as Application);
        }
      });
      onData(list);
    }, (error) => {
      console.warn("Firestore applications listener error:", error);
      onError?.(error);
    });
  } catch (err) {
    console.warn("Failed to subscribe to applications:", err);
    return () => {};
  }
}

// Subscribe to all Candidate Profiles (used by employers to search/browse talent)
export function subscribeToCandidates(
  onData: (candidates: CandidateProfile[]) => void,
  onError?: (err: any) => void
) {
  try {
    const colRef = collection(db, COLLECTIONS.CANDIDATES);
    return onSnapshot(colRef, (snapshot) => {
      const list: CandidateProfile[] = [];
      snapshot.forEach((d) => {
        if (!DUMMY_IDS.CANDIDATES.includes(d.id)) {
          const data = d.data() as CandidateProfile;
          
          // Only show candidates that have actually filled out their profile (have a name AND a headline)
          // This prevents empty test accounts from showing up as dummy data
          if (data && data.name && data.headline && data.name.trim() !== '' && data.headline.trim() !== '') {
            list.push({
              ...data,
              id: d.id,
            } as CandidateProfile);
          }
        }
      });
      onData(list);
    }, (error) => {
      console.warn("Firestore candidates listener error:", error);
      onError?.(error);
    });
  } catch (err) {
    console.warn("Failed to subscribe to candidates:", err);
    return () => {};
  }
}

// Subscribe to Job Invitations
export function subscribeToJobInvitations(
  onData: (invitations: JobInvitation[]) => void,
  onError?: (err: any) => void
) {
  try {
    const colRef = collection(db, COLLECTIONS.JOB_INVITATIONS);
    return onSnapshot(colRef, (snapshot) => {
      const list: JobInvitation[] = [];
      snapshot.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as JobInvitation);
      });
      onData(list);
    }, (error) => {
      console.warn("Firestore job_invitations listener error:", error);
      onError?.(error);
    });
  } catch (err) {
    console.warn("Failed to subscribe to job_invitations:", err);
    return () => {};
  }
}

// Save or Update Job Invitation in Firestore
export async function saveJobInvitationToFirestore(invitation: JobInvitation) {
  try {
    const docRef = doc(db, COLLECTIONS.JOB_INVITATIONS, invitation.id);
    await setDoc(docRef, invitation, { merge: true });
    return true;
  } catch (error) {
    console.error("Error saving job invitation to Firestore:", error);
    return false;
  }
}

// Subscribe to Candidate Profile
export function subscribeToCandidate(
  candidateId: string,
  onData: (candidate: CandidateProfile) => void,
  onError?: (err: any) => void
) {
  try {
    const docRef = doc(db, COLLECTIONS.CANDIDATES, candidateId);
    return onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        onData({ id: snapshot.id, ...snapshot.data() } as CandidateProfile);
      }
    }, (error) => {
      console.warn("Firestore candidate listener error:", error);
      onError?.(error);
    });
  } catch (err) {
    console.warn("Failed to subscribe to candidate:", err);
    return () => {};
  }
}

// Helper to recursively remove undefined fields which Firestore rejects
export function cleanForFirestore(obj: any): any {
  if (obj === null || obj === undefined) return null;
  if (typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(cleanForFirestore);

  const clean: Record<string, any> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (val !== undefined) {
      clean[key] = cleanForFirestore(val);
    }
  }
  return clean;
}

// Update Candidate Profile in Firestore
export async function updateCandidateInFirestore(profile: CandidateProfile) {
  try {
    const docRef = doc(db, COLLECTIONS.CANDIDATES, profile.id);
    const cleaned = cleanForFirestore(profile);
    await setDoc(docRef, cleaned, { merge: true });
    console.log("[Firestore] Candidate profile saved successfully:", profile.id, {
      resumeFileName: profile.resumeFileName,
      resumeUrl: profile.resumeUrl,
    });
    return true;
  } catch (error) {
    console.error("Error updating candidate in Firestore:", error);
    return false;
  }
}

// Save or Update Employer in Firestore
export async function saveEmployerToFirestore(employer: EmployerProfile) {
  try {
    const docRef = doc(db, COLLECTIONS.EMPLOYERS, employer.id);
    const cleaned = cleanForFirestore(employer);
    await setDoc(docRef, cleaned, { merge: true });
    return true;
  } catch (error) {
    console.error("Error saving employer to Firestore:", error);
    return false;
  }
}

// Save or Update Job in Firestore
export async function saveJobToFirestore(job: Job) {
  try {
    const docRef = doc(db, COLLECTIONS.JOBS, job.id);
    const cleaned = cleanForFirestore(job);
    await setDoc(docRef, cleaned, { merge: true });
    return true;
  } catch (error) {
    console.error("Error saving job to Firestore:", error);
    return false;
  }
}

// Save or Update Application in Firestore
export async function saveApplicationToFirestore(app: Application) {
  try {
    const docRef = doc(db, COLLECTIONS.APPLICATIONS, app.id);
    const cleaned = cleanForFirestore(app);
    await setDoc(docRef, cleaned, { merge: true });
    console.log("[Firestore] Job application saved successfully:", app.id, {
      resumeFileName: app.resumeFileName,
      resumeUrl: app.resumeUrl,
    });
    return true;
  } catch (error) {
    console.error("Error saving application to Firestore:", error);
    return false;
  }
}

// Save Contact Enquiry in Firestore
export async function saveContactEnquiryToFirestore(enquiry: ContactEnquiry) {
  try {
    const docRef = doc(db, COLLECTIONS.ENQUIRIES, enquiry.id);
    await setDoc(docRef, enquiry, { merge: true });
    return true;
  } catch (error) {
    console.error("Error saving contact enquiry to Firestore:", error);
    return false;
  }
}

// Subscribe to Contact Enquiries
export function subscribeToContactEnquiries(
  onData: (enquiries: ContactEnquiry[]) => void,
  onError?: (err: any) => void
) {
  try {
    const colRef = collection(db, COLLECTIONS.ENQUIRIES);
    return onSnapshot(colRef, (snapshot) => {
      const list: ContactEnquiry[] = [];
      snapshot.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as ContactEnquiry);
      });
      // Sort newest first
      list.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
      onData(list);
    }, (error) => {
      console.warn("Firestore contact enquiries listener error:", error);
      onError?.(error);
    });
  } catch (err) {
    console.warn("Failed to subscribe to contact enquiries:", err);
    return () => {};
  }
}

// Update Contact Enquiry status
export async function updateContactEnquiryStatusInFirestore(enquiryId: string, status: ContactEnquiry['status']) {
  try {
    const docRef = doc(db, COLLECTIONS.ENQUIRIES, enquiryId);
    await updateDoc(docRef, { status });
    return true;
  } catch (error) {
    console.error("Error updating enquiry status:", error);
    return false;
  }
}
