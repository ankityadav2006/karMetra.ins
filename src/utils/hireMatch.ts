import { CandidateProfile, Job } from '../types';

export interface MatchResult {
  score: number; // 0 to 100
  reasons: { text: string; positive: boolean }[];
  locationMatch: boolean;
  skillsMatch: boolean;
  salaryMatch: boolean;
  experienceMatch: boolean;
  availabilityMatch: boolean;
}

export function calculateHireMatch(candidate: CandidateProfile, job: Job): MatchResult {
  let scorePoints = 0;
  const reasons: { text: string; positive: boolean }[] = [];

  if (!candidate || !job) {
    return {
      score: 50,
      reasons: [],
      locationMatch: false,
      skillsMatch: false,
      salaryMatch: false,
      experienceMatch: false,
      availabilityMatch: false,
    };
  }

  // 1. Location match (25 points)
  let locationMatch = false;
  const candidateLoc = (candidate.location || '').toLowerCase();
  const jobLoc = (job.location || '').toLowerCase();

  if (candidateLoc && jobLoc && (candidateLoc === jobLoc || jobLoc.includes(candidateLoc) || candidateLoc.includes(jobLoc))) {
    scorePoints += 25;
    locationMatch = true;
    reasons.push({ text: `Location match (${job.location})`, positive: true });
  } else if ((candidate.preferredLocations || []).some(pl => jobLoc.includes(pl.toLowerCase()))) {
    scorePoints += 20;
    locationMatch = true;
    reasons.push({ text: `Preferred location match (${job.location})`, positive: true });
  } else {
    reasons.push({ text: `Location distance (${job.location || 'Unknown'})`, positive: false });
  }

  // 2. Skills match (30 points)
  let skillsMatch = false;
  const skillsReq = job.skillsRequired || [];
  const candSkills = candidate.skills || [];
  if (skillsReq.length > 0) {
    const matchedSkills = skillsReq.filter(s =>
      candSkills.some(cs => cs.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(cs.toLowerCase()))
    );
    const matchRatio = matchedSkills.length / skillsReq.length;
    const points = Math.round(matchRatio * 30);
    scorePoints += points;

    if (matchedSkills.length > 0) {
      skillsMatch = true;
      reasons.push({
        text: `Skills match (${matchedSkills.length}/${skillsReq.length}: ${matchedSkills.slice(0, 3).join(', ')})`,
        positive: true,
      });
    } else {
      reasons.push({ text: `Skills gap: Required ${skillsReq.slice(0, 3).join(', ')}`, positive: false });
    }
  } else {
    scorePoints += 25;
    skillsMatch = true;
    reasons.push({ text: 'General skills requirement matched', positive: true });
  }

  // 3. Salary compatibility (20 points)
  let salaryMatch = false;
  const candidateExpSal = candidate.expectedSalary || 0;
  const minSal = job.minSalary || 0;
  const maxSal = job.maxSalary || 0;
  // If candidate salary is within job max or up to 10% above max
  if (candidateExpSal <= maxSal && candidateExpSal >= minSal * 0.8) {
    scorePoints += 20;
    salaryMatch = true;
    reasons.push({ text: `Salary budget aligned (Expected ₹${candidateExpSal.toLocaleString('en-IN')})`, positive: true });
  } else if (candidateExpSal <= maxSal * 1.15) {
    scorePoints += 15;
    salaryMatch = true;
    reasons.push({ text: `Salary slightly flexible`, positive: true });
  } else {
    reasons.push({ text: `Expected salary higher than budget`, positive: false });
  }

  // 4. Experience match (15 points)
  let experienceMatch = false;
  const candExp = candidate.experienceYears || 0;
  const minExp = job.minExperience || 0;
  const maxExp = job.maxExperience || 0;
  if (candExp >= minExp && candExp <= maxExp + 3) {
    scorePoints += 15;
    experienceMatch = true;
    reasons.push({ text: `Experience match (${candExp} yrs fits ${minExp}-${maxExp} yrs)`, positive: true });
  } else if (candExp < minExp) {
    scorePoints += 5;
    reasons.push({ text: `Requires ${minExp}+ yrs experience`, positive: false });
  } else {
    scorePoints += 10;
    experienceMatch = true;
    reasons.push({ text: `Slightly overqualified experience`, positive: true });
  }

  // 5. Availability match (10 points)
  let availabilityMatch = false;
  const noticePeriod = (candidate.noticePeriod || '').toLowerCase();
  if (candidate.availability === 'Immediate' || noticePeriod.includes('immediate')) {
    scorePoints += 10;
    availabilityMatch = true;
    reasons.push({ text: `Immediate joining available`, positive: true });
  } else if (candidate.availability === 'Within 15 Days') {
    scorePoints += 7;
    availabilityMatch = true;
    reasons.push({ text: `Short notice period (${candidate.noticePeriod})`, positive: true });
  } else {
    reasons.push({ text: `Notice period: ${candidate.noticePeriod || 'Standard'}`, positive: false });
  }

  const finalScore = Math.min(100, Math.max(10, scorePoints));

  return {
    score: finalScore,
    reasons,
    locationMatch,
    skillsMatch,
    salaryMatch,
    experienceMatch,
    availabilityMatch,
  };
}
