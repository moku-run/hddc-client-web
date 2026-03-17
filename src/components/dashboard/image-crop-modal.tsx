"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  MagnifyingGlassPlus,
  MagnifyingGlassMinus,
  ArrowsClockwise,
  UploadSimple,
} from "@phosphor-icons/react";

type CropVariant = "circle" | "banner";

/* ── Crop & output dimensions ── */
const CROP_CONFIGS = {
  circle: { cropW: 200, cropH: 200, outW: 400, outH: 400 },
  banner: { cropW: 380, cropH: 152, outW: 1400, outH: 560 },
} as const;

const LINK_CROP = { cropW: 160, cropH: 160, outW: 400, outH: 400 };

/* Container for overlay modes (padding around crop for context) */
const CONTAINER = {
  circle: { w: 300, h: 300 },
  banner: { w: 460, h: 232 },
} as const;

/* Recommended upload sizes shown to user */
const SIZE_HINTS: Record<CropVariant, string> = {
  circle: "400 × 400px",
  banner: "1400 × 560px",
};

interface Props {
  file?: File | null;
  open: boolean;
  onApply: (dataUrl: string) => void;
  onCancel: () => void;
  onRemove?: () => void;
  variant?: CropVariant;
  modalTitle?: string;
  linkTitle?: string;
  initialSrc?: string | null;
}

export function ImageCropModal({
  file: externalFile,
  open,
  onApply,
  onCancel,
  onRemove,
  variant = "circle",
  modalTitle,
  linkTitle,
  initialSrc,
}: Props) {
  const isLinkMode = !!linkTitle;
  const useOverlay = !isLinkMode;

  const config = isLinkMode ? LINK_CROP : CROP_CONFIGS[variant];
  const { cropW, cropH, outW, outH } = config;

  const containerW = useOverlay ? CONTAINER[variant].w : cropW;
  const containerH = useOverlay ? CONTAINER[variant].h : cropH;
  const padX = (containerW - cropW) / 2;
  const padY = (containerH - cropH) / 2;

  /* SVG overlay path — evenodd creates a transparent hole at the crop area */
  const svgCx = containerW / 2;
  const svgCy = containerH / 2;
  const svgR = cropW / 2;
  const overlayPath =
    variant === "circle"
      ? `M0,0H${containerW}V${containerH}H0Z M${svgCx},${svgCy - svgR}a${svgR},${svgR},0,1,1,0,${svgR * 2}a${svgR},${svgR},0,1,1,0,-${svgR * 2}Z`
      : `M0,0H${containerW}V${containerH}H0Z M${padX},${padY}h${cropW}v${cropH}h-${cropW}Z`;

  const [internalFile, setInternalFile] = useState<File | null>(null);
  const file = externalFile || internalFile;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imgSrc, setImgSrc] = useState("");
  const [natSize, setNatSize] = useState({ w: 0, h: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, ox: 0, oy: 0 });

  /* Saved initial state for reset */
  const savedInitial = useRef({ zoom: 1, offset: { x: 0, y: 0 } });

  function applyImageLoad(w: number, h: number) {
    const bs = Math.max(cropW / w, cropH / h);
    const initOffset = {
      x: -(w * bs - cropW) / 2,
      y: -(h * bs - cropH) / 2,
    };
    setNatSize({ w, h });
    setZoom(1);
    setOffset(initOffset);
    savedInitial.current = { zoom: 1, offset: initOffset };
  }

  /* Reset on close */
  useEffect(() => {
    if (!open) {
      setInternalFile(null);
      setImgSrc("");
      setNatSize({ w: 0, h: 0 });
      setOffset({ x: 0, y: 0 });
      setZoom(1);
    }
  }, [open]);

  /* Load initialSrc (existing image) when modal opens */
  useEffect(() => {
    if (!open || !initialSrc) return;
    const img = new Image();
    img.onload = () => {
      setImgSrc(initialSrc);
      applyImageLoad(img.width, img.height);
    };
    img.src = initialSrc;
  }, [open, initialSrc, cropW, cropH]);

  /* Load file (new upload) */
  useEffect(() => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      setImgSrc(src);
      const img = new Image();
      img.onload = () => applyImageLoad(img.width, img.height);
      img.src = src;
    };
    reader.readAsDataURL(file);
  }, [file, cropW, cropH]);

  /* ── Scale calculations ── */
  const coverScale =
    natSize.w && natSize.h ? Math.max(cropW / natSize.w, cropH / natSize.h) : 1;
  const fitScale =
    natSize.w && natSize.h ? Math.min(cropW / natSize.w, cropH / natSize.h) : 1;

  /* Allow zooming out to 70% of fitScale (shows full image with margin) */
  const minZoom = Math.max(0.3, fitScale / coverScale * 0.7);
  const maxZoom = 4;

  const scale = coverScale * zoom;
  const displayW = natSize.w * scale;
  const displayH = natSize.h * scale;

  const SLACK = 40; // px — allows moving slightly beyond crop boundary
  const clampOffset = useCallback(
    (ox: number, oy: number) => {
      if (displayW < cropW) {
        // Image smaller than crop: center with slight freedom
        const center = (cropW - displayW) / 2;
        return {
          x: Math.max(center - SLACK, Math.min(center + SLACK, ox)),
          y: displayH < cropH
            ? (() => { const cy = (cropH - displayH) / 2; return Math.max(cy - SLACK, Math.min(cy + SLACK, oy)); })()
            : Math.max(-(displayH - cropH) - SLACK, Math.min(SLACK, oy)),
        };
      }
      return {
        x: Math.max(-(displayW - cropW) - SLACK, Math.min(SLACK, ox)),
        y: displayH < cropH
          ? (() => { const cy = (cropH - displayH) / 2; return Math.max(cy - SLACK, Math.min(cy + SLACK, oy)); })()
          : Math.max(-(displayH - cropH) - SLACK, Math.min(SLACK, oy)),
      };
    },
    [displayW, displayH, cropW, cropH],
  );

  function handlePointerDown(e: React.PointerEvent) {
    e.preventDefault();
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragging) return;
    setOffset(
      clampOffset(
        dragStart.current.ox + (e.clientX - dragStart.current.x),
        dragStart.current.oy + (e.clientY - dragStart.current.y),
      ),
    );
  }

  function handlePointerUp() {
    setDragging(false);
  }

  function handleZoom(newZoom: number) {
    const clamped = Math.max(minZoom, Math.min(maxZoom, newZoom));
    const oldScale = coverScale * zoom;
    const newScale = coverScale * clamped;
    const cx = (-offset.x + cropW / 2) / oldScale;
    const cy = (-offset.y + cropH / 2) / oldScale;
    const newOx = -(cx * newScale - cropW / 2);
    const newOy = -(cy * newScale - cropH / 2);
    const w = natSize.w * newScale;
    const h = natSize.h * newScale;
    setZoom(clamped);
    setOffset({
      x: w >= cropW
        ? Math.max(-(w - cropW) - SLACK, Math.min(SLACK, newOx))
        : Math.max((cropW - w) / 2 - SLACK, Math.min((cropW - w) / 2 + SLACK, newOx)),
      y: h >= cropH
        ? Math.max(-(h - cropH) - SLACK, Math.min(SLACK, newOy))
        : Math.max((cropH - h) / 2 - SLACK, Math.min((cropH - h) / 2 + SLACK, newOy)),
    });
  }

  /* Wheel zoom support */
  function handleWheel(e: React.WheelEvent) {
    e.preventDefault();
    const delta = -e.deltaY * 0.002;
    handleZoom(zoom + delta);
  }

  function handleReset() {
    const { zoom: z, offset: o } = savedInitial.current;
    setZoom(z);
    setOffset(o);
  }

  function handleApply() {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, outW, outH);
      const srcX = -offset.x / scale;
      const srcY = -offset.y / scale;
      const srcW = cropW / scale;
      const srcH = cropH / scale;
      ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, outW, outH);
      onApply(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.src = imgSrc;
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setInternalFile(f);
    e.target.value = "";
  }

  const title =
    modalTitle ||
    (variant === "banner"
      ? "배경 사진 편집"
      : isLinkMode
        ? "링크 이미지 편집"
        : "프로필 사진 편집");

  const modalWidth = useOverlay ? "sm:max-w-lg" : "sm:max-w-md";
  const zoomPercent = Math.round(zoom * 100);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className={modalWidth}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {imgSrc ? "드래그하여 위치를 조정하세요" : "이미지를 업로드하세요"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-3">
          {imgSrc ? (
            <>
              {useOverlay ? (
                /* ── Overlay crop (avatar / background) ── */
                <div
                  className="relative overflow-hidden rounded-xl border border-border"
                  style={{
                    width: containerW,
                    height: containerH,
                    touchAction: "none",
                    cursor: dragging ? "grabbing" : "grab",
                  }}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  onWheel={handleWheel}
                >
                  {/* Single clear image */}
                  <img
                    src={imgSrc}
                    alt=""
                    className="pointer-events-none absolute max-w-none select-none"
                    style={{
                      width: displayW,
                      height: displayH,
                      transform: `translate(${offset.x + padX}px, ${offset.y + padY}px)`,
                    }}
                    draggable={false}
                  />
                  {/* Dark overlay with transparent crop hole + white border */}
                  <svg
                    className="pointer-events-none absolute inset-0"
                    width={containerW}
                    height={containerH}
                  >
                    <path
                      fillRule="evenodd"
                      d={overlayPath}
                      fill="rgba(0,0,0,0.5)"
                    />
                    {variant === "circle" ? (
                      <circle
                        cx={svgCx}
                        cy={svgCy}
                        r={svgR}
                        fill="none"
                        stroke="white"
                        strokeWidth={2}
                      />
                    ) : (
                      <rect
                        x={padX}
                        y={padY}
                        width={cropW}
                        height={cropH}
                        fill="none"
                        stroke="white"
                        strokeWidth={2}
                      />
                    )}
                  </svg>
                </div>
              ) : (
                /* ── Simple crop (links) ── */
                <div
                  className="relative overflow-hidden rounded-full border-2 border-border bg-muted"
                  style={{ width: cropW, height: cropH, touchAction: "none" }}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  onWheel={handleWheel}
                >
                  <img
                    src={imgSrc}
                    alt=""
                    className="pointer-events-none max-w-none select-none"
                    style={{
                      width: displayW,
                      height: displayH,
                      transform: `translate(${offset.x}px, ${offset.y}px)`,
                    }}
                    draggable={false}
                  />
                </div>
              )}

              {/* Zoom controls */}
              <div className="flex items-center gap-2">
                <MagnifyingGlassMinus
                  className="size-4 shrink-0 cursor-pointer text-muted-foreground hover:text-foreground"
                  onClick={() => handleZoom(zoom - 0.1)}
                />
                <input
                  type="range"
                  min={minZoom}
                  max={maxZoom}
                  step="0.01"
                  value={zoom}
                  onChange={(e) => handleZoom(Number(e.target.value))}
                  className="w-40 accent-primary"
                />
                <MagnifyingGlassPlus
                  className="size-4 shrink-0 cursor-pointer text-muted-foreground hover:text-foreground"
                  onClick={() => handleZoom(zoom + 0.1)}
                />
                <span className="ml-1 min-w-[3ch] text-right text-xs tabular-nums text-muted-foreground">
                  {zoomPercent}%
                </span>
              </div>

              {/* Action row */}
              <div className="flex gap-3">
                <Button variant="ghost" size="sm" className="gap-1" onClick={handleReset}>
                  <ArrowsClockwise className="size-3" />
                  초기화
                </Button>
                <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()}>
                  다른 이미지 선택
                </Button>
              </div>
            </>
          ) : (
            /* ── Upload placeholder ── */
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed border-border bg-muted/30 transition-colors hover:bg-muted/50 ${isLinkMode ? "rounded-full" : "rounded-xl"}`}
              style={{ width: containerW, height: containerH }}
            >
              <UploadSimple className="size-8 text-muted-foreground/50" />
              <span className="text-xs text-muted-foreground">클릭하여 이미지 업로드</span>
              {!isLinkMode && (
                <span className="text-[10px] text-muted-foreground/60">
                  권장 {SIZE_HINTS[variant]}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Link preview */}
        {isLinkMode && imgSrc && linkTitle && (
          <div>
            <p className="mb-2 text-[10px] font-medium text-muted-foreground">미리보기</p>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-2.5 py-2">
              <CropPreview imgSrc={imgSrc} offset={offset} displayW={displayW} displayH={displayH} cropSize={cropW} size={36} />
              <span className="truncate text-[11px] font-medium">{linkTitle}</span>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />

        <DialogFooter className="flex-row justify-between sm:justify-between">
          {onRemove && initialSrc ? (
            <Button variant="ghost" size="sm" className="cursor-pointer text-destructive hover:bg-transparent hover:text-destructive" onClick={onRemove}>
              사진 제거
            </Button>
          ) : (
            <div />
          )}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onCancel}>
              취소
            </Button>
            <Button size="sm" onClick={handleApply} disabled={!imgSrc}>
              적용
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CropPreview({
  imgSrc,
  offset,
  displayW,
  displayH,
  cropSize,
  size,
}: {
  imgSrc: string;
  offset: { x: number; y: number };
  displayW: number;
  displayH: number;
  cropSize: number;
  size: number;
}) {
  const ratio = size / cropSize;
  return (
    <div
      className="shrink-0 overflow-hidden rounded-full bg-muted"
      style={{ width: size, height: size }}
    >
      {imgSrc && (
        <img
          src={imgSrc}
          alt=""
          className="pointer-events-none max-w-none"
          style={{
            width: displayW * ratio,
            height: displayH * ratio,
            transform: `translate(${offset.x * ratio}px, ${offset.y * ratio}px)`,
          }}
        />
      )}
    </div>
  );
}
