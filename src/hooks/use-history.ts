"use client";

import { useCallback, useRef, useState } from "react";

interface UseHistoryReturn<T> {
  /** Save current state before mutation */
  push: (state: T) => void;
  /** Move current state to future, return previous state */
  undo: (current: T) => T | undefined;
  /** Move current state to past, return next state */
  redo: (current: T) => T | undefined;
  canUndo: boolean;
  canRedo: boolean;
}

export function useHistory<T>(maxSize = 30): UseHistoryReturn<T> {
  const pastRef = useRef<T[]>([]);
  const futureRef = useRef<T[]>([]);
  const [counts, setCounts] = useState({ past: 0, future: 0 });

  const sync = useCallback(() => {
    setCounts({ past: pastRef.current.length, future: futureRef.current.length });
  }, []);

  const push = useCallback((state: T) => {
    pastRef.current = [...pastRef.current, state].slice(-maxSize);
    futureRef.current = [];
    sync();
  }, [maxSize, sync]);

  const undo = useCallback((current: T): T | undefined => {
    if (pastRef.current.length === 0) return undefined;
    const previous = pastRef.current.pop()!;
    futureRef.current.push(current);
    sync();
    return previous;
  }, [sync]);

  const redo = useCallback((current: T): T | undefined => {
    if (futureRef.current.length === 0) return undefined;
    const next = futureRef.current.pop()!;
    pastRef.current.push(current);
    sync();
    return next;
  }, [sync]);

  return {
    push,
    undo,
    redo,
    canUndo: counts.past > 0,
    canRedo: counts.future > 0,
  };
}
