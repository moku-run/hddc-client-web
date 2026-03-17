"use client";

import { useState } from "react";
import {
  useColorTheme,
  COLOR_THEMES,
  type ColorTheme,
} from "@/hooks/use-color-theme";
import { Button } from "@/components/ui/button";
import { ColorSwatch } from "@/components/ui/color-swatch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Palette } from "@phosphor-icons/react";

const PRESET_THEMES = COLOR_THEMES.filter((t) => t !== "custom");

const THEME_COLORS: Record<Exclude<ColorTheme, "custom">, string> = {
  default: "oklch(0.205 0 0)",
  teal: "oklch(0.6 0.118 184.704)",
  orange: "oklch(0.646 0.222 41.116)",
  blue: "oklch(0.588 0.158 241.966)",
  violet: "oklch(0.541 0.281 293.009)",
  yellow: "oklch(0.852 0.199 91.936)",
  red: "oklch(0.577 0.245 27.325)",
  white: "oklch(0.985 0 0)",
};

const THEME_LABELS: Record<Exclude<ColorTheme, "custom">, string> = {
  default: "Default",
  teal: "틸",
  orange: "오렌지",
  blue: "블루",
  violet: "바이올렛",
  yellow: "옐로",
  red: "레드",
  white: "화이트",
};

export function ColorThemePicker() {
  const { colorTheme, setColorTheme } = useColorTheme();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="색상 테마 선택">
          <Palette className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2.5" align="end">
        <div className="flex gap-2">
          {PRESET_THEMES.map((theme) => (
            <ColorSwatch
              key={theme}
              color={THEME_COLORS[theme as Exclude<ColorTheme, "custom">]}
              selected={colorTheme === theme}
              bordered={theme === "default" || theme === "white"}
              onClick={() => {
                setColorTheme(theme);
                setOpen(false);
              }}
              label={THEME_LABELS[theme as Exclude<ColorTheme, "custom">]}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
