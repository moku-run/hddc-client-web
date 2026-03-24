"use client";

import { Heart, ChatCircle, Fire, CursorClick } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/* ─── Sample data ─── */

const DEALS = [
  {
    index: 51,
    title: "쿠팡 로켓와우 멤버십 첫 달 무료쿠팡 로켓와우 멤버십 첫 달 무료쿠팡 로켓와우 멤버십 첫 달 무료",
    imageUrl: "",
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
    index: 52,
    title: "[단독특가] Apple 에어팟 프로 2세대 (USB-C)",
    imageUrl: "",
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
    index: 53,
    title: "안양축협 한돈 삼겹살 1kg",
    imageUrl: "",
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

function HotBadge({ className }: { className?: string }) {
  return (
    <span className={cn("absolute left-1.5 top-1.5 flex items-center gap-0.5 rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-2 py-0.5 text-xs font-bold text-white shadow-sm", className)}>
      <Fire className="size-3 shrink-0" weight="fill" />인기
    </span>
  );
}

function CommentStrip({ count, rounded }: { count: number; rounded?: boolean }) {
  return (
    <div className={cn("flex w-10 shrink-0 flex-col items-center justify-center gap-1 border-l border-border bg-muted/30 text-muted-foreground", rounded && "rounded-r-xl")}>
      <ChatCircle className="size-4" />
      <span className="text-xs font-medium">{count}</span>
    </div>
  );
}

function IndexStrip({ index }: { index: number }) {
  return (
    <div className="flex w-8 shrink-0 items-center justify-center rounded-l-xl bg-muted/50 text-sm font-bold text-muted-foreground">
      {index}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Style A: 현재 디자인 (비교용)
   ═══════════════════════════════════════════════════════════ */

function StyleA({ deal }: { deal: Deal }) {
  const hasDiscount = deal.originalPrice != null && deal.dealPrice != null && deal.originalPrice > deal.dealPrice;
  return (
    <div className="flex rounded-xl border border-border bg-card">
      <IndexStrip index={deal.index} />
      <div className="group flex flex-1 gap-3 p-2.5 sm:p-3">
        <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-muted sm:h-24 sm:w-28">
          <Fallback />
          {deal.isHot && <HotBadge />}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <h3 className="line-clamp-2 min-h-[2.75rem] text-base font-semibold leading-snug">{deal.title}</h3>
          <div className="mt-1 flex flex-col gap-1">
            <span className="flex flex-wrap items-baseline gap-x-1.5">
              {hasDiscount && deal.discountRate != null && <span className="text-sm font-bold text-red-500">{deal.discountRate}%</span>}
              <span className="text-base font-bold">{formatPrice(deal.dealPrice!)}원</span>
              {hasDiscount && <span className="text-xs text-muted-foreground line-through">{formatPrice(deal.originalPrice!)}원</span>}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <span className="inline-flex items-center gap-0.5"><CursorClick className="size-2.5" />{formatCount(deal.viewCount)}</span> ·
              <span className="inline-flex items-center gap-0.5"><Heart className="size-2.5" />{deal.likeCount}</span> ·
              {deal.nickname} · {deal.store && <>{deal.store} · </>}{deal.createdAt}
            </span>
          </div>
        </div>
      </div>
      <CommentStrip count={deal.commentCount} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Style B: 이미지 flush + 텍스트 패딩
   이미지가 카드 상/하/좌 border에 딱 붙음
   ═══════════════════════════════════════════════════════════ */

function StyleB({ deal }: { deal: Deal }) {
  const hasDiscount = deal.originalPrice != null && deal.dealPrice != null && deal.originalPrice > deal.dealPrice;
  return (
    <div className="flex rounded-xl border border-border bg-card">
      <IndexStrip index={deal.index} />
      <div className="group flex flex-1 overflow-hidden">
        <div className="relative w-24 shrink-0 self-stretch overflow-hidden bg-muted sm:w-28">
          <Fallback />
          {deal.isHot && <HotBadge />}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between px-2.5 py-2 sm:px-3 sm:py-2.5">
          <h3 className="line-clamp-2 min-h-[2.75rem] text-base font-semibold leading-snug">{deal.title}</h3>
          <div className="mt-1 flex flex-col gap-1">
            <span className="flex flex-wrap items-baseline gap-x-1.5">
              {hasDiscount && deal.discountRate != null && <span className="text-sm font-bold text-red-500">{deal.discountRate}%</span>}
              <span className="text-base font-bold">{formatPrice(deal.dealPrice!)}원</span>
              {hasDiscount && <span className="text-xs text-muted-foreground line-through">{formatPrice(deal.originalPrice!)}원</span>}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-0.5"><CursorClick className="size-2.5" />{formatCount(deal.viewCount)}</span> ·
              <span className="inline-flex items-center gap-0.5"><Heart className="size-2.5" />{deal.likeCount}</span> ·
              {deal.nickname} · {deal.store && <>{deal.store} · </>}{deal.createdAt}
            </span>
          </div>
        </div>
      </div>
      <CommentStrip count={deal.commentCount} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Style C: 이미지 flush + 넓은 이미지 (w-28/sm:w-32)
   ═══════════════════════════════════════════════════════════ */

function StyleC({ deal }: { deal: Deal }) {
  const hasDiscount = deal.originalPrice != null && deal.dealPrice != null && deal.originalPrice > deal.dealPrice;
  return (
    <div className="flex rounded-xl border border-border bg-card">
      <IndexStrip index={deal.index} />
      <div className="group flex flex-1 overflow-hidden">
        <div className="relative w-28 shrink-0 self-stretch overflow-hidden bg-muted sm:w-32">
          <Fallback />
          {deal.isHot && <HotBadge />}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between px-2.5 py-2 sm:px-3 sm:py-2.5">
          <h3 className="line-clamp-2 min-h-[2.75rem] text-base font-semibold leading-snug">{deal.title}</h3>
          <div className="mt-1 flex flex-col gap-1">
            <span className="flex flex-wrap items-baseline gap-x-1.5">
              {hasDiscount && deal.discountRate != null && <span className="text-sm font-bold text-red-500">{deal.discountRate}%</span>}
              <span className="text-base font-bold">{formatPrice(deal.dealPrice!)}원</span>
              {hasDiscount && <span className="text-xs text-muted-foreground line-through">{formatPrice(deal.originalPrice!)}원</span>}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-0.5"><CursorClick className="size-2.5" />{formatCount(deal.viewCount)}</span> ·
              <span className="inline-flex items-center gap-0.5"><Heart className="size-2.5" />{deal.likeCount}</span> ·
              {deal.nickname} · {deal.store && <>{deal.store} · </>}{deal.createdAt}
            </span>
          </div>
        </div>
      </div>
      <CommentStrip count={deal.commentCount} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Style D: 이미지 flush + 메타 행 가격 우측 정렬
   ═══════════════════════════════════════════════════════════ */

function StyleD({ deal }: { deal: Deal }) {
  const hasDiscount = deal.originalPrice != null && deal.dealPrice != null && deal.originalPrice > deal.dealPrice;
  return (
    <div className="flex rounded-xl border border-border bg-card">
      <IndexStrip index={deal.index} />
      <div className="group flex flex-1 overflow-hidden">
        <div className="relative w-24 shrink-0 self-stretch overflow-hidden bg-muted sm:w-28">
          <Fallback />
          {deal.isHot && <HotBadge />}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between px-2.5 py-2 sm:px-3 sm:py-2.5">
          <h3 className="line-clamp-2 min-h-[2.75rem] text-base font-semibold leading-snug">{deal.title}</h3>
          <div className="mt-1 flex flex-col gap-1">
            <div className="flex items-end justify-between">
              <span className="flex flex-wrap items-baseline gap-x-1.5">
                {hasDiscount && deal.discountRate != null && <span className="text-sm font-bold text-red-500">{deal.discountRate}%</span>}
                <span className="text-base font-bold">{formatPrice(deal.dealPrice!)}원</span>
                {hasDiscount && <span className="text-xs text-muted-foreground line-through">{formatPrice(deal.originalPrice!)}원</span>}
              </span>
            </div>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-0.5"><CursorClick className="size-2.5" />{formatCount(deal.viewCount)}</span> ·
              <span className="inline-flex items-center gap-0.5"><Heart className="size-2.5" />{deal.likeCount}</span> ·
              {deal.nickname} · {deal.store && <>{deal.store} · </>}{deal.createdAt}
            </span>
          </div>
        </div>
      </div>
      <CommentStrip count={deal.commentCount} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Style E: 이미지 flush + 인덱스 번호 제거 (이미지가 카드 왼쪽 끝까지)
   ═══════════════════════════════════════════════════════════ */

function StyleE({ deal }: { deal: Deal }) {
  const hasDiscount = deal.originalPrice != null && deal.dealPrice != null && deal.originalPrice > deal.dealPrice;
  return (
    <div className="flex rounded-xl border border-border bg-card overflow-hidden">
      <div className="relative w-24 shrink-0 self-stretch overflow-hidden bg-muted sm:w-28">
        <Fallback />
        {deal.isHot && <HotBadge />}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between px-2.5 py-2 sm:px-3 sm:py-2.5">
        <h3 className="line-clamp-2 min-h-[2.75rem] text-base font-semibold leading-snug">{deal.title}</h3>
        <div className="mt-1 flex flex-col gap-1">
          <span className="flex flex-wrap items-baseline gap-x-1.5">
            {hasDiscount && deal.discountRate != null && <span className="text-sm font-bold text-red-500">{deal.discountRate}%</span>}
            <span className="text-base font-bold">{formatPrice(deal.dealPrice!)}원</span>
            {hasDiscount && <span className="text-xs text-muted-foreground line-through">{formatPrice(deal.originalPrice!)}원</span>}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-0.5"><CursorClick className="size-2.5" />{formatCount(deal.viewCount)}</span> ·
            <span className="inline-flex items-center gap-0.5"><Heart className="size-2.5" />{deal.likeCount}</span> ·
            {deal.nickname} · {deal.store && <>{deal.store} · </>}{deal.createdAt}
          </span>
        </div>
      </div>
      <CommentStrip count={deal.commentCount} rounded />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Style F: 이미지 flush + 넓은 이미지 + 인덱스 제거
   ═══════════════════════════════════════════════════════════ */

function StyleF({ deal }: { deal: Deal }) {
  const hasDiscount = deal.originalPrice != null && deal.dealPrice != null && deal.originalPrice > deal.dealPrice;
  return (
    <div className="flex overflow-hidden rounded-r-xl border border-border bg-card">
      <div className="relative w-28 shrink-0 self-stretch overflow-hidden bg-muted sm:w-32">
        <Fallback />
        {deal.isHot && <HotBadge />}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between px-2.5 py-2 sm:px-3 sm:py-2.5">
        <h3 className="line-clamp-2 min-h-[2.75rem] text-base font-semibold leading-snug">{deal.title}</h3>
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
              {deal.nickname}{deal.store && <> · {deal.store}</>} · {deal.createdAt}
            </span>
          </span>
        </div>
      </div>
      <CommentStrip count={deal.commentCount} rounded />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Page
   ═══════════════════════════════════════════════════════════ */

const STYLES = [
  { name: "A", label: "현재 — 이미지 패딩 있음 (비교용)", Component: StyleA },
  { name: "B", label: "이미지 flush — 기본", Component: StyleB },
  { name: "C", label: "이미지 flush — 넓은 이미지 (w-28)", Component: StyleC },
  { name: "D", label: "이미지 flush — 가격/메타 분리 강조", Component: StyleD },
  { name: "E", label: "이미지 flush — 인덱스 번호 제거", Component: StyleE },
  { name: "F", label: "이미지 flush — 넓은 이미지 + 인덱스 제거", Component: StyleF },
];

export default function DealCardCompactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold">딜 카드 — 이미지 flush 비교</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        이미지를 카드 border에 딱 붙이고, 텍스트에만 패딩을 준 디자인 비교입니다.
      </p>

      {STYLES.map(({ name, label, Component }) => (
        <section key={name} className="mb-12">
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
  );
}
