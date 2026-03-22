"use client";

import { useState, useCallback } from "react";
import { Heart, ChatCircle, ArrowSquareOut, PaperPlaneTilt, ArrowBendDownRight, Flag, XCircle, Fire, Trash } from "@phosphor-icons/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { HotDeal, DealComment } from "@/lib/hot-deal-types";
import {
  likeDeal, unlikeDeal,
  voteExpired, unvoteExpired,
  fetchComments, addComment, deleteComment,
} from "@/lib/hot-deal-api";
import { ReportPopover } from "./report-popover";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "방금 전";
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}일 전`;
  return new Date(dateStr).toLocaleDateString("ko-KR", { year: "numeric", month: "short", day: "numeric" });
}

function formatPrice(n: number): string {
  return n.toLocaleString("ko-KR");
}

function getCurrentUserId(): number | null {
  try {
    const raw = localStorage.getItem("hddc-user");
    if (!raw) return null;
    return JSON.parse(raw).userId ?? null;
  } catch { return null; }
}

/* ─── Price display ─── */

function PriceDisplay({ originalPrice, dealPrice, discountRate }: {
  originalPrice: number | null;
  dealPrice: number | null;
  discountRate: number | null;
}) {
  const hasDiscount = originalPrice != null && dealPrice != null && originalPrice > dealPrice;

  if (hasDiscount) {
    return (
      <span className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0">
        {discountRate != null && (
          <span className="text-sm font-bold text-red-500">{discountRate}%</span>
        )}
        <span className="text-base font-bold">{formatPrice(dealPrice!)}원</span>
        <span className="text-xs text-muted-foreground line-through">{formatPrice(originalPrice!)}원</span>
      </span>
    );
  }

  // 할인 정보 없이 dealPrice만 있거나 originalPrice만 있는 경우
  const price = dealPrice ?? originalPrice;
  if (price != null) {
    return <span className="text-base font-bold">{formatPrice(price)}원</span>;
  }

  // 가격 정보가 아예 없는 경우
  return <span className="text-sm font-medium text-muted-foreground">가격 정보 없음</span>;
}

/* ─── Main component ─── */

export function DealCard({ deal }: { deal: HotDeal }) {
  const [liked, setLiked] = useState(deal.isLiked);
  const [likeCount, setLikeCount] = useState(deal.likeCount);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<DealComment[]>([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [expired, setExpired] = useState(deal.isVotedExpired);
  const [expiredCount, setExpiredCount] = useState(deal.expiredVoteCount);

  const isLoggedIn = typeof window !== "undefined" && !!localStorage.getItem("hddc-auth");
  const currentUserId = getCurrentUserId();

  const rootComments = comments.filter((c) => !c.parentId);
  const repliesMap = new Map<number, DealComment[]>();
  comments.filter((c) => c.parentId).forEach((c) => {
    const arr = repliesMap.get(c.parentId!) || [];
    arr.push(c);
    repliesMap.set(c.parentId!, arr);
  });

  const [replyTo, setReplyTo] = useState<{ id: number; userId: number } | null>(null);

  /* ─── Load comments from server ─── */
  const loadComments = useCallback(async () => {
    if (commentsLoaded) return;
    try {
      const data = await fetchComments(deal.id);
      setComments(data);
      setCommentsLoaded(true);
    } catch {
      toast.error("댓글을 불러올 수 없습니다");
    }
  }, [deal.id, commentsLoaded]);

  async function toggleLike() {
    if (!isLoggedIn) { toast.error("로그인이 필요합니다"); return; }
    // Optimistic update
    setLiked((prev) => !prev);
    setLikeCount((prev) => prev + (liked ? -1 : 1));
    try {
      if (liked) await unlikeDeal(deal.id);
      else await likeDeal(deal.id);
    } catch {
      // Rollback
      setLiked((prev) => !prev);
      setLikeCount((prev) => prev + (liked ? 1 : -1));
      toast.error("좋아요 처리에 실패했습니다");
    }
  }

  async function toggleExpired() {
    if (!isLoggedIn) { toast.error("로그인이 필요합니다"); return; }
    setExpired((prev) => !prev);
    setExpiredCount((prev) => prev + (expired ? -1 : 1));
    try {
      if (expired) await unvoteExpired(deal.id);
      else await voteExpired(deal.id);
      if (!expired) toast.info("종료 투표가 반영되었습니다");
    } catch {
      setExpired((prev) => !prev);
      setExpiredCount((prev) => prev + (expired ? 1 : -1));
      toast.error("투표 처리에 실패했습니다");
    }
  }

  async function submitComment() {
    if (!isLoggedIn) { toast.error("로그인이 필요합니다"); return; }
    const text = commentText.trim();
    if (!text) return;
    try {
      const created = await addComment(deal.id, text, replyTo?.id);
      setComments((prev) => [...prev, created]);
      setCommentText("");
      setReplyTo(null);
    } catch {
      toast.error("댓글 작성에 실패했습니다");
    }
  }

  async function handleDeleteComment(commentId: number) {
    try {
      await deleteComment(deal.id, commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch {
      toast.error("댓글 삭제에 실패했습니다");
    }
  }

  function handleToggleComments() {
    const next = !commentsOpen;
    setCommentsOpen(next);
    setReplyTo(null);
    if (next) loadComments();
  }

  return (
    <div className={cn(
      "rounded-xl border border-border bg-card transition-colors",
      deal.isExpired && "opacity-60",
    )}>
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
            <>
              <div className="flex size-full items-center justify-center bg-foreground text-sm font-bold text-background">핫딜닷쿨</div>
              <img
                src={deal.imageUrl}
                alt={deal.title}
                className="absolute inset-0 size-full object-cover"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
            </>
          ) : (
            <div className="flex size-full items-center justify-center bg-foreground text-sm font-bold text-background">핫딜닷쿨</div>
          )}
          {deal.likeCount >= 30 && expiredCount < 5 && (
            <span className="absolute left-1.5 top-1.5 flex items-center gap-0.5 rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
              <Fire className="size-3 shrink-0" weight="fill" />
              인기
            </span>
          )}
          {deal.isExpired && (
            <span className="absolute right-1.5 top-1.5 rounded-full bg-muted-foreground/80 px-2 py-0.5 text-[10px] font-bold text-white">
              종료
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

          {/* Price left + meta right */}
          <div className="mt-1.5 flex items-end justify-between">
            <PriceDisplay
              originalPrice={deal.originalPrice}
              dealPrice={deal.dealPrice}
              discountRate={deal.discountRate}
            />
            <span className="shrink-0 text-[10px] text-muted-foreground">
              {deal.nickname} · {deal.store && <>{deal.store} · </>}<span suppressHydrationWarning>{timeAgo(deal.createdAt)}</span>
            </span>
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
          onClick={handleToggleComments}
          className="flex cursor-pointer items-center gap-1 transition-colors hover:text-foreground"
        >
          <ChatCircle className="size-3.5" weight={commentsOpen ? "fill" : "regular"} />
          <span>{deal.commentCount}</span>
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
        <ReportPopover targetType="deal" dealId={deal.id}>
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
                const isMine = currentUserId === c.userId;
                return (
                  <div key={c.id}>
                    {/* Root comment */}
                    <div className="flex items-start gap-2 text-xs">
                      <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold">
                        {c.nickname.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-semibold">{c.nickname}</span>
                          <span className="text-[10px] text-muted-foreground/60" suppressHydrationWarning>{timeAgo(c.createdAt)}</span>
                        </div>
                        <p className="mt-0.5 text-muted-foreground">{c.content}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <button
                            onClick={() => setReplyTo({ id: c.id, userId: c.userId })}
                            className="cursor-pointer text-[10px] text-muted-foreground/60 transition-colors hover:text-foreground"
                          >
                            답글
                          </button>
                          {isMine && (
                            <button
                              onClick={() => handleDeleteComment(c.id)}
                              className="cursor-pointer text-[10px] text-muted-foreground/60 transition-colors hover:text-destructive"
                            >
                              <Trash className="size-3" />
                            </button>
                          )}
                          <ReportPopover targetType="comment" dealId={deal.id} commentId={c.id} />
                        </div>
                      </div>
                    </div>

                    {/* Replies (1-depth) + inline reply input */}
                    {(replies.length > 0 || replyTo?.id === c.id) && (
                      <div className="ml-8 mt-2 flex flex-col gap-2 border-l-2 border-border pl-3">
                        {replies.map((r) => {
                          const isReplyMine = currentUserId === r.userId;
                          return (
                            <div key={r.id} className="flex items-start gap-2 text-xs">
                              <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-[9px] font-bold">
                                {r.nickname.charAt(0)}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-baseline gap-1.5">
                                  <span className="font-semibold">{r.nickname}</span>
                                  <span className="text-[10px] text-muted-foreground/60" suppressHydrationWarning>{timeAgo(r.createdAt)}</span>
                                </div>
                                <p className="mt-0.5 text-muted-foreground">{r.content}</p>
                                <div className="mt-1 flex items-center gap-2">
                                  {isReplyMine && (
                                    <button
                                      onClick={() => handleDeleteComment(r.id)}
                                      className="cursor-pointer text-[10px] text-muted-foreground/60 transition-colors hover:text-destructive"
                                    >
                                      <Trash className="size-3" />
                                    </button>
                                  )}
                                  <ReportPopover targetType="comment" dealId={deal.id} commentId={r.id} />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        {/* Inline reply input */}
                        {isLoggedIn && replyTo?.id === c.id && (
                          <div className="flex items-center gap-2 pt-1">
                            <input
                              type="text"
                              placeholder="답글을 입력하세요..."
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              onKeyDown={(e) => { if (e.key === "Enter" && !e.nativeEvent.isComposing) submitComment(); }}
                              autoFocus
                              className="h-7 flex-1 rounded-md border border-primary/40 bg-transparent px-2.5 text-xs outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/30"
                            />
                            <button
                              onClick={submitComment}
                              disabled={!commentText.trim()}
                              className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md bg-primary text-primary-foreground transition-colors hover:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <PaperPlaneTilt className="size-3" />
                            </button>
                            <button
                              onClick={() => { setReplyTo(null); setCommentText(""); }}
                              className="cursor-pointer text-[10px] text-muted-foreground hover:text-foreground"
                            >
                              취소
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="py-2 text-center text-xs text-muted-foreground/50">아직 댓글이 없습니다</p>
          )}

          {/* Root comment input (not reply) */}
          {isLoggedIn && !replyTo && (
            <div className="mt-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="댓글을 입력하세요..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.nativeEvent.isComposing) submitComment(); }}
                  className="h-8 flex-1 rounded-md border border-input bg-transparent px-3 text-xs outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/30"
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
          )}

          {!isLoggedIn && (
            <p className="mt-3 text-center text-[10px] text-muted-foreground">
              <a href="/auth/login" className="underline transition-colors hover:text-primary">로그인</a>하면 댓글을 작성할 수 있습니다
            </p>
          )}
        </div>
      )}
    </div>
  );
}
