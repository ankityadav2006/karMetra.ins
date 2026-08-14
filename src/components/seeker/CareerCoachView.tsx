import React, { useState } from 'react';
import { CandidateProfile } from '../../types';
import { getCareerCoachAdvice, CoachAnswer } from '../../utils/careerCoach';
import { Sparkles, Bot, Send, ArrowRight, Lightbulb, UserCheck, ShieldCheck } from 'lucide-react';

interface CareerCoachViewProps {
  candidateProfile: CandidateProfile;
  onOpenResumeBuilder: () => void;
}

export const CareerCoachView: React.FC<CareerCoachViewProps> = ({
  candidateProfile,
  onOpenResumeBuilder,
}) => {
  const [messages, setMessages] = useState<CoachAnswer[]>([
    getCareerCoachAdvice("What jobs should I apply for?", candidateProfile),
  ]);
  const [customInput, setCustomInput] = useState('');

  const sampleQuestions = [
    "What jobs should I apply for?",
    "How can I improve my resume?",
    "What salary should I expect?",
    "Why am I not getting interviews?",
  ];

  const handleQuestionClick = (q: string) => {
    const advice = getCareerCoachAdvice(q, candidateProfile);
    setMessages((prev) => [...prev, advice]);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    const advice = getCareerCoachAdvice(customInput, candidateProfile);
    setMessages((prev) => [...prev, advice]);
    setCustomInput('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="flex items-start justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center border border-emerald-400/30 text-2xl shadow-inner">
              🤖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">KarMetra Career Coach</h1>
                <span className="text-[10px] bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 font-bold px-2 py-0.5 rounded-full">
                  Career Coach Demo
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Instant rule-based AI guidance customized to your skills, location ({candidateProfile.location}) & experience.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenResumeBuilder}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md transition-all shrink-0"
          >
            <Sparkles className="w-4 h-4" /> Open Resume Builder
          </button>
        </div>
      </div>

      {/* Suggested Quick Question Chips */}
      <div>
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
          Ask Career Coach:
        </span>
        <div className="flex flex-wrap gap-2">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleQuestionClick(q)}
              className="px-3 py-2 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 rounded-xl text-xs font-semibold shadow-2xs transition-all flex items-center gap-1.5"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>{q}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Advice Stream */}
      <div className="space-y-4">
        {messages.map((item, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                Q
              </span>
              <span>{item.question}</span>
            </div>

            <div className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed">
              <Bot className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-slate-800">{item.answer}</p>
              </div>
            </div>

            {item.suggestions.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Recommended Actions:</span>
                <div className="space-y-1">
                  {item.suggestions.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-emerald-900 font-semibold bg-emerald-50/70 p-2 rounded-lg border border-emerald-100">
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleCustomSubmit} className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-300 shadow-sm">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          placeholder="Ask anything about your job hunt (e.g. How do I clear delivery manager interview?)..."
          className="flex-1 p-3 text-xs outline-none bg-transparent"
        />
        <button
          type="submit"
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <Send className="w-3.5 h-3.5" /> Ask Coach
        </button>
      </form>
    </div>
  );
};
