import React, { useState } from 'react';
import { Company } from '../../types';
import { storageService } from '../../services/storage';
import { useI18n } from '../../utils/i18n';
import {
  Building,
  ShieldCheck,
  ShieldAlert,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Globe,
  FileCheck,
  Edit2,
  Lock,
  Upload,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface EmployerProfileViewProps {
  company: Company;
}

export const EmployerProfileView: React.FC<EmployerProfileViewProps> = ({ company: initialCompany }) => {
  const { t } = useI18n();
  const [company, setCompany] = useState<Company>(initialCompany);
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    contactPerson: company.contactPerson || 'Neha Sharma',
    designation: company.designation || 'HR Manager',
    companyPhone: company.companyPhone || '+91 98111 22334',
    companyEmail: company.companyEmail || 'hr@company.in',
    name: company.name,
    industry: company.industry,
    employeeCount: company.employeeCount,
    location: company.location,
    registeredAddress: company.registeredAddress || 'Mumbai, Maharashtra',
    website: company.website || 'https://www.company.in',
    about: company.about,
    gstin: company.gstin || '27AAAAA0000A1Z5',
    pan: company.pan || 'AAAPA1234F',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Company = {
      ...company,
      contactPerson: form.contactPerson,
      designation: form.designation,
      companyPhone: form.companyPhone,
      companyEmail: form.companyEmail,
      name: form.name,
      industry: form.industry,
      employeeCount: form.employeeCount,
      location: form.location,
      registeredAddress: form.registeredAddress,
      website: form.website,
      about: form.about,
      gstin: form.gstin,
      pan: form.pan,
    };
    setCompany(updated);
    storageService.updateCompanyVerification(updated.id, updated);
    setIsEditing(false);
  };

  const isVerified = company.isVerified && company.verificationStatus === 'Verified';
  const isPending = !isVerified && company.verificationStatus !== 'Rejected';

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* HEADER CARD */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-teal-600 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-lg border-2 border-teal-400">
              {company.logo || company.name.charAt(0)}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-black text-white">{company.name}</h1>
                <span className="bg-teal-500/20 text-teal-300 font-extrabold px-3 py-0.5 rounded-full text-xs border border-teal-400/30">
                  {company.karmetraId}
                </span>
              </div>
              <p className="text-sm text-teal-200/90 font-medium">
                {company.industry} • {company.employeeCount} Employees
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-300 pt-1">
                <MapPin className="w-3.5 h-3.5 text-teal-400" />
                {company.location}
              </div>
            </div>
          </div>

          {/* VERIFICATION BADGE */}
          <div>
            {isVerified ? (
              <div className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 px-4 py-2.5 rounded-2xl flex items-center gap-2 font-black text-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                ✓ {t('admin.verifiedEmployer')}
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
            <Building className="w-5 h-5 text-teal-700" />
            {t('profile.companyInformation')}
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
                <User className="w-4 h-4 text-teal-700" /> Authorized Contact Person
              </h3>
              <div>
                <p className="text-slate-500 text-[10px] uppercase font-bold">{t('profile.fullName')}</p>
                <p className="font-bold text-slate-900">{company.contactPerson}</p>
              </div>
              <div>
                <p className="text-slate-500 text-[10px] uppercase font-bold">{t('profile.currentJobTitle')}</p>
                <p className="font-bold text-slate-800">{company.designation}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <p className="text-slate-500 text-[10px] uppercase font-bold">{t('profile.contactInformation')}</p>
                  <p className="font-bold text-slate-800">{company.companyPhone}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-[10px] uppercase font-bold">Email</p>
                  <p className="font-bold text-slate-800">{company.companyEmail}</p>
                </div>
              </div>
            </div>

            {/* Company Info */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <h3 className="font-extrabold text-teal-900 flex items-center gap-1.5 text-sm">
                <Building className="w-4 h-4 text-teal-700" /> Business Details
              </h3>
              <div>
                <p className="text-slate-500 text-[10px] uppercase font-bold">{t('profile.companyName')}</p>
                <p className="font-bold text-slate-900">{company.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-slate-500 text-[10px] uppercase font-bold">Industry</p>
                  <p className="font-bold text-slate-800">{company.industry}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-[10px] uppercase font-bold">Employees</p>
                  <p className="font-bold text-slate-800">{company.employeeCount}</p>
                </div>
              </div>
              <div>
                <p className="text-slate-500 text-[10px] uppercase font-bold">Registered Address</p>
                <p className="font-bold text-slate-800">{company.registeredAddress}</p>
              </div>
              <div>
                <p className="text-slate-500 text-[10px] uppercase font-bold">Website</p>
                <a href={company.website} target="_blank" rel="noreferrer" className="font-bold text-teal-700 hover:underline">
                  {company.website}
                </a>
              </div>
            </div>

            {/* About Company */}
            <div className="md:col-span-2 space-y-1">
              <p className="text-slate-500 text-[10px] uppercase font-bold">About Company</p>
              <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                {company.about}
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Contact Person Name</label>
              <input
                type="text"
                value={form.contactPerson}
                onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
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
              <label className="block font-bold text-slate-700 mb-1">Mobile Phone</label>
              <input
                type="text"
                value={form.companyPhone}
                onChange={(e) => setForm({ ...form, companyPhone: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Official Email</label>
              <input
                type="email"
                value={form.companyEmail}
                onChange={(e) => setForm({ ...form, companyEmail: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Company Legal Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Industry</label>
              <input
                type="text"
                value={form.industry}
                onChange={(e) => setForm({ ...form, industry: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Registered Address</label>
              <input
                type="text"
                value={form.registeredAddress}
                onChange={(e) => setForm({ ...form, registeredAddress: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">About Company</label>
              <textarea
                rows={3}
                value={form.about}
                onChange={(e) => setForm({ ...form, about: e.target.value })}
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

      {/* VERIFICATION & COMPLIANCE DOCUMENTS */}
      <div className="bg-white rounded-3xl border border-teal-200 p-6 shadow-xs space-y-4">
        <h3 className="font-extrabold text-base text-teal-950 flex items-center gap-2 border-b border-teal-100 pb-3">
          <FileCheck className="w-5 h-5 text-teal-700" />
          {t('verification.legalComplianceDocs')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-extrabold text-slate-900">GSTIN Certificate</span>
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
              GSTIN: <span className="font-bold">{company.gstin ? `${company.gstin.slice(0, 4)}****${company.gstin.slice(-3)}` : '27AA****1Z5'}</span>
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-extrabold text-slate-900">Company PAN Card</span>
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
              PAN: <span className="font-bold">{company.pan ? `${company.pan.slice(0, 2)}****${company.pan.slice(-2)}` : 'AA****4F'}</span>
            </p>
          </div>
        </div>

        <div className="bg-teal-50/60 border border-teal-200 p-4 rounded-2xl flex items-start gap-3 text-xs text-teal-900">
          <Lock className="w-5 h-5 text-teal-700 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Privacy & Security Note:</strong> Tax certificates and sensitive company registration files are strictly protected. They are reviewed exclusively by KarMetra Platform Admins for verification and are never publicly downloadable by candidates or external parties.
          </p>
        </div>
      </div>
    </div>
  );
};
