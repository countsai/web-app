import { CandidateProfile, Job } from "./types";

// ─── Shared helpers ─────────────────────────────────────────────────────────

export function profileToText(profile: CandidateProfile): string {
  const lines: string[] = [];

  if (profile.headline) lines.push(`Headline: ${profile.headline}`);
  if (profile.summary) lines.push(`Summary: ${profile.summary}`);
  if (profile.skills.length) lines.push(`Skills: ${profile.skills.join(", ")}`);
  if (profile.target_roles.length) lines.push(`Target roles: ${profile.target_roles.join(", ")}`);
  if (profile.preferred_locations.length) lines.push(`Preferred locations: ${profile.preferred_locations.join(", ")}`);

  if (profile.experience.length) {
    lines.push("Experience:");
    for (const exp of profile.experience) {
      const period = `${exp.start_date || "?"} – ${exp.current ? "Present" : exp.end_date || "?"}`;
      lines.push(`- ${exp.title} at ${exp.company} (${exp.location}), ${period}: ${exp.description}`);
    }
  }

  if (profile.education.length) {
    lines.push("Education:");
    for (const ed of profile.education) {
      lines.push(`- ${ed.degree} in ${ed.field}, ${ed.school} (${ed.start_date} – ${ed.end_date})`);
    }
  }

  if (profile.certifications.length) {
    lines.push("Certifications:");
    for (const c of profile.certifications) {
      lines.push(`- ${c.name} (${c.issuer}, ${c.date})`);
    }
  }

  return lines.join("\n");
}

function jobToText(job: Job): string {
  return [
    `Title: ${job.title}`,
    `Company: ${job.company_name}`,
    `Location: ${job.location} (${job.remote_type})`,
    `Salary: ${job.currency} ${job.salary_min}–${job.salary_max}`,
    `Description: ${job.description}`,
    `Requirements: ${job.requirements.join("; ")}`,
    `Skills required: ${job.skills_required.join(", ")}`,
  ].join("\n");
}

// ─── Resume Score ───────────────────────────────────────────────────────────

export interface ResumeScoreResult {
  score: number;
  breakdown: {
    keyword_match: number;
    ats_formatting: number;
    impact: number;
    skills_alignment: number;
  };
  strengths: string[];
  improvements: { area: string; issue: string; suggestion: string }[];
}

export const resumeScoreSchema = {
  type: "object",
  properties: {
    score: { type: "number" },
    breakdown: {
      type: "object",
      properties: {
        keyword_match: { type: "number" },
        ats_formatting: { type: "number" },
        impact: { type: "number" },
        skills_alignment: { type: "number" },
      },
      required: ["keyword_match", "ats_formatting", "impact", "skills_alignment"],
    },
    strengths: { type: "array", items: { type: "string" } },
    improvements: {
      type: "array",
      items: {
        type: "object",
        properties: {
          area: { type: "string" },
          issue: { type: "string" },
          suggestion: { type: "string" },
        },
        required: ["area", "issue", "suggestion"],
      },
    },
  },
  required: ["score", "breakdown", "strengths", "improvements"],
};

export function buildResumeScorePrompt(profile: CandidateProfile): string {
  return `You are an expert ATS resume reviewer and career coach. Evaluate the candidate's profile below.

${profileToText(profile)}

Score the profile from 0-100 overall, and 0-100 for each of: keyword_match (alignment with the candidate's own target roles/skills), ats_formatting (clarity, structure, presence of quantifiable detail), impact (use of measurable achievements vs. generic duties), and skills_alignment (breadth/depth of listed skills vs. target roles).
List 2-4 genuine strengths.
List 2-5 concrete improvements, each with an "area" (e.g. "Summary", "Experience: Job Title at Company"), the "issue", and an actionable "suggestion".
Be specific and reference the candidate's actual content. Respond only with JSON matching the schema.`;
}

// ─── Improve / Auto-Fix a field ────────────────────────────────────────────

export interface ImproveResult {
  improved: string;
  rationale: string;
}

export const improveSchema = {
  type: "object",
  properties: {
    improved: { type: "string" },
    rationale: { type: "string" },
  },
  required: ["improved", "rationale"],
};

export function buildImprovePrompt(profile: CandidateProfile, fieldLabel: string, currentText: string): string {
  return `You are an expert resume writer. Rewrite the following section of a candidate's profile to be more impactful, specific, and ATS-friendly. Keep it truthful — do not invent facts, companies, or numbers that aren't implied by the original text. Keep roughly the same length.

Candidate context:
${profileToText(profile)}

Section to rewrite: "${fieldLabel}"
Current text:
"""
${currentText}
"""

Return the rewritten text in "improved", and a one-sentence "rationale" explaining what changed and why. Respond only with JSON matching the schema.`;
}

// ─── Career Roadmap ─────────────────────────────────────────────────────────

export interface CareerRoadmapResult {
  current_level: string;
  target_role: string;
  summary: string;
  phases: {
    title: string;
    duration: string;
    focus: string;
    skills: string[];
    actions: string[];
  }[];
}

export const careerRoadmapSchema = {
  type: "object",
  properties: {
    current_level: { type: "string" },
    target_role: { type: "string" },
    summary: { type: "string" },
    phases: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          duration: { type: "string" },
          focus: { type: "string" },
          skills: { type: "array", items: { type: "string" } },
          actions: { type: "array", items: { type: "string" } },
        },
        required: ["title", "duration", "focus", "skills", "actions"],
      },
    },
  },
  required: ["current_level", "target_role", "summary", "phases"],
};

export function buildCareerRoadmapPrompt(profile: CandidateProfile): string {
  return `You are a career coach specialising in the AI industry. Based on the candidate's profile below, build a personalised, phased roadmap from their current level to their stated target role(s).

${profileToText(profile)}

Identify their "current_level" (a short job-title-like description of where they are now) and the primary "target_role" (pick the most ambitious realistic one from their target roles, or infer a sensible next step if none given).
Write a 1-2 sentence "summary" of the overall plan.
Produce 3-4 sequential "phases" (e.g. "Foundations (0-3 months)", "Build Proof of Work (3-6 months)", "Land the Role (6-12 months)"). For each phase give a "duration", a one-sentence "focus", 2-4 "skills" to develop, and 2-4 concrete "actions".
Respond only with JSON matching the schema.`;
}

// ─── AI-Matched Jobs ────────────────────────────────────────────────────────

export interface JobMatchResult {
  matches: {
    job_id: string;
    score: number;
    summary: string;
    matching_skills: string[];
    missing_skills: string[];
  }[];
}

export const jobMatchSchema = {
  type: "object",
  properties: {
    matches: {
      type: "array",
      items: {
        type: "object",
        properties: {
          job_id: { type: "string" },
          score: { type: "number" },
          summary: { type: "string" },
          matching_skills: { type: "array", items: { type: "string" } },
          missing_skills: { type: "array", items: { type: "string" } },
        },
        required: ["job_id", "score", "summary", "matching_skills", "missing_skills"],
      },
    },
  },
  required: ["matches"],
};

export function buildJobMatchPrompt(profile: CandidateProfile, jobs: Job[]): string {
  const jobsText = jobs.map((j) => `Job ID: ${j.id}\n${jobToText(j)}`).join("\n\n");
  return `You are an AI job-matching engine. Compare the candidate's profile against each job listing and score how well they match from 0-100.

Candidate profile:
${profileToText(profile)}

Job listings:
${jobsText}

For each job, return its "job_id" (exactly as given), a "score" (0-100), a 1-2 sentence "summary" of the fit, a list of "matching_skills" the candidate already has that the job wants, and a list of "missing_skills" the job wants that the candidate doesn't list. Respond only with JSON matching the schema, with one entry per job listing provided.`;
}

// ─── Cover Letter ───────────────────────────────────────────────────────────

export interface CoverLetterResult {
  letter: string;
}

export const coverLetterSchema = {
  type: "object",
  properties: {
    letter: { type: "string" },
  },
  required: ["letter"],
};

export function buildCoverLetterPrompt(profile: CandidateProfile, job: Job): string {
  return `Write a tailored, ATS-friendly cover letter for the candidate below, applying for the job described. Keep it concise (3-4 short paragraphs), professional, and specific — reference real details from the candidate's experience and the job's requirements. Do not invent facts. Do not include a date or postal address header; start directly with a greeting.

Candidate profile:
${profileToText(profile)}

Job:
${jobToText(job)}

Return the full letter text in "letter". Respond only with JSON matching the schema.`;
}

// ─── Recruiter Outreach ─────────────────────────────────────────────────────

export interface OutreachResult {
  subject: string;
  message: string;
}

export const outreachSchema = {
  type: "object",
  properties: {
    subject: { type: "string" },
    message: { type: "string" },
  },
  required: ["subject", "message"],
};

export function buildOutreachPrompt(profile: CandidateProfile, job: Job): string {
  return `Write a short, friendly, professional outreach message (and subject line) from the candidate to a hiring manager or recruiter at the company below, expressing interest in the role. Keep the message under 120 words, conversational but professional, and specific to the candidate's background and the role. Do not invent facts.

Candidate profile:
${profileToText(profile)}

Role they're reaching out about:
${jobToText(job)}

Return "subject" (short email subject line) and "message" (the outreach message body). Respond only with JSON matching the schema.`;
}
