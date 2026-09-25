export type UserRole = 'candidate' | 'employer' | 'admin';

export type PLMSystem = 
  | 'Siemens Teamcenter'
  | 'PTC Windchill'
  | 'Dassault 3DEXPERIENCE / ENOVIA'
  | 'Aras Innovator'
  | 'SAP PLM'
  | 'Autodesk Fusion / Upchain'
  | 'Arena PLM'
  | 'Agile PLM';

export type PLMModule = 
  | 'BOM & Part Architecture'
  | 'CAD / MCAD Integration'
  | 'ECAD Integration'
  | 'Engineering Change (ECN/ECO)'
  | 'Active Workspace (AWC)'
  | 'Requirements & MBSE'
  | 'Manufacturing Process (MPP)'
  | 'Quality & CAPA'
  | 'Supplier Collaboration'
  | 'Data Migration & ETL';

export type CADTool = 
  | 'Siemens NX'
  | 'CATIA V5/V6'
  | 'PTC Creo'
  | 'SolidWorks'
  | 'Autodesk Inventor'
  | 'Altium Designer';

export type ClearanceLevel = 'None' | 'ITAR / Export Controlled' | 'Secret' | 'Top Secret';

export type VerificationStatus = 'verified' | 'pending_verification' | 'under_review' | 'rejected';

export interface CandidateProfile {
  id: string;
  name: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  yearsOfExperience: number;
  primaryPLM: PLMSystem;
  secondaryPLMs: PLMSystem[];
  modules: PLMModule[];
  cadTools: CADTool[];
  clearance: ClearanceLevel;
  certifications: string[];
  currentCompany: string;
  currentRole: string;
  expectedCompensation: string;
  availableFrom: string;
  bio: string;
  verifiedSpecialist: boolean;
  avatarInitials: string;
  accentColor: string;
  portfolioProjects: {
    title: string;
    system: string;
    description: string;
    impact: string;
  }[];
}

export interface EmployerProfile {
  id: string;
  companyName: string;
  legalEntity: string;
  corporateDomain: string;
  contactEmail: string;
  adminEmail: string;
  contactPerson: string;
  contactTitle: string;
  industry: 'Aerospace & Defense' | 'Automotive & EV' | 'Medical Technology' | 'Industrial Machinery' | 'Electronics';
  headquarters: string;
  companySize: string;
  website: string;
  primaryPLMStack: PLMSystem[];
  cadEnvironments: CADTool[];
  verificationStatus: VerificationStatus;
  verificationRequestedAt: string;
  verifiedAt?: string;
  rejectionReason?: string;
  taxRegistrationNumber: string;
  verificationDocName?: string;
  about: string;
  logoInitials: string;
  logoBg: string;
}

export interface Job {
  id: string;
  employerId: string;
  employerName: string;
  employerLogoInitials: string;
  employerLogoBg: string;
  isEmployerVerified: boolean;
  title: string;
  primaryPLM: PLMSystem;
  relatedSystems: PLMSystem[];
  requiredModules: PLMModule[];
  cadIntegration: CADTool[];
  experienceLevel: 'Junior (1-3 yrs)' | 'Mid-Senior (4-7 yrs)' | 'Lead / Architect (8+ yrs)' | 'Principal / Director';
  employmentType: 'Full-Time Permanent' | 'Contract (W2/C2C)' | 'Contract-to-Hire';
  workplaceType: 'Remote' | 'Hybrid' | 'Onsite';
  location: string;
  compensation: {
    min: number;
    max: number;
    currency: string;
    period: 'yearly' | 'hourly';
  };
  itarRequired: boolean;
  clearanceRequired: ClearanceLevel;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  postedAt: string;
  status: 'active' | 'pending_verification' | 'closed';
  applicantCount: number;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  employerId: string;
  employerName: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidateHeadline: string;
  candidatePrimaryPLM: PLMSystem;
  candidateExperience: number;
  matchScore: number;
  appliedDate: string;
  coverNote: string;
  resumeFileName: string;
  status: 'applied' | 'screening' | 'technical_interview' | 'offer_extended' | 'archived';
  internalNotes?: string;
}

export interface SimulatedEmail {
  id: string;
  to: string;
  from: string;
  subject: string;
  body: string;
  timestamp: string;
  triggerEvent: 
    | 'employer_registration'
    | 'admin_company_approved'
    | 'admin_company_rejected'
    | 'candidate_applied'
    | 'interview_scheduled';
  read: boolean;
  metadata?: {
    companyId?: string;
    jobId?: string;
    applicantId?: string;
  };
}
