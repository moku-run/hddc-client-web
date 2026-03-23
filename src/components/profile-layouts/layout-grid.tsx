"use client";

import { cn } from "@/lib/utils";
import { ProfileAvatar, ProductImage, PriceTag, type LayoutProps } from "./shared";

export function LayoutGrid({ profileData, links }: LayoutProps) {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-6">
      <ProfileAvatar src={profileData.avatarUrl} nickname={profileData.nickname} />
      <div className="text-center">
        <p className="text-base font-bold">{profileData.nickname || "닉네임"}</p>
        {profileData.bio && <p className="text-xs text-muted-foreground">{profileData.bio}</p>}
      </div>

      <div className="mt-2 grid w-full grid-cols-2 gap-2">
        {links.map((link) => (
          <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className={cn("group overflow-hidden rounded-xl border border-border transition-colors hover:border-primary/30", !link.enabled && "opacity-40")}>
            <div className="relative flex h-24 items-center justify-center overflow-hidden">
              <ProductImage src={link.imageUrl} className="size-full" />
            </div>
            <div className="p-2">
              <p className="line-clamp-2 text-[10px] font-semibold leading-tight">{link.title}</p>
              <div className="mt-1">
                <PriceTag link={link} />
              </div>
              {link.store && <p className="mt-0.5 text-[8px] text-muted-foreground">{link.store}</p>}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
