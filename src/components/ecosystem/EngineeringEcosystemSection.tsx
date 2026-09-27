import React, { useState } from 'react';
import { 
  PLM_PLATFORMS, 
  CAD_TOOLS, 
  TechnologyItem
} from '../../data/ecosystemData';
import { TechnologyCard } from './TechnologyCard';
import { Engineering3DCanvas } from './Engineering3DCanvas';
import { EcosystemHub } from './EcosystemHub';
import { CompanyLogoWall } from './CompanyLogoWall';
import { TechnologyDetailModal } from './TechnologyDetailModal';
import { 
  Sparkles, 
  Search, 
  Layers, 
  Box, 
  ArrowRight, 
  Compass, 
  Building2, 
  Cpu, 
  Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EngineeringEcosystemSectionProps {
  onOpenCandidateModal?: () => void;
  onOpenEmployerModal?: () => void;
}

export const EngineeringEcosystemSection: React.FC<EngineeringEcosystemSectionProps> = ({
  onOpenCandidateModal,
  onOpenEmployerModal,
}) => {
  const navigate = useNavigate();
  const [selectedTech, setSelectedTech] = useState<TechnologyItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'plm' | 'cad'>('all');
  const [activeDomainFilter, setActiveDomainFilter] = useState<string>('plm');

  // Filtered PLM Platforms
  const filteredPlm = PLM_PLATFORMS.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keyCapabilities.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  // Filtered CAD Tools
  const filteredCad = CAD_TOOLS.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keyCapabilities.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div id="engineering-ecosystem" className="relative bg-white text-slate-900 border-t border-slate-100 overflow-hidden">
      
      {/* Global Background Ambient Grid & Soft Gradient Blurs */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.02) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-blue-100/50 blur-[120px]" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[500px] rounded-full bg-cyan-100/40 blur-[140px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[600px] h-[600px] rounded-full bg-indigo-100/40 blur-[160px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">

        {/* ========================================================================= */}
        {/* CHAPTER 1: HERO OF THE MODULE (Heading + Animated 3D CAD Wireframe) */}
        {/* ========================================================================= */}
        <section className="mb-24 sm:mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Heading & Value Proposition */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Animated Pill Badge */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-blue-100 bg-blue-50 text-blue-700 text-xs font-semibold shadow-xs">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </span>
                <span>PLM • CAD • DIGITAL ENGINEERING</span>
              </div>

              {/* Main Section Headline */}
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]">
                ENGINEERING{' '}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                  TECHNOLOGY
                </span>{' '}
                ECOSYSTEM
              </h2>

              {/* Subheading */}
              <p className="text-lg sm:text-xl font-bold text-slate-700 leading-snug">
                Connecting the world's leading PLM, CAD and digital engineering technologies.
              </p>

              {/* Supporting Description */}
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                Our talent network bridges the complete digital lifecycle. From enterprise PLM backbones like Teamcenter, Windchill, and 3DEXPERIENCE, to advanced CAD platforms like NX, CATIA, and Creo — we connect verified engineering talent with the companies driving modern manufacturing.
              </p>

              {/* Key Ecosystem Metric Stats */}
              <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 shadow-xs">
                  <div className="text-2xl font-black text-cyan-600 font-mono">8</div>
                  <div className="text-xs text-slate-600 font-medium mt-0.5">PLM Platforms</div>
                </div>
                <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 shadow-xs">
                  <div className="text-2xl font-black text-blue-600 font-mono">9</div>
                  <div className="text-xs text-slate-600 font-medium mt-0.5">Main CAD Tools</div>
                </div>
                <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 shadow-xs">
                  <div className="text-2xl font-black text-purple-600 font-mono">15+</div>
                  <div className="text-xs text-slate-600 font-medium mt-0.5">Ecosystem Leaders</div>
                </div>
                <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 shadow-xs">
                  <div className="text-2xl font-black text-emerald-600 font-mono">100%</div>
                  <div className="text-xs text-slate-600 font-medium mt-0.5">Domain Focused</div>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Teamcenter, CATIA, NX, Windchill, Creo..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/80 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-xs"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-700"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 bg-slate-100/80 border border-slate-200 rounded-xl p-1 shrink-0">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === 'all'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    All Stack
                  </button>
                  <button
                    onClick={() => setActiveTab('plm')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === 'plm'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    PLM ({PLM_PLATFORMS.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('cad')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === 'cad'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    CAD ({CAD_TOOLS.length})
                  </button>
                </div>
              </div>

            </div>

            {/* Right Column: 3D Engineering Interactive CAD Object */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div className="w-full max-w-[540px] aspect-[4/3] sm:aspect-square">
                <Engineering3DCanvas mode="hero" accentColor="#06b6d4" className="w-full h-full shadow-lg" />
              </div>
            </div>

          </div>
        </section>


        {/* ========================================================================= */}
        {/* CHAPTER 2: INTERACTIVE ECOSYSTEM CONNECTIVITY (The 7 Domains Hub) */}
        {/* ========================================================================= */}
        <section className="mb-24 sm:mb-32">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-100 bg-purple-50 text-purple-700 text-xs font-semibold mb-3">
              <Activity className="w-3.5 h-3.5 text-purple-600" />
              <span>Connected Product Lifecycle</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Unified Engineering Ecosystem
            </h3>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              How enterprise PLM, parametric CAD, simulation, manufacturing, AI, and cloud interconnect through a seamless digital thread.
            </p>
          </div>

          <EcosystemHub
            activeDomainId={activeDomainFilter}
            onSelectDomain={(domainId) => setActiveDomainFilter(domainId)}
          />
        </section>


        {/* ========================================================================= */}
        {/* CHAPTER 3: LEADING PLM PLATFORMS SECTION */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'plm') && (
          <section className="mb-24 sm:mb-32">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2 text-cyan-600 text-xs font-bold uppercase tracking-widest font-mono">
                  <Layers className="w-4 h-4" />
                  <span>Product Lifecycle Management</span>
                </div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight mt-1.5">
                  Leading PLM Platforms
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Manage the complete product lifecycle — from concept, BOM governance and ECN changes, to service and decommissioning.
                </p>
              </div>

              <span className="text-xs font-mono font-bold text-cyan-700 bg-cyan-50 border border-cyan-200 px-3 py-1 rounded-full">
                {filteredPlm.length} Systems Active
              </span>
            </div>

            {/* PLM Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredPlm.map((platform) => (
                <TechnologyCard
                  key={platform.id}
                  item={platform}
                  onSelect={(item) => setSelectedTech(item)}
                />
              ))}
            </div>

            {filteredPlm.length === 0 && (
              <div className="p-12 text-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-500">
                <p className="text-sm font-semibold">No PLM platforms match "{searchQuery}"</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-3 text-xs text-blue-600 hover:underline cursor-pointer"
                >
                  Clear search query
                </button>
              </div>
            )}
          </section>
        )}


        {/* ========================================================================= */}
        {/* CHAPTER 4: MAIN CAD TOOLS */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'cad') && (
          <section className="mb-24 sm:mb-32">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-widest font-mono">
                  <Box className="w-4 h-4" />
                  <span>3D Computer-Aided Design</span>
                </div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight mt-1.5">
                  Main CAD Tools
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Design the products of tomorrow with precision parametric modeling, generative topology, and Class-A surfacing.
                </p>
              </div>

              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                {filteredCad.length} CAD Environments Active
              </span>
            </div>

            {/* CAD Technology Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCad.map((cadTool) => (
                <TechnologyCard
                  key={cadTool.id}
                  item={cadTool}
                  onSelect={(item) => setSelectedTech(item)}
                />
              ))}
            </div>

            {filteredCad.length === 0 && (
              <div className="p-12 text-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-500">
                <p className="text-sm font-semibold">No CAD tools match "{searchQuery}"</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-3 text-xs text-blue-600 hover:underline cursor-pointer"
                >
                  Clear search query
                </button>
              </div>
            )}
          </section>
        )}


        {/* ========================================================================= */}
        {/* CHAPTER 5: TECHNOLOGY ECOSYSTEM & COMPANY LOGO WALL */}
        {/* ========================================================================= */}
        <section className="mb-24 sm:mb-32">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 bg-slate-50 text-slate-700 text-xs font-semibold mb-3">
              <Cpu className="w-3.5 h-3.5 text-blue-600" />
              <span>Technology Ecosystem</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Enterprise Technology Landscape
            </h3>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              Leading technologies across PLM, CAD, simulation, accelerated AI computing, cloud, and digital manufacturing.
            </p>
          </div>

          <CompanyLogoWall />
        </section>


        {/* ========================================================================= */}
        {/* CHAPTER 6: FINAL ENGINEERING CTA */}
        {/* ========================================================================= */}
        <section className="relative rounded-3xl border border-blue-200/80 bg-gradient-to-br from-blue-50/90 via-indigo-50/60 to-cyan-50/90 p-8 sm:p-14 text-center overflow-hidden shadow-lg">
          <div className="relative z-10 max-w-3xl mx-auto">
            {/* Mission Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-200 bg-white text-blue-700 text-xs font-bold font-mono tracking-wider mb-6 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>BUILD SMARTER • DESIGN FASTER • ENGINEER BETTER</span>
            </div>

            {/* Heading */}
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Engineering the Future of Product Development
            </h3>

            {/* Supporting Text */}
            <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
              Explore a connected ecosystem of PLM, CAD, digital engineering, simulation, cloud and AI technologies. Whether you are scaling an engineering division or looking for your next high-impact role, we connect the people who build what's next.
            </p>

            {/* Action Buttons */}
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => {
                  if (onOpenCandidateModal) {
                    onOpenCandidateModal();
                  } else {
                    navigate('/job-seeker');
                  }
                }}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer group"
              >
                <Compass className="w-4 h-4 text-blue-100" />
                <span>Explore Our Capabilities</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => {
                  if (onOpenEmployerModal) {
                    onOpenEmployerModal();
                  } else {
                    navigate('/job-provider');
                  }
                }}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Building2 className="w-4 h-4 text-slate-500" />
                <span>Talk to Our Team</span>
              </button>
            </div>
          </div>
        </section>

      </div>

      {/* Detail Modal */}
      <TechnologyDetailModal
        item={selectedTech}
        onClose={() => setSelectedTech(null)}
        onOpenCandidateModal={onOpenCandidateModal}
        onOpenEmployerModal={onOpenEmployerModal}
      />

    </div>
  );
};
