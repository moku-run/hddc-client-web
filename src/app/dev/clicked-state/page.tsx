"use client";

import { useState } from "react";
import { Heart, CursorClick, ChatCircle, Check, Eye, CheckCircle } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { HotLabel } from "@/components/icons/fire-logo";

/* ─── Flexible card ─── */

function Card({ thumbExtra, titleNode, wrapExtra, priceExtra }: {
  thumbExtra?: React.ReactNode;
  titleNode?: React.ReactNode;
  wrapExtra?: string;
  priceExtra?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden rounded-r-xl border-t border-border/50 bg-card pr-10 shadow-md", wrapExtra)}>
      <div className="flex overflow-hidden">
        <div className="relative flex min-h-24 w-24 shrink-0 items-center justify-center self-stretch bg-foreground text-base font-bold text-background">
          핫딜닷쿨
          <HotLabel className="absolute left-1.5 top-1.5 size-4" />
          {thumbExtra}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between px-3 py-2.5">
          {titleNode ?? <p className="truncate text-base font-semibold">쿠팡 로켓와우 멤버십 첫 달 무료</p>}
          <div className="mt-1 flex flex-col gap-1">
            <span className={cn("flex items-baseline gap-1.5", priceExtra)}>
              <span className="text-sm font-bold text-red-500">100%</span>
              <span className="text-base font-bold">0원</span>
              <span className="text-xs text-muted-foreground line-through">7,890원</span>
            </span>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-0.5"><CursorClick className="size-2.5" />330</span>
                <span className="inline-flex items-center gap-0.5"><Heart className="size-2.5" />634</span>
              </span>
              <span>HDDC · 쿠팡 · 3일 전</span>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute right-0 top-0 flex h-full w-10 flex-col items-center justify-center gap-1 rounded-r-xl border-l border-border/50 bg-muted/30 text-muted-foreground">
        <ChatCircle className="size-4" />
        <span className="text-xs font-medium">152</span>
      </div>
    </div>
  );
}

function NormalCard() {
  return (
    <div className="relative overflow-hidden rounded-r-xl border-t border-border/50 bg-card pr-10 shadow-md">
      <div className="flex overflow-hidden">
        <div className="relative flex min-h-24 w-24 shrink-0 items-center justify-center self-stretch bg-foreground text-base font-bold text-background">핫딜닷쿨</div>
        <div className="flex min-w-0 flex-1 flex-col justify-between px-3 py-2.5">
          <p className="truncate text-base font-semibold">안양축협 한돈 삼겹살 1kg</p>
          <div className="mt-1 flex flex-col gap-1">
            <span className="text-base font-bold">18,900원</span>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-0.5"><CursorClick className="size-2.5" />45</span>
                <span className="inline-flex items-center gap-0.5"><Heart className="size-2.5" />3</span>
              </span>
              <span>HDDC Bot · 5시간 전</span>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute right-0 top-0 flex h-full w-10 flex-col items-center justify-center gap-1 rounded-r-xl border-l border-border/50 bg-muted/30 text-muted-foreground">
        <ChatCircle className="size-4" />
        <span className="text-xs font-medium">0</span>
      </div>
    </div>
  );
}

/* helper: card list with normal card for comparison */
function CardList({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-3">{children}<NormalCard /></div>;
}

/* ═══════════════════════════════════════════════════════════ */

interface Variant { name: string; desc: string; render: () => React.ReactNode }

const B_VARIANTS: Variant[] = [
  {
    name: "B1",
    desc: "opacity-80 (아주 살짝)",
    render: () => <CardList><Card wrapExtra="opacity-80" /></CardList>,
  },
  {
    name: "B2",
    desc: "opacity-70",
    render: () => <CardList><Card wrapExtra="opacity-70" /></CardList>,
  },
  {
    name: "B3",
    desc: "opacity-60 (강하게)",
    render: () => <CardList><Card wrapExtra="opacity-60" /></CardList>,
  },
  {
    name: "B4",
    desc: "opacity-70 + 제목 흐리게",
    render: () => (
      <CardList>
        <Card
          wrapExtra="opacity-70"
          titleNode={<p className="truncate text-base font-semibold text-muted-foreground">쿠팡 로켓와우 멤버십 첫 달 무료</p>}
        />
      </CardList>
    ),
  },
  {
    name: "B5",
    desc: "opacity-70 + grayscale (흑백 처리)",
    render: () => <CardList><Card wrapExtra="opacity-70 grayscale" /></CardList>,
  },
  {
    name: "B6",
    desc: "opacity-60 + 제목 흐리게 + grayscale",
    render: () => (
      <CardList>
        <Card
          wrapExtra="opacity-60 grayscale"
          titleNode={<p className="truncate text-base font-semibold text-muted-foreground">쿠팡 로켓와우 멤버십 첫 달 무료</p>}
        />
      </CardList>
    ),
  },
  {
    name: "B7",
    desc: "opacity-75 + 썸네일만 grayscale",
    render: () => (
      <CardList>
        <Card
          wrapExtra="opacity-75"
          thumbExtra={<div className="absolute inset-0 grayscale" />}
          titleNode={<p className="truncate text-base font-semibold text-muted-foreground">쿠팡 로켓와우 멤버십 첫 달 무료</p>}
        />
      </CardList>
    ),
  },
];

const C_VARIANTS: Variant[] = [
  {
    name: "C1",
    desc: "썸네일 체크 오버레이 (큰 체크)",
    render: () => (
      <CardList>
        <Card thumbExtra={<div className="absolute inset-0 flex items-center justify-center bg-black/40"><Check className="size-8 text-white" weight="bold" /></div>} />
      </CardList>
    ),
  },
  {
    name: "C2",
    desc: "썸네일 체크 + 제목 흐리게",
    render: () => (
      <CardList>
        <Card
          thumbExtra={<div className="absolute inset-0 flex items-center justify-center bg-black/40"><Check className="size-8 text-white" weight="bold" /></div>}
          titleNode={<p className="truncate text-base font-semibold text-muted-foreground">쿠팡 로켓와우 멤버십 첫 달 무료</p>}
        />
      </CardList>
    ),
  },
  {
    name: "C3",
    desc: "썸네일 체크 + 제목 앞 체크 아이콘",
    render: () => (
      <CardList>
        <Card
          thumbExtra={<div className="absolute inset-0 flex items-center justify-center bg-black/40"><Check className="size-8 text-white" weight="bold" /></div>}
          titleNode={
            <div className="flex items-center gap-1">
              <Check className="size-4 shrink-0 text-primary" weight="bold" />
              <p className="truncate text-base font-semibold text-muted-foreground">쿠팡 로켓와우 멤버십 첫 달 무료</p>
            </div>
          }
        />
      </CardList>
    ),
  },
  {
    name: "C4",
    desc: "썸네일 체크 + '봤어요' 뱃지",
    render: () => (
      <CardList>
        <Card
          thumbExtra={<div className="absolute inset-0 flex items-center justify-center bg-black/40"><Check className="size-8 text-white" weight="bold" /></div>}
          titleNode={
            <div className="flex items-center gap-1.5">
              <p className="truncate text-base font-semibold text-muted-foreground">쿠팡 로켓와우 멤버십 첫 달 무료</p>
              <span className="flex shrink-0 items-center gap-0.5 rounded-full bg-muted px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
                <Eye className="size-2.5" />봤어요
              </span>
            </div>
          }
        />
      </CardList>
    ),
  },
  {
    name: "C5",
    desc: "연한 오버레이(black/25) + 작은 체크 뱃지(우상단) + 제목 흐리게",
    render: () => (
      <CardList>
        <Card
          thumbExtra={
            <>
              <div className="absolute inset-0 bg-black/25" />
              <span className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-primary shadow">
                <Check className="size-3 text-primary-foreground" weight="bold" />
              </span>
            </>
          }
          titleNode={<p className="truncate text-base font-semibold text-muted-foreground">쿠팡 로켓와우 멤버십 첫 달 무료</p>}
        />
      </CardList>
    ),
  },
  {
    name: "C6",
    desc: "틸 틴트 오버레이 + 체크 + 제목 흐리게",
    render: () => (
      <CardList>
        <Card
          thumbExtra={
            <div className="absolute inset-0 flex items-center justify-center bg-primary/50">
              <Check className="size-8 text-white" weight="bold" />
            </div>
          }
          titleNode={<p className="truncate text-base font-semibold text-muted-foreground">쿠팡 로켓와우 멤버십 첫 달 무료</p>}
        />
      </CardList>
    ),
  },
  {
    name: "C7",
    desc: "썸네일 하단 '봤어요' 바 + 제목 앞 CheckCircle",
    render: () => (
      <CardList>
        <Card
          thumbExtra={
            <span className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-0.5 bg-primary/80 py-0.5 text-[9px] font-bold text-primary-foreground">
              <Check className="size-2.5" weight="bold" />봤어요
            </span>
          }
          titleNode={
            <div className="flex items-center gap-1">
              <CheckCircle className="size-4 shrink-0 text-primary" weight="fill" />
              <p className="truncate text-base font-semibold text-muted-foreground">쿠팡 로켓와우 멤버십 첫 달 무료</p>
            </div>
          }
        />
      </CardList>
    ),
  },
  {
    name: "C8",
    desc: "연한 오버레이 + 체크 + 제목 흐리게 + opacity-80",
    render: () => (
      <CardList>
        <Card
          wrapExtra="opacity-80"
          thumbExtra={
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <Check className="size-7 text-white" weight="bold" />
            </div>
          }
          titleNode={<p className="truncate text-base font-semibold text-muted-foreground">쿠팡 로켓와우 멤버십 첫 달 무료</p>}
        />
      </CardList>
    ),
  },
  {
    name: "C9",
    desc: "우상단 체크 뱃지 + '봤어요' 뱃지 + opacity-75",
    render: () => (
      <CardList>
        <Card
          wrapExtra="opacity-75"
          thumbExtra={
            <>
              <div className="absolute inset-0 bg-black/20" />
              <span className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-primary shadow">
                <Check className="size-3 text-primary-foreground" weight="bold" />
              </span>
            </>
          }
          titleNode={
            <div className="flex items-center gap-1.5">
              <p className="truncate text-base font-semibold text-muted-foreground">쿠팡 로켓와우 멤버십 첫 달 무료</p>
              <span className="flex shrink-0 items-center gap-0.5 rounded-full bg-muted px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
                <Eye className="size-2.5" />봤어요
              </span>
            </div>
          }
        />
      </CardList>
    ),
  },
];

/* ═══════════════════════════════════════════════════════════ */

export default function ClickedStatePage() {
  const [selected, setSelected] = useState<string | null>(null);

  const ALL = [...B_VARIANTS, ...C_VARIANTS];
  const BASE_RENDER = () => <CardList><Card /></CardList>;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <h1 className="mb-2 text-2xl font-bold">isClicked 디자인 비교</h1>
        <p className="mb-2 text-sm text-muted-foreground">
          각 버전에서 첫 번째 카드 = isClicked, 두 번째 카드 = 일반
        </p>
        <p className="mb-8 text-xs text-muted-foreground">
          B 계열 = 투명도/흑백 기반 · C 계열 = 썸네일 오버레이 + 타이틀 표시
        </p>

        {/* 나란히 비교 */}
        {selected && (
          <div className="mb-10 rounded-xl border-2 border-primary/30 bg-primary/5 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-primary">기준 vs {selected}</h2>
              <button onClick={() => setSelected(null)} className="rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted">닫기</button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">기준 (isClicked=false)</p>
                {BASE_RENDER()}
              </div>
              <div>
                <p className="mb-2 text-xs font-medium text-primary">{selected}</p>
                {ALL.find((v) => v.name === selected)?.render()}
              </div>
            </div>
          </div>
        )}

        {/* B 계열 */}
        <h2 className="mb-6 text-lg font-bold">B 계열 — 투명도 / 흑백</h2>
        <div className="mb-12 grid grid-cols-1 gap-10 lg:grid-cols-2">
          {B_VARIANTS.map(({ name, desc, render }) => (
            <section key={name}>
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-7 items-center justify-center rounded-full bg-blue-500 px-2.5 text-xs font-bold text-white">{name}</span>
                <h3 className="text-sm font-semibold">{desc}</h3>
                <button onClick={() => setSelected(name)} className="ml-auto rounded-md border border-primary/30 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/10">비교</button>
              </div>
              {render()}
            </section>
          ))}
        </div>

        {/* C 계열 */}
        <h2 className="mb-6 text-lg font-bold">C 계열 — 썸네일 오버레이 + 타이틀 표시</h2>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {C_VARIANTS.map(({ name, desc, render }) => (
            <section key={name}>
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-7 items-center justify-center rounded-full bg-violet-500 px-2.5 text-xs font-bold text-white">{name}</span>
                <h3 className="text-sm font-semibold">{desc}</h3>
                <button onClick={() => setSelected(name)} className="ml-auto rounded-md border border-primary/30 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/10">비교</button>
              </div>
              {render()}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
