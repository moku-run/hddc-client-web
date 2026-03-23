"use client";

import { CursorClick } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { ProfileAvatar, ProductImage, PriceTag, HighlightWrapper, getLinkRoundClass, getLinkBorderStyle, type LayoutProps } from "./shared";
import { R2Image } from "@/components/ui/r2-image";

export function LayoutMagazine({ profileData, links }: LayoutProps) {
  return (
    <div>
      {/* Hero header with background */}
      <HighlightWrapper section="background" className="rounded-none">
        <div className="relative flex h-36 flex-col items-center justify-center bg-foreground text-background">
          {profileData.backgroundUrl && (
            <R2Image imageKey={profileData.backgroundUrl} className="absolute inset-0 size-full object-cover opacity-30" onError={(e) => { e.currentTarget.style.display = "none"; }} />
          )}
          <div className="relative z-10 flex flex-col items-center">
            <ProfileAvatar src={profileData.avatarUrl} nickname={profileData.nickname} size="size-14" />
            <HighlightWrapper section="nickname">
              <p className="mt-2 text-base font-bold">{profileData.nickname || "닉네임"}</p>
            </HighlightWrapper>
            {profileData.bio && (
              <HighlightWrapper section="bio">
                <p className="whitespace-pre-wrap text-[10px] opacity-70">{profileData.bio}</p>
              </HighlightWrapper>
            )}
          </div>
        </div>
      </HighlightWrapper>

      <div className="flex flex-col gap-2 px-4 py-4">
        <p className="text-xs font-semibold text-muted-foreground">핫딜상품 {links.length}개</p>
        <HighlightWrapper section="links">
          <div className="flex flex-col gap-2">
            {links.map((link, i) => (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className={cn("flex items-center gap-3 border border-border p-2.5 transition-colors hover:border-primary/30", getLinkRoundClass(profileData.linkRound), !link.enabled && "opacity-40")} style={getLinkBorderStyle(profileData)}>
                <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-[10px] font-bold text-muted-foreground">{i + 1}</span>
                <div className="relative size-12 shrink-0 overflow-hidden rounded-lg">
                  <ProductImage src={link.imageUrl} className="size-full" textSize="text-[10px]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold">{link.title}</p>
                  <PriceTag link={link} />
                  <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground">
                    {link.store && <span>{link.store}</span>}
                    {link.clicks != null && link.clicks > 0 && <span className="flex items-center gap-0.5"><CursorClick className="size-2" />{link.clicks}</span>}
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
