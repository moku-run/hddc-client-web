"use client";

import { useState } from "react";
import { Heart, XCircle, CursorClick, ThumbsUp, ThumbsDown, Flame, Timer, Prohibit, Warning } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { IconText } from "@/components/ui/icon-text";

function Meta() {
  return (
    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
      <IconText icon={CursorClick}>330</IconText> ·
      <IconText icon={Heart}>634</IconText> ·
      HDDC · 쿠팡 · 1일 전
    </span>
  );
}

function HoverRow({ children, liked, expired, onLike, onExpired }: { children: React.ReactNode; liked: boolean; expired: boolean; onLike: () => void; onExpired: () => void }) {
  return (
    <div className="group/meta relative flex items-center justify-between overflow-hidden">
      <Meta />
      <div className="absolute right-0 flex translate-x-full items-center gap-1.5 bg-card pl-2 transition-transform duration-200 ease-out group-hover/meta:translate-x-0">
        {children}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   1: 현재 — 원형 아이콘만
   ═══════════════════════════════════════════ */
function Style1() {
  const [liked, setLiked] = useState(false);
  const [expired, setExpired] = useState(false);
  return (
    <HoverRow liked={liked} expired={expired} onLike={() => setLiked(!liked)} onExpired={() => setExpired(!expired)}>
      <button onClick={() => setLiked(!liked)} className={cn("flex size-6 items-center justify-center rounded-full transition-colors", liked ? "bg-red-50 text-red-500" : "bg-muted text-muted-foreground hover:text-red-500")}>
        <Heart className="size-3.5" weight={liked ? "fill" : "regular"} />
      </button>
      <button onClick={() => setExpired(!expired)} className={cn("flex size-6 items-center justify-center rounded-full transition-colors", expired ? "bg-orange-50 text-orange-500" : "bg-muted text-muted-foreground hover:text-orange-500")}>
        <XCircle className="size-3.5" weight={expired ? "fill" : "regular"} />
      </button>
    </HoverRow>
  );
}

/* ═══════════════════════════════════════════
   2: pill 텍스트 포함
   ═══════════════════════════════════════════ */
function Style2() {
  const [liked, setLiked] = useState(false);
  const [expired, setExpired] = useState(false);
  return (
    <HoverRow liked={liked} expired={expired} onLike={() => setLiked(!liked)} onExpired={() => setExpired(!expired)}>
      <button onClick={() => setLiked(!liked)} className={cn("flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium transition-colors", liked ? "bg-red-500 text-white" : "bg-muted text-muted-foreground hover:text-red-500")}>
        <Heart className="size-3" weight={liked ? "fill" : "regular"} />좋아요
      </button>
      <button onClick={() => setExpired(!expired)} className={cn("flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium transition-colors", expired ? "bg-orange-500 text-white" : "bg-muted text-muted-foreground hover:text-orange-500")}>
        <XCircle className="size-3" weight={expired ? "fill" : "regular"} />끝났어요
      </button>
    </HoverRow>
  );
}

/* ═══════════════════════════════════════════
   3: outline pill
   ═══════════════════════════════════════════ */
function Style3() {
  const [liked, setLiked] = useState(false);
  const [expired, setExpired] = useState(false);
  return (
    <HoverRow liked={liked} expired={expired} onLike={() => setLiked(!liked)} onExpired={() => setExpired(!expired)}>
      <button onClick={() => setLiked(!liked)} className={cn("flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium transition-colors", liked ? "border-red-300 bg-red-50 text-red-500" : "border-border text-muted-foreground hover:border-red-300 hover:text-red-500")}>
        <Heart className="size-3" weight={liked ? "fill" : "regular"} />좋아요
      </button>
      <button onClick={() => setExpired(!expired)} className={cn("flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium transition-colors", expired ? "border-orange-300 bg-orange-50 text-orange-500" : "border-border text-muted-foreground hover:border-orange-300 hover:text-orange-500")}>
        <XCircle className="size-3" weight={expired ? "fill" : "regular"} />끝났어요
      </button>
    </HoverRow>
  );
}

/* ═══════════════════════════════════════════
   4: 엄지 위/아래 원형
   ═══════════════════════════════════════════ */
function Style4() {
  const [liked, setLiked] = useState(false);
  const [expired, setExpired] = useState(false);
  return (
    <HoverRow liked={liked} expired={expired} onLike={() => setLiked(!liked)} onExpired={() => setExpired(!expired)}>
      <button onClick={() => setLiked(!liked)} className={cn("flex size-6 items-center justify-center rounded-full transition-colors", liked ? "bg-blue-50 text-blue-500" : "bg-muted text-muted-foreground hover:text-blue-500")}>
        <ThumbsUp className="size-3.5" weight={liked ? "fill" : "regular"} />
      </button>
      <button onClick={() => setExpired(!expired)} className={cn("flex size-6 items-center justify-center rounded-full transition-colors", expired ? "bg-orange-50 text-orange-500" : "bg-muted text-muted-foreground hover:text-orange-500")}>
        <ThumbsDown className="size-3.5" weight={expired ? "fill" : "regular"} />
      </button>
    </HoverRow>
  );
}

/* ═══════════════════════════════════════════
   5: 🔥 좋아요 + ⏱ 끝났어요
   ═══════════════════════════════════════════ */
function Style5() {
  const [liked, setLiked] = useState(false);
  const [expired, setExpired] = useState(false);
  return (
    <HoverRow liked={liked} expired={expired} onLike={() => setLiked(!liked)} onExpired={() => setExpired(!expired)}>
      <button onClick={() => setLiked(!liked)} className={cn("flex size-6 items-center justify-center rounded-full transition-colors", liked ? "bg-red-50 text-red-500" : "bg-muted text-muted-foreground hover:text-red-500")}>
        <Flame className="size-3.5" weight={liked ? "fill" : "regular"} />
      </button>
      <button onClick={() => setExpired(!expired)} className={cn("flex size-6 items-center justify-center rounded-full transition-colors", expired ? "bg-orange-50 text-orange-500" : "bg-muted text-muted-foreground hover:text-orange-500")}>
        <Timer className="size-3.5" weight={expired ? "fill" : "regular"} />
      </button>
    </HoverRow>
  );
}

/* ═══════════════════════════════════════════
   6: 하트 + 금지 아이콘
   ═══════════════════════════════════════════ */
function Style6() {
  const [liked, setLiked] = useState(false);
  const [expired, setExpired] = useState(false);
  return (
    <HoverRow liked={liked} expired={expired} onLike={() => setLiked(!liked)} onExpired={() => setExpired(!expired)}>
      <button onClick={() => setLiked(!liked)} className={cn("flex size-6 items-center justify-center rounded-full transition-colors", liked ? "bg-red-50 text-red-500" : "bg-muted text-muted-foreground hover:text-red-500")}>
        <Heart className="size-3.5" weight={liked ? "fill" : "regular"} />
      </button>
      <button onClick={() => setExpired(!expired)} className={cn("flex size-6 items-center justify-center rounded-full transition-colors", expired ? "bg-orange-50 text-orange-500" : "bg-muted text-muted-foreground hover:text-orange-500")}>
        <Prohibit className="size-3.5" weight={expired ? "fill" : "regular"} />
      </button>
    </HoverRow>
  );
}

/* ═══════════════════════════════════════════
   7: 작은 pill — 아이콘 + 한글 (색상 반전)
   ═══════════════════════════════════════════ */
function Style7() {
  const [liked, setLiked] = useState(false);
  const [expired, setExpired] = useState(false);
  return (
    <HoverRow liked={liked} expired={expired} onLike={() => setLiked(!liked)} onExpired={() => setExpired(!expired)}>
      <button onClick={() => setLiked(!liked)} className={cn("flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[9px] font-medium transition-colors", liked ? "bg-red-500 text-white" : "bg-muted text-muted-foreground hover:bg-red-50 hover:text-red-500")}>
        <Heart className="size-2.5" weight={liked ? "fill" : "regular"} />좋아요
      </button>
      <button onClick={() => setExpired(!expired)} className={cn("flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[9px] font-medium transition-colors", expired ? "bg-orange-500 text-white" : "bg-muted text-muted-foreground hover:bg-orange-50 hover:text-orange-500")}>
        <XCircle className="size-2.5" weight={expired ? "fill" : "regular"} />끝났어요
      </button>
    </HoverRow>
  );
}

/* ═══════════════════════════════════════════
   8: 원형 큰 버튼 (size-7)
   ═══════════════════════════════════════════ */
function Style8() {
  const [liked, setLiked] = useState(false);
  const [expired, setExpired] = useState(false);
  return (
    <HoverRow liked={liked} expired={expired} onLike={() => setLiked(!liked)} onExpired={() => setExpired(!expired)}>
      <button onClick={() => setLiked(!liked)} className={cn("flex size-7 items-center justify-center rounded-full shadow-sm transition-colors", liked ? "bg-red-500 text-white" : "bg-card text-muted-foreground ring-1 ring-border hover:text-red-500")}>
        <Heart className="size-4" weight={liked ? "fill" : "regular"} />
      </button>
      <button onClick={() => setExpired(!expired)} className={cn("flex size-7 items-center justify-center rounded-full shadow-sm transition-colors", expired ? "bg-orange-500 text-white" : "bg-card text-muted-foreground ring-1 ring-border hover:text-orange-500")}>
        <XCircle className="size-4" weight={expired ? "fill" : "regular"} />
      </button>
    </HoverRow>
  );
}

/* ═══════════════════════════════════════════ */

const STYLES = [
  { name: "1", label: "현재 — 원형 아이콘 (size-6)", desc: "♡ ✕ 회색 원형. active 시 배경색 변화", Component: Style1 },
  { name: "2", label: "pill 텍스트 (색상 반전)", desc: "[♡ 좋아요] [✕ 끝났어요]. active 시 빨강/주황 배경+흰 텍스트", Component: Style2 },
  { name: "3", label: "outline pill", desc: "테두리 pill. active 시 컬러 border+배경", Component: Style3 },
  { name: "4", label: "엄지 위/아래", desc: "👍 👎 직관적 투표", Component: Style4 },
  { name: "5", label: "🔥 불꽃 + ⏱ 타이머", desc: "좋아요=불꽃, 끝났어요=타이머 아이콘", Component: Style5 },
  { name: "6", label: "♡ 하트 + 🚫 금지", desc: "좋아요=하트, 끝났어요=금지 아이콘", Component: Style6 },
  { name: "7", label: "미니 pill (9px)", desc: "작은 rounded-md pill + 색상 반전", Component: Style7 },
  { name: "8", label: "원형 큰 버튼 + ring", desc: "size-7 원형 + ring border + shadow. active 시 색상 배경", Component: Style8 },
];

export default function HoverActionsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold">Hover 액션 — 버튼 디자인 비교</h1>
      <p className="mb-2 text-sm text-muted-foreground">공통: Style A (우측 슬라이드 오버레이). 버튼 디자인만 다릅니다.</p>
      <p className="mb-8 text-xs text-muted-foreground/60">각 영역에 마우스를 올리면 버튼이 등장합니다. 클릭하면 active 상태 확인.</p>

      <div className="flex flex-col gap-8">
        {STYLES.map(({ name, label, desc, Component }) => (
          <div key={name}>
            <div className="mb-3 flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{name}</span>
              <div>
                <p className="text-sm font-semibold">{label}</p>
                <p className="text-[10px] text-muted-foreground">{desc}</p>
              </div>
            </div>
            <div className="rounded-lg border border-dashed border-border bg-card px-4 py-3">
              <Component />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
