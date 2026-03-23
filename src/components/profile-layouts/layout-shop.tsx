"use client";

import { useState } from "react";
import { CursorClick, Heart } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { ProfileAvatar, ProductImage, PriceTag, type LayoutProps } from "./shared";

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
          <p className="text-sm font-bold">{profileData.nickname || "닉네임"}</p>
          {profileData.bio && <p className="text-[10px] text-muted-foreground">{profileData.bio}</p>}
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
        {filtered.map((link) => (
          <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className={cn("group flex gap-3 rounded-xl border border-border p-2.5 transition-colors hover:border-primary/30", !link.enabled && "opacity-40")}>
            <div className="relative size-20 shrink-0 overflow-hidden rounded-lg">
              <ProductImage src={link.imageUrl} className="size-full" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-xs font-semibold leading-snug">{link.title}</p>
              <div className="mt-1">
                <PriceTag link={link} />
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-[9px] text-muted-foreground">
                {link.store && <span>{link.store}</span>}
                {link.clicks != null && <span className="flex items-center gap-0.5"><CursorClick className="size-2" />{link.clicks}</span>}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
