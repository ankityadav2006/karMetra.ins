import React, { useState } from 'react';
import { Job, CandidateProfile } from '../../types';
import { calculateHireMatch } from '../../utils/hireMatch';
import { storageService } from '../../services/storage';
import { MatchScore } from '../common/MatchScore';
import { AntiFraudBanner } from '../common/AntiFraudBanner';
import {
  X,
  Building2,
  MapPin,
  IndianRupee,
  Briefcase,
  Clock,
  CheckCircle2,
  Zap,
  Bookmark,
  Share2,
  Phone,
  Flame,
  ShieldCheck,
  Calendar,
  Users,
  Navigation,
} from 'lucide-react';

interface JobDetailsModalProps {
  job: Job | null;
  candidateProfile: CandidateProfile;
  onClose: () => void;
  onApplySuccess: () => void;
  onOpenChat: (recruiterName: string) => void;
}

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
  job,
  candidateProfile,
  onClose,
  onApplySuccess,
  onOpenChat,
}) => {
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);

  if (!job) return null;

  const matchResult = calculateHireMatch(candidateProfile, job);

  const handleOneTapApply = () => {
    setApplying(true);
    setTimeout(() => {
      storageService.applyForJob(candidateProfile, job, matchResult.score);
      setApplying(false);
      setApplied(true);
      onApplySuccess();
    }, 600);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full my-auto shadow-2xl border border-slate-200 overflow-hidden relative max-h-[92vh] flex flex-col animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-300 hover:text-white p-1.5 bg-black/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md text-white text-3xl font-bold flex items-center justify-center shrink-0 border border-white/20 shadow-inner">
              {job.companyLogo || '🏢'}
            </div>
            <div className="flex-1 pr-6">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" />
                  {job.companyName}
                </span>
                {job.isVerifiedEmployer && (
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Verified Employer
                  </span>
                )}
              </div>

              <h1 className="text-lg sm:text-xl font-black text-white leading-snug">{job.title}</h1>

              <p className="text-xs text-slate-300 mt-1 flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {job.location}
                </span>
                {job.distanceKm && (
                  <span className="text-teal-300 font-medium">({job.distanceKm} km away)</span>
                )}
              </p>
            </div>
          </div>

          {/* Quick Badges row */}
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            {job.isUrgent && (
              <span className="bg-amber-500 text-white font-bold text-xs px-2.5 py-0.5 rounded-md flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-white" /> QuickHire • Urgent Opening
              </span>
            )}
            {job.isWalkIn && (
              <span className="bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 font-semibold text-xs px-2.5 py-0.5 rounded-md">
                Walk-In Interview
              </span>
            )}
            <span className="bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-xs font-medium px-2.5 py-0.5 rounded-md">
              {job.jobType} • {job.workMode}
            </span>
          </div>
        </div>

        {/* Content Scrollable */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-slate-800 text-xs">
          {/* Anti-Fraud Banner */}
          <AntiFraudBanner job={job} />

          {/* HireMatch Score Breakdown */}
          <MatchScore match={matchResult} showDetails />

          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Monthly Salary</span>
              <p className="text-sm font-black text-emerald-700 mt-0.5">
                ₹{job.minSalary.toLocaleString('en-IN')} - ₹{job.maxSalary.toLocaleString('en-IN')}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Est. Annual: ₹{(job.minSalary * 12 / 100000).toFixed(2)}L - ₹{(job.maxSalary * 12 / 100000).toFixed(2)}L</p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Experience</span>
              <p className="text-sm font-bold text-slate-800 mt-0.5">
                {job.minExperience === 0 ? 'Fresher Allowed' : `${job.minExperience}-${job.maxExperience} Years`}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Role level requirement</p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Total Openings</span>
              <p className="text-sm font-bold text-slate-800 mt-0.5">{job.openings} Openings</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Active vacancies</p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Joining Date</span>
              <p className="text-sm font-bold text-teal-700 mt-0.5">{job.joiningDate || 'Immediate'}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Expected availability</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-bold text-sm text-slate-900 mb-2">Job Overview</h3>
            <p className="text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100">
              {job.description}
            </p>
          </div>

          {/* Skills Required */}
          <div>
            <h3 className="font-bold text-sm text-slate-900 mb-2">Skills Required</h3>
            <div className="flex flex-wrap gap-2">
              {job.skillsRequired.map((skill, idx) => (
                <span key={idx} className="bg-emerald-50 text-emerald-900 font-semibold px-3 py-1 rounded-lg border border-emerald-200">
                  ✓ {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Responsibilities */}
          {job.responsibilities.length > 0 && (
            <div>
              <h3 className="font-bold text-sm text-slate-900 mb-2">Key Responsibilities</h3>
              <ul className="space-y-1.5 list-disc list-inside text-slate-700 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                {job.responsibilities.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {job.benefits.length > 0 && (
            <div>
              <h3 className="font-bold text-sm text-slate-900 mb-2">Perks & Benefits</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {job.benefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-emerald-50/50 text-emerald-900 rounded-lg border border-emerald-100 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Person */}
          <div className="p-3.5 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Hiring Manager Contact</span>
              <p className="font-bold text-slate-800 mt-0.5">{job.recruiterName || job.contactPerson || 'KarMetra Verified Recruiter'}</p>
              <p className="text-[11px] text-slate-500">{job.contactPhone || '+91 98765 00000'}</p>
            </div>

            <button
              onClick={() => onOpenChat(job.recruiterName || 'KarMetra Recruiter')}
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Phone className="w-3.5 h-3.5" /> Chat / Contact
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => storageService.toggleSaveJob(job.id)}
            className="p-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl font-bold flex items-center justify-center transition-colors"
            title="Save Job"
          >
            <Bookmark className="w-4 h-4" />
          </button>

          {applied ? (
            <div className="flex-1 py-3 bg-emerald-100 text-emerald-800 font-bold rounded-xl text-center text-xs flex items-center justify-center gap-2 border border-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Application Sent Successfully!
            </div>
          ) : (
            <button
              onClick={handleOneTapApply}
              disabled={applying}
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-white" />
              {applying ? 'Submitting Application...' : 'Apply in 10 Seconds (One-Tap)'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
