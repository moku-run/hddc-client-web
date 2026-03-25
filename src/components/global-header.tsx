"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { ThemeToggle } from "@/components/theme-toggle";
import { SignOut, Palette, LinkSimple, GearSix } from "@phosphor-icons/react";

export function GlobalHeader() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAuthed(!!localStorage.getItem("hddc-auth"));
  }, []);

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  function handleLogout() {
    localStorage.removeItem("hddc-auth");
    localStorage.removeItem("hddc-user");
    setMenuOpen(false);
    router.push("/auth/login");
  }

  let nickname = "";
  try {
    const raw = localStorage.getItem("hddc-user");
    if (raw) nickname = JSON.parse(raw).nickname ?? "";
  } catch { /* ignore */ }
  const initial = nickname ? nickname.charAt(0).toUpperCase() : "U";

  return (
    <SiteHeader
      userMenu={
        authed ? (
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/edit"
              className="hidden items-center gap-1.5 rounded-full border border-primary/30 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10 sm:flex"
            >
              <Palette className="size-3.5" />프로필 꾸미기
            </Link>
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
              >
                {initial}
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-40 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
                  <div className="py-1">
                    <Link
                      href="/dashboard/edit"
                      onClick={() => setMenuOpen(false)}
                      className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-foreground transition-colors hover:bg-muted sm:hidden"
                    >
                      <Palette className="size-3.5 text-muted-foreground" />프로필 꾸미기
                    </Link>
                    <Link
                      href={`/${nickname || "me"}`}
                      onClick={() => setMenuOpen(false)}
                      className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-foreground transition-colors hover:bg-muted"
                    >
                      <LinkSimple className="size-3.5 text-muted-foreground" />내 프로필 보기
                    </Link>
                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-foreground transition-colors hover:bg-muted"
                    >
                      <GearSix className="size-3.5 text-muted-foreground" />설정
                    </Link>
                  </div>
                  <div className="border-t border-border py-1">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-red-500 transition-colors hover:bg-muted"
                    >
                      <SignOut className="size-3.5" />로그아웃
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <Link
            href="/auth/login"
            className="rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground"
          >
            시작하기
          </Link>
        )
      }
    >
      <ThemeToggle />
    </SiteHeader>
  );
}
