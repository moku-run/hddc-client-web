"use client";

import { useState, useEffect } from "react";
import { getImageUrl } from "@/lib/api";

const cache = new Map<string, string>();

/**
 * 이미지 key → pre-signed GET URL 변환 훅
 * - key가 null이면 null 반환
 * - key가 http로 시작하면 (이미 URL이면) 그대로 반환
 * - 그 외 key → GET /api/upload/presigned-url?key=... 호출
 * - 결과를 메모리 캐시에 저장
 */
export function useImageUrl(key: string | null): string | null {
  const [url, setUrl] = useState<string | null>(() => {
    if (!key) return null;
    if (key.startsWith("http") || key.startsWith("data:")) return key;
    return cache.get(key) ?? null;
  });

  useEffect(() => {
    if (!key) { setUrl(null); return; }
    if (key.startsWith("http") || key.startsWith("data:")) { setUrl(key); return; }

    const cached = cache.get(key);
    if (cached) { setUrl(cached); return; }

    let cancelled = false;
    getImageUrl(key).then((resolved) => {
      if (cancelled) return;
      cache.set(key, resolved);
      setUrl(resolved);
    }).catch(() => {
      if (!cancelled) setUrl(null);
    });

    return () => { cancelled = true; };
  }, [key]);

  return url;
}
