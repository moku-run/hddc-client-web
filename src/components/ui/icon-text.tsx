import type { Icon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface IconTextProps {
  icon: Icon;
  children: React.ReactNode;
  className?: string;
  iconClassName?: string;
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
}

/**
 * 아이콘 + 텍스트를 수직 중앙 정렬하는 인라인 컴포넌트.
 * `inline` 아이콘의 baseline 어긋남 문제를 해결합니다.
 */
export function IconText({ icon: IconComp, children, className, iconClassName, weight }: IconTextProps) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)}>
      <IconComp className={cn("size-2.5 shrink-0", iconClassName)} weight={weight} />
      <span>{children}</span>
    </span>
  );
}
