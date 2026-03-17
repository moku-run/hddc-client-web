"use client";

import { useState, useRef } from "react";
import { Heart, ChatCircle, ArrowSquareOut, PaperPlaneTilt, ArrowBendDownRight, Flag, XCircle, Fire } from "@phosphor-icons/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { HotDeal, DealComment } from "@/lib/hot-deal-types";
import { ReportPopover } from "./report-popover";

const GUEST_ANIMALS = [
  "🐨 코알라", "🐼 판다", "🦦 수달", "🐧 펭귄", "🦊 여우",
  "🐶 강아지", "🐱 고양이", "🐰 토끼", "🐻 곰돌이", "🦁 사자",
  "🐯 호랑이", "🐸 개구리", "🐳 고래", "🦉 부엉이", "🐿 다람쥐",
];

let sessionGuestName: string | null = null;
function getGuestName(): string {
  if (!sessionGuestName) {
    sessionGuestName = GUEST_ANIMALS[Math.floor(Math.random() * GUEST_ANIMALS.length)];
  }
  return sessionGuestName;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "방금 전";
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}일 전`;
  return new Date(dateStr).toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
}

function formatPrice(n: number): string {
  return n.toLocaleString("ko-KR");
}

interface DealCardProps {
  deal: HotDeal;
  comments?: DealComment[];
}

export function DealCard({ deal, comments = [] }: DealCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(deal.likes);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [guestName, setGuestName] = useState("");
  const guestDefault = useRef(getGuestName());
  const [replyTo, setReplyTo] = useState<{ id: string; author: string } | null>(null);
  const [localComments, setLocalComments] = useState<DealComment[]>(comments);
  const [expired, setExpired] = useState(false);
  const [expiredCount, setExpiredCount] = useState(0);

  // TODO: replace with real auth check
  const isLoggedIn = typeof window !== "undefined" && !!localStorage.getItem("hddc-auth");
  const authorName = isLoggedIn ? "나" : (guestName.trim() || guestDefault.current);

  const rootComments = localComments.filter((c) => !c.parentId);
  const repliesMap = new Map<string, DealComment[]>();
  localComments.filter((c) => c.parentId).forEach((c) => {
    const arr = repliesMap.get(c.parentId!) || [];
    arr.push(c);
    repliesMap.set(c.parentId!, arr);
  });

  function toggleLike() {
    setLiked((prev) => !prev);
    setLikeCount((prev) => prev + (liked ? -1 : 1));
  }

  function toggleExpired() {
    setExpired((prev) => !prev);
    setExpiredCount((prev) => prev + (expired ? -1 : 1));
    if (!expired) {
      toast.info("종료 투표가 반영되었습니다");
    }
  }

  function submitComment() {
    const text = commentText.trim();
    if (!text) return;
    setLocalComments((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        parentId: replyTo?.id ?? null,
        author: authorName,
        text,
        createdAt: new Date().toISOString(),
      },
    ]);
    setCommentText("");
    setReplyTo(null);
  }

  function startReply(comment: DealComment) {
    setReplyTo({ id: comment.id, author: comment.author });
  }

  return (
    <div className="rounded-xl border border-border bg-card transition-colors">
      {/* Card body — links to external deal */}
      <a
        href={deal.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex gap-3 p-3 sm:gap-4 sm:p-4"
      >
        {/* Thumbnail */}
        <div className="relative size-24 shrink-0 overflow-hidden rounded-lg bg-muted sm:size-28">
          {deal.imageUrl ? (
            <img
              src={deal.imageUrl}
              alt={deal.title}
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-foreground text-sm font-bold text-background">핫딜닷쿨</div>
          )}
          {deal.likes >= 50 && (
            <span className="absolute left-1.5 top-1.5 flex items-center gap-0.5 rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
              <Fire className="size-3 shrink-0" weight="fill" />
              인기
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            <h3 className="line-clamp-2 text-sm font-semibold leading-snug group-hover:text-primary">
              {deal.title}
            </h3>
            {deal.description && (
              <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-muted-foreground">{deal.description}</p>
            )}
          </div>

          {/* Price + source + time — always bottom-aligned */}
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="text-base font-bold">{formatPrice(deal.price)}원</span>
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span>{deal.source}</span>
              <span>·</span>
              <span suppressHydrationWarning>{timeAgo(deal.postedAt)}</span>
            </span>
            <ArrowSquareOut className="ml-auto size-3 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        </div>
      </a>

      {/* Action bar */}
      <div className="flex items-center gap-2 border-t border-border px-3 py-2 text-[11px] text-muted-foreground sm:gap-4 sm:px-4">
        <button
          onClick={toggleLike}
          className="flex cursor-pointer items-center gap-1 transition-colors hover:text-red-500"
        >
          <Heart
            className="size-3.5"
            weight={liked ? "fill" : "regular"}
            color={liked ? "var(--color-red-500, #ef4444)" : undefined}
          />
          <span className={liked ? "font-semibold text-red-500" : ""}>{likeCount}</span>
        </button>
        <button
          onClick={() => { setCommentsOpen((prev) => !prev); setReplyTo(null); }}
          className="flex cursor-pointer items-center gap-1 transition-colors hover:text-foreground"
        >
          <ChatCircle className="size-3.5" weight={commentsOpen ? "fill" : "regular"} />
          <span>{localComments.length}</span>
        </button>
        <button
          onClick={toggleExpired}
          className={cn(
            "flex cursor-pointer items-center gap-1 transition-colors hover:text-orange-500",
            expired && "text-orange-500",
          )}
        >
          <XCircle className="size-3.5" weight={expired ? "fill" : "regular"} />
          <span className={expired ? "font-semibold" : ""}>
            끝났어요
            {expiredCount > 0 && ` ${expiredCount}`}
          </span>
        </button>
        <ReportPopover targetType="deal">
          <button className="ml-auto flex cursor-pointer items-center gap-1 transition-colors hover:text-red-500">
            <Flag className="size-3.5" />
            <span className="hidden sm:inline">신고</span>
          </button>
        </ReportPopover>
      </div>

      {/* Comments accordion */}
      {commentsOpen && (
        <div className="border-t border-border px-3 py-3 sm:px-4">
          {rootComments.length > 0 ? (
            <div className="flex flex-col gap-3">
              {rootComments.map((c) => {
                const replies = repliesMap.get(c.id) || [];
                return (
                  <div key={c.id}>
                    {/* Root comment */}
                    <div className="flex items-start gap-2 text-xs">
                      <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold">
                        {c.author.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-semibold">{c.author}</span>
                          <span className="text-[10px] text-muted-foreground/60" suppressHydrationWarning>{timeAgo(c.createdAt)}</span>
                        </div>
                        <p className="mt-0.5 text-muted-foreground">{c.text}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <button
                            onClick={() => startReply(c)}
                            className="cursor-pointer text-[10px] text-muted-foreground/60 transition-colors hover:text-foreground"
                          >
                            답글
                          </button>
                          <ReportPopover targetType="comment" />
                        </div>
                      </div>
                    </div>

                    {/* Replies (1-depth) */}
                    {replies.length > 0 && (
                      <div className="ml-8 mt-2 flex flex-col gap-2 border-l-2 border-border pl-3">
                        {replies.map((r) => (
                          <div key={r.id} className="flex items-start gap-2 text-xs">
                            <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-[9px] font-bold">
                              {r.author.charAt(0)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-baseline gap-1.5">
                                <span className="font-semibold">{r.author}</span>
                                <span className="text-[10px] text-muted-foreground/60" suppressHydrationWarning>{timeAgo(r.createdAt)}</span>
                              </div>
                              <p className="mt-0.5 text-muted-foreground">{r.text}</p>
                              <div className="mt-1">
                                <ReportPopover targetType="comment" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="py-2 text-center text-xs text-muted-foreground/50">아직 댓글이 없습니다</p>
          )}

          {/* Comment input */}
          <div className="mt-3">
            {replyTo && (
              <div className="mb-1.5 flex items-center gap-1 text-[10px] text-primary">
                <ArrowBendDownRight className="size-3" />
                <span className="font-medium">{replyTo.author}</span>
                <span className="text-muted-foreground">에게 답글</span>
                <button
                  onClick={() => setReplyTo(null)}
                  className="ml-1 cursor-pointer text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>
            )}
            {/* Guest nickname row */}
            {!isLoggedIn && (
              <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="shrink-0 text-[10px] text-muted-foreground">닉네임</span>
                <input
                  type="text"
                  placeholder={guestDefault.current}
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  maxLength={12}
                  className="h-7 w-28 rounded-md border border-input bg-transparent px-2 text-xs outline-none placeholder:text-muted-foreground/50 focus:border-primary focus:ring-1 focus:ring-primary/30 sm:w-32"
                />
                <span className="hidden text-[10px] text-muted-foreground/40 sm:inline">
                  <a href="/auth/login" className="underline transition-colors hover:text-primary">로그인</a>하면 프로필이 표시됩니다
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder={replyTo ? "답글을 입력하세요..." : "댓글을 입력하세요..."}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") submitComment(); }}
                className={cn(
                  "h-8 flex-1 rounded-md border border-input bg-transparent px-3 text-xs outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/30",
                  replyTo && "border-primary/40",
                )}
              />
              <button
                onClick={submitComment}
                disabled={!commentText.trim()}
                className="flex size-8 cursor-pointer items-center justify-center rounded-md bg-primary text-primary-foreground transition-colors hover:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <PaperPlaneTilt className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
