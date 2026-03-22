"use client";

import { Heart, ChatCircle, XCircle, Flag, ArrowSquareOut, Fire } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/* ─── Sample data ─── */

const DEALS = [
  {
    title: "LudyServer - File Transfer 앱 - App Store",
    description: "와이파이 파일 공유 앱이 한시적으로 IAP가 무료라 정보 공유합니다. 평소 4,400원이었습니다.",
    imageUrl: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/12/09/e1/1209e1c4-84c5-829d-de5e-842c63ff4702/Placeholder.mill/1200x630wa.jpg",
    originalPrice: 4400,
    dealPrice: 0,
    discountRate: 100,
    nickname: "HDDC Bot",
    store: "App Store",
    likeCount: 34,
    commentCount: 5,
    createdAt: "23시간 전",
  },
  {
    title: "[단독특가] Apple 에어팟 프로 2세대 (USB-C) — 2026년 역대 최저가",
    description: "액티브 노이즈 캔슬링 2배 향상, 적응형 오디오, USB-C 충전, MagSafe 지원",
    imageUrl: "",
    originalPrice: 289000,
    dealPrice: 199000,
    discountRate: 31,
    nickname: "테크딜러",
    store: "쿠팡",
    likeCount: 124,
    commentCount: 18,
    createdAt: "2시간 전",
  },
  {
    title: "안양축협 한돈 삼겹살 1kg",
    description: null,
    imageUrl: "",
    originalPrice: null,
    dealPrice: 18900,
    discountRate: null,
    nickname: "HDDC Bot",
    store: null,
    likeCount: 3,
    commentCount: 0,
    createdAt: "5시간 전",
  },
];

function formatPrice(n: number): string {
  return n.toLocaleString("ko-KR");
}

function Thumbnail({ src, title }: { src: string; title: string }) {
  return src ? (
    <img src={src} alt={title} className="size-full object-cover" />
  ) : (
    <div className="flex size-full items-center justify-center bg-foreground text-xs font-bold text-background">핫딜닷쿨</div>
  );
}

function PriceBadge({ discountRate }: { discountRate: number | null }) {
  if (discountRate == null) return null;
  return <span className="text-sm font-bold text-red-500">{discountRate}%</span>;
}

function ActionBar({ likeCount, commentCount }: { likeCount: number; commentCount: number }) {
  return (
    <div className="flex items-center gap-2 border-t border-border px-3 py-2 text-[11px] text-muted-foreground sm:gap-4 sm:px-4">
      <button className="flex items-center gap-1"><Heart className="size-3.5" /><span>{likeCount}</span></button>
      <button className="flex items-center gap-1"><ChatCircle className="size-3.5" /><span>{commentCount}</span></button>
      <button className="flex items-center gap-1"><XCircle className="size-3.5" /><span>끝났어요</span></button>
      <button className="ml-auto flex items-center gap-1"><Flag className="size-3.5" /><span className="hidden sm:inline">신고</span></button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Style A: 현재 (한 줄에 모두)
   ═══════════════════════════════════════════════════════════ */

function StyleA({ deal }: { deal: typeof DEALS[0] }) {
  const hasDiscount = deal.originalPrice != null && deal.dealPrice != null && deal.originalPrice > deal.dealPrice;
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="group flex gap-3 p-3 sm:gap-4 sm:p-4">
        <div className="relative size-24 shrink-0 overflow-hidden rounded-lg bg-muted sm:size-28">
          <Thumbnail src={deal.imageUrl} title={deal.title} />
          {deal.likeCount >= 30 && (
            <span className="absolute left-1.5 top-1.5 flex items-center gap-0.5 rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
              <Fire className="size-3" weight="fill" />인기
            </span>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            <h3 className="line-clamp-2 text-sm font-semibold leading-snug">{deal.title}</h3>
            {deal.description && <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{deal.description}</p>}
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
            {hasDiscount && <PriceBadge discountRate={deal.discountRate} />}
            <span className="text-base font-bold">{formatPrice(deal.dealPrice!)}원</span>
            {hasDiscount && <span className="text-xs text-muted-foreground line-through">{formatPrice(deal.originalPrice!)}원</span>}
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              {deal.nickname} · {deal.store && <>{deal.store} · </>}{deal.createdAt}
            </span>
          </div>
        </div>
      </div>
      <ActionBar likeCount={deal.likeCount} commentCount={deal.commentCount} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Style B: 가격/메타 2줄 분리
   ═══════════════════════════════════════════════════════════ */

function StyleB({ deal }: { deal: typeof DEALS[0] }) {
  const hasDiscount = deal.originalPrice != null && deal.dealPrice != null && deal.originalPrice > deal.dealPrice;
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="group flex gap-3 p-3 sm:gap-4 sm:p-4">
        <div className="relative size-24 shrink-0 overflow-hidden rounded-lg bg-muted sm:size-28">
          <Thumbnail src={deal.imageUrl} title={deal.title} />
          {deal.likeCount >= 30 && (
            <span className="absolute left-1.5 top-1.5 flex items-center gap-0.5 rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
              <Fire className="size-3" weight="fill" />인기
            </span>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            <h3 className="line-clamp-2 text-sm font-semibold leading-snug">{deal.title}</h3>
            {deal.description && <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{deal.description}</p>}
          </div>
          <div className="mt-1.5 flex flex-col gap-0.5">
            <div className="flex items-baseline gap-1.5">
              {hasDiscount && <PriceBadge discountRate={deal.discountRate} />}
              <span className="text-base font-bold">{formatPrice(deal.dealPrice!)}원</span>
              {hasDiscount && <span className="text-xs text-muted-foreground line-through">{formatPrice(deal.originalPrice!)}원</span>}
            </div>
            <span className="text-[11px] text-muted-foreground">
              {deal.nickname} · {deal.store && <>{deal.store} · </>}{deal.createdAt}
            </span>
          </div>
        </div>
      </div>
      <ActionBar likeCount={deal.likeCount} commentCount={deal.commentCount} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Style C: 가격 왼쪽 강조 + 메타 오른쪽 정렬
   ═══════════════════════════════════════════════════════════ */

function StyleC({ deal }: { deal: typeof DEALS[0] }) {
  const hasDiscount = deal.originalPrice != null && deal.dealPrice != null && deal.originalPrice > deal.dealPrice;
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="group flex gap-3 p-3 sm:gap-4 sm:p-4">
        <div className="relative size-24 shrink-0 overflow-hidden rounded-lg bg-muted sm:size-28">
          <Thumbnail src={deal.imageUrl} title={deal.title} />
          {deal.likeCount >= 30 && (
            <span className="absolute left-1.5 top-1.5 flex items-center gap-0.5 rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
              <Fire className="size-3" weight="fill" />인기
            </span>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            <h3 className="line-clamp-2 text-sm font-semibold leading-snug">{deal.title}</h3>
            {deal.description && <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{deal.description}</p>}
          </div>
          <div className="mt-1.5 flex items-end justify-between">
            <div className="flex items-baseline gap-1.5">
              {hasDiscount && <PriceBadge discountRate={deal.discountRate} />}
              <span className="text-base font-bold">{formatPrice(deal.dealPrice!)}원</span>
              {hasDiscount && <span className="text-xs text-muted-foreground line-through">{formatPrice(deal.originalPrice!)}원</span>}
            </div>
            <span className="shrink-0 text-[10px] text-muted-foreground">
              {deal.nickname} · {deal.store && <>{deal.store} · </>}{deal.createdAt}
            </span>
          </div>
        </div>
      </div>
      <ActionBar likeCount={deal.likeCount} commentCount={deal.commentCount} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Style D: 할인 뱃지 독립 + 가격/메타 분리
   ═══════════════════════════════════════════════════════════ */

function StyleD({ deal }: { deal: typeof DEALS[0] }) {
  const hasDiscount = deal.originalPrice != null && deal.dealPrice != null && deal.originalPrice > deal.dealPrice;
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="group flex gap-3 p-3 sm:gap-4 sm:p-4">
        <div className="relative size-24 shrink-0 overflow-hidden rounded-lg bg-muted sm:size-28">
          <Thumbnail src={deal.imageUrl} title={deal.title} />
          {hasDiscount && deal.discountRate != null && (
            <span className="absolute right-1.5 bottom-1.5 rounded-md bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
              {deal.discountRate}%
            </span>
          )}
          {deal.likeCount >= 30 && (
            <span className="absolute left-1.5 top-1.5 flex items-center gap-0.5 rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
              <Fire className="size-3" weight="fill" />인기
            </span>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            <h3 className="line-clamp-2 text-sm font-semibold leading-snug">{deal.title}</h3>
            {deal.description && <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{deal.description}</p>}
          </div>
          <div className="mt-1.5 flex flex-col gap-0.5">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold">{formatPrice(deal.dealPrice!)}원</span>
              {hasDiscount && <span className="text-xs text-muted-foreground line-through">{formatPrice(deal.originalPrice!)}원</span>}
            </div>
            <span className="text-[11px] text-muted-foreground">
              {deal.nickname} · {deal.store && <>{deal.store} · </>}{deal.createdAt}
            </span>
          </div>
        </div>
      </div>
      <ActionBar likeCount={deal.likeCount} commentCount={deal.commentCount} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Style E: 컴팩트 — 설명 숨김, 가격/메타 한 줄씩
   ═══════════════════════════════════════════════════════════ */

function StyleE({ deal }: { deal: typeof DEALS[0] }) {
  const hasDiscount = deal.originalPrice != null && deal.dealPrice != null && deal.originalPrice > deal.dealPrice;
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="group flex gap-3 p-3 sm:gap-4 sm:p-4">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted sm:size-24">
          <Thumbnail src={deal.imageUrl} title={deal.title} />
          {deal.likeCount >= 30 && (
            <span className="absolute left-1 top-1 flex items-center gap-0.5 rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-sm">
              <Fire className="size-2.5" weight="fill" />인기
            </span>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug">{deal.title}</h3>
          <div className="flex items-baseline gap-1.5">
            {hasDiscount && <PriceBadge discountRate={deal.discountRate} />}
            <span className="text-base font-bold">{formatPrice(deal.dealPrice!)}원</span>
            {hasDiscount && <span className="text-xs text-muted-foreground line-through">{formatPrice(deal.originalPrice!)}원</span>}
          </div>
          <span className="text-[11px] text-muted-foreground">
            {deal.nickname} · {deal.store && <>{deal.store} · </>}{deal.createdAt}
          </span>
        </div>
      </div>
      <ActionBar likeCount={deal.likeCount} commentCount={deal.commentCount} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Page
   ═══════════════════════════════════════════════════════════ */

const STYLES = [
  { name: "A", label: "현재 — 한 줄에 모두", Component: StyleA },
  { name: "B", label: "2줄 분리 — 가격 / 메타", Component: StyleB },
  { name: "C", label: "가격 왼쪽 + 메타 오른쪽", Component: StyleC },
  { name: "D", label: "할인 뱃지 이미지 위 + 2줄", Component: StyleD },
  { name: "E", label: "컴팩트 — 설명 숨김", Component: StyleE },
];

export default function CardVariantsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold">딜 카드 레이아웃 비교</h1>
      <p className="mb-8 text-sm text-muted-foreground">마음에 드는 스타일을 골라주세요. 3가지 데이터(할인/인기/가격만)로 테스트합니다.</p>

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
