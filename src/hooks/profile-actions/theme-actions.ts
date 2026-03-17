import { useCallback } from "react";
import type { ProfileData, LinkLayout, LinkStyle, FontFamily, HeaderLayout, LinkAnimation } from "@/lib/profile-types";

type SetWithHistory = (updater: (prev: ProfileData) => ProfileData, immediate?: boolean) => void;

export function useThemeActions(setWithHistory: SetWithHistory) {
  const setColorTheme = useCallback(
    (theme: ProfileData["colorTheme"]) => {
      setWithHistory((prev) => ({ ...prev, colorTheme: theme }), true);
    },
    [setWithHistory],
  );

  const setDarkMode = useCallback((dark: boolean) => {
    setWithHistory((prev) => ({ ...prev, darkMode: dark }), true);
  }, [setWithHistory]);

  const setLinkLayout = useCallback((layout: LinkLayout) => {
    setWithHistory((prev) => ({ ...prev, linkLayout: layout }), true);
  }, [setWithHistory]);

  const setLinkStyle = useCallback((style: LinkStyle) => {
    setWithHistory((prev) => ({ ...prev, linkStyle: style }), true);
  }, [setWithHistory]);

  const setFontFamily = useCallback((font: FontFamily) => {
    setWithHistory((prev) => ({ ...prev, fontFamily: font }), true);
  }, [setWithHistory]);

  const setHeaderLayout = useCallback((layout: HeaderLayout) => {
    setWithHistory((prev) => ({ ...prev, headerLayout: layout }), true);
  }, [setWithHistory]);

  const setLinkAnimation = useCallback((anim: LinkAnimation) => {
    setWithHistory((prev) => ({ ...prev, linkAnimation: anim }), true);
  }, [setWithHistory]);

  const setBackgroundColor = useCallback((color: string | null) => {
    setWithHistory((prev) => ({ ...prev, backgroundColor: color }), true);
  }, [setWithHistory]);

  const setFontColor = useCallback((color: string | null) => {
    setWithHistory((prev) => ({ ...prev, fontColor: color }), true);
  }, [setWithHistory]);

  const setCustomColors = useCallback((primary: string, secondary: string) => {
    setWithHistory((prev) => ({ ...prev, customPrimaryColor: primary, customSecondaryColor: secondary }), true);
  }, [setWithHistory]);

  return {
    setColorTheme,
    setDarkMode,
    setLinkLayout,
    setLinkStyle,
    setFontFamily,
    setHeaderLayout,
    setLinkAnimation,
    setBackgroundColor,
    setFontColor,
    setCustomColors,
  };
}
