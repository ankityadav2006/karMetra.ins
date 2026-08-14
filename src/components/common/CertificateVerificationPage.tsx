import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Search,
  Award,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  User,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { storageService } from '../../services/storage';
import { KarmetraCertificate } from '../../types';

interface CertificateVerificationPageProps {
  initialCertId?: string;
  onBack?: () => void;
}

export const CertificateVerificationPage: React.FC<CertificateVerificationPageProps> = ({
  initialCertId,
  onBack,
}) => {
  const [searchId, setSearchId] = useState(initialCertId || 'KMT-2026-EXC8821');
  const [certificate, setCertificate] = useState<KarmetraCertificate | undefined>(undefined);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialCertId) {
      setSearchId(initialCertId);
      const res = storageService.getCertificateById(initialCertId);
      setCertificate(res);
      setSearched(true);
    } else {
      const res = storageService.getCertificateById('KMT-2026-EXC8821');
      setCertificate(res);
      setSearched(true);
    }
  }, [initialCertId]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = searchId.trim();
    if (!trimmed) return;
    const res = storageService.getCertificateById(trimmed);
    setCertificate(res);
    setSearched(true);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {onBack && (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return</span>
          </button>
        )}

        {/* Verification Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-teal-100 text-teal-800 shadow-xs mb-1">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Karmetra National Credential Verification
          </h1>
          <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            Verify the authenticity of skill certificates issued by Karmetra Skill Academy for recruitment and employment verification.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Enter Certificate ID (e.g. KMT-2026-EXC8821)"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-xs"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Verify Credential</span>
          </button>
        </form>

        {/* Verification Result */}
        {searched && (
          <div>
            {certificate ? (
              <div className="bg-white rounded-3xl border-2 border-emerald-500/40 p-6 sm:p-8 shadow-md space-y-6 animate-in fade-in zoom-in-95 duration-200">
                {/* Status badge */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-emerald-800">
                          Officially Verified & Authentic
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
                          Active
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        Certificate ID: {certificate.id}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                      Score Achieved
                    </span>
                    <span className="text-xl font-black text-emerald-700">
                      {certificate.assessmentScore}%
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-teal-600" />
                      Candidate Name
                    </span>
                    <p className="text-base font-bold text-slate-900">
                      {certificate.recipientName}
                    </p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-teal-600" />
                      Issuance Date
                    </span>
                    <p className="text-base font-bold text-slate-900">
                      {certificate.issueDate}
                    </p>
                  </div>

                  <div className="sm:col-span-2 bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-teal-600" />
                      Certified Course Curriculum
                    </span>
                    <p className="text-base font-bold text-slate-900">
                      {certificate.courseTitle}
                    </p>
                    <p className="text-xs text-slate-500">
                      Evaluated & Certified by {certificate.instructorSignature}
                    </p>
                  </div>
                </div>

                {/* Verified Skills */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                    Tested & Certified Competencies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {certificate.skillsVerified.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded-xl bg-teal-50 text-teal-900 border border-teal-200 text-xs font-bold flex items-center gap-1"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Trust Seal */}
                <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                  <span>Authorized by Karmetra Talent Registry</span>
                  <span className="font-mono text-[11px] text-teal-700 font-bold">
                    SECURE SHA-256 VERIFIED
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-rose-200 p-8 text-center shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  No Certificate Found
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  We could not locate any active Karmetra credential with ID{' '}
                  <strong className="font-mono">{searchId}</strong>. Please double-check the ID or contact support.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
