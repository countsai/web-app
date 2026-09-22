"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Search, Plus, RefreshCw, ExternalLink, GraduationCap, ChevronLeft, ChevronRight } from "lucide-react";

interface Student {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  account_type: string;
  created_at: string;
  certificate_count: number;
}

function StatusBadge({ count }: { count: number }) {
  if (count === 0) {
    return (
      <span className="inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "#f3f4f6", color: "#6b7280" }}>
        None
      </span>
    );
  }
  return (
    <span className="inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "#e8f8f1", color: "#1f9d63" }}>
      {count}
    </span>
  );
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage]         = useState(1);
  const LIMIT = 25;

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
    if (debouncedSearch) params.set("search", debouncedSearch);
    const res = await fetch(`/api/admin/students?${params}`);
    const { data, count } = await res.json();
    setStudents(data ?? []);
    setTotal(count ?? 0);
    setLoading(false);
  }, [page, debouncedSearch]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);
  useEffect(() => { setPage(1); }, [debouncedSearch]);

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "#071A24" }}>Students</h1>
          <p className="text-sm mt-0.5" style={{ color: "#536B73" }}>
            {total} enrolled student{total !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchStudents}
            className="h-9 px-3 rounded-xl border text-sm font-semibold flex items-center gap-1.5 transition-colors hover:bg-muted/30"
            style={{ borderColor: "#D7E2E4", color: "#536B73" }}
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <Link
            href="/admin/students/new"
            className="h-9 px-4 rounded-xl text-sm font-bold flex items-center gap-1.5 text-white shadow-sm transition-opacity hover:opacity-90"
            style={{ background: "#079DB3" }}
          >
            <Plus size={14} />
            Add Student
          </Link>
        </div>
      </div>

      {/* Search + filter bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#536B73" }} />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-8 pr-3 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#079DB3]/30"
            style={{ borderColor: "#D7E2E4", color: "#071A24" }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-2xl overflow-hidden" style={{ borderColor: "#D7E2E4" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "#F8FAF9", borderBottom: "1px solid #D7E2E4" }}>
              {["Student", "Email", "Phone", "Certificates", "Joined", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider" style={{ color: "#536B73" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #f1f5f4" }}>
                  {Array.from({ length: 6 }).map((__, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 rounded-lg animate-pulse" style={{ background: "#E7F5F4", width: j === 0 ? "140px" : j === 1 ? "180px" : "80px" }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-16 text-center">
                  <GraduationCap size={28} className="mx-auto mb-3" style={{ color: "#D7E2E4" }} />
                  <p className="font-semibold" style={{ color: "#536B73" }}>No students found</p>
                  <p className="text-xs mt-1" style={{ color: "#536B73", opacity: 0.7 }}>
                    {debouncedSearch ? "Try a different search term." : "Add your first student to get started."}
                  </p>
                </td>
              </tr>
            ) : (
              students.map((s, idx) => (
                <tr
                  key={s.id}
                  style={{ borderBottom: idx < students.length - 1 ? "1px solid #f1f5f4" : "none" }}
                  className="transition-colors hover:bg-[#f8faf9]"
                >
                  <td className="px-4 py-3 font-semibold" style={{ color: "#071A24" }}>
                    {s.full_name || "—"}
                  </td>
                  <td className="px-4 py-3" style={{ color: "#536B73" }}>{s.email}</td>
                  <td className="px-4 py-3" style={{ color: "#536B73" }}>{s.phone || "—"}</td>
                  <td className="px-4 py-3">
                    <StatusBadge count={s.certificate_count} />
                  </td>
                  <td className="px-4 py-3" style={{ color: "#536B73" }}>
                    {formatDate(s.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/students/${s.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold hover:underline"
                      style={{ color: "#079DB3" }}
                    >
                      View <ExternalLink size={11} />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: "#D7E2E4", background: "#F8FAF9" }}>
            <p className="text-xs" style={{ color: "#536B73" }}>
              Page {page} of {totalPages} · {total} results
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="h-7 w-7 rounded-lg flex items-center justify-center disabled:opacity-30 hover:bg-muted/40 transition-colors"
                style={{ border: "1px solid #D7E2E4" }}
              >
                <ChevronLeft size={13} />
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="h-7 w-7 rounded-lg flex items-center justify-center disabled:opacity-30 hover:bg-muted/40 transition-colors"
                style={{ border: "1px solid #D7E2E4" }}
              >
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
