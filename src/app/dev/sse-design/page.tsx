"use client";

import { useState } from "react";
import { Heart, ChatCircle, Fire, CursorClick, XCircle, ArrowUp, Trash, Bell, CaretDown } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/* ─── Fake deal card (simplified) ─── */

function MiniCard({ title, price, likes, comments, time, hot, expired, deleted }: {
  title: string; price: string; likes: number; comments: number; time: string;
  hot?: boolean; expired?: boolean; deleted?: boolean;
}) {
  return (
    <div className={cn(
      "relative flex overflow-hidden rounded-lg bg-card shadow-sm transition-all duration-500",
      expired && "opacity-50",
      deleted && "h-0 overflow-hidden opacity-0",
    )}>
      <div className="relative w-16 shrink-0 self-stretch bg-foreground text-[9px] font-bold text-background flex items-center justify-center">
        핫딜닷쿨
        {hot && <span className="absolute left-0.5 top-0.5 rounded-full bg-red-500 p-0.5"><Fire className="size-2" weight="fill" /></span>}
        {expired && <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-[8px] font-bold text-white">종료</span>}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center px-2 py-1.5">
        <p className="truncate text-xs font-semibold">{title}</p>
        <span className="text-xs font-bold">{price}</span>
        <span className="flex items-center gap-1.5 text-[9px] text-muted-foreground">
          <Heart className="size-2" />{likes} · <ChatCircle className="size-2" />{comments} · {time}
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   1. new-deal — 신규 딜 알림
   ═══════════════════════════════════════════════════════════ */

function NewDealSection() {
  const [newCount, setNewCount] = useState(0);
  const [showNew, setShowNew] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-muted-foreground">신규 핫딜이 등록되면 상단에 배너가 뜹니다. 클릭하면 새 딜을 로드합니다.</p>
      <button onClick={() => setNewCount((p) => p + 1)} className="self-start rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">
        + 신규 딜 도착 시뮬레이션
      </button>

      <div className="relative flex flex-col gap-2 rounded-xl border border-border bg-background p-3">
        {/* Banner A: 상단 스티키 배너 */}
        {newCount > 0 && !showNew && (
          <button
            onClick={() => { setShowNew(true); setNewCount(0); }}
            className="sticky top-0 z-10 flex items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow-lg transition-all hover:bg-primary/90"
          >
            <ArrowUp className="size-3" />{newCount}개의 새 핫딜
          </button>
        )}

        {showNew && (
          <div className="animate-in slide-in-from-top duration-300">
            <MiniCard title="🔥 [NEW] 방금 등록된 핫딜!" price="9,900원" likes={0} comments={0} time="방금 전" hot />
          </div>
        )}
        <MiniCard title="쿠팡 로켓와우 멤버십 첫 달 무료" price="0원" likes={634} comments={152} time="3일 전" hot />
        <MiniCard title="Apple 에어팟 프로 2세대" price="199,000원" likes={124} comments={18} time="2시간 전" hot />
        <MiniCard title="안양축협 한돈 삼겹살 1kg" price="18,900원" likes={3} comments={0} time="5시간 전" />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   2. deal-updated — 클릭수/좋아요수 실시간 변경
   ═══════════════════════════════════════════════════════════ */

function DealUpdatedSection() {
  const [likes, setLikes] = useState(634);
  const [clicks, setClicks] = useState(330);
  const [flash, setFlash] = useState<"likes" | "clicks" | null>(null);

  function simulateLike() {
    setLikes((p) => p + 1);
    setFlash("likes");
    setTimeout(() => setFlash(null), 600);
  }

  function simulateClick() {
    setClicks((p) => p + 1);
    setFlash("clicks");
    setTimeout(() => setFlash(null), 600);
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-muted-foreground">다른 유저가 좋아요/클릭하면 숫자가 실시간으로 올라갑니다. 잠깐 하이라이트 효과.</p>
      <div className="flex gap-2">
        <button onClick={simulateLike} className="rounded-md bg-red-500 px-3 py-1.5 text-xs font-medium text-white">♥ 좋아요 +1</button>
        <button onClick={simulateClick} className="rounded-md bg-blue-500 px-3 py-1.5 text-xs font-medium text-white">클릭수 +1</button>
      </div>

      <div className="flex overflow-hidden rounded-lg bg-card shadow-sm">
        <div className="w-16 shrink-0 self-stretch bg-foreground text-[9px] font-bold text-background flex items-center justify-center">핫딜닷쿨</div>
        <div className="flex min-w-0 flex-1 flex-col justify-center px-2 py-1.5">
          <p className="truncate text-xs font-semibold">쿠팡 로켓와우 멤버십 첫 달 무료</p>
          <span className="text-xs font-bold">0원</span>
          <span className="flex items-center gap-1.5 text-[9px] text-muted-foreground">
            <span className={cn("inline-flex items-center gap-0.5 rounded px-0.5 transition-colors duration-500", flash === "clicks" && "bg-blue-500/20 text-blue-600")}>
              <CursorClick className="size-2" />{clicks}
            </span>
            <span className={cn("inline-flex items-center gap-0.5 rounded px-0.5 transition-colors duration-500", flash === "likes" && "bg-red-500/20 text-red-500")}>
              <Heart className="size-2" />{likes}
            </span>
            · HDDC · 쿠팡 · 3일 전
          </span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   3. deal-expired — 딜 종료
   ═══════════════════════════════════════════════════════════ */

function DealExpiredSection() {
  const [expired, setExpired] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-muted-foreground">끝났어요 투표가 임계값을 넘으면 딜이 종료 상태로 전환됩니다.</p>
      <button onClick={() => setExpired(!expired)} className="self-start rounded-md bg-orange-500 px-3 py-1.5 text-xs font-medium text-white">
        {expired ? "종료 해제" : "딜 종료 시뮬레이션"}
      </button>

      <div className="flex flex-col gap-2 rounded-xl border border-border bg-background p-3">
        <MiniCard title="쿠팡 로켓와우 멤버십 첫 달 무료" price="0원" likes={634} comments={152} time="3일 전" hot expired={expired} />
        <MiniCard title="Apple 에어팟 프로 2세대" price="199,000원" likes={124} comments={18} time="2시간 전" hot />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   4. deal-deleted — 딜 삭제
   ═══════════════════════════════════════════════════════════ */

function DealDeletedSection() {
  const [designA, setDesignA] = useState(false);
  const [designB, setDesignB] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-muted-foreground">관리자/작성자가 딜을 삭제하면 피드에서 어떻게 처리할지:</p>

      <div className="flex flex-col gap-6">
        {/* Design A: 즉시 제거 (fade out) */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">A</span>
            <span className="text-xs font-semibold">즉시 fade-out 제거</span>
            <button onClick={() => setDesignA(!designA)} className="rounded bg-destructive px-2 py-0.5 text-[10px] text-white">{designA ? "복원" : "삭제"}</button>
          </div>
          <div className="flex flex-col gap-2 rounded-xl border border-border bg-background p-3">
            <MiniCard title="쿠팡 로켓와우 멤버십" price="0원" likes={634} comments={152} time="3일 전" hot deleted={designA} />
            <MiniCard title="Apple 에어팟 프로 2세대" price="199,000원" likes={124} comments={18} time="2시간 전" hot />
          </div>
        </div>

        {/* Design B: "삭제된 딜입니다" 표시 후 제거 */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">B</span>
            <span className="text-xs font-semibold">"삭제된 딜" 표시 후 fade-out</span>
            <button onClick={() => setDesignB(!designB)} className="rounded bg-destructive px-2 py-0.5 text-[10px] text-white">{designB ? "복원" : "삭제"}</button>
          </div>
          <div className="flex flex-col gap-2 rounded-xl border border-border bg-background p-3">
            {designB ? (
              <div className="flex items-center justify-center rounded-lg bg-muted/50 px-4 py-3 text-xs text-muted-foreground">
                <Trash className="mr-1.5 size-3.5" />삭제된 딜입니다
              </div>
            ) : (
              <MiniCard title="쿠팡 로켓와우 멤버십" price="0원" likes={634} comments={152} time="3일 전" hot />
            )}
            <MiniCard title="Apple 에어팟 프로 2세대" price="199,000원" likes={124} comments={18} time="2시간 전" hot />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   5. new-comment — 신규 댓글
   ═══════════════════════════════════════════════════════════ */

function NewCommentSection() {
  const [comments, setComments] = useState([
    { nick: "테크딜러", text: "이거 진짜 역대급이네요", time: "5분 전" },
    { nick: "패션헌터", text: "쿠팡에서 직접 구매했는데 배송 빠릅니다", time: "3분 전" },
  ]);
  const [newBadge, setNewBadge] = useState(0);

  function addComment() {
    const newComment = { nick: "새유저", text: "방금 달린 실시간 댓글입니다! 🔥", time: "방금 전" };
    setComments((p) => [...p, newComment]);
    setNewBadge((p) => p + 1);
    setTimeout(() => setNewBadge(0), 3000);
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-muted-foreground">댓글 패널이 열려있을 때 새 댓글이 실시간 추가됩니다.</p>
      <button onClick={addComment} className="self-start rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">
        + 새 댓글 도착 시뮬레이션
      </button>

      <div className="w-full max-w-sm rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <span className="text-xs font-semibold">댓글 {comments.length}</span>
          {newBadge > 0 && (
            <span className="animate-in zoom-in rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold text-primary-foreground">
              +{newBadge} new
            </span>
          )}
        </div>
        <div className="flex max-h-48 flex-col gap-2 overflow-y-auto px-3 py-2">
          {comments.map((c, i) => (
            <div key={i} className={cn("flex items-start gap-2 text-xs", i === comments.length - 1 && newBadge > 0 && "animate-in slide-in-from-bottom duration-300")}>
              <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground">
                {c.nick.charAt(0)}
              </div>
              <div>
                <span className="font-semibold">{c.nick}</span>
                <span className="ml-1.5 text-[10px] text-muted-foreground">{c.time}</span>
                <p className="mt-0.5 text-muted-foreground">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   6. comment-deleted — 댓글 삭제
   ═══════════════════════════════════════════════════════════ */

function CommentDeletedSection() {
  const [deleted, setDeleted] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-muted-foreground">관리자/작성자가 댓글을 삭제하면 "삭제된 메시지입니다"로 전환됩니다.</p>
      <button onClick={() => setDeleted(!deleted)} className="self-start rounded-md bg-destructive px-3 py-1.5 text-xs font-medium text-white">
        {deleted ? "복원" : "두 번째 댓글 삭제"}
      </button>

      <div className="w-full max-w-sm rounded-xl border border-border bg-card">
        <div className="flex items-center border-b border-border px-3 py-2">
          <span className="text-xs font-semibold">댓글</span>
        </div>
        <div className="flex flex-col gap-2 px-3 py-2">
          <div className="flex items-start gap-2 text-xs">
            <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground">테</div>
            <div>
              <span className="font-semibold">테크딜러</span>
              <span className="ml-1.5 text-[10px] text-muted-foreground">5분 전</span>
              <p className="mt-0.5 text-muted-foreground">이거 진짜 역대급이네요</p>
            </div>
          </div>
          {deleted ? (
            <p className="py-1 text-xs italic text-muted-foreground/40">삭제된 메시지입니다</p>
          ) : (
            <div className="flex items-start gap-2 text-xs">
              <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-orange-500 text-[8px] font-bold text-white">패</div>
              <div>
                <span className="font-semibold">패션헌터</span>
                <span className="ml-1.5 text-[10px] text-muted-foreground">3분 전</span>
                <p className="mt-0.5 text-muted-foreground">쿠팡에서 직접 구매했는데 배송 빠릅니다</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Page
   ═══════════════════════════════════════════════════════════ */

const SECTIONS = [
  { name: "1", label: "new-deal — 신규 핫딜 알림", emoji: "🆕", Component: NewDealSection },
  { name: "2", label: "deal-updated — 클릭수/좋아요수 실시간 변경", emoji: "📊", Component: DealUpdatedSection },
  { name: "3", label: "deal-expired — 딜 종료", emoji: "⏰", Component: DealExpiredSection },
  { name: "4", label: "deal-deleted — 딜 삭제", emoji: "🗑️", Component: DealDeletedSection },
  { name: "5", label: "new-comment — 신규 댓글", emoji: "💬", Component: NewCommentSection },
  { name: "6", label: "comment-deleted — 댓글 삭제", emoji: "❌", Component: CommentDeletedSection },
];

export default function SseDesignPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-8">
        <h1 className="mb-2 text-2xl font-bold">SSE 이벤트 디자인</h1>
        <p className="mb-8 text-sm text-muted-foreground">
          각 이벤트가 UI에 어떻게 반영되는지 시뮬레이션합니다. 버튼을 눌러서 확인하세요.
        </p>

        {SECTIONS.map(({ name, label, emoji, Component }) => (
          <section key={name} className="mb-12">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{name}</span>
              <h2 className="text-sm font-semibold">{emoji} {label}</h2>
            </div>
            <Component />
          </section>
        ))}
      </div>
    </div>
  );
}
