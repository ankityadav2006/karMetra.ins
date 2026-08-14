import React from 'react';
import { User, UserRole } from '../../types';
import { UserCheck, ShieldCheck, Building, Users, ShieldAlert, Globe } from 'lucide-react';
import { SupportedLanguage, LANGUAGES } from '../../utils/i18n';

interface RoleSwitcherBannerProps {
  currentUser?: User;
  activeLanguage?: SupportedLanguage;
  onSwitchRole: (role: UserRole) => void;
  onOpenLanguageModal?: () => void;
}

export const RoleSwitcherBanner: React.FC<RoleSwitcherBannerProps> = ({
  currentUser,
  activeLanguage = 'en',
  onSwitchRole,
  onOpenLanguageModal,
}) => {
  const userName = currentUser?.name || 'Rahul Sharma';
  const userRole = currentUser?.role || 'seeker';

  const currentLangObj = LANGUAGES.find((l) => l.code === activeLanguage) || LANGUAGES[0];

  return (
    <div className="bg-slate-900 text-white text-xs py-2 px-3 sm:px-6 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 shadow-inner">
      <div className="flex items-center gap-2">
        <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/30 text-[11px] flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          FREE Prototype Demo
        </span>
        <span className="hidden md:inline text-slate-300 text-[11px]">
          Simulated Rule AI • Active User: <strong className="text-white">{userName}</strong>
        </span>
      </div>

      <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
        {/* Language Modal Trigger */}
        {onOpenLanguageModal && (
          <button
            onClick={onOpenLanguageModal}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-all mr-1"
            title="Switch Language / भाषा बदलें (EN, हिंदी, मराठी)"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>{currentLangObj.flag} {currentLangObj.nativeName}</span>
          </button>
        )}

        <span className="text-slate-400 text-[11px] mr-1 hidden sm:inline">Switch Perspective:</span>

        <button
          onClick={() => onSwitchRole('seeker')}
          className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-all ${
            userRole === 'seeker'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <UserCheck className="w-3 h-3" />
          Job Seeker
        </button>

        <button
          onClick={() => onSwitchRole('employer')}
          className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-all ${
            userRole === 'employer'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Building className="w-3 h-3" />
          Employer
        </button>

        <button
          onClick={() => onSwitchRole('recruiter')}
          className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-all ${
            userRole === 'recruiter'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Users className="w-3 h-3" />
          Recruiter
        </button>

        <button
          onClick={() => onSwitchRole('admin')}
          className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-all ${
            userRole === 'admin'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <ShieldAlert className="w-3 h-3" />
          Admin
        </button>
      </div>
    </div>
  );
};
