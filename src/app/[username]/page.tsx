"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { use } from "react";
import { isReservedSlug } from "@/lib/reserved-slugs";
import { profileApi, ApiError } from "@/lib/api";
import { toProfileData } from "@/hooks/use-profile-data";
import { ProfilePreviewContent } from "@/components/dashboard/profile-preview-content";
import { SponsorBanner } from "@/components/sponsor-banner";
import { FONT_FAMILY_CSS, type ProfileData } from "@/lib/profile-types";
import { loadFont } from "@/lib/font-loader";
import { contrastForeground } from "@/lib/color-utils";

interface Props {
  params: Promise<{ username: string }>;
}

export default function ProfilePage({ params }: Props) {
  const { username } = use(params);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);

  if (isReservedSlug(username)) {
    notFound();
  }

  useEffect(() => {
    profileApi.getBySlug(username)
      .then((res) => {
        if (res.payload) setProfileData(toProfileData(res.payload));
        else setNotFoundState(true);
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) setNotFoundState(true);
        else setNotFoundState(true);
      })
      .finally(() => setLoading(false));
  }, [username]);

  useEffect(() => {
    if (profileData) loadFont(profileData.fontFamily);
  }, [profileData?.fontFamily]);

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (notFoundState || !profileData) {
    return (
      <div className="flex min-h-svh flex-col">
        <main className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">존재하지 않는 프로필입니다</p>
        </main>
      </div>
    );
  }

  // 테마 스타일 (프리뷰와 동일)
  const themeAttr = profileData.colorTheme;
  const darkClass = profileData.darkMode ? "dark" : "";
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
    <div
      data-theme={themeAttr}
      className={`flex min-h-svh flex-col ${darkClass}`}
      style={customStyle}
    >
      <main className="mx-auto w-full max-w-lg flex-1">
        <ProfilePreviewContent
          profileData={profileData}
          variant="mobile"
          readonly
        />
      </main>
      <SponsorBanner plan={profileData.plan} />
    </div>
  );
}
