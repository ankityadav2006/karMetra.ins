import { Job } from '../types';

export interface FraudCheckResult {
  isFlagged: boolean;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  warnings: string[];
}

export function checkJobForFraud(job: Job): FraudCheckResult {
  const warnings: string[] = [];
  const textToScan = `${job.title} ${job.description} ${job.requirements.join(' ')} ${job.responsibilities.join(' ')}`.toLowerCase();

  // Rule 1: Asking candidates for upfront fees/money
  const feeKeywords = ['registration fee', 'training charge', 'security deposit', 'pay initial amount', 'processing fee', 'pay for interview', 'laptop fee'];
  if (feeKeywords.some(kw => textToScan.includes(kw))) {
    warnings.push('⚠️ Mentions potential upfront fees or training deposits (KarMetra Policy prohibits asking job seekers for money).');
  }

  // Rule 2: Unrealistic salary for job category
  if (job.category === 'Data Entry' || job.category === 'Telecaller') {
    if (job.maxSalary > 120000 && job.minExperience === 0) {
      warnings.push('⚠️ Unusually high salary for entry-level work without prior experience requirement.');
    }
  }

  // Rule 3: Suspicious contact or missing company info
  if (!job.companyName || job.companyName.toLowerCase().includes('unknown') || job.companyName.toLowerCase().includes('private contact')) {
    warnings.push('⚠️ Missing verified company credentials.');
  }

  if (job.description.length < 40) {
    warnings.push('⚠️ Very brief job description with missing details.');
  }

  let riskLevel: 'Low' | 'Medium' | 'High' | 'Critical' = 'Low';
  if (warnings.length >= 3) {
    riskLevel = 'Critical';
  } else if (warnings.length === 2) {
    riskLevel = 'High';
  } else if (warnings.length === 1) {
    riskLevel = 'Medium';
  }

  return {
    isFlagged: warnings.length > 0,
    riskLevel,
    warnings,
  };
}
