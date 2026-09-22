"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────

export type PlanTier = "Free" | "Premium";
export type WorkMode = "Remote" | "Hybrid" | "In-person";
export type ContractType = "Freelance" | "Contract" | "Full-time" | "Part-time";
export type ExperienceLevel = "Junior" | "Mid" | "Senior" | "Lead" | "Principal";

export interface StoreUser {
  id: string;
  email: string;
  full_name: string;
  role: "Admin" | "Talent" | "Business";
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: PlanTier;
  status: "active" | "cancelled" | "trial";
  started_at: string;
}

export interface Job {
  id: string;
  title: string;
  company_name: string;
  location: string;
  country: string;
  work_mode: WorkMode;
  salary_min: number;
  salary_max: number;
  currency: string;
  contract_type: ContractType;
  experience_level: ExperienceLevel;
  skills: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  visa_sponsorship_status: "Available" | "Not Available" | "Case by Case";
  internal_application_enabled: boolean;
  closing_date: string;
  published: boolean;
  isPremium: boolean;
}

export interface JobApplication {
  id: string;
  job_id: string;
  talent_user_id: string;
  cover_letter: string;
  resume_url: string;
  status: "Submitted" | "Under Review";
  applied_at: string;
}

// ─── Pro Plan Payment ───────────────────────────────────────────────────────────

export const RAZORPAY_PRO_BUTTON_ID = "pl_T0pCvMDvC1Hvru";

// ─── Referral Program ──────────────────────────────────────────────────────────

export const REFERRAL_COMMISSION = 5;

// ─── Seed Data ────────────────────────────────────────────────────────────────

export const SEED_USERS: StoreUser[] = [
  { id: "u1", email: "alex@example.com", full_name: "Alex Rivera", role: "Talent" },
  { id: "u2", email: "sarah@acme.com", full_name: "Sarah Chen", role: "Business" },
  { id: "u3", email: "admin@counts.ai", full_name: "Mike Johnson", role: "Admin" },
];

export const SEED_SUBSCRIPTIONS: Subscription[] = [
  { id: "sub1", user_id: "u1", plan: "Free", status: "active", started_at: "2026-05-01" },
  { id: "sub2", user_id: "u2", plan: "Premium", status: "active", started_at: "2026-04-01" },
];

export const SEED_JOBS: Job[] = [
  {
    id: "j1", title: "Senior AI Engineer", company_name: "NeuralFlow", location: "London, UK", country: "UK",
    work_mode: "Hybrid", salary_min: 90000, salary_max: 130000, currency: "GBP",
    contract_type: "Full-time", experience_level: "Senior",
    skills: ["PyTorch", "LLMs", "RAG", "Python", "AWS"],
    description: "Lead the development of cutting-edge AI systems for enterprise customers. You will architect and build LLM-powered pipelines at scale.",
    responsibilities: [
      "Design and implement RAG-based retrieval systems",
      "Fine-tune open-source LLMs on proprietary data",
      "Collaborate with product and infra teams on AI features",
      "Mentor junior engineers in ML best practices",
    ],
    requirements: [
      "5+ years software engineering experience",
      "3+ years working with LLMs or deep learning",
      "Proficiency in Python and PyTorch",
      "Experience deploying ML models to production",
    ],
    benefits: [
      "£90k–£130k base salary",
      "Stock options",
      "Remote-friendly hybrid (3 days office)",
      "£3k/year learning budget",
      "Private health insurance",
    ],
    visa_sponsorship_status: "Available",
    internal_application_enabled: true,
    closing_date: "2026-07-30",
    published: true,
    isPremium: true,
  },
  {
    id: "j2", title: "ML Engineer — Remote", company_name: "Cohere", location: "Remote (Global)", country: "Global",
    work_mode: "Remote", salary_min: 140000, salary_max: 190000, currency: "USD",
    contract_type: "Full-time", experience_level: "Mid",
    skills: ["PyTorch", "Transformers", "MLOps", "Python", "Kubernetes"],
    description: "Join Cohere's world-class ML team to build and scale state-of-the-art NLP models powering enterprise AI solutions globally.",
    responsibilities: [
      "Train and evaluate large-scale language models",
      "Build robust ML infrastructure and pipelines",
      "Research and implement new model architectures",
    ],
    requirements: [
      "3+ years ML engineering experience",
      "Strong background in NLP or LLMs",
      "Experience with distributed training",
    ],
    benefits: [
      "$140k–$190k salary",
      "Fully remote globally",
      "Generous equity package",
      "Home office stipend",
    ],
    visa_sponsorship_status: "Not Available",
    internal_application_enabled: true,
    closing_date: "2026-08-15",
    published: true,
    isPremium: false,
  },
  {
    id: "j3", title: "AI Product Manager", company_name: "OpenAI", location: "San Francisco, CA", country: "USA",
    work_mode: "In-person", salary_min: 160000, salary_max: 220000, currency: "USD",
    contract_type: "Full-time", experience_level: "Lead",
    skills: ["Product Strategy", "SQL", "AI/ML Literacy", "Roadmapping", "Stakeholder Management"],
    description: "Shape the future of AI products at OpenAI. Work directly with research teams to bring GPT capabilities to millions of users and enterprise partners.",
    responsibilities: [
      "Define product vision and roadmap for GPT-powered products",
      "Partner with research teams to productize new capabilities",
      "Drive GTM strategy and customer success",
    ],
    requirements: [
      "7+ years product management experience",
      "Deep understanding of AI/ML concepts",
      "Experience launching B2B SaaS products at scale",
    ],
    benefits: [
      "$160k–$220k salary",
      "Top-tier equity",
      "Relocation assistance",
      "World-class health & dental",
    ],
    visa_sponsorship_status: "Available",
    internal_application_enabled: true,
    closing_date: "2026-07-01",
    published: true,
    isPremium: false,
  },
  {
    id: "j4", title: "Prompt Engineer", company_name: "Mistral AI", location: "Remote (Europe)", country: "Europe",
    work_mode: "Remote", salary_min: 80000, salary_max: 110000, currency: "EUR",
    contract_type: "Contract", experience_level: "Mid",
    skills: ["Prompt Engineering", "LLMs", "Python", "Evals", "API Integration"],
    description: "Join Mistral's product team to craft, evaluate, and iterate on prompts that power our models across enterprise use cases.",
    responsibilities: [
      "Design and test system prompts for enterprise clients",
      "Build evaluation frameworks for prompt quality",
      "Document and share prompt engineering best practices",
    ],
    requirements: [
      "2+ years working with LLM APIs",
      "Strong writing and analytical skills",
      "Experience with prompt evaluation and A/B testing",
    ],
    benefits: [
      "€80k–€110k salary",
      "Fully remote across Europe",
      "Stock options",
    ],
    visa_sponsorship_status: "Case by Case",
    internal_application_enabled: true,
    closing_date: "2026-07-20",
    published: true,
    isPremium: true,
  },
  {
    id: "j5", title: "AI Data Annotator", company_name: "Scale AI", location: "Remote (Global)", country: "Global",
    work_mode: "Remote", salary_min: 35000, salary_max: 50000, currency: "USD",
    contract_type: "Freelance", experience_level: "Junior",
    skills: ["Annotation", "NLP", "Quality Assurance", "Data Labeling"],
    description: "Help train the next generation of AI models by annotating data with high precision and consistency for Scale AI's enterprise clients.",
    responsibilities: [
      "Label and annotate datasets for ML training",
      "Maintain annotation quality above 98% threshold",
      "Follow detailed annotation guidelines",
    ],
    requirements: [
      "Excellent attention to detail",
      "Reliable internet connection",
      "Ability to work independently",
    ],
    benefits: [
      "$20–$35/hr depending on task complexity",
      "Fully flexible hours",
      "Work from anywhere",
    ],
    visa_sponsorship_status: "Not Available",
    internal_application_enabled: true,
    closing_date: "2026-09-01",
    published: true,
    isPremium: false,
  },
  {
    id: "j6", title: "LLM Research Scientist", company_name: "Anthropic", location: "San Francisco, CA", country: "USA",
    work_mode: "Hybrid", salary_min: 200000, salary_max: 320000, currency: "USD",
    contract_type: "Full-time", experience_level: "Principal",
    skills: ["RLHF", "Python", "Research", "Deep Learning", "Statistics"],
    description: "Conduct frontier research on large language models, safety, and alignment at Anthropic. Help build the most reliable AI systems in the world.",
    responsibilities: [
      "Conduct novel research on LLM safety and alignment",
      "Publish papers at top ML conferences",
      "Collaborate with cross-functional teams on model improvements",
    ],
    requirements: [
      "PhD in CS, ML, or related field (or equivalent experience)",
      "Strong publication record in ML/NLP",
      "Experience with large-scale model training",
    ],
    benefits: [
      "$200k–$320k salary",
      "Generous equity",
      "Top-tier health benefits",
      "Conference and research travel budget",
    ],
    visa_sponsorship_status: "Available",
    internal_application_enabled: true,
    closing_date: "2026-08-01",
    published: true,
    isPremium: true,
  },
];

export const SEED_APPLICATIONS: JobApplication[] = [
  {
    id: "a1", job_id: "j2", talent_user_id: "u1",
    cover_letter: "I am excited to apply for the ML Engineer role at Cohere...",
    resume_url: "https://example.com/cv/alex.pdf",
    status: "Under Review",
    applied_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

// ─── Context ──────────────────────────────────────────────────────────────────

interface StoreContextType {
  jobs: Job[];
  applications: JobApplication[];
  subscriptions: Subscription[];
  updateJobPremium: (jobId: string, isPremium: boolean) => void;
  addApplication: (app: Omit<JobApplication, "id" | "applied_at">) => void;
  currentPlan: PlanTier;
  setCurrentPlan: (plan: PlanTier) => void;
  proExpiresAt: string | null;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>(SEED_JOBS);
  const [applications, setApplications] = useState<JobApplication[]>(SEED_APPLICATIONS);
  const [subscriptions] = useState<Subscription[]>(SEED_SUBSCRIPTIONS);
  const [currentPlan, setCurrentPlan] = useState<PlanTier>("Free");
  const [proExpiresAt, setProExpiresAt] = useState<string | null>(null);

  // Check the logged-in user's real subscription status (set by the Razorpay webhook on payment).
  // Polls periodically and on tab refocus so a payment made in this session is reflected without a manual reload.
  useEffect(() => {
    let cancelled = false;

    const checkSubscription = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data } = await supabase
          .from("subscriptions")
          .select("status, current_period_end")
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (cancelled) return;

        const isActivePro =
          !!data?.current_period_end &&
          (data.status === "active" || data.status === "trialing") &&
          new Date(data.current_period_end) > new Date();

        setCurrentPlan(isActivePro ? "Premium" : "Free");
        setProExpiresAt(isActivePro ? data!.current_period_end : null);
      } catch {
        // not signed in / no subscription yet — stays on Free
      }
    };

    checkSubscription();
    const intervalId = setInterval(checkSubscription, 15000);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") checkSubscription();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", checkSubscription);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", checkSubscription);
    };
  }, []);

  const updateJobPremium = (jobId: string, isPremium: boolean) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, isPremium } : j))
    );
  };

  const addApplication = (app: Omit<JobApplication, "id" | "applied_at">) => {
    setApplications((prev) => [
      ...prev,
      { ...app, id: `a${Date.now()}`, applied_at: new Date().toISOString() },
    ]);
  };

  return (
    <StoreContext.Provider
      value={{
        jobs,
        applications,
        subscriptions,
        updateJobPremium,
        addApplication,
        currentPlan,
        setCurrentPlan,
        proExpiresAt,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
