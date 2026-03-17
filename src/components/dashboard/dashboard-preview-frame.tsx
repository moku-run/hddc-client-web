"use client";

import { useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useEditFocus } from "@/contexts/edit-focus-context";

function contrastColor(hex: string): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5
    ? "rgba(0,0,0,0.3)"
    : "rgba(255,255,255,0.35)";
}

/**
 * Realistic iPhone-style phone frame for dashboard preview.
 */
export function PhonePreviewFrame({
  className,
  slug,
  backgroundColor,
  children,
}: {
  className?: string;
  slug?: string;
  backgroundColor?: string | null;
  children: React.ReactNode;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ active: false, startY: 0, startScroll: 0 });
  const { activeSection } = useEditFocus();
  const isSlugActive = activeSection === "slug";

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    dragState.current = { active: true, startY: e.clientY, startScroll: el.scrollTop };
    el.style.cursor = "grabbing";
    e.preventDefault();
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const d = dragState.current;
    if (!d.active) return;
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = d.startScroll - (e.clientY - d.startY);
  }, []);

  const onMouseUp = useCallback(() => {
    dragState.current.active = false;
    const el = scrollRef.current;
    if (el) el.style.cursor = "";
  }, []);

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Phone body */}
      <div className="relative flex flex-col rounded-[3rem] bg-zinc-900 p-3">
        {/* Side buttons — left (silent, vol up, vol down) */}
        <div className="absolute -left-[2.5px] top-[100px] h-[28px] w-[3px] rounded-l-sm bg-zinc-700" />
        <div className="absolute -left-[2.5px] top-[148px] h-[52px] w-[3px] rounded-l-sm bg-zinc-700" />
        <div className="absolute -left-[2.5px] top-[208px] h-[52px] w-[3px] rounded-l-sm bg-zinc-700" />
        {/* Side button — right (power) */}
        <div className="absolute -right-[2.5px] top-[168px] h-[68px] w-[3px] rounded-r-sm bg-zinc-700" />

        {/* Screen */}
        <div className="flex h-[620px] flex-col overflow-hidden rounded-[2.25rem] bg-background text-foreground">
          {/* Browser chrome */}
          <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-2.5">
            <div className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-red-400/80" />
              <span className="size-2.5 rounded-full bg-yellow-400/80" />
              <span className="size-2.5 rounded-full bg-green-400/80" />
            </div>
            <div
              className={cn(
                "ml-3 flex-1 rounded-md bg-background px-3 py-1 text-xs text-muted-foreground transition-all duration-300",
                isSlugActive && "edit-highlight",
              )}
            >
              hotdeal.cool/{slug || "yourname"}
            </div>
          </div>

          {/* Content area — click+drag to scroll, no text/image drag */}
          <div
            ref={scrollRef}
            className="flex flex-1 flex-col cursor-grab select-none overflow-x-hidden overflow-y-auto overscroll-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
            <div className="flex-1">{children}</div>
            {/* Footer */}
            <div
              className="shrink-0 py-3 text-center"
              style={backgroundColor ? { backgroundColor } : undefined}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <span
                className="cursor-default text-xs"
                style={{ color: backgroundColor ? contrastColor(backgroundColor) : undefined }}
              >
                핫딜닷쿨
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Realistic browser frame for dashboard preview.
 * Fills available width/height to match real browser proportions.
 */
export function BrowserPreviewFrame({
  className,
  slug,
  backgroundColor,
  children,
}: {
  className?: string;
  slug?: string;
  backgroundColor?: string | null;
  children: React.ReactNode;
}) {
  const { activeSection } = useEditFocus();
  const isSlugActive = activeSection === "slug";

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card">
        {/* Browser chrome */}
        <div className="flex shrink-0 items-center gap-2 border-b border-border bg-muted/50 px-4 py-2.5">
          {/* Traffic lights */}
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-red-400/80" />
            <span className="size-2.5 rounded-full bg-yellow-400/80" />
            <span className="size-2.5 rounded-full bg-green-400/80" />
          </div>
          {/* URL bar */}
          <div
            className={cn(
              "ml-3 flex-1 rounded-md bg-background px-3 py-1 text-xs text-muted-foreground transition-all duration-300",
              isSlugActive && "edit-highlight",
            )}
          >
            hotdeal.cool/{slug || "yourname"}
          </div>
        </div>

        {/* Content area */}
        <div className="flex flex-1 flex-col overflow-y-auto overscroll-none bg-background">
          <div className="flex-1 p-6">
            {children}
          </div>
          {/* Footer */}
          <div className="shrink-0 py-3 text-center" style={backgroundColor ? { backgroundColor } : undefined}>
            <a
              href="/"
              className="text-[10px] transition-colors"
              style={{ color: backgroundColor ? contrastColor(backgroundColor) : undefined }}
            >
              핫딜닷쿨
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
