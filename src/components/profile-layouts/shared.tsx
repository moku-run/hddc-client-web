"use client";

import { Fire, CursorClick, ArrowSquareOut } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { R2Image } from "@/components/ui/r2-image";
import type { ProfileData, ProfileLink } from "@/lib/profile-types";

export function formatPrice(n: number) { return n.toLocaleString("ko-KR"); }

export function ProfileAvatar({ src, nickname, size = "size-16" }: { src: string | null; nickname: string; size?: string }) {
  return (
    <div className={cn("relative rounded-full", size)}>
      <div className={cn("flex items-center justify-center rounded-full bg-foreground font-bold text-background", size, size === "size-10" ? "text-xs" : size === "size-12" ? "text-xs" : size === "size-14" ? "text-sm" : "text-base")}>
        {nickname.charAt(0) || "?"}
      </div>
      {src && (
        <R2Image
          imageKey={src}
          className={cn("absolute inset-0 rounded-full object-cover", size)}
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
      )}
    </div>
  );
}

export function ProductImage({ src, className }: { src: string | null; className?: string }) {
  return (
    <div className={cn("flex items-center justify-center bg-foreground text-[8px] font-bold text-background", className)}>
      {src ? (
        <>
          핫딜닷쿨
          <img src={src} alt="" className="absolute inset-0 size-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
        </>
      ) : (
        "핫딜닷쿨"
      )}
    </div>
  );
}

export function PriceTag({ link }: { link: ProfileLink }) {
  const price = link.price;
  const originalPrice = link.originalPrice;
  const discount = link.discountRate;
  if (!price) return null;
  return (
    <span className="flex flex-wrap items-baseline gap-x-1">
      {discount != null && <span className="text-[10px] font-bold text-red-500">{discount}%</span>}
      <span className="text-xs font-bold">{formatPrice(price)}원</span>
      {originalPrice != null && originalPrice > price && <span className="text-[9px] text-muted-foreground line-through">{formatPrice(originalPrice)}원</span>}
    </span>
  );
}

export function HotBadge() {
  return (
    <span className="flex items-center gap-0.5 rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-1.5 py-0.5 text-[8px] font-bold text-white">
      <Fire className="size-2" weight="fill" />HOT
    </span>
  );
}

export interface LayoutProps {
  profileData: ProfileData;
  links: ProfileLink[];
}
