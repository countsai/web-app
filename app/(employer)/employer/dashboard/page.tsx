"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Briefcase, 
  Eye, 
  TrendingUp, 
  Plus, 
  Clock,
  ArrowRight,
  Sparkles,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/shared/stat-card";
import { MOCK_JOBS, MOCK_APPLICATIONS } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function EmployerDashboard() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">Employer Dashboard</h1>
            <p className="text-muted-foreground mt-1 font-medium">Manage your hiring pipeline and discover AI talent.</p>
          </div>
          <Button className="rounded-xl font-bold gap-2 shadow-lg shadow-primary/20">
            <Plus size={18} /> Post a New Job
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            label="Active Jobs" 
            value="4" 
            icon="Briefcase" 
            trend={{ value: 12, isUp: true }} 
          />
          <StatCard 
            label="Total Applicants" 
            value="142" 
            icon="Users" 
            trend={{ value: 12, isUp: true }} 
          />
          <StatCard 
            label="Profile Views" 
            value="1.2k" 
            icon="Eye" 
            trend={{ value: 8, isUp: true }} 
          />
          <StatCard 
            label="Time to Hire" 
            value="18d" 
            icon="Clock" 
            trend={{ value: 2, isUp: true }} 
          />
        </div>


        <div className="grid gap-8 lg:grid-cols-3">
          {/* Active Job Postings */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xl font-bold">Active Postings</h3>
              <Button variant="ghost" size="sm" className="font-bold text-primary">View All</Button>
            </div>
            <div className="space-y-4">
              {MOCK_JOBS.slice(0, 3).map((job) => (
                <Card key={job.id} className="border-none shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-all">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0">
                          <Briefcase className="text-primary" size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg">{job.title}</h4>
                          <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground mt-1">
                            <span className="flex items-center gap-1"><Clock size={12} /> Posted 2d ago</span>
                            <span className="flex items-center gap-1"><Users size={12} /> 24 Applicants</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                         <Button variant="outline" className="rounded-xl font-bold text-xs h-10">Manage</Button>
                         <Button className="rounded-xl font-bold text-xs h-10 gap-2">
                           Review <ArrowRight size={14} />
                         </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* AI Talent Matching */}
          <div className="lg:col-span-1 space-y-6">
            <h3 className="text-xl font-bold px-2">Top AI Matches</h3>
            <Card className="border-none shadow-sm rounded-3xl bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader>
                <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Sparkles size={16} className="text-primary" />
                  AI Recommended
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {MOCK_APPLICATIONS.slice(0, 3).map((app) => (
                  <div key={app.id} className="flex items-center gap-4 p-3 rounded-2xl bg-card border hover:shadow-sm transition-all cursor-pointer">
                    <Avatar className="h-10 w-10 border rounded-xl">
                      <AvatarImage src={app.candidate?.avatar_url} />
                      <AvatarFallback>{app.candidate?.full_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate text-sm">{app.candidate?.full_name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge className="h-4 text-[8px] font-black uppercase bg-accent/10 text-accent border-none">
                          {app.ai_match_score}% Match
                        </Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg shrink-0">
                      <Search size={14} />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full rounded-xl font-bold text-xs h-10">
                  Explore Talent Pool
                </Button>
              </CardContent>
            </Card>
            
            {/* Quick Actions */}
            <Card className="border-none shadow-sm rounded-3xl p-6 bg-muted/50">
              <h4 className="font-bold mb-4">Hiring Progress</h4>
              <div className="space-y-4">
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-muted-foreground">Pipeline Health</span>
                  <span className="text-primary">Great</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[75%]" />
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  You have 12 interviews scheduled for this week.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
