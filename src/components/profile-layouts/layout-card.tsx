"use client";

import { cn } from "@/lib/utils";
import { ProfileAvatar, ProductImage, PriceTag, LinkStats, HotBadge, BackgroundBanner, HighlightWrapper, getLinkRoundClass, getLinkBorderStyle, handleLinkClick, type LayoutProps, formatPrice } from "./shared";

export function LayoutCard({ profileData, links }: LayoutProps) {
  return (
    <div className="flex flex-col">
      <BackgroundBanner src={profileData.backgroundUrl} className="h-28" />

      <div className="flex flex-col items-center gap-2 px-4 -mt-8">
        <ProfileAvatar src={profileData.avatarUrl} nickname={profileData.nickname} />
        <HighlightWrapper section="nickname" className="px-3">
          <p className="text-lg font-bold">{profileData.nickname || "닉네임"}</p>
        </HighlightWrapper>
        {profileData.bio && (
          <HighlightWrapper section="bio" className="px-3">
            <p className="whitespace-pre-wrap text-sm opacity-60">{profileData.bio}</p>
          </HighlightWrapper>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-3 px-4 pb-6">
        <HighlightWrapper section="links">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <a key={link.id} href={link.url} onClick={(e) => handleLinkClick(e, link)} target="_blank" rel="noopener noreferrer" className={cn("group overflow-hidden border border-border transition-colors hover:border-primary/30", getLinkRoundClass(profileData.linkRound), !link.enabled && "opacity-40")} style={getLinkBorderStyle(profileData)}>
                <div className="relative flex h-32 items-center justify-center overflow-hidden">
                  <ProductImage src={link.imageUrl} className="size-full" textSize="text-base" />
                  {(link.likes ?? 0) >= 500 && (
                    <div className="absolute left-2 top-2"><HotBadge /></div>
                  )}
                </div>
                <div className="p-3">
                  <p className={cn("text-base font-semibold leading-snug", !link.title && "opacity-40")}>{link.title || "상품명을 입력하세요"}</p>
                  {link.price != null ? (
                    <div className="mt-1.5 flex items-baseline gap-1.5">
                      {link.discountRate != null && <span className="text-base font-bold text-red-500">{link.discountRate}%</span>}
                      <span className="text-lg font-bold">{formatPrice(link.price)}원</span>
                      {link.originalPrice != null && link.originalPrice > link.price && <span className="text-sm opacity-50 line-through">{formatPrice(link.originalPrice)}원</span>}
                    </div>
                  ) : (
                    <p className="mt-1.5 text-sm opacity-30">가격 미입력</p>
                  )}
                  <div className="mt-1 flex items-center justify-between text-xs opacity-50">
                    <span>{[link.store, link.category].filter(Boolean).join(" · ") || "\u00A0"}</span>
                    <LinkStats link={link} className="text-xs" />
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
