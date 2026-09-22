"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { User, Bell, Lock, Globe, CreditCard } from "lucide-react";

export default function EmployerSettingsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1 font-medium">Manage your company account and preferences.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
           <div className="md:col-span-1 space-y-2">
              {[
                { label: "Profile", icon: User },
                { label: "Notifications", icon: Bell },
                { label: "Security", icon: Lock },
                { label: "Billing", icon: CreditCard },
                { label: "Public Page", icon: Globe },
              ].map((item, i) => (
                <Button key={i} variant={i === 0 ? "secondary" : "ghost"} className="w-full justify-start rounded-xl font-bold gap-3 h-12">
                   <item.icon size={18} />
                   {item.label}
                </Button>
              ))}
           </div>

           <div className="md:col-span-2 space-y-6">
              <Card className="border-none shadow-sm rounded-3xl">
                 <CardHeader>
                    <CardTitle className="text-xl font-bold">Account Privacy</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                       <div>
                          <p className="font-bold">Public Company Profile</p>
                          <p className="text-sm text-muted-foreground">Allow candidates to browse your company details and open roles.</p>
                       </div>
                       <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                       <div>
                          <p className="font-bold">Show Salary Ranges</p>
                          <p className="text-sm text-muted-foreground">Display estimated salary ranges on all your job postings.</p>
                       </div>
                       <Switch defaultChecked />
                    </div>
                 </CardContent>
              </Card>

              <Card className="border-none shadow-sm rounded-3xl">
                 <CardHeader>
                    <CardTitle className="text-xl font-bold">Notifications</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                       <div>
                          <p className="font-bold">Applicant Alerts</p>
                          <p className="text-sm text-muted-foreground">Get notified when a highly matched candidate applies.</p>
                       </div>
                       <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                       <div>
                          <p className="font-bold">Message Notifications</p>
                          <p className="text-sm text-muted-foreground">Receive emails for new messages from candidates.</p>
                       </div>
                       <Switch defaultChecked />
                    </div>
                 </CardContent>
              </Card>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
