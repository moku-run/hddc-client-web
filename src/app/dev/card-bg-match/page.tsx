"use client";

import { useState } from "react";
import { Heart, CursorClick, ChatCircle, Moon, Palette } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { FireLogo, HotLabel } from "@/components/icons/fire-logo";

/* ─── Fake header ─── */

function Header() {
  return (
    <header className="bg-background/50 shadow-md backdrop-blur-xl">
      <nav className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <span className="text-lg font-bold tracking-tight">핫딜닷쿨</span>
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

/* ─── Fake deal card (카드 배경색을 prop으로 받음) ─── */

function DealCard({ cardBg, hot }: { cardBg: string; hot?: boolean }) {
  return (
    <div className={cn("relative overflow-hidden rounded-r-xl border-t border-border/50 pr-10 shadow-md", cardBg)}>
      <div className="flex overflow-hidden">
        <div className="relative flex min-h-24 w-24 shrink-0 items-center justify-center self-stretch bg-foreground text-base font-bold text-background">
          핫딜닷쿨
          {hot && <HotLabel className="absolute left-1.5 top-1.5 size-4" />}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between px-3 py-2.5">
          <p className="truncate text-base font-semibold">
            {hot ? "쿠팡 로켓와우 멤버십 첫 달 무료" : "안양축협 한돈 삼겹살 1kg"}
          </p>
          <div className="mt-1 flex flex-col gap-1">
            {hot ? (
              <span className="flex items-baseline gap-1.5">
                <span className="text-sm font-bold text-red-500">100%</span>
                <span className="text-base font-bold">0원</span>
                <span className="text-xs text-muted-foreground line-through">7,890원</span>
              </span>
            ) : (
              <span className="text-base font-bold">18,900원</span>
            )}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-0.5"><CursorClick className="size-2.5" />{hot ? "330" : "45"}</span>
                <span className="inline-flex items-center gap-0.5"><Heart className="size-2.5" />{hot ? "634" : "3"}</span>
              </span>
              <span>{hot ? "HDDC · 쿠팡 · 3일 전" : "HDDC Bot · 5시간 전"}</span>
            </div>
          </div>
        </div>
      </div>
      <div className={cn("absolute right-0 top-0 flex h-full w-10 flex-col items-center justify-center gap-1 rounded-r-xl border-l border-border/50 bg-muted/30 text-muted-foreground")}>
        <ChatCircle className="size-4" />
        <span className="text-xs font-medium">{hot ? "152" : "0"}</span>
      </div>
    </div>
  );
}

/* ─── Full page preview ─── */

function PagePreview({ bgStyle, cardBg }: { bgStyle: string; cardBg: string }) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-border", bgStyle)}>
      <Header />
      <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 py-4">
        <DealCard cardBg={cardBg} hot />
        <DealCard cardBg={cardBg} />
        <DealCard cardBg={cardBg} hot />
      </div>
    </div>
  );
}

/* ─── Color swatch ─── */

function Swatch({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="size-5 rounded border border-border" style={{ backgroundColor: color }} />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */

const COMBOS = [
  {
    name: "현재",
    desc: "크림 배경 + 순백 카드 (온도 불일치)",
    bg: "#FFFBF5",
    card: "#FFFFFF",
    bgClass: "bg-[#FFFBF5]",
    cardClass: "bg-[#FFFFFF]",
  },
  {
    name: "A",
    desc: "크림 배경 + 크림 카드 (따뜻한 톤 통일)",
    bg: "#FFFBF5",
    card: "#FFFDF8",
    bgClass: "bg-[#FFFBF5]",
    cardClass: "bg-[#FFFDF8]",
  },
  {
    name: "B",
    desc: "크림 배경 + 아이보리 카드 (살짝 대비)",
    bg: "#FFFBF5",
    card: "#FEFCF7",
    bgClass: "bg-[#FFFBF5]",
    cardClass: "bg-[#FEFCF7]",
  },
  {
    name: "C",
    desc: "연한 웜그레이 배경 + 순백 카드 (중립적)",
    bg: "#FAF9F7",
    card: "#FFFFFF",
    bgClass: "bg-[#FAF9F7]",
    cardClass: "bg-[#FFFFFF]",
  },
  {
    name: "D",
    desc: "웜 그레이 배경 + 순백 카드 (대비 강조)",
    bg: "#F5F3F0",
    card: "#FFFFFF",
    bgClass: "bg-[#F5F3F0]",
    cardClass: "bg-[#FFFFFF]",
  },
  {
    name: "E",
    desc: "순백 배경 + 순백 카드 (그림자만으로 구분)",
    bg: "#FFFFFF",
    card: "#FFFFFF",
    bgClass: "bg-[#FFFFFF]",
    cardClass: "bg-[#FFFFFF]",
  },
  {
    name: "F",
    desc: "쿨 그레이 배경 + 순백 카드 (모던한 느낌)",
    bg: "#F8FAFC",
    card: "#FFFFFF",
    bgClass: "bg-[#F8FAFC]",
    cardClass: "bg-[#FFFFFF]",
  },
  {
    name: "G",
    desc: "민트 틴트 배경 + 순백 카드 (틸 브랜드 연계)",
    bg: "#F5FDFB",
    card: "#FFFFFF",
    bgClass: "bg-[#F5FDFB]",
    cardClass: "bg-[#FFFFFF]",
  },
  {
    name: "H",
    desc: "민트 틴트 배경 + 민트 틴트 카드 (톤 통일)",
    bg: "#F5FDFB",
    card: "#FAFFFE",
    bgClass: "bg-[#F5FDFB]",
    cardClass: "bg-[#FAFFFE]",
  },
];

export default function CardBgMatchPage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <h1 className="mb-2 text-2xl font-bold">배경색 + 카드색 조합 비교</h1>
        <p className="mb-2 text-sm text-muted-foreground">
          페이지 배경과 핫딜 카드 배경의 온도·대비를 비교합니다.
        </p>
        <p className="mb-8 text-xs text-muted-foreground">
          현재 문제: 크림 배경(#FFFBF5, 따뜻한 톤) + 순백 카드(#FFFFFF, 차가운 톤) → 온도 불일치
        </p>

        {/* 빠른 비교 — 선택 2개 나란히 */}
        {selected && (
          <div className="mb-10 rounded-xl border-2 border-primary/30 bg-primary/5 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-primary">선택된 조합: {selected}</h2>
              <button
                onClick={() => setSelected(null)}
                className="rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
              >
                닫기
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* 현재 vs 선택 */}
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">현재</p>
                <PagePreview bgStyle={COMBOS[0].bgClass} cardBg={COMBOS[0].cardClass} />
              </div>
              <div>
                <p className="mb-2 text-xs font-medium text-primary">{selected}</p>
                {(() => {
                  const combo = COMBOS.find((c) => c.name === selected) ?? COMBOS[0];
                  return <PagePreview bgStyle={combo.bgClass} cardBg={combo.cardClass} />;
                })()}
              </div>
            </div>
          </div>
        )}

        {/* 전체 목록 */}
        {COMBOS.map(({ name, desc, bg, card, bgClass, cardClass }) => (
          <section key={name} className="mb-10">
            <div className="mb-3 flex items-center gap-3">
              <span className={cn(
                "flex h-7 items-center justify-center rounded-full px-2.5 text-xs font-bold",
                name === "현재"
                  ? "bg-muted text-muted-foreground"
                  : "bg-primary text-primary-foreground",
              )}>
                {name}
              </span>
              <h2 className="text-sm font-semibold">{desc}</h2>
              <div className="flex items-center gap-3">
                <Swatch color={bg} label={`배경 ${bg}`} />
                <Swatch color={card} label={`카드 ${card}`} />
              </div>
              {name !== "현재" && (
                <button
                  onClick={() => setSelected(name)}
                  className="ml-auto rounded-md border border-primary/30 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/10"
                >
                  현재와 비교
                </button>
              )}
            </div>
            <PagePreview bgStyle={bgClass} cardBg={cardClass} />
          </section>
        ))}
      </div>
    </div>
  );
}
