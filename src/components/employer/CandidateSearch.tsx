import React, { useState } from 'react';
import { CandidateProfile } from '../../types';
import { CandidateCard } from '../common/CandidateCard';
import { Search, Filter, MapPin, Briefcase, IndianRupee, Clock, SlidersHorizontal, CheckCircle2 } from 'lucide-react';

interface CandidateSearchProps {
  candidates: CandidateProfile[];
  onSelectCandidate: (cand: CandidateProfile) => void;
  onOpenChat: (recruiterName: string) => void;
}

export const CandidateSearch: React.FC<CandidateSearchProps> = ({
  candidates,
  onSelectCandidate,
  onOpenChat,
}) => {
  const [query, setQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [maxSalary, setMaxSalary] = useState(50000);
  const [noticeFilter, setNoticeFilter] = useState('All');
  const [shortlistedIds, setShortlistedIds] = useState<string[]>([]);

  const toggleShortlist = (cand: CandidateProfile) => {
    if (shortlistedIds.includes(cand.id)) {
      setShortlistedIds(shortlistedIds.filter((id) => id !== cand.id));
    } else {
      setShortlistedIds([...shortlistedIds, cand.id]);
    }
  };

  const filtered = candidates.filter((c) => {
    const textMatch =
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(query.toLowerCase()));

    const locMatch = selectedLocation === 'All' || c.location.toLowerCase().includes(selectedLocation.toLowerCase());
    const skillMatch = selectedSkill === 'All' || c.skills.some((s) => s.toLowerCase().includes(selectedSkill.toLowerCase()));
    const salMatch = c.expectedSalary <= maxSalary;
    const noticeMatch = noticeFilter === 'All' || c.noticePeriod.toLowerCase().includes(noticeFilter.toLowerCase());

    return textMatch && locMatch && skillMatch && salMatch && noticeMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Verified Candidate Search</h1>
        <p className="text-xs text-slate-500">
          Source pre-screened job seekers in Mumbai, Delhi, Bangalore & major Indian hubs
        </p>
      </div>

      {/* Search Bar + Filter Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search candidate name, job title, or skill (e.g. Delivery, Customer Service, Sales)..."
            className="w-full text-xs outline-none bg-transparent text-slate-800"
          />
        </div>

        {/* Granular Filter Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">City Location</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
            >
              <option value="All">All Locations</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Thane">Thane</option>
              <option value="Delhi">Delhi</option>
              <option value="Bangalore">Bangalore</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Top Skill</label>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
            >
              <option value="All">All Skills</option>
              <option value="Delivery">Delivery Operations</option>
              <option value="Customer">Customer Support</option>
              <option value="Sales">Field Sales</option>
              <option value="Warehouse">Warehouse Management</option>
              <option value="Excel">Microsoft Excel</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Max Expected Salary</label>
            <select
              value={maxSalary}
              onChange={(e) => setMaxSalary(Number(e.target.value))}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
            >
              <option value={25000}>Up to ₹25,000/mo</option>
              <option value={35000}>Up to ₹35,000/mo</option>
              <option value={50000}>Up to ₹50,000/mo</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Notice Period</label>
            <select
              value={noticeFilter}
              onChange={(e) => setNoticeFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
            >
              <option value="All">All Availability</option>
              <option value="Immediate">Immediate Joining</option>
              <option value="15 Days">Within 15 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length > 0 ? (
          filtered.map((cand) => (
            <CandidateCard
              key={cand.id}
              candidate={cand}
              onSelect={onSelectCandidate}
              onShortlist={toggleShortlist}
              onContact={() => onOpenChat(cand.name)}
              shortlisted={shortlistedIds.includes(cand.id)}
            />
          ))
        ) : (
          <div className="col-span-full bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500">
            No candidates matched your search parameters. Try resetting filters.
          </div>
        )}
      </div>
    </div>
  );
};
