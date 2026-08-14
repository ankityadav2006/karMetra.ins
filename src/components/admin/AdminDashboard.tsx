import React, { useState } from 'react';
import { User, Job, AntiFraudAlert, VerificationStatus, Company, RecruiterProfile } from '../../types';
import { storageService } from '../../services/storage';
import { useI18n } from '../../utils/i18n';
import {
  ShieldAlert,
  Users,
  Building2,
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Check,
  X,
  RefreshCw,
  Search,
  Eye,
  Ban,
} from 'lucide-react';

interface AdminDashboardProps {
  users: User[];
  jobs: Job[];
  fraudAlerts: AntiFraudAlert[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  users,
  jobs: initialJobs,
  fraudAlerts: initialAlerts,
}) => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'verification' | 'job_approval' | 'fraud' | 'users'>('job_approval');
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [fraudAlerts, setFraudAlerts] = useState<AntiFraudAlert[]>(initialAlerts);
  const [companies, setCompanies] = useState<Company[]>(() => storageService.getCompanies());
  const [recruiters, setRecruiters] = useState<RecruiterProfile[]>(() => storageService.getRecruiters());
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Filter pending jobs for Admin Approval Queue
  const pendingJobs = jobs.filter((j) => j.approvalStatus === 'Pending Admin Review' || j.status === 'Pending Admin Review');
  const liveJobs = jobs.filter((j) => j.approvalStatus === 'Approved');

  const triggerToast = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(null), 3500);
  };

  const handleApproveJob = (jobId: string) => {
    storageService.approveJob(jobId);
    setJobs(storageService.getJobs());
    triggerToast('✓ Job posting approved by Admin! Now publicly live.');
  };

  const handleRejectJob = (jobId: string) => {
    storageService.rejectJob(jobId, 'Information requires additional verification');
    setJobs(storageService.getJobs());
    triggerToast('Job rejected and feedback sent to poster.');
  };

  const handleApproveCompany = (companyId: string) => {
    storageService.approveCompanyVerification(companyId);
    setCompanies(storageService.getCompanies());
    triggerToast('✓ Employer verification approved! Verified Badge granted.');
  };

  const handleRejectCompany = (companyId: string) => {
    storageService.rejectCompanyVerification(companyId, 'Document verification incomplete');
    setCompanies(storageService.getCompanies());
    triggerToast('Employer verification rejected.');
  };

  const handleApproveRecruiter = (recruiterId: string) => {
    storageService.approveRecruiterVerification(recruiterId);
    setRecruiters(storageService.getRecruiters());
    triggerToast('✓ Recruiter verification approved! Verified Badge granted.');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-teal-950 border border-teal-800 rounded-3xl p-6 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-teal-300" />
            <h1 className="text-2xl font-black tracking-tight">{t('admin.title')}</h1>
            <span className="text-[10px] bg-teal-800 text-teal-200 font-extrabold px-2.5 py-0.5 rounded-full border border-teal-600">
              Super Admin
            </span>
          </div>
          <p className="text-xs text-teal-200/90 mt-1">
            Review GST/PAN verification documents, approve pending job postings, and manage user trust & safety.
          </p>
        </div>

        {actionSuccessMsg && (
          <div className="bg-teal-500 text-teal-950 font-black text-xs px-4 py-2 rounded-2xl shadow-lg animate-in fade-in">
            {actionSuccessMsg}
          </div>
        )}
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-teal-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Pending Job Approvals</span>
          <p className="text-3xl font-black text-teal-900 mt-1">{pendingJobs.length}</p>
          <span className="text-[10px] text-teal-700 font-bold flex items-center gap-1">
            <Clock className="w-3 h-3 text-teal-600" /> SLA Target: &lt;2 Hours
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-teal-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Live Public Jobs</span>
          <p className="text-3xl font-black text-teal-700 mt-1">{liveJobs.length}</p>
          <span className="text-[10px] text-teal-600 font-semibold">✓ Verified & Live</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-teal-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Employers Registered</span>
          <p className="text-3xl font-black text-slate-900 mt-1">{companies.length}</p>
          <span className="text-[10px] text-teal-700 font-semibold">GST / PAN Verified</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-teal-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Fraud Safety Reports</span>
          <p className="text-3xl font-black text-amber-700 mt-1">{fraudAlerts.length}</p>
          <span className="text-[10px] text-amber-700 font-semibold">Flagged for Audit</span>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-teal-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('job_approval')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
            activeTab === 'job_approval'
              ? 'bg-teal-700 text-white shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:border-teal-400'
          }`}
        >
          <Clock className="w-4 h-4 text-teal-300" />
          Job Approval Queue ({pendingJobs.length})
        </button>

        <button
          onClick={() => setActiveTab('verification')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
            activeTab === 'verification'
              ? 'bg-teal-700 text-white shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:border-teal-400'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-teal-300" />
          Employer & Recruiter Verification
        </button>

        <button
          onClick={() => setActiveTab('fraud')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
            activeTab === 'fraud'
              ? 'bg-teal-700 text-white shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:border-teal-400'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          Anti-Fraud Safety Reports ({fraudAlerts.length})
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
            activeTab === 'users'
              ? 'bg-teal-700 text-white shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:border-teal-400'
          }`}
        >
          <Users className="w-4 h-4 text-teal-300" />
          User Database ({users.length})
        </button>
      </div>

      {/* TAB 1: JOB APPROVAL QUEUE */}
      {activeTab === 'job_approval' && (
        <div className="bg-white rounded-3xl border border-teal-200 overflow-hidden shadow-xs text-xs">
          <div className="p-4 bg-teal-900 text-white font-black flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-teal-300" />
              Pending Job Approval Queue — Requires Admin Review Before Public Listing
            </span>
            <span className="text-[11px] bg-teal-800 text-teal-200 px-2.5 py-1 rounded-xl font-bold border border-teal-700">
              Rule: Unapproved jobs are NOT visible on public search!
            </span>
          </div>

          {pendingJobs.length === 0 ? (
            <div className="p-8 text-center text-slate-500 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-teal-600 mx-auto" />
              <p className="font-bold text-slate-800 text-sm">Queue Clear!</p>
              <p className="text-xs">All submitted job postings have been reviewed and processed.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {pendingJobs.map((j) => (
                <div key={j.id} className="p-5 space-y-3 hover:bg-teal-50/40 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="bg-amber-100 text-amber-800 font-extrabold px-2 py-0.5 rounded text-[10px]">
                          Pending Admin Review
                        </span>
                        <h3 className="font-black text-slate-900 text-base">{j.title}</h3>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 font-semibold">
                        Company: <span className="text-teal-800">{j.companyName}</span> • Submitted: {j.submittedAt || 'Recently'} • Category: {j.category}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-sm font-black text-teal-900">₹{j.minSalary.toLocaleString('en-IN')} - ₹{j.maxSalary.toLocaleString('en-IN')}</p>
                      <p className="text-[10px] text-slate-500">{j.location} • {j.openings} Openings</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-700 text-xs">
                    <p className="font-bold text-slate-800 mb-1">Job Description & Requirements:</p>
                    <p className="line-clamp-2">{j.description}</p>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => handleRejectJob(j.id)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5"
                    >
                      <X className="w-3.5 h-3.5 text-slate-500" />
                      Reject Job
                    </button>
                    <button
                      onClick={() => handleApproveJob(j.id)}
                      className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
                    >
                      <Check className="w-4 h-4 text-white" />
                      Approve & Publish Live
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: EMPLOYER & RECRUITER VERIFICATION */}
      {activeTab === 'verification' && (
        <div className="space-y-6">
          {/* Employers Section */}
          <div className="bg-white rounded-3xl border border-teal-200 overflow-hidden shadow-xs text-xs">
            <div className="p-4 bg-teal-900 text-white font-black flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm">
                <Building2 className="w-4 h-4 text-teal-300" />
                Employer GST & Business Verification Requests
              </span>
              <span className="text-[11px] bg-teal-800 text-teal-200 px-2.5 py-0.5 rounded-xl font-bold">
                Admin Control
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {companies.map((emp) => (
                <div key={emp.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-teal-50/30">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-black text-slate-900 text-sm">{emp.name}</h4>
                      <span className="bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-md text-[10px]">
                        ID: {emp.karmetraId}
                      </span>
                      {emp.isVerified ? (
                        <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md text-[10px]">
                          ✓ Verified Employer
                        </span>
                      ) : (
                        <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-md text-[10px]">
                          Pending Approval
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 font-medium">
                      Contact: {emp.contactPerson} ({emp.designation}) • Email: {emp.companyEmail} • Phone: {emp.companyPhone}
                    </p>
                    <p className="text-slate-500 text-[11px]">
                      GSTIN: <strong>{emp.gstin}</strong> • PAN: <strong>{emp.pan}</strong> • Location: {emp.location}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {!emp.isVerified ? (
                      <>
                        <button
                          onClick={() => handleRejectCompany(emp.id)}
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleApproveCompany(emp.id)}
                          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-xl text-xs flex items-center gap-1 shadow-xs"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Approve Verified Badge
                        </button>
                      </>
                    ) : (
                      <span className="text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Active Verified Status
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recruiters Section */}
          <div className="bg-white rounded-3xl border border-teal-200 overflow-hidden shadow-xs text-xs">
            <div className="p-4 bg-teal-900 text-white font-black flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-teal-300" />
                Recruiting Agency & Staffing Partner Verifications
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {recruiters.map((rec) => (
                <div key={rec.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-teal-50/30">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-black text-slate-900 text-sm">{rec.agencyLegalName}</h4>
                      <span className="bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-md text-[10px]">
                        ID: {rec.karmetraId}
                      </span>
                      {rec.isVerified ? (
                        <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md text-[10px]">
                          ✓ Verified Recruiter
                        </span>
                      ) : (
                        <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-md text-[10px]">
                          Pending Approval
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 font-medium">
                      Lead Recruiter: {rec.recruiterName} • Email: {rec.businessEmail} • Phone: {rec.contactNumber}
                    </p>
                    <p className="text-slate-500 text-[11px]">
                      PAN: <strong>{rec.pan}</strong> • Categories: {rec.recruitmentCategories.join(', ')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {!rec.isVerified ? (
                      <button
                        onClick={() => handleApproveRecruiter(rec.id)}
                        className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-xl text-xs flex items-center gap-1 shadow-xs"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Approve Recruiter Badge
                      </button>
                    ) : (
                      <span className="text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Active Verified Status
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ANTI-FRAUD & SAFETY REPORTS */}
      {activeTab === 'fraud' && (
        <div className="bg-white rounded-3xl border border-teal-200 overflow-hidden shadow-xs text-xs">
          <div className="p-4 bg-amber-500 text-teal-950 font-black flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm">
              <AlertTriangle className="w-5 h-5 text-teal-950" />
              KarMetra Anti-Fraud Safety & Candidate Protection Audit Log
            </span>
            <span className="text-[10px] bg-teal-950 text-white px-2.5 py-1 rounded-xl font-bold">
              Automated Safety Engine Active
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {fraudAlerts.map((alert) => (
              <div key={alert.id} className="p-5 space-y-2 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-100 text-amber-900 font-black px-2 py-0.5 rounded text-[10px]">
                      {alert.riskScore} Risk Score
                    </span>
                    <h4 className="font-black text-slate-900 text-sm">{alert.jobTitle}</h4>
                  </div>
                  <span className="text-slate-400 text-[10px]">Reported: {alert.reportedAt}</span>
                </div>

                <p className="text-slate-700 font-bold">Flag Reason: {alert.reason}</p>
                <p className="text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 font-medium">
                  {alert.details}
                </p>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setFraudAlerts(fraudAlerts.filter((a) => a.id !== alert.id));
                      triggerToast('Suspicious listing suspended & employer warned.');
                    }}
                    className="px-4 py-2 bg-amber-600 text-white font-extrabold rounded-xl text-xs shadow-xs"
                  >
                    Remove Listing & Suspend Account
                  </button>
                  <button
                    onClick={() => {
                      setFraudAlerts(fraudAlerts.filter((a) => a.id !== alert.id));
                      triggerToast('Audit cleared: marked as verified authentic.');
                    }}
                    className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
                  >
                    Dismiss Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: USERS DATABASE */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-teal-200 overflow-hidden shadow-xs text-xs">
          <div className="p-4 bg-teal-900 text-white font-black text-sm">
            Registered Platform Users Directory
          </div>

          <div className="divide-y divide-slate-100">
            {users.map((u) => (
              <div key={u.id} className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-black text-slate-900 text-sm">{u.name}</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    {u.email} • Mobile: {u.phone} • Role: <span className="font-bold text-teal-800 capitalize">{u.role}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {u.isVerified ? (
                    <span className="bg-teal-100 text-teal-800 font-extrabold px-3 py-1 rounded-xl text-[10px] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Verified
                    </span>
                  ) : (
                    <span className="bg-slate-100 text-slate-600 font-bold px-3 py-1 rounded-xl text-[10px]">
                      Standard Account
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
