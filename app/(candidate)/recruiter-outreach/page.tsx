"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Sparkles, Send, Copy, RefreshCcw } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function RecruiterOutreachPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Recruiter Outreach</h1>
          <p className="text-muted-foreground mt-1 font-medium">Generate high-conversion messages for hiring managers.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="border-none shadow-sm rounded-3xl">
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <Sparkles size={20} className="text-primary" /> Context Builder
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Recruiter Profile / LinkedIn URL</label>
                  <Textarea placeholder="Paste LinkedIn profile text or URL here..." className="min-h-[120px] rounded-2xl bg-muted/30 border-none p-4 font-medium" />
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">The Opportunity (Job Link)</label>
                  <Textarea placeholder="Paste job description or link..." className="min-h-[120px] rounded-2xl bg-muted/30 border-none p-4 font-medium" />
               </div>
               <Button className="w-full h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 gap-2">
                  Generate Outreach <Send size={20} />
               </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
             <Card className="border-none shadow-sm rounded-3xl bg-primary/5 border border-primary/10">
                <CardHeader className="flex flex-row items-center justify-between">
                   <CardTitle className="text-lg font-bold">Suggested Message</CardTitle>
                   <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"><RefreshCcw size={16} /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"><Copy size={16} /></Button>
                   </div>
                </CardHeader>
                <CardContent>
                   <div className="p-6 rounded-2xl bg-white border font-medium text-sm leading-relaxed text-foreground/80">
                      Hi [Name],<br /><br />
                      I’ve been following your work at [Company] and noticed your recent focus on [Specific AI Tech]. <br /><br />
                      I’m reaching out because I’ve just completed a Proof-of-Work project that directly addresses the [Challenge] mentioned in your recent job posting for [Role]. <br /><br />
                      I’d love to show you how my verified LLM stack can help [Company] achieve [Goal] in half the time. Do you have 10 minutes next Tuesday?<br /><br />
                      Best,<br />
                      [Your Name]
                   </div>
                </CardContent>
             </Card>

             <Card className="border-none shadow-sm rounded-3xl">
                <CardHeader>
                   <CardTitle className="text-lg font-bold">Best Practices</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   {[
                     "Keep it under 150 words.",
                     "Mention a specific Proof-of-Work project.",
                     "Focus on the employer's problem, not your needs.",
                     "Include a clear, low-friction Call to Action (CTA)."
                   ].map(tip => (
                     <div key={tip} className="flex items-center gap-3 text-sm font-medium">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        {tip}
                     </div>
                   ))}
                </CardContent>
             </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
