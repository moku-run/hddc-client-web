"use client";

import { useState } from "react";
import { ChatCircle } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/* ─── Shared ─── */

function Avatar({ nick, color }: { nick: string; color: string }) {
  return (
    <div className={cn("flex size-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white", color)}>
      {nick.charAt(0)}
    </div>
  );
}

function Comment({ nick, text, time, color }: { nick: string; text: string; time: string; color: string }) {
  return (
    <div className="flex items-start gap-2 text-xs">
      <Avatar nick={nick} color={color} />
      <div>
        <span className="font-semibold">{nick}</span>
        <span className="ml-1.5 text-[10px] text-muted-foreground">{time}</span>
        <p className="mt-0.5 text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}

function CommentList() {
  return (
    <>
      <Comment nick="테크딜러" text="이거 진짜 역대급이네요" time="5분 전" color="bg-blue-500" />
      <Comment nick="패션헌터" text="쿠팡에서 구매했는데 배송 빠릅니다" time="3분 전" color="bg-orange-500" />
      <Comment nick="나" text="방금 내가 쓴 댓글" time="방금 전" color="bg-primary" />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   A: "이전 댓글 더보기" + 빨간 뱃지 숫자
   ═══════════════════════════════════════════════════════════ */

function StyleA({ count }: { count: number }) {
  return (
    <button className="flex w-full items-center justify-center gap-1.5 rounded-md bg-muted py-1.5 text-[10px] font-medium text-muted-foreground transition-colors hover:text-foreground">
      이전 댓글 더보기
      {count > 0 && (
        <span className="flex size-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white">{count}</span>
      )}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════
   B: "이전 댓글 더보기" + 인라인 텍스트
   ═══════════════════════════════════════════════════════════ */

function StyleB({ count }: { count: number }) {
  return (
    <button className="flex w-full items-center justify-center gap-1 rounded-md bg-muted py-1.5 text-[10px] font-medium text-muted-foreground transition-colors hover:text-foreground">
      이전 댓글 더보기
      {count > 0 && (
        <span className="text-primary font-semibold">(+{count} new)</span>
      )}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════
   C: "이전 댓글 더보기" + primary pill
   ═══════════════════════════════════════════════════════════ */

function StyleC({ count }: { count: number }) {
  return (
    <button className="flex w-full items-center justify-center gap-1.5 rounded-md bg-muted py-1.5 text-[10px] font-medium text-muted-foreground transition-colors hover:text-foreground">
      이전 댓글 더보기
      {count > 0 && (
        <span className="rounded-full bg-primary px-1.5 py-0 text-[8px] font-bold text-primary-foreground">+{count}</span>
      )}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════
   D: 버튼 전체가 primary로 변경
   ═══════════════════════════════════════════════════════════ */

function StyleD({ count }: { count: number }) {
  return count > 0 ? (
    <button className="flex w-full items-center justify-center gap-1.5 rounded-md bg-primary py-1.5 text-[10px] font-medium text-primary-foreground transition-colors hover:bg-primary/90">
      <ChatCircle className="size-3" />새 댓글 {count}개 포함 · 더보기
    </button>
  ) : (
    <button className="flex w-full items-center justify-center rounded-md bg-muted py-1.5 text-[10px] font-medium text-muted-foreground transition-colors hover:text-foreground">
      이전 댓글 더보기
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════
   E: 빨간 도트 + 텍스트 변경
   ═══════════════════════════════════════════════════════════ */

function StyleE({ count }: { count: number }) {
  return (
    <button className="relative flex w-full items-center justify-center rounded-md bg-muted py-1.5 text-[10px] font-medium text-muted-foreground transition-colors hover:text-foreground">
      {count > 0 ? `새 댓글 ${count}개 · 이전 댓글 더보기` : "이전 댓글 더보기"}
      {count > 0 && <span className="absolute right-2 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-red-500" />}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════
   F: 분리형 — 더보기 버튼 + 새 댓글 배너 따로
   ═══════════════════════════════════════════════════════════ */

function StyleF({ count }: { count: number }) {
  return (
    <div className="flex flex-col gap-1.5">
      <button className="flex w-full items-center justify-center rounded-md bg-muted py-1.5 text-[10px] font-medium text-muted-foreground transition-colors hover:text-foreground">
        이전 댓글 더보기
      </button>
      {count > 0 && (
        <button className="flex w-full items-center justify-center gap-1 rounded-full border border-primary/30 py-1.5 text-[10px] font-medium text-primary transition-colors hover:bg-primary/10">
          <ChatCircle className="size-3" />새 댓글 {count}개
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Page
   ═══════════════════════════════════════════════════════════ */

const STYLES = [
  { name: "A", label: "빨간 원형 숫자 뱃지", Component: StyleA },
  { name: "B", label: "인라인 (+N new) 텍스트", Component: StyleB },
  { name: "C", label: "primary pill 뱃지 (+N)", Component: StyleC },
  { name: "D", label: "버튼 전체 primary 변환", Component: StyleD },
  { name: "E", label: "텍스트 변경 + 빨간 도트", Component: StyleE },
  { name: "F", label: "분리형 — 더보기 + 새 댓글 배너", Component: StyleF },
];

export default function CommentNewLabelPage() {
  const [newCount, setNewCount] = useState(0);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-xl px-6 py-8">
        <h1 className="mb-2 text-2xl font-bold">"이전 댓글 더보기" + 새 댓글 알림</h1>
        <p className="mb-4 text-sm text-muted-foreground">
          SSE로 새 댓글이 도착하면 "이전 댓글 더보기" 버튼에 어떻게 표시할지 비교합니다.
        </p>

        <div className="mb-8 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">새 댓글 수:</span>
          <button onClick={() => setNewCount(0)} className={cn("rounded-full px-3 py-1 text-xs font-medium", newCount === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")} >0개</button>
          <button onClick={() => setNewCount(2)} className={cn("rounded-full px-3 py-1 text-xs font-medium", newCount === 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")} >2개</button>
          <button onClick={() => setNewCount(5)} className={cn("rounded-full px-3 py-1 text-xs font-medium", newCount === 5 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")} >5개</button>
          <button onClick={() => setNewCount(12)} className={cn("rounded-full px-3 py-1 text-xs font-medium", newCount === 12 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")} >12개</button>
        </div>

        {STYLES.map(({ name, label, Component }) => (
          <section key={name} className="mb-10">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{name}</span>
              <h2 className="text-sm font-semibold">{label}</h2>
            </div>
            <div className="rounded-xl border border-border bg-card">
              <div className="border-b border-border px-3 py-2">
                <span className="text-xs font-semibold">댓글 5</span>
              </div>
              <div className="flex flex-col gap-3 px-3 py-3">
                <CommentList />
                <Component count={newCount} />
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
