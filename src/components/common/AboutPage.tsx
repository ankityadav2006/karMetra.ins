import React from 'react';
import {
  ShieldCheck,
  Users,
  Building2,
  Briefcase,
  Target,
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
  Layers,
  ArrowRight,
  TrendingUp,
  Cpu,
  HeartHandshake,
  Check,
} from 'lucide-react';

interface AboutPageProps {
  onNavigateTab?: (tab: string) => void;
  onOpenAuth?: (mode: 'login' | 'register') => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigateTab, onOpenAuth }) => {
  const industries = [
    { name: 'IT & Software', desc: 'Developers, Support, QA, Data Entry, Tech Sales', icon: '💻' },
    { name: 'Non-IT & Operations', desc: 'Back-Office, Administration, Coordinators, HR', icon: '📁' },
    { name: 'Blue Collar & Frontline', desc: 'Technicians, Machine Operators, Electricians, Fitters', icon: '⚙️' },
    { name: 'Corporate & Business', desc: 'Management, Finance, Accounts, Executive Assistants', icon: '🏢' },
    { name: 'Sales & BD', desc: 'B2B Field Sales, Merchant Onboarding, Tele-Sales, Retail Sales', icon: '📱' },
    { name: 'Retail & Superstores', desc: 'Store Associates, Cashiers, Inventory Stockers, Floor Leads', icon: '🛒' },
    { name: 'Logistics & Supply Chain', desc: 'Hyperlocal Delivery, Hub Supervisors, Dispatchers, Drivers', icon: '🚚' },
    { name: 'Warehouse & Fulfillment', desc: 'Pickers, Packers, Material Handlers, Forklift Leads', icon: '🏭' },
    { name: 'Manufacturing & Industrial', desc: 'Assembly Line Staff, Quality Checkers, Plant Operators', icon: '🏗️' },
    { name: 'Hospitality & Food Services', desc: 'Chefs, Stewards, Front Desk, Hotel Staff, QSR Crew', icon: '🍽️' },
    { name: 'Customer Support & BPO', desc: 'Inbound / Outbound Voice, Non-Voice Chat, Email Support', icon: '🎧' },
    { name: 'Security & Facility', desc: 'Manned Guarding, Facility Supervisors, Housekeeping Leads', icon: '🛡️' },
  ];

  const corePillars = [
    {
      title: 'Verified Opportunities',
      desc: 'Mandatory GSTIN and PAN document review for employers to protect candidates against fraudulent job offers or fee-charging scams.',
      icon: ShieldCheck,
    },
    {
      title: 'Faster Hiring & One-Tap Apply',
      desc: 'Eliminating bloated application barriers. Clean candidate profiles and smart HireMatch algorithms connect applicants with recruiters in minutes.',
      icon: Clock,
    },
    {
      title: 'Deep Location & GPS Discovery',
      desc: 'Hyperlocal search supporting states, districts, towns, areas, localities, pincodes, and rural villages with radius-based distance matching.',
      icon: MapPin,
    },
    {
      title: 'Recruiter & Agency Tools',
      desc: 'Structured requirement posting, candidate pipeline management, interview scheduling, and bulk resume imports.',
      icon: Briefcase,
    },
    {
      title: 'Candidate-First Experience',
      desc: '100% free for job seekers. Zero charges, free AI resume building, career coaching advice, and transparent application status updates.',
      icon: Users,
    },
    {
      title: 'Pan-India Inclusivity',
      desc: 'Built for everyone — from metro corporate professionals to frontline workers across Tier-1, Tier-2, Tier-3 cities and villages.',
      icon: Sparkles,
    },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-200">
      {/* 1. Header Hero */}
      <section className="relative bg-gradient-to-br from-teal-950 via-slate-900 to-teal-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-teal-800 overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Empowering Indian Workforce Recruitment</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            About <span className="text-teal-400">Karmetra.in</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
            Karmetra is a modern hiring and recruitment platform designed to connect job seekers, recruiters, and businesses. We focus on making employment discovery faster, simpler, and more reliable across every sector of the Indian economy.
          </p>

          {/* Key Facts Tag Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 text-xs">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
              <span className="text-[10px] text-teal-300 font-bold uppercase">Founded</span>
              <p className="text-sm font-black text-white mt-0.5">February 2026</p>
            </div>
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
              <span className="text-[10px] text-teal-300 font-bold uppercase">Founder</span>
              <p className="text-sm font-black text-white mt-0.5">Ankit Yadav</p>
            </div>
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-teal-300 font-bold uppercase">Seeker Fee Policy</span>
              <p className="text-sm font-black text-emerald-300 mt-0.5">100% Free • Zero Fees</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Our Mission & Vision */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-teal-100 p-6 sm:p-8 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Our Mission</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            To make hiring simpler, faster, and more accessible by removing unnecessary barriers between ambitious candidates and legitimate employers. We believe every job seeker deserves transparent job information, verified opportunities, and dignity in employment.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-teal-100 p-6 sm:p-8 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-slate-900">What We Do</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            We provide an unified digital marketplace that connects <strong>Job Seekers ↔ Recruiters ↔ Businesses</strong>. From hyper-local delivery partners to corporate software engineers, Karmetra delivers instant matching, genuine job postings, and structured candidate pipelines.
          </p>
        </div>
      </section>

      {/* 3. Our Approach */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Our Core Principles & Approach</h2>
          <p className="text-xs text-slate-500">How Karmetra ensures reliable and swift hiring for everyone</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {corePillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-teal-400 hover:shadow-md transition-all space-y-2"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black text-slate-900">{pillar.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{pillar.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Industries Supported */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Industries & Employment Sectors</h2>
            <p className="text-xs text-slate-500">Comprehensive hiring solutions across diverse skill sets and functions</p>
          </div>
          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('jobs')}
              className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              Browse Open Roles <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {industries.map((ind, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-teal-300 hover:bg-teal-50/20 transition-all flex items-start gap-3"
            >
              <span className="text-2xl shrink-0 p-2 bg-slate-50 rounded-xl border border-slate-100">{ind.icon}</span>
              <div>
                <h4 className="text-xs font-black text-slate-900">{ind.name}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{ind.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Company & Founder Profile */}
      <section className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-teal-900">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-3">
            <span className="px-3 py-1 bg-teal-500/20 text-teal-300 text-xs font-black rounded-full border border-teal-500/30">
              Company Leadership
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">Built with Purpose by Ankit Yadav</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Founded in <strong>February 2026</strong>, Karmetra was established with the vision of solving real-world hiring bottlenecks in India. By bridging the gap between grassroots talent and modern recruiters through intuitive technology, Karmetra delivers an efficient, transparent, and respectful hiring ecosystem.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-teal-200">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400" /> Headquarters: India
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400" /> Real-Time Database Architecture
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400" /> Zero Fake-Job Tolerance
              </span>
            </div>
          </div>

          <div className="md:col-span-4 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-teal-500 text-slate-950 font-black text-2xl flex items-center justify-center mx-auto shadow-md">
              K
            </div>
            <div>
              <h4 className="text-base font-black text-white">KarMetra.in</h4>
              <p className="text-xs text-teal-200">Hiring & Recruitment Platform</p>
            </div>
            {onOpenAuth && (
              <button
                onClick={() => onOpenAuth('register')}
                className="w-full py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs rounded-xl transition-colors"
              >
                Join KarMetra Free
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
