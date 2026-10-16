export type UserRole = 'candidate' | 'employer' | 'admin';

export type PLMSystem = 
  | 'Siemens Teamcenter'
  | 'PTC Windchill'
  | 'Dassault 3DEXPERIENCE / ENOVIA'
  | 'Aras Innovator'
  | 'SAP PLM'
  | 'Autodesk Fusion / Upchain'
  | 'Arena PLM'
  | 'Agile PLM'
  | (string & {});

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
  | 'Data Migration & ETL'
  | (string & {});

export type CADTool = 
  | 'Siemens NX'
  | 'CATIA V5/V6'
  | 'PTC Creo'
  | 'SolidWorks'
  | 'Autodesk Inventor'
  | 'Altium Designer'
  | (string & {});

export type ComplianceLevel = 'None' | 'Industry Certified' | 'Advanced' | 'Expert';

export type VerificationStatus = 'verified' | 'pending_verification' | 'under_review' | 'rejected';

export interface CandidateProfileVisibility {
  contact: boolean;
  platforms: boolean;
  modules: boolean;
  compensation: boolean;
}

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
  complianceLevel: ComplianceLevel;
  certifications: string[];
  currentCompany: string;
  currentRole: string;
  currentCompensation?: string;
  expectedCompensation: string;
  availableFrom: string;
  bio: string;
  verifiedSpecialist: boolean;
  avatarInitials: string;
  accentColor: string;
  resumeFileName?: string;
  resumeUrl?: string;
  profileVisibility?: CandidateProfileVisibility;
  region?: string;
  seniorityLevel?: string;
  employmentTypes?: string[];
  workLocationPreferences?: string[];
  workAuthorization?: string;
  skillsList?: string[];
  platformsList?: string[];
  industriesList?: string[];
  educationList?: string[];
  languagesList?: string[];
  portfolioProjects: {
    title: string;
    system: string;
    description: string;
    impact: string;
  }[];
}

export interface JobInvitation {
  id: string;
  jobId: string;
  jobTitle: string;
  employerId: string;
  employerName: string;
  employerLegalEntity?: string;
  employerCorporateDomain?: string;
  employerTaxNumber?: string;
  candidateId: string;
  candidateName: string;
  candidateHeadline: string;
  proposedCompensation?: string;
  workplaceType?: string;
  location?: string;
  jobSummary: string;
  jobRequirements?: string[];
  invitationNote?: string;
  sentAt: string;
  status: 'pending' | 'accepted' | 'declined';
  respondedAt?: string;
}

export interface EmployerProfile {
  id: string;
  companyName: string;
  legalEntity: string;
  companyType?: string;
  corporateDomain: string;
  contactEmail: string;
  contactPhone?: string;
  adminEmail: string;
  contactPerson: string;
  contactTitle: string;
  linkedInUrl?: string;
  industry: string;
  headquarters: string;
  address?: string;
  operatingLocations?: string[];
  companySize: string;
  yearFounded?: string;
  website: string;
  tagline?: string;
  primaryPLMStack: PLMSystem[];
  cadEnvironments: CADTool[];
  plmTeamSize?: string;
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
  complianceCertRequired: boolean;
  complianceLevelRequired: ComplianceLevel;
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
  resumeUrl?: string;
  status: 'applied' | 'screening' | 'technical_interview' | 'offer_extended' | 'archived';
  internalNotes?: string;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyName?: string;
}

export interface ContactEnquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  topic: string;
  message: string;
  submittedAt: string;
  status: 'new' | 'reviewed' | 'resolved';
}

