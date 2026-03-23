"use client";

import { ArrowSquareOut, CursorClick } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { ProfileAvatar, ProductImage, PriceTag, BackgroundBanner, HighlightWrapper, getLinkRoundClass, getLinkBorderStyle, type LayoutProps } from "./shared";

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
            <p className="whitespace-pre-wrap text-xs text-muted-foreground">{profileData.bio}</p>
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
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold">{link.title}</p>
                  <PriceTag link={link} />
                  <div className="mt-0.5 flex items-center gap-1.5 text-[9px] text-muted-foreground">
                    {link.store && <span>{link.store}</span>}
                    {link.clicks != null && link.clicks > 0 && <span className="flex items-center gap-0.5"><CursorClick className="size-2" />{link.clicks}</span>}
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
