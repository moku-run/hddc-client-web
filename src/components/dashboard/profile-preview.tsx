"use client";

import { useState, useEffect } from "react";
import { DeviceMobile, Desktop } from "@phosphor-icons/react";
import { ToggleGroup } from "@/components/ui/toggle-group";
import { PhonePreviewFrame, BrowserPreviewFrame } from "./dashboard-preview-frame";
import { ProfilePreviewContent } from "./profile-preview-content";
import { ProductProfile } from "@/components/profile-layouts";
import type { ProfileData } from "@/lib/profile-types";
import { FONT_FAMILY_CSS } from "@/lib/profile-types";
import { loadFont } from "@/lib/font-loader";
import { contrastForeground } from "@/lib/color-utils";

interface Props {
  profileData: ProfileData;
  reorderLinks?: (activeId: number, overId: number) => void;
}

export function ProfilePreview({ profileData, reorderLinks }: Props) {
  const [view, setView] = useState<"mobile" | "web">("mobile");

  useEffect(() => {
    loadFont(profileData.fontFamily);
  }, [profileData.fontFamily]);

  const themeAttr = profileData.colorTheme;
  const darkClass = profileData.darkMode ? "dark" : "";

  // Custom theme: override CSS variables inline
  const fontStyle = { fontFamily: FONT_FAMILY_CSS[profileData.fontFamily] };
  const customStyle = themeAttr === "custom" && profileData.customPrimaryColor
    ? {
        "--primary": profileData.customPrimaryColor,
        "--primary-foreground": contrastForeground(profileData.customPrimaryColor),
        "--ring": profileData.customPrimaryColor,
        ...fontStyle,
      } as React.CSSProperties
    : fontStyle as React.CSSProperties;

  return (
    <div className="flex h-full flex-col items-center gap-4 overflow-hidden p-3">
      {/* Toggle */}
      <div className="flex shrink-0 items-center gap-3">
        <span className="text-xs font-semibold text-muted-foreground">미리보기</span>
        <ToggleGroup
          variant="pill"
          size="sm"
          value={view}
          onValueChange={setView}
          options={[
            { value: "mobile" as const, label: "Mobile", icon: DeviceMobile },
            { value: "web" as const, label: "Web", icon: Desktop },
          ]}
        />
      </div>

      {/* Mockup with scoped theme */}
      {view === "mobile" ? (
        <div
          data-theme={themeAttr}
          className={`flex min-h-0 flex-1 items-start justify-center overflow-hidden ${darkClass}`}
          style={customStyle}
        >
          <PhonePreviewFrame className="w-[345px] shrink-0" slug={profileData.slug} backgroundColor={profileData.backgroundColor}>
            <ProductProfile profileData={profileData} />
          </PhonePreviewFrame>
        </div>
      ) : (
        <div
          data-theme={themeAttr}
          className={`min-h-0 flex-1 overflow-hidden ${darkClass}`}
          style={customStyle}
        >
          <BrowserPreviewFrame className="h-full w-full" slug={profileData.slug} backgroundColor={profileData.backgroundColor}>
            <ProductProfile profileData={profileData} />
          </BrowserPreviewFrame>
        </div>
      )}
    </div>
  );
}
