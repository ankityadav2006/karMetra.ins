import React, { useState } from 'react';
import { RecruitmentRequirement, Submission, CandidateProfile } from '../../types';
import { storageService } from '../../services/storage';
import { RequirementModal } from './RequirementModal';
import { BulkUploadModal } from './BulkUploadModal';
import { StatusBadge } from '../common/StatusBadge';
import {
  Users,
  Layers,
  IndianRupee,
  CheckCircle2,
  TrendingUp,
  Plus,
  Upload,
  Building,
  Briefcase,
  FileSpreadsheet,
} from 'lucide-react';

interface RecruiterDashboardProps {
  requirements: RecruitmentRequirement[];
  submissions: Submission[];
  candidates: CandidateProfile[];
  onOpenCandidateSearch: () => void;
  onOpenChat: (name: string) => void;
}

export const RecruiterDashboard: React.FC<RecruiterDashboardProps> = ({
  requirements,
  submissions,
  candidates,
  onOpenCandidateSearch,
  onOpenChat,
}) => {
  const [showReqModal, setShowReqModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [reqList, setReqList] = useState<RecruitmentRequirement[]>(requirements);
  const [dashboardToast, setDashboardToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setDashboardToast(msg);
    setTimeout(() => setDashboardToast(null), 4000);
  };

  const pipelineStages = ['New', 'Screened', 'Shortlisted', 'Submitted', 'Interview', 'Selected', 'Joined'];

  // Total revenue calculated from joined placements
  const totalPayout = submissions.reduce((sum, s) => sum + (s.payoutAmount || 1500), 0);

  return (
    <div className="space-y-6">
      {dashboardToast && (
        <div className="bg-emerald-600 text-white font-bold text-xs p-3 rounded-xl shadow-lg flex items-center justify-between animate-in fade-in">
          <span>✓ {dashboardToast}</span>
          <button onClick={() => setDashboardToast(null)} className="text-white/80 hover:text-white font-bold text-xs">✕</button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-400" />
            <h1 className="text-xl font-bold">Recruiter & Agency Marketplace</h1>
            <span className="text-[10px] bg-emerald-500/30 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-400/30">
              Agency Partner
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Fulfill client hiring mandates, submit screened candidates & track placement commissions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBulkModal(true)}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors border border-white/20"
          >
            <Upload className="w-4 h-4 text-emerald-300" /> Bulk Candidate CSV
          </button>
          <button
            onClick={() => setShowReqModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" /> Create Mandate Requirement
          </button>
        </div>
      </div>

      {/* KPI Revenue Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Open Mandates</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{reqList.length}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">Active Client Contracts</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Submissions</span>
          <p className="text-2xl font-black text-teal-700 mt-1">{submissions.length}</p>
          <span className="text-[10px] text-slate-500 font-medium">In client pipeline</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Successful Hires</span>
          <p className="text-2xl font-black text-emerald-700 mt-1">18</p>
          <span className="text-[10px] text-emerald-600 font-semibold">Candidates Joined</span>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-2xl border border-emerald-200 shadow-xs">
          <span className="text-[10px] font-bold text-emerald-800 uppercase">Agency Commission</span>
          <p className="text-2xl font-black text-emerald-800 mt-1">₹{totalPayout.toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-emerald-700 font-bold">Earned this month (Demo)</span>
        </div>
      </div>

      {/* Candidate Submission Pipeline Visual */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-600" /> Agency Candidate Submission Pipeline
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-7 gap-1 text-center text-[11px]">
          {pipelineStages.map((stage, idx) => (
            <div key={stage} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-800 block">{stage}</span>
              <span className="text-[10px] text-emerald-700 font-semibold">
                {idx === 0 ? 45 : idx === 1 ? 32 : idx === 2 ? 24 : idx === 3 ? 18 : idx === 4 ? 12 : idx === 5 ? 8 : 18} candidates
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Active Requirements List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs text-xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-800 flex items-center justify-between">
          <span>Active Client Mandate Requirements</span>
          <button onClick={onOpenCandidateSearch} className="text-emerald-700 font-bold hover:underline">
            Search & Submit Candidates →
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {reqList.map((req) => (
            <div key={req.id} className="p-4 flex flex-wrap items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-sm">{req.title}</h4>
                  <span className="bg-amber-100 text-amber-900 font-bold text-[10px] px-2 py-0.2 rounded">
                    {req.urgency}
                  </span>
                </div>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Client: <strong className="text-slate-800">{req.clientName}</strong> • {req.location} • {req.openings} Openings
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="font-black text-emerald-700 text-sm">₹{req.payoutPerHire?.toLocaleString('en-IN') || '1,500'}</span>
                  <span className="block text-[10px] text-slate-400">Payout per hire</span>
                </div>

                <button
                  onClick={onOpenCandidateSearch}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg"
                >
                  Match & Submit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <RequirementModal
        isOpen={showReqModal}
        onClose={() => setShowReqModal(false)}
        onRequirementCreated={(newReq) => setReqList([newReq, ...reqList])}
      />

      <BulkUploadModal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        onUploadComplete={(count) => showToast(`Successfully imported ${count} candidate profiles to agency database.`)}
      />
    </div>
  );
};
