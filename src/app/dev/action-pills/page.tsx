"use client";

import { useState } from "react";
import { Heart, XCircle, ThumbsUp, ThumbsDown, SmileySad, Timer, Flame } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════
   1: 현재 — 아이콘 + 숫자/텍스트 pill
   ═══════════════════════════════════════════ */
function Style1() {
  const [liked, setLiked] = useState(false);
  const [expired, setExpired] = useState(false);
  return (
    <div className="flex items-center gap-1.5">
      <button onClick={() => setLiked(!liked)} className={cn("flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors", liked ? "bg-red-50 text-red-500" : "bg-muted text-muted-foreground hover:text-foreground")}>
        <Heart className="size-3" weight={liked ? "fill" : "regular"} />634
      </button>
      <button onClick={() => setExpired(!expired)} className={cn("flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors", expired ? "bg-orange-50 text-orange-500" : "bg-muted text-muted-foreground hover:text-foreground")}>
        <XCircle className="size-3" weight={expired ? "fill" : "regular"} />끝났어요
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════
   2: 아이콘만 pill (숫자/텍스트 없음)
   ═══════════════════════════════════════════ */
function Style2() {
  const [liked, setLiked] = useState(false);
  const [expired, setExpired] = useState(false);
  return (
    <div className="flex items-center gap-1.5">
      <button onClick={() => setLiked(!liked)} className={cn("flex size-6 items-center justify-center rounded-full transition-colors", liked ? "bg-red-50 text-red-500" : "bg-muted text-muted-foreground hover:text-red-500")}>
        <Heart className="size-3.5" weight={liked ? "fill" : "regular"} />
      </button>
      <button onClick={() => setExpired(!expired)} className={cn("flex size-6 items-center justify-center rounded-full transition-colors", expired ? "bg-orange-50 text-orange-500" : "bg-muted text-muted-foreground hover:text-orange-500")}>
        <XCircle className="size-3.5" weight={expired ? "fill" : "regular"} />
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════
   3: 좋아요 아이콘만 + 끝났어요 텍스트만
   ═══════════════════════════════════════════ */
function Style3() {
  const [liked, setLiked] = useState(false);
  const [expired, setExpired] = useState(false);
  return (
    <div className="flex items-center gap-1.5">
      <button onClick={() => setLiked(!liked)} className={cn("flex size-6 items-center justify-center rounded-full transition-colors", liked ? "bg-red-50 text-red-500" : "bg-muted text-muted-foreground hover:text-red-500")}>
        <Heart className="size-3.5" weight={liked ? "fill" : "regular"} />
      </button>
      <button onClick={() => setExpired(!expired)} className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-medium transition-colors", expired ? "bg-orange-50 text-orange-500" : "bg-muted text-muted-foreground hover:text-orange-500")}>
        끝났어요
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════
   4: 좋아요 pill + 끝났어요 outline
   ═══════════════════════════════════════════ */
function Style4() {
  const [liked, setLiked] = useState(false);
  const [expired, setExpired] = useState(false);
  return (
    <div className="flex items-center gap-1.5">
      <button onClick={() => setLiked(!liked)} className={cn("flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors", liked ? "bg-red-500 text-white" : "bg-muted text-muted-foreground hover:text-foreground")}>
        <Heart className="size-3" weight={liked ? "fill" : "regular"} />좋아요
      </button>
      <button onClick={() => setExpired(!expired)} className={cn("flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium transition-colors", expired ? "border-orange-300 bg-orange-50 text-orange-500" : "border-border text-muted-foreground hover:text-orange-500 hover:border-orange-200")}>
        <XCircle className="size-3" weight={expired ? "fill" : "regular"} />끝났어요
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════
   5: 엄지 위/아래 스타일
   ═══════════════════════════════════════════ */
function Style5() {
  const [liked, setLiked] = useState(false);
  const [expired, setExpired] = useState(false);
  return (
    <div className="flex items-center gap-1.5">
      <button onClick={() => setLiked(!liked)} className={cn("flex size-6 items-center justify-center rounded-full transition-colors", liked ? "bg-blue-50 text-blue-500" : "bg-muted text-muted-foreground hover:text-blue-500")}>
        <ThumbsUp className="size-3.5" weight={liked ? "fill" : "regular"} />
      </button>
      <button onClick={() => setExpired(!expired)} className={cn("flex size-6 items-center justify-center rounded-full transition-colors", expired ? "bg-orange-50 text-orange-500" : "bg-muted text-muted-foreground hover:text-orange-500")}>
        <ThumbsDown className="size-3.5" weight={expired ? "fill" : "regular"} />
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════
   6: 좋아요 ♡ + 끝났어요 타이머
   ═══════════════════════════════════════════ */
function Style6() {
  const [liked, setLiked] = useState(false);
  const [expired, setExpired] = useState(false);
  return (
    <div className="flex items-center gap-1.5">
      <button onClick={() => setLiked(!liked)} className={cn("flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium transition-colors", liked ? "bg-red-500 text-white" : "bg-muted text-muted-foreground hover:text-red-500")}>
        <Heart className="size-3" weight={liked ? "fill" : "regular"} />{liked ? "좋아요!" : "좋아요"}
      </button>
      <button onClick={() => setExpired(!expired)} className={cn("flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium transition-colors", expired ? "bg-orange-500 text-white" : "bg-muted text-muted-foreground hover:text-orange-500")}>
        <Timer className="size-3" weight={expired ? "fill" : "regular"} />{expired ? "종료됨" : "끝났어요"}
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════
   7: 미니 — 아이콘 + 텍스트 초소형
   ═══════════════════════════════════════════ */
function Style7() {
  const [liked, setLiked] = useState(false);
  const [expired, setExpired] = useState(false);
  return (
    <div className="flex items-center gap-1">
      <button onClick={() => setLiked(!liked)} className={cn("flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[9px] font-medium transition-colors", liked ? "bg-red-50 text-red-500" : "bg-muted text-muted-foreground hover:text-red-500")}>
        <Heart className="size-2.5" weight={liked ? "fill" : "regular"} />좋아요
      </button>
      <button onClick={() => setExpired(!expired)} className={cn("flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[9px] font-medium transition-colors", expired ? "bg-orange-50 text-orange-500" : "bg-muted text-muted-foreground hover:text-orange-500")}>
        <XCircle className="size-2.5" weight={expired ? "fill" : "regular"} />끝났어요
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════ */

const STYLES = [
  { name: "1", label: "현재 — 숫자/텍스트 포함", desc: "♡ 634 · ✕ 끝났어요", Component: Style1 },
  { name: "2", label: "아이콘만 원형", desc: "♡ ✕ — 숫자/텍스트 없이 아이콘만", Component: Style2 },
  { name: "3", label: "좋아요 아이콘 + 끝났어요 텍스트", desc: "♡ 원형 + [끝났어요] 텍스트 pill", Component: Style3 },
  { name: "4", label: "좋아요 텍스트 + 끝났어요 outline", desc: "[♡ 좋아요] fill + [✕ 끝났어요] outline", Component: Style4 },
  { name: "5", label: "엄지 위/아래", desc: "👍 👎 — 직관적 투표 느낌", Component: Style5 },
  { name: "6", label: "텍스트 변화 + 색상 반전", desc: "클릭 전: 회색 pill → 클릭 후: 색상 배경 + 흰 텍스트", Component: Style6 },
  { name: "7", label: "미니 — 9px 초소형", desc: "가장 작은 크기. 텍스트 포함이지만 최소", Component: Style7 },
];

export default function ActionPillsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold">좋아요 / 끝났어요 버튼 디자인</h1>
      <p className="mb-2 text-sm text-muted-foreground">숫자 없이 액션 버튼만. 각 버튼 클릭 시 active 상태 확인.</p>
      <p className="mb-8 text-xs text-muted-foreground/60">좋아요 수는 메타줄에 이미 표시되므로 pill에서는 제거.</p>

      <div className="flex flex-col gap-8">
        {STYLES.map(({ name, label, desc, Component }) => (
          <div key={name} className="flex items-center gap-6">
            <div className="w-48 shrink-0">
              <div className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{name}</span>
                <p className="text-sm font-semibold">{label}</p>
              </div>
              <p className="mt-0.5 pl-8 text-[10px] text-muted-foreground">{desc}</p>
            </div>
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border bg-card px-6 py-4">
              <Component />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
