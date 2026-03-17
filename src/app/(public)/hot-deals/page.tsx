"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Fire, CaretLeft, CaretRight, MagnifyingGlass, X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { ToggleGroup } from "@/components/ui/toggle-group";
import { SiteFooter } from "@/components/site-footer";
import { DealCard } from "@/components/hot-deals/deal-card";
import { SponsorAd } from "@/components/hot-deals/sponsor-ad";
import { ProfileCard } from "@/components/hot-deals/profile-card";
import { buildFeed, type HotDeal, type FeedProfile, type DealComment } from "@/lib/hot-deal-types";

/* ─── Mock data ─── */

const MOCK_DEALS: HotDeal[] = [
  {
    id: "1",
    title: "[단독특가] Apple 에어팟 프로 2세대 (USB-C 충전 케이스 포함) — 2026년 역대 최저가 갱신! 쿠팡 로켓배송 단독 할인 + 카드사 즉시할인 중복 적용 가능한 미친 가격",
    description: "액티브 노이즈 캔슬링(ANC) 2배 향상, 적응형 오디오, 맞춤형 공간 음향, IP54 방진방수, USB-C 충전, MagSafe 지원, 최대 30시간 배터리 — 애플 공식 리퍼비시 제품 아님 새제품 정품입니다",
    imageUrl: "",
    price: 199000,
    url: "#",
    source: "쿠팡",
    category: "electronics",
    postedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    likes: 124,
    comments: 18,
  },
  {
    id: "2",
    title: "맥북 에어 M3 15인치 16GB/512GB",
    description: "교육 할인 추가 적용 가능",
    imageUrl: "",
    price: 1590000,
    url: "#",
    source: "Apple 공식",
    category: "electronics",
    postedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    likes: 89,
    comments: 12,
  },
  {
    id: "3",
    title: "삼성 갤럭시 S25 울트라 자급제",
    description: "사전예약 혜택 포함, 512GB 모델",
    imageUrl: "",
    price: 1350000,
    url: "#",
    source: "11번가",
    category: "electronics",
    postedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    likes: 203,
    comments: 45,
  },
  {
    id: "4",
    title: "다이슨 에어랩 멀티 스타일러 컴플리트 롱",
    description: "새로운 컬러 리미티드 에디션",
    imageUrl: "",
    price: 549000,
    url: "#",
    source: "네이버쇼핑",
    category: "electronics",
    postedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    likes: 67,
    comments: 8,
  },
  {
    id: "5",
    title: "LG 그램 2025 16인치 Ultra 7",
    description: "980g 초경량, 배터리 최대 25시간",
    imageUrl: "",
    price: 1490000,
    url: "#",
    source: "LG 공식",
    category: "electronics",
    postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 56,
    comments: 7,
  },
  {
    id: "6",
    title: "나이키 에어맥스 97 — 언더리테일",
    description: "한정 컬러 블랙/화이트/실버",
    imageUrl: "",
    price: 129000,
    url: "#",
    source: "무신사",
    category: "fashion",
    postedAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 312,
    comments: 28,
  },
  {
    id: "7",
    title: "닌텐도 스위치 2 예약판매 시작",
    description: "2025년 출시, 마리오카트 번들",
    imageUrl: "",
    price: 449000,
    url: "#",
    source: "아마존 JP",
    category: "electronics",
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 445,
    comments: 92,
  },
  {
    id: "8",
    title: "소니 WH-1000XM5 무선 헤드폰",
    description: "최고의 노이즈 캔슬링, 30시간 배터리",
    imageUrl: "",
    price: 289000,
    url: "#",
    source: "쿠팡",
    category: "electronics",
    postedAt: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 178,
    comments: 23,
  },
  {
    id: "9",
    title: "곰곰 1+ 등급 한우 채끝 스테이크 300g",
    description: "로켓프레시 새벽배송",
    imageUrl: "",
    price: 29900,
    url: "#",
    source: "쿠팡",
    category: "food",
    postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 34,
    comments: 5,
  },
  {
    id: "10",
    title: "아이로봇 룸바 j9+ 로봇청소기",
    description: "자동 먼지 비움, 장애물 회피",
    imageUrl: "",
    price: 890000,
    url: "#",
    source: "G마켓",
    category: "living",
    postedAt: new Date(Date.now() - 3.5 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 91,
    comments: 14,
  },
  {
    id: "11",
    title: "유니클로 울트라라이트다운 베스트",
    description: "겨울 마지막 시즌오프 50%",
    imageUrl: "",
    price: 39900,
    url: "#",
    source: "유니클로",
    category: "fashion",
    postedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 267,
    comments: 31,
  },
  {
    id: "12",
    title: "스타벅스 e-카드 5만원권",
    description: "카카오페이 결제 시 10% 추가 할인",
    imageUrl: "",
    price: 42500,
    url: "#",
    source: "카카오딜",
    category: "food",
    postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 156,
    comments: 19,
  },
  ...(function generateMore(): HotDeal[] {
    const titles = [
      "로지텍 MX Master 3S 무선 마우스", "벨킨 3-in-1 무선 충전 스탠드",
      "삼성 T7 Shield 외장 SSD 2TB", "애플 아이패드 미니 7세대 Wi-Fi 256GB",
      "브리타 정수필터 맥스트라 프로 6개입", "필립스 원블레이드 면도기",
      "캠핑문 경량 백패킹 텐트 2인용", "이케아 말름 서랍장 6칸 화이트",
      "코스트코 커클랜드 견과류 믹스 1.13kg", "오뚜기 진라면 40봉 박스",
      "LG 울트라기어 27인치 QHD 게이밍 모니터", "로보락 S8 Pro Ultra 로봇청소기",
      "파타고니아 레트로 파일 플리스 자켓", "나이키 페가수스 41 러닝화",
      "JBL Flip 6 블루투스 스피커", "앤커 나노 파워뱅크 10000mAh",
      "무인양품 아로마 디퓨저 세트", "키친에이드 아티산 스탠드 믹서",
      "삼성 비스포크 큐브 냉장고", "발뮤다 토스터 프로",
      "몽벨 다운 재킷 슈퍼 메리노울", "아디다스 울트라부스트 라이트",
      "구글 Pixel 9 Pro 자급제", "레고 테크닉 포르쉐 911 GT3 RS",
      "마이크로소프트 서피스 프로 11", "데스커 모션 데스크 1400",
      "바이레도 집시워터 EDP 100ml", "오설록 프리미엄 티세트",
      "캐논 EOS R50 미러리스 바디", "보스 QuietComfort Ultra 이어버드",
      "테팔 인덕션 냄비세트 6종", "에르메스 뚜 어 리에 실크스카프",
      "쿠쿠 IH 전기밥솥 10인용", "위닉스 타워 공기청정기",
      "헬리녹스 체어원 캠핑의자", "스노우피크 티타늄 싱글 머그",
      "데카트론 포클라즈 등산배낭 40L", "일리 캡슐 커피머신 X1",
    ];
    return titles.map((title, i) => ({
      id: String(13 + i),
      title,
      description: "",
      imageUrl: "",
      price: 30000 + Math.floor(Math.random() * 1000000),
      url: "#",
      source: ["쿠팡", "네이버쇼핑", "11번가", "G마켓", "무신사", "SSG"][i % 6],
      category: (["electronics", "fashion", "food", "living", "etc"] as const)[i % 5],
      postedAt: new Date(Date.now() - (6 + i) * 24 * 60 * 60 * 1000).toISOString(),
      likes: Math.floor(Math.random() * 300),
      comments: Math.floor(Math.random() * 40),
    }));
  })(),
];

const MOCK_PROFILES: FeedProfile[] = [
  { slug: "techdeals", nickname: "테크딜러", bio: "IT/전자기기 핫딜만 큐레이션합니다", avatarUrl: null },
  { slug: "fashionhunter", nickname: "패션헌터", bio: "무신사/지그재그/에이블리 특가 모음", avatarUrl: null },
];

const MOCK_COMMENTS: Record<string, DealComment[]> = {
  "1": [
    { id: "c1", parentId: null, author: "딜헌터", text: "이거 역대 최저가 맞나요?", createdAt: new Date(Date.now() - 60 * 60_000).toISOString() },
    { id: "c2", parentId: "c1", author: "가격비교왕", text: "맞아요, 카드 할인 추가하면 18만원대도 가능", createdAt: new Date(Date.now() - 45 * 60_000).toISOString() },
    { id: "c3", parentId: "c1", author: "딜헌터", text: "오 감사합니다! 바로 질렀어요", createdAt: new Date(Date.now() - 30 * 60_000).toISOString() },
    { id: "c4", parentId: null, author: "음향덕후", text: "ANC 성능 에어팟맥스 빼면 이게 최고입니다", createdAt: new Date(Date.now() - 20 * 60_000).toISOString() },
    { id: "c5", parentId: "c4", author: "출퇴근러", text: "지하철에서 써봤는데 진짜 조용해짐", createdAt: new Date(Date.now() - 10 * 60_000).toISOString() },
  ],
  "3": [
    { id: "c10", parentId: null, author: "갤럭시팬", text: "사전예약 혜택이 진짜 좋네요", createdAt: new Date(Date.now() - 5 * 60 * 60_000).toISOString() },
    { id: "c11", parentId: "c10", author: "테크덕후", text: "S24보다 확실히 카메라 나아졌어요", createdAt: new Date(Date.now() - 4 * 60 * 60_000).toISOString() },
    { id: "c12", parentId: "c10", author: "가격알리미", text: "자급제가 통신사보다 결국 싸더라고요", createdAt: new Date(Date.now() - 3 * 60 * 60_000).toISOString() },
    { id: "c13", parentId: null, author: "아이폰유저", text: "갤럭시 넘어갈까 고민 중인데 어떤가요?", createdAt: new Date(Date.now() - 2 * 60 * 60_000).toISOString() },
    { id: "c14", parentId: "c13", author: "갤럭시팬", text: "AI 기능은 확실히 갤럭시가 앞서요", createdAt: new Date(Date.now() - 1 * 60 * 60_000).toISOString() },
  ],
  "6": [
    { id: "c20", parentId: null, author: "신발수집가", text: "사이즈 270 품절됐어요 ㅠ", createdAt: new Date(Date.now() - 10 * 60 * 60_000).toISOString() },
    { id: "c21", parentId: "c20", author: "무신사러버", text: "내일 리스탁 된다고 합니다!", createdAt: new Date(Date.now() - 8 * 60 * 60_000).toISOString() },
    { id: "c22", parentId: "c20", author: "에어맥스97", text: "감사합니다 바로 구매했어요", createdAt: new Date(Date.now() - 6 * 60 * 60_000).toISOString() },
    { id: "c23", parentId: null, author: "러닝맨", text: "발볼 넓은 편인가요?", createdAt: new Date(Date.now() - 4 * 60 * 60_000).toISOString() },
    { id: "c24", parentId: "c23", author: "신발수집가", text: "에어맥스 시리즈는 보통이에요, 반사이즈 업 추천", createdAt: new Date(Date.now() - 3 * 60 * 60_000).toISOString() },
    { id: "c25", parentId: null, author: "패션고수", text: "블랙/화이트 컬러 실물 예쁘네요", createdAt: new Date(Date.now() - 2 * 60 * 60_000).toISOString() },
  ],
  "7": [
    { id: "c30", parentId: null, author: "닌텐도매니아", text: "드디어 나온다!! 대기중", createdAt: new Date(Date.now() - 48 * 60 * 60_000).toISOString() },
    { id: "c31", parentId: "c30", author: "마리오팬", text: "마리오카트 번들이면 바로 사야지", createdAt: new Date(Date.now() - 36 * 60 * 60_000).toISOString() },
    { id: "c32", parentId: null, author: "겜덕", text: "스위치1 중고 지금 팔아야 하나요?", createdAt: new Date(Date.now() - 30 * 60 * 60_000).toISOString() },
    { id: "c33", parentId: "c32", author: "닌텐도매니아", text: "하위호환 된다니까 급하게 안 팔아도 될 듯", createdAt: new Date(Date.now() - 24 * 60 * 60_000).toISOString() },
    { id: "c34", parentId: "c32", author: "중고장터", text: "지금이 제일 비싸게 팔 수 있어요", createdAt: new Date(Date.now() - 20 * 60 * 60_000).toISOString() },
  ],
  "8": [
    { id: "c40", parentId: null, author: "헤드폰마니아", text: "XM4에서 넘어갈 가치 있나요?", createdAt: new Date(Date.now() - 50 * 60 * 60_000).toISOString() },
    { id: "c41", parentId: "c40", author: "음향엔지니어", text: "착용감이 훨씬 가벼워졌어요, 음질 차이는 미미", createdAt: new Date(Date.now() - 48 * 60 * 60_000).toISOString() },
    { id: "c42", parentId: "c40", author: "출장족", text: "비행기에서 쓰기엔 확실히 XM5가 나음", createdAt: new Date(Date.now() - 44 * 60 * 60_000).toISOString() },
  ],
  "10": [
    { id: "c50", parentId: null, author: "청소귀찮", text: "j7이랑 비교하면 어때요?", createdAt: new Date(Date.now() - 72 * 60 * 60_000).toISOString() },
    { id: "c51", parentId: "c50", author: "로봇청소기덕", text: "장애물 회피가 넘사벽입니다 j9+", createdAt: new Date(Date.now() - 70 * 60 * 60_000).toISOString() },
  ],
  "11": [
    { id: "c60", parentId: null, author: "겨울준비", text: "작년에도 이 가격이었나요?", createdAt: new Date(Date.now() - 80 * 60 * 60_000).toISOString() },
    { id: "c61", parentId: "c60", author: "유니클로매니아", text: "작년엔 40%까지만 했어요, 50%는 올해가 처음", createdAt: new Date(Date.now() - 78 * 60 * 60_000).toISOString() },
    { id: "c62", parentId: null, author: "미니멀리스트", text: "색상 추천 부탁드려요", createdAt: new Date(Date.now() - 76 * 60 * 60_000).toISOString() },
    { id: "c63", parentId: "c62", author: "패션블로거", text: "블랙이 무난하고 네이비도 괜찮아요", createdAt: new Date(Date.now() - 74 * 60 * 60_000).toISOString() },
  ],
};

type SortKey = "latest" | "popular" | "cheapest";

function sortDeals(deals: HotDeal[], key: SortKey): HotDeal[] {
  const sorted = [...deals];
  switch (key) {
    case "latest":
      return sorted.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
    case "popular":
      return sorted.sort((a, b) => b.likes - a.likes);
    case "cheapest":
      return sorted.sort((a, b) => a.price - b.price);
  }
}

const PAGE_SIZE = 10;

export default function HotDealsPage() {
  const [sortKey, setSortKey] = useState<SortKey>("latest");
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  /* ── Mobile infinite scroll ── */
  const [loadedPages, setLoadedPages] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return MOCK_DEALS;
    const q = query.trim().toLowerCase();
    return MOCK_DEALS.filter(
      (d) => d.title.toLowerCase().includes(q) || d.description.toLowerCase().includes(q) || d.source.toLowerCase().includes(q),
    );
  }, [query]);

  const sorted = useMemo(() => sortDeals(filtered, sortKey), [filtered, sortKey]);
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));

  /* Reset on filter/sort change */
  useEffect(() => {
    setLoadedPages(1);
    setPage(1);
  }, [sortKey, query]);

  /* Items to display: mobile = cumulative, desktop = single page */
  const displayItems = useMemo(() => {
    if (isMobile) {
      return sorted.slice(0, loadedPages * PAGE_SIZE);
    }
    const safePage = Math.min(page, totalPages);
    return sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  }, [isMobile, sorted, loadedPages, page, totalPages]);

  const feed = useMemo(() => buildFeed(displayItems, MOCK_PROFILES), [displayItems]);

  /* Sentinel observer — auto-loads next page */
  useEffect(() => {
    if (!isMobile || !sentinelRef.current) return;
    const el = sentinelRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && loadedPages < totalPages) {
          setLoadedPages((p) => p + 1);
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isMobile, loadedPages, totalPages]);

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
                onValueChange={(v) => { setSortKey(v); setPage(1); }}
                options={[
                  { value: "latest" as const, label: "최신순" },
                  { value: "popular" as const, label: "인기순" },
                  { value: "cheapest" as const, label: "낮은가격순" },
                ]}
              />
            </div>
            <div className="relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="상품명, 출처로 검색..."
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-9 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
              {query && (
                <button
                  onClick={() => { setQuery(""); setPage(1); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Feed */}
        <div className="mx-auto w-full max-w-3xl px-3 pt-3 pb-8 sm:px-6 sm:pt-4">
          {sorted.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-16 text-center">
              <MagnifyingGlass className="size-10 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">
                &ldquo;{query}&rdquo;에 대한 검색 결과가 없습니다
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {feed.map((item, i) => {
                switch (item.type) {
                  case "deal":
                    return <DealCard key={item.data.id} deal={item.data} comments={MOCK_COMMENTS[item.data.id]} />;
                  case "sponsor":
                    return <SponsorAd key={`sponsor-${i}`} />;
                  case "profile":
                    return <ProfileCard key={item.data.slug} profile={item.data} />;
                }
              })}
            </div>
          )}

          {/* Mobile: infinite scroll sentinel */}
          {isMobile && loadedPages < totalPages && (
            <div ref={sentinelRef} className="flex items-center justify-center py-8">
              <div className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}
          {isMobile && loadedPages >= totalPages && sorted.length > PAGE_SIZE && (
            <p className="py-6 text-center text-[11px] text-muted-foreground/40">
              모든 딜을 불러왔습니다
            </p>
          )}

          {/* Desktop: Pagination */}
          {!isMobile && totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => goTo(page - 1)}
                disabled={page <= 1}
              >
                <CaretLeft className="size-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={p === page ? "default" : "ghost"}
                  size="sm"
                  className="size-8 p-0 text-xs"
                  onClick={() => goTo(p)}
                >
                  {p}
                </Button>
              ))}
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => goTo(page + 1)}
                disabled={page >= totalPages}
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
