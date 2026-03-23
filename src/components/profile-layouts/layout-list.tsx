"use client";

import { ArrowSquareOut, CursorClick } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { ProfileAvatar, ProductImage, PriceTag, HotBadge, type LayoutProps } from "./shared";

export function LayoutList({ profileData, links }: LayoutProps) {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-6">
      <ProfileAvatar src={profileData.avatarUrl} nickname={profileData.nickname} />
      <div className="text-center">
        <p className="text-base font-bold">{profileData.nickname || "닉네임"}</p>
        {profileData.bio && <p className="text-xs text-muted-foreground">{profileData.bio}</p>}
      </div>

      <div className="mt-2 flex w-full flex-col gap-2">
        {links.map((link) => (
          <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className={cn("group flex items-center gap-3 rounded-xl border border-border p-2.5 transition-colors hover:border-primary/30", !link.enabled && "opacity-40")}>
            <div className="relative size-14 shrink-0 overflow-hidden rounded-lg">
              <ProductImage src={link.imageUrl} className="size-full" />
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
    </div>
  );
}
