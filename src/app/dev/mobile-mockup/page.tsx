"use client";

import { Heart, Fire, ShoppingCart, ArrowSquareOut, Star, ChatCircle, CursorClick } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/* ─── Shared data ─── */

const PROFILE = { nickname: "테크딜러", bio: "IT/전자기기 핫딜만 큐레이션합니다", slug: "@techdealer" };

const PRODUCTS = [
  { title: "Apple 에어팟 프로 2세대 (USB-C)", price: 199000, originalPrice: 289000, discount: 31, store: "쿠팡", clicks: 1284, likes: 634, hot: true },
  { title: "나이키 에어맥스 97 한정 컬러", price: 129000, originalPrice: 179000, discount: 28, store: "무신사", clicks: 856, likes: 312, hot: true },
  { title: "삼성 갤럭시 S25 울트라 자급제", price: 1350000, originalPrice: 1550000, discount: 13, store: "11번가", clicks: 542, likes: 203, hot: false },
  { title: "다이슨 에어랩 멀티 스타일러", price: 549000, originalPrice: 699000, discount: 21, store: "네이버", clicks: 342, likes: 67, hot: false },
  { title: "소니 WH-1000XM5 헤드폰", price: 289000, originalPrice: null, discount: null, store: "쿠팡", clicks: 178, likes: 45, hot: false },
];

function formatPrice(n: number) { return n.toLocaleString("ko-KR"); }

function Phone({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-[320px] overflow-hidden rounded-[2rem] border-2 border-foreground/20 bg-background shadow-xl">
        {/* Status bar */}
        <div className="flex items-center justify-between bg-background px-6 py-2">
          <span className="text-[10px] font-semibold">9:41</span>
          <div className="flex items-center gap-1">
            <div className="h-2 w-4 rounded-sm bg-foreground/30" />
            <div className="h-2 w-3 rounded-sm bg-foreground/30" />
            <div className="h-2.5 w-5 rounded-sm border border-foreground/30 px-0.5 py-0.5"><div className="h-full w-full rounded-[1px] bg-foreground/30" /></div>
          </div>
        </div>
        {/* Content */}
        <div className="h-[580px] overflow-y-auto scrollbar-none">
          {children}
        </div>
        {/* Home indicator */}
        <div className="flex justify-center pb-2 pt-1">
          <div className="h-1 w-28 rounded-full bg-foreground/20" />
        </div>
      </div>
      <p className="text-sm font-semibold">{label}</p>
    </div>
  );
}

function Avatar() {
  return (
    <div className="flex size-16 items-center justify-center rounded-full bg-foreground text-sm font-bold text-background">
      테
    </div>
  );
}

/* ═══════════════════════════════════════════
   A: 리스트형 — 심플 상품 리스트
   ═══════════════════════════════════════════ */

function MockupA() {
  return (
    <Phone label="A: 리스트형">
      <div className="flex flex-col items-center gap-3 px-4 py-6">
        <Avatar />
        <div className="text-center">
          <p className="text-base font-bold">{PROFILE.nickname}</p>
          <p className="text-xs text-muted-foreground">{PROFILE.bio}</p>
        </div>

        <div className="mt-2 flex w-full flex-col gap-2">
          {PRODUCTS.map((p, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-border p-2.5">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-foreground text-[7px] font-bold text-background">핫딜닷쿨</div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold">{p.title}</p>
                <div className="mt-0.5 flex items-baseline gap-1.5">
                  {p.discount && <span className="text-[10px] font-bold text-red-500">{p.discount}%</span>}
                  <span className="text-xs font-bold">{formatPrice(p.price)}원</span>
                  {p.originalPrice && <span className="text-[9px] text-muted-foreground line-through">{formatPrice(p.originalPrice)}원</span>}
                </div>
                <p className="text-[9px] text-muted-foreground">{p.store}</p>
              </div>
              <ArrowSquareOut className="size-3.5 shrink-0 text-muted-foreground" />
            </div>
          ))}
        </div>
      </div>
    </Phone>
  );
}

/* ═══════════════════════════════════════════
   B: 카드형 — 큰 이미지 카드
   ═══════════════════════════════════════════ */

function MockupB() {
  return (
    <Phone label="B: 카드형">
      <div className="flex flex-col items-center gap-3 px-4 py-6">
        <Avatar />
        <div className="text-center">
          <p className="text-base font-bold">{PROFILE.nickname}</p>
          <p className="text-xs text-muted-foreground">{PROFILE.bio}</p>
        </div>

        <div className="mt-2 flex w-full flex-col gap-3">
          {PRODUCTS.slice(0, 4).map((p, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-border">
              <div className="flex h-32 items-center justify-center bg-foreground text-sm font-bold text-background">핫딜닷쿨</div>
              <div className="p-3">
                <div className="flex items-start justify-between">
                  <p className="text-sm font-semibold leading-snug">{p.title}</p>
                  {p.hot && <Fire className="size-4 shrink-0 text-red-500" weight="fill" />}
                </div>
                <div className="mt-1.5 flex items-baseline gap-1.5">
                  {p.discount && <span className="text-sm font-bold text-red-500">{p.discount}%</span>}
                  <span className="text-base font-bold">{formatPrice(p.price)}원</span>
                  {p.originalPrice && <span className="text-xs text-muted-foreground line-through">{formatPrice(p.originalPrice)}원</span>}
                </div>
                <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>{p.store}</span>
                  <span className="flex items-center gap-1"><CursorClick className="size-2.5" />{p.clicks}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Phone>
  );
}

/* ═══════════════════════════════════════════
   C: 그리드형 — 2열 상품 그리드
   ═══════════════════════════════════════════ */

function MockupC() {
  return (
    <Phone label="C: 그리드형">
      <div className="flex flex-col items-center gap-3 px-4 py-6">
        <Avatar />
        <div className="text-center">
          <p className="text-base font-bold">{PROFILE.nickname}</p>
          <p className="text-xs text-muted-foreground">{PROFILE.bio}</p>
        </div>

        <div className="mt-2 grid w-full grid-cols-2 gap-2">
          {PRODUCTS.map((p, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-border">
              <div className="flex h-24 items-center justify-center bg-foreground text-[8px] font-bold text-background">핫딜닷쿨</div>
              <div className="p-2">
                <p className="line-clamp-2 text-[10px] font-semibold leading-tight">{p.title}</p>
                <div className="mt-1 flex items-baseline gap-1">
                  {p.discount && <span className="text-[10px] font-bold text-red-500">{p.discount}%</span>}
                  <span className="text-xs font-bold">{formatPrice(p.price)}원</span>
                </div>
                <p className="mt-0.5 text-[8px] text-muted-foreground">{p.store}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Phone>
  );
}

/* ═══════════════════════════════════════════
   D: 매거진형 — 헤더 크게 + 상품 리스트
   ═══════════════════════════════════════════ */

function MockupD() {
  return (
    <Phone label="D: 매거진형">
      <div>
        {/* Hero header */}
        <div className="flex h-36 flex-col items-center justify-center bg-foreground text-background">
          <div className="flex size-14 items-center justify-center rounded-full bg-background text-sm font-bold text-foreground">테</div>
          <p className="mt-2 text-base font-bold">{PROFILE.nickname}</p>
          <p className="text-[10px] opacity-70">{PROFILE.bio}</p>
        </div>

        <div className="flex flex-col gap-2 px-4 py-4">
          <p className="text-xs font-semibold text-muted-foreground">추천 상품 {PRODUCTS.length}개</p>
          {PRODUCTS.map((p, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border-b border-border pb-2.5 last:border-0">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-[10px] font-bold text-muted-foreground">{i + 1}</span>
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-foreground text-[7px] font-bold text-background">핫딜닷쿨</div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold">{p.title}</p>
                <div className="flex items-baseline gap-1">
                  {p.discount && <span className="text-[10px] font-bold text-red-500">{p.discount}%</span>}
                  <span className="text-xs font-bold">{formatPrice(p.price)}원</span>
                </div>
                <p className="text-[9px] text-muted-foreground">{p.store} · <CursorClick className="inline size-2" />{p.clicks}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Phone>
  );
}

/* ═══════════════════════════════════════════
   E: 쇼핑몰형 — 카테고리 탭 + 상품
   ═══════════════════════════════════════════ */

function MockupE() {
  return (
    <Phone label="E: 쇼핑몰형">
      <div className="flex flex-col">
        {/* Profile compact header */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">테</div>
          <div>
            <p className="text-sm font-bold">{PROFILE.nickname}</p>
            <p className="text-[10px] text-muted-foreground">{PROFILE.bio}</p>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto border-b border-border px-4 py-2 scrollbar-none">
          {["전체", "전자제품", "패션", "식품", "생활"].map((cat, i) => (
            <button key={cat} className={cn("shrink-0 rounded-full px-3 py-1 text-[10px] font-medium", i === 0 ? "bg-foreground text-background" : "bg-muted text-muted-foreground")}>
              {cat}
            </button>
          ))}
        </div>

        {/* Products */}
        <div className="flex flex-col gap-2 px-4 py-3">
          {PRODUCTS.map((p, i) => (
            <div key={i} className="flex gap-3 rounded-xl border border-border p-2.5">
              <div className="flex size-20 shrink-0 items-center justify-center rounded-lg bg-foreground text-[7px] font-bold text-background">핫딜닷쿨</div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-xs font-semibold leading-snug">{p.title}</p>
                <div className="mt-1 flex items-baseline gap-1.5">
                  {p.discount && <span className="text-[10px] font-bold text-red-500">{p.discount}%</span>}
                  <span className="text-sm font-bold">{formatPrice(p.price)}원</span>
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-[9px] text-muted-foreground">
                  <span>{p.store}</span>
                  <span>♡ {p.likes}</span>
                  <span><CursorClick className="inline size-2" /> {p.clicks}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Phone>
  );
}

/* ═══════════════════════════════════════════
   F: 인스타/핀터레스트형 — 비주얼 중심
   ═══════════════════════════════════════════ */

function MockupF() {
  return (
    <Phone label="F: 비주얼형">
      <div className="flex flex-col">
        <div className="flex items-center gap-3 px-4 py-4">
          <div className="flex size-12 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">테</div>
          <div>
            <p className="text-sm font-bold">{PROFILE.nickname}</p>
            <p className="text-[10px] text-muted-foreground">{PROFILE.slug} · 추천 상품 {PRODUCTS.length}개</p>
          </div>
        </div>

        {/* Masonry-like grid */}
        <div className="grid grid-cols-2 gap-1.5 px-2">
          {PRODUCTS.map((p, i) => {
            const tall = i % 3 === 0;
            return (
              <div key={i} className="relative overflow-hidden rounded-lg">
                <div className={cn("flex items-center justify-center bg-foreground text-[8px] font-bold text-background", tall ? "h-48" : "h-32")}>
                  핫딜닷쿨
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 pt-8">
                  <p className="line-clamp-1 text-[10px] font-semibold text-white">{p.title}</p>
                  <div className="flex items-baseline gap-1">
                    {p.discount && <span className="text-[9px] font-bold text-red-400">{p.discount}%</span>}
                    <span className="text-[10px] font-bold text-white">{formatPrice(p.price)}원</span>
                  </div>
                </div>
                {p.hot && (
                  <div className="absolute left-1.5 top-1.5 flex items-center gap-0.5 rounded-full bg-red-500 px-1.5 py-0.5 text-[8px] font-bold text-white">
                    <Fire className="size-2" weight="fill" />HOT
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Phone>
  );
}

/* ═══════════════════════════════════════════ */

const MOCKUPS = [
  { name: "A", label: "리스트형", desc: "심플한 상품 리스트. 리틀리 느낌 유지하면서 가격/판매처 추가", Component: MockupA },
  { name: "B", label: "카드형", desc: "큰 이미지 + 상세 정보. 상품 하나하나가 눈에 들어옴", Component: MockupB },
  { name: "C", label: "그리드형", desc: "2열 상품 그리드. 한눈에 많은 상품 노출", Component: MockupC },
  { name: "D", label: "매거진형", desc: "히어로 헤더 + 순위 리스트. 큐레이터 느낌", Component: MockupD },
  { name: "E", label: "쇼핑몰형", desc: "컴팩트 헤더 + 카테고리 탭 + 상품 리스트. 미니 쇼핑몰", Component: MockupE },
  { name: "F", label: "비주얼형", desc: "핀터레스트 스타일 이미지 그리드. 시각적 임팩트", Component: MockupF },
];

export default function MobileMockupPage() {
  return (
    <div className="px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-2 text-2xl font-bold">모바일 프로필 목업 — 상품 특화</h1>
        <p className="mb-2 text-sm text-muted-foreground">
          hotdeal.cool/@username 접속 시 모바일에서 보이는 화면. 상품 링크에 특화된 프로필.
        </p>
        <p className="mb-8 text-xs text-muted-foreground/60">
          리틀리/링크트리의 &quot;모든 링크&quot;가 아닌 &quot;상품 큐레이션&quot;에 최적화된 레이아웃입니다.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-8">
        {MOCKUPS.map(({ name, label, desc, Component }) => (
          <div key={name} className="flex flex-col items-center">
            <Component />
            <p className="mt-1 max-w-[320px] text-center text-[10px] text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
