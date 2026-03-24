"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ProfileAvatar, ProductImage, PriceTag, LinkStats, HotBadge, BackgroundBanner, HighlightWrapper, getLinkRoundClass, getLinkBorderStyle, handleLinkClick, type LayoutProps } from "./shared";

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
            <p className="text-base font-bold">{profileData.nickname || "닉네임"}</p>
          </HighlightWrapper>
          {profileData.bio && (
            <HighlightWrapper section="bio">
              <p className="whitespace-pre-wrap text-xs opacity-60">{profileData.bio}</p>
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
              className={cn("shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors", activeCategory === cat ? "bg-foreground text-background" : "bg-muted text-muted-foreground")}
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
              <a key={link.id} href={link.url} onClick={(e) => handleLinkClick(e, link)} target="_blank" rel="noopener noreferrer" className={cn("group flex gap-3 border border-border p-2.5 transition-colors hover:border-primary/30", getLinkRoundClass(profileData.linkRound), !link.enabled && "opacity-40")} style={getLinkBorderStyle(profileData)}>
                <div className="relative size-20 shrink-0 overflow-hidden rounded-lg">
                  <ProductImage src={link.imageUrl} className="size-full" textSize="text-base" />
                  {(link.likes ?? 0) >= 500 && (
                    <div className="absolute left-0.5 top-0.5"><HotBadge className="px-1 py-0 text-[7px]" /></div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={cn("line-clamp-2 min-h-[2.25rem] text-sm font-semibold leading-snug", !link.title && "opacity-40")}>{link.title || "상품명을 입력하세요"}</p>
                  <div className="mt-1">{link.price != null ? <PriceTag link={link} /> : <span className="text-xs opacity-30">가격 미입력</span>}</div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[10px] opacity-50">
                    <LinkStats link={link} className="text-[10px]" />
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
