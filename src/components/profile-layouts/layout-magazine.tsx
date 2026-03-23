"use client";

import { CursorClick } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { ProfileAvatar, ProductImage, PriceTag, type LayoutProps } from "./shared";

export function LayoutMagazine({ profileData, links }: LayoutProps) {
  return (
    <div>
      {/* Hero header */}
      <div className="flex h-36 flex-col items-center justify-center bg-foreground text-background">
        <ProfileAvatar src={profileData.avatarUrl} nickname={profileData.nickname} size="size-14" />
        <p className="mt-2 text-base font-bold">{profileData.nickname || "닉네임"}</p>
        {profileData.bio && <p className="text-[10px] opacity-70">{profileData.bio}</p>}
      </div>

      <div className="flex flex-col gap-2 px-4 py-4">
        <p className="text-xs font-semibold text-muted-foreground">추천 상품 {links.length}개</p>
        {links.map((link, i) => (
          <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className={cn("flex items-center gap-3 border-b border-border pb-2.5 last:border-0 transition-colors hover:bg-muted/30 rounded-lg px-1", !link.enabled && "opacity-40")}>
            <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-[10px] font-bold text-muted-foreground">{i + 1}</span>
            <div className="relative size-12 shrink-0 overflow-hidden rounded-lg">
              <ProductImage src={link.imageUrl} className="size-full" />
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
    </div>
  );
}
