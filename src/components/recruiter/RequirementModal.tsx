import React, { useState, useMemo } from 'react';
import { RecruitmentRequirement, JobType, InterviewType } from '../../types';
import { storageService } from '../../services/storage';
import { X, Layers, Building, Plus } from 'lucide-react';
import { validationRules } from '../../utils/validation';
import { FieldError } from '../common/FieldError';

interface RequirementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequirementCreated: (req: RecruitmentRequirement) => void;
}

export const RequirementModal: React.FC<RequirementModalProps> = ({
  isOpen,
  onClose,
  onRequirementCreated,
}) => {
  const [clientName, setClientName] = useState('Apex Logistics India');
  const [title, setTitle] = useState('50 Hyperlocal Delivery Partners');
  const [openings, setOpenings] = useState(50);
  const [location, setLocation] = useState('Andheri & Goregaon, Mumbai');
  const [minSalary, setMinSalary] = useState(22000);
  const [maxSalary, setMaxSalary] = useState(30000);
  const [experienceYears, setExperienceYears] = useState(1);
  const [skills, setSkills] = useState('DL License, Android Phone, Route Knowledge');
  const [education, setEducation] = useState('10th Pass');
  const [joiningDeadline, setJoiningDeadline] = useState('2026-02-28');
  const [urgency, setUrgency] = useState<'Low' | 'Medium' | 'High' | 'Urgent'>('Urgent');
  const [payout, setPayout] = useState(1500);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const errors = useMemo(() => {
    const errs: Record<string, string | null> = {};
    errs.clientName = validationRules.required(clientName, 'Client / Company name', 2);
    errs.title = validationRules.required(title, 'Requirement Mandate title', 3);
    if (!openings || openings < 1) {
      errs.openings = 'Openings must be at least 1';
    } else {
      errs.openings = null;
    }
    errs.location = validationRules.required(location, 'Location', 2);
    if (payout < 0) {
      errs.payout = 'Payout cannot be negative';
    } else {
      errs.payout = null;
    }
    if (!skills.trim()) {
      errs.skills = 'Please enter at least 1 required skill';
    } else {
      errs.skills = null;
    }
    return errs;
  }, [clientName, title, openings, location, payout, skills]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      clientName: true,
      title: true,
      openings: true,
      location: true,
      payout: true,
      skills: true,
    });
    if (Object.values(errors).some((err) => err !== null)) return;

    const currentUser = storageService.getCurrentUser();

    const created = storageService.addRequirement({
      clientId: 'comp-1',
      clientName,
      recruiterId: currentUser.id,
      title,
      openings,
      location,
      minSalary,
      maxSalary,
      experienceYears,
      skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
      education,
      joiningDeadline,
      shift: 'Day & Evening Shift',
      jobType: 'Full-Time',
      interviewType: 'Walk-in',
      urgency,
      payoutPerHire: payout,
    });

    onRequirementCreated(created);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full my-auto shadow-2xl border border-slate-200 overflow-hidden relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" /> Create Client Requirement
            </h2>
            <p className="text-xs text-slate-400">Define hiring Mandate for staffing agency pipeline</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Client / Company Name *</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => {
                  setClientName(e.target.value);
                  setTouched((prev) => ({ ...prev, clientName: true }));
                }}
                onBlur={() => setTouched((prev) => ({ ...prev, clientName: true }))}
                className={`w-full p-2.5 bg-slate-50 border rounded-lg outline-hidden ${
                  touched.clientName && errors.clientName ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300 focus:border-teal-500'
                }`}
              />
              <FieldError error={errors.clientName} touched={touched.clientName} />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Requirement Mandate Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setTouched((prev) => ({ ...prev, title: true }));
                }}
                onBlur={() => setTouched((prev) => ({ ...prev, title: true }))}
                className={`w-full p-2.5 bg-slate-50 border rounded-lg outline-hidden ${
                  touched.title && errors.title ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300 focus:border-teal-500'
                }`}
              />
              <FieldError error={errors.title} touched={touched.title} />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Openings Required *</label>
              <input
                type="number"
                min={1}
                value={openings}
                onChange={(e) => {
                  setOpenings(Number(e.target.value));
                  setTouched((prev) => ({ ...prev, openings: true }));
                }}
                onBlur={() => setTouched((prev) => ({ ...prev, openings: true }))}
                className={`w-full p-2.5 bg-slate-50 border rounded-lg outline-hidden ${
                  touched.openings && errors.openings ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300 focus:border-teal-500'
                }`}
              />
              <FieldError error={errors.openings} touched={touched.openings} />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Location *</label>
              <input
                type="text"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setTouched((prev) => ({ ...prev, location: true }));
                }}
                onBlur={() => setTouched((prev) => ({ ...prev, location: true }))}
                className={`w-full p-2.5 bg-slate-50 border rounded-lg outline-hidden ${
                  touched.location && errors.location ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300 focus:border-teal-500'
                }`}
              />
              <FieldError error={errors.location} touched={touched.location} />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Payout Per Successful Hire (₹)</label>
              <input
                type="number"
                min={0}
                value={payout}
                onChange={(e) => {
                  setPayout(Number(e.target.value));
                  setTouched((prev) => ({ ...prev, payout: true }));
                }}
                onBlur={() => setTouched((prev) => ({ ...prev, payout: true }))}
                className={`w-full p-2.5 bg-slate-50 border rounded-lg outline-hidden font-bold text-emerald-700 ${
                  touched.payout && errors.payout ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300 focus:border-teal-500'
                }`}
              />
              <FieldError error={errors.payout} touched={touched.payout} />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Urgency Level</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-hidden"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">🔥 Urgent Hiring</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Required Skills (Comma Separated) *</label>
            <input
              type="text"
              value={skills}
              onChange={(e) => {
                setSkills(e.target.value);
                setTouched((prev) => ({ ...prev, skills: true }));
              }}
              onBlur={() => setTouched((prev) => ({ ...prev, skills: true }))}
              className={`w-full p-2.5 bg-slate-50 border rounded-lg outline-hidden ${
                touched.skills && errors.skills ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300 focus:border-teal-500'
              }`}
            />
            <FieldError error={errors.skills} touched={touched.skills} />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 font-bold rounded-xl text-slate-700">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs">
              Create Mandate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
