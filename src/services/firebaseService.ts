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
} from "../types";

export const COLLECTIONS = {
  EMPLOYERS: "employers",
  JOBS: "jobs",
  APPLICATIONS: "applications",
  CANDIDATES: "candidates",
  SAVED_JOBS: "saved_jobs",
};

// Purge any legacy dummy data from Firestore
const DUMMY_IDS = {
  EMPLOYERS: ['emp-01', 'emp-02', 'emp-03', 'emp-04'],
  JOBS: ['job-01', 'job-02', 'job-03', 'job-04', 'job-05'],
  APPLICATIONS: ['app-01', 'app-02', 'app-03'],
  EMAILS: ['mail-01', 'mail-02', 'mail-03', 'mail-04'],
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
          list.push(d.data() as EmployerProfile);
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
          list.push(d.data() as Job);
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
          list.push(d.data() as Application);
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
        onData(snapshot.data() as CandidateProfile);
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

// Update Candidate Profile in Firestore
export async function updateCandidateInFirestore(profile: CandidateProfile) {
  try {
    const docRef = doc(db, COLLECTIONS.CANDIDATES, profile.id);
    await setDoc(docRef, profile, { merge: true });
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
    await setDoc(docRef, employer, { merge: true });
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
    await setDoc(docRef, job, { merge: true });
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
    await setDoc(docRef, app, { merge: true });
    return true;
  } catch (error) {
    console.error("Error saving application to Firestore:", error);
    return false;
  }
}
