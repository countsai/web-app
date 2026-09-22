import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import * as Icons from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: keyof typeof Icons;
  trend?: {
    value: number;
    isUp: boolean;
  };
  className?: string;
}

export function StatCard({ label, value, icon, trend, className }: StatCardProps) {
  const Icon = Icons[icon] as any;

  return (
    <Card className={cn("overflow-hidden border-none shadow-sm bg-card/50 backdrop-blur-sm", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon size={20} />
          </div>
          {trend && (
            <div className={cn(
              "flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-full",
              trend.isUp ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"
            )}>
              {trend.isUp ? <Icons.ArrowUpRight size={12} /> : <Icons.ArrowDownRight size={12} />}
              {trend.value}%
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
          <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
