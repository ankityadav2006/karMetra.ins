import React, { useState } from 'react';
import { Job, Application, CandidateProfile, Company, RecruiterProfile, User } from '../../types';
import { storageService } from '../../services/storage';
import { useI18n } from '../../utils/i18n';
import { CreateJobModal } from '../employer/CreateJobModal';
import { CandidateSearch } from '../employer/CandidateSearch';
import { EmployerProfileView } from '../employer/EmployerProfileView';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Search,
  Building2,
  Plus,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  CalendarCheck,
  Eye,
  Edit2,
  Trash2,
  PauseCircle,
  PlayCircle,
  Copy,
  AlertTriangle,
  FileText,
  UserCheck,
  ChevronRight,
  ShieldCheck,
  ArrowRight,
  Filter,
} from 'lucide-react';

interface RecruiterAppProps {
  currentUser: User;
  jobs: Job[];
  applications: Application[];
  candidates: CandidateProfile[];
  companies: Company[];
  onOpenCreateJob: () => void;
  onOpenCandidateSearch: () => void;
  onSelectCandidate: (candidate: CandidateProfile) => void;
  onSelectJob: (job: Job) => void;
  initialSubTab?: 'dashboard' | 'jobs' | 'pipeline' | 'candidates' | 'company';
}

export const RecruiterApp: React.FC<RecruiterAppProps> = ({
  currentUser,
  jobs,
  applications,
  candidates,
  companies,
  onOpenCreateJob,
  onOpenCandidateSearch,
  onSelectCandidate,
  onSelectJob,
  initialSubTab = 'dashboard',
}) => {
  const { t } = useI18n();
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'jobs' | 'pipeline' | 'candidates' | 'company'>(
    initialSubTab
  );

  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [filterJobCategory, setFilterJobCategory] = useState<string>('All');
  const [selectedJobForPipeline, setSelectedJobForPipeline] = useState<string>('all');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const activeJobs = jobs.filter((j) => j.status === 'Active' && j.approvalStatus === 'Approved');
  const pendingJobs = jobs.filter((j) => j.approvalStatus === 'Pending Admin Review' || j.status === 'Pending Admin Review');
  const totalApplicants = applications.length;
  const shortlistedApps = applications.filter((a) => a.status === 'Shortlisted');
  const interviewApps = applications.filter((a) => a.status === 'Interview');
  const selectedApps = applications.filter((a) => a.status === 'Selected');

  // Pipeline Stages
  const pipelineStages: { stage: Application['status']; label: string; count: number; color: string }[] = [
    {
      stage: 'Applied',
      label: 'New Applied',
      count: applications.filter((a) => a.status === 'Applied').length,
      color: 'bg-blue-50 text-blue-900 border-blue-200',
    },
    {
      stage: 'Viewed',
      label: 'Screening',
      count: applications.filter((a) => a.status === 'Viewed').length,
      color: 'bg-indigo-50 text-indigo-900 border-indigo-200',
    },
    {
      stage: 'Shortlisted',
      label: 'Shortlisted',
      count: shortlistedApps.length,
      color: 'bg-amber-50 text-amber-900 border-amber-200',
    },
    {
      stage: 'Interview',
      label: 'Interviews',
      count: interviewApps.length,
      color: 'bg-purple-50 text-purple-900 border-purple-200',
    },
    {
      stage: 'Selected',
      label: 'Selected & Hired',
      count: selectedApps.length,
      color: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    },
  ];

  const handleMoveCandidateStage = (appId: string, newStage: Application['status']) => {
    storageService.updateApplicationStatus(appId, newStage);
    triggerToast(`Candidate moved to ${newStage} stage.`);
  };

  const handleDeleteJob = () => {
    if (!jobToDelete) return;
    storageService.deleteJob(jobToDelete.id, 'Deleted by employer from workspace');
    setJobToDelete(null);
    triggerToast('✓ Job moved to Recycle Bin (hidden from candidate search).');
  };

  const handleDuplicateJob = (job: Job) => {
    const duplicated: Partial<Job> = {
      ...job,
      title: `${job.title} (Copy)`,
      openings: job.openings,
      postedTime: 'Just now',
    };
    storageService.addJob(duplicated);
    triggerToast('✓ Job duplicated successfully and submitted for admin review.');
  };

  const handlePauseJob = (job: Job) => {
    storageService.suspendJob(job.id, 'Paused by recruiter');
    triggerToast(`Job "${job.title}" paused.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-teal-900 text-white font-bold text-xs px-4 py-2.5 rounded-2xl shadow-xl border border-teal-700 animate-in slide-in-from-top-2">
          {toastMessage}
        </div>
      )}

      {/* Recruiter App Sub-Navigation Bar */}
      <div className="bg-white rounded-2xl border border-teal-100 shadow-xs p-2 flex items-center justify-between overflow-x-auto gap-1">
        <div className="flex items-center gap-1 min-w-max">
          <button
            onClick={() => setActiveSubTab('dashboard')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'dashboard'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Overview & Stats</span>
          </button>

          <button
            onClick={() => setActiveSubTab('jobs')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'jobs'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Manage Jobs ({jobs.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('pipeline')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'pipeline'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Hiring Pipeline (ATS)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('candidates')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'candidates'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Candidate Search & AI Match</span>
          </button>

          <button
            onClick={() => setActiveSubTab('company')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'company'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Company & Verification</span>
          </button>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2 pl-2">
          <button
            onClick={onOpenCreateJob}
            className="px-4 py-2 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white rounded-xl text-xs font-black shadow-sm flex items-center gap-1.5 transition-all shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('recruiter.postNewJob', 'Post a Job')}</span>
          </button>
        </div>
      </div>

      {/* SUB-VIEW 1: RECRUITER DASHBOARD OVERVIEW */}
      {activeSubTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-teal-800/80 relative overflow-hidden flex flex-wrap items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>Verified Employer ATS • ID: {currentUser.karmetraId || 'KM-EMP-10245'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                {currentUser.name}’s Hiring Control Center
              </h1>
              <p className="text-xs sm:text-sm text-teal-100/90">
                AI candidate matching, multi-channel frontline job distribution, and candidate pipeline management.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveSubTab('candidates')}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 flex items-center gap-2 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-teal-300" />
                <span>AI Candidate Search</span>
              </button>

              <button
                onClick={onOpenCreateJob}
                className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-teal-950 text-xs font-black shadow-md flex items-center gap-2 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Post Job with AI</span>
              </button>
            </div>
          </div>

          {/* KPI Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-teal-100 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Active Jobs</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{activeJobs.length}</p>
              <span className="text-[10px] text-teal-700 font-semibold">Live on Platform</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-teal-100 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Under Review</span>
              <p className="text-2xl font-black text-amber-600 mt-1">{pendingJobs.length}</p>
              <span className="text-[10px] text-amber-700 font-semibold">Admin SLA &lt;2h</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-teal-100 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total Applicants</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{totalApplicants}</p>
              <span className="text-[10px] text-slate-500 font-semibold">Across all jobs</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-teal-100 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Shortlisted</span>
              <p className="text-2xl font-black text-indigo-600 mt-1">{shortlistedApps.length}</p>
              <span className="text-[10px] text-indigo-700 font-semibold">Ready for interview</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-teal-100 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Interviews</span>
              <p className="text-2xl font-black text-purple-600 mt-1">{interviewApps.length}</p>
              <span className="text-[10px] text-purple-700 font-semibold">Scheduled</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-teal-100 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Hired / Joined</span>
              <p className="text-2xl font-black text-emerald-600 mt-1">{selectedApps.length}</p>
              <span className="text-[10px] text-emerald-700 font-semibold">Success</span>
            </div>
          </div>

          {/* Quick Pipeline Preview */}
          <div className="bg-white rounded-3xl border border-teal-100 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-teal-600" />
                  <span>Hiring Pipeline Stage Breakdown</span>
                </h3>
                <p className="text-xs text-slate-500">Track candidates moving through screening to onboarding</p>
              </div>

              <button
                onClick={() => setActiveSubTab('pipeline')}
                className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
              >
                <span>Open Full ATS Pipeline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {pipelineStages.map((st) => (
                <div key={st.stage} className={`p-4 rounded-2xl border ${st.color} flex flex-col justify-between`}>
                  <p className="text-xs font-bold uppercase">{st.label}</p>
                  <p className="text-2xl font-black mt-2">{st.count}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: MANAGE JOBS */}
      {activeSubTab === 'jobs' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-teal-100 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-slate-900">Your Posted Jobs ({jobs.length})</h3>
              <p className="text-xs text-slate-500">Manage live listings, edit details, and track applicant counts</p>
            </div>

            <button
              onClick={onOpenCreateJob}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post a New Job</span>
            </button>
          </div>

          {jobs.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center space-y-3">
              <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700">No Job Postings Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Create your first job posting to start receiving verified candidate applications.
              </p>
              <button
                onClick={onOpenCreateJob}
                className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold"
              >
                Post a Job Now
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => {
                const jobApplicants = applications.filter((a) => a.jobId === job.id);
                const isApproved = job.approvalStatus === 'Approved' || job.status === 'Active';
                const isPending = job.approvalStatus === 'Pending Admin Review' || job.status === 'Pending Admin Review';

                return (
                  <div
                    key={job.id}
                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:border-teal-300 transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {isApproved && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            ✓ Live & Approved
                          </span>
                        )}
                        {isPending && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-700" />
                            Pending Admin Review
                          </span>
                        )}
                        {job.status === 'Closed' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                            Closed / Paused
                          </span>
                        )}
                        <span className="text-xs text-slate-500">{job.category}</span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500">{job.location}</span>
                      </div>

                      <h4
                        onClick={() => onSelectJob(job)}
                        className="text-base font-black text-slate-900 hover:text-teal-700 cursor-pointer"
                      >
                        {job.title}
                      </h4>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                        <span>
                          ₹{job.minSalary.toLocaleString('en-IN')} - ₹{job.maxSalary.toLocaleString('en-IN')}/{job.payPeriod}
                        </span>
                        <span>•</span>
                        <span>{job.openings} Openings</span>
                        <span>•</span>
                        <span>{job.workMode}</span>
                        <span>•</span>
                        <span className="font-bold text-teal-800">{jobApplicants.length} Applicants</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        onClick={() => onSelectJob(job)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>

                      <button
                        onClick={() => handleDuplicateJob(job)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1"
                        title="Duplicate Job"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </button>

                      <button
                        onClick={() => handlePauseJob(job)}
                        className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold flex items-center gap-1"
                        title="Pause Job"
                      >
                        <PauseCircle className="w-3.5 h-3.5" />
                        <span>Pause</span>
                      </button>

                      <button
                        onClick={() => setJobToDelete(job)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1"
                        title="Delete Job"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUB-VIEW 3: HIRING PIPELINE (ATS) */}
      {activeSubTab === 'pipeline' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-teal-100 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-slate-900">Visual Hiring Pipeline ATS</h3>
              <p className="text-xs text-slate-500">
                Manage candidate flow from initial application through screening, interview, and selection.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 overflow-x-auto">
            {pipelineStages.map((col) => {
              const stageApps = applications.filter((a) => a.status === col.stage);

              return (
                <div key={col.stage} className="bg-slate-50 rounded-2xl p-3 border border-slate-200 space-y-3 min-w-[200px]">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="text-xs font-black text-slate-800">{col.label}</span>
                    <span className="text-xs font-black px-2 py-0.5 rounded-full bg-white text-slate-700 shadow-xs border">
                      {stageApps.length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {stageApps.length === 0 ? (
                      <p className="text-[11px] text-slate-400 text-center py-6">No candidates in this stage</p>
                    ) : (
                      stageApps.map((app) => (
                        <div
                          key={app.id}
                          className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs space-y-2 hover:border-teal-400 transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-100">
                              {app.matchScore || 88}% Match
                            </span>
                            <span className="text-[10px] text-slate-400">{app.appliedDate}</span>
                          </div>

                          <div>
                            <p className="text-xs font-black text-slate-900">{app.candidateName}</p>
                            <p className="text-[11px] text-slate-500 truncate">{app.candidateTitle || 'Candidate'}</p>
                            <p className="text-[10px] text-teal-700 font-semibold mt-0.5">Applied: {app.jobTitle}</p>
                          </div>

                          {/* Move to next stage quick buttons */}
                          <div className="flex items-center gap-1 pt-1 border-t border-slate-100">
                            {col.stage === 'Applied' && (
                              <button
                                onClick={() => handleMoveCandidateStage(app.id, 'Viewed')}
                                className="w-full py-1 text-[10px] font-bold bg-indigo-50 text-indigo-800 rounded-lg hover:bg-indigo-100"
                              >
                                → Screen
                              </button>
                            )}
                            {col.stage === 'Viewed' && (
                              <button
                                onClick={() => handleMoveCandidateStage(app.id, 'Shortlisted')}
                                className="w-full py-1 text-[10px] font-bold bg-amber-50 text-amber-900 rounded-lg hover:bg-amber-100"
                              >
                                → Shortlist
                              </button>
                            )}
                            {col.stage === 'Shortlisted' && (
                              <button
                                onClick={() => handleMoveCandidateStage(app.id, 'Interview')}
                                className="w-full py-1 text-[10px] font-bold bg-purple-50 text-purple-900 rounded-lg hover:bg-purple-100"
                              >
                                → Interview
                              </button>
                            )}
                            {col.stage === 'Interview' && (
                              <button
                                onClick={() => handleMoveCandidateStage(app.id, 'Selected')}
                                className="w-full py-1 text-[10px] font-bold bg-emerald-50 text-emerald-900 rounded-lg hover:bg-emerald-100"
                              >
                                → Select / Hire
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: CANDIDATE SEARCH & AI MATCH */}
      {activeSubTab === 'candidates' && (
        <CandidateSearch
          candidates={candidates}
          onSelectCandidate={onSelectCandidate}
          onOpenChat={(name) => triggerToast(`Initiating conversation with ${name}`)}
        />
      )}

      {/* SUB-VIEW 5: COMPANY PROFILE & VERIFICATION */}
      {activeSubTab === 'company' && (
        <EmployerProfileView
          company={companies[0]}
          onUpdateCompany={(updated) => {
            storageService.updateCompanyVerification(updated.id, updated);
            triggerToast('Company profile and verification details updated.');
          }}
        />
      )}

      {/* DELETE JOB CONFIRMATION MODAL */}
      {jobToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-slate-900">{t('recruiter.deleteConfirmTitle', 'Delete Job Posting?')}</h3>
              <p className="text-xs text-slate-600">
                Are you sure you want to delete <strong className="text-slate-900">"{jobToDelete.title}"</strong>?
              </p>
              <p className="text-xs text-slate-500">
                {t(
                  'recruiter.deleteConfirmDesc',
                  'This job will be immediately moved to the Recycle Bin and hidden from candidates. You can restore it anytime.'
                )}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setJobToDelete(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteJob}
                className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm"
              >
                Yes, Delete Job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
