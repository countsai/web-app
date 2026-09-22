"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Cpu, Globe, Terminal, CheckCircle2, ListTodo } from "lucide-react";
import { GithubIcon } from "@/components/shared/icons";
import { useRouter } from "next/navigation";

export default function ProofOfWorkDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-xl">
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Project Plan Detail</h1>
            <p className="text-muted-foreground mt-1 font-medium font-mono text-xs uppercase tracking-widest">Project: {params.id}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="p-8 pb-0">
                <div className="flex items-center gap-4 text-primary mb-2">
                   <Cpu size={32} />
                   <span className="font-black text-sm uppercase tracking-widest">AI Engineering Track</span>
                </div>
                <CardTitle className="text-4xl font-black leading-tight">RAG-based Customer Support Bot</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="prose prose-sm max-w-none text-muted-foreground font-medium leading-relaxed">
                   <p className="text-lg text-foreground mb-6">A production-grade support agent capable of handling complex multi-turn inquiries with 98% factual accuracy using proprietary documentation.</p>
                   
                   <h4 className="text-foreground font-black text-xl mb-4">Milestones</h4>
                   <div className="space-y-6">
                      {[
                        { title: "Architecture Design", status: "completed", desc: "Define vector database schema and retrieval logic." },
                        { title: "Dataset Ingestion", status: "completed", desc: "Clean and chunk 500+ pages of internal docs." },
                        { title: "Frontend Implementation", status: "in-progress", desc: "Build the chat interface using Next.js 16 and Tailwind." },
                        { title: "Evaluation Framework", status: "pending", desc: "Implement RAGAS for performance monitoring." }
                      ].map((m, i) => (
                        <div key={i} className="flex gap-4">
                           <div className={`h-6 w-6 rounded-lg flex items-center justify-center shrink-0 ${
                             m.status === 'completed' ? 'bg-primary text-white' : m.status === 'in-progress' ? 'bg-amber-500 text-white' : 'bg-muted'
                           }`}>
                              {m.status === 'completed' ? <CheckCircle2 size={14} /> : <ListTodo size={14} />}
                           </div>
                           <div>
                              <p className="font-bold text-foreground">{m.title}</p>
                              <p className="text-xs">{m.desc}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
               <CardHeader>
                  <CardTitle className="text-xl font-black">Tech Stack</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="flex flex-wrap gap-3">
                     {["LangChain", "OpenAI", "Pinecone", "Next.js", "TypeScript", "Python"].map(t => (
                       <div key={t} className="px-4 py-2 rounded-xl bg-muted font-bold text-sm">{t}</div>
                     ))}
                  </div>
               </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
             <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-foreground text-background">
                <CardHeader>
                   <CardTitle className="text-lg font-bold">Proof Assets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                   <Button className="w-full h-12 rounded-xl font-bold gap-2 bg-background text-foreground hover:bg-background/90">
                      <GithubIcon size={18} /> View Repository
                   </Button>
                   <Button className="w-full h-12 rounded-xl font-bold gap-2 bg-primary text-white border-none">
                      <Globe size={18} /> Live Demo
                   </Button>
                   <Button variant="outline" className="w-full h-12 rounded-xl font-bold gap-2 border-background/20 hover:bg-background/10">
                      <Terminal size={18} /> Test API
                   </Button>
                </CardContent>
             </Card>

             <Card className="border-none shadow-sm rounded-3xl overflow-hidden border border-accent/20 bg-accent/5">
                <CardContent className="p-6">
                   <p className="text-xs font-black uppercase tracking-widest text-accent mb-2">Verified Skill Gain</p>
                   <div className="space-y-4">
                      <div>
                         <div className="flex justify-between text-sm font-bold mb-1">
                            <span>RAG Implementation</span>
                            <span>+150 XP</span>
                         </div>
                         <div className="h-2 w-full bg-accent/10 rounded-full overflow-hidden">
                            <div className="h-full bg-accent w-[85%]" />
                         </div>
                      </div>
                      <div>
                         <div className="flex justify-between text-sm font-bold mb-1">
                            <span>Vector Database Management</span>
                            <span>+120 XP</span>
                         </div>
                         <div className="h-2 w-full bg-accent/10 rounded-full overflow-hidden">
                            <div className="h-full bg-accent w-[60%]" />
                         </div>
                      </div>
                   </div>
                </CardContent>
             </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
