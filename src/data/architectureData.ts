export interface ClientRoleInfo {
  id: 'professional' | 'employer' | 'admin';
  title: string;
  subtitle: string;
  badge: string;
  platforms: string[];
  functions: string[];
  color: string; // hex
  bgColor: string; // tailwind
  borderColor: string;
  textColor: string;
  iconName: string;
}

export interface BackendServiceInfo {
  id: string;
  name: string;
  category: 'Security' | 'User Services' | 'Core Business' | 'Engagement' | 'Infrastructure' | 'Storage';
  endpoint: string;
  protocol: string;
  description: string;
  features: string[];
  accentColor: string;
  iconName: string;
}

export interface DatabaseEntityField {
  name: string;
  type: string;
  isPK?: boolean;
  isFK?: boolean;
  fkTarget?: string;
  description?: string;
}

export interface DatabaseEntity {
  id: string;
  name: string;
  label: string;
  category: 'auth' | 'candidate' | 'employer' | 'job' | 'community' | 'skill';
  color: string;
  description: string;
  fields: DatabaseEntityField[];
  relatedEntities: string[];
}

export interface RoadmapPhase {
  phaseNumber: number;
  title: string;
  tagline: string;
  status: 'In Production' | 'Planned' | 'Under Development' | 'Future Roadmap';
  badgeColor: string;
  accentColor: string;
  iconName: string;
  timeline: string;
  features: string[];
}

export interface TechStackCategory {
  title: string;
  category: string;
  technologies: string[];
  description: string;
  capabilities: string[];
  iconName: string;
  accentColor: string;
}

export const CLIENT_ROLES: ClientRoleInfo[] = [
  {
    id: 'professional',
    title: 'Professional / Candidate',
    subtitle: 'PLM & CAD Specialists',
    badge: 'Role 1',
    platforms: ['Web', 'Mobile'],
    functions: [
      'Profile Creation & Management',
      'Resume Upload (PDF / DOCX)',
      'PLM / CAD Skills Verification',
      'Job Search & 1-Click Apply',
      'Direct Employer Connection'
    ],
    color: '#3B82F6', // Blue
    bgColor: 'bg-blue-950/40',
    borderColor: 'border-blue-500/40',
    textColor: 'text-blue-400',
    iconName: 'User'
  },
  {
    id: 'employer',
    title: 'Employer / Company',
    subtitle: 'Enterprises & Engineering Teams',
    badge: 'Role 2 (With Admin Approval)',
    platforms: ['Web', 'Mobile'],
    functions: [
      'Company Profile & Branding',
      'Post Engineering Jobs',
      'Search Verified Candidates',
      'Manage Candidate Applications',
      'Candidate Interview Pipeline'
    ],
    color: '#10B981', // Green
    bgColor: 'bg-emerald-950/40',
    borderColor: 'border-emerald-500/40',
    textColor: 'text-emerald-400',
    iconName: 'Building2'
  },
  {
    id: 'admin',
    title: 'Admin',
    subtitle: 'Governance & Platform Control',
    badge: 'Role 3 (Governance)',
    platforms: ['Web', 'Mobile'],
    functions: [
      'Review & Approve Employers',
      'Manage User Accounts',
      'Moderate Jobs & Content',
      'Platform Settings & Skills Taxonomy',
      'Analytics & Audit Reports'
    ],
    color: '#F59E0B', // Yellow / Gold
    bgColor: 'bg-amber-950/40',
    borderColor: 'border-amber-500/40',
    textColor: 'text-amber-400',
    iconName: 'ShieldCheck'
  }
];

export const BACKEND_SERVICES: BackendServiceInfo[] = [
  {
    id: 'auth-service',
    name: 'Authentication Service',
    category: 'Security',
    endpoint: '/api/v1/auth',
    protocol: 'REST / HTTPS',
    description: 'Stateless session management, password hashing, JWT token issuance, refresh tokens, and multi-role RBAC authorization.',
    features: ['JWT Authentication', 'Role-Based Access Control (RBAC)', 'Bcrypt Hashing', 'OAuth-Ready Architecture'],
    accentColor: '#3B82F6',
    iconName: 'Key'
  },
  {
    id: 'user-service',
    name: 'User Management Service',
    category: 'User Services',
    endpoint: '/api/v1/users',
    protocol: 'REST / HTTPS',
    description: 'Handles user registration, candidate profiles, verification documents, clearance tracking, and employer profiles.',
    features: ['Professional Profiles', 'Employer Verification Flow', 'Clearance Compliance', 'User Preferences'],
    accentColor: '#0EA5E9',
    iconName: 'Users'
  },
  {
    id: 'job-service',
    name: 'Job Management Service',
    category: 'Core Business',
    endpoint: '/api/v1/jobs',
    protocol: 'REST / HTTPS',
    description: 'High-performance job lifecycle engine: job posting, structured search filters, application submission, and candidate tracking.',
    features: ['Multi-CAD/PLM Filter Query', 'Application Submission (ATS)', 'Candidate Shortlisting', 'Compensation Modeling'],
    accentColor: '#10B981',
    iconName: 'Briefcase'
  },
  {
    id: 'content-service',
    name: 'Content / Community Service',
    category: 'Engagement',
    endpoint: '/api/v1/community',
    protocol: 'REST / HTTPS',
    description: 'Powers technical discussions, engineering articles, company announcements, community updates, and peer knowledge exchange.',
    features: ['Technical Articles', 'Engineering Q&A Forums', 'Company Updates Feed', 'Community Moderation'],
    accentColor: '#A855F7',
    iconName: 'MessageSquare'
  },
  {
    id: 'notification-service',
    name: 'Notification Service',
    category: 'Infrastructure',
    endpoint: '/api/v1/notifications',
    protocol: 'REST / WebSockets',
    description: 'Multi-channel asynchronous event dispatcher orchestrating direct connection events, status alerts, and real-time in-app toasts.',
    features: ['Direct Connection Event Triggers', 'Application Status Triggers', 'Admin Approval Alerts', 'In-App Notifications'],
    accentColor: '#EC4899',
    iconName: 'Bell'
  },
  {
    id: 'storage-service',
    name: 'File Storage Service',
    category: 'Storage',
    endpoint: '/api/v1/storage',
    protocol: 'S3 API / Multi-part',
    description: 'Secure, encrypted cloud file uploads for engineering resumes, company logo assets, credentials, and verification documents.',
    features: ['AWS S3 Presigned URLs', 'Resume PDF/DOCX Validation', 'Company Branding Assets', 'Secure Cloud Storage'],
    accentColor: '#F97316',
    iconName: 'FileText'
  }
];

export const DATABASE_ENTITIES: DatabaseEntity[] = [
  {
    id: 'users',
    name: 'users',
    label: 'Users Core Identity',
    category: 'auth',
    color: '#3B82F6',
    description: 'Central identity table containing primary credentials, system role, account status, and registration timestamp.',
    relatedEntities: ['professional_profiles', 'applications', 'posts', 'user_skills'],
    fields: [
      { name: 'id', type: 'UUID / INT', isPK: true, description: 'Primary Key' },
      { name: 'name', type: 'VARCHAR(255)', description: 'Full user name' },
      { name: 'email', type: 'VARCHAR(255) UNIQUE', description: 'Unique user email' },
      { name: 'password', type: 'VARCHAR(255)', description: 'Bcrypt hashed password' },
      { name: 'role', type: 'ENUM', description: 'professional | employer | admin' },
      { name: 'status', type: 'ENUM', description: 'active | inactive' },
      { name: 'created_at', type: 'TIMESTAMP', description: 'Account creation date' }
    ]
  },
  {
    id: 'professional_profiles',
    name: 'professional_profiles',
    label: 'Professional Profiles',
    category: 'candidate',
    color: '#0EA5E9',
    description: 'Extended candidate profile details containing contact information, experience level, compensation, notice period, and resume link.',
    relatedEntities: ['users', 'user_skills', 'skills'],
    fields: [
      { name: 'id', type: 'UUID / INT', isPK: true, description: 'Primary Key' },
      { name: 'user_id', type: 'UUID / INT', isFK: true, fkTarget: 'users.id', description: 'FK to users table' },
      { name: 'phone', type: 'VARCHAR(50)', description: 'Phone number' },
      { name: 'location', type: 'VARCHAR(255)', description: 'City, State, Country' },
      { name: 'experience', type: 'INT', description: 'Years of PLM/CAD experience' },
      { name: 'current_company', type: 'VARCHAR(255)', description: 'Current employer' },
      { name: 'notice_period', type: 'VARCHAR(50)', description: 'Notice period duration' },
      { name: 'expected_ctc', type: 'VARCHAR(100)', description: 'Compensation expectation' },
      { name: 'resume_url', type: 'VARCHAR(500)', description: 'Cloud resume link (S3)' },
      { name: 'bio', type: 'TEXT', description: 'Professional background & summary' },
      { name: 'created_at', type: 'TIMESTAMP', description: 'Profile creation date' }
    ]
  },
  {
    id: 'skills',
    name: 'skills',
    label: 'Skills Master Taxonomy',
    category: 'skill',
    color: '#06B6D4',
    description: 'Master engineering skills registry categorizing standard PLM platforms, CAD packages, and manufacturing domains.',
    relatedEntities: ['user_skills', 'professional_profiles', 'jobs'],
    fields: [
      { name: 'id', type: 'UUID / INT', isPK: true, description: 'Primary Key' },
      { name: 'name', type: 'VARCHAR(100)', description: 'e.g. Teamcenter, NX, CATIA' },
      { name: 'category', type: 'VARCHAR(50)', description: 'PLM | CAD | CAE | Manufacturing' }
    ]
  },
  {
    id: 'user_skills',
    name: 'user_skills',
    label: 'User Skills Bridge',
    category: 'skill',
    color: '#6366F1',
    description: 'Many-to-many junction table associating candidates with verified skills and declared proficiency ratings.',
    relatedEntities: ['users', 'skills'],
    fields: [
      { name: 'id', type: 'UUID / INT', isPK: true, description: 'Primary Key' },
      { name: 'user_id', type: 'UUID / INT', isFK: true, fkTarget: 'users.id', description: 'FK to users' },
      { name: 'skill_id', type: 'UUID / INT', isFK: true, fkTarget: 'skills.id', description: 'FK to skills' },
      { name: 'proficiency_level', type: 'VARCHAR(50)', description: 'Junior | Mid | Senior | Expert' }
    ]
  },
  {
    id: 'companies',
    name: 'companies',
    label: 'Companies / Employers',
    category: 'employer',
    color: '#10B981',
    description: 'Enterprise employer profiles, company metadata, verification credentials, review status, and website link.',
    relatedEntities: ['jobs', 'applications'],
    fields: [
      { name: 'id', type: 'UUID / INT', isPK: true, description: 'Primary Key' },
      { name: 'name', type: 'VARCHAR(255)', description: 'Company legal / brand name' },
      { name: 'description', type: 'TEXT', description: 'Company overview & industry' },
      { name: 'website', type: 'VARCHAR(255)', description: 'Official corporate website' },
      { name: 'logo_url', type: 'VARCHAR(500)', description: 'Cloud brand logo (S3)' },
      { name: 'industry', type: 'VARCHAR(100)', description: 'Aerospace, Automotive, Defense...' },
      { name: 'location', type: 'VARCHAR(255)', description: 'Headquarters / plant location' },
      { name: 'size', type: 'VARCHAR(50)', description: 'Company size bracket' },
      { name: 'status', type: 'ENUM', description: 'pending | approved | rejected' },
      { name: 'created_at', type: 'TIMESTAMP', description: 'Registration timestamp' }
    ]
  },
  {
    id: 'jobs',
    name: 'jobs',
    label: 'Engineering Job Postings',
    category: 'job',
    color: '#34D399',
    description: 'Engineering role openings created by approved companies, including PLM/CAD requirements, experience brackets, and location.',
    relatedEntities: ['companies', 'applications', 'skills'],
    fields: [
      { name: 'id', type: 'UUID / INT', isPK: true, description: 'Primary Key' },
      { name: 'company_id', type: 'UUID / INT', isFK: true, fkTarget: 'companies.id', description: 'FK to companies' },
      { name: 'title', type: 'VARCHAR(255)', description: 'Role title (e.g. Lead Teamcenter Architect)' },
      { name: 'description', type: 'TEXT', description: 'Responsibilities & requirements' },
      { name: 'location', type: 'VARCHAR(255)', description: 'Remote | Hybrid | Onsite location' },
      { name: 'job_type', type: 'VARCHAR(50)', description: 'Full-Time | Contract | C2C' },
      { name: 'experience_min', type: 'INT', description: 'Minimum years required' },
      { name: 'experience_max', type: 'INT', description: 'Maximum years required' },
      { name: 'skills_required', type: 'TEXT / JSON', description: 'Required PLM/CAD tool stack' },
      { name: 'status', type: 'ENUM', description: 'active | inactive | closed' },
      { name: 'created_at', type: 'TIMESTAMP', description: 'Job creation timestamp' }
    ]
  },
  {
    id: 'applications',
    name: 'applications',
    label: 'Job Applications',
    category: 'job',
    color: '#F59E0B',
    description: 'Tracks job applications, review workflow states (applied, shortlisted, rejected), cover letters, and associated resume files.',
    relatedEntities: ['jobs', 'users', 'companies'],
    fields: [
      { name: 'id', type: 'UUID / INT', isPK: true, description: 'Primary Key' },
      { name: 'job_id', type: 'UUID / INT', isFK: true, fkTarget: 'jobs.id', description: 'FK to jobs' },
      { name: 'user_id', type: 'UUID / INT', isFK: true, fkTarget: 'users.id', description: 'FK to users (candidate)' },
      { name: 'status', type: 'ENUM', description: 'applied | shortlisted | rejected' },
      { name: 'cover_letter', type: 'TEXT', description: 'Candidate introductory note' },
      { name: 'resume_url', type: 'VARCHAR(500)', description: 'Submitted resume version link' },
      { name: 'created_at', type: 'TIMESTAMP', description: 'Application timestamp' }
    ]
  },
  {
    id: 'posts',
    name: 'posts',
    label: 'Community & Content Posts',
    category: 'community',
    color: '#A855F7',
    description: 'Engineering articles, community forum discussions, best practices, and company technology updates.',
    relatedEntities: ['users'],
    fields: [
      { name: 'id', type: 'UUID / INT', isPK: true, description: 'Primary Key' },
      { name: 'user_id', type: 'UUID / INT', isFK: true, fkTarget: 'users.id', description: 'FK to users' },
      { name: 'type', type: 'ENUM', description: 'professional | company' },
      { name: 'title', type: 'VARCHAR(255)', description: 'Article or post headline' },
      { name: 'content', type: 'TEXT', description: 'Markdown / rich text content' },
      { name: 'status', type: 'ENUM', description: 'active | hidden' },
      { name: 'created_at', type: 'TIMESTAMP', description: 'Post timestamp' }
    ]
  }
];

export const ROADMAP_PHASES: RoadmapPhase[] = [
  {
    phaseNumber: 1,
    title: 'Phase 1 — MVP / Core Platform',
    tagline: 'Production Baseline & Core Platform Governance',
    status: 'In Production',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    accentColor: '#3B82F6',
    iconName: 'CheckCircle2',
    timeline: 'Phase 1 (Completed & Operational)',
    features: [
      'Landing page & modern technology showcase',
      '3 role-based login & registration (Candidate, Employer, Admin)',
      'Professional profile creation & resume attachment',
      'Employer registration with strict Admin verification approval flow',
      'Job posting & multi-attribute job search',
      'Direct job application workflow with cover note',
      'Admin governance dashboard for verification & platform metrics'
    ]
  },
  {
    phaseNumber: 2,
    title: 'Phase 2 — Community & Engagement',
    tagline: 'Collaborative Engineering Network & Knowledge Exchange',
    status: 'Under Development',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    accentColor: '#10B981',
    iconName: 'Users',
    timeline: 'Phase 2 (Near-Term)',
    features: [
      'Engineering articles, technical tutorials & discussions',
      'Follow leading PLM & CAD professionals and architects',
      'Company culture, project showcases & engineering posts',
      'Direct connection alerts & status dispatcher',
      'Real-time in-app activity notifications'
    ]
  },
  {
    phaseNumber: 3,
    title: 'Phase 3 — Advanced Features',
    tagline: 'Deep Talent Sourcing & Enterprise Workflow Automation',
    status: 'Planned',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    accentColor: '#F59E0B',
    iconName: 'Zap',
    timeline: 'Phase 3 (Mid-Term)',
    features: [
      'Advanced candidate search & Boolean filtering for employers',
      'Interactive engineering resume builder with standardized CAD/PLM schema',
      'Granular job filters (Clearance, CAD kernel, PLM module, Onsite/Hybrid)',
      'Saved jobs & saved candidate talent pools',
      'Technical PLM/CAD interview prep resources & code test scenarios'
    ]
  },
  {
    phaseNumber: 4,
    title: 'Phase 4 — Ecosystem Expansion',
    tagline: 'Global Training, Industry Events & Monetization',
    status: 'Planned',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    accentColor: '#A855F7',
    iconName: 'Globe',
    timeline: 'Phase 4 (Long-Term)',
    features: [
      'PLM/CAD training & verified certification tracks',
      'Virtual engineering conferences, webinars & OEM tech demos',
      'Expanded tool taxonomies (CAE, Multiphysics, Digital Twin, CAM)',
      'Tiered enterprise subscription plans for employers & staffing agencies'
    ]
  },
  {
    phaseNumber: 5,
    title: 'Phase 5 — AI & Intelligent Engineering',
    tagline: 'Autonomous Matching, Neural Physics & Skill Intelligence',
    status: 'Future Roadmap',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    accentColor: '#06B6D4',
    iconName: 'Sparkles',
    timeline: 'Phase 5 (Future Roadmap)',
    features: [
      'AI-powered candidate-job semantic vector matching',
      'Automated PLM/CAD skill recommendations based on career trajectory',
      'Intelligent job recommendations tailored to verified technical stack',
      'Resume intelligence & automated extraction of CAD modules and certifications',
      'Skill-gap analysis with personalized upskilling pathways',
      'AI-assisted profile creation from CAD portfolios & work history',
      'Engineering knowledge discovery across OEM standard workflows',
      'Career path forecasting for PLM developers & CAD design engineers',
      'Employer candidate intelligence with real-time stack compatibility scoring',
      'Engineering technology trend insights and OEM market adoption tracking'
    ]
  }
];

export const TECH_STACK_ITEMS: TechStackCategory[] = [
  {
    title: 'Frontend Architecture',
    category: 'Client Presentation',
    technologies: ['React 19', 'Vite 8', 'TypeScript', 'Tailwind CSS v4', 'Motion'],
    description: 'Blazing fast single-page application with type-safe state management, role-based interfaces, and responsive layouts.',
    capabilities: [
      'Responsive UI across Desktop, Tablet & Mobile',
      'Role-based dashboards (Candidate, Employer, Admin)',
      'Sub-second route transitions & micro-animations',
      'Modular component architecture & dark tech styling'
    ],
    iconName: 'Layout',
    accentColor: '#3B82F6'
  },
  {
    title: 'Backend Architecture',
    category: 'API & Business Logic',
    technologies: ['Node.js + Express.js', 'Java Spring Boot (Alternative)', 'RESTful Endpoints', 'JWT Auth'],
    description: 'High-throughput stateless API services orchestrating business workflows, role verification, and secure data access.',
    capabilities: [
      'High-performance REST API services',
      'Stateless JWT Authentication & Session tokens',
      'Strict Role-Based Access Control (RBAC) middleware',
      'Structured validation & error handling pipelines'
    ],
    iconName: 'Server',
    accentColor: '#10B981'
  },
  {
    title: 'Database Architecture',
    category: 'Persistent Relational Storage',
    technologies: ['PostgreSQL', 'MySQL', 'Prisma / TypeORM', 'Indexing'],
    description: 'ACID-compliant relational database modeling complex entity relationships, foreign keys, and performant indexes.',
    capabilities: [
      'Normalized schema for Users, Jobs, Companies, Applications',
      'Skills taxonomy & many-to-many junction tables',
      'Transactions for application workflows & approvals',
      'Fast query indexing on status, roles, and skills'
    ],
    iconName: 'Database',
    accentColor: '#0EA5E9'
  },
  {
    title: 'File & Cloud Storage',
    category: 'Unstructured Engineering Assets',
    technologies: ['AWS S3', 'Cloud Storage', 'Presigned URLs', 'CDN'],
    description: 'Scalable object storage infrastructure providing high-availability storage for candidate resumes, logos, and documents.',
    capabilities: [
      'Candidate resume storage (PDF / DOCX)',
      'Employer corporate logos & branding assets',
      'Candidate profile avatars & verification docs',
      'Encrypted at rest with fine-grained access control'
    ],
    iconName: 'HardDrive',
    accentColor: '#F97316'
  },
  {
    title: 'Deployment & DevOps',
    category: 'Infrastructure & CI/CD',
    technologies: ['AWS / DigitalOcean / Azure', 'Nginx Reverse Proxy', 'SSL / HTTPS (Let\'s Encrypt)', 'GitHub Actions CI/CD'],
    description: 'Production-ready cloud deployment with reverse proxy load balancing, SSL termination, and automated testing pipelines.',
    capabilities: [
      'Nginx reverse proxy & load balancer',
      'End-to-end SSL/TLS encryption over HTTPS',
      'Automated GitHub Actions CI/CD deployment pipelines',
      'Zero-downtime rolling updates & environment health checks'
    ],
    iconName: 'Cloud',
    accentColor: '#A855F7'
  }
];

export const PLM_CAD_SKILLS_ECOSYSTEM = {
  plmPlatforms: [
    'Teamcenter',
    'Windchill',
    '3DEXPERIENCE',
    'ENOVIA',
    'Aras Innovator',
    'SAP PLM',
    'Oracle Agile PLM',
    'Autodesk Fusion Manage'
  ],
  cadTools: [
    'Siemens NX',
    'CATIA V5/V6',
    'SOLIDWORKS',
    'PTC Creo',
    'AutoCAD',
    'Autodesk Inventor',
    'Autodesk Fusion',
    'Solid Edge',
    'Onshape'
  ],
  engineeringCompetencies: [
    'GD&T (ASME Y14.5)',
    'Model-Based Definition (MBD)',
    'BOM Management & E-BOM / M-BOM',
    'Engineering Change (ECN/ECO)',
    'Configuration Management (CMII)',
    'Active Workspace (AWC)',
    'FEA Stress Analysis',
    'Digital Twin Integration',
    'Manufacturing Process Planning (MPP)',
    'CAD/CAM 5-Axis Machining',
    'Product Data Migration (ETL)',
    'Quality & CAPA Governance'
  ]
};
