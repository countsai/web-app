import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  variant?: "default" | "outline" | "secondary" | "destructive";
  className?: string;
}

export function StatusBadge({ status, variant = "secondary", className }: StatusBadgeProps) {
  const getStatusStyles = (s: string) => {
    const normalized = s.toLowerCase();
    
    // Application Statuses
    if (normalized === "interview" || normalized === "offer") return "bg-accent/10 text-accent border-accent/20";
    if (normalized === "applied" || normalized === "screening") return "bg-primary/10 text-primary border-primary/20";
    if (normalized === "rejected") return "bg-destructive/10 text-destructive border-destructive/20";
    
    // AI Impact / Risk
    if (normalized === "low") return "bg-accent/10 text-accent border-accent/20";
    if (normalized === "medium") return "bg-warning/10 text-warning border-warning/20";
    if (normalized === "high" || normalized === "critical") return "bg-destructive/10 text-destructive border-destructive/20";
    
    return "bg-muted text-muted-foreground border-border";
  };

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border",
        getStatusStyles(status),
        className
      )}
    >
      {status}
    </Badge>
  );
}
