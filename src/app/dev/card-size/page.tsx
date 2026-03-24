"use client";

import { useState } from "react";
import { Heart, ChatCircle, Fire, CursorClick, XCircle } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/* ─── Sample data ─── */

const DEALS = [
  {
    title: "쿠팡 로켓와우 멤버십 첫 달 무료쿠팡 로켓와우 멤버십 첫 달 무료쿠팡 로켓와우 멤버십",
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
    title: "[단독특가] Apple 에어팟 프로 2세대 (USB-C) 역대 최저가 도전",
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

function Fallback({ textSize = "text-base" }: { textSize?: string }) {
  return (
    <div className={cn("flex size-full items-center justify-center bg-foreground font-bold text-background", textSize)}>
      핫딜닷쿨
    </div>
  );
}

function HoverPills({ liked, expired, onLike, onExpired }: { liked: boolean; expired: boolean; onLike: () => void; onExpired: () => void }) {
  return (
    <div className="absolute right-0 flex translate-x-full items-center gap-1.5 bg-card pl-2 transition-transform duration-200 ease-out group-hover/meta:translate-x-0">
      <button onClick={onLike} className={cn("flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium transition-colors", liked ? "bg-red-500 text-white" : "bg-muted text-muted-foreground hover:text-red-400")}>
        <Heart className="size-3" weight={liked ? "fill" : "regular"} />좋아요
      </button>
      <button onClick={onExpired} className={cn("flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium transition-colors", expired ? "bg-orange-500 text-white" : "bg-muted text-muted-foreground hover:text-orange-400")}>
        <XCircle className="size-3" />끝났어요
      </button>
    </div>
  );
}

/* ─── Desktop card (Style F + B shadow) with configurable image size ─── */

function DealCard({ deal, imgSize }: { deal: Deal; imgSize: number }) {
  const [liked, setLiked] = useState(false);
  const [expired, setExpired] = useState(false);
  const hasDiscount = deal.originalPrice != null && deal.dealPrice != null && deal.originalPrice > deal.dealPrice;
  const imgPx = `${imgSize}px`;
  const fallbackText = imgSize <= 80 ? "text-xs" : imgSize <= 96 ? "text-sm" : "text-base";

  return (
    <div className="relative flex overflow-hidden rounded-r-xl bg-card pr-10 shadow-md" style={{ minHeight: imgPx }}>
      {/* Card body */}
      <div className="group flex flex-1 overflow-hidden">
        {/* Thumbnail — fixed width, self-stretch height */}
        <div
          className="relative shrink-0 self-stretch overflow-hidden bg-muted"
          style={{ width: imgPx }}
        >
          <Fallback textSize={fallbackText} />
          {deal.isHot && (
            <span className="absolute left-1.5 top-1.5 flex items-center gap-0.5 rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-2 py-0.5 text-xs font-bold text-white shadow-sm">
              <Fire className="size-3" weight="fill" />인기
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col justify-between px-3 py-2.5">
          <h3 className={cn("text-base font-semibold leading-snug", imgSize <= 96 ? "truncate" : "line-clamp-2 min-h-[2.75rem]")}>{deal.title}</h3>
          <div className="mt-1 flex flex-col gap-1">
            <span className="flex flex-wrap items-baseline gap-x-1.5">
              {hasDiscount && deal.discountRate != null && <span className="text-sm font-bold text-red-500">{deal.discountRate}%</span>}
              <span className="text-base font-bold">{formatPrice(deal.dealPrice!)}원</span>
              {hasDiscount && <span className="text-xs text-muted-foreground line-through">{formatPrice(deal.originalPrice!)}원</span>}
            </span>
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

      {/* Right comment strip */}
      <div className="absolute right-0 top-0 flex h-full w-10 flex-col items-center justify-center gap-1 rounded-r-xl border-l border-border/50 bg-muted/30 text-muted-foreground">
        <ChatCircle className="size-4" />
        <span className="text-xs font-medium">{deal.commentCount}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Page
   ═══════════════════════════════════════════════════════════ */

const SIZES = [
  { px: 128, label: "현재 (w-32 = 128px)" },
  { px: 112, label: "w-28 = 112px" },
  { px: 100, label: "100px" },
  { px: 96, label: "96px (size-24)" },
  { px: 88, label: "88px" },
  { px: 80, label: "80px (size-20)" },
];

export default function CardSizePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-8">
        <h1 className="mb-2 text-2xl font-bold">딜 카드 이미지 사이즈 비교 (데스크탑)</h1>
        <p className="mb-8 text-sm text-muted-foreground">
          웹 레이아웃 — 좌측 플랫 + 우측 댓글 스트립 + hover ActionPill. 이미지 사이즈별 카드 높이 변화 및 2줄 제목 확인.
        </p>

        {SIZES.map(({ px, label }) => (
          <section key={px} className="mb-10">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-7 items-center justify-center rounded-full bg-primary px-3 text-xs font-bold text-primary-foreground">{px}px</span>
              <h2 className="text-sm font-semibold">{label}</h2>
            </div>
            <div className="flex flex-col gap-3">
              {DEALS.map((deal, i) => (
                <DealCard key={i} deal={deal} imgSize={px} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
