import type { Icon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface ActionPillProps {
  icon: Icon;
  label: string;
  active?: boolean;
  activeClassName?: string;
  hoverClassName?: string;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
}

/**
 * 토글 가능한 액션 pill 버튼.
 * active 시 색상 배경 + 흰 텍스트로 반전됩니다.
 * hoverClassName으로 hover 시 텍스트 색상을 커스텀할 수 있습니다.
 */
export function ActionPill({
  icon: IconComp,
  label,
  active = false,
  activeClassName = "bg-primary text-white",
  hoverClassName = "hover:text-foreground",
  onClick,
  className,
}: ActionPillProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium transition-colors",
        active
          ? activeClassName
          : cn("bg-muted text-muted-foreground", hoverClassName),
        className,
      )}
    >
      <IconComp className="size-3" weight={active ? "fill" : "regular"} />
      {label}
    </button>
  );
}
