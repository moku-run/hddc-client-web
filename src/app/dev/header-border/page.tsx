"use client";

import { Moon, Palette } from "@phosphor-icons/react";

/* ─── Shared header content ─── */

function HeaderContent() {
  return (
    <>
      <span className="text-lg font-bold tracking-tight">핫딜닷쿨</span>
      <div className="flex items-center gap-2">
        <button className="rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground"><Moon className="size-4" /></button>
        <button className="hidden items-center gap-1.5 rounded-full border border-primary/30 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10 sm:flex">
          <Palette className="size-3.5" />프로필 꾸미기
        </button>
        <button className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">K</button>
      </div>
    </>
  );
}

function FakeContent() {
  return (
    <div className="bg-background px-6 py-6">
      <div className="mx-auto flex max-w-3xl flex-col gap-3">
        <div className="h-16 rounded-lg bg-muted/50" />
        <div className="h-16 rounded-lg bg-muted/50" />
        <div className="h-16 rounded-lg bg-muted/50" />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */

function StyleA() {
  return (
    <header className="bg-background/50 backdrop-blur-xl border-b border-white/10">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <HeaderContent />
      </nav>
    </header>
  );
}

function StyleB() {
  return (
    <header className="bg-background/50 backdrop-blur-xl border-b border-border/50">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <HeaderContent />
      </nav>
    </header>
  );
}

function StyleC() {
  return (
    <header className="bg-background/50 backdrop-blur-xl border-b border-border">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <HeaderContent />
      </nav>
    </header>
  );
}

function StyleD() {
  return (
    <header className="bg-background/50 shadow-sm backdrop-blur-xl">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <HeaderContent />
      </nav>
    </header>
  );
}

function StyleE() {
  return (
    <header className="bg-background/50 shadow-md backdrop-blur-xl">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <HeaderContent />
      </nav>
    </header>
  );
}

function StyleF() {
  return (
    <header className="bg-background/50 border-b border-border/30 shadow-sm backdrop-blur-xl">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <HeaderContent />
      </nav>
    </header>
  );
}

function StyleG() {
  return (
    <header className="bg-background/50 backdrop-blur-xl">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <HeaderContent />
      </nav>
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </header>
  );
}

function StyleH() {
  return (
    <header className="bg-background/50 backdrop-blur-xl">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <HeaderContent />
      </nav>
      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </header>
  );
}

/* ═══════════════════════════════════════════════════════════ */

const STYLES = [
  { name: "A", label: "현재 — border-white/10 (거의 안 보임)", Component: StyleA },
  { name: "B", label: "border-border/50 — 테마 따라가는 반투명 border", Component: StyleB },
  { name: "C", label: "border-border — 기존 불투명 border", Component: StyleC },
  { name: "D", label: "shadow-sm — border 없이 가벼운 그림자", Component: StyleD },
  { name: "E", label: "shadow-md — border 없이 뚜렷한 그림자", Component: StyleE },
  { name: "F", label: "border-border/30 + shadow-sm — 둘 다", Component: StyleF },
  { name: "G", label: "gradient line — 중앙만 보이는 border", Component: StyleG },
  { name: "H", label: "gradient line (primary) — 포인트 컬러", Component: StyleH },
];

export default function HeaderBorderPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <h1 className="mb-2 text-2xl font-bold">헤더 경계선 비교</h1>
        <p className="mb-8 text-sm text-muted-foreground">
          반투명 헤더에서 콘텐츠와의 경계를 어떻게 표현하는지 비교합니다.
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
