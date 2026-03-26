"use client";

import { cn } from "@/lib/utils";

function FireLogo({ className, bgColor = "var(--background)" }: { className?: string; bgColor?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" className={cn("shrink-0", className)}>
      <path d="M128,240a80,80,0,0,1-80-80c0-40,24-72,40-92l28,28,24-64C156,44,208,88,208,160A80,80,0,0,1,128,240Z" />
      <path d="M128,240a40,40,0,0,1-40-40c0-20,12-36,20-46l14,14,12-32c8,6,34,28,34,64A40,40,0,0,1,128,240Z" fill={bgColor} />
    </svg>
  );
}

function PreviewCard({ badge, label }: { badge: React.ReactNode; label: string }) {
  return (
    <div className="flex gap-4">
      <div>
        <p className="mb-1 text-[10px] text-muted-foreground">96px</p>
        <div className="relative h-24 w-24 overflow-hidden rounded-lg bg-foreground">
          <div className="flex size-full items-center justify-center text-sm font-bold text-background">핫딜닷쿨</div>
          <div className="absolute left-1.5 top-1.5">{badge}</div>
        </div>
      </div>
      <div>
        <p className="mb-1 text-[10px] text-muted-foreground">80px</p>
        <div className="relative size-20 overflow-hidden rounded-lg bg-foreground">
          <div className="flex size-full items-center justify-center text-xs font-bold text-background">핫딜닷쿨</div>
          <div className="absolute left-0.5 top-0.5">{badge}</div>
        </div>
      </div>
      <div>
        <p className="mb-1 text-[10px] text-muted-foreground">밝은 배경</p>
        <div className="relative h-24 w-24 overflow-hidden rounded-lg bg-muted">
          <div className="flex size-full items-center justify-center text-sm font-bold text-muted-foreground">이미지</div>
          <div className="absolute left-1.5 top-1.5">{badge}</div>
        </div>
      </div>
      <div>
        <p className="mb-1 text-[10px] text-muted-foreground">3x 확대</p>
        <div style={{ transform: "scale(3)", transformOrigin: "top left" }}>{badge}</div>
      </div>
    </div>
  );
}

const STYLES = [
  {
    name: "현재",
    label: "그라데이션 원 + 흰 로고 (현재)",
    badge: <span className="flex size-4 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-500 shadow-sm"><FireLogo className="size-4" bgColor="white" /></span>,
  },
  {
    name: "A",
    label: "흰 원 + 빨간 로고 (반전)",
    badge: <span className="flex size-4 items-center justify-center rounded-full bg-white shadow-sm"><FireLogo className="size-4 text-red-500" bgColor="white" /></span>,
  },
  {
    name: "B",
    label: "흰 원 + 그라데이션 로고 (반전)",
    badge: <span className="flex size-4 items-center justify-center rounded-full bg-white shadow-sm"><FireLogo className="size-4 text-orange-500" bgColor="white" /></span>,
  },
  {
    name: "C",
    label: "흰 원 + 빨간 로고 + 빨간 테두리",
    badge: <span className="flex size-4 items-center justify-center rounded-full border border-red-500 bg-white shadow-sm"><FireLogo className="size-3.5 text-red-500" bgColor="white" /></span>,
  },
  {
    name: "D",
    label: "빨간 원 + 흰 로고 (단색)",
    badge: <span className="flex size-4 items-center justify-center rounded-full bg-red-500 shadow-sm"><FireLogo className="size-4" bgColor="white" /></span>,
  },
  {
    name: "E",
    label: "주황 원 + 흰 로고",
    badge: <span className="flex size-4 items-center justify-center rounded-full bg-orange-500 shadow-sm"><FireLogo className="size-4" bgColor="white" /></span>,
  },
  {
    name: "F",
    label: "검정 원 + 빨간 로고",
    badge: <span className="flex size-4 items-center justify-center rounded-full bg-black shadow-sm"><FireLogo className="size-4 text-red-500" bgColor="black" /></span>,
  },
  {
    name: "G",
    label: "반투명 다크 + 흰 로고",
    badge: <span className="flex size-4 items-center justify-center rounded-full bg-black/50 shadow-sm backdrop-blur-sm"><FireLogo className="size-4" bgColor="white" /></span>,
  },
  {
    name: "H",
    label: "반투명 흰 + 빨간 로고",
    badge: <span className="flex size-4 items-center justify-center rounded-full bg-white/70 shadow-sm backdrop-blur-sm"><FireLogo className="size-4 text-red-500" bgColor="white" /></span>,
  },
  {
    name: "I",
    label: "로고만 빨간 (배경 없음)",
    badge: <FireLogo className="size-4 text-red-500 drop-shadow" bgColor="transparent" />,
  },
  {
    name: "J",
    label: "로고만 흰 (배경 없음)",
    badge: <FireLogo className="size-4 text-white drop-shadow-md" bgColor="white" />,
  },
];

export default function HotLabelPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <h1 className="mb-2 text-2xl font-bold">HOT 라벨 색상 비교</h1>
        <p className="mb-8 text-sm text-muted-foreground">
          어두운 이미지 / 밝은 이미지 위에서 각 색상 조합 비교. 3x 확대 포함.
        </p>

        {STYLES.map(({ name, label, badge }) => (
          <section key={name} className="mb-10">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-7 items-center justify-center rounded-full bg-primary px-2.5 text-xs font-bold text-primary-foreground">{name}</span>
              <h2 className="text-sm font-semibold">{label}</h2>
            </div>
            <PreviewCard badge={badge} label={label} />
          </section>
        ))}
      </div>
    </div>
  );
}
