"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  PlusCircle, 
  Sparkles, 
  Briefcase, 
  GraduationCap, 
  Cpu, 
  MapPin,
  DollarSign,
  Info
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PostJobPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Post Opportunity</h1>
          <p className="text-muted-foreground mt-1 font-medium">Reach the top 1% of AI-skilled talent globally.</p>
        </div>

        <Tabs defaultValue="job" className="w-full">
          <TabsList className="bg-muted/50 p-1 rounded-2xl h-14 mb-8 grid grid-cols-3">
            <TabsTrigger value="job" className="rounded-xl font-bold h-12 data-[state=active]:bg-primary data-[state=active]:text-white">
              <Briefcase size={18} className="mr-2" /> Full-time Job
            </TabsTrigger>
            <TabsTrigger value="internship" className="rounded-xl font-bold h-12 data-[state=active]:bg-primary data-[state=active]:text-white">
              <GraduationCap size={18} className="mr-2" /> Internship
            </TabsTrigger>
            <TabsTrigger value="micro" className="rounded-xl font-bold h-12 data-[state=active]:bg-primary data-[state=active]:text-white">
              <Cpu size={18} className="mr-2" /> Micro-Project
            </TabsTrigger>
          </TabsList>

          <TabsContent value="job" className="space-y-6">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Job Details</CardTitle>
                <CardDescription>Tell us about the role and required AI competencies.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title</Label>
                    <Input id="title" placeholder="e.g. Senior AI Engineer" className="rounded-xl h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 text-muted-foreground" size={18} />
                      <Input id="location" placeholder="Remote, SF, New York..." className="pl-10 rounded-xl h-12" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="desc">Job Description</Label>
                  <div className="relative">
                    <Textarea id="desc" placeholder="Describe the role, impact, and tech stack..." className="rounded-2xl min-h-[200px]" />
                    <Button variant="ghost" size="sm" className="absolute bottom-3 right-3 text-primary font-bold gap-1.5 h-9 bg-primary/5 hover:bg-primary/10 rounded-lg">
                      <Sparkles size={14} /> AI Improve
                    </Button>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="salary">Salary Range (Annual)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3.5 text-muted-foreground" size={18} />
                      <Input id="salary" placeholder="120k - 180k" className="pl-10 rounded-xl h-12" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>AI Impact Level</Label>
                    <div className="flex gap-2">
                       {['Low', 'Medium', 'High'].map(l => (
                         <Button key={l} variant="outline" className={`flex-1 rounded-xl font-bold h-12 ${l === 'Medium' ? 'border-primary text-primary bg-primary/5' : ''}`}>
                           {l}
                         </Button>
                       ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t flex items-center justify-between">
                   <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                     <Info size={14} /> Will be sent to Admin for approval
                   </div>
                   <Button className="rounded-xl font-bold h-12 px-8 shadow-lg shadow-primary/20 gap-2">
                     <PlusCircle size={20} /> Publish Posting
                   </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="internship">
             <Card className="border-none shadow-sm rounded-3xl overflow-hidden py-20">
               <CardContent className="flex flex-col items-center justify-center text-center opacity-40">
                 <GraduationCap size={64} className="mb-4 text-muted-foreground" />
                 <p className="text-xl font-black">Internship posting coming soon.</p>
               </CardContent>
             </Card>
          </TabsContent>

          <TabsContent value="micro">
             <Card className="border-none shadow-sm rounded-3xl overflow-hidden py-20">
               <CardContent className="flex flex-col items-center justify-center text-center opacity-40">
                 <Cpu size={64} className="mb-4 text-muted-foreground" />
                 <p className="text-xl font-black">Micro-project posting coming soon.</p>
               </CardContent>
             </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
