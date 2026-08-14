import React, { useState } from 'react';
import { MatchResult } from '../../utils/hireMatch';
import { Sparkles, CheckCircle2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface MatchScoreProps {
  match: MatchResult;
  compact?: boolean;
  showDetails?: boolean;
}

export const MatchScore: React.FC<MatchScoreProps> = ({ match, compact = false, showDetails = false }) => {
  const [expanded, setExpanded] = useState(showDetails);

  // Score color grading
  const getScoreColor = (score: number) => {
    if (score >= 85) return { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', badgeBg: 'bg-teal-600' };
    if (score >= 70) return { bg: 'bg-teal-50/70', text: 'text-teal-700', border: 'border-teal-100', badgeBg: 'bg-teal-600' };
    if (score >= 55) return { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', badgeBg: 'bg-amber-600' };
    return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', badgeBg: 'bg-slate-600' };
  };

  const style = getScoreColor(match.score);

  if (compact) {
    return (
      <div className="bg-teal-50 text-teal-700 px-2 py-1 rounded-lg border border-teal-100 flex items-center gap-1">
        <span className="text-xs font-black leading-none">{match.score}%</span>
        <span className="text-[8px] font-bold uppercase tracking-tight text-teal-600">Match</span>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border ${style.border} ${style.bg} p-3.5 transition-all shadow-xs`}>
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl ${style.badgeBg} text-white font-black text-xs flex items-center justify-center shadow-xs`}>
            {match.score}%
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>HireMatch™ Score</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 uppercase">Demo AI</span>
            </div>
            <p className="text-[11px] text-slate-500">Calculated via location, skills & salary compatibility</p>
          </div>
        </div>

        <button className="text-slate-400 hover:text-slate-600 p-1">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-3 pt-2.5 border-t border-slate-200/80 space-y-1.5">
          {match.reasons.map((reason, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs">
              {reason.positive ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              )}
              <span className={reason.positive ? 'text-slate-700 font-medium' : 'text-slate-500'}>
                {reason.text}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
