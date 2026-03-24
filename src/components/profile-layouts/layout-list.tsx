"use client";

import { ArrowSquareOut } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { ProfileAvatar, ProductImage, PriceTag, LinkStats, HotBadge, BackgroundBanner, HighlightWrapper, getLinkRoundClass, getLinkBorderStyle, type LayoutProps } from "./shared";

export function LayoutList({ profileData, links }: LayoutProps) {
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
            <p className="whitespace-pre-wrap text-xs opacity-60">{profileData.bio}</p>
          </HighlightWrapper>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-2 px-4 pb-6">
        <HighlightWrapper section="links">
          <div className="flex flex-col gap-2">
            {links.map((link) => (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className={cn("group flex items-center gap-3 border border-border p-2.5 transition-colors hover:border-primary/30", getLinkRoundClass(profileData.linkRound), !link.enabled && "opacity-40")} style={getLinkBorderStyle(profileData)}>
                <div className="relative size-14 shrink-0 overflow-hidden rounded-lg">
                  <ProductImage src={link.imageUrl} className="size-full" textSize="text-[10px]" />
                  {(link.likes ?? 0) >= 500 && (
                    <div className="absolute left-0.5 top-0.5"><HotBadge className="px-1 py-0 text-[6px]" /></div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={cn("truncate text-xs font-semibold", !link.title && "opacity-40")}>{link.title || "상품명을 입력하세요"}</p>
                  {link.price != null ? <PriceTag link={link} /> : <p className="text-[10px] opacity-30">가격 미입력</p>}
                  <div className="mt-0.5 flex items-center gap-1.5 text-[9px] opacity-50">
                    <LinkStats link={link} className="text-[9px]" />
                    {link.store && <span>{link.store}</span>}
                    {link.category && <span>{link.category}</span>}
                  </div>
                </div>
                <ArrowSquareOut className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
            ))}
          </div>
        </HighlightWrapper>
      </div>
    </div>
  );
}
