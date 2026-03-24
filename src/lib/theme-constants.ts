/**
 * Theme constants — single source of truth for preset theme data.
 * Both the dashboard editor and site-wide picker import from here.
 */
import { COLOR_THEMES, type ColorTheme } from "@/hooks/use-color-theme";

export type PresetTheme = Exclude<ColorTheme, "custom">;

export const PRESET_THEMES = COLOR_THEMES.filter(
  (t): t is PresetTheme => t !== "custom",
);

/** Swatch colors for the preset picker UI (gradient circle) */
export const THEME_COLORS: Record<PresetTheme, { primary: string; secondary: string }> = {
  default: { primary: "#0f172a", secondary: "#64748b" },
  teal: { primary: "#0d9488", secondary: "#5eead4" },
  orange: { primary: "#ea580c", secondary: "#fdba74" },
  blue: { primary: "#2563eb", secondary: "#93c5fd" },
  violet: { primary: "#7c3aed", secondary: "#c4b5fd" },
  yellow: { primary: "#ca8a04", secondary: "#fde047" },
  red: { primary: "#dc2626", secondary: "#fca5a5" },
  white: { primary: "#ffffff", secondary: "#e2e8f0" },
};

export const THEME_LABELS: Record<PresetTheme, string> = {
  default: "Default",
  teal: "틸",
  orange: "오렌지",
  blue: "블루",
  violet: "바이올렛",
  yellow: "옐로",
  red: "레드",
  white: "화이트",
};

/** Preset config: backgroundColor, fontColor, linkBorderColor */
export const THEME_PRESET_CONFIG: Record<PresetTheme, {
  backgroundColor: string | null;
  fontColor: string | null;
  linkBorderColor: string | null;
}> = {
  default: { backgroundColor: "#ffffff", fontColor: "#1a1a1a", linkBorderColor: "#2a2a2a" },
  teal:    { backgroundColor: "#f0fdfa", fontColor: "#134e4a", linkBorderColor: "#5eead4" },
  orange:  { backgroundColor: "#fff7ed", fontColor: "#9a3412", linkBorderColor: "#fdba74" },
  blue:    { backgroundColor: "#eff6ff", fontColor: "#1e40af", linkBorderColor: "#93c5fd" },
  violet:  { backgroundColor: "#f5f3ff", fontColor: "#5b21b6", linkBorderColor: "#c4b5fd" },
  yellow:  { backgroundColor: "#fefce8", fontColor: "#854d0e", linkBorderColor: "#fde047" },
  red:     { backgroundColor: "#fef2f2", fontColor: "#991b1b", linkBorderColor: "#fca5a5" },
  white:   { backgroundColor: "#ffffff", fontColor: "#0f172a", linkBorderColor: "#e2e8f0" },
};

/** Whether a theme swatch needs a visible border (light colors on light bg). */
export function needsSwatchBorder(theme: PresetTheme): boolean {
  return theme === "default" || theme === "white";
}

export const BG_PALETTE = [
  "#ffffff", "#f8fafc", "#f1f5f9", "#e2e8f0", "#94a3b8", "#475569", "#1e293b", "#0f172a",
  "#fefce8", "#fef3c7", "#ffedd5", "#fee2e2", "#fce7f3", "#fae8ff", "#ede9fe", "#dbeafe",
  "#ecfdf5", "#d1fae5", "#cffafe", "#e0f2fe", "#fef9c3", "#fed7aa", "#fecaca", "#e9d5ff",
];
