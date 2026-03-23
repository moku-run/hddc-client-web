"use client";

import { Fire } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { ProfileAvatar, ProductImage, PriceTag, LinkStats, BackgroundBanner, HighlightWrapper, getLinkRoundClass, getLinkBorderStyle, type LayoutProps, formatPrice } from "./shared";

export function LayoutCard({ profileData, links }: LayoutProps) {
  return (
    <div className="flex flex-col">
      <BackgroundBanner src={profileData.backgroundUrl} className="h-28" />

      <div className="flex flex-col items-center gap-2 px-4 -mt-8">
        <ProfileAvatar src={profileData.avatarUrl} nickname={profileData.nickname} />
        <HighlightWrapper section="nickname" className="px-3">
          <p className="text-base font-bold">{profileData.nickname || "닉네임"}</p>
        </HighlightWrapper>
        {profileData.bio && (
          <HighlightWrapper section="bio" className="px-3">
            <p className="whitespace-pre-wrap text-xs text-muted-foreground">{profileData.bio}</p>
          </HighlightWrapper>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-3 px-4 pb-6">
        <HighlightWrapper section="links">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className={cn("group overflow-hidden border border-border transition-colors hover:border-primary/30", getLinkRoundClass(profileData.linkRound), !link.enabled && "opacity-40")} style={getLinkBorderStyle(profileData)}>
                <div className="relative flex h-32 items-center justify-center overflow-hidden">
                  <ProductImage src={link.imageUrl} className="size-full" textSize="text-base" />
                  {(link.clicks ?? 0) >= 500 && (
                    <span className="absolute left-2 top-2 flex items-center gap-0.5 rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-2 py-0.5 text-[9px] font-bold text-white">
                      <Fire className="size-2.5" weight="fill" />인기
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold leading-snug">{link.title}</p>
                  <div className="mt-1.5 flex items-baseline gap-1.5">
                    {link.discountRate != null && <span className="text-sm font-bold text-red-500">{link.discountRate}%</span>}
                    {link.price != null && <span className="text-base font-bold">{formatPrice(link.price)}원</span>}
                    {link.originalPrice != null && link.price != null && link.originalPrice > link.price && <span className="text-xs text-muted-foreground line-through">{formatPrice(link.originalPrice)}원</span>}
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>{[link.store, link.category].filter(Boolean).join(" · ") || "\u00A0"}</span>
                    <LinkStats link={link} className="text-[10px]" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </HighlightWrapper>
      </div>
    </div>
  );
}
