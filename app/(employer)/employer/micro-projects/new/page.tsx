"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PostMicroProjectPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-xl">
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Post Micro-Project</h1>
            <p className="text-muted-foreground mt-1 font-medium text-sm">Launch an AI work trial in minutes.</p>
          </div>
        </div>

        <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
           <CardHeader className="bg-primary/5 p-8">
              <div className="flex items-center gap-3 text-primary mb-2">
                 <Sparkles size={20} />
                 <span className="font-bold uppercase tracking-widest text-xs">AI Assisted Listing</span>
              </div>
              <CardTitle className="text-2xl font-black">Project Details</CardTitle>
           </CardHeader>
           <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                 <label className="text-sm font-bold ml-1">Project Title</label>
                 <input 
                    placeholder="e.g. Fine-tune Llama 3 for Medical Coding" 
                    className="w-full h-12 rounded-xl bg-muted px-4 border-none focus:ring-2 ring-primary transition-all font-medium"
                 />
              </div>

              <div className="space-y-2">
                 <label className="text-sm font-bold ml-1">Description & Deliverables</label>
                 <textarea 
                    rows={4}
                    placeholder="Describe what needs to be done..." 
                    className="w-full rounded-xl bg-muted p-4 border-none focus:ring-2 ring-primary transition-all font-medium resize-none"
                 />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-sm font-bold ml-1">Budget (USD)</label>
                    <input 
                       type="number"
                       placeholder="500" 
                       className="w-full h-12 rounded-xl bg-muted px-4 border-none focus:ring-2 ring-primary transition-all font-medium"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-bold ml-1">Timeline (Days)</label>
                    <input 
                       type="number"
                       placeholder="5" 
                       className="w-full h-12 rounded-xl bg-muted px-4 border-none focus:ring-2 ring-primary transition-all font-medium"
                    />
                 </div>
              </div>

              <Button className="w-full h-14 rounded-2xl font-black text-lg gap-2 mt-4 shadow-lg shadow-primary/20">
                 <Send size={20} /> Publish Project
              </Button>
           </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
