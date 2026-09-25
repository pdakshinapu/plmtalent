import { CandidateProfile, EmployerProfile, Job, Application } from '../types';

export const INITIAL_EMPLOYERS: EmployerProfile[] = [];

export const INITIAL_CANDIDATE: CandidateProfile = {
  id: 'cand-01',
  name: '',
  headline: '',
  email: '',
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
  availableFrom: 'Immediately',
  bio: '',
  verifiedSpecialist: false,
  avatarInitials: 'PLM',
  accentColor: 'from-blue-600 to-indigo-600',
  portfolioProjects: [],
};

export const INITIAL_JOBS: Job[] = [];

export const INITIAL_APPLICATIONS: Application[] = [];
