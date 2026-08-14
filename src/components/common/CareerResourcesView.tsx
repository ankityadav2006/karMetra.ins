import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  MessageSquare,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Download,
  BookOpen,
  DollarSign,
  Briefcase,
  HelpCircle,
} from 'lucide-react';

interface CareerResourcesViewProps {
  onOpenResumeBuilder: () => void;
  onNavigateTab: (tab: string) => void;
}

export const CareerResourcesView: React.FC<CareerResourcesViewProps> = ({
  onOpenResumeBuilder,
  onNavigateTab,
}) => {
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);

  const SALARY_BENCHMARKS = [
    { role: 'Delivery Associate (Bike/Van)', exp: '0-2 Yrs', avg: '₹18,000 - ₹28,000 / mo', demand: 'High' },
    { role: 'Warehouse Picker / Packer', exp: '0-1 Yr', avg: '₹15,000 - ₹22,000 / mo', demand: 'Very High' },
    { role: 'Retail Store Sales Associate', exp: '0-3 Yrs', avg: '₹16,000 - ₹25,000 / mo', demand: 'High' },
    { role: 'Customer Support (Hindi/English)', exp: '0-2 Yrs', avg: '₹18,000 - ₹30,000 / mo', demand: 'High' },
    { role: 'Field Sales Executive (B2B/B2C)', exp: '1-4 Yrs', avg: '₹22,000 - ₹40,000 / mo', demand: 'High' },
    { role: 'Commercial Driver (LMV/HMV)', exp: '2-5 Yrs', avg: '₹20,000 - ₹35,000 / mo', demand: 'Moderate' },
    { role: 'Security Guard / Supervisor', exp: '0-3 Yrs', avg: '₹14,000 - ₹22,000 / mo', demand: 'High' },
  ];

  const FAQS = [
    {
      q: 'Does KarMetra charge any fees to job seekers?',
      a: 'Absolutely NOT. KarMetra maintains a strict Zero-Fee Candidate Guarantee. Under Indian law and platform policy, no recruiter or employer is permitted to charge any registration, training, uniform, or interview fee.',
    },
    {
      q: 'How does HireMatch AI calculate my match score?',
      a: 'HireMatch AI parses your listed skills, location radius, preferred work shift, languages spoken, and experience against the employer’s job parameters to produce an objective 0-100% compatibility rating.',
    },
    {
      q: 'Can freshers with zero prior experience get hired on KarMetra?',
      a: 'Yes! Over 40% of active postings across retail, warehouse logistics, data entry, and delivery require 0 years of experience with on-the-job training provided by verified employers.',
    },
    {
      q: 'How can I report a recruiter asking for money or suspicious offers?',
      a: 'Use the "Report" button on any job card or click Anti-Fraud report in the footer. Our admin moderation team investigates reports within 2 hours and automatically suspends violating entities.',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-teal-900">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Career Advancement Tools</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Free Career Resources & <span className="text-teal-400">AI Employment Tools</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300">
            Equip yourself with professional AI resumes, interview preparation, salary benchmarks, and fraud-free employment guidance.
          </p>
        </div>
      </div>

      {/* Primary Tool Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: AI Resume Builder */}
        <div className="bg-white rounded-3xl border border-teal-100 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-teal-500 hover:shadow-md transition-all">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900">AI Resume & Bio-Data Generator</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Create an ATS-friendly, clean resume tailored for Indian frontline, retail, operations, and corporate employers in under 2 minutes. Free PDF download.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pre-filled templates for 15+ frontline & support job roles</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>One-click skill auto-completion & language tags</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Instant printable PDF & WhatsApp-ready format</span>
              </li>
            </ul>
          </div>

          <button
            onClick={onOpenResumeBuilder}
            className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch Resume Builder Free</span>
          </button>
        </div>

        {/* Card 2: AI Interview Coach */}
        <div className="bg-white rounded-3xl border border-teal-100 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-teal-500 hover:shadow-md transition-all">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900">AI Mock Interview Coach</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Practice realistic interview questions in Hindi or English with real-time feedback on confidence, grammar, and scenario responses.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Role-specific questions (Delivery, Retail, Sales, BPO)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Instant scoring on salary negotiation and answers</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Bilingual audio & text practice options</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => onNavigateTab('coach')}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Start Practice Session</span>
          </button>
        </div>
      </div>

      {/* Salary Benchmarks 2026 Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-teal-600" />
              <span>India Frontline & Non-IT Salary Benchmarks (2026)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Verified market compensation standards across Tier-1 and Tier-2 Indian hubs.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px]">
                <th className="py-3 px-4">Job Role / Title</th>
                <th className="py-3 px-4">Experience Level</th>
                <th className="py-3 px-4">Monthly Salary Bracket</th>
                <th className="py-3 px-4">Hiring Demand</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {SALARY_BENCHMARKS.map((item, idx) => (
                <tr key={idx} className="hover:bg-teal-50/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{item.role}</td>
                  <td className="py-3 px-4 text-slate-600">{item.exp}</td>
                  <td className="py-3 px-4 font-bold text-teal-800">{item.avg}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {item.demand}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Anti-Fraud & Zero Fee Policy Card */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Anti-Fraud Protection Protocol</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black">Zero-Fee Guarantee for All Candidates</h3>
          <p className="text-xs text-emerald-100 leading-relaxed">
            Never pay any fee for job applications, interview registration, uniform charges, or badge processing. KarMetra works strictly with verified employers who never charge candidates.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('about')}
          className="px-5 py-3 bg-white text-emerald-950 font-black text-xs rounded-xl shadow-md hover:bg-emerald-50 transition-colors shrink-0"
        >
          Read Anti-Fraud Charter →
        </button>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-teal-600" />
          <span>Frequently Asked Questions</span>
        </h3>

        <div className="space-y-2">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden">
              <button
                onClick={() => setActiveAccordion(activeAccordion === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <span>{faq.q}</span>
                <span className="text-teal-700 text-sm">{activeAccordion === idx ? '−' : '+'}</span>
              </button>

              {activeAccordion === idx && (
                <div className="p-4 pt-0 text-xs text-slate-600 bg-slate-50 border-t border-slate-100 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
