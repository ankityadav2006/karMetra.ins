import React from 'react';
import { ApplicationStatus, SubmissionStatus, InterviewStatus } from '../../types';

interface StatusBadgeProps {
  status: ApplicationStatus | SubmissionStatus | InterviewStatus | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let style = 'bg-slate-100 text-slate-700 border-slate-200';

  switch (status) {
    case 'Applied':
    case 'New':
      style = 'bg-blue-50 text-blue-700 border-blue-200';
      break;
    case 'Viewed':
    case 'Screened':
      style = 'bg-indigo-50 text-indigo-700 border-indigo-200';
      break;
    case 'Shortlisted':
    case 'Submitted':
      style = 'bg-teal-50 text-teal-800 border-teal-200';
      break;
    case 'Interview':
    case 'Pending':
      style = 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse';
      break;
    case 'Selected':
    case 'Accepted':
    case 'Joined':
      style = 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold';
      break;
    case 'Rejected':
    case 'Declined':
      style = 'bg-rose-50 text-rose-700 border-rose-200';
      break;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}>
      ● {status}
    </span>
  );
};
