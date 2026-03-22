"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { use } from "react";
import Link from "next/link";
import { UserCircle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { isReservedSlug } from "@/lib/reserved-slugs";
import { profileApi, ApiError } from "@/lib/api";
import { toProfileData } from "@/hooks/use-profile-data";
import { ProfilePreviewContent } from "@/components/dashboard/profile-preview-content";
import { FONT_FAMILY_CSS, type ProfileData } from "@/lib/profile-types";
import { loadFont } from "@/lib/font-loader";
import { contrastForeground } from "@/lib/color-utils";

interface Props {
  params: Promise<{ username: string }>;
}

export default function ProfilePage({ params }: Props) {
  const { username: rawUsername } = use(params);
  const username = decodeURIComponent(rawUsername);
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
      <div className="flex min-h-svh flex-col items-center justify-center px-4 text-center">
        <UserCircle className="size-20 text-primary/20" />
        <h1 className="mt-2 text-xl font-bold tracking-tight">
          존재하지 않는 프로필입니다
        </h1>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
          <span className="font-medium text-foreground">@{username}</span>은 아직 등록되지 않은 프로필이에요.
          <br />
          이 주소로 나만의 프로필을 만들어보세요!
        </p>

        <div className="mt-8 flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/">핫딜 보러가기</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/signup">회원가입</Link>
          </Button>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          이미 계정이 있으신가요?{" "}
          <Link href="/auth/login" className="font-medium text-primary underline-offset-4 hover:underline">
            로그인
          </Link>
        </p>
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
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col">
        <ProfilePreviewContent
          profileData={profileData}
          variant="mobile"
          readonly
        />
      </main>
    </div>
  );
}
