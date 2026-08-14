import React from 'react';
import { Company } from '../../types';
import { Building2, MapPin, Users, CheckCircle2, Star, ChevronRight } from 'lucide-react';

interface CompanyCardProps {
  company: Company;
  onSelect: (company: Company) => void;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({ company, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(company)}
      className="bg-white rounded-2xl border border-slate-200 hover:border-teal-400 shadow-sm transition-all p-5 cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 text-2xl font-bold flex items-center justify-center shrink-0">
              {company.logo}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-slate-800 text-base group-hover:text-teal-700 transition-colors">
                  {company.name}
                </h3>
                {company.isVerified && (
                  <CheckCircle2 className="w-4 h-4 text-teal-600 fill-teal-100" title="Verified Employer" />
                )}
              </div>
              <p className="text-xs text-slate-500">{company.industry}</p>
            </div>
          </div>

          {company.rating && (
            <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-2 py-0.5 rounded-lg text-xs font-bold border border-amber-200">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{company.rating}</span>
            </div>
          )}
        </div>

        <p className="text-xs text-slate-600 line-clamp-2 my-2 leading-relaxed">
          {company.about}
        </p>

        <div className="flex items-center gap-4 text-xs text-slate-500 my-3 font-medium">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate max-w-[140px]">{company.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>{company.employeeCount}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 my-2">
          {company.benefits.slice(0, 3).map((b, i) => (
            <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
              ✓ {b}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-700 hover:text-teal-800">
        <span>{company.activeJobsCount} Active Openings</span>
        <ChevronRight className="w-4 h-4" />
      </div>
    </div>
  );
};
