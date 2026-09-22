"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, User, Briefcase, GraduationCap, Globe } from "lucide-react";

import { useRole } from "@/lib/role-context";

export default function ProfileEditPage() {
  const { user } = useRole();

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Edit Profile</h1>
            <p className="text-muted-foreground mt-1 font-medium">Update your skill passport and personal information.</p>
          </div>
          <Button className="rounded-xl font-bold shadow-lg shadow-primary/20 gap-2">
            <Save size={18} /> Save Changes
          </Button>
        </div>

        <div className="grid gap-8">
           <Card className="border-none shadow-sm rounded-3xl">
              <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                    <User size={20} className="text-primary" /> Personal Information
                 </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                       <Input defaultValue={user.full_name} className="h-12 rounded-xl bg-muted/30 border-none" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Professional Headline</label>
                       <Input defaultValue="AI Product Designer & LLM Engineer" className="h-12 rounded-xl bg-muted/30 border-none" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Bio</label>
                    <Textarea defaultValue="Passionate about building intuitive AI-driven experiences. 5+ years experience in product design." className="min-h-[100px] rounded-2xl bg-muted/30 border-none" />
                 </div>
              </CardContent>
           </Card>

           <Card className="border-none shadow-sm rounded-3xl">
              <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                    <Briefcase size={20} className="text-primary" /> Social & Links
                 </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">LinkedIn</label>
                       <div className="relative">
                          <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                          <Input placeholder="linkedin.com/in/username" className="h-12 pl-10 rounded-xl bg-muted/30 border-none" />

                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">GitHub</label>
                       <div className="relative">
                          <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                          <Input placeholder="github.com/username" className="h-12 pl-10 rounded-xl bg-muted/30 border-none" />

                       </div>
                    </div>
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
