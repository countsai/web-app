export const APP_NAME = 'Counts AI';
export const APP_DESCRIPTION = 'The Career Operating System for the AI Economy.';

export const ROUTES = {
  // Public Routes
  HOME: '/',
  FEATURES: '/features',
  PUBLIC_JOBS: '/jobs',
  REMOTE_JOBS: '/remote-jobs',
  STARTUP_JOBS: '/startup-jobs',
  GIGS_MARKETPLACE: '/gigs',
  VISA_GUIDES: '/visa-guides',
  PRICING: '/pricing',
  ABOUT: '/about',
  CONTACT: '/contact',
  
  // Auth Routes
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  
  // Candidate Routes
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  PROFILE_EDIT: '/profile/edit',
  JOB_ANALYZER: '/career-scan',
  TOP_MATCHES: '/jobs/matches',
  RESUME_BUILDER: '/apply-studio',
  COVER_LETTERS: '/apply-studio',
  SKILL_GAPS: '/career-map',
  TRAINING_PLAN: '/skills-roadmap',
  PROOF_OF_WORK: '/proof-of-work',
  APPLICATION_TRACKER: '/applications',
  SETTINGS: '/settings',
  // Legacy aliases kept for backwards compat
  CAREER_SCAN: '/career-scan',
  CAREER_MAP: '/career-map',
  JOB_MATCHES: '/jobs/matches',
  APPLY_STUDIO: '/apply-studio',
  APPLICATIONS: '/applications',
  SKILLS_ROADMAP: '/skills-roadmap',
  RECRUITER_OUTREACH: '/recruiter-outreach',
  VISA_HUB: '/visa-hub',
  
  // Employer Routes
  EMPLOYER_DASHBOARD: '/employer/dashboard',
  EMPLOYER_COMPANY: '/employer/company',
  EMPLOYER_JOBS: '/employer/jobs',
  EMPLOYER_JOBS_NEW: '/employer/jobs/new',
  EMPLOYER_APPLICANTS: '/employer/applicants',
  EMPLOYER_CANDIDATES: '/employer/candidates',
  EMPLOYER_MICRO_PROJECTS: '/employer/micro-projects',
  EMPLOYER_MICRO_PROJECTS_NEW: '/employer/micro-projects/new',
  EMPLOYER_SETTINGS: '/employer/settings',
  
  // Admin Routes
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_CANDIDATES: '/admin/candidates',
  ADMIN_JOBS: '/admin/jobs',
  ADMIN_COMPANIES: '/admin/companies',
  ADMIN_GIGS: '/admin/gigs',
  ADMIN_MICRO_PROJECTS: '/admin/micro-projects',
  ADMIN_VISA_GUIDES: '/admin/visa-guides',
  ADMIN_REPORTS: '/admin/reports',
  ADMIN_STUDENTS: '/admin/students',
  ADMIN_SETTINGS: '/admin/settings',

  // Jobs Board (candidate view)
  JOBS_BOARD: '/jobs/board',
};

export const CANDIDATE_NAV = [
  { name: 'Dashboard', href: ROUTES.DASHBOARD, icon: 'LayoutDashboard' },
  { name: 'Career Scan', href: ROUTES.CAREER_SCAN, icon: 'ShieldAlert' },
  { name: 'Career Map', href: ROUTES.CAREER_MAP, icon: 'Map' },
  { name: 'Job Matches', href: ROUTES.JOB_MATCHES, icon: 'Briefcase' },
  { name: 'Apply Studio', href: ROUTES.APPLY_STUDIO, icon: 'Zap' },
  { name: 'Applications', href: ROUTES.APPLICATIONS, icon: 'ClipboardList' },
  { name: 'Proof of Work', href: ROUTES.PROOF_OF_WORK, icon: 'Cpu' },
  { name: 'Skill Roadmap', href: ROUTES.SKILLS_ROADMAP, icon: 'Route' },
  { name: 'Recruiter Outreach', href: ROUTES.RECRUITER_OUTREACH, icon: 'MessageSquare' },
  { name: 'Visa Hub', href: ROUTES.VISA_HUB, icon: 'Globe' },
  { name: 'Settings', href: ROUTES.SETTINGS, icon: 'Settings' },
];

export const EMPLOYER_NAV = [
  { name: 'Dashboard', href: ROUTES.EMPLOYER_DASHBOARD, icon: 'LayoutDashboard' },
  { name: 'Company', href: ROUTES.EMPLOYER_COMPANY, icon: 'Building2' },
  { name: 'Manage Jobs', href: ROUTES.EMPLOYER_JOBS, icon: 'Briefcase' },
  { name: 'Applicants', href: ROUTES.EMPLOYER_APPLICANTS, icon: 'FileUser' },
  { name: 'Candidates', href: ROUTES.EMPLOYER_CANDIDATES, icon: 'Users' },
  { name: 'Micro Projects', href: ROUTES.EMPLOYER_MICRO_PROJECTS, icon: 'Cpu' },
  { name: 'Settings', href: ROUTES.EMPLOYER_SETTINGS, icon: 'Settings' },
];

export const ADMIN_NAV = [
  { name: 'Dashboard', href: ROUTES.ADMIN_DASHBOARD, icon: 'BarChart3' },
  { name: 'Manage Users', href: ROUTES.ADMIN_USERS, icon: 'Users' },
  { name: 'Candidate Dossier', href: ROUTES.ADMIN_CANDIDATES, icon: 'ClipboardList' },
  { name: 'Jobs', href: ROUTES.ADMIN_JOBS, icon: 'Briefcase' },
  { name: 'Companies', href: ROUTES.ADMIN_COMPANIES, icon: 'Building2' },
  { name: 'Gigs', href: ROUTES.ADMIN_GIGS, icon: 'Compass' },
  { name: 'Micro Projects', href: ROUTES.ADMIN_MICRO_PROJECTS, icon: 'Cpu' },
  { name: 'Visa Guides', href: ROUTES.ADMIN_VISA_GUIDES, icon: 'Globe' },
  { name: 'Reports', href: ROUTES.ADMIN_REPORTS, icon: 'AlertTriangle' },
  { name: 'Settings', href: ROUTES.ADMIN_SETTINGS, icon: 'Settings' },
];

export const FOOTER_LINKS = [
  { name: 'About', href: ROUTES.ABOUT },
  { name: 'Features', href: ROUTES.FEATURES },
  { name: 'Pricing', href: ROUTES.PRICING },
  { name: 'Contact', href: ROUTES.CONTACT },
];

// ── Rocket Boost: Master Profile options ──────────────────────

export const NOTICE_PERIOD_OPTIONS = [
  { value: 'immediate', label: 'Immediate / Available now' },
  { value: '1_week', label: '1 week' },
  { value: '2_weeks', label: '2 weeks' },
  { value: '1_month', label: '1 month' },
  { value: '2_months', label: '2 months' },
  { value: '3_plus_months', label: '3+ months' },
];

export const VISA_STATUS_OPTIONS = [
  { value: 'citizen', label: 'Citizen / No restrictions' },
  { value: 'settled', label: 'Settled / Permanent residency' },
  { value: 'have_visa', label: 'Hold a valid work visa' },
  { value: 'visa_required', label: 'Require visa sponsorship' },
  { value: 'other', label: 'Other' },
];

export const SALARY_CURRENCY_OPTIONS = ['GBP', 'USD', 'EUR', 'INR'];
