"use client";

import { Heart, ChatCircle, XCircle, Flag, Fire } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const DEAL = {
  title: "[단독특가] Apple 에어팟 프로 2세대 (USB-C) — 2026년 역대 최저가 갱신!",
  imageUrl: "",
  originalPrice: 289000,
  dealPrice: 199000,
  discountRate: 31,
  nickname: "테크딜러",
  store: "쿠팡",
  likeCount: 124,
  commentCount: 18,
};

const DEAL_SHORT = {
  title: "안양축협 한돈 삼겹살 1kg",
  imageUrl: "",
  originalPrice: null as number | null,
  dealPrice: 18900,
  discountRate: null as number | null,
  nickname: "HDDC Bot",
  store: null as string | null,
  likeCount: 3,
  commentCount: 0,
};

function formatPrice(n: number) { return n.toLocaleString("ko-KR"); }

function ActionBar({ likeCount, commentCount, compact }: { likeCount: number; commentCount: number; compact?: boolean }) {
  const iconSize = compact ? "size-3" : "size-3.5";
  const textSize = compact ? "text-[10px]" : "text-[11px]";
  const py = compact ? "py-1" : "py-1.5";
  return (
    <div className={cn("flex items-center gap-2 border-t border-border px-3 text-muted-foreground sm:gap-4 sm:px-4", textSize, py)}>
      <button className="flex items-center gap-1"><Heart className={iconSize} />{likeCount}</button>
      <button className="flex items-center gap-1"><ChatCircle className={iconSize} />{commentCount}</button>
      <button className="flex items-center gap-1"><XCircle className={iconSize} />끝났어요</button>
      <button className="ml-auto flex items-center gap-1"><Flag className={iconSize} /></button>
    </div>
  );
}

function Price({ originalPrice, dealPrice, discountRate }: { originalPrice: number | null; dealPrice: number | null; discountRate: number | null }) {
  const hasDiscount = originalPrice != null && dealPrice != null && originalPrice > dealPrice;
  if (hasDiscount) {
    return (
      <span className="flex flex-wrap items-baseline gap-x-1.5">
        {discountRate != null && <span className="text-sm font-bold text-red-500">{discountRate}%</span>}
        <span className="text-base font-bold">{formatPrice(dealPrice!)}원</span>
        <span className="text-xs text-muted-foreground line-through">{formatPrice(originalPrice!)}원</span>
      </span>
    );
  }
  const price = dealPrice ?? originalPrice;
  return price ? <span className="text-base font-bold">{formatPrice(price)}원</span> : <span className="text-sm text-muted-foreground">가격 정보 없음</span>;
}

function Thumb({ size }: { size: string }) {
  return (
    <div className={cn("relative shrink-0 overflow-hidden rounded-lg bg-muted", size)}>
      <div className="flex size-full items-center justify-center bg-foreground text-xs font-bold text-background">핫딜닷쿨</div>
      <span className="absolute left-1 top-1 flex items-center gap-0.5 rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
        <Fire className="size-2.5" weight="fill" />인기
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════
   A: 이미지 96/112 + 제목 16px
   ═══════════════════════════════════════════ */
function StyleA({ deal }: { deal: typeof DEAL }) {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="group flex gap-3 p-3 sm:gap-4 sm:p-4">
        <Thumb size="size-24 sm:size-28" />
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug">{deal.title}</h3>
          <div className="mt-1.5 flex items-end justify-between">
            <Price originalPrice={deal.originalPrice} dealPrice={deal.dealPrice} discountRate={deal.discountRate} />
            <span className="shrink-0 text-[10px] text-muted-foreground">{deal.nickname} · {deal.store && <>{deal.store} · </>}2시간 전</span>
          </div>
        </div>
      </div>
      <ActionBar likeCount={deal.likeCount} commentCount={deal.commentCount} />
    </div>
  );
}

/* ═══════════════════════════════════════════
   B: 이미지 80/96 + 제목 16px + 패딩 축소
   ═══════════════════════════════════════════ */
function StyleB({ deal }: { deal: typeof DEAL }) {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="group flex gap-3 p-2.5 sm:gap-3 sm:p-3">
        <Thumb size="size-20 sm:size-24" />
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug">{deal.title}</h3>
          <div className="mt-1 flex items-end justify-between">
            <Price originalPrice={deal.originalPrice} dealPrice={deal.dealPrice} discountRate={deal.discountRate} />
            <span className="shrink-0 text-[10px] text-muted-foreground">{deal.nickname} · {deal.store && <>{deal.store} · </>}2시간 전</span>
          </div>
        </div>
      </div>
      <ActionBar likeCount={deal.likeCount} commentCount={deal.commentCount} />
    </div>
  );
}

/* ═══════════════════════════════════════════
   C: 이미지 72/80 + 제목 16px + 패딩 최소
   ═══════════════════════════════════════════ */
function StyleC({ deal }: { deal: typeof DEAL }) {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="group flex gap-2.5 p-2.5 sm:gap-3 sm:p-3">
        <Thumb size="size-18 sm:size-20" />
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug">{deal.title}</h3>
          <div className="mt-1 flex items-end justify-between">
            <Price originalPrice={deal.originalPrice} dealPrice={deal.dealPrice} discountRate={deal.discountRate} />
            <span className="shrink-0 text-[10px] text-muted-foreground">{deal.nickname} · {deal.store && <>{deal.store} · </>}2시간 전</span>
          </div>
        </div>
      </div>
      <ActionBar likeCount={deal.likeCount} commentCount={deal.commentCount} compact />
    </div>
  );
}

/* ═══════════════════════════════════════════
   D: 이미지 80/96 + 제목 1줄 + 가격/메타 한줄
   ═══════════════════════════════════════════ */
function StyleD({ deal }: { deal: typeof DEAL }) {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="group flex gap-3 p-2.5 sm:gap-3 sm:p-3">
        <Thumb size="size-20 sm:size-24" />
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
          <h3 className="line-clamp-1 text-base font-semibold leading-snug">{deal.title}</h3>
          <div className="flex items-baseline justify-between">
            <Price originalPrice={deal.originalPrice} dealPrice={deal.dealPrice} discountRate={deal.discountRate} />
            <span className="shrink-0 text-[10px] text-muted-foreground">{deal.nickname} · {deal.store && <>{deal.store} · </>}2시간 전</span>
          </div>
        </div>
      </div>
      <ActionBar likeCount={deal.likeCount} commentCount={deal.commentCount} />
    </div>
  );
}

/* ═══════════════════════════════════════════
   E: 이미지 80/96 + 제목 2줄 + 액션바 통합
   가격줄에 액션 아이콘 포함 (1줄 절약)
   ═══════════════════════════════════════════ */
function StyleE({ deal }: { deal: typeof DEAL }) {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="group flex gap-3 p-2.5 sm:gap-3 sm:p-3">
        <Thumb size="size-20 sm:size-24" />
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug">{deal.title}</h3>
          <div className="mt-1 flex flex-col gap-1">
            <div className="flex items-end justify-between">
              <Price originalPrice={deal.originalPrice} dealPrice={deal.dealPrice} discountRate={deal.discountRate} />
              <span className="shrink-0 text-[10px] text-muted-foreground">{deal.nickname} · {deal.store && <>{deal.store} · </>}2시간 전</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-0.5"><Heart className="size-3" />{deal.likeCount}</span>
              <span className="flex items-center gap-0.5"><ChatCircle className="size-3" />{deal.commentCount}</span>
              <span className="flex items-center gap-0.5"><XCircle className="size-3" />끝났어요</span>
              <span className="ml-auto flex items-center gap-0.5"><Flag className="size-3" /></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════ */

const STYLES = [
  { name: "A", label: "현재 (desc 제거만)", desc: "이미지 96/112px · 패딩 12/16px · 액션바 분리", Component: StyleA },
  { name: "B", label: "축소", desc: "이미지 80/96px · 패딩 10/12px · 액션바 분리", Component: StyleB },
  { name: "C", label: "컴팩트", desc: "이미지 72/80px · 패딩 최소 · 액션바 축소", Component: StyleC },
  { name: "D", label: "1줄 제목", desc: "이미지 80/96px · 제목 1줄만 · 가격 같은 줄", Component: StyleD },
  { name: "E", label: "액션바 통합", desc: "이미지 80/96px · 액션바를 카드 안에 인라인 (border 없음)", Component: StyleE },
];

export default function CardHeightPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold">딜 카드 높이 비교</h1>
      <p className="mb-8 text-sm text-muted-foreground">공통: 제목 16px · description 없음. 긴 제목 + 짧은 제목 2개씩.</p>

      {STYLES.map(({ name, label, desc, Component }) => (
        <section key={name} className="mb-10">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{name}</span>
            <div>
              <p className="text-sm font-semibold">{label}</p>
              <p className="text-[10px] text-muted-foreground">{desc}</p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Component deal={DEAL} />
            <Component deal={DEAL_SHORT as typeof DEAL} />
          </div>
        </section>
      ))}
    </div>
  );
}
