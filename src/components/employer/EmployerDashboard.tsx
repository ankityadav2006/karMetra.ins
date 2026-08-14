import React, { useState } from 'react';
import { Job, Application, CandidateProfile } from '../../types';
import { storageService } from '../../services/storage';
import { StatusBadge } from '../common/StatusBadge';
import {
  Building,
  Briefcase,
  Users,
  CheckCircle2,
  Calendar,
  Plus,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  Search,
  Sparkles,
} from 'lucide-react';

interface EmployerDashboardProps {
  jobs: Job[];
  applications: Application[];
  candidates: CandidateProfile[];
  onOpenCreateJob: () => void;
  onOpenCandidateSearch: () => void;
  onOpenChat: (name: string) => void;
}

export const EmployerDashboard: React.FC<EmployerDashboardProps> = ({
  jobs,
  applications,
  candidates,
  onOpenCreateJob,
  onOpenCandidateSearch,
  onOpenChat,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'applicants'>('overview');

  const handleUpdateStatus = (appId: string, newStatus: Application['status']) => {
    storageService.updateApplicationStatus(appId, newStatus);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building className="w-6 h-6 text-emerald-400" />
            <h1 className="text-xl font-bold">Employer Control Center</h1>
            <span className="text-[10px] bg-emerald-500/30 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-400/30">
              Verified Hiring
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Manage job postings, review HireMatch candidates & schedule interviews
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCandidateSearch}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors border border-white/20"
          >
            <Search className="w-4 h-4 text-emerald-300" /> Search Candidates
          </button>
          <button
            onClick={onOpenCreateJob}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" /> Post New Job
          </button>
        </div>
      </div>

      {/* JOB POSTING ALLOWANCE & USAGE CARD */}
      {(() => {
        const entitlement = storageService.getPostingEntitlement();
        return (
          <div className="bg-white rounded-2xl border border-teal-200 p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-teal-800 tracking-wide">Job Posting Policy</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  entitlement.hasFreeAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {entitlement.hasFreeAvailable ? '1 Free Available This Week' : 'Free Posting Used'}
                </span>
              </div>
              <p className="text-xs text-slate-600">
                {entitlement.hasFreeAvailable ? (
                  <>Free posting: <strong className="text-slate-900">1 available this week</strong> • Additional job posting: <strong className="text-teal-800">₹299 / job</strong> • Job validity: <strong className="text-slate-900">30 Days</strong></>
                ) : (
                  <>Free posting: <strong className="text-amber-800">Used (0/1)</strong> • Next free posting: <strong className="text-teal-800">Available after {entitlement.daysUntilNextFree} days</strong> • Additional job: <strong className="text-slate-900">₹299</strong></>
                )}
              </p>
            </div>

            <button
              onClick={onOpenCreateJob}
              className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              {entitlement.hasFreeAvailable ? 'Post New Job (Free)' : 'Post New Job (₹299)'}
            </button>
          </div>
        );
      })()}

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Active Jobs</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{jobs.length}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">Active Listings</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Applications</span>
          <p className="text-2xl font-black text-slate-900 mt-1">1,250</p>
          <span className="text-[10px] text-emerald-600 font-semibold">+18% this week</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Shortlisted</span>
          <p className="text-2xl font-black text-teal-700 mt-1">320</p>
          <span className="text-[10px] text-slate-500 font-medium">Ready for interview</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Interviews</span>
          <p className="text-2xl font-black text-amber-700 mt-1">85</p>
          <span className="text-[10px] text-amber-600 font-semibold">Scheduled</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total Hires</span>
          <p className="text-2xl font-black text-emerald-700 mt-1">24</p>
          <span className="text-[10px] text-emerald-600 font-semibold">Successful Onboarding</span>
        </div>
      </div>

      {/* Recruitment Funnel Visual */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-600" /> Recruitment Funnel Overview
          </h3>
          <span className="text-xs text-slate-400 font-medium">Demo Data Metrics</span>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="h-2 bg-emerald-600 rounded-full mb-2 w-full" />
            <p className="font-bold text-slate-900">1,250</p>
            <p className="text-[10px] text-slate-500">Applications</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="h-2 bg-teal-600 rounded-full mb-2 w-[70%]" />
            <p className="font-bold text-slate-900">320</p>
            <p className="text-[10px] text-slate-500">Shortlisted</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="h-2 bg-amber-500 rounded-full mb-2 w-[40%]" />
            <p className="font-bold text-slate-900">85</p>
            <p className="text-[10px] text-slate-500">Interviews</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="h-2 bg-emerald-500 rounded-full mb-2 w-[20%]" />
            <p className="font-bold text-slate-900">24</p>
            <p className="text-[10px] text-slate-500">Hires</p>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'overview' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          Candidate Applications ({applications.length})
        </button>
        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'jobs' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          Active Job Listings ({jobs.length})
        </button>
      </div>

      {/* Tab 1: Applicants List */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs text-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-800 flex items-center justify-between">
            <span>Incoming Applications Queue</span>
            <span className="text-[11px] text-slate-500 font-normal">Ranked by HireMatch™ AI compatibility</span>
          </div>

          <div className="divide-y divide-slate-100">
            {applications.map((app) => (
              <div key={app.id} className="p-4 flex flex-wrap items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm border border-emerald-200">
                    {app.candidateName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900">{app.candidateName}</h4>
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-1.5 py-0.2 rounded">
                        {app.matchScore}% Match
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Applied for <strong className="text-slate-800">{app.jobTitle}</strong> • {app.appliedDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge status={app.status} />

                  <select
                    value={app.status}
                    onChange={(e) => handleUpdateStatus(app.id, e.target.value as Application['status'])}
                    className="p-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold outline-none"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Viewed">Viewed</option>
                    <option value="Shortlisted">Shortlist</option>
                    <option value="Interview">Interview</option>
                    <option value="Selected">Select / Hire</option>
                    <option value="Rejected">Reject</option>
                  </select>

                  <button
                    onClick={() => onOpenChat(app.candidateName)}
                    className="p-2 bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 rounded-lg font-bold"
                    title="Chat"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Active Jobs List */}
      {activeTab === 'jobs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((j) => (
            <div key={j.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{j.title}</h3>
                  <p className="text-xs text-slate-500">{j.location} • ₹{j.minSalary.toLocaleString('en-IN')} - ₹{j.maxSalary.toLocaleString('en-IN')}</p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded">
                  {j.status}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                <span>{j.openings} Openings</span>
                <span>Posted {j.postedTime}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
