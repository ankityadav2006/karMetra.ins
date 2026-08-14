import React, { useState } from 'react';
import { useI18n, LANGUAGES, SupportedLanguage } from '../../utils/i18n';
import {
  X,
  Globe,
  Shield,
  Bell,
  CheckCircle2,
  Lock,
  EyeOff,
  Sparkles,
  Smartphone,
  Save,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { lang, setLanguage, t } = useI18n();
  const [activeTab, setActiveTab] = useState<'language' | 'privacy' | 'notifications'>('language');
  const [maskPhone, setMaskPhone] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleLanguageChange = (code: SupportedLanguage) => {
    setLanguage(code);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-teal-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">{t('settings.title', 'Settings & Preferences')}</h2>
              <p className="text-xs text-teal-200/80">Manage language, privacy, and notifications</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 bg-slate-50/70 px-4 pt-2 gap-2">
          <button
            onClick={() => setActiveTab('language')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'language'
                ? 'border-teal-600 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{t('settings.languageTitle', 'Language / भाषा')}</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'privacy'
                ? 'border-teal-600 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{t('settings.privacyTitle', 'Privacy & Security')}</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'notifications'
                ? 'border-teal-600 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Notifications</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'language' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <span>{t('settings.languageTitle', 'Choose Preferred Language')}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {t(
                    'settings.languageDesc',
                    'Select your preferred language. The entire website UI will update instantly.'
                  )}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {LANGUAGES.map((item) => {
                  const isSelected = lang === item.code;
                  return (
                    <button
                      key={item.code}
                      onClick={() => handleLanguageChange(item.code)}
                      className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-teal-600 bg-teal-50/80 shadow-xs ring-2 ring-teal-500/20'
                          : 'border-slate-200 hover:border-teal-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.flag}</span>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{item.nativeName}</p>
                          <p className="text-xs text-slate-500">{item.name}</p>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="bg-teal-50/50 p-3 rounded-xl border border-teal-100/80 flex items-center gap-2 text-xs text-teal-800">
                <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
                <span>
                  All job postings, seeker profiles, recruiter ATS tools, and dashboards will render in your selected language.
                </span>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  {t('settings.privacyTitle', 'Profile & Privacy Safeguards')}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {t(
                    'settings.privacyDesc',
                    'Manage who can view your contact details, resume, and profile information.'
                  )}
                </p>
              </div>

              <div className="space-y-3">
                <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={maskPhone}
                    onChange={(e) => setMaskPhone(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <EyeOff className="w-3.5 h-3.5 text-teal-600" />
                      <span>Mask Phone Number & Email from Public Search</span>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Contact information will only be shared when you submit an application to a verified employer.
                    </p>
                  </div>
                </label>

                <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                  <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-teal-600" />
                    <span>Aadhaar & PAN Protection</span>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Government ID documents are strictly confidential and only accessed by Admin for KYC verification. Never shown publicly.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-black text-slate-900">Notification Alerts</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Stay updated on new matching jobs, interview schedules, and recruiter messages.
                </p>
              </div>

              <div className="space-y-3">
                <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Email Alerts & Application Status</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Receive daily updates on your job applications and recruiter interview invites.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={whatsappAlerts}
                    onChange={(e) => setWhatsappAlerts(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900 flex items-center gap-1">
                      <Smartphone className="w-3.5 h-3.5 text-teal-600" />
                      <span>WhatsApp & SMS Alerts</span>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Get urgent interview reminders and QuickHire notifications directly on WhatsApp.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {isSaved && (
            <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl border border-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t('settings.savedSuccess', 'Preferences saved successfully!')}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{t('settings.saveChanges', 'Save Preferences')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
