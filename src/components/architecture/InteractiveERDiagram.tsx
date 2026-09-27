import React, { useState } from 'react';
import { DATABASE_ENTITIES, DatabaseEntity } from '../../data/architectureData';
import { Database, Link2, Key, Info, CheckCircle2, ChevronRight, Eye } from 'lucide-react';

export const InteractiveERDiagram: React.FC = () => {
  const [hoveredEntityId, setHoveredEntityId] = useState<string | null>(null);
  const [selectedEntityId, setSelectedEntityId] = useState<string>('users');

  // Determine which entities are highlighted based on hover requirements:
  // On hover over 'skills' -> highlight: professional_profiles, user_skills, jobs
  // On hover over 'companies' -> highlight: jobs, applications
  // On hover over 'users' -> highlight: professional_profiles, applications, posts
  const getHighlightedIds = (): string[] => {
    if (!hoveredEntityId) return [];

    if (hoveredEntityId === 'skills') {
      return ['skills', 'user_skills', 'professional_profiles', 'jobs'];
    }
    if (hoveredEntityId === 'companies') {
      return ['companies', 'jobs', 'applications'];
    }
    if (hoveredEntityId === 'users') {
      return ['users', 'professional_profiles', 'applications', 'posts'];
    }
    if (hoveredEntityId === 'jobs') {
      return ['jobs', 'companies', 'applications', 'skills'];
    }
    if (hoveredEntityId === 'applications') {
      return ['applications', 'jobs', 'users'];
    }
    if (hoveredEntityId === 'user_skills') {
      return ['user_skills', 'users', 'skills'];
    }
    if (hoveredEntityId === 'professional_profiles') {
      return ['professional_profiles', 'users', 'skills'];
    }
    if (hoveredEntityId === 'posts') {
      return ['posts', 'users'];
    }

    return [hoveredEntityId];
  };

  const highlightedIds = getHighlightedIds();
  const selectedEntity = DATABASE_ENTITIES.find(e => e.id === selectedEntityId) || DATABASE_ENTITIES[0];

  return (
    <div className="rounded-3xl border border-slate-800 bg-[#0B1222] p-6 sm:p-8 shadow-2xl relative">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5" />
            RELATIONAL DATA ARCHITECTURE
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
            Database Schema (Main Tables & Foreign Keys)
          </h3>
        </div>

        {/* Hover Hint */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-xl">
          <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>Hover <strong className="text-blue-300">users</strong>, <strong className="text-emerald-300">companies</strong>, or <strong className="text-cyan-300">skills</strong> to see relationships</span>
        </div>
      </div>

      {/* Main Grid of ER Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {DATABASE_ENTITIES.map((entity) => {
          const isHighlighted = highlightedIds.length > 0 ? highlightedIds.includes(entity.id) : true;
          const isDirectlyHovered = hoveredEntityId === entity.id;
          const isSelected = selectedEntityId === entity.id;

          return (
            <div
              key={entity.id}
              onMouseEnter={() => setHoveredEntityId(entity.id)}
              onMouseLeave={() => setHoveredEntityId(null)}
              onClick={() => setSelectedEntityId(entity.id)}
              className={`rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between ${
                isDirectlyHovered
                  ? 'scale-[1.02] shadow-xl z-20'
                  : isHighlighted
                  ? 'opacity-100 shadow-md'
                  : 'opacity-40 hover:opacity-80'
              }`}
              style={{
                backgroundColor: isDirectlyHovered ? '#0D172E' : '#080D1A',
                borderColor: isDirectlyHovered
                  ? entity.color
                  : isHighlighted && hoveredEntityId
                  ? `${entity.color}80`
                  : 'rgba(51, 65, 85, 0.6)',
                boxShadow: isDirectlyHovered ? `0 0 25px ${entity.color}40` : 'none',
              }}
            >
              {/* Table Header */}
              <div 
                className="px-4 py-2.5 border-b flex items-center justify-between"
                style={{
                  backgroundColor: `${entity.color}15`,
                  borderColor: `${entity.color}30`
                }}
              >
                <div className="flex items-center gap-2">
                  <Database className="w-3.5 h-3.5" style={{ color: entity.color }} />
                  <span className="text-xs font-mono font-bold text-white tracking-wide">
                    {entity.name}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {entity.fields.length} cols
                </span>
              </div>

              {/* Table Fields List */}
              <div className="p-3 space-y-1 font-mono text-[11px] flex-1">
                {entity.fields.map((field, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between py-0.5 px-1.5 rounded hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      {field.isPK && (
                        <span className="text-[9px] font-black px-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          PK
                        </span>
                      )}
                      {field.isFK && (
                        <span className="text-[9px] font-black px-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                          FK
                        </span>
                      )}
                      <span className={`${field.isPK ? 'text-amber-200 font-bold' : field.isFK ? 'text-cyan-200 font-medium' : 'text-slate-300'} truncate`}>
                        {field.name}
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-500 shrink-0 ml-2">
                      {field.type}
                    </span>
                  </div>
                ))}
              </div>

              {/* Table Footer with relationship badge */}
              <div className="px-3 py-2 border-t border-slate-800/80 bg-slate-950/60 text-[10px] text-slate-400 font-mono flex items-center justify-between">
                <span>Relations: {entity.relatedEntities.length}</span>
                <span className="text-blue-400 flex items-center gap-0.5">
                  <span>Inspect</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>

            </div>
          );
        })}
      </div>

      {/* Selected Entity Inspector Tray */}
      <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs font-mono text-slate-300">
        <div className="flex items-center gap-3">
          <span className="text-slate-500 uppercase">Selected Entity:</span>
          <span 
            className="px-2.5 py-1 rounded-md font-bold text-white"
            style={{ backgroundColor: `${selectedEntity.color}25`, border: `1px solid ${selectedEntity.color}50` }}
          >
            {selectedEntity.name}
          </span>
          <span className="hidden sm:inline text-slate-400">
            {selectedEntity.description}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500">Connected With:</span>
          <div className="flex flex-wrap gap-1">
            {selectedEntity.relatedEntities.map((relId, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedEntityId(relId)}
                className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300 hover:text-white hover:border-cyan-400 transition-colors cursor-pointer"
              >
                {relId}
              </button>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
