"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Hammer, Plus, FolderKanban, CheckSquare, Clock, ArrowUpRight } from "lucide-react";

export default function ProofOfWorkPage() {
  const projects = [
    { title: "Multi-Agent Support Bot", status: "Active", progress: 75, tasks: "12/16" },
    { title: "RAG Knowledge Base", status: "Planning", progress: 10, tasks: "2/20" },
    { title: "LLM Fine-tuning Pipeline", status: "Completed", progress: 100, tasks: "25/25" },
  ];

  return (
    <div className="px-4 sm:px-8 max-w-6xl mx-auto space-y-6 sm:space-y-12 py-8 sm:py-16">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
        <div>
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-1.5 rounded-full font-black uppercase tracking-widest text-[10px]">Project Engine</Badge>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight uppercase text-center md:text-left">PROOF OF <span className="text-primary italic">WORK.</span></h1>
        </div>
        <Button className="h-12 sm:h-16 px-6 sm:px-10 rounded-2xl sm:rounded-[32px] font-black text-base sm:text-lg gap-3 shadow-2xl shadow-primary/20 w-full md:w-auto">
           <Plus size={24} /> NEW PROJECT PLAN
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-4 sm:gap-8">
        {projects.map((proj, i) => (
          <div key={i} className="group p-5 sm:p-10 rounded-2xl sm:rounded-[50px] border-2 border-muted bg-background hover:border-primary transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
               <FolderKanban size={120} />
            </div>
            <div className="space-y-8 relative">
               <div className="flex justify-between items-start">
                  <Badge variant={proj.status === 'Completed' ? 'default' : 'secondary'} className="font-black uppercase tracking-widest text-[10px] px-3 py-1">
                     {proj.status}
                  </Badge>
                  <Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl hover:bg-muted">
                     <ArrowUpRight size={20} />
                  </Button>
               </div>
               
               <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase tracking-tight leading-none">{proj.title}</h3>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">AI Engineering Track</p>
               </div>

               <div className="space-y-4">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
                     <span>Progress</span>
                     <span>{proj.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                     <div className="bg-primary h-full transition-all duration-1000" style={{ width: `${proj.progress}%` }} />
                  </div>
               </div>

               <div className="flex items-center gap-6 pt-4 border-t border-muted">
                  <div className="flex items-center gap-2">
                     <CheckSquare size={14} className="text-primary" />
                     <span className="text-xs font-black">{proj.tasks}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                     <Clock size={14} />
                     <span className="text-xs font-bold">2d left</span>
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 sm:p-12 rounded-2xl sm:rounded-[60px] bg-muted/30 border-2 border-muted flex flex-col items-center text-center space-y-6 sm:space-y-8">
         <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl sm:rounded-[32px] bg-background border-2 border-primary/20 flex items-center justify-center text-primary italic shadow-xl">
            <Hammer size={40} />
         </div>
         <div className="space-y-2 max-w-xl">
            <h4 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">Generate a new project blueprint</h4>
            <p className="text-muted-foreground font-medium italic text-sm sm:text-base">Describe what you want to build, and our AI will architect the full technical roadmap, including stack recommendations and milestone tracking.</p>
         </div>
         <Button variant="outline" className="h-12 sm:h-14 px-6 sm:px-12 rounded-2xl font-black text-base sm:text-lg border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all w-full sm:w-auto">Start Architecture Agent</Button>
      </div>
    </div>
  );
}
