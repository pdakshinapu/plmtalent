export interface TechnologyItem {
  id: string;
  name: string;
  company: string;
  category: 'PLM' | 'CAD' | 'CAE' | 'Manufacturing' | 'AI' | 'Cloud' | 'Digital Twin';
  type: 'plm' | 'cad' | 'ecosystem';
  tagline: string;
  description: string;
  accentColor: string; // hex
  accentGlow: string; // rgba
  accentGradient: string; // Tailwind gradient classes
  badgeText: string;
  keyCapabilities: string[];
  supportedFormats?: string[];
  ecosystemRole?: string;
  stats?: { label: string; value: string }[];
}

export interface EcosystemCompany {
  id: string;
  name: string;
  category: 'PLM Platforms' | 'CAD Platforms' | 'Simulation / CAE' | 'Cloud / Infrastructure' | 'Manufacturing Technology' | 'AI / Engineering Computing' | 'Digital Engineering';
  accentColor: string;
  roleDescription: string;
  primaryProducts: string[];
  tier: 'Core PLM/CAD' | 'Strategic Ecosystem Partner' | 'Global Technology Leader';
}

export interface EcosystemDomainNode {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  glow: string;
  iconName: string;
  keyTechnologies: string[];
  description: string;
}

export const ECOSYSTEM_DOMAIN_NODES: EcosystemDomainNode[] = [
  {
    id: 'plm',
    title: 'PLM',
    subtitle: 'Product Lifecycle Management',
    color: '#06b6d4', // Cyan
    glow: 'rgba(6, 182, 212, 0.4)',
    iconName: 'Layers',
    keyTechnologies: ['Teamcenter', 'Windchill', '3DEXPERIENCE', 'Aras Innovator', 'SAP PLM', 'Arena'],
    description: 'Central single source of truth for BOM governance, engineering change orders (ECO/ECN), multi-CAD PDM, and compliance across global product lifecycles.'
  },
  {
    id: 'cad',
    title: 'CAD',
    subtitle: 'Computer-Aided Design',
    color: '#3b82f6', // Electric Blue
    glow: 'rgba(59, 130, 246, 0.4)',
    iconName: 'Box',
    keyTechnologies: ['Siemens NX', 'CATIA', 'SOLIDWORKS', 'Creo', 'AutoCAD', 'Inventor', 'Onshape'],
    description: 'High-precision 3D parametric modeling, Class-A surfacing, large assembly management, and generative geometry generation for aerospace, automotive, and industrial engineering.'
  },
  {
    id: 'cae',
    title: 'CAE / SIMULATION',
    subtitle: 'Finite Element & Physics',
    color: '#a855f7', // Purple
    glow: 'rgba(168, 85, 247, 0.4)',
    iconName: 'Activity',
    keyTechnologies: ['Ansys Mechanical', 'Simulia Abaqus', 'Siemens Simcenter', 'Creo Simulate', 'Autodesk CFD'],
    description: 'Structural FEA, fluid dynamics (CFD), electromagnetic simulation, and virtual stress testing before physical prototyping.'
  },
  {
    id: 'manufacturing',
    title: 'MANUFACTURING',
    subtitle: 'CAM, MES & Shop Floor',
    color: '#10b981', // Emerald Green
    glow: 'rgba(16, 185, 129, 0.4)',
    iconName: 'Cpu',
    keyTechnologies: ['Siemens Tecnomatix', 'Delmia', 'PTC MPMLink', 'Fusion CAM', 'Hexagon CAM'],
    description: 'Multi-axis CNC machining, additive manufacturing toolpaths, assembly line simulation, and manufacturing process planning (MPP).'
  },
  {
    id: 'ai',
    title: 'AI & COMPUTING',
    subtitle: 'Accelerated Engineering AI',
    color: '#f97316', // Orange
    glow: 'rgba(249, 115, 22, 0.4)',
    iconName: 'Sparkles',
    keyTechnologies: ['NVIDIA Omniverse', 'Generative Design AI', 'Neural Physics', 'Autonomous Inspection'],
    description: 'Accelerated GPU computing, generative topology optimization, automated drawing recognition, and real-time physical simulation.'
  },
  {
    id: 'cloud',
    title: 'CLOUD & HPC',
    subtitle: 'Enterprise Infrastructure',
    color: '#ec4899', // Magenta
    glow: 'rgba(236, 72, 153, 0.4)',
    iconName: 'Cloud',
    keyTechnologies: ['AWS for Industrial', 'Microsoft Azure', 'Google Cloud Manufacturing', 'Onshape Cloud'],
    description: 'Secure zero-trust cloud infrastructure, remote GPU workstations, high-performance computing (HPC) clusters, and global CAD collaboration.'
  },
  {
    id: 'digital-twin',
    title: 'DIGITAL TWIN',
    subtitle: 'Connected Industrial IoT',
    color: '#14b8a6', // Teal
    glow: 'rgba(20, 184, 166, 0.4)',
    iconName: 'Radio',
    keyTechnologies: ['PTC ThingWorx', 'Siemens MindSphere', '3DS Virtual Twin', 'Bentley iTwin'],
    description: 'Real-time telemetry streaming from physical operating equipment back into PLM engineering models for predictive maintenance and closed-loop quality.'
  }
];

export const PLM_PLATFORMS: TechnologyItem[] = [
  {
    id: 'teamcenter',
    name: 'Teamcenter',
    company: 'Siemens',
    category: 'PLM',
    type: 'plm',
    tagline: 'World-Leading Enterprise PLM & Digital Thread Backbone',
    description: 'The premier enterprise PLM system connecting people, processes, and systems across the global lifecycle. Features Active Workspace (AWC) for frictionless browser and mobile collaboration.',
    accentColor: '#06b6d4',
    accentGlow: 'rgba(6, 182, 212, 0.45)',
    accentGradient: 'from-cyan-500 to-blue-600',
    badgeText: 'Enterprise PLM',
    keyCapabilities: [
      'Active Workspace (AWC)',
      'Multi-CAD BOM Architecture',
      'Engineering Change (ECN/ECO)',
      'Systems Engineering & MBSE',
      'Teamcenter X Cloud'
    ],
    supportedFormats: ['JT', 'STEP AP242', 'NX PRT', 'CATPart', 'DWG'],
    stats: [
      { label: 'Ecosystem Share', value: '38%' },
      { label: 'Active Deployments', value: '10K+' }
    ]
  },
  {
    id: 'windchill',
    name: 'Windchill',
    company: 'PTC',
    category: 'PLM',
    type: 'plm',
    tagline: 'Robust IoT-Ready PLM for Complex Product Architectures',
    description: 'PTC Windchill delivers enterprise digital thread traceability, deep multi-CAD data management, and seamless integration with ThingWorx Industrial IoT and augmented reality.',
    accentColor: '#10b981',
    accentGlow: 'rgba(16, 185, 129, 0.45)',
    accentGradient: 'from-emerald-500 to-teal-600',
    badgeText: 'Product Lifecycle Management',
    keyCapabilities: [
      'Digital Thread Traceability',
      'MPMLink Manufacturing PLM',
      'Parts Classification & Re-use',
      'ThingWorx IoT Integration',
      'Windchill+ SaaS Edition'
    ],
    supportedFormats: ['Creo PRT/ASM', 'STEP', 'SOLIDWORKS', 'PDF 3D'],
    stats: [
      { label: 'IoT Integrated', value: '100%' },
      { label: 'Global Engineers', value: '1.5M+' }
    ]
  },
  {
    id: '3dexperience-enovia',
    name: '3DEXPERIENCE / ENOVIA',
    company: 'Dassault Systèmes',
    category: 'PLM',
    type: 'plm',
    tagline: 'Collaborative Business Platform & Virtual Twin Governance',
    description: 'Empowers global enterprises to transform innovation into virtual reality. ENOVIA on the 3DEXPERIENCE platform orchestrates product definition, governance, and model-based enterprise workflows.',
    accentColor: '#3b82f6',
    accentGlow: 'rgba(59, 130, 246, 0.45)',
    accentGradient: 'from-blue-500 to-indigo-600',
    badgeText: '3DExperience / PLM',
    keyCapabilities: [
      'Virtual Twin Experience',
      'Collaborative Industry Innovator',
      'Direct CATIA V5/V6 Integration',
      'Program & Portfolio Governance',
      'Multi-Discipline Engineering'
    ],
    supportedFormats: ['3DXML', 'CATPart', 'STEP AP242', 'IGES'],
    stats: [
      { label: 'Aerospace & Auto', value: 'Tier 1' },
      { label: 'Collaborative Apps', value: '120+' }
    ]
  },
  {
    id: 'aras-innovator',
    name: 'Aras Innovator',
    company: 'Aras',
    category: 'PLM',
    type: 'plm',
    tagline: 'Resilient, Open-Architecture Enterprise PLM Platform',
    description: 'An adaptable low-code platform for digital thread creation, complex variant management, and customized lifecycle workflows with an open data model and subscription upgrades.',
    accentColor: '#f97316',
    accentGlow: 'rgba(249, 115, 22, 0.45)',
    accentGradient: 'from-orange-500 to-amber-600',
    badgeText: 'Enterprise Open PLM',
    keyCapabilities: [
      'Low-Code Resilient Platform',
      'Flexible Model-Based Architecture',
      'Configurable Digital Thread',
      'Engineering Change & Quality',
      'Seamless Upgrade Guarantee'
    ],
    supportedFormats: ['STEP', 'JT', 'Parasolid', 'DXF/DWG'],
    stats: [
      { label: 'Adaptability Score', value: '99%' },
      { label: 'Open Data Model', value: '100%' }
    ]
  },
  {
    id: 'sap-plm',
    name: 'SAP PLM',
    company: 'SAP',
    category: 'PLM',
    type: 'plm',
    tagline: 'Seamless Enterprise Lifecycle & Supply Chain Unification',
    description: 'Bridges engineering design directly with SAP S/4HANA enterprise resources, digital supply chains, manufacturing operations, and global regulatory compliance.',
    accentColor: '#0ea5e9',
    accentGlow: 'rgba(14, 165, 233, 0.45)',
    accentGradient: 'from-sky-500 to-blue-700',
    badgeText: 'Enterprise Lifecycle Management',
    keyCapabilities: [
      'SAP S/4HANA Core Integration',
      'Engineering Control Center (ECTR)',
      'Integrated Product Development',
      'Product Compliance & ESG Tracking',
      'Asset Lifecycle Management'
    ],
    supportedFormats: ['SAP Document Mgt', 'STEP', 'JT', 'PDF'],
    stats: [
      { label: 'ERP Synchronization', value: 'Real-time' },
      { label: 'Enterprise Base', value: 'Fortune 500' }
    ]
  },
  {
    id: 'oracle-agile',
    name: 'Oracle Agile PLM',
    company: 'Oracle',
    category: 'PLM',
    type: 'plm',
    tagline: 'High-Velocity Value Chain Execution & Quality Governance',
    description: 'A proven enterprise solution for cross-functional product collaboration, quality control (CAPA), environmental governance, and supply chain cost management.',
    accentColor: '#ef4444',
    accentGlow: 'rgba(239, 68, 68, 0.45)',
    accentGradient: 'from-red-500 to-rose-700',
    badgeText: 'Agile PLM & Supply Chain',
    keyCapabilities: [
      'Product Collaboration (PC)',
      'Product Quality Mgt (PQM)',
      'Enterprise Governance & Compliance',
      'Product Cost Management',
      'Oracle Cloud PLM Migration'
    ],
    supportedFormats: ['STEP', 'IGES', 'Neutral BOM XML', 'IDF'],
    stats: [
      { label: 'Compliance Focus', value: 'High' },
      { label: 'Quality Automation', value: 'CAPA' }
    ]
  },
  {
    id: 'arena-plm',
    name: 'Arena PLM',
    company: 'PTC',
    category: 'PLM',
    type: 'plm',
    tagline: 'Cloud-Native PLM & Quality Management for High-Tech Innovators',
    description: 'A pure multi-tenant cloud PLM solution unifying complex bill of materials, engineering changes, and quality management (QMS) across distributed electronics and medtech suppliers.',
    accentColor: '#14b8a6',
    accentGlow: 'rgba(20, 184, 166, 0.45)',
    accentGradient: 'from-teal-500 to-emerald-600',
    badgeText: 'Cloud PLM & QMS',
    keyCapabilities: [
      '100% Multi-Tenant Cloud Architecture',
      'Integrated QMS (CAPA, DMR, DHF)',
      'Direct Component & Supplier Portals',
      'Rapid High-Tech NPI Launches',
      'Medical Device 21 CFR Part 11'
    ],
    supportedFormats: ['Altium SCH/PCB', 'STEP', 'Gerber', 'BOM CSV'],
    stats: [
      { label: 'Deployment Time', value: 'Weeks' },
      { label: 'Supply Chain Nodes', value: '50K+' }
    ]
  },
  {
    id: 'fusion-manage',
    name: 'Autodesk Fusion Manage',
    company: 'Autodesk',
    category: 'PLM',
    type: 'plm',
    tagline: 'Modern Cloud PLM Automating Engineering Workflows & NPI',
    description: 'Cloud-based PLM that streamlines new product introduction (NPI), supplier collaboration, and change order management (ECO), connecting seamlessly with Autodesk Fusion and Inventor.',
    accentColor: '#8b5cf6',
    accentGlow: 'rgba(139, 92, 246, 0.45)',
    accentGradient: 'from-violet-500 to-purple-700',
    badgeText: 'Cloud PLM & Workflow',
    keyCapabilities: [
      'Intuitive Workflow Automation',
      'Cloud New Product Introduction (NPI)',
      'Supplier Quality & Audits',
      'Direct Fusion & Inventor Integration',
      'Cost Rollup & Variant Tracking'
    ],
    supportedFormats: ['Fusion F3D', 'Inventor IPT', 'DWG', 'STEP'],
    stats: [
      { label: 'Cloud Availability', value: '99.9%' },
      { label: 'Time-to-Value', value: 'Fast' }
    ]
  }
];

export const CAD_TOOLS: TechnologyItem[] = [
  {
    id: 'siemens-nx',
    name: 'NX',
    company: 'Siemens',
    category: 'CAD',
    type: 'cad',
    tagline: 'Next-Generation High-End CAD / CAM / CAE Powerhouse',
    description: 'The benchmark for high-performance industrial design, complex aerospace surfacing, convergent modeling, and integrated multi-axis CNC manufacturing.',
    accentColor: '#06b6d4',
    accentGlow: 'rgba(6, 182, 212, 0.45)',
    accentGradient: 'from-cyan-500 to-blue-600',
    badgeText: 'Advanced High-End CAD / CAM / CAE',
    keyCapabilities: [
      'Synchronous Technology',
      'Convergent Modeling (Facet + B-Rep)',
      'Advanced Generative Design',
      'Integrated Additive & 5-Axis CAM',
      'Continuous Release Model'
    ],
    supportedFormats: ['PRT', 'JT', 'Parasolid X_T', 'STEP AP242'],
    stats: [
      { label: 'Geometry Kernel', value: 'Parasolid' },
      { label: 'Industry Tier', value: 'Aerospace / Auto' }
    ]
  },
  {
    id: 'catia',
    name: 'CATIA',
    company: 'Dassault Systèmes',
    category: 'CAD',
    type: 'cad',
    tagline: 'The Global Gold Standard for Complex Surfaces & Aerospace Systems',
    description: 'Pioneering 3D CAD design software used by the world’s leading aerospace, automotive, and defense OEMs for Class-A surfacing, composite materials, and systems architecture.',
    accentColor: '#3b82f6',
    accentGlow: 'rgba(59, 130, 246, 0.45)',
    accentGradient: 'from-blue-500 to-indigo-700',
    badgeText: 'Aerospace & Automotive CAD/CAM',
    keyCapabilities: [
      'Class-A Aesthetic Surfacing (ICEM Surf)',
      'Model-Based Systems Engineering (MBSE)',
      'Composites Design & Analysis',
      'Electrical Harness & Fluid Routing',
      '3DEXPERIENCE Native Integration'
    ],
    supportedFormats: ['CATPart', 'CATProduct', '3DXML', 'STEP', 'IGES'],
    stats: [
      { label: 'Global Aerospace', value: '#1 Choice' },
      { label: 'Surface Precision', value: 'G3 Curvature' }
    ]
  },
  {
    id: 'solidworks',
    name: 'SOLIDWORKS',
    company: 'Dassault Systèmes',
    category: 'CAD',
    type: 'cad',
    tagline: 'The World’s Most Popular 3D Mechanical Engineering Suite',
    description: 'Intuitive, powerful 3D design software trusted by millions of engineers for rapid mechanical prototyping, complex sheet metal, weldments, and connected PDM.',
    accentColor: '#f43f5e',
    accentGlow: 'rgba(244, 63, 94, 0.45)',
    accentGradient: 'from-rose-500 to-red-700',
    badgeText: '3D Mechanical CAD & Design',
    keyCapabilities: [
      'Intuitive Parametric Feature Modeling',
      'Advanced Sheet Metal & Weldments',
      'Large Assembly Review & Defeature',
      'Integrated Stress & Motion Simulation',
      'Cloud Connected 3DEXPERIENCE Works'
    ],
    supportedFormats: ['SLDPRT', 'SLDASM', 'Parasolid', 'STEP AP214/242'],
    stats: [
      { label: 'Active Users', value: '6M+' },
      { label: 'Part Libraries', value: 'Vast' }
    ]
  },
  {
    id: 'creo',
    name: 'Creo',
    company: 'PTC',
    category: 'CAD',
    type: 'cad',
    tagline: 'Parametric 3D CAD with Real-Time Ansys Simulation & Generative AI',
    description: 'The foundation of parametric modeling, upgraded with real-time simulation (Creo Simulation Live powered by Ansys), generative design, additive manufacturing, and multi-CAD Creo Unite technology.',
    accentColor: '#10b981',
    accentGlow: 'rgba(16, 185, 129, 0.45)',
    accentGradient: 'from-emerald-500 to-green-700',
    badgeText: 'Parametric 3D CAD',
    keyCapabilities: [
      'Creo Unite Multi-CAD Collaboration',
      'Creo Simulation Live (Real-Time FEA)',
      'Generative Topology Optimization',
      'Model-Based Definition (MBD / GD&T)',
      'Direct Windchill PDM Integration'
    ],
    supportedFormats: ['PRT', 'ASM', 'Granite', 'STEP', 'JT'],
    stats: [
      { label: 'Simulation Speed', value: 'Instantaneous' },
      { label: 'Parametric Engine', value: 'Industry Pioneer' }
    ]
  },
  {
    id: 'autocad',
    name: 'AutoCAD',
    company: 'Autodesk',
    category: 'CAD',
    type: 'cad',
    tagline: 'The Universal Precision 2D Drafting & 3D Documentation Standard',
    description: 'The essential CAD software that established modern digital drafting. Trusted worldwide for 2D drafting precision, specialized industry toolsets, and ubiquitous DWG format fidelity.',
    accentColor: '#f59e0b',
    accentGlow: 'rgba(245, 158, 11, 0.45)',
    accentGradient: 'from-amber-500 to-orange-600',
    badgeText: '2D/3D Precision Drafting & Design',
    keyCapabilities: [
      'Gold-Standard DWG Technology',
      'Mechanical & Electrical Toolsets',
      'Parametric Geometric Constraints',
      'AutoLISP & Custom Script Automation',
      'Cross-Platform Web & Mobile Access'
    ],
    supportedFormats: ['DWG', 'DXF', 'DGN', 'PDF Vector'],
    stats: [
      { label: 'Global Standard', value: 'DWG Format' },
      { label: 'Industry Legacy', value: '40+ Years' }
    ]
  },
  {
    id: 'autodesk-inventor',
    name: 'Autodesk Inventor',
    company: 'Autodesk',
    category: 'CAD',
    type: 'cad',
    tagline: 'Professional-Grade 3D Mechanical Design & Rules-Based Automation',
    description: 'Comprehensive 3D mechanical CAD software providing advanced sheet metal design, frame generation, cable/harness routing, and iLogic design automation.',
    accentColor: '#6366f1',
    accentGlow: 'rgba(99, 102, 241, 0.45)',
    accentGradient: 'from-indigo-500 to-blue-700',
    badgeText: 'Mechanical Design & 3D CAD',
    keyCapabilities: [
      'iLogic Rules-Based Design Automation',
      'Frame Generator & Tube/Pipe Routing',
      'Integrated FEA Stress Analysis',
      'AnyCAD Interoperability Engine',
      'Direct Vault PDM Synchronization'
    ],
    supportedFormats: ['IPT', 'IAM', 'STEP', 'SAT', 'IGES'],
    stats: [
      { label: 'Design Automation', value: 'iLogic Built-in' },
      { label: 'CAD Interop', value: 'AnyCAD Multi-Format' }
    ]
  },
  {
    id: 'autodesk-fusion',
    name: 'Fusion',
    company: 'Autodesk',
    category: 'CAD',
    type: 'cad',
    tagline: 'All-in-One Cloud CAD, Generative AI, CAM Machining & ECAD',
    description: 'Unified cloud platform connecting CAD, CAM (up to 5-axis machining), CAE simulation, generative design, and ECAD electronics PCB development in a single collaborative environment.',
    accentColor: '#8b5cf6',
    accentGlow: 'rgba(139, 92, 246, 0.45)',
    accentGradient: 'from-violet-500 to-purple-600',
    badgeText: 'Cloud 3D CAD / CAM / CAE / PCB',
    keyCapabilities: [
      'Integrated 2.5D to 5-Axis CAM',
      'AI Generative Design Algorithms',
      'Native Unified ECAD & MCAD PCB Co-Design',
      'Cloud Version Control & Markup',
      'Thermal & Non-Linear Stress FEA'
    ],
    supportedFormats: ['F3D', 'STEP', 'IGES', 'OBJ', 'EAGLE BRD'],
    stats: [
      { label: 'Cloud Compute', value: 'Unlimited HPC' },
      { label: 'Disciplines', value: 'CAD + CAM + PCB' }
    ]
  },
  {
    id: 'solid-edge',
    name: 'Solid Edge',
    company: 'Siemens',
    category: 'CAD',
    type: 'cad',
    tagline: 'Agile 3D CAD Powered by Synchronous Direct & Parametric Modeling',
    description: 'Combining the speed and flexibility of direct modeling with the control of parametric design through Siemens proprietary Synchronous Technology, with built-in data management.',
    accentColor: '#14b8a6',
    accentGlow: 'rgba(20, 184, 166, 0.45)',
    accentGradient: 'from-teal-500 to-cyan-700',
    badgeText: 'Synchronous Technology 3D CAD',
    keyCapabilities: [
      'Patented Synchronous Technology',
      'Best-in-Class Sheet Metal Design',
      'Subdivision Surfacing for Ergonomics',
      'Reverse Engineering & Mesh Editing',
      'Scalable Teamcenter Integration'
    ],
    supportedFormats: ['PAR', 'ASM', 'Parasolid', 'STEP', 'JT'],
    stats: [
      { label: 'Modelling Speed', value: '10x Faster Edits' },
      { label: 'Geometry Kernel', value: 'Parasolid' }
    ]
  },
  {
    id: 'onshape',
    name: 'Onshape',
    company: 'PTC',
    category: 'CAD',
    type: 'cad',
    tagline: 'Pure Cloud-Native 3D CAD with Built-In Agile PDM & Real-Time Collaboration',
    description: 'Zero-install, browser-based 3D CAD platform with real-time multi-user simultaneous editing, integrated branching and merging version control, and custom FeatureScript programming.',
    accentColor: '#0ea5e9',
    accentGlow: 'rgba(14, 165, 233, 0.45)',
    accentGradient: 'from-sky-500 to-blue-600',
    badgeText: 'Cloud-Native Agile 3D CAD & PDM',
    keyCapabilities: [
      'Zero-Install 100% Web Browser CAD',
      'Multi-User Simultaneous Co-Modeling',
      'Git-Like Branching & Merging PDM',
      'FeatureScript Parametric Customization',
      'Live Analytics & Admin Governance'
    ],
    supportedFormats: ['Cloud-Native', 'STEP', 'Parasolid', 'IGES', 'STL'],
    stats: [
      { label: 'Installation Time', value: '0 seconds' },
      { label: 'Data Loss Risk', value: 'Zero (Continuous Save)' }
    ]
  }
];

export const ECOSYSTEM_COMPANIES: EcosystemCompany[] = [
  {
    id: 'siemens',
    name: 'Siemens Digital Industries Software',
    category: 'PLM Platforms',
    accentColor: '#00646E',
    roleDescription: 'Global industrial software giant behind the Xcelerator portfolio, Teamcenter PLM, NX CAD, Tecnomatix, and Parasolid kernel.',
    primaryProducts: ['Teamcenter', 'NX', 'Solid Edge', 'Tecnomatix', 'Simcenter'],
    tier: 'Core PLM/CAD'
  },
  {
    id: 'ptc',
    name: 'PTC',
    category: 'PLM Platforms',
    accentColor: '#00843D',
    roleDescription: 'Pioneers in digital thread engineering, Windchill PLM, Creo parametric CAD, Arena cloud PLM, and ThingWorx Industrial IoT.',
    primaryProducts: ['Windchill', 'Creo', 'Arena PLM', 'Onshape', 'ThingWorx'],
    tier: 'Core PLM/CAD'
  },
  {
    id: 'dassault',
    name: 'Dassault Systèmes',
    category: 'PLM Platforms',
    accentColor: '#00539B',
    roleDescription: 'The 3DEXPERIENCE Company, world leader in 3D design software, digital mock-up, and virtual twin experiences.',
    primaryProducts: ['3DEXPERIENCE', 'CATIA', 'SOLIDWORKS', 'ENOVIA', 'DELMIA', 'SIMULIA'],
    tier: 'Core PLM/CAD'
  },
  {
    id: 'autodesk',
    name: 'Autodesk',
    category: 'CAD Platforms',
    accentColor: '#0696D7',
    roleDescription: 'Design and make technology leader providing AutoCAD, Inventor, Fusion, and Fusion Manage cloud PLM across manufacturing and architecture.',
    primaryProducts: ['AutoCAD', 'Inventor', 'Fusion', 'Fusion Manage', 'Vault'],
    tier: 'Core PLM/CAD'
  },
  {
    id: 'sap',
    name: 'SAP',
    category: 'PLM Platforms',
    accentColor: '#008FD3',
    roleDescription: 'Enterprise business suite leader integrating product development directly into global ERP, S/4HANA, and resilient supply chains.',
    primaryProducts: ['SAP PLM', 'Engineering Control Center (ECTR)', 'S/4HANA Enterprise'],
    tier: 'Strategic Ecosystem Partner'
  },
  {
    id: 'oracle',
    name: 'Oracle',
    category: 'PLM Platforms',
    accentColor: '#C74634',
    roleDescription: 'Enterprise cloud database and application leader delivering Agile PLM governance, quality management, and Oracle Fusion Cloud SCM.',
    primaryProducts: ['Oracle Agile PLM', 'Oracle Fusion Cloud PLM', 'Oracle Cloud Infrastructure'],
    tier: 'Strategic Ecosystem Partner'
  },
  {
    id: 'aras',
    name: 'Aras',
    category: 'PLM Platforms',
    accentColor: '#E43D30',
    roleDescription: 'Provider of resilient, open-architecture PLM software empowering global manufacturers to solve complex digital thread challenges.',
    primaryProducts: ['Aras Innovator', 'Aras Low-Code Platform', 'Aras Enterprise SaaS'],
    tier: 'Core PLM/CAD'
  },
  {
    id: 'nvidia',
    name: 'NVIDIA',
    category: 'AI / Engineering Computing',
    accentColor: '#76B900',
    roleDescription: 'Global leader in accelerated computing, AI GPUs, RTX engineering visualization, and the NVIDIA Omniverse platform for industrial digital twins.',
    primaryProducts: ['NVIDIA Omniverse', 'RTX Ada Generation GPUs', 'CUDA Engineering Acceleration', 'PhysicsNeRF'],
    tier: 'Global Technology Leader'
  },
  {
    id: 'ansys',
    name: 'Ansys',
    category: 'Simulation / CAE',
    accentColor: '#FFB71B',
    roleDescription: 'The global standard for engineering simulation software, multiphysics modeling, finite element analysis (FEA), and computational fluid dynamics (CFD).',
    primaryProducts: ['Ansys Mechanical', 'Ansys Fluent', 'Ansys HFSS', 'Ansys Discovery'],
    tier: 'Strategic Ecosystem Partner'
  },
  {
    id: 'hexagon',
    name: 'Hexagon',
    category: 'Manufacturing Technology',
    accentColor: '#00857C',
    roleDescription: 'Global leader in digital reality solutions, sensor technologies, precision metrology, autonomous manufacturing systems, and CAD/CAM.',
    primaryProducts: ['VISI CAD/CAM', 'ESPRIT', 'Hexagon Metrology', 'Nexus Platform'],
    tier: 'Strategic Ecosystem Partner'
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    category: 'Cloud / Infrastructure',
    accentColor: '#00A4EF',
    roleDescription: 'Powering cloud PLM and industrial transformation with Microsoft Azure, high-performance cloud computing (HPC), and enterprise AI copilots.',
    primaryProducts: ['Azure for Manufacturing', 'Azure HPC Clusters', 'Microsoft Copilot for Engineers'],
    tier: 'Global Technology Leader'
  },
  {
    id: 'aws',
    name: 'AWS',
    category: 'Cloud / Infrastructure',
    accentColor: '#FF9900',
    roleDescription: 'The world’s most comprehensive cloud platform, delivering AWS for Industrial, secure remote engineering workspaces, and scalable PLM hosting.',
    primaryProducts: ['AWS for Industrial', 'Amazon EC2 G5/G6 Instances', 'AWS IoT TwinMaker'],
    tier: 'Global Technology Leader'
  },
  {
    id: 'google-cloud',
    name: 'Google Cloud',
    category: 'Cloud / Infrastructure',
    accentColor: '#4285F4',
    roleDescription: 'Delivering hyperscale cloud infrastructure, Google Manufacturing Data Engine, BigQuery analytics, and Vertex AI for industrial engineering.',
    primaryProducts: ['Manufacturing Data Engine', 'Vertex AI', 'Google Cloud HPC'],
    tier: 'Global Technology Leader'
  },
  {
    id: 'bentley',
    name: 'Bentley Systems',
    category: 'Digital Engineering',
    accentColor: '#0072C6',
    roleDescription: 'Infrastructure engineering software company providing MicroStation, ProjectWise, and the iTwin platform for infrastructure digital twins.',
    primaryProducts: ['iTwin Platform', 'ProjectWise', 'MicroStation', 'AssetWise'],
    tier: 'Strategic Ecosystem Partner'
  },
  {
    id: 'bosch',
    name: 'Bosch',
    category: 'Manufacturing Technology',
    accentColor: '#E20015',
    roleDescription: 'Global industrial engineering and technology powerhouse pioneering connected Industry 4.0 manufacturing solutions and smart IoT devices.',
    primaryProducts: ['Bosch Connected Industry', 'Nexeed Industrial Suite', 'Smart Factory Automation'],
    tier: 'Strategic Ecosystem Partner'
  }
];
