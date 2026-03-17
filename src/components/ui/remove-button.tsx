import { X } from "@phosphor-icons/react";

/**
 * Consistent "remove/reset" inline button used across the dashboard.
 * Examples: "X 사진 제거", "X 배경 제거", "X 초기화"
 */
export function RemoveButton({
  label,
  onClick,
}: {
  label: string;
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex cursor-pointer items-center gap-0.5 text-[11px] text-destructive hover:opacity-70"
    >
      <X className="size-3" weight="bold" />
      {label}
    </button>
  );
}
