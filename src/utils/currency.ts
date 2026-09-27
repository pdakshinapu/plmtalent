export interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
  popularLabel: string;
}

export const TOP_CURRENCIES: CurrencyOption[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', popularLabel: 'USD ($) - United States' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', popularLabel: 'INR (₹) - India' },
  { code: 'EUR', symbol: '€', name: 'Euro', popularLabel: 'EUR (€) - European Union' },
  { code: 'GBP', symbol: '£', name: 'British Pound', popularLabel: 'GBP (£) - United Kingdom' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', popularLabel: 'CAD (CA$) - Canada' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', popularLabel: 'AUD (A$) - Australia' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', popularLabel: 'JPY (¥) - Japan' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', popularLabel: 'CHF (CHF) - Switzerland' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', popularLabel: 'SGD (S$) - Singapore' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham', popularLabel: 'AED (AED) - United Arab Emirates' },
];

export const getCurrencySymbol = (codeOrSymbol?: string): string => {
  if (!codeOrSymbol) return '$';
  const clean = codeOrSymbol.trim();
  const matched = TOP_CURRENCIES.find(
    c => c.code.toLowerCase() === clean.toLowerCase() || c.symbol === clean
  );
  if (matched) return matched.symbol;
  return clean;
};

export const getCurrencyCode = (codeOrSymbol?: string): string => {
  if (!codeOrSymbol) return 'USD';
  const clean = codeOrSymbol.trim();
  const matched = TOP_CURRENCIES.find(
    c => c.code.toLowerCase() === clean.toLowerCase() || c.symbol === clean
  );
  if (matched) return matched.code;
  return clean.toUpperCase();
};

export const formatCompensation = (
  comp?: {
    min?: number;
    max?: number;
    currency?: string;
    period?: 'yearly' | 'hourly' | string;
  } | null
): string => {
  if (!comp || (!comp.min && !comp.max)) return 'Competitive Compensation';
  
  const symbol = getCurrencySymbol(comp.currency);
  const minVal = comp.min ? `${symbol}${comp.min.toLocaleString()}` : '';
  const maxVal = comp.max && comp.max !== comp.min ? `${symbol}${comp.max.toLocaleString()}` : '';
  
  const range = minVal && maxVal ? `${minVal} - ${maxVal}` : (minVal || maxVal);
  const cadence = comp.period ? ` / ${comp.period === 'hourly' ? 'hr' : 'yr'}` : '';

  return `${range}${cadence}`;
};
