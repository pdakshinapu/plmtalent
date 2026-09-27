import React, { useState } from 'react';
import { PLM_CAD_SKILLS_ECOSYSTEM } from '../../data/architectureData';
import { Layers, Box, Cpu, Sparkles, CheckCircle2, Search } from 'lucide-react';

export const EngineeringSkillsLayer: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'plm' | 'cad' | 'competency'>('all');

  return (
    <div className="rounded-3xl border border-slate-800 bg-[#0B1222] p-6 sm:p-8 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            ENGINEERING TALENT TAXONOMY
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
            PLM & CAD Skill Ecosystem
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Standardized technical skills bridging job requirements with candidate verifications.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filter === 'all' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Skills
          </button>
          <button
            onClick={() => setFilter('plm')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filter === 'plm' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            PLM Platforms
          </button>
          <button
            onClick={() => setFilter('cad')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filter === 'cad' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            CAD Tools
          </button>
          <button
            onClick={() => setFilter('competency')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filter === 'competency' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Competencies
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Column 1: PLM Platforms */}
        {(filter === 'all' || filter === 'plm') && (
          <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-5">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold font-mono uppercase tracking-wider mb-3">
              <Layers className="w-4 h-4" />
              <span>PLM Platforms ({PLM_CAD_SKILLS_ECOSYSTEM.plmPlatforms.length})</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {PLM_CAD_SKILLS_ECOSYSTEM.plmPlatforms.map((plm, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-cyan-500/30 text-xs font-semibold text-cyan-200 flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>{plm}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Column 2: CAD Tools */}
        {(filter === 'all' || filter === 'cad') && (
          <div className="rounded-2xl border border-blue-500/30 bg-blue-950/20 p-5">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-bold font-mono uppercase tracking-wider mb-3">
              <Box className="w-4 h-4" />
              <span>Main CAD Tools ({PLM_CAD_SKILLS_ECOSYSTEM.cadTools.length})</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {PLM_CAD_SKILLS_ECOSYSTEM.cadTools.map((cad, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-blue-500/30 text-xs font-semibold text-blue-200 flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>{cad}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Column 3: Engineering Core Competencies */}
        {(filter === 'all' || filter === 'competency') && (
          <div className="rounded-2xl border border-purple-500/30 bg-purple-950/20 p-5">
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold font-mono uppercase tracking-wider mb-3">
              <Cpu className="w-4 h-4" />
              <span>Engineering Competencies ({PLM_CAD_SKILLS_ECOSYSTEM.engineeringCompetencies.length})</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {PLM_CAD_SKILLS_ECOSYSTEM.engineeringCompetencies.map((comp, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-purple-500/30 text-xs font-semibold text-purple-200 flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  <span>{comp}</span>
                </span>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
