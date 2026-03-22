"use client";

import { useState } from "react";
import { Heart, ChatCircle, XCircle, Flag, Fire, PaperPlaneTilt, ArrowBendDownRight, X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/* ─── Mock data ─── */

const DEAL = {
  title: "[단독특가] Apple 에어팟 프로 2세대 (USB-C) — 2026년 역대 최저가",
  dealPrice: 199000,
  originalPrice: 289000,
  discountRate: 31,
  nickname: "테크딜러",
  store: "쿠팡",
  likeCount: 124,
  commentCount: 5,
};

const COMMENTS = [
  { id: 1, nickname: "딜헌터", text: "이거 역대 최저가 맞나요?", time: "1시간 전", replies: [
    { id: 2, nickname: "가격비교왕", text: "맞아요, 카드 할인 추가하면 18만원대도 가능", time: "45분 전" },
    { id: 3, nickname: "딜헌터", text: "오 감사합니다! 바로 질렀어요", time: "30분 전" },
  ]},
  { id: 4, nickname: "음향덕후", text: "ANC 성능 에어팟맥스 빼면 이게 최고입니다", time: "20분 전", replies: [
    { id: 5, nickname: "출퇴근러", text: "지하철에서 써봤는데 진짜 조용해짐", time: "10분 전" },
  ]},
];

function formatPrice(n: number) { return n.toLocaleString("ko-KR"); }

/* ─── Shared: Deal Card (compact, no comments) ─── */

function DealCard({ active, onCommentClick }: { active?: boolean; onCommentClick?: () => void }) {
  return (
    <div className={cn("rounded-xl border bg-card transition-all", active ? "border-primary shadow-md" : "border-border")}>
      <div className="flex gap-3 p-2.5 sm:p-3">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted sm:size-24">
          <div className="flex size-full items-center justify-center bg-foreground text-xs font-bold text-background">핫딜닷쿨</div>
          <span className="absolute left-1 top-1 flex items-center gap-0.5 rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
            <Fire className="size-2.5" weight="fill" />인기
          </span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug">{DEAL.title}</h3>
          <div className="mt-1 flex flex-col gap-1">
            <div className="flex items-end justify-between">
              <span className="flex items-baseline gap-1.5">
                <span className="text-sm font-bold text-red-500">{DEAL.discountRate}%</span>
                <span className="text-base font-bold">{formatPrice(DEAL.dealPrice)}원</span>
                <span className="text-xs text-muted-foreground line-through">{formatPrice(DEAL.originalPrice)}원</span>
              </span>
              <span className="shrink-0 text-[10px] text-muted-foreground">{DEAL.nickname} · {DEAL.store} · 2시간 전</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <button className="flex items-center gap-0.5 hover:text-red-500"><Heart className="size-3" />{DEAL.likeCount}</button>
              <button onClick={onCommentClick} className={cn("flex items-center gap-0.5 hover:text-foreground", active && "text-primary font-semibold")}>
                <ChatCircle className="size-3" weight={active ? "fill" : "regular"} />{DEAL.commentCount}
              </button>
              <button className="flex items-center gap-0.5 hover:text-orange-500"><XCircle className="size-3" />끝났어요</button>
              <button className="ml-auto flex items-center gap-0.5 hover:text-red-500"><Flag className="size-3" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Shared: Comment Thread ─── */

function CommentThread({ compact }: { compact?: boolean }) {
  return (
    <div className={cn("flex flex-col", compact ? "gap-2.5" : "gap-3")}>
      {COMMENTS.map((c) => (
        <div key={c.id}>
          <div className={cn("flex items-start gap-2", compact ? "text-[11px]" : "text-xs")}>
            <div className={cn("flex shrink-0 items-center justify-center rounded-full bg-muted font-bold", compact ? "size-5 text-[9px]" : "size-6 text-[10px]")}>
              {c.nickname.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-1.5">
                <span className="font-semibold">{c.nickname}</span>
                <span className="text-[10px] text-muted-foreground/60">{c.time}</span>
              </div>
              <p className="mt-0.5 text-muted-foreground">{c.text}</p>
              <button className="mt-0.5 text-[10px] text-muted-foreground/60 hover:text-foreground">답글</button>
            </div>
          </div>
          {c.replies.length > 0 && (
            <div className={cn("ml-7 mt-1.5 flex flex-col gap-1.5 border-l-2 border-border pl-2.5", compact && "ml-6")}>
              {c.replies.map((r) => (
                <div key={r.id} className={cn("flex items-start gap-2", compact ? "text-[11px]" : "text-xs")}>
                  <div className={cn("flex shrink-0 items-center justify-center rounded-full bg-muted font-bold", compact ? "size-4 text-[8px]" : "size-5 text-[9px]")}>
                    {r.nickname.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-semibold">{r.nickname}</span>
                      <span className="text-[10px] text-muted-foreground/60">{r.time}</span>
                    </div>
                    <p className="mt-0.5 text-muted-foreground">{r.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Input */}
      <div className="flex items-center gap-2">
        <input
          placeholder="댓글을 입력하세요..."
          className="h-7 flex-1 rounded-md border border-input bg-transparent px-2.5 text-xs outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/30"
        />
        <button className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <PaperPlaneTilt className="size-3" />
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   A: 현재 — 카드 아래 아코디언
   ═══════════════════════════════════════════════════════════ */

function StyleA() {
  const [open, setOpen] = useState(true);
  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-xl border border-border bg-card">
        <div className="flex gap-3 p-2.5 sm:p-3">
          <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted sm:size-24">
            <div className="flex size-full items-center justify-center bg-foreground text-xs font-bold text-background">핫딜닷쿨</div>
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-between">
            <h3 className="line-clamp-2 text-base font-semibold leading-snug">{DEAL.title}</h3>
            <div className="mt-1 flex flex-col gap-1">
              <div className="flex items-end justify-between">
                <span className="flex items-baseline gap-1.5">
                  <span className="text-sm font-bold text-red-500">{DEAL.discountRate}%</span>
                  <span className="text-base font-bold">{formatPrice(DEAL.dealPrice)}원</span>
                </span>
                <span className="text-[10px] text-muted-foreground">{DEAL.nickname} · {DEAL.store} · 2시간 전</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-0.5"><Heart className="size-3" />{DEAL.likeCount}</span>
                <button onClick={() => setOpen(!open)} className={cn("flex items-center gap-0.5", open && "text-primary font-semibold")}>
                  <ChatCircle className="size-3" weight={open ? "fill" : "regular"} />{DEAL.commentCount}
                </button>
                <span className="flex items-center gap-0.5"><XCircle className="size-3" />끝났어요</span>
              </div>
            </div>
          </div>
        </div>
        {open && (
          <div className="border-t border-border px-3 py-3 sm:px-4">
            <CommentThread />
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   B: 우측 사이드 패널 — 고정형
   카드 클릭하면 오른쪽에 댓글 패널 열림
   ═══════════════════════════════════════════════════════════ */

function StyleB() {
  const [open, setOpen] = useState(true);
  return (
    <div className="flex gap-4">
      <div className="flex-1 max-w-3xl flex flex-col gap-3">
        <DealCard active={open} onCommentClick={() => setOpen(!open)} />
        <DealCard />
        <DealCard />
      </div>
      {open && (
        <div className="w-[320px] shrink-0 rounded-xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-semibold">댓글 {DEAL.commentCount}</h4>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground"><X className="size-4" /></button>
          </div>
          <CommentThread compact />
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   C: 우측 사이드 패널 — sticky
   스크롤해도 댓글 패널 고정
   ═══════════════════════════════════════════════════════════ */

function StyleC() {
  const [open, setOpen] = useState(true);
  return (
    <div className="flex gap-4">
      <div className="flex-1 max-w-3xl flex flex-col gap-3">
        <DealCard active={open} onCommentClick={() => setOpen(!open)} />
        <DealCard />
        <DealCard />
        <DealCard />
        <DealCard />
      </div>
      {open && (
        <div className="w-[320px] shrink-0">
          <div className="sticky top-4 rounded-xl border border-border bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-semibold">댓글 {DEAL.commentCount}</h4>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground"><X className="size-4" /></button>
            </div>
            <p className="mb-3 line-clamp-1 text-xs text-muted-foreground">{DEAL.title}</p>
            <CommentThread compact />
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   D: 우측 슬라이드 오버레이
   화면 오른쪽에서 슬라이드 인
   ═══════════════════════════════════════════════════════════ */

function StyleD() {
  const [open, setOpen] = useState(true);
  return (
    <div className="relative">
      <div className="mx-auto max-w-3xl flex flex-col gap-3">
        <DealCard active={open} onCommentClick={() => setOpen(!open)} />
        <DealCard />
        <DealCard />
      </div>
      {open && (
        <div className="fixed right-0 top-0 z-50 flex h-full w-[360px] flex-col border-l border-border bg-card shadow-xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h4 className="text-sm font-semibold">댓글 {DEAL.commentCount}</h4>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground"><X className="size-4" /></button>
          </div>
          <p className="border-b border-border px-4 py-2 text-xs text-muted-foreground line-clamp-2">{DEAL.title}</p>
          <div className="flex-1 overflow-y-auto px-4 py-3">
            <CommentThread compact />
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Page
   ═══════════════════════════════════════════════════════════ */

const STYLES = [
  { name: "A", label: "현재 — 카드 아래 아코디언", desc: "댓글이 카드 높이를 늘림. 피드 흐름이 끊김", Component: StyleA },
  { name: "B", label: "우측 사이드 패널", desc: "카드 옆에 댓글 패널. 피드 흐름 유지. 다른 카드 클릭하면 전환", Component: StyleB },
  { name: "C", label: "우측 sticky 패널", desc: "스크롤해도 댓글이 따라옴. 제목 표시로 어떤 딜인지 확인 가능", Component: StyleC },
  { name: "D", label: "우측 슬라이드 오버레이", desc: "화면 오른쪽에서 밀려나옴. 독립 스크롤. 모바일 시트 느낌", Component: StyleD },
];

export default function CommentLayoutPage() {
  const [active, setActive] = useState<string | null>(null);
  const ActiveComponent = STYLES.find((s) => s.name === active)?.Component;

  return (
    <div className="px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-2 text-2xl font-bold">댓글 레이아웃 비교</h1>
        <p className="mb-2 text-sm text-muted-foreground">
          웹 데스크탑에서 우측 공간을 활용한 댓글 위치 비교입니다. 모바일에서는 모두 현재 방식(아코디언) 유지.
        </p>
        <p className="mb-8 text-xs text-muted-foreground/60">
          카드를 클릭하면 해당 레이아웃을 실제로 볼 수 있습니다.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {STYLES.map(({ name, label, desc }) => (
            <button
              key={name}
              onClick={() => setActive(active === name ? null : name)}
              className={cn(
                "flex items-start gap-4 rounded-xl border bg-card p-5 text-left transition-all hover:border-primary/40 hover:shadow-md",
                active === name ? "border-primary shadow-md" : "border-border",
              )}
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{name}</span>
              <div>
                <p className="text-sm font-semibold">{label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {ActiveComponent && (
        <div className="mt-8">
          <div className="mx-auto mb-4 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {active}
              </span>
              <p className="text-sm font-semibold">{STYLES.find((s) => s.name === active)?.label}</p>
            </div>
          </div>
          <ActiveComponent />
        </div>
      )}
    </div>
  );
}
