"use client";

import { useState } from "react";
import { Fire, MagnifyingGlass, X, SlidersHorizontal } from "@phosphor-icons/react";
import { ToggleGroup, type ToggleGroupOption } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

const SORT_OPTIONS: ToggleGroupOption<string>[] = [
  { value: "latest", label: "최신순" },
  { value: "popular", label: "인기순" },
];

/* ═══════════════════════════════════════════════════════════
   A: 현재 — 2줄 (제목+정렬 / 검색)
   ═══════════════════════════════════════════════════════════ */

function StyleA() {
  const [sort, setSort] = useState("latest");
  const [q, setQ] = useState("");
  return (
    <div className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-2 px-3 py-2.5 sm:gap-3 sm:px-6 sm:py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex shrink-0 items-center gap-2">
            <Fire className="size-5 text-red-500" weight="fill" />
            <h1 className="text-base font-bold tracking-tight sm:text-lg">핫딜</h1>
          </div>
          <ToggleGroup variant="pill" size="sm" value={sort} onValueChange={setSort} options={SORT_OPTIONS} />
        </div>
        <div className="relative">
          <MagnifyingGlass className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text" placeholder="상품명, 판매처로 검색..." value={q} onChange={(e) => setQ(e.target.value)}
            className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-9 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
          {q && <button onClick={() => setQ("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="size-4" /></button>}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   B: 1줄 — 제목 + 검색 + 정렬 한 줄
   ═══════════════════════════════════════════════════════════ */

function StyleB() {
  const [sort, setSort] = useState("latest");
  const [q, setQ] = useState("");
  return (
    <div className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-3xl items-center gap-2 px-3 py-2 sm:gap-3 sm:px-6">
        <div className="flex shrink-0 items-center gap-1.5">
          <Fire className="size-4 text-red-500" weight="fill" />
          <h1 className="text-sm font-bold tracking-tight">핫딜</h1>
        </div>
        <div className="relative flex-1">
          <MagnifyingGlass className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text" placeholder="검색..." value={q} onChange={(e) => setQ(e.target.value)}
            className="h-8 w-full rounded-lg border border-border bg-background pl-8 pr-8 text-xs outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
          {q && <button onClick={() => setQ("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="size-3.5" /></button>}
        </div>
        <ToggleGroup variant="pill" size="sm" value={sort} onValueChange={setSort} options={SORT_OPTIONS} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   C: 1줄 — 검색 확장형 (돋보기 클릭 시 확장)
   ═══════════════════════════════════════════════════════════ */

function StyleC() {
  const [sort, setSort] = useState("latest");
  const [q, setQ] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  return (
    <div className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-3xl items-center gap-2 px-3 py-2 sm:gap-3 sm:px-6">
        {searchOpen ? (
          <>
            <div className="relative flex-1">
              <MagnifyingGlass className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text" placeholder="상품명, 판매처로 검색..." value={q} onChange={(e) => setQ(e.target.value)} autoFocus
                className="h-8 w-full rounded-lg border border-border bg-background pl-8 pr-8 text-xs outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <button onClick={() => { setSearchOpen(false); setQ(""); }} className="shrink-0 text-xs text-muted-foreground hover:text-foreground">취소</button>
          </>
        ) : (
          <>
            <div className="flex shrink-0 items-center gap-1.5">
              <Fire className="size-4 text-red-500" weight="fill" />
              <h1 className="text-sm font-bold tracking-tight">핫딜</h1>
            </div>
            <div className="flex-1" />
            <ToggleGroup variant="pill" size="sm" value={sort} onValueChange={setSort} options={SORT_OPTIONS} />
            <button onClick={() => setSearchOpen(true)} className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <MagnifyingGlass className="size-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   D: 1줄 — 정렬을 검색 안에 통합
   ═══════════════════════════════════════════════════════════ */

function StyleD() {
  const [sort, setSort] = useState("latest");
  const [q, setQ] = useState("");
  return (
    <div className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-3xl items-center gap-2 px-3 py-2 sm:gap-3 sm:px-6">
        <div className="flex shrink-0 items-center gap-1.5">
          <Fire className="size-4 text-red-500" weight="fill" />
          <h1 className="text-sm font-bold tracking-tight">핫딜</h1>
        </div>
        <div className="relative flex-1">
          <MagnifyingGlass className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text" placeholder="검색..." value={q} onChange={(e) => setQ(e.target.value)}
            className="h-8 w-full rounded-lg border border-border bg-background pl-8 pr-20 text-xs outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
          <div className="absolute right-1 top-1/2 -translate-y-1/2">
            <select
              value={sort} onChange={(e) => setSort(e.target.value)}
              className="h-6 cursor-pointer rounded-md bg-muted px-2 text-[10px] font-medium text-muted-foreground outline-none"
            >
              <option value="latest">최신순</option>
              <option value="popular">인기순</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   E: 1줄 컴팩트 — 제목 제거, 검색 + 정렬만
   ═══════════════════════════════════════════════════════════ */

function StyleE() {
  const [sort, setSort] = useState("latest");
  const [q, setQ] = useState("");
  return (
    <div className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-3xl items-center gap-2 px-3 py-1.5 sm:px-6">
        <Fire className="size-4 shrink-0 text-red-500" weight="fill" />
        <div className="relative flex-1">
          <MagnifyingGlass className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text" placeholder="상품명, 판매처로 검색..." value={q} onChange={(e) => setQ(e.target.value)}
            className="h-7 w-full rounded-md border border-border bg-background pl-8 pr-8 text-[11px] outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/30"
          />
          {q && <button onClick={() => setQ("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="size-3" /></button>}
        </div>
        <ToggleGroup variant="pill" size="sm" value={sort} onValueChange={setSort} options={SORT_OPTIONS} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */

const STYLES = [
  { name: "A", label: "현재 — 2줄", desc: "제목+정렬 / 검색 각각 한 줄", Component: StyleA },
  { name: "B", label: "1줄 통합", desc: "제목 + 검색 + 정렬 한 줄. 검색창 항상 표시", Component: StyleB },
  { name: "C", label: "1줄 검색 확장", desc: "평소에는 제목+정렬. 돋보기 클릭 시 검색창 확장", Component: StyleC },
  { name: "D", label: "1줄 정렬 내장", desc: "검색창 안에 정렬 드롭다운 통합", Component: StyleD },
  { name: "E", label: "1줄 미니멀", desc: "제목 제거. 아이콘 + 검색 + 정렬만. 최소 높이", Component: StyleE },
];

export default function SearchBarPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold">검색바 레이아웃 비교</h1>
      <p className="mb-8 text-sm text-muted-foreground">핫딜 피드 상단 컨트롤바 높이를 줄이는 여러 방식입니다.</p>

      {STYLES.map(({ name, label, desc, Component }) => (
        <section key={name} className="mb-10">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{name}</span>
            <div>
              <p className="text-sm font-semibold">{label}</p>
              <p className="text-[10px] text-muted-foreground">{desc}</p>
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border border-border">
            <Component />
            <div className="p-4 text-center text-xs text-muted-foreground">← 아래에 딜 카드 피드 →</div>
          </div>
        </section>
      ))}
    </div>
  );
}
