"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type EditSection =
  | "slug"
  | "background"
  | "avatar"
  | "nickname"
  | "bio"
  | "links"
  | "socials"
  | "theme"
  | null;

interface EditFocusContextValue {
  activeSection: EditSection;
  setActiveSection: (section: EditSection) => void;
  activeLinkId: string | null;
  setActiveLinkId: (id: string | null) => void;
}

const EditFocusContext = createContext<EditFocusContextValue>({
  activeSection: null,
  setActiveSection: () => {},
  activeLinkId: null,
  setActiveLinkId: () => {},
});

export function EditFocusProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState<EditSection>(null);
  const [activeLinkId, setActiveLinkId] = useState<string | null>(null);
  return (
    <EditFocusContext.Provider value={{ activeSection, setActiveSection, activeLinkId, setActiveLinkId }}>
      {children}
    </EditFocusContext.Provider>
  );
}

export function useEditFocus() {
  return useContext(EditFocusContext);
}

/**
 * Returns onMouseEnter / onMouseLeave / onFocus / onBlur handlers
 * that set the active edit section in context.
 */
export function useSectionFocus(section: NonNullable<EditSection>) {
  const { setActiveSection } = useEditFocus();

  const onMouseEnter = useCallback(() => setActiveSection(section), [setActiveSection, section]);
  const onMouseLeave = useCallback(() => setActiveSection(null), [setActiveSection]);
  const onFocus = useCallback(() => setActiveSection(section), [setActiveSection, section]);
  const onBlur = useCallback(
    (e: React.FocusEvent) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        setActiveSection(null);
      }
    },
    [setActiveSection],
  );

  return { onMouseEnter, onMouseLeave, onFocus, onBlur };
}
