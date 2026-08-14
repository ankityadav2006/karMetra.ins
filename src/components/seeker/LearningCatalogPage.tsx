import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Search,
  BookOpen,
  Clock,
  Star,
  Award,
  CheckCircle2,
  ArrowRight,
  Filter,
  Users,
  PlayCircle,
  Sparkles,
  X,
} from 'lucide-react';
import { storageService, subscribeStorage } from '../../services/storage';
import { Course, CourseCategory, CourseDifficulty, CourseProgress, User } from '../../types';

interface LearningCatalogPageProps {
  currentUser: User;
  onNavigate?: (tab: string, extraId?: string) => void;
  onStartCourse?: (courseId: string) => void;
}

export const LearningCatalogPage: React.FC<LearningCatalogPageProps> = ({
  currentUser,
  onNavigate,
  onStartCourse,
}) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [userProgressList, setUserProgressList] = useState<CourseProgress[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewCourse, setPreviewCourse] = useState<Course | null>(null);

  useEffect(() => {
    const load = () => {
      setCourses(storageService.getCourses());
      setUserProgressList(storageService.getAllUserProgress(currentUser.id));
    };
    load();
    const unsub = subscribeStorage(load);
    return () => unsub();
  }, [currentUser.id]);

  const categories: string[] = [
    'All',
    'Computer & Office Skills',
    'Data & Analytics',
    'Business',
    'HR',
    'Blue Collar / Operations',
    'Career Skills',
  ];

  const filteredCourses = courses.filter((c) => {
    if (c.status !== 'Published') return false;
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || c.difficulty === selectedDifficulty;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.skillsEarned.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  const getCourseProgress = (courseId: string) => {
    return userProgressList.find((p) => p.courseId === courseId);
  };

  const handleEnrollOrOpen = (courseId: string) => {
    storageService.enrollCourse(currentUser.id, courseId);
    if (onStartCourse) {
      onStartCourse(courseId);
    } else if (onNavigate) {
      onNavigate('course-player', courseId);
    }
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-80px)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold mb-3">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Karmetra Skill Academy</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Learn Job-Ready Skills. Earn Verified Certificates.
            </h1>
            <p className="text-sm sm:text-base text-teal-100/90 mt-2 leading-relaxed">
              Real video modules, practice exercises, assessments, and verifiable certificates. Upgrade your profile to stand out to verified recruiters.
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                placeholder="Search courses (Excel, Power BI, SQL, HR, Safety)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
              />
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 no-scrollbar">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                Difficulty:
              </span>
              {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    selectedDifficulty === diff
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-t border-slate-100 pt-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-teal-900 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const prog = getCourseProgress(course.id);
            const isEnrolled = !!prog;
            const isCompleted = prog?.isCompleted;
            const percent = prog?.overallProgressPercent || 0;

            return (
              <div
                key={course.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col group"
              >
                {/* Thumbnail */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold">
                      {course.category}
                    </span>
                    {course.featured && (
                      <span className="px-2.5 py-1 rounded-full bg-teal-500 text-slate-950 text-[10px] font-extrabold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Bottom Stats on Image */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {course.durationHours} hrs • {course.totalLessons} lessons
                    </span>
                    <span className="flex items-center gap-1 text-amber-300 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-300" />
                      {course.rating} ({course.ratingCount})
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                    <span className="font-mono font-semibold text-teal-700">
                      {course.karmetraCourseCode}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                      {course.difficulty}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-teal-700 transition mb-2">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {course.tagline}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1 mb-4 mt-auto">
                    {course.skillsEarned.slice(0, 3).map((sk) => (
                      <span
                        key={sk}
                        className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-100"
                      >
                        {sk}
                      </span>
                    ))}
                    {course.skillsEarned.length > 3 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                        +{course.skillsEarned.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Instructor */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {course.instructorAvatar ? (
                        <img
                          src={course.instructorAvatar}
                          alt={course.instructorName}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold">
                          {course.instructorName.charAt(0)}
                        </div>
                      )}
                      <div className="text-left">
                        <p className="text-xs font-bold text-slate-800 leading-tight">
                          {course.instructorName}
                        </p>
                        <p className="text-[10px] text-slate-400 leading-tight">
                          {course.instructorTitle}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Progress or Actions */}
                  {isEnrolled ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-600">
                          {isCompleted ? 'Completed 🎉' : 'Progress'}
                        </span>
                        <span className="font-bold text-teal-700">{percent}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => handleEnrollOrOpen(course.id)}
                          className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs"
                        >
                          <PlayCircle className="w-4 h-4" />
                          <span>{isCompleted ? 'Review Lessons' : 'Continue Learning'}</span>
                        </button>
                        {isCompleted && prog.certificateId && (
                          <button
                            onClick={() => onNavigate && onNavigate('certificates', prog.certificateId)}
                            className="px-3 py-2.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 text-xs font-bold flex items-center gap-1 transition"
                            title="View Certificate"
                          >
                            <Award className="w-4 h-4 text-amber-600" />
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPreviewCourse(course)}
                        className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
                      >
                        Syllabus
                      </button>
                      <button
                        onClick={() => handleEnrollOrOpen(course.id)}
                        className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs"
                      >
                        <span>Start Free Course</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Course Syllabus Preview Drawer / Modal */}
        {previewCourse && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="p-6 border-b border-slate-200 flex items-start justify-between bg-slate-50/50">
                <div>
                  <span className="text-xs font-bold text-teal-700 font-mono">
                    {previewCourse.karmetraCourseCode}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 mt-1">
                    {previewCourse.title}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {previewCourse.durationHours} hrs • {previewCourse.totalLessons} lessons • {previewCourse.difficulty}
                  </p>
                </div>
                <button
                  onClick={() => setPreviewCourse(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Syllabus */}
              <div className="p-6 overflow-y-auto space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Course Description
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {previewCourse.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    What You Will Learn
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {previewCourse.learningObjectives.map((obj, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 mt-0.5 flex-shrink-0" />
                        <span>{obj}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Course Modules & Lessons
                  </h4>
                  <div className="space-y-3">
                    {previewCourse.modules.map((mod, idx) => (
                      <div
                        key={mod.id}
                        className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50"
                      >
                        <h5 className="text-xs font-bold text-slate-900 mb-2">
                          {mod.title}
                        </h5>
                        <div className="space-y-1.5">
                          {mod.lessons.map((les) => (
                            <div
                              key={les.id}
                              className="flex items-center justify-between text-xs text-slate-600 pl-3 border-l-2 border-slate-200"
                            >
                              <span>{les.title}</span>
                              <span className="text-[11px] text-slate-400">
                                {les.durationMinutes} min
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
                <button
                  onClick={() => setPreviewCourse(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const cid = previewCourse.id;
                    setPreviewCourse(null);
                    handleEnrollOrOpen(cid);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Start Course Now</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
