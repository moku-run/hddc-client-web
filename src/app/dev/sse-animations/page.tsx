"use client";

import { useState } from "react";
import { Heart, CursorClick, ChatCircle } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { FireLogo } from "@/components/icons/fire-logo";

/* ─── Actual desktop card layout (Style F + B shadow + border-t) ─── */

function DesktopCard({ meta, commentStrip }: { meta: React.ReactNode; commentStrip?: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-r-xl border-t border-border/50 bg-card pr-10 shadow-md">
      <div className="group flex overflow-hidden">
        <div className="relative min-h-24 w-24 shrink-0 self-stretch bg-foreground text-base font-bold text-background flex items-center justify-center">
          핫딜닷쿨
          <span className="absolute left-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-500 shadow-sm">
            <FireLogo className="size-4" bgColor="white" />
          </span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between px-3 py-2.5">
          <p className="truncate text-base font-semibold">쿠팡 로켓와우 멤버십 첫 달 무료</p>
          <div className="mt-1 flex flex-col gap-1">
            <span className="flex items-baseline gap-1.5">
              <span className="text-sm font-bold text-red-500">100%</span>
              <span className="text-base font-bold">0원</span>
              <span className="text-xs text-muted-foreground line-through">7,890원</span>
            </span>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              {meta}
              <span>HDDC · 쿠팡 · 3일 전</span>
            </div>
          </div>
        </div>
      </div>
      {/* Right comment strip */}
      {commentStrip ?? (
        <div className="absolute right-0 top-0 flex h-full w-10 flex-col items-center justify-center gap-1 rounded-r-xl border-l border-border/50 bg-muted/30 text-muted-foreground">
          <ChatCircle className="size-4" />
          <span className="text-xs font-medium">152</span>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Section 1: 댓글 NEW 라벨 (댓글 스트립에 표시)
   ═══════════════════════════════════════════════════════════ */

function CommentStripA({ count, isNew }: { count: number; isNew: boolean }) {
  return (
    <div className="absolute right-0 top-0 flex h-full w-10 flex-col items-center justify-center gap-1 rounded-r-xl border-l border-border/50 bg-muted/30 text-muted-foreground">
      <span className="relative">
        <ChatCircle className="size-4" />
        {isNew && <span className="absolute -right-1 -top-1 size-2 rounded-full bg-red-500" />}
      </span>
      <span className="text-xs font-medium">{count}</span>
    </div>
  );
}

function CommentStripB({ count, isNew }: { count: number; isNew: boolean }) {
  return (
    <div className={cn(
      "absolute right-0 top-0 flex h-full w-10 flex-col items-center justify-center gap-1 rounded-r-xl border-l transition-colors",
      isNew ? "border-primary/50 bg-primary/10 text-primary" : "border-border/50 bg-muted/30 text-muted-foreground",
    )}>
      <ChatCircle className="size-4" weight={isNew ? "fill" : "regular"} />
      <span className="text-xs font-medium">{count}</span>
    </div>
  );
}

function CommentStripC({ count, isNew }: { count: number; isNew: boolean }) {
  return (
    <div className="absolute right-0 top-0 flex h-full w-10 flex-col items-center justify-center gap-1 rounded-r-xl border-l border-border/50 bg-muted/30 text-muted-foreground">
      <ChatCircle className="size-4" />
      <span className="text-xs font-medium">{count}</span>
      {isNew && <span className="rounded bg-red-500 px-1 text-[7px] font-bold text-white">NEW</span>}
    </div>
  );
}

function CommentStripD({ count, isNew }: { count: number; isNew: boolean }) {
  return (
    <div className="absolute right-0 top-0 flex h-full w-10 flex-col items-center justify-center gap-1 rounded-r-xl border-l border-border/50 bg-muted/30 text-muted-foreground">
      <ChatCircle className={cn("size-4 transition-all duration-300", isNew && "text-primary animate-bounce")} weight={isNew ? "fill" : "regular"} />
      <span className={cn("text-xs font-medium transition-colors", isNew && "font-bold text-primary")}>{count}</span>
    </div>
  );
}

function CommentStripE({ count, isNew }: { count: number; isNew: boolean }) {
  return (
    <div className="absolute right-0 top-0 flex h-full w-10 flex-col items-center justify-center gap-1 rounded-r-xl border-l border-border/50 bg-muted/30 text-muted-foreground">
      <ChatCircle className="size-4" />
      <span className="text-xs font-medium">{count}</span>
      {isNew && <span className="absolute right-1 top-1 size-1.5 rounded-full bg-primary animate-pulse" />}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Section 2: 클릭수 애니메이션
   ═══════════════════════════════════════════════════════════ */

function ClickMetaA({ count, flash }: { count: number; flash: boolean }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn("inline-flex items-center gap-0.5 rounded px-0.5 transition-colors duration-500", flash && "bg-blue-500/20 text-blue-600")}>
        <CursorClick className="size-2.5" />{count}
      </span>
      <span className="inline-flex items-center gap-0.5"><Heart className="size-2.5" />634</span>
    </span>
  );
}

function ClickMetaB({ count, flash }: { count: number; flash: boolean }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="relative inline-flex items-center gap-0.5">
        <CursorClick className={cn("size-2.5 transition-transform duration-300", flash && "scale-150 text-blue-500")} />{count}
        {flash && <span className="absolute -right-3 -top-2 text-[9px] font-bold text-blue-500 animate-in fade-in zoom-in">+1</span>}
      </span>
      <span className="inline-flex items-center gap-0.5"><Heart className="size-2.5" />634</span>
    </span>
  );
}

function ClickMetaC({ count, flash }: { count: number; flash: boolean }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn("inline-flex items-center gap-0.5 rounded-full px-1.5 transition-all duration-500", flash ? "bg-blue-500 text-white" : "")}>
        <CursorClick className="size-2.5" />{count}
      </span>
      <span className="inline-flex items-center gap-0.5"><Heart className="size-2.5" />634</span>
    </span>
  );
}

function ClickMetaD({ count, flash }: { count: number; flash: boolean }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="inline-flex items-center gap-0.5">
        <CursorClick className="size-2.5" />
        <span className={cn("transition-all duration-300", flash && "font-bold text-blue-500")}>{count}</span>
      </span>
      <span className="inline-flex items-center gap-0.5"><Heart className="size-2.5" />634</span>
    </span>
  );
}

function ClickMetaE({ count, flash }: { count: number; flash: boolean }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn("inline-flex items-center gap-0.5 border-b-2 pb-px transition-all duration-500", flash ? "border-blue-500 text-blue-500" : "border-transparent")}>
        <CursorClick className="size-2.5" />{count}
      </span>
      <span className="inline-flex items-center gap-0.5"><Heart className="size-2.5" />634</span>
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════
   Section 3: 좋아요수 애니메이션
   ═══════════════════════════════════════════════════════════ */

function LikeMetaA({ count, flash }: { count: number; flash: boolean }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="inline-flex items-center gap-0.5"><CursorClick className="size-2.5" />330</span>
      <span className={cn("inline-flex items-center gap-0.5 rounded px-0.5 transition-colors duration-500", flash && "bg-red-500/20 text-red-500")}>
        <Heart className="size-2.5" />{count}
      </span>
    </span>
  );
}

function LikeMetaB({ count, flash }: { count: number; flash: boolean }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="inline-flex items-center gap-0.5"><CursorClick className="size-2.5" />330</span>
      <span className="relative inline-flex items-center gap-0.5">
        <Heart className={cn("size-2.5 transition-all duration-300", flash && "scale-150 text-red-500")} weight={flash ? "fill" : "regular"} />{count}
        {flash && <span className="absolute -right-3 -top-2 text-[9px] font-bold text-red-500 animate-in fade-in zoom-in">+1</span>}
      </span>
    </span>
  );
}

function LikeMetaC({ count, flash }: { count: number; flash: boolean }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="inline-flex items-center gap-0.5"><CursorClick className="size-2.5" />330</span>
      <span className={cn("inline-flex items-center gap-0.5 rounded-full px-1.5 transition-all duration-500", flash ? "bg-red-500 text-white" : "")}>
        <Heart className="size-2.5" weight={flash ? "fill" : "regular"} />{count}
      </span>
    </span>
  );
}

function LikeMetaD({ count, flash }: { count: number; flash: boolean }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="inline-flex items-center gap-0.5"><CursorClick className="size-2.5" />330</span>
      <span className="inline-flex items-center gap-0.5">
        <Heart className={cn("size-2.5 transition-all duration-300", flash && "text-red-500")} weight={flash ? "fill" : "regular"} />
        <span className={cn("transition-all duration-300", flash && "font-bold text-red-500")}>{count}</span>
      </span>
    </span>
  );
}

function LikeMetaE({ count, flash }: { count: number; flash: boolean }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="inline-flex items-center gap-0.5"><CursorClick className="size-2.5" />330</span>
      <span className={cn("inline-flex items-center gap-0.5 border-b-2 pb-px transition-all duration-500", flash ? "border-red-500 text-red-500" : "border-transparent")}>
        <Heart className="size-2.5" weight={flash ? "fill" : "regular"} />{count}
      </span>
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════
   Interactive wrappers
   ═══════════════════════════════════════════════════════════ */

function CommentDemo({ name, label, Strip }: { name: string; label: string; Strip: React.ComponentType<{ count: number; isNew: boolean }> }) {
  const [count, setCount] = useState(152);
  const [isNew, setIsNew] = useState(false);

  function trigger() {
    setCount((p) => p + 1);
    setIsNew(true);
    setTimeout(() => setIsNew(false), 3000);
  }

  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-6 items-center justify-center rounded-full bg-primary px-2 text-[10px] font-bold text-primary-foreground">{name}</span>
        <span className="text-xs font-semibold">{label}</span>
        <button onClick={trigger} className="rounded bg-primary px-2 py-0.5 text-[10px] text-primary-foreground">+댓글</button>
      </div>
      <DesktopCard
        meta={
          <span className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-0.5"><CursorClick className="size-2.5" />330</span>
            <span className="inline-flex items-center gap-0.5"><Heart className="size-2.5" />634</span>
          </span>
        }
        commentStrip={<Strip count={count} isNew={isNew} />}
      />
    </div>
  );
}

function MetaDemo({ name, label, Meta, buttonLabel, buttonColor }: { name: string; label: string; Meta: React.ComponentType<{ count: number; flash: boolean }>; buttonLabel: string; buttonColor: string }) {
  const [count, setCount] = useState(330);
  const [flash, setFlash] = useState(false);

  function trigger() {
    setCount((p) => p + 1);
    setFlash(true);
    setTimeout(() => setFlash(false), 800);
  }

  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-6 items-center justify-center rounded-full bg-primary px-2 text-[10px] font-bold text-primary-foreground">{name}</span>
        <span className="text-xs font-semibold">{label}</span>
        <button onClick={trigger} className={cn("rounded px-2 py-0.5 text-[10px] text-white", buttonColor)}>{buttonLabel}</button>
      </div>
      <DesktopCard meta={<Meta count={count} flash={flash} />} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Page
   ═══════════════════════════════════════════════════════════ */

export default function SseAnimationsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-8">
        <h1 className="mb-2 text-2xl font-bold">SSE 실시간 애니메이션 비교</h1>
        <p className="mb-8 text-sm text-muted-foreground">
          실제 데스크탑 카드 레이아웃 기준. 버튼을 눌러서 확인하세요.
        </p>

        <h2 className="mb-4 text-lg font-bold">💬 댓글 NEW 라벨 (우측 댓글 스트립)</h2>
        <CommentDemo name="A" label="빨간 도트" Strip={CommentStripA} />
        <CommentDemo name="B" label="스트립 전체 primary 전환" Strip={CommentStripB} />
        <CommentDemo name="C" label="NEW 텍스트 배지" Strip={CommentStripC} />
        <CommentDemo name="D" label="아이콘 fill + 바운스 + 숫자 bold" Strip={CommentStripD} />
        <CommentDemo name="E" label="우측 상단 pulse 도트" Strip={CommentStripE} />

        <div className="my-8 h-px bg-border" />

        <h2 className="mb-4 text-lg font-bold">👆 클릭수 애니메이션</h2>
        <MetaDemo name="A" label="배경 flash (파란색)" Meta={ClickMetaA} buttonLabel="+클릭" buttonColor="bg-blue-500" />
        <MetaDemo name="B" label="아이콘 확대 + +1 팝업" Meta={ClickMetaB} buttonLabel="+클릭" buttonColor="bg-blue-500" />
        <MetaDemo name="C" label="pill 반전 (파란 배경)" Meta={ClickMetaC} buttonLabel="+클릭" buttonColor="bg-blue-500" />
        <MetaDemo name="D" label="숫자만 볼드 + 색상" Meta={ClickMetaD} buttonLabel="+클릭" buttonColor="bg-blue-500" />
        <MetaDemo name="E" label="하단 언더라인" Meta={ClickMetaE} buttonLabel="+클릭" buttonColor="bg-blue-500" />

        <div className="my-8 h-px bg-border" />

        <h2 className="mb-4 text-lg font-bold">❤️ 좋아요수 애니메이션</h2>
        <MetaDemo name="A" label="배경 flash (빨간색)" Meta={LikeMetaA} buttonLabel="+좋아요" buttonColor="bg-red-500" />
        <MetaDemo name="B" label="하트 확대 fill + +1 팝업" Meta={LikeMetaB} buttonLabel="+좋아요" buttonColor="bg-red-500" />
        <MetaDemo name="C" label="pill 반전 (빨간 배경)" Meta={LikeMetaC} buttonLabel="+좋아요" buttonColor="bg-red-500" />
        <MetaDemo name="D" label="하트 fill + 숫자 볼드" Meta={LikeMetaD} buttonLabel="+좋아요" buttonColor="bg-red-500" />
        <MetaDemo name="E" label="하단 언더라인 빨간" Meta={LikeMetaE} buttonLabel="+좋아요" buttonColor="bg-red-500" />
      </div>
    </div>
  );
}
