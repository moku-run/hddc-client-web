"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { X, PaperPlaneTilt, Trash, ArrowBendDownRight, ArrowSquareOut, Heart, ChatCircle } from "@phosphor-icons/react";
import { toast } from "sonner";
import { getAvatarColor } from "@/lib/avatar-color";
import { cn } from "@/lib/utils";
import type { HotDeal, DealComment } from "@/lib/hot-deal-types";
import { fetchComments, addComment, deleteComment, likeComment, unlikeComment } from "@/lib/hot-deal-api";
import { SSE_EVENTS, type SseNewComment, type SseCommentDeleted } from "@/lib/sse-client";
import { ReportPopover } from "./report-popover";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AuthModal } from "@/components/auth/auth-modal";

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

function getCurrentUserId(): number | null {
  try {
    const raw = localStorage.getItem("hddc-user");
    if (!raw) return null;
    return JSON.parse(raw).userId ?? null;
  } catch { return null; }
}

function DeletePopover({ onDelete }: { onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="cursor-pointer text-[10px] text-muted-foreground/60 transition-colors hover:text-destructive">
          <Trash className="size-3" />
        </button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="center" className="!w-auto flex-row items-center gap-1.5 whitespace-nowrap p-1.5">
        <button onClick={() => { setOpen(false); onDelete(); }} className="cursor-pointer rounded bg-destructive px-2.5 py-0.5 text-[9px] font-medium text-white hover:bg-destructive/80">삭제</button>
        <button onClick={() => setOpen(false)} className="cursor-pointer rounded bg-muted px-2.5 py-0.5 text-[9px] font-medium text-muted-foreground hover:text-foreground">취소</button>
      </PopoverContent>
    </Popover>
  );
}

interface CommentPanelProps {
  deal: HotDeal;
  open: boolean;
  onClose: () => void;
}

export function CommentPanel({ deal, open, onClose }: CommentPanelProps) {
  const [comments, setComments] = useState<DealComment[]>([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [hasNext, setHasNext] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [replyTo, setReplyTo] = useState<{ id: number; nickname: string } | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [pendingNewComments, setPendingNewComments] = useState(0);
  const myCommentIdsRef = useRef<Set<number>>(new Set());
  const replyInputRef = useRef<HTMLDivElement>(null);

  // 대댓글 입력창이 스크롤로 안 보이면 자동 닫힘
  useEffect(() => {
    if (!replyTo || !replyInputRef.current) return;
    const el = replyInputRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => { if (!entry.isIntersecting) setReplyTo(null); },
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [replyTo]);

  const isLoggedIn = typeof window !== "undefined" && !!localStorage.getItem("hddc-auth");
  const currentUserId = getCurrentUserId();

  const safeComments = comments ?? [];
  const rootComments = safeComments.filter((c) => !c.parentId);
  const repliesMap = new Map<number, DealComment[]>();
  safeComments.filter((c) => c.parentId).forEach((c) => {
    const arr = repliesMap.get(c.parentId!) || [];
    arr.push(c);
    repliesMap.set(c.parentId!, arr);
  });

  useEffect(() => {
    if (open) document.body.setAttribute("data-comment-panel", "open");
    else document.body.removeAttribute("data-comment-panel");
    return () => document.body.removeAttribute("data-comment-panel");
  }, [open]);

  /* ── SSE: 실시간 댓글 — 내 댓글은 즉시, 남의 댓글은 카운터만 ── */
  useEffect(() => {
    if (!open) return;
    function onNewComment(e: Event) {
      const data = (e as CustomEvent<SseNewComment>).detail;
      if (data.dealId !== deal.id) return;
      // 내가 방금 작성한 댓글이면 무시 (submitComment에서 이미 추가됨)
      if (myCommentIdsRef.current.has(data.id)) return;
      // 이미 목록에 있으면 무시
      setComments((prev) => {
        if (prev.some((c) => c.id === data.id)) return prev;
        return prev; // 목록에 삽입하지 않음
      });
      // 남의 댓글 → 카운터만 증가
      setPendingNewComments((prev) => prev + 1);
    }
    window.addEventListener(SSE_EVENTS.NEW_COMMENT, onNewComment);
    return () => window.removeEventListener(SSE_EVENTS.NEW_COMMENT, onNewComment);
  }, [open, deal.id]);

  /* ── SSE: 실시간 댓글 삭제 ── */
  useEffect(() => {
    if (!open) return;
    function onCommentDeleted(e: Event) {
      const data = (e as CustomEvent<SseCommentDeleted>).detail;
      if (data.dealId !== deal.id) return;
      setComments((prev) => prev.map((c) =>
        c.id === data.id ? { ...c, content: "", nickname: "", userId: -1 } : c
      ));
    }
    window.addEventListener(SSE_EVENTS.COMMENT_DELETED, onCommentDeleted);
    return () => window.removeEventListener(SSE_EVENTS.COMMENT_DELETED, onCommentDeleted);
  }, [open, deal.id]);

  const loadComments = useCallback(async () => {
    if (commentsLoaded) return;
    try {
      const page = await fetchComments(deal.id);
      setComments(page.comments);
      setNextCursor(page.nextCursor);
      setHasNext(page.hasNext);
      setCommentsLoaded(true);
    } catch {
      toast.error("댓글을 불러올 수 없습니다");
    }
  }, [deal.id, commentsLoaded]);

  async function loadMore() {
    if (!hasNext || loadingMore) return;
    setLoadingMore(true);
    try {
      const page = await fetchComments(deal.id, 20, nextCursor);
      setComments((prev) => [...prev, ...page.comments]);
      setNextCursor(page.nextCursor);
      setHasNext(page.hasNext);
    } catch {
      toast.error("댓글을 불러올 수 없습니다");
    } finally {
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    if (open) loadComments();
  }, [open, loadComments]);

  async function refreshComments() {
    try {
      const page = await fetchComments(deal.id);
      setComments(page.comments);
      setNextCursor(page.nextCursor);
      setHasNext(page.hasNext);
      setPendingNewComments(0);
    } catch {
      toast.error("댓글을 불러올 수 없습니다");
    }
  }

  async function submitComment() {
    if (!isLoggedIn) { setAuthModalOpen(true); return; }
    const text = commentText.trim();
    if (!text) return;
    try {
      const created = await addComment(deal.id, text, replyTo?.id);
      myCommentIdsRef.current.add(created.id);
      setComments((prev) => [...prev, created]);
      setCommentText("");
      setReplyTo(null);
      requestAnimationFrame(() => {
        const el = document.getElementById(`comment-${created.id}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    } catch {
      toast.error("댓글 작성에 실패했습니다");
    }
  }

  async function toggleCommentLike(commentId: number) {
    if (!isLoggedIn) { setAuthModalOpen(true); return; }
    const comment = comments.find((c) => c.id === commentId);
    if (!comment) return;
    // Optimistic update
    setComments((prev) => prev.map((c) => c.id === commentId ? { ...c, isLiked: !c.isLiked, likeCount: c.likeCount + (c.isLiked ? -1 : 1) } : c));
    try {
      if (comment.isLiked) await unlikeComment(deal.id, commentId);
      else await likeComment(deal.id, commentId);
    } catch {
      // Rollback
      setComments((prev) => prev.map((c) => c.id === commentId ? { ...c, isLiked: comment.isLiked, likeCount: comment.likeCount } : c));
      toast.error("좋아요 처리에 실패했습니다");
    }
  }

  async function handleDeleteComment(commentId: number) {
    try {
      await deleteComment(deal.id, commentId);
      setComments((prev) => prev.map((c) => c.id === commentId ? { ...c, content: "", nickname: "", userId: -1 } : c));
    } catch {
      toast.error("댓글 삭제에 실패했습니다");
    }
  }

  return (
    <>
      {/* Backdrop */}
      {open && <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />}

      {/* Panel — mobile: bottom sheet / desktop: right slide */}
      <div className={cn(
        "fixed z-50 flex flex-col overflow-hidden border-border bg-card transition-transform duration-300 ease-in-out",
        // Mobile: bottom sheet
        "inset-x-0 bottom-0 max-h-[55vh] rounded-t-2xl border-t",
        // Desktop: right panel
        "sm:inset-x-auto sm:right-0 sm:top-0 sm:bottom-0 sm:h-full sm:max-h-full sm:w-full sm:max-w-[420px] sm:rounded-t-none sm:border-l sm:border-t-0",
        // Transform
        open
          ? "translate-y-0 sm:translate-x-0"
          : "translate-y-full sm:translate-y-0 sm:translate-x-full",
      )}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h4 className="text-sm font-semibold">댓글 {deal.commentCount}</h4>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="size-4" />
          </button>
        </div>

        {/* Deal title — click to scroll to card, link icon to deal URL */}
        <div className="flex items-center gap-2 border-b border-border px-4 py-2">
          <button
            onClick={() => {
              const el = document.getElementById(`deal-${deal.id}`);
              if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
            }}
            className="min-w-0 flex-1 text-left text-base font-semibold leading-snug line-clamp-2 transition-colors hover:text-primary"
          >
            {deal.title}
          </button>
          <a
            href={`/r/deals/${deal.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowSquareOut className="size-4" />
          </a>
        </div>

        {/* Comments */}
        <div className="flex-1 overflow-y-auto px-4 py-3 scrollbar-none">
          {rootComments.length > 0 ? (
            <div className="flex flex-col gap-3">
              {rootComments.map((c) => {
                const replies = repliesMap.get(c.id) || [];
                const isMine = currentUserId === c.userId;
                return (
                  <div key={c.id} id={`comment-${c.id}`}>
                    {c.userId === -1 ? (
                      /* 삭제된 댓글 (대댓글이 있어서 자리 유지) */
                      <p className="py-1 text-xs italic text-muted-foreground/40">삭제된 메시지입니다</p>
                    ) : (
                    <div className="flex items-start gap-2 text-xs">
                      <div className="flex size-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white" style={{ backgroundColor: getAvatarColor(c.nickname) }}>
                        {c.nickname.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-semibold">{c.nickname}</span>
                          <span className="text-[10px] text-muted-foreground/60" suppressHydrationWarning>{timeAgo(c.createdAt)}</span>
                        </div>
                        <p className="mt-0.5 whitespace-pre-wrap break-all text-muted-foreground">{c.content}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <button
                            onClick={() => toggleCommentLike(c.id)}
                            className={cn("flex cursor-pointer items-center gap-0.5 text-[10px] transition-colors", c.isLiked ? "text-red-500" : "text-muted-foreground/60 hover:text-red-500")}
                          >
                            <Heart className="size-3" weight={c.isLiked ? "fill" : "regular"} />
                            {c.likeCount > 0 && c.likeCount}
                          </button>
                          <button
                            onClick={() => setReplyTo({ id: c.id, nickname: c.nickname })}
                            className="cursor-pointer text-[10px] text-muted-foreground/60 transition-colors hover:text-foreground"
                          >
                            답글
                          </button>
                          {isMine && (
                            <DeletePopover onDelete={() => handleDeleteComment(c.id)} />
                          )}
                          <ReportPopover targetType="comment" dealId={deal.id} commentId={c.id} />
                        </div>
                      </div>
                    </div>
                    )}

                    {(replies.length > 0 || replyTo?.id === c.id) && (
                      <div className="ml-7 mt-1.5 flex flex-col gap-1.5 border-l-2 border-border pl-2.5">
                        {replies.map((r) => {
                          const isReplyMine = currentUserId === r.userId;
                          return (
                            <div key={r.id} id={`comment-${r.id}`}>
                              {r.userId === -1 ? (
                                <p className="py-0.5 text-[11px] italic text-muted-foreground/40">삭제된 메시지입니다</p>
                              ) : (
                              <div className="flex items-start gap-2 text-xs">
                                <div className="flex size-4 shrink-0 items-center justify-center rounded-full text-[8px] font-bold text-white" style={{ backgroundColor: getAvatarColor(r.nickname) }}>
                                  {r.nickname.charAt(0)}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-baseline gap-1.5">
                                    <span className="font-semibold">{r.nickname}</span>
                                    <span className="text-[10px] text-muted-foreground/60" suppressHydrationWarning>{timeAgo(r.createdAt)}</span>
                                  </div>
                                  <p className="mt-0.5 whitespace-pre-wrap break-all text-muted-foreground">{r.content}</p>
                                  <div className="mt-1 flex items-center gap-2">
                                    <button
                                      onClick={() => toggleCommentLike(r.id)}
                                      className={cn("flex cursor-pointer items-center gap-0.5 text-[10px] transition-colors", r.isLiked ? "text-red-500" : "text-muted-foreground/60 hover:text-red-500")}
                                    >
                                      <Heart className="size-3" weight={r.isLiked ? "fill" : "regular"} />
                                      {r.likeCount > 0 && r.likeCount}
                                    </button>
                                    {isReplyMine && (
                                      <DeletePopover onDelete={() => handleDeleteComment(r.id)} />
                                    )}
                                    <ReportPopover targetType="comment" dealId={deal.id} commentId={r.id} />
                                  </div>
                                </div>
                              </div>
                              )}
                            </div>
                          );
                        })}
                        {isLoggedIn && replyTo?.id === c.id && (
                          <div ref={replyInputRef} className="flex items-end gap-2 pt-1">
                            <textarea
                              placeholder="답글을 입력하세요..." value={commentText} maxLength={1000}
                              onChange={(e) => setCommentText(e.target.value)}
                              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); submitComment(); } }}
                              autoFocus rows={4}
                              className="max-h-32 flex-1 resize-none rounded-md border border-primary/40 bg-transparent px-2.5 py-2 text-xs outline-none scrollbar-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/30"
                            />
                            <button onClick={submitComment} disabled={!commentText.trim()} className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/80 disabled:opacity-40">
                              <PaperPlaneTilt className="size-3" />
                            </button>
                            <button onClick={() => { setReplyTo(null); setCommentText(""); }} className="cursor-pointer text-[10px] text-muted-foreground hover:text-foreground">취소</button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* 더보기 버튼 — 새 댓글 있으면 primary로 전환 */}
              {hasNext && (
                pendingNewComments > 0 ? (
                  <button
                    onClick={refreshComments}
                    className="flex w-full items-center justify-center gap-1.5 rounded-md bg-primary py-1.5 text-[10px] font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    <ChatCircle className="size-3" />새 댓글 {pendingNewComments}개 포함 · 더보기
                  </button>
                ) : (
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="w-full rounded-md bg-muted py-1.5 text-[10px] font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                  >
                    {loadingMore ? "불러오는 중..." : "이전 댓글 더보기"}
                  </button>
                )
              )}
              {/* 더보기 없을 때도 새 댓글 알림 */}
              {!hasNext && pendingNewComments > 0 && (
                <button
                  onClick={refreshComments}
                  className="flex w-full items-center justify-center gap-1.5 rounded-md bg-primary py-1.5 text-[10px] font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <ChatCircle className="size-3" />새 댓글 {pendingNewComments}개
                </button>
              )}
            </div>
          ) : (
            <p className="py-8 text-center text-xs text-muted-foreground/50">아직 댓글이 없습니다</p>
          )}
        </div>

        {/* Bottom input — root comment only (replies use inline input) */}
        {!replyTo && (
          <div className="animate-in slide-in-from-bottom-full duration-300 ease-out border-t border-border px-4 py-2 sm:py-3">
            {isLoggedIn ? (
              <div className="flex items-end gap-2">
                <textarea
                  placeholder="댓글을 입력하세요..." value={commentText} maxLength={1000}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); submitComment(); } }}
                  rows={2}
                  className="max-h-20 flex-1 resize-none rounded-md border border-input bg-transparent px-3 py-1.5 text-xs outline-none scrollbar-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/30 sm:max-h-32 sm:py-2"
                />
                <button onClick={submitComment} disabled={!commentText.trim()} className="flex size-8 cursor-pointer items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/80 disabled:opacity-40">
                  <PaperPlaneTilt className="size-3.5" />
                </button>
              </div>
            ) : (
              <p className="text-center text-[10px] text-muted-foreground">
                <button onClick={() => setAuthModalOpen(true)} className="underline hover:text-primary">로그인</button>하면 댓글을 작성할 수 있습니다
              </p>
            )}
          </div>
        )}
      </div>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  );
}
