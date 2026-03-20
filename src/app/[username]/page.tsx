"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { use } from "react";
import { isReservedSlug } from "@/lib/reserved-slugs";
import { profileApi, ApiError, type ProfileResponse } from "@/lib/api";
import { SponsorBanner } from "@/components/sponsor-banner";
import { R2Image } from "@/components/ui/r2-image";
import {
  InstagramLogo,
  YoutubeLogo,
  XLogo,
  TiktokLogo,
  ThreadsLogo,
  Envelope,
  Globe,
  FacebookLogo,
  ChatCircle,
  PencilSimpleLine,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const SOCIAL_ICONS: Record<string, typeof InstagramLogo> = {
  instagram: InstagramLogo,
  youtube: YoutubeLogo,
  x: XLogo,
  tiktok: TiktokLogo,
  threads: ThreadsLogo,
  facebook: FacebookLogo,
  kakaotalk: ChatCircle,
  "naver-blog": PencilSimpleLine,
  email: Envelope,
  website: Globe,
};

interface Props {
  params: Promise<{ username: string }>;
}

export default function ProfilePage({ params }: Props) {
  const { username } = use(params);
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);

  if (isReservedSlug(username)) {
    notFound();
  }

  useEffect(() => {
    profileApi.getBySlug(username)
      .then((res) => { if (res.payload) setProfile(res.payload); else setNotFoundState(true); })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) setNotFoundState(true);
        else setNotFoundState(true);
      })
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (notFoundState || !profile) {
    return (
      <div className="flex min-h-svh flex-col">
        <main className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">존재하지 않는 프로필입니다</p>
        </main>
      </div>
    );
  }

  const enabledLinks = profile.links.filter((l) => l.enabled);

  return (
    <div className="flex min-h-svh flex-col">
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center px-4 py-6">
        {/* Background */}
        {profile.backgroundUrl && (
          <div className="-mx-4 mb-[-2rem] w-[calc(100%+2rem)] overflow-hidden rounded-b-xl">
            <R2Image imageKey={profile.backgroundUrl} className="h-36 w-full object-cover" />
          </div>
        )}

        {/* Avatar */}
        <div className="relative z-10 mb-3">
          <div className="flex size-24 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground ring-4 ring-background">
            핫딜닷쿨
          </div>
          {profile.avatarUrl && (
            <R2Image
              imageKey={profile.avatarUrl}
              className="absolute inset-0 size-24 rounded-full object-cover ring-4 ring-background"
            />
          )}
        </div>

        {/* Name & Bio */}
        <h1 className="text-xl font-bold">{profile.nickname}</h1>
        {profile.bio && (
          <p className="mt-1 text-center text-sm text-muted-foreground">{profile.bio}</p>
        )}

        {/* Socials */}
        {profile.socials.length > 0 && (
          <div className="mt-4 flex gap-3">
            {profile.socials.map((social) => {
              const Icon = SOCIAL_ICONS[social.platform] || Globe;
              return (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-9 items-center justify-center rounded-full bg-muted/60 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Icon className="size-5" />
                </a>
              );
            })}
          </div>
        )}

        {/* Links */}
        {enabledLinks.length > 0 && (
          <div className="mt-6 flex w-full flex-col gap-3">
            {enabledLinks.map((link) => (
              <a
                key={link.id}
                href={`/r/${link.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex h-14 items-center gap-3 rounded-xl border border-border px-4 text-sm font-medium transition-colors hover:bg-muted/50",
                )}
              >
                {link.imageUrl ? (
                  <R2Image imageKey={link.imageUrl} className="size-9 shrink-0 rounded-full object-cover" />
                ) : (
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-[6px] font-bold text-primary-foreground">
                    핫딜닷쿨
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <span className="block truncate">{link.title}</span>
                  {link.description && (
                    <span className="block truncate text-xs text-muted-foreground">{link.description}</span>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}
      </main>

      <SponsorBanner plan="free" />
    </div>
  );
}
