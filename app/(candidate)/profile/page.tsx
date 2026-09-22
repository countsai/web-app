"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Globe, MapPin, Edit3, Briefcase, GraduationCap, Award } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/shared/icons";

export default function ProfilePage() {
  return (
    <div className="px-4 sm:px-8 max-w-6xl mx-auto space-y-6 sm:space-y-12 py-8 sm:py-16">
      <div className="p-5 sm:p-12 rounded-3xl sm:rounded-[60px] bg-muted/30 border-2 border-muted flex flex-col md:flex-row items-center gap-6 sm:gap-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5">
           <User size={200} />
        </div>
        <div className="h-28 w-28 sm:h-48 sm:w-48 rounded-3xl sm:rounded-[48px] bg-primary flex items-center justify-center text-primary-foreground text-5xl sm:text-7xl font-black italic shadow-2xl shadow-primary/30 shrink-0">
           JD
        </div>
        <div className="space-y-4 sm:space-y-6 text-center md:text-left flex-1">
           <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight uppercase">Jane <span className="text-primary">Doe.</span></h1>
              <p className="text-base sm:text-xl font-bold uppercase tracking-widest opacity-60">AI Content Architect & Strategist</p>
           </div>
           <div className="flex flex-wrap gap-3 sm:gap-6 justify-center md:justify-start">
              <div className="flex items-center gap-2 font-bold text-sm">
                 <Mail size={16} className="text-primary" /> jane@countsai.dev
              </div>
              <div className="flex items-center gap-2 font-bold text-sm">
                 <MapPin size={16} className="text-primary" /> Remote / London
              </div>
              <div className="flex items-center gap-2 font-bold text-sm">
                 <Globe size={16} className="text-primary" /> janedoe.ai
              </div>
           </div>
           <div className="flex gap-4 justify-center md:justify-start">
              <Button size="icon" variant="outline" className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl border-2"><GithubIcon size={18} /></Button>
              <Button size="icon" variant="outline" className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl border-2"><LinkedinIcon size={18} /></Button>
              <Button className="h-10 sm:h-12 px-5 sm:px-8 rounded-xl font-black gap-2 text-sm">Edit Profile <Edit3 size={16} /></Button>
           </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 md:gap-12">
         <div className="md:col-span-2 space-y-6 sm:space-y-12">
            <section className="space-y-6">
               <div className="flex items-center gap-4">
                  <Briefcase className="text-primary" />
                  <h2 className="text-2xl font-black uppercase tracking-tight">EXPERIENCE</h2>
               </div>
               <div className="space-y-6">
                  {[
                     { role: "Senior AI Strategist", company: "Future Work Lab", period: "2024 - Present" },
                     { role: "Content Director", company: "Viral Systems", period: "2021 - 2023" }
                  ].map((exp, i) => (
                     <div key={i} className="p-5 sm:p-8 rounded-2xl sm:rounded-[32px] border-2 border-muted bg-background relative group">
                        <Badge className="absolute top-4 right-4 sm:top-8 sm:right-8 bg-muted text-muted-foreground border-none font-black text-[10px] uppercase tracking-widest">{exp.period}</Badge>
                        <h3 className="text-xl font-black uppercase tracking-tight mb-1">{exp.role}</h3>
                        <p className="font-bold text-primary text-sm uppercase tracking-wider">{exp.company}</p>
                     </div>
                  ))}
               </div>
            </section>

            <section className="space-y-6">
               <div className="flex items-center gap-4">
                  <GraduationCap className="text-primary" />
                  <h2 className="text-2xl font-black uppercase tracking-tight">EDUCATION</h2>
               </div>
               <div className="p-5 sm:p-8 rounded-2xl sm:rounded-[32px] border-2 border-muted bg-background">
                  <h3 className="text-xl font-black uppercase tracking-tight mb-1">MSc Cognitive Science</h3>
                  <p className="font-bold text-primary text-sm uppercase tracking-wider">University of Oxford</p>
               </div>
            </section>
         </div>

         <div className="space-y-6 sm:space-y-12">
            <section className="space-y-6">
               <div className="flex items-center gap-4">
                  <Award className="text-primary" />
                  <h2 className="text-2xl font-black uppercase tracking-tight">SKILL PASSPORT</h2>
               </div>
               <div className="p-5 sm:p-10 rounded-2xl sm:rounded-[40px] bg-primary text-primary-foreground space-y-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Passport ID: CAI-882-991</p>
                  <div className="space-y-4">
                     {["Agentic Workflow Design", "Prompt Engineering V3", "Retrieval Augmented Gen", "Vector Database Ops"].map((s, i) => (
                        <div key={i} className="flex items-center gap-3">
                           <div className="h-2 w-2 rounded-full bg-white" />
                           <span className="font-black text-sm uppercase tracking-tight">{s}</span>
                        </div>
                     ))}
                  </div>
                  <Button variant="secondary" className="w-full h-12 rounded-xl font-black text-xs">Download Passport</Button>
               </div>
            </section>

            <div className="p-5 sm:p-8 rounded-2xl sm:rounded-[40px] border-2 border-muted bg-muted/30 text-center space-y-4">
               <p className="font-black uppercase tracking-widest text-[10px] opacity-40">Profile Visibility</p>
               <h4 className="text-xl font-black uppercase text-primary">PUBLIC</h4>
               <p className="text-xs font-medium text-muted-foreground">Your profile is currently visible to verified employers.</p>
               <Button variant="outline" className="w-full h-10 rounded-lg border-2 font-bold text-xs">Change Settings</Button>
            </div>
         </div>
      </div>
    </div>
  );
}
