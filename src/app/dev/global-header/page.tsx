"use client";

import { useState } from "react";
import { SignOut, Moon, Sun, User, Palette, LinkSimple, GearSix, CaretDown } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/* ─── State toggle ─── */

function AuthToggle({ authed, setAuthed }: { authed: boolean; setAuthed: (v: boolean) => void }) {
  return (
    <div className="mb-6 flex items-center gap-2">
      <span className="text-xs text-muted-foreground">상태:</span>
      <button onClick={() => setAuthed(false)} className={cn("rounded-full px-3 py-1 text-xs font-medium transition-colors", !authed ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>비로그인</button>
      <button onClick={() => setAuthed(true)} className={cn("rounded-full px-3 py-1 text-xs font-medium transition-colors", authed ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>로그인</button>
    </div>
  );
}

function ThemeBtn() {
  const [dark, setDark] = useState(false);
  return (
    <button onClick={() => setDark(!dark)} className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground">
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════
   A1: 로그인 시 "내 프로필" 텍스트 링크 + 아바타
   ═══════════════════════════════════════════════════════════ */

function StyleA1({ authed }: { authed: boolean }) {
  return (
    <header className="border-b border-white/10 bg-background/50 backdrop-blur-xl">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <span className="text-lg font-bold tracking-tight">핫딜닷쿨</span>
        <div className="flex items-center gap-1">
          <ThemeBtn />
          {authed ? (
            <div className="flex items-center gap-2">
              <button className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">내 프로필</button>
              <button className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">K</button>
            </div>
          ) : (
            <button className="rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground">시작하기</button>
          )}
        </div>
      </nav>
    </header>
  );
}

/* ═══════════════════════════════════════════════════════════
   A2: 로그인 시 "프로필 꾸미기" CTA 버튼 + 아바타
   ═══════════════════════════════════════════════════════════ */

function StyleA2({ authed }: { authed: boolean }) {
  return (
    <header className="border-b border-white/10 bg-background/50 backdrop-blur-xl">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <span className="text-lg font-bold tracking-tight">핫딜닷쿨</span>
        <div className="flex items-center gap-1">
          <ThemeBtn />
          {authed ? (
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20">
                <Palette className="size-3.5" />프로필 꾸미기
              </button>
              <button className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">K</button>
            </div>
          ) : (
            <button className="rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground">시작하기</button>
          )}
        </div>
      </nav>
    </header>
  );
}

/* ═══════════════════════════════════════════════════════════
   A3: 로그인 시 아바타 드롭다운 메뉴 (펼침 시뮬레이션)
   ═══════════════════════════════════════════════════════════ */

function StyleA3({ authed }: { authed: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="relative border-b border-white/10 bg-background/50 backdrop-blur-xl">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <span className="text-lg font-bold tracking-tight">핫딜닷쿨</span>
        <div className="flex items-center gap-1">
          <ThemeBtn />
          {authed ? (
            <div className="relative">
              <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 transition-colors hover:bg-white/15">
                <div className="flex size-6 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">K</div>
                <CaretDown className={cn("size-3 text-muted-foreground transition-transform", menuOpen && "rotate-180")} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
                  <div className="border-b border-border px-3 py-2.5">
                    <p className="text-sm font-semibold">kiduck</p>
                    <p className="text-[11px] text-muted-foreground">@kiduck</p>
                  </div>
                  <div className="py-1">
                    <button className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-foreground transition-colors hover:bg-muted">
                      <Palette className="size-3.5 text-muted-foreground" />프로필 꾸미기
                    </button>
                    <button className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-foreground transition-colors hover:bg-muted">
                      <LinkSimple className="size-3.5 text-muted-foreground" />내 프로필 보기
                    </button>
                    <button className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-foreground transition-colors hover:bg-muted">
                      <GearSix className="size-3.5 text-muted-foreground" />설정
                    </button>
                  </div>
                  <div className="border-t border-border py-1">
                    <button className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-red-500 transition-colors hover:bg-muted">
                      <SignOut className="size-3.5" />로그아웃
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button className="rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground">시작하기</button>
          )}
        </div>
      </nav>
    </header>
  );
}

/* ═══════════════════════════════════════════════════════════
   A4: 로그인 시 네비 탭 추가 (핫딜 / 내 프로필)
   ═══════════════════════════════════════════════════════════ */

function StyleA4({ authed }: { authed: boolean }) {
  return (
    <header className="border-b border-white/10 bg-background/50 backdrop-blur-xl">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <span className="text-lg font-bold tracking-tight">핫딜닷쿨</span>
          {authed && (
            <div className="hidden items-center gap-1 sm:flex">
              <button className="rounded-md px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-white/10">핫딜</button>
              <button className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground">내 프로필</button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <ThemeBtn />
          {authed ? (
            <button className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">K</button>
          ) : (
            <button className="rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground">시작하기</button>
          )}
        </div>
      </nav>
    </header>
  );
}

/* ═══════════════════════════════════════════════════════════
   A5: 로그인 시 "프로필 꾸미기" pill + 아바타 드롭다운
   ═══════════════════════════════════════════════════════════ */

function StyleA5({ authed }: { authed: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="relative border-b border-white/10 bg-background/50 backdrop-blur-xl">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <span className="text-lg font-bold tracking-tight">핫딜닷쿨</span>
        <div className="flex items-center gap-2">
          <ThemeBtn />
          {authed ? (
            <>
              <button className="hidden items-center gap-1.5 rounded-full border border-primary/30 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10 sm:flex">
                <Palette className="size-3.5" />프로필 꾸미기
              </button>
              <div className="relative">
                <button onClick={() => setMenuOpen(!menuOpen)} className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">K</button>
                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-40 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
                    <div className="py-1">
                      <button className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-foreground transition-colors hover:bg-muted sm:hidden">
                        <Palette className="size-3.5 text-muted-foreground" />프로필 꾸미기
                      </button>
                      <button className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-foreground transition-colors hover:bg-muted">
                        <LinkSimple className="size-3.5 text-muted-foreground" />내 프로필 보기
                      </button>
                      <button className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-foreground transition-colors hover:bg-muted">
                        <GearSix className="size-3.5 text-muted-foreground" />설정
                      </button>
                    </div>
                    <div className="border-t border-border py-1">
                      <button className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-red-500 transition-colors hover:bg-muted">
                        <SignOut className="size-3.5" />로그아웃
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button className="rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground">시작하기</button>
          )}
        </div>
      </nav>
    </header>
  );
}

/* ═══════════════════════════════════════════════════════════
   Page
   ═══════════════════════════════════════════════════════════ */

const STYLES = [
  { name: "A1", label: "\"내 프로필\" 텍스트 링크 + 아바타", Component: StyleA1 },
  { name: "A2", label: "\"프로필 꾸미기\" CTA 버튼 + 아바타", Component: StyleA2 },
  { name: "A3", label: "아바타 드롭다운 메뉴 (클릭해서 확인)", Component: StyleA3 },
  { name: "A4", label: "네비 탭 (핫딜 / 내 프로필) + 아바타", Component: StyleA4 },
  { name: "A5", label: "\"프로필 꾸미기\" pill + 아바타 드롭다운", Component: StyleA5 },
];

export default function GlobalHeaderPage() {
  const [authed, setAuthed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <h1 className="mb-2 text-2xl font-bold">Global Header — 로그인 메뉴 비교</h1>
        <p className="mb-4 text-sm text-muted-foreground">
          베이스: Style A (반투명 + 테마토글 + 시작하기). 로그인 시 프로필 관련 메뉴가 어떻게 추가되는지 비교.
        </p>
        <AuthToggle authed={authed} setAuthed={setAuthed} />

        {STYLES.map(({ name, label, Component }) => (
          <section key={name} className="mb-10">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-7 items-center justify-center rounded-full bg-primary px-2.5 text-xs font-bold text-primary-foreground">{name}</span>
              <h2 className="text-sm font-semibold">{label}</h2>
            </div>
            <div className="overflow-hidden rounded-xl border border-border">
              <Component authed={authed} />
              <div className="bg-background px-6 py-8">
                <div className="mx-auto flex max-w-3xl flex-col gap-3">
                  <div className="h-20 rounded-lg bg-muted/50" />
                  <div className="h-20 rounded-lg bg-muted/50" />
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
