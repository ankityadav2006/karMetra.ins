import React, { useState } from 'react';
import { Job } from '../../types';
import { checkJobForFraud } from '../../utils/fraudDetection';
import { storageService } from '../../services/storage';
import { ShieldAlert, AlertTriangle, Flag, X, CheckCircle2 } from 'lucide-react';

interface AntiFraudBannerProps {
  job: Job;
  onReportSuccess?: () => void;
}

export const AntiFraudBanner: React.FC<AntiFraudBannerProps> = ({ job, onReportSuccess }) => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState('Asking candidates for money');
  const [details, setDetails] = useState('');
  const [reported, setReported] = useState(false);

  const fraudCheck = checkJobForFraud(job);

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.reportJobFraud(job.id, job.title, job.companyName, selectedReason, details);
    setReported(true);
    setTimeout(() => {
      setShowReportModal(false);
      if (onReportSuccess) onReportSuccess();
    }, 1500);
  };

  return (
    <>
      {/* Risk Warning Box if flagged or for general safety tip */}
      {fraudCheck.isFlagged ? (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 mb-4 text-xs text-amber-900 flex items-start justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <span>⚠️ KarMetra Safety Alert</span>
                <span className="text-[10px] bg-amber-200 text-amber-900 font-semibold px-1.5 py-0.2 rounded">
                  Demo Anti-Fraud System
                </span>
              </div>
              <ul className="mt-1 space-y-1 list-disc list-inside text-amber-800">
                {fraudCheck.warnings.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
              <p className="mt-1.5 text-[11px] text-amber-700 font-medium">
                Remember: KarMetra verified employers NEVER ask job seekers for money, laptop fees, or training charges.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowReportModal(true)}
            className="px-2.5 py-1.5 bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold rounded-lg text-xs shrink-0 flex items-center gap-1 transition-colors"
          >
            <Flag className="w-3.5 h-3.5" />
            Report
          </button>
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-4 text-xs text-slate-600 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-teal-600" />
            <span>KarMetra Trust Guarantee: Report any employer asking for money or fees.</span>
          </div>
          <button
            onClick={() => setShowReportModal(true)}
            className="text-slate-500 hover:text-rose-600 font-semibold flex items-center gap-1 hover:underline text-xs"
          >
            <Flag className="w-3.5 h-3.5" />
            Report Job
          </button>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 relative animate-in fade-in zoom-in duration-150">
            <button
              onClick={() => setShowReportModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-rose-600 font-bold text-lg mb-1">
              <Flag className="w-5 h-5" />
              Report This Job Posting
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Help us keep KarMetra 100% safe. Your report will be reviewed by KarMetra Trust & Safety Admin team immediately.
            </p>

            {reported ? (
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-center text-teal-800 text-xs font-semibold space-y-2">
                <CheckCircle2 className="w-8 h-8 text-teal-600 mx-auto" />
                <p>Report Submitted Successfully!</p>
                <p className="text-[11px] text-teal-700 font-normal">
                  Thank you for keeping KarMetra safe. Our anti-fraud system is investigating this job.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Reason for reporting:</label>
                  <select
                    value={selectedReason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    <option value="Asking candidates for money">Asking candidates for money / training fee</option>
                    <option value="Fake job listing">Fake job or deceptive company</option>
                    <option value="Incorrect information">Incorrect salary or location details</option>
                    <option value="Spam / Marketing">Spam or unwanted promotion</option>
                    <option value="Suspicious employer contact">Suspicious contact details</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Additional details (Optional):</label>
                  <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Provide details (e.g. Recruiter asked for ₹1,500 over WhatsApp)..."
                    rows={3}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg shadow-xs"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
