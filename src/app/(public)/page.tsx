"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { Fire, CaretLeft, CaretRight, MagnifyingGlass, X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { ToggleGroup } from "@/components/ui/toggle-group";
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

const PAGE_SIZE = 20;

export default function HotDealsPage() {
  const [sortKey, setSortKey] = useState<DealSortKey>("latest");
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [deals, setDeals] = useState<HotDeal[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  /* ── Mobile infinite scroll ── */
  const [isMobile, setIsMobile] = useState(false);
  const [allDeals, setAllDeals] = useState<HotDeal[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingMore = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* ── Fetch deals from server ── */
  const loadDeals = useCallback(async (sort: DealSortKey, p: number, q: string, append: boolean) => {
    if (!append) setLoading(true);
    try {
      const result = q.trim()
        ? await searchDeals(q.trim(), p, PAGE_SIZE)
        : await fetchDeals(sort, p, PAGE_SIZE);

      if (append) {
        setAllDeals((prev) => [...prev, ...result.content]);
      } else {
        setDeals(result.content);
        setAllDeals(result.content);
      }
      setTotalPages(result.totalPages);
      setHasMore(p + 1 < result.totalPages);
    } catch {
      // API 에러 시 빈 상태 유지
    } finally {
      setLoading(false);
      loadingMore.current = false;
    }
  }, []);

  /* ── Initial load + sort/search/page change ── */
  useEffect(() => {
    setAllDeals([]);
    loadDeals(sortKey, isMobile ? 0 : page, query, false);
  }, [sortKey, page, query, loadDeals, isMobile]);

  /* ── Reset on sort/search change ── */
  function handleSortChange(sort: DealSortKey) {
    setSortKey(sort);
    setPage(0);
  }

  function handleSearch() {
    setQuery(searchInput);
    setPage(0);
  }

  function clearSearch() {
    setSearchInput("");
    setQuery("");
    setPage(0);
  }

  /* ── Mobile infinite scroll sentinel ── */
  useEffect(() => {
    if (!isMobile || !sentinelRef.current) return;
    const el = sentinelRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loadingMore.current) {
          loadingMore.current = true;
          const nextPage = Math.ceil(allDeals.length / PAGE_SIZE);
          loadDeals(sortKey, nextPage, query, true);
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isMobile, hasMore, allDeals.length, sortKey, query, loadDeals]);

  const displayItems = isMobile ? allDeals : deals;
  const feed = useMemo(() => buildFeed(displayItems, MOCK_PROFILES), [displayItems]);

  function goTo(p: number) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="flex min-h-full flex-col">
      <div className="flex-1">
        {/* Sticky control bar */}
        <div className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-2 px-3 py-2.5 sm:gap-3 sm:px-6 sm:py-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex shrink-0 items-center gap-2">
                <Fire className="size-5 text-red-500" weight="fill" />
                <h1 className="text-base font-bold tracking-tight sm:text-lg">핫딜</h1>
              </div>
              <ToggleGroup
                variant="pill"
                size="sm"
                value={sortKey}
                onValueChange={handleSortChange}
                options={[
                  { value: "latest" as const, label: "최신순" },
                  { value: "popular" as const, label: "인기순" },
                  { value: "discount" as const, label: "할인율순" },
                ]}
              />
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="상품명, 판매처로 검색..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-9 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Feed */}
        <div className="mx-auto w-full max-w-3xl px-3 pt-3 pb-8 sm:px-6 sm:pt-4">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : displayItems.length === 0 ? (
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
                    return <DealCard key={item.data.id} deal={item.data} />;
                  case "sponsor":
                    return <SponsorAd key={`sponsor-${i}`} />;
                  case "profile":
                    return <ProfileCard key={item.data.slug} profile={item.data} />;
                }
              })}
            </div>
          )}

          {/* Mobile: infinite scroll sentinel */}
          {isMobile && hasMore && !loading && (
            <div ref={sentinelRef} className="flex items-center justify-center py-8">
              <div className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}
          {isMobile && !hasMore && allDeals.length > PAGE_SIZE && (
            <p className="py-6 text-center text-[11px] text-muted-foreground/40">
              모든 딜을 불러왔습니다
            </p>
          )}

          {/* Desktop: Pagination */}
          {!isMobile && totalPages > 1 && !loading && (
            <div className="mt-8 flex items-center justify-center gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => goTo(page - 1)}
                disabled={page <= 0}
              >
                <CaretLeft className="size-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i).map((p) => (
                <Button
                  key={p}
                  variant={p === page ? "default" : "ghost"}
                  size="sm"
                  className="size-8 p-0 text-xs"
                  onClick={() => goTo(p)}
                >
                  {p + 1}
                </Button>
              ))}
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => goTo(page + 1)}
                disabled={page >= totalPages - 1}
              >
                <CaretRight className="size-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
