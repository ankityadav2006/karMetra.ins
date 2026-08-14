import React, { useState } from 'react';
import { Job, CandidateProfile, Company } from '../../types';
import { JobCard } from '../common/JobCard';
import { CompanyCard } from '../common/CompanyCard';
import { calculateHireMatch } from '../../utils/hireMatch';
import { getCareerCoachAdvice } from '../../utils/careerCoach';
import {
  Search,
  MapPin,
  Flame,
  Zap,
  CheckCircle2,
  Navigation,
  Sparkles,
  Building2,
  Users,
  ShieldCheck,
  ArrowRight,
  Briefcase,
  Bot,
  Star,
  Check,
  Sliders,
  HelpCircle,
  Clock,
  ArrowUpRight,
  Lock,
  UserCheck,
  FileCheck2,
  AlertTriangle,
  Send,
  PhoneCall,
  ChevronRight,
  Target,
  Award,
  ZapOff,
} from 'lucide-react';

interface HomePageProps {
  jobs: Job[];
  companies: Company[];
  candidateProfile: CandidateProfile;
  savedJobIds: string[];
  onSelectJob: (job: Job) => void;
  onApplyJob: (job: Job) => void;
  onToggleSaveJob: (jobId: string) => void;
  onSelectCompany: (company: Company) => void;
  onNavigateTab: (tab: string, filterVal?: string) => void;
  onOpenResumeBuilder: () => void;
  onSwitchRole?: (role: 'seeker' | 'employer' | 'recruiter') => void;
  onOpenAuthModal?: (mode: 'login' | 'register') => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  jobs,
  companies,
  candidateProfile,
  savedJobIds,
  onSelectJob,
  onApplyJob,
  onToggleSaveJob,
  onSelectCompany,
  onNavigateTab,
  onOpenResumeBuilder,
  onSwitchRole,
  onOpenAuthModal,
}) => {
  const [searchTitle, setSearchTitle] = useState('');
  const [searchCity, setSearchCity] = useState('Mumbai');

  // HireMatch Simulator state
  const [simSalary, setSimSalary] = useState(25000);
  const [simExp, setSimExp] = useState(2);
  const [simDistance, setSimDistance] = useState(3);
  const [simImmediate, setSimImmediate] = useState(true);

  // Career Coach Preview state
  const [activeQuestion, setActiveQuestion] = useState('What jobs should I apply for?');
  const coachResult = getCareerCoachAdvice(activeQuestion, candidateProfile);

  const categories = [
    { name: 'Delivery', icon: '📦', count: '140+ jobs', desc: 'Hyperlocal & Fleet' },
    { name: 'Warehouse', icon: '🏭', count: '95+ jobs', desc: 'Logistics & Stock' },
    { name: 'Sales', icon: '📱', count: '180+ jobs', desc: 'Field & B2B Merchant' },
    { name: 'Retail', icon: '🛒', count: '110+ jobs', desc: 'Superstores & Cashier' },
    { name: 'Customer Support', icon: '🎧', count: '125+ jobs', desc: 'Voice & Non-Voice' },
    { name: 'Security', icon: '🛡️', count: '75+ jobs', desc: 'Guards & Supervisors' },
    { name: 'Housekeeping', icon: '🧹', count: '50+ jobs', desc: 'Facility & Sanitization' },
    { name: 'Hospitality', icon: '🍽️', count: '85+ jobs', desc: 'Hotel & Restaurant' },
    { name: 'Driver', icon: '🚚', count: '65+ jobs', desc: 'Commercial & Cab' },
    { name: 'Manufacturing', icon: '⚙️', count: '45+ jobs', desc: 'Assembly & Machine' },
    { name: 'Office Support', icon: '🏢', count: '70+ jobs', desc: 'Admin & Desk Ops' },
    { name: 'Data Entry', icon: '💻', count: '90+ jobs', desc: 'Excel & Digitisation' },
  ];

  const quickHireJobs = jobs.filter((j) => j.isUrgent);
  const nearbyJobs = jobs.filter((j) => (j.distanceKm ?? 10) <= 5);

  // Calculate simulator HireMatch score
  const simScore = Math.min(
    98,
    Math.max(
      40,
      70 + (simImmediate ? 10 : 0) + (simSalary <= 30000 ? 10 : 0) + (simDistance <= 5 ? 8 : 0)
    )
  );

  return (
    <div className="space-y-16 animate-in fade-in duration-200">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-6 sm:p-10 text-white shadow-2xl overflow-hidden border border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Hero Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>Right Job. Right People. Faster.</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Find the right job. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-300 to-cyan-300">
                Build the right team.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium max-w-xl">
              KarMetra connects job seekers, employers and recruiters through faster, smarter hiring for frontline, retail, sales, delivery, warehouse and office roles.
            </p>

            {/* Search Interface Box */}
            <div className="bg-white rounded-2xl p-2.5 shadow-2xl text-slate-900 flex flex-col sm:flex-row gap-2 border border-slate-200/90">
              <div className="flex-1 flex items-center gap-2 px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <Search className="w-4 h-4 text-teal-600 shrink-0" />
                <input
                  type="text"
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  placeholder="Search jobs, skills or companies (e.g. Delivery, Sales)..."
                  className="w-full text-xs font-semibold outline-none bg-transparent placeholder-slate-400"
                />
              </div>

              <div className="sm:w-44 flex items-center gap-2 px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
                <select
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full text-xs font-bold outline-none bg-transparent cursor-pointer text-slate-800"
                >
                  <option value="Mumbai">Mumbai</option>
                  <option value="Thane">Thane</option>
                  <option value="Navi Mumbai">Navi Mumbai</option>
                  <option value="Pune">Pune</option>
                  <option value="Delhi">Delhi NCR</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Ahmedabad">Ahmedabad</option>
                  <option value="Kolkata">Kolkata</option>
                </select>
              </div>

              <button
                onClick={() => onNavigateTab('jobs')}
                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all shrink-0 active:scale-95"
              >
                <Search className="w-4 h-4" /> Search Jobs
              </button>
            </div>

            {/* Below Search Badges */}
            <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
              <button
                onClick={() => onNavigateTab('quickhire')}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-bold border border-amber-400/30 flex items-center gap-1.5 transition-colors"
              >
                <Flame className="w-3.5 h-3.5 text-amber-400" /> 🔥 QuickHire
              </button>

              <button
                onClick={() => onNavigateTab('nearby')}
                className="px-3 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 font-bold border border-teal-400/30 flex items-center gap-1.5 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-teal-300" /> 📍 Jobs Near You
              </button>

              <button
                onClick={() => onNavigateTab('jobs')}
                className="px-3 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 font-bold border border-teal-400/30 flex items-center gap-1.5 transition-colors"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" /> ⚡ Immediate Joining
              </button>

              <button
                onClick={() => onNavigateTab('companies')}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold border border-white/20 flex items-center gap-1.5 transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> ✓ Verified Hiring
              </button>
            </div>
          </div>

          {/* Right Hero Composition Card */}
          <div className="lg:col-span-5 relative">
            <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-700/80 p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
                  <span className="text-xs font-bold text-slate-200">KarMetra Real-Time Hiring</span>
                </div>
                <span className="text-[10px] bg-teal-500/20 text-teal-300 font-bold px-2 py-0.5 rounded border border-teal-500/30">
                  LIVE MARKETPLACE
                </span>
              </div>

              {/* Live Metric Pills */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-700 text-center">
                  <p className="text-lg font-black text-teal-400">12,400+</p>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">Active Jobs</p>
                </div>
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-700 text-center">
                  <p className="text-lg font-black text-amber-400">10 Sec</p>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">One-Tap Apply</p>
                </div>
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-700 text-center">
                  <p className="text-lg font-black text-emerald-400">92%</p>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">HireMatch Rate</p>
                </div>
              </div>

              {/* Sample Live Candidate Card */}
              <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                    alt="Rohan"
                    className="w-10 h-10 rounded-full object-cover border-2 border-teal-400 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="font-bold text-xs text-white">Ankit (Delivery Exec)</p>
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                    </div>
                    <p className="text-[10px] text-slate-400">Applied to Apex Logistics • 2m ago</p>
                  </div>
                </div>

                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-emerald-400/30">
                  92% Match
                </span>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" /> 100% Free for Job Seekers
                </span>
                <span className="text-teal-300 font-semibold">Zero Fee Guarantee ✓</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR CATEGORIES */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Popular Job Categories</h2>
            <p className="text-xs text-slate-500">Discover verified openings across high-demand Indian employment sectors</p>
          </div>
          <button
            onClick={() => onNavigateTab('jobs')}
            className="text-teal-700 font-bold text-xs hover:underline flex items-center gap-1"
          >
            Explore All Categories <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => onNavigateTab('jobs', cat.name)}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-teal-500 p-4 cursor-pointer transition-all hover:shadow-md group flex flex-col justify-between"
            >
              <div>
                <div className="w-11 h-11 rounded-xl bg-slate-50 group-hover:bg-teal-50 text-2xl flex items-center justify-center border border-slate-100 group-hover:border-teal-200 transition-colors mb-2">
                  {cat.icon}
                </div>
                <h3 className="font-extrabold text-slate-800 text-xs group-hover:text-teal-700 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5 line-clamp-1">{cat.desc}</p>
              </div>

              <span className="inline-block mt-3 text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full w-fit">
                {cat.count}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. QUICKHIRE SECTION */}
      <section className="bg-gradient-to-r from-amber-500/10 via-amber-50 to-orange-50/60 border border-amber-200/90 rounded-3xl p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white font-bold flex items-center justify-center shadow-md shrink-0">
              <Flame className="w-6 h-6 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">Need a job fast? 🔥 QuickHire</h2>
                <span className="text-[10px] bg-amber-200 text-amber-900 font-extrabold px-2 py-0.5 rounded uppercase">
                  Urgent Hiring
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">Find employers hiring immediately with walk-in interviews & same-day responses.</p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('quickhire')}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
          >
            Explore QuickHire Jobs →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickHireJobs.slice(0, 3).map((job) => (
            <JobCard
              key={job.id}
              job={job}
              candidateProfile={candidateProfile}
              isSaved={savedJobIds.includes(job.id)}
              onSelect={onSelectJob}
              onApply={onApplyJob}
              onToggleSave={onToggleSaveJob}
            />
          ))}
        </div>
      </section>

      {/* 4. NEARBY JOBS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-teal-600" />
            <div>
              <h2 className="text-2xl font-black text-slate-900">Jobs Near You</h2>
              <p className="text-xs text-slate-500">Hyperlocal vacancies within 5 km radius of your location</p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('nearby')}
            className="text-teal-700 font-bold text-xs hover:underline flex items-center gap-1"
          >
            View All Nearby Jobs <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nearbyJobs.slice(0, 3).map((job) => (
            <JobCard
              key={job.id}
              job={job}
              candidateProfile={candidateProfile}
              isSaved={savedJobIds.includes(job.id)}
              onSelect={onSelectJob}
              onApply={onApplyJob}
              onToggleSave={onToggleSaveJob}
            />
          ))}
        </div>
      </section>

      {/* 5. RECOMMENDED JOBS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              Jobs Picked For You
              <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2.5 py-0.5 rounded-full uppercase">
                HireMatch Scoring
              </span>
            </h2>
            <p className="text-xs text-slate-500">Top compatibility matches based on your profile skills & salary requirement</p>
          </div>
          <button onClick={() => onNavigateTab('jobs')} className="text-teal-700 font-bold text-xs hover:underline">
            See All Vacancies →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.slice(0, 6).map((job) => (
            <JobCard
              key={job.id}
              job={job}
              candidateProfile={candidateProfile}
              isSaved={savedJobIds.includes(job.id)}
              onSelect={onSelectJob}
              onApply={onApplyJob}
              onToggleSave={onToggleSaveJob}
            />
          ))}
        </div>
      </section>

      {/* 6. TOP COMPANIES */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Top Hiring Companies</h2>
            <p className="text-xs text-slate-500">Verified employers hiring actively on KarMetra</p>
          </div>
          <button onClick={() => onNavigateTab('companies')} className="text-teal-700 font-bold text-xs hover:underline">
            View All Companies →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.slice(0, 3).map((comp) => (
            <CompanyCard key={comp.id} company={comp} onSelect={onSelectCompany} />
          ))}
        </div>
      </section>

      {/* 7. HIREMATCH FEATURE HIGHLIGHT & SIMULATOR */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-800 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Info */}
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-wider text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
              KarMetra HireMatch™ Algorithm
            </span>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Stop searching. <br />
              <span className="text-teal-400">Start matching.</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              HireMatch™ calculates candidate compatibility in real time using 5 core parameters to eliminate mishires and speed up recruitment.
            </p>

            <div className="space-y-2.5 pt-2 text-xs font-semibold text-slate-200">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Skills & Functional Competency Match (30%)</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Location Proximity & Commute Distance (25%)</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Salary Budget Compatibility (20%)</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Experience Level & Sector Background (15%)</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Immediate Availability & Notice Period (10%)</span>
              </div>
            </div>
          </div>

          {/* Right Interactive Simulator */}
          <div className="lg:col-span-6 bg-slate-800/90 rounded-2xl border border-slate-700 p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-teal-400" /> Test HireMatch™ Simulator
              </h3>
              <span className="text-[10px] text-slate-400">Live Rule Engine</span>
            </div>

            {/* Score Display Ring */}
            <div className="flex items-center justify-around bg-slate-900/80 p-4 rounded-xl border border-slate-700">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-teal-400 transition-all duration-300"
                    strokeDasharray={`${simScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-xl font-black text-white">{simScore}%</span>
              </div>

              <div className="text-xs space-y-1">
                <p className="font-extrabold text-teal-300 text-sm">Excellent Compatibility</p>
                <p className="text-slate-400 text-[11px]">Calculated against live candidate profile</p>
                <span className="inline-block bg-teal-500/20 text-teal-300 text-[10px] font-bold px-2 py-0.5 rounded border border-teal-500/30">
                  ✓ High Shortlist Probability
                </span>
              </div>
            </div>

            {/* Simulator Controls */}
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 font-semibold mb-1">
                  <span>Expected Monthly Salary</span>
                  <span className="text-teal-400 font-bold">₹{simSalary.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min={15000}
                  max={50000}
                  step={2000}
                  value={simSalary}
                  onChange={(e) => setSimSalary(Number(e.target.value))}
                  className="w-full accent-teal-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-semibold mb-1">
                  <span>Commute Distance Radius</span>
                  <span className="text-teal-400 font-bold">{simDistance} km</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={20}
                  step={1}
                  value={simDistance}
                  onChange={(e) => setSimDistance(Number(e.target.value))}
                  className="w-full accent-teal-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-300 font-semibold">Immediate Joining Available</span>
                <button
                  onClick={() => setSimImmediate(!simImmediate)}
                  className={`px-3 py-1 rounded-full font-bold text-xs transition-colors ${
                    simImmediate ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {simImmediate ? 'YES ✓' : 'NO'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. HOW KARMETRA WORKS */}
      <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 space-y-8 shadow-sm">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full">
            Transparent Workflow
          </span>
          <h2 className="text-3xl font-black text-slate-900">How KarMetra Works</h2>
          <p className="text-xs sm:text-sm text-slate-500">Dual hiring workflows designed for job seekers and hiring teams</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Seekers */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">For Job Seekers</h3>
                <p className="text-[11px] text-slate-500">Get hired in 4 easy steps</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-700 font-medium">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center shrink-0">1</span>
                <div>
                  <p className="font-bold text-slate-900">Create Candidate Profile</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Add skills, location preferences, and work history.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center shrink-0">2</span>
                <div>
                  <p className="font-bold text-slate-900">Discover Matching Jobs</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Filter by salary, distance km, and QuickHire urgency.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center shrink-0">3</span>
                <div>
                  <p className="font-bold text-slate-900">One-Tap Apply in 10 Seconds</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Submit applications instantly without repetitive form filling.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center shrink-0">4</span>
                <div>
                  <p className="font-bold text-slate-900">Get Hired & Track Status</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Attend walk-in interviews and track application timeline.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Employers */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">For Employers & Staffing</h3>
                <p className="text-[11px] text-slate-500">Hire frontline talent at scale</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-700 font-medium">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center shrink-0">1</span>
                <div>
                  <p className="font-bold text-slate-900">Post Requirement Mandates</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Define openings, location, shift details, and QuickHire urgency.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center shrink-0">2</span>
                <div>
                  <p className="font-bold text-slate-900">Search Candidate Marketplace</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Filter candidate profiles with live HireMatch compatibility scores.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center shrink-0">3</span>
                <div>
                  <p className="font-bold text-slate-900">Schedule Walk-In & Video Interviews</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Send interview calendar invites directly via chat.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center shrink-0">4</span>
                <div>
                  <p className="font-bold text-slate-900">Hire & Collaborate with Agencies</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Manage recruitment pipeline and vendor submissions.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FOR EMPLOYERS SECTION */}
      <section className="bg-gradient-to-br from-teal-900 via-slate-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="max-w-2xl space-y-5 relative z-10">
          <span className="text-xs font-extrabold uppercase tracking-wider text-teal-300 bg-teal-500/20 px-3 py-1 rounded-full border border-teal-500/30">
            For Employers & Enterprise
          </span>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Your next great hire is closer than you think.
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
            KarMetra helps businesses hire verified delivery partners, retail staff, customer support agents, and field sales teams 3x faster with automated candidate matching.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <p className="font-extrabold text-teal-300">Smart Candidate Search</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Filter by skills & availability</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <p className="font-extrabold text-teal-300">HireMatch™ Scoring</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Automated candidate ranking</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <p className="font-extrabold text-teal-300">Bulk Hiring Pipelines</p>
              <p className="text-[10px] text-slate-400 mt-0.5">High-volume recruitment</p>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => {
                if (onSwitchRole) onSwitchRole('employer');
                onNavigateTab('dashboard');
              }}
              className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-xl text-xs shadow-lg transition-colors flex items-center gap-2"
            >
              Start Hiring Now <ArrowRight className="w-4 h-4" />
            </button>
            {onOpenAuthModal && (
              <button
                onClick={() => onOpenAuthModal('register')}
                className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs transition-colors border border-white/20"
              >
                Register Employer Account
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 10. FOR RECRUITERS SECTION */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="max-w-2xl space-y-5 relative z-10">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30">
            For Recruitment Agencies & Freelancers
          </span>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Built for recruiters who hire at scale.
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
            Manage client mandates, submit candidate profiles, track interview progress, and claim placement payouts in one modern workspace.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
              <p className="font-extrabold text-amber-300">Client Requirements</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Access active hiring mandates</p>
            </div>
            <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
              <p className="font-extrabold text-amber-300">Candidate Submissions</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Kanban submission tracking</p>
            </div>
            <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
              <p className="font-extrabold text-amber-300">Placement Payouts</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Track commission earnings</p>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => {
                if (onSwitchRole) onSwitchRole('recruiter');
                onNavigateTab('dashboard');
              }}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-lg transition-colors flex items-center gap-2"
            >
              Join as Recruiter <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 11. CAREER COACH SECTION */}
      <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-slate-900">Meet KarMetra Career Coach</h2>
                <span className="text-[10px] bg-teal-100 text-teal-800 font-extrabold px-2 py-0.5 rounded uppercase">
                  Demo AI Assistant
                </span>
              </div>
              <p className="text-xs text-slate-500">Get instant advice on job selection, resume improvements, and expected salaries.</p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('coach')}
            className="text-teal-700 font-bold text-xs hover:underline flex items-center gap-1"
          >
            Open Full Career Coach View →
          </button>
        </div>

        {/* Question Selector Chips */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {[
            "What jobs should I apply for?",
            "How can I improve my resume?",
            "What salary should I expect?",
            "Why am I not getting interviews?",
          ].map((q) => (
            <button
              key={q}
              onClick={() => setActiveQuestion(q)}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
                activeQuestion === q
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              "{q}"
            </button>
          ))}
        </div>

        {/* Answer Output Card */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-teal-800">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>KarMetra AI Coach Advice:</span>
          </div>

          <p className="text-xs text-slate-800 leading-relaxed font-medium bg-white p-3.5 rounded-xl border border-slate-200/80">
            {coachResult.answer}
          </p>

          <div className="space-y-1.5 pt-1">
            <p className="text-[11px] font-bold text-slate-500 uppercase">Actionable Next Steps:</p>
            <div className="space-y-1 text-xs text-slate-700 font-medium">
              {coachResult.suggestions.map((s, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 12. TRUST & SAFETY SECTION */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-800 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <ShieldCheck className="w-10 h-10 text-teal-400 mx-auto" />
          <h2 className="text-3xl font-black">Hire With Confidence</h2>
          <p className="text-xs text-slate-300">KarMetra is committed to 100% free, safe, and scam-free employment in India.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
          <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 text-center space-y-1">
            <UserCheck className="w-5 h-5 text-teal-400 mx-auto" />
            <p className="font-extrabold text-white">Verified Employers</p>
            <p className="text-[10px] text-slate-400">GST / PAN company verification</p>
          </div>

          <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 text-center space-y-1">
            <FileCheck2 className="w-5 h-5 text-teal-400 mx-auto" />
            <p className="font-extrabold text-white">Verified Recruiters</p>
            <p className="text-[10px] text-slate-400">Agency credentials audit</p>
          </div>

          <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 text-center space-y-1">
            <CheckCircle2 className="w-5 h-5 text-teal-400 mx-auto" />
            <p className="font-extrabold text-white">Verified Jobs</p>
            <p className="text-[10px] text-slate-400">Zero fee job postings</p>
          </div>

          <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 text-center space-y-1">
            <AlertTriangle className="w-5 h-5 text-amber-400 mx-auto" />
            <p className="font-extrabold text-white">Fraud Reporting</p>
            <p className="text-[10px] text-slate-400">Instant anti-scam flag button</p>
          </div>

          <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 text-center space-y-1">
            <Lock className="w-5 h-5 text-teal-400 mx-auto" />
            <p className="font-extrabold text-white">Secure Candidates</p>
            <p className="text-[10px] text-slate-400">Data privacy & contact shielding</p>
          </div>
        </div>
      </section>

      {/* 13. TESTIMONIALS SECTION */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-2xl font-black text-slate-900">Trusted By Seekers & Employers Across India</h2>
          <p className="text-xs text-slate-500">Real feedback from job seekers, employers, and recruitment agencies</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Candidate Testimonial */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-xs">
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
            <p className="text-slate-700 leading-relaxed italic font-medium">
              "Applied to Apex Logistics using One-Tap Apply and got a call within 3 hours. Attended the walk-in interview in Andheri and got joined as delivery partner!"
            </p>
            <div className="flex items-center gap-3 pt-1 border-t border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                alt="Rohan"
                className="w-8 h-8 rounded-full object-cover border border-teal-500"
              />
              <div>
                <p className="font-extrabold text-slate-900">Rohan Verma</p>
                <p className="text-[10px] text-slate-500">Delivery Partner, Mumbai</p>
              </div>
            </div>
          </div>

          {/* Employer Testimonial */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-xs">
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
            <p className="text-slate-700 leading-relaxed italic font-medium">
              "We closed 15 retail store cashier positions in Lower Parel within 48 hours using KarMetra QuickHire and HireMatch scoring. Highly recommended!"
            </p>
            <div className="flex items-center gap-3 pt-1 border-t border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
                alt="Neha"
                className="w-8 h-8 rounded-full object-cover border border-teal-500"
              />
              <div>
                <p className="font-extrabold text-slate-900">Neha Sharma</p>
                <p className="text-[10px] text-slate-500">HR Lead, Nova Retail & Superstores</p>
              </div>
            </div>
          </div>

          {/* Recruiter Testimonial */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-xs">
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
            <p className="text-slate-700 leading-relaxed italic font-medium">
              "As a staffing agency partner, KarMetra gives us direct access to high-urgency client mandates and candidate submission pipelines."
            </p>
            <div className="flex items-center gap-3 pt-1 border-t border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                alt="Rajesh"
                className="w-8 h-8 rounded-full object-cover border border-teal-500"
              />
              <div>
                <p className="font-extrabold text-slate-900">Rajesh Gupta</p>
                <p className="text-[10px] text-slate-500">Director, Apex Talent Solutions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 14. FOOTER */}
      <footer className="pt-10 border-t border-slate-200 text-xs text-slate-500 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-teal-600 text-white font-black text-lg flex items-center justify-center shadow-xs">
                K
              </div>
              <span className="font-black text-teal-800 text-xl tracking-tight">KarMetra</span>
            </div>
            <p className="text-slate-600 leading-relaxed font-medium max-w-sm">
              India's modern employment marketplace connecting job seekers, employers, and recruiters with HireMatch AI scoring, QuickHire, and verified trust network.
            </p>
            <p className="text-[11px] font-bold text-slate-400">Tagline: "Right Job. Right People. Faster."</p>
          </div>

          <div>
            <h4 className="font-black text-slate-800 text-xs uppercase mb-2">For Job Seekers</h4>
            <ul className="space-y-1.5 text-slate-600 font-medium">
              <li><button onClick={() => onNavigateTab('jobs')} className="hover:text-teal-600">Find Jobs</button></li>
              <li><button onClick={() => onNavigateTab('quickhire')} className="hover:text-teal-600">QuickHire Urgent</button></li>
              <li><button onClick={() => onNavigateTab('nearby')} className="hover:text-teal-600">Jobs Near You</button></li>
              <li><button onClick={onOpenResumeBuilder} className="hover:text-teal-600">Resume Builder</button></li>
              <li><button onClick={() => onNavigateTab('coach')} className="hover:text-teal-600">Career Coach</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-slate-800 text-xs uppercase mb-2">For Employers & Agencies</h4>
            <ul className="space-y-1.5 text-slate-600 font-medium">
              <li><button onClick={() => onNavigateTab('candidates')} className="hover:text-teal-600">Candidate Search</button></li>
              <li><button onClick={() => onNavigateTab('companies')} className="hover:text-teal-600">Company Directory</button></li>
              <li><button onClick={() => onNavigateTab('recruiters')} className="hover:text-teal-600">Recruiter Network</button></li>
              <li><button onClick={() => { if (onSwitchRole) onSwitchRole('employer'); onNavigateTab('dashboard'); }} className="hover:text-teal-600">Employer Portal</button></li>
              <li><button onClick={() => { if (onSwitchRole) onSwitchRole('recruiter'); onNavigateTab('dashboard'); }} className="hover:text-teal-600">Recruiter Workspace</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-slate-800 text-xs uppercase mb-2">Trust & Legal</h4>
            <ul className="space-y-1.5 text-slate-600 font-medium">
              <li><span className="hover:text-teal-600 cursor-pointer">About KarMetra</span></li>
              <li><span className="hover:text-teal-600 cursor-pointer">Anti-Fraud Policy</span></li>
              <li><span className="hover:text-teal-600 cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-teal-600 cursor-pointer">Terms of Service</span></li>
              <li><span className="hover:text-teal-600 cursor-pointer">Contact Support</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p>© 2026 KarMetra Technologies India Pvt. Ltd. All rights reserved.</p>
          <p className="font-medium">Designed for Blue-Collar, Frontline & Non-IT Employment in India</p>
        </div>
      </footer>
    </div>
  );
};

