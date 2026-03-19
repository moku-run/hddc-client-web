"use client";

import { useImageUrl } from "@/hooks/use-image-url";

interface R2ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
  imageKey: string | null;
}

/**
 * R2 이미지 key → pre-signed URL로 자동 변환하여 표시하는 컴포넌트
 */
export function R2Image({ imageKey, alt = "", ...props }: R2ImageProps) {
  const url = useImageUrl(imageKey);

  if (!url) return null;

  return <img src={url} alt={alt} {...props} />;
}
