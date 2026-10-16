export interface ServiceDetail {
  slug: string;
  title: string;
  subtitle: string;
  badge: string;
  accentColor: string;
  themeBg: string;
  heroDescription: string;
  overview: string;
  targetAudience: string[];
  supportedPlatforms: string[];
  keyCapabilities: {
    title: string;
    description: string;
  }[];
  deliverables: string[];
  metrics: {
    label: string;
    value: string;
  }[];
  faq: {
    question: string;
    answer: string;
  }[];
  primaryCtaText: string;
  primaryActionRole: 'candidate' | 'employer' | 'contact';
}

export const SERVICE_DETAILS: Record<string, ServiceDetail> = {
  'resource-sourcing': {
    slug: 'resource-sourcing',
    title: 'Resource Sourcing & Matching',
    subtitle: 'Identify and connect with specialized PLM professionals',
    badge: 'Enterprise Staffing',
    accentColor: '#BA3A2C',
    themeBg: 'bg-red-50 text-[#BA3A2C] border-red-200',
    heroDescription: 'We identify, screen, and match PLM and product development professionals to your specific technology, industry, and role requirements.',
    overview: 'Finding true PLM expertise is difficult using general job boards. Our specialized resource sourcing engine connects your enterprise directly with candidates who possess verified experience in your exact PLM platform, reducing time-to-hire and ensuring technical alignment from day one. Say goodbye to irrelevant IT resumes and hello to targeted engineering talent.',
    targetAudience: ['Engineering Directors', 'HR & Talent Acquisition', 'PLM Program Managers'],
    supportedPlatforms: ['Siemens Teamcenter', 'PTC Windchill', 'Dassault 3DEXPERIENCE', 'Aras Innovator'],
    keyCapabilities: [
      { title: 'Precision Matching', description: 'Match candidates based on specific modules like BMIDE, CAD integrations, and workflow configurations.' },
      { title: 'Industry-Specific Sourcing', description: 'Source professionals with domain experience in aerospace, automotive, or medical devices.' },
      { title: 'Direct Engagement', description: 'Bypass recruiting agencies and engage talent directly through our secure platform.' },
      { title: 'Scalable Bench Augmentation', description: 'Source individual experts or assemble complete agile deployment teams on demand.' }
    ],
    deliverables: ['Curated candidate shortlists', 'Direct messaging capabilities', 'Platform-specific competency filtering', 'Zero third-party recruitment markup'],
    metrics: [{ label: 'Specialist Relevancy', value: '98%+' }, { label: 'Time-to-Match', value: '< 48 Hours' }, { label: 'Agency Fees', value: '$0' }],
    faq: [{ question: 'How is this different from LinkedIn?', answer: 'Our platform strictly filters for PLM and engineering software expertise, meaning you won’t have to sift through generic IT or software development profiles.' }],
    primaryCtaText: 'Start Sourcing Talent',
    primaryActionRole: 'employer'
  },
  'vetting-assessment': {
    slug: 'vetting-assessment',
    title: 'Vetting & Capability Assessment',
    subtitle: 'Ensure technical competence before you hire',
    badge: 'Assessment',
    accentColor: '#059669',
    themeBg: 'bg-emerald-50 text-[#059669] border-emerald-200',
    heroDescription: 'Structured technical and consulting assessments so you know a candidate can deliver before they join your program.',
    overview: 'Technical mis-hires in PLM deployments can cost millions in project delays. Our vetting and capability assessment framework provides standardized, rigorous evaluation of a candidate’s hands-on experience, architecture knowledge, and problem-solving skills within specific PLM environments.',
    targetAudience: ['Technical Hiring Managers', 'Enterprise Architects', 'Consulting Firm Partners'],
    supportedPlatforms: ['Siemens Teamcenter', 'PTC Windchill', 'SAP PLM', 'Dassault 3DEXPERIENCE'],
    keyCapabilities: [
      { title: 'Standardized Technical Tests', description: 'Evaluate developers on actual coding and configuration tasks relevant to their platform.' },
      { title: 'Architecture Review Scenarios', description: 'Assess solution architects on scalability, security, and integration design.' },
      { title: 'Consulting Soft Skills', description: 'Evaluate communication and requirement-gathering skills crucial for client-facing roles.' },
      { title: 'Continuous Verification', description: 'Profiles are regularly audited to ensure claimed skills match demonstrated capabilities.' }
    ],
    deliverables: ['Detailed candidate capability scorecards', 'Verified skill badges on profiles', 'Reduced interview rounds for employers', 'Risk-mitigated hiring decisions'],
    metrics: [{ label: 'Technical Accuracy', value: '100%' }, { label: 'Interview Time Saved', value: '60%' }, { label: 'Mis-hire Rate', value: '< 2%' }],
    faq: [{ question: 'Who creates the assessments?', answer: 'Assessments are designed and continually updated by senior PLM solution architects and industry veterans.' }],
    primaryCtaText: 'View Assessed Profiles',
    primaryActionRole: 'employer'
  },
  'profile-search': {
    slug: 'profile-search',
    title: 'Profile & Resume Search',
    subtitle: 'Discover talent by skills, platforms, and industry',
    badge: 'Discovery',
    accentColor: '#4F46E5',
    themeBg: 'bg-indigo-50 text-[#4F46E5] border-indigo-200',
    heroDescription: 'Search curated profiles and resumes of PLM Professionals by skills, platform experience, industry, and availability.',
    overview: 'Our powerful search engine is built specifically for the PLM ecosystem. It allows hiring managers to filter through a dense network of professionals using industry-standard taxonomy, ensuring you find the exact combination of CAD, PLM, and integration experience required for your project.',
    targetAudience: ['Internal Recruiters', 'Engineering Managers', 'System Integrators'],
    supportedPlatforms: ['All Major PLM Stacks', 'Multi-CAD Environments', 'ERP/MES Integrations'],
    keyCapabilities: [
      { title: 'Granular Skill Filters', description: 'Filter by specific versions (e.g., Active Workspace 6.x) and modules (e.g., Change Management).' },
      { title: 'Availability Tracking', description: 'Search for contractors based on their upcoming availability dates and bandwidth.' },
      { title: 'Location & Clearance', description: 'Find professionals meeting specific geographic or security clearance requirements (ITAR, etc.).' },
      { title: 'Saved Searches & Alerts', description: 'Set up automated alerts when new talent matching your exact criteria joins the network.' }
    ],
    deliverables: ['Access to thousands of specialized profiles', 'Advanced Boolean and faceted search', 'Resume download capabilities', 'Organized talent pipelines'],
    metrics: [{ label: 'Search Accuracy', value: 'High' }, { label: 'Active Profiles', value: 'Growing Daily' }, { label: 'Filter Granularity', value: '50+ Attributes' }],
    faq: [{ question: 'Can I search anonymously?', answer: 'Employers can search profiles, but must be verified to send direct connection requests or job invitations.' }],
    primaryCtaText: 'Search Talent Now',
    primaryActionRole: 'employer'
  },
  'professional-profiles': {
    slug: 'professional-profiles',
    title: 'Professional Profiles & Resumes',
    subtitle: 'Showcase your exact PLM expertise to top employers',
    badge: 'Professionals',
    accentColor: '#0284C7',
    themeBg: 'bg-sky-50 text-[#0284C7] border-sky-200',
    heroDescription: 'Individuals create a profile, publish a resume, and make their PLM expertise visible to companies looking for exactly those skills.',
    overview: 'Generic professional networks fail to capture the depth of your PLM expertise. PLMSpider provides a structured profile format that highlights your specific platform knowledge, configuration skills, and industry experience. Your profile acts as a magnet for high-quality, relevant opportunities while keeping your contact details private.',
    targetAudience: ['PLM Developers & Admins', 'Solution Architects', 'Business Analysts', 'Project Managers'],
    supportedPlatforms: ['Teamcenter', 'Windchill', '3DEXPERIENCE', 'Aras', 'SAP PLM', 'Arena'],
    keyCapabilities: [
      { title: 'Structured Taxonomy', description: 'Highlight exact modules, integrations, and CAD tools you excel in using standard industry terms.' },
      { title: 'Privacy Controls', description: 'Keep your email, phone, and current employer hidden until you accept an invitation.' },
      { title: 'Portfolio Showcase', description: 'Detail specific projects, migrations, or implementations you have successfully delivered.' },
      { title: 'Status Management', description: 'Easily toggle your status between "Actively Looking", "Open to Offers", or "Not Available".' }
    ],
    deliverables: ['A specialized digital resume', 'Visibility to top enterprise employers', 'Direct, spam-free job invitations', 'Career progression tracking'],
    metrics: [{ label: 'Profile Setup Time', value: '5 Minutes' }, { label: 'Visibility to Employers', value: 'Immediate' }, { label: 'Privacy', value: '100% Controlled' }],
    faq: [{ question: 'Is my profile public?', answer: 'Your skills and experience are visible to verified employers, but your personal identifying information is masked.' }],
    primaryCtaText: 'Create Your Profile',
    primaryActionRole: 'candidate'
  },
  'opportunity-search': {
    slug: 'opportunity-search',
    title: 'PLM Opportunity Search',
    subtitle: 'Find roles that match your specialized skillset',
    badge: 'Careers',
    accentColor: '#9333EA',
    themeBg: 'bg-purple-50 text-[#9333EA] border-purple-200',
    heroDescription: 'Professionals browse and search open PLM, NPD, and digital transformation roles across industries and geographies.',
    overview: 'Stop sifting through irrelevant IT jobs. Our opportunity search is exclusively dedicated to Product Lifecycle Management, New Product Development, and digital thread initiatives. Every role on our platform is highly relevant, properly categorized, and posted by verified enterprise employers or top-tier consultancies.',
    targetAudience: ['Active Job Seekers', 'Independent Contractors', 'Passive Candidates Exploring Options'],
    supportedPlatforms: ['Global Opportunities', 'Remote & On-Site Roles', 'Permanent & Contract Roles'],
    keyCapabilities: [
      { title: 'Role-Specific Filtering', description: 'Filter by role type: Developer, Architect, Admin, BA, or Program Manager.' },
      { title: 'Contract vs. Permanent', description: 'Easily separate full-time direct hire roles from 1099/C2C contract opportunities.' },
      { title: 'Transparent Compensation', description: 'Access roles with clear salary bands or hourly rate expectations upfront.' },
      { title: 'Direct Application', description: 'Apply directly to the hiring manager’s dashboard with a single click using your PLMSpider profile.' }
    ],
    deliverables: ['Real-time job board access', 'Custom job alerts based on your profile', 'Application status tracking', 'Direct messaging with recruiters'],
    metrics: [{ label: 'Relevance', value: '100% PLM Focused' }, { label: 'Direct Roles', value: 'No Agency Middlemen' }, { label: 'Application Speed', value: '1-Click' }],
    faq: [{ question: 'Are these roles exclusive to PLMSpider?', answer: 'Many enterprise employers post exclusively on our platform to bypass the noise of generic job boards and agency fees.' }],
    primaryCtaText: 'Browse Open Roles',
    primaryActionRole: 'candidate'
  },
  'opportunity-posting': {
    slug: 'opportunity-posting',
    title: 'PLM Opportunity Posting',
    subtitle: 'Reach a targeted audience of qualified professionals',
    badge: 'Hiring',
    accentColor: '#0D9488',
    themeBg: 'bg-teal-50 text-[#0D9488] border-teal-200',
    heroDescription: 'Companies post temporary, contract, or permanent PLM and product development opportunities and reach a targeted audience of qualified professionals.',
    overview: 'Posting a highly specialized PLM role on a general job board often results in hundreds of unqualified applications. By posting on PLMSpider, your requisition is immediately placed in front of a concentrated, active community of PLM experts. Our matching algorithm automatically highlights candidates whose profiles align with your requirements.',
    targetAudience: ['Corporate Talent Acquisition', 'Engineering Department Heads', 'System Integrator Resource Managers'],
    supportedPlatforms: ['Direct Hire Workflows', 'Contractor SOW Management', 'Fractional Advisory Postings'],
    keyCapabilities: [
      { title: 'Targeted Distribution', description: 'Your job is instantly visible to a network of professionals specializing in your exact tech stack.' },
      { title: 'Automated Matching', description: 'Receive immediate recommendations of passive and active candidates who fit your criteria.' },
      { title: 'Flexible Engagement Types', description: 'Post W-2 permanent roles, 1099 contracts, or C2C engagements seamlessly.' },
      { title: 'Applicant Tracking', description: 'Manage incoming applications, review technical scorecards, and communicate securely within the platform.' }
    ],
    deliverables: ['Unlimited job postings for verified employers', 'Automated candidate match lists', 'Secure communication portal', 'Employer brand visibility'],
    metrics: [{ label: 'Audience Quality', value: 'Premium' }, { label: 'Unqualified Spam', value: 'Near Zero' }, { label: 'Cost to Hire', value: 'Significantly Reduced' }],
    faq: [{ question: 'How much does it cost to post a job?', answer: 'Posting requisitions is included with your verified employer account. We do not charge percentage-based placement fees.' }],
    primaryCtaText: 'Post an Opportunity',
    primaryActionRole: 'employer'
  },
  'staffing-strategy': {
    slug: 'staffing-strategy',
    title: 'Team Design & Staffing Strategy',
    subtitle: 'Build the optimal team for your PLM roadmap',
    badge: 'Consulting',
    accentColor: '#EA580C',
    themeBg: 'bg-orange-50 text-orange-600 border-orange-200',
    heroDescription: 'Define the roles, skills, and team structure your PLM program needs, then build the staffing plan to fill them — internally, externally, or blended.',
    overview: 'A successful PLM implementation requires more than just software; it requires the right organizational structure. Our advisory team helps you design the optimal mix of solution architects, developers, business analysts, and change management experts based on your roadmap, budget, and corporate culture.',
    targetAudience: ['CIOs & CTOs', 'VP of Engineering', 'PLM Program Sponsors'],
    supportedPlatforms: ['Enterprise Transformations', 'Cloud Migrations', 'Global Rollouts'],
    keyCapabilities: [
      { title: 'Organizational Blueprinting', description: 'Design a team structure tailored to your specific deployment phase (planning, execution, or sustainment).' },
      { title: 'Make vs. Buy Analysis', description: 'Determine which roles should be full-time internal hires versus external consultants or contractors.' },
      { title: 'Skill Gap Assessment', description: 'Evaluate your current internal team to identify necessary upskilling or external hiring requirements.' },
      { title: 'Budget & Rate Modeling', description: 'Provide accurate market compensation data and consulting rate benchmarks for budget planning.' }
    ],
    deliverables: ['Custom team design blueprint', 'Staffing roadmap and timeline', 'Compensation benchmarking report', 'Actionable hiring plan'],
    metrics: [{ label: 'Strategic Alignment', value: 'Guaranteed' }, { label: 'Cost Efficiency', value: 'Optimized' }, { label: 'Implementation Risk', value: 'Minimized' }],
    faq: [{ question: 'Do you also provide the resources?', answer: 'Yes. Once the strategy is defined, you can seamlessly transition to using our platform to source the exact roles outlined in the plan.' }],
    primaryCtaText: 'Request Staffing Advisory',
    primaryActionRole: 'contact'
  }
};
