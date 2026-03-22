"use client";

import { useState } from "react";
import { Heart, ChatCircle, XCircle, Flag, Fire, CursorClick, CaretRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type Deal = { rank: number; title: string; dealPrice: number; originalPrice: number | null; discountRate: number | null; nickname: string; store: string | null; likeCount: number; commentCount: number; viewCount: number };

const DEAL: Deal = {
  rank: 1,
  title: "[단독특가] Apple 에어팟 프로 2세대 (USB-C) — 2026년 역대 최저가 갱신!",
  dealPrice: 199000, originalPrice: 289000, discountRate: 31,
  nickname: "테크딜러", store: "쿠팡", likeCount: 634, commentCount: 152, viewCount: 12847,
};
const DEAL2: Deal = {
  rank: 2, title: "안양축협 한돈 삼겹살 1kg",
  dealPrice: 18900, originalPrice: null, discountRate: null,
  nickname: "HDDC Bot", store: null, likeCount: 3, commentCount: 0, viewCount: 89,
};
const DEAL3: Deal = {
  rank: 3, title: "나이키 에어맥스 97 — 언더리테일 한정 컬러",
  dealPrice: 129000, originalPrice: 179000, discountRate: 28,
  nickname: "패션헌터", store: "무신사", likeCount: 312, commentCount: 28, viewCount: 5420,
};
const DEALS = [DEAL, DEAL2, DEAL3];

function formatPrice(n: number) { return n.toLocaleString("ko-KR"); }
function formatCount(n: number) { return n >= 10000 ? `${(n / 10000).toFixed(1)}만` : n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n); }

function Thumb({ deal }: { deal: Deal }) {
  return (
    <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted sm:size-24">
      <div className="flex size-full items-center justify-center bg-foreground text-xs font-bold text-background">핫딜닷쿨</div>
      {deal.likeCount >= 30 && (
        <span className="absolute left-1 top-1 flex items-center gap-0.5 rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
          <Fire className="size-2.5" weight="fill" />인기
        </span>
      )}
    </div>
  );
}

function Price({ deal }: { deal: Deal }) {
  const hasDiscount = deal.originalPrice != null && deal.dealPrice != null && deal.originalPrice > deal.dealPrice;
  if (hasDiscount) {
    return (
      <span className="flex flex-wrap items-baseline gap-x-1.5">
        <span className="text-sm font-bold text-red-500">{deal.discountRate}%</span>
        <span className="text-base font-bold">{formatPrice(deal.dealPrice)}원</span>
        <span className="text-xs text-muted-foreground line-through">{formatPrice(deal.originalPrice!)}원</span>
      </span>
    );
  }
  return <span className="text-base font-bold">{formatPrice(deal.dealPrice)}원</span>;
}

/* ═══════════════════════════════════════════
   A: 좌측 번호 + 우측 댓글 텍스트 세로
   ═══════════════════════════════════════════ */
function StyleA({ deal }: { deal: Deal }) {
  const [liked, setLiked] = useState(false);
  const [expired, setExpired] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  return (
    <div className="flex rounded-xl border border-border bg-card">
      <div className="flex w-8 shrink-0 items-center justify-center rounded-l-xl bg-muted/50 text-sm font-bold text-muted-foreground">
        {deal.rank}
      </div>
      <div className="flex flex-1 gap-3 p-2.5 sm:p-3">
        <Thumb deal={deal} />
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug">{deal.title}</h3>
          <div className="mt-1 flex flex-col gap-1.5">
            <div className="flex items-end justify-between">
              <Price deal={deal} />
              <span className="shrink-0 text-[10px] text-muted-foreground">{deal.nickname} · {deal.store && <>{deal.store} · </>}2시간 전</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground"><CursorClick className="size-3" />{formatCount(deal.viewCount)}</span>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setLiked(!liked)} className={cn("flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors", liked ? "bg-red-50 text-red-500" : "bg-muted text-muted-foreground hover:text-foreground")}>
                  <Heart className="size-3" weight={liked ? "fill" : "regular"} />{deal.likeCount}
                </button>
                <button onClick={() => setExpired(!expired)} className={cn("flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors", expired ? "bg-orange-50 text-orange-500" : "bg-muted text-muted-foreground hover:text-foreground")}>
                  <XCircle className="size-3" weight={expired ? "fill" : "regular"} />끝났어요
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Right: Comment strip */}
      <button
        onClick={() => setCommentOpen(!commentOpen)}
        className={cn(
          "flex w-10 shrink-0 flex-col items-center justify-center gap-1 rounded-r-xl border-l border-border transition-colors",
          commentOpen ? "bg-primary text-primary-foreground" : "bg-muted/30 text-muted-foreground hover:bg-muted/60 hover:text-foreground",
        )}
      >
        <ChatCircle className="size-4" weight={commentOpen ? "fill" : "regular"} />
        <span className="text-[9px] font-medium">{deal.commentCount}</span>
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════
   B: 좌측 번호 + 우측 댓글 세로 (chevron 포함)
   ═══════════════════════════════════════════ */
function StyleB({ deal }: { deal: Deal }) {
  const [liked, setLiked] = useState(false);
  const [expired, setExpired] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  return (
    <div className="flex rounded-xl border border-border bg-card">
      <div className="flex w-8 shrink-0 items-center justify-center rounded-l-xl bg-muted/50 text-sm font-bold text-muted-foreground">
        {deal.rank}
      </div>
      <div className="flex flex-1 gap-3 p-2.5 sm:p-3">
        <Thumb deal={deal} />
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug">{deal.title}</h3>
          <div className="mt-1 flex flex-col gap-1.5">
            <div className="flex items-end justify-between">
              <Price deal={deal} />
              <span className="shrink-0 text-[10px] text-muted-foreground">{deal.nickname} · {deal.store && <>{deal.store} · </>}2시간 전</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground"><CursorClick className="size-3" />{formatCount(deal.viewCount)}</span>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setLiked(!liked)} className={cn("flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors", liked ? "bg-red-50 text-red-500" : "bg-muted text-muted-foreground hover:text-foreground")}>
                  <Heart className="size-3" weight={liked ? "fill" : "regular"} />{deal.likeCount}
                </button>
                <button onClick={() => setExpired(!expired)} className={cn("flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors", expired ? "bg-orange-50 text-orange-500" : "bg-muted text-muted-foreground hover:text-foreground")}>
                  <XCircle className="size-3" weight={expired ? "fill" : "regular"} />끝났어요
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={() => setCommentOpen(!commentOpen)}
        className={cn(
          "flex w-12 shrink-0 flex-col items-center justify-center gap-0.5 rounded-r-xl border-l border-border transition-colors",
          commentOpen ? "bg-primary text-primary-foreground" : "bg-muted/30 text-muted-foreground hover:bg-muted/60 hover:text-foreground",
        )}
      >
        <ChatCircle className="size-4" weight={commentOpen ? "fill" : "regular"} />
        <span className="text-[9px] font-medium">{deal.commentCount}</span>
        <CaretRight className="size-3 opacity-50" />
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════
   C: 좌측 번호 + 우측 댓글 넓게 (텍스트 세로)
   ═══════════════════════════════════════════ */
function StyleC({ deal }: { deal: Deal }) {
  const [liked, setLiked] = useState(false);
  const [expired, setExpired] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  return (
    <div className="flex rounded-xl border border-border bg-card">
      <div className="flex w-8 shrink-0 items-center justify-center rounded-l-xl bg-muted/50 text-sm font-bold text-muted-foreground">
        {deal.rank}
      </div>
      <div className="flex flex-1 gap-3 p-2.5 sm:p-3">
        <Thumb deal={deal} />
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug">{deal.title}</h3>
          <div className="mt-1 flex flex-col gap-1.5">
            <div className="flex items-end justify-between">
              <Price deal={deal} />
              <span className="shrink-0 text-[10px] text-muted-foreground">{deal.nickname} · {deal.store && <>{deal.store} · </>}2시간 전</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground"><CursorClick className="size-3" />{formatCount(deal.viewCount)}</span>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setLiked(!liked)} className={cn("flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors", liked ? "bg-red-50 text-red-500" : "bg-muted text-muted-foreground hover:text-foreground")}>
                  <Heart className="size-3" weight={liked ? "fill" : "regular"} />{deal.likeCount}
                </button>
                <button onClick={() => setExpired(!expired)} className={cn("flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors", expired ? "bg-orange-50 text-orange-500" : "bg-muted text-muted-foreground hover:text-foreground")}>
                  <XCircle className="size-3" weight={expired ? "fill" : "regular"} />끝났어요
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={() => setCommentOpen(!commentOpen)}
        className={cn(
          "flex w-14 shrink-0 flex-col items-center justify-center gap-1 rounded-r-xl border-l border-border transition-colors",
          commentOpen ? "bg-primary text-primary-foreground" : "bg-muted/30 text-muted-foreground hover:bg-muted/60 hover:text-foreground",
        )}
      >
        <ChatCircle className="size-4" weight={commentOpen ? "fill" : "regular"} />
        <span className="text-[9px] font-semibold">{deal.commentCount}</span>
        <span className="text-[8px]">댓글</span>
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════
   D: 좌측 번호 + 우측 댓글 (배경 그라데이션)
   ═══════════════════════════════════════════ */
function StyleD({ deal }: { deal: Deal }) {
  const [liked, setLiked] = useState(false);
  const [expired, setExpired] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  return (
    <div className="flex rounded-xl border border-border bg-card">
      <div className="flex w-8 shrink-0 items-center justify-center rounded-l-xl bg-muted/50 text-sm font-bold text-muted-foreground">
        {deal.rank}
      </div>
      <div className="flex flex-1 gap-3 p-2.5 sm:p-3">
        <Thumb deal={deal} />
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug">{deal.title}</h3>
          <div className="mt-1 flex flex-col gap-1.5">
            <div className="flex items-end justify-between">
              <Price deal={deal} />
              <span className="shrink-0 text-[10px] text-muted-foreground">{deal.nickname} · {deal.store && <>{deal.store} · </>}2시간 전</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground"><CursorClick className="size-3" />{formatCount(deal.viewCount)}</span>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setLiked(!liked)} className={cn("flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors", liked ? "bg-red-50 text-red-500" : "bg-muted text-muted-foreground hover:text-foreground")}>
                  <Heart className="size-3" weight={liked ? "fill" : "regular"} />{deal.likeCount}
                </button>
                <button onClick={() => setExpired(!expired)} className={cn("flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors", expired ? "bg-orange-50 text-orange-500" : "bg-muted text-muted-foreground hover:text-foreground")}>
                  <XCircle className="size-3" weight={expired ? "fill" : "regular"} />끝났어요
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={() => setCommentOpen(!commentOpen)}
        className={cn(
          "flex w-11 shrink-0 flex-col items-center justify-center gap-1 rounded-r-xl border-l transition-colors",
          commentOpen
            ? "border-primary/30 bg-gradient-to-b from-primary to-primary/80 text-primary-foreground"
            : "border-border bg-gradient-to-b from-muted/50 to-muted/20 text-muted-foreground hover:from-muted hover:to-muted/50 hover:text-foreground",
        )}
      >
        <ChatCircle className="size-4" weight={commentOpen ? "fill" : "regular"} />
        <span className="text-[9px] font-semibold">{deal.commentCount}</span>
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════
   E: 좌측 번호(색상) + 우측 댓글 (점선 border)
   ═══════════════════════════════════════════ */
function StyleE({ deal }: { deal: Deal }) {
  const [liked, setLiked] = useState(false);
  const [expired, setExpired] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const rankColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-muted"];
  const rankColor = rankColors[Math.min(deal.rank - 1, 3)];
  return (
    <div className="flex rounded-xl border border-border bg-card">
      <div className={cn("flex w-8 shrink-0 items-center justify-center rounded-l-xl text-sm font-bold text-white", rankColor)}>
        {deal.rank}
      </div>
      <div className="flex flex-1 gap-3 p-2.5 sm:p-3">
        <Thumb deal={deal} />
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug">{deal.title}</h3>
          <div className="mt-1 flex flex-col gap-1.5">
            <div className="flex items-end justify-between">
              <Price deal={deal} />
              <span className="shrink-0 text-[10px] text-muted-foreground">{deal.nickname} · {deal.store && <>{deal.store} · </>}2시간 전</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground"><CursorClick className="size-3" />{formatCount(deal.viewCount)}</span>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setLiked(!liked)} className={cn("flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors", liked ? "bg-red-50 text-red-500" : "bg-muted text-muted-foreground hover:text-foreground")}>
                  <Heart className="size-3" weight={liked ? "fill" : "regular"} />{deal.likeCount}
                </button>
                <button onClick={() => setExpired(!expired)} className={cn("flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors", expired ? "bg-orange-50 text-orange-500" : "bg-muted text-muted-foreground hover:text-foreground")}>
                  <XCircle className="size-3" weight={expired ? "fill" : "regular"} />끝났어요
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={() => setCommentOpen(!commentOpen)}
        className={cn(
          "flex w-11 shrink-0 flex-col items-center justify-center gap-1 rounded-r-xl border-l border-dashed transition-colors",
          commentOpen ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground",
        )}
      >
        <ChatCircle className="size-4" weight={commentOpen ? "fill" : "regular"} />
        <span className="text-[9px] font-semibold">{deal.commentCount}</span>
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════ */

const STYLES = [
  { name: "A", label: "기본 — 좌 번호 + 우 댓글 (40px)", desc: "좌측 번호 스트립 + 우측 댓글 아이콘+숫자. 좋아요/끝났어요 pill 우측", Component: StyleA },
  { name: "B", label: "chevron 포함 (48px)", desc: "우측에 > 화살표 추가. 사이드 패널 열리는 느낌 강조", Component: StyleB },
  { name: "C", label: "넓은 댓글 영역 (56px)", desc: "우측 넓게 + 아이콘·숫자·'댓글' 텍스트 세로 배치", Component: StyleC },
  { name: "D", label: "그라데이션 배경", desc: "우측 댓글 영역에 그라데이션. active 시 primary 그라데이션", Component: StyleD },
  { name: "E", label: "순위별 색상 + 점선 border", desc: "좌측 번호가 1위 빨강·2위 주황·3위 노랑. 우측 댓글은 점선 border", Component: StyleE },
];

export default function CardActionPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold">좌측 번호 + 우측 댓글 세로 스트립</h1>
      <p className="mb-2 text-sm text-muted-foreground">공통: 좌측 번호 스트립 · 클릭수 왼쪽 · 좋아요/끝났어요 pill 우측 · 우측 댓글 세로 스트립</p>
      <p className="mb-8 text-xs text-muted-foreground/60">각 버튼 클릭 시 active 확인. 3개 카드(1·2·3위)로 비교.</p>

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
            {DEALS.map((deal) => <Component key={deal.rank} deal={deal} />)}
          </div>
        </section>
      ))}
    </div>
  );
}
