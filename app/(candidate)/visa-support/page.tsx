"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe2, Plane, ShieldCheck, MapPin, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface VisaGuide {
  id: string;
  country: string;
  visa_type: string;
  processing_time: string;
  sponsorship_likelihood: string;
}

export default function VisaSupportPage() {
  const [guides, setGuides] = useState<VisaGuide[] | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("visa_guides")
        .select("id, country, visa_type, processing_time, sponsorship_likelihood")
        .order("country", { ascending: true });
      setGuides(data ?? []);
    };
    load();
  }, []);

  return (
    <div className="px-4 sm:px-8 max-w-6xl mx-auto space-y-6 sm:space-y-12 py-8 sm:py-16">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 md:gap-8">
        <div className="max-w-2xl">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-1.5 rounded-full font-black uppercase tracking-widest text-[10px]">Global Mobility</Badge>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight uppercase">VISA & <span className="text-primary italic">REMOTE SUPPORT.</span></h1>
          <p className="text-base sm:text-xl text-muted-foreground font-medium mt-4">Navigate international work regulations and secure your future in AI hubs worldwide.</p>
        </div>
        <div className="bg-muted/30 p-6 rounded-[32px] border border-muted flex items-center gap-4">
           <div className="h-12 w-12 rounded-2xl bg-background flex items-center justify-center text-primary border border-primary/20">
              <Globe2 size={24} />
           </div>
           <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Global Reach</p>
              <p className="font-bold text-lg leading-none">{guides === null ? "—" : guides.length} Countries</p>
           </div>
        </div>
      </div>

      {guides === null ? (
        <p className="text-sm font-medium text-muted-foreground">Loading guides…</p>
      ) : guides.length === 0 ? (
        <div className="rounded-2xl sm:rounded-[40px] border-2 border-dashed border-muted p-10 sm:p-16 text-center">
          <Globe2 size={28} className="mx-auto mb-3 text-muted-foreground/40" />
          <h3 className="text-lg font-black text-muted-foreground/60 mb-1">No guides published yet</h3>
          <p className="text-sm text-muted-foreground/40 font-medium max-w-sm mx-auto">Check back soon — our team is adding country guides.</p>
        </div>
      ) : (
      <div className="grid md:grid-cols-3 gap-4 sm:gap-8">
        {guides.map((reg) => (
          <div key={reg.id} className="group p-5 sm:p-8 rounded-2xl sm:rounded-[40px] border-2 border-muted bg-background hover:border-primary transition-all duration-300 space-y-6 sm:space-y-8">
            <div className="space-y-2">
               <div className="flex items-center gap-2 text-primary">
                  <MapPin size={16} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">{reg.country}</span>
               </div>
               <h3 className="text-2xl font-black uppercase tracking-tight">{reg.visa_type || "—"}</h3>
            </div>

            <div className="space-y-4">
               <div className="flex justify-between items-center text-sm">
                  <span className="font-bold opacity-40 uppercase tracking-widest text-[10px]">Processing</span>
                  <span className="font-black uppercase tracking-tight">{reg.processing_time || "—"}</span>
               </div>
               {reg.sponsorship_likelihood && (
                 <div className="flex justify-between items-center text-sm">
                    <span className="font-bold opacity-40 uppercase tracking-widest text-[10px]">Sponsorship Outlook</span>
                    <Badge className="bg-primary/10 text-primary border-primary/20 font-black uppercase tracking-widest text-[9px]">{reg.sponsorship_likelihood}</Badge>
                 </div>
               )}
            </div>

            <Button variant="outline" className="w-full h-12 rounded-xl font-bold border-2 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all">View Requirements</Button>
          </div>
        ))}
      </div>
      )}

      <div className="grid md:grid-cols-2 gap-4 sm:gap-8">
         <div className="p-5 sm:p-10 rounded-2xl sm:rounded-[50px] bg-muted/20 border border-muted space-y-6">
            <h4 className="text-xl font-black uppercase tracking-tight">EXPERT ASSISTANCE</h4>
            <p className="text-muted-foreground font-medium">Connect with certified immigration consultants specializing in high-tech talent mobility.</p>
            <div className="flex flex-wrap gap-3">
               {["Legal Review", "Tax Optimization", "Housing Support", "Family Relocation"].map((s, i) => (
                  <Badge key={i} variant="secondary" className="px-4 py-2 rounded-lg font-bold">{s}</Badge>
               ))}
            </div>
            <Button className="h-14 px-8 rounded-2xl font-black text-lg w-full md:w-auto">Book Consultation</Button>
         </div>

         <div className="p-5 sm:p-10 rounded-2xl sm:rounded-[50px] bg-background border-2 border-dashed border-muted flex flex-col justify-center space-y-6 relative overflow-hidden">
            <Plane className="absolute -right-8 -top-8 text-muted-foreground opacity-10" size={160} />
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                 <ShieldCheck className="text-muted-foreground" size={32} />
                 <h4 className="text-xl font-black uppercase tracking-tight">REMOTE COMPLIANCE CHECK</h4>
              </div>
              <Badge className="bg-muted text-muted-foreground border-border shrink-0">Coming Soon</Badge>
            </div>
            <p className="text-sm font-medium text-muted-foreground leading-relaxed">
               An AI agent that reviews international labor laws to confirm your employment contract is valid across borders — coming soon.
            </p>
            <Button variant="outline" disabled className="h-12 px-6 rounded-xl font-bold border-2 w-full md:w-auto opacity-60">
              <Sparkles size={16} className="mr-2" /> Coming Soon
            </Button>
         </div>
      </div>
    </div>
  );
}
