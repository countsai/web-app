"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  MessageSquare, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MOCK_APPLICATIONS } from "@/lib/mock-data";

export default function ApplicantsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">Applicants</h1>
            <p className="text-muted-foreground mt-1 font-medium">Review and manage your incoming talent pipeline.</p>
          </div>
          <div className="flex items-center gap-3">
             <SelectJob />
             <Button variant="outline" className="rounded-xl h-11 px-4 gap-2 font-bold">
               <Download size={18} /> Export
             </Button>
          </div>
        </div>

        <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
          <div className="p-4 border-b bg-muted/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
               <div className="relative w-64">
                 <Search className="absolute left-3 top-2.5 text-muted-foreground" size={16} />
                 <Input placeholder="Search applicants..." className="pl-9 h-10 rounded-lg text-sm" />
               </div>
               <Button variant="ghost" size="sm" className="font-bold text-xs gap-1.5 h-10 px-3">
                 <Filter size={14} /> Filter
               </Button>
            </div>
            <div className="flex gap-1">
              {['All', 'Pending', 'Interview', 'Hired', 'Rejected'].map(s => (
                <Button key={s} variant="ghost" size="sm" className={`h-9 px-4 rounded-lg text-xs font-bold ${s === 'All' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}>
                  {s}
                </Button>
              ))}
            </div>
          </div>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b bg-muted/5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <th className="px-6 py-4">Candidate</th>
                    <th className="px-6 py-4">Match Score</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Applied</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_APPLICATIONS.map((app) => (
                    <tr key={app.id} className="border-b hover:bg-muted/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border rounded-xl">
                            <AvatarImage src={app.candidate?.avatar_url} />
                            <AvatarFallback>{app.candidate?.full_name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-sm">{app.candidate?.full_name}</p>
                            <p className="text-[10px] font-bold text-muted-foreground">{app.candidate?.headline}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-primary/10 text-primary border-none font-black h-6 px-2 text-[10px]">
                             {app.ai_match_score}%
                          </Badge>
                          <Sparkles size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <Badge className={`capitalize h-6 px-2 text-[10px] font-bold ${
                           app.status === 'screening' ? 'bg-accent/10 text-accent' : 
                           app.status === 'offer' ? 'bg-green-500/10 text-green-600' :
                           'bg-muted text-muted-foreground'
                         }`}>
                           {app.status}
                         </Badge>

                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-bold text-muted-foreground">
                          {new Date(app.applied_at).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary">
                             <MessageSquare size={16} />
                           </Button>
                           <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-green-500/10 hover:text-green-600">
                             <CheckCircle2 size={16} />
                           </Button>
                           <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-destructive/10 hover:text-destructive">
                             <XCircle size={16} />
                           </Button>
                           <Button variant="outline" size="sm" className="h-9 rounded-xl font-bold ml-2 text-xs">
                             View
                           </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function SelectJob() {
  return (
    <div className="bg-card border rounded-xl px-4 py-2.5 flex items-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors h-11">
      <Users size={18} className="text-muted-foreground" />
      <span className="text-sm font-bold">AI Product Manager</span>
      <Clock size={14} className="text-muted-foreground" />
    </div>
  );
}
