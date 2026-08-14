import React, { useState, useEffect, useRef } from 'react';
import {
  Award,
  ShieldCheck,
  Download,
  Share2,
  ExternalLink,
  CheckCircle2,
  Printer,
  Copy,
  Check,
  X,
  QrCode,
  GraduationCap,
  Calendar,
  Linkedin,
  MessageSquare,
  FileCheck,
  Search,
  Eye,
  Info,
  BadgeCheck,
} from 'lucide-react';
import { storageService, subscribeStorage } from '../../services/storage';
import { KarmetraCertificate, User } from '../../types';

interface MyCertificatesPageProps {
  currentUser: User;
  onNavigate?: (tab: string, extraId?: string) => void;
  selectedCertId?: string;
}

export const MyCertificatesPage: React.FC<MyCertificatesPageProps> = ({
  currentUser,
  onNavigate,
  selectedCertId,
}) => {
  const [certificates, setCertificates] = useState<KarmetraCertificate[]>([]);
  const [activeCertificate, setActiveCertificate] = useState<KarmetraCertificate | null>(null);
  const [modalTab, setModalTab] = useState<'certificate' | 'details' | 'share'>('certificate');
  const [copiedLink, setCopiedLink] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = () => {
      const certs = storageService.getUserCertificates(currentUser.id);
      setCertificates(certs);
      if (selectedCertId) {
        const found = certs.find((c) => c.id === selectedCertId);
        if (found) {
          setActiveCertificate(found);
          setModalTab('certificate');
        }
      }
    };
    load();
    const unsub = subscribeStorage(load);
    return () => unsub();
  }, [currentUser.id, selectedCertId]);

  const getVerificationUrl = (certId: string) => {
    return `${window.location.origin}/verify?certId=${certId}`;
  };

  const handleCopyVerificationLink = (certId: string) => {
    const url = getVerificationUrl(certId);
    navigator.clipboard?.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleShareLinkedIn = (cert: KarmetraCertificate) => {
    const courseTitle = cert.courseName || (cert as any).courseTitle || 'Vocational Skill Course';
    const certUrl = cert.verificationUrl || getVerificationUrl(cert.id);
    const linkedInUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(
      courseTitle
    )}&organizationName=${encodeURIComponent(
      'Karmetra Skill Academy'
    )}&issueYear=${new Date(cert.issueDate).getFullYear() || 2026}&issueMonth=${
      (new Date(cert.issueDate).getMonth() || 0) + 1
    }&certUrl=${encodeURIComponent(certUrl)}&certId=${encodeURIComponent(cert.id)}`;

    window.open(linkedInUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareWhatsApp = (cert: KarmetraCertificate) => {
    const courseTitle = cert.courseName || (cert as any).courseTitle || 'Vocational Skill Course';
    const score = cert.scorePercent ?? (cert as any).assessmentScore ?? 85;
    const certUrl = cert.verificationUrl || getVerificationUrl(cert.id);
    const text = `🎉 I have earned my official verified certification in "${courseTitle}" from Karmetra Skill Academy (Score: ${score}%)!\n\nVerify my credential online here:\n${certUrl}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleOpenCertificateModal = (cert: KarmetraCertificate) => {
    setActiveCertificate(cert);
    setModalTab('certificate');
    setCopiedLink(false);
  };

  // Filtered certificates
  const filteredCertificates = certificates.filter((c) => {
    const title = c.courseName || (c as any).courseTitle || '';
    const skills = c.skillsCovered || (c as any).skillsVerified || [];
    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skills.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-80px)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Hero */}
        <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold mb-3">
              <Award className="w-3.5 h-3.5" />
              <span>Karmetra Verified Credential Registry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              My Verified Skill Certificates
            </h1>
            <p className="text-sm text-teal-100/90 mt-2 leading-relaxed">
              Every certificate is backed by real assessment criteria, registered in the Karmetra
              National Skills Ledger, and verifiable online by employers anytime.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate && onNavigate('verify-certificate')}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold flex items-center gap-2 backdrop-blur-xs transition shadow-xs"
            >
              <ShieldCheck className="w-4 h-4 text-teal-300" />
              <span>Public Verification Portal</span>
            </button>
            <button
              onClick={() => onNavigate && onNavigate('learning')}
              className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-2 transition shadow-xs"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Enroll in More Courses</span>
            </button>
          </div>
        </div>

        {/* Stats & Search Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs">
            <span className="font-bold text-slate-800">
              Total Certificates Earned:{' '}
              <strong className="text-teal-700 text-sm">{certificates.length}</strong>
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600">
              Verified Skills Acquired:{' '}
              <strong className="text-emerald-700">
                {
                  Array.from(
                    new Set(
                      certificates.flatMap(
                        (c) => c.skillsCovered || (c as any).skillsVerified || []
                      )
                    )
                  ).length
                }
              </strong>
            </span>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by course, skill, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        {/* Certificate Cards Grid */}
        {filteredCertificates.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs">
            <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">
              {certificates.length === 0
                ? 'No Certificates Earned Yet'
                : 'No Matching Certificates Found'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {certificates.length === 0
                ? 'Complete course modules and pass the final assessment with 70%+ to earn your official authenticated Karmetra certificate.'
                : 'Try adjusting your search criteria.'}
            </p>
            {certificates.length === 0 && (
              <button
                onClick={() => onNavigate && onNavigate('learning')}
                className="mt-4 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-xs inline-flex items-center gap-2"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Explore Free Vocational Courses</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCertificates.map((cert) => {
              const courseTitle = cert.courseName || (cert as any).courseTitle || 'Vocational Skill Course';
              const score = cert.scorePercent ?? (cert as any).assessmentScore ?? 85;
              const skills = cert.skillsCovered || (cert as any).skillsVerified || [];

              return (
                <div
                  key={cert.id}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col group"
                >
                  {/* Visual Header Banner */}
                  <div className="h-36 bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 p-5 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
                      <Award className="w-36 h-36 text-amber-300" />
                    </div>
                    <div className="flex items-center justify-between z-10">
                      <span className="text-[11px] font-mono font-bold text-teal-300 bg-teal-900/60 px-2 py-0.5 rounded border border-teal-700/50">
                        {cert.id}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-xs flex items-center gap-1">
                        <BadgeCheck className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    </div>
                    <div className="z-10">
                      <p className="text-[10px] text-teal-300/80 font-bold uppercase tracking-wider">
                        {cert.certificateType || 'Skill Certificate'}
                      </p>
                      <h4 className="text-sm font-bold text-white line-clamp-1 mt-0.5">
                        {courseTitle}
                      </h4>
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-3 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-1 text-slate-600">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{cert.issueDate}</span>
                      </div>
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                        Score: {score}%
                      </span>
                    </div>

                    {/* Skills tags */}
                    <div className="space-y-1.5 mb-5 mt-auto">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Verified Competencies:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {skills.map((sk: string) => (
                          <span
                            key={sk}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-100 flex items-center gap-1"
                          >
                            <Check className="w-2.5 h-2.5 text-teal-600" />
                            <span>{sk}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                      <button
                        id={`view-cert-btn-${cert.id}`}
                        onClick={() => handleOpenCertificateModal(cert)}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Certificate</span>
                      </button>
                      <button
                        onClick={() => handleShareLinkedIn(cert)}
                        className="p-2.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 transition cursor-pointer"
                        title="Share to LinkedIn"
                      >
                        <Linkedin className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleCopyVerificationLink(cert.id)}
                        className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition cursor-pointer"
                        title="Copy Public Verification Link"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ======================================================== */}
        {/* CERTIFICATE DETAIL MODAL                                 */}
        {/* ======================================================== */}
        {activeCertificate && (
          <div
            id="certificate-detail-modal"
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          >
            <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto max-h-[92vh] flex flex-col border border-slate-200">
              {/* Modal Top Control Bar */}
              <div className="p-4 sm:p-5 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-base font-bold">Certificate Detail</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Authenticated
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono">
                      Credential ID: {activeCertificate.id}
                    </p>
                  </div>
                </div>

                {/* Modal Tabs / Quick Actions */}
                <div className="flex items-center gap-2">
                  <div className="bg-slate-800 p-1 rounded-xl flex items-center gap-1 text-xs">
                    <button
                      onClick={() => setModalTab('certificate')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                        modalTab === 'certificate'
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Certificate View
                    </button>
                    <button
                      onClick={() => setModalTab('details')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                        modalTab === 'details'
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Audit Details
                    </button>
                    <button
                      onClick={() => setModalTab('share')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                        modalTab === 'share'
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Share & Export
                    </button>
                  </div>

                  <button
                    onClick={() => setActiveCertificate(null)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition ml-1 cursor-pointer"
                    title="Close Certificate View"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body Container */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100">
                {/* TAB 1: FULL CERTIFICATE CANVAS */}
                {modalTab === 'certificate' && (
                  <div className="space-y-4">
                    {/* The Printable Certificate Container */}
                    <div
                      ref={certificateRef}
                      id="printable-certificate-canvas"
                      className="bg-white rounded-2xl p-6 sm:p-10 border-4 border-teal-900/20 shadow-md relative overflow-hidden text-slate-900"
                      style={{
                        backgroundImage:
                          'radial-gradient(ellipse at center, rgba(254, 243, 199, 0.25) 0%, rgba(255, 255, 255, 1) 70%)',
                      }}
                    >
                      {/* Decorative Corner Ornaments */}
                      <div className="absolute top-2 left-2 w-12 h-12 border-t-2 border-l-2 border-amber-600/40 pointer-events-none"></div>
                      <div className="absolute top-2 right-2 w-12 h-12 border-t-2 border-r-2 border-amber-600/40 pointer-events-none"></div>
                      <div className="absolute bottom-2 left-2 w-12 h-12 border-b-2 border-l-2 border-amber-600/40 pointer-events-none"></div>
                      <div className="absolute bottom-2 right-2 w-12 h-12 border-b-2 border-r-2 border-amber-600/40 pointer-events-none"></div>

                      {/* Watermark */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                        <Award className="w-[500px] h-[500px] text-teal-950" />
                      </div>

                      {/* Inner Certificate Border */}
                      <div className="border border-teal-800/30 rounded-xl p-5 sm:p-8 text-center space-y-6 relative z-10">
                        {/* Certificate Header Branding */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-5">
                          <div className="flex items-center gap-3 text-left">
                            <div className="w-12 h-12 rounded-2xl bg-teal-700 text-white font-black text-xl flex items-center justify-center shadow-xs border border-teal-600">
                              K
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-teal-950">
                                  KARMETRA SKILL ACADEMY
                                </h2>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                                  Govt Aligned
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 font-semibold tracking-wider uppercase">
                                National Talent & Vocational Assessment Authority
                              </p>
                            </div>
                          </div>

                          <div className="text-center sm:text-right">
                            <div className="text-xs font-mono font-bold text-slate-900 bg-slate-50 px-2.5 py-1 rounded border border-slate-200 inline-block">
                              {activeCertificate.id}
                            </div>
                            <p className="text-[10px] text-emerald-700 font-bold uppercase mt-1 flex items-center justify-center sm:justify-end gap-1">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Verified Credential</span>
                            </p>
                          </div>
                        </div>

                        {/* Certificate Title & Recipient Statement */}
                        <div className="py-2 space-y-2">
                          <span className="text-xs font-black text-amber-700 uppercase tracking-widest px-3 py-1 rounded-full bg-amber-50 border border-amber-200 inline-block">
                            Certificate of Competency & Skill Mastery
                          </span>
                          <p className="text-xs text-slate-500 pt-1">
                            This is officially awarded to
                          </p>
                          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight py-1">
                            {activeCertificate.candidateName ||
                              (activeCertificate as any).recipientName ||
                              currentUser.name}
                          </h1>
                          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed pt-1">
                            for successfully completing the rigorous curriculum, hands-on practical
                            tasks, and achieving an examination score of{' '}
                            <strong className="text-teal-800 font-bold">
                              {activeCertificate.scorePercent ??
                                (activeCertificate as any).assessmentScore ??
                                85}
                              % (Distinction)
                            </strong>{' '}
                            in the vocational program:
                          </p>
                          <div className="pt-2">
                            <h2 className="text-lg sm:text-2xl font-bold text-teal-900 tracking-tight">
                              {activeCertificate.courseName ||
                                (activeCertificate as any).courseTitle}
                            </h2>
                            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                              Karmetra Course Ref: {activeCertificate.courseId}
                            </p>
                          </div>
                        </div>

                        {/* Verified Competencies Block */}
                        <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/90 max-w-xl mx-auto text-center">
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Verified Skills & Workplace Competencies:
                          </div>
                          <div className="flex flex-wrap justify-center gap-1.5">
                            {(
                              activeCertificate.skillsCovered ||
                              (activeCertificate as any).skillsVerified ||
                              []
                            ).map((sk: string) => (
                              <span
                                key={sk}
                                className="px-2.5 py-1 rounded-md bg-teal-50 text-teal-900 text-xs font-bold border border-teal-200 flex items-center gap-1"
                              >
                                <Check className="w-3 h-3 text-teal-600" />
                                <span>{sk}</span>
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Signatures & Security Footer */}
                        <div className="pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 items-center gap-6">
                          {/* Date of Issue */}
                          <div className="text-center sm:text-left space-y-0.5">
                            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                              Date of Issuance
                            </p>
                            <p className="text-sm font-bold text-slate-800">
                              {activeCertificate.issueDate}
                            </p>
                            <p className="text-[10px] text-emerald-700 font-medium">
                              Lifetime Validity
                            </p>
                          </div>

                          {/* Interactive QR Code for Verification */}
                          <div className="flex flex-col items-center justify-center">
                            <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col items-center">
                              <QrCode className="w-12 h-12 text-slate-900" />
                              <span className="text-[9px] font-mono font-bold text-slate-600 mt-1">
                                SCAN TO VERIFY
                              </span>
                            </div>
                          </div>

                          {/* Signature & Seal */}
                          <div className="text-center sm:text-right space-y-0.5">
                            <div className="font-serif italic font-bold text-slate-800 text-base border-b border-slate-300 pb-0.5 inline-block min-w-[140px]">
                              {activeCertificate.instructorName ||
                                (activeCertificate as any).instructorSignature ||
                                'Dr. Rajesh Verma'}
                            </div>
                            <p className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                              {activeCertificate.instructorTitle || 'Lead Assessor & Academic Dean'}
                            </p>
                            <p className="text-[9px] text-slate-500">
                              Karmetra Skill Certification Board
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: AUDIT & METADATA DETAILS */}
                {modalTab === 'details' && (
                  <div className="space-y-4">
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700">
                          <FileCheck className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-slate-900">
                            Cryptographic Audit & Ledger Records
                          </h4>
                          <p className="text-xs text-slate-500">
                            Immutable certification details recorded in the Karmetra National
                            Credential Registry.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                          <span className="text-slate-500 font-semibold">Certificate ID:</span>
                          <p className="font-mono font-bold text-slate-900 text-sm">
                            {activeCertificate.id}
                          </p>
                        </div>

                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                          <span className="text-slate-500 font-semibold">Assessment Score:</span>
                          <p className="font-bold text-emerald-700 text-sm">
                            {activeCertificate.scorePercent ??
                              (activeCertificate as any).assessmentScore ??
                              85}
                            % (Passed & Certified)
                          </p>
                        </div>

                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                          <span className="text-slate-500 font-semibold">Recipient Name:</span>
                          <p className="font-bold text-slate-800 text-sm">
                            {activeCertificate.candidateName ||
                              (activeCertificate as any).recipientName ||
                              currentUser.name}
                          </p>
                        </div>

                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                          <span className="text-slate-500 font-semibold">Issuing Entity:</span>
                          <p className="font-bold text-slate-800 text-sm">
                            Karmetra Skill Academy (India)
                          </p>
                        </div>

                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                          <span className="text-slate-500 font-semibold">
                            Public Verification URL:
                          </span>
                          <p className="font-mono text-teal-700 break-all text-[11px]">
                            {activeCertificate.verificationUrl ||
                              getVerificationUrl(activeCertificate.id)}
                          </p>
                        </div>

                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                          <span className="text-slate-500 font-semibold">
                            Profile Integration:
                          </span>
                          <p className="font-bold text-teal-800 text-sm flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-teal-600" />
                            <span>Linked to Candidate Profile (+25% Match Score)</span>
                          </p>
                        </div>
                      </div>

                      <div className="p-4 bg-teal-50 rounded-xl border border-teal-200 flex items-start gap-3">
                        <Info className="w-5 h-5 text-teal-700 flex-shrink-0 mt-0.5" />
                        <div className="text-xs text-teal-900 space-y-1">
                          <p className="font-bold">Employer Verification Guarantee</p>
                          <p className="text-teal-800">
                            Recruiters and hiring managers can verify this credential instantly
                            without logging in by entering the credential code or scanning the QR code
                            on any device.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: SHARE & EXPORT OPTIONS */}
                {modalTab === 'share' && (
                  <div className="space-y-4">
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700">
                          <Share2 className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-slate-900">
                            Share & Showcase Your Credential
                          </h4>
                          <p className="text-xs text-slate-500">
                            Add this certificate to your LinkedIn profile, send to recruiters, or
                            download high-res copies.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* LinkedIn */}
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                              <Linkedin className="w-5 h-5" />
                            </div>
                            <div>
                              <h5 className="text-xs font-bold text-slate-900">
                                Add to LinkedIn Profile
                              </h5>
                              <p className="text-[11px] text-slate-500">
                                Pre-filled certification badge for your LinkedIn credentials
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleShareLinkedIn(activeCertificate)}
                            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                          >
                            <Linkedin className="w-4 h-4" />
                            <span>Add to LinkedIn</span>
                          </button>
                        </div>

                        {/* WhatsApp */}
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                              <MessageSquare className="w-5 h-5" />
                            </div>
                            <div>
                              <h5 className="text-xs font-bold text-slate-900">
                                Share via WhatsApp
                              </h5>
                              <p className="text-[11px] text-slate-500">
                                Send direct verification card to employers & peers
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleShareWhatsApp(activeCertificate)}
                            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span>Share on WhatsApp</span>
                          </button>
                        </div>

                        {/* Copy Link */}
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-700 text-white flex items-center justify-center">
                              <Copy className="w-5 h-5" />
                            </div>
                            <div>
                              <h5 className="text-xs font-bold text-slate-900">
                                Copy Verification Link
                              </h5>
                              <p className="text-[11px] text-slate-500">
                                Share direct link in your resume or cover letter
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleCopyVerificationLink(activeCertificate.id)}
                            className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                          >
                            {copiedLink ? (
                              <>
                                <Check className="w-4 h-4 text-emerald-400" />
                                <span>Link Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4" />
                                <span>Copy Link</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Public Portal */}
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center">
                              <ExternalLink className="w-5 h-5" />
                            </div>
                            <div>
                              <h5 className="text-xs font-bold text-slate-900">
                                Public Verification Page
                              </h5>
                              <p className="text-[11px] text-slate-500">
                                View as external recruiter or auditor
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              if (onNavigate) {
                                onNavigate('verify-certificate', activeCertificate.id);
                              }
                            }}
                            className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>Open Public Verifier</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Bottom Sticky Actions Toolbar */}
              <div className="p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleCopyVerificationLink(activeCertificate.id)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-700">Verification Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Public Link</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleShareLinkedIn(activeCertificate)}
                    className="hidden sm:flex px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handlePrintCertificate}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                    title="Print or Save PDF"
                  >
                    <Printer className="w-4 h-4 text-slate-500" />
                    <span>Print</span>
                  </button>

                  <button
                    onClick={handleDownloadPDF}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-xs cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Certificate</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
