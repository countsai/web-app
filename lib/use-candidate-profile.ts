"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { CandidateProfile } from "@/lib/types";

const EMPTY_PROFILE: CandidateProfile = {
  id: "",
  resume_url: null,
  resume_filename: null,
  headline: "",
  summary: "",
  skills: [],
  target_roles: [],
  preferred_locations: [],
  salary_min: null,
  salary_max: null,
  salary_currency: "GBP",
  notice_period: "",
  visa_status: "",
  linkedin_url: "",
  github_url: "",
  portfolio_url: "",
  experience: [],
  education: [],
  certifications: [],
};

/** Loads the signed-in user's Rocket Boost master profile. */
export function useCandidateProfile() {
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<CandidateProfile>(EMPTY_PROFILE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        setLoading(false);
        return;
      }
      setUserId(session.user.id);
      supabase
        .from("candidate_profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data) {
            setProfile({
              id: data.id,
              resume_url: data.resume_url,
              resume_filename: data.resume_filename,
              headline: data.headline ?? "",
              summary: data.summary ?? "",
              skills: data.skills ?? [],
              target_roles: data.target_roles ?? [],
              preferred_locations: data.preferred_locations ?? [],
              salary_min: data.salary_min,
              salary_max: data.salary_max,
              salary_currency: data.salary_currency ?? "GBP",
              notice_period: data.notice_period ?? "",
              visa_status: data.visa_status ?? "",
              linkedin_url: data.linkedin_url ?? "",
              github_url: data.github_url ?? "",
              portfolio_url: data.portfolio_url ?? "",
              experience: data.experience ?? [],
              education: data.education ?? [],
              certifications: data.certifications ?? [],
            });
          }
          setLoading(false);
        });
    });
  }, []);

  const checks = [
    profile.headline.trim().length > 0,
    profile.summary.trim().length > 0,
    profile.skills.length > 0,
    profile.target_roles.length > 0,
    profile.experience.length > 0,
  ];
  const isReady = checks.every(Boolean);

  return { userId, profile, loading, isReady };
}
