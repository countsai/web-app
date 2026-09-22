export type UserRole = 'jobseeker' | 'employer' | 'admin';
export type SubscriptionTier = 'free' | 'pro' | 'enterprise';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship';
export type ApplicationStatus = 'saved' | 'applied' | 'screening' | 'interview' | 'offer' | 'rejected';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type SkillCategory = 'technical' | 'soft' | 'ai-specific';

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  headline?: string;
  bio?: string;
  role: UserRole;
  subscription_tier: SubscriptionTier;
  ai_risk_score: number;
  profile_completeness: number;
  company_id?: string; // For Employers
  github_url?: string;
  huggingface_url?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  logo_url: string;
  description: string;
  website: string;
  location: string;
  industry: string;
  size: string;
  culture_notes?: string;
  is_verified: boolean;
  created_at: string;
}

export interface Job {
  id: string;
  title: string;
  company_id: string;
  company_name: string; // Denormalized for convenience
  company_logo?: string;
  location: string;
  remote_type: 'remote' | 'hybrid' | 'on-site';
  salary_min: number;
  salary_max: number;
  currency: string;
  description: string;
  requirements: string[];
  skills_required: string[];
  ai_impact_level: 'low' | 'medium' | 'high';
  job_type: JobType;
  category: string;
  posted_at: string;
  expires_at?: string;
  is_active: boolean;
  status: 'pending' | 'approved' | 'rejected'; // For Admin review
  employer_id: string;
}

export interface Application {
  id: string;
  user_id: string;
  job_id: string;
  status: ApplicationStatus;
  cover_letter?: string;
  resume_url?: string;
  ai_match_score: number;
  match_summary?: string;
  notes?: string;
  applied_at: string;
  updated_at: string;
  job?: Job;
  candidate?: User;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface VisaGuide {
  id: string;
  country: string;
  title: string;
  content: string;
  visa_type: string;
  last_updated: string;
}

export interface PlatformAnalytics {
  total_users: number;
  active_jobs: number;
  total_applications: number;
  growth_rate: number;
  popular_skills: string[];
}


export interface Skill {
  id: string;
  user_id: string;
  name: string;
  level: SkillLevel;
  category: SkillCategory;
  verified: boolean;
}

export interface AIAssessment {
  id: string;
  user_id: string;
  job_title: string;
  risk_score: number;
  risk_level: RiskLevel;
  automation_probability: number;
  recommendations: string[];
  skills_to_learn: string[];
  career_alternatives: string[];
  created_at: string;
}

export interface Gig {
  id: string;
  title: string;
  company: string;
  description: string;
  budget_range: string;
  skills_required: string[];
  duration: string;
  gig_type: 'freelance' | 'internship' | 'project';
  is_active: boolean;
  posted_at: string;
}

export interface PortfolioItem {
  id: string;
  user_id: string;
  title: string;
  description: string;
  url?: string;
  image_url?: string;
  category: string;
  technologies: string[];
  created_at: string;
}

// ── Rocket Boost: Master Profile ──────────────────────────────

export interface ExperienceEntry {
  id: string;
  title: string;
  company: string;
  location: string;
  start_date: string;
  end_date: string;
  current: boolean;
  description: string;
}

export interface EducationEntry {
  id: string;
  school: string;
  degree: string;
  field: string;
  start_date: string;
  end_date: string;
}

export interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url: string;
}

export interface CandidateProfile {
  id: string;
  resume_url: string | null;
  resume_filename: string | null;
  headline: string;
  summary: string;
  skills: string[];
  target_roles: string[];
  preferred_locations: string[];
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string;
  notice_period: string;
  visa_status: string;
  linkedin_url: string;
  github_url: string;
  portfolio_url: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  certifications: CertificationEntry[];
  updated_at?: string;
}
