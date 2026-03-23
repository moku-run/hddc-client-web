"use client";

import { cn } from "@/lib/utils";
import { ProfileAvatar, ProductImage, PriceTag, LinkStats, BackgroundBanner, HighlightWrapper, getLinkRoundClass, getLinkBorderStyle, type LayoutProps } from "./shared";

export function LayoutGrid({ profileData, links }: LayoutProps) {
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

      <div className="mt-4 px-4 pb-6">
        <HighlightWrapper section="links">
          <div className="grid grid-cols-2 gap-2">
            {links.map((link) => (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className={cn("group overflow-hidden border border-border transition-colors hover:border-primary/30", getLinkRoundClass(profileData.linkRound), !link.enabled && "opacity-40")} style={getLinkBorderStyle(profileData)}>
                <div className="relative flex h-24 items-center justify-center overflow-hidden">
                  <ProductImage src={link.imageUrl} className="size-full" textSize="text-xs" />
                </div>
                <div className="p-2">
                  <p className="line-clamp-2 text-[10px] font-semibold leading-tight">{link.title}</p>
                  <div className="mt-1"><PriceTag link={link} /></div>
                  <div className="mt-0.5 flex items-center gap-1 truncate text-[8px] text-muted-foreground">
                    <LinkStats link={link} iconSize="size-2" className="text-[8px]" />
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
