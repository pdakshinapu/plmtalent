import React from 'react';
import { TechnologyItem } from '../../data/ecosystemData';
import { getToolBrandIcon } from './CompanyLogos';
import { X, CheckCircle2, FileText, ArrowRight, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TechnologyDetailModalProps {
  item: TechnologyItem | null;
  onClose: () => void;
  onOpenCandidateModal?: () => void;
  onOpenEmployerModal?: () => void;
}

export const TechnologyDetailModal: React.FC<TechnologyDetailModalProps> = ({
  item,
  onClose,
  onOpenCandidateModal,
  onOpenEmployerModal,
}) => {
  const navigate = useNavigate();
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl text-slate-900 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4 sm:gap-5 pr-12">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 p-3 shadow-xs">
            {getToolBrandIcon(item.id, 'w-10 h-10')}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {item.name}
              </h2>
              <span
                className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border"
                style={{
                  color: item.accentColor,
                  borderColor: `${item.accentColor}40`,
                  backgroundColor: `${item.accentColor}12`,
                }}
              >
                {item.badgeText}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
              <span className="font-semibold text-slate-800">{item.company}</span>
              <span>·</span>
              <span>Category: {item.category}</span>
            </div>
          </div>
        </div>

        {/* Tagline */}
        <p className="mt-4 text-sm font-semibold text-blue-600">
          {item.tagline}
        </p>

        {/* Description */}
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          {item.description}
        </p>

        {/* Key Engineering Capabilities */}
        <div className="mt-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Core Enterprise Capabilities</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {item.keyCapabilities.map((cap, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800"
              >
                <CheckCircle2
                  className="w-4 h-4 shrink-0"
                  style={{ color: item.accentColor }}
                />
                <span className="font-medium">{cap}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Supported Formats */}
        {item.supportedFormats && item.supportedFormats.length > 0 && (
          <div className="mt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-400" />
              <span>Supported Standards & CAD / PDM Formats</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {item.supportedFormats.map((fmt, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-100 text-[11px] font-mono text-blue-700 font-semibold"
                >
                  {fmt}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              if (onOpenCandidateModal) {
                onOpenCandidateModal();
              } else {
                navigate('/job-seeker');
              }
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Find {item.name} Roles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              onClose();
              if (onOpenEmployerModal) {
                onOpenEmployerModal();
              } else {
                navigate('/job-provider');
              }
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Hire {item.name} Engineers</span>
          </button>
        </div>
      </div>
    </div>
  );
};
