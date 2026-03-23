"use client";

import { useState, useEffect } from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";
import { type ColorTheme } from "@/hooks/use-color-theme";
import { Sun, Moon, Palette } from "@phosphor-icons/react";
import { FONT_FAMILY_LABELS, FONT_FAMILY_CSS, type FontFamily, type BackgroundTexture, type LinkRound, type LinkBorderThick } from "@/lib/profile-types";
import { autoSecondary } from "@/lib/color-utils";
import { PRESET_THEMES, THEME_COLORS, THEME_LABELS, BG_PALETTE, needsSwatchBorder } from "@/lib/theme-constants";
import { useSectionFocus } from "@/contexts/edit-focus-context";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { RemoveButton } from "@/components/ui/remove-button";
import { ColorPickerPopover } from "@/components/ui/color-picker-popover";
import { ToggleGroup, type ToggleGroupOption } from "@/components/ui/toggle-group";
import { SectionHeader } from "@/components/ui/section-header";

const FONT_OPTIONS: ToggleGroupOption<FontFamily>[] = (Object.keys(FONT_FAMILY_LABELS) as FontFamily[]).map((font) => ({
  value: font,
  label: FONT_FAMILY_LABELS[font],
}));

const TEXT_PALETTE = [
  "#000000", "#1e293b", "#334155", "#475569", "#64748b", "#94a3b8", "#e2e8f0", "#ffffff",
  "#991b1b", "#b91c1c", "#dc2626", "#c2410c", "#ea580c", "#d97706", "#ca8a04", "#65a30d",
  "#15803d", "#0d9488", "#0891b2", "#0284c7", "#2563eb", "#4f46e5", "#7c3aed", "#9333ea",
];

const TEXTURES: { value: BackgroundTexture | null; label: string }[] = [
  { value: null, label: "없음" },
  { value: "paper", label: "종이" },
  { value: "linen", label: "린넨" },
  { value: "concrete", label: "콘크리트" },
  { value: "fabric", label: "패브릭" },
  { value: "noise", label: "노이즈" },
];

interface Props {
  colorTheme: ColorTheme;
  darkMode: boolean;
  backgroundColor: string | null;
  fontColor: string | null;
  backgroundTexture: BackgroundTexture | null;
  customPrimaryColor: string | null;
  customSecondaryColor: string | null;
  fontFamily: FontFamily;
  linkRound: LinkRound;
  linkBorderColor: string | null;
  linkBorderThick: LinkBorderThick;
  setColorTheme: (theme: ColorTheme) => void;
  setDarkMode: (dark: boolean) => void;
  setBackgroundColor: (color: string | null) => void;
  setFontColor: (color: string | null) => void;
  setBackgroundTexture: (texture: BackgroundTexture | null) => void;
  setCustomColors: (primary: string, secondary: string) => void;
  setFontFamily: (font: FontFamily) => void;
  setLinkRound: (round: LinkRound) => void;
  setLinkBorderColor: (color: string | null) => void;
  setLinkBorderThick: (thick: LinkBorderThick) => void;
}

const LINK_ROUNDS: ToggleGroupOption<LinkRound>[] = [
  { value: "none", label: "직각" },
  { value: "sm", label: "조금" },
  { value: "md", label: "중간" },
  { value: "lg", label: "많이" },
];

const BORDER_THICKS: ToggleGroupOption<LinkBorderThick>[] = [
  { value: "none", label: "없음" },
  { value: "thin", label: "얇게" },
  { value: "medium", label: "보통" },
  { value: "thick", label: "두껍게" },
];

export function ThemeEditor({
  colorTheme, darkMode, backgroundColor, fontColor, backgroundTexture,
  customPrimaryColor, customSecondaryColor, fontFamily,
  linkRound, linkBorderColor, linkBorderThick,
  setColorTheme, setDarkMode, setBackgroundColor, setFontColor, setBackgroundTexture, setCustomColors, setFontFamily,
  setLinkRound, setLinkBorderColor, setLinkBorderThick,
}: Props) {
  const sectionFocus = useSectionFocus("theme");

  const [presetPickerOpen, setPresetPickerOpen] = useState(false);
  const [tempPrimary, setTempPrimary] = useState(customPrimaryColor || "#3b82f6");
  const [tempSecondary, setTempSecondary] = useState(customSecondaryColor || autoSecondary("#3b82f6"));
  const [autoSync, setAutoSync] = useState(true);

  useEffect(() => {
    if (autoSync) setTempSecondary(autoSecondary(tempPrimary));
  }, [tempPrimary, autoSync]);

  return (
    <section className="flex flex-col gap-4" {...sectionFocus}>
      <SectionHeader title="테마" />

      {/* Color presets */}
      <div>
        <p className="mb-2 text-xs text-muted-foreground">컬러 프리셋</p>
        <div className="grid grid-cols-4 gap-2">
          {PRESET_THEMES.map((theme) => (
            <Button
              key={theme}
              variant="ghost"
              aria-expanded={colorTheme === theme}
              onClick={() => setColorTheme(theme)}
              aria-label={THEME_LABELS[theme]}
              className="!h-auto flex flex-col items-center gap-1 rounded-lg p-2"
            >
              <div
                className={cn("size-7 rounded-full", needsSwatchBorder(theme) && "border border-border")}
                style={{
                  background: `linear-gradient(135deg, ${THEME_COLORS[theme].primary} 50%, ${THEME_COLORS[theme].secondary} 50%)`,
                }}
              />
              <span className="text-[10px] text-muted-foreground">{THEME_LABELS[theme]}</span>
            </Button>
          ))}
        </div>

        {/* Custom color preset picker */}
        <Popover open={presetPickerOpen} onOpenChange={(open) => {
          if (open) {
            const p = customPrimaryColor || "#3b82f6";
            setTempPrimary(p);
            setTempSecondary(customSecondaryColor || autoSecondary(p));
            setAutoSync(!customSecondaryColor);
          }
          setPresetPickerOpen(open);
        }}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              aria-expanded={colorTheme === "custom"}
              className="mt-2 w-full justify-center gap-1.5 text-xs font-medium"
            >
              {colorTheme === "custom" && customPrimaryColor ? (
                <div
                  className="size-4 rounded-full border border-border"
                  style={{
                    background: `linear-gradient(135deg, ${customPrimaryColor} 50%, ${customSecondaryColor || autoSecondary(customPrimaryColor)} 50%)`,
                  }}
                />
              ) : (
                <Palette className="size-4" />
              )}
              직접 선택
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3" align="start">
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                {/* Primary picker */}
                <div className="w-[200px]">
                  <p className="mb-1.5 text-[11px] font-medium text-muted-foreground">Primary</p>
                  <HexColorPicker
                    color={tempPrimary}
                    onChange={setTempPrimary}
                    style={{ width: "100%", height: "140px" }}
                  />
                  <div className="mt-2 flex items-center gap-2">
                    <div
                      className="size-7 shrink-0 rounded-md border border-border"
                      style={{ backgroundColor: tempPrimary }}
                    />
                    <div className="flex items-center gap-1 rounded-md border border-input px-2 py-1 text-sm">
                      <span className="text-muted-foreground">#</span>
                      <HexColorInput
                        color={tempPrimary}
                        onChange={setTempPrimary}
                        className="w-[5rem] bg-transparent uppercase outline-none"
                        prefixed={false}
                      />
                    </div>
                  </div>
                </div>

                {/* Secondary picker */}
                <div className="w-[200px]">
                  <div className="mb-1.5 flex items-center justify-between">
                    <p className="text-[11px] font-medium text-muted-foreground">Secondary</p>
                    <button
                      onClick={() => {
                        setAutoSync(!autoSync);
                        if (!autoSync) setTempSecondary(autoSecondary(tempPrimary));
                      }}
                      className={cn(
                        "cursor-pointer text-[10px] transition-colors",
                        autoSync ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {autoSync ? "자동" : "수동"}
                    </button>
                  </div>
                  <HexColorPicker
                    color={tempSecondary}
                    onChange={(hex) => { setAutoSync(false); setTempSecondary(hex); }}
                    style={{ width: "100%", height: "140px" }}
                  />
                  <div className="mt-2 flex items-center gap-2">
                    <div
                      className="size-7 shrink-0 rounded-md border border-border"
                      style={{ backgroundColor: tempSecondary }}
                    />
                    <div className="flex items-center gap-1 rounded-md border border-input px-2 py-1 text-sm">
                      <span className="text-muted-foreground">#</span>
                      <HexColorInput
                        color={tempSecondary}
                        onChange={(hex) => { setAutoSync(false); setTempSecondary(hex); }}
                        className="w-[5rem] bg-transparent uppercase outline-none"
                        prefixed={false}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Button
                size="sm"
                className="w-full"
                onClick={() => {
                  setCustomColors(tempPrimary, tempSecondary);
                  setColorTheme("custom");
                  setPresetPickerOpen(false);
                }}
              >
                적용
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Background color */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">배경 색상</p>
          {backgroundColor && (
            <RemoveButton label="초기화" onClick={() => setBackgroundColor(null)} />
          )}
        </div>
        <div className="grid grid-cols-8 gap-1.5">
          {BG_PALETTE.map((color) => (
            <button
              key={color}
              onClick={() => setBackgroundColor(color)}
              className={cn(
                "size-7 cursor-pointer rounded-full border transition-transform hover:scale-110",
                backgroundColor === color
                  ? "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                  : "",
                color === "#ffffff" ? "border-border" : "border-transparent",
              )}
              style={{ backgroundColor: color }}
              aria-label={color}
            />
          ))}
        </div>

        {/* Custom background color picker popover */}
        <ColorPickerPopover
          color={backgroundColor || "#ffffff"}
          onChange={(color) => setBackgroundColor(color)}
        />
      </div>

      {/* Background texture */}
      <div>
        <p className="mb-2 text-xs text-muted-foreground">배경 텍스처</p>
        <div className="grid grid-cols-3 gap-1.5">
          {TEXTURES.map(({ value, label }) => (
            <button
              key={label}
              onClick={() => setBackgroundTexture(value)}
              className={cn(
                "flex h-14 cursor-pointer items-end justify-center rounded-lg border p-1.5 text-[10px] font-medium transition-all",
                backgroundTexture === value
                  ? "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                  : "border-border hover:border-foreground/30",
              )}
              style={value ? {
                backgroundImage: `url(/textures/${value}.svg)`,
                backgroundSize: '80px',
                backgroundRepeat: 'repeat',
                backgroundColor: backgroundColor || '#f5f5f5',
                backgroundBlendMode: 'multiply',
              } : { backgroundColor: backgroundColor || '#f5f5f5' }}
            >
              <span className="rounded bg-background/80 px-1 py-0.5">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Font color */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">글자 색상</p>
          {fontColor && (
            <RemoveButton label="초기화" onClick={() => setFontColor(null)} />
          )}
        </div>
        <div className="grid grid-cols-8 gap-1.5">
          {TEXT_PALETTE.map((color) => (
            <button
              key={color}
              onClick={() => setFontColor(color)}
              className={cn(
                "size-7 cursor-pointer rounded-full border transition-transform hover:scale-110",
                fontColor === color
                  ? "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                  : "",
                color === "#ffffff" ? "border-border" : "border-transparent",
              )}
              style={{ backgroundColor: color }}
              aria-label={color}
            />
          ))}
        </div>

        <ColorPickerPopover
          color={fontColor || "#000000"}
          onChange={(color) => setFontColor(color)}
        />
      </div>

      {/* Font selector */}
      <div>
        <p className="mb-2 text-xs text-muted-foreground">폰트</p>
        <ToggleGroup
          variant="square"
          value={fontFamily}
          onValueChange={setFontFamily}
          options={FONT_OPTIONS}
          className="grid grid-cols-2 gap-1.5"
          renderItem={(option, isActive) => (
            <div className={cn("flex w-full flex-col rounded-lg px-3 py-2 text-left", isActive && "bg-muted ring-2 ring-foreground ring-offset-2 ring-offset-background")}>
              <span className="text-xs font-medium">{option.label}</span>
              <span className="mt-0.5 block text-[10px] text-muted-foreground" style={{ fontFamily: FONT_FAMILY_CSS[option.value] }}>
                가나다 ABC 123
              </span>
            </div>
          )}
        />
      </div>

      {/* Card border customization */}
      <div>
        <p className="mb-2 text-xs text-muted-foreground">상품 카드 라운드</p>
        <ToggleGroup variant="square" value={linkRound} onValueChange={setLinkRound} options={LINK_ROUNDS} />
      </div>

      <div>
        <p className="mb-2 text-xs text-muted-foreground">상품 카드 테두리 두께</p>
        <ToggleGroup variant="square" value={linkBorderThick} onValueChange={setLinkBorderThick} options={BORDER_THICKS} />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">상품 카드 테두리 색상</p>
          {linkBorderColor && (
            <RemoveButton label="초기화" onClick={() => setLinkBorderColor(null)} />
          )}
        </div>
        <ColorPickerPopover
          color={linkBorderColor || "#e5e7eb"}
          onChange={(color) => setLinkBorderColor(color)}
          triggerLabel="테두리 색상 선택"
        />
      </div>

      <div>
        <p className="mb-2 text-xs text-muted-foreground">모드</p>
        <ToggleGroup
          variant="pill"
          value={darkMode ? "dark" : "light"}
          onValueChange={(v: "light" | "dark") => setDarkMode(v === "dark")}
          options={[
            { value: "light" as const, label: "Light", icon: Sun },
            { value: "dark" as const, label: "Dark", icon: Moon },
          ]}
          renderItem={(option, isActive) => {
            const IconComp = option.icon!;
            return (
              <div className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                isActive ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}>
                <IconComp className="size-4" />
                {option.label}
              </div>
            );
          }}
        />
      </div>
    </section>
  );
}
