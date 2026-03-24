"use client";

import { cn } from "@/lib/utils";
import { ProfileAvatar, ProductImage, PriceTag, LinkStats, HotBadge, BackgroundBanner, HighlightWrapper, getLinkRoundClass, getLinkBorderStyle, handleLinkClick, type LayoutProps } from "./shared";

export function LayoutGrid({ profileData, links }: LayoutProps) {
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

      <div className="mt-4 px-4 pb-6">
        <HighlightWrapper section="links">
          <div className="grid grid-cols-2 gap-2">
            {links.map((link) => (
              <a key={link.id} href={link.url} onClick={(e) => handleLinkClick(e, link)} target="_blank" rel="noopener noreferrer" className={cn("group overflow-hidden border border-border transition-colors hover:border-primary/30", getLinkRoundClass(profileData.linkRound), !link.enabled && "opacity-40")} style={getLinkBorderStyle(profileData)}>
                <div className="relative flex h-24 items-center justify-center overflow-hidden">
                  <ProductImage src={link.imageUrl} className="size-full" textSize="text-sm" />
                  {(link.likes ?? 0) >= 500 && (
                    <div className="absolute left-1.5 top-1.5"><HotBadge /></div>
                  )}
                </div>
                <div className="p-2">
                  <p className={cn("line-clamp-2 text-xs font-semibold leading-tight", !link.title && "opacity-40")}>{link.title || "상품명"}</p>
                  <div className="mt-1">{link.price != null ? <PriceTag link={link} /> : <span className="text-[9px] opacity-30">가격 미입력</span>}</div>
                  <div className="mt-0.5 flex items-center gap-1 truncate text-[9px] opacity-50">
                    <LinkStats link={link} iconSize="size-2.5" className="text-[9px]" />
                    {link.store && <span>{link.store}</span>}
                    {link.category && <span>{link.category}</span>}
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
