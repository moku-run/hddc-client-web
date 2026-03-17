export function SponsorAd() {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-5">
      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60">스폰서</span>
      <div className="flex h-[60px] w-full max-w-md items-center justify-center rounded-lg border border-dashed border-border bg-background text-xs text-muted-foreground">
        광고 영역
      </div>
    </div>
  );
}
