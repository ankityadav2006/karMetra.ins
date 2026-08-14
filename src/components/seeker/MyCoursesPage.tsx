import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  PlayCircle,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  BarChart,
} from 'lucide-react';
import { storageService, subscribeStorage } from '../../services/storage';
import { Course, CourseProgress, User } from '../../types';

interface MyCoursesPageProps {
  currentUser: User;
  onNavigate?: (tab: string, extraId?: string) => void;
  onOpenCourse?: (courseId: string) => void;
}

export const MyCoursesPage: React.FC<MyCoursesPageProps> = ({
  currentUser,
  onNavigate,
  onOpenCourse,
}) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [progressList, setProgressList] = useState<CourseProgress[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'in_progress' | 'completed'>('in_progress');

  useEffect(() => {
    const load = () => {
      setCourses(storageService.getCourses());
      setProgressList(storageService.getAllUserProgress(currentUser.id));
    };
    load();
    const unsub = subscribeStorage(load);
    return () => unsub();
  }, [currentUser.id]);

  // Combine course with user progress
  const enrolledCourses = progressList
    .map((prog) => {
      const course = courses.find((c) => c.id === prog.courseId);
      return { course, progress: prog };
    })
    .filter((item): item is { course: Course; progress: CourseProgress } => !!item.course);

  const filtered = enrolledCourses.filter((item) => {
    if (activeTab === 'in_progress') return !item.progress.isCompleted;
    if (activeTab === 'completed') return item.progress.isCompleted;
    return true;
  });

  const completedCount = enrolledCourses.filter((e) => e.progress.isCompleted).length;
  const inProgressCount = enrolledCourses.filter((e) => !e.progress.isCompleted).length;

  const handleStart = (courseId: string) => {
    if (onOpenCourse) {
      onOpenCourse(courseId);
    } else if (onNavigate) {
      onNavigate('learning', courseId);
    }
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-80px)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header & Stats Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              My Learning & Courses
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Track your enrolled course progress, complete lessons, and unlock official Karmetra Skill Certificates.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-4 py-3 rounded-2xl bg-teal-50 border border-teal-100 text-center">
              <div className="text-2xl font-black text-teal-700">{inProgressCount}</div>
              <div className="text-[11px] font-bold text-teal-900 uppercase">In Progress</div>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-amber-50 border border-amber-100 text-center">
              <div className="text-2xl font-black text-amber-700">{completedCount}</div>
              <div className="text-[11px] font-bold text-amber-900 uppercase">Certificates</div>
            </div>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex gap-2">
            {(
              [
                { key: 'in_progress', label: `In Progress (${inProgressCount})` },
                { key: 'completed', label: `Completed (${completedCount})` },
                { key: 'all', label: `All Courses (${enrolledCourses.length})` },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === tab.key
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => onNavigate && onNavigate('learning')}
            className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1"
          >
            <span>+ Explore More Courses</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Course Cards Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">
              {activeTab === 'completed'
                ? 'No Completed Courses Yet'
                : 'No Active Enrollments in this Filter'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Explore practical video courses in Excel, Power BI, SQL, HR, or Logistics and gain verified credentials.
            </p>
            <button
              onClick={() => onNavigate && onNavigate('learning')}
              className="mt-4 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-xs"
            >
              Browse Karmetra Academy Catalog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(({ course, progress }) => {
              const percent = progress.overallProgressPercent || 0;
              const totalLessons = course.modules.reduce((a, m) => a + m.lessons.length, 0);

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col"
                >
                  <div className="relative h-44 bg-slate-100 overflow-hidden">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold">
                        {course.category}
                      </span>
                    </div>
                    {progress.isCompleted && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center gap-1 shadow-xs">
                          <Award className="w-3 h-3" />
                          Certified
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span className="font-mono font-semibold text-teal-700">
                        {course.karmetraCourseCode}
                      </span>
                      <span>{course.difficulty}</span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 line-clamp-2 mb-3">
                      {course.title}
                    </h3>

                    {/* Progress details */}
                    <div className="space-y-2 mt-auto pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-600">
                          {progress.completedLessons.length} / {totalLessons} Lessons
                        </span>
                        <span className="text-teal-700 font-bold">{percent}%</span>
                      </div>

                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>

                      <div className="pt-2 flex gap-2">
                        <button
                          onClick={() => handleStart(course.id)}
                          className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs"
                        >
                          <PlayCircle className="w-4 h-4" />
                          <span>{progress.isCompleted ? 'Review Content' : 'Continue Lesson'}</span>
                        </button>

                        {progress.isCompleted && progress.certificateId && (
                          <button
                            onClick={() => onNavigate && onNavigate('certificates', progress.certificateId)}
                            className="px-3.5 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100 text-xs font-bold flex items-center gap-1 transition"
                            title="Open Certificate"
                          >
                            <Award className="w-4 h-4 text-amber-600" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
