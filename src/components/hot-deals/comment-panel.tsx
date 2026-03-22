"use client";

import { useState, useEffect, useCallback } from "react";
import { X, PaperPlaneTilt, Trash, ArrowBendDownRight, ArrowSquareOut, Heart } from "@phosphor-icons/react";
import { toast } from "sonner";
import { getAvatarColor } from "@/lib/avatar-color";
import { cn } from "@/lib/utils";
import type { HotDeal, DealComment } from "@/lib/hot-deal-types";
import { fetchComments, addComment, deleteComment, likeComment, unlikeComment } from "@/lib/hot-deal-api";
import { ReportPopover } from "./report-popover";
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

interface CommentPanelProps {
  deal: HotDeal;
  open: boolean;
  onClose: () => void;
}

export function CommentPanel({ deal, open, onClose }: CommentPanelProps) {
  const [comments, setComments] = useState<DealComment[]>([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [replyTo, setReplyTo] = useState<{ id: number; nickname: string } | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const isLoggedIn = typeof window !== "undefined" && !!localStorage.getItem("hddc-auth");
  const currentUserId = getCurrentUserId();

  const rootComments = comments.filter((c) => !c.parentId);
  const repliesMap = new Map<number, DealComment[]>();
  comments.filter((c) => c.parentId).forEach((c) => {
    const arr = repliesMap.get(c.parentId!) || [];
    arr.push(c);
    repliesMap.set(c.parentId!, arr);
  });

  useEffect(() => {
    if (open) document.body.setAttribute("data-comment-panel", "open");
    else document.body.removeAttribute("data-comment-panel");
    return () => document.body.removeAttribute("data-comment-panel");
  }, [open]);

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

  useEffect(() => {
    if (open) loadComments();
  }, [open, loadComments]);

  async function submitComment() {
    if (!isLoggedIn) { setAuthModalOpen(true); return; }
    const text = commentText.trim();
    if (!text) return;
    try {
      const created = await addComment(deal.id, text, replyTo?.id);
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
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch {
      toast.error("댓글 삭제에 실패했습니다");
    }
  }

  if (!open) return null;

  return (
    <>
      {/* Backdrop (mobile) */}
      <div className="fixed inset-0 z-40 bg-black/30 sm:hidden" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[420px] flex-col border-l border-border bg-card shadow-xl">
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
                    <div className="flex items-start gap-2 text-xs">
                      <div className="flex size-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white" style={{ backgroundColor: getAvatarColor(c.nickname) }}>
                        {c.nickname.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-semibold">{c.nickname}</span>
                          <span className="text-[10px] text-muted-foreground/60" suppressHydrationWarning>{timeAgo(c.createdAt)}</span>
                        </div>
                        <p className="mt-0.5 whitespace-pre-wrap text-muted-foreground">{c.content}</p>
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
                            <button onClick={() => handleDeleteComment(c.id)} className="cursor-pointer text-[10px] text-muted-foreground/60 transition-colors hover:text-destructive">
                              <Trash className="size-3" />
                            </button>
                          )}
                          <ReportPopover targetType="comment" dealId={deal.id} commentId={c.id} />
                        </div>
                      </div>
                    </div>

                    {(replies.length > 0 || replyTo?.id === c.id) && (
                      <div className="ml-7 mt-1.5 flex flex-col gap-1.5 border-l-2 border-border pl-2.5">
                        {replies.map((r) => {
                          const isReplyMine = currentUserId === r.userId;
                          return (
                            <div key={r.id} id={`comment-${r.id}`} className="flex items-start gap-2 text-xs">
                              <div className="flex size-4 shrink-0 items-center justify-center rounded-full text-[8px] font-bold text-white" style={{ backgroundColor: getAvatarColor(r.nickname) }}>
                                {r.nickname.charAt(0)}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-baseline gap-1.5">
                                  <span className="font-semibold">{r.nickname}</span>
                                  <span className="text-[10px] text-muted-foreground/60" suppressHydrationWarning>{timeAgo(r.createdAt)}</span>
                                </div>
                                <p className="mt-0.5 whitespace-pre-wrap text-muted-foreground">{r.content}</p>
                                <div className="mt-1 flex items-center gap-2">
                                  <button
                                    onClick={() => toggleCommentLike(r.id)}
                                    className={cn("flex cursor-pointer items-center gap-0.5 text-[10px] transition-colors", r.isLiked ? "text-red-500" : "text-muted-foreground/60 hover:text-red-500")}
                                  >
                                    <Heart className="size-3" weight={r.isLiked ? "fill" : "regular"} />
                                    {r.likeCount > 0 && r.likeCount}
                                  </button>
                                  {isReplyMine && (
                                    <button onClick={() => handleDeleteComment(r.id)} className="cursor-pointer text-[10px] text-muted-foreground/60 transition-colors hover:text-destructive">
                                      <Trash className="size-3" />
                                    </button>
                                  )}
                                  <ReportPopover targetType="comment" dealId={deal.id} commentId={r.id} />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        {isLoggedIn && replyTo?.id === c.id && (
                          <div className="flex items-end gap-2 pt-1">
                            <textarea
                              placeholder="답글을 입력하세요..." value={commentText} maxLength={1000}
                              onChange={(e) => setCommentText(e.target.value)}
                              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); submitComment(); } }}
                              autoFocus rows={4}
                              className="max-h-32 flex-1 resize-none rounded-md border border-primary/40 bg-transparent px-2.5 py-2 text-xs outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/30"
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
            </div>
          ) : (
            <p className="py-8 text-center text-xs text-muted-foreground/50">아직 댓글이 없습니다</p>
          )}
        </div>

        {/* Bottom input — root comment only (replies use inline input) */}
        {!replyTo && (
          <div className="border-t border-border px-4 py-3">
            {isLoggedIn ? (
              <div className="flex items-end gap-2">
                <textarea
                  placeholder="댓글을 입력하세요..." value={commentText} maxLength={1000}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); submitComment(); } }}
                  rows={4}
                  className="max-h-32 flex-1 resize-none rounded-md border border-input bg-transparent px-3 py-2 text-xs outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/30"
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
