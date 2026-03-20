"use client";

import { useState, useEffect, useRef } from "react";
import { getImageUrl } from "@/lib/api";

const cache = new Map<string, string>();

/**
 * 이미지 key → pre-signed GET URL 변환 훅
 * - key가 바뀌어도 새 URL이 로드될 때까지 이전 URL을 유지 (깜빡임 방지)
 */
export function useImageUrl(key: string | null): string | null {
  const [url, setUrl] = useState<string | null>(() => {
    if (!key) return null;
    if (key.startsWith("http") || key.startsWith("data:")) return key;
    return cache.get(key) ?? null;
  });
  const prevKeyRef = useRef(key);

  useEffect(() => {
    if (!key) {
      setUrl(null);
      prevKeyRef.current = key;
      return;
    }
    if (key.startsWith("http") || key.startsWith("data:")) {
      setUrl(key);
      prevKeyRef.current = key;
      return;
    }

    const cached = cache.get(key);
    if (cached) {
      setUrl(cached);
      prevKeyRef.current = key;
      return;
    }

    // 새 key 로딩 중: 이전 URL 유지 (setUrl 호출 안 함)
    let cancelled = false;
    getImageUrl(key).then((resolved) => {
      if (cancelled) return;
      cache.set(key, resolved);
      setUrl(resolved);
      prevKeyRef.current = key;
    }).catch(() => {
      if (!cancelled) setUrl(null);
    });

    return () => { cancelled = true; };
  }, [key]);

  return url;
}
