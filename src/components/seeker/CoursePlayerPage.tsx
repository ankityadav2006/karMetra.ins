import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  CheckCircle2,
  Lock,
  ArrowLeft,
  ArrowRight,
  FileText,
  HelpCircle,
  Award,
  Download,
  RotateCcw,
  Sparkles,
  Check,
  AlertCircle,
  BookOpen,
  Volume2,
  Share2,
  ShieldCheck,
} from 'lucide-react';
import { storageService, subscribeStorage } from '../../services/storage';
import { Course, CourseProgress, Lesson, LessonQuiz, KarmetraCertificate, User } from '../../types';

interface CoursePlayerPageProps {
  courseId: string;
  currentUser: User;
  onBack: () => void;
  onNavigate?: (tab: string, extraId?: string) => void;
}

export const CoursePlayerPage: React.FC<CoursePlayerPageProps> = ({
  courseId,
  currentUser,
  onBack,
  onNavigate,
}) => {
  const [course, setCourse] = useState<Course | undefined>(undefined);
  const [progress, setProgress] = useState<CourseProgress | undefined>(undefined);
  const [activeLessonId, setActiveLessonId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'video' | 'notes' | 'quiz' | 'assessment'>('video');

  // Video player simulation state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [videoSeconds, setVideoSeconds] = useState<number>(0);

  // Quiz state
  const [activeQuizAnswers, setActiveQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Final Assessment state
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<string, number>>({});
  const [assessmentResult, setAssessmentResult] = useState<{
    submitted: boolean;
    scorePercent: number;
    passed: boolean;
    certificate?: KarmetraCertificate;
  } | null>(null);

  // Load course and user progress
  useEffect(() => {
    const load = () => {
      const c = storageService.getCourseById(courseId);
      setCourse(c);

      let p = storageService.getUserCourseProgress(currentUser.id, courseId);
      if (!p) {
        p = storageService.enrollCourse(currentUser.id, courseId);
      }
      setProgress(p);

      // Set initial active lesson
      if (c && c.modules.length > 0 && c.modules[0].lessons.length > 0) {
        if (!activeLessonId) {
          const firstUncompleted = c.modules
            .flatMap((m) => m.lessons)
            .find((les) => !p?.completedLessons.includes(les.id));
          setActiveLessonId(firstUncompleted ? firstUncompleted.id : c.modules[0].lessons[0].id);
        }
      }
    };

    load();
    const unsub = subscribeStorage(load);
    return () => unsub();
  }, [courseId, currentUser.id]);

  // Find active lesson object
  const allLessons = course?.modules.flatMap((m) => m.lessons) || [];
  const currentLessonIndex = allLessons.findIndex((l) => l.id === activeLessonId);
  const activeLesson: Lesson | undefined = allLessons[currentLessonIndex] || allLessons[0];

  // Video progress interval ticker
  useEffect(() => {
    let interval: any = null;
    if (isPlaying && activeLesson) {
      interval = setInterval(() => {
        setVideoSeconds((prev) => {
          const maxSecs = activeLesson.videoDurationSeconds || 600;
          if (prev >= maxSecs) {
            setIsPlaying(false);
            // Mark completed
            storageService.updateLessonProgress(
              currentUser.id,
              courseId,
              activeLesson.id,
              maxSecs,
              maxSecs
            );
            return maxSecs;
          }
          const next = prev + 5;
          storageService.updateLessonProgress(
            currentUser.id,
            courseId,
            activeLesson.id,
            next,
            maxSecs
          );
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, activeLesson, currentUser.id, courseId]);

  // Handle lesson selection
  const handleSelectLesson = (lessonId: string) => {
    setActiveLessonId(lessonId);
    setActiveTab('video');
    setIsPlaying(false);
    setVideoSeconds(0);
    setQuizSubmitted(false);
    setActiveQuizAnswers({});
  };

  // Mark current lesson as complete
  const handleCompleteCurrentLesson = () => {
    if (!activeLesson) return;
    storageService.completeLesson(currentUser.id, courseId, activeLesson.id);

    // Auto move to next lesson or prompt quiz/assessment
    if (currentLessonIndex < allLessons.length - 1) {
      handleSelectLesson(allLessons[currentLessonIndex + 1].id);
    } else {
      // Last lesson -> switch to final assessment
      setActiveTab('assessment');
    }
  };

  // Quiz submission
  const handleQuizAnswer = (questionId: string, optionIndex: number) => {
    setActiveQuizAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitQuiz = (quiz: LessonQuiz) => {
    let correct = 0;
    quiz.questions.forEach((q) => {
      if (activeQuizAnswers[q.id] === q.correctOptionIndex) {
        correct++;
      }
    });
    const score = Math.round((correct / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScorePercent;

    storageService.submitQuizAttempt(currentUser.id, courseId, quiz.id, score, passed);
    setQuizSubmitted(true);
  };

  // Final Assessment submission
  const handleAssessmentAnswer = (questionId: string, optionIndex: number) => {
    setAssessmentAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitFinalAssessment = () => {
    if (!course) return;
    const questions = course.finalAssessment.questions;
    let earned = 0;
    let totalPoints = 0;

    questions.forEach((q) => {
      totalPoints += q.points || 10;
      if (assessmentAnswers[q.id] === q.correctOptionIndex) {
        earned += q.points || 10;
      }
    });

    const scorePercent = Math.round((earned / (totalPoints || 100)) * 100);
    const passed = scorePercent >= (course.passingScore || 70);

    const result = storageService.submitFinalAssessment(
      currentUser.id,
      courseId,
      scorePercent,
      passed,
      assessmentAnswers
    );

    setAssessmentResult({
      submitted: true,
      scorePercent,
      passed,
      certificate: result.certificate,
    });
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-slate-300">Loading course curriculum...</p>
        </div>
      </div>
    );
  }

  const isCompleted = progress?.isCompleted;
  const progressPercent = progress?.overallProgressPercent || 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Learning Navigation Bar */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between flex-shrink-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Courses</span>
          </button>
          <div className="border-l border-slate-800 pl-3">
            <h1 className="text-sm font-bold text-white truncate max-w-md">
              {course.title}
            </h1>
            <span className="text-[11px] text-teal-400 font-mono">
              {course.karmetraCourseCode} • {course.difficulty}
            </span>
          </div>
        </div>

        {/* Course Progress Indicator */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-semibold text-slate-300">
              {progress?.completedLessons.length || 0} of {allLessons.length} Completed
            </span>
            <div className="w-36 bg-slate-800 rounded-full h-2 mt-1 overflow-hidden">
              <div
                className="bg-teal-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {isCompleted && progress?.certificateId && (
            <button
              onClick={() => onNavigate && onNavigate('certificates', progress.certificateId)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-500/30 transition shadow-xs"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>View Certificate</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Studio View: Video / Tabs + Lesson Sidebar */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT: Video Player / Lesson Content Area */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-slate-900/50">
          {/* Main Video View */}
          {activeTab === 'video' && activeLesson && (
            <div>
              {/* Video Screen Simulation */}
              <div className="relative aspect-video bg-black flex items-center justify-center group overflow-hidden border-b border-slate-800">
                {activeLesson.videoUrl ? (
                  <iframe
                    src={`${activeLesson.videoUrl}?autoplay=0&rel=0&modestbranding=1`}
                    title={activeLesson.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="text-center p-6">
                    <BookOpen className="w-16 h-16 text-teal-400 mx-auto mb-3 opacity-60" />
                    <p className="text-sm font-semibold text-slate-300">
                      Interactive Audio-Visual Lesson
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {activeLesson.durationMinutes} minutes practical breakdown
                    </p>
                  </div>
                )}

                {/* Simulated Progress Overlay Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-800">
                  <div
                    className="bg-teal-500 h-full transition-all duration-300"
                    style={{
                      width: `${
                        ((videoSeconds || 0) / (activeLesson.videoDurationSeconds || 600)) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Lesson Action Bar */}
              <div className="p-4 sm:p-6 bg-slate-900 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white">{activeLesson.title}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {activeLesson.description || 'Follow along with the practical exercises in your workplace.'}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {progress?.completedLessons.includes(activeLesson.id) ? (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-900/40 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-400" />
                      Completed
                    </span>
                  ) : (
                    <button
                      onClick={handleCompleteCurrentLesson}
                      className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mark Complete & Next</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Lesson Secondary Tabs Navigation */}
          <div className="border-b border-slate-800 bg-slate-950 px-4 sm:px-6 flex gap-2">
            <button
              onClick={() => setActiveTab('video')}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
                activeTab === 'video'
                  ? 'border-teal-500 text-teal-400 bg-teal-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>Lesson Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('notes')}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
                activeTab === 'notes'
                  ? 'border-teal-500 text-teal-400 bg-teal-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Notes & Cheatsheet</span>
            </button>

            {activeLesson?.quiz && (
              <button
                onClick={() => setActiveTab('quiz')}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
                  activeTab === 'quiz'
                    ? 'border-teal-500 text-teal-400 bg-teal-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Lesson Quiz</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('assessment')}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ml-auto ${
                activeTab === 'assessment'
                  ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                  : 'border-transparent text-amber-300/80 hover:text-amber-300'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Certification Assessment</span>
            </button>
          </div>

          {/* Tab 1: Video Overview Content */}
          {activeTab === 'video' && activeLesson && (
            <div className="p-6 space-y-6 max-w-4xl">
              {/* Summary */}
              {activeLesson.summaryText && (
                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                  <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-2">
                    Key Concepts Covered
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {activeLesson.summaryText}
                  </p>
                </div>
              )}

              {/* Takeaways */}
              {activeLesson.keyTakeaways && activeLesson.keyTakeaways.length > 0 && (
                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                  <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-3">
                    Actionable Takeaways
                  </h3>
                  <ul className="space-y-2">
                    {activeLesson.keyTakeaways.map((point, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                        <Check className="w-4 h-4 text-teal-400 mt-0.5 flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Practice Exercise */}
              {activeLesson.practiceExercise && (
                <div className="bg-gradient-to-br from-teal-950/60 to-slate-900 p-5 rounded-2xl border border-teal-800/40">
                  <div className="flex items-center gap-2 text-xs font-bold text-teal-300 uppercase tracking-wider mb-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Hands-On Practice Assignment</span>
                  </div>
                  <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
                    {activeLesson.practiceExercise}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Notes & Cheatsheets */}
          {activeTab === 'notes' && (
            <div className="p-6 space-y-6 max-w-4xl">
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">
                    {activeLesson?.pdfNotesName || `${course.title} Study Notes.pdf`}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Official Karmetra reference notes, formula cheatsheet, and standard operating procedures.
                  </p>
                </div>
                <button
                  onClick={() => alert('Downloading official Karmetra course reference notes PDF...')}
                  className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-2 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
              </div>

              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
                <h4 className="text-sm font-bold text-slate-200">Course Syllabus & Modules</h4>
                <div className="space-y-3">
                  {course.modules.map((m, i) => (
                    <div key={m.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <p className="text-xs font-bold text-teal-400">{m.title}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {m.lessons.length} lessons • {m.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Interactive Lesson Quiz */}
          {activeTab === 'quiz' && activeLesson?.quiz && (
            <div className="p-6 space-y-6 max-w-3xl">
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                <h3 className="text-base font-bold text-white mb-1">
                  {activeLesson.quiz.title}
                </h3>
                <p className="text-xs text-slate-400">
                  Passing score: {activeLesson.quiz.passingScorePercent}% • Test your understanding
                </p>

                <div className="mt-6 space-y-6">
                  {activeLesson.quiz.questions.map((q, qIndex) => {
                    const selected = activeQuizAnswers[q.id];
                    const isCorrect = selected === q.correctOptionIndex;

                    return (
                      <div key={q.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                        <p className="text-sm font-semibold text-slate-200 mb-3">
                          {qIndex + 1}. {q.question}
                        </p>

                        <div className="space-y-2">
                          {q.options.map((opt, optIndex) => {
                            const isThisSelected = selected === optIndex;
                            let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';

                            if (quizSubmitted) {
                              if (optIndex === q.correctOptionIndex) {
                                btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold';
                              } else if (isThisSelected && !isCorrect) {
                                btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-300';
                              }
                            } else if (isThisSelected) {
                              btnStyle = 'bg-teal-950 border-teal-500 text-teal-200 font-semibold';
                            }

                            return (
                              <button
                                key={optIndex}
                                disabled={quizSubmitted}
                                onClick={() => handleQuizAnswer(q.id, optIndex)}
                                className={`w-full text-left p-3 rounded-xl border text-xs transition ${btnStyle}`}
                              >
                                <span className="font-mono mr-2">{String.fromCharCode(65 + optIndex)}.</span>
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {quizSubmitted && q.explanation && (
                          <div className="mt-3 p-3 bg-slate-900 rounded-lg text-xs text-slate-300 border-l-2 border-teal-500">
                            <span className="font-bold text-teal-400">Explanation: </span>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 flex items-center justify-between">
                  {quizSubmitted ? (
                    <button
                      onClick={() => {
                        setQuizSubmitted(false);
                        setActiveQuizAnswers({});
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retake Quiz</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => activeLesson.quiz && handleSubmitQuiz(activeLesson.quiz)}
                      disabled={Object.keys(activeQuizAnswers).length === 0}
                      className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition shadow-xs"
                    >
                      Submit Quiz Answers
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Final Certification Assessment */}
          {activeTab === 'assessment' && (
            <div className="p-6 space-y-6 max-w-3xl">
              <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-md">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      {course.finalAssessment.title}
                    </h2>
                    <p className="text-xs text-slate-400">
                      Passing Score: {course.finalAssessment.passingScorePercent}% • Auto-Generates Verified Karmetra Certificate
                    </p>
                  </div>
                </div>

                {/* Result Modal / Banner if Submitted */}
                {assessmentResult?.submitted && (
                  <div
                    className={`mt-6 p-6 rounded-2xl border text-center ${
                      assessmentResult.passed
                        ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                        : 'bg-rose-950/60 border-rose-500/50 text-rose-200'
                    }`}
                  >
                    <div className="text-3xl font-black mb-1">
                      {assessmentResult.scorePercent}%
                    </div>
                    <h3 className="text-base font-bold mb-2">
                      {assessmentResult.passed
                        ? '🎉 Congratulations! You Passed & Earned Your Certificate'
                        : 'Keep Practicing. You did not meet the 70% passing threshold.'}
                    </h3>
                    <p className="text-xs max-w-md mx-auto mb-4 leading-relaxed">
                      {assessmentResult.passed
                        ? `Official credential ${assessmentResult.certificate?.id} has been issued and linked to your Karmetra candidate profile.`
                        : 'Review the lessons and try the assessment again to earn your certificate.'}
                    </p>

                    {assessmentResult.passed && assessmentResult.certificate && (
                      <div className="flex flex-wrap items-center justify-center gap-3">
                        <button
                          onClick={() => onNavigate && onNavigate('certificates', assessmentResult.certificate?.id)}
                          className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-sm transition"
                        >
                          <Award className="w-4 h-4" />
                          <span>View Verified Certificate</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Questions List */}
                <div className="mt-6 space-y-6">
                  {course.finalAssessment.questions.map((q, qIndex) => {
                    const selected = assessmentAnswers[q.id];
                    const isCorrect = selected === q.correctOptionIndex;

                    return (
                      <div key={q.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm font-semibold text-slate-200">
                            {qIndex + 1}. {q.question}
                          </p>
                          <span className="text-[10px] font-bold text-teal-400 bg-teal-950 px-2 py-0.5 rounded border border-teal-800">
                            {q.points || 10} pts
                          </span>
                        </div>

                        <div className="space-y-2">
                          {q.options.map((opt, optIndex) => {
                            const isThisSelected = selected === optIndex;
                            let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';

                            if (assessmentResult?.submitted) {
                              if (optIndex === q.correctOptionIndex) {
                                btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                              } else if (isThisSelected && !isCorrect) {
                                btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-300';
                              }
                            } else if (isThisSelected) {
                              btnStyle = 'bg-teal-950 border-teal-500 text-teal-200 font-bold';
                            }

                            return (
                              <button
                                key={optIndex}
                                disabled={assessmentResult?.submitted}
                                onClick={() => handleAssessmentAnswer(q.id, optIndex)}
                                className={`w-full text-left p-3.5 rounded-xl border text-xs transition ${btnStyle}`}
                              >
                                <span className="font-mono font-bold mr-2">
                                  {String.fromCharCode(65 + optIndex)}.
                                </span>
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Submit button */}
                <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
                  {assessmentResult?.submitted ? (
                    <button
                      onClick={() => {
                        setAssessmentResult(null);
                        setAssessmentAnswers({});
                      }}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition flex items-center gap-2"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retake Assessment</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitFinalAssessment}
                      disabled={
                        Object.keys(assessmentAnswers).length <
                        course.finalAssessment.questions.length
                      }
                      className={`px-8 py-3 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                        Object.keys(assessmentAnswers).length ===
                        course.finalAssessment.questions.length
                          ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 hover:opacity-90 shadow-md'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <Award className="w-4 h-4" />
                      <span>Submit & Generate Certificate</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Course Curriculum Sidebar */}
        <div className="w-full lg:w-80 xl:w-96 bg-slate-900 border-l border-slate-800 flex flex-col flex-shrink-0 h-[600px] lg:h-auto overflow-hidden">
          <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Course Syllabus
              </h3>
              <p className="text-[11px] text-slate-500">
                {course.modules.length} Modules • {allLessons.length} Lessons
              </p>
            </div>
            <span className="text-xs font-bold text-teal-400 font-mono">
              {progressPercent}%
            </span>
          </div>

          {/* Module List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-3 space-y-4">
            {course.modules.map((mod, modIdx) => (
              <div key={mod.id} className="pt-2 first:pt-0">
                <h4 className="text-xs font-bold text-slate-300 px-2 mb-2 flex items-center justify-between">
                  <span className="truncate">{mod.title}</span>
                  <span className="text-[10px] text-slate-500">
                    {mod.lessons.length} parts
                  </span>
                </h4>

                <div className="space-y-1">
                  {mod.lessons.map((les) => {
                    const isSelected = les.id === activeLessonId;
                    const isLessonCompleted = progress?.completedLessons.includes(les.id);

                    return (
                      <button
                        key={les.id}
                        onClick={() => handleSelectLesson(les.id)}
                        className={`w-full text-left p-2.5 rounded-xl text-xs transition flex items-start gap-2.5 ${
                          isSelected
                            ? 'bg-teal-600/20 border border-teal-500/40 text-white font-semibold'
                            : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="mt-0.5">
                          {isLessonCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-teal-400" />
                          ) : (
                            <Play className="w-3.5 h-3.5 text-slate-500" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="truncate leading-tight">{les.title}</p>
                          <span className="text-[10px] text-slate-500">
                            {les.durationMinutes} mins
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Assessment Entry Item */}
            <div className="pt-3">
              <button
                onClick={() => setActiveTab('assessment')}
                className={`w-full text-left p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition ${
                  activeTab === 'assessment'
                    ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-amber-500/30'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Final Certification Assessment</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
