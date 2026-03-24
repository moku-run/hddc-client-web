"use client";

import { useState } from "react";
import { Heart, ChatCircle, Fire, CursorClick, XCircle, Flag } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/* ─── Sample data ─── */

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

/* ═══════════════════════════════════════════════════════════
   Style A: 현재 — hover-only ActionPill (모바일 접근 불가)
   ═══════════════════════════════════════════════════════════ */

function StyleA({ deal }: { deal: Deal }) {
  const [liked, setLiked] = useState(false);
  const [expired, setExpired] = useState(false);
  return (
    <div className="flex overflow-hidden rounded-r-xl border border-border bg-card">
      <div className="group flex flex-1 overflow-hidden">
        <div className="relative w-28 shrink-0 self-stretch overflow-hidden bg-muted">
          <Fallback />
          {deal.isHot && <HotBadge />}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between px-2.5 py-2">
          <h3 className="line-clamp-2 min-h-[2.75rem] text-base font-semibold leading-snug">{deal.title}</h3>
          <div className="mt-1 flex flex-col gap-1">
            <Price deal={deal} />
            <div className="group/meta relative flex items-center justify-between overflow-hidden">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-0.5"><CursorClick className="size-2.5" />{formatCount(deal.viewCount)}</span>
                <span className="inline-flex items-center gap-0.5"><Heart className="size-2.5" />{deal.likeCount}</span>
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                {deal.nickname} · {deal.store} · {deal.createdAt}
              </span>
              {/* hover-only pills — 모바일에서 보이지 않음 */}
              <div className="absolute right-0 flex translate-x-full items-center gap-1.5 bg-card pl-2 transition-transform duration-200 ease-out group-hover/meta:translate-x-0">
                <button onClick={() => setLiked(!liked)} className={cn("flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium", liked ? "bg-red-500 text-white" : "bg-muted text-muted-foreground")}>
                  <Heart className="size-3" weight={liked ? "fill" : "regular"} />좋아요
                </button>
                <button onClick={() => setExpired(!expired)} className={cn("flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium", expired ? "bg-orange-500 text-white" : "bg-muted text-muted-foreground")}>
                  <XCircle className="size-3" />끝났어요
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-10 shrink-0 flex-col items-center justify-center gap-1 rounded-r-xl border-l border-border bg-muted/30 text-muted-foreground">
        <ChatCircle className="size-4" />
        <span className="text-xs font-medium">{deal.commentCount}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Style B: 하단 액션 바 — 카드 아래에 좋아요/끝났어요/댓글 상시 노출
   ═══════════════════════════════════════════════════════════ */

function StyleB({ deal }: { deal: Deal }) {
  const [liked, setLiked] = useState(false);
  const [expired, setExpired] = useState(false);
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex overflow-hidden">
        <div className="relative w-28 shrink-0 self-stretch overflow-hidden bg-muted">
          <Fallback />
          {deal.isHot && <HotBadge />}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between px-2.5 py-2">
          <h3 className="line-clamp-2 min-h-[2.75rem] text-base font-semibold leading-snug">{deal.title}</h3>
          <div className="mt-1 flex flex-col gap-1">
            <Price deal={deal} />
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
      {/* Action bar */}
      <div className="flex items-center border-t border-border">
        <button onClick={() => setLiked(!liked)} className={cn("flex flex-1 items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors", liked ? "text-red-500" : "text-muted-foreground")}>
          <Heart className="size-4" weight={liked ? "fill" : "regular"} />좋아요
        </button>
        <div className="h-4 w-px bg-border" />
        <button onClick={() => setExpired(!expired)} className={cn("flex flex-1 items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors", expired ? "text-orange-500" : "text-muted-foreground")}>
          <XCircle className="size-4" weight={expired ? "fill" : "regular"} />끝났어요
        </button>
        <div className="h-4 w-px bg-border" />
        <button className="flex flex-1 items-center justify-center gap-1.5 py-2 text-xs font-medium text-muted-foreground">
          <ChatCircle className="size-4" />{deal.commentCount}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Style C: 우측 스트립 확장 — 댓글+좋아요+끝났어요 세로 배치
   ═══════════════════════════════════════════════════════════ */

function StyleC({ deal }: { deal: Deal }) {
  const [liked, setLiked] = useState(false);
  const [expired, setExpired] = useState(false);
  return (
    <div className="flex overflow-hidden rounded-r-xl border border-border bg-card">
      <div className="flex flex-1 overflow-hidden">
        <div className="relative w-28 shrink-0 self-stretch overflow-hidden bg-muted">
          <Fallback />
          {deal.isHot && <HotBadge />}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between px-2.5 py-2">
          <h3 className="line-clamp-2 min-h-[2.75rem] text-base font-semibold leading-snug">{deal.title}</h3>
          <div className="mt-1 flex flex-col gap-1">
            <Price deal={deal} />
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
      {/* Expanded right strip */}
      <div className="flex w-11 shrink-0 flex-col items-center justify-center gap-2.5 rounded-r-xl border-l border-border bg-muted/30 py-2">
        <button onClick={() => setLiked(!liked)} className={cn("flex flex-col items-center gap-0.5 transition-colors", liked ? "text-red-500" : "text-muted-foreground")}>
          <Heart className="size-4" weight={liked ? "fill" : "regular"} />
          <span className="text-[9px] font-medium">{deal.likeCount}</span>
        </button>
        <button className="flex flex-col items-center gap-0.5 text-muted-foreground">
          <ChatCircle className="size-4" />
          <span className="text-[9px] font-medium">{deal.commentCount}</span>
        </button>
        <button onClick={() => setExpired(!expired)} className={cn("flex flex-col items-center gap-0.5 transition-colors", expired ? "text-orange-500" : "text-muted-foreground")}>
          <XCircle className="size-3.5" />
          <span className="text-[9px] font-medium">종료</span>
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Style D: 메타 행 인라인 — 좋아요/끝났어요 메타 행에 상시 표시
   ═══════════════════════════════════════════════════════════ */

function StyleD({ deal }: { deal: Deal }) {
  const [liked, setLiked] = useState(false);
  const [expired, setExpired] = useState(false);
  return (
    <div className="flex overflow-hidden rounded-r-xl border border-border bg-card">
      <div className="flex flex-1 overflow-hidden">
        <div className="relative w-28 shrink-0 self-stretch overflow-hidden bg-muted">
          <Fallback />
          {deal.isHot && <HotBadge />}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between px-2.5 py-2">
          <h3 className="line-clamp-2 min-h-[2.75rem] text-base font-semibold leading-snug">{deal.title}</h3>
          <div className="mt-1 flex flex-col gap-1">
            <Price deal={deal} />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                {deal.nickname} · {deal.store} · {deal.createdAt}
              </span>
            </div>
            {/* Inline action buttons */}
            <div className="flex items-center gap-1">
              <button onClick={() => setLiked(!liked)} className={cn("flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium transition-colors", liked ? "border-red-500/30 bg-red-500/10 text-red-500" : "border-border text-muted-foreground")}>
                <Heart className="size-3" weight={liked ? "fill" : "regular"} />{deal.likeCount}
              </button>
              <button className="flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                <ChatCircle className="size-3" />{deal.commentCount}
              </button>
              <button onClick={() => setExpired(!expired)} className={cn("flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium transition-colors", expired ? "border-orange-500/30 bg-orange-500/10 text-orange-500" : "border-border text-muted-foreground")}>
                <XCircle className="size-3" />끝났어요
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Style E: 하단 슬림 바 — 얇은 한 줄 + 우측 댓글 스트립 유지
   ═══════════════════════════════════════════════════════════ */

function StyleE({ deal }: { deal: Deal }) {
  const [liked, setLiked] = useState(false);
  const [expired, setExpired] = useState(false);
  return (
    <div className="flex overflow-hidden rounded-r-xl border border-border bg-card">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex overflow-hidden">
          <div className="relative w-28 shrink-0 self-stretch overflow-hidden bg-muted">
            <Fallback />
            {deal.isHot && <HotBadge />}
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-between px-2.5 py-2">
            <h3 className="line-clamp-2 min-h-[2.75rem] text-base font-semibold leading-snug">{deal.title}</h3>
            <div className="mt-1 flex flex-col gap-1">
              <Price deal={deal} />
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
        {/* Slim action bar */}
        <div className="flex items-center gap-3 border-t border-border px-3 py-1.5">
          <button onClick={() => setLiked(!liked)} className={cn("flex items-center gap-1 text-xs transition-colors", liked ? "text-red-500" : "text-muted-foreground")}>
            <Heart className="size-3.5" weight={liked ? "fill" : "regular"} />{deal.likeCount}
          </button>
          <button onClick={() => setExpired(!expired)} className={cn("flex items-center gap-1 text-xs transition-colors", expired ? "text-orange-500" : "text-muted-foreground")}>
            <XCircle className="size-3.5" weight={expired ? "fill" : "regular"} />끝났어요
          </button>
          <button className="flex items-center gap-1 text-xs text-muted-foreground">
            <Flag className="size-3.5" />신고
          </button>
        </div>
      </div>
      {/* Comment strip */}
      <div className="flex w-10 shrink-0 flex-col items-center justify-center gap-1 rounded-r-xl border-l border-border bg-muted/30 text-muted-foreground">
        <ChatCircle className="size-4" />
        <span className="text-xs font-medium">{deal.commentCount}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Page
   ═══════════════════════════════════════════════════════════ */

const STYLES = [
  { name: "A", label: "현재 — hover-only (모바일 접근 불가)", Component: StyleA },
  { name: "B", label: "하단 액션 바 — 3등분 (좋아요 | 끝났어요 | 댓글)", Component: StyleB },
  { name: "C", label: "우측 스트립 확장 — 세로 아이콘 3개", Component: StyleC },
  { name: "D", label: "메타 행 인라인 — 칩 버튼 상시 노출", Component: StyleD },
  { name: "E", label: "하단 슬림 바 — 얇은 액션 행 + 우측 댓글 스트립", Component: StyleE },
];

export default function MobileActionsPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold">모바일 액션 버튼 비교</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        345px 모바일 기준 — 좋아요/끝났어요를 모바일에서 어떻게 제공할지 비교합니다.
        <br />버튼을 눌러보면 active 상태가 토글됩니다.
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
  );
}
