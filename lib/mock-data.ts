import { User, Job, Application } from './types';

// NOTE: Job/Application mock data is intentionally retained for the jobs
// board and employer application views, which are not yet backed by a
// real jobs/applications schema.

const SAMPLE_CANDIDATE: User = {
  id: 'user_1',
  email: 'alex@example.com',
  full_name: 'Alex Rivera',
  avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  headline: 'Senior Product Designer & AI Strategist',
  role: 'jobseeker',
  subscription_tier: 'pro',
  ai_risk_score: 24,
  profile_completeness: 85,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const MOCK_JOBS: Job[] = [
  {
    id: 'job_1',
    title: 'AI Product Manager',
    company_id: 'comp_1',
    company_name: 'NeuralFlow',
    company_logo: 'https://logo.clearbit.com/openai.com',
    location: 'San Francisco, CA',
    remote_type: 'hybrid',
    salary_min: 140000,
    salary_max: 190000,
    currency: 'USD',
    description: 'Lead the development of our next-generation AI agents...',
    requirements: ['5+ years PM experience', 'Understanding of LLMs', 'Strong data background'],
    skills_required: ['Product Management', 'Python', 'Prompt Engineering'],
    ai_impact_level: 'low',
    job_type: 'full-time',
    category: 'Product',
    posted_at: new Date().toISOString(),
    is_active: true,
    status: 'approved',
    employer_id: 'user_2',
  },
  {
    id: 'job_2',
    title: 'Senior Frontend Engineer',
    company_id: 'comp_2',
    company_name: 'Vercel',
    company_logo: 'https://logo.clearbit.com/vercel.com',
    location: 'Remote',
    remote_type: 'remote',
    salary_min: 160000,
    salary_max: 220000,
    currency: 'USD',
    description: 'Build the future of the web with Next.js...',
    requirements: ['Expert React knowledge', 'Experience with Tailwind', 'Performance optimization skills'],
    skills_required: ['React', 'Next.js', 'TypeScript'],
    ai_impact_level: 'medium',
    job_type: 'full-time',
    category: 'Engineering',
    posted_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    is_active: true,
    status: 'approved',
    employer_id: 'user_2',
  }
];

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: 'app_1',
    user_id: 'user_1',
    job_id: 'job_1',
    status: 'interview',
    ai_match_score: 92,
    match_summary: 'Alex has extensive experience in product design and has recently completed several projects in prompt engineering, making them an ideal fit for the AI PM role.',
    applied_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    job: MOCK_JOBS[0],
    candidate: SAMPLE_CANDIDATE,
  }
];
