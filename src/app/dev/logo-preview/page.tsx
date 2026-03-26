"use client";

import { Moon, Palette } from "@phosphor-icons/react";

/* ─── Fire Logo SVG ─── */

function FireLogo({ className, bgColor = "var(--background)" }: { className?: string; bgColor?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" className={className}>
      <path d="M128,240a80,80,0,0,1-80-80c0-40,24-72,40-92l28,28,24-64C156,44,208,88,208,160A80,80,0,0,1,128,240Z" />
      <path d="M128,240a40,40,0,0,1-40-40c0-20,12-36,20-46l14,14,12-32c8,6,34,28,34,64A40,40,0,0,1,128,240Z" fill={bgColor} />
    </svg>
  );
}

/* ─── Header variants ─── */

function HeaderA() {
  return (
    <header className="bg-background/50 shadow-md backdrop-blur-xl">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <FireLogo className="size-6 text-red-500" />
          <span className="text-lg font-bold tracking-tight">핫딜닷쿨</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-full p-2 text-muted-foreground"><Moon className="size-4" /></button>
          <button className="rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground">시작하기</button>
        </div>
      </nav>
    </header>
  );
}

function HeaderB() {
  return (
    <header className="bg-background/50 shadow-md backdrop-blur-xl">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-1.5">
          <FireLogo className="size-5 text-orange-500" />
          <span className="text-lg font-bold tracking-tight">핫딜닷쿨</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-full p-2 text-muted-foreground"><Moon className="size-4" /></button>
          <button className="rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground">시작하기</button>
        </div>
      </nav>
    </header>
  );
}

function HeaderC() {
  return (
    <header className="bg-background/50 shadow-md backdrop-blur-xl">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-orange-500">
            <FireLogo className="size-4 text-white" bgColor="white" />
          </div>
          <span className="text-lg font-bold tracking-tight">핫딜닷쿨</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-full p-2 text-muted-foreground"><Moon className="size-4" /></button>
          <button className="rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground">시작하기</button>
        </div>
      </nav>
    </header>
  );
}

function HeaderD() {
  return (
    <header className="bg-background/50 shadow-md backdrop-blur-xl">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-full bg-red-500">
            <FireLogo className="size-4 text-white" bgColor="white" />
          </div>
          <span className="text-lg font-bold tracking-tight">핫딜닷쿨</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-full p-2 text-muted-foreground"><Moon className="size-4" /></button>
          <button className="rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground">시작하기</button>
        </div>
      </nav>
    </header>
  );
}

function HeaderE() {
  return (
    <header className="bg-background/50 shadow-md backdrop-blur-xl">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-0">
          <FireLogo className="-mr-0.5 size-7 text-red-500" />
          <span className="text-lg font-bold tracking-tight">핫딜닷쿨</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-full p-2 text-muted-foreground"><Moon className="size-4" /></button>
          <button className="hidden items-center gap-1.5 rounded-full border border-primary/30 px-3 py-1.5 text-xs font-medium text-primary sm:flex"><Palette className="size-3.5" />프로필 꾸미기</button>
          <button className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">K</button>
        </div>
      </nav>
    </header>
  );
}

function HeaderF() {
  return (
    <header className="bg-background/50 shadow-md backdrop-blur-xl">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-orange-500">
            <FireLogo className="size-4 text-white" bgColor="white" />
          </div>
          <span className="text-lg font-bold tracking-tight">핫딜닷쿨</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-full p-2 text-muted-foreground"><Moon className="size-4" /></button>
          <button className="hidden items-center gap-1.5 rounded-full border border-primary/30 px-3 py-1.5 text-xs font-medium text-primary sm:flex"><Palette className="size-3.5" />프로필 꾸미기</button>
          <button className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">K</button>
        </div>
      </nav>
    </header>
  );
}

/* ─── Fake content ─── */

function FakeContent() {
  return (
    <div className="bg-background px-6 py-6">
      <div className="mx-auto flex max-w-3xl flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex overflow-hidden rounded-r-xl bg-card shadow-md">
            <div className="w-24 shrink-0 self-stretch bg-foreground text-sm font-bold text-background flex items-center justify-center">핫딜닷쿨</div>
            <div className="flex-1 px-3 py-2.5">
              <div className="h-3 w-3/4 rounded bg-muted" />
              <div className="mt-2 h-3 w-1/2 rounded bg-muted" />
              <div className="mt-2 h-2 w-full rounded bg-muted/50" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Page ─── */

const STYLES = [
  { name: "A", label: "로고 아이콘 (빨간, size-6) + 텍스트 — 비로그인", Component: HeaderA },
  { name: "B", label: "로고 아이콘 (주황, size-5) + 텍스트 — 비로그인", Component: HeaderB },
  { name: "C", label: "그라데이션 사각 배경 + 흰색 아이콘 — 비로그인", Component: HeaderC },
  { name: "D", label: "빨간 원형 배경 + 흰색 아이콘 — 비로그인", Component: HeaderD },
  { name: "E", label: "로고 아이콘 텍스트에 딱 붙임 — 로그인 상태", Component: HeaderE },
  { name: "F", label: "그라데이션 사각 + 텍스트 — 로그인 상태", Component: HeaderF },
];

export default function LogoPreviewPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <h1 className="mb-2 text-2xl font-bold">로고 프리뷰 — 핫딜 페이지</h1>
        <p className="mb-8 text-sm text-muted-foreground">
          커스텀 Fire 로고 SVG를 헤더에 적용한 모습. 비로그인/로그인 상태 모두 포함.
        </p>

        {STYLES.map(({ name, label, Component }) => (
          <section key={name} className="mb-10">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{name}</span>
              <h2 className="text-sm font-semibold">{label}</h2>
            </div>
            <div className="overflow-hidden rounded-xl border border-border">
              <Component />
              <FakeContent />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
