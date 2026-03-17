import { Globe } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import type { MockupColors } from "@/lib/mockup-presets";

export function PhoneMockup({
  onClick,
  className,
  children,
  colors: c,
}: {
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
  colors?: MockupColors;
}) {
  return (
    <div onClick={onClick} className={cn("relative", className)}>
      <div
        className={cn(
          "rounded-[1.75rem] border-2 p-2 shadow-lg transition-colors duration-700",
          c ? `${c.border} ${c.card}` : "border-border bg-card",
        )}
      >
        <div
          className={cn(
            "mx-auto mb-2 h-4 w-16 rounded-full transition-colors duration-700",
            c ? c.notch : "bg-border/60",
          )}
        />
        <div
          className={cn(
            "rounded-[1.25rem] p-3 transition-colors duration-700",
            c ? `${c.content} ${c.text}` : "bg-background",
          )}
        >
          {children ?? (
            <>
              <div className="flex flex-col items-center gap-2 pb-3">
                <div
                  className={cn(
                    "flex size-10 items-center justify-center rounded-full text-sm font-bold transition-colors duration-700",
                    c ? `${c.primaryBg} ${c.primary}` : "bg-primary/10 text-primary",
                  )}
                >
                  핫
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold transition-colors duration-700">핫딜닷쿨</p>
                  <p
                    className={cn(
                      "text-[10px] transition-colors duration-700",
                      c ? c.mutedText : "text-muted-foreground",
                    )}
                  >
                    크리에이터
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                {["추천 상품", "리뷰 블로그", "제휴 파트너스"].map((label) => (
                  <div
                    key={label}
                    className={cn(
                      "flex h-7 items-center justify-center rounded-lg text-[10px] font-medium transition-colors duration-700",
                      c ? c.muted : "bg-muted/60",
                    )}
                  >
                    {label}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function BrowserMockup({
  onClick,
  className,
  children,
  colors: c,
}: {
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
  colors?: MockupColors;
}) {
  return (
    <div onClick={onClick} className={cn("relative", className)}>
      <div
        className={cn(
          "rounded-xl border-2 shadow-lg transition-colors duration-700",
          c ? `${c.border} ${c.card}` : "border-border bg-card",
        )}
      >
        <div
          className={cn(
            "flex items-center gap-1.5 border-b px-3 py-2 transition-colors duration-700",
            c ? c.border : "border-border",
          )}
        >
          <div className="flex gap-1">
            <span className="size-2 rounded-full bg-red-400/70" />
            <span className="size-2 rounded-full bg-yellow-400/70" />
            <span className="size-2 rounded-full bg-green-400/70" />
          </div>
          <div
            className={cn(
              "ml-2 flex-1 rounded-md px-2 py-0.5 text-[9px] transition-colors duration-700",
              c ? `${c.muted} ${c.mutedText}` : "bg-muted/60 text-muted-foreground",
            )}
          >
            hotdeal.cool/yourname
          </div>
        </div>
        <div className={cn("p-3 transition-colors duration-700", c ? c.text : "")}>
          {children ?? (
            <div className="grid grid-cols-[auto_1fr] gap-3">
              <div
                className={cn(
                  "flex flex-col items-center gap-2 border-r pr-3 transition-colors duration-700",
                  c ? c.border : "border-border",
                )}
              >
                <div
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full text-xs font-bold transition-colors duration-700",
                    c ? `${c.primaryBg} ${c.primary}` : "bg-primary/10 text-primary",
                  )}
                >
                  핫
                </div>
                <p className="text-[9px] font-semibold transition-colors duration-700">핫딜닷쿨</p>
                <p
                  className={cn(
                    "text-[8px] transition-colors duration-700",
                    c ? c.mutedText : "text-muted-foreground",
                  )}
                >
                  크리에이터
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                {["추천 상품", "리뷰 블로그", "제휴 파트너스"].map((label) => (
                  <div
                    key={label}
                    className={cn(
                      "flex h-6 items-center rounded-md px-2 text-[9px] font-medium transition-colors duration-700",
                      c ? c.muted : "bg-muted/60",
                    )}
                  >
                    <Globe
                      className={cn(
                        "mr-1 size-3 transition-colors duration-700",
                        c ? c.mutedText : "text-muted-foreground",
                      )}
                    />
                    {label}
                  </div>
                ))}
                <div
                  className={cn(
                    "mt-1 rounded-md p-2 transition-colors duration-700",
                    c ? c.primarySubtle : "bg-primary/5",
                  )}
                >
                  <p
                    className={cn(
                      "mb-1 text-[8px] font-medium transition-colors duration-700",
                      c ? c.mutedText : "text-muted-foreground",
                    )}
                  >
                    클릭 통계
                  </p>
                  <div className="flex gap-1">
                    {[60, 40, 80].map((h, i) => (
                      <div
                        key={i}
                        className={cn(
                          "flex-1 rounded-sm transition-colors duration-700",
                          c ? c.primaryBar : "bg-primary/20",
                        )}
                        style={{ height: `${h * 0.2}px` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
