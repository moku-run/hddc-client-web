"use client";

import { useState } from "react";
import { Heart, ChatCircle, XCircle, Fire, CursorClick } from "@phosphor-icons/react";
import { IconText } from "@/components/ui/icon-text";
import { ActionPill } from "@/components/ui/action-pill";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { HotDeal } from "@/lib/hot-deal-types";
import { likeDeal, unlikeDeal, voteExpired, unvoteExpired } from "@/lib/hot-deal-api";
import { CommentPanel } from "./comment-panel";
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

function formatPrice(n: number): string {
  return n.toLocaleString("ko-KR");
}

function formatCount(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
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

  const price = dealPrice ?? originalPrice;
  if (price != null) {
    return <span className="text-base font-bold">{formatPrice(price)}원</span>;
  }

  return <span className="text-sm font-medium text-muted-foreground">가격 정보 없음</span>;
}

/* ─── Main component ─── */

interface DealCardProps {
  deal: HotDeal;
  index?: number;
  commentsOpen?: boolean;
  onToggleComments?: () => void;
}

export function DealCard({ deal, index, commentsOpen: commentsOpenProp, onToggleComments }: DealCardProps) {
  const [liked, setLiked] = useState(deal.isLiked);
  const [likeCount, setLikeCount] = useState(deal.likeCount);
  const [commentsOpenLocal, setCommentsOpenLocal] = useState(false);

  // 외부 제어가 있으면 외부 상태 사용, 없으면 로컬
  const commentsOpen = onToggleComments ? (commentsOpenProp ?? false) : commentsOpenLocal;
  const toggleComments = onToggleComments ?? (() => setCommentsOpenLocal((prev) => !prev));
  const [expired, setExpired] = useState(deal.isVotedExpired);
  const [expiredCount, setExpiredCount] = useState(deal.expiredVoteCount);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const isLoggedIn = typeof window !== "undefined" && !!localStorage.getItem("hddc-auth");

  async function toggleLike() {
    if (!isLoggedIn) { setAuthModalOpen(true); return; }
    setLiked((prev) => !prev);
    setLikeCount((prev) => prev + (liked ? -1 : 1));
    try {
      if (liked) await unlikeDeal(deal.id);
      else await likeDeal(deal.id);
    } catch {
      setLiked((prev) => !prev);
      setLikeCount((prev) => prev + (liked ? 1 : -1));
      toast.error("좋아요 처리에 실패했습니다");
    }
  }

  async function toggleExpired() {
    if (!isLoggedIn) { setAuthModalOpen(true); return; }
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

  return (
    <div
      id={`deal-${deal.id}`}
      className={cn(
        "relative overflow-hidden border-t border-border/50 bg-card shadow-md transition-colors",
        // Mobile: rounded-xl (bottom bar), Desktop: rounded-r-xl (right strip) + right padding for strip
        "rounded-xl sm:min-h-24 sm:rounded-r-xl sm:rounded-l-none sm:pr-10",
        deal.isExpired && "opacity-60",
      )}
    >
      {/* Card body */}
      <a
        href={`/r/deals/${deal.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex overflow-hidden"
      >
        {/* Thumbnail — flush to card border */}
        <div className="relative w-28 shrink-0 self-stretch overflow-hidden bg-muted sm:min-h-24 sm:w-24">
          {deal.imageUrl ? (
            <>
              <div className="flex size-full items-center justify-center bg-foreground text-base font-bold text-background">핫딜닷쿨</div>
              <img
                src={deal.imageUrl}
                alt={deal.title}
                className="absolute inset-0 size-full object-cover"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
            </>
          ) : (
            <div className="flex size-full items-center justify-center bg-foreground text-base font-bold text-background">핫딜닷쿨</div>
          )}
          {deal.likeCount >= 30 && expiredCount < 5 && (
            <span className="absolute left-1.5 top-1.5 flex items-center gap-0.5 rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-2 py-0.5 text-[11px] font-bold text-white shadow-sm">
              <Fire className="size-3 shrink-0" weight="fill" />
              HOT
            </span>
          )}
          {deal.isExpired && (
            <span className="absolute right-1.5 top-1.5 rounded-full bg-muted-foreground/80 px-2 py-0.5 text-xs font-bold text-white">
              종료
            </span>
          )}
        </div>

        {/* Content — text padding only */}
        <div className="flex min-w-0 flex-1 flex-col justify-between px-2.5 py-2 sm:px-3 sm:py-2.5">
          <h3 className="truncate text-base font-semibold leading-snug group-hover:text-primary sm:truncate sm:min-h-0">
            {deal.title}
          </h3>

          <div className="mt-1 flex flex-col gap-1">
            <PriceDisplay
              originalPrice={deal.originalPrice}
              dealPrice={deal.dealPrice}
              discountRate={deal.discountRate}
            />

            {/* Meta + desktop hover action pills */}
            <div className="group/meta relative flex items-center justify-between overflow-hidden">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                {deal.viewCount != null && deal.viewCount > 0 && (
                  <IconText icon={CursorClick}>{formatCount(deal.viewCount)}</IconText>
                )}
                <IconText icon={Heart}>{likeCount}</IconText>
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                {deal.nickname}{deal.store && <> · {deal.store}</>} · <span suppressHydrationWarning>{timeAgo(deal.createdAt)}</span>
              </span>
              {/* Desktop hover pills */}
              <div className="absolute right-0 hidden translate-x-full items-center gap-1.5 bg-card pl-2 transition-transform duration-200 ease-out group-hover/meta:translate-x-0 sm:flex">
                <ActionPill
                  icon={Heart}
                  label="좋아요"
                  active={liked}
                  activeClassName="bg-red-500 text-white"
                  hoverClassName="hover:text-red-400"
                  onClick={(e) => { e.preventDefault(); toggleLike(); }}
                />
                <ActionPill
                  icon={XCircle}
                  label="끝났어요"
                  active={expired}
                  activeClassName="bg-orange-500 text-white"
                  hoverClassName="hover:text-orange-400"
                  onClick={(e) => { e.preventDefault(); toggleExpired(); }}
                />
              </div>
            </div>
          </div>
        </div>
      </a>

      {/* Mobile: Bottom action bar */}
      <div className="flex items-center border-t border-border sm:hidden">
        <button
          onClick={toggleLike}
          className={cn("flex flex-1 items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors", liked ? "text-red-500" : "text-muted-foreground")}
        >
          <Heart className="size-4" weight={liked ? "fill" : "regular"} />좋아요
        </button>
        <div className="h-4 w-px bg-border" />
        <button
          onClick={toggleExpired}
          className={cn("flex flex-1 items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors", expired ? "text-orange-500" : "text-muted-foreground")}
        >
          <XCircle className="size-4" weight={expired ? "fill" : "regular"} />끝났어요
        </button>
        <div className="h-4 w-px bg-border" />
        <button
          onClick={toggleComments}
          className={cn("flex flex-1 items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors", commentsOpen ? "text-primary" : "text-muted-foreground")}
        >
          <ChatCircle className="size-4" weight={commentsOpen ? "fill" : "regular"} />{deal.commentCount}
        </button>
      </div>

      {/* Desktop: Right comment strip */}
      <button
        onClick={toggleComments}
        className={cn(
          "absolute right-0 top-0 hidden h-full w-10 shrink-0 flex-col items-center justify-center gap-1 rounded-r-xl border-l border-border transition-colors sm:flex",
          commentsOpen ? "bg-primary text-primary-foreground" : "bg-muted/30 text-muted-foreground hover:bg-muted/60 hover:text-foreground",
        )}
      >
        <ChatCircle className="size-4" weight={commentsOpen ? "fill" : "regular"} />
        <span className="text-xs font-medium">{deal.commentCount}</span>
      </button>

      <CommentPanel deal={deal} open={commentsOpen} onClose={toggleComments} />
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
}
