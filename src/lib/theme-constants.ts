/**
 * Theme constants — single source of truth for preset theme data.
 * Both the dashboard editor and site-wide picker import from here.
 */
import { COLOR_THEMES, type ColorTheme } from "@/hooks/use-color-theme";

export type PresetTheme = Exclude<ColorTheme, "custom">;

export const PRESET_THEMES = COLOR_THEMES.filter(
  (t): t is PresetTheme => t !== "custom",
);

export const THEME_COLORS: Record<PresetTheme, { primary: string; secondary: string }> = {
  default: { primary: "oklch(0.205 0 0)", secondary: "oklch(0.55 0 0)" },
  teal: { primary: "oklch(0.6 0.118 184.704)", secondary: "oklch(0.828 0.08 184.364)" },
  orange: { primary: "oklch(0.553 0.195 38.402)", secondary: "oklch(0.837 0.128 66.29)" },
  blue: { primary: "oklch(0.5 0.134 242.749)", secondary: "oklch(0.828 0.111 230.318)" },
  violet: { primary: "oklch(0.491 0.27 292.581)", secondary: "oklch(0.811 0.111 293.571)" },
  yellow: { primary: "oklch(0.852 0.199 91.936)", secondary: "oklch(0.905 0.182 98.111)" },
  red: { primary: "oklch(0.505 0.213 27.518)", secondary: "oklch(0.808 0.114 19.571)" },
  white: { primary: "oklch(0.985 0 0)", secondary: "oklch(0.8 0 0)" },
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

/** Whether a theme swatch needs a visible border (light colors on light bg). */
export function needsSwatchBorder(theme: PresetTheme): boolean {
  return theme === "default" || theme === "white";
}

export const BG_PALETTE = [
  "#ffffff", "#f8fafc", "#f1f5f9", "#e2e8f0", "#94a3b8", "#475569", "#1e293b", "#0f172a",
  "#fefce8", "#fef3c7", "#ffedd5", "#fee2e2", "#fce7f3", "#fae8ff", "#ede9fe", "#dbeafe",
  "#ecfdf5", "#d1fae5", "#cffafe", "#e0f2fe", "#fef9c3", "#fed7aa", "#fecaca", "#e9d5ff",
];
