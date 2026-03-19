import { useCallback } from "react";
import type { ProfileData, SocialLink, SocialPlatform } from "@/lib/profile-types";

type SetWithHistory = (updater: (prev: ProfileData) => ProfileData, immediate?: boolean) => void;

let tempSocialIdCounter = -1000;
function nextTempSocialId() { return tempSocialIdCounter--; }

export function useSocialActions(setWithHistory: SetWithHistory) {
  const addSocial = useCallback((platform: SocialPlatform) => {
    setWithHistory((prev) => {
      if (prev.socials.length >= 8) return prev;
      if (prev.socials.some((s) => s.platform === platform)) return prev;
      const newSocial: SocialLink = {
        id: nextTempSocialId(),
        platform,
        url: "",
      };
      return { ...prev, socials: [...prev.socials, newSocial] };
    }, true);
  }, [setWithHistory]);

  const updateSocial = useCallback((id: number, url: string) => {
    setWithHistory((prev) => ({
      ...prev,
      socials: prev.socials.map((s) => (s.id === id ? { ...s, url } : s)),
    }));
  }, [setWithHistory]);

  const removeSocial = useCallback((id: number) => {
    setWithHistory((prev) => ({
      ...prev,
      socials: prev.socials.filter((s) => s.id !== id),
    }), true);
  }, [setWithHistory]);

  const reorderSocials = useCallback((activeId: number, overId: number) => {
    setWithHistory((prev) => {
      const oldIndex = prev.socials.findIndex((s) => s.id === activeId);
      const newIndex = prev.socials.findIndex((s) => s.id === overId);
      if (oldIndex === -1 || newIndex === -1) return prev;
      const newSocials = [...prev.socials];
      const [removed] = newSocials.splice(oldIndex, 1);
      newSocials.splice(newIndex, 0, removed);
      return { ...prev, socials: newSocials };
    }, true);
  }, [setWithHistory]);

  return { addSocial, updateSocial, removeSocial, reorderSocials };
}
