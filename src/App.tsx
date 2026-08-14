import React, { useState, useEffect } from 'react';
import { User, Job, Company, CandidateProfile, Application, UserRole } from './types';
import { storageService, subscribeStorage } from './services/storage';
import { Navbar } from './components/common/Navbar';
import { HomePage } from './components/home/HomePage';
import { JobSeekerApp } from './components/seeker/JobSeekerApp';
import { RecruiterApp } from './components/recruiter/RecruiterApp';
import { AdminApp } from './components/admin/AdminApp';
import { AboutPage } from './components/common/AboutPage';
import { CompanyDirectoryView } from './components/common/CompanyDirectoryView';
import { CareerResourcesView } from './components/common/CareerResourcesView';
import { CertificateVerificationPage } from './components/common/CertificateVerificationPage';
import { SettingsModal } from './components/common/SettingsModal';
import { JobDetailsModal } from './components/seeker/JobDetailsModal';
import { ResumeBuilderModal } from './components/common/ResumeBuilderModal';
import { ChatModal } from './components/common/ChatModal';
import { AuthModal } from './components/auth/AuthModal';
import { CreateJobModal } from './components/employer/CreateJobModal';
import { I18nProvider, useI18n } from './utils/i18n';
import {
  Bell,
  CheckCircle2,
  X,
  Layers,
  Search,
  Building2,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Briefcase,
  Users,
} from 'lucide-react';

export function AppContent() {
  const { t } = useI18n();

  // Primary State
  const [currentUser, setCurrentUser] = useState<User | null>(() => storageService.getCurrentUser());
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile>(() => storageService.getCandidateProfile());
  const [jobs, setJobs] = useState<Job[]>(() => storageService.getJobs());
  const [companies, setCompanies] = useState<Company[]>(() => storageService.getCompanies());
  const [candidates, setCandidates] = useState<CandidateProfile[]>(() => storageService.getCandidates());
  const [applications, setApplications] = useState<Application[]>(() => storageService.getApplications());
  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => storageService.getSavedJobIds());
  const [notifications, setNotifications] = useState(() => storageService.getNotifications());
  const [fraudAlerts, setFraudAlerts] = useState(() => storageService.getFraudAlerts());

  // 3-App Architecture Routing State
  const [activeApp, setActiveApp] = useState<'home' | 'seeker' | 'recruiter' | 'admin'>('home');
  const [activeTab, setActiveTab] = useState<string>('home');

  // Modals & Overlays
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showResumeBuilder, setShowResumeBuilder] = useState(false);
  const [showCreateJobModal, setShowCreateJobModal] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatRecipientName, setChatRecipientName] = useState('KarMetra Recruiter');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateProfile | null>(null);
  const [showNotificationsDrawer, setShowNotificationsDrawer] = useState(false);

  // Sync state with storage subscriber
  useEffect(() => {
    const unsub = subscribeStorage(() => {
      setCurrentUser(storageService.getCurrentUser());
      setCandidateProfile(storageService.getCandidateProfile());
      setJobs(storageService.getJobs());
      setCompanies(storageService.getCompanies());
      setCandidates(storageService.getCandidates());
      setApplications(storageService.getApplications());
      setSavedJobIds(storageService.getSavedJobIds());
      setNotifications(storageService.getNotifications());
      setFraudAlerts(storageService.getFraudAlerts());
    });
    return unsub;
  }, []);

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  const handleSelectJob = (job: Job) => {
    setSelectedJob(job);
  };

  const handleApplyJob = (job: Job) => {
    setSelectedJob(job);
  };

  const handleToggleSaveJob = (jobId: string) => {
    storageService.toggleSaveJob(jobId);
  };

  const handleOpenChat = (recipient: string) => {
    setChatRecipientName(recipient);
    setShowChat(true);
  };

  const handleLogout = () => {
    storageService.logout();
    setActiveApp('home');
    setActiveTab('home');
  };

  const handleSwitchRole = (role: UserRole) => {
    const newUser = storageService.switchRole(role);
    setCurrentUser(newUser);
    if (role === 'admin') setActiveApp('admin');
    else if (role === 'recruiter' || role === 'employer') setActiveApp('recruiter');
    else setActiveApp('seeker');
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setActiveApp('admin');
    } else if (user.role === 'recruiter' || user.role === 'employer') {
      setActiveApp('recruiter');
    } else {
      setActiveApp('seeker');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-teal-200 selection:text-teal-950">
      {/* Clean Navbar */}
      <Navbar
        currentUser={currentUser}
        unreadNotificationsCount={unreadNotifCount}
        activeApp={activeApp}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'home' || tab === 'jobs' || tab === 'companies' || tab === 'resources' || tab === 'about') {
            setActiveApp('home');
          }
        }}
        onSelectApp={(app) => {
          setActiveApp(app);
          setActiveTab(app);
        }}
        onOpenNotifications={() => setShowNotificationsDrawer(!showNotificationsDrawer)}
        onOpenSettings={() => setShowSettingsModal(true)}
        onOpenAuthModal={(mode) => {
          setAuthMode(mode);
          setShowAuthModal(true);
        }}
        onSwitchRole={handleSwitchRole}
        onLogout={handleLogout}
      />

      {/* Notifications Drawer */}
      {showNotificationsDrawer && (
        <div className="bg-white border-b border-teal-100 shadow-xl max-w-7xl mx-auto w-full p-4 animate-in slide-in-from-top-2 duration-150 z-30">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-teal-600" />
              <h3 className="text-xs font-black text-slate-900">Notifications & Alerts</h3>
            </div>
            <button
              onClick={() => setShowNotificationsDrawer(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto mt-2">
            {notifications.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No new notifications.</p>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className="py-2.5 flex items-start justify-between gap-3 text-xs">
                  <div>
                    <p className="font-bold text-slate-900">{n.title}</p>
                    <p className="text-slate-600 text-[11px] mt-0.5">{n.message}</p>
                    <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                  </div>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0 mt-1" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Main Content Area — 3 App Experiences + Public Home */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* APP 1: JOB SEEKER EXPERIENCE */}
        {activeApp === 'seeker' && (
          <JobSeekerApp
            candidateProfile={candidateProfile}
            jobs={jobs}
            companies={companies}
            applications={applications}
            interviews={storageService.getInterviews()}
            savedJobIds={savedJobIds}
            onSelectJob={handleSelectJob}
            onApplyJob={handleApplyJob}
            onToggleSaveJob={handleToggleSaveJob}
            onUpdateProfile={(p) => storageService.updateCandidateProfile(p)}
            onOpenResumeBuilder={() => setShowResumeBuilder(true)}
            onSelectCompany={(comp) => {
              setActiveApp('home');
              setActiveTab('companies');
            }}
          />
        )}

        {/* APP 2: RECRUITER / EMPLOYER ATS EXPERIENCE */}
        {activeApp === 'recruiter' && (
          <RecruiterApp
            currentUser={currentUser || storageService.switchRole('recruiter')}
            jobs={jobs}
            applications={applications}
            candidates={candidates}
            companies={companies}
            onOpenCreateJob={() => setShowCreateJobModal(true)}
            onOpenCandidateSearch={() => {}}
            onSelectCandidate={(c) => setSelectedCandidate(c)}
            onSelectJob={handleSelectJob}
          />
        )}

        {/* APP 3: SUPER ADMIN EXPERIENCE */}
        {activeApp === 'admin' && (
          <AdminApp
            users={storageService.getUsers()}
            jobs={jobs}
            fraudAlerts={fraudAlerts}
            onSelectJob={handleSelectJob}
          />
        )}

        {/* PUBLIC HOME & DISCOVERY EXPERIENCE */}
        {activeApp === 'home' && (
          activeTab === 'about' ? (
            <AboutPage
              onNavigateTab={(tab) => {
                if (tab === 'jobs') {
                  setActiveApp('seeker');
                  setActiveTab('search');
                } else if (tab === 'companies') {
                  setActiveTab('companies');
                } else if (tab === 'resources') {
                  setActiveTab('resources');
                } else if (tab === 'home') {
                  setActiveTab('home');
                }
              }}
              onOpenAuth={(mode) => {
                setAuthMode(mode);
                setShowAuthModal(true);
              }}
            />
          ) : activeTab === 'companies' ? (
            <CompanyDirectoryView
              companies={companies}
              jobs={jobs}
              onSelectJob={handleSelectJob}
            />
          ) : activeTab === 'resources' ? (
            <CareerResourcesView
              onOpenResumeBuilder={() => setShowResumeBuilder(true)}
              onNavigateTab={(tab) => {
                if (tab === 'coach') {
                  setActiveApp('seeker');
                  setActiveTab('ai_coach');
                } else if (tab === 'about') {
                  setActiveTab('about');
                } else if (tab === 'jobs') {
                  setActiveApp('seeker');
                  setActiveTab('search');
                }
              }}
            />
          ) : activeTab === 'jobs' ? (
            <JobSeekerApp
              candidateProfile={candidateProfile}
              jobs={jobs}
              companies={companies}
              applications={applications}
              interviews={storageService.getInterviews()}
              savedJobIds={savedJobIds}
              onSelectJob={handleSelectJob}
              onApplyJob={handleApplyJob}
              onToggleSaveJob={handleToggleSaveJob}
              onUpdateProfile={(p) => storageService.updateCandidateProfile(p)}
              onOpenResumeBuilder={() => setShowResumeBuilder(true)}
              onSelectCompany={(comp) => {
                setActiveTab('companies');
              }}
              initialSubTab="search"
            />
          ) : (
            <HomePage
              jobs={jobs}
              companies={companies}
              candidateProfile={candidateProfile}
              savedJobIds={savedJobIds}
              onSelectJob={handleSelectJob}
              onApplyJob={handleApplyJob}
              onToggleSaveJob={handleToggleSaveJob}
              onSelectCompany={(c) => {
                setActiveTab('companies');
              }}
              onNavigateTab={(tab, filterVal) => {
                if (tab === 'jobs') {
                  setActiveApp('seeker');
                  setActiveTab('search');
                } else if (tab === 'companies') {
                  setActiveTab('companies');
                } else if (tab === 'resources') {
                  setActiveTab('resources');
                } else if (tab === 'about') {
                  setActiveTab('about');
                } else if (tab === 'quickhire') {
                  setActiveApp('seeker');
                  setActiveTab('search');
                } else if (tab === 'nearby') {
                  setActiveApp('seeker');
                  setActiveTab('search');
                } else if (tab === 'coach') {
                  setActiveApp('seeker');
                  setActiveTab('ai_coach');
                } else if (tab === 'candidates') {
                  setActiveApp('recruiter');
                  setActiveTab('candidates');
                } else if (tab === 'recruiters') {
                  setActiveApp('recruiter');
                  setActiveTab('dashboard');
                } else if (tab === 'seeker') {
                  setActiveApp('seeker');
                } else if (tab === 'recruiter') {
                  setActiveApp('recruiter');
                } else if (tab === 'admin') {
                  setActiveApp('admin');
                }
              }}
              onOpenResumeBuilder={() => setShowResumeBuilder(true)}
              onSwitchRole={(role) => handleSwitchRole(role)}
              onOpenAuthModal={(mode) => {
                setAuthMode(mode);
                setShowAuthModal(true);
              }}
            />
          )
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-500 text-slate-950 font-black text-base flex items-center justify-center shadow-xs">
                  K
                </div>
                <span className="text-xl font-black text-white">KarMetra.in</span>
              </div>
              <p className="text-xs text-slate-400">
                India's official verified hiring portal for frontline, operational, and corporate talent.
              </p>
              <div className="pt-1 flex items-center gap-2 text-xs text-teal-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Free for Job Seekers • Zero Fee Policy</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-black text-white uppercase tracking-wider text-[11px]">For Job Seekers</h4>
              <ul className="space-y-1.5 text-slate-400">
                <li>
                  <button
                    onClick={() => {
                      setActiveApp('seeker');
                      setActiveTab('dashboard');
                    }}
                    className="hover:text-teal-300"
                  >
                    Candidate Workspace
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveApp('seeker');
                      setActiveTab('search');
                    }}
                    className="hover:text-teal-300"
                  >
                    Browse Pan-India Jobs
                  </button>
                </li>
                <li>
                  <button onClick={() => setShowResumeBuilder(true)} className="hover:text-teal-300">
                    Free AI Resume Builder
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveApp('seeker');
                      setActiveTab('ai_coach');
                    }}
                    className="hover:text-teal-300"
                  >
                    Interview Preparation Coach
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-black text-white uppercase tracking-wider text-[11px]">For Employers</h4>
              <ul className="space-y-1.5 text-slate-400">
                <li>
                  <button
                    onClick={() => {
                      setActiveApp('recruiter');
                      setActiveTab('dashboard');
                    }}
                    className="hover:text-teal-300"
                  >
                    Recruiter Control Center
                  </button>
                </li>
                <li>
                  <button onClick={() => setShowCreateJobModal(true)} className="hover:text-teal-300">
                    Post a Job (AI Description)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveApp('recruiter');
                      setActiveTab('candidates');
                    }}
                    className="hover:text-teal-300"
                  >
                    Candidate Database Search
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveApp('recruiter');
                      setActiveTab('company');
                    }}
                    className="hover:text-teal-300"
                  >
                    Get Verified Employer Badge
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-black text-white uppercase tracking-wider text-[11px]">Platform & Governance</h4>
              <ul className="space-y-1.5 text-slate-400">
                <li>
                  <button onClick={() => setShowSettingsModal(true)} className="hover:text-teal-300">
                    Settings & Language (EN / हिंदी / मराठी)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveApp('admin');
                      setActiveTab('overview');
                    }}
                    className="hover:text-teal-300"
                  >
                    Admin Moderation Panel
                  </button>
                </li>
                <li>
                  <span className="text-slate-400">Privacy & Data Security</span>
                </li>
                <li>
                  <span className="text-slate-400">Anti-Fraud Guidelines</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} KarMetra.in • Empowering Indian Workforce Recruitment.</p>
            <p>Made with Ocean Teal Precision for Pan-India Hiring</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />

      <AuthModal
        isOpen={showAuthModal}
        initialMode={authMode}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <JobDetailsModal
        job={selectedJob}
        candidateProfile={candidateProfile}
        onClose={() => setSelectedJob(null)}
        onApplySuccess={() => {}}
        onOpenChat={handleOpenChat}
      />

      <ResumeBuilderModal
        isOpen={showResumeBuilder}
        onClose={() => setShowResumeBuilder(false)}
      />

      <CreateJobModal
        isOpen={showCreateJobModal}
        onClose={() => setShowCreateJobModal(false)}
        onJobCreated={(newJob) => {
          setJobs(storageService.getJobs());
          setShowCreateJobModal(false);
        }}
      />

      <ChatModal
        isOpen={showChat}
        onClose={() => setShowChat(false)}
        recipientName={chatRecipientName}
      />
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}
