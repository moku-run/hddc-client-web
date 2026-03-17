"use client";

import { useState, useEffect, useCallback } from "react";
import { ColorThemeContext, type ColorTheme } from "@/hooks/use-color-theme";

const STORAGE_KEY = "hddc-color-theme";

function applyTheme(theme: ColorTheme) {
  if (theme === "teal") {
    delete document.documentElement.dataset.theme;
  } else {
    document.documentElement.dataset.theme = theme;
  }
}

export function ColorThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [colorTheme, setColorThemeState] = useState<ColorTheme>("teal");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ColorTheme | null;
    if (stored) {
      setColorThemeState(stored);
      applyTheme(stored);
    }
  }, []);

  const setColorTheme = useCallback((theme: ColorTheme) => {
    setColorThemeState(theme);
    localStorage.setItem(STORAGE_KEY, theme);
    applyTheme(theme);
  }, []);

  return (
    <ColorThemeContext.Provider value={{ colorTheme, setColorTheme }}>
      {children}
    </ColorThemeContext.Provider>
  );
}

/**
 * Blocking script to prevent Flash of Wrong Theme (FOWT).
 * Reads color theme from localStorage synchronously before first paint.
 * Content is a static string literal — no user input, no XSS risk.
 * This is the same pattern used by next-themes for dark mode flash prevention.
 */
export function ColorThemeScript() {
  // Static script — safe to inline, no dynamic user content
  const script = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}");if(t&&t!=="teal"){document.documentElement.dataset.theme=t}}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
