import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Award,
  BookOpen,
  Users,
  CheckCircle2,
  Plus,
  Search,
  Eye,
  Trash2,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Sparkles,
  X,
} from 'lucide-react';
import { storageService, subscribeStorage } from '../../services/storage';
import { Course, KarmetraCertificate } from '../../types';

export const AdminLearningManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [certificates, setCertificates] = useState<KarmetraCertificate[]>([]);
  const [activeTab, setActiveTab] = useState<'courses' | 'certificates'>('courses');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Course Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Computer & Office Skills');
  const [newDifficulty, setNewDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [newHours, setNewHours] = useState('4');
  const [newTagline, setNewTagline] = useState('');
  const [newSkills, setNewSkills] = useState('Excel, MIS Reporting, Formulas');

  useEffect(() => {
    const load = () => {
      setCourses(storageService.getCourses());
      setCertificates(storageService.getAllCertificates());
    };
    load();
    const unsub = subscribeStorage(load);
    return () => unsub();
  }, []);

  const totalEnrollments = courses.reduce((sum, c) => sum + (c.enrolledCount || 0), 0);

  const handleToggleCourseStatus = (courseId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Published' ? 'Archived' : 'Published';
    storageService.updateCourse(courseId, { status: newStatus as any });
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const courseId = `crs-${Date.now()}`;
    const code = `KMT-ACD-${Math.floor(100 + Math.random() * 900)}`;

    const newCourse: Course = {
      id: courseId,
      karmetraCourseCode: code,
      title: newTitle.trim(),
      slug: newTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      tagline: newTagline.trim() || 'Comprehensive skill training for workplace success.',
      description: `${newTitle.trim()} is an in-depth vocational skill course designed to prepare learners for real-world job responsibilities with verifiable certification.`,
      category: newCategory as any,
      difficulty: newDifficulty,
      durationHours: parseFloat(newHours) || 4,
      totalLessons: 6,
      rating: 4.9,
      ratingCount: 12,
      enrolledCount: 1,
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60',
      instructorName: 'Karmetra Senior Faculty',
      instructorTitle: 'Corporate Skill Specialist',
      instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      skillsEarned: newSkills.split(',').map((s) => s.trim()).filter(Boolean),
      learningObjectives: [
        'Understand foundational principles and workflow standards.',
        'Execute daily operational tasks with efficiency and accuracy.',
        'Pass standard compliance and quality assessments.',
      ],
      targetJobRoles: ['Operations Executive', 'Office Specialist', 'Executive Assistant'],
      certificateEnabled: true,
      certificateType: 'Karmetra Skill Certificate',
      updatedAt: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
      modules: [
        {
          id: `${courseId}-m1`,
          title: 'Module 1: Foundations & Core Concepts',
          description: 'Introduction to standard tools and industry terminology.',
          order: 1,
          lessons: [
            {
              id: `${courseId}-l1`,
              title: 'Lesson 1.1: Overview & Setup',
              durationMinutes: 15,
              videoDurationSeconds: 900,
              summaryText: 'Overview of core operational functions.',
              keyTakeaways: ['Key interface controls', 'Safety and security protocols'],
              practiceExercise: 'Practice navigating through standard menu layouts.',
            },
            {
              id: `${courseId}-l2`,
              title: 'Lesson 1.2: Daily Workflow Execution',
              durationMinutes: 20,
              videoDurationSeconds: 1200,
              summaryText: 'Executing routine tasks accurately.',
              keyTakeaways: ['Step-by-step checklist', 'Error handling'],
              practiceExercise: 'Complete the sample workflow form.',
            },
          ],
        },
      ],
      finalAssessment: {
        id: `${courseId}-exam`,
        title: `${newTitle.trim()} Official Certification Exam`,
        description: 'Comprehensive multiple-choice final examination to qualify for the official verified Karmetra Skill Certificate.',
        passingScorePercent: 70,
        questions: [
          {
            id: 'q1',
            question: 'What is the primary objective of following standard operating procedures?',
            options: [
              'To increase operational accuracy and safety',
              'To delay task completion',
              'To avoid digital tools',
              'None of the above',
            ],
            correctOptionIndex: 0,
            points: 50,
          },
          {
            id: 'q2',
            question: 'Which action ensures high quality before submitting a work report?',
            options: [
              'Double-checking entries and reconciling totals',
              'Ignoring errors',
              'Skipping the review step',
              'Deleting the records',
            ],
            correctOptionIndex: 0,
            points: 50,
          },
        ],
      },
      status: 'Published',
      passingScore: 70,
      featured: true,
    };

    storageService.createCourse(newCourse);
    setShowCreateModal(false);
    setNewTitle('');
    setNewTagline('');
  };

  const filteredCourses = courses.filter((c) => {
    return (
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.karmetraCourseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const filteredCerts = certificates.filter((c) => {
    return (
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.courseTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Metrics Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase">Total Academy Courses</span>
            <BookOpen className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{courses.length}</div>
          <p className="text-[11px] text-teal-700 font-semibold mt-1">
            {courses.filter((c) => c.status === 'Published').length} Live Published
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase">Total Enrollments</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalEnrollments}</div>
          <p className="text-[11px] text-blue-700 font-semibold mt-1">Across all categories</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase">Issued Certificates</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{certificates.length}</div>
          <p className="text-[11px] text-amber-700 font-semibold mt-1">100% Verifiable Online</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase">Passing Standard</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">70%</div>
          <p className="text-[11px] text-emerald-700 font-semibold mt-1">Assessment benchmark</p>
        </div>
      </div>

      {/* Control Bar: Tabs, Search, Add Course */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              activeTab === 'courses'
                ? 'bg-teal-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Course Catalog ({courses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('certificates')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              activeTab === 'certificates'
                ? 'bg-teal-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Issued Certificates Ledger ({certificates.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search courses or cert IDs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 w-52 sm:w-64"
            />
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add Course</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Course Catalog Table */}
      {activeTab === 'courses' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4">Code & Course</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Difficulty & Hours</th>
                  <th className="p-4">Enrollments</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCourses.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={c.thumbnail}
                          alt={c.title}
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                        <div>
                          <p className="font-mono text-[10px] font-bold text-teal-700">
                            {c.karmetraCourseCode}
                          </p>
                          <p className="font-bold text-slate-900">{c.title}</p>
                          <p className="text-[11px] text-slate-500 truncate max-w-xs">
                            {c.tagline}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">
                        {c.category}
                      </span>
                    </td>

                    <td className="p-4">
                      <p className="font-semibold text-slate-800">{c.difficulty}</p>
                      <p className="text-[11px] text-slate-500">
                        {c.durationHours} hrs • {c.totalLessons} lessons
                      </p>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-slate-900">{c.enrolledCount || 0}</p>
                      <p className="text-[11px] text-slate-500">⭐ {c.rating} ({c.ratingCount})</p>
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          c.status === 'Published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleToggleCourseStatus(c.id, c.status)}
                        className={`px-3 py-1.5 rounded-lg font-bold transition text-xs ${
                          c.status === 'Published'
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            : 'bg-teal-600 hover:bg-teal-700 text-white'
                        }`}
                      >
                        {c.status === 'Published' ? 'Archive' : 'Publish'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Certificates Ledger Table */}
      {activeTab === 'certificates' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4">Certificate ID</th>
                  <th className="p-4">Candidate Name</th>
                  <th className="p-4">Course</th>
                  <th className="p-4">Score</th>
                  <th className="p-4">Issue Date</th>
                  <th className="p-4">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCerts.map((cert) => (
                  <tr key={cert.id} className="hover:bg-slate-50/60 transition">
                    <td className="p-4">
                      <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded border border-teal-200">
                        {cert.id}
                      </span>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-slate-900">{cert.recipientName}</p>
                      <p className="text-[11px] text-slate-500">{cert.recipientId}</p>
                    </td>

                    <td className="p-4 font-semibold text-slate-800">
                      {cert.courseTitle}
                    </td>

                    <td className="p-4">
                      <span className="font-black text-emerald-700">
                        {cert.assessmentScore}%
                      </span>
                    </td>

                    <td className="p-4 text-slate-600">{cert.issueDate}</td>

                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        Valid & Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Course Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-teal-600" />
                <span>Create New Karmetra Academy Course</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Course Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advanced Inventory Management with ERP & Barcode Systems"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. Master warehouse inbound receipt, stock reconciliation, and dispatch."
                  value={newTagline}
                  onChange={(e) => setNewTagline(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option>Computer & Office Skills</option>
                    <option>Data & Analytics</option>
                    <option>Business</option>
                    <option>HR</option>
                    <option>Blue Collar / Operations</option>
                    <option>Career Skills</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Difficulty</label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Skills Earned (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Inventory Auditing, 5S Safety, SAP MM, Barcode Scanning"
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-xs"
                >
                  Publish Course to Academy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
