"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  type ProfileData,
  DEFAULT_PROFILE,
} from "@/lib/profile-types";
import { useHistory } from "./use-history";
import { useLinkActions } from "./profile-actions/link-actions";
import { useSocialActions } from "./profile-actions/social-actions";
import { useThemeActions } from "./profile-actions/theme-actions";

const STORAGE_KEY = "hddc-profile-data";
const DEBOUNCE_MS = 1000;
const HISTORY_DEBOUNCE_MS = 500;

type SaveStatus = "idle" | "saving" | "saved";

function loadFromStorage(): ProfileData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

function saveToStorage(data: ProfileData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useProfileData() {
  const [profileData, setProfileData] = useState<ProfileData>(DEFAULT_PROFILE);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [isHydrated, setIsHydrated] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const historyTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const initialized = useRef(false);
  const skipHistoryRef = useRef(false);
  const lastSnapshotRef = useRef<ProfileData>(DEFAULT_PROFILE);

  const history = useHistory<ProfileData>(30);

  useEffect(() => {
    const data = loadFromStorage();
    setProfileData(data);
    lastSnapshotRef.current = data;
    initialized.current = true;
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!initialized.current) return;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setSaveStatus("saving");
      saveToStorage(profileData);
      setTimeout(() => setSaveStatus("saved"), 300);
    }, DEBOUNCE_MS);
    return () => clearTimeout(timerRef.current);
  }, [profileData]);

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

  const resetProfile = useCallback(() => {
    snapshot();
    setProfileData(DEFAULT_PROFILE);
    lastSnapshotRef.current = DEFAULT_PROFILE;
    clearTimeout(timerRef.current);
    saveToStorage(DEFAULT_PROFILE);
  }, [snapshot]);

  const saveNow = useCallback(() => {
    clearTimeout(timerRef.current);
    setSaveStatus("saving");
    saveToStorage(profileData);
    setTimeout(() => setSaveStatus("saved"), 300);
  }, [profileData]);

  return {
    profileData,
    isHydrated,
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
