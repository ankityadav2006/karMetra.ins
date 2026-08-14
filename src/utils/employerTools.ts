export interface GeneratedJD {
  title: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
}

export function generateEmployerJD(jobTitle: string, category: string, location: string): GeneratedJD {
  return {
    title: jobTitle,
    description: `We are looking for a energetic and dedicated ${jobTitle} to join our team in ${location}. You will play a pivotal role in maintaining high operational standards and delivering outstanding results.`,
    responsibilities: [
      `Manage day-to-day ${jobTitle} tasks efficiently in ${location}`,
      "Maintain clear communication with team members and customers",
      "Follow company safety and compliance guidelines",
      "Achieve target key performance metrics consistently"
    ],
    requirements: [
      `Minimum 6 months to 2 years relevant experience in ${category}`,
      "Good verbal communication skills in Hindi and local language",
      "Punctual, reliable, and ready to work in team environment",
      "Relevant educational background or vocational certificate"
    ],
    benefits: [
      "Competitive monthly payout + performance incentives",
      "Health insurance & Provident Fund (PF) coverage",
      "Overtime pay & attendance allowance",
      "Clear career progression to Supervisor/Team Lead"
    ]
  };
}

export function generateInterviewQuestions(jobTitle: string, category: string): string[] {
  return [
    `Tell us about your past experience as a ${jobTitle}. What were your primary daily duties?`,
    "How do you manage high-workload situations or difficult customer interactions?",
    "Are you comfortable working in rotational shifts or weekend duties if required?",
    `What key skills make you stand out for this ${category} position?`,
    "How quickly can you join if selected for this position?"
  ];
}
