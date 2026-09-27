import React, { useState } from 'react';
import { ROADMAP_PHASES, RoadmapPhase } from '../../data/architectureData';
import { CheckCircle2, Clock, Sparkles, ChevronRight, Zap, Users, Globe, Layers } from 'lucide-react';

export const DevelopmentRoadmap: React.FC = () => {
  const [selectedPhase, setSelectedPhase] = useState<number>(1);

  const getIcon = (iconName: string, color: string) => {
    switch (iconName) {
      case 'CheckCircle2': return <CheckCircle2 className="w-4 h-4" style={{ color }} />;
      case 'Users': return <Users className="w-4 h-4" style={{ color }} />;
      case 'Zap': return <Zap className="w-4 h-4" style={{ color }} />;
      case 'Globe': return <Globe className="w-4 h-4" style={{ color }} />;
      case 'Sparkles': return <Sparkles className="w-4 h-4" style={{ color }} />;
      default: return <Layers className="w-4 h-4" style={{ color }} />;
    }
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-[#0B1222] p-6 sm:p-8 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-purple-400">
            ENGINEERING TIMELINE & HORIZON
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
            Development Phases & Future AI Horizon
          </h3>
        </div>

        <span className="text-xs font-mono px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 font-bold">
          Phased Rollout Strategy
        </span>
      </div>

      {/* Horizontal Phase Tabs / Stepper */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        {ROADMAP_PHASES.map((phase) => {
          const isSelected = selectedPhase === phase.phaseNumber;
          return (
            <button
              key={phase.phaseNumber}
              onClick={() => setSelectedPhase(phase.phaseNumber)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 border-white/40 shadow-lg scale-[1.02]'
                  : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-900/60 opacity-80 hover:opacity-100'
              }`}
              style={{
                borderColor: isSelected ? phase.accentColor : undefined,
                boxShadow: isSelected ? `0 0 20px ${phase.accentColor}30` : undefined,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span 
                  className="w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs"
                  style={{ 
                    backgroundColor: `${phase.accentColor}25`, 
                    color: phase.accentColor,
                    border: `1px solid ${phase.accentColor}40`
                  }}
                >
                  {phase.phaseNumber}
                </span>

                <span 
                  className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border"
                  style={{
                    color: phase.accentColor,
                    borderColor: `${phase.accentColor}40`,
                    backgroundColor: `${phase.accentColor}10`
                  }}
                >
                  {phase.status === 'In Production' ? 'Active' : phase.status === 'Future Roadmap' ? 'Future' : 'Planned'}
                </span>
              </div>

              <div className="text-xs font-bold text-white leading-tight truncate">
                {phase.title.split('—')[1]?.trim() || phase.title}
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                {phase.status}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Phase Detailed View */}
      {ROADMAP_PHASES.map((phase) => {
        if (phase.phaseNumber !== selectedPhase) return null;

        return (
          <div
            key={phase.phaseNumber}
            className="rounded-2xl border p-6 sm:p-7 transition-all duration-300 animate-in fade-in"
            style={{
              backgroundColor: '#070C16',
              borderColor: `${phase.accentColor}40`,
              boxShadow: `0 10px 30px -10px ${phase.accentColor}20`,
            }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 mb-5 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center border"
                  style={{
                    backgroundColor: `${phase.accentColor}20`,
                    borderColor: `${phase.accentColor}50`
                  }}
                >
                  {getIcon(phase.iconName, phase.accentColor)}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">
                    {phase.title}
                  </h4>
                  <p className="text-xs text-slate-300 font-medium">
                    {phase.tagline}
                  </p>
                </div>
              </div>

              <span 
                className="text-xs font-mono font-semibold px-3 py-1 rounded-full border"
                style={{
                  color: phase.accentColor,
                  borderColor: `${phase.accentColor}50`,
                  backgroundColor: `${phase.accentColor}15`
                }}
              >
                {phase.timeline}
              </span>
            </div>

            {/* Features Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {phase.features.map((feature, fIdx) => (
                <div
                  key={fIdx}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-200"
                >
                  <CheckCircle2 
                    className="w-4 h-4 shrink-0 mt-0.5" 
                    style={{ color: phase.accentColor }} 
                  />
                  <span className="leading-snug">{feature}</span>
                </div>
              ))}
            </div>

            {phase.phaseNumber === 5 && (
              <div className="mt-5 p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0 text-cyan-400" />
                <span>
                  <strong>Future Roadmap Initiative:</strong> AI features represent the platform's intelligent engineering horizon designed to automate talent-to-CAD matching and skill trajectory insights.
                </span>
              </div>
            )}
          </div>
        );
      })}

    </div>
  );
};
