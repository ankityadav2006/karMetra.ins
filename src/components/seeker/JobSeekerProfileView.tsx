import React, { useState, useMemo } from 'react';
import { CandidateProfile, EducationRecord, ExperienceRecord, Job } from '../../types';
import { storageService } from '../../services/storage';
import { useI18n } from '../../utils/i18n';
import { validationRules } from '../../utils/validation';
import { FieldError } from '../common/FieldError';
import {
  User,
  ShieldCheck,
  Building,
  Briefcase,
  GraduationCap,
  Award,
  FileText,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  Circle,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Download,
  Upload,
  Globe,
  DollarSign,
  Clock,
  Sparkles,
  Lock,
  ChevronRight,
  X,
  Check,
} from 'lucide-react';
import { JobCard } from '../common/JobCard';

interface JobSeekerProfileViewProps {
  profile: CandidateProfile;
  jobs: Job[];
  onOpenResumeBuilder?: () => void;
  onSelectJob?: (job: Job) => void;
}

export const JobSeekerProfileView: React.FC<JobSeekerProfileViewProps> = ({
  profile,
  jobs = [],
  onOpenResumeBuilder,
  onSelectJob,
}) => {
  const { t } = useI18n();
  const [currentProfile, setCurrentProfile] = useState<CandidateProfile>(profile);
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);

  // Modal states for adding Education & Experience
  const [showEduModal, setShowEduModal] = useState(false);
  const [eduForm, setEduForm] = useState<Partial<EducationRecord>>({
    highestEducation: 'Graduate (B.Com)',
    courseDegree: 'Bachelor of Commerce',
    specialization: 'Accounting',
    collegeInstitute: 'Mumbai University College',
    passingYear: '2023',
  });

  const [showExpModal, setShowExpModal] = useState(false);
  const [expForm, setExpForm] = useState<Partial<ExperienceRecord>>({
    title: 'Sales Executive',
    company: 'ABC Retail Pvt Ltd',
    employmentType: 'Full-Time',
    location: 'Mumbai',
    joiningDate: 'Jan 2023',
    leavingDate: 'Present',
    responsibilities: 'Customer handling, sales desk management, and daily cash reconciliation.',
    skillsUsed: ['Customer Service', 'Sales', 'Excel'],
  });

  // Skills input state
  const [newSkill, setNewSkill] = useState('');
  const [skillError, setSkillError] = useState<string | null>(null);

  // Personal info edit state & validation
  const [personalForm, setPersonalForm] = useState({
    name: currentProfile.name,
    age: currentProfile.age || 24,
    dob: currentProfile.dob || '2001-08-15',
    gender: currentProfile.gender || 'Male',
    phone: currentProfile.phone,
    email: currentProfile.email,
    city: currentProfile.city || 'Mumbai',
    locality: currentProfile.locality || 'Andheri East',
    languages: (currentProfile.languages || []).join(', '),
  });
  const [personalTouched, setPersonalTouched] = useState<Record<string, boolean>>({});

  const personalErrors = useMemo(() => {
    const errs: Record<string, string | null> = {};
    errs.name = validationRules.name(personalForm.name, 'Full name', 2);
    if (!personalForm.age || personalForm.age < 18 || personalForm.age > 75) {
      errs.age = 'Age must be between 18 and 75 years';
    } else {
      errs.age = null;
    }
    errs.city = validationRules.required(personalForm.city, 'City', 2);
    errs.locality = validationRules.required(personalForm.locality, 'Locality', 2);
    if (!personalForm.languages.trim()) {
      errs.languages = 'Please enter at least 1 spoken language';
    } else {
      errs.languages = null;
    }
    return errs;
  }, [personalForm]);

  // Job Preferences edit state & validation
  const [prefForm, setPrefForm] = useState({
    preferredRole: currentProfile.preferredRole || 'Sales Executive',
    preferredCategory: currentProfile.preferredCategory || 'Retail & Sales',
    preferredLocations: (currentProfile.preferredLocations || []).join(', '),
    expectedSalary: currentProfile.expectedSalary || 25000,
    noticePeriod: currentProfile.noticePeriod || 'Immediate',
    availability: currentProfile.availability || 'Immediate',
    immediateJoining: currentProfile.immediateJoining !== false,
    profileVisibility: currentProfile.profileVisibility || 'Public to verified employers',
  });
  const [prefTouched, setPrefTouched] = useState<Record<string, boolean>>({});

  const prefErrors = useMemo(() => {
    const errs: Record<string, string | null> = {};
    errs.preferredRole = validationRules.required(prefForm.preferredRole, 'Preferred role', 2);
    if (!prefForm.preferredLocations.trim()) {
      errs.preferredLocations = 'Please enter at least 1 preferred city/area';
    } else {
      errs.preferredLocations = null;
    }
    if (!prefForm.expectedSalary || prefForm.expectedSalary < 5000) {
      errs.expectedSalary = 'Expected salary must be at least ₹5,000 / month';
    } else {
      errs.expectedSalary = null;
    }
    return errs;
  }, [prefForm]);

  // Education validation
  const [eduTouched, setEduTouched] = useState<Record<string, boolean>>({});
  const eduErrors = useMemo(() => {
    const errs: Record<string, string | null> = {};
    errs.courseDegree = validationRules.required(eduForm.courseDegree, 'Course / Degree', 2);
    errs.collegeInstitute = validationRules.required(eduForm.collegeInstitute, 'College / School / Institute', 2);
    if (!eduForm.passingYear || !/^\d{4}$/.test(eduForm.passingYear)) {
      errs.passingYear = 'Enter a valid 4-digit passing year (e.g. 2023)';
    } else {
      errs.passingYear = null;
    }
    return errs;
  }, [eduForm]);

  // Experience validation
  const [expTouched, setExpTouched] = useState<Record<string, boolean>>({});
  const expErrors = useMemo(() => {
    const errs: Record<string, string | null> = {};
    errs.title = validationRules.required(expForm.title, 'Job title / Designation', 2);
    errs.company = validationRules.required(expForm.company, 'Company / Organization name', 2);
    errs.joiningDate = validationRules.required(expForm.joiningDate, 'Joining date', 2);
    return errs;
  }, [expForm]);

  const handleSavePersonal = (e: React.FormEvent) => {
    e.preventDefault();
    setPersonalTouched({ name: true, age: true, city: true, locality: true, languages: true });
    if (Object.values(personalErrors).some((err) => err !== null)) return;

    const langArray = personalForm.languages.split(',').map((s) => s.trim()).filter(Boolean);
    const updated: CandidateProfile = {
      ...currentProfile,
      name: personalForm.name,
      age: Number(personalForm.age),
      dob: personalForm.dob,
      gender: personalForm.gender,
      phone: personalForm.phone,
      email: personalForm.email,
      city: personalForm.city,
      locality: personalForm.locality,
      location: `${personalForm.locality}, ${personalForm.city}`,
      languages: langArray.length > 0 ? langArray : currentProfile.languages,
    };
    setCurrentProfile(updated);
    storageService.updateCandidateProfile(updated);
    setIsEditingPersonal(false);
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setPrefTouched({ preferredRole: true, preferredLocations: true, expectedSalary: true });
    if (Object.values(prefErrors).some((err) => err !== null)) return;

    const locArray = prefForm.preferredLocations.split(',').map((s) => s.trim()).filter(Boolean);
    const updated: CandidateProfile = {
      ...currentProfile,
      preferredRole: prefForm.preferredRole,
      preferredCategory: prefForm.preferredCategory,
      preferredLocations: locArray.length > 0 ? locArray : currentProfile.preferredLocations,
      expectedSalary: Number(prefForm.expectedSalary),
      noticePeriod: prefForm.noticePeriod,
      availability: prefForm.availability as any,
      immediateJoining: prefForm.immediateJoining,
      profileVisibility: prefForm.profileVisibility as any,
    };
    setCurrentProfile(updated);
    storageService.updateCandidateProfile(updated);
    setIsEditingPreferences(false);
  };

  const handleAddEducation = (e: React.FormEvent) => {
    e.preventDefault();
    setEduTouched({ courseDegree: true, collegeInstitute: true, passingYear: true });
    if (Object.values(eduErrors).some((err) => err !== null)) return;

    const newEdu: EducationRecord = {
      id: `edu-${Date.now()}`,
      highestEducation: eduForm.highestEducation || 'Graduate',
      courseDegree: eduForm.courseDegree || 'Degree',
      specialization: eduForm.specialization || '',
      collegeInstitute: eduForm.collegeInstitute || 'Institute',
      university: eduForm.university || '',
      passingYear: eduForm.passingYear || '2023',
    };
    const updatedList = [...(currentProfile.educationList || []), newEdu];
    const updated = { ...currentProfile, educationList: updatedList };
    setCurrentProfile(updated);
    storageService.updateCandidateProfile(updated);
    setShowEduModal(false);
  };

  const handleDeleteEducation = (id: string) => {
    const updatedList = (currentProfile.educationList || []).filter((e) => e.id !== id);
    const updated = { ...currentProfile, educationList: updatedList };
    setCurrentProfile(updated);
    storageService.updateCandidateProfile(updated);
  };

  const handleAddExperience = (e: React.FormEvent) => {
    e.preventDefault();
    setExpTouched({ title: true, company: true, joiningDate: true });
    if (Object.values(expErrors).some((err) => err !== null)) return;

    const newExp: ExperienceRecord = {
      id: `exp-${Date.now()}`,
      title: expForm.title || 'Executive',
      company: expForm.company || 'Company',
      employmentType: expForm.employmentType || 'Full-Time',
      location: expForm.location || 'Mumbai',
      joiningDate: expForm.joiningDate || 'Jan 2023',
      leavingDate: expForm.leavingDate || 'Present',
      responsibilities: expForm.responsibilities || '',
      skillsUsed: typeof expForm.skillsUsed === 'string' ? (expForm.skillsUsed as string).split(',') : (expForm.skillsUsed || []),
    };
    const updatedList = [...(currentProfile.workExperienceList || []), newExp];
    const updated = { ...currentProfile, workExperienceList: updatedList };
    setCurrentProfile(updated);
    storageService.updateCandidateProfile(updated);
    setShowExpModal(false);
  };

  const handleDeleteExperience = (id: string) => {
    const updatedList = (currentProfile.workExperienceList || []).filter((e) => e.id !== id);
    const updated = { ...currentProfile, workExperienceList: updatedList };
    setCurrentProfile(updated);
    storageService.updateCandidateProfile(updated);
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) {
      setSkillError('Please type a skill name');
      return;
    }
    const skillName = newSkill.trim();
    if (currentProfile.skills.includes(skillName)) {
      setSkillError('Skill is already added to profile');
      return;
    }
    setSkillError(null);
    const updatedSkills = [...currentProfile.skills, skillName];
    const updated = { ...currentProfile, skills: updatedSkills };
    setCurrentProfile(updated);
    storageService.updateCandidateProfile(updated);
    setNewSkill('');
  };

  const handleRemoveSkill = (skillName: string) => {
    const updatedSkills = currentProfile.skills.filter((s) => s !== skillName);
    const updated = { ...currentProfile, skills: updatedSkills };
    setCurrentProfile(updated);
    storageService.updateCandidateProfile(updated);
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const updated = {
        ...currentProfile,
        resumeName: file.name,
        resumeUpdatedAt: new Date().toISOString().split('T')[0],
      };
      setCurrentProfile(updated);
      storageService.updateCandidateProfile(updated);
    }
  };

  // Checklist for profile strength
  const hasPersonal = !!(currentProfile.name && currentProfile.phone && currentProfile.email);
  const hasEducation = (currentProfile.educationList || []).length > 0;
  const hasExperience = (currentProfile.workExperienceList || []).length > 0;
  const hasSkills = (currentProfile.skills || []).length >= 3;
  const hasPreferences = !!(currentProfile.expectedSalary > 0 && currentProfile.preferredLocations?.length > 0);
  const hasResume = !!(currentProfile.resumeName || currentProfile.resumeUrl);
  const hasLanguages = (currentProfile.languages || []).length > 0;

  // Profile-based job recommendations
  const recommendedJobs = (jobs || []).filter((j) => {
    const titleMatch = currentProfile.preferredRole
      ? j.title.toLowerCase().includes(currentProfile.preferredRole.toLowerCase())
      : true;
    const cityMatch = currentProfile.city ? j.location.toLowerCase().includes(currentProfile.city.toLowerCase()) : true;
    const skillMatch = (currentProfile.skills || []).some((s) => (j.skillsRequired || []).includes(s) || j.title.toLowerCase().includes(s.toLowerCase()));
    return titleMatch || cityMatch || skillMatch;
  });

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* TOP HEADER & PROFILE STRENGTH CARD */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative group">
              <img
                src={currentProfile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={currentProfile.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-teal-400 shadow-md"
              />
              <label className="absolute -bottom-1 -right-1 bg-teal-600 hover:bg-teal-700 text-white p-1.5 rounded-lg cursor-pointer shadow-sm">
                <Upload className="w-3.5 h-3.5" />
                <input type="file" accept="image/*" className="hidden" onChange={handleResumeUpload} />
              </label>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-white">{currentProfile.name}</h1>
                <span className="bg-teal-500/20 text-teal-300 font-extrabold px-2.5 py-0.5 rounded-full text-xs border border-teal-400/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                  {currentProfile.karmetraId}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-teal-200/90 font-medium">{currentProfile.title}</p>
              <div className="flex items-center gap-3 text-xs text-slate-300 pt-1 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-teal-400" />
                  {currentProfile.locality}, {currentProfile.city}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-teal-400" />
                  {currentProfile.experienceYears} Years Exp
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  ₹{currentProfile.expectedSalary.toLocaleString('en-IN')}/mo Expected
                </span>
              </div>
            </div>
          </div>

          {/* Dynamic Strength Meter */}
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 min-w-[240px] space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-extrabold text-teal-300">{t('profile.profileStrength')}</span>
              <span className="font-black text-lg text-white">{currentProfile.profileStrength}%</span>
            </div>
            <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-teal-400 to-emerald-400 h-full transition-all duration-500 rounded-full"
                style={{ width: `${currentProfile.profileStrength}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              {currentProfile.profileStrength >= 80
                ? '🌟 Outstanding profile strength! Priority candidate visibility active.'
                : 'Complete incomplete sections to get 3x higher recruiter responses.'}
            </p>
          </div>
        </div>
      </div>

      {/* INCOMPLETE PROFILE CHECKLIST PROMPT */}
      {currentProfile.profileStrength < 100 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <p className="font-extrabold text-xs text-amber-900">{t('profile.completeProfilePrompt')}</p>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-amber-800 flex-wrap">
                <span className={hasPersonal ? 'text-emerald-700 font-bold flex items-center gap-0.5' : 'text-slate-500 flex items-center gap-0.5'}>
                  {hasPersonal ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Circle className="w-3 h-3" />} Personal
                </span>
                <span className={hasEducation ? 'text-emerald-700 font-bold flex items-center gap-0.5' : 'text-slate-500 flex items-center gap-0.5'}>
                  {hasEducation ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Circle className="w-3 h-3" />} Education
                </span>
                <span className={hasExperience ? 'text-emerald-700 font-bold flex items-center gap-0.5' : 'text-slate-500 flex items-center gap-0.5'}>
                  {hasExperience ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Circle className="w-3 h-3" />} Experience
                </span>
                <span className={hasSkills ? 'text-emerald-700 font-bold flex items-center gap-0.5' : 'text-slate-500 flex items-center gap-0.5'}>
                  {hasSkills ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Circle className="w-3 h-3" />} Skills
                </span>
                <span className={hasPreferences ? 'text-emerald-700 font-bold flex items-center gap-0.5' : 'text-slate-500 flex items-center gap-0.5'}>
                  {hasPreferences ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Circle className="w-3 h-3" />} Preferences
                </span>
                <span className={hasResume ? 'text-emerald-700 font-bold flex items-center gap-0.5' : 'text-slate-500 flex items-center gap-0.5'}>
                  {hasResume ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Circle className="w-3 h-3" />} Resume
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN TWO COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: PERSONAL, CONTACT, PREFERENCES & VISIBILITY */}
        <div className="space-y-6 lg:col-span-1">
          {/* PERSONAL INFORMATION CARD */}
          <div className="bg-white rounded-2xl border border-teal-200 p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-teal-100 pb-3">
              <h3 className="font-extrabold text-sm text-teal-900 flex items-center gap-2">
                <User className="w-4 h-4 text-teal-700" />
                {t('profile.personalInformation')}
              </h3>
              <button
                onClick={() => setIsEditingPersonal(!isEditingPersonal)}
                className="text-xs text-teal-700 hover:text-teal-900 font-bold flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" />
                {isEditingPersonal ? t('buttons.cancel') : t('buttons.edit')}
              </button>
            </div>

            {!isEditingPersonal ? (
              <div className="space-y-3 text-xs">
                <div>
                  <p className="text-slate-500 text-[10px] uppercase font-bold">{t('profile.fullName')}</p>
                  <p className="font-bold text-slate-800">{currentProfile.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-slate-500 text-[10px] uppercase font-bold">{t('profile.age')} / DOB</p>
                    <p className="font-bold text-slate-800">{currentProfile.age} yrs ({currentProfile.dob})</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-[10px] uppercase font-bold">{t('profile.gender')}</p>
                    <p className="font-bold text-slate-800">{currentProfile.gender}</p>
                  </div>
                </div>
                <div>
                  <p className="text-slate-500 text-[10px] uppercase font-bold">{t('profile.currentCity')} & Locality</p>
                  <p className="font-bold text-slate-800">{currentProfile.locality}, {currentProfile.city}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-[10px] uppercase font-bold">{t('profile.languages')}</p>
                  <p className="font-bold text-slate-800">{currentProfile.languages.join(', ')}</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSavePersonal} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t('profile.fullName')} *</label>
                  <input
                    type="text"
                    value={personalForm.name}
                    onChange={(e) => {
                      setPersonalForm({ ...personalForm, name: e.target.value });
                      setPersonalTouched((prev) => ({ ...prev, name: true }));
                    }}
                    onBlur={() => setPersonalTouched((prev) => ({ ...prev, name: true }))}
                    className={`w-full p-2 border rounded-lg text-xs outline-hidden ${
                      personalTouched.name && personalErrors.name ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                    }`}
                  />
                  <FieldError error={personalErrors.name} touched={personalTouched.name} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{t('profile.age')} *</label>
                    <input
                      type="number"
                      value={personalForm.age}
                      onChange={(e) => {
                        setPersonalForm({ ...personalForm, age: Number(e.target.value) });
                        setPersonalTouched((prev) => ({ ...prev, age: true }));
                      }}
                      onBlur={() => setPersonalTouched((prev) => ({ ...prev, age: true }))}
                      className={`w-full p-2 border rounded-lg text-xs outline-hidden ${
                        personalTouched.age && personalErrors.age ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                      }`}
                    />
                    <FieldError error={personalErrors.age} touched={personalTouched.age} />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{t('profile.gender')}</label>
                    <select
                      value={personalForm.gender}
                      onChange={(e) => setPersonalForm({ ...personalForm, gender: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs outline-hidden"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{t('profile.currentCity')} *</label>
                    <input
                      type="text"
                      value={personalForm.city}
                      onChange={(e) => {
                        setPersonalForm({ ...personalForm, city: e.target.value });
                        setPersonalTouched((prev) => ({ ...prev, city: true }));
                      }}
                      onBlur={() => setPersonalTouched((prev) => ({ ...prev, city: true }))}
                      className={`w-full p-2 border rounded-lg text-xs outline-hidden ${
                        personalTouched.city && personalErrors.city ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                      }`}
                    />
                    <FieldError error={personalErrors.city} touched={personalTouched.city} />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{t('profile.currentLocality')} *</label>
                    <input
                      type="text"
                      value={personalForm.locality}
                      onChange={(e) => {
                        setPersonalForm({ ...personalForm, locality: e.target.value });
                        setPersonalTouched((prev) => ({ ...prev, locality: true }));
                      }}
                      onBlur={() => setPersonalTouched((prev) => ({ ...prev, locality: true }))}
                      className={`w-full p-2 border rounded-lg text-xs outline-hidden ${
                        personalTouched.locality && personalErrors.locality ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                      }`}
                    />
                    <FieldError error={personalErrors.locality} touched={personalTouched.locality} />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t('profile.languages')} (comma separated) *</label>
                  <input
                    type="text"
                    value={personalForm.languages}
                    onChange={(e) => {
                      setPersonalForm({ ...personalForm, languages: e.target.value });
                      setPersonalTouched((prev) => ({ ...prev, languages: true }));
                    }}
                    onBlur={() => setPersonalTouched((prev) => ({ ...prev, languages: true }))}
                    className={`w-full p-2 border rounded-lg text-xs outline-hidden ${
                      personalTouched.languages && personalErrors.languages ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                    }`}
                  />
                  <FieldError error={personalErrors.languages} touched={personalTouched.languages} />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg text-xs shadow-xs"
                >
                  {t('buttons.saveChanges')}
                </button>
              </form>
            )}
          </div>

          {/* CONTACT INFORMATION & PRIVACY CARD */}
          <div className="bg-white rounded-2xl border border-teal-200 p-5 shadow-xs space-y-3 text-xs">
            <h3 className="font-extrabold text-sm text-teal-900 border-b border-teal-100 pb-2 flex items-center gap-2">
              <Phone className="w-4 h-4 text-teal-700" />
              {t('profile.contactInformation')}
            </h3>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-bold text-slate-800">{currentProfile.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-bold text-slate-800">{currentProfile.email}</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-start gap-2 text-[11px] text-slate-600">
              <Lock className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
              <p>{t('profile.contactPrivacyNotice')}</p>
            </div>
          </div>

          {/* JOB PREFERENCES & VISIBILITY CARD */}
          <div className="bg-white rounded-2xl border border-teal-200 p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-teal-100 pb-3">
              <h3 className="font-extrabold text-sm text-teal-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-teal-700" />
                {t('profile.jobPreferences')}
              </h3>
              <button
                onClick={() => setIsEditingPreferences(!isEditingPreferences)}
                className="text-xs text-teal-700 hover:text-teal-900 font-bold flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" />
                {isEditingPreferences ? t('buttons.cancel') : t('buttons.edit')}
              </button>
            </div>

            {!isEditingPreferences ? (
              <div className="space-y-3 text-xs">
                <div>
                  <p className="text-slate-500 text-[10px] uppercase font-bold">{t('profile.preferredRole')}</p>
                  <p className="font-bold text-slate-800">{currentProfile.preferredRole}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-[10px] uppercase font-bold">{t('profile.preferredLocations')}</p>
                  <p className="font-bold text-slate-800">{currentProfile.preferredLocations.join(', ')}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-slate-500 text-[10px] uppercase font-bold">{t('job.expectedSalary')}</p>
                    <p className="font-bold text-emerald-700">₹{currentProfile.expectedSalary.toLocaleString('en-IN')}/mo</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-[10px] uppercase font-bold">{t('profile.noticePeriod')}</p>
                    <p className="font-bold text-slate-800">{currentProfile.noticePeriod}</p>
                  </div>
                </div>
                <div>
                  <p className="text-slate-500 text-[10px] uppercase font-bold">{t('profile.profileVisibility')}</p>
                  <span className="inline-block mt-0.5 bg-teal-50 text-teal-800 font-bold px-2 py-0.5 rounded border border-teal-200 text-[11px]">
                    {currentProfile.profileVisibility}
                  </span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSavePreferences} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t('profile.preferredRole')} *</label>
                  <input
                    type="text"
                    value={prefForm.preferredRole}
                    onChange={(e) => {
                      setPrefForm({ ...prefForm, preferredRole: e.target.value });
                      setPrefTouched((prev) => ({ ...prev, preferredRole: true }));
                    }}
                    onBlur={() => setPrefTouched((prev) => ({ ...prev, preferredRole: true }))}
                    className={`w-full p-2 border rounded-lg text-xs outline-hidden ${
                      prefTouched.preferredRole && prefErrors.preferredRole ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                    }`}
                  />
                  <FieldError error={prefErrors.preferredRole} touched={prefTouched.preferredRole} />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t('profile.preferredLocations')} (comma separated) *</label>
                  <input
                    type="text"
                    value={prefForm.preferredLocations}
                    onChange={(e) => {
                      setPrefForm({ ...prefForm, preferredLocations: e.target.value });
                      setPrefTouched((prev) => ({ ...prev, preferredLocations: true }));
                    }}
                    onBlur={() => setPrefTouched((prev) => ({ ...prev, preferredLocations: true }))}
                    className={`w-full p-2 border rounded-lg text-xs outline-hidden ${
                      prefTouched.preferredLocations && prefErrors.preferredLocations ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                    }`}
                  />
                  <FieldError error={prefErrors.preferredLocations} touched={prefTouched.preferredLocations} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{t('job.expectedSalary')} (INR/mo) *</label>
                    <input
                      type="number"
                      value={prefForm.expectedSalary}
                      onChange={(e) => {
                        setPrefForm({ ...prefForm, expectedSalary: Number(e.target.value) });
                        setPrefTouched((prev) => ({ ...prev, expectedSalary: true }));
                      }}
                      onBlur={() => setPrefTouched((prev) => ({ ...prev, expectedSalary: true }))}
                      className={`w-full p-2 border rounded-lg text-xs outline-hidden ${
                        prefTouched.expectedSalary && prefErrors.expectedSalary ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                      }`}
                    />
                    <FieldError error={prefErrors.expectedSalary} touched={prefTouched.expectedSalary} />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{t('profile.noticePeriod')}</label>
                    <select
                      value={prefForm.noticePeriod}
                      onChange={(e) => setPrefForm({ ...prefForm, noticePeriod: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs outline-hidden"
                    >
                      <option value="Immediate">Immediate</option>
                      <option value="15 Days">15 Days</option>
                      <option value="1 Month">1 Month</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t('profile.profileVisibility')}</label>
                  <select
                    value={prefForm.profileVisibility}
                    onChange={(e) => setPrefForm({ ...prefForm, profileVisibility: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs outline-hidden"
                  >
                    <option value="Public to verified employers">{t('profile.visibilityPublic')}</option>
                    <option value="Visible only when applying">{t('profile.visibilityApplyingOnly')}</option>
                    <option value="Private">{t('profile.visibilityPrivate')}</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg text-xs shadow-xs"
                >
                  {t('buttons.saveChanges')}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: EDUCATION, EXPERIENCE, SKILLS, RESUME & RECOMMENDED JOBS */}
        <div className="space-y-6 lg:col-span-2">
          {/* EDUCATION SECTION CARD */}
          <div className="bg-white rounded-2xl border border-teal-200 p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-teal-100 pb-3">
              <h3 className="font-extrabold text-sm text-teal-900 flex items-center gap-2">
                <GraduationCap className="w-4.5 h-4.5 text-teal-700" />
                {t('profile.education')}
              </h3>
              <button
                onClick={() => setShowEduModal(true)}
                className="px-3 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-bold text-xs rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                {t('profile.addEducation')}
              </button>
            </div>

            <div className="space-y-3">
              {(currentProfile.educationList || []).map((edu) => (
                <div key={edu.id} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 flex items-start justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <p className="font-extrabold text-slate-900 text-sm">{edu.courseDegree}</p>
                    <p className="text-teal-800 font-semibold">{edu.collegeInstitute} {edu.university ? `• ${edu.university}` : ''}</p>
                    <p className="text-slate-500 text-[11px]">Specialization: {edu.specialization || 'General'} | Passing Year: <strong>{edu.passingYear}</strong></p>
                  </div>
                  <button
                    onClick={() => handleDeleteEducation(edu.id)}
                    className="text-slate-400 hover:text-red-600 p-1 rounded-md"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* WORK EXPERIENCE SECTION CARD */}
          <div className="bg-white rounded-2xl border border-teal-200 p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-teal-100 pb-3">
              <h3 className="font-extrabold text-sm text-teal-900 flex items-center gap-2">
                <Briefcase className="w-4.5 h-4.5 text-teal-700" />
                {t('profile.workExperience')} ({currentProfile.experienceYears} Years Total)
              </h3>
              <button
                onClick={() => setShowExpModal(true)}
                className="px-3 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-bold text-xs rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                {t('profile.addExperience')}
              </button>
            </div>

            <div className="space-y-3">
              {(currentProfile.workExperienceList || []).map((exp) => (
                <div key={exp.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex items-start justify-between gap-3 text-xs">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-slate-900 text-sm">{exp.title}</span>
                      <span className="bg-teal-100 text-teal-800 font-bold text-[10px] px-2 py-0.5 rounded">{exp.company}</span>
                    </div>
                    <p className="text-slate-500 text-[11px] font-medium">
                      {exp.location} • {exp.joiningDate} - {exp.leavingDate} ({exp.employmentType || 'Full-Time'})
                    </p>
                    {exp.responsibilities && (
                      <p className="text-slate-700 leading-relaxed text-[11px] pt-1">
                        <strong>Responsibilities:</strong> {exp.responsibilities}
                      </p>
                    )}
                    {exp.skillsUsed && exp.skillsUsed.length > 0 && (
                      <div className="flex gap-1.5 flex-wrap pt-1">
                        {exp.skillsUsed.map((s, i) => (
                          <span key={i} className="bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded text-[10px]">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteExperience(exp.id)}
                    className="text-slate-400 hover:text-red-600 p-1 rounded-md"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SKILLS & EXPERTISE CARD */}
          <div className="bg-white rounded-2xl border border-teal-200 p-5 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-teal-900 border-b border-teal-100 pb-3 flex items-center gap-2">
              <Award className="w-4.5 h-4.5 text-teal-700" />
              {t('profile.skills')}
            </h3>

            {/* Interactive Add Skill Tag */}
            <div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type new skill (e.g. Sales, Driving, Excel)..."
                  value={newSkill}
                  onChange={(e) => {
                    setNewSkill(e.target.value);
                    if (skillError) setSkillError(null);
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  className={`flex-1 p-2 border rounded-lg text-xs outline-hidden ${
                    skillError ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg text-xs flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
              <FieldError error={skillError} touched={true} />
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {currentProfile.skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-teal-50 border border-teal-200 text-teal-900 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1.5 shadow-2xs"
                >
                  {skill}
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-red-600 text-teal-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* RESUME CARD */}
          <div className="bg-white rounded-2xl border border-teal-200 p-5 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-teal-900 border-b border-teal-100 pb-3 flex items-center gap-2">
              <FileText className="w-4.5 h-4.5 text-teal-700" />
              {t('profile.resume')}
            </h3>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-teal-100 text-teal-800 rounded-xl">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-xs">{currentProfile.resumeName || 'Candidate_Resume.pdf'}</p>
                  <p className="text-[11px] text-slate-500">Updated: {currentProfile.resumeUpdatedAt || '2026-02-01'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {onOpenResumeBuilder && (
                  <button
                    onClick={onOpenResumeBuilder}
                    className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg text-xs shadow-xs"
                  >
                    AI Resume Builder
                  </button>
                )}
                <label className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold rounded-lg text-xs cursor-pointer flex items-center gap-1">
                  <Upload className="w-3.5 h-3.5" />
                  {t('buttons.replaceResume')}
                  <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleResumeUpload} />
                </label>
              </div>
            </div>
          </div>

          {/* PROFILE-BASED RECOMMENDED JOBS */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-lg text-teal-950 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-teal-600" />
                  {t('profile.jobsRecommended')}
                </h3>
                <p className="text-xs text-slate-600">{t('profile.recommendedBecauseSkills')}</p>
              </div>
              <span className="text-xs font-bold text-teal-800 bg-teal-100 px-2.5 py-1 rounded-full">
                {recommendedJobs.length} Jobs Match Profile
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendedJobs.slice(0, 4).map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onClick={() => onSelectJob && onSelectJob(job)}
                  onApply={() => onSelectJob && onSelectJob(job)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ADD EDUCATION MODAL */}
      {showEduModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-extrabold text-base text-teal-950">{t('profile.addEducation')}</h3>
              <button onClick={() => setShowEduModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEducation} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('profile.courseDegree')} *</label>
                <input
                  type="text"
                  value={eduForm.courseDegree || ''}
                  onChange={(e) => {
                    setEduForm({ ...eduForm, courseDegree: e.target.value });
                    setEduTouched((prev) => ({ ...prev, courseDegree: true }));
                  }}
                  onBlur={() => setEduTouched((prev) => ({ ...prev, courseDegree: true }))}
                  placeholder="e.g. B.Com, HSC (12th Pass), Diploma"
                  className={`w-full p-2.5 border rounded-xl outline-hidden ${
                    eduTouched.courseDegree && eduErrors.courseDegree ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                  }`}
                />
                <FieldError error={eduErrors.courseDegree} touched={eduTouched.courseDegree} />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('profile.collegeInstitute')} *</label>
                <input
                  type="text"
                  value={eduForm.collegeInstitute || ''}
                  onChange={(e) => {
                    setEduForm({ ...eduForm, collegeInstitute: e.target.value });
                    setEduTouched((prev) => ({ ...prev, collegeInstitute: true }));
                  }}
                  onBlur={() => setEduTouched((prev) => ({ ...prev, collegeInstitute: true }))}
                  placeholder="e.g. Podar College / State Board"
                  className={`w-full p-2.5 border rounded-xl outline-hidden ${
                    eduTouched.collegeInstitute && eduErrors.collegeInstitute ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                  }`}
                />
                <FieldError error={eduErrors.collegeInstitute} touched={eduTouched.collegeInstitute} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t('profile.specialization')}</label>
                  <input
                    type="text"
                    value={eduForm.specialization || ''}
                    onChange={(e) => setEduForm({ ...eduForm, specialization: e.target.value })}
                    placeholder="e.g. Commerce"
                    className="w-full p-2.5 border border-slate-300 rounded-xl outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t('profile.passingYear')} *</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={eduForm.passingYear || ''}
                    onChange={(e) => {
                      setEduForm({ ...eduForm, passingYear: e.target.value });
                      setEduTouched((prev) => ({ ...prev, passingYear: true }));
                    }}
                    onBlur={() => setEduTouched((prev) => ({ ...prev, passingYear: true }))}
                    placeholder="e.g. 2023"
                    className={`w-full p-2.5 border rounded-xl outline-hidden ${
                      eduTouched.passingYear && eduErrors.passingYear ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                    }`}
                  />
                  <FieldError error={eduErrors.passingYear} touched={eduTouched.passingYear} />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEduModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  {t('buttons.cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl shadow-md"
                >
                  {t('buttons.submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD EXPERIENCE MODAL */}
      {showExpModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-extrabold text-base text-teal-950">{t('profile.addExperience')}</h3>
              <button onClick={() => setShowExpModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExperience} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('profile.currentJobTitle')} *</label>
                <input
                  type="text"
                  value={expForm.title || ''}
                  onChange={(e) => {
                    setExpForm({ ...expForm, title: e.target.value });
                    setExpTouched((prev) => ({ ...prev, title: true }));
                  }}
                  onBlur={() => setExpTouched((prev) => ({ ...prev, title: true }))}
                  placeholder="e.g. Sales Executive, Delivery Partner"
                  className={`w-full p-2.5 border rounded-xl outline-hidden ${
                    expTouched.title && expErrors.title ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                  }`}
                />
                <FieldError error={expErrors.title} touched={expTouched.title} />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('profile.companyName')} *</label>
                <input
                  type="text"
                  value={expForm.company || ''}
                  onChange={(e) => {
                    setExpForm({ ...expForm, company: e.target.value });
                    setExpTouched((prev) => ({ ...prev, company: true }));
                  }}
                  onBlur={() => setExpTouched((prev) => ({ ...prev, company: true }))}
                  placeholder="e.g. ABC Retail Pvt Ltd"
                  className={`w-full p-2.5 border rounded-xl outline-hidden ${
                    expTouched.company && expErrors.company ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                  }`}
                />
                <FieldError error={expErrors.company} touched={expTouched.company} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t('profile.joiningDate')} *</label>
                  <input
                    type="text"
                    value={expForm.joiningDate || ''}
                    onChange={(e) => {
                      setExpForm({ ...expForm, joiningDate: e.target.value });
                      setExpTouched((prev) => ({ ...prev, joiningDate: true }));
                    }}
                    onBlur={() => setExpTouched((prev) => ({ ...prev, joiningDate: true }))}
                    placeholder="Jan 2023"
                    className={`w-full p-2.5 border rounded-xl outline-hidden ${
                      expTouched.joiningDate && expErrors.joiningDate ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                    }`}
                  />
                  <FieldError error={expErrors.joiningDate} touched={expTouched.joiningDate} />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t('profile.leavingDate')}</label>
                  <input
                    type="text"
                    value={expForm.leavingDate || ''}
                    onChange={(e) => setExpForm({ ...expForm, leavingDate: e.target.value })}
                    placeholder="Present / Dec 2024"
                    className="w-full p-2.5 border border-slate-300 rounded-xl outline-hidden"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('profile.responsibilities')}</label>
                <textarea
                  rows={2}
                  value={expForm.responsibilities || ''}
                  onChange={(e) => setExpForm({ ...expForm, responsibilities: e.target.value })}
                  placeholder="Customer handling, counter sales, daily cash reporting..."
                  className="w-full p-2.5 border border-slate-300 rounded-xl outline-hidden"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowExpModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  {t('buttons.cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl shadow-md"
                >
                  {t('buttons.submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
