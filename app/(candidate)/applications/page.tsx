"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MoreHorizontal, Briefcase, Clock, CheckCircle2 } from "lucide-react";

export default function ApplicationsPage() {
  const apps = [
    { company: "OpenAI", role: "AI Technical Writer", status: "Interviewing", date: "2 days ago", logo: "O" },
    { company: "Anthropic", role: "Prompt Engineer", status: "Applied", date: "5 days ago", logo: "A" },
    { company: "Mistral AI", role: "Product Manager", status: "Rejected", date: "1 week ago", logo: "M" },
    { company: "Perplexity", role: "Content Designer", status: "Applied", date: "2 weeks ago", logo: "P" },
  ];

  return (
    <div className="px-4 sm:px-8 max-w-6xl mx-auto space-y-6 sm:space-y-12 py-8 sm:py-16">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 md:gap-8">
        <div>
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-1.5 rounded-full font-black uppercase tracking-widest text-[10px]">Command Center</Badge>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight uppercase">APPLICATION <span className="text-primary italic">TRACKER.</span></h1>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
           <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                 className="h-12 sm:h-14 pl-12 pr-4 rounded-2xl bg-muted/50 border-2 border-transparent focus:border-primary focus:bg-background outline-none transition-all font-bold w-full sm:w-64"
                 placeholder="Search applications..."
              />
           </div>
           <Button variant="outline" className="h-12 sm:h-14 w-12 sm:w-14 rounded-2xl border-2 p-0 shrink-0">
              <Filter size={20} />
           </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6">
        {apps.map((app, i) => (
          <div key={i} className="group p-4 sm:p-8 rounded-2xl sm:rounded-[40px] bg-background border-2 border-muted hover:border-primary transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-8">
            <div className="flex items-center gap-4 sm:gap-6 w-full md:w-auto">
               <div className="h-14 w-14 sm:h-20 sm:w-20 rounded-2xl sm:rounded-[28px] bg-primary text-primary-foreground flex items-center justify-center text-2xl sm:text-3xl font-black italic shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform shrink-0">
                  {app.logo}
               </div>
               <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight">{app.role}</h3>
                  <p className="font-bold text-muted-foreground uppercase tracking-widest text-xs">{app.company}</p>
               </div>
            </div>

            <div className="flex items-center gap-6 sm:gap-12 w-full md:w-auto justify-between md:justify-end">
               <div className="text-center md:text-left space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Status</p>
                  <div className="flex items-center gap-2">
                     {app.status === 'Interviewing' ? <Clock className="text-primary animate-pulse" size={16} /> :
                      app.status === 'Applied' ? <Briefcase className="text-muted-foreground" size={16} /> :
                      <CheckCircle2 className="text-red-500" size={16} />}
                     <span className={`text-sm font-black uppercase tracking-tighter ${
                        app.status === 'Interviewing' ? 'text-primary' :
                        app.status === 'Rejected' ? 'text-red-500' :
                        'text-muted-foreground'
                     }`}>{app.status}</span>
                  </div>
               </div>

               <div className="text-center md:text-left space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Activity</p>
                  <p className="text-sm font-bold uppercase">{app.date}</p>
               </div>

               <Button variant="ghost" className="h-12 w-12 rounded-2xl hover:bg-muted p-0">
                  <MoreHorizontal size={20} />
               </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-5 sm:p-10 rounded-2xl sm:rounded-[50px] bg-primary text-primary-foreground flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-8">
         <div className="space-y-2 text-center md:text-left">
            <h4 className="text-xl sm:text-2xl font-black uppercase tracking-tight">Need to follow up?</h4>
            <p className="font-medium opacity-80 text-sm sm:text-base">Our AI can draft a professional follow-up message for your active applications.</p>
         </div>
         <Button variant="secondary" className="h-12 sm:h-16 px-6 sm:px-10 rounded-2xl font-black text-base sm:text-lg shrink-0">Draft Messages</Button>
      </div>
    </div>
  );
}
