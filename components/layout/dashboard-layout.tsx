"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Search, Bell, Sparkles, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useRole } from "@/lib/role-context";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useRole();
  const isFree = user.subscription_tier === "free";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/90 px-4 sm:px-6 backdrop-blur-md gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Mobile hamburger */}
            <button
              className="lg:hidden flex items-center justify-center h-9 w-9 rounded-xl hover:bg-muted/40 transition-colors shrink-0"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu size={20} className="text-muted-foreground" />
            </button>

            {/* Search — hidden on small mobile */}
            <div className="hidden sm:block flex-1 max-w-sm relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Search jobs, skills, or recruiters..."
                className="pl-9 h-9 rounded-xl bg-muted/40 border-none focus-visible:ring-1 focus-visible:ring-primary/25 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isFree && (
              <Badge className="bg-amber-50 text-amber-600 border-amber-200 font-bold text-[10px] px-3 py-1 rounded-full gap-1 hidden sm:flex">
                <Sparkles size={10} /> 4 trial days left
              </Badge>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-xl h-9 w-9 text-muted-foreground hover:text-foreground"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary border-2 border-background" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
