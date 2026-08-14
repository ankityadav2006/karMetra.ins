import { CandidateProfile } from '../types';

export interface CoachAnswer {
  question: string;
  answer: string;
  suggestions: string[];
}

export function getCareerCoachAdvice(questionKey: string, profile: CandidateProfile): CoachAnswer {
  const q = questionKey.toLowerCase();

  if (q.includes('what jobs should i apply for') || q.includes('jobs for me')) {
    const topSkillsStr = profile.skills.join(', ');
    return {
      question: "What jobs should I apply for?",
      answer: `Based on your profile in ${profile.location} with ${profile.experienceYears} years of experience and core skills in [${topSkillsStr}], you have high match probability for roles in Sales, Customer Support, Office Management, or Field Operations in ${profile.location}.`,
      suggestions: [
        `Filter for '${profile.skills[0] || 'Sales'}' jobs in ${profile.location}`,
        "Look for '🔥 QuickHire' badges for immediate hiring",
        "Target roles with ₹" + profile.expectedSalary.toLocaleString('en-IN') + " salary expectation"
      ]
    };
  }

  if (q.includes('improve my resume') || q.includes('resume tip')) {
    return {
      question: "How can I improve my resume?",
      answer: `Your current profile strength is ${profile.profileStrength}%. To boost it to 100%: 1) Quantify your past experience with numbers (e.g., 'Handled 50+ customer queries daily'), 2) Add at least 5 relevant skills, 3) Ensure your preferred locations match major business hubs near you.`,
      suggestions: [
        "Use KarMetra's built-in Resume Builder to auto-format your CV",
        "Add certifications or specific soft skills like 'Hindi/English Communication'",
        "Upload a clear profile photo to increase recruiter views by 3x"
      ]
    };
  }

  if (q.includes('salary should i expect') || q.includes('salary expectation')) {
    const minEst = Math.max(15000, profile.expectedSalary * 0.9);
    const maxEst = profile.expectedSalary * 1.25;
    return {
      question: "What salary should I expect?",
      answer: `In ${profile.location} for a candidate with ${profile.experienceYears} years in ${profile.title || 'your field'}, market rates range between ₹${Math.round(minEst).toLocaleString('en-IN')} and ₹${Math.round(maxEst).toLocaleString('en-IN')} per month.`,
      suggestions: [
        "Request ₹" + Math.round(profile.expectedSalary * 1.1).toLocaleString('en-IN') + " for roles requiring urgent joining",
        "Highlight 'Immediate Availability' to negotiate higher joining bonuses"
      ]
    };
  }

  // Default response
  return {
    question: "Why am I not getting interviews?",
    answer: `Recruiters prioritize verified candidates who join immediately. Ensure your status is set to 'Immediate Joining' and your profile has '✓ Verified Candidate' status by uploading your work history details.`,
    suggestions: [
      "Apply to jobs posted within the last 24 hours",
      "Send direct recruiter messages after submitting applications",
      "Check QuickHire listings with walk-in interview options"
    ]
  };
}
