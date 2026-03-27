"use client";

import { CursorClick, Heart, ArrowSquareOut } from "@phosphor-icons/react";
import { HotLabel } from "@/components/icons/fire-logo";
import { cn } from "@/lib/utils";
import { R2Image } from "@/components/ui/r2-image";
import { useEditFocus, type EditSection } from "@/contexts/edit-focus-context";
import type { ProfileData, ProfileLink } from "@/lib/profile-types";

export function formatPrice(n: number) { return n.toLocaleString("ko-KR"); }

/* ─── Highlight wrapper (edit focus) ─── */

export function HighlightWrapper({
  section, className, inset, overlay, children,
}: {
  section: EditSection;
  className?: string;
  inset?: boolean;
  overlay?: boolean;
  children: React.ReactNode;
}) {
  const { activeSection } = useEditFocus();
  const isActive = activeSection === section;
  const highlightClass = overlay
    ? "edit-highlight-overlay"
    : inset
      ? "edit-highlight-inset"
      : "edit-highlight";
  return (
    <div className={cn("rounded-lg transition-all duration-300", isActive && highlightClass, className)}>
      {children}
    </div>
  );
}

/* ─── Profile Avatar — 이미지 없으면 "핫딜닷쿨" ─── */

export function ProfileAvatar({ src, nickname, size = "size-16" }: { src: string | null; nickname: string; size?: string }) {
  const textSize = size === "size-10" ? "text-[9px]" : size === "size-12" ? "text-[10px]" : size === "size-14" ? "text-xs" : "text-sm";
  return (
    <HighlightWrapper section="avatar" className="rounded-full">
      <div className={cn("relative rounded-full", size)}>
        <div className={cn("flex items-center justify-center rounded-full bg-foreground font-bold text-background", size, textSize)}>
          핫딜닷쿨
        </div>
        {src && (
          <R2Image
            imageKey={src}
            className={cn("absolute inset-0 rounded-full object-cover", size)}
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        )}
      </div>
    </HighlightWrapper>
  );
}

/* ─── Background Banner ─── */

export function BackgroundBanner({ src, className }: { src: string | null; className?: string }) {
  return (
    <HighlightWrapper section="background" overlay className="rounded-none">
      {src ? (
        <R2Image imageKey={src} className={cn("w-full object-cover", className)} onError={(e) => { e.currentTarget.style.display = "none"; }} />
      ) : (
        <div className={cn("flex w-full items-center justify-center bg-muted/70", className)}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="size-8 text-muted-foreground/20" fill="currentColor">
            <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,16V158.75l-26.07-26.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L40,149.37V56ZM40,172l52-52,80,80H40Zm176,28H194.63l-36-36,20-20L216,181.38V200ZM144,100a12,12,0,1,1,12,12A12,12,0,0,1,144,100Z" />
          </svg>
        </div>
      )}
    </HighlightWrapper>
  );
}

/* ─── Product Image — 이미지 없으면 "핫딜닷쿨" ─── */

export function ProductImage({ src, className, textSize = "text-[9px]" }: { src: string | null; className?: string; textSize?: string }) {
  return (
    <div className={cn("relative flex items-center justify-center bg-foreground font-bold text-background", textSize, className)}>
      핫딜닷쿨
      {src && (
        <R2Image
          imageKey={src}
          className="absolute inset-0 size-full object-cover"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
      )}
    </div>
  );
}

/* ─── Price Tag ─── */

export function PriceTag({ link }: { link: ProfileLink }) {
  const price = link.price;
  const originalPrice = link.originalPrice;
  const discount = link.discountRate;
  if (!price) return null;
  return (
    <span className="flex flex-wrap items-baseline gap-x-1">
      {discount != null && <span className="text-xs font-bold text-red-500">{discount}%</span>}
      <span className="text-sm font-bold">{formatPrice(price)}원</span>
      {originalPrice != null && originalPrice > price && <span className="text-[10px] opacity-50 line-through">{formatPrice(originalPrice)}원</span>}
    </span>
  );
}

export function HotBadge({ className }: { className?: string }) {
  return <HotLabel className={cn("size-4", className)} />;
}

/* ─── Link Stats (clicks + likes) ─── */

export function compactNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}m`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
}

export function LinkStats({ link, iconSize = "size-3", className }: { link: ProfileLink; iconSize?: string; className?: string }) {
  if (link.clicks == null && link.likes == null) return null;
  return (
    <span className={cn("flex items-center gap-1.5 opacity-85", className)}>
      {link.clicks != null && <span className="flex items-center gap-0.5"><CursorClick className={iconSize} />{compactNumber(link.clicks)}</span>}
      {link.likes != null && <span className="flex items-center gap-0.5"><Heart className={iconSize} />{compactNumber(link.likes)}</span>}
    </span>
  );
}

/* ─── Border helpers ─── */

export function getLinkRoundClass(round: string | undefined): string {
  switch (round) {
    case "none": return "rounded-none";
    case "sm": return "rounded-lg";
    case "md": return "rounded-2xl";
    case "lg": return "rounded-3xl";
    default: return "rounded-xl";
  }
}

export function getLinkBorderStyle(profileData: ProfileData): React.CSSProperties {
  const style: React.CSSProperties = {};
  if (profileData.linkBorderColor) style.borderColor = profileData.linkBorderColor;
  switch (profileData.linkBorderThick) {
    case "none": style.borderWidth = "0px"; break;
    case "thin": style.borderWidth = "1px"; break;
    case "medium": style.borderWidth = "2px"; break;
    case "thick": style.borderWidth = "3px"; break;
  }
  return style;
}

/* ─── Link Click Handler ─── */

export function handleLinkClick(e: React.MouseEvent, link: ProfileLink) {
  e.preventDefault();
  // fire-and-forget: 서버에 클릭 기록
  if (link.id > 0) {
    import("@/lib/api").then(({ profileApi }) => profileApi.trackClick(link.id));
  }
  if (link.url) window.open(link.url, "_blank", "noopener,noreferrer");
}

export interface LayoutProps {
  profileData: ProfileData;
  links: ProfileLink[];
}
