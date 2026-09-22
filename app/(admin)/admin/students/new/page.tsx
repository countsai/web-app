"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, AlertTriangle, ExternalLink } from "lucide-react";

type Status = "idle" | "submitting" | "success" | "error" | "duplicate";

export default function AddStudentPage() {
  const router = useRouter();

  const [fullName, setFullName]   = useState("");
  const [email, setEmail]         = useState("");
  const [phone, setPhone]         = useState("");
  const [status, setStatus]       = useState<Status>("idle");
  const [errorMsg, setErrorMsg]   = useState("");
  const [createdId, setCreatedId] = useState("");
  const [existingId, setExistingId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: fullName.trim(), email: email.trim(), phone: phone.trim() || undefined }),
      });

      const body = await res.json();

      if (res.status === 409 && body.error === "DUPLICATE") {
        setExistingId(body.existingId ?? "");
        setStatus("duplicate");
        return;
      }

      if (!res.ok) {
        setErrorMsg(body.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setCreatedId(body.data.id);
      setStatus("success");
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="max-w-md mx-auto mt-12 text-center space-y-5">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto" style={{ background: "#e8f8f1" }}>
          <CheckCircle size={28} style={{ color: "#1f9d63" }} />
        </div>
        <div>
          <h2 className="text-lg font-bold" style={{ color: "#071A24" }}>Student created</h2>
          <p className="text-sm mt-1" style={{ color: "#536B73" }}>
            <strong>{fullName}</strong> has been added successfully.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Link
            href={`/admin/students/${createdId}`}
            className="h-10 px-5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 text-white transition-opacity hover:opacity-90"
            style={{ background: "#079DB3" }}
          >
            View Student Profile <ExternalLink size={13} />
          </Link>
          <Link
            href="/admin/students"
            className="h-10 px-5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 border transition-colors hover:bg-muted/30"
            style={{ borderColor: "#D7E2E4", color: "#536B73" }}
          >
            Back to Students
          </Link>
        </div>
      </div>
    );
  }

  if (status === "duplicate") {
    return (
      <div className="max-w-md mx-auto mt-12 text-center space-y-5">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto" style={{ background: "#fef0ef" }}>
          <AlertTriangle size={28} style={{ color: "#c0392b" }} />
        </div>
        <div>
          <h2 className="text-lg font-bold" style={{ color: "#071A24" }}>Student already exists</h2>
          <p className="text-sm mt-1" style={{ color: "#536B73" }}>
            A student with email <strong>{email}</strong> is already in the system.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          {existingId && (
            <Link
              href={`/admin/students/${existingId}`}
              className="h-10 px-5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 text-white transition-opacity hover:opacity-90"
              style={{ background: "#079DB3" }}
            >
              View Existing Student <ExternalLink size={13} />
            </Link>
          )}
          <button
            onClick={() => setStatus("idle")}
            className="h-10 px-5 rounded-xl font-semibold text-sm border transition-colors hover:bg-muted/30"
            style={{ borderColor: "#D7E2E4", color: "#536B73" }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg">
      {/* Back link */}
      <Link
        href="/admin/students"
        className="inline-flex items-center gap-1.5 text-sm font-semibold mb-6 hover:underline"
        style={{ color: "#536B73" }}
      >
        <ArrowLeft size={13} />
        Back to Students
      </Link>

      <h1 className="text-xl font-bold mb-1" style={{ color: "#071A24" }}>Add Student</h1>
      <p className="text-sm mb-7" style={{ color: "#536B73" }}>
        Creates an account and enrols the student in the Counts AI program.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider mb-1.5" style={{ color: "#536B73" }}>
            Full Name <span style={{ color: "#c0392b" }}>*</span>
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Jane Doe"
            className="w-full h-10 px-3.5 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#079DB3]/30"
            style={{ borderColor: "#D7E2E4", color: "#071A24" }}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider mb-1.5" style={{ color: "#536B73" }}>
            Email Address <span style={{ color: "#c0392b" }}>*</span>
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@example.com"
            className="w-full h-10 px-3.5 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#079DB3]/30"
            style={{ borderColor: "#D7E2E4", color: "#071A24" }}
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider mb-1.5" style={{ color: "#536B73" }}>
            Phone <span className="text-[10px] font-normal normal-case" style={{ color: "#536B73", opacity: 0.6 }}>(optional)</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+44 7700 000000"
            className="w-full h-10 px-3.5 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#079DB3]/30"
            style={{ borderColor: "#D7E2E4", color: "#071A24" }}
          />
        </div>

        {/* Error */}
        {status === "error" && (
          <div className="flex items-start gap-2 p-3 rounded-xl text-sm" style={{ background: "#fef0ef", color: "#c0392b" }}>
            <AlertTriangle size={14} className="shrink-0 mt-0.5" />
            {errorMsg}
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={status === "submitting"}
            className="h-10 px-6 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: "#079DB3" }}
          >
            {status === "submitting" ? "Creating…" : "Create Student"}
          </button>
          <Link
            href="/admin/students"
            className="h-10 px-4 rounded-xl text-sm font-semibold border flex items-center transition-colors hover:bg-muted/30"
            style={{ borderColor: "#D7E2E4", color: "#536B73" }}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
