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

function PreviewCard({ badge }: { badge: React.ReactNode }) {
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

const VARIANTS = [
  {
    name: "현재",
    label: "gradient 빨강→주황 + 흰 로고",
    badge: <span className="flex size-4 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-500 shadow-sm"><FireLogo className="size-4" bgColor="white" /></span>,
  },
  {
    name: "A",
    label: "빨강 단색 + 흰 로고",
    badge: <span className="flex size-4 items-center justify-center rounded-full bg-red-500 shadow-sm"><FireLogo className="size-4" bgColor="white" /></span>,
  },
  {
    name: "B",
    label: "주황 단색 + 흰 로고",
    badge: <span className="flex size-4 items-center justify-center rounded-full bg-orange-500 shadow-sm"><FireLogo className="size-4" bgColor="white" /></span>,
  },
  {
    name: "C",
    label: "틸(primary) + 흰 로고",
    badge: <span className="flex size-4 items-center justify-center rounded-full bg-primary shadow-sm"><FireLogo className="size-4" bgColor="white" /></span>,
  },
  {
    name: "D",
    label: "검정 + 빨간 로고",
    badge: <span className="flex size-4 items-center justify-center rounded-full bg-black shadow-sm"><FireLogo className="size-4 text-red-500" bgColor="black" /></span>,
  },
  {
    name: "E",
    label: "검정 + 주황 로고",
    badge: <span className="flex size-4 items-center justify-center rounded-full bg-black shadow-sm"><FireLogo className="size-4 text-orange-400" bgColor="black" /></span>,
  },
  {
    name: "F",
    label: "검정 + 흰 로고",
    badge: <span className="flex size-4 items-center justify-center rounded-full bg-black shadow-sm"><FireLogo className="size-4 text-white" bgColor="black" /></span>,
  },
  {
    name: "G",
    label: "흰 + 빨간 로고",
    badge: <span className="flex size-4 items-center justify-center rounded-full bg-white shadow-sm"><FireLogo className="size-4 text-red-500" bgColor="white" /></span>,
  },
  {
    name: "H",
    label: "흰 + 주황 로고",
    badge: <span className="flex size-4 items-center justify-center rounded-full bg-white shadow-sm"><FireLogo className="size-4 text-orange-500" bgColor="white" /></span>,
  },
  {
    name: "I",
    label: "흰 + 틸(primary) 로고",
    badge: <span className="flex size-4 items-center justify-center rounded-full bg-white shadow-sm"><FireLogo className="size-4 text-primary" bgColor="white" /></span>,
  },
  {
    name: "J",
    label: "반투명 다크 + 흰 로고",
    badge: <span className="flex size-4 items-center justify-center rounded-full bg-black/50 shadow-sm backdrop-blur-sm"><FireLogo className="size-4 text-white" bgColor="transparent" /></span>,
  },
  {
    name: "K",
    label: "반투명 다크 + 빨간 로고",
    badge: <span className="flex size-4 items-center justify-center rounded-full bg-black/50 shadow-sm backdrop-blur-sm"><FireLogo className="size-4 text-red-400" bgColor="transparent" /></span>,
  },
  {
    name: "L",
    label: "gradient 빨강→핑크 + 흰 로고",
    badge: <span className="flex size-4 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-pink-500 shadow-sm"><FireLogo className="size-4" bgColor="white" /></span>,
  },
  {
    name: "M",
    label: "gradient 주황→노랑 + 흰 로고",
    badge: <span className="flex size-4 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-yellow-400 shadow-sm"><FireLogo className="size-4" bgColor="white" /></span>,
  },
  {
    name: "N",
    label: "gradient 틸→시안 + 흰 로고",
    badge: <span className="flex size-4 items-center justify-center rounded-full bg-gradient-to-br from-teal-600 to-cyan-400 shadow-sm"><FireLogo className="size-4" bgColor="white" /></span>,
  },
  {
    name: "O",
    label: "파비콘 동일 — 틸 원 + 흰 불꽃 + 틸 컷아웃",
    badge: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="size-4 shrink-0 drop-shadow-sm">
        <circle cx="128" cy="128" r="128" fill="#0d7377" />
        <path d="M128,240a80,80,0,0,1-80-80c0-40,24-72,40-92l28,28,24-64C156,44,208,88,208,160A80,80,0,0,1,128,240Z" fill="white" />
        <path d="M128,240a40,40,0,0,1-40-40c0-20,12-36,20-46l14,14,12-32c8,6,34,28,34,64A40,40,0,0,1,128,240Z" fill="#0d7377" />
      </svg>
    ),
  },
  {
    name: "P",
    label: "로고만 빨간 (원 없음, drop-shadow)",
    badge: <FireLogo className="size-4 text-red-500 drop-shadow-md" bgColor="transparent" />,
  },
  {
    name: "Q",
    label: "로고만 주황 (원 없음, drop-shadow)",
    badge: <FireLogo className="size-4 text-orange-500 drop-shadow-md" bgColor="transparent" />,
  },
];

export default function HotLabelPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <h1 className="mb-2 text-2xl font-bold">HOT 라벨 색상 비교</h1>
        <p className="mb-8 text-sm text-muted-foreground">
          어두운 이미지 / 밝은 이미지 위에서 각 색상 비교. 3x 확대 포함.
        </p>

        {VARIANTS.map(({ name, label, badge }) => (
          <section key={name} className="mb-8">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-7 items-center justify-center rounded-full bg-primary px-2.5 text-xs font-bold text-primary-foreground">{name}</span>
              <h2 className="text-sm font-semibold">{label}</h2>
            </div>
            <PreviewCard badge={badge} />
          </section>
        ))}
      </div>
    </div>
  );
}
