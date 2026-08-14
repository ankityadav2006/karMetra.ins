import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  TrendingUp,
  Target,
  GraduationCap,
  Award,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Briefcase,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { storageService, subscribeStorage } from '../../services/storage';
import { CareerPathRoadmap, CandidateProfile, Course, User } from '../../types';

interface CareerGuidancePageProps {
  currentUser: User;
  onNavigate?: (tab: string, extraId?: string) => void;
}

export const CareerGuidancePage: React.FC<CareerGuidancePageProps> = ({
  currentUser,
  onNavigate,
}) => {
  const [roadmaps, setRoadmaps] = useState<CareerPathRoadmap[]>([]);
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string>('crm-da');
  const [candidate, setCandidate] = useState<CandidateProfile | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const load = () => {
      setRoadmaps(storageService.getCareerRoadmaps());
      setCandidate(storageService.getCandidateProfile(currentUser.id));
      setCourses(storageService.getCourses());
    };
    load();
    const unsub = subscribeStorage(load);
    return () => unsub();
  }, [currentUser.id]);

  const activeRoadmap = roadmaps.find((r) => r.id === selectedRoadmapId) || roadmaps[0];

  const candidateVerifiedSkills = candidate?.verifiedSkills || [];
  const candidateAllSkills = candidate?.skills || [];

  // Skill Gap Analysis for Active Roadmap
  const totalRequiredSkills = activeRoadmap?.allRequiredSkills || [];
  const matchedSkills = totalRequiredSkills.filter(
    (s) =>
      candidateVerifiedSkills.some((vs) => vs.toLowerCase() === s.toLowerCase()) ||
      candidateAllSkills.some((as) => as.toLowerCase() === s.toLowerCase())
  );
  const missingSkills = totalRequiredSkills.filter(
    (s) =>
      !candidateVerifiedSkills.some((vs) => vs.toLowerCase() === s.toLowerCase()) &&
      !candidateAllSkills.some((as) => as.toLowerCase() === s.toLowerCase())
  );

  const readinessPercentage = totalRequiredSkills.length
    ? Math.round((matchedSkills.length / totalRequiredSkills.length) * 100)
    : 0;

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-80px)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Hero */}
        <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Karmetra AI Career Guidance Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Personalized Career Roadmaps & Skill Acceleration
            </h1>
            <p className="text-sm sm:text-base text-teal-100/90 mt-2 leading-relaxed">
              Discover high-demand job roles in India, understand your skill gaps, complete verified Karmetra training, and earn certified credentials that attract top employers.
            </p>
          </div>
        </div>

        {/* 2-Column: Career Selector & Deep Dive */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: Select Career Path (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-4 h-4 text-teal-600" />
              <span>High-Growth Career Paths</span>
            </h3>

            <div className="space-y-3">
              {roadmaps.map((rm) => {
                const isSelected = rm.id === selectedRoadmapId;
                return (
                  <button
                    key={rm.id}
                    onClick={() => setSelectedRoadmapId(rm.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition relative ${
                      isSelected
                        ? 'bg-white border-teal-500 shadow-md ring-2 ring-teal-500/20'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{rm.icon}</span>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{rm.roleName}</h4>
                          <span className="text-xs text-slate-500">{rm.industry}</span>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          rm.hiringDemand === 'Very High'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {rm.hiringDemand} Demand
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                      {rm.description}
                    </p>

                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-semibold text-teal-700">{rm.salaryRange}</span>
                      <span className="text-slate-400 flex items-center gap-1 font-medium">
                        View Path <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Detailed Roadmap & Skill Readiness (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Readiness Summary Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{activeRoadmap.icon}</span>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">{activeRoadmap.title}</h2>
                      <p className="text-xs text-slate-500">{activeRoadmap.salaryRange}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div className="text-center">
                    <div className="text-2xl font-black text-teal-700">{readinessPercentage}%</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Match Score
                    </div>
                  </div>
                  <div className="w-24 bg-slate-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-teal-600 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${readinessPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Skills Analysis */}
              <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Matched Skills */}
                <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs uppercase tracking-wide mb-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Skills You Possess ({matchedSkills.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {matchedSkills.length === 0 ? (
                      <span className="text-xs text-slate-500 italic">No matching skills yet</span>
                    ) : (
                      matchedSkills.map((sk) => (
                        <span
                          key={sk}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-semibold"
                        >
                          <ShieldCheck className="w-3 h-3 text-emerald-700" />
                          {sk}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-100">
                  <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs uppercase tracking-wide mb-3">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Skills to Learn ({missingSkills.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {missingSkills.length === 0 ? (
                      <span className="text-xs text-emerald-700 font-semibold">
                        🎉 You have all primary skills for this role!
                      </span>
                    ) : (
                      missingSkills.map((sk) => (
                        <span
                          key={sk}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 text-xs font-semibold"
                        >
                          <Zap className="w-3 h-3 text-amber-700" />
                          {sk}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Step-by-Step Learning Progression */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-teal-600" />
                  <span>Step-by-Step Skill Progression Roadmap</span>
                </h3>
                <span className="text-xs text-slate-500">Industry-Aligned Modules</span>
              </div>

              <div className="space-y-4">
                {activeRoadmap.skillsProgression.map((step, idx) => {
                  const stepCourses = courses.filter((c) => step.courseIds.includes(c.id));
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white transition"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-extrabold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span>{step.level}</span>
                        </h4>

                        <div className="flex flex-wrap gap-1">
                          {step.skills.map((s) => (
                            <span
                              key={s}
                              className="text-[11px] font-medium px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Course recommendation in this step */}
                      {stepCourses.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-200/60 space-y-2">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Recommended Training:
                          </span>
                          {stepCourses.map((crs) => (
                            <div
                              key={crs.id}
                              className="flex items-center justify-between p-3 rounded-xl bg-white border border-teal-100 shadow-2xs gap-3"
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  src={crs.thumbnail}
                                  alt={crs.title}
                                  className="w-10 h-10 rounded-lg object-cover"
                                />
                                <div>
                                  <h5 className="text-xs font-bold text-slate-900 truncate">
                                    {crs.title}
                                  </h5>
                                  <p className="text-[11px] text-slate-500">
                                    {crs.durationHours} hrs • {crs.totalLessons} lessons • {crs.difficulty}
                                  </p>
                                </div>
                              </div>

                              <button
                                onClick={() => onNavigate && onNavigate('learning', crs.id)}
                                className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1 flex-shrink-0"
                              >
                                <span>Learn Now</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Target Job Roles & Employers Hiring */}
            <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-3xl p-6 border border-teal-100">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-teal-950 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-teal-700" />
                  <span>Matching Job Roles Open on Karmetra</span>
                </h4>
                <button
                  onClick={() => onNavigate && onNavigate('jobs')}
                  className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1"
                >
                  <span>Explore All Jobs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {activeRoadmap.matchingJobRoles.map((role) => (
                  <button
                    key={role}
                    onClick={() => onNavigate && onNavigate('jobs')}
                    className="px-3 py-1.5 rounded-xl bg-white border border-teal-200 text-xs font-semibold text-slate-800 hover:border-teal-400 hover:shadow-xs transition"
                  >
                    💼 {role}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
