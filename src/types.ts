export type UserRole = 'seeker' | 'employer' | 'recruiter' | 'admin';

export type JobType = 'Full-Time' | 'Part-Time' | 'Contract' | 'Gig' | 'Internship' | 'Walk-In';
export type WorkMode = 'On-Site' | 'Work From Home' | 'Hybrid' | 'Field Work';
export type PayPeriod = 'Monthly' | 'Annual' | 'Per Day' | 'Per Hour';
export type ApplicationStatus = 'Applied' | 'Viewed' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected';
export type SubmissionStatus = 'New' | 'Screened' | 'Shortlisted' | 'Submitted' | 'Interview' | 'Selected' | 'Joined' | 'Rejected';
export type InterviewType = 'Phone' | 'Video' | 'In-Person' | 'Walk-in';
export type InterviewStatus = 'Pending' | 'Accepted' | 'Declined' | 'Rescheduled' | 'Completed';

export type VerificationStatus = 'Pending Verification' | 'Pending' | 'Under Review' | 'Verified' | 'Approved' | 'Rejected' | 'Suspended';
export type JobApprovalStatus = 'Draft' | 'Pending Admin Review' | 'Approved' | 'Live' | 'Rejected' | 'Expired' | 'Suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface EducationRecord {
  id: string;
  highestEducation: string;
  courseDegree: string;
  specialization?: string;
  collegeInstitute: string;
  university?: string;
  passingYear: string;
}

export interface ExperienceRecord {
  id: string;
  title: string;
  company: string;
  employmentType?: string;
  location?: string;
  joiningDate?: string;
  leavingDate?: string;
  responsibilities?: string;
  skillsUsed?: string[];
}

export interface CandidateProfile {
  id: string;
  userId: string;
  karmetraId?: string; // Unique e.g. KM-CAN-88219
  name: string;
  title: string;
  email: string;
  phone: string;
  age?: number;
  dob?: string;
  gender?: string;
  location: string;
  city?: string;
  locality?: string;
  coordinates?: { lat: number; lng: number };
  
  // Detailed Records
  educationList?: EducationRecord[];
  workExperienceList?: ExperienceRecord[];
  workHistory?: any[];
  
  // Core metrics & Fallbacks
  education?: string;
  experienceYears: number;
  expectedSalary: number; // in INR / month
  payPeriod: PayPeriod;
  
  // Categorized Skills
  skills: string[];
  primarySkills?: string[];
  secondarySkills?: string[];
  technicalSkills?: string[];
  softSkills?: string[];
  verifiedSkills?: string[];
  
  // Certifications list
  certifications?: {
    certificateId: string;
    title: string;
    courseId?: string;
    issueDate: string;
    issuer: string;
    type: string;
    score: number;
    skills: string[];
    status: 'Valid' | 'Revoked';
  }[];
  
  languages: string[];
  
  // Preferences
  preferredRole?: string;
  preferredCategory?: string;
  preferredLocations: string[];
  noticePeriod: string;
  availability: 'Immediate' | 'Within 15 Days' | '1 Month' | 'Not Looking';
  immediateJoining?: boolean;
  workMode?: WorkMode;
  jobType?: JobType;
  
  // Resume & Verification
  resumeUrl?: string;
  resumeName?: string;
  resumeUpdatedAt?: string;
  summary: string;
  isVerified: boolean;
  profileStrength: number; // 0-100
  profileVisibility?: 'Public to verified employers' | 'Visible only when applying' | 'Private';
  avatar?: string;
}

export interface Company {
  id: string;
  karmetraId?: string; // Unique e.g. KM-EMP-10245
  name: string;
  legalName?: string;
  contactPerson?: string;
  designation?: string;
  companyPhone?: string;
  companyEmail?: string;
  businessType?: string;
  logo: string;
  industry: string;
  location: string;
  registeredAddress?: string;
  workplaceLocation?: string;
  employeeCount: string;
  about: string;
  website?: string;
  isVerified: boolean;
  verificationStatus?: VerificationStatus;
  gstin?: string;
  pan?: string;
  gstDocUrl?: string;
  panDocUrl?: string;
  regDocUrl?: string;
  submittedAt?: string;
  adminNotes?: string;
  activeJobsCount: number;
  benefits: string[];
  rating?: number;
}

export interface RecruiterProfile {
  id: string;
  userId: string;
  karmetraId: string; // Unique e.g. KM-REC-10025
  recruiterName: string;
  designation?: string;
  agencyLegalName: string;
  agencyType?: string;
  pan: string;
  gstin?: string;
  registeredAddress: string;
  officeAddress: string;
  contactNumber: string;
  businessEmail: string;
  agencyExperience: string;
  industrySpecialization?: string[];
  recruitmentCategories: string[];
  locationsServed: string[];
  website?: string;
  about?: string;
  panDocUrl?: string;
  gstDocUrl?: string;
  regDocUrl?: string;
  verificationStatus: VerificationStatus;
  isVerified: boolean;
  submittedAt: string;
  adminNotes?: string;
  avatar?: string;
}

export interface Job {
  id: string;
  title: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  location: string;
  department?: string;
  distanceKm?: number;
  coordinates?: { lat: number; lng: number };
  
  // Salary details
  minSalary: number;
  maxSalary: number;
  payPeriod: PayPeriod;
  salaryType?: PayPeriod;
  incentives?: string;
  performanceBonus?: string;
  joiningBonus?: string;
  overtimePay?: string;
  
  // Experience & Skills
  fresherAccepted?: boolean;
  minExperience: number;
  maxExperience: number;
  skillsRequired: string[];
  preferredSkills?: string[];
  languagesRequired?: string[];
  
  // Job core info
  jobType: JobType;
  workMode: WorkMode;
  category: string;
  openings: number;
  description: string;
  responsibilities: string[];
  requirements: string[];
  
  // Eligibility
  eligibility?: {
    education?: string;
    ageRequirement?: string;
    drivingLicenseRequired?: boolean;
    vehicleRequired?: boolean;
  };
  
  // Work schedule
  workSchedule?: {
    shiftType?: string;
    shiftTiming?: string;
    weeklyWorkingDays?: string;
    weeklyOff?: string;
    nightShift?: boolean;
    overtime?: boolean;
  };
  
  // Benefits
  benefits: string[];
  
  // Vehicle requirement
  vehicleRequirement?: {
    bikeRequired?: boolean;
    scooterAccepted?: boolean;
    dlRequired?: boolean;
    ownVehicleRequired?: boolean;
    companyVehicleProvided?: boolean;
    fuelAllowance?: boolean;
    maintenanceAllowance?: boolean;
  };
  
  // Location
  fullAddress?: string;
  area?: string;
  city?: string;
  pincode?: string;
  
  // Interview info
  interviewInfo?: {
    interviewType?: InterviewType;
    interviewLocation?: string;
    interviewTiming?: string;
    contactPerson?: string;
    contactPhone?: string;
  };
  
  // Joining & Company info
  postedTime: string;
  joiningDate?: string;
  companyDescription?: string;
  
  // Flags & Verification
  isUrgent: boolean; // QuickHire
  isWalkIn: boolean;
  isVerifiedEmployer: boolean;
  isVerifiedJob: boolean;
  recruiterId?: string;
  recruiterName?: string;
  contactPerson?: string;
  contactPhone?: string;
  
  // Admin Approval Workflow Status & Expiry
  approvalStatus?: JobApprovalStatus;
  status: 'Active' | 'Closed' | 'Draft' | 'Pending Admin Review' | 'Expired' | 'Rejected' | 'Suspended';
  publishedAt?: string;
  expiresAt?: string;
  postingFee?: number;
  paymentStatus?: 'Free' | 'Paid' | 'Pending';
  reviewNotes?: string;
  submittedAt?: string;
  fraudAlertCount?: number;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  companyLogo: string;
  candidateId: string;
  candidateName: string;
  candidateTitle: string;
  candidatePhone: string;
  candidateLocation: string;
  appliedDate: string;
  status: ApplicationStatus;
  statusHistory: {
    status: ApplicationStatus;
    updatedAt: string;
    note?: string;
  }[];
  matchScore: number;
}

export interface RecruitmentRequirement {
  id: string;
  clientId: string;
  clientName: string;
  recruiterId: string;
  title: string;
  openings: number;
  location: string;
  minSalary: number;
  maxSalary: number;
  experienceYears: number;
  skills: string[];
  education: string;
  joiningDeadline: string;
  shift: string;
  jobType: JobType;
  interviewType: InterviewType;
  urgency: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Open' | 'Fulfilled' | 'Closed';
  payoutPerHire?: number;
}

export interface Submission {
  id: string;
  requirementId: string;
  requirementTitle: string;
  clientName: string;
  recruiterId: string;
  recruiterName: string;
  candidateId: string;
  candidateName: string;
  candidateSkills: string[];
  expectedSalary: number;
  experienceYears: number;
  status: SubmissionStatus;
  submittedAt: string;
  payoutAmount: number;
}

export interface Interview {
  id: string;
  applicationId?: string;
  candidateId: string;
  candidateName: string;
  employerId: string;
  employerName: string;
  jobTitle: string;
  date: string;
  time: string;
  interviewType: InterviewType;
  locationOrLink: string;
  status: InterviewStatus;
  notes?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole | 'company' | 'support';
  recipientId: string;
  recipientName?: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  attachedJobId?: string;
  attachedJobTitle?: string;
  attachedInterviewId?: string;
  attachedCourseId?: string;
  attachmentName?: string;
  attachmentType?: 'pdf' | 'doc' | 'image';
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantRole: 'Recruiter' | 'Company' | 'Karmetra Admin' | 'Career Support';
  participantCompany?: string;
  participantAvatar?: string;
  lastMessageText: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline?: boolean;
  verifiedBadge?: boolean;
}

export type NotificationCategory = 'jobs' | 'applications' | 'learning' | 'career';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  category: NotificationCategory;
  type: 'job_alert' | 'application' | 'interview' | 'message' | 'system' | 'learning' | 'career' | 'certificate';
  timestamp: string;
  isRead: boolean;
  read?: boolean; // legacy compatibility
  link?: string;
  targetId?: string;
  targetType?: 'job' | 'application' | 'course' | 'certificate' | 'interview' | 'career';
}

export interface AntiFraudAlert {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  reporterId?: string;
  reason: string;
  details: string;
  status: 'Pending' | 'Investigating' | 'Resolved' | 'Dismissed';
  reportedAt: string;
  riskScore: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string[];
  experience: {
    title: string;
    company: string;
    duration: string;
    description: string;
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  languages: string[];
}

export interface DeletedJob {
  id: string;
  job: Job;
  deletedAt: string;
  deletedBy: string;
  deletedByRole: string;
  reason?: string;
}

export interface AdminActivityLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetType: 'job' | 'user' | 'company' | 'recruiter' | 'fraud_alert' | 'system';
  targetId: string;
  targetName: string;
  timestamp: string;
  details?: string;
}

export interface UserReport {
  id: string;
  reportedBy: string;
  targetType: 'job' | 'user' | 'company';
  targetId: string;
  targetTitle: string;
  category: 'fake_job' | 'charging_money' | 'harassment' | 'scam' | 'other';
  description: string;
  status: 'Pending' | 'Under Review' | 'Resolved' | 'Dismissed';
  createdAt: string;
}

// -------------------------------------------------------------
// KARMETRA LEARNING & CERTIFICATION MODULE TYPES
// -------------------------------------------------------------

export type CourseCategory =
  | 'Computer & Office Skills'
  | 'Data & Analytics'
  | 'Business'
  | 'HR'
  | 'Blue Collar / Operations'
  | 'Career Skills';

export type CourseDifficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
export type CourseStatus = 'Draft' | 'Published' | 'Archived';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
}

export interface LessonQuiz {
  id: string;
  title: string;
  passingScorePercent: number;
  questions: QuizQuestion[];
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  durationMinutes: number;
  videoUrl?: string; // YouTube or sample video
  videoDurationSeconds: number;
  summaryText?: string;
  keyTakeaways?: string[];
  pdfNotesUrl?: string;
  pdfNotesName?: string;
  quiz?: LessonQuiz;
  practiceExercise?: string;
}

export interface CourseModule {
  id: string;
  title: string;
  description?: string;
  order: number;
  lessons: Lesson[];
  moduleQuiz?: LessonQuiz;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  points: number;
  explanation?: string;
}

export interface CourseFinalAssessment {
  id: string;
  title: string;
  description: string;
  passingScorePercent: number; // e.g. 70
  timeLimitMinutes?: number;
  questions: AssessmentQuestion[];
}

export interface Course {
  id: string;
  karmetraCourseCode: string; // e.g. KMT-CRS-101
  title: string;
  slug: string;
  tagline: string;
  description: string;
  category: CourseCategory;
  difficulty: CourseDifficulty;
  durationHours: number;
  totalLessons: number;
  instructorName: string;
  instructorTitle: string;
  instructorAvatar?: string;
  thumbnail: string;
  featured?: boolean;
  status: CourseStatus;
  
  // Learning outcomes & skills
  skillsEarned: string[];
  learningObjectives: string[];
  prerequisites?: string[];
  targetJobRoles: string[]; // e.g. ['Data Analyst', 'MIS Executive', 'Reporting Analyst']
  
  // Content hierarchy
  modules: CourseModule[];
  finalAssessment: CourseFinalAssessment;
  
  // Certification details
  certificateEnabled: boolean;
  certificateType: 'Karmetra Certificate of Completion' | 'Karmetra Skill Certificate';
  passingScore: number; // e.g. 70
  
  // Meta & Analytics
  enrolledCount: number;
  rating: number;
  ratingCount: number;
  updatedAt: string;
  createdAt?: string;
}

export interface CourseProgress {
  id: string;
  userId: string;
  candidateId: string;
  courseId: string;
  enrolledAt: string;
  completedLessons: string[]; // lesson ids
  lessonProgress: Record<string, {
    watchedSeconds: number;
    durationSeconds: number;
    completed: boolean;
    lastWatchedAt: string;
  }>;
  currentLessonId?: string;
  quizScores: Record<string, { scorePercent: number; passed: boolean; completedAt: string }>;
  assessmentAttempt?: {
    scorePercent: number;
    passed: boolean;
    answers: Record<string, number>;
    completedAt: string;
    attemptCount: number;
  };
  overallProgressPercent: number; // 0-100
  isCompleted: boolean;
  completedAt?: string;
  certificateId?: string;
}

export interface KarmetraCertificate {
  id: string; // KMT-2026-XXXXXXXX
  userId: string;
  candidateId: string;
  candidateName: string;
  candidateKarmetraId?: string;
  courseId: string;
  courseName: string;
  courseCategory: CourseCategory;
  certificateType: 'Karmetra Certificate of Completion' | 'Karmetra Skill Certificate';
  issueDate: string; // DD/MM/YYYY
  scorePercent: number;
  skillsCovered: string[];
  instructorName: string;
  instructorTitle: string;
  status: 'Valid' | 'Revoked';
  qrCodeUrl?: string;
  verificationUrl: string;
  revocationReason?: string;
}

export interface CareerPathRoadmap {
  id: string;
  title: string;
  roleName: string;
  industry: string;
  description: string;
  salaryRange: string;
  hiringDemand: 'Very High' | 'High' | 'Moderate';
  icon: string;
  skillsProgression: {
    level: string;
    skills: string[];
    courseIds: string[];
  }[];
  allRequiredSkills: string[];
  recommendedCourseIds: string[];
  topJobCategories: string[];
  matchingJobRoles: string[];
}


