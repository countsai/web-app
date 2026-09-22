"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Bell, Lock, Eye, Shield } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 max-w-4xl">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1 font-medium">Manage your account preferences and data privacy.</p>
        </div>

        <div className="grid gap-6">
           <Card className="border-none shadow-sm rounded-3xl">
              <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                    <Bell size={20} className="text-primary" /> Notifications
                 </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                 {[
                   { title: "New Job Matches", desc: "Get notified when a job fits your skill passport." },
                   { title: "Application Updates", desc: "Updates on your active applications status." },
                   { title: "Skill Roadmap Progress", desc: "Reminders to complete your learning modules." }
                 ].map((item) => (
                   <div key={item.title} className="flex items-center justify-between">
                      <div>
                         <p className="font-bold">{item.title}</p>
                         <p className="text-sm text-muted-foreground font-medium">{item.desc}</p>
                      </div>
                      <Switch defaultChecked />
                   </div>
                 ))}
              </CardContent>
           </Card>

           <Card className="border-none shadow-sm rounded-3xl">
              <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                    <Eye size={20} className="text-primary" /> Privacy & Visibility
                 </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="flex items-center justify-between">
                    <div>
                       <p className="font-bold">Public Skill Passport</p>
                       <p className="text-sm text-muted-foreground font-medium">Allow employers to find you in the Talent Explorer.</p>
                    </div>
                    <Switch defaultChecked />
                 </div>
                 <div className="flex items-center justify-between">
                    <div>
                       <p className="font-bold">Hide from Current Employer</p>
                       <p className="text-sm text-muted-foreground font-medium">Prevent recruiters from your current company from seeing you.</p>
                    </div>
                    <Switch />
                 </div>
              </CardContent>
           </Card>

           <Button variant="destructive" className="rounded-2xl h-14 font-black text-lg">
              Delete Account
           </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
