import React, { useState, useRef } from 'react';
import { TechnologyItem } from '../../data/ecosystemData';
import { getToolBrandIcon, getCompanyLogo } from './CompanyLogos';
import { ChevronRight } from 'lucide-react';

interface TechnologyCardProps {
  item: TechnologyItem;
  onSelect?: (item: TechnologyItem) => void;
}

export const TechnologyCard: React.FC<TechnologyCardProps> = ({ item, onSelect }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  // 3D Tilt calculation
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -6; // max 6 deg tilt
    const rY = ((x - centerX) / centerX) * 6;

    setRotateX(rX);
    setRotateY(rY);
    setMousePos({
      x: Math.round((x / rect.width) * 100),
      y: Math.round((y / rect.height) * 100),
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect && onSelect(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onSelect) {
          e.preventDefault();
          onSelect(item);
        }
      }}
      className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs transition-all duration-300 ease-out cursor-pointer hover:border-blue-400 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)',
      }}
    >
      {/* Dynamic Radial Spotlight following mouse cursor */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle 220px at ${mousePos.x}% ${mousePos.y}%, ${item.accentColor}12, transparent 70%)`,
        }}
      />

      {/* Header: Brand Mark + Company & Category Pills */}
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50/80 p-2 shadow-xs transition-transform duration-300 group-hover:scale-105 group-hover:border-blue-200">
            {getToolBrandIcon(item.id, 'w-9 h-9')}
            <span
              className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border border-white bg-slate-100 shadow-xs"
              title={item.company}
            >
              {getCompanyLogo(item.company, 'w-3 h-3')}
            </span>
          </div>

          <div className="min-w-0">
            <h3 className="text-lg font-bold tracking-tight text-slate-900 transition-colors duration-200 group-hover:text-blue-600 truncate">
              {item.name}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-semibold text-slate-500 truncate">
                {item.company}
              </span>
              <span className="text-slate-300">·</span>
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
                style={{
                  color: item.accentColor,
                  borderColor: `${item.accentColor}40`,
                  backgroundColor: `${item.accentColor}12`,
                }}
              >
                {item.badgeText}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="relative z-10 my-4 flex-1">
        <p className="text-xs text-slate-600 leading-relaxed font-normal line-clamp-3">
          {item.description}
        </p>

        {/* Key capabilities tag chips */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {item.keyCapabilities.slice(0, 3).map((cap, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200/80 text-[11px] font-medium text-slate-700 group-hover:border-slate-300 transition-colors"
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: item.accentColor }}
              />
              <span className="truncate">{cap}</span>
            </span>
          ))}
          {item.keyCapabilities.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100/70 border border-slate-200 text-[10px] font-semibold text-slate-500">
              +{item.keyCapabilities.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Footer Metadata & Action */}
      <div className="relative z-10 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {item.stats && item.stats.length > 0 && (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
              <span className="text-slate-400">{item.stats[0].label}:</span>
              <span className="font-semibold text-slate-700">{item.stats[0].value}</span>
            </div>
          )}
        </div>

        <div className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 group-hover:text-blue-600 transition-colors">
          <span>Explore Capabilities</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
        </div>
      </div>
    </div>
  );
};
