import React, { useState } from 'react';
import { ECOSYSTEM_DOMAIN_NODES, EcosystemDomainNode } from '../../data/ecosystemData';
import { 
  Layers, 
  Box, 
  Activity, 
  Cpu, 
  Sparkles, 
  Cloud, 
  Radio, 
  CheckCircle2
} from 'lucide-react';

interface EcosystemHubProps {
  onSelectDomain?: (domainId: string) => void;
  activeDomainId?: string;
}

export const EcosystemHub: React.FC<EcosystemHubProps> = ({
  onSelectDomain,
  activeDomainId: externalActiveDomain,
}) => {
  const [internalActiveDomain, setInternalActiveDomain] = useState<string>('plm');
  const activeId = externalActiveDomain || internalActiveDomain;

  const activeNode = ECOSYSTEM_DOMAIN_NODES.find(n => n.id === activeId) || ECOSYSTEM_DOMAIN_NODES[0];

  const handleNodeClick = (node: EcosystemDomainNode) => {
    setInternalActiveDomain(node.id);
    if (onSelectDomain) {
      onSelectDomain(node.id);
    }
  };

  const getIcon = (iconName: string, color: string) => {
    switch (iconName) {
      case 'Layers': return <Layers className="w-5 h-5" style={{ color }} />;
      case 'Box': return <Box className="w-5 h-5" style={{ color }} />;
      case 'Activity': return <Activity className="w-5 h-5" style={{ color }} />;
      case 'Cpu': return <Cpu className="w-5 h-5" style={{ color }} />;
      case 'Sparkles': return <Sparkles className="w-5 h-5" style={{ color }} />;
      case 'Cloud': return <Cloud className="w-5 h-5" style={{ color }} />;
      case 'Radio': return <Radio className="w-5 h-5" style={{ color }} />;
      default: return <Layers className="w-5 h-5" style={{ color }} />;
    }
  };

  const nodePositions = [
    { id: 'plm', angle: 0, x: 80, y: 50 },
    { id: 'cloud', angle: 51, x: 70, y: 80 },
    { id: 'digital-twin', angle: 102, x: 50, y: 88 },
    { id: 'manufacturing', angle: 154, x: 30, y: 80 },
    { id: 'cae', angle: 205, x: 20, y: 50 },
    { id: 'cad', angle: 257, x: 30, y: 20 },
    { id: 'ai', angle: 308, x: 65, y: 16 },
  ];

  return (
    <div className="relative rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-lg overflow-hidden">
      
      {/* Subtle background dotted grid */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.08) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* LEFT / CENTER: Interactive Orbital Node Diagram */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center select-none">
            
            {/* SVG Connecting Flow Lines */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none" 
              viewBox="0 0 100 100"
            >
              <defs>
                <filter id="glowLight" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Concentric orbital rings */}
              <circle cx="50" cy="50" r="38" stroke="rgba(203, 213, 225, 0.6)" strokeWidth="0.8" fill="none" strokeDasharray="3 3" />
              <circle cx="50" cy="50" r="24" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="0.8" fill="none" />

              {/* Connecting Lines from Center Hub to each node */}
              {nodePositions.map((pos) => {
                const node = ECOSYSTEM_DOMAIN_NODES.find(n => n.id === pos.id);
                const isSelected = activeId === pos.id;
                return (
                  <g key={pos.id}>
                    <line
                      x1="50"
                      y1="50"
                      x2={pos.x}
                      y2={pos.y}
                      stroke={isSelected ? node?.color : 'rgba(203, 213, 225, 0.8)'}
                      strokeWidth={isSelected ? '1.8' : '0.8'}
                      strokeDasharray={isSelected ? 'none' : '2 2'}
                    />

                    {isSelected && (
                      <circle r="1.8" fill={node?.color} filter="url(#glowLight)">
                        <animateMotion
                          path={`M50,50 L${pos.x},${pos.y}`}
                          dur="1.8s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                  </g>
                );
              })}

              <polygon
                points={nodePositions.map(p => `${p.x},${p.y}`).join(' ')}
                stroke="rgba(226, 232, 240, 0.8)"
                strokeWidth="0.8"
                fill="none"
              />
            </svg>

            {/* Central Core: ENGINEERING ECOSYSTEM */}
            <div className="relative z-20 flex flex-col items-center justify-center w-36 h-36 rounded-full border-2 border-blue-500 bg-white p-4 text-center shadow-lg transition-transform duration-300 hover:scale-105">
              <div className="relative z-10">
                <span className="w-2 h-2 mx-auto mb-1 rounded-full bg-blue-600 block animate-ping" />
                <span className="text-[10px] font-mono tracking-widest text-blue-600 font-bold uppercase block">
                  DIGITAL THREAD
                </span>
                <span className="text-xs font-black text-slate-900 tracking-tight uppercase leading-tight block mt-0.5">
                  ENGINEERING
                  <br />
                  ECOSYSTEM
                </span>
              </div>
            </div>

            {/* Orbiting Interactive Domain Nodes */}
            {nodePositions.map((pos) => {
              const node = ECOSYSTEM_DOMAIN_NODES.find(n => n.id === pos.id)!;
              const isSelected = activeId === pos.id;

              return (
                <button
                  key={pos.id}
                  onClick={() => handleNodeClick(node)}
                  className={`absolute z-30 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 p-2 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'scale-110 shadow-md bg-blue-50/90'
                      : 'hover:scale-105 bg-white opacity-90 hover:opacity-100 shadow-xs'
                  }`}
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    borderColor: isSelected ? node.color : 'rgba(226, 232, 240, 1)',
                  }}
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${node.color}15` }}
                  >
                    {getIcon(node.iconName, node.color)}
                  </div>

                  <div className="text-left pr-2 hidden sm:block">
                    <div className="text-[11px] font-bold text-slate-900 tracking-tight">
                      {node.title}
                    </div>
                    <div className="text-[9px] text-slate-500 font-mono">
                      {node.id.toUpperCase()}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <p className="mt-2 text-[11px] font-mono text-slate-500 text-center">
            Click any domain node above to inspect connected technologies
          </p>
        </div>

        {/* RIGHT: Active Domain Detail Spotlight Panel */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/70 p-6 sm:p-7 shadow-xs">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: activeNode.color }}
                />
                <span 
                  className="text-xs font-bold uppercase tracking-wider font-mono"
                  style={{ color: activeNode.color }}
                >
                  {activeNode.id.toUpperCase()} DOMAIN
                </span>
              </div>

              <span className="text-[10px] font-mono text-slate-400">
                ACTIVE FOCUS
              </span>
            </div>

            <h3 className="mt-3 text-2xl font-black text-slate-900 tracking-tight">
              {activeNode.title}
            </h3>

            <p className="text-xs font-semibold text-blue-600 mt-0.5">
              {activeNode.subtitle}
            </p>

            <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              {activeNode.description}
            </p>

            {/* Key Technologies in this domain */}
            <div className="mt-6">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                Benchmark Technologies in Ecosystem
              </div>
              <div className="flex flex-wrap gap-2">
                {activeNode.keyTechnologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs"
                  >
                    <CheckCircle2
                      className="w-3.5 h-3.5"
                      style={{ color: activeNode.color }}
                    />
                    <span>{tech}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span className="font-mono text-[11px]">
              Continuous Data Thread Synchronization
            </span>
            <div 
              className="flex items-center gap-1 font-bold text-xs"
              style={{ color: activeNode.color }}
            >
              <span>Syncing 7 Domains</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
