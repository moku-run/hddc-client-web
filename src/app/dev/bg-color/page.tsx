"use client";

import { useState } from "react";
import { Heart, CursorClick, ChatCircle, Moon, Palette } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { FireLogo } from "@/components/icons/fire-logo";

/* ─── Fake header ─── */

function Header() {
  return (
    <header className="bg-background/50 shadow-md backdrop-blur-xl">
      <nav className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <div className="flex items-center gap-1.5 text-lg font-bold tracking-tight">
          <FireLogo className="size-6 text-red-500" />핫딜닷쿨
        </div>
        <div className="flex items-center gap-2">
          <Moon className="size-4 text-muted-foreground" />
          <div className="flex items-center gap-1.5 rounded-full border border-primary/30 px-3 py-1.5 text-xs font-medium text-primary">
            <Palette className="size-3.5" />프로필 꾸미기
          </div>
          <div className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">K</div>
        </div>
      </nav>
    </header>
  );
}

/* ─── Fake deal card ─── */

function DealCard() {
  return (
    <div className="relative overflow-hidden rounded-r-xl border-t border-border/50 bg-card pr-10 shadow-md">
      <div className="flex overflow-hidden">
        <div className="relative min-h-24 w-24 shrink-0 self-stretch bg-foreground text-base font-bold text-background flex items-center justify-center">
          핫딜닷쿨
          <span className="absolute left-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-500 shadow-sm">
            <FireLogo className="size-4" bgColor="white" />
          </span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between px-3 py-2.5">
          <p className="truncate text-base font-semibold">쿠팡 로켓와우 멤버십 첫 달 무료</p>
          <div className="mt-1 flex flex-col gap-1">
            <span className="flex items-baseline gap-1.5">
              <span className="text-sm font-bold text-red-500">100%</span>
              <span className="text-base font-bold">0원</span>
              <span className="text-xs text-muted-foreground line-through">7,890원</span>
            </span>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-0.5"><CursorClick className="size-2.5" />330</span>
                <span className="inline-flex items-center gap-0.5"><Heart className="size-2.5" />634</span>
              </span>
              <span>HDDC · 쿠팡 · 3일 전</span>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute right-0 top-0 flex h-full w-10 flex-col items-center justify-center gap-1 rounded-r-xl border-l border-border/50 bg-muted/30 text-muted-foreground">
        <ChatCircle className="size-4" />
        <span className="text-xs font-medium">152</span>
      </div>
    </div>
  );
}

function DealCard2() {
  return (
    <div className="relative overflow-hidden rounded-r-xl border-t border-border/50 bg-card pr-10 shadow-md">
      <div className="flex overflow-hidden">
        <div className="min-h-24 w-24 shrink-0 self-stretch bg-foreground text-base font-bold text-background flex items-center justify-center">핫딜닷쿨</div>
        <div className="flex min-w-0 flex-1 flex-col justify-between px-3 py-2.5">
          <p className="truncate text-base font-semibold">안양축협 한돈 삼겹살 1kg</p>
          <div className="mt-1 flex flex-col gap-1">
            <span className="text-base font-bold">18,900원</span>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-0.5"><CursorClick className="size-2.5" />45</span>
                <span className="inline-flex items-center gap-0.5"><Heart className="size-2.5" />3</span>
              </span>
              <span>HDDC Bot · 5시간 전</span>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute right-0 top-0 flex h-full w-10 flex-col items-center justify-center gap-1 rounded-r-xl border-l border-border/50 bg-muted/30 text-muted-foreground">
        <ChatCircle className="size-4" />
        <span className="text-xs font-medium">0</span>
      </div>
    </div>
  );
}

/* ─── Full page preview ─── */

function PagePreview({ bgStyle }: { bgStyle: string }) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-border", bgStyle)}>
      <Header />
      <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 py-4">
        <DealCard />
        <DealCard2 />
        <DealCard />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */

const BG_OPTIONS = [
  { name: "현재", label: "순백 #FFFFFF — oklch(1 0 0)", style: "bg-white" },
  { name: "A", label: "웜 화이트 #FAFAF9 — zinc-50 느낌", style: "bg-[#FAFAF9]" },
  { name: "B", label: "쿨 그레이 #FAFAFA — neutral-50", style: "bg-[#FAFAFA]" },
  { name: "C", label: "웜 그레이 #F9F8F6", style: "bg-[#F9F8F6]" },
  { name: "D", label: "라이트 그레이 #F5F5F4 — stone-100", style: "bg-[#F5F5F4]" },
  { name: "E", label: "쿨 블루그레이 #F8FAFC — slate-50", style: "bg-[#F8FAFC]" },
  { name: "F", label: "크림 #FFFBF5", style: "bg-[#FFFBF5]" },
  { name: "G", label: "민트 틴트 #F7FDFC", style: "bg-[#F7FDFC]" },
  { name: "H", label: "회색 강하게 #F1F1F0 — stone-200 수준", style: "bg-[#F1F1F0]" },
];

export default function BgColorPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <h1 className="mb-2 text-2xl font-bold">배경색 비교</h1>
        <p className="mb-8 text-sm text-muted-foreground">
          카드(white)와 배경 대비 확인. 헤더 반투명 + 카드 shadow 포함.
        </p>

        {BG_OPTIONS.map(({ name, label, style }) => (
          <section key={name} className="mb-10">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-7 items-center justify-center rounded-full bg-primary px-2.5 text-xs font-bold text-primary-foreground">{name}</span>
              <h2 className="text-sm font-semibold">{label}</h2>
              <div className={cn("size-5 rounded border border-border", style)} />
            </div>
            <PagePreview bgStyle={style} />
          </section>
        ))}
      </div>
    </div>
  );
}
