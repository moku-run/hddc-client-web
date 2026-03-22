"use client";

import { useState, useEffect } from "react";
import { PhoneMockup, BrowserMockup } from "@/components/device-mockup";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { COLOR_NAMES, getMockupColors, getPanelColors } from "@/lib/mockup-presets";

function pickRandom(currentIndex: number) {
  let next: number;
  do {
    next = Math.floor(Math.random() * COLOR_NAMES.length);
  } while (next === currentIndex && COLOR_NAMES.length > 1);
  return next;
}

interface AuthShellProps {
  children: React.ReactNode;
  /** key to trigger fade-in animation on content change */
  contentKey?: string;
}

export function AuthShell({ children, contentKey }: AuthShellProps) {
  const [presetIndex, setPresetIndex] = useState(0);
  const [mockupDark, setMockupDark] = useState(true);
  const [autoKey, setAutoKey] = useState(0);

  useEffect(() => {
    setPresetIndex(pickRandom(0));
    setMockupDark(Math.random() > 0.5);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setPresetIndex((prev) => pickRandom(prev));
      setMockupDark(Math.random() > 0.5);
    }, 3000);
    return () => clearInterval(timer);
  }, [autoKey]);

  function goNext() {
    setPresetIndex((prev) => pickRandom(prev));
    setMockupDark(Math.random() > 0.5);
    setAutoKey((prev) => prev + 1);
  }

  function goPrev() {
    setPresetIndex((prev) => pickRandom(prev));
    setMockupDark(Math.random() > 0.5);
    setAutoKey((prev) => prev + 1);
  }

  const colorName = COLOR_NAMES[presetIndex];
  const mockupColors = getMockupColors(colorName, mockupDark);
  const panel = getPanelColors(colorName, mockupDark);

  return (
    <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-card shadow-lg lg:flex lg:min-h-[680px]">
      {/* ─── Left: Branding Panel ─── */}

      {/* Desktop */}
      <div
        className={cn(
          "hidden lg:flex lg:w-1/2 flex-col items-center justify-evenly rounded-l-2xl px-12 transition-colors duration-700",
          panel.bg,
        )}
      >
        <span
          className={cn(
            "text-2xl font-bold tracking-tight transition-colors duration-700",
            panel.text,
          )}
        >
          핫딜닷쿨
        </span>

        <div className="flex items-end gap-4 sm:gap-6">
          <PhoneMockup colors={mockupColors} className="w-[140px]" />
          <BrowserMockup colors={mockupColors} className="w-[185px]" />
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={goPrev}
            className={cn(
              "rounded-full transition-colors duration-700",
              panel.btnBg, panel.btnText, panel.btnHoverBg, panel.btnHoverText,
            )}
          >
            <CaretLeft className="size-4" />
          </Button>
          <p
            className={cn(
              "text-center text-sm leading-relaxed transition-colors duration-700",
              panel.mutedText,
            )}
          >
            하나의 링크,{" "}
            <span className={cn("transition-colors duration-700", panel.primaryText)}>
              두 개의 완벽한 뷰
            </span>
          </p>
          <Button
            variant="ghost"
            size="icon"
            onClick={goNext}
            className={cn(
              "rounded-full transition-colors duration-700",
              panel.btnBg, panel.btnText, panel.btnHoverBg, panel.btnHoverText,
            )}
          >
            <CaretRight className="size-4" />
          </Button>
        </div>
      </div>

      {/* Mobile */}
      <div className="flex items-center justify-center gap-2 rounded-t-2xl bg-muted/50 px-4 py-5 lg:hidden">
        <span className="text-lg font-bold">핫딜닷쿨</span>
        <span className="text-xs text-muted-foreground">·</span>
        <span className="text-xs text-muted-foreground">
          하나의 링크, <span className="text-primary">두 개의 완벽한 뷰</span>
        </span>
      </div>

      {/* ─── Right: Form ─── */}
      <div className="flex flex-1 items-center justify-center p-8 sm:p-12 lg:w-1/2">
        <div key={contentKey} className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
          {children}
        </div>
      </div>
    </div>
  );
}
