"use client";

import { useImageUrl } from "@/hooks/use-image-url";

interface R2ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
  imageKey: string | null;
}

/**
 * R2 이미지 key → pre-signed URL로 자동 변환하여 표시하는 컴포넌트
 * - URL 로딩 중에도 레이아웃 높이를 유지하여 움찔거림 방지
 */
export function R2Image({ imageKey, alt = "", style, ...props }: R2ImageProps) {
  const url = useImageUrl(imageKey);

  if (!imageKey) return null;

  // key는 있지만 URL 아직 로딩 중 → 빈 영역 유지 (투명)
  if (!url) {
    return (
      <div
        className={props.className}
        style={style}
        aria-hidden
      />
    );
  }

  return <img src={url} alt={alt} style={style} {...props} />;
}
