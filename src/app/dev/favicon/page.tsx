"use client";

import { cn } from "@/lib/utils";

function FaviconIcon({ bg, flame, inner, size, radius = "48" }: { bg: string; flame: string; inner: string; size: string; radius?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className={size}>
      <rect width="256" height="256" rx={radius} fill={bg} stroke={bg === "transparent" ? "#e5e7eb" : "none"} strokeWidth="8" />
      <path d="M128,240a80,80,0,0,1-80-80c0-40,24-72,40-92l28,28,24-64C156,44,208,88,208,160A80,80,0,0,1,128,240Z" fill={flame} />
      <path d="M128,240a40,40,0,0,1-40-40c0-20,12-36,20-46l14,14,12-32c8,6,34,28,34,64A40,40,0,0,1,128,240Z" fill={inner} />
    </svg>
  );
}

function FaviconPreview({ bg, flame, inner, radius }: { bg: string; flame: string; inner: string; radius?: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-end gap-3">
        <div>
          <p className="mb-1 text-[9px] text-muted-foreground">16px</p>
          <FaviconIcon bg={bg} flame={flame} inner={inner} size="size-4" radius={radius} />
        </div>
        <div>
          <p className="mb-1 text-[9px] text-muted-foreground">32px</p>
          <FaviconIcon bg={bg} flame={flame} inner={inner} size="size-8" radius={radius} />
        </div>
        <div>
          <p className="mb-1 text-[9px] text-muted-foreground">48px</p>
          <FaviconIcon bg={bg} flame={flame} inner={inner} size="size-12" radius={radius} />
        </div>
        <div>
          <p className="mb-1 text-[9px] text-muted-foreground">64px</p>
          <FaviconIcon bg={bg} flame={flame} inner={inner} size="size-16" radius={radius} />
        </div>
        <div>
          <p className="mb-1 text-[9px] text-muted-foreground">128px</p>
          <FaviconIcon bg={bg} flame={flame} inner={inner} size="size-32" radius={radius} />
        </div>
      </div>
      {/* 탭 시뮬레이션 */}
      <div className="flex items-center gap-2 rounded-t-lg border border-b-0 border-border bg-muted/50 px-3 py-1.5">
        <FaviconIcon bg={bg} flame={flame} inner={inner} size="size-4" radius={radius} />
        <span className="text-xs text-muted-foreground">핫딜닷쿨</span>
      </div>
    </div>
  );
}

const VARIANTS = [
  { name: "현재", label: "빨간 배경 + 흰 불꽃", bg: "#ef4444", flame: "white", inner: "#ef4444" },
  { name: "A", label: "진빨간 배경 + 흰 불꽃", bg: "#dc2626", flame: "white", inner: "#dc2626" },
  { name: "B", label: "주황 배경 + 흰 불꽃", bg: "#f97316", flame: "white", inner: "#f97316" },
  { name: "C", label: "코랄 배경 + 흰 불꽃", bg: "#e63946", flame: "white", inner: "#e63946" },
  { name: "D", label: "검정 배경 + 빨간 불꽃", bg: "#18181b", flame: "#ef4444", inner: "#18181b" },
  { name: "E", label: "검정 배경 + 주황 불꽃", bg: "#18181b", flame: "#f97316", inner: "#18181b" },
  { name: "F", label: "검정 배경 + 흰 불꽃", bg: "#18181b", flame: "white", inner: "#18181b" },
  { name: "G", label: "흰 배경 + 빨간 불꽃", bg: "white", flame: "#ef4444", inner: "white" },
  { name: "H", label: "흰 배경 + 주황 불꽃", bg: "white", flame: "#f97316", inner: "white" },
  { name: "I", label: "네이비 배경 + 흰 불꽃", bg: "#1e3a5f", flame: "white", inner: "#1e3a5f" },
  { name: "J", label: "보라 배경 + 흰 불꽃", bg: "#7c3aed", flame: "white", inner: "#7c3aed" },
  { name: "K", label: "틸 배경 + 흰 불꽃 (primary 계열)", bg: "#0d9488", flame: "white", inner: "#0d9488" },
  { name: "L", label: "투명 배경 + 빨간 불꽃", bg: "transparent", flame: "#ef4444", inner: "transparent" },
  { name: "─", label: "── 원형 ──", bg: "transparent", flame: "transparent", inner: "transparent", divider: true },
  { name: "M", label: "빨간 원 + 흰 불꽃", bg: "#ef4444", flame: "white", inner: "#ef4444", radius: "128" },
  { name: "N", label: "진빨간 원 + 흰 불꽃", bg: "#dc2626", flame: "white", inner: "#dc2626", radius: "128" },
  { name: "O", label: "주황 원 + 흰 불꽃", bg: "#f97316", flame: "white", inner: "#f97316", radius: "128" },
  { name: "P", label: "코랄 원 + 흰 불꽃", bg: "#e63946", flame: "white", inner: "#e63946", radius: "128" },
  { name: "Q", label: "검정 원 + 빨간 불꽃", bg: "#18181b", flame: "#ef4444", inner: "#18181b", radius: "128" },
  { name: "R", label: "검정 원 + 주황 불꽃", bg: "#18181b", flame: "#f97316", inner: "#18181b", radius: "128" },
  { name: "S", label: "검정 원 + 흰 불꽃", bg: "#18181b", flame: "white", inner: "#18181b", radius: "128" },
  { name: "T", label: "네이비 원 + 흰 불꽃", bg: "#1e3a5f", flame: "white", inner: "#1e3a5f", radius: "128" },
  { name: "U", label: "보라 원 + 흰 불꽃", bg: "#7c3aed", flame: "white", inner: "#7c3aed", radius: "128" },
  { name: "V", label: "틸 원 + 흰 불꽃", bg: "#0d9488", flame: "white", inner: "#0d9488", radius: "128" },
  { name: "W", label: "흰 원 + 빨간 불꽃", bg: "white", flame: "#ef4444", inner: "white", radius: "128" },
  { name: "X", label: "틸(primary) 사각 + 흰 불꽃", bg: "#0d7377", flame: "white", inner: "#0d7377" },
  { name: "Y", label: "틸(primary) 원 + 흰 불꽃", bg: "#0d7377", flame: "white", inner: "#0d7377", radius: "128" },
];

export default function FaviconPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <h1 className="mb-2 text-2xl font-bold">파비콘 색상 비교</h1>
        <p className="mb-8 text-sm text-muted-foreground">
          16/32/48/64/128px + 브라우저 탭 시뮬레이션. 작은 사이즈에서 식별되는지 확인하세요.
        </p>

        {VARIANTS.map((v) => (
          "divider" in v && v.divider ? (
            <div key={v.name} className="my-8 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-sm font-bold text-muted-foreground">원형</span>
              <div className="h-px flex-1 bg-border" />
            </div>
          ) : (
            <section key={v.name} className="mb-8">
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-7 items-center justify-center rounded-full bg-primary px-2.5 text-xs font-bold text-primary-foreground">{v.name}</span>
                <h2 className="text-sm font-semibold">{v.label}</h2>
              </div>
              <FaviconPreview bg={v.bg} flame={v.flame} inner={v.inner} radius={v.radius} />
            </section>
          )
        ))}
      </div>
    </div>
  );
}
