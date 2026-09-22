"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Briefcase, Settings, Trash2, Edit3, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { StatusBadge } from "@/components/shared/status-badge";

export default function EmployerJobDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-xl">
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-3xl font-black tracking-tight">Job Management</h1>
              <p className="text-muted-foreground mt-1 font-medium">Analyze and manage candidates for this role.</p>
            </div>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" className="rounded-xl font-bold gap-2">
                <Edit3 size={18} /> Edit Job
             </Button>
             <Button variant="destructive" className="rounded-xl font-bold gap-2">
                <Trash2 size={18} /> Close Role
             </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
           <Card className="lg:col-span-1 border-none shadow-sm rounded-3xl p-6 bg-card border">
              <div className="space-y-6">
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Status</p>
                    <StatusBadge status="Active" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Role</p>
                    <p className="font-bold text-lg">Senior AI Engineer</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Applicants</p>
                    <p className="text-3xl font-black">24</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Unreviewed</p>
                    <p className="text-3xl font-black text-amber-500">8</p>
                 </div>
              </div>
           </Card>

           <div className="lg:col-span-3 space-y-6">
              <Card className="border-none shadow-sm rounded-3xl">
                 <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-xl font-bold">Top Matched Candidates</CardTitle>
                    <Button variant="ghost" size="sm" className="font-bold text-primary">View All Applicants</Button>
                 </CardHeader>
                 <CardContent>
                    <div className="space-y-4">
                       {[
                         { name: "Alex Rivera", match: 98, role: "LLM Expert", exp: "6 years" },
                         { name: "Sarah Chen", match: 95, role: "Backend / ML", exp: "4 years" },
                         { name: "Marcus Thorne", match: 92, role: "AI Researcher", exp: "8 years" }
                       ].map((c, i) => (
                         <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border hover:border-primary/20 transition-all group">
                            <div className="flex items-center gap-4">
                               <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                  {c.name.split(' ').map(n => n[0]).join('')}
                               </div>
                               <div>
                                  <p className="font-bold">{c.name}</p>
                                  <p className="text-xs text-muted-foreground font-medium">{c.role} • {c.exp}</p>
                               </div>
                            </div>
                            <div className="flex items-center gap-6">
                               <div className="text-right">
                                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Match</p>
                                  <p className="font-black text-accent">{c.match}%</p>
                               </div>
                               <Button variant="ghost" size="icon" className="rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Eye size={18} />
                               </Button>
                            </div>
                         </div>
                       ))}
                    </div>
                 </CardContent>
              </Card>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
