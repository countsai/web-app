"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (!code) { window.location.href = "/auth/login"; return; }

    supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
      window.location.href = error ? "/auth/login?error=oauth" : "/dashboard";
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#f4fafb" }}>
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "#079DB3", borderTopColor: "transparent" }} />
        <p className="text-sm font-medium" style={{ color: "#5f7679" }}>Signing you in…</p>
      </div>
    </div>
  );
}
