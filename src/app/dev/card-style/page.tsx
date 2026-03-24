"use client";

import { useState } from "react";
import { Heart, ChatCircle, Fire, CursorClick, XCircle } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/* ─── Sample data ─── */

const DEALS = [
  {
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
  },
  {
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
  },
  {
    title: "안양축협 한돈 삼겹살 1kg",
    originalPrice: null,
    dealPrice: 18900,
    discountRate: null,
    nickname: "HDDC Bot",
    store: null,
    likeCount: 3,
    viewCount: 45,
    commentCount: 0,
    createdAt: "5시간 전",
    isHot: false,
  },
];

type Deal = (typeof DEALS)[0];

function formatPrice(n: number): string {
  return n.toLocaleString("ko-KR");
}

function formatCount(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function Fallback() {
  return (
    <div className="flex size-full items-center justify-center bg-foreground text-base font-bold text-background">
      핫딜닷쿨
    </div>
  );
}

function HotBadge() {
  return (
    <span className="absolute left-1.5 top-1.5 flex items-center gap-0.5 rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-2 py-0.5 text-xs font-bold text-white shadow-sm">
      <Fire className="size-3 shrink-0" weight="fill" />인기
    </span>
  );
}

function Price({ deal }: { deal: Deal }) {
  const hasDiscount = deal.originalPrice != null && deal.dealPrice != null && deal.originalPrice > deal.dealPrice;
  return (
    <span className="flex flex-wrap items-baseline gap-x-1.5">
      {hasDiscount && deal.discountRate != null && <span className="text-sm font-bold text-red-500">{deal.discountRate}%</span>}
      <span className="text-base font-bold">{formatPrice(deal.dealPrice!)}원</span>
      {hasDiscount && <span className="text-xs text-muted-foreground line-through">{formatPrice(deal.originalPrice!)}원</span>}
    </span>
  );
}

function HoverPills({ liked, expired, onLike, onExpired }: { liked: boolean; expired: boolean; onLike: () => void; onExpired: () => void }) {
  return (
    <div className="absolute right-0 flex translate-x-full items-center gap-1.5 pl-2 transition-transform duration-200 ease-out group-hover/meta:translate-x-0">
      <button onClick={onLike} className={cn("flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium transition-colors", liked ? "bg-red-500 text-white" : "bg-muted text-muted-foreground hover:text-red-400")}>
        <Heart className="size-3" weight={liked ? "fill" : "regular"} />좋아요
      </button>
      <button onClick={onExpired} className={cn("flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium transition-colors", expired ? "bg-orange-500 text-white" : "bg-muted text-muted-foreground hover:text-orange-400")}>
        <XCircle className="size-3" />끝났어요
      </button>
    </div>
  );
}

function CommentStrip({ count, className }: { count: number; className?: string }) {
  return (
    <div className={cn("flex w-10 shrink-0 flex-col items-center justify-center gap-1 border-l border-border/50 bg-muted/30 text-muted-foreground", className)}>
      <ChatCircle className="size-4" />
      <span className="text-xs font-medium">{count}</span>
    </div>
  );
}

/* ─── Desktop card template (Style F layout) ─── */

function DesktopCard({ deal, cardClassName, stripClassName }: { deal: Deal; cardClassName: string; stripClassName?: string }) {
  const [liked, setLiked] = useState(false);
  const [expired, setExpired] = useState(false);
  return (
    <div className={cn("flex overflow-hidden", cardClassName)}>
      <div className="group flex flex-1 overflow-hidden">
        <div className="relative w-32 shrink-0 self-stretch overflow-hidden bg-muted">
          <Fallback />
          {deal.isHot && <HotBadge />}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between px-3 py-2.5">
          <h3 className="line-clamp-2 min-h-[2.75rem] text-base font-semibold leading-snug">{deal.title}</h3>
          <div className="mt-1 flex flex-col gap-1">
            <Price deal={deal} />
            <div className="group/meta relative flex items-center justify-between overflow-hidden">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-0.5"><CursorClick className="size-2.5" />{formatCount(deal.viewCount)}</span>
                <span className="inline-flex items-center gap-0.5"><Heart className="size-2.5" />{deal.likeCount}</span>
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                {deal.nickname}{deal.store && <> · {deal.store}</>} · {deal.createdAt}
              </span>
              <HoverPills liked={liked} expired={expired} onLike={() => setLiked(!liked)} onExpired={() => setExpired(!expired)} />
            </div>
          </div>
        </div>
      </div>
      <CommentStrip count={deal.commentCount} className={stripClassName} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Styles
   ═══════════════════════════════════════════════════════════ */

function StyleA({ deal }: { deal: Deal }) {
  return <DesktopCard deal={deal} cardClassName="rounded-r-xl border border-border bg-card" />;
}

function StyleB({ deal }: { deal: Deal }) {
  return <DesktopCard deal={deal} cardClassName="rounded-r-xl bg-card shadow-md" stripClassName="border-l-0 shadow-inner" />;
}

function StyleC({ deal }: { deal: Deal }) {
  return <DesktopCard deal={deal} cardClassName="rounded-r-xl border border-border/40 bg-card shadow-sm" />;
}

function StyleD({ deal }: { deal: Deal }) {
  return <DesktopCard deal={deal} cardClassName="rounded-r-xl border border-white/20 bg-card/70 backdrop-blur-md" />;
}

function StyleE({ deal }: { deal: Deal }) {
  return <DesktopCard deal={deal} cardClassName="rounded-r-xl bg-card shadow-lg ring-1 ring-border/10 transition-shadow hover:shadow-xl" />;
}

function StyleF({ deal }: { deal: Deal }) {
  return <DesktopCard deal={deal} cardClassName="rounded-r-xl bg-muted/40" stripClassName="border-l border-border/30 bg-muted/60" />;
}

function StyleG({ deal }: { deal: Deal }) {
  return <DesktopCard deal={deal} cardClassName="rounded-r-xl border border-border/30 bg-card shadow-inner" />;
}

function StyleH({ deal }: { deal: Deal }) {
  const [liked, setLiked] = useState(false);
  const [expired, setExpired] = useState(false);
  return (
    <div className="rounded-r-xl bg-gradient-to-br from-primary/20 via-border/40 to-border/20 p-px">
      <div className="flex overflow-hidden rounded-r-[11px] bg-card">
        <div className="group flex flex-1 overflow-hidden">
          <div className="relative w-32 shrink-0 self-stretch overflow-hidden bg-muted">
            <Fallback />
            {deal.isHot && <HotBadge />}
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-between px-3 py-2.5">
            <h3 className="line-clamp-2 min-h-[2.75rem] text-base font-semibold leading-snug">{deal.title}</h3>
            <div className="mt-1 flex flex-col gap-1">
              <Price deal={deal} />
              <div className="group/meta relative flex items-center justify-between overflow-hidden">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-0.5"><CursorClick className="size-2.5" />{formatCount(deal.viewCount)}</span>
                  <span className="inline-flex items-center gap-0.5"><Heart className="size-2.5" />{deal.likeCount}</span>
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  {deal.nickname}{deal.store && <> · {deal.store}</>} · {deal.createdAt}
                </span>
                <HoverPills liked={liked} expired={expired} onLike={() => setLiked(!liked)} onExpired={() => setExpired(!expired)} />
              </div>
            </div>
          </div>
        </div>
        <CommentStrip count={deal.commentCount} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Page
   ═══════════════════════════════════════════════════════════ */

const STYLES = [
  { name: "A", label: "현재 — border + rounded-r-xl", Component: StyleA },
  { name: "B", label: "Shadow only — border 없이 shadow-md", Component: StyleB },
  { name: "C", label: "Shadow soft — 얇은 border + shadow-sm", Component: StyleC },
  { name: "D", label: "Glass — 반투명 + backdrop-blur", Component: StyleD },
  { name: "E", label: "Elevated — shadow-lg + hover lift", Component: StyleE },
  { name: "F", label: "Flat — border/shadow 없음, 배경색 구분", Component: StyleF },
  { name: "G", label: "Inset — inner shadow + subtle border", Component: StyleG },
  { name: "H", label: "Gradient border — 그라데이션 테두리", Component: StyleH },
];

export default function CardStylePage() {
  const [dark, setDark] = useState(false);
  return (
    <div className={cn("min-h-screen bg-background transition-colors", dark && "dark")}>
      <div className="mx-auto max-w-3xl px-6 py-8">
        <h1 className="mb-2 text-2xl font-bold">딜 카드 스타일 비교 (데스크탑)</h1>
        <p className="mb-4 text-sm text-muted-foreground">
          웹 레이아웃 — 좌측 플랫 + 우측 댓글 스트립 + hover ActionPill. 메타 행에 마우스를 올려보세요.
        </p>

        {/* Theme switcher */}
        <div className="mb-8 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">테마:</span>
          <button onClick={() => setDark(false)} className={cn("rounded-full px-3 py-1 text-xs font-medium transition-colors", !dark ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>Light</button>
          <button onClick={() => setDark(true)} className={cn("rounded-full px-3 py-1 text-xs font-medium transition-colors", dark ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>Dark</button>
        </div>

        {STYLES.map(({ name, label, Component }) => (
          <section key={name} className="mb-10">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{name}</span>
              <h2 className="text-sm font-semibold">{label}</h2>
            </div>
            <div className="flex flex-col gap-3">
              {DEALS.map((deal, i) => (
                <Component key={i} deal={deal} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
