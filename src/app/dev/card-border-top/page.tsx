"use client";

import { useState } from "react";
import { Heart, ChatCircle, Fire, CursorClick, XCircle } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const DEAL = {
  title: "쿠팡 로켓와우 멤버십 첫 달 무료쿠팡 로켓와우 멤버십 첫 달 무료",
  originalPrice: 7890,
  dealPrice: 0,
  discountRate: 100,
  nickname: "HDDC",
  store: "쿠팡",
  likeCount: 634,
  viewCount: 330,
  commentCount: 152,
  createdAt: "3일 전",
  isHot: true,
};

const DEAL2 = {
  title: "[단독특가] Apple 에어팟 프로 2세대 (USB-C)",
  originalPrice: 289000,
  dealPrice: 199000,
  discountRate: 31,
  nickname: "테크딜러",
  store: "쿠팡",
  likeCount: 124,
  viewCount: 1200,
  commentCount: 18,
  createdAt: "2시간 전",
  isHot: true,
};

type Deal = typeof DEAL;

function formatPrice(n: number): string { return n.toLocaleString("ko-KR"); }
function formatCount(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function Fallback() {
  return <div className="flex size-full items-center justify-center bg-foreground text-sm font-bold text-background">핫딜닷쿨</div>;
}

/* ─── Card template ─── */

function Card({ deal, cardClassName, topDecoration }: { deal: Deal; cardClassName: string; topDecoration?: React.ReactNode }) {
  const [liked, setLiked] = useState(false);
  const [expired, setExpired] = useState(false);
  const hasDiscount = deal.originalPrice != null && deal.dealPrice != null && deal.originalPrice > deal.dealPrice;

  return (
    <div className={cn("relative overflow-hidden rounded-r-xl pr-10", cardClassName)}>
      {topDecoration}
      <div className="group flex flex-1 overflow-hidden">
        <div className="relative min-h-24 w-24 shrink-0 self-stretch overflow-hidden bg-muted">
          <Fallback />
          {deal.isHot && (
            <span className="absolute left-1.5 top-1.5 flex items-center gap-0.5 rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-2 py-0.5 text-[11px] font-bold text-white shadow-sm">
              <Fire className="size-3" weight="fill" />HOT
            </span>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between px-3 py-2.5">
          <h3 className="truncate text-base font-semibold leading-snug">{deal.title}</h3>
          <div className="mt-1 flex flex-col gap-1">
            <span className="flex flex-wrap items-baseline gap-x-1.5">
              {hasDiscount && deal.discountRate != null && <span className="text-sm font-bold text-red-500">{deal.discountRate}%</span>}
              <span className="text-base font-bold">{formatPrice(deal.dealPrice!)}원</span>
              {hasDiscount && <span className="text-xs text-muted-foreground line-through">{formatPrice(deal.originalPrice!)}원</span>}
            </span>
            <span className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-0.5"><CursorClick className="size-2.5" />{formatCount(deal.viewCount)}</span>
                <span className="inline-flex items-center gap-0.5"><Heart className="size-2.5" />{deal.likeCount}</span>
              </span>
              <span className="flex items-center gap-1">
                {deal.nickname} · {deal.store} · {deal.createdAt}
              </span>
            </span>
          </div>
        </div>
      </div>
      <div className="absolute right-0 top-0 flex h-full w-10 flex-col items-center justify-center gap-1 rounded-r-xl border-l border-border/30 bg-muted/30 text-muted-foreground">
        <ChatCircle className="size-4" />
        <span className="text-xs font-medium">{deal.commentCount}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */

function StyleA({ deal }: { deal: Deal }) {
  return <Card deal={deal} cardClassName="bg-card shadow-md" />;
}

function StyleB({ deal }: { deal: Deal }) {
  return <Card deal={deal} cardClassName="bg-card shadow-md border-t border-border/30" />;
}

function StyleC({ deal }: { deal: Deal }) {
  return <Card deal={deal} cardClassName="bg-card shadow-md border-t border-border/50" />;
}

function StyleD({ deal }: { deal: Deal }) {
  return <Card deal={deal} cardClassName="bg-card shadow-md border border-border/20" />;
}

function StyleE({ deal }: { deal: Deal }) {
  return <Card deal={deal} cardClassName="bg-card shadow-md ring-1 ring-border/15" />;
}

function StyleF({ deal }: { deal: Deal }) {
  return <Card deal={deal} cardClassName="bg-card shadow-md ring-1 ring-border/30" />;
}

function StyleG({ deal }: { deal: Deal }) {
  return (
    <Card
      deal={deal}
      cardClassName="bg-card shadow-md"
      topDecoration={<div className="absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-border to-transparent" />}
    />
  );
}

function StyleH({ deal }: { deal: Deal }) {
  return (
    <Card
      deal={deal}
      cardClassName="bg-card shadow-md"
      topDecoration={<div className="absolute inset-x-0 top-0 z-10 h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />}
    />
  );
}

function StyleI({ deal }: { deal: Deal }) {
  return <Card deal={deal} cardClassName="bg-card shadow-[0_-1px_3px_0_rgba(0,0,0,0.05),0_4px_6px_-1px_rgba(0,0,0,0.1)]" />;
}

function StyleJ({ deal }: { deal: Deal }) {
  return <Card deal={deal} cardClassName="bg-card shadow-[0_-2px_4px_-1px_rgba(0,0,0,0.06),0_4px_6px_-1px_rgba(0,0,0,0.1)]" />;
}

/* ═══════════════════════════════════════════════════════════ */

const STYLES = [
  { name: "A", label: "현재 — shadow-md only (상단 경계 없음)", Component: StyleA },
  { name: "B", label: "border-t border/30 — 얇은 상단 border", Component: StyleB },
  { name: "C", label: "border-t border/50 — 좀 더 진한 상단 border", Component: StyleC },
  { name: "D", label: "border border/20 — 전체 얇은 border + shadow", Component: StyleD },
  { name: "E", label: "ring-1 ring-border/15 — 전체 미세 ring", Component: StyleE },
  { name: "F", label: "ring-1 ring-border/30 — 전체 ring 좀 더 진하게", Component: StyleF },
  { name: "G", label: "gradient line — 상단 그라데이션 선", Component: StyleG },
  { name: "H", label: "gradient line (primary) — 포인트 컬러 상단 선", Component: StyleH },
  { name: "I", label: "상단 shadow 추가 — 위로도 살짝 그림자", Component: StyleI },
  { name: "J", label: "상단 shadow 강화 — 위로 좀 더 그림자", Component: StyleJ },
];

export default function CardBorderTopPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-8">
        <h1 className="mb-2 text-2xl font-bold">딜 카드 상단 경계선 비교</h1>
        <p className="mb-8 text-sm text-muted-foreground">
          shadow-md 베이스에서 상단 구분감을 어떻게 줄지 비교합니다.
        </p>

        {STYLES.map(({ name, label, Component }) => (
          <section key={name} className="mb-10">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{name}</span>
              <h2 className="text-sm font-semibold">{label}</h2>
            </div>
            <div className="flex flex-col gap-3">
              <Component deal={DEAL} />
              <Component deal={DEAL2} />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
