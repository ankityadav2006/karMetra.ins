import React, { useState, useMemo } from 'react';
import { Job, JobType, WorkMode, PayPeriod, InterviewType } from '../../types';
import { storageService } from '../../services/storage';
import { validationRules } from '../../utils/validation';
import { FieldError } from '../common/FieldError';
import {
  X,
  Sparkles,
  Building2,
  Flame,
  Eye,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobCreated: (newJob: Job) => void;
}

export const CreateJobModal: React.FC<CreateJobModalProps> = ({ isOpen, onClose, onJobCreated }) => {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [submittedNotice, setSubmittedNotice] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // SECTION 1 — BASIC JOB DETAILS
  const [title, setTitle] = useState('Senior Delivery & Field Executive');
  const [category, setCategory] = useState('Delivery');
  const [openings, setOpenings] = useState(15);
  const [department, setDepartment] = useState('Field Logistics & Fleet');
  const [workMode, setWorkMode] = useState<WorkMode>('Field Work');
  const [jobType, setJobType] = useState<JobType>('Full-Time');

  // SECTION 2 — SALARY
  const [payPeriod, setPayPeriod] = useState<PayPeriod>('Monthly');
  const [minSalary, setMinSalary] = useState(22000);
  const [maxSalary, setMaxSalary] = useState(30000);
  const [incentives, setIncentives] = useState('Up to ₹5,000 monthly target incentives');
  const [performanceBonus, setPerformanceBonus] = useState('Quarterly performance multiplier');
  const [joiningBonus, setJoiningBonus] = useState('₹3,000 joining bonus after 30 days');
  const [overtimePay, setOvertimePay] = useState('1.5x hourly rate for extra hours');

  // SECTION 3 — EXPERIENCE
  const [fresherAccepted, setFresherAccepted] = useState(true);
  const [minExp, setMinExp] = useState(0);
  const [maxExp, setMaxExp] = useState(3);

  // SECTION 4 — SKILLS
  const [requiredSkills, setRequiredSkills] = useState('Delivery Operations, Route Optimization, Customer Service');
  const [preferredSkills, setPreferredSkills] = useState('Cash Handling, QR Payment Apps');
  const [languagesRequired, setLanguagesRequired] = useState('Hindi, English, Local State Language');

  // SECTION 5 — JOB RESPONSIBILITIES
  const [responsibilities, setResponsibilities] = useState(
    'Daily Responsibilities:\n- Deliver hyper-local customer orders promptly.\n- Maintain high delivery satisfaction rating.\n- Handle COD payments and app updates.\n- Working Hours: 9 AM to 6 PM.'
  );

  // SECTION 6 — ELIGIBILITY
  const [education, setEducation] = useState('10th Pass / HSC');
  const [ageRequirement, setAgeRequirement] = useState('18 to 45 Years');
  const [dlRequired, setDlRequired] = useState(true);

  // SECTION 7 — WORK SCHEDULE
  const [shiftType, setShiftType] = useState('Day Shift');
  const [shiftTiming, setShiftTiming] = useState('09:00 AM - 06:00 PM');
  const [weeklyWorkingDays, setWeeklyWorkingDays] = useState('6 Days');
  const [weeklyOff, setWeeklyOff] = useState('Rotational Weekoff');

  // SECTION 8 — BENEFITS
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([
    'PF',
    'ESIC',
    'Health Insurance',
    'Performance Incentives',
    'Joining Bonus',
    'Fuel Allowance',
  ]);

  // SECTION 9 — VEHICLE / BIKE REQUIREMENT
  const [bikeRequired, setBikeRequired] = useState(true);
  const [scooterAccepted, setScooterAccepted] = useState(true);
  const [companyVehicleProvided, setCompanyVehicleProvided] = useState(false);
  const [fuelAllowance, setFuelAllowance] = useState(true);

  // SECTION 10 — LOCATION
  const [locationName, setLocationName] = useState('Andheri East, Mumbai');
  const [fullAddress, setFullAddress] = useState('Plot 14, MIDC Central Road, Andheri East');
  const [city, setCity] = useState('Mumbai');
  const [pincode, setPincode] = useState('400093');

  // SECTION 11 — INTERVIEW
  const [interviewType, setInterviewType] = useState<InterviewType>('Walk-in');
  const [interviewLocation, setInterviewLocation] = useState('MIDC Hub Office, Andheri East');
  const [interviewTiming, setInterviewTiming] = useState('10:00 AM - 04:00 PM (Mon-Sat)');
  const [contactPerson, setContactPerson] = useState('Mr. Milind Sawant');
  const [contactPhone, setContactPhone] = useState('9876511111');

  // SECTION 12 — JOINING
  const [joiningDate, setJoiningDate] = useState('Immediate Joining');

  // SECTION 13 — COMPANY INFORMATION
  const [companyDescription, setCompanyDescription] = useState(
    'Leading tech-enabled hyper-local logistics and fulfillment provider across 15+ major metros in India.'
  );

  const markTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Real-Time Form Errors
  const errors = useMemo(() => {
    const errs: Record<string, string | null> = {};

    // Section 1: Basic
    errs.title = validationRules.required(title, 'Job title', 3);
    if (!openings || openings <= 0) {
      errs.openings = 'Number of openings must be at least 1';
    } else {
      errs.openings = null;
    }
    errs.department = validationRules.required(department, 'Department', 2);

    // Section 2: Salary
    const salaryCheck = validationRules.salaryRange(minSalary, maxSalary);
    errs.minSalary = salaryCheck.minError;
    errs.maxSalary = salaryCheck.maxError;

    // Section 3: Experience
    const expCheck = validationRules.experienceRange(minExp, maxExp);
    errs.minExp = expCheck.minError;
    errs.maxExp = expCheck.maxError;

    // Section 4: Skills
    if (!requiredSkills.trim()) {
      errs.requiredSkills = 'Please provide at least 1 required skill';
    } else {
      errs.requiredSkills = null;
    }

    // Section 5: Responsibilities
    if (!responsibilities.trim() || responsibilities.trim().length < 15) {
      errs.responsibilities = 'Please provide at least 15 characters describing duties & responsibilities';
    } else {
      errs.responsibilities = null;
    }

    // Section 10: Location
    errs.locationName = validationRules.required(locationName, 'Locality / Area name', 2);
    errs.city = validationRules.required(city, 'City name', 2);
    errs.pincode = validationRules.pincode(pincode, true);

    // Section 11: Interview
    errs.contactPerson = validationRules.required(contactPerson, 'Contact person name', 2);
    errs.contactPhone = validationRules.phone(contactPhone, true);

    return errs;
  }, [
    title,
    openings,
    department,
    minSalary,
    maxSalary,
    minExp,
    maxExp,
    requiredSkills,
    responsibilities,
    locationName,
    city,
    pincode,
    contactPerson,
    contactPhone,
  ]);

  if (!isOpen) return null;

  const toggleBenefit = (b: string) => {
    if (selectedBenefits.includes(b)) {
      setSelectedBenefits(selectedBenefits.filter((item) => item !== b));
    } else {
      setSelectedBenefits([...selectedBenefits, b]);
    }
  };

  const handlePublishJob = () => {
    // Touch all fields
    const allTouched: Record<string, boolean> = {
      title: true,
      openings: true,
      department: true,
      minSalary: true,
      maxSalary: true,
      minExp: true,
      maxExp: true,
      requiredSkills: true,
      responsibilities: true,
      locationName: true,
      city: true,
      pincode: true,
      contactPerson: true,
      contactPhone: true,
    };
    setTouched(allTouched);

    // Check for any blocking errors
    const hasAnyError = Object.values(errors).some((e) => e !== null);
    if (hasAnyError) {
      // Find the tab with the first error and switch to it
      if (errors.title || errors.openings || errors.department) setActiveTab(1);
      else if (errors.minSalary || errors.maxSalary) setActiveTab(2);
      else if (errors.minExp || errors.maxExp) setActiveTab(3);
      else if (errors.requiredSkills) setActiveTab(4);
      else if (errors.responsibilities) setActiveTab(5);
      else if (errors.locationName || errors.city || errors.pincode) setActiveTab(10);
      else if (errors.contactPerson || errors.contactPhone) setActiveTab(11);
      return;
    }

    const currentUser = storageService.getCurrentUser();

    const created = storageService.addJob({
      title,
      category,
      openings,
      department,
      companyId: 'comp-1',
      companyName: currentUser.name || 'Apex Logistics India',
      companyLogo: '🏢',
      location: locationName,
      fullAddress,
      city,
      pincode,
      coordinates: { lat: 19.1136, lng: 72.8697 },
      distanceKm: 2.4,

      minSalary,
      maxSalary,
      payPeriod,
      incentives,
      performanceBonus,
      joiningBonus,
      overtimePay,

      fresherAccepted,
      minExperience: minExp,
      maxExperience: maxExp,

      skillsRequired: requiredSkills.split(',').map((s) => s.trim()),
      preferredSkills: preferredSkills.split(',').map((s) => s.trim()),
      languagesRequired: languagesRequired.split(',').map((s) => s.trim()),

      description: responsibilities,
      responsibilities: responsibilities.split('\n').filter((l) => l.trim().length > 0),
      requirements: [`Education: ${education}`, `Age: ${ageRequirement}`],

      eligibility: {
        education,
        ageRequirement,
        drivingLicenseRequired: dlRequired,
      },

      workSchedule: {
        shiftType,
        shiftTiming,
        weeklyWorkingDays,
        weeklyOff,
      },

      benefits: selectedBenefits,

      vehicleRequirement: {
        bikeRequired,
        scooterAccepted,
        companyVehicleProvided,
        fuelAllowance,
      },

      interviewInfo: {
        interviewType,
        interviewLocation,
        interviewTiming,
        contactPerson,
        contactPhone,
      },

      joiningDate,
      companyDescription,

      isUrgent: true,
      isWalkIn: interviewType === 'Walk-in',
      isVerifiedEmployer: true,
      isVerifiedJob: false,
      recruiterId: currentUser.id,
      recruiterName: currentUser.name,

      approvalStatus: 'Pending Admin Review',
      status: 'Pending Admin Review',
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    setSubmittedNotice(true);
    setTimeout(() => {
      onJobCreated(created);
      onClose();
    }, 2000);
  };

  const sectionsList = [
    '1. Basic Details',
    '2. Salary',
    '3. Experience',
    '4. Skills',
    '5. Responsibilities',
    '6. Eligibility',
    '7. Work Schedule',
    '8. Benefits',
    '9. Vehicle Requirement',
    '10. Location',
    '11. Interview Info',
    '12. Joining',
    '13. Company Info',
    '14. Preview & Submit',
  ];

  return (
    <div className="fixed inset-0 bg-teal-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full my-auto shadow-2xl border border-teal-200 overflow-hidden relative max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-teal-900 text-white flex items-center justify-between shrink-0 border-b border-teal-800">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-teal-400" />
              <h2 className="text-base sm:text-lg font-black tracking-tight">Post a New Verified Job</h2>
              <span className="bg-teal-700 text-teal-200 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                14-Section Form
              </span>
            </div>
            <p className="text-xs text-teal-200/80 mt-0.5">
              PAN-India structured job posting engine with real-time field validation
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Submitted confirmation banner */}
        {submittedNotice && (
          <div className="bg-emerald-600 text-white p-4 text-center text-xs font-bold flex items-center justify-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5" />
            Job submitted successfully! Dispatched to Super Admin review queue (Estimated SLA: ~2 hours).
          </div>
        )}

        {/* Tab Strip */}
        {!isPreviewMode && (
          <div className="bg-teal-950/90 px-3 py-2 flex items-center gap-1.5 overflow-x-auto shrink-0 border-b border-teal-800 text-[11px] no-scrollbar">
            {sectionsList.map((sec, idx) => {
              const tabIndex = idx + 1;
              const isActive = activeTab === tabIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveTab(tabIndex)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1 shrink-0 ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'text-teal-200 hover:text-white hover:bg-teal-900/60'
                  }`}
                >
                  <span>{sec}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Body Form Sections */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-800">
          {isPreviewMode ? (
            /* PREVIEW VIEW */
            <div className="bg-teal-50/50 border border-teal-200 rounded-2xl p-6 space-y-4">
              <div className="border-b border-teal-200 pb-4 flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                    Candidate View Preview
                  </span>
                  <h2 className="text-xl font-black text-teal-950 mt-1">{title}</h2>
                  <p className="text-xs text-teal-700 font-semibold">{department} • {locationName}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-teal-900">₹{minSalary.toLocaleString()} - ₹{maxSalary.toLocaleString()}</p>
                  <p className="text-[10px] text-teal-600 font-bold">{payPeriod}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-teal-100">
                  <p className="text-[10px] text-slate-400 font-bold">Openings</p>
                  <p className="font-bold text-slate-800">{openings} Positions</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-teal-100">
                  <p className="text-[10px] text-slate-400 font-bold">Experience</p>
                  <p className="font-bold text-slate-800">{fresherAccepted ? 'Fresher Accepted' : `${minExp}-${maxExp} Yrs`}</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-teal-100">
                  <p className="text-[10px] text-slate-400 font-bold">Work Mode</p>
                  <p className="font-bold text-slate-800">{workMode}</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-teal-100">
                  <p className="text-[10px] text-slate-400 font-bold">Joining</p>
                  <p className="font-bold text-slate-800">{joiningDate}</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-teal-900 mb-1">Selectable Benefits Provided:</h4>
                <div className="flex gap-1.5 flex-wrap">
                  {selectedBenefits.map((b, i) => (
                    <span key={i} className="bg-teal-100 text-teal-800 font-bold px-2.5 py-1 rounded-lg text-[10px]">
                      ✓ {b}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-teal-900 mb-1">Responsibilities & Schedule:</h4>
                <p className="whitespace-pre-line text-slate-700 leading-relaxed bg-white p-4 rounded-xl border border-teal-100">
                  {responsibilities}
                </p>
              </div>
            </div>
          ) : (
            /* TABBED FORM STEPS */
            <>
              {activeTab === 1 && (
                <div className="space-y-4 animate-in fade-in">
                  <h3 className="font-extrabold text-sm text-teal-900 border-b pb-2">SECTION 1 — BASIC JOB DETAILS</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold mb-1">Job Title *</label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => {
                          setTitle(e.target.value);
                          markTouched('title');
                        }}
                        onBlur={() => markTouched('title')}
                        className={`w-full p-2.5 bg-slate-50 border rounded-xl outline-hidden focus:border-teal-600 font-medium ${
                          touched.title && errors.title ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                        }`}
                      />
                      <FieldError error={errors.title} touched={touched.title} />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Job Category *</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-hidden focus:border-teal-600 font-medium"
                      >
                        {['Delivery', 'Warehouse', 'Sales', 'Retail', 'Security', 'Housekeeping', 'Hospitality', 'Customer Support', 'Data Entry', 'HR & Recruitment'].map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Number of Openings *</label>
                      <input
                        type="number"
                        min={1}
                        value={openings}
                        onChange={(e) => {
                          setOpenings(Number(e.target.value));
                          markTouched('openings');
                        }}
                        onBlur={() => markTouched('openings')}
                        className={`w-full p-2.5 bg-slate-50 border rounded-xl outline-hidden ${
                          touched.openings && errors.openings ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                        }`}
                      />
                      <FieldError error={errors.openings} touched={touched.openings} />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Department *</label>
                      <input
                        type="text"
                        value={department}
                        onChange={(e) => {
                          setDepartment(e.target.value);
                          markTouched('department');
                        }}
                        onBlur={() => markTouched('department')}
                        className={`w-full p-2.5 bg-slate-50 border rounded-xl outline-hidden ${
                          touched.department && errors.department ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                        }`}
                      />
                      <FieldError error={errors.department} touched={touched.department} />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Work Location Type</label>
                      <select
                        value={workMode}
                        onChange={(e) => setWorkMode(e.target.value as WorkMode)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-hidden"
                      >
                        <option value="On-Site">On-Site</option>
                        <option value="Field Work">Field Work</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Work From Home">Work From Home</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Job Type</label>
                      <select
                        value={jobType}
                        onChange={(e) => setJobType(e.target.value as JobType)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-hidden"
                      >
                        <option value="Full-Time">Full-Time</option>
                        <option value="Part-Time">Part-Time</option>
                        <option value="Contract">Contract</option>
                        <option value="Walk-In">Walk-In</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 2 && (
                <div className="space-y-4 animate-in fade-in">
                  <h3 className="font-extrabold text-sm text-teal-900 border-b pb-2">SECTION 2 — SALARY</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold mb-1">Salary Type</label>
                      <select
                        value={payPeriod}
                        onChange={(e) => setPayPeriod(e.target.value as PayPeriod)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-hidden"
                      >
                        <option value="Monthly">Monthly</option>
                        <option value="Annual">Annual</option>
                        <option value="Per Day">Per Day</option>
                        <option value="Per Hour">Per Hour</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Minimum Salary (₹) *</label>
                      <input
                        type="number"
                        min={0}
                        value={minSalary}
                        onChange={(e) => {
                          setMinSalary(Number(e.target.value));
                          markTouched('minSalary');
                        }}
                        onBlur={() => markTouched('minSalary')}
                        className={`w-full p-2.5 bg-slate-50 border rounded-xl outline-hidden font-bold ${
                          touched.minSalary && errors.minSalary ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                        }`}
                      />
                      <FieldError error={errors.minSalary} touched={touched.minSalary} />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Maximum Salary (₹) *</label>
                      <input
                        type="number"
                        min={0}
                        value={maxSalary}
                        onChange={(e) => {
                          setMaxSalary(Number(e.target.value));
                          markTouched('maxSalary');
                        }}
                        onBlur={() => markTouched('maxSalary')}
                        className={`w-full p-2.5 bg-slate-50 border rounded-xl outline-hidden font-bold ${
                          touched.maxSalary && errors.maxSalary ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                        }`}
                      />
                      <FieldError error={errors.maxSalary} touched={touched.maxSalary} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold mb-1">Incentives</label>
                      <input
                        type="text"
                        value={incentives}
                        onChange={(e) => setIncentives(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Performance Bonus</label>
                      <input
                        type="text"
                        value={performanceBonus}
                        onChange={(e) => setPerformanceBonus(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Joining Bonus</label>
                      <input
                        type="text"
                        value={joiningBonus}
                        onChange={(e) => setJoiningBonus(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Overtime Pay</label>
                      <input
                        type="text"
                        value={overtimePay}
                        onChange={(e) => setOvertimePay(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 3 && (
                <div className="space-y-4 animate-in fade-in">
                  <h3 className="font-extrabold text-sm text-teal-900 border-b pb-2">SECTION 3 — EXPERIENCE</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 font-bold cursor-pointer bg-teal-50 p-3 rounded-xl border border-teal-200">
                      <input
                        type="checkbox"
                        checked={fresherAccepted}
                        onChange={(e) => setFresherAccepted(e.target.checked)}
                        className="w-4 h-4 accent-teal-600 rounded"
                      />
                      <span>Accept Freshers (0 Years Experience)</span>
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold mb-1">Min Experience (Years)</label>
                        <input
                          type="number"
                          min={0}
                          value={minExp}
                          onChange={(e) => {
                            setMinExp(Number(e.target.value));
                            markTouched('minExp');
                          }}
                          onBlur={() => markTouched('minExp')}
                          className={`w-full p-2.5 bg-slate-50 border rounded-xl outline-hidden ${
                            touched.minExp && errors.minExp ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                          }`}
                        />
                        <FieldError error={errors.minExp} touched={touched.minExp} />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Max Experience (Years)</label>
                        <input
                          type="number"
                          min={0}
                          value={maxExp}
                          onChange={(e) => {
                            setMaxExp(Number(e.target.value));
                            markTouched('maxExp');
                          }}
                          onBlur={() => markTouched('maxExp')}
                          className={`w-full p-2.5 bg-slate-50 border rounded-xl outline-hidden ${
                            touched.maxExp && errors.maxExp ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                          }`}
                        />
                        <FieldError error={errors.maxExp} touched={touched.maxExp} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 4 && (
                <div className="space-y-4 animate-in fade-in">
                  <h3 className="font-extrabold text-sm text-teal-900 border-b pb-2">SECTION 4 — SKILLS</h3>
                  <div>
                    <label className="block font-bold mb-1">Required Skills (Comma separated) *</label>
                    <input
                      type="text"
                      value={requiredSkills}
                      onChange={(e) => {
                        setRequiredSkills(e.target.value);
                        markTouched('requiredSkills');
                      }}
                      onBlur={() => markTouched('requiredSkills')}
                      placeholder="e.g. Delivery Operations, Navigation, Customer Service"
                      className={`w-full p-2.5 bg-slate-50 border rounded-xl outline-hidden ${
                        touched.requiredSkills && errors.requiredSkills ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                      }`}
                    />
                    <FieldError error={errors.requiredSkills} touched={touched.requiredSkills} />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Preferred Skills</label>
                    <input
                      type="text"
                      value={preferredSkills}
                      onChange={(e) => setPreferredSkills(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Languages Required</label>
                    <input
                      type="text"
                      value={languagesRequired}
                      onChange={(e) => setLanguagesRequired(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-hidden"
                    />
                  </div>
                </div>
              )}

              {activeTab === 5 && (
                <div className="space-y-4 animate-in fade-in">
                  <h3 className="font-extrabold text-sm text-teal-900 border-b pb-2">SECTION 5 — JOB RESPONSIBILITIES</h3>
                  <div>
                    <label className="block font-bold mb-1">Daily Responsibilities & Duties *</label>
                    <textarea
                      rows={6}
                      value={responsibilities}
                      onChange={(e) => {
                        setResponsibilities(e.target.value);
                        markTouched('responsibilities');
                      }}
                      onBlur={() => markTouched('responsibilities')}
                      className={`w-full p-3 bg-slate-50 border rounded-xl outline-hidden font-sans ${
                        touched.responsibilities && errors.responsibilities ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                      }`}
                    />
                    <FieldError error={errors.responsibilities} touched={touched.responsibilities} />
                  </div>
                </div>
              )}

              {activeTab === 6 && (
                <div className="space-y-4 animate-in fade-in">
                  <h3 className="font-extrabold text-sm text-teal-900 border-b pb-2">SECTION 6 — ELIGIBILITY</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold mb-1">Min Education</label>
                      <input
                        type="text"
                        value={education}
                        onChange={(e) => setEducation(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Age Requirement</label>
                      <input
                        type="text"
                        value={ageRequirement}
                        onChange={(e) => setAgeRequirement(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 7 && (
                <div className="space-y-4 animate-in fade-in">
                  <h3 className="font-extrabold text-sm text-teal-900 border-b pb-2">SECTION 7 — WORK SCHEDULE</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold mb-1">Shift Type</label>
                      <input
                        type="text"
                        value={shiftType}
                        onChange={(e) => setShiftType(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Shift Timing</label>
                      <input
                        type="text"
                        value={shiftTiming}
                        onChange={(e) => setShiftTiming(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Weekly Working Days</label>
                      <input
                        type="text"
                        value={weeklyWorkingDays}
                        onChange={(e) => setWeeklyWorkingDays(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Weekly Off</label>
                      <input
                        type="text"
                        value={weeklyOff}
                        onChange={(e) => setWeeklyOff(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 8 && (
                <div className="space-y-4 animate-in fade-in">
                  <h3 className="font-extrabold text-sm text-teal-900 border-b pb-2">SECTION 8 — BENEFITS</h3>
                  <p className="text-slate-500 font-medium">Selectable benefits to highlight on Job Card:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      'PF',
                      'ESIC',
                      'Health Insurance',
                      'Paid Leave',
                      'Performance Incentives',
                      'Joining Bonus',
                      'Food & Meals',
                      'Pickup & Drop Transport',
                      'Accommodation',
                      'Uniform Provided',
                      'Mobile Allowance',
                      'Travel Allowance',
                      'Fuel Allowance',
                    ].map((b) => {
                      const isSel = selectedBenefits.includes(b);
                      return (
                        <button
                          key={b}
                          type="button"
                          onClick={() => toggleBenefit(b)}
                          className={`p-2.5 rounded-xl border text-left font-bold transition-all flex items-center justify-between ${
                            isSel
                              ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-teal-400'
                          }`}
                        >
                          <span>{b}</span>
                          {isSel && <CheckCircle2 className="w-4 h-4 text-white" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === 9 && (
                <div className="space-y-4 animate-in fade-in">
                  <h3 className="font-extrabold text-sm text-teal-900 border-b pb-2">SECTION 9 — VEHICLE / BIKE REQUIREMENT</h3>
                  <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <label className="flex items-center gap-2 font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={bikeRequired}
                        onChange={(e) => setBikeRequired(e.target.checked)}
                        className="w-4 h-4 accent-teal-600 rounded"
                      />
                      <span>Two-Wheeler / Bike Required</span>
                    </label>
                    <label className="flex items-center gap-2 font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={scooterAccepted}
                        onChange={(e) => setScooterAccepted(e.target.checked)}
                        className="w-4 h-4 accent-teal-600 rounded"
                      />
                      <span>Scooter / EV Scooter Accepted</span>
                    </label>
                    <label className="flex items-center gap-2 font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={dlRequired}
                        onChange={(e) => setDlRequired(e.target.checked)}
                        className="w-4 h-4 accent-teal-600 rounded"
                      />
                      <span>Valid Driving License Required</span>
                    </label>
                    <label className="flex items-center gap-2 font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={fuelAllowance}
                        onChange={(e) => setFuelAllowance(e.target.checked)}
                        className="w-4 h-4 accent-teal-600 rounded"
                      />
                      <span>Fuel / Petrol Reimbursement Provided</span>
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 10 && (
                <div className="space-y-4 animate-in fade-in">
                  <h3 className="font-extrabold text-sm text-teal-900 border-b pb-2">SECTION 10 — LOCATION</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold mb-1">Locality / Area Name *</label>
                      <input
                        type="text"
                        value={locationName}
                        onChange={(e) => {
                          setLocationName(e.target.value);
                          markTouched('locationName');
                        }}
                        onBlur={() => markTouched('locationName')}
                        placeholder="e.g. Andheri East"
                        className={`w-full p-2.5 bg-slate-50 border rounded-xl outline-hidden ${
                          touched.locationName && errors.locationName ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                        }`}
                      />
                      <FieldError error={errors.locationName} touched={touched.locationName} />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">City *</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => {
                          setCity(e.target.value);
                          markTouched('city');
                        }}
                        onBlur={() => markTouched('city')}
                        placeholder="e.g. Mumbai"
                        className={`w-full p-2.5 bg-slate-50 border rounded-xl outline-hidden ${
                          touched.city && errors.city ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                        }`}
                      />
                      <FieldError error={errors.city} touched={touched.city} />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Full Workplace Address</label>
                      <input
                        type="text"
                        value={fullAddress}
                        onChange={(e) => setFullAddress(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">PIN Code *</label>
                      <input
                        type="text"
                        maxLength={6}
                        value={pincode}
                        onChange={(e) => {
                          setPincode(e.target.value);
                          markTouched('pincode');
                        }}
                        onBlur={() => markTouched('pincode')}
                        placeholder="e.g. 400093"
                        className={`w-full p-2.5 bg-slate-50 border rounded-xl outline-hidden ${
                          touched.pincode && errors.pincode ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                        }`}
                      />
                      <FieldError error={errors.pincode} touched={touched.pincode} />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 11 && (
                <div className="space-y-4 animate-in fade-in">
                  <h3 className="font-extrabold text-sm text-teal-900 border-b pb-2">SECTION 11 — INTERVIEW</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold mb-1">Interview Mode</label>
                      <select
                        value={interviewType}
                        onChange={(e) => setInterviewType(e.target.value as InterviewType)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-hidden font-bold"
                      >
                        <option value="Walk-in">Walk-in Interview</option>
                        <option value="In-Person">In-Person Scheduled</option>
                        <option value="Phone">Telephonic Interview</option>
                        <option value="Video">Video Interview (Google Meet)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Interview Location / Link</label>
                      <input
                        type="text"
                        value={interviewLocation}
                        onChange={(e) => setInterviewLocation(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Contact Person Name *</label>
                      <input
                        type="text"
                        value={contactPerson}
                        onChange={(e) => {
                          setContactPerson(e.target.value);
                          markTouched('contactPerson');
                        }}
                        onBlur={() => markTouched('contactPerson')}
                        placeholder="e.g. Mr. Milind Sawant"
                        className={`w-full p-2.5 bg-slate-50 border rounded-xl outline-hidden ${
                          touched.contactPerson && errors.contactPerson ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                        }`}
                      />
                      <FieldError error={errors.contactPerson} touched={touched.contactPerson} />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Contact Phone Number *</label>
                      <input
                        type="text"
                        maxLength={10}
                        value={contactPhone}
                        onChange={(e) => {
                          setContactPhone(e.target.value);
                          markTouched('contactPhone');
                        }}
                        onBlur={() => markTouched('contactPhone')}
                        placeholder="9876511111"
                        className={`w-full p-2.5 bg-slate-50 border rounded-xl outline-hidden ${
                          touched.contactPhone && errors.contactPhone ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                        }`}
                      />
                      <FieldError error={errors.contactPhone} touched={touched.contactPhone} />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 12 && (
                <div className="space-y-4 animate-in fade-in">
                  <h3 className="font-extrabold text-sm text-teal-900 border-b pb-2">SECTION 12 — JOINING</h3>
                  <div>
                    <label className="block font-bold mb-1">Joining Availability Requirement</label>
                    <input
                      type="text"
                      value={joiningDate}
                      onChange={(e) => setJoiningDate(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-hidden font-bold"
                    />
                  </div>
                </div>
              )}

              {activeTab === 13 && (
                <div className="space-y-4 animate-in fade-in">
                  <h3 className="font-extrabold text-sm text-teal-900 border-b pb-2">SECTION 13 — COMPANY INFORMATION</h3>
                  <div>
                    <label className="block font-bold mb-1">About Company / Workplace Culture</label>
                    <textarea
                      rows={4}
                      value={companyDescription}
                      onChange={(e) => setCompanyDescription(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl outline-hidden font-sans"
                    />
                  </div>
                </div>
              )}

              {activeTab === 14 && (
                <div className="space-y-4 animate-in fade-in">
                  <h3 className="font-extrabold text-sm text-teal-900 border-b pb-2">SECTION 14 — JOB POSTING SUMMARY & ADMIN REVIEW</h3>
                  
                  {/* Job Posting Summary Card */}
                  <div className="bg-teal-950 text-white p-5 rounded-2xl border border-teal-800 shadow-md space-y-4">
                    <div className="flex items-center justify-between border-b border-teal-800 pb-3">
                      <div>
                        <h4 className="font-extrabold text-base text-teal-200">Job Posting Summary</h4>
                        <p className="text-xs text-teal-300/80">Review posting fee & 30-day validity before submission</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                        storageService.getPostingEntitlement().hasFreeAvailable
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                      }`}>
                        {storageService.getPostingEntitlement().hasFreeAvailable ? 'FREE Posting' : 'Paid Posting (₹299)'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                      <div className="bg-teal-900/60 p-3 rounded-xl border border-teal-800">
                        <p className="text-teal-300 text-[10px] uppercase font-bold">Posting Fee</p>
                        <p className="text-lg font-black text-white mt-0.5">
                          {storageService.getPostingEntitlement().hasFreeAvailable ? '₹0 (FREE)' : '₹299'}
                        </p>
                        <p className="text-[10px] text-teal-300">
                          {storageService.getPostingEntitlement().hasFreeAvailable ? 'Weekly Free Allowance' : 'Free posting used this week'}
                        </p>
                      </div>

                      <div className="bg-teal-900/60 p-3 rounded-xl border border-teal-800">
                        <p className="text-teal-300 text-[10px] uppercase font-bold">Validity Period</p>
                        <p className="text-lg font-black text-teal-300 mt-0.5">30 Days</p>
                        <p className="text-[10px] text-teal-300">Auto-expires after 1 month</p>
                      </div>

                      <div className="bg-teal-900/60 p-3 rounded-xl border border-teal-800 col-span-2 sm:col-span-1">
                        <p className="text-teal-300 text-[10px] uppercase font-bold">Approval Status</p>
                        <p className="text-xs font-bold text-amber-300 mt-1">Pending Review</p>
                        <p className="text-[10px] text-teal-300">Requires Admin Approval</p>
                      </div>
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl text-amber-200 text-xs leading-relaxed space-y-1">
                      <p className="font-bold flex items-center gap-1.5 text-amber-300">
                        <Clock className="w-3.5 h-3.5" />
                        Admin Review SLA Notice:
                      </p>
                      <p className="text-[11px] text-amber-100">
                        "Jobs are normally reviewed within 2 hours." Both Free and Paid job postings undergo Admin verification before appearing live in candidate searches.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-center pt-2">
                    <button
                      type="button"
                      onClick={() => setIsPreviewMode(true)}
                      className="px-6 py-2.5 bg-teal-100 hover:bg-teal-200 text-teal-900 font-bold rounded-2xl flex items-center gap-2 text-xs"
                    >
                      <Eye className="w-4 h-4 text-teal-700" /> Preview Candidate View
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            disabled={activeTab === 1 && !isPreviewMode}
            onClick={() => {
              if (isPreviewMode) {
                setIsPreviewMode(false);
              } else {
                setActiveTab(Math.max(1, activeTab - 1));
              }
            }}
            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl text-xs disabled:opacity-40 flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Previous Section
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-200 font-bold rounded-xl text-xs"
            >
              Cancel
            </button>

            {activeTab < 14 && !isPreviewMode ? (
              <button
                type="button"
                onClick={() => setActiveTab(activeTab + 1)}
                className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
              >
                <span>Next Section</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePublishJob}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-xl text-xs flex items-center gap-2 shadow-md"
              >
                <ShieldCheck className="w-4 h-4" />
                {storageService.getPostingEntitlement().hasFreeAvailable ? 'Post for Free' : 'Post for ₹299'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
