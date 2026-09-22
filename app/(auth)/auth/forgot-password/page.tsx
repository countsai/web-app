"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-md space-y-12">
        <div className="space-y-4 text-center">
           <Badge className="bg-primary/10 text-primary border-primary/20 px-6 py-2 rounded-full font-black uppercase tracking-widest text-[10px]">Security Recovery</Badge>
           <h1 className="text-5xl font-black uppercase tracking-tight leading-[0.85]">RESET <span className="text-primary italic">KEY.</span></h1>
           <p className="text-sm text-muted-foreground font-medium italic">Enter your neural identifier to receive a recovery signal.</p>
        </div>

        <div className="space-y-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-40 pl-4">Neural Identifier (Email)</label>
              <div className="relative">
                 <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                 <input className="w-full h-16 pl-16 pr-8 rounded-2xl bg-muted/50 border-2 border-transparent focus:border-primary focus:bg-background outline-none transition-all font-bold placeholder:opacity-20" placeholder="operator@countsai.dev" />
              </div>
           </div>

           <Button className="w-full h-20 rounded-[30px] font-black text-xl uppercase tracking-tighter gap-3 shadow-2xl shadow-primary/20">
              SEND RECOVERY SIGNAL <RefreshCw size={24} />
           </Button>

           <Link href="/auth/login">
              <Button variant="ghost" className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] gap-2 opacity-60 hover:opacity-100">
                 <ArrowLeft size={14} /> Back to Login
              </Button>
           </Link>
        </div>

        <div className="pt-12 border-t border-muted text-center italic opacity-40 font-black uppercase tracking-widest text-[10px]">
           COUNTS AI SECURITY CORE
        </div>
      </div>
    </div>
  );
}
