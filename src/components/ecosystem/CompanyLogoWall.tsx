import React, { useState } from 'react';
import { ECOSYSTEM_COMPANIES } from '../../data/ecosystemData';
import { getCompanyLogo } from './CompanyLogos';

export const CompanyLogoWall: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'PLM Platforms',
    'CAD Platforms',
    'Simulation / CAE',
    'AI / Engineering Computing',
    'Cloud / Infrastructure',
    'Manufacturing Technology',
  ];

  const filteredCompanies = selectedCategory === 'All'
    ? ECOSYSTEM_COMPANIES
    : ECOSYSTEM_COMPANIES.filter(c => c.category === selectedCategory);

  return (
    <div className="relative">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900 hover:border-slate-300 shadow-xs'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Company Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {filteredCompanies.map((company) => (
          <div
            key={company.id}
            className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-300 hover:border-blue-400 hover:shadow-lg hover:-translate-y-0.5"
          >
            <div>
              {/* Card Header: Logo + Category Badge */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 p-2 shadow-xs transition-transform duration-300 group-hover:scale-105">
                  {getCompanyLogo(company.id, 'w-8 h-8')}
                </div>

                <span className="text-[10px] font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md text-right">
                  {company.category}
                </span>
              </div>

              {/* Company Name */}
              <h4 className="mt-3.5 text-sm font-bold text-slate-900 transition-colors duration-200 group-hover:text-blue-600">
                {company.name}
              </h4>

              {/* Role Description */}
              <p className="mt-2 text-xs text-slate-600 leading-relaxed font-normal line-clamp-3">
                {company.roleDescription}
              </p>
            </div>

            {/* Primary Products Tags */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="text-[10px] font-mono uppercase text-slate-400 mb-1.5">
                Key Stack / Platforms
              </div>
              <div className="flex flex-wrap gap-1">
                {company.primaryProducts.slice(0, 3).map((prod, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-700"
                  >
                    {prod}
                  </span>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};
