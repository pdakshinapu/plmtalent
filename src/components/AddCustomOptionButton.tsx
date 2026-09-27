import React, { useState, useRef, useEffect } from 'react';
import { Plus, Check, X } from 'lucide-react';

interface AddCustomOptionButtonProps {
  label: string; // e.g. "+ Add Custom Skill", "+ Add Module", "+ Add CAD Tool", "+ Add PLM System"
  placeholder?: string;
  onAdd: (newOption: string) => void;
  className?: string;
  buttonVariant?: 'chip' | 'card';
}

export const AddCustomOptionButton: React.FC<AddCustomOptionButtonProps> = ({
  label,
  placeholder = 'Type custom name...',
  onAdd,
  className = '',
  buttonVariant = 'card'
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleAdd = () => {
    const trimmed = value.trim();
    if (trimmed) {
      onAdd(trimmed);
      setValue('');
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsEditing(false);
      setValue('');
    }
  };

  if (isEditing) {
    return (
      <div className={`flex items-center gap-1.5 p-1 bg-white border-2 border-blue-500 rounded-lg shadow-sm ${className}`}>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="px-2 py-1 text-xs text-slate-800 bg-transparent focus:outline-none flex-1 min-w-[120px]"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!value.trim()}
          className="p-1 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white transition-colors cursor-pointer"
          title="Add and Select"
        >
          <Check className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => {
            setIsEditing(false);
            setValue('');
          }}
          className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          title="Cancel"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  if (buttonVariant === 'chip') {
    return (
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className={`px-3 py-1.5 rounded-lg text-xs border border-dashed border-blue-400 bg-blue-50/70 hover:bg-blue-100 text-blue-700 font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs hover:border-blue-600 ${className}`}
      >
        <Plus className="w-3.5 h-3.5 shrink-0 text-blue-600 font-bold" />
        <span>{label}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsEditing(true)}
      className={`p-2 rounded-lg border border-dashed border-blue-400 bg-blue-50/70 hover:bg-blue-100 text-blue-700 text-left text-xs font-medium transition-all flex items-center justify-between cursor-pointer shadow-2xs hover:border-blue-600 ${className}`}
    >
      <span className="flex items-center gap-1.5 truncate">
        <Plus className="w-3.5 h-3.5 shrink-0 text-blue-600 font-bold" />
        <span>{label}</span>
      </span>
      <span className="text-[10px] uppercase font-bold text-blue-600 px-1 py-0.5 rounded bg-blue-100 shrink-0">
        + Custom
      </span>
    </button>
  );
};
