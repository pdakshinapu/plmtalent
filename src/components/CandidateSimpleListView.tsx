import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CandidateProfile } from '../types';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  ShieldCheck, 
  Eye, 
  Send, 
  CheckCircle2, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { CandidateSimpleDetailModal } from './CandidateSimpleDetailModal';
import { SendJobInvitationModal } from './SendJobInvitationModal';

export const CandidateSimpleListView: React.FC = () => {
  const { allCandidates, isConnected, currentEmployer } = useApp();

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedAvailability, setSelectedAvailability] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedEmploymentType, setSelectedEmploymentType] = useState('All');
  const [selectedWorkLocation, setSelectedWorkLocation] = useState('All');
  const [selectedWorkAuth, setSelectedWorkAuth] = useState('All');

  // Modal inspection states
  const [selectedCandidateForDetail, setSelectedCandidateForDetail] = useState<CandidateProfile | null>(null);
  const [selectedCandidateForInvite, setSelectedCandidateForInvite] = useState<CandidateProfile | null>(null);

  // Distinct values for dropdowns with safe defaults
  const allSkills = useMemo(() => {
    const set = new Set<string>();
    (allCandidates || []).forEach(c => {
      const skills = (c.skillsList && c.skillsList.length > 0) ? c.skillsList : (c.modules || []);
      skills.forEach(s => {
        if (s) set.add(s);
      });
    });
    return Array.from(set).sort();
  }, [allCandidates]);

  const allPlatforms = [
    'Siemens Teamcenter',
    'PTC Windchill',
    'Dassault 3DEXPERIENCE / ENOVIA',
    'SAP PLM',
    'Aras Innovator',
    'Autodesk Fusion / Upchain'
  ];

  const allIndustries = [
    'Aerospace & Defense',
    'Automotive & EV',
    'Medical Devices',
    'Industrial Equipment',
    'Consumer Products',
    'High Tech & Electronics'
  ];

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSkill('All');
    setSelectedPlatform('All');
    setSelectedIndustry('All');
    setSelectedAvailability('All');
    setSelectedRegion('All');
    setSelectedEmploymentType('All');
    setSelectedWorkLocation('All');
    setSelectedWorkAuth('All');
  };

  // Robust, crash-proof filter logic
  const filteredCandidates = useMemo(() => {
    return (allCandidates || []).filter(c => {
      if (!c || !c.name || !c.name.trim()) return false;

      const q = searchQuery.trim().toLowerCase();
      const name = (c.name || '').toLowerCase();
      const headline = (c.headline || '').toLowerCase();
      const primaryPLM = (c.primaryPLM || '').toLowerCase();
      const skills = c.skillsList || [];
      const modules = c.modules || [];
      const cadTools = c.cadTools || [];
      const secPLMs = c.secondaryPLMs || [];
      const platforms = c.platformsList || [];
      const industries = c.industriesList || [];
      const location = (c.location || '').toLowerCase();
      const available = (c.availableFrom || '').toLowerCase();
      const empTypes = c.employmentTypes || [];
      const workLocs = c.workLocationPreferences || [];
      const workAuth = (c.workAuthorization || '').toLowerCase();

      const matchesSearch = !q ||
        name.includes(q) ||
        headline.includes(q) ||
        primaryPLM.includes(q) ||
        skills.some(s => s && s.toLowerCase().includes(q)) ||
        modules.some(m => m && m.toLowerCase().includes(q)) ||
        cadTools.some(t => t && t.toLowerCase().includes(q));

      const matchesSkill = selectedSkill === 'All' ||
        skills.includes(selectedSkill) ||
        modules.includes(selectedSkill as any);

      const matchesPlatform = selectedPlatform === 'All' ||
        c.primaryPLM === selectedPlatform ||
        secPLMs.includes(selectedPlatform as any) ||
        platforms.includes(selectedPlatform);

      const matchesIndustry = selectedIndustry === 'All' ||
        industries.includes(selectedIndustry);

      const matchesAvailability = selectedAvailability === 'All' ||
        available.includes(selectedAvailability.toLowerCase());

      const matchesRegion = selectedRegion === 'All' ||
        c.region === selectedRegion ||
        location.includes(selectedRegion.toLowerCase());

      const matchesEmploymentType = selectedEmploymentType === 'All' ||
        empTypes.some(t => t && t.toLowerCase().includes(selectedEmploymentType.toLowerCase()));

      const matchesWorkLocation = selectedWorkLocation === 'All' ||
        workLocs.some(l => l && l.toLowerCase().includes(selectedWorkLocation.toLowerCase()));

      const matchesWorkAuth = selectedWorkAuth === 'All' ||
        workAuth.includes(selectedWorkAuth.toLowerCase());

      return matchesSearch && matchesSkill && matchesPlatform && matchesIndustry &&
             matchesAvailability && matchesRegion && matchesEmploymentType &&
             matchesWorkLocation && matchesWorkAuth;
    });
  }, [
    allCandidates,
    searchQuery,
    selectedSkill,
    selectedPlatform,
    selectedIndustry,
    selectedAvailability,
    selectedRegion,
    selectedEmploymentType,
    selectedWorkLocation,
    selectedWorkAuth
  ]);

  return (
    <div className="bg-white min-h-screen text-slate-900 pb-16">
      
      {/* 1. TOP SEARCH & FILTER BAR */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-3.5">
          
          {/* Main Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidates by title, skills, platforms..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BA3A2C]/20 focus:border-[#BA3A2C] transition-all text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* 8 Distinct Filter Dropdowns in a Responsive Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-xs">
            
            {/* Skills */}
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 text-xs truncate focus:outline-none focus:border-[#BA3A2C] cursor-pointer"
            >
              <option value="All">All skills</option>
              {allSkills.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {/* Platforms */}
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 text-xs truncate focus:outline-none focus:border-[#BA3A2C] cursor-pointer"
            >
              <option value="All">All platforms</option>
              {allPlatforms.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            {/* Industries */}
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 text-xs truncate focus:outline-none focus:border-[#BA3A2C] cursor-pointer"
            >
              <option value="All">All industries</option>
              {allIndustries.map(ind => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>

            {/* Availability */}
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 text-xs truncate focus:outline-none focus:border-[#BA3A2C] cursor-pointer"
            >
              <option value="All">Any availability</option>
              <option value="Immediate">Immediate</option>
              <option value="2 Weeks">Within 2 weeks</option>
              <option value="1 Month">1 Month notice</option>
            </select>

            {/* Regions */}
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 text-xs truncate focus:outline-none focus:border-[#BA3A2C] cursor-pointer"
            >
              <option value="All">All regions</option>
              <option value="North America">North America</option>
              <option value="Europe">Europe</option>
              <option value="APAC">Asia-Pacific</option>
              <option value="Global">Global / Remote</option>
            </select>

            {/* Employment Type */}
            <select
              value={selectedEmploymentType}
              onChange={(e) => setSelectedEmploymentType(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 text-xs truncate focus:outline-none focus:border-[#BA3A2C] cursor-pointer"
            >
              <option value="All">Any employment...</option>
              <option value="Full-Time">Full-time</option>
              <option value="Contract">Contract</option>
            </select>

            {/* Work Location */}
            <select
              value={selectedWorkLocation}
              onChange={(e) => setSelectedWorkLocation(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 text-xs truncate focus:outline-none focus:border-[#BA3A2C] cursor-pointer"
            >
              <option value="All">Any work location</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Onsite">Onsite</option>
            </select>

            {/* Work Authorization */}
            <select
              value={selectedWorkAuth}
              onChange={(e) => setSelectedWorkAuth(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 text-xs truncate focus:outline-none focus:border-[#BA3A2C] cursor-pointer"
            >
              <option value="All">Any work authorization</option>
              <option value="Citizen">Citizen / Permanent Resident</option>
              <option value="Authorized">Work Authorized</option>
            </select>

          </div>

          {/* Filter Sub-bar: Counter & Reset */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-slate-500 font-medium">
              Showing <strong className="text-slate-800">{filteredCandidates.length}</strong> of {allCandidates.length} PLM professionals
            </span>
            <button
              onClick={handleResetFilters}
              className="text-xs text-slate-500 hover:text-[#BA3A2C] flex items-center gap-1 font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset filters</span>
            </button>
          </div>

        </div>
      </div>

      {/* 2. FULL-WIDTH CANDIDATES DIRECTORY */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {filteredCandidates.length === 0 ? (
          <div className="p-16 text-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 space-y-3">
            <p className="text-sm font-bold text-slate-700">No candidates match your current filter selection</p>
            <p className="text-xs text-slate-500">Try widening your filters or clicking "Reset filters" above.</p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#BA3A2C] hover:bg-[#9E2F23] rounded-xl transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 border-t border-slate-200 bg-white">
            {filteredCandidates.map(c => {
              const connected = isConnected(c.id, currentEmployer?.id);
              const locCity = c.location ? c.location.split(',')[0].toUpperCase() : 'NORTH AMERICA';
              const regionTag = c.region 
                ? `${c.seniorityLevel?.toUpperCase() || 'SENIOR'} · ${c.region.toUpperCase()}`
                : `SENIOR · ${locCity}`;

              const platformsDisplay = c.platformsList && c.platformsList.length > 0
                ? c.platformsList
                : [c.primaryPLM || 'Siemens Teamcenter', ...(c.secondaryPLMs || [])];

              return (
                <div 
                  key={c.id} 
                  className="py-6 sm:py-7 group hover:bg-slate-50/60 transition-colors rounded-xl px-4 sm:px-6"
                >
                  {/* Category Header in #BA3A2C */}
                  <div className="text-xs font-bold text-[#BA3A2C] uppercase tracking-wider mb-1.5">
                    {regionTag}
                  </div>

                  {/* Main Title / Headline */}
                  <h2 
                    onClick={() => setSelectedCandidateForDetail(c)}
                    className="text-lg sm:text-xl font-bold text-[#0B2545] hover:text-[#BA3A2C] transition-colors cursor-pointer leading-tight mb-3"
                  >
                    {c.headline || c.name}
                  </h2>

                  {/* Clean Metadata Rows */}
                  <div className="space-y-1 text-xs text-slate-600 mb-4">
                    <div>
                      <strong className="text-slate-900 font-semibold">Experience:</strong> {c.yearsOfExperience ?? 0} yrs
                    </div>
                    <div>
                      <strong className="text-slate-900 font-semibold">Available:</strong> {c.availableFrom || 'Immediately'}
                    </div>
                    <div>
                      <strong className="text-slate-900 font-semibold">Employment Type:</strong> {(c.employmentTypes || []).join(', ') || 'Permanent / Full time, Contract'}
                    </div>
                    <div>
                      <strong className="text-slate-900 font-semibold">Work Location:</strong> {(c.workLocationPreferences || []).join(', ') || 'Travel as needed, Remote, Hybrid'}
                    </div>
                  </div>

                  {/* Platform Tags & Action Buttons */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    
                    {/* Platform Pills */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {platformsDisplay.slice(0, 3).map(p => (
                        <span 
                          key={p} 
                          className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-slate-100 text-slate-800 border border-slate-200"
                        >
                          {p}
                        </span>
                      ))}
                      {c.clearance && c.clearance !== 'None' && (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-50 border border-amber-200 text-amber-800">
                          {c.clearance}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setSelectedCandidateForDetail(c)}
                        className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Profile</span>
                      </button>

                      {connected ? (
                        <span className="px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-lg flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Connected</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => setSelectedCandidateForInvite(c)}
                          className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#BA3A2C] hover:bg-[#9E2F23] rounded-lg transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Send Job Invitation</span>
                        </button>
                      )}
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Profile Detail Modal */}
      <CandidateSimpleDetailModal
        candidate={selectedCandidateForDetail}
        isOpen={!!selectedCandidateForDetail}
        onClose={() => setSelectedCandidateForDetail(null)}
      />

      {/* Send Job Invitation Modal */}
      <SendJobInvitationModal
        candidate={selectedCandidateForInvite}
        isOpen={!!selectedCandidateForInvite}
        onClose={() => setSelectedCandidateForInvite(null)}
      />

    </div>
  );
};
