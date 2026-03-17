import { DotsSixVertical } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface DragHandleProps {
  size?: "sm" | "default";
  className?: string;
  [key: string]: unknown;
}

export function DragHandle({ size = "default", className, ...listeners }: DragHandleProps) {
  return (
    <div
      {...listeners}
      className={cn(
        "flex shrink-0 cursor-grab items-center touch-none text-muted-foreground/50 transition-colors hover:text-muted-foreground active:cursor-grabbing",
        className,
      )}
    >
      <DotsSixVertical className={size === "sm" ? "size-4" : "size-5"} weight="bold" />
    </div>
  );
}
