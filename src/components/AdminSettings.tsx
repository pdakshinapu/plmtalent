import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { addPlatformChoice, removePlatformChoice, PlatformChoices } from '../services/choicesService';
import { Plus, X, Cpu, Layers, Monitor, RefreshCw } from 'lucide-react';

type Category = keyof PlatformChoices;

interface CategoryConfig {
  key: Category;
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  color: string;
}

const CATEGORIES: CategoryConfig[] = [
  {
    key: 'plmSystems',
    label: 'PLM Systems',
    icon: <Layers className="w-4 h-4" />,
    placeholder: 'e.g. Oracle Agile PLM',
    color: 'blue',
  },
  {
    key: 'plmModules',
    label: 'PLM Modules',
    icon: <Cpu className="w-4 h-4" />,
    placeholder: 'e.g. Variant Management',
    color: 'indigo',
  },
  {
    key: 'cadTools',
    label: 'CAD Tools',
    icon: <Monitor className="w-4 h-4" />,
    placeholder: 'e.g. ANSYS Fluent',
    color: 'violet',
  },
];

const COLOR_MAP: Record<string, { badge: string; btn: string; ring: string }> = {
  blue: {
    badge: 'bg-blue-50 border-blue-200 text-blue-800',
    btn: 'bg-blue-600 hover:bg-blue-700',
    ring: 'focus:ring-blue-500',
  },
  indigo: {
    badge: 'bg-indigo-50 border-indigo-200 text-indigo-800',
    btn: 'bg-indigo-600 hover:bg-indigo-700',
    ring: 'focus:ring-indigo-500',
  },
  violet: {
    badge: 'bg-violet-50 border-violet-200 text-violet-800',
    btn: 'bg-violet-600 hover:bg-violet-700',
    ring: 'focus:ring-violet-500',
  },
};

interface InlineAddProps {
  category: Category;
  color: string;
  placeholder: string;
  onAdded: () => void;
}

const InlineAdd: React.FC<InlineAddProps> = ({ category, color, placeholder, onAdded }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const save = async () => {
    if (!value.trim()) { setOpen(false); return; }
    setSaving(true);
    try {
      await addPlatformChoice(category, value.trim());
      setValue('');
      setOpen(false);
      onAdded();
    } finally {
      setSaving(false);
    }
  };

  const colors = COLOR_MAP[color];

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-dashed text-xs font-semibold transition-all cursor-pointer
          border-slate-300 text-slate-500 hover:border-slate-400 hover:text-slate-700 hover:bg-slate-50`}
      >
        <Plus className="w-3.5 h-3.5" />
        Add Option
      </button>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-150">
      <input
        ref={inputRef}
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') { e.preventDefault(); save(); }
          if (e.key === 'Escape') { setOpen(false); setValue(''); }
        }}
        placeholder={placeholder}
        className={`px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:border-slate-400 focus:outline-none focus:ring-2 ${colors.ring} w-48`}
      />
      <button
        onClick={save}
        disabled={saving || !value.trim()}
        className={`px-2.5 py-1.5 text-xs font-semibold text-white rounded-lg ${colors.btn} disabled:opacity-40 transition-all cursor-pointer`}
      >
        {saving ? '…' : 'Add'}
      </button>
      <button
        onClick={() => { setOpen(false); setValue(''); }}
        className="p-1.5 text-slate-400 hover:text-slate-600 rounded transition-colors cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export const AdminSettings: React.FC = () => {
  const { platformChoices } = useApp();
  const [removing, setRemoving] = useState<string>('');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRemove = async (category: Category, item: string) => {
    const key = `${category}:${item}`;
    setRemoving(key);
    try {
      await removePlatformChoice(category, item);
    } finally {
      setRemoving('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Platform Dropdown Options</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage PLM systems, modules and CAD tools shown in all registration and job-posting forms.
            Changes are saved instantly and reflected across the entire platform.
          </p>
        </div>
        <button
          onClick={() => setRefreshKey(k => k + 1)}
          className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Category cards */}
      {CATEGORIES.map(({ key, label, icon, placeholder, color }) => {
        const items: string[] = platformChoices[key] ?? [];
        const colors = COLOR_MAP[color];

        return (
          <div key={`${key}-${refreshKey}`} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Card header */}
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-100 bg-slate-50">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white ${colors.btn.split(' ')[0]}`}>
                {icon}
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">{label}</div>
                <div className="text-[11px] text-slate-500">{items.length} options configured</div>
              </div>
            </div>

            {/* Chips */}
            <div className="px-5 py-4">
              <div className="flex flex-wrap gap-2">
                {items.map(item => {
                  const removeKey = `${key}:${item}`;
                  return (
                    <span
                      key={item}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border ${colors.badge} transition-all`}
                    >
                      {item}
                      <button
                        onClick={() => handleRemove(key, item)}
                        disabled={removing === removeKey}
                        className="ml-0.5 text-current/50 hover:text-current rounded-full p-0.5 hover:bg-black/5 transition-colors cursor-pointer disabled:opacity-40"
                        title={`Remove "${item}"`}
                      >
                        {removing === removeKey ? (
                          <span className="text-[10px]">…</span>
                        ) : (
                          <X className="w-3 h-3" />
                        )}
                      </button>
                    </span>
                  );
                })}

                {items.length === 0 && (
                  <span className="text-xs text-slate-400 italic">No options yet.</span>
                )}

                {/* Inline add button */}
                <InlineAdd
                  category={key}
                  color={color}
                  placeholder={placeholder}
                  onAdded={() => {}}
                />
              </div>
            </div>
          </div>
        );
      })}

      <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-800">
        <strong>Note:</strong> Removing an option does not affect existing job postings or candidate profiles that already use it. 
        It only hides it from future selection in forms.
      </div>
    </div>
  );
};
