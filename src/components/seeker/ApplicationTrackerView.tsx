import React from 'react';
import { Application, ApplicationStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Briefcase, Building2, Calendar, Clock, CheckCircle2, ChevronRight, MessageSquare, AlertCircle } from 'lucide-react';

interface ApplicationTrackerViewProps {
  applications: Application[];
  onOpenChat: (recruiterName: string) => void;
}

export const ApplicationTrackerView: React.FC<ApplicationTrackerViewProps> = ({
  applications,
  onOpenChat,
}) => {
  const pipelineSteps: ApplicationStatus[] = ['Applied', 'Viewed', 'Shortlisted', 'Interview', 'Selected'];

  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-md mx-auto my-10 space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-2xl font-bold">
          📥
        </div>
        <h3 className="font-bold text-slate-800 text-lg">No Applications Yet</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Start applying to jobs that match your profile. One-Tap apply takes less than 10 seconds!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Application Tracking Pipeline</h1>
          <p className="text-xs text-slate-500">Real-time status updates from recruiters & hiring employers</p>
        </div>
        <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
          {applications.length} Active Applications
        </span>
      </div>

      <div className="space-y-4">
        {applications.map((app) => {
          const currentStepIdx = pipelineSteps.indexOf(app.status);

          return (
            <div key={app.id} className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
              {/* Top Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-800 text-2xl font-bold flex items-center justify-center border border-emerald-100">
                    {app.companyLogo || '🏢'}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">{app.jobTitle}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {app.companyName} • Applied on {app.appliedDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge status={app.status} />
                  <button
                    onClick={() => onOpenChat(app.companyName)}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1"
                    title="Chat with Recruiter"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                  </button>
                </div>
              </div>

              {/* Visual Pipeline Bar */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="text-[11px] font-bold text-slate-500 uppercase mb-3">Recruitment Stage Progress:</div>

                <div className="relative flex items-center justify-between">
                  {/* Connecting Line */}
                  <div className="absolute top-1/2 left-4 right-4 h-1 bg-slate-200 -translate-y-1/2 z-0" />

                  {pipelineSteps.map((step, idx) => {
                    const isPassed = idx <= currentStepIdx;
                    const isCurrent = idx === currentStepIdx;

                    return (
                      <div key={step} className="relative z-10 flex flex-col items-center">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                            isCurrent
                              ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-md scale-110'
                              : isPassed
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {isPassed ? '✓' : idx + 1}
                        </div>
                        <span
                          className={`text-[10px] mt-1.5 font-bold ${
                            isCurrent ? 'text-emerald-700 font-extrabold' : isPassed ? 'text-slate-800' : 'text-slate-400'
                          }`}
                        >
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent History Notes */}
              {app.statusHistory.length > 0 && (
                <div className="text-xs text-slate-600 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">Latest Update: </span>
                    <span>{app.statusHistory[app.statusHistory.length - 1].note || `Status updated to ${app.status}`}</span>
                    <span className="text-[10px] text-slate-400 ml-2">
                      ({app.statusHistory[app.statusHistory.length - 1].updatedAt})
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
