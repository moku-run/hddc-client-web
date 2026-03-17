import { useCallback } from "react";
import type { ProfileData, ProfileLink } from "@/lib/profile-types";

type SetWithHistory = (updater: (prev: ProfileData) => ProfileData, immediate?: boolean) => void;

export function useLinkActions(setWithHistory: SetWithHistory) {
  const addLink = useCallback(() => {
    setWithHistory((prev) => {
      if (prev.links.length >= 20) return prev;
      const newLink: ProfileLink = {
        id: crypto.randomUUID(),
        title: "",
        url: "",
        imageUrl: "",
        description: "",
        order: prev.links.length,
        enabled: true,
      };
      return { ...prev, links: [...prev.links, newLink] };
    }, true);
  }, [setWithHistory]);

  const updateLink = useCallback(
    (id: string, fields: Partial<Pick<ProfileLink, "title" | "url" | "imageUrl" | "description">>) => {
      setWithHistory((prev) => ({
        ...prev,
        links: prev.links.map((l) => (l.id === id ? { ...l, ...fields } : l)),
      }));
    },
    [setWithHistory],
  );

  const removeLink = useCallback((id: string) => {
    setWithHistory((prev) => ({
      ...prev,
      links: prev.links
        .filter((l) => l.id !== id)
        .map((l, i) => ({ ...l, order: i })),
    }), true);
  }, [setWithHistory]);

  const toggleLink = useCallback((id: string) => {
    setWithHistory((prev) => ({
      ...prev,
      links: prev.links.map((l) =>
        l.id === id ? { ...l, enabled: !l.enabled } : l
      ),
    }), true);
  }, [setWithHistory]);

  const moveLink = useCallback((id: string, direction: "up" | "down") => {
    setWithHistory((prev) => {
      const idx = prev.links.findIndex((l) => l.id === id);
      if (idx === -1) return prev;
      const newIdx = direction === "up" ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= prev.links.length) return prev;
      const newLinks = [...prev.links];
      [newLinks[idx], newLinks[newIdx]] = [newLinks[newIdx], newLinks[idx]];
      return {
        ...prev,
        links: newLinks.map((l, i) => ({ ...l, order: i })),
      };
    }, true);
  }, [setWithHistory]);

  const reorderLinks = useCallback((activeId: string, overId: string) => {
    setWithHistory((prev) => {
      const oldIndex = prev.links.findIndex((l) => l.id === activeId);
      const newIndex = prev.links.findIndex((l) => l.id === overId);
      if (oldIndex === -1 || newIndex === -1) return prev;
      const newLinks = [...prev.links];
      const [removed] = newLinks.splice(oldIndex, 1);
      newLinks.splice(newIndex, 0, removed);
      return { ...prev, links: newLinks.map((l, i) => ({ ...l, order: i })) };
    }, true);
  }, [setWithHistory]);

  return { addLink, updateLink, removeLink, toggleLink, moveLink, reorderLinks };
}
