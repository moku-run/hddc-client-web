import Link from "next/link";
import { UserCircle, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import type { FeedProfile } from "@/lib/hot-deal-types";

export function ProfileCard({ profile }: { profile: FeedProfile }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-primary/20 bg-primary/[0.03] p-4">
      {/* Avatar */}
      {profile.avatarUrl ? (
        <img
          src={profile.avatarUrl}
          alt={profile.nickname}
          className="size-12 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <UserCircle className="size-7 text-primary" />
        </div>
      )}

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">@{profile.slug}</p>
        {profile.bio && (
          <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{profile.bio}</p>
        )}
      </div>

      {/* CTA */}
      <Button variant="outline" size="sm" asChild className="shrink-0">
        <Link href={`/${profile.slug}`}>
          프로필 보기
          <ArrowRight className="ml-1 size-3" />
        </Link>
      </Button>
    </div>
  );
}
