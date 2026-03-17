import type { Icon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface AdminStatCardProps {
  icon: Icon;
  label: string;
  value: string | number;
  change?: string;
  variant?: "default" | "destructive";
}

export function AdminStatCard({
  icon: Icon,
  label,
  value,
  change,
  variant = "default",
}: AdminStatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4" />
        <span className="text-xs">{label}</span>
      </div>
      <div className="mt-1 text-2xl font-bold tabular-nums">{typeof value === "number" ? value.toLocaleString() : value}</div>
      {change && (
        <span
          className={cn(
            "mt-0.5 inline-block text-[11px]",
            variant === "destructive" ? "text-destructive" : "text-muted-foreground",
          )}
        >
          {change}
        </span>
      )}
    </div>
  );
}
