import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { KarmetraLogo } from './KarmetraLogo';
import { useI18n } from '../../utils/i18n';
import {
  Search,
  Building2,
  Sparkles,
  ShieldCheck,
  Bell,
  User as UserIcon,
  ChevronDown,
  LogOut,
  Settings,
  Briefcase,
  Menu,
  X,
  Layers,
  CheckCircle2,
  Globe,
  FileText,
  UserCheck,
  Building,
  Users,
  ShieldAlert,
} from 'lucide-react';

interface NavbarProps {
  currentUser?: User | null;
  unreadNotificationsCount: number;
  activeApp: 'seeker' | 'recruiter' | 'admin' | 'home';
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onSelectApp: (app: 'seeker' | 'recruiter' | 'admin') => void;
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
  onOpenAuthModal: (mode: 'login' | 'register') => void;
  onSwitchRole: (role: UserRole) => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  unreadNotificationsCount,
  activeApp,
  activeTab,
  onSelectTab,
  onSelectApp,
  onOpenNotifications,
  onOpenSettings,
  onOpenAuthModal,
  onSwitchRole,
  onLogout,
}) => {
  const { t } = useI18n();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoSwitchOpen, setDemoSwitchOpen] = useState(false);

  const isLoggedIn = !!currentUser && !!currentUser.id;

  // Determine user's primary application experience based on role
  const getUserAppRole = (): 'seeker' | 'recruiter' | 'admin' => {
    if (!currentUser) return 'seeker';
    if (currentUser.role === 'admin') return 'admin';
    if (currentUser.role === 'recruiter' || currentUser.role === 'employer') return 'recruiter';
    return 'seeker';
  };

  const userApp = getUserAppRole();

  const getAppLabel = (app: 'seeker' | 'recruiter' | 'admin') => {
    if (app === 'admin') return t('nav.adminApp', 'Admin Console');
    if (app === 'recruiter') return t('nav.recruiterApp', 'Recruiter ATS');
    return t('nav.seekerApp', 'Seeker Workspace');
  };

  const handleNavClick = (tabId: string) => {
    onSelectTab(tabId);
    setMobileMenuOpen(false);
  };

  const handleAppClick = (app: 'seeker' | 'recruiter' | 'admin') => {
    onSelectApp(app);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <KarmetraLogo
              size="md"
              variant="dark"
              showTagline={true}
              onClick={() => handleNavClick('home')}
            />

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              <button
                onClick={() => handleNavClick('jobs')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'jobs' && activeApp === 'home'
                    ? 'bg-teal-600/90 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Search className="w-3.5 h-3.5 text-teal-400" />
                <span>{t('nav.jobs', 'Find Jobs')}</span>
              </button>

              <button
                onClick={() => handleNavClick('companies')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'companies' && activeApp === 'home'
                    ? 'bg-teal-600/90 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-teal-400" />
                <span>{t('nav.companies', 'Top Companies')}</span>
              </button>

              <button
                onClick={() => handleNavClick('resources')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'resources' && activeApp === 'home'
                    ? 'bg-teal-600/90 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                <span>{t('nav.resources', 'Career Resources')}</span>
              </button>

              <button
                onClick={() => handleNavClick('about')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'about' && activeApp === 'home'
                    ? 'bg-teal-600/90 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>{t('nav.about', 'About Karmetra')}</span>
              </button>
            </nav>
          </div>

          {/* Right Area: Logged Out vs Logged In */}
          <div className="hidden md:flex items-center gap-3">
            {!isLoggedIn ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuthModal('login')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  {t('nav.login', 'Sign In')}
                </button>
                <button
                  onClick={() => onOpenAuthModal('register')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-teal-950 bg-gradient-to-r from-teal-400 to-teal-300 hover:from-teal-300 hover:to-teal-200 shadow-sm transition-all"
                >
                  {t('nav.register', 'Create Account')}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                {/* Direct App Launch Button */}
                <button
                  onClick={() => handleAppClick(userApp)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                    activeApp === userApp
                      ? 'bg-teal-600 border-teal-500 text-white shadow-xs'
                      : 'bg-slate-800/90 border-slate-700 text-teal-300 hover:bg-slate-800'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-teal-400" />
                  <span>{getAppLabel(userApp)}</span>
                </button>

                {/* Notifications Button */}
                <button
                  onClick={onOpenNotifications}
                  className="relative p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-slate-900 animate-pulse">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>

                {/* User Profile Avatar & Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all text-left"
                  >
                    {currentUser.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-7 h-7 rounded-lg object-cover border border-teal-500/40"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-lg bg-teal-900 border border-teal-700 text-teal-300 flex items-center justify-center font-bold text-xs">
                        {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                    <div className="hidden lg:block">
                      <p className="text-xs font-bold text-white leading-tight truncate max-w-[110px]">
                        {currentUser.name}
                      </p>
                      <p className="text-[10px] text-teal-400 font-semibold capitalize leading-none mt-0.5">
                        {currentUser.role === 'employer' ? 'Recruiter' : currentUser.role}
                      </p>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 text-slate-900 animate-in fade-in slide-in-from-top-2 duration-150"
                      onMouseLeave={() => {
                        setProfileDropdownOpen(false);
                        setDemoSwitchOpen(false);
                      }}
                    >
                      {/* User Header */}
                      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70">
                        <p className="text-xs font-extrabold text-slate-900">{currentUser.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{currentUser.email || currentUser.phone}</p>
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200 uppercase">
                            {currentUser.role}
                          </span>
                          {currentUser.isVerified && (
                            <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Verified
                            </span>
                          )}
                        </div>
                      </div>

                      {/* App Navigation Links */}
                      <div className="py-1">
                        <button
                          onClick={() => handleAppClick(userApp)}
                          className="w-full px-4 py-2 text-xs font-bold text-slate-800 hover:bg-teal-50 hover:text-teal-900 flex items-center gap-2.5 transition-colors"
                        >
                          <Layers className="w-4 h-4 text-teal-600" />
                          <span>Launch {getAppLabel(userApp)}</span>
                        </button>

                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            onOpenSettings();
                          }}
                          className="w-full px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                        >
                          <Globe className="w-4 h-4 text-teal-600" />
                          <span>{t('settings.title', 'Settings & Language')}</span>
                        </button>

                        {/* Demo Switcher Sub-Menu */}
                        <div className="border-t border-slate-100 my-1 pt-1">
                          <button
                            onClick={() => setDemoSwitchOpen(!demoSwitchOpen)}
                            className="w-full px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 flex items-center justify-between transition-colors"
                          >
                            <span className="flex items-center gap-2">
                              <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                              <span>Switch Demo Role</span>
                            </span>
                            <ChevronDown
                              className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                                demoSwitchOpen ? 'rotate-180' : ''
                              }`}
                            />
                          </button>

                          {demoSwitchOpen && (
                            <div className="bg-slate-50 px-3 py-2 space-y-1 mx-2 rounded-xl border border-slate-100">
                              <button
                                onClick={() => {
                                  onSwitchRole('seeker');
                                  setProfileDropdownOpen(false);
                                }}
                                className={`w-full px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 text-left ${
                                  currentUser.role === 'seeker'
                                    ? 'bg-teal-600 text-white'
                                    : 'text-slate-700 hover:bg-slate-200/70'
                                }`}
                              >
                                <UserCheck className="w-3.5 h-3.5" />
                                <span>Candidate (Job Seeker)</span>
                              </button>
                              <button
                                onClick={() => {
                                  onSwitchRole('recruiter');
                                  setProfileDropdownOpen(false);
                                }}
                                className={`w-full px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 text-left ${
                                  currentUser.role === 'recruiter' || currentUser.role === 'employer'
                                    ? 'bg-teal-600 text-white'
                                    : 'text-slate-700 hover:bg-slate-200/70'
                                }`}
                              >
                                <Building className="w-3.5 h-3.5" />
                                <span>Recruiter / Employer</span>
                              </button>
                              <button
                                onClick={() => {
                                  onSwitchRole('admin');
                                  setProfileDropdownOpen(false);
                                }}
                                className={`w-full px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 text-left ${
                                  currentUser.role === 'admin'
                                    ? 'bg-teal-700 text-white'
                                    : 'text-slate-700 hover:bg-slate-200/70'
                                }`}
                              >
                                <ShieldAlert className="w-3.5 h-3.5" />
                                <span>Super Admin</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Sign Out */}
                      <div className="border-t border-slate-100 pt-1">
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            onLogout();
                          }}
                          className="w-full px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors"
                        >
                          <LogOut className="w-4 h-4 text-rose-500" />
                          <span>{t('nav.logout', 'Sign Out')}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {isLoggedIn && (
              <button
                onClick={onOpenNotifications}
                className="relative p-2 rounded-xl bg-slate-800 text-slate-300 border border-slate-700"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2">
          {isLoggedIn && (
            <div className="p-3 rounded-2xl bg-slate-800/90 border border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-sm">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{currentUser.name}</p>
                  <p className="text-[10px] text-teal-400 font-semibold uppercase">{currentUser.role}</p>
                </div>
              </div>
              <button
                onClick={() => handleAppClick(userApp)}
                className="px-3 py-1.5 rounded-xl bg-teal-600 text-white text-xs font-bold"
              >
                Open App
              </button>
            </div>
          )}

          <div className="space-y-1">
            <button
              onClick={() => handleNavClick('jobs')}
              className="w-full p-2.5 rounded-xl text-left text-xs font-bold text-slate-200 hover:bg-slate-800 flex items-center gap-2.5"
            >
              <Search className="w-4 h-4 text-teal-400" />
              <span>{t('nav.jobs', 'Find Jobs')}</span>
            </button>
            <button
              onClick={() => handleNavClick('companies')}
              className="w-full p-2.5 rounded-xl text-left text-xs font-bold text-slate-200 hover:bg-slate-800 flex items-center gap-2.5"
            >
              <Building2 className="w-4 h-4 text-teal-400" />
              <span>{t('nav.companies', 'Top Companies')}</span>
            </button>
            <button
              onClick={() => handleNavClick('resources')}
              className="w-full p-2.5 rounded-xl text-left text-xs font-bold text-slate-200 hover:bg-slate-800 flex items-center gap-2.5"
            >
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>{t('nav.resources', 'Career Resources')}</span>
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className="w-full p-2.5 rounded-xl text-left text-xs font-bold text-slate-200 hover:bg-slate-800 flex items-center gap-2.5"
            >
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>{t('nav.about', 'About Karmetra')}</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSettings();
              }}
              className="w-full p-2.5 rounded-xl text-left text-xs font-bold text-slate-200 hover:bg-slate-800 flex items-center gap-2.5"
            >
              <Globe className="w-4 h-4 text-teal-400" />
              <span>{t('settings.title', 'Settings & Language')}</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuthModal('login');
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs"
                >
                  {t('nav.login', 'Sign In')}
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuthModal('register');
                  }}
                  className="w-full py-2.5 rounded-xl bg-teal-500 text-teal-950 font-black text-xs"
                >
                  {t('nav.register', 'Create Account')}
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="w-full py-2.5 rounded-xl bg-rose-900/40 border border-rose-700/50 text-rose-300 font-bold text-xs flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('nav.logout', 'Sign Out')}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
