"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import {
  Globe,
  MapPin,
  Clock,
  Info,
  ChevronRight,
  Plane,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

interface VisaGuide {
  id: string;
  country: string;
  title: string;
  content: string;
  visa_type: string;
  updated_at: string;
}

export default function VisaGuidePage() {
  const [guides, setGuides] = useState<VisaGuide[] | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("visa_guides")
        .select("id, country, title, content, visa_type, updated_at")
        .order("country", { ascending: true });
      setGuides(data ?? []);
    };
    load();
  }, []);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Visa & Remote Work</h1>
          <p className="text-muted-foreground mt-1 font-medium">Navigating digital nomad visas and global employment for the AI workforce.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Filters/Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-none shadow-sm rounded-3xl p-6">
              <h3 className="font-bold mb-4">Find a Destination</h3>
              <div className="space-y-4">
                <div className="relative">
                  <Globe className="absolute left-3 top-3 text-muted-foreground" size={18} />
                  <Input placeholder="Country or City..." className="pl-10 rounded-xl h-11" />
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Quick Filters</p>
                  {["Digital Nomad Visa", "Tech Hubs", "Low Tax", "Fast Internet"].map(f => (
                    <Button key={f} variant="ghost" className="w-full justify-start rounded-xl text-sm font-medium hover:bg-muted">
                      {f}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="border-none shadow-sm rounded-3xl bg-primary text-primary-foreground p-6">
              <Plane className="mb-4" size={32} />
              <h3 className="text-lg font-bold mb-2">Relocation Concierge</h3>
              <p className="text-xs font-medium text-primary-foreground/80 leading-relaxed mb-6">
                Get professional help with your visa application and relocation logistics.
              </p>
              <Button className="w-full bg-white text-primary hover:bg-white/90 rounded-xl font-bold">
                Talk to an Expert
              </Button>
            </Card>
          </div>

          {/* Guides Grid */}
          <div className="lg:col-span-3">
             {guides === null ? (
               <p className="text-sm font-medium text-muted-foreground">Loading guides…</p>
             ) : guides.length === 0 ? (
               <Card className="border-2 border-dashed border-muted shadow-none rounded-3xl flex flex-col items-center justify-center py-16 text-center px-8">
                 <Globe size={28} className="text-muted-foreground/40 mb-3" />
                 <h3 className="font-black text-base text-muted-foreground/60 mb-1">No guides published yet</h3>
                 <p className="text-sm text-muted-foreground/40 font-medium max-w-sm">Check back soon — our team is adding country guides.</p>
               </Card>
             ) : (
             <div className="grid gap-6 md:grid-cols-2">
              {guides.map((guide) => (
                <Card key={guide.id} className="group border-none shadow-sm rounded-3xl overflow-hidden hover:shadow-xl transition-all cursor-pointer">
                  <div className="h-32 bg-muted relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                    <div className="absolute bottom-4 left-6 flex items-center gap-2">
                       <MapPin size={18} className="text-primary" />
                       <span className="text-xl font-black">{guide.country}</span>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-2 py-1 rounded-lg bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest">
                        {guide.visa_type || "—"}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-bold">
                        <Clock size={12} /> Updated {new Date(guide.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                    <h4 className="text-lg font-bold mb-2">{guide.title || guide.country}</h4>
                    <p className="text-sm text-muted-foreground font-medium mb-6 line-clamp-2">{guide.content || "No description yet."}</p>

                    <Button variant="ghost" className="w-full justify-between rounded-xl font-bold group-hover:bg-primary/5 group-hover:text-primary">
                      Read Full Guide <ChevronRight size={18} />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
             )}

            <Card className="mt-8 border-none shadow-sm rounded-3xl bg-muted/30 border-dashed border-2">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Info size={40} className="text-muted-foreground mb-4" />
                <h3 className="text-xl font-bold mb-2">Remote Work Compliance</h3>
                <p className="max-w-md text-sm text-muted-foreground font-medium mb-6">
                  Check if your current or future employer supports remote work in your desired destination.
                </p>
                <Button variant="outline" className="rounded-xl font-bold px-8">Run Compliance Check</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
