"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Sparkles, MapPin, DollarSign, BrainCircuit, Bookmark } from "lucide-react";

export default function JobMatchesPage() {
  const jobs = [
    { title: "AI Technical Lead", company: "OpenAI", location: "San Francisco / Remote", salary: "$250k - $400k", match: "99%", tags: ["Agentic", "Python", "LLMs"] },
    { title: "Senior ML Engineer", company: "Mistral AI", location: "Paris / Remote", salary: "€120k - €180k", match: "94%", tags: ["PyTorch", "Scaling", "Inference"] },
    { title: "Product Architect (AI)", company: "Anthropic", location: "London / Remote", salary: "$200k - $320k", match: "92%", tags: ["Product", "Safety", "UX"] },
  ];

  return (
    <div className="px-4 sm:px-8 max-w-6xl mx-auto space-y-6 sm:space-y-12 py-8 sm:py-16">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 md:gap-8">
        <div>
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-1.5 rounded-full font-black uppercase tracking-widest text-[10px]">Neural Matching</Badge>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight uppercase">JOB <span className="text-primary italic">MATCHES.</span></h1>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
           <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                 className="h-12 sm:h-14 pl-12 pr-4 rounded-2xl bg-muted/50 border-2 border-transparent focus:border-primary focus:bg-background outline-none transition-all font-bold w-full sm:w-64"
                 placeholder="Search matches..."
              />
           </div>
           <Button variant="outline" className="h-12 sm:h-14 w-12 sm:w-14 rounded-2xl border-2 p-0 shrink-0">
              <Filter size={20} />
           </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-8">
        {jobs.map((job, i) => (
          <div key={i} className="group p-4 sm:p-10 rounded-2xl sm:rounded-[50px] bg-background border-2 border-muted hover:border-primary transition-all duration-300 flex flex-col md:flex-row items-center gap-4 sm:gap-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
               <BrainCircuit size={140} />
            </div>

            <div className="h-16 w-16 sm:h-24 sm:w-24 rounded-2xl sm:rounded-[32px] bg-primary text-primary-foreground flex items-center justify-center text-2xl sm:text-4xl font-black italic shadow-2xl shadow-primary/20 shrink-0">
               {job.company[0]}
            </div>

            <div className="flex-1 space-y-4 text-center md:text-left relative">
               <div className="space-y-1">
                  <div className="flex flex-col md:flex-row items-center gap-3">
                     <h3 className="text-xl sm:text-3xl font-black uppercase tracking-tight">{job.title}</h3>
                     <Badge className="bg-primary/10 text-primary border-primary/20 font-black uppercase tracking-widest text-[10px] py-1 px-3">
                        {job.match} Match
                     </Badge>
                  </div>
                  <p className="font-bold text-muted-foreground uppercase tracking-widest text-sm">{job.company}</p>
               </div>
               
               <div className="flex flex-wrap justify-center md:justify-start gap-6">
                  <div className="flex items-center gap-2 text-xs font-bold opacity-60">
                     <MapPin size={14} className="text-primary" /> {job.location}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold opacity-60">
                     <DollarSign size={14} className="text-primary" /> {job.salary}
                  </div>
               </div>

               <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
                  {job.tags.map(tag => (
                     <Badge key={tag} variant="secondary" className="rounded-lg font-bold text-[10px] uppercase px-3">{tag}</Badge>
                  ))}
               </div>
            </div>

            <div className="flex gap-4 relative">
               <Button variant="outline" className="h-16 w-16 rounded-2xl border-2 p-0 hover:bg-muted">
                  <Bookmark size={24} />
               </Button>
               <Button className="h-16 px-10 rounded-2xl font-black text-lg gap-2 shadow-xl shadow-primary/20">
                  APPLY <Sparkles size={18} />
               </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center py-12">
         <p className="text-muted-foreground font-medium mb-6 italic">Not seeing what you are looking for? Our AI scouts are scanning 24/7.</p>
         <Button variant="link" className="font-black uppercase tracking-widest text-xs gap-2">Load More Neural Matches</Button>
      </div>
    </div>
  );
}
