/**
 * Auth page mockup color presets.
 * Uses explicit Tailwind color classes instead of CSS variable tokens
 * to bypass next-themes dark mode cascade.
 */

export type MockupColors = {
  card: string;
  border: string;
  content: string;
  text: string;
  muted: string;
  mutedText: string;
  notch: string;
  primary: string;
  primaryBg: string;
  primarySubtle: string;
  primaryBar: string;
};

export type PanelColors = {
  bg: string;
  text: string;
  mutedText: string;
  primaryText: string;
  btnBg: string;
  btnText: string;
  btnHoverBg: string;
  btnHoverText: string;
};

const LIGHT_BASE = {
  card: "bg-white",
  border: "border-gray-200",
  content: "bg-white",
  text: "text-gray-900",
  muted: "bg-gray-100",
  mutedText: "text-gray-500",
  notch: "bg-gray-200",
} as const;

const DARK_BASE = {
  card: "bg-zinc-800",
  border: "border-white/10",
  content: "bg-zinc-900",
  text: "text-zinc-100",
  muted: "bg-zinc-700/60",
  mutedText: "text-zinc-400",
  notch: "bg-zinc-600",
} as const;

type ColorAccent = Pick<MockupColors, "primary" | "primaryBg" | "primarySubtle" | "primaryBar">;

const COLOR_ACCENTS: Record<string, { light: ColorAccent; dark: ColorAccent }> = {
  teal: {
    light: { primary: "text-teal-700", primaryBg: "bg-teal-600/10", primarySubtle: "bg-teal-600/5", primaryBar: "bg-teal-600/20" },
    dark: { primary: "text-teal-400", primaryBg: "bg-teal-400/10", primarySubtle: "bg-teal-400/5", primaryBar: "bg-teal-400/20" },
  },
  orange: {
    light: { primary: "text-orange-600", primaryBg: "bg-orange-500/10", primarySubtle: "bg-orange-500/5", primaryBar: "bg-orange-500/20" },
    dark: { primary: "text-orange-400", primaryBg: "bg-orange-400/10", primarySubtle: "bg-orange-400/5", primaryBar: "bg-orange-400/20" },
  },
  blue: {
    light: { primary: "text-blue-600", primaryBg: "bg-blue-500/10", primarySubtle: "bg-blue-500/5", primaryBar: "bg-blue-500/20" },
    dark: { primary: "text-blue-400", primaryBg: "bg-blue-400/10", primarySubtle: "bg-blue-400/5", primaryBar: "bg-blue-400/20" },
  },
  violet: {
    light: { primary: "text-violet-600", primaryBg: "bg-violet-500/10", primarySubtle: "bg-violet-500/5", primaryBar: "bg-violet-500/20" },
    dark: { primary: "text-violet-400", primaryBg: "bg-violet-400/10", primarySubtle: "bg-violet-400/5", primaryBar: "bg-violet-400/20" },
  },
  yellow: {
    light: { primary: "text-yellow-600", primaryBg: "bg-yellow-500/10", primarySubtle: "bg-yellow-500/5", primaryBar: "bg-yellow-500/20" },
    dark: { primary: "text-yellow-400", primaryBg: "bg-yellow-400/10", primarySubtle: "bg-yellow-400/5", primaryBar: "bg-yellow-400/20" },
  },
  red: {
    light: { primary: "text-red-600", primaryBg: "bg-red-500/10", primarySubtle: "bg-red-500/5", primaryBar: "bg-red-500/20" },
    dark: { primary: "text-red-400", primaryBg: "bg-red-400/10", primarySubtle: "bg-red-400/5", primaryBar: "bg-red-400/20" },
  },
  black: {
    light: { primary: "text-gray-900", primaryBg: "bg-gray-900/10", primarySubtle: "bg-gray-900/5", primaryBar: "bg-gray-900/20" },
    dark: { primary: "text-gray-400", primaryBg: "bg-gray-400/10", primarySubtle: "bg-gray-400/5", primaryBar: "bg-gray-400/20" },
  },
  default: {
    light: { primary: "text-gray-500", primaryBg: "bg-gray-400/10", primarySubtle: "bg-gray-400/5", primaryBar: "bg-gray-400/15" },
    dark: { primary: "text-gray-300", primaryBg: "bg-gray-300/10", primarySubtle: "bg-gray-300/5", primaryBar: "bg-gray-300/20" },
  },
};

const LIGHT_PANEL: Omit<PanelColors, "primaryText"> = {
  bg: "bg-white",
  text: "text-gray-900",
  mutedText: "text-gray-500",
  btnBg: "bg-gray-900/5",
  btnText: "text-gray-500",
  btnHoverBg: "hover:bg-gray-900/10",
  btnHoverText: "hover:text-gray-900",
};

const DARK_PANEL: Omit<PanelColors, "primaryText"> = {
  bg: "bg-zinc-900",
  text: "text-zinc-100",
  mutedText: "text-zinc-400",
  btnBg: "bg-white/5",
  btnText: "text-zinc-400",
  btnHoverBg: "hover:bg-white/10",
  btnHoverText: "hover:text-zinc-100",
};

export const COLOR_NAMES = ["default", "teal", "orange", "blue", "violet", "yellow", "red", "black"] as const;

export function getMockupColors(color: string, dark: boolean): MockupColors {
  const base = dark ? DARK_BASE : LIGHT_BASE;
  const mode = dark ? "dark" : "light";
  const accent = COLOR_ACCENTS[color]?.[mode] ?? COLOR_ACCENTS.teal[mode];
  return { ...base, ...accent };
}

export function getPanelColors(color: string, mockupDark: boolean): PanelColors {
  // Panel is always the OPPOSITE mode of the mockup
  const panelBase = mockupDark ? LIGHT_PANEL : DARK_PANEL;
  const panelMode = mockupDark ? "light" : "dark";
  const accent = COLOR_ACCENTS[color]?.[panelMode] ?? COLOR_ACCENTS.teal[panelMode];
  return { ...panelBase, primaryText: accent.primary };
}
