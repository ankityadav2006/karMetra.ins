import React, { useState } from 'react';
import { X, Check, ShieldCheck, Zap, Sparkles } from 'lucide-react';

interface MockBillingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MockBillingModal: React.FC<MockBillingModalProps> = ({ isOpen, onClose }) => {
  const [selectedPlanMsg, setSelectedPlanMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const plans = [
    {
      name: 'Free Starter',
      price: '₹0',
      period: 'Forever Free',
      badge: 'Active Prototype Plan',
      features: [
        'Up to 3 Active Job Postings',
        'Basic Candidate Search',
        'Standard HireMatch Scoring',
        'Applicant Chat & Messaging',
        'Standard Application Funnel',
      ],
      current: true,
    },
    {
      name: 'Growth Pack',
      price: '₹1,499',
      period: 'per month',
      badge: 'Popular for Startups',
      features: [
        '15 Active Job Postings',
        '🔥 QuickHire Urgent Badging',
        'Unlimited Candidate Search',
        'Full Resume Downloads',
        'Priority HireMatch AI Ranking',
        'Bulk Candidate Import',
      ],
      current: false,
    },
    {
      name: 'Agency Enterprise',
      price: '₹3,999',
      period: 'per month',
      badge: 'Best for Recruiters',
      features: [
        'Unlimited Job Postings',
        'Recruitment Agency Pipeline',
        'Placement Payout Tracking',
        'Dedicated Account Manager',
        'Anti-Fraud Verification Badging',
        'Custom Analytics & CSV Export',
      ],
      current: false,
    },
  ];

  const handleSelectPlan = (planName: string) => {
    setSelectedPlanMsg(`Plan "${planName}" selected! In prototype mode, full features are already active.`);
    setTimeout(() => setSelectedPlanMsg(null), 4000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 relative my-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center max-w-md mx-auto mb-6">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-bold border border-amber-300 mb-2">
            <Zap className="w-3.5 h-3.5 text-amber-700" />
            Payments Coming Soon
          </div>
          <h2 className="text-xl font-bold text-slate-900">KarMetra Plans & Pricing</h2>
          <p className="text-xs text-slate-500 mt-1">
            During this free prototype phase, all plans and features are 100% accessible with mock data.
          </p>
          {selectedPlanMsg && (
            <div className="mt-3 p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl animate-in fade-in">
              ✓ {selectedPlanMsg}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((p, idx) => (
            <div
              key={idx}
              className={`rounded-2xl border p-4 flex flex-col justify-between relative ${
                p.current ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-200 bg-white'
              }`}
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{p.badge}</span>
                <h3 className="font-bold text-slate-900 text-base mt-0.5">{p.name}</h3>
                <div className="mt-2 mb-3">
                  <span className="text-2xl font-black text-slate-900">{p.price}</span>
                  <span className="text-xs text-slate-500 ml-1">{p.period}</span>
                </div>

                <ul className="space-y-2 text-xs text-slate-600 my-3">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleSelectPlan(p.name)}
                className={`w-full py-2 px-3 rounded-xl font-bold text-xs transition-colors mt-3 ${
                  p.current
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                }`}
              >
                {p.current ? 'Current Demo Plan' : 'Select Plan (Demo)'}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Zero credit card required • Built for Indian MSME & Hiring Agencies</span>
        </div>
      </div>
    </div>
  );
};
