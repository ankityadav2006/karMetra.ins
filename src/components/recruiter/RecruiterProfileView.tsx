import React, { useState } from 'react';
import { RecruiterProfile } from '../../types';
import { storageService } from '../../services/storage';
import { useI18n } from '../../utils/i18n';
import {
  Users,
  ShieldCheck,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Globe,
  FileCheck,
  Edit2,
  Lock,
  Briefcase,
  AlertCircle,
} from 'lucide-react';

interface RecruiterProfileViewProps {
  profile: RecruiterProfile;
}

export const RecruiterProfileView: React.FC<RecruiterProfileViewProps> = ({ profile: initialProfile }) => {
  const { t } = useI18n();
  const [profile, setProfile] = useState<RecruiterProfile>(initialProfile);
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    recruiterName: profile.recruiterName,
    designation: profile.designation || 'Senior Recruiter',
    contactNumber: profile.contactNumber,
    businessEmail: profile.businessEmail,
    agencyLegalName: profile.agencyLegalName,
    agencyType: profile.agencyType || 'Staffing & Manpower Agency',
    agencyExperience: profile.agencyExperience,
    officeAddress: profile.officeAddress,
    registeredAddress: profile.registeredAddress,
    website: profile.website || 'https://www.agency.in',
    about: profile.about || 'Authorized staffing agency on KarMetra.',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: RecruiterProfile = {
      ...profile,
      recruiterName: form.recruiterName,
      designation: form.designation,
      contactNumber: form.contactNumber,
      businessEmail: form.businessEmail,
      agencyLegalName: form.agencyLegalName,
      agencyType: form.agencyType,
      agencyExperience: form.agencyExperience,
      officeAddress: form.officeAddress,
      registeredAddress: form.registeredAddress,
      website: form.website,
      about: form.about,
    };
    setProfile(updated);
    storageService.updateRecruiterVerification(updated);
    setIsEditing(false);
  };

  const isVerified = profile.isVerified && (profile.verificationStatus === 'Verified' || profile.verificationStatus === 'Approved');
  const isPending = !isVerified && profile.verificationStatus !== 'Rejected';

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* HEADER CARD */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-teal-600 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-lg border-2 border-teal-400">
              <Users className="w-10 h-10 text-white" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-black text-white">{profile.agencyLegalName}</h1>
                <span className="bg-teal-500/20 text-teal-300 font-extrabold px-3 py-0.5 rounded-full text-xs border border-teal-400/30">
                  {profile.karmetraId}
                </span>
              </div>
              <p className="text-sm text-teal-200/90 font-medium">
                {profile.recruiterName} ({profile.designation}) • {profile.agencyExperience} Experience
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-300 pt-1">
                <MapPin className="w-3.5 h-3.5 text-teal-400" />
                {profile.officeAddress}
              </div>
            </div>
          </div>

          {/* VERIFICATION BADGE */}
          <div>
            {isVerified ? (
              <div className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 px-4 py-2.5 rounded-2xl flex items-center gap-2 font-black text-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                ✓ {t('admin.verifiedRecruiter')}
              </div>
            ) : isPending ? (
              <div className="bg-amber-500/20 border border-amber-400/40 text-amber-300 px-4 py-2.5 rounded-2xl flex items-center gap-2 font-bold text-xs">
                <Clock className="w-4 h-4 text-amber-400" />
                {t('verification.pendingApprovalNotice')}
              </div>
            ) : (
              <div className="bg-red-500/20 border border-red-400/40 text-red-300 px-4 py-2.5 rounded-2xl flex items-center gap-2 font-bold text-xs">
                <AlertCircle className="w-4 h-4 text-red-400" />
                Verification Rejected
              </div>
            )}
          </div>
        </div>
      </div>

      {/* EDIT & VIEW FORM */}
      <div className="bg-white rounded-3xl border border-teal-200 p-6 shadow-xs space-y-6">
        <div className="flex justify-between items-center border-b border-teal-100 pb-4">
          <h2 className="font-extrabold text-base text-teal-950 flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-700" />
            Agency & Recruiter Information
          </h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-bold text-xs rounded-xl flex items-center gap-1.5"
          >
            <Edit2 className="w-4 h-4" />
            {isEditing ? t('buttons.cancel') : t('buttons.edit')}
          </button>
        </div>

        {!isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Person Info */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <h3 className="font-extrabold text-teal-900 flex items-center gap-1.5 text-sm">
                <User className="w-4 h-4 text-teal-700" /> Authorized Recruiter Lead
              </h3>
              <div>
                <p className="text-slate-500 text-[10px] uppercase font-bold">{t('profile.fullName')}</p>
                <p className="font-bold text-slate-900">{profile.recruiterName}</p>
              </div>
              <div>
                <p className="text-slate-500 text-[10px] uppercase font-bold">{t('profile.currentJobTitle')}</p>
                <p className="font-bold text-slate-800">{profile.designation}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <p className="text-slate-500 text-[10px] uppercase font-bold">Contact Number</p>
                  <p className="font-bold text-slate-800">{profile.contactNumber}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-[10px] uppercase font-bold">Business Email</p>
                  <p className="font-bold text-slate-800">{profile.businessEmail}</p>
                </div>
              </div>
            </div>

            {/* Agency Info */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <h3 className="font-extrabold text-teal-900 flex items-center gap-1.5 text-sm">
                <Briefcase className="w-4 h-4 text-teal-700" /> Agency Details
              </h3>
              <div>
                <p className="text-slate-500 text-[10px] uppercase font-bold">Agency Legal Name</p>
                <p className="font-bold text-slate-900">{profile.agencyLegalName}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-slate-500 text-[10px] uppercase font-bold">Agency Type</p>
                  <p className="font-bold text-slate-800">{profile.agencyType}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-[10px] uppercase font-bold">Experience</p>
                  <p className="font-bold text-slate-800">{profile.agencyExperience}</p>
                </div>
              </div>
              <div>
                <p className="text-slate-500 text-[10px] uppercase font-bold">Office Address</p>
                <p className="font-bold text-slate-800">{profile.officeAddress}</p>
              </div>
              <div>
                <p className="text-slate-500 text-[10px] uppercase font-bold">Locations Served</p>
                <p className="font-bold text-slate-800">{(profile.locationsServed || []).join(', ')}</p>
              </div>
            </div>

            {/* About & Specialization */}
            <div className="md:col-span-2 space-y-3">
              <div>
                <p className="text-slate-500 text-[10px] uppercase font-bold mb-1">Categories Served</p>
                <div className="flex gap-2 flex-wrap">
                  {(profile.recruitmentCategories || []).map((cat, i) => (
                    <span key={i} className="bg-teal-50 border border-teal-200 text-teal-900 font-bold px-3 py-1 rounded-full text-xs">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-slate-500 text-[10px] uppercase font-bold mb-1">About Agency</p>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  {profile.about}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Recruiter Name</label>
              <input
                type="text"
                value={form.recruiterName}
                onChange={(e) => setForm({ ...form, recruiterName: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Position / Designation</label>
              <input
                type="text"
                value={form.designation}
                onChange={(e) => setForm({ ...form, designation: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Contact Number</label>
              <input
                type="text"
                value={form.contactNumber}
                onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Business Email</label>
              <input
                type="email"
                value={form.businessEmail}
                onChange={(e) => setForm({ ...form, businessEmail: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Agency Legal Name</label>
              <input
                type="text"
                value={form.agencyLegalName}
                onChange={(e) => setForm({ ...form, agencyLegalName: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Agency Type</label>
              <input
                type="text"
                value={form.agencyType}
                onChange={(e) => setForm({ ...form, agencyType: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Office Address</label>
              <input
                type="text"
                value={form.officeAddress}
                onChange={(e) => setForm({ ...form, officeAddress: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl"
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 font-bold rounded-xl text-slate-700"
              >
                {t('buttons.cancel')}
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl shadow-md"
              >
                {t('buttons.saveChanges')}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* VERIFICATION & DOCUMENTS */}
      <div className="bg-white rounded-3xl border border-teal-200 p-6 shadow-xs space-y-4">
        <h3 className="font-extrabold text-base text-teal-950 flex items-center gap-2 border-b border-teal-100 pb-3">
          <FileCheck className="w-5 h-5 text-teal-700" />
          {t('verification.legalComplianceDocs')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-extrabold text-slate-900">Agency PAN Card</span>
              {isVerified ? (
                <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
                  Verified ✓
                </span>
              ) : (
                <span className="text-amber-700 font-bold bg-amber-100 px-2 py-0.5 rounded text-[10px]">
                  Pending Review
                </span>
              )}
            </div>
            <p className="text-slate-600 font-medium">
              PAN: <span className="font-bold">{profile.pan ? `${profile.pan.slice(0, 2)}****${profile.pan.slice(-2)}` : 'AA****4K'}</span>
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-extrabold text-slate-900">GSTIN / Registration</span>
              {isVerified ? (
                <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
                  Verified ✓
                </span>
              ) : (
                <span className="text-amber-700 font-bold bg-amber-100 px-2 py-0.5 rounded text-[10px]">
                  Pending Review
                </span>
              )}
            </div>
            <p className="text-slate-600 font-medium">
              GSTIN: <span className="font-bold">{profile.gstin ? `${profile.gstin.slice(0, 4)}****${profile.gstin.slice(-3)}` : '27AA****1ZM'}</span>
            </p>
          </div>
        </div>

        <div className="bg-teal-50/60 border border-teal-200 p-4 rounded-2xl flex items-start gap-3 text-xs text-teal-900">
          <Lock className="w-5 h-5 text-teal-700 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Agency Privacy:</strong> Registered agency compliance documents are strictly maintained for platform verification purposes only and are never disclosed publicly.
          </p>
        </div>
      </div>
    </div>
  );
};
