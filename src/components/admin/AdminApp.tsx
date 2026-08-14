import React, { useState, useMemo } from 'react';
import {
  User,
  Job,
  AntiFraudAlert,
  Company,
  RecruiterProfile,
  DeletedJob,
  AdminActivityLog,
  UserReport,
} from '../../types';
import { storageService } from '../../services/storage';
import { useI18n } from '../../utils/i18n';
import { AdminLearningManagement } from './AdminLearningManagement';
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
  Trash2,
  RotateCcw,
  Layers,
  Activity,
  UserCheck,
  FileCheck,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  Briefcase,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Filter,
  GraduationCap,
} from 'lucide-react';

interface AdminAppProps {
  users: User[];
  jobs: Job[];
  fraudAlerts: AntiFraudAlert[];
  onSelectJob?: (job: Job) => void;
}

export const AdminApp: React.FC<AdminAppProps> = ({
  users: initialUsers,
  jobs: initialJobs,
  fraudAlerts: initialAlerts,
  onSelectJob,
}) => {
  const { t } = useI18n();
  const [activeSubTab, setActiveSubTab] = useState<
    'overview' | 'approvals' | 'verifications' | 'all_jobs' | 'recycle_bin' | 'users' | 'fraud' | 'learning_management' | 'logs'
  >('overview');

  // Live data states from storageService
  const [jobs, setJobs] = useState<Job[]>(() => storageService.getJobs());
  const [users, setUsers] = useState<User[]>(() => storageService.getUsers());
  const [companies, setCompanies] = useState<Company[]>(() => storageService.getCompanies());
  const [recruiters, setRecruiters] = useState<RecruiterProfile[]>(() => storageService.getRecruiters());
  const [deletedJobs, setDeletedJobs] = useState<DeletedJob[]>(() => storageService.getDeletedJobs());
  const [adminLogs, setAdminLogs] = useState<AdminActivityLog[]>(() => storageService.getAdminLogs());
  const [userReports, setUserReports] = useState<UserReport[]>(() => storageService.getReports());

  // Search & Filter in Subtabs
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'seeker' | 'recruiter' | 'employer' | 'suspended'>('all');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [logFilterAction, setLogFilterAction] = useState<string>('all');
  const [logSearchQuery, setLogSearchQuery] = useState('');
  const [jobSearchQuery, setJobSearchQuery] = useState('');

  // Modals & Overlays
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const [selectedDocPreview, setSelectedDocPreview] = useState<{ title: string; docUrl?: string; gstin?: string; pan?: string } | null>(null);
  const [selectedUserModal, setSelectedUserModal] = useState<User | null>(null);
  const [inspectJobModal, setInspectJobModal] = useState<Job | null>(null);
  const [actionReasonModal, setActionReasonModal] = useState<{
    jobId: string;
    jobTitle: string;
    actionType: 'reject' | 'request_changes' | 'flag';
  } | null>(null);
  const [actionReasonText, setActionReasonText] = useState('');

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const reloadData = () => {
    setJobs(storageService.getJobs());
    setUsers(storageService.getUsers());
    setCompanies(storageService.getCompanies());
    setRecruiters(storageService.getRecruiters());
    setDeletedJobs(storageService.getDeletedJobs());
    setAdminLogs(storageService.getAdminLogs());
    setUserReports(storageService.getReports());
  };

  // Pending queues
  const pendingJobs = useMemo(
    () => jobs.filter((j) => j.approvalStatus === 'Pending Admin Review' || j.status === 'Pending Admin Review'),
    [jobs]
  );
  const liveJobs = useMemo(
    () => jobs.filter((j) => j.approvalStatus === 'Approved' || j.status === 'Active'),
    [jobs]
  );
  const pendingCompanyVerifications = useMemo(
    () => companies.filter((c) => c.verificationStatus === 'Pending Verification' || !c.isVerified),
    [companies]
  );

  // Job Actions
  const handleApproveJob = (jobId: string) => {
    storageService.approveJob(jobId);
    reloadData();
    triggerToast('✓ Job posting approved & published to public platform.');
  };

  const handleOpenActionModal = (job: Job, actionType: 'reject' | 'request_changes' | 'flag') => {
    setActionReasonModal({
      jobId: job.id,
      jobTitle: job.title,
      actionType,
    });
    setActionReasonText(
      actionType === 'reject'
        ? 'Requires additional salary, location, or company verification.'
        : actionType === 'request_changes'
        ? 'Please refine the job description and clarify shift timings.'
        : 'Suspicious job posting flagged for fraud review.'
    );
  };

  const handleConfirmJobAction = () => {
    if (!actionReasonModal) return;
    const { jobId, actionType } = actionReasonModal;

    if (actionType === 'reject') {
      storageService.rejectJob(jobId, actionReasonText);
      triggerToast('Job rejected and revision feedback sent to poster.');
    } else if (actionType === 'request_changes') {
      storageService.rejectJob(jobId, `Changes requested: ${actionReasonText}`);
      triggerToast('Change request note sent to poster.');
    } else if (actionType === 'flag') {
      const targetJob = jobs.find((j) => j.id === jobId);
      storageService.reportJobFraud(
        jobId,
        targetJob?.title || 'Flagged Job',
        targetJob?.companyName || 'Employer',
        'Flagged by Super Admin',
        actionReasonText
      );
      triggerToast('Job flagged and logged in Anti-Fraud console.');
    }

    setActionReasonModal(null);
    setActionReasonText('');
    reloadData();
  };

  const handleDeleteJob = () => {
    if (!jobToDelete) return;
    storageService.deleteJob(jobToDelete.id, 'Moderated and deleted by Super Admin');
    setJobToDelete(null);
    reloadData();
    triggerToast('✓ Job moved to Recycle Bin.');
  };

  const handleRestoreJob = (recordId: string) => {
    storageService.restoreJob(recordId);
    reloadData();
    triggerToast('✓ Job restored back to active platform listings!');
  };

  const handlePermanentPurge = (recordId: string) => {
    storageService.permanentDeleteJob(recordId);
    reloadData();
    triggerToast('Job permanently purged from database.');
  };

  const handleApproveCompany = (companyId: string) => {
    storageService.approveCompanyVerification(companyId);
    reloadData();
    triggerToast('✓ Employer verification approved! Verified Badge issued.');
  };

  const handleToggleUserSuspend = (userId: string, isCurrentlyActive: boolean) => {
    if (isCurrentlyActive) {
      storageService.suspendUser(userId, 'Suspended by Super Admin for platform safety review');
      triggerToast('User account suspended.');
    } else {
      storageService.activateUser(userId);
      triggerToast('User account reactivated.');
    }
    reloadData();
  };

  // Filtered Users List
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (userRoleFilter === 'seeker' && u.role !== 'seeker') return false;
      if (userRoleFilter === 'recruiter' && u.role !== 'recruiter') return false;
      if (userRoleFilter === 'employer' && u.role !== 'employer') return false;
      if (userRoleFilter === 'suspended' && u.isVerified !== false) return false;

      if (userSearchQuery.trim()) {
        const q = userSearchQuery.toLowerCase();
        const matchesName = u.name.toLowerCase().includes(q);
        const matchesEmail = u.email?.toLowerCase().includes(q);
        const matchesPhone = u.phone?.includes(q);
        if (!matchesName && !matchesEmail && !matchesPhone) return false;
      }
      return true;
    });
  }, [users, userRoleFilter, userSearchQuery]);

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    return adminLogs.filter((log) => {
      if (logFilterAction !== 'all' && log.action !== logFilterAction) return false;
      if (logSearchQuery.trim()) {
        const q = logSearchQuery.toLowerCase();
        const matchesTarget = log.targetName.toLowerCase().includes(q);
        const matchesDetails = log.details.toLowerCase().includes(q);
        const matchesAdmin = log.adminName.toLowerCase().includes(q);
        if (!matchesTarget && !matchesDetails && !matchesAdmin) return false;
      }
      return true;
    });
  }, [adminLogs, logFilterAction, logSearchQuery]);

  // Filtered Platform Jobs
  const filteredPlatformJobs = useMemo(() => {
    return jobs.filter((j) => {
      if (jobSearchQuery.trim()) {
        const q = jobSearchQuery.toLowerCase();
        return (
          j.title.toLowerCase().includes(q) ||
          j.companyName.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q) ||
          j.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [jobs, jobSearchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-teal-900 text-white font-bold text-xs px-4 py-2.5 rounded-2xl shadow-xl border border-teal-700 animate-in slide-in-from-top-2 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-300" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Admin App Sub-Navigation Bar */}
      <div className="bg-white rounded-2xl border border-teal-100 shadow-xs p-2 flex items-center justify-between overflow-x-auto gap-1">
        <div className="flex items-center gap-1 min-w-max">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'overview'
                ? 'bg-teal-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>Admin Overview</span>
          </button>

          <button
            onClick={() => setActiveSubTab('approvals')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'approvals'
                ? 'bg-teal-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Job Approvals Queue</span>
            {pendingJobs.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500 text-white font-bold animate-pulse">
                {pendingJobs.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('verifications')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'verifications'
                ? 'bg-teal-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Verifications Queue</span>
            {pendingCompanyVerifications.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-teal-600 text-white font-bold">
                {pendingCompanyVerifications.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('all_jobs')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'all_jobs'
                ? 'bg-teal-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Platform Jobs ({jobs.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('recycle_bin')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'recycle_bin'
                ? 'bg-teal-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
            <span>Recycle Bin ({deletedJobs.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('users')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'users'
                ? 'bg-teal-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Users & Moderation</span>
          </button>

          <button
            onClick={() => setActiveSubTab('fraud')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'fraud'
                ? 'bg-teal-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
            <span>Reports & Anti-Fraud ({userReports.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('learning_management')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'learning_management'
                ? 'bg-teal-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-teal-400" />
            <span>Karmetra Academy & Certs</span>
          </button>

          <button
            onClick={() => setActiveSubTab('logs')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'logs'
                ? 'bg-teal-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Activity Logs ({adminLogs.length})</span>
          </button>
        </div>
      </div>

      {/* SUB-VIEW 1: ADMIN OVERVIEW WITH INTERACTIVE KPI CARDS */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-teal-800 flex flex-wrap items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>Super Admin Authorization Active</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Super Admin Moderation Console</h1>
              <p className="text-xs sm:text-sm text-teal-200/90">
                Platform trust & safety, employer verification audits, and job approval management.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveSubTab('approvals')}
                className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-teal-950 font-black text-xs shadow-md flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <Clock className="w-4 h-4" />
                <span>Review Jobs Queue ({pendingJobs.length})</span>
              </button>
            </div>
          </div>

          {/* Metric KPI Grid — ALL CARDS DIRECTLY CLICKABLE */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Card 1: Pending Approvals */}
            <div
              onClick={() => setActiveSubTab('approvals')}
              className="bg-white p-5 rounded-2xl border border-teal-100 shadow-xs hover:border-teal-500 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Pending Job Approvals</span>
                <Clock className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-3xl font-black text-amber-600 mt-1">{pendingJobs.length}</p>
              <span className="text-[10px] text-amber-700 font-bold flex items-center gap-1 mt-1">
                Click to inspect queue →
              </span>
            </div>

            {/* Card 2: Live Public Jobs */}
            <div
              onClick={() => setActiveSubTab('all_jobs')}
              className="bg-white p-5 rounded-2xl border border-teal-100 shadow-xs hover:border-teal-500 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Live Public Jobs</span>
                <CheckCircle2 className="w-4 h-4 text-teal-500 group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-3xl font-black text-teal-700 mt-1">{liveJobs.length}</p>
              <span className="text-[10px] text-teal-600 font-semibold mt-1 block">
                Click to view all jobs →
              </span>
            </div>

            {/* Card 3: Total Users */}
            <div
              onClick={() => setActiveSubTab('users')}
              className="bg-white p-5 rounded-2xl border border-teal-100 shadow-xs hover:border-teal-500 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Total Users</span>
                <Users className="w-4 h-4 text-slate-600 group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-3xl font-black text-slate-900 mt-1">{users.length}</p>
              <span className="text-[10px] text-slate-500 font-semibold mt-1 block">
                Click for user moderation →
              </span>
            </div>

            {/* Card 4: Recycle Bin */}
            <div
              onClick={() => setActiveSubTab('recycle_bin')}
              className="bg-white p-5 rounded-2xl border border-teal-100 shadow-xs hover:border-rose-400 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Recycle Bin</span>
                <Trash2 className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-3xl font-black text-rose-600 mt-1">{deletedJobs.length}</p>
              <span className="text-[10px] text-rose-700 font-semibold mt-1 block">
                Click to restore items →
              </span>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setActiveSubTab('verifications')}
              className="bg-teal-50 border border-teal-200 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-teal-100/70 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-teal-950">Employer Verification Queue</h4>
                  <p className="text-[11px] text-teal-800">
                    {pendingCompanyVerifications.length} company GST/PAN documents awaiting verification
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-teal-800">Inspect →</span>
            </div>

            <div
              onClick={() => setActiveSubTab('fraud')}
              className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-amber-100/70 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-amber-950">Anti-Fraud & Incident Reports</h4>
                  <p className="text-[11px] text-amber-800">
                    {userReports.length} candidate reports filed for platform audit
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-amber-800">Inspect →</span>
            </div>
          </div>

          {/* Recent Activity Log Quick Preview */}
          <div className="bg-white rounded-3xl border border-teal-100 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-600" />
                <span>Recent Platform Audit Events</span>
              </h3>
              <button
                onClick={() => setActiveSubTab('logs')}
                className="text-xs font-bold text-teal-700 hover:text-teal-800 cursor-pointer"
              >
                View Full Log ({adminLogs.length}) →
              </button>
            </div>

            <div className="space-y-2">
              {adminLogs.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs hover:bg-slate-100 transition-colors"
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-900">
                      <span className="text-teal-700 font-black">[{log.action}]</span> {log.targetName}
                    </p>
                    <p className="text-[11px] text-slate-500">{log.details}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-500 font-medium block">{log.timestamp}</span>
                    <span className="text-[10px] text-slate-400">{log.adminName}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: JOB APPROVALS QUEUE (WITH VIEW, APPROVE, REJECT, REQUEST CHANGES, FLAG) */}
      {activeSubTab === 'approvals' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-teal-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-slate-900">Pending Job Approval Queue ({pendingJobs.length})</h3>
              <p className="text-xs text-slate-500">
                Jobs must pass admin quality & anti-fraud inspection before appearing on public search.
              </p>
            </div>

            <button
              onClick={reloadData}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh Queue
            </button>
          </div>

          {pendingJobs.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h4 className="text-sm font-bold text-slate-800">Job Review Queue is Clear</h4>
              <p className="text-xs text-slate-500">All submitted jobs have been reviewed and approved.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs space-y-3 hover:border-teal-400 transition-all"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                          ⏳ Pending Admin Review
                        </span>
                        <span className="text-xs text-slate-500 font-bold">{job.category}</span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" /> {job.location}
                        </span>
                      </div>

                      <h4 className="text-base font-black text-slate-900">{job.title}</h4>

                      <p className="text-xs text-slate-600 font-medium">
                        Employer: <strong className="text-slate-900">{job.companyName}</strong> ({job.recruiterName || 'HR'}) • Salary: ₹{job.minSalary.toLocaleString('en-IN')} - ₹{job.maxSalary.toLocaleString('en-IN')}/{job.payPeriod} • Openings: {job.openings}
                      </p>
                    </div>

                    {/* Complete Action Buttons */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => setInspectJobModal(job)}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Job</span>
                      </button>

                      <button
                        onClick={() => handleApproveJob(job.id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-xs flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>Approve & Live</span>
                      </button>

                      <button
                        onClick={() => handleOpenActionModal(job, 'request_changes')}
                        className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Request Changes</span>
                      </button>

                      <button
                        onClick={() => handleOpenActionModal(job, 'reject')}
                        className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1.5"
                      >
                        <X className="w-4 h-4" />
                        <span>Reject</span>
                      </button>

                      <button
                        onClick={() => handleOpenActionModal(job, 'flag')}
                        className="px-2.5 py-2 bg-slate-100 hover:bg-amber-100 text-amber-700 rounded-xl text-xs font-bold"
                        title="Flag for fraud review"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-1">
                    <p className="font-semibold text-slate-800">Job Description Preview:</p>
                    <p className="text-[11px] text-slate-600 line-clamp-2">{job.description}</p>
                    <div className="flex flex-wrap items-center gap-1 pt-1">
                      <span className="text-[10px] font-bold text-slate-500">Skills Required:</span>
                      {job.skillsRequired.map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-medium text-slate-700">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-VIEW 3: VERIFICATIONS QUEUE (GST/PAN DOCS) */}
      {activeSubTab === 'verifications' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-teal-100 shadow-xs">
            <h3 className="text-base font-black text-slate-900">Employer & Recruiter Verification Queue</h3>
            <p className="text-xs text-slate-500">
              Inspect GSTIN, PAN, and corporate documents to grant Verified Employer badges.
            </p>
          </div>

          <div className="space-y-3">
            {companies.map((comp) => {
              const isVerified = comp.verificationStatus === 'Verified' || comp.isVerified;

              return (
                <div
                  key={comp.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-teal-300 transition-all"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{comp.logo || '🏢'}</span>
                      <h4 className="text-base font-black text-slate-900">{comp.name}</h4>
                      {isVerified ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                          ✓ Verified Employer
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          Pending Verification
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600">
                      GSTIN: <strong className="text-slate-900 font-mono">{comp.gstin || '27AAAAA0000A1Z5'}</strong> • PAN: <strong className="text-slate-900 font-mono">{comp.pan || 'AAAPA1234F'}</strong> • Location: {comp.location}
                    </p>
                    <p className="text-[11px] text-slate-500">{comp.about}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() =>
                        setSelectedDocPreview({
                          title: comp.name,
                          gstin: comp.gstin || '27AAAAA0000A1Z5',
                          pan: comp.pan || 'AAAPA1234F',
                        })
                      }
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Docs</span>
                    </button>

                    {!isVerified ? (
                      <button
                        onClick={() => handleApproveCompany(comp.id)}
                        className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs"
                      >
                        Grant Verified Badge
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-700 font-bold px-2 py-1 bg-emerald-50 rounded-lg">
                        Active & Verified
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: ALL PLATFORM JOBS */}
      {activeSubTab === 'all_jobs' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-teal-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-slate-900">All Platform Jobs ({jobs.length})</h3>
              <p className="text-xs text-slate-500">Live directory of all active and moderated job listings.</p>
            </div>

            <div className="w-full sm:w-64 flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={jobSearchQuery}
                onChange={(e) => setJobSearchQuery(e.target.value)}
                placeholder="Search jobs..."
                className="w-full text-xs outline-none bg-transparent font-medium text-slate-800"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredPlatformJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-teal-300 transition-all"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        job.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {job.status}
                    </span>
                    <h4 className="text-sm font-black text-slate-900">{job.title}</h4>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {job.companyName} • {job.location} • ₹{job.minSalary.toLocaleString('en-IN')} - ₹{job.maxSalary.toLocaleString('en-IN')}/{job.payPeriod} • {job.jobType}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setInspectJobModal(job)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> View
                  </button>

                  <button
                    onClick={() => setJobToDelete(job)}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 5: RECYCLE BIN (DELETED JOBS WITH RESTORE & PURGE) */}
      {activeSubTab === 'recycle_bin' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-xs">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>Recycle Bin (Deleted Items: {deletedJobs.length})</span>
            </h3>
            <p className="text-xs text-slate-500">
              Soft-deleted jobs are preserved here. You can inspect details, restore them to active status, or permanently purge them.
            </p>
          </div>

          {deletedJobs.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center space-y-2">
              <Trash2 className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700">Recycle Bin is Empty</h4>
              <p className="text-xs text-slate-500">No soft-deleted jobs currently in the recycle bin.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {deletedJobs.map((record) => (
                <div
                  key={record.id}
                  className="bg-white p-5 rounded-2xl border border-rose-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-rose-100 text-rose-900 text-[10px] font-extrabold rounded-md uppercase">
                        Deleted
                      </span>
                      <h4 className="text-base font-black text-slate-900">{record.job.title}</h4>
                    </div>

                    <p className="text-xs text-slate-600">
                      Company: <strong className="text-slate-900">{record.job.companyName}</strong> • Location: {record.job.location}
                    </p>
                    <p className="text-[11px] text-rose-700 font-medium">
                      Deleted by {record.deletedBy} on {new Date(record.deletedAt).toLocaleString('en-IN')} • Reason: {record.reason || 'User requested'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleRestoreJob(record.id)}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restore Job</span>
                    </button>

                    <button
                      onClick={() => handlePermanentPurge(record.id)}
                      className="px-3 py-2 bg-slate-100 hover:bg-rose-50 text-rose-700 rounded-xl text-xs font-bold"
                    >
                      Purge
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-VIEW 6: USER MANAGEMENT & ACCESS CONTROL */}
      {activeSubTab === 'users' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-teal-100 shadow-xs space-y-3">
            <div>
              <h3 className="text-base font-black text-slate-900">User Moderation & Access Control ({users.length})</h3>
              <p className="text-xs text-slate-500">View registered users, inspect roles, issue verification badges, or suspend accounts.</p>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-1 overflow-x-auto">
                <button
                  onClick={() => setUserRoleFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    userRoleFilter === 'all' ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  All ({users.length})
                </button>
                <button
                  onClick={() => setUserRoleFilter('seeker')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    userRoleFilter === 'seeker' ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Seekers ({users.filter((u) => u.role === 'seeker').length})
                </button>
                <button
                  onClick={() => setUserRoleFilter('recruiter')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    userRoleFilter === 'recruiter' ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Recruiters ({users.filter((u) => u.role === 'recruiter').length})
                </button>
                <button
                  onClick={() => setUserRoleFilter('employer')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    userRoleFilter === 'employer' ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Employers ({users.filter((u) => u.role === 'employer').length})
                </button>
                <button
                  onClick={() => setUserRoleFilter('suspended')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    userRoleFilter === 'suspended' ? 'bg-rose-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Suspended ({users.filter((u) => u.isVerified === false).length})
                </button>
              </div>

              <div className="w-full sm:w-64 flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  placeholder="Search user name or email..."
                  className="w-full text-xs outline-none bg-transparent font-medium text-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {filteredUsers.map((u) => (
              <div
                key={u.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-teal-300 transition-all"
              >
                <div
                  onClick={() => setSelectedUserModal(u)}
                  className="space-y-0.5 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-black text-slate-900 hover:text-teal-700 transition-colors">
                      {u.name}
                    </p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">
                      {u.role}
                    </span>
                    {u.isVerified !== false ? (
                      <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active
                      </span>
                    ) : (
                      <span className="text-[10px] text-rose-600 font-bold flex items-center gap-1">
                        <Ban className="w-3 h-3 text-rose-600" /> Suspended
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">{u.email || u.phone} • Joined: {u.createdAt || '2026-01-01'}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setSelectedUserModal(u)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> Details
                  </button>

                  <button
                    onClick={() => handleToggleUserSuspend(u.id, u.isVerified !== false)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                      u.isVerified !== false
                        ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    {u.isVerified !== false ? 'Suspend' : 'Reactivate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 7: ANTI-FRAUD & REPORTS */}
      {activeSubTab === 'fraud' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-teal-100 shadow-xs">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Anti-Fraud & Incident Reports ({userReports.length})</span>
            </h3>
            <p className="text-xs text-slate-500">Review suspicious recruiter fee charges, fake jobs, or spam reports.</p>
          </div>

          <div className="space-y-3">
            {userReports.map((rep) => (
              <div key={rep.id} className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                    Category: {rep.category}
                  </span>
                  <span className="text-xs text-slate-400">{rep.createdAt}</span>
                </div>
                <h4 className="text-sm font-black text-slate-900">{rep.targetTitle}</h4>
                <p className="text-xs text-slate-600">{rep.description}</p>
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      storageService.updateReportStatus(rep.id, 'Resolved');
                      reloadData();
                      triggerToast('Report marked as resolved.');
                    }}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                  >
                    Mark Resolved
                  </button>
                  <button
                    onClick={() => {
                      storageService.updateReportStatus(rep.id, 'Dismissed');
                      reloadData();
                      triggerToast('Report dismissed.');
                    }}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 8: FULL PLATFORM AUDIT & ACTIVITY LEDGER */}
      {activeSubTab === 'logs' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-teal-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-600" />
                <span>Full Platform Audit & Activity Ledger ({adminLogs.length})</span>
              </h3>
              <p className="text-xs text-slate-500">Immutable ledger of all admin moderation and verification actions.</p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={logFilterAction}
                onChange={(e) => setLogFilterAction(e.target.value)}
                className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none"
              >
                <option value="all">All Action Types</option>
                <option value="APPROVE_JOB">APPROVE_JOB</option>
                <option value="REJECT_JOB">REJECT_JOB</option>
                <option value="DELETE_JOB">DELETE_JOB</option>
                <option value="RESTORE_JOB">RESTORE_JOB</option>
                <option value="VERIFY_COMPANY">VERIFY_COMPANY</option>
                <option value="SUSPEND_USER">SUSPEND_USER</option>
                <option value="ACTIVATE_USER">ACTIVATE_USER</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
            {filteredLogs.map((log) => (
              <div key={log.id} className="p-4 flex items-center justify-between text-xs hover:bg-slate-50">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-teal-800 font-extrabold bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                      {log.action}
                    </span>
                    <span className="font-bold text-slate-900">{log.targetName}</span>
                  </div>
                  <p className="text-slate-600">{log.details}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-slate-500 font-medium">{log.timestamp}</p>
                  <p className="text-[10px] text-slate-400">{log.adminName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 8: KARMETRA ACADEMY & LEARNING MANAGEMENT */}
      {activeSubTab === 'learning_management' && <AdminLearningManagement />}

      {/* INSPECT JOB MODAL */}
      {inspectJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-teal-700 uppercase">{inspectJobModal.category}</span>
                <h3 className="text-lg font-black text-slate-900">{inspectJobModal.title}</h3>
              </div>
              <button
                onClick={() => setInspectJobModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-medium">Company</span>
                <p className="font-bold text-slate-900 mt-0.5">{inspectJobModal.companyName}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-medium">Location</span>
                <p className="font-bold text-slate-900 mt-0.5">{inspectJobModal.location}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-medium">Salary</span>
                <p className="font-bold text-slate-900 mt-0.5">
                  ₹{inspectJobModal.minSalary.toLocaleString('en-IN')} - ₹{inspectJobModal.maxSalary.toLocaleString('en-IN')}/{inspectJobModal.payPeriod}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-medium">Work Mode</span>
                <p className="font-bold text-slate-900 mt-0.5">{inspectJobModal.workMode}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-medium">Experience</span>
                <p className="font-bold text-slate-900 mt-0.5">{inspectJobModal.minExperience}+ Years</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-medium">Openings</span>
                <p className="font-bold text-slate-900 mt-0.5">{inspectJobModal.openings} vacancies</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-900">Job Description</h4>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 leading-relaxed">
                {inspectJobModal.description}
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <h4 className="font-bold text-slate-900">Required Skills</h4>
              <div className="flex flex-wrap gap-1.5">
                {inspectJobModal.skillsRequired.map((s, i) => (
                  <span key={i} className="px-2.5 py-1 bg-teal-50 text-teal-800 border border-teal-200 rounded-lg font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setInspectJobModal(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleApproveJob(inspectJobModal.id);
                  setInspectJobModal(null);
                }}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs"
              >
                Approve Job
              </button>
            </div>
          </div>
        </div>
      )}

      {/* USER DETAILS MODAL */}
      {selectedUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">User Account Profile</h3>
              <button onClick={() => setSelectedUserModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Full Name</span>
                <p className="font-black text-slate-900 text-sm">{selectedUserModal.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Role</span>
                  <p className="font-bold text-teal-800 uppercase">{selectedUserModal.role}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Status</span>
                  <p className="font-bold text-slate-900">
                    {selectedUserModal.isVerified !== false ? '✓ Active & Verified' : 'Suspended'}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Contact Information</span>
                <p className="text-slate-700 font-medium">{selectedUserModal.email || 'No email'}</p>
                <p className="text-slate-700 font-medium">{selectedUserModal.phone || 'No phone'}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Registration Date</span>
                <p className="text-slate-700 font-medium">{selectedUserModal.createdAt || '2026-01-01'}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedUserModal(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleToggleUserSuspend(selectedUserModal.id, selectedUserModal.isVerified !== false);
                  setSelectedUserModal(null);
                }}
                className={`px-4 py-2 text-xs font-bold rounded-xl ${
                  selectedUserModal.isVerified !== false
                    ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {selectedUserModal.isVerified !== false ? 'Suspend Account' : 'Reactivate Account'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACTION REASON MODAL (FOR REJECT / REQUEST CHANGES / FLAG) */}
      {actionReasonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900">
                {actionReasonModal.actionType === 'reject'
                  ? 'Reject Job Posting'
                  : actionReasonModal.actionType === 'request_changes'
                  ? 'Request Changes from Poster'
                  : 'Flag for Anti-Fraud Review'}
              </h3>
              <button onClick={() => setActionReasonModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              Target Job: <strong className="text-slate-900">{actionReasonModal.jobTitle}</strong>
            </p>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Reason / Moderator Feedback Note:</label>
              <textarea
                value={actionReasonText}
                onChange={(e) => setActionReasonText(e.target.value)}
                rows={3}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-teal-500"
                placeholder="Enter feedback for the recruiter..."
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setActionReasonModal(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmJobAction}
                className={`px-4 py-2 text-xs font-bold text-white rounded-xl shadow-xs ${
                  actionReasonModal.actionType === 'reject'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : actionReasonModal.actionType === 'request_changes'
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : 'bg-slate-900 hover:bg-slate-800'
                }`}
              >
                Confirm Action
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {jobToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-slate-900">Delete Job Listing?</h3>
              <p className="text-xs text-slate-600">
                Are you sure you want to delete <strong className="text-slate-900">"{jobToDelete.title}"</strong>?
              </p>
              <p className="text-xs text-slate-500">
                It will be hidden from search and moved into the <strong>Admin Recycle Bin</strong> where you can restore it anytime.
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

      {/* GST/PAN DOC PREVIEW MODAL */}
      {selectedDocPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900">Verification Documents • {selectedDocPreview.title}</h3>
              <button onClick={() => setSelectedDocPreview(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <p className="font-bold text-slate-700">GST Registration Number</p>
                <p className="font-mono text-teal-800 font-extrabold text-sm">{selectedDocPreview.gstin}</p>
                <span className="text-[10px] text-emerald-700 font-bold">✓ Government GST Portal Valid Format</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <p className="font-bold text-slate-700">Permanent Account Number (PAN)</p>
                <p className="font-mono text-teal-800 font-extrabold text-sm">{selectedDocPreview.pan}</p>
                <span className="text-[10px] text-emerald-700 font-bold">✓ Verified Corporate Tax Entity</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedDocPreview(null)}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold"
            >
              Done & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
