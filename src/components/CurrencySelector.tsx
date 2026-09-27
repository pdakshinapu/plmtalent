import React, { useState } from 'react';
import { TOP_CURRENCIES, getCurrencySymbol } from '../utils/currency';
import { Plus, DollarSign, Check, X } from 'lucide-react';

interface CurrencySelectorProps {
  value: string;
  onChange: (currency: string) => void;
  className?: string;
  label?: string;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  value,
  onChange,
  className = '',
  label = 'Currency'
}) => {
  const isPredefined = TOP_CURRENCIES.some(c => c.code === value);
  const [isCustomMode, setIsCustomMode] = useState(!isPredefined && Boolean(value));
  const [customInput, setCustomInput] = useState(!isPredefined ? value : '');

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'CUSTOM') {
      setIsCustomMode(true);
    } else {
      setIsCustomMode(false);
      onChange(val);
    }
  };

  const handleApplyCustom = () => {
    const trimmed = customInput.trim();
    if (trimmed) {
      onChange(trimmed);
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-xs font-medium text-slate-700">
          {label}
        </label>
      )}

      {!isCustomMode ? (
        <div className="relative">
          <select
            value={value || 'USD'}
            onChange={handleSelectChange}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 bg-white font-medium text-slate-800 cursor-pointer"
          >
            <optgroup label="Top 10 Global Currencies">
              {TOP_CURRENCIES.map(curr => (
                <option key={curr.code} value={curr.code}>
                  {curr.popularLabel}
                </option>
              ))}
            </optgroup>
            <option value="CUSTOM">+ Add Custom Currency...</option>
          </select>
        </div>
      ) : (
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            value={customInput}
            onChange={e => setCustomInput(e.target.value)}
            onBlur={handleApplyCustom}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleApplyCustom();
              }
            }}
            placeholder="e.g. BRL (R$), CNY (¥), SEK..."
            className="flex-1 px-3 py-2 text-xs rounded-lg border-2 border-blue-500 focus:outline-none bg-white font-medium text-slate-800"
            autoFocus
          />
          <button
            type="button"
            onClick={handleApplyCustom}
            className="px-2.5 py-2 text-xs bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors cursor-pointer shrink-0"
            title="Apply currency"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              setIsCustomMode(false);
              onChange('USD');
            }}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
            title="Reset to top currencies"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
