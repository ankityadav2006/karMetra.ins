import React, { useState } from 'react';
import { Job, CandidateProfile } from '../../types';
import { calculateHireMatch } from '../../utils/hireMatch';
import {
  MapPin,
  Briefcase,
  IndianRupee,
  Bookmark,
  Flame,
  Check,
  CheckCircle2,
  Navigation,
  ArrowRight,
} from 'lucide-react';

interface JobCardProps {
  job: Job;
  candidateProfile: CandidateProfile;
  isSaved?: boolean;
  onSelect: (job: Job) => void;
  onApply: (job: Job) => void;
  onToggleSave: (jobId: string) => void;
  onReport?: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  candidateProfile,
  isSaved = false,
  onSelect,
  onApply,
  onToggleSave,
}) => {
  const [saved, setSaved] = useState(isSaved);
  const matchResult = calculateHireMatch(candidateProfile, job);

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSaved(!saved);
    onToggleSave(job.id);
  };

  const handleApplyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onApply(job);
  };

  return (
    <div
      onClick={() => onSelect(job)}
      className="bg-white rounded-2xl border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all p-5 cursor-pointer relative group flex flex-col justify-between"
    >
      <div>
        {/* Header: Company logo + Title + Save button */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-100 text-xl font-bold flex items-center justify-center shrink-0">
              {job.companyLogo || '🏢'}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors text-base line-clamp-1 leading-snug">
                {job.title}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                <span className="font-semibold text-slate-700">{job.companyName}</span>
                {job.isVerifiedEmployer && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] bg-teal-100 text-teal-800 font-bold px-1.5 py-0.2 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-teal-600" />
                    Verified Employer
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveClick}
            className={`p-2 rounded-xl border text-slate-400 hover:text-teal-600 hover:border-teal-300 transition-colors ${
              saved ? 'text-teal-600 bg-teal-50 border-teal-300' : 'border-slate-200'
            }`}
            title={saved ? 'Saved' : 'Save Job'}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-teal-600 text-teal-600' : ''}`} />
          </button>
        </div>

        {/* Salary Banner */}
        <div className="my-3 flex items-center justify-between bg-teal-50/70 border border-teal-100/80 rounded-xl px-3 py-2 text-slate-900">
          <div className="flex items-center gap-1 font-black text-sm text-teal-900">
            <IndianRupee className="w-4 h-4 text-teal-700 shrink-0" />
            <span>
              ₹{job.minSalary.toLocaleString('en-IN')} – ₹{job.maxSalary.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] font-normal text-teal-700">/{job.payPeriod ? job.payPeriod.toLowerCase() : 'month'}</span>
          </div>

          {/* HireMatch score badge */}
          <div className="bg-teal-700 text-white font-extrabold text-[11px] px-2.5 py-0.5 rounded-lg shadow-xs">
            {matchResult.score}% Match
          </div>
        </div>

        {/* Location & Distance + Experience */}
        <div className="grid grid-cols-2 gap-y-1.5 text-xs text-slate-600 my-2">
          <div className="flex items-center gap-1.5 font-medium truncate">
            <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>

          <div className="flex items-center gap-1.5 font-bold text-teal-800">
            <Navigation className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>{job.distanceKm !== undefined ? `${job.distanceKm} km away` : '3.4 km away'}</span>
          </div>

          <div className="flex items-center gap-1.5 font-medium">
            <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{job.minExperience === 0 ? 'Fresher Accepted' : `${job.minExperience}+ years`}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-700 font-medium">
            <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0"></span>
            <span>{job.joiningDate || 'Immediate Joining'}</span>
          </div>
        </div>

        {/* Benefit Badges Requirement: ✓ PF, ✓ ESIC, ✓ Incentives */}
        <div className="flex items-center gap-1.5 flex-wrap my-3">
          {job.benefits && job.benefits.length > 0 ? (
            job.benefits.slice(0, 3).map((benefit, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-200/80"
              >
                <Check className="w-3 h-3 text-teal-600 stroke-[3]" />
                {benefit}
              </span>
            ))
          ) : (
            <>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                <Check className="w-3 h-3 text-teal-600 stroke-[3]" /> PF
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                <Check className="w-3 h-3 text-teal-600 stroke-[3]" /> ESIC
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                <Check className="w-3 h-3 text-teal-600 stroke-[3]" /> Incentives
              </span>
            </>
          )}

          {job.isUrgent && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black bg-teal-900 text-teal-200 uppercase tracking-wide">
              <Flame className="w-3 h-3 text-teal-300 fill-teal-300" />
              QuickHire
            </span>
          )}
        </div>
      </div>

      {/* Footer: Apply Now */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
        <span className="text-[10px] text-slate-400 font-medium">Posted {job.postedTime}</span>
        <button
          onClick={handleApplyClick}
          className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-xl text-xs font-black shadow-sm transition-colors flex items-center gap-1.5"
        >
          <span>Apply Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
