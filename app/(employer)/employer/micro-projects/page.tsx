"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Briefcase, Zap, Clock, Users } from "lucide-react";
import Link from "next/link";

export default function EmployerMicroProjectsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Micro-Projects</h1>
            <p className="text-muted-foreground mt-1 font-medium">Post short-term tasks for AI talent.</p>
          </div>
          <Link href="/employer/micro-projects/new">
            <Button className="rounded-xl font-bold h-12 px-6 gap-2">
              <Plus size={20} /> Post New Project
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
           <Card className="border-none shadow-sm rounded-3xl p-6 bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-4 text-primary mb-4">
                 <Zap size={24} />
                 <span className="font-black text-sm uppercase tracking-widest">Speed Up Delivery</span>
              </div>
              <p className="text-sm font-medium">Micro-projects are completed in 1-7 days. Perfect for data labeling, prompt engineering, or bug fixes.</p>
           </Card>
           
           <Card className="border-none shadow-sm rounded-3xl p-6 bg-accent/5 border border-accent/10">
              <div className="flex items-center gap-4 text-accent mb-4">
                 <Users size={24} />
                 <span className="font-black text-sm uppercase tracking-widest">Vetted Talent</span>
              </div>
              <p className="text-sm font-medium">Only candidates with a 90+ Skill Passport score can apply for these intensive projects.</p>
           </Card>

           <Card className="border-none shadow-sm rounded-3xl p-6 bg-amber-500/5 border border-amber-500/10">
              <div className="flex items-center gap-4 text-amber-500 mb-4">
                 <Clock size={24} />
                 <span className="font-black text-sm uppercase tracking-widest">Active Trials</span>
              </div>
              <p className="text-sm font-medium">Use micro-projects as a "work trial" before offering a full-time role to top AI engineers.</p>
           </Card>
        </div>

        <Card className="border-none shadow-sm rounded-3xl">
           <CardHeader>
              <CardTitle className="text-xl font-bold">Active Projects</CardTitle>
           </CardHeader>
           <CardContent>
              <div className="text-center py-12">
                 <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                    <Briefcase size={24} />
                 </div>
                 <p className="font-bold text-lg mb-2">No active projects</p>
                 <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-6">Start by posting a small task to get help with your AI roadmap.</p>
                 <Link href="/employer/micro-projects/new">
                    <Button variant="outline" className="rounded-xl font-bold">Post your first project</Button>
                 </Link>
              </div>
           </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
