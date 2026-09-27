import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

// SIEMENS - Iconic geometric wordmark and teal accent
export const SiemensLogo: React.FC<LogoProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="100" height="100" rx="18" fill="#00646E" fillOpacity="0.18" />
    <path d="M22 62C22 67.5 26.5 72 32 72H68C73.5 72 78 67.5 78 62C78 54 69 50 60 48C51 46 44 43 44 38C44 33.6 47.6 30 52 30H68C72 30 75 32 76 35" stroke="#00A3A6" strokeWidth="6.5" strokeLinecap="round" />
    <path d="M78 38C78 32.5 73.5 28 68 28H32C26.5 28 22 32.5 22 38C22 46 31 50 40 52C49 54 56 57 56 62C56 66.4 52.4 70 48 70H32C28 70 25 68 24 65" stroke="#00646E" strokeWidth="4" strokeLinecap="round" />
    <circle cx="50" cy="50" r="44" stroke="#00A3A6" strokeWidth="1.5" strokeDasharray="4 4" strokeOpacity="0.4" />
  </svg>
);

// PTC - Signature green connected hexagon rings
export const PtcLogo: React.FC<LogoProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="100" height="100" rx="18" fill="#00843D" fillOpacity="0.18" />
    {/* Left ring */}
    <path d="M42 30H28C22.5 30 18 34.5 18 40V60C18 65.5 22.5 70 28 70H42C47.5 70 52 65.5 52 60V54H34V46H52V40C52 34.5 47.5 30 42 30Z" fill="#00843D" />
    {/* Interlocking Right ring */}
    <path d="M58 70H72C77.5 70 82 65.5 82 60V40C82 34.5 77.5 30 72 30H58C52.5 30 48 34.5 48 40V46H66V54H48V60C48 65.5 52.5 70 58 70Z" fill="#10B981" />
  </svg>
);

// DASSAULT SYSTÈMES - Iconic 3D Compass & 3DS monogram
export const DassaultLogo: React.FC<LogoProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="100" height="100" rx="18" fill="#00539B" fillOpacity="0.18" />
    {/* Compass Ring */}
    <circle cx="50" cy="50" r="32" stroke="#2563EB" strokeWidth="3" strokeDasharray="3 3" />
    {/* Compass North Arrow in vibrant blue */}
    <path d="M50 20L60 48L50 44L40 48L50 20Z" fill="#3B82F6" />
    {/* Compass South in dark slate blue */}
    <path d="M50 80L40 52L50 56L60 52L50 80Z" fill="#1E3A8A" />
    {/* 3D East-West markers */}
    <path d="M80 50L52 60L56 50L52 40L80 50Z" fill="#60A5FA" />
    <path d="M20 50L48 40L44 50L48 60L20 50Z" fill="#1D4ED8" />
    <circle cx="50" cy="50" r="4" fill="#FFFFFF" />
  </svg>
);

// AUTODESK - The modern folded origami ribbon 'A'
export const AutodeskLogo: React.FC<LogoProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="100" height="100" rx="18" fill="#0696D7" fillOpacity="0.18" />
    {/* Folded origami ribbon segments */}
    <path d="M24 74L44 26L64 74H52L44 54L36 74H24Z" fill="#0284C7" />
    <path d="M44 26L64 74H76L52 18L44 26Z" fill="#38BDF8" />
    <path d="M34 58H54L48 44H40L34 58Z" fill="#0369A1" />
  </svg>
);

// SAP - The classic enterprise trapezoid badge
export const SapLogo: React.FC<LogoProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="100" height="100" rx="18" fill="#008FD3" fillOpacity="0.18" />
    {/* SAP Trapezoid */}
    <path d="M18 32H82L68 68H18V32Z" fill="url(#sapGrad)" />
    <text x="40" y="56" fill="#FFFFFF" fontSize="20" fontWeight="900" fontFamily="sans-serif" letterSpacing="1">SAP</text>
    <defs>
      <linearGradient id="sapGrad" x1="18" y1="32" x2="82" y2="68" gradientUnits="userSpaceOnUse">
        <stop stopColor="#008FD3" />
        <stop offset="1" stopColor="#005A9C" />
      </linearGradient>
    </defs>
  </svg>
);

// ORACLE - Signature red oval stadium ring
export const OracleLogo: React.FC<LogoProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="100" height="100" rx="18" fill="#C74634" fillOpacity="0.18" />
    {/* Oracle Red Oval */}
    <path d="M36 34C24 34 16 41 16 50C16 59 24 66 36 66H64C76 66 84 59 84 50C84 41 76 34 64 34H36ZM36 43H64C70 43 74 46 74 50C74 54 70 57 64 57H36C30 57 26 54 26 50C26 46 30 43 36 43Z" fill="#EF4444" />
  </svg>
);

// ARAS - Modern geometric diamond / prism motif
export const ArasLogo: React.FC<LogoProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="100" height="100" rx="18" fill="#E43D30" fillOpacity="0.18" />
    <path d="M50 18L80 50L50 82L20 50L50 18Z" stroke="#F97316" strokeWidth="6" fill="#EA580C" fillOpacity="0.25" />
    <path d="M50 32L68 50L50 68L32 50L50 32Z" fill="#F97316" />
    <circle cx="50" cy="50" r="5" fill="#FFFFFF" />
  </svg>
);

// NVIDIA - Iconic eye/swirl graphic
export const NvidiaLogo: React.FC<LogoProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="100" height="100" rx="18" fill="#76B900" fillOpacity="0.18" />
    <path d="M48 24C34 24 22 36 22 50C22 64 34 76 48 76C60 76 70 68 73 57H63C60 63 54 68 48 68C38 68 30 60 30 50C30 40 38 32 48 32C55 32 61 36 64 42H74C70 32 60 24 48 24Z" fill="#76B900" />
    <path d="M48 38C41 38 36 43 36 50C36 57 41 62 48 62C53 62 57 59 59 55H48V46H69C70 47 70 49 70 50C70 63 60 72 48 72" stroke="#84CC16" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

// ANSYS - Gold triangular italic flag emblem
export const AnsysLogo: React.FC<LogoProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="100" height="100" rx="18" fill="#FFB71B" fillOpacity="0.18" />
    <path d="M26 74L42 26H58L74 74H58L50 48L42 74H26Z" fill="#FBBF24" />
    <path d="M40 58H60L54 74H34L40 58Z" fill="#D97706" />
  </svg>
);

// HEXAGON - Isometric 3D wireframe cube / hexagon
export const HexagonLogo: React.FC<LogoProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="100" height="100" rx="18" fill="#00857C" fillOpacity="0.18" />
    {/* Hexagon Top */}
    <path d="M50 20L78 36L50 52L22 36L50 20Z" fill="#14B8A6" />
    {/* Hexagon Right */}
    <path d="M78 36V68L50 84V52L78 36Z" fill="#0D9488" />
    {/* Hexagon Left */}
    <path d="M22 36V68L50 84V52L22 36Z" fill="#0F766E" />
  </svg>
);

// MICROSOFT - 4-square colored grid
export const MicrosoftLogo: React.FC<LogoProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="100" height="100" rx="18" fill="#00A4EF" fillOpacity="0.15" />
    <rect x="24" y="24" width="22" height="22" fill="#F25022" rx="2" />
    <rect x="54" y="24" width="22" height="22" fill="#7FBA00" rx="2" />
    <rect x="24" y="54" width="22" height="22" fill="#00A4EF" rx="2" />
    <rect x="54" y="54" width="22" height="22" fill="#FFB900" rx="2" />
  </svg>
);

// AWS - Smile arrow in AWS orange
export const AwsLogo: React.FC<LogoProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="100" height="100" rx="18" fill="#FF9900" fillOpacity="0.18" />
    <text x="22" y="48" fill="#FFFFFF" fontSize="22" fontWeight="900" fontFamily="sans-serif">aws</text>
    {/* Smile Arrow */}
    <path d="M24 58C36 67 60 67 76 56" stroke="#FF9900" strokeWidth="5" strokeLinecap="round" />
    <path d="M72 52L80 57L74 65" fill="#FF9900" />
  </svg>
);

// GOOGLE CLOUD - 4-color cloud outline
export const GoogleCloudLogo: React.FC<LogoProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="100" height="100" rx="18" fill="#4285F4" fillOpacity="0.18" />
    <path d="M34 66C26 66 20 60 20 52C20 45 25 39 32 38C34 28 42 20 52 20C62 20 70 27 72 37C78 38 82 43 82 50C82 58 76 66 68 66H34Z" stroke="#4285F4" strokeWidth="5" fill="none" />
    <circle cx="52" cy="44" r="8" fill="#EA4335" />
    <circle cx="64" cy="52" r="6" fill="#34A853" />
    <circle cx="40" cy="54" r="6" fill="#FBBC05" />
  </svg>
);

// BENTLEY SYSTEMS - Italic B geometric symbol
export const BentleyLogo: React.FC<LogoProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="100" height="100" rx="18" fill="#0072C6" fillOpacity="0.18" />
    <path d="M34 24H52C62 24 68 28 68 36C68 42 64 46 58 48C66 50 70 56 70 63C70 72 62 76 50 76H30L34 24ZM44 34L41 46H50C54 46 58 44 58 40C58 36 55 34 50 34H44ZM39 54L36 66H49C54 66 59 64 59 59C59 55 55 54 49 54H39Z" fill="#38BDF8" />
  </svg>
);

// BOSCH - Armature ring inside rectangle
export const BoschLogo: React.FC<LogoProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="100" height="100" rx="18" fill="#E20015" fillOpacity="0.18" />
    <circle cx="50" cy="50" r="28" stroke="#EF4444" strokeWidth="6" fill="none" />
    <rect x="44" y="22" width="12" height="56" fill="#DC2626" rx="2" />
    <circle cx="50" cy="50" r="8" fill="#FFFFFF" />
  </svg>
);

// Specific Tool Brand Visuals
export const TeamcenterIcon: React.FC<LogoProps> = ({ className = 'w-8 h-8', size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
    <circle cx="50" cy="50" r="46" fill="#06B6D4" fillOpacity="0.15" stroke="#06B6D4" strokeWidth="2" />
    {/* Interconnected digital lifecycle thread */}
    <circle cx="32" cy="38" r="8" fill="#06B6D4" />
    <circle cx="68" cy="38" r="8" fill="#3B82F6" />
    <circle cx="50" cy="70" r="8" fill="#0EA5E9" />
    <path d="M32 38L68 38L50 70Z" stroke="#38BDF8" strokeWidth="3" strokeDasharray="3 3" />
    <circle cx="50" cy="48" r="4" fill="#FFFFFF" />
  </svg>
);

export const WindchillIcon: React.FC<LogoProps> = ({ className = 'w-8 h-8', size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
    <circle cx="50" cy="50" r="46" fill="#10B981" fillOpacity="0.15" stroke="#10B981" strokeWidth="2" />
    {/* Geometric digital helix / thread */}
    <path d="M28 65C32 40 45 30 65 30" stroke="#34D399" strokeWidth="5" strokeLinecap="round" />
    <path d="M35 70C55 70 68 60 72 35" stroke="#059669" strokeWidth="5" strokeLinecap="round" />
    <circle cx="65" cy="30" r="5" fill="#10B981" />
    <circle cx="28" cy="65" r="5" fill="#34D399" />
  </svg>
);

export const Dassault3DIcon: React.FC<LogoProps> = ({ className = 'w-8 h-8', size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
    <circle cx="50" cy="50" r="46" fill="#3B82F6" fillOpacity="0.15" stroke="#3B82F6" strokeWidth="2" />
    <path d="M50 22L76 50L50 78L24 50Z" stroke="#60A5FA" strokeWidth="3" fill="none" />
    <path d="M50 22V78M24 50H76" stroke="#93C5FD" strokeWidth="2" strokeDasharray="2 2" />
    <circle cx="50" cy="50" r="7" fill="#2563EB" />
  </svg>
);

export const ArasIcon: React.FC<LogoProps> = ({ className = 'w-8 h-8', size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
    <circle cx="50" cy="50" r="46" fill="#F97316" fillOpacity="0.15" stroke="#F97316" strokeWidth="2" />
    <path d="M50 20L78 48L50 76L22 48Z" fill="#EA580C" fillOpacity="0.3" stroke="#F97316" strokeWidth="4" />
    <circle cx="50" cy="48" r="6" fill="#FBBF24" />
  </svg>
);

export const SapPlmIcon: React.FC<LogoProps> = ({ className = 'w-8 h-8', size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
    <circle cx="50" cy="50" r="46" fill="#0EA5E9" fillOpacity="0.15" stroke="#0EA5E9" strokeWidth="2" />
    <rect x="26" y="32" width="48" height="36" rx="6" fill="#0284C7" />
    <path d="M36 50H64M50 36V64" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const OracleAgileIcon: React.FC<LogoProps> = ({ className = 'w-8 h-8', size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
    <circle cx="50" cy="50" r="46" fill="#EF4444" fillOpacity="0.15" stroke="#EF4444" strokeWidth="2" />
    <circle cx="50" cy="50" r="26" stroke="#EF4444" strokeWidth="4" fill="none" />
    <path d="M38 50L46 58L62 42" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ArenaIcon: React.FC<LogoProps> = ({ className = 'w-8 h-8', size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
    <circle cx="50" cy="50" r="46" fill="#14B8A6" fillOpacity="0.15" stroke="#14B8A6" strokeWidth="2" />
    <circle cx="50" cy="50" r="26" stroke="#2DD4BF" strokeWidth="3" strokeDasharray="6 3" fill="none" />
    <circle cx="50" cy="50" r="12" fill="#0D9488" />
  </svg>
);

export const FusionManageIcon: React.FC<LogoProps> = ({ className = 'w-8 h-8', size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
    <circle cx="50" cy="50" r="46" fill="#8B5CF6" fillOpacity="0.15" stroke="#8B5CF6" strokeWidth="2" />
    <path d="M30 50C30 38 42 38 50 50C58 62 70 62 70 50C70 38 58 38 50 50C42 62 30 62 30 50Z" stroke="#A78BFA" strokeWidth="4" fill="none" />
  </svg>
);

// CAD Specific Icons
export const NxCadIcon: React.FC<LogoProps> = ({ className = 'w-8 h-8', size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
    <circle cx="50" cy="50" r="46" fill="#06B6D4" fillOpacity="0.15" stroke="#06B6D4" strokeWidth="2" />
    {/* Aerodynamic winglet / curve */}
    <path d="M26 68L50 26L74 68L50 54L26 68Z" fill="#0891B2" stroke="#22D3EE" strokeWidth="3" />
  </svg>
);

export const CatiaIcon: React.FC<LogoProps> = ({ className = 'w-8 h-8', size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
    <circle cx="50" cy="50" r="46" fill="#3B82F6" fillOpacity="0.15" stroke="#3B82F6" strokeWidth="2" />
    {/* Class A Curvature flow lines */}
    <path d="M24 64C36 32 64 32 76 64" stroke="#60A5FA" strokeWidth="4" strokeLinecap="round" />
    <path d="M32 72C42 46 58 46 68 72" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" />
    <circle cx="50" cy="38" r="4" fill="#93C5FD" />
  </svg>
);

export const SolidworksIcon: React.FC<LogoProps> = ({ className = 'w-8 h-8', size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
    <circle cx="50" cy="50" r="46" fill="#F43F5E" fillOpacity="0.15" stroke="#F43F5E" strokeWidth="2" />
    {/* 3D Mechanical Block */}
    <path d="M50 24L74 38V66L50 80L26 66V38L50 24Z" stroke="#FB7185" strokeWidth="3" fill="#BE123C" fillOpacity="0.3" />
    <path d="M50 24V52M50 52L74 38M50 52L26 38M50 52V80" stroke="#F43F5E" strokeWidth="2.5" />
  </svg>
);

export const CreoIcon: React.FC<LogoProps> = ({ className = 'w-8 h-8', size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
    <circle cx="50" cy="50" r="46" fill="#10B981" fillOpacity="0.15" stroke="#10B981" strokeWidth="2" />
    {/* Parametric loft curves */}
    <path d="M28 32H54C64 32 72 40 72 50C72 60 64 68 54 68H28V32Z" stroke="#34D399" strokeWidth="4" fill="none" />
    <path d="M28 50H50" stroke="#10B981" strokeWidth="4" />
  </svg>
);

export const AutocadIcon: React.FC<LogoProps> = ({ className = 'w-8 h-8', size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
    <circle cx="50" cy="50" r="46" fill="#F59E0B" fillOpacity="0.15" stroke="#F59E0B" strokeWidth="2" />
    {/* Caliper / Drafting Compass */}
    <path d="M50 22L28 76H40L50 50L60 76H72L50 22Z" fill="#D97706" stroke="#FBBF24" strokeWidth="2.5" />
    <path d="M38 58H62" stroke="#FFFFFF" strokeWidth="3" />
  </svg>
);

export const InventorIcon: React.FC<LogoProps> = ({ className = 'w-8 h-8', size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
    <circle cx="50" cy="50" r="46" fill="#6366F1" fillOpacity="0.15" stroke="#6366F1" strokeWidth="2" />
    {/* Precision Mechanical Gear */}
    <path d="M50 30V24M50 76V70M30 50H24M76 50H70M36 36L31 31M69 69L64 64M36 64L31 69M69 31L64 36" stroke="#818CF8" strokeWidth="5" strokeLinecap="round" />
    <circle cx="50" cy="50" r="16" stroke="#4F46E5" strokeWidth="5" fill="#312E81" />
    <circle cx="50" cy="50" r="6" fill="#C7D2FE" />
  </svg>
);

export const FusionCadIcon: React.FC<LogoProps> = ({ className = 'w-8 h-8', size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
    <circle cx="50" cy="50" r="46" fill="#8B5CF6" fillOpacity="0.15" stroke="#8B5CF6" strokeWidth="2" />
    {/* Fusion loop */}
    <path d="M30 50C30 40 40 40 50 50C60 60 70 60 70 50C70 40 60 40 50 50C40 60 30 60 30 50Z" stroke="#C4B5FD" strokeWidth="5" fill="none" />
    <circle cx="50" cy="50" r="4" fill="#FFFFFF" />
  </svg>
);

export const SolidEdgeIcon: React.FC<LogoProps> = ({ className = 'w-8 h-8', size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
    <circle cx="50" cy="50" r="46" fill="#14B8A6" fillOpacity="0.15" stroke="#14B8A6" strokeWidth="2" />
    {/* Synchronous modeling dual prism */}
    <path d="M32 30H68L56 70H20L32 30Z" fill="#0D9488" stroke="#2DD4BF" strokeWidth="3" />
    <path d="M46 44H78L68 64H36L46 44Z" fill="#14B8A6" stroke="#5EEAD4" strokeWidth="2" />
  </svg>
);

export const OnshapeIcon: React.FC<LogoProps> = ({ className = 'w-8 h-8', size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
    <circle cx="50" cy="50" r="46" fill="#0EA5E9" fillOpacity="0.15" stroke="#0EA5E9" strokeWidth="2" />
    {/* Cloud-native node branch */}
    <circle cx="34" cy="40" r="8" fill="#38BDF8" />
    <circle cx="66" cy="36" r="8" fill="#0284C7" />
    <circle cx="54" cy="66" r="8" fill="#0EA5E9" />
    <path d="M34 40L54 66M66 36L54 66" stroke="#7DD3FC" strokeWidth="4" />
  </svg>
);

// Helper function to resolve logo component by id or company
export const getCompanyLogo = (companyId: string, className?: string, size?: number) => {
  const normalized = companyId.toLowerCase();
  if (normalized.includes('siemens')) return <SiemensLogo className={className} size={size} />;
  if (normalized.includes('ptc')) return <PtcLogo className={className} size={size} />;
  if (normalized.includes('dassault')) return <DassaultLogo className={className} size={size} />;
  if (normalized.includes('autodesk')) return <AutodeskLogo className={className} size={size} />;
  if (normalized.includes('sap')) return <SapLogo className={className} size={size} />;
  if (normalized.includes('oracle')) return <OracleLogo className={className} size={size} />;
  if (normalized.includes('aras')) return <ArasLogo className={className} size={size} />;
  if (normalized.includes('nvidia')) return <NvidiaLogo className={className} size={size} />;
  if (normalized.includes('ansys')) return <AnsysLogo className={className} size={size} />;
  if (normalized.includes('hexagon')) return <HexagonLogo className={className} size={size} />;
  if (normalized.includes('microsoft')) return <MicrosoftLogo className={className} size={size} />;
  if (normalized.includes('aws')) return <AwsLogo className={className} size={size} />;
  if (normalized.includes('google')) return <GoogleCloudLogo className={className} size={size} />;
  if (normalized.includes('bentley')) return <BentleyLogo className={className} size={size} />;
  if (normalized.includes('bosch')) return <BoschLogo className={className} size={size} />;
  return <SiemensLogo className={className} size={size} />;
};

export const getToolBrandIcon = (toolId: string, className?: string, size?: number) => {
  switch (toolId) {
    case 'teamcenter': return <TeamcenterIcon className={className} size={size} />;
    case 'windchill': return <WindchillIcon className={className} size={size} />;
    case '3dexperience-enovia': return <Dassault3DIcon className={className} size={size} />;
    case 'aras-innovator': return <ArasIcon className={className} size={size} />;
    case 'sap-plm': return <SapPlmIcon className={className} size={size} />;
    case 'oracle-agile': return <OracleAgileIcon className={className} size={size} />;
    case 'arena-plm': return <ArenaIcon className={className} size={size} />;
    case 'fusion-manage': return <FusionManageIcon className={className} size={size} />;
    case 'siemens-nx': return <NxCadIcon className={className} size={size} />;
    case 'catia': return <CatiaIcon className={className} size={size} />;
    case 'solidworks': return <SolidworksIcon className={className} size={size} />;
    case 'creo': return <CreoIcon className={className} size={size} />;
    case 'autocad': return <AutocadIcon className={className} size={size} />;
    case 'autodesk-inventor': return <InventorIcon className={className} size={size} />;
    case 'autodesk-fusion': return <FusionCadIcon className={className} size={size} />;
    case 'solid-edge': return <SolidEdgeIcon className={className} size={size} />;
    case 'onshape': return <OnshapeIcon className={className} size={size} />;
    default: return <SiemensLogo className={className} size={size} />;
  }
};
