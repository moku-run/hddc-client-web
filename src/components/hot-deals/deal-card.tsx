"use client";

import { useState, useRef, useEffect } from "react";
import { Heart, ChatCircle, XCircle, CursorClick, DotsThreeVertical, Flag } from "@phosphor-icons/react";
import { FireLogo } from "@/components/icons/fire-logo";
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

  // SSE 애니메이션 flash
  const [clickFlash, setClickFlash] = useState(false);
  const [likeFlash, setLikeFlash] = useState(false);
  const [commentFlash, setCommentFlash] = useState(false);
  const prevClickCount = useRef(deal.clickCount);
  const prevLikeCount = useRef(deal.likeCount);
  const prevCommentCount = useRef(deal.commentCount);

  // SSE로 deal prop이 변경되면 로컬 state 동기화 + 애니메이션 트리거 (이전값 비교)
  useEffect(() => {
    if (prevLikeCount.current !== deal.likeCount) {
      setLikeFlash(true); setTimeout(() => setLikeFlash(false), 800);
    }
    prevLikeCount.current = deal.likeCount;
    setLikeCount(deal.likeCount);
  }, [deal.likeCount]);
  useEffect(() => { setExpiredCount(deal.expiredVoteCount); }, [deal.expiredVoteCount]);
  useEffect(() => {
    if (prevClickCount.current !== deal.clickCount) {
      setClickFlash(true); setTimeout(() => setClickFlash(false), 800);
    }
    prevClickCount.current = deal.clickCount;
  }, [deal.clickCount]);
  useEffect(() => {
    if (prevCommentCount.current !== deal.commentCount) {
      setCommentFlash(true); setTimeout(() => setCommentFlash(false), 3000);
    }
    prevCommentCount.current = deal.commentCount;
  }, [deal.commentCount]);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 모바일 메뉴 닫기
  useEffect(() => {
    if (!mobileMenuOpen) return;
    function handleClick(e: MouseEvent) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) setMobileMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [mobileMenuOpen]);

  // auth 변경 시 좋아요/종료 상태 리셋
  useEffect(() => {
    function onAuthChange() {
      if (!localStorage.getItem("hddc-auth")) {
        setLiked(false);
        setExpired(false);
      }
    }
    window.addEventListener("hddc:auth-changed", onAuthChange);
    return () => window.removeEventListener("hddc:auth-changed", onAuthChange);
  }, []);

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
        "relative border-t border-border/50 bg-card shadow-md transition-colors",
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
        onClick={(e) => {
          // 모바일: confirm 먼저
          if (window.innerWidth < 640) {
            e.preventDefault();
            setConfirmOpen(true);
          }
        }}
        className="group flex overflow-hidden"
      >
        {/* Thumbnail — mobile: 80x80 fixed, desktop: w-24 self-stretch */}
        <div className="relative size-20 shrink-0 overflow-hidden bg-muted sm:size-auto sm:min-h-24 sm:w-24 sm:self-stretch">
          {deal.imageUrl ? (
            <>
              <div className="flex size-full items-center justify-center bg-foreground text-xs font-bold text-background sm:text-base">핫딜닷쿨</div>
              <img
                src={deal.imageUrl}
                alt={deal.title}
                className="absolute inset-0 size-full object-cover"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
            </>
          ) : (
            <div className="flex size-full items-center justify-center bg-foreground text-xs font-bold text-background sm:text-base">핫딜닷쿨</div>
          )}
          {deal.likeCount >= 30 && expiredCount < 5 && (
            <span className="absolute left-0.5 top-0.5 flex size-4 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-500 shadow-sm sm:left-1.5 sm:top-1.5">
              <FireLogo className="size-4" bgColor="white" />
            </span>
          )}
          {deal.isExpired && (
            <span className="absolute right-0.5 top-0.5 rounded-full bg-muted-foreground/80 px-1 py-0 text-[7px] font-bold text-white sm:right-1.5 sm:top-1.5 sm:px-2 sm:py-0.5 sm:text-xs">
              종료
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col justify-center px-2 py-1.5 pr-6 sm:justify-between sm:px-3 sm:py-2.5 sm:pr-3">
          {/* Mobile: 1줄 제목 / Desktop: 1줄 truncate */}
          <h3 className="truncate text-sm font-semibold leading-snug group-hover:text-primary sm:text-base">
            {deal.title}
          </h3>

          {/* Mobile: 가격 + 메타 (이미지 80px 안에 3줄) */}
          <div className="mt-1.5 flex flex-col gap-0 sm:hidden">
            <span className="flex items-baseline gap-1">
              {deal.discountRate != null && deal.originalPrice != null && deal.dealPrice != null && deal.originalPrice > deal.dealPrice && (
                <span className="text-xs font-bold text-red-500">{deal.discountRate}%</span>
              )}
              <span className="text-sm font-bold">{deal.dealPrice != null ? `${formatPrice(deal.dealPrice)}원` : deal.originalPrice != null ? `${formatPrice(deal.originalPrice)}원` : ""}</span>
              {deal.originalPrice != null && deal.dealPrice != null && deal.originalPrice > deal.dealPrice && (
                <span className="text-[10px] text-muted-foreground line-through">{formatPrice(deal.originalPrice)}원</span>
              )}
            </span>
            <span className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="relative inline-flex items-center gap-0.5">
                  <CursorClick className={cn("size-2.5 transition-transform duration-300", clickFlash && "scale-150 text-blue-500")} />
                  {formatCount(deal.clickCount ?? 0)}
                  {clickFlash && <span className="absolute -right-3 -top-2 text-[9px] font-bold text-blue-500 animate-in fade-in zoom-in">+1</span>}
                </span>
                <span className="relative inline-flex items-center gap-0.5">
                  <Heart className={cn("size-2.5 transition-all duration-300", likeFlash && "scale-150 text-red-500")} weight={likeFlash ? "fill" : "regular"} />
                  {likeCount}
                  {likeFlash && <span className="absolute -right-3 -top-2 text-[9px] font-bold text-red-500 animate-in fade-in zoom-in">+1</span>}
                </span>
              </span>
              <span className="truncate">{deal.nickname}{deal.store && <> · {deal.store}</>} · <span suppressHydrationWarning>{timeAgo(deal.createdAt)}</span></span>
            </span>
          </div>

          {/* Desktop: full price + meta rows */}
          <div className="mt-1 hidden flex-col gap-1 sm:flex">
            <PriceDisplay
              originalPrice={deal.originalPrice}
              dealPrice={deal.dealPrice}
              discountRate={deal.discountRate}
            />
            <div className="group/meta relative flex items-center justify-between overflow-hidden">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="relative inline-flex items-center gap-0.5">
                  <CursorClick className={cn("size-2.5 transition-transform duration-300", clickFlash && "scale-150 text-blue-500")} />
                  {formatCount(deal.clickCount ?? 0)}
                  {clickFlash && <span className="absolute -right-3 -top-2 text-[9px] font-bold text-blue-500 animate-in fade-in zoom-in">+1</span>}
                </span>
                <span className="relative inline-flex items-center gap-0.5">
                  <Heart className={cn("size-2.5 transition-all duration-300", likeFlash && "scale-150 text-red-500")} weight={likeFlash ? "fill" : "regular"} />
                  {likeCount}
                  {likeFlash && <span className="absolute -right-3 -top-2 text-[9px] font-bold text-red-500 animate-in fade-in zoom-in">+1</span>}
                </span>
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                {deal.nickname}{deal.store && <> · {deal.store}</>} · <span suppressHydrationWarning>{timeAgo(deal.createdAt)}</span>
              </span>
              {/* Desktop hover pills */}
              <div className="absolute right-0 flex translate-x-full items-center gap-1.5 bg-card pl-2 transition-transform duration-200 ease-out group-hover/meta:translate-x-0">
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

      {/* Mobile: ⋮ menu (top-right) */}
      <div ref={mobileMenuRef} className="absolute right-1 top-1 sm:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-full p-0.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          <DotsThreeVertical className="size-4" weight="bold" />
        </button>
        {mobileMenuOpen && (
          <div className="absolute right-0 top-full mt-1 w-32 overflow-hidden rounded-lg border border-border bg-card shadow-lg z-20">
            <button onClick={() => { setMobileMenuOpen(false); toggleLike(); }} className={cn("flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-muted", liked ? "text-red-500" : "text-foreground")}>
              <Heart className="size-3.5 text-muted-foreground" weight={liked ? "fill" : "regular"} />좋아요
            </button>
            <button onClick={() => { setMobileMenuOpen(false); toggleComments(); }} className="flex w-full items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-muted">
              <ChatCircle className="size-3.5 text-muted-foreground" />댓글 {deal.commentCount}
            </button>
            <div className="border-t border-border" />
            <button onClick={() => { setMobileMenuOpen(false); toggleExpired(); }} className={cn("flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-muted", expired ? "text-orange-500" : "text-foreground")}>
              <XCircle className="size-3.5 text-muted-foreground" weight={expired ? "fill" : "regular"} />끝났어요
            </button>
            <button className="flex w-full items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:bg-muted">
              <Flag className="size-3.5" />신고
            </button>
          </div>
        )}
      </div>

      {/* Desktop: Right comment strip */}
      <button
        onClick={toggleComments}
        className={cn(
          "absolute right-0 top-0 hidden h-full w-10 shrink-0 flex-col items-center justify-center gap-1 rounded-r-xl border-l border-border transition-colors sm:flex",
          commentsOpen ? "bg-primary text-primary-foreground" : "bg-muted/30 text-muted-foreground hover:bg-muted/60 hover:text-foreground",
        )}
      >
        <ChatCircle className={cn("size-4 transition-all duration-300", commentFlash && !commentsOpen && "scale-125 text-primary")} weight={commentsOpen || commentFlash ? "fill" : "regular"} />
        <span className={cn("text-xs font-medium transition-colors", commentFlash && !commentsOpen && "font-bold text-primary")}>{deal.commentCount}</span>
      </button>

      {/* Mobile: navigate confirm */}
      {confirmOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30 sm:hidden" onClick={() => setConfirmOpen(false)} />
          <div className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl border-t border-border bg-card px-4 pb-6 pt-4 sm:hidden">
            <p className="line-clamp-2 text-sm font-semibold">{deal.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">외부 사이트로 이동합니다</p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setConfirmOpen(false)} className="flex-1 rounded-lg bg-muted py-2.5 text-sm font-medium text-muted-foreground">취소</button>
              <button
                onClick={() => { setConfirmOpen(false); window.open(`/r/deals/${deal.id}`, "_blank", "noopener,noreferrer"); }}
                className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground"
              >이동하기</button>
            </div>
          </div>
        </>
      )}

      {commentsOpen && <CommentPanel deal={deal} open={commentsOpen} onClose={toggleComments} />}
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
}
