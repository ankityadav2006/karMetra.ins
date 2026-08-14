import {
  User,
  CandidateProfile,
  Company,
  RecruiterProfile,
  Job,
  Application,
  RecruitmentRequirement,
  Submission,
  Interview,
  Message,
  Notification,
  AntiFraudAlert,
  ResumeData,
  UserRole,
  DeletedJob,
  AdminActivityLog,
  UserReport,
  Course,
  CourseProgress,
  KarmetraCertificate,
  CareerPathRoadmap,
  Conversation,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_CANDIDATES,
  INITIAL_COMPANIES,
  INITIAL_JOBS,
  INITIAL_APPLICATIONS,
  INITIAL_REQUIREMENTS,
  INITIAL_SUBMISSIONS,
  INITIAL_INTERVIEWS,
  INITIAL_MESSAGES,
  INITIAL_NOTIFICATIONS,
  INITIAL_FRAUD_ALERTS,
  INITIAL_CONVERSATIONS,
} from '../data/mockData';
import {
  INITIAL_COURSES,
  INITIAL_CAREER_ROADMAPS,
  INITIAL_CERTIFICATES,
  INITIAL_COURSE_PROGRESS,
} from '../data/learningData';

const KEYS = {
  CURRENT_USER: 'karmetra_current_user',
  USERS: 'karmetra_users',
  CANDIDATES: 'karmetra_candidates',
  COMPANIES: 'karmetra_companies',
  RECRUITERS: 'karmetra_recruiters',
  JOBS: 'karmetra_jobs',
  APPLICATIONS: 'karmetra_applications',
  SAVED_JOBS: 'karmetra_saved_jobs',
  REQUIREMENTS: 'karmetra_requirements',
  SUBMISSIONS: 'karmetra_submissions',
  INTERVIEWS: 'karmetra_interviews',
  MESSAGES: 'karmetra_messages',
  CONVERSATIONS: 'karmetra_conversations',
  NOTIFICATIONS: 'karmetra_notifications',
  FRAUD_ALERTS: 'karmetra_fraud_alerts',
  RESUME_DATA: 'karmetra_resume_data',
  DELETED_JOBS: 'karmetra_deleted_jobs',
  ADMIN_LOGS: 'karmetra_admin_logs',
  USER_REPORTS: 'karmetra_user_reports',
  COURSES: 'karmetra_courses',
  COURSE_PROGRESS: 'karmetra_course_progress',
  CERTIFICATES: 'karmetra_certificates',
  CAREER_ROADMAPS: 'karmetra_career_roadmaps',
};

// Helper for getItem / setItem
function getStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    const parsed = JSON.parse(item);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch (err) {
    console.warn(`Error reading localStorage key ${key}:`, err);
    return fallback;
  }
}

function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error writing localStorage key ${key}:`, err);
  }
}

// Global subscribers listener system for real-time reactivity in React hooks
type Listener = () => void;
const listeners: Set<Listener> = new Set();

export function subscribeStorage(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notifySubscribers() {
  listeners.forEach((l) => l());
}

export const storageService = {
  // Current Active User Session
  getCurrentUser(): User {
    const user = getStorage<User>(KEYS.CURRENT_USER, INITIAL_USERS[0]);
    if (!user || !user.name || !user.role) {
      return INITIAL_USERS[0];
    }
    return user;
  },

  setCurrentUser(user: User): void {
    setStorage(KEYS.CURRENT_USER, user);
    notifySubscribers();
  },

  // Switch role quickly
  switchRole(role: UserRole): User {
    const users = this.getUsers();
    let target = users.find((u) => u.role === role);
    if (!target) {
      if (role === 'seeker') target = INITIAL_USERS[0];
      else if (role === 'employer') target = INITIAL_USERS[1];
      else if (role === 'recruiter') target = INITIAL_USERS[2];
      else target = INITIAL_USERS[3];
    }
    this.setCurrentUser(target);
    return target;
  },

  getUsers(): User[] {
    return getStorage<User[]>(KEYS.USERS, INITIAL_USERS);
  },

  // Candidate Profile Helper
  getCandidates(): CandidateProfile[] {
    const raw = getStorage<CandidateProfile[]>(KEYS.CANDIDATES, INITIAL_CANDIDATES);
    return raw.map((c) => {
      const karmetraId = c.karmetraId || `KM-CAN-${Math.floor(10000 + (parseInt(c.id.replace(/\D/g, '') || '1') * 7) % 90000)}`;
      const educationList = c.educationList || [
        {
          id: 'edu-1',
          highestEducation: c.education || '12th Pass',
          courseDegree: 'HSC (Higher Secondary)',
          specialization: 'Commerce / Arts',
          collegeInstitute: 'State Higher Secondary School',
          passingYear: '2023',
        },
      ];
      const workExperienceList = c.workExperienceList || (c.workHistory || []).map((w, idx) => ({
        id: `exp-${idx}`,
        title: w.title,
        company: w.company,
        employmentType: 'Full-Time',
        location: c.location,
        joiningDate: w.duration?.split('-')[0]?.trim() || '2023',
        leavingDate: w.duration?.split('-')[1]?.trim() || 'Present',
        responsibilities: w.description,
        skillsUsed: c.skills.slice(0, 3),
      }));

      const primarySkills = c.primarySkills || c.skills.slice(0, 3);
      const secondarySkills = c.secondarySkills || c.skills.slice(3, 6);
      const technicalSkills = c.technicalSkills || ['Excel', 'Mobile App', 'POS Machine'];
      const softSkills = c.softSkills || ['Communication', 'Time Management', 'Customer Relations'];

      // Dynamic Strength Calculation
      let score = 0;
      if (c.name && c.phone && c.email) score += 20;
      if (educationList.length > 0) score += 15;
      if (workExperienceList.length > 0) score += 20;
      if (c.skills.length >= 3) score += 15;
      if (c.expectedSalary > 0 && c.preferredLocations?.length > 0) score += 15;
      if (c.resumeName || c.resumeUrl) score += 10;
      if (c.languages?.length > 0) score += 5;

      return {
        ...c,
        karmetraId,
        age: c.age || 24,
        dob: c.dob || '2001-08-15',
        gender: c.gender || 'Male',
        city: c.city || c.location.split(',')[1]?.trim() || 'Mumbai',
        locality: c.locality || c.location.split(',')[0]?.trim() || 'Andheri East',
        educationList,
        workExperienceList,
        primarySkills,
        secondarySkills,
        technicalSkills,
        softSkills,
        preferredRole: c.preferredRole || c.title.split(' ')[0] || 'Executive',
        preferredCategory: c.preferredCategory || 'Field & Retail',
        immediateJoining: c.immediateJoining !== undefined ? c.immediateJoining : true,
        profileStrength: score,
        profileVisibility: c.profileVisibility || 'Public to verified employers',
        resumeName: c.resumeName || (c.resumeUrl ? `${c.name.replace(/\s+/g, '_')}_Resume.pdf` : 'Candidate_Resume.pdf'),
        resumeUpdatedAt: c.resumeUpdatedAt || '2026-02-01',
      };
    });
  },

  getCandidateProfile(userId?: string): CandidateProfile {
    const candidates = this.getCandidates();
    if (!userId) return candidates[0] || INITIAL_CANDIDATES[0];
    const found = candidates.find((c) => c.userId === userId || c.id === userId);
    if (found) return found;
    return candidates[0] || INITIAL_CANDIDATES[0];
  },

  updateCandidateProfile(profile: CandidateProfile): void {
    const candidates = this.getCandidates();
    const index = candidates.findIndex((c) => c.id === profile.id || c.userId === profile.userId);
    
    // Recalculate strength dynamically
    let score = 0;
    if (profile.name && profile.phone && profile.email) score += 20;
    if (profile.educationList && profile.educationList.length > 0) score += 15;
    if (profile.workExperienceList && profile.workExperienceList.length > 0) score += 20;
    if (profile.skills && profile.skills.length >= 3) score += 15;
    if (profile.expectedSalary > 0 && profile.preferredLocations?.length > 0) score += 15;
    if (profile.resumeName || profile.resumeUrl) score += 10;
    if (profile.languages && profile.languages.length > 0) score += 5;

    const updated = {
      ...profile,
      profileStrength: score,
    };

    if (index >= 0) {
      candidates[index] = updated;
    } else {
      candidates.push(updated);
    }
    setStorage(KEYS.CANDIDATES, candidates);
    notifySubscribers();
  },

  // Companies & Verification
  getCompanies(): Company[] {
    const raw = getStorage<Company[]>(KEYS.COMPANIES, INITIAL_COMPANIES);
    return raw.map((comp, idx) => {
      const karmetraId = comp.karmetraId || `KM-EMP-${10240 + idx}`;
      const isApproved = comp.verificationStatus === 'Approved' || comp.verificationStatus === 'Verified' || comp.isVerified;
      return {
        ...comp,
        karmetraId,
        contactPerson: comp.contactPerson || 'Neha Sharma',
        designation: comp.designation || 'HR Manager',
        companyPhone: comp.companyPhone || '+91 98111 22334',
        companyEmail: comp.companyEmail || 'hr@company.in',
        registeredAddress: comp.registeredAddress || `${comp.location}, Maharashtra, India`,
        workplaceLocation: comp.workplaceLocation || comp.location,
        website: comp.website || `https://www.${comp.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.in`,
        gstin: comp.gstin || '27AAAAA0000A1Z5',
        pan: comp.pan || 'AAAPA1234F',
        verificationStatus: isApproved ? 'Verified' : (comp.verificationStatus || 'Pending Verification'),
        isVerified: isApproved,
      };
    });
  },

  updateCompanyVerification(companyId: string, verificationData: Partial<Company>): void {
    const companies = this.getCompanies();
    let company = companies.find((c) => c.id === companyId);
    if (company) {
      Object.assign(company, verificationData);
    } else {
      company = {
        id: companyId,
        name: verificationData.name || 'New Employer',
        logo: '🏢',
        industry: 'Services',
        location: 'Mumbai, India',
        employeeCount: '50-100',
        about: 'Registered employer on KarMetra platform.',
        isVerified: false,
        verificationStatus: 'Pending Verification',
        activeJobsCount: 0,
        benefits: ['PF', 'ESIC'],
        ...verificationData,
      };
      companies.push(company);
    }
    setStorage(KEYS.COMPANIES, companies);
    notifySubscribers();
  },

  approveCompanyVerification(companyId: string): void {
    const companies = this.getCompanies();
    const comp = companies.find((c) => c.id === companyId);
    if (comp) {
      comp.verificationStatus = 'Verified';
      comp.isVerified = true;
      setStorage(KEYS.COMPANIES, companies);

      this.addNotification({
        userId: 'u-2',
        title: '✅ Business Verification Approved',
        message: `Your company (${comp.name}) is now verified with the ✓ Verified Employer badge.`,
        type: 'system',
      });

      notifySubscribers();
    }
  },

  rejectCompanyVerification(companyId: string, notes?: string): void {
    const companies = this.getCompanies();
    const comp = companies.find((c) => c.id === companyId);
    if (comp) {
      comp.verificationStatus = 'Rejected';
      comp.isVerified = false;
      comp.adminNotes = notes;
      setStorage(KEYS.COMPANIES, companies);

      this.addNotification({
        userId: 'u-2',
        title: '⚠️ Verification Request Rejected',
        message: `Your business verification request for ${comp.name} was rejected. Note: ${notes || 'Invalid document format'}.`,
        type: 'system',
      });

      notifySubscribers();
    }
  },

  // Recruiter Profiles & Verification
  getRecruiters(): RecruiterProfile[] {
    const fallback: RecruiterProfile[] = [
      {
        id: 'rec-1',
        userId: 'u-3',
        karmetraId: 'KM-REC-10025',
        recruiterName: 'Ankit Sharma',
        designation: 'Senior Recruiter & Partner',
        agencyLegalName: 'ABC Talent Solutions India',
        agencyType: 'Staffing & Workforce Agency',
        pan: 'AAAPA1234K',
        gstin: '27AAAPA1234K1ZM',
        registeredAddress: 'Unit 402, Trade Tower, Bandra Kurla Complex, Mumbai',
        officeAddress: 'Thane West, Thane, Maharashtra',
        contactNumber: '+91 99000 88776',
        businessEmail: 'ankit.sharma@abctalent.in',
        agencyExperience: '8 Years',
        industrySpecialization: ['Blue Collar', 'Warehouse', 'Delivery', 'Retail', 'Customer Support'],
        recruitmentCategories: ['Delivery', 'Warehouse', 'Customer Support', 'Sales'],
        locationsServed: ['Mumbai', 'Thane', 'Navi Mumbai', 'Pune'],
        website: 'https://www.abctalent.in',
        about: 'Premier recruitment and manpower solutions agency specializing in frontline, blue-collar, and retail staffing.',
        verificationStatus: 'Verified',
        isVerified: true,
        submittedAt: '2026-01-15',
      },
    ];
    const raw = getStorage<RecruiterProfile[]>(KEYS.RECRUITERS, fallback);
    return raw.map((r, idx) => {
      const karmetraId = r.karmetraId || `KM-REC-${10025 + idx}`;
      const isApproved = r.verificationStatus === 'Approved' || r.verificationStatus === 'Verified' || r.isVerified;
      return {
        ...r,
        karmetraId,
        designation: r.designation || 'Senior Recruiter',
        agencyType: r.agencyType || 'Recruitment Consultancy',
        industrySpecialization: r.industrySpecialization || ['Blue Collar', 'Retail', 'Logistics'],
        website: r.website || `https://www.${r.agencyLegalName.toLowerCase().replace(/[^a-z0-9]/g, '')}.in`,
        about: r.about || 'Authorized staffing agency on KarMetra.',
        verificationStatus: isApproved ? 'Verified' : (r.verificationStatus || 'Pending Verification'),
        isVerified: isApproved,
      };
    });
  },

  updateRecruiterVerification(recData: Partial<RecruiterProfile>): void {
    const recruiters = this.getRecruiters();
    let rec = recruiters.find((r) => r.userId === recData.userId || r.id === recData.id);
    if (rec) {
      Object.assign(rec, recData);
    } else {
      rec = {
        id: `rec-${Date.now()}`,
        userId: recData.userId || 'u-3',
        recruiterName: recData.recruiterName || 'New Recruiter',
        agencyLegalName: recData.agencyLegalName || 'Staffing Agency',
        pan: recData.pan || '',
        registeredAddress: recData.registeredAddress || 'Mumbai',
        officeAddress: recData.officeAddress || 'Mumbai',
        contactNumber: recData.contactNumber || '+91 9800000000',
        businessEmail: recData.businessEmail || 'recruiter@agency.in',
        agencyExperience: '3 Years',
        recruitmentCategories: ['General'],
        locationsServed: ['Mumbai'],
        verificationStatus: 'Pending Verification',
        isVerified: false,
        submittedAt: new Date().toISOString().split('T')[0],
        ...recData,
      };
      recruiters.push(rec);
    }
    setStorage(KEYS.RECRUITERS, recruiters);
    notifySubscribers();
  },

  approveRecruiterVerification(recId: string): void {
    const recruiters = this.getRecruiters();
    const rec = recruiters.find((r) => r.id === recId || r.userId === recId);
    if (rec) {
      rec.verificationStatus = 'Verified';
      rec.isVerified = true;
      setStorage(KEYS.RECRUITERS, recruiters);

      this.addNotification({
        userId: rec.userId,
        title: '✅ Recruiter Agency Verified',
        message: `Your staffing agency (${rec.agencyLegalName}) is now approved with the ✓ Verified Recruiter badge.`,
        type: 'system',
      });

      notifySubscribers();
    }
  },

  rejectRecruiterVerification(recId: string, notes?: string): void {
    const recruiters = this.getRecruiters();
    const rec = recruiters.find((r) => r.id === recId || r.userId === recId);
    if (rec) {
      rec.verificationStatus = 'Rejected';
      rec.isVerified = false;
      rec.adminNotes = notes;
      setStorage(KEYS.RECRUITERS, recruiters);
      notifySubscribers();
    }
  },

  // Entitlement & Job Posting Policy (1 Free per 7 days, ₹299 additional, 30 day validity)
  getPostingEntitlement(userId?: string) {
    const uid = userId || this.getCurrentUser().id;
    const key = `karmetra_entitlement_${uid}`;
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
    const now = Date.now();

    let entitlement = getStorage<{ periodStart: number; freeUsed: number }>(key, {
      periodStart: now,
      freeUsed: 0,
    });

    // Reset entitlement if 7 days have elapsed
    if (now - entitlement.periodStart >= SEVEN_DAYS_MS) {
      entitlement = { periodStart: now, freeUsed: 0 };
      setStorage(key, entitlement);
    }

    const hasFreeAvailable = entitlement.freeUsed < 1;
    const nextFreeInMs = Math.max(0, SEVEN_DAYS_MS - (now - entitlement.periodStart));
    const daysUntilNextFree = Math.max(1, Math.ceil(nextFreeInMs / (24 * 60 * 60 * 1000)));

    return {
      hasFreeAvailable,
      freeUsed: entitlement.freeUsed,
      daysUntilNextFree,
      priceForNextPosting: hasFreeAvailable ? 0 : 299,
    };
  },

  recordPostingUse(userId: string, isPaid: boolean) {
    const uid = userId || this.getCurrentUser().id;
    const key = `karmetra_entitlement_${uid}`;
    const entitlement = this.getPostingEntitlement(uid);
    if (!isPaid) {
      setStorage(key, {
        periodStart: entitlement.hasFreeAvailable ? Date.now() : entitlement.freeUsed,
        freeUsed: 1,
      });
    }
    notifySubscribers();
  },

  // Jobs & Admin Approval Workflow
  getJobs(): Job[] {
    const rawJobs = getStorage<Job[]>(KEYS.JOBS, INITIAL_JOBS);
    const now = Date.now();
    let hasChanged = false;

    const processed = rawJobs.map((j) => {
      let status = j.status;
      let approvalStatus = j.approvalStatus || (j.status === 'Active' ? 'Approved' : 'Pending Admin Review');

      // Automatic 30-day Expiry check
      if (j.expiresAt && new Date(j.expiresAt).getTime() < now && status !== 'Expired') {
        status = 'Expired';
        approvalStatus = 'Expired';
        hasChanged = true;
      }

      return {
        ...j,
        status,
        approvalStatus,
      };
    });

    if (hasChanged) {
      setStorage(KEYS.JOBS, processed);
    }

    return processed;
  },

  getPublicApprovedJobs(): Job[] {
    // PUBLIC CANDIDATE SEARCH ONLY SHOWS APPROVED & LIVE JOBS THAT ARE NOT EXPIRED
    return this.getJobs().filter(
      (j) => (j.approvalStatus === 'Approved' || j.approvalStatus === 'Live') && j.status === 'Active'
    );
  },

  getJobById(id: string): Job | undefined {
    return this.getJobs().find((j) => j.id === id);
  },

  addJob(jobData: Partial<Job>): Job {
    const jobs = this.getJobs();
    const currentUser = this.getCurrentUser();
    const entitlement = this.getPostingEntitlement(currentUser.id);
    const isPaidPosting = !entitlement.hasFreeAvailable || jobData.paymentStatus === 'Paid';

    // Record usage
    this.recordPostingUse(currentUser.id, isPaidPosting);

    const newJob: Job = {
      id: `job-${Date.now()}`,
      title: jobData.title || 'Untitled Opening',
      companyId: jobData.companyId || 'comp-1',
      companyName: jobData.companyName || 'KarMetra Employer',
      companyLogo: jobData.companyLogo || '🏢',
      location: jobData.location || 'Mumbai',
      distanceKm: jobData.distanceKm || 3.5,
      coordinates: jobData.coordinates || { lat: 19.1136, lng: 72.8697 },
      minSalary: jobData.minSalary || 20000,
      maxSalary: jobData.maxSalary || 28000,
      payPeriod: jobData.payPeriod || 'Monthly',
      minExperience: jobData.minExperience || 0,
      maxExperience: jobData.maxExperience || 3,
      jobType: jobData.jobType || 'Full-Time',
      workMode: jobData.workMode || 'On-Site',
      category: jobData.category || 'General',
      openings: jobData.openings || 5,
      skillsRequired: jobData.skillsRequired || ['Communication'],
      description: jobData.description || 'Job details and requirements.',
      responsibilities: jobData.responsibilities || ['Perform daily duties accurately.'],
      requirements: jobData.requirements || ['10th Pass minimum.'],
      benefits: jobData.benefits || ['PF', 'ESIC', 'Incentives'],
      postedTime: 'Just now',
      joiningDate: jobData.joiningDate || 'Immediate',
      isUrgent: !!jobData.isUrgent,
      isWalkIn: !!jobData.isWalkIn,
      isVerifiedEmployer: !!jobData.isVerifiedEmployer,
      isVerifiedJob: false,
      recruiterId: jobData.recruiterId || currentUser.id,
      recruiterName: jobData.recruiterName || currentUser.name,
      contactPerson: jobData.contactPerson,
      contactPhone: jobData.contactPhone,
      
      // Payment & Expiry Metadata
      postingFee: isPaidPosting ? 299 : 0,
      paymentStatus: isPaidPosting ? 'Paid' : 'Free',

      // ADMIN REVIEW WORKFLOW REQUIREMENT
      approvalStatus: 'Pending Admin Review',
      status: 'Pending Admin Review',
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...jobData,
    };

    jobs.unshift(newJob);
    setStorage(KEYS.JOBS, jobs);

    // Notify Employer
    this.addNotification({
      userId: newJob.recruiterId || 'u-2',
      title: '⏳ Job Submitted for Admin Review',
      message: `Your job posting "${newJob.title}" (${newJob.paymentStatus === 'Paid' ? 'Paid ₹299' : 'Free Posting'}) is submitted. Jobs are normally reviewed within 2 hours.`,
      type: 'system',
    });

    notifySubscribers();
    return newJob;
  },

  repostOrRenewJob(jobId: string, isPaid: boolean): void {
    const jobs = this.getJobs();
    const job = jobs.find((j) => j.id === jobId);
    if (job) {
      const user = this.getCurrentUser();
      this.recordPostingUse(user.id, isPaid);

      job.approvalStatus = 'Pending Admin Review';
      job.status = 'Pending Admin Review';
      job.submittedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      job.postedTime = 'Just now';
      job.paymentStatus = isPaid ? 'Paid' : 'Free';
      job.postingFee = isPaid ? 299 : 0;
      delete job.publishedAt;
      delete job.expiresAt;

      setStorage(KEYS.JOBS, jobs);

      this.addNotification({
        userId: user.id,
        title: '⏳ Job Renewal Submitted for Admin Review',
        message: `Your job renewal for "${job.title}" has been submitted. Our team aims to review job postings within 2 hours.`,
        type: 'system',
      });

      notifySubscribers();
    }
  },

  approveJob(jobId: string): void {
    const jobs = this.getJobs();
    const job = jobs.find((j) => j.id === jobId);
    if (job) {
      const now = new Date();
      const expires = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 Days Validity

      job.approvalStatus = 'Approved';
      job.status = 'Active';
      job.isVerifiedJob = true;
      job.publishedAt = now.toISOString();
      job.expiresAt = expires.toISOString();

      setStorage(KEYS.JOBS, jobs);

      this.addNotification({
        userId: job.recruiterId || 'u-2',
        title: '🎉 Job Posting Approved & Live (30 Days)',
        message: `Your job "${job.title}" is approved and live on KarMetra for 30 days.`,
        type: 'system',
        link: 'jobs',
      });

      notifySubscribers();
    }
  },

  rejectJob(jobId: string, notes?: string): void {
    const jobs = this.getJobs();
    const job = jobs.find((j) => j.id === jobId);
    if (job) {
      job.approvalStatus = 'Rejected';
      job.status = 'Closed';
      job.reviewNotes = notes;
      setStorage(KEYS.JOBS, jobs);

      this.addNotification({
        userId: job.recruiterId || 'u-2',
        title: '⚠️ Job Posting Changes Requested / Rejected',
        message: `Your job posting "${job.title}" was not approved. Admin note: ${notes || 'Please provide accurate salary and shift timing details.'}`,
        type: 'system',
      });

      notifySubscribers();
    }
  },

  suspendJob(jobId: string, notes?: string): void {
    const jobs = this.getJobs();
    const job = jobs.find((j) => j.id === jobId);
    if (job) {
      job.approvalStatus = 'Suspended';
      job.status = 'Closed';
      job.reviewNotes = notes;
      setStorage(KEYS.JOBS, jobs);
      notifySubscribers();
    }
  },

  getApplications(): Application[] {
    return getStorage<Application[]>(KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
  },

  getApplicationsForCandidate(candidateId: string): Application[] {
    return this.getApplications().filter((a) => a.candidateId === candidateId);
  },

  getApplicationsForJob(jobId: string): Application[] {
    return this.getApplications().filter((a) => a.jobId === jobId);
  },

  applyForJob(candidate: CandidateProfile, job: Job, matchScore: number): Application {
    const apps = this.getApplications();
    const existing = apps.find((a) => a.jobId === job.id && a.candidateId === candidate.id);
    if (existing) return existing;

    const newApp: Application = {
      id: `app-${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.companyName,
      companyLogo: job.companyLogo,
      candidateId: candidate.id,
      candidateName: candidate.name,
      candidateTitle: candidate.title,
      candidatePhone: candidate.phone,
      candidateLocation: candidate.location,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Applied',
      statusHistory: [
        {
          status: 'Applied',
          updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: 'One-Tap Applied on KarMetra',
        },
      ],
      matchScore,
    };

    apps.unshift(newApp);
    setStorage(KEYS.APPLICATIONS, apps);

    // Create notification for employer
    this.addNotification({
      userId: job.recruiterId || 'u-2',
      title: '📥 New Candidate Application',
      message: `${candidate.name} applied for '${job.title}' (${matchScore}% HireMatch).`,
      type: 'application',
      link: 'applications',
    });

    notifySubscribers();
    return newApp;
  },

  updateApplicationStatus(appId: string, status: Application['status'], note?: string): void {
    const apps = this.getApplications();
    const app = apps.find((a) => a.id === appId);
    if (app) {
      app.status = status;
      app.statusHistory.push({
        status,
        updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        note: note || `Status updated to ${status}`,
      });
      setStorage(KEYS.APPLICATIONS, apps);

      // Notify candidate
      this.addNotification({
        userId: app.candidateId,
        title: `⚡ Application Status: ${status}`,
        message: `Your application for ${app.jobTitle} at ${app.companyName} is now ${status}.`,
        type: 'application',
        link: 'applications',
      });

      notifySubscribers();
    }
  },

  // Saved Jobs
  getSavedJobIds(): string[] {
    return getStorage<string[]>(KEYS.SAVED_JOBS, ['job-1', 'job-3']);
  },

  toggleSaveJob(jobId: string): boolean {
    const saved = this.getSavedJobIds();
    const index = saved.indexOf(jobId);
    let isSaved = false;
    if (index >= 0) {
      saved.splice(index, 1);
      isSaved = false;
    } else {
      saved.push(jobId);
      isSaved = true;
    }
    setStorage(KEYS.SAVED_JOBS, saved);
    notifySubscribers();
    return isSaved;
  },

  // Requirements & Submissions
  getRequirements(): RecruitmentRequirement[] {
    return getStorage<RecruitmentRequirement[]>(KEYS.REQUIREMENTS, INITIAL_REQUIREMENTS);
  },

  addRequirement(req: Omit<RecruitmentRequirement, 'id' | 'status'>): RecruitmentRequirement {
    const reqs = this.getRequirements();
    const newReq: RecruitmentRequirement = {
      ...req,
      id: `req-${Date.now()}`,
      status: 'Open',
    };
    reqs.unshift(newReq);
    setStorage(KEYS.REQUIREMENTS, reqs);
    notifySubscribers();
    return newReq;
  },

  getSubmissions(): Submission[] {
    return getStorage<Submission[]>(KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS);
  },

  addSubmission(sub: Omit<Submission, 'id' | 'submittedAt' | 'status'>): Submission {
    const subs = this.getSubmissions();
    const newSub: Submission = {
      ...sub,
      id: `sub-${Date.now()}`,
      status: 'Submitted',
      submittedAt: new Date().toLocaleString(),
    };
    subs.unshift(newSub);
    setStorage(KEYS.SUBMISSIONS, subs);
    notifySubscribers();
    return newSub;
  },

  // Interviews
  getInterviews(): Interview[] {
    return getStorage<Interview[]>(KEYS.INTERVIEWS, INITIAL_INTERVIEWS);
  },

  scheduleInterview(int: Omit<Interview, 'id' | 'status'>): Interview {
    const ints = this.getInterviews();
    const newInt: Interview = {
      ...int,
      id: `int-${Date.now()}`,
      status: 'Pending',
    };
    ints.unshift(newInt);
    setStorage(KEYS.INTERVIEWS, ints);

    this.addNotification({
      userId: int.candidateId,
      title: '📅 Interview Invitation Received',
      message: `${int.employerName} invited you for a ${int.interviewType} interview on ${int.date} at ${int.time}.`,
      type: 'interview',
      link: 'interviews',
    });

    notifySubscribers();
    return newInt;
  },

  updateInterviewStatus(intId: string, status: Interview['status']): void {
    const ints = this.getInterviews();
    const target = ints.find((i) => i.id === intId);
    if (target) {
      target.status = status;
      setStorage(KEYS.INTERVIEWS, ints);
      notifySubscribers();
    }
  },

  // Messages & Conversations
  getConversations(): Conversation[] {
    return getStorage<Conversation[]>(KEYS.CONVERSATIONS, INITIAL_CONVERSATIONS);
  },

  getMessages(): Message[] {
    return getStorage<Message[]>(KEYS.MESSAGES, INITIAL_MESSAGES);
  },

  getConversationMessages(conversationId: string): Message[] {
    const msgs = this.getMessages();
    return msgs.filter((m) => m.conversationId === conversationId);
  },

  sendMessage(
    sender: User,
    recipientId: string,
    text: string,
    conversationId: string = 'conv-1',
    attachments?: {
      attachedJobId?: string;
      attachedJobTitle?: string;
      attachedInterviewId?: string;
      attachedCourseId?: string;
      attachmentName?: string;
      attachmentType?: 'pdf' | 'doc' | 'image';
    }
  ): Message {
    const msgs = this.getMessages();
    const newMsg: Message = {
      id: `m-${Date.now()}`,
      conversationId,
      senderId: sender.id,
      senderName: sender.name,
      senderRole: sender.role,
      recipientId,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
      attachedJobId: attachments?.attachedJobId,
      attachedJobTitle: attachments?.attachedJobTitle,
      attachedInterviewId: attachments?.attachedInterviewId,
      attachedCourseId: attachments?.attachedCourseId,
      attachmentName: attachments?.attachmentName,
      attachmentType: attachments?.attachmentType,
    };
    msgs.push(newMsg);
    setStorage(KEYS.MESSAGES, msgs);

    // Update conversation last message
    const convs = this.getConversations();
    const targetConv = convs.find((c) => c.id === conversationId);
    if (targetConv) {
      targetConv.lastMessageText = text;
      targetConv.lastMessageTime = 'Just now';
      setStorage(KEYS.CONVERSATIONS, convs);
    }

    notifySubscribers();
    return newMsg;
  },

  markConversationRead(conversationId: string): void {
    const msgs = this.getMessages();
    msgs.forEach((m) => {
      if (m.conversationId === conversationId) {
        m.isRead = true;
      }
    });
    setStorage(KEYS.MESSAGES, msgs);

    const convs = this.getConversations();
    const targetConv = convs.find((c) => c.id === conversationId);
    if (targetConv) {
      targetConv.unreadCount = 0;
      setStorage(KEYS.CONVERSATIONS, convs);
    }

    notifySubscribers();
  },

  // Notifications
  getNotifications(): Notification[] {
    return getStorage<Notification[]>(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  },

  addNotification(notif: Omit<Notification, 'id' | 'timestamp' | 'isRead'>): Notification {
    const notifs = this.getNotifications();
    const newNotif: Notification = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      isRead: false,
      read: false,
    };
    notifs.unshift(newNotif);
    setStorage(KEYS.NOTIFICATIONS, notifs);
    notifySubscribers();
    return newNotif;
  },

  markNotificationsRead(): void {
    const notifs = this.getNotifications();
    notifs.forEach((n) => {
      n.isRead = true;
      n.read = true;
    });
    setStorage(KEYS.NOTIFICATIONS, notifs);
    notifySubscribers();
  },

  markNotificationRead(notificationId: string): void {
    const notifs = this.getNotifications();
    const notif = notifs.find((n) => n.id === notificationId);
    if (notif) {
      notif.isRead = true;
      notif.read = true;
      setStorage(KEYS.NOTIFICATIONS, notifs);
      notifySubscribers();
    }
  },

  // -------------------------------------------------------------
  // KARMETRA LEARNING & CERTIFICATION SYSTEM
  // -------------------------------------------------------------

  getCourses(): Course[] {
    return getStorage<Course[]>(KEYS.COURSES, INITIAL_COURSES);
  },

  getCourseById(courseId: string): Course | undefined {
    const courses = this.getCourses();
    return courses.find((c) => c.id === courseId || c.slug === courseId || c.karmetraCourseCode === courseId);
  },

  saveCourse(course: Course): void {
    const courses = this.getCourses();
    const idx = courses.findIndex((c) => c.id === course.id);
    if (idx >= 0) {
      courses[idx] = course;
    } else {
      courses.unshift(course);
    }
    setStorage(KEYS.COURSES, courses);
    notifySubscribers();
  },

  createCourse(courseData: Partial<Course>): Course {
    const courses = this.getCourses();
    const codeNum = 100 + courses.length + 1;
    const newCourse: Course = {
      id: `crs-${Date.now()}`,
      karmetraCourseCode: `KMT-CRS-${codeNum}`,
      title: courseData.title || 'Untitled Course',
      slug: (courseData.title || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      tagline: courseData.tagline || 'Essential practical course for career advancement',
      description: courseData.description || 'Comprehensive learning modules covering in-demand industry skills.',
      category: courseData.category || 'Career Skills',
      difficulty: courseData.difficulty || 'Beginner',
      durationHours: courseData.durationHours || 4.0,
      totalLessons: courseData.modules ? courseData.modules.reduce((acc, m) => acc + m.lessons.length, 0) : 4,
      instructorName: courseData.instructorName || 'Karmetra Academy Trainer',
      instructorTitle: courseData.instructorTitle || 'Lead Subject Specialist',
      instructorAvatar: courseData.instructorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      thumbnail: courseData.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
      featured: courseData.featured || false,
      status: courseData.status || 'Published',
      skillsEarned: courseData.skillsEarned || ['Professional Skill'],
      learningObjectives: courseData.learningObjectives || ['Understand core concepts and apply in daily workplace'],
      prerequisites: courseData.prerequisites || ['Basic comprehension and motivation to learn'],
      targetJobRoles: courseData.targetJobRoles || ['Operations Associate', 'Executive'],
      modules: courseData.modules || [],
      finalAssessment: courseData.finalAssessment || {
        id: `fa-${Date.now()}`,
        title: `${courseData.title || 'Course'} Final Assessment`,
        description: 'Score 70% or higher to earn your verified credential.',
        passingScorePercent: 70,
        questions: [],
      },
      certificateEnabled: true,
      certificateType: 'Karmetra Skill Certificate',
      passingScore: courseData.passingScore || 70,
      enrolledCount: 1,
      rating: 4.8,
      ratingCount: 12,
      updatedAt: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
    };
    courses.unshift(newCourse);
    setStorage(KEYS.COURSES, courses);
    this.logAdminAction('CREATE_COURSE', 'system', newCourse.id, newCourse.title, 'Created new training course');
    notifySubscribers();
    return newCourse;
  },

  updateCourse(courseId: string, updates: Partial<Course>): void {
    const courses = this.getCourses();
    const idx = courses.findIndex((c) => c.id === courseId);
    if (idx >= 0) {
      courses[idx] = {
        ...courses[idx],
        ...updates,
        updatedAt: new Date().toISOString().split('T')[0],
      };
      setStorage(KEYS.COURSES, courses);
      this.logAdminAction('UPDATE_COURSE', 'system', courseId, courses[idx].title, 'Updated course details');
      notifySubscribers();
    }
  },

  deleteCourse(courseId: string): void {
    const courses = this.getCourses().filter((c) => c.id !== courseId);
    setStorage(KEYS.COURSES, courses);
    this.logAdminAction('DELETE_COURSE', 'system', courseId, 'Course ID', 'Deleted course from database');
    notifySubscribers();
  },

  // Course Progress & Enrollment
  getAllCourseProgress(): CourseProgress[] {
    return getStorage<CourseProgress[]>(KEYS.COURSE_PROGRESS, INITIAL_COURSE_PROGRESS);
  },

  getUserCourseProgress(userId: string, courseId: string): CourseProgress | undefined {
    const all = this.getAllCourseProgress();
    return all.find((p) => (p.userId === userId || p.candidateId === userId) && p.courseId === courseId);
  },

  getAllUserProgress(userId: string): CourseProgress[] {
    const all = this.getAllCourseProgress();
    return all.filter((p) => p.userId === userId || p.candidateId === userId || p.userId === 'u-1');
  },

  enrollCourse(userId: string, courseId: string): CourseProgress {
    const all = this.getAllCourseProgress();
    const existing = all.find((p) => (p.userId === userId || p.candidateId === userId) && p.courseId === courseId);
    if (existing) return existing;

    const course = this.getCourseById(courseId);
    const firstLessonId = course?.modules?.[0]?.lessons?.[0]?.id;

    const newProgress: CourseProgress = {
      id: `prog-${Date.now()}`,
      userId,
      candidateId: userId,
      courseId,
      enrolledAt: new Date().toISOString().split('T')[0],
      completedLessons: [],
      lessonProgress: {},
      currentLessonId: firstLessonId,
      quizScores: {},
      overallProgressPercent: 0,
      isCompleted: false,
    };
    all.push(newProgress);
    setStorage(KEYS.COURSE_PROGRESS, all);

    if (course) {
      course.enrolledCount = (course.enrolledCount || 0) + 1;
      this.saveCourse(course);
    }

    this.addNotification({
      userId,
      title: `🎓 Enrolled in ${course?.title || 'Course'}`,
      message: 'You have started your training. Complete all lessons and quizzes to earn your verified credential.',
      category: 'learning',
      type: 'learning',
      link: 'learning',
      targetType: 'course',
      targetId: courseId,
    });

    notifySubscribers();
    return newProgress;
  },

  updateLessonProgress(
    userId: string,
    courseId: string,
    lessonId: string,
    watchedSeconds: number,
    durationSeconds: number
  ): void {
    const all = this.getAllCourseProgress();
    let prog = all.find((p) => (p.userId === userId || p.candidateId === userId) && p.courseId === courseId);
    if (!prog) {
      prog = this.enrollCourse(userId, courseId);
    }

    const currentLessonData = prog.lessonProgress[lessonId] || {
      watchedSeconds: 0,
      durationSeconds: durationSeconds || 600,
      completed: false,
      lastWatchedAt: new Date().toISOString(),
    };

    currentLessonData.watchedSeconds = Math.max(currentLessonData.watchedSeconds, watchedSeconds);
    currentLessonData.durationSeconds = durationSeconds || currentLessonData.durationSeconds;
    currentLessonData.lastWatchedAt = new Date().toISOString();

    // Auto mark completed if watched >= 80%
    if (currentLessonData.watchedSeconds >= currentLessonData.durationSeconds * 0.8) {
      currentLessonData.completed = true;
      if (!prog.completedLessons.includes(lessonId)) {
        prog.completedLessons.push(lessonId);
      }
    }

    prog.lessonProgress[lessonId] = currentLessonData;
    prog.currentLessonId = lessonId;

    // Calculate total course percentage
    const course = this.getCourseById(courseId);
    const totalLessons = course?.modules.reduce((acc, m) => acc + m.lessons.length, 0) || 1;
    prog.overallProgressPercent = Math.min(100, Math.round((prog.completedLessons.length / totalLessons) * 100));

    setStorage(KEYS.COURSE_PROGRESS, all);
    notifySubscribers();
  },

  completeLesson(userId: string, courseId: string, lessonId: string): void {
    const all = this.getAllCourseProgress();
    let prog = all.find((p) => (p.userId === userId || p.candidateId === userId) && p.courseId === courseId);
    if (!prog) {
      prog = this.enrollCourse(userId, courseId);
    }

    if (!prog.completedLessons.includes(lessonId)) {
      prog.completedLessons.push(lessonId);
    }

    prog.lessonProgress[lessonId] = {
      watchedSeconds: 1200,
      durationSeconds: 1200,
      completed: true,
      lastWatchedAt: new Date().toISOString(),
    };

    const course = this.getCourseById(courseId);
    const totalLessons = course?.modules.reduce((acc, m) => acc + m.lessons.length, 0) || 1;
    prog.overallProgressPercent = Math.min(100, Math.round((prog.completedLessons.length / totalLessons) * 100));

    setStorage(KEYS.COURSE_PROGRESS, all);
    notifySubscribers();
  },

  submitQuizAttempt(
    userId: string,
    courseId: string,
    quizId: string,
    scorePercent: number,
    passed: boolean
  ): void {
    const all = this.getAllCourseProgress();
    let prog = all.find((p) => (p.userId === userId || p.candidateId === userId) && p.courseId === courseId);
    if (!prog) {
      prog = this.enrollCourse(userId, courseId);
    }

    prog.quizScores[quizId] = {
      scorePercent,
      passed,
      completedAt: new Date().toISOString(),
    };

    setStorage(KEYS.COURSE_PROGRESS, all);
    notifySubscribers();
  },

  submitFinalAssessment(
    userId: string,
    courseId: string,
    scorePercent: number,
    passed: boolean,
    answers: Record<string, number>
  ): { passed: boolean; certificate?: KarmetraCertificate } {
    const all = this.getAllCourseProgress();
    let prog = all.find((p) => (p.userId === userId || p.candidateId === userId) && p.courseId === courseId);
    if (!prog) {
      prog = this.enrollCourse(userId, courseId);
    }

    const previousAttempts = prog.assessmentAttempt?.attemptCount || 0;
    prog.assessmentAttempt = {
      scorePercent,
      passed,
      answers,
      completedAt: new Date().toISOString(),
      attemptCount: previousAttempts + 1,
    };

    let generatedCert: KarmetraCertificate | undefined;

    if (passed) {
      prog.isCompleted = true;
      prog.overallProgressPercent = 100;
      prog.completedAt = new Date().toISOString().split('T')[0];

      // Auto generate Karmetra Certificate
      const course = this.getCourseById(courseId);
      const currentUser = this.getCurrentUser();
      const candProfile = this.getCandidateProfile(userId);

      if (course) {
        generatedCert = this.generateCertificate({
          userId: currentUser.id,
          candidateId: candProfile.id,
          candidateName: candProfile.name || currentUser.name,
          candidateKarmetraId: candProfile.id === 'cand-1' ? 'KM-CAN-88219' : `KM-CAN-${Math.floor(10000 + Math.random() * 90000)}`,
          courseId: course.id,
          courseName: course.title,
          courseCategory: course.category,
          certificateType: course.certificateType || 'Karmetra Skill Certificate',
          scorePercent,
          skillsCovered: course.skillsEarned,
          instructorName: course.instructorName,
          instructorTitle: course.instructorTitle,
        });

        prog.certificateId = generatedCert.id;

        // Auto append verified skills to candidate profile
        if (candProfile) {
          const currentSkills = candProfile.verifiedSkills || [];
          const newSkills = Array.from(new Set([...currentSkills, ...course.skillsEarned]));
          candProfile.verifiedSkills = newSkills;

          const certs = candProfile.certifications || [];
          if (!certs.some((c) => c.certificateId === generatedCert?.id)) {
            certs.push({
              certificateId: generatedCert.id,
              title: course.title,
              courseId: course.id,
              issueDate: generatedCert.issueDate,
              issuer: 'Karmetra Skill Academy',
              type: generatedCert.certificateType,
              score: scorePercent,
              skills: course.skillsEarned,
              status: 'Valid',
            });
          }
          candProfile.certifications = certs;
          this.saveCandidateProfile(candProfile);
        }
      }
    }

    setStorage(KEYS.COURSE_PROGRESS, all);
    notifySubscribers();
    return { passed, certificate: generatedCert };
  },

  // -------------------------------------------------------------
  // CERTIFICATE ISSUANCE & VERIFICATION
  // -------------------------------------------------------------

  getCertificates(): KarmetraCertificate[] {
    return getStorage<KarmetraCertificate[]>(KEYS.CERTIFICATES, INITIAL_CERTIFICATES);
  },

  getAllCertificates(): KarmetraCertificate[] {
    return this.getCertificates();
  },

  getUserCertificates(userId: string): KarmetraCertificate[] {
    const all = this.getCertificates();
    return all.filter((c) => c.userId === userId || c.candidateId === userId || c.userId === 'u-1');
  },

  getCertificateById(certificateId: string): KarmetraCertificate | undefined {
    const all = this.getCertificates();
    const cleanId = certificateId.trim().toUpperCase();
    return all.find((c) => c.id.toUpperCase() === cleanId);
  },

  verifyCertificate(certificateId: string): {
    certificate: KarmetraCertificate | null;
    isValid: boolean;
    message: string;
  } {
    const cert = this.getCertificateById(certificateId);
    if (!cert) {
      return {
        certificate: null,
        isValid: false,
        message: 'No official Karmetra certificate found matching this verification code.',
      };
    }
    if (cert.status === 'Revoked') {
      return {
        certificate: cert,
        isValid: false,
        message: `This certificate was revoked by Karmetra Administration. Reason: ${cert.revocationReason || 'Policy violation'}`,
      };
    }
    return {
      certificate: cert,
      isValid: true,
      message: 'Authentic Karmetra Verified Certificate.',
    };
  },

  generateCertificate(certData: Omit<KarmetraCertificate, 'id' | 'issueDate' | 'status' | 'verificationUrl'>): KarmetraCertificate {
    const all = this.getCertificates();
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const categoryCode = certData.courseCategory.substring(0, 3).toUpperCase();
    const certId = `KMT-2026-${categoryCode}${randomHex}`;

    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    const newCert: KarmetraCertificate = {
      ...certData,
      id: certId,
      issueDate: formattedDate,
      status: 'Valid',
      verificationUrl: `/certificate/verify/${certId}`,
    };

    all.unshift(newCert);
    setStorage(KEYS.CERTIFICATES, all);

    this.addNotification({
      userId: certData.userId,
      title: `🏆 Certificate Earned: ${certData.courseName}`,
      message: `Congratulations! Your verified certificate (${certId}) has been generated and added to your profile.`,
      category: 'learning',
      type: 'certificate',
      link: 'certificates',
      targetType: 'certificate',
      targetId: certId,
    });

    this.logAdminAction('ISSUE_CERTIFICATE', 'user', certData.userId, certData.candidateName, `Issued certificate ${certId} for ${certData.courseName}`);
    notifySubscribers();
    return newCert;
  },

  revokeCertificate(certificateId: string, reason: string): void {
    const all = this.getCertificates();
    const cert = all.find((c) => c.id === certificateId);
    if (cert) {
      cert.status = 'Revoked';
      cert.revocationReason = reason;
      setStorage(KEYS.CERTIFICATES, all);
      this.logAdminAction('REVOKE_CERTIFICATE', 'user', cert.userId, cert.candidateName, `Revoked ${cert.id}. Reason: ${reason}`);
      notifySubscribers();
    }
  },

  reinstateCertificate(certificateId: string): void {
    const all = this.getCertificates();
    const cert = all.find((c) => c.id === certificateId);
    if (cert) {
      cert.status = 'Valid';
      delete cert.revocationReason;
      setStorage(KEYS.CERTIFICATES, all);
      this.logAdminAction('REINSTATE_CERTIFICATE', 'user', cert.userId, cert.candidateName, `Reinstated ${cert.id}`);
      notifySubscribers();
    }
  },

  // Career Roadmaps
  getCareerRoadmaps(): CareerPathRoadmap[] {
    return getStorage<CareerPathRoadmap[]>(KEYS.CAREER_ROADMAPS, INITIAL_CAREER_ROADMAPS);
  },

  getCareerRoadmapById(id: string): CareerPathRoadmap | undefined {
    const all = this.getCareerRoadmaps();
    return all.find((r) => r.id === id || r.roleName.toLowerCase().includes(id.toLowerCase()));
  },

  // Anti-Fraud
  getFraudAlerts(): AntiFraudAlert[] {
    return getStorage<AntiFraudAlert[]>(KEYS.FRAUD_ALERTS, INITIAL_FRAUD_ALERTS);
  },

  reportJobFraud(
    jobId: string,
    jobTitle: string,
    companyName: string,
    reason: string,
    details: string
  ): AntiFraudAlert {
    const alerts = this.getFraudAlerts();
    const newAlert: AntiFraudAlert = {
      id: `fa-${Date.now()}`,
      jobId,
      jobTitle,
      companyName,
      reporterId: this.getCurrentUser().id,
      reason,
      details,
      status: 'Investigating',
      reportedAt: new Date().toISOString().split('T')[0],
      riskScore: 'High',
    };
    alerts.unshift(newAlert);
    setStorage(KEYS.FRAUD_ALERTS, alerts);

    // Update job flag
    const jobs = this.getJobs();
    const j = jobs.find((job) => job.id === jobId);
    if (j) {
      j.fraudAlertCount = (j.fraudAlertCount || 0) + 1;
      setStorage(KEYS.JOBS, jobs);
    }

    notifySubscribers();
    return newAlert;
  },

  // Resume Data
  getResumeData(): ResumeData {
    const cand = this.getCandidateProfile(this.getCurrentUser().id);
    const fallback: ResumeData = {
      fullName: cand.name,
      email: cand.email,
      phone: cand.phone,
      location: cand.location,
      summary: cand.summary,
      skills: cand.skills,
      experience: cand.workHistory,
      education: [
        {
          degree: cand.education,
          institution: 'Mumbai University',
          year: '2023',
        },
      ],
      languages: cand.languages,
    };
    return getStorage<ResumeData>(KEYS.RESUME_DATA, fallback);
  },

  saveResumeData(data: ResumeData): void {
    setStorage(KEYS.RESUME_DATA, data);
    notifySubscribers();
  },

  // Soft-Delete / Recycle Bin Management
  getDeletedJobs(): DeletedJob[] {
    return getStorage<DeletedJob[]>(KEYS.DELETED_JOBS, []);
  },

  deleteJob(jobId: string, reason: string = 'Deleted by user / admin'): boolean {
    const jobs = this.getJobs();
    const jobIndex = jobs.findIndex((j) => j.id === jobId);
    if (jobIndex === -1) return false;

    const [deletedJob] = jobs.splice(jobIndex, 1);
    setStorage(KEYS.JOBS, jobs);

    const currentUser = this.getCurrentUser();
    const deletedRecords = this.getDeletedJobs();
    const newRecord: DeletedJob = {
      id: `del-${Date.now()}`,
      job: { ...deletedJob, status: 'Closed', approvalStatus: 'Rejected' },
      deletedAt: new Date().toISOString(),
      deletedBy: currentUser.name,
      deletedByRole: currentUser.role,
      reason,
    };
    deletedRecords.unshift(newRecord);
    setStorage(KEYS.DELETED_JOBS, deletedRecords);

    // Log admin action if admin
    this.logAdminAction(
      'DELETE_JOB',
      'job',
      deletedJob.id,
      deletedJob.title,
      `Job moved to recycle bin. Reason: ${reason}`
    );

    notifySubscribers();
    return true;
  },

  restoreJob(deletedRecordId: string): boolean {
    const deletedRecords = this.getDeletedJobs();
    const recIndex = deletedRecords.findIndex((r) => r.id === deletedRecordId || r.job.id === deletedRecordId);
    if (recIndex === -1) return false;

    const [record] = deletedRecords.splice(recIndex, 1);
    setStorage(KEYS.DELETED_JOBS, deletedRecords);

    const restoredJob = {
      ...record.job,
      status: 'Active' as const,
      approvalStatus: 'Approved' as const,
      postedTime: 'Restored just now',
    };

    const jobs = this.getJobs();
    jobs.unshift(restoredJob);
    setStorage(KEYS.JOBS, jobs);

    this.logAdminAction(
      'RESTORE_JOB',
      'job',
      restoredJob.id,
      restoredJob.title,
      'Job restored back to active platform listings'
    );

    notifySubscribers();
    return true;
  },

  permanentDeleteJob(deletedRecordId: string): boolean {
    const deletedRecords = this.getDeletedJobs();
    const filtered = deletedRecords.filter((r) => r.id !== deletedRecordId && r.job.id !== deletedRecordId);
    setStorage(KEYS.DELETED_JOBS, filtered);

    this.logAdminAction(
      'PERMANENT_DELETE_JOB',
      'job',
      deletedRecordId,
      'Deleted Job Record',
      'Permanently purged from database'
    );

    notifySubscribers();
    return true;
  },

  // Admin Activity Logging
  getAdminLogs(): AdminActivityLog[] {
    const fallback: AdminActivityLog[] = [
      {
        id: 'log-1',
        adminId: 'u-4',
        adminName: 'KarMetra Admin',
        action: 'APPROVE_EMPLOYER',
        targetType: 'company',
        targetId: 'comp-1',
        targetName: 'Apex Logistics India',
        timestamp: new Date(Date.now() - 3600000 * 2).toLocaleString('en-IN'),
        details: 'Verified GSTIN 27AAAAA0000A1Z5 and approved verified employer badge.',
      },
      {
        id: 'log-2',
        adminId: 'u-4',
        adminName: 'KarMetra Admin',
        action: 'APPROVE_JOB',
        targetType: 'job',
        targetId: 'job-1',
        targetName: 'Delivery Fleet Executive',
        timestamp: new Date(Date.now() - 3600000 * 5).toLocaleString('en-IN'),
        details: 'Passed automated anti-fraud check and approved for public search.',
      },
    ];
    return getStorage<AdminActivityLog[]>(KEYS.ADMIN_LOGS, fallback);
  },

  logAdminAction(
    action: string,
    targetType: AdminActivityLog['targetType'],
    targetId: string,
    targetName: string,
    details?: string
  ): void {
    const logs = this.getAdminLogs();
    const currentUser = this.getCurrentUser();
    const newLog: AdminActivityLog = {
      id: `log-${Date.now()}`,
      adminId: currentUser.id || 'u-4',
      adminName: currentUser.name || 'KarMetra Admin',
      action,
      targetType,
      targetId,
      targetName,
      timestamp: new Date().toLocaleString('en-IN'),
      details,
    };
    logs.unshift(newLog);
    setStorage(KEYS.ADMIN_LOGS, logs.slice(0, 100)); // Keep last 100 logs
  },

  // User Moderation
  suspendUser(userId: string, reason?: string): void {
    const users = this.getUsers();
    const user = users.find((u) => u.id === userId);
    if (user) {
      user.isVerified = false;
      setStorage(KEYS.USERS, users);
      this.logAdminAction('SUSPEND_USER', 'user', user.id, user.name, reason || 'Account suspended for policy violation');
      notifySubscribers();
    }
  },

  activateUser(userId: string): void {
    const users = this.getUsers();
    const user = users.find((u) => u.id === userId);
    if (user) {
      user.isVerified = true;
      setStorage(KEYS.USERS, users);
      this.logAdminAction('ACTIVATE_USER', 'user', user.id, user.name, 'Account status set to active');
      notifySubscribers();
    }
  },

  deleteUser(userId: string): void {
    const users = this.getUsers().filter((u) => u.id !== userId);
    setStorage(KEYS.USERS, users);
    this.logAdminAction('DELETE_USER', 'user', userId, 'Deleted Account', 'User profile deleted');
    notifySubscribers();
  },

  // User Reports Moderation
  getReports(): UserReport[] {
    const fallback: UserReport[] = [
      {
        id: 'rep-1',
        reportedBy: 'u-1',
        targetType: 'job',
        targetId: 'job-1',
        targetTitle: 'Suspicious Security Supervisor Fee',
        category: 'charging_money',
        description: 'Recruiter asked for uniform deposit fee of ₹500 before interview.',
        status: 'Under Review',
        createdAt: '2026-02-12',
      },
    ];
    return getStorage<UserReport[]>(KEYS.USER_REPORTS, fallback);
  },

  addReport(reportData: Omit<UserReport, 'id' | 'createdAt' | 'status'>): UserReport {
    const reports = this.getReports();
    const newRep: UserReport = {
      id: `rep-${Date.now()}`,
      ...reportData,
      status: 'Pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
    reports.unshift(newRep);
    setStorage(KEYS.USER_REPORTS, reports);
    notifySubscribers();
    return newRep;
  },

  updateReportStatus(reportId: string, status: UserReport['status']): void {
    const reports = this.getReports();
    const rep = reports.find((r) => r.id === reportId);
    if (rep) {
      rep.status = status;
      setStorage(KEYS.USER_REPORTS, reports);
      this.logAdminAction('RESOLVE_REPORT', 'fraud_alert', rep.id, rep.targetTitle, `Report marked as ${status}`);
      notifySubscribers();
    }
  },

  // Logout - clean reset of active user state
  logout(): void {
    try {
      localStorage.removeItem(KEYS.CURRENT_USER);
    } catch (e) {}
    notifySubscribers();
  },
};
