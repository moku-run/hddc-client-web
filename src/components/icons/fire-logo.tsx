import { cn } from "@/lib/utils";

interface FireLogoProps {
  className?: string;
  /** 안쪽 컷아웃 색상 (기본: 배경색) */
  bgColor?: string;
}

export function FireLogo({ className, bgColor = "var(--background)" }: FireLogoProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" className={cn("shrink-0", className)}>
      <path d="M128,240a80,80,0,0,1-80-80c0-40,24-72,40-92l28,28,24-64C156,44,208,88,208,160A80,80,0,0,1,128,240Z" />
      <path d="M128,240a40,40,0,0,1-40-40c0-20,12-36,20-46l14,14,12-32c8,6,34,28,34,64A40,40,0,0,1,128,240Z" fill={bgColor} />
    </svg>
  );
}

/** 파비콘 스타일 HOT 라벨 — 틸 원 + 흰 불꽃 + 틸 컷아웃 */
export function HotLabel({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className={cn("shrink-0 drop-shadow-sm", className)}>
      <circle cx="128" cy="128" r="128" fill="var(--primary)" />
      <path d="M128,240a80,80,0,0,1-80-80c0-40,24-72,40-92l28,28,24-64C156,44,208,88,208,160A80,80,0,0,1,128,240Z" fill="white" />
      <path d="M128,240a40,40,0,0,1-40-40c0-20,12-36,20-46l14,14,12-32c8,6,34,28,34,64A40,40,0,0,1,128,240Z" fill="var(--primary)" />
    </svg>
  );
}
