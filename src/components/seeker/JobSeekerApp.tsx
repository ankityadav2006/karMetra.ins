import React, { useState } from 'react';
import { Job, CandidateProfile, Application, Interview, Company, User } from '../../types';
import { useI18n } from '../../utils/i18n';
import { JobCard } from '../common/JobCard';
import { JobFilterSearch } from './JobFilterSearch';
import { ApplicationTrackerView } from './ApplicationTrackerView';
import { JobSeekerProfileView } from './JobSeekerProfileView';
import { CareerCoachView } from './CareerCoachView';
import { MessagesPage } from './MessagesPage';
import { NotificationsPage } from './NotificationsPage';
import { CareerGuidancePage } from './CareerGuidancePage';
import { LearningCatalogPage } from './LearningCatalogPage';
import { CoursePlayerPage } from './CoursePlayerPage';
import { MyCoursesPage } from './MyCoursesPage';
import { MyCertificatesPage } from './MyCertificatesPage';
import { CertificateVerificationPage } from '../common/CertificateVerificationPage';
import {
  LayoutDashboard,
  Search,
  Briefcase,
  Bookmark,
  CalendarCheck,
  Sparkles,
  User as UserIcon,
  MessageSquare,
  Bell,
  GraduationCap,
  Award,
  BookOpen,
  Compass,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { storageService } from '../../services/storage';

export type SeekerSubTab =
  | 'dashboard'
  | 'search'
  | 'applications'
  | 'messages'
  | 'notifications'
  | 'career_guidance'
  | 'learning'
  | 'course_player'
  | 'my_courses'
  | 'certificates'
  | 'profile'
  | 'saved'
  | 'interviews'
  | 'ai_coach'
  | 'verify_cert';

interface JobSeekerAppProps {
  candidateProfile: CandidateProfile;
  jobs: Job[];
  companies: Company[];
  applications: Application[];
  interviews: Interview[];
  savedJobIds: string[];
  currentUser?: User;
  onSelectJob: (job: Job) => void;
  onApplyJob: (job: Job) => void;
  onToggleSaveJob: (jobId: string) => void;
  onUpdateProfile: (profile: CandidateProfile) => void;
  onOpenResumeBuilder: () => void;
  onSelectCompany: (company: Company) => void;
  initialSubTab?: SeekerSubTab;
}

export const JobSeekerApp: React.FC<JobSeekerAppProps> = ({
  candidateProfile,
  jobs,
  companies,
  applications,
  interviews,
  savedJobIds,
  currentUser,
  onSelectJob,
  onApplyJob,
  onToggleSaveJob,
  onUpdateProfile,
  onOpenResumeBuilder,
  onSelectCompany,
  initialSubTab = 'dashboard',
}) => {
  const { t } = useI18n();
  const [activeSubTab, setActiveSubTab] = useState<SeekerSubTab>(initialSubTab);
  const [activeCourseId, setActiveCourseId] = useState<string>('crs-excel-101');
  const [activeCertId, setActiveCertId] = useState<string | undefined>(undefined);

  const fallbackUser: User = currentUser || {
    id: candidateProfile.id || 'cand-1',
    name: candidateProfile.name || 'Rahul Sharma',
    email: candidateProfile.email || 'rahul.sharma@example.com',
    phone: candidateProfile.phone || '+91 98765 43210',
    role: 'seeker',
    isVerified: candidateProfile.isVerified,
    avatar: candidateProfile.avatar,
    createdAt: '2026-01-10',
  };

  const candidateApps = applications.filter(
    (a) => a.candidateId === candidateProfile.id || a.candidateName === candidateProfile.name
  );
  const savedJobsList = jobs.filter((j) => savedJobIds.includes(j.id));
  const candidateInterviews = interviews.filter(
    (i) => i.candidateId === candidateProfile.id || i.candidateName === candidateProfile.name
  );

  // Unread badge counters
  const convs = storageService.getConversations();
  const unreadMsgCount = convs.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
  const notifs = storageService.getNotifications();
  const unreadNotifCount = notifs.filter((n) => !n.isRead && !n.read).length;

  const handleNavigate = (tab: string, extraId?: string) => {
    if (tab === 'jobs' || tab === 'search') {
      setActiveSubTab('search');
      if (extraId) {
        const found = jobs.find((j) => j.id === extraId);
        if (found) onSelectJob(found);
      }
    } else if (tab === 'learning' || tab === 'course-player') {
      if (extraId) {
        setActiveCourseId(extraId);
        setActiveSubTab('course_player');
      } else {
        setActiveSubTab('learning');
      }
    } else if (tab === 'certificates' || tab === 'my-certificates') {
      if (extraId) setActiveCertId(extraId);
      setActiveSubTab('certificates');
    } else if (tab === 'verify-certificate' || tab === 'verify_cert') {
      if (extraId) setActiveCertId(extraId);
      setActiveSubTab('verify_cert');
    } else if (tab === 'career-guidance' || tab === 'career_guidance') {
      setActiveSubTab('career_guidance');
    } else if (tab === 'messages') {
      setActiveSubTab('messages');
    } else if (tab === 'notifications') {
      setActiveSubTab('notifications');
    } else if (tab === 'applications') {
      setActiveSubTab('applications');
    } else if (tab === 'interviews') {
      setActiveSubTab('interviews');
    } else if (tab === 'my_courses') {
      setActiveSubTab('my_courses');
    } else if (tab === 'profile') {
      setActiveSubTab('profile');
    } else {
      setActiveSubTab(tab as SeekerSubTab);
    }
  };

  const navTabs = [
    { key: 'dashboard' as const, label: 'Dashboard', icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
    { key: 'search' as const, label: 'Find Jobs', icon: <Search className="w-3.5 h-3.5" /> },
    {
      key: 'applications' as const,
      label: 'Applications',
      icon: <Briefcase className="w-3.5 h-3.5" />,
      badge: candidateApps.length > 0 ? candidateApps.length : undefined,
    },
    {
      key: 'messages' as const,
      label: 'Messages',
      icon: <MessageSquare className="w-3.5 h-3.5" />,
      badge: unreadMsgCount > 0 ? unreadMsgCount : undefined,
      badgeColor: 'bg-teal-500 text-white',
    },
    {
      key: 'notifications' as const,
      label: 'Notifications',
      icon: <Bell className="w-3.5 h-3.5" />,
      badge: unreadNotifCount > 0 ? unreadNotifCount : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    { key: 'career_guidance' as const, label: 'Career Guidance', icon: <Compass className="w-3.5 h-3.5 text-purple-600" /> },
    { key: 'learning' as const, label: 'Karmetra Learning', icon: <GraduationCap className="w-3.5 h-3.5 text-teal-600" /> },
    { key: 'my_courses' as const, label: 'My Courses', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { key: 'certificates' as const, label: 'My Certificates', icon: <Award className="w-3.5 h-3.5 text-amber-600" /> },
    { key: 'profile' as const, label: 'Profile', icon: <UserIcon className="w-3.5 h-3.5" /> },
    { key: 'saved' as const, label: 'Saved Jobs', icon: <Bookmark className="w-3.5 h-3.5" /> },
    {
      key: 'interviews' as const,
      label: 'Interviews',
      icon: <CalendarCheck className="w-3.5 h-3.5" />,
      badge: candidateInterviews.length > 0 ? candidateInterviews.length : undefined,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Primary Seeker Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-2 flex items-center justify-between overflow-x-auto gap-1 no-scrollbar">
        <div className="flex items-center gap-1 min-w-max">
          {navTabs.map((tab) => {
            const isActive =
              activeSubTab === tab.key ||
              (tab.key === 'learning' && activeSubTab === 'course_player');

            return (
              <button
                key={tab.key}
                onClick={() => setActiveSubTab(tab.key)}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      tab.badgeColor
                        ? tab.badgeColor
                        : isActive
                        ? 'bg-teal-800 text-teal-100'
                        : 'bg-slate-200 text-slate-800'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Tools */}
        <div className="hidden xl:flex items-center gap-2 pl-3 border-l border-slate-200">
          <button
            onClick={onOpenResumeBuilder}
            className="px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 hover:bg-teal-100 text-xs font-bold border border-teal-200 flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <FileText className="w-3.5 h-3.5 text-teal-600" />
            <span>Resume Builder</span>
          </button>
        </div>
      </div>

      {/* TAB 1: DASHBOARD */}
      {activeSubTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-teal-800/80 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
              <div className="lg:col-span-7 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                  <span>Karmetra Verified ID: {candidateProfile.karmetraId || 'KM-CAN-88219'}</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                  Welcome back, {candidateProfile.name}! 👋
                </h1>
                <p className="text-xs sm:text-sm text-teal-100/90 max-w-xl">
                  {candidateProfile.title || 'Data Operations & MIS Executive'} •{' '}
                  <span className="text-teal-300">{candidateProfile.location || 'Mumbai, Maharashtra'}</span>
                </p>

                {/* KPI metrics */}
                <div className="grid grid-cols-4 gap-2 pt-2">
                  <button
                    onClick={() => setActiveSubTab('applications')}
                    className="bg-white/10 hover:bg-white/20 transition backdrop-blur-md rounded-2xl p-3 border border-white/10 text-left"
                  >
                    <p className="text-[10px] text-teal-200 font-bold uppercase">Applications</p>
                    <p className="text-xl font-black text-white">{candidateApps.length}</p>
                  </button>
                  <button
                    onClick={() => setActiveSubTab('interviews')}
                    className="bg-white/10 hover:bg-white/20 transition backdrop-blur-md rounded-2xl p-3 border border-white/10 text-left"
                  >
                    <p className="text-[10px] text-teal-200 font-bold uppercase">Interviews</p>
                    <p className="text-xl font-black text-emerald-300">{candidateInterviews.length}</p>
                  </button>
                  <button
                    onClick={() => setActiveSubTab('my_courses')}
                    className="bg-white/10 hover:bg-white/20 transition backdrop-blur-md rounded-2xl p-3 border border-white/10 text-left"
                  >
                    <p className="text-[10px] text-teal-200 font-bold uppercase">Courses</p>
                    <p className="text-xl font-black text-teal-300">
                      {storageService.getAllUserProgress(candidateProfile.id).length || 2}
                    </p>
                  </button>
                  <button
                    onClick={() => setActiveSubTab('certificates')}
                    className="bg-white/10 hover:bg-white/20 transition backdrop-blur-md rounded-2xl p-3 border border-white/10 text-left"
                  >
                    <p className="text-[10px] text-teal-200 font-bold uppercase">Certificates</p>
                    <p className="text-xl font-black text-amber-300">
                      {storageService.getUserCertificates(candidateProfile.id).length || 1}
                    </p>
                  </button>
                </div>
              </div>

              {/* Profile Strength & Career Quick Link */}
              <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-200">Profile Readiness Score</span>
                  <span className="text-sm font-black text-white">85% Complete</span>
                </div>
                <div className="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-teal-400 to-emerald-400 h-2.5 rounded-full w-[85%]"></div>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-teal-200 font-medium">Earn +15% with MS Excel Cert</span>
                  <button
                    onClick={() => setActiveSubTab('learning')}
                    className="px-3 py-1.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs font-bold transition shadow-xs"
                  >
                    Start Course
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Learning & Career Promotion Strip */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              onClick={() => setActiveSubTab('career_guidance')}
              className="bg-gradient-to-r from-purple-900 to-indigo-950 rounded-3xl p-6 text-white cursor-pointer hover:shadow-md transition flex items-center justify-between group"
            >
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300">
                  Interactive AI Advisor
                </span>
                <h3 className="text-lg font-bold mt-1">Explore High-Growth Career Paths</h3>
                <p className="text-xs text-purple-200 mt-1">
                  Discover skill gaps in Data Analysis, HR, Logistics & B2B Sales.
                </p>
              </div>
              <Compass className="w-10 h-10 text-purple-400 group-hover:scale-110 transition flex-shrink-0 ml-4" />
            </div>

            <div
              onClick={() => setActiveSubTab('learning')}
              className="bg-gradient-to-r from-teal-900 to-emerald-950 rounded-3xl p-6 text-white cursor-pointer hover:shadow-md transition flex items-center justify-between group"
            >
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-300">
                  Skill Academy
                </span>
                <h3 className="text-lg font-bold mt-1">Learn Job Skills & Earn Certificates</h3>
                <p className="text-xs text-teal-200 mt-1">
                  Video lessons in Excel, SQL, Power BI, Labor Laws and Warehousing.
                </p>
              </div>
              <GraduationCap className="w-10 h-10 text-teal-400 group-hover:scale-110 transition flex-shrink-0 ml-4" />
            </div>
          </div>

          {/* Recent Applications & Recommended Jobs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Applications */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-teal-600" />
                  <span>My Active Applications</span>
                </h3>
                <button
                  onClick={() => setActiveSubTab('applications')}
                  className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1"
                >
                  <span>View all</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {candidateApps.slice(0, 3).map((app) => (
                  <div
                    key={app.id}
                    className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{app.jobTitle}</h4>
                      <p className="text-[11px] text-slate-500">{app.companyName}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Openings */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <span>Recommended Openings</span>
                </h3>
                <button
                  onClick={() => setActiveSubTab('search')}
                  className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1"
                >
                  <span>Browse all jobs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {jobs.slice(0, 3).map((job) => (
                  <div
                    key={job.id}
                    onClick={() => onSelectJob(job)}
                    className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-teal-50/40 hover:border-teal-200 transition cursor-pointer flex items-center justify-between gap-3"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{job.title}</h4>
                      <p className="text-[11px] text-slate-500">{job.company} • {job.location}</p>
                    </div>
                    <span className="text-xs font-bold text-teal-700">{job.salary}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FIND JOBS (Search) */}
      {activeSubTab === 'search' && (
        <JobFilterSearch
          jobs={jobs}
          candidateProfile={candidateProfile}
          savedJobIds={savedJobIds}
          onSelectJob={onSelectJob}
          onApplyJob={onApplyJob}
          onToggleSaveJob={onToggleSaveJob}
        />
      )}

      {/* TAB 3: APPLICATIONS */}
      {activeSubTab === 'applications' && (
        <ApplicationTrackerView
          applications={candidateApps}
          jobs={jobs}
          onSelectJob={onSelectJob}
        />
      )}

      {/* TAB 4: MESSAGES */}
      {activeSubTab === 'messages' && (
        <MessagesPage currentUser={fallbackUser} onNavigate={handleNavigate} />
      )}

      {/* TAB 5: NOTIFICATIONS */}
      {activeSubTab === 'notifications' && (
        <NotificationsPage currentUser={fallbackUser} onNavigate={handleNavigate} />
      )}

      {/* TAB 6: CAREER GUIDANCE */}
      {activeSubTab === 'career_guidance' && (
        <CareerGuidancePage currentUser={fallbackUser} onNavigate={handleNavigate} />
      )}

      {/* TAB 7: KARMETRA LEARNING (CATALOG) */}
      {activeSubTab === 'learning' && (
        <LearningCatalogPage
          currentUser={fallbackUser}
          onNavigate={handleNavigate}
          onStartCourse={(cid) => {
            setActiveCourseId(cid);
            setActiveSubTab('course_player');
          }}
        />
      )}

      {/* SUB: COURSE PLAYER */}
      {activeSubTab === 'course_player' && (
        <CoursePlayerPage
          courseId={activeCourseId}
          currentUser={fallbackUser}
          onBack={() => setActiveSubTab('learning')}
          onNavigate={handleNavigate}
        />
      )}

      {/* TAB 8: MY COURSES */}
      {activeSubTab === 'my_courses' && (
        <MyCoursesPage
          currentUser={fallbackUser}
          onNavigate={handleNavigate}
          onOpenCourse={(cid) => {
            setActiveCourseId(cid);
            setActiveSubTab('course_player');
          }}
        />
      )}

      {/* TAB 9: MY CERTIFICATES */}
      {activeSubTab === 'certificates' && (
        <MyCertificatesPage
          currentUser={fallbackUser}
          onNavigate={handleNavigate}
          selectedCertId={activeCertId}
        />
      )}

      {/* TAB 10: PROFILE */}
      {activeSubTab === 'profile' && (
        <JobSeekerProfileView
          profile={candidateProfile}
          onUpdateProfile={onUpdateProfile}
          onOpenResumeBuilder={onOpenResumeBuilder}
        />
      )}

      {/* TAB 11: SAVED JOBS */}
      {activeSubTab === 'saved' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Saved Jobs ({savedJobsList.length})</h2>
          {savedJobsList.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs">
              <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700">No saved jobs yet</p>
              <button
                onClick={() => setActiveSubTab('search')}
                className="mt-3 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold"
              >
                Find Jobs
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedJobsList.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isSaved={true}
                  onSelectJob={onSelectJob}
                  onApplyJob={onApplyJob}
                  onToggleSaveJob={onToggleSaveJob}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 12: INTERVIEWS */}
      {activeSubTab === 'interviews' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">
            Interview Schedule ({candidateInterviews.length})
          </h2>
          {candidateInterviews.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs">
              <CalendarCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700">No interviews scheduled right now</p>
            </div>
          ) : (
            <div className="space-y-3">
              {candidateInterviews.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {item.type || 'Walk-in Interview'}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{item.jobTitle}</h3>
                    <p className="text-xs text-slate-500">{item.companyName} • {item.date} at {item.time}</p>
                    {item.location && <p className="text-xs text-slate-600 mt-1">📍 {item.location}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => alert(`Interview status confirmed for ${item.date}`)}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                    >
                      Confirm Attendance
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 13: CERTIFICATE VERIFICATION */}
      {activeSubTab === 'verify_cert' && (
        <CertificateVerificationPage
          initialCertId={activeCertId}
          onBack={() => setActiveSubTab('certificates')}
        />
      )}
    </div>
  );
};
