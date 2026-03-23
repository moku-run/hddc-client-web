"use client";

import { Fire } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { ProfileAvatar, ProductImage, HighlightWrapper, getLinkRoundClass, getLinkBorderStyle, type LayoutProps, formatPrice } from "./shared";

export function LayoutVisual({ profileData, links }: LayoutProps) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3 px-4 py-4">
        <ProfileAvatar src={profileData.avatarUrl} nickname={profileData.nickname} size="size-12" />
        <div>
          <HighlightWrapper section="nickname">
            <p className="text-sm font-bold">{profileData.nickname || "닉네임"}</p>
          </HighlightWrapper>
          <p className="text-[10px] text-muted-foreground">@{profileData.slug || "username"} · 핫딜상품 {links.length}개</p>
        </div>
      </div>

      {/* Masonry-like grid */}
      <HighlightWrapper section="links">
        <div className="grid grid-cols-2 gap-1.5 px-2 pb-4">
          {links.map((link, i) => {
            const tall = i % 3 === 0;
            return (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className={cn("group relative overflow-hidden border border-border", getLinkRoundClass(profileData.linkRound), !link.enabled && "opacity-40")} style={getLinkBorderStyle(profileData)}>
                <div className={cn("relative flex items-center justify-center overflow-hidden", tall ? "h-48" : "h-32")}>
                  <ProductImage src={link.imageUrl} className="size-full" textSize="text-sm" />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 pt-8">
                  <p className="line-clamp-1 text-[10px] font-semibold text-white">{link.title}</p>
                  <div className="flex items-baseline gap-1">
                    {link.discountRate != null && <span className="text-[9px] font-bold text-red-400">{link.discountRate}%</span>}
                    {link.price != null && <span className="text-[10px] font-bold text-white">{formatPrice(link.price)}원</span>}
                  </div>
                </div>
                {(link.clicks ?? 0) >= 500 && (
                  <div className="absolute left-1.5 top-1.5">
                    <span className="flex items-center gap-0.5 rounded-full bg-red-500 px-1.5 py-0.5 text-[8px] font-bold text-white">
                      <Fire className="size-2" weight="fill" />HOT
                    </span>
                  </div>
                )}
              </a>
            );
          })}
        </div>
      </HighlightWrapper>
    </div>
  );
}
