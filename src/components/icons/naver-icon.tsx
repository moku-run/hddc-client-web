import type { SVGProps } from "react";

export function NaverIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" {...props}>
      <path d="M48 40h48l40 60V40h48v176h-48l-40-60v60H48V40z" />
    </svg>
  );
}
