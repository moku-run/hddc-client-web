"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { MagnifyingGlass, X, ArrowUp } from "@phosphor-icons/react";
import { SiteFooter } from "@/components/site-footer";
import { DealCard } from "@/components/hot-deals/deal-card";
import { SponsorAd } from "@/components/hot-deals/sponsor-ad";
import { ProfileCard } from "@/components/hot-deals/profile-card";
import { buildFeed, type HotDeal, type FeedProfile, type DealSortKey } from "@/lib/hot-deal-types";
import { fetchDeals, searchDeals } from "@/lib/hot-deal-api";
import { connectSse, disconnectSse, SSE_EVENTS, type SseNewDeal, type SseDealUpdated, type SseDealExpired, type SseDealDeleted } from "@/lib/sse-client";

const MOCK_PROFILES: FeedProfile[] = [
  { slug: "techdeals", nickname: "테크딜러", bio: "IT/전자기기 핫딜만 큐레이션합니다", avatarUrl: null },
  { slug: "fashionhunter", nickname: "패션헌터", bio: "무신사/지그재그/에이블리 특가 모음", avatarUrl: null },
];

/* ─── 뷰포트 기반 페이지 사이즈 계산 ─── */

const CARD_HEIGHT_MOBILE = 92;
const CARD_HEIGHT_DESKTOP = 108;

function calcPageSize(isMobile: boolean): number {
  const h = typeof window !== "undefined" ? window.innerHeight : 800;
  const cardH = isMobile ? CARD_HEIGHT_MOBILE : CARD_HEIGHT_DESKTOP;
  const visible = Math.ceil(h / cardH);
  return Math.max(visible * 3, 20);
}

export default function HotDealsPage() {
  const [sortKey] = useState<DealSortKey>("latest");
  const [query, setQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [allDeals, setAllDeals] = useState<HotDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const fetchingRef = useRef(false);
  const pageSizeRef = useRef(20);

  const [activeCommentDealId, setActiveCommentDealId] = useState<number | null>(null);

  /* ── SSE: 새 딜 대기열 ── */
  const [pendingDeals, setPendingDeals] = useState<HotDeal[]>([]);

  /* ── 뷰포트 기반 pageSize 설정 ── */
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    setIsMobile(mq.matches);
    pageSizeRef.current = calcPageSize(mq.matches);
    const handler = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
      pageSizeRef.current = calcPageSize(e.matches);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* ── SSE 연결 ── */
  useEffect(() => {
    connectSse();
    return () => disconnectSse();
  }, []);

  /* ── SSE: new-deal → 대기열에 추가 ── */
  useEffect(() => {
    function onNewDeal(e: Event) {
      const data = (e as CustomEvent<SseNewDeal>).detail;
      const newDeal: HotDeal = {
        dealNumber: 0,
        id: data.id,
        userId: 0,
        nickname: data.nickname,
        title: data.title,
        description: null,
        url: "",
        imageUrl: data.imageUrl,
        originalPrice: data.originalPrice,
        dealPrice: data.dealPrice,
        discountRate: data.discountRate,
        category: null,
        store: data.store,
        likeCount: data.likeCount,
        commentCount: data.commentCount,
        expiredVoteCount: 0,
        isExpired: false,
        viewCount: data.viewCount,
        isLiked: false,
        isVotedExpired: false,
        createdAt: data.createdAt,
      };
      setPendingDeals((prev) => [newDeal, ...prev]);
    }
    window.addEventListener(SSE_EVENTS.NEW_DEAL, onNewDeal);
    return () => window.removeEventListener(SSE_EVENTS.NEW_DEAL, onNewDeal);
  }, []);

  /* ── SSE: deal-updated → 실시간 수치 업데이트 ── */
  useEffect(() => {
    function onDealUpdated(e: Event) {
      const data = (e as CustomEvent<SseDealUpdated>).detail;
      setAllDeals((prev) => prev.map((d) => {
        if (d.id !== data.id) return d;
        return {
          ...d,
          ...(data.likeCount != null && { likeCount: data.likeCount }),
          ...(data.clickCount != null && { viewCount: data.clickCount }),
          ...(data.expiredVoteCount != null && { expiredVoteCount: data.expiredVoteCount }),
          ...(data.commentCount != null && { commentCount: data.commentCount }),
        };
      }));
    }
    window.addEventListener(SSE_EVENTS.DEAL_UPDATED, onDealUpdated);
    return () => window.removeEventListener(SSE_EVENTS.DEAL_UPDATED, onDealUpdated);
  }, []);

  /* ── SSE: deal-expired → 종료 표시 ── */
  useEffect(() => {
    function onDealExpired(e: Event) {
      const { id } = (e as CustomEvent<SseDealExpired>).detail;
      setAllDeals((prev) => prev.map((d) => d.id === id ? { ...d, isExpired: true } : d));
    }
    window.addEventListener(SSE_EVENTS.DEAL_EXPIRED, onDealExpired);
    return () => window.removeEventListener(SSE_EVENTS.DEAL_EXPIRED, onDealExpired);
  }, []);

  /* ── SSE: deal-deleted → 피드에서 제거 ── */
  useEffect(() => {
    function onDealDeleted(e: Event) {
      const { id } = (e as CustomEvent<SseDealDeleted>).detail;
      setAllDeals((prev) => prev.filter((d) => d.id !== id));
    }
    window.addEventListener(SSE_EVENTS.DEAL_DELETED, onDealDeleted);
    return () => window.removeEventListener(SSE_EVENTS.DEAL_DELETED, onDealDeleted);
  }, []);

  /* ── "새 핫딜" 배너 클릭 → 대기열을 피드 상단에 삽입 ── */
  function loadPendingDeals() {
    setAllDeals((prev) => [...pendingDeals, ...prev]);
    setPendingDeals([]);
    // 맨 위로 스크롤
    document.querySelector("main")?.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ── Fetch deals ── */
  const loadDeals = useCallback(async (sort: DealSortKey, p: number, q: string, append: boolean) => {
    if (!append) setLoading(true);
    fetchingRef.current = true;
    try {
      const size = pageSizeRef.current;
      const result = q.trim()
        ? await searchDeals(q.trim(), p, size)
        : await fetchDeals(sort, p, size);

      if (append) {
        setAllDeals((prev) => [...prev, ...result.content]);
      } else {
        setAllDeals(result.content);
      }
      setHasMore(p + 1 < result.totalPages);
    } catch {
      // API 에러 시 빈 상태 유지
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, []);

  /* ── 초기 로드 + 검색 변경 시 리셋 ── */
  useEffect(() => {
    setAllDeals([]);
    setHasMore(true);
    setPendingDeals([]);
    loadDeals(sortKey, 0, query, false);
  }, [sortKey, query, loadDeals]);

  /* ── 무한 스크롤: 스크롤 60% 지점에서 선제적 fetch ── */
  useEffect(() => {
    const scrollEl = document.querySelector("main");
    if (!scrollEl) return;

    function handleScroll() {
      if (!hasMore || fetchingRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = scrollEl!;
      const scrollRatio = scrollTop / (scrollHeight - clientHeight || 1);
      if (scrollRatio > 0.6) {
        const nextPage = Math.ceil(allDeals.length / pageSizeRef.current);
        loadDeals(sortKey, nextPage, query, true);
      }
    }

    scrollEl.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollEl.removeEventListener("scroll", handleScroll);
  }, [hasMore, allDeals.length, sortKey, query, loadDeals]);

  /* ── 검색 핸들러 ── */
  function handleSearch() {
    setQuery(searchInput);
  }

  function clearSearch() {
    setSearchInput("");
    setQuery("");
  }

  const feed = useMemo(() => buildFeed(allDeals, MOCK_PROFILES), [allDeals]);

  return (
    <div className="flex min-h-full flex-col">
      <div className="flex-1">
        {/* Search bar */}
        <div className="mx-auto w-full max-w-3xl px-3 pt-3 sm:px-6 sm:pt-4">
          <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="상품명, 판매처로 검색..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="h-9 w-full rounded-full border border-border bg-background pl-9 pr-9 text-xs outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/30"
            />
            {searchInput && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="size-3" />
              </button>
            )}
          </form>
        </div>

        {/* Feed */}
        <div className="mx-auto w-full max-w-3xl px-3 pt-3 pb-8 sm:px-6">
          {/* 새 핫딜 배너 */}
          {pendingDeals.length > 0 && (
            <button
              onClick={loadPendingDeals}
              className="mb-3 flex w-full items-center justify-center gap-1.5 rounded-full bg-primary py-2.5 text-xs font-medium text-primary-foreground shadow-lg transition-all hover:bg-primary/90"
            >
              <ArrowUp className="size-3" />{pendingDeals.length}개의 새 핫딜
            </button>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : allDeals.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-16 text-center">
              <MagnifyingGlass className="size-10 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">
                {query
                  ? <>&ldquo;{query}&rdquo;에 대한 검색 결과가 없습니다</>
                  : "아직 등록된 핫딜이 없습니다"}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {feed.map((item, i) => {
                switch (item.type) {
                  case "deal":
                    return <DealCard key={`deal-${item.data.id}-${i}`} deal={{ ...item.data, viewCount: item.data.viewCount ?? 330 }} index={item.data.dealNumber} commentsOpen={activeCommentDealId === item.data.id} onToggleComments={() => setActiveCommentDealId((prev) => prev === item.data.id ? null : item.data.id)} />;
                  case "sponsor":
                    return <SponsorAd key={`sponsor-${i}`} />;
                  case "profile":
                    return <ProfileCard key={`profile-${item.data.slug}-${i}`} profile={item.data} />;
                  default:
                    return null;
                }
              })}
            </div>
          )}

          {/* Spacer */}
          {hasMore && !loading && <div className="py-4" />}
          {!hasMore && allDeals.length > 0 && (
            <p className="py-6 text-center text-[11px] text-muted-foreground/40">
              모든 딜을 불러왔습니다
            </p>
          )}
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
