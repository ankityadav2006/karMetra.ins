import React, { useState, useMemo } from 'react';
import { Company, Job } from '../../types';
import {
  Building2,
  Search,
  MapPin,
  Users,
  Briefcase,
  ShieldCheck,
  ExternalLink,
  Star,
  CheckCircle2,
  Filter,
} from 'lucide-react';

interface CompanyDirectoryViewProps {
  companies: Company[];
  jobs: Job[];
  onSelectCompany?: (company: Company) => void;
  onSelectJob: (job: Job) => void;
}

export const CompanyDirectoryView: React.FC<CompanyDirectoryViewProps> = ({
  companies,
  jobs,
  onSelectCompany,
  onSelectJob,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedCompanyModal, setSelectedCompanyModal] = useState<Company | null>(null);

  const industries = useMemo(() => {
    const list = ['All'];
    companies.forEach((c) => {
      if (c.industry && !list.includes(c.industry)) {
        list.push(c.industry);
      }
    });
    return list;
  }, [companies]);

  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      if (selectedIndustry !== 'All' && c.industry !== selectedIndustry) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesLoc = c.location.toLowerCase().includes(q);
        const matchesInd = c.industry.toLowerCase().includes(q);
        if (!matchesName && !matchesLoc && !matchesInd) return false;
      }
      return true;
    });
  }, [companies, selectedIndustry, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-teal-900">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
            <Building2 className="w-3.5 h-3.5 text-teal-400" />
            <span>Verified Employer Directory</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Top Companies & <span className="text-teal-400">Verified Employers in India</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300">
            Explore trusted enterprises, high-growth startups, and verified staffing agencies actively hiring across India with 100% Zero-Fee guarantee.
          </p>

          {/* Search & Filter Bar */}
          <div className="bg-white rounded-2xl p-2 shadow-2xl text-slate-900 flex flex-col sm:flex-row gap-2 mt-4 border border-slate-200">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl">
              <Search className="w-4 h-4 text-teal-700 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search company by name, city or industry..."
                className="w-full text-xs outline-none bg-transparent font-medium"
              />
            </div>

            <div className="sm:w-56 flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full text-xs outline-none bg-transparent font-bold cursor-pointer"
              >
                {industries.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind === 'All' ? 'All Industries' : ind}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCompanies.map((company) => {
          const companyJobs = jobs.filter(
            (j) => j.companyId === company.id || j.companyName === company.name
          );

          return (
            <div
              key={company.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-teal-500 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl shadow-xs">
                      {company.logo || '🏢'}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-base font-black text-slate-900">{company.name}</h3>
                        {company.isVerified && (
                          <span title="Government Verified Corporate Employer">
                            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium">{company.industry}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                    <span>{company.rating || '4.8'}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {company.about || 'A leading verified employer offering career opportunities across India with verified benefits and prompt wage disbursements.'}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {company.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    {company.size || '1,000+ employees'}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg">
                  {companyJobs.length} Open Positions
                </span>

                <button
                  onClick={() => setSelectedCompanyModal(company)}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <span>View Details</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* COMPANY DETAILS MODAL */}
      {selectedCompanyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-3xl">
                  {selectedCompanyModal.logo || '🏢'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-900">{selectedCompanyModal.name}</h3>
                    {selectedCompanyModal.isVerified && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                        ✓ Verified Employer
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    {selectedCompanyModal.industry} • HQ: {selectedCompanyModal.location}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCompanyModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-medium">Rating</span>
                <p className="font-bold text-slate-900 mt-0.5">⭐ {selectedCompanyModal.rating || '4.8'}/5.0</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-medium">Team Size</span>
                <p className="font-bold text-slate-900 mt-0.5">{selectedCompanyModal.size || '1,000+ Team'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-medium">Trust Score</span>
                <p className="font-bold text-teal-700 mt-0.5">100% Anti-Fraud Certified</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-900">About the Company</h4>
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                {selectedCompanyModal.about || 'A leading verified employer offering career opportunities across India with verified benefits and prompt wage disbursements.'}
              </p>
            </div>

            {/* Open positions from this company */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-900 uppercase">
                Active Openings at {selectedCompanyModal.name}
              </h4>
              <div className="space-y-2">
                {jobs
                  .filter(
                    (j) =>
                      j.companyId === selectedCompanyModal.id ||
                      j.companyName === selectedCompanyModal.name
                  )
                  .map((j) => (
                    <div
                      key={j.id}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs hover:border-teal-400 transition-colors"
                    >
                      <div>
                        <p className="font-black text-slate-900">{j.title}</p>
                        <p className="text-[11px] text-slate-500">
                          {j.location} • ₹{j.minSalary.toLocaleString('en-IN')} - ₹{j.maxSalary.toLocaleString('en-IN')}/{j.payPeriod} • {j.jobType}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedCompanyModal(null);
                          onSelectJob(j);
                        }}
                        className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold"
                      >
                        Apply Now
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedCompanyModal(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
