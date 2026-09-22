"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, MessageSquare, Clock, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import Link from "next/link";
import { StatusBadge } from "@/components/shared/status-badge";

export default function ApplicationDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-xl">
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Application Detail</h1>
            <p className="text-muted-foreground mt-1 font-medium font-mono text-xs uppercase tracking-widest">ID: {params.id}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-6">
                    <div className="h-20 w-20 rounded-2xl bg-muted flex items-center justify-center border shadow-sm">
                      <img src="https://logo.clearbit.com/openai.com" alt="OpenAI" className="h-12 w-12 object-contain" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black mb-1">Senior LLM Engineer</h2>
                      <p className="text-muted-foreground font-bold">OpenAI • San Francisco, CA</p>
                    </div>
                  </div>
                  <StatusBadge status="Under Review" />
                </div>

                <div className="grid sm:grid-cols-3 gap-6 py-8 border-y">
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Applied On</p>
                      <p className="font-bold flex items-center gap-2"><Clock size={14} className="text-primary" /> Oct 24, 2023</p>
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">AI Match Score</p>
                      <p className="font-bold text-accent flex items-center gap-2">94% Perfect Match</p>
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Current Phase</p>
                      <p className="font-bold">Initial Review</p>
                   </div>
                </div>

                <div className="mt-8">
                   <h3 className="font-black text-lg mb-4">Application Timeline</h3>
                   <div className="space-y-6">
                      {[
                        { title: "Application Submitted", date: "Oct 24, 2023", status: "completed" },
                        { title: "AI Assessment Passed", date: "Oct 25, 2023", status: "completed" },
                        { title: "Manual Review", date: "In Progress", status: "current" }
                      ].map((step, i) => (
                        <div key={i} className="flex gap-4">
                           <div className="flex flex-col items-center">
                              <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                                step.status === 'completed' ? 'bg-primary text-white' : step.status === 'current' ? 'bg-amber-500 text-white animate-pulse' : 'bg-muted'
                              }`}>
                                 {step.status === 'completed' ? <CheckCircle2 size={14} /> : i + 1}
                              </div>
                              {i < 2 && <div className="w-0.5 flex-1 bg-muted my-1" />}
                           </div>
                           <div className="pb-6">
                              <p className="font-bold leading-none mb-1">{step.title}</p>
                              <p className="text-xs text-muted-foreground font-medium">{step.date}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
               <CardHeader>
                  <CardTitle className="text-lg font-bold">Actions</CardTitle>
               </CardHeader>
               <CardContent className="space-y-3">
                  <Button className="w-full h-12 rounded-xl font-bold gap-2">
                     <MessageSquare size={18} /> Message Recruiter
                  </Button>
                  <Button variant="outline" className="w-full h-12 rounded-xl font-bold gap-2">
                     <ExternalLink size={18} /> View Job Post
                  </Button>
               </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-primary/5 border border-primary/10">
               <CardHeader>
                  <CardTitle className="text-lg font-bold">Interview Prep AI</CardTitle>
               </CardHeader>
               <CardContent>
                  <p className="text-sm font-medium mb-4">We found 5 specific technical challenges OpenAI is likely to ask for this role based on your profile.</p>
                  <Button className="w-full rounded-xl font-bold bg-primary/20 text-primary hover:bg-primary/30 border-none">
                     Generate Prep Guide
                  </Button>
               </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
