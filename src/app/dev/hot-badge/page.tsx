"use client";

import { Fire } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/* ─── Badge variants ─── */

const VARIANTS = [
  {
    name: "A",
    label: "현재 — text-[11px] / size-3 / px-2 py-0.5",
    badge: "px-2 py-0.5 text-[11px]",
    icon: "size-3",
    text: "HOT",
  },
  {
    name: "B",
    label: "text-[10px] / size-2.5 / px-1.5 py-0.5",
    badge: "px-1.5 py-0.5 text-[10px]",
    icon: "size-2.5",
    text: "HOT",
  },
  {
    name: "C",
    label: "text-[9px] / size-2.5 / px-1.5 py-0.5",
    badge: "px-1.5 py-0.5 text-[9px]",
    icon: "size-2.5",
    text: "HOT",
  },
  {
    name: "D",
    label: "text-[9px] / size-2 / px-1.5 py-0",
    badge: "px-1.5 py-0 text-[9px]",
    icon: "size-2",
    text: "HOT",
  },
  {
    name: "E",
    label: "text-[8px] / size-2 / px-1 py-0",
    badge: "px-1 py-0 text-[8px]",
    icon: "size-2",
    text: "HOT",
  },
  {
    name: "F",
    label: "text-[10px] / 아이콘 없이 텍스트만 / px-2 py-0.5",
    badge: "px-2 py-0.5 text-[10px]",
    icon: null,
    text: "HOT",
  },
  {
    name: "G",
    label: "text-[9px] / 아이콘 없이 텍스트만 / px-1.5 py-0",
    badge: "px-1.5 py-0 text-[9px]",
    icon: null,
    text: "HOT",
  },
  {
    name: "H",
    label: "아이콘만 / size-4 / p-1",
    badge: "p-1",
    icon: "size-4",
    text: null,
  },
  {
    name: "I",
    label: "아이콘만 / size-3.5 / p-1",
    badge: "p-1",
    icon: "size-3.5",
    text: null,
  },
  {
    name: "J",
    label: "아이콘만 / size-3 / p-0.5",
    badge: "p-0.5",
    icon: "size-3",
    text: null,
  },
  {
    name: "K",
    label: "아이콘만 / size-2.5 / p-0.5",
    badge: "p-0.5",
    icon: "size-2.5",
    text: null,
  },
];

function Fallback() {
  return (
    <div className="flex size-full items-center justify-center bg-foreground text-sm font-bold text-background">
      핫딜닷쿨
    </div>
  );
}

/* ─── Preview card with badge ─── */

function PreviewCard({ badgeClass, iconClass, text }: { badgeClass: string; iconClass: string | null; text: string | null }) {
  return (
    <div className="relative h-24 w-32 overflow-hidden rounded-lg bg-muted">
      <Fallback />
      <span className={cn("absolute left-1.5 top-1.5 flex items-center gap-0.5 rounded-full bg-gradient-to-r from-red-600 to-orange-500 font-bold text-white shadow-sm", badgeClass)}>
        {iconClass && <Fire className={iconClass} weight="fill" />}{text}
      </span>
    </div>
  );
}

/* ─── 96px card (실제 적용 사이즈) ─── */

function PreviewCard96({ badgeClass, iconClass, text }: { badgeClass: string; iconClass: string | null; text: string | null }) {
  return (
    <div className="relative size-24 overflow-hidden bg-muted">
      <Fallback />
      <span className={cn("absolute left-1.5 top-1.5 flex items-center gap-0.5 rounded-full bg-gradient-to-r from-red-600 to-orange-500 font-bold text-white shadow-sm", badgeClass)}>
        {iconClass && <Fire className={iconClass} weight="fill" />}{text}
      </span>
    </div>
  );
}

export default function HotBadgePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-8">
        <h1 className="mb-2 text-2xl font-bold">HOT 배지 사이즈 비교</h1>
        <p className="mb-8 text-sm text-muted-foreground">
          128px 이미지(좌)와 96px 이미지(우)에서 배지가 어떻게 보이는지 비교합니다.
        </p>

        {VARIANTS.map(({ name, label, badge, icon, text }) => (
          <section key={name} className="mb-8">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{name}</span>
              <h2 className="text-sm font-semibold">{label}</h2>
            </div>
            <div className="flex items-start gap-4">
              <div>
                <p className="mb-1 text-[10px] text-muted-foreground">128px</p>
                <PreviewCard badgeClass={badge} iconClass={icon} text={text} />
              </div>
              <div>
                <p className="mb-1 text-[10px] text-muted-foreground">96px</p>
                <PreviewCard96 badgeClass={badge} iconClass={icon} text={text} />
              </div>
              {/* 확대 비교 */}
              <div>
                <p className="mb-1 text-[10px] text-muted-foreground">배지 단독 (2x 확대)</p>
                <div className="flex items-center" style={{ transform: "scale(2)", transformOrigin: "top left" }}>
                  <span className={cn("flex items-center gap-0.5 rounded-full bg-gradient-to-r from-red-600 to-orange-500 font-bold text-white shadow-sm", badge)}>
                    {icon && <Fire className={icon} weight="fill" />}{text}
                  </span>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
