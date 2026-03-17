"use client";

import { createContext, useContext } from "react";

export const COLOR_THEMES = [
  "default",
  "teal",
  "orange",
  "blue",
  "violet",
  "yellow",
  "red",
  "white",
  "custom",
] as const;

export type ColorTheme = (typeof COLOR_THEMES)[number];

interface ColorThemeContextValue {
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
}

export const ColorThemeContext = createContext<ColorThemeContextValue>({
  colorTheme: "teal",
  setColorTheme: () => {},
});

export function useColorTheme() {
  return useContext(ColorThemeContext);
}
