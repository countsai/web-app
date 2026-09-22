"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { Crown, Users, Search } from "lucide-react";

export default function AdminJobsModerationPage() {
  const { jobs, updateJobPremium } = useStore();
  const [search, setSearch] = useState("");

  const filtered = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company_name.toLowerCase().includes(search.toLowerCase())
  );

  const premiumCount = jobs.filter((j) => j.isPremium).length;
  const freeCount = jobs.filter((j) => !j.isPremium).length;

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Job Management</h1>
          <p className="text-muted-foreground mt-1 font-medium">
            Set each job listing as Free or Premium access.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-3xl p-6 bg-white border border-border shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total Listings</p>
            <p className="text-3xl font-black">{jobs.length}</p>
          </div>
          <div className="rounded-3xl p-6 bg-white border border-border shadow-sm" style={{ borderColor: "#e3f1f2" }}>
            <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: "#079DB3" }}>Premium Jobs</p>
            <p className="text-3xl font-black" style={{ color: "#079DB3" }}>{premiumCount}</p>
          </div>
          <div className="rounded-3xl p-6 bg-white border border-border shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Free Jobs</p>
            <p className="text-3xl font-black">{freeCount}</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jobs by title or company…"
            className="w-full h-12 rounded-2xl bg-muted pl-11 pr-4 border-none focus:ring-2 ring-primary transition-all font-medium text-sm"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Job</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Company</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Type</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Work Mode</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Access Level</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((job) => (
                  <tr key={job.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-sm">{job.title}</p>
                      <p className="text-xs text-muted-foreground font-medium mt-0.5">
                        {job.currency} {job.salary_min.toLocaleString()} – {job.salary_max.toLocaleString()}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-bold">{job.company_name}</p>
                      <p className="text-xs text-muted-foreground">{job.location}</p>
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-bold px-2 py-1 rounded-lg bg-muted text-muted-foreground">
                        {job.contract_type}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-medium text-muted-foreground">{job.work_mode}</td>
                    <td className="p-4">
                      {job.isPremium ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-full" style={{ background: "#e3f1f2", color: "#079DB3" }}>
                          <Crown size={11} /> Premium
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-full bg-muted text-muted-foreground">
                          <Users size={11} /> Free
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant={job.isPremium ? "outline" : "default"}
                          className="h-8 rounded-xl text-xs font-black px-3"
                          style={!job.isPremium ? { background: "#079DB3", color: "white", border: "none" } : {}}
                          onClick={() => updateJobPremium(job.id, !job.isPremium)}
                        >
                          {job.isPremium ? "Set Free" : "Set Premium"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-10 text-center text-sm text-muted-foreground font-medium">
                      No jobs match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
