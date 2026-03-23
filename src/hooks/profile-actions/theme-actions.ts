import { useCallback } from "react";
import type { ProfileData, PageLayout, LinkLayout, LinkStyle, LinkRound, FontFamily, HeaderLayout, LinkAnimation, BackgroundTexture, DecoratorType } from "@/lib/profile-types";

type SetWithHistory = (updater: (prev: ProfileData) => ProfileData, immediate?: boolean) => void;

export function useThemeActions(setWithHistory: SetWithHistory) {
  const setPageLayout = useCallback((layout: PageLayout) => {
    setWithHistory((prev) => ({ ...prev, pageLayout: layout }), true);
  }, [setWithHistory]);

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

  const setLinkRound = useCallback((round: LinkRound) => {
    setWithHistory((prev) => ({ ...prev, linkRound: round }), true);
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

  const setBackgroundTexture = useCallback((texture: BackgroundTexture | null) => {
    setWithHistory((prev) => ({ ...prev, backgroundTexture: texture }), true);
  }, [setWithHistory]);

  const setDecorator1 = useCallback((type: DecoratorType | null, text?: string | null) => {
    setWithHistory((prev) => ({
      ...prev,
      decorator1Type: type,
      decorator1Text: type === "text" ? (text ?? prev.decorator1Text) : null,
    }), true);
  }, [setWithHistory]);

  const setDecorator1Text = useCallback((text: string) => {
    setWithHistory((prev) => ({ ...prev, decorator1Text: text }));
  }, [setWithHistory]);

  const setDecorator2 = useCallback((type: DecoratorType | null, text?: string | null) => {
    setWithHistory((prev) => ({
      ...prev,
      decorator2Type: type,
      decorator2Text: type === "text" ? (text ?? prev.decorator2Text) : null,
    }), true);
  }, [setWithHistory]);

  const setDecorator2Text = useCallback((text: string) => {
    setWithHistory((prev) => ({ ...prev, decorator2Text: text }));
  }, [setWithHistory]);

  const setLinkGradient = useCallback((from: string | null, to: string | null) => {
    setWithHistory((prev) => ({ ...prev, linkGradientFrom: from, linkGradientTo: to }), true);
  }, [setWithHistory]);

  return {
    setPageLayout,
    setColorTheme,
    setDarkMode,
    setLinkLayout,
    setLinkStyle,
    setLinkRound,
    setFontFamily,
    setHeaderLayout,
    setLinkAnimation,
    setBackgroundColor,
    setFontColor,
    setCustomColors,
    setBackgroundTexture,
    setDecorator1,
    setDecorator1Text,
    setDecorator2,
    setDecorator2Text,
    setLinkGradient,
  };
}
