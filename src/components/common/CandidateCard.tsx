import React from 'react';
import { CandidateProfile } from '../../types';
import { MapPin, Briefcase, IndianRupee, Clock, CheckCircle2, Phone, Mail, MessageSquare } from 'lucide-react';

interface CandidateCardProps {
  candidate: CandidateProfile;
  onSelect: (cand: CandidateProfile) => void;
  onShortlist?: (cand: CandidateProfile) => void;
  onContact?: (cand: CandidateProfile) => void;
  shortlisted?: boolean;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  onSelect,
  onShortlist,
  onContact,
  shortlisted = false,
}) => {
  return (
    <div
      onClick={() => onSelect(candidate)}
      className="bg-white rounded-2xl border border-slate-200 hover:border-teal-400 shadow-sm transition-all p-5 cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={candidate.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={candidate.name}
                className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-xs"
              />
              {candidate.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-teal-600 text-white rounded-full p-0.5" title="Verified Candidate">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-bold text-slate-800 hover:text-teal-700 text-base">
                {candidate.name}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-1">{candidate.title}</p>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-block bg-teal-50 text-teal-700 border border-teal-100 text-xs font-bold px-2.5 py-1 rounded-full">
              {candidate.profileStrength}% Strength
            </span>
          </div>
        </div>

        {/* Info pills */}
        <div className="grid grid-cols-2 gap-2 my-3 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 font-medium">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{candidate.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{candidate.experienceYears} yrs experience</span>
          </div>
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <IndianRupee className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>₹{candidate.expectedSalary.toLocaleString('en-IN')}/mo</span>
          </div>
          <div className="flex items-center gap-1.5 text-teal-700 font-medium">
            <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>{candidate.availability}</span>
          </div>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 my-2">
          {candidate.skills.slice(0, 4).map((s, i) => (
            <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
              {s}
            </span>
          ))}
          {candidate.skills.length > 4 && (
            <span className="text-[10px] text-slate-400">+{candidate.skills.length - 4}</span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onContact) onContact(candidate);
          }}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-colors shadow-xs"
        >
          <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
          Chat
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onShortlist) onShortlist(candidate);
          }}
          className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded-xl transition-colors ${
            shortlisted
              ? 'bg-teal-50 text-teal-700 border border-teal-200'
              : 'bg-teal-600 hover:bg-teal-700 text-white shadow-xs'
          }`}
        >
          {shortlisted ? '✓ Shortlisted' : 'Shortlist Candidate'}
        </button>
      </div>
    </div>
  );
};
