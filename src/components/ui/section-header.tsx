import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  badge?: React.ReactNode;
  className?: string;
}

export function SectionHeader({ title, badge, className }: SectionHeaderProps) {
  if (badge) {
    return (
      <div className={cn("flex items-center justify-between", className)}>
        <h3 className="text-sm font-semibold">{title}</h3>
        <span className="text-[10px] text-muted-foreground">{badge}</span>
      </div>
    );
  }

  return <h3 className={cn("text-sm font-semibold", className)}>{title}</h3>;
}
