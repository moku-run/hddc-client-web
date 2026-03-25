"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { MagnifyingGlass, X } from "@phosphor-icons/react";
import { SiteFooter } from "@/components/site-footer";
import { DealCard } from "@/components/hot-deals/deal-card";
import { SponsorAd } from "@/components/hot-deals/sponsor-ad";
import { ProfileCard } from "@/components/hot-deals/profile-card";
import { buildFeed, type HotDeal, type FeedProfile, type DealSortKey } from "@/lib/hot-deal-types";
import { fetchDeals, searchDeals } from "@/lib/hot-deal-api";

const MOCK_PROFILES: FeedProfile[] = [
  { slug: "techdeals", nickname: "테크딜러", bio: "IT/전자기기 핫딜만 큐레이션합니다", avatarUrl: null },
  { slug: "fashionhunter", nickname: "패션헌터", bio: "무신사/지그재그/에이블리 특가 모음", avatarUrl: null },
];

/* ─── 뷰포트 기반 페이지 사이즈 계산 ─── */

const CARD_HEIGHT_MOBILE = 92;  // 80px image + 12px gap
const CARD_HEIGHT_DESKTOP = 108; // 96px min-h + 12px gap

function calcPageSize(isMobile: boolean): number {
  const h = typeof window !== "undefined" ? window.innerHeight : 800;
  const cardH = isMobile ? CARD_HEIGHT_MOBILE : CARD_HEIGHT_DESKTOP;
  const visible = Math.ceil(h / cardH);
  // 초기 로드: 보이는 수 × 3 (buffer 2배)
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
    loadDeals(sortKey, 0, query, false);
  }, [sortKey, query, loadDeals]);

  /* ── 무한 스크롤: 스크롤 60% 지점에서 선제적 fetch ── */
  useEffect(() => {
    // 스크롤 컨테이너: 부모 <main overflow-y-auto>
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
