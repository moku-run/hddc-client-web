"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  type ProfileData,
  type ProfileLink,
  type SocialLink,
  DEFAULT_PROFILE,
} from "@/lib/profile-types";
import { profileApi, ApiError, type ProfileResponse } from "@/lib/api";
import { toast } from "sonner";
import { useHistory } from "./use-history";
import { useLinkActions } from "./profile-actions/link-actions";
import { useSocialActions } from "./profile-actions/social-actions";
import { useThemeActions } from "./profile-actions/theme-actions";

const HISTORY_DEBOUNCE_MS = 500;

type SaveStatus = "idle" | "saving" | "saved" | "error";
type LoadStatus = "loading" | "loaded" | "error";

/** 서버 응답 → 프론트 ProfileData 변환 */
export function toProfileData(res: ProfileResponse): ProfileData {
  return {
    slug: res.slug,
    nickname: res.nickname,
    bio: res.bio ?? "",
    avatarUrl: res.avatarUrl,
    backgroundUrl: res.backgroundUrl,
    backgroundColor: res.backgroundColor,
    fontColor: res.fontColor,
    linkLayout: res.linkLayout as ProfileData["linkLayout"],
    linkStyle: res.linkStyle as ProfileData["linkStyle"],
    linkRound: ((res as unknown as Record<string, unknown>).linkRound as ProfileData["linkRound"]) ?? "sm",
    fontFamily: res.fontFamily as ProfileData["fontFamily"],
    headerLayout: res.headerLayout as ProfileData["headerLayout"],
    linkAnimation: res.linkAnimation as ProfileData["linkAnimation"],
    colorTheme: res.colorTheme as ProfileData["colorTheme"],
    customPrimaryColor: res.customPrimaryColor,
    customSecondaryColor: res.customSecondaryColor,
    backgroundTexture: (res.backgroundTexture as ProfileData["backgroundTexture"]) ?? null,
    decorator1Type: (res.decorator1Type as ProfileData["decorator1Type"]) ?? null,
    decorator1Text: res.decorator1Text ?? null,
    decorator2Type: (res.decorator2Type as ProfileData["decorator2Type"]) ?? null,
    decorator2Text: res.decorator2Text ?? null,
    linkGradientFrom: res.linkGradientFrom ?? null,
    linkGradientTo: res.linkGradientTo ?? null,
    darkMode: res.darkMode,
    links: res.links.map((l): ProfileLink => ({
      id: l.id,
      title: l.title,
      url: l.url,
      imageUrl: l.imageUrl,
      description: l.description,
      order: l.order,
      enabled: l.enabled,
    })),
    socials: res.socials.map((s): SocialLink => ({
      id: s.id,
      platform: s.platform as SocialLink["platform"],
      url: s.url,
    })),
    plan: "free",
  };
}

export function useProfileData() {
  const [profileData, setProfileData] = useState<ProfileData>(DEFAULT_PROFILE);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [loadStatus, setLoadStatus] = useState<LoadStatus>("loading");
  const [hasProfile, setHasProfile] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const historyTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const initialized = useRef(false);
  const skipHistoryRef = useRef(false);
  const lastSnapshotRef = useRef<ProfileData>(DEFAULT_PROFILE);

  const history = useHistory<ProfileData>(30);

  // ─── 서버에서 프로필 로드 ───
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await profileApi.getMe();
        if (cancelled || !res.payload) return;
        const data = toProfileData(res.payload);
        setProfileData(data);
        lastSnapshotRef.current = data;
        setHasProfile(true);
        setLoadStatus("loaded");
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) {
          setProfileData(DEFAULT_PROFILE);
          setHasProfile(false);
          setLoadStatus("loaded");
        } else {
          setLoadStatus("error");
        }
      } finally {
        if (!cancelled) {
          initialized.current = true;
          setIsHydrated(true);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  // Snapshot immediately before structural changes
  const snapshot = useCallback(() => {
    history.push(lastSnapshotRef.current);
    lastSnapshotRef.current = profileData;
  }, [history, profileData]);

  // Debounced snapshot for text edits (coalesce rapid typing)
  const debouncedSnapshot = useCallback(() => {
    clearTimeout(historyTimerRef.current);
    const before = lastSnapshotRef.current;
    historyTimerRef.current = setTimeout(() => {
      if (before !== lastSnapshotRef.current) return;
      history.push(before);
      lastSnapshotRef.current = profileData;
    }, HISTORY_DEBOUNCE_MS);
  }, [history, profileData]);

  // Wrapped setProfileData that tracks history
  const setWithHistory = useCallback(
    (updater: (prev: ProfileData) => ProfileData, immediate = false) => {
      if (skipHistoryRef.current) {
        setProfileData(updater);
        return;
      }
      if (immediate) snapshot();
      else debouncedSnapshot();
      setProfileData(updater);
    },
    [snapshot, debouncedSnapshot],
  );

  const undoProfile = useCallback(() => {
    const prev = history.undo(profileData);
    if (prev) {
      skipHistoryRef.current = true;
      setProfileData(prev);
      lastSnapshotRef.current = prev;
      queueMicrotask(() => { skipHistoryRef.current = false; });
    }
  }, [history, profileData]);

  const redoProfile = useCallback(() => {
    const next = history.redo(profileData);
    if (next) {
      skipHistoryRef.current = true;
      setProfileData(next);
      lastSnapshotRef.current = next;
      queueMicrotask(() => { skipHistoryRef.current = false; });
    }
  }, [history, profileData]);

  // --- Domain-specific actions ---
  const linkActions = useLinkActions(setWithHistory);
  const socialActions = useSocialActions(setWithHistory);
  const themeActions = useThemeActions(setWithHistory);

  const updateProfile = useCallback(
    (fields: Partial<Pick<ProfileData, "avatarUrl" | "backgroundUrl" | "slug" | "nickname" | "bio">>) => {
      setWithHistory((prev) => ({ ...prev, ...fields }));
    },
    [setWithHistory],
  );

  // ─── 서버에 저장 (PATCH) ───
  const saveNow = useCallback(async (): Promise<boolean> => {
    setSaveStatus("saving");
    try {
      const res = await profileApi.updateMe({
        slug: profileData.slug,
        nickname: profileData.nickname,
        bio: profileData.bio || null,
        avatarUrl: profileData.avatarUrl,
        backgroundUrl: profileData.backgroundUrl,
        backgroundColor: profileData.backgroundColor,
        fontColor: profileData.fontColor,
        linkLayout: profileData.linkLayout,
        linkStyle: profileData.linkStyle,
        linkRound: profileData.linkRound,
        fontFamily: profileData.fontFamily,
        headerLayout: profileData.headerLayout,
        linkAnimation: profileData.linkAnimation,
        colorTheme: profileData.colorTheme,
        customPrimaryColor: profileData.customPrimaryColor,
        customSecondaryColor: profileData.customSecondaryColor,
        backgroundTexture: profileData.backgroundTexture,
        decorator1Type: profileData.decorator1Type,
        decorator1Text: profileData.decorator1Text,
        decorator2Type: profileData.decorator2Type,
        decorator2Text: profileData.decorator2Text,
        linkGradientFrom: profileData.linkGradientFrom,
        linkGradientTo: profileData.linkGradientTo,
        darkMode: profileData.darkMode,
        links: profileData.links.map((l) => ({
          ...(l.id > 0 ? { id: l.id } : {}),
          title: l.title,
          url: l.url,
          imageUrl: l.imageUrl,
          description: l.description,
          order: l.order,
          enabled: l.enabled,
        })),
        socials: profileData.socials.map((s) => ({
          ...(s.id > 0 ? { id: s.id } : {}),
          platform: s.platform,
          url: s.url,
        })),
      } as Record<string, unknown>);

      // 서버 응답으로 상태 동기화 (서버가 발급한 id 등 반영)
      if (res.payload) {
        const synced = toProfileData(res.payload);
        skipHistoryRef.current = true;
        setProfileData(synced);
        lastSnapshotRef.current = synced;
        queueMicrotask(() => { skipHistoryRef.current = false; });
      }

      setHasProfile(true);
      setSaveStatus("saved");
      return true;
    } catch (err) {
      setSaveStatus("error");
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("저장에 실패했습니다");
      }
      return false;
    }
  }, [profileData]);

  // ─── 초기화 (POST /reset) ───
  const resetProfile = useCallback(async () => {
    snapshot();
    try {
      await profileApi.resetMe();
      const res = await profileApi.getMe();
      if (res.payload) {
        const data = toProfileData(res.payload);
        setProfileData(data);
        lastSnapshotRef.current = data;
      }
    } catch {
      setProfileData(DEFAULT_PROFILE);
      lastSnapshotRef.current = DEFAULT_PROFILE;
    }
  }, [snapshot]);

  return {
    profileData,
    isHydrated,
    hasProfile,
    loadStatus,
    saveStatus,
    updateProfile,
    ...linkActions,
    ...socialActions,
    ...themeActions,
    resetProfile,
    saveNow,
    undoProfile,
    redoProfile,
    canUndo: history.canUndo,
    canRedo: history.canRedo,
  };
}
