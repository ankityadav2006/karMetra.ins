import React from 'react';
import { X, Languages, Check, Globe, Sparkles, Volume2 } from 'lucide-react';
import { SupportedLanguage, LANGUAGES, setStoredLanguage } from '../../utils/i18n';

interface LanguageModalProps {
  isOpen: boolean;
  activeLanguage: SupportedLanguage;
  onClose: () => void;
  onSelectLanguage: (lang: SupportedLanguage) => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({
  isOpen,
  activeLanguage,
  onClose,
  onSelectLanguage,
}) => {
  if (!isOpen) return null;

  const handleSelect = (lang: SupportedLanguage) => {
    setStoredLanguage(lang);
    onSelectLanguage(lang);
  };

  const handleSpeechPreview = (text: string, langCode: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode === 'hi' ? 'hi-IN' : langCode === 'mr' ? 'mr-IN' : langCode === 'ur' ? 'ur-PK' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 p-6 relative overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-indigo-600 text-white flex items-center justify-center shadow-md">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-lg flex items-center gap-2">
                App Language / भाषा
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Select your preferred language for instant translation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audio AI Voice Prompt banner */}
        <div className="my-3 p-3 bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800/80 rounded-2xl flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              Voice guidance available in all Indian regional languages
            </span>
          </div>
        </div>

        {/* Language Options List */}
        <div className="py-2 space-y-2 max-h-[55vh] overflow-y-auto">
          {LANGUAGES.map((lang) => {
            const isSelected = activeLanguage === lang.code;
            return (
              <div
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'border-teal-500 bg-teal-50/70 dark:bg-slate-800 dark:border-teal-400 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl shrink-0 leading-none">{lang.flag}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                        {lang.nativeName}
                      </h4>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        ({lang.name})
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono uppercase mt-0.5">
                      {lang.code.toUpperCase()} • Regional Language
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSpeechPreview(`KarMetra ${lang.nativeName} mein aapka swagat hai`, lang.code);
                    }}
                    className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    title="Audio voice preview"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      isSelected
                        ? 'bg-teal-600 border-teal-600 text-white'
                        : 'border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            Apply Language
          </button>
        </div>
      </div>
    </div>
  );
};
