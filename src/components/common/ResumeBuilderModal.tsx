import React, { useState, useMemo } from 'react';
import { ResumeData } from '../../types';
import { storageService } from '../../services/storage';
import { FileText, Download, Printer, Check, X, Sparkles, Plus, Trash2 } from 'lucide-react';
import { validationRules } from '../../utils/validation';
import { FieldError } from './FieldError';

interface ResumeBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeBuilderModal: React.FC<ResumeBuilderModalProps> = ({ isOpen, onClose }) => {
  const [template, setTemplate] = useState<'Professional' | 'Simple' | 'Modern'>('Modern');
  const [resumeData, setResumeData] = useState<ResumeData>(() => storageService.getResumeData());
  const [newSkill, setNewSkill] = useState('');
  const [skillError, setSkillError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const errors = useMemo(() => {
    const errs: Record<string, string | null> = {};
    errs.fullName = validationRules.name(resumeData.fullName, 'Full name', 2);
    errs.email = validationRules.email(resumeData.email, true);
    errs.phone = validationRules.phone(resumeData.phone, true);
    errs.location = validationRules.required(resumeData.location, 'Location / City', 2);
    if (!resumeData.summary || resumeData.summary.trim().length < 10) {
      errs.summary = 'Summary must be at least 10 characters long';
    } else {
      errs.summary = null;
    }
    return errs;
  }, [resumeData]);

  if (!isOpen) return null;

  const handleSave = () => {
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      location: true,
      summary: true,
    });
    if (Object.values(errors).some(err => err !== null)) return false;
    storageService.saveResumeData(resumeData);
    return true;
  };

  const addSkill = () => {
    if (!newSkill.trim()) {
      setSkillError('Please enter a skill name');
      return;
    }
    if (resumeData.skills.includes(newSkill.trim())) {
      setSkillError('Skill already added to resume');
      return;
    }
    setSkillError(null);
    setResumeData({ ...resumeData, skills: [...resumeData.skills, newSkill.trim()] });
    setNewSkill('');
  };

  const removeSkill = (skill: string) => {
    setResumeData({ ...resumeData, skills: resumeData.skills.filter(s => s !== skill) });
  };

  const handlePrint = () => {
    const printContent = document.getElementById('karmetra-resume-preview');
    if (!printContent) return;
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(`
        <html>
          <head>
            <title>KarMetra Resume - ${resumeData.fullName}</title>
            <script src="https://cdn.tailwindcss.com"></script>
          </head>
          <body class="p-8 bg-white">
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      win.document.close();
      setTimeout(() => {
        win.print();
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full my-auto shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-base sm:text-lg flex items-center gap-2">
                KarMetra Resume Builder
                <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full">
                  Instant CV Generator
                </span>
              </h2>
              <p className="text-xs text-slate-500">Auto-formatted, recruiter-approved Indian resume format</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-white border border-slate-200 rounded-lg p-1 flex text-xs">
              <button
                onClick={() => setActiveTab('edit')}
                className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                  activeTab === 'edit' ? 'bg-teal-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1. Edit Content
              </button>
              <button
                onClick={() => {
                  if (handleSave()) {
                    setActiveTab('preview');
                  }
                }}
                className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                  activeTab === 'preview' ? 'bg-teal-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                2. Live Preview
              </button>
            </div>

            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {activeTab === 'edit' ? (
            <div className="space-y-5 text-xs">
              {/* Template selector */}
              <div>
                <label className="block font-bold text-slate-700 mb-2">Select Template Design:</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['Modern', 'Professional', 'Simple'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setTemplate(t)}
                      className={`p-3 rounded-xl border text-center font-bold transition-all ${
                        template === t
                          ? 'border-teal-600 bg-teal-50 text-teal-900 ring-2 ring-teal-500/20'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {t} Style
                    </button>
                  ))}
                </div>
              </div>

              {/* Personal Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={resumeData.fullName}
                    onChange={e => {
                      setResumeData({ ...resumeData, fullName: e.target.value });
                      setTouched(prev => ({ ...prev, fullName: true }));
                    }}
                    onBlur={() => setTouched(prev => ({ ...prev, fullName: true }))}
                    className={`w-full p-2.5 bg-slate-50 border rounded-lg outline-hidden ${
                      touched.fullName && errors.fullName ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300 focus:border-teal-500'
                    }`}
                  />
                  <FieldError error={errors.fullName} touched={touched.fullName} />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={resumeData.email}
                    onChange={e => {
                      setResumeData({ ...resumeData, email: e.target.value });
                      setTouched(prev => ({ ...prev, email: true }));
                    }}
                    onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                    className={`w-full p-2.5 bg-slate-50 border rounded-lg outline-hidden ${
                      touched.email && errors.email ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300 focus:border-teal-500'
                    }`}
                  />
                  <FieldError error={errors.email} touched={touched.email} />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    value={resumeData.phone}
                    onChange={e => {
                      setResumeData({ ...resumeData, phone: e.target.value });
                      setTouched(prev => ({ ...prev, phone: true }));
                    }}
                    onBlur={() => setTouched(prev => ({ ...prev, phone: true }))}
                    className={`w-full p-2.5 bg-slate-50 border rounded-lg outline-hidden ${
                      touched.phone && errors.phone ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300 focus:border-teal-500'
                    }`}
                  />
                  <FieldError error={errors.phone} touched={touched.phone} />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City / Location *</label>
                  <input
                    type="text"
                    value={resumeData.location}
                    onChange={e => {
                      setResumeData({ ...resumeData, location: e.target.value });
                      setTouched(prev => ({ ...prev, location: true }));
                    }}
                    onBlur={() => setTouched(prev => ({ ...prev, location: true }))}
                    className={`w-full p-2.5 bg-slate-50 border rounded-lg outline-hidden ${
                      touched.location && errors.location ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300 focus:border-teal-500'
                    }`}
                  />
                  <FieldError error={errors.location} touched={touched.location} />
                </div>
              </div>

              {/* Summary */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Professional Summary *</label>
                <textarea
                  value={resumeData.summary}
                  onChange={e => {
                    setResumeData({ ...resumeData, summary: e.target.value });
                    setTouched(prev => ({ ...prev, summary: true }));
                  }}
                  onBlur={() => setTouched(prev => ({ ...prev, summary: true }))}
                  rows={3}
                  className={`w-full p-2.5 bg-slate-50 border rounded-lg outline-hidden ${
                    touched.summary && errors.summary ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300 focus:border-teal-500'
                  }`}
                />
                <FieldError error={errors.summary} touched={touched.summary} />
              </div>

              {/* Skills */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Skills</label>
                <div className="flex gap-2 mb-1">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={e => {
                      setNewSkill(e.target.value);
                      if (skillError) setSkillError(null);
                    }}
                    placeholder="Add skill (e.g. Sales, Delivery, Excel)..."
                    className={`flex-1 p-2 bg-slate-50 border rounded-lg outline-hidden ${
                      skillError ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300 focus:border-teal-500'
                    }`}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <button type="button" onClick={addSkill} className="px-3 py-2 bg-teal-600 text-white font-bold rounded-lg flex items-center gap-1">
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
                <FieldError error={skillError} touched={true} />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {resumeData.skills.map((skill, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md font-medium flex items-center gap-1 border border-slate-200">
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="text-slate-400 hover:text-rose-600">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Live Preview View */
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-100 p-3 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-700">Format Style: {template}</span>
                <div className="flex gap-2">
                  <button
                    onClick={handlePrint}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs"
                  >
                    <Printer className="w-4 h-4" /> Print / Save as PDF
                  </button>
                </div>
              </div>

              {/* Resume Paper Preview container */}
              <div id="karmetra-resume-preview" className="bg-white border border-slate-300 rounded-lg p-6 sm:p-10 shadow-lg text-slate-800 space-y-6 max-w-3xl mx-auto">
                {/* Header */}
                <div className={`border-b pb-4 ${template === 'Modern' ? 'border-emerald-600' : 'border-slate-300'}`}>
                  <h1 className={`text-2xl font-bold ${template === 'Modern' ? 'text-emerald-800' : 'text-slate-900'}`}>
                    {resumeData.fullName}
                  </h1>
                  <p className="text-xs text-slate-600 mt-1 flex flex-wrap gap-3">
                    <span>📍 {resumeData.location}</span>
                    <span>📞 {resumeData.phone}</span>
                    <span>✉️ {resumeData.email}</span>
                  </p>
                </div>

                {/* Summary */}
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1 mb-2">
                    Professional Summary
                  </h2>
                  <p className="text-xs text-slate-700 leading-relaxed">{resumeData.summary}</p>
                </div>

                {/* Skills */}
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1 mb-2">
                    Core Skills
                  </h2>
                  <div className="flex flex-wrap gap-2 text-xs font-semibold">
                    {resumeData.skills.map((s, i) => (
                      <span key={i} className="bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded border border-slate-200">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Experience */}
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1 mb-2">
                    Work Experience
                  </h2>
                  <div className="space-y-3 text-xs">
                    {resumeData.experience.map((exp, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between font-bold text-slate-900">
                          <span>{exp.title} - {exp.company}</span>
                          <span className="text-slate-500 font-normal">{exp.duration}</span>
                        </div>
                        <p className="text-slate-600 mt-0.5">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1 mb-2">
                    Education
                  </h2>
                  <div className="space-y-2 text-xs">
                    {resumeData.education.map((edu, idx) => (
                      <div key={idx} className="flex justify-between font-semibold text-slate-800">
                        <span>{edu.degree} - {edu.institution}</span>
                        <span className="text-slate-500 font-normal">{edu.year}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer note */}
                <div className="pt-4 border-t border-slate-100 text-[10px] text-slate-400 text-center">
                  Verified Candidate Profile generated on KarMetra Hiring Network
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-between items-center">
          <span className="text-xs text-slate-500">KarMetra Resume Engine v2.4</span>
          <button
            onClick={() => {
              if (handleSave()) {
                onClose();
              }
            }}
            className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-xs"
          >
            Save & Exit
          </button>
        </div>
      </div>
    </div>
  );
};
