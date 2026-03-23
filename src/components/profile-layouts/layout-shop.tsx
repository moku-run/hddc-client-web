"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ProfileAvatar, ProductImage, PriceTag, LinkStats, BackgroundBanner, HighlightWrapper, getLinkRoundClass, getLinkBorderStyle, type LayoutProps } from "./shared";

export function LayoutShop({ profileData, links }: LayoutProps) {
  const categories = ["전체", ...new Set(links.map((l) => l.category).filter(Boolean))];
  const [activeCategory, setActiveCategory] = useState("전체");
  const filtered = activeCategory === "전체" ? links : links.filter((l) => l.category === activeCategory);

  return (
    <div className="flex flex-col">
      {/* Compact header */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <ProfileAvatar src={profileData.avatarUrl} nickname={profileData.nickname} size="size-10" />
        <div>
          <HighlightWrapper section="nickname">
            <p className="text-sm font-bold">{profileData.nickname || "닉네임"}</p>
          </HighlightWrapper>
          {profileData.bio && (
            <HighlightWrapper section="bio">
              <p className="whitespace-pre-wrap text-[10px] opacity-60">{profileData.bio}</p>
            </HighlightWrapper>
          )}
        </div>
      </div>

      {/* Category tabs */}
      {categories.length > 1 && (
        <div className="flex gap-2 overflow-x-auto border-b border-border px-4 py-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat!)}
              className={cn("shrink-0 rounded-full px-3 py-1 text-[10px] font-medium transition-colors", activeCategory === cat ? "bg-foreground text-background" : "bg-muted text-muted-foreground")}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Products */}
      <div className="flex flex-col gap-2 px-4 py-3">
        <HighlightWrapper section="links">
          <div className="flex flex-col gap-2">
            {filtered.map((link) => (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className={cn("group flex gap-3 border border-border p-2.5 transition-colors hover:border-primary/30", getLinkRoundClass(profileData.linkRound), !link.enabled && "opacity-40")} style={getLinkBorderStyle(profileData)}>
                <div className="relative size-20 shrink-0 overflow-hidden rounded-lg">
                  <ProductImage src={link.imageUrl} className="size-full" textSize="text-sm" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 min-h-[2.25rem] text-xs font-semibold leading-snug">{link.title}</p>
                  <div className="mt-1"><PriceTag link={link} /></div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[9px] opacity-50">
                    <LinkStats link={link} className="text-[9px]" />
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
