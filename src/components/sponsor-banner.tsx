import { cn } from "@/lib/utils";
import type { PlanType } from "@/lib/profile-types";

interface SponsorBannerProps {
  plan: PlanType;
  className?: string;
}

export function SponsorBanner({ plan, className }: SponsorBannerProps) {
  if (plan !== "free") return null;

  return (
    <div
      className={cn(
        "w-full border-t border-border bg-muted/50 px-4 py-4",
        className,
      )}
    >
      <div className="mx-auto flex max-w-lg flex-col items-center gap-6">
        {/* Sponsor ad placeholder */}
        <div className="flex h-[60px] w-full items-center justify-center rounded-lg border border-dashed border-border bg-background text-xs text-muted-foreground">
          스폰서 광고 영역
        </div>

        {/* Powered by branding */}
        <p className="text-[11px] text-muted-foreground/70">
          Powered by{" "}
          <a
            href="/"
            className="font-semibold text-primary/70 transition-colors hover:text-primary"
          >
            핫딜닷쿨
          </a>
          {" · "}
          <a
            href="/pricing"
            className="underline underline-offset-2 transition-colors hover:text-foreground"
          >
            광고 제거하기
          </a>
        </p>
      </div>
    </div>
  );
}
